/**
 * Durability System Service
 * Equipment, fleet, and building durability management
 */

import { db } from "../db";
import { eq, and, desc } from "drizzle-orm";
import {
  equipmentDurability,
  fleetDurability,
  buildingDurability,
  repairHistory,
  durabilityDegradationLog,
  playerStates,
} from "../../shared/schema";
import { DURABILITY_CONFIG } from "../../shared/config/durabilityConfig";

type ItemType = "equipment" | "fleet" | "building";

const CONFIG = DURABILITY_CONFIG;

function calculateDegradationRate(itemType: string, usageCount: number): number {
  const baseRates = CONFIG.equipment.degradationRates;
  const base = (baseRates as any)[itemType] || 0.5;
  return base * Math.log2(usageCount + 1);
}

function calculateRepairCost(itemType: string, currentDurability: number, maxDurability: number) {
  const missing = maxDurability - currentDurability;
  const percentMissing = missing / maxDurability;

  switch (itemType) {
    case "weapon": {
      const base = CONFIG.equipment.repairCosts.weapon;
      return { gold: Math.floor(base.gold * percentMissing), platinum: Math.floor(base.platinum * percentMissing) };
    }
    case "armor": {
      const base = CONFIG.equipment.repairCosts.armor;
      return { gold: Math.floor(base.gold * percentMissing), platinum: Math.floor(base.platinum * percentMissing) };
    }
    case "fleet": {
      const base = CONFIG.fleet.repairCosts;
      return { gold: Math.floor(base.gold * percentMissing), platinum: Math.floor(base.platinum * percentMissing) };
    }
    case "building": {
      const base = CONFIG.building.repairCosts;
      return {
        metal: Math.floor(base.metal * percentMissing),
        crystal: Math.floor(base.crystal * percentMissing),
        gold: Math.floor(base.gold * percentMissing),
      };
    }
    default:
      return { gold: Math.floor(100 * percentMissing), platinum: Math.floor(2 * percentMissing) };
  }
}

function getHealthStatus(durabilityPercent: number, type: ItemType): string {
  if (type === "fleet") {
    const { optimal, good, moderate, damaged, critical, destroyed } = CONFIG.fleet.healthStatus;
    if (durabilityPercent >= optimal.range[1]) return "optimal";
    if (durabilityPercent >= good.range[1]) return "good";
    if (durabilityPercent >= moderate.range[1]) return "moderate";
    if (durabilityPercent >= damaged.range[1]) return "damaged";
    if (durabilityPercent >= critical.range[1]) return "critical";
    return "destroyed";
  }
  if (type === "building") {
    const { intact, damaged, heavily_damaged, critical } = CONFIG.building.structuralIntegrity;
    if (durabilityPercent >= intact.range[1]) return "intact";
    if (durabilityPercent >= damaged.range[1]) return "damaged";
    if (durabilityPercent >= heavily_damaged.range[1]) return "heavily_damaged";
    if (durabilityPercent >= critical.range[1]) return "critical";
    return "destroyed";
  }
  if (durabilityPercent <= 0) return "broken";
  if (durabilityPercent <= CONFIG.equipment.warningThreshold) return "warning";
  return "normal";
}

export class DurabilityService {
  static async degradeEquipment(userId: string, equipmentId: string, degradationAmount: number) {
    let [record] = await db.select().from(equipmentDurability).where(
      and(eq(equipmentDurability.playerId, userId), eq(equipmentDurability.equipmentId, equipmentId))
    );

    if (!record) {
      [record] = await db.insert(equipmentDurability).values({
        playerId: userId,
        equipmentId,
        equipmentType: "equipment",
        currentDurability: CONFIG.equipment.maxDurability,
        maxDurability: CONFIG.equipment.maxDurability,
      }).returning();
    }

    const durabilityBefore = record.currentDurability;
    const newDurability = Math.max(0, durabilityBefore - degradationAmount);
    const percent = Math.round((newDurability / record.maxDurability) * 100);
    const isBroken = newDurability <= CONFIG.equipment.breakThreshold;

    await db.update(equipmentDurability).set({
      currentDurability: newDurability,
      durabilityPercent: percent,
      isBroken,
      updatedAt: new Date(),
    }).where(eq(equipmentDurability.id, record.id));

    await db.insert(durabilityDegradationLog).values({
      playerId: userId,
      itemType: "equipment",
      itemId: equipmentId,
      degradationAmount,
      degradationSource: "use",
      durabilityBefore,
      durabilityAfter: newDurability,
    });

    return {
      durabilityBefore,
      durabilityAfter: newDurability,
      percent,
      isBroken,
      status: getHealthStatus(percent, "equipment"),
    };
  }

