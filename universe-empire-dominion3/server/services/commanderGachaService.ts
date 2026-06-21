import { db } from "../db";
import { sql } from "drizzle-orm";
import { storage } from "../storage";
import {
  RARITY_TIERS,
  GACHA_BANNERS,
  GACHA_COMMANDERS,
  getPullProbability,
  simulatePull,
  processDuplicate,
  calcMultiPullCost,
  getAvailableCommandersForBanner,
  getBannerStatus,
  getRarityColor,
  type CommanderRarity,
  type GachaBannerConfig,
  type GachaCommanderConfig,
  type PityState,
  type PullResult,
} from "../../shared/config/commander/gacha/commanderGachaCommandNexus";

export const GACHA_CONFIG = {
  defaultPity: { totalPullsOnBanner: 0, currentPity4Star: 0, currentPity5Star: 0, hasGuaranteed4Star: false, hasGuaranteed5Star: false },
  freePullCooldownHours: 24,
  maxInventorySize: 200,
  duplicateShardMultiplier: 1,
  pityTransferEnabled: true,
  rates: {
    common: 0.40,
    uncommon: 0.35,
    rare: 0.18,
    epic: 0.055,
    legendary: 0.015,
  },
  pity: {
    softPityStart: { fourStar: 8, fiveStar: 70 },
    hardPity: { fourStar: 10, fiveStar: 90 },
  },
};

interface CommanderInventoryEntry {
  commanderId: string;
  name: string;
  rarity: CommanderRarity;
  awakeningLevel: number;
  currentShards: number;
  level: number;
  obtainedAt: Date;
  isLocked: boolean;
}

interface GachaStatus {
  userId: string;
  pityStates: Record<string, PityState>;
  availableBanners: Array<{
    banner: GachaBannerConfig;
    status: "active" | "upcoming" | "ended" | "permanent";
    canPull: boolean;
    freePullsRemaining: number;
    nextFreePullAt: Date | null;
  }>;
  commanderCount: number;
  totalPulls: number;
  premiumCurrency: number;
  freeCurrency: number;
}

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getDefaultPityState(): PityState {
  return { ...GACHA_CONFIG.defaultPity };
}

function parsePityStates(raw: any): Record<string, PityState> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, PityState> = {};
  for (const [key, val] of Object.entries(raw)) {
    const v = val as any;
    result[key] = {
      totalPullsOnBanner: toNumber(v?.totalPullsOnBanner),
      currentPity4Star: toNumber(v?.currentPity4Star),
      currentPity5Star: toNumber(v?.currentPity5Star),
      hasGuaranteed4Star: !!v?.hasGuaranteed4Star,
      hasGuaranteed5Star: !!v?.hasGuaranteed5Star,
      guaranteeUnitId: v?.guaranteeUnitId,
    };
  }
  return result;
}

function parseInventory(raw: any): CommanderInventoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e: any) => ({
    commanderId: e.commanderId || e.id || "",
    name: e.name || "Unknown",
    rarity: (toNumber(e.rarity, 1) as CommanderRarity) || 1,
    awakeningLevel: toNumber(e.awakeningLevel, 0),
    currentShards: toNumber(e.currentShards, 0),
    level: toNumber(e.level, 1),
    obtainedAt: e.obtainedAt ? new Date(e.obtainedAt) : new Date(),
    isLocked: !!e.isLocked,
  }));
}

function serializeInventory(entries: CommanderInventoryEntry[]): any[] {
  return entries.map(e => ({
    commanderId: e.commanderId,
    name: e.name,
    rarity: e.rarity,
    awakeningLevel: e.awakeningLevel,
    currentShards: e.currentShards,
    level: e.level,
    obtainedAt: e.obtainedAt.toISOString(),
    isLocked: e.isLocked,
  }));
}

function serializePityStates(states: Record<string, PityState>): any {
  const result: any = {};
  for (const [key, val] of Object.entries(states)) {
    result[key] = { ...val };
  }
  return result;
}

export class CommanderGachaService {
  static async getGachaStatus(userId: string): Promise<GachaStatus> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const gachaData = (playerState.commander as any)?.gachaData || {};
    const pityStates = parsePityStates(gachaData.pityStates || {});
    const inventory = parseInventory(gachaData.inventory || []);
    const totalPulls = toNumber(gachaData.totalPulls, 0);
    const premiumCurrency = toNumber(gachaData.premiumCurrency, 0);
    const freeCurrency = toNumber(gachaData.freeCurrency, 0);
    const lastFreePull = gachaData.lastFreePull ? new Date(gachaData.lastFreePull) : null;

