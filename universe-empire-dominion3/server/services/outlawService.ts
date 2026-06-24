import { db } from "../db";
import { playerStates, users, battles } from "../../shared/schema";
import { eq, and, sql, desc, lt, gte } from "drizzle-orm";

const OUTLAW_THRESHOLD_RATIO = 0.25;
const OUTLAW_ATTACKS_TO_BECOME_OUTLAW = 3;
const OUTLAW_DURATION_HOURS = 48;
const OUTLAW_PENALTY_MULTIPLIER = 0.5;
const NORMAL_PLAYER_POINTS_MIN = 5000;

class OutlawService {
  async getPlayerPoints(userId: string): Promise<number> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);
    if (!state) return 0;
    const resources = (state.resources as any) || {};
    const units = (state.units as any) || {};
    const buildings = (state.buildings as any) || {};

    const resourceValue = (resources.metal || 0) + (resources.crystal || 0) * 1.5 + (resources.deuterium || 0) * 3;
    const fleetValue = Object.values(units).reduce((sum: number, v: any) => sum + (typeof v === "number" ? v : 0), 0) * 1000;
    const buildingValue = Object.values(buildings).reduce((sum: number, v: any) => sum + (typeof v === "number" ? v : 0), 0) * 500;

    return Math.floor(resourceValue + fleetValue + buildingValue);
  }

  async isOutlaw(userId: string): Promise<boolean> {
    const [state] = await db
      .select({ outlawUntil: (playerStates as any).outlawUntil })
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);
    if (!state) return false;
    const outlawUntil = (state as any).outlawUntil;
    return outlawUntil ? new Date(outlawUntil) > new Date() : false;
  }

  async recordAttack(attackerId: string, defenderId: string): Promise<void> {
    const attackerPoints = await this.getPlayerPoints(attackerId);
    const defenderPoints = await this.getPlayerPoints(defenderId);

    if (defenderPoints < NORMAL_PLAYER_POINTS_MIN) return;
    if (defenderPoints >= attackerPoints) return;

    const ratio = defenderPoints / Math.max(attackerPoints, 1);
    if (ratio > OUTLAW_THRESHOLD_RATIO) return;

    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, attackerId))
      .limit(1);
    if (!state) return;

    const currentAttacks = (state as any).outlawAttacks || 0;
    const newCount = currentAttacks + 1;

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };
    (updateData as any).outlawAttacks = newCount;

    if (newCount >= OUTLAW_ATTACKS_TO_BECOME_OUTLAW) {
      const outlawUntil = new Date(Date.now() + OUTLAW_DURATION_HOURS * 3600 * 1000);
      (updateData as any).outlawUntil = outlawUntil;
      (updateData as any).outlawAttacks = 0;
    }

    await db
      .update(playerStates)
      .set(updateData)
      .where(eq(playerStates.userId, attackerId));
  }

  getOutlawPenaltyMultiplier(): number {
    return OUTLAW_PENALTY_MULTIPLIER;
  }

  async getOutlawStatus(userId: string): Promise<{
    isOutlaw: boolean;
    outlawUntil: string | null;
    remainingHours: number;
    recentAttacksOnWeaker: number;
  }> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) {
      return { isOutlaw: false, outlawUntil: null, remainingHours: 0, recentAttacksOnWeaker: 0 };
    }

    const outlawUntil = (state as any).outlawUntil;
    const isOutlaw = outlawUntil ? new Date(outlawUntil) > new Date() : false;
    const remainingHours = isOutlaw
      ? Math.max(0, Math.ceil((new Date(outlawUntil).getTime() - Date.now()) / 3600000))
      : 0;

    return {
      isOutlaw,
      outlawUntil: outlawUntil || null,
      remainingHours,
      recentAttacksOnWeaker: (state as any).outlawAttacks || 0,
    };
  }

  async getActiveOutlaws(): Promise<any[]> {
    const now = new Date();
    const outlaws = await db
      .select({
        userId: playerStates.userId,
        outlawUntil: (playerStates as any).outlawUntil,
      })
      .from(playerStates)
      .where(
        and(
          sql`${(playerStates as any).outlawUntil} IS NOT NULL`,
          sql`${(playerStates as any).outlawUntil} > ${now}`
        )
      );

    const result = [];
    for (const outlaw of outlaws) {
      const [user] = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, outlaw.userId))
        .limit(1);
      if (user) {
        result.push({
          userId: outlaw.userId,
          username: user.username,
          outlawUntil: outlaw.outlawUntil,
        });
      }
    }
    return result;
  }
}

export const outlawService = new OutlawService();
