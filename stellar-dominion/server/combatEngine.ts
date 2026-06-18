import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";

// Combat configuration
export const COMBAT_CONFIG = {
  // Unit stats (attack, defense, health)
  UNIT_STATS: {
    lightFighter: { attack: 50, defense: 20, health: 100, speed: 12 },
    heavyFighter: { attack: 80, defense: 40, health: 150, speed: 10 },
    smallCargo: { attack: 10, defense: 15, health: 400, speed: 8 },
    largeCargo: { attack: 5, defense: 10, health: 800, speed: 5 },
    espionageProbe: { attack: 1, defense: 5, health: 50, speed: 20 },
    battleship: { attack: 200, defense: 100, health: 600, speed: 6 },
    cruiser: { attack: 120, defense: 60, health: 400, speed: 8 },
    destroyer: { attack: 90, defense: 50, health: 300, speed: 10 },
    dreadnought: { attack: 300, defense: 150, health: 1000, speed: 4 },
    colonist: { attack: 5, defense: 5, health: 50, speed: 3 },
  } as any,

  // Research bonuses
  RESEARCH_BONUSES: {
    weaponsTech: 0.05, // +5% attack per level
    shieldingTech: 0.05, // +5% defense per level
    armourTech: 0.03, // +3% health per level
    combustionDrive: 0.02, // +2% speed per level
  },

  // Battle configuration
  BATTLE_CONFIG: {
    MAX_ROUNDS: 100,
    CRITICAL_CHANCE_BASE: 0.05, // 5% base critical chance
    CRITICAL_MULTIPLIER: 1.5, // 50% extra damage on crit
    MINIMUM_DAMAGE: 1, // Never 0 damage
  }
};

export interface CombatUnit {
  type: string;
  count: number;
  actualHP?: number;
}

export interface CombatForce {
  units: { [key: string]: CombatUnit };
  research?: { [key: string]: number };
  bonusMultiplier?: number;
}

export interface BattleResult {
  winner: "attacker" | "defender" | "draw";
  attackerUnits: { [key: string]: number };
  defenderUnits: { [key: string]: number };
  attackerCasualties: number;
  defenderCasualties: number;
  rounds: number;
  battleLog: string[];
}

/**
 * Calculate effective stats with research bonuses
 */
