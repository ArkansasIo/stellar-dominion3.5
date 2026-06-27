import { db } from "../db";
import {
  dimensionalContracts,
  abyssalGateTokens,
  raidChestRewards,
  abyssalGateRewards,
} from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { gateTokensService } from "./gateTokensService";
import { rewardDistributionService } from "./rewardDistributionService";
import {
  DIMENSIONAL_CONTRACT_TIERS,
  getContractTier,
  calculateTokensEarned,
  rollChestRewards,
  rollRaidRewards,
} from "../../shared/config/dimensionalContractConfig";
import {
  ABYSSAL_GATE_TIERS,
  getAbyssalGateTier,
  calculateAbyssalTokensEarned,
  rollAbyssalChestRewards,
  rollAbyssalGateRewards,
} from "../../shared/config/abyssalGateConfig";

export interface RaidResult {
  success: boolean;
  tokensEarned: number;
  totalTokens: number;
  canOpenChest: boolean;
  raidRewards: any[];
  powerScore: number;
  difficultyRating: string;
  rewardsCredited?: any;
}

export interface GateResult {
  success: boolean;
  tokensEarned: number;
  totalTokens: number;
  canOpenChest: boolean;
  gateRewards: any[];
  gateDifficulty: string;
  rewardsCredited?: any;
}

export class DimensionalAbyssalService {
  // ============ DIMENSIONAL CONTRACTS (RAIDS) ============

  private getDifficultyRating(powerScore: number, requirement: number): string {
    const ratio = powerScore / Math.max(requirement, 1);
    if (ratio >= 2) return "trivial";
    if (ratio >= 1.5) return "easy";
    if (ratio >= 1) return "fair";
    if (ratio >= 0.75) return "challenging";
    if (ratio >= 0.5) return "hard";
    return "extreme";
  }

