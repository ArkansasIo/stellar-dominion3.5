import type { Express, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { isAuthenticated } from './basicAuth';
import { db } from './db';
import { playerStates } from '../shared/schema';
import { storage } from './storage';
import {
  UNIT_SYSTEM_TEMPLATES,
  STARSHIP_BLUEPRINTS,
  createDefaultPlayerUnitSystemState,
  getUnitTemplatesByDomain,
  processTrainingQueue,
  queueUnitTraining,
  untrainUnits,
  simulateUnitCombat,
  queueStarshipConstruction,
  processConstructionYard,
  type UnitDomain,
  type PlayerUnitSystemState,
  type CombatSideInput,
} from '../shared/config/unitSystemsConfig';

const UNIT_SYSTEM_SETTINGS_PREFIX = 'player_unit_system';

const isValidDomain = (value: unknown): value is UnitDomain =>
  value === 'troop' || value === 'civilian' || value === 'government' || value === 'military';

function getUserId(req: Request): string {
  return (req.session as any)?.userId || '';
}

function getUnitSystemSettingKey(userId: string) {
  return `${UNIT_SYSTEM_SETTINGS_PREFIX}:${userId}`;
}

type UnitSystemMeta = {
  buildings: Record<string, number>;
  trainingFacilityLevel: number;
  fieldCommandLevel: number;
  civilianCapacity: number;
  governmentCapacity: number;
  militaryCapacity: number;
};

async function getPlayerState(userId: string) {
  return db.query.playerStates.findFirst({
    where: eq(playerStates.userId, userId),
  });
}

function getMetaFromPlayerState(playerState: any): UnitSystemMeta {
  const buildings = ((playerState?.buildings as Record<string, number>) || {}) as Record<string, number>;
  const trainingFacilityLevel = Number(buildings.researchLab || 0);
  const fieldCommandLevel = Number(buildings.shipyard || 0);
  const roboticsFactory = Number(buildings.roboticsFactory || 0);

  return {
    buildings,
    trainingFacilityLevel,
    fieldCommandLevel,
    civilianCapacity: 50 + trainingFacilityLevel * 25,
    governmentCapacity: 20 + Math.floor((trainingFacilityLevel + roboticsFactory) * 8),
    militaryCapacity: 40 + fieldCommandLevel * 20 + roboticsFactory * 10,
  };
}

function applyBuildingBonuses(state: PlayerUnitSystemState, meta: UnitSystemMeta): PlayerUnitSystemState {
  return {
    ...state,
    constructionYard: {
      ...state.constructionYard,
      tier: Math.max(state.constructionYard.tier, Math.max(1, meta.fieldCommandLevel)),
      efficiency: Number((1 + meta.trainingFacilityLevel * 0.08 + meta.buildings.roboticsFactory * 0.05).toFixed(2)),
    },
  };
}

async function loadPersistedState(userId: string): Promise<{ state: PlayerUnitSystemState; meta: UnitSystemMeta }> {
  const [setting, playerState] = await Promise.all([
    storage.getSetting(getUnitSystemSettingKey(userId)),
    getPlayerState(userId),
  ]);

  const baseState = setting?.value && typeof setting.value === 'object'
    ? (setting.value as PlayerUnitSystemState)
    : createDefaultPlayerUnitSystemState();

  const processed = processConstructionYard(processTrainingQueue(baseState));
  const meta = getMetaFromPlayerState(playerState);

  return {
    state: applyBuildingBonuses(processed, meta),
    meta,
  };
}

async function savePersistedState(userId: string, state: PlayerUnitSystemState) {
  await storage.setSetting(
    getUnitSystemSettingKey(userId),
    state,
    'Per-player unit training, field, civilian, government, and military system state',
    'player-state'
  );
}

function getDomainSummary(state: PlayerUnitSystemState, domain: UnitDomain) {
  const templates = getUnitTemplatesByDomain(domain);
  return templates.map((template) => {
    const pool = state.unitPools[template.id] ?? { untrained: 0, trained: 0, elite: 0 };
    return {
      template,
      pool,
      total: pool.untrained + pool.trained + pool.elite,
    };
  });
}

export function registerUnitSystemsRoutes(app: Express) {
  app.get('/api/unit-systems/state', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state, meta } = await loadPersistedState(userId);
      await savePersistedState(userId, state);

      res.json({
        success: true,
        state,
        meta,
        summaries: {
          troop: getDomainSummary(state, 'troop'),
          civilian: getDomainSummary(state, 'civilian'),
          government: getDomainSummary(state, 'government'),
          military: getDomainSummary(state, 'military'),
        },
      });
    } catch (error) {
      console.error('[unit-systems/state]', error);
      res.status(500).json({ success: false, message: 'Failed to load unit system state' });
    }
  });

  app.get('/api/unit-systems/templates', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_SYSTEM_TEMPLATES.length,
      templates: UNIT_SYSTEM_TEMPLATES,
    });
  });

  app.get('/api/unit-systems/templates/:domain', (req: Request, res: Response) => {
    const domain = req.params.domain;
    if (!isValidDomain(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain' });
    }

    res.json({
      success: true,
      domain,
      total: getUnitTemplatesByDomain(domain).length,
      templates: getUnitTemplatesByDomain(domain),
    });
  });

  app.get('/api/unit-systems/blueprints', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: STARSHIP_BLUEPRINTS.length,
      blueprints: STARSHIP_BLUEPRINTS,
    });
  });

  app.post('/api/unit-systems/train', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state } = await loadPersistedState(userId);
      const { unitId, quantity, toState } = req.body || {};

      const result = queueUnitTraining(state, String(unitId || ''), Number(quantity || 0), toState === 'elite' ? 'elite' : 'trained');
      if (!result.success) {
        return res.status(400).json(result);
      }

      await savePersistedState(userId, result.state);
      res.json({ success: true, message: result.message, state: result.state });
    } catch (error) {
      console.error('[unit-systems/train]', error);
      res.status(500).json({ success: false, message: 'Failed to queue training' });
    }
  });

  app.post('/api/unit-systems/untrain', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state } = await loadPersistedState(userId);
      const { unitId, quantity, fromState } = req.body || {};

      if (fromState !== 'trained' && fromState !== 'elite') {
        return res.status(400).json({ success: false, message: 'fromState must be trained or elite' });
      }

      const result = untrainUnits(state, String(unitId || ''), Number(quantity || 0), fromState);
      if (!result.success) {
        return res.status(400).json(result);
      }

      await savePersistedState(userId, result.state);
      res.json({ success: true, message: result.message, state: result.state });
    } catch (error) {
      console.error('[unit-systems/untrain]', error);
      res.status(500).json({ success: false, message: 'Failed to untrain units' });
    }
  });

  app.post('/api/unit-systems/training/process', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state } = await loadPersistedState(userId);
      const now = Number(req.body?.now || Date.now());
      const updated = processTrainingQueue(state, now);
      await savePersistedState(userId, updated);

      res.json({ success: true, state: updated });
    } catch (error) {
      console.error('[unit-systems/training/process]', error);
      res.status(500).json({ success: false, message: 'Failed to process training queue' });
    }
  });

  app.post('/api/unit-systems/combat/simulate', (req: Request, res: Response) => {
    const attacker = req.body?.attacker as CombatSideInput | undefined;
    const defender = req.body?.defender as CombatSideInput | undefined;

    if (!attacker?.units?.length || !defender?.units?.length) {
      return res.status(400).json({ success: false, message: 'attacker and defender units are required' });
    }

    const result = simulateUnitCombat(attacker, defender);
    res.json({ success: true, result });
  });

  app.post('/api/unit-systems/yard/construct', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state } = await loadPersistedState(userId);
      const { blueprintId, quantity } = req.body || {};

      const result = queueStarshipConstruction(state, String(blueprintId || ''), Number(quantity || 0));
      if (!result.success) {
        return res.status(400).json(result);
      }

      await savePersistedState(userId, result.state);
      res.json({ success: true, message: result.message, state: result.state });
    } catch (error) {
      console.error('[unit-systems/yard/construct]', error);
      res.status(500).json({ success: false, message: 'Failed to queue construction' });
    }
  });

  app.post('/api/unit-systems/yard/process', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { state } = await loadPersistedState(userId);
      const now = Number(req.body?.now || Date.now());
      const updated = processConstructionYard(state, now);
      await savePersistedState(userId, updated);

      res.json({ success: true, state: updated });
    } catch (error) {
      console.error('[unit-systems/yard/process]', error);
      res.status(500).json({ success: false, message: 'Failed to process construction yard' });
    }
  });
}
