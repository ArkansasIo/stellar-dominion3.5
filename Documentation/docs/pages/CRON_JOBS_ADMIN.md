# Cron Jobs Administration Guide

## Overview

The Cron Jobs Admin Dashboard provides comprehensive management of all server-side scheduled jobs and game automation systems. This includes resource production, research progression, fleet maintenance, trading systems, events processing, and much more.

## Accessing the Dashboard

Navigate to **`/cron-jobs-admin`** in your browser (admin access required).

Alternative access paths through the admin panel:
- Admin Menu → Cron Job Management → Cron Jobs Dashboard
- Or click on any specific job category from the admin sidebar

## Dashboard Tabs

### 1. Jobs Tab

The Jobs tab displays all registered cron jobs organized by category.

#### Job Categories

- **Core Production**: Resource production, turn generation, construction, refinery
- **Research**: Research advancement and XP distribution
- **Fleet & Combat**: Fleet maintenance and mission processing
- **Economy & Trading**: Market price updates and resource trading settlement
- **Crafting & Production**: Smithy production and blueprint assembly
- **Defense Systems**: Orbital stations and moon operations
- **Special Events**: Anomaly respawning, raids, megastructures
- **Government & Systems**: Government progression, civilization effects, commanders
- **Missions & Achievements**: Daily/weekly mission resets and achievement checking
- **Reset Jobs**: Daily, weekly, and monthly system resets
- **Maintenance & Cleanup**: Server maintenance, inactive player warnings, statistics

#### Job Information Displayed

| Column | Description |
|--------|-------------|
| **Job Name** | Display name and unique ID |
| **Status** | Enabled/Disabled + failure count |
| **Type** | recurring, daily, weekly, one-shot |
| **Interval** | Time between executions (seconds) |
| **Last Run** | Timestamp of last execution |
| **Run Count** | Total number of times executed |
| **Actions** | Toggle/Run buttons |

#### Job Controls

- **Toggle Button**: Enable/Disable a job without affecting others
- **Run Button**: Execute a job immediately (useful for testing or catch-up)

#### Filtering & Searching

- **Search Bar**: Filter by job name or ID
- **Status Filter**: View all, enabled only, disabled only, or failed jobs

### 2. Logs Tab

View detailed execution history of all cron jobs.

#### Log Information

| Column | Description |
|--------|-------------|
| **Job** | Name of the executed job |
| **Status** | success or failure |
| **Started** | Execution start time |
| **Duration** | How long the job took (milliseconds) |
| **Details** | Output data or error message |

**Default Display**: Last 50 executions, refreshed every 10 seconds

### 3. Ticks Tab

Monitor game tick progression (core game loop updates).

#### Game Tick Types

- **resource**: Resource production processing
- **turns**: Turn generation for offline players
- **construction**: Building/unit completion
- **research**: Research progression advancement
- **market**: Market price fluctuations
- **refinery**: Refinery production
- **fleet_maintenance**: Fleet fuel/durability updates
- **mission_processing**: Mission completion and rewards
- **expedition**: Expedition progress
- **smithy_production**: Crafting job completion
- **blueprint_assembly**: Blueprint assembly progression
- **orbital_maintenance**: Orbital station updates
- **moon_operations**: Moon base processing
- **spore_drive**: Jump drive cooldown management
- **raid_operations**: Active raid processing
- **raid_rewards**: Raid reward distribution
- **megastructure**: Megastructure progression
- **government_progression**: Government tech advancement
- **civilization_effects**: Civilization bonuses
- **commander_experience**: Commander XP and leveling
- **alliance_treasury**: Alliance resource management
- **alliance_tech**: Technology sharing
- **daily_reset**: Daily reset tasks
- **weekly_reset**: Weekly reset tasks
- **monthly_reset**: Monthly reset tasks
- **season_pass**: Battle pass progression
- **achievement_check**: Achievement progress evaluation
- **server_stats**: Server statistics collection
- **backup**: Critical data backup

#### Tick Details

| Column | Description |
|--------|-------------|
| **Tick Type** | Category of game tick |
| **Started** | Execution timestamp |
| **Duration** | Processing time (ms) |
| **Records Processed** | Number of player records processed |
| **Records Affected** | Number of records changed |

### 4. Timers Tab

View active timers and scheduled custom events.

#### Timer Information

| Column | Description |
|--------|-------------|
| **Job ID** | Associated cron job identifier |
| **Created** | When the timer was set |
| **Expires** | When the timer fires |
| **Metadata** | Custom timer parameters |

### 5. Stats Tab

**Key Metrics:**
- Total cron jobs registered
- Number of enabled jobs
- Failed jobs requiring attention
- Active timer count

**Job Performance Summary:**
- Top 10 most frequently executed jobs
- Execution count and last duration

## Common Tasks

### Enable/Disable a Job

1. Navigate to **Jobs tab**
2. Find the job in the appropriate category
3. Click the **toggle button** (play/pause icon)
4. Job status updates immediately

