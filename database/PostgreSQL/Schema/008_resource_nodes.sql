-- Resource Nodes
-- Individual mining locations on planets, moons, and asteroids

CREATE TYPE node_type AS ENUM (
    'surface','underground','asteroid','gas_giant_harvester','nebula_harvester',
    'deep_space','wreckage','ancient','volcanic','crystal'
);

CREATE TABLE resource_nodes (
    node_id          BIGSERIAL PRIMARY KEY,
    location_type    VARCHAR(20) NOT NULL CHECK (location_type IN ('planet','moon','asteroid','station','deep_space')),
    location_id      BIGINT NOT NULL,
    name             VARCHAR(100) NOT NULL,
    node_type        node_type DEFAULT 'surface',
    resource_id      BIGINT NOT NULL,
    yield_per_hour   NUMERIC(12,2) DEFAULT 100.0,
    max_capacity     BIGINT DEFAULT 10000,
    current_amount   BIGINT DEFAULT 10000,
    purity           SMALLINT DEFAULT 1 CHECK (purity BETWEEN 1 AND 10),
    depletion_rate   NUMERIC(4,2) DEFAULT 0.01,
    respawn_rate     NUMERIC(4,2) DEFAULT 0.001,
    min_warp_level   SMALLINT DEFAULT 1,
    danger_level     SMALLINT DEFAULT 1 CHECK (danger_level BETWEEN 1 AND 10),
    is_depleted      BOOLEAN DEFAULT false,
    owner_id         BIGINT,
    last_harvested   TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nodes_location ON resource_nodes(location_type, location_id);
CREATE INDEX idx_nodes_resource ON resource_nodes(resource_id);
CREATE INDEX idx_nodes_owner ON resource_nodes(owner_id);
CREATE INDEX idx_nodes_active ON resource_nodes(is_depleted) WHERE is_depleted = false;
COMMENT ON TABLE resource_nodes IS 'Individual mining nodes providing specific resources at variable yields';
