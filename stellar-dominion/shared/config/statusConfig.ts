/**
 * Server Status & Health Check Configuration
 * Monitors system resources and server health
 */

export interface HealthCheckResult {
  timestamp: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: HealthStatus;
    memory: HealthStatus;
    cpu: HealthStatus;
    diskSpace: HealthStatus;
    api: HealthStatus;
    cache: HealthStatus;
    websocket: HealthStatus;
  };
  overallScore: number; // 0-100
}

export interface HealthStatus {
  status: 'ok' | 'warning' | 'critical';
  value: number;
  threshold: number;
  message: string;
  lastChecked: number;
}

export interface ServerStatusInfo {
  id: string;
  name: string;
  environment: string;
  version: string;
  uptime: number; // milliseconds
  startTime: number; // timestamp
  status: 'online' | 'degraded' | 'maintenance' | 'offline';
  region: string;
  hostname: string;
}

export interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number; // ms
  p95ResponseTime: number; // ms
  p99ResponseTime: number; // ms
  requestsPerSecond: number;
  lastHourRequests: number;
  lastDayRequests: number;
}

export interface DatabaseMetrics {
  connections: number;
  maxConnections: number;
  activeQueries: number;
  slowQueries: number;
  queryQueueSize: number;
  cacheHitRate: number; // percentage
  cacheSize: string;
  tableCount: number;
  totalDataSize: string;
  lastBackupTime: number; // timestamp
}

export interface MemoryMetrics {
  used: number; // MB
  total: number; // MB
  free: number; // MB
  usage: number; // percentage
  heapUsed: number; // MB
  heapTotal: number; // MB
  external: number; // MB
  gc: {
    count: number;
    duration: number; // ms
  };
}

export interface CPUMetrics {
  usage: number; // percentage
  userTime: number; // ms
  systemTime: number; // ms
  uptime: number; // seconds
  loadAverage: {
    oneMinute: number;
    fiveMinute: number;
    fifteenMinute: number;
  };
}

export interface DisksMetrics {
  used: number; // GB
  total: number; // GB
  free: number; // GB
  usage: number; // percentage
  inodesUsed: number;
  inodesTotal: number;
}

export interface SystemMetricsSnapshot {
  timestamp: number;
  requests: RequestMetrics;
  database: DatabaseMetrics;
  memory: MemoryMetrics;
  cpu: CPUMetrics;
  disk: DisksMetrics;
  healthCheck: HealthCheckResult;
}

// Health Check Thresholds
export const HEALTH_CHECK_THRESHOLDS = {
  database: {
    connectionUsageWarning: 75, // percentage
    connectionUsageCritical: 90,
    queryTimeWarning: 1000, // ms
    queryTimeCritical: 5000,
    slowQueryWarning: 10, // count
    slowQueryCritical: 50,
  },
  memory: {
    usageWarning: 70, // percentage
    usageCritical: 90,
    heapUsageWarning: 75,
    heapUsageCritical: 85,
  },
  cpu: {
    usageWarning: 60, // percentage
    usageCritical: 85,
    loadAverageWarning: 2.0,
    loadAverageCritical: 4.0,
  },
  disk: {
    usageWarning: 70, // percentage
    usageCritical: 90,
    inodesWarning: 75,
    inodesCritical: 90,
  },
  api: {
    errorRateWarning: 1, // percentage
    errorRateCritical: 5,
    responseTimeWarning: 500, // ms
    responseTimeCritical: 2000,
  },
};

// Health Check Configuration
export const HEALTH_CHECK_CONFIG = {
  interval: 5000, // milliseconds
  timeout: 10000, // milliseconds
  retries: 3,
  includedChecks: [
    'database',
    'memory',
    'cpu',
    'diskSpace',
    'api',
    'cache',
    'websocket',
  ],
};

// Performance Monitoring Intervals
export const MONITORING_INTERVALS = {
  requestMetrics: 1000, // 1 second
  databaseMetrics: 5000, // 5 seconds
  systemMetrics: 10000, // 10 seconds
  healthCheck: 30000, // 30 seconds
  archiveMetrics: 3600000, // 1 hour
};

// Alerts Configuration
export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: {
    metric: string;
    operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
    value: number;
    duration: number; // milliseconds
  };
  severity: 'info' | 'warning' | 'critical';
  notificationChannels: string[]; // 'email', 'slack', 'webhook', 'dashboard'
  cooldownPeriod: number; // milliseconds
}

export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'high-memory-usage',
    name: 'High Memory Usage',
    enabled: true,
    condition: {
      metric: 'memory.usage',
      operator: '>',
      value: 90,
      duration: 60000, // 1 minute
    },
    severity: 'critical',
    notificationChannels: ['email', 'dashboard'],
    cooldownPeriod: 300000, // 5 minutes
  },
  {
    id: 'high-cpu-usage',
    name: 'High CPU Usage',
    enabled: true,
    condition: {
      metric: 'cpu.usage',
      operator: '>',
      value: 85,
      duration: 60000,
    },
    severity: 'warning',
    notificationChannels: ['email', 'dashboard'],
    cooldownPeriod: 300000,
  },
  {
    id: 'database-slow-queries',
    name: 'Slow Database Queries',
    enabled: true,
    condition: {
      metric: 'database.slowQueries',
      operator: '>',
      value: 50,
      duration: 300000,
    },
    severity: 'warning',
    notificationChannels: ['dashboard'],
    cooldownPeriod: 600000,
  },
  {
    id: 'high-api-errors',
    name: 'High API Error Rate',
    enabled: true,
    condition: {
      metric: 'requests.errorRate',
      operator: '>',
      value: 5,
      duration: 120000,
    },
    severity: 'critical',
    notificationChannels: ['email', 'dashboard'],
    cooldownPeriod: 300000,
  },
  {
    id: 'disk-space-low',
    name: 'Low Disk Space',
    enabled: true,
    condition: {
      metric: 'disk.usage',
      operator: '>',
      value: 90,
      duration: 0,
    },
    severity: 'critical',
    notificationChannels: ['email', 'dashboard'],
    cooldownPeriod: 3600000,
  },
];
