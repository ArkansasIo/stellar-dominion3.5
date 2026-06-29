/**
 * Navigation & Exploration System
 * Stellar navigation, charting, hazards, and discovery mechanics
 * @tag #navigation #exploration #charting #hazards #discoveries
 */

import type { Coordinates } from './interstellarTravelConfig';

// ============================================================================
// CELESTIAL OBJECT TYPES
// ============================================================================

export type CelestialObjectType = 'star' | 'planet' | 'moon' | 'asteroid' | 'nebula' | 'blackhole' | 'station' | 'debris' | 'anomaly';

export interface CelestialObject {
  id: string;
  name: string;
  type: CelestialObjectType;
  coordinates: Coordinates;
  
  // Physical Properties
  mass: number;                  // Solar masses
  radius: number;                // km
  temperature?: number;          // Kelvin
  composition: string[];
  
  // Orbital Properties
  orbitParent?: string;           // Parent object ID
  orbitDistance?: number;         // km
  orbitalPeriod?: number;         // Earth days
  
  // Status
  isVisible: boolean;
  isExplored: boolean;
  discoveredBy?: string;          // Player ID
  discoveredDate?: Date;
  exploredDate?: Date;
  
  // Resources
  resourceDeposits?: {
    [key: string]: number;       // Resource type and quantity
  };
  
  // Special Properties
  hasLife: boolean;
  hasWater: boolean;
  isHabitable: boolean;
  
  // Hazards
  hazards: NavigationHazard[];
  
  description: string;
}

// ============================================================================
// STELLAR CLASSES
// ============================================================================

export type StarClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'L' | 'T' | 'Y' | 'neutron' | 'black_hole' | 'white_dwarf' | 'red_giant';

export interface Star extends CelestialObject {
  starClass: StarClass;
  magnitude: number;             // Apparent brightness
  luminosity: number;            // Solar luminosities
  age: number;                   // Million years
  
  habitableZoneStart: number;    // km
  habitableZoneEnd: number;
  
  planetsInOrbit: string[];      // Planet IDs
}

export const STAR_CLASSES = {
  'O': { color: '#3c6ff9', temp: 30000, mass: 60, rarity: 'legendary' },
  'B': { color: '#4d7fff', temp: 10000, mass: 18, rarity: 'rare' },
  'A': { color: '#ffffff', temp: 7500, mass: 3.2, rarity: 'uncommon' },
  'F': { color: '#ffffd4', temp: 6000, mass: 1.6, rarity: 'uncommon' },
  'G': { color: '#ffffcc', temp: 5500, mass: 1.0, rarity: 'common' },  // Like our Sun
  'K': { color: '#ffcc99', temp: 3700, mass: 0.78, rarity: 'common' },
  'M': { color: '#ff6633', temp: 2400, mass: 0.51, rarity: 'common' },
  'L': { color: '#ff4444', temp: 1800, mass: 0.07, rarity: 'common' },
  'T': { color: '#660033', temp: 700, mass: 0.06, rarity: 'uncommon' },
  'Y': { color: '#000000', temp: 300, mass: 0.02, rarity: 'rare' },
} as const;

// ============================================================================
// PLANETARY TYPES
// ============================================================================

export type PlanetType = 'terrestrial' | 'super_earth' | 'mini_neptune' | 'gas_giant' | 'ice_giant' | 'lava' | 'desert' | 'ocean' | 'terrestrial_paradise' | 'dead' | 'tidal_locked';

export interface Planet extends CelestialObject {
  planetType: PlanetType;
  atmosphere: string[];          // Composition
  atmosphereDensity: number;     // 0-100 (percentage of Earth)
    
  // Climate
  averageTemperature: number;    // Celsius
  surfaceWater: number;          // % coverage
  hasClouds: boolean;
  hasStorms: boolean;
  windSpeed: number;             // km/h
  
  // Habitation
  habitabilityScore: number;     // 0-100
  populationCapacity: number;
  currentPopulation: number;
  
  // Moons
  moons: string[];               // Moon object IDs
  
  // History
  inhabitants?: {
    civilization: string;
    population: number;
    since: Date;
  }[];
}

