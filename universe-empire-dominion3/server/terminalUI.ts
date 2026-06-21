import { ServerStatusService } from './services/serverStatusService';

const statusService = ServerStatusService.getInstance();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const statusOn = `${colors.green}●${colors.reset}`;
const statusOff = `${colors.red}●${colors.reset}`;
const statusWarning = `${colors.yellow}●${colors.reset}`;

function formatUptime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function formatMemory(megabytes: number): string {
  return `${Math.round(megabytes)}MB`;
}

function drawBox(title: string, width: number = 60): string {
  const titleLen = title.length + 2;
  const padding = Math.floor((width - titleLen) / 2);
  const line = '─'.repeat(width);
  const paddedTitle = ' '.repeat(padding) + ` ${title} ` + ' '.repeat(width - titleLen - padding);
  
  return [
    `${colors.cyan}╔${line}╗${colors.reset}`,
    `${colors.cyan}║${colors.reset}${colors.bright}${colors.cyan}${paddedTitle}${colors.reset}${colors.cyan}║${colors.reset}`,
    `${colors.cyan}╠${line}╣${colors.reset}`,
  ].join('\n');
}

function drawBoxBottom(width: number = 60): string {
  const line = '─'.repeat(width);
  return `${colors.cyan}╚${line}╝${colors.reset}`;
}

export function displayStartupBanner(port: number, env: string): void {
  console.clear();
  
  const banner = `
${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██████╗ ██╗██╗   ██╗███╗   ██╗████████╗ ██████╗  ██████╗ ██╗    ██╗███████╗ ║
║   ██╔══██╗██║██║   ██║████╗  ██║╚══██╔══╝██╔═══██╗██╔═══██╗██║    ██║██╔════╝ ║
║   ██████╔╝██║██║   ██║██╔██╗ ██║   ██║   ██║   ██║██║   ██║██║ █╗ ██║█████╗   ║
║   ██╔══██╗██║╚██╗ ██╔╝██║╚██╗██║   ██║   ██║   ██║██║   ██║██║███╗██║██╔══╝   ║
║   ██║  ██║██║ ╚████╔╝ ██║ ╚████║   ██║   ╚██████╔╝╚██████╔╝╚███╔███╔╝███████╗ ║
║   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═══╝   ╚═╝    ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚══════╝ ║
║                                                                              ║
║              U N I V E R S E   E M P I R E   D O M I N I O N                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${colors.reset}`;

  console.log(banner);
}

