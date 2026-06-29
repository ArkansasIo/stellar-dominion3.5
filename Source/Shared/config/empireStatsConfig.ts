export type WeaponDamageType = 'missile' | 'energy' | 'kinetic' | 'explosive' | 'ionic' | 'graviton';

export type BattleRole = 'offense' | 'defense' | 'support' | 'hybrid';

export interface FleetFirepower {
  attackPower: number;
  weaponSystemsBonus: number;
  attackSpeed: number;
  combatEfficiency: number;
  engagementRange: number;
  sensorRangeBonus: number;
  speciesCombatBonus: number;
}

export interface FleetAccuracy {
  fleetAccuracy: number;
  missileAccuracy: number;
  energyWeaponAccuracy: number;
  commanderTargetingBonus: number;
}

export interface CriticalStrikeSystems {
  fleetCriticalChance: number;
  missileCriticalChance: number;
  energyCriticalChance: number;
  fleetHeavyStrike: number;
  missileHeavyStrike: number;
  energyHeavyStrike: number;
  criticalDamageBonus: number;
  heavyStrikeDamage: number;
}

export interface FleetDefense {
  fleetArmor: number;
  shieldRating: number;
  energyShield: number;
  hullDamageReduction: number;
  criticalDamageResistance: number;
  heavyStrikeResistance: number;
  fleetDamageResistance: number;
}

export interface EvasionSystems {
  fleetEvasion: number;
  missileEvasion: number;
  energyWeaponEvasion: number;
  heavyStrikeEvasion: number;
  rearAssaultAvoidance: number;
}

export interface FleetCombatStats {
  firepower: FleetFirepower;
  accuracy: FleetAccuracy;
  critical: CriticalStrikeSystems;
  defense: FleetDefense;
  evasion: EvasionSystems;
}

export interface CommanderStatistics {
  militaryCommand: number;
  engineering: number;
  scientificResearch: number;
  sensorOperations: number;
  empireLogistics: number;
}

export interface EmpireResources {
  maxPopulation: number;
  populationGrowth: number;
  maxEnergy: number;
  energyRegeneration: number;
  energyEfficiency: number;
}

export interface FleetMobility {
  warpSpeedBonus: number;
  maxWarpCapacity: number;
  warpRechargeRate: number;
}

export interface EmpireAttributes {
  commander: CommanderStatistics;
  resources: EmpireResources;
  mobility: FleetMobility;
}

export interface TechnologyStats {
  researchEfficiency: number;
  technologyCooldownReduction: number;
  infrastructureEfficiency: number;
  buffDuration: number;
  enemyDebuffDuration: number;
  repairEfficiency: number;
  colonyHealingBonus: number;
}

export interface ResistanceSystems {
  empResistance: number;
  jammingResistance: number;
  sensorBlindResistance: number;
  hackResistance: number;
  communicationsResistance: number;
  panicResistance: number;
  tractorBeamResistance: number;
  collisionResistance: number;
}

export interface ElectronicWarfareStats {
  empChance: number;
  fearBroadcastChance: number;
  tractorBeamChance: number;
  ionLockChance: number;
  sleepVirusChance: number;
  collisionAttackChance: number;
  signalJamChance: number;
  systemCorruptionChance: number;
}

export interface FleetDisruptionChance {
  empChance: number;
  fearBroadcastChance: number;
  tractorBeamChance: number;
  ionLockChance: number;
  sleepVirusChance: number;
  collisionAttackChance: number;
  signalJamChance: number;
  systemCorruptionChance: number;
}

export interface PvPWarfareStats {
  fleetCriticalChance: number;
  missileCriticalChance: number;
  energyCriticalChance: number;
  fleetAccuracy: number;
  fleetEvasion: number;
  heavyStrikeChance: number;
  heavyStrikeEvasion: number;
  pvpDamageBonus: number;
}

export interface PvEStats {
  alienDamageReduction: number;
  fleetAccuracy: number;
  fleetCriticalChance: number;
  fleetHeavyStrikeChance: number;
  fleetEvasion: number;
  heavyStrikeEvasion: number;
}

export interface TacticalCombatStats {
  flankingAccuracy: number;
  flankingEvasion: number;
  rearAssaultHeavyStrike: number;
}

