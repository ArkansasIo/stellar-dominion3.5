/**
 * Database Settings & Configuration
 * Centralized database configuration for all environments.
 */

export const DB_SETTINGS = {
  // Connection pool
  poolSize: 10,
  connectionTimeoutMs: 5000,
  idleTimeoutMs: 10000,
  
  // Retry settings
  maxRetries: 3,
  retryDelayMs: 1000,
  
  // Query settings
  maxQueryTimeMs: 30000,
  slowQueryThresholdMs: 1000,
  
  // Health check
  healthCheckIntervalMs: 30000,
  
  // Backup settings
  backupEnabled: true,
  backupIntervalHours: 24,
  backupRetentionDays: 7,
  
  // Cache settings
  cacheEnabled: true,
  cacheTtlSeconds: 300,
  cacheMaxSize: 1000,
  
  // Migration settings
  autoMigrate: false,
  migrationTable: "migrations",
  
  // Logging
  logQueries: process.env.NODE_ENV === "development",
  logSlowQueries: true,
  logErrors: true,
} as const;

export type DBSettings = typeof DB_SETTINGS;
