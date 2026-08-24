import { STARGATE_BALANCE_RULES } from "./balanceRules";
import type { MothershipState, StrategicMoon, StrategicWorld } from "./systemStateService";

export type MissionType = "exploration" | "survey" | "salvage" | "rescue";

export const MISSION_TYPES: MissionType[] = ["exploration", "survey", "salvage", "rescue"];

const WORLD_TYPE_MULTIPLIERS: Record<StrategicWorld["worldType"], { naquadah: number; food: number; water: number }> = {
  homeworld: { naquadah: 1.2, food: 1.2, water: 1.2 },
  frontier: { naquadah: 1, food: 1, water: 1 },
  mining: { naquadah: 1.8, food: 0.75, water: 0.75 },
  agri: { naquadah: 0.75, food: 1.8, water: 1.25 },
  military: { naquadah: 1.15, food: 0.9, water: 0.9 },
};

export const MISSION_PROFILES: Record<MissionType, {
  label: string;
  durationHours: number;
  cost: number;
  fuel: number;
  riskPercent: number;
  purpose: string;
}> = {
  exploration: { label: "Deep Exploration", durationHours: 1, cost: 3_000, fuel: 25, riskPercent: 8, purpose: "Discover and chart an unclaimed strategic world." },
  survey: { label: "Resource Survey", durationHours: 0.5, cost: 2_000, fuel: 15, riskPercent: 4, purpose: "Scan frontier space for a better resource profile." },
  salvage: { label: "Derelict Salvage", durationHours: 0.75, cost: 5_000, fuel: 20, riskPercent: 15, purpose: "Recover Naquadah, Food, and Water from an abandoned convoy." },
  rescue: { label: "Humanitarian Rescue", durationHours: 0.6, cost: 4_000, fuel: 18, riskPercent: 6, purpose: "Extract stranded colonists and increase frontier population." },
};

export function isMissionType(value: unknown): value is MissionType {
  return typeof value === "string" && MISSION_TYPES.includes(value as MissionType);
}

export function getMothershipModuleLevel(ship: MothershipState, module: "capacity" | "weapons" | "shields" | "hangars") {
  return module === "capacity" ? Math.floor(ship.capacity / 10) : ship[module];
}

export function getMothershipModuleCost(ship: MothershipState, module: "capacity" | "weapons" | "shields" | "hangars") {
  const level = getMothershipModuleLevel(ship, module);
  return STARGATE_BALANCE_RULES.mothership.moduleBaseCosts[module] + level * STARGATE_BALANCE_RULES.mothership.moduleCostStep;
}

export function getMothershipTelemetry(ship: MothershipState) {
  const combatPower = ship.weapons * 500 + ship.shields * 400 + ship.hangars * 250 + ship.capacity * 10;
  const explorationRange = ship.capacity * 2 + ship.hangars * 10;
  const defenseRating = Math.floor(ship.hull * 10 + ship.shields * 125);
  const readiness = ship.owned ? Math.min(100, Math.floor((ship.hull / 100) * 70 + (ship.maxFuel ? ship.fuel / ship.maxFuel : 0) * 30)) : 0;
  return { combatPower, explorationRange, defenseRating, readiness, crewCapacity: ship.capacity, fleetSupportSlots: ship.hangars * 4 };
}

export function getMissionProfile(type: MissionType) {
  return MISSION_PROFILES[type];
}

export function getMoonDefenseTelemetry(moon: StrategicMoon) {
  const networkRules = STARGATE_BALANCE_RULES.worlds.moonDefense.network;
  const shieldRules = STARGATE_BALANCE_RULES.worlds.moonDefense.shield;
  const networkLevel = moon.defenseNetwork.level;
  const shieldLevel = moon.planetaryShield.level;
  return {
    developmentSlots: moon.developmentSlots,
    usedDevelopmentSlots: moon.usedDevelopmentSlots,
    availableDevelopmentSlots: Math.max(0, moon.developmentSlots - moon.usedDevelopmentSlots),
    network: { ...moon.defenseNetwork, nextCost: networkLevel >= networkRules.maxLevel ? 0 : networkRules.baseCost + networkLevel * networkRules.costStep, nextLevel: Math.min(networkRules.maxLevel, networkLevel + 1), unlockLevel: networkRules.minimumMoonDevelopment },
    shield: { ...moon.planetaryShield, nextCost: shieldLevel >= shieldRules.maxLevel ? 0 : shieldRules.baseCost + shieldLevel * shieldRules.costStep, nextLevel: Math.min(shieldRules.maxLevel, shieldLevel + 1), unlockLevel: shieldRules.minimumMoonDevelopment },
    totalEnergyUpkeepPerHour: moon.defenseNetwork.energyUpkeepPerHour + moon.planetaryShield.energyUpkeepPerHour,
    totalDefensePower: moon.defenseRating + moon.defenseNetwork.defensePower,
  };
}

