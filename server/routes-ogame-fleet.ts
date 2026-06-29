import { Router } from "express";
import { isAuthenticated } from "./basicAuth";
import { fleetMissionService } from "./services/fleetMissionService";
import { db } from "./db";
import { missions, playerStates } from "../Source/Shared/schema";
import { eq, and, sql } from "drizzle-orm";

export function registerOGameFleetRoutes(app: Router) {
  app.post("/api/ogame/fleet/deploy", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { units, targetCoordinates, missionType } = req.body;
      if (!units || !targetCoordinates || !missionType) {
        return res.status(400).json({ error: "units, targetCoordinates, and missionType required" });
      }

      if (!["deploy", "transport", "attack", "destroy"].includes(missionType)) {
        return res.status(400).json({ error: "Invalid mission type" });
      }

      const result = await fleetMissionService.deployFleet(userId, units, targetCoordinates, missionType);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/fleet/recall/:missionId", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const result = await fleetMissionService.recallFleet(userId, req.params.missionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/fleet/active", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const active = await fleetMissionService.getActiveMissions(userId);
      res.json({ success: true, missions: active });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/fleet/missions", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const allMissions = await db
        .select()
        .from(missions)
        .where(eq(missions.userId, userId))
        .orderBy(sql`${missions.createdAt} DESC`)
        .limit(limit)
        .offset(offset);

      res.json({ success: true, missions: allMissions, total: allMissions.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/fleet/fleet-save", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { units, duration } = req.body;
      if (!units || !duration) {
        return res.status(400).json({ error: "units and duration (minutes) required" });
      }

      const deployMinutes = Math.max(5, Math.min(60, duration));

      const [state] = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const currentFleet = (state.units as Record<string, number>) || {};
      for (const [unitType, count] of Object.entries(units as Record<string, number>)) {
        const available = currentFleet[unitType] || 0;
        if (count > available) {
          return res.status(400).json({ error: `Not enough ${unitType}. Available: ${available}` });
        }
        currentFleet[unitType] = available - count;
      }

      await db
        .update(playerStates)
        .set({ units: currentFleet, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));

      const departureTime = new Date();
      const arrivalTime = new Date(departureTime.getTime() + deployMinutes * 60 * 1000);
      const returnTime = new Date(arrivalTime.getTime() + deployMinutes * 60 * 1000);

      await db.insert(missions).values({
        userId,
        type: "deploy",
        status: "outbound",
        target: "fleet_save",
        origin: "fleet_save",
        units,
        departureTime,
        arrivalTime,
        returnTime,
        processed: false,
      });

      res.json({
        success: true,
        message: `Fleet deployed for ${deployMinutes} minutes`,
        arrivalTime: arrivalTime.toISOString(),
        returnTime: returnTime.toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ogame/fleet/destroy", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const { units, targetCoordinates } = req.body;
      if (!units || !targetCoordinates) {
        return res.status(400).json({ error: "units and targetCoordinates required" });
      }

      const [state] = await db
        .select()
        .from(playerStates)
        .where(eq(playerStates.userId, userId))
        .limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const currentFleet = (state.units as Record<string, number>) || {};
      for (const [unitType, count] of Object.entries(units as Record<string, number>)) {
        const available = currentFleet[unitType] || 0;
        if (count > available) {
          return res.status(400).json({ error: `Not enough ${unitType}. Available: ${available}` });
        }
        currentFleet[unitType] = available - count;
      }

      await db
        .update(playerStates)
        .set({ units: currentFleet, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));

      const departureTime = new Date();
      const arrivalTime = new Date(departureTime.getTime() + 5 * 60 * 1000);

      await db.insert(missions).values({
        userId,
        type: "destroy",
        status: "outbound",
        target: targetCoordinates,
        origin: targetCoordinates,
        units,
        departureTime,
        arrivalTime,
        returnTime: null,
        processed: false,
      });

      res.json({
        success: true,
        message: `Destroy mission dispatched to ${targetCoordinates}`,
        arrivalTime: arrivalTime.toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ogame/fleet/arrivals", isAuthenticated as any, async (_req: any, res: any) => {
    try {
      const processed = await fleetMissionService.processArrivedMissions();
      const returned = await fleetMissionService.processReturnedMissions();
      res.json({ success: true, missionsProcessed: processed + returned });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
