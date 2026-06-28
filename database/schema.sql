-- ============================================================================
-- Universe Civilization: Empires at War — Database Schema
-- Version: 1.2.0
-- Engine: PostgreSQL 16+
-- ============================================================================
-- This schema defines all tables, indexes, constraints, and relationships
-- for the game database. All JSON columns use JSONB for performance.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ACCOUNTS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(24) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verify_token VARCHAR(255),
    email_verify_token_expires_at TIMESTAMPTZ,
    password_reset_token VARCHAR(255),
    password_reset_token_expires_at TIMESTAMPTZ,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(512),
    locale VARCHAR(10) NOT NULL DEFAULT 'en-US',
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    ban_reason TEXT,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'player',
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- ============================================================================
-- 2. PLAYER PROFILES & EMPIRES
-- ============================================================================

CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(50) NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url VARCHAR(512),
    banner_url VARCHAR(512),
    title VARCHAR(100) DEFAULT '',
    rank VARCHAR(50) NOT NULL DEFAULT 'recruit',
    score BIGINT NOT NULL DEFAULT 0,
    power_level BIGINT NOT NULL DEFAULT 0,
    stats JSONB NOT NULL DEFAULT '{}',
    preferences JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE TABLE empires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(100) NOT NULL DEFAULT 'terran',
    government_type VARCHAR(50) NOT NULL DEFAULT 'democracy',
    flag_primary_color VARCHAR(7) NOT NULL DEFAULT '#1a1a2e',
    flag_secondary_color VARCHAR(7) NOT NULL DEFAULT '#e94560',
    flag_emblem VARCHAR(100) NOT NULL DEFAULT 'default',
    empire_level INTEGER NOT NULL DEFAULT 1,
    empire_experience BIGINT NOT NULL DEFAULT 0,
    prestige_level INTEGER NOT NULL DEFAULT 0,
    tier INTEGER NOT NULL DEFAULT 1,
    tier_experience BIGINT NOT NULL DEFAULT 0,
    kardashev_progress JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, universe_id)
);

CREATE TABLE player_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL,
    setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
    tutorial_step INTEGER NOT NULL DEFAULT 0,
    newbie_protection_until TIMESTAMPTZ,
    vacation_mode_until TIMESTAMPTZ,
    vacation_mode_active BOOLEAN NOT NULL DEFAULT FALSE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_resource_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total_turns_generated BIGINT NOT NULL DEFAULT 0,
    current_turns INTEGER NOT NULL DEFAULT 0,
    last_turn_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_officers JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, universe_id)
);

CREATE TABLE player_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL,
    galaxy_view_settings JSONB NOT NULL DEFAULT '{}',
    notification_settings JSONB NOT NULL DEFAULT '{}',
    ui_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, universe_id)
);

-- ============================================================================
-- 3. UNIVERSES & GALAXY GENERATION
-- ============================================================================

CREATE TABLE universes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    number INTEGER NOT NULL UNIQUE,
    realm_type VARCHAR(50) NOT NULL DEFAULT 'standard',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    game_speed REAL NOT NULL DEFAULT 1.0,
    resource_rate REAL NOT NULL DEFAULT 1.0,
    fleet_speed REAL NOT NULL DEFAULT 1.0,
    research_rate REAL NOT NULL DEFAULT 1.0,
    debris_field_factor REAL NOT NULL DEFAULT 0.3,
    newbie_protection_days INTEGER NOT NULL DEFAULT 7,
    max_planets INTEGER NOT NULL DEFAULT 9,
    max_galaxies INTEGER NOT NULL DEFAULT 9,
    max_solar_systems INTEGER NOT NULL DEFAULT 499,
    max_players INTEGER NOT NULL DEFAULT 10000,
    player_count INTEGER NOT NULL DEFAULT 0,
    pvp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    alliance_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    market_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    rules_url VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE galaxies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    galaxy_number INTEGER NOT NULL CHECK (galaxy_number BETWEEN 1 AND 9),
    name VARCHAR(100) NOT NULL,
    star_count INTEGER NOT NULL DEFAULT 0,
    resource_multiplier REAL NOT NULL DEFAULT 1.0,
    danger_level INTEGER NOT NULL DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (universe_id, galaxy_number)
);

