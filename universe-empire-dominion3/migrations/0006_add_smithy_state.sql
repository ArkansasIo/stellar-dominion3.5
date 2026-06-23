-- Add smithy_state column to player_states if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'player_states' AND column_name = 'smithy_state'
  ) THEN
    ALTER TABLE player_states ADD COLUMN smithy_state jsonb NOT NULL DEFAULT null;
  END IF;
END $$;
