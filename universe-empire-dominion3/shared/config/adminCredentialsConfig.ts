// Admin Credentials Configuration - Root Admin and Admin Account Setup
const ENV = typeof process !== "undefined" ? process.env : {};

export const ADMIN_CREDENTIALS_CONFIG = {
  // Root Admin Account (Primary Owner)
  rootAdmin: {
    username: ENV.ROOT_ADMIN_USERNAME || "root_admin",
    email: ENV.ROOT_ADMIN_EMAIL || "root@stellar.local",
    firstName: "Root",
    lastName: "Administrator",
    rank: "founder",
    passwordRequirement: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    description: "Ultimate system authority with all permissions",
  },

  // Default Admin Hierarchy Setup
  defaultAdminHierarchy: [
    // Tier 1: Founder/Root
    {
      rank: "founder",
      title: "Founder",
      level: 5,
      description: "Game founder - complete system control",
      defaultCount: 1,
      permissionLevel: "all_access",
    },
    // Tier 2: Administrators
    {
      rank: "administrator",
      title: "Administrator",
      level: 4,
      description: "Administrative team lead - manage admins and system",
      defaultCount: 2,
      permissionLevel: "administrate",
    },
    // Tier 3: Sub-Administrators
    {
      rank: "suadmin",
      title: "Sub-Administrator",
      level: 3,
      description: "Senior admin - manage moderators and economy",
      defaultCount: 3,
      permissionLevel: "manage",
    },
    // Tier 4: Moderators
    {
      rank: "moderator",
      title: "Moderator",
      level: 2,
      description: "Community moderator - enforce rules and support",
      defaultCount: 5,
      permissionLevel: "moderate",
    },
    // Tier 5: Sub-Moderators
    {
      rank: "submod",
      title: "Sub-Moderator",
      level: 1,
      description: "Junior moderator - basic moderation tasks",
      defaultCount: 10,
      permissionLevel: "view_only",
    },
  ],

  // Admin Account Setup Instructions
  setupInstructions: {
    rootAdminSetup: {
      step1: "Create root admin account with strong password",
      step2: "Set environment variables for ROOT_ADMIN_USERNAME and ROOT_ADMIN_PASSWORD_HASH",
      step3: "Verify root admin can access admin panel",
      step4: "Create secondary administrators",
    },
    adminPassword: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    passwordExpiration: {
      rootAdminDays: 90,
      adminDays: 60,
      moderatorDays: 45,
    },
  },

  // Admin Login Security
  adminSecurity: {
    twoFactorEnabled: false,
    ipWhitelist: [],
    loginAttemptLimit: 5,
    lockoutDurationMinutes: 15,
    sessionTimeoutMinutes: 60,
    requirePasswordChange: true,
    passwordChangeFrequencyDays: 90,
  },

  // Admin Account Maintenance
  accountMaintenance: {
    inactivityWarnDays: 14,
    inactivityDisableDays: 30,
    auditLogRetentionDays: 365,
    requireAuditLogging: true,
    autoArchiveInactiveAccounts: true,
  },

  // Admin Promotion/Demotion Rules
  promotionRules: {
    requireApproval: true,
    requireApplicationPeriod: false,
    minimumTimeInRoleDays: 30,
    performanceRatingRequired: 3.0, // Out of 5
    trackPromotionHistory: true,
  },

  // Admin Suspension and Removal
  suspensionPolicy: {
    requireCauseDocumentation: true,
    suspensionAppealAllowed: true,
    appealWindowDays: 7,
    permanentRemovalRequiresVote: true,
    votingThresholdPercent: 75,
  },
};
