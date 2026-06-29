-- Achievements
-- Trackable achievements and milestones with rewards

CREATE TYPE achievement_category AS ENUM (
    'exploration','combat','economy','research','building','social',
    'collection','progression','special','event','hidden','prestige'
);

CREATE TYPE achievement_rarity AS ENUM ('common','uncommon','rare','epic','legendary','secret','mythic');

CREATE TABLE achievements (
    achievement_id   BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         achievement_category NOT NULL,
    rarity           achievement_rarity DEFAULT 'common',

    -- Requirements
    requirement_type   VARCHAR(50) NOT NULL,
    requirement_target VARCHAR(100),
    requirement_value  BIGINT NOT NULL,

    -- Progression tracking
    is_progressive     BOOLEAN DEFAULT false,
    max_progress       INTEGER DEFAULT 1,
    incremental_rewards BOOLEAN DEFAULT false,

    -- Rewards
    reward_credits     BIGINT DEFAULT 0,
    reward_experience  BIGINT DEFAULT 0,
    reward_prestige    INTEGER DEFAULT 0,
    reward_items       JSONB DEFAULT '[]',
    reward_title       VARCHAR(100),
    reward_badge       VARCHAR(100),

    -- Meta
    is_hidden          BOOLEAN DEFAULT false,
    secret_hint        TEXT,
    faction_id         BIGINT REFERENCES factions(faction_id),

    created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE empire_achievements (
    id                BIGSERIAL PRIMARY KEY,
    empire_id         BIGINT NOT NULL REFERENCES empires(empire_id),
    achievement_id    BIGINT NOT NULL REFERENCES achievements(achievement_id),
    progress          BIGINT DEFAULT 0,
    is_completed      BOOLEAN DEFAULT false,
    completed_at      TIMESTAMPTZ,
    rewards_claimed   BOOLEAN DEFAULT false,
    UNIQUE(empire_id, achievement_id)
);

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);
CREATE INDEX idx_ea_empire ON empire_achievements(empire_id);
CREATE INDEX idx_ea_completed ON empire_achievements(is_completed) WHERE is_completed = true;
COMMENT ON TABLE achievements IS 'Achievements tracking player milestones with rewards';
COMMENT ON TABLE empire_achievements IS 'Per-empire achievement progress and completion tracking';
