-- ============================================================================
-- STELLAR DOMINION 3 — COMPLETE GAME DATABASE SCHEMA
-- ============================================================================
-- Unified schema covering ALL game systems.
-- Run as a single migration or use individual sections.
-- PostgreSQL 15+ compatible
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION 1: CORE ACCOUNTS & SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  email varchar UNIQUE NOT NULL,
  first_name varchar,
  last_name varchar,
  profile_image_url varchar,
  is_admin boolean DEFAULT false,
  admin_role varchar,
  is_banned boolean DEFAULT false,
  ban_reason text,
  banned_until timestamp,
  login_count integer DEFAULT 0,
  last_login_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar NOT NULL DEFAULT 'moderator',
  permissions jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 2: PLAYER STATE & PROGRESSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_states (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  setup_complete boolean DEFAULT false,
  planet_name varchar DEFAULT 'Earth',
  coordinates varchar DEFAULT '1:1:100:3',
  known_planets jsonb DEFAULT '[]',
  travel_state jsonb DEFAULT '{}',
  travel_log jsonb DEFAULT '[]',
  resources jsonb NOT NULL DEFAULT '{"metal":50000,"crystal":50000,"deuterium":20000,"energy":5000,"credits":10000,"food":5000,"water":5000,"darkmatter":0}',
  buildings jsonb NOT NULL DEFAULT '{"metalMine":1,"crystalMine":1,"deuteriumSynthesizer":0,"solarPlant":1,"roboticsFactory":0,"shipyard":0,"researchLab":0}',
  orbital_buildings jsonb DEFAULT '{}',
  research jsonb DEFAULT '{}',
  research_queue jsonb DEFAULT '[]',
  research_history jsonb DEFAULT '[]',
  active_research jsonb DEFAULT '{}',
  research_bonuses jsonb DEFAULT '{}',
  research_modifiers jsonb DEFAULT '{}',
  research_lab jsonb DEFAULT '{}',
  available_labs jsonb DEFAULT '[]',
  turns_data jsonb DEFAULT '{}',
  research_xp jsonb DEFAULT '{}',
  units jsonb DEFAULT '{}',
  commander jsonb NOT NULL DEFAULT '{}',
  government jsonb NOT NULL DEFAULT '{}',
  artifacts jsonb DEFAULT '[]',
  cron_jobs jsonb DEFAULT '[]',
  empire_level integer DEFAULT 1,
  empire_experience bigint DEFAULT 0,
  tier integer DEFAULT 1,
  tier_experience bigint DEFAULT 0,
  prestige_level integer DEFAULT 0,
  prestige_bonus jsonb DEFAULT '{}',
  tier_bonuses jsonb DEFAULT '{}',
  kardashev_progress jsonb DEFAULT '{}',
  total_turns integer DEFAULT 0,
  current_turns integer DEFAULT 0,
  last_turn_update timestamp,
  last_resource_update timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_profiles (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uid varchar UNIQUE,
  display_name varchar,
  bio text,
  profile_image_url varchar,
  level integer DEFAULT 1,
  total_experience bigint DEFAULT 0,
  prestige_level integer DEFAULT 0,
  galaxy_rank integer DEFAULT 0,
  fleet_power bigint DEFAULT 0,
  empire_power bigint DEFAULT 0,
  attributes jsonb DEFAULT '{}',
  sub_attributes jsonb DEFAULT '{}',
  categories jsonb DEFAULT '{}',
  badges jsonb DEFAULT '[]',
  achievements jsonb DEFAULT '[]',
  is_online boolean DEFAULT false,
  last_activity_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 3: DARK MATTER PRIME CURRENCY
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_dark_matter (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance bigint DEFAULT 0,
  total_earned bigint DEFAULT 0,
  total_spent bigint DEFAULT 0,
  daily_earned integer DEFAULT 0,
  daily_earned_date date DEFAULT CURRENT_DATE,
  login_streak integer DEFAULT 0,
  last_login_date date,
  subscription_id varchar,
  subscription_expires_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dark_matter_transactions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount bigint NOT NULL,
  balance_before bigint NOT NULL,
  balance_after bigint NOT NULL,
  source varchar NOT NULL,
  source_id varchar,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dm_tx_user ON dark_matter_transactions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS dark_matter_earning_log (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source varchar NOT NULL,
  amount integer NOT NULL,
  daily_cap integer,
  daily_earned integer,
  cooldown_minutes integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dark_matter_purchases (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_item_id varchar NOT NULL,
  store_item_name varchar NOT NULL,
  price_paid bigint NOT NULL,
  quantity integer DEFAULT 1,
  payment_method varchar DEFAULT 'dark_matter',
  external_transaction_id varchar,
  metadata jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dark_matter_subscriptions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier varchar NOT NULL,
  started_at timestamp DEFAULT now(),
  expires_at timestamp NOT NULL,
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT true,
  total_dark_matter_claimed bigint DEFAULT 0,
  last_claimed_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 4: CURRENCY SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_currency (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  silver bigint DEFAULT 0,
  gold bigint DEFAULT 0,
  platinum bigint DEFAULT 0,
  silver_earned bigint DEFAULT 0,
  silver_spent bigint DEFAULT 0,
  gold_earned bigint DEFAULT 0,
  gold_spent bigint DEFAULT 0,
  platinum_earned bigint DEFAULT 0,
  platinum_spent bigint DEFAULT 0,
  last_updated timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS currency_transactions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency_type varchar NOT NULL,
  amount bigint NOT NULL,
  reason varchar,
  related_id varchar,
  balance_before bigint,
  balance_after bigint,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_curr_tx_user ON currency_transactions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_type varchar NOT NULL DEFAULT 'savings',
  account_balance bigint DEFAULT 0,
  interest_rate real DEFAULT 0.01,
  last_interest_payment timestamp,
  total_interest_earned bigint DEFAULT 0,
  max_withdrawal bigint DEFAULT 1000000,
  max_deposit bigint DEFAULT 10000000,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bank_transactions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id varchar NOT NULL REFERENCES bank_accounts(id),
  transaction_type varchar NOT NULL,
  amount bigint NOT NULL,
  description text,
  balance_before bigint,
  balance_after bigint,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 5: UNIVERSE & CELESTIAL BODIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS galaxies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar UNIQUE NOT NULL,
  description text,
  galaxy_type varchar DEFAULT 'spiral',
  sector_count integer DEFAULT 100,
  discovered_by varchar REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS star_systems (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  galaxy_id varchar NOT NULL REFERENCES galaxies(id),
  name varchar NOT NULL,
  coordinates varchar NOT NULL,
  star_type varchar DEFAULT 'main-sequence',
  star_class varchar DEFAULT 'G',
  star_mass real DEFAULT 1.0,
  star_luminosity real DEFAULT 1.0,
  temperature integer DEFAULT 5778,
  planet_count integer DEFAULT 0,
  is_explored boolean DEFAULT false,
  discovered_by varchar REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planets (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  star_system_id varchar NOT NULL REFERENCES star_systems(id),
  name varchar NOT NULL,
  planet_type varchar NOT NULL,
  planet_class varchar DEFAULT 'terrestrial',
  size integer DEFAULT 1,
  orbital_distance real DEFAULT 1.0,
  gravity real DEFAULT 1.0,
  temperature integer DEFAULT 288,
  atmosphere varchar DEFAULT 'nitrogen-oxygen',
  water_level real DEFAULT 0.7,
  metal_richness real DEFAULT 0.5,
  crystal_richness real DEFAULT 0.3,
  deuterium_richness real DEFAULT 0.2,
  habitability real DEFAULT 0.8,
  population_capacity integer DEFAULT 10000,
  current_population integer DEFAULT 0,
  owner_id varchar REFERENCES users(id),
  is_colonized boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moons (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  planet_id varchar NOT NULL REFERENCES planets(id),
  name varchar NOT NULL,
  moon_type varchar DEFAULT 'rocky',
  size integer DEFAULT 1,
  orbital_distance real DEFAULT 0.01,
  owner_id varchar REFERENCES users(id),
  is_colonized boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asteroids (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  star_system_id varchar NOT NULL REFERENCES star_systems(id),
  name varchar,
  asteroid_type varchar DEFAULT 'metallic',
  size integer DEFAULT 1,
  metal_amount integer DEFAULT 1000,
  crystal_amount integer DEFAULT 500,
  deuterium_amount integer DEFAULT 200,
  is_mined boolean DEFAULT false,
  mined_by varchar REFERENCES users(id),
  depleted_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS space_anomalies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  star_system_id varchar NOT NULL REFERENCES star_systems(id),
  anomaly_type varchar NOT NULL,
  name varchar,
  description text,
  danger_level integer DEFAULT 1,
  loot_table jsonb DEFAULT '[]',
  discovered_by varchar REFERENCES users(id),
  discovered_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 6: COLONIES & BASES
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_colonies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  planet_id varchar NOT NULL REFERENCES planets(id),
  colony_name varchar NOT NULL,
  colony_type varchar DEFAULT 'primary',
  colony_level integer DEFAULT 1,
  population integer DEFAULT 100,
  morale real DEFAULT 80,
  food_surplus integer DEFAULT 0,
  happiness integer DEFAULT 75,
  is_capital boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS starbases (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  starbase_type varchar DEFAULT 'orbital',
  name varchar NOT NULL,
  level integer DEFAULT 1,
  coordinates varchar NOT NULL,
  metal_storage integer DEFAULT 10000,
  crystal_storage integer DEFAULT 10000,
  deuterium_storage integer DEFAULT 10000,
  metal_production_rate real DEFAULT 0,
  crystal_production_rate real DEFAULT 0,
  deuterium_production_rate real DEFAULT 0,
  hangar_slots integer DEFAULT 5,
  research_slots integer DEFAULT 1,
  defense_level integer DEFAULT 0,
  is_active boolean DEFAULT true,
  last_resource_update timestamp,
  built_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moon_bases (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  base_type varchar DEFAULT 'mining',
  name varchar NOT NULL,
  level integer DEFAULT 1,
  coordinates varchar NOT NULL,
  moon_name varchar,
  metal_reserves integer DEFAULT 0,
  crystal_reserves integer DEFAULT 0,
  deuterium_reserves integer DEFAULT 0,
  mining_capacity integer DEFAULT 100,
  active_mining_ops integer DEFAULT 0,
  total_mined integer DEFAULT 0,
  research_points real DEFAULT 0,
  research_multiplier real DEFAULT 1.0,
  population integer DEFAULT 0,
  workers integer DEFAULT 0,
  shield_level integer DEFAULT 0,
  turrets integer DEFAULT 0,
  is_active boolean DEFAULT true,
  discovered_at timestamp,
  built_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mining_operations (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  colony_id varchar REFERENCES player_colonies(id),
  asteroid_id varchar REFERENCES asteroids(id),
  operation_type varchar NOT NULL,
  extraction_rate real DEFAULT 1.0,
  metal_per_hour integer DEFAULT 0,
  crystal_per_hour integer DEFAULT 0,
  deuterium_per_hour integer DEFAULT 0,
  efficiency real DEFAULT 1.0,
  workers_assigned integer DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 7: FLEET & SHIPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS fleets (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL DEFAULT 'Fleet',
  fleet_type varchar DEFAULT 'battle',
  coordinates varchar NOT NULL,
  speed real DEFAULT 1.0,
  cargo_capacity integer DEFAULT 0,
  cargo_metal integer DEFAULT 0,
  cargo_crystal integer DEFAULT 0,
  cargo_deuterium integer DEFAULT 0,
  is_in_transit boolean DEFAULT false,
  destination varchar,
  arrival_time timestamp,
  return_time timestamp,
  status varchar DEFAULT 'docked',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fleet_ships (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  fleet_id varchar NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
  ship_type varchar NOT NULL,
  ship_name varchar,
  count integer DEFAULT 1,
  tier integer DEFAULT 1,
  level integer DEFAULT 1,
  attack integer DEFAULT 0,
  defense integer DEFAULT 0,
  hp integer DEFAULT 0,
  speed real DEFAULT 1.0,
  cargo integer DEFAULT 0,
  fuel_consumption real DEFAULT 0,
  durability real DEFAULT 100,
  max_durability real DEFAULT 100,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fleet_ships_fleet ON fleet_ships(fleet_id);

CREATE TABLE IF NOT EXISTS fleet_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  fleet_id varchar NOT NULL REFERENCES fleets(id),
  ship_type varchar NOT NULL,
  ship_count integer DEFAULT 1,
  current_durability real DEFAULT 100,
  max_durability real DEFAULT 100,
  durability_percent real DEFAULT 100,
  health_status varchar DEFAULT 'pristine',
  battle_damage real DEFAULT 0,
  last_repaired_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 8: MISSIONS & COMBAT
-- ============================================================================

CREATE TABLE IF NOT EXISTS missions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  type varchar NOT NULL,
  status varchar DEFAULT 'pending',
  target varchar NOT NULL,
  origin varchar,
  fleet_id varchar REFERENCES fleets(id),
  units jsonb DEFAULT '{}',
  cargo jsonb DEFAULT '{}',
  departure_time timestamp,
  arrival_time timestamp,
  return_time timestamp,
  processed boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_missions_user ON missions(user_id, status);

CREATE TABLE IF NOT EXISTS battles (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attacker_id varchar NOT NULL REFERENCES users(id),
  defender_id varchar REFERENCES users(id),
  type varchar NOT NULL DEFAULT 'pvp',
  status varchar DEFAULT 'pending',
  attacker_coordinates varchar,
  defender_coordinates varchar,
  winner varchar,
  attacker_fleet jsonb DEFAULT '{}',
  defender_fleet jsonb DEFAULT '{}',
  attacker_losses jsonb DEFAULT '{}',
  defender_losses jsonb DEFAULT '{}',
  loot jsonb DEFAULT '{}',
  debris jsonb DEFAULT '{}',
  rounds integer DEFAULT 0,
  combat_log jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS battle_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  battle_id varchar NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  round integer NOT NULL,
  attacker_damage_dealt integer DEFAULT 0,
  defender_damage_dealt integer DEFAULT 0,
  units_destroyed jsonb DEFAULT '{}',
  log text,
  timestamp timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS combat_stats (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar UNIQUE NOT NULL REFERENCES users(id),
  total_battles integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  raid_participations integer DEFAULT 0,
  raid_victories integer DEFAULT 0,
  units_destroyed integer DEFAULT 0,
  units_lost integer DEFAULT 0,
  combat_rating integer DEFAULT 1000,
  raid_rating integer DEFAULT 1000,
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 9: ARMY SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS armies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL DEFAULT 'Army',
  army_type varchar DEFAULT 'ground',
  commander_id varchar,
  status varchar DEFAULT 'garrisoned',
  location varchar,
  total_power bigint DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS army_units (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  army_id varchar NOT NULL REFERENCES armies(id) ON DELETE CASCADE,
  unit_type varchar NOT NULL,
  unit_name varchar,
  count integer DEFAULT 1,
  tier integer DEFAULT 1,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  attack integer DEFAULT 0,
  defense integer DEFAULT 0,
  hp integer DEFAULT 0,
  speed real DEFAULT 1.0,
  morale integer DEFAULT 100,
  status varchar DEFAULT 'ready',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_army_units_army ON army_units(army_id);

CREATE TABLE IF NOT EXISTS army_training_queue (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  army_id varchar REFERENCES armies(id),
  unit_type varchar NOT NULL,
  count integer DEFAULT 1,
  start_time timestamp DEFAULT now(),
  end_time timestamp NOT NULL,
  status varchar DEFAULT 'in_progress',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS army_formations (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  formation_type varchar DEFAULT 'balanced',
  front_line jsonb DEFAULT '[]',
  main_line jsonb DEFAULT '[]',
  reserve_line jsonb DEFAULT '[]',
  bonus_attack integer DEFAULT 0,
  bonus_defense integer DEFAULT 0,
  bonus_speed real DEFAULT 0,
  is_active boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 10: ARMY COMMANDERS (GACHA SYSTEM)
-- ============================================================================

CREATE TABLE IF NOT EXISTS army_commanders (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  commander_id varchar NOT NULL,
  name varchar NOT NULL,
  rarity integer NOT NULL DEFAULT 1,
  role varchar NOT NULL,
  faction varchar NOT NULL,
  level integer DEFAULT 1,
  experience bigint DEFAULT 0,
  star_level integer DEFAULT 1,
  assigned_army_id varchar REFERENCES armies(id),
  passives jsonb DEFAULT '[]',
  actives jsonb DEFAULT '[]',
  auras jsonb DEFAULT '[]',
  synergies jsonb DEFAULT '[]',
  skill_points integer DEFAULT 0,
  skill_tree_allocation jsonb DEFAULT '{}',
  mastery_level integer DEFAULT 0,
  mastery_allocation jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_army_cmdr_player ON army_commanders(player_id);
CREATE INDEX IF NOT EXISTS idx_army_cmdr_rarity ON army_commanders(rarity DESC);

CREATE TABLE IF NOT EXISTS army_commander_shards (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  commander_id varchar NOT NULL,
  shard_count integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, commander_id)
);

CREATE TABLE IF NOT EXISTS army_gacha_pulls (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  banner_id varchar NOT NULL,
  commander_id varchar,
  rarity integer,
  is_rate_up boolean DEFAULT false,
  is_duplicate boolean DEFAULT false,
  shards_gained integer DEFAULT 0,
  currency_spent varchar,
  cost integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_army_gacha_player ON army_gacha_pulls(player_id, created_at DESC);

CREATE TABLE IF NOT EXISTS army_gacha_pity (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  banner_id varchar NOT NULL,
  pity_counter integer DEFAULT 0,
  guaranteed_legendary boolean DEFAULT false,
  total_pulls integer DEFAULT 0,
  last_pull_time timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, banner_id)
);

-- ============================================================================
-- SECTION 11: SPACE COMMANDERS (GACHA SYSTEM)
-- ============================================================================

CREATE TABLE IF NOT EXISTS space_commanders (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  commander_id varchar NOT NULL,
  name varchar NOT NULL,
  rarity integer NOT NULL DEFAULT 1,
  class_type varchar NOT NULL,
  faction varchar NOT NULL,
  level integer DEFAULT 1,
  experience bigint DEFAULT 0,
  star_level integer DEFAULT 1,
  assigned_fleet_id varchar REFERENCES fleets(id),
  equipment jsonb DEFAULT '{}',
  skills jsonb DEFAULT '{}',
  synergies jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_space_cmdr_player ON space_commanders(player_id);

CREATE TABLE IF NOT EXISTS space_commander_shards (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  commander_id varchar NOT NULL,
  shard_count integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, commander_id)
);

CREATE TABLE IF NOT EXISTS space_gacha_pulls (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  banner_id varchar NOT NULL,
  commander_id varchar,
  rarity integer,
  is_rate_up boolean DEFAULT false,
  is_duplicate boolean DEFAULT false,
  shards_gained integer DEFAULT 0,
  currency_spent varchar,
  cost integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS space_gacha_pity (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  banner_id varchar NOT NULL,
  pity_counter integer DEFAULT 0,
  guaranteed_legendary boolean DEFAULT false,
  total_pulls integer DEFAULT 0,
  last_pull_time timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, banner_id)
);

-- ============================================================================
-- SECTION 12: MASTERY SYSTEM (99 TIERS, 999 LEVELS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS player_mastery (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  category_id varchar NOT NULL,
  category_name varchar NOT NULL,
  current_level integer DEFAULT 1,
  current_tier integer DEFAULT 1,
  experience bigint DEFAULT 0,
  total_experience bigint DEFAULT 0,
  allocated_points integer DEFAULT 0,
  bonus_effects jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_mastery_player ON player_mastery(player_id);

CREATE TABLE IF NOT EXISTS player_mastery_skills (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  skill_tree_id varchar NOT NULL,
  skill_node_id varchar NOT NULL,
  current_rank integer DEFAULT 0,
  max_rank integer DEFAULT 5,
  allocated_points integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, skill_node_id)
);

CREATE TABLE IF NOT EXISTS player_skill_trees (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  tree_id varchar NOT NULL,
  tree_name varchar NOT NULL,
  branch varchar NOT NULL,
  allocated_points integer DEFAULT 0,
  max_points integer DEFAULT 100,
  unlocked_nodes jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, tree_id)
);

-- ============================================================================
-- SECTION 13: RESEARCH SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS research_areas (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  area_name varchar UNIQUE NOT NULL,
  description text,
  icon varchar,
  color varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_subcategories (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  area_id varchar NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  subcategory_name varchar NOT NULL,
  description text,
  icon varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_technologies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subcategory_id varchar NOT NULL REFERENCES research_subcategories(id) ON DELETE CASCADE,
  tech_name varchar NOT NULL,
  description text,
  tier integer DEFAULT 1,
  cost_metal integer DEFAULT 0,
  cost_crystal integer DEFAULT 0,
  cost_deuterium integer DEFAULT 0,
  cost_darkmatter integer DEFAULT 0,
  research_time_seconds integer DEFAULT 3600,
  prerequisites jsonb DEFAULT '[]',
  effects jsonb DEFAULT '{}',
  icon varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_research_progress (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  technology_id varchar NOT NULL REFERENCES research_technologies(id),
  status varchar DEFAULT 'locked',
  progress integer DEFAULT 0,
  started_at timestamp,
  completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, technology_id)
);
CREATE INDEX IF NOT EXISTS idx_research_player ON player_research_progress(user_id, status);

CREATE TABLE IF NOT EXISTS player_research_queue (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  technology_id varchar NOT NULL REFERENCES research_technologies(id),
  slot_number integer DEFAULT 1,
  start_time timestamp DEFAULT now(),
  end_time timestamp NOT NULL,
  status varchar DEFAULT 'in_progress',
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 14: TROOPS & SQUADS (RPG UNITS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS troops (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  troop_type varchar NOT NULL,
  troop_class varchar DEFAULT 'infantry',
  rank varchar DEFAULT 'recruit',
  title varchar DEFAULT '',
  health integer DEFAULT 100,
  max_health integer DEFAULT 100,
  attack integer DEFAULT 10,
  defense integer DEFAULT 5,
  speed integer DEFAULT 5,
  morale integer DEFAULT 80,
  substats jsonb DEFAULT '{}',
  weapon_type varchar,
  armor_type varchar,
  special_ability varchar,
  squad_id varchar,
  position varchar DEFAULT 'reserve',
  status varchar DEFAULT 'available',
  combat_ready boolean DEFAULT true,
  loyalty_percent integer DEFAULT 80,
  experience_points integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_troops_user ON troops(user_id);

CREATE TABLE IF NOT EXISTS squads (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  squad_type varchar DEFAULT 'infantry',
  commander_id varchar REFERENCES troops(id),
  morale integer DEFAULT 80,
  combat_experience integer DEFAULT 0,
  victories_count integer DEFAULT 0,
  max_size integer DEFAULT 20,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS unit_progression (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  troop_id varchar NOT NULL REFERENCES troops(id),
  current_level integer DEFAULT 1,
  current_tier integer DEFAULT 1,
  experience bigint DEFAULT 0,
  total_experience bigint DEFAULT 0,
  skill_points integer DEFAULT 0,
  allocated_skills jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 15: EQUIPMENT & ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  item_type varchar NOT NULL,
  item_class varchar,
  rank integer DEFAULT 1,
  rarity varchar DEFAULT 'common',
  stats jsonb DEFAULT '{}',
  bonuses jsonb DEFAULT '{}',
  required_level integer DEFAULT 1,
  required_class varchar,
  sell_price integer DEFAULT 0,
  market_price integer DEFAULT 0,
  crafting_recipe jsonb,
  sources jsonb DEFAULT '[]',
  is_unique boolean DEFAULT false,
  is_bound boolean DEFAULT false,
  is_stackable boolean DEFAULT false,
  max_stack integer DEFAULT 1,
  icon varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  item_id varchar NOT NULL REFERENCES items(id),
  quantity integer DEFAULT 1,
  is_equipped boolean DEFAULT false,
  slot varchar,
  durability integer DEFAULT 100,
  max_durability integer DEFAULT 100,
  enchantments jsonb DEFAULT '{}',
  custom_stats jsonb DEFAULT '{}',
  acquired_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_player_items_player ON player_items(player_id);

CREATE TABLE IF NOT EXISTS equipment_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  equipment_id varchar NOT NULL,
  equipment_type varchar NOT NULL,
  current_durability real DEFAULT 100,
  max_durability real DEFAULT 100,
  durability_percent real DEFAULT 100,
  degradation_rate real DEFAULT 1.0,
  is_broken boolean DEFAULT false,
  repair_cost_gold real DEFAULT 0,
  repair_cost_platinum real DEFAULT 0,
  repair_cost_resources jsonb DEFAULT '{}',
  last_repaired_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repair_history (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  item_type varchar NOT NULL,
  item_id varchar NOT NULL,
  durability_before real NOT NULL,
  durability_after real NOT NULL,
  repair_cost_gold real DEFAULT 0,
  repair_cost_platinum real DEFAULT 0,
  repair_type varchar DEFAULT 'full',
  repaired_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 16: MESSAGES & COMMUNICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  from_user_id varchar REFERENCES users(id),
  to_user_id varchar REFERENCES users(id),
  from varchar NOT NULL,
  to varchar NOT NULL,
  subject varchar NOT NULL,
  body text,
  type varchar DEFAULT 'player',
  read boolean DEFAULT false,
  battle_report jsonb,
  espionage_report jsonb,
  timestamp timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_user_id, read, timestamp DESC);

-- ============================================================================
-- SECTION 17: ALLIANCES & GUILDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS alliances (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar UNIQUE NOT NULL,
  tag varchar(10) UNIQUE,
  description text,
  announcement text,
  resources jsonb DEFAULT '{}',
  level integer DEFAULT 1,
  experience bigint DEFAULT 0,
  max_members integer DEFAULT 50,
  is_recruiting boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alliance_members (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  alliance_id varchar NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id),
  rank varchar DEFAULT 'member',
  points integer DEFAULT 0,
  contributed_resources jsonb DEFAULT '{}',
  joined_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alliance_members ON alliance_members(alliance_id);

CREATE TABLE IF NOT EXISTS guilds (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar UNIQUE NOT NULL,
  description text,
  emblem varchar,
  leader_id varchar NOT NULL REFERENCES users(id),
  co_leaders jsonb DEFAULT '[]',
  level integer DEFAULT 1,
  total_members integer DEFAULT 1,
  treasury jsonb DEFAULT '{}',
  influence integer DEFAULT 0,
  max_members integer DEFAULT 30,
  join_requirement_level integer DEFAULT 1,
  is_recruiting boolean DEFAULT true,
  roles jsonb DEFAULT '{}',
  permissions jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guild_members (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guild_id varchar NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  player_id varchar NOT NULL REFERENCES users(id),
  role varchar DEFAULT 'member',
  joined_at timestamp DEFAULT now(),
  contributed_currency integer DEFAULT 0,
  contributed_research integer DEFAULT 0,
  UNIQUE(guild_id, player_id)
);

CREATE TABLE IF NOT EXISTS teams (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guild_id varchar REFERENCES guilds(id),
  name varchar NOT NULL,
  description text,
  leader_id varchar REFERENCES users(id),
  members jsonb DEFAULT '[]',
  max_members integer DEFAULT 5,
  total_raids integer DEFAULT 0,
  wins_count integer DEFAULT 0,
  level integer DEFAULT 1,
  is_locked boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 18: FRIENDS & SOCIAL
-- ============================================================================

CREATE TABLE IF NOT EXISTS friends (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  friend_id varchar NOT NULL REFERENCES users(id),
  friendship_status varchar DEFAULT 'pending',
  nickname varchar,
  notes text,
  is_online boolean DEFAULT false,
  last_seen timestamp,
  is_favorite boolean DEFAULT false,
  added_at timestamp DEFAULT now(),
  accepted_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(player_id, friend_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id varchar NOT NULL REFERENCES users(id),
  receiver_id varchar NOT NULL REFERENCES users(id),
  message text,
  status varchar DEFAULT 'pending',
  sent_at timestamp DEFAULT now(),
  responded_at timestamp,
  expires_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 19: MARKET & TRADING
-- ============================================================================

CREATE TABLE IF NOT EXISTS market_orders (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  type varchar NOT NULL,
  resource varchar NOT NULL,
  amount integer NOT NULL,
  price_per_unit real NOT NULL,
  status varchar DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);
CREATE INDEX IF NOT EXISTS idx_market_orders ON market_orders(resource, type, status, price_per_unit);

CREATE TABLE IF NOT EXISTS auction_listings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  seller_id varchar NOT NULL REFERENCES users(id),
  seller_name varchar,
  item_type varchar NOT NULL,
  item_id varchar,
  item_name varchar,
  item_description text,
  item_rarity varchar,
  item_data jsonb,
  quantity integer DEFAULT 1,
  starting_price integer NOT NULL,
  buyout_price integer,
  current_bid integer DEFAULT 0,
  bid_increment integer DEFAULT 10,
  current_bidder_id varchar REFERENCES users(id),
  current_bidder_name varchar,
  bid_count integer DEFAULT 0,
  duration integer DEFAULT 3600,
  expires_at timestamp NOT NULL,
  status varchar DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS auction_bids (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auction_id varchar NOT NULL REFERENCES auction_listings(id),
  bidder_id varchar NOT NULL REFERENCES users(id),
  bidder_name varchar,
  bid_amount integer NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trade_offers (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id varchar NOT NULL REFERENCES users(id),
  sender_name varchar,
  receiver_id varchar NOT NULL REFERENCES users(id),
  receiver_name varchar,
  offer_metal integer DEFAULT 0,
  offer_crystal integer DEFAULT 0,
  offer_deuterium integer DEFAULT 0,
  offer_items jsonb DEFAULT '[]',
  request_metal integer DEFAULT 0,
  request_crystal integer DEFAULT 0,
  request_deuterium integer DEFAULT 0,
  request_items jsonb DEFAULT '[]',
  message text,
  status varchar DEFAULT 'pending',
  sender_message_id varchar,
  receiver_message_id varchar,
  counter_offer_id varchar,
  original_offer_id varchar,
  expires_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS trade_history (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  trade_offer_id varchar,
  sender_id varchar REFERENCES users(id),
  sender_name varchar,
  receiver_id varchar REFERENCES users(id),
  receiver_name varchar,
  sender_gave jsonb DEFAULT '{}',
  receiver_gave jsonb DEFAULT '{}',
  result varchar DEFAULT 'completed',
  completed_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 20: EXPEDITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS expeditions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  type varchar NOT NULL,
  sub_type varchar,
  category_id varchar,
  sub_category_id varchar,
  tier integer DEFAULT 1,
  tier_class varchar DEFAULT 'standard',
  tier_sub_class varchar,
  level integer DEFAULT 1,
  rank varchar DEFAULT 'recruit',
  title varchar DEFAULT '',
  target_coords varchar,
  status varchar DEFAULT 'active',
  stats jsonb DEFAULT '{}',
  attributes jsonb DEFAULT '{}',
  rewards jsonb DEFAULT '{}',
  encounters jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expedition_teams (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  expedition_id varchar NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  unit_id varchar NOT NULL,
  role varchar DEFAULT 'member',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expedition_encounters (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  expedition_id varchar NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  encounter_type varchar NOT NULL,
  description text,
  rewards jsonb DEFAULT '{}',
  outcome varchar DEFAULT 'pending',
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 21: MEGA STRUCTURES
-- ============================================================================

CREATE TABLE IF NOT EXISTS mega_structures (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  profile_id varchar REFERENCES player_profiles(id),
  name varchar NOT NULL,
  structure_type varchar NOT NULL,
  structure_class varchar,
  kind varchar,
  category varchar,
  sub_category varchar,
  level integer DEFAULT 1,
  completion_percent real DEFAULT 0,
  is_operational boolean DEFAULT false,
  coordinates varchar,
  galaxy_id varchar REFERENCES galaxies(id),
  health integer DEFAULT 1000,
  max_health integer DEFAULT 1000,
  power integer DEFAULT 0,
  efficiency real DEFAULT 1.0,
  substats jsonb DEFAULT '{}',
  attributes jsonb DEFAULT '{}',
  sub_attributes jsonb DEFAULT '{}',
  resource_production jsonb DEFAULT '{}',
  resource_storage jsonb DEFAULT '{}',
  current_resources jsonb DEFAULT '{}',
  modules jsonb DEFAULT '{}',
  systems jsonb DEFAULT '{}',
  weapons jsonb DEFAULT '{}',
  defenses jsonb DEFAULT '{}',
  description text,
  about text,
  details jsonb DEFAULT '{}',
  menus jsonb DEFAULT '{}',
  game_mechanics jsonb DEFAULT '{}',
  population integer DEFAULT 0,
  scientists integer DEFAULT 0,
  engineers integer DEFAULT 0,
  workers integer DEFAULT 0,
  soldiers integer DEFAULT 0,
  attack integer DEFAULT 0,
  defense integer DEFAULT 0,
  damage_output real DEFAULT 0,
  constructed_at timestamp,
  last_operational_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 22: STORY & CAMPAIGNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS story_campaigns (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  current_act integer DEFAULT 1,
  current_chapter integer DEFAULT 1,
  completed_acts jsonb DEFAULT '[]',
  is_completed boolean DEFAULT false,
  story_progress real DEFAULT 0,
  total_xp_earned integer DEFAULT 0,
  campaign_state jsonb DEFAULT '{}',
  npcs_encountered jsonb DEFAULT '[]',
  completed_missions jsonb DEFAULT '[]',
  started_at timestamp DEFAULT now(),
  last_played_at timestamp,
  completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS story_missions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  campaign_id varchar REFERENCES story_campaigns(id),
  act integer NOT NULL,
  chapter integer NOT NULL,
  mission_type varchar NOT NULL,
  title varchar NOT NULL,
  description text,
  lore text,
  difficulty varchar DEFAULT 'normal',
  npc_name varchar,
  npc_role varchar,
  npc_trait varchar,
  objectives jsonb DEFAULT '[]',
  reward_xp integer DEFAULT 0,
  reward_metal integer DEFAULT 0,
  reward_crystal integer DEFAULT 0,
  reward_deuterium integer DEFAULT 0,
  reward_darkmatter integer DEFAULT 0,
  reward_badge varchar,
  reward_items jsonb DEFAULT '[]',
  is_completed boolean DEFAULT false,
  is_active boolean DEFAULT false,
  completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 23: ACHIEVEMENTS & PROGRESSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS achievements (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  achievement_id varchar NOT NULL,
  name varchar NOT NULL,
  description text,
  category varchar DEFAULT 'general',
  progress integer DEFAULT 0,
  target integer DEFAULT 1,
  is_completed boolean DEFAULT false,
  reward_xp integer DEFAULT 0,
  reward_darkmatter integer DEFAULT 0,
  reward_badge varchar,
  unlocked_at timestamp,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_id, is_completed);

CREATE TABLE IF NOT EXISTS prestige_ranking (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar UNIQUE NOT NULL REFERENCES users(id),
  prestige_level integer DEFAULT 0,
  prestige_points bigint DEFAULT 0,
  total_prestige_earned bigint DEFAULT 0,
  last_prestige_at timestamp,
  bonuses jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newbie_protection (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar UNIQUE NOT NULL REFERENCES users(id),
  protection_active boolean DEFAULT true,
  protection_expires_at timestamp,
  attacks_received integer DEFAULT 0,
  max_attacks integer DEFAULT 5,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 24: NPC & FACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS npc_factions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  faction_id varchar NOT NULL,
  faction_name varchar NOT NULL,
  reputation integer DEFAULT 0,
  standing varchar DEFAULT 'neutral',
  is_unlocked boolean DEFAULT false,
  last_interaction timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS npc_vendors (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  vendor_id varchar NOT NULL,
  vendor_name varchar NOT NULL,
  faction_id varchar,
  location varchar,
  specialty varchar,
  min_reputation integer DEFAULT 0,
  restock_time integer DEFAULT 3600,
  last_restock timestamp,
  inventory jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 25: RELICS & ARTIFACTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS relics (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  relic_id varchar NOT NULL,
  name varchar NOT NULL,
  rarity varchar DEFAULT 'common',
  description text,
  type varchar NOT NULL,
  bonuses jsonb DEFAULT '{}',
  source varchar,
  price integer DEFAULT 0,
  is_owned boolean DEFAULT false,
  acquired_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS relic_inventory (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  relic_id varchar NOT NULL REFERENCES relics(id),
  is_equipped boolean DEFAULT false,
  slot varchar,
  condition integer DEFAULT 100,
  uses integer DEFAULT -1,
  acquired_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 26: RAIDS & BOSS ENCOUNTERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS raids (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attacking_team_id varchar NOT NULL REFERENCES teams(id),
  defending_team_id varchar REFERENCES teams(id),
  raid_type varchar NOT NULL,
  objective_id varchar,
  status varchar DEFAULT 'pending',
  result varchar,
  attacker_losses jsonb DEFAULT '{}',
  defender_losses jsonb DEFAULT '{}',
  rewards jsonb DEFAULT '{}',
  started_at timestamp,
  ended_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS raid_combats (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  raid_id varchar NOT NULL REFERENCES raids(id),
  attacker_id varchar NOT NULL REFERENCES users(id),
  defender_id varchar REFERENCES users(id),
  round integer DEFAULT 1,
  attacker_ships jsonb DEFAULT '{}',
  defender_ships jsonb DEFAULT '{}',
  winner varchar,
  attacker_damage integer DEFAULT 0,
  defender_damage integer DEFAULT 0,
  combat_log jsonb DEFAULT '{}',
  started_at timestamp,
  ended_at timestamp
);

CREATE TABLE IF NOT EXISTS universe_events (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  event_type varchar NOT NULL,
  event_class varchar,
  galaxy_id varchar REFERENCES galaxies(id),
  sector varchar,
  duration integer DEFAULT 3600,
  start_time timestamp NOT NULL,
  end_time timestamp NOT NULL,
  participant_limit integer DEFAULT 100,
  minimum_level integer DEFAULT 1,
  rewards jsonb DEFAULT '{}',
  difficulty varchar DEFAULT 'normal',
  status varchar DEFAULT 'active',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS universe_bosses (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  boss_type varchar NOT NULL,
  rarity varchar DEFAULT 'rare',
  health_points integer DEFAULT 10000,
  attack_power integer DEFAULT 500,
  defense integer DEFAULT 200,
  speed integer DEFAULT 10,
  abilities jsonb DEFAULT '[]',
  weaknesses jsonb DEFAULT '[]',
  resistances jsonb DEFAULT '[]',
  loot_table jsonb DEFAULT '[]',
  boss_reward jsonb DEFAULT '{}',
  recommended_level integer DEFAULT 10,
  recommended_players integer DEFAULT 5,
  min_players integer DEFAULT 1,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boss_encounters (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id varchar REFERENCES universe_events(id),
  boss_id varchar NOT NULL REFERENCES universe_bosses(id),
  current_health integer,
  status varchar DEFAULT 'active',
  participants jsonb DEFAULT '[]',
  participant_count integer DEFAULT 0,
  total_damage_dealt bigint DEFAULT 0,
  combat_log jsonb DEFAULT '[]',
  total_rewards jsonb DEFAULT '{}',
  started_at timestamp DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS pve_combat_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id varchar REFERENCES universe_events(id),
  encounter_id varchar REFERENCES boss_encounters(id),
  player_id varchar NOT NULL REFERENCES users(id),
  role_in_combat varchar DEFAULT 'attacker',
  damage_dealt integer DEFAULT 0,
  damage_received integer DEFAULT 0,
  heals_provided integer DEFAULT 0,
  controls_applied integer DEFAULT 0,
  survived boolean DEFAULT true,
  contribution real DEFAULT 0,
  rewards jsonb DEFAULT '{}',
  participation_status varchar DEFAULT 'participated',
  started_at timestamp,
  ended_at timestamp
);

-- ============================================================================
-- SECTION 27: DURABILITY & DEGRADATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS building_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  building_id varchar NOT NULL,
  building_type varchar NOT NULL,
  building_level integer DEFAULT 1,
  current_durability real DEFAULT 100,
  max_durability real DEFAULT 100,
  durability_percent real DEFAULT 100,
  structural_integrity real DEFAULT 100,
  damage_from_attack real DEFAULT 0,
  last_repaired_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS durability_degradation_log (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  item_type varchar NOT NULL,
  item_id varchar NOT NULL,
  degradation_amount real NOT NULL,
  degradation_source varchar,
  durability_before real NOT NULL,
  durability_after real NOT NULL,
  logged_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 28: OGAME CATALOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS ogame_catalog_categories (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar UNIQUE NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ogame_catalog_entries (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id varchar NOT NULL REFERENCES ogame_catalog_categories(id),
  entry_type varchar NOT NULL,
  name varchar NOT NULL,
  description text,
  base_cost jsonb DEFAULT '{}',
  base_time_seconds integer DEFAULT 0,
  growth_factor real DEFAULT 1.5,
  prerequisites jsonb DEFAULT '{}',
  stats jsonb DEFAULT '{}',
  is_moon_only boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 29: CUSTOM LABS & RESEARCH TRADING
-- ============================================================================

CREATE TABLE IF NOT EXISTS custom_labs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  lab_name varchar NOT NULL,
  lab_type varchar NOT NULL,
  level integer DEFAULT 1,
  research_speed_bonus real DEFAULT 0,
  research_cost_reduction real DEFAULT 0,
  specializations jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_trades (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  provider_id varchar NOT NULL REFERENCES users(id),
  requester_id varchar NOT NULL REFERENCES users(id),
  technology_id varchar NOT NULL REFERENCES research_technologies(id),
  trade_type varchar NOT NULL,
  price_darkmatter integer DEFAULT 0,
  status varchar DEFAULT 'pending',
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);

-- ============================================================================
-- SECTION 30: MULTIPLAYER BONUSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS multiplayer_bonuses (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  bonus_type varchar NOT NULL,
  bonus_value real DEFAULT 0,
  source varchar NOT NULL,
  source_id varchar,
  active boolean DEFAULT true,
  expires_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 31: SYSTEM & ADMIN
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key varchar UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category varchar DEFAULT 'general',
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_settings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category varchar NOT NULL,
  key varchar NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp DEFAULT now(),
  UNIQUE(category, key)
);

CREATE TABLE IF NOT EXISTS feature_flags (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  flag_name varchar UNIQUE NOT NULL,
  is_enabled boolean DEFAULT false,
  description text,
  rollout_percent integer DEFAULT 0,
  allowed_users jsonb DEFAULT '[]',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_limit_rules (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  endpoint varchar NOT NULL,
  max_requests integer DEFAULT 100,
  window_seconds integer DEFAULT 60,
  penalty_seconds integer DEFAULT 300,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_activity_log (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id),
  action varchar NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address varchar,
  created_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_log_player ON player_activity_log(player_id, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_id varchar NOT NULL REFERENCES users(id),
  action varchar NOT NULL,
  target_user_id varchar,
  target_type varchar,
  target_id varchar,
  details jsonb DEFAULT '{}',
  ip_address varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS server_metrics (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  metric_name varchar NOT NULL,
  metric_value real NOT NULL,
  tags jsonb DEFAULT '{}',
  recorded_at timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_server_metrics ON server_metrics(metric_name, recorded_at DESC);

CREATE TABLE IF NOT EXISTS error_tracking (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  error_type varchar NOT NULL,
  error_message text,
  stack_trace text,
  player_id varchar,
  endpoint varchar,
  ip_address varchar,
  user_agent text,
  resolved boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title varchar NOT NULL,
  body text NOT NULL,
  announcement_type varchar DEFAULT 'info',
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamp,
  created_by varchar REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

-- ============================================================================
-- SECTION 32: VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW player_dashboard AS
SELECT
  u.id AS user_id,
  u.username,
  u.email,
  u.first_name,
  u.last_name,
  ps.planet_name,
  ps.coordinates,
  ps.empire_level,
  ps.empire_experience,
  ps.tier,
  ps.total_turns,
  ps.current_turns,
  ps.resources,
  pp.level AS profile_level,
  pp.total_experience,
  pp.fleet_power,
  pp.empire_power,
  pp.galaxy_rank,
  dm.balance AS dark_matter_balance,
  dm.login_streak,
  pc.silver,
  pc.gold,
  pc.platinum,
  cs.total_battles,
  cs.wins,
  cs.losses,
  cs.combat_rating
FROM users u
LEFT JOIN player_states ps ON ps.user_id = u.id
LEFT JOIN player_profiles pp ON pp.user_id = u.id
LEFT JOIN player_dark_matter dm ON dm.user_id = u.id
LEFT JOIN player_currency pc ON pc.user_id = u.id
LEFT JOIN combat_stats cs ON cs.player_id = u.id;

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id AS user_id,
  u.username,
  pp.level,
  pp.total_experience,
  pp.fleet_power,
  pp.empire_power,
  pp.galaxy_rank,
  ps.empire_level,
  ps.tier,
  cs.combat_rating,
  cs.wins,
  cs.total_battles,
  (COALESCE(pp.fleet_power, 0) + COALESCE(pp.empire_power, 0) + COALESCE(cs.combat_rating, 0) * 10) AS total_score
FROM users u
LEFT JOIN player_profiles pp ON pp.user_id = u.id
LEFT JOIN player_states ps ON ps.user_id = u.id
LEFT JOIN combat_stats cs ON cs.player_id = u.id
ORDER BY total_score DESC;

CREATE OR REPLACE VIEW alliance_overview AS
SELECT
  a.id,
  a.name,
  a.tag,
  a.description,
  a.level,
  u.username AS leader_name,
  COUNT(am.id) AS member_count,
  a.max_members,
  a.is_recruiting
FROM alliances a
LEFT JOIN users u ON u.id = (
  SELECT user_id FROM alliance_members WHERE alliance_id = a.id AND rank = 'leader' LIMIT 1
)
LEFT JOIN alliance_members am ON am.alliance_id = a.id
GROUP BY a.id, a.name, a.tag, a.description, a.level, u.username, a.max_members, a.is_recruiting;

-- ============================================================================
-- SECTION 33: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_player_states_user ON player_states(user_id);
CREATE INDEX IF NOT EXISTS idx_fleets_player ON fleets(player_id);
CREATE INDEX IF NOT EXISTS idx_battles_attacker ON battles(attacker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_battles_defender ON battles(defender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_orders_active ON market_orders(resource, type, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(to_user_id) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_guild_members_guild ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_armies_player ON armies(player_id);
CREATE INDEX IF NOT EXISTS idx_mega_structures_player ON mega_structures(player_id);
CREATE INDEX IF NOT EXISTS idx_expeditions_player ON expeditions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_story_missions_player ON story_missions(player_id, is_active);
CREATE INDEX IF NOT EXISTS idx_dark_matter_balance ON player_dark_matter(user_id);

-- ============================================================================
-- SECTION 34: AUTO-UPDATE TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_player_states_updated_at BEFORE UPDATE ON player_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_player_profiles_updated_at BEFORE UPDATE ON player_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_player_dark_matter_updated_at BEFORE UPDATE ON player_dark_matter
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_army_commanders_updated_at BEFORE UPDATE ON army_commanders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_fleets_updated_at BEFORE UPDATE ON fleets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mega_structures_updated_at BEFORE UPDATE ON mega_structures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_alliances_updated_at BEFORE UPDATE ON alliances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_guilds_updated_at BEFORE UPDATE ON guilds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMIT;
