import { db } from "../db";
import {
  trials,
  trialAttempts,
  trialLeaderboard,
} from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { gateTokensService } from "./gateTokensService";
import { rewardDistributionService } from "./rewardDistributionService";
import {
  TRIAL_TIERS,
  getTrialTier,
  calculateTrialPoints,
  calculateWaveDifficulty,
} from "../../shared/config/trialsConfig";

export interface StartTrialResult {
  success: boolean;
  attempt?: any;
  currentWave?: any;
  totalWaves?: number;
  error?: string;
}

export interface ResolveWaveResult {
  success: boolean;
  waveCompleted?: boolean;
  wavesCleared?: number;
  totalWaves?: number;
  flawless?: boolean;
  completed?: boolean;
  rewards?: any[];
  nextWave?: any;
  error?: string;
}

export interface CompleteTrialResult {
  success: boolean;
  pointsEarned?: number;
  rewards?: any[];
  leaderboard?: any;
  error?: string;
}

export class TrialsService {
  async startTrial(userId: string, tier: number, playerPower: number): Promise<StartTrialResult> {
    const config = getTrialTier(tier);
    if (!config) {
      return { success: false, error: "Invalid trial tier" };
    }

    if (playerPower < config.powerRequirement) {
      return {
        success: false,
        error: `Power level too low. Minimum: ${config.powerRequirement}`,
      };
    }

    const tokenResult = await gateTokensService.consumeToken(
      userId,
      "raid",
      "trial_entry",
      { trialTier: tier }
    );

    if (!tokenResult.success) {
      return { success: false, error: tokenResult.error || "Insufficient raid tokens" };
    }

    let [userTrial] = await db
      .select()
      .from(trials)
      .where(and(
        eq(trials.userId, userId),
        eq(trials.trialTier, tier)
      ));

    if (!userTrial) {
      [userTrial] = await db
        .insert(trials)
        .values({ userId, trialTier: tier })
        .returning();
    }

    const [attempt] = await db
      .insert(trialAttempts)
      .values({
        userId,
        trialTier: tier,
        totalWaves: config.waves.length,
      })
      .returning();

    const firstWave = config.waves[0];

    return {
      success: true,
      attempt,
      currentWave: {
        ...firstWave,
        difficultyRating: calculateWaveDifficulty(playerPower, firstWave, config),
      },
      totalWaves: config.waves.length,
    };
  }

  async resolveWave(userId: string, attemptId: string, playerPower: number): Promise<ResolveWaveResult> {
    const [attempt] = await db
      .select()
      .from(trialAttempts)
      .where(and(
        eq(trialAttempts.id, attemptId),
        eq(trialAttempts.userId, userId)
      ));

    if (!attempt) {
      return { success: false, error: "Trial attempt not found" };
    }

    if (attempt.completed) {
      return { success: false, error: "Trial already completed" };
    }

    const config = getTrialTier(attempt.trialTier);
    if (!config) {
      return { success: false, error: "Invalid trial tier" };
    }

    const currentWaveIndex = attempt.wavesCompleted ?? 0;
    if (currentWaveIndex >= config.waves.length) {
      return { success: false, error: "All waves already completed" };
    }

    const wave = config.waves[currentWaveIndex];
    const powerRatio = playerPower / Math.max(config.powerRequirement * wave.enemyPower, 1);
    const success = powerRatio >= 0.5;

    if (!success) {
      const existingRewards = (attempt.rewards as any[]) || [];

      await db
        .update(trialAttempts)
        .set({
          completed: true,
          rewards: existingRewards,
        })
        .where(eq(trialAttempts.id, attemptId));

      let [userTrial] = await db
        .select()
        .from(trials)
        .where(and(
          eq(trials.userId, userId),
          eq(trials.trialTier, attempt.trialTier)
        ));

      if (userTrial) {
        await db
          .update(trials)
          .set({
            totalAttempts: (userTrial.totalAttempts ?? 0) + 1,
            bestWave: Math.max(userTrial.bestWave ?? 0, currentWaveIndex),
            updatedAt: new Date(),
          })
          .where(eq(trials.id, userTrial.id));
      }

      return {
        success: true,
        waveCompleted: false,
        wavesCleared: currentWaveIndex,
        totalWaves: config.waves.length,
        completed: true,
      };
    }

    const newWavesCompleted = currentWaveIndex + 1;
    const waveRewards = wave.rewards
      .filter(r => Math.random() < r.chance)
      .map(r => ({ ...r }));

    const allCompleted = newWavesCompleted >= config.waves.length;
    const existingRewards = (attempt.rewards as any[]) || [];

    await db
      .update(trialAttempts)
      .set({
        wavesCompleted: newWavesCompleted,
        rewards: [...existingRewards, ...waveRewards],
        completed: allCompleted,
      })
      .where(eq(trialAttempts.id, attemptId));

    let [userTrial] = await db
      .select()
      .from(trials)
      .where(and(
        eq(trials.userId, userId),
        eq(trials.trialTier, attempt.trialTier)
      ));

    if (userTrial) {
      await db
        .update(trials)
        .set({
          totalCompletions: allCompleted ? (userTrial.totalCompletions ?? 0) + 1 : userTrial.totalCompletions,
          totalAttempts: allCompleted ? (userTrial.totalAttempts ?? 0) + 1 : userTrial.totalAttempts,
          bestWave: Math.max(userTrial.bestWave ?? 0, newWavesCompleted),
          lastCompletedAt: allCompleted ? new Date() : userTrial.lastCompletedAt,
          updatedAt: new Date(),
        })
        .where(eq(trials.id, userTrial.id));
    }

    const result: ResolveWaveResult = {
      success: true,
      waveCompleted: true,
      wavesCleared: newWavesCompleted,
      totalWaves: config.waves.length,
      completed: allCompleted,
      rewards: waveRewards,
    };

    if (!allCompleted) {
      const nextWave = config.waves[newWavesCompleted];
      result.nextWave = {
        ...nextWave,
        difficultyRating: calculateWaveDifficulty(playerPower, nextWave, config),
      };
    }

    return result;
  }

