import { Router } from "express";
import {
  getSeasonOverview,
  addSeasonXP,
  claimFreeReward,
  claimPremiumReward,
  unlockPremiumTrack,
  updateMissionProgress,
  startResearch,
  getSeasonLeaderboard,
  getSeasonAllianceProjects,
  getSeasonAllianceBuffs,
  refreshDailyMissions,
} from "./services/seasonService";
import { SEASON_DEFINITIONS } from "../shared/config/seasonConfig";
import { UNIVERSE_LIST, getSeasonalUniverses, getPermanentUniverses, getMigrationPlan } from "../shared/config/universeTypesConfig";

const router = Router();

router.get("/overview", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const activeSeason = SEASON_DEFINITIONS.find(s => s.status === "active");
  if (!activeSeason) {
    res.json({ error: "No active season", seasons: SEASON_DEFINITIONS.map(s => ({ id: s.id, number: s.number, name: s.name, status: s.status })) });
    return;
  }
  const overview = getSeasonOverview(userId, activeSeason.id);
  res.json(overview);
});

router.get("/list", (_req, res) => {
  res.json({
    seasons: SEASON_DEFINITIONS.map(s => ({
      id: s.id,
      number: s.number,
      name: s.name,
      tagline: s.tagline,
      theme: s.theme,
      status: s.status,
      startDate: s.startDate,
      endDate: s.endDate,
      speedMultiplier: s.speedMultiplier,
    })),
  });
});

router.get("/:seasonId/overview", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const overview = getSeasonOverview(userId, seasonId);
  if (!overview) {
    res.status(404).json({ error: "Season not found" });
    return;
  }
  res.json(overview);
});

router.post("/:seasonId/xp", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { xp } = req.body;
  if (typeof xp !== "number" || xp <= 0) {
    res.status(400).json({ error: "Invalid XP amount" });
    return;
  }
  const state = addSeasonXP(userId, seasonId, xp);
  res.json({ success: true, tier: state.currentTier, xp: state.xp, completionRatio: state.completionRatio });
});

router.post("/:seasonId/claim-free", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { tier } = req.body;
  const result = claimFreeReward(userId, seasonId, tier);
  res.json(result);
});

router.post("/:seasonId/claim-premium", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { tier } = req.body;
  const result = claimPremiumReward(userId, seasonId, tier);
  res.json(result);
});

router.post("/:seasonId/unlock-premium", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { cost } = req.body;
  const result = unlockPremiumTrack(userId, seasonId, cost);
  res.json(result);
});

router.post("/:seasonId/mission-progress", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { objectiveType, amount } = req.body;
  const result = updateMissionProgress(userId, seasonId, objectiveType, amount || 1);
  res.json(result);
});

router.post("/:seasonId/research", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const { techId } = req.body;
  const result = startResearch(userId, seasonId, techId);
  res.json(result);
});

router.post("/:seasonId/refresh-daily", (req: any, res) => {
  const userId = req.userId || "dev_user";
  const { seasonId } = req.params;
  const result = refreshDailyMissions(userId, seasonId);
  res.json(result);
});

router.get("/:seasonId/leaderboard/:category", (req, res) => {
  const { seasonId, category } = req.params;
  const leaderboard = getSeasonLeaderboard(seasonId, category);
  res.json({ category, entries: leaderboard });
});

router.get("/:seasonId/alliance-projects", (req, res) => {
  const { seasonId } = req.params;
  const projects = getSeasonAllianceProjects(seasonId);
  res.json({ projects });
});

router.get("/:seasonId/alliance-buffs", (req, res) => {
  const { seasonId } = req.params;
  const buffs = getSeasonAllianceBuffs(seasonId);
  res.json({ buffs });
});

router.get("/universes", (_req, res) => {
  res.json({
    all: UNIVERSE_LIST,
    seasonal: getSeasonalUniverses(),
    permanent: getPermanentUniverses(),
  });
});

router.get("/universes/:universeId/migration", (req, res) => {
  const { universeId } = req.params;
  const plan = getMigrationPlan(universeId);
  if (!plan) {
    res.json({ migration: null, message: "No migration plan for this universe" });
    return;
  }
  res.json({ migration: plan });
});

export default router;
