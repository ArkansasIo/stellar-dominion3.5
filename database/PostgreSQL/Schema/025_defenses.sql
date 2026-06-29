-- Defenses
-- Planetary and orbital defensive structures

CREATE TYPE defense_category AS ENUM (
    'rocket_launcher','laser_turret','plasma_turret','ion_cannon','gauss_cannon',
    'railgun','missile_silo','point_defense','shield_dome','minefield',
    'orbital_battery','particle_cannon','quantum_barrier','planetary_shield',
    'interceptor_missile'
);

CREATE TABLE defenses (
    defense_id        BIGSERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    category          defense_category NOT NULL,

    -- Combat stats
    attack            INTEGER DEFAULT 10,
    defense           INTEGER DEFAULT 5,
    shield            INTEGER DEFAULT 5,
    hull              INTEGER DEFAULT 50,
    accuracy          INTEGER DEFAULT 100,
    range_au          NUMERIC(6,2) DEFAULT 0.5,

    -- Rapid fire (OGame mechanic)
    rapid_fire_against VARCHAR(100),

    -- Cost
    base_metal_cost   BIGINT DEFAULT 100,
    base_crystal_cost BIGINT DEFAULT 50,
    base_deuterium_cost BIGINT DEFAULT 0,
    growth_rate       NUMERIC(4,2) DEFAULT 2.0,
    build_time_sec    INTEGER DEFAULT 300,

    -- Requirements
    required_shipyard_level INTEGER DEFAULT 1,
    required_research    VARCHAR(100),
    required_research_lvl INTEGER DEFAULT 0,

    -- Special
    is_planetary      BOOLEAN DEFAULT true,
    is_orbital        BOOLEAN DEFAULT false,
    anti_fighter      BOOLEAN DEFAULT false,
    anti_missile      BOOLEAN DEFAULT false,
    shield_dome       BOOLEAN DEFAULT false,

    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_defenses_category ON defenses(category);
CREATE INDEX idx_defenses_planetary ON defenses(is_planetary) WHERE is_planetary = true;
COMMENT ON TABLE defenses IS 'Planetary and orbital defense systems for protecting colonies';
