/**
 * Research Trading Routes
 * REST API endpoints for player-to-player research trading
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import ResearchTradingService from './services/researchTradingService';

const router = Router();

/**
 * Create a new trade request
 * POST /api/trading/request/create
 */
router.post('/request/create', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { recipientId, initiatorOffer, recipientOffer } = req.body;
    const trade = await ResearchTradingService.createTradeRequest(userId, recipientId, initiatorOffer, recipientOffer);
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get all active trades for user
 * GET /api/trading/active
 */
router.get('/active', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const trades = await ResearchTradingService.getActiveTrades(userId);
    res.json({ success: true, data: trades });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get specific trade by ID
 * GET /api/trading/:tradeId
 */
router.get('/:tradeId', isAuthenticated, async (req, res) => {
  try {
    const trade = await ResearchTradingService.getTrade(req.params.tradeId);
    if (!trade) return res.status(404).json({ success: false, error: 'Trade not found' });
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Accept a trade request
 * POST /api/trading/:tradeId/accept
 */
router.post('/:tradeId/accept', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const trade = await ResearchTradingService.acceptTrade(req.params.tradeId, userId);
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Reject a trade request
 * POST /api/trading/:tradeId/reject
 */
router.post('/:tradeId/reject', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { reason } = req.body;
    const trade = await ResearchTradingService.rejectTrade(req.params.tradeId, userId, reason);
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Cancel a trade request
 * POST /api/trading/:tradeId/cancel
 */
router.post('/:tradeId/cancel', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const success = await ResearchTradingService.cancelTrade(req.params.tradeId, userId);
    res.json({ success, data: { tradeId: req.params.tradeId } });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Complete trade settlement
 * POST /api/trading/:tradeId/settle
 */
router.post('/:tradeId/settle', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const trade = await ResearchTradingService.settleTrade(req.params.tradeId);
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get trade history
 * GET /api/trading/history
 */
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const history = await ResearchTradingService.getTradeHistory(userId, limit);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get player trade rating
 * GET /api/trading/rating/:playerId
 */
router.get('/rating/:playerId', async (req, res) => {
  try {
    const rating = await ResearchTradingService.getTradeRating(req.params.playerId);
    res.json({ success: true, data: rating });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get trade statistics
 * GET /api/trading/statistics
 */
router.get('/statistics', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const stats = await ResearchTradingService.getTradeStatistics(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Update trade offer
 * PUT /api/trading/:tradeId/offer
 */
router.put('/:tradeId/offer', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { newOffer } = req.body;
    const trade = await ResearchTradingService.updateTradeOffer(req.params.tradeId, userId, newOffer);
    res.json({ success: true, data: trade });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get marketplace trades
 * GET /api/trading/marketplace
 */
router.get('/marketplace', async (req, res) => {
  try {
    const { minValue, maxValue, minRating, researchType } = req.query;
    const trades = await ResearchTradingService.getMarketplaceTrades({
      minValue: minValue ? parseInt(minValue as string) : undefined,
      maxValue: maxValue ? parseInt(maxValue as string) : undefined,
      minRating: minRating ? parseInt(minRating as string) : undefined,
      researchType: researchType as string,
    });
    res.json({ success: true, data: trades });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Search marketplace
 * GET /api/trading/search
 */
router.get('/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    if (!query || !type) {
      return res.status(400).json({ success: false, error: 'Query and type are required' });
    }
    const trades = await ResearchTradingService.searchTrades(query as string, type as 'player' | 'research');
    res.json({ success: true, data: trades });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Validate trade value
 * POST /api/trading/validate
 */
router.post('/validate', async (req, res) => {
  try {
    const { initiatorOffer, recipientOffer } = req.body;
    const validation = await ResearchTradingService.validateTradeValue(initiatorOffer, recipientOffer);
    res.json({ success: true, data: validation });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get trade recommendations
 * GET /api/trading/recommendations
 */
router.get('/recommendations', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const recommendations = await ResearchTradingService.getTradeRecommendations(userId);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Simulate trade outcome
 * POST /api/trading/simulate
 */
router.post('/simulate', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { initiatorOffer, recipientOffer } = req.body;
    const simulation = await ResearchTradingService.simulateTradeOutcome(userId, initiatorOffer, recipientOffer);
    res.json({ success: true, data: simulation });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Start trade dispute
 * POST /api/trading/:tradeId/dispute
 */
router.post('/:tradeId/dispute', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { reason } = req.body;
    const dispute = await ResearchTradingService.startDispute(req.params.tradeId, userId, reason);
    res.json({ success: true, data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Rate trade partner
 * POST /api/trading/player/:playerId/rate
 */
router.post('/player/:playerId/rate', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { rating, review } = req.body;
    const success = await ResearchTradingService.ratePlayer(userId, req.params.playerId, rating, review);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Block player from trading
 * POST /api/trading/player/:playerId/block
 */
router.post('/player/:playerId/block', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const success = await ResearchTradingService.blockPlayer(userId, req.params.playerId);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get blocked players
 * GET /api/trading/blocked
 */
router.get('/blocked', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const blocked = await ResearchTradingService.getBlockedPlayers(userId);
    res.json({ success: true, data: blocked });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get pending trades requiring action
 * GET /api/trading/pending
 */
router.get('/pending', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const pending = await ResearchTradingService.getPendingTradesRequiringAction(userId);
    res.json({ success: true, data: pending });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Accept bulk trades
 * POST /api/trading/accept-bulk
 */
router.post('/accept-bulk', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { tradeIds } = req.body;
    const result = await ResearchTradingService.acceptBulkTrades(userId, tradeIds);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Validate player eligibility for trading
 * GET /api/trading/eligible
 */
router.get('/eligible', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const eligibility = await ResearchTradingService.validatePlayerEligibility(userId);
    res.json({ success: true, data: eligibility });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get available research for trading
 * GET /api/trading/available-research
 */
router.get('/available-research', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const research = await ResearchTradingService.getAvailableResearch(userId);
    res.json({ success: true, data: research });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
