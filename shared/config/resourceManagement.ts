export type ManagedResourceId =
  | "metal"
  | "crystal"
  | "deuterium"
  | "energy"
  | "naquadah"
  | "food"
  | "water";

export interface ResourceCost {
  metal: number;
  crystal: number;
  deuterium: number;
}

export interface ResourceEconomySnapshot {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  naquadah: number;
  naquadahProduction: number;
  naquadahConsumption: number;
  naquadahDemand: Record<string, number>;
  foodProduction: number;
  foodConsumption: number;
  food: number;
  waterProduction: number;
  waterConsumption: number;
  water: number;
}

export const RESOURCE_STORAGE_BASE: Record<ManagedResourceId, number> = {
  metal: 10_000,
  crystal: 10_000,
  deuterium: 10_000,
  energy: 50_000,
  naquadah: 50_000,
  food: 5_000,
  water: 6_000,
};

export const RESOURCE_STORAGE_BUILDINGS: Record<ManagedResourceId, string> = {
  metal: "metalStorage",
  crystal: "crystalStorage",
  deuterium: "deuteriumStorage",
  energy: "energyStorage",
  naquadah: "naquadahVault",
  food: "foodStorageFacility",
  water: "waterStorageFacility",
};

export const RESOURCE_SYSTEM_COSTS: Record<string, ResourceCost> = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
  roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100 },
  naquadahExtractor: { metal: 1_200, crystal: 800, deuterium: 500 },
  foodHydroponics: { metal: 600, crystal: 400, deuterium: 100 },
  waterRecycler: { metal: 700, crystal: 300, deuterium: 200 },
  metalStorage: { metal: 500, crystal: 250, deuterium: 0 },
  crystalStorage: { metal: 450, crystal: 350, deuterium: 0 },
  deuteriumStorage: { metal: 700, crystal: 450, deuterium: 100 },
  energyStorage: { metal: 650, crystal: 400, deuterium: 150 },
  naquadahVault: { metal: 1_500, crystal: 1_000, deuterium: 500 },
  foodStorageFacility: { metal: 550, crystal: 300, deuterium: 50 },
  waterStorageFacility: { metal: 600, crystal: 250, deuterium: 75 },
};

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function levelOf(buildings: Record<string, unknown>, key: string): number {
  return Math.max(0, Math.floor(finiteNumber(buildings[key], 0)));
}

function populationByClass(buildings: Record<string, unknown>) {
  return {
    workers: Math.max(0, finiteNumber(buildings.workerCount ?? buildings.workers, 100)),
    scientists: Math.max(0, finiteNumber(buildings.scientistCount ?? buildings.scientists, 10)),
    engineers: Math.max(0, finiteNumber(buildings.engineerCount ?? buildings.engineers, 10)),
    military: Math.max(0, finiteNumber(buildings.militaryCount ?? buildings.soldiers, 20)),
    administrators: Math.max(0, finiteNumber(buildings.administratorCount ?? buildings.administrators, 5)),
    civilians: Math.max(0, finiteNumber(buildings.civilianCount ?? buildings.civilians, 50)),
  };
}

export function calculateManagedStorageCapacity(resourceId: ManagedResourceId, buildings: object = {}): number {
  const values = buildings as Record<string, unknown>;
  const storageLevel = Math.min(50, levelOf(values, RESOURCE_STORAGE_BUILDINGS[resourceId]));
  return Math.floor(RESOURCE_STORAGE_BASE[resourceId] * Math.pow(1.5, storageLevel));
}

export function calculateManagedStorageCapacities(buildings: object = {}): Record<ManagedResourceId, number> {
  return Object.fromEntries(
    (Object.keys(RESOURCE_STORAGE_BASE) as ManagedResourceId[]).map((resourceId) => [
      resourceId,
      calculateManagedStorageCapacity(resourceId, buildings),
    ]),
  ) as Record<ManagedResourceId, number>;
}

export function calculateNaquadahDemand(buildings: Record<string, unknown> = {}): Record<string, number> {
  return {
    "Shipyard fabrication": levelOf(buildings, "shipyard") * 1.5,
    "Research lattice": levelOf(buildings, "researchLab") * 1,
    "Stargate operations": levelOf(buildings, "stargateNetwork") * 12,
  };
}

export function calculateLifeSupportEconomy(buildings: Record<string, unknown> = {}, bonusMultiplier = 1) {
  const population = populationByClass(buildings);
  const workerCount = population.workers + population.engineers;
  const totalPopulation = Object.values(population).reduce((sum, value) => sum + value, 0);
  const foodConsumption = totalPopulation;
  const waterConsumption = totalPopulation + workerCount * 0.15;
  const foodProduction = 1.8 * workerCount * (1 + levelOf(buildings, "foodHydroponics") * 0.25) * bonusMultiplier;
  const waterProduction = 2.2 * workerCount * (1 + levelOf(buildings, "waterRecycler") * 0.3) * bonusMultiplier;

  return {
    foodProduction,
    foodConsumption,
    food: foodProduction - foodConsumption,
    waterProduction,
    waterConsumption,
    water: waterProduction - waterConsumption,
  };
}

