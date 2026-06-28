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
import {
  calculateOgameMissionDistance,
  calculateOgameTravelTimeSeconds,
} from "./services/ogameMissionService";

type FleetUnits = Record<string, number>;
type MissionResources = {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
};

const MISSION_UNIT_PROFILES: Record<string, { speed: number; cargo: number; attack: number; structure: number; shield: number }> = {
  lightFighter: { speed: 12500, cargo: 50, attack: 50, structure: 4000, shield: 10 },
  heavyFighter: { speed: 10000, cargo: 100, attack: 150, structure: 10000, shield: 25 },
  interceptor: { speed: 15000, cargo: 0, attack: 400, structure: 25000, shield: 50 },
  cruiser: { speed: 15000, cargo: 800, attack: 400, structure: 27000, shield: 50 },
  battleship: { speed: 10000, cargo: 1500, attack: 1000, structure: 60000, shield: 200 },
  battlecruiser: { speed: 10000, cargo: 750, attack: 700, structure: 70000, shield: 400 },
  destroyer: { speed: 5000, cargo: 2000, attack: 2000, structure: 110000, shield: 500 },
  bomber: { speed: 4000, cargo: 500, attack: 1000, structure: 75000, shield: 500 },
  mothership: { speed: 2000, cargo: 100000, attack: 5000, structure: 1500000, shield: 10000 },
  deathstar: { speed: 100, cargo: 1000000, attack: 200000, structure: 9000000, shield: 50000 },
  titanPrometheus: { speed: 50, cargo: 500000, attack: 5000000, structure: 25000000, shield: 1000000 },
  titanAtlas: { speed: 40, cargo: 800000, attack: 3000000, structure: 40000000, shield: 2000000 },
  titanHyperion: { speed: 60, cargo: 200000, attack: 8000000, structure: 20000000, shield: 500000 },
  smallCargo: { speed: 5000, cargo: 5000, attack: 5, structure: 4000, shield: 10 },
  largeCargo: { speed: 7500, cargo: 25000, attack: 5, structure: 12000, shield: 25 },
  colonyShip: { speed: 2500, cargo: 7500, attack: 50, structure: 30000, shield: 100 },
  recycler: { speed: 2000, cargo: 20000, attack: 1, structure: 16000, shield: 10 },
  espionageProbe: { speed: 100000000, cargo: 5, attack: 0, structure: 1000, shield: 0 },
  marine: { speed: 0, cargo: 0, attack: 10, structure: 100, shield: 5 },
  exoTrooper: { speed: 0, cargo: 0, attack: 50, structure: 500, shield: 20 },
  colonist: { speed: 0, cargo: 0, attack: 0, structure: 50, shield: 0 },
  hoverTank: { speed: 50, cargo: 0, attack: 200, structure: 2000, shield: 100 },
  battleMech: { speed: 20, cargo: 0, attack: 1000, structure: 10000, shield: 500 },
};

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

function normalizeMissionResources(raw: any): MissionResources {
  return {
    metal: Math.max(0, Number(raw?.metal || 0)),
    crystal: Math.max(0, Number(raw?.crystal || 0)),
    deuterium: Math.max(0, Number(raw?.deuterium || 0)),
    energy: Number(raw?.energy || 0),
    credits: Math.max(0, Number(raw?.credits || 0)),
    food: Math.max(0, Number(raw?.food || 0)),
    water: Math.max(0, Number(raw?.water || 0)),
  };
}

function normalizeFleetUnits(raw: unknown): FleetUnits {
  const fleet: FleetUnits = {};
  if (!raw || typeof raw !== "object") return fleet;

  for (const [unitId, quantity] of Object.entries(raw as Record<string, unknown>)) {
    const safeQuantity = Math.max(0, Math.floor(Number(quantity) || 0));
    if (safeQuantity > 0) {
      fleet[unitId] = safeQuantity;
    }
  }

  return fleet;
}

