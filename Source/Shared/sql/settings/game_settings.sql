-- Game settings and options
-- This table stores all configurable game settings

CREATE TABLE IF NOT EXISTS game_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    default_value JSONB,
    description TEXT,
    min_value JSONB,
    max_value JSONB,
    editable BOOLEAN DEFAULT TRUE,
    requires_restart BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert game settings
INSERT INTO game_settings (category, key, value, default_value, description, min_value, max_value, editable, requires_restart) VALUES
('tick', 'sched_ticks', '6', '6', 'Minutes between scheduler runs', '1', '60', TRUE, FALSE),
('tick', 'turns_per_tick', '3', '3', 'Turns granted per tick', '1', '10', TRUE, FALSE),
('tick', 'sched_turns', '2', '2', 'New turns rate', '1', '10', TRUE, FALSE),
('tick', 'sched_ports', '1', '1', 'Port production interval', '1', '10', TRUE, FALSE),
('tick', 'sched_planets', '2', '2', 'Planet production interval', '1', '10', TRUE, FALSE),
('tick', 'sched_igb', '2', '2', 'IGB interest interval', '1', '10', TRUE, FALSE),
('tick', 'sched_ranking', '30', '30', 'Ranking generation interval', '1', '60', TRUE, FALSE),
('tick', 'sched_news', '15', '15', 'News generation interval', '1', '60', TRUE, FALSE),
('tick', 'sched_degrade', '6', '6', 'Sector fighter degradation interval', '1', '60', TRUE, FALSE),
('combat', 'rating_combat_factor', '0.8', '0.8', 'Rating gained from combat', '0.1', '2.0', TRUE, FALSE),
('combat', 'mine_hull_size', '2', '2', 'Minimum hull size to hit mines', '1', '10', TRUE, FALSE),
('combat', 'ewd_max_hull_size', '15', '15', 'Max hull size before EWD degrades', '5', '50', TRUE, FALSE),
('combat', 'fed_max_hull', '8', '8', 'Max hull in federation space', '1', '20', TRUE, FALSE),
('combat', 'fed_max_score', '1000000', '1000000', 'Max score in federation space', '100000', '10000000', TRUE, FALSE),
('newbie', 'newbie_nice', 'true', 'true', 'Enable newbie protection', NULL, NULL, TRUE, FALSE),
('newbie', 'newbie_hull', '8', '8', 'Newbie hull threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_engines', '8', '8', 'Newbie engines threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_power', '8', '8', 'Newbie power threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_computer', '8', '8', 'Newbie computer threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_sensors', '8', '8', 'Newbie sensors threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_armor', '8', '8', 'Newbie armor threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_shields', '8', '8', 'Newbie shields threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_beams', '8', '8', 'Newbie beams threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_torp_launchers', '8', '8', 'Newbie torp launchers threshold', '1', '20', TRUE, FALSE),
('newbie', 'newbie_cloak', '8', '8', 'Newbie cloak threshold', '1', '20', TRUE, FALSE),
('features', 'allow_fullscan', 'true', 'true', 'Allow full long range scan', NULL, NULL, TRUE, FALSE),
('features', 'allow_navcomp', 'true', 'true', 'Allow navigation computer', NULL, NULL, TRUE, FALSE),
('features', 'allow_ibank', 'true', 'true', 'Allow intergalactic bank', NULL, NULL, TRUE, FALSE),
('features', 'allow_genesis_destroy', 'true', 'true', 'Allow genesis torp planet destruction', NULL, NULL, TRUE, FALSE),
('server', 'server_closed', 'false', 'false', 'Block logins', NULL, NULL, TRUE, FALSE),
('server', 'account_creation_closed', 'false', 'false', 'Block new account creation', NULL, NULL, TRUE, FALSE);
