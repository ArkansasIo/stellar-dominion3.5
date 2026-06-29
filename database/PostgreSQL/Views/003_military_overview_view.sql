-- Military Overview View
-- Consolidated view of empire fleet, defense, and combat capabilities

CREATE OR REPLACE VIEW empire_military_overview AS
SELECT
    e.empire_id,
    e.name AS empire_name,
    e.military_score,
    e.fleet_score,
    e.defense_score,
    COALESCE(fleet.total_ships, 0) AS total_ships,
    COALESCE(fleet.total_fleet_value, 0) AS total_fleet_value,
    COALESCE(fleet.warship_count, 0) AS warship_count,
    COALESCE(fleet.cargo_capacity, 0) AS total_cargo_capacity,
    COALESCE(def.total_defenses, 0) AS total_defenses,
    COALESCE(def.total_defense_value, 0) AS total_defense_value,
    COALESCE(def.shield_domes, 0) AS shield_domes,
    COALESCE(tech.weapons_tech, 0) AS weapons_tech,
    COALESCE(tech.shield_tech, 0) AS shield_tech,
    COALESCE(tech.armor_tech, 0) AS armor_tech,
    e.civilization_tier,
    e.total_score
FROM empires e
LEFT JOIN LATERAL (
    SELECT
        COUNT(*)::INTEGER AS total_ships,
        SUM(fu.quantity)::BIGINT AS total_fleet_value,
        SUM(fu.quantity) FILTER (WHERE fc.role = 'combat')::INTEGER AS warship_count,
        SUM(fu.quantity * fc.base_cargo)::BIGINT AS cargo_capacity
    FROM fleet_units fu
    JOIN fleet_classes fc ON fu.class_id = fc.class_id
    WHERE fu.empire_id = e.empire_id
) fleet ON true
LEFT JOIN LATERAL (
    SELECT
        SUM(pd.quantity)::INTEGER AS total_defenses,
        SUM(pd.quantity * d.hull)::BIGINT AS total_defense_value,
        SUM(pd.quantity) FILTER (WHERE d.shield_dome = true)::INTEGER AS shield_domes
    FROM planet_defenses pd
    JOIN defenses d ON pd.defense_id = d.defense_id
    WHERE pd.empire_id = e.empire_id
) def ON true
LEFT JOIN LATERAL (
    SELECT
        MAX(CASE WHEN rt.short_code = 'weapons' THEN er.current_level ELSE 0 END) AS weapons_tech,
        MAX(CASE WHEN rt.short_code = 'shield' THEN er.current_level ELSE 0 END) AS shield_tech,
        MAX(CASE WHEN rt.short_code = 'armor' THEN er.current_level ELSE 0 END) AS armor_tech
    FROM empire_research er
    JOIN research_tree rt ON er.research_id = rt.research_id
    WHERE er.empire_id = e.empire_id
) tech ON true
WHERE e.status = 'active';

COMMENT ON VIEW empire_military_overview IS 'Consolidated military strength view with fleet, defense, and tech summaries';
