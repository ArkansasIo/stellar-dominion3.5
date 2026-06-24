import { storage } from "../storage";
import { UNIVERSE_CONFIG } from "../../shared/config/universeConfig";
import { NPC_RACES, getRaceById } from "../../shared/config/npcRaces";

type StarType = keyof typeof UNIVERSE_CONFIG.starTypes;
type PlanetType = keyof typeof UNIVERSE_CONFIG.planetTypes;

export interface UniverseSeedPlanet {
  orbit: number;
  type: PlanetType;
  class: string;
  subclass: string;
  category: string;
  subcategory: string;
  habitable: boolean;
  temperature: number;
  resources: string[];
  hasMoon: boolean;
  moonClass?: string;
  moonSubclass?: string;
  moonSize?: string;
  diameter: number;
  mass: number;
  gravity: number;
  waterPercent: number;
  atmosphere: string;
  specialFeatures: string[];
  planetId: string;
}

export interface UniverseSeedSystem {
  coordinates: {
    galaxy: number;
    sector: number;
    system: number;
  };
  signature: string;
  star: {
    type: StarType;
    name: string;
    temperature: number;
    luminosity: number;
  };
  planets: UniverseSeedPlanet[];
  asteroidBelts: number;
  anomalyScore: number;
  resourcesSummary: {
    metalNodes: number;
    crystalNodes: number;
    deuteriumNodes: number;
    habitablePlanets: number;
  };
  galaxyClassification: {
    morphology: string;
    class: string;
    subclass: string;
    category: string;
  };
  npcPresence: Array<{
    raceId: string;
    raceName: string;
    category: string;
    fleetPower: number;
    isHostile: boolean;
  }>;
}

export interface UniverseSeedSectorPreview {
  coordinates: {
    galaxy: number;
    sector: number;
  };
  seed: string;
  systems: Array<{
    system: number;
    signature: string;
    starType: StarType;
    planetCount: number;
    habitableCount: number;
    anomalyScore: number;
  }>;
}

export interface UniverseSeedGalaxySummary {
  galaxy: number;
  seed: string;
  sampledSectors: number;
  sampledSystems: number;
  distribution: {
    stars: Record<StarType, number>;
    totalPlanets: number;
    totalHabitable: number;
    avgAnomalyScore: number;
  };
}

interface UniverseSeedSetting {
  seed: string;
  updatedAt: number;
  source: "default" | "custom";
}

const DEFAULT_SEED = UNIVERSE_CONFIG.seed.default;

class SeededRandom {
  private value: number;

  constructor(seed: string | number) {
    this.value = typeof seed === "number" ? seed : SeededRandom.hash(seed);
  }

  private static hash(input: string): number {
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) || 1;
  }

  next() {
    this.value = (this.value * 1664525 + 1013904223) >>> 0;
    return this.value / 4294967295;
  }

  nextInt(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    return values[Math.floor(this.next() * values.length)];
  }
}

function toSettingKey(userId: string) {
  return `universe_seed:${userId}`;
}

