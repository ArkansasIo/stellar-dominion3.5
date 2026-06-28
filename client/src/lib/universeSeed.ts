import { UNIVERSE_CONFIG, StarType, PlanetType, GalaxyType } from '@shared/config/universeConfig';
import { 
  SOL_SYSTEM, 
  NEARBY_GALAXIES, 
  CelestialBody, 
  CelestialCoordinates,
  formatCoordinates,
  parseCoordinates,
  getSolSystemPlanets,
  getSolSystemMoons,
  getSolSystemDwarfPlanets,
  getCelestialBodyById,
  getMoonsOfPlanet,
  getBodyByCoordinates
} from './solSystemData';

export type PlanetClass = "M" | "G" | "D" | "R" | "V" | "T" | "A" | "K" | "J" | "I";
export type AsteroidType = "C" | "S" | "M" | "F" | "X" | "B" | "Rare";
export type ObjectType = "planet" | "moon" | "asteroid" | "meteor" | "star" | "nebula" | "blackhole" | "wormhole" | "station" | "debris" | "dwarf_planet" | "comet";
export type Habitability = "hostile" | "barren" | "marginal" | "adequate" | "ideal";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CelestialObject {
  id: string;
  name: string;
  type: ObjectType;
  coordinates: string;
  position: Vector3;
  
  planetClass?: PlanetClass;
  diameter?: number;
  gravity?: number;
  habitability?: Habitability;
  atmosphere?: string;
  temperature?: number;
  waterPercentage?: number;
  mineralAbundance?: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  
  parentPlanetId?: string;
  orbitalPeriod?: number;
  
  asteroidType?: AsteroidType;
  size?: number;
  compositionMetal?: number;
  compositionRare?: number;
  
  starType?: "O" | "B" | "A" | "F" | "G" | "K" | "M" | "Neutron" | "White Dwarf";
  luminosity?: number;
  surfaceTemp?: number;
  
  density?: number;
  magneticField?: number;
  age?: number;
  resources?: number;
  
  hasRings?: boolean;
  atmosphereComposition?: string[];
  description?: string;
}

export class SeededRandom {
  private seed: number;
  
