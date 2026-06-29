/**
 * Planets Progression System
 * Supports 1-99 tiers and 1-999 levels for planets
 * Includes planet types, habitable zones, resource distribution, and building areas
 */

import { ProgressionSystem } from './progressionSystem';
import { ResourceType } from './resourcesProgression';

export type PlanetType = 
  | 'terrestrial'
  | 'ocean'
  | 'desert'
  | 'ice'
  | 'volcanic'
  | 'toxic'
  | 'gas-giant'
  | 'ice-giant'
  | 'lava'
  | 'exotic';

export type PlanetClass = 
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T';

export type Atmosphere = 
  | 'none'
  | 'trace'
  | 'thin'
  | 'thick'
  | 'thin-low'
  | 'thin-high'
  | 'standard'
  | 'dense'
  | 'dense-low'
  | 'dense-high'
  | 'superdense'
  | 'exotic';

export type Hydrosphere = 'none' | 'trace' | 'small' | 'moderate' | 'large' | 'complete' | 'superliquid';

export interface PlanetStats {
  gravity: number;
  temperature: number;
  atmosphere: Atmosphere;
  hydrosphere: Hydrosphere;
  habitability: number; // 0-100
  resources: Record<ResourceType, number>;
  fertility: number;
  danger: number;
}

export interface BuildingArea {
  id: string;
  type: 'land' | 'ocean' | 'orbital' | 'underground' | 'aerial';
  maxBuildings: number;
  currentBuildings: number;
  size: number; // km²
  development: number; // 0-100
}

export interface Planet {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  type: PlanetType;
  class: PlanetClass;
  tier: number;
  level: number;
  owner: string | null;
  description: string;
  icon: string;
  stats: PlanetStats;
  buildingAreas: BuildingArea[];
  population: number;
  development: number; // 0-100
  explored: boolean;
  discoverer: string | null;
}

/**
 * Planet type configuration
 */
export interface PlanetTypeConfig {
  name: string;
  description: string;
  baseHabitability: number;
  baseTemperature: number;
  baseGravity: number;
  atmosphere: Atmosphere;
  hydrosphere: Hydrosphere;
  resourceMultipliers: Partial<Record<ResourceType, number>>;
  buildableAreas: Array<'land' | 'ocean' | 'orbital' | 'underground' | 'aerial'>;
  dangers: string[];
  color: string;
}

