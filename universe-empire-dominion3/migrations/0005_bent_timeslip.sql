CREATE TABLE "bounties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placer_id" varchar NOT NULL,
	"target_id" varchar NOT NULL,
	"amount" bigint NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"claimed_by" varchar,
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "espionage_scans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar NOT NULL,
	"target_id" varchar NOT NULL,
	"scan_type" varchar DEFAULT 'basic' NOT NULL,
	"success" boolean NOT NULL,
	"detected" boolean DEFAULT false NOT NULL,
	"scan_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" varchar,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "raids" ALTER COLUMN "attacking_team_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "raids" ALTER COLUMN "defending_team_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "attacking_team_name" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "defending_team_name" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "minimum_commanders" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "max_commanders" integer DEFAULT 6;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "power_requirement" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "participants" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "raids" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_placer_id_users_id_fk" FOREIGN KEY ("placer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espionage_scans" ADD CONSTRAINT "espionage_scans_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espionage_scans" ADD CONSTRAINT "espionage_scans_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moons" ADD CONSTRAINT "moons_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;