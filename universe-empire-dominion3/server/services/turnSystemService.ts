/**
 * Turn System Service
 * Manages turn generation, progression, and integrates with all game systems
 * @tag #turn-system #service #core
 */

import {
  TURN_CONFIG,
  RESEARCH_TURN_MECHANICS,
  TURN_EVENT_EFFECTS,
  TURN_BONUSES,
  calculateTurnsForResearch,
  calculateProgressPerTurn,
  calculateOfflineTurns,
  canCompleteThisTurn,
} from '../../shared/config/turnSystemConfig';
import { pool } from '../db';

export class TurnSystemService {
  private static normalizeTurnsData(rawTurnsData: any = {}) {
    return {
      totalTurnsGenerated: Number(rawTurnsData.totalTurnsGenerated || 0),
      currentTurn: Number(rawTurnsData.currentTurn || 0),
      lastTurnTimestamp: Number(rawTurnsData.lastTurnTimestamp || Date.now()),
      turnsAvailable: Number(rawTurnsData.turnsAvailable || 0),
      currentResearchTurns: Number(rawTurnsData.currentResearchTurns || 0),
      researchTurnHistory: Array.isArray(rawTurnsData.researchTurnHistory) ? rawTurnsData.researchTurnHistory : [],
    };
  }

  private static accrueOfflineTurns(rawTurnsData: any = {}) {
    const turnsData = this.normalizeTurnsData(rawTurnsData);
    const offlineTurns = calculateOfflineTurns(turnsData.lastTurnTimestamp);

    if (offlineTurns <= 0) {
      return { turnsData, offlineTurns };
    }

    const totalTurnsGenerated = turnsData.totalTurnsGenerated + offlineTurns;
    return {
      offlineTurns,
      turnsData: {
        ...turnsData,
        turnsAvailable: Math.min(turnsData.turnsAvailable + offlineTurns, TURN_CONFIG.MAX_OFFLINE_TURNS),
        totalTurnsGenerated,
        currentTurn: Math.floor(totalTurnsGenerated / TURN_CONFIG.TURNS_PER_MINUTE),
        lastTurnTimestamp: Date.now(),
      },
    };
  }

