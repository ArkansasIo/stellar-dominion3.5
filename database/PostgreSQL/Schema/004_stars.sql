-- Stars
-- Central stellar objects within each star system

CREATE TYPE star_spectral AS ENUM ('O','B','A','F','G','K','M','L','T','Y','DA','DB','DQ','DZ','DC');

CREATE TABLE stars (
    star_id          BIGSERIAL PRIMARY KEY,
    system_id        BIGINT NOT NULL REFERENCES star_systems(system_id),
    name             VARCHAR(100) NOT NULL,
    spectral_class   star_spectral DEFAULT 'G',
    mass_solar       NUMERIC(8,4) DEFAULT 1.0,
    radius_solar     NUMERIC(8,4) DEFAULT 1.0,
    luminosity_solar NUMERIC(8,4) DEFAULT 1.0,
    temperature_k    INTEGER DEFAULT 5778,
    age_billion      NUMERIC(5,2) DEFAULT 5.0,
    rotation_rate    NUMERIC(5,2) DEFAULT 1.0,
    magnetic_field   NUMERIC(6,2) DEFAULT 1.0,
    flare_activity   SMALLINT DEFAULT 0 CHECK (flare_activity BETWEEN 0 AND 10),
    planets_orbiting SMALLINT DEFAULT 0,
    habitability_zone_start NUMERIC(8,4),
    habitability_zone_end   NUMERIC(8,4),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stars_system ON stars(system_id);
CREATE INDEX idx_stars_spectral ON stars(spectral_class);
COMMENT ON TABLE stars IS 'Central stellar objects providing light and energy to star systems';
