-- Auto-update timestamp triggers for universe-empire-domions

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to player_states table
DROP TRIGGER IF EXISTS trigger_player_states_updated_at ON player_states;
CREATE TRIGGER trigger_player_states_updated_at
    BEFORE UPDATE ON player_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to player_profiles table
DROP TRIGGER IF EXISTS trigger_player_profiles_updated_at ON player_profiles;
CREATE TRIGGER trigger_player_profiles_updated_at
    BEFORE UPDATE ON player_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to player_options table
DROP TRIGGER IF EXISTS trigger_player_options_updated_at ON player_options;
CREATE TRIGGER trigger_player_options_updated_at
    BEFORE UPDATE ON player_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to system_settings table
DROP TRIGGER IF EXISTS trigger_system_settings_updated_at ON system_settings;
CREATE TRIGGER trigger_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to game_settings table
DROP TRIGGER IF EXISTS trigger_game_settings_updated_at ON game_settings;
CREATE TRIGGER trigger_game_settings_updated_at
    BEFORE UPDATE ON game_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log player activity
CREATE OR REPLACE FUNCTION log_player_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO player_activity_log (player_id, action, details, timestamp)
    VALUES (NEW.player_id, TG_OP, row_to_json(NEW), CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Activity log table
CREATE TABLE IF NOT EXISTS player_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES users(id),
    action VARCHAR(50),
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_player_activity_player_id ON player_activity_log(player_id);
CREATE INDEX IF NOT EXISTS idx_player_activity_timestamp ON player_activity_log(timestamp);
