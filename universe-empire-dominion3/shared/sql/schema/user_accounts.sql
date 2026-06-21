-- User Accounts System - Regular player account management and tracking

-- User account profiles (extended from base users table)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL DEFAULT 1,
  tier_name VARCHAR DEFAULT 'newbie',
  account_status VARCHAR DEFAULT 'active',
  bio TEXT,
  location VARCHAR,
  profile_image_url VARCHAR,
  website_url VARCHAR,
  last_login_at TIMESTAMP,
  last_activity_at TIMESTAMP,
  join_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_tier ON user_profiles(tier);
CREATE INDEX idx_user_profiles_status ON user_profiles(account_status);

-- User account activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR NOT NULL,
  description TEXT,
  ip_address VARCHAR,
  user_agent VARCHAR,
  resource_consumed JSONB,
  result VARCHAR,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_activity_log_type ON user_activity_log(activity_type);
CREATE INDEX idx_activity_log_logged_at ON user_activity_log(logged_at);

-- User login history
CREATE TABLE IF NOT EXISTS user_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP DEFAULT NOW(),
  logout_time TIMESTAMP,
  ip_address VARCHAR,
  user_agent VARCHAR,
  session_duration_seconds INTEGER,
  login_status VARCHAR
);

CREATE INDEX idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX idx_login_history_login_time ON user_login_history(login_time);

-- User badges and achievements
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key VARCHAR NOT NULL,
  badge_name VARCHAR NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP DEFAULT NOW(),
  progress_percent INTEGER DEFAULT 100,
  rarity VARCHAR
);

CREATE INDEX idx_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_badges_key ON user_badges(badge_key);

-- User achievements (detailed tracking)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_key VARCHAR NOT NULL,
  achievement_name VARCHAR NOT NULL,
  achievement_category VARCHAR,
  progress_current INTEGER DEFAULT 0,
  progress_target INTEGER NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  reward_gold REAL DEFAULT 0,
  reward_platinum REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_achievements_key ON user_achievements(achievement_key);

-- User privacy settings
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_visibility VARCHAR DEFAULT 'public',
  fleet_visibility VARCHAR DEFAULT 'hidden',
  alliance_visibility VARCHAR DEFAULT 'public',
  allow_private_messages BOOLEAN DEFAULT true,
  allow_friend_requests BOOLEAN DEFAULT true,
  show_online_status BOOLEAN DEFAULT true,
  show_last_login BOOLEAN DEFAULT false,
  block_list JSONB DEFAULT '[]',
  friend_list JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_privacy_settings_user_id ON user_privacy_settings(user_id);

-- User notification preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notify_messages BOOLEAN DEFAULT true,
  notify_alliance BOOLEAN DEFAULT true,
  notify_trades BOOLEAN DEFAULT true,
  notify_battles BOOLEAN DEFAULT true,
  notify_achievements BOOLEAN DEFAULT true,
  notify_events BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  notification_frequency VARCHAR DEFAULT 'real_time',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user_id ON user_notification_preferences(user_id);

-- User session history
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_key VARCHAR UNIQUE NOT NULL,
  ip_address VARCHAR,
  user_agent VARCHAR,
  device_type VARCHAR,
  browser_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_active ON user_sessions(is_active);

-- User rate limiting
CREATE TABLE IF NOT EXISTS user_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id INTEGER NOT NULL,
  requests_per_minute INTEGER NOT NULL DEFAULT 30,
  requests_per_hour INTEGER NOT NULL DEFAULT 1800,
  requests_current_minute INTEGER DEFAULT 0,
  requests_current_hour INTEGER DEFAULT 0,
  reset_minute_at TIMESTAMP,
  reset_hour_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_user_id ON user_rate_limits(user_id);

-- User suspension and violations
CREATE TABLE IF NOT EXISTS user_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  violation_type VARCHAR NOT NULL,
  violation_description TEXT,
  severity VARCHAR,
  admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  action_taken VARCHAR,
  duration_days INTEGER,
  expires_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_violations_user_id ON user_violations(user_id);
CREATE INDEX idx_violations_severity ON user_violations(severity);

-- User account recovery requests
CREATE TABLE IF NOT EXISTS user_recovery_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recovery_token VARCHAR UNIQUE NOT NULL,
  recovery_type VARCHAR NOT NULL,
  ip_address VARCHAR,
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  completed_ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recovery_requests_user_id ON user_recovery_requests(user_id);
CREATE INDEX idx_recovery_requests_token ON user_recovery_requests(recovery_token);

-- User account tier progression
CREATE TABLE IF NOT EXISTS user_tier_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  previous_tier INTEGER,
  new_tier INTEGER NOT NULL,
  promotion_reason VARCHAR,
  promoted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  demoted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  demotion_reason VARCHAR,
  promoted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tier_history_user_id ON user_tier_history(user_id);
CREATE INDEX idx_tier_history_promoted_at ON user_tier_history(promoted_at);

-- User statistics and analytics
CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_playtime_hours REAL DEFAULT 0,
  total_battles REAL DEFAULT 0,
  total_battles_won REAL DEFAULT 0,
  total_trades REAL DEFAULT 0,
  total_resources_earned REAL DEFAULT 0,
  total_resources_spent REAL DEFAULT 0,
  average_session_minutes REAL DEFAULT 0,
  login_streak_days INTEGER DEFAULT 0,
  longest_login_streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_statistics_user_id ON user_statistics(user_id);
