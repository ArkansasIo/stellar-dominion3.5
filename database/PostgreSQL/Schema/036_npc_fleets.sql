-- NPC Fleets
-- Pre-defined NPC fleet templates for PvE encounters

CREATE TYPE npc_difficulty AS ENUM ('trivial','easy','moderate','hard','very_hard','elite','boss','legendary');

CREATE TYPE npc_behavior AS ENUM ('patrol','guard','hunt','flee','ambush','escort','raid','stationary');

CREATE TABLE npc_fleets (
    npc_fleet_id     BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    faction_id       BIGINT REFERENCES factions(faction_id),
    difficulty       npc_difficulty DEFAULT 'easy',

    -- Location
    spawn_system_id  BIGINT REFERENCES star_systems(system_id),
    spawn_region_id  BIGINT REFERENCES regions(region_id),
    patrol_radius    INTEGER DEFAULT 10,

    -- Behavior
    behavior         npc_behavior DEFAULT 'patrol',
    aggro_range      INTEGER DEFAULT 5,
    respawn_time_sec INTEGER DEFAULT 300,
    max_spawns       INTEGER DEFAULT 1,

    -- Fleet composition
    ship_composition JSONB NOT NULL DEFAULT '[]',
    total_power      BIGINT DEFAULT 0,

    -- Combat stats
    attack           INTEGER DEFAULT 100,
    defense          INTEGER DEFAULT 100,
    shield           INTEGER DEFAULT 100,
    hull             INTEGER DEFAULT 1000,
    speed            INTEGER DEFAULT 100,
    accuracy         INTEGER DEFAULT 100,
    evasion          NUMERIC(4,2) DEFAULT 0,

    -- Loot
    loot_credits     BIGINT DEFAULT 0,
    loot_resources   JSONB DEFAULT '{}',
    loot_items       JSONB DEFAULT '[]',
    loot_blueprints  JSONB DEFAULT '[]',
    experience_reward BIGINT DEFAULT 0,

    -- Requirements
    min_level        INTEGER DEFAULT 1,
    max_level        INTEGER DEFAULT 999,
    is_boss          BOOLEAN DEFAULT false,
    is_raid_target   BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_npc_faction ON npc_fleets(faction_id);
CREATE INDEX idx_npc_difficulty ON npc_fleets(difficulty);
CREATE INDEX idx_npc_system ON npc_fleets(spawn_system_id);
CREATE INDEX idx_npc_boss ON npc_fleets(is_boss) WHERE is_boss = true;
COMMENT ON TABLE npc_fleets IS 'Pre-configured NPC fleet templates for PvE combat encounters';
