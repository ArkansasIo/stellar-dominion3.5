import type { Express, Request, Response } from 'express';
import { isAuthenticated } from './basicAuth';
import {
  getConstructorYardCatalog,
  getConstructorYardMeta,
  getConstructorYardStatus,
  previewUpgrade,
  startUpgrade,
  completeUpgrade,
  completeAllReadyUpgrades,
} from './services/constructorYardService';
import { getYardEntryById, type YardDomain } from '../shared/config/constructorYardSystemsConfig';

function getUserId(req: Request): string {
  return (req.session as any)?.userId || '';
}

function isYardDomain(value: unknown): value is YardDomain {
  return value === 'mothership' || value === 'starship';
}

export function registerConstructorYardRoutes(app: Express) {
  app.get('/api/constructor-yard/meta', isAuthenticated, (_req: Request, res: Response) => {
    res.json({ success: true, meta: getConstructorYardMeta() });
  });

  app.get('/api/constructor-yard/catalog', isAuthenticated, (req: Request, res: Response) => {
    const domainRaw = req.query.domain;
    if (domainRaw && !isYardDomain(domainRaw)) {
      return res.status(400).json({ success: false, message: 'domain must be mothership or starship' });
    }

    const entries = getConstructorYardCatalog(domainRaw as YardDomain | undefined);
    res.json({ success: true, total: entries.length, entries });
  });

  app.get('/api/constructor-yard/entries/:entryId', isAuthenticated, (req: Request, res: Response) => {
    const entry = getYardEntryById(String(req.params.entryId || ''));
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, entry });
  });

  app.get('/api/constructor-yard/status/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      await completeAllReadyUpgrades(userId);
      const status = await getConstructorYardStatus(userId);
      res.json({ success: true, status });
    } catch (error) {
      console.error('[constructor-yard/status/me]', error);
      res.status(500).json({ success: false, message: 'Failed to load constructor yard status' });
    }
  });

  app.post('/api/constructor-yard/upgrade/preview', isAuthenticated, async (req: Request, res: Response) => {
    const { entryId, targetLevel } = req.body || {};
    const userId = getUserId(req);

    if (!entryId || !targetLevel) {
      return res.status(400).json({ success: false, message: 'entryId and targetLevel are required' });
    }

    const status = await getConstructorYardStatus(userId);
    const currentLevel = status.state.levels[entryId] || 1;
    const preview = previewUpgrade(entryId, currentLevel, Number(targetLevel));

    if (!preview.success) {
      return res.status(400).json(preview);
    }

    res.json(preview);
  });

  app.post('/api/constructor-yard/upgrade/start', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { entryId, targetLevel } = req.body || {};
      const userId = getUserId(req);

      if (!entryId || !targetLevel) {
        return res.status(400).json({ success: false, message: 'entryId and targetLevel are required' });
      }

      const result = await startUpgrade(userId, String(entryId), Number(targetLevel));
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('[constructor-yard/upgrade/start]', error);
      res.status(500).json({ success: false, message: 'Failed to start upgrade' });
    }
  });

  app.post('/api/constructor-yard/upgrade/complete', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { entryId } = req.body || {};
      const userId = getUserId(req);

      if (!entryId) {
        return res.status(400).json({ success: false, message: 'entryId is required' });
      }

      const result = await completeUpgrade(userId, String(entryId));
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('[constructor-yard/upgrade/complete]', error);
      res.status(500).json({ success: false, message: 'Failed to complete upgrade' });
    }
  });
}
