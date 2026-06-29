/**
 * Moons Progression System
 * Supports 1-99 tiers and 1-999 levels for moons
 * Includes moon types, orbital mechanics, base types, and building infrastructure
 */

import { ProgressionSystem } from './progressionSystem';

export type MoonType = 
  | 'rocky'
  | 'icy'
  | 'metallic'
  | 'organic'
  | 'exotic'
  | 'captured-asteroid'
  | 'crystalline'
  | 'binary-moon';

export type MoonBaseType = 
  | 'outpost'
  | 'military-base'
  | 'research-station'
  | 'mining-colony'
  | 'refinery'
  | 'spaceport'
  | 'megastructure-anchor';

export type MoonBaseClass = 'small' | 'medium' | 'large' | 'capital' | 'ancient' | 'ascended';

export interface MoonStats {
  mass: number;
  orbitRadius: number;
  orbitPeriod: number;
  gravity: number;
  resourceDensity: number;
  stability: number; // 0-100, affected by orbital mechanics
  mineralWealth: number; // 0-100
  energyOutput: number;
}

export interface MoonBase {
  id: string;
  name: string;
  type: MoonBaseType;
  class: MoonBaseClass;
  tier: number;
  level: number;
  owner: string | null;
  population: number;
  defense: number;
  production: number;
  research: number;
  storage: number;
  garrison: Array<{ unitType: string; quantity: number }>;
}

export interface Moon {
  id: string;
  name: string;
  parentPlanetId: string;
  tier: number;
  level: number;
  type: MoonType;
  icon: string;
  stats: MoonStats;
  base: MoonBase | null;
  explored: boolean;
  discoverer: string | null;
  resources: Record<string, number>;
}

/**
 * Moon type configuration
 */
export interface MoonTypeConfig {
  name: string;
  description: string;
  baseMass: number;
  baseResourceDensity: number;
  baseStability: number;
  mineralWealth: number;
  buildingSuitability: number; // 0-100
  color: string;
  specialProperties: string[];
}

export const MOON_TYPES: Record<MoonType, MoonTypeConfig> = {
  'rocky': {
    name: 'Rocky Moon',
    description: 'Standard rocky satellite',
    baseMass: 0.5,
    baseResourceDensity: 0.8,
    baseStability: 0.85,
    mineralWealth: 60,
    buildingSuitability: 75,
    color: '#8B7355',
    specialProperties: [],
  },

  'icy': {
    name: 'Icy Moon',
    description: 'Frozen moon with water ice',
    baseMass: 0.4,
    baseResourceDensity: 0.6,
    baseStability: 0.9,
    mineralWealth: 40,
    buildingSuitability: 60,
    color: '#E0FFFF',
    specialProperties: ['water-ice', 'stable-orbit'],
  },

  'metallic': {
    name: 'Metallic Moon',
    description: 'Rich in metallic ore deposits',
    baseMass: 1.2,
    baseResourceDensity: 1.5,
    baseStability: 0.75,
    mineralWealth: 95,
    buildingSuitability: 70,
    color: '#C0C0C0',
    specialProperties: ['high-metal-content', 'stable-orbit'],
  },

  'organic': {
    name: 'Organic Moon',
    description: 'Contains organic compounds and life',
    baseMass: 0.6,
    baseResourceDensity: 0.7,
    baseStability: 0.8,
    mineralWealth: 50,
    buildingSuitability: 85,
    color: '#228B22',
    specialProperties: ['organic-compounds', 'habitable'],
  },

  'exotic': {
    name: 'Exotic Moon',
    description: 'Displays unusual properties',
    baseMass: 0.8,
    baseResourceDensity: 2.0,
    baseStability: 0.6,
    mineralWealth: 80,
    buildingSuitability: 90,
    color: '#9B59B6',
    specialProperties: ['exotic-matter', 'reality-distortion'],
  },

  'captured-asteroid': {
    name: 'Captured Asteroid',
    description: 'Asteroid captured by planet\'s gravity',
    baseMass: 0.3,
    baseResourceDensity: 1.3,
    baseStability: 0.5,
    mineralWealth: 85,
    buildingSuitability: 50,
    color: '#8B4513',
    specialProperties: ['unstable-orbit', 'high-mineral-content'],
  },

  'crystalline': {
    name: 'Crystalline Moon',
    description: 'Surface covered in crystals',
    baseMass: 0.7,
    baseResourceDensity: 1.8,
    baseStability: 0.88,
    mineralWealth: 75,
    buildingSuitability: 80,
    color: '#FFD700',
    specialProperties: ['crystal-deposits', 'energy-resonance'],
  },

  'binary-moon': {
    name: 'Binary Moon System',
    description: 'Twin moons orbiting each other',
    baseMass: 1.0,
    baseResourceDensity: 1.2,
    baseStability: 0.7,
    mineralWealth: 70,
    buildingSuitability: 75,
    color: '#F0E68C',
    specialProperties: ['binary-system', 'tidal-effects'],
  },
};

