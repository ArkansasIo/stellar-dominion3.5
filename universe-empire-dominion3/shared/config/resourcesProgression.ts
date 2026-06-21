/**
 * Resources Progression System
 * Supports 1-99 tiers and 1-999 levels for all resources
 * Includes resource types, extraction methods, storage, and economies
 */

import { ProgressionSystem } from './progressionSystem';

export type ResourceType = 
  | 'metal'
  | 'crystal'
  | 'deuterium'
  | 'energy'
  | 'exotic-matter'
  | 'dark-matter'
  | 'antimatter'
  | 'exotic-crystal'
  | 'void-matter'
  | 'celestial-essence'
  // 18 new resource elements
  | 'solar-plasma'
  | 'stellar-ash'
  | 'nebula-gas'
  | 'nebula-dust'
  | 'cold-plasma'
  | 'hot-plasma'
  | 'quantum-fiber'
  | 'superposed-crystal'
  | 'rift-shard'
  | 'fold-essence'
  | 'temporal-echo'
  | 'temporal-shard'
  | 'psionic-crystal'
  | 'bio-resin'
  | 'nano-alloy'
  | 'resonant-lattice'
  | 'graviton-ore'
  | 'em-flux-compound';

export type ResourceCategory = 
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'exotic'
  | 'godlike'
  | 'transcendent'
  // New element categories
  | 'stellar'
  | 'nebular'
  | 'plasma'
  | 'quantum'
  | 'dimensional'
  | 'temporal'
  | 'psionic'
  | 'biological'
  | 'mechanical'
  | 'crystalline'
  | 'gravitational'
  | 'electromagnetic'
  | 'nuclear'
  | 'spectral'
  | 'void'
  | 'cosmic'
  | 'ethereal'
  | 'primordial';

