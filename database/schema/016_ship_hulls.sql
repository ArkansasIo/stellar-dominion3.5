-- Ship Hulls (Individual Ship Definitions)
-- Specific ship models within each fleet class

CREATE TYPE drive_type AS ENUM ('combustion','impulse','hyperspace','quantum','warp','fold','subspace');

CREATE TABLE ship_hulls (
    hull_id          BIGSERIAL PRIMARY KEY,
    class_id         BIGINT NOT NULL REFERENCES fleet_classes(class_id),
    name             VARCHAR(100) NOT NULL,
    short_code       VARCHAR(20),
    description      TEXT,

    -- Core stats
    hull_integrity   INTEGER DEFAULT 1000,
    shield_capacity  INTEGER DEFAULT 500,
    armor_rating     INTEGER DEFAULT 100,
    cargo_capacity   BIGINT DEFAULT 0,
    crew_capacity    SMALLINT DEFAULT 10,
    fuel_capacity    INTEGER DEFAULT 1000,

    -- Performance
    base_speed       INTEGER DEFAULT 1000,
    warp_speed       INTEGER DEFAULT 1,
    warp_charge_time NUMERIC(5,2) DEFAULT 5.0,
    maneuverability  SMALLINT DEFAULT 5 CHECK (maneuverability BETWEEN 1 AND 10),
    signature_radius INTEGER DEFAULT 100,

    -- Combat stats
    base_attack      INTEGER DEFAULT 0,
    base_defense     INTEGER DEFAULT 0,
    accuracy         INTEGER DEFAULT 100,
    evasion          NUMERIC(4,2) DEFAULT 0,
    critical_chance  NUMERIC(4,2) DEFAULT 0,
    critical_damage  NUMERIC(4,2) DEFAULT 1.5,
    shield_recharge  NUMERIC(4,2) DEFAULT 1.0,

    -- Slots
    weapon_hardpoints SMALLINT DEFAULT 0,
    defense_hardpoints SMALLINT DEFAULT 0,
    utility_hardpoints SMALLINT DEFAULT 0,
    engineering_slots  SMALLINT DEFAULT 0,
    fighter_bays       SMALLINT DEFAULT 0,

    -- Drive
    drive_type       drive_type DEFAULT 'impulse',
    drive_level_required INTEGER DEFAULT 1,

    -- Requirements
    required_technology   VARCHAR(100),
    required_tech_level   INTEGER DEFAULT 0,
    required_building     VARCHAR(100),
    required_building_lvl INTEGER DEFAULT 0,

    -- Costs
    metal_cost       BIGINT DEFAULT 1000,
    crystal_cost     BIGINT DEFAULT 500,
    deuterium_cost   BIGINT DEFAULT 100,
    build_time_sec   INTEGER DEFAULT 3600,

    -- Restrictions
    is_player_usable BOOLEAN DEFAULT true,
    is_npc_only      BOOLEAN DEFAULT false,
    min_command_level INTEGER DEFAULT 1,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hulls_class ON ship_hulls(class_id);
CREATE INDEX idx_hulls_drive ON ship_hulls(drive_type);
CREATE INDEX idx_hulls_player ON ship_hulls(is_player_usable) WHERE is_player_usable = true;
COMMENT ON TABLE ship_hulls IS 'Specific ship models with detailed stats, slot configurations, and build costs';