  async completeTrial(userId: string, attemptId: string, playerPower: number): Promise<CompleteTrialResult> {
    const [attempt] = await db
      .select()
      .from(trialAttempts)
      .where(and(
        eq(trialAttempts.id, attemptId),
        eq(trialAttempts.userId, userId)
      ));

    if (!attempt) {
      return { success: false, error: "Trial attempt not found" };
    }

    if (attempt.completed) {
      return { success: false, error: "Trial already completed" };
    }

    const config = getTrialTier(attempt.trialTier);
    if (!config) {
      return { success: false, error: "Invalid trial tier" };
    }

    const wavesCleared = attempt.wavesCompleted ?? 0;
    const basePoints = wavesCleared * 20;
    const completionTime = Date.now() - (attempt.createdAt?.getTime() ?? Date.now());
    const isFlawless = wavesCleared >= (attempt.totalWaves ?? 1);

    const pointsEarned = calculateTrialPoints(basePoints, attempt.trialTier, completionTime, isFlawless);

    const rewardBundle = rewardDistributionService.buildRewardsFromEncounter(
      { type: "trial", difficulty: attempt.trialTier * 2 },
      playerPower,
      attempt.trialTier * 2
    );

    const existingRewards = (attempt.rewards as any[]) || [];
    rewardBundle.items = [
      ...(rewardBundle.items || []),
      ...existingRewards.map((r: any, i: number) => ({
        id: `trial_reward_${attempt.trialTier}_${i}`,
        name: r.name || `Trial Tier ${attempt.trialTier} Reward`,
        quantity: r.quantity || r.amount || 1,
      })),
    ];

    await rewardDistributionService.distributeRewards(userId, rewardBundle, `trial_complete_tier_${attempt.trialTier}`);

    await db
      .update(trialAttempts)
      .set({
        completed: true,
        pointsEarned,
        completionTime,
      })
      .where(eq(trialAttempts.id, attemptId));

    let [userTrial] = await db
      .select()
      .from(trials)
      .where(and(
        eq(trials.userId, userId),
        eq(trials.trialTier, attempt.trialTier)
      ));

    if (userTrial) {
      await db
        .update(trials)
        .set({
          totalCompletions: (userTrial.totalCompletions ?? 0) + 1,
          totalAttempts: (userTrial.totalAttempts ?? 0) + 1,
          totalPointsEarned: (userTrial.totalPointsEarned ?? 0) + pointsEarned,
          bestWave: Math.max(userTrial.bestWave ?? 0, wavesCleared),
          bestTime: Math.min(userTrial.bestTime ?? completionTime, completionTime),
          flawlessCompletions: (userTrial.flawlessCompletions ?? 0) + (isFlawless ? 1 : 0),
          lastCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(trials.id, userTrial.id));
    }

    const [existing] = await db
      .select()
      .from(trialLeaderboard)
      .where(and(
        eq(trialLeaderboard.userId, userId),
        eq(trialLeaderboard.trialTier, attempt.trialTier)
      ));

    if (existing) {
      await db
        .update(trialLeaderboard)
        .set({
          bestTime: Math.min(existing.bestTime ?? completionTime, completionTime),
          bestWave: Math.max(existing.bestWave ?? 0, wavesCleared),
          points: Math.max(existing.points ?? 0, pointsEarned),
          updatedAt: new Date(),
        })
        .where(eq(trialLeaderboard.id, existing.id));
    } else {
      await db
        .insert(trialLeaderboard)
        .values({
          userId,
          trialTier: attempt.trialTier,
          bestTime: completionTime,
          bestWave: wavesCleared,
          points: pointsEarned,
        });
    }

    return {
      success: true,
      pointsEarned,
      rewards: rewardBundle.items,
      leaderboard: { bestTime: completionTime, bestWave: wavesCleared, points: pointsEarned },
    };
  }

  async getPlayerTrials(userId: string) {
    const records = await db
      .select()
      .from(trials)
      .where(eq(trials.userId, userId));

    if (records.length === 0) {
      const defaultInsert = await db
        .insert(trials)
        .values({ userId, trialTier: 1 })
        .returning();
      return defaultInsert.map(t => ({
        ...t,
        config: getTrialTier(t.trialTier),
      }));
    }

    return records.map(t => ({
      ...t,
      config: getTrialTier(t.trialTier),
    }));
  }

  async getTrialLeaderboard(tier: number, limit: number = 50) {
    return await db
      .select()
      .from(trialLeaderboard)
      .where(eq(trialLeaderboard.trialTier, tier))
      .orderBy(trialLeaderboard.points)
      .limit(Math.min(limit, 100));
  }

  async getTrialDetails(userId: string, tier: number) {
    const [record] = await db
      .select()
      .from(trials)
      .where(and(
        eq(trials.userId, userId),
        eq(trials.trialTier, tier)
      ));

    const recentAttempts = await db
      .select()
      .from(trialAttempts)
      .where(and(
        eq(trialAttempts.userId, userId),
        eq(trialAttempts.trialTier, tier)
      ))
      .orderBy(trialAttempts.createdAt)
      .limit(10);

    const config = getTrialTier(tier);

    return {
      record: record || { userId, trialTier: tier, bestWave: 0, totalCompletions: 0, totalAttempts: 0 },
      recentAttempts,
      config,
    };
  }
}

export const trialsService = new TrialsService();
