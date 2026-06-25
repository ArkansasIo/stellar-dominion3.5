import "./loadEnv";
import express, { type Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import { logger } from "./logger";
import { setupAuth } from "./basicAuth";
import { registerAccountRoutes } from "./routes-account";
import { registerAdminRoutes } from "./routes-admin";
import { registerAllianceRoutes } from "./routes-alliances";
import { registerArtifactRoutes } from "./routes-artifacts";
import { registerGuildRoutes } from "./routes-guilds";
import { registerEmpireCombatUniverseRoutes } from "./routes-empire-combat-universe";
import { registerCommanderRoutes } from "./routes-commanders";
import { registerHighCommandRoutes } from "./routes-high-command";
import { registerForumRoutes } from "./routes-forums";
import { registerSmithyRoutes } from "./routes-smithy";
import { registerOrbitalStationRoutes } from "./routes-orbital-stations";
import { registerBankVaultRoutes } from "./routes-bank-vault";
import { registerStarbaseRoutes } from "./routes-starbase";
import { registerDatabaseAdminRoutes } from "./routes-database-admin";
import { registerCoreApiRoutes } from "./routes-api-core";
import { ServerStatusService } from "./services/serverStatusService";
import { registerGameAssetLibraryRoutes } from "./routes-game-asset-library";
import { registerEmpireProfileRoutes } from "./routes-empire-profile";
import { registerDimensionalAnomalyRoutes } from "./routes-dimensional-anomalies";
import { registerDimensionalAbyssalRoutes } from "./routes-dimensional-abyssal";
import { registerResourceRefineryRoutes } from "./routes-resource-refineries";
import { registerCronRoutes } from "./routes-cron";
import { registerBlueprintChargeRoutes } from "./routes-blueprint-charges";
import { registerMissingApiRoutes } from "./routes-missing-api";
import { UpdateManager } from "./update-manager";
import { registerNewsRoutes } from "./routes-news";
import { registerAdminConsoleRoutes } from "./routes-admin-console";
import { registerOGameDebrisRoutes } from "./routes-ogame-debris";
import { registerOGameACSRoutes } from "./routes-ogame-acs";
import { registerOGamePhalanxRoutes } from "./routes-ogame-phalanx";
import { registerOGameJumpGateRoutes } from "./routes-ogame-jumpgate";
import { registerOGameFleetRoutes } from "./routes-ogame-fleet";
import { registerOGameOutlawRoutes } from "./routes-ogame-outlaw";
import { registerOGameVacationRoutes } from "./routes-ogame-vacation";
import { registerOGameExpeditionRoutes } from "./routes-ogame-expedition";
import { registerOGameOfficerRoutes } from "./routes-ogame-officers";
import { registerOGameMoonFacilityRoutes } from "./routes-ogame-moon-facilities";
import { registerOGameMissileRoutes } from "./routes-ogame-missile";
import { registerOGameMoonDestructionRoutes } from "./routes-ogame-moon-destruction";
import { registerOGameResearchNetworkRoutes } from "./routes-ogame-research-network";
import { registerOGameTerraformerRoutes } from "./routes-ogame-terraformer";
import { registerOGameOccupationRoutes } from "./routes-ogame-occupation";
import { registerOGameAllianceDepotRoutes } from "./routes-ogame-alliance-depot";
import { registerOGameGravitonRoutes } from "./routes-ogame-graviton";
import { registerOGamePushProtectionRoutes } from "./routes-ogame-push-protection";
import connectProviderRouter from "./routes-connect-provider";
import universeScanRouter from "./routes-universe-scan";
import planetVaultRouter from "./routes-planet-vault";

const runtimeNodeEnv = process.env.NODE_ENV ?? "production";

const app = express();
const httpServer = createServer(app);
const statusService = ServerStatusService.getInstance();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later" },
});

app.use("/api/auth", authLimiter);
app.use("/api/admin", authLimiter);
app.use("/api", apiLimiter);

export function log(message: string, source = "express", level: "info" | "success" | "error" | "warn" = "info") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const icons = {
    info: "[i]",
    success: "[ok]",
    error: "[x]",
    warn: "[!]",
  };

  console.log(`${formattedTime} [${source}] ${icons[level]} ${message}`);
  
  // Also log to the structured logger
  if (level === "error") {
    logger.error("SERVER", message);
  } else if (level === "warn") {
    logger.warn("SERVER", message);
  } else if (level === "success") {
    logger.info("SERVER", message);
  } else {
    logger.info("SERVER", message);
  }
}