  constructor(seed: string | number) {
    if (typeof seed === 'string') {
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
  
  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
  
  pick<T>(array: readonly T[] | T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
  
  shuffle<T>(array: readonly T[] | T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  fork(suffix: string | number): SeededRandom {
    return new SeededRandom(`${this.seed}_${suffix}`);
  }
}

function seededRandom(seed: string, index: number = 0): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char + index;
    hash = hash & hash;
  }
  return Math.abs(hash % 10000) / 10000;
}

function seededRandomRange(seed: string, min: number, max: number, index: number = 0): number {
  return min + seededRandom(seed, index) * (max - min);
}

function seededRandomInt(seed: string, min: number, max: number, index: number = 0): number {
  return Math.floor(seededRandomRange(seed, min, max, index));
}

function parseCoordinatesLegacy(coordStr: string): Vector3 {
  const match = coordStr.match(/\[(\d+):(\d+):(\d+)\]/);
  if (match) {
    return {
      x: parseInt(match[1]),
      y: parseInt(match[2]),
      z: parseInt(match[3])
    };
  }
  return { x: 0, y: 0, z: 0 };
}

function createSeedString(coords: Vector3, suffix: string = "", masterSeed: string = UNIVERSE_CONFIG.seed.default): string {
  return `${masterSeed}:${coords.x}:${coords.y}:${coords.z}${suffix}`;
}

const PLANET_CLASSES: PlanetClass[] = ["M", "G", "D", "R", "V", "T", "A", "K"];
const STAR_TYPES = ["O", "B", "A", "F", "G", "K", "M", "Neutron", "White Dwarf"] as const;
const ASTEROID_TYPES: AsteroidType[] = ["C", "S", "M", "F", "X", "B", "Rare"];
const PLANET_NAMES = ["Prime", "Secundus", "Tertius", "Quartus", "Quintus", "Sextus", "Septimus"];
const MOON_NAMES = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta"];

export interface UniverseSeedConfig {
  masterSeed: string;
  galaxyCount: number;
  sectorsPerGalaxy: number;
  systemsPerSector: number;
  minPlanetsPerSystem: number;
  maxPlanetsPerSystem: number;
}

export const DEFAULT_UNIVERSE_SEED: UniverseSeedConfig = {
  masterSeed: UNIVERSE_CONFIG.seed.default,
  galaxyCount: UNIVERSE_CONFIG.size.galaxyCount,
  sectorsPerGalaxy: UNIVERSE_CONFIG.size.sectorsPerGalaxy,
  systemsPerSector: UNIVERSE_CONFIG.size.systemsPerSector,
  minPlanetsPerSystem: UNIVERSE_CONFIG.size.minPlanetsPerSystem,
  maxPlanetsPerSystem: UNIVERSE_CONFIG.size.maxPlanetsPerSystem,
};

export {
  SOL_SYSTEM,
  NEARBY_GALAXIES,
  formatCoordinates,
  parseCoordinates,
  getSolSystemPlanets,
  getSolSystemMoons,
  getSolSystemDwarfPlanets,
  getCelestialBodyById,
  getMoonsOfPlanet,
  getBodyByCoordinates,
};

export type { CelestialBody, CelestialCoordinates };

export function generatePlanet(
  systemCoords: Vector3,
  planetIndex: number,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject {
  const seed = createSeedString(systemCoords, `:planet:${planetIndex}`, masterSeed);
  const planetClass = PLANET_CLASSES[seededRandomInt(seed, 0, PLANET_CLASSES.length, 1)];
  
  const habitabilityRoll = seededRandom(seed, 2);
  let habitability: Habitability = "hostile";
  if (habitabilityRoll > 0.7) habitability = "ideal";
  else if (habitabilityRoll > 0.55) habitability = "adequate";
  else if (habitabilityRoll > 0.4) habitability = "marginal";
  else if (habitabilityRoll > 0.2) habitability = "barren";
  
  const temperature = seededRandomInt(seed, -150, 350, 3);
  const waterPercentage = seededRandom(seed, 4) * 100;
  
  const baseMetalDensity = planetClass === "K" ? 0.8 : planetClass === "D" ? 0.9 : 0.5;
  const baseCrystalDensity = planetClass === "G" ? 0.7 : planetClass === "R" ? 0.8 : 0.4;
  const baseDeuteriumDensity = planetClass === "A" ? 0.9 : planetClass === "I" ? 0.8 : 0.3;
  
  return {
    id: `planet-${seed}`,
    name: `${PLANET_NAMES[planetIndex % PLANET_NAMES.length]} ${planetIndex}`,
    type: "planet",
    coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:${planetIndex}]`,
    position: {
      x: systemCoords.x + seededRandomRange(seed, -0.5, 0.5, 5),
      y: systemCoords.y + seededRandomRange(seed, -0.5, 0.5, 6),
      z: systemCoords.z + seededRandomRange(seed, -0.2, 0.2, 7)
    },
    planetClass,
    diameter: seededRandomInt(seed, 4000, 15000, 8),
    gravity: seededRandomRange(seed, 0.3, 3.0, 9),
    habitability,
    atmosphere: habitability !== "hostile" ? ["N2-O2", "CO2-N2", "Exotic"][seededRandomInt(seed, 0, 3, 10)] : "None",
    temperature,
    waterPercentage,
    mineralAbundance: {
      metal: Math.round(baseMetalDensity * 1000 + seededRandom(seed, 11) * 500),
      crystal: Math.round(baseCrystalDensity * 800 + seededRandom(seed, 12) * 400),
      deuterium: Math.round(baseDeuteriumDensity * 600 + seededRandom(seed, 13) * 300)
    },
    age: seededRandomInt(seed, 100, 5000, 14),
    magneticField: seededRandomRange(seed, 0, 100, 15),
    density: seededRandomRange(seed, 1, 10, 16),
    resources: seededRandomInt(seed, 1000, 100000, 17)
  };
}

export function generateMoons(
  systemCoords: Vector3,
  planetIndex: number,
  moonCount: number,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject[] {
  const moons: CelestialObject[] = [];
  for (let i = 0; i < moonCount; i++) {
    const seed = createSeedString(systemCoords, `:moon:${planetIndex}:${i}`, masterSeed);
    moons.push({
      id: `moon-${seed}`,
      name: `${MOON_NAMES[i % MOON_NAMES.length]}`,
      type: "moon",
      coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:${planetIndex}:${i}]`,
      position: {
        x: systemCoords.x + seededRandomRange(seed, -0.3, 0.3, 1),
        y: systemCoords.y + seededRandomRange(seed, -0.3, 0.3, 2),
        z: systemCoords.z + seededRandomRange(seed, -0.1, 0.1, 3)
      },
      parentPlanetId: `planet-${createSeedString(systemCoords, `:planet:${planetIndex}`, masterSeed)}`,
      diameter: seededRandomInt(seed, 500, 5000, 4),
      gravity: seededRandomRange(seed, 0.1, 1.5, 5),
      habitability: "barren",
      temperature: seededRandomInt(seed, -200, 150, 6),
      mineralAbundance: {
        metal: seededRandomInt(seed, 100, 10000, 7),
        crystal: seededRandomInt(seed, 50, 5000, 8),
        deuterium: seededRandomInt(seed, 20, 2000, 9)
      },
      orbitalPeriod: seededRandomRange(seed, 0.1, 50, 10),
      age: seededRandomInt(seed, 100, 5000, 11),
      magneticField: seededRandomRange(seed, 0, 30, 12)
    });
  }
  return moons;
}