  async completeRaid(
    userId: string,
    tier: number,
    playerPower: number
  ): Promise<{ success: boolean; result?: RaidResult; error?: string }> {
    const contract = getContractTier(tier);
    if (!contract) {
      return { success: false, error: "Invalid contract tier" };
    }

    if (playerPower < contract.raidPowerRequirement * 0.5) {
      return {
        success: false,
        error: `Power level too low. Minimum: ${contract.raidPowerRequirement}`,
      };
    }

    // Consume raid gate token
    const tokenResult = await gateTokensService.consumeToken(
      userId,
      "raid",
      "raid_entry",
      { contractTier: tier }
    );

    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error || "Insufficient raid tokens" };
    }

    // Get or create contract
    let [userContract] = await db
      .select()
      .from(dimensionalContracts)
      .where(and(
        eq(dimensionalContracts.userId, userId),
        eq(dimensionalContracts.contractTier, tier)
      ));

    if (!userContract) {
      [userContract] = await db
        .insert(dimensionalContracts)
        .values({ userId, contractTier: tier })
        .returning();
    }

    // Calculate tokens
    const oldTokens = userContract.tokensEarned!;
    const newTokensEarned = Math.min(
      oldTokens + contract.tokensPerRaid,
      contract.maxTokensForChest
    );
    const tokensGained = newTokensEarned - oldTokens;

    // Roll rewards
    const raidRewards = rollRaidRewards(tier);

    // Apply power bonus to reward rolls (higher power = better rewards)
    const powerRatio = playerPower / Math.max(contract.raidPowerRequirement, 1);
    if (powerRatio > 1.5) {
      // Extra reward roll for overqualified players
      const extraRewards = rollRaidRewards(tier);
      raidRewards.push(...extraRewards);
    }

    // Update contract
    await db
      .update(dimensionalContracts)
      .set({
        tokensEarned: newTokensEarned,
        raidsCompleted: (userContract.raidsCompleted ?? 0) + 1,
        lastRaidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(dimensionalContracts.id, userContract.id));

    // Distribute raid rewards
    const raidRewardBundle = rewardDistributionService.buildRewardsFromEncounter(
      { type: "combat", difficulty: tier * 2 },
      playerPower,
      tier * 1.5
    );
    raidRewardBundle.items = raidRewards.map((r: any, i: number) => ({
      id: `raid_reward_${tier}_${i}`,
      name: r.name || `Raid Tier ${tier} Reward`,
      quantity: r.quantity || 1,
    }));
    await rewardDistributionService.distributeRewards(userId, raidRewardBundle, `raid_complete_tier_${tier}`);

    return {
      success: true,
      result: {
        success: true,
        tokensEarned: tokensGained,
        totalTokens: newTokensEarned,
        canOpenChest: newTokensEarned >= contract.maxTokensForChest,
        raidRewards,
        powerScore: playerPower,
        difficultyRating: this.getDifficultyRating(playerPower, contract.raidPowerRequirement),
        rewardsCredited: raidRewardBundle,
      },
    };
  }

  async openRaidChest(
    userId: string,
    tier: number
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const contract = getContractTier(tier);
    if (!contract) {
      return { success: false, error: "Invalid contract tier" };
    }

    const [userContract] = await db
      .select()
      .from(dimensionalContracts)
      .where(and(
        eq(dimensionalContracts.userId, userId),
        eq(dimensionalContracts.contractTier, tier)
      ));

    if (!userContract) {
      return { success: false, error: "Contract not found" };
    }

    const availableTokens = (userContract.tokensEarned ?? 0) - (userContract.tokensSpent ?? 0);
    if (availableTokens < contract.maxTokensForChest) {
      return {
        success: false,
        error: `Insufficient tokens. Need ${contract.maxTokensForChest}, have ${availableTokens}`,
      };
    }

    const chestRewards = rollChestRewards(tier);

    await db
      .update(dimensionalContracts)
      .set({
        tokensSpent: (userContract.tokensSpent ?? 0) + contract.maxTokensForChest,
        chestsOpened: (userContract.chestsOpened ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(dimensionalContracts.id, userContract.id));

    await db.insert(raidChestRewards).values({
      userId,
      contractType: "dimensional",
      contractTier: tier,
      tokensSpent: contract.maxTokensForChest,
      rewardsGranted: chestRewards,
    });

    const chestBundle: any = { items: [] };
    for (const r of chestRewards) {
      chestBundle.items.push({
        id: `raid_chest_${tier}_${Date.now()}`,
        name: (r as any).name || `Chest Tier ${tier} Item`,
        quantity: (r as any).quantity || 1,
      });
    }
    await rewardDistributionService.distributeRewards(userId, chestBundle, `raid_chest_tier_${tier}`);

    return {
      success: true,
      result: {
        chestRewards,
        remainingTokens: (userContract.tokensEarned ?? 0) - (userContract.tokensSpent ?? 0) - contract.maxTokensForChest,
        rewardsCredited: chestBundle,
      },
    };
  }

  async getPlayerContracts(userId: string) {
    const contracts = await db
      .select()
      .from(dimensionalContracts)
      .where(eq(dimensionalContracts.userId, userId));

    if (contracts.length === 0) {
      const tier1 = await db
        .insert(dimensionalContracts)
        .values({ userId, contractTier: 1 })
        .returning();
      const tier9 = await db
        .insert(dimensionalContracts)
        .values({ userId, contractTier: 9 })
        .returning();
      return [tier1[0], tier9[0]];
    }

    return contracts.map((c) => ({
      ...c,
      availableTokens: (c.tokensEarned ?? 0) - (c.tokensSpent ?? 0),
      canOpenChest: ((c.tokensEarned ?? 0) - (c.tokensSpent ?? 0)) >= (getContractTier(c.contractTier)?.maxTokensForChest || 0),
    }));
  }

  // ============ ABYSSAL GATES ============

  async completeGate(
    userId: string,
    tier: number,
    playerPower: number
  ): Promise<{ success: boolean; result?: GateResult; error?: string }> {
    const gate = getAbyssalGateTier(tier);
    if (!gate) {
      return { success: false, error: "Invalid gate tier" };
    }

    if (playerPower < gate.powerRequirement * 0.5) {
      return {
        success: false,
        error: `Power level too low. Minimum: ${gate.powerRequirement}`,
      };
    }

    // Consume raid token for gate entry
    const tokenResult = await gateTokensService.consumeToken(
      userId,
      "raid",
      "abyssal_gate_entry",
      { gateTier: tier }
    );

    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error || "Insufficient raid tokens" };
    }

    let [userToken] = await db
      .select()
      .from(abyssalGateTokens)
      .where(and(
        eq(abyssalGateTokens.userId, userId),
        eq(abyssalGateTokens.gateTier, tier)
      ));

    if (!userToken) {
      [userToken] = await db
        .insert(abyssalGateTokens)
        .values({ userId, gateTier: tier })
        .returning();
    }

    const oldTokens = userToken.tokensEarned!;
    const newTokensEarned = Math.min(
      oldTokens + gate.tokensPerGate,
      gate.maxTokensForChest
    );

    const gateRewards = rollAbyssalGateRewards(tier);

    // Power bonus rewards
    const powerRatio = playerPower / Math.max(gate.powerRequirement, 1);
    if (powerRatio > 1.5) {
      const extra = rollAbyssalGateRewards(tier);
      gateRewards.push(...extra);
    }

    await db
      .update(abyssalGateTokens)
      .set({
        tokensEarned: newTokensEarned,
        gatesCompleted: (userToken.gatesCompleted ?? 0) + 1,
        lastGateAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(abyssalGateTokens.id, userToken.id));

    // Distribute gate rewards
    const gateRewardBundle = rewardDistributionService.buildRewardsFromEncounter(
      { type: "boss", difficulty: tier * 3 },
      playerPower,
      tier * 3
    );
    gateRewardBundle.items = gateRewards.map((r: any, i: number) => ({
      id: `gate_reward_${tier}_${i}`,
      name: r.name || `Gate Tier ${tier} Reward`,
      quantity: r.quantity || 1,
    }));
    await rewardDistributionService.distributeRewards(userId, gateRewardBundle, `gate_complete_tier_${tier}`);

    return {
      success: true,
      result: {
        success: true,
        tokensEarned: newTokensEarned - oldTokens,
        totalTokens: newTokensEarned,
        canOpenChest: newTokensEarned >= gate.maxTokensForChest,
        gateRewards,
        gateDifficulty: gate.gateDifficulty,
        rewardsCredited: gateRewardBundle,
      },
    };
  }

  async openGateChest(
    userId: string,
    tier: number
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const gate = getAbyssalGateTier(tier);
    if (!gate) {
      return { success: false, error: "Invalid gate tier" };
    }

    const [userToken] = await db
      .select()
      .from(abyssalGateTokens)
      .where(and(
        eq(abyssalGateTokens.userId, userId),
        eq(abyssalGateTokens.gateTier, tier)
      ));

    if (!userToken) {
      return { success: false, error: "Gate token not found" };
    }

    const availableTokens = (userToken.tokensEarned ?? 0) - (userToken.tokensSpent ?? 0);
    if (availableTokens < gate.maxTokensForChest) {
      return {
        success: false,
        error: `Insufficient tokens. Need ${gate.maxTokensForChest}, have ${availableTokens}`,
      };
    }

    const chestRewards = rollAbyssalChestRewards(tier);

    await db
      .update(abyssalGateTokens)
      .set({
        tokensSpent: (userToken.tokensSpent ?? 0) + gate.maxTokensForChest,
        chestsOpened: (userToken.chestsOpened ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(abyssalGateTokens.id, userToken.id));

    await db.insert(abyssalGateRewards).values({
      userId,
      gateTier: tier,
      tokensSpent: gate.maxTokensForChest,
      rewardsGranted: chestRewards,
    });

    const gateChestBundle: any = { items: [] };
    for (const r of chestRewards) {
      gateChestBundle.items.push({
        id: `gate_chest_${tier}_${Date.now()}`,
        name: (r as any).name || `Gate Chest Tier ${tier} Item`,
        quantity: (r as any).quantity || 1,
      });
    }
    await rewardDistributionService.distributeRewards(userId, gateChestBundle, `gate_chest_tier_${tier}`);

    return {
      success: true,
      result: {
        chestRewards,
        remainingTokens: (userToken.tokensEarned ?? 0) - (userToken.tokensSpent ?? 0) - gate.maxTokensForChest,
        rewardsCredited: gateChestBundle,
      },
    };
  }

  async getPlayerGates(userId: string) {
    const tokens = await db
      .select()
      .from(abyssalGateTokens)
      .where(eq(abyssalGateTokens.userId, userId));

    if (tokens.length === 0) {
      const inserts = await Promise.all(
        [1, 3, 6, 9].map((tier) =>
          db.insert(abyssalGateTokens).values({ userId, gateTier: tier }).returning()
        )
      );
      return inserts.flat();
    }

    return tokens.map((t) => ({
      ...t,
      availableTokens: (t.tokensEarned ?? 0) - (t.tokensSpent ?? 0),
      canOpenChest: ((t.tokensEarned ?? 0) - (t.tokensSpent ?? 0)) >= (getAbyssalGateTier(t.gateTier)?.maxTokensForChest || 0),
    }));
  }
}

export const dimensionalAbyssalService = new DimensionalAbyssalService();
