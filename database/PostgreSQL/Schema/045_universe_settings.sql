-- Universe Settings
-- Global configuration for the game universe

CREATE TYPE universe_speed AS ENUM ('slow','normal','fast','very_fast','extreme');
CREATE TYPE universe_type AS ENUM ('normal','warring_tribes','peaceful','hardcore','roleplay','event');

CREATE TABLE universe_settings (
    setting_id          BIGSERIAL PRIMARY KEY,
    universe_name       VARCHAR(100) NOT NULL DEFAULT 'Universe Civilization',
    universe_type       universe_type DEFAULT 'normal',

    -- Speed settings
    economy_speed       NUMERIC(4,2) DEFAULT 1.0,
    research_speed      NUMERIC(4,2) DEFAULT 1.0,
    fleet_speed         NUMERIC(4,2) DEFAULT 1.0,
    ship_build_speed    NUMERIC(4,2) DEFAULT 1.0,
    building_speed      NUMERIC(4,2) DEFAULT 1.0,
    defense_speed       NUMERIC(4,2) DEFAULT 1.0,
    cargo_speed         NUMERIC(4,2) DEFAULT 1.0,
    resource_multiplier NUMERIC(4,2) DEFAULT 1.0,
    energy_multiplier   NUMERIC(4,2) DEFAULT 1.0,

    -- Limits
    max_planets         SMALLINT DEFAULT 9,
    max_colonies        SMALLINT DEFAULT 9,
    max_fleets          SMALLINT DEFAULT 20,
    max_alliance_members SMALLINT DEFAULT 100,
    max_galaxies        SMALLINT DEFAULT 1,
    max_players_per_system SMALLINT DEFAULT 1,

    -- Protection
    noob_protection_hours INTEGER DEFAULT 168,
    vacation_mode_delay_hr INTEGER DEFAULT 24,
    vm_minimum_duration_hr INTEGER DEFAULT 48,

    -- PvP
    pvp_enabled        BOOLEAN DEFAULT true,
    pvp_bands_enabled  BOOLEAN DEFAULT true,
    pvp_score_ratio    NUMERIC(4,2) DEFAULT 2.0,
    war_declaration_cost BIGINT DEFAULT 100000,

    -- Market
    market_enabled     BOOLEAN DEFAULT true,
    market_tax_rate    NUMERIC(4,2) DEFAULT 0.05,
    market_order_duration_hr INTEGER DEFAULT 168,

    -- Galaxy
    galaxy_size        INTEGER DEFAULT 100,
    star_systems_per_galaxy INTEGER DEFAULT 10000,
    planets_per_system INTEGER DEFAULT 9,
    home_system_spread INTEGER DEFAULT 100,
    safe_zone_radius   INTEGER DEFAULT 10,

    -- Debris
    debris_field_rate  NUMERIC(4,2) DEFAULT 0.3,
    debris_recycling_rate NUMERIC(4,2) DEFAULT 0.5,

    -- Raiding
    raid_max_percentage NUMERIC(4,2) DEFAULT 0.5,
    raid_losses         BOOLEAN DEFAULT true,

    -- Time
    account_inactivity_days INTEGER DEFAULT 35,
    vacation_inactivity_days INTEGER DEFAULT 365,
    delete_account_days     INTEGER DEFAULT 7,

    -- New account
    starting_credits   NUMERIC(12,2) DEFAULT 500,
    starting_metal     NUMERIC(12,2) DEFAULT 500,
    starting_crystal   NUMERIC(12,2) DEFAULT 300,
    starting_deuterium NUMERIC(12,2) DEFAULT 100,
    starting_energy    NUMERIC(12,2) DEFAULT 100,
    starting_dark_matter NUMERIC(12,2) DEFAULT 0,

    -- Meta
    is_active          BOOLEAN DEFAULT true,
    maintenance_mode   BOOLEAN DEFAULT false,
    version            VARCHAR(20) DEFAULT '1.0.0',
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE universe_settings IS 'Global universe configuration affecting all gameplay parameters';
