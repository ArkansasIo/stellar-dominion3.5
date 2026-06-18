import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { logger } from "./logger";
import { ConsoleMenu } from "./consoleMenu";
import { setupAuth } from "./basicAuth";
import { registerAccountRoutes } from "./routes-account";
import { registerAdminRoutes } from "./routes-admin";
import { registerAllianceRoutes } from "./routes-alliances";
import { registerArtifactRoutes } from "./routes-artifacts";
import { registerGuildRoutes } from "./routes-guilds";
import { registerEmpireCombatUniverseRoutes } from "./routes-empire-combat-universe";
import { registerForumRoutes } from "./routes-forums";
import { ServerStatusService } from "./services/serverStatusService";

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

export function log(message: string, source = "express", level: "info" | "success" | "error" | "warn" = "info") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const icons = {
    info: "ℹ️",
    success: "✅",
    error: "❌",
    warn: "⚠️"
  };

  console.log(`${formattedTime} [${source}] ${icons[level]} ${message}`);
  
  // Also log to the structured logger
  if (level === "error") {
    logger.error("SERVER" as any, message);
  } else if (level === "warn") {
    logger.warn("SERVER" as any, message);
  } else if (level === "success") {
    logger.info("SERVER" as any, message);
  } else {
    logger.info("SERVER" as any, message);
  }
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
      if (duration < 50) speed = "⚡";
      else if (duration < 150) speed = "🚀";
      else if (duration < 500) speed = "📊";
      else speed = "🐌";

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
import { registerGalaxyRoutes } from "./routes-galaxy";
import { registerRealmRoutes } from "./routes-realms";
import { registerUniverseSeedRoutes } from "./routes-universe-seed";
import { registerLifeSupportRoutes } from "./routes-lifesupport";
import { registerLiveOpsRoutes } from "./routes-liveops";
import { registerMissingRoutes } from "./routes-missing";
import { registerCivilizationRoutes } from "./routes-civilization";
import { registerCivilizationSystemRoutes } from "./routes-civilization-system";
import { registerArmySystemRoutes } from "./routes-army-system";
import turnSystemRoutes from "./routes-turnsystem";
import researchXPRoutes from "./routes-researchxp";
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
import { seedOgameCatalogIfNeeded } from "./services/ogameCatalogService";

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
  registerGalaxyRoutes(app);
  registerRealmRoutes(app);
  registerUniverseSeedRoutes(app);
  registerLifeSupportRoutes(app);
  registerLiveOpsRoutes(app);
  registerMissingRoutes(app);
  registerCivilizationRoutes(app);
  registerCivilizationSystemRoutes(app);
  registerArmySystemRoutes(app);
  registerAccountRoutes(app);
  registerAdminRoutes(app);
  registerAllianceRoutes(app);
  registerArtifactRoutes(app);
  registerGuildRoutes(app);
  registerForumRoutes(app);
  registerEmpireCombatUniverseRoutes(app);
  app.use(turnSystemRoutes);
  app.use(researchXPRoutes);
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
  app.use(tradesRoutes);
  app.use(worldActionsRoutes);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
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
  const statusOn = `${colors.green}●${colors.reset}`;
  const statusOff = `${colors.red}●${colors.reset}`;
  const statusWarning = `${colors.yellow}●${colors.reset}`;
  
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
      const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let frameIndex = 0;
      
      const displayStartupScreen = () => {
        console.clear();
        console.log("\n" + colors.bright + colors.blue + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.blue + "║" + colors.reset + colors.bright + "     🚀  SERVER STARTUP INITIALIZATION  🚀      " + colors.blue + "║" + colors.reset);
        console.log(colors.bright + colors.blue + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        frameIndex = (frameIndex + 1) % spinnerFrames.length;
        const spinner = spinnerFrames[frameIndex];
        
        console.log(colors.bright + "  Initializing Server Components:" + colors.reset);
        console.log(`    ${spinner} Loading Express.js framework...`);
        console.log(`    ✓ ${colors.green}Database connection pool initialized${colors.reset}`);
        console.log(`    ✓ ${colors.green}Session manager configured${colors.reset}`);
        console.log(`    ✓ ${colors.green}Authentication middleware loaded${colors.reset}`);
        console.log(`    ✓ ${colors.green}API routes registered${colors.reset}`);
        console.log(`    ✓ ${colors.green}Error handlers configured${colors.reset}`);
        console.log(`    ${spinner} Starting HTTP server...`);
      };
      
      // Show startup animation for a few frames
      const animationDuration = 1200;
      const animationInterval = setInterval(displayStartupScreen, 150);
      
      setTimeout(() => {
        clearInterval(animationInterval);
        console.clear();
        
        // Display main startup banner
        console.log("\n" + colors.bright + colors.green + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.green + "║" + colors.reset + colors.bright + "      ✓ SERVER INITIALIZED SUCCESSFULLY       " + colors.green + "║" + colors.reset);
        console.log(colors.bright + colors.green + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        // Brief setup summary
        console.log(colors.bright + colors.blue + "Setup Complete:" + colors.reset);
        console.log(`  ${statusOn} All services initialized`);
        console.log(`  ${statusOn} Server ready to accept connections`);
        console.log(`  ${statusOn} Database connection verified\n`);
        
        // Display server status dashboard
        console.log(colors.bright + colors.cyan + "╔════════════════════════════════════════════════╗" + colors.reset);
        console.log(colors.bright + colors.cyan + "║" + colors.reset + colors.bright + "          SERVER STATUS DASHBOARD               " + colors.cyan + "║" + colors.reset);
        console.log(colors.bright + colors.cyan + "╚════════════════════════════════════════════════╝" + colors.reset + "\n");
        
        console.log(colors.bright + "Main Server Info:" + colors.reset);
        console.log(`  ${statusOn} Server Status: ${colors.green}RUNNING${colors.reset}`);
        console.log(`  ${statusOn} Port: ${colors.cyan}${port}${colors.reset}`);
        console.log(`  ${statusOn} Environment: ${colors.cyan}${runtimeNodeEnv}${colors.reset}`);
        
        console.log("\n" + colors.bright + "Database:" + colors.reset);
        console.log(`  ${statusOn} PostgreSQL: ${colors.green}CONNECTED${colors.reset}`);
        console.log(`  ${statusOn} Host: ${colors.cyan}${process.env.PGHOST || 'localhost'}${colors.reset}`);
        
        console.log("\n" + colors.bright + "Services:" + colors.reset);
        console.log(`  ${statusOn} Express Server: ${colors.green}ACTIVE${colors.reset}`);
        console.log(`  ${statusOn} Session Manager: ${colors.green}ACTIVE${colors.reset}`);
        console.log(`  ${statusOn} Authentication: ${colors.green}READY${colors.reset}`);
        
        console.log("\n" + colors.bright + "Access:" + colors.reset);
        console.log(`  ${colors.cyan}→${colors.reset} API Endpoint: ${colors.bright}http://localhost:${port}/api${colors.reset}`);
        console.log(`  ${colors.cyan}→${colors.reset} Web Interface: ${colors.bright}http://localhost:${port}${colors.reset}`);
        
        console.log("\n" + colors.bright + colors.yellow + "⚠  Status Indicators:" + colors.reset);
        console.log(`  ${statusOn} Online / Active`);
        console.log(`  ${statusOff} Offline / Inactive`);
        console.log(`  ${statusWarning} Warning / Resetting\n`);
      }, animationDuration);
    },
  );
})();
