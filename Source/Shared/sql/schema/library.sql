-- Knowledge Library System (1-100 levels, 1-21 tiers)

-- Knowledge types and classes
CREATE TABLE IF NOT EXISTS knowledge_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key VARCHAR UNIQUE NOT NULL,
  type_name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_types_key ON knowledge_types(type_key);

-- Knowledge classes
CREATE TABLE IF NOT EXISTS knowledge_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_key VARCHAR UNIQUE NOT NULL,
  class_name VARCHAR NOT NULL,
  knowledge_type_id UUID NOT NULL REFERENCES knowledge_types(id),
  bonuses JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_classes_type ON knowledge_classes(knowledge_type_id);
CREATE INDEX idx_knowledge_classes_key ON knowledge_classes(class_key);

-- Knowledge tiers (1-21)
CREATE TABLE IF NOT EXISTS knowledge_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_number INTEGER UNIQUE NOT NULL,
  tier_name VARCHAR NOT NULL,
  level_range_min INTEGER NOT NULL,
  level_range_max INTEGER NOT NULL,
  cost_multiplier REAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tiers_number ON knowledge_tiers(tier_number);

-- Player knowledge progress
CREATE TABLE IF NOT EXISTS player_knowledge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  current_level INTEGER NOT NULL DEFAULT 1,
  current_tier INTEGER NOT NULL DEFAULT 1,
  experience REAL NOT NULL DEFAULT 0,
  total_experience REAL NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_player_knowledge_player ON player_knowledge_progress(player_id);
CREATE INDEX idx_player_knowledge_class ON player_knowledge_progress(knowledge_class_id);
CREATE INDEX idx_player_knowledge_level ON player_knowledge_progress(current_level);
CREATE UNIQUE INDEX idx_player_knowledge_unique ON player_knowledge_progress(player_id, knowledge_class_id);

-- Knowledge research queue (one active research per knowledge type)
CREATE TABLE IF NOT EXISTS knowledge_research_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  target_level INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  completion_time TIMESTAMP NOT NULL,
  knowledge_points_invested REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_queue_player ON knowledge_research_queue(player_id);
CREATE INDEX idx_research_queue_class ON knowledge_research_queue(knowledge_class_id);

-- Knowledge points log
CREATE TABLE IF NOT EXISTS knowledge_points_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  points_earned REAL NOT NULL,
  source VARCHAR NOT NULL,
  unit_id UUID REFERENCES units(id),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_points_log_player ON knowledge_points_log(player_id);
CREATE INDEX idx_points_log_class ON knowledge_points_log(knowledge_class_id);
CREATE INDEX idx_points_log_logged_at ON knowledge_points_log(logged_at);

-- Active knowledge bonuses applied to player
CREATE TABLE IF NOT EXISTS active_knowledge_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  bonus_type VARCHAR NOT NULL,
  bonus_value REAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applied_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_active_knowledge_player ON active_knowledge_bonuses(player_id);
CREATE INDEX idx_active_knowledge_class ON active_knowledge_bonuses(knowledge_class_id);

-- Knowledge synergies (bonuses from multiple knowledge areas)
CREATE TABLE IF NOT EXISTS knowledge_synergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_type_1 VARCHAR NOT NULL,
  knowledge_type_2 VARCHAR NOT NULL,
  synergy_bonus REAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_synergies_player ON knowledge_synergies(player_id);

-- Library research definitions (tech tree)
CREATE TABLE IF NOT EXISTS library_research_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_key VARCHAR UNIQUE NOT NULL,
  research_name VARCHAR NOT NULL,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  required_level INTEGER NOT NULL,
  required_tier INTEGER NOT NULL,
  cost JSONB NOT NULL DEFAULT '{}',
  research_time INTEGER NOT NULL,
  description TEXT,
  unlocks JSONB NOT NULL DEFAULT '[]',
  prerequisites JSONB NOT NULL DEFAULT '[]',
  bonuses JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_def_key ON library_research_definitions(research_key);
CREATE INDEX idx_research_def_class ON library_research_definitions(knowledge_class_id);

-- Player library unlocks
CREATE TABLE IF NOT EXISTS player_library_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id UUID NOT NULL REFERENCES library_research_definitions(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_unlocks_player ON player_library_unlocks(player_id);
CREATE INDEX idx_unlocks_research ON player_library_unlocks(research_id);

-- Level unlock events
CREATE TABLE IF NOT EXISTS level_unlock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_class_id UUID NOT NULL REFERENCES knowledge_classes(id),
  level_reached INTEGER NOT NULL,
  unlock_type VARCHAR NOT NULL,
  unlock_name VARCHAR NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_unlock_events_player ON level_unlock_events(player_id);
CREATE INDEX idx_unlock_events_class ON level_unlock_events(knowledge_class_id);
CREATE INDEX idx_unlock_events_level ON level_unlock_events(level_reached);
