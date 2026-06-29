-- Resources
-- All resource types in the game economy

CREATE TYPE resource_category AS ENUM (
    'basic','advanced','rare','exotic','refined','special','currency','consumable','premium'
);

CREATE TYPE resource_tier AS ENUM ('t1','t2','t3','t4','t5','t6','t7','t8');

CREATE TABLE resources (
    resource_id       BIGSERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    category          resource_category NOT NULL,
    tier              resource_tier DEFAULT 't1',

    -- Economy
    base_value        NUMERIC(10,2) DEFAULT 1.0,
    stack_limit       BIGINT DEFAULT 999999999,
    weight_per_unit   NUMERIC(8,2) DEFAULT 1.0,
    volume_per_unit   NUMERIC(8,2) DEFAULT 1.0,

    -- Mining
    mining_difficulty SMALLINT DEFAULT 1 CHECK (mining_difficulty BETWEEN 1 AND 10),
    refinery_multiplier NUMERIC(4,2) DEFAULT 1.0,

    -- Trade
    is_tradeable      BOOLEAN DEFAULT true,
    is_market_listed  BOOLEAN DEFAULT false,
    base_market_price NUMERIC(12,2) DEFAULT 0,

    -- Usage
    is_used_in_construction BOOLEAN DEFAULT false,
    is_used_in_research     BOOLEAN DEFAULT false,
    is_used_in_manufacturing BOOLEAN DEFAULT false,
    is_used_in_shipbuilding  BOOLEAN DEFAULT false,
    is_fuel                BOOLEAN DEFAULT false,
    is_ammunition          BOOLEAN DEFAULT false,

    -- Special
    is_premium        BOOLEAN DEFAULT false,
    is_contraband     BOOLEAN DEFAULT false,
    requires_refining BOOLEAN DEFAULT false,
    refining_input_id BIGINT REFERENCES resources(resource_id),
    refining_ratio    NUMERIC(4,2) DEFAULT 1.0,

    short_code        VARCHAR(10) UNIQUE,
    icon              VARCHAR(100),

    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_tier ON resources(tier);
CREATE INDEX idx_resources_tradeable ON resources(is_tradeable) WHERE is_tradeable = true;
CREATE INDEX idx_resources_premium ON resources(is_premium) WHERE is_premium = true;
COMMENT ON TABLE resources IS 'All game resources from basic ores to exotic matter and premium currencies';
