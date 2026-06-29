import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../../Source/Shared/schema";
import { OGAME_CATALOG_ENTRY_MAP } from "../../Source/Shared/config/ogameCatalogConfig";

const MISSILE_SILO_ID = "missileSilo";
const ABM_ID = "antiBallisticMissile";
const IPM_ID = "interplanetaryMissile";

function getLevel(state: any, buildingId: string): number {
  return state.buildings?.[buildingId] ?? 0;
}

function getDefenseCount(state: any, defenseId: string): number {
  return state.units?.[defenseId] ?? 0;
}

function setDefenseCount(state: any, defenseId: string, count: number): any {
  return { ...state, units: { ...state.units, [defenseId]: count } };
}

export class MissileService {
  static getSiloCapacity(state: any): number {
    const siloLevel = getLevel(state, MISSILE_SILO_ID);
    const entry = OGAME_CATALOG_ENTRY_MAP[MISSILE_SILO_ID];
    if (!entry) return 0;
    const slotsPerLevel = (entry.stats?.missileSlotsPerLevel as number) ?? 10;
    return siloLevel * slotsPerLevel;
  }

  static getStoredMissiles(state: any): { abm: number; ipm: number } {
    const defenseUnits = state.units ?? {};
    return {
      abm: defenseUnits[ABM_ID] ?? 0,
      ipm: defenseUnits[IPM_ID] ?? 0,
    };
  }

  static getUsedSlots(state: any): number {
    const stored = this.getStoredMissiles(state);
    return stored.abm + stored.ipm;
  }

  static canStore(state: any, abmToAdd: number, ipmToAdd: number): boolean {
    const capacity = this.getSiloCapacity(state);
    const used = this.getUsedSlots(state);
    return used + abmToAdd + ipmToAdd <= capacity;
  }

  static getAbmCost(quantity: number): { metal: number; crystal: number; deuterium: number } {
    const entry = OGAME_CATALOG_ENTRY_MAP[ABM_ID];
    if (!entry) return { metal: 8000 * quantity, crystal: 0, deuterium: 2000 * quantity };
    const base = entry.baseCost;
    return {
      metal: base.metal * quantity,
      crystal: base.crystal * quantity,
      deuterium: base.deuterium * quantity,
    };
  }

  static getIpmCost(quantity: number): { metal: number; crystal: number; deuterium: number } {
    const entry = OGAME_CATALOG_ENTRY_MAP[IPM_ID];
    if (!entry) return { metal: 12500 * quantity, crystal: 2500 * quantity, deuterium: 10000 * quantity };
    const base = entry.baseCost;
    return {
      metal: base.metal * quantity,
      crystal: base.crystal * quantity,
      deuterium: base.deuterium * quantity,
    };
  }

  static getAbmBuildTimeSeconds(quantity: number): number {
    const entry = OGAME_CATALOG_ENTRY_MAP[ABM_ID];
    if (!entry) return 45 * quantity;
    return entry.baseTimeSeconds * quantity;
  }

  static getIpmBuildTimeSeconds(quantity: number): number {
    const entry = OGAME_CATALOG_ENTRY_MAP[IPM_ID];
    if (!entry) return 90 * quantity;
    return entry.baseTimeSeconds * quantity;
  }

  static getIpmDamage(ipmCount: number, weaponsTech: number = 0): number {
    const entry = OGAME_CATALOG_ENTRY_MAP[IPM_ID];
    if (!entry) return 12000 * ipmCount;
    const baseDamage = (entry.stats?.strikeDamage as number) ?? 12000;
    const techMultiplier = 1 + weaponsTech * 0.1;
    return Math.floor(baseDamage * ipmCount * techMultiplier);
  }

  static calculateDefenseDestruction(damage: number, targetDefenses: Record<string, number>): { destroyed: Record<string, number>; remainingDamage: number } {
    const defenseOrder = [
      "antiBallisticMissile",
      "rocketLauncher",
      "lightLaser",
      "heavyLaser",
      "gaussCannon",
      "ionCannon",
      "plasmaTurret",
      "smallShieldDome",
      "largeShieldDome",
    ];

    const defenseHp: Record<string, number> = {
      rocketLauncher: 2000,
      lightLaser: 2000,
      heavyLaser: 8000,
      gaussCannon: 35000,
      ionCannon: 8000,
      plasmaTurret: 100000,
      smallShieldDome: 20000,
      largeShieldDome: 100000,
      antiBallisticMissile: 8000,
    };

    let remaining = damage;
    const destroyed: Record<string, number> = {};

    for (const defId of defenseOrder) {
      const count = targetDefenses[defId] ?? 0;
      if (count <= 0) continue;
      const hpPerUnit = defenseHp[defId] ?? 2000;
      const unitsDestroyed = Math.min(count, Math.floor(remaining / hpPerUnit));
      if (unitsDestroyed > 0) {
        destroyed[defId] = unitsDestroyed;
        remaining -= unitsDestroyed * hpPerUnit;
      }
      if (remaining <= 0) break;
    }

    return { destroyed, remainingDamage: remaining };
  }

