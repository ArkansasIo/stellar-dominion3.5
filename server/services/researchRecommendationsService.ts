/**
 * Research Recommendations Engine
 * Analyzes player progression and suggests optimal research path
 * @tag #research #recommendations #ai #strategy
 */

import { pool } from '../db';
import { researches } from '../../researches';

type RecommendationTech = {
  id: string;
  name: string;
  class: string;
  tier: 'basic' | 'standard' | 'advanced' | 'military' | 'experimental' | 'ancient' | 'exotic';
  cost: { metal: number; crystal: number; deuterium: number };
  baseTurns: number;
  prerequisites: string[];
  unlocks: string[];
};

export class ResearchRecommendationsService {
  private static techCatalog: RecommendationTech[] | null = null;

  private static getTierForIndex(index: number): RecommendationTech['tier'] {
    if (index < 20) return 'basic';
    if (index < 45) return 'standard';
    if (index < 70) return 'advanced';
    if (index < 95) return 'military';
    if (index < 120) return 'experimental';
    if (index < 150) return 'ancient';
    return 'exotic';
  }

  private static getTierMultiplier(tier: RecommendationTech['tier']): number {
    switch (tier) {
      case 'basic': return 1;
      case 'standard': return 1.8;
      case 'advanced': return 2.8;
      case 'military': return 4;
      case 'experimental': return 5.5;
      case 'ancient': return 7.5;
      case 'exotic': return 10;
      default: return 1;
    }
  }

