-- Planet Buildings (Instances)
-- Building instances on individual planets owned by empires

CREATE TABLE planet_buildings (
    planet_building_id BIGSERIAL PRIMARY KEY,
    planet_id          BIGINT NOT NULL REFERENCES planets(planet_id),
    empire_id          BIGINT REFERENCES empires(empire_id),
    building_id        BIGINT NOT NULL REFERENCES buildings(building_id),
    level              INTEGER DEFAULT 1,
    slot_number        SMALLINT,
    is_active          BOOLEAN DEFAULT true,
    is_upgrading       BOOLEAN DEFAULT false,
    upgrade_started    TIMESTAMPTZ,
    upgrade_finishes   TIMESTAMPTZ,
    construction_start TIMESTAMPTZ,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(planet_id, slot_number),
    UNIQUE(planet_id, building_id, empire_id)
);

CREATE TABLE planet_building_queue (
    queue_id           BIGSERIAL PRIMARY KEY,
    planet_id          BIGINT NOT NULL REFERENCES planets(planet_id),
    empire_id          BIGINT NOT NULL REFERENCES empires(empire_id),
    building_id        BIGINT NOT NULL REFERENCES buildings(building_id),
    target_level       INTEGER NOT NULL,
    position           SMALLINT NOT NULL,
    started_at         TIMESTAMPTZ DEFAULT NOW(),
    finishes_at        TIMESTAMPTZ NOT NULL,
    cancelled          BOOLEAN DEFAULT false
);

CREATE INDEX idx_pb_planet ON planet_buildings(planet_id);
CREATE INDEX idx_pb_empire ON planet_buildings(empire_id);
CREATE INDEX idx_pb_building ON planet_buildings(building_id);
CREATE INDEX idx_pb_upgrading ON planet_buildings(is_upgrading) WHERE is_upgrading = true;
CREATE INDEX idx_pbq_empire ON planet_building_queue(empire_id);
CREATE INDEX idx_pbq_planet ON planet_building_queue(planet_id);
COMMENT ON TABLE planet_buildings IS 'Building instances on planets tracking current level and upgrade status';
COMMENT ON TABLE planet_building_queue IS 'Queued building upgrades for each planet';
