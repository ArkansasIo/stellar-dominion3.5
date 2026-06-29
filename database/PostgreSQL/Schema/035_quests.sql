-- Quests
-- Side missions, daily quests, and achievement-based objectives

CREATE TYPE quest_category AS ENUM (
    'daily','weekly','monthly','side','faction','alliance','exploration',
    'combat','mining','trade','research','building','social','event','tutorial'
);

CREATE TYPE quest_status AS ENUM ('available','active','completed','failed','expired','claimed');

CREATE TYPE quest_goal_type AS ENUM (
    'gather','build','research','kill','explore','trade','reach_level',
    'win_battle','salvage','scan','colonize','produce','espionage','diplomacy'
);

CREATE TABLE quests (
    quest_id         BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         quest_category NOT NULL,

    -- Goals
    goal_type        quest_goal_type NOT NULL,
    goal_target      VARCHAR(100),
    goal_quantity    INTEGER DEFAULT 1,
    goal_current     INTEGER DEFAULT 0,

    -- Rewards
    reward_credits   BIGINT DEFAULT 0,
    reward_metal     BIGINT DEFAULT 0,
    reward_crystal   BIGINT DEFAULT 0,
    reward_deuterium BIGINT DEFAULT 0,
    reward_experience BIGINT DEFAULT 0,
    reward_items     JSONB DEFAULT '[]',
    reward_prestige  INTEGER DEFAULT 0,

    -- Requirements
    min_level        INTEGER DEFAULT 1,
    requires_quest_id BIGINT REFERENCES quests(quest_id),
    faction_id       BIGINT REFERENCES factions(faction_id),

    -- Timing
    time_limit_sec   INTEGER DEFAULT 0,
    is_repeatable    BOOLEAN DEFAULT false,
    repeat_cooldown_hr INTEGER DEFAULT 0,

    -- Meta
    auto_complete    BOOLEAN DEFAULT false,
    hidden_until_complete BOOLEAN DEFAULT false,
    sort_order       INTEGER DEFAULT 0,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quests_category ON quests(category);
CREATE INDEX idx_quests_faction ON quests(faction_id);
CREATE INDEX idx_quests_repeatable ON quests(is_repeatable) WHERE is_repeatable = true;
COMMENT ON TABLE quests IS 'Side missions, daily/weekly quests, and faction assignments';
