CREATE TABLE "dimensional_anomalies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"anomaly_id" varchar NOT NULL,
	"discovered" boolean DEFAULT false NOT NULL,
	"explored" boolean DEFAULT false NOT NULL,
	"exploration_count" integer DEFAULT 0 NOT NULL,
	"last_explored_at" timestamp,
	"total_rewards_earned" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cooldown_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "empire_profiles" ALTER COLUMN "empire_title" SET DEFAULT 'Rising Empire';--> statement-breakpoint
ALTER TABLE "dimensional_anomalies" ADD CONSTRAINT "dimensional_anomalies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;