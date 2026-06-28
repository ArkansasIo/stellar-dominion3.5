/**
 * Army System Service
 * Business logic for military unit management, deployments, and combat
 * @tag #military #army #service #combat
 */

import type {
  ArmyUnit,
  MilitaryForce,
  MilitaryCampaign,
  ArmySubsystem,
} from '../../shared/types/civilization';
import {
  getAllArmySubsystems,
  getArmySubsystemById,
  getAvailableArmyUnits,
  calculateSquadCombatPower,
  calculateFormationBonus,
  calculateTotalCrewRequired,
} from '../../shared/config/armySubsystemsConfig';

/**
 * In-memory storage for army data
 * In production, this would be in a database
 */
const playerMilitaryForces = new Map<string, MilitaryForce>();
const playerCampaigns = new Map<string, MilitaryCampaign[]>();
const armyUnits = new Map<string, ArmyUnit[]>();

export class ArmySystemService {
  /**
   * Get or create military force for player
   */
  static getMilitaryForce(playerId: string): MilitaryForce {
    if (!playerMilitaryForces.has(playerId)) {
      playerMilitaryForces.set(playerId, {
        playerId,
        squadrons: [],
        totalStrength: 0,
        totalMorale: 50,
        averageExperience: 0,
        commanderBonus: 0,
      });
    }
    return playerMilitaryForces.get(playerId)!;
  }

  /**
   * Train new military unit
   */
  static trainUnit(
    playerId: string,
    subsystemId: string,
    quantity: number
  ): {
    success: boolean;
    message: string;
    unit?: ArmyUnit;
  } {
    const subsystem = getArmySubsystemById(subsystemId);

    if (!subsystem) {
      return { success: false, message: 'Unit subsystem not found' };
    }

    const unit: ArmyUnit = {
      id: `${playerId}-${subsystemId}-${Date.now()}`,
      playerId,
      subsystemId,
      quantity,
      health: subsystem.combat.health * quantity,
      morale: 50,
      experience: 0,
      level: 1,
    };

    const force = this.getMilitaryForce(playerId);
    force.squadrons.push(unit);

    this.updateMilitaryForceStats(playerId);

    return {
      success: true,
      message: `Trained ${quantity}x ${subsystem.name}`,
      unit,
    };
  }

  /**
   * Upgrade unit experience level
   */
  static upgradeUnitLevel(
    playerId: string,
    unitId: string,
    newLevel: number
  ): {
    success: boolean;
    message: string;
  } {
    const force = this.getMilitaryForce(playerId);
    const unit = force.squadrons.find((u) => u.id === unitId);

    if (!unit) {
      return { success: false, message: 'Unit not found' };
    }

    if (newLevel > 50) {
      return { success: false, message: 'Cannot exceed level 50' };
    }

    unit.level = newLevel;
    unit.experience = Math.min(1000, newLevel * 100);

    this.updateMilitaryForceStats(playerId);

    return { success: true, message: `Unit promoted to level ${newLevel}` };
  }

  /**
   * Promote unit experience by percentage
   */
  static gainUnitExperience(
    playerId: string,
    unitId: string,
    experiencePoints: number
  ): {
    success: boolean;
    leveledUp?: boolean;
    newLevel?: number;
  } {
    const force = this.getMilitaryForce(playerId);
    const unit = force.squadrons.find((u) => u.id === unitId);

    if (!unit) {
      return { success: false };
    }

    unit.experience += experiencePoints;

    let leveledUp = false;
    while (unit.experience >= unit.level * 100 && unit.level < 50) {
      unit.level++;
      unit.experience -= unit.level * 100;
      leveledUp = true;
    }

    this.updateMilitaryForceStats(playerId);

    return {
      success: true,
      leveledUp,
      newLevel: unit.level,
    };
  }

  /**
   * Deploy units for campaign
   */
  static deployCampaign(
    playerId: string,
    campaignName: string,
    unitIds: string[],
    targetGalaxy: number,
    targetSystem: number,
    targetPlanet?: number,
    campaignType: 'conquest' | 'defense' | 'exploration' | 'raid' = 'exploration'
  ): {
    success: boolean;
    message: string;
    campaign?: MilitaryCampaign;
  } {
    const force = this.getMilitaryForce(playerId);
    const deployingUnits = force.squadrons.filter((u) => unitIds.includes(u.id));

    if (deployingUnits.length === 0) {
      return { success: false, message: 'No units found for deployment' };
    }

    const campaign: MilitaryCampaign = {
      id: `${playerId}-campaign-${Date.now()}`,
      playerId,
      name: campaignName,
      type: campaignType,
      status: 'active',
      targetGalaxy,
      targetSystem,
      targetPlanet,
      allocatedForces: unitIds,
      estimatedDuration: Math.ceil(Math.random() * 10) + 5,
      startedAt: new Date(),
      successRate: 0.65,
    };

    if (!playerCampaigns.has(playerId)) {
      playerCampaigns.set(playerId, []);
    }
    playerCampaigns.get(playerId)!.push(campaign);

    return {
      success: true,
      message: `Campaign "${campaignName}" deployed to Galaxy ${targetGalaxy}`,
      campaign,
    };
  }