export interface EmpireBonuses {
  speciesCombatBonus: number;
  humanoidEmpireDamageBonus: number;
  weaponTechnologyBonus: number;
  fleetDamageBonus: number;
}

export interface EmpireCombatStats {
  fleet: FleetCombatStats;
  empire: EmpireAttributes;
  technology: TechnologyStats;
  resistance: ResistanceSystems;
  electronicWarfare: ElectronicWarfareStats;
  pvp: PvPWarfareStats;
  pve: PvEStats;
  tactical: TacticalCombatStats;
  bonuses: EmpireBonuses;
}

export type EmpireStatCategory =
  | 'fleet'
  | 'empire'
  | 'technology'
  | 'resistance'
  | 'electronicWarfare'
  | 'pvp'
  | 'pve'
  | 'tactical'
  | 'bonuses';

export const DEFAULT_FLEET_FIREPOWER: FleetFirepower = {
  attackPower: 0,
  weaponSystemsBonus: 0,
  attackSpeed: 1.0,
  combatEfficiency: 100,
  engagementRange: 1.0,
  sensorRangeBonus: 0,
  speciesCombatBonus: 0,
};

export const DEFAULT_FLEET_ACCURACY: FleetAccuracy = {
  fleetAccuracy: 100,
  missileAccuracy: 100,
  energyWeaponAccuracy: 100,
  commanderTargetingBonus: 0,
};

export const DEFAULT_CRITICAL_STRIKE: CriticalStrikeSystems = {
  fleetCriticalChance: 0,
  missileCriticalChance: 0,
  energyCriticalChance: 0,
  fleetHeavyStrike: 0,
  missileHeavyStrike: 0,
  energyHeavyStrike: 0,
  criticalDamageBonus: 0,
  heavyStrikeDamage: 0,
};

export const DEFAULT_FLEET_DEFENSE: FleetDefense = {
  fleetArmor: 0,
  shieldRating: 0,
  energyShield: 0,
  hullDamageReduction: 0,
  criticalDamageResistance: 0,
  heavyStrikeResistance: 0,
  fleetDamageResistance: 0,
};

export const DEFAULT_EVASION: EvasionSystems = {
  fleetEvasion: 0,
  missileEvasion: 0,
  energyWeaponEvasion: 0,
  heavyStrikeEvasion: 0,
  rearAssaultAvoidance: 0,
};

export const DEFAULT_FLEET_COMBAT: FleetCombatStats = {
  firepower: { ...DEFAULT_FLEET_FIREPOWER },
  accuracy: { ...DEFAULT_FLEET_ACCURACY },
  critical: { ...DEFAULT_CRITICAL_STRIKE },
  defense: { ...DEFAULT_FLEET_DEFENSE },
  evasion: { ...DEFAULT_EVASION },
};

export const DEFAULT_COMMANDER_STATS: CommanderStatistics = {
  militaryCommand: 0,
  engineering: 0,
  scientificResearch: 0,
  sensorOperations: 0,
  empireLogistics: 0,
};

export const DEFAULT_EMPIRE_RESOURCES: EmpireResources = {
  maxPopulation: 0,
  populationGrowth: 0,
  maxEnergy: 0,
  energyRegeneration: 0,
  energyEfficiency: 0,
};

export const DEFAULT_FLEET_MOBILITY: FleetMobility = {
  warpSpeedBonus: 0,
  maxWarpCapacity: 0,
  warpRechargeRate: 0,
};

export const DEFAULT_EMPIRE_ATTRIBUTES: EmpireAttributes = {
  commander: { ...DEFAULT_COMMANDER_STATS },
  resources: { ...DEFAULT_EMPIRE_RESOURCES },
  mobility: { ...DEFAULT_FLEET_MOBILITY },
};

export const DEFAULT_TECHNOLOGY: TechnologyStats = {
  researchEfficiency: 0,
  technologyCooldownReduction: 0,
  infrastructureEfficiency: 0,
  buffDuration: 0,
  enemyDebuffDuration: 0,
  repairEfficiency: 0,
  colonyHealingBonus: 0,
};