export interface Resource {
  id: ResourceType;
  name: string;
  description: string;
  category: ResourceCategory;
  unlockTier: number;
  baseValue: number;
  icon: string;
  symbol: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface ResourceStorage {
  resourceId: ResourceType;
  current: number;
  capacity: number;
  level: number;
  tier: number;
}

export interface ResourceVein {
  id: string;
  resourceType: ResourceType;
  amount: number;
  quality: number; // 0-100, affects extraction rate
  difficulty: number; // 0-100, affects required tech
  extractionRate: number;
}

// Basic Resources
export const METAL: Resource = {
  id: 'metal',
  name: 'Metal',
  description: 'Essential metallic ore for construction and manufacturing',
  category: 'basic',
  unlockTier: 1,
  baseValue: 1,
  icon: '⛏️',
  symbol: 'M',
  rarity: 'common',
};

export const CRYSTAL: Resource = {
  id: 'crystal',
  name: 'Crystal',
  description: 'Crystalline structures for advanced technology and energy systems',
  category: 'basic',
  unlockTier: 1,
  baseValue: 1.5,
  icon: '💎',
  symbol: 'C',
  rarity: 'common',
};

export const DEUTERIUM: Resource = {
  id: 'deuterium',
  name: 'Deuterium',
  description: 'Isotope used as fuel for advanced propulsion and energy',
  category: 'basic',
  unlockTier: 1,
  baseValue: 2,
  icon: '🛢️',
  symbol: 'D',
  rarity: 'uncommon',
};

export const ENERGY: Resource = {
  id: 'energy',
  name: 'Energy',
  description: 'Pure energy generated from power plants and reactors',
  category: 'basic',
  unlockTier: 1,
  baseValue: 0.1,
  icon: '⚡',
  symbol: 'E',
  rarity: 'common',
};

// Intermediate Resources
export const EXOTIC_CRYSTAL: Resource = {
  id: 'exotic-crystal',
  name: 'Exotic Crystal',
  description: 'Rare crystalline structures with unusual properties',
  category: 'intermediate',
  unlockTier: 10,
  baseValue: 100,
  icon: '✨',
  symbol: 'EC',
  rarity: 'rare',
};

export const EXOTIC_MATTER: Resource = {
  id: 'exotic-matter',
  name: 'Exotic Matter',
  description: 'Matter with properties outside normal physics',
  category: 'intermediate',
  unlockTier: 15,
  baseValue: 250,
  icon: '💫',
  symbol: 'EM',
  rarity: 'rare',
};

export const DARK_MATTER: Resource = {
  id: 'dark-matter',
  name: 'Dark Matter',
  description: 'Mysterious matter that comprises most of the universe',
  category: 'advanced',
  unlockTier: 25,
  baseValue: 500,
  icon: '🌑',
  symbol: 'DM',
  rarity: 'epic',
};

// Advanced Resources
export const ANTIMATTER: Resource = {
  id: 'antimatter',
  name: 'Antimatter',
  description: 'Opposite of normal matter - explosive when combined',
  category: 'advanced',
  unlockTier: 30,
  baseValue: 1000,
  icon: '💥',
  symbol: 'AM',
  rarity: 'epic',
};

export const VOID_MATTER: Resource = {
  id: 'void-matter',
  name: 'Void Matter',
  description: 'Matter from the void between dimensions',
  category: 'advanced',
  unlockTier: 50,
  baseValue: 5000,
  icon: '⭕',
  symbol: 'VM',
  rarity: 'legendary',
};

// Godlike Resources
export const CELESTIAL_ESSENCE: Resource = {
  id: 'celestial-essence',
  name: 'Celestial Essence',
  description: 'Pure essence of celestial bodies - near infinite power',
  category: 'godlike',
  unlockTier: 75,
  baseValue: 99999,
  icon: '👑',
  symbol: 'CE',
  rarity: 'mythic',
};

// ─── 18 New Resource Elements ────────────────────────────────────────────────

export const SOLAR_PLASMA: Resource = {
  id: 'solar-plasma',
  name: 'Solar Plasma',
  description: 'Superheated ionized gas harvested from stellar coronae, used as a potent fuel and energy amplifier',
  category: 'stellar',
  unlockTier: 5,
  baseValue: 45,
  icon: '☀️',
  symbol: 'SP',
  rarity: 'uncommon',
};

export const STELLAR_ASH: Resource = {
  id: 'stellar-ash',
  name: 'Stellar Ash',
  description: 'Dense residual matter from stellar death events, laced with heavy nucleosynthesis products',
  category: 'stellar',
  unlockTier: 8,
  baseValue: 150,
  icon: '🌟',
  symbol: 'SA',
  rarity: 'rare',
};

export const NEBULA_GAS: Resource = {
  id: 'nebula-gas',
  name: 'Nebula Gas',
  description: 'Diffuse interstellar gas gathered from nebula clouds, primary feedstock for deuterium synthesis',
  category: 'nebular',
  unlockTier: 2,
  baseValue: 5,
  icon: '🌌',
  symbol: 'NG',
  rarity: 'common',
};

export const NEBULA_DUST: Resource = {
  id: 'nebula-dust',
  name: 'Nebula Dust',
  description: 'Fine particulate matter from nebulae, rich in silicates and metallic micro-grains',
  category: 'nebular',
  unlockTier: 3,
  baseValue: 18,
  icon: '✨',
  symbol: 'ND',
  rarity: 'uncommon',
};

export const COLD_PLASMA: Resource = {
  id: 'cold-plasma',
  name: 'Cold Plasma',
  description: 'Low-temperature ionized gas with extraordinary electrical conductivity for electronics and medicine',
  category: 'plasma',
  unlockTier: 6,
  baseValue: 80,
  icon: '🔵',
  symbol: 'CP',
  rarity: 'uncommon',
};

export const HOT_PLASMA: Resource = {
  id: 'hot-plasma',
  name: 'Hot Plasma',
  description: 'Intensely energetic plasma from stellar flares, extremely volatile with enormous energy potential',
  category: 'plasma',
  unlockTier: 12,
  baseValue: 350,
  icon: '🔴',
  symbol: 'HP',
  rarity: 'rare',
};

export const QUANTUM_FIBER: Resource = {
  id: 'quantum-fiber',
  name: 'Quantum Fiber',
  description: 'Quantum-entangled matter filaments that transmit information and energy instantaneously',
  category: 'quantum',
  unlockTier: 20,
  baseValue: 1200,
  icon: '🌀',
  symbol: 'QF',
  rarity: 'epic',
};

export const SUPERPOSED_CRYSTAL: Resource = {
  id: 'superposed-crystal',
  name: 'Superposed Crystal',
  description: 'A crystal existing in multiple quantum states simultaneously, collapsed by precision measurement fields',
  category: 'quantum',
  unlockTier: 22,
  baseValue: 2000,
  icon: '🔷',
  symbol: 'SC',
  rarity: 'epic',
};

export const RIFT_SHARD: Resource = {
  id: 'rift-shard',
  name: 'Rift Shard',
  description: 'Crystallized fragments of dimensional rifts carrying latent energies from multiple overlapping dimensions',
  category: 'dimensional',
  unlockTier: 30,
  baseValue: 5000,
  icon: '⚡',
  symbol: 'RS',
  rarity: 'legendary',
};

export const FOLD_ESSENCE: Resource = {
  id: 'fold-essence',
  name: 'Fold Essence',
  description: 'Pure energetic essence from spatial fold points, required fuel for advanced FTL drives',
  category: 'dimensional',
  unlockTier: 35,
  baseValue: 8000,
  icon: '🌊',
  symbol: 'FE',
  rarity: 'legendary',
};

export const TEMPORAL_ECHO: Resource = {
  id: 'temporal-echo',
  name: 'Temporal Echo',
  description: 'Resonant energy imprints from significant historical events in time, massively accelerating research',
  category: 'temporal',
  unlockTier: 45,
  baseValue: 25000,
  icon: '⏳',
  symbol: 'TE',
  rarity: 'mythic',
};

export const TEMPORAL_SHARD: Resource = {
  id: 'temporal-shard',
  name: 'Temporal Shard',
  description: 'Solid crystallized fragments of frozen time, used in temporal shields and chrono-fortifications',
  category: 'temporal',
  unlockTier: 50,
  baseValue: 40000,
  icon: '🕰️',
  symbol: 'TS',
  rarity: 'mythic',
};

export const PSIONIC_CRYSTAL: Resource = {
  id: 'psionic-crystal',
  name: 'Psionic Crystal',
  description: 'Crystals grown in regions of intense psychic resonance, central to psionic and commander technologies',
  category: 'psionic',
  unlockTier: 25,
  baseValue: 1800,
  icon: '🔮',
  symbol: 'PC',
  rarity: 'epic',
};

export const BIO_RESIN: Resource = {
  id: 'bio-resin',
  name: 'Bio-Resin',
  description: 'Organic resin from engineered bio-organisms, used as a biological adhesive and medical compound',
  category: 'biological',
  unlockTier: 4,
  baseValue: 25,
  icon: '🌿',
  symbol: 'BR',
  rarity: 'uncommon',
};

export const NANO_ALLOY: Resource = {
  id: 'nano-alloy',
  name: 'Nano-Alloy',
  description: 'Structural alloy manufactured at the nanoscale for unprecedented strength-to-weight ratio',
  category: 'mechanical',
  unlockTier: 15,
  baseValue: 300,
  icon: '⚙️',
  symbol: 'NA',
  rarity: 'rare',
};

export const RESONANT_LATTICE: Resource = {
  id: 'resonant-lattice',
  name: 'Resonant Lattice',
  description: 'Crystal grown in a tuned resonance field, superconducting at room temperature for lossless power grids',
  category: 'crystalline',
  unlockTier: 18,
  baseValue: 500,
  icon: '🔶',
  symbol: 'RL',
  rarity: 'rare',
};

export const GRAVITON_ORE: Resource = {
  id: 'graviton-ore',
  name: 'Graviton Ore',
  description: 'Extraordinarily dense ore saturated with graviton particles, used in gravity-weapon systems',
  category: 'gravitational',
  unlockTier: 28,
  baseValue: 3000,
  icon: '🪨',
  symbol: 'GO',
  rarity: 'epic',
};

export const EM_FLUX_COMPOUND: Resource = {
  id: 'em-flux-compound',
  name: 'EM Flux Compound',
  description: 'Stabilized electromagnetic flux compound with maximum conductivity for power and EMP systems',
  category: 'electromagnetic',
  unlockTier: 16,
  baseValue: 400,
  icon: '🔌',
  symbol: 'EF',
  rarity: 'rare',
};

// All resources registry
export const RESOURCES: Resource[] = [
  METAL,
  CRYSTAL,
  DEUTERIUM,
  ENERGY,
  EXOTIC_CRYSTAL,
  EXOTIC_MATTER,
  DARK_MATTER,
  ANTIMATTER,
  VOID_MATTER,
  CELESTIAL_ESSENCE,
  // 18 new resource elements
  SOLAR_PLASMA,
  STELLAR_ASH,
  NEBULA_GAS,
  NEBULA_DUST,
  COLD_PLASMA,
  HOT_PLASMA,
  QUANTUM_FIBER,
  SUPERPOSED_CRYSTAL,
  RIFT_SHARD,
  FOLD_ESSENCE,
  TEMPORAL_ECHO,
  TEMPORAL_SHARD,
  PSIONIC_CRYSTAL,
  BIO_RESIN,
  NANO_ALLOY,
  RESONANT_LATTICE,
  GRAVITON_ORE,
  EM_FLUX_COMPOUND,
];

/**
 * Resource economy configuration
 */
export interface ResourceEconomy {
  supplyMultiplier: number;
  demandMultiplier: number;
  priceMultiplier: number;
  productionBonus: number;
  storageBonus: number;
}

export const RESOURCE_ECONOMIES: Record<ResourceType, ResourceEconomy> = {
  'metal': {
    supplyMultiplier: 1.0,
    demandMultiplier: 1.0,
    priceMultiplier: 1.0,
    productionBonus: 0,
    storageBonus: 0,
  },
  'crystal': {
    supplyMultiplier: 0.8,
    demandMultiplier: 1.2,
    priceMultiplier: 1.5,
    productionBonus: 0.05,
    storageBonus: 0.1,
  },
  'deuterium': {
    supplyMultiplier: 0.5,
    demandMultiplier: 1.5,
    priceMultiplier: 2.0,
    productionBonus: 0.1,
    storageBonus: 0.2,
  },
  'energy': {
    supplyMultiplier: 0.9,
    demandMultiplier: 0.8,
    priceMultiplier: 0.5,
    productionBonus: 0,
    storageBonus: 0,
  },
  'exotic-matter': {
    supplyMultiplier: 0.1,
    demandMultiplier: 2.0,
    priceMultiplier: 100,
    productionBonus: 0.5,
    storageBonus: 0.5,
  },
  'dark-matter': {
    supplyMultiplier: 0.05,
    demandMultiplier: 2.5,
    priceMultiplier: 500,
    productionBonus: 1.0,
    storageBonus: 1.0,
  },
  'antimatter': {
    supplyMultiplier: 0.01,
    demandMultiplier: 3.0,
    priceMultiplier: 1000,
    productionBonus: 2.0,
    storageBonus: 2.0,
  },
  'exotic-crystal': {
    supplyMultiplier: 0.2,
    demandMultiplier: 2.0,
    priceMultiplier: 250,
    productionBonus: 0.8,
    storageBonus: 0.8,
  },
  'void-matter': {
    supplyMultiplier: 0.001,
    demandMultiplier: 5.0,
    priceMultiplier: 5000,
    productionBonus: 5.0,
    storageBonus: 5.0,
  },
  'celestial-essence': {
    supplyMultiplier: 0.0001,
    demandMultiplier: 10.0,
    priceMultiplier: 999999,
    productionBonus: 99,
    storageBonus: 99,
  },
  // 18 new resource elements
  'solar-plasma':       { supplyMultiplier: 0.4,    demandMultiplier: 1.5,  priceMultiplier: 45,    productionBonus: 0.15, storageBonus: 0.05 },
  'stellar-ash':        { supplyMultiplier: 0.2,    demandMultiplier: 2.0,  priceMultiplier: 150,   productionBonus: 0.30, storageBonus: 0.20 },
  'nebula-gas':         { supplyMultiplier: 0.9,    demandMultiplier: 1.1,  priceMultiplier: 5,     productionBonus: 0.05, storageBonus: 0.00 },
  'nebula-dust':        { supplyMultiplier: 0.7,    demandMultiplier: 1.2,  priceMultiplier: 18,    productionBonus: 0.08, storageBonus: 0.05 },
  'cold-plasma':        { supplyMultiplier: 0.3,    demandMultiplier: 1.8,  priceMultiplier: 80,    productionBonus: 0.20, storageBonus: 0.10 },
  'hot-plasma':         { supplyMultiplier: 0.15,   demandMultiplier: 2.5,  priceMultiplier: 350,   productionBonus: 0.50, storageBonus: 0.00 },
  'quantum-fiber':      { supplyMultiplier: 0.05,   demandMultiplier: 3.0,  priceMultiplier: 1200,  productionBonus: 1.00, storageBonus: 0.50 },
  'superposed-crystal': { supplyMultiplier: 0.04,   demandMultiplier: 3.5,  priceMultiplier: 2000,  productionBonus: 1.50, storageBonus: 0.80 },
  'rift-shard':         { supplyMultiplier: 0.02,   demandMultiplier: 4.0,  priceMultiplier: 5000,  productionBonus: 2.00, storageBonus: 1.00 },
  'fold-essence':       { supplyMultiplier: 0.015,  demandMultiplier: 4.5,  priceMultiplier: 8000,  productionBonus: 3.00, storageBonus: 1.50 },
  'temporal-echo':      { supplyMultiplier: 0.008,  demandMultiplier: 5.0,  priceMultiplier: 25000, productionBonus: 5.00, storageBonus: 2.00 },
  'temporal-shard':     { supplyMultiplier: 0.005,  demandMultiplier: 5.5,  priceMultiplier: 40000, productionBonus: 6.00, storageBonus: 3.00 },
  'psionic-crystal':    { supplyMultiplier: 0.06,   demandMultiplier: 3.0,  priceMultiplier: 1800,  productionBonus: 1.20, storageBonus: 0.60 },
  'bio-resin':          { supplyMultiplier: 0.6,    demandMultiplier: 1.3,  priceMultiplier: 25,    productionBonus: 0.10, storageBonus: 0.10 },
  'nano-alloy':         { supplyMultiplier: 0.18,   demandMultiplier: 2.2,  priceMultiplier: 300,   productionBonus: 0.40, storageBonus: 0.30 },
  'resonant-lattice':   { supplyMultiplier: 0.12,   demandMultiplier: 2.0,  priceMultiplier: 500,   productionBonus: 0.60, storageBonus: 0.40 },
  'graviton-ore':       { supplyMultiplier: 0.03,   demandMultiplier: 4.0,  priceMultiplier: 3000,  productionBonus: 2.50, storageBonus: 1.00 },
  'em-flux-compound':   { supplyMultiplier: 0.14,   demandMultiplier: 1.9,  priceMultiplier: 400,   productionBonus: 0.55, storageBonus: 0.25 },
};

/**
 * Calculate resource extraction rate with progression
 */
export function calculateExtractionRate(
  resourceId: ResourceType,
  mineLevel: number,
  mineTier: number,
  veinQuality: number = 100
): number {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (!resource) return 0;

  const economy = RESOURCE_ECONOMIES[resourceId];
  const multiplier = ProgressionSystem.getTotalMultiplier(mineLevel, mineTier);
  
  // Base production for this resource (different for each)
  const baseProduction: Record<ResourceType, number> = {
    'metal': 30,
    'crystal': 20,
    'deuterium': 10,
    'energy': 20,
    'exotic-matter': 5,
    'dark-matter': 2,
    'antimatter': 0.5,
    'exotic-crystal': 8,
    'void-matter': 0.1,
    'celestial-essence': 0.001,
    // 18 new resource elements
    'solar-plasma': 15,
    'stellar-ash': 8,
    'nebula-gas': 40,
    'nebula-dust': 25,
    'cold-plasma': 12,
    'hot-plasma': 6,
    'quantum-fiber': 3,
    'superposed-crystal': 2,
    'rift-shard': 1.5,
    'fold-essence': 1,
    'temporal-echo': 0.5,
    'temporal-shard': 0.3,
    'psionic-crystal': 4,
    'bio-resin': 20,
    'nano-alloy': 7,
    'resonant-lattice': 5,
    'graviton-ore': 2,
    'em-flux-compound': 9,
  };

  const production = (baseProduction[resourceId] || 0) * multiplier;
  const qualityFactor = veinQuality / 100;
  
  return Math.floor(production * qualityFactor * economy.supplyMultiplier);
}

/**
 * Calculate resource storage capacity
 */
export function calculateStorageCapacity(
  resourceId: ResourceType,
  storageLevel: number,
  storageTier: number
): number {
  const economy = RESOURCE_ECONOMIES[resourceId];
  const multiplier = ProgressionSystem.getTotalMultiplier(storageLevel, storageTier);
  
  // Base capacity per resource
  const baseCapacity: Record<ResourceType, number> = {
    'metal': 100000,
    'crystal': 100000,
    'deuterium': 50000,
    'energy': 500000,
    'exotic-matter': 10000,
    'dark-matter': 5000,
    'antimatter': 1000,
    'exotic-crystal': 8000,
    'void-matter': 100,
    'celestial-essence': 10,
    // 18 new resource elements
    'solar-plasma': 20000,
    'stellar-ash': 50000,
    'nebula-gas': 200000,
    'nebula-dust': 80000,
    'cold-plasma': 30000,
    'hot-plasma': 10000,
    'quantum-fiber': 5000,
    'superposed-crystal': 3000,
    'rift-shard': 2000,
    'fold-essence': 1500,
    'temporal-echo': 500,
    'temporal-shard': 1000,
    'psionic-crystal': 8000,
    'bio-resin': 60000,
    'nano-alloy': 40000,
    'resonant-lattice': 25000,
    'graviton-ore': 8000,
    'em-flux-compound': 30000,
  };

  const capacity = (baseCapacity[resourceId] || 100000) * multiplier;
  return Math.floor(capacity * (1 + economy.storageBonus));
}

/**
 * Calculate resource value at market price
 */
export function calculateResourceValue(
  resourceId: ResourceType,
  amount: number,
  marketMultiplier: number = 1.0
): number {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (!resource) return 0;

  const economy = RESOURCE_ECONOMIES[resourceId];
  const baseValue = resource.baseValue;
  const marketPrice = baseValue * economy.priceMultiplier * marketMultiplier;
  
  return Math.floor(amount * marketPrice);
}

/**
 * Get resources available at a tier
 */
export function getResourcesForTier(tier: number): Resource[] {
  return RESOURCES.filter(r => r.unlockTier <= tier);
}

/**
 * Get resource by ID
 */
export function getResource(resourceId: ResourceType): Resource | undefined {
  return RESOURCES.find(r => r.id === resourceId);
}

/**
 * Get resources by category
 */
export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return RESOURCES.filter(r => r.category === category);
}

