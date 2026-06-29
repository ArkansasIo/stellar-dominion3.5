# Cron Jobs - Quick Reference Guide

## Access

**Dashboard URL:** `https://your-server.com/cron-jobs-admin`

**Sidebar Path:** Admin Menu → Cron Job Management → Cron Jobs Dashboard

## All 50+ Jobs at a Glance

### Production & Resources (4)
| Job | Interval | Purpose |
|-----|----------|---------|
| `resource_tick` | 10s | Metal/crystal/deuterium production |
| `turn_tick` | 15s | Offline turn generation |
| `construction_tick` | 5s | Complete building constructions |
| `refinery_tick` | 30s | Process refinery production |

### Research (2)
| Job | Interval | Purpose |
|-----|----------|---------|
| `research_tick` | 5s | Advance active research |
| `research_xp_distribution` | 60s | Award research XP |

### Fleet & Combat (3)
| Job | Interval | Purpose |
|-----|----------|---------|
| `fleet_maintenance` | 10s | Fuel & durability |
| `mission_processing` | 8s | Complete missions |
| `expedition_tick` | 15s | Process expeditions |

### Economy (3)
| Job | Interval | Purpose |
|-----|----------|---------|
| `market_tick` | 15m | Update market prices |
| `resource_trading_settlement` | 20s | Finalize trades |
| `merchant_stock_refresh` | 5m | Refresh merchant inventory |

### Crafting (2)
| Job | Interval | Purpose |
|-----|----------|---------|
| `smithy_production` | 6s | Complete crafting |
| `blueprint_assembly` | 7s | Process blueprints |

### Defense (3)
| Job | Interval | Purpose |
|-----|----------|---------|
| `orbital_station_maintenance` | 12s | Station upgrades |
| `moon_operations` | 25s | Moon base processing |
| `spore_drive_cooldown` | 30s | Jump drive management |

### Events & Raids (4)
| Job | Interval | Purpose |
|-----|----------|---------|
| `anomaly_respawn` | 5m | Respawn anomalies |
| `raid_operations` | 20s | Process raids |
| `raid_rewards_distribution` | 60s | Distribute raid rewards |
| `mega_structure_operations` | 60s | Megastructure progression |

### Systems (5)
| Job | Interval | Purpose |
|-----|----------|---------|
| `government_progression` | 45s | Government tech |
| `civilization_effects` | 90s | Civilization bonuses |
| `commander_experience` | 30s | Commander XP |
| `alliance_treasury` | 5m | Alliance resources |
| `alliance_tech_sharing` | 10m | Alliance tech bonuses |

### Missions (4)
| Job | Interval | Purpose |
|-----|----------|---------|
| `daily_missions_reset` | 24h | Reset daily missions |
| `weekly_missions_reset` | 7d | Reset weekly missions |
| `season_pass_progression` | 3m | Battle pass XP |
| `achievement_checker` | 2m | Check achievements |

### Resets (3)
| Job | Interval | Purpose |
|-----|----------|---------|
| `daily_reset` | 24h | Daily bonuses & resets |
| `weekly_reset` | 7d | Weekly resets |
| `monthly_reset` | 30d | Monthly resets |

### Maintenance (6)
| Job | Interval | Purpose |
|-----|----------|---------|
| `maintenance_tick` | 1h | Clean logs & optimize |
| `inactive_player_warning` | 1h | Inactive notifications |
| `server_statistics` | 15m | Collect metrics |
| `backup_critical_data` | 24h | Backup database |
| `limited_event_processor` | 5m | Process events |
| `leaderboard_update` | 10m | Update rankings |

## Critical Jobs (Don't Disable!)

🔴 **Never disable these:**
- `resource_tick` - Players won't get resources
- `turn_tick` - Players won't get offline turns
- `construction_tick` - Buildings won't complete
- `daily_reset` - Login bonuses won't work
- `weekly_reset` - Weekly rewards won't work

## Emergency Actions

### Server Overload
```
1. Go to Jobs tab
2. Disable: leaderboard_update, server_statistics, limited_event_processor
3. Reduce batch size on heavy jobs
4. Run maintenance_tick manually
```

### Player Resources Not Updating
```
1. Check resource_tick log in Logs tab
2. If errors: Run resource_tick manually
3. Check turn_tick if offline turns missing
4. Run daily_reset if bonuses missing
```

### Database Too Large
```
1. Run maintenance_tick manually
2. Go to /admin/database
3. Run optimization query
4. Check cron logs are being cleaned
```

### Job Stuck/Failed
```
1. Find job in Jobs tab
2. Note the error in Logs tab
3. Check database logs
4. Disable and re-enable the job
5. Run manually to test
6. Contact support if persists
```