export const DEFAULT_RESISTANCE: ResistanceSystems = {
  empResistance: 0,
  jammingResistance: 0,
  sensorBlindResistance: 0,
  hackResistance: 0,
  communicationsResistance: 0,
  panicResistance: 0,
  tractorBeamResistance: 0,
  collisionResistance: 0,
};

export const DEFAULT_ELECTRONIC_WARFARE: ElectronicWarfareStats = {
  empChance: 0,
  fearBroadcastChance: 0,
  tractorBeamChance: 0,
  ionLockChance: 0,
  sleepVirusChance: 0,
  collisionAttackChance: 0,
  signalJamChance: 0,
  systemCorruptionChance: 0,
};

export const DEFAULT_PVP_STATS: PvPWarfareStats = {
  fleetCriticalChance: 0,
  missileCriticalChance: 0,
  energyCriticalChance: 0,
  fleetAccuracy: 100,
  fleetEvasion: 0,
  heavyStrikeChance: 0,
  heavyStrikeEvasion: 0,
  pvpDamageBonus: 0,
};

export const DEFAULT_PVE_STATS: PvEStats = {
  alienDamageReduction: 0,
  fleetAccuracy: 100,
  fleetCriticalChance: 0,
  fleetHeavyStrikeChance: 0,
  fleetEvasion: 0,
  heavyStrikeEvasion: 0,
};

export const DEFAULT_TACTICAL_COMBAT: TacticalCombatStats = {
  flankingAccuracy: 0,
  flankingEvasion: 0,
  rearAssaultHeavyStrike: 0,
};

export const DEFAULT_EMPIRE_BONUSES: EmpireBonuses = {
  speciesCombatBonus: 0,
  humanoidEmpireDamageBonus: 0,
  weaponTechnologyBonus: 0,
  fleetDamageBonus: 0,
};

export const DEFAULT_EMPIRE_COMBAT_STATS: EmpireCombatStats = {
  fleet: { ...DEFAULT_FLEET_COMBAT },
  empire: { ...DEFAULT_EMPIRE_ATTRIBUTES },
  technology: { ...DEFAULT_TECHNOLOGY },
  resistance: { ...DEFAULT_RESISTANCE },
  electronicWarfare: { ...DEFAULT_ELECTRONIC_WARFARE },
  pvp: { ...DEFAULT_PVP_STATS },
  pve: { ...DEFAULT_PVE_STATS },
  tactical: { ...DEFAULT_TACTICAL_COMBAT },
  bonuses: { ...DEFAULT_EMPIRE_BONUSES },
};

export enum EmpireStatId {
  // Fleet Firepower
  AttackPower = 'attackPower',
  WeaponSystemsBonus = 'weaponSystemsBonus',
  AttackSpeed = 'attackSpeed',
  CombatEfficiency = 'combatEfficiency',
  EngagementRange = 'engagementRange',
  SensorRangeBonus = 'sensorRangeBonus',
  SpeciesCombatBonus = 'speciesCombatBonus',

  // Fleet Accuracy
  FleetAccuracy = 'fleetAccuracy',
  MissileAccuracy = 'missileAccuracy',
  EnergyWeaponAccuracy = 'energyWeaponAccuracy',
  CommanderTargetingBonus = 'commanderTargetingBonus',

  // Critical Strike
  FleetCriticalChance = 'fleetCriticalChance',
  MissileCriticalChance = 'missileCriticalChance',
  EnergyCriticalChance = 'energyCriticalChance',
  FleetHeavyStrike = 'fleetHeavyStrike',
  MissileHeavyStrike = 'missileHeavyStrike',
  EnergyHeavyStrike = 'energyHeavyStrike',
  CriticalDamageBonus = 'criticalDamageBonus',
  HeavyStrikeDamage = 'heavyStrikeDamage',

  // Fleet Defense
  FleetArmor = 'fleetArmor',
  ShieldRating = 'shieldRating',
  EnergyShield = 'energyShield',
  HullDamageReduction = 'hullDamageReduction',
  CriticalDamageResistance = 'criticalDamageResistance',
  HeavyStrikeResistance = 'heavyStrikeResistance',
  FleetDamageResistance = 'fleetDamageResistance',

