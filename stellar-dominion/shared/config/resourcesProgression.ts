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
  | 'celestial-essence';

export type ResourceCategory = 
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'exotic'
  | 'godlike'
  | 'transcendent';

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
  };

  const decayRate = decayRates[resourceId] || 0;
  const decayed = amount * Math.pow(1 - decayRate, daysPassed);
  
  return Math.floor(decayed);
}
