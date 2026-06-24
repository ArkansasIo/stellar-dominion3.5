-- Add power level, dimensional contract, abyssal gate, and item level columns to empire_profiles

ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS total_power integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS raid_power integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS combat_power integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS power_tier varchar DEFAULT 'Novice';

ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS dimensional_tokens_tier1 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS dimensional_tokens_tier9 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS dimensional_chests_opened integer NOT NULL DEFAULT 0;

ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS abyssal_tokens_tier1 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS abyssal_tokens_tier3 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS abyssal_tokens_tier6 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS abyssal_tokens_tier9 integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS abyssal_chests_opened integer NOT NULL DEFAULT 0;

ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS total_items_leveled integer NOT NULL DEFAULT 0;
ALTER TABLE empire_profiles ADD COLUMN IF NOT EXISTS highest_item_level integer NOT NULL DEFAULT 0;
