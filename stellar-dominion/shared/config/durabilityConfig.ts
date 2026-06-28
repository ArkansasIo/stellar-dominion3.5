// Durability System - Equipment, Ships, Buildings, Resource Fields
export const DURABILITY_CONFIG = {
  // Equipment Durability
  equipment: {
    enabled: true,
    maxDurability: 100,
    degradationRates: {
      weapon: 0.8, // Per battle
      armor: 0.6,
      tool: 0.4,
      equipment: 0.5,
    },
    repairCosts: {
      weapon: { gold: 500, platinum: 10 },
      armor: { gold: 400, platinum: 8 },
      tool: { gold: 200, platinum: 4 },
      equipment: { gold: 300, platinum: 6 },
    },
    repairTime: 60, // seconds
    breakThreshold: 0, // Can't use below this
    warningThreshold: 30, // Warn player below this
  },

  // Fleet/Ship Durability
  fleet: {
    enabled: true,
    maxDurability: 100,
    degradationSources: {
      battle: 15, // Per battle (varies by damage taken)
      travel: 0.1, // Per sector traveled
      timeDecay: 0.05, // Per hour idle
    },
    healthStatus: {
      optimal: { range: [100, 81], combatBonus: 1.0 },
      good: { range: [80, 61], combatBonus: 0.95 },
      moderate: { range: [60, 41], combatBonus: 0.85 },
      damaged: { range: [40, 21], combatBonus: 0.7 },
      critical: { range: [20, 1], combatBonus: 0.5 },
      destroyed: { range: [0, 0], combatBonus: 0.0 },
    },
    repairCosts: { gold: 1000, platinum: 50 },
    fullRepairTime: 300, // seconds
  },

  // Building Durability
  building: {
    enabled: true,
    maxDurability: 100,
    degradationSources: {
      attack: 25, // Per attack hit
      sabotage: 30, // Per sabotage attempt
      naturalDecay: 0.01, // Per day
    },
    structuralIntegrity: {
      intact: { range: [100, 76], efficiency: 1.0 },
      damaged: { range: [75, 51], efficiency: 0.85 },
      heavily_damaged: { range: [50, 26], efficiency: 0.6 },
      critical: { range: [25, 1], efficiency: 0.3 },
      destroyed: { range: [0, 0], efficiency: 0.0 },
    },
    repairCosts: { metal: 1000, crystal: 500, gold: 5000 },
    repairTimePerLevel: 30, // seconds per level
  },

  // Resource Field Depletion
  resourceFields: {
    enabled: true,
    maxDepletion: 100,
    depletionRate: 0.5, // Percent per extraction cycle
    depletionThreshold: 80, // Depleted below this
    resurrectionChance: 0.05, // Small chance to regenerate
    resurrectionTime: 2592000, // 30 days in seconds
    exhaustedYield: 0.1, // 10% yield when depleted
  },

  // Durability Penalties
  penalties: {
    lowEquipmentDurability: { combatDamage: -0.1, accuracy: -0.15 },
    lowFleetDurability: { speed: -0.2, attack: -0.15, defense: -0.1 },
    lowBuildingDurability: { production: -0.2, storage: -0.1 },
    depletedField: { resourceYield: -0.9 },
  },

  // Maintenance
  maintenance: {
    enabled: true,
    autoRepairEnabled: false,
    maintenanceCostPerDay: { gold: 100, platinum: 5 },
    preventiveMaintenance: { costReduction: 0.3, timeReduction: 0.5 },
  },
};
