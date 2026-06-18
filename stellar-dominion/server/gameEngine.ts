
import { resourceService } from './services/resourceService';
import { fleetService } from './services/fleetService';
import { technologyService } from './services/technologyService';
import { db } from './db';
import { playerStates } from '../shared/schema';
import { eq } from 'drizzle-orm';

type ResourceCost = { metal: number; crystal: number; deuterium: number };
type ResourceState = {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
};
type ConstructionQueueItem = {
  id: string;
  type: 'building';
  buildingType: string;
  targetLevel: number;
  cost: ResourceCost;
  startedAt: number;
  completeAt: number;
};

export const BUILDING_COSTS: Record<string, ResourceCost> = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
  roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100 },
};

export const SHIP_COSTS: Record<string, ResourceCost> = {
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
  battlecruiser: { metal: 30000, crystal: 40000, deuterium: 15000 },
  destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
};

export function calculateProduction(buildings: Record<string, number> = {}, research: Record<string, number> = {}) {
  const metalMineLevel = buildings.metalMine || 0;
  const crystalMineLevel = buildings.crystalMine || 0;
  const deuteriumLevel = buildings.deuteriumSynthesizer || 0;
  const energyTech = research.energyTech || 0;

  return {
    metal: Math.floor(30 * metalMineLevel * (1 + metalMineLevel / 10)),
    crystal: Math.floor(20 * crystalMineLevel * (1 + crystalMineLevel / 10)),
    deuterium: Math.floor(10 * deuteriumLevel * (1 + deuteriumLevel / 12)),
    energy: Math.floor(20 + energyTech * 5),
  };
}

export function calculateBuildingCost(buildingType: string, currentLevel: number): ResourceCost {
  const baseCost = BUILDING_COSTS[buildingType] || BUILDING_COSTS.metalMine;
  const factor = Math.pow(1.15, Math.max(0, currentLevel));

  return {
    metal: Math.floor(baseCost.metal * factor),
    crystal: Math.floor(baseCost.crystal * factor),
    deuterium: Math.floor(baseCost.deuterium * factor),
  };
}

export function calculateBuildTime(buildingType: string, currentLevel: number, roboticsFactoryLevel: number): number {
  const cost = calculateBuildingCost(buildingType, currentLevel);
  const totalCost = cost.metal + cost.crystal + cost.deuterium;
  const roboticsModifier = 1 + Math.max(0, roboticsFactoryLevel);
  return Math.max(1, Math.ceil(totalCost / (2500 * roboticsModifier)));
}

function normalizeResources(raw: any): ResourceState {
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

function hasEnoughResources(resources: ResourceState, cost: ResourceCost): boolean {
  return resources.metal >= cost.metal && resources.crystal >= cost.crystal && resources.deuterium >= cost.deuterium;
}

function deductResources(resources: ResourceState, cost: ResourceCost): ResourceState {
  return {
    ...resources,
    metal: resources.metal - cost.metal,
    crystal: resources.crystal - cost.crystal,
    deuterium: resources.deuterium - cost.deuterium,
  };
}

async function getPlayerStateForUser(userId: string) {
  const playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    throw new Error('Player state not found');
  }

  return playerState;
}

export async function processResourceTick(userId: string) {
  const playerState = await getPlayerStateForUser(userId);
  const buildings = (playerState.buildings as Record<string, number>) || {};
  const research = (playerState.research as Record<string, number>) || {};
  const resources = normalizeResources(playerState.resources);

  const now = Date.now();
  const lastUpdate = playerState.lastResourceUpdate?.getTime() ?? now;
  const elapsedMs = Math.max(0, now - lastUpdate);
  const elapsedHours = elapsedMs / 3600000;

  const productionPerHour = calculateProduction(buildings, research);
  const produced = {
    metal: Math.floor(productionPerHour.metal * elapsedHours),
    crystal: Math.floor(productionPerHour.crystal * elapsedHours),
    deuterium: Math.floor(productionPerHour.deuterium * elapsedHours),
    energy: productionPerHour.energy,
  };

  const nextResources: ResourceState = {
    ...resources,
    metal: resources.metal + produced.metal,
    crystal: resources.crystal + produced.crystal,
    deuterium: resources.deuterium + produced.deuterium,
    energy: produced.energy,
  };

  await db
    .update(playerStates)
    .set({
      resources: nextResources,
      lastResourceUpdate: new Date(now),
      updatedAt: new Date(now),
    })
    .where(eq(playerStates.userId, userId));

  return {
    userId,
    produced,
    resources: nextResources,
    elapsedSeconds: Math.floor(elapsedMs / 1000),
    timestamp: now,
  };
}

