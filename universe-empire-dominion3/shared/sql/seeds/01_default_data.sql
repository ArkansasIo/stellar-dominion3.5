-- Default seed data for universe-empire-domions

-- Insert default research areas
INSERT INTO research_areas (name, description, category, icon) VALUES
('Energy Technology', 'Power generation and efficiency research', 'engineering', 'zap'),
('Laser Technology', 'Directed energy weapons research', 'military', 'crosshair'),
('Ion Technology', 'Ion-based propulsion and weapons', 'military', 'wind'),
('Hyperspace Technology', 'Faster-than-light travel research', 'exploration', 'orbit'),
('Plasma Technology', 'Plasma containment and weapons', 'military', 'flame'),
('Combustion Drive', 'Chemical propulsion systems', 'engineering', 'rocket'),
('Impulse Drive', 'Advanced impulse engines', 'engineering', 'turbine'),
('Hyperspace Drive', 'Hyperspace navigation engines', 'engineering', 'atom'),
('Espionage Technology', 'Intelligence and surveillance tech', 'covert', 'eye'),
('Computer Technology', 'Computing and AI systems', 'science', 'cpu'),
('Astrophysics', 'Study of celestial bodies', 'science', 'telescope'),
('Intergalactic Research Network', 'Multi-lab research coordination', 'science', 'network'),
('Graviton Technology', 'Gravity manipulation research', 'advanced', 'magnet'),
('Weapons Technology', 'Offensive systems research', 'military', 'sword'),
('Shielding Technology', 'Defensive energy barriers', 'military', 'shield'),
('Armour Technology', 'Hull and material reinforcement', 'military', 'layers'),
('AI Technology', 'Artificial intelligence systems', 'science', 'bot'),
('Quantum Technology', 'Quantum mechanics applications', 'advanced', 'atom');

-- Insert default achievements
INSERT INTO achievements (name, description, category, requirement, reward, icon) VALUES
('First Steps', 'Complete the empire setup', 'progression', '{"setupComplete": true}', '{"xp": 100}', 'footprints'),
('Miner', 'Build your first metal mine', 'economy', '{"building": "metalMine", "level": 1}', '{"metal": 500}', 'pickaxe'),
('Researcher', 'Complete your first research', 'science', '{"researchesCompleted": 1}', '{"xp": 200}', 'flask'),
('Fleet Commander', 'Build your first 10 ships', 'military', '{"units": {"total": 10}}', '{"crystal": 300}', 'ship'),
('Diplomat', 'Join an alliance', 'social', '{"alliance": true}', '{"credits": 1000}', 'handshake'),
('Explorer', 'Visit 5 different planets', 'exploration', '{"planetsVisited": 5}', '{"deuterium": 200}', 'compass'),
('Trader', 'Complete your first market trade', 'economy', '{"trades": 1}', '{"credits": 500}', 'scale'),
('Victor', 'Win your first battle', 'military', '{"battlesWon": 1}', '{"xp": 500}', 'trophy');

-- Insert default empire difficulties
INSERT INTO empire_difficulties (name, description, modifier) VALUES
('Easy', 'Relaxed gameplay with bonuses', '{"resourceMultiplier": 1.5, "enemyStrength": 0.5, "turnRate": 2}'),
('Normal', 'Standard gameplay experience', '{"resourceMultiplier": 1.0, "enemyStrength": 1.0, "turnRate": 1}'),
('Hard', 'Challenging gameplay with penalties', '{"resourceMultiplier": 0.8, "enemyStrength": 1.5, "turnRate": 1}'),
('Extreme', 'Maximum challenge for veterans', '{"resourceMultiplier": 0.5, "enemyStrength": 2.0, "turnRate": 0.5}');

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('game_speed', '1', 'Global game speed multiplier'),
('maintenance_mode', 'false', 'Whether the server is in maintenance'),
('max_players', '1000', 'Maximum number of concurrent players'),
('tick_rate', '6', 'Server tick rate in minutes'),
('version', '"Alpha 1.5.0"', 'Current game version'),
('universe_name', '"Nexus-Alpha"', 'Current universe name'),
('newbie_protection_days', '7', 'Days of newbie protection'),
('inactive_timeout_days', '30', 'Days before inactive players are archived');
