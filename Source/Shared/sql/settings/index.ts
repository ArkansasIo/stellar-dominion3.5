/**
 * SQL Settings Index
 * Re-exports all SQL setting modules for easy access.
 */

export const SQL_SCHEMA_ORDER = [
  "01_base_tables.sql",
  "02_game_tables.sql",
  "03_advanced_tables.sql",
] as const;

export const SQL_SEED_ORDER = [
  "01_default_data.sql",
  "02_combat_data.sql",
  "03_research_data.sql",
] as const;

export const SQL_TRIGGER_ORDER = [
  "auto_update_timestamps.sql",
] as const;

export const SQL_VIEW_ORDER = [
  "player_dashboard.sql",
] as const;

export const SQL_OPTION_ORDER = [
  "player_options.sql",
] as const;

export const SQL_SETTINGS_ORDER = [
  "game_settings.sql",
] as const;
