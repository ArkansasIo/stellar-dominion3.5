import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import {
  BUILDING_ARCHETYPES_90,
  FACTORY_JOB_ARCHETYPES_90,
  BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
  FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
  BUILDING_FACTORY_JOB_META,
  ENTITY_ARCHETYPES_90,
  ENTITY_ARCHETYPES_META,
  CIVILIZATION_MILITARY_JOB_ARCHETYPES_90,
  CIVILIZATION_MILITARY_JOB_META,
  getJobArchetypesByDomain,
  estimateFoodWaterForJobAssignments,
  estimateProductivityForAssignments,
  FRAME_SYSTEMS,
  POPULATION_SYSTEM,
  FOOD_SYSTEM,
  WATER_SYSTEM,
  computeResourcePressure,
  estimatePopulationGrowth,
  estimateFoodDemand,
  estimateWaterDemand,
  type PopulationClass,
} from "../shared/config";

function toNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function getFrameTier(buildings: Record<string, number>): number {
  const robotics = toNumber(buildings.roboticsFactory, 0);
  const shipyard = toNumber(buildings.shipyard, 0);
  const researchLab = toNumber(buildings.researchLab, 0);
  const inferred = 1 + Math.floor((robotics + shipyard + researchLab) / 12);
  return clamp(inferred, 1, FRAME_SYSTEMS.tiers.length);
}

function buildPopulationDistribution(totalPopulation: number): Record<PopulationClass, number> {
  return {
    workers: Math.floor(totalPopulation * 0.42),
    scientists: Math.floor(totalPopulation * 0.12),
    engineers: Math.floor(totalPopulation * 0.14),
    military: Math.floor(totalPopulation * 0.16),
    administrators: Math.floor(totalPopulation * 0.08),
    civilians: Math.max(0, totalPopulation - (
      Math.floor(totalPopulation * 0.42) +
      Math.floor(totalPopulation * 0.12) +
      Math.floor(totalPopulation * 0.14) +
      Math.floor(totalPopulation * 0.16) +
      Math.floor(totalPopulation * 0.08)
    )),
  };
}

