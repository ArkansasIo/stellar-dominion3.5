-- Player options and preferences table

CREATE TABLE IF NOT EXISTS player_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- UI preferences
    theme VARCHAR(50) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    music_enabled BOOLEAN DEFAULT TRUE,
    sound_volume INTEGER DEFAULT 50,
    music_volume INTEGER DEFAULT 30,
    
    -- Gameplay preferences
    auto_save BOOLEAN DEFAULT TRUE,
    auto_save_interval INTEGER DEFAULT 5,
    combat_animations BOOLEAN DEFAULT TRUE,
    show_tooltips BOOLEAN DEFAULT TRUE,
    confirm_destructive_actions BOOLEAN DEFAULT TRUE,
    compact_mode BOOLEAN DEFAULT FALSE,
    
    -- Display preferences
    show_coordinates BOOLEAN DEFAULT TRUE,
    show_fleet_strength BOOLEAN DEFAULT TRUE,
    show_resource_rates BOOLEAN DEFAULT TRUE,
    show_building_levels BOOLEAN DEFAULT TRUE,
    show_research_progress BOOLEAN DEFAULT TRUE,
    
    -- Notification preferences
    notify_mission_complete BOOLEAN DEFAULT TRUE,
    notify_research_complete BOOLEAN DEFAULT TRUE,
    notify_building_complete BOOLEAN DEFAULT TRUE,
    notify_combat_report BOOLEAN DEFAULT TRUE,
    notify_trade_complete BOOLEAN DEFAULT TRUE,
    notify_alliance_message BOOLEAN DEFAULT TRUE,
    notify_system_message BOOLEAN DEFAULT TRUE,
    
    -- Accessibility
    reduced_motion BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    large_text BOOLEAN DEFAULT FALSE,
    screen_reader_hints BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- Default player options for new users
CREATE OR REPLACE FUNCTION create_default_player_options()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO player_options (player_id) VALUES (NEW.id)
    ON CONFLICT (player_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_player_options ON users;
CREATE TRIGGER trigger_create_player_options
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_player_options();
