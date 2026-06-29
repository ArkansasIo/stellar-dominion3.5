-- Base tables schema for universe-empire-domions
-- This file creates the core tables needed for the game

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player states table
CREATE TABLE IF NOT EXISTS player_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    setup_complete BOOLEAN DEFAULT FALSE,
    planet_name VARCHAR(255) DEFAULT 'New Colony',
    coordinates VARCHAR(255) DEFAULT '[1:1:1]',
    known_planets JSONB DEFAULT '[]',
    travel_state JSONB DEFAULT '{"activeRoute": null, "discoveredWormholes": []}',
    travel_log JSONB DEFAULT '[]',
    resources JSONB DEFAULT '{"metal": 1000, "crystal": 500, "deuterium": 0, "energy": 0}',
    buildings JSONB DEFAULT '{"roboticsFactory": 0, "shipyard": 0, "researchLab": 0}',
    orbital_buildings JSONB DEFAULT '{}',
    research JSONB DEFAULT '{}',
    research_queue JSONB DEFAULT '[]',
    research_history JSONB DEFAULT '[]',
    active_research JSONB DEFAULT 'null',
    research_bonuses JSONB DEFAULT '[]',
    research_modifiers JSONB DEFAULT '[]',
    research_lab JSONB DEFAULT '{"type": "standard", "level": 1, "specialization": "general", "durability": 100}',
    available_labs JSONB DEFAULT '[]',
    turns_data JSONB DEFAULT '{"totalTurnsGenerated": 0, "currentTurn": 0, "lastTurnTimestamp": 0, "turnsAvailable": 0, "currentResearchTurns": 0, "researchTurnHistory": []}',
    research_xp JSONB DEFAULT '{"totalXP": 0, "currentLevelXP": 0, "currentLevel": 1, "researchesCompleted": 0, "discoveredTechs": []}',
    government JSONB DEFAULT '{"type": "democracy", "policies": [], "stats": {"stability": 60, "publicSupport": 50, "efficiency": 50, "militaryReadiness": 40, "corruption": 10}, "taxRate": 20}',
    commander JSONB DEFAULT '{"name": "Commander", "empireName": "Stellar Dominion", "race": "terran", "class": "admiral", "subClass": null, "stats": {"level": 1, "xp": 0, "warfare": 1, "logistics": 1, "science": 1, "engineering": 1}}',
    units JSONB DEFAULT '{"lightFighter": 5, "smallCargo": 2, "espionageProbe": 10, "marine": 50, "colonist": 100}',
    megastructures JSONB DEFAULT '[]',
    artifacts JSONB DEFAULT '[]',
    inventory JSONB DEFAULT '{}',
    events JSONB DEFAULT '[]',
    messages JSONB DEFAULT '[]',
    queue JSONB DEFAULT '[]',
    active_missions JSONB DEFAULT '[]',
    cron_jobs JSONB DEFAULT '[]',
    alliance_id UUID,
    config JSONB DEFAULT '{"universeName": "Nexus-Alpha", "gameSpeed": 1, "resourceRate": 1, "fleetSpeed": 1, "peaceMode": false, "serverTimezone": "UTC", "version": "v0.8.2-beta", "maintenanceMode": false}',
    realm_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Missions table
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    target VARCHAR(255),
    units JSONB DEFAULT '{}',
    arrival_time TIMESTAMP,
    return_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'outbound',
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user VARCHAR(255),
    to_user VARCHAR(255),
    subject VARCHAR(255),
    body TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) DEFAULT 'player',
    battle_report JSONB,
    espionage_report JSONB
);

-- Alliances table
CREATE TABLE IF NOT EXISTS alliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id),
    members JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market orders table
CREATE TABLE IF NOT EXISTS market_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    price INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue items table
CREATE TABLE IF NOT EXISTS queue_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    amount INTEGER DEFAULT 1,
    item_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending'
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