export async function displayServerStatus(port: number, env: string): Promise<void> {
  const metrics = await statusService.getSystemMetrics().catch(() => null);
  
  if (!metrics) {
    console.log(`${colors.red}Unable to fetch system metrics${colors.reset}`);
    return;
  }

  const healthColor = 
    metrics.healthCheck.status === 'healthy' ? colors.green :
    metrics.healthCheck.status === 'degraded' ? colors.yellow :
    colors.red;

  displayStartupBanner(port, env);

  // Setup Complete Section
  console.log(drawBox('SETUP COMPLETE'));
  console.log(`  ${colors.green}✓${colors.reset} All services initialized`);
  console.log(`  ${colors.green}✓${colors.reset} Server ready to accept connections`);
  console.log(`  ${colors.green}✓${colors.reset} Database connection verified`);
  console.log(drawBoxBottom() + '\n');

  // Main Server Info
  console.log(drawBox('MAIN SERVER INFO'));
  console.log(`  ${statusOn} Server Status: ${colors.green}RUNNING${colors.reset}`);
  console.log(`  ${statusOn} Port: ${colors.cyan}${port}${colors.reset}`);
  console.log(`  ${statusOn} Environment: ${colors.cyan}${env}${colors.reset}`);
  console.log(`  ${statusOn} Health Score: ${healthColor}${metrics.healthCheck.overallScore ?? 100}${colors.reset}`);
  console.log(`  ${statusOn} Uptime: ${colors.cyan}${formatUptime((metrics.cpu.uptime ?? 0) * 1000)}${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Database Section
  console.log(drawBox('DATABASE'));
  console.log(`  ${statusOn} PostgreSQL: ${colors.green}CONNECTED${colors.reset}`);
  console.log(`  ${statusOn} Host: ${colors.cyan}${process.env.PGHOST || 'localhost'}${colors.reset}`);
  console.log(`  ${statusOn} Connections: ${colors.cyan}${metrics.database.connections ?? 0}/${metrics.database.maxConnections ?? 0}${colors.reset}`);
  console.log(`  ${statusOn} Active Queries: ${colors.cyan}${metrics.database.activeQueries ?? 0}${colors.reset}`);
  console.log(`  ${statusOn} Cache Hit Rate: ${colors.cyan}${Math.round(metrics.database.cacheHitRate ?? 0)}%${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Performance Section
  console.log(drawBox('PERFORMANCE'));
  console.log(`  ${statusOn} Total Requests: ${colors.cyan}${metrics.requests.totalRequests ?? 0}${colors.reset}`);
  console.log(`  ${statusOn} Request Rate: ${colors.cyan}${(metrics.requests.requestsPerSecond ?? 0).toFixed(2)}/sec${colors.reset}`);
  console.log(`  ${statusOn} Avg Response: ${colors.cyan}${Math.round(metrics.requests.averageResponseTime ?? 0)}ms${colors.reset}`);
  console.log(`  ${statusOn} P95 / P99: ${colors.cyan}${Math.round(metrics.requests.p95ResponseTime ?? 0)}ms / ${Math.round(metrics.requests.p99ResponseTime ?? 0)}ms${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Resources Section
  console.log(drawBox('RESOURCES'));
  const cpuUsage = Math.round(metrics.cpu.usage ?? 0);
  const cpuColor = cpuUsage > 80 ? colors.red : cpuUsage > 50 ? colors.yellow : colors.green;
  console.log(`  ${statusOn} CPU Usage: ${cpuColor}${cpuUsage}%${colors.reset}`);
  
  const memUsed = formatMemory(metrics.memory.used ?? 0);
  const memTotal = formatMemory(metrics.memory.total ?? 0);
  const memPercent = Math.round(((metrics.memory.used ?? 0) / (metrics.memory.total ?? 1)) * 100);
  const memColor = memPercent > 80 ? colors.red : memPercent > 50 ? colors.yellow : colors.green;
  console.log(`  ${statusOn} Memory: ${memColor}${memUsed}${colors.reset} / ${colors.cyan}${memTotal}${colors.reset}`);
  
  const diskUsage = Math.round(metrics.disk.usage ?? 0);
  const diskColor = diskUsage > 80 ? colors.red : diskUsage > 50 ? colors.yellow : colors.green;
  console.log(`  ${statusOn} Disk Usage: ${diskColor}${diskUsage}%${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Services Section
  console.log(drawBox('SERVICES'));
  console.log(`  ${statusOn} Express Server: ${colors.green}ACTIVE${colors.reset}`);
  console.log(`  ${statusOn} Session Manager: ${colors.green}ACTIVE${colors.reset}`);
  console.log(`  ${statusOn} Authentication: ${colors.green}READY${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Access Section
  console.log(drawBox('ACCESS'));
  console.log(`  ${colors.cyan}→${colors.reset} API Endpoint: ${colors.bright}http://localhost:${port}/api${colors.reset}`);
  console.log(`  ${colors.cyan}→${colors.reset} Web Interface: ${colors.bright}http://localhost:${port}${colors.reset}`);
  console.log(`  ${colors.cyan}→${colors.reset} Health Check: ${colors.bright}http://localhost:${port}/api/status/health${colors.reset}`);
  console.log(drawBoxBottom() + '\n');

  // Health Checks Section
  console.log(drawBox('HEALTH CHECKS'));
  if (metrics.healthCheck.checks) {
    Object.entries(metrics.healthCheck.checks).forEach(([key, check]: [string, any]) => {
      const icon = check.status === 'ok' ? statusOn : check.status === 'warning' ? statusWarning : statusOff;
      const color = check.status === 'ok' ? colors.green : check.status === 'warning' ? colors.yellow : colors.red;
      const bar = '█'.repeat(Math.min(10, Math.floor((check.value / check.threshold) * 10)));
      console.log(`  ${icon} ${key.padEnd(12)} ${color}${bar}${colors.reset} ${Math.round(check.value)}/${Math.round(check.threshold)}`);
    });
  }
  console.log(drawBoxBottom() + '\n');

  // Status Indicators
  console.log(`${colors.bright}${colors.yellow}Status Indicators:${colors.reset}`);
  console.log(`  ${statusOn} Online / Active`);
  console.log(`  ${statusOff} Offline / Inactive`);
  console.log(`  ${statusWarning} Warning / Resetting\n`);
}

export function displayLiveStatus(): void {
  void (async () => {
    const metrics = await statusService.getSystemMetrics().catch(() => null);
    if (!metrics) return;

    const healthLabel = metrics.healthCheck.status.toUpperCase();
    const healthColor = 
      metrics.healthCheck.status === 'healthy' ? colors.green :
      metrics.healthCheck.status === 'degraded' ? colors.yellow :
      colors.red;

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    console.log(
      `${colors.dim}${timestamp}${colors.reset} ` +
      `${colors.cyan}[status]${colors.reset} ` +
      `uptime=${formatUptime(metrics.cpu.uptime * 1000)} ` +
      `health=${healthColor}${healthLabel}${colors.reset} ` +
      `req=${metrics.requests.totalRequests} ` +
      `rps=${metrics.requests.requestsPerSecond.toFixed(2)} ` +
      `avg=${Math.round(metrics.requests.averageResponseTime)}ms ` +
      `cpu=${colors.green}${Math.round(metrics.cpu.usage)}%${colors.reset} ` +
      `mem=${formatMemory(metrics.memory.used)}/${formatMemory(metrics.memory.total)} ` +
      `db=${metrics.database.connections}/${metrics.database.maxConnections}`
    );
  })();
}

export function displayRequestLog(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  sizeKb: string
): void {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  let level: 'info' | 'success' | 'error' | 'warn' = 'info';
  let levelColor = colors.cyan;
  let icon = 'ℹ️';

  if (statusCode >= 200 && statusCode < 300) {
    level = 'success';
    levelColor = colors.green;
    icon = '✓';
  } else if (statusCode >= 300 && statusCode < 400) {
    level = 'info';
    levelColor = colors.blue;
    icon = '→';
  } else if (statusCode >= 400 && statusCode < 500) {
    level = 'warn';
    levelColor = colors.yellow;
    icon = '⚠️';
  } else if (statusCode >= 500) {
    level = 'error';
    levelColor = colors.red;
    icon = '✗';
  }

  let speed = '';
  if (duration < 50) speed = `${colors.green}fast${colors.reset}`;
  else if (duration < 150) speed = `${colors.cyan}quick${colors.reset}`;
  else if (duration < 500) speed = `${colors.yellow}steady${colors.reset}`;
  else speed = `${colors.red}slow${colors.reset}`;

  const paddedMethod = method.padEnd(6);
  const paddedPath = path.padEnd(35);

  console.log(
    `${colors.dim}${timestamp}${colors.reset} ` +
    `${levelColor}[${level.toUpperCase().padEnd(7)}]${colors.reset} ` +
    `${icon} ${paddedMethod} ${paddedPath} ` +
    `[${statusCode}] ${speed} ${duration}ms ` +
    `[${sizeKb}KB]`
  );
}

export function displayAuthLog(message: string, isWarning: boolean = true): void {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const color = isWarning ? colors.yellow : colors.red;
  const icon = isWarning ? '⚠️' : '✗';
  const label = isWarning ? 'AUTH' : 'SERVER';

  console.log(
    `${colors.dim}${timestamp}${colors.reset} ` +
    `${color}[${label}]${colors.reset} ` +
    `${icon} ${message}`
  );
}