  private static normalizeClassName(value: string): string {
    return String(value || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  private static buildTechCatalog(): RecommendationTech[] {
    if (this.techCatalog) return this.techCatalog;

    const byCategory: Record<string, RecommendationTech[]> = {};

    const catalog: RecommendationTech[] = researches.map((research, index) => {
      const tier = this.getTierForIndex(index);
      const multiplier = this.getTierMultiplier(tier);
      const baseCost = 1000 + index * 125;

      const tech: RecommendationTech = {
        id: research.id,
        name: research.name,
        class: this.normalizeClassName(research.category),
        tier,
        cost: {
          metal: Math.floor(baseCost * multiplier),
          crystal: Math.floor(baseCost * multiplier * 0.8),
          deuterium: Math.floor(baseCost * Math.max(0.3, multiplier - 0.5)),
        },
        baseTurns: Math.max(5, Math.floor(8 + index * 0.75 + multiplier * 5)),
        prerequisites: [],
        unlocks: [],
      };

      const category = research.category || 'general';
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(tech);

      return tech;
    });

    for (const categoryTechs of Object.values(byCategory)) {
      for (let i = 0; i < categoryTechs.length; i += 1) {
        const tech = categoryTechs[i];
        if (i > 0) tech.prerequisites.push(categoryTechs[i - 1].id);
        if (i < categoryTechs.length - 1) tech.unlocks.push(categoryTechs[i + 1].id);
      }
    }

    this.techCatalog = catalog;
    return catalog;
  }

  private static getTechById(techId: string): RecommendationTech | undefined {
    return this.buildTechCatalog().find((tech) => tech.id === techId);
  }

  private static getTechDepth(techId: string, visited = new Set<string>()): number {
    if (visited.has(techId)) return 0;
    visited.add(techId);

    const tech = this.getTechById(techId);
    if (!tech || tech.prerequisites.length === 0) return 0;

    return 1 + Math.max(...tech.prerequisites.map((pre) => this.getTechDepth(pre, new Set(visited))));
  }

  static async getRecommendations(userId: string, limit: number = 5): Promise<any> {
    try {
      const playerData = await pool.query(
        `SELECT research_queue, research_xp, resources, buildings FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        throw new Error(`Player not found`);
      }

      const player = playerData.rows[0];
      const queue = player.research_queue || [];
      const xpData = player.research_xp || {};
      const resources = player.resources || {};
      const buildings = player.buildings || {};

      const profile = this.analyzePlayerProfile(queue, xpData, resources, buildings);
      const techs = await this.getAvailableTechs(userId);

      const scoredTechs = techs.map((tech: any) => ({
        ...tech,
        recommendationScore: this.scoreResearch(tech, profile, queue),
      }));

      return {
        success: true,
        playerProfile: profile,
        recommendations: scoredTechs
          .sort((a: any, b: any) => b.recommendationScore - a.recommendationScore)
          .slice(0, limit),
        totalAvailable: techs.length,
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  static analyzePlayerProfile(
    queue: any[],
    xpData: any,
    resources: any,
    buildings: any
  ): any {
    const researchedClasses: { [key: string]: number } = {};
    queue.forEach((item: any) => {
      if (item.completed) {
        const key = this.normalizeClassName(item.techClass || item.class || item.category || 'general');
        researchedClasses[key] = (researchedClasses[key] || 0) + 1;
      }
    });

    const primarySpecialization = Object.entries(researchedClasses).sort(
      (a: any, b: any) => b[1] - a[1]
    )[0]?.[0] || 'balanced';

    const resourceRatio = {
      metal: resources.metal || 0,
      crystal: resources.crystal || 0,
      deuterium: resources.deuterium || 0,
    };

    const totalResources = Object.values(resourceRatio).reduce((a: any, b: any) => a + b, 0) as number;
    const abundantResource = Object.entries(resourceRatio).sort(
      (a: any, b: any) => (b[1] as number) - (a[1] as number)
    )[0]?.[0] || 'balanced';

    const level = xpData.currentLevel || 1;
    const researchesCompleted = xpData.researchesCompleted || 0;

    const progressionLevel =
      level < 10 ? 'early'
        : level < 30 ? 'mid'
          : level < 50 ? 'late'
            : 'endgame';

    const labLevel = Math.max(
      buildings.researchLab || 1,
      buildings.advancedLab || 1,
      buildings.eliteLab || 1
    );

    return {
      primarySpecialization,
      abundantResource,
      progressionLevel,
      level,
      researchesCompleted,
      labLevel,
      totalResources,
    };
  }

  static scoreResearch(tech: any, profile: any, currentQueue: any[]): number {
    let score = 0;

    const specializationBonus = tech.class === profile.primarySpecialization ? 25 : 5;
    score += specializationBonus;

    if (tech.cost) {
      const resourceOrder: Array<'metal' | 'crystal' | 'deuterium'> = ['metal', 'crystal', 'deuterium'];
      resourceOrder.sort((a, b) => (tech.cost[b] || 0) - (tech.cost[a] || 0));
      const dominantResource = resourceOrder[0];
      score += dominantResource === profile.abundantResource ? 15 : 5;
    }

    const tierProgression: { [key: string]: { [key: string]: number } } = {
      early: { basic: 15, standard: 5, advanced: 0, military: -10, experimental: -20, ancient: -20, exotic: -30 },
      mid: { basic: 10, standard: 15, advanced: 15, military: 10, experimental: 0, ancient: -10, exotic: -20 },
      late: { basic: 5, standard: 10, advanced: 15, military: 15, experimental: 15, ancient: 5, exotic: 0 },
      endgame: { basic: 0, standard: 5, advanced: 10, military: 15, experimental: 20, ancient: 25, exotic: 30 },
    };
    const tierBonus = tierProgression[profile.progressionLevel]?.[tech.tier] || 0;
    score += tierBonus;

    if (tech.unlocks && tech.unlocks.length > 0) {
      score += tech.unlocks.length * 10;
    }

    if (tech.prerequisites && tech.prerequisites.length > 0) {
      const meetsPrereqs = tech.prerequisites.every(
        (pre: string) =>
          currentQueue.find((q: any) => q.techId === pre && q.completed)
      );
      if (meetsPrereqs) {
        score += Math.min(tech.prerequisites.length * 5, 15);
      } else {
        score -= tech.prerequisites.length * 5;
      }
    }

    const timeEfficiency = 1000 / (tech.baseTurns || 1);
    score += Math.min(timeEfficiency / 100, 5);

    if (profile.progressionLevel === 'endgame' && tech.tier === 'exotic') {
      score += 50;
    }

    if (currentQueue.find((q: any) => q.techId === tech.id)) {
      score -= 100;
    }

    return score;
  }

  static async getAvailableTechs(userId: string): Promise<any[]> {
    try {
      const playerData = await pool.query(
        `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        return [];
      }

      const queue = playerData.rows[0].research_queue || [];
      const completedTechs = queue
        .filter((q: any) => q.completed)
        .map((q: any) => q.techId);

      const catalog = this.buildTechCatalog();
      return catalog.filter((tech) => {
        if (completedTechs.includes(tech.id)) return false;
        if (!tech.prerequisites.length) return true;
        return tech.prerequisites.every((pre) => completedTechs.includes(pre));
      });
    } catch (error) {
      console.error('Error getting available techs:', error);
      return [];
    }
  }

  static async getResearchPath(userId: string, goalTechId: string): Promise<any> {
    try {
      const playerData = await pool.query(
        `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        throw new Error(`Player not found`);
      }

      const queue = playerData.rows[0].research_queue || [];
      const completedTechs = queue
        .filter((q: any) => q.completed)
        .map((q: any) => q.techId);

      const path = this.findResearchPath(goalTechId, completedTechs);

      return {
        success: true,
        goalTech: goalTechId,
        path,
        steps: path.length,
        totalTurnsEstimate: path.reduce((acc: number, tech: any) => acc + (tech.baseTurns || 0), 0),
      };
    } catch (error) {
      console.error('Error getting research path:', error);
      throw error;
    }
  }

  static findResearchPath(goalTechId: string, completedTechs: string[]): any[] {
    const completed = new Set(completedTechs);
    const visiting = new Set<string>();
    const ordered: RecommendationTech[] = [];

    const visit = (techId: string) => {
      if (completed.has(techId) || visiting.has(techId)) return;
      const tech = this.getTechById(techId);
      if (!tech) return;

      visiting.add(techId);
      for (const prerequisite of tech.prerequisites) {
        visit(prerequisite);
      }
      visiting.delete(techId);

      if (!completed.has(techId)) {
        ordered.push(tech);
        completed.add(techId);
      }
    };

    visit(goalTechId);
    return ordered;
  }

  static async getOptimalQueue(userId: string, techIds: string[]): Promise<any> {
    try {
      const uniqueTechIds = Array.from(new Set(techIds));
      const catalog = this.buildTechCatalog();
      const byId = new Map(catalog.map((tech) => [tech.id, tech] as const));
      const missingIds = uniqueTechIds.filter((id) => !byId.has(id));

      const playerData = await pool.query(
        `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      const queue = playerData.rows[0]?.research_queue || [];
      const completedTechs = new Set<string>(
        queue.filter((q: any) => q.completed).map((q: any) => q.techId)
      );

      const expanded = new Set<string>();
      for (const id of uniqueTechIds) {
        const path = this.findResearchPath(id, Array.from(completedTechs));
        for (const tech of path) expanded.add(tech.id);
      }

      const toOrder = Array.from(expanded)
        .map((id) => byId.get(id))
        .filter((tech): tech is RecommendationTech => Boolean(tech));

      toOrder.sort((a, b) => {
        const depthA = this.getTechDepth(a.id);
        const depthB = this.getTechDepth(b.id);
        if (depthA !== depthB) return depthA - depthB;
        return a.baseTurns - b.baseTurns;
      });

      const optimalOrder = toOrder.map((tech) => tech.id);
      const estimatedTurns = toOrder.reduce((sum, tech) => sum + (tech.baseTurns || 0), 0);

      return {
        success: true,
        originalOrder: uniqueTechIds,
        optimalOrder,
        missingIds,
        estimatedTurns,
        estimatedSpeedup: `${Math.min(35, 5 + Math.floor(optimalOrder.length * 0.8))}%`,
      };
    } catch (error) {
      console.error('Error optimizing queue:', error);
      throw error;
    }
  }

  static async getStrategyAnalysis(userId: string): Promise<any> {
    try {
      const playerData = await pool.query(
        `SELECT research_queue, research_xp, resources FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerData.rows[0]) {
        throw new Error(`Player not found`);
      }

      const player = playerData.rows[0];
      const profile = this.analyzePlayerProfile(
        player.research_queue || [],
        player.research_xp || {},
        player.resources || {},
        {}
      );

      const strengths = this.getStrengths(profile);
      const weaknesses = this.getWeaknesses(profile);
      const suggestions = this.getSuggestions(profile);

      return {
        success: true,
        profile,
        strengths,
        weaknesses,
        suggestions,
      };
    } catch (error) {
      console.error('Error analyzing strategy:', error);
      throw error;
    }
  }

  static getStrengths(profile: any): string[] {
    return [
      `Specialized in ${profile.primarySpecialization} technologies`,
      `Abundant ${profile.abundantResource} resources`,
      `Progress level: ${profile.progressionLevel}`,
    ];
  }

  static getWeaknesses(profile: any): string[] {
    return [
      `Limited lab level (${profile.labLevel})`,
      `May need more research diversity`,
    ];
  }

  static getSuggestions(profile: any): string[] {
    return [
      `Focus on ${profile.primarySpecialization} branch for synergy`,
      `Upgrade lab to speed up research`,
      `Diversify into supporting technologies`,
    ];
  }
}

export default ResearchRecommendationsService;