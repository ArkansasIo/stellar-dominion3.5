/**
 * Research XP Service
 * Handles experience accumulation, leveling, and tech discovery
 * @tag #research-xp #service #discovery
 */

import {
  RESEARCH_XP_CONFIG,
  DISCOVERY_MECHANICS,
  XP_LEVEL_CONFIG,
  calculateResearchXP,
  calculateXPForLevel,
  calculateDiscoveryChance,
  rollDiscoveryType,
  PlayerResearchXP,
  ResearchDiscovery,
} from '../../shared/config/researchXPConfig';
import { pool } from '../db';

export class ResearchXPService {
  /**
   * Add XP to a player from research completion
   */
  static async addResearchXP(
    userId: string,
    amount: number,
    sourceType: string = 'research_complete'
  ): Promise<any> {
    try {
      const result = await pool.query(
        `SELECT research_xp FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      let xpData = result.rows[0].research_xp || this.initializePlayerXP();

      // Add XP
      xpData.totalXP += amount;
      xpData.currentLevelXP += amount;

      // Check for level up
      const nextLevelXP = calculateXPForLevel(xpData.currentLevel + 1);
      let leveledUp = false;
      let levelUps = 0;

      while (xpData.currentLevelXP >= nextLevelXP && xpData.currentLevel < XP_LEVEL_CONFIG.MAX_LEVEL) {
        xpData.currentLevelXP -= nextLevelXP;
        xpData.currentLevel += 1;
        leveledUp = true;
        levelUps += 1;
      }

      // Update discovery multiplier
      xpData.discoveryMultiplier = 1.0 + (xpData.currentLevel * 0.02);

      await pool.query(
        `UPDATE player_states 
         SET research_xp = $1, updated_at = NOW() 
         WHERE user_id = $2`,
        [JSON.stringify(xpData), userId]
      );

      return {
        success: true,
        xpAdded: amount,
        sourceType,
        totalXP: xpData.totalXP,
        currentLevel: xpData.currentLevel,
        currentLevelXP: xpData.currentLevelXP,
        leveledUp,
        levelUps,
      };
    } catch (error) {
      console.error('Error adding research XP:', error);
      throw error;
    }
  }

  /**
   * Complete research and generate XP + check for discovery
   */
  static async completeResearch(
    userId: string,
    techId: string,
    techTier: string,
    techClass: string,
    baseTurns: number
  ): Promise<any> {
    try {
      // Calculate XP
      const xpGained = calculateResearchXP(baseTurns, techTier, techClass);

      // Add XP
      const xpResult = await this.addResearchXP(userId, xpGained, 'research_complete');

      // Check for discovery
      const playerData = await pool.query(
        `SELECT research_xp FROM player_states WHERE user_id = $1`,
        [userId]
      );

      const xpData = playerData.rows[0].research_xp;
      let discovery: any = null;

      // Roll for discovery
      if (xpData.currentLevel >= DISCOVERY_MECHANICS.MINIMUM_XP_FOR_DISCOVERY / 1000) {
        const discoveryChance = calculateDiscoveryChance(
          xpData.currentLevel,
          xpData.discoveryStreak,
          xpData.researchesCompleted
        );

        if (Math.random() < discoveryChance) {
          discovery = await this.processDiscovery(userId, techId, xpData);
        }
      }

      // Increment research count
      xpData.researchesCompleted += 1;

      await pool.query(
        `UPDATE player_states 
         SET research_xp = $1, updated_at = NOW() 
         WHERE user_id = $2`,
        [JSON.stringify(xpData), userId]
      );

      return {
        success: true,
        xpGained,
        totalXP: xpResult.totalXP,
        leveledUp: xpResult.leveledUp,
        levelUps: xpResult.levelUps,
        currentLevel: xpResult.currentLevel,
        discovery,
        researchesCompleted: xpData.researchesCompleted,
      };
    } catch (error) {
      console.error('Error completing research:', error);
      throw error;
    }
  }

  /**
   * Process a tech discovery event
   */
  static async processDiscovery(userId: string, fromTechId: string, xpData: PlayerResearchXP): Promise<ResearchDiscovery> {
    try {
      // Determine discovery type
      const discoveryType = rollDiscoveryType();
      const discoveryInfo = DISCOVERY_MECHANICS.DISCOVERY_TYPES[discoveryType];

      // Create discovery record
      const discovery: ResearchDiscovery = {
        id: `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        discoveredAt: Date.now(),
        techId: fromTechId,
        discoveryType,
        xpGained: discoveryInfo.xpReward,
      };

      // Apply discovery effects
      if (discoveryType === 'tech_unlock' || discoveryType === 'ancient_knowledge') {
        // These would unlock new techs
        discovery.bonusApplied = {
          type: 'tech_unlock',
        };
      }

      if ('speedBoost' in discoveryInfo) {
        discovery.bonusApplied = {
          type: 'speed_boost',
          multiplier: discoveryInfo.speedBoost,
          duration: discoveryInfo.duration,
        };
      }

      // Update streak
      const timeSinceLastDiscovery = Date.now() - xpData.lastDiscoveryTime;
      if (timeSinceLastDiscovery < 86400000) { // 24 hours
        xpData.discoveryStreak += 1;
      } else {
        xpData.discoveryStreak = 1;
      }

      // Update discovery data
      xpData.discoveries.push(discovery);
      xpData.lastDiscoveryTime = Date.now();

      // Add XP from discovery
      xpData.totalXP += discoveryInfo.xpReward;
      xpData.currentLevelXP += discoveryInfo.xpReward;

      return discovery;
    } catch (error) {
      console.error('Error processing discovery:', error);
      throw error;
    }
  }

