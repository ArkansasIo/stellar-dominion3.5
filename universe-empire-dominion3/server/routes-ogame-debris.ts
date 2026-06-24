import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { debrisService } from "./services/debrisService";
import { db } from "./db";
import { battles, playerStates } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

export function registerOGameDebrisRoutes(app: Router) {
  app.get("/api/ogame/debris/:coordinates", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const { coordinates } = req.params;
      const debris = await debrisService.getDebrisField(coordinates);
      res.json({ success: true, debris: debris || { metal: 0, crystal: 0 } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/debris/collect", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { recyclerCount, coordinates } = req.body;
      if (!recyclerCount || !coordinates) {
        return res.status(400).json({ error: "recyclerCount and coordinates required" });
      }

      const playerState = await db
        .select({ units: playerStates.units })
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);

      if (!playerState.length) return res.status(404).json({ error: "Player state not found" });

      const fleet = (playerState[0].units as any) || {};
      const recyclersAvailable = fleet.recycler || 0;
      if (recyclersAvailable < recyclerCount) {
        return res.status(400).json({
          error: `Not enough recyclers. Available: ${recyclersAvailable}`,
        });
      }

      fleet.recycler = recyclersAvailable - recyclerCount;
      await db
        .update(playerStates)
        .set({ units: fleet, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));

      const result = await debrisService.collectDebris(userId, recyclerCount, coordinates);

      await db
        .update(playerStates)
        .set({
          resources: sql`jsonb_set(COALESCE(${playerStates.resources}, '{}'::jsonb), '{metal}', to_jsonb(COALESCE((${playerStates.resources}->>'metal')::numeric, 0) + ${result.collected.metal}))`,
        })
        .where(eq(playerStates.userId, userId));

      res.json({
        success: true,
        collected: result.collected,
        remaining: result.remaining,
        recyclersUsed: recyclerCount,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/debris/recycler-missions", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const missions = await debrisService.getRecyclerMissionStatus(userId);
      res.json({ success: true, missions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/debris/generate/:battleId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { battleId } = req.params;
      const debris = await debrisService.generateDebrisField(battleId);
      if (!debris) return res.status(404).json({ error: "Battle not found" });

      res.json({ success: true, debris });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/debris/nearby/:galaxy/:system", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const { galaxy, system } = req.params;
      const prefix = `${galaxy}:${system}:`;

      const recentBattles = await db
        .select({
          coordinates: battles.defenderCoordinates,
          debris: battles.debris,
          createdAt: battles.createdAt,
        })
        .from(battles)
        .where(
          sql`${battles.defenderCoordinates} LIKE ${prefix + '%'} AND ${battles.debris} IS NOT NULL AND ${battles.createdAt} > NOW() - INTERVAL '7 days'`
        )
        .orderBy(sql`${battles.createdAt} DESC`);

      const debrisFields = recentBattles
        .filter((b) => {
          const d = b.debris as any;
          return d && ((d.metal || 0) > 0 || (d.crystal || 0) > 0);
        })
        .map((b) => ({
          coordinates: b.coordinates,
          debris: b.debris,
          age: Math.floor((Date.now() - new Date(b.createdAt ?? new Date()).getTime()) / 3600000),
        }));

      res.json({ success: true, debrisFields });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
