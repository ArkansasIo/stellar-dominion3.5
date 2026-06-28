-- Advanced game tables for universe-empire-domions

-- Expeditions table
CREATE TABLE IF NOT EXISTS expeditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(50),
    destination VARCHAR(255),
    status VARCHAR(50) DEFAULT 'preparing',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    fleet_composition JSONB DEFAULT '{}',
    rewards JSONB DEFAULT '{}',
    log JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expedition teams table
CREATE TABLE IF NOT EXISTS expedition_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expedition_id UUID REFERENCES expeditions(id),
    team_type VARCHAR(50),
    members JSONB DEFAULT '[]',
    skills JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expedition encounters table
CREATE TABLE IF NOT EXISTS expedition_encounters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expedition_id UUID REFERENCES expeditions(id),
    type VARCHAR(50),
    difficulty INTEGER DEFAULT 1,
    outcome VARCHAR(50),
    rewards JSONB DEFAULT '{}',
    log JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Starbases table
CREATE TABLE IF NOT EXISTS starbases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES users(id),
    name VARCHAR(255),
    coordinates VARCHAR(255),
    level INTEGER DEFAULT 1,
    modules JSONB DEFAULT '[]',
    defenses JSONB DEFAULT '{}',
    resources JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Moon bases table
CREATE TABLE IF NOT EXISTS moon_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES users(id),
    name VARCHAR(255),
    coordinates VARCHAR(255),
    planet_id UUID,
    level INTEGER DEFAULT 1,
    buildings JSONB DEFAULT '{}',
    resources JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(255),
    rank VARCHAR(50),
    score INTEGER DEFAULT 0,
    achievements JSONB DEFAULT '[]',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mega structures table
CREATE TABLE IF NOT EXISTS mega_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(50),
    level INTEGER DEFAULT 1,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 100,
    effects JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'constructing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empire difficulties table
CREATE TABLE IF NOT EXISTS empire_difficulties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    modifier JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story campaigns table
CREATE TABLE IF NOT EXISTS story_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    chapters JSONB DEFAULT '[]',
    rewards JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story missions table
CREATE TABLE IF NOT EXISTS story_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES story_campaigns(id),
    name VARCHAR(255),
    description TEXT,
    objectives JSONB DEFAULT '[]',
    rewards JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    requirement JSONB DEFAULT '{}',
    reward JSONB DEFAULT '{}',
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Element buffs table
CREATE TABLE IF NOT EXISTS element_buffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    element_type VARCHAR(50),
    buff_type VARCHAR(50),
    value REAL DEFAULT 0,
    duration INTEGER DEFAULT 0,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP
);

-- Gate tokens
CREATE TABLE IF NOT EXISTS gate_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gate token history
CREATE TABLE IF NOT EXISTS gate_token_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 0,
    source VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dimensional contracts
CREATE TABLE IF NOT EXISTS dimensional_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_tier INTEGER NOT NULL,
    tokens_earned INTEGER DEFAULT 0,
    tokens_spent INTEGER DEFAULT 0,
    raids_completed INTEGER DEFAULT 0,
    chests_opened INTEGER DEFAULT 0,
    last_raid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abyssal gate tokens
CREATE TABLE IF NOT EXISTS abyssal_gate_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gate_tier INTEGER NOT NULL,
    tokens_earned INTEGER DEFAULT 0,
    tokens_spent INTEGER DEFAULT 0,
    gates_completed INTEGER DEFAULT 0,
    chests_opened INTEGER DEFAULT 0,
    last_gate_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raid chest rewards
CREATE TABLE IF NOT EXISTS raid_chest_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_type VARCHAR(255),
    contract_tier INTEGER,
    tokens_spent INTEGER,
    rewards_granted JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abyssal gate rewards
CREATE TABLE IF NOT EXISTS abyssal_gate_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gate_tier INTEGER,
    tokens_spent INTEGER,
    rewards_granted JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scan cooldowns
CREATE TABLE IF NOT EXISTS scan_cooldowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scan_type VARCHAR(255) NOT NULL,
    target_id VARCHAR(255),
    target_coordinates VARCHAR(255),
    result JSONB DEFAULT '{}',
    cooldown_until TIMESTAMP NOT NULL,
    scans_remaining INTEGER DEFAULT 0,
    max_scans INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player power levels
CREATE TABLE IF NOT EXISTS player_power_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_power INTEGER DEFAULT 0,
    power_tier VARCHAR(255),
    attack_power INTEGER DEFAULT 0,
    defense_power INTEGER DEFAULT 0,
    research_power INTEGER DEFAULT 0,
    building_power INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weekly mission progress
CREATE TABLE IF NOT EXISTS weekly_mission_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_id VARCHAR(255) NOT NULL,
    missions JSONB DEFAULT '[]',
    bonus_pool INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- XP history
CREATE TABLE IF NOT EXISTS xp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    page VARCHAR(255),
    sub_page VARCHAR(255),
    action VARCHAR(255),
    label VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bounties
CREATE TABLE IF NOT EXISTS bounties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    claimed_by UUID REFERENCES users(id),
    claimed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
