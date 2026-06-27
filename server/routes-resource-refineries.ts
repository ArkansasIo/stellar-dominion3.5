import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerRefineries, playerStates } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import {
  REFINERY_TYPES,
  getRefineryById,
  getRecipeById,
  calculateRefineryCost,
  calculateRefineryEfficiency,
  calculateRefineryThroughput,
  calculateRecipeYield,
} from "../shared/config/resourceRefineryConfig";
import { isAuthenticated } from "./basicAuth";

function getUserId(req: Request): string {
  return req.session?.userId as string;
}

export function registerResourceRefineryRoutes(app: Express) {
  // GET /api/refineries/config - All refinery type definitions
  app.get("/api/refineries/config", (_req: Request, res: Response) => {
    res.json({ success: true, refineries: REFINERY_TYPES });
  });

  // GET /api/refineries - Player's refineries
  app.get("/api/refineries", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);

      const records = await db
        .select()
        .from(playerRefineries)
        .where(eq(playerRefineries.userId, userId));

      const [state] = await db
        .select({ resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId));

      const resources = (state?.resources as any) || {};

      // Calculate production for active refineries
      const now = new Date();
      const enriched = records.map((record) => {
        const typeDef = getRefineryById(record.refineryType);
        const recipe = record.activeRecipe ? getRecipeById(record.refineryType, record.activeRecipe) : null;

        let pendingProduction = null;
        if (record.isActive && recipe && record.lastCollectedAt) {
          const elapsed = Math.floor((now.getTime() - new Date(record.lastCollectedAt).getTime()) / 1000);
          const yieldResult = calculateRecipeYield(recipe, record.efficiency ?? 0, record.throughput ?? 0);
          const cycles = Math.floor(elapsed / yieldResult.timeSeconds);
          if (cycles > 0) {
            pendingProduction = {
              resource: recipe.output.resource,
              amount: cycles * yieldResult.amount,
              cycles,
              nextCycleAt: yieldResult.timeSeconds - (elapsed % yieldResult.timeSeconds),
            };
          }
        }

        const upgradeCost = typeDef
          ? calculateRefineryCost(record.level!, typeDef.baseBuildCost, typeDef.upgradeCostMultiplier)
          : null;

        return {
          ...record,
          typeDef,
          recipe,
          pendingProduction,
          upgradeCost,
          maxLevel: typeDef?.maxLevel || 50,
        };
      });

      // Find unbuilt refinery types
      const builtTypes = new Set(records.map((r) => r.refineryType));
      const unbuilt = REFINERY_TYPES.filter((t) => !builtTypes.has(t.id));

      res.json({
        success: true,
        refineries: enriched,
        unbuilt,
        resources,
      });
    } catch (error) {
      console.error("Failed to get refineries:", error);
      res.status(500).json({ message: "Failed to get refineries" });
    }
  });

  // POST /api/refineries/build - Build a new refinery
  app.post("/api/refineries/build", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { refineryType } = req.body;

      const typeDef = getRefineryById(refineryType);
      if (!typeDef) return res.status(400).json({ message: "Unknown refinery type" });

      const [existing] = await db
        .select()
        .from(playerRefineries)
        .where(and(eq(playerRefineries.userId, userId), eq(playerRefineries.refineryType, refineryType)));

      if (existing) return res.status(400).json({ message: "Refinery already built" });

      const [state] = await db
        .select({ resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId));

      const resources = (state?.resources as any) || {};
      const cost = typeDef.baseBuildCost;

      if ((resources.metal || 0) < cost.metal || (resources.crystal || 0) < cost.crystal || (resources.deuterium || 0) < cost.deuterium) {
        return res.status(400).json({ message: "Insufficient resources", cost });
      }

      // Deduct resources
      await db
        .update(playerStates)
        .set({
          resources: {
            ...resources,
            metal: (resources.metal || 0) - cost.metal,
            crystal: (resources.crystal || 0) - cost.crystal,
            deuterium: (resources.deuterium || 0) - cost.deuterium,
          },
        })
        .where(eq(playerStates.userId, userId));

      const [record] = await db
        .insert(playerRefineries)
        .values({
          userId,
          refineryType,
          level: 1,
          efficiency: calculateRefineryEfficiency(1),
          throughput: calculateRefineryThroughput(typeDef.baseThroughput, 1),
        })
        .returning();

      res.json({ success: true, record, cost });
    } catch (error) {
      console.error("Failed to build refinery:", error);
      res.status(500).json({ message: "Failed to build refinery" });
    }
  });

  // POST /api/refineries/upgrade/:id - Upgrade a refinery
  app.post("/api/refineries/upgrade/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const [record] = await db
        .select()
        .from(playerRefineries)
        .where(and(eq(playerRefineries.id, id), eq(playerRefineries.userId, userId)));

      if (!record) return res.status(404).json({ message: "Refinery not found" });

      const typeDef = getRefineryById(record.refineryType);
      if (!typeDef) return res.status(400).json({ message: "Unknown refinery type" });

      if ((record.level ?? 0) >= typeDef.maxLevel) {
        return res.status(400).json({ message: "Already at max level" });
      }

      const cost = calculateRefineryCost(record.level!, typeDef.baseBuildCost, typeDef.upgradeCostMultiplier);

      const [state] = await db
        .select({ resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId));

      const resources = (state?.resources as any) || {};

      if ((resources.metal || 0) < cost.metal || (resources.crystal || 0) < cost.crystal || (resources.deuterium || 0) < cost.deuterium) {
        return res.status(400).json({ message: "Insufficient resources", cost });
      }

      const newLevel = (record.level ?? 0) + 1;

      await db
        .update(playerStates)
        .set({
          resources: {
            ...resources,
            metal: (resources.metal || 0) - cost.metal,
            crystal: (resources.crystal || 0) - cost.crystal,
            deuterium: (resources.deuterium || 0) - cost.deuterium,
          },
        })
        .where(eq(playerStates.userId, userId));

      const [updated] = await db
        .update(playerRefineries)
        .set({
          level: newLevel,
          efficiency: calculateRefineryEfficiency(newLevel),
          throughput: calculateRefineryThroughput(typeDef.baseThroughput, newLevel),
          updatedAt: new Date(),
        })
        .where(eq(playerRefineries.id, id))
        .returning();

      res.json({ success: true, record: updated, cost, newLevel });
    } catch (error) {
      console.error("Failed to upgrade refinery:", error);
      res.status(500).json({ message: "Failed to upgrade refinery" });
    }
  });

  // POST /api/refineries/set-recipe/:id - Set active recipe
  app.post("/api/refineries/set-recipe/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      const { recipeId } = req.body;

      const [record] = await db
        .select()
        .from(playerRefineries)
        .where(and(eq(playerRefineries.id, id), eq(playerRefineries.userId, userId)));

      if (!record) return res.status(404).json({ message: "Refinery not found" });

      const recipe = recipeId ? getRecipeById(record.refineryType, recipeId) : null;

      const [updated] = await db
        .update(playerRefineries)
        .set({
          activeRecipe: recipeId || null,
          isActive: !!recipeId,
          lastCollectedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(playerRefineries.id, id))
        .returning();

      res.json({ success: true, record: updated });
    } catch (error) {
      console.error("Failed to set recipe:", error);
      res.status(500).json({ message: "Failed to set recipe" });
    }
  });

  // POST /api/refineries/collect/:id - Collect produced resources
  app.post("/api/refineries/collect/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const [record] = await db
        .select()
        .from(playerRefineries)
        .where(and(eq(playerRefineries.id, id), eq(playerRefineries.userId, userId)));

      if (!record) return res.status(404).json({ message: "Refinery not found" });
      if (!record.isActive || !record.activeRecipe) return res.status(400).json({ message: "Refinery not active" });
      if (!record.lastCollectedAt) return res.status(400).json({ message: "No production to collect" });

      const recipe = getRecipeById(record.refineryType, record.activeRecipe);
      if (!recipe) return res.status(400).json({ message: "Invalid recipe" });

      const now = new Date();
      const elapsed = Math.floor((now.getTime() - new Date(record.lastCollectedAt).getTime()) / 1000);
      const yieldResult = calculateRecipeYield(recipe, record.efficiency ?? 0, record.throughput ?? 0);
      const cycles = Math.floor(elapsed / yieldResult.timeSeconds);

      if (cycles <= 0) return res.status(400).json({ message: "No production ready yet" });

      const produced = cycles * yieldResult.amount;

      // Add resources to player
      const [state] = await db
        .select({ resources: playerStates.resources })
        .from(playerStates)
        .where(eq(playerStates.userId, userId));

      const resources = (state?.resources as any) || {};

      await db
        .update(playerStates)
        .set({
          resources: {
            ...resources,
            [recipe.output.resource]: (resources[recipe.output.resource] || 0) + produced,
          },
        })
        .where(eq(playerStates.userId, userId));

      // Update refinery stats
      const [updated] = await db
        .update(playerRefineries)
        .set({
          totalProcessed: (record.totalProcessed || 0) + produced,
          lastCollectedAt: now,
          updatedAt: now,
        })
        .where(eq(playerRefineries.id, id))
        .returning();

      res.json({
        success: true,
        collected: { resource: recipe.output.resource, amount: produced, cycles },
        record: updated,
      });
    } catch (error) {
      console.error("Failed to collect:", error);
      res.status(500).json({ message: "Failed to collect resources" });
    }
  });

  // POST /api/refineries/toggle/:id - Toggle refinery on/off
  app.post("/api/refineries/toggle/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const [record] = await db
        .select()
        .from(playerRefineries)
        .where(and(eq(playerRefineries.id, id), eq(playerRefineries.userId, userId)));

      if (!record) return res.status(404).json({ message: "Refinery not found" });

      const [updated] = await db
        .update(playerRefineries)
        .set({
          isActive: !record.isActive,
          lastCollectedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(playerRefineries.id, id))
        .returning();

      res.json({ success: true, record: updated });
    } catch (error) {
      console.error("Failed to toggle refinery:", error);
      res.status(500).json({ message: "Failed to toggle refinery" });
    }
  });
}
