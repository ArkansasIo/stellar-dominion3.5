CREATE TABLE "empire_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"military" integer DEFAULT 1 NOT NULL,
	"economy" integer DEFAULT 1 NOT NULL,
	"research" integer DEFAULT 1 NOT NULL,
	"industry" integer DEFAULT 1 NOT NULL,
	"diplomacy" integer DEFAULT 1 NOT NULL,
	"espionage" integer DEFAULT 1 NOT NULL,
	"exploration" integer DEFAULT 1 NOT NULL,
	"governance" integer DEFAULT 1 NOT NULL,
	"innovation" integer DEFAULT 1 NOT NULL,
	"attribute_points" jsonb DEFAULT '{"military":0,"economy":0,"research":0,"industry":0,"diplomacy":0,"espionage":0,"exploration":0,"governance":0,"innovation":0}'::jsonb NOT NULL,
	"available_points" integer DEFAULT 0 NOT NULL,
	"total_points_earned" integer DEFAULT 0 NOT NULL,
	"empire_name" varchar,
	"empire_title" varchar DEFAULT '新兴帝国',
	"power_rating" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "empire_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "path_of_ascension" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"current_tier" integer DEFAULT 1 NOT NULL,
	"current_tier_xp" integer DEFAULT 0 NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"completed_missions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"claimed_tiers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"unlocked_up_to_tier" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weekly_mission_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"week_id" varchar NOT NULL,
	"missions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"bonus_pool" integer DEFAULT 0,
	"completed_count" integer DEFAULT 0,
	"total_count" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "empire_profiles" ADD CONSTRAINT "empire_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_of_ascension" ADD CONSTRAINT "path_of_ascension_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_mission_progress" ADD CONSTRAINT "weekly_mission_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;