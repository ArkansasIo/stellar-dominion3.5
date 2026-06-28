/**
 * Research Lab Management Service
 * Handles lab assignment, research queuing, acceleration, and diagnostics
 * @tag #research #lab #queue #service #management
 */

import { 
  ResearchQueuedItem, 
  ResearchLabConfig, 
  ResearchBonus,
  ResearchModifier,
  LAB_TIERS,
  RESEARCH_QUEUE_RULES,
  RESEARCH_ACCELERATION,
  RESEARCH_FAILURE,
  getTechById,
} from "@shared/config";
import { storage } from "../storage";
import type { PlayerState } from "@shared/schema";

/**
 * Research Lab Service - Main research queue management
 */
export class ResearchLabService {
  private static normalizeQueue(queue: ResearchQueuedItem[]): ResearchQueuedItem[] {
    const normalized = [...queue]
      .sort((a, b) => a.queuePosition - b.queuePosition)
      .map((item, index) => ({
        ...item,
        queuePosition: index,
      }));

    return normalized.map((item, index) => {
      if (item.status === "completed" || item.status === "failed" || item.status === "cancelled") {
        return item;
      }
      if (item.status === "paused") {
        return item;
      }
      return {
        ...item,
        status: index === 0 ? "researching" : "queued",
      };
    });
  }

