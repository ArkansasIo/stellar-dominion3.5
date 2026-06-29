-- Nebulas
-- Interstellar gas and dust clouds affecting visibility, sensors, and resources

CREATE TYPE nebula_type AS ENUM (
    'emission','reflection','dark','planetary','supernova_remnant',
    'hii_region','molecular_cloud','globule','ionized','diffuse',
    'void_cloud','energy_nebula','crystal_nebula','toxic_nebula'
);

CREATE TABLE nebulas (
    nebula_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    nebula_type      nebula_type NOT NULL,

    -- Location
    system_id        BIGINT REFERENCES star_systems(system_id),
    region_id        BIGINT REFERENCES regions(region_id),
    galaxy_id        BIGINT REFERENCES galaxies(galaxy_id),
    x                INTEGER,
    y                INTEGER,
    z                INTEGER,
    radius_au        NUMERIC(8,2) DEFAULT 5.0,

    -- Effects on gameplay
    sensor_penalty   SMALLINT DEFAULT 0 CHECK (sensor_penalty BETWEEN 0 AND 100),
    shield_bonus     SMALLINT DEFAULT 0 CHECK (shield_bonus BETWEEN -50 AND 50),
    weapon_bonus     SMALLINT DEFAULT 0 CHECK (weapon_bonus BETWEEN -50 AND 50),
    speed_penalty    SMALLINT DEFAULT 0 CHECK (speed_penalty BETWEEN 0 AND 100),
    stealth_bonus    SMALLINT DEFAULT 0 CHECK (stealth_bonus BETWEEN 0 AND 100),
    warp_disruption  SMALLINT DEFAULT 0 CHECK (warp_disruption BETWEEN 0 AND 100),

    -- Resources
    harvestable      BOOLEAN DEFAULT false,
    resource_id      BIGINT REFERENCES resources(resource_id),
    harvest_rate     NUMERIC(8,2) DEFAULT 0,

    -- Visual
    color_primary    VARCHAR(7) DEFAULT '#88CCFF',
    color_secondary  VARCHAR(7) DEFAULT '#4488AA',
    opacity          NUMERIC(3,2) DEFAULT 0.5,
    density          SMALLINT DEFAULT 5 CHECK (density BETWEEN 1 AND 10),

    -- Meta
    is_hazardous     BOOLEAN DEFAULT false,
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nebulas_system ON nebulas(system_id);
CREATE INDEX idx_nebulas_type ON nebulas(nebula_type);
CREATE INDEX idx_nebulas_harvestable ON nebulas(harvestable) WHERE harvestable = true;
CREATE INDEX idx_nebulas_hazardous ON nebulas(is_hazardous) WHERE is_hazardous = true;
COMMENT ON TABLE nebulas IS 'Interstellar clouds affecting sensors, combat, and offering harvestable resources';
