// Startup Configuration
export const STARTUP_CONFIG = {
  // Application initialization
  app: {
    name: 'universe-empire-domions',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
  },

  // Server settings
  server: {
    port: parseInt(process.env.PORT || '5001'),
    host: '0.0.0.0',
    reusePort: true,
  },

  // Startup tasks in order
  initializationTasks: [
    'validateEnvironment',
    'connectDatabase',
    'initializeSchema',
    'loadConfiguration',
    'setupMiddleware',
    'registerRoutes',
    'setupErrorHandling',
    'startServer',
  ],

  // Database initialization
  database: {
    ensureTablesExist: true,
    seedDefaultData: true,
    validateConnection: true,
  },

  // Default admin account setup
  adminSetup: {
    enabled: true,
    defaultUsername: 'admin',
    defaultPassword: process.env.ADMIN_BOOTSTRAP_PASSWORD || 'admin123',
    defaultRole: 'superAdmin',
  },

  // Test accounts setup
  testAccounts: {
    enabled: false,
    accounts: [],
  },

  // Feature flags for startup
  features: {
    enableAPI: true,
    enableWebSockets: false,
    enableAdminPanel: true,
    enableLogging: true,
  },

  // Startup timeouts (in ms)
  timeouts: {
    databaseConnection: 10000,
    schemaInitialization: 30000,
    totalStartupTime: 60000,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'structured',
    outputs: ['console'],
  },
};