export function generateAsteroids(
  systemCoords: Vector3,
  asteroidCount: number,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject[] {
  const asteroids: CelestialObject[] = [];
  for (let i = 0; i < asteroidCount; i++) {
    const seed = createSeedString(systemCoords, `:asteroid:${i}`, masterSeed);
    const asteroidType = ASTEROID_TYPES[seededRandomInt(seed, 0, ASTEROID_TYPES.length, 1)];
    
    const compositionMetal = asteroidType === "M" ? 0.9 : asteroidType === "F" ? 0.7 : 0.4;
    const compositionRare = asteroidType === "Rare" ? 0.95 : asteroidType === "X" ? 0.6 : 0.1;
    
    asteroids.push({
      id: `asteroid-${seed}`,
      name: `Asteroid ${i + 1}`,
      type: "asteroid",
      coordinates: `[${systemCoords.x}:${systemCoords.y}:${systemCoords.z}:A${i}]`,
      position: {
        x: systemCoords.x + seededRandomRange(seed, -5, 5, 2),
        y: systemCoords.y + seededRandomRange(seed, -5, 5, 3),
        z: systemCoords.z + seededRandomRange(seed, -3, 3, 4)
      },
      asteroidType,
      size: seededRandomInt(seed, 10, 5000, 5),
      diameter: seededRandomInt(seed, 100, 3000, 6),
      compositionMetal: compositionMetal,
      compositionRare: compositionRare,
      mineralAbundance: {
        metal: Math.round(compositionMetal * seededRandomInt(seed, 5000, 50000, 7)),
        crystal: seededRandomInt(seed, 500, 15000, 8),
        deuterium: seededRandomInt(seed, 200, 5000, 9)
      },
      age: seededRandomInt(seed, 1000, 4600, 10),
      resources: seededRandomInt(seed, 5000, 100000, 11)
    });
  }
  return asteroids;
}

export function generateStar(
  galaxyCoords: Vector3,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject {
  const seed = createSeedString(galaxyCoords, ":star", masterSeed);
  const starType = STAR_TYPES[seededRandomInt(seed, 0, STAR_TYPES.length, 1)];
  
  const luminosityByType: Record<string, [number, number]> = {
    O: [50000, 100000],
    B: [10000, 50000],
    A: [5000, 10000],
    F: [2000, 5000],
    G: [500, 2000],
    K: [100, 500],
    M: [10, 100],
    Neutron: [0.1, 1],
    "White Dwarf": [100, 1000]
  };
  
  const [minLum, maxLum] = luminosityByType[starType] || [100, 1000];
  
  return {
    id: `star-${seed}`,
    name: `Star System`,
    type: "star",
    coordinates: `[${galaxyCoords.x}:${galaxyCoords.y}:${galaxyCoords.z}]`,
    position: {
      x: galaxyCoords.x,
      y: galaxyCoords.y,
      z: galaxyCoords.z
    },
    starType: starType as "O" | "B" | "A" | "F" | "G" | "K" | "M" | "Neutron" | "White Dwarf",
    luminosity: seededRandomRange(seed, minLum, maxLum, 2),
    surfaceTemp: seededRandomInt(seed, 3000, 30000, 3),
    diameter: seededRandomInt(seed, 500000, 2000000, 4),
    age: seededRandomInt(seed, 100, 13000, 5)
  };
}

export function generateSystem(
  systemCoords: Vector3,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject[] {
  const objects: CelestialObject[] = [];
  
  objects.push(generateStar(systemCoords, masterSeed));
  
  const planetCount = seededRandomInt(createSeedString(systemCoords, ":planet:count", masterSeed), 3, 12, 0);
  for (let i = 0; i < planetCount; i++) {
    const planet = generatePlanet(systemCoords, i, masterSeed);
    objects.push(planet);
    
    const moonRoll = seededRandom(createSeedString(systemCoords, `:planet:${i}:moons`, masterSeed), 0);
    const moonCount = moonRoll > 0.7 ? seededRandomInt(createSeedString(systemCoords, `:planet:${i}:mooncount`, masterSeed), 1, 8, 0) : 0;
    const moons = generateMoons(systemCoords, i, moonCount, masterSeed);
    objects.push(...moons);
  }
  
  const asteroidCount = seededRandomInt(createSeedString(systemCoords, ":asteroid:count", masterSeed), 10, 50, 0);
  const asteroids = generateAsteroids(systemCoords, asteroidCount, masterSeed);
  objects.push(...asteroids);
  
  return objects;
}

export function generateGalaxy(
  galaxyX: number,
  galaxyY: number,
  galaxyZ: number,
  masterSeed: string = UNIVERSE_CONFIG.seed.default,
): CelestialObject[] {
  const galaxyCoords: Vector3 = { x: galaxyX, y: galaxyY, z: galaxyZ };
  const objects: CelestialObject[] = [];
  
  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let sz = 0; sz < 2; sz++) {
        const sectorCoords: Vector3 = {
          x: galaxyX * 100 + sx * 30,
          y: galaxyY * 100 + sy * 30,
          z: galaxyZ * 100 + sz * 30
        };
        
          const systemCount = seededRandomInt(createSeedString(sectorCoords, ":system:count", masterSeed), 2, 5, 0);
        for (let i = 0; i < systemCount; i++) {
          const systemCoords: Vector3 = {
            x: sectorCoords.x + i * 10 + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:offset`, masterSeed), -3, 3, 0),
            y: sectorCoords.y + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:y`, masterSeed), -5, 5, 0),
            z: sectorCoords.z + seededRandomInt(createSeedString(sectorCoords, `:system:${i}:z`, masterSeed), -2, 2, 0)
          };
          
          const system = generateSystem(systemCoords, masterSeed);
          objects.push(...system);
        }
      }
    }
  }
  
  return objects;
}

