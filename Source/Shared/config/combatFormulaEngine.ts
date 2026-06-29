import {
  type EmpireCombatStats,
  type FleetFirepower,
  type FleetAccuracy,
  type CriticalStrikeSystems,
  type FleetDefense,
  type EvasionSystems,
  type TechnologyStats,
  type ResistanceSystems,
  type ElectronicWarfareStats,
  type PvPWarfareStats,
  type PvEStats,
  type TacticalCombatStats,
  type EmpireBonuses,
} from './empireStatsConfig';

export type BattleMode = 'pve' | 'pvp';
export type WeaponCategory = 'missile' | 'energy' | 'kinetic';
export type AttackPosition = 'front' | 'flank' | 'rear';

export interface DamageOutput {
  rawDamage: number;
  effectiveDamage: number;
  shieldDamage: number;
  hullDamage: number;
  isCritical: boolean;
  isHeavyStrike: boolean;
  damageAfterResistance: number;
  finalDamage: number;
}

export interface AttackContext {
  attacker: EmpireCombatStats;
  defender: EmpireCombatStats;
  mode: BattleMode;
  weaponCategory: WeaponCategory;
  position: AttackPosition;
  baseWeaponDamage: number;
  range: number;
  formationBonus: number;
  pve: PvEStats;
}

export function getFleetAccuracy(context: AttackContext): number {
  const { attacker, mode, weaponCategory } = context;
  if (mode === 'pvp') {
    let base = attacker.pvp.fleetAccuracy;
    if (weaponCategory === 'missile') base = Math.min(base, attacker.fleet.accuracy.missileAccuracy);
    if (weaponCategory === 'energy') base = Math.min(base, attacker.fleet.accuracy.energyWeaponAccuracy);
    return base + attacker.fleet.accuracy.commanderTargetingBonus;
  }
  let base = attacker.pve.fleetAccuracy;
  if (weaponCategory === 'missile') base = Math.min(base, attacker.fleet.accuracy.missileAccuracy);
  if (weaponCategory === 'energy') base = Math.min(base, attacker.fleet.accuracy.energyWeaponAccuracy);
  return base + attacker.fleet.accuracy.commanderTargetingBonus;
}

export function getFleetEvasion(context: AttackContext): number {
  const { defender, mode } = context;
  if (mode === 'pvp') {
    return defender.pvp.fleetEvasion;
  }
  return context.pve.fleetEvasion;
}

export function getCriticalChance(context: AttackContext): number {
  const { attacker, mode, weaponCategory } = context;
  if (mode === 'pvp') {
    let base = attacker.pvp.fleetCriticalChance;
    if (weaponCategory === 'missile') base = Math.min(base, attacker.pvp.missileCriticalChance);
    if (weaponCategory === 'energy') base = Math.min(base, attacker.pvp.energyCriticalChance);
    return base;
  }
  let base = context.pve.fleetCriticalChance * 100;
  if (weaponCategory === 'missile') base = Math.min(base, attacker.fleet.critical.missileCriticalChance * 100);
  if (weaponCategory === 'energy') base = Math.min(base, attacker.fleet.critical.energyCriticalChance * 100);
  return base;
}

export function getHeavyStrikeChance(context: AttackContext): number {
  const { attacker, mode } = context;
  if (mode === 'pvp') {
    return attacker.pvp.heavyStrikeChance;
  }
  return context.pve.fleetHeavyStrikeChance * 100;
}

export function getHeavyStrikeEvasion(context: AttackContext): number {
  const { defender, mode } = context;
  if (mode === 'pvp') {
    return defender.pvp.heavyStrikeEvasion;
  }
  return context.pve.heavyStrikeEvasion * 100;
}

export function getPositionMultiplier(position: AttackPosition): number {
  switch (position) {
    case 'front': return 1.0;
    case 'flank': return 1.4;
    case 'rear': return 2.0;
  }
}

