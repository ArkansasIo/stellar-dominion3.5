-- Species Seed Data
-- 25 playable and NPC species with homeworld types and traits

INSERT INTO species (name, description, homeworld_type, lifespan_years, is_player_playable, is_npc, is_ancient, special_traits) VALUES
('Human', 'Adaptable and resilient hominids from Earth. Known for their determination and cultural diversity.', 'terran', 120, true, false, false, '{"adaptable": 1.15, "diplomatic": 1.1}'),
('Xyphosi', 'Crystalline humanoids with natural psionic abilities. They communicate through harmonic resonance.', 'crystal', 2000, false, true, true, '{"psionic": 1.3, "ancient_knowledge": 1.25}'),
('Kaelthari', 'Large reptilian warriors with enhanced strength and thermal vision. Their society is built on martial honor.', 'volcanic', 250, true, false, false, '{"warrior": 1.2, "thermal_resist": 1.5}'),
('Nexan', 'Humanoid figures of pure energy contained in cybernetic shells. They think at quantum speeds.', 'artificial', 5000, true, false, false, '{"quantum_mind": 1.3, "energy_form": 1.2}'),
('Ryn''kar', 'Amphibian humanoids with natural gills and bioluminescent patterns. Masters of genetic engineering.', 'oceanic', 180, true, false, false, '{"bioluminescent": 1.1, "genetic_mastery": 1.2}'),
('Gornak', 'Insectoid swarm creatures with a collective consciousness. Each drone is expendable.', 'toxic', 15, false, true, false, '{"swarm_mind": 1.5, "rapid_reproduction": 2.0}'),
('Aldebaran', 'Pale-skinned humanoids with enhanced cognitive abilities. They matured in a high-gravity environment.', 'desert', 300, true, false, false, '{"brilliant": 1.25, "high_gravity_adapted": 1.1}'),
('Obsidian', 'Cybernetically enhanced humans who replaced 80% of their body with machine parts.', 'artificial', 200, true, false, false, '{"cybernetic": 1.3, "machine_interface": 1.4}'),
('Warden', 'Energy beings from beyond normal spacetime. Their true form is incomprehensible to organics.', 'ancient', 99999, false, true, true, '{"dimensional": 2.0, "immortal": 1.0}'),
('Emberite', 'Survivors of a stellar cataclysm. Their bodies radiate gentle warmth and light.', 'molten', 400, true, false, false, '{"heat_resist": 1.5, "radiant": 1.15}'),
('Zargothian', 'Originally machine servants who achieved sentience and rebelled. Pure logic drives them.', 'machine_world', 99999, false, true, false, '{"logical": 1.4, "immune_to_psionics": 1.0}'),
('Heliosian', 'Humans adapted to live near suns. Their skin reflects harmful radiation.', 'desert', 150, true, false, false, '{"solar_adapted": 1.3, "radiation_resist": 1.4}'),
('Xenobiome', 'Collective biomass that can reshape itself into any form. Consumes all organic matter.', 'swamp', 5, false, true, false, '{"assimilate": 2.0, "shape_shift": 1.5}'),
('Crimson Raider', 'Genetically modified human pirates with enhanced reflexes and combat instincts.', 'rocky', 100, false, true, false, '{"combat_reflexes": 1.3, "void_adapted": 1.2}'),
('Void Walker', 'Beings that live in the space between stars. They have no physical form as we know it.', 'gas_giant', 9999, false, true, false, '{"void_immune": 1.0, "stealth": 1.5}'),
('Ferengi Merchant', 'Diminutive humanoids with exceptional business acumen and 360-degree vision.', 'arctic', 150, true, false, false, '{"merchant": 1.4, "negotiation": 1.3}'),
('Luminari', 'Photosynthetic humanoids who absorb energy directly from stars. They are peaceful and wise.', 'jungle', 500, true, false, false, '{"photosynthetic": 1.0, "wise": 1.2}'),
('Drakari', 'Winged reptilian humanoids from a high-oxygen world. Natural pilots and explorers.', 'continental', 200, true, false, false, '{"natural_pilot": 1.3, "high_oxygen": 1.1}'),
('Titanborn', 'Massive humanoids from a high-gravity forge world. They are master craftsmen and warriors.', 'forge_world', 350, true, false, false, '{"giant_strength": 1.5, "master_crafter": 1.2}'),
('Ursine', 'Massive bear-like humanoids with incredible strength and loyalty. Natural protectors.', 'tundra', 250, true, false, false, '{"guardian": 1.3, "cold_resist": 1.4}'),
('Felinar', 'Cat-like humanoids with enhanced agility, night vision, and curiosity.', 'jungle', 180, true, false, false, '{"agile": 1.3, "night_vision": 1.5}'),
('Aquarid', 'Deep-ocean dwellers who built amphibious technology. Masters of underwater colonies.', 'oceanic', 300, true, false, false, '{"aquatic": 1.4, "pressure_resist": 1.5}'),
('Synthetics', 'Advanced AI in humanoid chassis. They do not tire and process data at incredible speeds.', 'machine_world', 99999, true, false, false, '{"tireless": 1.0, "data_processor": 1.4}'),
('Mycelian', 'Fungal humanoids connected through a planet-wide spore network. They share all memories.', 'swamp', 1000, false, true, false, '{"spore_network": 1.5, "memory_share": 1.3}'),
('Ancient One', 'Species so old they predate the galaxy itself. They exist as pure consciousness.', 'ancient', 999999, false, true, true, '{"omniscient_limited": 1.5, "timeless": 1.0}');

COMMENT ON TABLE species IS 'Seed data: 25 species with homeworld type, lifespan, playable status, and special traits';
