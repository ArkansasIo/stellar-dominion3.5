import { Router, type Request, type Response } from "express";
import {
  CIVILIZATION_TIERS,
  getCivilizationTier,
  getNextCivilizationTier,
  getTierProgress,
  TECHNOLOGY_AGES,
  getTechnologyAge,
  getNextTechnologyAge,
  EMPIRE_SCORE_RANKS,
  getEmpireScoreRank,
  getNextEmpireScoreRank,
  getScoreToNextRank,
  COMMANDER_LEVEL_UNLOCKS,
  getCommanderLevelUnlocks,
  getCommanderLevelBonus,
  getNextCommanderLevelUnlock,
  calculateOGameBuildingCost,
  calculateOGameBuildingProduction,
  calculateOGameResearchTime,
  calculateTotalEmpireScore,
  TIER_EXAMPLES,
  getTierExample,
  getClosestTierExample,
} from "../Source/Shared/config";
import { combatFormulaService } from "./services/combatFormulaService";

export function registerEmpireProgressionRoutes(app: Router) {
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (!(req as any).session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    next();
  };

  // ─── Civilization Tiers ─────────────────────────────────────────

  app.get("/api/progression/civilization-tiers", (_req: Request, res: Response) => {
    res.json({
      tiers: CIVILIZATION_TIERS,
      totalTiers: CIVILIZATION_TIERS.length,
    });
  });

  app.post("/api/progression/civilization-tier", (req: Request, res: Response) => {
    const { score, colonies, totalResearchLevels } = req.body;
    if (typeof score !== "number") {
      return res.status(400).json({ error: "score (number) required" });
    }
    const tier = getCivilizationTier(score, colonies || 1, totalResearchLevels || 0);
    const next = getNextCivilizationTier(score, colonies || 1, totalResearchLevels || 0);
    const progress = getTierProgress(score, colonies || 1, totalResearchLevels || 0);
    res.json({ current: tier, next, progress });
  });

  // ─── Technology Ages ───────────────────────────────────────────

  app.get("/api/progression/technology-ages", (_req: Request, res: Response) => {
    res.json({
      ages: TECHNOLOGY_AGES,
      totalAges: TECHNOLOGY_AGES.length,
    });
  });

  app.post("/api/progression/technology-age", (req: Request, res: Response) => {
    const { requirements } = req.body;
    if (!requirements || typeof requirements !== "object") {
      return res.status(400).json({ error: "requirements (Record<string,number>) required" });
    }
    const age = getTechnologyAge(requirements);
    const next = getNextTechnologyAge(requirements);
    res.json({ current: age, next });
  });

  // ─── Empire Score Ranks ────────────────────────────────────────

  app.get("/api/progression/score-ranks", (_req: Request, res: Response) => {
    res.json({
      ranks: EMPIRE_SCORE_RANKS,
      totalRanks: EMPIRE_SCORE_RANKS.length,
    });
  });

  app.post("/api/progression/score-rank", (req: Request, res: Response) => {
    const { totalScore } = req.body;
    if (typeof totalScore !== "number") {
      return res.status(400).json({ error: "totalScore (number) required" });
    }
    const result = getScoreToNextRank(totalScore);
    const rank = getEmpireScoreRank(totalScore);
    const next = getNextEmpireScoreRank(totalScore);
    res.json({ current: rank, next, scoreToNextRank: result.scoreNeeded, progress: result.progress });
  });

  // ─── Commander Levels ──────────────────────────────────────────

  app.get("/api/progression/commander-unlocks", (_req: Request, res: Response) => {
    res.json({
      unlocks: COMMANDER_LEVEL_UNLOCKS,
      totalMilestones: COMMANDER_LEVEL_UNLOCKS.length,
    });
  });

  app.post("/api/progression/commander-level", (req: Request, res: Response) => {
    const { level } = req.body;
    if (typeof level !== "number") {
      return res.status(400).json({ error: "level (number) required" });
    }
    const unlocks = getCommanderLevelUnlocks(level);
    const bonus = getCommanderLevelBonus(level);
    const nextUnlock = getNextCommanderLevelUnlock(level);
    res.json({ level, unlocks, bonus, nextUnlockAt: nextUnlock });
  });

  // ─── OGame Building Costs ──────────────────────────────────────

  app.post("/api/progression/building-cost", (req: Request, res: Response) => {
    const { buildingId, level } = req.body;
    if (!buildingId || typeof level !== "number") {
      return res.status(400).json({ error: "buildingId (string), level (number) required" });
    }
    const cost = calculateOGameBuildingCost(buildingId, level);
    res.json({ cost });
  });

  app.post("/api/progression/building-production", (req: Request, res: Response) => {
    const { buildingId, level, energyFactor } = req.body;
    if (!buildingId || typeof level !== "number") {
      return res.status(400).json({ error: "buildingId (string), level (number) required" });
    }
    const production = calculateOGameBuildingProduction(buildingId, level, energyFactor || 1);
    res.json({ production });
  });

  app.post("/api/progression/research-time", (req: Request, res: Response) => {
    const { costMetal, costCrystal, researchLabLevel } = req.body;
    if (typeof costMetal !== "number" || typeof costCrystal !== "number") {
      return res.status(400).json({ error: "costMetal, costCrystal (number) required" });
    }
    const time = calculateOGameResearchTime(costMetal, costCrystal, researchLabLevel || 1);
    res.json({ timeSec: time });
  });

  // ─── Empire Score Calculation ─────────────────────────────────

  app.post("/api/progression/calculate-score", (req: Request, res: Response) => {
    const { fleetScore, defenseScore, researchScore, economyScore } = req.body;
    const total = calculateTotalEmpireScore(
      fleetScore || 0, defenseScore || 0, researchScore || 0, economyScore || 0,
    );
    res.json({ total });
  });

  // ─── Tier Examples ────────────────────────────────────────────

  app.get("/api/progression/tier-examples", (_req: Request, res: Response) => {
    res.json({ examples: TIER_EXAMPLES });
  });

  app.post("/api/progression/tier-example", (req: Request, res: Response) => {
    const { tier } = req.body;
    if (typeof tier !== "number") {
      return res.status(400).json({ error: "tier (number) required" });
    }
    const example = getTierExample(tier) || getClosestTierExample(tier);
    res.json(example ? { tier, example } : { error: "No example found" });
  });

  // ─── Combat Formula Simulation ─────────────────────────────────

  app.post("/api/progression/combat-simulate", isAuthenticated as any, (req: Request, res: Response) => {
    try {
      const { attacker, defender, baseAtkDamage, baseDefDamage, mode } = req.body;
      if (!attacker || !defender || !baseAtkDamage || !baseDefDamage || !mode) {
        return res.status(400).json({
          error: "attacker, defender, baseAtkDamage, baseDefDamage, mode required",
        });
      }
      const result = combatFormulaService.simulate({ attacker, defender, baseAtkDamage, baseDefDamage, mode });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Simulation failed" });
    }
  });

  // ─── Combat Stat Calculator ────────────────────────────────────

  app.post("/api/progression/combat-stats", isAuthenticated as any, (req: Request, res: Response) => {
    try {
      const { stats } = req.body;
      if (!stats) {
        return res.status(400).json({ error: "stats object required" });
      }
      const empireStats = combatFormulaService.buildDefaultStats(stats);
      const breakdown = combatFormulaService.calculateStatBreakdown(empireStats);
      res.json({ breakdown });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Stat calculation failed" });
    }
  });
}
