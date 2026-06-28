/**
 * Government Progression Routes
 * API endpoints for managing government progression tree
 */

import type { Express, Request, Response } from 'express';
import { isAuthenticated } from './basicAuth';
import {
  getUserGovernmentProgression,
  getGovernmentStatus,
  getPillarStatus,
  getAvailableNodes,
  unlockNode,
  rankUpNode,
  addGovernmentXP,
  resetGovernmentProgression,
  getGovernmentNodeById,
  getNodesByPillar,
  calculateNodeCost,
  calculateUnlockTime,
  initializeUserGovernmentProgression,
} from './services/governmentProgressionService';
import { GOVERNMENT_PROGRESSION_TREE_DEFINITION } from '../shared/config/governmentProgressionTreeConfig';

function getUserId(req: Request): string {
  return (req.session as any)?.userId || '';
}

export function registerGovernmentProgressionRoutes(app: Express) {
  /**
   * GET /api/government-progression/tree
   * Returns the full government progression tree definition
   */
  app.get('/api/government-progression/tree', isAuthenticated, (_req: Request, res: Response) => {
    res.json({
      success: true,
      tree: GOVERNMENT_PROGRESSION_TREE_DEFINITION,
    });
  });

  /**
   * GET /api/government-progression/status
   * Returns the current user's government progression status
   */
  app.get('/api/government-progression/status', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const status = await getGovernmentStatus(userId);

      res.json({
        success: true,
        status,
      });
    } catch (error) {
      console.error('[government-progression/status]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch government status' });
    }
  });

  /**
   * GET /api/government-progression/pillars
   * Returns pillar status (stability, law, economic)
   */
  app.get('/api/government-progression/pillars', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const pillars = await getPillarStatus(userId);

      res.json({
        success: true,
        pillars,
      });
    } catch (error) {
      console.error('[government-progression/pillars]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch pillar status' });
    }
  });

  /**
   * GET /api/government-progression/available-nodes
   * Returns nodes that can be unlocked right now
   */
  app.get('/api/government-progression/available-nodes', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const progression = await getUserGovernmentProgression(userId);
      const availableNodes = getAvailableNodes(userId, progression);

      res.json({
        success: true,
        availableNodes,
        count: availableNodes.length,
      });
    } catch (error) {
      console.error('[government-progression/available-nodes]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch available nodes' });
    }
  });

  /**
   * GET /api/government-progression/pillar/:pillar
   * Returns all nodes for a specific pillar
   */
  app.get('/api/government-progression/pillar/:pillar', isAuthenticated, (req: Request, res: Response) => {
    const pillar = String(req.params.pillar) as any;

    if (!['stability', 'law', 'economic'].includes(pillar)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pillar',
      });
    }

    const nodes = getNodesByPillar(pillar);

    res.json({
      success: true,
      pillar,
      nodes,
      count: nodes.length,
    });
  });

  /**
   * GET /api/government-progression/node/:nodeId
   * Returns details about a specific node
   */
  app.get('/api/government-progression/node/:nodeId', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const nodeId = String(req.params.nodeId);
      const node = getGovernmentNodeById(nodeId);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found',
        });
      }

      const userId = getUserId(req);
      const progression = await getUserGovernmentProgression(userId);
      const rank = progression.nodeRanks[nodeId] || 0;

      res.json({
        success: true,
        node,
        isUnlocked: progression.unlockedNodes.includes(nodeId),
        currentRank: rank,
        nextRankCost:
          rank < node.maxRank ? calculateNodeCost(node, rank + 1) : null,
        nextRankTime:
          rank < node.maxRank ? calculateUnlockTime(node, rank + 1) : null,
      });
    } catch (error) {
      console.error('[government-progression/node]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch node details' });
    }
  });

  /**
   * POST /api/government-progression/unlock
   * Unlock a governance node
   * Body: { nodeId: string, rank?: number }
   */
  app.post('/api/government-progression/unlock', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { nodeId, rank = 1 } = req.body;

      if (!nodeId) {
        return res.status(400).json({
          success: false,
          message: 'nodeId is required',
        });
      }

      const result = await unlockNode(userId, nodeId, rank);

      res.json(result);
    } catch (error) {
      console.error('[government-progression/unlock]', error);
      res.status(500).json({ success: false, message: 'Failed to unlock node' });
    }
  });

  /**
   * POST /api/government-progression/rankup
   * Increase rank of an unlocked node
   * Body: { nodeId: string }
   */
  app.post('/api/government-progression/rankup', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { nodeId } = req.body;

      if (!nodeId) {
        return res.status(400).json({
          success: false,
          message: 'nodeId is required',
        });
      }

      const result = await rankUpNode(userId, nodeId);

      res.json(result);
    } catch (error) {
      console.error('[government-progression/rankup]', error);
      res.status(500).json({ success: false, message: 'Failed to rank up node' });
    }
  });

  /**
   * POST /api/government-progression/add-xp
   * Add government XP to the user
   * Body: { amount: number, pillar?: 'stability' | 'law' | 'economic' }
   */
  app.post('/api/government-progression/add-xp', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { amount, pillar } = req.body;

      if (!amount || amount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid amount is required',
        });
      }

      const result = await addGovernmentXP(userId, amount, pillar);

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error('[government-progression/add-xp]', error);
      res.status(500).json({ success: false, message: 'Failed to add XP' });
    }
  });

  /**
   * POST /api/government-progression/reset
   * Reset government progression (admin only - add auth check if needed)
   */
  app.post('/api/government-progression/reset', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const progression = await resetGovernmentProgression(userId);

      res.json({
        success: true,
        message: 'Government progression reset',
        progression,
      });
    } catch (error) {
      console.error('[government-progression/reset]', error);
      res.status(500).json({ success: false, message: 'Failed to reset progression' });
    }
  });

  /**
   * GET /api/government-progression/tree/node-calculations/:nodeId/:rank
   * Get detailed cost and time calculations for a node at a specific rank
   */
  app.get(
    '/api/government-progression/tree/node-calculations/:nodeId/:rank',
    isAuthenticated,
    (req: Request, res: Response) => {
      const { nodeId, rank } = req.params;
      const rankNum = parseInt(rank, 10);

      const node = getGovernmentNodeById(nodeId);

      if (!node) {
        return res.status(404).json({
          success: false,
          message: 'Node not found',
        });
      }

      if (rankNum < 1 || rankNum > node.maxRank) {
        return res.status(400).json({
          success: false,
          message: `Rank must be between 1 and ${node.maxRank}`,
        });
      }

      const cost = calculateNodeCost(node, rankNum);
      const time = calculateUnlockTime(node, rankNum);

      res.json({
        success: true,
        node: nodeId,
        rank: rankNum,
        cost,
        time,
      });
    }
  );

  /**
   * GET /api/government-progression/init
   * Initialize government progression for new user
   */
  app.get('/api/government-progression/init', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const progression = await initializeUserGovernmentProgression(userId);

      res.json({
        success: true,
        message: 'Government progression initialized',
        progression,
      });
    } catch (error) {
      console.error('[government-progression/init]', error);
      res.status(500).json({ success: false, message: 'Failed to initialize progression' });
    }
  });
}
