import type { Express, Request, Response } from "express";
import { db } from "./db";
import { dimensionalAnomalies } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import {
  DIMENSIONAL_ANOMALIES,
  ANOMALY_REGIONS,
  getAnomalyById,
  getAnomaliesByRegion,
  getAnomalyStats,
  type DimensionalAnomaly,
  type AnomalyRarity,
} from "../shared/config/dimensionalAnomaliesConfig";
import { isAuthenticated } from "./basicAuth";

function getUserId(req: Request): string {
  return req.session?.userId as string;
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

      const [profile] = await db
        .select()
        .from(dimensionalAnomalies)
        .where(eq(dimensionalAnomalies.userId, userId));

      // Get all records for this user
      const records = await db
        .select()
        .from(dimensionalAnomalies)
        .where(eq(dimensionalAnomalies.userId, userId));

      const recordMap = new Map(records.map((r) => [r.anomalyId, r]));

      let anomalies = DIMENSIONAL_ANOMALIES.map((anomaly) => {
        const record = recordMap.get(anomaly.id);
        return {
          ...anomaly,
          discovered: record?.discovered ?? false,
          explored: record?.explored ?? false,
          explorationCount: record?.explorationCount ?? 0,
          lastExploredAt: record?.lastExploredAt ?? null,
          cooldownUntil: record?.cooldownUntil ?? null,
        };
      });

      if (region) {
        anomalies = anomalies.filter((a) => a.region === region);
      }

      const discovered = anomalies.filter((a) => a.discovered).length;
      const explored = anomalies.filter((a) => a.explored).length;

      res.json({
        success: true,
        anomalies,
        summary: {
          total: anomalies.length,
          discovered,
          explored,
          remaining: anomalies.length - discovered,
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

      const anomalyDef = getAnomalyById(anomalyId);
      if (!anomalyDef) {
        return res.status(404).json({ message: "Unknown anomaly" });
      }

      const [existing] = await db
        .select()
        .from(dimensionalAnomalies)
        .where(and(
          eq(dimensionalAnomalies.userId, userId),
          eq(dimensionalAnomalies.anomalyId, anomalyId)
        ));

      if (existing) {
        return res.json({ success: true, alreadyDiscovered: true });
      }

      const [record] = await db
        .insert(dimensionalAnomalies)
        .values({
          userId,
          anomalyId,
          discovered: true,
        })
        .returning();

      res.json({ success: true, record });
    } catch (error) {
      console.error("Failed to discover anomaly:", error);
      res.status(500).json({ message: "Failed to discover anomaly" });
    }
  });

  // POST /api/anomalies/explore/:anomalyId - Explore an anomaly
  app.post("/api/anomalies/explore/:anomalyId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { anomalyId } = req.params;

      const anomalyDef = getAnomalyById(anomalyId);
      if (!anomalyDef) {
        return res.status(404).json({ message: "Unknown anomaly" });
      }

      const [existing] = await db
        .select()
        .from(dimensionalAnomalies)
        .where(and(
          eq(dimensionalAnomalies.userId, userId),
          eq(dimensionalAnomalies.anomalyId, anomalyId)
        ));

      if (!existing) {
        return res.status(400).json({ message: "Anomaly not discovered yet" });
      }

      if (existing.cooldownUntil && new Date(existing.cooldownUntil) > new Date()) {
        return res.status(400).json({
          message: "Anomaly on cooldown",
          cooldownUntil: existing.cooldownUntil,
        });
      }

      // Simulate exploration rewards
      const rewards = anomalyDef.rewards.filter((r) => Math.random() < r.chance);
      const totalRewards = rewards.reduce((acc, r) => {
        acc[r.name] = (acc[r.name] || 0) + r.amount;
        return acc;
      }, {} as Record<string, number>);

      // Calculate cooldown
      const cooldownUntil = new Date();
      cooldownUntil.setHours(cooldownUntil.getHours() + anomalyDef.respawnTimeHours);

      const [updated] = await db
        .update(dimensionalAnomalies)
        .set({
          explored: true,
          explorationCount: (existing.explorationCount || 0) + 1,
          lastExploredAt: new Date(),
          cooldownUntil,
          totalRewardsEarned: {
            ...(existing.totalRewardsEarned as any || {}),
            ...Object.fromEntries(
              Object.entries(totalRewards).map(([k, v]) => [k, ((existing.totalRewardsEarned as any)?.[k] || 0) + v])
            ),
          },
          updatedAt: new Date(),
        })
        .where(eq(dimensionalAnomalies.id, existing.id))
        .returning();

      res.json({
        success: true,
        record: updated,
        explorationResult: {
          rewards,
          totalRewards,
          dangerLevel: anomalyDef.dangerLevel,
          lore: anomalyDef.lore,
        },
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
      const records = await db
        .select()
        .from(dimensionalAnomalies)
        .where(eq(dimensionalAnomalies.userId, userId));

      const totalExplored = records.reduce((sum, r) => sum + (r.explorationCount || 0), 0);
      const discoveredCount = records.filter((r) => r.discovered).length;
      const exploredCount = records.filter((r) => r.explored).length;

      res.json({
        success: true,
        stats: {
          discovered: discoveredCount,
          explored: exploredCount,
          totalExplores: totalExplored,
          completionPercent: Math.round((exploredCount / DIMENSIONAL_ANOMALIES.length) * 100),
        },
      });
    } catch (error) {
      console.error("Failed to get anomaly stats:", error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });
}
