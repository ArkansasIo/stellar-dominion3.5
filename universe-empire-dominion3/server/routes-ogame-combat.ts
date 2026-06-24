/**
 * OGame-Style Combat Routes
 * Enhanced battle reports, mission logs, and fleet information
 */

import { Router } from "express";
import { BattleReportService } from "./services/battleReportService";
import { MissionLogService } from "./services/missionLogService";
import { isAuthenticated } from "./basicAuth";
import type { Request, Response } from "express";

export function registerOGameCombatRoutes(app: Router) {
  /**
   * GET /api/ogame/combat/battle-report/:battleId
   * Get detailed OGame-style battle report
   */
  app.get("/api/ogame/combat/battle-report/:battleId", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { battleId } = req.params;
      const report = await BattleReportService.generateBattleReport(battleId);

      if (!report) {
        return res.status(404).json({ error: "Battle report not found" });
      }

      res.json({
        success: true,
        report,
      });
    } catch (error) {
      console.error("[ogame-combat] Error:", error);
      res.status(500).json({ error: "Failed to generate battle report" });
    }
  });

  /**
   * GET /api/ogame/combat/battle-history
   * Get battle history with detailed reports
   */
  app.get("/api/ogame/combat/battle-history", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const limit = parseInt(req.query.limit as string) || 50;
      const reports = await BattleReportService.getPlayerBattleReports(userId, limit);

      res.json({
        success: true,
        battles: reports,
        total: reports.length,
      });
    } catch (error) {
      console.error("[ogame-combat] Error:", error);
      res.status(500).json({ error: "Failed to get battle history" });
    }
  });

  /**
   * GET /api/ogame/combat/fleet-information
   * Get current fleet information for player
   */
  app.get("/api/ogame/combat/fleet-information", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      // This would integrate with existing fleet data
      res.json({
        success: true,
        fleet: {
          totalShips: 0,
          totalPower: 0,
          ships: [],
          status: "idle",
        },
      });
    } catch (error) {
      console.error("[ogame-combat] Error:", error);
      res.status(500).json({ error: "Failed to get fleet information" });
    }
  });

  /**
   * GET /api/ogame/missions/log/:missionId
   * Get detailed mission log
   */
  app.get("/api/ogame/missions/log/:missionId", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { missionId } = req.params;
      const missionLog = await MissionLogService.getMissionLog(missionId);

      if (!missionLog) {
        return res.status(404).json({ error: "Mission log not found" });
      }

      res.json({
        success: true,
        mission: missionLog,
      });
    } catch (error) {
      console.error("[ogame-missions] Error:", error);
      res.status(500).json({ error: "Failed to get mission log" });
    }
  });

  /**
   * GET /api/ogame/missions/active
   * Get all active missions with detailed logs
   */
  app.get("/api/ogame/missions/active", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const activeMissions = await MissionLogService.getActiveMissions(userId);

      res.json({
        success: true,
        missions: activeMissions,
        total: activeMissions.length,
      });
    } catch (error) {
      console.error("[ogame-missions] Error:", error);
      res.status(500).json({ error: "Failed to get active missions" });
    }
  });

  /**
   * GET /api/ogame/missions/history
   * Get mission history with detailed logs
   */
  app.get("/api/ogame/missions/history", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const limit = parseInt(req.query.limit as string) || 50;
      const missionLogs = await MissionLogService.getPlayerMissionLogs(userId, limit);

      res.json({
        success: true,
        missions: missionLogs,
        total: missionLogs.length,
      });
    } catch (error) {
      console.error("[ogame-missions] Error:", error);
      res.status(500).json({ error: "Failed to get mission history" });
    }
  });

  /**
   * GET /api/ogame/missions/statistics
   * Get mission statistics for player
   */
  app.get("/api/ogame/missions/statistics", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const statistics = await MissionLogService.getMissionStatistics(userId);

      res.json({
        success: true,
        statistics,
      });
    } catch (error) {
      console.error("[ogame-missions] Error:", error);
      res.status(500).json({ error: "Failed to get mission statistics" });
    }
  });

  /**
   * GET /api/ogame/combat/statistics
   * Get combat statistics for player
   */
  app.get("/api/ogame/combat/statistics", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      // Get battle history
      const battleReports = await BattleReportService.getPlayerBattleReports(userId, 100);

      // Calculate statistics
      const stats = {
        totalBattles: battleReports.length,
        victories: battleReports.filter(b => b.result === "victory").length,
        defeats: battleReports.filter(b => b.result === "defeat").length,
        draws: battleReports.filter(b => b.result === "draw").length,
        winRate: 0,
        totalRounds: battleReports.reduce((sum, b) => sum + (b.rounds || 0), 0),
        averageRounds: 0,
        totalPlunder: {
          metal: battleReports.reduce((sum, b) => sum + (b.plunder?.metal || 0), 0),
          crystal: battleReports.reduce((sum, b) => sum + (b.plunder?.crystal || 0), 0),
          deuterium: battleReports.reduce((sum, b) => sum + (b.plunder?.deuterium || 0), 0),
        },
        byType: {} as Record<string, number>,
        recentBattles: battleReports.slice(0, 10),
      };

      // Calculate win rate
      if (stats.totalBattles > 0) {
        stats.winRate = (stats.victories / stats.totalBattles) * 100;
      }

      // Calculate average rounds
      if (stats.totalBattles > 0) {
        stats.averageRounds = Math.round(stats.totalRounds / stats.totalBattles);
      }

      // Count by type
      for (const battle of battleReports) {
        stats.byType[battle.battleType] = (stats.byType[battle.battleType] || 0) + 1;
      }

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      console.error("[ogame-combat] Error:", error);
      res.status(500).json({ error: "Failed to get combat statistics" });
    }
  });

  /**
   * GET /api/ogame/combat/leaderboard
   * Get combat leaderboard
   */
  app.get("/api/ogame/combat/leaderboard", isAuthenticated as any, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;

      // This would query top players by fleet power/combat level
      res.json({
        success: true,
        leaderboard: [],
        message: "Leaderboard feature coming soon",
      });
    } catch (error) {
      console.error("[ogame-combat] Error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });
}