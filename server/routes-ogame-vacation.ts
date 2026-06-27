import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { vacationService } from "./services/vacationService";

export function registerOGameVacationRoutes(app: Router) {
  app.post("/api/ogame/vacation/enable", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const result = await vacationService.enableVacationMode(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/vacation/disable", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const result = await vacationService.disableVacationMode(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/vacation/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const status = await vacationService.getVacationStatus(userId);
      res.json({ success: true, ...status });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/vacation/players", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const players = await vacationService.getPlayersInVacation();
      res.json({ success: true, count: players.length, players });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/vacation/auto-expire", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const expired = await vacationService.autoExpireVacation();
      res.json({ success: true, expired, message: `${expired} vacation modes expired` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
