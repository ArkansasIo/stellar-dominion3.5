-- Universe Seed Data - Initial galaxy and celestial object configuration

INSERT INTO galaxies (galaxy_id, name, star_count) VALUES
(1, 'Nexus-Alpha', 500),
(2, 'Omega-Sector', 400),
(3, 'Vortex-Prime', 350)
ON CONFLICT DO NOTHING;

-- Star type distribution:
-- O (1%) - massive, hot, short-lived
-- B (3%) - large, hot
-- A (7%) - hot, white
-- F (11%) - yellow-white
-- G (12%) - yellow, sun-like (includes Earth)
-- K (15%) - orange
-- M (51%) - red, small (most common)
-- N, H - rare

-- Star classes:
-- I - Supergiant/Hypergiant
-- II - Bright giant
-- III - Giant
-- IV - Subgiant
-- V - Main sequence (dwarf)

INSERT INTO resource_costs (item_type, item_id, item_name, metal_cost, crystal_cost, deuterium_cost, energy_cost, build_time_seconds) VALUES
-- Buildings
('building', 'metalMine', 'Metal Mine', 60, 15, 5, 0, 30),
('building', 'crystalMine', 'Crystal Mine', 48, 24, 10, 0, 30),
('building', 'deuteriumSynthesizer', 'Deuterium Synthesizer', 225, 75, 30, 0, 30),
('building', 'solarPlant', 'Solar Plant', 75, 30, 0, 0, 30),
('building', 'roboticsFactory', 'Robotics Factory', 400, 120, 200, 0, 120),
('building', 'shipyard', 'Shipyard', 400, 200, 100, 0, 120),
('building', 'researchLab', 'Research Lab', 200, 400, 200, 0, 120),
-- Combat units
('unit', 'lightFighter', 'Light Fighter', 3000, 1000, 400, 0, 10),
('unit', 'heavyFighter', 'Heavy Fighter', 6000, 4000, 1000, 0, 30),
('unit', 'cruiser', 'Cruiser', 20000, 7000, 2000, 0, 60),
('unit', 'battleship', 'Battleship', 45000, 15000, 4000, 0, 120),
('unit', 'smallCargo', 'Small Cargo', 2000, 2000, 500, 0, 15),
('unit', 'largeCargo', 'Large Cargo', 6000, 6000, 1000, 0, 30),
('unit', 'colonyShip', 'Colony Ship', 10000, 20000, 1000, 0, 45)
ON CONFLICT (item_type, item_id) DO NOTHING;

INSERT INTO building_info (building_id, building_name, building_type, base_production, production_type, level_multiplier) VALUES
('metalMine', 'Metal Mine', 'resource', 30, 'metal', 1.1),
('crystalMine', 'Crystal Mine', 'resource', 20, 'crystal', 1.1),
('deuteriumSynthesizer', 'Deuterium Synthesizer', 'resource', 10, 'deuterium', 1.1),
('solarPlant', 'Solar Plant', 'resource', 50, 'energy', 1.1),
('roboticsFactory', 'Robotics Factory', 'production', 0, 'production_boost', 1.15),
('shipyard', 'Shipyard', 'production', 0, 'build_speed', 1.15),
('researchLab', 'Research Lab', 'research', 0, 'research_speed', 1.15)
ON CONFLICT (building_id) DO NOTHING;

INSERT INTO combat_balance (unit_type, unit_class, attack_power, defense_power, shield_points, armor_points, hull_points, speed, cargo_capacity, evasion) VALUES
('lightFighter', 'fighter', 50, 40, 500, 100, 200, 14, 0, 10.0),
('heavyFighter', 'fighter', 75, 60, 1000, 200, 500, 10, 0, 8.0),
('cruiser', 'capital', 250, 150, 3000, 500, 2000, 8, 500, 5.0),
('battleship', 'capital', 500, 250, 6000, 1000, 5000, 5, 1000, 3.0),
('smallCargo', 'cargo', 5, 5, 100, 50, 100, 12, 5000, 15.0),
('largeCargo', 'cargo', 10, 10, 200, 100, 200, 10, 25000, 15.0),
('colonyShip', 'utility', 1, 1, 50, 50, 50, 5, 10000, 20.0)
ON CONFLICT (unit_type) DO NOTHING;

INSERT INTO weapon_types (weapon_id, weapon_name, damage_output, weapon_type, fire_rate) VALUES
('laser', 'Laser Cannon', 100, 'laser', 1.0),
('ion', 'Ion Cannon', 120, 'ion', 0.8),
('railgun', 'Railgun', 150, 'railgun', 0.6),
('plasma', 'Plasma Beam', 200, 'plasma', 0.4),
('missile', 'Missile System', 80, 'missile', 1.2)
ON CONFLICT (weapon_id) DO NOTHING;

INSERT INTO armor_types (armor_id, armor_name, durability, weight) VALUES
('standard', 'Standard Armor', 100, 1000),
('reinforced', 'Reinforced Armor', 150, 1500),
('ceramic', 'Ceramic Plating', 120, 800),
('composite', 'Composite Armor', 180, 1200),
('quantum', 'Quantum Shielding', 250, 1800)
ON CONFLICT (armor_id) DO NOTHING;

INSERT INTO game_config (config_key, config_value, category) VALUES
('economySpeed', '1', 'speed'),
('fleetSpeed', '1', 'speed'),
('researchSpeed', '1', 'speed'),
('buildingSpeed', '1', 'speed'),
('maxActiveMissions', '100', 'limits'),
('maxPlayers', '10000', 'limits'),
('sessionTimeout', '604800000', 'auth'),
('maintenanceMode', 'false', 'system'),
('pvpEnabled', 'true', 'features'),
('alliancesEnabled', 'true', 'features'),
('marketEnabled', 'true', 'features')
ON CONFLICT (config_key) DO NOTHING;

INSERT INTO feature_flags (feature_name, description, is_enabled, rollout_percentage) VALUES
('realtime_updates', 'Real-time battle updates and notifications', true, 100.0),
('advanced_analytics', 'Advanced player analytics dashboard', false, 0.0),
('spectator_mode', 'Ability to spectate battles', false, 50.0),
('guild_wars', 'Guild-wide warfare mechanics', false, 75.0),
('seasonal_events', 'Limited-time seasonal content', true, 100.0)
ON CONFLICT (feature_name) DO NOTHING;