export async function startBuilding(userId: string, buildingType: string) {
  if (!BUILDING_COSTS[buildingType]) {
    throw new Error('Invalid building type');
  }

  const playerState = await getPlayerStateForUser(userId);
  const resources = normalizeResources(playerState.resources);
  const buildings = ((playerState.buildings as Record<string, number>) || {}) as Record<string, number>;
  const cronJobs = (Array.isArray(playerState.cronJobs) ? playerState.cronJobs : []) as any[];

  const existingBuildQueue = cronJobs.filter((job) => job?.type === 'building');
  if (existingBuildQueue.length >= 5) {
    throw new Error('Building queue is full (max 5)');
  }

  const currentLevel = buildings[buildingType] || 0;
  const cost = calculateBuildingCost(buildingType, currentLevel);

  if (!hasEnoughResources(resources, cost)) {
    throw new Error('Insufficient resources for construction');
  }

  const roboticsFactoryLevel = buildings.roboticsFactory || 0;
  const buildTimeSeconds = calculateBuildTime(buildingType, currentLevel, roboticsFactoryLevel);
  const now = Date.now();

  const queueItem: ConstructionQueueItem = {
    id: `build_${now}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'building',
    buildingType,
    targetLevel: currentLevel + 1,
    cost,
    startedAt: now,
    completeAt: now + buildTimeSeconds * 1000,
  };

  const nextResources = deductResources(resources, cost);
  const nextCronJobs = [...cronJobs, queueItem];

  await db
    .update(playerStates)
    .set({
      resources: nextResources,
      cronJobs: nextCronJobs,
      updatedAt: new Date(now),
    })
    .where(eq(playerStates.userId, userId));

  return {
    userId,
    buildingType,
    started: true,
    queueItem,
    buildTimeSeconds,
    resources: nextResources,
    startedAt: now,
  };
}

export async function processConstructionQueue(userId: string) {
  const playerState = await getPlayerStateForUser(userId);
  const cronJobs = (Array.isArray(playerState.cronJobs) ? playerState.cronJobs : []) as any[];
  const buildings = { ...((playerState.buildings as Record<string, number>) || {}) };
  const now = Date.now();

  const completed: ConstructionQueueItem[] = [];
  const remaining: any[] = [];

  for (const job of cronJobs) {
    if (job?.type === 'building' && Number(job.completeAt || 0) <= now) {
      const buildingType = String(job.buildingType || '');
      if (buildingType) {
        buildings[buildingType] = (buildings[buildingType] || 0) + 1;
      }
      completed.push(job as ConstructionQueueItem);
      continue;
    }
    remaining.push(job);
  }

  if (completed.length > 0) {
    await db
      .update(playerStates)
      .set({
        buildings,
        cronJobs: remaining,
        updatedAt: new Date(now),
      })
      .where(eq(playerStates.userId, userId));
  }

  return {
    userId,
    completed,
    queueLength: remaining.length,
    processedAt: now,
  };
}

export async function buildShips(userId: string, shipType: string, quantity: number) {
  if (!SHIP_COSTS[shipType]) {
    throw new Error('Invalid ship type');
  }

  const shipQuantity = Math.floor(quantity);
  if (shipQuantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const playerState = await getPlayerStateForUser(userId);
  const resources = normalizeResources(playerState.resources);
  const units = { ...((playerState.units as Record<string, number>) || {}) };

  const baseCost = SHIP_COSTS[shipType];
  const totalCost: ResourceCost = {
    metal: baseCost.metal * shipQuantity,
    crystal: baseCost.crystal * shipQuantity,
    deuterium: baseCost.deuterium * shipQuantity,
  };

  if (!hasEnoughResources(resources, totalCost)) {
    throw new Error('Insufficient resources to build ships');
  }

  const nextResources = deductResources(resources, totalCost);
  units[shipType] = (units[shipType] || 0) + shipQuantity;
  const now = Date.now();

  await db
    .update(playerStates)
    .set({
      resources: nextResources,
      units,
      updatedAt: new Date(now),
    })
    .where(eq(playerStates.userId, userId));

  return {
    userId,
    shipType,
    quantity: shipQuantity,
    cost: totalCost,
    resources: nextResources,
    currentFleet: units,
    builtAt: now,
  };
}

export async function processCoreGameTick(userId: string) {
  const resourceTick = await processResourceTick(userId);
  const queueTick = await processConstructionQueue(userId);

  return {
    userId,
    resourceTick,
    queueTick,
    processedAt: Date.now(),
  };
}

class GameEngine {
  constructor() {
    console.log('Game engine started!');
  }

  public update() {
    console.log('Game engine update');
  }

  public getResources() {
    return resourceService.getResources();
  }

  public getFleet() {
    return fleetService.getFleet();
  }

  public getTechnologyTree() {
    return technologyService.getTechnologyTree();
  }
}

export const gameEngine = new GameEngine();
