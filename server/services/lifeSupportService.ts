import { db } from "../db";
import { storage } from "../storage";
import {
  FOOD_SYSTEM,
  WATER_SYSTEM,
  POPULATION_SYSTEM,
  FRAME_SYSTEMS,
  computeResourcePressure,
  estimatePopulationGrowth,
  estimateFoodDemand,
  estimateWaterDemand,
  type PopulationClass,
  type ResourcePressureState,
} from "../../Source/Shared/config/lifeSupportSystemsConfig";

export const LIFE_SUPPORT_CONFIG = {
  baseFoodConsumptionPerPop: FOOD_SYSTEM.consumption.basePerPopulationPerHour,
  baseWaterConsumptionPerPop: WATER_SYSTEM.consumption.basePerPopulationPerHour,
  baseOxygenPerSupportLevel: 0.02,
  maxOxygenLevel: 100,
  minOxygenForGrowth: 40,
  happinessDecayRate: 0.001,
  starvationHappinessPenalty: -0.05,
  dehydrationHappinessPenalty: -0.05,
  suffocationHappinessPenalty: -0.1,
  tickIntervalMinutes: 10,
  workerAssignmentSlots: {
    food: 50,
    water: 50,
    oxygen: 30,
    maintenance: 20,
  } as const,
};

interface LifeSupportSubsystemAssignment {
  workers: number;
  efficiency: number;
  status: "operational" | "degraded" | "offline";
}

interface LifeSupportStatus {
  userId: string;
  food: { production: number; consumption: number; pressure: ResourcePressureState; storage: number; storageCapacity: number };
  water: { production: number; consumption: number; pressure: ResourcePressureState; storage: number; storageCapacity: number };
  oxygen: { level: number; supportLevel: number; isSufficient: boolean };
  population: { total: number; happiness: number; growthRate: number; capacity: number };
  subsystems: Record<string, LifeSupportSubsystemAssignment>;
  lastTickAt: Date;
}

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPopulationByClass(buildings: any): Partial<Record<PopulationClass, number>> {
  if (!buildings || typeof buildings !== "object") {
    return { workers: 100, civilians: 50 };
  }
  return {
    workers: toNumber(buildings.workerCount, 100),
    scientists: toNumber(buildings.scientistCount, 10),
    engineers: toNumber(buildings.engineerCount, 10),
    military: toNumber(buildings.militaryCount, 20),
    administrators: toNumber(buildings.administratorCount, 5),
    civilians: toNumber(buildings.civilianCount, 50),
  };
}

function getWorkerCount(popByClass: Partial<Record<PopulationClass, number>>): number {
  return toNumber(popByClass.workers) + toNumber(popByClass.engineers);
}

function getDefaultSubsystems(): Record<string, LifeSupportSubsystemAssignment> {
  return {
    food: { workers: 10, efficiency: 1.0, status: "operational" },
    water: { workers: 10, efficiency: 1.0, status: "operational" },
    oxygen: { workers: 5, efficiency: 1.0, status: "operational" },
    maintenance: { workers: 5, efficiency: 1.0, status: "operational" },
  };
}

function parseSubsystems(raw: any): Record<string, LifeSupportSubsystemAssignment> {
  if (!raw || typeof raw !== "object") return getDefaultSubsystems();
  const result: Record<string, LifeSupportSubsystemAssignment> = {};
  for (const [key, val] of Object.entries(raw)) {
    const v = val as any;
    result[key] = {
      workers: toNumber(v?.workers, 0),
      efficiency: Math.max(0, Math.min(1, toNumber(v?.efficiency, 1))),
      status: v?.status === "operational" || v?.status === "degraded" || v?.status === "offline" ? v.status : "operational",
    };
  }
  return result;
}

export class LifeSupportService {
  static async getLifeSupportStatus(userId: string): Promise<LifeSupportStatus> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const buildings = (playerState.buildings as any) || {};
    const popByClass = getPopulationByClass(buildings);
    const totalPop = Object.values(popByClass).reduce((s, v) => s + toNumber(v), 0);
    const workerCount = getWorkerCount(popByClass);
    const capacity = toNumber(buildings.populationCapacity, POPULATION_SYSTEM.base.baseCapacity);

