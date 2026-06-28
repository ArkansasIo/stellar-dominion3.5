/**
 * Civilization System Service
 * Business logic for civilization management, subsystems, and workforce
 * @tag #civilization #service #business-logic
 */

import type {
  CivilizationSubsystem,
  SubsystemState,
  WorkforceAssignment,
  WorkforceProjection,
  CivilizationPlayerState,
} from '../../shared/types/civilization';
import {
  getAllSubsystems,
  getSubsystemById,
  getSubsystemsByType,
  calculateSubsystemBonuses,
} from '../../shared/config/civilizationSubsystemsConfig';
import { ALL_CIVILIZATION_JOBS } from '../../shared/config/civilizationJobsConfig';

/**
 * In-memory storage for player civilization states
 * In production, this would be in a database
 */
const playerCivilizationStates = new Map<string, CivilizationPlayerState>();

export class CivilizationSystemService {
  /**
   * Get or create player civilization state
   */
  static getPlayerState(playerId: string): CivilizationPlayerState {
    if (!playerCivilizationStates.has(playerId)) {
      playerCivilizationStates.set(playerId, {
        playerId,
        governmentType: 'democracy',
        currentPolicies: [],
        activeCampaigns: [],
        subsystemStates: [],
        workforce: [],
        militaryForces: {
          playerId,
          squadrons: [],
          totalStrength: 0,
          totalMorale: 50,
          averageExperience: 0,
          commanderBonus: 0,
        },
        culture: {
          playerId,
          culturePoints: 0,
          moraleIndex: 50,
          popularityRating: 50,
          unrestLevel: 0,
          festivals: [],
        },
        education: [],
        commercialRoutes: [],
        lastUpdatedAt: new Date(),
      });
    }
    return playerCivilizationStates.get(playerId)!;
  }

  /**
   * Initialize subsystems for a player
   */
  static initializeSubsystems(playerId: string): CivilizationSubsystem[] {
    const state = this.getPlayerState(playerId);
    const initialSystems = getAllSubsystems();

    state.subsystemStates = initialSystems
      .filter(
        (sys: CivilizationSubsystem) =>
          !sys.prerequisiteSystems || sys.prerequisiteSystems.length === 0
      )
      .map((sys: CivilizationSubsystem) => ({
        systemId: sys.id,
        playerId,
        level: sys.level,
        efficiency: 0,
        productionBuffer: 0,
        turnsOperating: 0,
        lastUpgradedAt: new Date(),
      }));

    return initialSystems;
  }

  /**
   * Upgrade a subsystem
   */
  static upgradeSubsystem(
    playerId: string,
    systemId: string,
    targetLevel: number
  ): {
    success: boolean;
    message: string;
    newLevel?: number;
  } {
    const state = this.getPlayerState(playerId);
    const system = getSubsystemById(systemId);

    if (!system) {
      return { success: false, message: 'Subsystem not found' };
    }

    if (targetLevel > system.maxLevel) {
      return {
        success: false,
        message: `Cannot exceed max level of ${system.maxLevel}`,
      };
    }

    let systemState = state.subsystemStates.find((s) => s.systemId === systemId);

    if (!systemState) {
      systemState = {
        systemId,
        playerId,
        level: 1,
        efficiency: system.efficiency,
        productionBuffer: 0,
        turnsOperating: 0,
      };
      state.subsystemStates.push(systemState);
    }

    systemState.level = targetLevel;
    systemState.efficiency = system.efficiency * (targetLevel / system.maxLevel);
    systemState.lastUpgradedAt = new Date();

    return {
      success: true,
      message: `Upgraded ${system.name} to level ${targetLevel}`,
      newLevel: targetLevel,
    };
  }

  /**
   * Assign workforce to jobs
   */
  static assignWorkforce(
    playerId: string,
    jobId: string,
    employees: number
  ): {
    success: boolean;
    message: string;
    assignment?: WorkforceAssignment;
  } {
    const state = this.getPlayerState(playerId);
    const job = ALL_CIVILIZATION_JOBS.find((j) => j.id === jobId);

    if (!job) {
      return { success: false, message: 'Job not found' };
    }

    if (state.workforce.length >= 50) {
      return {
        success: false,
        message: 'Maximum job assignments reached (50)',
      };
    }

    const assignment: WorkforceAssignment = {
      id: `${playerId}-${jobId}-${Date.now()}`,
      playerId,
      jobId,
      employees,
      assignedAt: new Date(),
      performanceMultiplier: 1.0,
    };

    state.workforce.push(assignment);

    return {
      success: true,
      message: `Assigned ${employees} employees to ${job.name}`,
      assignment,
    };
  }

  /**
   * Update assignment
   */
  static updateAssignment(
    playerId: string,
    assignmentId: string,
    employees: number
  ): {
    success: boolean;
    message: string;
  } {
    const state = this.getPlayerState(playerId);
    const assignment = state.workforce.find((a) => a.id === assignmentId);

    if (!assignment) {
      return { success: false, message: 'Assignment not found' };
    }

    assignment.employees = employees;
    return { success: true, message: 'Assignment updated' };
  }

