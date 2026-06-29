-- Update Empire Scores and Progression
-- Refreshes all score columns and progression fields on the empires table

CREATE OR REPLACE FUNCTION refresh_empire_scores(p_empire_id BIGINT)
RETURNS empires LANGUAGE plpgsql AS $$
DECLARE
    v_scores RECORD;
    v_tier   RECORD;
    v_rank   RECORD;
    v_empire empires%ROWTYPE;
BEGIN
    -- Calculate scores
    SELECT * INTO v_scores FROM calculate_empire_score(p_empire_id);

    -- Get civilization tier
    SELECT * INTO v_tier FROM get_civilization_tier(v_scores.total_score);

    -- Get score rank
    SELECT * INTO v_rank FROM calculate_score_rank(v_scores.total_score);

    -- Update empire record
    UPDATE empires
    SET
        economy_score   = v_scores.economy_score,
        research_score  = v_scores.research_score,
        fleet_score     = v_scores.fleet_score,
        defense_score   = v_scores.defense_score,
        military_score  = v_scores.military_score,
        total_score     = v_scores.total_score,
        civilization_tier = v_tier.tier_number,
        updated_at      = NOW()
    WHERE empire_id = p_empire_id;

    SELECT * INTO v_empire FROM empires WHERE empire_id = p_empire_id;
    RETURN v_empire;
END;
$$;

COMMENT ON FUNCTION refresh_empire_scores IS 'Recalculates all scores and progression fields for an empire';

CREATE OR REPLACE FUNCTION refresh_all_empire_scores()
RETURNS TABLE(empire_id BIGINT, total_score BIGINT, civilization_tier INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    v_emp RECORD;
BEGIN
    FOR v_emp IN SELECT empire_id FROM empires WHERE status = 'active' LOOP
        PERFORM refresh_empire_scores(v_emp.empire_id);
    END LOOP;

    RETURN QUERY SELECT e.empire_id, e.total_score, e.civilization_tier
    FROM empires e
    WHERE e.status = 'active'
    ORDER BY e.total_score DESC;
END;
$$;

COMMENT ON FUNCTION refresh_all_empire_scores IS 'Recalculates scores for all active empires and returns ranking';
