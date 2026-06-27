import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import { MissileService } from "./services/missileService";
import type { Express } from "express";

export function registerOGameMissileRoutes(app: Express) {
  app.get("/api/ogame/missile/silo-status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const stored = MissileService.getStoredMissiles(state);
      const capacity = MissileService.getSiloCapacity(state);
      const used = MissileService.getUsedSlots(state);

      res.json({
        siloLevel: (state.buildings as any)?.missileSilo ?? 0,
        capacity,
        usedSlots: used,
        freeSlots: capacity - used,
        stored,
        abmCost: MissileService.getAbmCost(1),
        ipmCost: MissileService.getIpmCost(1),
        abmBuildTime: MissileService.getAbmBuildTimeSeconds(1),
        ipmBuildTime: MissileService.getIpmBuildTimeSeconds(1),
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/missile/produce", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { missileType, quantity } = req.body;
      if (!missileType || !["abm", "ipm"].includes(missileType)) {
        return res.status(400).json({ error: "Invalid missile type. Use 'abm' or 'ipm'" });
      }
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }

      const result = await MissileService.produceMissiles(userId, missileType, quantity);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ success: true, message: `Produced ${quantity} ${missileType.toUpperCase()}(s)` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/missile/launch", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, quantity } = req.body;
      if (!targetUserId) return res.status(400).json({ error: "Target player ID required" });
      if (!quantity || quantity < 1 || quantity > 20) {
        return res.status(400).json({ error: "Quantity must be between 1 and 20" });
      }

      const result = await MissileService.launchIpm(userId, targetUserId, quantity);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({
        success: true,
        message: `Launched ${quantity} IPM(s)`,
        destroyed: result.destroyed,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
