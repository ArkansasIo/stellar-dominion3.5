-- Seed Research Areas
INSERT INTO research_areas (area_key, area_name, description, color) VALUES
('physics', 'Physics Research', 'Fundamental discoveries in energy, particles, and field manipulation', 'blue'),
('society', 'Society Research', 'Advances in biology, military theory, and civilization', 'purple'),
('engineering', 'Engineering Research', 'Industrial improvements and mechanical innovations', 'amber');

-- Physics Subcategories
INSERT INTO research_subcategories (area_id, category_key, category_name, description) 
SELECT id, 'computing', 'Computing', 'Computing technologies and sensors' FROM research_areas WHERE area_key = 'physics'
UNION ALL
SELECT id, 'field_manipulation', 'Field Manipulation', 'Energy production and shield technology' FROM research_areas WHERE area_key = 'physics'
UNION ALL
SELECT id, 'particles', 'Particles', 'Reactor and weapon technology' FROM research_areas WHERE area_key = 'physics';

-- Society Subcategories
INSERT INTO research_subcategories (area_id, category_key, category_name, description)
SELECT id, 'biology', 'Biology', 'Food production and genetic modification' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'military_theory', 'Military Theory', 'Fleet and army improvements' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'new_worlds', 'New Worlds', 'Terraforming and colony development' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'statecraft', 'Statecraft', 'Diplomacy and unity' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'psionics', 'Psionics', 'Exotic psionic technologies' FROM research_areas WHERE area_key = 'society';

-- Engineering Subcategories
INSERT INTO research_subcategories (area_id, category_key, category_name, description)
SELECT id, 'industry', 'Industry', 'Production and robotics' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'materials', 'Materials', 'Armor and strategic resources' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'propulsion', 'Propulsion', 'Weapons and thruster technology' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'voidcraft', 'Voidcraft', 'Ship hulls and megastructures' FROM research_areas WHERE area_key = 'engineering';

-- Physics: Computing Technologies
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'basic_research',
  'Basic Research',
  'Fundamental research methodology',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"research_speed": 0.1, "all_tech_cost_reduction": 0.05}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'computing'
UNION ALL
SELECT 
  sc.id,
  'advanced_sensors',
  'Advanced Sensors',
  'Improved sensing and detection systems',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["basic_research"]'::jsonb,
  '{"sensor_range": 0.25, "fleet_visibility": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'computing'
UNION ALL
SELECT 
  sc.id,
  'espionage_tech',
  'Espionage Technology',
  'Advanced intelligence gathering',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '["advanced_sensors"]'::jsonb,
  '{"spy_network_size": 0.3, "espionage_power": 0.4, "counterintelligence": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'computing';

-- Physics: Field Manipulation
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'basic_energy',
  'Basic Energy',
  'Fundamental energy production',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"energy_production": 0.15, "max_energy": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'field_manipulation'
UNION ALL
SELECT 
  sc.id,
  'shields',
  'Shield Technology',
  'Basic shield systems for ships',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["basic_energy"]'::jsonb,
  '{"shield_strength": 0.2, "shield_recharge": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'field_manipulation'
UNION ALL
SELECT 
  sc.id,
  'cloaking',
  'Cloaking Devices',
  'Advanced cloaking technology',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '["shields"]'::jsonb,
  '{"cloaking_power": 0.3, "fleet_evasion": 0.25}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'field_manipulation';

-- Physics: Particles
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'basic_reactor',
  'Basic Reactor',
  'Fundamental reactor technology',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"power_output": 0.15, "reactor_efficiency": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles'
UNION ALL
SELECT 
  sc.id,
  'laser_weapons',
  'Laser Weapons',
  'Energy-based weapons',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["basic_reactor"]'::jsonb,
  '{"energy_weapon_damage": 0.2, "weapon_range": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles'
UNION ALL
SELECT 
  sc.id,
  'ftl_drive',
  'FTL Drive',
  'Faster-than-light travel technology',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '["basic_reactor"]'::jsonb,
  '{"ftl_speed": 0.3, "jump_range": 0.4}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles';

-- Society: Biology
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'farming',
  'Farming',
  'Agricultural advancement',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"food_production": 0.15, "farming_efficiency": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'biology'
UNION ALL
SELECT 
  sc.id,
  'genetic_modification',
  'Genetic Modification',
  'Species enhancement technology',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["farming"]'::jsonb,
  '{"species_productivity": 0.25, "lifespan_extension": 0.2, "genetic_traits": 3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'biology';

-- Society: Military Theory
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'fleet_command',
  'Fleet Command',
  'Improved fleet coordination',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"fleet_command_limit": 10, "fleet_coordination": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'military_theory'
UNION ALL
SELECT 
  sc.id,
  'army_tactics',
  'Army Tactics',
  'Ground combat improvements',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["fleet_command"]'::jsonb,
  '{"army_health": 0.2, "army_damage": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'military_theory';

