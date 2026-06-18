/**
 * Auto-Buy Resources Routes
 * REST API endpoints for auto-buy resource management
 * @tag #api #routes #market
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import AutoBuyResourcesService from './services/autoBuyResourcesService';

const router = Router();

/**
 * Initialize auto-buy session
 * POST /api/autobuy/session/initialize
 */
router.post('/session/initialize', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const session = await AutoBuyResourcesService.initializeAutoBuySession(userId);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get auto-buy session
 * GET /api/autobuy/session
 */
router.get('/session', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const session = await AutoBuyResourcesService.getAutoBuySession(userId);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Pause auto-buy session
 * POST /api/autobuy/session/pause
 */
router.post('/session/pause', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { reason, duration } = req.body;
    const session = await AutoBuyResourcesService.pauseAutoBuySession(userId, reason, duration);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Resume auto-buy session
 * POST /api/autobuy/session/resume
 */
router.post('/session/resume', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const session = await AutoBuyResourcesService.resumeAutoBuySession(userId);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Create auto-buy rule
 * POST /api/autobuy/rules/create
 */
router.post('/rules/create', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const rule = await AutoBuyResourcesService.createAutoBuyRule(userId, req.body);
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get all auto-buy rules
 * GET /api/autobuy/rules
 */
router.get('/rules', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const rules = await AutoBuyResourcesService.getAutoBuyRules(userId);
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Update auto-buy rule
 * PUT /api/autobuy/rules/:ruleId
 */
router.put('/rules/:ruleId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const rule = await AutoBuyResourcesService.updateAutoBuyRule(userId, req.params.ruleId, req.body);
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Delete auto-buy rule
 * DELETE /api/autobuy/rules/:ruleId
 */
router.delete('/rules/:ruleId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const success = await AutoBuyResourcesService.deleteAutoBuyRule(userId, req.params.ruleId);
    res.json({ success, data: { ruleId: req.params.ruleId } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Toggle auto-buy rule
 * POST /api/autobuy/rules/:ruleId/toggle
 */
router.post('/rules/:ruleId/toggle', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { enabled } = req.body;
    const rule = await AutoBuyResourcesService.toggleAutoBuyRule(userId, req.params.ruleId, enabled);
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Execute manual purchase
 * POST /api/autobuy/purchase
 */
router.post('/purchase', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { resource, amount, maxPrice, sellerId } = req.body;
    const result = await AutoBuyResourcesService.executePurchase(userId, resource, amount, maxPrice, sellerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get resource market analysis
 * GET /api/autobuy/market/:resource
 */
router.get('/market/:resource', async (req, res) => {
  try {
    const analysis = await AutoBuyResourcesService.getResourceMarketAnalysis(req.params.resource);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get seller profile
 * GET /api/autobuy/seller/:sellerId
 */
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const profile = await AutoBuyResourcesService.getSellerProfile(req.params.sellerId);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get auto-buy statistics
 * GET /api/autobuy/statistics
 */
router.get('/statistics', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const stats = await AutoBuyResourcesService.getAutoBuyStatistics(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get purchase history
 * GET /api/autobuy/history
 */
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const history = await AutoBuyResourcesService.getPurchaseHistory(userId, limit);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Set resource limits
 * POST /api/autobuy/limits
 */
router.post('/limits', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const result = await AutoBuyResourcesService.setResourceLimits(userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get active alerts
 * GET /api/autobuy/alerts
 */
router.get('/alerts', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const alerts = await AutoBuyResourcesService.getActiveAlerts(userId);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get recommended purchases
 * GET /api/autobuy/recommendations
 */
router.get('/recommendations', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const recommendations = await AutoBuyResourcesService.getRecommendedPurchases(userId);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Simulate auto-buy purchases
 * GET /api/autobuy/simulate
 */
router.get('/simulate', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const simulation = await AutoBuyResourcesService.simulatePurchases(userId, days);
    res.json({ success: true, data: simulation });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