CREATE TABLE solar_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    galaxy_id UUID NOT NULL REFERENCES galaxies(id) ON DELETE CASCADE,
    galaxy_number INTEGER NOT NULL CHECK (galaxy_number BETWEEN 1 AND 9),
    system_number INTEGER NOT NULL CHECK (system_number BETWEEN 1 AND 499),
    name VARCHAR(100) NOT NULL,
    star_type VARCHAR(50) NOT NULL,
    star_size VARCHAR(20) NOT NULL,
    planet_count INTEGER NOT NULL DEFAULT 0,
    moon_count INTEGER NOT NULL DEFAULT 0,
    total_fields INTEGER NOT NULL DEFAULT 200,
    occupied_fields INTEGER NOT NULL DEFAULT 0,
    resource_bonus REAL NOT NULL DEFAULT 1.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (universe_id, galaxy_number, system_number)
);

CREATE TABLE planets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    solar_system_id UUID NOT NULL REFERENCES solar_systems(id) ON DELETE CASCADE,
    galaxy_number INTEGER NOT NULL,
    system_number INTEGER NOT NULL,
    planet_number INTEGER NOT NULL CHECK (planet_number BETWEEN 1 AND 15),
    name VARCHAR(100) NOT NULL,
    planet_type VARCHAR(50) NOT NULL,
    diameter INTEGER NOT NULL,
    temperature_min INTEGER NOT NULL,
    temperature_max INTEGER NOT NULL,
    fields_available INTEGER NOT NULL DEFAULT 0,
    fields_total INTEGER NOT NULL DEFAULT 0,
    metal_multiplier REAL NOT NULL DEFAULT 1.0,
    crystal_multiplier REAL NOT NULL DEFAULT 1.0,
    deuterium_multiplier REAL NOT NULL DEFAULT 1.0,
    is_colonized BOOLEAN NOT NULL DEFAULT FALSE,
    is_home_planet BOOLEAN NOT NULL DEFAULT FALSE,
    image_url VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (universe_id, galaxy_number, system_number, planet_number)
);

CREATE TABLE moons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    planet_id UUID NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
    galaxy_number INTEGER NOT NULL,
    system_number INTEGER NOT NULL,
    planet_number INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    diameter INTEGER NOT NULL,
    fields_available INTEGER NOT NULL DEFAULT 0,
    fields_total INTEGER NOT NULL DEFAULT 0,
    chance REAL NOT NULL DEFAULT 0.0,
    image_url VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (planet_id)
);

-- ============================================================================
-- 4. COLONIES & BUILDINGS
-- ============================================================================

CREATE TABLE colonies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    planet_id UUID NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    colony_type VARCHAR(50) NOT NULL DEFAULT 'colony',
    population INTEGER NOT NULL DEFAULT 0,
    population_max INTEGER NOT NULL DEFAULT 1000,
    happiness INTEGER NOT NULL DEFAULT 50 CHECK (happiness BETWEEN 0 AND 100),
    energy_consumed INTEGER NOT NULL DEFAULT 0,
    energy_produced INTEGER NOT NULL DEFAULT 0,
    metal_stored BIGINT NOT NULL DEFAULT 0,
    crystal_stored BIGINT NOT NULL DEFAULT 0,
    deuterium_stored BIGINT NOT NULL DEFAULT 0,
    metal_capacity BIGINT NOT NULL DEFAULT 100000,
    crystal_capacity BIGINT NOT NULL DEFAULT 100000,
    deuterium_capacity BIGINT NOT NULL DEFAULT 100000,
    last_resource_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_capital BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empire_id, planet_id)
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colony_id UUID NOT NULL REFERENCES colonies(id) ON DELETE CASCADE,
    building_type VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (colony_id, building_type)
);