## Common Tweaks

### Reduce Server Load
Disable in this order:
1. `leaderboard_update` (rankings only)
2. `server_statistics` (metrics only)
3. `limited_event_processor` (events only)
4. `merchant_stock_refresh` (market only)

### Speed Up Player Updates
Run immediately:
1. `resource_tick`
2. `turn_tick`
3. `construction_tick`

### Fix Market
Run: `market_tick` → `merchant_stock_refresh`

### Fix Daily/Weekly Bonuses
Run: `daily_reset` → `daily_missions_reset` → `weekly_missions_reset`

## Performance Targets

### Healthy Values
- Most jobs: < 500ms duration
- Production jobs: < 1000ms
- Heavy jobs: < 2000ms
- Failed count: 0

### Warning Signs
- Jobs > 3000ms
- Consecutive failures > 2
- Resource_tick failing
- Database locks appearing

## Important Columns

| Column | What It Means |
|--------|---------------|
| **Enabled** | Job will run on schedule |
| **Type** | recurring/daily/weekly/one-shot |
| **Interval** | Time between runs (seconds) |
| **Run Count** | Total executions |
| **Failures** | Consecutive failures (red badge) |
| **Last Run** | When it last executed |
| **Duration** | How long last execution took |

## Dashboard Navigation

### Tabs Overview
- **Jobs** - View & control all jobs
- **Logs** - See execution history
- **Ticks** - Monitor game loop
- **Timers** - Manage scheduled events
- **Stats** - Performance overview

### Quick Filters
- Search by job name or ID
- Filter by: All / Enabled / Disabled / Failed
- Sort by any column

### Controls
- ⏸️ Toggle - Enable/disable job
- ▶️ Run Now - Execute immediately
- 📊 Stats - Performance metrics

## Troubleshooting Checklist

Job not working?
- [ ] Is it enabled in Jobs tab?
- [ ] Check Logs tab for errors
- [ ] Try running it manually
- [ ] Check database tables exist
- [ ] Check admin user permissions
- [ ] Check server logs
- [ ] Try restarting server

Poor performance?
- [ ] Check job durations in Stats
- [ ] Reduce batch sizes for heavy jobs
- [ ] Spread jobs with different intervals
- [ ] Run maintenance_tick
- [ ] Check database performance
- [ ] Review server resources

Players not getting updates?
- [ ] Enable resource_tick
- [ ] Enable turn_tick
- [ ] Enable daily/weekly resets
- [ ] Run these jobs manually
- [ ] Check database has player records
- [ ] Review error logs

## API Commands

### Get all jobs
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-server.com/api/cron/jobs
```

### Get recent logs
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-server.com/api/cron/logs?limit=50
```

### Toggle a job
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-server.com/api/cron/jobs/resource_tick/toggle
```

### Run a job now
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-server.com/api/cron/jobs/resource_tick/run
```

## Key Stats to Monitor

Daily:
- ✅ Failed job count (should be 0)
- ✅ Average job duration (< 1000ms)
- ✅ Server statistics (player count)

Weekly:
- ✅ Total jobs run count
- ✅ Success/failure ratio
- ✅ Performance trends

Monthly:
- ✅ Overall system health
- ✅ Database size growth
- ✅ Need for optimization

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| No resources appearing | Check resource_tick enabled + run manually |
| No turns for offline players | Check turn_tick enabled + run manually |
| Buildings not completing | Check construction_tick enabled + run manually |
| Market not updating | Run market_tick + merchant_stock_refresh |
| No daily bonuses | Check daily_reset enabled + run manually |
| Leaderboard wrong | Run leaderboard_update manually |
| Database slow | Run maintenance_tick + database optimize |
| Job fails repeatedly | Disable + Re-enable + Run manually |

## Pro Tips

1. **Test before modifying** - Use "Run Now" to test changes
2. **Monitor regularly** - Check dashboard at least once daily
3. **Keep backups** - Before major changes, backup database
4. **Document changes** - Note why you modified any jobs
5. **Use search** - Find jobs quickly with search bar
6. **Check logs first** - Always look at Logs tab for errors
7. **Stagger runs** - Don't run all heavy jobs simultaneously
8. **Archive old data** - Regularly clean old logs
9. **Set alerts** - Monitor job failures and duration

## Support Contact

For issues:
1. Check this quick reference first
2. Review admin guide at `/docs/pages/CRON_JOBS_ADMIN.md`
3. Check server logs
4. Contact system administrator

---

**Version:** 1.0  
**Last Updated:** 2024  
**Jobs Count:** 50+  
**Tables:** 6  
**API Endpoints:** 8
