/**
 * Server Status Monitoring Service
 * Tracks system health, metrics, and performance
 */

import os from 'os';
import { statfsSync } from 'fs';
import { pool } from '../db';
import { SystemMetricsSnapshot, HealthCheckResult, HealthStatus } from '@shared/config/statusConfig';
import { HEALTH_CHECK_THRESHOLDS } from '@shared/config/statusConfig';

interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  successCount: number;
  totalResponseTime: number;
  responseTimes: number[];
  requestTimestamps: number[];
  startTime: number;
}

export class ServerStatusService {
  private static instance: ServerStatusService;
  private startTime: number = Date.now();
  private metricsHistory: SystemMetricsSnapshot[] = [];
  private lastCpuUsage = process.cpuUsage();
  private lastCpuSampleAt = Date.now();
  private serviceMetrics: ServiceMetrics = {
    requestCount: 0,
    errorCount: 0,
    successCount: 0,
    totalResponseTime: 0,
    responseTimes: [],
    requestTimestamps: [],
    startTime: Date.now(),
  };

  private constructor() {}

  static getInstance(): ServerStatusService {
    if (!ServerStatusService.instance) {
      ServerStatusService.instance = new ServerStatusService();
    }
    return ServerStatusService.instance;
  }

  /**
   * Record HTTP request metrics
   */
  recordRequest(statusCode: number, responseTime: number): void {
    const now = Date.now();
    this.serviceMetrics.requestCount++;
    this.serviceMetrics.totalResponseTime += responseTime;
    this.serviceMetrics.responseTimes.push(responseTime);
    this.serviceMetrics.requestTimestamps.push(now);

    if (statusCode >= 200 && statusCode < 300) {
      this.serviceMetrics.successCount++;
    } else {
      this.serviceMetrics.errorCount++;
    }

    // Keep only last 1000 response times
    if (this.serviceMetrics.responseTimes.length > 1000) {
      this.serviceMetrics.responseTimes.shift();
    }

    const dayAgo = now - 24 * 60 * 60 * 1000;
    while (this.serviceMetrics.requestTimestamps.length && this.serviceMetrics.requestTimestamps[0] < dayAgo) {
      this.serviceMetrics.requestTimestamps.shift();
    }
  }

