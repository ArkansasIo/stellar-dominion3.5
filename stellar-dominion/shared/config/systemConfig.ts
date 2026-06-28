// System Configuration - Server, database, and environment settings
const ENV = typeof process !== 'undefined' ? process.env : {};

export const SYSTEM_CONFIG = {
  // Server settings
  server: {
    port: 5000,
    environment: ENV.NODE_ENV || 'development',
    apiPrefix: '/api',
    corsOrigins: ['http://localhost:5000', 'http://localhost:3000'],
    requestTimeout: 30000, // 30 seconds
    maxRequestBodySize: '10mb',
  },

  // Database configuration
  database: {
    // Using Neon serverless PostgreSQL
    provider: 'postgresql',
    name: ENV.PGDATABASE || 'stellar_dominion',
    host: ENV.PGHOST || 'localhost',
    port: parseInt(ENV.PGPORT || '5432'),
    user: ENV.PGUSER || 'postgres',
    // Password is in environment variable
    pool: {
      min: 1,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },

  // Authentication settings
  auth: {
    sessionTimeout: 604800000, // 7 days in ms
    passwordMinLength: 6,
    usernameMinLength: 3,
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
  },

  // Logging
  logging: {
    level: ENV.LOG_LEVEL || 'info',
    format: 'json',
    logRequests: true,
    logErrors: true,
  },

  // Cache settings
  cache: {
    ttl: 3600, // 1 hour
    enabled: true,
    provider: 'memory', // or 'redis'
  },

  // Rate limiting
  rateLimit: {
    enabled: true,
    windowMs: 900000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
  },

  // Email settings (for notifications)
  email: {
    provider: ENV.EMAIL_PROVIDER || 'sendgrid',
    from: ENV.EMAIL_FROM || 'noreply@stellardominion.game',
    apiKey: ENV.EMAIL_API_KEY,
  },

  // Feature flags
  features: {
    pvpEnabled: true,
    alliancesEnabled: true,
    marketEnabled: true,
    espionageEnabled: true,
    diplomacyEnabled: true,
    maintenanceMode: false,
    betaFeatures: false,
  },

  // Monitoring and analytics
  monitoring: {
    enabled: true,
    sampleRate: 0.1, // 10% of requests
    errorReporting: true,
    performanceTracking: true,
  },

  // Backup and retention
  backup: {
    enabled: true,
    frequency: 'daily', // daily, weekly, monthly
    retentionDays: 30,
    autoBackupTime: '02:00', // 2 AM UTC
  },

  // Universe generation
  universe: {
    totalGalaxies: 1,
    starsPerGalaxy: 500,
    planetsPerStar: 8,
    maxCoordinates: 9999,
    deterministicSeed: 42, // for reproducible universe
  },

  // Tick/Game loop settings
  gameLoop: {
    tickInterval: 1000, // 1 second ticks
    resourceUpdateInterval: 10000, // Update resources every 10 seconds
    missionProcessInterval: 5000, // Process missions every 5 seconds
    maintenanceInterval: 3600000, // 1 hour for maintenance tasks
  },

  // API versioning
  api: {
    version: 'v1',
    deprecatedVersions: [],
  },

  // CDN and static assets
  cdn: {
    enabled: ENV.CDN_ENABLED === 'true',
    url: ENV.CDN_URL || 'https://cdn.stellardominion.game',
  },

  // Third-party integrations
  integrations: {
    stripe: {
      enabled: ENV.STRIPE_ENABLED === 'true',
      publishableKey: ENV.STRIPE_PUBLISHABLE_KEY,
      secretKey: ENV.STRIPE_SECRET_KEY,
    },
    discord: {
      enabled: ENV.DISCORD_ENABLED === 'true',
      webhookUrl: ENV.DISCORD_WEBHOOK_URL,
    },
  },
};

// Environment-specific overrides
export const getEnvConfig = () => {
  const env = ENV.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...SYSTEM_CONFIG,
        server: {
          ...SYSTEM_CONFIG.server,
          corsOrigins: ['https://stellardominion.game'],
        },
        auth: {
          ...SYSTEM_CONFIG.auth,
          sessionTimeout: 86400000, // 24 hours for production
        },
        logging: {
          ...SYSTEM_CONFIG.logging,
          level: 'warn',
        },
      };

    case 'staging':
      return {
        ...SYSTEM_CONFIG,
        features: {
          ...SYSTEM_CONFIG.features,
          betaFeatures: true,
        },
      };

    case 'development':
    default:
      return SYSTEM_CONFIG;
  }
};
