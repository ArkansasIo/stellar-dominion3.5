// Startup Configuration
export const STARTUP_CONFIG = {
  // Application initialization
  app: {
    name: 'Universe-Empires-Dominions',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
  },

  // Server settings
  server: {
    port: parseInt(process.env.PORT || '5000'),
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
    defaultPassword: 'admin123', // CHANGE IN PRODUCTION
    defaultRole: 'superAdmin',
  },

  // Test accounts setup
  testAccounts: {
    enabled: true,
    accounts: [
      { username: 'player1', password: 'password123' },
      { username: 'player2', password: 'password123' },
      { username: 'player3', password: 'password123' },
    ],
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