  /**
   * Complete campaign and gain rewards
   */
  static completeCampaign(
    playerId: string,
    campaignId: string,
    successful: boolean = true
  ): {
    success: boolean;
    message: string;
    rewards?: { experience?: number; morale?: number; resources?: Record<string, number> };
  } {
    const campaigns = playerCampaigns.get(playerId) || [];
    const campaign = campaigns.find((c) => c.id === campaignId);

    if (!campaign) {
      return { success: false, message: 'Campaign not found' };
    }

    campaign.status = successful ? 'completed' : 'failed';
    campaign.completedAt = new Date();

    const rewards = {
      experience: successful ? 500 : 100,
      morale: successful ? 10 : -5,
      resources: successful
        ? { credits: 1000, materials: 500 }
        : { credits: 100, materials: 0 },
    };

    // Award experience to deployed units
    const force = this.getMilitaryForce(playerId);
    campaign.allocatedForces.forEach((unitId) => {
      this.gainUnitExperience(playerId, unitId, rewards.experience!);
    });

    // Boost morale
    force.totalMorale = Math.min(100, force.totalMorale + rewards.morale!);

    return {
      success: true,
      message: `Campaign "${campaign.name}" ${successful ? 'successful' : 'failed'}`,
      rewards,
    };
  }

  /**
   * Get player campaigns
   */
  static getCampaigns(playerId: string): MilitaryCampaign[] {
    return playerCampaigns.get(playerId) || [];
  }

  /**
   * Get active campaigns
   */
  static getActiveCampaigns(playerId: string): MilitaryCampaign[] {
    return this.getCampaigns(playerId).filter((c) => c.status === 'active');
  }

  /**
   * Dismiss unit
   */
  static dismissUnit(
    playerId: string,
    unitId: string
  ): {
    success: boolean;
    message: string;
  } {
    const force = this.getMilitaryForce(playerId);
    const index = force.squadrons.findIndex((u) => u.id === unitId);

    if (index === -1) {
      return { success: false, message: 'Unit not found' };
    }

    const unit = force.squadrons[index];
    force.squadrons.splice(index, 1);

    this.updateMilitaryForceStats(playerId);

    return { success: true, message: `Unit dismissed` };
  }

  /**
   * Calculate combat power for a unit squad
   */
  static calculateCombatPower(playerId: string, unitIds: string[]): number {
    const force = this.getMilitaryForce(playerId);
    const units = force.squadrons.filter((u) => unitIds.includes(u.id));
    const subsystems = units
      .map((u) => getArmySubsystemById(u.subsystemId))
      .filter((s): s is ArmySubsystem => s !== null);

    return calculateSquadCombatPower(subsystems);
  }

  /**
   * Simulate tactical combat
   */
  static simulateCombat(
    playerA: string,
    unitsA: string[],
    playerB: string,
    unitsB: string[]
  ): {
    winner: string;
    aCasualties: number;
    bCasualties: number;
    aExperience: number;
    bExperience: number;
  } {
    const powerA = this.calculateCombatPower(playerA, unitsA);
    const powerB = this.calculateCombatPower(playerB, unitsB);

    const totalPower = powerA + powerB;
    const aWinChance = powerA / totalPower;

    const aWins = Math.random() < aWinChance;
    const winner = aWins ? playerA : playerB;

    const casualtyModifier = 0.3;
    const aCasualties = Math.round((1 - aWinChance) * casualtyModifier * 1000);
    const bCasualties = Math.round(aWinChance * casualtyModifier * 1000);

    return {
      winner,
      aCasualties,
      bCasualties,
      aExperience: aWins ? 300 : 100,
      bExperience: aWins ? 100 : 300,
    };
  }

  /**
   * Update military force statistics
   */
  private static updateMilitaryForceStats(playerId: string): void {
    const force = this.getMilitaryForce(playerId);

    if (force.squadrons.length === 0) {
      force.totalStrength = 0;
      force.totalMorale = 50;
      force.averageExperience = 0;
      return;
    }

    force.totalStrength = force.squadrons.reduce((sum, u) => sum + u.quantity, 0);

    const avgMorale = Math.round(
      force.squadrons.reduce((sum, u) => sum + u.morale, 0) / force.squadrons.length
    );
    force.totalMorale = avgMorale;

    const avgExp = Math.round(
      force.squadrons.reduce((sum, u) => sum + u.experience, 0) /
        force.squadrons.length
    );
    force.averageExperience = avgExp;

    // Commander bonus based on highest level unit
    const maxLevel = Math.max(...force.squadrons.map((u) => u.level));
    force.commanderBonus = Math.min(maxLevel * 5, 50);
  }

  /**
   * Get military summary
   */
  static getMilitarySummary(playerId: string): {
    force: MilitaryForce;
    totalUnits: number;
    divisions: { [role: string]: number };
    activeCampaigns: number;
  } {
    const force = this.getMilitaryForce(playerId);
    const totalUnits = force.squadrons.reduce((sum, u) => sum + u.quantity, 0);

    const divisions: { [role: string]: number } = {};
    force.squadrons.forEach((u) => {
      const subsystem = getArmySubsystemById(u.subsystemId);
      if (subsystem) {
        divisions[subsystem.role] = (divisions[subsystem.role] || 0) + u.quantity;
      }
    });

    const activeCampaigns = this.getActiveCampaigns(playerId).length;

    return {
      force,
      totalUnits,
      divisions,
      activeCampaigns,
    };
  }
}

export default ArmySystemService;
