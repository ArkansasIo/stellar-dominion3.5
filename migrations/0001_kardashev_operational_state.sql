ALTER TABLE player_states
  ADD COLUMN IF NOT EXISTS kardashev_systems jsonb NOT NULL DEFAULT '{}';
