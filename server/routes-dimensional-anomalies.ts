import type { Express, Request, Response } from "express";
import { db } from "./db";
import { dimensionalAnomalies } from "../Source/Shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import {
  DIMENSIONAL_ANOMALIES,
  ANOMALY_REGIONS,
  getAnomalyById,
  getAnomalyStats,
} from "../Source/Shared/config/dimensionalAnomaliesConfig";
import { dimensionalAnomaliesService } from "./services/dimensionalAnomaliesService";
import { progressionPipelineService } from "./services/progressionPipelineService";
import { rewardDistributionService } from "./services/rewardDistributionService";
import { storage } from "./storage";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

const BONUS_REGIONS: Record<string, string> = {
  "0": "Core Systems",
  "1": "Outer Systems",
  "2": "Nebula Regions",
  "3": "Dark Space",
  "4": "Unknown Space",
};

function getDailyBonusRegions(): { date: string; bonusRegion: string; multiplier: number; regions: string[] } {
  const dayOfWeek = new Date().getDay();
  const regionIndex = dayOfWeek % 5;
  const bonusRegion = BONUS_REGIONS[String(regionIndex)] || "Core Systems";
  return {
    date: new Date().toISOString().split("T")[0],
    bonusRegion,
    multiplier: 2.0,
    regions: ["Core Systems", "Outer Systems", "Nebula Regions", "Dark Space", "Unknown Space"],
  };
}

export function registerDimensionalAnomalyRoutes(app: Express) {
  // GET /api/anomalies/config - All anomaly definitions and stats
  app.get("/api/anomalies/config", (_req: Request, res: Response) => {
    res.json({
      success: true,
      anomalies: DIMENSIONAL_ANOMALIES,
      regions: ANOMALY_REGIONS,
      stats: getAnomalyStats(),
    });
  });

  // GET /api/anomalies - Player's discovered anomalies with status
  app.get("/api/anomalies", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const region = req.query.region as string | undefined;

      const statusPromises = DIMENSIONAL_ANOMALIES
        .filter((a) => !region || a.region === region)
        .map((a) => dimensionalAnomaliesService.getAnomalyStatus(userId, a.id));

      const statuses = await Promise.all(statusPromises);
      const validStatuses = statuses.filter((s): s is NonNullable<typeof s> => s !== null);

      const discovered = validStatuses.filter((s) => s.discovered).length;
      const explored = validStatuses.filter((s) => s.explored).length;

      res.json({
        success: true,
        anomalies: validStatuses,
        summary: {
          total: validStatuses.length,
          discovered,
          explored,
          remaining: validStatuses.length - discovered,
        },
      });
    } catch (error) {
      console.error("Failed to get anomalies:", error);
      res.status(500).json({ message: "Failed to get anomalies" });
    }
  });

  // POST /api/anomalies/discover/:anomalyId - Discover an anomaly
  app.post("/api/anomalies/discover/:anomalyId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { anomalyId } = req.params;

      const status = await dimensionalAnomaliesService.getAnomalyStatus(userId, anomalyId);
      if (!status) {
        return res.status(404).json({ message: "Unknown anomaly" });
      }

      if (status.discovered) {
        return res.json({ success: true, alreadyDiscovered: true });
      }

      const [record] = await db
        .insert(dimensionalAnomalies)
        .values({ userId, anomalyId, discovered: true })
        .returning();

      res.json({ success: true, record });
    } catch (error) {
      console.error("Failed to discover anomaly:", error);
      res.status(500).json({ message: "Failed to discover anomaly" });
    }
  });

  // POST /api/anomalies/explore/:anomalyId - Explore an anomaly with full encounter system
  app.post("/api/anomalies/explore/:anomalyId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { anomalyId } = req.params;

      const playerState = await storage.getPlayerState(userId);
      const playerPower = (playerState as any)?.raidPower || (playerState as any)?.combatPower || 1000;

      const result = await dimensionalAnomaliesService.exploreAnomaly(userId, anomalyId, playerPower);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      const anomalyDef = getAnomalyById(anomalyId);
      const status = await dimensionalAnomaliesService.getAnomalyStatus(userId, anomalyId);

      res.json({
        success: true,
        record: status,
        explorationResult: result.result,
        lore: anomalyDef?.lore,
      });
    } catch (error) {
      console.error("Failed to explore anomaly:", error);
      res.status(500).json({ message: "Failed to explore anomaly" });
    }
  });

  // GET /api/anomalies/stats - Global anomaly statistics
  app.get("/api/anomalies/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const stats = await dimensionalAnomaliesService.getPlayerAnomalyStats(userId);
      res.json({ success: true, stats });
    } catch (error) {
      console.error("Failed to get anomaly stats:", error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // GET /api/anomalies/daily-bonus - Daily bonus region
  app.get("/api/anomalies/daily-bonus", (_req: Request, res: Response) => {
    res.json({ success: true, dailyBonus: getDailyBonusRegions() });
  });

  // GET /api/anomalies/progression - Player progression overview
  app.get("/api/anomalies/progression", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const overview = await progressionPipelineService.getProgressionOverview(userId);
      res.json({ success: true, progression: overview });
    } catch (error) {
      console.error("Failed to get progression:", error);
      res.status(500).json({ message: "Failed to get progression" });
    }
  });

  // GET /api/anomalies/progression/access/:type/:tier - Check gate/contract access
  app.get("/api/anomalies/progression/access/:type/:tier", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { type, tier } = req.params;
      const tierNum = parseInt(tier, 10);

      let access: { allowed: boolean; reason?: string };
      if (type === "gate") {
        access = await progressionPipelineService.canAccessGate(userId, tierNum);
      } else if (type === "contract") {
        access = await progressionPipelineService.canAccessContract(userId, tierNum);
      } else {
        return res.status(400).json({ message: "Invalid type, use 'gate' or 'contract'" });
      }

      res.json({ success: true, access });
    } catch (error) {
      console.error("Failed to check access:", error);
      res.status(500).json({ message: "Failed to check access" });
    }
  });
}
