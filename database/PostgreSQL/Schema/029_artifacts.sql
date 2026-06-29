-- Artifacts
-- Ancient and powerful items with unique effects

CREATE TYPE artifact_category AS ENUM (
    'ancient','alien','precursor','forerunner','guardian','void',
    'temporal','dimensional','stellar','civilization'
);

CREATE TABLE artifacts (
    artifact_id      BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         artifact_category DEFAULT 'ancient',

    -- Power
    power_level      SMALLINT DEFAULT 1 CHECK (power_level BETWEEN 1 AND 100),
    rarity           blueprint_rarity DEFAULT 'legendary',

    -- Effects
    primary_effect   VARCHAR(50),
    primary_value    NUMERIC(12,4) DEFAULT 0,
    secondary_effect VARCHAR(50),
    secondary_value  NUMERIC(12,4) DEFAULT 0,
    passive_effect   VARCHAR(50),
    passive_value    NUMERIC(8,2) DEFAULT 0,

    -- Requirements
    requires_research VARCHAR(100),
    requires_level    INTEGER DEFAULT 1,
    alignment         VARCHAR(30),

    -- Collection
    set_id           BIGINT,
    set_bonus_desc   TEXT,

    -- Meta
    is_equippable    BOOLEAN DEFAULT true,
    is_consumable    BOOLEAN DEFAULT false,
    is_unique        BOOLEAN DEFAULT true,
    max_charges      INTEGER DEFAULT 0,
    current_charges  INTEGER DEFAULT 0,
    recharge_time_hr INTEGER DEFAULT 24,

    -- Origin
    origin_system_id BIGINT REFERENCES star_systems(system_id),
    faction_id       BIGINT REFERENCES factions(faction_id),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artifacts_category ON artifacts(category);
CREATE INDEX idx_artifacts_power ON artifacts(power_level DESC);
CREATE INDEX idx_artifacts_set ON artifacts(set_id);
COMMENT ON TABLE artifacts IS 'Ancient and powerful items providing unique effects that can be equipped or consumed';