export function getCelestialObjectByCoordinates(coordinates: string): CelestialObject | null {
  const coords = parseCoordinatesLegacy(coordinates);
  
  const parts = coordinates.match(/\d+/g) || [];
  
  if (parts.length === 3) {
    return generateStar({ x: parseInt(parts[0]), y: parseInt(parts[1]), z: parseInt(parts[2]) });
  } else if (parts.length === 4) {
    const system = generateSystem(coords);
    return system[0];
  }
  
  return null;
}

export function getSolSystemAsCelestialObjects(): CelestialObject[] {
  return SOL_SYSTEM.bodies.map(body => ({
    id: body.id,
    name: body.name,
    type: body.type as ObjectType,
    coordinates: body.coordinateString,
    position: {
      x: body.coordinates.orbit,
      y: body.coordinates.index,
      z: 0
    },
    diameter: body.properties.radius ? body.properties.radius * 2 : undefined,
    gravity: body.properties.surfaceGravity,
    temperature: body.properties.meanTemperature,
    habitability: body.properties.habitable ? 'ideal' : 'hostile' as Habitability,
    atmosphereComposition: body.properties.atmosphere,
    hasRings: body.properties.rings,
    description: body.properties.description,
    orbitalPeriod: body.properties.orbitalPeriod,
    parentPlanetId: body.parentId || undefined,
  }));
}

export interface GeneratedStar {
  id: string;
  name: string;
  type: StarType;
  temperature: number;
  luminosity: number;
  mass: number;
  color: string;
  coordinates: {
    galaxy: number;
    sector: number;
    system: number;
  };
  coordinateString: string;
}

export interface GeneratedPlanet {
  id: string;
  name: string;
  type: PlanetType;
  radius: number;
  mass: number;
  orbitalPeriod: number;
  distanceFromStar: number;
  temperature: number;
  hasAtmosphere: boolean;
  atmosphereComposition: string[];
  resources: string[];
  habitable: boolean;
  moons: GeneratedMoon[];
  hasRings: boolean;
  orbitIndex: number;
  coordinates: CelestialCoordinates;
  coordinateString: string;
}

