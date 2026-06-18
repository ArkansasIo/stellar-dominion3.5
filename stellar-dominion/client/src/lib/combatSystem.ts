import { CommanderState } from './commanderTypes';
import { unitData, UnitItem } from './unitData';

// Create unit lookup object for O(1) access
const unitLookup: { [key: string]: UnitItem } = {};
unitData.forEach(unit => {
  unitLookup[unit.id] = unit;
});

export type CombatType = "raid" | "attack" | "spy" | "sabotage";

export interface CombatUnit {
  unitId: string;
  count: number;
  unitData: UnitItem;
}

export interface CombatResult {
  winner: "attacker" | "defender" | "draw" | "spy_success" | "spy_failed";
  rounds: number;
  attackerLosses: { [unitId: string]: number };
  defenderLosses: { [unitId: string]: number };
  totalAttackerDamage: number;
  totalDefenderDamage: number;
  loot: { metal: number; crystal: number; deuterium: number };
  debris: { metal: number; crystal: number };
  battleLog: BattleRound[];
}

export interface BattleRound {
  round: number;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  description: string;
}

// Calculate commander combat bonuses based on class and stats
export function getCommanderCombatBonus(commander: CommanderState | null) {
  if (!commander?.stats) return { offenseMultiplier: 1, defenseMultiplier: 1, hpMultiplier: 1 };
  
  let offenseMultiplier = 1;
  let defenseMultiplier = 1;
  let hpMultiplier = 1;
  
  // Class bonuses
  if (commander.class) {
    const classStr = String(commander.class);
    if (classStr === "warrior") {
      offenseMultiplier += 0.2;
      defenseMultiplier += 0.15;
    } else if (classStr === "scout") {
      offenseMultiplier += 0.1;
      defenseMultiplier += 0.05;
    } else if (classStr === "industrialist") {
      defenseMultiplier += 0.25;
    } else if (classStr === "scientist") {
      offenseMultiplier += 0.15;
    }
  }
  
  // Stats bonuses
  offenseMultiplier += (commander.stats.warfare || 0) * 0.02;
  defenseMultiplier += (commander.stats.logistics || 0) * 0.02;
  hpMultiplier += (commander.stats.engineering || 0) * 0.01;
  
  return { offenseMultiplier, defenseMultiplier, hpMultiplier };
}

// Calculate total offense/defense for a fleet
export function calculateFleetStats(fleet: { [unitId: string]: number }, commanderBonus: { offenseMultiplier: number; defenseMultiplier: number; hpMultiplier: number }) {
  let totalOffense = 0;
  let totalDefense = 0;
  let totalHp = 0;
  
  Object.entries(fleet).forEach(([unitId, count]) => {
    const unit = unitLookup[unitId];
    if (unit) {
      totalOffense += (unit.stats?.attack || 0) * count * commanderBonus.offenseMultiplier;
      totalDefense += (unit.stats?.shield || 0) * count * commanderBonus.defenseMultiplier;
      totalHp += (unit.stats?.structure || 100) * count * commanderBonus.hpMultiplier;
    }
  });
  
  return { totalOffense, totalDefense, totalHp };
}

