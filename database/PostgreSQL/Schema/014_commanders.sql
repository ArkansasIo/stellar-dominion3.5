-- Commanders
-- Hero characters that lead fleets and provide empire-wide bonuses

CREATE TYPE commander_rarity AS ENUM ('common','uncommon','rare','epic','legendary','mythic');

CREATE TYPE commander_role AS ENUM (
    'fleet_admiral','tactician','engineer','scientist','diplomat',
    'explorer','mining_foreman','espionage_agent','defense_coordinator',
    'logistics_officer'
);

CREATE TABLE commanders (
    commander_id     BIGSERIAL PRIMARY KEY,
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    name             VARCHAR(100) NOT NULL,
    rarity           commander_rarity DEFAULT 'common',
    role             commander_role DEFAULT 'fleet_admiral',

    -- Leveling
    level            INTEGER DEFAULT 1,
    experience       BIGINT DEFAULT 0,
    experience_next  BIGINT DEFAULT 100,

    -- Primary Attributes (EVE-style)
    intelligence     SMALLINT DEFAULT 5 CHECK (intelligence BETWEEN 1 AND 80),
    perception       SMALLINT DEFAULT 5 CHECK (perception BETWEEN 1 AND 80),
    willpower        SMALLINT DEFAULT 5 CHECK (willpower BETWEEN 1 AND 80),
    memory           SMALLINT DEFAULT 5 CHECK (memory BETWEEN 1 AND 80),
    charisma         SMALLINT DEFAULT 5 CHECK (charisma BETWEEN 1 AND 80),

    -- Derived stats
    military_command   INTEGER DEFAULT 0,
    engineering        INTEGER DEFAULT 0,
    scientific_research INTEGER DEFAULT 0,
    sensor_operations  INTEGER DEFAULT 0,
    empire_logistics   INTEGER DEFAULT 0,

    -- Assignment
    assigned_fleet_id BIGINT,
    is_active         BOOLEAN DEFAULT true,
    is_training       BOOLEAN DEFAULT false,
    training_end      TIMESTAMPTZ,

    -- Implants
    implant_slots     INTEGER[] DEFAULT '{1,2,3,4,5}',
    equipped_implants BIGINT[],

    hired_at         TIMESTAMPTZ DEFAULT NOW(),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commanders_empire ON commanders(empire_id);
CREATE INDEX idx_commanders_rarity ON commanders(rarity);
CREATE INDEX idx_commanders_role ON commanders(role);
CREATE INDEX idx_commanders_active ON commanders(is_active) WHERE is_active = true;
COMMENT ON TABLE commanders IS 'Hero characters with attributes, skills, and implant slots that buff fleets and empire';
