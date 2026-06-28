/**
 * Research Achievement System Routes
 * Endpoints for achievement tracking and badge management
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import { AchievementService } from './services/achievementService';

const router = Router();

/**
 * GET /api/achievements
 * Get player's achievements
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const achievements = await AchievementService.getPlayerAchievements(userId);

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements',
    });
  }
});

/**
 * GET /api/achievements/details/:achievementId
 * Get specific achievement details
 */
router.get('/details/:achievementId', async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievement = await AchievementService.getAchievementDetails(achievementId);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found',
      });
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement',
    });
  }
});

/**
 * GET /api/achievements/badges
 * Get player's badges
 */
router.get('/badges', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const badges = await AchievementService.getPlayerBadges(userId);

    res.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badges',
    });
  }
});

/**
 * POST /api/achievements/update-research
 * Update research milestone progress (internal)
 */
router.post('/update-research', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { techCount } = req.body;

    if (techCount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Tech count is required',
      });
    }

    const updated = await AchievementService.updateResearchMilestone(userId, techCount);

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update research milestone',
    });
  }
});

/**
 * POST /api/achievements/record-discovery
 * Record discovery and check discovery achievements
 */
router.post('/record-discovery', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { discoveryCount } = req.body;

    if (discoveryCount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Discovery count is required',
      });
    }

    const updated = await AchievementService.recordDiscovery(userId, discoveryCount);

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record discovery',
    });
  }
});

/**
 * POST /api/achievements/update-level
 * Update level achievement progress
 */
router.post('/update-level', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { currentLevel } = req.body;

    if (currentLevel === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Current level is required',
      });
    }

    const updated = await AchievementService.updateLevelAchievement(userId, currentLevel);

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update level achievement',
    });
  }
});

/**
 * GET /api/achievements/stats
 * Get achievement statistics
 */
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const stats = await AchievementService.getAchievementStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement stats',
    });
  }
});

/**
 * GET /api/achievements/leaderboard
 * Get achievement leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const leaderboard = await AchievementService.getAchievementLeaderboard(limit);

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
 * POST /api/achievements/award/:achievementId
 * Award specific achievement (admin)
 */
router.post('/award/:achievementId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { achievementId } = req.params;

    const success = await AchievementService.awardSpecificAchievement(userId, achievementId);

    res.json({
      success,
      message: success ? 'Achievement awarded' : 'Achievement not found or already unlocked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to award achievement',
    });
  }
});

/**
 * POST /api/achievements/update-specialization
 * Update specialization achievement
 */
router.post('/update-specialization', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { category, techCount } = req.body;

    if (!category || techCount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Category and tech count are required',
      });
    }

    const updated = await AchievementService.updateSpecializationAchievement(
      userId,
      category,
      techCount
    );

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update specialization achievement',
    });
  }
});

export default router;
