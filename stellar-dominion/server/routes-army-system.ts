/**
 * Army System API Routes
 * Endpoints for military training, deployment, and combat
 * @tag #api #military #army #rest #routes
 */

import type { Express } from 'express';
import { ArmySystemService } from './services/armySystemService';
import { isAuthenticated } from './basicAuth';
import { getAllArmySubsystems, getAvailableArmyUnits } from '../shared/config/armySubsystemsConfig';
import {
  BATTLE_SYSTEM_PROFILES,
  COMBAT_EFFECT_LIBRARY,
  buildProgressionSnapshot,
  getTierForLevel,
} from '@shared/config';

function boundedLevel(raw: unknown, fallback = 1) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(999, Math.floor(parsed)));
}

export function registerArmySystemRoutes(app: Express): void {
  /**
   * GET /api/army/subsystems
   * List all available army unit subsystems
   */
  app.get('/api/army/subsystems', (req, res) => {
    try {
      const subsystems = getAllArmySubsystems();

      res.json({
        success: true,
        data: subsystems,
        count: subsystems.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/army/subsystems/available
   * Get available subsystems for player level
   */
  app.get('/api/army/subsystems/available', isAuthenticated, (req, res) => {
    try {
      const playerLevel = boundedLevel(req.query.level, 1);
      const subsystems = getAvailableArmyUnits(playerLevel);
      const snapshot = buildProgressionSnapshot('unit', playerLevel);

      res.json({
        success: true,
        data: subsystems,
        count: subsystems.length,
        playerLevel,
        progression: {
          tier: getTierForLevel(playerLevel),
          snapshot,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/army/force
   * Get player's military force summary
   */
  app.get('/api/army/force', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const summary = ArmySystemService.getMilitarySummary(playerId);
      const estimatedLevel = Math.max(
        1,
        Math.min(
          999,
          Math.floor((summary.totalUnits || 0) / 6) + (Number(summary.force?.totalStrength || 0) > 0 ? 12 : 1)
        )
      );
      const snapshot = buildProgressionSnapshot('unit', estimatedLevel);

      res.json({
        success: true,
        data: summary,
        progression: {
          level: estimatedLevel,
          tier: getTierForLevel(estimatedLevel),
          rank: snapshot.rank,
          title: snapshot.title,
        },
        recommendedProfile: BATTLE_SYSTEM_PROFILES.find((profile) => profile.mode === 'pve') || BATTLE_SYSTEM_PROFILES[0],
        suggestedEffects: COMBAT_EFFECT_LIBRARY.slice(0, 3),
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/army/units/train
   * Train new military unit
   */
  app.post('/api/army/units/train', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { subsystemId, quantity } = req.body;

      if (!subsystemId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Missing subsystemId or quantity',
        });
      }

      const result = ArmySystemService.trainUnit(playerId, subsystemId, quantity);

      res.json({
        success: result.success,
        message: result.message,
        unit: result.unit,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * PUT /api/army/units/:unitId/level
   * Upgrade unit experience level
   */
  app.put('/api/army/units/:unitId/level', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { unitId } = req.params;
      const { newLevel } = req.body;

      if (!newLevel) {
        return res.status(400).json({
          success: false,
          error: 'Missing newLevel',
        });
      }

      const result = ArmySystemService.upgradeUnitLevel(playerId, unitId, newLevel);

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * DELETE /api/army/units/:unitId
   * Dismiss a unit
   */
  app.delete('/api/army/units/:unitId', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const { unitId } = req.params;

      const result = ArmySystemService.dismissUnit(playerId, unitId);

      res.json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/army/campaigns/deploy
   * Deploy a military campaign
   */
  app.post('/api/army/campaigns/deploy', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const {
        campaignName,
        unitIds,
        targetGalaxy,
        targetSystem,
        targetPlanet,
        campaignType,
      } = req.body;

      if (!campaignName || !unitIds || !targetGalaxy || !targetSystem) {
        return res.status(400).json({
          success: false,
          error: 'Missing required campaign parameters',
        });
      }

      const result = ArmySystemService.deployCampaign(
        playerId,
        campaignName,
        unitIds,
        targetGalaxy,
        targetSystem,
        targetPlanet,
        campaignType || 'exploration'
      );

      res.json({
        success: result.success,
        message: result.message,
        campaign: result.campaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/army/campaigns
   * Get player's campaigns
   */
  app.get('/api/army/campaigns', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const campaigns = ArmySystemService.getCampaigns(playerId);

      res.json({
        success: true,
        data: campaigns,
        count: campaigns.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/army/campaigns/active
   * Get active campaigns
   */
  app.get('/api/army/campaigns/active', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const campaigns = ArmySystemService.getActiveCampaigns(playerId);

      res.json({
        success: true,
        data: campaigns,
        count: campaigns.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * POST /api/army/campaigns/:campaignId/complete
   * Complete a campaign
   */
  app.post('/api/army/campaigns/:campaignId/complete', isAuthenticated,
    (req, res) => {
      try {
        const playerId = (req as any).user?.id || 'anonymous';
        const { campaignId } = req.params;
        const { successful } = req.body || { successful: true };

        const result = ArmySystemService.completeCampaign(
          playerId,
          campaignId,
          successful
        );

        res.json({
          success: result.success,
          message: result.message,
          rewards: result.rewards,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: (error as Error).message,
        });
      }
    }
  );

  /**
   * POST /api/army/combat/simulate
   * Simulate tactical combat between two players
   */
  app.post('/api/army/combat/simulate', isAuthenticated, (req, res) => {
    try {
      const playerA = (req as any).user?.id || 'anonymous';
      const { playerB, unitsA, unitsB } = req.body;

      if (!playerB || !unitsA || !unitsB) {
        return res.status(400).json({
          success: false,
          error: 'Missing playerB, unitsA, or unitsB',
        });
      }

      const result = ArmySystemService.simulateCombat(
        playerA,
        unitsA,
        playerB,
        unitsB
      );

      res.json({
        success: true,
        data: result,
        battleProfile: BATTLE_SYSTEM_PROFILES.find((profile) => profile.mode === 'pvp') || BATTLE_SYSTEM_PROFILES[0],
        activeEffects: COMBAT_EFFECT_LIBRARY.slice(0, 4),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });

  /**
   * GET /api/army/units/:unitId/combat-power
   * Get combat power calculation for units
   */
  app.get('/api/army/units/combat-power', isAuthenticated, (req, res) => {
    try {
      const playerId = (req as any).user?.id || 'anonymous';
      const unitIds = (req.query.units as string)?.split(',') || [];

      if (unitIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing units parameter',
        });
      }

      const power = ArmySystemService.calculateCombatPower(playerId, unitIds);

      res.json({
        success: true,
        data: {
          combatPower: power,
          unitCount: unitIds.length,
          tierHint: getTierForLevel(Math.max(1, Math.floor(power / 350))),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  });
}