/**
 * Moon base type configuration
 */
export interface MoonBaseTypeConfig {
  name: string;
  description: string;
  baseDefense: number;
  baseProduction: number;
  baseResearch: number;
  baseStorage: number;
  baseCrew: number;
  minTierRequired: number;
  specialAbilities: string[];
}

export const MOON_BASE_TYPES: Record<MoonBaseType, MoonBaseTypeConfig> = {
  'outpost': {
    name: 'Outpost',
    description: 'Small remote observation post',
    baseDefense: 20,
    baseProduction: 10,
    baseResearch: 5,
    baseStorage: 5000,
    baseCrew: 50,
    minTierRequired: 1,
    specialAbilities: ['reconnaissance', 'early-warning'],
  },

  'military-base': {
    name: 'Military Base',
    description: 'Fortified military installation',
    baseDefense: 200,
    baseProduction: 30,
    baseResearch: 10,
    baseStorage: 20000,
    baseCrew: 500,
    minTierRequired: 5,
    specialAbilities: ['fleet-staging', 'defensive-shield', 'orbital-bombardment'],
  },

  'research-station': {
    name: 'Research Station',
    description: 'Advanced scientific research facility',
    baseDefense: 50,
    baseProduction: 20,
    baseResearch: 200,
    baseStorage: 15000,
    baseCrew: 300,
    minTierRequired: 8,
    specialAbilities: ['breakthrough-research', 'tech-boosting', 'exotic-matter-processing'],
  },

  'mining-colony': {
    name: 'Mining Colony',
    description: 'Industrial mining and extraction operation',
    baseDefense: 80,
    baseProduction: 300,
    baseResearch: 20,
    baseStorage: 100000,
    baseCrew: 1000,
    minTierRequired: 3,
    specialAbilities: ['ore-extraction', 'automated-mining', 'refinery-operations'],
  },

  'refinery': {
    name: 'Refinery',
    description: 'Resource processing and refinement center',
    baseDefense: 60,
    baseProduction: 150,
    baseResearch: 50,
    baseStorage: 150000,
    baseCrew: 800,
    minTierRequired: 4,
    specialAbilities: ['ore-refinement', 'alloy-forging', 'crystal-processing'],
  },

  'spaceport': {
    name: 'Spaceport',
    description: 'Major interplanetary commerce and travel hub',
    baseDefense: 120,
    baseProduction: 100,
    baseResearch: 30,
    baseStorage: 200000,
    baseCrew: 2000,
    minTierRequired: 6,
    specialAbilities: ['ship-repair', 'cargo-transfer', 'trade-hub', 'fleet-coordination'],
  },

  'megastructure-anchor': {
    name: 'Megastructure Anchor Point',
    description: 'Anchor for constructing megastructures',
    baseDefense: 500,
    baseProduction: 200,
    baseResearch: 300,
    baseStorage: 1000000,
    baseCrew: 10000,
    minTierRequired: 20,
    specialAbilities: ['megastructure-construction', 'reality-anchoring', 'dimensional-stability'],
  },
};

/**
 * Generate moon
 */
export function generateMoon(
  id: string,
  name: string,
  parentPlanetId: string,
  type: MoonType,
  tier: number = 1,
  level: number = 1
): Moon {
  const typeConfig = MOON_TYPES[type];
  const multiplier = ProgressionSystem.getTotalMultiplier(level, tier);

  const stats: MoonStats = {
    mass: typeConfig.baseMass * multiplier,
    orbitRadius: Math.random() * 500000 + 50000,
    orbitPeriod: Math.random() * 100 + 10,
    gravity: (typeConfig.baseMass * multiplier) / 0.5,
    resourceDensity: typeConfig.baseResourceDensity * multiplier,
    stability: Math.min(100, typeConfig.baseStability * 100),
    mineralWealth: Math.min(100, typeConfig.mineralWealth * (1 + level * 0.1 + tier * 0.2)),
    energyOutput: typeConfig.mineralWealth * multiplier * 10,
  };

  const resources: Record<string, number> = {
    metal: Math.floor(Math.random() * 50000 * typeConfig.baseResourceDensity * multiplier),
    crystal: Math.floor(Math.random() * 30000 * typeConfig.baseResourceDensity * multiplier),
    deuterium: Math.floor(Math.random() * 20000 * typeConfig.baseResourceDensity * multiplier),
  };

  return {
    id,
    name,
    parentPlanetId,
    tier,
    level,
    type,
    icon: type === 'icy' ? '🧊' : type === 'metallic' ? '⚙️' : '🌙',
    stats,
    base: null,
    explored: false,
    discoverer: null,
    resources,
  };
}

