-- System Configuration Schema - Server settings and maintenance

CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(500),
  setting_type VARCHAR(50), -- 'string', 'integer', 'boolean', 'json'
  description VARCHAR(500),
  is_editable BOOLEAN DEFAULT true,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(36) -- Admin user ID
);

CREATE TABLE IF NOT EXISTS server_status (
  id SERIAL PRIMARY KEY,
  status_type VARCHAR(50), -- 'online', 'maintenance', 'restart', 'degraded'
  message VARCHAR(500),
  severity VARCHAR(20), -- 'info', 'warning', 'critical'
  estimated_duration_minutes INTEGER,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id VARCHAR(36) NOT NULL REFERENCES users(id),
  action VARCHAR(100), -- 'ban_player', 'modify_config', 'restart_server', etc.
  target_entity VARCHAR(100), -- player_id, config_key, etc.
  changes JSONB, -- what was changed
  reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_bans (
  id SERIAL PRIMARY KEY,
  player_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ban_reason VARCHAR(500) NOT NULL,
  ban_type VARCHAR(50), -- 'temporary', 'permanent'
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ban_expires_at TIMESTAMP,
  banned_by VARCHAR(36) NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS server_metrics (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(100),
  metric_value REAL NOT NULL,
  metric_unit VARCHAR(50), -- 'ms', 'bytes', 'percent', 'count'
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tags JSONB -- for categorization
);

CREATE TABLE IF NOT EXISTS database_maintenance_log (
  id SERIAL PRIMARY KEY,
  maintenance_type VARCHAR(50), -- 'backup', 'optimize', 'repair', 'vacuum'
  status VARCHAR(50), -- 'running', 'completed', 'failed'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  error_message VARCHAR(500),
  details JSONB
);

CREATE TABLE IF NOT EXISTS rate_limit_rules (
  id SERIAL PRIMARY KEY,
  rule_name VARCHAR(100) UNIQUE NOT NULL,
  endpoint_pattern VARCHAR(100), -- '/api/game/*'
  max_requests INTEGER,
  window_seconds INTEGER,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  feature_name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500),
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage REAL DEFAULT 100.0, -- for gradual rollout
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(100) UNIQUE NOT NULL,
  task_type VARCHAR(50), -- 'backup', 'cleanup', 'stats_update', etc.
  schedule_expression VARCHAR(100), -- cron format
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS error_tracking (
  id SERIAL PRIMARY KEY,
  error_type VARCHAR(100),
  error_message VARCHAR(500),
  stack_trace TEXT,
  endpoint VARCHAR(255),
  affected_players INTEGER DEFAULT 1,
  first_occurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_occurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  occurrence_count INTEGER DEFAULT 1,
  is_resolved BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  api_key_hash VARCHAR(255) UNIQUE NOT NULL,
  key_name VARCHAR(100),
  owner_id VARCHAR(36) NOT NULL REFERENCES users(id),
  permissions JSONB, -- array of permission strings
  rate_limit INTEGER, -- requests per minute
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_server_status_active ON server_status(is_active);
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_date ON admin_logs(created_at);
CREATE INDEX idx_player_bans_player ON player_bans(player_id);
CREATE INDEX idx_player_bans_active ON player_bans(is_active);
CREATE INDEX idx_server_metrics_recorded ON server_metrics(recorded_at);
CREATE INDEX idx_feature_flags_enabled ON feature_flags(is_enabled);
