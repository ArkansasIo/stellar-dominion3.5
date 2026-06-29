// User Permission Configuration - Player roles, capabilities, and restrictions
export const USER_PERMISSION_CONFIG = {
  // User tiers with progression
  tiers: {
    newbie: {
      level: 0,
      name: "Newbie",
      title: "New Player",
      description: "Starting player - learning the game",
      permissions: [
        "basic_trading",
        "send_messages",
        "view_market",
      ],
      restrictions: {
        maxFleetSize: 50,
        maxAllianceMembers: 0,
        canFormAlliance: false,
        canPvP: false,
        messageRateLimit: 10, // per minute
      },
    },
    explorer: {
      level: 1,
      name: "Explorer",
      title: "Explorer",
      description: "Early game player",
      permissions: [
        "basic_trading",
        "send_messages",
        "view_market",
        "explore_space",
        "basic_pvp",
      ],
      restrictions: {
        maxFleetSize: 200,
        maxAllianceMembers: 0,
        canFormAlliance: false,
        canPvP: true,
        messageRateLimit: 20,
        canAttackNewbies: false,
      },
    },
    commander: {
      level: 2,
      name: "Commander",
      title: "Commander",
      description: "Established player",
      permissions: [
        "trading",
        "send_messages",
        "view_market",
        "explore_space",
        "pvp",
        "alliance_creation",
        "diplomacy",
        "colonization",
      ],
      restrictions: {
        maxFleetSize: 1000,
        maxAllianceMembers: 5,
        canFormAlliance: true,
        canPvP: true,
        messageRateLimit: 50,
        canAttackAnyone: true,
      },
    },
    warlord: {
      level: 3,
      name: "Warlord",
      title: "Warlord",
      description: "Advanced military player",
      permissions: [
        "advanced_trading",
        "send_messages",
        "view_market",
        "explore_space",
        "pvp",
        "alliance_leadership",
        "diplomacy",
        "colonization",
        "espionage",
        "sabotage",
      ],
      restrictions: {
        maxFleetSize: 5000,
        maxAllianceMembers: 50,
        canFormAlliance: true,
        canPvP: true,
        messageRateLimit: 100,
        canAttackAnyone: true,
        canSpyOnEveryone: true,
      },
    },
    emperor: {
      level: 4,
      name: "Emperor",
      title: "Emperor",
      description: "End-game player",
      permissions: [
        "advanced_trading",
        "send_messages",
        "view_market",
        "explore_space",
        "pvp",
        "alliance_leadership",
        "diplomacy",
        "colonization",
        "espionage",
        "sabotage",
        "galaxy_control",
      ],
      restrictions: {
        maxFleetSize: 99999,
        maxAllianceMembers: 50,
        canFormAlliance: true,
        canPvP: true,
        messageRateLimit: 200,
        canAttackAnyone: true,
        canSpyOnEveryone: true,
      },
    },
  },

  // Permission categories
  permissionCategories: {
    trading: [
      "buy_resources",
      "sell_resources",
      "market_trading",
      "advanced_trading",
    ],
    communication: [
      "send_messages",
      "send_alliance_mail",
      "create_alliance",
      "join_alliance",
    ],
    military: [
      "build_fleet",
      "attack_players",
      "defend_planet",
      "send_espionage",
      "colonize",
    ],
    exploration: [
      "explore_space",
      "probe_planets",
      "scan_systems",
      "discover_anomalies",
    ],
    social: [
      "create_chat_room",
      "join_alliance",
      "diplomacy",
      "form_pacts",
    ],
  },

  // Account restrictions and limits
  accountRestrictions: {
    defaultAccountStatus: "active",
    statuses: {
      active: "Full access to all enabled features",
      restricted: "Limited to core gameplay only",
      muted: "Cannot send messages or communicate",
      suspended: "Cannot play, assets frozen",
      banned: "Complete account lockout",
    },
    flags: {
      twoFactorRequired: false,
      verifiedEmail: false,
      legacyPlayer: false,
      verified: false,
    },
  },

  // User badges and achievements
  badges: {
    pioneer: { name: "Pioneer", description: "Early adopter" },
    warrior: { name: "Warrior", description: "1000+ victories" },
    trader: { name: "Trader", description: "1 million resources traded" },
    diplomat: { name: "Diplomat", description: "Alliance leader for 30 days" },
    explorer: { name: "Explorer", description: "Discover 50 anomalies" },
    survivor: { name: "Survivor", description: "50+ days without destruction" },
  },

  // Permission inheritance
  permissionInheritance: {
    0: ["view_only"],
    1: ["view_only", "basic_trade"],
    2: ["view_only", "basic_trade", "moderate_pvp"],
    3: ["view_only", "basic_trade", "moderate_pvp", "leadership"],
    4: ["view_only", "basic_trade", "moderate_pvp", "leadership", "full_pvp"],
  },

  // Rate limits by tier
  rateLimits: {
    newbie: {
      messagesPerMinute: 5,
      buildActionsPerMinute: 2,
      fleetMovesPerHour: 10,
      tradeOrdersPerHour: 5,
    },
    explorer: {
      messagesPerMinute: 20,
      buildActionsPerMinute: 5,
      fleetMovesPerHour: 20,
      tradeOrdersPerHour: 20,
    },
    commander: {
      messagesPerMinute: 50,
      buildActionsPerMinute: 10,
      fleetMovesPerHour: 50,
      tradeOrdersPerHour: 50,
    },
    warlord: {
      messagesPerMinute: 100,
      buildActionsPerMinute: 20,
      fleetMovesPerHour: 100,
      tradeOrdersPerHour: 100,
    },
    emperor: {
      messagesPerMinute: 200,
      buildActionsPerMinute: 50,
      fleetMovesPerHour: 500,
      tradeOrdersPerHour: 500,
    },
  },

  // Progression requirements
  progressionRequirements: {
    explorer: { empireLevel: 3, timePlayedDays: 1 },
    commander: { empireLevel: 5, timePlayedDays: 7 },
    warlord: { empireLevel: 10, timePlayedDays: 30 },
    emperor: { empireLevel: 15, timePlayedDays: 90 },
  },
};