/**
 * Calculate total wealth from resources
 */
export function calculateTotalWealth(
  resources: Record<ResourceType, number>,
  marketMultiplier: number = 1.0
): number {
  let total = 0;
  
  for (const [resourceId, amount] of Object.entries(resources)) {
    total += calculateResourceValue(resourceId as ResourceType, amount, marketMultiplier);
  }
  
  return total;
}

/**
 * Convert resources to standard units (metal equivalents)
 */
export function convertToMetalEquivalent(
  resources: Record<ResourceType, number>
): number {
  let equivalent = 0;
  
  for (const [resourceId, amount] of Object.entries(resources)) {
    const resource = getResource(resourceId as ResourceType);
    if (resource) {
      equivalent += amount * (resource.baseValue / METAL.baseValue);
    }
  }
  
  return equivalent;
}

/**
 * Get resource rarity color for UI
 */
export function getResourceRarityColor(resourceId: ResourceType): string {
  const resource = getResource(resourceId);
  if (!resource) return '#808080';

  const colors: Record<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic', string> = {
    'common': '#808080',
    'uncommon': '#228B22',
    'rare': '#0000FF',
    'epic': '#9932CC',
    'legendary': '#FFD700',
    'mythic': '#FF6347',
  };

  return colors[resource.rarity];
}

