import type { Express, Request, Response } from "express";
import { db } from "./db";
import { storage } from "./storage";
import { playerStates, users, alliances } from "../shared/schema";
import { like, eq } from "drizzle-orm";

type SystemObjectType = "planet" | "asteroid" | "nebula" | "blackhole" | "station" | "empty";

interface SystemPosition {
  position: number;
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  class?: string;
  activity?: number; // minutes since last activity (undefined = no activity data)
}

interface GeneratedSystem {
  systemName: string;
  star: { type: string; name: string };
  positions: SystemPosition[];
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

/** Maximum orbital positions displayed in a system (matches the client table). */
const MAX_SYSTEM_POSITIONS = 15;

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

  // Planet count: 2-9 planets per system (NMS-style)
  const planetCount = Math.floor(seededAt(sysHash, 1) * 8) + 2;

  const positions: SystemPosition[] = [];

  // Place planets in sequential orbital positions starting at 1
  for (let i = 0; i < planetCount; i++) {
    const pos = i + 1;
    const planetHash = fnv1a(`${baseKey}:planet-${pos}`);
    const planetClass = pickPlanetClass(seededAt(planetHash, 0));
    const hasMoon = seededAt(planetHash, 1) < 0.42;
    const planetName = generateName(fnv1a(`${baseKey}:pname-${pos}`));

    positions.push({
      position: pos,
      type: "planet",
      name: planetName,
      moon: hasMoon,
      class: planetClass,
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

  return { systemName, star: { type: starType, name: starName }, positions };
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

function isAuthenticated(req: Request, res: Response, next: Function) {
  if ((req.session as any)?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
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

        // Overlay real player data from DB.
        // Player coordinate format in DB: "[galaxy:sector:system:pos]" or "[galaxy:system:pos]"
        // We match any player whose coordinate starts with [galaxy: and contains :pos].
        // Pattern: [galaxy:sector:system:pos] where all params match.
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

          // Fetch usernames and alliance memberships for matched players
          const usernameMap: Record<string, string> = {};
          const allianceMap: Record<string, string> = {};

          if (userIds.length > 0) {
            for (const player of players) {
              const userRows = await db
                .select({ id: users.id, username: users.username })
                .from(users)
                .where(eq(users.id, player.userId))
                .limit(1);
              if (userRows[0]?.username) {
                usernameMap[player.userId] = userRows[0].username;
              }
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
              position: pos,
              type: "planet",
              name: player.planetName || `${owner}'s World`,
              owner,
              alliance,
              moon: existingPos?.moon,
              class: existingPos?.class || "M",
            };
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

        res.json({
          universe,
          galaxy,
          sector,
          system,
          systemName: generated.systemName,
          star: generated.star,
          positions,
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
        const userId = (req.session as any)?.userId as string;
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