  /**
   * Generate new turns for a player
   * Called by turn generation loop or on player login
   */
  static async generateTurns(userId: string): Promise<number> {
    try {
      const result = await pool.query(
          `SELECT turns_data FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      const { turnsData, offlineTurns } = this.accrueOfflineTurns(result.rows[0].turns_data || {});

      if (offlineTurns === 0) {
        return turnsData.turnsAvailable || 0;
      }

      await pool.query(
        `UPDATE player_states 
         SET turns_data = $1, updated_at = NOW() 
         WHERE user_id = $2`,
        [JSON.stringify(turnsData), userId]
      );

      return turnsData.turnsAvailable;
    } catch (error) {
      console.error('Error generating turns:', error);
      throw error;
    }
  }

  /**
   * Consume turns for general gameplay actions
   */
  static async spendTurns(userId: string, turnsToConsume: number) {
    try {
      const playerResult = await pool.query(
        `SELECT turns_data FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerResult.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      const { turnsData } = this.accrueOfflineTurns(playerResult.rows[0].turns_data || {});

      if (turnsData.turnsAvailable < turnsToConsume) {
        throw new Error(`Insufficient turns. Have ${turnsData.turnsAvailable}, need ${turnsToConsume}`);
      }

      const nextTurnsData = {
        ...turnsData,
        turnsAvailable: turnsData.turnsAvailable - turnsToConsume,
      };

      await pool.query(
        `UPDATE player_states
         SET turns_data = $1, updated_at = NOW()
         WHERE user_id = $2`,
        [JSON.stringify(nextTurnsData), userId]
      );

      return {
        success: true,
        turnsSpent: turnsToConsume,
        turnsAvailable: nextTurnsData.turnsAvailable,
        currentTurns: nextTurnsData.turnsAvailable,
        totalTurns: nextTurnsData.totalTurnsGenerated,
        currentTurn: nextTurnsData.currentTurn,
      };
    } catch (error) {
      console.error('Error spending turns:', error);
      throw error;
    }
  }

  /**
   * Consume turns for research progression
   */
  static async progressResearchByTurns(userId: string, turnsToConsume: number): Promise<any> {
    try {
      // Get player and research data
      const playerResult = await pool.query(
          `SELECT turns_data, research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!playerResult.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      const { turnsData } = this.accrueOfflineTurns(playerResult.rows[0].turns_data || {});
      const researchQueue = playerResult.rows[0].research_queue || [];

      // Check if player has enough turns
      if ((turnsData.turnsAvailable || 0) < turnsToConsume) {
        throw new Error(`Insufficient turns. Have ${turnsData.turnsAvailable}, need ${turnsToConsume}`);
      }

      // Get active research and progress
      const activeResearch = researchQueue.find((r: any) => r.active);
      if (!activeResearch) {
        throw new Error('No active research');
      }

      // Calculate progress from turns
      const speedMult = activeResearch.speedMultiplier || 1.0;
      const progressPerTurn = calculateProgressPerTurn(speedMult);
      const totalProgress = progressPerTurn * turnsToConsume;

      // Update research progress
      activeResearch.progressPercent = Math.min(100, (activeResearch.progressPercent || 0) + totalProgress);
      activeResearch.turnsSpent = (activeResearch.turnsSpent || 0) + turnsToConsume;

      // Deduct turns from player
      turnsData.turnsAvailable = (turnsData.turnsAvailable || 0) - turnsToConsume;
      turnsData.currentResearchTurns = (turnsData.currentResearchTurns || 0) + turnsToConsume;

      // Check for research completion
      let researchCompleted = false;
      if (activeResearch.progressPercent >= RESEARCH_TURN_MECHANICS.COMPLETION_THRESHOLD) {
        activeResearch.progressPercent = 100;
        activeResearch.completed = true;
        researchCompleted = true;
      }

      // Save updates
      await pool.query(
        `UPDATE player_states 
         SET turns_data = $1, research_queue = $2, updated_at = NOW() 
         WHERE user_id = $3`,
        [JSON.stringify(turnsData), JSON.stringify(researchQueue), userId]
      );

      return {
        success: true,
        turnsConsumed: turnsToConsume,
        turnsRemaining: turnsData.turnsAvailable,
        currentTurns: turnsData.turnsAvailable,
        totalTurns: turnsData.totalTurnsGenerated,
        progressGained: totalProgress,
        researchProgress: activeResearch.progressPercent,
        researchCompleted,
        activeResearch,
      };
    } catch (error) {
      console.error('Error progressing research:', error);
      throw error;
    }
  }

  /**
   * Get current turn info for player
   */
  static async getTurnInfo(userId: string): Promise<any> {
    try {
      const result = await pool.query(
          `SELECT turns_data, research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      const { turnsData, offlineTurns } = this.accrueOfflineTurns(result.rows[0].turns_data || {});
      const researchQueue = result.rows[0].research_queue || [];
      const activeResearch = researchQueue.find((r: any) => r.active);

      return {
        totalTurnsGenerated: turnsData.totalTurnsGenerated || 0,
        currentTurn: turnsData.currentTurn || Math.floor((turnsData.totalTurnsGenerated || 0) / TURN_CONFIG.TURNS_PER_MINUTE),
        turnsAvailable: turnsData.turnsAvailable || 0,
        currentTurns: turnsData.turnsAvailable || 0,
        totalTurns: turnsData.totalTurnsGenerated || 0,
        lastTurnTimestamp: turnsData.lastTurnTimestamp,
        offlineTurnsPending: offlineTurns,
        currentResearchTurns: turnsData.currentResearchTurns || 0,
        activeResearch: activeResearch ? {
          techId: activeResearch.techId,
          progressPercent: activeResearch.progressPercent,
          turnsSpent: activeResearch.turnsSpent,
          speedMultiplier: activeResearch.speedMultiplier,
        } : null,
      };
    } catch (error) {
      console.error('Error getting turn info:', error);
      throw error;
    }
  }

  /**
   * Auto-progress research based on time elapsed
   * Called periodically by game loop
   */
  static async autoProgressResearch(userId: string): Promise<any> {
    try {
      const result = await pool.query(
          `SELECT turns_data, research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        return { success: false, message: 'Player not found' };
      }

      const turnsData = result.rows[0].turns_data || {};
      const lastTurnTime = turnsData.lastTurnTimestamp || Date.now();

      // Calculate elapsed turns
      const elapsedMs = Date.now() - lastTurnTime;
      const elapsedTurns = Math.floor(elapsedMs / TURN_CONFIG.TURN_INTERVAL_MS);

      if (elapsedTurns === 0) {
        return { success: true, turnsApplied: 0 };
      }

      // Cap to available offline turns
      const turnsToApply = Math.min(elapsedTurns, TURN_CONFIG.MAX_OFFLINE_TURNS);

      // Progress research
      const progressResult = await this.progressResearchByTurns(userId, turnsToApply);

      return {
        success: true,
        turnsApplied: turnsToApply,
        ...progressResult,
      };
    } catch (error) {
      console.error('Error in auto-progress:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Calculate turn requirements for a tech
   */
  static calculateTurnRequirements(baseTurns: number, speedMult: number = 1.0, labMod: number = 1.0): number {
    return calculateTurnsForResearch(baseTurns, speedMult, labMod);
  }

  /**
   * Apply turn-based event effects
   */
  static async applyTurnEvent(userId: string, eventType: string): Promise<any> {
    try {
      const eventEffect = TURN_EVENT_EFFECTS[eventType as keyof typeof TURN_EVENT_EFFECTS];
      if (!eventEffect) {
        throw new Error(`Unknown event type: ${eventType}`);
      }

      const result = await pool.query(
          `SELECT research_queue FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error(`Player not found`);
      }

      const researchQueue = result.rows[0].research_queue || [];
      const activeResearch = researchQueue.find((r: any) => r.active);

      if (!activeResearch) {
        throw new Error('No active research');
      }

      // Apply event effects
      if ('progressGain' in eventEffect) {
        activeResearch.progressPercent = Math.min(
          100,
          (activeResearch.progressPercent || 0) + ((eventEffect as any).progressGain * 100)
        );
      }

      if ('progressLoss' in eventEffect) {
        activeResearch.progressPercent = Math.max(
          0,
          (activeResearch.progressPercent || 0) - ((eventEffect as any).progressLoss * 100)
        );
      }

      // Update modifiers
      if (!activeResearch.modifiers) activeResearch.modifiers = {};
      if ('speedBoost' in eventEffect) {
        activeResearch.modifiers.eventSpeedBoost = (eventEffect as any).speedBoost;
      }
      if ('speedPenalty' in eventEffect) {
        activeResearch.modifiers.eventPenalty = (eventEffect as any).speedPenalty;
      }

      await pool.query(
        `UPDATE player_states 
         SET research_queue = $1, updated_at = NOW() 
         WHERE user_id = $2`,
        [JSON.stringify(researchQueue), userId]
      );

      return {
        success: true,
        eventApplied: eventType,
        researchProgress: activeResearch.progressPercent,
        activeResearch,
      };
    } catch (error) {
      console.error('Error applying turn event:', error);
      throw error;
    }
  }

  /**
   * Get turn-based bonuses for player
   */
  static calculateTurnBonuses(turnsSpent: number, streakTurns: number = 0): { speedBonus: number; reason: string[] } {
    const reasons: string[] = [];
    let speedBonus = 1.0;

    // Streak bonus
    if (streakTurns >= TURN_BONUSES.RESEARCH_STREAK.turns) {
      const streaks = Math.floor(streakTurns / TURN_BONUSES.RESEARCH_STREAK.turns);
      const activeStreaks = Math.min(streaks, TURN_BONUSES.RESEARCH_STREAK.maxStreaks);
      speedBonus *= Math.pow(TURN_BONUSES.RESEARCH_STREAK.speedBonus, activeStreaks);
      reasons.push(`${activeStreaks} research streak bonus`);
    }

    return { speedBonus, reason: reasons };
  }

  /**
   * Initialize turns data for new player
   */
  static initializePlayerTurns(): object {
    return {
      totalTurnsGenerated: 0,
      currentTurn: 0,
      lastTurnTimestamp: Date.now(),
      turnsAvailable: TURN_CONFIG.TURNS_PER_MINUTE * 5, // Start with 5 minutes of turns
      currentResearchTurns: 0,
      researchTurnHistory: [],
    };
  }
}

export default TurnSystemService;
