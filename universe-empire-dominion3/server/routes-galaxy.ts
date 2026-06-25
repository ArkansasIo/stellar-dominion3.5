import type { Express, Request, Response } from "express";
import { db } from "./db";
import { storage } from "./storage";
import { playerStates, users } from "../shared/schema";
import { like, eq, inArray } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { PLANET_CATALOG, PLANET_SIZE_CLASSES, type PlanetClassification } from "../shared/config/planetCatalog";
import { MOON_CATALOG, MOON_SIZE_CLASSES, type MoonClassification } from "../shared/config/moonCatalog";
import { GALAXY_MORPHOLOGY_TYPES, classifyGalaxy, type GalaxyClassification } from "../shared/config/galaxyClassification";
import { UNIVERSE_CLASSIFICATION, getClassForSize } from "../shared/config/universeClassification";
import { NPC_RACES, getRaceById } from "../shared/config/npcRaces";
import { PIRATE_FACTIONS, getPiratesInSector } from "../shared/config/pirateFactions";
import { getRelation, areEnemies } from "../shared/config/raceAlliances";

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

interface MoonDetail {
  name: string;
  type: string;
  class: string;
  subclass: string;
  size: string;
  sizeClass: string;
  diameter: number;
  gravity: number;
  habitable: boolean;
  atmosphere: string;
  temperature: number;
  resources: string[];
  specialFeatures: string[];
}

interface NPCPresence {
  raceId: string;
  raceName: string;
  faction: string;
  fleetPower: number;
  diplomaticStance: string;
  isHostile: boolean;
}

interface SystemPosition {
  position: number;
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  moonDetails?: MoonDetail;
  class?: string;
  subclass?: string;
  category?: string;
  subcategory?: string;
  planetType?: string;
  temperature?: number;
  resources?: string[];
  habitable?: boolean;
  gravity?: number;
  atmosphere?: string;
  activity?: number;
  stations?: { name: string; level: number; type: string }[];
  diameter?: number;
  mass?: number;
  waterPercent?: number;
  specialFeatures?: string[];
  planetId?: string;
  npcs?: NPCPresence[];
}

interface GeneratedSystem {
  systemName: string;
  star: { type: string; name: string };
  positions: SystemPosition[];
  galaxyClassification: GalaxyClassification;
  racePresence: NPCPresence[];
  planetCount: number;
}

type ScanReport = {
  targetName: string;
  targetType: SystemObjectType;
  threatLevel: "low" | "medium" | "high";
  anomalies: string[];
  estimatedResources: { metal: number; crystal: number; deuterium: number };
  timestamp: number;
};

// ---------------------------------------------------------------------------
// NMS-style deterministic universe seed system
// ---------------------------------------------------------------------------

import { UNIVERSE_CONFIG } from "../shared/config/universeConfig";

/** Maximum orbital positions displayed in a system (matches the client table). */
const MAX_SYSTEM_POSITIONS = UNIVERSE_CONFIG.size.maxPlanetsPerSystem;

/** FNV-1a 32-bit hash of an arbitrary string. */
function fnv1a(str: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return hash || 1;
}

/**
 * Derive a pseudo-random float in [0, 1) from a base hash at a given slot.
 * Different slots produce independent streams from the same base.
 */
