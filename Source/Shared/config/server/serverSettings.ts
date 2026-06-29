/**
 * Server Settings & Environment Configuration
 */

export const SERVER_SETTINGS = {
  gameName: "Universe_Civilization: Empire-At-War",
  releaseVersion: "Alpha 1.5.0",
  universeId: "Nexus-Alpha",
  buildChannel: "Development",

  // Ports & networking
  defaultPort: 5000,
  apiPrefix: "/api",
  healthCheckPath: "/api/status/health",

  // Sessions
  sessionTtlDays: 7,
  cookieName: "connect.sid",

  // Rate limits (requests per window)
  rateLimitWindowMs: 60_000,
  rateLimitMax: 60,

  // Database
  dbConnectionTimeoutMs: 5000,
  dbMaxConnections: 10,
  dbIdleTimeoutMs: 10000,

  // CORS
  corsOrigin: "*",
  corsCredentials: true,
} as const;

export type ServerSettings = typeof SERVER_SETTINGS;