CREATE TABLE building_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colony_id UUID NOT NULL REFERENCES colonies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_type VARCHAR(100) NOT NULL,
    target_level INTEGER NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL,
    metal_cost INTEGER NOT NULL DEFAULT 0,
    crystal_cost INTEGER NOT NULL DEFAULT 0,
    deuterium_cost INTEGER NOT NULL DEFAULT 0,
    energy_cost INTEGER NOT NULL DEFAULT 0,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    queue_position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE moon_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moon_id UUID NOT NULL REFERENCES moons(id) ON DELETE CASCADE,
    colony_id UUID REFERENCES colonies(id) ON DELETE SET NULL,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'Lunar Base',
    buildings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (moon_id)
);

-- ============================================================================
-- 5. FLEETS & SHIPS
-- ============================================================================

CREATE TABLE fleets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'idle',
    mission_type VARCHAR(30),
    origin_colony_id UUID REFERENCES colonies(id) ON DELETE SET NULL,
    galaxy INTEGER NOT NULL,
    solar_system INTEGER NOT NULL,
    planet INTEGER NOT NULL,
    target_galaxy INTEGER,
    target_solar_system INTEGER,
    target_planet INTEGER,
    target_colony_id UUID REFERENCES colonies(id) ON DELETE SET NULL,
    speed INTEGER NOT NULL DEFAULT 100,
    fuel INTEGER NOT NULL DEFAULT 0,
    fuel_max INTEGER NOT NULL DEFAULT 0,
    cargo_capacity INTEGER NOT NULL DEFAULT 0,
    cargo_metal INTEGER NOT NULL DEFAULT 0,
    cargo_crystal INTEGER NOT NULL DEFAULT 0,
    cargo_deuterium INTEGER NOT NULL DEFAULT 0,
    departure_at TIMESTAMPTZ,
    arrival_at TIMESTAMPTZ,
    return_at TIMESTAMPTZ,
    combat_rounds INTEGER DEFAULT 0,
    combat_outcome VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ship_class VARCHAR(50) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    shield INTEGER NOT NULL,
    armor INTEGER NOT NULL,
    speed INTEGER NOT NULL,
    cargo_capacity INTEGER NOT NULL DEFAULT 0,
    fuel_consumption INTEGER NOT NULL DEFAULT 0,
    structural_integrity INTEGER NOT NULL DEFAULT 0,
    weapon_type VARCHAR(50),
    armor_type VARCHAR(50),
    rapid_fire_from JSONB DEFAULT '{}',
    rapid_fire_against JSONB DEFAULT '{}',
    required_resources JSONB NOT NULL,
    build_time INTEGER NOT NULL,
    tech_requirement VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (ship_class)
);

CREATE TABLE fleet_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
    ship_class VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (fleet_id, ship_class)
);

CREATE TABLE crew (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    experience INTEGER NOT NULL DEFAULT 0,
    morale INTEGER NOT NULL DEFAULT 100 CHECK (morale BETWEEN 0 AND 100),
    is_alive BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ship_fittings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
    ship_class VARCHAR(50) NOT NULL,
    slot_type VARCHAR(20) NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (fleet_id, ship_class, slot_type, module_id)
);

-- ============================================================================
-- 6. TECHNOLOGIES & RESEARCH
-- ============================================================================

CREATE TABLE research_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE research_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (area_id, name)
);

CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcategory_id UUID NOT NULL REFERENCES research_subcategories(id) ON DELETE CASCADE,
    tech_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_level INTEGER NOT NULL DEFAULT 1,
    base_cost_metal BIGINT NOT NULL DEFAULT 0,
    base_cost_crystal BIGINT NOT NULL DEFAULT 0,
    base_cost_deuterium BIGINT NOT NULL DEFAULT 0,
    base_cost_energy BIGINT NOT NULL DEFAULT 0,
    cost_increase_factor REAL NOT NULL DEFAULT 1.5,
    base_duration INTEGER NOT NULL DEFAULT 60,
    duration_increase_factor REAL NOT NULL DEFAULT 1.5,
    effects JSONB NOT NULL DEFAULT '[]',
    prerequisites JSONB NOT NULL DEFAULT '[]',
    icon VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE research_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    target_level INTEGER NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL,
    metal_cost BIGINT NOT NULL DEFAULT 0,
    crystal_cost BIGINT NOT NULL DEFAULT 0,
    deuterium_cost BIGINT NOT NULL DEFAULT 0,
    energy_cost INTEGER NOT NULL DEFAULT 0,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    queue_position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE player_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    current_level INTEGER NOT NULL DEFAULT 0,
    is_researching BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empire_id, technology_id)
);

-- ============================================================================
-- 7. BLUEPRINTS & CRAFTING
-- ============================================================================

CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blueprint_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) NOT NULL DEFAULT 'common',
    item_type VARCHAR(100) NOT NULL,
    craftable BOOLEAN NOT NULL DEFAULT TRUE,
    craft_time INTEGER NOT NULL DEFAULT 0,
    craft_cost JSONB NOT NULL DEFAULT '{}',
    components JSONB NOT NULL DEFAULT '[]',
    attributes JSONB NOT NULL DEFAULT '{}',
    min_level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE player_blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    is_learned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empire_id, blueprint_id)
);

CREATE TABLE crafting_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    output_item_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
    output_quantity INTEGER NOT NULL DEFAULT 1,
    inputs JSONB NOT NULL DEFAULT '[]',
    craft_time INTEGER NOT NULL DEFAULT 0,
    required_building VARCHAR(100),
    required_building_level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crafting_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    colony_id UUID REFERENCES colonies(id) ON DELETE SET NULL,
    recipe_id UUID NOT NULL REFERENCES crafting_recipes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL,
    processed_count INTEGER NOT NULL DEFAULT 0,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    item_key VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    attributes JSONB DEFAULT '{}',
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    durability INTEGER DEFAULT 100,
    max_durability INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. RESOURCES & ECONOMY
-- ============================================================================

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colony_id UUID NOT NULL REFERENCES colonies(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    current_amount BIGINT NOT NULL DEFAULT 0,
    capacity BIGINT NOT NULL DEFAULT 100000,
    production_per_hour INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (colony_id, resource_type)
);

CREATE TABLE resource_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    colony_id UUID REFERENCES colonies(id) ON DELETE SET NULL,
    resource_type VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    source VARCHAR(100) NOT NULL,
    reference_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE resource_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planet_id UUID NOT NULL REFERENCES planets(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    base_yield INTEGER NOT NULL DEFAULT 0,
    current_yield INTEGER NOT NULL DEFAULT 0,
    depletion_rate REAL NOT NULL DEFAULT 0.001,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (planet_id, resource_type)
);

CREATE TABLE megastructures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    progress INTEGER NOT NULL DEFAULT 0,
    max_progress INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(30) NOT NULL DEFAULT 'constructing',
    effects JSONB NOT NULL DEFAULT '[]',
    coordinates JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. MARKETPLACE
-- ============================================================================

CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    listing_type VARCHAR(10) NOT NULL CHECK (listing_type IN ('buy', 'sell')),
    resource_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
    price_per_unit BIGINT NOT NULL CHECK (price_per_unit > 0),
    currency_type VARCHAR(20) NOT NULL DEFAULT 'metal',
    minimum_quantity INTEGER DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    filled_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL,
    tax_amount BIGINT NOT NULL DEFAULT 0,
    fee_amount BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE market_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    avg_price REAL NOT NULL,
    min_price BIGINT NOT NULL,
    max_price BIGINT NOT NULL,
    volume INTEGER NOT NULL DEFAULT 0,
    sample_size INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE celestial_marketplace (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    celestial_body_type VARCHAR(20) NOT NULL,
    celestial_body_id UUID NOT NULL,
    planet_id UUID REFERENCES planets(id) ON DELETE SET NULL,
    moon_id UUID REFERENCES moons(id) ON DELETE SET NULL,
    price BIGINT NOT NULL CHECK (price > 0),
    currency_type VARCHAR(20) NOT NULL DEFAULT 'metal',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sold_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. ALLIANCES
-- ============================================================================

CREATE TABLE alliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    tag VARCHAR(10) NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    announcement TEXT DEFAULT '',
    logo_url VARCHAR(512),
    leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    founder_id UUID REFERENCES users(id) ON DELETE SET NULL,
    home_universe_id UUID REFERENCES universes(id) ON DELETE SET NULL,
    level INTEGER NOT NULL DEFAULT 1,
    experience BIGINT NOT NULL DEFAULT 0,
    member_count INTEGER NOT NULL DEFAULT 0,
    public_recruitment BOOLEAN NOT NULL DEFAULT TRUE,
    min_score_to_join BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alliance_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    rank VARCHAR(30) NOT NULL DEFAULT 'recruit',
    title VARCHAR(100) DEFAULT '',
    points INTEGER NOT NULL DEFAULT 0,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (alliance_id, user_id)
);

CREATE TABLE alliance_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (alliance_id, name)
);

CREATE TABLE alliance_diplomacy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    target_alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    proposed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ,
    terms JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (alliance_id, target_alliance_id),
    CHECK (alliance_id <> target_alliance_id)
);

CREATE TABLE alliance_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    metal BIGINT NOT NULL DEFAULT 0,
    crystal BIGINT NOT NULL DEFAULT 0,
    deuterium BIGINT NOT NULL DEFAULT 0,
    energy BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (alliance_id)
);

CREATE TABLE alliance_bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL,
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alliance_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. MESSAGING & NOTIFICATIONS
-- ============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'player',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    battle_report_id UUID,
    espionage_report_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(50) NOT NULL,
    channel_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 12. MISSIONS & CAMPAIGNS
-- ============================================================================

CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1,
    prerequisites JSONB DEFAULT '[]',
    objectives JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '{}',
    repeatable BOOLEAN NOT NULL DEFAULT FALSE,
    cooldown_hours INTEGER DEFAULT 0,
    min_empire_level INTEGER DEFAULT 1,
    max_completions INTEGER DEFAULT 0,
    is_daily BOOLEAN NOT NULL DEFAULT FALSE,
    is_weekly BOOLEAN NOT NULL DEFAULT FALSE,
    is_event BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    prerequisites JSONB DEFAULT '[]',
    rewards JSONB DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    required BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (campaign_id, mission_id),
    UNIQUE (campaign_id, step_number)
);

CREATE TABLE mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    progress_data JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    claim_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (empire_id, mission_id)
);

-- ============================================================================
-- 13. EVENTS & SEASONS
-- ============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    universe_id UUID REFERENCES universes(id) ON DELETE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    rewards JSONB DEFAULT '{}',
    leaderboard_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    min_empire_level INTEGER DEFAULT 1,
    max_participants INTEGER DEFAULT 0,
    rules JSONB DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    score BIGINT NOT NULL DEFAULT 0,
    rank INTEGER,
    completed_goals INTEGER DEFAULT 0,
    total_goals INTEGER DEFAULT 0,
    rewards_claimed JSONB DEFAULT '{}',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, empire_id)
);

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_number INTEGER NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    premium_cost_gold INTEGER NOT NULL DEFAULT 0,
    free_rewards JSONB DEFAULT '{}',
    premium_rewards JSONB DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE season_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    has_premium BOOLEAN NOT NULL DEFAULT FALSE,
    rewards_claimed JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (season_id, empire_id)
);

CREATE TABLE daily_login_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0,
    last_claim_date DATE NOT NULL,
    rewards_claimed JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empire_id)
);

-- ============================================================================
-- 14. ACHIEVEMENTS
-- ============================================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    tier VARCHAR(20) NOT NULL DEFAULT 'bronze',
    icon_url VARCHAR(512),
    requirements JSONB NOT NULL DEFAULT '{}',
    rewards JSONB NOT NULL DEFAULT '{}',
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE player_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress REAL NOT NULL DEFAULT 0.0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    rewards_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empire_id, achievement_id)
);