function seededAt(baseHash: number, slot: number): number {
  let h = (baseHash + Math.imul(slot >>> 0, 2654435761)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Phonemic syllables used for NMS-style procedural name generation. */
const SYLLABLES = [
  "al", "an", "ar", "as", "ba", "be", "bi", "bo", "ca", "ce", "ci", "co",
  "da", "de", "di", "do", "el", "en", "er", "es", "fa", "fe", "fi", "ga",
  "ge", "gi", "go", "ha", "he", "hi", "ia", "io", "ja", "ka", "ke", "ki",
  "ko", "la", "le", "li", "lo", "ma", "me", "mi", "mo", "na", "ne", "ni",
  "no", "on", "or", "os", "pa", "pe", "pi", "ra", "re", "ri", "ro", "sa",
  "se", "si", "so", "ta", "te", "ti", "to", "ul", "un", "ur", "va", "ve",
  "vi", "vo", "xa", "xe", "za", "ze", "zo",
] as const;

/** Generate a 2-3 syllable procedural name from a hash + slot offset. */
function generateName(hash: number, slot = 0): string {
  const numSyl = seededAt(hash, slot) > 0.55 ? 3 : 2;
  let name = "";
  for (let i = 0; i < numSyl; i++) {
    const idx = Math.floor(seededAt(hash, slot + i + 1) * SYLLABLES.length);
    name += SYLLABLES[idx];
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Star type thresholds matching real astronomical frequency distribution. */
const STAR_TYPE_THRESHOLDS: Array<[string, number]> = [
  ["O", 0.00003],
  ["B", 0.0013],
  ["A", 0.006],
  ["F", 0.03],
  ["G", 0.076],
  ["K", 0.121],
  ["M", 1],
];

function pickStarType(r: number): string {
  let cumulative = 0;
  for (const [type, weight] of STAR_TYPE_THRESHOLDS) {
    cumulative += weight;
    if (r < cumulative) return type;
  }
  return "M";
}

/**
 * Planet class distribution (Star Trek-style classes).
 * Each entry is [class, cumulative upper bound].
 */
const PLANET_CLASS_THRESHOLDS: Array<[string, number]> = [
  ["M", 0.10], // Earth-like (Minshara)
  ["H", 0.25], // Desert
  ["L", 0.32], // Marginally Habitable
  ["Y", 0.39], // Volcanic / Demon
  ["T", 0.49], // Frozen
  ["J", 0.64], // Gas Giant / Ice Giant
  ["K", 0.84], // Rocky / Adaptable
  ["D", 1.00], // Barren
];

function pickPlanetClass(r: number): string {
  for (const [cls, threshold] of PLANET_CLASS_THRESHOLDS) {
    if (r < threshold) return cls;
  }
  return "K";
}

/** Planet type distribution for detailed classification. */
const PLANET_TYPE_THRESHOLDS: Array<[string, number]> = [
  ["rocky", 0.30],
  ["gas_giant", 0.42],
  ["ice_giant", 0.50],
  ["desert", 0.62],
  ["ocean", 0.70],
  ["volcanic", 0.78],
  ["frozen", 0.88],
  ["terran", 0.93],
  ["barren", 0.97],
  ["toxic", 1.00],
];

function pickPlanetType(r: number): string {
  for (const [type, threshold] of PLANET_TYPE_THRESHOLDS) {
    if (r < threshold) return type;
  }
  return "rocky";
}

/** Moon type distribution. */
const MOON_TYPE_THRESHOLDS: Array<[string, number]> = [
  ["rocky", 0.35],
  ["icy", 0.55],
  ["volcanic", 0.65],
  ["ice-rock", 0.80],
  ["gas-moon", 0.88],
  ["metallic", 0.95],
  ["captured", 1.00],
];

function pickMoonType(r: number): string {
  for (const [type, threshold] of MOON_TYPE_THRESHOLDS) {
    if (r < threshold) return type;
  }
  return "rocky";
}

/** Resources by planet type. */
const PLANET_RESOURCES: Record<string, string[]> = {
  rocky: ["metal", "crystal"],
  gas_giant: ["deuterium", "helium"],
  ice_giant: ["water", "deuterium"],
  desert: ["metal", "crystal", "energy"],
  ocean: ["water", "food", "deuterium"],
  volcanic: ["metal", "energy", "crystal"],
  frozen: ["water", "deuterium", "crystal"],
  terran: ["food", "water", "metal", "crystal"],
  barren: ["metal"],
  toxic: ["crystal", "exotic"],
};

/** Atmosphere types by planet type. */
const PLANET_ATMOSPHERE: Record<string, string> = {
  rocky: "thin nitrogen-CO2",
  gas_giant: "dense hydrogen-helium",
  ice_giant: "methane-ammonia",
  desert: "thin CO2-argon",
  ocean: "nitrogen-oxygen (breathable)",
  volcanic: "sulfur dioxide toxic",
  frozen: "thin nitrogen-methane",
  terran: "nitrogen-oxygen (breathable)",
  barren: "negligible",
  toxic: "corrosive mixed gases",
};

/**
 * Generate a full star system using NMS-style deterministic seeding.
 * The star type and planet count are derived from the system seed; planets
 * are placed sequentially in positions 1..N, followed by optional special
 * objects (asteroid belt, nebula, station, black hole).
 */
function generateSystem(
  universe: string,
  galaxy: number,
  sector: number,
  system: number,
): GeneratedSystem {
  const baseKey = `${universe}:${galaxy}:${sector}:${system}`;
  const sysHash = fnv1a(`${baseKey}:sys`);

  // Star
  const starType = pickStarType(seededAt(sysHash, 0));
  const starName = generateName(fnv1a(`${baseKey}:star-name`));
  const systemName = generateName(fnv1a(`${baseKey}:sys-name`));

  // Planet count: configurable range per system
  const minP = UNIVERSE_CONFIG.size.minPlanetsPerSystem;
  const maxP = UNIVERSE_CONFIG.size.maxPlanetsPerSystem;
  const planetCount = Math.floor(seededAt(sysHash, 1) * (maxP - minP + 1)) + minP;

  const positions: SystemPosition[] = [];

  // Determine galaxy classification for this system
  const galaxyMorphologyIds = GALAXY_MORPHOLOGY_TYPES.map(t => t.id);
  const galaxyMorphologyIdx = Math.floor(seededAt(sysHash, 100) * galaxyMorphologyIds.length);
  const galaxyMorphology = galaxyMorphologyIds[galaxyMorphologyIdx] || 'spiral-normal';
  const szRoll = seededAt(sysHash, 101);
  const galaxySizeVariant = szRoll > 0.6 ? 'large' : szRoll > 0.3 ? 'medium' : 'small';
  const galaxyHabitability = Math.floor(seededAt(sysHash, 102) * 100);
  const galaxyClassification = classifyGalaxy(galaxyMorphology, galaxySizeVariant, galaxyHabitability);

  // Determine NPC race territory presence
  const racePresence: NPCPresence[] = [];
  for (const race of NPC_RACES) {
    const raceHash = fnv1a(`${baseKey}:race-${race.id}`);
    const presenceRoll = seededAt(raceHash, 0);
    // Race is present if spawnWeight check passes and territory includes this sector
    if (presenceRoll < race.spawnWeight / 200 && seededAt(raceHash, 1) < 0.15) {
      const stance = race.defaultStance;
      racePresence.push({
        raceId: race.id,
        raceName: race.name,
        faction: race.category,
        fleetPower: Math.floor(race.fleetStrength * (0.5 + seededAt(raceHash, 2) * 1.5)),
        diplomaticStance: stance,
        isHostile: stance === 'hostile',
      });
    }
  }

  // Place planets in sequential orbital positions starting at 1
  for (let i = 0; i < planetCount; i++) {
    const pos = i + 1;
    const planetHash = fnv1a(`${baseKey}:planet-${pos}`);
    const planetClass = pickPlanetClass(seededAt(planetHash, 0));
    const pType = pickPlanetType(seededAt(planetHash, 5));
    const hasMoon = seededAt(planetHash, 1) < 0.42;
    const planetName = generateName(fnv1a(`${baseKey}:pname-${pos}`));
    const temperature = Math.floor(seededAt(planetHash, 6) * 380) + 80;
    const resources = PLANET_RESOURCES[pType] || ["metal"];
    const atmosphere = PLANET_ATMOSPHERE[pType] || "none";
    const habitable = pType === "terran" || pType === "ocean" || (pType === "rocky" && temperature >= 240 && temperature <= 340);
    const gravity = Number((seededAt(planetHash, 7) * 3.5 + 0.2).toFixed(2));
    const diameter = Math.floor(seededAt(planetHash, 14) * 14000 + 1000);
    const mass = Number((seededAt(planetHash, 15) * 8.0 + 0.1).toFixed(3));
    const waterPercent = pType === "ocean" ? Math.floor(seededAt(planetHash, 16) * 40 + 60) : pType === "terran" ? Math.floor(seededAt(planetHash, 16) * 50 + 20) : Math.floor(seededAt(planetHash, 16) * 15);

    // Classify using planetCatalog
    const sizeIds = PLANET_SIZE_CLASSES.map(s => s.id);
    const sizeIdx = Math.floor(seededAt(planetHash, 17) * sizeIds.length);
    const sizeClass = sizeIds[sizeIdx] || 'M';

    // Special features based on type and class
    const specialFeatures: string[] = [];
    if (habitable) specialFeatures.push('habitable_zone');
    if (pType === "terran") specialFeatures.push('continents', 'oceans', 'temperate_climate');
    if (pType === "volcanic") specialFeatures.push('lava_flows', 'geothermal_vents');
    if (pType === "gas_giant") specialFeatures.push('ring_system', 'storm_systems');
    if (pType === "ocean") specialFeatures.push('deep_ocean', 'thermal_vents');
    if (planetClass === "M") specialFeatures.push('native_biome');
    if (seededAt(planetHash, 18) > 0.9) specialFeatures.push('precursor_remnants');

    const planetId = `G${String(galaxy).padStart(3, '0')}-S${String(sector).padStart(2, '0')}-S${String(system).padStart(3, '0')}-P${String(pos).padStart(2, '0')}`;

    const moonDetails: MoonDetail | undefined = hasMoon ? {
      name: generateName(fnv1a(`${baseKey}:moon-${pos}`)),
      type: pickMoonType(seededAt(planetHash, 8)),
      class: seededAt(planetHash, 19) > 0.6 ? 'Terrestrial' : seededAt(planetHash, 19) > 0.3 ? 'Ice' : 'Rocky',
      subclass: seededAt(planetHash, 20) > 0.7 ? 'Major' : seededAt(planetHash, 20) > 0.4 ? 'Medium' : 'Small',
      size: seededAt(planetHash, 9) > 0.7 ? "large" : seededAt(planetHash, 9) > 0.3 ? "medium" : "small",
      sizeClass: seededAt(planetHash, 9) > 0.7 ? 'Large' : seededAt(planetHash, 9) > 0.3 ? 'Medium' : 'Small',
      diameter: Math.floor(seededAt(planetHash, 21) * 4500 + 100),
      gravity: Number((seededAt(planetHash, 22) * 1.5 + 0.05).toFixed(3)),
      habitable: seededAt(planetHash, 10) > 0.85,
      atmosphere: seededAt(planetHash, 23) > 0.7 ? 'nitrogen-oxygen' : seededAt(planetHash, 23) > 0.4 ? 'thin-CO2' : 'trace',
      temperature: Math.floor(seededAt(planetHash, 24) * 300 + 50),
      resources: seededAt(planetHash, 25) > 0.5 ? ['metal', 'crystal'] : ['metal'],
      specialFeatures: seededAt(planetHash, 26) > 0.7 ? ['subsurface_ocean'] : seededAt(planetHash, 26) > 0.4 ? ['mineral_deposits'] : ['cratered_surface'],
    } : undefined;

    // Some planets have orbital stations
    const hasStation = seededAt(planetHash, 11) > 0.88;
    const stations = hasStation ? [{
      name: `${planetName} Orbital`,
      level: Math.floor(seededAt(planetHash, 12) * 20) + 1,
      type: seededAt(planetHash, 13) > 0.6 ? "defense" : seededAt(planetHash, 13) > 0.3 ? "trade" : "research",
    }] : [];

    // Find NPC presences near this planet
    const nearbyNPCs = racePresence.filter(np => seededAt(fnv1a(`${baseKey}:npc-planet-${np.raceId}-${pos}`), 0) > 0.7);

    positions.push({
      position: pos,
      type: "planet",
      name: planetName,
      moon: hasMoon,
      moonDetails,
      class: planetClass,
      subclass: planetClass + sizeClass,
      category: habitable ? "habitable" : pType === "gas_giant" || pType === "ice_giant" ? "gas" : "hostile",
      subcategory: resources.includes("metal") ? "mineral-rich" : resources.includes("crystal") ? "crystal-rich" : resources.includes("energy") ? "energy-rich" : "standard",
      planetType: pType,
      temperature,
      resources,
      habitable,
      gravity,
      atmosphere,
      diameter,
      mass,
      waterPercent,
      specialFeatures,
      planetId,
      stations,
      npcs: nearbyNPCs.length > 0 ? nearbyNPCs : undefined,
    });
  }

  // Optional asteroid belt immediately after the last planet
  const hasBelt = seededAt(sysHash, 2) < 0.35;
  const beltPos = planetCount + 1;
  if (hasBelt && beltPos <= MAX_SYSTEM_POSITIONS - 1) {
    const beltHash = fnv1a(`${baseKey}:belt`);
    positions.push({
      position: beltPos,
      type: "asteroid",
      name: "Asteroid Belt",
      debris: {
        metal: Math.floor(seededAt(beltHash, 0) * 9000 + 1000),
        crystal: Math.floor(seededAt(beltHash, 1) * 4500 + 500),
      },
    });
  }

  // Rare phenomena in the outer system
  const rarePos = beltPos + (hasBelt ? 1 : 0);
  if (rarePos <= MAX_SYSTEM_POSITIONS - 1) {
    const rareHash = fnv1a(`${baseKey}:rare`);
    const rareRoll = seededAt(rareHash, 0);
    if (rareRoll < 0.02) {
      positions.push({
        position: rarePos,
        type: "blackhole",
        name: "Singularity",
        debris: { metal: 50000, crystal: 50000 },
      });
    } else if (rareRoll < 0.06) {
      positions.push({ position: rarePos, type: "nebula", name: "Ion Cloud" });
    } else if (rareRoll < 0.10) {
      positions.push({
        position: rarePos,
        type: "station",
        name: "Pirate Outpost",
        owner: "Pirates",
      });
    }
  }

  // Fill remaining slots as empty
  for (let pos = 1; pos <= MAX_SYSTEM_POSITIONS; pos++) {
    if (!positions.find((p) => p.position === pos)) {
      positions.push({ position: pos, type: "empty", name: "" });
    }
  }

  return { systemName, star: { type: starType, name: starName }, positions, galaxyClassification, racePresence, planetCount };
}

function generateScanReport(
  universe: string,
  galaxy: number,
  sector: number,
  system: number,
  position: number,
  targetName: string,
  targetType: SystemObjectType,
): ScanReport {
  const scanHash = fnv1a(`${universe}:${galaxy}:${sector}:${system}:${position}:scan`);
  const r1 = seededAt(scanHash, 0);
  const r2 = seededAt(scanHash, 1);
  const r3 = seededAt(scanHash, 2);

  const anomalyPool = [
    "Ion turbulence",
    "Subspace echo",
    "Graviton shear",
    "Dark matter pockets",
    "Radiation burst",
    "Debris drift",
    "Signal interference",
  ];

  const anomalies = anomalyPool.filter((_, index) => {
    const roll = seededAt(scanHash, index + 10);
    return roll > 0.72;
  }).slice(0, 3);

  if (anomalies.length === 0) {
    anomalies.push("No significant anomalies detected");
  }

  const baseThreat = targetType === "station" || targetType === "blackhole" ? 0.75 : targetType === "planet" ? 0.45 : 0.3;
  const threatRoll = Math.min(0.99, baseThreat + r1 * 0.35);
  const threatLevel: "low" | "medium" | "high" = threatRoll > 0.75 ? "high" : threatRoll > 0.45 ? "medium" : "low";

  return {
    targetName,
    targetType,
    threatLevel,
    anomalies,
    estimatedResources: {
      metal: Math.floor(1200 + r1 * 14000),
      crystal: Math.floor(900 + r2 * 9000),
      deuterium: Math.floor(300 + r3 * 5000),
    },
    timestamp: Date.now(),
  };
}

export function registerGalaxyRoutes(app: Express) {
  /**
   * GET /api/galaxy/:universe/:galaxy/:sector/:system
   * Returns canonical position entries for the given system.
   * Real player homeworlds overlay the generated data.
   */
  app.get(
    "/api/galaxy/:universe/:galaxy/:sector/:system",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { universe } = req.params;
        const galaxy = parseInt(req.params.galaxy, 10);
        const sector = parseInt(req.params.sector, 10);
        const system = parseInt(req.params.system, 10);

        if (
          isNaN(galaxy) ||
          isNaN(sector) ||
          isNaN(system) ||
          galaxy < 1 ||
          sector < 1 ||
          system < 1
        ) {
          return res.status(400).json({ error: "Invalid coordinates" });
        }

        // Generate base system data using NMS-style seeded generation
        const generated = generateSystem(universe, galaxy, sector, system);
        const positions: SystemPosition[] = generated.positions;
        const { galaxyClassification, racePresence, planetCount } = generated;

        // Overlay real player data from DB.
        try {
          const coordPrefix = `[${galaxy}:${sector}:${system}:`;
          const players = await db
            .select({
              id: playerStates.id,
              coordinates: playerStates.coordinates,
              planetName: playerStates.planetName,
              userId: playerStates.userId,
            })
            .from(playerStates)
            .where(like(playerStates.coordinates, `${coordPrefix}%`));

          const userIds = players.map((p) => p.userId);

          const usernameMap: Record<string, string> = {};
          const allianceMap: Record<string, string> = {};

          if (userIds.length > 0) {
            const userRows = await db
              .select({ id: users.id, username: users.username })
              .from(users)
              .where(inArray(users.id, userIds));
            for (const u of userRows) {
              usernameMap[u.id] = u.username;
            }
          }

          // Apply real player data onto generated positions
          for (const player of players) {
            const coordStr = player.coordinates; // e.g. "[2:4:102:8]"
            const inner = coordStr.replace(/^\[/, "").replace(/\]$/, "");
            const parts = inner.split(":");
            if (parts.length < 4) continue;
            const pos = parseInt(parts[3], 10);
            if (isNaN(pos) || pos < 1 || pos > MAX_SYSTEM_POSITIONS) continue;

            const existingPos = positions.find((p) => p.position === pos);
            const owner = usernameMap[player.userId] || `Player-${player.userId.slice(0, 6)}`;
            const alliance = allianceMap[player.userId];
            const entry: SystemPosition = {
              ...(existingPos || {}),
              position: pos,
              type: "planet",
              name: player.planetName || `${owner}'s World`,
              owner,
              alliance,
              moon: existingPos?.moon,
              class: existingPos?.class || "M",
            } as SystemPosition;
            const idx = positions.findIndex((p) => p.position === pos);
            if (idx >= 0) {
              positions[idx] = entry;
            } else {
              positions.push(entry);
            }
          }
        } catch {
          // DB lookup failure is non-fatal; fall back to generated data
        }

        // Get pirate activity in this sector
        const sectorPirates = getPiratesInSector(`${galaxy}-${sector}`);

        res.json({
          universe,
          galaxy,
          sector,
          system,
          systemName: generated.systemName,
          star: generated.star,
          positions,
          galaxyClassification: {
            morphology: galaxyClassification.morphology,
            class: galaxyClassification.class,
            subclass: galaxyClassification.subclass,
            category: galaxyClassification.category,
            subcategory: galaxyClassification.subcategory,
            designation: galaxyClassification.designation,
          },
          npcPresence: racePresence,
          pirateActivity: sectorPirates.map(p => ({
            id: p.id,
            name: p.name,
            aggression: p.aggression,
            controlledSectors: p.controlledSectors,
          })),
          systemInfo: {
            totalPlanets: planetCount,
            habitablePlanets: positions.filter(p => p.habitable).length,
            asteroidBelts: positions.filter(p => p.type === "asteroid").length,
            specialObjects: positions.filter(p => p.type === "blackhole" || p.type === "nebula" || p.type === "station").length,
          },
        });
      } catch (error) {
        console.error("Galaxy route error:", error);
        res.status(500).json({ error: "Failed to load system data" });
      }
    },
  );

  app.post(
    "/api/galaxy/:universe/:galaxy/:sector/:system/scan",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.session?.userId as string;
        const { universe } = req.params;
        const galaxy = parseInt(req.params.galaxy, 10);
        const sector = parseInt(req.params.sector, 10);
        const system = parseInt(req.params.system, 10);
        const position = parseInt(String(req.body?.position), 10);
        const targetName = String(req.body?.targetName || "Unknown Target");
        const targetType = String(req.body?.targetType || "empty") as SystemObjectType;

        if (
          isNaN(galaxy) ||
          isNaN(sector) ||
          isNaN(system) ||
          isNaN(position) ||
          galaxy < 1 ||
          sector < 1 ||
          system < 1 ||
          position < 1 ||
          position > MAX_SYSTEM_POSITIONS
        ) {
          return res.status(400).json({ error: "Invalid scan coordinates" });
        }

        const report = generateScanReport(
          universe,
          galaxy,
          sector,
          system,
          position,
          targetName,
          targetType,
        );

        const existingLog = (await storage.getSetting(`galaxy_scan_log:${userId}`))?.value;
        const log = Array.isArray(existingLog) ? existingLog : [];
        const nextEntry = {
          universe,
          galaxy,
          sector,
          system,
          position,
          ...report,
        };

        await storage.setSetting(
          `galaxy_scan_log:${userId}`,
          [nextEntry, ...log].slice(0, 50),
          "Recent galaxy deep scans for commander",
          "player-state",
        );

        return res.json({
          success: true,
          message: `Deep scan completed for ${targetName}`,
          report,
        });
      } catch (error) {
        console.error("Galaxy scan route error:", error);
        return res.status(500).json({ error: "Failed to complete deep scan" });
      }
    },
  );
}
