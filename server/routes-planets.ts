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

interface OccupationActionLog {
  id: string;
  type: "garrison" | "suppression" | "extraction" | "fortification" | "policy";
  summary: string;
  timestamp: number;
}

interface OccupationState {
  captured: boolean;
  resistance: number;
  loyalty: number;
  suppression: number;
  extractionTaxRate: number;
  reserveUnits: Record<string, number>;
  garrison: Record<string, number>;
  fortifications: Record<string, number>;
  resourceVault: {
    metal: number;
    crystal: number;
    deuterium: number;
    credits: number;
  };
  lastSweepAt: number | null;
  lastExtractionAt: number | null;
  actionLog: OccupationActionLog[];
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
const PLANET_OCCUPATION_STATE: Record<string, OccupationState> = {};

const OCCUPATION_UNIT_CATALOG: Record<string, { label: string; weight: number; control: number }> = {
  infantry: { label: "Infantry Cohort", weight: 1, control: 1.2 },
  shockTroopers: { label: "Shock Troopers", weight: 2.4, control: 1.8 },
  specialOps: { label: "Special Operations", weight: 3.2, control: 2.3 },
  armor: { label: "Armor Battalion", weight: 4.4, control: 2.6 },
  peacekeepers: { label: "Peacekeeper Corps", weight: 1.6, control: 1.5 },
};

const OCCUPATION_FORTIFICATIONS: Record<
  string,
  {
    label: string;
    baseCost: { metal: number; crystal: number; deuterium: number };
    controlBonus: number;
    extractionBonus: number;
    durability: number;
  }
> = {
  garrisonHub: {
    label: "Garrison Hub",
    baseCost: { metal: 1400, crystal: 600, deuterium: 240 },
    controlBonus: 5,
    extractionBonus: 0.08,
    durability: 16,
  },
  bunkerNetwork: {
    label: "Bunker Network",
    baseCost: { metal: 1800, crystal: 500, deuterium: 420 },
    controlBonus: 7,
    extractionBonus: 0.03,
    durability: 24,
  },
  planetaryShield: {
    label: "Planetary Shield",
    baseCost: { metal: 2200, crystal: 1200, deuterium: 650 },
    controlBonus: 9,
    extractionBonus: 0.04,
    durability: 32,
  },
  jammerArray: {
    label: "Jammer Array",
    baseCost: { metal: 1200, crystal: 1500, deuterium: 500 },
    controlBonus: 6,
    extractionBonus: 0.02,
    durability: 18,
  },
};

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

function clampValue(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function appendOccupationLog(state: OccupationState, type: OccupationActionLog["type"], summary: string) {
  state.actionLog.unshift({
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    summary,
    timestamp: Date.now(),
  });
  state.actionLog = state.actionLog.slice(0, 8);
}

function getOccupationFortificationStrength(state: OccupationState) {
  return Object.entries(state.fortifications).reduce((total, [key, level]) => {
    const definition = OCCUPATION_FORTIFICATIONS[key];
    return total + level * (definition?.durability || 0);
  }, 0);
}

function getOccupationGarrisonStrength(state: OccupationState) {
  return Object.entries(state.garrison).reduce((total, [key, amount]) => {
    const definition = OCCUPATION_UNIT_CATALOG[key];
    return total + amount * (definition?.weight || 0);
  }, 0);
}

function getOccupationProjection(state: OccupationState) {
  const garrisonStrength = getOccupationGarrisonStrength(state);
  const fortificationStrength = getOccupationFortificationStrength(state);
  const garrisonHubLevel = state.fortifications.garrisonHub || 0;
  const bunkerLevel = state.fortifications.bunkerNetwork || 0;
  const shieldLevel = state.fortifications.planetaryShield || 0;
  const jammerLevel = state.fortifications.jammerArray || 0;

  const extractionModifier = Math.max(
    0.35,
    1 +
      garrisonHubLevel * 0.08 +
      bunkerLevel * 0.03 +
      jammerLevel * 0.02 +
      shieldLevel * 0.04 -
      state.resistance * 0.006,
  );

  const controlRating = clampValue(
    Math.round(
      state.suppression +
        state.loyalty * 0.45 +
        garrisonStrength / 14 +
        fortificationStrength * 0.35 -
        state.resistance * 0.55,
    ),
  );

  const nextExtraction = {
    metal: Math.max(0, Math.floor(state.resourceVault.metal * (state.extractionTaxRate / 100) * extractionModifier)),
    crystal: Math.max(0, Math.floor(state.resourceVault.crystal * (state.extractionTaxRate / 100) * extractionModifier)),
    deuterium: Math.max(0, Math.floor(state.resourceVault.deuterium * (state.extractionTaxRate / 100) * extractionModifier)),
    credits: Math.max(
      0,
      Math.floor((state.resourceVault.credits + garrisonStrength * 3 + fortificationStrength * 2) * (state.extractionTaxRate / 100)),
    ),
  };

  const status =
    state.resistance >= 65 ? "Contested" : state.resistance >= 35 ? "Stabilizing" : state.loyalty >= 70 ? "Compliant" : "Occupied";

  return {
    garrisonStrength,
    fortificationStrength,
    controlRating,
    extractionModifier,
    nextExtraction,
    status,
  };
}

function getOrCreateOccupationState(planetId: string, planet: any): OccupationState {
  if (!PLANET_OCCUPATION_STATE[planetId]) {
    const defenses = Math.max(0, planet?.defenses || 0);
    const robotics = Math.max(0, planet?.buildings?.roboticsFactory || 0);
    const population = Math.max(5000, planet?.population || 25000);

    PLANET_OCCUPATION_STATE[planetId] = {
      captured: Boolean(planet?.colonized),
      resistance: clampValue(58 - robotics * 4 - Math.floor(defenses / 60)),
      loyalty: clampValue(32 + robotics * 5 + Math.floor(defenses / 75)),
      suppression: clampValue(24 + robotics * 6),
      extractionTaxRate: 18,
      reserveUnits: {
        infantry: Math.max(60, Math.floor(population / 480)),
        shockTroopers: Math.max(18, Math.floor(population / 1600)),
        specialOps: Math.max(6, Math.floor(population / 5000)),
        armor: Math.max(4, Math.floor(population / 6000)),
        peacekeepers: Math.max(20, Math.floor(population / 1200)),
      },
      garrison: {
        infantry: Math.max(40, Math.floor(population / 900)),
        shockTroopers: Math.max(10, Math.floor(population / 3000)),
        specialOps: Math.max(4, Math.floor(population / 9000)),
        armor: Math.max(2, Math.floor(population / 12000)),
        peacekeepers: Math.max(12, Math.floor(population / 2400)),
      },
      fortifications: {
        garrisonHub: Math.max(1, robotics),
        bunkerNetwork: Math.max(1, Math.floor(defenses / 160) + 1),
        planetaryShield: Math.max(0, Math.floor(defenses / 220)),
        jammerArray: Math.max(0, Math.floor((planet?.buildings?.deuteriumSynthesizer || 0) / 2)),
      },
      resourceVault: {
        metal: Math.max(3500, Math.floor((planet?.resources?.metal || 0) * 0.25)),
        crystal: Math.max(2200, Math.floor((planet?.resources?.crystal || 0) * 0.22)),
        deuterium: Math.max(900, Math.floor((planet?.resources?.deuterium || 0) * 0.2)),
        credits: Math.max(1800, Math.floor(population / 5)),
      },
      lastSweepAt: null,
      lastExtractionAt: null,
      actionLog: [],
    };
  }

  return PLANET_OCCUPATION_STATE[planetId];
}

function buildOccupationPayload(planetId: string, planet: any, state: OccupationState) {
  const projection = getOccupationProjection(state);

  return {
    planet: {
      id: planetId,
      name: planet.name,
      coordinates: planet.coordinates,
      type: planet.type,
      class: planet.class,
      population: planet.population || 0,
    },
    occupation: {
      captured: state.captured,
      resistance: state.resistance,
      loyalty: state.loyalty,
      suppression: state.suppression,
      extractionTaxRate: state.extractionTaxRate,
      lastSweepAt: state.lastSweepAt,
      lastExtractionAt: state.lastExtractionAt,
      status: projection.status,
      summary: {
        garrisonStrength: Math.round(projection.garrisonStrength),
        fortificationStrength: Math.round(projection.fortificationStrength),
        controlRating: projection.controlRating,
        extractionModifier: Number(projection.extractionModifier.toFixed(2)),
      },
      projection: {
        nextExtraction: projection.nextExtraction,
      },
      resourceVault: state.resourceVault,
      units: Object.entries(OCCUPATION_UNIT_CATALOG).map(([key, definition]) => ({
        key,
        label: definition.label,
        assigned: state.garrison[key] || 0,
        reserve: state.reserveUnits[key] || 0,
        weight: definition.weight,
        control: definition.control,
      })),
      fortifications: Object.entries(OCCUPATION_FORTIFICATIONS).map(([key, definition]) => {
        const level = state.fortifications[key] || 0;
        return {
          key,
          label: definition.label,
          level,
          controlBonus: definition.controlBonus,
          extractionBonus: definition.extractionBonus,
          durability: definition.durability,
          nextCost: getUpgradeCost(definition.baseCost, level),
        };
      }),
      actionLog: state.actionLog,
    },
  };
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

  app.get("/api/planets/:id/occupation", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before occupation management is available" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      res.json(buildOccupationPayload(planetId, planet, state));
    } catch (error) {
      console.error("Error loading planetary occupation:", error);
      res.status(500).json({ error: "Failed to load planetary occupation state" });
    }
  });

