import { db } from "../db";
import { playerCurrency, currencyTransactions } from "../../Source/Shared/schema";
import { eq } from "drizzle-orm";

export interface RewardBundle {
  silver?: number;
  gold?: number;
  platinum?: number;
  metal?: number;
  crystal?: number;
  deuterium?: number;
  energy?: number;
  experience?: number;
  items?: { id: string; name: string; quantity: number }[];
  darkMatter?: number;
}

export class RewardDistributionService {
  async creditCurrency(userId: string, type: "silver" | "gold" | "platinum", amount: number, reason: string) {
    if (amount <= 0) return;

    let [balance] = await db.select().from(playerCurrency).where(eq(playerCurrency.userId, userId));
    if (!balance) {
      [balance] = await db.insert(playerCurrency).values({ userId }).returning();
    }

    const earnedField = `${type}Earned`;
    const current = (balance as any)[type] as number;
    const newBalance = current + amount;

    await db
      .update(playerCurrency)
      .set({
        [type]: newBalance,
        [earnedField]: ((balance as any)[earnedField] as number) + amount,
        lastUpdated: new Date(),
      })
      .where(eq(playerCurrency.userId, userId));

    await db.insert(currencyTransactions).values({
      userId,
      currencyType: type,
      amount,
      reason,
      balanceBefore: current,
      balanceAfter: newBalance,
    });
  }

  async creditResources(userId: string, resources: { metal?: number; crystal?: number; deuterium?: number; energy?: number }) {
    const { storage } = await import("../storage");
    const state = await storage.getPlayerState(userId);
    if (!state) return;

    const currentResources = (state as any).resources || {};
    const updatedResources = {
      metal: (currentResources.metal || 0) + (resources.metal || 0),
      crystal: (currentResources.crystal || 0) + (resources.crystal || 0),
      deuterium: (currentResources.deuterium || 0) + (resources.deuterium || 0),
      energy: (currentResources.energy || 0) + (resources.energy || 0),
    };

    await storage.updatePlayerState(userId, { resources: updatedResources } as any);
  }

  async creditItems(userId: string, items: { id: string; name: string; quantity: number }[]) {
    if (!items.length) return;

    const { storage } = await import("../storage");
    const state = await storage.getPlayerState(userId);
    if (!state) return;

    const artifacts = ((state as any).artifacts as any[]) || [];
    for (const item of items) {
      artifacts.push({
        id: item.id,
        name: item.name,
        source: "dimensional_content",
        grantedAt: new Date().toISOString(),
        quantity: item.quantity,
      });
    }

    await storage.updatePlayerState(userId, { artifacts } as any);
  }

  async creditXp(userId: string, amount: number) {
    if (amount <= 0) return;

    const { storage } = await import("../storage");
    const state = await storage.getPlayerState(userId);
    if (!state) return;

    const commander = ((state as any).commander as any) || {};
    const stats = commander.stats || {};
    const currentXp = stats.xp || 0;

    await storage.updatePlayerState(userId, {
      commander: {
        ...commander,
        stats: { ...stats, xp: currentXp + amount },
      },
    } as any);
  }

  async distributeRewards(userId: string, rewards: RewardBundle, source: string) {
    const results: Record<string, any> = {};

    // Currency
    if (rewards.silver) {
      await this.creditCurrency(userId, "silver", rewards.silver, source);
      results.silver = rewards.silver;
    }
    if (rewards.gold) {
      await this.creditCurrency(userId, "gold", rewards.gold, source);
      results.gold = rewards.gold;
    }
    if (rewards.platinum) {
      await this.creditCurrency(userId, "platinum", rewards.platinum, source);
      results.platinum = rewards.platinum;
    }

    // Resources
    const res: any = {};
    if (rewards.metal) res.metal = rewards.metal;
    if (rewards.crystal) res.crystal = rewards.crystal;
    if (rewards.deuterium) res.deuterium = rewards.deuterium;
    if (rewards.energy) res.energy = rewards.energy;
    if (Object.keys(res).length) {
      await this.creditResources(userId, res);
      results.resources = res;
    }

    // Items
    if (rewards.items?.length) {
      await this.creditItems(userId, rewards.items);
      results.items = rewards.items;
    }

    // XP
    if (rewards.experience) {
      await this.creditXp(userId, rewards.experience);
      results.experience = rewards.experience;
    }

    return results;
  }

  buildRewardsFromEncounter(encounter: any, playerPower: number, baseMultiplier: number): RewardBundle {
    const rewards: RewardBundle = {};

    if (encounter.type === "treasure") {
      rewards.silver = Math.round(500 * baseMultiplier);
      rewards.metal = Math.round(1000 * baseMultiplier);
      rewards.crystal = Math.round(500 * baseMultiplier);
    } else if (encounter.type === "combat") {
      rewards.silver = Math.round(200 * baseMultiplier);
      rewards.experience = Math.round(50 * baseMultiplier);
    } else if (encounter.type === "boss") {
      rewards.gold = Math.round(50 * baseMultiplier);
      rewards.silver = Math.round(2000 * baseMultiplier);
      rewards.experience = Math.round(200 * baseMultiplier);
      rewards.darkMatter = Math.round(10 * baseMultiplier);
    } else if (encounter.type === "discovery") {
      rewards.experience = Math.round(60 * baseMultiplier);
      rewards.crystal = Math.round(800 * baseMultiplier);
    } else if (encounter.type === "lore") {
      rewards.experience = Math.round(30 * baseMultiplier);
      rewards.silver = Math.round(300 * baseMultiplier);
    } else if (encounter.type === "hazard") {
      rewards.silver = Math.round(400 * baseMultiplier);
      rewards.deuterium = Math.round(600 * baseMultiplier);
    }

    // Power level bonus
    if (playerPower > 1000) {
      const powerMultiplier = Math.min(3, playerPower / 1000);
      for (const key of Object.keys(rewards) as (keyof RewardBundle)[]) {
        const val = rewards[key];
        if (typeof val === "number") {
          (rewards as any)[key] = Math.round(val * powerMultiplier);
        }
      }
    }

    return rewards;
  }
}

export const rewardDistributionService = new RewardDistributionService();