export function calculateResourceEconomy(
  buildings: Record<string, unknown> = {},
  research: Record<string, unknown> = {},
  bonusMultiplier = 1,
): ResourceEconomySnapshot {
  const metalMineLevel = levelOf(buildings, "metalMine");
  const crystalMineLevel = levelOf(buildings, "crystalMine");
  const deuteriumLevel = levelOf(buildings, "deuteriumSynthesizer");
  const solarPlantLevel = levelOf(buildings, "solarPlant");
  const naquadahExtractorLevel = levelOf(buildings, "naquadahExtractor");
  const energyTech = levelOf(research, "energyTech");
  const lifeSupport = calculateLifeSupportEconomy(buildings, bonusMultiplier);

  const metal = Math.floor(30 * metalMineLevel * (1 + metalMineLevel / 10) * bonusMultiplier);
  const crystal = Math.floor(20 * crystalMineLevel * (1 + crystalMineLevel / 10) * bonusMultiplier);
  const deuterium = Math.floor(10 * deuteriumLevel * (1 + deuteriumLevel / 12) * bonusMultiplier);
  const naquadahProduction = Math.floor(25 * naquadahExtractorLevel * (1 + naquadahExtractorLevel / 10) * bonusMultiplier);
  const naquadahDemand = calculateNaquadahDemand(buildings);
  const naquadahConsumption = Object.values(naquadahDemand).reduce((sum, value) => sum + value, 0);
  const energyProduction = Math.floor((20 * solarPlantLevel * (1 + solarPlantLevel / 10)) + energyTech * 5);
  const energyConsumption =
    metalMineLevel * 10 +
    crystalMineLevel * 10 +
    deuteriumLevel * 20 +
    naquadahExtractorLevel * 25 +
    levelOf(buildings, "foodHydroponics") * 8 +
    levelOf(buildings, "waterRecycler") * 8;

  return {
    metal,
    crystal,
    deuterium,
    energy: energyProduction - energyConsumption,
    naquadah: naquadahProduction - naquadahConsumption,
    naquadahProduction,
    naquadahConsumption,
    naquadahDemand,
    ...lifeSupport,
  };
}

export function applyManagedResourceTick(
  resources: object = {},
  buildings: object = {},
  research: object = {},
  elapsedHours: number,
  bonusMultiplier = 1,
) {
  const current = resources as Record<string, unknown>;
  const economy = calculateResourceEconomy(buildings as Record<string, unknown>, research as Record<string, unknown>, bonusMultiplier);
  const capacities = calculateManagedStorageCapacities(buildings);
  const elapsed = Math.max(0, Number.isFinite(elapsedHours) ? elapsedHours : 0);
  const produced = {
    metal: Math.floor(economy.metal * elapsed),
    crystal: Math.floor(economy.crystal * elapsed),
    deuterium: Math.floor(economy.deuterium * elapsed),
    naquadah: Math.floor(economy.naquadah * elapsed),
    food: Math.floor(economy.food * elapsed),
    water: Math.floor(economy.water * elapsed),
    energy: economy.energy,
  };
  const clamp = (resourceId: ManagedResourceId, amount: number) =>
    Math.max(0, Math.min(capacities[resourceId], amount));

  return {
    economy,
    capacities,
    produced,
    resources: {
      ...current,
      credits: Number(current.credits) || 0,
      metal: clamp("metal", (Number(current.metal) || 0) + produced.metal),
      crystal: clamp("crystal", (Number(current.crystal) || 0) + produced.crystal),
      deuterium: clamp("deuterium", (Number(current.deuterium) || 0) + produced.deuterium),
      naquadah: clamp("naquadah", (Number(current.naquadah) || 0) + produced.naquadah),
      food: clamp("food", (Number(current.food) || 0) + produced.food),
      water: clamp("water", (Number(current.water) || 0) + produced.water),
      energy: produced.energy,
    },
  };
}

export function calculateUpgradeCost(buildingId: string, currentLevel: number): ResourceCost {
  const base = RESOURCE_SYSTEM_COSTS[buildingId] || { metal: 100, crystal: 50, deuterium: 0 };
  const factor = Math.pow(1.15, Math.max(0, Math.floor(currentLevel)));
  return {
    metal: Math.floor(base.metal * factor),
    crystal: Math.floor(base.crystal * factor),
    deuterium: Math.floor(base.deuterium * factor),
  };
}

export function isResourceCostAffordable(resources: object, cost: ResourceCost): boolean {
  const values = resources as Record<string, unknown>;
  return finiteNumber(values.metal) >= cost.metal
    && finiteNumber(values.crystal) >= cost.crystal
    && finiteNumber(values.deuterium) >= cost.deuterium;
}

export const RESOURCE_MANAGEMENT_BUILDINGS = Object.keys(RESOURCE_SYSTEM_COSTS);

export function calculateNaquadahStorageCapacity(buildings: Record<string, unknown> = {}): number {
  return calculateManagedStorageCapacity("naquadah", buildings);
}

export function calculateFoodStorageCapacity(buildings: Record<string, unknown> = {}): number {
  return calculateManagedStorageCapacity("food", buildings);
}

export function calculateWaterStorageCapacity(buildings: Record<string, unknown> = {}): number {
  return calculateManagedStorageCapacity("water", buildings);
}
