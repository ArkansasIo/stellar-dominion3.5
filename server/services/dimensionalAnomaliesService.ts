import { db } from "../db";
import { dimensionalAnomalies, playerCurrency } from "../../Source/Shared/schema";
import { eq, and } from "drizzle-orm";
import { gateTokensService } from "./gateTokensService";
import { rewardDistributionService } from "./rewardDistributionService";
import {
  DIMENSIONAL_ANOMALIES,
  getAnomalyById,
  getAnomaliesByRegion,
  type DimensionalAnomaly,
  type AnomalyRarity,
} from "../../Source/Shared/config/dimensionalAnomaliesConfig";

export type EncounterType = "combat" | "hazard" | "discovery" | "treasure" | "lore" | "boss";

export interface AnomalyEncounter {
  type: EncounterType;
  name: string;
  description: string;
  difficulty: number;
  successChance: number;
  rewards: Record<string, number>;
  failurePenalty?: Record<string, number>;
}

export interface ExplorationResult {
  success: boolean;
  encounters: AnomalyEncounter[];
  totalRewards: Record<string, number>;
  dangerEncountered: boolean;
  events: string[];
  powerScore: number;
  tierProgression: number;
  rewardsCredited?: any;
}

export class DimensionalAnomaliesService {
  private generateEncounters(anomalyDef: DimensionalAnomaly, playerPower: number): AnomalyEncounter[] {
    const encounters: AnomalyEncounter[] = [];
    const powerRatio = playerPower / Math.max(anomalyDef.recommendedPower, 1);
    const baseDifficulty = anomalyDef.dangerLevel;
    const scaledDifficulty = Math.max(1, Math.round(baseDifficulty * (1 / Math.max(powerRatio, 0.1))));

    const encounterPool: Record<EncounterType, () => AnomalyEncounter> = {
      combat: () => ({
        type: "combat",
        name: `Dimensional Guardian`,
        description: `A guardian entity guards the ${anomalyDef.name}. Prepare for battle.`,
        difficulty: scaledDifficulty,
        successChance: Math.min(0.95, 0.3 + powerRatio * 0.6),
        rewards: { combatXP: Math.round(50 * scaledDifficulty) },
        failurePenalty: { fleetDamage: Math.round(5 * scaledDifficulty) },
      }),
      hazard: () => ({
        type: "hazard",
        name: `Spatial Anomaly Surge`,
        description: `Energy surges destabilize the ${anomalyDef.type}. Navigate carefully.`,
        difficulty: scaledDifficulty,
        successChance: Math.min(0.9, 0.25 + powerRatio * 0.6),
        rewards: { hazardXP: Math.round(40 * scaledDifficulty) },
        failurePenalty: { hullDamage: Math.round(8 * scaledDifficulty) },
      }),
      discovery: () => ({
        type: "discovery",
        name: `Unknown Phenomenon`,
        description: `Your sensors detect something unprecedented within the anomaly.`,
        difficulty: Math.max(1, scaledDifficulty - 1),
        successChance: Math.min(0.99, 0.4 + powerRatio * 0.55),
        rewards: { discoveryXP: Math.round(60 * scaledDifficulty), research: Math.round(100 * scaledDifficulty) },
      }),
      treasure: () => ({
        type: "treasure",
        name: `Dimensional Cache`,
        description: `A cache of dimensional resources floats in the void.`,
        difficulty: Math.max(1, scaledDifficulty - 2),
        successChance: Math.min(0.99, 0.5 + powerRatio * 0.45),
        rewards: { resources: Math.round(500 * scaledDifficulty), darkMatter: Math.round(5 * scaledDifficulty) },
      }),
      lore: () => ({
        type: "lore",
        name: `Ancient Data Fragment`,
        description: `A fragment of ancient knowledge drifts through the anomaly.`,
        difficulty: Math.max(1, scaledDifficulty - 1),
        successChance: Math.min(0.95, 0.35 + powerRatio * 0.55),
        rewards: { loreXP: Math.round(30 * scaledDifficulty), technology: Math.round(1 * scaledDifficulty) },
      }),
      boss: () => ({
        type: "boss",
        name: `Abyssal Warden`,
        description: `A powerful warden protects the anomaly's core. Only the strong survive.`,
        difficulty: scaledDifficulty + 2,
        successChance: Math.min(0.8, 0.1 + powerRatio * 0.5),
        rewards: {
          bossXP: Math.round(200 * scaledDifficulty),
          darkMatter: Math.round(20 * scaledDifficulty),
          abyssalEssence: Math.round(5 * scaledDifficulty),
        },
        failurePenalty: { fleetLoss: Math.round(15 * scaledDifficulty) },
      }),
    };

    const numEncounters = Math.min(5, Math.max(2, Math.ceil(anomalyDef.dangerLevel / 2)));
    const types: EncounterType[] = ["combat", "hazard", "discovery", "treasure", "lore"];

    if (anomalyDef.rarity === "epic" || anomalyDef.rarity === "legendary" || anomalyDef.rarity === "mythic") {
      types.push("boss");
    }

    for (let i = 0; i < numEncounters; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      encounters.push(encounterPool[type]());
    }

    return encounters;
  }

