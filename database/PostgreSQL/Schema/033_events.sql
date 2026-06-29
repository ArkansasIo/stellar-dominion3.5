-- Events
-- Dynamic game events, incursions, and time-limited content

CREATE TYPE event_category AS ENUM (
    'incursion','invasion','discovery','crisis','competition','celebration',
    'story','seasonal','community','boss','trade_festival','research_breakthrough',
    'pirate_raids','alliance_war','galactic_summit','ancient_awakening'
);

CREATE TYPE event_status AS ENUM ('announced','active','completed','cancelled','archived');

CREATE TABLE events (
    event_id         BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         event_category NOT NULL,
    status           event_status DEFAULT 'announced',

    -- Timeline
    announced_at     TIMESTAMPTZ DEFAULT NOW(),
    starts_at        TIMESTAMPTZ NOT NULL,
    ends_at          TIMESTAMPTZ NOT NULL,
    duration_hours   INTEGER DEFAULT 24,

    -- Location
    location_type    VARCHAR(20),
    location_id      BIGINT,
    galaxy_id        BIGINT REFERENCES galaxies(galaxy_id),
    region_id        BIGINT REFERENCES regions(region_id),

    -- Requirements
    min_level        INTEGER DEFAULT 1,
    max_level        INTEGER DEFAULT 999,
    min_alliance_members INTEGER DEFAULT 1,
    required_faction_id BIGINT REFERENCES factions(faction_id),

    -- Rewards
    reward_credits   BIGINT DEFAULT 0,
    reward_resources JSONB DEFAULT '{}',
    reward_items     JSONB DEFAULT '{}',
    reward_blueprints JSONB DEFAULT '{}',
    participation_reward JSONB DEFAULT '{}',

    -- Progression
    current_progress BIGINT DEFAULT 0,
    goal_progress    BIGINT DEFAULT 1000000,
    tier_reached     SMALLINT DEFAULT 1,
    max_tiers        SMALLINT DEFAULT 10,

    -- Leaderboard
    has_leaderboard  BOOLEAN DEFAULT false,
    leaderboard_type VARCHAR(30),

    -- Meta
    is_recurring     BOOLEAN DEFAULT false,
    recurrence_days  INTEGER DEFAULT 0,
    image_url        VARCHAR(500),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_participants (
    participation_id BIGSERIAL PRIMARY KEY,
    event_id         BIGINT NOT NULL REFERENCES events(event_id),
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    score            BIGINT DEFAULT 0,
    rank             INTEGER,
    joined_at        TIMESTAMPTZ DEFAULT NOW(),
    last_activity    TIMESTAMPTZ DEFAULT NOW(),
    rewards_claimed  BOOLEAN DEFAULT false,
    UNIQUE(event_id, empire_id)
);

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_active ON events(starts_at, ends_at);
CREATE INDEX idx_ep_event ON event_participants(event_id);
CREATE INDEX idx_ep_empire ON event_participants(empire_id);
CREATE INDEX idx_ep_score ON event_participants(score DESC);
COMMENT ON TABLE events IS 'Dynamic game events including incursions, competitions, and story-driven content';
COMMENT ON TABLE event_participants IS 'Tracks empire participation and scoring in events';
