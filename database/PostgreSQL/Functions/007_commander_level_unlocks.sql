-- Commander Level Unlock Functions
-- Determines unlocked features based on commander level

CREATE OR REPLACE FUNCTION get_commander_level_unlock(p_level INTEGER)
RETURNS TABLE (
    milestone_level  INTEGER,
    title            VARCHAR(100),
    bonus_type       VARCHAR(50),
    bonus_value      NUMERIC(10,4),
    description      TEXT
) LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    WITH milestones(level, title, bonus_type, bonus_value, descr) AS (
        VALUES
            (1,   'Recruit',           'fleet_speed',     1.0,   'Basic fleet command'),
            (5,   'Squad Leader',      'fleet_attack',    1.05,  'Unlock fleet grouping'),
            (10,  'Platoon Commander', 'fleet_defense',   1.05,  'Unlock basic formations'),
            (15,  'Company Commander', 'resource_production', 1.05, 'Unlock trade routes'),
            (20,  'Battalion Leader',  'fleet_attack',    1.10,  'Unlock advanced formations'),
            (25,  'Regiment Commander','fleet_speed',     1.10,  'Unlock expedition missions'),
            (30,  'Brigade General',   'research_speed',  1.05,  'Unlock research network'),
            (35,  'Division Commander','fleet_defense',   1.10,  'Unlock fleet carriers'),
            (40,  'Corps Commander',   'fleet_attack',    1.15,  'Unlock titan class ships'),
            (45,  'Field Marshal',     'resource_production', 1.10, 'Unlock mega-structures'),
            (50,  'Grand Marshal',     'research_speed',  1.10,  'Unlock ancient technology'),
            (55,  'Fleet Commander',   'fleet_speed',     1.15,  'Unlock warp gates'),
            (60,  'Sector Commander',  'fleet_defense',   1.15,  'Unlock planetary shields'),
            (65,  'System Lord',       'fleet_attack',    1.20,  'Unlock deathstar class'),
            (70,  'Star Commander',    'research_speed',  1.15,  'Unlock quantum technologies'),
            (75,  'High Commander',    'resource_production', 1.15, 'Unlock dyson spheres'),
            (80,  'Supreme Commander', 'fleet_attack',    1.25,  'Unlock ascended warships'),
            (85,  'Galactic Commander','fleet_defense',   1.20,  'Unlock galactic wonders'),
            (90,  'Grand Admiral',     'research_speed',  1.20,  'Unlock transcendence'),
            (95,  'Fleet Admiral',     'fleet_speed',     1.20,  'Unlock temporal technologies'),
            (100, 'Legendary Commander', 'all_stats',     1.25,  'Maximum commander achievement')
    )
    SELECT m.level, m.title, m.bonus_type, m.bonus_value, m.descr
    FROM milestones m
    WHERE m.level <= p_level
    ORDER BY m.level;
END;
$$;

COMMENT ON FUNCTION get_commander_level_unlock IS 'Returns all milestone unlocks up to the given commander level';
