-- Empires (Player Accounts)
-- Player-controlled empires with progression stats

CREATE TYPE empire_status AS ENUM ('active','vacation','frozen','banned','deleted');
CREATE TYPE empire_government AS ENUM (
    'anarchy','autocracy','oligarchy','democracy','republic','empire',
    'theocracy','technocracy','corporatocracy','collective','hive_mind'
);

CREATE TABLE empires (
    empire_id        BIGSERIAL PRIMARY KEY,
    account_id       BIGINT UNIQUE NOT NULL,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    species_id       BIGINT REFERENCES species(species_id),
    faction_id       BIGINT REFERENCES factions(faction_id),
    home_system_id   BIGINT REFERENCES star_systems(system_id),
    home_planet_id   BIGINT REFERENCES planets(planet_id),

    -- Status
    status           empire_status DEFAULT 'active',
    government       empire_government DEFAULT 'democracy',

    -- Progression
    level            INTEGER DEFAULT 1,
    experience       BIGINT DEFAULT 0,
    prestige_level   INTEGER DEFAULT 0,
    civilization_tier INTEGER DEFAULT 1,
    technology_age   INTEGER DEFAULT 1,

    -- Scores
    total_score      BIGINT DEFAULT 0,
    economy_score    BIGINT DEFAULT 0,
    research_score   BIGINT DEFAULT 0,
    military_score   BIGINT DEFAULT 0,
    fleet_score      BIGINT DEFAULT 0,
    defense_score    BIGINT DEFAULT 0,

    -- Resources
    credits          NUMERIC(18,2) DEFAULT 500.00,
    metal            NUMERIC(18,2) DEFAULT 500.00,
    crystal          NUMERIC(18,2) DEFAULT 300.00,
    deuterium        NUMERIC(18,2) DEFAULT 100.00,
    energy           NUMERIC(18,2) DEFAULT 100.00,
    dark_matter      NUMERIC(12,2) DEFAULT 0,

    -- Population
    population       BIGINT DEFAULT 100,
    max_population   BIGINT DEFAULT 200,
    happiness        SMALLINT DEFAULT 50 CHECK (happiness BETWEEN 0 AND 100),

    -- Colonies
    colony_count     SMALLINT DEFAULT 1,
    max_colonies     SMALLINT DEFAULT 1,

    -- Timers
    vacation_until   TIMESTAMPTZ,
    last_active      TIMESTAMPTZ DEFAULT NOW(),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_empires_faction ON empires(faction_id);
CREATE INDEX idx_empires_species ON empires(species_id);
CREATE INDEX idx_empires_score ON empires(total_score DESC);
CREATE INDEX idx_empires_status ON empires(status) WHERE status = 'active';
CREATE INDEX idx_empires_tier ON empires(civilization_tier);
COMMENT ON TABLE empires IS 'Player-controlled empires containing all progression data and resources';
