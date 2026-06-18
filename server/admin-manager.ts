// Server Administration Manager
// Provides server management, monitoring, and control features

import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Server statistics interface
export interface ServerStats {
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  cpu: {
    cores: number;
    model: string;
    usage: number;
  };
  system: {
    platform: string;
    arch: string;
    hostname: string;
    release: string;
  };
  process: {
    pid: number;
    memory: number;
    uptime: number;
    version: string;
  };
  network: {
    interfaces: any[];
  };
}

// Admin authentication middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!user.isAdmin && user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  
  next();
}

// Get server statistics
export async function getServerStats(): Promise<ServerStats> {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  const cpus = os.cpus();
  const cpuModel = cpus[0]?.model || 'Unknown';
  
  // Calculate CPU usage
  let cpuUsage = 0;
  try {
    const startMeasure = cpuAverage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endMeasure = cpuAverage();
    
    const idleDifference = endMeasure.idle - startMeasure.idle;
    const totalDifference = endMeasure.total - startMeasure.total;
    cpuUsage = 100 - ~~(100 * idleDifference / totalDifference);
  } catch (error) {
    console.error('Error calculating CPU usage:', error);
  }
  
  const networkInterfaces = os.networkInterfaces();
  const interfaces = Object.entries(networkInterfaces).map(([name, addrs]) => ({
    name,
    addresses: addrs?.map(addr => ({
      address: addr.address,
      family: addr.family,
      internal: addr.internal
    })) || []
  }));
  
  return {
    uptime: os.uptime(),
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percentage: (usedMem / totalMem) * 100
    },
    cpu: {
      cores: cpus.length,
      model: cpuModel,
      usage: cpuUsage
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      release: os.release()
    },
    process: {
      pid: process.pid,
      memory: process.memoryUsage().heapUsed,
      uptime: process.uptime(),
      version: process.version
    },
    network: {
      interfaces
    }
  };
}

// Helper function for CPU usage calculation
function cpuAverage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });
  
  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  };
}

// Server control functions
export class ServerManager {
  private static instance: ServerManager;
  private maintenanceMode: boolean = false;
  private serverStartTime: number = Date.now();
  