  static async repairEquipment(userId: string, equipmentId: string) {
    const [record] = await db.select().from(equipmentDurability).where(
      and(eq(equipmentDurability.playerId, userId), eq(equipmentDurability.equipmentId, equipmentId))
    );
    if (!record) throw new Error("Equipment durability record not found");

    const costs = calculateRepairCost("equipment", record.currentDurability, record.maxDurability);

    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const resources = (state.resources || {}) as Record<string, number>;
    if ((resources.gold || 0) < costs.gold) {
      throw new Error(`Insufficient gold for repair: need ${costs.gold}`);
    }

    resources.gold = (resources.gold || 0) - costs.gold;
    await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));

    await db.update(equipmentDurability).set({
      currentDurability: record.maxDurability,
      durabilityPercent: 100,
      isBroken: false,
      lastRepairedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(equipmentDurability.id, record.id));

    await db.insert(repairHistory).values({
      playerId: userId,
      itemType: "equipment",
      itemId: equipmentId,
      durabilityBefore: record.currentDurability,
      durabilityAfter: record.maxDurability,
      repairCostGold: costs.gold,
      repairCostPlatinum: costs.platinum || 0,
      repairType: "full",
    });

    return { repaired: true, cost: costs, durability: record.maxDurability };
  }

  static async degradeFleet(userId: string, fleetId: string, battleDamage: number) {
    let [record] = await db.select().from(fleetDurability).where(
      and(eq(fleetDurability.playerId, userId), eq(fleetDurability.fleetId, fleetId))
    );

    if (!record) {
      [record] = await db.insert(fleetDurability).values({
        playerId: userId,
        fleetId,
        shipType: "default",
        shipCount: 1,
        currentDurability: CONFIG.fleet.maxDurability,
        maxDurability: CONFIG.fleet.maxDurability,
      }).returning();
    }

    const durabilityBefore = record.currentDurability;
    const newDurability = Math.max(0, durabilityBefore - battleDamage);
    const percent = Math.round((newDurability / record.maxDurability) * 100);

    await db.update(fleetDurability).set({
      currentDurability: newDurability,
      durabilityPercent: percent,
      healthStatus: getHealthStatus(percent, "fleet"),
      battleDamage: (record.battleDamage || 0) + battleDamage,
      updatedAt: new Date(),
    }).where(eq(fleetDurability.id, record.id));

    await db.insert(durabilityDegradationLog).values({
      playerId: userId,
      itemType: "fleet",
      itemId: fleetId,
      degradationAmount: battleDamage,
      degradationSource: "battle",
      durabilityBefore,
      durabilityAfter: newDurability,
    });

    return {
      durabilityBefore,
      durabilityAfter: newDurability,
      percent,
      healthStatus: getHealthStatus(percent, "fleet"),
      combatBonus: CONFIG.fleet.healthStatus[getHealthStatus(percent, "fleet") as keyof typeof CONFIG.fleet.healthStatus]?.combatBonus || 0,
    };
  }

  static async repairFleet(userId: string, fleetId: string) {
    const [record] = await db.select().from(fleetDurability).where(
      and(eq(fleetDurability.playerId, userId), eq(fleetDurability.fleetId, fleetId))
    );
    if (!record) throw new Error("Fleet durability record not found");

    const costs = calculateRepairCost("fleet", record.currentDurability, record.maxDurability);

    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const resources = (state.resources || {}) as Record<string, number>;
    if ((resources.gold || 0) < costs.gold) {
      throw new Error(`Insufficient gold for fleet repair: need ${costs.gold}`);
    }

    resources.gold = (resources.gold || 0) - costs.gold;
    await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));

    await db.update(fleetDurability).set({
      currentDurability: record.maxDurability,
      durabilityPercent: 100,
      healthStatus: "optimal",
      battleDamage: 0,
      lastRepairedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(fleetDurability.id, record.id));

    await db.insert(repairHistory).values({
      playerId: userId,
      itemType: "fleet",
      itemId: fleetId,
      durabilityBefore: record.currentDurability,
      durabilityAfter: record.maxDurability,
      repairCostGold: costs.gold,
      repairCostPlatinum: costs.platinum || 0,
      repairType: "full",
    });

    return { repaired: true, cost: costs, durability: record.maxDurability };
  }

  static async degradeBuilding(userId: string, buildingId: string, damageAmount: number) {
    let [record] = await db.select().from(buildingDurability).where(
      and(eq(buildingDurability.playerId, userId), eq(buildingDurability.buildingId, buildingId))
    );

    if (!record) {
      [record] = await db.insert(buildingDurability).values({
        playerId: userId,
        buildingId,
        buildingType: "default",
        buildingLevel: 1,
        currentDurability: CONFIG.building.maxDurability,
        maxDurability: CONFIG.building.maxDurability,
      }).returning();
    }

    const durabilityBefore = record.currentDurability;
    const newDurability = Math.max(0, durabilityBefore - damageAmount);
    const percent = Math.round((newDurability / record.maxDurability) * 100);

    await db.update(buildingDurability).set({
      currentDurability: newDurability,
      durabilityPercent: percent,
      structuralIntegrity: getHealthStatus(percent, "building"),
      damageFromAttack: (record.damageFromAttack || 0) + damageAmount,
      updatedAt: new Date(),
    }).where(eq(buildingDurability.id, record.id));

    await db.insert(durabilityDegradationLog).values({
      playerId: userId,
      itemType: "building",
      itemId: buildingId,
      degradationAmount: damageAmount,
      degradationSource: "attack",
      durabilityBefore,
      durabilityAfter: newDurability,
    });

    return {
      durabilityBefore,
      durabilityAfter: newDurability,
      percent,
      structuralIntegrity: getHealthStatus(percent, "building"),
    };
  }

  static async repairBuilding(userId: string, buildingId: string) {
    const [record] = await db.select().from(buildingDurability).where(
      and(eq(buildingDurability.playerId, userId), eq(buildingDurability.buildingId, buildingId))
    );
    if (!record) throw new Error("Building durability record not found");

    const costs = calculateRepairCost("building", record.currentDurability, record.maxDurability);

    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const resources = (state.resources || {}) as Record<string, number>;
    if ((resources.metal || 0) < (costs.metal || 0)) {
      throw new Error(`Insufficient metal for building repair: need ${costs.metal}`);
    }
    if ((resources.crystal || 0) < (costs.crystal || 0)) {
      throw new Error(`Insufficient crystal for building repair: need ${costs.crystal}`);
    }
    if ((resources.gold || 0) < (costs.gold || 0)) {
      throw new Error(`Insufficient gold for building repair: need ${costs.gold}`);
    }

    resources.metal = (resources.metal || 0) - (costs.metal || 0);
    resources.crystal = (resources.crystal || 0) - (costs.crystal || 0);
    resources.gold = (resources.gold || 0) - (costs.gold || 0);
    await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));

    await db.update(buildingDurability).set({
      currentDurability: record.maxDurability,
      durabilityPercent: 100,
      structuralIntegrity: "intact",
      damageFromAttack: 0,
      lastRepairedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(buildingDurability.id, record.id));

    await db.insert(repairHistory).values({
      playerId: userId,
      itemType: "building",
      itemId: buildingId,
      durabilityBefore: record.currentDurability,
      durabilityAfter: record.maxDurability,
      repairType: "full",
    });

    return { repaired: true, cost: costs, durability: record.maxDurability };
  }

  static async getDurabilityStatus(userId: string, itemType: ItemType, itemId: string) {
    let table: any;
    switch (itemType) {
      case "equipment": table = equipmentDurability; break;
      case "fleet": table = fleetDurability; break;
      case "building": table = buildingDurability; break;
      default: throw new Error("Invalid item type");
    }

    const idField = itemType === "equipment" ? equipmentDurability.equipmentId
      : itemType === "fleet" ? fleetDurability.fleetId
      : buildingDurability.buildingId;

    const [record] = await db.select().from(table).where(
      and(eq(table.playerId, userId), eq(idField, itemId))
    );

    if (!record) return { found: false, itemType, itemId };

    const percent = record.durabilityPercent || Math.round((record.currentDurability / record.maxDurability) * 100);
    const costs = calculateRepairCost(
      itemType === "equipment" ? "weapon" : itemType,
      record.currentDurability,
      record.maxDurability
    );

    return {
      found: true,
      itemType,
      itemId,
      currentDurability: record.currentDurability,
      maxDurability: record.maxDurability,
      durabilityPercent: percent,
      status: getHealthStatus(percent, itemType),
      repairCost: costs,
    };
  }

  static calculateDegradationRate = calculateDegradationRate;
  static calculateRepairCost = calculateRepairCost;
}

export default DurabilityService;
