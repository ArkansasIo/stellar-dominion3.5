/**
 * Diagnostics Routes
 * API endpoints for error reporting, debugging, issues, and warnings
 */

import type { Express, Request, Response } from 'express';
import { DebugService } from './services/debugService';
import { IssueService } from './services/issueService';
import { WarningService } from './services/warningService';
import { isAuthenticated } from './basicAuth';

function getUserId(req: Request) {
  return (req.session as any)?.userId || '';
}

export function registerDiagnosticsRoutes(app: Express) {
  const debugService = DebugService.getInstance();
  const issueService = IssueService.getInstance();
  const warningService = WarningService.getInstance();

  // ==================== DEBUG LOGS ====================

  /**
   * GET /api/diagnostics/debug - Get debug logs
   */
  app.get('/api/diagnostics/debug', isAuthenticated, (req: Request, res: Response) => {
    try {
      const level = req.query.level as string;
      const limit = parseInt(req.query.limit as string) || 100;

      const logs = debugService.getLogs(level as any, limit);
      res.json({
        success: true,
        data: logs,
        count: logs.length,
      });
    } catch (error: any) {
      console.error('Error fetching debug logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch debug logs',
      });
    }
  });

  /**
   * GET /api/diagnostics/debug/request/:requestId - Get logs for specific request
   */
  app.get('/api/diagnostics/debug/request/:requestId', isAuthenticated, (req: Request, res: Response) => {
    try {
      const logs = debugService.getRequestLogs(req.params.requestId);
      res.json({
        success: true,
        data: logs,
        count: logs.length,
      });
    } catch (error: any) {
      console.error('Error fetching request logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch request logs',
      });
    }
  });

  /**
   * POST /api/diagnostics/debug/clear - Clear old debug logs
   */
  app.post('/api/diagnostics/debug/clear', isAuthenticated, (req: Request, res: Response) => {
    try {
      const daysToKeep = req.body.daysToKeep || 7;
      debugService.clearOldLogs(daysToKeep);

      res.json({
        success: true,
        message: `Cleared logs older than ${daysToKeep} days`,
      });
    } catch (error: any) {
      console.error('Error clearing debug logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear debug logs',
      });
    }
  });

  // ==================== ISSUES ====================

  /**
   * GET /api/diagnostics/issues - Get all issues
   */
  app.get('/api/diagnostics/issues', isAuthenticated, (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;
      const severity = req.query.severity as string;

      let issues = issueService.getAllIssues();

      if (status) {
        issues = issues.filter((i) => i.status === status);
      }
      if (severity) {
        issues = issues.filter((i) => i.severity === severity);
      }

      res.json({
        success: true,
        data: issues,
        count: issues.length,
      });
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch issues',
      });
    }
  });

  /**
   * GET /api/diagnostics/issues/:id - Get specific issue
   */
  app.get('/api/diagnostics/issues/:id', isAuthenticated, (req: Request, res: Response) => {
    try {
      const issue = issueService.getIssue(req.params.id);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found',
        });
      }

      res.json({
        success: true,
        data: issue,
      });
    } catch (error: any) {
      console.error('Error fetching issue:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch issue',
      });
    }
  });

  /**
   * POST /api/diagnostics/issues/:id/resolve - Resolve an issue
   */
  app.post('/api/diagnostics/issues/:id/resolve', isAuthenticated, (req: Request, res: Response) => {
    try {
      const { notes } = req.body;
      const userId = getUserId(req);

      const issue = issueService.updateIssueStatus(req.params.id, 'resolved' as any, notes, userId);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found',
        });
      }

      res.json({
        success: true,
        data: issue,
      });
    } catch (error: any) {
      console.error('Error resolving issue:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve issue',
      });
    }
  });

  /**
   * GET /api/diagnostics/issues/report - Get issues report
   */
  app.get('/api/diagnostics/issues/report', isAuthenticated, (req: Request, res: Response) => {
    try {
      const startTime = parseInt(req.query.startTime as string) || Date.now() - 24 * 60 * 60 * 1000;
      const endTime = parseInt(req.query.endTime as string) || Date.now();

      const report = issueService.generateReport(startTime, endTime);

      res.json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      console.error('Error generating issues report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate issues report',
      });
    }
  });

  // ==================== WARNINGS ====================

  /**
   * GET /api/diagnostics/warnings - Get all active warnings
   */
  app.get('/api/diagnostics/warnings', isAuthenticated, (req: Request, res: Response) => {
    try {
      const includeAcknowledged = req.query.includeAcknowledged === 'true';

      const warnings = includeAcknowledged ? warningService.getAllWarnings() : warningService.getActiveWarnings();

      res.json({
        success: true,
        data: warnings,
        count: warnings.length,
      });
    } catch (error: any) {
      console.error('Error fetching warnings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch warnings',
      });
    }
  });

  /**
   * POST /api/diagnostics/warnings/:id/acknowledge - Acknowledge warning
   */
  app.post('/api/diagnostics/warnings/:id/acknowledge', isAuthenticated, (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const warning = warningService.acknowledgeWarning(req.params.id, userId);

      if (!warning) {
        return res.status(404).json({
          success: false,
          message: 'Warning not found',
        });
      }

      res.json({
        success: true,
        data: warning,
      });
    } catch (error: any) {
      console.error('Error acknowledging warning:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to acknowledge warning',
      });
    }
  });

  /**
   * GET /api/diagnostics/warnings/statistics - Get warning statistics
   */
  app.get('/api/diagnostics/warnings/statistics', isAuthenticated, (req: Request, res: Response) => {
    try {
      const stats = warningService.getStatistics();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error fetching warning statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch warning statistics',
      });
    }
  });

  /**
   * POST /api/diagnostics/warnings/clear-old - Clear old warnings (admin only)
   */
  app.post('/api/diagnostics/warnings/clear-old', isAuthenticated, (req: Request, res: Response) => {
    try {
      const hoursOld = req.body.hoursOld || 24;
      const cleared = warningService.clearOldWarnings(hoursOld);

      res.json({
        success: true,
        message: `Cleared ${cleared} old warnings`,
      });
    } catch (error: any) {
      console.error('Error clearing old warnings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear old warnings',
      });
    }
  });
}