  async exploreAnomaly(
    userId: string,
    anomalyId: string,
    playerPower: number
  ): Promise<{ success: boolean; result?: ExplorationResult; error?: string }> {
    const anomalyDef = getAnomalyById(anomalyId);
    if (!anomalyDef) {
      return { success: false, error: "Unknown anomaly" };
    }

    if (playerPower < anomalyDef.recommendedPower * 0.5) {
      return {
        success: false,
        error: `Power level too low. Recommended: ${anomalyDef.recommendedPower}`,
      };
    }

    const [existing] = await db
      .select()
      .from(dimensionalAnomalies)
      .where(and(
        eq(dimensionalAnomalies.userId, userId),
        eq(dimensionalAnomalies.anomalyId, anomalyId)
      ));

    if (!existing) {
      return { success: false, error: "Anomaly not discovered yet" };
    }

    if (existing.cooldownUntil && new Date(existing.cooldownUntil) > new Date()) {
      return { success: false, error: "Anomaly is on cooldown" };
    }

    // Consume anomaly gate token
    const tokenResult = await gateTokensService.consumeToken(
      userId,
      "anomaly",
      "anomaly_entry",
      { anomalyId, anomalyName: anomalyDef.name }
    );

    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error || "Insufficient tokens" };
    }

    // Generate encounters
    const encounters = this.generateEncounters(anomalyDef, playerPower);
    const results: AnomalyEncounter[] = [];
    const totalRewards: Record<string, number> = {};
    let dangerEncountered = false;
    const events: string[] = [];

    for (const encounter of encounters) {
      const roll = Math.random();
      const succeeded = roll < encounter.successChance;

      if (succeeded) {
        for (const [key, val] of Object.entries(encounter.rewards)) {
          totalRewards[key] = (totalRewards[key] || 0) + val;
        }
        results.push({ ...encounter, successChance: 1 });
        events.push(`Conquered: ${encounter.name}`);
      } else {
        if (encounter.failurePenalty) {
          for (const [key, val] of Object.entries(encounter.failurePenalty)) {
            totalRewards[key] = (totalRewards[key] || 0) - val;
          }
        }
        dangerEncountered = true;
        results.push({ ...encounter, rewards: {}, successChance: 0 });
        events.push(`Failed: ${encounter.name}`);
      }
    }

    // Calculate tier progression (how much this contributes to abyssal gate unlocks)
    const tierProgression = Math.round(
      (anomalyDef.dangerLevel * (playerPower / Math.max(anomalyDef.recommendedPower, 1))) * 10
    );

    // Apply anomaly effect rewards
    const effectRewards = anomalyDef.rewards.filter((r) => Math.random() < r.chance);
    for (const reward of effectRewards) {
      totalRewards[reward.name] = (totalRewards[reward.name] || 0) + reward.amount;
    }

    // Calculate cooldown
    const cooldownHours = dangerEncountered
      ? anomalyDef.respawnTimeHours * 1.5
      : anomalyDef.respawnTimeHours;
    const cooldownUntil = new Date();
    cooldownUntil.setHours(cooldownUntil.getHours() + cooldownHours);

    // Update anomaly record
    await db
      .update(dimensionalAnomalies)
      .set({
        explored: true,
        explorationCount: (existing.explorationCount || 0) + 1,
        lastExploredAt: new Date(),
        cooldownUntil,
        totalRewardsEarned: {
          ...(existing.totalRewardsEarned as any || {}),
          ...Object.fromEntries(
            Object.entries(totalRewards).map(([k, v]) => [
              k,
              ((existing.totalRewardsEarned as any)?.[k] || 0) + v,
            ])
          ),
        },
        updatedAt: new Date(),
      })
      .where(eq(dimensionalAnomalies.id, existing.id));

    // Award token on completion
    await gateTokensService.awardTokensFromCompletion(
      userId,
      "anomaly",
      { anomalyId, anomalyName: anomalyDef.name }
    );

    // Distribute rewards to player account
    const rewardBundle = rewardDistributionService.buildRewardsFromEncounter(
      { type: anomalyDef.rarity === "legendary" || anomalyDef.rarity === "mythic" ? "boss" : (dangerEncountered ? "combat" : "treasure") },
      playerPower,
      anomalyDef.dangerLevel / 2
    );
    await rewardDistributionService.distributeRewards(userId, rewardBundle, `anomaly_explore_${anomalyDef.id}`);

    return {
      success: true,
      result: {
        success: !dangerEncountered,
        encounters: results,
        totalRewards,
        dangerEncountered,
        events,
        powerScore: playerPower,
        tierProgression,
        rewardsCredited: rewardBundle,
      },
    };
  }

  async getAnomalyStatus(userId: string, anomalyId: string) {
    const anomalyDef = getAnomalyById(anomalyId);
    if (!anomalyDef) return null;

    const [record] = await db
      .select()
      .from(dimensionalAnomalies)
      .where(and(
        eq(dimensionalAnomalies.userId, userId),
        eq(dimensionalAnomalies.anomalyId, anomalyId)
      ));

    return {
      ...anomalyDef,
      discovered: record?.discovered ?? false,
      explored: record?.explored ?? false,
      explorationCount: record?.explorationCount ?? 0,
      lastExploredAt: record?.lastExploredAt ?? null,
      cooldownUntil: record?.cooldownUntil ?? null,
      onCooldown: record?.cooldownUntil ? new Date(record.cooldownUntil) > new Date() : false,
    };
  }

  async getPlayerAnomalyStats(userId: string) {
    const records = await db
      .select()
      .from(dimensionalAnomalies)
      .where(eq(dimensionalAnomalies.userId, userId));

    const totalExplored = records.reduce((sum, r) => sum + (r.explorationCount || 0), 0);
    const discoveredCount = records.filter((r) => r.discovered).length;
    const exploredCount = records.filter((r) => r.explored).length;
    const regionsExplored = new Set(
      DIMENSIONAL_ANOMALIES.filter((a) => records.some((r) => r.anomalyId === a.id && r.explored))
        .map((a) => a.region)
    );

    return {
      discovered: discoveredCount,
      explored: exploredCount,
      totalExplores: totalExplored,
      regionsExplored: Array.from(regionsExplored),
      completionPercent: Math.round((exploredCount / DIMENSIONAL_ANOMALIES.length) * 100),
      totalAnomalies: DIMENSIONAL_ANOMALIES.length,
    };
  }
}

export const dimensionalAnomaliesService = new DimensionalAnomaliesService();