-- ============================================================================
-- 15. COMBAT & BATTLE REPORTS
-- ============================================================================

CREATE TABLE combat_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    attacker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    defender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    attacker_empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    defender_empire_id UUID REFERENCES empires(id) ON DELETE SET NULL,
    combat_type VARCHAR(30) NOT NULL,
    galaxy INTEGER NOT NULL,
    solar_system INTEGER NOT NULL,
    planet INTEGER NOT NULL,
    winner VARCHAR(20),
    rounds INTEGER NOT NULL DEFAULT 0,
    attacker_fleet JSONB NOT NULL DEFAULT '{}',
    defender_fleet JSONB NOT NULL DEFAULT '{}',
    attacker_losses JSONB DEFAULT '{}',
    defender_losses JSONB DEFAULT '{}',
    loot_metal BIGINT DEFAULT 0,
    loot_crystal BIGINT DEFAULT 0,
    loot_deuterium BIGINT DEFAULT 0,
    debris_metal BIGINT DEFAULT 0,
    debris_crystal BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE combat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combat_report_id UUID NOT NULL REFERENCES combat_reports(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    attacker_damage_dealt BIGINT DEFAULT 0,
    defender_damage_dealt BIGINT DEFAULT 0,
    attacker_units_destroyed JSONB DEFAULT '{}',
    defender_units_destroyed JSONB DEFAULT '{}',
    attacker_shield_damage JSONB DEFAULT '{}',
    defender_shield_damage JSONB DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE debris_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    galaxy INTEGER NOT NULL,
    solar_system INTEGER NOT NULL,
    planet INTEGER NOT NULL,
    metal BIGINT NOT NULL DEFAULT 0,
    crystal BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (universe_id, galaxy, solar_system, planet)
);

-- ============================================================================
-- 16. EXPLORATION & ESPIONAGE
-- ============================================================================

CREATE TABLE scan_cooldowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scan_type VARCHAR(50) NOT NULL,
    target_id UUID,
    target_coordinates JSONB,
    result JSONB DEFAULT '{}',
    cooldown_until TIMESTAMPTZ NOT NULL,
    scans_remaining INTEGER NOT NULL DEFAULT 0,
    max_scans INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exploration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    empire_id UUID NOT NULL REFERENCES empires(id) ON DELETE CASCADE,
    fleet_id UUID REFERENCES fleets(id) ON DELETE SET NULL,
    galaxy INTEGER NOT NULL,
    solar_system INTEGER NOT NULL,
    planet INTEGER,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    rewards JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE espionage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    galaxy INTEGER NOT NULL,
    solar_system INTEGER NOT NULL,
    planet INTEGER NOT NULL,
    probe_count INTEGER NOT NULL,
    result JSONB NOT NULL DEFAULT '{}',
    report_quality VARCHAR(20) NOT NULL DEFAULT 'poor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 17. ADMINISTRATION & AUDIT
-- ============================================================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'moderator',
    permissions JSONB NOT NULL DEFAULT '[]',
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB DEFAULT '{}',
    new_values JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE game_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 18. MISCELLANEOUS SYSTEMS
-- ============================================================================

