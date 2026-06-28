/**
 * Universe State & Generation System
 * Core universe simulation, procedural generation, and state management
 * @tag #universe #generation #simulation #procedural #state-management
 */

import type { Coordinates } from './interstellarTravelConfig';
import type { CelestialObject, Star, Planet, PlanetType as NavPlanetType, ExplorationSite, NavigationHazard } from './navigationConfig';

// ============================================================================
// UNIVERSE CONFIGURATION
// ============================================================================

export interface UniverseConfig {
  seed: number;                  // For deterministic generation
  size: 'small' | 'medium' | 'large' | 'massive' | 'infinite';
  
  // Dimensions
  galaxies: number;
  sectorsPerGalaxy: number;
  systemsPerSector: number;
  
  // Density
  starDensity: number;           // 0-100%
  planetDensity: number;         // Per system
  asteroidsPerSystem: number;
  hazardDensity: number;         // 0-100%
  
  // Age
  universeAge: number;           // Million years
  
  // Physics
  gravity: number;               // G constant
  ftlSpeedLimit: number;         // Light-years per turn (max)
  wormholeFrequency: number;     // 0-100%
  
  description: string;
}

export const UNIVERSE_PRESETS: Record<string, UniverseConfig> = {
  'starter': {
    seed: 12345,
    size: 'small',
    galaxies: 1,
    sectorsPerGalaxy: 10,
    systemsPerSector: 20,
    starDensity: 15,
    planetDensity: 2,
    asteroidsPerSystem: 3,
    hazardDensity: 5,
    universeAge: 13800,
    gravity: 9.81,
    ftlSpeedLimit: 50,
    wormholeFrequency: 1,
    description: 'Small beginner-friendly universe',
  },
  
  'standard': {
    seed: 54321,
    size: 'medium',
    galaxies: 3,
    sectorsPerGalaxy: 50,
    systemsPerSector: 50,
    starDensity: 25,
    planetDensity: 3,
    asteroidsPerSystem: 5,
    hazardDensity: 15,
    universeAge: 13800,
    gravity: 9.81,
    ftlSpeedLimit: 100,
    wormholeFrequency: 2,
    description: 'Standard three-galaxy universe',
  },
  
  'vast': {
    seed: 99999,
    size: 'massive',
    galaxies: 10,
    sectorsPerGalaxy: 200,
    systemsPerSector: 100,
    starDensity: 40,
    planetDensity: 4,
    asteroidsPerSystem: 8,
    hazardDensity: 25,
    universeAge: 13800,
    gravity: 9.81,
    ftlSpeedLimit: 200,
    wormholeFrequency: 5,
    description: 'Massive eleven-galaxy universe',
  },
};

// ============================================================================
// UNIVERSE STATE
// ============================================================================

export interface UniverseState {
  config: UniverseConfig;
  currentTurn: number;
  
  // Celestial Objects Registry
  stars: Map<string, Star>;
  planets: Map<string, Planet>;
  stations: Map<string, CelestialObject>;
  hazards: Map<string, NavigationHazard>;
  
  // Exploration Data
  discoveredSystems: Set<string>;
  mappedRegions: Map<string, number>;  // Coordinates -> accuracy %
  explorationSites: ExplorationSite[];
  
  // Events
  activeEvents: GameEvent[];
  eventHistory: GameEvent[];
  
  // Factions
  factionPresence: Map<string, FactionPresence>;
  
  // Dynamic Changes
  lastUpdateTurn: number;
  nextProcedureralUpdate: number;
  
  // Metadata
  createdDate: Date;
  modifiedDate: Date;
  version: string;
}

export interface GameEvent {
  id: string;
  type: 'stellar' | 'diplomatic' | 'discovery' | 'disaster' | 'opportunity' | 'military' | 'scientific';
  
  title: string;
  description: string;
  
  // Timing
  startTurn: number;
  endTurn?: number;
  duration: number;
  
  // Impact
  affectedCoordinates?: Coordinates;
  affectedFactions: string[];
  effects: EventEffect[];
  
  // Rewards/Consequences
  rewards: {
    credits?: number;
    influence?: number;
    technology?: string[];
    resources?: { [key: string]: number };
  };
  
  consequences: {
    casualties?: number;
    materielLoss?: number;
    reputationChange?: number;
  };
  
  completed: boolean;
  affectsGameplay: boolean;
}

