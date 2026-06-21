import type { Express, Request, Response } from 'express';
import { isAuthenticated } from './basicAuth';
import { storage } from './storage';
import {
  GOVERNMENT_LEADER_TYPES_23,
  GOVERNMENT_LEADER_TYPE_COUNT,
  getGovernmentLeadersByType,
  getGovernmentLeadersByClass,
  getGovernmentLeaderTypes,
  getGovernmentLeaderClasses,
} from '../shared/config/governmentLeadersConfig';

const GOVERNMENT_APPOINTMENTS_PREFIX = 'government_appointments';
const GOVERNMENT_SYSTEMS_PREFIX = 'government_systems';

function getUserId(req: Request): string {
  return (req.session as any)?.userId || '';
}

function getAppointmentsKey(userId: string) {
  return `${GOVERNMENT_APPOINTMENTS_PREFIX}:${userId}`;
}

function getGovernmentSystemsKey(userId: string) {
  return `${GOVERNMENT_SYSTEMS_PREFIX}:${userId}`;
}

function normalizeAppointments(value: any) {
  return {
    cabinet: value?.cabinet && typeof value.cabinet === 'object' ? value.cabinet : {},
    doctrine: value?.doctrine && typeof value.doctrine === 'object' ? value.doctrine : {
      civicFocus: 'balanced',
      fieldPosture: 'defensive',
      civilMandate: 'growth',
    },
  };
}

function clampPercent(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function normalizeGovernmentSystems(value: any) {
  return {
    directives: {
      executiveStyle: String(value?.directives?.executiveStyle || 'delegated'),
      legislativeAgenda: String(value?.directives?.legislativeAgenda || 'charter'),
      judicialDoctrine: String(value?.directives?.judicialDoctrine || 'balanced'),
      securityPosture: String(value?.directives?.securityPosture || 'measured'),
      economicModel: String(value?.directives?.economicModel || 'mixed'),
      scienceMandate: String(value?.directives?.scienceMandate || 'applied'),
    },
    allocations: {
      civilBudget: clampPercent(value?.allocations?.civilBudget, 52),
      defenseBudget: clampPercent(value?.allocations?.defenseBudget, 48),
      tradeBudget: clampPercent(value?.allocations?.tradeBudget, 61),
      researchBudget: clampPercent(value?.allocations?.researchBudget, 56),
      oversightBudget: clampPercent(value?.allocations?.oversightBudget, 50),
    },
  };
}

export function registerGovernmentLeaderRoutes(app: Express) {
  app.get('/api/government-leaders', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: GOVERNMENT_LEADER_TYPE_COUNT,
      leaders: GOVERNMENT_LEADER_TYPES_23,
      leaderTypes: getGovernmentLeaderTypes(),
      leaderClasses: getGovernmentLeaderClasses(),
    });
  });

  app.get('/api/government-leaders/type/:type', (req: Request, res: Response) => {
    const type = String(req.params.type || '');
    const leaders = getGovernmentLeadersByType(type);

    res.json({
      success: true,
      type,
      total: leaders.length,
      leaders,
    });
  });

  app.get('/api/government-leaders/class/:leaderClass', (req: Request, res: Response) => {
    const leaderClass = String(req.params.leaderClass || '');
    const leaders = getGovernmentLeadersByClass(leaderClass);

    res.json({
      success: true,
      leaderClass,
      total: leaders.length,
      leaders,
    });
  });

  app.get('/api/government-leaders/appointments/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getAppointmentsKey(userId));
      res.json({ success: true, appointments: normalizeAppointments(setting?.value) });
    } catch (error) {
      console.error('[government-leaders/appointments]', error);
      res.status(500).json({ success: false, message: 'Failed to load government appointments' });
    }
  });

  app.put('/api/government-leaders/appointments/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const current = await storage.getSetting(getAppointmentsKey(userId));
      const next = normalizeAppointments({ ...(current?.value || {}), ...(req.body || {}) });
      await storage.setSetting(
        getAppointmentsKey(userId),
        next,
        'Per-player government cabinet appointments and doctrine settings',
        'player-state'
      );
      res.json({ success: true, appointments: next });
    } catch (error) {
      console.error('[government-leaders/appointments:update]', error);
      res.status(500).json({ success: false, message: 'Failed to update government appointments' });
    }
  });

  app.get('/api/government-leaders/systems/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const setting = await storage.getSetting(getGovernmentSystemsKey(userId));
      res.json({ success: true, systems: normalizeGovernmentSystems(setting?.value) });
    } catch (error) {
      console.error('[government-leaders/systems]', error);
      res.status(500).json({ success: false, message: 'Failed to load government systems state' });
    }
  });

  app.put('/api/government-leaders/systems/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const current = await storage.getSetting(getGovernmentSystemsKey(userId));
      const currentValue = (current?.value || {}) as any;
      const payload = (req.body || {}) as any;
      const next = normalizeGovernmentSystems({
        ...currentValue,
        ...payload,
        directives: {
          ...(currentValue.directives || {}),
          ...(payload.directives || {}),
        },
        allocations: {
          ...(currentValue.allocations || {}),
          ...(payload.allocations || {}),
        },
      });

      await storage.setSetting(
        getGovernmentSystemsKey(userId),
        next,
        'Per-player government systems state with directive and budget allocations',
        'player-state'
      );
      res.json({ success: true, systems: next });
    } catch (error) {
      console.error('[government-leaders/systems:update]', error);
      res.status(500).json({ success: false, message: 'Failed to update government systems state' });
    }
  });
}
