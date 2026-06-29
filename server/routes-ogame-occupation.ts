import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { playerStates } from "../Source/Shared/schema";
import { OccupationService } from "./services/occupationService";
import type { Express } from "express";

export function registerOGameOccupationRoutes(app: Express) {
  app.get("/api/ogame/occupation/my-occupations", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      res.json({
        occupations: OccupationService.getOccupations(state),
        occupying: OccupationService.getOccupying(state),
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/occupation/occupy", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { targetUserId, galaxy, sector, system, position, fleet } = req.body;
      if (!targetUserId || !galaxy || !sector || !system || !position) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await OccupationService.occupyPlanet(
        userId, req.session?.username ?? "Unknown",
        targetUserId,
        { galaxy: Number(galaxy), sector: Number(sector), system: Number(system), position: Number(position) },
        fleet ?? {},
      );

      if (!result.success) return res.status(400).json({ error: result.error });
      res.json({ success: true, message: "Planet occupied" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/occupation/collect-tribute", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const result = await OccupationService.collectTribute(userId);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({
        success: true,
        tribute: result.tribute,
        message: `Collected ${result.tribute?.metal ?? 0} metal, ${result.tribute?.crystal ?? 0} crystal, ${result.tribute?.deuterium ?? 0} deuterium`,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/occupation/revolt", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId } = req.body;
      if (!planetId) return res.status(400).json({ error: "Planet ID required" });

      const result = await OccupationService.revolt(userId, planetId);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({
        success: true,
        freed: result.freed,
        message: result.freed ? "Revolt succeeded! Planet freed." : "Revolt failed.",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/occupation/remove", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { planetId } = req.body;
      if (!planetId) return res.status(400).json({ error: "Planet ID required" });

      const result = await OccupationService.removeOccupation(userId, planetId);
      if (!result.success) return res.status(400).json({ error: result.error });

      res.json({ success: true, message: "Occupation ended" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
