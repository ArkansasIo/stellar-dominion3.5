import { COLONIZATION_CONFIG, ColonyState, BaseRequirements } from "../../shared/config/xenoberage/colonizationConfig";
import { db } from "../db";
import { playerColonies } from "../../shared/schema";

/**
 * Create a new colony on a planet.
 */
export async function createColony(
  userId: string,
  sectorId: string,
  planetId: string
): Promise<ColonyState> {
  const colony: ColonyState = {
    id: crypto.randomUUID(),
    userId,
    sectorId,
    planetId,
    population: 0,
    hasBase: false,
    baseLevel: 0,
    organics: 0,
    ore: 0,
    goods: 0,
    credits: 0,
  };

  await db.insert(playerColonies).values({
    id: colony.id,
    playerId: userId,
    planetId: parseInt(planetId) || 0,
    colonyName: `Colony ${sectorId}`,
    colonyType: "standard",
    colonyLevel: 0,
    population: 0,
  });

  return colony;
}

/**
 * Calculate colonist production (growth from organics available).
 * Formula: currentPop * organicsLevel * productionRate
 */
export function calculateColonistProduction(
  organicsLevel: number,
  productionRate: number = COLONIZATION_CONFIG.colonistProductionRate
): number {
  return Math.floor(organicsLevel * productionRate);
}

/**
 * Calculate colonist reproduction after food availability check.
 * Formula: currentPop * (1 + reproductionRate) if organics sufficient
 */
export function calculateColonistReproduction(
  currentPop: number,
  organics: number,
  consumptionRate: number = COLONIZATION_CONFIG.organicsConsumption
): number {
  const requiredOrganics = currentPop * consumptionRate;
  if (organics >= requiredOrganics) {
    return Math.floor(currentPop * (1 + COLONIZATION_CONFIG.colonistReproductionRate));
  }
  return currentPop;
}

/**
 * Calculate starvation deaths when organics are insufficient.
 * Deaths = currentPop * starvationDeathRate
 */
export function calculateStarvation(
  currentPop: number,
  organics: number,
  consumptionRate: number = COLONIZATION_CONFIG.organicsConsumption,
  deathRate: number = COLONIZATION_CONFIG.starvationDeathRate
): number {
  const requiredOrganics = currentPop * consumptionRate;
  if (organics < requiredOrganics) {
    return Math.floor(currentPop * deathRate);
  }
  return 0;
}

/**
 * Calculate organics consumption for a population.
 * consumption = population * consumptionRate
 */
export function calculateOrganicsConsumption(
  population: number,
  consumptionRate: number = COLONIZATION_CONFIG.organicsConsumption
): number {
  return Math.floor(population * consumptionRate);
}

/**
 * Process a full colonist tick for a planet.
 * Handles production, reproduction, and starvation.
 */
export function processColonistTick(planet: {
  population: number;
  organics: number;
  level: number;
}): {
  population: number;
  organics: number;
  starvationDeaths: number;
  consumedOrganics: number;
} {
  let population = planet.population;
  let organics = planet.organics;

  // Calculate consumption
  const consumedOrganics = calculateOrganicsConsumption(population);
  organics = Math.max(0, organics - consumedOrganics);

  // Check for starvation
  const starvationDeaths = calculateStarvation(population, organics);
  population = Math.max(0, population - starvationDeaths);

  // Calculate reproduction if no starvation
  if (starvationDeaths === 0) {
    const reproduction = calculateColonistReproduction(population, organics);
    population = Math.min(reproduction, COLONIZATION_CONFIG.colonistLimit);
  }

  // Apply colonist limit
  population = enforceColonistLimit(population, COLONIZATION_CONFIG.colonistLimit);

  return { population, organics, starvationDeaths, consumedOrganics };
}

/**
 * Enforce colonist limit on a population.
 */
export function enforceColonistLimit(
  population: number,
  limit: number = COLONIZATION_CONFIG.colonistLimit
): number {
  return Math.min(population, limit);
}

/**
 * Check if base requirements are met.
 */
export function canBuildBase(
  planet: { ore: number; goods: number; organics: number; credits: number },
  requirements: BaseRequirements = {
    ore: COLONIZATION_CONFIG.baseOre,
    goods: COLONIZATION_CONFIG.baseGoods,
    organics: COLONIZATION_CONFIG.baseOrganics,
    credits: COLONIZATION_CONFIG.baseCredits,
  }
): boolean {
  return (
    planet.ore >= requirements.ore &&
    planet.goods >= requirements.goods &&
    planet.organics >= requirements.organics &&
    planet.credits >= requirements.credits
  );
}

/**
 * Build a base on a planet. Deducts resources and sets base flag.
 */
export function buildBase(
  planet: ColonyState,
  requirements: BaseRequirements = {
    ore: COLONIZATION_CONFIG.baseOre,
    goods: COLONIZATION_CONFIG.baseGoods,
    organics: COLONIZATION_CONFIG.baseOrganics,
    credits: COLONIZATION_CONFIG.baseCredits,
  }
): ColonyState {
  if (!canBuildBase(planet, requirements)) {
    return planet;
  }

  return {
    ...planet,
    ore: planet.ore - requirements.ore,
    goods: planet.goods - requirements.goods,
    organics: planet.organics - requirements.organics,
    credits: planet.credits - requirements.credits,
    hasBase: true,
    baseLevel: planet.baseLevel + 1,
  };
}

/**
 * Calculate doomsday effect on a planet's population.
 * If population exceeds doomsdayValue, a percentage is killed.
 */
export function calculateDoomsdayEffect(
  population: number,
  doomsdayValue: number = COLONIZATION_CONFIG.doomsdayValue
): { survived: number; killed: number } {
  if (population <= doomsdayValue) {
    return { survived: population, killed: 0 };
  }
  const excess = population - doomsdayValue;
  const killed = Math.floor(excess * 0.10);
  return { survived: population - killed, killed };
}

/**
 * Calculate space plague casualties.
 * kills = population * plagueRate
 */
export function calculateSpacePlague(
  population: number,
  plagueRate: number = COLONIZATION_CONFIG.spacePlagueKills
): number {
  return Math.floor(population * plagueRate);
}
