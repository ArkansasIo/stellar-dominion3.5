import { storage } from "../storage";
import {
  FOOD_SYSTEM,
  WATER_SYSTEM,
  FRAME_SYSTEMS,
  POPULATION_SYSTEM,
  DISEASE_CATALOG,
  DISEASE_CONTROL,
  computeResourcePressure,
  estimatePopulationGrowth,
  estimateFoodDemand,
  estimateWaterDemand,
  computeDiseaseTransmission,
  computeOutbreakRisk,
  computeOverallHealth,
  computeMedicalCapacity,
  type PopulationClass,
  type ResourcePressureState,
  type OutbreakState,
  type ContainmentLevel,
  type HealthState,
  type DiseaseTemplate,
  type DiseaseStatus,
} from "../../shared/config/lifeSupportSystemsConfig";

function toNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function getDefaultHealthState(): HealthState {
  return {
    overallHealth: 0.85,
    diseaseResistance: 0.1,
    outbreakRisk: 0.05,
    activeOutbreaks: [],
    quarantinedPopulation: 0,
    medicalCapacity: 200,
  };
}

export class LifeSupportService {
  static async getPopulationSnapshot(userId: string) {
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

    const populationCapacity = Math.floor(
      (baseCapacity + housingCapacityFromBuildings) * (1 + frameTierConfig.populationCapacityBonus),
    );

    const explicitPopulation = toNumber((state as any)?.population, -1);
    const currentPopulation = explicitPopulation > 0
      ? explicitPopulation
      : Math.floor(populationCapacity * 0.58);

    const populationByClass = buildPopulationDistribution(currentPopulation);
    const workerCount = populationByClass.workers;

    const foodStock = toNumber(resources.food, 0);
    const waterStock = toNumber(resources.water, 0);

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

    const estimatedGrowthPerHour = estimatePopulationGrowth(currentPopulation, populationCapacity, happiness, frameTier);

    const foodNetPerHour = foodProductionPerHour - foodDemandPerHour;
    const waterNetPerHour = waterProductionPerHour - waterDemandPerHour;

    const foodHoursToDepletion = foodNetPerHour < 0 ? Math.floor(foodStock / Math.abs(foodNetPerHour || 1)) : null;
    const waterHoursToDepletion = waterNetPerHour < 0 ? Math.floor(waterStock / Math.abs(waterNetPerHour || 1)) : null;

    const medicalCapacity = computeMedicalCapacity(buildings);
    const healthState = LifeSupportService.getHealthState(userId, currentPopulation, medicalCapacity, foodPressure, waterPressure);

    return {
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
      health: {
        overallHealth: Number(healthState.overallHealth.toFixed(3)),
        diseaseResistance: Number(healthState.diseaseResistance.toFixed(3)),
        outbreakRisk: Number(healthState.outbreakRisk.toFixed(3)),
        activeOutbreaks: healthState.activeOutbreaks,
        quarantinedPopulation: healthState.quarantinedPopulation,
        medicalCapacity: healthState.medicalCapacity,
      },
    };
  }

  static getHealthState(
    userId: string,
    currentPopulation: number,
    medicalCapacity: number,
    foodPressure: ResourcePressureState,
    waterPressure: ResourcePressureState,
  ): HealthState {
    const existing = LifeSupportService.playerHealth.get(userId);
    const activeOutbreaks = existing?.activeOutbreaks ?? [];
    const diseaseResistance = existing?.diseaseResistance ?? DISEASE_CONTROL.baseResistancePerPopulation * currentPopulation;

    const overcrowding = 0;

    const outbreakRisk = computeOutbreakRisk(
      {
        overallHealth: existing?.overallHealth ?? 0.85,
        diseaseResistance,
        outbreakRisk: 0,
        activeOutbreaks,
        quarantinedPopulation: existing?.quarantinedPopulation ?? 0,
        medicalCapacity,
      },
      overcrowding,
      foodPressure,
      waterPressure,
    );

    const overallHealth = computeOverallHealth(
      foodPressure,
      waterPressure,
      diseaseResistance,
      activeOutbreaks.length,
      medicalCapacity,
      currentPopulation,
    );

    return {
      overallHealth,
      diseaseResistance,
      outbreakRisk,
      activeOutbreaks,
      quarantinedPopulation: existing?.quarantinedPopulation ?? 0,
      medicalCapacity,
    };
  }

  private static playerHealth = new Map<string, HealthState>();
  private static outbreakTimers = new Map<string, number>();
  private static rationingModes = new Map<string, string>();

