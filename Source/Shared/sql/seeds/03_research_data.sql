-- Research seed data

-- Insert research subcategories
INSERT INTO research_subcategories (area_id, name, description) VALUES
((SELECT id FROM research_areas WHERE name = 'Energy Technology'), 'Fusion Power', 'Advanced fusion reactors'),
((SELECT id FROM research_areas WHERE name = 'Energy Technology'), 'Solar Collection', 'Solar energy harvesting'),
((SELECT id FROM research_areas WHERE name = 'Laser Technology'), 'Beam Weapons', 'Directed laser weapons'),
((SELECT id FROM research_areas WHERE name = 'Laser Technology'), 'Pulse Lasers', 'Pulsed laser systems'),
((SELECT id FROM research_areas WHERE name = 'Ion Technology'), 'Ion Engines', 'Ion propulsion drives'),
((SELECT id FROM research_areas WHERE name = 'Ion Technology'), 'Ion Cannons', 'Ion-based weapons'),
((SELECT id FROM research_areas WHERE name = 'Hyperspace Technology'), 'Warp Gates', 'Hyperspace jump gates'),
((SELECT id FROM research_areas WHERE name = 'Hyperspace Technology'), 'Fold Drives', 'Space-folding engines'),
((SELECT id FROM research_areas WHERE name = 'Plasma Technology'), 'Plasma Weapons', 'Plasma-based armaments'),
((SELECT id FROM research_areas WHERE name = 'Plasma Technology'), 'Plasma Shields', 'Plasma containment shields'),
((SELECT id FROM research_areas WHERE name = 'Computer Technology'), 'AI Cores', 'Artificial intelligence'),
((SELECT id FROM research_areas WHERE name = 'Computer Technology'), 'Quantum Computing', 'Quantum processors'),
((SELECT id FROM research_areas WHERE name = 'Weapons Technology'), 'Projectile Weapons', 'Kinetic projectiles'),
((SELECT id FROM research_areas WHERE name = 'Weapons Technology'), 'Energy Weapons', 'Energy-based weapons'),
((SELECT id FROM research_areas WHERE name = 'Shielding Technology'), 'Energy Shields', 'Defensive barriers'),
((SELECT id FROM research_areas WHERE name = 'Shielding Technology'), 'Armor Plating', 'Physical armor'),
((SELECT id FROM research_areas WHERE name = 'Armour Technology'), 'Composite Armor', 'Advanced composites'),
((SELECT id FROM research_areas WHERE name = 'Armour Technology'), 'Regenerative Armor', 'Self-repairing armor');

-- Insert research technologies
INSERT INTO research_technologies (subcategory_id, name, description, level, cost, effects, prerequisites) VALUES
((SELECT id FROM research_subcategories WHERE name = 'Fusion Power'), 'Fusion Reactor I', 'Basic fusion power generation', 1, '{"metal": 1000, "crystal": 500, "deuterium": 200}', '[{"power": 100}]', '[]'),
((SELECT id FROM research_subcategories WHERE name = 'Fusion Power'), 'Fusion Reactor II', 'Advanced fusion power', 2, '{"metal": 5000, "crystal": 2500, "deuterium": 1000}', '[{"power": 250}]', '["Fusion Reactor I"]'),
((SELECT id FROM research_subcategories WHERE name = 'Solar Collection'), 'Solar Array I', 'Basic solar collection', 1, '{"metal": 500, "crystal": 1000, "deuterium": 100}', '[{"power": 50}]', '[]'),
((SELECT id FROM research_subcategories WHERE name = 'Solar Collection'), 'Solar Array II', 'Advanced solar collection', 2, '{"metal": 2500, "crystal": 5000, "deuterium": 500}', '[{"power": 150}]', '["Solar Array I"]'),
((SELECT id FROM research_subcategories WHERE name = 'Beam Weapons'), 'Laser Cannon I', 'Basic laser weapon', 1, '{"metal": 800, "crystal": 1200, "deuterium": 300}', '[{"damage": 25}]', '[]'),
((SELECT id FROM research_subcategories WHERE name = 'Beam Weapons'), 'Laser Cannon II', 'Advanced laser weapon', 2, '{"metal": 4000, "crystal": 6000, "deuterium": 1500}', '[{"damage": 75}]', '["Laser Cannon I"]'),
((SELECT id FROM research_subcategories WHERE name = 'Ion Engines'), 'Ion Drive I', 'Basic ion propulsion', 1, '{"metal": 600, "crystal": 400, "deuterium": 800}', '[{"speed": 10}]', '[]'),
((SELECT id FROM research_subcategories WHERE name = 'Ion Engines'), 'Ion Drive II', 'Advanced ion propulsion', 2, '{"metal": 3000, "crystal": 2000, "deuterium": 4000}', '[{"speed": 25}]', '["Ion Drive I"]'),
((SELECT id FROM research_subcategories WHERE name = 'Warp Gates'), 'Warp Gate I', 'Basic warp gate', 1, '{"metal": 2000, "crystal": 3000, "deuterium": 5000}', '[{"range": 100}]', '[]'),
((SELECT id FROM research_subcategories WHERE name = 'Warp Gates'), 'Warp Gate II', 'Advanced warp gate', 2, '{"metal": 10000, "crystal": 15000, "deuterium": 25000}', '[{"range": 500}]', '["Warp Gate I"]');
