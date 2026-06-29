-- Species
-- Playable and non-playable species with unique traits and bonuses

CREATE TYPE species_category AS ENUM ('humanoid','reptilian','avian','insectoid','aquatic','crystalline','mechanical','energy','fungal','symbiotic');

CREATE TABLE species (
    species_id       BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         species_category DEFAULT 'humanoid',
    homeworld_id     BIGINT REFERENCES planets(planet_id),
    faction_id       BIGINT REFERENCES factions(faction_id),
    is_playable      BOOLEAN DEFAULT false,
    average_lifespan INTEGER DEFAULT 80,
    reproduction_rate NUMERIC(4,2) DEFAULT 1.0,
    base_strength    SMALLINT DEFAULT 5,
    base_intelligence SMALLINT DEFAULT 5,
    base_charisma    SMALLINT DEFAULT 5,

    -- Combat bonuses
    combat_bonus     NUMERIC(4,2) DEFAULT 0,
    defense_bonus    NUMERIC(4,2) DEFAULT 0,
    speed_bonus      NUMERIC(4,2) DEFAULT 0,

    -- Economic bonuses
    mining_bonus     NUMERIC(4,2) DEFAULT 0,
    trade_bonus      NUMERIC(4,2) DEFAULT 0,
    research_bonus   NUMERIC(4,2) DEFAULT 0,

    -- Special traits
    trait_1          VARCHAR(50),
    trait_2          VARCHAR(50),
    trait_3          VARCHAR(50),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_species_faction ON species(faction_id);
CREATE INDEX idx_species_playable ON species(is_playable) WHERE is_playable = true;
CREATE INDEX idx_species_category ON species(category);
COMMENT ON TABLE species IS 'Intelligent species with unique stat bonuses and roleplaying traits';