    const now = Date.now();
    const availableBanners = GACHA_BANNERS.map(banner => {
      const bannerStatus = getBannerStatus(banner);
      const canPull = bannerStatus === "active" || bannerStatus === "permanent";
      let freePullsRemaining = 0;
      let nextFreePullAt: Date | null = null;

      if (banner.freePullInterval && banner.maxFreePullsPerBanner) {
        const usedFreePulls = toNumber(gachaData.freePullsUsed?.[banner.id], 0);
        freePullsRemaining = Math.max(0, banner.maxFreePullsPerBanner - usedFreePulls);
        if (freePullsRemaining > 0 && lastFreePull) {
          const elapsed = (now - lastFreePull.getTime()) / (1000 * 60 * 60);
          if (elapsed < banner.freePullInterval) {
            nextFreePullAt = new Date(lastFreePull.getTime() + banner.freePullInterval * 60 * 60 * 1000);
            freePullsRemaining = 0;
          }
        }
      }

      return { banner, status: bannerStatus, canPull, freePullsRemaining, nextFreePullAt };
    });

    return {
      userId,
      pityStates,
      availableBanners,
      commanderCount: inventory.length,
      totalPulls,
      premiumCurrency,
      freeCurrency,
    };
  }

  static async pullCommander(
    userId: string,
    bannerId: string,
    pullType: "single" | "10x"
  ): Promise<{
    success: boolean;
    results?: Array<{ commander: GachaCommanderConfig; isNew: boolean; shardsEarned: number }>;
    error?: string;
    cost?: number;
    pityUpdate?: PityState;
  }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const banner = GACHA_BANNERS.find(b => b.id === bannerId);
    if (!banner) return { success: false, error: "Banner not found" };

    const bannerStatus = getBannerStatus(banner);
    if (bannerStatus !== "active" && bannerStatus !== "permanent") {
      return { success: false, error: "Banner is not currently active" };
    }

    const pullCount = pullType === "10x" ? 10 : 1;
    const cost = calcMultiPullCost(banner, pullCount);

    const gachaData = (playerState.commander as any)?.gachaData || {};
    const pityStates = parsePityStates(gachaData.pityStates || {});
    const inventory = parseInventory(gachaData.inventory || []);
    const totalPulls = toNumber(gachaData.totalPulls, 0);
    const premiumCurrency = toNumber(gachaData.premiumCurrency, 0);
    const freeCurrency = toNumber(gachaData.freeCurrency, 0);

    const hasFreePull = banner.freePullInterval && banner.maxFreePullsPerBanner;
    let usingFreePull = false;

    if (hasFreePull) {
      const usedFreePulls = toNumber(gachaData.freePullsUsed?.[banner.id], 0);
      if (usedFreePulls < banner.maxFreePullsPerBanner!) {
        usingFreePull = true;
      }
    }

    if (!usingFreePull) {
      if (banner.currency === "free-command-seal" && freeCurrency < cost) {
        return { success: false, error: "Insufficient free currency" };
      }
      if (banner.currency === "command-seal" && premiumCurrency < cost) {
        return { success: false, error: "Insufficient premium currency" };
      }
    }

    if (banner.maxPullsPerPlayer && totalPulls >= banner.maxPullsPerPlayer) {
      return { success: false, error: "Maximum pulls reached for this banner" };
    }

    const pity = pityStates[bannerId] || getDefaultPityState();
    const availableCommanders = getAvailableCommandersForBanner(banner, GACHA_COMMANDERS);

    const results: Array<{ commander: GachaCommanderConfig; isNew: boolean; shardsEarned: number }> = [];
    let currentPity = { ...pity };

    for (let i = 0; i < pullCount; i++) {
      const { commander, newPity } = simulatePull(banner, currentPity, availableCommanders);
      currentPity = { ...newPity, totalPullsOnBanner: currentPity.totalPullsOnBanner + 1 };

      const existing = inventory.find(e => e.commanderId === commander.id);
      let isNew = false;
      let shardsEarned = 0;

      if (existing) {
        const dupResult = processDuplicate(
          { id: existing.commanderId, currentShards: existing.currentShards, awakeningLevel: existing.awakeningLevel },
          commander
        );
        existing.currentShards = dupResult.newShards;
        existing.awakeningLevel = dupResult.newAwakeningLevel;
        shardsEarned = RARITY_TIERS[commander.rarity].shardConversionRate;
      } else {
        if (inventory.length >= GACHA_CONFIG.maxInventorySize) {
          shardsEarned = RARITY_TIERS[commander.rarity].shardConversionRate;
        } else {
          inventory.push({
            commanderId: commander.id,
            name: commander.name,
            rarity: commander.rarity,
            awakeningLevel: 0,
            currentShards: 0,
            level: 1,
            obtainedAt: new Date(),
            isLocked: false,
          });
          isNew = true;
        }
      }

      results.push({ commander, isNew, shardsEarned });
    }

    pityStates[bannerId] = currentPity;

    let updatedPremium = premiumCurrency;
    let updatedFree = freeCurrency;
    const freePullsUsed = { ...(gachaData.freePullsUsed || {}) };

    if (usingFreePull) {
      freePullsUsed[bannerId] = toNumber(freePullsUsed[bannerId], 0) + pullCount;
    } else if (banner.currency === "command-seal") {
      updatedPremium -= cost;
    } else if (banner.currency === "free-command-seal") {
      updatedFree -= cost;
    }

    const commander = playerState.commander || {};
    await storage.updatePlayerState(userId, {
      commander: {
        ...commander,
        gachaData: {
          pityStates: serializePityStates(pityStates),
          inventory: serializeInventory(inventory),
          totalPulls: totalPulls + pullCount,
          premiumCurrency: updatedPremium,
          freeCurrency: updatedFree,
          lastFreePull: usingFreePull ? new Date().toISOString() : gachaData.lastFreePull,
          freePullsUsed,
        },
      },
    } as any);

    return {
      success: true,
      results,
      cost: usingFreePull ? 0 : cost,
      pityUpdate: currentPity,
    };
  }

  static calculatePityRate(pityCount: number): number {
    if (pityCount >= GACHA_CONFIG.pity.hardPity.fiveStar) return 1.0;
    if (pityCount >= GACHA_CONFIG.pity.softPityStart.fiveStar) {
      const extraPulls = pityCount - GACHA_CONFIG.pity.softPityStart.fiveStar + 1;
      return Math.min(1.0, GACHA_CONFIG.rates.legendary + extraPulls * 0.005);
    }
    return GACHA_CONFIG.rates.legendary;
  }

  static getCommanderPool(bannerId: string): GachaCommanderConfig[] {
    const banner = GACHA_BANNERS.find(b => b.id === bannerId);
    if (!banner) return [];
    return getAvailableCommandersForBanner(banner, GACHA_COMMANDERS);
  }

  static async addToInventory(userId: string, commanderId: string): Promise<{ success: boolean; entry?: CommanderInventoryEntry; error?: string }> {
    const commanderConfig = GACHA_COMMANDERS.find(c => c.id === commanderId);
    if (!commanderConfig) return { success: false, error: "Commander not found" };

    const playerState = await storage.getPlayerState(userId);
    if (!playerState) return { success: false, error: "Player state not found" };

    const gachaData = (playerState.commander as any)?.gachaData || {};
    const inventory = parseInventory(gachaData.inventory || []);

    if (inventory.length >= GACHA_CONFIG.maxInventorySize) {
      return { success: false, error: "Inventory is full" };
    }

    const existing = inventory.find(e => e.commanderId === commanderId);
    if (existing) {
      return { success: false, error: "Commander already in inventory" };
    }

    const entry: CommanderInventoryEntry = {
      commanderId,
      name: commanderConfig.name,
      rarity: commanderConfig.rarity,
      awakeningLevel: 0,
      currentShards: 0,
      level: 1,
      obtainedAt: new Date(),
      isLocked: false,
    };

    inventory.push(entry);

    const commander = playerState.commander || {};
    await storage.updatePlayerState(userId, {
      commander: {
        ...commander,
        gachaData: {
          ...gachaData,
          inventory: serializeInventory(inventory),
        },
      },
    } as any);

    return { success: true, entry };
  }

  static async getCommanderInventory(userId: string): Promise<CommanderInventoryEntry[]> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const gachaData = (playerState.commander as any)?.gachaData || {};
    return parseInventory(gachaData.inventory || []);
  }

  static async getCommanderProfile(
    userId: string,
    commanderId: string
  ): Promise<{
    entry: CommanderInventoryEntry | null;
    config: GachaCommanderConfig | null;
    powerRating: number;
    abilities: { passive: string; active: string; ultimate: string };
    synergies: { faction: string[]; class: string[] };
  } | null> {
    const inventory = await CommanderGachaService.getCommanderInventory(userId);
    const entry = inventory.find(e => e.commanderId === commanderId) || null;
    const config = GACHA_COMMANDERS.find(c => c.id === commanderId) || null;

    if (!config) return null;

    const levelMult = 1 + ((entry?.level || 1) - 1) * 0.1;
    const awakeningMult = 1 + (entry?.awakeningLevel || 0) * 0.15;
    const powerRating = Math.floor(config.basePowerRating * levelMult * awakeningMult);

    return {
      entry,
      config,
      powerRating,
      abilities: {
        passive: config.passiveDescription,
        active: config.activeDescription,
        ultimate: config.ultimateDescription,
      },
      synergies: {
        faction: config.synergyFaction,
        class: config.synergyClass,
      },
    };
  }
}

export default CommanderGachaService;
