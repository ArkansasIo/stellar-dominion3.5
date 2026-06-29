-- Factions
-- Major and minor factions that control territory and offer reputations

CREATE TYPE faction_government AS ENUM (
    'republic','empire','dictatorship','oligarchy','theocracy','democracy',
    'anarchy','corporatocracy','hive_mind','collective','federation','monarchy',
    'technocracy','meritocracy','khanate','matriarchy'
);

CREATE TYPE faction_relationship AS ENUM ('ally','neutral','hostile','war','trade_partner','non_aggression','vassal','protectorate');

CREATE TABLE factions (
    faction_id        BIGSERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    description       TEXT,
    short_code        VARCHAR(10) UNIQUE,
    government_type   faction_government DEFAULT 'republic',
    home_galaxy_id    BIGINT REFERENCES galaxies(galaxy_id),
    home_region_id    BIGINT REFERENCES regions(region_id),
    home_system_id    BIGINT REFERENCES star_systems(system_id),
    species_id        BIGINT,
    color_primary     VARCHAR(7) DEFAULT '#FFFFFF',
    color_secondary   VARCHAR(7) DEFAULT '#000000',
    territory_size    INTEGER DEFAULT 0,
    military_power    BIGINT DEFAULT 0,
    economic_power    BIGINT DEFAULT 0,
    research_power    BIGINT DEFAULT 0,
    diplomat_power    BIGINT DEFAULT 0,
    is_player_playable BOOLEAN DEFAULT false,
    is_minor_faction  BOOLEAN DEFAULT false,
    is_ancient        BOOLEAN DEFAULT false,
    is_hostile_default BOOLEAN DEFAULT false,
    starting_relationship faction_relationship DEFAULT 'neutral',
    spawn_weight      NUMERIC(4,2) DEFAULT 1.0,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_factions_galaxy ON factions(home_galaxy_id);
CREATE INDEX idx_factions_species ON factions(species_id);
CREATE INDEX idx_factions_playable ON factions(is_player_playable) WHERE is_player_playable = true;
CREATE INDEX idx_factions_hostile ON factions(is_hostile_default) WHERE is_hostile_default = true;
COMMENT ON TABLE factions IS 'Political entities controlling territory, offering missions, and engaging in diplomacy';
