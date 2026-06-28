export const GAME_SETTINGS = {
  intervals: {
    resourceTick: parseInt(process.env.RESOURCE_TICK_INTERVAL || '10000'),
    turnTick: parseInt(process.env.TURN_TICK_INTERVAL || '15000'),
    constructionTick: parseInt(process.env.CONSTRUCTION_TICK_INTERVAL || '5000'),
    dailyReset: parseInt(process.env.DAILY_RESET_INTERVAL || '86400000'),
    weeklyReset: parseInt(process.env.WEEKLY_RESET_INTERVAL || '604800000'),
    maintenance: parseInt(process.env.MAINTENANCE_INTERVAL || '3600000'),
    marketTick: parseInt(process.env.MARKET_TICK_INTERVAL || '900000'),
    refineryTick: parseInt(process.env.REFINERY_TICK_INTERVAL || '30000'),
    anomalyRespawn: parseInt(process.env.ANOMALY_RESPAWN_INTERVAL || '300000'),
  },

  loginBonus: {
    credits: parseInt(process.env.LOGIN_BONUS_CREDITS || '500'),
    metal: parseInt(process.env.LOGIN_BONUS_METAL || '1000'),
  },

  resourceProduction: {
    metalMultiplier: parseInt(process.env.METAL_PRODUCTION_MULTIPLIER || '30'),
    crystalMultiplier: parseInt(process.env.CRYSTAL_PRODUCTION_MULTIPLIER || '20'),
    deuteriumMultiplier: parseInt(process.env.DEUTERIUM_PRODUCTION_MULTIPLIER || '10'),
    energyMultiplier: parseInt(process.env.ENERGY_PRODUCTION_MULTIPLIER || '20'),
  },

  server: {
    port: parseInt(process.env.PORT || '5001'),
  },

  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '').split(',').filter(Boolean).length > 0
      ? (process.env.CORS_ALLOWED_ORIGINS || '').split(',').filter(Boolean)
      : [
          'http://localhost:5000',
          'http://localhost:5001',
          'http://127.0.0.1:5000',
          'http://127.0.0.1:5001',
        ],
    fallbackOrigin: process.env.CORS_FALLBACK_ORIGIN || 'http://localhost:5000',
  },

  espionage: {
    baseSuccessRate: parseFloat(process.env.ESPIONAGE_BASE_SUCCESS_RATE || '0.65'),
    costPerSpy: {
      metal: parseInt(process.env.ESPIONAGE_COST_METAL || '100'),
      crystal: parseInt(process.env.ESPIONAGE_COST_CRYSTAL || '100'),
      deuterium: parseInt(process.env.ESPIONAGE_COST_DEUTERIUM || '50'),
    },
    researchBonuses: {
      espionageTech: parseFloat(process.env.ESPIONAGE_RESEARCH_BONUS || '0.05'),
    },
    defenseMultipliers: {
      perDefenseLevel: parseFloat(process.env.ESPIONAGE_DEFENSE_MULTIPLIER || '0.01'),
    },
    intelCategories: {
      RESOURCES: 'resources',
      FLEET: 'fleet',
      BUILDINGS: 'buildings',
      MISSIONS: 'missions',
      RESEARCH: 'research',
    },
    detectionMultipliers: {
      perSpyMission: parseFloat(process.env.ESPIONAGE_DETECTION_PER_SPY || '0.1'),
      baseCatchChance: parseFloat(process.env.ESPIONAGE_BASE_CATCH_CHANCE || '0.3'),
    },
  },
};
