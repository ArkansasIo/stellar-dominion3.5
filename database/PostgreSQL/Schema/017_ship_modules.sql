-- Ship Modules
-- Equippable modules that modify ship performance

CREATE TYPE module_slot AS ENUM ('weapon','defense','utility','engineering','fighter');
CREATE TYPE module_rarity AS ENUM ('common','uncommon','rare','epic','legendary','artifact');
CREATE TYPE module_effect_type AS ENUM (
    'stat_boost','percentage','flat_bonus','proc_effect','aura','toggle',
    'cooldown_reduction','resistance','regen','special'
);

CREATE TABLE ship_modules (
    module_id        BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    slot             module_slot NOT NULL,
    rarity           module_rarity DEFAULT 'common',

    -- Stats
    energy_cost      SMALLINT DEFAULT 1,
    power_grid_cost  SMALLINT DEFAULT 1,
    cpu_usage        SMALLINT DEFAULT 1,
    mass_kg          INTEGER DEFAULT 1000,

    -- Effects (JSON for flexibility)
    effects          JSONB NOT NULL DEFAULT '{}',
    effect_type      module_effect_type DEFAULT 'stat_boost',
    effect_value     NUMERIC(10,2) DEFAULT 0,
    effect_duration  INTEGER DEFAULT 0,
    cooldown_sec     INTEGER DEFAULT 0,

    -- Requirements
    required_hull_id BIGINT REFERENCES ship_hulls(hull_id),
    required_level   SMALLINT DEFAULT 1,
    required_skill   VARCHAR(50),

    -- Cost
    metal_cost       BIGINT DEFAULT 100,
    crystal_cost     BIGINT DEFAULT 50,
    deuterium_cost   BIGINT DEFAULT 10,
    build_time_sec   INTEGER DEFAULT 600,

    -- Restrictions
    max_per_ship     SMALLINT DEFAULT 1,
    is_unique        BOOLEAN DEFAULT false,
    is_bp_required   BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_slot ON ship_modules(slot);
CREATE INDEX idx_modules_rarity ON ship_modules(rarity);
CREATE INDEX idx_modules_effect ON ship_modules(effect_type);
CREATE INDEX idx_modules_hull ON ship_modules(required_hull_id);
COMMENT ON TABLE ship_modules IS 'Equippable modules providing stat bonuses, special effects, and tactical capabilities';
