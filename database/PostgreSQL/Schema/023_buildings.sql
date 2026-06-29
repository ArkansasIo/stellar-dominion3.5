-- Buildings (Master Table)
-- All building types with costs, effects, and requirements

CREATE TYPE building_category AS ENUM (
    'resource','production','research','military','defense','storage',
    'infrastructure','civilian','orbital','special','wonder','governance'
);

CREATE TYPE resource_type AS ENUM ('metal','crystal','deuterium','energy','credits','dark_matter');

CREATE TABLE buildings (
    building_id       BIGSERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    category          building_category NOT NULL,
    short_code        VARCHAR(20),

    -- Leveling
    max_level         INTEGER DEFAULT 999,
    is_unique         BOOLEAN DEFAULT false,

    -- Cost scaling
    base_metal_cost   BIGINT DEFAULT 100,
    base_crystal_cost BIGINT DEFAULT 50,
    base_deuterium_cost BIGINT DEFAULT 0,
    growth_rate       NUMERIC(4,2) DEFAULT 1.5,
    base_time_sec     INTEGER DEFAULT 60,
    time_growth_rate  NUMERIC(4,2) DEFAULT 1.5,

    -- Production (resource buildings)
    base_production   NUMERIC(12,2) DEFAULT 0,
    production_growth NUMERIC(4,2) DEFAULT 1.1,

    -- Storage (storage buildings)
    base_storage      BIGINT DEFAULT 10000,
    storage_growth    NUMERIC(4,2) DEFAULT 2.0,

    -- Defense (defense buildings)
    base_attack       INTEGER DEFAULT 0,
    base_shield       INTEGER DEFAULT 0,
    base_armor        INTEGER DEFAULT 0,
    attack_growth     NUMERIC(4,2) DEFAULT 1.1,

    -- Energy
    energy_production INTEGER DEFAULT 0,
    energy_consumption INTEGER DEFAULT 0,
    energy_growth     NUMERIC(4,2) DEFAULT 1.1,

    -- Requirements
    requires_building_id BIGINT REFERENCES buildings(building_id),
    requires_building_level INTEGER DEFAULT 0,
    requires_research_id BIGINT REFERENCES research_tree(research_id),
    requires_research_level INTEGER DEFAULT 0,

    -- Slots
    build_slots       SMALLINT DEFAULT 1,
    max_per_planet    SMALLINT DEFAULT 1,

    -- Meta
    tier              SMALLINT DEFAULT 1,
    is_orbital        BOOLEAN DEFAULT false,
    can_deconstruct   BOOLEAN DEFAULT true,
    consumption_metal   NUMERIC(12,2) DEFAULT 0,
    consumption_crystal NUMERIC(12,2) DEFAULT 0,

    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_buildings_category ON buildings(category);
CREATE INDEX idx_buildings_tier ON buildings(tier);
CREATE INDEX idx_buildings_orbital ON buildings(is_orbital) WHERE is_orbital = true;
COMMENT ON TABLE buildings IS 'All constructible building types with complete cost, production, and requirement data';
