-- Game Configuration Schema - Rules, balancing, and game data

CREATE TABLE IF NOT EXISTS game_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  category VARCHAR(50), -- 'resources', 'buildings', 'combat', etc.
  is_active BOOLEAN DEFAULT true,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(36) -- Admin user ID
);

CREATE TABLE IF NOT EXISTS resource_costs (
  id SERIAL PRIMARY KEY,
  item_type VARCHAR(50) NOT NULL, -- 'building', 'unit', 'tech'
  item_id VARCHAR(100) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  metal_cost INTEGER DEFAULT 0,
  crystal_cost INTEGER DEFAULT 0,
  deuterium_cost INTEGER DEFAULT 1,
  energy_cost INTEGER DEFAULT 0,
  build_time_seconds INTEGER DEFAULT 60,
  CONSTRAINT unique_item_cost UNIQUE(item_type, item_id)
);

CREATE TABLE IF NOT EXISTS technology_tree (
  id SERIAL PRIMARY KEY,
  tech_id VARCHAR(100) UNIQUE NOT NULL,
  tech_name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  category VARCHAR(50), -- 'weapons', 'defense', 'economy', 'exploration'
  rarity_tier INTEGER, -- 1-7 (common to transcendent)
  level INTEGER NOT NULL DEFAULT 1,
  prerequisite_tech_id VARCHAR(100),
  metal_cost INTEGER,
  crystal_cost INTEGER,
  deuterium_cost INTEGER,
  research_time_seconds INTEGER,
  bonuses JSONB, -- {fleetPower: 1.1, resourceProduction: 1.05, etc}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prerequisite_tech_id) REFERENCES technology_tree(tech_id)
);

CREATE TABLE IF NOT EXISTS combat_balance (
  id SERIAL PRIMARY KEY,
  unit_type VARCHAR(50) UNIQUE NOT NULL,
  unit_class VARCHAR(50), -- 'fighter', 'cargo', 'capital', etc.
  attack_power INTEGER NOT NULL,
  defense_power INTEGER NOT NULL,
  shield_points INTEGER NOT NULL,
  armor_points INTEGER NOT NULL,
  hull_points INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  cargo_capacity INTEGER DEFAULT 0,
  evasion REAL DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS armor_types (
  id SERIAL PRIMARY KEY,
  armor_id VARCHAR(50) UNIQUE NOT NULL,
  armor_name VARCHAR(100) NOT NULL,
  durability INTEGER NOT NULL,
  armor_effectiveness JSONB, -- {standard: 1.0, laser: 1.2, ion: 0.8, etc}
  weight REAL
);

CREATE TABLE IF NOT EXISTS weapon_types (
  id SERIAL PRIMARY KEY,
  weapon_id VARCHAR(50) UNIQUE NOT NULL,
  weapon_name VARCHAR(100) NOT NULL,
  damage_output INTEGER NOT NULL,
  weapon_type VARCHAR(50), -- 'laser', 'ion', 'railgun', 'plasma', 'missile'
  effectiveness JSONB, -- effectiveness against different armor types
  fire_rate REAL
);

CREATE TABLE IF NOT EXISTS building_info (
  id SERIAL PRIMARY KEY,
  building_id VARCHAR(50) UNIQUE NOT NULL,
  building_name VARCHAR(100) NOT NULL,
  building_type VARCHAR(50), -- 'resource', 'defense', 'production', 'research'
  base_production REAL, -- for resource buildings
  production_type VARCHAR(50), -- 'metal', 'crystal', etc
  level_multiplier REAL DEFAULT 1.1, -- each level multiplies by this
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS game_events_log (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL, -- 'combat', 'diplomacy', 'market', 'achievement'
  event_description VARCHAR(500),
  player_id VARCHAR(36) NOT NULL REFERENCES users(id),
  related_player_id VARCHAR(36), -- for pvp events
  event_data JSONB,
  severity VARCHAR(20), -- 'info', 'warning', 'critical'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id SERIAL PRIMARY KEY,
  rank_type VARCHAR(50), -- 'points', 'fleet_power', 'wealth', etc.
  player_id VARCHAR(36) NOT NULL,
  player_name VARCHAR(100),
  score BIGINT NOT NULL,
  rank INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_leaderboard UNIQUE(rank_type, player_id)
);

CREATE TABLE IF NOT EXISTS achievement_definitions (
  id SERIAL PRIMARY KEY,
  achievement_id VARCHAR(100) UNIQUE NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  category VARCHAR(50),
  difficulty VARCHAR(20), -- 'easy', 'medium', 'hard', 'legendary'
  points_reward INTEGER,
  icon_url VARCHAR(255),
  conditions JSONB -- JSON defining achievement conditions
);

CREATE TABLE IF NOT EXISTS player_achievements (
  id SERIAL PRIMARY KEY,
  player_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL REFERENCES achievement_definitions(achievement_id),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_player_achievement UNIQUE(player_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_game_config_key ON game_config(config_key);
CREATE INDEX idx_tech_tree_category ON technology_tree(category);
CREATE INDEX idx_combat_balance_class ON combat_balance(unit_class);
CREATE INDEX idx_event_log_player ON game_events_log(player_id);
CREATE INDEX idx_event_log_date ON game_events_log(created_at);
CREATE INDEX idx_leaderboard_rank ON leaderboard_cache(rank_type, rank);
