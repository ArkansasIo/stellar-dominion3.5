-- Asteroid Fields
-- Resource-rich belts and clusters for mining operations

CREATE TYPE asteroid_composition AS ENUM (
    'metallic','rocky','icy','mixed','carbonaceous','rare_earth','crystal','dark_matter'
);

CREATE TABLE asteroid_fields (
    field_id         BIGSERIAL PRIMARY KEY,
    system_id        BIGINT NOT NULL REFERENCES star_systems(system_id),
    region_id        BIGINT REFERENCES regions(region_id),
    name             VARCHAR(100) NOT NULL,
    composition      asteroid_composition DEFAULT 'mixed',
    asteroid_count   BIGINT DEFAULT 1000,
    resource_density NUMERIC(6,2) DEFAULT 100.0,
    size_km          INTEGER DEFAULT 100,
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),
    minable          BOOLEAN DEFAULT true,
    depletion_rate   NUMERIC(4,2) DEFAULT 0.01,
    respawn_rate     NUMERIC(4,2) DEFAULT 0.001,
    primary_resource VARCHAR(50),
    secondary_resource VARCHAR(50),
    x                INTEGER,
    y                INTEGER,
    z                INTEGER,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(system_id, name)
);

CREATE INDEX idx_asteroids_system ON asteroid_fields(system_id);
CREATE INDEX idx_asteroids_composition ON asteroid_fields(composition);
CREATE INDEX idx_asteroids_minable ON asteroid_fields(minable) WHERE minable = true;
COMMENT ON TABLE asteroid_fields IS 'Asteroid belts and clusters that provide mining resources';
