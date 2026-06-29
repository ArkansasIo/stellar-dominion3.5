/**
 * Units/Ships Progression System
 * Supports 1-99 tiers and 1-999 levels for all units
 */

import { ProgressionSystem, SCALING_PROFILES } from './progressionSystem';

export type UnitType = 
  | 'fighter'
  | 'bomber'
  | 'corvette'
  | 'frigate'
  | 'destroyer'
  | 'cruiser'
  | 'battleship'
  | 'carrier'
  | 'transport'
  | 'colonizer'
  | 'probe'
  | 'drone'
  | 'elite-unit';

export type UnitTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 15 | 20 | 25 | 30 | 35 | 50 | 99;

export interface UnitStats {
  attack: number;
  defense: number;
  hp: number;
  speed: number;
  cargo: number;
  cost: { metal: number; crystal: number; deuterium: number };
  buildTime: number;
}

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  tier: UnitTier;
  maxLevel: number;
  description: string;
  role: 'combat' | 'support' | 'transport' | 'exploration' | 'special';
  icon: string;
  baseStats: UnitStats;
}

// Combat Units
export const LIGHT_FIGHTER: Unit = {
  id: 'light-fighter',
  name: 'Light Fighter',
  type: 'fighter',
  tier: 1,
  maxLevel: 999,
  description: 'Fast attack fighter for early combat',
  role: 'combat',
  icon: '✈️',
  baseStats: {
    attack: 50,
    defense: 10,
    hp: 100,
    speed: 12,
    cargo: 0,
    cost: { metal: 300, crystal: 100, deuterium: 0 },
    buildTime: 10,
  },
};

export const HEAVY_FIGHTER: Unit = {
  id: 'heavy-fighter',
  name: 'Heavy Fighter',
  type: 'fighter',
  tier: 3,
  maxLevel: 999,
  description: 'Heavily armored fighter with increased firepower',
  role: 'combat',
  icon: '🛩️',
  baseStats: {
    attack: 150,
    defense: 40,
    hp: 300,
    speed: 8,
    cargo: 0,
    cost: { metal: 600, crystal: 300, deuterium: 100 },
    buildTime: 20,
  },
};

export const CORVETTE: Unit = {
  id: 'corvette',
  name: 'Corvette',
  type: 'corvette',
  tier: 5,
  maxLevel: 999,
  description: 'Small but agile warship',
  role: 'combat',
  icon: '🚤',
  baseStats: {
    attack: 300,
    defense: 150,
    hp: 600,
    speed: 10,
    cargo: 5000,
    cost: { metal: 1000, crystal: 600, deuterium: 300 },
    buildTime: 60,
  },
};

export const FRIGATE: Unit = {
  id: 'frigate',
  name: 'Frigate',
  type: 'frigate',
  tier: 8,
  maxLevel: 999,
  description: 'Medium combat vessel with balanced stats',
  role: 'combat',
  icon: '⛵',
  baseStats: {
    attack: 600,
    defense: 400,
    hp: 1500,
    speed: 7,
    cargo: 10000,
    cost: { metal: 3000, crystal: 2000, deuterium: 1000 },
    buildTime: 180,
  },
};

export const DESTROYER: Unit = {
  id: 'destroyer',
  name: 'Destroyer',
  type: 'destroyer',
  tier: 12,
  maxLevel: 999,
  description: 'Powerful combat capital ship',
  role: 'combat',
  icon: '🚢',
  baseStats: {
    attack: 1500,
    defense: 800,
    hp: 4000,
    speed: 5,
    cargo: 20000,
    cost: { metal: 8000, crystal: 6000, deuterium: 4000 },
    buildTime: 500,
  },
};

export const BATTLESHIP: Unit = {
  id: 'battleship',
  name: 'Battleship',
  type: 'battleship',
  tier: 20,
  maxLevel: 999,
  description: 'Ultimate combat vessel - massive firepower',
  role: 'combat',
  icon: '🛥️',
  baseStats: {
    attack: 5000,
    defense: 2500,
    hp: 10000,
    speed: 3,
    cargo: 50000,
    cost: { metal: 30000, crystal: 20000, deuterium: 10000 },
    buildTime: 2000,
  },
};

