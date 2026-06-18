-- Initialize schema for Stellar Dominion
-- This file can be used to bootstrap the database if drizzle-kit fails

CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar UNIQUE,
  password_hash varchar,
  email varchar UNIQUE,
  first_name varchar,
  last_name varchar,
  profile_image_url varchar,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_states (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  setup_complete boolean NOT NULL DEFAULT false,
  planet_name varchar NOT NULL DEFAULT 'New Colony',
  coordinates varchar NOT NULL DEFAULT '[1:1:1]',
  resources jsonb NOT NULL DEFAULT '{"metal": 1000, "crystal": 500, "deuterium": 0, "energy": 0, "credits": 1000, "food": 500, "water": 500}',
  buildings jsonb NOT NULL DEFAULT '{"roboticsFactory": 0, "shipyard": 0, "researchLab": 0}',
  orbital_buildings jsonb NOT NULL DEFAULT '{}',
  research jsonb NOT NULL DEFAULT '{}',
  units jsonb NOT NULL DEFAULT '{}',
  commander jsonb NOT NULL,
  government jsonb NOT NULL,
  artifacts jsonb NOT NULL DEFAULT '[]',
  cron_jobs jsonb NOT NULL DEFAULT '[]',
  empire_level integer NOT NULL DEFAULT 1,
  kardashev_progress jsonb NOT NULL DEFAULT '{"metal": 0, "crystal": 0, "deuterium": 0, "research": 0}',
  total_turns integer NOT NULL DEFAULT 0,
  current_turns integer NOT NULL DEFAULT 0,
  last_turn_update timestamp DEFAULT CURRENT_TIMESTAMP,
  last_resource_update timestamp DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id varchar REFERENCES users(id),
  to_user_id varchar REFERENCES users(id),
  "from" varchar,
  "to" varchar,
  subject varchar,
  body text,
  "read" boolean DEFAULT false,
  type varchar DEFAULT 'standard',
  battle_report jsonb,
  espionage_report jsonb,
  timestamp timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trade_offers (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name varchar NOT NULL,
  receiver_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_name varchar NOT NULL,
  offer_metal integer DEFAULT 0,
  offer_crystal integer DEFAULT 0,
  offer_deuterium integer DEFAULT 0,
  offer_items jsonb DEFAULT '[]',
  request_metal integer DEFAULT 0,
  request_crystal integer DEFAULT 0,
  request_deuterium integer DEFAULT 0,
  request_items jsonb DEFAULT '[]',
  message text,
  status varchar DEFAULT 'pending',
  original_offer_id varchar,
  expires_at timestamp,
  completed_at timestamp,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trade_history (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_offer_id varchar,
  sender_id varchar REFERENCES users(id),
  sender_name varchar,
  receiver_id varchar REFERENCES users(id),
  receiver_name varchar,
  sender_gave jsonb,
  receiver_gave jsonb,
  result varchar,
  completed_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables can be added as needed

-- System Settings table for game configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category varchar DEFAULT 'general',
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category) VALUES
  ('game_speed', '{"turnsPerMinute": 6, "resourceProductionRate": 1.0, "researchSpeedMultiplier": 1.0}', 'Game speed and progression multipliers', 'game'),
  ('resource_prices', '{"metal": 1, "crystal": 1.5, "deuterium": 2.0}', 'Market prices for resources', 'economy'),
  ('starting_resources', '{"metal": 1000, "crystal": 500, "deuterium": 0, "energy": 0, "credits": 1000, "food": 500, "water": 500}', 'Starting resources for new players', 'economy'),
  ('player_limits', '{"maxFleets": 10, "maxMissions": 50, "maxAlliances": 1}', 'Player action limits', 'gameplay'),
  ('turn_system', '{"turnsPerMinute": 6, "offlineAccumulationCap": 24, "maxCurrentTurns": 1000}', 'Turn system configuration', 'gameplay'),
  ('combat_enabled', 'true', 'Enable/disable player combat system', 'gameplay'),
  ('alliance_enabled', 'true', 'Enable/disable alliance system', 'gameplay'),
  ('trading_enabled', 'true', 'Enable/disable player-to-player trading', 'gameplay'),
  ('auction_enabled', 'true', 'Enable/disable auction house', 'economy'),
  ('maintenance_mode', 'false', 'Enable maintenance mode (restrict logins)', 'system'),
  ('server_message', '""', 'Server-wide announcement message', 'system'),
  ('rate_limit_login', '{"attempts": 5, "windowMs": 900000}', 'Login rate limiting (5 attempts per 15 min)', 'security'),
  ('rate_limit_api', '{"requestsPerMinute": 60}', 'API rate limiting', 'security'),
  ('database_version', '1', 'Current database schema version', 'system'),
  ('last_backup', '"' || to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS') || '"', 'Last database backup timestamp', 'system')
ON CONFLICT (key) DO NOTHING;
