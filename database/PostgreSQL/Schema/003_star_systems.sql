-- Star Systems
-- Individual star systems containing planets, stations, and resources

CREATE TYPE system_class AS ENUM ('O','B','A','F','G','K','M','L','T','Y','neutron','black_hole','pulsar','binary','trinary','red_giant','blue_giant','white_dwarf','brown_dwarf','protostar');

CREATE TABLE star_systems (
    system_id        BIGSERIAL PRIMARY KEY,
    region_id        BIGINT NOT NULL REFERENCES regions(region_id),
    galaxy_id        BIGINT NOT NULL REFERENCES galaxies(galaxy_id),
    name             VARCHAR(100) NOT NULL,
    system_class     system_class DEFAULT 'G',
    x                INTEGER NOT NULL,
    y                INTEGER NOT NULL,
    z                INTEGER NOT NULL,
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),
    radiation        SMALLINT DEFAULT 0,
    temperature      INTEGER DEFAULT 5000,
    planet_count     SMALLINT DEFAULT 0,
    moon_count       SMALLINT DEFAULT 0,
    asteroid_belt    BOOLEAN DEFAULT false,
    station_count    SMALLINT DEFAULT 0,
    wormhole_present BOOLEAN DEFAULT false,
    anomaly_present  BOOLEAN DEFAULT false,
    nebula_present   BOOLEAN DEFAULT false,
    faction_owner_id BIGINT,
    is_home_system   BOOLEAN DEFAULT false,
    warp_min         INTEGER DEFAULT 1,
    resource_bonus   NUMERIC(4,2) DEFAULT 1.0,
    description      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_systems_region ON star_systems(region_id);
CREATE INDEX idx_systems_galaxy ON star_systems(galaxy_id);
CREATE INDEX idx_systems_class ON star_systems(system_class);
CREATE INDEX idx_systems_danger ON star_systems(danger_level);
CREATE INDEX idx_systems_owner ON star_systems(faction_owner_id);
CREATE INDEX idx_systems_coords ON star_systems(galaxy_id, x, y, z);
COMMENT ON TABLE star_systems IS 'Individual star systems that form the navigable universe';
