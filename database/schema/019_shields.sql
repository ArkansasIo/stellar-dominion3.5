-- Shields
-- Defensive energy shield systems for ships and structures

CREATE TYPE shield_technology AS ENUM (
    'deflector','absorption','phase','reflective','resonance',
    'graviton','quantum','void','plasma','energy_barrier'
);

CREATE TYPE shield_damage_type AS ENUM (
    'kinetic','energy','explosive','thermal','radiation','all'
);

CREATE TABLE shields (
    shield_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    technology       shield_technology DEFAULT 'deflector',

    -- Core stats
    shield_capacity  INTEGER DEFAULT 1000,
    shield_recharge  INTEGER DEFAULT 10,
    recharge_delay   NUMERIC(4,2) DEFAULT 5.0,
    energy_drain     INTEGER DEFAULT 50,
    power_requirement INTEGER DEFAULT 10,

    -- Resistance (percentage)
    resistance_kinetic    SMALLINT DEFAULT 0 CHECK (resistance_kinetic BETWEEN 0 AND 100),
    resistance_energy     SMALLINT DEFAULT 0 CHECK (resistance_energy BETWEEN 0 AND 100),
    resistance_explosive  SMALLINT DEFAULT 0 CHECK (resistance_explosive BETWEEN 0 AND 100),
    resistance_thermal    SMALLINT DEFAULT 0 CHECK (resistance_thermal BETWEEN 0 AND 100),
    resistance_radiation  SMALLINT DEFAULT 0 CHECK (resistance_radiation BETWEEN 0 AND 100),

    -- Special
    shield_pass_through   SMALLINT DEFAULT 0 CHECK (shield_pass_through BETWEEN 0 AND 100),
    bleed_through         SMALLINT DEFAULT 0 CHECK (bleed_through BETWEEN 0 AND 100),
    regenerates_in_combat BOOLEAN DEFAULT false,
    hard_counter          VARCHAR(50),

    -- Requirements
    required_technology   VARCHAR(100),
    required_tech_level   INTEGER DEFAULT 1,
    required_hull_size    VARCHAR(30),

    -- Cost
    metal_cost       BIGINT DEFAULT 1000,
    crystal_cost     BIGINT DEFAULT 500,
    deuterium_cost   BIGINT DEFAULT 100,
    build_time_sec   INTEGER DEFAULT 1200,

    -- Size classification
    size             weapon_size DEFAULT 'medium',

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shields_tech ON shields(technology);
CREATE INDEX idx_shields_size ON shields(size);
COMMENT ON TABLE shields IS 'Shield systems providing damage absorption, resistances, and special defensive properties';
