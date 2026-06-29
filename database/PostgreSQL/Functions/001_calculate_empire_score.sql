-- Calculate Total Empire Score
-- Computes economy, research, fleet, defense, and total scores from current state

CREATE OR REPLACE FUNCTION calculate_empire_score(p_empire_id BIGINT)
RETURNS TABLE (
    economy_score   BIGINT,
    research_score  BIGINT,
    fleet_score     BIGINT,
    defense_score   BIGINT,
    military_score  BIGINT,
    total_score     BIGINT
) LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_economy   BIGINT := 0;
    v_research  BIGINT := 0;
    v_fleet     BIGINT := 0;
    v_defense   BIGINT := 0;
    v_military  BIGINT := 0;
    v_total     BIGINT := 0;
BEGIN
    -- Economy score: sum of building levels * 10
    SELECT COALESCE(SUM(pb.level) * 10, 0) INTO v_economy
    FROM planet_buildings pb
    JOIN buildings b ON pb.building_id = b.building_id
    WHERE pb.empire_id = p_empire_id
      AND pb.is_active = true
      AND b.category IN ('resource', 'production', 'infrastructure', 'storage', 'civilian');

    -- Research score: sum of research levels * 15
    SELECT COALESCE(SUM(rt.current_level) * 15, 0) INTO v_research
    FROM empire_research er
    JOIN research_tree rt ON er.research_id = rt.research_id
    WHERE er.empire_id = p_empire_id;

    -- Fleet score: count of ships * their metal+crystal cost / 1000
    SELECT COALESCE(SUM(fu.quantity * (fc.metal_cost + fc.crystal_cost) / 1000), 0) INTO v_fleet
    FROM fleet_units fu
    JOIN fleet_classes fc ON fu.class_id = fc.class_id
    WHERE fu.empire_id = p_empire_id;

    -- Defense score: count of defenses * their combined cost / 1000
    SELECT COALESCE(SUM(pd.quantity * (d.base_metal_cost + d.base_crystal_cost + d.base_deuterium_cost) / 1000), 0) INTO v_defense
    FROM planet_defenses pd
    JOIN defenses d ON pd.defense_id = d.defense_id
    WHERE pd.empire_id = p_empire_id;

    v_military := v_fleet + v_defense;
    v_total := v_economy + v_research + v_military;

    RETURN QUERY SELECT v_economy, v_research, v_fleet, v_defense, v_military, v_total;
END;
$$;

COMMENT ON FUNCTION calculate_empire_score IS 'Calculates all score components and total for an empire based on buildings, research, fleet, and defenses';
