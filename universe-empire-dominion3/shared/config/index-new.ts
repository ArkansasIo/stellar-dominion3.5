/**
 * New Configuration Index
 * Centralized export point for all new configuration sub-systems.
 * These configs supplement the existing 100+ config files in the main shared/config/ directory.
 */

// Game Settings
export { GAME_SETTINGS } from "./game/gameSettings";
export type { GameSettings } from "./game/gameSettings";

// Economy Settings
export { RESOURCE_SETTINGS } from "./economy/resourceSettings";
export type { ResourceSettings } from "./economy/resourceSettings";
export { DEVICE_PRICES } from "./economy/devicePrices";
export type { DevicePrices } from "./economy/devicePrices";

// Server Settings
export { SERVER_SETTINGS } from "./server/serverSettings";
export type { ServerSettings } from "./server/serverSettings";

// Player Settings
export { PLAYER_SETTINGS } from "./players/playerSettings";
export type { PlayerSettings } from "./players/playerSettings";

// Combat Settings
export { COMBAT_SETTINGS } from "./combat/combatSettings";
export type { CombatSettings } from "./combat/combatSettings";

// Universe Settings
export { UNIVERSE_SETTINGS } from "./universe/index";
export type { UniverseSettings } from "./universe/index";

// Database Settings
export { DB_SETTINGS } from "../../server/database/settings/dbSettings";
export type { DBSettings } from "../../server/database/settings/dbSettings";
export { QUERY_SETTINGS } from "../../server/database/settings/querySettings";
export type { QuerySettings } from "../../server/database/settings/querySettings";

// SQL Settings
export {
  SQL_SCHEMA_ORDER,
  SQL_SEED_ORDER,
  SQL_TRIGGER_ORDER,
  SQL_VIEW_ORDER,
  SQL_OPTION_ORDER,
  SQL_SETTINGS_ORDER,
} from "../sql/settings/index";
