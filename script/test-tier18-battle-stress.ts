import assert from "node:assert/strict";
import {
  COMBAT_CONFIG,
  getUnitStats,
  simulateBattle,
} from "../server/combatEngine";
import { getKardashevOperationalBonuses } from "../shared/config/kardashevOperationalBonuses";

const MAX_FLEET_CAP = 999_999;
const STRESS_UNIT = "dreadnought";
const TIER18 = getKardashevOperationalBonuses(18);
const ORIGINAL_MAX_ROUNDS = COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS;

function force(count: number, bonusMultiplier: number) {
  return {
    units: { [STRESS_UNIT]: { type: STRESS_UNIT, count } },
    research: {},
    bonusMultiplier,
  };
}

function totalUnits(units: Record<string, number | { count: number }>) {
  return Object.values(units).reduce<number>((sum: number, unit) => {
    const count = typeof unit === "number" ? unit : unit?.count;
    return sum + Number(count || 0);
  }, 0);
}

function runScenario(label: string, attackerMultiplier: number, defenderMultiplier: number) {
  const attackerStats = getUnitStats(STRESS_UNIT, {}, attackerMultiplier)!;
  const defenderStats = getUnitStats(STRESS_UNIT, {}, defenderMultiplier)!;
  assert(Number.isFinite(attackerStats.attack) && Number.isFinite(defenderStats.defense));

  const startedAt = Date.now();
  const result = simulateBattle(force(MAX_FLEET_CAP, attackerMultiplier), force(MAX_FLEET_CAP, defenderMultiplier));
  const elapsedMs = Date.now() - startedAt;
  const attackerRemaining = totalUnits(result.attackerUnits as Record<string, number | { count: number }>);
  const defenderRemaining = totalUnits(result.defenderUnits as Record<string, number | { count: number }>);

  assert(result.rounds >= 1 && result.rounds <= COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS);
  assert(Number.isFinite(result.attackerCasualties) && result.attackerCasualties >= 0);
  assert(Number.isFinite(result.defenderCasualties) && result.defenderCasualties >= 0);
  assert(attackerRemaining >= 0 && defenderRemaining >= 0);
  assert(attackerRemaining <= MAX_FLEET_CAP && defenderRemaining <= MAX_FLEET_CAP);

  return {
    label,
    attackerMultiplier,
    defenderMultiplier,
    attackerAttackPerUnit: attackerStats.attack,
    defenderDefensePerUnit: defenderStats.defense,
    rounds: result.rounds,
    winner: result.winner,
    attackerRemaining,
    defenderRemaining,
    attackerCasualties: result.attackerCasualties,
    defenderCasualties: result.defenderCasualties,
    elapsedMs,
  };
}

try {
  // Two rounds are enough to exercise the real per-unit resolution path while
  // keeping this maximum-cap stress test bounded for local development.
  COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS = 2;
  const baseline = runScenario("Tier 1 baseline", 1, 1);
  const tier18Mirror = runScenario("Tier 18 mirror", TIER18.fleetPowerMultiplier, TIER18.defensePowerMultiplier);
  const tier18Attack = runScenario("Tier 18 attack versus baseline defense", TIER18.fleetPowerMultiplier, 1);

  assert.equal(TIER18.fleetPowerMultiplier, 31);
  assert.equal(TIER18.defensePowerMultiplier, 31);
  assert.equal(tier18Mirror.attackerAttackPerUnit / baseline.attackerAttackPerUnit, 31);
  assert.equal(tier18Mirror.defenderDefensePerUnit / baseline.defenderDefensePerUnit, 31);

  console.log(JSON.stringify({
    tier: 18,
    tierName: TIER18.tierName,
    configuredMaxFleetCap: MAX_FLEET_CAP,
    fleetPowerMultiplier: TIER18.fleetPowerMultiplier,
    defensePowerMultiplier: TIER18.defensePowerMultiplier,
    scenarios: [baseline, tier18Mirror, tier18Attack],
    status: "PASS",
  }, null, 2));
} finally {
  COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS = ORIGINAL_MAX_ROUNDS;
}