### Run a Job Immediately

1. Navigate to **Jobs tab**
2. Find the job to run
3. Click the **play button** in the Actions column
4. Job executes immediately (monitored in Logs tab)

### Check Job Execution History

1. Go to **Logs tab**
2. Filter by job name if desired
3. View execution details including duration and output

### Monitor Game Performance

1. Check **Ticks tab** for core game processing
2. Look for unusually long durations (> 1000ms)
3. Check **Stats tab** for overall system health

### Investigate Failed Jobs

1. Go to **Jobs tab**
2. Filter by **Failed** status
3. Click the job to see consecutive failures
4. Check **Logs tab** for detailed error messages

## Game Job Details

### Core Production Jobs

**resource_tick** (10 seconds)
- Calculates production from buildings (metal, crystal, deuterium)
- Updates player resources
- Accounts for energy consumption

**turn_tick** (15 seconds)
- Generates offline turns for players
- Applies streak bonuses
- Caps at 8640 offline turns maximum

**construction_tick** (5 seconds)
- Completes building/unit constructions when timer expires
- Updates building levels
- Processes construction queue

**refinery_tick** (30 seconds)
- Processes active refinery production
- Distributes refined resources

### Research & Development

**research_tick** (5 seconds)
- Advances active research projects
- Completes research when progress reaches 100%
- Moves queue items to active

**research_xp_distribution** (60 seconds)
- Awards XP to active researchers
- Handles discovery bonuses
- Processes research streak multipliers

### Fleet & Combat

**fleet_maintenance** (10 seconds)
- Deducts fuel consumption from active fleets
- Updates fleet durability
- Manages fleet status

**mission_processing** (8 seconds)
- Completes missions when timers expire
- Distributes mission rewards
- Updates player state from mission results

**expedition_tick** (15 seconds)
- Processes active expeditions
- Triggers random encounters
- Awards expedition rewards

### Economy & Trading

**market_tick** (15 minutes)
- Updates market prices based on volatility
- Applies supply/demand changes
- Updates merchant inventory

**resource_trading_settlement** (20 seconds)
- Finalizes completed trades
- Transfers resources between players
- Logs trading history

**merchant_stock_refresh** (5 minutes)
- Refreshes merchant inventory
- Updates available items for sale
- Applies market fluctuations to prices

### Crafting & Production

**smithy_production** (6 seconds)
- Completes crafting jobs in player smithies
- Adds crafted items to inventory
- Processes crafting queue

**blueprint_assembly** (7 seconds)
- Advances blueprint assembly progress
- Completes ready blueprints
- Updates player inventory

### Defense & Orbital Systems

**orbital_station_maintenance** (12 seconds)
- Updates orbital station status
- Processes defense upgrades
- Manages power consumption

**moon_operations** (25 seconds)
- Processes moon base operations
- Updates moon resource production
- Handles moon construction

**spore_drive_cooldown** (30 seconds)
- Manages jump drive cooldown timers
- Processes spore drive upgrades
- Handles dimension jumping

### Special Events

**anomaly_respawn** (5 minutes)
- Respawns dimensional anomalies after cooldown
- Updates anomaly status

**raid_operations** (20 seconds)
- Updates active raid boss health
- Processes raid damage
- Manages raid progression

**raid_rewards_distribution** (60 seconds)
- Distributes rewards to raid participants
- Updates player achievement progress
- Logs raid completions

**mega_structure_operations** (60 seconds)
- Manages megastructure construction
- Updates planetary effects
- Handles structure upgrades

### Government & Civilization

**government_progression** (45 seconds)
- Advances government technology trees
- Applies government bonuses
- Updates government effects

**civilization_effects** (90 seconds)
- Applies civilization bonuses to players
- Updates regional effects
- Handles civilization progression

**commander_experience** (30 seconds)
- Awards commander XP
- Handles commander leveling
- Updates commander abilities

**alliance_treasury** (5 minutes)
- Processes alliance resource deposits/withdrawals
- Applies treasury interest
- Logs financial transactions

**alliance_tech_sharing** (10 minutes)
- Updates shared research bonuses
- Applies alliance bonuses
- Synchronizes tech upgrades

### Missions & Achievements

**daily_missions_reset** (Daily, 00:00 UTC)
- Resets daily mission progress
- Distributes new daily objectives
- Clears daily counters

**weekly_missions_reset** (Weekly, Monday 00:00 UTC)
- Resets weekly mission objectives
- Distributes new weekly challenges
- Processes weekly rewards

**season_pass_progression** (3 minutes)
- Awards battle pass XP to active players
- Handles tier advancement
- Processes premium rewards

**achievement_checker** (2 minutes)
- Evaluates player progress against achievement criteria
- Unlocks achievements when conditions met
- Awards achievement rewards

### Daily/Weekly/Monthly Resets

