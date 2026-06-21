/**
 * Turn System Routes
 * REST API endpoints for turn management and research progression
 * @tag #turn-system #api
 */

import express from 'express';
import { isAuthenticated } from './basicAuth';
import TurnSystemService from './services/turnSystemService';
import { TURN_CONFIG, RESEARCH_TURN_MECHANICS } from '../shared/config/turnSystemConfig';

const router = express.Router();

router.get('/api/turns', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const turnInfo = await TurnSystemService.getTurnInfo(userId);
    res.json({
      success: true,
      ...turnInfo,
      currentTurns: turnInfo.currentTurns ?? turnInfo.turnsAvailable ?? 0,
      totalTurns: turnInfo.totalTurns ?? turnInfo.totalTurnsGenerated ?? 0,
      config: {
        turnsPerMinute: TURN_CONFIG.TURNS_PER_MINUTE,
        turnIntervalMs: TURN_CONFIG.TURN_INTERVAL_MS,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get turn info',
    });
  }
});

/**
 * GET /api/turns/info
 * Get current turn information for player
 */
router.get('/api/turns/info', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const turnInfo = await TurnSystemService.getTurnInfo(userId);
    res.json({
      success: true,
      ...turnInfo,
      currentTurns: turnInfo.currentTurns ?? turnInfo.turnsAvailable ?? 0,
      totalTurns: turnInfo.totalTurns ?? turnInfo.totalTurnsGenerated ?? 0,
      config: {
        turnsPerMinute: TURN_CONFIG.TURNS_PER_MINUTE,
        turnIntervalMs: TURN_CONFIG.TURN_INTERVAL_MS,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get turn info',
    });
  }
});

/**
 * POST /api/turns/generate
 * Manually generate turns for player (usually automatic)
 */
router.post('/api/turns/generate', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const available = await TurnSystemService.generateTurns(userId);
    res.json({
      success: true,
      turnsAvailable: available,
      message: 'Turns generated successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate turns',
    });
  }
});

router.post('/api/turns/spend', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const amount = Number(req.body?.amount ?? 0);
    if (!Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await TurnSystemService.spendTurns(userId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to spend turns',
    });
  }
});

/**
 * POST /api/turns/apply-to-research
 * Consume turns to progress current research
 * Body: { turnsToConsume: number }
 */
router.post('/api/turns/apply-to-research', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { turnsToConsume = 1 } = req.body;

    if (!Number.isInteger(turnsToConsume) || turnsToConsume < 1) {
      return res.status(400).json({ error: 'Invalid turns to consume' });
    }

    const result = await TurnSystemService.progressResearchByTurns(userId, turnsToConsume);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to apply turns',
    });
  }
});

/**
 * POST /api/turns/auto-progress
 * Auto-progress research based on elapsed time
 */
router.post('/api/turns/auto-progress', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await TurnSystemService.autoProgressResearch(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to auto-progress',
    });
  }
});

/**
 * POST /api/turns/apply-event
 * Apply a turn-based event to current research
 * Body: { eventType: string }
 */
router.post('/api/turns/apply-event', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { eventType } = req.body;
    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    const result = await TurnSystemService.applyTurnEvent(userId, eventType);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to apply event',
    });
  }
});

/**
 * GET /api/turns/mechanics
 * Get turn mechanics configuration (public)
 */
router.get('/api/turns/mechanics', (req, res) => {
  res.json({
    turnConfig: TURN_CONFIG,
    researchMechanics: RESEARCH_TURN_MECHANICS,
  });
});

/**
 * POST /api/turns/calculate-requirements
 * Calculate turns needed for research
 * Body: { baseTurns: number, speedMultiplier?: number, labModifier?: number }
 */
router.post('/api/turns/calculate-requirements', isAuthenticated, async (req, res) => {
  try {
    const { baseTurns, speedMultiplier = 1.0, labModifier = 1.0 } = req.body;

    if (typeof baseTurns !== 'number' || baseTurns <= 0) {
      return res.status(400).json({ error: 'Invalid base turns' });
    }

    const turnsNeeded = TurnSystemService.calculateTurnRequirements(
      baseTurns,
      speedMultiplier,
      labModifier
    );

    res.json({
      success: true,
      baseTurns,
      speedMultiplier,
      labModifier,
      turnsNeeded,
      estimatedTurnsPerMinute: TURN_CONFIG.TURNS_PER_MINUTE,
      estimatedTimeMinutes: (turnsNeeded / TURN_CONFIG.TURNS_PER_MINUTE).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Calculation failed',
    });
  }
});

/**
 * GET /api/turns/bonuses
 * Get current turn-based bonuses for player
 */
router.get('/api/turns/bonuses', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const turnInfo = await TurnSystemService.getTurnInfo(userId);
    const bonuses = TurnSystemService.calculateTurnBonuses(
      turnInfo.currentResearchTurns,
      turnInfo.currentResearchTurns
    );

    res.json({
      success: true,
      currentBonuses: bonuses,
      turnCount: turnInfo.currentResearchTurns,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get bonuses',
    });
  }
});

/**
 * GET /api/turns/events
 * Get available turn events (public)
 */
router.get('/api/turns/events', (req, res) => {
  res.json({
    availableEvents: [
      'research_acceleration',
      'research_boost',
      'research_penalty',
      'lab_malfunction',
    ],
    eventEffects: {
      research_acceleration: {
        description: 'Accelerate research by reducing remaining turns',
        effect: '50% of remaining turns',
      },
      research_boost: {
        description: 'Instantly gain progress and speed boost',
        effect: '+15% progress, +10% speed for 10 turns',
      },
      research_penalty: {
        description: 'Lose progress and speed temporarily',
        effect: '-10% progress, -20% speed for 5 turns',
      },
      lab_malfunction: {
        description: 'Lab experiences critical malfunction',
        effect: '-20% progress instantly, -50% speed for 3 turns',
      },
    },
  });
});

export default router;
