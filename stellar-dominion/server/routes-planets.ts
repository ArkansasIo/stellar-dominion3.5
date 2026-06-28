import type { Express, Request, Response } from "express";
import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

interface SubPlaneState {
  moonModules: Record<string, number>;
  stationModules: Record<string, number>;
  moonLevel: number;
  stationLevel: number;
}

type SubPlaneType = "moon" | "station";

const SUB_PLANE_STATE: Record<string, SubPlaneState> = {};

const MOON_MODULES: Record<string, { label: string; baseCost: { metal: number; crystal: number; deuterium: number } }> = {
  scannerArray: { label: "Scanner Array", baseCost: { metal: 550, crystal: 380, deuterium: 120 } },
  shieldGrid: { label: "Shield Grid", baseCost: { metal: 700, crystal: 260, deuterium: 180 } },
  resourceRelay: { label: "Resource Relay", baseCost: { metal: 400, crystal: 450, deuterium: 240 } },
};

const STATION_MODULES: Record<string, { label: string; baseCost: { metal: number; crystal: number; deuterium: number } }> = {
  logisticsCore: { label: "Logistics Core", baseCost: { metal: 900, crystal: 500, deuterium: 320 } },
  shipDock: { label: "Ship Dock", baseCost: { metal: 1200, crystal: 450, deuterium: 400 } },
  defenseMatrix: { label: "Defense Matrix", baseCost: { metal: 1100, crystal: 600, deuterium: 350 } },
};

const DEFENSE_SYSTEMS: Record<string, { label: string; baseCost: { metal: number; crystal: number; deuterium: number }; power: number }> = {
  missileBattery: { label: "Missile Battery", baseCost: { metal: 350, crystal: 120, deuterium: 40 }, power: 15 },
  laserTurret: { label: "Laser Turret", baseCost: { metal: 500, crystal: 280, deuterium: 90 }, power: 26 },
  gaussCannon: { label: "Gauss Cannon", baseCost: { metal: 900, crystal: 450, deuterium: 180 }, power: 42 },
  shieldGenerator: { label: "Shield Generator", baseCost: { metal: 1200, crystal: 700, deuterium: 260 }, power: 55 },
};

const PLANET_DEFENSE_STATE: Record<string, Record<string, number>> = {};

function getOrCreateSubPlaneState(planetId: string, planet: any): SubPlaneState {
  if (!SUB_PLANE_STATE[planetId]) {
    const baseMoonLevel = Math.max(1, Math.floor((planet?.buildings?.deuteriumSynthesizer || 0) / 2) + 1);
    const baseStationLevel = Math.max(1, Math.floor((planet?.buildings?.roboticsFactory || 0) / 2) + 1);
    SUB_PLANE_STATE[planetId] = {
      moonModules: {
        scannerArray: baseMoonLevel,
        shieldGrid: Math.max(1, baseMoonLevel - 1),
        resourceRelay: baseMoonLevel,
      },
      stationModules: {
        logisticsCore: baseStationLevel,
        shipDock: Math.max(1, baseStationLevel - 1),
        defenseMatrix: baseStationLevel,
      },
      moonLevel: baseMoonLevel,
      stationLevel: baseStationLevel,
    };
  }

  return SUB_PLANE_STATE[planetId];
}

function getUpgradeCost(baseCost: { metal: number; crystal: number; deuterium: number }, currentLevel: number) {
  const multiplier = Math.pow(1.45, currentLevel);
  return {
    metal: Math.floor(baseCost.metal * multiplier),
    crystal: Math.floor(baseCost.crystal * multiplier),
    deuterium: Math.floor(baseCost.deuterium * multiplier),
  };
}

function getOrCreateDefenseState(planetId: string, planet: any): Record<string, number> {
  if (!PLANET_DEFENSE_STATE[planetId]) {
    const baseLevel = Math.max(1, Math.floor((planet?.buildings?.roboticsFactory || 0) / 2));
    PLANET_DEFENSE_STATE[planetId] = {
      missileBattery: baseLevel + 1,
      laserTurret: baseLevel,
      gaussCannon: Math.max(0, baseLevel - 1),
      shieldGenerator: Math.max(0, baseLevel - 1),
    };
  }
  return PLANET_DEFENSE_STATE[planetId];
}