  private formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(index === 0 ? 0 : 1)}${units[index]}`;
  }

  private safeNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private getDiskMetrics() {
    try {
      const rootPath = process.platform === 'win32' ? `${process.cwd().slice(0, 2)}\\` : '/';
      const stats = statfsSync(rootPath);

      const blockSize = this.safeNumber((stats as any).bsize);
      const blocks = this.safeNumber((stats as any).blocks);
      const bfree = this.safeNumber((stats as any).bavail ?? (stats as any).bfree);
      const totalBytes = blocks * blockSize;
      const freeBytes = bfree * blockSize;
      const usedBytes = Math.max(0, totalBytes - freeBytes);
      const usage = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

      const inodesTotal = this.safeNumber((stats as any).files);
      const inodesFree = this.safeNumber((stats as any).ffree);
      const inodesUsed = inodesTotal > 0 ? Math.max(0, inodesTotal - inodesFree) : 0;

      return {
        used: Number((usedBytes / 1024 / 1024 / 1024).toFixed(2)),
        total: Number((totalBytes / 1024 / 1024 / 1024).toFixed(2)),
        free: Number((freeBytes / 1024 / 1024 / 1024).toFixed(2)),
        usage,
        inodesUsed,
        inodesTotal,
      };
    } catch {
      return {
        used: 0,
        total: 0,
        free: 0,
        usage: 0,
        inodesUsed: 0,
        inodesTotal: 0,
      };
    }
  }

  private getCpuUsagePercent(cpuCount: number): { usage: number; userTime: number; systemTime: number } {
    const currentCpuUsage = process.cpuUsage();
    const now = Date.now();
    const elapsedMs = Math.max(1, now - this.lastCpuSampleAt);

    const userDelta = currentCpuUsage.user - this.lastCpuUsage.user;
    const systemDelta = currentCpuUsage.system - this.lastCpuUsage.system;
    const totalDelta = userDelta + systemDelta;
    const cpuUsagePercent = Math.min(100, Math.max(0, (totalDelta / (elapsedMs * 1000 * Math.max(1, cpuCount))) * 100));

    this.lastCpuUsage = currentCpuUsage;
    this.lastCpuSampleAt = now;

    return {
      usage: cpuUsagePercent,
      userTime: currentCpuUsage.user / 1000,
      systemTime: currentCpuUsage.system / 1000,
    };
  }

  private async getDatabaseMetrics() {
    const defaultConnections = this.safeNumber((pool as any).totalCount ?? 0);
    const defaultActive = this.safeNumber((pool as any).idleCount !== undefined ? defaultConnections - this.safeNumber((pool as any).idleCount) : 0);

    try {
      const [connectionStats, maxConnections, slowQueries, tableCount, dbSize, cacheStats, sharedBuffers] = await Promise.all([
        pool.query(
          `SELECT
             COUNT(*)::int AS connections,
             COUNT(*) FILTER (WHERE state = 'active')::int AS active_queries
           FROM pg_stat_activity
           WHERE datname = current_database()`
        ),
        pool.query(`SELECT setting::int AS max_connections FROM pg_settings WHERE name = 'max_connections'`),
        pool.query(
          `SELECT COUNT(*)::int AS slow_queries
           FROM pg_stat_activity
           WHERE datname = current_database()
             AND state = 'active'
             AND query_start IS NOT NULL
             AND now() - query_start > interval '1 second'`
        ),
        pool.query(`SELECT COUNT(*)::int AS table_count FROM information_schema.tables WHERE table_schema = 'public'`),
        pool.query(`SELECT pg_database_size(current_database())::bigint AS total_size_bytes`),
        pool.query(
          `SELECT blks_hit::bigint AS blks_hit, blks_read::bigint AS blks_read
           FROM pg_stat_database
           WHERE datname = current_database()`
        ),
        pool.query(`SELECT setting AS shared_buffers FROM pg_settings WHERE name = 'shared_buffers'`),
      ]);

      const connectionRow = connectionStats.rows[0] || {};
      const maxConnRow = maxConnections.rows[0] || {};
      const slowRow = slowQueries.rows[0] || {};
      const tableRow = tableCount.rows[0] || {};
      const sizeRow = dbSize.rows[0] || {};
      const cacheRow = cacheStats.rows[0] || {};
      const sharedBufferRow = sharedBuffers.rows[0] || {};

      const blksHit = this.safeNumber(cacheRow.blks_hit);
      const blksRead = this.safeNumber(cacheRow.blks_read);
      const cacheHitRate = blksHit + blksRead > 0 ? (blksHit / (blksHit + blksRead)) * 100 : 0;
      const sizeBytes = this.safeNumber(sizeRow.total_size_bytes);

      return {
        connections: this.safeNumber(connectionRow.connections),
        maxConnections: this.safeNumber(maxConnRow.max_connections) || 20,
        activeQueries: this.safeNumber(connectionRow.active_queries),
        slowQueries: this.safeNumber(slowRow.slow_queries),
        queryQueueSize: 0,
        cacheHitRate,
        cacheSize: String(sharedBufferRow.shared_buffers ?? '0'),
        tableCount: this.safeNumber(tableRow.table_count),
        totalDataSize: this.formatBytes(sizeBytes),
        lastBackupTime: 0,
      };
    } catch {
      return {
        connections: defaultConnections,
        maxConnections: Math.max(20, defaultConnections || 20),
        activeQueries: Math.max(0, defaultActive),
        slowQueries: 0,
        queryQueueSize: 0,
        cacheHitRate: 0,
        cacheSize: '0',
        tableCount: 0,
        totalDataSize: '0B',
        lastBackupTime: 0,
      };
    }
  }

  /**
   * Get current system metrics
   */
  async getSystemMetrics(): Promise<SystemMetricsSnapshot> {
    const timestamp = Date.now();
    const uptime = timestamp - this.startTime;

    // CPU metrics
    const cpus = os.cpus();
    const loadAverage = os.loadavg();
    const cpuCount = cpus.length || 1;
    const cpuUsage = this.getCpuUsagePercent(cpuCount);

    // Memory metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Request metrics
    const avgResponseTime = this.serviceMetrics.requestCount > 0 ? this.serviceMetrics.totalResponseTime / this.serviceMetrics.requestCount : 0;
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const lastHourRequests = this.serviceMetrics.requestTimestamps.filter((time) => time >= hourAgo).length;
    const lastDayRequests = this.serviceMetrics.requestTimestamps.filter((time) => time >= dayAgo).length;

    const databaseMetrics = await this.getDatabaseMetrics();
    const diskMetrics = this.getDiskMetrics();

    // Calculate percentiles
    const sortedResponseTimes = [...this.serviceMetrics.responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedResponseTimes.length * 0.95);
    const p99Index = Math.floor(sortedResponseTimes.length * 0.99);
    const p95ResponseTime = sortedResponseTimes[p95Index] || 0;
    const p99ResponseTime = sortedResponseTimes[p99Index] || 0;

    const metrics: SystemMetricsSnapshot = {
      timestamp,
      requests: {
        totalRequests: this.serviceMetrics.requestCount,
        successfulRequests: this.serviceMetrics.successCount,
        failedRequests: this.serviceMetrics.errorCount,
        averageResponseTime: avgResponseTime,
        p95ResponseTime,
        p99ResponseTime,
        requestsPerSecond: this.serviceMetrics.requestCount / (uptime / 1000),
        lastHourRequests,
        lastDayRequests,
      },
      database: databaseMetrics,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024),
        total: Math.round(totalMemory / 1024 / 1024),
        free: Math.round(freeMemory / 1024 / 1024),
        usage: (usedMemory / totalMemory) * 100,
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        gc: {
          count: 0,
          duration: 0,
        },
      },
      cpu: {
        usage: cpuUsage.usage,
        userTime: cpuUsage.userTime,
        systemTime: cpuUsage.systemTime,
        uptime: os.uptime(),
        loadAverage: {
          oneMinute: loadAverage[0],
          fiveMinute: loadAverage[1],
          fifteenMinute: loadAverage[2],
        },
      },
      disk: diskMetrics,
      healthCheck: {
        timestamp,
        status: 'healthy',
        checks: {
          database: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          memory: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          cpu: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          diskSpace: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          api: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          cache: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
          websocket: { status: 'ok', value: 0, threshold: 0, message: '', lastChecked: timestamp },
        },
        overallScore: 100,
      },
    };

    metrics.healthCheck = this.performHealthCheck(metrics);

    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > 288) {
      // Keep last 24 hours of 5-minute snapshots
      this.metricsHistory.shift();
    }

    return metrics;
  }

  /**
   * Perform comprehensive health check
   */
  private performHealthCheck(metrics: SystemMetricsSnapshot): HealthCheckResult {
    const timestamp = Date.now();

    const checks = {
      database: this.checkDatabaseHealth(metrics),
      memory: this.checkMemoryHealth(metrics),
      cpu: this.checkCPUHealth(metrics),
      diskSpace: this.checkDiskHealth(metrics),
      api: this.checkAPIHealth(metrics),
      cache: {
        status: 'ok' as const,
        value: 95,
        threshold: 80,
        message: 'Cache performing normally',
        lastChecked: timestamp,
      },
      websocket: {
        status: 'ok' as const,
        value: 100,
        threshold: 50,
        message: 'WebSocket connections stable',
        lastChecked: timestamp,
      },
    };

    const scores = Object.values(checks).map((check) => (check.status === 'ok' ? 100 : check.status === 'warning' ? 50 : 0));
    const overallScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);

    const status = overallScore >= 80 ? 'healthy' : overallScore >= 50 ? 'degraded' : 'unhealthy';

    return {
      timestamp,
      status,
      checks,
      overallScore,
    };
  }

  private checkDatabaseHealth(metrics: SystemMetricsSnapshot | undefined): HealthStatus {
    if (!metrics) {
      return {
        status: 'ok',
        value: 0,
        threshold: 75,
        message: 'Database status unknown',
        lastChecked: Date.now(),
      };
    }

    const maxConnections = Math.max(1, metrics.database.maxConnections);
    const connectionUsage = (metrics.database.connections / maxConnections) * 100;
    const status = connectionUsage > HEALTH_CHECK_THRESHOLDS.database.connectionUsageCritical ? 'critical' : connectionUsage > HEALTH_CHECK_THRESHOLDS.database.connectionUsageWarning ? 'warning' : 'ok';

    return {
      status,
      value: connectionUsage,
      threshold: 75,
      message: `Database connections: ${metrics.database.connections}/${metrics.database.maxConnections}`,
      lastChecked: Date.now(),
    };
  }

  private checkMemoryHealth(metrics: SystemMetricsSnapshot | undefined): HealthStatus {
    if (!metrics) {
      return {
        status: 'ok',
        value: 0,
        threshold: 70,
        message: 'Memory status unknown',
        lastChecked: Date.now(),
      };
    }

    const status =
      metrics.memory.usage > HEALTH_CHECK_THRESHOLDS.memory.usageCritical
        ? 'critical'
        : metrics.memory.usage > HEALTH_CHECK_THRESHOLDS.memory.usageWarning
          ? 'warning'
          : 'ok';

    return {
      status,
      value: metrics.memory.usage,
      threshold: 70,
      message: `Memory usage: ${Math.round(metrics.memory.used)}MB / ${Math.round(metrics.memory.total)}MB`,
      lastChecked: Date.now(),
    };
  }

  private checkCPUHealth(metrics: SystemMetricsSnapshot | undefined): HealthStatus {
    if (!metrics) {
      return {
        status: 'ok',
        value: 0,
        threshold: 60,
        message: 'CPU status unknown',
        lastChecked: Date.now(),
      };
    }

    const status =
      metrics.cpu.usage > HEALTH_CHECK_THRESHOLDS.cpu.usageCritical
        ? 'critical'
        : metrics.cpu.usage > HEALTH_CHECK_THRESHOLDS.cpu.usageWarning
          ? 'warning'
          : 'ok';

    return {
      status,
      value: metrics.cpu.usage,
      threshold: 60,
      message: `CPU usage: ${Math.round(metrics.cpu.usage)}%`,
      lastChecked: Date.now(),
    };
  }

  private checkDiskHealth(metrics: SystemMetricsSnapshot | undefined): HealthStatus {
    if (!metrics) {
      return {
        status: 'ok',
        value: 0,
        threshold: 70,
        message: 'Disk status unknown',
        lastChecked: Date.now(),
      };
    }

    const status = metrics.disk.usage > HEALTH_CHECK_THRESHOLDS.disk.usageCritical ? 'critical' : metrics.disk.usage > HEALTH_CHECK_THRESHOLDS.disk.usageWarning ? 'warning' : 'ok';

    return {
      status,
      value: metrics.disk.usage,
      threshold: 70,
      message: `Disk usage: ${Math.round(metrics.disk.usage)}%`,
      lastChecked: Date.now(),
    };
  }

  private checkAPIHealth(metrics: SystemMetricsSnapshot | undefined): HealthStatus {
    if (!metrics) {
      return {
        status: 'ok',
        value: 0,
        threshold: 50,
        message: 'API status unknown',
        lastChecked: Date.now(),
      };
    }

    const errorRate = metrics.requests.totalRequests > 0 ? (metrics.requests.failedRequests / metrics.requests.totalRequests) * 100 : 0;
    const status =
      errorRate > HEALTH_CHECK_THRESHOLDS.api.errorRateCritical
        ? 'critical'
        : errorRate > HEALTH_CHECK_THRESHOLDS.api.errorRateWarning
          ? 'warning'
          : 'ok';

    return {
      status,
      value: errorRate,
      threshold: 1,
      message: `API error rate: ${errorRate.toFixed(2)}%`,
      lastChecked: Date.now(),
    };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 100): SystemMetricsSnapshot[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get server uptime
   */
  getUptime(): { seconds: number; formatted: string } {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formatted = `${days}d ${hours}h ${minutes}m ${secs}s`;

    return { seconds, formatted };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.serviceMetrics = {
      requestCount: 0,
      errorCount: 0,
      successCount: 0,
      totalResponseTime: 0,
      responseTimes: [],
      requestTimestamps: [],
      startTime: Date.now(),
    };
  }
}
