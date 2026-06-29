-- Research Tree
-- Technologies that can be researched for permanent empire-wide upgrades

CREATE TYPE research_category AS ENUM (
    'mining','economy','civilian','industrial','military','engineering',
    'weapons','armor','shield','energy','propulsion','quantum',
    'artificial_intelligence','terraforming','warp_physics','nanotechnology',
    'cybernetics','ancient_technology','dark_matter','diplomacy','espionage',
    'biology','physics','chemistry','computing','materials'
);

CREATE TYPE research_tier AS ENUM ('basic','advanced','expert','master','transcendent','ancient');

CREATE TABLE research_tree (
    research_id       BIGSERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    category          research_category NOT NULL,
    tier              research_tier DEFAULT 'basic',

    -- Leveling
    max_level         INTEGER DEFAULT 20,
    current_level     INTEGER DEFAULT 0,

    -- Cost scaling
    base_metal_cost   BIGINT DEFAULT 200,
    base_crystal_cost BIGINT DEFAULT 100,
    base_deuterium_cost BIGINT DEFAULT 50,
    cost_growth_rate  NUMERIC(4,2) DEFAULT 1.5,
    base_time_sec     INTEGER DEFAULT 300,
    time_growth_rate  NUMERIC(4,2) DEFAULT 1.5,

    -- Prerequisites
    requires_research_id BIGINT REFERENCES research_tree(research_id),
    requires_research_level INTEGER DEFAULT 0,
    requires_building     VARCHAR(100),
    requires_building_lvl INTEGER DEFAULT 0,

    -- Effects (per level)
    effect_type       VARCHAR(50),
    effect_base       NUMERIC(10,4) DEFAULT 0,
    effect_per_level  NUMERIC(10,4) DEFAULT 0,

    -- Display
    icon              VARCHAR(100),
    sort_order        INTEGER DEFAULT 0,

    -- Meta
    is_visible        BOOLEAN DEFAULT true,
    is_unique         BOOLEAN DEFAULT false,
    technology_age    INTEGER DEFAULT 1,

    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_category ON research_tree(category);
CREATE INDEX idx_research_tier ON research_tree(tier);
CREATE INDEX idx_research_prereq ON research_tree(requires_research_id);
CREATE INDEX idx_research_age ON research_tree(technology_age);
COMMENT ON TABLE research_tree IS 'Researchable technologies providing permanent stat bonuses, unlocks, and capabilities';
