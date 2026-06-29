-- Compute Building Cost at Level
-- OGame-style exponential cost formula: BaseCost × GrowthRate^(Level-1)

CREATE OR REPLACE FUNCTION compute_building_cost(
    p_building_id BIGINT,
    p_level INTEGER,
    p_quantity INTEGER DEFAULT 1
) RETURNS TABLE (
    metal_cost      BIGINT,
    crystal_cost    BIGINT,
    deuterium_cost  BIGINT,
    energy_cost     BIGINT,
    build_time_sec  INTEGER
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_base_metal     BIGINT;
    v_base_crystal   BIGINT;
    v_base_deuterium BIGINT;
    v_growth_rate    NUMERIC(4,2);
    v_base_time      INTEGER;
    v_time_growth    NUMERIC(4,2);
    v_cost_mult      NUMERIC(20,6);
BEGIN
    SELECT base_metal_cost, base_crystal_cost, base_deuterium_cost,
           growth_rate, base_time_sec, time_growth_rate
    INTO v_base_metal, v_base_crystal, v_base_deuterium,
         v_growth_rate, v_base_time, v_time_growth
    FROM buildings
    WHERE building_id = p_building_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    v_cost_mult := v_growth_rate ^ (p_level - 1);

    RETURN QUERY SELECT
        ROUND(v_base_metal * v_cost_mult)::BIGINT * p_quantity,
        ROUND(v_base_crystal * v_cost_mult)::BIGINT * p_quantity,
        ROUND(v_base_deuterium * v_cost_mult)::BIGINT * p_quantity,
        0::BIGINT,
        ROUND(v_base_time * (v_time_growth ^ (p_level - 1)))::INTEGER;
END;
$$;

COMMENT ON FUNCTION compute_building_cost IS 'OGame-style exponential building cost calculation';

CREATE OR REPLACE FUNCTION compute_building_cumulative_cost(
    p_building_id BIGINT,
    p_from_level INTEGER,
    p_to_level INTEGER
) RETURNS TABLE (
    metal_cost      BIGINT,
    crystal_cost    BIGINT,
    deuterium_cost  BIGINT,
    total_time_sec  BIGINT
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_base_metal     BIGINT;
    v_base_crystal   BIGINT;
    v_base_deuterium BIGINT;
    v_growth_rate    NUMERIC(4,2);
    v_base_time      INTEGER;
    v_time_growth    NUMERIC(4,2);
    v_metal          BIGINT := 0;
    v_crystal        BIGINT := 0;
    v_deuterium      BIGINT := 0;
    v_time           BIGINT := 0;
    v_i              INTEGER;
BEGIN
    SELECT base_metal_cost, base_crystal_cost, base_deuterium_cost,
           growth_rate, base_time_sec, time_growth_rate
    INTO v_base_metal, v_base_crystal, v_base_deuterium,
         v_growth_rate, v_base_time, v_time_growth
    FROM buildings
    WHERE building_id = p_building_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    FOR v_i IN p_from_level..p_to_level LOOP
        v_metal := v_metal + ROUND(v_base_metal * (v_growth_rate ^ (v_i - 1)));
        v_crystal := v_crystal + ROUND(v_base_crystal * (v_growth_rate ^ (v_i - 1)));
        v_deuterium := v_deuterium + ROUND(v_base_deuterium * (v_growth_rate ^ (v_i - 1)));
        v_time := v_time + ROUND(v_base_time * (v_time_growth ^ (v_i - 1)));
    END LOOP;

    RETURN QUERY SELECT v_metal, v_crystal, v_deuterium, v_time;
END;
$$;

COMMENT ON FUNCTION compute_building_cumulative_cost IS 'Calculates cumulative resource/time cost for upgrading across multiple levels';