export const PLANET_TYPES: Record<PlanetType, PlanetTypeConfig> = {
  'terrestrial': {
    name: 'Terrestrial',
    description: 'Earth-like rocky planet suitable for habitation',
    baseHabitability: 80,
    baseTemperature: 15,
    baseGravity: 1.0,
    atmosphere: 'standard',
    hydrosphere: 'moderate',
    resourceMultipliers: {
      'metal': 1.0,
      'crystal': 0.8,
      'deuterium': 0.5,
      'energy': 0.8,
      'exotic-matter': 0.1,
      'dark-matter': 0,
      'antimatter': 0,
      'exotic-crystal': 0.3,
      'void-matter': 0,
      'celestial-essence': 0,
    },
    buildableAreas: ['land', 'orbital', 'underground'],
    dangers: [],
    color: '#4A90E2',
  },

  'ocean': {
    name: 'Ocean World',
    description: 'Water-covered planet with small islands',
    baseHabitability: 75,
    baseTemperature: 10,
    baseGravity: 0.95,
    atmosphere: 'standard',
    hydrosphere: 'complete',
    resourceMultipliers: {
      'metal': 0.6,
      'crystal': 1.2,
      'deuterium': 2.0,
      'energy': 1.0,
      'exotic-matter': 0.2,
      'dark-matter': 0.05,
      'antimatter': 0,
      'exotic-crystal': 0.5,
      'void-matter': 0,
      'celestial-essence': 0,
    },
    buildableAreas: ['ocean', 'orbital', 'underground'],
    dangers: ['tsunamis', 'storms'],
    color: '#3498DB',
  },

  'desert': {
    name: 'Desert World',
    description: 'Arid planetary surface with vast deserts',
    baseHabitability: 40,
    baseTemperature: 45,
    baseGravity: 0.85,
    atmosphere: 'thin',
    hydrosphere: 'trace',
    resourceMultipliers: {
      'metal': 1.2,
      'crystal': 1.5,
      'deuterium': 0.3,
      'energy': 2.0,
      'exotic-matter': 0.3,
      'dark-matter': 0.1,
      'antimatter': 0,
      'exotic-crystal': 0.8,
      'void-matter': 0,
      'celestial-essence': 0,
    },
    buildableAreas: ['land', 'orbital', 'underground'],
    dangers: ['dust-storms', 'extreme-heat'],
    color: '#F4D03F',
  },

  'ice': {
    name: 'Ice World',
    description: 'Frozen planet covered in ice and snow',
    baseHabitability: 30,
    baseTemperature: -50,
    baseGravity: 0.9,
    atmosphere: 'thin',
    hydrosphere: 'large',
    resourceMultipliers: {
      'metal': 0.9,
      'crystal': 2.0,
      'deuterium': 1.5,
      'energy': 0.5,
      'exotic-matter': 0.1,
      'dark-matter': 0.2,
      'antimatter': 0,
      'exotic-crystal': 0.6,
      'void-matter': 0,
      'celestial-essence': 0,
    },
    buildableAreas: ['land', 'orbital', 'underground'],
    dangers: ['blizzards', 'extreme-cold'],
    color: '#ECF0F1',
  },

  'volcanic': {
    name: 'Volcanic World',
    description: 'Active volcanic world with lava flows',
    baseHabitability: 20,
    baseTemperature: 80,
    baseGravity: 1.1,
    atmosphere: 'thick',
    hydrosphere: 'none',
    resourceMultipliers: {
      'metal': 2.0,
      'crystal': 1.0,
      'deuterium': 0.8,
      'energy': 1.5,
      'exotic-matter': 0.5,
      'dark-matter': 0.15,
      'antimatter': 0.1,
      'exotic-crystal': 0.9,
      'void-matter': 0,
      'celestial-essence': 0,
    },
    buildableAreas: ['land', 'orbital', 'underground'],
    dangers: ['eruptions', 'lava-flows', 'extreme-heat'],
    color: '#E74C3C',
  },

  'toxic': {
    name: 'Toxic World',
    description: 'Chemically toxic atmosphere and landscape',
    baseHabitability: 10,
    baseTemperature: 35,
    baseGravity: 1.05,
    atmosphere: 'dense',
    hydrosphere: 'small',
    resourceMultipliers: {
      'metal': 0.7,
      'crystal': 0.6,
      'deuterium': 0.9,
      'energy': 0.7,
      'exotic-matter': 1.5,
      'dark-matter': 0.3,
      'antimatter': 0.05,
      'exotic-crystal': 1.2,
      'void-matter': 0.01,
      'celestial-essence': 0,
    },
    buildableAreas: ['orbital', 'underground'],
    dangers: ['toxic-atmosphere', 'corrosive-rain', 'acid-seas'],
    color: '#27AE60',
  },

  'gas-giant': {
    name: 'Gas Giant',
    description: 'Massive gaseous planet with no solid surface',
    baseHabitability: 0,
    baseTemperature: -100,
    baseGravity: 2.5,
    atmosphere: 'superdense',
    hydrosphere: 'none',
    resourceMultipliers: {
      'metal': 0.2,
      'crystal': 0.3,
      'deuterium': 3.0,
      'energy': 1.5,
      'exotic-matter': 0.7,
      'dark-matter': 0.5,
      'antimatter': 0.2,
      'exotic-crystal': 0.4,
      'void-matter': 0.05,
      'celestial-essence': 0,
    },
    buildableAreas: ['orbital'],
    dangers: ['extreme-pressure', 'storms'],
    color: '#95A5A6',
  },

  'ice-giant': {
    name: 'Ice Giant',
    description: 'Frozen giant planet with icy composition',
    baseHabitability: 0,
    baseTemperature: -200,
    baseGravity: 1.8,
    atmosphere: 'dense',
    hydrosphere: 'complete',
    resourceMultipliers: {
      'metal': 0.3,
      'crystal': 1.5,
      'deuterium': 2.5,
      'energy': 0.3,
      'exotic-matter': 0.3,
      'dark-matter': 1.0,
      'antimatter': 0.1,
      'exotic-crystal': 0.5,
      'void-matter': 0.1,
      'celestial-essence': 0,
    },
    buildableAreas: ['orbital'],
    dangers: ['extreme-cold', 'storms'],
    color: '#3498DB',
  },

  'lava': {
    name: 'Lava World',
    description: 'Molten surface with active lava seas',
    baseHabitability: 5,
    baseTemperature: 150,
    baseGravity: 1.2,
    atmosphere: 'thin-high',
    hydrosphere: 'none',
    resourceMultipliers: {
      'metal': 3.0,
      'crystal': 0.8,
      'deuterium': 0.5,
      'energy': 2.5,
      'exotic-matter': 2.0,
      'dark-matter': 0.5,
      'antimatter': 0.3,
      'exotic-crystal': 2.0,
      'void-matter': 0.05,
      'celestial-essence': 0,
    },
    buildableAreas: ['orbital', 'underground'],
    dangers: ['lava-flows', 'extreme-heat', 'radiation'],
    color: '#C0392B',
  },

  'exotic': {
    name: 'Exotic World',
    description: 'Reality-warping exotic world',
    baseHabitability: 50,
    baseTemperature: 20,
    baseGravity: 1.5,
    atmosphere: 'exotic',
    hydrosphere: 'superliquid',
    resourceMultipliers: {
      'metal': 1.0,
      'crystal': 1.0,
      'deuterium': 1.0,
      'energy': 2.0,
      'exotic-matter': 5.0,
      'dark-matter': 3.0,
      'antimatter': 1.0,
      'exotic-crystal': 5.0,
      'void-matter': 2.0,
      'celestial-essence': 0.5,
    },
    buildableAreas: ['land', 'ocean', 'orbital', 'underground', 'aerial'],
    dangers: ['reality-distortion', 'exotic-anomalies'],
    color: '#9B59B6',
  },
};

