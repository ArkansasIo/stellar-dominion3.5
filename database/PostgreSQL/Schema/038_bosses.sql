-- Bosses
-- Powerful unique NPC entities requiring coordinated fleet actions

CREATE TYPE boss_category AS ENUM (
    'space_monster','ancient_guardian','void_entity','faction_flagship',
    'megastructure_core','pirate_warlord','rogue_ai','dimensional_being',
    'stellar_leviathan','galactic_tyrant'
);

CREATE TYPE boss_status AS ENUM ('spawning','active','engaged','defeated','on_cooldown');

CREATE TABLE bosses (
    boss_id          BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         boss_category DEFAULT 'space_monster',
    status           boss_status DEFAULT 'spawning',

    -- Location
    spawn_system_id  BIGINT NOT NULL REFERENCES star_systems(system_id),
    spawn_region_id  BIGINT REFERENCES regions(region_id),
    spawn_location   VARCHAR(50),

    -- Combat stats
    power_level      BIGINT DEFAULT 100000,
    attack           INTEGER DEFAULT 1000,
    defense          INTEGER DEFAULT 1000,
    shield           INTEGER DEFAULT 10000,
    hull             INTEGER DEFAULT 100000,
    speed            INTEGER DEFAULT 50,
    accuracy         INTEGER DEFAULT 500,
    evasion          NUMERIC(4,2) DEFAULT 0.1,

    -- Abilities
    abilities        JSONB DEFAULT '[]',
    phases           SMALLINT DEFAULT 1,
    current_phase    SMALLINT DEFAULT 1,

    -- Rewards
    guaranteed_drops JSONB DEFAULT '{}',
    loot_table       JSONB DEFAULT '{}',
    experience_reward BIGINT DEFAULT 10000,
    reputation_reward INTEGER DEFAULT 100,

    -- Spawn
    spawn_window_start TIMESTAMPTZ,
    spawn_window_end   TIMESTAMPTZ,
    respawn_cooldown_hr INTEGER DEFAULT 168,
    despawn_if_unengaged INTEGER DEFAULT 2,

    -- Engagement
    engaged_by       BIGINT REFERENCES empires(empire_id),
    engaged_at       TIMESTAMPTZ,
    participants     INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 20,
    min_participants INTEGER DEFAULT 1,
    min_level        INTEGER DEFAULT 50,

    -- Meta
    is_world_boss    BOOLEAN DEFAULT false,
    is_story_boss    BOOLEAN DEFAULT false,
    defeated_count   INTEGER DEFAULT 0,
    first_defeated_by BIGINT REFERENCES alliances(alliance_id),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bosses_system ON bosses(spawn_system_id);
CREATE INDEX idx_bosses_category ON bosses(category);
CREATE INDEX idx_bosses_status ON bosses(status);
CREATE INDEX idx_bosses_active ON bosses(status) WHERE status IN ('spawning','active','engaged');
COMMENT ON TABLE bosses IS 'Powerful boss entities requiring coordinated group efforts to defeat';