export const PLANET_CHARACTERISTICS: Record<PlanetType, any> = {
  'terrestrial': {
    size: 'Small to Medium',
    gravity: 0.5,
    habitability: 'Low to Moderate',
    resources: 'Moderate',
    rarity: 'common',
  },
  'super_earth': {
    size: 'Large',
    gravity: 2.0,
    habitability: 'High',
    resources: 'High',
    rarity: 'uncommon',
  },
  'mini_neptune': {
    size: 'Medium',
    gravity: 1.5,
    habitability: 'Very Low',
    resources: 'Moderate (exotic gases)',
    rarity: 'uncommon',
  },
  'gas_giant': {
    size: 'Very Large',
    gravity: 2.5,
    habitability: 'None (floating cities possible)',
    resources: 'Very High (exotic gases)',
    rarity: 'common',
  },
  'ice_giant': {
    size: 'Large',
    gravity: 2.0,
    habitability: 'Very Low',
    resources: 'Very High (rare ices)',
    rarity: 'uncommon',
  },
  'lava': {
    size: 'Small to Medium',
    gravity: 1.0,
    habitability: 'None',
    resources: 'Very High (volcanic)',
    rarity: 'rare',
  },
  'desert': {
    size: 'Small to Medium',
    gravity: 0.8,
    habitability: 'Low',
    resources: 'Moderate',
    rarity: 'common',
  },
  'ocean': {
    size: 'Medium to Large',
    gravity: 1.2,
    habitability: 'Very High (with adaptation)',
    resources: 'High (aquatic life)',
    rarity: 'rare',
  },
  'terrestrial_paradise': {
    size: 'Medium',
    gravity: 1.0,
    habitability: 'Extreme (Earth-like)',
    resources: 'High (diverse)',
    rarity: 'legendary',
  },
  'dead': {
    size: 'Varies',
    gravity: 'Varies',
    habitability: 'None',
    resources: 'Moderate to High (geological)',
    rarity: 'common',
  },
  'tidal_locked': {
    size: 'Medium',
    gravity: 1.0,
    habitability: 'Low',
    resources: 'Moderate',
    rarity: 'uncommon',
  },
};

// ============================================================================
// NAVIGATION HAZARDS
// ============================================================================

export type HazardType = 'radiation' | 'solar_flare' | 'asteroid_field' | 'cosmic_storm' | 'dimensional_anomaly' | 'pirate_activity' | 'sensor_deadzone' | 'space_debris' | 'starfield_effect' | 'temporal_distortion' | 'gravity_well' | 'ion_storm';

export interface NavigationHazard {
  id: string;
  type: HazardType;
  
  // Location
  location: Coordinates;
  radius: number;                // Detection radius in km
  
  // Severity
  severity: number;              // 0-100
  dangerLevel: 'minor' | 'moderate' | 'significant' | 'critical' | 'catastrophic';
  
  // Effects
  shieldDamagePerTurn: number;
  hullDamagePerTurn: number;
  navigationDifficulty: number;  // 0-100 (increase to)
  sensorBlockage: number;        // 0-100 (% blocked)
  
  // Duration
  isTemporary: boolean;
  expiresDate?: Date;
  cycleDuration?: number;        // Turns (for recurring)
  
  // Navigation Requirements
  minimumNavigationSkill: number;
  minimumShieldStrength: number;
  minimumHullPlating: number;
  
  description: string;
  avoidanceStrategy?: string;
}