export function registerLifeSupportRoutes(app: Express) {
  app.get("/api/config/building-archetypes", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: BUILDING_ARCHETYPES_90.length,
      items: BUILDING_ARCHETYPES_90,
    });
  });

  app.get("/api/config/building-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      meta: BUILDING_FACTORY_JOB_META.buildings,
      groupedByCategory: BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
    });
  });

  app.get("/api/config/factory-job-archetypes", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: FACTORY_JOB_ARCHETYPES_90.length,
      items: FACTORY_JOB_ARCHETYPES_90,
    });
  });

  app.get("/api/config/factory-job-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      meta: BUILDING_FACTORY_JOB_META.factoryJobs,
      groupedByJobCategory: FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
    });
  });

  app.get("/api/config/entity-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: ENTITY_ARCHETYPES_90.length,
      meta: ENTITY_ARCHETYPES_META,
    });
  });

  app.get("/api/config/civilization-jobs", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.length,
      items: CIVILIZATION_MILITARY_JOB_ARCHETYPES_90,
    });
  });

  app.get("/api/config/civilization-jobs/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      meta: CIVILIZATION_MILITARY_JOB_META,
    });
  });

  app.get("/api/config/civilization-jobs/domain/:domain", (req: Request, res: Response) => {
    const domain = String(req.params.domain || "").toLowerCase();
    if (domain !== "civilization" && domain !== "military") {
      return res.status(400).json({ success: false, message: "Invalid domain" });
    }

    res.json({
      success: true,
      domain,
      total: getJobArchetypesByDomain(domain).length,
      items: getJobArchetypesByDomain(domain),
    });
  });

  app.post("/api/config/civilization-jobs/projection", (req: Request, res: Response) => {
    const assignments = Array.isArray(req.body?.assignments) ? req.body.assignments : [];
    const normalizedAssignments = assignments
      .map((entry: any) => ({
        jobId: String(entry?.jobId || "").trim(),
        count: Math.max(0, toNumber(entry?.count, 0)),
      }))
      .filter((entry: { jobId: string; count: number }) => entry.jobId.length > 0 && entry.count > 0);

    const resourceDemand = estimateFoodWaterForJobAssignments(normalizedAssignments);
    const projectedProductivity = estimateProductivityForAssignments(normalizedAssignments);

    res.json({
      success: true,
      assignments: normalizedAssignments,
      projection: {
        workforce: resourceDemand.workforce,
        projectedProductivity,
        foodDemandPerHour: resourceDemand.foodDemandPerHour,
        waterDemandPerHour: resourceDemand.waterDemandPerHour,
      },
    });
  });

  app.get("/api/config/frame-systems", (_req: Request, res: Response) => {
    res.json({ success: true, frameSystems: FRAME_SYSTEMS });
  });

  app.get("/api/config/population-system", (_req: Request, res: Response) => {
    res.json({ success: true, populationSystem: POPULATION_SYSTEM });
  });

  app.get("/api/config/food-system", (_req: Request, res: Response) => {
    res.json({ success: true, foodSystem: FOOD_SYSTEM });
  });

  app.get("/api/config/water-system", (_req: Request, res: Response) => {
    res.json({ success: true, waterSystem: WATER_SYSTEM });
  });

  app.get("/api/config/life-support-systems", (_req: Request, res: Response) => {
    res.json({
      success: true,
      systems: {
        frame: FRAME_SYSTEMS,
        population: POPULATION_SYSTEM,
        food: FOOD_SYSTEM,
        water: WATER_SYSTEM,
      },
    });
  });

  app.get("/api/population/snapshot", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      const resources = ((state?.resources || {}) as Record<string, number>);
      const buildings = ((state?.buildings || {}) as Record<string, number>);

      const frameTier = getFrameTier(buildings);
      const frameTierConfig = FRAME_SYSTEMS.tiers.find((tier) => tier.tier === frameTier) ?? FRAME_SYSTEMS.tiers[0];

      const baseCapacity = POPULATION_SYSTEM.base.baseCapacity;
      const housingCapacityFromBuildings =
        toNumber(buildings.roboticsFactory, 0) * 250 +
        toNumber(buildings.shipyard, 0) * 180 +
        toNumber(buildings.researchLab, 0) * 120;

      const populationCapacity = Math.floor((baseCapacity + housingCapacityFromBuildings) * (1 + frameTierConfig.populationCapacityBonus));

      const explicitPopulation = toNumber((state as any)?.population, -1);
      const currentPopulation = explicitPopulation > 0
        ? explicitPopulation
        : Math.floor(populationCapacity * 0.58);

      const populationByClass = buildPopulationDistribution(currentPopulation);

      const inferredJobAssignments = [
        { jobId: "civilization-administration-cadet-1", count: populationByClass.administrators },
        { jobId: "civilization-infrastructure-operator-12", count: Math.floor(populationByClass.workers * 0.4) },
        { jobId: "civilization-research-specialist-23", count: populationByClass.scientists },
        { jobId: "civilization-manufacturing-specialist-33", count: Math.floor(populationByClass.workers * 0.6) },
        { jobId: "military-ground-operations-specialist-63", count: populationByClass.military },
      ];

      const jobDemand = estimateFoodWaterForJobAssignments(inferredJobAssignments);
      const jobProductivity = estimateProductivityForAssignments(inferredJobAssignments);

      const foodStock = toNumber(resources.food, 0);
      const waterStock = toNumber(resources.water, 0);

      const workerCount = populationByClass.workers;

      const foodDemandPerHour = estimateFoodDemand(populationByClass);
      const waterDemandPerHour = estimateWaterDemand(populationByClass, workerCount);

      const foodProductionPerHour =
        workerCount * FOOD_SYSTEM.production.basePerWorkerPerHour *
        (1 + frameTierConfig.foodEfficiencyBonus + toNumber(buildings.researchLab, 0) * 0.01);

      const waterProductionPerHour =
        workerCount * WATER_SYSTEM.production.basePerWorkerPerHour *
        (1 + frameTierConfig.waterEfficiencyBonus + toNumber(buildings.deuteriumSynthesizer, 0) * 0.01);

      const foodPressure = computeResourcePressure(foodProductionPerHour, foodDemandPerHour);
      const waterPressure = computeResourcePressure(waterProductionPerHour, waterDemandPerHour);

      const happinessBase = 0.68;
      const happinessPenalty =
        (foodPressure === "critical" ? 0.18 : foodPressure === "strained" ? 0.08 : 0) +
        (waterPressure === "critical" ? 0.18 : waterPressure === "strained" ? 0.08 : 0);

      const happiness = clamp(happinessBase + frameTierConfig.stabilityBonus - happinessPenalty, 0.2, 0.98);

      const estimatedGrowthPerHour = estimatePopulationGrowth(
        currentPopulation,
        populationCapacity,
        happiness,
        frameTier,
      );

      const foodNetPerHour = foodProductionPerHour - foodDemandPerHour;
      const waterNetPerHour = waterProductionPerHour - waterDemandPerHour;

      const foodHoursToDepletion = foodNetPerHour < 0 ? Math.floor(foodStock / Math.abs(foodNetPerHour || 1)) : null;
      const waterHoursToDepletion = waterNetPerHour < 0 ? Math.floor(waterStock / Math.abs(waterNetPerHour || 1)) : null;

      res.json({
        success: true,
        snapshot: {
          frameTier,
          frame: frameTierConfig,
          population: {
            current: currentPopulation,
            capacity: populationCapacity,
            utilization: Number((currentPopulation / Math.max(1, populationCapacity)).toFixed(3)),
            happiness: Number(happiness.toFixed(3)),
            estimatedGrowthPerHour,
            classes: populationByClass,
          },
          food: {
            stock: foodStock,
            productionPerHour: Number(foodProductionPerHour.toFixed(2)),
            demandPerHour: Number(foodDemandPerHour.toFixed(2)),
            netPerHour: Number(foodNetPerHour.toFixed(2)),
            pressure: foodPressure,
            hoursToDepletion: foodHoursToDepletion,
          },
          water: {
            stock: waterStock,
            productionPerHour: Number(waterProductionPerHour.toFixed(2)),
            demandPerHour: Number(waterDemandPerHour.toFixed(2)),
            netPerHour: Number(waterNetPerHour.toFixed(2)),
            pressure: waterPressure,
            hoursToDepletion: waterHoursToDepletion,
          },
          civilizationSystems: {
            jobsCatalogSize: CIVILIZATION_MILITARY_JOB_META.total,
            inferredAssignments: inferredJobAssignments,
            projectedProductivity: Number(jobProductivity.toFixed(2)),
            foodDemandFromJobsPerHour: jobDemand.foodDemandPerHour,
            waterDemandFromJobsPerHour: jobDemand.waterDemandPerHour,
          },
        },
      });
    } catch (error) {
      console.error("[population/snapshot]", error);
      res.status(500).json({ success: false, message: "Failed to build population snapshot" });
    }
  });
}
