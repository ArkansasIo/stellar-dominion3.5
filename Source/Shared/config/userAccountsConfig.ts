// User Accounts Configuration - Regular Player Account Management
export const USER_ACCOUNTS_CONFIG = {
  // User Account Tiers (Progression)
  userTiers: {
    newbie: {
      tier: 1,
      name: "Newbie",
      description: "New player just starting their journey",
      features: ["basic_gameplay", "tutorial_access", "limited_trading"],
      rateLimit: 30, // requests per minute
    },
    explorer: {
      tier: 2,
      name: "Explorer",
      description: "Player with some experience",
      features: ["basic_gameplay", "trading", "alliances"],
      rateLimit: 50,
    },
    commander: {
      tier: 3,
      name: "Commander",
      description: "Established player",
      features: ["all_gameplay", "trading", "alliances", "market_access"],
      rateLimit: 100,
    },
    legend: {
      tier: 4,
      name: "Legend",
      description: "Highly accomplished player",
      features: ["all_gameplay", "premium_features", "market_access", "sponsorship"],
      rateLimit: 150,
    },
    emperor: {
      tier: 5,
      name: "Emperor",
      description: "Elite player at the peak",
      features: ["all_gameplay", "premium_features", "market_access", "exclusive_events", "cosmetics"],
      rateLimit: 200,
    },
  },

  // Account Status Types
  accountStatus: {
    active: { description: "Active and playing", canPlay: true },
    restricted: { description: "Limited access due to violations", canPlay: true },
    suspended: { description: "Temporarily suspended", canPlay: false },
    banned: { description: "Permanently banned", canPlay: false },
    inactive: { description: "Inactive for extended period", canPlay: false },
  },

  // User Account Creation Requirements
  accountCreation: {
    minUsernameLength: 3,
    maxUsernameLength: 20,
    minPasswordLength: 6,
    requireEmail: true,
    emailVerificationRequired: false,
    ageVerificationRequired: false,
    termsAcceptanceRequired: true,
  },

  // User Account Limits
  accountLimits: {
    maxAccountsPerEmail: 1,
    maxAccountsPerIP: 3,
    maxCharactersPerAccount: 1,
    maxAlliancesPerPlayer: 1,
    maxTradesPerDay: 50,
    maxFleetSize: 10000,
  },

  // User Profile Information
  profileFields: {
    username: { required: true, editable: false, minLength: 3, maxLength: 20 },
    email: { required: true, editable: true, verified: false },
    firstName: { required: false, editable: true, maxLength: 50 },
    lastName: { required: false, editable: true, maxLength: 50 },
    profileImageUrl: { required: false, editable: true },
    bio: { required: false, editable: true, maxLength: 500 },
    location: { required: false, editable: true, maxLength: 100 },
  },

  // User Activity Tracking
  activityTracking: {
    trackLoginTimes: true,
    trackGameActions: true,
    trackResourceGeneration: true,
    trackBattles: true,
    trackTrades: true,
    retentionDays: 365,
  },

  // Inactivity Policy
  inactivityPolicy: {
    warnAfterDays: 30,
    suspendAfterDays: 90,
    deleteAfterDays: 365,
    preserveGuildHistory: true,
    preserveTransactionHistory: true,
  },

  // Account Recovery
  accountRecovery: {
    enableEmailRecovery: true,
    enableSecurityQuestions: false,
    recoveryLinkValidityHours: 24,
    maxRecoveryAttemptsPerDay: 3,
  },

  // User Permissions by Tier
  tierPermissions: {
    newbie: ["basic_gameplay"],
    explorer: ["basic_gameplay", "trading"],
    commander: ["basic_gameplay", "trading", "alliances", "market"],
    legend: ["basic_gameplay", "trading", "alliances", "market", "premium"],
    emperor: ["basic_gameplay", "trading", "alliances", "market", "premium", "exclusive"],
  },

  // User Badges and Achievements
  badges: {
    enableBadges: true,
    enableAchievements: true,
    publicBadgeDisplay: true,
    achievementTracking: true,
  },

  // User Privacy Settings
  privacySettings: {
    defaultProfileVisibility: "public",
    defaultFleetVisibility: "hidden",
    defaultAllianceVisibility: "public",
    allowPrivateMessages: true,
    allowFriendRequests: true,
  },

  // User Deletion Policy
  deletionPolicy: {
    allowSelfDeletion: true,
    deletionWaitingPeriodDays: 7,
    permanentDataDeletionDays: 30,
    preserveTransactionRecords: true,
    anonymizeDeletedAccounts: false,
  },

  // Two-Factor Authentication
  twoFactorAuth: {
    enableTFA: false,
    tfaRequired: false,
    supportedMethods: ["email", "authenticator"],
  },

  // User Security
  security: {
    enforcePasswordExpiration: false,
    passwordExpirationDays: 180,
    requirePasswordChange: false,
    enableLoginNotifications: false,
    enableSuspiciousActivityAlerts: true,
  },
};
