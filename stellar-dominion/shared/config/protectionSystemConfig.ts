// Empire Protection System - Newbie Protection, Black Marks, and Achievements
export const PROTECTION_SYSTEM_CONFIG = {
  // New Player Protection (PPT - Personal Protection Time)
  newbieProtection: {
    enabled: true,
    protectionDurationDays: 3,
    startAfterAccountCreation: true,
    protectionFeatures: {
      noAttacks: true,
      noFleetInterception: true,
      noResourceRaid: true,
      noPiracy: true,
      canAttackUnprotected: true,
      canDefend: false,
    },
    protectionLevel: "full",
    visibleIndicator: true,
    canDisableEarly: true,
    earlyCancelPenalty: 0,
  },

  // Black Mark System
  blackMarkSystem: {
    enabled: true,
    maxMarksPerPlayer: 10,
    markDurationDays: 30,
    markSources: {
      violateRules: { severity: 2, description: "Rule violation" },
      multiAccount: { severity: 3, description: "Multi-accounting" },
      exploitation: { severity: 3, description: "Game exploit" },
      harassment: { severity: 2, description: "Player harassment" },
      botUsage: { severity: 3, description: "Bot/script usage" },
      scamming: { severity: 3, description: "Scamming other players" },
      fleetRamming: { severity: 1, description: "Fleet ramming (3+ times)" },
      spamming: { severity: 1, description: "Chat spam" },
    },
    penalties: {
      1: { name: "Warning", restrictions: [] },
      2: { name: "Caution", restrictions: ["limited_trading"] },
      3: { name: "Suspended", restrictions: ["no_pvp", "limited_trading"] },
      4: { name: "Temp Ban", restrictions: ["account_locked"] },
      5: { name: "Permanent Ban", restrictions: ["account_deleted"] },
    },
    autoRemovalAfterExpiry: true,
  },

  // Protection Zones (Safe Zones)
  protectionZones: {
    startingGalaxy: {
      enabled: true,
      radius: 100,
      fullProtection: true,
      allowedLevelMax: 50,
      description: "Starting zone for new players",
    },
    peacefulZone: {
      enabled: true,
      radius: 200,
      fullProtection: false,
      allowedLevelMax: 200,
      pvpRestricted: true,
      description: "Reduced PvP zone",
    },
  },

  // Prestige/Reputation System
  prestigeRanking: {
    enabled: true,
    minLevelForRanking: 20,
    factorsConsidered: ["combat_wins", "treaties_honored", "trade_volume", "alliance_loyalty"],
    tiers: {
      honorable: { minScore: 1000, bonuses: { alliances: 0.1, diplomacy: 0.15 } },
      neutral: { minScore: 0, bonuses: {} },
      disreputable: { minScore: -1000, bonuses: { trade: -0.2, alliances: -0.3 } },
    },
  },

  // Achievement System
  achievements: {
    enabled: true,
    totalAchievements: 50,
    categories: ["combat", "economy", "exploration", "diplomacy", "knowledge", "special"],
    rewards: { currency: true, titles: true, badges: true, cosmetics: true },
  },
};
