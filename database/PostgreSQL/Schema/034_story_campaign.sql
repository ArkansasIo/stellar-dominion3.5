-- Story Campaign
-- Main storyline missions and chapters

CREATE TYPE campaign_status AS ENUM ('locked','unlocked','active','completed','archived');

CREATE TABLE story_campaigns (
    campaign_id      BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    chapter_number   INTEGER NOT NULL,
    mission_count    INTEGER DEFAULT 0,
    is_final_chapter BOOLEAN DEFAULT false,
    requires_campaign_id BIGINT REFERENCES story_campaigns(campaign_id),
    min_level        INTEGER DEFAULT 1,
    min_tier         INTEGER DEFAULT 1,
    faction_id       BIGINT REFERENCES factions(faction_id),
    status           campaign_status DEFAULT 'locked',
    sort_order       INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE story_missions (
    mission_id       BIGSERIAL PRIMARY KEY,
    campaign_id      BIGINT NOT NULL REFERENCES story_campaigns(campaign_id),
    mission_number   INTEGER NOT NULL,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    objectives       JSONB NOT NULL DEFAULT '[]',
    completion_rewards JSONB DEFAULT '{}',
    failure_penalty  JSONB DEFAULT '{}',
    time_limit_sec   INTEGER DEFAULT 0,
    location_type    VARCHAR(20),
    location_id      BIGINT,
    requires_mission_id BIGINT REFERENCES story_missions(mission_id),
    sort_order       INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sc_campaign ON story_missions(campaign_id);
CREATE INDEX idx_sc_requires ON story_missions(requires_mission_id);
COMMENT ON TABLE story_campaigns IS 'Story campaign chapters with progressive mission structures';
COMMENT ON TABLE story_missions IS 'Individual storyline missions with objectives and rewards';
