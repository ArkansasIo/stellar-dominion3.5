// Combat System Configuration - PVP/PVE Modes with Flange System

export const COMBAT_CONFIG = {
  modes: {
    singlePlayerPvE: { name: "Solo PvE", players: 1, maxUnits: 500, flangeBonus: 0 },
    groupPvE: { name: "Group PvE", players: 2-6, maxUnits: 2000, flangeBonus: 0.15 },
    singlePlayerPvP: { name: "Solo PvP", players: 1, maxUnits: 500, flangeBonus: 0 },
    groupPvP: { name: "Group PvP", players: 2-6, maxUnits: 2000, flangeBonus: 0.25 },
  },
  
  // Flange System - Tactical formation bonuses
  flanges: {
    balanced: { flankBonus: 1.0, description: "Balanced formation", defenseMult: 1.0, offenseMult: 1.0 },
    aggressive: { flankBonus: 1.5, description: "Aggressive attack formation", defenseMult: 0.8, offenseMult: 1.4 },
    defensive: { flankBonus: 0.7, description: "Defensive formation", defenseMult: 1.5, offenseMult: 0.7 },
    flanking: { flankBonus: 1.8, description: "Flanking attack", defenseMult: 0.6, offenseMult: 1.8, requiresPositionAdvantage: true },
    pincer: { flankBonus: 2.0, description: "Pincer movement", defenseMult: 0.7, offenseMult: 2.0, requiresTeamCoordination: true },
    circle: { flankBonus: 1.2, description: "Circular formation", defenseMult: 1.2, offenseMult: 1.0 },
    wedge: { flankBonus: 1.6, description: "Wedge formation", defenseMult: 0.9, offenseMult: 1.6 },
  },

  // Combat mechanics
  mechanics: {
    shieldRegeneration: 0.1,
    evasionBase: 5,
    accuracyBase: 90,
    damageVariance: 0.15,
    maxCombatTurns: 20,
    criticalChanceBase: 5,
    criticalDamageMultiplier: 1.5,
  },

  // PvE difficulty modifiers
  pveDifficulty: {
    easy: { enemyHealthMultiplier: 0.7, enemyDamageMultiplier: 0.6, lootMultiplier: 1.0 },
    normal: { enemyHealthMultiplier: 1.0, enemyDamageMultiplier: 1.0, lootMultiplier: 1.5 },
    hard: { enemyHealthMultiplier: 1.5, enemyDamageMultiplier: 1.3, lootMultiplier: 2.5 },
    extreme: { enemyHealthMultiplier: 2.5, enemyDamageMultiplier: 2.0, lootMultiplier: 5.0 },
    nightmare: { enemyHealthMultiplier: 4.0, enemyDamageMultiplier: 3.0, lootMultiplier: 10.0 },
  },

  // PvP ranking system
  pvpRanks: [
    { rank: 1, name: "Recruit", minRating: 0, maxRating: 1000 },
    { rank: 2, name: "Soldier", minRating: 1000, maxRating: 2000 },
    { rank: 3, name: "Veteran", minRating: 2000, maxRating: 3500 },
    { rank: 4, name: "Elite", minRating: 3500, maxRating: 5000 },
    { rank: 5, name: "Champion", minRating: 5000, maxRating: 7000 },
    { rank: 6, name: "Legend", minRating: 7000, maxRating: 10000 },
    { rank: 7, name: "Mythic", minRating: 10000, maxRating: Infinity },
  ],

  // Rewards
  rewards: {
    pvE: { silverMultiplier: 1.0, goldMultiplier: 1.0, experienceMultiplier: 1.0 },
    pvP: { silverMultiplier: 2.0, goldMultiplier: 3.0, experienceMultiplier: 2.0, ratingGain: 10 },
  },
};

// Flange positioning system
export interface FlangePosition {
  flange: string;
  unitCount: number;
  position: "front" | "middle" | "back" | "left" | "right";
  morale: number;
}

// Combat participant structure
export interface CombatParticipant {
  playerId: string;
  commanderId: string;
  fleetComposition: { [unitId: string]: number };
  troopComposition: { [troopId: string]: number };
  flangeFormation: FlangePosition[];
  health: number;
  maxHealth: number;
}

// Combat instance
export interface CombatInstance {
  id: string;
  mode: "singlePlayerPvE" | "groupPvE" | "singlePlayerPvP" | "groupPvP";
  participants: CombatParticipant[];
  currentTurn: number;
  maxTurns: number;
  status: "active" | "paused" | "completed" | "failed";
  winner?: string; // playerId
  combatLog: CombatTurn[];
  rewards: { silver: number; gold: number; platinum: number; experience: number };
  startTime: Date;
  endTime?: Date;
}

// Combat turn log
export interface CombatTurn {
  turnNumber: number;
  actions: CombatAction[];
  results: string[];
}

// Individual combat action
export interface CombatAction {
  attacker: string; // playerId
  defender: string; // playerId
  damage: number;
  flangeBonus: number;
  wasHit: boolean;
  isCritical: boolean;
}
