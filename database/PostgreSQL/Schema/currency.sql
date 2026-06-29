-- Currency System (Gold, Silver, Platinum)

-- Player currency holdings
CREATE TABLE IF NOT EXISTS player_currency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gold REAL NOT NULL DEFAULT 0,
  silver REAL NOT NULL DEFAULT 0,
  platinum REAL NOT NULL DEFAULT 0,
  total_earned_gold REAL NOT NULL DEFAULT 0,
  total_earned_silver REAL NOT NULL DEFAULT 0,
  total_earned_platinum REAL NOT NULL DEFAULT 0,
  total_spent_gold REAL NOT NULL DEFAULT 0,
  total_spent_silver REAL NOT NULL DEFAULT 0,
  total_spent_platinum REAL NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_currency_player ON player_currency(player_id);

-- Currency transactions log
CREATE TABLE IF NOT EXISTS currency_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR NOT NULL,
  currency_type VARCHAR NOT NULL,
  amount REAL NOT NULL,
  balance_after REAL NOT NULL,
  source VARCHAR,
  target_player_id VARCHAR REFERENCES users(id),
  description TEXT,
  related_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_player ON currency_transactions(player_id);
CREATE INDEX idx_transactions_type ON currency_transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON currency_transactions(created_at);

-- Currency conversions between players
CREATE TABLE IF NOT EXISTS currency_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_currency VARCHAR NOT NULL,
  to_currency VARCHAR NOT NULL,
  from_amount REAL NOT NULL,
  to_amount REAL NOT NULL,
  conversion_fee REAL DEFAULT 0,
  converted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversions_player ON currency_conversions(player_id);
CREATE INDEX idx_conversions_created_at ON currency_conversions(created_at);

-- Currency trading/exchange orders
CREATE TABLE IF NOT EXISTS currency_exchange_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offering_currency VARCHAR NOT NULL,
  offering_amount REAL NOT NULL,
  requesting_currency VARCHAR NOT NULL,
  requesting_amount REAL NOT NULL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_exchange_player ON currency_exchange_orders(player_id);
CREATE INDEX idx_exchange_status ON currency_exchange_orders(status);

-- Currency earned from activities
CREATE TABLE IF NOT EXISTS currency_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  earnings_type VARCHAR NOT NULL,
  currency_type VARCHAR NOT NULL,
  amount REAL NOT NULL,
  daily_total REAL DEFAULT 0,
  earned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_earnings_player ON currency_earnings(player_id);
CREATE INDEX idx_earnings_type ON currency_earnings(earnings_type);
CREATE INDEX idx_earnings_earned_at ON currency_earnings(earned_at);

-- Currency spending/expenses
CREATE TABLE IF NOT EXISTS currency_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expense_type VARCHAR NOT NULL,
  currency_type VARCHAR NOT NULL,
  amount REAL NOT NULL,
  daily_total REAL DEFAULT 0,
  expense_reason VARCHAR,
  related_id UUID,
  spent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_player ON currency_expenses(player_id);
CREATE INDEX idx_expenses_type ON currency_expenses(expense_type);
CREATE INDEX idx_expenses_spent_at ON currency_expenses(spent_at);

-- Currency market prices (dynamic)
CREATE TABLE IF NOT EXISTS currency_market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR NOT NULL,
  to_currency VARCHAR NOT NULL,
  exchange_rate REAL NOT NULL,
  supply REAL,
  demand REAL,
  trend VARCHAR,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_prices_currencies ON currency_market_prices(from_currency, to_currency);

-- Wealth tracking and rankings
CREATE TABLE IF NOT EXISTS player_wealth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_wealth REAL NOT NULL,
  wealth_rank INTEGER,
  previous_rank INTEGER,
  wealth_percentile REAL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wealth_player ON player_wealth(player_id);
CREATE INDEX idx_wealth_rank ON player_wealth(wealth_rank);

-- Currency bonuses and promotions
CREATE TABLE IF NOT EXISTS currency_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  bonus_type VARCHAR NOT NULL,
  currency_type VARCHAR NOT NULL,
  bonus_multiplier REAL NOT NULL,
  is_global BOOLEAN DEFAULT false,
  active_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bonuses_player ON currency_bonuses(player_id);
CREATE INDEX idx_bonuses_active_until ON currency_bonuses(active_until);

-- Currency theft/robbery log (for espionage)
CREATE TABLE IF NOT EXISTS currency_theft_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  victim_player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  thief_player_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency_type VARCHAR NOT NULL,
  amount_stolen REAL NOT NULL,
  success_rate REAL,
  consequences VARCHAR,
  reported_at TIMESTAMP,
  stolen_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_theft_victim ON currency_theft_log(victim_player_id);
CREATE INDEX idx_theft_thief ON currency_theft_log(thief_player_id);
CREATE INDEX idx_theft_stolen_at ON currency_theft_log(stolen_at);
