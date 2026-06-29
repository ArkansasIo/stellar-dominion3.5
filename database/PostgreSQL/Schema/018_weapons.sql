-- Weapons
-- Offensive armaments for ships and defenses

CREATE TYPE weapon_category AS ENUM (
    'laser','plasma','ion','disruptor','phaser','pulse_cannon',
    'railgun','mass_driver','gauss_cannon','coilgun',
    'missile','torpedo','rocket','bomb',
    'beam','tachyon','particle','neutron',
    'kinetic','explosive','energy','graviton','quantum'
);

CREATE TYPE weapon_size AS ENUM ('small','medium','large','huge','massive','siege');

CREATE TYPE damage_type AS ENUM ('kinetic','energy','explosive','thermal','radiation','gravitic','quantum','true');

CREATE TABLE weapons (
    weapon_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         weapon_category NOT NULL,
    size             weapon_size DEFAULT 'medium',

    -- Damage
    damage_type      damage_type DEFAULT 'kinetic',
    base_damage      INTEGER DEFAULT 10,
    damage_variance  NUMERIC(4,2) DEFAULT 0.1,
    damage_per_level INTEGER DEFAULT 5,
    armor_penetration SMALLINT DEFAULT 0 CHECK (armor_penetration BETWEEN 0 AND 100),
    shield_bypass    SMALLINT DEFAULT 0 CHECK (shield_bypass BETWEEN 0 AND 100),

    -- Performance
    fire_rate        NUMERIC(4,2) DEFAULT 1.0,
    range_au         NUMERIC(6,2) DEFAULT 1.0,
    accuracy         INTEGER DEFAULT 100,
    tracking_speed   NUMERIC(4,2) DEFAULT 1.0,
    energy_per_shot  INTEGER DEFAULT 10,
    heat_per_shot    INTEGER DEFAULT 5,

    -- Critical
    critical_chance  NUMERIC(4,2) DEFAULT 0,
    critical_multiplier NUMERIC(4,2) DEFAULT 2.0,
    heavy_strike_chance  NUMERIC(4,2) DEFAULT 0,
    heavy_strike_mult    NUMERIC(4,2) DEFAULT 3.0,

    -- Requirements
    required_technology   VARCHAR(100),
    required_tech_level   INTEGER DEFAULT 1,
    required_hull_size    VARCHAR(30),

    -- Cost
    metal_cost       BIGINT DEFAULT 500,
    crystal_cost     BIGINT DEFAULT 200,
    deuterium_cost   BIGINT DEFAULT 50,
    build_time_sec   INTEGER DEFAULT 900,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weapons_category ON weapons(category);
CREATE INDEX idx_weapons_damage_type ON weapons(damage_type);
CREATE INDEX idx_weapons_size ON weapons(size);
CREATE INDEX idx_weapons_range ON weapons(range_au);
COMMENT ON TABLE weapons IS 'Weapon systems with detailed damage, accuracy, critical, and penetration stats';