  // Evasion
  FleetEvasion = 'fleetEvasion',
  MissileEvasion = 'missileEvasion',
  EnergyWeaponEvasion = 'energyWeaponEvasion',
  HeavyStrikeEvasion = 'heavyStrikeEvasion',
  RearAssaultAvoidance = 'rearAssaultAvoidance',

  // Commander
  MilitaryCommand = 'militaryCommand',
  Engineering = 'engineering',
  ScientificResearch = 'scientificResearch',
  SensorOperations = 'sensorOperations',
  EmpireLogistics = 'empireLogistics',

  // Empire Resources
  MaxPopulation = 'maxPopulation',
  PopulationGrowth = 'populationGrowth',
  MaxEnergy = 'maxEnergy',
  EnergyRegeneration = 'energyRegeneration',
  EnergyEfficiency = 'energyEfficiency',

  // Fleet Mobility
  WarpSpeedBonus = 'warpSpeedBonus',
  MaxWarpCapacity = 'maxWarpCapacity',
  WarpRechargeRate = 'warpRechargeRate',

  // Technology
  ResearchEfficiency = 'researchEfficiency',
  TechnologyCooldownReduction = 'technologyCooldownReduction',
  InfrastructureEfficiency = 'infrastructureEfficiency',
  BuffDuration = 'buffDuration',
  EnemyDebuffDuration = 'enemyDebuffDuration',
  RepairEfficiency = 'repairEfficiency',
  ColonyHealingBonus = 'colonyHealingBonus',

  // Resistance
  EmpResistance = 'empResistance',
  JammingResistance = 'jammingResistance',
  SensorBlindResistance = 'sensorBlindResistance',
  HackResistance = 'hackResistance',
  CommunicationsResistance = 'communicationsResistance',
  PanicResistance = 'panicResistance',
  TractorBeamResistance = 'tractorBeamResistance',
  CollisionResistance = 'collisionResistance',

  // Electronic Warfare
  EmpChance = 'empChance',
  FearBroadcastChance = 'fearBroadcastChance',
  TractorBeamChance = 'tractorBeamChance',
  IonLockChance = 'ionLockChance',
  SleepVirusChance = 'sleepVirusChance',
  CollisionAttackChance = 'collisionAttackChance',
  SignalJamChance = 'signalJamChance',
  SystemCorruptionChance = 'systemCorruptionChance',

  // PvP
  PvpFleetCriticalChance = 'pvpFleetCriticalChance',
  PvpMissileCriticalChance = 'pvpMissileCriticalChance',
  PvpEnergyCriticalChance = 'pvpEnergyCriticalChance',
  PvpFleetAccuracy = 'pvpFleetAccuracy',
  PvpFleetEvasion = 'pvpFleetEvasion',
  PvpHeavyStrikeChance = 'pvpHeavyStrikeChance',
  PvpHeavyStrikeEvasion = 'pvpHeavyStrikeEvasion',
  PvpDamageBonus = 'pvpDamageBonus',

  // PvE
  AlienDamageReduction = 'alienDamageReduction',
  PveFleetAccuracy = 'pveFleetAccuracy',
  PveFleetCriticalChance = 'pveFleetCriticalChance',
  PveFleetHeavyStrikeChance = 'pveFleetHeavyStrikeChance',
  PveFleetEvasion = 'pveFleetEvasion',
  PveHeavyStrikeEvasion = 'pveHeavyStrikeEvasion',

  // Tactical
  FlankingAccuracy = 'flankingAccuracy',
  FlankingEvasion = 'flankingEvasion',
  RearAssaultHeavyStrike = 'rearAssaultHeavyStrike',

  // Empire Bonuses
  EmpireSpeciesCombatBonus = 'empireSpeciesCombatBonus',
  HumanoidEmpireDamageBonus = 'humanoidEmpireDamageBonus',
  WeaponTechnologyBonus = 'weaponTechnologyBonus',
  FleetDamageBonus = 'fleetDamageBonus',
}

export const STAT_CATEGORY_LABELS: Record<EmpireStatCategory, string> = {
  fleet: 'Fleet Combat',
  empire: 'Empire Attributes',
  technology: 'Technology',
  resistance: 'Resistance Systems',
  electronicWarfare: 'Electronic Warfare',
  pvp: 'PvP Warfare',
  pve: 'PvE (NPC & Alien Empires)',
  tactical: 'Tactical Combat',
  bonuses: 'Empire Bonuses',
};

