-- Compute Research Cost at Level
-- OGame-style exponential cost formula: BaseCost × CostGrowthRate^(Level-1)

CREATE OR REPLACE FUNCTION compute_research_cost(
    p_research_id BIGINT,
    p_level INTEGER
) RETURNS TABLE (
    metal_cost      BIGINT,
    crystal_cost    BIGINT,
    deuterium_cost  BIGINT,
    time_sec        INTEGER
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_base_metal     BIGINT;
    v_base_crystal   BIGINT;
    v_base_deuterium BIGINT;
    v_cost_growth    NUMERIC(4,2);
    v_base_time      INTEGER;
    v_time_growth    NUMERIC(4,2);
    v_cost_mult      NUMERIC(20,6);
BEGIN
    SELECT base_metal_cost, base_crystal_cost, base_deuterium_cost,
           cost_growth_rate, base_time_sec, time_growth_rate
    INTO v_base_metal, v_base_crystal, v_base_deuterium,
         v_cost_growth, v_base_time, v_time_growth
    FROM research_tree
    WHERE research_id = p_research_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    v_cost_mult := v_cost_growth ^ (p_level - 1);

    RETURN QUERY SELECT
        ROUND(v_base_metal * v_cost_mult)::BIGINT,
        ROUND(v_base_crystal * v_cost_mult)::BIGINT,
        ROUND(v_base_deuterium * v_cost_mult)::BIGINT,
        ROUND(v_base_time * (v_time_growth ^ (p_level - 1)))::INTEGER;
END;
$$;

COMMENT ON FUNCTION compute_research_cost IS 'OGame-style exponential research cost calculation';

CREATE OR REPLACE FUNCTION get_research_effect(
    p_research_id BIGINT,
    p_level INTEGER
) RETURNS NUMERIC(20,4) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_effect_base      NUMERIC(10,4);
    v_effect_per_level NUMERIC(10,4);
BEGIN
    SELECT effect_base, effect_per_level
    INTO v_effect_base, v_effect_per_level
    FROM research_tree
    WHERE research_id = p_research_id;

    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    RETURN v_effect_base + (v_effect_per_level * p_level);
END;
$$;

COMMENT ON FUNCTION get_research_effect IS 'Calculates the numeric effect of a research at a given level';
