import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import {
  dimensionalContracts,
  abyssalGateTokens,
  playerPowerLevels,
  itemLevels,
  raidChestRewards,
  abyssalGateRewards,
  empireProfiles,
} from "../shared/schema";
import { eq, and } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import {
  DIMENSIONAL_CONTRACT_TIERS,
  getContractTier,
  calculateTokensEarned,
  canOpenChest,
  rollChestRewards,
  rollRaidRewards,
} from "../shared/config/dimensionalContractConfig";
import {
  ABYSSAL_GATE_TIERS,
  getAbyssalGateTier,
  calculateAbyssalTokensEarned,
  canOpenAbyssalChest,
  rollAbyssalChestRewards,
  rollAbyssalGateRewards,
} from "../shared/config/abyssalGateConfig";
import {
  calculateTotalPower,
  getPowerTierName,
  getPowerTierColor,
} from "../shared/config/powerLevelConfig";
import {
  ITEM_LEVEL_TIERS,
  calculateItemStats,
  calculateUpgradeCost,
  attemptItemUpgrade,
  calculateExperienceToNextLevel,
  addItemExperience,
  getItemLevelTierName,
  getItemLevelTierColor,
} from "../shared/config/itemLevelConfig";

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
      const contracts = await db
        .select()
        .from(dimensionalContracts)
        .where(eq(dimensionalContracts.userId, userId));

      // If no contracts exist, create defaults for tier 1 and 9
      if (contracts.length === 0) {
        const tier1 = await db
          .insert(dimensionalContracts)
          .values({ userId, contractTier: 1 })
          .returning();
        const tier9 = await db
          .insert(dimensionalContracts)
          .values({ userId, contractTier: 9 })
          .returning();
        return res.json({ success: true, contracts: [tier1[0], tier9[0]] });
      }

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
      const contract = getContractTier(tier);

      if (!contract) {
        return res.status(400).json({ message: "Invalid contract tier" });
      }

      // Get or create contract
      let [userContract] = await db
        .select()
        .from(dimensionalContracts)
        .where(and(
          eq(dimensionalContracts.userId, userId),
          eq(dimensionalContracts.contractTier, tier)
        ));

      if (!userContract) {
        [userContract] = await db
          .insert(dimensionalContracts)
          .values({ userId, contractTier: tier })
          .returning();
      }

      // Calculate tokens earned (125 per raid, max 6900)
      const newTokensEarned = Math.min(
        userContract.tokensEarned + contract.tokensPerRaid,
        contract.maxTokensForChest
      );

      // Roll raid rewards
      const raidRewards = rollRaidRewards(tier);

      // Update contract
      const [updated] = await db
        .update(dimensionalContracts)
        .set({
          tokensEarned: newTokensEarned,
          raidsCompleted: userContract.raidsCompleted + 1,
          lastRaidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(dimensionalContracts.id, userContract.id))
        .returning();

      res.json({
        success: true,
        contract: updated,
        tokensEarned: contract.tokensPerRaid,
        totalTokens: newTokensEarned,
        canOpenChest: canOpenChest(newTokensEarned, tier),
        raidRewards,
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
      const contract = getContractTier(tier);

      if (!contract) {
        return res.status(400).json({ message: "Invalid contract tier" });
      }

      const [userContract] = await db
        .select()
        .from(dimensionalContracts)
        .where(and(
          eq(dimensionalContracts.userId, userId),
          eq(dimensionalContracts.contractTier, tier)
        ));

      if (!userContract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      const availableTokens = userContract.tokensEarned - userContract.tokensSpent;
      if (availableTokens < contract.maxTokensForChest) {
        return res.status(400).json({
          message: "Insufficient tokens",
          required: contract.maxTokensForChest,
          available: availableTokens,
        });
      }

      // Roll chest rewards
      const chestRewards = rollChestRewards(tier);

      // Update contract
      const [updated] = await db
        .update(dimensionalContracts)
        .set({
          tokensSpent: userContract.tokensSpent + contract.maxTokensForChest,
          chestsOpened: userContract.chestsOpened + 1,
          updatedAt: new Date(),
        })
        .where(eq(dimensionalContracts.id, userContract.id))
        .returning();

      // Log reward
      await db.insert(raidChestRewards).values({
        userId,
        contractType: "dimensional",
        contractTier: tier,
        tokensSpent: contract.maxTokensForChest,
        rewardsGranted: chestRewards,
      });

      res.json({
        success: true,
        contract: updated,
        chestRewards,
        remainingTokens: updated.tokensEarned - updated.tokensSpent,
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
      const tokens = await db
        .select()
        .from(abyssalGateTokens)
        .where(eq(abyssalGateTokens.userId, userId));

      // If no tokens exist, create defaults
      if (tokens.length === 0) {
        const tier1 = await db
          .insert(abyssalGateTokens)
          .values({ userId, gateTier: 1 })
          .returning();
        const tier3 = await db
          .insert(abyssalGateTokens)
          .values({ userId, gateTier: 3 })
          .returning();
        const tier6 = await db
          .insert(abyssalGateTokens)
          .values({ userId, gateTier: 6 })
          .returning();
        const tier9 = await db
          .insert(abyssalGateTokens)
          .values({ userId, gateTier: 9 })
          .returning();
        return res.json({ success: true, tokens: [tier1[0], tier3[0], tier6[0], tier9[0]] });
      }

      res.json({ success: true, tokens });
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
      const gate = getAbyssalGateTier(tier);

      if (!gate) {
        return res.status(400).json({ message: "Invalid gate tier" });
      }

      let [userToken] = await db
        .select()
        .from(abyssalGateTokens)
        .where(and(
          eq(abyssalGateTokens.userId, userId),
          eq(abyssalGateTokens.gateTier, tier)
        ));

      if (!userToken) {
        [userToken] = await db
          .insert(abyssalGateTokens)
          .values({ userId, gateTier: tier })
          .returning();
      }

      const newTokensEarned = Math.min(
        userToken.tokensEarned + gate.tokensPerGate,
        gate.maxTokensForChest
      );

      const gateRewards = rollAbyssalGateRewards(tier);

      const [updated] = await db
        .update(abyssalGateTokens)
        .set({
          tokensEarned: newTokensEarned,
          gatesCompleted: userToken.gatesCompleted + 1,
          lastGateAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(abyssalGateTokens.id, userToken.id))
        .returning();

      res.json({
        success: true,
        token: updated,
        tokensEarned: gate.tokensPerGate,
        totalTokens: newTokensEarned,
        canOpenChest: canOpenAbyssalChest(newTokensEarned, tier),
        gateRewards,
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
      const gate = getAbyssalGateTier(tier);

      if (!gate) {
        return res.status(400).json({ message: "Invalid gate tier" });
      }

      const [userToken] = await db
        .select()
        .from(abyssalGateTokens)
        .where(and(
          eq(abyssalGateTokens.userId, userId),
          eq(abyssalGateTokens.gateTier, tier)
        ));

      if (!userToken) {
        return res.status(404).json({ message: "Gate token not found" });
      }

      const availableTokens = userToken.tokensEarned - userToken.tokensSpent;
      if (availableTokens < gate.maxTokensForChest) {
        return res.status(400).json({
          message: "Insufficient tokens",
          required: gate.maxTokensForChest,
          available: availableTokens,
        });
      }

      const chestRewards = rollAbyssalChestRewards(tier);

      const [updated] = await db
        .update(abyssalGateTokens)
        .set({
          tokensSpent: userToken.tokensSpent + gate.maxTokensForChest,
          chestsOpened: userToken.chestsOpened + 1,
          updatedAt: new Date(),
        })
        .where(eq(abyssalGateTokens.id, userToken.id))
        .returning();

      await db.insert(abyssalGateRewards).values({
        userId,
        gateTier: tier,
        tokensSpent: gate.maxTokensForChest,
        rewardsGranted: chestRewards,
      });

      res.json({
        success: true,
        token: updated,
        chestRewards,
        remainingTokens: updated.tokensEarned - updated.tokensSpent,
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

      // Get all player data for power calculation
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

      // Update or create power level record
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
    const { POWER_SOURCES } = require("../shared/config/powerLevelConfig");
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

      // Check if already registered
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

      const result = addItemExperience(item.currentLevel, item.currentExperience, experience);

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

      const upgradeCost = calculateUpgradeCost(item.currentLevel);
      const result = attemptItemUpgrade(item.currentLevel, luckBonus || 0);

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
          upgradeCount: item.upgradeCount + 1,
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

      const stats = calculateItemStats(item, item.currentLevel);
      const tierName = getItemLevelTierName(item.currentLevel);
      const tierColor = getItemLevelTierColor(item.currentLevel);

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
