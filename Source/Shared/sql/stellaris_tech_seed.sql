-- Insert Research Areas
INSERT INTO research_areas (area_key, area_name, description, color) 
VALUES 
  ('physics', 'Physics Research', 'Fundamental discoveries in energy, particles, and field manipulation', 'blue'),
  ('society', 'Society Research', 'Advances in biology, military theory, and civilization', 'purple'),
  ('engineering', 'Engineering Research', 'Industrial improvements and mechanical innovations', 'amber')
ON CONFLICT (area_key) DO NOTHING;

-- Insert Research Subcategories
INSERT INTO research_subcategories (area_id, category_key, category_name, description)
SELECT id, 'computing', 'Computing', 'Computing technologies and sensors' FROM research_areas WHERE area_key = 'physics'
UNION ALL
SELECT id, 'field_manipulation', 'Field Manipulation', 'Energy production and shield technology' FROM research_areas WHERE area_key = 'physics'
UNION ALL
SELECT id, 'particles', 'Particles', 'Reactor and weapon technology' FROM research_areas WHERE area_key = 'physics'
UNION ALL
SELECT id, 'biology', 'Biology', 'Food production and genetic modification' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'military_theory', 'Military Theory', 'Fleet and army improvements' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'new_worlds', 'New Worlds', 'Terraforming and colony development' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'statecraft', 'Statecraft', 'Diplomacy and unity' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'psionics', 'Psionics', 'Exotic psionic technologies' FROM research_areas WHERE area_key = 'society'
UNION ALL
SELECT id, 'industry', 'Industry', 'Production and robotics' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'materials', 'Materials', 'Armor and strategic resources' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'propulsion', 'Propulsion', 'Weapons and thruster technology' FROM research_areas WHERE area_key = 'engineering'
UNION ALL
SELECT id, 'voidcraft', 'Voidcraft', 'Ship hulls and megastructures' FROM research_areas WHERE area_key = 'engineering'
ON CONFLICT DO NOTHING;

-- Physics: Computing
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'basic_research', 'Basic Research', 'Fundamental research methodology', 1, 1800, 
  '{"energy": 50, "research_points": 100}'::jsonb, '{"research_speed": 0.1, "tech_cost_reduction": 0.05}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'computing' LIMIT 1
UNION ALL
SELECT sc.id, 'advanced_sensors', 'Advanced Sensors', 'Improved sensing systems', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"sensor_range": 0.25, "visibility": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'computing' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Physics: Field Manipulation
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'basic_energy', 'Basic Energy', 'Fundamental energy production', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"energy_production": 0.15, "max_energy": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'field_manipulation' LIMIT 1
UNION ALL
SELECT sc.id, 'shields', 'Shield Technology', 'Basic shield systems', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"shield_strength": 0.2, "shield_recharge": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'field_manipulation' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Physics: Particles
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'basic_reactor', 'Basic Reactor', 'Fundamental reactor technology', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"power_output": 0.15, "efficiency": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles' LIMIT 1
UNION ALL
SELECT sc.id, 'laser_weapons', 'Laser Weapons', 'Energy-based weapons', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"energy_damage": 0.2, "range": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles' LIMIT 1
UNION ALL
SELECT sc.id, 'ftl_drive', 'FTL Drive', 'Faster-than-light travel', 3, 7200,
  '{"energy": 300, "research_points": 600}'::jsonb, '{"ftl_speed": 0.3, "jump_range": 0.4}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'particles' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Society: Biology
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'farming', 'Farming', 'Agricultural advancement', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"food_production": 0.15, "efficiency": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'biology' LIMIT 1
UNION ALL
SELECT sc.id, 'genetic_modification', 'Genetic Modification', 'Species enhancement', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"productivity": 0.25, "lifespan": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'biology' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Society: Military Theory
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'fleet_command', 'Fleet Command', 'Improved fleet coordination', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"fleet_limit": 10, "coordination": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'military_theory' LIMIT 1
UNION ALL
SELECT sc.id, 'army_tactics', 'Army Tactics', 'Ground combat improvements', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"army_health": 0.2, "damage": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'military_theory' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Society: New Worlds
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'terraforming', 'Terraforming', 'Planet modification', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"habitability": 0.5, "speed": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'new_worlds' LIMIT 1
UNION ALL
SELECT sc.id, 'colonization', 'Colonization', 'Improved colonization', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"growth": 0.1, "capacity": 5}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'new_worlds' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Society: Statecraft
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'diplomacy', 'Diplomacy', 'Diplomatic relations', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"weight": 0.15, "cooperation": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'statecraft' LIMIT 1
UNION ALL
SELECT sc.id, 'unity', 'Unity', 'Population unity', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"unity_generation": 0.2, "edict": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'statecraft' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Society: Psionics
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'psionic_theory', 'Psionic Theory', 'Introduction to psionics', 3, 7200,
  '{"energy": 300, "research_points": 600}'::jsonb, '{"power": 0.3, "telepathy": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'psionics' LIMIT 1