/**
 * Build moon base
 */
export function buildMoonBase(
  moon: Moon,
  baseType: MoonBaseType,
  baseClass: MoonBaseClass,
  owner: string,
  tier: number = 1,
  level: number = 1
): MoonBase {
  const typeConfig = MOON_BASE_TYPES[baseType];
  const classMultiplier = { 'small': 1, 'medium': 2, 'large': 3, 'capital': 5, 'ancient': 8, 'ascended': 15 }[baseClass] || 1;
  const totalMultiplier = ProgressionSystem.getTotalMultiplier(level, tier) * classMultiplier;

  return {
    id: `base-${moon.id}-${Date.now()}`,
    name: `${baseClass.charAt(0).toUpperCase() + baseClass.slice(1)} ${baseType}`,
    type: baseType,
    class: baseClass,
    tier,
    level,
    owner,
    population: Math.floor(typeConfig.baseCrew * classMultiplier),
    defense: Math.floor(typeConfig.baseDefense * totalMultiplier),
    production: Math.floor(typeConfig.baseProduction * totalMultiplier),
    research: Math.floor(typeConfig.baseResearch * totalMultiplier),
    storage: Math.floor(typeConfig.baseStorage * totalMultiplier),
    garrison: [],
  };
}

/**
 * Upgrade moon base
 */
export function upgradeMoonBase(base: MoonBase, levels: number = 1): MoonBase {
  const newLevel = Math.min(base.level + levels, 999);
  const multiplier = ProgressionSystem.getTotalMultiplier(newLevel, base.tier);
  const classMultiplier = { 'small': 1, 'medium': 2, 'large': 3, 'capital': 5, 'ancient': 8, 'ascended': 15 }[base.class] || 1;
  const totalMultiplier = multiplier * classMultiplier;

  const typeConfig = MOON_BASE_TYPES[base.type];

  return {
    ...base,
    level: newLevel,
    defense: Math.floor(typeConfig.baseDefense * totalMultiplier),
    production: Math.floor(typeConfig.baseProduction * totalMultiplier),
    research: Math.floor(typeConfig.baseResearch * totalMultiplier),
    storage: Math.floor(typeConfig.baseStorage * totalMultiplier),
  };
}

/**
 * Get moon bases by type
 */
export function getMoonsByType(moons: Moon[], type: MoonType): Moon[] {
  return moons.filter(m => m.type === type);
}

/**
 * Get moons with bases
 */
export function getOccupiedMoons(moons: Moon[]): Moon[] {
  return moons.filter(m => m.base !== null);
}

/**
 * Get moons suitable for specific base type
 */
export function getSuitableMoonsForBase(moons: Moon[], baseType: MoonBaseType): Moon[] {
  const minTier = MOON_BASE_TYPES[baseType].minTierRequired;
  return moons.filter(m => m.tier >= minTier && m.base === null);
}

/**
 * Calculate moon base upgrade cost
 */
export function calculateMoonBaseUpgradeCost(base: MoonBase, levels: number = 1): { metal: number; crystal: number; deuterium: number } {
  const newLevel = base.level + levels;
  const multiplier = ProgressionSystem.getTotalMultiplier(newLevel, base.tier);
  
  return {
    metal: Math.floor(10000 * multiplier * levels),
    crystal: Math.floor(5000 * multiplier * levels),
    deuterium: Math.floor(2000 * multiplier * levels),
  };
}

/**
 * Add garrison to moon base
 */
export function addGarrison(base: MoonBase, unitType: string, quantity: number): MoonBase {
  const existing = base.garrison.find(g => g.unitType === unitType);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    base.garrison.push({ unitType, quantity });
  }
  
  return base;
}
