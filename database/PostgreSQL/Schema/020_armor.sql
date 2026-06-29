-- Armor
-- Hull armor plating providing damage resistance and structural integrity

CREATE TYPE armor_category AS ENUM (
    'ablative','reactive','composite','ceramic','crystalline',
    'nanite','molecular','energy','graviton','quantum'
);

CREATE TABLE armor (
    armor_id         BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         armor_category DEFAULT 'ablative',

    -- Core stats
    armor_rating     INTEGER DEFAULT 100,
    hull_integrity_bonus INTEGER DEFAULT 0,
    mass_kg          INTEGER DEFAULT 5000,
    energy_drain     INTEGER DEFAULT 0,

    -- Resistance (percentage)
    resistance_kinetic    SMALLINT DEFAULT 0 CHECK (resistance_kinetic BETWEEN 0 AND 100),
    resistance_energy     SMALLINT DEFAULT 0 CHECK (resistance_energy BETWEEN 0 AND 100),
    resistance_explosive  SMALLINT DEFAULT 0 CHECK (resistance_explosive BETWEEN 0 AND 100),
    resistance_thermal    SMALLINT DEFAULT 0 CHECK (resistance_thermal BETWEEN 0 AND 100),

    -- Special properties
    self_repair      BOOLEAN DEFAULT false,
    repair_per_sec   INTEGER DEFAULT 0,
    critical_resist  SMALLINT DEFAULT 0 CHECK (critical_resist BETWEEN 0 AND 100),
    heavy_resist     SMALLINT DEFAULT 0 CHECK (heavy_resist BETWEEN 0 AND 100),
    damage_threshold INTEGER DEFAULT 0,

    -- Requirements
    required_technology   VARCHAR(100),
    required_tech_level   INTEGER DEFAULT 1,
    required_hull_size    VARCHAR(30),

    -- Cost
    metal_cost       BIGINT DEFAULT 2000,
    crystal_cost     BIGINT DEFAULT 500,
    deuterium_cost   BIGINT DEFAULT 100,
    build_time_sec   INTEGER DEFAULT 1800,

    -- Size
    size             weapon_size DEFAULT 'medium',

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_armor_category ON armor(category);
CREATE INDEX idx_armor_size ON armor(size);
COMMENT ON TABLE armor IS 'Armor plating systems providing damage resistance, hull bonuses, and special protective properties';
