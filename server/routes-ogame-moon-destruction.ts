import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import { MoonDestructionService } from "./services/moonDestructionService";
import type { Express } from "express";

export function registerOGameMoonDestructionRoutes(app: Express) {
  app.get("/api/ogame/moon/destruction-chance", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const units = (state.units as any) ?? {};
      const deathstarCount = units.deathstar ?? 0;

      const moonsData = (state.moonsData as any) ?? {};
      const moonEntries = Object.entries(moonsData).map(([id, m]: any) => ({
        id,
        name: m.name ?? "Unknown",
        diameter: m.diameter ?? m.size ?? 5000,
        destructionChance: MoonDestructionService.getDestructionChance(m.diameter ?? m.size ?? 5000, deathstarCount),
        deathstarLossChance: MoonDestructionService.getDeathstarLossChance(m.diameter ?? m.size ?? 5000),
      }));

      res.json({ deathstarCount, moons: moonEntries });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/moon/destroy", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, moonId, deathstarCount } = req.body;
      if (!targetUserId) return res.status(400).json({ error: "Target player ID required" });
      if (!moonId) return res.status(400).json({ error: "Moon ID required" });
      if (!deathstarCount || deathstarCount < 1) return res.status(400).json({ error: "Must send at least 1 Deathstar" });

      const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!attackerState) return res.status(404).json({ error: "Attacker state not found" });

      const attackerUnits = (attackerState.units as any) ?? {};
      const availableDs = attackerUnits.deathstar ?? 0;
      if (availableDs < deathstarCount) {
        return res.status(400).json({ error: `Not enough Deathstars (have ${availableDs}, need ${deathstarCount})` });
      }

      const result = await MoonDestructionService.attemptMoonDestruction(userId, targetUserId, moonId, deathstarCount);

      if (result.moonDestroyed) {
        const newAttackerUnits = { ...attackerUnits };
        newAttackerUnits.deathstar = Math.max(0, (newAttackerUnits.deathstar ?? 0) - deathstarCount);
        await db.update(playerStates)
          .set({
            units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(newAttackerUnits)}::jsonb)`,
          })
          .where(eq(playerStates.userId, userId));
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
