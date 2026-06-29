-- Regions (Sectors)
-- Subdivisions of galaxies containing star system clusters

CREATE TYPE region_type AS ENUM ('core','industrial','agricultural','military','research','trade','pirate','dead','ancient','neutral');

CREATE TABLE regions (
    region_id        BIGSERIAL PRIMARY KEY,
    galaxy_id        BIGINT NOT NULL REFERENCES galaxies(galaxy_id),
    name             VARCHAR(100) NOT NULL,
    region_type      region_type DEFAULT 'neutral',
    x                INTEGER NOT NULL,
    y                INTEGER NOT NULL,
    z                INTEGER NOT NULL DEFAULT 0,
    width_ly         INTEGER DEFAULT 1000,
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),
    resource_rich    BOOLEAN DEFAULT false,
    faction_owner_id BIGINT,
    starbase_count   INTEGER DEFAULT 0,
    wormhole_count   INTEGER DEFAULT 0,
    asteroid_density SMALLINT DEFAULT 0,
    radiation_level  SMALLINT DEFAULT 0,
    description      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regions_galaxy ON regions(galaxy_id);
CREATE INDEX idx_regions_type ON regions(region_type);
CREATE INDEX idx_regions_danger ON regions(danger_level);
COMMENT ON TABLE regions IS 'Galactic sectors containing clusters of star systems';
