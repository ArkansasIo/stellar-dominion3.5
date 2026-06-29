-- Alliance Overview View
-- Consolidated alliance stats with member counts and combined power

CREATE OR REPLACE VIEW alliance_overview AS
SELECT
    a.alliance_id,
    a.name AS alliance_name,
    a.short_code,
    a.member_count,
    a.total_score,
    a.total_economy,
    a.total_research,
    a.total_military,
    a.total_fleet,
    a.total_defense,
    RANK() OVER (ORDER BY a.total_score DESC) AS score_rank,
    e.empire_name AS founder_name,
    a.description,
    a.is_recruiting,
    a.created_at
FROM alliances a
LEFT JOIN empire_standing e ON a.founder_id = e.empire_id;

COMMENT ON VIEW alliance_overview IS 'Alliance statistics with rankings and founder info';

CREATE OR REPLACE VIEW alliance_member_details AS
SELECT
    am.alliance_id,
    am.empire_id,
    am.rank,
    am.joined_at,
    es.empire_name,
    es.total_score,
    es.economy_score,
    es.research_score,
    es.military_score,
    es.civilization_tier_name,
    es.rank_title,
    es.colony_count,
    es.last_active
FROM alliance_members am
JOIN empire_standing es ON am.empire_id = es.empire_id
ORDER BY es.total_score DESC;

COMMENT ON VIEW alliance_member_details IS 'Alliance member list with individual empire standing data';