export const HAZARD_TYPES_DATA: Record<HazardType, any> = {
  'radiation': {
    baseDamage: 2,
    shieldDrain: 5,
    difficulty: 20,
    avoidable: true,
  },
  'solar_flare': {
    baseDamage: 10,
    shieldDrain: 15,
    difficulty: 40,
    avoidable: false,  // Temporary event
  },
  'asteroid_field': {
    baseDamage: 5,
    shieldDrain: 0,
    difficulty: 30,
    avoidable: true,
  },
  'cosmic_storm': {
    baseDamage: 15,
    shieldDrain: 20,
    difficulty: 60,
    avoidable: false,
  },
  'dimensional_anomaly': {
    baseDamage: 20,
    shieldDrain: 25,
    difficulty: 80,
    avoidable: false,
  },
  'pirate_activity': {
    baseDamage: 0,
    shieldDrain: 0,
    difficulty: 10,
    avoidable: true,
  },
  'sensor_deadzone': {
    baseDamage: 0,
    shieldDrain: 0,
    difficulty: 50,
    avoidable: true,
  },
  'space_debris': {
    baseDamage: 3,
    shieldDrain: 0,
    difficulty: 25,
    avoidable: true,
  },
  'starfield_effect': {
    baseDamage: 50,
    shieldDrain: 50,
    difficulty: 100,
    avoidable: false,
  },
  'temporal_distortion': {
    baseDamage: 25,
    shieldDrain: 30,
    difficulty: 90,
    avoidable: false,
  },
  'gravity_well': {
    baseDamage: 10,
    shieldDrain: 10,
    difficulty: 35,
    avoidable: true,
  },
  'ion_storm': {
    baseDamage: 12,
    shieldDrain: 18,
    difficulty: 45,
    avoidable: false,
  },
};

// ============================================================================
// EXPLORATION & DISCOVERY
// ============================================================================

export interface ExplorationSite {
  id: string;
  name: string;
  type: 'ruin' | 'crashed_ship' | 'artifact_cache' | 'ancient_structure' | 'data_archive' | 'mining_site' | 'scientific_anomaly';
  location: Coordinates;
  
  // Discovery
  isDiscovered: boolean;
  discoveredBy?: string;
  discoveredDate?: Date;
  
  // Exploration
  explored: number;              // % completion
  expeditionsSent: number;
  totalInvestmentHours: number;
  
  // Rewards
  expectedRewards: {
    credits: number;
    technology: string[];
    resources: { [key: string]: number };
    artifacts: string[];
  };
  
  // Hazards
  hazards: NavigationHazard[];
  guardianCreatures?: string[];
  hostileFactions?: string[];
  
  // Description
  description: string;
  historicalContext?: string;
  scientificValue: number;       // 0-100
}

export interface ChartData {
  id: string;
  name: string;
  
  // Coverage
  galaxyChart: number;           // % of galaxy explored
  sectorChart: number[];         // % per sector
  
  // Discoveries
  knownSystems: Coordinates[];
  knownHazards: NavigationHazard[];
  knownWormholes: Coordinates[];
  
  // Quality
  accuracy: number;              // 0-100%
  updateDate: Date;
  updatedBy?: string;
  
  // Restrictions
  isClassified: boolean;
  securityLevel: number;
  allowedUsers: string[];
}

// ============================================================================
// SENSOR & DETECTION SYSTEMS
// ============================================================================

export interface SensorArray {
  id: string;
  name: string;
  
  // Range
  scanRange: number;             // km
  detailedScanRange: number;     // km
  
  // Capabilities
  canDetectLife: boolean;
  canDetectWormholes: boolean;
  canDetectCloakedShips: boolean;
  canAnalyzeTechLevel: boolean;
  
  // Performance
  accuracy: number;              // 0-100%
  scanSpeed: number;             // Turns to scan at range
  powerConsumption: number;
  
  // Special
  canMapAnomalies: boolean;
  hasLongRangeScan: boolean;
  hasDeepSpaceScan: boolean;
  
  description: string;
}

export const SENSOR_ARRAYS: SensorArray[] = [
  {
    id: 'sensor-basic',
    name: 'Basic Sensors',
    scanRange: 1000,
    detailedScanRange: 500,
    canDetectLife: false,
    canDetectWormholes: false,
    canDetectCloakedShips: false,
    canAnalyzeTechLevel: false,
    accuracy: 60,
    scanSpeed: 2,
    powerConsumption: 10,
    canMapAnomalies: false,
    hasLongRangeScan: false,
    hasDeepSpaceScan: false,
    description: 'Basic sensor suite for civilian vessels',
  },
  {
    id: 'sensor-advanced',
    name: 'Advanced Sensors',
    scanRange: 5000,
    detailedScanRange: 2000,
    canDetectLife: true,
    canDetectWormholes: false,
    canDetectCloakedShips: false,
    canAnalyzeTechLevel: true,
    accuracy: 85,
    scanSpeed: 1,
    powerConsumption: 30,
    canMapAnomalies: true,
    hasLongRangeScan: true,
    hasDeepSpaceScan: false,
    description: 'Advanced sensor array for explorers and scouts',
  },
  {
    id: 'sensor-military',
    name: 'Military Detection Grid',
    scanRange: 10000,
    detailedScanRange: 5000,
    canDetectLife: true,
    canDetectWormholes: true,
    canDetectCloakedShips: true,
    canAnalyzeTechLevel: true,
    accuracy: 95,
    scanSpeed: 0.5,
    powerConsumption: 100,
    canMapAnomalies: true,
    hasLongRangeScan: true,
    hasDeepSpaceScan: true,
    description: 'Military-grade sensor array with advanced detection capabilities',
  },
];

