-- Calculate Empire Score Rank
-- Determines rank title and bracket from total score

CREATE OR REPLACE FUNCTION calculate_score_rank(p_total_score BIGINT)
RETURNS TABLE (
    rank_number    INTEGER,
    rank_title     VARCHAR(100),
    min_score      BIGINT,
    max_score      BIGINT,
    next_rank_score BIGINT
) LANGUAGE plpgsql STABLE AS $$
BEGIN
    -- 7 empire score ranks
    RETURN QUERY
    WITH ranks(seq, title, min_score, max_score) AS (
        VALUES
            (1, 'New Commander',      0, 999),
            (2, 'Sector Officer',     1000, 9999),
            (3, 'System Commander',   10000, 99999),
            (4, 'Fleet Admiral',      100000, 999999),
            (5, 'Sector Governor',    1000000, 9999999),
            (6, 'Star Lord',          10000000, 99999999),
            (7, 'Grand Admiral',      100000000, 999999999)
    )
    SELECT r.seq, r.title, r.min_score, r.max_score,
           COALESCE(LEAD(r.min_score) OVER (ORDER BY r.seq), r.max_score)
    FROM ranks r
    WHERE p_total_score BETWEEN r.min_score AND r.max_score
    ORDER BY r.seq
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION calculate_score_rank IS 'Determines empire score rank (1-7) from total score';

CREATE OR REPLACE FUNCTION calculate_fleet_score(p_empire_id BIGINT)
RETURNS BIGINT LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_score BIGINT;
BEGIN
    SELECT COALESCE(SUM(fu.quantity * (fc.metal_cost + fc.crystal_cost) / 1000), 0)
    INTO v_score
    FROM fleet_units fu
    JOIN fleet_classes fc ON fu.class_id = fc.class_id
    WHERE fu.empire_id = p_empire_id;

    RETURN v_score;
END;
$$;

COMMENT ON FUNCTION calculate_fleet_score IS 'Calculates fleet score component from owned ships and their costs';

CREATE OR REPLACE FUNCTION calculate_defense_score(p_empire_id BIGINT)
RETURNS BIGINT LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_score BIGINT;
BEGIN
    SELECT COALESCE(SUM(pd.quantity * (d.base_metal_cost + d.base_crystal_cost + d.base_deuterium_cost) / 1000), 0)
    INTO v_score
    FROM planet_defenses pd
    JOIN defenses d ON pd.defense_id = d.defense_id
    WHERE pd.empire_id = p_empire_id;

    RETURN v_score;
END;
$$;

COMMENT ON FUNCTION calculate_defense_score IS 'Calculates defense score component from owned defenses';
