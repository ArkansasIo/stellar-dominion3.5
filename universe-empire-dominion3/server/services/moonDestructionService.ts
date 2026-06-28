import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../../shared/schema";

export class MoonDestructionService {
  static getDestructionChance(moonDiameter: number, deathstarCount: number): number {
    return (100 - Math.sqrt(moonDiameter)) * Math.sqrt(deathstarCount);
  }

  static getDeathstarLossChance(moonDiameter: number): number {
    return Math.sqrt(moonDiameter) / 2;
  }

  static async attemptMoonDestruction(
    attackerId: string,
    defenderId: string,
    moonId: string,
    deathstarCount: number,
  ): Promise<{
    success: boolean;
    moonDestroyed: boolean;
    deathstarsLost: number;
    message: string;
  }> {
    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, defenderId)).limit(1);
    if (!defenderState) return { success: false, moonDestroyed: false, deathstarsLost: 0, message: "Defender not found" };

    const moonsData = defenderState.moonsData ?? {};
    const moonEntry = Object.entries(moonsData).find(([id, _m]: any) => id === moonId || (_m as any).id === moonId);
    if (!moonEntry) return { success: false, moonDestroyed: false, deathstarsLost: 0, message: "Moon not found" };

    const [moonKey, moonValue] = moonEntry as [string, any];
    const moonDiameter = moonValue.diameter ?? moonValue.size ?? 5000;

    const destructionChance = this.getDestructionChance(moonDiameter, deathstarCount);
    const lossChance = this.getDeathstarLossChance(moonDiameter);

    const roll = Math.random() * 100;
    const moonDestroyed = roll < destructionChance;

    const dsLossRoll = Math.random() * 100;
    let deathstarsLost = 0;
    if (dsLossRoll < lossChance) {
      deathstarsLost = deathstarCount;
    }

    if (moonDestroyed) {
      const newMoonsData = { ...moonsData };
      delete newMoonsData[moonKey];

      await db.update(playerStates)
        .set({
          moonsData: sql`jsonb_set(COALESCE(moonsData, '{}'::jsonb), '{}', ${JSON.stringify(newMoonsData)}::jsonb)`,
        })
        .where(eq(playerStates.userId, defenderId));
    }

    if (deathstarsLost > 0) {
      const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, attackerId)).limit(1);
      if (attackerState) {
        const attackerUnits = { ...(attackerState.units ?? {}) };
        attackerUnits.deathstar = Math.max(0, (attackerUnits.deathstar ?? 0) - deathstarsLost);
        await db.update(playerStates)
          .set({
            units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(attackerUnits)}::jsonb)`,
          })
          .where(eq(playerStates.userId, attackerId));
      }
    }

    const message = moonDestroyed
      ? `Moon destroyed! Moon diameter: ${moonDiameter}km, destruction chance: ${destructionChance.toFixed(1)}%. ${deathstarsLost > 0 ? `${deathstarsLost} Deathstar(s) lost.` : "No Deathstars lost."}`
      : `Moon survived! Moon diameter: ${moonDiameter}km, destruction chance: ${destructionChance.toFixed(1)}%. ${deathstarsLost > 0 ? `${deathstarsLost} Deathstar(s) lost.` : "No Deathstars lost."}`;

    return { success: true, moonDestroyed, deathstarsLost, message };
  }
}
