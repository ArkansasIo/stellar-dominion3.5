import express from 'express';
import { isAuthenticated } from './basicAuth';
import PlayerXpService from './services/playerXpService';
import { PAGE_XP_SOURCES, getPageXpSources } from '@shared/config/pageXpConfig';

const router = express.Router();

router.get('/api/player/xp', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const info = await PlayerXpService.getXpInfo(userId);
    res.json({ success: true, ...info });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get XP info',
    });
  }
});

router.post('/api/player/xp/award', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, source, category, page, subPage, action, label } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid XP amount' });
    }
    if (!source) {
      return res.status(400).json({ error: 'source is required' });
    }

    const result = await PlayerXpService.awardXp(userId, amount, source, {
      category, page, subPage, action, label,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to award XP',
    });
  }
});

router.post('/api/player/xp/award-page-action', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { page, action, subPage } = req.body;

    if (!page || !action) {
      return res.status(400).json({ error: 'page and action are required' });
    }

    const result = await PlayerXpService.awardPageActionXp(userId, page, action, subPage);

    if (!result) {
      return res.json({ success: true, awarded: false, reason: 'cooldown or no config' });
    }

    res.json({ success: true, awarded: true, ...result });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to award page XP',
    });
  }
});

router.get('/api/player/xp/history', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const limit = parseInt(req.query.limit as string) || 20;
    const history = await PlayerXpService.getRecentXpHistory(userId, limit);

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get XP history',
    });
  }
});

router.get('/api/player/xp/breakdown', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session?.userId || "";
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const breakdown = await PlayerXpService.getXpBreakdown(userId);

    res.json({ success: true, breakdown });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get XP breakdown',
    });
  }
});

router.get('/api/player/xp/page-sources', isAuthenticated, async (req, res) => {
  try {
    const page = req.query.page as string;
    if (page) {
      return res.json({ success: true, sources: getPageXpSources(page) });
    }
    res.json({ success: true, sources: PAGE_XP_SOURCES });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get page sources',
    });
  }
});

export default router;