export function computeFinalDamage(context: AttackContext): DamageOutput {
  const { attacker, defender, baseWeaponDamage, position, formationBonus } = context;
  const fp = attacker.fleet.firepower;
  const def = defender.fleet.defense;
  const ev = defender.fleet.evasion;

  // Step 1: Raw base damage
  let rawDamage = baseWeaponDamage;

  // Step 2: Attack Power multiplier
  rawDamage *= (fp.attackPower / 100);

  // Step 3: Combat Efficiency
  rawDamage *= (fp.combatEfficiency / 100);

  // Step 4: Weapon Systems Bonus
  rawDamage *= (1 + fp.weaponSystemsBonus / 100);

  // Step 5: Species Combat Bonus
  rawDamage *= (1 + fp.speciesCombatBonus / 100);

  // Step 6: Position multiplier (flanking/rear)
  rawDamage *= getPositionMultiplier(position);

  // Step 7: Formation bonus
  rawDamage *= (1 + formationBonus / 100);

  // Step 8: Mode-specific damage bonus
  if (context.mode === 'pvp') {
    rawDamage *= (1 + attacker.pvp.pvpDamageBonus / 100);
  }

  // Step 9: Empire bonus
  rawDamage *= (1 + attacker.bonuses.fleetDamageBonus / 100);
  rawDamage *= (1 + attacker.bonuses.weaponTechnologyBonus / 100);
  rawDamage *= (1 + attacker.bonuses.humanoidEmpireDamageBonus / 100);

  // Step 10: Accuracy vs Evasion check
  const accuracy = getFleetAccuracy(context);
  const evasion = getFleetEvasion(context);
  const hitChance = accuracy / Math.max(1, accuracy + evasion);
  if (Math.random() > hitChance) {
    // Miss
    return {
      rawDamage,
      effectiveDamage: 0,
      shieldDamage: 0,
      hullDamage: 0,
      isCritical: false,
      isHeavyStrike: false,
      damageAfterResistance: 0,
      finalDamage: 0,
    };
  }

  let effectiveDamage = rawDamage;

  // Step 11: Critical hit check
  const critChanceRaw = getCriticalChance(context);
  const critChance = critChanceRaw / (critChanceRaw + 100) * 100;
  const isCritical = Math.random() * 100 < critChance;

  // Step 12: Heavy strike check
  const hsChanceRaw = getHeavyStrikeChance(context);
  const hsEvasionRaw = getHeavyStrikeEvasion(context);
  const hsChance = Math.max(0, hsChanceRaw - hsEvasionRaw) / (Math.max(1, hsChanceRaw - hsEvasionRaw) + 100) * 100;
  const isHeavyStrike = Math.random() * 100 < hsChance;

  if (isCritical) {
    const critMultiplier = 1 + (attacker.fleet.critical.criticalDamageBonus / 100);
    effectiveDamage *= critMultiplier;
  }

  if (isHeavyStrike) {
    const heavyMultiplier = 1 + (attacker.fleet.critical.heavyStrikeDamage / 100);
    effectiveDamage *= heavyMultiplier;
    // Heavy strikes bypass 50% of shield
    const bypassedShield = def.shieldRating * 0.5;
    effectiveDamage += bypassedShield * 0.3;
  }

  // Step 13: Shield absorption
  const totalShield = def.shieldRating + def.energyShield;
  const shieldAbsorbFraction = Math.min(0.9, totalShield / (totalShield + effectiveDamage));
  const shieldDamage = effectiveDamage * shieldAbsorbFraction;
  let hullDamage = effectiveDamage - shieldDamage;

  // Step 14: Hull damage reduction (flat)
  hullDamage = Math.max(0, hullDamage - def.hullDamageReduction);

  // Step 15: Armor mitigation
  const armorMitigation = def.fleetArmor / (def.fleetArmor + 500);
  hullDamage *= (1 - armorMitigation);

  // Step 16: Fleet Damage Resistance (%)
  hullDamage *= (1 - def.fleetDamageResistance / 100);

  // Step 17: Critical damage resistance (only if crit)
  if (isCritical) {
    hullDamage *= (1 - def.criticalDamageResistance / 100);
  }

  // Step 18: Heavy strike resistance (only if heavy strike)
  if (isHeavyStrike) {
    hullDamage *= (1 - def.heavyStrikeResistance / 100);
  }

  // Step 19: Mode-specific reductions
  if (context.mode === 'pve' && 'alienDamageReduction' in context.pve) {
    hullDamage = Math.max(0, hullDamage - context.pve.alienDamageReduction);
  }

  const finalDamage = Math.max(0, Math.floor(hullDamage + shieldDamage * 0.1));

  return {
    rawDamage,
    effectiveDamage,
    shieldDamage: Math.floor(shieldDamage),
    hullDamage: Math.floor(hullDamage),
    isCritical,
    isHeavyStrike,
    damageAfterResistance: Math.floor(hullDamage),
    finalDamage,
  };
}

export interface EWAResult {
  success: boolean;
  duration: number;
  magnitude: number;
}

export type EWARType =
  | 'emp'
  | 'fear_broadcast'
  | 'tractor_beam'
  | 'ion_lock'
  | 'sleep_virus'
  | 'collision_attack'
  | 'signal_jam'
  | 'system_corruption';

