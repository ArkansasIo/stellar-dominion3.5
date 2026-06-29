-- Fleet Classes (Ship Categories)
-- High-level classification of ship types

CREATE TYPE fleet_role AS ENUM (
    'combat','transport','mining','exploration','colony','support',
    'science','construction','espionage','refinery','command','carrier'
);

CREATE TABLE fleet_classes (
    class_id         BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    role             fleet_role DEFAULT 'combat',

    -- Size tier
    tier             SMALLINT NOT NULL CHECK (tier BETWEEN 1 AND 15),
    hull_size        VARCHAR(30) CHECK (hull_size IN ('small','medium','large','huge','massive','colossal')),

    -- Base stats
    base_attack      INTEGER DEFAULT 0,
    base_defense     INTEGER DEFAULT 0,
    base_shield      INTEGER DEFAULT 0,
    base_hull        INTEGER DEFAULT 100,
    base_speed       INTEGER DEFAULT 100,
    base_cargo       INTEGER DEFAULT 0,
    base_crew        INTEGER DEFAULT 0,

    -- Slots
    weapon_slots     SMALLINT DEFAULT 0,
    defense_slots    SMALLINT DEFAULT 0,
    utility_slots    SMALLINT DEFAULT 0,
    engineering_slots SMALLINT DEFAULT 0,

    -- Requirements
    required_research_level INTEGER DEFAULT 1,
    required_shipyard_level INTEGER DEFAULT 1,
    required_command_level  INTEGER DEFAULT 1,

    -- Cost
    metal_cost       BIGINT DEFAULT 0,
    crystal_cost     BIGINT DEFAULT 0,
    deuterium_cost   BIGINT DEFAULT 0,
    build_time_sec   INTEGER DEFAULT 3600,

    -- Special
    is_buildable     BOOLEAN DEFAULT true,
    is_fighter       BOOLEAN DEFAULT false,
    can_land         BOOLEAN DEFAULT false,
    requires_docking BOOLEAN DEFAULT true,
    warp_capacity    SMALLINT DEFAULT 1,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_role ON fleet_classes(role);
CREATE INDEX idx_classes_tier ON fleet_classes(tier);
CREATE INDEX idx_classes_buildable ON fleet_classes(is_buildable) WHERE is_buildable = true;
COMMENT ON TABLE fleet_classes IS 'Ship hull classifications defining base stats, slot configurations, and build requirements';
