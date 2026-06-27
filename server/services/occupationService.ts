import { db } from "../db";
import { eq, sql, and } from "drizzle-orm";
import { playerStates, missions } from "../../shared/schema";

interface Occupation {
  planetId: string;
  planetName: string;
  galaxy: number;
  sector: number;
  system: number;
  position: number;
  occupiedBy: string;
  occupiedByName: string;
  occupationFleet: Record<string, number>;
  startedAt: number;
  tributeRate: number;
}

export class OccupationService {
  static getOccupations(state: any): Occupation[] {
    return state.occupations ?? [];
  }

  static getOccupying(state: any): Occupation[] {
    return state.occupying ?? [];
  }

  static async occupyPlanet(
    attackerId: string,
    attackerName: string,
    defenderId: string,
    coordinates: { galaxy: number; sector: number; system: number; position: number },
    fleetUsed: Record<string, number>,
  ): Promise<{ success: boolean; error?: string }> {
    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, defenderId)).limit(1);
    if (!defenderState) return { success: false, error: "Defender not found" };

    const defenderOccupations: Occupation[] = (defenderState.occupations as any) ?? [];
    const existingOcc = defenderOccupations.find(
      (o) => o.galaxy === coordinates.galaxy && o.sector === coordinates.sector &&
        o.system === coordinates.system && o.position === coordinates.position
    );
    if (existingOcc) return { success: false, error: "Planet is already occupied" };

    const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, attackerId)).limit(1);
    if (!attackerState) return { success: false, error: "Attacker not found" };

    const occupation: Occupation = {
      planetId: `${coordinates.galaxy}:${coordinates.sector}:${coordinates.system}:${coordinates.position}`,
      planetName: `Colony ${coordinates.position}`,
      galaxy: coordinates.galaxy,
      sector: coordinates.sector,
      system: coordinates.system,
      position: coordinates.position,
      occupiedBy: attackerId,
      occupiedByName: attackerName,
      occupationFleet: fleetUsed,
      startedAt: Date.now(),
      tributeRate: 0.5,
    };

    const newDefenderOccupations = [...defenderOccupations, occupation];
    const attackerOccupying: Occupation[] = (attackerState.occupying as any) ?? [];
    const newAttackerOccupying = [...attackerOccupying, occupation];

    await db.update(playerStates)
      .set({
        occupations: sql`jsonb_set(COALESCE(occupations, '[]'::jsonb), '{}', ${JSON.stringify(newDefenderOccupations)}::jsonb)`,
      })
      .where(eq(playerStates.userId, defenderId));

    await db.update(playerStates)
      .set({
        occupying: sql`jsonb_set(COALESCE(occupying, '[]'::jsonb), '{}', ${JSON.stringify(newAttackerOccupying)}::jsonb)`,
      })
      .where(eq(playerStates.userId, attackerId));

    return { success: true };
  }

  static async collectTribute(attackerId: string): Promise<{ success: boolean; tribute?: { metal: number; crystal: number; deuterium: number }; error?: string }> {
    const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, attackerId)).limit(1);
    if (!attackerState) return { success: false, error: "Attacker not found" };

    const occupying: Occupation[] = (attackerState.occupying as any) ?? [];
    if (occupying.length === 0) return { success: false, error: "No occupied planets" };

    let totalMetal = 0;
    let totalCrystal = 0;
    let totalDeuterium = 0;

    for (const occ of occupying) {
      const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, occ.occupiedBy)).limit(1);
      if (!defenderState) continue;

      const defenderResources = (defenderState.resources as any) ?? {};
      const tribute = {
        metal: Math.floor((defenderResources.metal ?? 0) * occ.tributeRate * 0.1),
        crystal: Math.floor((defenderResources.crystal ?? 0) * occ.tributeRate * 0.1),
        deuterium: Math.floor((defenderResources.deuterium ?? 0) * occ.tributeRate * 0.1),
      };

      totalMetal += tribute.metal;
      totalCrystal += tribute.crystal;
      totalDeuterium += tribute.deuterium;

      await db.update(playerStates)
        .set({
          resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
            ...defenderResources,
            metal: Math.max(0, (defenderResources.metal ?? 0) - tribute.metal),
            crystal: Math.max(0, (defenderResources.crystal ?? 0) - tribute.crystal),
            deuterium: Math.max(0, (defenderResources.deuterium ?? 0) - tribute.deuterium),
          })}::jsonb)`,
        })
        .where(eq(playerStates.userId, occ.occupiedBy));
    }

    const attackerResources = (attackerState.resources as any) ?? {};
    await db.update(playerStates)
      .set({
        resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
          ...attackerResources,
          metal: (attackerResources.metal ?? 0) + totalMetal,
          crystal: (attackerResources.crystal ?? 0) + totalCrystal,
          deuterium: (attackerResources.deuterium ?? 0) + totalDeuterium,
        })}::jsonb)`,
      })
      .where(eq(playerStates.userId, attackerId));

    return {
      success: true,
      tribute: { metal: totalMetal, crystal: totalCrystal, deuterium: totalDeuterium },
    };
  }

  static async revolt(defenderId: string, planetId: string): Promise<{ success: boolean; freed: boolean; error?: string }> {
    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, defenderId)).limit(1);
    if (!defenderState) return { success: false, freed: false, error: "Defender not found" };

    const occupations: Occupation[] = (defenderState.occupations as any) ?? [];
    const occIndex = occupations.findIndex((o) => o.planetId === planetId);
    if (occIndex === -1) return { success: false, freed: false, error: "Planet is not occupied" };

    const occupation = occupations[occIndex];
    const revoltChance = 0.3 + (occupation.occupationFleet ? 0 : 0.2);
    const roll = Math.random();

    if (roll < revoltChance) {
      const newOccupations = occupations.filter((_, i) => i !== occIndex);

      const [occupierState] = await db.select().from(playerStates).where(eq(playerStates.userId, occupation.occupiedBy)).limit(1);
      if (occupierState) {
        const occupierOccupying: Occupation[] = (occupierState.occupying as any) ?? [];
        const newOccupierOccupying = occupierOccupying.filter((o) => o.planetId !== planetId);

        await db.update(playerStates)
          .set({
            occupying: sql`jsonb_set(COALESCE(occupying, '[]'::jsonb), '{}', ${JSON.stringify(newOccupierOccupying)}::jsonb)`,
          })
          .where(eq(playerStates.userId, occupation.occupiedBy));
      }

      await db.update(playerStates)
        .set({
          occupations: sql`jsonb_set(COALESCE(occupations, '[]'::jsonb), '{}', ${JSON.stringify(newOccupations)}::jsonb)`,
        })
        .where(eq(playerStates.userId, defenderId));

      return { success: true, freed: true };
    }

    return { success: true, freed: false, error: "Revolt failed" };
  }

  static async removeOccupation(occupierId: string, planetId: string): Promise<{ success: boolean; error?: string }> {
    const [occupierState] = await db.select().from(playerStates).where(eq(playerStates.userId, occupierId)).limit(1);
    if (!occupierState) return { success: false, error: "Occupier not found" };

    const occupying: Occupation[] = (occupierState.occupying as any) ?? [];
    const occ = occupying.find((o) => o.planetId === planetId);
    if (!occ) return { success: false, error: "Occupation not found" };

    const newOccupierOccupying = occupying.filter((o) => o.planetId !== planetId);
    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, occ.occupiedBy)).limit(1);

    if (defenderState) {
    const defenderOccupations: Occupation[] = (defenderState.occupations as any) ?? [];
      const newDefenderOccupations = defenderOccupations.filter((o) => o.planetId !== planetId);

      await db.update(playerStates)
        .set({
          occupations: sql`jsonb_set(COALESCE(occupations, '[]'::jsonb), '{}', ${JSON.stringify(newDefenderOccupations)}::jsonb)`,
        })
        .where(eq(playerStates.userId, occ.occupiedBy));
    }

    await db.update(playerStates)
      .set({
        occupying: sql`jsonb_set(COALESCE(occupying, '[]'::jsonb), '{}', ${JSON.stringify(newOccupierOccupying)}::jsonb)`,
      })
      .where(eq(playerStates.userId, occupierId));

    return { success: true };
  }
}
