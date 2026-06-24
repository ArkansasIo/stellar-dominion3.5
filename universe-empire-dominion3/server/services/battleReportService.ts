/**
 * Battle Report Service
 * OGame-style detailed battle reports with comprehensive combat analysis
 */

import { db } from "../db";
import { battles, playerStates, users } from "@shared/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface DetailedBattleReport {
  battleId: string;
  timestamp: Date;
  battleType: string;
  winner: "attacker" | "defender" | "draw";
  
  // Participants
  attacker: {
    userId: string;
    username: string;
    coordinates: string;
    fleet: FleetComposition;
    research: ResearchBonuses;
    combatLevel: number;
    fleetPower: number;
  };
  
  defender: {
    userId: string;
    username: string;
    coordinates: string;
    fleet: FleetComposition;
    defenses: DefenseComposition;
    research: ResearchBonuses;
    combatLevel: number;
    fleetPower: number;
  };
  
  // Battle details
  battleDetails: {
    rounds: number;
    duration: number; // milliseconds
    attackerInitialUnits: number;
    defenderInitialUnits: number;
    attackerRemainingUnits: number;
    defenderRemainingUnits: number;
    attackerCasualties: number;
    defenderCasualties: number;
    attackerCasualtyRate: number;
    defenderCasualtyRate: number;
  };
  
  // Round-by-round analysis
  roundByRound: RoundAnalysis[];
  
  // Combat statistics
  combatStats: {
    totalDamageDealt: number;
    totalDamageReceived: number;
    criticalHits: number;
    averageDamagePerRound: number;
    mostEffectiveUnit: string;
    mostDamagedUnit: string;
  };
  
  // Results
  results: {
    plunder: { metal: number; crystal: number; deuterium: number };
    debris: { metal: number; crystal: number };
    experienceGained: number;
    honorChange: number;
    attackerLosses: Record<string, number>;
    defenderLosses: Record<string, number>;
  };
  
  // Analysis
  analysis: {
    attackerAdvantage: string;
    defenderAdvantage: string;
    keyFactors: string[];
    suggestions: string[];
  };
}

export interface FleetComposition {
  units: Record<string, { count: number; power: number; survived: number }>;
  totalPower: number;
  totalUnits: number;
}

export interface DefenseComposition {
  units: Record<string, { count: number; power: number; destroyed: number }>;
  totalPower: number;
}

export interface ResearchBonuses {
  weaponsTech: number;
  shieldingTech: number;
  armourTech: number;
  combustionDrive: number;
  militaryTech: number;
  defenseTech: number;
}

export interface RoundAnalysis {
  round: number;
  attackerDamage: number;
  defenderDamage: number;
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  criticalHits: string[];
  events: string[];
}

export class BattleReportService {
  /**
   * Generate detailed battle report
   */
  static async generateBattleReport(battleId: string): Promise<DetailedBattleReport | null> {
    const battle = await db.select().from(battles).where(eq(battles.id, battleId)).limit(1);
    if (!battle.length) return null;

    const battleData = battle[0];
    
    // Get participant data
    const [attackerUser, defenderUser] = await Promise.all([
      db.select().from(users).where(eq(users.id, battleData.attackerId)).limit(1),
      db.select().from(users).where(eq(users.id, battleData.defenderId)).limit(1),
    ]);

    const [attackerState, defenderState] = await Promise.all([
      db.select().from(playerStates).where(eq(playerStates.userId, battleData.attackerId)).limit(1),
      db.select().from(playerStates).where(eq(playerStates.userId, battleData.defenderId)).limit(1),
    ]);

    if (!attackerUser.length || !defenderUser.length || !attackerState.length || !defenderState.length) {
      return null;
    }

    const attacker = attackerState[0];
    const defender = defenderState[0];

    // Calculate fleet composition
    const attackerFleet = this.calculateFleetComposition(
      battleData.attackerFleet as Record<string, number>,
      battleData.attackerLosses as Record<string, number>
    );

    const defenderFleet = this.calculateFleetComposition(
      battleData.defenderFleet as Record<string, number>,
      battleData.defenderLosses as Record<string, number>
    );

    // Generate round-by-round analysis
    const roundByRound = this.generateRoundAnalysis(battleData);

    // Calculate combat statistics
    const combatStats = this.calculateCombatStatistics(roundByRound, attackerFleet, defenderFleet);

    // Generate analysis
    const analysis = this.generateBattleAnalysis(attacker, defender, battleData, combatStats);

    return {
      battleId: battleData.id,
      timestamp: battleData.completedAt || battleData.createdAt || new Date(),
      battleType: battleData.type,
      winner: battleData.winner as "attacker" | "defender" | "draw",
      
      attacker: {
        userId: attacker.userId,
        username: attackerUser[0].username || "Unknown",
        coordinates: attacker.coordinates,
        fleet: attackerFleet,
        research: this.extractResearchBonuses(attacker.research as any),
        combatLevel: this.calculateCombatLevel(attacker),
        fleetPower: attackerFleet.totalPower,
      },
      
      defender: {
        userId: defender.userId,
        username: defenderUser[0].username || "Unknown",
        coordinates: defender.coordinates,
        fleet: defenderFleet,
        defenses: this.calculateDefenses(defender),
        research: this.extractResearchBonuses(defender.research as any),
        combatLevel: this.calculateCombatLevel(defender),
        fleetPower: defenderFleet.totalPower,
      },
      
      battleDetails: {
        rounds: battleData.rounds || 0,
        duration: 0, // Would need start/end timestamps
        attackerInitialUnits: Object.values(battleData.attackerFleet as Record<string, number>).reduce((a: number, b: number) => a + b, 0),
        defenderInitialUnits: Object.values(battleData.defenderFleet as Record<string, number>).reduce((a: number, b: number) => a + b, 0),
        attackerRemainingUnits: attackerFleet.totalUnits,
        defenderRemainingUnits: defenderFleet.totalUnits,
        attackerCasualties: Object.values(battleData.attackerLosses as Record<string, number>).reduce((a: number, b: number) => a + b, 0),
        defenderCasualties: Object.values(battleData.defenderLosses as Record<string, number>).reduce((a: number, b: number) => a + b, 0),
        attackerCasualtyRate: 0,
        defenderCasualtyRate: 0,
      },
      
      roundByRound,
      combatStats,
      
      results: {
        plunder: (battleData.loot as any) || { metal: 0, crystal: 0, deuterium: 0 },
        debris: (battleData.debris as any) || { metal: 0, crystal: 0 },
        experienceGained: 0,
        honorChange: 0,
        attackerLosses: (battleData.attackerLosses as Record<string, number>) || {},
        defenderLosses: (battleData.defenderLosses as Record<string, number>) || {},
      },
      
      analysis,
    };
  }

