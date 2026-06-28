/**
 * Expedition System Service
 * Expedition catalog, launching, resolving, tiers, levels, and rewards
 */

import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { playerStates, expeditions } from "../../shared/schema";
import {
  EXPEDITION_CATEGORIES,
  EXPEDITION_TYPES,
  EXPEDITION_TIERS,
  EXPEDITION_LEVELS,
  CATEGORY_MAP,
  TYPE_MAP,
  TIER_MAP,
  LEVEL_MAP,
} from "../../shared/expeditionData";

export const EXPEDITION_REWARDS = {
  resources: {
    exploration: { metal: [100, 5000], crystal: [50, 2500], deuterium: [10, 1000] },
    military: { metal: [200, 10000], crystal: [100, 5000], deuterium: [50, 2000] },
    scientific: { metal: [50, 2000], crystal: [100, 4000], deuterium: [30, 1500] },
    trade: { metal: [500, 20000], crystal: [200, 10000], deuterium: [100, 5000] },
    conquest: { metal: [1000, 50000], crystal: [500, 25000], deuterium: [200, 10000] },
    diplomatic: { metal: [100, 3000], crystal: [50, 1500], deuterium: [20, 800] },
    emergency: { metal: [150, 4000], crystal: [75, 2000], deuterium: [30, 1200] },
  },
  xpMultiplier: {
    success: 1.0,
    partial: 0.5,
    failure: 0.1,
  },
  tierScaling: 1.5,
  levelScaling: 1.2,
};

function clampReward(value: [number, number], scaling: number): number {
  return Math.round((value[0] + Math.random() * (value[1] - value[0])) * scaling);
}

function calculateExpeditionSuccessChance(fleetPower: number, expeditionDifficulty: number): number {
  if (expeditionDifficulty <= 0) return 0.95;
  const ratio = fleetPower / expeditionDifficulty;
  return Math.min(0.95, Math.max(0.05, 0.3 + ratio * 0.4));
}

function calculateExpeditionReward(tier: number, level: number, outcome: "success" | "partial" | "failure") {
  const tierScaling = Math.pow(EXPEDITION_REWARDS.tierScaling, Math.floor(tier / 10));
  const levelScaling = Math.pow(EXPEDITION_REWARDS.levelScaling, Math.floor(level / 100));
  const outcomeMultiplier = EXPEDITION_REWARDS.xpMultiplier[outcome];

  return {
    metal: Math.round(100 * tierScaling * levelScaling * outcomeMultiplier),
    crystal: Math.round(50 * tierScaling * levelScaling * outcomeMultiplier),
    deuterium: Math.round(20 * tierScaling * levelScaling * outcomeMultiplier),
    xp: Math.round(tier * level * 0.5 * outcomeMultiplier),
    items: [],
  };
}

export class ExpeditionService {
  static getExpeditionCatalog() {
    return {
      categories: EXPEDITION_CATEGORIES,
      types: EXPEDITION_TYPES,
      totalCategories: EXPEDITION_CATEGORIES.length,
      totalTypes: EXPEDITION_TYPES.length,
    };
  }

  static getExpeditionTiers() {
    return EXPEDITION_TIERS;
  }

  static getExpeditionLevels() {
    return EXPEDITION_LEVELS;
  }

  static async startExpedition(userId: string, expeditionId: string, fleetComposition: Record<string, number>) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const resources = (state.resources || {}) as Record<string, number>;
    const currentUnits = (state.units || {}) as Record<string, number>;

    for (const [unitType, count] of Object.entries(fleetComposition)) {
      if ((currentUnits[unitType] || 0) < count) {
        throw new Error(`Insufficient ${unitType}: need ${count}, have ${currentUnits[unitType] || 0}`);
      }
    }

    const category = CATEGORY_MAP.get(expeditionId) || null;
    const type = TYPE_MAP.get(expeditionId) || null;
    const tierData = EXPEDITION_TIERS[0];
    const levelData = EXPEDITION_LEVELS[0];

    const deuteriumCost = 100 + tierData.tier * 50;
    if ((resources.deuterium || 0) < deuteriumCost) {
      throw new Error(`Insufficient deuterium: need ${deuteriumCost}`);
    }

    resources.deuterium = (resources.deuterium || 0) - deuteriumCost;

    for (const [unitType, count] of Object.entries(fleetComposition)) {
      currentUnits[unitType] = (currentUnits[unitType] || 0) - count;
    }

    await db.update(playerStates).set({ resources, units: currentUnits }).where(eq(playerStates.userId, userId));

    const [expedition] = await db.insert(expeditions).values({
      userId,
      name: `${type?.name || "Expedition"} - ${category?.name || expeditionId}`,
      type: type?.id || expeditionId,
      categoryId: category?.id || expeditionId,
      tier: tierData.tier,
      tierClass: tierData.tierClass,
      tierSubClass: tierData.tierSubClass,
      level: levelData.level,
      rank: tierData.rank,
      title: tierData.title,
      targetCoords: `[${Math.floor(Math.random() * 999) + 1}:${Math.floor(Math.random() * 999) + 1}:${Math.floor(Math.random() * 999) + 1}]`,
      status: "active",
      stats: tierData.stats,
      attributes: tierData.attributes,
    }).returning();

    return {
      expedition,
      deuteriumCost,
      fleetDeducted: fleetComposition,
    };
  }

  static async resolveExpedition(userId: string, expeditionId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const [expedition] = await db.select().from(expeditions).where(
      and(eq(expeditions.id, expeditionId), eq(expeditions.userId, userId))
    );
    if (!expedition) throw new Error("Expedition not found");
    if (expedition.status !== "active") throw new Error("Expedition is not active");

    const tier = expedition.tier || 1;
    const level = expedition.level || 1;

    const fleetPower = 1000 + tier * 100;
    const expeditionDifficulty = tier * 200 + level * 10;
    const successChance = calculateExpeditionSuccessChance(fleetPower, expeditionDifficulty);

    const roll = Math.random();
    let outcome: "success" | "partial" | "failure";
    if (roll < successChance) outcome = "success";
    else if (roll < successChance + 0.2) outcome = "partial";
    else outcome = "failure";

    const rewards = calculateExpeditionReward(tier, level, outcome);

    if (outcome !== "failure") {
      const resources = (state.resources || {}) as Record<string, number>;
      resources.metal = (resources.metal || 0) + rewards.metal;
      resources.crystal = (resources.crystal || 0) + rewards.crystal;
      resources.deuterium = (resources.deuterium || 0) + rewards.deuterium;
      await db.update(playerStates).set({ resources }).where(eq(playerStates.userId, userId));
    }

    const newStatus = outcome === "success" ? "completed" : outcome === "partial" ? "completed" : "failed";
    await db.update(expeditions).set({ status: newStatus }).where(eq(expeditions.id, expeditionId));

    return {
      expeditionId,
      outcome,
      successChance,
      rewards,
      tier,
      level,
    };
  }

  static calculateExpeditionReward = calculateExpeditionReward;
  static calculateExpeditionSuccessChance = calculateExpeditionSuccessChance;
}

export default ExpeditionService;
