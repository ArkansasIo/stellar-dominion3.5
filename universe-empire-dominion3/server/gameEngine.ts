
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
type ResearchQueueItem = {
  id: string;
  techType: string;
  targetLevel: number;
  cost: ResourceCost;
  startedAt: number;
  completeAt: number;
};
type Colony = {
  id: string;
  name: string;
  coordinates: string;
  buildings: Record<string, number>;
  resources: ResourceState;
  orbitalBuildings: Record<string, number>;
  lastResourceUpdate: number;
  habitability: number;
};
type DailyState = {
  lastDailyReset: number;
  lastWeeklyReset: number;
  dailyLoginStreak: number;
  lastLoginDate: string;
  dailyRewardsClaimed: boolean;
  weeklyMissions: any[];
  weeklyMissionsResetAt: number;
};

export const BUILDING_COSTS: Record<string, ResourceCost> = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
  roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100 },
  researchLab: { metal: 200, crystal: 400, deuterium: 100 },
  navalAcademy: { metal: 500, crystal: 300, deuterium: 150 },
  supplyDepot: { metal: 300, crystal: 100, deuterium: 50 },
  orbitalDock: { metal: 800, crystal: 600, deuterium: 400 },
  terraformingStation: { metal: 1000, crystal: 800, deuterium: 600 },
  tradeCenter: { metal: 350, crystal: 250, deuterium: 100 },
  militaryAcademy: { metal: 600, crystal: 400, deuterium: 200 },
  warpGate: { metal: 2000, crystal: 1500, deuterium: 1000 },
};

export const BUILDING_ENERGY: Record<string, number> = {
  metalMine: -10,
  crystalMine: -15,
  deuteriumSynthesizer: -20,
  solarPlant: 0,
  roboticsFactory: -30,
  shipyard: -25,
  researchLab: -20,
  navalAcademy: -15,
  supplyDepot: -5,
  orbitalDock: -40,
  terraformingStation: -35,
  tradeCenter: -10,
  militaryAcademy: -20,
  warpGate: -50,
};

export const BUILDING_PREREQUISITES: Record<string, Record<string, number>> = {
  researchLab: { solarPlant: 1 },
  navalAcademy: { shipyard: 2 },
  supplyDepot: { metalMine: 2 },
  orbitalDock: { shipyard: 3, roboticsFactory: 3 },
  terraformingStation: { researchLab: 2, supplyDepot: 2 },
  tradeCenter: { supplyDepot: 1 },
  militaryAcademy: { navalAcademy: 1 },
  warpGate: { orbitalDock: 2, researchLab: 3 },
};

export const BUILDING_MAX_LEVELS: Record<string, number> = {
  metalMine: 30,
  crystalMine: 30,
  deuteriumSynthesizer: 30,
  solarPlant: 25,
  roboticsFactory: 20,
  shipyard: 25,
  researchLab: 20,
  navalAcademy: 15,
  supplyDepot: 20,
  orbitalDock: 15,
  terraformingStation: 10,
  tradeCenter: 15,
  militaryAcademy: 15,
  warpGate: 10,
};

export const BASE_STORAGE: Record<string, number> = {
  metal: 10000,
  crystal: 10000,
  deuterium: 5000,
};

export const STORAGE_PER_DEPOT_LEVEL: Record<string, number> = {
  metal: 5000,
  crystal: 5000,
  deuterium: 2500,
};

export const SHIP_COSTS: Record<string, ResourceCost> = {
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
  battlecruiser: { metal: 30000, crystal: 40000, deuterium: 15000 },
  destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
};