// Support & Transport Units
export const SMALL_CARGO: Unit = {
  id: 'small-cargo',
  name: 'Small Cargo Ship',
  type: 'transport',
  tier: 2,
  maxLevel: 999,
  description: 'Basic cargo transport vessel',
  role: 'transport',
  icon: '📦',
  baseStats: {
    attack: 5,
    defense: 5,
    hp: 100,
    speed: 10,
    cargo: 5000,
    cost: { metal: 400, crystal: 200, deuterium: 100 },
    buildTime: 30,
  },
};

export const LARGE_CARGO: Unit = {
  id: 'large-cargo',
  name: 'Large Cargo Ship',
  type: 'transport',
  tier: 6,
  maxLevel: 999,
  description: 'High-capacity cargo transport',
  role: 'transport',
  icon: '🚛',
  baseStats: {
    attack: 10,
    defense: 10,
    hp: 200,
    speed: 7,
    cargo: 25000,
    cost: { metal: 2000, crystal: 1000, deuterium: 500 },
    buildTime: 150,
  },
};

export const COLONIZER: Unit = {
  id: 'colonizer',
  name: 'Colonizer Ship',
  type: 'colonizer',
  tier: 4,
  maxLevel: 999,
  description: 'Specialized vessel for planetary colonization',
  role: 'support',
  icon: '🏗️',
  baseStats: {
    attack: 50,
    defense: 50,
    hp: 500,
    speed: 4,
    cargo: 10000,
    cost: { metal: 1000, crystal: 1500, deuterium: 500 },
    buildTime: 120,
  },
};

// Exploration & Intelligence
export const ESPIONAGE_PROBE: Unit = {
  id: 'espionage-probe',
  name: 'Espionage Probe',
  type: 'probe',
  tier: 3,
  maxLevel: 999,
  description: 'Unmanned probe for intelligence gathering',
  role: 'exploration',
  icon: '🛸',
  baseStats: {
    attack: 0,
    defense: 1,
    hp: 10,
    speed: 15,
    cargo: 0,
    cost: { metal: 100, crystal: 50, deuterium: 0 },
    buildTime: 5,
  },
};

export const SURVEY_DRONE: Unit = {
  id: 'survey-drone',
  name: 'Survey Drone',
  type: 'drone',
  tier: 5,
  maxLevel: 999,
  description: 'Advanced scanning and survey probe',
  role: 'exploration',
  icon: '🔭',
  baseStats: {
    attack: 0,
    defense: 5,
    hp: 50,
    speed: 12,
    cargo: 100,
    cost: { metal: 500, crystal: 300, deuterium: 200 },
    buildTime: 50,
  },
};

// Special & Elite Units
export const CARRIER: Unit = {
  id: 'carrier',
  name: 'Carrier',
  type: 'carrier',
  tier: 25,
  maxLevel: 999,
  description: 'Carries fighter squadrons - command and support',
  role: 'special',
  icon: '🎖️',
  baseStats: {
    attack: 2000,
    defense: 3000,
    hp: 8000,
    speed: 4,
    cargo: 100000,
    cost: { metal: 50000, crystal: 40000, deuterium: 20000 },
    buildTime: 3000,
  },
};

export const DREADNOUGHT: Unit = {
  id: 'dreadnought',
  name: 'Dreadnought',
  type: 'battleship',
  tier: 35,
  maxLevel: 999,
  description: 'Legendary warship - apex of naval technology',
  role: 'combat',
  icon: '⚔️',
  baseStats: {
    attack: 15000,
    defense: 10000,
    hp: 50000,
    speed: 3,
    cargo: 100000,
    cost: { metal: 100000, crystal: 100000, deuterium: 50000 },
    buildTime: 10000,
  },
};

export const TITAN: Unit = {
  id: 'titan',
  name: 'Titan',
  type: 'battleship',
  tier: 50,
  maxLevel: 999,
  description: 'Ultimate megaship - godlike power and presence',
  role: 'combat',
  icon: '👑',
  baseStats: {
    attack: 50000,
    defense: 50000,
    hp: 200000,
    speed: 2,
    cargo: 1000000,
    cost: { metal: 500000, crystal: 500000, deuterium: 250000 },
    buildTime: 50000,
  },
};

export const ASCENDED_WARSHIP: Unit = {
  id: 'ascended-warship',
  name: 'Ascended Warship',
  type: 'elite-unit',
  tier: 99,
  maxLevel: 999,
  description: 'Beyond mortal comprehension - ultimate combat platform',
  role: 'combat',
  icon: '✨',
  baseStats: {
    attack: 999999,
    defense: 999999,
    hp: 9999999,
    speed: 10,
    cargo: 9999999,
    cost: { metal: 9999999, crystal: 9999999, deuterium: 9999999 },
    buildTime: 999999,
  },
};