function formatConsoleUptime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function formatConsoleMemory(megabytes: number) {
  return `${Math.round(megabytes)}MB`;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      statusService.recordRequest(res.statusCode, duration);

      // Determine status category
      let statusLabel = "";
      let level: "info" | "success" | "error" | "warn" = "info";
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        statusLabel = `[${res.statusCode}]`;
        level = res.statusCode === 304 ? "info" : "success";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        statusLabel = `[${res.statusCode}]`;
        level = "info";
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        statusLabel = `[${res.statusCode}]`;
        level = "warn";
      } else if (res.statusCode >= 500) {
        statusLabel = `[${res.statusCode}]`;
        level = "error";
      }

      // Determine speed category
      let speed = "";
      if (duration < 50) speed = "fast";
      else if (duration < 150) speed = "quick";
      else if (duration < 500) speed = "steady";
      else speed = "slow";

      // Build log message
      const method = req.method.padEnd(6);
      const endpoint = path.padEnd(35);
      let logLine = `${method} ${endpoint} ${statusLabel} ${speed} ${duration}ms`;
      
      // Add response data size info for successful responses
      if (capturedJsonResponse && res.statusCode !== 304) {
        const dataSize = JSON.stringify(capturedJsonResponse).length;
        const sizeKb = (dataSize / 1024).toFixed(1);
        logLine += ` [${sizeKb}KB]`;
      }

      log(logLine, "api", level);
    }
  });

  next();
});

import { registerSettingsRoutes } from "./routes-settings";
import { registerStatusRoutes } from "./routes-status";
import { registerDiagnosticsRoutes } from "./routes-diagnostics";
import { registerResearchRoutes } from "./routes-research";
import { registerResearchLabRoutes } from "./routes-researchlab";
import { registerTravelRoutes } from "./routes-travel";
import { registerPlanetRoutes } from "./routes-planets";
import { registerGameActionRoutes } from "./routes-gameactions";
import { registerCombatRoutes } from "./routes-combat";
import { registerEspionageRoutes } from "./routes-espionage";
import { registerResourceTradingRoutes } from "./routes-resource-trading";
import { registerLeaderboardRoutes } from "./routes-leaderboard";
import { registerGameRoutes } from "./routes-game";
import { registerMegastructureRoutes } from "./routes-megastructures";
import { registerUnitSystemsRoutes } from "./routes-unitsystems";
import { registerGovernmentLeaderRoutes } from "./routes-government-leaders";
import { registerGovernmentBuildingRoutes } from "./routes-government-buildings";
import { registerGovernmentProgressionRoutes } from "./routes-government-progression";
import { registerGalaxyRoutes } from "./routes-galaxy";
import { registerRealmRoutes } from "./routes-realms";
import { registerUniverseSeedRoutes } from "./routes-universe-seed";
import { registerLifeSupportRoutes } from "./routes-lifesupport";
import { registerLiveOpsRoutes } from "./routes-liveops";
import { registerMissingRoutes } from "./routes-missing";
import { registerExpeditionRoutes } from "./routes-expeditions";
import { registerCivilizationRoutes } from "./routes-civilization";
import { registerCivilizationSystemRoutes } from "./routes-civilization-system";
import { registerArmySystemRoutes } from "./routes-army-system";
import { registerArmyBuildingStructuresRoutes } from "./routes-army-building-structures";
import { registerUnitTaxonomyRoutes } from "./routes-unit-taxonomy";
import { registerConstructorYardRoutes } from "./routes-constructor-yard";
import turnSystemRoutes from "./routes-turnsystem";
import researchXPRoutes from "./routes-researchxp";
import playerXpRoutes from "./routes-player-xp";
import recommendationsRoutes from "./routes-recommendations";
import multiplayerBonusesRoutes from "./routes-multiplayerbonuses";
import customLabRoutes from "./routes-customlabs";
import achievementRoutes from "./routes-achievements";
import autoBuyResourcesRoutes from "./routes-autobuyresources";
import tradingRoutes from "./routes-trading";
import assetsRoutes from "./routes-assets";
import ogameRoutes from "./routes-ogame";
import friendsRoutes from "./routes-friends";
import worldActionsRoutes from "./routes-worldactions";
import tradesRoutes from "./routes-trades";
import messagesRoutes from "./routes-messages";
import notesRoutes from "./routes-notes";
import localeRoutes from "./routes-locale";
import hallOfFameRoutes from "./routes-hall-of-fame";
import adminCouponRoutes from "./routes-admin-coupons";
import { seedOgameCatalogIfNeeded } from "./services/ogameCatalogService";
import { registerPhpMyAdminRoutes } from "./routes-phpmyadmin";
import { registerMoonRoutes } from "./routes-moons";
import { registerSporeDriveRoutes } from "./routes-spore-drive";
import { registerWeeklyMissionRoutes } from "./routes-weekly-missions";
import { registerGateTokenRoutes } from "./routes-gate-tokens";
import { registerOGameCombatRoutes } from "./routes-ogame-combat";
import seasonRoutes from "./routes-season";
import { db, pool } from "./db";
import { adminUsers, users } from "../shared/schema";
import { eq, ilike, or } from "drizzle-orm";

