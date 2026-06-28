import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { outlawService } from "./services/outlawService";

export function registerOGameOutlawRoutes(app: Router) {
  app.get("/api/ogame/outlaw/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const status = await outlawService.getOutlawStatus(userId);
      res.json({ success: true, ...status });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/outlaw/active", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const outlaws = await outlawService.getActiveOutlaws();
      res.json({ success: true, outlaws, count: outlaws.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/outlaw/points", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const points = await outlawService.getPlayerPoints(userId);
      res.json({ success: true, points });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/outlaw/penalty", isAuthenticated as any, async (_req: any, res: any) => {
    try {
      const multiplier = outlawService.getOutlawPenaltyMultiplier();
      res.json({
        success: true,
        penaltyMultiplier: multiplier,
        description: `Outlaws deal ${Math.round((1 - multiplier) * 100)}% reduced damage and earn reduced plunder`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
