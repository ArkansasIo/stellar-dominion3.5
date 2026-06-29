-- Items
-- Consumable and equippable items

CREATE TYPE item_category AS ENUM (
    'consumable','boost','module','resource_container','blueprint',
    'artifact','implant','spy_drone','repair_kit','fuel_cell',
    'weapon_upgrade','defense_upgrade','engine_upgrade','shield_upgrade',
    'crew_member','decorative','key_card','data_core','relic'
);

CREATE TYPE item_rarity AS ENUM ('common','uncommon','rare','epic','legendary','artifact','ancient','mythic');

CREATE TABLE items (
    item_id          BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    category         item_category NOT NULL,
    rarity           item_rarity DEFAULT 'common',

    -- Stacking
    stackable        BOOLEAN DEFAULT true,
    max_stack        INTEGER DEFAULT 999,

    -- Effects
    effect_type      VARCHAR(50),
    effect_value     NUMERIC(12,4) DEFAULT 0,
    effect_duration  INTEGER DEFAULT 0,
    cooldown_sec     INTEGER DEFAULT 0,

    -- Usage
    use_on_planet    BOOLEAN DEFAULT false,
    use_on_fleet     BOOLEAN DEFAULT false,
    use_on_commander BOOLEAN DEFAULT false,
    use_on_alliance  BOOLEAN DEFAULT false,
    one_time_use     BOOLEAN DEFAULT true,

    -- Requirements
    min_command_level INTEGER DEFAULT 1,
    requires_skill    VARCHAR(50),

    -- Trade
    base_value       NUMERIC(12,2) DEFAULT 1.0,
    is_tradeable     BOOLEAN DEFAULT true,
    is_auctionable   BOOLEAN DEFAULT false,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_rarity ON items(rarity);
CREATE INDEX idx_items_tradeable ON items(is_tradeable) WHERE is_tradeable = true;
COMMENT ON TABLE items IS 'Consumable and equippable items with various effects and uses';
