-- Prestige System
-- Endgame progression with resets and permanent bonuses

CREATE TYPE prestige_perk_type AS ENUM (
    'starting_resource','production_bonus','research_speed','build_speed',
    'combat_bonus','defense_bonus','trade_bonus','colony_bonus',
    'fleet_capacity','commander_slot','special_unlock','permanent_upgrade'
);

CREATE TABLE prestige_levels (
    prestige_id      BIGSERIAL PRIMARY KEY,
    level            INTEGER NOT NULL,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,

    -- Requirements
    required_score   BIGINT NOT NULL,
    required_achievements INTEGER DEFAULT 0,
    required_colonies     INTEGER DEFAULT 1,
    required_civilization_tier INTEGER DEFAULT 1,

    -- Bonuses granted
    perks            JSONB DEFAULT '[]',
    stat_bonuses     JSONB DEFAULT '{}',

    -- Visual
    title            VARCHAR(100),
    title_color      VARCHAR(7),
    icon             VARCHAR(100),

    -- Meta
    sort_order       INTEGER DEFAULT 0,
    is_max           BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE empire_prestige (
    empire_id        BIGINT PRIMARY KEY REFERENCES empires(empire_id),
    prestige_level   INTEGER DEFAULT 0,
    total_prestige   BIGINT DEFAULT 0,
    prestige_points  INTEGER DEFAULT 0,
    perks_unlocked   TEXT[] DEFAULT '{}',
    prestige_history JSONB DEFAULT '[]',
    last_prestiged   TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prestige_perks (
    perk_id          BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    perk_type        prestige_perk_type NOT NULL,
    effect_value     NUMERIC(12,4) DEFAULT 0,
    max_stacks       INTEGER DEFAULT 1,
    cost_per_stack   INTEGER DEFAULT 1,
    prerequisite_perk_id BIGINT REFERENCES prestige_perks(perk_id),
    faction_id       BIGINT REFERENCES factions(faction_id),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE empire_prestige_perks (
    id               BIGSERIAL PRIMARY KEY,
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    perk_id          BIGINT NOT NULL REFERENCES prestige_perks(perk_id),
    stacks           INTEGER DEFAULT 1,
    unlocked_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(empire_id, perk_id)
);

CREATE INDEX idx_prestige_level ON prestige_levels(level);
CREATE INDEX idx_ep_prestige ON empire_prestige(prestige_level DESC);
CREATE INDEX idx_pp_type ON prestige_perks(perk_type);
COMMENT ON TABLE prestige_levels IS 'Prestige tiers with requirements and permanent bonuses';
COMMENT ON TABLE empire_prestige IS 'Per-empire prestige level and point tracking';
COMMENT ON TABLE prestige_perks IS 'Purchasable prestige perks providing permanent bonuses';
COMMENT ON TABLE empire_prestige_perks IS 'Per-empire unlocked prestige perks';
