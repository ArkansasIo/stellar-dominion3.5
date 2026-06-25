import type { Express, Request, Response } from "express";
import { db } from "./db";
import { ogameSystems, ogamePositions, users } from "../shared/schema";
import { eq, and, inArray } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { OGameGalaxyService, type OGamePositionData } from "./services/ogameGalaxyService";
import { galaxyActivityService, ACTIVITY_TYPES } from "./services/galaxyActivityService";
import { galaxyCacheService } from "./services/galaxyCacheService";
import { espionageReportService } from "./services/espionageReportService";
import { UNIVERSE_CONFIG } from "../shared/config/universeConfig";

const MAX_POSITIONS = UNIVERSE_CONFIG.size.positionsPerSystem;
const DEBRIS_POSITION = 16;
const EXPEDITION_POSITION = 17;

interface GalaxyPositionResponse {
  position: number;
  celestialType: string;
  planetName: string;
  planetType: string;
  planetClass: string;
  planetDiameter: number;
  planetTemperature: number;
  playerName: string;
  playerRank: number;
  allianceTag: string;
  allianceName: string;
  status: string;
  hasActivity: boolean;
  activityTypes: number[];
  moonExists: boolean;
  moonName: string;
  moonSize: number;
  debrisMetal: number;
  debrisCrystal: number;
  isInactive: boolean;
  isVacation: boolean;
}

export function registerOGameGalaxyEnhancedRoutes(app: Express) {
  /**
   * GET /api/ogame/galaxy/v2/:galaxy/:system
   * Enhanced galaxy view with activity tracking, real player overlay, and cache.
   */
  app.get(
    "/api/ogame/galaxy/v2/:galaxy/:system",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const galaxy = parseInt(req.params.galaxy, 10);
        const system = parseInt(req.params.system, 10);

        if (
          isNaN(galaxy) || isNaN(system) ||
          galaxy < 1 || galaxy > UNIVERSE_CONFIG.size.galaxyCount ||
          system < 1 || system > UNIVERSE_CONFIG.size.systemsPerGalaxy
        ) {
          return res.status(400).json({ error: `Invalid coordinates` });
        }

        // Get system data (from DB or generate)
        const systemData = await getOrGenerateSystemEnhanced(galaxy, system);

        // Get activity data
        const activityMap = await galaxyActivityService.getSystemActivity(galaxy, system, 15);

        // Enrich positions with activity info
        const enrichedPositions: GalaxyPositionResponse[] = systemData.positions.map(pos => {
          const posActivity = activityMap.get(pos.position) || [];
          const hasActivity = posActivity.length > 0;

          return {
            position: pos.position,
            celestialType: pos.celestialType,
            planetName: pos.planetName,
            planetType: pos.planetType,
            planetClass: pos.planetClass,
            planetDiameter: pos.planetDiameter,
            planetTemperature: pos.planetTemperature,
            playerName: pos.playerName,
            playerRank: pos.playerRank,
            allianceTag: pos.allianceTag,
            allianceName: pos.allianceName,
            status: pos.status,
            hasActivity,
            activityTypes: posActivity.map(a => a.activityType),
            moonExists: pos.moonExists,
            moonName: pos.moonName,
            moonSize: pos.moonSize,
            debrisMetal: pos.debrisMetal,
            debrisCrystal: pos.debrisCrystal,
            isInactive: pos.status === "inactive",
            isVacation: pos.status === "vacation",
          };
        });

        // Record viewing activity (for the requesting player)
        const userId = (req.session as any)?.userId;
        if (userId) {
          await galaxyActivityService.recordActivity(
            userId, galaxy, system, 0, ACTIVITY_TYPES.LOGIN,
          );
        }

        return res.json({
          success: true,
          galaxy,
          system,
          systemName: systemData.systemName,
          star: {
            type: systemData.starType,
            name: systemData.starName,
          },
          positions: enrichedPositions,
          totals: {
            totalPositions: enrichedPositions.length,
            occupiedPlanets: enrichedPositions.filter(p => p.celestialType === "planet" && p.playerName).length,
            debrisFields: enrichedPositions.filter(p => p.debrisMetal > 0 || p.debrisCrystal > 0).length,
            activePlayers: enrichedPositions.filter(p => p.hasActivity).length,
          },
        });
      } catch (error) {
        console.error("Enhanced galaxy route error:", error);
        return res.status(500).json({ error: "Failed to load galaxy data" });
      }
    },
  );

  /**
   * POST /api/ogame/galaxy/v2/activity
   * Record a manual activity event (fleet launch, combat, etc.)
   */
  app.post(
    "/api/ogame/galaxy/v2/activity",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.session as any)?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const {
          galaxy, system, position, activityType,
        } = req.body;

        if (!galaxy || !system || !position || !activityType) {
          return res.status(400).json({ error: "galaxy, system, position, and activityType required" });
        }

        if (![1, 2, 3, 4].includes(activityType)) {
          return res.status(400).json({ error: "Invalid activity type. Must be 1-4" });
        }

        await galaxyActivityService.recordActivity(
          userId, galaxy, system, position, activityType,
        );

        // Invalidate cache for this system since activity changed
        await galaxyCacheService.invalidateCache(galaxy, system);

        return res.json({ success: true });
      } catch (error) {
        console.error("Record activity error:", error);
        return res.status(500).json({ error: "Failed to record activity" });
      }
    },
  );

  /**
   * POST /api/ogame/galaxy/v2/espionage
   * Submit an espionage report
   */
  app.post(
    "/api/ogame/galaxy/v2/espionage",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const attackerId = (req.session as any)?.userId;
        if (!attackerId) return res.status(401).json({ error: "Not authenticated" });

        const {
          targetId, galaxy, system, position, report,
        } = req.body;

        if (!targetId || !galaxy || !system || !position) {
          return res.status(400).json({ error: "targetId, galaxy, system, position required" });
        }

        await espionageReportService.createReport({
          attackerId,
          targetId,
          galaxy,
          system,
          position,
          reportJson: {
            ...report,
            timestamp: Date.now(),
          },
        });

        // Record espionage activity
        await galaxyActivityService.recordActivity(
          attackerId, galaxy, system, position, ACTIVITY_TYPES.ESPIONAGE,
        );

        await galaxyCacheService.invalidateCache(galaxy, system);

        return res.json({ success: true });
      } catch (error) {
        console.error("Espionage report error:", error);
        return res.status(500).json({ error: "Failed to submit espionage report" });
      }
    },
  );

  /**
   * GET /api/ogame/galaxy/v2/reports
   * Get espionage reports for the current user
   */
  app.get(
    "/api/ogame/galaxy/v2/reports",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = (req.session as any)?.userId;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
        const offset = parseInt(req.query.offset as string) || 0;

        const reports = await espionageReportService.getAttackerReports(userId, limit, offset);

        return res.json({ success: true, reports, total: reports.length });
      } catch (error) {
        console.error("Get reports error:", error);
        return res.status(500).json({ error: "Failed to get espionage reports" });
      }
    },
  );

  /**
   * GET /api/ogame/galaxy/v2/cache/status
   * Check cache status for a system
   */
  app.get(
    "/api/ogame/galaxy/v2/cache/status",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const galaxy = parseInt(req.query.galaxy as string, 10);
        const system = parseInt(req.query.system as string, 10);

        if (isNaN(galaxy) || isNaN(system)) {
          return res.status(400).json({ error: "galaxy and system query params required" });
        }

        const cache = await galaxyCacheService.getGalaxyView(galaxy, system);

        return res.json({
          success: true,
          galaxy,
          system,
          cache: {
            cachedAt: cache.generatedAt,
            positionCount: cache.positions.length,
            planets: cache.positions.filter(p => p.type === "planet").length,
            debris: cache.positions.filter(p => p.type === "debris").length,
            empty: cache.positions.filter(p => p.type === "empty").length,
          },
        });
      } catch (error) {
        console.error("Cache status error:", error);
        return res.status(500).json({ error: "Failed to get cache status" });
      }
    },
  );
}

