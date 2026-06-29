-- Player dashboard view combining multiple tables

CREATE OR REPLACE VIEW player_dashboard AS
SELECT 
    u.id AS player_id,
    u.username,
    u.email,
    u.created_at AS account_created,
    ps.planet_name,
    ps.coordinates,
    ps.resources,
    ps.buildings,
    ps.research,
    ps.units,
    ps.megastructures,
    ps.turns_data,
    ps.research_xp,
    ps.government,
    ps.commander,
    ps.alliance_id,
    ps.realm_id,
    ps.config,
    pp.display_name,
    pp.rank,
    pp.score,
    pp.achievements,
    pp.stats,
    po.theme,
    po.language,
    po.notifications_enabled,
    (SELECT COUNT(*) FROM missions WHERE player_id = u.id AND status != 'completed') AS active_missions,
    (SELECT COUNT(*) FROM messages WHERE to_user = u.username AND read = FALSE) AS unread_messages,
    (SELECT COUNT(*) FROM queue_items WHERE player_id = u.id AND status = 'pending') AS pending_queue,
    (SELECT COUNT(*) FROM battles WHERE attacker_id = u.id OR defender_id = u.id) AS total_battles,
    (SELECT COUNT(*) FROM expeditions WHERE player_id = u.id AND status = 'active') AS active_expeditions
FROM users u
LEFT JOIN player_states ps ON u.id = ps.user_id
LEFT JOIN player_profiles pp ON u.id = pp.player_id
LEFT JOIN player_options po ON u.id = po.player_id;

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id AS player_id,
    u.username,
    pp.display_name,
    pp.rank,
    pp.score,
    pp.achievements,
    ps.resources,
    ps.units,
    ps.research_xp,
    ps.megastructures,
    (ps.resources->>'metal')::INTEGER + (ps.resources->>'crystal')::INTEGER * 1.5 + (ps.resources->>'deuterium')::INTEGER * 2 AS empire_value,
    (SELECT COUNT(*) FROM battles WHERE attacker_id = u.id AND result->>'winner' = u.id::TEXT) AS battles_won,
    (SELECT COUNT(*) FROM alliances WHERE leader_id = u.id) AS alliances_led,
    u.created_at AS joined_at
FROM users u
LEFT JOIN player_profiles pp ON u.id = pp.player_id
LEFT JOIN player_states ps ON u.id = ps.user_id
WHERE ps.setup_complete = TRUE
ORDER BY pp.score DESC;

-- Alliance overview view
CREATE OR REPLACE VIEW alliance_overview AS
SELECT 
    a.id AS alliance_id,
    a.name AS alliance_name,
    a.tag,
    a.description,
    u.username AS leader_name,
    jsonb_array_length(a.members) AS member_count,
    a.members,
    a.created_at
FROM alliances a
LEFT JOIN users u ON a.leader_id = u.id;

-- Market overview view
CREATE OR REPLACE VIEW market_overview AS
SELECT 
    mo.id AS order_id,
    u.username AS player_name,
    mo.type AS order_type,
    mo.resource_type,
    mo.amount,
    mo.price,
    (mo.amount * mo.price) AS total_value,
    mo.status,
    mo.created_at
FROM market_orders mo
LEFT JOIN users u ON mo.player_id = u.id
WHERE mo.status = 'active'
ORDER BY mo.created_at DESC;

-- Research progress view
CREATE OR REPLACE VIEW research_progress AS
SELECT 
    u.id AS player_id,
    u.username,
    prp.technology_id,
    rt.name AS technology_name,
    rt.description,
    rt.category,
    prp.current_level,
    prp.progress,
    prp.max_progress,
    prp.completed,
    prp.updated_at
FROM player_research_progress prp
JOIN users u ON prp.player_id = u.id
JOIN research_technologies rt ON prp.technology_id = rt.id;
