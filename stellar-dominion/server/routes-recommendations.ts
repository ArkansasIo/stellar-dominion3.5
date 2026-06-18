/**
 * Research Recommendations Routes
 * REST API endpoints for research path suggestions and strategy analysis
 * @tag #research #recommendations #api
 */

import express from 'express';
import { isAuthenticated } from './basicAuth';
import ResearchRecommendationsService from './services/researchRecommendationsService';

const router = express.Router();

/**
 * GET /api/research/recommendations
 * Get top research recommendations for player
 * Query: ?limit=5
 */
router.get('/api/research/recommendations', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const limit = Math.min(parseInt(req.query.limit as string) || 5, 20);
    const result = await ResearchRecommendationsService.getRecommendations(userId, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get recommendations',
    });
  }
});

/**
 * POST /api/research/recommendations/path
 * Get research path to a specific goal tech
 * Body: { goalTechId: string }
 */
router.post('/api/research/recommendations/path', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { goalTechId } = req.body;
    if (!goalTechId) {
      return res.status(400).json({ error: 'Missing goalTechId' });
    }

    const result = await ResearchRecommendationsService.getResearchPath(userId, goalTechId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get research path',
    });
  }
});

/**
 * POST /api/research/recommendations/optimize-queue
 * Get optimal queuing order for research items
 * Body: { techIds: string[] }
 */
router.post('/api/research/recommendations/optimize-queue', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { techIds } = req.body;
    if (!Array.isArray(techIds) || techIds.length === 0) {
      return res.status(400).json({ error: 'Invalid tech IDs array' });
    }

    const result = await ResearchRecommendationsService.getOptimalQueue(userId, techIds);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to optimize queue',
    });
  }
});

/**
 * GET /api/research/recommendations/strategy
 * Get strategic analysis of player's research progress
 */
router.get('/api/research/recommendations/strategy', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await ResearchRecommendationsService.getStrategyAnalysis(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get strategy analysis',
    });
  }
});

export default router;
