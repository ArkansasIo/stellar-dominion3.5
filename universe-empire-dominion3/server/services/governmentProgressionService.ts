/**
 * Government Progression Service
 * Manages user's government progression state, unlocking nodes, and calculating effects
 */

import type { Express, Request, Response } from 'express';
import { storage } from '../storage';
import {
  GOVERNMENT_PROGRESSION_TREE_DEFINITION,
  GOVERNMENT_MAX_LEVEL,
  GOVERNMENT_MAX_TIER,
  LEVELS_PER_TIER,
  type GovernmentPillar,
  type GovernmentProgressionNode,
  getGovernmentNodeById,
  getNodesByPillar,
  canUnlockNode,
  calculateNodeCost,
  calculateUnlockTime,
} from '../../shared/config/governmentProgressionTreeConfig';

const GOVERNMENT_PROGRESSION_PREFIX = 'government_progression';

export interface GovernmentProgressionState {
  level: number;
  tier: number;
  totalXP: number;
  pillarPoints: Record<GovernmentPillar, number>;
  unlockedNodes: string[];
  nodeRanks: Record<string, number>; // Store rank of each unlocked node
  activeEffects: Record<string, number>;
  lastUpdated: number;
}

export interface UserGovernmentStatus {
  userId: string;
  progression: GovernmentProgressionState;
  availableNodes: GovernmentProgressionNode[]; // Nodes that can be unlocked
  unlockedNodeDetails: GovernmentProgressionNode[];
  totalEffects: GovernmentProgressionState['activeEffects'];
}

function getProgressionKey(userId: string): string {
  return `${GOVERNMENT_PROGRESSION_PREFIX}:${userId}`;
}

// In-memory cache for performance
const progressionCache: Map<string, GovernmentProgressionState> = new Map();

function getDefaultProgressionState(): GovernmentProgressionState {
  return {
    level: 1,
    tier: 1,
    totalXP: 0,
    pillarPoints: {
      stability: 0,
      law: 0,
      economic: 0,
    },
    unlockedNodes: [],
    nodeRanks: {},
    activeEffects: {},
    lastUpdated: Date.now(),
  };
}

export async function initializeUserGovernmentProgression(userId: string): Promise<GovernmentProgressionState> {
  const progression = getDefaultProgressionState();
  progressionCache.set(userId, progression);
  await storage.setSetting(getProgressionKey(userId), { value: progression, expiresAt: null });
  return progression;
}

export async function getUserGovernmentProgression(userId: string): Promise<GovernmentProgressionState> {
  // Check cache first
  if (progressionCache.has(userId)) {
    return progressionCache.get(userId)!;
  }

  try {
    const setting = await storage.getSetting(getProgressionKey(userId));
    if (setting?.value) {
      const progression = setting.value as GovernmentProgressionState;
      progressionCache.set(userId, progression);
      return progression;
    }
  } catch (error) {
    console.error('[government-progression] Error reading progression:', error);
  }

  // Initialize if not found
  return initializeUserGovernmentProgression(userId);
}

export async function saveUserGovernmentProgression(
  userId: string,
  progression: GovernmentProgressionState
): Promise<void> {
  progression.lastUpdated = Date.now();
  progressionCache.set(userId, progression);
  await storage.setSetting(getProgressionKey(userId), { value: progression, expiresAt: null });
}

export function getAvailableNodes(
  userId: string,
  progression: GovernmentProgressionState
): GovernmentProgressionNode[] {
  return GOVERNMENT_PROGRESSION_TREE_DEFINITION.nodes.filter((node: GovernmentProgressionNode) => {
    // Node is available if it can be unlocked and hasn't been unlocked yet
    return (
      !progression.unlockedNodes.includes(node.id) &&
      canUnlockNode(node, progression.unlockedNodes, progression.pillarPoints, progression.level)
    );
  });
}

export async function unlockNode(
  userId: string,
  nodeId: string,
  rank: number = 1
): Promise<{ success: boolean; message: string; progression?: GovernmentProgressionState }> {
  const progression = await getUserGovernmentProgression(userId);
  const node = getGovernmentNodeById(nodeId);

  if (!node) {
    return { success: false, message: 'Node not found' };
  }

  if (progression.unlockedNodes.includes(nodeId)) {
    return { success: false, message: 'Node already unlocked' };
  }

  if (!canUnlockNode(node, progression.unlockedNodes, progression.pillarPoints, progression.level)) {
    return { success: false, message: 'Requirements not met for this node' };
  }

  if (rank < 1 || rank > node.maxRank) {
    return { success: false, message: `Invalid rank: must be between 1 and ${node.maxRank}` };
  }

  // Unlock the node
  progression.unlockedNodes.push(nodeId);
  progression.nodeRanks[nodeId] = rank;

  // Add pillar points
  progression.pillarPoints[node.pillar] += 10 * rank; // 10 points per rank

  // Apply effects
  applyNodeEffects(progression, node, rank);

  await saveUserGovernmentProgression(userId, progression);

  return {
    success: true,
    message: `Successfully unlocked ${node.name}`,
    progression,
  };
}