// ============================================================================
// NAVIGATION SKILLS & PROFICIENCY
// ============================================================================

export interface NavigationSkill {
  piloting: number;              // 0-100 (basic ship handling)
  astrogation: number;           // Navigation and charting
  exploration: number;           // Discovery and mapping
  anomalyDetection: number;      // Spotting hazards
  evasion: number;               // Dodging obstacles
  ftlJumpAccuracy: number;       // Precise FTL jumps
  diplomacy: number;             // Peaceful first contact
  tactical: number;              // Combat navigation
}

export interface Navigator {
  id: string;
  name: string;
  faction: string;
  skills: NavigationSkill;
  
  // Experience
  jumpsMade: number;
  milesExplored: number;
  discoveriesFound: number;
  
  // Reputation
  reputation: number;            // 0-100
  discoveryBonus: number;        // % modifier
  
  // Specialties
  specialties: string[];
  favoriteExplorationZones: Coordinates[];
}

// ============================================================================
// EXPORT FUNCTIONS & UTILITIES
// ============================================================================

export function calculateNavigationDifficulty(
  hazards: NavigationHazard[],
  distance: number,
  pilotSkill: number
): number {
  let difficulty = 10; // Base difficulty
  
  // Add hazard-based difficulty
  hazards.forEach(h => {
    difficulty += h.navigationDifficulty * (h.severity / 100);
  });
  
  // Distance factor
  difficulty += Math.min(20, distance / 1000);
  
  // Reduce by pilot skill
  difficulty -= pilotSkill / 5;
  
  return Math.max(0, difficulty);
}

export function calculateExplorationReward(site: ExplorationSite, exhaustion: number): number {
  const baseReward = site.expectedRewards.credits;
  const explorationBonus = (site.explored / 100) * baseReward;
  const difficultyBonus = (Math.max(...site.hazards.map(h => h.severity)) / 100) * baseReward;
  
  return Math.floor(baseReward + explorationBonus + difficultyBonus - (exhaustion * baseReward / 100));
}

export function getSensorRange(array: SensorArray, powerLevel: number): number {
  // Power level 0-100, affects range
  return array.scanRange * (1 + (powerLevel - 50) / 100);
}

export function canNavigateHazard(
  pilotSkill: number,
  hazard: NavigationHazard,
  shipShielding: number,
  shipArmor: number
): boolean {
  // Check all constraints
  if (pilotSkill < hazard.minimumNavigationSkill) return false;
  if (shipShielding < hazard.minimumShieldStrength) return false;
  if (shipArmor < hazard.minimumHullPlating) return false;
  
  return true;
}

export function estimateExplorationTime(site: ExplorationSite, teamSkill: number): number {
  const baseTime = 100;
  const completenessMultiplier = (100 - site.explored) / 100;
  const hazardPenalty = Math.max(...site.hazards.map(h => h.severity)) / 10;
  const skillBonus = teamSkill / 100;
  
  return Math.ceil((baseTime * completenessMultiplier + hazardPenalty) / (1 + skillBonus));
}

export function selectOptimalRoute(
  hazards: NavigationHazard[],
  pilotSkill: number,
  shipSpec: { armor: number; shields: number }
): NavigationHazard[] {
  // Filter to navigable hazards and sort by danger
  return hazards
    .filter(h => canNavigateHazard(pilotSkill, h, shipSpec.shields, shipSpec.armor))
    .sort((a, b) => a.severity - b.severity);
}
