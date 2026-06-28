import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { playerStates } from "../shared/schema";
import { OGAME_CATALOG_ENTRY_MAP } from "../shared/config/ogameCatalogConfig";
import type { Express } from "express";

export function registerOGameTerraformerRoutes(app: Express) {
  app.get("/api/ogame/terraformer/status", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const buildings = state.buildings ?? {};
      const terraformerLevel = buildings.terraformer ?? 0;

      const entry = OGAME_CATALOG_ENTRY_MAP.terraformer;
      const extraFieldsPerLevel = entry?.stats?.extraFieldsPerLevel ?? 5;
      const extraFields = terraformerLevel * extraFieldsPerLevel;

      const baseFields = 60;
      const totalFields = baseFields + extraFields;

      const nextLevel = terraformerLevel + 1;
      const growthFactor = entry?.growthFactor ?? 2;
      const nextCost = entry ? {
        metal: Math.floor((entry.baseCost.metal ?? 0) * Math.pow(growthFactor, nextLevel - 1)),
        crystal: Math.floor((entry.baseCost.crystal ?? 0) * Math.pow(growthFactor, nextLevel - 1)),
        deuterium: Math.floor((entry.baseCost.deuterium ?? 0) * Math.pow(growthFactor, nextLevel - 1)),
        energy: entry.baseCost.energy ?? 0,
      } : null;

      res.json({
        terraformerLevel,
        extraFields,
        baseFields,
        totalFields,
        nextLevelCost: nextCost,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ogame/terraformer/upgrade", isAuthenticated as any, async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const [state] = await db.select().from(playerStates).where(eq(playerStates.userId, userId)).limit(1);
      if (!state) return res.status(404).json({ error: "Player state not found" });

      const buildings = state.buildings ?? {};
      const research = state.research ?? {};
      const resources = state.resources ?? {};
      const currentLevel = buildings.terraformer ?? 0;
      const nextLevel = currentLevel + 1;

      const entry = OGAME_CATALOG_ENTRY_MAP.terraformer;
      if (!entry) return res.status(500).json({ error: "Terraformer config not found" });

      if (entry.prerequisites) {
        for (const [reqId, reqLevel] of Object.entries(entry.prerequisites)) {
          const prereqLevel = buildings[reqId] ?? research[reqId] ?? 0;
          if (prereqLevel < (reqLevel as number)) {
            return res.status(400).json({ error: `Prerequisite ${reqId} level ${reqLevel} required (have ${prereqLevel})` });
          }
        }
      }

      const growthFactor = entry.growthFactor ?? 2;
      const cost = {
        metal: Math.floor((entry.baseCost.metal ?? 0) * Math.pow(growthFactor, currentLevel)),
        crystal: Math.floor((entry.baseCost.crystal ?? 0) * Math.pow(growthFactor, currentLevel)),
        deuterium: Math.floor((entry.baseCost.deuterium ?? 0) * Math.pow(growthFactor, currentLevel)),
        energy: entry.baseCost.energy ?? 0,
      };

      if ((resources.metal ?? 0) < cost.metal) return res.status(400).json({ error: `Not enough metal (need ${cost.metal})` });
      if ((resources.crystal ?? 0) < cost.crystal) return res.status(400).json({ error: `Not enough crystal (need ${cost.crystal})` });
      if ((resources.deuterium ?? 0) < cost.deuterium) return res.status(400).json({ error: `Not enough deuterium (need ${cost.deuterium})` });
      if ((resources.energy ?? 0) < cost.energy) return res.status(400).json({ error: `Not enough energy (need ${cost.energy})` });

      const newBuildings = { ...buildings, terraformer: nextLevel };

      await db.update(playerStates)
        .set({
          buildings: sql`jsonb_set(COALESCE(buildings, '{}'::jsonb), '{}', ${JSON.stringify(newBuildings)}::jsonb)`,
          resources: sql`jsonb_set(COALESCE(resources, '{}'::jsonb), '{}', ${JSON.stringify({
            ...resources,
            metal: (resources.metal ?? 0) - cost.metal,
            crystal: (resources.crystal ?? 0) - cost.crystal,
            deuterium: (resources.deuterium ?? 0) - cost.deuterium,
          })}::jsonb)`,
        })
        .where(eq(playerStates.userId, userId));

      const extraFieldsPerLevel = entry.stats?.extraFieldsPerLevel ?? 5;
      const totalExtraFields = nextLevel * extraFieldsPerLevel;

      res.json({
        success: true,
        newLevel: nextLevel,
        extraFields: totalExtraFields,
        message: `Terraformer upgraded to level ${nextLevel}. ${extraFieldsPerLevel} new building fields unlocked.`,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