-- Society: New Worlds
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'terraforming',
  'Terraforming',
  'Planet modification technology',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '[]'::jsonb,
  '{"habitability_modification": 0.5, "terraforming_speed": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'new_worlds'
UNION ALL
SELECT 
  sc.id,
  'colony_development',
  'Colony Development',
  'Improved colonization',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"colony_population_growth": 0.1, "colony_capacity": 5}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'new_worlds';

-- Society: Statecraft
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'diplomacy',
  'Diplomacy',
  'Diplomatic relations improvement',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"diplomatic_weight": 0.15, "alliance_cooperation": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'statecraft'
UNION ALL
SELECT 
  sc.id,
  'unity_focus',
  'Unity Focus',
  'Improved population unity',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["diplomacy"]'::jsonb,
  '{"unity_generation": 0.2, "edict_effectiveness": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'statecraft';

-- Society: Psionics
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'psionic_theory',
  'Psionic Theory',
  'Introduction to psionic power',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '[]'::jsonb,
  '{"psionic_power": 0.3, "telepathy_range": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'psionics'
UNION ALL
SELECT 
  sc.id,
  'psionic_mastery',
  'Psionic Mastery',
  'Advanced psionic abilities',
  4,
  14400,
  '{"energy": 600, "research_points": 1200}'::jsonb,
  '["psionic_theory"]'::jsonb,
  '{"psionic_damage": 0.4, "mind_control_resistance": 0.5}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'psionics';

-- Engineering: Industry
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'mining',
  'Mining',
  'Mineral extraction improvement',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"mineral_production": 0.15, "mining_speed": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry'
UNION ALL
SELECT 
  sc.id,
  'robotics',
  'Robotics',
  'Automated production systems',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["mining"]'::jsonb,
  '{"production_speed": 0.25, "robot_worker_efficiency": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry'
UNION ALL
SELECT 
  sc.id,
  'nanofactory',
  'Nanofactory',
  'Molecular assembly technology',
  4,
  14400,
  '{"energy": 600, "research_points": 1200}'::jsonb,
  '["robotics"]'::jsonb,
  '{"construction_speed": 0.5, "building_cost_reduction": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry';

-- Engineering: Materials
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'steel_processing',
  'Steel Processing',
  'Improved metal alloys',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"armor_strength": 0.1, "hull_integrity": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'materials'
UNION ALL
SELECT 
  sc.id,
  'advanced_armor',
  'Advanced Armor',
  'Superior armor plating',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '["steel_processing"]'::jsonb,
  '{"armor_strength": 0.4, "damage_reduction": 0.25}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'materials';

-- Engineering: Propulsion
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'kinetic_weapons',
  'Kinetic Weapons',
  'Projectile-based weapons',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '[]'::jsonb,
  '{"kinetic_weapon_damage": 0.2, "weapon_accuracy": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion'
UNION ALL
SELECT 
  sc.id,
  'explosive_weapons',
  'Explosive Weapons',
  'Area-of-effect weapons',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '[]'::jsonb,
  '{"explosive_damage": 0.25, "aoe_radius": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion'
UNION ALL
SELECT 
  sc.id,
  'thruster_tech',
  'Thruster Technology',
  'Improved sublight engines',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"sublight_speed": 0.15, "acceleration": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion';

-- Engineering: Voidcraft
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, prerequisites, bonuses)
SELECT 
  sc.id,
  'corvette_hull',
  'Corvette Hull',
  'Light ship design',
  1,
  1800,
  '{"energy": 50, "research_points": 100}'::jsonb,
  '[]'::jsonb,
  '{"corvette_capacity": 0.2, "corvette_speed": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft'
UNION ALL
SELECT 
  sc.id,
  'destroyer_hull',
  'Destroyer Hull',
  'Medium ship design',
  2,
  3600,
  '{"energy": 150, "research_points": 300}'::jsonb,
  '["corvette_hull"]'::jsonb,
  '{"destroyer_capacity": 0.3, "destroyer_durability": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft'
UNION ALL
SELECT 
  sc.id,
  'battleship_hull',
  'Battleship Hull',
  'Heavy ship design',
  3,
  7200,
  '{"energy": 300, "research_points": 600}'::jsonb,
  '["destroyer_hull"]'::jsonb,
  '{"battleship_capacity": 0.4, "battleship_firepower": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft'
UNION ALL
SELECT 
  sc.id,
  'megastructure',
  'Megastructure Engineering',
  'Colossal engineering projects',
  4,
  14400,
  '{"energy": 600, "research_points": 1200}'::jsonb,
  '["battleship_hull"]'::jsonb,
  '{"megastructure_build_time": -0.4, "megastructure_stability": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft';