function calculateDefenseScore(defenseState: Record<string, number>): number {
  return Object.entries(defenseState).reduce((total, [systemKey, level]) => {
    const power = DEFENSE_SYSTEMS[systemKey]?.power || 0;
    return total + level * power;
  }, 0);
}

// Sample planet database (in production, this would be in a database)
const PLANET_DATABASE: {[key: string]: any} = {
  "P001": {
    id: "P001",
    name: "Kepler-452b",
    type: "temperate",
    size: "large",
    class: "M",
    coordinates: "1:1:1",
    temperature: 288,
    habitability: 95,
    resources: { metal: 50000, crystal: 30000, deuterium: 20000 },
    colonized: false,
    waterPercentage: 65,
  },
  "P002": {
    id: "P002",
    name: "Mars Prime",
    type: "desert",
    size: "medium",
    class: "D",
    coordinates: "1:1:2",
    temperature: 210,
    habitability: 45,
    resources: { metal: 100000, crystal: 50000, deuterium: 0 },
    colonized: true,
    waterPercentage: 5,
    owner: "Player",
    population: 50000,
    defenses: 250,
    buildings: {
      metalMine: 3,
      crystalMine: 2,
      deuteriumSynthesizer: 1,
      solarPlant: 4,
      roboticsFactory: 2,
    },
  },
  // Add more default planets
  "1": {
    id: "1",
    name: "Homeworld",
    type: "temperate",
    size: "large",
    class: "M",
    coordinates: "1:1:100:3",
    temperature: 295,
    habitability: 98,
    resources: { metal: 80000, crystal: 50000, deuterium: 30000 },
    colonized: true,
    waterPercentage: 70,
    owner: "Player",
    population: 120000,
    defenses: 500,
    buildings: {
      metalMine: 5,
      crystalMine: 4,
      deuteriumSynthesizer: 3,
      solarPlant: 6,
      roboticsFactory: 4,
    },
  },
  "2": {
    id: "2",
    name: "Luna Station",
    type: "barren",
    size: "small",
    class: "R",
    coordinates: "1:1:100:4",
    temperature: 150,
    habitability: 20,
    resources: { metal: 120000, crystal: 80000, deuterium: 5000 },
    colonized: true,
    waterPercentage: 0,
    owner: "Player",
    population: 15000,
    defenses: 150,
    buildings: {
      metalMine: 6,
      crystalMine: 5,
      deuteriumSynthesizer: 1,
      solarPlant: 3,
      roboticsFactory: 2,
    },
  },
};