**daily_reset** (Daily, 00:00 UTC)
- Grants login bonuses (credits, metal)
- Resets daily activity limits
- Updates daily quest availability

**weekly_reset** (Weekly, Monday 00:00 UTC)
- Resets weekly mission completion
- Refreshes market with new prices
- Processes weekly rewards

**monthly_reset** (Monthly, 1st at 00:00 UTC)
- Resets monthly rankings
- Archives monthly statistics
- Refreshes monthly special events

### Maintenance & Cleanup

**maintenance_tick** (1 hour)
- Deletes old cron logs (>7 days)
- Cleans expired game ticks
- Removes expired sessions

**inactive_player_warning** (1 hour)
- Sends warnings to inactive players (>7 days)
- Manages vacation mode notifications
- Prepares account deletion reminders

**server_statistics** (15 minutes)
- Collects server performance metrics
- Updates player activity statistics
- Generates performance reports

**backup_critical_data** (Daily, 03:00 UTC)
- Creates database backups
- Archives critical game data
- Maintains 30-day backup retention

**limited_event_processor** (5 minutes)
- Processes timed limited events
- Distributes time-based event rewards
- Updates event progress

**leaderboard_update** (10 minutes)
- Updates game leaderboards
- Ranks players by empire level, resources, military power, etc.
- Archives historical rankings

## Performance Tuning

### Monitoring Job Performance

1. **Check average duration**: Look for jobs consistently exceeding 1000ms
2. **Monitor failure rate**: Track consecutive failures in the Stats tab
3. **Review tick history**: Compare historical performance in Ticks tab

### Optimization Strategies

- **Reduce batch size**: Lower `maxPlayersPerTick` parameter for CPU-heavy jobs
- **Increase interval**: Spread out non-critical jobs to reduce load
- **Disable debug jobs**: Turn off statistics collection during peak hours
- **Optimize database**: Add indices for frequently queried columns

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Job fails consistently | Check error logs, reduce batch size, run database optimization |
| High CPU usage | Reduce concurrent jobs, increase intervals, disable non-essential jobs |
| Database locks | Check for long-running queries, reduce batch sizes |
| Memory issues | Lower `maxPlayersPerTick`, increase job intervals |

## API Endpoints (Admin Only)

All cron endpoints require authentication and admin privileges.

### Get All Jobs
```
GET /api/cron/jobs
Response: { success: true, jobs: CronJob[] }
```

### Get Job Logs
```
GET /api/cron/logs?limit=50
Response: { success: true, logs: CronLog[] }
```

### Get Game Ticks
```
GET /api/cron/ticks?limit=20
Response: { success: true, ticks: GameTick[] }
```

### Get Timers
```
GET /api/cron/timers
Response: { success: true, timers: CronTimer[] }
```

### Toggle Job
```
POST /api/cron/jobs/:jobId/toggle
Response: { success: true, enabled: boolean }
```

### Run Job Immediately
```
POST /api/cron/jobs/:jobId/run
Response: { success: true, jobId: string, status: string }
```

### Create Custom Timer
```
POST /api/cron/timers
Body: { jobId: string, expiresAt: Date, metadata?: object }
Response: { success: true, timerId: string }
```

### Delete Timer
```
DELETE /api/cron/timers/:timerId
Response: { success: true }
```

## Best Practices

1. **Don't disable critical jobs**: Core production and reset jobs are essential
2. **Test before going live**: Use "Run Now" to test job behavior
3. **Monitor regularly**: Check Stats tab at least daily
4. **Keep logs**: Don't delete cron logs without backing up data
5. **Stagger jobs**: Avoid running too many intensive jobs simultaneously
6. **Document changes**: Keep notes of job modifications for troubleshooting
7. **Review failed jobs**: Investigate failures immediately to prevent cascade issues

## Emergency Procedures

### Server Overload

If the server is experiencing high CPU/memory usage:

1. Go to Jobs tab
2. Disable non-critical jobs (events, analytics, leaderboards)
3. Reduce batch sizes for heavy jobs
4. Run maintenance job to clean up logs
5. Restart server if needed

### Missing Player Updates

If players report missing resources or progress:

1. Check resource_tick and turn_tick logs
2. Verify jobs are enabled and running successfully
3. Run resource_tick immediately
4. Check database for consistency issues
5. Restore from backup if data corruption detected

### Database Performance Issues

If database queries are slow:

1. Check maintenance_tick is running
2. Run database optimization manually
3. Reduce batch sizes for data-heavy jobs
4. Check for blocking transactions in logs
5. Consider disabling non-essential jobs temporarily

## Support & Troubleshooting

For issues with cron jobs:

1. Check the Logs tab for specific error messages
2. Review job parameters and adjust if needed
3. Check server console for system errors
4. Review database performance metrics
5. Contact system administrator if persisting

---

**Last Updated**: 2024
**Version**: 1.0 (Comprehensive Cron System)