  /**
   * Get player XP stats
   */
  static async getPlayerXPStats(userId: string): Promise<any> {
    try {
      const result = await pool.query(
        `SELECT research_xp FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error(`Player ${userId} not found`);
      }

      const xpData = result.rows[0].research_xp || this.initializePlayerXP();
      const nextLevelXP = calculateXPForLevel(xpData.currentLevel + 1);

      return {
        totalXP: xpData.totalXP,
        currentLevel: xpData.currentLevel,
        currentLevelXP: xpData.currentLevelXP,
        nextLevelXP,
        xpProgress: (xpData.currentLevelXP / nextLevelXP * 100).toFixed(1),
        researchesCompleted: xpData.researchesCompleted,
        discoveredTechs: xpData.discoveredTechs.length,
        discoveries: xpData.discoveries.slice(-10), // Last 10 discoveries
        discoveryStreak: xpData.discoveryStreak,
        discoveryMultiplier: xpData.discoveryMultiplier,
        levelUpRewards: this.getLevelUpRewards(xpData.currentLevel),
      };
    } catch (error) {
      console.error('Error getting XP stats:', error);
      throw error;
    }
  }

  /**
   * Get rewards for current level
   */
  static getLevelUpRewards(currentLevel: number): any {
    return {
      discoveryChanceBonus: `+${(currentLevel * 2.5).toFixed(1)}%`,
      speedMultiplier: `${(1.0 + currentLevel * 0.02).toFixed(2)}x`,
      xpGainMultiplier: `${(1.0 + currentLevel * 0.05).toFixed(2)}x`,
      labUnlocks: Math.floor(currentLevel / XP_LEVEL_CONFIG.LEVEL_UP_REWARDS.lab_unlock),
    };
  }

  /**
   * Check if player can discover a specific tech
   */
  static async canDiscoverTech(userId: string, techId: string): Promise<boolean> {
    try {
      const result = await pool.query(
        `SELECT research_xp FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) return false;

      const xpData = result.rows[0].research_xp || this.initializePlayerXP();

      // Check if already discovered
      if (xpData.discoveredTechs.includes(techId)) {
        return false;
      }

      // Check minimum requirements
      if (xpData.currentLevel < 5) return false;
      if (xpData.researchesCompleted < DISCOVERY_MECHANICS.MINIMUM_RESEARCH_COUNT) return false;

      return true;
    } catch (error) {
      console.error('Error checking discovery eligibility:', error);
      return false;
    }
  }

  /**
   * Get recent discoveries
   */
  static async getDiscoveries(userId: string, limit: number = 20): Promise<ResearchDiscovery[]> {
    try {
      const result = await pool.query(
        `SELECT research_xp FROM player_states WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]) return [];

      const xpData = result.rows[0].research_xp || this.initializePlayerXP();

      return xpData.discoveries.slice(-limit).reverse();
    } catch (error) {
      console.error('Error getting discoveries:', error);
      return [];
    }
  }

  /**
   * Get XP leaderboard
   */
  static async getXPLeaderboard(limit: number = 100): Promise<any[]> {
    try {
      const result = await pool.query(
        `SELECT user_id, research_xp FROM player_states 
         WHERE research_xp IS NOT NULL 
         ORDER BY (research_xp->>'totalXP')::bigint DESC 
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row: any) => ({
        userId: row.user_id,
        totalXP: row.research_xp?.totalXP || 0,
        currentLevel: row.research_xp?.currentLevel || 1,
        researchesCompleted: row.research_xp?.researchesCompleted || 0,
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  /**
   * Initialize XP data for new player
   */
  static initializePlayerXP(): PlayerResearchXP {
    return {
      totalXP: 0,
      currentLevelXP: 0,
      currentLevel: 1,
      researchesCompleted: 0,
      discoveredTechs: [],
      discoveries: [],
      discoveryStreak: 0,
      lastDiscoveryTime: 0,
      discoveryMultiplier: 1.0,
    };
  }

  /**
   * Reset discovery streak if too much time passed
   */
  static resetStreakIfNeeded(xpData: PlayerResearchXP): void {
    const timeSinceLastDiscovery = Date.now() - xpData.lastDiscoveryTime;
    if (timeSinceLastDiscovery > 86400000) { // 24 hours
      xpData.discoveryStreak = 0;
    }
  }
}

export default ResearchXPService;
