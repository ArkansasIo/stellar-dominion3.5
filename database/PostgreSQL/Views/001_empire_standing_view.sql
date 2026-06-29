-- Empire Standing View
-- Consolidated view of empire progression, scores, and rankings

CREATE OR REPLACE VIEW empire_standing AS
SELECT
    e.empire_id,
    e.name AS empire_name,
    e.status,
    e.civilization_tier,
    e.technology_age,
    e.level,
    e.prestige_level,
    e.total_score,
    e.economy_score,
    e.research_score,
    e.military_score,
    e.fleet_score,
    e.defense_score,
    e.colony_count,
    e.population,
    e.happiness,
    f.name AS faction_name,
    f.short_code AS faction_code,
    s.name AS species_name,
    r.rank_title,
    ct.tier_name AS civilization_tier_name,
    ta.age_name AS technology_age_name,
    e.last_active,
    e.created_at
FROM empires e
LEFT JOIN factions f ON e.faction_id = f.faction_id
LEFT JOIN species s ON e.species_id = s.species_id
LEFT JOIN LATERAL calculate_score_rank(e.total_score) r ON true
LEFT JOIN LATERAL get_civilization_tier(e.total_score) ct ON true
LEFT JOIN LATERAL get_technology_age(
    (SELECT COUNT(*) FROM empire_research er WHERE er.empire_id = e.empire_id AND er.current_level > 0)::INTEGER
) ta ON true
WHERE e.status = 'active';

COMMENT ON VIEW empire_standing IS 'Consolidated empire view with progression, scores, and rank information';

CREATE OR REPLACE VIEW empire_ranking AS
SELECT
    ROW_NUMBER() OVER (ORDER BY es.total_score DESC) AS rank,
    es.empire_id,
    es.empire_name,
    es.civilization_tier,
    es.civilization_tier_name,
    es.technology_age,
    es.technology_age_name,
    es.total_score,
    es.economy_score,
    es.research_score,
    es.military_score,
    es.faction_name,
    es.species_name,
    es.rank_title,
    es.colony_count,
    es.last_active
FROM empire_standing es
ORDER BY es.total_score DESC;

COMMENT ON VIEW empire_ranking IS 'Full leaderboard ranking of all active empires';
