CREATE TABLE IF NOT EXISTS "ogame_galaxies" (
  "id" serial PRIMARY KEY NOT NULL,
  "galaxy_number" integer NOT NULL,
  "name" varchar(100) NOT NULL,
  "system_count" integer NOT NULL DEFAULT 499,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "ogame_galaxies_galaxy_number_unique" UNIQUE("galaxy_number")
);

CREATE TABLE IF NOT EXISTS "ogame_systems" (
  "id" serial PRIMARY KEY NOT NULL,
  "galaxy_number" integer NOT NULL,
  "system_number" integer NOT NULL,
  "name" varchar(100) NOT NULL,
  "star_type" varchar(10) NOT NULL DEFAULT 'M',
  "star_name" varchar(100) NOT NULL,
  "temperature" integer NOT NULL DEFAULT 3000,
  "luminosity" real NOT NULL DEFAULT 0.04,
  "is_generated" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "ogame_positions" (
  "id" serial PRIMARY KEY NOT NULL,
  "system_id" integer NOT NULL REFERENCES "ogame_systems"("id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "celestial_type" varchar(20) NOT NULL DEFAULT 'planet',
  "planet_name" varchar(100),
  "planet_type" varchar(50),
  "planet_class" varchar(10),
  "planet_diameter" integer,
  "planet_temperature" integer,
  "planet_temperature_min" integer,
  "planet_temperature_max" integer,
  "player_name" varchar(100),
  "player_rank" integer,
  "alliance_tag" varchar(10),
  "alliance_name" varchar(100),
  "status" varchar(20) DEFAULT 'active',
  "moon_exists" boolean NOT NULL DEFAULT false,
  "moon_name" varchar(100),
  "moon_size" integer,
  "debris_metal" integer NOT NULL DEFAULT 0,
  "debris_crystal" integer NOT NULL DEFAULT 0,
  "last_scan" timestamp,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_ogame_systems_coords" ON "ogame_systems"("galaxy_number", "system_number");
CREATE INDEX IF NOT EXISTS "idx_ogame_positions_system" ON "ogame_positions"("system_id", "position");
