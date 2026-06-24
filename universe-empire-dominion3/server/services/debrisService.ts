import { db } from "../db";
import { battles, playerStates, missions, users } from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

const DEBRIS_RATES = {
  metal: 0.3,
  crystal: 0.15,
};

const UNIT_RESOURCE_COST: Record<string, { metal: number; crystal: number; deuterium: number }> = {
  smallCargo: { metal: 2000, crystal: 2000, deuterium: 0 },
  largeCargo: { metal: 6000, crystal: 6000, deuterium: 0 },
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
  battlecruiser: { metal: 30000, crystal: 40000, deuterium: 15000 },
  bomber: { metal: 50000, crystal: 25000, deuterium: 15000 },
  destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
  deathstar: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
  recycler: { metal: 10000, crystal: 6000, deuterium: 2000 },
  espionageProbe: { metal: 0, crystal: 1000, deuterium: 0 },
  solarSatellite: { metal: 0, crystal: 2000, deuterium: 500 },
  colonyShip: { metal: 10000, crystal: 20000, deuterium: 10000 },
  pathfinder: { metal: 8000, crystal: 12000, deuterium: 4000 },
};

const DEBRIS_FIELD_PREFIX = "debris_";

class DebrisService {
  async generateDebrisField(battleId: string): Promise<{ metal: number; crystal: number } | null> {
    const [battle] = await db.select().from(battles).where(eq(battles.id, battleId)).limit(1);
    if (!battle) return null;

    const attackerLosses = (battle.attackerLosses as Record<string, number>) || {};
    const defenderLosses = (battle.defenderLosses as Record<string, number>) || {};

    let totalMetal = 0;
    let totalCrystal = 0;

    for (const [unitType, count] of Object.entries(attackerLosses)) {
      const cost = UNIT_RESOURCE_COST[unitType];
      if (cost && count > 0) {
        totalMetal += Math.floor(cost.metal * count * DEBRIS_RATES.metal);
        totalCrystal += Math.floor(cost.crystal * count * DEBRIS_RATES.crystal);
      }
    }

    for (const [unitType, count] of Object.entries(defenderLosses)) {
      const cost = UNIT_RESOURCE_COST[unitType];
      if (cost && count > 0) {
        totalMetal += Math.floor(cost.metal * count * DEBRIS_RATES.metal);
        totalCrystal += Math.floor(cost.crystal * count * DEBRIS_RATES.crystal);
      }
    }

    const debris = { metal: totalMetal, crystal: totalCrystal };

    await db.update(battles).set({ debris }).where(eq(battles.id, battleId));

    return debris;
  }

  async getDebrisField(coordinates: string): Promise<{ metal: number; crystal: number } | null> {
    const recentBattles = await db
      .select()
      .from(battles)
      .where(
        sql`${battles.defenderCoordinates} = ${coordinates} AND ${battles.debris} IS NOT NULL AND ${battles.createdAt} > NOW() - INTERVAL '7 days'`
      )
      .orderBy(sql`${battles.createdAt} DESC`)
      .limit(1);

    if (!recentBattles.length) return null;
    return (recentBattles[0].debris as { metal: number; crystal: number }) || null;
  }

  async collectDebris(
    userId: string,
    recyclerCount: number,
    coordinates: string
  ): Promise<{ collected: { metal: number; crystal: number }; remaining: { metal: number; crystal: number } | null }> {
    const debris = await this.getDebrisField(coordinates);
    if (!debris || (debris.metal <= 0 && debris.crystal <= 0)) {
      throw new Error("No debris field found at these coordinates");
    }

    const RECYCLER_CARGO = 20000;
    const totalCapacity = recyclerCount * RECYCLER_CARGO;

    const totalDebris = debris.metal + debris.crystal;
    const metalRatio = debris.metal / Math.max(totalDebris, 1);
    const crystalRatio = debris.crystal / Math.max(totalDebris, 1);

    let collectedMetal = Math.min(debris.metal, Math.floor(totalCapacity * metalRatio));
    let collectedCrystal = Math.min(debris.crystal, Math.floor(totalCapacity * crystalRatio));

    const actualTotal = collectedMetal + collectedCrystal;
    if (actualTotal > totalCapacity) {
      const excess = actualTotal - totalCapacity;
      if (collectedMetal > collectedCrystal) {
        collectedMetal = Math.max(0, collectedMetal - excess);
      } else {
        collectedCrystal = Math.max(0, collectedCrystal - excess);
      }
    }

    const [playerState] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!playerState) throw new Error("Player state not found");

    const resources = (playerState.resources as any) || { metal: 0, crystal: 0, deuterium: 0 };
    resources.metal = (resources.metal || 0) + collectedMetal;
    resources.crystal = (resources.crystal || 0) + collectedCrystal;

    await db
      .update(playerStates)
      .set({ resources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    const remainingMetal = debris.metal - collectedMetal;
    const remainingCrystal = debris.crystal - collectedCrystal;
    const remaining = remainingMetal > 0 || remainingCrystal > 0
      ? { metal: remainingMetal, crystal: remainingCrystal }
      : null;

    if (!remaining) {
      await db
        .update(battles)
        .set({ debris: sql`NULL` })
        .where(
          and(
            eq(battles.defenderCoordinates, coordinates),
            sql`${battles.debris} IS NOT NULL`
          )
        );
    } else {
      await db
        .update(battles)
        .set({ debris: remaining })
        .where(
          and(
            eq(battles.defenderCoordinates, coordinates),
            sql`${battles.debris} IS NOT NULL`
          )
        );
    }

    return { collected: { metal: collectedMetal, crystal: collectedCrystal }, remaining };
  }

  async getRecyclerMissionStatus(userId: string): Promise<any[]> {
    return db
      .select()
      .from(missions)
      .where(
        and(
          eq(missions.userId, userId),
          eq(missions.type, "recycle"),
          sql`${missions.status} IN ('outbound', 'return')`
        )
      )
      .orderBy(sql`${missions.createdAt} DESC`);
  }
}

export const debrisService = new DebrisService();
