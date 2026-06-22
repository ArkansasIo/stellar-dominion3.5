import { type Express } from "express";
import { db } from "./db";
import { starbases, users } from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  STARBASE_TYPES,
  STARBASE_MODULES,
  getStarbaseUpgradeCost,
  getStarbaseBuildTime,
  calculateStarbaseStats,
  getModulesForStarbase,
  type StarbaseType,
} from "../shared/config/starbaseConfig";

export function registerStarbaseRoutes(app: Express) {
  // Get all starbases for the current player
  app.get("/api/starbases", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const playerStarbases = await db.query.starbases.findMany({
        where: eq(starbases.playerId, userId),
        orderBy: [desc(starbases.createdAt)],
      });

      const enriched = playerStarbases.map((sb) => {
        const typeInfo = STARBASE_TYPES[sb.starbaseType as StarbaseType];
        const stats = calculateStarbaseStats(
          sb.starbaseType as StarbaseType,
          sb.level,
          (sb as any).installedModules || []
        );
        return {
          ...sb,
          typeInfo,
          computedStats: stats,
          upgradeCost: getStarbaseUpgradeCost(sb.starbaseType as StarbaseType, sb.level),
          buildTime: getStarbaseBuildTime(sb.starbaseType as StarbaseType, sb.level),
        };
      });

      res.json({ success: true, starbases: enriched });
    } catch (error) {
      console.error("Error fetching starbases:", error);
      res.status(500).json({ error: "Failed to fetch starbases" });
    }
  });

  // Get starbase types catalog
  app.get("/api/starbases/types", (_req, res) => {
    res.json({ success: true, types: Object.values(STARBASE_TYPES) });
  });

  // Get available modules for a starbase type
  app.get("/api/starbase/modules/:starbaseType", (req, res) => {
    const type = req.params.starbaseType as StarbaseType;
    const modules = getModulesForStarbase(type);
    res.json({ success: true, modules });
  });

  // Get all modules catalog
  app.get("/api/starbase/modules", (_req, res) => {
    res.json({ success: true, modules: STARBASE_MODULES });
  });

  // Get specific starbase details
  app.get("/api/starbases/:id", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      const starbase = await db.query.starbases.findFirst({
        where: and(eq(starbases.id, req.params.id), eq(starbases.playerId, userId)),
      });

      if (!starbase) return res.status(404).json({ error: "Starbase not found" });

      const typeInfo = STARBASE_TYPES[starbase.starbaseType as StarbaseType];
      const stats = calculateStarbaseStats(
        starbase.starbaseType as StarbaseType,
        starbase.level,
        (starbase as any).installedModules || []
      );

      res.json({
        success: true,
        starbase: {
          ...starbase,
          typeInfo,
          computedStats: stats,
          upgradeCost: getStarbaseUpgradeCost(starbase.starbaseType as StarbaseType, starbase.level),
          buildTime: getStarbaseBuildTime(starbase.starbaseType as StarbaseType, starbase.level),
        },
      });
    } catch (error) {
      console.error("Error fetching starbase:", error);
      res.status(500).json({ error: "Failed to fetch starbase" });
    }
  });

  // Build a new starbase
  app.post("/api/starbases/build", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { starbaseType, name, coordinates } = req.body;
      if (!starbaseType || !STARBASE_TYPES[starbaseType as StarbaseType]) {
        return res.status(400).json({ error: "Invalid starbase type" });
      }

      const typeInfo = STARBASE_TYPES[starbaseType as StarbaseType];
      const buildCost = getStarbaseUpgradeCost(starbaseType as StarbaseType, 0);

      const [newStarbase] = await db
        .insert(starbases)
        .values({
          playerId: userId,
          starbaseType,
          name: name || typeInfo.name,
          level: 1,
          coordinates: coordinates || "0:0:0",
          metalStorage: typeInfo.baseStats.metalStorage,
          crystalStorage: typeInfo.baseStats.crystalStorage,
          deuteriumStorage: typeInfo.baseStats.deuteriumStorage,
          metalProductionRate: typeInfo.baseStats.metalProduction,
          crystalProductionRate: typeInfo.baseStats.crystalProduction,
          deuteriumProductionRate: typeInfo.baseStats.deuteriumProduction,
          hangarSlots: typeInfo.baseStats.hangarSlots,
          researchSlots: typeInfo.baseStats.researchSlots,
          defenseLevel: typeInfo.baseStats.defenseLevel,
          isActive: true,
        })
        .returning();

      res.json({ success: true, starbase: newStarbase, cost: buildCost });
    } catch (error) {
      console.error("Error building starbase:", error);
      res.status(500).json({ error: "Failed to build starbase" });
    }
  });

  // Upgrade a starbase
  app.post("/api/starbases/:id/upgrade", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      const starbase = await db.query.starbases.findFirst({
        where: and(eq(starbases.id, req.params.id), eq(starbases.playerId, userId)),
      });

      if (!starbase) return res.status(404).json({ error: "Starbase not found" });

      const typeInfo = STARBASE_TYPES[starbase.starbaseType as StarbaseType];
      if (starbase.level >= typeInfo.maxLevel) {
        return res.status(400).json({ error: "Maximum level reached" });
      }

      const cost = getStarbaseUpgradeCost(starbase.starbaseType as StarbaseType, starbase.level);
      const newLevel = starbase.level + 1;
      const levelMultiplier = 1 + (newLevel - 1) * 0.1;

      await db
        .update(starbases)
        .set({
          level: newLevel,
          metalStorage: Math.floor(typeInfo.baseStats.metalStorage * levelMultiplier),
          crystalStorage: Math.floor(typeInfo.baseStats.crystalStorage * levelMultiplier),
          deuteriumStorage: Math.floor(typeInfo.baseStats.deuteriumStorage * levelMultiplier),
          metalProductionRate: Math.floor(typeInfo.baseStats.metalProduction * levelMultiplier),
          crystalProductionRate: Math.floor(typeInfo.baseStats.crystalProduction * levelMultiplier),
          deuteriumProductionRate: Math.floor(typeInfo.baseStats.deuteriumProduction * levelMultiplier),
          defenseLevel: Math.floor(typeInfo.baseStats.defenseLevel * levelMultiplier),
          updatedAt: new Date(),
        })
        .where(eq(starbases.id, req.params.id));

      res.json({ success: true, newLevel, cost });
    } catch (error) {
      console.error("Error upgrading starbase:", error);
      res.status(500).json({ error: "Failed to upgrade starbase" });
    }
  });

  // Rename a starbase
  app.patch("/api/starbases/:id", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      const { name } = req.body;

      await db
        .update(starbases)
        .set({ name, updatedAt: new Date() })
        .where(and(eq(starbases.id, req.params.id), eq(starbases.playerId, userId)));

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating starbase:", error);
      res.status(500).json({ error: "Failed to update starbase" });
    }
  });

  // Toggle starbase active status
  app.post("/api/starbases/:id/toggle", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      const starbase = await db.query.starbases.findFirst({
        where: and(eq(starbases.id, req.params.id), eq(starbases.playerId, userId)),
      });

      if (!starbase) return res.status(404).json({ error: "Starbase not found" });

      await db
        .update(starbases)
        .set({ isActive: !starbase.isActive, updatedAt: new Date() })
        .where(eq(starbases.id, req.params.id));

      res.json({ success: true, isActive: !starbase.isActive });
    } catch (error) {
      console.error("Error toggling starbase:", error);
      res.status(500).json({ error: "Failed to toggle starbase" });
    }
  });

  // Delete a starbase
  app.delete("/api/starbases/:id", async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      await db
        .delete(starbases)
        .where(and(eq(starbases.id, req.params.id), eq(starbases.playerId, userId)));

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting starbase:", error);
      res.status(500).json({ error: "Failed to delete starbase" });
    }
  });
}
