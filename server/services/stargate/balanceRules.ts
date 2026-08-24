export const STARGATE_BALANCE_RULES = {
  market: {
    exchangeRates: { untrained: 90, lifer: 1_250, attackTurn: 3_000 },
    privateTradeExpiryHours: 24,
    mercenaryCapacityRatio: 0.25,
  },
  mothership: {
    basePurchaseCost: 50_000,
    maximumPerPlayer: 1,
    explorationDurationHours: 1,
    maxModuleLevel: 20,
    moduleBaseCosts: { capacity: 8_000, weapons: 10_000, shields: 10_000, hangars: 12_000 },
    moduleCostStep: 5_000,
    baseHull: 100,
    baseFuel: 100,
    fuelPerExploration: 25,
    explorationRiskPercent: 8,
  },
  worlds: {
    maximumPlanets: 10,
    maxDevelopmentLevel: 20,
    maxFortifications: 100_000,
    attackBonusPerLevel: 30_000,
    defenseBonusPerLevel: 25_000,
    covertBonusPerLevel: 181_000,
    baseIncomePerTurn: 8_000,
    baseUnitProductionPerDay: 100,
    developmentBaseCost: 6_000,
    developmentCostStep: 3_000,
    repairCostPerCondition: 250,
    defenseCostPerUnit: 400,
    baseProductionPerHour: { naquadah: 100, food: 250, water: 250 },
    baseCapacity: { naquadah: 25_000, food: 5_000, water: 5_000 },
    capacityPerDevelopment: { naquadah: 5_000, food: 1_000, water: 1_000 },
  },
  missions: {
    explorationCooldownHours: 1,
    salvageNaquadah: { min: 2_000, max: 8_000 },
    salvageFood: { min: 500, max: 2_000 },
    salvageWater: { min: 500, max: 2_000 },
  },
  commander: {
    maximumOfficers: 25,
    incomeShareMinimum: 0.1,
    incomeShareMaximum: 0.3,
  },
  protection: {
    attackCooldownMinutes: 30,
    covertSaturationLimit: 5,
    minimumRankRatio: 0.25,
    maximumRankRatio: 4,
  },
  events: {
    retentionDays: 90,
    reportLimitPerPlayer: 200,
  },
} as const;

export type StargateBalanceRules = typeof STARGATE_BALANCE_RULES;
