-- Wormholes
-- Temporary or permanent connections between distant star systems

CREATE TYPE wormhole_stability AS ENUM ('stable','unstable','critical','collapsing');
CREATE TYPE wormhole_size AS ENUM ('small','medium','large','huge','massive');

CREATE TABLE wormholes (
    wormhole_id      BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,

    -- Connection (from -> to)
    entry_system_id  BIGINT NOT NULL REFERENCES star_systems(system_id),
    exit_system_id   BIGINT NOT NULL REFERENCES star_systems(system_id),
    entry_region_id  BIGINT REFERENCES regions(region_id),
    exit_region_id   BIGINT REFERENCES regions(region_id),

    -- Properties
    stability        wormhole_stability DEFAULT 'stable',
    size             wormhole_size DEFAULT 'medium',
    mass_limit       BIGINT DEFAULT 100000,
    mass_passed      BIGINT DEFAULT 0,
    ship_limit       INTEGER DEFAULT 100,
    ships_passed     INTEGER DEFAULT 0,

    -- Time
    is_permanent     BOOLEAN DEFAULT false,
    lifetime_hours   INTEGER DEFAULT 48,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at       TIMESTAMPTZ,

    -- Access
    is_public        BOOLEAN DEFAULT true,
    discovered_by    BIGINT REFERENCES empires(empire_id),
    requires_key     BOOLEAN DEFAULT false,
    key_item_id      BIGINT REFERENCES items(item_id),

    -- Effects
    entry_effect     VARCHAR(50),
    exit_effect      VARCHAR(50),

    annotations      TEXT,

    created_at_meta  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wormholes_entry ON wormholes(entry_system_id);
CREATE INDEX idx_wormholes_exit ON wormholes(exit_system_id);
CREATE INDEX idx_wormholes_stable ON wormholes(stability);
CREATE INDEX idx_wormholes_active ON wormholes(expires_at) WHERE expires_at > NOW() OR expires_at IS NULL;
COMMENT ON TABLE wormholes IS 'Wormholes providing instant travel between distant star systems with mass and time limits';