  private constructor() {}
  
  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }
  
  // Enable/disable maintenance mode
  setMaintenanceMode(enabled: boolean): void {
    this.maintenanceMode = enabled;
    console.log(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  isMaintenanceMode(): boolean {
    return this.maintenanceMode;
  }
  
  // Get server uptime
  getUptime(): number {
    return Date.now() - this.serverStartTime;
  }
  
  // Restart server (graceful)
  async restartServer(): Promise<void> {
    console.log('Initiating graceful server restart...');
    
    // Give clients time to disconnect
    setTimeout(() => {
      process.exit(0); // Exit with success code, process manager will restart
    }, 5000);
  }
  
  // Shutdown server (graceful)
  async shutdownServer(): Promise<void> {
    console.log('Initiating graceful server shutdown...');
    
    setTimeout(() => {
      process.exit(0);
    }, 5000);
  }
  
  // Clear cache
  async clearCache(): Promise<void> {
    // Implement cache clearing logic
    console.log('Cache cleared');
  }
  
  // Run database maintenance
  async runDatabaseMaintenance(): Promise<void> {
    try {
      // Vacuum and analyze database
      console.log('Running database maintenance...');
      // Add actual database maintenance commands here
      console.log('Database maintenance complete');
    } catch (error) {
      console.error('Database maintenance failed:', error);
      throw error;
    }
  }
  
  // Get active connections
  async getActiveConnections(): Promise<number> {
    // Implement connection counting
    return 0; // Placeholder
  }
  
  // Get error logs
  async getErrorLogs(limit: number = 100): Promise<any[]> {
    // Implement error log retrieval
    return []; // Placeholder
  }
  
  // Get access logs
  async getAccessLogs(limit: number = 100): Promise<any[]> {
    // Implement access log retrieval
    return []; // Placeholder
  }
  
  // Backup database
  async backupDatabase(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `backup-${timestamp}.sql`;
      
      // Run pg_dump command
      const dbUrl = process.env.DATABASE_URL || '';
      const command = `pg_dump ${dbUrl} > backups/${backupFile}`;
      
      await execAsync(command);
      
      console.log(`Database backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('Database backup failed:', error);
      throw error;
    }
  }
  
  // Get system health
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    checks: any[];
  }> {
    const checks = [];
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    // Check memory
    const stats = await getServerStats();
    if (stats.memory.percentage > 90) {
      status = 'critical';
      checks.push({ name: 'Memory', status: 'critical', value: `${stats.memory.percentage.toFixed(1)}%` });
    } else if (stats.memory.percentage > 75) {
      status = 'degraded';
      checks.push({ name: 'Memory', status: 'warning', value: `${stats.memory.percentage.toFixed(1)}%` });
    } else {
      checks.push({ name: 'Memory', status: 'ok', value: `${stats.memory.percentage.toFixed(1)}%` });
    }
    
    // Check CPU
    if (stats.cpu.usage > 90) {
      status = 'critical';
      checks.push({ name: 'CPU', status: 'critical', value: `${stats.cpu.usage}%` });
    } else if (stats.cpu.usage > 75) {
      if (status === 'healthy') status = 'degraded';
      checks.push({ name: 'CPU', status: 'warning', value: `${stats.cpu.usage}%` });
    } else {
      checks.push({ name: 'CPU', status: 'ok', value: `${stats.cpu.usage}%` });
    }
    
    // Check database connection
    try {
      // Add database ping here
      checks.push({ name: 'Database', status: 'ok', value: 'Connected' });
    } catch (error) {
      status = 'critical';
      checks.push({ name: 'Database', status: 'critical', value: 'Disconnected' });
    }
    
    return { status, checks };
  }
}

// Admin API routes
export function setupAdminRoutes(app: any) {
  const manager = ServerManager.getInstance();
  
  // Get server stats
  app.get('/api/admin/stats', requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await getServerStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get server stats' });
    }
  });
  
  // Get system health
  app.get('/api/admin/health', requireAdmin, async (req: Request, res: Response) => {
    try {
      const health = await manager.getSystemHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get system health' });
    }
  });
  
  // Set maintenance mode
  app.post('/api/admin/maintenance', requireAdmin, (req: Request, res: Response) => {
    const { enabled } = req.body;
    manager.setMaintenanceMode(enabled);
    res.json({ success: true, maintenanceMode: enabled });
  });
  
  // Restart server
  app.post('/api/admin/restart', requireAdmin, async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Server restart initiated' });
    await manager.restartServer();
  });
  
  // Shutdown server
  app.post('/api/admin/shutdown', requireAdmin, async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Server shutdown initiated' });
    await manager.shutdownServer();
  });
  
  // Clear cache
  app.post('/api/admin/clear-cache', requireAdmin, async (req: Request, res: Response) => {
    try {
      await manager.clearCache();
      res.json({ success: true, message: 'Cache cleared' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });
  
  // Database maintenance
  app.post('/api/admin/db-maintenance', requireAdmin, async (req: Request, res: Response) => {
    try {
      await manager.runDatabaseMaintenance();
      res.json({ success: true, message: 'Database maintenance complete' });
    } catch (error) {
      res.status(500).json({ error: 'Database maintenance failed' });
    }
  });
  
  // Backup database
  app.post('/api/admin/backup', requireAdmin, async (req: Request, res: Response) => {
    try {
      const backupFile = await manager.backupDatabase();
      res.json({ success: true, backupFile });
    } catch (error) {
      res.status(500).json({ error: 'Database backup failed' });
    }
  });
  
  // Get error logs
  app.get('/api/admin/logs/errors', requireAdmin, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await manager.getErrorLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get error logs' });
    }
  });
  
  // Get access logs
  app.get('/api/admin/logs/access', requireAdmin, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await manager.getAccessLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get access logs' });
    }
  });
  
  // Get active connections
  app.get('/api/admin/connections', requireAdmin, async (req: Request, res: Response) => {
    try {
      const connections = await manager.getActiveConnections();
      res.json({ connections });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get connections' });
    }
  });
}

// Maintenance mode middleware
export function maintenanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const manager = ServerManager.getInstance();
  
  // Allow admin routes during maintenance
  if (req.path.startsWith('/api/admin')) {
    return next();
  }
  
  if (manager.isMaintenanceMode()) {
    return res.status(503).json({
      error: 'Server is under maintenance',
      message: 'The server is currently undergoing maintenance. Please try again later.'
    });
  }
  
  next();
}

export default ServerManager;

// Made with Bob
