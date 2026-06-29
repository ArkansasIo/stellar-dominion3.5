-- Moons
-- Natural satellites orbiting planets

CREATE TABLE moons (
    moon_id          BIGSERIAL PRIMARY KEY,
    planet_id        BIGINT NOT NULL REFERENCES planets(planet_id),
    system_id        BIGINT NOT NULL REFERENCES star_systems(system_id),
    name             VARCHAR(100) NOT NULL,
    diameter_km      INTEGER DEFAULT 1000,
    gravity_g        NUMERIC(4,2) DEFAULT 0.2,
    atmosphere       planet_atmosphere DEFAULT 'none',
    habitability     SMALLINT DEFAULT 0 CHECK (habitability BETWEEN 0 AND 100),
    resource_rich    BOOLEAN DEFAULT false,
    has_ruins        BOOLEAN DEFAULT false,
    is_colonizable   BOOLEAN DEFAULT false,
    orbital_distance NUMERIC(10,2),
    orbital_period   NUMERIC(8,2),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_moons_planet ON moons(planet_id);
CREATE INDEX idx_moons_system ON moons(system_id);
COMMENT ON TABLE moons IS 'Natural satellites that can host mining operations and small colonies';
