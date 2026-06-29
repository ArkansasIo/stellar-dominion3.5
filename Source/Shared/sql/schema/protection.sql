-- Protection System, Black Marks, and Achievements

CREATE TABLE IF NOT EXISTS newbie_protection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  protection_start TIMESTAMP DEFAULT NOW(),
  protection_end TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  disabled_early_at TIMESTAMP,
  can_be_attacked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_newbie_protection_player ON newbie_protection(player_id);
CREATE INDEX idx_newbie_protection_active ON newbie_protection(is_active);

CREATE TABLE IF NOT EXISTS player_black_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mark_type VARCHAR NOT NULL,
  severity INTEGER NOT NULL,
  reason VARCHAR NOT NULL,
  imposed_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  imposed_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  removed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_black_marks_player ON player_black_marks(player_id);
CREATE INDEX idx_black_marks_active ON player_black_marks(expires_at) WHERE removed_at IS NULL;

CREATE TABLE IF NOT EXISTS player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_key VARCHAR NOT NULL,
  achievement_name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  progress INTEGER DEFAULT 0,
  requirement INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  reward_gold REAL DEFAULT 0,
  reward_platinum REAL DEFAULT 0,
  reward_title VARCHAR,
  reward_badge VARCHAR,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievements_player ON player_achievements(player_id);
CREATE INDEX idx_achievements_key ON player_achievements(achievement_key);
CREATE INDEX idx_achievements_category ON player_achievements(category);
CREATE INDEX idx_achievements_completed ON player_achievements(completed);

CREATE TABLE IF NOT EXISTS prestige_ranking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prestige_score REAL NOT NULL DEFAULT 0,
  prestige_tier VARCHAR NOT NULL DEFAULT 'neutral',
  rank_position INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prestige_ranking_player ON prestige_ranking(player_id);
CREATE INDEX idx_prestige_ranking_tier ON prestige_ranking(prestige_tier);
