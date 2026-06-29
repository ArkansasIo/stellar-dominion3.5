-- Planets
-- Orbital bodies that can be colonized, mined, or explored

CREATE TYPE planet_class AS ENUM (
    'terran','oceanic','desert','arctic','volcanic','jungle','rocky',
    'gas_giant','ice_giant','toxic','barren','molten','crystal',
    'ancient','artificial','ring_world','dyson_habitat','forge_world',
    'hive_world','machine_world','lava','continental','tundra','swamp'
);

CREATE TYPE planet_atmosphere AS ENUM (
    'breathable','thin','thick','corrosive','toxic','none','methane','co2','nitrogen','helium'
);

CREATE TABLE planets (
    planet_id        BIGSERIAL PRIMARY KEY,
    system_id        BIGINT NOT NULL REFERENCES star_systems(system_id),
    orbit_slot       SMALLINT NOT NULL,
    name             VARCHAR(100) NOT NULL,
    planet_class     planet_class DEFAULT 'rocky',
    diameter_km      INTEGER DEFAULT 10000,
    gravity_g        NUMERIC(4,2) DEFAULT 1.0,
    temperature_min  INTEGER DEFAULT -50,
    temperature_max  INTEGER DEFAULT 50,
    atmosphere       planet_atmosphere DEFAULT 'none',
    habitability     SMALLINT DEFAULT 0 CHECK (habitability BETWEEN 0 AND 100),
    resource_rich    BOOLEAN DEFAULT false,
    has_life         BOOLEAN DEFAULT false,
    has_ruins        BOOLEAN DEFAULT false,
    moon_count       SMALLINT DEFAULT 0,
    is_colonizable   BOOLEAN DEFAULT false,
    is_gas_giant     BOOLEAN DEFAULT false,
    orbital_period   NUMERIC(10,2),
    axial_tilt       NUMERIC(5,2) DEFAULT 0,
    magnetic_field   NUMERIC(4,2) DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_planets_system ON planets(system_id);
CREATE INDEX idx_planets_class ON planets(planet_class);
CREATE INDEX idx_planets_habitable ON planets(habitability) WHERE habitability > 30;
CREATE INDEX idx_planets_colonizable ON planets(is_colonizable) WHERE is_colonizable = true;
COMMENT ON TABLE planets IS 'Planetary bodies ranging from habitable worlds to gas giants and artificial constructs';
