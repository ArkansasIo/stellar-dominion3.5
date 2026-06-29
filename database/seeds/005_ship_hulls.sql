-- Ship Hulls / Fleet Classes Seed Data
-- 30 ship hulls across all roles and tiers with OGame-style stats

INSERT INTO fleet_classes (name, description, role, tier, hull_size, base_attack, base_defense, base_shield, base_hull, base_speed, base_cargo, base_crew, weapon_slots, defense_slots, utility_slots, engineering_slots, required_research_level, required_shipyard_level, required_command_level, metal_cost, crystal_cost, deuterium_cost, build_time_sec, is_fighter, warp_capacity) VALUES
-- Small Combat Ships (Tier 1-3)
('Light Fighter', 'Fast and inexpensive fighter for swarm tactics and anti-fighter screening.', 'combat', 1, 'small', 50, 10, 10, 4000, 12500, 50, 1, 1, 0, 0, 0, 1, 1, 0, 3000, 1000, 0, 600, true, 1),
('Heavy Fighter', 'Up-armored fighter with heavier weapons for escort and strike missions.', 'combat', 1, 'small', 150, 25, 25, 10000, 10000, 100, 1, 2, 1, 0, 0, 2, 2, 1, 6000, 4000, 0, 1200, true, 1),
('Interceptor', 'Ultra-fast fighter designed to intercept bombers and missiles.', 'combat', 2, 'small', 200, 30, 30, 8000, 18000, 50, 1, 2, 1, 0, 0, 3, 3, 2, 8000, 3000, 500, 900, true, 1),
('Bomber', 'Slow but heavily armed ship designed to destroy capital ships and structures.', 'combat', 2, 'medium', 1000, 500, 500, 75000, 5000, 500, 5, 3, 2, 1, 0, 5, 4, 3, 50000, 25000, 15000, 7200, false, 2),

-- Medium Combat Ships (Tier 3-5)
('Corvette', 'Multi-role escort vessel for patrol, anti-piracy, and screening duties.', 'combat', 3, 'medium', 250, 60, 40, 18000, 10000, 200, 8, 3, 2, 1, 1, 4, 4, 3, 15000, 6000, 1000, 3600, false, 2),
('Frigate', 'General-purpose warship balanced for fleet actions and independent operations.', 'combat', 3, 'medium', 400, 100, 80, 30000, 9000, 400, 12, 4, 3, 2, 2, 5, 5, 4, 25000, 10000, 3000, 5400, false, 2),
('Destroyer', 'Anti-capital ship platform with heavy weaponry and advanced targeting systems.', 'combat', 4, 'medium', 2000, 500, 500, 110000, 5000, 2000, 20, 5, 4, 2, 3, 7, 6, 5, 60000, 50000, 15000, 14400, false, 3),
('Cruiser', 'Fast attack ship capable of engaging multiple target types. Backbone of any fleet.', 'combat', 4, 'medium', 400, 150, 50, 27000, 15000, 800, 15, 4, 3, 2, 2, 6, 5, 4, 20000, 7000, 2000, 4800, false, 2),

-- Large Combat Ships (Tier 5-7)
('Battlecruiser', 'Fast capital ship combining cruiser speed with battleship-grade firepower.', 'combat', 5, 'large', 700, 400, 400, 70000, 15000, 750, 25, 5, 4, 3, 3, 8, 7, 6, 30000, 40000, 15000, 10800, false, 3),
('Battleship', 'Heavy capital ship with massive firepower and thick armor. The core of a battle fleet.', 'combat', 5, 'large', 1000, 200, 200, 60000, 10000, 1500, 30, 5, 5, 3, 4, 8, 7, 6, 45000, 15000, 0, 16200, false, 3),
('Dreadnought', 'Ultra-heavy warship designed to destroy planets and engage entire fleets single-handedly.', 'combat', 6, 'huge', 4000, 1500, 1500, 250000, 4000, 5000, 50, 7, 6, 4, 5, 10, 9, 8, 150000, 80000, 40000, 43200, false, 4),
('Carrier', 'Mobile base for fighter wings. Carries and supports up to 50 fighter-class ships.', 'combat', 6, 'huge', 400, 600, 600, 120000, 7000, 20000, 100, 2, 6, 6, 6, 10, 8, 7, 80000, 40000, 20000, 32400, false, 4),

-- Capital Ships (Tier 7-9)
('Titan', 'Flagship-class vessel with enough firepower to devastate entire systems.', 'combat', 7, 'massive', 15000, 8000, 8000, 1000000, 2000, 50000, 200, 8, 8, 6, 7, 12, 10, 10, 500000, 300000, 150000, 86400, false, 5),
('Flagship', 'Advanced command ship with fleet-wide buffs and enhanced sensor suites.', 'combat', 7, 'massive', 8000, 4000, 4000, 500000, 3000, 25000, 150, 7, 7, 7, 7, 12, 10, 9, 300000, 200000, 100000, 64800, false, 5),
('Leviathan', 'Deep-space siege platform that can crack planets and destroy space stations.', 'combat', 8, 'colossal', 25000, 12000, 12000, 2000000, 1000, 10000, 300, 10, 9, 5, 8, 14, 12, 12, 1000000, 600000, 300000, 172800, false, 5),
('Ascended Warship', 'Vessel that partially exists in another dimension. Nearly indestructible.', 'combat', 9, 'colossal', 50000, 25000, 25000, 5000000, 5000, 20000, 500, 12, 10, 8, 10, 18, 15, 15, 5000000, 3000000, 1000000, 432000, false, 6),

