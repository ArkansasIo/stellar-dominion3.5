-- Calculate Planet Resource Production
-- Aggregates production from all active buildings on a planet

CREATE OR REPLACE FUNCTION calculate_planet_production(p_planet_id BIGINT)
RETURNS TABLE (
    metal_per_hour      NUMERIC(18,2),
    crystal_per_hour    NUMERIC(18,2),
    deuterium_per_hour  NUMERIC(18,2),
    energy_produced     NUMERIC(18,2),
    energy_consumed     NUMERIC(18,2),
    net_energy          NUMERIC(18,2)
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_metal     NUMERIC(18,2) := 0;
    v_crystal   NUMERIC(18,2) := 0;
    v_deuterium NUMERIC(18,2) := 0;
    v_energy_p  NUMERIC(18,2) := 0;
    v_energy_c  NUMERIC(18,2) := 0;
BEGIN
    -- Aggregate production from resource buildings
    SELECT
        COALESCE(SUM(
            CASE WHEN b.short_code IN ('metal_mine', 'metal') THEN
                b.base_production * (b.production_growth ^ (pb.level - 1))
            ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN b.short_code IN ('crystal_mine', 'crystal') THEN
                b.base_production * (b.production_growth ^ (pb.level - 1))
            ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN b.short_code IN ('deuterium_synthesizer', 'deuterium') THEN
                b.base_production * (b.production_growth ^ (pb.level - 1))
            ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN b.energy_production > 0 THEN
                b.energy_production * (b.energy_growth ^ (pb.level - 1))
            ELSE 0 END
        ), 0),
        COALESCE(SUM(
            CASE WHEN b.energy_consumption > 0 THEN
                b.energy_consumption * (b.energy_growth ^ (pb.level - 1))
            ELSE 0 END
        ), 0)
    INTO v_metal, v_crystal, v_deuterium, v_energy_p, v_energy_c
    FROM planet_buildings pb
    JOIN buildings b ON pb.building_id = b.building_id
    WHERE pb.planet_id = p_planet_id
      AND pb.is_active = true;

    RETURN QUERY SELECT
        v_metal, v_crystal, v_deuterium,
        v_energy_p, v_energy_c,
        (v_energy_p - v_energy_c);
END;
$$;

COMMENT ON FUNCTION calculate_planet_production IS 'Calculates hourly resource and energy production for a planet';

CREATE OR REPLACE FUNCTION calculate_empire_production(p_empire_id BIGINT)
RETURNS TABLE (
    planet_name         VARCHAR(100),
    metal_per_hour      NUMERIC(18,2),
    crystal_per_hour    NUMERIC(18,2),
    deuterium_per_hour  NUMERIC(18,2),
    net_energy          NUMERIC(18,2)
) LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT
        pl.name,
        pp.metal_per_hour,
        pp.crystal_per_hour,
        pp.deuterium_per_hour,
        pp.net_energy
    FROM planets pl
    JOIN planet_buildings pb ON pl.planet_id = pb.planet_id
    CROSS JOIN LATERAL calculate_planet_production(pl.planet_id) pp
    WHERE pb.empire_id = p_empire_id
      AND pb.is_active = true
    GROUP BY pl.planet_id, pl.name, pp.metal_per_hour, pp.crystal_per_hour,
             pp.deuterium_per_hour, pp.net_energy;
END;
$$;

COMMENT ON FUNCTION calculate_empire_production IS 'Aggregates production across all planets owned by an empire';
