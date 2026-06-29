// Admin Configuration - System administration, controls, and settings
export const ADMIN_CONFIG = {
  // Admin ranks with hierarchical permission levels
  ranks: {
    // Level 5: Founder/Owner (highest)
    founder: {
      level: 5,
      name: "Founder",
      title: "Game Founder",
      description: "Complete system access and control",
      permissions: [
        "manage_all",
        "manage_admins",
        "manage_ranks",
        "manage_teams",
        "manage_departments",
        "manage_settings",
        "access_database",
        "manage_logs",
        "manage_analytics",
      ],
    },
    // Level 4: Head Admin
    headAdmin: {
      level: 4,
      name: "Head Administrator",
      title: "Head Admin",
      description: "Administrative team lead",
      permissions: [
        "manage_users",
        "manage_admins",
        "ban_players",
        "modify_economy",
        "manage_events",
        "view_logs",
        "manage_settings",
        "access_database",
        "manage_analytics",
        "manage_departments",
      ],
    },
    // Level 3: Senior Moderator
    seniorMod: {
      level: 3,
      name: "Senior Moderator",
      title: "Senior Mod",
      description: "Senior moderation and enforcement",
      permissions: [
        "ban_players",
        "mute_players",
        "manage_events",
        "view_logs",
        "manage_alliances",
        "manage_sanctions",
        "view_analytics",
      ],
    },
    // Level 2: Moderator
    moderator: {
      level: 2,
      name: "Moderator",
      title: "Mod",
      description: "Basic moderation and support",
      permissions: [
        "ban_players",
        "mute_players",
        "view_logs",
        "manage_sanctions",
        "view_analytics",
      ],
    },
    // Level 1: Junior Moderator
    juniorMod: {
      level: 1,
      name: "Junior Moderator",
      title: "Jr Mod",
      description: "Support and reporting",
      permissions: [
        "mute_players",
        "view_logs",
        "view_analytics",
      ],
    },
  },

  // Permission hierarchy (higher levels inherit lower permissions)
  permissionLevels: {
    0: "no_access",
    1: "view_only",
    2: "moderate",
    3: "manage",
    4: "administrate",
    5: "all_access",
  },

  // Departments for team organization
  departments: {
    moderation: {
      name: "Moderation Team",
      description: "Player behavior and community management",
      permissions: ["ban_players", "mute_players", "manage_sanctions"],
    },
    technical: {
      name: "Technical Team",
      description: "Server and database management",
      permissions: ["manage_servers", "access_database", "manage_settings"],
    },
    events: {
      name: "Events Team",
      description: "Game events and seasonal content",
      permissions: ["manage_events", "modify_economy"],
    },
    support: {
      name: "Support Team",
      description: "Player support and tickets",
      permissions: ["view_logs", "view_analytics"],
    },
    economy: {
      name: "Economy Team",
      description: "Game balance and economy",
      permissions: ["modify_economy", "manage_settings"],
    },
  },

  // Admin roles and permissions (legacy, kept for compatibility)
  roles: {
    superAdmin: {
      name: "Super Administrator",
      permissions: [
        "manage_users",
        "manage_admins",
        "manage_servers",
        "view_logs",
        "manage_settings",
        "ban_players",
        "modify_economy",
        "access_database",
        "manage_events",
        "manage_alliances",
        "reset_players",
        "view_analytics",
      ],
    },
    moderator: {
      name: "Moderator",
      permissions: [
        "ban_players",
        "view_logs",
        "manage_events",
        "manage_alliances",
        "view_analytics",
      ],
    },
    technician: {
      name: "Technician",
      permissions: [
        "manage_servers",
        "view_logs",
        "access_database",
        "manage_settings",
      ],
    },
  },

  // System controls
  systemControls: {
    maintenanceMode: {
      enabled: false,
      message: "Server is undergoing maintenance. Please try again later.",
      allowAdminAccess: true,
    },
    pvpMode: {
      enabled: true,
      warZonesOnly: false,
    },
    spamProtection: {
      enabled: true,
      maxMessagesPerMinute: 5,
      maxBuildingsPerMinute: 3,
    },
    eventSystem: {
      enabled: true,
      activeEvents: [],
      eventRewardMultiplier: 1.0,
    },
  },

  // Economy controls
  economyControls: {
    resourceMultiplier: 1.0,
    buildTimeMultiplier: 1.0,
    researchTimeMultiplier: 1.0,
    fleetSpeedMultiplier: 1.0,
    marketTaxRate: 0.02, // 2%
    maxPlayerResources: 999999999, // Soft cap
  },

  // Player management
  playerManagement: {
    maxPlayersPerAccount: 1,
    autoDeleteInactiveAfterDays: 90,
    wipePlayerDataOnBan: true,
    maxBanDurationDays: 365,
    allowMultiAccounting: false,
  },

  // Logging and auditing
  logging: {
    enableAdminActionLog: true,
    enablePlayerActivityLog: true,
    enableDatabaseLog: true,
    logRetentionDays: 90,
    enableDetailedCombatLogs: true,
  },

  // Penalties and sanctions
  penalties: {
    chatMuteMinutes: 60,
    kickoutSeconds: 30,
    tempBanDays: 7,
    permBanReason: "Severe violation of Terms of Service",
    autoReportThreshold: 5, // Auto-mute after 5 reports
  },

  // API rate limiting for admin actions
  rateLimiting: {
    adminAPILimits: 1000, // requests per hour
    playerAPILimits: 100, // requests per hour
    globalBandwidthLimit: "10GB", // per hour
  },

  // Backup and recovery
  backup: {
    autoBackupEnabled: true,
    backupIntervalHours: 6,
    backupRetentionDays: 30,
    backupLocation: "/backups",
  },

  // Database management
  database: {
    enableQueryLogging: false,
    slowQueryThresholdMs: 1000,
    maxConnections: 50,
    connectionPoolSize: 20,
  },

  // Alert thresholds
  alerts: {
    highCPUThreshold: 80,
    highMemoryThreshold: 85,
    highDatabaseLatencyMs: 500,
    highErrorRatePercent: 5,
  },

  // Scheduled tasks
  scheduledTasks: {
    dailyReset: "00:00", // UTC
    weeklyMaintenance: "Sunday 02:00",
    monthlyCleanup: "1st of month 03:00",
    seasonalEvents: [],
  },
};
