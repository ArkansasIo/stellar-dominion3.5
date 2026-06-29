-- Research Tree Seed Data
-- 30 technologies across all categories with tier-based progression

INSERT INTO research_tree (name, description, category, tier, max_level, base_metal_cost, base_crystal_cost, base_deuterium_cost, cost_growth_rate, base_time_sec, time_growth_rate, effect_type, effect_base, effect_per_level, technology_age, is_visible, sort_order) VALUES
-- Basic Technologies (Age 1)
('Mining Efficiency', 'Improves metal mining output by 10% per level.', 'mining', 'basic', 20, 200, 100, 50, 1.5, 300, 1.5, 'metal_production_mult', 0, 0.10, 1, true, 1),
('Crystal Optimization', 'Improves crystal mining output by 10% per level.', 'mining', 'basic', 20, 200, 100, 50, 1.5, 300, 1.5, 'crystal_production_mult', 0, 0.10, 1, true, 2),
('Deuterium Processing', 'Improves deuterium production by 10% per level.', 'mining', 'basic', 20, 200, 100, 50, 1.5, 300, 1.5, 'deuterium_production_mult', 0, 0.10, 1, true, 3),
('Energy Technology', 'Improves energy output from all sources by 5% per level.', 'energy', 'basic', 20, 400, 200, 100, 1.5, 600, 1.5, 'energy_production_mult', 0, 0.05, 1, true, 4),
('Combustion Drive', 'Basic propulsion system for small and medium ships. Increases speed by 10% per level.', 'propulsion', 'basic', 20, 400, 200, 100, 2.0, 600, 1.5, 'combustion_speed_mult', 0, 0.10, 1, true, 5),
('Espionage Technology', 'Improves espionage probe range and stealth capabilities.', 'espionage', 'basic', 15, 200, 100, 50, 2.0, 300, 1.5, 'espionage_range', 1, 1, 1, true, 6),
('Computer Technology', 'Increases fleet command capacity and processing speed by 5% per level.', 'computing', 'basic', 20, 200, 400, 200, 2.0, 300, 1.5, 'fleet_slots_mult', 0, 1, 1, true, 7),
('Weapons Technology', 'Increases all weapon attack power by 5% per level.', 'weapons', 'basic', 20, 800, 200, 0, 2.0, 600, 1.5, 'weapon_attack_mult', 0, 0.05, 1, true, 8),
('Shielding Technology', 'Increases shield strength by 5% per level.', 'shield', 'basic', 20, 200, 600, 0, 2.0, 600, 1.5, 'shield_strength_mult', 0, 0.05, 1, true, 9),
('Armor Technology', 'Increases hull armor by 5% per level.', 'armor', 'basic', 20, 800, 200, 0, 2.0, 600, 1.5, 'armor_hull_mult', 0, 0.05, 1, true, 10),

-- Advanced Technologies (Age 2)
('Impulse Drive', 'Advanced propulsion improving medium ship speed by 20% per level.', 'propulsion', 'advanced', 15, 2000, 1000, 500, 2.0, 1800, 1.5, 'impulse_speed_mult', 0, 0.20, 2, true, 11),
('Ion Technology', 'Enables ion cannon production and improves energy weapon damage by 10% per level.', 'weapons', 'advanced', 15, 2000, 4000, 1000, 2.0, 1800, 1.5, 'ion_damage_mult', 0, 0.10, 2, true, 12),
('Plasma Technology', 'Enables plasma turret production and improves heavy weapon damage by 15% per level.', 'weapons', 'advanced', 15, 4000, 2000, 1000, 2.0, 3600, 1.5, 'plasma_damage_mult', 0, 0.15, 2, true, 13),
('Laser Technology', 'Improves laser weapon damage and accuracy by 10% per level.', 'weapons', 'advanced', 15, 2000, 1000, 500, 2.0, 1200, 1.5, 'laser_damage_mult', 0, 0.10, 2, true, 14),
('Hyperspace Technology', 'Foundation for advanced FTL travel. Unlocks exploration missions.', 'propulsion', 'advanced', 10, 10000, 5000, 2500, 2.0, 7200, 1.5, 'hyperspace_range', 0, 1, 2, true, 15),
('Artificial Intelligence', 'Improves automation and reduces building time by 5% per level.', 'artificial_intelligence', 'advanced', 15, 4000, 8000, 4000, 2.0, 7200, 1.8, 'build_time_reduction', 0, 0.05, 2, true, 16),