  static initializePlayer(userId: string): void {
    if (!this.playerHealth.has(userId)) {
      this.playerHealth.set(userId, getDefaultHealthState());
    }
    if (!this.rationingModes.has(userId)) {
      this.rationingModes.set(userId, 'normal');
    }
  }

  static getRationingMode(userId: string): string {
    return this.rationingModes.get(userId) ?? 'normal';
  }

  static setRationingMode(userId: string, mode: string): boolean {
    const validModes = Object.keys(FOOD_SYSTEM.consumption.rationingModes);
    if (!validModes.includes(mode)) return false;
    this.rationingModes.set(userId, mode);
    return true;
  }

  static setContainmentLevel(userId: string, diseaseId: string, level: ContainmentLevel): boolean {
    const health = this.playerHealth.get(userId);
    if (!health) return false;

    const outbreak = health.activeOutbreaks.find((o) => o.diseaseId === diseaseId);
    if (!outbreak) return false;

    outbreak.containmentLevel = level;
    return true;
  }

  static processTurn(userId: string): void {
    this.initializePlayer(userId);
    const health = this.playerHealth.get(userId)!;

    const now = Date.now();
    const lastProcessed = this.outbreakTimers.get(userId) ?? 0;
    if (now - lastProcessed < 15000) return;
    this.outbreakTimers.set(userId, now);

    const shouldEmerge = Math.random() < health.outbreakRisk * 0.1;
    if (shouldEmerge && health.activeOutbreaks.length < 3) {
      const available = DISEASE_CATALOG.filter(
        (d) => !health.activeOutbreaks.some((o) => o.diseaseId === d.id),
      );
      if (available.length > 0) {
        const disease = available[Math.floor(Math.random() * available.length)];
        health.activeOutbreaks.push({
          diseaseId: disease.id,
          status: 'emerging',
          infectedCount: Math.floor(Math.random() * 50) + 10,
          totalCases: 0,
          fatalities: 0,
          turnsActive: 0,
          containmentLevel: 'none',
          discoveredAt: now,
        });
      }
    }

    for (let i = health.activeOutbreaks.length - 1; i >= 0; i--) {
      const outbreak = health.activeOutbreaks[i];
      const disease = DISEASE_CATALOG.find((d) => d.id === outbreak.diseaseId);
      if (!disease) continue;

      outbreak.turnsActive++;

      if (outbreak.status === 'emerging' && outbreak.turnsActive >= disease.incubationTurns) {
        outbreak.status = 'outbreak';
      }

      if (outbreak.status === 'outbreak' || outbreak.status === 'emerging') {
        const transmission = computeDiseaseTransmission(
          disease,
          outbreak.containmentLevel,
          health.diseaseResistance,
          0,
        );
        const newInfections = Math.floor(transmission * (outbreak.infectedCount || 1) * 2);
        outbreak.infectedCount += newInfections;
        outbreak.totalCases += newInfections;

        if (disease.mortalityRate > 0 && outbreak.infectedCount > 0) {
          const fatalities = Math.floor(outbreak.infectedCount * disease.mortalityRate * 0.1);
          outbreak.fatalities += fatalities;
          outbreak.infectedCount = Math.max(0, outbreak.infectedCount - fatalities);
        }
      }

      if (outbreak.containmentLevel !== 'none') {
        const recoveryChance = DISEASE_CONTROL.naturalRecoveryRate *
          DISEASE_CONTROL.containmentMeasures[outbreak.containmentLevel].transmissionMultiplier;
        if (Math.random() < recoveryChance) {
          const recovered = Math.floor(outbreak.infectedCount * recoveryChance);
          outbreak.infectedCount = Math.max(0, outbreak.infectedCount - recovered);
        }
      }

      if (outbreak.infectedCount <= 0 && outbreak.turnsActive > disease.durationTurns) {
        outbreak.status = 'eradicated';
        health.diseaseResistance += 0.02;
      }

      if (outbreak.status === 'outbreak' && outbreak.containmentLevel !== 'none' &&
          outbreak.turnsActive > disease.durationTurns * 0.7 && outbreak.infectedCount < 10) {
        outbreak.status = 'contained';
      }
    }

    health.activeOutbreaks = health.activeOutbreaks.filter(
      (o) => o.status !== 'eradicated',
    );
  }

  static getHealthStateForUser(userId: string): HealthState | undefined {
    return this.playerHealth.get(userId);
  }

  static getOutbreakRiskForUser(userId: string): number {
    const health = this.playerHealth.get(userId);
    return health?.outbreakRisk ?? 0.05;
  }
}

export default LifeSupportService;
