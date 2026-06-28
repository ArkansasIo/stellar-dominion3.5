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
