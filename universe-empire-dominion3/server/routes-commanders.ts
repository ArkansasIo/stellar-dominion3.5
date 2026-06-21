/**
 * Commander Gacha, Catalog, Inventory, and Profile Routes
 * ========================================================
 * Provides endpoints for the Commander page:
 *   GET  /api/commanders                   – Full commander catalog
 *   GET  /api/commanders/gacha/status      – Gacha pull status (currency, pity, rates)
 *   POST /api/commanders/gacha/pull        – Execute a gacha pull
 *   GET  /api/commanders/inventory         – Recruited commander roster
 *   GET  /api/commanders/profile/me        – Commander profile metadata
 *   PUT  /api/commanders/profile/me        – Update commander profile
 */

import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { GACHA_COMMANDERS, RARITY_TIERS, GACHA_BANNERS } from "@shared/config/commander/gacha/commanderGachaCommandNexus";

import type { CommanderRarity } from "@shared/config/commander/gacha/commanderGachaCommandNexus";
// ─── helpers ─────────────────────────────────────────────────────────────────

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (!getUserId(req)) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

// ─── in-memory gacha state per player (pity counters, currency) ──────────────
// In production this would be in the database. For now we persist through
// playerStates JSONB and fall back to sensible defaults.

interface PlayerGachaState {
  currency: number;
  pity: {
    pullsSinceEpic: number;
    pullsSinceLegendary: number;
  };
  pullsTotal: number;
}

function getDefaultGachaState(): PlayerGachaState {
  return {
    currency: 500,
    pity: { pullsSinceEpic: 0, pullsSinceLegendary: 0 },
    pullsTotal: 0,
  };
}

function getGachaState(playerState: any): PlayerGachaState {
  if (playerState?.gachaState) return playerState.gachaState;
  return getDefaultGachaState();
}

function getInventory(playerState: any): any[] {
  return Array.isArray(playerState?.commanderInventory) ? playerState.commanderInventory : [];
}

function getProfile(playerState: any) {
  return playerState?.commanderProfile || {
    callsign: "",
    fleetTitle: "",
    bio: "",
    doctrineNotes: "",
    race: null,
    classId: null,
    subClassId: null,
  };
}

// ─── rarity roll logic ──────────────────────────────────────────────────────

function rollRarity(gachaState: PlayerGachaState): CommanderRarity {
  const epicPity = gachaState.pity.pullsSinceEpic;
  const legendaryPity = gachaState.pity.pullsSinceLegendary;

  // Soft pity: increase rates as we approach guarantee
  let legendaryRate = RARITY_TIERS[5].baseProbability;
  let epicRate = RARITY_TIERS[4].baseProbability;

  if (legendaryPity >= RARITY_TIERS[5].softPityStart) {
    const softBonus = (legendaryPity - RARITY_TIERS[5].softPityStart + 1) * 0.005;
    legendaryRate = Math.min(legendaryRate + softBonus, 1.0);
  }
  if (legendaryPity >= RARITY_TIERS[5].guaranteedPityCount) {
    legendaryRate = 1.0;
  }

  if (epicPity >= RARITY_TIERS[4].softPityStart) {
    const softBonus = (epicPity - RARITY_TIERS[4].softPityStart + 1) * 0.01;
    epicRate = Math.min(epicRate + softBonus, 1.0);
  }

  const roll = Math.random();

  // Legendary guarantee
  if (legendaryPity >= RARITY_TIERS[5].guaranteedPityCount) return 5;

  // Legendary roll
  if (roll < legendaryRate) return 5;

  // Epic guarantee
  if (epicPity >= RARITY_TIERS[4].guaranteedPityCount) return 4;

  // Epic roll
  if (roll < legendaryRate + epicRate) return 4;

  // Remaining probabilities
  const rareRate = RARITY_TIERS[3].baseProbability;
  const uncommonRate = RARITY_TIERS[2].baseProbability;
  // Common gets the rest

  if (roll < legendaryRate + epicRate + rareRate) return 3;
  if (roll < legendaryRate + epicRate + rareRate + uncommonRate) return 2;
  return 1;
}

