-- Alliances
-- Player-created groups for cooperation, warfare, and shared progression

CREATE TYPE alliance_role AS ENUM ('member','officer','general','director','vice_leader','leader','founder');

CREATE TABLE alliances (
    alliance_id      BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL UNIQUE,
    short_tag        VARCHAR(10) UNIQUE,
    description      TEXT,
    motto            VARCHAR(200),
    home_system_id   BIGINT REFERENCES star_systems(system_id),
    faction_id       BIGINT REFERENCES factions(faction_id),

    -- Stats
    level            INTEGER DEFAULT 1,
    experience       BIGINT DEFAULT 0,
    member_count     INTEGER DEFAULT 0,
    max_members      INTEGER DEFAULT 10,

    -- Scores
    total_score      BIGINT DEFAULT 0,
    economy_score    BIGINT DEFAULT 0,
    research_score   BIGINT DEFAULT 0,
    military_score   BIGINT DEFAULT 0,

    -- Resources
    treasury_credits NUMERIC(18,2) DEFAULT 0,
    treasury_metal   NUMERIC(18,2) DEFAULT 0,
    treasury_crystal NUMERIC(18,2) DEFAULT 0,
    treasury_deuterium NUMERIC(18,2) DEFAULT 0,

    -- Shared research
    shared_tech_levels JSONB DEFAULT '{}',
    unlocked_perks   TEXT[],

    -- Territory
    controlled_systems INTEGER DEFAULT 0,
    capital_station_id BIGINT REFERENCES space_stations(station_id),

    -- War
    war_count        INTEGER DEFAULT 0,
    victory_count    INTEGER DEFAULT 0,
    is_at_war        BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW(),
    disbanded_at     TIMESTAMPTZ
);

CREATE TABLE alliance_members (
    member_id        BIGSERIAL PRIMARY KEY,
    alliance_id      BIGINT NOT NULL REFERENCES alliances(alliance_id),
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    role             alliance_role DEFAULT 'member',
    joined_at        TIMESTAMPTZ DEFAULT NOW(),
    last_active      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alliance_id, empire_id)
);

CREATE INDEX idx_alliances_score ON alliances(total_score DESC);
CREATE INDEX idx_alliances_faction ON alliances(faction_id);
CREATE INDEX idx_am_alliance ON alliance_members(alliance_id);
CREATE INDEX idx_am_empire ON alliance_members(empire_id);
COMMENT ON TABLE alliances IS 'Player alliances for cooperative gameplay, shared resources, and territory control';
COMMENT ON TABLE alliance_members IS 'Membership and role assignments within alliances';
