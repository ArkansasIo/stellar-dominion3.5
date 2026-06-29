-- System Cleanup & Maintenance Indexes
-- Indexes used by periodic cleanup jobs and background tasks

-- Vacuum / maintenance support
CREATE INDEX IF NOT EXISTS idx_planet_buildings_orphaned
    ON planet_buildings(empire_id) WHERE empire_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_fleet_units_orphaned
    ON fleet_units(empire_id) WHERE empire_id IS NULL;

-- Old data cleanup
CREATE INDEX IF NOT EXISTS idx_battles_old ON battles(fought_at) WHERE fought_at < NOW() - INTERVAL '90 days';
CREATE INDEX IF NOT EXISTS idx_market_orders_expired
    ON market_orders(expires_at) WHERE expires_at < NOW() AND status = 'open';

-- Session cleanup
CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expires_at) WHERE expires_at < NOW();

-- Activity tracking
CREATE INDEX IF NOT EXISTS idx_empire_activity_log
    ON empire_activity_log(empire_id, created_at DESC);

-- Notification cleanup
CREATE INDEX IF NOT EXISTS idx_notifications_read
    ON notifications(empire_id, is_read, created_at DESC);
