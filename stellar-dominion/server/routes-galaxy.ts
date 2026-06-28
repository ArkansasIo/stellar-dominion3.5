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

type ScanReport = {
  targetName: string;
  targetType: SystemObjectType;
  threatLevel: "low" | "medium" | "high";
  anomalies: string[];
  estimatedResources: { metal: number; crystal: number; deuterium: number };
  timestamp: number;
};

/** Deterministic seeded random: same inputs always produce the same output. */
function seededRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

const PLANET_CLASSES = ["M", "H", "L", "K", "Y", "D", "J", "T"];

function generateSystemPosition(
  universe: string,
  galaxy: number,
  sector: number,
  system: number,
  pos: number,
): SystemPosition {
  const seed = (universe.length * 17 + galaxy * 1000 + sector * 100 + system + pos) * 1.1;
  const r = seededRandom(seed);

  if (r > 0.95)
    return {
      position: pos,
      type: "blackhole",
      name: "Singularity",
      debris: { metal: 50000, crystal: 50000 },
    };
  if (r > 0.90)
    return { position: pos, type: "nebula", name: "Ion Cloud" };
  if (r > 0.85)
    return {
      position: pos,
      type: "asteroid",
      name: "Asteroid Field",
      debris: { metal: Math.floor(r * 10000), crystal: Math.floor(r * 4000) },
    };
  if (r > 0.80)
    return { position: pos, type: "station", name: "Pirate Outpost", owner: "Pirates" };
  if (r > 0.60) {
    const classIdx = Math.floor(r * PLANET_CLASSES.length);
    const ownerSeed = seededRandom(seed * 1.7);
    return {
      position: pos,
      type: "planet",
      name: `Colony ${pos}`,
      owner: `Explorer-${Math.floor(ownerSeed * 9000 + 1000)}`,
      alliance: ownerSeed > 0.7 ? `TAG${Math.floor(ownerSeed * 900)}` : undefined,
      moon: r > 0.75,
      class: PLANET_CLASSES[classIdx % PLANET_CLASSES.length],
    };
  }

  return { position: pos, type: "empty", name: "" };
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
  const seed = (universe.length * 19 + galaxy * 1000 + sector * 100 + system + position) * 1.3;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed * 1.37);
  const r3 = seededRandom(seed * 1.91);

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
    const roll = seededRandom(seed + index * 11);
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
   * Returns 16 canonical position entries for the given system.
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

        // Generate base positions 1-16
        const positions: SystemPosition[] = Array.from({ length: 16 }, (_, i) =>
          generateSystemPosition(universe, galaxy, sector, system, i + 1),
        );

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
            if (isNaN(pos) || pos < 1 || pos > 16) continue;

            const idx = pos - 1;
            const owner = usernameMap[player.userId] || `Player-${player.userId.slice(0, 6)}`;
            const alliance = allianceMap[player.userId];
            positions[idx] = {
              position: pos,
              type: "planet",
              name: player.planetName || `${owner}'s World`,
              owner,
              alliance,
              moon: positions[idx].moon,
              class: positions[idx].class || "M",
            };
          }
        } catch {
          // DB lookup failure is non-fatal; fall back to generated data
        }

        res.json({ universe, galaxy, sector, system, positions });
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
          position > 16
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