export const STAT_DISPLAY_NAMES: Record<string, string> = {
  attackPower: 'Attack Power',
  weaponSystemsBonus: 'Weapon Systems',
  attackSpeed: 'Fleet Attack Speed',
  combatEfficiency: 'Combat Efficiency',
  engagementRange: 'Fleet Engagement Range',
  sensorRangeBonus: 'Sensor Range Bonus',
  speciesCombatBonus: 'Species Combat Bonus',
  fleetAccuracy: 'Fleet Accuracy',
  missileAccuracy: 'Missile Accuracy',
  energyWeaponAccuracy: 'Energy Weapon Accuracy',
  commanderTargetingBonus: 'Commander Targeting Bonus',
  fleetCriticalChance: 'Fleet Critical Chance',
  missileCriticalChance: 'Missile Critical Chance',
  energyCriticalChance: 'Energy Critical Chance',
  fleetHeavyStrike: 'Fleet Heavy Strike',
  missileHeavyStrike: 'Missile Heavy Strike',
  energyHeavyStrike: 'Energy Heavy Strike',
  criticalDamageBonus: 'Critical Damage Bonus',
  heavyStrikeDamage: 'Heavy Strike Damage',
  fleetArmor: 'Fleet Armor',
  shieldRating: 'Shield Rating',
  energyShield: 'Energy Shield',
  hullDamageReduction: 'Hull Damage Reduction',
  criticalDamageResistance: 'Critical Damage Resistance',
  heavyStrikeResistance: 'Heavy Strike Resistance',
  fleetDamageResistance: 'Fleet Damage Resistance',
  fleetEvasion: 'Fleet Evasion',
  missileEvasion: 'Missile Evasion',
  energyWeaponEvasion: 'Energy Weapon Evasion',
  heavyStrikeEvasion: 'Heavy Strike Evasion',
  rearAssaultAvoidance: 'Rear Assault Avoidance',
  militaryCommand: 'Military Command',
  engineering: 'Engineering',
  scientificResearch: 'Scientific Research',
  sensorOperations: 'Sensor Operations',
  empireLogistics: 'Empire Logistics',
  maxPopulation: 'Maximum Population',
  populationGrowth: 'Population Growth',
  maxEnergy: 'Maximum Energy',
  energyRegeneration: 'Energy Regeneration',
  energyEfficiency: 'Energy Efficiency',
  warpSpeedBonus: 'Fleet Warp Speed Bonus',
  maxWarpCapacity: 'Maximum Warp Capacity',
  warpRechargeRate: 'Warp Recharge Rate',
  researchEfficiency: 'Research Efficiency',
  technologyCooldownReduction: 'Technology Cooldown Reduction',
  infrastructureEfficiency: 'Infrastructure Efficiency',
  buffDuration: 'Buff Duration',
  enemyDebuffDuration: 'Enemy Debuff Duration',
  repairEfficiency: 'Repair Efficiency',
  colonyHealingBonus: 'Colony Healing Bonus',
  empResistance: 'EMP Resistance',
  jammingResistance: 'Jamming Resistance',
  sensorBlindResistance: 'Sensor Blind Resistance',
  hackResistance: 'Hack Resistance',
  communicationsResistance: 'Communications Resistance',
  panicResistance: 'Panic Resistance',
  tractorBeamResistance: 'Tractor Beam Resistance',
  collisionResistance: 'Collision Resistance',
  empChance: 'EMP Chance',
  fearBroadcastChance: 'Fear Broadcast Chance',
  tractorBeamChance: 'Tractor Beam Chance',
  ionLockChance: 'Ion Lock Chance',
  sleepVirusChance: 'Sleep Virus Chance',
  collisionAttackChance: 'Collision Attack Chance',
  signalJamChance: 'Signal Jam Chance',
  systemCorruptionChance: 'System Corruption Chance',
  pvpFleetCriticalChance: 'Fleet Critical Chance (PvP)',
  pvpMissileCriticalChance: 'Missile Critical Chance (PvP)',
  pvpEnergyCriticalChance: 'Energy Critical Chance (PvP)',
  pvpFleetAccuracy: 'Fleet Accuracy (PvP)',
  pvpFleetEvasion: 'Fleet Evasion (PvP)',
  pvpHeavyStrikeChance: 'Heavy Strike Chance (PvP)',
  pvpHeavyStrikeEvasion: 'Heavy Strike Evasion (PvP)',
  pvpDamageBonus: 'PvP Damage Bonus',
  alienDamageReduction: 'Alien Damage Reduction',
  pveFleetAccuracy: 'Fleet Accuracy',
  pveFleetCriticalChance: 'Fleet Critical Chance',
  pveFleetHeavyStrikeChance: 'Fleet Heavy Strike Chance',
  pveFleetEvasion: 'Fleet Evasion',
  pveHeavyStrikeEvasion: 'Heavy Strike Evasion',
  flankingAccuracy: 'Flanking Accuracy',
  flankingEvasion: 'Flanking Evasion',
  rearAssaultHeavyStrike: 'Rear Assault Heavy Strike',
  empireSpeciesCombatBonus: 'Species Combat Bonus',
  humanoidEmpireDamageBonus: 'Humanoid Empire Damage Bonus',
  weaponTechnologyBonus: 'Weapon Technology Bonus',
  fleetDamageBonus: 'Fleet Damage Bonus',
};