/**
 * Calculate resource decay over time (for certain resources)
 */
export function calculateResourceDecay(
  resourceId: ResourceType,
  amount: number,
  daysPassed: number
): number {
  const decayRates: Record<ResourceType, number> = {
    'metal': 0, // No decay
    'crystal': 0, // No decay
    'deuterium': 0.01, // 1% per day
    'energy': 0, // Regenerates
    'exotic-matter': 0.05, // 5% per day
    'dark-matter': 0.1, // 10% per day
    'antimatter': 0.2, // 20% per day
    'exotic-crystal': 0.02, // 2% per day
    'void-matter': 0.15, // 15% per day
    'celestial-essence': 0.05, // 5% per day
    // 18 new resource elements
    'solar-plasma':       0.139, // ~5-day half-life
    'stellar-ash':        0,     // No decay
    'nebula-gas':         0,     // No decay
    'nebula-dust':        0,     // No decay
    'cold-plasma':        0.023, // ~30-day half-life
    'hot-plasma':         0.347, // ~2-day half-life
    'quantum-fiber':      0,     // No decay
    'superposed-crystal': 0,     // No decay
    'rift-shard':         0.069, // ~10-day half-life
    'fold-essence':       0.099, // ~7-day half-life
    'temporal-echo':      0.231, // ~3-day half-life
    'temporal-shard':     0,     // No decay
    'psionic-crystal':    0,     // No decay
    'bio-resin':          0.035, // ~20-day half-life
    'nano-alloy':         0,     // No decay
    'resonant-lattice':   0,     // No decay
    'graviton-ore':       0,     // No decay
    'em-flux-compound':   0.046, // ~15-day half-life
  };

  const decayRate = decayRates[resourceId] || 0;
  const decayed = amount * Math.pow(1 - decayRate, daysPassed);
  
  return Math.floor(decayed);
}