export interface GeneratedMoon {
  id: string;
  name: string;
  radius: number;
  mass: number;
  orbitalPeriod: number;
  distanceFromPlanet: number;
  resources: string[];
  moonIndex: number;
  coordinates: CelestialCoordinates;
  coordinateString: string;
}

export interface GeneratedSystem {
  id: string;
  name: string;
  star: GeneratedStar;
  planets: GeneratedPlanet[];
  asteroidBelts: number;
  hasAnomalies: boolean;
  coordinates: {
    galaxy: number;
    sector: number;
    system: number;
  };
  coordinateString: string;
}

export interface GeneratedSector {
  id: string;
  name: string;
  systems: GeneratedSystem[];
  coordinates: {
    galaxy: number;
    sector: number;
  };
  coordinateString: string;
}

export interface GeneratedGalaxy {
  id: string;
  name: string;
  type: GalaxyType;
  sectors: GeneratedSector[];
  starCount: number;
  diameter: number;
  coordinates: { x: number; y: number; z: number };
  galacticCoordinate: number;
}

export class UniverseGenerator {
  private masterSeed: string;
  private rng: SeededRandom;
  
  constructor(seed: string = UNIVERSE_CONFIG.seed.default) {
    this.masterSeed = seed;
    this.rng = new SeededRandom(seed);
  }
  
  getSeed(): string {
    return this.masterSeed;
  }
  
  private generateStarName(rng: SeededRandom, galaxyIndex: number, sectorIndex: number, systemIndex: number): string {
    const config = UNIVERSE_CONFIG.generation.nameGeneration;
    const style = rng.nextInt(0, 3);
    
    switch (style) {
      case 0: {
        const prefix = rng.pick(config.prefixes);
        const suffix = rng.pick(config.suffixes);
        return `${prefix} ${suffix}`;
      }
      case 1: {
        const constellation = rng.pick(config.constellations);
        const greek = rng.pick(config.greekLetters);
        return `${greek} ${constellation}`;
      }
      case 2: {
        const syllableCount = rng.nextInt(2, 4);
        let name = '';
        for (let i = 0; i < syllableCount; i++) {
          name += rng.pick(config.syllables);
        }
        name = name.charAt(0).toUpperCase() + name.slice(1);
        const number = rng.nextInt(1, 9999);
        return `${name}-${number}`;
      }
      default: {
        return `System-${galaxyIndex}-${sectorIndex}-${systemIndex}`;
      }
    }
  }
  
  private generatePlanetName(rng: SeededRandom, starName: string, orbitIndex: number): string {
    const config = UNIVERSE_CONFIG.generation.nameGeneration;
    const style = rng.nextInt(0, 2);
    
    switch (style) {
      case 0: {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
        return `${starName} ${romanNumerals[orbitIndex] || (orbitIndex + 1)}`;
      }
      case 1: {
        const syllableCount = rng.nextInt(2, 3);
        let name = '';
        for (let i = 0; i < syllableCount; i++) {
          name += rng.pick(config.syllables);
        }
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
      default: {
        const suffix = rng.pick(config.suffixes);
        return `${starName} ${suffix}`;
      }
    }
  }
  
  private generateMoonName(rng: SeededRandom, planetName: string, moonIndex: number): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return `${planetName} ${letters[moonIndex] || moonIndex + 1}`;
  }
  
  private selectStarType(rng: SeededRandom): StarType {
    const distribution = UNIVERSE_CONFIG.generation.starTypeDistribution;
    const roll = rng.next();
    let cumulative = 0;
    
    for (const [type, probability] of Object.entries(distribution)) {
      cumulative += probability;
      if (roll < cumulative) {
        return type as StarType;
      }
    }
    
    return 'M';
  }
  
  private selectPlanetType(rng: SeededRandom, distanceFromStar: number, habitableZoneInner: number, habitableZoneOuter: number): PlanetType {
    const inHabitableZone = distanceFromStar >= habitableZoneInner && distanceFromStar <= habitableZoneOuter;
    const isInner = distanceFromStar < habitableZoneInner;
    
    if (inHabitableZone && rng.nextBoolean(0.3)) {
      return 'terran';
    }
    
    if (isInner) {
      const types: PlanetType[] = ['rocky', 'volcanic', 'desert', 'barren'];
      return rng.pick(types);
    }
    
    const types: PlanetType[] = ['gas_giant', 'ice_giant', 'frozen', 'rocky'];
    return rng.pick(types);
  }
  