export type StatPrefix = '%' | 'sec' | 'AU' | '';

export const STAT_FORMAT: Record<string, { suffix: string; decimals: number }> = {
  // Percentages
  weaponSystemsBonus: { suffix: '%', decimals: 0 },
  combatEfficiency: { suffix: '%', decimals: 0 },
  sensorRangeBonus: { suffix: '%', decimals: 1 },
  speciesCombatBonus: { suffix: '%', decimals: 0 },
  fleetCriticalChance: { suffix: '%', decimals: 1 },
  missileCriticalChance: { suffix: '%', decimals: 1 },
  energyCriticalChance: { suffix: '%', decimals: 1 },
  fleetHeavyStrike: { suffix: '%', decimals: 1 },
  missileHeavyStrike: { suffix: '%', decimals: 1 },
  energyHeavyStrike: { suffix: '%', decimals: 1 },
  criticalDamageBonus: { suffix: '%', decimals: 1 },
  heavyStrikeDamage: { suffix: '%', decimals: 1 },
  criticalDamageResistance: { suffix: '%', decimals: 1 },
  heavyStrikeResistance: { suffix: '%', decimals: 1 },
  fleetDamageResistance: { suffix: '%', decimals: 1 },
  fleetEvasion: { suffix: '%', decimals: 1 },
  missileEvasion: { suffix: '%', decimals: 1 },
  energyWeaponEvasion: { suffix: '%', decimals: 1 },
  heavyStrikeEvasion: { suffix: '%', decimals: 1 },
  rearAssaultAvoidance: { suffix: '%', decimals: 1 },
  populationGrowth: { suffix: '/hour', decimals: 0 },
  energyRegeneration: { suffix: '/hour', decimals: 0 },
  energyEfficiency: { suffix: '%', decimals: 1 },
  warpSpeedBonus: { suffix: '%', decimals: 1 },
  warpRechargeRate: { suffix: '/sec', decimals: 1 },
  researchEfficiency: { suffix: '%', decimals: 1 },
  technologyCooldownReduction: { suffix: '%', decimals: 1 },
  infrastructureEfficiency: { suffix: '%', decimals: 1 },
  buffDuration: { suffix: '%', decimals: 1 },
  enemyDebuffDuration: { suffix: '%', decimals: 0 },
  repairEfficiency: { suffix: '%', decimals: 0 },
  colonyHealingBonus: { suffix: '%', decimals: 1 },
  pvpDamageBonus: { suffix: '%', decimals: 1 },
  humanoidEmpireDamageBonus: { suffix: '%', decimals: 0 },
  weaponTechnologyBonus: { suffix: '%', decimals: 0 },
  fleetDamageBonus: { suffix: '%', decimals: 0 },
  // Time
  attackSpeed: { suffix: ' sec', decimals: 2 },
  // Distance
  engagementRange: { suffix: ' AU', decimals: 2 },
};