function calculateMissionDistance(origin: unknown, destination: unknown): number {
  return calculateOgameMissionDistance(origin, destination);
}

function getFleetMissionStats(units: FleetUnits) {
  let totalShips = 0;
  let totalCargo = 0;
  let combatPower = 0;
  let slowestSpeed = Number.POSITIVE_INFINITY;

  for (const [unitId, quantity] of Object.entries(units)) {
    const profile = MISSION_UNIT_PROFILES[unitId];
    if (!profile || quantity <= 0) continue;

    totalShips += quantity;
    totalCargo += profile.cargo * quantity;
    combatPower += (profile.attack + profile.shield + Math.floor(profile.structure / 10)) * quantity;
    if (profile.speed > 0) {
      slowestSpeed = Math.min(slowestSpeed, profile.speed);
    }
  }

  return {
    totalShips,
    totalCargo,
    combatPower,
    slowestSpeed: Number.isFinite(slowestSpeed) ? slowestSpeed : 2500,
  };
}

function calculateTravelTimeSeconds(origin: unknown, destination: unknown, units: FleetUnits): number {
  const fleetStats = getFleetMissionStats(units);
  return calculateOgameTravelTimeSeconds({
    origin,
    destination,
    slowestSpeed: fleetStats.slowestSpeed,
  });
}

function splitRewardPool(total: number, weights: { metal: number; crystal: number; deuterium: number }) {
  return {
    metal: Math.floor(total * weights.metal),
    crystal: Math.floor(total * weights.crystal),
    deuterium: Math.floor(total * weights.deuterium),
  };
}

function calculateMissionRewards(mission: any) {
  const units = normalizeFleetUnits(mission.units || mission.ships);
  const fleetStats = getFleetMissionStats(units);
  const distance = calculateMissionDistance(mission.origin, mission.target || mission.destination);
  const distanceFactor = 1 + Math.min(3, distance / 4000);
  const cargoFactor = 1 + Math.min(4, fleetStats.totalCargo / 25000);
  const combatFactor = 1 + Math.min(6, fleetStats.combatPower / 50000);
  const seedSource = `${mission.id || "mission"}:${mission.type || "mission"}:${mission.target || mission.destination || ""}`;
  const seedValue = Array.from(seedSource).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const variance = 0.85 + (seedValue % 31) / 100;

  if (mission.type === "trade") {
    const total = Math.min(250000, Math.max(600, Math.round(750 * cargoFactor * distanceFactor * variance)));
    return splitRewardPool(total, { metal: 0.45, crystal: 0.35, deuterium: 0.2 });
  }

  if (mission.type === "explore") {
    const total = Math.min(275000, Math.max(700, Math.round(650 * ((combatFactor + cargoFactor) / 2) * distanceFactor * variance)));
    return splitRewardPool(total, { metal: 0.35, crystal: 0.4, deuterium: 0.25 });
  }

  if (mission.type === "attack") {
    const total = Math.min(350000, Math.max(1000, Math.round(900 * combatFactor * cargoFactor * variance)));
    return splitRewardPool(total, { metal: 0.5, crystal: 0.3, deuterium: 0.2 });
  }

  if (mission.type === "sabotage") {
    const total = Math.min(120000, Math.max(400, Math.round(500 * combatFactor * variance)));
    return splitRewardPool(total, { metal: 0.25, crystal: 0.45, deuterium: 0.3 });
  }

  if (mission.type === "transport" && mission.cargo) {
    return {
      metal: Math.max(0, Number(mission.cargo.metal || 0)),
      crystal: Math.max(0, Number(mission.cargo.crystal || 0)),
      deuterium: Math.max(0, Number(mission.cargo.deuterium || 0)),
    };
  }

  return { metal: 0, crystal: 0, deuterium: 0 };
}

