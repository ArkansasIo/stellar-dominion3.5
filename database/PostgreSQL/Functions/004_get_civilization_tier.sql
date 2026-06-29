-- Get Civilization Tier for an Empire
-- Determines tier based on total_score thresholds

CREATE OR REPLACE FUNCTION get_civilization_tier(p_total_score BIGINT)
RETURNS TABLE (
    tier_number       INTEGER,
    tier_name         VARCHAR(100),
    min_score         BIGINT,
    next_tier_score   BIGINT,
    progress_pct      NUMERIC(5,2)
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_tier_number INTEGER;
    v_tier_name   VARCHAR(100);
    v_min_score   BIGINT;
    v_next_score  BIGINT;
    v_max_score   BIGINT;
BEGIN
    -- 15 civilization tiers with score thresholds
    WITH tiers(seq, name, min_score) AS (
        VALUES
            (1,  'Outpost',          0),
            (2,  'Settlement',       500),
            (3,  'Colony',           2500),
            (4,  'Province',         10000),
            (5,  'State',            50000),
            (6,  'Kingdom',          250000),
            (7,  'Republic',         500000),
            (8,  'Commonwealth',     1000000),
            (9,  'Federation',       2500000),
            (10, 'Star Empire',      5000000),
            (11, 'Galactic Domain',  10000000),
            (12, 'Interstellar Union', 25000000),
            (13, 'Celestial Dominion', 50000000),
            (14, 'Cosmic Sovereignty', 100000000),
            (15, 'Ascendant Civilization', 250000000)
    )
    SELECT t.seq, t.name, t.min_score,
           COALESCE(LEAD(t.min_score) OVER (ORDER BY t.seq), 999999999),
           999999999
    INTO v_tier_number, v_tier_name, v_min_score, v_next_score, v_max_score
    FROM tiers t
    WHERE t.min_score <= p_total_score
    ORDER BY t.seq DESC
    LIMIT 1;

    IF v_tier_number IS NULL THEN
        v_tier_number := 1;
        v_tier_name := 'Outpost';
        v_min_score := 0;
        v_next_score := 500;
    END IF;

    RETURN QUERY SELECT
        v_tier_number,
        v_tier_name,
        v_min_score,
        v_next_score,
        CASE WHEN v_next_score > v_min_score
            THEN ROUND((p_total_score - v_min_score)::NUMERIC / (v_next_score - v_min_score) * 100, 2)
            ELSE 100.00
        END;
END;
$$;

COMMENT ON FUNCTION get_civilization_tier IS 'Determines civilization tier (1-15) from total empire score with progress to next tier';

CREATE OR REPLACE FUNCTION get_technology_age(p_research_count INTEGER)
RETURNS TABLE (
    age_number    INTEGER,
    age_name      VARCHAR(100),
    min_count     INTEGER,
    next_age_count INTEGER,
    progress_pct  NUMERIC(5,2)
) LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    WITH ages(seq, name, min_count) AS (
        VALUES
            (1, 'Primitive',       0),
            (2, 'Industrial',      5),
            (3, 'Atomic',          15),
            (4, 'Information',     30),
            (5, 'Quantum',         50),
            (6, 'Stellar',         80),
            (7, 'Galactic',        120),
            (8, 'Transcendent',    180)
    )
    SELECT a.seq, a.name, a.min_count,
           COALESCE(LEAD(a.min_count) OVER (ORDER BY a.seq), 999),
           CASE WHEN COALESCE(LEAD(a.min_count) OVER (ORDER BY a.seq), 999) > a.min_count
               THEN ROUND((p_research_count - a.min_count)::NUMERIC /
                    (LEAD(a.min_count) OVER (ORDER BY a.seq) - a.min_count) * 100, 2)
               ELSE 100.00
           END
    FROM ages a
    WHERE a.min_count <= p_research_count
    ORDER BY a.seq DESC
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION get_technology_age IS 'Determines technology age (1-8) from completed research count';
