import { db } from "../db";
import { moonBases, moons, playerStates } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

const JUMP_GATE_DEUTERIUM_COST_PER_UNIT: Record<string, number> = {
  smallCargo: 50,
  largeCargo: 200,
  lightFighter: 10,
  heavyFighter: 30,
  cruiser: 100,
  battleship: 500,
  battlecruiser: 250,
  bomber: 400,
  destroyer: 600,
  deathstar: 10000,
  recycler: 100,
  espionageProbe: 1,
  solarSatellite: 5,
  colonyShip: 1000,
  pathfinder: 150,
};

interface JumpGateStatus {
  sourceMoonId: string;
  sourceMoonName: string;
  sourceCoordinates: string;
  targetMoonId: string;
  targetMoonName: string;
  targetCoordinates: string;
  sourceGateLevel: number;
  targetGateLevel: number;
  deuteriumCost: number;
  shipsToJump: Record<string, number>;
}

class JumpGateService {
  async getGateLevel(userId: string, moonId: string): Promise<number> {
    const [moonBase] = await db
      .select()
      .from(moonBases)
      .where(and(eq(moonBases.playerId, userId), eq((moonBases as any).moonId, moonId)))
      .limit(1) as any;

    if (!moonBase) return 0;
    const buildings = (moonBase.buildings as any) || {};
    return buildings.jumpGate || 0;
  }

  async getPlayerMoonsWithGate(userId: string): Promise<any[]> {
    const userMoons = (await db
      .select({
        moon: moons,
        base: moonBases,
      })
      .from(moonBases)
      .innerJoin(moons, eq((moonBases as any).moonId, moons.id))
      .where(eq(moonBases.playerId, userId))) as any[];

    return userMoons
      .filter((row) => {
        const buildings = (row.base.buildings as any) || {};
        return (buildings.jumpGate || 0) > 0;
      })
      .map((row) => ({
        id: row.moon.id,
        name: row.moon.name,
        coordinates: row.moon.coordinates,
        jumpGateLevel: ((row.base.buildings as any) || {}).jumpGate || 0,
      }));
  }

  calculateDeuteriumCost(ships: Record<string, number>): number {
    let totalCost = 0;
    for (const [shipType, count] of Object.entries(ships)) {
      const costPerUnit = JUMP_GATE_DEUTERIUM_COST_PER_UNIT[shipType];
      if (costPerUnit && count > 0) {
        totalCost += costPerUnit * count;
      }
    }
    return totalCost;
  }

  async jumpFleet(
    userId: string,
    sourceMoonId: string,
    targetMoonId: string,
    ships: Record<string, number>
  ): Promise<JumpGateStatus> {
    const sourceLevel = await this.getGateLevel(userId, sourceMoonId);
    if (sourceLevel < 1) throw new Error("Jump Gate not built on source moon");

    const targetLevel = await this.getGateLevel(userId, targetMoonId);
    if (targetLevel < 1) throw new Error("Jump Gate not built on target moon");

    const [sourceMoon] = await db
      .select()
      .from(moons)
      .where(eq(moons.id, sourceMoonId))
      .limit(1);
    if (!sourceMoon) throw new Error("Source moon not found");

    const [targetMoon] = await db
      .select()
      .from(moons)
      .where(eq(moons.id, targetMoonId))
      .limit(1);
    if (!targetMoon) throw new Error("Target moon not found");

    const deuteriumCost = this.calculateDeuteriumCost(ships);
    if (deuteriumCost <= 0) throw new Error("No ships to jump");

    const cooldownHours = Math.max(1, 10 - sourceLevel);
    const [playerState] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!playerState) throw new Error("Player state not found");

    const resources = (playerState.resources as any) || {};
    const currentDeuterium = resources.deuterium || 0;
    if (currentDeuterium < deuteriumCost) {
      throw new Error(`Not enough deuterium. Required: ${deuteriumCost}, Available: ${currentDeuterium}`);
    }

    const currentFleet = (playerState.units as Record<string, number>) || {};
    for (const [shipType, count] of Object.entries(ships)) {
      const current = currentFleet[shipType] || 0;
      if (current < count) {
        throw new Error(`Not enough ${shipType}. Have: ${current}, Need: ${count}`);
      }
      currentFleet[shipType] = current - count;
    }

    const targetFleet = { ...((playerState as any).targetFleet || {}) };
    for (const [shipType, count] of Object.entries(ships)) {
      targetFleet[shipType] = (targetFleet[shipType] || 0) + count;
    }

    resources.deuterium = currentDeuterium - deuteriumCost;
    resources.lastJumpGateUse = Date.now();
    resources.jumpGateCooldownUntil = new Date(Date.now() + cooldownHours * 3600 * 1000);

    await db
      .update(playerStates)
      .set({
        units: currentFleet,
        resources,
        updatedAt: new Date(),
      })
      .where(eq(playerStates.userId, userId));

    const sMoon = sourceMoon as any;
    const tMoon = targetMoon as any;
    return {
      sourceMoonId,
      sourceMoonName: sMoon.name || "Unknown",
      sourceCoordinates: sMoon.coordinates || "",
      targetMoonId,
      targetMoonName: tMoon.name || "Unknown",
      targetCoordinates: tMoon.coordinates || "",
      sourceGateLevel: sourceLevel,
      targetGateLevel: targetLevel,
      deuteriumCost,
      shipsToJump: ships,
    };
  }
}

export const jumpGateService = new JumpGateService();