    const foodProduction = FOOD_SYSTEM.production.basePerWorkerPerHour * workerCount;
    const foodConsumption = estimateFoodDemand(popByClass);
    const foodStorage = toNumber(buildings.foodStorage, 0);
    const foodCapacity = FOOD_SYSTEM.storage.baseCapacity;

    const waterProduction = WATER_SYSTEM.production.basePerWorkerPerHour * workerCount;
    const waterConsumption = estimateWaterDemand(popByClass, workerCount);
    const waterStorage = toNumber(buildings.waterStorage, 0);
    const waterCapacity = WATER_SYSTEM.storage.baseCapacity;

    const supportLevel = toNumber(buildings.lifeSupportLevel, 1);
    const oxygenLevel = LifeSupportService.calculateOxygenLevel(supportLevel);

    const happiness = LifeSupportService.calculateHappiness(
      totalPop, capacity, foodProduction, foodConsumption,
      waterProduction, waterConsumption, oxygenLevel
    );
    const growthRate = estimatePopulationGrowth(totalPop, capacity, happiness, 1);

    const subsystems = parseSubsystems(buildings.lifeSupportSubsystems);

    return {
      userId,
      food: {
        production: Math.round(foodProduction * 100) / 100,
        consumption: Math.round(foodConsumption * 100) / 100,
        pressure: computeResourcePressure(foodProduction, foodConsumption),
        storage: foodStorage,
        storageCapacity: foodCapacity,
      },
      water: {
        production: Math.round(waterProduction * 100) / 100,
        consumption: Math.round(waterConsumption * 100) / 100,
        pressure: computeResourcePressure(waterProduction, waterConsumption),
        storage: waterStorage,
        storageCapacity: waterCapacity,
      },
      oxygen: {
        level: Math.round(oxygenLevel * 100) / 100,
        supportLevel,
        isSufficient: oxygenLevel >= LIFE_SUPPORT_CONFIG.minOxygenForGrowth,
      },
      population: {
        total: totalPop,
        happiness: Math.round(happiness * 1000) / 1000,
        growthRate,
        capacity,
      },
      subsystems,
      lastTickAt: playerState.lastResourceUpdate || new Date(),
    };
  }

  static async assignLifeSupport(
    userId: string,
    subsystem: string,
    assignment: { workers: number; efficiency?: number }
  ): Promise<{ success: boolean; subsystems: Record<string, LifeSupportSubsystemAssignment> }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const buildings = (playerState.buildings as any) || {};
    const subsystems = parseSubsystems(buildings.lifeSupportSubsystems);
    const maxSlots = (LIFE_SUPPORT_CONFIG.workerAssignmentSlots as any)[subsystem] ?? 50;

    const workers = Math.max(0, Math.min(maxSlots, Math.floor(assignment.workers)));
    const efficiency = assignment.efficiency !== undefined
      ? Math.max(0, Math.min(1, assignment.efficiency))
      : subsystems[subsystem]?.efficiency ?? 1.0;

    const status: "operational" | "degraded" | "offline" = workers === 0 ? "offline" : workers < maxSlots * 0.3 ? "degraded" : "operational";

    subsystems[subsystem] = { workers, efficiency, status };

    await storage.updatePlayerState(userId, {
      buildings: { ...buildings, lifeSupportSubsystems: subsystems },
    } as any);

    return { success: true, subsystems };
  }

  static calculateFoodDemand(population: number, buildings: any): number {
    const popByClass = getPopulationByClass(buildings);
    const scaledPop: Partial<Record<PopulationClass, number>> = {};
    const totalFromClasses = Object.values(popByClass).reduce((s, v) => s + toNumber(v), 0);
    const scale = totalFromClasses > 0 ? population / totalFromClasses : 1;

    for (const [cls, count] of Object.entries(popByClass)) {
      scaledPop[cls as PopulationClass] = Math.round(toNumber(count) * scale);
    }

    return estimateFoodDemand(scaledPop);
  }

  static calculateWaterDemand(population: number, buildings: any): number {
    const popByClass = getPopulationByClass(buildings);
    const workerCount = getWorkerCount(popByClass);
    const totalFromClasses = Object.values(popByClass).reduce((s, v) => s + toNumber(v), 0);
    const scale = totalFromClasses > 0 ? population / totalFromClasses : 1;

    const scaledPop: Partial<Record<PopulationClass, number>> = {};
    for (const [cls, count] of Object.entries(popByClass)) {
      scaledPop[cls as PopulationClass] = Math.round(toNumber(count) * scale);
    }

    return estimateWaterDemand(scaledPop, Math.round(workerCount * scale));
  }

  static calculateOxygenLevel(supportLevel: number): number {
    const base = Math.min(
      LIFE_SUPPORT_CONFIG.maxOxygenLevel,
      supportLevel * LIFE_SUPPORT_CONFIG.baseOxygenPerSupportLevel * 100
    );
    return Math.max(0, Math.min(LIFE_SUPPORT_CONFIG.maxOxygenLevel, base));
  }

  static async getPopulationStats(userId: string): Promise<{
    happiness: number;
    growthRate: number;
    totalPopulation: number;
    capacity: number;
    happinessFactors: Record<string, number>;
    growthFactors: Record<string, number>;
  }> {
    const status = await LifeSupportService.getLifeSupportStatus(userId);
    const buildings = ((await storage.getPlayerState(userId))?.buildings as any) || {};
    const capacity = status.population.capacity;
    const totalPop = status.population.total;
    const utilization = capacity > 0 ? totalPop / capacity : 1;

    const housingAdequacy = Math.max(0, 1 - utilization);
    const foodAdequacy = status.food.pressure === "surplus" ? 1 : status.food.pressure === "stable" ? 0.9 : status.food.pressure === "strained" ? 0.6 : 0.2;
    const waterAdequacy = status.water.pressure === "surplus" ? 1 : status.water.pressure === "stable" ? 0.9 : status.water.pressure === "strained" ? 0.6 : 0.2;
    const safetyFactor = status.oxygen.isSufficient ? 1 : 0.3;

    const happiness =
      housingAdequacy * POPULATION_SYSTEM.happinessModifiers.housingAdequacy +
      foodAdequacy * POPULATION_SYSTEM.happinessModifiers.foodSecurity +
      waterAdequacy * POPULATION_SYSTEM.happinessModifiers.waterSecurity +
      safetyFactor * POPULATION_SYSTEM.happinessModifiers.safety;

    const overcrowdingPenalty = utilization > POPULATION_SYSTEM.base.overcrowdingPenaltyStart ? -0.2 : 0;
    const finalHappiness = Math.max(0, Math.min(1, happiness + overcrowdingPenalty));

    return {
      happiness: Math.round(finalHappiness * 1000) / 1000,
      growthRate: status.population.growthRate,
      totalPopulation: totalPop,
      capacity,
      happinessFactors: {
        housingAdequacy: Math.round(housingAdequacy * 100) / 100,
        foodAdequacy: Math.round(foodAdequacy * 100) / 100,
        waterAdequacy: Math.round(waterAdequacy * 100) / 100,
        safety: Math.round(safetyFactor * 100) / 100,
        overcrowding: Math.round(overcrowdingPenalty * 100) / 100,
      },
      growthFactors: {
        baseGrowthRate: POPULATION_SYSTEM.base.growthRatePerHour,
        happinessModifier: Math.max(0.4, 0.7 + finalHappiness * 0.6),
        capacityUtilization: Math.round(utilization * 100) / 100,
      },
    };
  }

  static async processLifeSupportTick(userId: string): Promise<{
    foodDelta: number;
    waterDelta: number;
    oxygenDelta: number;
    populationDelta: number;
    happinessDelta: number;
    events: string[];
  }> {
    const playerState = await storage.getPlayerState(userId);
    if (!playerState) throw new Error("Player state not found");

    const status = await LifeSupportService.getLifeSupportStatus(userId);
    const buildings = (playerState.buildings as any) || {};
    const events: string[] = [];

    const foodDelta = Math.round((status.food.production - status.food.consumption) * 100) / 100;
    const waterDelta = Math.round((status.water.production - status.water.consumption) * 100) / 100;
    const oxygenDelta = status.oxygen.isSufficient ? 0 : -0.5;

    let newFoodStorage = Math.max(0, toNumber(buildings.foodStorage) + foodDelta);
    let newWaterStorage = Math.max(0, toNumber(buildings.waterStorage) + waterDelta);

    if (newFoodStorage <= 0 && foodDelta < 0) {
      events.push("FOOD_STORAGE_DEPLETED");
    }
    if (newWaterStorage <= 0 && waterDelta < 0) {
      events.push("WATER_STORAGE_DEPLETED");
    }

    newFoodStorage = Math.min(newFoodStorage, FOOD_SYSTEM.storage.baseCapacity);
    newWaterStorage = Math.min(newWaterStorage, WATER_SYSTEM.storage.baseCapacity);

    const popStats = await LifeSupportService.getPopulationStats(userId);
    const populationDelta = popStats.growthRate;
    const currentPop = status.population.total;
    const newPop = Math.max(1, currentPop + populationDelta);

    let happinessDelta = 0;
    if (foodDelta < 0) happinessDelta += LIFE_SUPPORT_CONFIG.starvationHappinessPenalty;
    if (waterDelta < 0) happinessDelta += LIFE_SUPPORT_CONFIG.dehydrationHappinessPenalty;
    if (!status.oxygen.isSufficient) happinessDelta += LIFE_SUPPORT_CONFIG.suffocationHappinessPenalty;

    if (status.food.pressure === "surplus") events.push("FOOD_SURPLUS");
    if (status.water.pressure === "surplus") events.push("WATER_SURPLUS");
    if (status.food.pressure === "critical") events.push("FOOD_CRITICAL");
    if (status.water.pressure === "critical") events.push("WATER_CRITICAL");
    if (!status.oxygen.isSufficient) events.push("OXYGEN_LOW");
    if (populationDelta > 0) events.push("POPULATION_GROWING");
    if (populationDelta < 0) events.push("POPULATION_DECLINING");

    const buildingsUpdate = {
      ...buildings,
      foodStorage: Math.round(newFoodStorage),
      waterStorage: Math.round(newWaterStorage),
    };

    await storage.updatePlayerState(userId, {
      buildings: buildingsUpdate,
      lastResourceUpdate: new Date(),
    } as any);

    return {
      foodDelta,
      waterDelta,
      oxygenDelta,
      populationDelta,
      happinessDelta,
      events,
    };
  }

  private static calculateHappiness(
    totalPop: number,
    capacity: number,
    foodProd: number,
    foodCons: number,
    waterProd: number,
    waterCons: number,
    oxygenLevel: number
  ): number {
    const utilization = capacity > 0 ? totalPop / capacity : 1;
    const housingAdequacy = Math.max(0, 1 - utilization);
    const foodAdequacy = foodProd >= foodCons * 1.15 ? 1 : foodProd >= foodCons * 0.98 ? 0.9 : foodProd >= foodCons * 0.85 ? 0.6 : 0.2;
    const waterAdequacy = waterProd >= waterCons * 1.15 ? 1 : waterProd >= waterCons * 0.98 ? 0.9 : waterProd >= waterCons * 0.85 ? 0.6 : 0.2;
    const safety = oxygenLevel >= LIFE_SUPPORT_CONFIG.minOxygenForGrowth ? 1 : 0.3;

    return Math.max(0, Math.min(1,
      housingAdequacy * POPULATION_SYSTEM.happinessModifiers.housingAdequacy +
      foodAdequacy * POPULATION_SYSTEM.happinessModifiers.foodSecurity +
      waterAdequacy * POPULATION_SYSTEM.happinessModifiers.waterSecurity +
      safety * POPULATION_SYSTEM.happinessModifiers.safety
    ));
  }
}

export default LifeSupportService;
