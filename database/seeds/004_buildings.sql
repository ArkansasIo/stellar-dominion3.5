-- Buildings Seed Data
-- 40 buildings across all categories with OGame-style cost scaling

INSERT INTO buildings (name, description, category, short_code, max_level, is_unique, base_metal_cost, base_crystal_cost, base_deuterium_cost, growth_rate, base_time_sec, time_growth_rate, base_production, production_growth, base_storage, storage_growth, energy_production, energy_consumption, energy_growth, tier, can_deconstruct) VALUES
-- Resource Buildings
('Metal Mine', 'Extracts metal ore from planetary crust. Higher levels unlock deeper veins.', 'resource', 'metal_mine', 999, false, 60, 15, 0, 1.5, 60, 1.5, 30, 1.1, 0, 0, 0, 10, 1.1, 1, true),
('Crystal Mine', 'Mines silicon and rare crystals from underground deposits.', 'resource', 'crystal_mine', 999, false, 48, 24, 0, 1.6, 80, 1.5, 15, 1.1, 0, 0, 0, 10, 1.1, 1, true),
('Deuterium Synthesizer', 'Extracts deuterium from water or gas giants using electrolysis.', 'resource', 'deut_synth', 999, false, 120, 60, 20, 1.5, 120, 1.5, 10, 1.1, 0, 0, 0, 20, 1.1, 1, true),
('Solar Plant', 'Converts stellar radiation into electrical energy.', 'resource', 'solar_plant', 999, false, 75, 30, 0, 1.5, 40, 1.4, 0, 0, 0, 0, 20, 0, 1.5, 1, true),
('Fusion Reactor', 'Generates power through controlled deuterium fusion.', 'resource', 'fusion_reactor', 999, false, 400, 200, 100, 1.8, 300, 1.6, 0, 0, 0, 0, 50, 0, 1.8, 2, true),

-- Production Buildings
('Robot Factory', 'Produces construction and mining robots to speed up building.', 'production', 'robot_factory', 20, false, 400, 200, 100, 2.0, 200, 1.5, 0, 0, 0, 0, 0, 50, 1.1, 1, true),
('Shipyard', 'Assembly facility for starships and orbital defenses.', 'production', 'shipyard', 20, false, 800, 400, 200, 2.0, 400, 1.5, 0, 0, 0, 0, 0, 100, 1.1, 1, true),
('Nanite Factory', 'Advanced nanite-based construction facility that drastically speeds up production.', 'production', 'nanite_factory', 15, true, 200000, 100000, 50000, 2.0, 3600, 1.8, 0, 0, 0, 0, 0, 500, 1.1, 4, false),
('Assembly Plant', 'Mass production facility for standardized components.', 'production', 'assembly_plant', 20, false, 2000, 1000, 500, 1.8, 600, 1.5, 0, 0, 0, 0, 0, 100, 1.1, 2, true),
('Construction Yard', 'Orbital construction facility for megastructures and space stations.', 'production', 'construction_yard', 15, false, 5000, 3000, 1000, 2.0, 1800, 1.5, 0, 0, 0, 0, 0, 200, 1.1, 3, false),

-- Research Buildings
('Research Lab', 'Scientific facility where new technologies are researched and developed.', 'research', 'research_lab', 20, false, 400, 200, 100, 2.0, 200, 1.5, 0, 0, 0, 0, 0, 50, 1.1, 1, true),
('Quantum Lab', 'Advanced laboratory for quantum mechanics and dimensional research.', 'research', 'quantum_lab', 15, false, 5000, 3000, 1500, 2.0, 1200, 1.5, 0, 0, 0, 0, 0, 200, 1.1, 3, false),
('Xenobiology Center', 'Research facility dedicated to studying alien lifeforms and genetics.', 'research', 'xenobio', 15, false, 3000, 2000, 1000, 1.8, 900, 1.5, 0, 0, 0, 0, 0, 150, 1.1, 2, false),
('Academy', 'Training facility for commanders and crew members.', 'research', 'academy', 20, false, 2000, 1000, 500, 1.8, 600, 1.5, 0, 0, 0, 0, 0, 100, 1.1, 2, false),
('Archive of Antiquity', 'Ancient data vault containing lost knowledge of precursor civilizations.', 'research', 'archive', 10, true, 50000, 30000, 15000, 2.0, 7200, 1.8, 0, 0, 0, 0, 0, 500, 1.1, 5, false),

-- Military Buildings
('Military Base', 'Planetary garrison that houses ground forces and defensive coordination.', 'military', 'mil_base', 20, false, 1000, 500, 200, 1.8, 300, 1.5, 0, 0, 0, 0, 0, 80, 1.1, 1, true),
('Orbital Defense Platform', 'Orbital weapons platform for planetary defense.', 'military', 'orbital_defense', 15, false, 8000, 4000, 2000, 1.8, 2400, 1.5, 0, 0, 0, 0, 0, 300, 1.1, 3, false),
('War Academy', 'Elite training ground for fleet commanders and tactical officers.', 'military', 'war_academy', 15, false, 3000, 1500, 750, 1.8, 900, 1.5, 0, 0, 0, 0, 0, 120, 1.1, 2, true),
('Naval Yard', 'Specialized shipyard for capital ship construction and maintenance.', 'military', 'naval_yard', 15, false, 10000, 5000, 3000, 2.0, 3600, 1.5, 0, 0, 0, 0, 0, 400, 1.1, 3, false),
('Missile Silo', 'Underground facility housing interplanetary missiles.', 'military', 'missile_silo', 15, false, 20000, 10000, 5000, 2.0, 3600, 1.5, 0, 0, 0, 0, 0, 200, 1.1, 3, false),

