-- Defenses Seed Data
-- 20 planetary and orbital defense systems

INSERT INTO defenses (name, description, category, attack, defense, shield, hull, accuracy, range_au, rapid_fire_against, base_metal_cost, base_crystal_cost, base_deuterium_cost, growth_rate, build_time_sec, required_shipyard_level, is_planetary, is_orbital, anti_fighter, anti_missile, shield_dome) VALUES
('Rocket Launcher', 'Basic unguided explosive rocket. Cheap but weak.', 'rocket_launcher', 80, 20, 20, 2000, 70, 0.3, '{"lightFighter": 5}', 2000, 0, 0, 2.0, 300, 1, true, false, false, false, false),
('Light Laser', 'Standard laser turret for point defense.', 'laser_turret', 100, 25, 25, 2000, 80, 0.5, '{}', 1500, 500, 0, 2.0, 360, 1, true, false, false, false, false),
('Heavy Laser', 'Enhanced laser turret with greater damage output.', 'laser_turret', 250, 100, 100, 8000, 75, 0.8, '{}', 6000, 2000, 0, 2.0, 600, 2, true, false, false, false, false),
('Ion Cannon', 'Cannon that bypasses shields and disables electronics.', 'ion_cannon', 150, 50, 500, 8000, 80, 0.8, '{}', 2000, 6000, 0, 2.0, 900, 3, true, false, false, false, false),
('Gauss Cannon', 'Magnetic accelerator firing heavy slugs at extreme velocity.', 'gauss_cannon', 1100, 200, 200, 35000, 85, 1.5, '{}', 20000, 15000, 2000, 2.0, 1800, 4, true, false, false, false, false),
('Plasma Turret', 'Superheated plasma cannon for heavy orbital defense.', 'plasma_turret', 3000, 300, 300, 100000, 70, 2.0, '{}', 50000, 50000, 30000, 2.0, 3600, 5, true, false, false, false, false),
('Railgun Battery', 'Long-range kinetic battery for anti-capital ship defense.', 'railgun', 2500, 500, 500, 80000, 85, 3.0, '{"battleship": 2, "cruiser": 3}', 40000, 25000, 15000, 2.0, 3000, 5, true, false, false, false, false),
('Missile Silo', 'Underground missile launch facility for interplanetary bombardment.', 'missile_silo', 500, 100, 100, 20000, 50, 5.0, '{}', 25000, 10000, 5000, 2.0, 2400, 4, true, false, false, false, false),
('Anti-Ballistic Missile', 'Interceptor missile designed to shoot down incoming missiles.', 'interceptor_missile', 1, 1, 1, 8000, 95, 1.0, '{}', 8000, 0, 2000, 2.0, 60, 1, true, false, false, true, false),
('Point Defense System', 'Automated tracking system for shooting down fighters and missiles.', 'point_defense', 50, 100, 50, 5000, 95, 0.5, '{"lightFighter": 3, "heavyFighter": 2, "interceptor": 2}', 5000, 2000, 1000, 1.8, 600, 2, true, false, true, true, false),
('Small Shield Dome', 'Planetary shield generator covering small area. Provides fleet protection.', 'shield_dome', 1, 2000, 2000, 20000, 0, 0, '{}', 10000, 10000, 0, 2.0, 1800, 3, true, false, false, false, true),
('Large Shield Dome', 'Planetary shield covering the entire colony. Greatly enhances defense.', 'shield_dome', 1, 10000, 10000, 50000, 0, 0, '{}', 25000, 25000, 0, 2.0, 3600, 5, true, false, false, false, true),
('Orbital Battery', 'Satellite-based weapon platform for orbital defense.', 'orbital_battery', 1500, 200, 200, 60000, 80, 2.5, '{"destroyer": 2, "battleship": 1.5}', 30000, 15000, 10000, 1.8, 2400, 4, false, true, false, false, false),
('Orbital Defense Platform', 'Heavily armed orbital station for system defense.', 'orbital_battery', 5000, 1000, 1000, 200000, 75, 4.0, '{"battleship": 2, "destroyer": 3, "cruiser": 4}', 150000, 80000, 40000, 2.0, 14400, 6, false, true, false, false, false),
('Particle Cannon', 'Accelerates charged particles to near-light speed for devastating effect.', 'particle_cannon', 4000, 500, 500, 150000, 80, 3.5, '{"dreadnought": 2, "battleship": 3}', 80000, 50000, 25000, 2.0, 7200, 6, true, false, false, false, false),
('Quantum Barrier', 'Exotic energy field that phases incoming attacks into another dimension.', 'quantum_barrier', 10, 5000, 10000, 100000, 0, 0, '{}', 100000, 80000, 40000, 2.0, 21600, 7, true, false, false, false, true),
('Minefield', 'Dispersed explosive mines that damage any ship entering orbit.', 'minefield', 1000, 0, 0, 1000, 30, 0.1, '{"all": 0.5}', 5000, 2000, 1000, 1.5, 600, 2, true, false, false, false, false),
('Interceptor Grid', 'Networked interceptor missile launchers providing overlapping coverage.', 'interceptor_missile', 200, 100, 50, 15000, 90, 1.5, '{"missile": 5}', 15000, 8000, 4000, 1.8, 1200, 3, true, false, false, true, false),
('Planetary Shield Generator', 'Full-planet energy shield that can withstand orbital bombardment.', 'planetary_shield', 1, 25000, 50000, 500000, 0, 0, '{}', 200000, 150000, 100000, 2.0, 43200, 8, true, false, false, false, true),
('Defense Satellite Network', 'Constellation of armed satellites providing comprehensive coverage.', 'orbital_battery', 800, 300, 200, 30000, 85, 1.5, '{"lightFighter": 4, "heavyFighter": 3, "bomber": 2}', 25000, 15000, 8000, 1.8, 3600, 4, false, true, true, false, false);

COMMENT ON TABLE defenses IS 'Seed data: 20 planetary and orbital defense systems with combat stats and costs';