  private calculateHabitableZone(starType: StarType): { inner: number; outer: number } {
    const starInfo = UNIVERSE_CONFIG.starTypes[starType];
    const luminosity = starInfo.luminosity;
    const config = UNIVERSE_CONFIG.generation.habitableZone;
    
    const baseDistance = Math.sqrt(luminosity);
    return {
      inner: baseDistance * config.innerMultiplier,
      outer: baseDistance * config.outerMultiplier,
    };
  }
  
  private calculatePlanetTemperature(starType: StarType, distance: number): number {
    const starInfo = UNIVERSE_CONFIG.starTypes[starType];
    const luminosity = starInfo.luminosity;
    const baseTemp = 278 * Math.pow(luminosity, 0.25) / Math.sqrt(distance);
    return Math.round(baseTemp);
  }
  
  generateStarFromSeed(galaxyIndex: number, sectorIndex: number, systemIndex: number): GeneratedStar {
    const rng = this.rng.fork(`star_${galaxyIndex}_${sectorIndex}_${systemIndex}`);
    const type = this.selectStarType(rng);
    const starInfo = UNIVERSE_CONFIG.starTypes[type];
    
    const name = this.generateStarName(rng, galaxyIndex, sectorIndex, systemIndex);
    
    return {
      id: `star_${galaxyIndex}_${sectorIndex}_${systemIndex}`,
      name,
      type,
      temperature: starInfo.temperature * rng.nextFloat(0.9, 1.1),
      luminosity: starInfo.luminosity * rng.nextFloat(0.8, 1.2),
      mass: starInfo.mass * rng.nextFloat(0.9, 1.1),
      color: starInfo.color,
      coordinates: {
        galaxy: galaxyIndex,
        sector: sectorIndex,
        system: systemIndex,
      },
      coordinateString: `${galaxyIndex}:${sectorIndex}:${systemIndex}:0:0`,
    };
  }
  
  generatePlanetFromSeed(
    star: GeneratedStar,
    orbitIndex: number,
    galaxyIndex: number,
    sectorIndex: number,
    systemIndex: number
  ): GeneratedPlanet {
    const rng = this.rng.fork(`planet_${galaxyIndex}_${sectorIndex}_${systemIndex}_${orbitIndex}`);
    
    const habitableZone = this.calculateHabitableZone(star.type);
    const distanceFromStar = rng.nextFloat(0.2, 50) * (orbitIndex + 1) * 0.3;
    const type = this.selectPlanetType(rng, distanceFromStar, habitableZone.inner, habitableZone.outer);
    const planetInfo = UNIVERSE_CONFIG.planetTypes[type];
    
    const radius = rng.nextFloat(planetInfo.minRadius, planetInfo.maxRadius);
    const mass = Math.pow(radius, 2.5) * rng.nextFloat(0.8, 1.2);
    const hasAtmosphere = rng.nextBoolean(planetInfo.atmosphereChance);
    const temperature = this.calculatePlanetTemperature(star.type, distanceFromStar);
    
    const habitable = 
      type === 'terran' || 
      (type === 'ocean' && temperature > 273 && temperature < 323) ||
      (hasAtmosphere && temperature > 200 && temperature < 350);
    
    const atmosphereComposition = hasAtmosphere ? this.generateAtmosphere(rng, type, temperature) : [];
    const resources = this.generateResources(rng, type);
    
    const moonCount = type === 'gas_giant' 
      ? rng.nextInt(5, 20) 
      : type === 'ice_giant' 
        ? rng.nextInt(2, 10) 
        : rng.nextInt(0, 3);
    
    const moons: GeneratedMoon[] = [];
    const name = this.generatePlanetName(rng, star.name, orbitIndex);
    
    for (let m = 0; m < moonCount; m++) {
      moons.push(this.generateMoonFromSeed(
        rng.fork(`moon_${m}`),
        name,
        orbitIndex,
        m,
        galaxyIndex,
        sectorIndex,
        systemIndex,
        radius
      ));
    }
    
    return {
      id: `planet_${galaxyIndex}_${sectorIndex}_${systemIndex}_${orbitIndex}`,
      name,
      type,
      radius,
      mass,
      orbitalPeriod: Math.pow(distanceFromStar, 1.5) * 365,
      distanceFromStar,
      temperature,
      hasAtmosphere,
      atmosphereComposition,
      resources,
      habitable,
      moons,
      hasRings: rng.nextBoolean(type === 'gas_giant' ? 0.5 : type === 'ice_giant' ? 0.3 : 0.05),
      orbitIndex,
      coordinates: {
        galaxy: galaxyIndex,
        sector: sectorIndex,
        system: systemIndex,
        orbit: orbitIndex + 1,
        index: 0,
      },
      coordinateString: `${galaxyIndex}:${sectorIndex}:${systemIndex}:${orbitIndex + 1}:0`,
    };
  }
  
