-- Stellar Dominion - Full Game Foundation SQL Pack
-- Safe to run multiple times (IF NOT EXISTS).

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expire
  ON sessions(expire);

CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username varchar UNIQUE,
  password_hash varchar,
  email varchar UNIQUE,
  first_name varchar,
  last_name varchar,
  profile_image_url varchar,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_states (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  setup_complete boolean NOT NULL DEFAULT false,
  planet_name varchar NOT NULL DEFAULT 'New Colony',
  coordinates varchar NOT NULL DEFAULT '[1:1:1]',
  known_planets jsonb NOT NULL DEFAULT '[]'::jsonb,
  travel_state jsonb NOT NULL DEFAULT '{"activeRoute":null,"discoveredWormholes":[]}'::jsonb,
  travel_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  resources jsonb NOT NULL DEFAULT '{"metal":1000,"crystal":500,"deuterium":0,"energy":0}'::jsonb,
  buildings jsonb NOT NULL DEFAULT '{"roboticsFactory":0,"shipyard":0,"researchLab":0}'::jsonb,
  orbital_buildings jsonb NOT NULL DEFAULT '{}'::jsonb,
  research jsonb NOT NULL DEFAULT '{}'::jsonb,
  research_queue jsonb NOT NULL DEFAULT '[]'::jsonb,
  research_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  active_research jsonb NOT NULL DEFAULT 'null'::jsonb,
  research_bonuses jsonb NOT NULL DEFAULT '[]'::jsonb,
  research_modifiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  research_lab jsonb NOT NULL DEFAULT '{"type":"standard","level":1,"specialization":"general","durability":100}'::jsonb,
  available_labs jsonb NOT NULL DEFAULT '[]'::jsonb,
  turns_data jsonb NOT NULL DEFAULT '{"totalTurnsGenerated":0,"currentTurn":0,"lastTurnTimestamp":0,"turnsAvailable":0,"currentResearchTurns":0,"researchTurnHistory":[]}'::jsonb,
  research_xp jsonb NOT NULL DEFAULT '{"totalXP":0,"currentLevelXP":0,"currentLevel":1,"researchesCompleted":0,"discoveredTechs":[],"discoveries":[],"discoveryStreak":0,"lastDiscoveryTime":0,"discoveryMultiplier":1.0}'::jsonb,
  units jsonb NOT NULL DEFAULT '{}'::jsonb,
  commander jsonb NOT NULL DEFAULT '{}'::jsonb,
  government jsonb NOT NULL DEFAULT '{}'::jsonb,
  artifacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  cron_jobs jsonb NOT NULL DEFAULT '[]'::jsonb,
  empire_level integer NOT NULL DEFAULT 1,
  empire_experience bigint NOT NULL DEFAULT 0,
  tier integer NOT NULL DEFAULT 1,
  tier_experience bigint NOT NULL DEFAULT 0,
  prestige_level integer NOT NULL DEFAULT 0,
  prestige_bonus jsonb NOT NULL DEFAULT '{"resourceMultiplier":1.0,"experienceMultiplier":1.0,"researchMultiplier":1.0}'::jsonb,
  tier_bonuses jsonb NOT NULL DEFAULT '{}'::jsonb,
  kardashev_progress jsonb NOT NULL DEFAULT '{"metal":0,"crystal":0,"deuterium":0,"research":0}'::jsonb,
  total_turns integer NOT NULL DEFAULT 0,
  current_turns integer NOT NULL DEFAULT 0,
  last_turn_update timestamp NOT NULL DEFAULT now(),
  last_resource_update timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_states_user_id
  ON player_states(user_id);

CREATE TABLE IF NOT EXISTS missions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'outbound',
  target varchar NOT NULL,
  origin varchar NOT NULL,
  units jsonb NOT NULL,
  cargo jsonb,
  departure_time timestamp NOT NULL,
  arrival_time timestamp NOT NULL,
  return_time timestamp,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_missions_user_status
  ON missions(user_id, status);

CREATE TABLE IF NOT EXISTS messages (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  from_user_id varchar REFERENCES users(id) ON DELETE CASCADE,
  to_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "from" varchar NOT NULL,
  "to" varchar NOT NULL,
  subject varchar NOT NULL,
  body text NOT NULL,
  type varchar NOT NULL DEFAULT 'player',
  read boolean NOT NULL DEFAULT false,
  battle_report jsonb,
  espionage_report jsonb,
  "timestamp" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_to_user_read
  ON messages(to_user_id, read, "timestamp" DESC);

CREATE TABLE IF NOT EXISTS alliances (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL UNIQUE,
  tag varchar(10) NOT NULL UNIQUE,
  description text NOT NULL DEFAULT 'A new alliance rises.',
  announcement text DEFAULT 'Welcome to the alliance.',
  resources jsonb NOT NULL DEFAULT '{"metal":0,"crystal":0,"deuterium":0}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alliance_members (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  alliance_id varchar NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank varchar NOT NULL DEFAULT 'recruit',
  points integer NOT NULL DEFAULT 0,
  joined_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alliance_members_alliance
  ON alliance_members(alliance_id);
CREATE INDEX IF NOT EXISTS idx_alliance_members_user
  ON alliance_members(user_id);

CREATE TABLE IF NOT EXISTS market_orders (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar NOT NULL,
  resource varchar NOT NULL,
  amount integer NOT NULL,
  price_per_unit real NOT NULL,
  status varchar NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_market_orders_status_created
  ON market_orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS auction_listings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  seller_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_name varchar NOT NULL,
  item_type varchar NOT NULL,
  item_id varchar NOT NULL,
  item_name varchar NOT NULL,
  item_description text,
  item_rarity varchar DEFAULT 'common',
  item_data jsonb,
  quantity integer NOT NULL DEFAULT 1,
  starting_price integer NOT NULL,
  buyout_price integer,
  current_bid integer DEFAULT 0,
  bid_increment integer NOT NULL DEFAULT 10,
  current_bidder_id varchar REFERENCES users(id) ON DELETE SET NULL,
  current_bidder_name varchar,
  bid_count integer NOT NULL DEFAULT 0,
  duration integer NOT NULL DEFAULT 24,
  expires_at timestamp NOT NULL,
  status varchar NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_auction_listings_status_expires
  ON auction_listings(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_auction_listings_seller
  ON auction_listings(seller_id, created_at DESC);

CREATE TABLE IF NOT EXISTS auction_bids (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auction_id varchar NOT NULL REFERENCES auction_listings(id) ON DELETE CASCADE,
  bidder_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bidder_name varchar NOT NULL,
  bid_amount integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_created
  ON auction_bids(auction_id, created_at DESC);

CREATE TABLE IF NOT EXISTS trade_offers (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name varchar NOT NULL,
  receiver_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_name varchar NOT NULL,
  offer_metal integer NOT NULL DEFAULT 0,
  offer_crystal integer NOT NULL DEFAULT 0,
  offer_deuterium integer NOT NULL DEFAULT 0,
  offer_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  request_metal integer NOT NULL DEFAULT 0,
  request_crystal integer NOT NULL DEFAULT 0,
  request_deuterium integer NOT NULL DEFAULT 0,
  request_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  message text,
  status varchar NOT NULL DEFAULT 'pending',
  sender_message_id varchar,
  receiver_message_id varchar,
  counter_offer_id varchar,
  original_offer_id varchar,
  expires_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_trade_offers_receiver_status
  ON trade_offers(receiver_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trade_offers_sender_status
  ON trade_offers(sender_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS trade_history (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  trade_offer_id varchar NOT NULL,
  sender_id varchar NOT NULL,
  sender_name varchar NOT NULL,
  receiver_id varchar NOT NULL,
  receiver_name varchar NOT NULL,
  sender_gave jsonb NOT NULL,
  receiver_gave jsonb NOT NULL,
  result varchar NOT NULL,
  completed_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trade_history_sender_completed
  ON trade_history(sender_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_trade_history_receiver_completed
  ON trade_history(receiver_id, completed_at DESC);

CREATE TABLE IF NOT EXISTS queue_items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar NOT NULL,
  item_id varchar NOT NULL,
  item_name varchar NOT NULL,
  amount integer,
  start_time timestamp NOT NULL,
  end_time timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_queue_items_user_end_time
  ON queue_items(user_id, end_time);

CREATE TABLE IF NOT EXISTS battles (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attacker_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  defender_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'completed',
  attacker_coordinates varchar NOT NULL,
  defender_coordinates varchar NOT NULL,
  winner varchar,
  attacker_fleet jsonb NOT NULL,
  defender_fleet jsonb NOT NULL,
  attacker_losses jsonb,
  defender_losses jsonb,
  loot jsonb,
  debris jsonb,
  rounds integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_battles_attacker_created
  ON battles(attacker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_battles_defender_created
  ON battles(defender_id, created_at DESC);

CREATE TABLE IF NOT EXISTS battle_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  battle_id varchar NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  round integer NOT NULL,
  attacker_damage_dealt integer NOT NULL DEFAULT 0,
  defender_damage_dealt integer NOT NULL DEFAULT 0,
  units_destroyed jsonb,
  log text,
  "timestamp" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_battle_logs_battle_round
  ON battle_logs(battle_id, round);

CREATE TABLE IF NOT EXISTS player_colonies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  planet_id integer NOT NULL,
  colony_name varchar NOT NULL,
  colony_type varchar NOT NULL,
  colony_level integer NOT NULL DEFAULT 1,
  population integer NOT NULL DEFAULT 1000,
  built_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_colonies_player
  ON player_colonies(player_id);

CREATE TABLE IF NOT EXISTS starbases (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  starbase_type varchar NOT NULL,
  name varchar NOT NULL,
  level integer NOT NULL DEFAULT 1,
  coordinates varchar NOT NULL,
  metal_storage integer NOT NULL DEFAULT 10000,
  crystal_storage integer NOT NULL DEFAULT 10000,
  deuterium_storage integer NOT NULL DEFAULT 5000,
  metal_production_rate real NOT NULL DEFAULT 100,
  crystal_production_rate real NOT NULL DEFAULT 50,
  deuterium_production_rate real NOT NULL DEFAULT 25,
  hangar_slots integer NOT NULL DEFAULT 50,
  research_slots integer NOT NULL DEFAULT 5,
  defense_level integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  last_resource_update timestamp NOT NULL DEFAULT now(),
  built_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_starbases_player
  ON starbases(player_id);

CREATE TABLE IF NOT EXISTS moon_bases (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_type varchar NOT NULL,
  name varchar NOT NULL,
  level integer NOT NULL DEFAULT 1,
  coordinates varchar NOT NULL,
  moon_name varchar NOT NULL,
  metal_reserves integer NOT NULL DEFAULT 5000,
  crystal_reserves integer NOT NULL DEFAULT 3000,
  deuterium_reserves integer NOT NULL DEFAULT 1000,
  mining_capacity integer NOT NULL DEFAULT 1000,
  active_mining_ops integer NOT NULL DEFAULT 0,
  total_mined integer NOT NULL DEFAULT 0,
  research_points real NOT NULL DEFAULT 0,
  research_multiplier real NOT NULL DEFAULT 1.0,
  population integer NOT NULL DEFAULT 500,
  workers integer NOT NULL DEFAULT 100,
  shield_level integer NOT NULL DEFAULT 0,
  turrets integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  discovered_at timestamp NOT NULL DEFAULT now(),
  built_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moon_bases_player
  ON moon_bases(player_id);

CREATE TABLE IF NOT EXISTS player_currency (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  silver bigint NOT NULL DEFAULT 0,
  gold bigint NOT NULL DEFAULT 0,
  platinum bigint NOT NULL DEFAULT 0,
  updated_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS currency_transactions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency_type varchar NOT NULL,
  amount bigint NOT NULL,
  reason varchar NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_currency_transactions_player_created
  ON currency_transactions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  account_balance bigint NOT NULL DEFAULT 0,
  account_type varchar NOT NULL DEFAULT 'standard',
  interest_rate real NOT NULL DEFAULT 0.01,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bank_transactions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  account_id varchar NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type varchar NOT NULL,
  amount bigint NOT NULL,
  balance_before bigint,
  balance_after bigint,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_created
  ON bank_transactions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS empire_values (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  resource_value bigint NOT NULL DEFAULT 0,
  currency_value bigint NOT NULL DEFAULT 0,
  total_value bigint NOT NULL DEFAULT 0,
  updated_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_settings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key varchar NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  category varchar NOT NULL DEFAULT 'general',
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role varchar NOT NULL DEFAULT 'moderator',
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mining_operations (
  id varchar PRIMARY KEY,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type varchar NOT NULL,
  amount_per_hour integer NOT NULL DEFAULT 0,
  status varchar NOT NULL DEFAULT 'active',
  started_at timestamp NOT NULL DEFAULT now(),
  ends_at timestamp,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mining_operations_user_status
  ON mining_operations(user_id, status);

CREATE TABLE IF NOT EXISTS research_trades (
  id varchar PRIMARY KEY,
  initiator_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status varchar NOT NULL DEFAULT 'pending',
  initiator_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
  recipient_offer jsonb NOT NULL DEFAULT '{}'::jsonb,
  rejection_reason text,
  created_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp NOT NULL,
  completed_at timestamp,
  dispute_id varchar,
  dispute_status varchar
);

CREATE INDEX IF NOT EXISTS idx_research_trades_status_created
  ON research_trades(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_trades_initiator
  ON research_trades(initiator_id, status);
CREATE INDEX IF NOT EXISTS idx_research_trades_recipient
  ON research_trades(recipient_id, status);

CREATE TABLE IF NOT EXISTS research_trade_ratings (
  id varchar PRIMARY KEY,
  rater_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_id varchar,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_trade_ratings_target
  ON research_trade_ratings(target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS research_trade_blocks (
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (player_id, blocked_player_id)
);

CREATE TABLE IF NOT EXISTS research_trade_disputes (
  id varchar PRIMARY KEY,
  trade_id varchar NOT NULL,
  opened_by varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status varchar NOT NULL DEFAULT 'pending',
  resolution text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_trade_disputes_trade
  ON research_trade_disputes(trade_id, status);

CREATE TABLE IF NOT EXISTS game_assets (
  id varchar PRIMARY KEY,
  asset_key varchar NOT NULL UNIQUE,
  category varchar NOT NULL,
  name varchar NOT NULL,
  mime_type varchar,
  uri text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by varchar REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_asset_bundles (
  id varchar PRIMARY KEY,
  bundle_key varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  description text,
  version varchar NOT NULL DEFAULT '1.0.0',
  manifest jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_asset_bundle_items (
  bundle_id varchar NOT NULL REFERENCES game_asset_bundles(id) ON DELETE CASCADE,
  asset_id varchar NOT NULL REFERENCES game_assets(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, asset_id)
);

CREATE TABLE IF NOT EXISTS player_trade_profiles (
  player_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  trust_score integer NOT NULL DEFAULT 50,
  fairness_score integer NOT NULL DEFAULT 50,
  completed_trades integer NOT NULL DEFAULT 0,
  disputes_opened integer NOT NULL DEFAULT 0,
  disputes_lost integer NOT NULL DEFAULT 0,
  is_blacklisted boolean NOT NULL DEFAULT false,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_labs (
  id varchar PRIMARY KEY,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  specialization varchar NOT NULL,
  level integer NOT NULL DEFAULT 1,
  durability integer NOT NULL DEFAULT 100,
  modifiers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_achievement_profiles (
  user_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0,
  achievements jsonb NOT NULL DEFAULT '{}'::jsonb,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  tech_count integer NOT NULL DEFAULT 0,
  discovery_count integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL DEFAULT 1,
  specialization_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_alliances (
  id varchar PRIMARY KEY,
  name varchar NOT NULL,
  faction varchar NOT NULL,
  leader_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_alliance_members (
  alliance_id varchar NOT NULL REFERENCES research_alliances(id) ON DELETE CASCADE,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar NOT NULL DEFAULT 'member',
  joined_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (alliance_id, user_id)
);

CREATE TABLE IF NOT EXISTS research_alliance_pools (
  alliance_id varchar PRIMARY KEY REFERENCES research_alliances(id) ON DELETE CASCADE,
  metals bigint NOT NULL DEFAULT 0,
  credits bigint NOT NULL DEFAULT 0,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS multiplayer_research_bonuses (
  id varchar PRIMARY KEY,
  source_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bonus_type varchar NOT NULL,
  multiplier numeric(8,4) NOT NULL DEFAULT 1,
  expires_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_multiplayer_research_bonuses_target
  ON multiplayer_research_bonuses(target_user_id, bonus_type);

CREATE TABLE IF NOT EXISTS troops (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  troop_type varchar NOT NULL,
  troop_class varchar NOT NULL,
  rank varchar NOT NULL DEFAULT 'recruit',
  title varchar,
  health integer NOT NULL DEFAULT 100,
  max_health integer NOT NULL DEFAULT 100,
  attack integer NOT NULL DEFAULT 10,
  defense integer NOT NULL DEFAULT 5,
  speed integer NOT NULL DEFAULT 8,
  morale integer NOT NULL DEFAULT 100,
  substats jsonb NOT NULL DEFAULT '{"critChance":5,"critDamage":50,"armor":0,"magicResist":0,"accuracy":90,"evasion":10,"regeneration":0,"lifesteal":0,"experience":0,"level":1}'::jsonb,
  weapon_type varchar,
  armor_type varchar,
  special_ability varchar,
  squad_id varchar,
  position varchar,
  status varchar NOT NULL DEFAULT 'active',
  combat_ready boolean NOT NULL DEFAULT true,
  loyalty_percent integer NOT NULL DEFAULT 100,
  experience_points integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_troops_user_status
  ON troops(user_id, status);

CREATE TABLE IF NOT EXISTS squads (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  squad_type varchar NOT NULL,
  commander_id varchar REFERENCES troops(id) ON DELETE SET NULL,
  morale integer NOT NULL DEFAULT 100,
  combat_experience integer NOT NULL DEFAULT 0,
  victories_count integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_squads_user
  ON squads(user_id);

CREATE TABLE IF NOT EXISTS equipment_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_id varchar NOT NULL,
  equipment_type varchar NOT NULL,
  current_durability real NOT NULL DEFAULT 100,
  max_durability real NOT NULL DEFAULT 100,
  durability_percent integer NOT NULL DEFAULT 100,
  degradation_rate real NOT NULL DEFAULT 0.5,
  is_broken boolean NOT NULL DEFAULT false,
  repair_cost_gold real NOT NULL DEFAULT 0,
  repair_cost_platinum real NOT NULL DEFAULT 0,
  repair_cost_resources jsonb,
  last_repaired_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_equipment_durability_player
  ON equipment_durability(player_id);

CREATE TABLE IF NOT EXISTS fleet_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fleet_id varchar NOT NULL,
  ship_type varchar NOT NULL,
  ship_count integer NOT NULL,
  current_durability real NOT NULL DEFAULT 100,
  max_durability real NOT NULL DEFAULT 100,
  durability_percent integer NOT NULL DEFAULT 100,
  health_status varchar NOT NULL DEFAULT 'optimal',
  battle_damage real NOT NULL DEFAULT 0,
  last_repaired_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fleet_durability_player
  ON fleet_durability(player_id);

CREATE TABLE IF NOT EXISTS building_durability (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  building_id varchar NOT NULL,
  building_type varchar NOT NULL,
  building_level integer NOT NULL,
  current_durability real NOT NULL DEFAULT 100,
  max_durability real NOT NULL DEFAULT 100,
  durability_percent integer NOT NULL DEFAULT 100,
  structural_integrity varchar NOT NULL DEFAULT 'intact',
  damage_from_attack real NOT NULL DEFAULT 0,
  last_repaired_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_building_durability_player
  ON building_durability(player_id);

CREATE TABLE IF NOT EXISTS repair_history (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type varchar NOT NULL,
  item_id varchar NOT NULL,
  durability_before real NOT NULL,
  durability_after real NOT NULL,
  repair_cost_gold real NOT NULL DEFAULT 0,
  repair_cost_platinum real NOT NULL DEFAULT 0,
  repair_type varchar NOT NULL,
  repaired_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_repair_history_player_repaired
  ON repair_history(player_id, repaired_at DESC);

CREATE TABLE IF NOT EXISTS durability_degradation_log (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type varchar NOT NULL,
  item_id varchar NOT NULL,
  degradation_amount real NOT NULL,
  degradation_source varchar NOT NULL,
  durability_before real NOT NULL,
  durability_after real NOT NULL,
  logged_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_durability_degradation_player_logged
  ON durability_degradation_log(player_id, logged_at DESC);

CREATE TABLE IF NOT EXISTS research_areas (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  area_name varchar NOT NULL,
  description text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_subcategories (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  area_id varchar NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  subcategory_name varchar NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_subcategories_area
  ON research_subcategories(area_id);

CREATE TABLE IF NOT EXISTS research_technologies (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subcategory_id varchar NOT NULL REFERENCES research_subcategories(id) ON DELETE CASCADE,
  tech_name varchar NOT NULL,
  description text,
  requirements jsonb,
  effects jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_technologies_subcategory
  ON research_technologies(subcategory_id);

CREATE TABLE IF NOT EXISTS player_research_progress (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  technology_id varchar NOT NULL REFERENCES research_technologies(id) ON DELETE CASCADE,
  status varchar NOT NULL DEFAULT 'available',
  progress integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_research_progress_user
  ON player_research_progress(user_id, status);

CREATE TABLE IF NOT EXISTS expeditions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  type varchar NOT NULL,
  target_coords varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expeditions_user_status
  ON expeditions(user_id, status);

CREATE TABLE IF NOT EXISTS expedition_teams (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  expedition_id varchar NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  unit_id varchar NOT NULL,
  role varchar NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expedition_teams_expedition
  ON expedition_teams(expedition_id);

CREATE TABLE IF NOT EXISTS expedition_encounters (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  expedition_id varchar NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  encounter_type varchar NOT NULL,
  description text,
  rewards jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expedition_encounters_expedition
  ON expedition_encounters(expedition_id);

CREATE TABLE IF NOT EXISTS continents (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  continent_name varchar NOT NULL,
  area_sqkm real,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS countries (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  continent_id varchar NOT NULL REFERENCES continents(id) ON DELETE CASCADE,
  country_name varchar NOT NULL,
  country_type varchar NOT NULL,
  owner_player_id varchar REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_continent
  ON countries(continent_id);

CREATE TABLE IF NOT EXISTS territories (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country_id varchar NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  territory_name varchar NOT NULL,
  territory_type varchar NOT NULL,
  area_sqkm real,
  controlled_by_player_id varchar REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_territories_country
  ON territories(country_id);

CREATE TABLE IF NOT EXISTS resource_fields (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  territory_id varchar NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  field_name varchar NOT NULL,
  field_type varchar NOT NULL,
  field_size varchar NOT NULL,
  metal_per_hour real NOT NULL DEFAULT 0,
  crystal_per_hour real NOT NULL DEFAULT 0,
  deuterium_per_hour real NOT NULL DEFAULT 0,
  max_extraction_capacity integer NOT NULL DEFAULT 100,
  depletion_percent integer NOT NULL DEFAULT 0,
  is_depleted boolean NOT NULL DEFAULT false,
  mined_by_player_id varchar REFERENCES users(id) ON DELETE SET NULL,
  total_metal_extracted real NOT NULL DEFAULT 0,
  total_crystal_extracted real NOT NULL DEFAULT 0,
  total_deuterium_extracted real NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resource_fields_territory
  ON resource_fields(territory_id);

CREATE TABLE IF NOT EXISTS player_profiles (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  uid varchar NOT NULL UNIQUE,
  display_name varchar NOT NULL,
  bio text,
  profile_image_url varchar,
  level integer NOT NULL DEFAULT 1,
  total_experience integer NOT NULL DEFAULT 0,
  prestige_level integer NOT NULL DEFAULT 0,
  galaxy_rank integer,
  fleet_power integer NOT NULL DEFAULT 0,
  empire_power integer NOT NULL DEFAULT 0,
  attributes jsonb NOT NULL DEFAULT '{"strength":10,"intelligence":10,"endurance":10,"agility":10,"wisdom":10,"charisma":10}'::jsonb,
  sub_attributes jsonb NOT NULL DEFAULT '{"critChance":5,"critDamage":50,"dodge":10,"accuracy":90,"magicResist":0,"lifeSteal":0}'::jsonb,
  categories jsonb NOT NULL DEFAULT '{"military":1,"engineering":1,"science":1,"commerce":1,"diplomacy":1,"exploration":1}'::jsonb,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_online boolean NOT NULL DEFAULT false,
  last_activity_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mega_structures (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id varchar REFERENCES player_profiles(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  structure_type varchar NOT NULL,
  structure_class varchar NOT NULL,
  kind varchar NOT NULL,
  category varchar NOT NULL,
  sub_category varchar,
  level integer NOT NULL DEFAULT 1,
  completion_percent integer NOT NULL DEFAULT 0,
  is_operational boolean NOT NULL DEFAULT false,
  coordinates varchar NOT NULL,
  galaxy_id integer,
  health integer NOT NULL DEFAULT 1000000,
  max_health integer NOT NULL DEFAULT 1000000,
  power integer NOT NULL DEFAULT 100000,
  efficiency real NOT NULL DEFAULT 1.0,
  substats jsonb NOT NULL DEFAULT '{"productionRate":1000,"researchMultiplier":2.0,"defenseMultiplier":1.5,"capacityMultiplier":3.0,"efficiencyRating":95}'::jsonb,
  attributes jsonb NOT NULL DEFAULT '{"durability":100,"reliability":95,"adaptability":80,"scalability":90,"sustainability":85}'::jsonb,
  sub_attributes jsonb NOT NULL DEFAULT '{"maintenanceCost":10000,"powerConsumption":50000,"productionCapacity":500000,"storageCapacity":1000000,"repairRate":5000}'::jsonb,
  resource_production jsonb NOT NULL DEFAULT '{"metal":50000,"crystal":25000,"deuterium":10000,"energy":100000}'::jsonb,
  resource_storage jsonb NOT NULL DEFAULT '{"metal":5000000,"crystal":2500000,"deuterium":1000000,"energy":10000000}'::jsonb,
  current_resources jsonb NOT NULL DEFAULT '{"metal":1000000,"crystal":500000,"deuterium":250000,"energy":5000000}'::jsonb,
  modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  systems jsonb NOT NULL DEFAULT '[]'::jsonb,
  weapons jsonb NOT NULL DEFAULT '[]'::jsonb,
  defenses jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  about text,
  details jsonb NOT NULL DEFAULT '{"constructionTime":0,"estimatedCompletion":null,"workforce":10000,"researchTeams":100}'::jsonb,
  menus jsonb NOT NULL DEFAULT '{"construction":{"status":"planning","progress":0},"production":{"enabled":false,"rates":{}},"research":{"projects":[],"completed":[]},"defense":{"shields":true,"weapons":true},"management":{"staffing":100,"efficiency":95}}'::jsonb,
  game_mechanics jsonb NOT NULL DEFAULT '{"captureable":false,"destroyable":true,"transferable":false,"scalable":true,"networked":false,"effects":[]}'::jsonb,
  population integer NOT NULL DEFAULT 100000,
  scientists integer NOT NULL DEFAULT 1000,
  engineers integer NOT NULL DEFAULT 5000,
  workers integer NOT NULL DEFAULT 50000,
  soldiers integer NOT NULL DEFAULT 20000,
  attack integer NOT NULL DEFAULT 10000,
  defense integer NOT NULL DEFAULT 5000,
  damage_output real NOT NULL DEFAULT 15000,
  constructed_at timestamp,
  last_operational_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mega_structures_player
  ON mega_structures(player_id);

CREATE TABLE IF NOT EXISTS empire_difficulties (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id varchar REFERENCES player_profiles(id) ON DELETE CASCADE,
  difficulty_level integer NOT NULL DEFAULT 2,
  kardashev_level integer NOT NULL DEFAULT 1,
  kardashev_progress integer NOT NULL DEFAULT 0,
  resource_multiplier real NOT NULL DEFAULT 1.0,
  research_multiplier real NOT NULL DEFAULT 1.0,
  combat_multiplier real NOT NULL DEFAULT 1.0,
  scaling_factor real NOT NULL DEFAULT 1.0,
  difficulty_multiplier real NOT NULL DEFAULT 1.0,
  total_power integer NOT NULL DEFAULT 0,
  empire_power integer NOT NULL DEFAULT 0,
  galaxy_position integer,
  npc_difficulty varchar NOT NULL DEFAULT 'normal',
  enemy_strength real NOT NULL DEFAULT 1.0,
  resource_scarcity real NOT NULL DEFAULT 1.0,
  achievements_unlocked jsonb NOT NULL DEFAULT '[]'::jsonb,
  bonuses_applied jsonb NOT NULL DEFAULT '[]'::jsonb,
  challenge_description text,
  challenge_requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  rewards_for_completion jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  started_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_difficulties_player
  ON empire_difficulties(player_id);

CREATE TABLE IF NOT EXISTS story_campaigns (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_act integer NOT NULL DEFAULT 1,
  current_chapter integer NOT NULL DEFAULT 1,
  completed_acts integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  story_progress real NOT NULL DEFAULT 0,
  total_xp_earned integer NOT NULL DEFAULT 0,
  campaign_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  npcs_encountered jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_missions jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamp NOT NULL DEFAULT now(),
  last_played_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_campaigns_player
  ON story_campaigns(player_id);

CREATE TABLE IF NOT EXISTS story_missions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id varchar REFERENCES story_campaigns(id) ON DELETE CASCADE,
  act integer NOT NULL,
  chapter integer NOT NULL,
  mission_type varchar NOT NULL,
  title varchar NOT NULL,
  description text,
  lore text,
  difficulty integer NOT NULL DEFAULT 1,
  npc_name varchar,
  npc_role varchar,
  npc_trait varchar,
  objectives jsonb NOT NULL DEFAULT '[]'::jsonb,
  reward_xp integer NOT NULL DEFAULT 0,
  reward_metal integer NOT NULL DEFAULT 0,
  reward_crystal integer NOT NULL DEFAULT 0,
  reward_deuterium integer NOT NULL DEFAULT 0,
  reward_badge varchar,
  reward_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_completed boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  completed_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_missions_player
  ON story_missions(player_id, is_active);

CREATE TABLE IF NOT EXISTS achievements (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id varchar NOT NULL,
  name varchar NOT NULL,
  description text,
  category varchar NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  target integer NOT NULL DEFAULT 1,
  is_completed boolean NOT NULL DEFAULT false,
  reward_xp integer NOT NULL DEFAULT 0,
  reward_badge varchar,
  unlocked_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_achievements_player
  ON achievements(player_id, category, is_completed);

CREATE TABLE IF NOT EXISTS element_buffs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id varchar REFERENCES story_missions(id) ON DELETE CASCADE,
  element_type varchar NOT NULL,
  buff_type varchar NOT NULL,
  magnitude real NOT NULL DEFAULT 1.0,
  is_active boolean NOT NULL DEFAULT true,
  activated_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_element_buffs_player_active
  ON element_buffs(player_id, is_active);

CREATE TABLE IF NOT EXISTS npc_factions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  faction_id varchar NOT NULL,
  faction_name varchar NOT NULL,
  reputation integer NOT NULL DEFAULT 0,
  standing varchar NOT NULL DEFAULT 'neutral',
  is_unlocked boolean NOT NULL DEFAULT false,
  last_interaction timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_npc_factions_player
  ON npc_factions(player_id, faction_id);

CREATE TABLE IF NOT EXISTS npc_vendors (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  vendor_id varchar NOT NULL,
  vendor_name varchar NOT NULL,
  faction_id varchar NOT NULL,
  location varchar NOT NULL,
  specialty varchar,
  min_reputation integer NOT NULL DEFAULT 0,
  restock_time integer NOT NULL DEFAULT 86400,
  last_restock timestamp NOT NULL DEFAULT now(),
  inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_npc_vendors_faction
  ON npc_vendors(faction_id);

CREATE TABLE IF NOT EXISTS relics (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar REFERENCES users(id) ON DELETE CASCADE,
  relic_id varchar NOT NULL,
  name varchar NOT NULL,
  rarity varchar NOT NULL,
  description text,
  type varchar NOT NULL,
  bonuses jsonb NOT NULL DEFAULT '{}'::jsonb,
  source varchar,
  price integer NOT NULL DEFAULT 0,
  is_owned boolean NOT NULL DEFAULT false,
  acquired_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relics_player
  ON relics(player_id, is_owned);

CREATE TABLE IF NOT EXISTS relic_inventory (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relic_id varchar NOT NULL REFERENCES relics(id) ON DELETE CASCADE,
  is_equipped boolean NOT NULL DEFAULT false,
  slot varchar,
  condition integer NOT NULL DEFAULT 100,
  uses integer NOT NULL DEFAULT 0,
  acquired_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relic_inventory_player
  ON relic_inventory(player_id, is_equipped);

CREATE TABLE IF NOT EXISTS friends (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friendship_status varchar NOT NULL DEFAULT 'pending',
  nickname varchar,
  notes text,
  is_online boolean NOT NULL DEFAULT false,
  last_seen timestamp,
  is_favorite boolean NOT NULL DEFAULT false,
  added_at timestamp NOT NULL DEFAULT now(),
  accepted_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_friends_player
  ON friends(player_id, friendship_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_friends_pair_unique
  ON friends(player_id, friend_id);

CREATE TABLE IF NOT EXISTS friend_requests (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text,
  status varchar NOT NULL DEFAULT 'pending',
  sent_at timestamp NOT NULL DEFAULT now(),
  responded_at timestamp,
  expires_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver_status
  ON friend_requests(receiver_id, status, sent_at DESC);

CREATE TABLE IF NOT EXISTS guilds (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  emblem varchar,
  leader_id varchar NOT NULL REFERENCES users(id),
  co_leaders jsonb NOT NULL DEFAULT '[]'::jsonb,
  level integer NOT NULL DEFAULT 1,
  total_members integer NOT NULL DEFAULT 1,
  treasury integer NOT NULL DEFAULT 0,
  influence integer NOT NULL DEFAULT 0,
  max_members integer NOT NULL DEFAULT 100,
  join_requirement_level integer NOT NULL DEFAULT 1,
  is_recruiting boolean NOT NULL DEFAULT true,
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guilds_leader
  ON guilds(leader_id);

CREATE TABLE IF NOT EXISTS guild_members (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guild_id varchar NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar NOT NULL DEFAULT 'member',
  joined_at timestamp NOT NULL DEFAULT now(),
  contributed_currency integer NOT NULL DEFAULT 0,
  contributed_research integer NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_guild_members_unique
  ON guild_members(guild_id, player_id);

CREATE TABLE IF NOT EXISTS teams (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guild_id varchar REFERENCES guilds(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  description text,
  leader_id varchar NOT NULL REFERENCES users(id),
  members jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_members integer NOT NULL DEFAULT 6,
  total_raids integer NOT NULL DEFAULT 0,
  wins_count integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_guild
  ON teams(guild_id);

CREATE TABLE IF NOT EXISTS raids (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attacking_team_id varchar NOT NULL REFERENCES teams(id),
  defending_team_id varchar NOT NULL REFERENCES teams(id),
  raid_type varchar NOT NULL,
  objective_id varchar,
  status varchar NOT NULL DEFAULT 'preparing',
  result varchar,
  attacker_losses jsonb NOT NULL DEFAULT '{}'::jsonb,
  defender_losses jsonb NOT NULL DEFAULT '{}'::jsonb,
  rewards jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamp NOT NULL DEFAULT now(),
  ended_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_raids_status_started
  ON raids(status, started_at DESC);

CREATE TABLE IF NOT EXISTS raid_combats (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  raid_id varchar NOT NULL REFERENCES raids(id) ON DELETE CASCADE,
  attacker_id varchar NOT NULL REFERENCES users(id),
  defender_id varchar NOT NULL REFERENCES users(id),
  round integer NOT NULL DEFAULT 1,
  attacker_ships jsonb NOT NULL DEFAULT '[]'::jsonb,
  defender_ships jsonb NOT NULL DEFAULT '[]'::jsonb,
  winner varchar,
  attacker_damage integer NOT NULL DEFAULT 0,
  defender_damage integer NOT NULL DEFAULT 0,
  combat_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamp NOT NULL DEFAULT now(),
  ended_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_raid_combats_raid_round
  ON raid_combats(raid_id, round);

CREATE TABLE IF NOT EXISTS combat_stats (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_battles integer NOT NULL DEFAULT 0,
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  raid_participations integer NOT NULL DEFAULT 0,
  raid_victories integer NOT NULL DEFAULT 0,
  units_destroyed integer NOT NULL DEFAULT 0,
  units_lost integer NOT NULL DEFAULT 0,
  combat_rating integer NOT NULL DEFAULT 1000,
  raid_rating integer NOT NULL DEFAULT 1000,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_combat_stats_player_unique
  ON combat_stats(player_id);

CREATE TABLE IF NOT EXISTS universe_events (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  event_type varchar NOT NULL,
  event_class varchar NOT NULL,
  galaxy_id varchar,
  sector varchar,
  duration integer,
  start_time timestamp NOT NULL DEFAULT now(),
  end_time timestamp,
  participant_limit integer NOT NULL DEFAULT 50,
  minimum_level integer NOT NULL DEFAULT 1,
  rewards jsonb NOT NULL DEFAULT '{}'::jsonb,
  difficulty integer NOT NULL DEFAULT 1,
  status varchar NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_universe_events_status_start
  ON universe_events(status, start_time DESC);

CREATE TABLE IF NOT EXISTS universe_bosses (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  boss_type varchar NOT NULL,
  rarity varchar NOT NULL,
  health_points integer NOT NULL DEFAULT 10000,
  attack_power integer NOT NULL DEFAULT 100,
  defense integer NOT NULL DEFAULT 50,
  speed integer NOT NULL DEFAULT 50,
  abilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  weaknesses jsonb NOT NULL DEFAULT '{}'::jsonb,
  resistances jsonb NOT NULL DEFAULT '{}'::jsonb,
  loot_table jsonb NOT NULL DEFAULT '[]'::jsonb,
  boss_reward jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommended_level integer NOT NULL DEFAULT 50,
  recommended_players integer NOT NULL DEFAULT 6,
  min_players integer NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boss_encounters (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id varchar REFERENCES universe_events(id) ON DELETE CASCADE,
  boss_id varchar NOT NULL REFERENCES universe_bosses(id),
  current_health integer,
  status varchar NOT NULL DEFAULT 'active',
  participants jsonb NOT NULL DEFAULT '[]'::jsonb,
  participant_count integer NOT NULL DEFAULT 0,
  total_damage_dealt integer NOT NULL DEFAULT 0,
  combat_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_rewards jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_boss_encounters_status_started
  ON boss_encounters(status, started_at DESC);

CREATE TABLE IF NOT EXISTS raid_groups (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  leader_id varchar NOT NULL REFERENCES users(id),
  members jsonb NOT NULL DEFAULT '[]'::jsonb,
  min_members integer NOT NULL DEFAULT 6,
  max_members integer NOT NULL DEFAULT 50,
  status varchar NOT NULL DEFAULT 'forming',
  target_boss_id varchar REFERENCES universe_bosses(id),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_raid_groups_status
  ON raid_groups(status, created_at DESC);

CREATE TABLE IF NOT EXISTS raid_finder (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferred_role varchar,
  min_raid_level integer NOT NULL DEFAULT 1,
  max_raid_level integer NOT NULL DEFAULT 99,
  looking_for_boss_id varchar REFERENCES universe_bosses(id),
  event_id varchar REFERENCES universe_events(id),
  status varchar NOT NULL DEFAULT 'queued',
  queued_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_raid_finder_status_queued
  ON raid_finder(status, queued_at);

CREATE TABLE IF NOT EXISTS pve_combat_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id varchar NOT NULL REFERENCES universe_events(id) ON DELETE CASCADE,
  encounter_id varchar REFERENCES boss_encounters(id) ON DELETE CASCADE,
  player_id varchar NOT NULL REFERENCES users(id),
  role_in_combat varchar,
  damage_dealt integer NOT NULL DEFAULT 0,
  damage_received integer NOT NULL DEFAULT 0,
  heals_provided integer NOT NULL DEFAULT 0,
  controls_applied integer NOT NULL DEFAULT 0,
  survived boolean NOT NULL DEFAULT true,
  contribution integer NOT NULL DEFAULT 0,
  rewards jsonb NOT NULL DEFAULT '{}'::jsonb,
  participation_status varchar NOT NULL DEFAULT 'completed',
  started_at timestamp NOT NULL DEFAULT now(),
  ended_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_pve_combat_logs_player_started
  ON pve_combat_logs(player_id, started_at DESC);

CREATE TABLE IF NOT EXISTS items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name varchar NOT NULL,
  description text,
  item_type varchar NOT NULL,
  item_class varchar NOT NULL,
  rank integer NOT NULL DEFAULT 1,
  rarity varchar NOT NULL,
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  bonuses jsonb NOT NULL DEFAULT '{}'::jsonb,
  required_level integer NOT NULL DEFAULT 1,
  required_class varchar,
  required_rank integer NOT NULL DEFAULT 1,
  sell_price integer NOT NULL DEFAULT 0,
  craft_price integer NOT NULL DEFAULT 0,
  market_price integer NOT NULL DEFAULT 0,
  crafting_recipe jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_unique boolean NOT NULL DEFAULT false,
  is_bound boolean NOT NULL DEFAULT false,
  is_stackable boolean NOT NULL DEFAULT true,
  max_stack integer NOT NULL DEFAULT 999,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_items_type_class_rank
  ON items(item_type, item_class, rank);

CREATE TABLE IF NOT EXISTS player_items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id varchar NOT NULL REFERENCES items(id),
  quantity integer NOT NULL DEFAULT 1,
  is_equipped boolean NOT NULL DEFAULT false,
  slot varchar,
  durability integer NOT NULL DEFAULT 100,
  enchantments jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_stats jsonb,
  acquired_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_items_player
  ON player_items(player_id, is_equipped);

CREATE TABLE IF NOT EXISTS ogame_catalog_categories (
  id varchar PRIMARY KEY,
  name varchar NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ogame_catalog_entries (
  id varchar PRIMARY KEY,
  category_id varchar NOT NULL REFERENCES ogame_catalog_categories(id) ON DELETE CASCADE,
  entry_type varchar NOT NULL,
  name varchar NOT NULL,
  description text NOT NULL DEFAULT '',
  base_cost jsonb NOT NULL DEFAULT '{"metal":0,"crystal":0,"deuterium":0}'::jsonb,
  base_time_seconds integer NOT NULL DEFAULT 0,
  growth_factor real NOT NULL DEFAULT 1,
  prerequisites jsonb NOT NULL DEFAULT '{}'::jsonb,
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_moon_only boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ogame_catalog_entries_category
  ON ogame_catalog_entries(category_id, entry_type);

COMMIT;
