/**
 * Research XP Routes
 * REST API endpoints for research experience, leveling, and discovery
 * @tag #research-xp #api #discovery
 */

import express from 'express';
import { isAuthenticated } from './basicAuth';
import ResearchXPService from './services/researchXPService';
import { RESEARCH_XP_CONFIG, XP_LEVEL_CONFIG } from '../shared/config/researchXPConfig';

const router = express.Router();

/**
 * GET /api/research/xp/stats
 * Get player research XP and level statistics
 */
router.get('/api/research/xp/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const stats = await ResearchXPService.getPlayerXPStats(userId);
    res.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get XP stats',
    });
  }
});

/**
 * POST /api/research/xp/add
 * Add XP to player (admin or system use)
 * Body: { amount: number, sourceType?: string }
 */
router.post('/api/research/xp/add', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, sourceType = 'manual' } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }

    const result = await ResearchXPService.addResearchXP(userId, amount, sourceType);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to add XP',
    });
  }
});

/**
 * POST /api/research/xp/complete-research
 * Complete research and generate XP + potential discovery
 * Body: { techId: string, techTier: string, techClass: string, baseTurns: number }
 */
router.post('/api/research/xp/complete-research', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { techId, techTier, techClass, baseTurns } = req.body;

    if (!techId || !techTier || !techClass || typeof baseTurns !== 'number') {
      return res.status(400).json({ error: 'Invalid research data' });
    }

    const result = await ResearchXPService.completeResearch(
      userId,
      techId,
      techTier,
      techClass,
      baseTurns
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to complete research',
    });
  }
});

/**
 * GET /api/research/discoveries
 * Get player's recent discoveries
 * Query: ?limit=20
 */
router.get('/api/research/discoveries', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const discoveries = await ResearchXPService.getDiscoveries(userId, limit);

    res.json({
      success: true,
      discoveries,
      count: discoveries.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get discoveries',
    });
  }
});

/**
 * GET /api/research/leaderboard
 * Get XP leaderboard
 * Query: ?limit=100
 */
router.get('/api/research/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const leaderboard = await ResearchXPService.getXPLeaderboard(limit);

    res.json({
      success: true,
      leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get leaderboard',
    });
  }
});

/**
 * GET /api/research/xp/config
 * Get XP and discovery configuration (public)
 */
router.get('/api/research/xp/config', (req, res) => {
  res.json({
    xpConfig: RESEARCH_XP_CONFIG,
    xpLevelConfig: XP_LEVEL_CONFIG,
    discoveryTypes: {
      tech_unlock: 'Unlock a new technology',
      resource_bonus: 'Gain resource production bonus',
      speed_boost: 'Temporary research speed boost',
      tech_advancement: 'Advance progress on next research',
      breakthrough: 'Major scientific breakthrough',
      ancient_knowledge: 'Unlock ancient technology',
    },
  });
});

/**
 * GET /api/research/xp/next-level-info
 * Get information about next level
 */
router.get('/api/research/xp/next-level-info', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const stats = await ResearchXPService.getPlayerXPStats(userId);
    const nextLevel = stats.currentLevel + 1;
    const nextLevelXPNeeded = stats.nextLevelXP;

    res.json({
      success: true,
      currentLevel: stats.currentLevel,
      nextLevel,
      currentLevelXP: stats.currentLevelXP,
      nextLevelXPNeeded,
      xpUntilNextLevel: nextLevelXPNeeded - stats.currentLevelXP,
      percentToNextLevel: ((stats.currentLevelXP / nextLevelXPNeeded) * 100).toFixed(1),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get level info',
    });
  }
});

/**
 * POST /api/research/xp/check-discovery
 * Check if player can discover a tech
 * Body: { techId: string }
 */
router.post('/api/research/xp/check-discovery', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { techId } = req.body;
    if (!techId) return res.status(400).json({ error: 'Missing techId' });

    const canDiscover = await ResearchXPService.canDiscoverTech(userId, techId);

    res.json({
      success: true,
      techId,
      canDiscover,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to check discovery',
    });
  }
});

/**
 * GET /api/research/xp/level-rewards/:level
 * Get rewards for a specific XP level
 */
router.get('/api/research/xp/level-rewards/:level', (req, res) => {
  try {
    const level = parseInt(req.params.level);
    
    if (isNaN(level) || level < 1 || level > XP_LEVEL_CONFIG.MAX_LEVEL) {
      return res.status(400).json({ error: 'Invalid level' });
    }

    const rewards = ResearchXPService.getLevelUpRewards(level);

    res.json({
      success: true,
      level,
      rewards,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get level rewards',
    });
  }
});

export default router;