UNION ALL
SELECT sc.id, 'psionic_mastery', 'Psionic Mastery', 'Advanced abilities', 4, 14400,
  '{"energy": 600, "research_points": 1200}'::jsonb, '{"damage": 0.4, "resistance": 0.5}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'psionics' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Engineering: Industry
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'mining', 'Mining', 'Mineral extraction', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"production": 0.15, "speed": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry' LIMIT 1
UNION ALL
SELECT sc.id, 'robotics', 'Robotics', 'Automated systems', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"prod_speed": 0.25, "efficiency": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry' LIMIT 1
UNION ALL
SELECT sc.id, 'nanofactory', 'Nanofactory', 'Molecular assembly', 4, 14400,
  '{"energy": 600, "research_points": 1200}'::jsonb, '{"construction": 0.5, "cost": -0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'industry' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Engineering: Materials
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'steel_processing', 'Steel Processing', 'Improved alloys', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"armor": 0.1, "integrity": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'materials' LIMIT 1
UNION ALL
SELECT sc.id, 'advanced_armor', 'Advanced Armor', 'Superior plating', 3, 7200,
  '{"energy": 300, "research_points": 600}'::jsonb, '{"armor": 0.4, "reduction": 0.25}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'materials' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Engineering: Propulsion
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'kinetic_weapons', 'Kinetic Weapons', 'Projectile weapons', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"damage": 0.2, "accuracy": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion' LIMIT 1
UNION ALL
SELECT sc.id, 'explosive_weapons', 'Explosive Weapons', 'Area-of-effect', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"damage": 0.25, "radius": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion' LIMIT 1
UNION ALL
SELECT sc.id, 'thrusters', 'Thruster Tech', 'Sublight engines', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"speed": 0.15, "accel": 0.1}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'propulsion' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;

-- Engineering: Voidcraft
INSERT INTO research_technologies (subcategory_id, tech_key, tech_name, description, tier, research_time, cost, bonuses)
SELECT sc.id, 'corvette_hull', 'Corvette Hull', 'Light ship design', 1, 1800,
  '{"energy": 50, "research_points": 100}'::jsonb, '{"capacity": 0.2, "speed": 0.15}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft' LIMIT 1
UNION ALL
SELECT sc.id, 'destroyer_hull', 'Destroyer Hull', 'Medium ship', 2, 3600,
  '{"energy": 150, "research_points": 300}'::jsonb, '{"capacity": 0.3, "durability": 0.2}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft' LIMIT 1
UNION ALL
SELECT sc.id, 'battleship_hull', 'Battleship Hull', 'Heavy ship', 3, 7200,
  '{"energy": 300, "research_points": 600}'::jsonb, '{"capacity": 0.4, "firepower": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft' LIMIT 1
UNION ALL
SELECT sc.id, 'megastructure', 'Megastructure', 'Colossal projects', 4, 14400,
  '{"energy": 600, "research_points": 1200}'::jsonb, '{"time": -0.4, "stability": 0.3}'::jsonb
FROM research_subcategories sc WHERE sc.category_key = 'voidcraft' LIMIT 1
ON CONFLICT (tech_key) DO NOTHING;