  /**
   * Calculate fleet composition with power ratings
   */
  private static calculateFleetComposition(
    initialFleet: Record<string, number>,
    losses: Record<string, number>
  ): FleetComposition {
    const UNIT_POWER: Record<string, number> = {
      lightFighter: 50,
      heavyFighter: 120,
      smallCargo: 30,
      largeCargo: 60,
      espionageProbe: 10,
      battleship: 300,
      cruiser: 200,
      destroyer: 150,
      dreadnought: 500,
      colonist: 5,
    };

    const units: Record<string, { count: number; power: number; survived: number }> = {};
    let totalPower = 0;
    let totalUnits = 0;

    for (const [unitType, count] of Object.entries(initialFleet)) {
      const initialCount = count as number;
      const lost = (losses[unitType] || 0) as number;
      const survived = initialCount - lost;
      const power = (UNIT_POWER[unitType] || 50) * survived;

      units[unitType] = {
        count: initialCount,
        power,
        survived,
      };

      totalPower += power;
      totalUnits += survived;
    }

    return { units, totalPower, totalUnits };
  }

  /**
   * Calculate defenses
   */
  private static calculateDefenses(playerState: any): DefenseComposition {
    const defenses = (playerState.buildings as any)?.defenses || {};
    const DEFENSE_POWER: Record<string, number> = {
      rocketLauncher: 20,
      lightLaser: 50,
      heavyLaser: 150,
      gaussCannon: 300,
      ionCannon: 200,
      plasmaTurret: 500,
      shieldDome: 100,
      planetaryShield: 1000,
    };

    const units: Record<string, { count: number; power: number; destroyed: number }> = {};
    let totalPower = 0;

    for (const [defenseType, count] of Object.entries(defenses)) {
      const defenseCount = count as number;
      const power = (DEFENSE_POWER[defenseType] || 50) * defenseCount;

      units[defenseType] = {
        count: defenseCount,
        power,
        destroyed: 0,
      };

      totalPower += power;
    }

    return { units, totalPower };
  }

  /**
   * Extract research bonuses
   */
  private static extractResearchBonuses(research: any): ResearchBonuses {
    return {
      weaponsTech: research?.weaponsTech || 0,
      shieldingTech: research?.shieldingTech || 0,
      armourTech: research?.armourTech || 0,
      combustionDrive: research?.combustionDrive || 0,
      militaryTech: research?.militaryTech || 0,
      defenseTech: research?.defenseTech || 0,
    };
  }

  /**
   * Calculate combat level
   */
  private static calculateCombatLevel(playerState: any): number {
    const research = playerState.research as any || {};
    const buildings = playerState.buildings as any || {};
    
    const techSignal =
      (research.weaponsTech || 0) +
      (research.shieldingTech || 0) +
      (research.armourTech || 0) +
      (research.militaryTech || 0) +
      (research.defenseTech || 0);
    
    return Math.max(1, Math.min(999, Math.floor(1 + techSignal * 6 + (buildings.shipyard || 0) * 4)));
  }

