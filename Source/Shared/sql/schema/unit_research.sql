-- Unit Research System

-- Unit research definitions
CREATE TABLE IF NOT EXISTS unit_research_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_key VARCHAR UNIQUE NOT NULL,
  research_name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  tier INTEGER NOT NULL,
  cost JSONB NOT NULL DEFAULT '{}',
  research_time INTEGER NOT NULL,
  description TEXT,
  unlocks JSONB NOT NULL DEFAULT '[]',
  prerequisites JSONB NOT NULL DEFAULT '[]',
  bonuses JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_key ON unit_research_definitions(research_key);
CREATE INDEX idx_research_category ON unit_research_definitions(category);
CREATE INDEX idx_research_tier ON unit_research_definitions(tier);

-- Player research progress
CREATE TABLE IF NOT EXISTS player_unit_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id UUID NOT NULL REFERENCES unit_research_definitions(id),
  status VARCHAR DEFAULT 'locked',
  progress REAL DEFAULT 0,
  completed_at TIMESTAMP,
  started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_player_research_player ON player_unit_research(player_id);
CREATE INDEX idx_player_research_status ON player_unit_research(status);
CREATE INDEX idx_player_research_research ON player_unit_research(research_id);
CREATE UNIQUE INDEX idx_player_research_unique ON player_unit_research(player_id, research_id);

-- Research queue (one active research at a time)
CREATE TABLE IF NOT EXISTS unit_research_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id UUID NOT NULL REFERENCES unit_research_definitions(id),
  started_at TIMESTAMP DEFAULT NOW(),
  completion_time TIMESTAMP NOT NULL,
  research_points_invested REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_queue_player ON unit_research_queue(player_id);
CREATE INDEX idx_research_queue_research ON unit_research_queue(research_id);

-- Unit classification upgrades (purchased with research)
CREATE TABLE IF NOT EXISTS unit_classification_upgrades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  upgrade_type VARCHAR NOT NULL,
  upgrade_key VARCHAR NOT NULL,
  tier INTEGER,
  status VARCHAR DEFAULT 'active',
  applied_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classification_unit ON unit_classification_upgrades(unit_id);
CREATE INDEX idx_classification_type ON unit_classification_upgrades(upgrade_type);

-- Unlocked unit types per player
CREATE TABLE IF NOT EXISTS player_unlocked_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_type VARCHAR NOT NULL,
  unit_class VARCHAR,
  unit_job VARCHAR,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_unlocked_player ON player_unlocked_units(player_id);
CREATE INDEX idx_unlocked_type ON player_unlocked_units(unit_type);
CREATE UNIQUE INDEX idx_unlocked_unique ON player_unlocked_units(player_id, unit_type, unit_class, unit_job);

-- Research points tracking
CREATE TABLE IF NOT EXISTS research_points_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_earned REAL NOT NULL,
  source VARCHAR NOT NULL,
  unit_id UUID REFERENCES units(id),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_points_player ON research_points_log(player_id);
CREATE INDEX idx_points_logged_at ON research_points_log(logged_at);

-- Research bonuses and effects active on player
CREATE TABLE IF NOT EXISTS active_research_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id UUID NOT NULL REFERENCES unit_research_definitions(id),
  bonus_type VARCHAR NOT NULL,
  bonus_value REAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applied_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_active_bonus_player ON active_research_bonuses(player_id);
CREATE INDEX idx_active_bonus_research ON active_research_bonuses(research_id);
