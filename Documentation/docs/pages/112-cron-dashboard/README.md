# 112 - Cron Dashboard
- **Route:** `/cron-dashboard`
- **Page:** `client/src/pages/CronDashboard.tsx`
- **Routes:** `server/routes-cron.ts`
- **Services:** `server/services/cronService.ts`, `server/services/gameJobs.ts`
- **DB Tables:** `server_cron_jobs`, `server_cron_logs`, `server_game_ticks`, `server_timers`
- **Description:** Server-side cron job monitoring and game tick dashboard. Real-time job status, execution history, game tick logs.
- **Cron Jobs:** resource_tick (10s), turn_tick (15s), construction_tick (5s), daily_reset (24h), weekly_reset (7d), market_tick (15m), maintenance_tick (1h), refinery_tick (30s), anomaly_respawn (5m)
- **Key Features:** Job enable/disable, manual execution, log viewer, game tick history, timer management.
- **API:** `GET /api/cron/jobs`, `POST /api/cron/jobs/:id/toggle`, `POST /api/cron/jobs/:id/run`, `GET /api/cron/logs`, `GET /api/cron/ticks`
