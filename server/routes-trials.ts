import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import {
  playerPowerLevels,
  itemLevels,
  empireProfiles,
  trialAttempts,
} from "../Source/Shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./basicAuth";
import {
  TRIAL_TIERS,
} from "../Source/Shared/config/trialsConfig";
import {
  calculateTotalPower,
  getPowerTierName,
  getPowerTierColor,
  POWER_SOURCES,
} from "../Source/Shared/config/powerLevelConfig";
import {
  ITEM_LEVEL_TIERS,
  calculateItemStats,
  calculateUpgradeCost,
  attemptItemUpgrade,
  calculateExperienceToNextLevel,
  addItemExperience,
  getItemLevelTierName,
  getItemLevelTierColor,
} from "../Source/Shared/config/itemLevelConfig";
import { trialsService } from "./services/trialsService";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

export function registerTrialRoutes(app: Express) {
  // GET /api/trials/config - Get trial tier configurations
  app.get("/api/trials/config", (_req: Request, res: Response) => {
    res.json({ success: true, tiers: TRIAL_TIERS });
  });

  // GET /api/trials - Get player's trial records
  app.get("/api/trials", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const records = await trialsService.getPlayerTrials(userId);
      res.json({ success: true, trials: records });
    } catch (error) {
      console.error("Failed to get trials:", error);
      res.status(500).json({ message: "Failed to get trials" });
    }
  });

  // POST /api/trials/:tier/start - Start a trial
  app.post("/api/trials/:tier/start", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);

      const playerState = await storage.getPlayerState(userId);
      const playerPower = (playerState as any)?.raidPower || (playerState as any)?.combatPower || 1000;

      const result = await trialsService.startTrial(userId, tier, playerPower);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Failed to start trial:", error);
      res.status(500).json({ message: "Failed to start trial" });
    }
  });

  // POST /api/trials/:tier/resolve-wave - Resolve current wave
  app.post("/api/trials/:tier/resolve-wave", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { attemptId, playerPower } = req.body;

      if (!attemptId) {
        return res.status(400).json({ message: "Missing attemptId" });
      }

      const power = playerPower || 1000;

      const result = await trialsService.resolveWave(userId, attemptId, power);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Failed to resolve wave:", error);
      res.status(500).json({ message: "Failed to resolve wave" });
    }
  });

  // POST /api/trials/:tier/complete - Complete/claim trial
  app.post("/api/trials/:tier/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);
      let attemptId = req.body?.attemptId;

      if (!attemptId) {
        // Auto-find the latest incomplete attempt for this user/tier
        const [latest] = await db
          .select()
          .from(trialAttempts)
          .where(and(
            eq(trialAttempts.userId, userId),
            eq(trialAttempts.trialTier, tier),
            eq(trialAttempts.completed, false)
          ))
          .orderBy(trialAttempts.createdAt)
          .limit(1);
        if (!latest) {
          return res.status(400).json({ message: "No active trial attempt found" });
        }
        attemptId = latest.id;
      }

      const playerState = await storage.getPlayerState(userId);
      const playerPower = (playerState as any)?.raidPower || (playerState as any)?.combatPower || 1000;

      const result = await trialsService.completeTrial(userId, attemptId, playerPower);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Failed to complete trial:", error);
      res.status(500).json({ message: "Failed to complete trial" });
    }
  });

  // GET /api/trials/leaderboard/:tier - Get leaderboard
  app.get("/api/trials/leaderboard/:tier", async (req: Request, res: Response) => {
    try {
      const tier = parseInt(req.params.tier);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const leaderboard = await trialsService.getTrialLeaderboard(tier, limit);
      res.json({ success: true, leaderboard });
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });
}
