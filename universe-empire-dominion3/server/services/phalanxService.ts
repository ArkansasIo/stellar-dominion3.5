import { db } from "../db";
import { playerStates, moonBases, moons, missions, users } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

const PHALANX_RANGE_PER_LEVEL = 1;
const PHALANX_DEUTERIUM_COST_PER_SCAN = 5000;

interface PhalanxScanResult {
  moonId: string;
  moonName: string;
  coordinates: string;
  phalanxLevel: number;
  scanRange: number;
  detectedFleets: {
    missionId: string;
    userId: string;
    username: string;
    missionType: string;
    origin: string;
    target: string;
    units: Record<string, number>;
    arrivalTime: string;
    departureTime: string;
  }[];
}

class PhalanxService {
  async getPhalanxLevel(userId: string, moonId: string): Promise<number> {
    const [moonBase] = await db
      .select()
      .from(moonBases)
      .where(
        and(eq(moonBases.playerId, userId), eq((moonBases as any).moonId, moonId))
      )
      .limit(1) as any;

    if (!moonBase) return 0;
    const buildings = (moonBase.buildings as any) || {};
    return buildings.sensorPhalanx || 0;
  }

  async scanFleets(
    userId: string,
    moonId: string,
    targetCoordinates: string
  ): Promise<PhalanxScanResult> {
    const phalanxLevel = await this.getPhalanxLevel(userId, moonId);
    if (phalanxLevel < 1) {
      throw new Error("Sensor Phalanx not built on this moon");
    }

    const [moon] = await db
      .select()
      .from(moons)
      .where(eq(moons.id, moonId))
      .limit(1);
    if (!moon) throw new Error("Moon not found");

    const moonData = moon as any;
    const moonCoords = moonData.coordinates || "";
    const scanRange = phalanxLevel * PHALANX_RANGE_PER_LEVEL;

    if (!this.isInRange(moonCoords, targetCoordinates, scanRange)) {
      throw new Error(`Target coordinates out of Sensor Phalanx range (max ${scanRange} system${scanRange > 1 ? 's' : ''})`);
    }

    const [playerState] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (playerState) {
      const resources = (playerState.resources as any) || {};
      const deuterium = resources.deuterium || 0;

      if (deuterium < PHALANX_DEUTERIUM_COST_PER_SCAN) {
        throw new Error(`Not enough deuterium. Required: ${PHALANX_DEUTERIUM_COST_PER_SCAN}, Available: ${deuterium}`);
      }

      resources.deuterium = deuterium - PHALANX_DEUTERIUM_COST_PER_SCAN;
      await db
        .update(playerStates)
        .set({ resources, updatedAt: new Date() })
        .where(eq(playerStates.userId, userId));
    }

    const inTransitMissions = await db
      .select({
        id: missions.id,
        userId: missions.userId,
        type: missions.type,
        origin: missions.origin,
        target: missions.target,
        units: missions.units,
        arrivalTime: missions.arrivalTime,
        departureTime: missions.departureTime,
      })
      .from(missions)
      .where(
        and(
          sql`${missions.target} = ${targetCoordinates}`,
          sql`${missions.status} = 'outbound'`,
          sql`${missions.arrivalTime} > NOW()`
        )
      );

    const detectedFleets = [];

    for (const mission of inTransitMissions) {
      const [user] = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, mission.userId))
        .limit(1);

      detectedFleets.push({
        missionId: mission.id,
        userId: mission.userId,
        username: user?.username || "Unknown",
        missionType: mission.type,
        origin: mission.origin,
        target: mission.target,
        units: mission.units as Record<string, number>,
        arrivalTime: mission.arrivalTime?.toISOString() || "",
        departureTime: mission.departureTime?.toISOString() || "",
      });
    }

    return {
      moonId,
      moonName: moonData.name || "Unknown Moon",
      coordinates: moonCoords,
      phalanxLevel,
      scanRange,
      detectedFleets,
    };
  }

  private isInRange(fromCoords: string, toCoords: string, maxRange: number): boolean {
    const parse = (c: string) => c.split(":").map(Number);
    const from = parse(fromCoords);
    const to = parse(toCoords);
    if (from.length < 3 || to.length < 3) return false;
    return Math.abs(from[1] - to[1]) <= maxRange && from[0] === to[0];
  }
}

export const phalanxService = new PhalanxService();