export function getUnitStats(
  unitType: string,
  research: { [key: string]: number } = {},
  bonusMultiplier: number = 1
) {
  const baseStats = COMBAT_CONFIG.UNIT_STATS[unitType];
  if (!baseStats) return null;

  let attack = baseStats.attack * bonusMultiplier;
  let defense = baseStats.defense * bonusMultiplier;
  let health = baseStats.health * bonusMultiplier;
  let speed = baseStats.speed * bonusMultiplier;

  // Apply research bonuses
  attack *= 1 + ((research.weaponsTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.weaponsTech);
  defense *= 1 + ((research.shieldingTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.shieldingTech);
  health *= 1 + ((research.armourTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.armourTech);
  speed *= 1 + ((research.combustionDrive || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.combustionDrive);

  return { attack, defense, health, speed };
}

/**
 * Calculate damage with accuracy and critical hit system
 */
export function calculateDamage(
  attackerStats: any,
  defenderStats: any,
  isCritical: boolean = false
): number {
  // Base damage = attacker attack - defender defense
  let baseDamage = Math.max(
    COMBAT_CONFIG.BATTLE_CONFIG.MINIMUM_DAMAGE,
    attackerStats.attack - defenderStats.defense * 0.5
  );

  // Add variance (±20%)
  const variance = 1 + (Math.random() - 0.5) * 0.4;
  let damage = baseDamage * variance;

  // Apply critical hit multiplier
  if (isCritical) {
    damage *= COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_MULTIPLIER;
  }

  return Math.ceil(damage);
}

/**
 * Simulate a single combat round
 */
export function simulateCombatRound(
  attackerForce: CombatForce,
  defenderForce: CombatForce,
  roundNumber: number
): { attackerLosses: number; defenderLosses: number; log: string } {
  let attackerDamage = 0;
  let defenderDamage = 0;
  const logEntries: string[] = [];

  // Attacker units attack
  for (const [unitType, unit] of Object.entries(attackerForce.units)) {
    if (unit.count <= 0) continue;

    const stats = getUnitStats(
      unitType,
      attackerForce.research,
      attackerForce.bonusMultiplier
    );
    if (!stats) continue;

    // Each unit attacks defender
    for (let i = 0; i < unit.count; i++) {
      const isCritical =
        Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;
      const targetUnit = Object.values(defenderForce.units).find(u => u.count > 0);
      if (!targetUnit) break;

      const targetStats = getUnitStats(
        targetUnit.type,
        defenderForce.research,
        defenderForce.bonusMultiplier
      );
      if (!targetStats) continue;

      const damage = calculateDamage(stats, targetStats, isCritical);
      attackerDamage += damage;

      if (isCritical) {
        logEntries.push(
          `Round ${roundNumber}: ${unitType} CRITICAL HIT for ${damage} damage!`
        );
      }
    }
  }

  // Defender units counter-attack
  for (const [unitType, unit] of Object.entries(defenderForce.units)) {
    if (unit.count <= 0) continue;

    const stats = getUnitStats(
      unitType,
      defenderForce.research,
      defenderForce.bonusMultiplier
    );
    if (!stats) continue;

    // Each unit attacks attacker
    for (let i = 0; i < unit.count; i++) {
      const isCritical =
        Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;
      const targetUnit = Object.values(attackerForce.units).find(u => u.count > 0);
      if (!targetUnit) break;

      const targetStats = getUnitStats(
        targetUnit.type,
        attackerForce.research,
        attackerForce.bonusMultiplier
      );
      if (!targetStats) continue;

      const damage = calculateDamage(stats, targetStats, isCritical);
      defenderDamage += damage;
    }
  }

  // Apply casualties
  let attackerLosses = 0;
  let defenderLosses = 0;

  defenderLosses = Math.ceil(attackerDamage / 100); // Simplistic casualty calculation
  attackerLosses = Math.ceil(defenderDamage / 100);

  const log = logEntries.join("\n") || `Round ${roundNumber}: Both sides exchange fire.`;

  return { attackerLosses, defenderLosses, log };
}

/**
 * Simulate full battle until one side is defeated
 */
export function simulateBattle(
  attackerForce: CombatForce,
  defenderForce: CombatForce
): BattleResult {
  const battleLog: string[] = [];
  let round = 0;

  // Deep copy to avoid mutating original
  const attacker = JSON.parse(JSON.stringify(attackerForce));
  const defender = JSON.parse(JSON.stringify(defenderForce));

  while (round < COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS) {
    round++;

    // Check if either side is defeated
    const attackerUnitCount = Object.values(attacker.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );
    const defenderUnitCount = Object.values(defender.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );

    if (attackerUnitCount === 0) {
      battleLog.push("Battle ended: Attacker defeated!");
      return {
        winner: "defender",
        attackerUnits: attacker.units,
        defenderUnits: defender.units,
        attackerCasualties: Object.values(attackerForce.units).reduce(
          (sum: number, u: any) => sum + u.count,
          0
        ),
        defenderCasualties: Object.values(defenderForce.units).reduce(
          (sum: number, u: any) => sum + u.count,
          0
        ) - defenderUnitCount,
        rounds: round,
        battleLog,
      };
    }

    if (defenderUnitCount === 0) {
      battleLog.push("Battle ended: Defender defeated!");
      return {
        winner: "attacker",
        attackerUnits: attacker.units,
        defenderUnits: defender.units,
        attackerCasualties: Object.values(attackerForce.units).reduce(
          (sum: number, u: any) => sum + u.count,
          0
        ) - attackerUnitCount,
        defenderCasualties: Object.values(defenderForce.units).reduce(
          (sum: number, u: any) => sum + u.count,
          0
        ),
        rounds: round,
        battleLog,
      };
    }

    // Simulate round
    const { attackerLosses, defenderLosses, log } = simulateCombatRound(
      attacker,
      defender,
      round
    );

    battleLog.push(log);

    // Apply casualties (remove from weakest units first)
    let remaining = attackerLosses;
    for (const unit of Object.values(attacker.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }

    remaining = defenderLosses;
    for (const unit of Object.values(defender.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }
  }

  // If max rounds reached, attacker wins by default
  battleLog.push("Battle ended: Max rounds reached, attacker victorious!");
  return {
    winner: "attacker",
    attackerUnits: attacker.units,
    defenderUnits: defender.units,
    attackerCasualties: Object.values(attackerForce.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    ),
    defenderCasualties: Object.values(defenderForce.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    ),
    rounds: round,
    battleLog,
  };
}

/**
 * Calculate battle resources (metal/crystal/deut from victory)
 */
export function calculateVictoryResources(
  defenderResources: { metal: number; crystal: number; deuterium: number },
  winner: string
): { metal: number; crystal: number; deuterium: number } {
  const plunderRate = 0.3; // Plunder 30% of resources

  return {
    metal: Math.floor(defenderResources.metal * plunderRate),
    crystal: Math.floor(defenderResources.crystal * plunderRate),
    deuterium: Math.floor(defenderResources.deuterium * plunderRate),
  };
}
