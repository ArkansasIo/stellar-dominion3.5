-- Pirates
-- Hostile NPC factions that raid trade routes and can be hunted for bounties

CREATE TYPE pirate_activity AS ENUM ('idle','patrolling','raiding','hunting','fleeing','ambushing');

CREATE TABLE pirates (
    pirate_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    faction_id       BIGINT REFERENCES factions(faction_id),
    territory_id     BIGINT REFERENCES regions(region_id),

    -- Strength
    power_level      BIGINT DEFAULT 1000,
    difficulty       npc_difficulty DEFAULT 'moderate',
    activity         pirate_activity DEFAULT 'patrolling',

    -- Fleet
    fleet_composition JSONB NOT NULL DEFAULT '[]',
    ship_count       INTEGER DEFAULT 5,

    -- Behavior
    aggro_range      INTEGER DEFAULT 3,
    raid_radius      INTEGER DEFAULT 10,
    respawn_time_sec INTEGER DEFAULT 600,
    max_active       INTEGER DEFAULT 5,

    -- Bounty
    bounty_credits   BIGINT DEFAULT 100,
    bounty_items     JSONB DEFAULT '[]',
    bounty_experience BIGINT DEFAULT 50,
    bounty_reputation INTEGER DEFAULT 5,

    -- Requirements
    min_level        INTEGER DEFAULT 1,
    max_level        INTEGER DEFAULT 999,
    requires_quest   BIGINT REFERENCES quests(quest_id),

    -- Meta
    is_eliminated    BOOLEAN DEFAULT false,
    eliminated_by    BIGINT REFERENCES empires(empire_id),
    eliminated_at    TIMESTAMPTZ,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pirates_faction ON pirates(faction_id);
CREATE INDEX idx_pirates_territory ON pirates(territory_id);
CREATE INDEX idx_pirates_difficulty ON pirates(difficulty);
CREATE INDEX idx_pirates_active ON pirates(is_eliminated) WHERE is_eliminated = false;
COMMENT ON TABLE pirates IS 'Hostile pirate factions that raid and can be hunted for bounties';
