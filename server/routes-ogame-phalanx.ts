import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { phalanxService } from "./services/phalanxService";
import { db } from "./db";
import { moons, moonBases } from "../Source/Shared/schema";
import { eq, and } from "drizzle-orm";

export function registerOGamePhalanxRoutes(app: Router) {
  app.get("/api/ogame/phalanx/moons", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const userMoons = (await db
        .select({
          moon: moons,
          base: moonBases,
        })
        .from(moonBases)
        .innerJoin(moons, eq((moonBases as any).moonId, moons.id))
        .where(eq(moonBases.playerId, userId))) as any[];

      const moonsWithPhalanx = userMoons
        .filter((row) => {
          const buildings = (row.base.buildings as any) || {};
          return (buildings.sensorPhalanx || 0) > 0;
        })
        .map((row) => ({
          id: row.moon.id,
          name: row.moon.name,
          coordinates: row.moon.coordinates,
          phalanxLevel: ((row.base.buildings as any) || {}).sensorPhalanx || 0,
        }));

      res.json({ success: true, moons: moonsWithPhalanx });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/phalanx/scan", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { moonId, targetCoordinates } = req.body;
      if (!moonId || !targetCoordinates) {
        return res.status(400).json({ error: "moonId and targetCoordinates required" });
      }

      const result = await phalanxService.scanFleets(userId, moonId, targetCoordinates);
      res.json({ success: true, scan: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/phalanx/range/:moonId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { moonId } = req.params;
      const level = await phalanxService.getPhalanxLevel(userId, moonId);

      const [moon] = await db
        .select()
        .from(moons)
        .where(eq(moons.id, moonId))
        .limit(1) as any;

      const m = moon as any;
      res.json({
        success: true,
        phalanx: {
          moonId,
          moonName: m?.name || "Unknown",
          coordinates: m?.coordinates || "",
          level,
          range: level,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