-- Transport & Logistics (Tier 1-5)
('Small Cargo', 'Light transport ship for planetary trade and resource moving.', 'transport', 1, 'small', 5, 10, 10, 4000, 5000, 5000, 2, 0, 0, 1, 0, 1, 1, 0, 2000, 2000, 0, 600, false, 1),
('Large Cargo', 'Heavy transport vessel for bulk resource movement between colonies.', 'transport', 2, 'medium', 5, 25, 25, 12000, 7500, 25000, 5, 0, 1, 2, 1, 3, 2, 1, 6000, 6000, 0, 1800, false, 2),
('Colony Ship', 'Specialized vessel for establishing new colonies on habitable worlds.', 'transport', 3, 'medium', 50, 100, 100, 30000, 2500, 7500, 20, 0, 1, 4, 2, 5, 4, 3, 10000, 20000, 10000, 7200, false, 2),

-- Utility & Support (Tier 2-6)
('Recycler', 'Salvage vessel that collects debris from battlefields and converts it to resources.', 'support', 2, 'medium', 1, 10, 10, 16000, 2000, 20000, 5, 0, 0, 3, 1, 3, 3, 2, 10000, 6000, 2000, 3600, false, 2),
('Explorer', 'Long-range scout vessel equipped with advanced sensors for mapping unknown space.', 'exploration', 2, 'small', 10, 50, 50, 15000, 20000, 5000, 5, 0, 1, 4, 2, 4, 3, 2, 8000, 12000, 4000, 2400, false, 2),
('Science Vessel', 'Mobile research platform for studying anomalies and conducting experiments.', 'science', 3, 'medium', 10, 80, 80, 20000, 12000, 2000, 10, 0, 1, 5, 3, 5, 4, 3, 12000, 25000, 8000, 5400, false, 2),
('Repair Ship', 'Support vessel that repairs allied ships during and after combat.', 'support', 3, 'medium', 5, 200, 200, 40000, 6000, 0, 10, 0, 3, 3, 3, 5, 4, 3, 20000, 15000, 10000, 4800, false, 2),
('Hospital Ship', 'Medical vessel that tends to wounded crew and prevents population loss from attacks.', 'support', 3, 'medium', 2, 150, 150, 35000, 5000, 5000, 15, 0, 2, 5, 3, 5, 4, 3, 18000, 20000, 10000, 5400, false, 2),

-- Mining & Resource (Tier 1-4)
('Mining Ship', 'Dedicated asteroid mining vessel with onboard refinery capabilities.', 'mining', 2, 'medium', 5, 50, 50, 25000, 4000, 50000, 5, 0, 1, 4, 2, 3, 3, 2, 10000, 8000, 3000, 3600, false, 2),
('Salvage Ship', 'Advanced salvager that can recover resources from wreckage and debris fields.', 'mining', 3, 'medium', 3, 30, 30, 20000, 5000, 30000, 5, 0, 0, 4, 2, 4, 3, 2, 8000, 10000, 5000, 3000, false, 2),
('Refinery Ship', 'Mobile processing facility that refines raw ore into usable materials.', 'refinery', 4, 'large', 3, 200, 200, 80000, 3000, 10000, 20, 0, 2, 5, 4, 6, 5, 4, 40000, 30000, 15000, 14400, false, 3),

-- Espionage (Tier 2)
('Espionage Probe', 'Tiny stealth probe used for planetary and fleet reconnaissance.', 'espionage', 2, 'small', 0, 0, 0, 1000, 100000000, 5, 0, 0, 0, 1, 0, 2, 1, 1, 0, 1000, 0, 30, false, 0),

-- Command Ships (Tier 6-8)
('Command Ship', 'Fleet coordination vessel with advanced communications and targeting networks.', 'command', 6, 'huge', 500, 1500, 1000, 150000, 6000, 10000, 80, 2, 6, 8, 6, 10, 8, 8, 200000, 100000, 50000, 43200, false, 4),
('Orbital Command', 'Massive orbital command center providing fleet-wide combat bonuses.', 'command', 7, 'massive', 2000, 3000, 2000, 500000, 2000, 5000, 200, 3, 8, 10, 8, 12, 10, 10, 500000, 250000, 100000, 86400, false, 5);

COMMENT ON TABLE fleet_classes IS 'Seed data: 30 ship hulls across combat, transport, support, exploration, science, mining, refinery, espionage, and command roles';
