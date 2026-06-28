-- Gate Tokens System tables
-- Allows players to consume tokens to access anomalies, raids, and explorations

-- Player token inventory
CREATE TABLE IF NOT EXISTS public.gate_tokens (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL UNIQUE,
    token_type varchar NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    last_updated timestamp DEFAULT now(),
    created_at timestamp DEFAULT now(),
    CONSTRAINT fk_gate_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT valid_token_type CHECK (token_type IN ('anomaly', 'raid', 'exploration'))
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_gate_tokens_user_type ON public.gate_tokens(user_id, token_type);
CREATE INDEX IF NOT EXISTS idx_gate_tokens_updated ON public.gate_tokens(last_updated);

-- Token transaction history
CREATE TABLE IF NOT EXISTS public.gate_token_history (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL,
    token_type varchar NOT NULL,
    action varchar NOT NULL,
    quantity integer NOT NULL,
    source varchar,
    metadata jsonb,
    created_at timestamp DEFAULT now(),
    CONSTRAINT fk_gate_token_history_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT valid_action CHECK (action IN ('earned', 'purchased', 'consumed')),
    CONSTRAINT valid_history_token_type CHECK (token_type IN ('anomaly', 'raid', 'exploration'))
);

-- Create indexes for history queries
CREATE INDEX IF NOT EXISTS idx_gate_token_history_user ON public.gate_token_history(user_id);
CREATE INDEX IF NOT EXISTS idx_gate_token_history_created ON public.gate_token_history(created_at);
CREATE INDEX IF NOT EXISTS idx_gate_token_history_action ON public.gate_token_history(action);
