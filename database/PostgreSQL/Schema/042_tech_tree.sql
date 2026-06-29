-- Technology Tree (Full Unlock System)
-- Complete technology unlock tree with dependencies and tiered progression

CREATE TYPE tech_unlock_type AS ENUM (
    'ship','module','weapon','building','defense','resource','item',
    'capability','perk','bonus','age_upgrade','faction_unlock'
);

CREATE TABLE technology_tree (
    tech_node_id     BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         research_category NOT NULL,
    tree_branch      VARCHAR(50),

    -- Position in tree (visual)
    tree_x           INTEGER DEFAULT 0,
    tree_y           INTEGER DEFAULT 0,
    tree_layer       INTEGER DEFAULT 1,

    -- Leveling
    max_level        INTEGER DEFAULT 1,
    current_level    INTEGER DEFAULT 0,

    -- Cost (cumulative)
    base_cost_metal      BIGINT DEFAULT 0,
    base_cost_crystal    BIGINT DEFAULT 0,
    base_cost_deuterium  BIGINT DEFAULT 0,
    base_cost_dark_matter BIGINT DEFAULT 0,
    cost_growth          NUMERIC(4,2) DEFAULT 2.0,
    research_time_base   INTEGER DEFAULT 3600,
    research_time_growth NUMERIC(4,2) DEFAULT 2.0,

    -- Prerequisites
    requires_node_1    BIGINT REFERENCES technology_tree(tech_node_id),
    requires_node_1_lvl INTEGER DEFAULT 0,
    requires_node_2    BIGINT REFERENCES technology_tree(tech_node_id),
    requires_node_2_lvl INTEGER DEFAULT 0,
    requires_building  VARCHAR(100),
    requires_building_lvl INTEGER DEFAULT 0,
    requires_age       INTEGER DEFAULT 1,

    -- Unlocks
    unlock_type        tech_unlock_type,
    unlock_target_type VARCHAR(50),
    unlock_target_id   BIGINT,

    -- Effects
    effect_description TEXT,
    stat_bonuses       JSONB DEFAULT '{}',

    -- Meta
    is_root            BOOLEAN DEFAULT false,
    is_capstone        BOOLEAN DEFAULT false,
    is_hidden          BOOLEAN DEFAULT false,
    faction_id         BIGINT REFERENCES factions(faction_id),

    created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tt_category ON technology_tree(category);
CREATE INDEX idx_tt_branch ON technology_tree(tree_branch);
CREATE INDEX idx_tt_prereq1 ON technology_tree(requires_node_1);
CREATE INDEX idx_tt_prereq2 ON technology_tree(requires_node_2);
CREATE INDEX idx_tt_age ON technology_tree(requires_age);
CREATE INDEX idx_tt_faction ON technology_tree(faction_id);
COMMENT ON TABLE technology_tree IS 'Complete technology unlock tree with dependencies, costs, and unlock effects';