// All units registry
export const UNITS: Unit[] = [
  LIGHT_FIGHTER,
  HEAVY_FIGHTER,
  CORVETTE,
  FRIGATE,
  DESTROYER,
  BATTLESHIP,
  SMALL_CARGO,
  LARGE_CARGO,
  COLONIZER,
  ESPIONAGE_PROBE,
  SURVEY_DRONE,
  CARRIER,
  DREADNOUGHT,
  TITAN,
  ASCENDED_WARSHIP,
];

/**
 * Calculate unit cost with progression
 */
export function calculateUnitCost(
  unitId: string,
  level: number,
  tier: number,
  quantity: number = 1
): { metal: number; crystal: number; deuterium: number } | null {
  const unit = UNITS.find(u => u.id === unitId);
  if (!unit) return null;

  const totalMultiplier = ProgressionSystem.getTotalMultiplier(level, tier);
  const baseCost = unit.baseStats.cost;

  return {
    metal: Math.floor(baseCost.metal * totalMultiplier * quantity),
    crystal: Math.floor(baseCost.crystal * totalMultiplier * quantity),
    deuterium: Math.floor(baseCost.deuterium * totalMultiplier * quantity),
  };
}

/**
 * Calculate unit build time
 */
export function calculateUnitBuildTime(
  unitId: string,
  level: number,
  tier: number,
  quantity: number = 1
): number | null {
  const unit = UNITS.find(u => u.id === unitId);
  if (!unit) return null;

  const totalMultiplier = ProgressionSystem.getTotalMultiplier(level, tier);
  return Math.floor(unit.baseStats.buildTime * totalMultiplier * quantity);
}

/**
 * Calculate unit stats with progression
 */
export function calculateUnitStats(
  unitId: string,
  level: number,
  tier: number
): Partial<UnitStats> | null {
  const unit = UNITS.find(u => u.id === unitId);
  if (!unit) return null;

  const totalMultiplier = ProgressionSystem.getTotalMultiplier(level, tier);
  const baseStats = unit.baseStats;

  return {
    attack: Math.floor(baseStats.attack * totalMultiplier),
    defense: Math.floor(baseStats.defense * totalMultiplier),
    hp: Math.floor(baseStats.hp * totalMultiplier),
    speed: Math.min(baseStats.speed + level * 0.01 + tier * 0.1, 20), // Speed cap at 20
    cargo: Math.floor(baseStats.cargo * totalMultiplier),
  };
}

/**
 * Get combined fleet stats
 */
export function calculateFleetStats(
  fleet: Array<{ unitId: string; level: number; tier: number; quantity: number }>
): {
  totalAttack: number;
  totalDefense: number;
  totalHP: number;
  averageSpeed: number;
  totalCargo: number;
  unitCount: number;
} {
  let totalAttack = 0;
  let totalDefense = 0;
  let totalHP = 0;
  let speedSum = 0;
  let totalCargo = 0;
  let unitCount = 0;

  for (const entry of fleet) {
    const stats = calculateUnitStats(entry.unitId, entry.level, entry.tier);
    if (!stats) continue;

    const count = entry.quantity;
    totalAttack += (stats.attack || 0) * count;
    totalDefense += (stats.defense || 0) * count;
    totalHP += (stats.hp || 0) * count;
    speedSum += (stats.speed || 0);
    totalCargo += (stats.cargo || 0) * count;
    unitCount += count;
  }

  return {
    totalAttack,
    totalDefense,
    totalHP,
    averageSpeed: unitCount > 0 ? speedSum / fleet.length : 0,
    totalCargo,
    unitCount,
  };
}

/**
 * Get units available at a specific tier
 */
export function getUnitsForTier(tier: number): Unit[] {
  return UNITS.filter(u => u.tier <= tier);
}

/**
 * Filter units by type
 */
export function getUnitsByType(type: UnitType): Unit[] {
  return UNITS.filter(u => u.type === type);
}

/**
 * Filter units by role
 */
export function getUnitsByRole(role: 'combat' | 'support' | 'transport' | 'exploration' | 'special'): Unit[] {
  return UNITS.filter(u => u.role === role);
}
