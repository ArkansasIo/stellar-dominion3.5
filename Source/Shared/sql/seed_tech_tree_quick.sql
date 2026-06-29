BEGIN;

-- Insert areas
INSERT INTO research_areas (area_key, area_name, description, color) VALUES
('physics', 'Physics Research', 'Fundamental discoveries in energy, particles, and field manipulation', 'blue'),
('society', 'Society Research', 'Advances in biology, military theory, and civilization', 'purple'),
('engineering', 'Engineering Research', 'Industrial improvements and mechanical innovations', 'amber')
ON CONFLICT (area_key) DO NOTHING;

-- Get IDs for inserting subcategories
WITH physics_area AS (SELECT id FROM research_areas WHERE area_key = 'physics'),
     society_area AS (SELECT id FROM research_areas WHERE area_key = 'society'),
     engineering_area AS (SELECT id FROM research_areas WHERE area_key = 'engineering')
INSERT INTO research_subcategories (area_id, category_key, category_name, description) VALUES
((SELECT id FROM physics_area), 'computing', 'Computing', 'Computing technologies and sensors'),
((SELECT id FROM physics_area), 'field_manipulation', 'Field Manipulation', 'Energy production and shield technology'),
((SELECT id FROM physics_area), 'particles', 'Particles', 'Reactor and weapon technology'),
((SELECT id FROM society_area), 'biology', 'Biology', 'Food production and genetic modification'),
((SELECT id FROM society_area), 'military_theory', 'Military Theory', 'Fleet and army improvements'),
((SELECT id FROM society_area), 'new_worlds', 'New Worlds', 'Terraforming and colony development'),
((SELECT id FROM society_area), 'statecraft', 'Statecraft', 'Diplomacy and unity'),
((SELECT id FROM society_area), 'psionics', 'Psionics', 'Exotic psionic technologies'),
((SELECT id FROM engineering_area), 'industry', 'Industry', 'Production and robotics'),
((SELECT id FROM engineering_area), 'materials', 'Materials', 'Armor and strategic resources'),
((SELECT id FROM engineering_area), 'propulsion', 'Propulsion', 'Weapons and thruster technology'),
((SELECT id FROM engineering_area), 'voidcraft', 'Voidcraft', 'Ship hulls and megastructures')
ON CONFLICT (area_id, category_key) DO NOTHING;

COMMIT;
