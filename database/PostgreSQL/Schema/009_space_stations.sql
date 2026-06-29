-- Space Stations
-- Orbital facilities for trade, defense, research, and fleet operations

CREATE TYPE station_class AS ENUM (
    'outpost','trading_post','research_station','military_base','shipyard',
    'refinery','mining_colony','trade_hub','fleet_depot','science_post',
    'diplomatic_center','defense_platform','orbital_citadel','deep_space_dock',
    'quantum_gate','ancient_relay'
);

CREATE TYPE station_size AS ENUM ('small','medium','large','huge','massive');

CREATE TABLE space_stations (
    station_id       BIGSERIAL PRIMARY KEY,
    system_id        BIGINT NOT NULL REFERENCES star_systems(system_id),
    region_id        BIGINT REFERENCES regions(region_id),
    orbit_planet_id  BIGINT REFERENCES planets(planet_id),
    name             VARCHAR(100) NOT NULL,
    station_class    station_class DEFAULT 'outpost',
    station_size     station_size DEFAULT 'small',
    faction_owner_id BIGINT,
    alliance_owner_id BIGINT,
    hull_integrity   INTEGER DEFAULT 10000,
    shield_capacity  INTEGER DEFAULT 5000,
    defense_rating   INTEGER DEFAULT 100,
    docking_bays     SMALLINT DEFAULT 5,
    cargo_capacity   BIGINT DEFAULT 100000,
    market_enabled   BOOLEAN DEFAULT false,
    has_shipyard     BOOLEAN DEFAULT false,
    has_refinery     BOOLEAN DEFAULT false,
    has_research_lab BOOLEAN DEFAULT false,
    has_repair_bay   BOOLEAN DEFAULT false,
    level            SMALLINT DEFAULT 1,
    x                INTEGER,
    y                INTEGER,
    z                INTEGER,
    is_capital       BOOLEAN DEFAULT false,
    is_neutral       BOOLEAN DEFAULT true,
    description      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stations_system ON space_stations(system_id);
CREATE INDEX idx_stations_class ON space_stations(station_class);
CREATE INDEX idx_stations_owner ON space_stations(faction_owner_id);
CREATE INDEX idx_stations_alliance ON space_stations(alliance_owner_id);
CREATE INDEX idx_stations_capital ON space_stations(is_capital) WHERE is_capital = true;
COMMENT ON TABLE space_stations IS 'Orbital and deep space facilities serving as hubs for player activity';