/**
 * Generate planet
 */
export function generatePlanet(
  id: string,
  name: string,
  x: number,
  y: number,
  z: number,
  type: PlanetType,
  tier: number = 1
): Planet {
  const typeConfig = PLANET_TYPES[type];
  const level = Math.floor(Math.random() * 100) + 1;
  const multiplier = ProgressionSystem.getTotalMultiplier(level, tier);

  // Calculate stats
  const stats: PlanetStats = {
    gravity: typeConfig.baseGravity,
    temperature: typeConfig.baseTemperature,
    atmosphere: typeConfig.atmosphere,
    hydrosphere: typeConfig.hydrosphere,
    habitability: Math.max(0, Math.min(100, typeConfig.baseHabitability + (level * 0.5) - (tier * 2))),
    resources: {} as Record<ResourceType, number>,
    fertility: typeConfig.baseHabitability > 50 ? Math.random() * 100 : Math.random() * 30,
    danger: 100 - typeConfig.baseHabitability + (tier * 5),
  };

  // Generate resources
  const resourceTypes: ResourceType[] = ['metal', 'crystal', 'deuterium', 'energy', 'exotic-matter', 'dark-matter', 'antimatter', 'exotic-crystal', 'void-matter', 'celestial-essence'];
  
  for (const resourceType of resourceTypes) {
    const baseAmount = Math.random() * 10000;
    const multiplierForResource = typeConfig.resourceMultipliers[resourceType] || 0;
    stats.resources[resourceType] = Math.floor(baseAmount * multiplierForResource * multiplier);
  }

  // Create building areas
  const buildingAreas: BuildingArea[] = typeConfig.buildableAreas.map(areaType => {
    const maxBuildingsBase = { 'land': 100, 'ocean': 50, 'orbital': 20, 'underground': 30, 'aerial': 15 };
    return {
      id: `area-${id}-${areaType}`,
      type: areaType as any,
      maxBuildings: (maxBuildingsBase[areaType] || 50) * multiplier,
      currentBuildings: 0,
      size: Math.random() * 1000000 + 100000,
      development: 0,
    };
  });

  return {
    id,
    name,
    coordinates: { x, y, z },
    type,
    class: generatePlanetClass(),
    tier,
    level,
    owner: null,
    description: `A ${typeConfig.name} planet at coordinates ${x}:${y}:${z}`,
    icon: typeConfig.name === 'Terrestrial' ? '🌍' : '🪐',
    stats,
    buildingAreas,
    population: 0,
    development: 0,
    explored: false,
    discoverer: null,
  };
}

/**
 * Generate random planet class
 */
function generatePlanetClass(): PlanetClass {
  const classes: PlanetClass[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  return classes[Math.floor(Math.random() * classes.length)];
}

/**
 * Calculate planet development bonus
 */
export function getPlanetDevelopmentBonus(planet: Planet): Record<string, number> {
  const development = planet.development / 100;
  
  return {
    productionBonus: development * 0.5,
    researchBonus: development * 0.3,
    populationGrowth: development * 0.2,
    defenseBonus: development * 0.4,
    storageBonus: development * 0.25,
  };
}

/**
 * Calculate available building area
 */
export function getAvailableBuildingArea(planet: Planet): BuildingArea[] {
  return planet.buildingAreas.filter(area => area.currentBuildings < area.maxBuildings);
}

/**
 * Add building to area
 */
export function addBuildingToArea(planet: Planet, areaType: 'land' | 'ocean' | 'orbital' | 'underground' | 'aerial'): boolean {
  const area = planet.buildingAreas.find(a => a.type === areaType);
  if (!area || area.currentBuildings >= area.maxBuildings) return false;
  
  area.currentBuildings++;
  return true;
}

/**
 * Get colonizable planets
 */
export function getColonizablePlanets(planets: Planet[], minHabitability: number = 50): Planet[] {
  return planets.filter(p => 
    !p.owner && 
    p.explored && 
    p.stats.habitability >= minHabitability &&
    p.type !== 'gas-giant' &&
    p.type !== 'ice-giant'
  );
}

/**
 * Planets by type
 */
export function getPlanetsByType(planets: Planet[], type: PlanetType): Planet[] {
  return planets.filter(p => p.type === type);
}
