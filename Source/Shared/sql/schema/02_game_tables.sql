-- Extended game tables for universe-empire-domions

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'moderator',
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Battles table
CREATE TABLE IF NOT EXISTS battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attacker_id UUID REFERENCES users(id),
    defender_id UUID REFERENCES users(id),
    type VARCHAR(50) DEFAULT 'space',
    location VARCHAR(255),
    attacker_units JSONB DEFAULT '{}',
    defender_units JSONB DEFAULT '{}',
    result JSONB,
    log JSONB DEFAULT '[]',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Battle logs table
CREATE TABLE IF NOT EXISTS battle_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id),
    round INTEGER,
    attacker_damage INTEGER,
    defender_damage INTEGER,
    attacker_losses JSONB,
    defender_losses JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player colonies table
CREATE TABLE IF NOT EXISTS player_colonies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    coordinates VARCHAR(255),
    population INTEGER DEFAULT 0,
    resources JSONB DEFAULT '{}',
    buildings JSONB DEFAULT '{}',
    happiness INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource fields table
CREATE TABLE IF NOT EXISTS resource_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coordinates VARCHAR(255),
    resource_type VARCHAR(50),
    richness INTEGER DEFAULT 1,
    depletion_rate REAL DEFAULT 0.01,
    current_amount INTEGER DEFAULT 10000,
    max_amount INTEGER DEFAULT 100000,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment durability table
CREATE TABLE IF NOT EXISTS equipment_durability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(255),
    durability INTEGER DEFAULT 100,
    max_durability INTEGER DEFAULT 100,
    last_repair TIMESTAMP
);

-- Fleet durability table
CREATE TABLE IF NOT EXISTS fleet_durability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fleet_id VARCHAR(255),
    hull_integrity INTEGER DEFAULT 100,
    shield_integrity INTEGER DEFAULT 100,
    engine_integrity INTEGER DEFAULT 100,
    last_repair TIMESTAMP
);

-- Building durability table
CREATE TABLE IF NOT EXISTS building_durability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_id VARCHAR(255),
    durability INTEGER DEFAULT 100,
    max_durability INTEGER DEFAULT 100,
    last_repair TIMESTAMP
);

-- Research areas table
CREATE TABLE IF NOT EXISTS research_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research subcategories table
CREATE TABLE IF NOT EXISTS research_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID REFERENCES research_areas(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research technologies table
CREATE TABLE IF NOT EXISTS research_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcategory_id UUID REFERENCES research_subcategories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    cost JSONB DEFAULT '{}',
    effects JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player research progress table
CREATE TABLE IF NOT EXISTS player_research_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES research_technologies(id),
    current_level INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 100,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