export interface EventEffect {
  type: 'damage' | 'resource_shortage' | 'opportunity' | 'threat' | 'discovery' | 'status_change';
  magnitude: number;
  duration: number;
  affectsAll: boolean;
  targetFactions?: string[];
}

export interface FactionPresence {
  factionId: string;
  controlledSystems: string[];
  influenceLevel: number;        // 0-100 (how strong is presence)
  militaryStrength: number;
  economicOutput: number;
  allies: string[];
  enemies: string[];
  claims: Coordinates[];
}

// ============================================================================
// PROCEDURAL GENERATION ENGINE
// ============================================================================

export interface GenerationSeed {
  masterSeed: number;
  galaxySeeds: number[];
  sectorSeeds: Map<string, number>;
  systemSeeds: Map<string, number>;
}

export interface ProcGenerationParams {
  seed: number;
  galaxyIndex: number;
  sectorIndex: number;
  systemIndex?: number;
  coordinates: Coordinates;
  
  // Controls
  generateStars: boolean;
  generatePlanets: boolean;
  generateHazards: boolean;
  generateResources: boolean;
}

export interface GeneratedSystem {
  coordinates: Coordinates;
  
  primaryStar: Star;
  secondaryStar?: Star;
  terniaryStar?: Star;
  
  planets: Planet[];
  asteroidBelt?: {
    count: number;
    density: number;
    resources: { [key: string]: number };
  };
  
  hazards: NavigationHazard[];
  anomalies: string[];
  
  civilizedPlanets: number;
  knownLife: boolean;
  scientificInterest: number;    // 0-100
  
  historicalSignificance: string;
}

// ============================================================================
// UNIVERSE GENERATION FUNCTIONS
// ============================================================================

export class UniverseGenerator {
  private config: UniverseConfig;
  private seed: number;
  
  constructor(config: UniverseConfig) {
    this.config = config;
    this.seed = config.seed;
  }
  
  /**
   * Generate entire universe state
   */
  generateUniverse(): UniverseState {
    return {
      config: this.config,
      currentTurn: 1,
      stars: new Map(),
      planets: new Map(),
      stations: new Map(),
      hazards: new Map(),
      discoveredSystems: new Set(),
      mappedRegions: new Map(),
      explorationSites: [],
      activeEvents: [],
      eventHistory: [],
      factionPresence: new Map(),
      lastUpdateTurn: 1,
      nextProcedureralUpdate: 100,
      createdDate: new Date(),
      modifiedDate: new Date(),
      version: '1.0.0',
    };
  }
  
  /**
   * Generate a single solar system
   */
  generateSystem(params: ProcGenerationParams): GeneratedSystem {
    const systemSeed = this.deriveRandomSeed(params.seed, params.systemIndex || 0);
    const rng = this.createSeededRandom(systemSeed);
    
    // Generate primary star
    const starTypes = Object.keys(STAR_TYPE_DISTRIBUTION) as any[];
    const primaryStar = this.generateStar(
      params.coordinates,
      starTypes[Math.floor(rng() * starTypes.length)],
      true
    );
    
    // Generate secondary/tertiary stars
    const secondaryStar = rng() < 0.3 ? this.generateStar(params.coordinates, this.randomStarType(rng), false) : undefined;
    const terniaryStar = rng() < 0.1 ? this.generateStar(params.coordinates, this.randomStarType(rng), false) : undefined;
    
    // Generate planets
    const planets: Planet[] = [];
    if (params.generatePlanets) {
      const planetCount = Math.floor(rng() * (this.config.planetDensity * 4)) + 1;
      for (let i = 0; i < planetCount; i++) {
        planets.push(this.generatePlanet(params.coordinates, primaryStar, i));
      }
    }
    
    // Generate hazards
    const hazards: NavigationHazard[] = [];
    if (params.generateHazards && rng() * 100 < this.config.hazardDensity) {
      hazards.push(this.generateHazard(params.coordinates));
    }
    
    return {
      coordinates: params.coordinates,
      primaryStar,
      secondaryStar,
      terniaryStar,
      planets,
      hazards,
      anomalies: this.generateAnomalies(rng, params.coordinates),
      civilizedPlanets: planets.filter(p => p.currentPopulation > 0).length,
      knownLife: planets.some(p => p.hasLife),
      scientificInterest: Math.floor(rng() * 100),
      historicalSignificance: this.generateHistoricalText(rng),
    };
  }
  
