import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { playerStates, moonBases } from "../shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";
import { isAuthenticated } from "./basicAuth";
import {
  ENHANCED_MOON_TYPES,
  calculateMoonSubStats,
  calculateMoonAttributes,
  generateMoonDetails,
  generateMoonStatus,
  calculateMoonRarity,
  type EnhancedMoon,
} from "../shared/config/enhancedMoonSystem";
import type { MoonType } from "../shared/config/moonsProgression";

export function registerMoonRoutes(app: Express) {
  // Get all moons for a planet
  app.get("/api/moons/planet/:planetId", async (req: Request, res: Response) => {
    try {
      const planetId = req.params.planetId;
      const moons = await storage.getMoonsByPlanet(planetId);
      
      res.json({
        moons,
        count: moons.length,
        planetId,
      });
    } catch (error) {
      console.error("Error fetching moons:", error);
      res.status(500).json({ error: "Failed to fetch moons" });
    }
  });

  // Get specific moon details
  app.get("/api/moons/:moonId", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      res.json(moon);
    } catch (error) {
      console.error("Error fetching moon:", error);
      res.status(500).json({ error: "Failed to fetch moon data" });
    }
  });

  // Get moon comprehensive stats
  app.get("/api/moons/:moonId/stats", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      res.json({
        id: moon.id,
        name: moon.name,
        tier: moon.tier,
        level: moon.level,
        rarity: moon.rarity,
        stats: moon.stats,
        subStats: moon.subStats,
        attributes: moon.attributes,
        details: moon.details,
        status: moon.status,
      });
    } catch (error) {
      console.error("Error fetching moon stats:", error);
      res.status(500).json({ error: "Failed to fetch moon stats" });
    }
  });

  // Get moon status and conditions
  app.get("/api/moons/:moonId/status", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      res.json({
        id: moon.id,
        name: moon.name,
        status: moon.status,
        condition: moon.status.condition,
        stability: moon.status.stability,
        health: moon.status.health,
        isInhabited: moon.status.isInhabited,
        isColonized: moon.status.isColonized,
        isDeveloped: moon.status.isDeveloped,
        activeEvents: moon.status.activeEvents,
        alerts: moon.status.alerts,
        supplyLinesStatus: moon.status.supplyLinesStatus,
      });
    } catch (error) {
      console.error("Error fetching moon status:", error);
      res.status(500).json({ error: "Failed to fetch moon status" });
    }
  });

  // Get moon attributes and physical properties
  app.get("/api/moons/:moonId/attributes", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      res.json({
        id: moon.id,
        name: moon.name,
        type: moon.type,
        biome: moon.biome,
        atmosphere: moon.atmosphere,
        attributes: moon.attributes,
        description: moon.description,
        lore: moon.lore,
      });
    } catch (error) {
      console.error("Error fetching moon attributes:", error);
      res.status(500).json({ error: "Failed to fetch moon attributes" });
    }
  });

  // Get moon details and history
  app.get("/api/moons/:moonId/details", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      res.json({
        id: moon.id,
        name: moon.name,
        details: moon.details,
        developmentStage: moon.details.developmentStage,
        population: moon.details.population,
        gdp: moon.details.gdp,
        defenseRating: moon.details.defenseRating,
        uniqueFeatures: moon.details.uniqueFeatures,
        anomalies: moon.details.anomalies,
        strategicValue: moon.details.strategicValue,
        scientificValue: moon.details.scientificValue,
      });
    } catch (error) {
      console.error("Error fetching moon details:", error);
      res.status(500).json({ error: "Failed to fetch moon details" });
    }
  });

  // Colonize a moon
  app.post("/api/moons/:moonId/colonize", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const userId = req.session?.userId || "";
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      if (moon.details.currentOwner) {
        return res.status(400).json({ error: "Moon is already colonized" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const colonizationCost = {
        metal: 15000,
        crystal: 8000,
        deuterium: 3000,
      };

      if (
        resources.metal < colonizationCost.metal ||
        resources.crystal < colonizationCost.crystal ||
        resources.deuterium < colonizationCost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources for colonization",
          required: colonizationCost,
          available: resources,
        });
      }

      // Deduct resources and colonize moon
      const newResources = {
        ...resources,
        metal: resources.metal - colonizationCost.metal,
        crystal: resources.crystal - colonizationCost.crystal,
        deuterium: resources.deuterium - colonizationCost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Update moon ownership
      moon.details.currentOwner = userId;
      moon.details.controllingFaction = userId;
      moon.details.firstColonized = new Date().toISOString();
      moon.details.colonizationHistory.push({
        date: new Date().toISOString(),
        event: "Initial colonization",
        colonizer: userId,
      });
      moon.status.isColonized = true;
      moon.status.isInhabited = true;
      moon.updatedAt = Date.now();
      await storage.updateMoon(moonId, moon);

      res.json({
        message: "Moon colonized successfully",
        moon,
        newResources,
      });
    } catch (error) {
      console.error("Error colonizing moon:", error);
      res.status(500).json({ error: "Failed to colonize moon" });
    }
  });

  // Upgrade moon level
  app.post("/api/moons/:moonId/upgrade", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const userId = req.session?.userId || "";
      const moon = await storage.getMoonById(moonId);

      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      if (moon.details.currentOwner !== userId) {
        return res.status(403).json({ error: "You do not own this moon" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const upgradeCost = calculateMoonUpgradeCost(moon.tier, moon.level);

      if (
        resources.metal < upgradeCost.metal ||
        resources.crystal < upgradeCost.crystal ||
        resources.deuterium < upgradeCost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources for upgrade",
          required: upgradeCost,
          available: resources,
        });
      }

      // Deduct resources and upgrade moon
      const newResources = {
        ...resources,
        metal: resources.metal - upgradeCost.metal,
        crystal: resources.crystal - upgradeCost.crystal,
        deuterium: resources.deuterium - upgradeCost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Upgrade moon
      moon.level += 1;
      moon.experience = 0;
      moon.experienceToNextLevel = calculateMoonExperienceRequired(moon.level + 1);
      
      // Recalculate stats
      const typeConfig = ENHANCED_MOON_TYPES[moon.type];
      moon.subStats = calculateMoonSubStats(typeConfig.baseSubStats, moon.tier, moon.level);
      moon.attributes = calculateMoonAttributes(typeConfig.baseAttributes, moon.tier, moon.level);
      moon.details = generateMoonDetails(moon.name, moon.tier, moon.level, userId);
      moon.status = generateMoonStatus(moon.tier, moon.level);
      moon.updatedAt = Date.now();
      await storage.updateMoon(moonId, moon);

      res.json({
        message: `Moon upgraded to level ${moon.level}`,
        moon,
        newResources,
        cost: upgradeCost,
      });
    } catch (error) {
      console.error("Error upgrading moon:", error);
      res.status(500).json({ error: "Failed to upgrade moon" });
    }
  });

  // Build moon base
  app.post("/api/moons/:moonId/build-base", async (req: Request, res: Response) => {
    try {
      const moonId = req.params.moonId;
      const userId = req.session?.userId || "";
      const { baseType, baseClass } = req.body;

      const moon = await storage.getMoonById(moonId);
      if (!moon) {
        return res.status(404).json({ error: "Moon not found" });
      }

      if (moon.details.currentOwner !== userId) {
        return res.status(403).json({ error: "You do not own this moon" });
      }

      if (moon.base) {
        return res.status(400).json({ error: "Moon already has a base" });
      }

      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const baseCost = calculateBaseCost(baseType, baseClass);

      if (
        resources.metal < baseCost.metal ||
        resources.crystal < baseCost.crystal ||
        resources.deuterium < baseCost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources for base construction",
          required: baseCost,
          available: resources,
        });
      }

      // Deduct resources and build base
      const newResources = {
        ...resources,
        metal: resources.metal - baseCost.metal,
        crystal: resources.crystal - baseCost.crystal,
        deuterium: resources.deuterium - baseCost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Create moon base in database
      const [newBase] = await db
        .insert(moonBases)
        .values({
          playerId: userId,
          baseType,
          name: `${moon.name} Base`,
          level: 1,
          coordinates: moon.coordinates,
          moonName: moon.name,
        })
        .returning();

      // Update moon with base info
      moon.base = {
        id: newBase.id,
        name: newBase.name,
        type: baseType as any,
        class: baseClass as any,
        tier: 1,
        level: 1,
        owner: userId,
        population: 100,
        defense: 50,
        production: 100,
        research: 50,
        storage: 5000,
        garrison: [],
        starRating: 0,
        starExperience: 0,
        starMaxExperience: 1000,
        starProgress: 0,
        sRankTier: 'none',
        sRankLevel: 0,
        sRankExperience: 0,
        sRankMaxExperience: 1000000,
        sRankProgress: 0,
      };

      moon.updatedAt = Date.now();
      await storage.updateMoon(moonId, moon);

      res.json({
        message: "Moon base constructed successfully",
        moon,
        base: newBase,
        newResources,
        cost: baseCost,
      });
    } catch (error) {
      console.error("Error building moon base:", error);
      res.status(500).json({ error: "Failed to build moon base" });
    }
  });

  // Generate new moon (admin/testing)
  app.post("/api/moons/generate", async (req: Request, res: Response) => {
    try {
      const { planetId, type, tier, level } = req.body;

      const moonId = `moon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const typeConfig = ENHANCED_MOON_TYPES[type as MoonType] || ENHANCED_MOON_TYPES['rocky'];
      
      const moon: EnhancedMoon = {
        id: moonId,
        name: `Moon ${moonId.slice(-6).toUpperCase()}`,
        parentPlanetId: planetId || "P001",
        parentPlanetName: "Unknown Planet",
        systemId: "SYS-001",
        coordinates: "1:1:1:1",
        tier: tier || 1,
        level: level || 1,
        type: type as MoonType || 'rocky',
        biome: typeConfig.defaultBiome,
        atmosphere: typeConfig.defaultAtmosphere,
        rarity: calculateMoonRarity(type, tier || 1, typeConfig.specialProperties),
        stats: {
          mass: typeConfig.baseMass,
          orbitRadius: Math.random() * 500000 + 50000,
          orbitPeriod: Math.random() * 100 + 10,
          gravity: typeConfig.baseMass * 2,
          resourceDensity: typeConfig.baseResourceDensity,
          stability: typeConfig.baseStability * 100,
          mineralWealth: typeConfig.mineralWealth,
          energyOutput: typeConfig.mineralWealth * 10,
        },
        subStats: calculateMoonSubStats(typeConfig.baseSubStats, tier || 1, level || 1),
        attributes: calculateMoonAttributes(typeConfig.baseAttributes, tier || 1, level || 1),
        details: generateMoonDetails(`Moon ${moonId.slice(-6).toUpperCase()}`, tier || 1, level || 1, null),
        status: generateMoonStatus(tier || 1, level || 1),
        experience: 0,
        experienceToNextLevel: calculateMoonExperienceRequired(level || 1),
        unlockedFeatures: [],
        resources: {
          metal: Math.floor(Math.random() * 50000 * typeConfig.baseResourceDensity),
          crystal: Math.floor(Math.random() * 30000 * typeConfig.baseResourceDensity),
          deuterium: Math.floor(Math.random() * 20000 * typeConfig.baseResourceDensity),
        },
        resourceCapacity: {
          metal: 100000,
          crystal: 50000,
          deuterium: 25000,
        },
        productionRates: {
          metal: 100,
          crystal: 50,
          deuterium: 25,
        },
        base: null,
        facilities: [],
        icon: type === 'icy' ? '🧊' : type === 'metallic' ? '⚙️' : '🌙',
        color: typeConfig.color,
        description: typeConfig.description,
        lore: typeConfig.lore,
        explored: true,
        discoverer: "Admin",
        lastVisited: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await storage.createMoon(moon);

      res.json({
        message: "Moon generated successfully",
        moon,
      });
    } catch (error) {
      console.error("Error generating moon:", error);
      res.status(500).json({ error: "Failed to generate moon" });
    }
  });

  // Rename moon
  app.patch("/api/moons/:moonId/rename", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || "dev-user";
      const { moonId } = req.params;
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
      }
      const trimmed = name.trim().slice(0, 64);
      const moon = await storage.getMoonBaseById(moonId);
      if (!moon || moon.playerId !== userId) {
        return res.status(404).json({ error: "Moon not found" });
      }
      await storage.updateMoonBase(moonId, { moonName: trimmed, name: trimmed, updatedAt: new Date() });
      res.json({ success: true, name: trimmed });
    } catch (error) {
      console.error("Error renaming moon:", error);
      res.status(500).json({ error: "Failed to rename moon" });
    }
  });
}

/**
 * Calculate moon upgrade cost
 */
function calculateMoonUpgradeCost(tier: number, currentLevel: number): { metal: number; crystal: number; deuterium: number } {
  const baseCost = 5000;
  const multiplier = Math.pow(1.5, currentLevel);
  const tierMultiplier = 1 + (tier - 1) * 0.2;

  return {
    metal: Math.floor(baseCost * multiplier * tierMultiplier),
    crystal: Math.floor(baseCost * 0.6 * multiplier * tierMultiplier),
    deuterium: Math.floor(baseCost * 0.3 * multiplier * tierMultiplier),
  };
}

/**
 * Calculate base construction cost
 */
function calculateBaseCost(baseType: string, baseClass: string): { metal: number; crystal: number; deuterium: number } {
  const baseCosts: Record<string, number> = {
    'outpost': 10000,
    'military-base': 50000,
    'research-station': 35000,
    'mining-colony': 25000,
    'refinery': 30000,
    'spaceport': 40000,
    'megastructure-anchor': 500000,
  };

  const classMultipliers: Record<string, number> = {
    'small': 1,
    'medium': 2,
    'large': 4,
    'capital': 8,
    'ancient': 15,
    'ascended': 30,
  };

  const baseCost = baseCosts[baseType] || 10000;
  const classMultiplier = classMultipliers[baseClass] || 1;

  return {
    metal: Math.floor(baseCost * classMultiplier),
    crystal: Math.floor(baseCost * 0.6 * classMultiplier),
    deuterium: Math.floor(baseCost * 0.3 * classMultiplier),
  };
}

/**
 * Calculate moon experience required for next level
 */
function calculateMoonExperienceRequired(currentLevel: number): number {
  return Math.floor(1000 * Math.pow(1.15, currentLevel - 1));
}