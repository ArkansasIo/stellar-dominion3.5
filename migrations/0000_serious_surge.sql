CREATE TABLE "achievements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"achievement_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"progress" integer DEFAULT 0,
	"target" integer DEFAULT 1,
	"is_completed" boolean DEFAULT false,
	"reward_xp" integer DEFAULT 0,
	"reward_badge" varchar,
	"unlocked_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar DEFAULT 'moderator' NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "alliance_members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alliance_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"rank" varchar DEFAULT 'recruit' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alliances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"tag" varchar(10) NOT NULL,
	"description" text DEFAULT 'A new alliance rises.' NOT NULL,
	"announcement" text DEFAULT 'Welcome to the alliance.',
	"resources" jsonb DEFAULT '{"metal":0,"crystal":0,"deuterium":0}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "alliances_name_unique" UNIQUE("name"),
	CONSTRAINT "alliances_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE "auction_bids" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auction_id" varchar NOT NULL,
	"bidder_id" varchar NOT NULL,
	"bidder_name" varchar NOT NULL,
	"bid_amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "auction_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" varchar NOT NULL,
	"seller_name" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"item_name" varchar NOT NULL,
	"item_description" text,
	"item_rarity" varchar DEFAULT 'common',
	"item_data" jsonb,
	"quantity" integer DEFAULT 1 NOT NULL,
	"starting_price" integer NOT NULL,
	"buyout_price" integer,
	"current_bid" integer DEFAULT 0,
	"bid_increment" integer DEFAULT 10 NOT NULL,
	"current_bidder_id" varchar,
	"current_bidder_name" varchar,
	"bid_count" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 24 NOT NULL,
	"expires_at" timestamp NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"account_type" varchar DEFAULT 'standard' NOT NULL,
	"account_balance" bigint DEFAULT 0 NOT NULL,
	"interest_rate" real DEFAULT 0.05 NOT NULL,
	"last_interest_payment" timestamp DEFAULT now(),
	"total_interest_earned" bigint DEFAULT 0 NOT NULL,
	"max_withdrawal" bigint DEFAULT 1000000 NOT NULL,
	"max_deposit" bigint DEFAULT 10000000 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bank_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"account_id" varchar NOT NULL,
	"transaction_type" varchar NOT NULL,
	"amount" bigint NOT NULL,
	"description" varchar,
	"balance_before" bigint NOT NULL,
	"balance_after" bigint NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "battle_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"battle_id" varchar NOT NULL,
	"round" integer NOT NULL,
	"attacker_damage_dealt" integer DEFAULT 0,
	"defender_damage_dealt" integer DEFAULT 0,
	"units_destroyed" jsonb,
	"log" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "battles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attacker_id" varchar NOT NULL,
	"defender_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'completed' NOT NULL,
	"attacker_coordinates" varchar NOT NULL,
	"defender_coordinates" varchar NOT NULL,
	"winner" varchar,
	"attacker_fleet" jsonb NOT NULL,
	"defender_fleet" jsonb NOT NULL,
	"attacker_losses" jsonb,
	"defender_losses" jsonb,
	"loot" jsonb,
	"debris" jsonb,
	"rounds" integer DEFAULT 0,
	"report_type" varchar,
	"report_sub_type" varchar,
	"report_class" varchar,
	"report_sub_class" varchar,
	"attacker_weapons_used" jsonb DEFAULT '[]'::jsonb,
	"defender_weapons_used" jsonb DEFAULT '[]'::jsonb,
	"planet_defenses_engaged" jsonb DEFAULT '[]'::jsonb,
	"weapon_damage_breakdown" jsonb DEFAULT '{}'::jsonb,
	"shields_stripped" integer DEFAULT 0,
	"armor_damage_dealt" integer DEFAULT 0,
	"mothership_engaged" boolean DEFAULT false,
	"planetary_shield_active" boolean DEFAULT false,
	"shield_breached" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "boss_encounters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar,
	"boss_id" varchar NOT NULL,
	"current_health" integer,
	"status" varchar DEFAULT 'active',
	"participants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"participant_count" integer DEFAULT 0,
	"total_damage_dealt" integer DEFAULT 0,
	"combat_log" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_rewards" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "building_durability" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"building_id" varchar NOT NULL,
	"building_type" varchar NOT NULL,
	"building_level" integer NOT NULL,
	"current_durability" real DEFAULT 100 NOT NULL,
	"max_durability" real DEFAULT 100 NOT NULL,
	"durability_percent" integer DEFAULT 100,
	"structural_integrity" varchar DEFAULT 'intact',
	"damage_from_attack" real DEFAULT 0,
	"last_repaired_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "combat_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"total_battles" integer DEFAULT 0,
	"wins" integer DEFAULT 0,
	"losses" integer DEFAULT 0,
	"draws" integer DEFAULT 0,
	"raid_participations" integer DEFAULT 0,
	"raid_victories" integer DEFAULT 0,
	"units_destroyed" integer DEFAULT 0,
	"units_lost" integer DEFAULT 0,
	"combat_rating" integer DEFAULT 1000,
	"raid_rating" integer DEFAULT 1000,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "continents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"continent_name" varchar NOT NULL,
	"area_sqkm" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"continent_id" varchar NOT NULL,
	"country_name" varchar NOT NULL,
	"country_type" varchar NOT NULL,
	"owner_player_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "currency_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"currency_type" varchar NOT NULL,
	"amount" bigint NOT NULL,
	"reason" varchar NOT NULL,
	"related_id" varchar,
	"balance_before" bigint NOT NULL,
	"balance_after" bigint NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "durability_degradation_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"degradation_amount" real NOT NULL,
	"degradation_source" varchar NOT NULL,
	"durability_before" real NOT NULL,
	"durability_after" real NOT NULL,
	"logged_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "element_buffs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"mission_id" varchar,
	"element_type" varchar NOT NULL,
	"buff_type" varchar NOT NULL,
	"magnitude" real DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"activated_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "empire_difficulties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"profile_id" varchar,
	"difficulty_level" integer DEFAULT 2 NOT NULL,
	"kardashev_level" integer DEFAULT 1 NOT NULL,
	"kardashev_progress" integer DEFAULT 0,
	"resource_multiplier" real DEFAULT 1,
	"research_multiplier" real DEFAULT 1,
	"combat_multiplier" real DEFAULT 1,
	"scaling_factor" real DEFAULT 1,
	"difficulty_multiplier" real DEFAULT 1,
	"total_power" integer DEFAULT 0,
	"empire_power" integer DEFAULT 0,
	"galaxy_position" integer,
	"npc_difficulty" varchar DEFAULT 'normal',
	"enemy_strength" real DEFAULT 1,
	"resource_scarcity" real DEFAULT 1,
	"achievements_unlocked" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"bonuses_applied" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"challenge_description" text,
	"challenge_requirements" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rewards_for_completion" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"started_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "empire_values" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"resource_value" bigint DEFAULT 0 NOT NULL,
	"building_value" bigint DEFAULT 0 NOT NULL,
	"fleet_value" bigint DEFAULT 0 NOT NULL,
	"currency_value" bigint DEFAULT 0 NOT NULL,
	"total_value" bigint DEFAULT 0 NOT NULL,
	"empire_rank" integer DEFAULT 0,
	"last_calculated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_durability" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"equipment_id" varchar NOT NULL,
	"equipment_type" varchar NOT NULL,
	"current_durability" real DEFAULT 100 NOT NULL,
	"max_durability" real DEFAULT 100 NOT NULL,
	"durability_percent" integer DEFAULT 100,
	"degradation_rate" real DEFAULT 0.5,
	"is_broken" boolean DEFAULT false,
	"repair_cost_gold" real DEFAULT 0,
	"repair_cost_platinum" real DEFAULT 0,
	"repair_cost_resources" jsonb,
	"last_repaired_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expedition_encounters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expedition_id" varchar NOT NULL,
	"encounter_type" varchar NOT NULL,
	"description" text,
	"rewards" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expedition_teams" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expedition_id" varchar NOT NULL,
	"unit_id" varchar NOT NULL,
	"role" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expeditions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"target_coords" varchar NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fleet_durability" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"fleet_id" varchar NOT NULL,
	"ship_type" varchar NOT NULL,
	"ship_count" integer NOT NULL,
	"current_durability" real DEFAULT 100 NOT NULL,
	"max_durability" real DEFAULT 100 NOT NULL,
	"durability_percent" integer DEFAULT 100,
	"health_status" varchar DEFAULT 'optimal',
	"battle_damage" real DEFAULT 0,
	"last_repaired_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "friend_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"message" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"responded_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "friends" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"friend_id" varchar NOT NULL,
	"friendship_status" varchar DEFAULT 'pending' NOT NULL,
	"nickname" varchar,
	"notes" text,
	"is_online" boolean DEFAULT false,
	"last_seen" timestamp,
	"is_favorite" boolean DEFAULT false,
	"added_at" timestamp DEFAULT now(),
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guild_members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" varchar NOT NULL,
	"player_id" varchar NOT NULL,
	"role" varchar DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"contributed_currency" integer DEFAULT 0,
	"contributed_research" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"emblem" varchar,
	"leader_id" varchar NOT NULL,
	"co_leaders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"level" integer DEFAULT 1,
	"total_members" integer DEFAULT 1,
	"treasury" integer DEFAULT 0,
	"influence" integer DEFAULT 0,
	"max_members" integer DEFAULT 100,
	"join_requirement_level" integer DEFAULT 1,
	"is_recruiting" boolean DEFAULT true,
	"roles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"item_type" varchar NOT NULL,
	"item_class" varchar NOT NULL,
	"rank" integer DEFAULT 1 NOT NULL,
	"rarity" varchar NOT NULL,
	"stats" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"bonuses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"required_level" integer DEFAULT 1,
	"required_class" varchar,
	"required_rank" integer DEFAULT 1,
	"sell_price" integer DEFAULT 0,
	"craft_price" integer DEFAULT 0,
	"market_price" integer DEFAULT 0,
	"crafting_recipe" jsonb,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_unique" boolean DEFAULT false,
	"is_bound" boolean DEFAULT false,
	"is_stackable" boolean DEFAULT true,
	"max_stack" integer DEFAULT 999,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"resource" varchar NOT NULL,
	"amount" integer NOT NULL,
	"price_per_unit" real NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mega_structures" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"profile_id" varchar,
	"name" varchar NOT NULL,
	"structure_type" varchar NOT NULL,
	"structure_class" varchar NOT NULL,
	"kind" varchar NOT NULL,
	"category" varchar NOT NULL,
	"sub_category" varchar,
	"level" integer DEFAULT 1 NOT NULL,
	"completion_percent" integer DEFAULT 0,
	"is_operational" boolean DEFAULT false,
	"coordinates" varchar NOT NULL,
	"galaxy_id" integer,
	"health" integer DEFAULT 1000000,
	"max_health" integer DEFAULT 1000000,
	"power" integer DEFAULT 100000,
	"efficiency" real DEFAULT 1,
	"substats" jsonb DEFAULT '{"productionRate":1000,"researchMultiplier":2,"defenseMultiplier":1.5,"capacityMultiplier":3,"efficiencyRating":95}'::jsonb NOT NULL,
	"attributes" jsonb DEFAULT '{"durability":100,"reliability":95,"adaptability":80,"scalability":90,"sustainability":85}'::jsonb NOT NULL,
	"sub_attributes" jsonb DEFAULT '{"maintenanceCost":10000,"powerConsumption":50000,"productionCapacity":500000,"storageCapacity":1000000,"repairRate":5000}'::jsonb NOT NULL,
	"resource_production" jsonb DEFAULT '{"metal":50000,"crystal":25000,"deuterium":10000,"energy":100000}'::jsonb NOT NULL,
	"resource_storage" jsonb DEFAULT '{"metal":5000000,"crystal":2500000,"deuterium":1000000,"energy":10000000}'::jsonb NOT NULL,
	"current_resources" jsonb DEFAULT '{"metal":1000000,"crystal":500000,"deuterium":250000,"energy":5000000}'::jsonb NOT NULL,
	"modules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"systems" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"weapons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"defenses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"about" text,
	"details" jsonb DEFAULT '{"constructionTime":0,"estimatedCompletion":null,"workforce":10000,"researchTeams":100}'::jsonb NOT NULL,
	"menus" jsonb DEFAULT '{"construction":{"status":"planning","progress":0},"production":{"enabled":false,"rates":{}},"research":{"projects":[],"completed":[]},"defense":{"shields":true,"weapons":true},"management":{"staffing":100,"efficiency":95}}'::jsonb NOT NULL,
	"game_mechanics" jsonb DEFAULT '{"captureable":false,"destroyable":true,"transferable":false,"scalable":true,"networked":false,"effects":[]}'::jsonb NOT NULL,
	"population" integer DEFAULT 100000,
	"scientists" integer DEFAULT 1000,
	"engineers" integer DEFAULT 5000,
	"workers" integer DEFAULT 50000,
	"soldiers" integer DEFAULT 20000,
	"attack" integer DEFAULT 10000,
	"defense" integer DEFAULT 5000,
	"damage_output" real DEFAULT 15000,
	"constructed_at" timestamp,
	"last_operational_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" varchar,
	"to_user_id" varchar NOT NULL,
	"from" varchar NOT NULL,
	"to" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"body" text NOT NULL,
	"type" varchar DEFAULT 'player' NOT NULL,
	"read" boolean DEFAULT false,
	"battle_report" jsonb,
	"espionage_report" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'outbound' NOT NULL,
	"target" varchar NOT NULL,
	"origin" varchar NOT NULL,
	"units" jsonb NOT NULL,
	"cargo" jsonb,
	"departure_time" timestamp NOT NULL,
	"arrival_time" timestamp NOT NULL,
	"return_time" timestamp,
	"processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moon_bases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"base_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"coordinates" varchar NOT NULL,
	"moon_name" varchar NOT NULL,
	"metal_reserves" integer DEFAULT 5000,
	"crystal_reserves" integer DEFAULT 3000,
	"deuterium_reserves" integer DEFAULT 1000,
	"mining_capacity" integer DEFAULT 1000,
	"active_mining_ops" integer DEFAULT 0,
	"total_mined" integer DEFAULT 0,
	"research_points" real DEFAULT 0,
	"research_multiplier" real DEFAULT 1,
	"population" integer DEFAULT 500,
	"workers" integer DEFAULT 100,
	"shield_level" integer DEFAULT 0,
	"turrets" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"discovered_at" timestamp DEFAULT now(),
	"built_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "npc_factions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"faction_id" varchar NOT NULL,
	"faction_name" varchar NOT NULL,
	"reputation" integer DEFAULT 0,
	"standing" varchar DEFAULT 'neutral',
	"is_unlocked" boolean DEFAULT false,
	"last_interaction" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "npc_vendors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" varchar NOT NULL,
	"vendor_name" varchar NOT NULL,
	"faction_id" varchar NOT NULL,
	"location" varchar NOT NULL,
	"specialty" varchar,
	"min_reputation" integer DEFAULT 0,
	"restock_time" integer DEFAULT 86400,
	"last_restock" timestamp DEFAULT now(),
	"inventory" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ogame_catalog_categories" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ogame_catalog_entries" (
	"id" varchar PRIMARY KEY NOT NULL,
	"category_id" varchar NOT NULL,
	"entry_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"base_cost" jsonb DEFAULT '{"metal":0,"crystal":0,"deuterium":0}'::jsonb NOT NULL,
	"base_time_seconds" integer DEFAULT 0 NOT NULL,
	"growth_factor" real DEFAULT 1 NOT NULL,
	"prerequisites" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"stats" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_moon_only" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_colonies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"planet_id" integer NOT NULL,
	"colony_name" varchar NOT NULL,
	"colony_type" varchar NOT NULL,
	"colony_level" integer DEFAULT 1,
	"population" integer DEFAULT 1000,
	"built_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_currency" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"silver" bigint DEFAULT 0 NOT NULL,
	"gold" bigint DEFAULT 0 NOT NULL,
	"platinum" bigint DEFAULT 0 NOT NULL,
	"silver_earned" bigint DEFAULT 0 NOT NULL,
	"silver_spent" bigint DEFAULT 0 NOT NULL,
	"gold_earned" bigint DEFAULT 0 NOT NULL,
	"gold_spent" bigint DEFAULT 0 NOT NULL,
	"platinum_earned" bigint DEFAULT 0 NOT NULL,
	"platinum_spent" bigint DEFAULT 0 NOT NULL,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"quantity" integer DEFAULT 1,
	"is_equipped" boolean DEFAULT false,
	"slot" varchar,
	"durability" integer DEFAULT 100,
	"enchantments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"custom_stats" jsonb,
	"acquired_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"uid" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"bio" text,
	"profile_image_url" varchar,
	"level" integer DEFAULT 1,
	"total_experience" integer DEFAULT 0,
	"prestige_level" integer DEFAULT 0,
	"galaxy_rank" integer,
	"fleet_power" integer DEFAULT 0,
	"empire_power" integer DEFAULT 0,
	"attributes" jsonb DEFAULT '{"strength":10,"intelligence":10,"endurance":10,"agility":10,"wisdom":10,"charisma":10}'::jsonb NOT NULL,
	"sub_attributes" jsonb DEFAULT '{"critChance":5,"critDamage":50,"dodge":10,"accuracy":90,"magicResist":0,"lifeSteal":0}'::jsonb NOT NULL,
	"categories" jsonb DEFAULT '{"military":1,"engineering":1,"science":1,"commerce":1,"diplomacy":1,"exploration":1}'::jsonb NOT NULL,
	"badges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_online" boolean DEFAULT false,
	"last_activity_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "player_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "player_profiles_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "player_research_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"technology_id" varchar NOT NULL,
	"status" varchar DEFAULT 'available' NOT NULL,
	"progress" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_states" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"setup_complete" boolean DEFAULT false NOT NULL,
	"planet_name" varchar DEFAULT 'New Colony' NOT NULL,
	"coordinates" varchar DEFAULT '[1:1:1]' NOT NULL,
	"known_planets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"travel_state" jsonb DEFAULT '{"activeRoute":null,"discoveredWormholes":[]}'::jsonb NOT NULL,
	"travel_log" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"resources" jsonb DEFAULT '{"metal":1000,"crystal":500,"deuterium":0,"energy":0}'::jsonb NOT NULL,
	"buildings" jsonb DEFAULT '{"roboticsFactory":0,"shipyard":0,"researchLab":0}'::jsonb NOT NULL,
	"orbital_buildings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"research" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"research_queue" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"research_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active_research" jsonb DEFAULT 'null'::jsonb NOT NULL,
	"research_bonuses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"research_modifiers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"research_lab" jsonb DEFAULT '{"type":"standard","level":1,"specialization":"general","durability":100}'::jsonb NOT NULL,
	"available_labs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"turns_data" jsonb DEFAULT '{"totalTurnsGenerated":0,"currentTurn":0,"lastTurnTimestamp":0,"turnsAvailable":0,"currentResearchTurns":0,"researchTurnHistory":[]}'::jsonb NOT NULL,
	"research_xp" jsonb DEFAULT '{"totalXP":0,"currentLevelXP":0,"currentLevel":1,"researchesCompleted":0,"discoveredTechs":[],"discoveries":[],"discoveryStreak":0,"lastDiscoveryTime":0,"discoveryMultiplier":1}'::jsonb NOT NULL,
	"units" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"commander" jsonb NOT NULL,
	"government" jsonb NOT NULL,
	"artifacts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cron_jobs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"empire_level" integer DEFAULT 1 NOT NULL,
	"empire_experience" bigint DEFAULT 0 NOT NULL,
	"tier" integer DEFAULT 1 NOT NULL,
	"tier_experience" bigint DEFAULT 0 NOT NULL,
	"prestige_level" integer DEFAULT 0 NOT NULL,
	"prestige_bonus" jsonb DEFAULT '{"resourceMultiplier":1,"experienceMultiplier":1,"researchMultiplier":1}'::jsonb NOT NULL,
	"tier_bonuses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"kardashev_progress" jsonb DEFAULT '{"metal":0,"crystal":0,"deuterium":0,"research":0}'::jsonb NOT NULL,
	"total_turns" integer DEFAULT 0 NOT NULL,
	"current_turns" integer DEFAULT 0 NOT NULL,
	"last_turn_update" timestamp DEFAULT now(),
	"last_resource_update" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pve_combat_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"encounter_id" varchar,
	"player_id" varchar NOT NULL,
	"role_in_combat" varchar,
	"damage_dealt" integer DEFAULT 0,
	"damage_received" integer DEFAULT 0,
	"heals_provided" integer DEFAULT 0,
	"controls_applied" integer DEFAULT 0,
	"survived" boolean DEFAULT true,
	"contribution" integer DEFAULT 0,
	"rewards" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"participation_status" varchar DEFAULT 'completed',
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "queue_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"item_name" varchar NOT NULL,
	"amount" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raid_combats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raid_id" varchar NOT NULL,
	"attacker_id" varchar NOT NULL,
	"defender_id" varchar NOT NULL,
	"round" integer DEFAULT 1,
	"attacker_ships" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"defender_ships" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"winner" varchar,
	"attacker_damage" integer DEFAULT 0,
	"defender_damage" integer DEFAULT 0,
	"combat_log" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "raid_finder" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"preferred_role" varchar,
	"min_raid_level" integer DEFAULT 1,
	"max_raid_level" integer DEFAULT 99,
	"looking_for_boss_id" varchar,
	"event_id" varchar,
	"status" varchar DEFAULT 'queued',
	"queued_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raid_groups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"leader_id" varchar NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"min_members" integer DEFAULT 6,
	"max_members" integer DEFAULT 50,
	"status" varchar DEFAULT 'forming',
	"target_boss_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raids" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attacking_team_id" varchar NOT NULL,
	"defending_team_id" varchar NOT NULL,
	"raid_type" varchar NOT NULL,
	"objective_id" varchar,
	"status" varchar DEFAULT 'preparing' NOT NULL,
	"result" varchar,
	"attacker_losses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"defender_losses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rewards" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "relic_inventory" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"relic_id" varchar NOT NULL,
	"is_equipped" boolean DEFAULT false,
	"slot" varchar,
	"condition" integer DEFAULT 100,
	"uses" integer DEFAULT 0,
	"acquired_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "relics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar,
	"relic_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"rarity" varchar NOT NULL,
	"description" text,
	"type" varchar NOT NULL,
	"bonuses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source" varchar,
	"price" integer DEFAULT 0,
	"is_owned" boolean DEFAULT false,
	"acquired_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "repair_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"durability_before" real NOT NULL,
	"durability_after" real NOT NULL,
	"repair_cost_gold" real DEFAULT 0,
	"repair_cost_platinum" real DEFAULT 0,
	"repair_type" varchar NOT NULL,
	"repaired_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_areas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area_name" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_subcategories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area_id" varchar NOT NULL,
	"subcategory_name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_technologies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subcategory_id" varchar NOT NULL,
	"tech_name" varchar NOT NULL,
	"description" text,
	"requirements" jsonb,
	"effects" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resource_fields" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"territory_id" varchar NOT NULL,
	"field_name" varchar NOT NULL,
	"field_type" varchar NOT NULL,
	"field_size" varchar NOT NULL,
	"metal_per_hour" real DEFAULT 0,
	"crystal_per_hour" real DEFAULT 0,
	"deuterium_per_hour" real DEFAULT 0,
	"max_extraction_capacity" integer DEFAULT 100,
	"depletion_percent" integer DEFAULT 0,
	"is_depleted" boolean DEFAULT false,
	"mined_by_player_id" varchar,
	"total_metal_extracted" real DEFAULT 0,
	"total_crystal_extracted" real DEFAULT 0,
	"total_deuterium_extracted" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "squads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"squad_type" varchar NOT NULL,
	"commander_id" varchar,
	"morale" integer DEFAULT 100,
	"combat_experience" integer DEFAULT 0,
	"victories_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "starbases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"starbase_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"coordinates" varchar NOT NULL,
	"metal_storage" integer DEFAULT 10000,
	"crystal_storage" integer DEFAULT 10000,
	"deuterium_storage" integer DEFAULT 5000,
	"metal_production_rate" real DEFAULT 100,
	"crystal_production_rate" real DEFAULT 50,
	"deuterium_production_rate" real DEFAULT 25,
	"hangar_slots" integer DEFAULT 50,
	"research_slots" integer DEFAULT 5,
	"defense_level" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"last_resource_update" timestamp DEFAULT now(),
	"built_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_campaigns" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"current_act" integer DEFAULT 1,
	"current_chapter" integer DEFAULT 1,
	"completed_acts" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false,
	"story_progress" real DEFAULT 0,
	"total_xp_earned" integer DEFAULT 0,
	"campaign_state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"npcs_encountered" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"completed_missions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"last_played_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_missions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"campaign_id" varchar,
	"act" integer NOT NULL,
	"chapter" integer NOT NULL,
	"mission_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"lore" text,
	"difficulty" integer DEFAULT 1,
	"npc_name" varchar,
	"npc_role" varchar,
	"npc_trait" varchar,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"reward_xp" integer DEFAULT 0,
	"reward_metal" integer DEFAULT 0,
	"reward_crystal" integer DEFAULT 0,
	"reward_deuterium" integer DEFAULT 0,
	"reward_badge" varchar,
	"reward_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_completed" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"category" varchar DEFAULT 'general',
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"leader_id" varchar NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"max_members" integer DEFAULT 6,
	"total_raids" integer DEFAULT 0,
	"wins_count" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"is_locked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "territories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" varchar NOT NULL,
	"territory_name" varchar NOT NULL,
	"territory_type" varchar NOT NULL,
	"area_sqkm" real,
	"controlled_by_player_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trade_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trade_offer_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_name" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"receiver_name" varchar NOT NULL,
	"sender_gave" jsonb NOT NULL,
	"receiver_gave" jsonb NOT NULL,
	"result" varchar NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trade_offers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_name" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"receiver_name" varchar NOT NULL,
	"offer_metal" integer DEFAULT 0 NOT NULL,
	"offer_crystal" integer DEFAULT 0 NOT NULL,
	"offer_deuterium" integer DEFAULT 0 NOT NULL,
	"offer_items" jsonb DEFAULT '[]'::jsonb,
	"request_metal" integer DEFAULT 0 NOT NULL,
	"request_crystal" integer DEFAULT 0 NOT NULL,
	"request_deuterium" integer DEFAULT 0 NOT NULL,
	"request_items" jsonb DEFAULT '[]'::jsonb,
	"message" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"sender_message_id" varchar,
	"receiver_message_id" varchar,
	"counter_offer_id" varchar,
	"original_offer_id" varchar,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "troops" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"troop_type" varchar NOT NULL,
	"troop_class" varchar NOT NULL,
	"rank" varchar DEFAULT 'recruit' NOT NULL,
	"title" varchar,
	"health" integer DEFAULT 100 NOT NULL,
	"max_health" integer DEFAULT 100 NOT NULL,
	"attack" integer DEFAULT 10 NOT NULL,
	"defense" integer DEFAULT 5 NOT NULL,
	"speed" integer DEFAULT 8 NOT NULL,
	"morale" integer DEFAULT 100 NOT NULL,
	"substats" jsonb DEFAULT '{"critChance":5,"critDamage":50,"armor":0,"magicResist":0,"accuracy":90,"evasion":10,"regeneration":0,"lifesteal":0,"experience":0,"level":1}'::jsonb NOT NULL,
	"weapon_type" varchar,
	"armor_type" varchar,
	"special_ability" varchar,
	"squad_id" varchar,
	"position" varchar,
	"status" varchar DEFAULT 'active' NOT NULL,
	"combat_ready" boolean DEFAULT true,
	"loyalty_percent" integer DEFAULT 100,
	"experience_points" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "universe_bosses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"boss_type" varchar NOT NULL,
	"rarity" varchar NOT NULL,
	"health_points" integer DEFAULT 10000 NOT NULL,
	"attack_power" integer DEFAULT 100,
	"defense" integer DEFAULT 50,
	"speed" integer DEFAULT 50,
	"abilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"weaknesses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"resistances" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"loot_table" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"boss_reward" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"recommended_level" integer DEFAULT 50,
	"recommended_players" integer DEFAULT 6,
	"min_players" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "universe_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"event_type" varchar NOT NULL,
	"event_class" varchar NOT NULL,
	"galaxy_id" varchar,
	"sector" varchar,
	"duration" integer,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"participant_limit" integer DEFAULT 50,
	"minimum_level" integer DEFAULT 1,
	"rewards" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"difficulty" integer DEFAULT 1,
	"status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar,
	"password_hash" varchar,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliance_members" ADD CONSTRAINT "alliance_members_alliance_id_alliances_id_fk" FOREIGN KEY ("alliance_id") REFERENCES "public"."alliances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliance_members" ADD CONSTRAINT "alliance_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auction_id_auction_listings_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auction_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_bidder_id_users_id_fk" FOREIGN KEY ("bidder_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auction_listings" ADD CONSTRAINT "auction_listings_current_bidder_id_users_id_fk" FOREIGN KEY ("current_bidder_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_account_id_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battle_logs" ADD CONSTRAINT "battle_logs_battle_id_battles_id_fk" FOREIGN KEY ("battle_id") REFERENCES "public"."battles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_attacker_id_users_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_defender_id_users_id_fk" FOREIGN KEY ("defender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boss_encounters" ADD CONSTRAINT "boss_encounters_event_id_universe_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."universe_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boss_encounters" ADD CONSTRAINT "boss_encounters_boss_id_universe_bosses_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."universe_bosses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "building_durability" ADD CONSTRAINT "building_durability_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "combat_stats" ADD CONSTRAINT "combat_stats_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_id_continents_id_fk" FOREIGN KEY ("continent_id") REFERENCES "public"."continents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_owner_player_id_users_id_fk" FOREIGN KEY ("owner_player_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_transactions" ADD CONSTRAINT "currency_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "durability_degradation_log" ADD CONSTRAINT "durability_degradation_log_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_buffs" ADD CONSTRAINT "element_buffs_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_buffs" ADD CONSTRAINT "element_buffs_mission_id_story_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."story_missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empire_difficulties" ADD CONSTRAINT "empire_difficulties_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empire_difficulties" ADD CONSTRAINT "empire_difficulties_profile_id_player_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."player_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empire_values" ADD CONSTRAINT "empire_values_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_durability" ADD CONSTRAINT "equipment_durability_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expedition_encounters" ADD CONSTRAINT "expedition_encounters_expedition_id_expeditions_id_fk" FOREIGN KEY ("expedition_id") REFERENCES "public"."expeditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expedition_teams" ADD CONSTRAINT "expedition_teams_expedition_id_expeditions_id_fk" FOREIGN KEY ("expedition_id") REFERENCES "public"."expeditions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expeditions" ADD CONSTRAINT "expeditions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fleet_durability" ADD CONSTRAINT "fleet_durability_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_id_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guilds" ADD CONSTRAINT "guilds_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_orders" ADD CONSTRAINT "market_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_structures" ADD CONSTRAINT "mega_structures_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_structures" ADD CONSTRAINT "mega_structures_profile_id_player_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."player_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moon_bases" ADD CONSTRAINT "moon_bases_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ogame_catalog_entries" ADD CONSTRAINT "ogame_catalog_entries_category_id_ogame_catalog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ogame_catalog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_colonies" ADD CONSTRAINT "player_colonies_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_currency" ADD CONSTRAINT "player_currency_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_items" ADD CONSTRAINT "player_items_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_items" ADD CONSTRAINT "player_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_research_progress" ADD CONSTRAINT "player_research_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_research_progress" ADD CONSTRAINT "player_research_progress_technology_id_research_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."research_technologies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_states" ADD CONSTRAINT "player_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pve_combat_logs" ADD CONSTRAINT "pve_combat_logs_event_id_universe_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."universe_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pve_combat_logs" ADD CONSTRAINT "pve_combat_logs_encounter_id_boss_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."boss_encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pve_combat_logs" ADD CONSTRAINT "pve_combat_logs_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_combats" ADD CONSTRAINT "raid_combats_raid_id_raids_id_fk" FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_combats" ADD CONSTRAINT "raid_combats_attacker_id_users_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_combats" ADD CONSTRAINT "raid_combats_defender_id_users_id_fk" FOREIGN KEY ("defender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_finder" ADD CONSTRAINT "raid_finder_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_finder" ADD CONSTRAINT "raid_finder_looking_for_boss_id_universe_bosses_id_fk" FOREIGN KEY ("looking_for_boss_id") REFERENCES "public"."universe_bosses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_finder" ADD CONSTRAINT "raid_finder_event_id_universe_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."universe_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_groups" ADD CONSTRAINT "raid_groups_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_groups" ADD CONSTRAINT "raid_groups_target_boss_id_universe_bosses_id_fk" FOREIGN KEY ("target_boss_id") REFERENCES "public"."universe_bosses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raids" ADD CONSTRAINT "raids_attacking_team_id_teams_id_fk" FOREIGN KEY ("attacking_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raids" ADD CONSTRAINT "raids_defending_team_id_teams_id_fk" FOREIGN KEY ("defending_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relic_inventory" ADD CONSTRAINT "relic_inventory_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relic_inventory" ADD CONSTRAINT "relic_inventory_relic_id_relics_id_fk" FOREIGN KEY ("relic_id") REFERENCES "public"."relics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relics" ADD CONSTRAINT "relics_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_history" ADD CONSTRAINT "repair_history_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_subcategories" ADD CONSTRAINT "research_subcategories_area_id_research_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."research_areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_technologies" ADD CONSTRAINT "research_technologies_subcategory_id_research_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."research_subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_fields" ADD CONSTRAINT "resource_fields_territory_id_territories_id_fk" FOREIGN KEY ("territory_id") REFERENCES "public"."territories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_fields" ADD CONSTRAINT "resource_fields_mined_by_player_id_users_id_fk" FOREIGN KEY ("mined_by_player_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "squads" ADD CONSTRAINT "squads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "squads" ADD CONSTRAINT "squads_commander_id_troops_id_fk" FOREIGN KEY ("commander_id") REFERENCES "public"."troops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starbases" ADD CONSTRAINT "starbases_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_campaigns" ADD CONSTRAINT "story_campaigns_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_missions" ADD CONSTRAINT "story_missions_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_missions" ADD CONSTRAINT "story_missions_campaign_id_story_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."story_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_guild_id_guilds_id_fk" FOREIGN KEY ("guild_id") REFERENCES "public"."guilds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_users_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "territories" ADD CONSTRAINT "territories_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "territories" ADD CONSTRAINT "territories_controlled_by_player_id_users_id_fk" FOREIGN KEY ("controlled_by_player_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_offers" ADD CONSTRAINT "trade_offers_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_offers" ADD CONSTRAINT "trade_offers_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "troops" ADD CONSTRAINT "troops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");