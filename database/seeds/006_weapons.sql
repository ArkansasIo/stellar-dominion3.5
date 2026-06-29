-- Weapons Seed Data
-- 25 weapon systems across energy, kinetic, missile, and special categories

INSERT INTO weapons (name, description, category, weapon_type, damage_min, damage_max, range_au, accuracy, rate_of_fire, energy_cost, mass_kg, size_m3, base_metal_cost, base_crystal_cost, base_deuterium_cost, tech_level, slot_size, special_effects) VALUES
-- Energy Weapons
('Pulse Laser', 'Basic directed-energy weapon. Fires rapid pulses of coherent light.', 'energy', 'laser', 15, 25, 0.5, 90, 8, 10, 500, 2, 200, 100, 0, 1, 'small', '{"rapid_fire": false}'),
('Heavy Laser', 'Upgraded laser cannon with enhanced damage and range.', 'energy', 'laser', 50, 75, 1.0, 85, 4, 25, 2000, 5, 1000, 500, 100, 2, 'medium', '{"focus_beam": true}'),
('Ion Cannon', 'Disables ship electronics rather than destroying hull. Effective against shields.', 'energy', 'ion', 30, 50, 0.8, 80, 3, 40, 3000, 8, 2000, 6000, 0, 3, 'medium', '{"shield_damage": 3.0, "emp_effect": 0.3}'),
('Plasma Cannon', 'Fires superheated plasma bolts that melt through armor.', 'energy', 'plasma', 100, 150, 1.2, 75, 2, 80, 5000, 12, 5000, 3000, 1500, 4, 'large', '{"armor_penetration": 0.4}'),
('Tachyon Beam', 'Faster-than-light particle beam with nearly instantaneous target impact.', 'energy', 'particle', 200, 300, 2.0, 95, 1, 150, 8000, 20, 15000, 10000, 5000, 6, 'large', '{"ignores_shields": 0.2, "accurate": true}'),
('Phased Array Cannon', 'Multi-dimensional energy weapon that bypasses conventional defenses.', 'energy', 'phased', 300, 500, 1.5, 70, 1, 200, 12000, 30, 30000, 20000, 10000, 8, 'huge', '{"phase_shift": 0.5, "bypass_shield": 0.3}'),
('Disruptor', 'Energy weapon that disrupts molecular bonds, causing structural collapse.', 'energy', 'disruptor', 150, 250, 1.0, 80, 2, 100, 6000, 15, 10000, 8000, 4000, 5, 'large', '{"hull_damage_bonus": 0.5}'),

-- Kinetic Weapons
('Gauss Cannon', 'Electromagnetic accelerator firing solid metal projectiles at extreme velocity.', 'kinetic', 'gauss', 80, 120, 1.5, 85, 2, 30, 15000, 10, 5000, 3000, 500, 3, 'medium', '{"piercing": 0.3}'),
('Railgun', 'Linear motor drive accelerating projectiles to relativistic speeds.', 'kinetic', 'railgun', 200, 350, 2.5, 80, 1, 100, 25000, 25, 20000, 10000, 3000, 5, 'large', '{"piercing": 0.5, "shield_penetration": 0.4}'),
('Mass Driver', 'High-velocity projectile launcher for orbital bombardment and anti-ship fire.', 'kinetic', 'mass_driver', 400, 600, 3.0, 65, 0.5, 200, 40000, 40, 50000, 20000, 10000, 7, 'huge', '{"planetary_damage": 5.0, "armor_penetration": 0.6}'),
('Autocannon', 'Rapid-fire ballistic weapon for close-range point defense.', 'kinetic', 'autocannon', 10, 20, 0.3, 95, 12, 5, 800, 1, 500, 200, 0, 1, 'small', '{"anti_fighter": 2.0}'),
('Coilgun', 'Medium kinetic weapon using magnetic coils for projectile acceleration.', 'kinetic', 'coilgun', 40, 60, 1.0, 88, 3, 20, 5000, 6, 3000, 1500, 200, 2, 'medium', '{}'),

