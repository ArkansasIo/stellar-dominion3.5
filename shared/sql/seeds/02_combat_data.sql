-- Combat and military seed data

-- Insert default NPC factions
INSERT INTO npc_factions (name, description, alignment, strength, territory, color) VALUES
('Pirate King', 'Ruthless space pirates', 'hostile', 1000, 'Sector 7-9', '#FF0000'),
('Federation', 'Peaceful trading federation', 'friendly', 5000, 'Sector 1-100', '#0000FF'),
('Xenobe Collective', 'Alien hive mind', 'neutral', 3000, 'Sector 200-300', '#00FF00'),
('Merchant Guild', 'Trading consortium', 'friendly', 2000, 'Sector 50-150', '#FFD700'),
('Mercenary Corps', 'Hired guns', 'neutral', 1500, 'Sector 400-500', '#808080');

-- Insert default NPC vendors
INSERT INTO npc_vendors (name, type, location, inventory, prices, refresh_rate) VALUES
('Port Alpha', 'resource', '1:1:1', '{"metal": 10000, "crystal": 5000, "deuterium": 2000}', '{"metal": 11, "crystal": 15, "deuterium": 3}', 60),
('Port Beta', 'resource', '1:2:5', '{"metal": 8000, "crystal": 6000, "deuterium": 3000}', '{"metal": 12, "crystal": 14, "deuterium": 3}', 60),
('Shipyard Omega', 'ship', '1:1:10', '{"lightFighter": 50, "heavyFighter": 20, "cruiser": 10}', '{"lightFighter": 1000, "heavyFighter": 5000, "cruiser": 20000}', 120),
('Tech Market', 'equipment', '1:3:1', '{"shieldGenerator": 10, "laserCannon": 15, "plasmaRifle": 20}', '{"shieldGenerator": 50000, "laserCannon": 75000, "plasmaRifle": 100000}', 180);

-- Insert default universe events
INSERT INTO universe_events (name, description, type, duration, effects, start_time, end_time) VALUES
('Solar Flare', 'Increased energy production in all sectors', 'positive', 360, '{"energy_multiplier": 2.0}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '6 hours'),
('Asteroid Storm', 'Mining sectors under threat', 'negative', 720, '{"mining_rate": 0.5}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '12 hours'),
('Trade Festival', 'All trade prices improved', 'positive', 1440, '{"trade_bonus": 1.25}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours'),
('Pirate Raid', 'Pirate attacks increased', 'negative', 480, '{"pirate_strength": 1.5}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours');

-- Insert default universe bosses
INSERT INTO universe_bosses (name, description, level, health, max_health, damage, defense, location, rewards, spawn_rate) VALUES
('Dreadnought Alpha', 'Ancient warship', 50, 1000000, 1000000, 50000, 10000, '5:5:5', '{"xp": 100000, "credits": 500000, "artifacts": ["dreadnought_core"]}', 0.01),
('Hive Queen', 'Xenobe leader', 40, 750000, 750000, 35000, 8000, '8:8:8', '{"xp": 75000, "credits": 300000, "artifacts": ["hive_essence"]}', 0.02),
('Pirate Overlord', 'Pirate king', 30, 500000, 500000, 25000, 5000, '3:3:3', '{"xp": 50000, "credits": 200000, "artifacts": ["pirate_crown"]}', 0.03);
