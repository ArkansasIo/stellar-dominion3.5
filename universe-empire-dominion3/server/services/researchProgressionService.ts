/**
 * Research Progression Service
 * Technology research management, queue processing, prerequisites, and progression
 */

import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { playerStates, queueItems } from "../../shared/schema";
import {
  ALL_TECHNOLOGIES,
  RESEARCH_CONFIGS,
  RESEARCH_EXPANSION_TECHNOLOGIES,
  calculateResearchCost as calcCost,
  calculateResearchTime as calcTime,
  getPrerequisites,
  isResearchUnlocked,
  type ResearchBranch,
  type Research,
} from "../../shared/config/researchProgression";
import {
  TECH_PROGRESSION,
  type TechBranch,
  type TechnologyNode,
} from "../../shared/config/technologyTreeConfig";

type ActiveResearch = {
  techId: string;
  techName: string;
  branch: string;
  tier: number;
  currentLevel: number;
  progress: number;
  totalTurns: number;
  startedAt: string;
  endsAt: string;
} | null;

function getResearchLevel(research: Record<string, number>, techId: string): number {
  return research[techId] || 0;
}

function checkPrerequisites(userId: string, techId: string, research: Record<string, number>): { met: boolean; missing: string[] } {
  const config = RESEARCH_CONFIGS[techId];
  if (!config) {
    const tech = ALL_TECHNOLOGIES.find(t => t.id === techId);
    if (tech) {
      const prereqs = getPrerequisites(techId);
      const missing = prereqs.filter(p => !research[p] || research[p] <= 0);
      return { met: missing.length === 0, missing };
    }
    return { met: false, missing: ["unknown_tech"] };
  }

  const missing = config.prerequisites.filter(prereq => {
    return !research[prereq] || research[prereq] <= 0;
  });

  return { met: missing.length === 0, missing };
}

export class ResearchProgressionService {
  static async startResearch(userId: string, techId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const research = (state.research || {}) as Record<string, number>;
    const activeResearch = state.activeResearch as ActiveResearch;

    if (activeResearch) {
      throw new Error(`Already researching: ${activeResearch.techName}. Cancel it first.`);
    }

    const prereqCheck = checkPrerequisites(userId, techId, research);
    if (!prereqCheck.met) {
      throw new Error(`Missing prerequisites: ${prereqCheck.missing.join(", ")}`);
    }

    const currentLevel = getResearchLevel(research, techId);
    const tech = ALL_TECHNOLOGIES.find(t => t.id === techId);
    if (!tech) throw new Error(`Unknown technology: ${techId}`);

    const config = RESEARCH_CONFIGS[techId];
    const tier = tech.tier;
    const cost = config ? calcCost(techId, currentLevel + 1, tier) : {
      metal: Math.floor(100 * (currentLevel + 1) * tier),
      crystal: Math.floor(80 * (currentLevel + 1) * tier),
      deuterium: Math.floor(40 * (currentLevel + 1) * tier),
    };

    if (!cost) throw new Error("Could not calculate research cost");

    const resources = (state.resources || {}) as Record<string, number>;
    if ((resources.metal || 0) < cost.metal) throw new Error(`Insufficient metal: need ${cost.metal}`);
    if ((resources.crystal || 0) < cost.crystal) throw new Error(`Insufficient crystal: need ${cost.crystal}`);
    if ((resources.deuterium || 0) < cost.deuterium) throw new Error(`Insufficient deuterium: need ${cost.deuterium}`);

    const labLevel = (state.researchLab as any)?.level || 1;
    const labBonus = 1 - (labLevel - 1) * 0.05;
    const totalTurns = config
      ? Math.max(1, Math.ceil((calcTime(techId, currentLevel + 1, tier) || 600) * labBonus / 100))
      : Math.max(1, Math.ceil(5 * (currentLevel + 1) * tier * labBonus));

    resources.metal = (resources.metal || 0) - cost.metal;
    resources.crystal = (resources.crystal || 0) - cost.crystal;
    resources.deuterium = (resources.deuterium || 0) - cost.deuterium;

    const now = new Date();
    const endsAt = new Date(now.getTime() + totalTurns * 60 * 1000);

    const activeResearchData: ActiveResearch = {
      techId,
      techName: tech.name,
      branch: tech.branch,
      tier,
      currentLevel,
      progress: 0,
      totalTurns,
      startedAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
    };

    await db.update(playerStates).set({
      resources,
      activeResearch: activeResearchData,
    }).where(eq(playerStates.userId, userId));

    await db.insert(queueItems).values({
      userId,
      type: "research",
      itemId: techId,
      itemName: tech.name,
      startTime: now,
      endTime: endsAt,
    });

    return {
      techId,
      techName: tech.name,
      level: currentLevel + 1,
      cost,
      totalTurns,
      startsAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
    };
  }