  /**
   * Generate a single star
   */
  private generateStar(coords: Coordinates, starType: string, isPrimary: boolean): Star {
    const characteristics = STAR_TYPE_DISTRIBUTION[starType] || STAR_TYPE_DISTRIBUTION['G'];
    const rng = this.createSeededRandom(this.seed * coords.x * coords.y);
    
    return {
      id: `star-${coords.galaxy}-${coords.sector}-${coords.system}-${isPrimary ? 'primary' : 'secondary'}`,
      name: `Star ${coords.system}${isPrimary ? '' : String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      type: 'star',
      coordinates: coords,
      
      mass: characteristics.mass * (0.8 + rng() * 0.4),
      radius: characteristics.radius * (0.8 + rng() * 0.4),
      temperature: characteristics.temperature * (0.9 + rng() * 0.2),
      composition: ['Hydrogen', 'Helium', ...(rng() > 0.7 ? ['Heavier Elements'] : [])],
      
      isVisible: true,
      isExplored: false,
      hazards: [],
      resourceDeposits: {},
      hasLife: false,
      hasWater: false,
      isHabitable: false,
      
      starClass: starType as any,
      magnitude: rng() * 15 - 5,
      luminosity: characteristics.luminosity * (0.8 + rng() * 0.4),
      age: this.config.universeAge - (rng() * 5000),
      
      habitableZoneStart: Math.sqrt(characteristics.luminosity) * 0.95,
      habitableZoneEnd: Math.sqrt(characteristics.luminosity) * 1.37,
      
      planetsInOrbit: [],
      
      description: `${starType}-class star in system ${coords.system}`,
    };
  }
  
  /**
   * Generate a single planet
   */
  private generatePlanet(coords: Coordinates, parentStar: Star, index: number): Planet {
    const rng = this.createSeededRandom(this.seed * coords.x * coords.y * (index + 1));
    const planetType = this.randomPlanetType(rng);
    const distanceFromStar = (index + 1) * 50 + rng() * 30; // AU-like
    
    return {
      id: `planet-${coords.galaxy}-${coords.sector}-${coords.system}-${index}`,
      name: `${coords.system}-${String.fromCharCode(97 + index)}`,
      type: 'planet',
      coordinates: coords,
      
      mass: rng() * 1000,
      radius: rng() * 10000,
      composition: ['Silicate Rock', 'Iron Core', 'Water', 'Organic Matter'],
      
      orbitParent: parentStar.id,
      orbitDistance: distanceFromStar * 150000000,  // km
      orbitalPeriod: Math.pow(distanceFromStar, 1.5) * 365,
      
      isVisible: true,
      isExplored: false,
      hazards: [],
      resourceDeposits: this.generateResourceDeposits(rng),
      
      planetType,
      atmosphere: this.generateAtmosphere(rng, planetType),
      atmosphereDensity: rng() * 100,
      
      averageTemperature: 273 - 100 + rng() * 200,
      surfaceWater: Math.min(100, rng() * 100),
      hasClouds: rng() > 0.3,
      hasStorms: rng() > 0.5,
      windSpeed: rng() * 200,
      
      habitabilityScore: this.calculateHabitability(rng, planetType),
      populationCapacity: rng() > 0.8 ? Math.floor(rng() * 1000000) : 0,
      currentPopulation: 0,
      
      moons: [],
      inhabitants: [],
      
      hasLife: rng() > 0.7,
      hasWater: rng() > 0.6,
      isHabitable: rng() > 0.8,
      
      description: `${planetType} planet in system ${coords.system}`,
    };
  }
  
  /**
   * Generate a navigation hazard
   */
  private generateHazard(coords: Coordinates): NavigationHazard {
    const hazardTypes: any[] = ['radiation', 'asteroid_field', 'cosmic_storm', 'ion_storm'];
    const hazardType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
    
    return {
      id: `hazard-${coords.galaxy}-${coords.sector}-${coords.system}-${Date.now()}`,
      type: hazardType,
      location: coords,
      radius: Math.random() * 5000 + 1000,
      severity: Math.random() * 100,
      dangerLevel: 'moderate',
      shieldDamagePerTurn: Math.random() * 10,
      hullDamagePerTurn: Math.random() * 5,
      navigationDifficulty: Math.random() * 50,
      sensorBlockage: Math.random() * 60,
      isTemporary: Math.random() > 0.7,
      minimumNavigationSkill: Math.random() * 50,
      minimumShieldStrength: Math.random() * 1000,
      minimumHullPlating: Math.random() * 500,
      description: `A ${hazardType} hazard in the system`,
    };
  }
  
  /**
   * Helper methods
   */
  
  private deriveRandomSeed(baseSeed: number, index: number): number {
    return (baseSeed * 73856093 ^ index * 19349663) >>> 0;
  }
  
  private createSeededRandom(seed: number) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  
  private randomStarType(rng: any): string {
    const types = Object.keys(STAR_TYPE_DISTRIBUTION);
    return types[Math.floor(rng() * types.length)];
  }
  
  private randomPlanetType(rng: any): NavPlanetType {
    const types: NavPlanetType[] = ['terrestrial', 'super_earth', 'gas_giant', 'ice_giant', 'desert'];
    return types[Math.floor(rng() * types.length)];
  }
  
  private generateAtmosphere(rng: any, planetType: string): string[] {
    if (planetType === 'gas_giant') return ['Hydrogen', 'Helium'];
    if (planetType === 'ice_giant') return ['Methane', 'Ammonia', 'Water Vapor'];
    if (rng() > 0.5) return ['Nitrogen', 'Oxygen'];
    return ['Carbon Dioxide', 'Nitrogen'];
  }
  
  private generateResourceDeposits(rng: any): { [key: string]: number } {
    return {
      iron_ore: Math.floor(rng() * 10000),
      copper: Math.floor(rng() * 5000),
      deuterium: Math.floor(rng() * 3000),
      rare_earths: Math.floor(rng() * 1000),
    };
  }
  
  private calculateHabitability(rng: any, planetType: string): number {
    const baseScore = rng() * 100;
    if (planetType === 'terrestrial_paradise') return Math.min(100, baseScore * 1.5);
    if (planetType === 'ocean') return Math.min(100, baseScore * 1.3);
    if (planetType === 'desert') return Math.min(100, baseScore * 0.6);
    return baseScore;
  }
  
  private generateAnomalies(rng: any, coords: Coordinates): string[] {
    if (rng() > 0.85) {
      return ['Temporal anomaly', 'Dimensional rift', 'Exotic energy signature'];
    }
    return [];
  }
  
  private generateHistoricalText(rng: any): string {
    const events = [
      'Site of ancient battle',
      'Former colony location',
      'Scientific research station',
      'Trading hub',
      'Frontier outpost',
    ];
    return events[Math.floor(rng() * events.length)];
  }
}

// ============================================================================
// STAR CLASSIFICATION DATA
// ============================================================================

export const STAR_TYPE_DISTRIBUTION:Record<string, any> = {
  'O': { frequency: 0.0003, mass: 60, radius: 15, temperature: 30000, luminosity: 1000000 },
  'B': { frequency: 0.13, mass: 18, radius: 7, temperature: 10000, luminosity: 20000 },
  'A': { frequency: 0.6, mass: 3.2, radius: 2.1, temperature: 7500, luminosity: 54 },
  'F': { frequency: 3, mass: 1.6, radius: 1.5, temperature: 6000, luminosity: 6.4 },
  'G': { frequency: 7.6, mass: 1.0, radius: 1.0, temperature: 5500, luminosity: 1 },
  'K': { frequency: 12.1, mass: 0.78, radius: 0.86, temperature: 3700, luminosity: 0.27 },
  'M': { frequency: 76.45, mass: 0.51, radius: 0.6, temperature: 2400, luminosity: 0.0055 },
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function createUniverseState(presetName: string = 'standard'): UniverseState {
  const config = UNIVERSE_PRESETS[presetName] || UNIVERSE_PRESETS['standard'];
  const generator = new UniverseGenerator(config);
  return generator.generateUniverse();
}

export function getTotalSystems(config: UniverseConfig): number {
  return config.galaxies * config.sectorsPerGalaxy * config.systemsPerSector;
}

export function estimateUniverseSize(universeState: UniverseState): string {
  const total = getTotalSystems(universeState.config);
  const discovered = universeState.discoveredSystems.size;
  const percentage = ((discovered / total) * 100).toFixed(2);
  
  return `${discovered}/${total} systems discovered (${percentage}%)`;
}
