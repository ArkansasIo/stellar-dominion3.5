-- Performance Indexes
-- Additional indexes beyond those defined in schema files to optimize common queries

-- Empires
CREATE INDEX IF NOT EXISTS idx_empires_total_score_rank ON empires(total_score DESC, civilization_tier);
CREATE INDEX IF NOT EXISTS idx_empires_tech_age ON empires(technology_age) WHERE technology_age > 1;
CREATE INDEX IF NOT EXISTS idx_empires_prestige ON empires(prestige_level DESC);
CREATE INDEX IF NOT EXISTS idx_empires_last_active ON empires(last_active) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_empires_name_lower ON empires(LOWER(name));

-- Planets
CREATE INDEX IF NOT EXISTS idx_planets_owner ON planets(empire_id) WHERE empire_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_planets_coords ON planets(system_id, orbit_slot);
CREATE INDEX IF NOT EXISTS idx_planets_resource_rich ON planets(resource_rich) WHERE resource_rich = true;

-- Planet Buildings
CREATE INDEX IF NOT EXISTS idx_pb_empire_active ON planet_buildings(empire_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_pb_empire_building ON planet_buildings(empire_id, building_id);
CREATE INDEX IF NOT EXISTS idx_pb_upgrade_eta ON planet_buildings(upgrade_finishes) WHERE is_upgrading = true;
CREATE INDEX IF NOT EXISTS idx_pb_planet_slot ON planet_buildings(planet_id, slot_number);

-- Building Queue
CREATE INDEX IF NOT EXISTS idx_pbq_empire_position ON planet_building_queue(empire_id, position);
CREATE INDEX IF NOT EXISTS idx_pbq_finish_time ON planet_building_queue(finishes_at) WHERE cancelled = false;

-- Fleet Units
CREATE INDEX IF NOT EXISTS idx_fleet_units_empire_class ON fleet_units(empire_id, class_id);
CREATE INDEX IF NOT EXISTS idx_fleet_units_location ON fleet_units(location_planet_id) WHERE location_planet_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fleet_units_in_transit ON fleet_units(empire_id) WHERE location_planet_id IS NULL;

-- Planet Defenses
CREATE INDEX IF NOT EXISTS idx_pd_empire_planet ON planet_defenses(empire_id, planet_id);
CREATE INDEX IF NOT EXISTS idx_pd_defense_category ON planet_defenses(defense_id);

-- Research
CREATE INDEX IF NOT EXISTS idx_empire_research_progress ON empire_research(empire_id, current_level);
CREATE INDEX IF NOT EXISTS idx_empire_research_completed ON empire_research(empire_id) WHERE current_level > 0;

-- Trade Routes
CREATE INDEX IF NOT EXISTS idx_trade_routes_source ON trade_routes(source_empire_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_trade_routes_dest ON trade_routes(dest_empire_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_trade_routes_next_run ON trade_routes(next_run_at) WHERE active = true;

-- Market Orders
CREATE INDEX IF NOT EXISTS idx_market_orders_empire ON market_orders(empire_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_market_orders_resource ON market_orders(resource_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_market_orders_price ON market_orders(unit_price) WHERE status = 'open';

-- Combat / Battle Reports
CREATE INDEX IF NOT EXISTS idx_battles_attacker ON battles(attacker_empire_id, fought_at DESC);
CREATE INDEX IF NOT EXISTS idx_battles_defender ON battles(defender_empire_id, fought_at DESC);
CREATE INDEX IF NOT EXISTS idx_battles_location ON battles(location_system_id, location_planet_id);
CREATE INDEX IF NOT EXISTS idx_battles_date ON battles(fought_at DESC);

-- Alliances
CREATE INDEX IF NOT EXISTS idx_alliances_score ON alliances(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_alliances_member_count ON alliances(member_count DESC);
CREATE INDEX IF NOT EXISTS idx_alliance_members_empire ON alliance_members(empire_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_active ON events(starts_at, ends_at) WHERE ends_at > NOW();
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, starts_at DESC);

-- NPC Fleets
CREATE INDEX IF NOT EXISTS idx_npc_fleets_location ON npc_fleets(current_system_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_npc_fleets_tier ON npc_fleets(tier) WHERE is_active = true;

-- Wormholes
CREATE INDEX IF NOT EXISTS idx_wormholes_connected ON wormholes(connected_system_id);
CREATE INDEX IF NOT EXISTS idx_wormholes_stable ON wormholes(stability) WHERE stability > 0;

-- Quests
CREATE INDEX IF NOT EXISTS idx_quests_empire_status ON quests(empire_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_quests_difficulty ON quests(difficulty);
