-- Planet Summary View
-- Each planet with its owner, class, production, and building count

CREATE OR REPLACE VIEW planet_summary AS
SELECT
    pl.planet_id,
    pl.name AS planet_name,
    pl.planet_class::TEXT,
    pl.diameter_km,
    pl.habitability,
    pl.temperature_min,
    pl.temperature_max,
    pl.atmosphere::TEXT,
    pl.resource_rich,
    pl.has_life,
    pl.has_ruins,
    pl.is_colonizable,
    pl.moon_count,
    pl.orbital_period,
    e.empire_id AS owner_id,
    e.name AS owner_name,
    ss.name AS system_name,
    g.name AS galaxy_name,
    pb.building_count,
    pb.active_building_count,
    prod.metal_per_hour,
    prod.crystal_per_hour,
    prod.deuterium_per_hour,
    prod.net_energy,
    pl.created_at
FROM planets pl
LEFT JOIN empires e ON pl.empire_id = e.empire_id
LEFT JOIN star_systems ss ON pl.system_id = ss.system_id
LEFT JOIN galaxies g ON ss.galaxy_id = g.galaxy_id
LEFT JOIN LATERAL (
    SELECT
        COUNT(*) AS building_count,
        COUNT(*) FILTER (WHERE pb2.is_active = true) AS active_building_count
    FROM planet_buildings pb2
    WHERE pb2.planet_id = pl.planet_id
) pb ON true
LEFT JOIN LATERAL calculate_planet_production(pl.planet_id) prod ON true;

COMMENT ON VIEW planet_summary IS 'Comprehensive planet view with owner, classification, production, and building stats';

CREATE OR REPLACE VIEW empire_planets AS
SELECT
    e.empire_id,
    e.name AS empire_name,
    COUNT(DISTINCT pl.planet_id) AS total_planets,
    COUNT(DISTINCT pl.planet_id) FILTER (WHERE pl.is_colonizable = true) AS colonizable_planets,
    SUM(prod.metal_per_hour) AS total_metal_hour,
    SUM(prod.crystal_per_hour) AS total_crystal_hour,
    SUM(prod.deuterium_per_hour) AS total_deuterium_hour,
    SUM(prod.net_energy) AS total_net_energy,
    SUM(pl.habitability) / NULLIF(COUNT(pl.planet_id), 0) AS avg_habitability
FROM empires e
LEFT JOIN planets pl ON e.empire_id = pl.empire_id
LEFT JOIN LATERAL calculate_planet_production(pl.planet_id) prod ON true
GROUP BY e.empire_id, e.name;

COMMENT ON VIEW empire_planets IS 'Aggregated planet statistics per empire';
