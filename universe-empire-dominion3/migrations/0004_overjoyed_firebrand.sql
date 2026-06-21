CREATE TABLE "player_refineries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"refinery_type" varchar NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"active_recipe" varchar,
	"is_active" boolean DEFAULT false NOT NULL,
	"efficiency" real DEFAULT 0.5 NOT NULL,
	"throughput" integer DEFAULT 100 NOT NULL,
	"total_processed" bigint DEFAULT 0 NOT NULL,
	"last_collected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "player_refineries" ADD CONSTRAINT "player_refineries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;