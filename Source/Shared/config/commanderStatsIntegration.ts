import {
  type EmpireCombatStats,
  type CommanderStatistics,
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
  DEFAULT_EMPIRE_COMBAT_STATS,
} from './empireStatsConfig';

export interface CommanderStatModifier {
  militaryCommand: number;
  engineering: number;
  scientificResearch: number;
  sensorOperations: number;
  empireLogistics: number;
}

export interface CommanderBuffProfile {
  // Direct stat boosts
  attackPowerBonus: number;
  defenseBonus: number;
  shieldBonus: number;
  evasionBonus: number;
  accuracyBonus: number;
  criticalChanceBonus: number;
  criticalDamageBonus: number;
  warpSpeedBonus: number;

  // Percentage modifiers
  damageModifier: number;
  resistanceModifier: number;
  researchSpeedModifier: number;
  buildSpeedModifier: number;
  energyEfficiencyModifier: number;
  populationGrowthModifier: number;

  // EWAR
  ewarStrength: number;
  ewarResistance: number;

  // Special
  flankingBonus: number;
  rearAssaultBonus: number;
  heavyStrikeBonus: number;
}

export function defaultCommanderBuffProfile(): CommanderBuffProfile {
  return {
    attackPowerBonus: 0,
    defenseBonus: 0,
    shieldBonus: 0,
    evasionBonus: 0,
    accuracyBonus: 0,
    criticalChanceBonus: 0,
    criticalDamageBonus: 0,
    warpSpeedBonus: 0,
    damageModifier: 0,
    resistanceModifier: 0,
    researchSpeedModifier: 0,
    buildSpeedModifier: 0,
    energyEfficiencyModifier: 0,
    populationGrowthModifier: 0,
    ewarStrength: 0,
    ewarResistance: 0,
    flankingBonus: 0,
    rearAssaultBonus: 0,
    heavyStrikeBonus: 0,
  };
}

export function commanderStatsToModifier(stats: CommanderStatistics): CommanderStatModifier {
  return {
    militaryCommand: stats.militaryCommand,
    engineering: stats.engineering,
    scientificResearch: stats.scientificResearch,
    sensorOperations: stats.sensorOperations,
    empireLogistics: stats.empireLogistics,
  };
}

