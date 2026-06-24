import { storage } from "../storage";
import { EMPIRE_LEVEL_CONFIG } from "@shared/config/gameConfig";
import { PAGE_XP_SOURCES, getPageXp } from "@shared/config/pageXpConfig";

const actionCooldowns = new Map<string, number>();

function cooldownKey(userId: string, page: string, action: string, subPage?: string): string {
  return `${userId}:${page}:${action}:${subPage || ""}`;
}

export class PlayerXpService {
  static async getXpInfo(userId: string) {
    const state = await storage.getPlayerState(userId);
    if (!state) throw new Error("Player state not found");

    const level = state.empireLevel || 1;
    const currentXp = state.empireExperience || 0;
    const maxXp = PlayerXpService.calculateXpForNextLevel(level);

    return {
      level,
      currentXp,
      maxXp,
      totalExperience: PlayerXpService.calculateTotalXpForLevel(level) + currentXp,
    };
  }

  static calculateXpForNextLevel(level: number): number {
    const { baseExpRequirement, expMultiplier } = EMPIRE_LEVEL_CONFIG;
    return Math.floor(baseExpRequirement * Math.pow(expMultiplier, level - 1));
  }

  static calculateTotalXpForLevel(level: number): number {
    let total = 0;
    const { baseExpRequirement, expMultiplier } = EMPIRE_LEVEL_CONFIG;
    for (let i = 1; i < level; i++) {
      total += Math.floor(baseExpRequirement * Math.pow(expMultiplier, i - 1));
    }
    return total;
  }

  static async awardXp(
    userId: string,
    amount: number,
    source: string,
    options?: {
      category?: string;
      page?: string;
      subPage?: string;
      action?: string;
      label?: string;
    }
  ) {
    const prevState = await storage.getPlayerState(userId);
    const prevLevel = prevState?.empireLevel || 1;

    const updated = await storage.addEmpireExperience(userId, amount);

    await storage.addXpHistory({
      userId,
      amount,
      source,
      category: options?.category || null,
      page: options?.page || null,
      subPage: options?.subPage || null,
      action: options?.action || null,
      label: options?.label || null,
    });

    const newLevel = updated.empireLevel || 1;

    return {
      level: newLevel,
      currentXp: updated.empireExperience || 0,
      maxXp: PlayerXpService.calculateXpForNextLevel(newLevel),
      leveledUp: newLevel > prevLevel,
    };
  }

  static async awardPageActionXp(
    userId: string,
    page: string,
    action: string,
    subPage?: string
  ) {
    const config = getPageXp(page, action, subPage);
    if (!config || config.baseXp <= 0) return null;

    const key = cooldownKey(userId, page, action, subPage);
    const now = Date.now();
    const lastAward = actionCooldowns.get(key);
    if (lastAward && now - lastAward < config.cooldownSeconds * 1000) {
      return null;
    }
    actionCooldowns.set(key, now);

    return PlayerXpService.awardXp(userId, config.baseXp, config.category, {
      category: config.category,
      page: config.page,
      subPage: config.subPage,
      action: config.action,
      label: config.label,
    });
  }

  static async getRecentXpHistory(userId: string, limit: number = 20) {
    return storage.getRecentXpHistory(userId, limit);
  }

  static async getXpBreakdown(userId: string) {
    return storage.getXpBreakdown(userId);
  }
}

export default PlayerXpService;
