import { db } from "../db";
import { eq, and, desc, sql } from "drizzle-orm";
import { dimensionalAnomalies, dimensionalContracts, abyssalGateTokens } from "../../Source/Shared/schema";
import { DIMENSIONAL_ANOMALIES } from "../../Source/Shared/config/dimensionalAnomaliesConfig";

interface ProgressionState {
  playerId: string;
  anomalyDiscoveries: number;
  anomalyExplorations: number;
  regionsExplored: string[];
  completedGates: number[];
  completedContracts: number[];
  currentPower: number;
}

export class ProgressionPipelineService {
  private readonly GATE_UNLOCK_REQUIREMENTS: Record<number, { anomalies: number; regions: number; minPower: number }> = {
    1: { anomalies: 1, regions: 0, minPower: 0 },
    2: { anomalies: 5, regions: 0, minPower: 1000 },
    3: { anomalies: 10, regions: 0, minPower: 2500 },
    4: { anomalies: 10, regions: 1, minPower: 5000 },
    5: { anomalies: 15, regions: 1, minPower: 8000 },
    6: { anomalies: 20, regions: 2, minPower: 12000 },
    7: { anomalies: 25, regions: 2, minPower: 18000 },
    8: { anomalies: 30, regions: 3, minPower: 25000 },
    9: { anomalies: 35, regions: 3, minPower: 35000 },
  };

  private readonly CONTRACT_UNLOCK_REQUIREMENTS: Record<number, { gateTier: number; minPower: number; previousContracts: number }> = {
    1: { gateTier: 0, minPower: 0, previousContracts: 0 },
    2: { gateTier: 1, minPower: 1000, previousContracts: 3 },
    3: { gateTier: 2, minPower: 2500, previousContracts: 6 },
    4: { gateTier: 3, minPower: 5000, previousContracts: 9 },
    5: { gateTier: 4, minPower: 8000, previousContracts: 12 },
    6: { gateTier: 5, minPower: 12000, previousContracts: 15 },
    7: { gateTier: 6, minPower: 18000, previousContracts: 18 },
    8: { gateTier: 7, minPower: 25000, previousContracts: 24 },
    9: { gateTier: 8, minPower: 35000, previousContracts: 30 },
  };

  async getProgressionState(userId: string): Promise<ProgressionState> {
    const { storage } = await import("../storage");
    const state = await storage.getPlayerState(userId);

    const anomalies = await db
      .select()
      .from(dimensionalAnomalies)
      .where(eq(dimensionalAnomalies.userId, userId));

    const discoveries = anomalies.filter((a) => a.discovered).length;
    const explorations = anomalies.filter((a) => a.explorationCount && a.explorationCount > 0).length;

    const anomalyConfigs = DIMENSIONAL_ANOMALIES;
    const regionSet = new Set<string>();
    for (const a of anomalies) {
      if (a.explorationCount && a.explorationCount > 0) {
        const config = anomalyConfigs.find((c) => c.id === a.anomalyId);
        if (config?.region) regionSet.add(config.region);
      }
    }

    const contracts = await db
      .select()
      .from(dimensionalContracts)
      .where(eq(dimensionalContracts.userId, userId));

    const gates = await db
      .select()
      .from(abyssalGateTokens)
      .where(eq(abyssalGateTokens.userId, userId));

    const playerPower = state ? ((state as any).powerLevel || 0) : 0;

    return {
      playerId: userId,
      anomalyDiscoveries: discoveries,
      anomalyExplorations: explorations,
      regionsExplored: Array.from(regionSet),
      completedGates: gates.filter((g) => g.gatesCompleted && g.gatesCompleted > 0).map((g) => g.gateTier),
      completedContracts: contracts.filter((c) => c.raidsCompleted && c.raidsCompleted > 0).map((c) => c.contractTier),
      currentPower: playerPower,
    };
  }

  getUnlockedGates(state: ProgressionState): number[] {
    const unlocked: number[] = [];
    for (let tier = 1; tier <= 9; tier++) {
      const req = this.GATE_UNLOCK_REQUIREMENTS[tier];
      if (!req) continue;
      if (
        state.anomalyExplorations >= req.anomalies &&
        state.regionsExplored.length >= req.regions &&
        state.currentPower >= req.minPower
      ) {
        unlocked.push(tier);
      }
    }
    return unlocked;
  }

  getNextGateLockReason(state: ProgressionState): { tier: number; reason: string } | null {
    const nextTier = (state.completedGates.length || 0) + 1;
    if (nextTier > 9) return null;

    const req = this.GATE_UNLOCK_REQUIREMENTS[nextTier];
    if (!req) return null;

    if (state.anomalyExplorations < req.anomalies) {
      return { tier: nextTier, reason: `Explore ${req.anomalies} anomalies (${state.anomalyExplorations}/${req.anomalies})` };
    }
    if (state.regionsExplored.length < req.regions) {
      return { tier: nextTier, reason: `Explore ${req.regions} regions (${state.regionsExplored.length}/${req.regions})` };
    }
    if (state.currentPower < req.minPower) {
      return { tier: nextTier, reason: `Reach power ${req.minPower} (current: ${state.currentPower})` };
    }
    return null;
  }