export function applyCommanderBuffs(
  baseStats: EmpireCombatStats,
  buffs: CommanderBuffProfile,
  commanderStats: CommanderStatistics
): EmpireCombatStats {
  const result: EmpireCombatStats = structuredClone(baseStats);

  // Fleet Firepower
  result.fleet.firepower.attackPower += buffs.attackPowerBonus;
  result.fleet.firepower.attackPower += commanderStats.militaryCommand * 2;
  result.fleet.firepower.attackSpeed = Math.max(
    0.1,
    result.fleet.firepower.attackSpeed - commanderStats.militaryCommand * 0.002
  );
  result.fleet.firepower.combatEfficiency += buffs.damageModifier;
  result.fleet.firepower.weaponSystemsBonus += buffs.damageModifier * 0.5;
  result.fleet.firepower.speciesCombatBonus += commanderStats.militaryCommand * 0.5;

  // Fleet Accuracy
  result.fleet.accuracy.fleetAccuracy += buffs.accuracyBonus;
  result.fleet.accuracy.commanderTargetingBonus += commanderStats.sensorOperations * 3;
  result.fleet.accuracy.missileAccuracy += buffs.accuracyBonus * 0.8;
  result.fleet.accuracy.energyWeaponAccuracy += buffs.accuracyBonus * 0.8;

  // Critical Strike
  result.fleet.critical.fleetCriticalChance += buffs.criticalChanceBonus;
  result.fleet.critical.criticalDamageBonus += buffs.criticalDamageBonus;
  result.fleet.critical.fleetHeavyStrike += buffs.heavyStrikeBonus;
  result.fleet.critical.missileCriticalChance += buffs.criticalChanceBonus * 0.7;
  result.fleet.critical.energyCriticalChance += buffs.criticalChanceBonus * 0.7;

  // Fleet Defense
  result.fleet.defense.fleetArmor += buffs.defenseBonus;
  result.fleet.defense.shieldRating += buffs.shieldBonus;
  result.fleet.defense.energyShield += buffs.shieldBonus * 0.7;
  result.fleet.defense.hullDamageReduction += commanderStats.engineering * 0.3;
  result.fleet.defense.fleetDamageResistance += buffs.resistanceModifier;
  result.fleet.defense.criticalDamageResistance += buffs.resistanceModifier * 0.5;
  result.fleet.defense.heavyStrikeResistance += buffs.resistanceModifier * 0.5;

  // Evasion
  result.fleet.evasion.fleetEvasion += buffs.evasionBonus;
  result.fleet.evasion.missileEvasion += buffs.evasionBonus * 0.6;
  result.fleet.evasion.energyWeaponEvasion += buffs.evasionBonus * 0.6;
  result.fleet.evasion.heavyStrikeEvasion += buffs.evasionBonus * 0.3;
  result.fleet.evasion.rearAssaultAvoidance += buffs.flankingBonus * 0.4;

  // Commander Statistics
  result.empire.commander.militaryCommand += commanderStats.militaryCommand;
  result.empire.commander.engineering += commanderStats.engineering;
  result.empire.commander.scientificResearch += commanderStats.scientificResearch;
  result.empire.commander.sensorOperations += commanderStats.sensorOperations;
  result.empire.commander.empireLogistics += commanderStats.empireLogistics;

  // Empire Resources
  result.empire.resources.energyEfficiency += buffs.energyEfficiencyModifier;
  result.empire.resources.populationGrowth += Math.floor(
    result.empire.resources.populationGrowth * (buffs.populationGrowthModifier / 100)
  );
  result.empire.resources.maxEnergy += commanderStats.engineering * 50;

  // Fleet Mobility
  result.empire.mobility.warpSpeedBonus += buffs.warpSpeedBonus;
  result.empire.mobility.warpSpeedBonus += commanderStats.militaryCommand * 0.3;
  result.empire.mobility.warpRechargeRate += commanderStats.engineering * 0.01;

  // Technology
  result.technology.researchEfficiency += buffs.researchSpeedModifier;
  result.technology.researchEfficiency += commanderStats.scientificResearch * 0.4;
  result.technology.technologyCooldownReduction += commanderStats.scientificResearch * 0.3;
  result.technology.infrastructureEfficiency += commanderStats.engineering * 0.3;
  result.technology.repairEfficiency += commanderStats.engineering * 0.2;
  result.technology.colonyHealingBonus += commanderStats.engineering * 0.15;

  // Resistance
  result.resistance.empResistance += buffs.ewarResistance;
  result.resistance.jammingResistance += buffs.ewarResistance;
  result.resistance.sensorBlindResistance += buffs.ewarResistance;
  result.resistance.hackResistance += buffs.ewarResistance;
  result.resistance.communicationsResistance += buffs.ewarResistance;
  result.resistance.panicResistance += buffs.ewarResistance;
  result.resistance.tractorBeamResistance += buffs.ewarResistance * 1.2;
  result.resistance.collisionResistance += buffs.ewarResistance * 1.4;

  // Electronic Warfare
  result.electronicWarfare.empChance += buffs.ewarStrength;
  result.electronicWarfare.fearBroadcastChance += buffs.ewarStrength * 0.7;
  result.electronicWarfare.tractorBeamChance += buffs.ewarStrength * 0.8;
  result.electronicWarfare.ionLockChance += buffs.ewarStrength * 0.8;
  result.electronicWarfare.sleepVirusChance += buffs.ewarStrength * 0.8;
  result.electronicWarfare.collisionAttackChance += buffs.ewarStrength * 1.3;
  result.electronicWarfare.signalJamChance += buffs.ewarStrength * 0.8;
  result.electronicWarfare.systemCorruptionChance += buffs.ewarStrength * 0.8;

  // PvP
  result.pvp.pvpDamageBonus += buffs.damageModifier * 0.8;
  result.pvp.fleetAccuracy += buffs.accuracyBonus;
  result.pvp.fleetEvasion += buffs.evasionBonus;
  result.pvp.fleetCriticalChance += buffs.criticalChanceBonus;
  result.pvp.heavyStrikeChance += buffs.heavyStrikeBonus;
  result.pvp.heavyStrikeEvasion += buffs.evasionBonus * 0.3;

  // PvE
  result.pve.fleetAccuracy += buffs.accuracyBonus;
  result.pve.fleetEvasion += buffs.evasionBonus;
  result.pve.fleetCriticalChance += buffs.criticalChanceBonus;
  result.pve.fleetHeavyStrikeChance += buffs.heavyStrikeBonus;
  result.pve.heavyStrikeEvasion += buffs.evasionBonus * 0.3;

  // Tactical
  result.tactical.flankingAccuracy += buffs.flankingBonus;
  result.tactical.flankingEvasion += buffs.flankingBonus * 0.5;
  result.tactical.rearAssaultHeavyStrike += buffs.rearAssaultBonus;

  // Empire Bonuses
  result.bonuses.weaponTechnologyBonus += commanderStats.scientificResearch * 0.15;
  result.bonuses.fleetDamageBonus += commanderStats.militaryCommand * 0.03;

  return result;
}

