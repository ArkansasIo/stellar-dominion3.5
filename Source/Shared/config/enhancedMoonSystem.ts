/**
 * Enhanced Moon System
 * Detailed moon status, sub-stats, attributes, conditions, and information
 * Supports 1-99 tiers and 1-999 levels
 */

import { MoonType, MoonStats, MoonBase } from './moonsProgression';

export type MoonCondition = 
  | 'stable'
  | 'tidal-locked'
  | 'volcanic-activity'
  | 'ice-quakes'
  | 'dust-storms'
  | 'radiation-storm'
  | 'meteor-shower'
  | 'mycelial-bloom' // For spore drive integration
  | 'dimensional-thin'
  | 'quantum-flux';

export type MoonAtmosphere = 
  | 'none'
  | 'thin-exosphere'
  | 'trace-gases'
  | 'nitrogen-rich'
  | 'oxygen-rich'
  | 'methane-heavy'
  | 'carbon-dioxide'
  | 'toxic-mix';

export type MoonBiome = 
  | 'barren-rock'
  | 'cratered-highlands'
  | 'mare-basins'
  | 'mountain-ranges'
  | 'ice-fields'
  | 'lava-tubes'
  | 'crystal-caverns'
  | 'organic-swamps'
  | 'mycelial-forests' // Spore-related
  | 'dimensional-rifts';

export interface MoonSubStats {
  // Resource bonuses
  metalBonus: number; // Percentage bonus to metal mining
  crystalBonus: number; // Percentage bonus to crystal mining
  deuteriumBonus: number; // Percentage bonus to deuterium extraction
  energyBonus: number; // Percentage bonus to energy production
  
  // Production modifiers
  miningSpeed: number; // Multiplier for mining operations
  researchSpeed: number; // Multiplier for research labs
  constructionSpeed: number; // Multiplier for building construction
  shipRepairSpeed: number; // Multiplier for ship repairs
  
  // Defense modifiers
  shieldStrength: number; // Bonus to shield capacity
  armorBonus: number; // Bonus to armor effectiveness
  stealthRating: number; // Reduces detection chance
  pointDefense: number; // Bonus to anti-missile/anti-fighter
  
  // Special attributes
  gravityModifier: number; // Affects ship performance and troop deployment
  radiationLevel: number; // 0-100, affects crew health and equipment
  temperature: number; // Average surface temperature in Celsius
  atmosphericDensity: number; // 0-100, affects operations
  
  // Spore Drive specific
  mycelialConcentration: number; // 0-100, spore drive fuel quality
  dimensionalStability: number; // 0-100, affects spore drive safety
  navigationClarity: number; // 0-100, affects spore drive accuracy
}

export interface MoonAttributes {
  // Physical properties
  diameter: number; // km
  mass: number; // Earth masses
  gravity: number; // m/s²
  escapeVelocity: number; // km/s
  
  // Orbital properties
  orbitalPeriod: number; // Earth days
  semiMajorAxis: number; // km from parent planet
  eccentricity: number; // 0-1, orbital eccentricity
  inclination: number; // degrees from equatorial plane
  
  // Environmental
  surfaceTemperature: { min: number; max: number; avg: number }; // Celsius
  atmosphericPressure: number; // kPa (0 for none)
  atmosphericComposition: string[]; // Gas percentages
  magneticField: number; // 0-100, strength
  
  // Resources
  resourceRichness: {
    metal: number; // 0-100
    crystal: number; // 0-100
    deuterium: number; // 0-100
    exoticMatter: number; // 0-100
    mycelialSpores: number; // 0-100, for spore drive
  };
  
  // Habitability
  habitabilityIndex: number; // 0-100
  radiationLevel: number; // 0-100
  waterPresence: number; // 0-100
  biosphereComplexity: number; // 0-100
}

export interface MoonDetails {
  // Discovery and history
  discoveryDate: string;
  discoveredBy: string;
  firstColonized: string | null;
  colonizationHistory: Array<{
    date: string;
    event: string;
    colonizer: string;
  }>;
  
  // Current status
  currentOwner: string | null;
  controllingFaction: string | null;
  population: number;
  populationCapacity: number;
  
  // Infrastructure
  buildingCount: number;
  infrastructureLevel: number; // 1-999
  developmentStage: 'undeveloped' | 'outpost' | 'colony' | 'city' | 'metropolis' | 'ascended';
  