  /**
   * Remove assignment
   */
  static removeAssignment(
    playerId: string,
    assignmentId: string
  ): {
    success: boolean;
    message: string;
  } {
    const state = this.getPlayerState(playerId);
    const index = state.workforce.findIndex((a) => a.id === assignmentId);

    if (index === -1) {
      return { success: false, message: 'Assignment not found' };
    }

    state.workforce.splice(index, 1);
    return { success: true, message: 'Assignment removed' };
  }

  /**
   * Calculate workforce projections
   */
  static calculateWorkforceProjection(playerId: string): WorkforceProjection {
    const state = this.getPlayerState(playerId);

    let foodRequired = 0;
    let waterRequired = 0;
    let productivityGenerated = 0;
    let totalWorkforce = 0;

    state.workforce.forEach((assignment: WorkforceAssignment) => {
      const job = ALL_CIVILIZATION_JOBS.find(
        (j) => j.id === assignment.jobId
      );
      if (job) {
        const count = assignment.employees * assignment.performanceMultiplier;
        foodRequired += job.foodDemandPerHour * count;
        waterRequired += job.waterDemandPerHour * count;
        productivityGenerated += job.baseProductivity * count;
        totalWorkforce += assignment.employees;
      }
    });

    return {
      totalWorkforce,
      foodRequired: Math.round(foodRequired),
      waterRequired: Math.round(waterRequired),
      productivityGenerated: Math.round(productivityGenerated),
      efficiencyRating: totalWorkforce > 0 ? 85 : 0,
    };
  }

  /**
   * Get all assignments for a player
   */
  static getAssignments(playerId: string): WorkforceAssignment[] {
    const state = this.getPlayerState(playerId);
    return state.workforce;
  }

  /**
   * Calculate subsystem efficiency bonus
   */
  static calculateSubsystemEfficencyBonus(playerId: string): Record<string, number> {
    const state = this.getPlayerState(playerId);
    const activeSystems = state.subsystemStates
      .map((ss: SubsystemState) => {
        const system = getSubsystemById(ss.systemId);
        return system ? { ...system, level: ss.level } : null;
      })
      .filter((s: CivilizationSubsystem | null): s is CivilizationSubsystem => s !== null);

    return calculateSubsystemBonuses(activeSystems);
  }

  /**
   * Get civilization summary for UI
   */
  static getCivilizationSummary(playerId: string): {
    state: CivilizationPlayerState;
    projection: WorkforceProjection;
    subsystemBonuses: Record<string, number>;
    activeSystems: SubsystemState[];
  } {
    const state = this.getPlayerState(playerId);
    const projection = this.calculateWorkforceProjection(playerId);
    const subsystemBonuses = this.calculateSubsystemEfficencyBonus(playerId);
    const activeSystems = state.subsystemStates.filter((s) => s.level > 0);

    return {
      state,
      projection,
      subsystemBonuses,
      activeSystems,
    };
  }

  /**
   * Update government policy
   */
  static setGovernmentType(
    playerId: string,
    governmentType: string
  ): {
    success: boolean;
    message: string;
  } {
    const state = this.getPlayerState(playerId);
    const validTypes = [
      'autocracy',
      'democracy',
      'oligarchy',
      'monarchy',
      'meritocracy',
      'military_junta',
    ];

    if (!validTypes.includes(governmentType)) {
      return { success: false, message: 'Invalid government type' };
    }

    state.governmentType = governmentType as any;
    return {
      success: true,
      message: `Government changed to ${governmentType}`,
    };
  }

  /**
   * Boost morale through festivals
   */
  static hostFestival(playerId: string, duration: number = 5): {
    success: boolean;
    message: string;
    newMorale?: number;
  } {
    const state = this.getPlayerState(playerId);

    state.culture.moraleIndex = Math.min(100, state.culture.moraleIndex + 15);
    state.culture.festivals?.push({
      name: 'Festival',
      bonus: 15,
      turnsRemaining: duration,
    });

    return {
      success: true,
      message: `Festival hosted! Morale +15`,
      newMorale: state.culture.moraleIndex,
    };
  }

  /**
   * Core game loop - process civilization turn
   */
  static processTurn(playerId: string): {
    success: boolean;
    resources?: WorkforceProjection;
    changes?: string[];
  } {
    const state = this.getPlayerState(playerId);
    const projection = this.calculateWorkforceProjection(playerId);
    const changes: string[] = [];

    // Process festivals
    if (state.culture.festivals) {
      state.culture.festivals = state.culture.festivals
        .map((f) => ({ ...f, turnsRemaining: f.turnsRemaining - 1 }))
        .filter((f) => f.turnsRemaining > 0);

      if (state.culture.festivals.length === 0) {
        state.culture.moraleIndex = Math.max(30, state.culture.moraleIndex - 5);
        changes.push('Festival ended');
      }
    }

    // Update subsystem production
    state.subsystemStates.forEach((ss) => {
      ss.turnsOperating++;
      const system = getSubsystemById(ss.systemId);
      if (system && system.productionPerTurn) {
        ss.productionBuffer += system.productionPerTurn * (ss.level / system.maxLevel);
      }
    });

    changes.push(
      `Production: ${Math.round(projection.productivityGenerated)} / turn`
    );

    state.lastUpdatedAt = new Date();

    return {
      success: true,
      resources: projection,
      changes,
    };
  }
}

export default CivilizationSystemService;