  /**
   * Get available labs for a player
   */
  static async getAvailableLabs(userId: string): Promise<ResearchLabConfig[]> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState?.availableLabs) return [];

      const labs: ResearchLabConfig[] = [];
      for (const labId of (playerState.availableLabs as any[])) {
        const lab = this.findLabById(labId);
        if (lab) labs.push(lab);
      }
      return labs;
    } catch (error) {
      console.error("Error fetching available labs:", error);
      return [];
    }
  }

  /**
   * Get current active lab
   */
  static async getActiveLab(userId: string): Promise<ResearchLabConfig | null> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!(playerState as any)?.researchLab?.type) return null;

      return this.findLabById((playerState as any).researchLab?.id || `lab-${((playerState as any).researchLab as any).type}-1`) || null;
    } catch (error) {
      console.error("Error fetching active lab:", error);
      return null;
    }
  }

  /**
   * Switch to different lab
   */
  static async switchLab(userId: string, labId: string): Promise<boolean> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return false;

      const lab = this.findLabById(labId);
      if (!lab) return false;

      // Check if player has access to this lab
      if (!(playerState.availableLabs as any)?.includes(labId)) return false;

      // Update player state
      (playerState as any).researchLab = {
        id: labId,
        type: lab.type,
        level: lab.level,
        specialization: lab.specialization,
        durability: lab.durabilityMax,
      };

      await storage.updatePlayerState(userId, playerState);
      return true;
    } catch (error) {
      console.error("Error switching lab:", error);
      return false;
    }
  }

  /**
   * Add to research queue
   */
  static async queueResearch(
    userId: string,
    techId: string,
    priority: "low" | "normal" | "high" | "critical" = "normal"
  ): Promise<ResearchQueuedItem | null> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return null;

      const queue: ResearchQueuedItem[] = (playerState.researchQueue as any) || [];

      const tech = getTechById(techId);
      if (!tech) {
        throw new Error(`Unknown techId: ${techId}`);
      }

      if (queue.some((item) => item.techId === techId && ["queued", "researching", "paused"].includes(item.status))) {
        throw new Error("Technology already queued");
      }
      
      // Check queue limit
      if (queue.length >= RESEARCH_QUEUE_RULES.MAX_QUEUE_ITEMS) {
        throw new Error("Queue is full");
      }

      const speedMultiplier = await this.calculateSpeedMultiplier(userId);
      const priorityMultiplier = RESEARCH_QUEUE_RULES.PRIORITY_MULTIPLIERS[priority] || 1;
      const effectiveSpeed = Math.max(0.1, speedMultiplier * priorityMultiplier);

      const lab = await this.getActiveLab(userId);
      const resourceBase = tech.materialsNeeded || {};
      const costReductionMultiplier = Math.max(0.1, lab?.costReductionMultiplier || 1);

      const metalCost = Math.max(
        0,
        Math.floor((Number(resourceBase.metal || 0) + Math.max(0, Number(tech.industrialCost || 0))) * costReductionMultiplier)
      );
      const crystalCost = Math.max(
        0,
        Math.floor((Number(resourceBase.crystal || 0) + Math.floor(Math.max(0, Number(tech.researchCost || 0)) * 0.5)) * costReductionMultiplier)
      );
      const deuteriumCost = Math.max(
        0,
        Math.floor((Number(resourceBase.deuterium || 0) + Math.max(0, Number(tech.energyCost || 0))) * costReductionMultiplier)
      );

      const baseTurns = Math.max(1, Math.ceil(Number(tech.researchTime || 1)));
      const adjustedTurns = Math.max(1, Math.ceil(baseTurns / effectiveSpeed));
      const scientists = Math.max(1, Math.ceil(Number(tech.researchCost || 1) / 20));

      const status: ResearchQueuedItem["status"] = queue.length === 0 ? "researching" : "queued";

      // Create queue item
      const queueItem: ResearchQueuedItem = {
        id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        queuePosition: queue.length,
        enqueuedAt: Date.now(),
        status,
        priority,
        techId,
        techName: tech.name,
        techBranch: tech.branch,
        techLevel: tech.level,
        progressPercent: 0,
        turnsRemaining: adjustedTurns,
        turnsElapsed: 0,
        totalTurnsRequired: adjustedTurns,
        costBreakdown: {
          scientists,
          resources: { metal: metalCost, crystal: crystalCost, deuterium: deuteriumCost },
          baseTime: baseTurns,
          adjustedTime: adjustedTurns,
        },
        speedModifier: Number(effectiveSpeed.toFixed(3)),
        costModifier: Number(costReductionMultiplier.toFixed(3)),
        bonusesApplied: [
          `lab:${lab?.id || "none"}`,
          `priority:${priority}`,
        ],
      };

      queue.push(queueItem);
      playerState.researchQueue = this.normalizeQueue(queue);

      await storage.updatePlayerState(userId, playerState);
      return queueItem;
    } catch (error) {
      console.error("Error queuing research:", error);
      return null;
    }
  }

  /**
   * Get current research queue
   */
  static async getResearchQueue(userId: string): Promise<ResearchQueuedItem[]> {
    try {
      const playerState = await storage.getPlayerState(userId);
      return (playerState?.researchQueue as any) || [];
    } catch (error) {
      console.error("Error fetching queue:", error);
      return [];
    }
  }

  /**
   * Remove from queue
   */
  static async removeFromQueue(userId: string, queueItemId: string): Promise<boolean> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return false;

      const updatedQueue = (((playerState as any).researchQueue || []) as ResearchQueuedItem[]).filter(
        (item: any) => item.id !== queueItemId
      );

      (playerState as any).researchQueue = this.normalizeQueue(updatedQueue);

      await storage.updatePlayerState(userId, playerState);
      return true;
    } catch (error) {
      console.error("Error removing from queue:", error);
      return false;
    }
  }

  /**
   * Reorder queue items
   */
  static async reorderQueue(userId: string, queueItemId: string, newPosition: number): Promise<boolean> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return false;

      const queue = ((playerState as any).researchQueue || []) as ResearchQueuedItem[];
      const item = queue.find((q: any) => q.id === queueItemId);
      if (!item) return false;

      const boundedPosition = Math.max(0, Math.min(newPosition, Math.max(0, queue.length - 1)));

      // Remove and re-insert
      queue.splice(queue.indexOf(item), 1);
      queue.splice(boundedPosition, 0, item);

      (playerState as any).researchQueue = this.normalizeQueue(queue);
      await storage.updatePlayerState(userId, playerState);
      return true;
    } catch (error) {
      console.error("Error reordering queue:", error);
      return false;
    }
  }

  /**
   * Accelerate single research
   */
  static async accelerateResearch(
    userId: string,
    queueItemId: string,
    speedupPercent: 25 | 50 | 75 | 100
  ): Promise<{ success: boolean; totalCost: number }> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return { success: false, totalCost: 0 };

      const queue = (playerState as any).researchQueue || [];
      const item = (queue as any).find((q: any) => q.id === queueItemId);
      if (!item) return { success: false, totalCost: 0 };

      // Calculate cost
      const speedupKey = `${speedupPercent}_percent` as keyof typeof RESEARCH_ACCELERATION.SPEEDUP_MULTIPLIERS;
      const speedupMultiplier = RESEARCH_ACCELERATION.SPEEDUP_MULTIPLIERS[speedupKey];
      const baseCost = item.costBreakdown.resources.metal + 
                      item.costBreakdown.resources.crystal;
      
      const totalCost = Math.floor(baseCost * speedupMultiplier.costMultiplier);

      // Check resources
      const resources = playerState.resources as any;
      if (resources.deuterium < totalCost) {
        return { success: false, totalCost };
      }

      // Apply speedup
      resources.deuterium -= totalCost;
      item.turnsRemaining = Math.max(
        1,
        Math.floor(item.turnsRemaining * (1 - speedupMultiplier.speedup))
      );

      playerState.resources = resources;
      playerState.researchQueue = queue;

      await storage.updatePlayerState(userId, playerState);
      return { success: true, totalCost };
    } catch (error) {
      console.error("Error accelerating research:", error);
      return { success: false, totalCost: 0 };
    }
  }

  /**
   * Get lab by ID
   */
  private static findLabById(labId: string): ResearchLabConfig | null {
    for (const [type, labs] of Object.entries(LAB_TIERS)) {
      const found = (labs as ResearchLabConfig[]).find(lab => lab.id === labId);
      if (found) return found;
    }
    return null;
  }

  /**
   * Get lab by type and level
   */
  static getLabByTypeAndLevel(type: string, level: number): ResearchLabConfig | null {
    const labs = LAB_TIERS[type as keyof typeof LAB_TIERS];
    if (!labs) return null;
    return (labs as ResearchLabConfig[]).find(lab => lab.level === level) || null;
  }

  /**
   * Apply research bonus
   */
  static async applyBonus(
    userId: string,
    bonusId: string
  ): Promise<boolean> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return false;

      const bonuses = playerState.researchBonuses || [];
      if ((bonuses as any).find((b: any) => b.id === bonusId)) return true; // Already applied

      (bonuses as any).push({ id: bonusId, appliedAt: Date.now() } as any);
      playerState.researchBonuses = bonuses;

      await storage.updatePlayerState(userId, playerState);
      return true;
    } catch (error) {
      console.error("Error applying bonus:", error);
      return false;
    }
  }

  /**
   * Get active bonuses
   */
  static async getActiveBonuses(userId: string): Promise<ResearchBonus[]> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return [];

      // Filter expired temporary bonuses
      return ((playerState as any).researchBonuses || []).filter((b: any) => {
        const bonus = b as any;
        if (bonus.type === "temporary" && bonus.duration > 0) {
          const elapsed = (Date.now() - bonus.appliedAt) / 1000 / 60; // minutes
          return elapsed < bonus.duration;
        }
        return true;
      }) as ResearchBonus[];
    } catch (error) {
      console.error("Error fetching active bonuses:", error);
      return [];
    }
  }

  /**
   * Calculate total research speed multiplier
   */
  static async calculateSpeedMultiplier(userId: string): Promise<number> {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return 1;

      let multiplier = 1;

      // Lab bonus
      const lab = await this.getActiveLab(userId);
      if (lab) multiplier *= lab.researchSpeedMultiplier;

      // Active bonuses
      const bonuses = await this.getActiveBonuses(userId);
      bonuses.forEach(b => {
        multiplier *= (1 + (b.speedBonus || 0) / 100);
      });

      // Modifiers
      const modifiers = (playerState.researchModifiers || []) as ResearchModifier[];
      modifiers.forEach(m => {
        if (m.active) multiplier *= m.modifier;
      });

      return Math.max(0.1, Math.min(10, multiplier)); // Cap between 0.1x and 10x
    } catch (error) {
      console.error("Error calculating speed multiplier:", error);
      return 1;
    }
  }

  /**
   * Get research lab diagnostics/stats
   */
  static async getLabDiagnostics(userId: string) {
    try {
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return null;

      const lab = await this.getActiveLab(userId);
      const queue = await this.getResearchQueue(userId);
      const bonuses = await this.getActiveBonuses(userId);
      const speedMult = await this.calculateSpeedMultiplier(userId);

      return {
        activeLab: lab,
        queue: queue.slice(0, 5), // First 5 items
        queueLength: queue.length,
        activeBonuses: bonuses.length,
        totalSpeedMultiplier: speedMult.toFixed(2),
        currentResearch: queue.find(q => q.status === "researching"),
        nextInLine: queue.find(q => q.status === "queued"),
        labDurability: (playerState as any).researchLab?.durability || 100,
        estimatedCompletion: queue[0]
          ? new Date(Date.now() + queue[0].turnsRemaining * 60000).toISOString()
          : null,
      };
    } catch (error) {
      console.error("Error fetching lab diagnostics:", error);
      return null;
    }
  }
}
