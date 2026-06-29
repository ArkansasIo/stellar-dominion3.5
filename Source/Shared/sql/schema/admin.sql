-- Admin System Schema
-- Tables for administrative control, logging, and configuration

-- Admin ranks (organizational hierarchy)
CREATE TABLE IF NOT EXISTS admin_ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rank_key VARCHAR UNIQUE NOT NULL,
  rank_name VARCHAR NOT NULL,
  rank_title VARCHAR NOT NULL,
  permission_level INTEGER NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  inherits_from_level INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_ranks_level ON admin_ranks(permission_level);
CREATE INDEX idx_admin_ranks_active ON admin_ranks(is_active);

-- Admin departments
CREATE TABLE IF NOT EXISTS admin_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_key VARCHAR UNIQUE NOT NULL,
  department_name VARCHAR NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  department_head_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_departments_key ON admin_departments(department_key);

-- Admin users with ranks and permissions
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  rank_id UUID NOT NULL REFERENCES admin_ranks(id),
  department_id UUID REFERENCES admin_departments(id) ON DELETE SET NULL,
  role VARCHAR NOT NULL DEFAULT 'moderator',
  permissions JSONB NOT NULL DEFAULT '[]',
  custom_permissions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  join_date TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP,
  notes TEXT,
  created_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_users_rank ON admin_users(rank_id);
CREATE INDEX idx_admin_users_department ON admin_users(department_id);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

-- Admin action logs (audit trail)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  target_user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  details JSONB,
  ip_address VARCHAR,
  status VARCHAR DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);

-- Player bans and sanctions
CREATE TABLE IF NOT EXISTS player_sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  sanction_type VARCHAR NOT NULL,
  reason VARCHAR NOT NULL,
  ban_duration_days INTEGER,
  is_permanent BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  lifted_at TIMESTAMP,
  lifted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sanctions_user_id ON player_sanctions(user_id);
CREATE INDEX idx_sanctions_expires_at ON player_sanctions(expires_at);
CREATE INDEX idx_sanctions_active ON player_sanctions(lifted_at) WHERE lifted_at IS NULL;

-- System configuration and settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description VARCHAR,
  modified_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

-- Server events and announcements
CREATE TABLE IF NOT EXISTS server_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  event_start TIMESTAMP NOT NULL,
  event_end TIMESTAMP,
  reward_multiplier REAL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_active ON server_events(is_active);
CREATE INDEX idx_events_dates ON server_events(event_start, event_end);

-- Server announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR DEFAULT 'normal',
  is_active BOOLEAN DEFAULT true,
  created_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_announcements_active ON announcements(is_active);

-- System health and monitoring
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR NOT NULL,
  metric_value REAL NOT NULL,
  additional_data JSONB,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metrics_type ON system_metrics(metric_type);
CREATE INDEX idx_metrics_recorded_at ON system_metrics(recorded_at);

-- Database backups log
CREATE TABLE IF NOT EXISTS backup_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR NOT NULL,
  backup_size_mb REAL,
  backup_location VARCHAR,
  backup_type VARCHAR,
  status VARCHAR DEFAULT 'pending',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_backup_status ON backup_log(status);
CREATE INDEX idx_backup_created_at ON backup_log(created_at);

-- Economy adjustments and modifications
CREATE TABLE IF NOT EXISTS economy_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_type VARCHAR NOT NULL,
  multiplier REAL NOT NULL DEFAULT 1.0,
  target VARCHAR,
  reason VARCHAR,
  applied_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_adjustments_active ON economy_adjustments(active);
CREATE INDEX idx_adjustments_type ON economy_adjustments(adjustment_type);

-- Support tickets system
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR DEFAULT 'open',
  priority VARCHAR DEFAULT 'normal',
  assigned_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  response_text TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned_admin ON support_tickets(assigned_admin_id);

-- Admin team members with assignment tracking
CREATE TABLE IF NOT EXISTS admin_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_id UUID NOT NULL REFERENCES admin_ranks(id),
  department_id UUID REFERENCES admin_departments(id) ON DELETE SET NULL,
  status VARCHAR DEFAULT 'active',
  assignment_date TIMESTAMP DEFAULT NOW(),
  promoted_at TIMESTAMP,
  promoted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  performance_rating INTEGER,
  performance_notes TEXT,
  suspension_until TIMESTAMP,
  suspension_reason VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_team_members_admin ON admin_team_members(admin_id);