  private generateMoonFromSeed(
    rng: SeededRandom,
    planetName: string,
    planetOrbit: number,
    moonIndex: number,
    galaxyIndex: number,
    sectorIndex: number,
    systemIndex: number,
    planetRadius: number
  ): GeneratedMoon {
    const radius = rng.nextFloat(0.01, 0.4) * planetRadius;
    const mass = Math.pow(radius, 2.5) * rng.nextFloat(0.5, 1.5);
    const distance = rng.nextFloat(0.01, 0.5) * (moonIndex + 1);
    
    const resources = ['metal', 'crystal'];
    if (rng.nextBoolean(0.3)) resources.push('water');
    if (rng.nextBoolean(0.1)) resources.push('deuterium');
    
    const name = this.generateMoonName(rng, planetName, moonIndex);
    
    return {
      id: `moon_${galaxyIndex}_${sectorIndex}_${systemIndex}_${planetOrbit}_${moonIndex}`,
      name,
      radius,
      mass,
      orbitalPeriod: Math.pow(distance, 1.5) * 30,
      distanceFromPlanet: distance,
      resources,
      moonIndex,
      coordinates: {
        galaxy: galaxyIndex,
        sector: sectorIndex,
        system: systemIndex,
        orbit: planetOrbit + 1,
        index: moonIndex + 1,
      },
      coordinateString: `${galaxyIndex}:${sectorIndex}:${systemIndex}:${planetOrbit + 1}:${moonIndex + 1}`,
    };
  }
  
  private generateAtmosphere(rng: SeededRandom, type: PlanetType, temperature: number): string[] {
    const atmosphere: string[] = [];
    
    switch (type) {
      case 'terran':
      case 'ocean':
        atmosphere.push('Nitrogen (78%)', 'Oxygen (21%)');
        if (rng.nextBoolean(0.3)) atmosphere.push('Argon (1%)');
        break;
      case 'gas_giant':
      case 'ice_giant':
        atmosphere.push('Hydrogen (89%)', 'Helium (10%)');
        atmosphere.push('Methane', 'Ammonia');
        break;
      case 'volcanic':
        atmosphere.push('Carbon Dioxide (90%)', 'Sulfur Dioxide (5%)');
        break;
      case 'desert':
        atmosphere.push('Carbon Dioxide (95%)', 'Nitrogen (3%)');
        break;
      case 'frozen':
        if (temperature > 50) atmosphere.push('Nitrogen (trace)', 'Methane (trace)');
        break;
      case 'toxic':
        atmosphere.push('Sulfuric Acid', 'Carbon Dioxide', 'Chlorine');
        break;
      default:
        if (rng.nextBoolean(0.5)) atmosphere.push('Carbon Dioxide (trace)');
    }
    
    return atmosphere;
  }
  
  private generateResources(rng: SeededRandom, planetType: PlanetType): string[] {
    const planetInfo = UNIVERSE_CONFIG.planetTypes[planetType];
    const resources: string[] = [...planetInfo.resources];
    
    if (rng.nextBoolean(0.2)) {
      const bonusResources = ['exotic', 'antimatter', 'dark_matter', 'quantum_crystals'];
      resources.push(rng.pick(bonusResources));
    }
    
    return resources;
  }
  