export async function rankUpNode(
  userId: string,
  nodeId: string
): Promise<{ success: boolean; message: string; progression?: GovernmentProgressionState }> {
  const progression = await getUserGovernmentProgression(userId);
  const node = getGovernmentNodeById(nodeId);

  if (!node) {
    return { success: false, message: 'Node not found' };
  }

  const currentRank = progression.nodeRanks[nodeId] || 0;

  if (currentRank === 0) {
    return { success: false, message: 'Node must be unlocked first' };
  }

  if (currentRank >= node.maxRank) {
    return { success: false, message: 'Node is already at maximum rank' };
  }

  const newRank = currentRank + 1;
  progression.nodeRanks[nodeId] = newRank;

  // Add bonus pillar points
  progression.pillarPoints[node.pillar] += 5;

  // Re-apply effects with new rank
  recalculateAllEffects(progression);

  await saveUserGovernmentProgression(userId, progression);

  return {
    success: true,
    message: `${node.name} advanced to rank ${newRank}`,
    progression,
  };
}

function applyNodeEffects(
  progression: GovernmentProgressionState,
  node: GovernmentProgressionNode,
  rank: number
): void {
  const rankMultiplier = Math.pow(1.05, rank - 1); // 5% per rank

  // Apply each effect with rank scaling
  Object.entries(node.effects).forEach(([key, value]: [string, number]) => {
    if (value !== 0) {
      const effectKey = `${node.pillar}_${key}`;
      progression.activeEffects[effectKey] =
        (progression.activeEffects[effectKey] || 0) + value * rankMultiplier;
    }
  });
}

function recalculateAllEffects(progression: GovernmentProgressionState): void {
  // Reset effects
  progression.activeEffects = {};

  // Reapply all unlocked node effects
  progression.unlockedNodes.forEach(nodeId => {
    const node = getGovernmentNodeById(nodeId);
    if (node) {
      const rank = progression.nodeRanks[nodeId] || 1;
      applyNodeEffects(progression, node, rank);
    }
  });
}

export async function addGovernmentXP(
  userId: string,
  amount: number,
  pillar?: GovernmentPillar
): Promise<{ progression: GovernmentProgressionState; leveledUp: boolean; newLevel: number }> {
  const progression = await getUserGovernmentProgression(userId);
  let leveledUp = false;
  let newLevel = progression.level;

  progression.totalXP += amount;

  // Calculate level from XP (exponential scaling)
  const xpPerLevel = 1000 * Math.pow(1.1, progression.level - 1);
  let requiredXP = 0;

  for (let level = 1; level <= GOVERNMENT_MAX_LEVEL; level++) {
    requiredXP += xpPerLevel * Math.pow(1.1, level - 2);
    if (progression.totalXP >= requiredXP && level > progression.level) {
      newLevel = level;
      progression.level = level;
      progression.tier = Math.ceil(level / LEVELS_PER_TIER);
      leveledUp = true;
    }
  }

  // Add pillar points if specified
  if (pillar) {
    progression.pillarPoints[pillar] += Math.floor(amount / 100);
  }

  await saveUserGovernmentProgression(userId, progression);

  return {
    progression,
    leveledUp,
    newLevel,
  };
}

export async function getGovernmentStatus(userId: string): Promise<UserGovernmentStatus> {
  const progression = await getUserGovernmentProgression(userId);
  const availableNodes = getAvailableNodes(userId, progression);

  const unlockedNodeDetails = progression.unlockedNodes
    .map(nodeId => getGovernmentNodeById(nodeId))
    .filter((node): node is GovernmentProgressionNode => node !== undefined);

  // Calculate total effects
  const totalEffects: Record<string, number> = {};
  unlockedNodeDetails.forEach(node => {
    const rank = progression.nodeRanks[node.id] || 1;
    const rankMultiplier = Math.pow(1.05, rank - 1);

    Object.entries(node.effects).forEach(([key, value]: [string, number]) => {
      if (value !== 0) {
        const effectKey = `${node.pillar}_${key}`;
        totalEffects[effectKey] = (totalEffects[effectKey] || 0) + value * rankMultiplier;
      }
    });
  });

  return {
    userId,
    progression,
    availableNodes,
    unlockedNodeDetails,
    totalEffects,
  };
}

export async function getPillarStatus(
  userId: string
): Promise<
  {
    pillar: GovernmentPillar;
    level: number;
    points: number;
    nodes: number;
  }[]
> {
  const status = await getGovernmentStatus(userId);
  const progression = status.progression;

  return ['stability', 'law', 'economic'].map(pillar => ({
    pillar: pillar as GovernmentPillar,
    level: Math.floor(progression.pillarPoints[pillar as GovernmentPillar] / 50),
    points: progression.pillarPoints[pillar as GovernmentPillar],
    nodes: status.unlockedNodeDetails.filter(n => n.pillar === pillar).length,
  }));
}

export async function resetGovernmentProgression(userId: string): Promise<GovernmentProgressionState> {
  // Clear cache
  progressionCache.delete(userId);
  return initializeUserGovernmentProgression(userId);
}

export { getGovernmentNodeById, getNodesByPillar, calculateNodeCost, calculateUnlockTime };
