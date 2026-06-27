import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import { PushProtectionService } from "./services/pushProtectionService";
import type { Express } from "express";

export function registerOGamePushProtectionRoutes(app: Express) {
  app.get("/api/ogame/push-protection/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const points = PushProtectionService.calculatePoints(state);
      res.json({
        yourPoints: points,
        threshold: PushProtectionService.POINTS_RATIO_THRESHOLD,
        maxRecipientRatio: `${PushProtectionService.POINTS_RATIO_THRESHOLD}x`,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/push-protection/check-transfer", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, resources } = req.body;
      if (!targetUserId || !resources) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await PushProtectionService.checkTransfer(
        userId,
        targetUserId,
        { metal: resources.metal ?? 0, crystal: resources.crystal ?? 0, deuterium: resources.deuterium ?? 0 },
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
