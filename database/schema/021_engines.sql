-- Engines
-- Propulsion systems for ships determining speed, maneuverability, and warp capability

CREATE TYPE engine_category AS ENUM (
    'ion','fusion','antimatter','warp','quantum','fold','subspace',
    'solar','graviton','dark_energy','impulse','plasma','tachyon','zero_point'
);

CREATE TABLE engines (
    engine_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         engine_category DEFAULT 'ion',

    -- Core stats
    base_speed       INTEGER DEFAULT 1000,
    warp_speed       INTEGER DEFAULT 1,
    max_warp         INTEGER DEFAULT 5,
    maneuverability  SMALLINT DEFAULT 5 CHECK (maneuverability BETWEEN 1 AND 10),
    acceleration     NUMERIC(4,2) DEFAULT 1.0,
    turn_rate        NUMERIC(4,2) DEFAULT 1.0,

    -- Warp drive
    warp_charge_time  NUMERIC(5,2) DEFAULT 5.0,
    warp_cooldown     NUMERIC(5,2) DEFAULT 2.0,
    warp_capacity     SMALLINT DEFAULT 1,
    warp_efficiency   NUMERIC(4,2) DEFAULT 1.0,

    -- Power
    energy_drain     INTEGER DEFAULT 25,
    heat_generation  INTEGER DEFAULT 10,
    signature_increase SMALLINT DEFAULT 0,

    -- Special
    afterburner      BOOLEAN DEFAULT false,
    afterburner_speed INTEGER DEFAULT 0,
    cloak_compatible  BOOLEAN DEFAULT false,
    emergency_warp    BOOLEAN DEFAULT false,

    -- Requirements
    required_technology   VARCHAR(100),
    required_tech_level   INTEGER DEFAULT 1,
    required_hull_size    VARCHAR(30),

    -- Cost
    metal_cost       BIGINT DEFAULT 1500,
    crystal_cost     BIGINT DEFAULT 800,
    deuterium_cost   BIGINT DEFAULT 400,
    build_time_sec   INTEGER DEFAULT 1500,

    -- Size
    size             weapon_size DEFAULT 'medium',

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_engines_category ON engines(category);
CREATE INDEX idx_engines_size ON engines(size);
CREATE INDEX idx_engines_warp ON engines(warp_speed);
COMMENT ON TABLE engines IS 'Propulsion systems including sublight drives, warp drives, and specialized FTL technologies';
