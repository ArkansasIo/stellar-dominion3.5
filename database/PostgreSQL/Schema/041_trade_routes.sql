-- Trade Routes
-- Automated trade between colonies, stations, and allied empires

CREATE TYPE trade_route_status AS ENUM ('active','paused','completed','raided','cancelled');

CREATE TABLE trade_routes (
    route_id         BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    owner_id         BIGINT NOT NULL REFERENCES empires(empire_id),

    -- Source -> Destination
    source_type      VARCHAR(20) NOT NULL CHECK (source_type IN ('planet','station','empire')),
    source_id        BIGINT NOT NULL,
    dest_type        VARCHAR(20) NOT NULL CHECK (dest_type IN ('planet','station','empire')),
    dest_id          BIGINT NOT NULL,

    -- Cargo
    resource_id      BIGINT REFERENCES resources(resource_id),
    item_id          BIGINT REFERENCES items(item_id),
    quantity_per_trip BIGINT DEFAULT 1000,
    current_trip     INTEGER DEFAULT 0,
    max_trips        INTEGER DEFAULT 0,

    -- Timing
    frequency_minutes INTEGER DEFAULT 60,
    duration_minutes  INTEGER DEFAULT 30,
    last_departure    TIMESTAMPTZ,
    next_arrival      TIMESTAMPTZ,

    -- Protection
    escort_fleet_id  BIGINT,
    piracy_risk      NUMERIC(4,2) DEFAULT 0.1,
    times_raided     INTEGER DEFAULT 0,

    -- Economics
    profit_per_trip  NUMERIC(14,2) DEFAULT 0,
    total_profit     NUMERIC(16,2) DEFAULT 0,
    total_trips      INTEGER DEFAULT 0,

    -- Status
    status           trade_route_status DEFAULT 'active',
    is_auto          BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tr_owner ON trade_routes(owner_id);
CREATE INDEX idx_tr_source ON trade_routes(source_type, source_id);
CREATE INDEX idx_tr_dest ON trade_routes(dest_type, dest_id);
CREATE INDEX idx_tr_status ON trade_routes(status);
CREATE INDEX idx_tr_active ON trade_routes(status) WHERE status = 'active';
COMMENT ON TABLE trade_routes IS 'Automated trade routes carrying resources between locations';