-- Expert Technologies (Age 3)
('Graviton Technology', 'Enables deathstar construction and gravity weapon research.', 'physics', 'expert', 10, 50000, 25000, 15000, 2.0, 43200, 1.8, 'graviton_damage_mult', 0, 0.25, 3, true, 17),
('Nanotechnology', 'Revolutionary manufacturing technology. Reduces ship build time by 10% per level.', 'engineering', 'expert', 12, 20000, 10000, 5000, 2.0, 21600, 1.8, 'ship_build_time_reduction', 0, 0.10, 3, true, 18),
('Warp Drive', 'Superluminal propulsion for capital ships. Increases speed by 25% per level.', 'propulsion', 'expert', 12, 20000, 10000, 5000, 2.0, 21600, 1.8, 'warp_speed_mult', 0, 0.25, 3, true, 19),
('Cloaking Technology', 'Advanced stealth systems reducing fleet visibility by 10% per level.', 'military', 'expert', 10, 15000, 15000, 10000, 2.0, 14400, 1.8, 'fleet_stealth_mult', 0, 0.10, 3, true, 20),
('Terraforming', 'Improves maximum planet habitability by 5 per level.', 'terraforming', 'expert', 10, 50000, 30000, 15000, 2.0, 43200, 1.8, 'habitability_bonus', 50, 5, 3, true, 21),
('Quantum Computing', 'Exponential research speed improvement. Reduces research time by 10% per level.', 'computing', 'expert', 10, 25000, 15000, 8000, 2.0, 28800, 1.8, 'research_time_reduction', 0, 0.10, 3, true, 22),

-- Master Technologies (Age 4)
('Cybernetics', 'Improves crew efficiency and reduces ship operating costs by 5% per level.', 'cybernetics', 'master', 10, 50000, 30000, 15000, 2.0, 43200, 1.8, 'crew_efficiency_mult', 0, 0.05, 4, true, 23),
('Dark Matter Manipulation', 'Unlocks dark matter extraction and exotic resource processing.', 'dark_matter', 'master', 10, 100000, 50000, 25000, 2.0, 86400, 2.0, 'dark_matter_production', 0, 5, 4, true, 24),
('Megastructure Engineering', 'Enables construction of orbital rings, dyson spheres, and other megastructures.', 'engineering', 'master', 10, 100000, 75000, 50000, 2.0, 86400, 2.0, 'megastructure_build_speed', 0, 0.15, 4, true, 25),
('Quantum Entanglement Communications', 'Instantaneous communication across any distance. Improves coordination.', 'physics', 'master', 10, 50000, 40000, 20000, 2.0, 43200, 1.8, 'communication_range', 0, 2, 4, true, 26),

-- Transcendent Technologies (Age 5+)
('Ancient Technology Analysis', 'Study of precursor artifacts. Unlocks ancient technology tree.', 'ancient_technology', 'transcendent', 8, 500000, 300000, 150000, 2.0, 172800, 2.0, 'ancient_tech_unlock', 0, 1, 5, true, 27),
('Dimensional Physics', 'Understanding of extra-dimensional space. Enables rift technology.', 'physics', 'transcendent', 8, 1000000, 500000, 250000, 2.0, 259200, 2.0, 'dimensional_bonus_mult', 0, 0.30, 6, true, 28),
('Temporal Mechanics', 'Mastery of time itself. Unlocks temporal technologies.', 'physics', 'transcendent', 5, 5000000, 3000000, 1500000, 2.0, 432000, 2.0, 'temporal_bonus_mult', 0, 0.50, 7, true, 29),
('Transcendence', 'The ultimate technology. Elevates civilization to a higher plane of existence.', 'ancient_technology', 'ancient', 3, 50000000, 25000000, 10000000, 3.0, 864000, 2.0, 'transcendence_bonus', 0, 1.0, 8, true, 30);

COMMENT ON TABLE research_tree IS 'Seed data: 30 technologies across 8 technology ages with tier-based progression';