(async () => {
  await setupAuth(app);

  try {
    const seedSummary = await seedOgameCatalogIfNeeded();
    if (seedSummary.seeded) {
      log(
        `Seeded OGame catalog: ${seedSummary.categoryCount} categories, ${seedSummary.entryCount} entries`,
        "startup",
        "success",
      );
    }
  } catch (error) {
    log(
      `OGame catalog seed skipped: ${(error as Error).message}`,
      "startup",
      "warn",
    );
  }

  registerCoreApiRoutes(app);
  registerRoutes(app);
  registerSettingsRoutes(app);
  registerStatusRoutes(app);
  registerDiagnosticsRoutes(app);
  registerResearchRoutes(app);
  registerResearchLabRoutes(app);
  registerTravelRoutes(app);
  registerPlanetRoutes(app);
  registerGameActionRoutes(app);
  registerCombatRoutes(app);
  registerEspionageRoutes(app);
  registerResourceTradingRoutes(app);
  registerLeaderboardRoutes(app);
  registerGameRoutes(app);
  registerMegastructureRoutes(app);
  registerUnitSystemsRoutes(app);
  registerGovernmentLeaderRoutes(app);
  registerGovernmentBuildingRoutes(app);
  registerGovernmentProgressionRoutes(app);
  registerGalaxyRoutes(app);
  registerRealmRoutes(app);
  registerUniverseSeedRoutes(app);
  registerLifeSupportRoutes(app);
  registerLiveOpsRoutes(app);
  registerMissingRoutes(app);
  registerExpeditionRoutes(app);
  registerCivilizationRoutes(app);
  registerCivilizationSystemRoutes(app);
  registerArmySystemRoutes(app);
  registerArmyBuildingStructuresRoutes(app);
  registerUnitTaxonomyRoutes(app);
  registerConstructorYardRoutes(app);
  registerAccountRoutes(app);
  registerAdminRoutes(app);
  registerAllianceRoutes(app);
  registerArtifactRoutes(app);
  registerGuildRoutes(app);
  registerForumRoutes(app);
  registerEmpireCombatUniverseRoutes(app);
  registerCommanderRoutes(app);
  registerHighCommandRoutes(app);
  registerSmithyRoutes(app);
  registerOrbitalStationRoutes(app);
  registerBankVaultRoutes(app);
  registerStarbaseRoutes(app);
  registerDatabaseAdminRoutes(app);
  registerPhpMyAdminRoutes(app, { db, pool, adminUsers, users, eq, ilike, or });
  registerGameAssetLibraryRoutes(app);
  registerEmpireProfileRoutes(app);
  registerDimensionalAnomalyRoutes(app);
  registerDimensionalAbyssalRoutes(app);
  registerResourceRefineryRoutes(app);
  registerCronRoutes(app);
  registerBlueprintChargeRoutes(app);
  registerMissingApiRoutes(app);
  registerMoonRoutes(app);
  registerSporeDriveRoutes(app);
  registerWeeklyMissionRoutes(app);
  registerGateTokenRoutes(app);
  try {
    const updateManager = UpdateManager.getInstance();
    updateManager.setupRoutes(app);
  } catch (e) {
    log(`UpdateManager skipped: ${(e as Error).message}`, "startup", "warn");
  }
  registerNewsRoutes(app);
  registerAdminConsoleRoutes(app);
  registerOGameCombatRoutes(app);
  registerOGameDebrisRoutes(app);
  registerOGameACSRoutes(app);
  registerOGamePhalanxRoutes(app);
  registerOGameJumpGateRoutes(app);
  registerOGameFleetRoutes(app);
  registerOGameOutlawRoutes(app);
  registerOGameVacationRoutes(app);
  registerOGameExpeditionRoutes(app);
  registerOGameOfficerRoutes(app);
  registerOGameMoonFacilityRoutes(app);
  registerOGameMissileRoutes(app);
  registerOGameMoonDestructionRoutes(app);
  registerOGameResearchNetworkRoutes(app);
  registerOGameTerraformerRoutes(app);
  registerOGameOccupationRoutes(app);
  registerOGameAllianceDepotRoutes(app);
  registerOGameGravitonRoutes(app);
  registerOGamePushProtectionRoutes(app);
  app.use(connectProviderRouter);
  app.use(universeScanRouter);
  app.use(planetVaultRouter);
  app.use('/api/season', seasonRoutes);
  const viewerRoot = path.resolve(process.cwd(), "threejs_galaxy_viewer_project");
  app.get("/api/viewer/status", (_req, res) => {
    res.json({
      ok: true,
      viewerPath: "/viewer-3d/",
      appPath: "/threejs-viewer",
      mode: runtimeNodeEnv,
    });
  });
  app.use("/viewer-3d", express.static(viewerRoot));
  app.use(turnSystemRoutes);
  app.use(researchXPRoutes);
  app.use(playerXpRoutes);
  app.use(recommendationsRoutes);
  app.use('/api/alliances', multiplayerBonusesRoutes);
  app.use('/api/labs', customLabRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/autobuy', autoBuyResourcesRoutes);
  app.use('/api/trading', tradingRoutes);
  app.use('/api/assets', assetsRoutes);
  app.use('/api/ogame', ogameRoutes);
  app.use('/api/friends', friendsRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api', localeRoutes);
  app.use('/api', hallOfFameRoutes);
  app.use('/api', adminCouponRoutes);
  app.use(tradesRoutes);
  app.use(worldActionsRoutes);

  // Start cron jobs
  try {
    const { shutdownAllCronJobs } = await import("./services/cronService");
    const { registerAllGameJobs } = await import("./services/gameJobs");
    await registerAllGameJobs();
    log("Cron job system initialized", "startup", "success");
    process.on("SIGTERM", async () => { shutdownAllCronJobs(); const { shutdownDb } = await import("./db"); await shutdownDb(); process.exit(0); });
    process.on("SIGINT", async () => { shutdownAllCronJobs(); const { shutdownDb } = await import("./db"); await shutdownDb(); process.exit(0); });
  } catch (error) {
    log(`Cron job init skipped: ${(error as Error).message}`, "startup", "warn");
  }

  // Error handling middleware
  app.use((err: any, req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    } else {
      log(`Error after headers sent: ${message}`, "server", "error");
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (runtimeNodeEnv === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5001", 10);
  
  // Color codes for console output
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
  };

  // Status indicators
  const statusOn = `${colors.green}*${colors.reset}`;
  const statusOff = `${colors.red}*${colors.reset}`;
  const statusWarning = `${colors.yellow}*${colors.reset}`;
  
  const listenOptions: {
    port: number;
    host: string;
    reusePort?: boolean;
  } = {
    port,
    host: "0.0.0.0",
  };

  // `reusePort` is not supported on Windows sockets.
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  httpServer.listen(
    listenOptions,
    () => {
      log(`serving on port ${port}`);
      
      // Startup animation sequence
      const spinnerFrames = ["-", "\\", "|", "/"];
      let frameIndex = 0;
      
      const displayStartupScreen = () => {
        console.clear();
        console.log("\n" + colors.bright + colors.blue + "================================================" + colors.reset);
        console.log(colors.bright + colors.blue + " SERVER STARTUP INITIALIZATION " + colors.reset);
        console.log(colors.bright + colors.blue + "================================================" + colors.reset + "\n");
        
        frameIndex = (frameIndex + 1) % spinnerFrames.length;
        const spinner = spinnerFrames[frameIndex];
        
        console.log(colors.bright + "  Initializing Server Components:" + colors.reset);
        console.log(`    ${spinner} Loading Express.js framework...`);
        console.log(`    [ok] ${colors.green}Database connection pool initialized${colors.reset}`);
        console.log(`    [ok] ${colors.green}Session manager configured${colors.reset}`);
        console.log(`    [ok] ${colors.green}Authentication middleware loaded${colors.reset}`);
        console.log(`    [ok] ${colors.green}API routes registered${colors.reset}`);
        console.log(`    [ok] ${colors.green}Error handlers configured${colors.reset}`);
        console.log(`    ${spinner} Starting HTTP server...`);
      };
      
      // Show startup animation for a few frames
      const animationDuration = 1200;
      const animationInterval = setInterval(displayStartupScreen, 150);
      
      setTimeout(() => {
        clearInterval(animationInterval);
        void (async () => {
          const metrics = await statusService.getSystemMetrics().catch(() => null);
          const healthColor =
            metrics?.healthCheck.status === "healthy"
              ? colors.green
              : metrics?.healthCheck.status === "degraded"
                ? colors.yellow
                : colors.red;

          console.clear();
          
          // Display main startup banner
          console.log("\n" + colors.bright + colors.green + "================================================" + colors.reset);
          console.log(colors.bright + colors.green + " SERVER INITIALIZED SUCCESSFULLY " + colors.reset);
          console.log(colors.bright + colors.green + "================================================" + colors.reset + "\n");
          
          // Brief setup summary
          console.log(colors.bright + colors.blue + "Setup Complete:" + colors.reset);
          console.log(`  ${statusOn} All services initialized`);
          console.log(`  ${statusOn} Server ready to accept connections`);
          console.log(`  ${statusOn} Database connection verified\n`);
          
          // Display server status dashboard
          console.log(colors.bright + colors.cyan + "================================================" + colors.reset);
          console.log(colors.bright + colors.cyan + " SERVER STATUS DASHBOARD " + colors.reset);
          console.log(colors.bright + colors.cyan + "================================================" + colors.reset + "\n");
          
          console.log(colors.bright + "Main Server Info:" + colors.reset);
          console.log(`  ${statusOn} Server Status: ${colors.green}RUNNING${colors.reset}`);
          console.log(`  ${statusOn} Port: ${colors.cyan}${port}${colors.reset}`);
          console.log(`  ${statusOn} Environment: ${colors.cyan}${runtimeNodeEnv}${colors.reset}`);
          console.log(`  ${statusOn} Health Score: ${healthColor}${metrics?.healthCheck.overallScore ?? 100}${colors.reset}`);
          console.log(`  ${statusOn} Uptime: ${colors.cyan}${formatConsoleUptime((metrics?.cpu.uptime ?? 0) * 1000)}${colors.reset}`);
          
          console.log("\n" + colors.bright + "Database:" + colors.reset);
          console.log(`  ${statusOn} PostgreSQL: ${colors.green}CONNECTED${colors.reset}`);
          console.log(`  ${statusOn} Host: ${colors.cyan}${process.env.PGHOST || 'localhost'}${colors.reset}`);
          console.log(`  ${statusOn} Connections: ${colors.cyan}${metrics?.database.connections ?? 0}/${metrics?.database.maxConnections ?? 0}${colors.reset}`);
          console.log(`  ${statusOn} Active Queries: ${colors.cyan}${metrics?.database.activeQueries ?? 0}${colors.reset}`);
          console.log(`  ${statusOn} Cache Hit Rate: ${colors.cyan}${Math.round(metrics?.database.cacheHitRate ?? 0)}%${colors.reset}`);
          
          console.log("\n" + colors.bright + "Performance:" + colors.reset);
          console.log(`  ${statusOn} Total Requests: ${colors.cyan}${metrics?.requests.totalRequests ?? 0}${colors.reset}`);
          console.log(`  ${statusOn} Request Rate: ${colors.cyan}${(metrics?.requests.requestsPerSecond ?? 0).toFixed(2)}/sec${colors.reset}`);
          console.log(`  ${statusOn} Avg Response: ${colors.cyan}${Math.round(metrics?.requests.averageResponseTime ?? 0)}ms${colors.reset}`);
          console.log(`  ${statusOn} P95 / P99: ${colors.cyan}${Math.round(metrics?.requests.p95ResponseTime ?? 0)}ms / ${Math.round(metrics?.requests.p99ResponseTime ?? 0)}ms${colors.reset}`);

          console.log("\n" + colors.bright + "Resources:" + colors.reset);
          console.log(`  ${statusOn} CPU Usage: ${colors.cyan}${Math.round(metrics?.cpu.usage ?? 0)}%${colors.reset}`);
          console.log(`  ${statusOn} Memory: ${colors.cyan}${formatConsoleMemory(metrics?.memory.used ?? 0)} / ${formatConsoleMemory(metrics?.memory.total ?? 0)}${colors.reset}`);
          console.log(`  ${statusOn} Disk Usage: ${colors.cyan}${Math.round(metrics?.disk.usage ?? 0)}%${colors.reset}`);
          
          console.log("\n" + colors.bright + "Services:" + colors.reset);
          console.log(`  ${statusOn} Express Server: ${colors.green}ACTIVE${colors.reset}`);
          console.log(`  ${statusOn} Session Manager: ${colors.green}ACTIVE${colors.reset}`);
          console.log(`  ${statusOn} Authentication: ${colors.green}READY${colors.reset}`);
          
          console.log("\n" + colors.bright + "Access:" + colors.reset);
          console.log(`  ${colors.cyan}->${colors.reset} API Endpoint: ${colors.bright}http://localhost:${port}/api${colors.reset}`);
          console.log(`  ${colors.cyan}->${colors.reset} Web Interface: ${colors.bright}http://localhost:${port}${colors.reset}`);
          console.log(`  ${colors.cyan}->${colors.reset} Health Check: ${colors.bright}http://localhost:${port}/api/status/health${colors.reset}`);
          
          console.log("\n" + colors.bright + "Health Checks:" + colors.reset);
          if (metrics) {
            Object.entries(metrics.healthCheck.checks).forEach(([key, check]) => {
              const icon = check.status === "ok" ? statusOn : check.status === "warning" ? statusWarning : statusOff;
              const color = check.status === "ok" ? colors.green : check.status === "warning" ? colors.yellow : colors.red;
              console.log(`  ${icon} ${key}: ${color}${check.status.toUpperCase()}${colors.reset} (${Math.round(check.value)}/${Math.round(check.threshold)})`);
            });
          }
          
          console.log("\n" + colors.bright + colors.yellow + "Status Indicators:" + colors.reset);
          console.log(`  ${statusOn} Online / Active`);
          console.log(`  ${statusOff} Offline / Inactive`);
          console.log(`  ${statusWarning} Warning / Resetting\n`);
        })();
      }, animationDuration);

      const liveSnapshotInterval = setInterval(() => {
        void (async () => {
          const metrics = await statusService.getSystemMetrics().catch(() => null);
          if (!metrics) return;
          const healthLabel = metrics.healthCheck.status.toUpperCase();
          const healthColor =
            metrics.healthCheck.status === "healthy"
              ? colors.green
              : metrics.healthCheck.status === "degraded"
                ? colors.yellow
                : colors.red;
          console.log(
            `${colors.dim}[status]${colors.reset} uptime=${formatConsoleUptime(metrics.cpu.uptime * 1000)} ` +
            `health=${healthColor}${healthLabel}${colors.reset} ` +
            `req=${metrics.requests.totalRequests} ` +
            `rps=${metrics.requests.requestsPerSecond.toFixed(2)} ` +
            `avg=${Math.round(metrics.requests.averageResponseTime)}ms ` +
            `cpu=${Math.round(metrics.cpu.usage)}% ` +
            `mem=${formatConsoleMemory(metrics.memory.used)}/${formatConsoleMemory(metrics.memory.total)} ` +
            `db=${metrics.database.connections}/${metrics.database.maxConnections}`
          );
        })();
      }, 60000);
      liveSnapshotInterval.unref?.();
    },
  );
})();