function normalizeMissionRecord(mission: any) {
  const units = normalizeFleetUnits(mission?.units || mission?.ships);
  const target = mission?.target || mission?.destination || "";
  const status = mission?.status === "in-transit" ? "outbound" : (mission?.status || "outbound");
  const departureTime = Number(mission?.departureTime || Date.now());
  const distance = Number(mission?.distance || calculateMissionDistance(mission?.origin, target));
  const travelTimeSeconds = Number(mission?.travelTimeSeconds || calculateTravelTimeSeconds(mission?.origin, target, units));
  const arrivalTime = Number(mission?.arrivalTime || (departureTime + travelTimeSeconds * 1000));
  const returnTime = Number(mission?.returnTime || (arrivalTime + travelTimeSeconds * 1000));

  return {
    ...mission,
    target,
    destination: target,
    units,
    ships: units,
    status,
    distance,
    travelTimeSeconds,
    departureTime,
    arrivalTime,
    returnTime,
  };
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
      const { destination, missionType, ships, cargo } = req.body;
      
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
      const requestedShips = normalizeFleetUnits(ships);

      if (Object.keys(requestedShips).length === 0) {
        return res.status(400).json({ error: "Select at least one ship or unit for this mission" });
      }
      
      // Verify player has the ships
      for (const [shipType, quantity] of Object.entries(requestedShips)) {
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
      for (const [shipType, quantity] of Object.entries(requestedShips)) {
        newUnits[shipType] = (newUnits[shipType] || 0) - (quantity as number);
      }
      
      const origin = playerState.coordinates || "1:1:1";
      const distance = calculateMissionDistance(origin, destination);
      const travelTime = calculateTravelTimeSeconds(origin, destination, requestedShips);
      const now = Date.now();
      const arrivalTime = now + travelTime * 1000;
      const returnTime = arrivalTime + travelTime * 1000;
      
      const travelState = (playerState.travelState as any) || { activeRoute: null, discoveredWormholes: [], activeMissions: [] };
      const activeMissions = travelState.activeMissions || [];
      const missionRecord = normalizeMissionRecord({
        id: `mission_${Date.now()}`,
        type: missionType,
        origin,
        target: destination,
        destination,
        units: requestedShips,
        ships: requestedShips,
        cargo: missionType === "transport" ? normalizeMissionResources(cargo) : undefined,
        distance,
        departureTime: now,
        arrivalTime,
        returnTime,
        travelTimeSeconds: travelTime,
        status: "outbound",
      });
      activeMissions.push(missionRecord);
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
        ships: requestedShips,
        mission: missionRecord,
        distance,
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
      const activeMissions = (travelState.activeMissions || []).map((mission: any) => normalizeMissionRecord(mission));
      
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
      
      const mission = normalizeMissionRecord(activeMissions[missionIndex]);
      
      // Return ships to fleet
      const units = playerState.units as any || {};
      for (const [shipType, quantity] of Object.entries(mission.units || mission.ships || {})) {
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
      
      let updatedResources = normalizeMissionResources(playerState.resources);
      let updatedUnits = playerState.units as any || {};
      const now = Date.now();
      
      for (const mission of activeMissions) {
        const normalizedMission = normalizeMissionRecord(mission);
        if (normalizedMission.arrivalTime <= now) {
          const rewards = calculateMissionRewards(normalizedMission);

          // Mission has arrived! Process it based on type
          completedMissions.push({
            ...normalizedMission,
            status: "completed",
            completedAt: now,
            rewards,
          });
          
          // Return fleet to player
          for (const [shipType, quantity] of Object.entries(normalizedMission.units)) {
            updatedUnits[shipType] = (updatedUnits[shipType] || 0) + (quantity as number);
          }
          
          updatedResources = {
            ...updatedResources,
            metal: updatedResources.metal + rewards.metal,
            crystal: updatedResources.crystal + rewards.crystal,
            deuterium: updatedResources.deuterium + rewards.deuterium,
          };
        } else {
          // Mission still in transit
          remainingMissions.push(normalizedMission);
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
