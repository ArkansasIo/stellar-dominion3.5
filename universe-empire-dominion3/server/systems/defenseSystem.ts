import { COMBAT_CONFIG, SectorDefenses } from "../../shared/config/xenoberage/combatConfig";

/**
 * Calculate defense degradation over time.
 * degradedValue = defenseValue * (1 - degradeRate) ^ ticks
 */
export function calculateDefenseDegrade(
  defenseValue: number,
  degradeRate: number = COMBAT_CONFIG.defenceDegradeRate,
  ticks: number = 1
): number {
  return Math.floor(defenseValue * Math.pow(1 - degradeRate, ticks));
}

/**
 * Process defense degradation for a sector per tick.
 * Degrades fighters and mines that are unsupported by a planet.
 */
export function processDefenseDegrade(sector: {
  fighters: number;
  mines: number;
  hasPlanetOwner: boolean;
}): { fighters: number; mines: number } {
  if (sector.hasPlanetOwner) {
    return { fighters: sector.fighters, mines: sector.mines };
  }

  return {
    fighters: calculateDefenseDegrade(sector.fighters),
    mines: calculateDefenseDegrade(sector.mines),
  };
}

/**
 * Calculate energy cost to maintain fighters.
 * energyNeeded = fighterCount * energyPerFighter
 */
export function calculateFighterMaintenance(
  fighterCount: number,
  energyPerFighter: number = COMBAT_CONFIG.energyPerFighter,
  availableEnergy: number
): { maintained: number; energyUsed: number; excess: number } {
  const energyNeeded = Math.ceil(fighterCount * energyPerFighter);
  if (availableEnergy >= energyNeeded) {
    return {
      maintained: fighterCount,
      energyUsed: energyNeeded,
      excess: availableEnergy - energyNeeded,
    };
  }

  const maintained = Math.floor(availableEnergy / energyPerFighter);
  return {
    maintained,
    energyUsed: availableEnergy,
    excess: 0,
  };
}

/**
 * Check if energy is sufficient to maintain all fighters.
 */
export function canMaintainFighters(
  fighters: number,
  energy: number,
  energyPerFighter: number = COMBAT_CONFIG.energyPerFighter
): boolean {
  return energy >= fighters * energyPerFighter;
}

/**
 * Process fighter maintenance cycle for a sector.
 * Returns the number of fighters that survive after energy check.
 */
export function processSectorFighters(sector: {
  fighters: number;
  energy: number;
  energyPerFighter?: number;
}): { fighters: number; energyUsed: number } {
  const epf = sector.energyPerFighter ?? COMBAT_CONFIG.energyPerFighter;
  const result = calculateFighterMaintenance(sector.fighters, epf, sector.energy);
  return {
    fighters: result.maintained,
    energyUsed: result.energyUsed,
  };
}

/**
 * Calculate mine effectiveness based on hull size.
 * Mines hit if hull size <= mineHullSize.
 * Returns 1.0 if target is hittable, 0.0 otherwise.
 */
export function calculateMineEffectiveness(
  hullSize: number,
  mineHullSize: number = COMBAT_CONFIG.mineHullSize
): number {
  return hullSize <= mineHullSize ? 1.0 : 0.0;
}

/**
 * Calculate EWD (Emergency Warp Device) effectiveness based on hull size.
 * EWD degrades if hull size > maxHullSize.
 * Returns effectiveness multiplier (1.0 = full, 0.0 = useless).
 */
export function calculateEWDEffectiveness(
  hullSize: number,
  maxHullSize: number = COMBAT_CONFIG.ewdMaxHullSize
): number {
  if (hullSize <= maxHullSize) return 1.0;
  const excess = hullSize - maxHullSize;
  return Math.max(0, 1.0 - excess * 0.1);
}
