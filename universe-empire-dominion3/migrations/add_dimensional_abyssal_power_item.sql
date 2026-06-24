-- Schema updates for Dimensional Contract Tokens, Abyssal Gates, Power Level, and Item Level systems

-- Dimensional Contract Tokens tracking
CREATE TABLE IF NOT EXISTS dimensional_contracts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_tier integer NOT NULL DEFAULT 1,
  tokens_earned integer NOT NULL DEFAULT 0,
  tokens_spent integer NOT NULL DEFAULT 0,
  raids_completed integer NOT NULL DEFAULT 0,
  chests_opened integer NOT NULL DEFAULT 0,
  last_raid_at timestamp,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, contract_tier)
);

-- Abyssal Gate Tokens tracking
CREATE TABLE IF NOT EXISTS abyssal_gate_tokens (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gate_tier integer NOT NULL DEFAULT 1,
  tokens_earned integer NOT NULL DEFAULT 0,
  tokens_spent integer NOT NULL DEFAULT 0,
  gates_completed integer NOT NULL DEFAULT 0,
  chests_opened integer NOT NULL DEFAULT 0,
  last_gate_at timestamp,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, gate_tier)
);

-- Player Power Level tracking
CREATE TABLE IF NOT EXISTS player_power_levels (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_power integer NOT NULL DEFAULT 0,
  raid_power integer NOT NULL DEFAULT 0,
  combat_power integer NOT NULL DEFAULT 0,
  empire_power integer NOT NULL DEFAULT 0,
  item_power integer NOT NULL DEFAULT 0,
  commander_power integer NOT NULL DEFAULT 0,
  fleet_power integer NOT NULL DEFAULT 0,
  research_power integer NOT NULL DEFAULT 0,
  building_power integer NOT NULL DEFAULT 0,
  raid_career_power integer NOT NULL DEFAULT 0,
  power_tier varchar DEFAULT 'Novice',
  last_calculated_at timestamp,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Item Levels tracking
CREATE TABLE IF NOT EXISTS item_levels (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id varchar NOT NULL,
  item_name varchar NOT NULL,
  item_type varchar NOT NULL,
  item_class varchar DEFAULT 'common',
  base_rank integer DEFAULT 1,
  current_level integer NOT NULL DEFAULT 1,
  current_experience integer NOT NULL DEFAULT 0,
  experience_to_next integer NOT NULL DEFAULT 100,
  upgrade_count integer NOT NULL DEFAULT 0,
  last_upgrade_at timestamp,
  upgrade_history jsonb DEFAULT '[]',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Raid chest rewards log
CREATE TABLE IF NOT EXISTS raid_chest_rewards (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_type varchar NOT NULL DEFAULT 'dimensional',
  contract_tier integer NOT NULL,
  tokens_spent integer NOT NULL,
  rewards_granted jsonb NOT NULL DEFAULT '[]',
  opened_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Abyssal gate rewards log
CREATE TABLE IF NOT EXISTS abyssal_gate_rewards (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gate_tier integer NOT NULL,
  tokens_spent integer NOT NULL,
  rewards_granted jsonb NOT NULL DEFAULT '[]',
  completed_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dimensional_contracts_user ON dimensional_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_abyssal_gate_tokens_user ON abyssal_gate_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_player_power_levels_user ON player_power_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_item_levels_user ON item_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_raid_chest_rewards_user ON raid_chest_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_abyssal_gate_rewards_user ON abyssal_gate_rewards(user_id);
