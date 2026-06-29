import { db } from "../db";
import { playerStates, missions, battles } from "../../Source/Shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { simulateBattle } from "../combat";
import { OGameShipDatabase } from "../combat/BattleEngine";
import {
  parseCoordinates, calculateDistance, calculateTravelTime,
  calculateFuelConsumption, getFleetSpeed,
  OGameShipSpeeds, OGameShipFuel,
} from "./ogameTravelService";

interface DeployResult {
  success: boolean;
  message: string;
  units?: Record<string, number>;
  targetCoordinates?: string;
  arrivalTime?: string;
  fuelCost?: number;
}

interface BattleResultSummary {
  success: boolean;
  message: string;
  winner: "attacker" | "defender" | "draw";
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  loot: { metal: number; crystal: number; deuterium: number };
  debris: { metal: number; crystal: number; deuterium: number };
  moonChance: number;
  moonCreated: boolean;
  rounds: number;
  battleLog: string[];
}

class FleetMissionService {
  async deployFleet(
    userId: string,
    units: Record<string, number>,
    targetCoordinates: string,
    missionType: "deploy" | "transport" | "attack" | "destroy" | "espionage" | "colonize",
    fleetSpeedPercent: number = 100,
  ): Promise<DeployResult> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) throw new Error("Player state not found");

    const currentFleet = (state.units as Record<string, number>) || {};

    for (const [unitType, count] of Object.entries(units)) {
      const available = currentFleet[unitType] || 0;
      if (count > available) {
        return {
          success: false,
          message: `Not enough ${unitType}. Available: ${available}, Required: ${count}`,
        };
      }
    }

    const origin = parseCoordinates("1:1:1");
    const target = parseCoordinates(targetCoordinates);
    const distance = calculateDistance(origin, target);
    const slowestSpeed = getFleetSpeed(units, OGameShipSpeeds);
    const travelTimeMs = calculateTravelTime(distance, slowestSpeed, fleetSpeedPercent, false);
    const returnTravelTimeMs = calculateTravelTime(distance, slowestSpeed, fleetSpeedPercent, true);

    let totalFuel = 0;
    for (const [unitId, count] of Object.entries(units)) {
      if (count > 0 && OGameShipFuel[unitId] !== undefined) {
        totalFuel += calculateFuelConsumption(distance, OGameShipSpeeds[unitId] || 1000, OGameShipFuel[unitId], count, fleetSpeedPercent);
      }
    }

    const fuelResource = currentFleet.deuterium || 0;
    if (totalFuel > fuelResource) {
      return {
        success: false,
        message: `Not enough deuterium for fuel. Need: ${totalFuel}, Available: ${fuelResource}`,
      };
    }

    for (const [unitType, count] of Object.entries(units)) {
      currentFleet[unitType] = (currentFleet[unitType] || 0) - count;
    }
    currentFleet.deuterium = Math.max(0, (currentFleet.deuterium || 0) - totalFuel);

    await db
      .update(playerStates)
      .set({ units: currentFleet, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    const departureTime = new Date();
    const arrivalTime = new Date(departureTime.getTime() + travelTimeMs);

    await db.insert(missions).values({
      userId,
      type: missionType,
      status: "outbound",
      target: targetCoordinates,
      origin: "1:1:1",
      units,
      departureTime,
      arrivalTime,
      returnTime: new Date(arrivalTime.getTime() + returnTravelTimeMs),
      processed: false,
    });

    return {
      success: true,
      message: `Fleet dispatched on ${missionType} mission to ${targetCoordinates}. ETA: ${Math.ceil(travelTimeMs / 1000)}s. Fuel: ${totalFuel} deuterium.`,
      units,
      targetCoordinates,
      arrivalTime: arrivalTime.toISOString(),
      fuelCost: totalFuel,
    };
  }

  async processArrivedMissions(): Promise<number> {
    const now = new Date();
    const arrivedMissions = await db
      .select()
      .from(missions)
      .where(
        and(
          sql`${missions.arrivalTime} <= ${now}`,
          eq(missions.status, "outbound"),
          eq(missions.processed, false),
        )
      );

    let processed = 0;
    for (const mission of arrivedMissions) {
      try {
        const units = mission.units as Record<string, number>;

        if (mission.type === "deploy" || mission.type === "transport") {
          await this.processDeployOrTransport(mission, units);
          processed++;
        } else if (mission.type === "attack") {
          await this.processAttack(mission, units);
          processed++;
        } else if (mission.type === "espionage") {
          await this.processEspionage(mission, units);
          processed++;
        } else if (mission.type === "destroy") {
          await this.processDestroy(mission, units);
          processed++;
        }
      } catch (err) {
        console.error(`[FleetMission] Error processing mission ${mission.id}:`, err);
        await db
          .update(missions)
          .set({ status: "completed", processed: true, returnTime: now })
          .where(eq(missions.id, mission.id));
        processed++;
      }
    }

    return processed;
  }

  private async processDeployOrTransport(mission: any, units: Record<string, number>): Promise<void> {
    const now = new Date();
    const [targetState] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, mission.userId))
      .limit(1);

    if (targetState) {
      const targetUnits = (targetState.units as Record<string, number>) || {};
      for (const [unitType, count] of Object.entries(units)) {
        targetUnits[unitType] = (targetUnits[unitType] || 0) + count;
      }
      await db
        .update(playerStates)
        .set({ units: targetUnits, updatedAt: now })
        .where(eq(playerStates.userId, mission.userId));
    }

    await db
      .update(missions)
      .set({ status: "completed", processed: true, returnTime: now })
      .where(eq(missions.id, mission.id));
  }

  private async processAttack(mission: any, attackerUnits: Record<string, number>): Promise<void> {
    const now = new Date();
    const attackerId = mission.userId;

    const [defenderState] = await db
      .select()
      .from(playerStates)
      .where(sql`${playerStates.userId} != ${attackerId}`)
      .limit(1);

    if (!defenderState) {
      await db
        .update(missions)
        .set({ status: "completed", processed: true, returnTime: now })
        .where(eq(missions.id, mission.id));
      return;
    }

    const defenderUnits = (defenderState.units as Record<string, number>) || {};
    const defenderResources = (defenderState.resources as { metal?: number; crystal?: number; deuterium?: number }) || {};

    const attackerFleetUnits = Object.entries(attackerUnits)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const stats = OGameShipDatabase[id];
        if (!stats) return null;
        return {
          config: {
            unitId: stats.id,
            unitName: stats.name,
            machineName: stats.machineName,
            structuralIntegrity: stats.structuralIntegrity,
            shieldPoints: stats.shield,
            attackPower: stats.attack,
            cargoCapacity: stats.cargoCapacity,
            unitType: stats.unitType,
            rapidfire: stats.rapidfire,
          },
          count,
        };
      })
      .filter(Boolean) as any[];

    const defenderFleetUnits = Object.entries(defenderUnits)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const stats = OGameShipDatabase[id];
        if (!stats) return null;
        return {
          config: {
            unitId: stats.id,
            unitName: stats.name,
            machineName: stats.machineName,
            structuralIntegrity: stats.structuralIntegrity,
            shieldPoints: stats.shield,
            attackPower: stats.attack,
            cargoCapacity: stats.cargoCapacity,
            unitType: stats.unitType,
            rapidfire: stats.rapidfire,
          },
          count,
        };
      })
      .filter(Boolean) as any[];

    const result = simulateBattle({
      attackers: [{
        fleetMissionId: mission.id,
        ownerId: attackerId,
        units: attackerFleetUnits,
        weaponTech: 0,
        shieldTech: 0,
        armorTech: 0,
      }],
      defenders: [{
        fleetMissionId: "planet_defense",
        ownerId: defenderState.userId,
        units: defenderFleetUnits,
        weaponTech: 0,
        shieldTech: 0,
        armorTech: 0,
      }],
      defenderResources: {
        metal: defenderResources.metal || 0,
        crystal: defenderResources.crystal || 0,
        deuterium: defenderResources.deuterium || 0,
      },
    });

    // Apply losses to defender
    const updatedDefenderUnits = { ...defenderUnits };
    for (const [unitType, loss] of Object.entries(result.defenderUnitsLost)) {
      updatedDefenderUnits[unitType] = Math.max(0, (updatedDefenderUnits[unitType] || 0) - loss);
    }
    // Add repaired defenses back
    for (const [unitType, repaired] of Object.entries(result.repairedDefenses)) {
      updatedDefenderUnits[unitType] = (updatedDefenderUnits[unitType] || 0) + repaired;
    }
    const newResources = { ...defenderResources };
    if (result.winner === "attacker") {
      newResources.metal = Math.max(0, (newResources.metal || 0) - result.loot.metal);
      newResources.crystal = Math.max(0, (newResources.crystal || 0) - result.loot.crystal);
      newResources.deuterium = Math.max(0, (newResources.deuterium || 0) - result.loot.deuterium);
    }

    await db
      .update(playerStates)
      .set({ units: updatedDefenderUnits, resources: newResources as any, updatedAt: now })
      .where(eq(playerStates.userId, defenderState.userId));

    // Store battle result
    await db.insert(battles).values({
      attackerId,
      defenderId: defenderState.userId,
      type: "attack",
      status: "completed",
      attackerCoordinates: mission.origin || "1:1:1",
      defenderCoordinates: mission.target || "1:1:1",
      winner: result.winner,
      attackerFleet: attackerUnits,
      defenderFleet: defenderUnits,
      attackerLosses: result.attackerUnitsLost,
      defenderLosses: result.defenderUnitsLost,
      loot: result.loot,
      debris: result.debris,
      rounds: result.rounds.length,
      completedAt: now,
    });

    // Mark mission as completed - fleet will return via processReturnedMissions
    await db
      .update(missions)
      .set({ status: "completed", processed: true, returnTime: now })
      .where(eq(missions.id, mission.id));
  }

  private async processEspionage(mission: any, units: Record<string, number>): Promise<void> {
    const now = new Date();
    await db
      .update(missions)
      .set({ status: "completed", processed: true, returnTime: now })
      .where(eq(missions.id, mission.id));
  }

  private async processDestroy(mission: any, units: Record<string, number>): Promise<void> {
    const now = new Date();
    await db
      .update(missions)
      .set({ status: "completed", processed: true, returnTime: now })
      .where(eq(missions.id, mission.id));
  }

  async processReturnedMissions(): Promise<number> {
    const now = new Date();
    const returnedMissions = await db
      .select()
      .from(missions)
      .where(
        and(
          sql`${missions.returnTime} <= ${now}`,
          eq(missions.status, "return"),
          eq(missions.processed, false),
        )
      );

    let processed = 0;
    for (const mission of returnedMissions) {
      try {
        const units = mission.units as Record<string, number>;
        const [state] = await db
          .select()
          .from(playerStates)
          .where(eq(playerStates.userId, mission.userId))
          .limit(1);

        if (state) {
          const currentUnits = (state.units as Record<string, number>) || {};
          for (const [unitType, count] of Object.entries(units)) {
            currentUnits[unitType] = (currentUnits[unitType] || 0) + count;
          }

          let losses: Record<string, number> = {};
          if ((mission as any).losses) {
            losses = (mission as any).losses as Record<string, number>;
            for (const [unitType, count] of Object.entries(losses)) {
              currentUnits[unitType] = Math.max(0, (currentUnits[unitType] || 0) - count);
            }
          }

          await db
            .update(playerStates)
            .set({ units: currentUnits, updatedAt: new Date() })
            .where(eq(playerStates.userId, mission.userId));
        }

        await db
          .update(missions)
          .set({ status: "completed", processed: true })
          .where(eq(missions.id, mission.id));
        processed++;
      } catch (err) {
        console.error(`[FleetMission] Error processing return ${mission.id}:`, err);
      }
    }

    return processed;
  }

  async recallFleet(userId: string, missionId: string): Promise<{ success: boolean; message: string }> {
    const [mission] = await db
      .select()
      .from(missions)
      .where(and(eq(missions.id, missionId), eq(missions.userId, userId)))
      .limit(1);

    if (!mission) return { success: false, message: "Mission not found" };
    if (mission.status !== "outbound") return { success: false, message: "Cannot recall mission in current state" };

    const now = new Date();
    const elapsed = now.getTime() - mission.departureTime.getTime();
    const total = mission.arrivalTime.getTime() - mission.departureTime.getTime();
    const progress = Math.min(1, elapsed / Math.max(total, 1));
    const returnTravelTime = Math.floor(total * progress);
    const returnArrival = new Date(now.getTime() + returnTravelTime);

    await db
      .update(missions)
      .set({ status: "return", returnTime: returnArrival })
      .where(eq(missions.id, missionId));

    return {
      success: true,
      message: `Fleet recalled. Returning in ${Math.ceil(returnTravelTime / 1000)}s.`,
    };
  }

  async getActiveMissions(userId: string): Promise<any[]> {
    return db
      .select()
      .from(missions)
      .where(
        and(
          eq(missions.userId, userId),
          sql`${missions.status} IN ('outbound', 'return')`,
        )
      )
      .orderBy(sql`${missions.arrivalTime} ASC`);
  }
}

export const fleetMissionService = new FleetMissionService();
