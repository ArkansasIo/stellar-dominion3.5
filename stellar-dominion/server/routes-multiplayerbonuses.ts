/**
 * Multiplayer Research Bonuses Routes
 * Endpoints for alliance management and cooperative research
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import { MultiplayerBonusesService } from './services/multiplayerBonusesService';

const router = Router();

/**
 * GET /api/alliances/bonuses
 * Get current player's alliance bonuses
 */
router.get('/bonuses', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const bonuses = await MultiplayerBonusesService.getPlayerAllianceBonuses(userId);

    res.json({
      success: true,
      data: bonuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alliance bonuses',
    });
  }
});

/**
 * POST /api/alliances/create
 * Create a new alliance
 */
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { name, faction } = req.body;

    if (!name || !faction) {
      return res.status(400).json({
        success: false,
        error: 'Name and faction are required',
      });
    }

    const alliance = await MultiplayerBonusesService.createAlliance(userId, name, faction);

    res.json({
      success: true,
      data: alliance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create alliance',
    });
  }
});

/**
 * POST /api/alliances/join
 * Join an existing alliance
 */
router.post('/join', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { allianceId } = req.body;

    if (!allianceId) {
      return res.status(400).json({
        success: false,
        error: 'Alliance ID is required',
      });
    }

    const success = await MultiplayerBonusesService.joinAlliance(userId, allianceId);

    res.json({
      success,
      message: success ? 'Joined alliance' : 'Failed to join alliance',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to join alliance',
    });
  }
});

/**
 * GET /api/alliances/:allianceId/members
 * Get alliance member bonuses
 */
router.get('/:allianceId/members', isAuthenticated, async (req, res) => {
  try {
    const { allianceId } = req.params;
    const memberBonuses = await MultiplayerBonusesService.getAllianceMemberBonuses(allianceId);

    res.json({
      success: true,
      data: memberBonuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alliance members',
    });
  }
});

/**
 * POST /api/alliances/contribute
 * Contribute resources to alliance pool
 */
router.post('/contribute', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { allianceId, metals, credits } = req.body;

    if (!allianceId || !metals || !credits) {
      return res.status(400).json({
        success: false,
        error: 'Alliance ID, metals, and credits are required',
      });
    }

    const success = await MultiplayerBonusesService.contributeToPool(
      userId,
      allianceId,
      metals,
      credits
    );

    res.json({
      success,
      message: success ? 'Contribution successful' : 'Contribution failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to contribute to alliance pool',
    });
  }
});

/**
 * POST /api/alliances/withdraw
 * Withdraw resources from alliance pool
 */
router.post('/withdraw', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { allianceId, metals, credits } = req.body;

    if (!allianceId || !metals || !credits) {
      return res.status(400).json({
        success: false,
        error: 'Alliance ID, metals, and credits are required',
      });
    }

    const success = await MultiplayerBonusesService.withdrawFromPool(
      userId,
      allianceId,
      metals,
      credits
    );

    res.json({
      success,
      message: success ? 'Withdrawal successful' : 'Withdrawal failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to withdraw from alliance pool',
    });
  }
});

/**
 * GET /api/alliances/leaderboard
 * Get alliance leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const leaderboard = await MultiplayerBonusesService.getAllianceLeaderboard(limit);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
    });
  }
});

/**
 * GET /api/alliances/cooperative-bonus/:participants
 * Calculate cooperative research bonus for given participant count
 */
router.get('/cooperative-bonus/:participants', (req, res) => {
  try {
    const participants = Math.max(1, parseInt(req.params.participants) || 1);
    const bonus = MultiplayerBonusesService.calculateCoopResearchBonus(participants);

    res.json({
      success: true,
      data: {
        participantCount: participants,
        ...bonus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate cooperative bonus',
    });
  }
});

/**
 * POST /api/alliances/sync-bonuses
 * Force sync of alliance bonuses to research
 */
router.post('/sync-bonuses', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    await MultiplayerBonusesService.syncAllianceBonusesToResearch(userId);

    res.json({
      success: true,
      message: 'Alliance bonuses synced to research',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to sync bonuses',
    });
  }
});

export default router;