/**
 * Get or generate system data with real player overlay.
 */
async function getOrGenerateSystemEnhanced(
  galaxy: number,
  system: number,
): Promise<{
  systemName: string;
  starType: string;
  starName: string;
  positions: OGamePositionData[];
}> {
  const existing = await db
    .select()
    .from(ogameSystems)
    .where(and(
      eq(ogameSystems.galaxyNumber, galaxy),
      eq(ogameSystems.systemNumber, system),
    ))
    .limit(1);

  if (existing.length > 0) {
    const sysRow = existing[0];
    const posRows = await db
      .select()
      .from(ogamePositions)
      .where(eq(ogamePositions.systemId, sysRow.id))
      .orderBy(ogamePositions.position);

    const positions = posRows.map(p => ({
      position: p.position,
      celestialType: (p.celestialType || "planet") as any,
      planetName: p.planetName || "",
      planetType: p.planetType || "",
      planetClass: p.planetClass || "",
      planetDiameter: p.planetDiameter || 0,
      planetTemperature: p.planetTemperature || 0,
      playerName: p.playerName || "",
      playerRank: p.playerRank || 0,
      allianceTag: p.allianceTag || "",
      allianceName: p.allianceName || "",
      status: p.status || "active",
      moonExists: p.moonExists || false,
      moonName: p.moonName || "",
      moonSize: p.moonSize || 0,
      debrisMetal: p.debrisMetal || 0,
      debrisCrystal: p.debrisCrystal || 0,
    }));

    return {
      systemName: sysRow.name,
      starType: sysRow.starType,
      starName: sysRow.starName,
      positions,
    };
  }

  // Generate deterministically
  const generated = OGameGalaxyService.generateSystemFromHash(galaxy, system);

  // Cache in DB
  const [sys] = await db.insert(ogameSystems).values({
    galaxyNumber: galaxy,
    systemNumber: system,
    name: generated.systemName,
    starType: generated.starType,
    starName: generated.starName,
    temperature: 3000,
    luminosity: 0.04,
    isGenerated: true,
  }).returning({ id: ogameSystems.id });

  for (const pos of generated.positions) {
    await db.insert(ogamePositions).values({
      systemId: sys.id,
      position: pos.position,
      celestialType: pos.celestialType,
      planetName: pos.planetName,
      planetType: pos.planetType,
      planetClass: pos.planetClass,
      planetDiameter: pos.planetDiameter,
      planetTemperature: pos.planetTemperature,
      playerName: pos.playerName,
      playerRank: pos.playerRank,
      allianceTag: pos.allianceTag,
      allianceName: pos.allianceName,
      status: pos.status,
      moonExists: pos.moonExists,
      moonName: pos.moonName,
      moonSize: pos.moonSize,
      debrisMetal: pos.debrisMetal,
      debrisCrystal: pos.debrisCrystal,
    });
  }

  return generated;
}