  generateSystemFromSeed(galaxyIndex: number, sectorIndex: number, systemIndex: number): GeneratedSystem {
    const rng = this.rng.fork(`system_${galaxyIndex}_${sectorIndex}_${systemIndex}`);
    
    const star = this.generateStarFromSeed(galaxyIndex, sectorIndex, systemIndex);
    
    const planetCount = rng.nextInt(
      UNIVERSE_CONFIG.size.minPlanetsPerSystem,
      UNIVERSE_CONFIG.size.maxPlanetsPerSystem
    );
    
    const planets: GeneratedPlanet[] = [];
    for (let p = 0; p < planetCount; p++) {
      planets.push(this.generatePlanetFromSeed(star, p, galaxyIndex, sectorIndex, systemIndex));
    }
    
    const asteroidBelts = rng.nextBoolean(UNIVERSE_CONFIG.size.asteroidBeltChance) ? rng.nextInt(1, 3) : 0;
    const hasAnomalies = rng.nextBoolean(0.05);
    
    return {
      id: `system_${galaxyIndex}_${sectorIndex}_${systemIndex}`,
      name: star.name,
      star,
      planets,
      asteroidBelts,
      hasAnomalies,
      coordinates: {
        galaxy: galaxyIndex,
        sector: sectorIndex,
        system: systemIndex,
      },
      coordinateString: `${galaxyIndex}:${sectorIndex}:${systemIndex}:0:0`,
    };
  }
  
  generateSectorFromSeed(galaxyIndex: number, sectorIndex: number, systemCount?: number): GeneratedSector {
    const rng = this.rng.fork(`sector_${galaxyIndex}_${sectorIndex}`);
    const count = systemCount ?? rng.nextInt(50, UNIVERSE_CONFIG.size.systemsPerSector);
    
    const systems: GeneratedSystem[] = [];
    for (let s = 0; s < count; s++) {
      systems.push(this.generateSystemFromSeed(galaxyIndex, sectorIndex, s));
    }
    
    const config = UNIVERSE_CONFIG.generation.nameGeneration;
    const name = `Sector ${rng.pick(config.greekLetters)}-${rng.nextInt(1, 999)}`;
    
    return {
      id: `sector_${galaxyIndex}_${sectorIndex}`,
      name,
      systems,
      coordinates: {
        galaxy: galaxyIndex,
        sector: sectorIndex,
      },
      coordinateString: `${galaxyIndex}:${sectorIndex}:0:0:0`,
    };
  }
  
  generateGalaxyFromSeed(galaxyIndex: number, sectorCount?: number): GeneratedGalaxy {
    const rng = this.rng.fork(`galaxy_${galaxyIndex}`);
    const count = sectorCount ?? rng.nextInt(30, UNIVERSE_CONFIG.size.sectorsPerGalaxy);
    
    const types: GalaxyType[] = ['spiral', 'elliptical', 'irregular', 'lenticular'];
    const type = rng.pick(types);
    
    const sectors: GeneratedSector[] = [];
    for (let s = 0; s < count; s++) {
      sectors.push(this.generateSectorFromSeed(galaxyIndex, s, rng.nextInt(10, 50)));
    }
    
    const config = UNIVERSE_CONFIG.generation.nameGeneration;
    const syllableCount = rng.nextInt(2, 4);
    let name = '';
    for (let i = 0; i < syllableCount; i++) {
      name += rng.pick(config.syllables);
    }
    name = name.charAt(0).toUpperCase() + name.slice(1) + ' Galaxy';
    
    const totalStars = sectors.reduce((sum, sector) => 
      sum + sector.systems.length, 0
    );
    
    return {
      id: `galaxy_${galaxyIndex}`,
      name,
      type,
      sectors,
      starCount: totalStars * 1000000,
      diameter: rng.nextInt(50000, 200000),
      coordinates: {
        x: rng.nextFloat(-10000000, 10000000),
        y: rng.nextFloat(-10000000, 10000000),
        z: rng.nextFloat(-1000000, 1000000),
      },
      galacticCoordinate: galaxyIndex,
    };
  }
  
  getSystemBySeed(galaxyIndex: number, sectorIndex: number, systemIndex: number): GeneratedSystem {
    return this.generateSystemFromSeed(galaxyIndex, sectorIndex, systemIndex);
  }
  
  getPlanetBySeed(
    galaxyIndex: number,
    sectorIndex: number,
    systemIndex: number,
    orbitIndex: number
  ): GeneratedPlanet | null {
    const system = this.generateSystemFromSeed(galaxyIndex, sectorIndex, systemIndex);
    return system.planets[orbitIndex] || null;
  }
  
  static createFromSeed(seed: string): UniverseGenerator {
    return new UniverseGenerator(seed);
  }
}

export const defaultUniverse = new UniverseGenerator(UNIVERSE_CONFIG.seed.default);