export const RESEARCH_COSTS: Record<string, ResourceCost> = {
  energyTech: { metal: 100, crystal: 200, deuterium: 50 },
  weaponsTech: { metal: 300, crystal: 150, deuterium: 100 },
  shieldTech: { metal: 200, crystal: 300, deuterium: 100 },
  driveTech: { metal: 150, crystal: 150, deuterium: 200 },
  computerTech: { metal: 100, crystal: 250, deuterium: 50 },
  astroTech: { metal: 500, crystal: 300, deuterium: 200 },
  quantumTech: { metal: 800, crystal: 600, deuterium: 400 },
  fusionTech: { metal: 600, crystal: 400, deuterium: 300 },
  nanotechResearch: { metal: 400, crystal: 500, deuterium: 250 },
  warpFieldTheory: { metal: 1000, crystal: 800, deuterium: 600 },
};

export const RESEARCH_TIME_MULTIPLIER = 1.5;

export function calculateProduction(buildings: Record<string, number> = {}, research: Record<string, number> = {}) {
  const metalMineLevel = buildings.metalMine || 0;
  const crystalMineLevel = buildings.crystalMine || 0;
  const deuteriumLevel = buildings.deuteriumSynthesizer || 0;
  const tradeCenterLevel = buildings.tradeCenter || 0;
  const terraformLevel = buildings.terraformingStation || 0;
  const energyTech = research.energyTech || 0;

  const terraformBonus = 1 + terraformLevel * 0.15;

  return {
    metal: Math.floor(30 * metalMineLevel * (1 + metalMineLevel / 10) * terraformBonus),
    crystal: Math.floor(20 * crystalMineLevel * (1 + crystalMineLevel / 10) * terraformBonus),
    deuterium: Math.floor(10 * deuteriumLevel * (1 + deuteriumLevel / 12) * terraformBonus),
    credits: Math.floor(50 * tradeCenterLevel * (1 + tradeCenterLevel / 8)),
    food: Math.floor(40 * terraformLevel * (1 + terraformLevel / 5)),
    water: Math.floor(35 * terraformLevel * (1 + terraformLevel / 6)),
    energy: Math.floor(20 + energyTech * 5),
  };
}

export function calculateEnergyBalance(buildings: Record<string, number> = {}, research: Record<string, number> = {}): number {
  const solarLevel = buildings.solarPlant || 0;
  const energyTech = research.energyTech || 0;
  let produced = Math.floor(100 + solarLevel * 50 + energyTech * 10);

  let consumed = 0;
  for (const [type, level] of Object.entries(buildings)) {
    const perUnit = BUILDING_ENERGY[type] || 0;
    if (perUnit < 0) {
      consumed += Math.abs(perUnit) * level;
    }
  }

  return produced - consumed;
}

export function getEnergyModifier(energyBalance: number): number {
  if (energyBalance >= 0) return 1.0;
  if (energyBalance >= -50) return 0.8;
  if (energyBalance >= -100) return 0.6;
  if (energyBalance >= -200) return 0.4;
  return 0.2;
}

export function calculateStorageCapacity(buildings: Record<string, number> = {}): Record<string, number> {
  const depotLevel = buildings.supplyDepot || 0;
  return {
    metal: BASE_STORAGE.metal + depotLevel * STORAGE_PER_DEPOT_LEVEL.metal,
    crystal: BASE_STORAGE.crystal + depotLevel * STORAGE_PER_DEPOT_LEVEL.crystal,
    deuterium: BASE_STORAGE.deuterium + depotLevel * STORAGE_PER_DEPOT_LEVEL.deuterium,
  };
}

export function clampToStorage(resources: ResourceState, capacity: Record<string, number>): ResourceState {
  return {
    ...resources,
    metal: Math.min(resources.metal, capacity.metal),
    crystal: Math.min(resources.crystal, capacity.crystal),
    deuterium: Math.min(resources.deuterium, capacity.deuterium),
  };
}