CREATE INDEX idx_team_members_rank ON admin_team_members(rank_id);
CREATE INDEX idx_team_members_department ON admin_team_members(department_id);
CREATE INDEX idx_team_members_status ON admin_team_members(status);

-- Admin access control and permissions matrix
CREATE TABLE IF NOT EXISTS admin_permissions_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rank_id UUID NOT NULL REFERENCES admin_ranks(id),
  permission VARCHAR NOT NULL,
  allowed BOOLEAN DEFAULT true,
  restrictions JSONB,
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_rank ON admin_permissions_matrix(rank_id);
CREATE INDEX idx_permissions_name ON admin_permissions_matrix(permission);
CREATE UNIQUE INDEX idx_permissions_rank_perm ON admin_permissions_matrix(rank_id, permission);

-- Admin action audit trail (detailed logging)
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_id UUID REFERENCES admin_ranks(id),
  action_category VARCHAR NOT NULL,
  action_type VARCHAR NOT NULL,
  target_user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR,
  description TEXT,
  changes_made JSONB,
  result VARCHAR,
  error_message TEXT,
  ip_address VARCHAR,
  user_agent VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_category ON admin_audit_log(action_category);
CREATE INDEX idx_audit_timestamp ON admin_audit_log(created_at);
CREATE INDEX idx_audit_target ON admin_audit_log(target_user_id);

-- ========== USER PERMISSION SYSTEM ==========

-- User tiers/levels
CREATE TABLE IF NOT EXISTS user_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_key VARCHAR UNIQUE NOT NULL,
  tier_name VARCHAR NOT NULL,
  tier_level INTEGER NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  restrictions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_tiers_level ON user_tiers(tier_level);
CREATE INDEX idx_user_tiers_active ON user_tiers(is_active);

-- User account status and restrictions
CREATE TABLE IF NOT EXISTS user_account_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'active',
  tier_id UUID NOT NULL REFERENCES user_tiers(id),
  permissions JSONB NOT NULL DEFAULT '[]',
  restrictions JSONB NOT NULL DEFAULT '{}',
  flags JSONB DEFAULT '{}',
  last_status_change TIMESTAMP,
  status_reason VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_status_status ON user_account_status(status);
CREATE INDEX idx_user_status_tier ON user_account_status(tier_id);

-- User badges and achievements
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key VARCHAR NOT NULL,
  badge_name VARCHAR NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_badges_user ON user_badges(user_id);
CREATE INDEX idx_badges_key ON user_badges(badge_key);

-- User permissions matrix (granular control)
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR NOT NULL,
  allowed BOOLEAN DEFAULT true,
  granted_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  reason VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_permissions_name ON user_permissions(permission);
CREATE INDEX idx_permissions_expires ON user_permissions(expires_at);
CREATE UNIQUE INDEX idx_permissions_user_perm ON user_permissions(user_id, permission);

-- User restrictions and cooldowns
CREATE TABLE IF NOT EXISTS user_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restriction_type VARCHAR NOT NULL,
  reason VARCHAR NOT NULL,
  severity VARCHAR DEFAULT 'warning',
  imposed_by_admin_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  imposed_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  auto_lift BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restrictions_user ON user_restrictions(user_id);
CREATE INDEX idx_restrictions_type ON user_restrictions(restriction_type);
CREATE INDEX idx_restrictions_active ON user_restrictions(expires_at) WHERE expires_at IS NULL;

-- User activity log (for tracking behavior and progression)
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR NOT NULL,
  activity_data JSONB,
  ip_address VARCHAR,
  user_agent VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_activity_type ON user_activity_log(activity_type);
CREATE INDEX idx_activity_timestamp ON user_activity_log(created_at);

-- User rate limits and cooldowns
CREATE TABLE IF NOT EXISTS user_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  limit_type VARCHAR NOT NULL,
  count INTEGER DEFAULT 0,
  reset_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_user ON user_rate_limits(user_id);
CREATE INDEX idx_rate_limits_type ON user_rate_limits(limit_type);
CREATE INDEX idx_rate_limits_reset ON user_rate_limits(reset_at);
