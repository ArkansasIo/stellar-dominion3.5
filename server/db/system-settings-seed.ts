// System Settings Default Values
export const DEFAULT_SYSTEM_SETTINGS = {
  game_speed: {
    turnsPerMinute: 6,
    resourceProductionRate: 1.0,
    researchSpeedMultiplier: 1.0,
  },
  resource_prices: {
    metal: 1,
    crystal: 1.5,
    deuterium: 2.0,
  },
  starting_resources: {
    metal: 1000,
    crystal: 500,
    deuterium: 0,
    energy: 0,
    credits: 1000,
    food: 500,
    water: 500,
  },
  player_limits: {
    maxFleets: 10,
    maxMissions: 50,
    maxAlliances: 1,
  },
  turn_system: {
    turnsPerMinute: 6,
    offlineAccumulationCap: 24,
    maxCurrentTurns: 1000,
  },
  combat_enabled: true,
  alliance_enabled: true,
  trading_enabled: true,
  auction_enabled: true,
  maintenance_mode: false,
  server_message: "",
  rate_limit_login: {
    attempts: 5,
    windowMs: 900000, // 15 minutes
  },
  rate_limit_api: {
    requestsPerMinute: 60,
  },
  database_version: "1",
};

export const SETTINGS_CATEGORIES = {
  GAME: "game",
  ECONOMY: "economy",
  GAMEPLAY: "gameplay",
  SYSTEM: "system",
  SECURITY: "security",
};

export const SETTINGS_DESCRIPTIONS: Record<string, string> = {
  game_speed: "Game speed and progression multipliers",
  resource_prices: "Market prices for resources",
  starting_resources: "Starting resources for new players",
  player_limits: "Player action limits",
  turn_system: "Turn system configuration",
  combat_enabled: "Enable/disable player combat system",
  alliance_enabled: "Enable/disable alliance system",
  trading_enabled: "Enable/disable player-to-player trading",
  auction_enabled: "Enable/disable auction house",
  maintenance_mode: "Enable maintenance mode (restrict logins)",
  server_message: "Server-wide announcement message",
  rate_limit_login: "Login rate limiting (5 attempts per 15 min)",
  rate_limit_api: "API rate limiting",
  database_version: "Current database schema version",
  last_backup: "Last database backup timestamp",
};