// Middleware to check authentication
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function registerPlanetRoutes(app: Express) {
  // Get planet by ID
  app.get("/api/planets/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      // If planet is colonized, check if it belongs to the player
      if (planet.colonized && req.session?.userId) {
        const playerState = await db.query.playerStates.findFirst({
          where: eq(playerStates.userId, req.session.userId),
        });

        if (playerState) {
          planet.owner = playerState.planetName || "Player";
        }
      }

      res.json(planet);
    } catch (error) {
      console.error("Error fetching planet:", error);
      res.status(500).json({ error: "Failed to fetch planet data" });
    }
  });

  // Colonize a planet
  app.post("/api/planets/:id/colonize", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (planet.colonized) {
        return res.status(400).json({ error: "Planet is already colonized" });
      }

      // Check if player has enough resources (simplified - in production, check actual resources)
      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const colonizationCost = {
        metal: 10000,
        crystal: 5000,
        deuterium: 2000,
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

      // Deduct resources and colonize planet
      const newResources = {
        ...resources,
        metal: resources.metal - colonizationCost.metal,
        crystal: resources.crystal - colonizationCost.crystal,
        deuterium: resources.deuterium - colonizationCost.deuterium,
      };

      await db.update(playerStates)
        .set({ 
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Update planet data
      planet.colonized = true;
      planet.owner = playerState.planetName || "Player";
      planet.population = 5000;
      planet.defenses = 50;
      planet.buildings = {
        metalMine: 1,
        crystalMine: 1,
        deuteriumSynthesizer: 0,
        solarPlant: 1,
        roboticsFactory: 0,
      };

      res.json({ 
        message: "Planet colonized successfully",
        planet,
        newResources,
      });
    } catch (error) {
      console.error("Error colonizing planet:", error);
      res.status(500).json({ error: "Failed to colonize planet" });
    }
  });

  // Build/upgrade structure on planet
  app.post("/api/planets/:id/build", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const { buildingType } = req.body;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be colonized first" });
      }

      if (!buildingType) {
        return res.status(400).json({ error: "Building type is required" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const resources = playerState.resources as any;
      const currentLevel = planet.buildings[buildingType] || 0;
      const nextLevel = currentLevel + 1;

      // Calculate building cost (increases with level)
      const baseCosts: {[key: string]: any} = {
        metalMine: { metal: 60, crystal: 15, deuterium: 0 },
        crystalMine: { metal: 48, crystal: 24, deuterium: 0 },
        deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0 },
        solarPlant: { metal: 75, crystal: 30, deuterium: 0 },
        roboticsFactory: { metal: 400, crystal: 120, deuterium: 200 },
      };

      const baseCost = baseCosts[buildingType];
      if (!baseCost) {
        return res.status(400).json({ error: "Invalid building type" });
      }

      // Cost increases exponentially with level
      const cost = {
        metal: Math.floor(baseCost.metal * Math.pow(1.5, currentLevel)),
        crystal: Math.floor(baseCost.crystal * Math.pow(1.5, currentLevel)),
        deuterium: Math.floor(baseCost.deuterium * Math.pow(1.5, currentLevel)),
      };

      // Check if player has enough resources
      if (
        resources.metal < cost.metal ||
        resources.crystal < cost.crystal ||
        resources.deuterium < cost.deuterium
      ) {
        return res.status(400).json({ 
          error: "Insufficient resources",
          required: cost,
          available: resources,
        });
      }

      // Deduct resources and upgrade building
      const newResources = {
        ...resources,
        metal: resources.metal - cost.metal,
        crystal: resources.crystal - cost.crystal,
        deuterium: resources.deuterium - cost.deuterium,
      };

      await db.update(playerStates)
        .set({ 
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      // Update building level
      planet.buildings[buildingType] = nextLevel;

      res.json({ 
        message: `${buildingType} upgraded to level ${nextLevel}`,
        planet,
        newResources,
        cost,
      });
    } catch (error) {
      console.error("Error building structure:", error);
      res.status(500).json({ error: "Failed to build structure" });
    }
  });

  // Get all planets (for browsing)
  app.get("/api/planets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planets = Object.values(PLANET_DATABASE);
      res.json({ planets, count: planets.length });
    } catch (error) {
      console.error("Error fetching planets:", error);
      res.status(500).json({ error: "Failed to fetch planets" });
    }
  });

  app.get("/api/planets/:id/sub-planes", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      const state = getOrCreateSubPlaneState(planetId, planet);
      const moonStructures = Object.entries(MOON_MODULES).map(([key, module]) => ({
        key,
        label: module.label,
        level: state.moonModules[key] || 0,
        nextCost: getUpgradeCost(module.baseCost, state.moonModules[key] || 0),
      }));
      const stationModules = Object.entries(STATION_MODULES).map(([key, module]) => ({
        key,
        label: module.label,
        level: state.stationModules[key] || 0,
        nextCost: getUpgradeCost(module.baseCost, state.stationModules[key] || 0),
      }));

      const moonLevel = Object.values(state.moonModules).reduce((sum, value) => sum + value, 0);
      const stationLevel = Object.values(state.stationModules).reduce((sum, value) => sum + value, 0);

      state.moonLevel = moonLevel;
      state.stationLevel = stationLevel;

      res.json({
        moon: {
          exists: Boolean(planet.colonized),
          name: `${planet.name} Moon Base`,
          level: moonLevel,
          stability: Math.min(100, 45 + moonLevel * 3),
          structures: moonStructures,
          bonuses: {
            surveillance: moonLevel * 2,
            stealth: moonLevel,
            resourceAmplification: Math.floor(moonLevel * 1.5),
          },
        },
        station: {
          exists: Boolean(planet.colonized),
          name: `${planet.name} Orbital Station`,
          level: stationLevel,
          integrity: Math.min(100, 40 + stationLevel * 2),
          modules: stationModules,
          bonuses: {
            logistics: stationLevel * 2,
            shipCapacity: stationLevel * 20,
            defenseCoordination: Math.floor(stationLevel * 1.2),
          },
        },
        commandSummary: {
          defenseRating: (planet.defenses || 0) + stationLevel * 8 + moonLevel * 5,
          logisticsRating: stationLevel * 3,
          productionBonus: Math.floor((moonLevel + stationLevel) / 2),
        },
      });
    } catch (error) {
      console.error("Error fetching sub-plane data:", error);
      res.status(500).json({ error: "Failed to fetch sub-plane data" });
    }
  });

  app.post("/api/planets/:id/sub-planes/:type/upgrade", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const type = req.params.type as SubPlaneType;
      const moduleKey = String(req.body?.moduleKey || "");
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be colonized before managing sub-planes" });
      }

      if (type !== "moon" && type !== "station") {
        return res.status(400).json({ error: "Invalid sub-plane type" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const moduleCatalog = type === "moon" ? MOON_MODULES : STATION_MODULES;
      const moduleDefinition = moduleCatalog[moduleKey];
      if (!moduleDefinition) {
        return res.status(400).json({ error: "Invalid module key" });
      }

      const state = getOrCreateSubPlaneState(planetId, planet);
      const currentLevel = type === "moon" ? state.moonModules[moduleKey] || 0 : state.stationModules[moduleKey] || 0;
      const nextLevel = currentLevel + 1;
      const cost = getUpgradeCost(moduleDefinition.baseCost, currentLevel);

      const resources = playerState.resources as any;
      if (
        resources.metal < cost.metal ||
        resources.crystal < cost.crystal ||
        resources.deuterium < cost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources",
          required: cost,
          available: resources,
        });
      }

      const newResources = {
        ...resources,
        metal: resources.metal - cost.metal,
        crystal: resources.crystal - cost.crystal,
        deuterium: resources.deuterium - cost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      if (type === "moon") {
        state.moonModules[moduleKey] = nextLevel;
      } else {
        state.stationModules[moduleKey] = nextLevel;
      }

      state.moonLevel = Object.values(state.moonModules).reduce((sum, value) => sum + value, 0);
      state.stationLevel = Object.values(state.stationModules).reduce((sum, value) => sum + value, 0);

      res.json({
        message: `${moduleDefinition.label} upgraded to level ${nextLevel}`,
        type,
        moduleKey,
        level: nextLevel,
        cost,
      });
    } catch (error) {
      console.error("Error upgrading sub-plane module:", error);
      res.status(500).json({ error: "Failed to upgrade sub-plane module" });
    }
  });

  app.get("/api/planets/:id/defense", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      const defenseState = getOrCreateDefenseState(planetId, planet);
      const systems = Object.entries(DEFENSE_SYSTEMS).map(([key, definition]) => {
        const level = defenseState[key] || 0;
        return {
          key,
          label: definition.label,
          level,
          powerPerLevel: definition.power,
          totalPower: level * definition.power,
          nextCost: getUpgradeCost(definition.baseCost, level),
        };
      });

      const defenseScore = calculateDefenseScore(defenseState);
      planet.defenses = defenseScore;

      res.json({
        defenseScore,
        systems,
      });
    } catch (error) {
      console.error("Error loading planetary defense:", error);
      res.status(500).json({ error: "Failed to load planetary defense" });
    }
  });

  app.post("/api/planets/:id/defense/upgrade", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const systemKey = String(req.body?.systemKey || "");
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be colonized first" });
      }

      const definition = DEFENSE_SYSTEMS[systemKey];
      if (!definition) {
        return res.status(400).json({ error: "Invalid defense system" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const defenseState = getOrCreateDefenseState(planetId, planet);
      const currentLevel = defenseState[systemKey] || 0;
      const nextLevel = currentLevel + 1;
      const cost = getUpgradeCost(definition.baseCost, currentLevel);
      const resources = playerState.resources as any;

      if (
        resources.metal < cost.metal ||
        resources.crystal < cost.crystal ||
        resources.deuterium < cost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources",
          required: cost,
          available: resources,
        });
      }

      const newResources = {
        ...resources,
        metal: resources.metal - cost.metal,
        crystal: resources.crystal - cost.crystal,
        deuterium: resources.deuterium - cost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      defenseState[systemKey] = nextLevel;
      const defenseScore = calculateDefenseScore(defenseState);
      planet.defenses = defenseScore;

      res.json({
        message: `${definition.label} upgraded to level ${nextLevel}`,
        systemKey,
        level: nextLevel,
        cost,
        defenseScore,
      });
    } catch (error) {
      console.error("Error upgrading planetary defense:", error);
      res.status(500).json({ error: "Failed to upgrade planetary defense" });
    }
  });
}
