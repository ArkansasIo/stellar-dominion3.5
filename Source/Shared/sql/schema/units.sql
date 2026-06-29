-- Units, Equipment, and Resource Management System

-- Resources inventory per player
CREATE TABLE IF NOT EXISTS player_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type VARCHAR NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resources_player ON player_resources(player_id);
CREATE INDEX idx_resources_type ON player_resources(resource_type);
CREATE UNIQUE INDEX idx_resources_player_type ON player_resources(player_id, resource_type);

-- Equipment items
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key VARCHAR UNIQUE NOT NULL,
  item_name VARCHAR NOT NULL,
  item_type VARCHAR NOT NULL,
  rarity VARCHAR NOT NULL,
  level INTEGER NOT NULL,
  stats JSONB NOT NULL DEFAULT '{}',
  bonuses JSONB NOT NULL DEFAULT '{}',
  durability INTEGER,
  max_durability INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_equipment_key ON equipment(item_key);
CREATE INDEX idx_equipment_type ON equipment(item_type);
CREATE INDEX idx_equipment_rarity ON equipment(rarity);

-- Player inventory
CREATE TABLE IF NOT EXISTS player_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  quantity INTEGER DEFAULT 1,
  equipped BOOLEAN DEFAULT false,
  durability INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_player ON player_inventory(player_id);
CREATE INDEX idx_inventory_equipment ON player_inventory(equipment_id);
CREATE INDEX idx_inventory_equipped ON player_inventory(equipped);

-- Mining operations
CREATE TABLE IF NOT EXISTS mining_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id),
  location VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  yield_amount REAL NOT NULL,
  duration_seconds INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mining_player ON mining_operations(player_id);
CREATE INDEX idx_mining_unit ON mining_operations(unit_id);
CREATE INDEX idx_mining_resource ON mining_operations(resource_type);

-- Units (population management)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_name VARCHAR NOT NULL,
  unit_type VARCHAR NOT NULL,
  class VARCHAR NOT NULL,
  job VARCHAR,
  rank VARCHAR NOT NULL DEFAULT 'apprentice',
  level INTEGER NOT NULL DEFAULT 1,
  rarity VARCHAR DEFAULT 'common',
  status VARCHAR DEFAULT 'untrained',
  
  -- Attributes
  strength INTEGER DEFAULT 10,
  constitution INTEGER DEFAULT 10,
  dexterity INTEGER DEFAULT 10,
  intelligence INTEGER DEFAULT 10,
  wisdom INTEGER DEFAULT 10,
  charisma INTEGER DEFAULT 10,
  
  -- Derived stats
  health INTEGER,
  max_health INTEGER,
  mana INTEGER,
  max_mana INTEGER,
  experience INTEGER DEFAULT 0,
  
  -- Sustenance
  hunger_level REAL DEFAULT 100,
  thirst_level REAL DEFAULT 100,
  last_fed TIMESTAMP,
  
  -- Equipment
  weapon_id UUID REFERENCES equipment(id),
  armor_id UUID REFERENCES equipment(id),
  tool_id UUID REFERENCES equipment(id),
  
  -- Location and assignment
  assigned_location VARCHAR,
  current_task VARCHAR,
  task_progress REAL DEFAULT 0,
  
  -- Bonuses
  area_bonuses JSONB DEFAULT '{}',
  class_bonuses JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_units_player ON units(player_id);
CREATE INDEX idx_units_type ON units(unit_type);
CREATE INDEX idx_units_class ON units(class);
CREATE INDEX idx_units_job ON units(job);
CREATE INDEX idx_units_level ON units(level);
CREATE INDEX idx_units_rarity ON units(rarity);

-- Unit training queue
CREATE TABLE IF NOT EXISTS unit_training_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  training_type VARCHAR NOT NULL,
  new_level INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_seconds INTEGER NOT NULL,
  cost JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_training_unit ON unit_training_queue(unit_id);
CREATE INDEX idx_training_completed ON unit_training_queue(completed_at);

-- Unit progression and experience
CREATE TABLE IF NOT EXISTS unit_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  skill_type VARCHAR NOT NULL,
  skill_level INTEGER DEFAULT 1,
  skill_experience INTEGER DEFAULT 0,
  proficiency REAL DEFAULT 0.0,
  last_practiced TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_progression_unit ON unit_progression(unit_id);
CREATE INDEX idx_progression_skill ON unit_progression(skill_type);

-- Food and resource consumption tracking
CREATE TABLE IF NOT EXISTS sustenance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resource_type VARCHAR NOT NULL,
  amount_consumed REAL NOT NULL,
  current_level REAL NOT NULL,
  consumed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sustenance_unit ON sustenance_log(unit_id);
CREATE INDEX idx_sustenance_timestamp ON sustenance_log(consumed_at);

-- Area-specific bonuses and biomes
CREATE TABLE IF NOT EXISTS area_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_key VARCHAR UNIQUE NOT NULL,
  area_name VARCHAR NOT NULL,
  description TEXT,
  bonuses JSONB NOT NULL DEFAULT '{}',
  resources JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_areas_key ON area_bonuses(area_key);

-- Unit equipment loadouts
CREATE TABLE IF NOT EXISTS unit_loadouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  loadout_name VARCHAR NOT NULL,
  weapon_id UUID REFERENCES equipment(id),
  armor_id UUID REFERENCES equipment(id),
  tool_id UUID REFERENCES equipment(id),
  accessory_1_id UUID REFERENCES equipment(id),
  accessory_2_id UUID REFERENCES equipment(id),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loadouts_unit ON unit_loadouts(unit_id);
CREATE INDEX idx_loadouts_active ON unit_loadouts(is_active);

-- Unit achievements and statistics
CREATE TABLE IF NOT EXISTS unit_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resource_mined REAL DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  battles_fought INTEGER DEFAULT 0,
  enemies_defeated INTEGER DEFAULT 0,
  total_damage_dealt REAL DEFAULT 0,
  total_damage_taken REAL DEFAULT 0,
  promotions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stats_unit ON unit_statistics(unit_id);