  getUnlockedContractTiers(state: ProgressionState): number[] {
    const unlocked: number[] = [];
    for (let tier = 1; tier <= 9; tier++) {
      const req = this.CONTRACT_UNLOCK_REQUIREMENTS[tier];
      if (!req) continue;
      const canAccessGate = req.gateTier === 0 || state.completedGates.includes(req.gateTier) || state.completedGates.some((g) => g >= req.gateTier);
      const hasEnoughContracts = state.completedContracts.length >= req.previousContracts;
      if (canAccessGate && hasEnoughContracts && state.currentPower >= req.minPower) {
        unlocked.push(tier);
      }
    }
    return unlocked;
  }

  getNextContractLockReason(state: ProgressionState): { tier: number; reason: string } | null {
    const nextTier = (state.completedContracts.length || 0) + 1;
    if (nextTier > 9) return null;

    const req = this.CONTRACT_UNLOCK_REQUIREMENTS[nextTier];
    if (!req) return null;

    if (req.gateTier > 0 && !state.completedGates.some((g) => g >= req.gateTier)) {
      return { tier: nextTier, reason: `Complete gate tier ${req.gateTier} to unlock` };
    }
    if (state.completedContracts.length < req.previousContracts) {
      return { tier: nextTier, reason: `Complete ${req.previousContracts} contracts (${state.completedContracts.length}/${req.previousContracts})` };
    }
    if (state.currentPower < req.minPower) {
      return { tier: nextTier, reason: `Reach power ${req.minPower} (current: ${state.currentPower})` };
    }
    return null;
  }

  async canAccessGate(userId: string, tier: number): Promise<{ allowed: boolean; reason?: string }> {
    const state = await this.getProgressionState(userId);
    const unlocked = this.getUnlockedGates(state);
    if (unlocked.includes(tier)) {
      return { allowed: true };
    }
    const req = this.GATE_UNLOCK_REQUIREMENTS[tier];
    if (!req) return { allowed: false, reason: "Unknown gate tier" };

    if (state.anomalyExplorations < req.anomalies) {
      return { allowed: false, reason: `Need ${req.anomalies} explored anomalies (have ${state.anomalyExplorations})` };
    }
    if (state.regionsExplored.length < req.regions) {
      return { allowed: false, reason: `Need ${req.regions} explored regions (have ${state.regionsExplored.length})` };
    }
    if (state.currentPower < req.minPower) {
      return { allowed: false, reason: `Need power ${req.minPower} (have ${state.currentPower})` };
    }
    return { allowed: false, reason: "Requirements not met" };
  }

  async canAccessContract(userId: string, tier: number): Promise<{ allowed: boolean; reason?: string }> {
    const state = await this.getProgressionState(userId);
    const unlocked = this.getUnlockedContractTiers(state);
    if (unlocked.includes(tier)) {
      return { allowed: true };
    }
    const req = this.CONTRACT_UNLOCK_REQUIREMENTS[tier];
    if (!req) return { allowed: false, reason: "Unknown contract tier" };

    if (req.gateTier > 0 && !state.completedGates.some((g) => g >= req.gateTier)) {
      return { allowed: false, reason: `Need gate tier ${req.gateTier}` };
    }
    if (state.completedContracts.length < req.previousContracts) {
      return { allowed: false, reason: `Need ${req.previousContracts} completed contracts (have ${state.completedContracts.length})` };
    }
    if (state.currentPower < req.minPower) {
      return { allowed: false, reason: `Need power ${req.minPower} (have ${state.currentPower})` };
    }
    return { allowed: false, reason: "Requirements not met" };
  }

  async getProgressionOverview(userId: string) {
    const state = await this.getProgressionState(userId);
    const unlockedGates = this.getUnlockedGates(state);
    const unlockedContracts = this.getUnlockedContractTiers(state);
    const nextGateLock = this.getNextGateLockReason(state);
    const nextContractLock = this.getNextContractLockReason(state);

    return {
      anomalyProgress: {
        totalDiscoveries: state.anomalyDiscoveries,
        totalExplorations: state.anomalyExplorations,
        regionsExplored: state.regionsExplored,
      },
      gates: {
        unlocked: unlockedGates,
        completed: state.completedGates,
        nextLock: nextGateLock,
      },
      contracts: {
        unlocked: unlockedContracts,
        completed: state.completedContracts,
        nextLock: nextContractLock,
      },
      power: state.currentPower,
    };
  }
}

export const progressionPipelineService = new ProgressionPipelineService();
