import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq } from "drizzle-orm";
import {
  fleetDistance,
  flightDuration,
  deuteriumConsumption,
  cargoCapacity,
  plunderResources,
  shipSpeed,
} from "../../shared/config/ogameFormulas";

export interface FleetCoordinate {
  galaxy: number;
  system: number;
  position: number;
}

export interface FleetCalcResult {
  distance: number;
  durationSeconds: number;
  deuterium: number;
  cargo: number;
}

class FleetService {
  public async getFleet(userId: string) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    if (!playerState) return {};
    return (playerState.units as any) || {};
  }

  public async updateFleet(userId: string, units: Record<string, number>) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });
    if (!playerState) return null;
    const current = (playerState.units as any) || {};
    const newUnits = { ...current, ...units };
    await db
      .update(playerStates)
      .set({ units: newUnits, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));
    return newUnits;
  }

  public async getFleetStrength(userId: string): Promise<number> {
    const fleet = await this.getFleet(userId);
    return Object.values(fleet).reduce((sum: number, count: any) => sum + (typeof count === "number" ? count : 0), 0);
  }

  /**
   * Calculate OGame-style fleet mission parameters.
   * @param shipBaseSpeed - base speed of the slowest ship in fleet
   * @param shipConsumption - deuterium consumption of the fleet
   * @param driveLevel - current drive technology level (combustion/impulse/hyperspace)
   * @param speedPercent - 1–10 (10 = 100%)
   * @param speedFactor - game speed multiplier
   * @param totalCargo - sum of all ships' cargo capacity
   */
  public calculateFleetMission(
    from: FleetCoordinate,
    to: FleetCoordinate,
    shipBaseSpeed: number,
    driveLevel: number,
    speedPercent: number = 10,
    speedFactor: number = 1,
    totalCargo: number = 0,
  ): FleetCalcResult {
    const dist = fleetDistance(from, to);
    const spd = shipSpeed(shipBaseSpeed, driveLevel);
    const duration = flightDuration(dist, spd, speedPercent, speedFactor);
    const deut = deuteriumConsumption(1, dist, shipBaseSpeed, spd);
    return {
      distance: dist,
      durationSeconds: duration,
      deuterium: deut,
      cargo: totalCargo,
    };
  }
}

export const fleetService = new FleetService();
export { fleetDistance, flightDuration, deuteriumConsumption, cargoCapacity, plunderResources, shipSpeed };
