-- Blueprints
-- Schematics required to build advanced ships, modules, and buildings

CREATE TYPE blueprint_category AS ENUM ('ship','module','weapon','building','item','technology','defense');

CREATE TYPE blueprint_rarity AS ENUM ('common','uncommon','rare','epic','legendary','ancient','forgotten');

CREATE TABLE blueprints (
    blueprint_id     BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         blueprint_category NOT NULL,
    rarity           blueprint_rarity DEFAULT 'common',

    -- Target
    target_type      VARCHAR(50) NOT NULL,
    target_id        BIGINT NOT NULL,

    -- Research
    research_cost     INTEGER DEFAULT 1000,
    success_rate      NUMERIC(4,2) DEFAULT 0.5,
    max_runs          INTEGER DEFAULT 1,
    current_runs      INTEGER DEFAULT 0,
    is_infinite       BOOLEAN DEFAULT false,

    -- Requirements
    required_lab_level  INTEGER DEFAULT 1,
    required_skill      VARCHAR(50),
    required_skill_lvl  INTEGER DEFAULT 1,
    prerequisite_bp_id  BIGINT REFERENCES blueprints(blueprint_id),

    -- Material cost per run
    metal_cost       BIGINT DEFAULT 100,
    crystal_cost     BIGINT DEFAULT 50,
    deuterium_cost   BIGINT DEFAULT 0,
    special_materials JSONB DEFAULT '{}',

    -- Time
    research_time_sec INTEGER DEFAULT 3600,
    build_time_sec    INTEGER DEFAULT 3600,

    -- Meta
    is_discoverable  BOOLEAN DEFAULT true,
    is_tradeable     BOOLEAN DEFAULT false,
    faction_id       BIGINT REFERENCES factions(faction_id),
    origin           VARCHAR(100),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blueprints_category ON blueprints(category);
CREATE INDEX idx_blueprints_rarity ON blueprints(rarity);
CREATE INDEX idx_blueprints_target ON blueprints(target_type, target_id);
CREATE INDEX idx_blueprints_faction ON blueprints(faction_id);
COMMENT ON TABLE blueprints IS 'Schematics required to construct advanced ships, modules, buildings, and items';