-- Storage Buildings
('Metal Storage', 'Warehouse facility for bulk metal ore storage.', 'storage', 'metal_storage', 20, false, 200, 100, 0, 2.0, 60, 1.5, 0, 0, 10000, 2.0, 0, 5, 1.0, 1, true),
('Crystal Storage', 'Climate-controlled facility for crystal storage.', 'storage', 'crystal_storage', 20, false, 200, 100, 0, 2.0, 60, 1.5, 0, 0, 10000, 2.0, 0, 5, 1.0, 1, true),
('Deuterium Tank', 'Reinforced cryo-tanks for deuterium storage.', 'storage', 'deut_storage', 20, false, 200, 100, 0, 2.0, 60, 1.5, 0, 0, 10000, 2.0, 0, 5, 1.0, 1, true),
('Underground Vault', 'Secure underground facility for valuable resources.', 'storage', 'underground_vault', 15, false, 5000, 2500, 1000, 2.0, 1800, 1.5, 0, 0, 100000, 2.0, 0, 50, 1.0, 3, false),

-- Infrastructure Buildings
('Spaceport', 'Orbital elevator and spaceport for interplanetary trade and travel.', 'infrastructure', 'spaceport', 15, false, 2000, 1000, 500, 1.8, 600, 1.5, 0, 0, 0, 0, 0, 100, 1.1, 2, false),
('Terraforming Station', 'Facility that slowly transforms planetary environments for better habitability.', 'infrastructure', 'terraformer', 20, false, 50000, 25000, 15000, 2.0, 7200, 1.8, 0, 0, 0, 0, 0, 1000, 1.1, 4, false),
('Life Support Complex', 'Advanced life support systems managing atmosphere, water, and food production.', 'infrastructure', 'life_support', 15, false, 1500, 750, 300, 1.6, 300, 1.4, 0, 0, 0, 0, 0, 100, 1.1, 1, true),
('Transport Hub', 'Central hub for planetary transit and cargo logistics.', 'infrastructure', 'transport_hub', 15, false, 1000, 500, 200, 1.6, 300, 1.4, 0, 0, 0, 0, 0, 50, 1.1, 1, true),

-- Civilian Buildings
('Residential Complex', 'Housing for planetary population. Increases maximum population.', 'civilian', 'residential', 20, false, 500, 250, 50, 1.5, 120, 1.4, 0, 0, 0, 0, 0, 20, 1.1, 1, true),
('Entertainment Plaza', 'Recreation and cultural facilities that boost happiness.', 'civilian', 'entertainment', 15, false, 800, 400, 100, 1.6, 180, 1.4, 0, 0, 0, 0, 0, 30, 1.1, 1, true),
('Hospital', 'Medical facility treating injuries and preventing disease outbreaks.', 'civilian', 'hospital', 15, false, 600, 300, 100, 1.5, 120, 1.4, 0, 0, 0, 0, 0, 30, 1.1, 1, true),
('Trade Center', 'Commercial hub where goods are exchanged and trades are negotiated.', 'civilian', 'trade_center', 15, false, 2000, 1000, 500, 1.6, 600, 1.5, 0, 0, 0, 0, 0, 50, 1.1, 2, false),

-- Orbital Buildings
('Orbital Dock', 'Space dock for ship maintenance, repair, and construction.', 'orbital', 'orbital_dock', 15, false, 4000, 2000, 1000, 1.8, 1200, 1.5, 0, 0, 0, 0, 0, 200, 1.1, 2, false),
('Orbital Ring', 'Massive orbital ring providing additional building slots and energy collection.', 'orbital', 'orbital_ring', 10, true, 100000, 50000, 25000, 2.0, 14400, 1.8, 0, 0, 0, 0, 500, 0, 1.2, 5, false),
('Solar Satellite Array', 'Orbital solar collectors that beam energy to the planet surface.', 'orbital', 'solar_array', 20, false, 0, 2000, 500, 1.5, 120, 1.3, 0, 0, 0, 0, 50, 0, 1.5, 2, true),

-- Special Buildings
('Jump Gate', 'Wormhole generator allowing instantaneous travel between connected gates.', 'special', 'jump_gate', 5, true, 200000, 100000, 50000, 2.0, 86400, 1.8, 0, 0, 0, 0, 1000, 1000, 1.1, 5, false),
('Planetary Shield', 'Energy shield generator that protects the entire planet from orbital bombardment.', 'special', 'planet_shield', 5, true, 50000, 30000, 15000, 2.0, 21600, 1.8, 0, 0, 0, 0, 2000, 500, 1.1, 4, false),
('Dimensional Rift Stabilizer', 'Device that stabilizes dimensional rifts for research and resource extraction.', 'special', 'rift_stabilizer', 10, true, 150000, 100000, 50000, 2.0, 43200, 1.8, 0, 0, 0, 0, 5000, 2000, 1.1, 5, false),
('Mega Warehouse', 'Gigantic storage facility that multiplies all planetary storage capacity.', 'storage', 'mega_warehouse', 10, true, 25000, 15000, 5000, 2.0, 7200, 1.5, 0, 0, 500000, 2.0, 0, 200, 1.0, 4, false),

-- Governance Buildings
('Capital Building', 'Seat of government that improves administrative efficiency and resource collection.', 'governance', 'capitol', 15, true, 10000, 5000, 2000, 1.8, 3600, 1.5, 0, 0, 0, 0, 0, 200, 1.1, 2, false),
('Embassy', 'Diplomatic facility that improves relations and alliance capabilities.', 'governance', 'embassy', 10, true, 8000, 4000, 2000, 1.8, 2400, 1.5, 0, 0, 0, 0, 0, 100, 1.1, 2, false);

COMMENT ON TABLE buildings IS 'Seed data: 40 buildings across resource, production, research, military, defense, storage, infrastructure, civilian, orbital, special, and governance categories';
