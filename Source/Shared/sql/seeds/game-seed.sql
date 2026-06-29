-- Game Configuration Seed Data - Balance and economy settings

INSERT INTO technology_tree (tech_id, tech_name, description, category, rarity_tier, level, metal_cost, crystal_cost, deuterium_cost, research_time_seconds, bonuses) VALUES
('energyTech', 'Energy Technology', 'Increases energy production and efficiency', 'economy', 1, 1, 200, 100, 50, 3600, '{"energyProduction": 1.1}'),
('laserTech', 'Laser Technology', 'Improves laser weapon effectiveness', 'weapons', 1, 1, 400, 100, 0, 3600, '{"laserDamage": 1.15}'),
('ionTech', 'Ion Technology', 'Enables ion weapon development', 'weapons', 1, 1, 400, 200, 100, 3600, '{"ionDamage": 1.2}'),
('hyperspaceTech', 'Hyperspace Technology', 'Enables faster FTL travel', 'exploration', 2, 1, 1000, 500, 200, 7200, '{"fleetSpeed": 1.3}'),
('plasmaTech', 'Plasma Technology', 'Advanced plasma weapons system', 'weapons', 2, 1, 2000, 1000, 500, 10800, '{"plasmaDamage": 1.5}'),
('combustionDrive', 'Combustion Drive', 'Chemical rocket propulsion', 'exploration', 1, 1, 300, 0, 100, 2400, '{"fleetSpeed": 1.05}'),
('impulseDrive', 'Impulse Drive', 'Ion-based impulse drive', 'exploration', 1, 1, 400, 200, 200, 3600, '{"fleetSpeed": 1.1}'),
('hyperspaceDrive', 'Hyperspace Drive', 'Experimental hyperspace capable engine', 'exploration', 2, 1, 3000, 2000, 1000, 14400, '{"fleetSpeed": 1.5}'),
('espionageTech', 'Espionage Technology', 'Reconnaissance and sabotage capabilities', 'espionage', 1, 1, 500, 250, 100, 5400, '{"espionageAccuracy": 1.2}'),
('computerTech', 'Computer Technology', 'Improves computational power and AI', 'research', 1, 1, 200, 400, 200, 4800, '{"researchSpeed": 1.1}')
ON CONFLICT (tech_id) DO NOTHING;

INSERT INTO achievement_definitions (achievement_id, achievement_name, description, category, difficulty, points_reward, conditions) VALUES
('first_colony', 'First Steps', 'Establish your first colony', 'exploration', 'easy', 10, '{"planetsColonized": 1}'),
('tech_pioneer', 'Technology Pioneer', 'Research 5 different technologies', 'research', 'easy', 25, '{"technologiesResearched": 5}'),
('fleet_builder', 'Fleet Builder', 'Construct 50 ships', 'production', 'medium', 50, '{"shipsBuilt": 50}'),
('empire_master', 'Empire Master', 'Reach Kardashev level 5', 'progression', 'hard', 500, '{"kardashevLevel": 5}'),
('combat_veteran', 'Combat Veteran', 'Win 10 combat engagements', 'combat', 'medium', 75, '{"combatsWon": 10}'),
('diplomat', 'Diplomat', 'Form an alliance with 5 other players', 'diplomacy', 'easy', 40, '{"allianceMembers": 5}'),
('trader', 'Trader', 'Complete 100 market transactions', 'economy', 'medium', 60, '{"marketTransactions": 100}'),
('billionaire', 'Billionaire', 'Accumulate 1 billion resources', 'economy', 'hard', 200, '{"totalResources": 1000000000}'),
('legendary', 'Legendary Commander', 'Reach the highest rankings in multiple categories', 'achievement', 'legendary', 1000, '{"multiCategoryRanking": true}')
ON CONFLICT (achievement_id) DO NOTHING;

INSERT INTO rate_limit_rules (rule_name, endpoint_pattern, max_requests, window_seconds, is_active) VALUES
('auth_limit', '/api/auth/*', 10, 60, true),
('game_state_limit', '/api/game/*', 30, 60, true),
('mission_limit', '/api/missions/*', 20, 60, true),
('market_limit', '/api/market/*', 25, 60, true),
('message_limit', '/api/messages/*', 50, 60, true),
('general_api_limit', '/api/*', 100, 60, true)
ON CONFLICT (rule_name) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_editable) VALUES
('game_version', '0.8.2-beta', 'string', 'Current game version', false),
('universe_seed', '42', 'integer', 'Universe generation seed (deterministic)', false),
('max_players_per_galaxy', '1000', 'integer', 'Maximum players allowed per galaxy', true),
('new_player_resource_bonus', '{"metal": 1000, "crystal": 500, "deuterium": 0}', 'json', 'Initial resources for new players', true),
('attack_preparation_time', '3600', 'integer', 'Time in seconds before attack starts', true),
('maintenance_window_start', '02:00', 'string', 'Daily maintenance start time (UTC)', true),
('maintenance_window_duration', '60', 'integer', 'Maintenance duration in minutes', true),
('tournament_mode_enabled', 'false', 'boolean', 'Enable tournament mode', true),
('hardcore_mode_enabled', 'false', 'boolean', 'Enable hardcore ruleset', true),
('resource_trading_enabled', 'true', 'boolean', 'Allow resource trading between players', true)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_editable) VALUES
('economy_modifier', '1.0', 'string', 'Global economy speed modifier', true),
('combat_balance_version', '1.2.3', 'string', 'Current combat balance patch version', false),
('event_log_retention_days', '90', 'integer', 'Days to retain event logs', true),
('player_inactivity_threshold', '30', 'integer', 'Days before marking player inactive', true),
('database_backup_frequency', 'daily', 'string', 'Frequency of database backups', false),
('enable_player_pvp', 'true', 'boolean', 'Allow player vs player combat', true),
('enable_npc_trading', 'true', 'boolean', 'Enable NPC market trading', true),
('seasonal_reset_enabled', 'false', 'boolean', 'Enable seasonal server resets', true),
('antifreeze_attack_protection', 'true', 'boolean', 'Protect players during offline time', true)
ON CONFLICT (setting_key) DO NOTHING;
