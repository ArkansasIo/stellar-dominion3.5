-- Universe Schema - Celestial objects and coordinates
-- This schema is deterministically generated based on coordinate hashing

CREATE TABLE IF NOT EXISTS galaxies (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  star_count INTEGER DEFAULT 500,
  discovery_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stars (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL REFERENCES galaxies(galaxy_id),
  star_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  star_type VARCHAR(50) NOT NULL, -- O, B, A, F, G, K, M, N, H
  star_class VARCHAR(10) NOT NULL, -- I, II, III, IV, V
  temperature INTEGER, -- Kelvin
  luminosity REAL,
  mass REAL, -- Solar masses
  radius REAL, -- Solar radii
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  planet_count INTEGER DEFAULT 8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_star_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z)
);

CREATE TABLE IF NOT EXISTS planets (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  star_id INTEGER NOT NULL,
  planet_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  planet_type VARCHAR(50) NOT NULL, -- terrestrial, gas_giant, ice_giant, terrestrial_exotic, etc.
  planet_class VARCHAR(10) NOT NULL, -- 1-12 (OGame classification)
  diameter INTEGER, -- km
  mass REAL, -- Earth masses
  orbit_distance REAL, -- AU
  temperature INTEGER, -- Kelvin
  atmosphere VARCHAR(50),
  habitability_score REAL, -- 0.0 to 1.0
  resources JSONB DEFAULT '{"metal": 500, "crystal": 300, "deuterium": 100}'::jsonb,
  moon_count INTEGER DEFAULT 0,
  current_occupant_id VARCHAR(36), -- User ID if colonized
  colonized_at TIMESTAMP,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_planet_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z),
  FOREIGN KEY (current_occupant_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS moons (
  id SERIAL PRIMARY KEY,
  planet_id INTEGER NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  moon_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  diameter INTEGER,
  mass REAL,
  orbit_distance REAL,
  temperature INTEGER,
  current_occupant_id VARCHAR(36),
  colonized_at TIMESTAMP,
  resources JSONB DEFAULT '{"metal": 200, "crystal": 100, "deuterium": 50}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (current_occupant_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS asteroids (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  star_id INTEGER NOT NULL,
  asteroid_id INTEGER NOT NULL,
  asteroid_type VARCHAR(50), -- C, S, M, D, P, B, Q, R, K, X, T, etc.
  diameter REAL, -- km
  mass REAL, -- Earth masses
  composition JSONB,
  resources JSONB DEFAULT '{"metal": 1000, "crystal": 500, "deuterium": 200}'::jsonb,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_asteroid_coords UNIQUE(galaxy_id, coordinate_x, coordinate_y, coordinate_z)
);

CREATE TABLE IF NOT EXISTS space_anomalies (
  id SERIAL PRIMARY KEY,
  galaxy_id INTEGER NOT NULL,
  anomaly_type VARCHAR(50), -- black_hole, neutron_star, wormhole, supernova, etc.
  description VARCHAR(500),
  danger_level INTEGER, -- 1-10
  effects JSONB,
  coordinate_x INTEGER NOT NULL,
  coordinate_y INTEGER NOT NULL,
  coordinate_z INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Continents (on planets)
CREATE TABLE IF NOT EXISTS continents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id INTEGER NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  continent_name VARCHAR(100) NOT NULL,
  continent_type VARCHAR(50) NOT NULL,
  area_sqkm REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries (within continents)
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  continent_id UUID NOT NULL REFERENCES continents(id) ON DELETE CASCADE,
  country_name VARCHAR(100) NOT NULL,
  country_type VARCHAR(50) NOT NULL,
  owner_player_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Territories (regions within countries)
CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  territory_name VARCHAR(100) NOT NULL,
  territory_type VARCHAR(50) NOT NULL,
  area_sqkm REAL,
  controlled_by_player_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource Fields (actual mineable locations)
CREATE TABLE IF NOT EXISTS resource_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  field_size VARCHAR(50) NOT NULL,
  metal_per_hour REAL DEFAULT 0,
  crystal_per_hour REAL DEFAULT 0,
  deuterium_per_hour REAL DEFAULT 0,
  max_extraction_capacity INTEGER DEFAULT 100,
  depletion_percent INTEGER DEFAULT 0,
  is_depleted BOOLEAN DEFAULT false,
  mined_by_player_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
  total_metal_extracted REAL DEFAULT 0,
  total_crystal_extracted REAL DEFAULT 0,
  total_deuterium_extracted REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Colonies
CREATE TABLE IF NOT EXISTS player_colonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  planet_id INTEGER NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
  colony_name VARCHAR(100) NOT NULL,
  colony_type VARCHAR(50) NOT NULL,
  colony_level INTEGER DEFAULT 1,
  population INTEGER DEFAULT 1000,
  built_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mining Operations
CREATE TABLE IF NOT EXISTS mining_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES resource_fields(id) ON DELETE CASCADE,
  extraction_units INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_extracted JSONB DEFAULT '{"metal": 0, "crystal": 0, "deuterium": 0}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_stars_galaxy ON stars(galaxy_id);
CREATE INDEX idx_planets_galaxy ON planets(galaxy_id);
CREATE INDEX idx_planets_coordinates ON planets(coordinate_x, coordinate_y, coordinate_z);
CREATE INDEX idx_planets_occupant ON planets(current_occupant_id);
CREATE INDEX idx_moons_planet ON moons(planet_id);
CREATE INDEX idx_asteroids_galaxy ON asteroids(galaxy_id);
CREATE INDEX idx_anomalies_galaxy ON space_anomalies(galaxy_id);
CREATE INDEX idx_continents_planet ON continents(planet_id);
CREATE INDEX idx_countries_continent ON countries(continent_id);
CREATE INDEX idx_countries_owner ON countries(owner_player_id);
CREATE INDEX idx_territories_country ON territories(country_id);
CREATE INDEX idx_territories_controller ON territories(controlled_by_player_id);
CREATE INDEX idx_fields_territory ON resource_fields(territory_id);
CREATE INDEX idx_fields_mined_by ON resource_fields(mined_by_player_id);
CREATE INDEX idx_colonies_player ON player_colonies(player_id);
CREATE INDEX idx_colonies_planet ON player_colonies(planet_id);
CREATE INDEX idx_operations_player ON mining_operations(player_id);
CREATE INDEX idx_operations_field ON mining_operations(field_id);
