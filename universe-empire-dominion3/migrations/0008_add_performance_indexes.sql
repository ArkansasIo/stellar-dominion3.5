-- Add performance indexes for frequently queried columns

-- player_states
CREATE INDEX IF NOT EXISTS idx_player_states_user_id ON player_states(user_id);
CREATE INDEX IF NOT EXISTS idx_player_states_updated_at ON player_states(updated_at);
CREATE INDEX IF NOT EXISTS idx_player_states_last_resource_update ON player_states(last_resource_update);

-- missions
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

-- auction_listings
CREATE INDEX IF NOT EXISTS idx_auction_listings_status ON auction_listings(status);
CREATE INDEX IF NOT EXISTS idx_auction_listings_seller_id ON auction_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_auction_listings_expires_at ON auction_listings(expires_at);

-- auction_bids
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_bidder_id ON auction_bids(bidder_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- player_profiles
CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_uid ON player_profiles(uid);

-- teams
CREATE INDEX IF NOT EXISTS idx_teams_guild_id ON teams(guild_id);

-- raids
CREATE INDEX IF NOT EXISTS idx_raids_status ON raids(status);

-- password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