export function getWorldTelemetry(world: StrategicWorld) {
  const multiplier = WORLD_TYPE_MULTIPLIERS[world.worldType];
  const stabilityFactor = world.stability / 100;
  const developmentFactor = 1 + Math.max(0, world.developmentLevel - 1) * 0.12;
  const conditionFactor = world.condition / 100;
  const attack = Math.floor(world.bonuses.attack * STARGATE_BALANCE_RULES.worlds.attackBonusPerLevel * conditionFactor);
  const moonDefensePower = world.moons.reduce((total, moon) => total + moon.defenseNetwork.defensePower, 0);
  const moonShieldCapacity = world.moons.reduce((total, moon) => total + moon.planetaryShield.capacity, 0);
  const defense = Math.floor((world.defenses + world.bonuses.defense * STARGATE_BALANCE_RULES.worlds.defenseBonusPerLevel + moonDefensePower) * conditionFactor);
  const covert = Math.floor(world.bonuses.covert * STARGATE_BALANCE_RULES.worlds.covertBonusPerLevel * stabilityFactor);
  const unitProductionPerDay = Math.floor(STARGATE_BALANCE_RULES.worlds.baseUnitProductionPerDay * developmentFactor * (1 + world.bonuses.unitProduction * 0.2) * stabilityFactor);
  const incomePerTurn = Math.floor(STARGATE_BALANCE_RULES.worlds.baseIncomePerTurn * (1 + world.bonuses.income * 0.15) * developmentFactor * stabilityFactor);
  const classModifiers = world.modifiers;
  const perHour = {
    naquadah: Math.floor(STARGATE_BALANCE_RULES.worlds.baseProductionPerHour.naquadah * multiplier.naquadah * classModifiers.naquadahProduction * developmentFactor * conditionFactor),
    food: Math.floor(STARGATE_BALANCE_RULES.worlds.baseProductionPerHour.food * multiplier.food * classModifiers.foodProduction * developmentFactor * conditionFactor),
    water: Math.floor(STARGATE_BALANCE_RULES.worlds.baseProductionPerHour.water * multiplier.water * classModifiers.waterProduction * developmentFactor * conditionFactor),
  };
  return {
    attack,
    defense,
    covert,
    unitProductionPerDay,
    incomePerTurn,
    productionPerHour: perHour,
    capacity: {
      naquadah: Math.floor((STARGATE_BALANCE_RULES.worlds.baseCapacity.naquadah + world.developmentLevel * STARGATE_BALANCE_RULES.worlds.capacityPerDevelopment.naquadah) * classModifiers.storageMultiplier),
      food: Math.floor((STARGATE_BALANCE_RULES.worlds.baseCapacity.food + world.developmentLevel * STARGATE_BALANCE_RULES.worlds.capacityPerDevelopment.food) * classModifiers.storageMultiplier),
      water: Math.floor((STARGATE_BALANCE_RULES.worlds.baseCapacity.water + world.developmentLevel * STARGATE_BALANCE_RULES.worlds.capacityPerDevelopment.water) * classModifiers.storageMultiplier),
    },
    stabilityFactor: Number(stabilityFactor.toFixed(2)),
    conditionFactor: Number(conditionFactor.toFixed(2)),
    developmentFactor: Number(developmentFactor.toFixed(2)),
    researchSpeed: classModifiers.researchSpeed,
    shipyardSpeed: classModifiers.shipyardSpeed,
    moonDefensePower,
    moonShieldCapacity,
    defenseStrength: classModifiers.defenseStrength,
    covertStrength: classModifiers.covertStrength,
    populationGrowth: classModifiers.populationGrowth,
    explorationRisk: classModifiers.explorationRisk,
    colonizationCost: classModifiers.colonizationCost,
    populationFreeCapacity: Math.max(0, world.maxPopulation - world.population),
  };
}

export function getWorldDevelopmentCost(world: StrategicWorld) {
  return STARGATE_BALANCE_RULES.worlds.developmentBaseCost + Math.max(0, world.developmentLevel - 1) * STARGATE_BALANCE_RULES.worlds.developmentCostStep;
}

export function getDefenseCost(quantity: number) {
  return Math.max(1, Math.min(STARGATE_BALANCE_RULES.worlds.maxFortifications, Math.floor(quantity))) * STARGATE_BALANCE_RULES.worlds.defenseCostPerUnit;
}

export function getRepairCost(world: StrategicWorld) {
  return Math.max(0, 100 - world.condition) * STARGATE_BALANCE_RULES.worlds.repairCostPerCondition;
}
