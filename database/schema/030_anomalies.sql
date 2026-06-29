-- Anomalies
-- Temporary or permanent space phenomena affecting gameplay

CREATE TYPE anomaly_type AS ENUM (
    'gravitational','radiation','temporal','spatial','energy','quantum',
    'plasma_storm','ion_storm','dark_matter_cloud','void_rift',
    'subspace_fold','reality_tear','neutrino_burst','magnetic_surge'
);

CREATE TYPE anomaly_severity AS ENUM ('minor','moderate','major','critical','cataclysmic');

CREATE TABLE anomalies (
    anomaly_id       BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    anomaly_type     anomaly_type NOT NULL,
    severity         anomaly_severity DEFAULT 'moderate',

    -- Location
    system_id        BIGINT REFERENCES star_systems(system_id),
    region_id        BIGINT REFERENCES regions(region_id),
    galaxy_id        BIGINT REFERENCES galaxies(galaxy_id),
    x                INTEGER,
    y                INTEGER,
    z                INTEGER,
    radius_au        NUMERIC(8,2) DEFAULT 1.0,

    -- Effects
    effect_type      VARCHAR(50),
    effect_magnitude NUMERIC(8,2) DEFAULT 1.0,
    effect_radius_au NUMERIC(8,2) DEFAULT 1.0,

    -- Duration
    is_permanent     BOOLEAN DEFAULT false,
    appears_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at       TIMESTAMPTZ,
    duration_hours   INTEGER DEFAULT 24,

    -- Rewards
    rewards          JSONB DEFAULT '{}',
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),

    -- Discovery
    discovered_by    BIGINT REFERENCES empires(empire_id),
    is_public        BOOLEAN DEFAULT true,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomalies_system ON anomalies(system_id);
CREATE INDEX idx_anomalies_type ON anomalies(anomaly_type);
CREATE INDEX idx_anomalies_severity ON anomalies(severity);
CREATE INDEX idx_anomalies_active ON anomalies(expires_at) WHERE expires_at > NOW() OR expires_at IS NULL;
COMMENT ON TABLE anomalies IS 'Space phenomena that temporarily or permanently affect local gameplay and rewards';
