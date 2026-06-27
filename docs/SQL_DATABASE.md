# SQL Files & Database Schema

## Connection
- **Driver:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Config:** `drizzle.config.ts` → schema at `./shared/schema.ts`

## Migration Commands
```bash
npx drizzle-kit generate    # Generate migration from schema changes
npx drizzle-kit push        # Push schema to database (interactive)
```

## Manual Migration Files
| File | Purpose |
|------|---------|
| `script/cron-migration.ts` | Creates cron_jobs, cron_logs, game_ticks, timers tables |
| `script/blueprint-migration.ts` | Creates blueprint_instances, printer_jobs, printer_levels tables |

## Key Tables by System

### Core
- `users` - Account (id, username, password_hash, email, is_admin)
- `sessions` - Auth sessions (sid, sess, expire)
- `player_states` - Game state blob (40+ columns, heavy JSONB usage)

### Empire
- `player_profiles` - Profile (6 attributes, 6 sub-attributes, 6 categories)
- `empire_profiles` - 9-attribute specialization (Military→Innovation)
- `empire_values` - Empire value tracking
- `empire_difficulties` - Kardashev difficulty progression

### Military
- `fleets` / `fleet_ships` - Space fleet system
- `armies` / `army_units` / `army_formations` - Ground army
- `troops` / `squads` - Individual RPG units
- `battles` / `battle_logs` - Combat records
- `combat_stats` - Combat statistics
- `equipment_durability` / `fleet_durability` / `building_durability` - Durability

### Research
- `research_areas` / `research_subcategories` / `research_technologies` - Tech tree
- `player_research_progress` - Per-technology progress

### Economy
- `market_orders` - Order book
- `auction_listings` / `auction_bids` - Auction house
- `trade_offers` / `trade_history` - Player trades
- `player_currency` / `currency_transactions` - 3-tier currency
- `bank_accounts` / `bank_transactions` - Banking
- `player_items` / `items` - Inventory
- `player_refineries` - 7 refinery types
- `resource_fields` - Resource extraction

### Blueprint
- `blueprint_instances` - Blueprint charge system (12 charges max)
- `blueprint_printer_jobs` - Printer job queue
- `blueprint_printer_levels` - Player printer level/XP

### Social
- `alliances` / `alliance_members` - Alliances
- `guilds` / `guild_members` - Guilds
- `friends` / `friend_requests` - Friends
- `messages` - Player messages
- `forum_threads` / `forum_replies` - Forums

### Exploration
- `expeditions` / `expedition_teams` / `expedition_encounters` - Expeditions
- `dimensional_anomalies` - 90 anomaly tracking
- `universe_events` / `universe_bosses` / `boss_encounters` - Dynamic events

### Progression
- `weekly_mission_progress` - Weekly missions
- `path_of_ascension` - 99-tier progression
- `achievements` - Player achievements
- `relics` / `relic_inventory` - Relic system

### System
- `server_cron_jobs` - Cron job definitions
- `server_cron_logs` - Cron execution history
- `server_game_ticks` - Game tick metrics
- `server_timers` - Timer definitions
- `system_settings` - Game configuration
- `admin_users` - Admin roles