export function buildCommanderBuffProfile(
  commanderLevel: number,
  skills: Record<string, number>
): CommanderBuffProfile {
  const buffs = defaultCommanderBuffProfile();

  // Base level contribution
  const levelFactor = commanderLevel * 0.5;
  buffs.attackPowerBonus += levelFactor * 2;
  buffs.defenseBonus += levelFactor * 1.5;
  buffs.shieldBonus += levelFactor * 1.2;

  // Skill-based contributions
  if (skills['tactical'] > 0) {
    buffs.accuracyBonus += skills['tactical'] * 8;
    buffs.criticalChanceBonus += skills['tactical'] * 0.5;
    buffs.heavyStrikeBonus += skills['tactical'] * 0.3;
  }
  if (skills['engineering'] > 0) {
    buffs.defenseBonus += skills['engineering'] * 10;
    buffs.shieldBonus += skills['engineering'] * 8;
    buffs.buildSpeedModifier += skills['engineering'] * 2;
    buffs.energyEfficiencyModifier += skills['engineering'] * 0.5;
  }
  if (skills['science'] > 0) {
    buffs.researchSpeedModifier += skills['science'] * 3;
    buffs.ewarResistance += skills['science'] * 5;
  }
  if (skills['navigation'] > 0) {
    buffs.evasionBonus += skills['navigation'] * 1.5;
    buffs.warpSpeedBonus += skills['navigation'] * 2;
  }
  if (skills['ewar'] > 0) {
    buffs.ewarStrength += skills['ewar'] * 12;
    buffs.ewarResistance += skills['ewar'] * 8;
  }
  if (skills['leadership'] > 0) {
    buffs.damageModifier += skills['leadership'] * 0.5;
    buffs.populationGrowthModifier += skills['leadership'] * 1;
  }
  if (skills['flanking'] > 0) {
    buffs.flankingBonus += skills['flanking'] * 10;
    buffs.rearAssaultBonus += skills['flanking'] * 5;
  }

  return buffs;
}

export function calculateEmpireStatsWithCommander(
  baseStats: EmpireCombatStats,
  commanderLevel: number,
  commanderStats: CommanderStatistics,
  commanderSkills: Record<string, number>
): EmpireCombatStats {
  const buffProfile = buildCommanderBuffProfile(commanderLevel, commanderSkills);
  return applyCommanderBuffs(baseStats, buffProfile, commanderStats);
}
