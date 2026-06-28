/**
 * Buildings Progression System
 * Supports 1-99 tiers and 1-999 levels for all buildings
 */

import { ProgressionSystem, ScalingConfig, SCALING_PROFILES } from './progressionSystem';

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  category: BuildingCategory;
  tier: number;
  maxLevel: number;
  description: string;
  icon: string;
}

export type BuildingType = 
  | 'mine' 
  | 'factory' 
  | 'laboratory' 
  | 'storage'
  | 'defense'
  | 'orbital'
  | 'infrastructure'
  | 'power'
  | 'transport';

export type BuildingCategory = 
  | 'resource-production'
  | 'military'
  | 'research'
  | 'storage'
  | 'civilian'
  | 'orbital'
  | 'strategic';

export interface BuildingStats {
  production: number;
  storage: number;
  defense: number;
  efficiency: number;
  speed: number;
  capacity: number;
}

export interface BuildingConfig {
  baseCost: { metal: number; crystal: number; deuterium: number };
  baseTime: number;
  baseStats: Record<string, number>;
  baseProduction: number;
  baseMaintenance: { metal: number; crystal: number; deuterium: number };
  levelCap: number;
  unlockRequirements: string[];
  bonusPerTier: Record<string, number>;
}

// Base configurations for each building type
export const BUILDING_CONFIGS: Record<string, BuildingConfig> = {
  // RESOURCE PRODUCTION
  'metal-mine': {
    baseCost: { metal: 60, crystal: 15, deuterium: 0 },
    baseTime: 30,
    baseProduction: 30,
    baseMaintenance: { metal: 1, crystal: 0, deuterium: 0 },
    baseStats: {
      production: 30,
      efficiency: 0.9,
      capacity: 100000,
      speed: 1,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      production: 0.08,
      efficiency: 0.02,
    },
  },

  'crystal-mine': {
    baseCost: { metal: 48, crystal: 24, deuterium: 0 },
    baseTime: 30,
    baseProduction: 20,
    baseMaintenance: { metal: 0, crystal: 1, deuterium: 0 },
    baseStats: {
      production: 20,
      efficiency: 0.85,
      capacity: 100000,
      speed: 1,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      production: 0.1,
      efficiency: 0.03,
    },
  },

  'deuterium-synthesizer': {
    baseCost: { metal: 100, crystal: 30, deuterium: 10 },
    baseTime: 40,
    baseProduction: 10,
    baseMaintenance: { metal: 0, crystal: 0, deuterium: 1 },
    baseStats: {
      production: 10,
      efficiency: 0.8,
      capacity: 50000,
      speed: 1,
    },
    levelCap: 999,
    unlockRequirements: ['Mining Level 3'],
    bonusPerTier: {
      production: 0.12,
      efficiency: 0.05,
    },
  },

  'solar-plant': {
    baseCost: { metal: 75, crystal: 30, deuterium: 0 },
    baseTime: 35,
    baseProduction: 20,
    baseMaintenance: { metal: 1, crystal: 1, deuterium: 0 },
    baseStats: {
      production: 20,
      efficiency: 0.95,
      capacity: 500000,
      speed: 1,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      production: 0.06,
      efficiency: 0.02,
    },
  },

  'fusion-reactor': {
    baseCost: { metal: 900, crystal: 360, deuterium: 180 },
    baseTime: 200,
    baseProduction: 300,
    baseMaintenance: { metal: 10, crystal: 5, deuterium: 5 },
    baseStats: {
      production: 300,
      efficiency: 0.98,
      capacity: 5000000,
      speed: 1,
    },
    levelCap: 999,
    unlockRequirements: ['Energy Technology Level 5', 'Plasma Technology Level 3'],
    bonusPerTier: {
      production: 0.15,
      efficiency: 0.05,
    },
  },

  // PRODUCTION/CONSTRUCTION
  'robotics-factory': {
    baseCost: { metal: 400, crystal: 120, deuterium: 200 },
    baseTime: 80,
    baseProduction: 0,
    baseMaintenance: { metal: 5, crystal: 3, deuterium: 2 },
    baseStats: {
      production: 0,
      efficiency: 0.9,
      speed: 1.2,
      capacity: 10000,
    },
    levelCap: 999,
    unlockRequirements: ['Mechanical Level 3'],
    bonusPerTier: {
      speed: 0.1,
      efficiency: 0.03,
    },
  },

  'shipyard': {
    baseCost: { metal: 400, crystal: 200, deuterium: 100 },
    baseTime: 100,
    baseProduction: 0,
    baseMaintenance: { metal: 10, crystal: 10, deuterium: 5 },
    baseStats: {
      production: 0,
      efficiency: 0.88,
      speed: 1,
      capacity: 50,
    },
    levelCap: 999,
    unlockRequirements: ['Spatial Engineering Level 2'],
    bonusPerTier: {
      speed: 0.12,
      efficiency: 0.04,
      capacity: 0.1,
    },
  },

  // RESEARCH
  'research-lab': {
    baseCost: { metal: 200, crystal: 400, deuterium: 200 },
    baseTime: 120,
    baseProduction: 0,
    baseMaintenance: { metal: 5, crystal: 5, deuterium: 5 },
    baseStats: {
      production: 0,
      efficiency: 0.92,
      speed: 1.1,
      capacity: 100,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      speed: 0.15,
      efficiency: 0.05,
    },
  },

  'mega-research-lab': {
    baseCost: { metal: 5000, crystal: 8000, deuterium: 4000 },
    baseTime: 600,
    baseProduction: 0,
    baseMaintenance: { metal: 50, crystal: 50, deuterium: 50 },
    baseStats: {
      production: 0,
      efficiency: 0.98,
      speed: 2.5,
      capacity: 500,
    },
    levelCap: 999,
    unlockRequirements: ['Advanced Research Level 20', 'Quantum Computing Level 5'],
    bonusPerTier: {
      speed: 0.2,
      efficiency: 0.08,
    },
  },

  // STORAGE
  'metal-storage': {
    baseCost: { metal: 40, crystal: 20, deuterium: 0 },
    baseTime: 20,
    baseProduction: 0,
    baseMaintenance: { metal: 0, crystal: 0, deuterium: 0 },
    baseStats: {
      production: 0,
      efficiency: 1,
      capacity: 100000,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      capacity: 0.25,
    },
  },

  'crystal-storage': {
    baseCost: { metal: 50, crystal: 50, deuterium: 0 },
    baseTime: 20,
    baseProduction: 0,
    baseMaintenance: { metal: 0, crystal: 0, deuterium: 0 },
    baseStats: {
      production: 0,
      efficiency: 1,
      capacity: 100000,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      capacity: 0.25,
    },
  },

  'deuterium-storage': {
    baseCost: { metal: 50, crystal: 100, deuterium: 0 },
    baseTime: 20,
    baseProduction: 0,
    baseMaintenance: { metal: 0, crystal: 0, deuterium: 0 },
    baseStats: {
      production: 0,
      efficiency: 1,
      capacity: 50000,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: [],
    bonusPerTier: {
      capacity: 0.25,
    },
  },

  // DEFENSE
  'laser-turret': {
    baseCost: { metal: 400, crystal: 120, deuterium: 200 },
    baseTime: 40,
    baseProduction: 0,
    baseMaintenance: { metal: 5, crystal: 2, deuterium: 2 },
    baseStats: {
      production: 0,
      defense: 400,
      efficiency: 0.9,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: ['Laser Technology Level 3'],
    bonusPerTier: {
      defense: 0.15,
      efficiency: 0.05,
    },
  },

  'plasma-battery': {
    baseCost: { metal: 1000, crystal: 500, deuterium: 300 },
    baseTime: 100,
    baseProduction: 0,
    baseMaintenance: { metal: 20, crystal: 10, deuterium: 10 },
    baseStats: {
      production: 0,
      defense: 1000,
      efficiency: 0.95,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: ['Plasma Technology Level 5'],
    bonusPerTier: {
      defense: 0.2,
      efficiency: 0.08,
    },
  },

  'shield-generator': {
    baseCost: { metal: 500, crystal: 1000, deuterium: 500 },
    baseTime: 80,
    baseProduction: 0,
    baseMaintenance: { metal: 10, crystal: 10, deuterium: 10 },
    baseStats: {
      production: 0,
      defense: 600,
      efficiency: 0.98,
      speed: 0,
    },
    levelCap: 999,
    unlockRequirements: ['Shield Technology Level 4'],
    bonusPerTier: {
      defense: 0.18,
      efficiency: 0.1,
    },
  },

  // ORBITAL
  'space-station': {
    baseCost: { metal: 10000, crystal: 20000, deuterium: 5000 },
    baseTime: 1000,
    baseProduction: 100,
    baseMaintenance: { metal: 100, crystal: 100, deuterium: 50 },
    baseStats: {
      production: 100,
      efficiency: 0.95,
      defense: 500,
      capacity: 1000000,
    },
    levelCap: 999,
    unlockRequirements: ['Spatial Engineering Level 10', 'Construction Level 15'],
    bonusPerTier: {
      production: 0.1,
      defense: 0.12,
      capacity: 0.15,
    },
  },

  'orbital-shipyard': {
    baseCost: { metal: 5000, crystal: 10000, deuterium: 5000 },
    baseTime: 500,
    baseProduction: 0,
    baseMaintenance: { metal: 50, crystal: 50, deuterium: 50 },
    baseStats: {
      production: 0,
      efficiency: 0.96,
      speed: 1.5,
      capacity: 200,
    },
    levelCap: 999,
    unlockRequirements: ['Spatial Engineering Level 8'],
    bonusPerTier: {
      speed: 0.15,
      capacity: 0.2,
    },
  },
};

/**
 * Building definitions
 */
export const BUILDINGS: Building[] = [
  // Resource Production
  { id: 'metal-mine', name: 'Metal Mine', type: 'mine', category: 'resource-production', tier: 1, maxLevel: 999, description: 'Extracts metal ore from the ground', icon: '⛏️' },
  { id: 'crystal-mine', name: 'Crystal Mine', type: 'mine', category: 'resource-production', tier: 1, maxLevel: 999, description: 'Extracts crystal from mineral deposits', icon: '💎' },
  { id: 'deuterium-synthesizer', name: 'Deuterium Synthesizer', type: 'factory', category: 'resource-production', tier: 3, maxLevel: 999, description: 'Synthesizes deuterium fuel', icon: '🔬' },
  { id: 'solar-plant', name: 'Solar Power Plant', type: 'power', category: 'resource-production', tier: 1, maxLevel: 999, description: 'Generates energy from sunlight', icon: '☀️' },
  { id: 'fusion-reactor', name: 'Fusion Reactor', type: 'power', category: 'resource-production', tier: 10, maxLevel: 999, description: 'Advanced fusion energy generation', icon: '⚛️' },

  // Production
  { id: 'robotics-factory', name: 'Robotics Factory', type: 'factory', category: 'civilian', tier: 3, maxLevel: 999, description: 'Manufactures robots and automation units', icon: '🤖' },
  { id: 'shipyard', name: 'Shipyard', type: 'factory', category: 'military', tier: 3, maxLevel: 999, description: 'Constructs spacecraft', icon: '🚀' },

  // Research
  { id: 'research-lab', name: 'Research Laboratory', type: 'laboratory', category: 'research', tier: 1, maxLevel: 999, description: 'Conducts scientific research', icon: '🔬' },
  { id: 'mega-research-lab', name: 'Mega Research Laboratory', type: 'laboratory', category: 'research', tier: 20, maxLevel: 999, description: 'Advanced research facility', icon: '🏗️' },

  // Storage
  { id: 'metal-storage', name: 'Metal Storage', type: 'storage', category: 'storage', tier: 1, maxLevel: 999, description: 'Stores metal resources', icon: '📦' },
  { id: 'crystal-storage', name: 'Crystal Storage', type: 'storage', category: 'storage', tier: 1, maxLevel: 999, description: 'Stores crystal resources', icon: '💾' },
  { id: 'deuterium-storage', name: 'Deuterium Storage', type: 'storage', category: 'storage', tier: 3, maxLevel: 999, description: 'Stores deuterium fuel', icon: '🛢️' },

  // Defense
  { id: 'laser-turret', name: 'Laser Turret', type: 'defense', category: 'military', tier: 5, maxLevel: 999, description: 'Defensive laser weapon', icon: '🔫' },
  { id: 'plasma-battery', name: 'Plasma Battery', type: 'defense', category: 'military', tier: 15, maxLevel: 999, description: 'Advanced plasma defense system', icon: '⚡' },
  { id: 'shield-generator', name: 'Shield Generator', type: 'defense', category: 'military', tier: 10, maxLevel: 999, description: 'Generates protective shields', icon: '🛡️' },

  // Orbital
  { id: 'space-station', name: 'Space Station', type: 'orbital', category: 'orbital', tier: 20, maxLevel: 999, description: 'Orbital habitat and command center', icon: '🌌' },
  { id: 'orbital-shipyard', name: 'Orbital Shipyard', type: 'orbital', category: 'orbital', tier: 18, maxLevel: 999, description: 'Constructs ships in orbit', icon: '🏭' },
];

/**
 * Get building configuration
 */
export function getBuildingConfig(buildingId: string): BuildingConfig | null {
  return BUILDING_CONFIGS[buildingId] || null;
}

/**
 * Calculate building cost with progression
 */
export function calculateBuildingCost(
  buildingId: string,
  level: number,
  tier: number
): { metal: number; crystal: number; deuterium: number } | null {
  const config = getBuildingConfig(buildingId);
  if (!config) return null;

  return ProgressionSystem.calculateScaledCost(
    {
      baseCost: config.baseCost,
      baseTime: config.baseTime,
      baseStats: config.baseStats,
      levelMultiplier: SCALING_PROFILES.building.levelMultiplier,
      tierMultiplier: SCALING_PROFILES.building.tierMultiplier,
      tierCostIncrease: SCALING_PROFILES.building.tierCostIncrease,
      tierTimeIncrease: SCALING_PROFILES.building.tierTimeIncrease,
    },
    level,
    tier
  );
}

/**
 * Calculate building build time
 */
export function calculateBuildingTime(
  buildingId: string,
  level: number,
  tier: number
): number | null {
  const config = getBuildingConfig(buildingId);
  if (!config) return null;

  return ProgressionSystem.calculateScaledBuildTime(
    {
      baseCost: config.baseCost,
      baseTime: config.baseTime,
      baseStats: config.baseStats,
      levelMultiplier: SCALING_PROFILES.building.levelMultiplier,
      tierMultiplier: SCALING_PROFILES.building.tierMultiplier,
      tierCostIncrease: SCALING_PROFILES.building.tierCostIncrease,
      tierTimeIncrease: SCALING_PROFILES.building.tierTimeIncrease,
    },
    level,
    tier
  );
}

/**
 * Calculate production for a building
 */
export function calculateBuildingProduction(
  buildingId: string,
  level: number,
  tier: number
): number | null {
  const config = getBuildingConfig(buildingId);
  if (!config) return null;

  const totalMultiplier = ProgressionSystem.getTotalMultiplier(level, tier);
  return Math.floor(config.baseProduction * totalMultiplier);
}

/**
 * Filter buildings by tier
 */
export function getBuildingsByTier(tier: number): Building[] {
  return BUILDINGS.filter(b => b.tier <= tier);
}

/**
 * Check if building is unlocked for a given tier
 */
export function isBuildingUnlocked(buildingId: string, playerTier: number): boolean {
  const building = BUILDINGS.find(b => b.id === buildingId);
  return building ? building.tier <= playerTier : false;
}