  // Economic
  gdp: number;
  tradeVolume: number;
  primaryExports: string[];
  primaryImports: string[];
  
  // Military
  defenseRating: number;
  garrisonSize: number;
  orbitalDefenses: number;
  shieldStatus: 'offline' | 'partial' | 'full' | 'overcharge';
  
  // Special features
  uniqueFeatures: string[];
  anomalies: string[];
  strategicValue: number; // 0-100
  scientificValue: number; // 0-100
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ascended';
}

export interface MoonStatus {
  // Overall status
  condition: MoonCondition;
  stability: number; // 0-100
  health: number; // 0-100
  
  // Activity
  isInhabited: boolean;
  isColonized: boolean;
  isDeveloped: boolean;
  isUnderAttack: boolean;
  isBlockaded: boolean;
  
  // Events
  activeEvents: Array<{
    type: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    description: string;
    duration: number; // minutes remaining
    effects: Record<string, number>;
  }>;
  
  // Alerts
  alerts: Array<{
    level: 'info' | 'warning' | 'danger' | 'critical';
    message: string;
    timestamp: number;
  }>;
  
  // Connectivity
  hasCommunications: boolean;
  hasTradeRoutes: boolean;
  hasDefensePact: boolean;
  supplyLinesStatus: 'optimal' | 'degraded' | 'critical' | 'cut';
}

export interface EnhancedMoon {
  // Core identity
  id: string;
  name: string;
  parentPlanetId: string;
  parentPlanetName: string;
  systemId: string;
  coordinates: string;
  
  // Classification
  tier: number; // 1-99
  level: number; // 1-999
  type: MoonType;
  biome: MoonBiome;
  atmosphere: MoonAtmosphere;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ascended';
  
  // Core stats from base system
  stats: MoonStats;
  
  // Comprehensive stats
  subStats: MoonSubStats;
  attributes: MoonAttributes;
  details: MoonDetails;
  status: MoonStatus;
  
  // Progression
  experience: number;
  experienceToNextLevel: number;
  unlockedFeatures: string[];
  
  // Resources
  resources: Record<string, number>;
  resourceCapacity: Record<string, number>;
  productionRates: Record<string, number>;
  
  // Bases and facilities
  base: MoonBase | null;
  facilities: Array<{
    id: string;
    type: string;
    level: number;
    status: 'operational' | 'damaged' | 'offline' | 'constructing';
    health: number;
  }>;
  
  // Visual
  icon: string;
  color: string;
  description: string;
  lore: string;
  
