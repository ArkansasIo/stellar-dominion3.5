import { type Express } from "express";
import { storage } from "./storage";
import {
  getWeekId,
  getWeekStart,
  getWeekEnd,
  selectWeeklyMissions,
  buildWeeklyMissionState,
  calculateWeeklyBonus,
  type WeeklyMissionState,
  type WeeklyMissionAssignment,
} from "../Source/Shared/config/weeklyMissionsConfig";

const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.session?.userId) return res.status(401).json({ message: "Not authenticated" });
  next();
};

const getUserId = (req: any): string => req.session?.userId || "dev-user";

async function ensureCurrentWeek(userId: string): Promise<WeeklyMissionState> {
  const weekId = getWeekId();
  const existing = await storage.getWeeklyMissionProgress(userId, weekId);

  if (existing) {
    return {
      weekId: existing.weekId,
      weekStart: getWeekStart(existing.weekId).toISOString(),
      weekEnd: getWeekEnd(existing.weekId).toISOString(),
      missions: (existing.missions as WeeklyMissionAssignment[]) || [],
      bonusPool: existing.bonusPool || 0,
      completedCount: existing.completedCount || 0,
      totalCount: existing.totalCount || 0,
      streak: existing.streak || 0,
    };
  }

  const selectedTemplates = selectWeeklyMissions(weekId, 5);
  const state = buildWeeklyMissionState(weekId, selectedTemplates.map((t) => t.id));

  const previousWeekId = getPreviousWeekId(weekId);
  const previousProgress = previousWeekId ? await storage.getWeeklyMissionProgress(userId, previousWeekId) : null;
  const previousStreak = previousProgress?.streak || 0;
  const allPreviousComplete = previousProgress && (previousProgress.completedCount || 0) >= (previousProgress.totalCount || 1);
  state.streak = allPreviousComplete ? previousStreak + 1 : 0;

  await storage.createWeeklyMissionProgress({
    userId,
    weekId,
    missions: state.missions,
    bonusPool: state.bonusPool,
    completedCount: state.completedCount,
    totalCount: state.totalCount,
    streak: state.streak,
  });

  return state;
}

function getPreviousWeekId(currentWeekId: string): string | null {
  const d = new Date(currentWeekId + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().split("T")[0];
}

export function registerWeeklyMissionRoutes(app: Express) {
  app.get("/api/weekly-missions", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      const state = await ensureCurrentWeek(userId);
      const bonusMultiplier = calculateWeeklyBonus(state);

      res.json({
        success: true,
        state,
        bonusMultiplier,
        weekId: state.weekId,
        weekStart: state.weekStart,
        weekEnd: state.weekEnd,
        timeRemaining: Math.max(0, new Date(state.weekEnd).getTime() - Date.now()),
      });
    } catch (error: any) {
      console.error("Weekly missions error:", error);
      res.status(500).json({ message: "Failed to load weekly missions" });
    }
  });

  app.post("/api/weekly-missions/progress", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      const { templateId, amount = 1 } = req.body;
      if (!templateId) return res.status(400).json({ message: "Missing templateId" });

      const state = await ensureCurrentWeek(userId);
      const mission = state.missions.find((m) => m.templateId === templateId);
      if (!mission) return res.status(404).json({ message: "Mission not found" });
      if (mission.status !== "active") return res.status(400).json({ message: "Mission not active" });

      mission.currentProgress = Math.min(mission.objectiveTarget ?? 0, (mission.currentProgress ?? 0) + amount);
      if ((mission.currentProgress ?? 0) >= (mission.objectiveTarget ?? 0)) {
        mission.status = "completed";
        mission.completedAt = new Date().toISOString();
        state.completedCount = state.missions.filter((m) => m.status === "completed" || m.status === "claimed").length;
      }

      await storage.updateWeeklyMissionProgress(userId, state.weekId, {
        missions: state.missions,
        completedCount: state.completedCount,
      });

      res.json({ success: true, mission, completedCount: state.completedCount, totalCount: state.totalCount });
    } catch (error: any) {
      console.error("Weekly mission progress error:", error);
      res.status(500).json({ message: "Failed to update mission progress" });
    }
  });

  app.post("/api/weekly-missions/claim", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      const { templateId } = req.body;
      if (!templateId) return res.status(400).json({ message: "Missing templateId" });

      const state = await ensureCurrentWeek(userId);
      const mission = state.missions.find((m) => m.templateId === templateId);
      if (!mission) return res.status(404).json({ message: "Mission not found" });
      if (mission.status !== "completed") return res.status(400).json({ message: "Mission not completed" });

      const bonusMultiplier = calculateWeeklyBonus(state);
      mission.status = "claimed";
      mission.claimedAt = new Date().toISOString();

      state.bonusPool = (state.bonusPool ?? 0) + Math.floor((mission.rewardCredits ?? 0) * (bonusMultiplier - 1));
      state.completedCount = state.missions.filter((m) => m.status === "completed" || m.status === "claimed").length;

      await storage.updateWeeklyMissionProgress(userId, state.weekId, {
        missions: state.missions,
        bonusPool: state.bonusPool,
        completedCount: state.completedCount,
      });

      const playerState = await storage.getPlayerState(userId);
      if (playerState) {
        const currentResources = (playerState as any).resources || {};
        const newResources = { ...currentResources };
        if (mission.rewardResources?.metal) newResources.metal = (newResources.metal || 0) + mission.rewardResources.metal;
        if (mission.rewardResources?.crystal) newResources.crystal = (newResources.crystal || 0) + mission.rewardResources.crystal;
        if (mission.rewardResources?.deuterium) newResources.deuterium = (newResources.deuterium || 0) + mission.rewardResources.deuterium;
        await storage.updatePlayerState(userId, { resources: newResources } as any);
      }

      res.json({
        success: true,
        mission,
        rewards: {
          xp: mission.rewardXp,
          credits: mission.rewardCredits,
          resources: mission.rewardResources,
          bonusMultiplier,
        },
      });
    } catch (error: any) {
      console.error("Weekly mission claim error:", error);
      res.status(500).json({ message: "Failed to claim mission rewards" });
    }
  });

  app.get("/api/weekly-missions/history", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      const currentWeekId = getWeekId();
      const history: any[] = [];

      for (let i = 1; i <= 4; i++) {
        const d = new Date(currentWeekId + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() - i * 7);
        const weekId = d.toISOString().split("T")[0];
        const progress = await storage.getWeeklyMissionProgress(userId, weekId);
        if (progress) {
          history.push({
            weekId,
            completedCount: progress.completedCount,
            totalCount: progress.totalCount,
            streak: progress.streak,
            bonusPool: progress.bonusPool,
          });
        }
      }

      res.json({ success: true, history });
    } catch (error: any) {
      console.error("Weekly missions history error:", error);
      res.status(500).json({ message: "Failed to load mission history" });
    }
  });
}
