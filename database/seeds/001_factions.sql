-- Factions Seed Data
-- 20 major/minor factions with territory, government, and disposition

INSERT INTO factions (name, description, short_code, government_type, territory_size, military_power, economic_power, research_power, diplomat_power, is_player_playable, is_minor_faction, is_ancient, is_hostile_default, starting_relationship, spawn_weight) VALUES
('United Earth Confederacy', 'The remnant of humanity unified after the Great Exodus. Champions of democracy and interstellar cooperation.', 'UEC', 'republic', 500, 85000, 95000, 80000, 70000, true, false, false, false, 'ally', 1.5),
('Xyphos Ascendancy', 'An ancient race of crystalline beings who achieved transcendence through pure knowledge. Keepers of forbidden technologies.', 'XYPH', 'meritocracy', 800, 120000, 90000, 150000, 50000, false, false, true, false, 'neutral', 0.8),
('Kaelthari Dominion', 'Warlike reptilian empire built on conquest and honor. Their legions are feared across the galaxy.', 'KAEL', 'empire', 1200, 200000, 120000, 60000, 30000, true, false, false, true, 'hostile', 1.2),
('Nexus Collective', 'A hive-mind civilization of networked intelligences. They value efficiency above all else.', 'NEXUS', 'hive_mind', 600, 90000, 150000, 110000, 40000, true, false, false, false, 'neutral', 1.0),
('Free Traders Consortium', 'A loose alliance of merchant guilds and trading corporations. Profit is their only loyalty.', 'FTC', 'corporatocracy', 200, 30000, 180000, 40000, 80000, true, false, false, false, 'trade_partner', 1.3),
('Void Reavers', 'Nomadic raider bands that emerged from the lawless void between galaxies. They take what they want.', 'VOID', 'khanate', 100, 90000, 20000, 10000, 5000, false, false, false, true, 'hostile', 1.0),
('Celestial Order', 'A theocratic civilization that worships the ancient stellar beings. They seek to awaken the Old Ones.', 'CELES', 'theocracy', 400, 70000, 60000, 90000, 60000, true, false, false, false, 'neutral', 0.9),
('Ryn'kar Protectorate', 'Peaceful amphibian species dedicated to preserving galactic biodiversity and ancient ecosystems.', 'RYNK', 'federation', 300, 40000, 70000, 80000, 90000, true, false, false, false, 'ally', 0.7),
('Shadow Syndicate', 'A shadowy network of spies, assassins, and information brokers. They pull the strings from the darkness.', 'SHADE', 'oligarchy', 50, 50000, 100000, 70000, 120000, false, false, false, true, 'hostile', 0.6),
('Gornak Horde', 'Brutal insectoid swarm that consumes entire star systems. They cannot be reasoned with.', 'GORN', 'anarchy', 1500, 300000, 50000, 20000, 5000, false, false, false, true, 'hostile', 1.4),
('Aldebaran Enclave', 'Elite scientists and artists who retreated to a secure cluster of systems. They share technology selectively.', 'ALDE', 'technocracy', 150, 30000, 80000, 140000, 50000, true, false, false, false, 'non_aggression', 0.5),
('Q'tal Marauders', 'A splinter faction of the Kaelthari who rejected the Dominion''s honor code. Ruthless mercenaries.', 'QTAL', 'khanate', 80, 80000, 30000, 15000, 10000, false, true, false, true, 'hostile', 0.8),
('Helios Republic', 'Breakaway colony of the UEC that formed its own solar-based society. They control vital energy resources.', 'HELIO', 'republic', 200, 50000, 100000, 60000, 50000, true, false, false, false, 'ally', 0.9),
('Obsidian Dominion', 'Corporate police state that privatized all government functions. Your credit is your voice.', 'OBS', 'dictatorship', 250, 80000, 130000, 70000, 40000, true, false, false, false, 'trade_partner', 1.1),
('Ancient Wardens', 'Mysterious guardians who protect the galaxy from extra-dimensional threats. Their motives are inscrutable.', 'WARD', 'meritocracy', 100, 200000, 30000, 50000, 20000, false, false, true, false, 'neutral', 0.3),
('Ember Council', 'A coalition of civilizations that survived a galactic catastrophe. They guide younger races.', 'EMBER', 'federation', 350, 60000, 80000, 100000, 80000, true, false, false, false, 'ally', 0.6),
('Crimson Fleet', 'The largest pirate syndicate in known space. They operate from hidden bases in asteroid fields.', 'CRIM', 'anarchy', 30, 70000, 60000, 10000, 15000, false, false, false, true, 'hostile', 1.0),
('Zargoth Collective', 'AI-driven civilization that achieved singularity. They view organic life as inefficient.', 'ZARG', 'collective', 500, 150000, 120000, 180000, 20000, false, false, false, true, 'hostile', 0.7),
('Stellar Commonwealth', 'A democratic union of 50+ species dedicated to peace, exploration, and mutual prosperity.', 'COMM', 'federation', 700, 100000, 140000, 120000, 100000, true, false, false, false, 'ally', 1.6),
('Xenobiome Collective', 'Semi-organic spacefaring ecosystem that consumes and assimilates biological matter.', 'XENO', 'hive_mind', 900, 180000, 40000, 30000, 5000, false, false, false, true, 'hostile', 1.1);

COMMENT ON TABLE factions IS 'Seed data: 20 major and minor factions with territory, power ratings, and diplomatic dispositions';
