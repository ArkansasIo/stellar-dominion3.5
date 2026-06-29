# Universe Empire Dominion 3 - Complete Project Structure

## Top-Level Directories
```
universe-empire-dominion3/
├── client/                    # React frontend (Vite + TypeScript)
├── server/                    # Express backend (Node.js + TypeScript)
├── shared/                    # Shared types, configs, schema (Drizzle ORM)
├── migrations/                # Database migrations (Drizzle Kit)
├── config/                    # Game config (YAML)
├── sql/                       # Raw SQL schemas and seeds
├── docs/                      # Documentation
├── scripts/                   # Build/utility scripts
├── .github/                   # CI/CD workflows
└── output/                    # Electron build output
```

## SQL Files
```
sql/schema/
├── full_game_complete.sql     # Master schema (80+ tables)
├── 01_base_tables.sql         # users, player_states, missions, messages
├── 02_game_tables.sql         # battles, colonies, research
├── 03_advanced_tables.sql     # expeditions, profiles, megastructures
├── user_accounts.sql          # user_profiles, activity logs, badges
├── units.sql                  # RPG unit attributes, training, loadouts
├── universe.sql               # galaxies, stars, planets, moons
├── game.sql                   # tech tree, combat balance, buildings
├── currency.sql               # Currency system
├── system.sql                 # System config
├── protection.sql             # Protection system
└── unit_research.sql          # Unit research

sql/views/
└── player_dashboard.sql       # SQL views for dashboard

sql/options/
└── player_options.sql         # UI preferences

sql/seeds/
└── game_data_seeds.sql        # Initial game data
```

## Database Tables (80+)
| Table | Purpose |
|-------|---------|
| users | User accounts |
| sessions | Auth sessions |
| player_states | Core game state (40+ JSONB columns) |
| player_profiles | Profile with 6 attributes + 6 sub-attributes + 6 categories |
| empire_profiles | 9-attribute empire specialization system |
| empire_values | Empire value tracking |
| dimensional_anomalies | 90 anomaly discovery/exploration tracking |
| player_refineries | 7 refinery types with recipes and production |
| blueprint_instances | Blueprint charge system (12 charges max) |
| blueprint_printer_jobs | Printer job queue |
| blueprint_printer_levels | Player printer XP and level |
| server_cron_jobs | Server-side cron job definitions |
| server_cron_logs | Cron execution history |
| server_game_ticks | Game tick metrics |
| server_timers | Timer definitions |
| market_orders | Order book trading |
| auction_listings | Auction house |
| auction_bids | Bid history |
| trade_offers | Direct player trades |
| trade_history | Completed trades |
| research_trades | Research trading |
| player_research_progress | Per-technology progress |
| queue_items | Construction queue |
| battles / battle_logs | Combat records |
| fleets / fleet_ships | Fleet system |
| armies / army_units | Ground army |
| troops / squads | Individual units |
| expeditions / expedition_teams | Expedition system |
| mega_structures | End-game constructs |
| resource_fields | Resource extraction |
| starbases / moon_bases | Orbital stations |
| alliances / alliance_members | Alliance system |
| guilds / guild_members | Guild system |
| friends / friend_requests | Social system |
| messages | Player messages |
| npc_factions / npc_vendors | NPC factions |
| items / player_items | Item/inventory |
| player_currency / currency_transactions | 3-tier currency |
| bank_accounts / bank_transactions | Banking |
| achievements | Player achievements |
| weekly_mission_progress | Weekly missions |
| path_of_ascension | Tier progression |
| forum_threads / forum_replies | Forums |
| relics / relic_inventory | Relic system |
| universe_events / universe_bosses | Dynamic events |
| raids / raid_combats / raid_groups | Raid system |
| combat_stats | Combat statistics |
```
