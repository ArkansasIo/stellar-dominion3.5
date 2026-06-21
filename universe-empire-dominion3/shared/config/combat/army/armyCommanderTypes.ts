/**
 * ARMY COMMANDER TYPES & DEFINITIONS
 * ============================================================================
 * Army-specific commander system with gacha, skill trees, mastery, and
 * synergy mechanics. Mirrors the Commander system but for ground forces.
 *
 * Army Commanders lead ground army formations, each specializing in
 * specific unit categories with unique passive abilities, active skills,
 * and synergy bonuses.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type ArmyCommanderRarity = 1 | 2 | 3 | 4 | 5;

export type ArmyCommanderRole =
  | 'infantry_leader'
  | 'armor_commander'
  | 'artillery_director'
  | 'air_support_lead'
  | 'special_ops_lead'
  | 'engineering_chief'
  | 'logistics_master'
  | 'recon_director'
  | 'siege_master'
  | 'defense_overseer'
  | 'offense_director'
  | 'psyops_lead'
  | 'cyber_warfare_lead'
  | 'naval_ground_lead'
  | 'combined_arms_lead'
  | 'fortification_master'
  | 'medical_corps_lead'
  | 'supply_chain_lead';

export type ArmyCommanderFaction =
  | 'terran_legion'
  | 'crimson_vanguard'
  | 'void_stalkers'
  | 'iron_bastion'
  | 'sky_hunters'
  | 'shadow_cloak'
  | 'storm_brigade'
  | 'death_cult'
  | 'iron_fist'
  | 'star_crusaders'
  | 'necro_forge'
  | 'crystal_orders'
  | 'phantom_legion'
  | 'obsidian_fleet'
  | 'thunder_guards'
  | 'mercenary_contractors';

export type ArmyCommanderSkillType =
  | 'passive' | 'active' | 'aura' | 'triggered' | 'ultimate';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ArmyCommanderStats {
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  speedBonus: number;
  accuracyBonus: number;
  evasionBonus: number;
  moraleBonus: number;
  initiativeBonus: number;
  commandRadius: number;
  unitCapacity: number;
}

export interface ArmyCommanderPassive {
  id: string;
  name: string;
  description: string;
  effect: Partial<ArmyCommanderStats>;
  icon: string;
  unlockLevel: number;
}

export interface ArmyCommanderActive {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  duration: number;
  manaCost: number;
  effect: Partial<ArmyCommanderStats>;
  aoeRadius: number;
  icon: string;
  unlockLevel: number;
}

export interface ArmyCommanderAura {
  id: string;
  name: string;
  description: string;
  radius: number;
  effect: Partial<ArmyCommanderStats>;
  icon: string;
  unlockLevel: number;
}

export interface ArmyCommanderSynergy {
  id: string;
  name: string;
  description: string;
  requiredUnits: string[];
  bonusStats: Partial<ArmyCommanderStats>;
  icon: string;
}

export interface ArmyCommanderSkillTree {
  id: string;
  name: string;
  branches: ArmyCommanderSkillBranch[];
}

export interface ArmyCommanderSkillBranch {
  id: string;
  name: string;
  nodes: ArmyCommanderSkillNode[];
}

export interface ArmyCommanderSkillNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  maxRank: number;
  cost: number;
  effects: Partial<ArmyCommanderStats>;
  prerequisiteIds: string[];
  type: 'normal' | 'notable' | 'keystone' | 'ultimate';
}

export interface ArmyCommanderMastery {
  tier: number;
  name: string;
  color: string;
  minLevel: number;
  maxLevel: number;
  xpMultiplier: number;
  bonusEffects: Partial<ArmyCommanderStats>;
  unlockAbility?: ArmyCommanderPassive;
}

export interface ArmyCommanderDefinition {
  id: string;
  name: string;
  title: string;
  rarity: ArmyCommanderRarity;
  role: ArmyCommanderRole;
  faction: ArmyCommanderFaction;
  description: string;
  lore: string;
  icon: string;
  portrait: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;

  baseStats: ArmyCommanderStats;
  growthRates: ArmyCommanderStats;
  maxLevel: number;
  maxStarLevel: number;
  xpPerLevel: number;

  passives: ArmyCommanderPassive[];
  actives: ArmyCommanderActive[];
  auras: ArmyCommanderAura[];
  synergies: ArmyCommanderSynergy[];
  skillTree: ArmyCommanderSkillTree;
  mastery: ArmyCommanderMastery[];

  preferredUnitCategories: string[];
  synergyBonusPercent: number;
  leadershipCapacity: number;

  shardConversionRate: number;
  duplicateShardReward: number;
}

// ============================================================================
// STAT META
// ============================================================================

export const ARMY_COMMANDER_STAT_META: Record<keyof ArmyCommanderStats, {
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  attackBonus:   { label: "Attack Bonus",    icon: "⚔️",  color: "text-red-600",    description: "Increases damage dealt by all commanded units" },
  defenseBonus:  { label: "Defense Bonus",   icon: "🛡️",  color: "text-blue-600",   description: "Reduces damage taken by commanded units" },
  hpBonus:       { label: "HP Bonus",        icon: "❤️",  color: "text-red-500",    description: "Increases hitpoints of all commanded units" },
  speedBonus:    { label: "Speed Bonus",     icon: "💨",  color: "text-cyan-600",   description: "Increases movement speed of commanded units" },
  accuracyBonus: { label: "Accuracy Bonus",  icon: "🎯",  color: "text-orange-600", description: "Increases hit chance of commanded units" },
  evasionBonus:  { label: "Evasion Bonus",   icon: "🌀",  color: "text-sky-600",    description: "Increases dodge chance of commanded units" },
  moraleBonus:   { label: "Morale Bonus",    icon: "⭐",  color: "text-yellow-500", description: "Boosts unit performance when morale is high" },
  initiativeBonus:{ label: "Initiative Bonus", icon: "⚡", color: "text-purple-600", description: "Determines turn order in combat" },
  commandRadius: { label: "Command Radius",  icon: "📡",  color: "text-blue-500",   description: "Extends the range of commander aura effects" },
  unitCapacity:  { label: "Unit Capacity",   icon: "👥",  color: "text-violet-600", description: "Increases max units under this commander" },
};

// ============================================================================
// RARITY CONFIGURATION
// ============================================================================

export const ARMY_COMMANDER_RARITY_CONFIG: Record<ArmyCommanderRarity, {
  stars: number;
  name: string;
  color: string;
  borderColor: string;
  baseProbability: number;
  pityThreshold: number;
  shardReward: number;
  maxStarLevel: number;
  statMultiplier: number;
}> = {
  1: { stars: 1, name: "Common",    color: "#94a3b8", borderColor: "border-slate-400",   baseProbability: 0.40, pityThreshold: 10,  shardReward: 5,  maxStarLevel: 5,  statMultiplier: 1.0 },
  2: { stars: 2, name: "Uncommon",  color: "#22c55e", borderColor: "border-green-500",   baseProbability: 0.30, pityThreshold: 20,  shardReward: 10, maxStarLevel: 10, statMultiplier: 1.2 },
  3: { stars: 3, name: "Rare",      color: "#3b82f6", borderColor: "border-blue-500",    baseProbability: 0.18, pityThreshold: 40,  shardReward: 20, maxStarLevel: 15, statMultiplier: 1.5 },
  4: { stars: 4, name: "Epic",      color: "#a855f7", borderColor: "border-purple-500",  baseProbability: 0.10, pityThreshold: 70,  shardReward: 30, maxStarLevel: 20, statMultiplier: 2.0 },
  5: { stars: 5, name: "Legendary", color: "#f59e0b", borderColor: "border-yellow-500",  baseProbability: 0.02, pityThreshold: 100, shardReward: 50, maxStarLevel: 30, statMultiplier: 3.0 },
};

// ============================================================================
// FACTION CONFIGURATION
// ============================================================================

export const ARMY_FACTION_CONFIG: Record<ArmyCommanderFaction, {
  name: string;
  description: string;
  color: string;
  icon: string;
  bonusStat: keyof ArmyCommanderStats;
  bonusValue: number;
}> = {
  terran_legion:     { name: "Terran Legion",     description: "Professional standing army of the Terran Federation",       color: "#3b82f6", icon: "🛡️", bonusStat: "defenseBonus",    bonusValue: 15 },
  crimson_vanguard:  { name: "Crimson Vanguard",   description: "Elite shock troops specializing in breakthrough assaults", color: "#ef4444", icon: "⚔️", bonusStat: "attackBonus",     bonusValue: 20 },
  void_stalkers:     { name: "Void Stalkers",      description: "Stealth and recon specialists operating behind enemy lines", color: "#6366f1", icon: "👁️", bonusStat: "evasionBonus",    bonusValue: 18 },
  iron_bastion:      { name: "Iron Bastion",       description: "Unbreakable defensive fortress troops",                  color: "#78716c", icon: "🏰", bonusStat: "defenseBonus",    bonusValue: 25 },
  sky_hunters:       { name: "Sky Hunters",        description: "Airborne rapid-response strike forces",                  color: "#06b6d4", icon: "✈️", bonusStat: "speedBonus",      bonusValue: 20 },
  shadow_cloak:      { name: "Shadow Cloak",       description: "Espionage and sabotage specialists",                     color: "#1e293b", icon: "🕵️", bonusStat: "accuracyBonus",   bonusValue: 22 },
  storm_brigade:     { name: "Storm Brigade",      description: "Heavy assault formation with overwhelming firepower",     color: "#f97316", icon: "🌪️", bonusStat: "attackBonus",     bonusValue: 18 },
  death_cult:        { name: "Death Cult",         description: "Fanatical warriors who fight to the last",               color: "#dc2626", icon: "💀", bonusStat: "moraleBonus",     bonusValue: 30 },
  iron_fist:         { name: "Iron Fist",          description: "Armored warfare specialists",                           color: "#b91c1c", icon: "👊", bonusStat: "attackBonus",     bonusValue: 15 },
  star_crusaders:    { name: "Star Crusaders",     description: "Holy warriors of the interstellar church",               color: "#eab308", icon: "⭐", bonusStat: "moraleBonus",     bonusValue: 25 },
  necro_forge:       { name: "Necro Forge",        description: "Dark tech warriors using forbidden technology",         color: "#7c3aed", icon: "🔮", bonusStat: "hpBonus",         bonusValue: 20 },
  crystal_orders:    { name: "Crystal Orders",     description: "Psionic warriors channeling crystal energy",            color: "#06b6d4", icon: "💎", bonusStat: "initiativeBonus", bonusValue: 22 },
  phantom_legion:    { name: "Phantom Legion",     description: "Phase-shifting interdimensional troops",                 color: "#8b5cf6", icon: "👻", bonusStat: "evasionBonus",    bonusValue: 25 },
  obsidian_fleet:    { name: "Obsidian Fleet",     description: "Amphibious assault forces",                            color: "#1e3a5f", icon: "🚢", bonusStat: "speedBonus",      bonusValue: 15 },
  thunder_guards:    { name: "Thunder Guards",     description: "Heavy support and siege warfare experts",               color: "#eab308", icon: "⛈️", bonusStat: "attackBonus",     bonusValue: 22 },
  mercenary_contractors: { name: "Mercenary Contractors", description: "Freelance soldiers for hire",                       color: "#ca8a04", icon: "💰", bonusStat: "attackBonus",     bonusValue: 12 },
};

// ============================================================================
// ROLE CONFIGURATION
// ============================================================================

export const ARMY_ROLE_CONFIG: Record<ArmyCommanderRole, {
  name: string;
  description: string;
  icon: string;
  primaryStat: keyof ArmyCommanderStats;
  secondaryStat: keyof ArmyCommanderStats;
  preferredCategories: string[];
}> = {
  infantry_leader:    { name: "Infantry Leader",    description: "Commands light and heavy infantry formations",     icon: "⚔️", primaryStat: "attackBonus",     secondaryStat: "hpBonus",       preferredCategories: ["infantry_corps", "heavy_infantry"] },
  armor_commander:    { name: "Armor Commander",    description: "Commands armored vehicle formations",             icon: "🐉", primaryStat: "attackBonus",     secondaryStat: "defenseBonus",  preferredCategories: ["armored_forces", "mech_exoskeleton"] },
  artillery_director: { name: "Artillery Director", description: "Commands artillery and siege formations",         icon: "💣", primaryStat: "attackBonus",     secondaryStat: "accuracyBonus", preferredCategories: ["artillery_corps"] },
  air_support_lead:   { name: "Air Support Lead",   description: "Commands air force formations",                   icon: "✈️", primaryStat: "speedBonus",      secondaryStat: "attackBonus",   preferredCategories: ["air_forces"] },
  special_ops_lead:   { name: "Special Ops Lead",   description: "Commands special operations forces",             icon: "🎖️", primaryStat: "evasionBonus",    secondaryStat: "accuracyBonus", preferredCategories: ["special_operations"] },
  engineering_chief:  { name: "Engineering Chief",  description: "Commands engineering and construction units",     icon: "🔧", primaryStat: "unitCapacity",    secondaryStat: "defenseBonus",  preferredCategories: ["engineering_corps"] },
  logistics_master:   { name: "Logistics Master",   description: "Manages supply chains and support operations",   icon: "📦", primaryStat: "unitCapacity",    secondaryStat: "initiativeBonus",preferredCategories: ["support_logistics"] },
  recon_director:     { name: "Recon Director",     description: "Commands reconnaissance and intelligence units",  icon: "👁️", primaryStat: "evasionBonus",    secondaryStat: "speedBonus",    preferredCategories: ["intelligence_recon"] },
  siege_master:       { name: "Siege Master",       description: "Commands siege and demolition forces",           icon: "🏰", primaryStat: "attackBonus",     secondaryStat: "hpBonus",       preferredCategories: ["artillery_corps", "heavy_infantry"] },
  defense_overseer:   { name: "Defense Overseer",   description: "Commands static defense and fortifications",    icon: "🛡️", primaryStat: "defenseBonus",    secondaryStat: "hpBonus",       preferredCategories: ["heavy_infantry", "engineering_corps"] },
  offense_director:   { name: "Offense Director",   description: "Commands aggressive assault formations",        icon: "🗡️", primaryStat: "attackBonus",     secondaryStat: "speedBonus",    preferredCategories: ["infantry_corps", "special_operations"] },
  psyops_lead:        { name: "Psyops Lead",        description: "Commands psychological and psionic operations", icon: "🧠", primaryStat: "moraleBonus",     secondaryStat: "initiativeBonus",preferredCategories: ["psionic_forces"] },
  cyber_warfare_lead: { name: "Cyber Warfare Lead", description: "Commands cyber and drone warfare units",        icon: "💻", primaryStat: "accuracyBonus",   secondaryStat: "speedBonus",    preferredCategories: ["cyber_drone"] },
  naval_ground_lead:  { name: "Naval Ground Lead",  description: "Commands naval ground forces and marines",      icon: "⚓", primaryStat: "attackBonus",     secondaryStat: "defenseBonus",  preferredCategories: ["naval_forces"] },
  combined_arms_lead: { name: "Combined Arms Lead", description: "Commands mixed formation armies",               icon: "🌟", primaryStat: "initiativeBonus", secondaryStat: "commandRadius", preferredCategories: ["command_hq"] },
  fortification_master:{ name: "Fortification Master",description: "Commands defensive structures and bunkers",   icon: "🏗️", primaryStat: "defenseBonus",    secondaryStat: "unitCapacity",  preferredCategories: ["engineering_corps"] },
  medical_corps_lead: { name: "Medical Corps Lead", description: "Commands medical and recovery units",           icon: "🏥", primaryStat: "hpBonus",         secondaryStat: "moraleBonus",   preferredCategories: ["support_logistics"] },
  supply_chain_lead:  { name: "Supply Chain Lead",  description: "Manages resource and equipment distribution",   icon: "🚛", primaryStat: "unitCapacity",    secondaryStat: "initiativeBonus",preferredCategories: ["support_logistics"] },
};
