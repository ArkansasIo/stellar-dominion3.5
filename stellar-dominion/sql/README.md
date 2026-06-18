# Stellar Dominion Database Schema

This directory contains all SQL schema and seed data files for the Stellar Dominion game database.

## Directory Structure

```
sql/
├── schema/
│   ├── universe.sql    # Celestial objects (galaxies, stars, planets, moons, asteroids)
│   ├── game.sql        # Game configuration, combat balance, technology tree
│   ├── system.sql      # Server settings, admin tools, maintenance
│   └── README.md       # This file
├── seeds/
│   ├── universe-seed.sql # Initial universe configuration data
│   ├── game-seed.sql     # Game balance and technology tree seed data
│   └── game-seed.sql     # System settings seed data
└── README.md
```

## Schema Files

### universe.sql
Defines the structure for the procedurally generated universe:
- **galaxies** - Galaxy definitions
- **stars** - Star objects with properties (type, temperature, mass, etc.)
- **planets** - Planetary bodies with colonization support
- **moons** - Lunar bodies around planets
- **asteroids** - Asteroid fields with resources
- **space_anomalies** - Black holes, wormholes, supernovae, etc.

Uses deterministic hashing based on coordinates to generate consistent universe.

### game.sql
Game balance and configuration tables:
- **game_config** - Key-value configuration storage
- **resource_costs** - Building, unit, and technology costs
- **technology_tree** - Technology progression system
- **combat_balance** - Unit stats and combat mechanics
- **weapon_types** - Weapon definitions and effectiveness
- **armor_types** - Armor and defense mechanics
- **building_info** - Building production rates and multipliers
- **leaderboard_cache** - Player rankings by category
- **achievement_definitions** - Achievement system
- **player_achievements** - Player achievement tracking
- **game_events_log** - Event logging for audits

### system.sql
Server and maintenance infrastructure:
- **system_settings** - Server configuration parameters
- **server_status** - Current server status and maintenance windows
- **admin_logs** - Administrator action auditing
- **player_bans** - Player ban system
- **server_metrics** - Performance monitoring
- **database_maintenance_log** - Backup and maintenance tracking
- **rate_limit_rules** - API rate limiting configuration
- **feature_flags** - Feature rollout management
- **scheduled_tasks** - Cron job definitions
- **error_tracking** - Error aggregation and resolution
- **api_keys** - Third-party API key management

## Seed Data

### universe-seed.sql
Initializes:
- Base galaxies (Nexus-Alpha, Omega-Sector, Vortex-Prime)
- Resource cost definitions for all buildings and units
- Building production info
- Combat unit balance
- Weapon and armor types
- Game configuration defaults
- Feature flags

### game-seed.sql
Initializes:
- Technology tree with progression paths
- Achievement definitions
- Rate limiting rules
- System settings and configuration parameters

## Usage

### Initial Setup
```bash
# Apply schema to database (using Drizzle)
npm run db:push

# Or manually execute (if using raw SQL):
psql $DATABASE_URL < sql/schema/universe.sql
psql $DATABASE_URL < sql/schema/game.sql
psql $DATABASE_URL < sql/schema/system.sql
```

### Seeding Data
```bash
# Load initial configuration and balance data
psql $DATABASE_URL < sql/seeds/universe-seed.sql
psql $DATABASE_URL < sql/seeds/game-seed.sql
```

## Key Design Patterns

### Deterministic Universe
- Celestial objects are generated from coordinate hashing
- Same coordinates always produce identical objects
- No centralized star catalog needed - generated on-demand

### Denormalized Configuration
- Game balance settings stored in database (not code)
- Allows hot-patching without redeploy
- Enables A/B testing and gradual rollouts

### Event-Driven Architecture
- All significant events logged to `game_events_log`
- Supports audit trails and analytics
- Enables replay and debugging

### Multi-Tenant Support
- All tables include user/player IDs for isolation
- Supports multiple concurrent games on same database
- Cascade deletes ensure data consistency

## Performance Considerations

### Indexes
All tables include optimized indexes for:
- Player queries (by user_id)
- Coordinate lookups (galaxy, star, planet systems)
- Time-based queries (event logs, metrics)
- Leaderboard queries (by rank)

### JSONB Fields
Used for flexible data storage:
- Unit configurations
- Tech bonuses
- Combat effectiveness matrices
- Resource compositions

Benefits:
- Avoids schema changes for new properties
- Efficient querying with `@>` operators
- Supports complex nested structures

## Maintenance

### Backup Strategy
- Daily backups at 02:00 UTC
- 30-day retention policy
- Separate backup storage

### Optimization Tasks
- Weekly VACUUM and ANALYZE
- Monthly index optimization
- Quarterly cleanup of stale data

### Monitoring
- Server metrics tracked in `server_metrics`
- Error aggregation in `error_tracking`
- Performance monitoring via metrics dashboard

## Configuration Management

All sensitive configuration should use environment variables:
```typescript
// Example: Using SYSTEM_CONFIG from shared/config/systemConfig.ts
import { SYSTEM_CONFIG } from '@shared/config';

const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.STRIPE_SECRET_KEY;
```

Never commit secrets to the repository. Use `.env` files locally and environment variables in production.