function pickCommanderByRarity(rarity: CommanderRarity) {
  const pool = GACHA_COMMANDERS.filter((c) => c.rarity === rarity);
  if (pool.length === 0) {
    // Fallback: pick any commander
    return GACHA_COMMANDERS[Math.floor(Math.random() * GACHA_COMMANDERS.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── routes ─────────────────────────────────────────────────────────────────

export function registerCommanderRoutes(app: Express) {
  // ─── Commander Catalog ──────────────────────────────────────────────────
  app.get("/api/commanders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const commanders = GACHA_COMMANDERS.map((c) => ({
        id: c.id,
        name: c.name,
        rarity: c.rarity,
        type: c.classType,
        class: c.classType,
        subType: c.element,
        title: c.title,
        description: c.description,
        faction: c.faction,
        baseStats: c.baseAttributes,
      }));

      const rarities: Record<string, number> = {};
      for (const c of commanders) {
        const rarityName = RARITY_TIERS[c.rarity as CommanderRarity]?.name || "Unknown";
        rarities[rarityName] = (rarities[rarityName] || 0) + 1;
      }

      res.json({
        commanders,
        count: commanders.length,
        stats: {
          totalCommanders: commanders.length,
          rarities,
        },
      });
    } catch (error: any) {
      console.error("[commanders/catalog]", error);
      res.status(500).json({ message: "Failed to load commander catalog" });
    }
  });

  // ─── Gacha Status ───────────────────────────────────────────────────────
  app.get("/api/commanders/gacha/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const gachaState = getGachaState(playerState);
      const inventory = getInventory(playerState);
      const standardBanner = GACHA_BANNERS.find((b) => b.id === "banner-standard");
      const costPerPull = standardBanner?.costPerPull || 150;

      const softPity = RARITY_TIERS[5].softPityStart;
      const hardPity = RARITY_TIERS[5].guaranteedPityCount;

      res.json({
        currency: gachaState.currency,
        costPerPull,
        canAffordPull: gachaState.currency >= costPerPull,
        totalPoolCount: GACHA_COMMANDERS.length,
        inventoryCount: inventory.length,
        pity: {
          pullsSinceEpic: gachaState.pity.pullsSinceEpic,
          pullsSinceLegendary: gachaState.pity.pullsSinceLegendary,
          softPity,
          hardPity,
          epicPity: RARITY_TIERS[4].guaranteedPityCount,
          isSoftPity: gachaState.pity.pullsSinceLegendary >= softPity,
          isHardPity: gachaState.pity.pullsSinceLegendary >= hardPity,
        },
        rates: {
          legendary: RARITY_TIERS[5].baseProbability,
          epic: RARITY_TIERS[4].baseProbability,
          rare: RARITY_TIERS[3].baseProbability,
          uncommon: RARITY_TIERS[2].baseProbability,
          common: RARITY_TIERS[1].baseProbability,
        },
      });
    } catch (error: any) {
      console.error("[commanders/gacha/status]", error);
      res.status(500).json({ message: "Failed to load gacha status" });
    }
  });

  // ─── Gacha Pull ─────────────────────────────────────────────────────────
  app.post("/api/commanders/gacha/pull", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) return res.status(404).json({ message: "Player not found" });

      const gachaState = getGachaState(playerState);
      const standardBanner = GACHA_BANNERS.find((b) => b.id === "banner-standard");
      const costPerPull = standardBanner?.costPerPull || 150;

      if (gachaState.currency < costPerPull) {
        return res.status(400).json({ message: "Insufficient command seals" });
      }

      // Deduct currency
      gachaState.currency -= costPerPull;
      gachaState.pullsTotal += 1;

      // Roll rarity
      const rarity = rollRarity(gachaState);

      // Update pity counters
      gachaState.pity.pullsSinceLegendary += 1;
      if (rarity === 5) {
        gachaState.pity.pullsSinceLegendary = 0;
      }
      gachaState.pity.pullsSinceEpic += 1;
      if (rarity >= 4) {
        gachaState.pity.pullsSinceEpic = 0;
      }

      // Pick commander
      const commanderConfig = pickCommanderByRarity(rarity);
      const instanceId = `cmd-${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const recruitedCommander = {
        instanceId,
        id: commanderConfig.id,
        name: commanderConfig.name,
        rarity: commanderConfig.rarity,
        type: commanderConfig.classType,
        class: commanderConfig.classType,
        subType: commanderConfig.element,
        title: commanderConfig.title || "",
        recruitedAt: Date.now(),
      };

      // Add to inventory
      const inventory = getInventory(playerState);
      inventory.push(recruitedCommander);

      // Save state
      await storage.updatePlayerState(userId, {
        gachaState,
        commanderInventory: inventory,
      } as any);

      res.json({
        success: true,
        commander: {
          instanceId: recruitedCommander.instanceId,
          id: recruitedCommander.id,
          name: recruitedCommander.name,
          rarity: recruitedCommander.rarity,
          type: recruitedCommander.type,
          class: recruitedCommander.class,
          subType: recruitedCommander.subType as string,
        },
        currency: gachaState.currency,
        pity: {
          pulls: gachaState.pity.pullsSinceLegendary,
          softPity: RARITY_TIERS[5].softPityStart,
          hardPity: RARITY_TIERS[5].guaranteedPityCount,
          isSoftPity: gachaState.pity.pullsSinceLegendary >= RARITY_TIERS[5].softPityStart,
          isHardPity: gachaState.pity.pullsSinceLegendary >= RARITY_TIERS[5].guaranteedPityCount,
        },
      });
    } catch (error: any) {
      console.error("[commanders/gacha/pull]", error);
      res.status(500).json({ message: error?.message || "Failed to execute gacha pull" });
    }
  });

  // ─── Commander Inventory ────────────────────────────────────────────────
  app.get("/api/commanders/inventory", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const inventory = getInventory(playerState);

      res.json({
        commanders: inventory,
        count: inventory.length,
      });
    } catch (error: any) {
      console.error("[commanders/inventory]", error);
      res.status(500).json({ message: "Failed to load commander inventory" });
    }
  });

  // ─── Commander Profile ──────────────────────────────────────────────────
  app.get("/api/commanders/profile/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const profile = getProfile(playerState);

      res.json({ success: true, profile });
    } catch (error: any) {
      console.error("[commanders/profile]", error);
      res.status(500).json({ message: "Failed to load commander profile" });
    }
  });

  app.put("/api/commanders/profile/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const currentProfile = getProfile(playerState);

      const updates = req.body || {};
      const mergedProfile = {
        ...currentProfile,
        ...(typeof updates.callsign === "string" ? { callsign: updates.callsign } : {}),
        ...(typeof updates.fleetTitle === "string" ? { fleetTitle: updates.fleetTitle } : {}),
        ...(typeof updates.bio === "string" ? { bio: updates.bio } : {}),
        ...(typeof updates.doctrineNotes === "string" ? { doctrineNotes: updates.doctrineNotes } : {}),
        ...(updates.race !== undefined ? { race: updates.race } : {}),
        ...(updates.classId !== undefined ? { classId: updates.classId } : {}),
        ...(updates.subClassId !== undefined ? { subClassId: updates.subClassId } : {}),
        updatedAt: Date.now(),
      };

      await storage.updatePlayerState(userId, {
        commanderProfile: mergedProfile,
      } as any);

      res.json({ success: true, profile: mergedProfile });
    } catch (error: any) {
      console.error("[commanders/profile:update]", error);
      res.status(500).json({ message: "Failed to update commander profile" });
    }
  });

  // ─── Commander Mastery ─────────────────────────────────────────────────
  app.get("/api/commander/mastery", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const mastery = (playerState as any)?.commanderMastery || {
        selectedClassId: null,
        masteryLevel: 1,
        masteryXp: 0,
        xpToNext: 1000,
        selectedSubClassId: null,
        unlockedAbilities: [],
        allocatedSubTypes: [],
      };
      res.json(mastery);
    } catch (error: any) {
      console.error("[commander/mastery]", error);
      res.status(500).json({ message: "Failed to load mastery data" });
    }
  });

  app.put("/api/commander/mastery", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const updates = req.body || {};
      const playerState = await storage.getPlayerState(userId);
      const current = (playerState as any)?.commanderMastery || {};

      const merged = { ...current, ...updates };
      await storage.updatePlayerState(userId, { commanderMastery: merged } as any);
      res.json({ success: true, mastery: merged });
    } catch (error: any) {
      console.error("[commander/mastery:update]", error);
      res.status(500).json({ message: "Failed to update mastery" });
    }
  });

  // ─── Commander Skill Book ──────────────────────────────────────────────
  app.get("/api/commander/skills", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const skillBook = (playerState as any)?.commanderSkillBook || null;
      res.json(skillBook);
    } catch (error: any) {
      console.error("[commander/skills]", error);
      res.status(500).json({ message: "Failed to load skill book" });
    }
  });

  app.put("/api/commander/skills", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const updates = req.body || {};
      await storage.updatePlayerState(userId, { commanderSkillBook: updates } as any);
      res.json({ success: true });
    } catch (error: any) {
      console.error("[commander/skills:update]", error);
      res.status(500).json({ message: "Failed to update skill book" });
    }
  });
}