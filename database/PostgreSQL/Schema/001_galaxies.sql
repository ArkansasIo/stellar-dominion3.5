-- Galaxies
-- Core universe regions containing star systems

CREATE TYPE galaxy_security AS ENUM ('core', 'mid', 'frontier', 'deep', 'void');

CREATE TABLE galaxies (
    galaxy_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    spiral_type      VARCHAR(30) CHECK (spiral_type IN ('spiral','barred','elliptical','irregular','ring')),
    age_billion_years NUMERIC(4,2) DEFAULT 10.0,
    security_level   galaxy_security DEFAULT 'mid',
    size_ly          INTEGER DEFAULT 100000,
    star_count       BIGINT DEFAULT 0,
    anomaly_count    INTEGER DEFAULT 0,
    faction_owner_id BIGINT,
    is_home_galaxy   BOOLEAN DEFAULT false,
    warp_multiplier  NUMERIC(4,2) DEFAULT 1.0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_galaxies_security ON galaxies(security_level);
COMMENT ON TABLE galaxies IS 'Top-level universe regions containing all star systems';
