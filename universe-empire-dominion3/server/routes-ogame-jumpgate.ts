import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { jumpGateService } from "./services/jumpGateService";

export function registerOGameJumpGateRoutes(app: Router) {
  app.get("/api/ogame/jumpgate/moons", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const moons = await jumpGateService.getPlayerMoonsWithGate(userId);
      res.json({ success: true, moons });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/jumpgate/calculate", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const { ships } = req.body;
      if (!ships) return res.status(400).json({ error: "ships required" });

      const cost = jumpGateService.calculateDeuteriumCost(ships);
      res.json({ success: true, deuteriumCost: cost });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/jumpgate/jump", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { sourceMoonId, targetMoonId, ships } = req.body;
      if (!sourceMoonId || !targetMoonId || !ships) {
        return res.status(400).json({ error: "sourceMoonId, targetMoonId, and ships required" });
      }

      const result = await jumpGateService.jumpFleet(userId, sourceMoonId, targetMoonId, ships);
      res.json({ success: true, jump: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/jumpgate/status/:moonId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { moonId } = req.params;
      const level = await jumpGateService.getGateLevel(userId, moonId);

      res.json({
        success: true,
        gate: {
          moonId,
          level,
          cooldownHours: Math.max(1, 10 - level),
          isAvailable: level > 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
