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
  },
  worlds: {
    maximumPlanets: 10,
    attackBonusPerLevel: 30_000,
    defenseBonusPerLevel: 25_000,
    covertBonusPerLevel: 181_000,
    baseIncomePerTurn: 8_000,
    baseUnitProductionPerDay: 100,
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
