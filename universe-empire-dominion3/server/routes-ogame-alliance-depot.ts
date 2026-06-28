import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { playerStates, alliances, allianceMembers } from "../shared/schema";
import type { Express } from "express";

export function registerOGameAllianceDepotRoutes(app: Express) {
  app.get("/api/ogame/alliance-depot/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const buildings = state.buildings ?? {};
      const allianceDepotLevel = buildings.allianceDepot ?? 0;

      const supportBonus = allianceDepotLevel * 0.1;
      const baseSupportDuration = 7200;
      const totalSupportDuration = Math.floor(baseSupportDuration * (1 + supportBonus));

      const [member] = await db.select().from(allianceMembers).where(eq(allianceMembers.playerId, userId)).limit(1);

      res.json({
        allianceDepotLevel,
        supportBonusPercent: supportBonus * 100,
        baseSupportDurationSeconds: baseSupportDuration,
        totalSupportDurationSeconds: totalSupportDuration,
        inAlliance: !!member,
        allianceId: member?.allianceId ?? null,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
