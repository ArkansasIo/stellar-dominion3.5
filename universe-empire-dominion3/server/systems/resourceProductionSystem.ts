import { RESOURCE_CONFIG, Resources, ResourceLimits } from "../../shared/config/xenoberage/resourceConfig";

/**
 * Calculate ore production for a planet per tick.
 * Formula: planetLevel * productionSetting * baseRate
 */
export function calculateOreProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.ore.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate organics production for a planet per tick.
 */
export function calculateOrganicsProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.organics.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate goods production for a planet per tick.
 */
export function calculateGoodsProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.goods.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate energy production for a planet per tick.
 */
export function calculateEnergyProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.energy.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate fighter production for a planet per tick.
 */
export function calculateFighterProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.fighters.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate torpedo production for a planet per tick.
 */
export function calculateTorpedoProduction(
  planetLevel: number,
  productionSetting: number,
  baseRate: number = RESOURCE_CONFIG.torpedoes.prate
): number {
  return Math.floor(planetLevel * (productionSetting / 100) * baseRate);
}

/**
 * Calculate credits production from leftover production capacity.
 * remainingProduction = 100 - (ore + organics + goods + energy + fighters + torpedoes)
 * Credits = planetLevel * remainingProduction * creditsPrate
 */
export function calculateCreditsProduction(
  planetLevel: number,
  remainingProduction: number
): number {
  return Math.floor(planetLevel * (remainingProduction / 100) * RESOURCE_CONFIG.credits.prate);
}

/**
 * Process a full production cycle for a planet.
 * Returns the produced resources.
 */
export function processPlanetProduction(planet: {
  level: number;
  prodOre: number;
  prodOrganics: number;
  prodGoods: number;
  prodEnergy: number;
  prodFighters: number;
  prodTorpedoes: number;
  credits: number;
}): Resources {
  const ore = calculateOreProduction(planet.level, planet.prodOre);
  const organics = calculateOrganicsProduction(planet.level, planet.prodOrganics);
  const goods = calculateGoodsProduction(planet.level, planet.prodGoods);
  const energy = calculateEnergyProduction(planet.level, planet.prodEnergy);
  const fighters = calculateFighterProduction(planet.level, planet.prodFighters);
  const torpedoes = calculateTorpedoProduction(planet.level, planet.prodTorpedoes);

  const totalProdUsed =
    planet.prodOre +
    planet.prodOrganics +
    planet.prodGoods +
    planet.prodEnergy +
    planet.prodFighters +
    planet.prodTorpedoes;

  const remainingProduction = Math.max(0, 100 - totalProdUsed);
  const credits = planet.credits + calculateCreditsProduction(planet.level, remainingProduction);

  return { ore, organics, goods, energy, fighters, torpedoes, credits };
}

/**
 * Apply resource limits to a set of resources.
 * Clamps each resource to its maximum limit.
 */
export function applyResourceLimits(
  resources: Resources,
  limits: ResourceLimits = {
    ore: RESOURCE_CONFIG.ore.limit,
    organics: RESOURCE_CONFIG.organics.limit,
    goods: RESOURCE_CONFIG.goods.limit,
    energy: RESOURCE_CONFIG.energy.limit,
  }
): Resources {
  return {
    ...resources,
    ore: Math.min(resources.ore, limits.ore),
    organics: Math.min(resources.organics, limits.organics),
    goods: Math.min(resources.goods, limits.goods),
    energy: Math.min(resources.energy, limits.energy),
    fighters: resources.fighters,
    torpedoes: resources.torpedoes,
    credits: Math.min(resources.credits, RESOURCE_CONFIG.maxCreditsOnPlanet),
  };
}
