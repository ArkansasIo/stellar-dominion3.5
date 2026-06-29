import {
  computeFinalDamage,
  computeTotalEffectiveHP,
  simulateCombatRound,
  simulateFullCombat,
  getFleetAccuracy,
  getFleetEvasion,
  getCriticalChance,
  getHeavyStrikeChance,
  getHeavyStrikeEvasion,
  getPositionMultiplier,
  formatStatValue,
  calculateEffectiveDamage,
  calculateAccuracy,
  calculateEvasionChance,
  calculateCriticalChance,
  calculateShieldAbsorption,
  calculateHullDamageReduction,
  calculateDamageResistance,
  calculateWarpSpeed,
  DEFAULT_EMPIRE_COMBAT_STATS,
  type EmpireCombatStats,
  type AttackContext,
  type CombatResult,
  type BattleMode as CombatBattleMode,
  type WeaponCategory,
  type AttackPosition,
} from "../../Source/Shared/config";

export interface CombatSimulationRequest {
  attacker: Partial<EmpireCombatStats>;
  defender: Partial<EmpireCombatStats>;
  baseAtkDamage: number;
  baseDefDamage: number;
  mode: CombatBattleMode;
}

export interface CombatSimulationResponse {
  result: CombatResult;
  summary: {
    winner: string;
    rounds: number;
    attackerStartingHP: number;
    defenderStartingHP: number;
    attackerEffectiveDamage: number;
    defenderEffectiveDamage: number;
  };
}

class CombatFormulaService {
  buildDefaultStats(overrides?: Partial<EmpireCombatStats>): EmpireCombatStats {
    const base: EmpireCombatStats = JSON.parse(JSON.stringify(DEFAULT_EMPIRE_COMBAT_STATS));
    if (!overrides) return base;
    if (overrides.fleet) Object.assign(base.fleet, overrides.fleet);
    if (overrides.pvp) Object.assign(base.pvp, overrides.pvp);
    if (overrides.pve) Object.assign(base.pve, overrides.pve);
    if (overrides.resistance) Object.assign(base.resistance, overrides.resistance);
    if (overrides.electronicWarfare) Object.assign(base.electronicWarfare, overrides.electronicWarfare);
    if (overrides.technology) Object.assign(base.technology, overrides.technology);
    if (overrides.bonuses) Object.assign(base.bonuses, overrides.bonuses);
    if (overrides.tactical) Object.assign(base.tactical, overrides.tactical);
    if (overrides.empire) Object.assign(base.empire, overrides.empire);
    return base;
  }

  simulate(params: CombatSimulationRequest): CombatSimulationResponse {
    const attacker = this.buildDefaultStats(params.attacker);
    const defender = this.buildDefaultStats(params.defender);

    const result = simulateFullCombat(
      attacker,
      defender,
      params.mode,
      params.baseAtkDamage,
      params.baseDefDamage,
      6,
    );

    const attackerED = calculateEffectiveDamage(
      params.baseAtkDamage,
      attacker.fleet.firepower.attackPower,
      attacker.fleet.firepower.combatEfficiency,
      attacker.fleet.firepower.weaponSystemsBonus,
      attacker.fleet.firepower.speciesCombatBonus,
    );
    const defenderED = calculateEffectiveDamage(
      params.baseDefDamage,
      defender.fleet.firepower.attackPower,
      defender.fleet.firepower.combatEfficiency,
      defender.fleet.firepower.weaponSystemsBonus,
      defender.fleet.firepower.speciesCombatBonus,
    );

    return {
      result,
      summary: {
        winner: result.winner,
        rounds: result.totalRounds,
        attackerStartingHP: result.attackerStartingHP,
        defenderStartingHP: result.defenderStartingHP,
        attackerEffectiveDamage: Math.round(attackerED),
        defenderEffectiveDamage: Math.round(defenderED),
      },
    };
  }

  calculateStatBreakdown(stats: EmpireCombatStats) {
    const fp = stats.fleet.firepower;
    const def = stats.fleet.defense;
    const acc = stats.fleet.accuracy;
    const ev = stats.fleet.evasion;
    const crit = stats.fleet.critical;
    const res = stats.resistance;

    return {
      effectiveDamage: calculateEffectiveDamage(
        100, fp.attackPower, fp.combatEfficiency, fp.weaponSystemsBonus, fp.speciesCombatBonus,
      ),
      accuracy: calculateAccuracy(acc.fleetAccuracy, acc.commanderTargetingBonus, 0),
      evasion: calculateEvasionChance(ev.fleetEvasion, acc.fleetAccuracy, 1.0),
      critChance: calculateCriticalChance(crit.fleetCriticalChance, crit.criticalDamageBonus, 0),
      shieldAbsorption: calculateShieldAbsorption(1000, def.shieldRating, def.energyShield),
      hullReduction: calculateHullDamageReduction(1000, def.hullDamageReduction, def.fleetArmor),
      damageResistance: calculateDamageResistance(0, def.fleetArmor),
      warpSpeed: calculateWarpSpeed(1000, stats.empire.mobility.warpSpeedBonus),
      combatStats: {
        attackPower: fp.attackPower,
        fleetArmor: def.fleetArmor,
        shieldRating: def.shieldRating,
        sensorRangeBonus: fp.sensorRangeBonus,
      },
      effectiveHP: computeTotalEffectiveHP(stats),
    };
  }

  formatStatsForDisplay(statsRecord: Record<string, number>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(statsRecord)) {
      result[key] = formatStatValue(key, value);
    }
    return result;
  }
}

export const combatFormulaService = new CombatFormulaService();
