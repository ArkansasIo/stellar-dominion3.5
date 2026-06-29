-- Market
-- Player-driven marketplace with buy/sell orders

CREATE TYPE order_type AS ENUM ('buy','sell');
CREATE TYPE order_status AS ENUM ('open','filled','partial','cancelled','expired');

CREATE TABLE market_orders (
    order_id         BIGSERIAL PRIMARY KEY,
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    order_type       order_type NOT NULL,
    status           order_status DEFAULT 'open',

    -- Item
    resource_id      BIGINT REFERENCES resources(resource_id),
    item_id          BIGINT REFERENCES items(item_id),
    quantity         BIGINT NOT NULL,
    quantity_filled  BIGINT DEFAULT 0,

    -- Pricing
    price_per_unit   NUMERIC(12,4) NOT NULL,
    total_price      NUMERIC(16,4) NOT NULL,
    escrow_amount    NUMERIC(16,4) DEFAULT 0,

    -- Location
    station_id       BIGINT REFERENCES space_stations(station_id),
    region_id        BIGINT REFERENCES regions(region_id),

    -- Time
    duration_hours   INTEGER DEFAULT 168,
    expires_at       TIMESTAMPTZ NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    filled_at        TIMESTAMPTZ,

    -- Tax
    tax_rate         NUMERIC(4,2) DEFAULT 0.05,
    tax_paid         NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE market_transactions (
    transaction_id   BIGSERIAL PRIMARY KEY,
    buy_order_id     BIGINT REFERENCES market_orders(order_id),
    sell_order_id    BIGINT REFERENCES market_orders(order_id),
    buyer_id         BIGINT NOT NULL REFERENCES empires(empire_id),
    seller_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    resource_id      BIGINT REFERENCES resources(resource_id),
    item_id          BIGINT REFERENCES items(item_id),
    quantity         BIGINT NOT NULL,
    price_per_unit   NUMERIC(12,4) NOT NULL,
    total_amount     NUMERIC(16,4) NOT NULL,
    buyer_tax        NUMERIC(12,2) DEFAULT 0,
    seller_tax       NUMERIC(12,2) DEFAULT 0,
    station_id       BIGINT REFERENCES space_stations(station_id),
    transacted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mo_empire ON market_orders(empire_id);
CREATE INDEX idx_mo_resource ON market_orders(resource_id);
CREATE INDEX idx_mo_type ON market_orders(order_type);
CREATE INDEX idx_mo_status ON market_orders(status);
CREATE INDEX idx_mo_price ON market_orders(price_per_unit);
CREATE INDEX idx_mo_station ON market_orders(station_id);
CREATE INDEX idx_mt_buyer ON market_transactions(buyer_id);
CREATE INDEX idx_mt_seller ON market_transactions(seller_id);
CREATE INDEX idx_mt_resource ON market_transactions(resource_id);
CREATE INDEX idx_mt_time ON market_transactions(transacted_at);
COMMENT ON TABLE market_orders IS 'Player buy and sell orders forming the in-game market';
COMMENT ON TABLE market_transactions IS 'Completed trades recording buyer, seller, price, and taxes';
