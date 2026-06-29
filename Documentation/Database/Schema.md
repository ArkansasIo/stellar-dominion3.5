# Database Schema Overview

## 45 PostgreSQL Schema Files

Located in `database/schema/001_galaxies.sql` through `045_universe_settings.sql`.

### Organization

| File | Table | Purpose |
|------|-------|---------|
| 001 | `galaxies` | Galaxy definitions |
| 002 | `regions` | Galactic regions/sectors |
| 003 | `star_systems` | Star systems within regions |
| 004 | `stars` | Individual stars (spectral classes, properties) |
| 005 | `planets` | Planets with class, atmosphere, habitability |
| 006 | `moons` | Orbital moons |
| 007 | `asteroid_fields` | Asteroid belts and fields |
| 008 | `resource_nodes` | Specific mining locations |
| 009 | `space_stations` | Orbital and deep-space stations |
| 010 | `factions` | Major/minor factions with territory and power |
| 011 | `species` | Playable/NPC species with traits |
| 012 | `empires` | Player empires with scores and progression |
| 013 | `alliances` | Player alliances |
| 014 | `commanders` | Commander entities |
| 015 | `fleet_classes` | Ship hull types with slots and stats |
| 016 | `ship_hulls` | Detailed ship hull configurations |
| 017 | `ship_modules` | Equippable ship modules |
| 018 | `weapons` | Weapon systems (25 types) |
| 019 | `shields` | Shield systems |
| 020 | `armor` | Armor plating types |
| 021 | `engines` | Propulsion systems |
| 022 | `research_tree` | Researchable technologies |
| 023 | `buildings` | Building types with cost/production formulas |
| 024 | `planet_buildings` | Building instances on planets |
| 025 | `defenses` | Planetary defense systems |
| 026 | `resources` | All resource types |
| 027 | `items` | Consumable and equippable items |
| 028 | `blueprints` | Crafting/ship blueprints |
| 029 | `artifacts` | Ancient artifacts |
| 030 | `anomalies` | Space anomalies |
| 031 | `wormholes` | Wormhole connections |
| 032 | `nebulas` | Nebula regions |
| 033 | `events` | In-game events |
| 034 | `story_campaign` | Campaign missions |
| 035 | `quests` | Side quests |
| 036 | `npc_fleets` | NPC fleet templates |
| 037 | `pirates` | Pirate faction data |
| 038 | `bosses` | Raid/event bosses |
| 039 | `diplomacy` | Diplomatic treaties |
| 040 | `market` | Market/economy tables |
| 041 | `trade_routes` | Trade route definitions |
| 042 | `tech_tree` | Technology tree (detailed) |
| 043 | `achievements` | Achievement definitions |
| 044 | `prestige` | Prestige system |
| 045 | `universe_settings` | Global configuration |

## Database Functions

Located in `database/functions/`:

| Function | Purpose |
|----------|---------|
| `calculate_empire_score` | Computes all score components for an empire |
| `compute_building_cost` | OGame-style exponential building cost |
| `compute_building_cumulative_cost` | Multi-level cumulative cost |
| `compute_research_cost` | OGame-style research cost |
| `get_research_effect` | Calculates research effect value |
| `get_civilization_tier` | Determines tier (1–15) from score |
| `get_technology_age` | Determines age (1–8) from research count |
| `calculate_score_rank` | Determines rank (1–7) from score |
| `calculate_fleet_score` | Fleet score component |
| `calculate_defense_score` | Defense score component |
| `calculate_planet_production` | Hourly production per planet |
| `calculate_empire_production` | Cross-planet production aggregation |
| `get_commander_level_unlock` | Milestone unlocks by commander level |
| `refresh_empire_scores` | Updates all score fields on empire record |
| `refresh_all_empire_scores` | Refreshes and ranks all active empires |

## Database Views

Located in `database/views/`:

| View | Purpose |
|------|---------|
| `empire_standing` | Consolidated empire info with tier/rank/age |
| `empire_ranking` | Full leaderboard |
| `planet_summary` | Planet details with production |
| `empire_planets` | Aggregated stats per empire |
| `empire_military_overview` | Fleet, defense, tech strength |
| `alliance_overview` | Alliance stats with rank |
| `alliance_member_details` | Member breakdown |

## Database Indexes

Located in `database/indexes/`:

- Performance indexes for common query patterns (empire lookup, planet location, upgrade queues, trade routes, market orders, battle history, etc.)
- Cleanup indexes for maintenance jobs (orphaned records, expired data, session cleanup)

## Seed Data

Located in `database/seeds/`:

| File | Entries | Content |
|------|---------|---------|
| `001_factions.sql` | 20 | Major/minor factions |
| `002_species.sql` | 25 | Playable/NPC species |
| `003_resources.sql` | 30 | Basic to exotic resources |
| `004_buildings.sql` | 40 | All building types |
| `005_ship_hulls.sql` | 30 | Ship hulls across all roles |
| `006_weapons.sql` | 25 | Weapon systems |
| `007_defenses.sql` | 20 | Planetary/orbital defenses |
| `008_research_tree.sql` | 30 | Technologies across 8 ages |
