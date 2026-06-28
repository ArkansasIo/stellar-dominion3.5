export interface CronJob {
  id: string;
  name: string;
  interval: number; // in milliseconds
  lastRun: number;
  enabled: boolean;
  type: "system" | "user" | "maintenance";
  description: string;
}

export const DEFAULT_CRON_JOBS: CronJob[] = [
  {
    id: "resource_tick",
    name: "Resource Production Tick",
    interval: 1000,
    lastRun: Date.now(),
    enabled: true,
    type: "system",
    description: "Calculates and adds resource production from mines."
  },
  {
    id: "daily_reset",
    name: "Daily Server Reset",
    interval: 86400000, // 24h
    lastRun: Date.now(),
    enabled: true,
    type: "maintenance",
    description: "Resets daily limits, login bonuses, and clears temp caches."
  },
  {
    id: "auto_mine",
    name: "Automated Mining Protocol",
    interval: 60000, // 1m
    lastRun: Date.now(),
    enabled: false,
    type: "user",
    description: "Automatically collects debris fields in local system (Requires AI Tech)."
  },
  {
    id: "fleet_maintenance",
    name: "Fleet Maintenance Check",
    interval: 3600000, // 1h
    lastRun: Date.now(),
    enabled: true,
    type: "system",
    description: "Deducts fleet upkeep costs and checks for mutiny."
  },
  {
    id: "market_update",
    name: "Galactic Market Refresh",
    interval: 900000, // 15m
    lastRun: Date.now(),
    enabled: true,
    type: "system",
    description: "Updates trade route prices based on supply and demand."
  }
];