export function meetsPrerequisites(buildingType: string, buildings: Record<string, number>): boolean {
  const prereqs = BUILDING_PREREQUISITES[buildingType];
  if (!prereqs) return true;
  for (const [required, minLevel] of Object.entries(prereqs)) {
    if ((buildings[required] || 0) < minLevel) return false;
  }
  return true;
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

export function calculateResearchCost(techType: string, currentLevel: number): ResourceCost {
  const baseCost = RESEARCH_COSTS[techType] || RESEARCH_COSTS.energyTech;
  const factor = Math.pow(1.3, Math.max(0, currentLevel));
  return {
    metal: Math.floor(baseCost.metal * factor),
    crystal: Math.floor(baseCost.crystal * factor),
    deuterium: Math.floor(baseCost.deuterium * factor),
  };
}

export function calculateResearchTime(techType: string, currentLevel: number, researchLabLevel: number): number {
  const cost = calculateResearchCost(techType, currentLevel);
  const totalCost = cost.metal + cost.crystal + cost.deuterium;
  const labModifier = 1 + Math.max(0, researchLabLevel) * 0.5;
  const baseTime = Math.max(1, Math.ceil(totalCost / (1000 * labModifier)));
  return Math.ceil(baseTime * Math.pow(RESEARCH_TIME_MULTIPLIER, Math.max(0, currentLevel)));
}

export function getShipBuildTimeModifier(buildings: Record<string, number>): number {
  const navalLevel = buildings.navalAcademy || 0;
  return Math.max(0.5, 1 - navalLevel * 0.05);
}

export function getFleetTravelTimeModifier(buildings: Record<string, number>): number {
  const warpLevel = buildings.warpGate || 0;
  return Math.max(0.3, 1 - warpLevel * 0.10);
}

export function getCombatBonus(buildings: Record<string, number>): number {
  const milLevel = buildings.militaryAcademy || 0;
  return 1 + milLevel * 0.03;
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

function normalizeDailyState(raw: any): DailyState {
  return {
    lastDailyReset: Number(raw?.lastDailyReset || 0),
    lastWeeklyReset: Number(raw?.lastWeeklyReset || 0),
    dailyLoginStreak: Number(raw?.dailyLoginStreak || 0),
    lastLoginDate: String(raw?.lastLoginDate || ''),
    dailyRewardsClaimed: Boolean(raw?.dailyRewardsClaimed),
    weeklyMissions: Array.isArray(raw?.weeklyMissions) ? raw.weeklyMissions : [],
    weeklyMissionsResetAt: Number(raw?.weeklyMissionsResetAt || 0),
  };
}

async function getPlayerStateForUser(userId: string) {
  let playerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });

  if (!playerState) {
    const defaults = {
      userId,
      setupComplete: false,
      planetName: 'New Colony',
      coordinates: '[1:1:1]',
      resources: {
        metal: 500,
        crystal: 500,
        deuterium: 0,
        energy: 0,
        credits: 1000,
        food: 500,
        water: 500,
      },
      buildings: {},
      orbitalBuildings: {},
      research: {},
      units: {},
      commander: {},
      government: {},
      artifacts: [],
      cronJobs: [],
      empireLevel: 1,
      kardashevProgress: { metal: 0, crystal: 0, deuterium: 0, research: 0 },
      totalTurns: 0,
      currentTurns: 100,
      lastResourceUpdate: new Date(),
    };

    [playerState] = await db.insert(playerStates)
      .values(defaults)
      .returning();

    if (!playerState) {
      throw new Error('Failed to create player state');
    }
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

  const energyBalance = calculateEnergyBalance(buildings, research);
  const energyModifier = getEnergyModifier(energyBalance);

  const productionPerHour = calculateProduction(buildings, research);
  const produced = {
    metal: Math.floor(productionPerHour.metal * elapsedHours * energyModifier),
    crystal: Math.floor(productionPerHour.crystal * elapsedHours * energyModifier),
    deuterium: Math.floor(productionPerHour.deuterium * elapsedHours * energyModifier),
    credits: Math.floor((productionPerHour.credits || 0) * elapsedHours),
    food: Math.floor((productionPerHour.food || 0) * elapsedHours),
    water: Math.floor((productionPerHour.water || 0) * elapsedHours),
    energy: productionPerHour.energy,
  };

  const storageCapacity = calculateStorageCapacity(buildings);
  let nextResources: ResourceState = {
    metal: resources.metal + produced.metal,
    crystal: resources.crystal + produced.crystal,
    deuterium: resources.deuterium + produced.deuterium,
    credits: resources.credits + produced.credits,
    food: resources.food + produced.food,
    water: resources.water + produced.water,
    energy: produced.energy,
  };
  nextResources = clampToStorage(nextResources, storageCapacity);

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
    storageCapacity,
    energyBalance,
    energyModifier,
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
  const maxLevel = BUILDING_MAX_LEVELS[buildingType] || 30;
  if (currentLevel >= maxLevel) {
    throw new Error(`Building already at max level (${maxLevel})`);
  }

  if (!meetsPrerequisites(buildingType, buildings)) {
    const prereqs = BUILDING_PREREQUISITES[buildingType];
    const missing = Object.entries(prereqs)
      .filter(([req, lvl]) => (buildings[req] || 0) < lvl)
      .map(([req, lvl]) => `${req} Lv${lvl}`);
    throw new Error(`Missing prerequisites: ${missing.join(', ')}`);
  }

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
    const completeAt = Number(job?.completeAt || 0);
    if (job?.type === 'building' && Number.isFinite(completeAt) && completeAt > 0 && completeAt <= now) {
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
  const buildings = (playerState.buildings as Record<string, number>) || {};

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

  const navalModifier = getShipBuildTimeModifier(buildings);

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
    buildTimeModifier: navalModifier,
    builtAt: now,
  };
}

export async function startResearch(userId: string, techType: string) {
  if (!RESEARCH_COSTS[techType]) {
    throw new Error('Invalid research type');
  }

  const playerState = await getPlayerStateForUser(userId);
  const resources = normalizeResources(playerState.resources);
  const buildings = (playerState.buildings as Record<string, number>) || {};
  const research = ((playerState.research as Record<string, number>) || {}) as Record<string, number>;
  const cronJobs = (Array.isArray(playerState.cronJobs) ? playerState.cronJobs : []) as any[];

  const researchLabLevel = buildings.researchLab || 0;
  if (researchLabLevel < 1) {
    throw new Error('Research Lab required to start research');
  }

  const existingResearchQueue = cronJobs.filter((job) => job?.type === 'research');
  if (existingResearchQueue.length >= 3) {
    throw new Error('Research queue is full (max 3)');
  }

  const currentLevel = research[techType] || 0;
  const cost = calculateResearchCost(techType, currentLevel);

  if (!hasEnoughResources(resources, cost)) {
    throw new Error('Insufficient resources for research');
  }

  const researchTimeSeconds = calculateResearchTime(techType, currentLevel, researchLabLevel);
  const now = Date.now();

  const queueItem: ResearchQueueItem = {
    id: `research_${now}_${Math.random().toString(36).slice(2, 8)}`,
    techType,
    targetLevel: currentLevel + 1,
    cost,
    startedAt: now,
    completeAt: now + researchTimeSeconds * 1000,
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
    techType,
    started: true,
    queueItem,
    researchTimeSeconds,
    resources: nextResources,
    startedAt: now,
  };
}

export async function processResearchQueue(userId: string) {
  const playerState = await getPlayerStateForUser(userId);
  const cronJobs = (Array.isArray(playerState.cronJobs) ? playerState.cronJobs : []) as any[];
  const research = { ...((playerState.research as Record<string, number>) || {}) };
  const now = Date.now();

  const completed: ResearchQueueItem[] = [];
  const remaining: any[] = [];

  for (const job of cronJobs) {
    const completeAt = Number(job?.completeAt || 0);
    if (job?.type === 'research' && Number.isFinite(completeAt) && completeAt > 0 && completeAt <= now) {
      const techType = String(job.techType || '');
      if (techType) {
        research[techType] = (research[techType] || 0) + 1;
      }
      completed.push(job as ResearchQueueItem);
      continue;
    }
    remaining.push(job);
  }

  if (completed.length > 0) {
    await db
      .update(playerStates)
      .set({
        research,
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

export function getStorageLimits(buildings: Record<string, number>): Record<string, number> {
  return calculateStorageCapacity(buildings);
}

export function isStorageFull(resources: ResourceState, buildings: Record<string, number>): Record<string, boolean> {
  const capacity = calculateStorageCapacity(buildings);
  return {
    metal: resources.metal >= capacity.metal,
    crystal: resources.crystal >= capacity.crystal,
    deuterium: resources.deuterium >= capacity.deuterium,
  };
}

export function calculateColonyStats(colony: Colony): {
  production: ReturnType<typeof calculateProduction>;
  energyBalance: number;
  energyModifier: number;
  storageCapacity: Record<string, number>;
  combatBonus: number;
  shipBuildModifier: number;
  travelModifier: number;
} {
  const production = calculateProduction(colony.buildings);
  const energyBalance = calculateEnergyBalance(colony.buildings);
  const energyModifier = getEnergyModifier(energyBalance);
  const storageCapacity = calculateStorageCapacity(colony.buildings);
  const combatBonus = getCombatBonus(colony.buildings);
  const shipBuildModifier = getShipBuildTimeModifier(colony.buildings);
  const travelModifier = getFleetTravelTimeModifier(colony.buildings);

  return { production, energyBalance, energyModifier, storageCapacity, combatBonus, shipBuildModifier, travelModifier };
}

export function initializeColony(id: string, name: string, coordinates: string): Colony {
  return {
    id,
    name,
    coordinates,
    buildings: {},
    resources: {
      metal: 500,
      crystal: 500,
      deuterium: 0,
      energy: 0,
      credits: 500,
      food: 300,
      water: 300,
    },
    orbitalBuildings: {},
    lastResourceUpdate: Date.now(),
    habitability: 100,
  };
}

export function processColonyTick(colony: Colony): Colony {
  const now = Date.now();
  const elapsedMs = now - colony.lastResourceUpdate;
  const elapsedHours = elapsedMs / 3600000;

  const production = calculateProduction(colony.buildings);
  const energyBalance = calculateEnergyBalance(colony.buildings);
  const energyModifier = getEnergyModifier(energyBalance);
  const storageCapacity = calculateStorageCapacity(colony.buildings);

  const produced = {
    metal: Math.floor(production.metal * elapsedHours * energyModifier),
    crystal: Math.floor(production.crystal * elapsedHours * energyModifier),
    deuterium: Math.floor(production.deuterium * elapsedHours * energyModifier),
    credits: Math.floor((production.credits || 0) * elapsedHours),
    food: Math.floor((production.food || 0) * elapsedHours),
    water: Math.floor((production.water || 0) * elapsedHours),
    energy: production.energy,
  };

  let nextResources: ResourceState = {
    metal: colony.resources.metal + produced.metal,
    crystal: colony.resources.crystal + produced.crystal,
    deuterium: colony.resources.deuterium + produced.deuterium,
    credits: colony.resources.credits + produced.credits,
    food: colony.resources.food + produced.food,
    water: colony.resources.water + produced.water,
    energy: produced.energy,
  };
  nextResources = clampToStorage(nextResources, storageCapacity);

  const terraformLevel = colony.buildings.terraformingStation || 0;
  const habitability = Math.min(200, 100 + terraformLevel * 15);

  return {
    ...colony,
    resources: nextResources,
    lastResourceUpdate: now,
    habitability,
  };
}

export async function processDailyReset(userId: string) {
  const playerState = await getPlayerStateForUser(userId);
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  const dailyState = normalizeDailyState((playerState as any).dailyState || {});

  const lastLogin = dailyState.lastLoginDate;
  let newStreak = 1;
  if (lastLogin) {
    const yesterday = new Date(now - 86400000).toISOString().split('T')[0];
    if (lastLogin === yesterday) {
      newStreak = dailyState.dailyLoginStreak + 1;
    } else if (lastLogin !== today) {
      newStreak = 1;
    }
  }

  const streakBonus = Math.min(newStreak, 7);
  const loginRewardCredits = 100 + streakBonus * 50;
  const loginRewardMetal = 50 + streakBonus * 25;
  const loginRewardCrystal = 30 + streakBonus * 15;

  const resources = normalizeResources(playerState.resources);
  const nextResources: ResourceState = {
    ...resources,
    credits: resources.credits + loginRewardCredits,
    metal: resources.metal + loginRewardMetal,
    crystal: resources.crystal + loginRewardCrystal,
  };

  const nextDailyState: DailyState = {
    lastDailyReset: now,
    lastWeeklyReset: dailyState.lastWeeklyReset,
    dailyLoginStreak: newStreak,
    lastLoginDate: today,
    dailyRewardsClaimed: true,
    weeklyMissions: dailyState.weeklyMissions,
    weeklyMissionsResetAt: dailyState.weeklyMissionsResetAt,
  };

  await db
    .update(playerStates)
    .set({
      resources: nextResources,
      updatedAt: new Date(now),
    })
    .where(eq(playerStates.userId, userId));

  return {
    userId,
    loginStreak: newStreak,
    rewards: {
      credits: loginRewardCredits,
      metal: loginRewardMetal,
      crystal: loginRewardCrystal,
    },
    resources: nextResources,
    date: today,
  };
}

export async function processWeeklyReset(userId: string) {
  const playerState = await getPlayerStateForUser(userId);
  const now = Date.now();
  const dailyState = normalizeDailyState((playerState as any).dailyState || {});

  const weeklyMissions = [
    { id: `wm_${now}_1`, type: 'build', description: 'Build 3 buildings', target: 3, progress: 0, rewardCredits: 500, rewardMetal: 200, completed: false },
    { id: `wm_${now}_2`, type: 'research', description: 'Complete 2 research', target: 2, progress: 0, rewardCredits: 400, rewardCrystal: 300, completed: false },
    { id: `wm_${now}_3`, type: 'combat', description: 'Win 5 battles', target: 5, progress: 0, rewardCredits: 600, rewardDeuterium: 150, completed: false },
    { id: `wm_${now}_4`, type: 'trade', description: 'Trade 10000 resources', target: 10000, progress: 0, rewardCredits: 300, rewardMetal: 150, rewardCrystal: 150, completed: false },
  ];

  const nextDailyState: DailyState = {
    lastDailyReset: dailyState.lastDailyReset,
    lastWeeklyReset: now,
    dailyLoginStreak: dailyState.dailyLoginStreak,
    lastLoginDate: dailyState.lastLoginDate,
    dailyRewardsClaimed: false,
    weeklyMissions,
    weeklyMissionsResetAt: now,
  };

  await db
    .update(playerStates)
    .set({
      updatedAt: new Date(now),
    })
    .where(eq(playerStates.userId, userId));

  return {
    userId,
    weeklyMissions,
    resetAt: now,
  };
}

export async function processCoreGameTick(userId: string) {
  const resourceTick = await processResourceTick(userId);
  const queueTick = await processConstructionQueue(userId);
  const researchTick = await processResearchQueue(userId);

  return {
    userId,
    resourceTick,
    queueTick,
    researchTick,
    processedAt: Date.now(),
  };
}

class GameEngine {
  private userId: string;

  constructor(userId: string = "default") {
    this.userId = userId;
    console.log('Game engine started!');
  }

  public update() {
    console.log('Game engine update');
  }

  public getResources() {
    return resourceService.getResources(this.userId);
  }

  public getFleet() {
    return fleetService.getFleet(this.userId);
  }

  public getTechnologyTree() {
    return technologyService.getTechnologyTree(this.userId);
  }
}

export const gameEngine = new GameEngine();