export const EWAR_BASE_DURATIONS: Record<EWARType, number> = {
  emp: 8,
  fear_broadcast: 12,
  tractor_beam: 6,
  ion_lock: 4,
  sleep_virus: 10,
  collision_attack: 1,
  signal_jam: 8,
  system_corruption: 15,
};

export const EWAR_RESISTANCE_MAP: Record<EWARType, keyof ResistanceSystems> = {
  emp: 'empResistance',
  fear_broadcast: 'panicResistance',
  tractor_beam: 'tractorBeamResistance',
  ion_lock: 'jammingResistance',
  sleep_virus: 'hackResistance',
  collision_attack: 'collisionResistance',
  signal_jam: 'communicationsResistance',
  system_corruption: 'sensorBlindResistance',
};

export const EWAR_CHANCE_MAP: Record<EWARType, keyof ElectronicWarfareStats> = {
  emp: 'empChance',
  fear_broadcast: 'fearBroadcastChance',
  tractor_beam: 'tractorBeamChance',
  ion_lock: 'ionLockChance',
  sleep_virus: 'sleepVirusChance',
  collision_attack: 'collisionAttackChance',
  signal_jam: 'signalJamChance',
  system_corruption: 'systemCorruptionChance',
};

const EWAR_MAGNITUDE_BASE: Record<EWARType, number> = {
  emp: 40,
  fear_broadcast: 25,
  tractor_beam: 60,
  ion_lock: 50,
  sleep_virus: 35,
  collision_attack: 80,
  signal_jam: 30,
  system_corruption: 45,
};

export function computeEWAR(
  ewarType: EWARType,
  attacker: EmpireCombatStats,
  defender: EmpireCombatStats,
  techBuffDuration: number
): EWAResult {
  const chanceStat = EWAR_CHANCE_MAP[ewarType];
  const resistStat = EWAR_RESISTANCE_MAP[ewarType];

  const attackPower = attacker.electronicWarfare[chanceStat];
  const defensePower = defender.resistance[resistStat];

  // Success chance formula
  if (defensePower >= attackPower * 2) {
    return { success: false, duration: 0, magnitude: 0 };
  }
  const ratio = attackPower / Math.max(1, defensePower);
  const successChance = Math.min(95, (ratio / (ratio + 1)) * 100);

  const success = Math.random() * 100 < successChance;
  if (!success) {
    return { success: false, duration: 0, magnitude: 0 };
  }

  // Duration calculation
  const baseDuration = EWAR_BASE_DURATIONS[ewarType];
  const buffDurationBonus = 1 + techBuffDuration / 100;
  const durationReduction = defender.technology.enemyDebuffDuration;
  const duration = Math.max(1, Math.floor(baseDuration * buffDurationBonus * (1 + durationReduction / 100)));

  // Magnitude calculation
  const baseMagnitude = EWAR_MAGNITUDE_BASE[ewarType];
  const resistanceMitigation = defensePower / (defensePower + 100);
  const magnitude = Math.max(1, Math.floor(baseMagnitude * (1 - resistanceMitigation)));

  return { success: true, duration, magnitude };
}

export interface CombatRoundResult {
  round: number;
  attackerDamage: DamageOutput;
  defenderDamage: DamageOutput;
  attackerEWAR: EWAResult[];
  defenderEWAR: EWAResult[];
  attackerRemainingHP: number;
  defenderRemainingHP: number;
}

export interface CombatResult {
  winner: 'attacker' | 'defender' | 'draw';
  totalRounds: number;
  rounds: CombatRoundResult[];
  attackerStartingHP: number;
  defenderStartingHP: number;
}

export function computeTotalEffectiveHP(stats: EmpireCombatStats): number {
  const def = stats.fleet.defense;
  const ev = stats.fleet.evasion;

  const shieldHP = def.shieldRating + def.energyShield;
  const armorHP = def.fleetArmor;
  const baseHP = shieldHP + armorHP;

  // Evasion provides effective HP multiplier
  const evasionMultiplier = 1 / Math.max(0.05, 1 - ev.fleetEvasion / 100);

  // Damage resistance provides effective HP multiplier
  const resistanceMultiplier = 1 / Math.max(0.05, 1 - def.fleetDamageResistance / 100);

  return Math.floor(baseHP * evasionMultiplier * resistanceMultiplier);
}