// Simulate combat between attacker and defender
export function simulatePvPCombat(
  attackerFleet: { [unitId: string]: number },
  defenderFleet: { [unitId: string]: number },
  attackerCommander: CommanderState | null,
  defenderCommander: CommanderState | null,
  combatType: CombatType = "attack"
): CombatResult {
  const battleLog: BattleRound[] = [];
  const maxRounds = 6;
  
  const attBonus = getCommanderCombatBonus(attackerCommander);
  const defBonus = getCommanderCombatBonus(defenderCommander);
  
  let attStats = calculateFleetStats(attackerFleet, attBonus);
  let defStats = calculateFleetStats(defenderFleet, defBonus);
  
  let attackerLosses: { [unitId: string]: number } = {};
  let defenderLosses: { [unitId: string]: number } = {};
  let totalAttackerDamage = 0;
  let totalDefenderDamage = 0;
  
  // Initialize losses tracking
  Object.keys(attackerFleet).forEach(id => attackerLosses[id] = 0);
  Object.keys(defenderFleet).forEach(id => defenderLosses[id] = 0);
  
  let attHp = attStats.totalHp;
  let defHp = defStats.totalHp;
  
  let round = 0;
  while (round < maxRounds && attHp > 0 && defHp > 0) {
    round++;
    
    // Attacker deals damage
    const attDamage = Math.max(1, Math.floor(attStats.totalOffense * (0.8 + Math.random() * 0.4)));
    defHp = Math.max(0, defHp - attDamage);
    totalAttackerDamage += attDamage;
    
    // Defender deals damage
    const defDamage = Math.max(0, Math.floor(defStats.totalOffense * (0.8 + Math.random() * 0.4)));
    attHp = Math.max(0, attHp - defDamage);
    totalDefenderDamage += defDamage;
    
    // Calculate losses (proportional to damage taken)
    if (defHp <= 0) {
      Object.entries(defenderFleet).forEach(([unitId, count]) => {
        defenderLosses[unitId] = count;
      });
    } else {
      const defLossPercent = Math.min(1, totalDefenderDamage / (defStats.totalHp + 1));
      Object.entries(defenderFleet).forEach(([unitId, count]) => {
        defenderLosses[unitId] = Math.floor(count * defLossPercent);
      });
    }
    
    if (attHp <= 0) {
      Object.entries(attackerFleet).forEach(([unitId, count]) => {
        attackerLosses[unitId] = count;
      });
    } else {
      const attLossPercent = Math.min(1, totalAttackerDamage / (attStats.totalHp + 1));
      Object.entries(attackerFleet).forEach(([unitId, count]) => {
        attackerLosses[unitId] = Math.floor(count * attLossPercent);
      });
    }
    
    const log: BattleRound = {
      round,
      attackerDamageDealt: attDamage,
      defenderDamageDealt: defDamage,
      description: `Round ${round}: Attacker dealt ${attDamage} damage, Defender dealt ${defDamage} damage. Attacker HP: ${Math.max(0, attHp)}, Defender HP: ${Math.max(0, defHp)}`
    };
    battleLog.push(log);
  }
  
  // Determine winner
  let winner: "attacker" | "defender" | "draw" = "draw";
  if (attHp > 0 && defHp <= 0) winner = "attacker";
  else if (defHp > 0 && attHp <= 0) winner = "defender";
  
  // Calculate loot (only for successful attacks)
  let loot = { metal: 0, crystal: 0, deuterium: 0 };
  if (winner === "attacker") {
    const cargoCapacity = Object.entries(attackerFleet).reduce((sum, [unitId, count]) => {
      const unit = unitLookup[unitId];
      return sum + ((unit?.stats?.cargo || 0) * (count - (attackerLosses[unitId] || 0)));
    }, 0);
    
    // Assume defender planet has resources
    const defResources = 50000;
    const stealablePerResource = Math.min(cargoCapacity / 3, defResources * 0.5);
    
    loot = {
      metal: Math.floor(stealablePerResource),
      crystal: Math.floor(stealablePerResource),
      deuterium: Math.floor(stealablePerResource)
    };
  }
  
  // Calculate debris (30% of losses)
  const totalLosses = Object.values(attackerLosses).reduce((sum, count) => {
    const avgCost = 100; // Mock average unit cost
    return sum + (count * avgCost);
  }, 0) + Object.values(defenderLosses).reduce((sum, count) => {
    const avgCost = 100;
    return sum + (count * avgCost);
  }, 0);
  
  const debris = {
    metal: Math.floor(totalLosses * 0.3 * 0.6),
    crystal: Math.floor(totalLosses * 0.3 * 0.4)
  };
  
  return {
    winner,
    rounds: round,
    attackerLosses,
    defenderLosses,
    totalAttackerDamage,
    totalDefenderDamage,
    loot,
    debris,
    battleLog
  };
}
