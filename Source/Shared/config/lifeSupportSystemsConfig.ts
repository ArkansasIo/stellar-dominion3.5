export type PopulationClass = 'workers' | 'scientists' | 'engineers' | 'military' | 'administrators' | 'civilians';
export type ResourcePressureState = 'surplus' | 'stable' | 'strained' | 'critical';

export interface FrameSystemTier {
  tier: number;
  name: string;
  populationCapacityBonus: number;
  foodEfficiencyBonus: number;
  waterEfficiencyBonus: number;
  stabilityBonus: number;
}

export const FRAME_SYSTEMS = {
  categories: {
    habitat: {
      name: 'Habitat Frames',
      description: 'Population housing and life-support frames',
      subCategories: ['residential-frame', 'arcology-frame', 'orbital-habitat-frame'],
    },
    industrial: {
      name: 'Industrial Frames',
      description: 'Manufacturing and utility structural frames',
      subCategories: ['factory-frame', 'refinery-frame', 'power-frame'],
    },
    defense: {
      name: 'Defense Frames',
      description: 'Fortification and military support frames',
      subCategories: ['bastion-frame', 'shield-frame', 'command-frame'],
    },
  },
  tiers: [
    { tier: 1, name: 'Baseline Frame', populationCapacityBonus: 0, foodEfficiencyBonus: 0, waterEfficiencyBonus: 0, stabilityBonus: 0 },
    { tier: 2, name: 'Reinforced Frame', populationCapacityBonus: 0.08, foodEfficiencyBonus: 0.03, waterEfficiencyBonus: 0.03, stabilityBonus: 0.02 },
    { tier: 3, name: 'Adaptive Frame', populationCapacityBonus: 0.18, foodEfficiencyBonus: 0.07, waterEfficiencyBonus: 0.07, stabilityBonus: 0.05 },
    { tier: 4, name: 'Smart Frame', populationCapacityBonus: 0.32, foodEfficiencyBonus: 0.12, waterEfficiencyBonus: 0.12, stabilityBonus: 0.09 },
    { tier: 5, name: 'Quantum Frame', populationCapacityBonus: 0.5, foodEfficiencyBonus: 0.18, waterEfficiencyBonus: 0.18, stabilityBonus: 0.14 },
  ] as FrameSystemTier[],
} as const;

export const POPULATION_SYSTEM = {
  base: {
    growthRatePerHour: 0.004,
    baseCapacity: 10000,
    overcrowdingPenaltyStart: 0.9,
    unrestThreshold: 0.45,
    idealStability: 0.7,
  },
  classes: {
    workers: { name: 'Workers', productivityWeight: 1.0, foodNeed: 1.0, waterNeed: 1.0, housingNeed: 1.0 },
    scientists: { name: 'Scientists', productivityWeight: 1.35, foodNeed: 1.1, waterNeed: 1.1, housingNeed: 1.2 },
    engineers: { name: 'Engineers', productivityWeight: 1.25, foodNeed: 1.1, waterNeed: 1.05, housingNeed: 1.15 },
    military: { name: 'Military', productivityWeight: 1.15, foodNeed: 1.2, waterNeed: 1.15, housingNeed: 1.1 },
    administrators: { name: 'Administrators', productivityWeight: 1.2, foodNeed: 1.05, waterNeed: 1.05, housingNeed: 1.2 },
    civilians: { name: 'Civilians', productivityWeight: 0.8, foodNeed: 0.95, waterNeed: 0.95, housingNeed: 0.9 },
  },
  happinessModifiers: {
    housingAdequacy: 0.3,
    foodSecurity: 0.25,
    waterSecurity: 0.25,
    safety: 0.2,
  },
} as const;

export const FOOD_SYSTEM = {
  production: {
    basePerWorkerPerHour: 1.8,
    hydroponicsMultiplier: 1.25,
    agriDroneMultiplier: 1.15,
    planetFertilityBonusCap: 0.5,
  },
  consumption: {
    basePerPopulationPerHour: 1,
    militaryMultiplier: 1.2,
    rationingModes: {
      generous: { modifier: 1.1, happinessDelta: 0.05 },
      normal: { modifier: 1.0, happinessDelta: 0 },
      strict: { modifier: 0.85, happinessDelta: -0.05 },
      emergency: { modifier: 0.7, happinessDelta: -0.12 },
    },
  },
  storage: {
    baseCapacity: 5000,
    spoilagePerHour: 0.002,
    coldStorageReduction: 0.75,
  },
} as const;

export const WATER_SYSTEM = {
  production: {
    basePerWorkerPerHour: 2.2,
    recyclerMultiplier: 1.3,
    purificationMultiplier: 1.2,
    atmosphericCollectorBonusCap: 0.45,
  },
  consumption: {
    basePerPopulationPerHour: 1,
    industrialUsagePerWorkerPerHour: 0.15,
    emergencyConservationFactor: 0.75,
  },
  storage: {
    baseCapacity: 6000,
    leakagePerHour: 0.001,
    reservoirReduction: 0.8,
  },
} as const;

export function computeResourcePressure(productionPerHour: number, consumptionPerHour: number): ResourcePressureState {
  if (productionPerHour >= consumptionPerHour * 1.15) return 'surplus';
  if (productionPerHour >= consumptionPerHour * 0.98) return 'stable';
  if (productionPerHour >= consumptionPerHour * 0.85) return 'strained';
  return 'critical';
}

export function estimatePopulationGrowth(
  currentPopulation: number,
  capacity: number,
  happiness: number,
  frameTier = 1,
): number {
  if (currentPopulation <= 0 || capacity <= 0) return 0;

  const tierConfig = FRAME_SYSTEMS.tiers.find(tier => tier.tier === frameTier) ?? FRAME_SYSTEMS.tiers[0];
  const utilization = currentPopulation / capacity;
  const overcrowdingPenalty = utilization > POPULATION_SYSTEM.base.overcrowdingPenaltyStart
    ? Math.max(0, 1 - (utilization - POPULATION_SYSTEM.base.overcrowdingPenaltyStart) * 2)
    : 1;

  const happinessFactor = Math.max(0.4, 0.7 + happiness * 0.6);
  const frameFactor = 1 + tierConfig.populationCapacityBonus * 0.35;
  const growthRate = POPULATION_SYSTEM.base.growthRatePerHour * overcrowdingPenalty * happinessFactor * frameFactor;

  return Math.floor(currentPopulation * growthRate);
}

export function estimateFoodDemand(populationByClass: Partial<Record<PopulationClass, number>>): number {
  return Object.entries(populationByClass).reduce((sum, [populationClass, count]) => {
    if (!count || count <= 0) return sum;

    const classConfig = POPULATION_SYSTEM.classes[populationClass as PopulationClass];
    return sum + count * classConfig.foodNeed * FOOD_SYSTEM.consumption.basePerPopulationPerHour;
  }, 0);
}

export function estimateWaterDemand(populationByClass: Partial<Record<PopulationClass, number>>, workerCount: number): number {
  const domesticDemand = Object.entries(populationByClass).reduce((sum, [populationClass, count]) => {
    if (!count || count <= 0) return sum;

    const classConfig = POPULATION_SYSTEM.classes[populationClass as PopulationClass];
    return sum + count * classConfig.waterNeed * WATER_SYSTEM.consumption.basePerPopulationPerHour;
  }, 0);

  const industrialDemand = Math.max(0, workerCount) * WATER_SYSTEM.consumption.industrialUsagePerWorkerPerHour;
  return domesticDemand + industrialDemand;
}