export function simulateCombatRound(
  attacker: EmpireCombatStats,
  defender: EmpireCombatStats,
  mode: BattleMode,
  round: number,
  baseAtkDamage: number,
  baseDefDamage: number
): CombatRoundResult {
  const pveStats = mode === 'pve' ? attacker.pve : attacker.pve;

  const atkCtx: AttackContext = {
    attacker,
    defender,
    mode,
    weaponCategory: 'energy',
    position: 'front',
    baseWeaponDamage: baseAtkDamage,
    range: attacker.fleet.firepower.engagementRange,
    formationBonus: 0,
    pve: pveStats,
  };

  const defCtx: AttackContext = {
    attacker: defender,
    defender: attacker,
    mode,
    weaponCategory: 'energy',
    position: 'front',
    baseWeaponDamage: baseDefDamage,
    range: defender.fleet.firepower.engagementRange,
    formationBonus: 0,
    pve: mode === 'pve' ? defender.pve : defender.pve,
  };

  const atkDamage = computeFinalDamage(atkCtx);
  const defDamage = computeFinalDamage(defCtx);

  const attackerHP = computeTotalEffectiveHP(attacker);
  const defenderHP = computeTotalEffectiveHP(defender);

  const ewarTypes: EWARType[] = ['emp', 'tractor_beam', 'signal_jam', 'system_corruption'];

  const attackerEWAR = ewarTypes.map(t =>
    computeEWAR(t, attacker, defender, attacker.technology.buffDuration)
  );
  const defenderEWAR = ewarTypes.map(t =>
    computeEWAR(t, defender, attacker, defender.technology.buffDuration)
  );

  return {
    round,
    attackerDamage: atkDamage,
    defenderDamage: defDamage,
    attackerEWAR,
    defenderEWAR,
    attackerRemainingHP: Math.max(0, attackerHP - defDamage.finalDamage),
    defenderRemainingHP: Math.max(0, defenderHP - atkDamage.finalDamage),
  };
}

export function simulateFullCombat(
  attacker: EmpireCombatStats,
  defender: EmpireCombatStats,
  mode: BattleMode,
  baseAtkDamage: number,
  baseDefDamage: number,
  maxRounds: number = 8
): CombatResult {
  const attackerHP = computeTotalEffectiveHP(attacker);
  const defenderHP = computeTotalEffectiveHP(defender);

  let atkCurrentHP = attackerHP;
  let defCurrentHP = defenderHP;

  const rounds: CombatRoundResult[] = [];

  for (let round = 1; round <= maxRounds; round++) {
    // Speed factor: lower attack speed means more actions per round
    const atkActions = Math.max(1, Math.floor(1 / attacker.fleet.firepower.attackSpeed));
    const defActions = Math.max(1, Math.floor(1 / defender.fleet.firepower.attackSpeed));

    let atkRoundDamage = 0;
    let defRoundDamage = 0;

    for (let a = 0; a < atkActions; a++) {
      const result = simulateCombatRound(attacker, defender, mode, round, baseAtkDamage, 0);
      atkRoundDamage += result.attackerDamage.finalDamage;
    }
    for (let d = 0; d < defActions; d++) {
      const result = simulateCombatRound(attacker, defender, mode, round, 0, baseDefDamage);
      defRoundDamage += result.defenderDamage.finalDamage;
    }

    defCurrentHP -= atkRoundDamage;
    atkCurrentHP -= defRoundDamage;

    const roundResult: CombatRoundResult = {
      round,
      attackerDamage: {
        rawDamage: 0,
        effectiveDamage: 0,
        shieldDamage: 0,
        hullDamage: 0,
        isCritical: false,
        isHeavyStrike: false,
        damageAfterResistance: atkRoundDamage,
        finalDamage: atkRoundDamage,
      },
      defenderDamage: {
        rawDamage: 0,
        effectiveDamage: 0,
        shieldDamage: 0,
        hullDamage: 0,
        isCritical: false,
        isHeavyStrike: false,
        damageAfterResistance: defRoundDamage,
        finalDamage: defRoundDamage,
      },
      attackerEWAR: [],
      defenderEWAR: [],
      attackerRemainingHP: Math.max(0, atkCurrentHP),
      defenderRemainingHP: Math.max(0, defCurrentHP),
    };

    rounds.push(roundResult);

    if (defCurrentHP <= 0 && atkCurrentHP <= 0) {
      return { winner: 'draw', totalRounds: round, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
    }
    if (defCurrentHP <= 0) {
      return { winner: 'attacker', totalRounds: round, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
    }
    if (atkCurrentHP <= 0) {
      return { winner: 'defender', totalRounds: round, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
    }
  }

  // Draw by timeout - whoever has more HP wins
  if (atkCurrentHP > defCurrentHP) {
    return { winner: 'attacker', totalRounds: maxRounds, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
  }
  if (defCurrentHP > atkCurrentHP) {
    return { winner: 'defender', totalRounds: maxRounds, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
  }
  return { winner: 'draw', totalRounds: maxRounds, rounds, attackerStartingHP: attackerHP, defenderStartingHP: defenderHP };
}
