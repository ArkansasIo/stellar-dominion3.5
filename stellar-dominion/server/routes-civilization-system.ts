/**
 * Civilization System API Routes
 * Endpoints for subsystems, workforce management, and governance
 * @tag #api #civilization #rest #routes
 */

import type { Express } from 'express';
import { CivilizationSystemService } from './services/civilizationSystemService';
import { isAuthenticated } from './basicAuth';
import { getAllSubsystems } from '../shared/config/civilizationSubsystemsConfig';
import { ALL_CIVILIZATION_JOBS } from '../shared/config/civilizationJobsConfig';

export function registerCivilizationSystemRoutes(app: Express): void {
  /**
   * GET /api/civilization/state
   * Get player's civilization state
   */
  app.get('/api/civilization/state', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const summary = CivilizationSystemService.getCivilizationSummary(playerId);

      res.json({
        success: true,
        data: summary,
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/civilization/subsystems
   * List all available subsystems
   */
  app.get('/api/civilization/subsystems', (req, res) => {
    try {
      const subsystems = getAllSubsystems();

      res.json({
        success: true,
        data: subsystems,
        count: subsystems.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/civilization/subsystems/upgrade
   * Upgrade a subsystem
   */
  app.post('/api/civilization/subsystems/upgrade', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { systemId, targetLevel } = req.body;

      if (!systemId || !targetLevel) {
        return res.status(400).json({
          success: false,
          error: 'Missing systemId or targetLevel',
        });
      }

      const result = CivilizationSystemService.upgradeSubsystem(
        playerId,
        systemId,
        targetLevel
      );

      res.json({
        success: result.success,
        message: result.message,
        newLevel: result.newLevel,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/civilization/jobs
   * List all available jobs
   */
  app.get('/api/civilization/jobs', (req, res) => {
    try {
      res.json({
        success: true,
        data: ALL_CIVILIZATION_JOBS,
        count: ALL_CIVILIZATION_JOBS.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/civilization/workforce/assign
   * Assign workforce to a job
   */
  app.post('/api/civilization/workforce/assign', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { jobId, employees } = req.body;

      if (!jobId || !employees) {
        return res.status(400).json({
          success: false,
          error: 'Missing jobId or employees',
        });
      }

      const result = CivilizationSystemService.assignWorkforce(
        playerId,
        jobId,
        employees
      );

      res.json({
        success: result.success,
        message: result.message,
        assignment: result.assignment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * PUT /api/civilization/workforce/:assignmentId
   * Update workforce assignment
   */
  app.put('/api/civilization/workforce/:assignmentId', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { assignmentId } = req.params;
      const { employees } = req.body;

      if (!employees) {
        return res.status(400).json({
          success: false,
          error: 'Missing employees count',
        });
      }

      const result = CivilizationSystemService.updateAssignment(
        playerId,
        assignmentId,
        employees
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * DELETE /api/civilization/workforce/:assignmentId
   * Remove workforce assignment
   */
  app.delete('/api/civilization/workforce/:assignmentId', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { assignmentId } = req.params;

      const result = CivilizationSystemService.removeAssignment(
        playerId,
        assignmentId
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/civilization/workforce/assignments
   * Get all workforce assignments
   */
  app.get('/api/civilization/workforce/assignments', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const assignments = CivilizationSystemService.getAssignments(playerId);

      res.json({
        success: true,
        data: assignments,
        count: assignments.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/civilization/workforce/projection
   * Get workforce resource projection
   */
  app.get('/api/civilization/workforce/projection', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const projection = CivilizationSystemService.calculateWorkforceProjection(playerId);

      res.json({
        success: true,
        data: projection,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/civilization/government/set
   * Set government type
   */
  app.post('/api/civilization/government/set', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { governmentType } = req.body;

      if (!governmentType) {
        return res.status(400).json({
          success: false,
          error: 'Missing governmentType',
        });
      }

      const result = CivilizationSystemService.setGovernmentType(
        playerId,
        governmentType
      );

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/civilization/culture/festival
   * Host a festival to boost morale
   */
  app.post('/api/civilization/culture/festival', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { duration } = req.body || { duration: 5 };

      const result = CivilizationSystemService.hostFestival(playerId, duration);

      res.json({
        success: result.success,
        message: result.message,
        newMorale: result.newMorale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/civilization/turn/process
   * Process a civilization turn
   */
  app.post('/api/civilization/turn/process', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';

      const result = CivilizationSystemService.processTurn(playerId);

      res.json({
        success: result.success,
        resources: result.resources,
        changes: result.changes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });
}