function parseSeedSetting(raw: unknown): UniverseSeedSetting | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Partial<UniverseSeedSetting>;
  if (typeof candidate.seed !== "string") {
    return null;
  }

  return {
    seed: candidate.seed,
    updatedAt: typeof candidate.updatedAt === "number" ? candidate.updatedAt : Date.now(),
    source: candidate.source === "custom" ? "custom" : "default",
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeSeed(seed: string) {
  const trimmed = (seed || "").trim();
  if (!trimmed) {
    return DEFAULT_SEED;
  }
  return trimmed.slice(0, UNIVERSE_CONFIG.seed.maxLength);
}

function getCoordinateSeed(seed: string, galaxy: number, sector: number, system: number, suffix: string) {
  return `${seed}:${galaxy}:${sector}:${system}:${suffix}`;
}

function chooseStarType(rng: SeededRandom): StarType {
  const entries = Object.entries(UNIVERSE_CONFIG.generation.starTypeDistribution) as Array<[StarType, number]>;
  const roll = rng.next();
  let cumulative = 0;

  for (const [starType, probability] of entries) {
    cumulative += probability;
    if (roll <= cumulative) {
      return starType;
    }
  }

  return "M";
}

function choosePlanetType(rng: SeededRandom): PlanetType {
  const entries = Object.entries(UNIVERSE_CONFIG.generation.planetTypeDistribution) as Array<[PlanetType, number]>;
  const roll = rng.next();
  let cumulative = 0;

  for (const [planetType, probability] of entries) {
    cumulative += probability;
    if (roll <= cumulative) {
      return planetType;
    }
  }

  return "rocky";
}

function inferHabitability(planetType: PlanetType, temperature: number): boolean {
  if (planetType === "terran" || planetType === "ocean") {
    return true;
  }
  if (planetType === "desert") {
    return temperature >= 260 && temperature <= 340;
  }
  if (planetType === "rocky") {
    return temperature >= 240 && temperature <= 330;
  }
  return false;
}

function pickStarName(seed: string, galaxy: number, sector: number, system: number) {
  const rng = new SeededRandom(getCoordinateSeed(seed, galaxy, sector, system, "star-name"));
  const prefixes = UNIVERSE_CONFIG.generation.nameGeneration.prefixes;
  const suffixes = UNIVERSE_CONFIG.generation.nameGeneration.suffixes;
  return `${rng.pick(prefixes)} ${rng.pick(suffixes)}`;
}

export class UniverseSeedService {
  static async getSeedForUser(userId: string) {
    const setting = await storage.getSetting(toSettingKey(userId));
    const parsed = parseSeedSetting(setting?.value);
    if (parsed) {
      return parsed;
    }

    return {
      seed: DEFAULT_SEED,
      updatedAt: Date.now(),
      source: "default" as const,
    };
  }

  static async setSeedForUser(userId: string, seedInput: string) {
    const seed = normalizeSeed(seedInput);
    const payload: UniverseSeedSetting = {
      seed,
      updatedAt: Date.now(),
      source: seed === DEFAULT_SEED ? "default" : "custom",
    };

    await storage.setSetting(
      toSettingKey(userId),
      payload,
      "Per-user universe deterministic seed",
      "player-state",
    );

    return payload;
  }

  static async resetSeedForUser(userId: string) {
    return UniverseSeedService.setSeedForUser(userId, DEFAULT_SEED);
  }

  static async getConfigForUser(userId: string) {
    const selected = await UniverseSeedService.getSeedForUser(userId);
    return {
      selected,
      defaults: {
        seed: DEFAULT_SEED,
        maxLength: UNIVERSE_CONFIG.seed.maxLength,
      },
      limits: {
        galaxies: UNIVERSE_CONFIG.size.galaxyCount,
        sectorsPerGalaxy: UNIVERSE_CONFIG.size.sectorsPerGalaxy,
        systemsPerSector: UNIVERSE_CONFIG.size.systemsPerSector,
        minPlanetsPerSystem: UNIVERSE_CONFIG.size.minPlanetsPerSystem,
        maxPlanetsPerSystem: UNIVERSE_CONFIG.size.maxPlanetsPerSystem,
      },
      functions: [
        "getSeedForUser",
        "setSeedForUser",
        "resetSeedForUser",
        "generateSystem",
        "generateSectorPreview",
        "generateGalaxySummary",
      ],
    };
  }

  static generateSystem(seed: string, galaxy: number, sector: number, system: number): UniverseSeedSystem {
    const normalizedSeed = normalizeSeed(seed);
    const safeGalaxy = clamp(Math.floor(galaxy), 1, UNIVERSE_CONFIG.size.galaxyCount);
    const safeSector = clamp(Math.floor(sector), 1, UNIVERSE_CONFIG.size.sectorsPerGalaxy);
    const safeSystem = clamp(Math.floor(system), 1, UNIVERSE_CONFIG.size.systemsPerSector);

    const systemRng = new SeededRandom(getCoordinateSeed(normalizedSeed, safeGalaxy, safeSector, safeSystem, "system"));
    const starType = chooseStarType(systemRng);
    const starInfo = UNIVERSE_CONFIG.starTypes[starType];
    const starName = pickStarName(normalizedSeed, safeGalaxy, safeSector, safeSystem);

    const planetCount = systemRng.nextInt(
      UNIVERSE_CONFIG.size.minPlanetsPerSystem,
      UNIVERSE_CONFIG.size.maxPlanetsPerSystem,
    );

    let metalNodes = 0;
    let crystalNodes = 0;
    let deuteriumNodes = 0;
    let habitablePlanets = 0;

    const planets = Array.from({ length: planetCount }, (_, index) => {
      const orbit = index + 1;
      const planetRng = new SeededRandom(getCoordinateSeed(normalizedSeed, safeGalaxy, safeSector, safeSystem, `planet-${orbit}`));
      const type = choosePlanetType(planetRng);
      const resources = [...UNIVERSE_CONFIG.planetTypes[type].resources];
      const temperature = Math.round(planetRng.nextInt(120, 460));
      const habitable = inferHabitability(type, temperature);
      const hasMoon = planetRng.next() < 0.42;

      // Star Trek classification
      const classMap: Record<string, string> = {
        rocky: 'K', gas_giant: 'J', ice_giant: 'I', desert: 'D',
        ocean: 'M', volcanic: 'V', frozen: 'A', terran: 'M',
        barren: 'D', toxic: 'H',
      };
      const planetClass = classMap[type] || 'K';
      const subclass = planetClass + planetRng.nextInt(0, 9);
      const category = habitable ? 'habitable' : (type === 'gas_giant' || type === 'ice_giant') ? 'gas' : 'hostile';
      const subcategory = resources.includes('metal') ? 'mineral-rich' : resources.includes('crystal') ? 'crystal-rich' : 'standard';

      const diameter = Math.round(planetRng.nextInt(1000, 15000));
      const mass = Number((planetRng.next() * 8.0 + 0.1).toFixed(3));
      const gravity = Number((planetRng.next() * 3.5 + 0.2).toFixed(2));
      const waterPercent = type === 'ocean' ? Math.round(planetRng.nextInt(60, 95)) : type === 'terran' ? Math.round(planetRng.nextInt(20, 60)) : Math.round(planetRng.nextInt(0, 15));
      const atmosphere = UNIVERSE_CONFIG.planetTypes[type]?.resources?.length ? 'varies' : 'none';
      const specialFeatures: string[] = [];
      if (habitable) specialFeatures.push('habitable_zone');
      if (planetRng.next() > 0.92) specialFeatures.push('precursor_remnants');

      const moonClass = hasMoon ? (planetRng.next() > 0.5 ? 'Terrestrial' : planetRng.next() > 0.5 ? 'Ice' : 'Rocky') : undefined;
      const moonSubclass = hasMoon ? (planetRng.next() > 0.6 ? 'Major' : 'Medium') : undefined;
      const moonSize = hasMoon ? (planetRng.next() > 0.7 ? 'Large' : planetRng.next() > 0.4 ? 'Medium' : 'Small') : undefined;

      const planetId = `G${String(safeGalaxy).padStart(3, '0')}-S${String(safeSector).padStart(2, '0')}-S${String(safeSystem).padStart(3, '0')}-P${String(orbit).padStart(2, '0')}`;

      if (resources.includes("metal")) metalNodes += 1;
      if (resources.includes("crystal")) crystalNodes += 1;
      if (resources.includes("deuterium")) deuteriumNodes += 1;
      if (habitable) habitablePlanets += 1;

      return {
        orbit,
        type,
        class: planetClass,
        subclass,
        category,
        subcategory,
        habitable,
        temperature,
        resources,
        hasMoon,
        moonClass,
        moonSubclass,
        moonSize,
        diameter,
        mass,
        gravity,
        waterPercent,
        atmosphere,
        specialFeatures,
        planetId,
      };
    });

    const asteroidBelts = systemRng.next() <= UNIVERSE_CONFIG.size.asteroidBeltChance ? systemRng.nextInt(1, 3) : 0;
    const anomalyScore = Number((systemRng.next() * 100).toFixed(2));

    // Galaxy classification
    const morphologyKeys = ['spiral', 'elliptical', 'lenticular', 'irregular', 'ring'] as const;
    const morphologyIdx = Math.floor(systemRng.next() * morphologyKeys.length);
    const morphology = morphologyKeys[morphologyIdx] || 'spiral';
    const classKeys = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
    const classIdx = Math.floor(systemRng.next() * classKeys.length);
    const galaxyClass = classKeys[classIdx] || 'C';
    const subclassKeys = ['alpha', 'beta', 'gamma', 'delta'] as const;
    const subclassIdx = Math.floor(systemRng.next() * subclassKeys.length);
    const galaxySubclass = subclassKeys[subclassIdx] || 'alpha';
    const categoryKeys = ['hostile', 'neutral', 'fertile', 'ancient', 'volatile'] as const;
    const categoryIdx = Math.floor(systemRng.next() * categoryKeys.length);
    const galaxyCategory = categoryKeys[categoryIdx] || 'neutral';

    // NPC race presence
    const npcPresence: Array<{
      raceId: string;
      raceName: string;
      category: string;
      fleetPower: number;
      isHostile: boolean;
    }> = [];
    for (const race of NPC_RACES) {
      const raceRng = new SeededRandom(getCoordinateSeed(normalizedSeed, safeGalaxy, safeSector, safeSystem, `race-${race.id}`));
      if (raceRng.next() < race.spawnWeight / 200 && raceRng.next() < 0.15) {
        npcPresence.push({
          raceId: race.id,
          raceName: race.name,
          category: race.category,
          fleetPower: Math.floor(race.fleetStrength * (0.5 + raceRng.next() * 1.5)),
          isHostile: race.defaultStance === 'hostile',
        });
      }
    }

    return {
      coordinates: {
        galaxy: safeGalaxy,
        sector: safeSector,
        system: safeSystem,
      },
      signature: `${normalizedSeed}:${safeGalaxy}:${safeSector}:${safeSystem}`,
      star: {
        type: starType,
        name: starName,
        temperature: Math.round(starInfo.temperature),
        luminosity: Number(starInfo.luminosity.toFixed(4)),
      },
      planets,
      asteroidBelts,
      anomalyScore,
      resourcesSummary: {
        metalNodes,
        crystalNodes,
        deuteriumNodes,
        habitablePlanets,
      },
      galaxyClassification: {
        morphology,
        class: galaxyClass,
        subclass: galaxySubclass,
        category: galaxyCategory,
      },
      npcPresence,
    };
  }

  static generateSectorPreview(
    seed: string,
    galaxy: number,
    sector: number,
    limit = 12,
  ): UniverseSeedSectorPreview {
    const normalizedSeed = normalizeSeed(seed);
    const safeGalaxy = clamp(Math.floor(galaxy), 1, UNIVERSE_CONFIG.size.galaxyCount);
    const safeSector = clamp(Math.floor(sector), 1, UNIVERSE_CONFIG.size.sectorsPerGalaxy);
    const safeLimit = clamp(Math.floor(limit), 1, 50);

    const systems = Array.from({ length: safeLimit }, (_, index) => {
      const systemIndex = index + 1;
      const generated = UniverseSeedService.generateSystem(normalizedSeed, safeGalaxy, safeSector, systemIndex);
      return {
        system: systemIndex,
        signature: generated.signature,
        starType: generated.star.type,
        planetCount: generated.planets.length,
        habitableCount: generated.resourcesSummary.habitablePlanets,
        anomalyScore: generated.anomalyScore,
      };
    });

    return {
      coordinates: {
        galaxy: safeGalaxy,
        sector: safeSector,
      },
      seed: normalizedSeed,
      systems,
    };
  }

  static generateGalaxySummary(
    seed: string,
    galaxy: number,
    sectorCount = 5,
    systemsPerSector = 10,
  ): UniverseSeedGalaxySummary {
    const normalizedSeed = normalizeSeed(seed);
    const safeGalaxy = clamp(Math.floor(galaxy), 1, UNIVERSE_CONFIG.size.galaxyCount);
    const safeSectorCount = clamp(Math.floor(sectorCount), 1, 24);
    const safeSystemsPerSector = clamp(Math.floor(systemsPerSector), 1, 30);

    const stars = Object.keys(UNIVERSE_CONFIG.starTypes).reduce((acc, starType) => {
      acc[starType as StarType] = 0;
      return acc;
    }, {} as Record<StarType, number>);

    let totalPlanets = 0;
    let totalHabitable = 0;
    let totalAnomaly = 0;
    let sampledSystems = 0;

    for (let sectorIndex = 1; sectorIndex <= safeSectorCount; sectorIndex += 1) {
      for (let systemIndex = 1; systemIndex <= safeSystemsPerSector; systemIndex += 1) {
        const system = UniverseSeedService.generateSystem(normalizedSeed, safeGalaxy, sectorIndex, systemIndex);
        stars[system.star.type] += 1;
        totalPlanets += system.planets.length;
        totalHabitable += system.resourcesSummary.habitablePlanets;
        totalAnomaly += system.anomalyScore;
        sampledSystems += 1;
      }
    }

    return {
      galaxy: safeGalaxy,
      seed: normalizedSeed,
      sampledSectors: safeSectorCount,
      sampledSystems,
      distribution: {
        stars,
        totalPlanets,
        totalHabitable,
        avgAnomalyScore: Number((sampledSystems > 0 ? totalAnomaly / sampledSystems : 0).toFixed(2)),
      },
    };
  }
}
