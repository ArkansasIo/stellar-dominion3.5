import { db } from "../db";
import { playerStates, missions, users } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

interface DeployResult {
  success: boolean;
  message: string;
  units?: Record<string, number>;
  targetCoordinates?: string;
  arrivalTime?: string;
}

interface DestroyResult {
  success: boolean;
  message: string;
  defenderDefensesDestroyed?: Record<string, number>;
  attackerLosses?: Record<string, number>;
}

class FleetMissionService {
  async deployFleet(
    userId: string,
    units: Record<string, number>,
    targetCoordinates: string,
    missionType: "deploy" | "transport" | "attack" | "destroy"
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

    for (const [unitType, count] of Object.entries(units)) {
      currentFleet[unitType] = (currentFleet[unitType] || 0) - count;
    }

    await db
      .update(playerStates)
      .set({ units: currentFleet, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    const travelTimeMs = 5 * 60 * 1000;
    const departureTime = new Date();
    const arrivalTime = new Date(departureTime.getTime() + travelTimeMs);

    await db.insert(missions).values({
      userId,
      type: missionType,
      status: "outbound",
      target: targetCoordinates,
      origin: targetCoordinates,
      units,
      departureTime,
      arrivalTime,
      returnTime: new Date(arrivalTime.getTime() + travelTimeMs),
      processed: false,
    });

    return {
      success: true,
      message: `Fleet dispatched on ${missionType} mission to ${targetCoordinates}`,
      units,
      targetCoordinates,
      arrivalTime: arrivalTime.toISOString(),
    };
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
      message: "Fleet recalled. Returning to origin.",
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
        const origin = mission.origin;

        if (mission.type === "deploy" || mission.type === "transport") {
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
              .set({ units: targetUnits, updatedAt: new Date() })
              .where(eq(playerStates.userId, mission.userId));

            await db
              .update(missions)
              .set({ status: "completed", processed: true, returnTime: now })
              .where(eq(missions.id, mission.id));
            processed++;
          }
        } else if (mission.type === "destroy") {
          await db
            .update(missions)
            .set({ status: "completed", processed: true, returnTime: now })
            .where(eq(missions.id, mission.id));
          processed++;
        }
      } catch (err) {
        console.error(`[FleetMission] Error processing mission ${mission.id}:`, err);
      }
    }

    return processed;
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
