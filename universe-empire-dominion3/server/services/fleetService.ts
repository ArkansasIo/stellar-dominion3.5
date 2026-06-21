import { db } from "../db";
import { playerStates } from "../../shared/schema";
import { eq } from "drizzle-orm";

class FleetService {
  public async getFleet(userId: string) {
    const playerState = await db.query.playerStates.findFirst({
      where: eq(playerStates.userId, userId),
    });

    if (!playerState) {
      return {};
    }

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
}

export const fleetService = new FleetService();