  // Metadata
  explored: boolean;
  discoverer: string | null;
  lastVisited: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface MoonTypeConfig {
  name: string;
  description: string;
  lore: string;
  baseMass: number;
  baseResourceDensity: number;
  baseStability: number;
  mineralWealth: number;
  buildingSuitability: number;
  color: string;
  specialProperties: string[];
  defaultBiome: MoonBiome;
  defaultAtmosphere: MoonAtmosphere;
  baseSubStats: Partial<MoonSubStats>;
  baseAttributes: Partial<MoonAttributes>;
}

export const ENHANCED_MOON_TYPES: Record<string, MoonTypeConfig> = {
  'rocky': {
    name: 'Rocky Moon',
    description: 'Standard rocky satellite with moderate resources',
    lore: 'The most common type of moon in the galaxy, formed from the same accretion disk as its parent planet.',
    baseMass: 0.5,
    baseResourceDensity: 0.8,
    baseStability: 0.85,
    mineralWealth: 60,
    buildingSuitability: 75,
    color: '#8B7355',
    specialProperties: ['standard-conditions', 'mining-friendly'],
    defaultBiome: 'cratered-highlands',
    defaultAtmosphere: 'none',
    baseSubStats: {
      metalBonus: 10,
      crystalBonus: 5,
      deuteriumBonus: 0,
      energyBonus: 5,
      miningSpeed: 1.0,
      researchSpeed: 1.0,
      constructionSpeed: 1.0,
      shipRepairSpeed: 1.0,
      shieldStrength: 1.0,
      armorBonus: 1.0,
      stealthRating: 1.0,
      pointDefense: 1.0,
      gravityModifier: 1.0,
      radiationLevel: 5,
      temperature: -50,
      atmosphericDensity: 0,
      mycelialConcentration: 0,
      dimensionalStability: 100,
      navigationClarity: 100,
    },
    baseAttributes: {
      diameter: 3474,
      mass: 0.012,
      gravity: 1.62,
      escapeVelocity: 2.38,
      orbitalPeriod: 27.3,
      semiMajorAxis: 384400,
      eccentricity: 0.055,
      inclination: 5.1,
      surfaceTemperature: { min: -173, max: 127, avg: -20 },
      atmosphericPressure: 0,
      atmosphericComposition: [],
      magneticField: 1,
      resourceRichness: { metal: 60, crystal: 40, deuterium: 10, exoticMatter: 0, mycelialSpores: 0 },
      habitabilityIndex: 0,
      radiationLevel: 5,
      waterPresence: 0,
      biosphereComplexity: 0,
    },
  },

  'icy': {
    name: 'Icy Moon',
    description: 'Frozen moon with water ice and potential for life',
    lore: 'These frozen worlds hide vast oceans beneath their icy crusts, making them prime targets for colonization.',
    baseMass: 0.4,
    baseResourceDensity: 0.6,
    baseStability: 0.9,
    mineralWealth: 40,
    buildingSuitability: 60,
    color: '#E0FFFF',
    specialProperties: ['water-ice', 'stable-orbit', 'subsurface-ocean'],
    defaultBiome: 'ice-fields',
    defaultAtmosphere: 'trace-gases',
    baseSubStats: {
      metalBonus: 5,
      crystalBonus: 10,
      deuteriumBonus: 20,
      energyBonus: 5,
      miningSpeed: 0.8,
      researchSpeed: 1.2,
      constructionSpeed: 0.9,
      shipRepairSpeed: 0.8,
      shieldStrength: 1.1,
      armorBonus: 1.0,
      stealthRating: 1.2,
      pointDefense: 0.9,
      gravityModifier: 0.8,
      radiationLevel: 2,
      temperature: -120,
      atmosphericDensity: 5,
      mycelialConcentration: 5,
      dimensionalStability: 95,
      navigationClarity: 90,
    },
    baseAttributes: {
      diameter: 2600,
      mass: 0.03,
      gravity: 1.15,
      escapeVelocity: 2.05,
      orbitalPeriod: 7.2,
      semiMajorAxis: 670900,
      eccentricity: 0.004,
      inclination: 0.2,
      surfaceTemperature: { min: -220, max: -80, avg: -160 },
      atmosphericPressure: 1,
      atmosphericComposition: ['oxygen', 'water-vapor'],
      magneticField: 2,
      resourceRichness: { metal: 30, crystal: 50, deuterium: 40, exoticMatter: 5, mycelialSpores: 10 },
      habitabilityIndex: 15,
      radiationLevel: 2,
      waterPresence: 85,
      biosphereComplexity: 10,
    },
  },

  'metallic': {
    name: 'Metallic Moon',
    description: 'Rich in metallic ore deposits, ideal for mining',
    lore: 'The remnants of a planetary core, these moons are pure treasure for mining operations.',
    baseMass: 1.2,
    baseResourceDensity: 1.5,
    baseStability: 0.75,
    mineralWealth: 95,
    buildingSuitability: 70,
    color: '#C0C0C0',
    specialProperties: ['high-metal-content', 'stable-orbit', 'magnetic-anomalies'],
    defaultBiome: 'mare-basins',
    defaultAtmosphere: 'none',
    baseSubStats: {
      metalBonus: 50,
      crystalBonus: 20,
      deuteriumBonus: 5,
      energyBonus: 10,
      miningSpeed: 1.5,
      researchSpeed: 0.9,
      constructionSpeed: 1.1,
      shipRepairSpeed: 1.2,
      shieldStrength: 1.3,
      armorBonus: 1.4,
      stealthRating: 0.7,
      pointDefense: 1.1,
      gravityModifier: 1.3,
      radiationLevel: 15,
      temperature: 200,
      atmosphericDensity: 0,
      mycelialConcentration: 0,
      dimensionalStability: 100,
      navigationClarity: 100,
    },
    baseAttributes: {
      diameter: 4800,
      mass: 0.18,
      gravity: 2.8,
      escapeVelocity: 4.2,
      orbitalPeriod: 12.5,
      semiMajorAxis: 421700,
      eccentricity: 0.02,
      inclination: 0.5,
      surfaceTemperature: { min: 100, max: 400, avg: 250 },
      atmosphericPressure: 0,
      atmosphericComposition: [],
      magneticField: 15,
      resourceRichness: { metal: 95, crystal: 60, deuterium: 20, exoticMatter: 10, mycelialSpores: 0 },
      habitabilityIndex: 0,
      radiationLevel: 15,
      waterPresence: 0,
      biosphereComplexity: 0,
    },
  },

  'organic': {
    name: 'Organic Moon',
    description: 'Contains organic compounds and potential life forms',
    lore: 'A rare treasure, these moons harbor complex ecosystems and valuable biological resources.',
    baseMass: 0.6,
    baseResourceDensity: 0.7,
    baseStability: 0.8,
    mineralWealth: 50,
    buildingSuitability: 85,
    color: '#228B22',
    specialProperties: ['organic-compounds', 'habitable', 'ecosystem'],
    defaultBiome: 'organic-swamps',
    defaultAtmosphere: 'nitrogen-rich',
    baseSubStats: {
      metalBonus: 5,
      crystalBonus: 10,
      deuteriumBonus: 10,
      energyBonus: 15,
      miningSpeed: 0.9,
      researchSpeed: 1.4,
      constructionSpeed: 1.0,
      shipRepairSpeed: 1.1,
      shieldStrength: 1.0,
      armorBonus: 1.0,
      stealthRating: 1.3,
      pointDefense: 1.0,
      gravityModifier: 0.9,
      radiationLevel: 3,
      temperature: 25,
      atmosphericDensity: 85,
      mycelialConcentration: 15,
      dimensionalStability: 98,
      navigationClarity: 95,
    },
    baseAttributes: {
      diameter: 3200,
      mass: 0.05,
      gravity: 1.4,
      escapeVelocity: 2.5,
      orbitalPeriod: 18.4,
      semiMajorAxis: 560000,
      eccentricity: 0.03,
      inclination: 2.1,
      surfaceTemperature: { min: 10, max: 45, avg: 28 },
      atmosphericPressure: 95,
      atmosphericComposition: ['nitrogen', 'oxygen', 'carbon-dioxide'],
      magneticField: 5,
      resourceRichness: { metal: 40, crystal: 50, deuterium: 30, exoticMatter: 15, mycelialSpores: 25 },
      habitabilityIndex: 75,
      radiationLevel: 3,
      waterPresence: 60,
      biosphereComplexity: 70,
    },
  },

  'exotic': {
    name: 'Exotic Moon',
    description: 'Displays unusual physical properties and exotic matter deposits',
    lore: 'Defying conventional physics, these moons exist in a state of quantum uncertainty.',
    baseMass: 0.8,
    baseResourceDensity: 2.0,
    baseStability: 0.6,
    mineralWealth: 80,
    buildingSuitability: 90,
    color: '#9B59B6',
    specialProperties: ['exotic-matter', 'reality-distortion', 'quantum-effects'],
    defaultBiome: 'dimensional-rifts',
    defaultAtmosphere: 'toxic-mix',
    baseSubStats: {
      metalBonus: 20,
      crystalBonus: 40,
      deuteriumBonus: 30,
      energyBonus: 50,
      miningSpeed: 1.3,
      researchSpeed: 1.8,
      constructionSpeed: 0.8,
      shipRepairSpeed: 0.7,
      shieldStrength: 1.5,
      armorBonus: 1.2,
      stealthRating: 1.5,
      pointDefense: 1.3,
      gravityModifier: 1.1,
      radiationLevel: 45,
      temperature: -100,
      atmosphericDensity: 15,
      mycelialConcentration: 40,
      dimensionalStability: 60,
      navigationClarity: 70,
    },
    baseAttributes: {
      diameter: 2800,
      mass: 0.08,
      gravity: 1.8,
      escapeVelocity: 3.1,
      orbitalPeriod: 9.8,
      semiMajorAxis: 520000,
      eccentricity: 0.15,
      inclination: 8.5,
      surfaceTemperature: { min: -200, max: 50, avg: -100 },
      atmosphericPressure: 12,
      atmosphericComposition: ['exotic-gases', 'dark-matter-particles'],
      magneticField: 25,
      resourceRichness: { metal: 70, crystal: 90, deuterium: 60, exoticMatter: 80, mycelialSpores: 50 },
      habitabilityIndex: 5,
      radiationLevel: 45,
      waterPresence: 10,
      biosphereComplexity: 20,
    },
  },

  'captured-asteroid': {
    name: 'Captured Asteroid',
    description: 'Asteroid captured by planet\'s gravity, rich in minerals',
    lore: 'Wandering the void until captured, these asteroids are gold mines for the taking.',
    baseMass: 0.3,
    baseResourceDensity: 1.3,
    baseStability: 0.5,
    mineralWealth: 85,
    buildingSuitability: 50,
    color: '#8B4513',
    specialProperties: ['unstable-orbit', 'high-mineral-content', 'irregular-shape'],
    defaultBiome: 'barren-rock',
    defaultAtmosphere: 'none',
    baseSubStats: {
      metalBonus: 35,
      crystalBonus: 25,
      deuteriumBonus: 10,
      energyBonus: 5,
      miningSpeed: 1.4,
      researchSpeed: 0.7,
      constructionSpeed: 0.8,
      shipRepairSpeed: 0.6,
      shieldStrength: 0.8,
      armorBonus: 0.9,
      stealthRating: 1.1,
      pointDefense: 0.8,
      gravityModifier: 0.5,
      radiationLevel: 20,
      temperature: -80,
      atmosphericDensity: 0,
      mycelialConcentration: 0,
      dimensionalStability: 85,
      navigationClarity: 90,
    },
    baseAttributes: {
      diameter: 500,
      mass: 0.001,
      gravity: 0.2,
      escapeVelocity: 0.5,
      orbitalPeriod: 3.2,
      semiMajorAxis: 280000,
      eccentricity: 0.4,
      inclination: 12.5,
      surfaceTemperature: { min: -150, max: 100, avg: -80 },
      atmosphericPressure: 0,
      atmosphericComposition: [],
      magneticField: 0,
      resourceRichness: { metal: 85, crystal: 70, deuterium: 30, exoticMatter: 5, mycelialSpores: 0 },
      habitabilityIndex: 0,
      radiationLevel: 20,
      waterPresence: 0,
      biosphereComplexity: 0,
    },
  },

  'crystalline': {
    name: 'Crystalline Moon',
    description: 'Surface covered in valuable crystals and energy resonating structures',
    lore: 'Formed under extreme pressure, these moons are natural crystal lattices with unique properties.',
    baseMass: 0.7,
    baseResourceDensity: 1.8,
    baseStability: 0.88,
    mineralWealth: 75,
    buildingSuitability: 80,
    color: '#FFD700',
    specialProperties: ['crystal-deposits', 'energy-resonance', 'piezoelectric'],
    defaultBiome: 'crystal-caverns',
    defaultAtmosphere: 'thin-exosphere',
    baseSubStats: {
      metalBonus: 15,
      crystalBonus: 60,
      deuteriumBonus: 10,
      energyBonus: 40,
      miningSpeed: 1.2,
      researchSpeed: 1.3,
      constructionSpeed: 1.1,
      shipRepairSpeed: 1.0,
      shieldStrength: 1.4,
      armorBonus: 1.1,
      stealthRating: 0.9,
      pointDefense: 1.2,
      gravityModifier: 1.0,
      radiationLevel: 8,
      temperature: 15,
      atmosphericDensity: 3,
      mycelialConcentration: 10,
      dimensionalStability: 92,
      navigationClarity: 88,
    },
    baseAttributes: {
      diameter: 2400,
      mass: 0.04,
      gravity: 1.5,
      escapeVelocity: 2.7,
      orbitalPeriod: 15.6,
      semiMajorAxis: 480000,
      eccentricity: 0.01,
      inclination: 1.2,
      surfaceTemperature: { min: -20, max: 60, avg: 15 },
      atmosphericPressure: 3,
      atmosphericComposition: ['argon', 'trace-gases'],
      magneticField: 8,
      resourceRichness: { metal: 50, crystal: 95, deuterium: 20, exoticMatter: 25, mycelialSpores: 5 },
      habitabilityIndex: 5,
      radiationLevel: 8,
      waterPresence: 5,
      biosphereComplexity: 5,
    },
  },

  'binary-moon': {
    name: 'Binary Moon System',
    description: 'Twin moons orbiting each other in a complex dance',
    lore: 'These paired moons create unique gravitational effects and tidal phenomena.',
    baseMass: 1.0,
    baseResourceDensity: 1.2,
    baseStability: 0.7,
    mineralWealth: 70,
    buildingSuitability: 75,
    color: '#F0E68C',
    specialProperties: ['binary-system', 'tidal-effects', 'gravitational-anomalies'],
    defaultBiome: 'mare-basins',
    defaultAtmosphere: 'none',
    baseSubStats: {
      metalBonus: 15,
      crystalBonus: 15,
      deuteriumBonus: 15,
      energyBonus: 20,
      miningSpeed: 1.1,
      researchSpeed: 1.2,
      constructionSpeed: 1.0,
      shipRepairSpeed: 1.1,
      shieldStrength: 1.2,
      armorBonus: 1.1,
      stealthRating: 1.0,
      pointDefense: 1.1,
      gravityModifier: 1.2,
      radiationLevel: 10,
      temperature: -40,
      atmosphericDensity: 0,
      mycelialConcentration: 8,
      dimensionalStability: 90,
      navigationClarity: 92,
    },
    baseAttributes: {
      diameter: 1800, // Each moon
      mass: 0.02, // Each moon
      gravity: 1.3,
      escapeVelocity: 2.3,
      orbitalPeriod: 21.4, // Around each other
      semiMajorAxis: 350000,
      eccentricity: 0.08,
      inclination: 3.5,
      surfaceTemperature: { min: -120, max: 80, avg: -40 },
      atmosphericPressure: 0,
      atmosphericComposition: [],
      magneticField: 3,
      resourceRichness: { metal: 65, crystal: 65, deuterium: 35, exoticMatter: 10, mycelialSpores: 8 },
      habitabilityIndex: 0,
      radiationLevel: 10,
      waterPresence: 5,
      biosphereComplexity: 5,
    },
  },
};

/**
 * Calculate moon sub-stats based on tier and level
 */
export function calculateMoonSubStats(
  baseSubStats: Partial<MoonSubStats>,
  tier: number,
  level: number
): MoonSubStats {
  const tierMultiplier = 1 + (tier - 1) * 0.1;
  const levelMultiplier = 1 + (level - 1) * 0.05;

  return {
    metalBonus: Math.floor((baseSubStats.metalBonus || 0) * tierMultiplier * levelMultiplier),
    crystalBonus: Math.floor((baseSubStats.crystalBonus || 0) * tierMultiplier * levelMultiplier),
    deuteriumBonus: Math.floor((baseSubStats.deuteriumBonus || 0) * tierMultiplier * levelMultiplier),
    energyBonus: Math.floor((baseSubStats.energyBonus || 0) * tierMultiplier * levelMultiplier),
    miningSpeed: Math.min(5, (baseSubStats.miningSpeed || 1) * tierMultiplier * levelMultiplier),
    researchSpeed: Math.min(5, (baseSubStats.researchSpeed || 1) * tierMultiplier * levelMultiplier),
    constructionSpeed: Math.min(5, (baseSubStats.constructionSpeed || 1) * tierMultiplier * levelMultiplier),
    shipRepairSpeed: Math.min(5, (baseSubStats.shipRepairSpeed || 1) * tierMultiplier * levelMultiplier),
    shieldStrength: Math.min(10, (baseSubStats.shieldStrength || 1) * tierMultiplier * levelMultiplier),
    armorBonus: Math.min(10, (baseSubStats.armorBonus || 1) * tierMultiplier * levelMultiplier),
    stealthRating: Math.min(10, (baseSubStats.stealthRating || 1) * tierMultiplier * levelMultiplier),
    pointDefense: Math.min(10, (baseSubStats.pointDefense || 1) * tierMultiplier * levelMultiplier),
    gravityModifier: Math.min(2, (baseSubStats.gravityModifier || 1) * (1 + (tier - 1) * 0.02)),
    radiationLevel: Math.floor((baseSubStats.radiationLevel || 0) * (1 - (level - 1) * 0.01)),
    temperature: baseSubStats.temperature || 0,
    atmosphericDensity: baseSubStats.atmosphericDensity || 0,
    mycelialConcentration: Math.min(100, (baseSubStats.mycelialConcentration || 0) * tierMultiplier),
    dimensionalStability: Math.min(100, (baseSubStats.dimensionalStability || 100) + (tier - 1) * 2),
    navigationClarity: Math.min(100, (baseSubStats.navigationClarity || 100) + (level - 1) * 0.5),
  };
}

/**
 * Calculate moon attributes based on tier and level
 */
export function calculateMoonAttributes(
  baseAttributes: Partial<MoonAttributes>,
  tier: number,
  level: number
): MoonAttributes {
  const tierMultiplier = 1 + (tier - 1) * 0.15;
  const levelMultiplier = 1 + (level - 1) * 0.08;

  return {
    diameter: Math.floor((baseAttributes.diameter || 1000) * tierMultiplier),
    mass: (baseAttributes.mass || 0.01) * tierMultiplier,
    gravity: (baseAttributes.gravity || 1) * tierMultiplier,
    escapeVelocity: (baseAttributes.escapeVelocity || 2) * tierMultiplier,
    orbitalPeriod: baseAttributes.orbitalPeriod || 10,
    semiMajorAxis: Math.floor((baseAttributes.semiMajorAxis || 300000) * (1 + (tier - 1) * 0.05)),
    eccentricity: baseAttributes.eccentricity || 0.05,
    inclination: baseAttributes.inclination || 2,
    surfaceTemperature: baseAttributes.surfaceTemperature || { min: -100, max: 100, avg: 0 },
    atmosphericPressure: baseAttributes.atmosphericPressure || 0,
    atmosphericComposition: baseAttributes.atmosphericComposition || [],
    magneticField: Math.floor((baseAttributes.magneticField || 0) * tierMultiplier),
    resourceRichness: {
      metal: Math.min(100, Math.floor((baseAttributes.resourceRichness?.metal || 0) * tierMultiplier * levelMultiplier)),
      crystal: Math.min(100, Math.floor((baseAttributes.resourceRichness?.crystal || 0) * tierMultiplier * levelMultiplier)),
      deuterium: Math.min(100, Math.floor((baseAttributes.resourceRichness?.deuterium || 0) * tierMultiplier * levelMultiplier)),
      exoticMatter: Math.min(100, Math.floor((baseAttributes.resourceRichness?.exoticMatter || 0) * tierMultiplier * levelMultiplier)),
      mycelialSpores: Math.min(100, Math.floor((baseAttributes.resourceRichness?.mycelialSpores || 0) * tierMultiplier * levelMultiplier)),
    },
    habitabilityIndex: Math.min(100, Math.floor((baseAttributes.habitabilityIndex || 0) * levelMultiplier)),
    radiationLevel: Math.floor((baseAttributes.radiationLevel || 0) * (1 - (level - 1) * 0.02)),
    waterPresence: Math.min(100, Math.floor((baseAttributes.waterPresence || 0) * levelMultiplier)),
    biosphereComplexity: Math.min(100, Math.floor((baseAttributes.biosphereComplexity || 0) * levelMultiplier)),
  };
}

/**
 * Generate comprehensive moon details
 */
export function generateMoonDetails(
  moonName: string,
  tier: number,
  level: number,
  owner: string | null
): MoonDetails {
  const developmentStage = getDevelopmentStage(level);
  const population = owner ? Math.floor(1000 * level * (1 + tier * 0.1)) : 0;

  return {
    discoveryDate: new Date(Date.now() - Math.random() * 315360000000).toISOString(),
    discoveredBy: 'Exploration Fleet',
    firstColonized: owner ? new Date(Date.now() - Math.random() * 157680000000).toISOString() : null,
    colonizationHistory: owner ? [
      {
        date: new Date(Date.now() - Math.random() * 157680000000).toISOString(),
        event: 'Initial colonization',
        colonizer: owner,
      },
    ] : [],
    currentOwner: owner,
    controllingFaction: owner,
    population,
    populationCapacity: Math.floor(population * 2.5),
    buildingCount: Math.floor(level / 5),
    infrastructureLevel: level,
    developmentStage,
    gdp: owner ? Math.floor(100000 * level * tier) : 0,
    tradeVolume: owner ? Math.floor(50000 * level * tier * 0.3) : 0,
    primaryExports: owner ? ['minerals', 'crystals', 'exotic-matter'] : [],
    primaryImports: owner ? ['food', 'equipment', 'technology'] : [],
    defenseRating: Math.floor(100 * tier * level * 0.1),
    garrisonSize: owner ? Math.floor(100 * level) : 0,
    orbitalDefenses: Math.floor(level / 3),
    shieldStatus: level > 50 ? 'overcharge' : level > 20 ? 'full' : level > 5 ? 'partial' : 'offline',
    uniqueFeatures: generateUniqueFeatures(tier, level),
    anomalies: generateAnomalies(tier),
    strategicValue: Math.min(100, Math.floor(tier * 1.5 + level * 0.5)),
    scientificValue: Math.min(100, Math.floor(tier * 2 + level * 0.3)),
    rarity: calculateMoonRarity('rocky', tier, []),
  };
}

function getDevelopmentStage(level: number): MoonDetails['developmentStage'] {
  if (level >= 900) return 'ascended';
  if (level >= 700) return 'metropolis';
  if (level >= 400) return 'city';
  if (level >= 150) return 'colony';
  if (level >= 50) return 'outpost';
  return 'undeveloped';
}

function generateUniqueFeatures(tier: number, level: number): string[] {
  const features: string[] = [];
  
  if (tier >= 10) features.push('Ancient alien ruins');
  if (tier >= 20) features.push('Crystal formation nexus');
  if (tier >= 30) features.push('Mycelial network node');
  if (tier >= 40) features.push('Dimensional rift anchor');
  if (tier >= 50) features.push('Exotic matter deposit');
  if (tier >= 60) features.push('Quantum entanglement chamber');
  if (tier >= 70) features.push('Spore drive calibration site');
  if (tier >= 80) features.push('Interdimensional gateway');
  if (tier >= 90) features.push('Cosmic anomaly epicenter');
  if (level >= 500) features.push('Ascended infrastructure');
  
  return features;
}

function generateAnomalies(tier: number): string[] {
  const anomalies: string[] = [];
  
  if (tier >= 5 && Math.random() > 0.5) anomalies.push('Gravitational lensing');
  if (tier >= 15 && Math.random() > 0.6) anomalies.push('Temporal distortion');
  if (tier >= 25 && Math.random() > 0.7) anomalies.push('Energy signature');
  if (tier >= 35 && Math.random() > 0.8) anomalies.push('Dimensional echo');
  if (tier >= 45 && Math.random() > 0.85) anomalies.push('Mycelial bloom');
  
  return anomalies;
}

/**
 * Generate moon status
 */
export function generateMoonStatus(tier: number, level: number): MoonStatus {
  const stability = Math.min(100, 50 + tier * 0.5 + level * 0.1);
  const condition = stability > 90 ? 'stable' : 
                    stability > 75 ? 'tidal-locked' :
                    stability > 60 ? 'dust-storms' :
                    stability > 40 ? 'ice-quakes' :
                    'volcanic-activity';

  return {
    condition,
    stability: Math.floor(stability),
    health: Math.floor(80 + Math.random() * 20),
    isInhabited: level > 10,
    isColonized: level > 5,
    isDeveloped: level > 50,
    isUnderAttack: false,
    isBlockaded: false,
    activeEvents: [],
    alerts: [],
    hasCommunications: level > 20,
    hasTradeRoutes: level > 30,
    hasDefensePact: false,
    supplyLinesStatus: level > 10 ? 'optimal' : 'degraded',
  };
}

/**
 * Calculate moon experience required for next level
 */
export function calculateMoonExperienceRequired(currentLevel: number): number {
  return Math.floor(1000 * Math.pow(1.15, currentLevel - 1));
}

/**
 * Calculate moon rarity based on tier and special properties
 */
export function calculateMoonRarity(
  type: string,
  tier: number,
  specialProperties: string[]
): MoonDetails['rarity'] {
  const typeConfig = ENHANCED_MOON_TYPES[type];
  if (!typeConfig) return 'common';

  let rarityScore = tier;

  // Bonus for special properties
  if (specialProperties.includes('exotic-matter')) rarityScore += 10;
  if (specialProperties.includes('mycelial-bloom')) rarityScore += 15;
  if (specialProperties.includes('dimensional-rifts')) rarityScore += 20;
  if (specialProperties.includes('habitable')) rarityScore += 5;

  if (rarityScore >= 90) return 'ascended';
  if (rarityScore >= 75) return 'mythic';
  if (rarityScore >= 60) return 'legendary';
  if (rarityScore >= 45) return 'epic';
  if (rarityScore >= 30) return 'rare';
  if (rarityScore >= 15) return 'uncommon';
  return 'common';
}