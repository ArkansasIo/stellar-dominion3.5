import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";
import {
  processResourceTick,
  startBuilding,
  processConstructionQueue,
  buildShips,
  processCoreGameTick,
  calculateProduction,
  calculateBuildingCost,
  calculateBuildTime,
  BUILDING_COSTS,
  SHIP_COSTS,
} from "./gameEngine";

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function registerGameActionRoutes(app: Express) {

  app.post("/api/game/sync-tick", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const result = await processCoreGameTick(userId);

      res.json({
        message: "Core game tick synchronized",
        ...result,
      });
    } catch (error) {
      console.error("Error synchronizing game tick:", error);
      res.status(500).json({ error: "Failed to synchronize game tick" });
    }
  });
  
  // Get current resource production rates
  app.get("/api/game/production", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const production = calculateProduction(
        playerState.buildings as any,
        playerState.research as any
      );
      
      res.json({ production });
    } catch (error) {
      console.error("Error getting production:", error);
      res.status(500).json({ error: "Failed to get production rates" });
    }
  });
  
  // Trigger resource production update
  app.post("/api/game/collect-resources", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const result = await processResourceTick(userId);
      
      res.json({
        message: "Resources collected",
        ...result,
      });
    } catch (error) {
      console.error("Error collecting resources:", error);
      res.status(500).json({ error: "Failed to collect resources" });
    }
  });
  
  // Start building construction
  app.post("/api/game/build", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const { buildingType } = req.body;
      
      if (!buildingType) {
        return res.status(400).json({ error: "Building type is required" });
      }
      
      if (!BUILDING_COSTS[buildingType as keyof typeof BUILDING_COSTS]) {
        return res.status(400).json({ error: "Invalid building type" });
      }
      
      const result = await startBuilding(userId, buildingType);
      
      res.json({
        message: `Construction of ${buildingType} started`,
        ...result,
      });
    } catch (error: any) {
      console.error("Error starting construction:", error);
      res.status(400).json({ error: error.message || "Failed to start construction" });
    }
  });
  
  // Get building info and costs
  app.get("/api/game/building/:buildingType", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const { buildingType } = req.params;

      if (!BUILDING_COSTS[buildingType as keyof typeof BUILDING_COSTS]) {
        return res.status(400).json({ error: "Invalid building type" });
      }
      
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const buildings = playerState.buildings as any;
      const currentLevel = buildings[buildingType] || 0;
      const cost = calculateBuildingCost(buildingType, currentLevel);
      const buildTime = calculateBuildTime(buildingType, currentLevel, buildings.roboticsFactory || 0);
      
      res.json({
        buildingType,
        currentLevel,
        nextLevel: currentLevel + 1,
        cost,
        buildTime,
      });
    } catch (error) {
      console.error("Error getting building info:", error);
      res.status(500).json({ error: "Failed to get building information" });
    }
  });
  
  // Process construction queue (check for completed buildings)
  app.post("/api/game/process-queue", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const result = await processConstructionQueue(userId);
      
      res.json({
        message: "Queue processed",
        ...result,
      });
    } catch (error) {
      console.error("Error processing queue:", error);
      res.status(500).json({ error: "Failed to process construction queue" });
    }
  });
  
  // Build ships
  app.post("/api/game/build-ships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const { shipType, quantity } = req.body;
      
      if (!shipType) {
        return res.status(400).json({ error: "Ship type is required" });
      }
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Valid quantity is required" });
      }
      
      if (!SHIP_COSTS[shipType as keyof typeof SHIP_COSTS]) {
        return res.status(400).json({ error: "Invalid ship type" });
      }
      
      const result = await buildShips(userId, shipType, parseInt(quantity));
      
      res.json({
        message: `Built ${quantity} ${shipType}`,
        ...result,
      });
    } catch (error: any) {
      console.error("Error building ships:", error);
      res.status(400).json({ error: error.message || "Failed to build ships" });
    }
  });
  
  // Get ship costs
  app.get("/api/game/ships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const units = playerState.units as any || {};
      
      res.json({
        ships: SHIP_COSTS,
        currentFleet: units,
      });
    } catch (error) {
      console.error("Error getting ship info:", error);
      res.status(500).json({ error: "Failed to get ship information" });
    }
  });
  
  // Send fleet on mission
  app.post("/api/game/send-fleet", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const { destination, missionType, ships } = req.body;
      
      if (!destination || !missionType || !ships) {
        return res.status(400).json({ error: "Destination, mission type, and ships are required" });
      }
      
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const units = playerState.units as any || {};
      
      // Verify player has the ships
      for (const [shipType, quantity] of Object.entries(ships)) {
        if ((units[shipType] || 0) < (quantity as number)) {
          return res.status(400).json({ 
            error: `Insufficient ${shipType} ships`,
            available: units[shipType] || 0,
            requested: quantity,
          });
        }
      }
      
      // Deduct ships from fleet
      const newUnits = { ...units };
      for (const [shipType, quantity] of Object.entries(ships)) {
        newUnits[shipType] = (newUnits[shipType] || 0) - (quantity as number);
      }
      
      // Create mission (simplified - in production, calculate travel time based on distance and ship speed)
      const travelTime = 300; // 5 minutes
      const arrivalTime = Date.now() + travelTime * 1000;
      
      const travelState = (playerState.travelState as any) || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions = travelState.activeMissions || [];
      activeMissions.push({
        id: `mission_${Date.now()}`,
        type: missionType,
        destination,
        ships,
        departureTime: Date.now(),
        arrivalTime,
        status: "in-transit",
      });
      travelState.activeMissions = activeMissions;
      
      await db.update(playerStates)
        .set({
          units: newUnits,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));
      
      res.json({
        message: "Fleet sent successfully",
        missionType,
        destination,
        ships,
        arrivalTime,
        travelTime,
      });
    } catch (error) {
      console.error("Error sending fleet:", error);
      res.status(500).json({ error: "Failed to send fleet" });
    }
  });
  
  // Get active missions
  app.get("/api/game/missions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const travelState = (playerState.travelState as any) || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions = travelState.activeMissions || [];
      
      res.json({
        missions: activeMissions,
        count: activeMissions.length,
      });
    } catch (error) {
      console.error("Error getting missions:", error);
      res.status(500).json({ error: "Failed to get missions" });
    }
  });
  
  // Cancel/recall mission
  app.post("/api/game/recall-fleet", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const { missionId } = req.body;
      
      if (!missionId) {
        return res.status(400).json({ error: "Mission ID is required" });
      }
      
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const travelState = (playerState.travelState as any) || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions = travelState.activeMissions || [];
      const missionIndex = activeMissions.findIndex((m: any) => m.id === missionId);
      
      if (missionIndex === -1) {
       return res.status(404).json({ error: "Mission not found" });
      }
      
      const mission = activeMissions[missionIndex];
      
      // Return ships to fleet
      const units = playerState.units as any || {};
      for (const [shipType, quantity] of Object.entries(mission.ships)) {
        units[shipType] = (units[shipType] || 0) + (quantity as number);
      }
      
      // Remove mission from active list
      activeMissions.splice(missionIndex, 1);
      travelState.activeMissions = activeMissions;
      
      await db.update(playerStates)
        .set({
          units: units,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));
      
      res.json({
        message: "Fleet recalled successfully",
        mission,
      });
    } catch (error) {
      console.error("Error recalling fleet:", error);
      res.status(500).json({ error: "Failed to recall fleet" });
    }
  });

  // Process mission completions - auto-complete missions whose arrival time has passed
  app.post("/api/game/process-missions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });
      
      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }
      
      const travelState = (playerState.travelState as any) || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions = travelState.activeMissions || [];
      const completedMissions = [];
      const remainingMissions = [];
      
      let updatedResources = playerState.resources as any || { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
      let updatedUnits = playerState.units as any || {};
      const now = Date.now();
      
      for (const mission of activeMissions) {
        if (mission.arrivalTime <= now) {
          // Mission has arrived! Process it based on type
          completedMissions.push({
            ...mission,
            status: "completed",
            completedAt: now,
          });
          
          // Return fleet to player
          for (const [shipType, quantity] of Object.entries(mission.ships)) {
            updatedUnits[shipType] = (updatedUnits[shipType] || 0) + (quantity as number);
          }
          
          // Grant mission rewards based on type
          switch (mission.type) {
            case "trade":
              // Trading mission: gain 20% of base production
              updatedResources.metal = (updatedResources.metal || 0) + 200;
              updatedResources.crystal = (updatedResources.crystal || 0) + 150;
              updatedResources.deuterium = (updatedResources.deuterium || 0) + 100;
              break;
              
            case "explore":
              // Exploration mission: gain resources + research
              updatedResources.metal = (updatedResources.metal || 0) + 150;
              updatedResources.crystal = (updatedResources.crystal || 0) + 200;
              updatedResources.deuterium = (updatedResources.deuterium || 0) + 80;
              // Boost research progress slightly (implementation depends on research system)
              break;
              
            case "attack":
              // Attack mission: gain plunder (30% of typical enemy resources)
              updatedResources.metal = (updatedResources.metal || 0) + 300;
              updatedResources.crystal = (updatedResources.crystal || 0) + 225;
              updatedResources.deuterium = (updatedResources.deuterium || 0) + 150;
              updatedResources.energy = (updatedResources.energy || 0) + 500;
              break;
              
            case "transport":
              // Transport mission: cargo already loaded, no additional rewards
              break;
              
            default:
              // Generic mission: minimal rewards
              updatedResources.metal = (updatedResources.metal || 0) + 50;
              break;
          }
        } else {
          // Mission still in transit
          remainingMissions.push(mission);
        }
      }
      
      travelState.activeMissions = remainingMissions;
      
      await db.update(playerStates)
        .set({
          resources: updatedResources,
          units: updatedUnits,
          travelState: travelState,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));
      
      res.json({
        message: "Missions processed successfully",
        completedCount: completedMissions.length,
        completedMissions,
        remainingMissions: remainingMissions.length,
        resources: updatedResources,
      });
    } catch (error) {
      console.error("Error processing missions:", error);
      res.status(500).json({ error: "Failed to process missions" });
    }
  });
}