  app.post("/api/planets/:id/occupation/garrison", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];
      const unitKey = String(req.body?.unitKey || "");
      const rawAmount = Number(req.body?.amount || 0);
      const amount = Number.isFinite(rawAmount) ? Math.trunc(rawAmount) : 0;

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before assigning occupation forces" });
      }

      const definition = OCCUPATION_UNIT_CATALOG[unitKey];
      if (!definition) {
        return res.status(400).json({ error: "Invalid occupation unit" });
      }

      if (amount === 0) {
        return res.status(400).json({ error: "A non-zero troop transfer amount is required" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      const assigned = state.garrison[unitKey] || 0;
      const reserve = state.reserveUnits[unitKey] || 0;

      if (amount > 0 && reserve < amount) {
        return res.status(400).json({ error: "Not enough reserve units available for deployment" });
      }

      if (amount < 0 && assigned < Math.abs(amount)) {
        return res.status(400).json({ error: "Not enough garrison units are deployed to withdraw that amount" });
      }

      state.garrison[unitKey] = assigned + amount;
      state.reserveUnits[unitKey] = reserve - amount;
      state.suppression = clampValue(state.suppression + Math.sign(amount) * Math.max(1, Math.floor(Math.abs(amount) * definition.control * 0.16)));
      state.resistance = clampValue(state.resistance - Math.sign(amount) * Math.max(1, Math.floor(Math.abs(amount) * definition.control * 0.1)));

      appendOccupationLog(
        state,
        "garrison",
        `${amount > 0 ? "Deployed" : "Withdrawn"} ${Math.abs(amount)} ${definition.label.toLowerCase()} ${amount > 0 ? "into" : "from"} occupation duty.`,
      );

      res.json({
        message: `${definition.label} ${amount > 0 ? "deployed" : "withdrawn"} successfully`,
        occupation: buildOccupationPayload(planetId, planet, state),
      });
    } catch (error) {
      console.error("Error updating occupation garrison:", error);
      res.status(500).json({ error: "Failed to update occupation garrison" });
    }
  });

  app.post("/api/planets/:id/occupation/policy", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];
      const taxRate = Number(req.body?.taxRate);

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before updating occupation policy" });
      }

      if (!Number.isFinite(taxRate)) {
        return res.status(400).json({ error: "A valid tax rate is required" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      state.extractionTaxRate = clampValue(Math.trunc(taxRate), 5, 45);
      state.loyalty = clampValue(state.loyalty - (state.extractionTaxRate >= 30 ? 2 : 0));

      appendOccupationLog(state, "policy", `Occupation tax policy adjusted to ${state.extractionTaxRate}%.`);

      res.json({
        message: "Occupation policy updated",
        occupation: buildOccupationPayload(planetId, planet, state),
      });
    } catch (error) {
      console.error("Error updating occupation policy:", error);
      res.status(500).json({ error: "Failed to update occupation policy" });
    }
  });

  app.post("/api/planets/:id/occupation/suppress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before suppression actions are available" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      const projection = getOccupationProjection(state);

      if (projection.garrisonStrength < 35) {
        return res.status(400).json({ error: "Garrison strength is too low to run an effective suppression sweep" });
      }

      const sweepPower = Math.max(
        5,
        Math.floor(projection.garrisonStrength / 18) +
          (state.fortifications.bunkerNetwork || 0) * 2 +
          (state.fortifications.jammerArray || 0),
      );
      const resistanceDrop = Math.min(state.resistance, sweepPower);
      const loyaltyGain = state.resistance <= 30 ? 3 : 1;

      state.resistance = clampValue(state.resistance - resistanceDrop);
      state.suppression = clampValue(state.suppression + Math.ceil(sweepPower / 2));
      state.loyalty = clampValue(state.loyalty + loyaltyGain);
      state.lastSweepAt = Date.now();

      appendOccupationLog(state, "suppression", `Suppression sweep reduced resistance by ${resistanceDrop} and reinforced occupation control.`);

      res.json({
        message: "Suppression sweep completed",
        effect: {
          resistanceDrop,
          loyaltyGain,
          suppressionGain: Math.ceil(sweepPower / 2),
        },
        occupation: buildOccupationPayload(planetId, planet, state),
      });
    } catch (error) {
      console.error("Error running occupation suppression:", error);
      res.status(500).json({ error: "Failed to run suppression sweep" });
    }
  });

  app.post("/api/planets/:id/occupation/extract", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before extraction is available" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      const projection = getOccupationProjection(state);
      const payout = projection.nextExtraction;

      if (payout.metal + payout.crystal + payout.deuterium + payout.credits <= 0) {
        return res.status(400).json({ error: "No extraction yield is available right now" });
      }

      const resources = (playerState.resources as any) || {};
      const newResources = {
        ...resources,
        metal: (resources.metal || 0) + payout.metal,
        crystal: (resources.crystal || 0) + payout.crystal,
        deuterium: (resources.deuterium || 0) + payout.deuterium,
        credits: (resources.credits || 0) + payout.credits,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      state.resourceVault.metal = Math.max(0, state.resourceVault.metal - payout.metal);
      state.resourceVault.crystal = Math.max(0, state.resourceVault.crystal - payout.crystal);
      state.resourceVault.deuterium = Math.max(0, state.resourceVault.deuterium - payout.deuterium);
      state.resourceVault.credits = Math.max(0, state.resourceVault.credits - payout.credits);
      state.resistance = clampValue(state.resistance + Math.max(2, Math.floor(state.extractionTaxRate / 8)));
      state.loyalty = clampValue(state.loyalty - Math.max(1, Math.floor(state.extractionTaxRate / 12)));
      state.suppression = clampValue(state.suppression + 1);
      state.lastExtractionAt = Date.now();

      appendOccupationLog(
        state,
        "extraction",
        `Extraction convoy returned ${payout.metal.toLocaleString()} metal, ${payout.crystal.toLocaleString()} crystal, ${payout.deuterium.toLocaleString()} deuterium, and ${payout.credits.toLocaleString()} credits.`,
      );

      res.json({
        message: "Occupation extraction completed",
        payout,
        resources: newResources,
        occupation: buildOccupationPayload(planetId, planet, state),
      });
    } catch (error) {
      console.error("Error extracting occupation resources:", error);
      res.status(500).json({ error: "Failed to extract occupation resources" });
    }
  });

  app.post("/api/planets/:id/occupation/fortify", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const planetId = req.params.id;
      const planet = PLANET_DATABASE[planetId];
      const fortificationKey = String(req.body?.fortificationKey || "");

      if (!planet) {
        return res.status(404).json({ error: "Planet not found" });
      }

      if (!planet.colonized) {
        return res.status(400).json({ error: "Planet must be under control before fortifications can be built" });
      }

      const definition = OCCUPATION_FORTIFICATIONS[fortificationKey];
      if (!definition) {
        return res.status(400).json({ error: "Invalid fortification key" });
      }

      const userId = req.session!.userId!;
      const playerState = await db.query.playerStates.findFirst({
        where: eq(playerStates.userId, userId),
      });

      if (!playerState) {
        return res.status(404).json({ error: "Player state not found" });
      }

      const state = getOrCreateOccupationState(planetId, planet);
      const currentLevel = state.fortifications[fortificationKey] || 0;
      const nextLevel = currentLevel + 1;
      const cost = getUpgradeCost(definition.baseCost, currentLevel);
      const resources = (playerState.resources as any) || {};

      if (
        (resources.metal || 0) < cost.metal ||
        (resources.crystal || 0) < cost.crystal ||
        (resources.deuterium || 0) < cost.deuterium
      ) {
        return res.status(400).json({
          error: "Insufficient resources",
          required: cost,
          available: resources,
        });
      }

      const newResources = {
        ...resources,
        metal: (resources.metal || 0) - cost.metal,
        crystal: (resources.crystal || 0) - cost.crystal,
        deuterium: (resources.deuterium || 0) - cost.deuterium,
      };

      await db
        .update(playerStates)
        .set({
          resources: newResources,
          updatedAt: new Date(),
        })
        .where(eq(playerStates.userId, userId));

      state.fortifications[fortificationKey] = nextLevel;
      state.suppression = clampValue(state.suppression + Math.ceil(definition.controlBonus / 2));
      state.loyalty = clampValue(state.loyalty + 1);
      planet.defenses = (planet.defenses || 0) + definition.durability;

      appendOccupationLog(state, "fortification", `${definition.label} upgraded to level ${nextLevel}.`);

      res.json({
        message: `${definition.label} upgraded to level ${nextLevel}`,
        fortificationKey,
        level: nextLevel,
        cost,
        resources: newResources,
        occupation: buildOccupationPayload(planetId, planet, state),
      });
    } catch (error) {
      console.error("Error fortifying occupied planet:", error);
      res.status(500).json({ error: "Failed to fortify occupied planet" });
    }
  });
}
