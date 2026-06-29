-- Diplomacy
-- Diplomatic relations between empires and with factions

CREATE TYPE diplomatic_status AS ENUM (
    'war','hostile','unfriendly','neutral','friendly','ally','vassal','protectorate','confederation'
);

CREATE TYPE treaty_type AS ENUM (
    'non_aggression','trade','research','mutual_defense','military_access',
    'resource_sharing','technology_sharing','alliance','vassalage','peace'
);

CREATE TABLE diplomacy_relations (
    relation_id      BIGSERIAL PRIMARY KEY,
    empire_id_1      BIGINT NOT NULL REFERENCES empires(empire_id),
    empire_id_2      BIGINT NOT NULL REFERENCES empires(empire_id),
    status           diplomatic_status DEFAULT 'neutral',
    relation_score   INTEGER DEFAULT 0 CHECK (relation_score BETWEEN -1000 AND 1000),
    trade_volume     BIGINT DEFAULT 0,
    war_count        INTEGER DEFAULT 0,
    alliance_id      BIGINT REFERENCES alliances(alliance_id),
    established_at   TIMESTAMPTZ DEFAULT NOW(),
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(empire_id_1, empire_id_2)
);

CREATE TABLE diplomacy_treaties (
    treaty_id        BIGSERIAL PRIMARY KEY,
    empire_id_1      BIGINT NOT NULL REFERENCES empires(empire_id),
    empire_id_2      BIGINT NOT NULL REFERENCES empires(empire_id),
    treaty_type      treaty_type NOT NULL,
    duration_days    INTEGER DEFAULT 30,
    signed_at        TIMESTAMPTZ DEFAULT NOW(),
    expires_at       TIMESTAMPTZ,
    is_active        BOOLEAN DEFAULT true,
    terms            JSONB DEFAULT '{}',
    broken_by        BIGINT REFERENCES empires(empire_id),
    UNIQUE(empire_id_1, empire_id_2, treaty_type)
);

CREATE TABLE faction_reputations (
    reputation_id    BIGSERIAL PRIMARY KEY,
    empire_id        BIGINT NOT NULL REFERENCES empires(empire_id),
    faction_id       BIGINT NOT NULL REFERENCES factions(faction_id),
    reputation_score INTEGER DEFAULT 0 CHECK (reputation_score BETWEEN -100000 AND 100000),
    rank             INTEGER DEFAULT 1,
    missions_completed INTEGER DEFAULT 0,
    trades_completed   INTEGER DEFAULT 0,
    kills_contributed  INTEGER DEFAULT 0,
    last_changed     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(empire_id, faction_id)
);

CREATE INDEX idx_dr_empire1 ON diplomacy_relations(empire_id_1);
CREATE INDEX idx_dr_empire2 ON diplomacy_relations(empire_id_2);
CREATE INDEX idx_dr_status ON diplomacy_relations(status);
CREATE INDEX idx_dt_active ON diplomacy_treaties(is_active) WHERE is_active = true;
CREATE INDEX idx_fr_empire ON faction_reputations(empire_id);
CREATE INDEX idx_fr_faction ON faction_reputations(faction_id);
CREATE INDEX idx_fr_score ON faction_reputations(reputation_score DESC);
COMMENT ON TABLE diplomacy_relations IS 'Bilateral diplomatic relations between empires';
COMMENT ON TABLE diplomacy_treaties IS 'Formal treaties with specific terms and durations';
COMMENT ON TABLE faction_reputations IS 'Empire standing with NPC factions affecting missions, trades, and rewards';