export function formatStatValue(key: string, value: number): string {
  const fmt = STAT_FORMAT[key];
  if (!fmt) {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);
  }
  return `${value.toFixed(fmt.decimals)}${fmt.suffix}`;
}

export function calculateEffectiveDamage(
  baseDamage: number,
  attackPower: number,
  combatEfficiency: number,
  weaponSystemsBonus: number,
  speciesCombatBonus: number
): number {
  const efficiencyModifier = combatEfficiency / 100;
  const weaponModifier = 1 + weaponSystemsBonus / 100;
  const speciesModifier = 1 + speciesCombatBonus / 100;
  return baseDamage * (attackPower / 100) * efficiencyModifier * weaponModifier * speciesModifier;
}

export function calculateAccuracy(
  baseAccuracy: number,
  commanderBonus: number,
  targetingModifier: number
): number {
  return Math.floor(baseAccuracy + commanderBonus * (1 + targetingModifier / 100));
}

export function calculateEvasionChance(
  baseEvasion: number,
  attackerAccuracy: number,
  speedFactor: number
): number {
  const effectiveAccuracy = Math.max(1, attackerAccuracy);
  const evasionRating = baseEvasion * speedFactor;
  return Math.min(90, (evasionRating / (evasionRating + effectiveAccuracy)) * 100);
}

export function calculateCriticalChance(
  baseChance: number,
  criticalDamageBonus: number,
  commanderModifier: number
): number {
  return Math.min(95, baseChance + criticalDamageBonus + commanderModifier);
}

export function calculateShieldAbsorption(
  incomingDamage: number,
  shieldRating: number,
  energyShield: number
): number {
  const totalShield = shieldRating + energyShield;
  if (totalShield <= 0) return incomingDamage;
  const absorption = Math.min(0.9, totalShield / (totalShield + incomingDamage));
  return incomingDamage * (1 - absorption);
}

export function calculateHullDamageReduction(
  incomingDamage: number,
  hullDamageReduction: number,
  fleetArmor: number
): number {
  const armorMitigation = fleetArmor / (fleetArmor + 500);
  return Math.max(0, incomingDamage - hullDamageReduction) * (1 - armorMitigation);
}

export function calculateEWARResistance(
  baseResistance: number,
  ewarSkillLevel: number,
  commanderBonus: number
): number {
  return baseResistance + ewarSkillLevel * 15 + commanderBonus * 2;
}

export function calculateEWARSuccessChance(
  attackerPower: number,
  defenderResistance: number
): number {
  if (defenderResistance >= attackerPower * 2) return 0;
  const ratio = attackerPower / Math.max(1, defenderResistance);
  return Math.min(95, (ratio / (ratio + 1)) * 100);
}

export function calculateDamageResistance(
  baseResistancePercent: number,
  armorValue: number
): number {
  const armorContribution = armorValue / (armorValue + 1000) * 100;
  return Math.min(90, baseResistancePercent + armorContribution);
}

export function calculateWarpSpeed(
  baseSpeed: number,
  warpSpeedBonus: number
): number {
  return baseSpeed * (1 + warpSpeedBonus / 100);
}

export function calculateResearchTime(
  baseTime: number,
  researchEfficiency: number,
  cooldownReduction: number
): number {
  const efficiencyMod = 1 - researchEfficiency / 100;
  const cooldownMod = 1 - cooldownReduction / 100;
  return Math.max(1, baseTime * efficiencyMod * cooldownMod);
}

export function calculatePopulationGrowth(
  baseGrowth: number,
  maxPopulation: number,
  currentPopulation: number
): number {
  const capacityRatio = 1 - currentPopulation / Math.max(1, maxPopulation);
  return Math.floor(baseGrowth * (0.5 + capacityRatio * 0.5));
}

export function calculateEnergyRegen(
  maxEnergy: number,
  energyEfficiency: number,
  regenerationBase: number
): number {
  const efficiencyBonus = 1 + energyEfficiency / 100;
  const capacityBonus = 1 + maxEnergy / 10000;
  return Math.floor(regenerationBase * efficiencyBonus * capacityBonus);
}

export function calculateInfrastructureOutput(
  baseOutput: number,
  infrastructureEfficiency: number
): number {
  return Math.floor(baseOutput * (1 + infrastructureEfficiency / 100));
}
