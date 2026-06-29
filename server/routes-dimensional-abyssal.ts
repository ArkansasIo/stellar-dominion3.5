import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import {
  playerPowerLevels,
  itemLevels,
  empireProfiles,
} from "../Source/Shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./basicAuth";
import {
  DIMENSIONAL_CONTRACT_TIERS,
} from "../Source/Shared/config/dimensionalContractConfig";
import {
  ABYSSAL_GATE_TIERS,
} from "../Source/Shared/config/abyssalGateConfig";
import {
  calculateTotalPower,
  getPowerTierName,
  getPowerTierColor,
  POWER_SOURCES,
} from "../Source/Shared/config/powerLevelConfig";
import {
  ITEM_LEVEL_TIERS,
  calculateItemStats,
  calculateUpgradeCost,
  attemptItemUpgrade,
  calculateExperienceToNextLevel,
  addItemExperience,
  getItemLevelTierName,
  getItemLevelTierColor,
} from "../Source/Shared/config/itemLevelConfig";
import { dimensionalAbyssalService } from "./services/dimensionalAbyssalService";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

export function registerDimensionalAbyssalRoutes(app: Express) {
  // ============================================
  // DIMENSIONAL CONTRACT TOKENS
  // ============================================

  // GET /api/dimensional-contracts - Get player's dimensional contracts
  app.get("/api/dimensional-contracts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const contracts = await dimensionalAbyssalService.getPlayerContracts(userId);
      res.json({ success: true, contracts });
    } catch (error) {
      console.error("Failed to get dimensional contracts:", error);
      res.status(500).json({ message: "Failed to get dimensional contracts" });
    }
  });

  // GET /api/dimensional-contracts/config - Get contract tier configurations
  app.get("/api/dimensional-contracts/config", (_req: Request, res: Response) => {
    res.json({ success: true, tiers: DIMENSIONAL_CONTRACT_TIERS });
  });

  // POST /api/dimensional-contracts/:tier/complete-raid - Complete a raid and earn tokens
  app.post("/api/dimensional-contracts/:tier/complete-raid", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);

      const playerState = await storage.getPlayerState(userId);
      const playerPower = (playerState as any)?.raidPower || (playerState as any)?.combatPower || 1000;

      const result = await dimensionalAbyssalService.completeRaid(userId, tier, playerPower);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json({
        success: true,
        ...result.result,
      });
    } catch (error) {
      console.error("Failed to complete raid:", error);
      res.status(500).json({ message: "Failed to complete raid" });
    }
  });

  // POST /api/dimensional-contracts/:tier/open-chest - Open chest with tokens
  app.post("/api/dimensional-contracts/:tier/open-chest", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);

      const result = await dimensionalAbyssalService.openRaidChest(userId, tier);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json({
        success: true,
        ...result.result,
      });
    } catch (error) {
      console.error("Failed to open chest:", error);
      res.status(500).json({ message: "Failed to open chest" });
    }
  });

  // ============================================
  // ABYSSAL GATE TOKENS
  // ============================================

  // GET /api/abyssal-gates - Get player's abyssal gate tokens
  app.get("/api/abyssal-gates", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const gates = await dimensionalAbyssalService.getPlayerGates(userId);
      res.json({ success: true, tokens: gates });
    } catch (error) {
      console.error("Failed to get abyssal gate tokens:", error);
      res.status(500).json({ message: "Failed to get abyssal gate tokens" });
    }
  });

  // GET /api/abyssal-gates/config - Get abyssal gate tier configurations
  app.get("/api/abyssal-gates/config", (_req: Request, res: Response) => {
    res.json({ success: true, tiers: ABYSSAL_GATE_TIERS });
  });

  // POST /api/abyssal-gates/:tier/complete - Complete an abyssal gate
  app.post("/api/abyssal-gates/:tier/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);

      const playerState = await storage.getPlayerState(userId);
      const playerPower = (playerState as any)?.raidPower || (playerState as any)?.combatPower || 1000;

      const result = await dimensionalAbyssalService.completeGate(userId, tier, playerPower);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json({
        success: true,
        ...result.result,
      });
    } catch (error) {
      console.error("Failed to complete abyssal gate:", error);
      res.status(500).json({ message: "Failed to complete abyssal gate" });
    }
  });

  // POST /api/abyssal-gates/:tier/open-chest - Open abyssal chest
  app.post("/api/abyssal-gates/:tier/open-chest", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = parseInt(req.params.tier);

      const result = await dimensionalAbyssalService.openGateChest(userId, tier);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json({
        success: true,
        ...result.result,
      });
    } catch (error) {
      console.error("Failed to open abyssal chest:", error);
      res.status(500).json({ message: "Failed to open abyssal chest" });
    }
  });

  // ============================================
  // POWER LEVEL SYSTEM
  // ============================================

  // GET /api/power-level - Get player's power level
  app.get("/api/power-level", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);

      const playerState = await storage.getPlayerState(userId);
      const [profile] = await db
        .select()
        .from(empireProfiles)
        .where(eq(empireProfiles.userId, userId));

      const powerData = calculateTotalPower({
        commander: playerState?.commander,
        ships: playerState?.units ? Object.values(playerState.units as Record<string, any>) : [],
        research: (playerState?.research as Record<string, number>) || {},
        buildings: (playerState?.buildings as Record<string, number>) || {},
        empireProfile: profile,
        items: (playerState?.artifacts as any[]) || [],
        raidCareer: (playerState as any)?.raidCareer,
      });

      const powerTier = getPowerTierName(powerData.totalPower);
      const tierColor = getPowerTierColor(powerData.totalPower);

      let [existing] = await db
        .select()
        .from(playerPowerLevels)
        .where(eq(playerPowerLevels.userId, userId));

      if (existing) {
        [existing] = await db
          .update(playerPowerLevels)
          .set({
            ...powerData,
            powerTier,
            lastCalculatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(playerPowerLevels.userId, userId))
          .returning();
      } else {
        [existing] = await db
          .insert(playerPowerLevels)
          .values({
            userId,
            ...powerData,
            powerTier,
            lastCalculatedAt: new Date(),
          })
          .returning();
      }

      res.json({
        success: true,
        powerLevel: existing,
        tierColor,
      });
    } catch (error) {
      console.error("Failed to get power level:", error);
      res.status(500).json({ message: "Failed to get power level" });
    }
  });

  // GET /api/power-level/config - Get power source configurations
  app.get("/api/power-level/config", (_req: Request, res: Response) => {
    res.json({ success: true, sources: POWER_SOURCES });
  });

  // ============================================
  // ITEM LEVEL SYSTEM
  // ============================================

  // GET /api/item-levels - Get player's item levels
  app.get("/api/item-levels", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const items = await db
        .select()
        .from(itemLevels)
        .where(eq(itemLevels.userId, userId));

      res.json({ success: true, items });
    } catch (error) {
      console.error("Failed to get item levels:", error);
      res.status(500).json({ message: "Failed to get item levels" });
    }
  });

  // GET /api/item-levels/config - Get item level tier configurations
  app.get("/api/item-levels/config", (_req: Request, res: Response) => {
    res.json({ success: true, tiers: ITEM_LEVEL_TIERS });
  });

  // POST /api/item-levels/register - Register an item for leveling
  app.post("/api/item-levels/register", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { itemId, itemName, itemType, itemClass, baseRank } = req.body;

      if (!itemId || !itemName || !itemType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const [existing] = await db
        .select()
        .from(itemLevels)
        .where(and(
          eq(itemLevels.userId, userId),
          eq(itemLevels.itemId, itemId)
        ));

      if (existing) {
        return res.json({ success: true, item: existing, message: "Item already registered" });
      }

      const [newItem] = await db
        .insert(itemLevels)
        .values({
          userId,
          itemId,
          itemName,
          itemType,
          itemClass: itemClass || "common",
          baseRank: baseRank || 1,
          currentLevel: 1,
          currentExperience: 0,
          experienceToNext: calculateExperienceToNextLevel(1),
        })
        .returning();

      res.json({ success: true, item: newItem });
    } catch (error) {
      console.error("Failed to register item:", error);
      res.status(500).json({ message: "Failed to register item" });
    }
  });

  // POST /api/item-levels/:itemId/add-experience - Add experience to an item
  app.post("/api/item-levels/:itemId/add-experience", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { itemId } = req.params;
      const { experience } = req.body;

      if (!experience || experience < 1) {
        return res.status(400).json({ message: "Invalid experience amount" });
      }

      const [item] = await db
        .select()
        .from(itemLevels)
        .where(and(
          eq(itemLevels.userId, userId),
          eq(itemLevels.itemId, itemId)
        ));

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const result = addItemExperience(item.currentLevel!, item.currentExperience!, experience);

      const [updated] = await db
        .update(itemLevels)
        .set({
          currentLevel: result.newLevel,
          currentExperience: result.newExp,
          experienceToNext: calculateExperienceToNextLevel(result.newLevel),
          updatedAt: new Date(),
        })
        .where(eq(itemLevels.id, item.id))
        .returning();

      res.json({
        success: true,
        item: updated,
        leveledUp: result.leveledUp,
        experienceAdded: experience,
      });
    } catch (error) {
      console.error("Failed to add experience:", error);
      res.status(500).json({ message: "Failed to add experience" });
    }
  });

  // POST /api/item-levels/:itemId/upgrade - Attempt to upgrade an item
  app.post("/api/item-levels/:itemId/upgrade", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { itemId } = req.params;
      const { luckBonus } = req.body;

      const [item] = await db
        .select()
        .from(itemLevels)
        .where(and(
          eq(itemLevels.userId, userId),
          eq(itemLevels.itemId, itemId)
        ));

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const upgradeCost = calculateUpgradeCost(item.currentLevel!);
      const result = attemptItemUpgrade(item.currentLevel!, luckBonus || 0);

      const upgradeAttempt = {
        timestamp: new Date().toISOString(),
        fromLevel: item.currentLevel,
        toLevel: result.newLevel,
        success: result.success,
        cost: upgradeCost,
      };

      const newHistory = [...(item.upgradeHistory as any[] || []), upgradeAttempt];

      const [updated] = await db
        .update(itemLevels)
        .set({
          currentLevel: result.newLevel,
          upgradeCount: (item.upgradeCount ?? 0) + 1,
          lastUpgradeAt: new Date(),
          upgradeHistory: newHistory,
          updatedAt: new Date(),
        })
        .where(eq(itemLevels.id, item.id))
        .returning();

      res.json({
        success: true,
        item: updated,
        upgradeResult: result,
        upgradeCost,
      });
    } catch (error) {
      console.error("Failed to upgrade item:", error);
      res.status(500).json({ message: "Failed to upgrade item" });
    }
  });

  // GET /api/item-levels/:itemId/stats - Get calculated stats for an item
  app.get("/api/item-levels/:itemId/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { itemId } = req.params;

      const [item] = await db
        .select()
        .from(itemLevels)
        .where(and(
          eq(itemLevels.userId, userId),
          eq(itemLevels.itemId, itemId)
        ));

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const stats = calculateItemStats(item, item.currentLevel!);
      const tierName = getItemLevelTierName(item.currentLevel!);
      const tierColor = getItemLevelTierColor(item.currentLevel!);

      res.json({
        success: true,
        item,
        stats,
        tierName,
        tierColor,
      });
    } catch (error) {
      console.error("Failed to get item stats:", error);
      res.status(500).json({ message: "Failed to get item stats" });
    }
  });
}
