CREATE TABLE "abyssal_gate_rewards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"gate_tier" integer NOT NULL,
	"tokens_spent" integer NOT NULL,
	"rewards_granted" jsonb DEFAULT '[]' NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "abyssal_gate_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"gate_tier" integer DEFAULT 1 NOT NULL,
	"tokens_earned" integer DEFAULT 0 NOT NULL,
	"tokens_spent" integer DEFAULT 0 NOT NULL,
	"gates_completed" integer DEFAULT 0 NOT NULL,
	"chests_opened" integer DEFAULT 0 NOT NULL,
	"last_gate_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dimensional_contracts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"contract_tier" integer DEFAULT 1 NOT NULL,
	"tokens_earned" integer DEFAULT 0 NOT NULL,
	"tokens_spent" integer DEFAULT 0 NOT NULL,
	"raids_completed" integer DEFAULT 0 NOT NULL,
	"chests_opened" integer DEFAULT 0 NOT NULL,
	"last_raid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item_levels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"item_name" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_class" varchar DEFAULT 'common',
	"base_rank" integer DEFAULT 1,
	"current_level" integer DEFAULT 1 NOT NULL,
	"current_experience" integer DEFAULT 0 NOT NULL,
	"experience_to_next" integer DEFAULT 100 NOT NULL,
	"upgrade_count" integer DEFAULT 0 NOT NULL,
	"last_upgrade_at" timestamp,
	"upgrade_history" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_power_levels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_power" integer DEFAULT 0 NOT NULL,
	"raid_power" integer DEFAULT 0 NOT NULL,
	"combat_power" integer DEFAULT 0 NOT NULL,
	"empire_power" integer DEFAULT 0 NOT NULL,
	"item_power" integer DEFAULT 0 NOT NULL,
	"commander_power" integer DEFAULT 0 NOT NULL,
	"fleet_power" integer DEFAULT 0 NOT NULL,
	"research_power" integer DEFAULT 0 NOT NULL,
	"building_power" integer DEFAULT 0 NOT NULL,
	"raid_career_power" integer DEFAULT 0 NOT NULL,
	"power_tier" varchar DEFAULT 'Novice',
	"last_calculated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "player_power_levels_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "raid_chest_rewards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"contract_type" varchar DEFAULT 'dimensional' NOT NULL,
	"contract_tier" integer NOT NULL,
	"tokens_spent" integer NOT NULL,
	"rewards_granted" jsonb DEFAULT '[]' NOT NULL,
	"opened_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "smithy_state" jsonb DEFAULT 'null'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "bank_vault_state" jsonb DEFAULT 'null'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "orbital_stations" jsonb DEFAULT 'null'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "spore_drive_state" jsonb DEFAULT 'null'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "moons_data" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "active_raids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "expeditions_data" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "event_participation" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "player_states" ADD COLUMN "realm_id" varchar;--> statement-breakpoint
ALTER TABLE "abyssal_gate_rewards" ADD CONSTRAINT "abyssal_gate_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abyssal_gate_tokens" ADD CONSTRAINT "abyssal_gate_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dimensional_contracts" ADD CONSTRAINT "dimensional_contracts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_levels" ADD CONSTRAINT "item_levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_power_levels" ADD CONSTRAINT "player_power_levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_chest_rewards" ADD CONSTRAINT "raid_chest_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;