  static async cancelResearch(userId: string, techId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const activeResearch = state.activeResearch as ActiveResearch;
    if (!activeResearch || activeResearch.techId !== techId) {
      throw new Error("No active research to cancel for this technology");
    }

    const config = RESEARCH_CONFIGS[techId];
    const currentLevel = activeResearch.currentLevel;
    const tier = activeResearch.tier;
    const cost = config ? calcCost(techId, currentLevel + 1, tier) : null;

    if (cost) {
      const resources = (state.resources || {}) as Record<string, number>;
      const refund = 0.5;
      resources.metal = (resources.metal || 0) + Math.floor(cost.metal * refund);
      resources.crystal = (resources.crystal || 0) + Math.floor(cost.crystal * refund);
      resources.deuterium = (resources.deuterium || 0) + Math.floor(cost.deuterium * refund);
      await db.update(playerStates).set({ resources, activeResearch: null }).where(eq(playerStates.userId, userId));
    } else {
      await db.update(playerStates).set({ activeResearch: null }).where(eq(playerStates.userId, userId));
    }

    await db.delete(queueItems).where(
      and(eq(queueItems.userId, userId), eq(queueItems.itemId, techId), eq(queueItems.type, "research"))
    );

    return { cancelled: true, techId, refundPercent: 50 };
  }

  static async processResearchTick(userId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const activeResearch = state.activeResearch as ActiveResearch;
    if (!activeResearch) return { completed: false, message: "No active research" };

    const newProgress = activeResearch.progress + 1;

    if (newProgress >= activeResearch.totalTurns) {
      const research = (state.research || {}) as Record<string, number>;
      const currentLevel = research[activeResearch.techId] || 0;
      research[activeResearch.techId] = currentLevel + 1;

      const config = RESEARCH_CONFIGS[activeResearch.techId];
      const completedTech = ALL_TECHNOLOGIES.find(t => t.id === activeResearch.techId);

      await db.update(playerStates).set({
        research,
        activeResearch: null,
        researchHistory: [...(state.researchHistory as any[] || []), {
          techId: activeResearch.techId,
          level: currentLevel + 1,
          completedAt: new Date().toISOString(),
        }],
      }).where(eq(playerStates.userId, userId));

      await db.delete(queueItems).where(
        and(eq(queueItems.userId, userId), eq(queueItems.itemId, activeResearch.techId), eq(queueItems.type, "research"))
      );

      return {
        completed: true,
        techId: activeResearch.techId,
        techName: activeResearch.techName,
        newLevel: currentLevel + 1,
        unlocks: config ? {
          buildings: config.unlocksBuild,
          units: config.unlocksUnit,
          research: config.unlocksResearch,
        } : null,
      };
    }

    await db.update(playerStates).set({
      activeResearch: { ...activeResearch, progress: newProgress },
    }).where(eq(playerStates.userId, userId));

    return {
      completed: false,
      progress: newProgress,
      totalTurns: activeResearch.totalTurns,
      percent: Math.round((newProgress / activeResearch.totalTurns) * 100),
    };
  }

  static async getResearchProgress(userId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    return {
      activeResearch: state.activeResearch,
      researchQueue: state.researchQueue,
      researchHistory: state.researchHistory,
      completedResearch: state.research,
    };
  }

  static async getAvailableTechs(userId: string) {
    const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId));
    if (!state) throw new Error("Player state not found");

    const research = (state.research || {}) as Record<string, number>;

    return ALL_TECHNOLOGIES.filter(tech => {
      const currentLevel = research[tech.id] || 0;
      if (currentLevel >= tech.maxLevel) return false;

      const prereqCheck = checkPrerequisites(userId, tech.id, research);
      return prereqCheck.met;
    }).map(tech => {
      const currentLevel = research[tech.id] || 0;
      return {
        ...tech,
        currentLevel,
        isResearched: currentLevel > 0,
      };
    });
  }

  static calculateResearchTime(techId: string, labLevel: number, bonuses: Record<string, number> = {}) {
    const config = RESEARCH_CONFIGS[techId];
    const tech = ALL_TECHNOLOGIES.find(t => t.id === techId);
    if (!tech) return null;

    const tier = tech.tier;
    const baseTime = config ? (calcTime(techId, 1, tier) || 600) : 5 * tier;
    const labBonus = 1 - (labLevel - 1) * 0.05;
    const speedBonus = 1 - (bonuses.speed || 0) * 0.01;

    return Math.max(1, Math.ceil(baseTime * labBonus * speedBonus));
  }

  static calculateResearchCost = calcCost;

  static checkPrerequisites(userId: string, techId: string) {
    const research: Record<string, number> = {};
    return checkPrerequisites(userId, techId, research);
  }

  static getTechByBranch(branch: ResearchBranch) {
    return ALL_TECHNOLOGIES.filter(t => t.branch === branch);
  }
}

export default ResearchProgressionService;
