/**
 * Server Status & Health Check Routes
 * Provides metrics and monitoring endpoints for admin dashboard
 */

import type { Express, Request, Response } from 'express';
import { ServerStatusService } from './services/serverStatusService';
import { isAuthenticated } from './basicAuth';
import { db } from './db';
import { adminUsers } from '../shared/schema';
import { eq } from 'drizzle-orm';

function getUserId(req: Request) {
  return (req.session as any)?.userId || '';
}

export function registerStatusRoutes(app: Express) {
  const statusService = ServerStatusService.getInstance();

  async function isAdminUser(userId: string): Promise<boolean> {
    if (!userId) return false;

    const [adminRecord] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId))
      .limit(1);

    return Boolean(adminRecord);
  }

  /**
   * GET /api/status - Get current server status and metrics
   */
  app.get('/api/status', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const metrics = await statusService.getSystemMetrics();
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error: any) {
      console.error('Error getting server status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve server status',
      });
    }
  });

  /**
   * GET /api/status/health - Perform health check
   */
  app.get('/api/status/health', async (req: Request, res: Response) => {
    try {
      const metrics = await statusService.getSystemMetrics();
      const healthCheck = metrics.healthCheck;

      // Return 503 if unhealthy for external monitoring
      const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

      res.status(statusCode).json({
        success: true,
        status: healthCheck.status,
        score: healthCheck.overallScore,
        timestamp: healthCheck.timestamp,
        checks: healthCheck.checks,
      });
    } catch (error: any) {
      console.error('Error performing health check:', error);
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        message: 'Health check failed',
      });
    }
  });

  /**
   * GET /api/status/uptime - Get server uptime
   */
  app.get('/api/status/uptime', isAuthenticated, (req: Request, res: Response) => {
    try {
      const uptime = statusService.getUptime();
      res.json({
        success: true,
        uptime,
      });
    } catch (error: any) {
      console.error('Error getting uptime:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get uptime',
      });
    }
  });

  /**
   * GET /api/status/metrics - Get historical metrics
   */
  app.get('/api/status/metrics', isAuthenticated, (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const history = statusService.getMetricsHistory(limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      console.error('Error getting metrics history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve metrics',
      });
    }
  });

  /**
   * POST /api/status/reset-metrics - Reset service metrics (admin only)
   */
  app.post('/api/status/reset-metrics', isAuthenticated, (req: Request, res: Response) => {
    (async () => {
      try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const isAdmin = await isAdminUser(userId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required',
        });
      }

      statusService.resetMetrics();

      res.json({
        success: true,
        message: 'Metrics reset successfully',
      });
      } catch (error: any) {
      console.error('Error resetting metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset metrics',
      });
      }
    })();
  });
}