  static async produceMissiles(userId: string, missileType: "abm" | "ipm", quantity: number): Promise<{ success: boolean; error?: string }> {
    if (quantity < 1) return { success: false, error: "Quantity must be at least 1" };
    if (quantity > 20) return { success: false, error: "Cannot produce more than 20 at once" };

    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (!state) return { success: false, error: "Player state not found" };

    const units = (state.units as any) ?? {};
    const existingAbm = units[ABM_ID] ?? 0;
    const existingIpm = units[IPM_ID] ?? 0;

    const abmToAdd = missileType === "abm" ? quantity : 0;
    const ipmToAdd = missileType === "ipm" ? quantity : 0;

    if (!this.canStore(state, abmToAdd, ipmToAdd)) {
      const capacity = this.getSiloCapacity(state);
      const used = this.getUsedSlots(state);
      return { success: false, error: `Silo capacity exceeded (${used + abmToAdd + ipmToAdd} > ${capacity})` };
    }

    const cost = missileType === "abm" ? this.getAbmCost(quantity) : this.getIpmCost(quantity);
    const resources = (state.resources as any) ?? {};

    if ((resources.metal ?? 0) < cost.metal) return { success: false, error: `Not enough metal (need ${cost.metal})` };
    if ((resources.crystal ?? 0) < cost.crystal) return { success: false, error: `Not enough crystal (need ${cost.crystal})` };
    if ((resources.deuterium ?? 0) < cost.deuterium) return { success: false, error: `Not enough deuterium (need ${cost.deuterium})` };

    const newUnits = { ...units };
    if (missileType === "abm") {
      newUnits[ABM_ID] = (newUnits[ABM_ID] ?? 0) + quantity;
    } else {
      newUnits[IPM_ID] = (newUnits[IPM_ID] ?? 0) + quantity;
    }

    await db.update(playerStates)
      .set({
        units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(newUnits)}::jsonb)`,
        resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
          ...resources,
          metal: (resources.metal ?? 0) - cost.metal,
          crystal: (resources.crystal ?? 0) - cost.crystal,
          deuterium: (resources.deuterium ?? 0) - cost.deuterium,
        })}::jsonb)`,
      })
      .where(eq(playerStates.userId, userId));

    return { success: true };
  }

  static async launchIpm(userId: string, targetUserId: string, quantity: number): Promise<{ success: boolean; error?: string; destroyed?: Record<string, number> }> {
    if (quantity < 1) return { success: false, error: "Must launch at least 1 IPM" };
    if (quantity > 20) return { success: false, error: "Cannot launch more than 20 IPMs at once" };

    const [attackerState] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
    if (!attackerState) return { success: false, error: "Attacker state not found" };

    const [defenderState] = await db.select().from(playerStates).where(eq(playerStates.userId, targetUserId)).limit(1);
    if (!defenderState) return { success: false, error: "Target player not found" };

    const units = (attackerState.units as any) ?? {};
    const availableIpm = units[IPM_ID] ?? 0;
    if (availableIpm < quantity) return { success: false, error: `Not enough IPMs (have ${availableIpm}, need ${quantity})` };

    const defenderUnits = (defenderState.units as any) ?? {};
    const defenderAbm = defenderUnits[ABM_ID] ?? 0;

    const weaponsTech = (attackerState.research as any)?.weaponsTech ?? 0;

    let ipmsThatHit = quantity;

    if (defenderAbm > 0) {
      const abmIntercepted = Math.min(defenderAbm, quantity);
      ipmsThatHit = quantity - abmIntercepted;
      const remainingAbm = defenderAbm - abmIntercepted;

      const newDefenderUnits = { ...defenderUnits, [ABM_ID]: remainingAbm };

      await db.update(playerStates)
        .set({
          units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(newDefenderUnits)}::jsonb)`,
        })
        .where(eq(playerStates.userId, targetUserId));
    }

    if (ipmsThatHit <= 0) {
      const newAttackerUnits = { ...units, [IPM_ID]: availableIpm - quantity };
      await db.update(playerStates)
        .set({ units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(newAttackerUnits)}::jsonb)` })
        .where(eq(playerStates.userId, userId));
      return { success: true, destroyed: {} };
    }

    const totalDamage = this.getIpmDamage(ipmsThatHit, weaponsTech);
    const { destroyed } = this.calculateDefenseDestruction(totalDamage, defenderUnits);

    const finalDefenderUnits = { ...defenderUnits };
    for (const [defId, count] of Object.entries(destroyed)) {
      finalDefenderUnits[defId] = Math.max(0, (finalDefenderUnits[defId] ?? 0) - count);
    }

    const newAttackerUnits = { ...units, [IPM_ID]: availableIpm - quantity };

    await db.update(playerStates)
      .set({
        units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(newAttackerUnits)}::jsonb)`,
      })
      .where(eq(playerStates.userId, userId));

    await db.update(playerStates)
      .set({
        units: sql`jsonb_set(COALESCE(units, '{}'::jsonb), '{}', ${JSON.stringify(finalDefenderUnits)}::jsonb)`,
      })
      .where(eq(playerStates.userId, targetUserId));

    return { success: true, destroyed };
  }
}