CREATE TABLE bounties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL DEFAULT 0,
    currency_type VARCHAR(20) NOT NULL DEFAULT 'metal',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    priority VARCHAR(10) NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    evidence JSONB DEFAULT '[]',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE game_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'announcement',
    universe_id UUID REFERENCES universes(id) ON DELETE SET NULL,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR(50) NOT NULL,
    season_id UUID REFERENCES seasons(id) ON DELETE SET NULL,
    entries JSONB NOT NULL DEFAULT '[]',
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (universe_id, leaderboard_type, season_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users & Auth
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens (expires_at);
CREATE INDEX idx_user_roles_user ON user_roles (user_id);

-- Profiles & Empires
CREATE INDEX idx_player_profiles_score ON player_profiles (score DESC);
CREATE INDEX idx_empires_universe ON empires (universe_id);
CREATE INDEX idx_empires_level ON empires (empire_level DESC);
CREATE INDEX idx_player_states_universe ON player_states (universe_id);
CREATE INDEX idx_player_states_active ON player_states (last_active_at);

-- Universe & Galaxy
CREATE INDEX idx_universes_status ON universes (status);
CREATE INDEX idx_universes_realm ON universes (realm_type);
CREATE INDEX idx_galaxies_universe ON galaxies (universe_id);
CREATE INDEX idx_solar_systems_galaxy ON solar_systems (galaxy_id);
CREATE INDEX idx_solar_systems_coords ON solar_systems (universe_id, galaxy_number, system_number);
CREATE INDEX idx_planets_system ON planets (solar_system_id);
CREATE INDEX idx_planets_coords ON planets (universe_id, galaxy_number, system_number, planet_number);
CREATE INDEX idx_planets_colonized ON planets (is_colonized) WHERE is_colonized = FALSE;
CREATE INDEX idx_moons_planet ON moons (planet_id);

-- Colonies & Buildings
CREATE INDEX idx_colonies_empire ON colonies (empire_id);
CREATE INDEX idx_colonies_planet ON colonies (planet_id);
CREATE INDEX idx_colonies_capital ON colonies (empire_id) WHERE is_capital = TRUE;
CREATE INDEX idx_buildings_colony ON buildings (colony_id);
CREATE INDEX idx_building_queue_colony ON building_queues (colony_id);
CREATE INDEX idx_building_queue_user ON building_queues (user_id);
CREATE INDEX idx_building_queue_processed ON building_queues (processed) WHERE processed = FALSE;

-- Fleets
CREATE INDEX idx_fleets_empire ON fleets (empire_id);
CREATE INDEX idx_fleets_user ON fleets (user_id);
CREATE INDEX idx_fleets_status ON fleets (status);
CREATE INDEX idx_fleets_location ON fleets (galaxy, solar_system, planet);
CREATE INDEX idx_fleets_arrival ON fleets (arrival_at) WHERE arrival_at IS NOT NULL;
CREATE INDEX idx_fleet_units_fleet ON fleet_units (fleet_id);

-- Research
CREATE INDEX idx_technologies_subcategory ON technologies (subcategory_id);
CREATE INDEX idx_technologies_key ON technologies (tech_key);
CREATE INDEX idx_research_queue_user ON research_queues (user_id);
CREATE INDEX idx_research_queue_processed ON research_queues (processed) WHERE processed = FALSE;
CREATE INDEX idx_player_technologies_empire ON player_technologies (empire_id);

-- Blueprints & Crafting
CREATE INDEX idx_blueprints_category ON blueprints (category);
CREATE INDEX idx_player_blueprints_empire ON player_blueprints (empire_id);
CREATE INDEX idx_crafting_queue_user ON crafting_queues (user_id);
CREATE INDEX idx_inventory_user ON inventory_items (user_id);

-- Resources & Economy
CREATE INDEX idx_resources_colony ON resources (colony_id);
CREATE INDEX idx_resource_transactions_user ON resource_transactions (user_id);
CREATE INDEX idx_resource_transactions_created ON resource_transactions (created_at);

-- Marketplace
CREATE INDEX idx_market_listings_universe ON marketplace_listings (universe_id);
CREATE INDEX idx_market_listings_type ON marketplace_listings (listing_type, status);
CREATE INDEX idx_market_listings_resource ON marketplace_listings (resource_type, status);
CREATE INDEX idx_market_listings_user ON marketplace_listings (user_id);
CREATE INDEX idx_market_transactions_seller ON marketplace_transactions (seller_id);
CREATE INDEX idx_market_transactions_buyer ON marketplace_transactions (buyer_id);
CREATE INDEX idx_market_price_history ON market_price_history (universe_id, resource_type, recorded_at DESC);
CREATE INDEX idx_celestial_marketplace_universe ON celestial_marketplace (universe_id);
CREATE INDEX idx_celestial_marketplace_status ON celestial_marketplace (status);

-- Alliances
CREATE INDEX idx_alliances_name ON alliances (name);
CREATE INDEX idx_alliance_members_alliance ON alliance_members (alliance_id);
CREATE INDEX idx_alliance_members_user ON alliance_members (user_id);
CREATE INDEX idx_alliance_diplomacy_alliance ON alliance_diplomacy (alliance_id);
CREATE INDEX idx_alliance_diplomacy_target ON alliance_diplomacy (target_alliance_id);
CREATE INDEX idx_alliance_bank_transactions_alliance ON alliance_bank_transactions (alliance_id);
CREATE INDEX idx_alliance_invites_invitee ON alliance_invites (invitee_id);

-- Messages & Notifications
CREATE INDEX idx_messages_recipient ON messages (recipient_id, is_read);
CREATE INDEX idx_notifications_user ON notifications (user_id, is_read);
CREATE INDEX idx_chat_messages_channel ON chat_messages (channel, channel_id, created_at DESC);

-- Missions & Campaigns
CREATE INDEX idx_mission_progress_empire ON mission_progress (empire_id);
CREATE INDEX idx_mission_progress_status ON mission_progress (status);

-- Events & Seasons
CREATE INDEX idx_events_dates ON events (starts_at, ends_at);
CREATE INDEX idx_event_participants_event ON event_participants (event_id);
CREATE INDEX idx_event_participants_score ON event_participants (event_id, score DESC);
CREATE INDEX idx_season_progress_empire ON season_progress (empire_id);

-- Achievements
CREATE INDEX idx_player_achievements_empire ON player_achievements (empire_id);
CREATE INDEX idx_achievements_category ON achievements (category);

-- Combat
CREATE INDEX idx_combat_reports_attacker ON combat_reports (attacker_id);
CREATE INDEX idx_combat_reports_defender ON combat_reports (defender_id);
CREATE INDEX idx_combat_reports_created ON combat_reports (created_at DESC);
CREATE INDEX idx_combat_logs_report ON combat_logs (combat_report_id);
CREATE INDEX idx_debris_fields_location ON debris_fields (universe_id, galaxy, solar_system, planet);

-- Exploration
CREATE INDEX idx_scan_cooldowns_user ON scan_cooldowns (user_id);
CREATE INDEX idx_exploration_logs_user ON exploration_logs (user_id);
CREATE INDEX idx_espionage_reports_target ON espionage_reports (target_id);

-- Admin & Audit
CREATE INDEX idx_admin_logs_admin ON admin_logs (admin_id);
CREATE INDEX idx_admin_logs_created ON admin_logs (created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs (created_at DESC);

-- Bounties
CREATE INDEX idx_bounties_target ON bounties (target_id);
CREATE INDEX idx_bounties_active ON bounties (active) WHERE active = TRUE;

-- Tickets & Reports
CREATE INDEX idx_tickets_user ON tickets (user_id);
CREATE INDEX idx_tickets_status ON tickets (status);
CREATE INDEX idx_reports_reported ON reports (reported_id);
CREATE INDEX idx_reports_status ON reports (status);

-- ============================================================================
-- TRIGGER: auto-update updated_at columns
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_player_profiles_updated_at
    BEFORE UPDATE ON player_profiles FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_empires_updated_at
    BEFORE UPDATE ON empires FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_player_states_updated_at
    BEFORE UPDATE ON player_states FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_universes_updated_at
    BEFORE UPDATE ON universes FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_colonies_updated_at
    BEFORE UPDATE ON colonies FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_alliances_updated_at
    BEFORE UPDATE ON alliances FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_marketplace_listings_updated_at
    BEFORE UPDATE ON marketplace_listings FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_game_config_updated_at
    BEFORE UPDATE ON game_config FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

COMMIT;