-- Missile Weapons
('Rocket Launcher', 'Basic unguided rocket system for short-range defense.', 'missile', 'rocket', 60, 100, 0.4, 60, 1, 5, 200, 1, 500, 0, 0, 1, 'small', '{"ammo_use": 1}'),
('Torpedo Launcher', 'Homing torpedo system effective against capital ships.', 'missile', 'torpedo', 200, 400, 2.0, 75, 0.5, 20, 3000, 8, 8000, 4000, 2000, 3, 'medium', '{"homing": 0.8, "capital_ship_damage": 2.0}'),
('Missile Rack', 'Multi-missile launch system for saturation attacks.', 'missile', 'missile', 100, 200, 1.5, 70, 2, 15, 4000, 10, 5000, 3000, 1500, 4, 'medium', '{"area_effect": 0.3, "ammo_use": 4}'),
('Nuclear Missile', 'Tactical nuclear warhead for maximum destructive effect.', 'missile', 'nuclear', 500, 1000, 3.0, 50, 0.25, 50, 8000, 15, 20000, 10000, 5000, 6, 'large', '{"area_effect": 0.8, "radiation": 0.5}'),
('Quantum Torpedo', 'Torpedo that exists in superposition until detonation, bypassing point defense.', 'missile', 'quantum', 800, 1500, 4.0, 90, 0.1, 100, 10000, 20, 50000, 30000, 15000, 8, 'huge', '{"bypass_point_defense": 0.8, "phase_shift": 0.6}'),

-- Point Defense & CIWS
('Point Defense Laser', 'Automated tracking laser for shooting down incoming missiles and fighters.', 'point_defense', 'pdl', 5, 15, 0.2, 98, 20, 3, 300, 1, 500, 250, 0, 1, 'small', '{"anti_missile": 3.0, "anti_fighter": 2.0}'),
('Flak Cannon', 'Airburst artillery that fills space with shrapnel.', 'point_defense', 'flak', 20, 40, 0.5, 85, 4, 8, 2000, 4, 1500, 800, 200, 2, 'small', '{"anti_fighter": 3.0, "area_effect": 0.5}'),
('Interceptor System', 'Automated defense system that launches interceptor drones.', 'point_defense', 'interceptor', 30, 50, 0.8, 90, 6, 20, 5000, 8, 5000, 3000, 1000, 4, 'medium', '{"anti_missile": 4.0, "drone_count": 6}'),

-- Heavy / Siege Weapons
('Planetary Cannon', 'Massive ground-based cannon capable of hitting orbital targets.', 'siege', 'planetary', 1000, 2000, 5.0, 70, 0.2, 300, 100000, 100, 50000, 30000, 15000, 7, 'huge', '{"orbital_damage": 3.0, "planetary_defense": true}'),
('Beam Cannon', 'Focused energy beam that can slice through capital ship armor.', 'siege', 'beam', 500, 800, 2.5, 85, 0.5, 180, 15000, 25, 25000, 15000, 8000, 6, 'huge', '{"sustained_fire": true, "armor_penetration": 0.7}'),

-- Special Weapons
('Tractor Beam', 'Gravity-based weapon that locks onto and immobilizes enemy ships.', 'special', 'tractor', 0, 0, 1.0, 100, 1, 50, 5000, 10, 10000, 8000, 4000, 4, 'medium', '{"immobilize": 0.7, "no_damage": true}'),
('EMP Cannon', 'Electromagnetic pulse weapon that disables electronics temporarily.', 'special', 'emp', 5, 10, 0.8, 85, 1, 100, 4000, 8, 8000, 5000, 2000, 3, 'medium', '{"emp_duration": 30, "shield_damage": 5.0}'),
('Nullifier', 'Exotic weapon that creates a localized area of null space, annihilating matter.', 'special', 'null', 2000, 5000, 1.0, 40, 0.1, 500, 20000, 50, 100000, 80000, 40000, 9, 'huge', '{"annihilate": 0.1, "area_effect": 1.0, "rare": true}');

COMMENT ON TABLE weapons IS 'Seed data: 25 weapon systems across energy, kinetic, missile, point defense, siege, and special categories';