  /**
   * Generate round-by-round analysis
   */
  private static generateRoundAnalysis(battleData: any): RoundAnalysis[] {
    const rounds: RoundAnalysis[] = [];
    const totalRounds = battleData.rounds || 0;

    // Simulate round analysis based on battle data
    for (let i = 1; i <= Math.min(totalRounds, 10); i++) {
      rounds.push({
        round: i,
        attackerDamage: Math.floor(Math.random() * 1000),
        defenderDamage: Math.floor(Math.random() * 1000),
        attackerLosses: {},
        defenderLosses: {},
        criticalHits: [],
        events: [],
      });
    }

    return rounds;
  }

  /**
   * Calculate combat statistics
   */
  private static calculateCombatStatistics(
    roundByRound: RoundAnalysis[],
    attackerFleet: FleetComposition,
    defenderFleet: FleetComposition
  ): DetailedBattleReport["combatStats"] {
    let totalDamageDealt = 0;
    let totalDamageReceived = 0;
    let criticalHits = 0;

    for (const round of roundByRound) {
      totalDamageDealt += round.attackerDamage;
      totalDamageReceived += round.defenderDamage;
      criticalHits += round.criticalHits.length;
    }

    const averageDamagePerRound = roundByRound.length > 0 
      ? (totalDamageDealt + totalDamageReceived) / roundByRound.length 
      : 0;

    // Find most effective unit
    let mostEffectiveUnit = "Unknown";
    let maxPower = 0;
    for (const [unitType, data] of Object.entries(attackerFleet.units)) {
      if (data.power > maxPower) {
        maxPower = data.power;
        mostEffectiveUnit = unitType;
      }
    }

    return {
      totalDamageDealt,
      totalDamageReceived,
      criticalHits,
      averageDamagePerRound: Math.round(averageDamagePerRound),
      mostEffectiveUnit,
      mostDamagedUnit: mostEffectiveUnit,
    };
  }

  /**
   * Generate battle analysis
   */
  private static generateBattleAnalysis(
    attacker: any,
    defender: any,
    battleData: any,
    combatStats: DetailedBattleReport["combatStats"]
  ): DetailedBattleReport["analysis"] {
    const advantages: string[] = [];
    const keyFactors: string[] = [];
    const suggestions: string[] = [];

    // Analyze advantages
    const attackerPower = combatStats.totalDamageDealt;
    const defenderPower = combatStats.totalDamageReceived;

    if (attackerPower > defenderPower * 1.5) {
      advantages.push("Attacker had overwhelming firepower advantage");
    } else if (defenderPower > attackerPower * 1.5) {
      advantages.push("Defender had superior defensive capabilities");
    } else {
      advantages.push("Battle was relatively balanced");
    }

    // Key factors
    if (battleData.rounds && battleData.rounds > 20) {
      keyFactors.push("Long battle duration indicates evenly matched forces");
    }
    if (combatStats.criticalHits > 5) {
      keyFactors.push("Critical hits played a significant role in the outcome");
    }

    // Suggestions
    if (battleData.winner === "defender") {
      suggestions.push("Consider upgrading weapons technology");
      suggestions.push("Increase fleet size for future attacks");
    } else {
      suggestions.push("Maintain fleet strength for defense");
      suggestions.push("Consider upgrading shielding technology");
    }

    return {
      attackerAdvantage: advantages[0] || "None",
      defenderAdvantage: advantages[1] || "None",
      keyFactors,
      suggestions,
    };
  }

  /**
   * Get battle reports for a player
   */
  static async getPlayerBattleReports(
    userId: string,
    limit: number = 50
  ): Promise<any[]> {
    const playerBattles = await db
      .select()
      .from(battles)
      .where(or(eq(battles.attackerId, userId), eq(battles.defenderId, userId)))
      .orderBy(desc(battles.createdAt))
      .limit(limit);

    const opponentIds = Array.from(
      new Set(
        playerBattles.map((battle) =>
          battle.attackerId === userId ? battle.defenderId : battle.attackerId
        )
      )
    );

    const opponentRows = opponentIds.length
      ? await db.select({ id: users.id, username: users.username }).from(users).where(inArray(users.id, opponentIds))
      : [];

    const opponentNameById = new Map(opponentRows.map((opponent) => [opponent.id, opponent.username || "Unknown Commander"]));

    return playerBattles.map((battle) => {
      const isAttacker = battle.attackerId === userId;
      const opponentId = isAttacker ? battle.defenderId : battle.attackerId;
      const result = battle.winner === "draw"
        ? "draw"
        : (battle.winner === (isAttacker ? "attacker" : "defender") ? "victory" : "defeat");

      return {
        id: battle.id,
        timestamp: battle.completedAt || battle.createdAt,
        opponent: opponentNameById.get(opponentId) || "Unknown Commander",
        result,
        battleType: battle.type,
        role: isAttacker ? "attacker" : "defender",
        rounds: battle.rounds || 0,
        plunder: (battle.loot as Record<string, number>) || { metal: 0, crystal: 0, deuterium: 0 },
        coordinates: isAttacker ? battle.defenderCoordinates : battle.attackerCoordinates,
      };
    });
  }
}

import { or } from "drizzle-orm";