/**
 * COMMANDER MASTERY SYSTEM
 * ============================================================
 * 18 Commander Classes across 4 Domains
 * Each class has: sub-classes, types, sub-types,
 * primary/secondary stats, passive abilities, active abilities,
 * and a 10-tier mastery progression (1–100 per tier = 1000 total).
 */

// ─── Mastery Tiers ────────────────────────────────────────────
export const MASTERY_TIERS = [
  { tier: 1, name: "Initiate",     color: "#94a3b8", minLevel: 1,   maxLevel: 9   },
  { tier: 2, name: "Apprentice",   color: "#60a5fa", minLevel: 10,  maxLevel: 19  },
  { tier: 3, name: "Journeyman",   color: "#34d399", minLevel: 20,  maxLevel: 29  },
  { tier: 4, name: "Adept",        color: "#a78bfa", minLevel: 30,  maxLevel: 39  },
  { tier: 5, name: "Expert",       color: "#fbbf24", minLevel: 40,  maxLevel: 49  },
  { tier: 6, name: "Veteran",      color: "#f97316", minLevel: 50,  maxLevel: 59  },
  { tier: 7, name: "Master",       color: "#ef4444", minLevel: 60,  maxLevel: 69  },
  { tier: 8, name: "Grand Master", color: "#ec4899", minLevel: 70,  maxLevel: 79  },
  { tier: 9, name: "Legendary",    color: "#c084fc", minLevel: 80,  maxLevel: 89  },
  { tier: 10, name: "Mythic",      color: "#fde68a", minLevel: 90,  maxLevel: 100 },
] as const;

export type MasteryTierName = typeof MASTERY_TIERS[number]["name"];

// ─── Stat keys ────────────────────────────────────────────────
export type StatKey =
  | "attackPower"     | "defenseRating"    | "fleetSpeed"
  | "researchRate"    | "buildSpeed"       | "resourceOutput"
  | "tradeBonus"      | "diplomacyRating"  | "espionagePower"
  | "colonyGrowth"    | "criticalStrike"   | "evasion"
  | "morale"          | "leadershipRadius" | "intelRange"
  | "shipCapacity"    | "shieldStrength"   | "weaponAccuracy"
  | "fuelEfficiency"  | "constructionCost";

export const STAT_META: Record<StatKey, { label: string; icon: string; color: string; description: string }> = {
  attackPower:      { label: "Attack Power",       icon: "⚔️",  color: "text-red-600",     description: "Increases damage dealt by all fleet units" },
  defenseRating:    { label: "Defense Rating",     icon: "🛡️",  color: "text-blue-600",    description: "Reduces damage taken by all fleet units" },
  fleetSpeed:       { label: "Fleet Speed",        icon: "🚀",  color: "text-cyan-600",    description: "Increases fleet movement and travel speed" },
  researchRate:     { label: "Research Rate",      icon: "🔬",  color: "text-purple-600",  description: "Increases the speed of research completion" },
  buildSpeed:       { label: "Build Speed",        icon: "🏗️",  color: "text-amber-600",   description: "Reduces construction time for structures" },
  resourceOutput:   { label: "Resource Output",    icon: "⛏️",  color: "text-green-600",   description: "Increases metal/crystal/deuterium production" },
  tradeBonus:       { label: "Trade Bonus",        icon: "💰",  color: "text-yellow-600",  description: "Increases profits and reduces market fees" },
  diplomacyRating:  { label: "Diplomacy Rating",   icon: "🤝",  color: "text-teal-600",    description: "Improves alliance negotiations and relations" },
  espionagePower:   { label: "Espionage Power",    icon: "🕵️",  color: "text-slate-600",   description: "Enhances spy success rate and intel quality" },
  colonyGrowth:     { label: "Colony Growth",      icon: "🌍",  color: "text-emerald-600", description: "Increases population and colony development" },
  criticalStrike:   { label: "Critical Strike",    icon: "💥",  color: "text-orange-600",  description: "Chance to deal double damage in combat" },
  evasion:          { label: "Evasion",            icon: "💨",  color: "text-sky-600",     description: "Chance to dodge incoming attacks" },
  morale:           { label: "Morale",             icon: "🌟",  color: "text-yellow-500",  description: "Boosts all unit performance when high" },
  leadershipRadius: { label: "Leadership Radius",  icon: "📡",  color: "text-blue-500",    description: "Extends the range of commander aura effects" },
  intelRange:       { label: "Intel Range",        icon: "👁️",  color: "text-indigo-600",  description: "Increases sensor and spy detection range" },
  shipCapacity:     { label: "Ship Capacity",      icon: "🛸",  color: "text-violet-600",  description: "Increases fleet size limits per wing" },
  shieldStrength:   { label: "Shield Strength",    icon: "⚡",  color: "text-blue-400",    description: "Increases shield hitpoints and regeneration" },
  weaponAccuracy:   { label: "Weapon Accuracy",    icon: "🎯",  color: "text-red-500",     description: "Reduces chance of missing a target" },
  fuelEfficiency:   { label: "Fuel Efficiency",    icon: "⛽",  color: "text-amber-500",   description: "Reduces deuterium consumption per jump" },
  constructionCost: { label: "Construction Cost",  icon: "🔩",  color: "text-slate-500",   description: "Reduces resource cost of building structures" },
};

// ─── Ability interface ────────────────────────────────────────
export interface MasteryAbility {
  id: string;
  name: string;
  description: string;
  type: "passive" | "active";
  cooldown?: number;     // seconds for actives
  duration?: number;     // seconds for actives
  unlockLevel: number;
  effects: Partial<Record<StatKey, number>>;
  icon: string;
  flavorText: string;
}

// ─── Sub-type interface ───────────────────────────────────────
export interface MasterySubType {
  id: string;
  name: string;
  description: string;
  bonusStat: StatKey;
  bonusValue: number;
  icon: string;
}

// ─── Type interface ───────────────────────────────────────────
export interface MasteryType {
  id: string;
  name: string;
  description: string;
  primaryStat: StatKey;
  icon: string;
  subTypes: MasterySubType[];
}

// ─── Sub-class interface ──────────────────────────────────────
export interface MasterySubClass {
  id: string;
  name: string;
  description: string;
  specialty: string;
  primaryStat: StatKey;
  secondaryStat: StatKey;
  statBonus: number;
  icon: string;
  types: MasteryType[];
}

// ─── Commander Class interface ────────────────────────────────
export interface CommanderMasteryClass {
  id: string;
  name: string;
  domain: "Warfare" | "Science" | "Economy" | "Leadership";
  tagline: string;
  description: string;
  lore: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  primaryStats: StatKey[];
  secondaryStats: StatKey[];
  baseStats: Partial<Record<StatKey, number>>;
  maxMasteryLevel: number;
  xpPerLevel: number;
  subClasses: MasterySubClass[];
  abilities: MasteryAbility[];
  masteryMilestones: Array<{ level: number; reward: string; type: "stat" | "ability" | "title" | "cosmetic" }>;
}

// ─── Domain metadata ──────────────────────────────────────────
export const MASTERY_DOMAINS = {
  Warfare:    { color: "#ef4444", icon: "⚔️",  description: "Masters of combat, fleet command, and military operations" },
  Science:    { color: "#a78bfa", icon: "🔬",  description: "Pioneers of research, technology, and scientific discovery" },
  Economy:    { color: "#fbbf24", icon: "💰",  description: "Controllers of trade, industry, and resource empires" },
  Leadership: { color: "#34d399", icon: "👑",  description: "Architects of diplomacy, governance, and grand strategy" },
} as const;

// ============================================================
// 18 COMMANDER MASTERY CLASSES
// ============================================================

export const COMMANDER_MASTERY_CLASSES: CommanderMasteryClass[] = [

  // ── 1. GRAND ADMIRAL ──────────────────────────────────────
  {
    id: "grand_admiral",
    name: "Grand Admiral",
    domain: "Warfare",
    tagline: "Supreme Commander of the Stellar Fleet",
    description: "The Grand Admiral embodies total fleet mastery — commanding entire armadas across star systems with unmatched tactical authority and strategic foresight.",
    lore: "Born from the fiercest naval academies in the galaxy, Grand Admirals have fought in hundreds of engagements. Their presence alone raises fleet morale by 30%.",
    icon: "👑",
    color: "#ef4444",
    gradientFrom: "from-red-950",
    gradientTo: "to-rose-900",
    primaryStats: ["attackPower", "fleetSpeed", "shipCapacity"],
    secondaryStats: ["morale", "criticalStrike", "weaponAccuracy"],
    baseStats: { attackPower: 25, fleetSpeed: 18, shipCapacity: 30, morale: 20, criticalStrike: 8, weaponAccuracy: 15 },
    maxMasteryLevel: 100,
    xpPerLevel: 1200,
    subClasses: [
      {
        id: "dreadnought_commander",
        name: "Dreadnought Commander",
        description: "Specializes in commanding capital-class warships and siege fleets.",
        specialty: "Capital Ship Doctrine",
        primaryStat: "attackPower",
        secondaryStat: "defenseRating",
        statBonus: 35,
        icon: "🚀",
        types: [
          {
            id: "siege_fleet",
            name: "Siege Fleet",
            description: "Orbital bombardment and planetary assault doctrine.",
            primaryStat: "attackPower",
            icon: "💥",
            subTypes: [
              { id: "orbital_gunner",   name: "Orbital Gunner",   description: "Maximizes bombardment damage from orbit.",        bonusStat: "attackPower",  bonusValue: 12, icon: "🎯" },
              { id: "breach_master",    name: "Breach Master",    description: "Specialized in breaking planetary defenses.",     bonusStat: "criticalStrike", bonusValue: 8, icon: "💣" },
              { id: "suppression_lord", name: "Suppression Lord", description: "Keeps ground forces suppressed during assault.", bonusStat: "morale",       bonusValue: 10, icon: "🔫" },
            ],
          },
          {
            id: "line_formation",
            name: "Line Formation",
            description: "Classic broadside combat with massed firepower.",
            primaryStat: "weaponAccuracy",
            icon: "⚔️",
            subTypes: [
              { id: "broadside_expert", name: "Broadside Expert", description: "Maximizes side-facing weapon damage.",         bonusStat: "weaponAccuracy", bonusValue: 10, icon: "🔥" },
              { id: "volley_captain",   name: "Volley Captain",   description: "Coordinates synchronized weapon salvos.",     bonusStat: "criticalStrike", bonusValue: 9, icon: "⚡" },
              { id: "iron_curtain",     name: "Iron Curtain",     description: "Layered defense during broadside exchange.", bonusStat: "defenseRating",  bonusValue: 11, icon: "🛡️" },
            ],
          },
        ],
      },
      {
        id: "carrier_admiral",
        name: "Carrier Admiral",
        description: "Commands vast carrier fleets with fighter wings and drone squadrons.",
        specialty: "Fighter Wing Operations",
        primaryStat: "shipCapacity",
        secondaryStat: "fleetSpeed",
        statBonus: 30,
        icon: "🛸",
        types: [
          {
            id: "fighter_wing",
            name: "Fighter Wing",
            description: "Fast strike fighters launched from carrier decks.",
            primaryStat: "fleetSpeed",
            icon: "✈️",
            subTypes: [
              { id: "ace_wing_leader", name: "Ace Wing Leader", description: "Elite fighter pilots with superior maneuverability.", bonusStat: "evasion",      bonusValue: 12, icon: "🌟" },
              { id: "swarm_doctrine",  name: "Swarm Doctrine",  description: "Overwhelm enemies with massed fighter attacks.",   bonusStat: "criticalStrike",bonusValue: 9,  icon: "🐝" },
              { id: "intercept_grid",  name: "Intercept Grid",  description: "Defensive fighter screen around the carrier.",    bonusStat: "defenseRating", bonusValue: 10, icon: "🔵" },
            ],
          },
          {
            id: "drone_command",
            name: "Drone Command",
            description: "Autonomous drone warfare under commander's AI direction.",
            primaryStat: "shipCapacity",
            icon: "🤖",
            subTypes: [
              { id: "recon_swarm",   name: "Recon Swarm",   description: "Scout drones that reveal enemy formations.",         bonusStat: "intelRange",    bonusValue: 14, icon: "📡" },
              { id: "assault_drones",name: "Assault Drones", description: "Attack drones targeting weak hull sections.",       bonusStat: "attackPower",   bonusValue: 10, icon: "💥" },
              { id: "repair_drones", name: "Repair Drones",  description: "Self-repair drones keeping the fleet operational.", bonusStat: "defenseRating", bonusValue: 8,  icon: "🔧" },
            ],
          },
        ],
      },
      {
        id: "strike_force_admiral",
        name: "Strike Force Admiral",
        description: "Rapid strike specialist — in and out before reinforcements arrive.",
        specialty: "Hit-and-Run Operations",
        primaryStat: "fleetSpeed",
        secondaryStat: "criticalStrike",
        statBonus: 28,
        icon: "⚡",
        types: [
          {
            id: "blitz_doctrine",
            name: "Blitz Doctrine",
            description: "Lightning-fast overwhelm attacks before the enemy can react.",
            primaryStat: "fleetSpeed",
            icon: "⚡",
            subTypes: [
              { id: "warp_ambush",    name: "Warp Ambush",    description: "Surprise attacks exiting warp at close range.",  bonusStat: "criticalStrike", bonusValue: 15, icon: "💫" },
              { id: "rapid_advance",  name: "Rapid Advance",  description: "Advance faster than enemy defenses can adapt.", bonusStat: "fleetSpeed",     bonusValue: 12, icon: "🏃" },
              { id: "shock_and_awe",  name: "Shock and Awe",  description: "Overwhelming first strikes to destroy morale.", bonusStat: "morale",         bonusValue: 10, icon: "🌩️" },
            ],
          },
          {
            id: "raider_doctrine",
            name: "Raider Doctrine",
            description: "Targeted raids on resource convoys and supply chains.",
            primaryStat: "tradeBonus",
            icon: "🏴‍☠️",
            subTypes: [
              { id: "convoy_hunter",  name: "Convoy Hunter",  description: "Specializes in intercepting enemy supply fleets.",  bonusStat: "intelRange",   bonusValue: 10, icon: "🎯" },
              { id: "pillager",       name: "Pillager",        description: "Maximizes resource theft from raids.",             bonusStat: "resourceOutput",bonusValue: 12, icon: "💎" },
              { id: "ghost_raider",   name: "Ghost Raider",    description: "Raids without triggering enemy alert systems.",    bonusStat: "espionagePower",bonusValue: 9,  icon: "👻" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "fleet_fury",         name: "Fleet Fury",          description: "Temporarily grants all fleet units +40% attack power for 30 seconds.", type: "active", cooldown: 300, duration: 30, unlockLevel: 10, effects: { attackPower: 40 }, icon: "🔥", flavorText: "The galaxy trembles when the Admiral commands." },
      { id: "iron_formation",     name: "Iron Formation",      description: "Permanently increases fleet defense by 8% per 10 mastery levels.",     type: "passive", unlockLevel: 20, effects: { defenseRating: 8 }, icon: "🛡️", flavorText: "Every sailor knows their post." },
      { id: "supreme_command",    name: "Supreme Command",     description: "At max mastery, fleet capacity increases by 50 additional ships.",     type: "passive", unlockLevel: 100, effects: { shipCapacity: 50 }, icon: "👑", flavorText: "An Admiral without a fleet is just a title." },
      { id: "tactical_overwatch", name: "Tactical Overwatch",  description: "Boosts weapon accuracy by 20% when outnumbered.",                     type: "passive", unlockLevel: 40, effects: { weaponAccuracy: 20 }, icon: "🎯", flavorText: "Precision under pressure — the Admiral's gift." },
    ],
    masteryMilestones: [
      { level: 10,  reward: "+5 Ship Capacity",         type: "stat" },
      { level: 20,  reward: "Iron Formation (passive)",  type: "ability" },
      { level: 30,  reward: "Title: Fleet Commander",    type: "title" },
      { level: 40,  reward: "Tactical Overwatch",        type: "ability" },
      { level: 50,  reward: "+10% Attack Power",         type: "stat" },
      { level: 60,  reward: "Admiral's Banner (cosmetic)",type: "cosmetic" },
      { level: 70,  reward: "Title: Grand Admiral",      type: "title" },
      { level: 80,  reward: "+15% Fleet Speed",          type: "stat" },
      { level: 90,  reward: "Title: Eternal Admiral",    type: "title" },
      { level: 100, reward: "Supreme Command (passive)", type: "ability" },
    ],
  },

  // ── 2. WARLORD ────────────────────────────────────────────
  {
    id: "warlord",
    name: "Warlord",
    domain: "Warfare",
    tagline: "Conqueror of Worlds, Master of Ground Assault",
    description: "The Warlord excels in ground invasions, planetary conquest, and dominating opposition through sheer overwhelming force.",
    lore: "Not every battle is won in space. Warlords know that true conquest means planting your banner on enemy soil.",
    icon: "⚔️",
    color: "#dc2626",
    gradientFrom: "from-red-950",
    gradientTo: "to-red-900",
    primaryStats: ["attackPower", "morale", "defenseRating"],
    secondaryStats: ["criticalStrike", "leadershipRadius", "colonyGrowth"],
    baseStats: { attackPower: 28, morale: 22, defenseRating: 20, criticalStrike: 10, leadershipRadius: 15, colonyGrowth: 5 },
    maxMasteryLevel: 100,
    xpPerLevel: 1100,
    subClasses: [
      {
        id: "siege_master",
        name: "Siege Master",
        description: "Breaks enemy fortifications with relentless siege operations.",
        specialty: "Fortification Destruction",
        primaryStat: "attackPower",
        secondaryStat: "defenseRating",
        statBonus: 32,
        icon: "🏰",
        types: [
          {
            id: "artillery_doctrine",
            name: "Artillery Doctrine",
            description: "Long-range bombardment from safe positions.",
            primaryStat: "attackPower",
            icon: "💣",
            subTypes: [
              { id: "siege_cannon",    name: "Siege Cannon",    description: "Heavy artillery destroying defensive structures.", bonusStat: "attackPower",  bonusValue: 14, icon: "🔫" },
              { id: "mortar_barrage",  name: "Mortar Barrage",  description: "Sustained mortar fire breaking enemy morale.",   bonusStat: "morale",       bonusValue: 9,  icon: "💥" },
              { id: "bunker_buster",   name: "Bunker Buster",   description: "Specialized rounds penetrating reinforced walls.",bonusStat: "criticalStrike",bonusValue: 11, icon: "💣" },
            ],
          },
          {
            id: "breach_assault",
            name: "Breach Assault",
            description: "Direct infantry assaults through breached fortifications.",
            primaryStat: "criticalStrike",
            icon: "🚪",
            subTypes: [
              { id: "shock_trooper",   name: "Shock Trooper",   description: "Elite infantry charging through breaches.",       bonusStat: "criticalStrike",bonusValue: 13, icon: "⚡" },
              { id: "shield_wall",     name: "Shield Wall",     description: "Protected infantry advance behind heavy shields.", bonusStat: "defenseRating", bonusValue: 10, icon: "🛡️" },
              { id: "vanguard",        name: "Vanguard",        description: "Lead assault units inspiring troops behind.",     bonusStat: "morale",        bonusValue: 12, icon: "🌟" },
            ],
          },
        ],
      },
      {
        id: "shock_trooper_general",
        name: "Shock Trooper General",
        description: "Commands elite rapid-assault troops for decisive engagements.",
        specialty: "Rapid Ground Assault",
        primaryStat: "criticalStrike",
        secondaryStat: "fleetSpeed",
        statBonus: 30,
        icon: "💥",
        types: [
          {
            id: "blitzkrieg_ground",
            name: "Blitzkrieg",
            description: "Fast overwhelming ground attacks leaving no time to regroup.",
            primaryStat: "fleetSpeed",
            icon: "⚡",
            subTypes: [
              { id: "fast_mover",    name: "Fast Mover",    description: "Rapid infantry deployment via dropships.",         bonusStat: "fleetSpeed",    bonusValue: 11, icon: "🚀" },
              { id: "shock_wave",    name: "Shock Wave",    description: "First-wave assault maximizing initial casualties.", bonusStat: "attackPower",   bonusValue: 13, icon: "🌊" },
              { id: "overrun",       name: "Overrun",       description: "Overruns defensive positions without slowing.",   bonusStat: "evasion",       bonusValue: 8,  icon: "🏃" },
            ],
          },
          {
            id: "guerrilla_warfare",
            name: "Guerrilla Warfare",
            description: "Unconventional hit-and-run ground tactics.",
            primaryStat: "evasion",
            icon: "🌿",
            subTypes: [
              { id: "ambush_expert",  name: "Ambush Expert",  description: "Sets up devastating ground ambushes.",           bonusStat: "criticalStrike", bonusValue: 14, icon: "🎯" },
              { id: "saboteur_corps", name: "Saboteur Corps",  description: "Destroys enemy supply lines and infrastructure.",bonusStat: "espionagePower", bonusValue: 9,  icon: "🔥" },
              { id: "phantom_squad",  name: "Phantom Squad",  description: "Ghost units impossible to track or predict.",   bonusStat: "evasion",        bonusValue: 12, icon: "👻" },
            ],
          },
        ],
      },
      {
        id: "occupation_general",
        name: "Occupation General",
        description: "Expert in holding conquered territories and managing subjugated populations.",
        specialty: "Territory Control",
        primaryStat: "colonyGrowth",
        secondaryStat: "morale",
        statBonus: 25,
        icon: "🚩",
        types: [
          {
            id: "garrison_doctrine",
            name: "Garrison Doctrine",
            description: "Fortifying and holding captured planets.",
            primaryStat: "defenseRating",
            icon: "🏰",
            subTypes: [
              { id: "iron_grip",      name: "Iron Grip",      description: "Ensures no uprisings in controlled territory.",   bonusStat: "morale",        bonusValue: 12, icon: "✊" },
              { id: "fortify_sector", name: "Fortify Sector",  description: "Rapidly builds defenses in captured systems.",   bonusStat: "buildSpeed",    bonusValue: 10, icon: "🏗️" },
              { id: "pacify_rebels",  name: "Pacify Rebels",  description: "Efficiently neutralizes resistance movements.",  bonusStat: "leadershipRadius",bonusValue:8,  icon: "🕊️" },
            ],
          },
          {
            id: "colonial_war",
            name: "Colonial War",
            description: "Total resource extraction from conquered worlds.",
            primaryStat: "resourceOutput",
            icon: "⛏️",
            subTypes: [
              { id: "war_economy",    name: "War Economy",    description: "Maximizes resource output from occupied planets.", bonusStat: "resourceOutput",bonusValue: 14, icon: "💰" },
              { id: "slave_labor",    name: "Forced Labor",   description: "Increases colony output through coerced work.",   bonusStat: "colonyGrowth",  bonusValue: 10, icon: "🔗" },
              { id: "asset_stripping",name: "Asset Stripping",description: "Extracts maximum value before abandoning a world.",bonusStat: "tradeBonus",   bonusValue: 9,  icon: "🪙" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "battle_cry",      name: "Battle Cry",       description: "Raises all troop morale by 50% for 45 seconds.",          type: "active",  cooldown: 240, duration: 45, unlockLevel: 10, effects: { morale: 50 }, icon: "📣", flavorText: "One voice, ten thousand blades raised." },
      { id: "iron_will",       name: "Iron Will",        description: "Permanently reduces damage received by 5% per 20 levels.", type: "passive", unlockLevel: 20, effects: { defenseRating: 5 }, icon: "💪", flavorText: "A Warlord bleeds so his soldiers don't have to." },
      { id: "conqueror_mark",  name: "Conqueror's Mark", description: "Conquered planets produce 20% more resources.",           type: "passive", unlockLevel: 60, effects: { resourceOutput: 20 }, icon: "🚩", flavorText: "Everything on this world belongs to the Warlord now." },
      { id: "berserker_rage",  name: "Berserker Rage",   description: "Doubles critical strike chance for 20 seconds.",          type: "active",  cooldown: 180, duration: 20, unlockLevel: 40, effects: { criticalStrike: 100 }, icon: "😡", flavorText: "The enemy will know fear." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Battle Cry (active)",        type: "ability" },
      { level: 20, reward: "Iron Will (passive)",         type: "ability" },
      { level: 30, reward: "Title: Siege Commander",      type: "title" },
      { level: 40, reward: "Berserker Rage (active)",     type: "ability" },
      { level: 50, reward: "+12% Morale",                 type: "stat" },
      { level: 60, reward: "Conqueror's Mark (passive)",  type: "ability" },
      { level: 70, reward: "Title: Grand Warlord",        type: "title" },
      { level: 80, reward: "+15% Defense Rating",         type: "stat" },
      { level: 90, reward: "War Banner (cosmetic)",       type: "cosmetic" },
      { level: 100, reward: "Title: Eternal Conqueror",  type: "title" },
    ],
  },

  // ── 3. INTERCEPTOR CAPTAIN ────────────────────────────────
  {
    id: "interceptor_captain",
    name: "Interceptor Captain",
    domain: "Warfare",
    tagline: "Speed Is The Ultimate Weapon",
    description: "The Interceptor Captain commands the fastest strike forces in the galaxy, overwhelming enemies before they can raise shields.",
    lore: "You don't see them coming. You don't see them leave. You only see the destruction they leave behind.",
    icon: "⚡",
    color: "#f97316",
    gradientFrom: "from-orange-950",
    gradientTo: "to-amber-900",
    primaryStats: ["fleetSpeed", "evasion", "criticalStrike"],
    secondaryStats: ["attackPower", "weaponAccuracy", "fuelEfficiency"],
    baseStats: { fleetSpeed: 30, evasion: 20, criticalStrike: 15, attackPower: 18, weaponAccuracy: 16, fuelEfficiency: 10 },
    maxMasteryLevel: 100,
    xpPerLevel: 1050,
    subClasses: [
      {
        id: "raider_captain",
        name: "Raider Captain",
        description: "Fast hit-and-run specialist targeting vulnerable convoys and outposts.",
        specialty: "Convoy Raiding",
        primaryStat: "fleetSpeed",
        secondaryStat: "tradeBonus",
        statBonus: 28,
        icon: "🏴‍☠️",
        types: [
          { id: "ambush_raider", name: "Ambush Raider", description: "Strikes from hidden positions before fleeing.", primaryStat: "criticalStrike", icon: "🎯",
            subTypes: [
              { id: "warp_shadow",   name: "Warp Shadow",   description: "Attacks from warp exit point at point blank.", bonusStat: "criticalStrike", bonusValue: 15, icon: "💫" },
              { id: "dark_matter",   name: "Dark Matter",   description: "Hides in dark matter clouds before striking.",  bonusStat: "evasion",        bonusValue: 12, icon: "🌑" },
              { id: "hit_fade",      name: "Hit and Fade",  description: "Perfect retreat timing after every strike.",   bonusStat: "fleetSpeed",     bonusValue: 10, icon: "💨" },
            ],
          },
          { id: "convoy_terror", name: "Convoy Terror", description: "Hunting enemy supply and trade ships.", primaryStat: "tradeBonus", icon: "🚢",
            subTypes: [
              { id: "supply_cutter", name: "Supply Cutter",  description: "Disrupts enemy supply chains.",            bonusStat: "espionagePower", bonusValue: 9,  icon: "✂️" },
              { id: "plunder_king",  name: "Plunder King",   description: "Maximizes loot captured from raids.",      bonusStat: "resourceOutput", bonusValue: 12, icon: "💰" },
              { id: "no_mercy",      name: "No Mercy",       description: "Destroys rather than captures — full XP.", bonusStat: "attackPower",    bonusValue: 11, icon: "💥" },
            ],
          },
        ],
      },
      {
        id: "corvette_commander",
        name: "Corvette Commander",
        description: "Light, fast ships in coordinated wolf-pack assaults.",
        specialty: "Wolf Pack Tactics",
        primaryStat: "evasion",
        secondaryStat: "criticalStrike",
        statBonus: 25,
        icon: "🛸",
        types: [
          { id: "wolf_pack", name: "Wolf Pack", description: "Coordinated multi-ship ambush tactics.", primaryStat: "attackPower", icon: "🐺",
            subTypes: [
              { id: "pack_alpha",   name: "Pack Alpha",   description: "Leads the pack providing bonus to all ships.", bonusStat: "leadershipRadius", bonusValue: 12, icon: "🌟" },
              { id: "encirclement", name: "Encirclement", description: "Surrounds the target cutting off retreat.",    bonusStat: "weaponAccuracy",   bonusValue: 10, icon: "🔄" },
              { id: "frenzy_strike",name: "Frenzy Strike", description: "Simultaneous multi-angle attack burst.",     bonusStat: "criticalStrike",   bonusValue: 13, icon: "⚡" },
            ],
          },
          { id: "stealth_ops", name: "Stealth Ops", description: "Invisible approach until attack moment.", primaryStat: "evasion", icon: "👻",
            subTypes: [
              { id: "dark_run",    name: "Dark Run",    description: "Runs all non-essential systems silent.",       bonusStat: "evasion",        bonusValue: 14, icon: "🌑" },
              { id: "ghost_ship",  name: "Ghost Ship",  description: "Near-invisible on enemy sensor arrays.",      bonusStat: "intelRange",     bonusValue: 10, icon: "👁️" },
              { id: "shadow_warp", name: "Shadow Warp", description: "Warps without creating detectable signature.", bonusStat: "fleetSpeed",     bonusValue: 11, icon: "💨" },
            ],
          },
        ],
      },
      {
        id: "wing_leader",
        name: "Wing Leader",
        description: "Fighter wing coordination and precision attack patterns.",
        specialty: "Precision Strike",
        primaryStat: "weaponAccuracy",
        secondaryStat: "fleetSpeed",
        statBonus: 26,
        icon: "✈️",
        types: [
          { id: "precision_strike", name: "Precision Strike", description: "Surgical attacks on critical enemy systems.", primaryStat: "weaponAccuracy", icon: "🎯",
            subTypes: [
              { id: "system_killer",  name: "System Killer",  description: "Targets engines first to disable retreat.", bonusStat: "weaponAccuracy", bonusValue: 15, icon: "🔧" },
              { id: "sniper_squadron",name: "Sniper Squadron", description: "Long-range precision fire from safe range.", bonusStat: "attackPower",    bonusValue: 10, icon: "🔭" },
              { id: "deadeye",        name: "Deadeye",         description: "Near-perfect accuracy at any range.",       bonusStat: "criticalStrike", bonusValue: 12, icon: "👁️" },
            ],
          },
          { id: "intercept_patrol", name: "Intercept Patrol", description: "Rapid response to any incursion.", primaryStat: "fleetSpeed", icon: "🛡️",
            subTypes: [
              { id: "fast_response",  name: "Fast Response",  description: "Intercepts enemies before they reach targets.", bonusStat: "fleetSpeed",   bonusValue: 13, icon: "⚡" },
              { id: "screen_captain", name: "Screen Captain",  description: "Protects slower capital ships from flanking.", bonusStat: "defenseRating",bonusValue: 9,  icon: "🛡️" },
              { id: "vector_alert",   name: "Vector Alert",   description: "Instant scramble regardless of warning time.", bonusStat: "evasion",      bonusValue: 11, icon: "📡" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "afterburner",    name: "Afterburner",    description: "Doubles fleet speed for 20 seconds.",                    type: "active",  cooldown: 180, duration: 20, unlockLevel: 10, effects: { fleetSpeed: 100 }, icon: "🚀", flavorText: "Punch it. Maximum thrust." },
      { id: "phantom_strike", name: "Phantom Strike", description: "Next attack automatically scores a critical hit.",       type: "active",  cooldown: 120, unlockLevel: 30, effects: { criticalStrike: 200 }, icon: "👻", flavorText: "They never saw it coming." },
      { id: "slip_stream",    name: "Slip Stream",    description: "Permanently increases fuel efficiency by 15%.",          type: "passive", unlockLevel: 20, effects: { fuelEfficiency: 15 }, icon: "💨", flavorText: "Speed without fuel is just ambition." },
      { id: "ace_reflexes",   name: "Ace Reflexes",   description: "Permanently increases evasion by 10%.",                 type: "passive", unlockLevel: 50, effects: { evasion: 10 }, icon: "🌟", flavorText: "Before the enemy aims, the Captain is gone." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Afterburner (active)",     type: "ability" },
      { level: 20, reward: "Slip Stream (passive)",    type: "ability" },
      { level: 30, reward: "Phantom Strike (active)",  type: "ability" },
      { level: 40, reward: "Title: Strike Commander",  type: "title" },
      { level: 50, reward: "Ace Reflexes (passive)",   type: "ability" },
      { level: 60, reward: "+15% Fleet Speed",         type: "stat" },
      { level: 70, reward: "Interceptor Badge (cosm)", type: "cosmetic" },
      { level: 80, reward: "Title: Ghost Captain",     type: "title" },
      { level: 90, reward: "+10% Evasion",             type: "stat" },
      { level: 100, reward: "Title: Phantom Admiral",  type: "title" },
    ],
  },

  // ── 4. SIEGE ENGINEER ─────────────────────────────────────
  {
    id: "siege_engineer",
    name: "Siege Engineer",
    domain: "Warfare",
    tagline: "Master of Fortification and Destruction",
    description: "The Siege Engineer builds impenetrable defenses and tears enemy fortifications apart with calculated precision.",
    lore: "Fortresses built by Siege Engineers have held for centuries. Fortresses assaulted by them rarely last the day.",
    icon: "🏗️",
    color: "#b45309",
    gradientFrom: "from-amber-950",
    gradientTo: "to-yellow-900",
    primaryStats: ["defenseRating", "buildSpeed", "attackPower"],
    secondaryStats: ["constructionCost", "shieldStrength", "weaponAccuracy"],
    baseStats: { defenseRating: 28, buildSpeed: 22, attackPower: 18, constructionCost: -15, shieldStrength: 20, weaponAccuracy: 12 },
    maxMasteryLevel: 100,
    xpPerLevel: 1000,
    subClasses: [
      {
        id: "orbital_bombardier",
        name: "Orbital Bombardier",
        description: "Rains destruction from orbit with heavy bombardment platforms.",
        specialty: "Orbital Fire Support",
        primaryStat: "attackPower",
        secondaryStat: "weaponAccuracy",
        statBonus: 30,
        icon: "💥",
        types: [
          { id: "kinetic_strike", name: "Kinetic Strike", description: "Mass driver kinetic bombardment from orbit.", primaryStat: "attackPower", icon: "🌠",
            subTypes: [
              { id: "rods_from_god",  name: "Rods from God",   description: "Tungsten rods dropped from orbital altitude.", bonusStat: "attackPower",   bonusValue: 16, icon: "💣" },
              { id: "cluster_drop",   name: "Cluster Drop",    description: "Dispersed impact maximizing area damage.",    bonusStat: "criticalStrike", bonusValue: 10, icon: "💥" },
              { id: "mass_driver",    name: "Mass Driver",     description: "Pinpoint accuracy on hardened bunkers.",      bonusStat: "weaponAccuracy", bonusValue: 12, icon: "🎯" },
            ],
          },
          { id: "energy_bombardment", name: "Energy Bombardment", description: "Orbital energy weapons vaporizing targets.", primaryStat: "shieldStrength", icon: "⚡",
            subTypes: [
              { id: "plasma_barrage",  name: "Plasma Barrage",  description: "Superheated plasma melting armor.",          bonusStat: "attackPower",    bonusValue: 14, icon: "🔥" },
              { id: "ion_cannon",      name: "Ion Cannon",      description: "Disables electronics across wide area.",     bonusStat: "espionagePower", bonusValue: 9,  icon: "⚡" },
              { id: "laser_scalpel",   name: "Laser Scalpel",   description: "Surgical precision energy strike.",          bonusStat: "weaponAccuracy", bonusValue: 15, icon: "🔦" },
            ],
          },
        ],
      },
      {
        id: "fortification_expert",
        name: "Fortification Expert",
        description: "Builds legendary defensive structures that repel any assault.",
        specialty: "Defensive Construction",
        primaryStat: "defenseRating",
        secondaryStat: "buildSpeed",
        statBonus: 35,
        icon: "🏰",
        types: [
          { id: "planetary_shield", name: "Planetary Shield", description: "Planet-wide shield generators.", primaryStat: "shieldStrength", icon: "🛡️",
            subTypes: [
              { id: "deflector_mesh",  name: "Deflector Mesh",  description: "Interlocking shield network.",               bonusStat: "shieldStrength", bonusValue: 18, icon: "🔵" },
              { id: "phase_barrier",   name: "Phase Barrier",   description: "Phase-shifted shields resisting energy.",    bonusStat: "defenseRating",  bonusValue: 12, icon: "💠" },
              { id: "redundant_layer", name: "Redundant Layer",  description: "Multiple shield layers with failovers.",    bonusStat: "constructionCost",bonusValue:-10,icon: "🔄" },
            ],
          },
          { id: "bunker_network", name: "Bunker Network", description: "Underground fortified bunker complexes.", primaryStat: "defenseRating", icon: "🏚️",
            subTypes: [
              { id: "adamantine_walls",name: "Adamantine Walls", description: "Ultra-dense walls absorbing all impacts.", bonusStat: "defenseRating",   bonusValue: 16, icon: "🧱" },
              { id: "subterranean",    name: "Subterranean",     description: "Underground networks surviving bombardment.",bonusStat: "constructionCost",bonusValue:-8, icon: "⛏️" },
              { id: "kill_zones",      name: "Kill Zones",       description: "Overlapping fire zones outside every wall.", bonusStat: "weaponAccuracy",  bonusValue: 10, icon: "🎯" },
            ],
          },
        ],
      },
      {
        id: "breach_specialist",
        name: "Breach Specialist",
        description: "Finds and exploits every weakness in enemy defenses.",
        specialty: "Defense Penetration",
        primaryStat: "weaponAccuracy",
        secondaryStat: "criticalStrike",
        statBonus: 28,
        icon: "🔓",
        types: [
          { id: "structural_analysis", name: "Structural Analysis", description: "Identifies critical weakness points.", primaryStat: "intelRange", icon: "📐",
            subTypes: [
              { id: "weak_point_scan",name: "Weak Point Scan", description: "Detects and targets structural weaknesses.", bonusStat: "weaponAccuracy", bonusValue: 14, icon: "🔍" },
              { id: "resonance_strike",name: "Resonance Strike",description: "Uses enemy structure's own resonance.",     bonusStat: "criticalStrike", bonusValue: 13, icon: "📳" },
              { id: "load_bearing",   name: "Load Bearing",    description: "Collapses entire structures with one hit.", bonusStat: "attackPower",    bonusValue: 11, icon: "🏗️" },
            ],
          },
          { id: "demolitions", name: "Demolitions", description: "Explosive expert dismantling defenses.", primaryStat: "attackPower", icon: "💣",
            subTypes: [
              { id: "shaped_charge",  name: "Shaped Charge",  description: "Directed explosions for maximum effect.",    bonusStat: "attackPower",    bonusValue: 15, icon: "💥" },
              { id: "emp_devices",    name: "EMP Devices",    description: "Electromagnetic disabling of electronics.",  bonusStat: "espionagePower", bonusValue: 9,  icon: "⚡" },
              { id: "tunnel_rat",     name: "Tunnel Rat",     description: "Places charges below enemy fortifications.", bonusStat: "evasion",        bonusValue: 10, icon: "🐀" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "fortress_mode",   name: "Fortress Mode",    description: "Activates planetary defense mode adding 60% defense for 60 seconds.",   type: "active",  cooldown: 600, duration: 60, unlockLevel: 10, effects: { defenseRating: 60 }, icon: "🏰", flavorText: "Nothing gets through." },
      { id: "rapid_fortify",   name: "Rapid Fortify",   description: "Permanently reduces construction time by 10%.",                         type: "passive", unlockLevel: 20, effects: { buildSpeed: 10 }, icon: "🔨", flavorText: "A good wall built fast is better than a great wall too late." },
      { id: "siege_mastery",   name: "Siege Mastery",   description: "Orbital bombardment ignores 30% of enemy shield strength.",             type: "passive", unlockLevel: 50, effects: { shieldStrength: 30 }, icon: "💥", flavorText: "Every wall has a threshold." },
      { id: "structure_sense", name: "Structure Sense", description: "Automatically identifies enemy base layout on approach.",               type: "passive", unlockLevel: 35, effects: { intelRange: 25 }, icon: "📡", flavorText: "A blueprint tells you everything you need to know." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Fortress Mode (active)",    type: "ability" },
      { level: 20, reward: "Rapid Fortify (passive)",   type: "ability" },
      { level: 30, reward: "Title: Siege Commander",    type: "title" },
      { level: 35, reward: "Structure Sense (passive)", type: "ability" },
      { level: 50, reward: "Siege Mastery (passive)",   type: "ability" },
      { level: 60, reward: "+15% Defense Rating",       type: "stat" },
      { level: 70, reward: "Engineer's Crest (cosm)",   type: "cosmetic" },
      { level: 80, reward: "Title: Grand Engineer",     type: "title" },
      { level: 90, reward: "-20% Construction Cost",    type: "stat" },
      { level: 100, reward: "Title: Eternal Builder",  type: "title" },
    ],
  },

  // ── 5. BATTLE MAGE ────────────────────────────────────────
  {
    id: "battle_mage",
    name: "Battle Mage",
    domain: "Warfare",
    tagline: "Where Science Ends, the Arcane Begins",
    description: "The Battle Mage wields forbidden arcane energies fused with advanced technology, tearing space itself to devastate enemies.",
    lore: "When the Arcane Order merged with the Military Academy, Battle Mages became the most feared commanders in known space.",
    icon: "🔮",
    color: "#7c3aed",
    gradientFrom: "from-violet-950",
    gradientTo: "to-purple-900",
    primaryStats: ["attackPower", "criticalStrike", "shieldStrength"],
    secondaryStats: ["researchRate", "morale", "weaponAccuracy"],
    baseStats: { attackPower: 24, criticalStrike: 18, shieldStrength: 22, researchRate: 10, morale: 15, weaponAccuracy: 14 },
    maxMasteryLevel: 100,
    xpPerLevel: 1300,
    subClasses: [
      {
        id: "void_wielder",
        name: "Void Wielder",
        description: "Commands the power of interstellar void energy to devastate enemies.",
        specialty: "Void Energy Manipulation",
        primaryStat: "attackPower",
        secondaryStat: "criticalStrike",
        statBonus: 34,
        icon: "🌑",
        types: [
          { id: "void_blast", name: "Void Blast", description: "Raw void energy discharged in combat.", primaryStat: "attackPower", icon: "💜",
            subTypes: [
              { id: "singularity_bolt",name: "Singularity Bolt", description: "Compressed singularity fired at targets.",   bonusStat: "attackPower",    bonusValue: 18, icon: "⚫" },
              { id: "void_rift",       name: "Void Rift",        description: "Tears space apart around the target.",       bonusStat: "criticalStrike", bonusValue: 14, icon: "🌀" },
              { id: "entropy_field",   name: "Entropy Field",   description: "Accelerates entropy within target area.",     bonusStat: "evasion",        bonusValue: -5, icon: "💀" },
            ],
          },
          { id: "void_armor", name: "Void Armor", description: "Void energy creates impenetrable defensive fields.", primaryStat: "shieldStrength", icon: "🔵",
            subTypes: [
              { id: "null_barrier",  name: "Null Barrier",  description: "Absolute void shield nullifying impacts.",     bonusStat: "shieldStrength", bonusValue: 20, icon: "🛡️" },
              { id: "absorb_matrix", name: "Absorb Matrix", description: "Converts incoming damage to power reserves.",  bonusStat: "criticalStrike", bonusValue: 10, icon: "⚡" },
              { id: "phased_void",   name: "Phased Void",   description: "Partially phases fleet out of normal space.",  bonusStat: "evasion",        bonusValue: 15, icon: "💫" },
            ],
          },
        ],
      },
      {
        id: "psionic_warrior",
        name: "Psionic Warrior",
        description: "Uses mental powers to control battles and devastate enemy commanders.",
        specialty: "Psionic Combat",
        primaryStat: "morale",
        secondaryStat: "leadershipRadius",
        statBonus: 30,
        icon: "🧠",
        types: [
          { id: "mind_assault", name: "Mind Assault", description: "Direct psionic attacks on enemy consciousness.", primaryStat: "attackPower", icon: "💭",
            subTypes: [
              { id: "psi_storm",     name: "Psi Storm",     description: "Psionic tempest affecting all enemies.",     bonusStat: "attackPower",    bonusValue: 15, icon: "⛈️" },
              { id: "terror_field",  name: "Terror Field",  description: "Projects fear reducing enemy combat ability.",bonusStat: "morale",         bonusValue: 20, icon: "😱" },
              { id: "mind_shatter",  name: "Mind Shatter",  description: "Permanently damages enemy commander's psych.",bonusStat: "espionagePower", bonusValue: 12, icon: "💥" },
            ],
          },
          { id: "psionic_shield", name: "Psionic Shield", description: "Mental barrier deflecting all forms of attack.", primaryStat: "defenseRating", icon: "🔮",
            subTypes: [
              { id: "thought_wall",  name: "Thought Wall",  description: "Psychic wall stopping physical projectiles.", bonusStat: "defenseRating",  bonusValue: 16, icon: "🧱" },
              { id: "deflect_mind",  name: "Deflect Mind",  description: "Redirects psionic attacks back at sender.",   bonusStat: "criticalStrike", bonusValue: 12, icon: "🔄" },
              { id: "commune",       name: "Commune",        description: "Links with allies boosting all performance.", bonusStat: "leadershipRadius",bonusValue:14, icon: "🌐" },
            ],
          },
        ],
      },
      {
        id: "rune_knight",
        name: "Rune Knight",
        description: "Ancient runic technology combined with personal combat mastery.",
        specialty: "Runic Enhancement",
        primaryStat: "weaponAccuracy",
        secondaryStat: "shieldStrength",
        statBonus: 28,
        icon: "🗡️",
        types: [
          { id: "rune_weapon", name: "Rune Weapon", description: "Weapons inscribed with ancient combat runes.", primaryStat: "attackPower", icon: "⚔️",
            subTypes: [
              { id: "fire_rune",   name: "Fire Rune",   description: "Blazing rune igniting all projectiles.",      bonusStat: "attackPower",    bonusValue: 14, icon: "🔥" },
              { id: "void_rune",   name: "Void Rune",   description: "Void rune bypassing standard defenses.",      bonusStat: "criticalStrike", bonusValue: 13, icon: "🌑" },
              { id: "storm_rune",  name: "Storm Rune",  description: "Chain lightning arcing between enemy units.", bonusStat: "weaponAccuracy", bonusValue: 11, icon: "⚡" },
            ],
          },
          { id: "rune_armor", name: "Rune Armor", description: "Inscribed armor absorbing magical damage.", primaryStat: "defenseRating", icon: "🛡️",
            subTypes: [
              { id: "ward_rune",    name: "Ward Rune",   description: "Warding rune deflecting energy attacks.",   bonusStat: "shieldStrength", bonusValue: 17, icon: "🔵" },
              { id: "haste_rune",   name: "Haste Rune",  description: "Speed rune granting reflexive reaction.",   bonusStat: "evasion",        bonusValue: 12, icon: "💨" },
              { id: "fortify_rune", name: "Fortify Rune",description: "Hardening rune tripling structure density.", bonusStat: "defenseRating",  bonusValue: 13, icon: "🏰" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "arcane_surge",   name: "Arcane Surge",    description: "Unleashes a devastating arcane burst — 80% attack boost for 25 seconds.", type: "active",  cooldown: 240, duration: 25, unlockLevel: 10, effects: { attackPower: 80 }, icon: "🔮", flavorText: "The power between stars compressed into a single moment." },
      { id: "void_sight",     name: "Void Sight",      description: "Permanently see through stealth and cloaking devices.",                  type: "passive", unlockLevel: 25, effects: { intelRange: 30 }, icon: "👁️", flavorText: "The void hides nothing from one who commands it." },
      { id: "mana_shield",    name: "Mana Shield",     description: "Converts 20% of incoming damage into research points.",                  type: "passive", unlockLevel: 45, effects: { researchRate: 20 }, icon: "🛡️", flavorText: "Destruction feeds knowledge." },
      { id: "reality_tear",   name: "Reality Tear",    description: "Tears a hole in reality — transports entire fleet instantly.",           type: "active",  cooldown: 900, unlockLevel: 80, effects: { fleetSpeed: 999 }, icon: "🌀", flavorText: "Distance is a suggestion to a Battle Mage." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Arcane Surge (active)",  type: "ability" },
      { level: 25, reward: "Void Sight (passive)",   type: "ability" },
      { level: 30, reward: "Title: Arcane Warrior",  type: "title" },
      { level: 45, reward: "Mana Shield (passive)",  type: "ability" },
      { level: 60, reward: "Arcane Aura (cosmetic)", type: "cosmetic" },
      { level: 70, reward: "Title: Battle Mage",     type: "title" },
      { level: 80, reward: "Reality Tear (active)",  type: "ability" },
      { level: 90, reward: "+20% Critical Strike",   type: "stat" },
      { level: 95, reward: "Title: Void Lord",       type: "title" },
      { level: 100, reward: "Title: Arcane Eternal", type: "title" },
    ],
  },

  // ── 6. GHOST OPERATIVE ────────────────────────────────────
  {
    id: "ghost_operative",
    name: "Ghost Operative",
    domain: "Warfare",
    tagline: "The Unseen Hand That Ends Wars",
    description: "Ghost Operatives operate in the shadows — saboteurs, assassins, and covert agents who end wars before they begin.",
    lore: "The most effective weapon in any war is one the enemy doesn't know exists.",
    icon: "🕵️",
    color: "#475569",
    gradientFrom: "from-slate-950",
    gradientTo: "to-zinc-900",
    primaryStats: ["espionagePower", "evasion", "criticalStrike"],
    secondaryStats: ["intelRange", "attackPower", "fleetSpeed"],
    baseStats: { espionagePower: 32, evasion: 25, criticalStrike: 20, intelRange: 22, attackPower: 15, fleetSpeed: 18 },
    maxMasteryLevel: 100,
    xpPerLevel: 1150,
    subClasses: [
      {
        id: "saboteur",
        name: "Saboteur",
        description: "Destroys enemy infrastructure from within before any battle begins.",
        specialty: "Infrastructure Destruction",
        primaryStat: "espionagePower",
        secondaryStat: "attackPower",
        statBonus: 30,
        icon: "💣",
        types: [
          { id: "tech_sabotage", name: "Tech Sabotage", description: "Disables enemy research and production.", primaryStat: "espionagePower", icon: "⚙️",
            subTypes: [
              { id: "lab_wrecker",    name: "Lab Wrecker",    description: "Destroys research facilities from inside.", bonusStat: "espionagePower", bonusValue: 15, icon: "🔬" },
              { id: "factory_killer", name: "Factory Killer",  description: "Halts production by targeting supply lines.",bonusStat: "resourceOutput", bonusValue:-10, icon: "🏭" },
              { id: "grid_virus",     name: "Grid Virus",     description: "Digital virus infecting power networks.",   bonusStat: "intelRange",     bonusValue: 12, icon: "💻" },
            ],
          },
          { id: "military_sabotage", name: "Military Sabotage", description: "Disables enemy military assets before battle.", primaryStat: "attackPower", icon: "⚔️",
            subTypes: [
              { id: "ship_wrecker",   name: "Ship Wrecker",   description: "Damages enemy ships in their docks.",         bonusStat: "attackPower",    bonusValue: 14, icon: "🚀" },
              { id: "munitions_thief",name: "Munitions Thief", description: "Steals enemy ammunition and weapons.",       bonusStat: "criticalStrike", bonusValue: 10, icon: "💰" },
              { id: "traitor_seed",   name: "Traitor Seed",   description: "Plants double agents in enemy command.",      bonusStat: "espionagePower", bonusValue: 16, icon: "🕵️" },
            ],
          },
        ],
      },
      {
        id: "assassin",
        name: "Assassin",
        description: "Eliminates high-value targets with surgical precision.",
        specialty: "High-Value Target Elimination",
        primaryStat: "criticalStrike",
        secondaryStat: "evasion",
        statBonus: 35,
        icon: "🗡️",
        types: [
          { id: "single_target", name: "Single Target", description: "One shot, one kill precision elimination.", primaryStat: "criticalStrike", icon: "🎯",
            subTypes: [
              { id: "headhunter",   name: "Headhunter",   description: "Bonuses when targeting commander units.",    bonusStat: "criticalStrike", bonusValue: 20, icon: "🏹" },
              { id: "silent_kill",  name: "Silent Kill",  description: "Assassination leaves no evidence behind.",   bonusStat: "espionagePower", bonusValue: 14, icon: "🤫" },
              { id: "poison_blade", name: "Poison Blade", description: "Targets suffer DoT after initial strike.",   bonusStat: "attackPower",    bonusValue: 12, icon: "☠️" },
            ],
          },
          { id: "contract_killer", name: "Contract Killer", description: "Multi-target elimination of named enemies.", primaryStat: "evasion", icon: "📜",
            subTypes: [
              { id: "clean_sweep", name: "Clean Sweep", description: "Eliminates multiple targets in single op.",     bonusStat: "criticalStrike", bonusValue: 15, icon: "🧹" },
              { id: "no_witnesses",name: "No Witnesses", description: "Removes all evidence of your presence.",       bonusStat: "evasion",        bonusValue: 14, icon: "👻" },
              { id: "marked",      name: "Marked",       description: "Marks enemies — reduces their all defenses.",  bonusStat: "intelRange",     bonusValue: 10, icon: "🔴" },
            ],
          },
        ],
      },
      {
        id: "infiltrator",
        name: "Infiltrator",
        description: "Deep-cover agent embedded within enemy organizations for years.",
        specialty: "Long-Term Intelligence",
        primaryStat: "intelRange",
        secondaryStat: "espionagePower",
        statBonus: 28,
        icon: "🎭",
        types: [
          { id: "deep_cover", name: "Deep Cover", description: "Long-term embedded agents providing constant intel.", primaryStat: "intelRange", icon: "🔭",
            subTypes: [
              { id: "identity_thief", name: "Identity Thief", description: "Adopts enemy identities for access.",       bonusStat: "espionagePower", bonusValue: 18, icon: "🎭" },
              { id: "asset_handler",  name: "Asset Handler",  description: "Manages network of embedded informants.",   bonusStat: "intelRange",     bonusValue: 14, icon: "📡" },
              { id: "double_agent",   name: "Double Agent",   description: "Feeds false intelligence to the enemy.",    bonusStat: "diplomacyRating",bonusValue: 9,  icon: "🔀" },
            ],
          },
          { id: "black_site", name: "Black Site", description: "Hidden facilities for interrogation and operations.", primaryStat: "espionagePower", icon: "🏚️",
            subTypes: [
              { id: "black_budget",   name: "Black Budget",   description: "Secret funding untraceable by enemies.",    bonusStat: "tradeBonus",     bonusValue: 10, icon: "💰" },
              { id: "data_extraction",name: "Data Extraction", description: "Extracts classified research from enemies.",bonusStat: "researchRate",   bonusValue: 12, icon: "💾" },
              { id: "psy_ops",        name: "Psy Ops",        description: "Psychological operations undermining morale.",bonusStat: "morale",        bonusValue: 15, icon: "🧠" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "ghost_protocol",  name: "Ghost Protocol",  description: "Fleet becomes completely undetectable for 30 seconds.",             type: "active",  cooldown: 300, duration: 30, unlockLevel: 10, effects: { evasion: 100 }, icon: "👻", flavorText: "The ghost leaves no trace." },
      { id: "shadow_network",  name: "Shadow Network",  description: "Permanently increases intel range by 25%.",                        type: "passive", unlockLevel: 20, effects: { intelRange: 25 }, icon: "🕸️", flavorText: "Information is the first battlefield." },
      { id: "backstab",        name: "Backstab",         description: "First attack from stealth deals 300% damage.",                    type: "passive", unlockLevel: 40, effects: { criticalStrike: 300 }, icon: "🗡️", flavorText: "The advantage of surprise belongs to those who take it." },
      { id: "dead_drop",       name: "Dead Drop",        description: "Steals 10% of enemy resources per successful espionage mission.", type: "passive", unlockLevel: 60, effects: { resourceOutput: 10 }, icon: "📦", flavorText: "Their loss is your gain." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Ghost Protocol (active)",  type: "ability" },
      { level: 20, reward: "Shadow Network (passive)", type: "ability" },
      { level: 30, reward: "Title: Shadow Agent",      type: "title" },
      { level: 40, reward: "Backstab (passive)",       type: "ability" },
      { level: 50, reward: "+15% Espionage Power",     type: "stat" },
      { level: 60, reward: "Dead Drop (passive)",      type: "ability" },
      { level: 70, reward: "Ghost Cloak (cosmetic)",   type: "cosmetic" },
      { level: 80, reward: "Title: Master Operative",  type: "title" },
      { level: 90, reward: "+20% Evasion",             type: "stat" },
      { level: 100, reward: "Title: Shadow Eternal",   type: "title" },
    ],
  },

  // ── 7. CHIEF RESEARCHER ───────────────────────────────────
  {
    id: "chief_researcher",
    name: "Chief Researcher",
    domain: "Science",
    tagline: "Knowledge Is The Only True Power",
    description: "The Chief Researcher accelerates the scientific output of entire civilizations, unlocking technologies generations ahead of schedule.",
    lore: "For every century others spent at war, Chief Researchers spent building the technologies that made those wars obsolete.",
    icon: "🔬",
    color: "#7c3aed",
    gradientFrom: "from-purple-950",
    gradientTo: "to-indigo-900",
    primaryStats: ["researchRate", "buildSpeed", "colonyGrowth"],
    secondaryStats: ["constructionCost", "resourceOutput", "tradeBonus"],
    baseStats: { researchRate: 35, buildSpeed: 15, colonyGrowth: 10, constructionCost: -12, resourceOutput: 8, tradeBonus: 5 },
    maxMasteryLevel: 100,
    xpPerLevel: 1100,
    subClasses: [
      {
        id: "physicist",
        name: "Physicist",
        description: "Pure physics research unlocking fundamental universal laws.",
        specialty: "Theoretical Physics",
        primaryStat: "researchRate",
        secondaryStat: "attackPower",
        statBonus: 40,
        icon: "⚛️",
        types: [
          { id: "quantum_physics", name: "Quantum Physics", description: "Research at the quantum scale.", primaryStat: "researchRate", icon: "🔮",
            subTypes: [
              { id: "entanglement",  name: "Entanglement",  description: "Quantum entanglement for FTL comms.",      bonusStat: "intelRange",   bonusValue: 16, icon: "🔗" },
              { id: "superposition", name: "Superposition", description: "Quantum computing multiplying research.",  bonusStat: "researchRate", bonusValue: 20, icon: "⚛️" },
              { id: "wave_theory",   name: "Wave Theory",   description: "Wave-particle research enabling new tech.", bonusStat: "buildSpeed",   bonusValue: 12, icon: "🌊" },
            ],
          },
          { id: "astrophysics", name: "Astrophysics", description: "Research into stellar phenomena and cosmology.", primaryStat: "colonyGrowth", icon: "🌌",
            subTypes: [
              { id: "star_mapper",  name: "Star Mapper",  description: "Maps stellar bodies revealing rare resources.", bonusStat: "resourceOutput",bonusValue: 12, icon: "⭐" },
              { id: "dark_energy",  name: "Dark Energy",  description: "Harnesses dark energy for exotic technologies.", bonusStat: "researchRate",  bonusValue: 15, icon: "🌑" },
              { id: "singularity",  name: "Singularity",  description: "Singularity research beyond conventional limits.",bonusStat: "attackPower",   bonusValue: 10, icon: "⚫" },
            ],
          },
        ],
      },
      {
        id: "biologist",
        name: "Biologist",
        description: "Life sciences research improving populations and biologics.",
        specialty: "Life Sciences",
        primaryStat: "colonyGrowth",
        secondaryStat: "researchRate",
        statBonus: 32,
        icon: "🧬",
        types: [
          { id: "genetics", name: "Genetics", description: "Genetic modification improving population traits.", primaryStat: "colonyGrowth", icon: "🧬",
            subTypes: [
              { id: "enhanced_genome", name: "Enhanced Genome", description: "Superior genetic engineering of colonists.", bonusStat: "colonyGrowth", bonusValue: 18, icon: "🧬" },
              { id: "disease_immunity",name: "Disease Immunity",description: "Permanent immunity to colony diseases.",     bonusStat: "morale",       bonusValue: 12, icon: "🦠" },
              { id: "lifespan_extend", name: "Lifespan Extension",description: "Extended lifespan = more skilled workers.", bonusStat: "researchRate", bonusValue: 10, icon: "⏳" },
            ],
          },
          { id: "xenobiology_pure", name: "Xenobiology", description: "Study of alien life forms for advantages.", primaryStat: "researchRate", icon: "👽",
            subTypes: [
              { id: "alien_biotech",  name: "Alien Biotech",  description: "Reverse-engineered alien biology.",          bonusStat: "researchRate",  bonusValue: 14, icon: "🔬" },
              { id: "bio_weapons",    name: "Bio Weapons",    description: "Biological agents for combat.",              bonusStat: "attackPower",   bonusValue: 10, icon: "☠️" },
              { id: "symbiosis_tech", name: "Symbiosis Tech", description: "Living technology merged with machines.",    bonusStat: "buildSpeed",    bonusValue: 11, icon: "🤝" },
            ],
          },
        ],
      },
      {
        id: "cosmologist",
        name: "Cosmologist",
        description: "Studies the structure and origin of the universe itself.",
        specialty: "Cosmic Scale Research",
        primaryStat: "researchRate",
        secondaryStat: "intelRange",
        statBonus: 38,
        icon: "🌌",
        types: [
          { id: "origin_research", name: "Origin Research", description: "Research into the fundamental origins of reality.", primaryStat: "researchRate", icon: "🔭",
            subTypes: [
              { id: "big_bang_theory", name: "Big Bang Theory", description: "Understanding creation unlocks hidden forces.",bonusStat: "researchRate",  bonusValue: 22, icon: "💥" },
              { id: "multiverse",      name: "Multiverse",      description: "Cross-dimensional research breakthroughs.",   bonusStat: "attackPower",    bonusValue: 12, icon: "🌀" },
              { id: "time_research",   name: "Time Research",   description: "Temporal research with unpredictable effects.",bonusStat: "buildSpeed",     bonusValue: 15, icon: "⏱️" },
            ],
          },
          { id: "cosmic_engineering", name: "Cosmic Engineering", description: "Engineering at cosmic scale — megastructures.", primaryStat: "buildSpeed", icon: "🏗️",
            subTypes: [
              { id: "dyson_sphere",    name: "Dyson Sphere",    description: "Harnessing entire stars for energy.",      bonusStat: "resourceOutput", bonusValue: 20, icon: "☀️" },
              { id: "ringworld",       name: "Ring World",      description: "Artificial ring habitats for billions.",   bonusStat: "colonyGrowth",   bonusValue: 16, icon: "💍" },
              { id: "stellar_forge",   name: "Stellar Forge",   description: "Forge materials from stellar matter.",     bonusStat: "constructionCost",bonusValue:-15,icon: "⚒️" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "eureka_moment",  name: "Eureka Moment",   description: "Instantly completes current research project.",                      type: "active",  cooldown: 3600, unlockLevel: 10, effects: { researchRate: 999 }, icon: "💡", flavorText: "The universe just revealed its secret." },
      { id: "lab_efficiency", name: "Lab Efficiency",  description: "Permanently increases research output by 12%.",                     type: "passive", unlockLevel: 20, effects: { researchRate: 12 }, icon: "🔬", flavorText: "A well-organized lab is a productive lab." },
      { id: "tech_cascade",   name: "Tech Cascade",    description: "Completing any research gives 10% boost to next research.",         type: "passive", unlockLevel: 40, effects: { researchRate: 10 }, icon: "🌊", flavorText: "Knowledge builds upon knowledge." },
      { id: "breakthrough",   name: "Breakthrough",    description: "Once per day, double research output for 2 hours.",                 type: "active",  cooldown: 86400, duration: 7200, unlockLevel: 70, effects: { researchRate: 100 }, icon: "🚀", flavorText: "Today, we change everything." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Eureka Moment (active)",  type: "ability" },
      { level: 20, reward: "Lab Efficiency (passive)", type: "ability" },
      { level: 30, reward: "Title: Head Researcher",  type: "title" },
      { level: 40, reward: "Tech Cascade (passive)",  type: "ability" },
      { level: 50, reward: "+20% Research Rate",      type: "stat" },
      { level: 60, reward: "Lab Coat (cosmetic)",     type: "cosmetic" },
      { level: 70, reward: "Breakthrough (active)",   type: "ability" },
      { level: 80, reward: "Title: Grand Scientist",  type: "title" },
      { level: 90, reward: "+25% Research Rate",      type: "stat" },
      { level: 100, reward: "Title: Eternal Scholar", type: "title" },
    ],
  },

  // ── 8. MASTER ENGINEER ────────────────────────────────────
  {
    id: "master_engineer",
    name: "Master Engineer",
    domain: "Science",
    tagline: "Builder of Civilizations, Destroyer of Limits",
    description: "The Master Engineer turns raw materials into towering wonders — shipyards, megastructures, and entire orbital platforms.",
    lore: "Every great civilization is remembered for what it built. Master Engineers are the hands that shape history.",
    icon: "⚙️",
    color: "#0891b2",
    gradientFrom: "from-cyan-950",
    gradientTo: "to-teal-900",
    primaryStats: ["buildSpeed", "constructionCost", "resourceOutput"],
    secondaryStats: ["defenseRating", "shieldStrength", "shipCapacity"],
    baseStats: { buildSpeed: 32, constructionCost: -20, resourceOutput: 18, defenseRating: 12, shieldStrength: 15, shipCapacity: 10 },
    maxMasteryLevel: 100,
    xpPerLevel: 950,
    subClasses: [
      {
        id: "shipwright",
        name: "Shipwright",
        description: "Legendary ship designer and constructor of entire fleets.",
        specialty: "Naval Construction",
        primaryStat: "shipCapacity",
        secondaryStat: "buildSpeed",
        statBonus: 30,
        icon: "🛸",
        types: [
          { id: "capital_design", name: "Capital Design", description: "Designing and building capital warships.", primaryStat: "shipCapacity", icon: "🚀",
            subTypes: [
              { id: "titan_builder",  name: "Titan Builder",  description: "Specializes in titan-class warships.",       bonusStat: "shipCapacity",    bonusValue: 15, icon: "🛸" },
              { id: "speed_yards",    name: "Speed Yards",    description: "Faster construction reducing fleet downtime.", bonusStat: "buildSpeed",      bonusValue: 18, icon: "⚡" },
              { id: "cost_reduction", name: "Cost Reduction", description: "Material optimization in ship construction.", bonusStat: "constructionCost", bonusValue:-12, icon: "💰" },
            ],
          },
          { id: "fleet_logistics", name: "Fleet Logistics", description: "Support ships keeping the fleet operational.", primaryStat: "fuelEfficiency", icon: "🔧",
            subTypes: [
              { id: "supply_chain",   name: "Supply Chain",   description: "Optimized supply keeping ships full.",    bonusStat: "fuelEfficiency",  bonusValue: 15, icon: "⛽" },
              { id: "repair_depot",   name: "Repair Depot",   description: "Rapid repair turnaround for damaged ships.",bonusStat: "defenseRating",   bonusValue: 10, icon: "🔧" },
              { id: "mobile_yard",    name: "Mobile Yard",    description: "Construction yards that follow the fleet.", bonusStat: "buildSpeed",      bonusValue: 12, icon: "🏗️" },
            ],
          },
        ],
      },
      {
        id: "architect",
        name: "Architect",
        description: "Designs and builds planetary structures and megastructures.",
        specialty: "Megastructure Construction",
        primaryStat: "buildSpeed",
        secondaryStat: "constructionCost",
        statBonus: 35,
        icon: "🏛️",
        types: [
          { id: "planetary_structures", name: "Planetary Structures", description: "Massive surface-based installations.", primaryStat: "buildSpeed", icon: "🏙️",
            subTypes: [
              { id: "urban_planner",    name: "Urban Planner",    description: "Optimizes city layout for maximum output.", bonusStat: "colonyGrowth",    bonusValue: 12, icon: "🏙️" },
              { id: "resource_complex", name: "Resource Complex",  description: "Integrated resource extraction complexes.", bonusStat: "resourceOutput",  bonusValue: 14, icon: "⛏️" },
              { id: "defense_grid",     name: "Defense Grid",     description: "Planet-wide defense installation network.",  bonusStat: "defenseRating",   bonusValue: 12, icon: "🛡️" },
            ],
          },
          { id: "orbital_construction", name: "Orbital Construction", description: "Building in orbit and deep space.", primaryStat: "shipCapacity", icon: "🛰️",
            subTypes: [
              { id: "space_station",    name: "Space Station",    description: "Full-service orbital platforms.",         bonusStat: "shipCapacity",    bonusValue: 14, icon: "🛸" },
              { id: "orbital_ring",     name: "Orbital Ring",     description: "Massive orbital ring structures.",        bonusStat: "resourceOutput",  bonusValue: 12, icon: "💍" },
              { id: "construction_bay", name: "Construction Bay",  description: "Rapid orbital construction platform.",   bonusStat: "buildSpeed",      bonusValue: 15, icon: "🏗️" },
            ],
          },
        ],
      },
      {
        id: "systems_engineer",
        name: "Systems Engineer",
        description: "Optimizes complex integrated systems for peak performance.",
        specialty: "System Optimization",
        primaryStat: "constructionCost",
        secondaryStat: "resourceOutput",
        statBonus: 28,
        icon: "💻",
        types: [
          { id: "power_systems", name: "Power Systems", description: "Energy grid optimization across all structures.", primaryStat: "resourceOutput", icon: "⚡",
            subTypes: [
              { id: "fusion_expert",  name: "Fusion Expert",  description: "Advanced fusion reactor optimization.",     bonusStat: "resourceOutput", bonusValue: 16, icon: "☀️" },
              { id: "grid_master",    name: "Grid Master",    description: "Power grid management across the empire.",  bonusStat: "buildSpeed",     bonusValue: 11, icon: "🔌" },
              { id: "zero_point",     name: "Zero Point",     description: "Zero-point energy research and extraction.", bonusStat: "researchRate",   bonusValue: 10, icon: "∞" },
            ],
          },
          { id: "ai_systems", name: "AI Systems", description: "AI-driven automation boosting all system output.", primaryStat: "buildSpeed", icon: "🤖",
            subTypes: [
              { id: "auto_factory",   name: "Auto Factory",   description: "Fully automated production facilities.",    bonusStat: "buildSpeed",      bonusValue: 18, icon: "🏭" },
              { id: "ai_research",    name: "AI Research",    description: "AI systems accelerating research programs.", bonusStat: "researchRate",    bonusValue: 13, icon: "🧠" },
              { id: "smart_defence",  name: "Smart Defence",  description: "AI-managed defensive systems.",             bonusStat: "defenseRating",   bonusValue: 11, icon: "🛡️" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "master_build",    name: "Master Build",     description: "Completes one building project instantly.",                       type: "active",  cooldown: 3600, unlockLevel: 10, effects: { buildSpeed: 999 }, icon: "🏗️", flavorText: "When you know what you're doing, it looks effortless." },
      { id: "material_mastery",name: "Material Mastery", description: "Reduces all construction costs by 10% permanently.",            type: "passive", unlockLevel: 20, effects: { constructionCost: -10 }, icon: "🔩", flavorText: "Waste nothing, build everything." },
      { id: "parallel_build",  name: "Parallel Build",   description: "Allows 2 additional build queues simultaneously.",              type: "passive", unlockLevel: 50, effects: { buildSpeed: 20 }, icon: "🔄", flavorText: "Why build one thing when you can build three?" },
      { id: "nanoassembly",    name: "Nano Assembly",    description: "Deploys nanobots — builds 3× faster for 5 minutes.",           type: "active",  cooldown: 7200, duration: 300, unlockLevel: 75, effects: { buildSpeed: 200 }, icon: "🤖", flavorText: "A trillion tiny hands working at once." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Master Build (active)",      type: "ability" },
      { level: 20, reward: "Material Mastery (passive)", type: "ability" },
      { level: 30, reward: "Title: Senior Engineer",     type: "title" },
      { level: 50, reward: "Parallel Build (passive)",   type: "ability" },
      { level: 60, reward: "Blueprint Frame (cosmetic)", type: "cosmetic" },
      { level: 70, reward: "Title: Grand Architect",     type: "title" },
      { level: 75, reward: "Nano Assembly (active)",     type: "ability" },
      { level: 85, reward: "-25% Construction Cost",    type: "stat" },
      { level: 90, reward: "Title: Master Architect",   type: "title" },
      { level: 100, reward: "Title: Builder Eternal",   type: "title" },
    ],
  },

  // ── 9. XENOBIOLOGIST ──────────────────────────────────────
  {
    id: "xenobiologist",
    name: "Xenobiologist",
    domain: "Science",
    tagline: "Life Finds A Way — I Find Life First",
    description: "The Xenobiologist discovers and adapts alien life for terraforming, bio-weapons, and technological integration.",
    lore: "The galaxy is teeming with life that most commanders never notice. Xenobiologists make it work for them.",
    icon: "🧬",
    color: "#059669",
    gradientFrom: "from-emerald-950",
    gradientTo: "to-green-900",
    primaryStats: ["colonyGrowth", "researchRate", "resourceOutput"],
    secondaryStats: ["buildSpeed", "morale", "constructionCost"],
    baseStats: { colonyGrowth: 30, researchRate: 22, resourceOutput: 16, buildSpeed: 10, morale: 12, constructionCost: -8 },
    maxMasteryLevel: 100,
    xpPerLevel: 950,
    subClasses: [
      {
        id: "terraformer",
        name: "Terraformer",
        description: "Transforms hostile worlds into habitable paradises.",
        specialty: "Planetary Transformation",
        primaryStat: "colonyGrowth",
        secondaryStat: "buildSpeed",
        statBonus: 35,
        icon: "🌍",
        types: [
          { id: "atmospheric_engineering", name: "Atmospheric Eng.", description: "Redesigning planetary atmospheres.", primaryStat: "colonyGrowth", icon: "☁️",
            subTypes: [
              { id: "air_processor",  name: "Air Processor",  description: "Converts toxic atmospheres to breathable.", bonusStat: "colonyGrowth",   bonusValue: 16, icon: "💨" },
              { id: "climate_control",name: "Climate Control", description: "Global climate modification.",            bonusStat: "resourceOutput", bonusValue: 12, icon: "🌡️" },
              { id: "ozone_builder",  name: "Ozone Builder",  description: "Creates protective atmospheric layers.",   bonusStat: "defenseRating",  bonusValue: 9,  icon: "🔵" },
            ],
          },
          { id: "biome_engineering", name: "Biome Engineering", description: "Creating complete ecological systems.", primaryStat: "resourceOutput", icon: "🌿",
            subTypes: [
              { id: "forest_seeding",  name: "Forest Seeding",  description: "Rapid forest growth fixing atmosphere.",  bonusStat: "resourceOutput", bonusValue: 14, icon: "🌲" },
              { id: "ocean_creation",  name: "Ocean Creation",  description: "Creates oceans from subsurface ice.",     bonusStat: "colonyGrowth",   bonusValue: 14, icon: "🌊" },
              { id: "megafauna",       name: "Megafauna",       description: "Introduces large animals for balance.",   bonusStat: "morale",         bonusValue: 10, icon: "🦕" },
            ],
          },
        ],
      },
      {
        id: "biome_specialist",
        name: "Biome Specialist",
        description: "Expert in specific planetary environments and their unique resources.",
        specialty: "Biome Resource Extraction",
        primaryStat: "resourceOutput",
        secondaryStat: "colonyGrowth",
        statBonus: 28,
        icon: "🌿",
        types: [
          { id: "desert_biome", name: "Desert Biome", description: "Extracting resources from arid worlds.", primaryStat: "resourceOutput", icon: "🏜️",
            subTypes: [
              { id: "solar_arrays",  name: "Solar Arrays",  description: "Massive solar collection on barren worlds.", bonusStat: "resourceOutput", bonusValue: 18, icon: "☀️" },
              { id: "crystal_caves", name: "Crystal Caves",  description: "Mining unique crystals from desert caves.",  bonusStat: "tradeBonus",     bonusValue: 12, icon: "💎" },
              { id: "sand_walker",   name: "Sand Walker",   description: "Efficient colony movement across deserts.",   bonusStat: "fleetSpeed",     bonusValue: 8,  icon: "🦂" },
            ],
          },
          { id: "ocean_biome", name: "Ocean Biome", description: "Resources from ocean worlds and deep seas.", primaryStat: "colonyGrowth", icon: "🌊",
            subTypes: [
              { id: "deep_mining",   name: "Deep Mining",   description: "Seabed extraction of rare minerals.",        bonusStat: "resourceOutput", bonusValue: 15, icon: "⛏️" },
              { id: "kelp_farms",    name: "Kelp Farms",    description: "Oceanic food farms sustaining large colonies.",bonusStat: "colonyGrowth",   bonusValue: 14, icon: "🌿" },
              { id: "hydrothermal",  name: "Hydrothermal",  description: "Energy from deep-sea hydrothermal vents.",   bonusStat: "buildSpeed",     bonusValue: 10, icon: "♨️" },
            ],
          },
        ],
      },
      {
        id: "xenologist",
        name: "Xenologist",
        description: "Studies alien civilizations and adapts their technologies.",
        specialty: "Alien Technology Integration",
        primaryStat: "researchRate",
        secondaryStat: "tradeBonus",
        statBonus: 32,
        icon: "👽",
        types: [
          { id: "alien_artifact", name: "Alien Artifacts", description: "Reverse-engineering alien technology.", primaryStat: "researchRate", icon: "🏺",
            subTypes: [
              { id: "relic_tech",    name: "Relic Tech",    description: "Ancient alien tech yielding breakthroughs.",  bonusStat: "researchRate",  bonusValue: 20, icon: "🔮" },
              { id: "tech_fusion",   name: "Tech Fusion",   description: "Merging alien and human technologies.",       bonusStat: "buildSpeed",    bonusValue: 13, icon: "🔗" },
              { id: "alien_weapon",  name: "Alien Weapon",  description: "Weaponized alien technology.",               bonusStat: "attackPower",   bonusValue: 11, icon: "⚔️" },
            ],
          },
          { id: "first_contact", name: "First Contact", description: "Establishing relations with undiscovered species.", primaryStat: "diplomacyRating", icon: "🤝",
            subTypes: [
              { id: "translator",    name: "Translator",    description: "Rapid translation of alien languages.",       bonusStat: "diplomacyRating",bonusValue: 15, icon: "🗣️" },
              { id: "cultural_bond", name: "Cultural Bond", description: "Cultural exchange building long-term trade.",  bonusStat: "tradeBonus",    bonusValue: 12, icon: "🌐" },
              { id: "species_rep",   name: "Species Rep",   description: "Become ambassador for multiple species.",     bonusStat: "leadershipRadius",bonusValue:10,icon: "📡" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "bio_accelerate",  name: "Bio Accelerate",  description: "Colony grows 5× faster for 1 hour.",                             type: "active",  cooldown: 7200, duration: 3600, unlockLevel: 10, effects: { colonyGrowth: 400 }, icon: "🌱", flavorText: "Life wants to flourish — sometimes it just needs help." },
      { id: "adaptive_genome", name: "Adaptive Genome", description: "Permanently increases colony output by 8% per planet class.",    type: "passive", unlockLevel: 25, effects: { colonyGrowth: 8 }, icon: "🧬", flavorText: "Evolution, accelerated." },
      { id: "xerophyte",       name: "Xerophyte",       description: "Colonies can survive on any planet type without penalty.",       type: "passive", unlockLevel: 50, effects: { resourceOutput: 15 }, icon: "🌵", flavorText: "If it can grow in a vacuum, we can make it grow." },
      { id: "planetary_bloom", name: "Planetary Bloom",  description: "Instantly completes current terraforming project.",             type: "active",  cooldown: 14400, unlockLevel: 80, effects: { colonyGrowth: 999 }, icon: "🌸", flavorText: "An entire ecosystem, willed into existence." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Bio Accelerate (active)",   type: "ability" },
      { level: 25, reward: "Adaptive Genome (passive)", type: "ability" },
      { level: 30, reward: "Title: Field Biologist",    type: "title" },
      { level: 50, reward: "Xerophyte (passive)",       type: "ability" },
      { level: 60, reward: "Specimen Case (cosmetic)",  type: "cosmetic" },
      { level: 70, reward: "Title: Master Xenologist",  type: "title" },
      { level: 80, reward: "Planetary Bloom (active)",  type: "ability" },
      { level: 90, reward: "+25% Colony Growth",        type: "stat" },
      { level: 95, reward: "Title: Life Architect",     type: "title" },
      { level: 100, reward: "Title: Genesis Eternal",   type: "title" },
    ],
  },

  // ── 10. QUANTUM THEORIST ──────────────────────────────────
  {
    id: "quantum_theorist",
    name: "Quantum Theorist",
    domain: "Science",
    tagline: "The Observer Who Changes What Is Observed",
    description: "The Quantum Theorist bends the laws of physics to accelerate every aspect of their empire.",
    lore: "They say the Quantum Theorist doesn't just predict the future — they calculate every possible future and choose the best one.",
    icon: "⚛️",
    color: "#6d28d9",
    gradientFrom: "from-violet-950",
    gradientTo: "to-purple-900",
    primaryStats: ["researchRate", "buildSpeed", "fuelEfficiency"],
    secondaryStats: ["attackPower", "weaponAccuracy", "shieldStrength"],
    baseStats: { researchRate: 30, buildSpeed: 18, fuelEfficiency: 22, attackPower: 10, weaponAccuracy: 12, shieldStrength: 14 },
    maxMasteryLevel: 100,
    xpPerLevel: 1200,
    subClasses: [
      {
        id: "particle_physicist",
        name: "Particle Physicist",
        description: "Studies and weaponizes fundamental particles.",
        specialty: "Particle Weaponization",
        primaryStat: "attackPower",
        secondaryStat: "researchRate",
        statBonus: 30,
        icon: "⚛️",
        types: [
          { id: "antimatter_research", name: "Antimatter Research", description: "Harnessing antimatter for power and weapons.", primaryStat: "attackPower", icon: "💥",
            subTypes: [
              { id: "annihilation_beam",name: "Annihilation Beam", description: "Pure matter-antimatter annihilation weapon.",  bonusStat: "attackPower",   bonusValue: 20, icon: "💀" },
              { id: "antimatter_core",  name: "Antimatter Core",  description: "Powers ships with antimatter reactors.",       bonusStat: "fuelEfficiency",bonusValue: 15, icon: "⚡" },
              { id: "containment_tech", name: "Containment Tech",  description: "Safe antimatter containment systems.",        bonusStat: "shieldStrength",bonusValue: 12, icon: "🔵" },
            ],
          },
          { id: "dark_matter_research", name: "Dark Matter Research", description: "Understanding the universe's hidden mass.", primaryStat: "researchRate", icon: "🌑",
            subTypes: [
              { id: "dark_detector",   name: "Dark Detector",   description: "Detects dark matter concentrations.",           bonusStat: "intelRange",    bonusValue: 14, icon: "👁️" },
              { id: "dark_engine",     name: "Dark Engine",     description: "Dark matter fuel for limitless travel.",        bonusStat: "fuelEfficiency",bonusValue: 18, icon: "🚀" },
              { id: "dark_shield",     name: "Dark Shield",     description: "Dark matter barrier absorbing all damage.",     bonusStat: "defenseRating", bonusValue: 14, icon: "🛡️" },
            ],
          },
        ],
      },
      {
        id: "warp_theorist",
        name: "Warp Theorist",
        description: "Mastery of warp physics for faster-than-light travel.",
        specialty: "FTL Navigation",
        primaryStat: "fleetSpeed",
        secondaryStat: "fuelEfficiency",
        statBonus: 32,
        icon: "🌀",
        types: [
          { id: "warp_optimization", name: "Warp Optimization", description: "Maximum efficiency in FTL travel.", primaryStat: "fleetSpeed", icon: "🚀",
            subTypes: [
              { id: "jump_accuracy",  name: "Jump Accuracy",  description: "Pin-point warp destinations every time.",     bonusStat: "weaponAccuracy", bonusValue: 10, icon: "🎯" },
              { id: "fuel_compress",  name: "Fuel Compress",  description: "Compressed deuterium for efficient warps.",   bonusStat: "fuelEfficiency", bonusValue: 20, icon: "⛽" },
              { id: "micro_jump",     name: "Micro Jump",     description: "Combat micro-jumps for tactical advantage.",  bonusStat: "fleetSpeed",     bonusValue: 15, icon: "⚡" },
            ],
          },
          { id: "warp_weapons", name: "Warp Weapons", description: "Weapons that attack through warp space.", primaryStat: "attackPower", icon: "💥",
            subTypes: [
              { id: "warp_torpedo",   name: "Warp Torpedo",   description: "Torpedoes that travel through warp.",        bonusStat: "attackPower",   bonusValue: 16, icon: "🚀" },
              { id: "warp_cannon",    name: "Warp Cannon",    description: "Long-range weapon firing through warpspace.", bonusStat: "weaponAccuracy",bonusValue: 14, icon: "🔫" },
              { id: "phase_lance",    name: "Phase Lance",    description: "Bypasses shields by phasing through them.",  bonusStat: "criticalStrike", bonusValue: 12, icon: "⚡" },
            ],
          },
        ],
      },
      {
        id: "energy_researcher",
        name: "Energy Researcher",
        description: "Discovers and harnesses exotic energy sources.",
        specialty: "Exotic Energy",
        primaryStat: "resourceOutput",
        secondaryStat: "shieldStrength",
        statBonus: 28,
        icon: "⚡",
        types: [
          { id: "zero_point_energy", name: "Zero-Point Energy", description: "Energy from quantum vacuum fluctuations.", primaryStat: "resourceOutput", icon: "∞",
            subTypes: [
              { id: "vacuum_tap",    name: "Vacuum Tap",    description: "Taps infinite vacuum energy.",               bonusStat: "resourceOutput", bonusValue: 22, icon: "⚡" },
              { id: "quantum_cell",  name: "Quantum Cell",  description: "Compact quantum energy storage cells.",      bonusStat: "shieldStrength", bonusValue: 12, icon: "🔋" },
              { id: "free_energy",   name: "Free Energy",   description: "Reduces energy costs across all operations.", bonusStat: "constructionCost",bonusValue:-12,icon: "♾️" },
            ],
          },
          { id: "exotic_materials", name: "Exotic Materials", description: "Creating and using exotic matter.", primaryStat: "buildSpeed", icon: "💎",
            subTypes: [
              { id: "neutronium",    name: "Neutronium",    description: "Densest material known for armor.",          bonusStat: "defenseRating",  bonusValue: 16, icon: "⚫" },
              { id: "photon_armor",  name: "Photon Armor",  description: "Light-based armor reflecting energy.",       bonusStat: "shieldStrength", bonusValue: 14, icon: "🌟" },
              { id: "tachyon_drive", name: "Tachyon Drive", description: "FTL drive using faster-than-light particles.",bonusStat: "fleetSpeed",    bonusValue: 18, icon: "💫" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "quantum_leap",    name: "Quantum Leap",    description: "Teleports fleet anywhere in galaxy instantly (1 use/day).",     type: "active",  cooldown: 86400, unlockLevel: 10, effects: { fleetSpeed: 999 }, icon: "🌀", flavorText: "Every point in space is equally close to every other." },
      { id: "probability_calc",name: "Probability Calc",description: "Permanently increases critical strike by 10% due to pre-calc.", type: "passive", unlockLevel: 25, effects: { criticalStrike: 10 }, icon: "📊", flavorText: "If you know what's probable, you control what happens." },
      { id: "uncertainty",     name: "Uncertainty",     description: "Enemy weapon accuracy reduced by 20% when engaging you.",       type: "passive", unlockLevel: 45, effects: { evasion: 20 }, icon: "❓", flavorText: "The Uncertainty Principle: weaponized." },
      { id: "observer_effect", name: "Observer Effect", description: "Simply observing doubles enemy research theft chance.",         type: "passive", unlockLevel: 70, effects: { espionagePower: 30 }, icon: "👁️", flavorText: "The act of observing changes what is observed." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Quantum Leap (active)",       type: "ability" },
      { level: 25, reward: "Probability Calc (passive)",  type: "ability" },
      { level: 30, reward: "Title: Quantum Researcher",   type: "title" },
      { level: 45, reward: "Uncertainty (passive)",       type: "ability" },
      { level: 60, reward: "Quantum Seal (cosmetic)",     type: "cosmetic" },
      { level: 70, reward: "Observer Effect (passive)",   type: "ability" },
      { level: 80, reward: "Title: Quantum Master",       type: "title" },
      { level: 90, reward: "+20% Research Rate",          type: "stat" },
      { level: 95, reward: "Title: Uncertainty God",      type: "title" },
      { level: 100, reward: "Title: Quantum Eternal",     type: "title" },
    ],
  },

  // ── 11. TRADE BARON ───────────────────────────────────────
  {
    id: "trade_baron",
    name: "Trade Baron",
    domain: "Economy",
    tagline: "Every War Has A Price. I Set That Price.",
    description: "The Trade Baron controls the flow of commerce, manipulating markets across star systems to fund empires and cripple enemies.",
    lore: "They say war is expensive. Trade Barons know war is profitable — if you're the one supplying both sides.",
    icon: "💰",
    color: "#d97706",
    gradientFrom: "from-amber-950",
    gradientTo: "to-yellow-900",
    primaryStats: ["tradeBonus", "diplomacyRating", "resourceOutput"],
    secondaryStats: ["constructionCost", "colonyGrowth", "intelRange"],
    baseStats: { tradeBonus: 35, diplomacyRating: 20, resourceOutput: 18, constructionCost: -10, colonyGrowth: 8, intelRange: 12 },
    maxMasteryLevel: 100,
    xpPerLevel: 900,
    subClasses: [
      {
        id: "merchant_prince",
        name: "Merchant Prince",
        description: "Controls entire star system economies through market dominance.",
        specialty: "Market Control",
        primaryStat: "tradeBonus",
        secondaryStat: "diplomacyRating",
        statBonus: 40,
        icon: "👑",
        types: [
          { id: "market_domination", name: "Market Domination", description: "Controlling entire market sectors.", primaryStat: "tradeBonus", icon: "📊",
            subTypes: [
              { id: "price_setter",   name: "Price Setter",   description: "Sets prices that other traders must follow.", bonusStat: "tradeBonus",      bonusValue: 20, icon: "💲" },
              { id: "monopoly",       name: "Monopoly",       description: "Locks competitors out of key markets.",       bonusStat: "resourceOutput",  bonusValue: 15, icon: "🔒" },
              { id: "trade_cartel",   name: "Trade Cartel",   description: "Hidden cartel controlling multiple markets.", bonusStat: "espionagePower",  bonusValue: 10, icon: "🤝" },
            ],
          },
          { id: "luxury_trade", name: "Luxury Trade", description: "High-margin luxury goods trading.", primaryStat: "tradeBonus", icon: "💎",
            subTypes: [
              { id: "platinum_dealer",name: "Platinum Dealer", description: "Specializes in platinum-tier luxury goods.",bonusStat: "tradeBonus",      bonusValue: 22, icon: "💎" },
              { id: "connoisseur",    name: "Connoisseur",    description: "Expertise in rare and unique items.",        bonusStat: "diplomacyRating", bonusValue: 14, icon: "🍷" },
              { id: "art_collector",  name: "Art Collector",  description: "Collectibles and art as wealth stores.",     bonusStat: "morale",          bonusValue: 12, icon: "🖼️" },
            ],
          },
        ],
      },
      {
        id: "market_manipulator",
        name: "Market Manipulator",
        description: "Uses insider knowledge to profit from market swings.",
        specialty: "Market Intelligence",
        primaryStat: "intelRange",
        secondaryStat: "tradeBonus",
        statBonus: 32,
        icon: "📈",
        types: [
          { id: "futures_trading", name: "Futures Trading", description: "Trading on predicted future resource prices.", primaryStat: "tradeBonus", icon: "📈",
            subTypes: [
              { id: "crystal_futures",name: "Crystal Futures", description: "Speculation on crystal price movements.",   bonusStat: "tradeBonus",     bonusValue: 18, icon: "💎" },
              { id: "war_profiteer",  name: "War Profiteer",  description: "Profit from conflict and war demand.",       bonusStat: "tradeBonus",     bonusValue: 15, icon: "⚔️" },
              { id: "arbitrage",      name: "Arbitrage",      description: "Simultaneous buy/sell across star systems.", bonusStat: "fuelEfficiency", bonusValue: 10, icon: "🔄" },
            ],
          },
          { id: "market_crash", name: "Market Crash", description: "Deliberately crashing competitor markets.", primaryStat: "espionagePower", icon: "📉",
            subTypes: [
              { id: "short_seller",   name: "Short Seller",   description: "Profits when enemy markets collapse.",        bonusStat: "tradeBonus",      bonusValue: 16, icon: "📉" },
              { id: "dumping",        name: "Dumping",        description: "Floods enemy markets destroying their prices.",bonusStat: "espionagePower",  bonusValue: 12, icon: "🗑️" },
              { id: "panic_buying",   name: "Panic Buying",   description: "Triggers panic runs on key resources.",      bonusStat: "resourceOutput",  bonusValue: 10, icon: "😱" },
            ],
          },
        ],
      },
      {
        id: "trade_route_pioneer",
        name: "Trade Route Pioneer",
        description: "Discovers and dominates new inter-stellar trade routes.",
        specialty: "Trade Route Control",
        primaryStat: "fleetSpeed",
        secondaryStat: "tradeBonus",
        statBonus: 28,
        icon: "🗺️",
        types: [
          { id: "new_routes", name: "New Routes", description: "Pioneering new profitable trade paths.", primaryStat: "tradeBonus", icon: "🧭",
            subTypes: [
              { id: "scout_trader",   name: "Scout Trader",   description: "Finds shortest path between markets.",      bonusStat: "fleetSpeed",   bonusValue: 13, icon: "🗺️" },
              { id: "route_owner",    name: "Route Owner",    description: "Claims exclusive rights to discovered routes.",bonusStat: "tradeBonus",  bonusValue: 16, icon: "🔑" },
              { id: "toll_collector", name: "Toll Collector", description: "Charges other traders for route access.",   bonusStat: "tradeBonus",   bonusValue: 12, icon: "💰" },
            ],
          },
          { id: "convoy_master", name: "Convoy Master", description: "Managing massive trade convoys safely.", primaryStat: "shipCapacity", icon: "🚢",
            subTypes: [
              { id: "mega_convoy",    name: "Mega Convoy",    description: "Oversized cargo convoys moving en masse.",   bonusStat: "shipCapacity", bonusValue: 14, icon: "🚢" },
              { id: "escort_master",  name: "Escort Master",  description: "Armed escorts protecting cargo.",            bonusStat: "defenseRating",bonusValue: 10, icon: "🛡️" },
              { id: "fast_freight",   name: "Fast Freight",   description: "Speed-optimized cargo delivery.",            bonusStat: "fleetSpeed",   bonusValue: 12, icon: "⚡" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "market_control",  name: "Market Control",  description: "For 1 hour all your market transactions earn 50% more.",         type: "active",  cooldown: 7200, duration: 3600, unlockLevel: 10, effects: { tradeBonus: 50 }, icon: "📊", flavorText: "The market does what the Baron says." },
      { id: "trade_network",   name: "Trade Network",   description: "Permanently adds 3 additional trade routes.",                   type: "passive", unlockLevel: 25, effects: { tradeBonus: 15 }, icon: "🕸️", flavorText: "Every node in the network is profit." },
      { id: "golden_touch",    name: "Golden Touch",    description: "All resource sales generate 20% more gold permanently.",        type: "passive", unlockLevel: 50, effects: { tradeBonus: 20 }, icon: "✨", flavorText: "Everything the Baron touches turns to profit." },
      { id: "total_dominance", name: "Total Dominance", description: "For 30 minutes, your empire controls all market pricing.",     type: "active",  cooldown: 86400, duration: 1800, unlockLevel: 90, effects: { tradeBonus: 100 }, icon: "👑", flavorText: "The Baron's word IS the price." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Market Control (active)",   type: "ability" },
      { level: 25, reward: "Trade Network (passive)",   type: "ability" },
      { level: 30, reward: "Title: Merchant Prince",    type: "title" },
      { level: 50, reward: "Golden Touch (passive)",    type: "ability" },
      { level: 60, reward: "Gold Signet (cosmetic)",    type: "cosmetic" },
      { level: 70, reward: "Title: Trade Baron",        type: "title" },
      { level: 80, reward: "+30% Trade Bonus",          type: "stat" },
      { level: 90, reward: "Total Dominance (active)",  type: "ability" },
      { level: 95, reward: "Title: Market Lord",        type: "title" },
      { level: 100, reward: "Title: Trade Eternal",     type: "title" },
    ],
  },

  // ── 12. INDUSTRIAL MAGNATE ────────────────────────────────
  {
    id: "industrial_magnate",
    name: "Industrial Magnate",
    domain: "Economy",
    tagline: "The Empire That Outproduces Always Wins",
    description: "The Industrial Magnate builds production empires, churning out ships, buildings, and resources at unprecedented scale.",
    lore: "Wars are won in factories long before they are won on battlefields.",
    icon: "🏭",
    color: "#78350f",
    gradientFrom: "from-stone-950",
    gradientTo: "to-amber-950",
    primaryStats: ["resourceOutput", "buildSpeed", "constructionCost"],
    secondaryStats: ["shipCapacity", "colonyGrowth", "tradeBonus"],
    baseStats: { resourceOutput: 30, buildSpeed: 25, constructionCost: -18, shipCapacity: 12, colonyGrowth: 8, tradeBonus: 8 },
    maxMasteryLevel: 100,
    xpPerLevel: 900,
    subClasses: [
      {
        id: "factory_overseer",
        name: "Factory Overseer",
        description: "Maximizes output from manufacturing facilities.",
        specialty: "Manufacturing Output",
        primaryStat: "resourceOutput",
        secondaryStat: "buildSpeed",
        statBonus: 38,
        icon: "⚙️",
        types: [
          { id: "mass_production", name: "Mass Production", description: "Churning out products at maximum rate.", primaryStat: "resourceOutput", icon: "🏭",
            subTypes: [
              { id: "assembly_line",  name: "Assembly Line",  description: "Optimized assembly line production.",      bonusStat: "buildSpeed",     bonusValue: 20, icon: "🔩" },
              { id: "bulk_output",    name: "Bulk Output",    description: "Volume production reducing per-unit cost.", bonusStat: "constructionCost",bonusValue:-15,icon: "📦" },
              { id: "24_7_operation", name: "24/7 Operation", description: "Factories running without interruption.",  bonusStat: "resourceOutput", bonusValue: 18, icon: "⏰" },
            ],
          },
          { id: "quality_control", name: "Quality Control", description: "High-quality production reducing waste.", primaryStat: "constructionCost", icon: "✅",
            subTypes: [
              { id: "zero_defect",   name: "Zero Defect",   description: "Eliminates production failures and waste.",  bonusStat: "constructionCost",bonusValue:-12,icon: "✅" },
              { id: "precision_mfg", name: "Precision Mfg", description: "Precision components outlasting standard.",  bonusStat: "defenseRating",  bonusValue: 10, icon: "🎯" },
              { id: "iso_standards", name: "ISO Standards",  description: "Standardized production improving quality.", bonusStat: "tradeBonus",     bonusValue: 9,  icon: "📋" },
            ],
          },
        ],
      },
      {
        id: "supply_chain_master",
        name: "Supply Chain Master",
        description: "Keeps every factory fed with the right materials at the right time.",
        specialty: "Logistics Optimization",
        primaryStat: "constructionCost",
        secondaryStat: "resourceOutput",
        statBonus: 30,
        icon: "🔗",
        types: [
          { id: "just_in_time", name: "Just In Time", description: "Precise timing reduces storage costs.", primaryStat: "constructionCost", icon: "⏱️",
            subTypes: [
              { id: "lean_production",name: "Lean Production", description: "Eliminates all production inefficiency.", bonusStat: "constructionCost",bonusValue:-14,icon: "📉" },
              { id: "kanban",         name: "Kanban",          description: "Pull-based production meeting exact demand.",bonusStat: "buildSpeed",     bonusValue: 12, icon: "📌" },
              { id: "six_sigma",      name: "Six Sigma",       description: "Statistical process control.",             bonusStat: "resourceOutput", bonusValue: 10, icon: "📊" },
            ],
          },
          { id: "vertical_integration", name: "Vertical Integration", description: "Owning the entire production chain.", primaryStat: "resourceOutput", icon: "🔗",
            subTypes: [
              { id: "mine_to_market",  name: "Mine to Market",  description: "Controls from extraction to final sale.",  bonusStat: "tradeBonus",     bonusValue: 14, icon: "⛏️" },
              { id: "raw_to_refined",  name: "Raw to Refined",  description: "In-house refining of all raw materials.",  bonusStat: "resourceOutput", bonusValue: 15, icon: "🏭" },
              { id: "closed_loop",     name: "Closed Loop",     description: "Complete waste recycling.",                bonusStat: "constructionCost",bonusValue:-10,icon: "♻️" },
            ],
          },
        ],
      },
      {
        id: "raw_material_tycoon",
        name: "Raw Material Tycoon",
        description: "Controls vast raw material deposits and extraction operations.",
        specialty: "Resource Dominance",
        primaryStat: "resourceOutput",
        secondaryStat: "colonyGrowth",
        statBonus: 32,
        icon: "💎",
        types: [
          { id: "mineral_rights", name: "Mineral Rights", description: "Exclusive control over planetary minerals.", primaryStat: "resourceOutput", icon: "⛏️",
            subTypes: [
              { id: "deep_extraction",name: "Deep Extraction", description: "Mining deeper for higher-grade ores.",    bonusStat: "resourceOutput", bonusValue: 18, icon: "⛏️" },
              { id: "strip_mining",   name: "Strip Mining",   description: "Maximum extraction efficiency surface ops.",bonusStat: "resourceOutput", bonusValue: 15, icon: "🏔️" },
              { id: "asteroid_claim", name: "Asteroid Claim", description: "Claims high-yield asteroid belts.",        bonusStat: "shipCapacity",   bonusValue: 8,  icon: "☄️" },
            ],
          },
          { id: "resource_empire", name: "Resource Empire", description: "Building an empire around resource extraction.", primaryStat: "colonyGrowth", icon: "🌐",
            subTypes: [
              { id: "colony_miner",   name: "Colony Miner",   description: "Every colony optimized for extraction.",    bonusStat: "colonyGrowth",   bonusValue: 12, icon: "🌍" },
              { id: "extraction_net", name: "Extraction Net", description: "Network of extraction facilities.",         bonusStat: "resourceOutput", bonusValue: 14, icon: "🕸️" },
              { id: "monopolize",     name: "Monopolize",      description: "Controls all deposits of one resource.",   bonusStat: "tradeBonus",     bonusValue: 12, icon: "🔒" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "overdrive",       name: "Overdrive",        description: "All factories produce 3× output for 30 minutes.",               type: "active",  cooldown: 7200, duration: 1800, unlockLevel: 10, effects: { resourceOutput: 200 }, icon: "🏭", flavorText: "Push every machine past its rated limit." },
      { id: "cost_optimizer",  name: "Cost Optimizer",   description: "Permanently reduces construction costs by 8%.",                type: "passive", unlockLevel: 20, effects: { constructionCost: -8 }, icon: "💰", flavorText: "Efficiency is a weapon." },
      { id: "industrial_boom", name: "Industrial Boom",  description: "Grants +25% resource output for each owned factory.",          type: "passive", unlockLevel: 50, effects: { resourceOutput: 25 }, icon: "💥", flavorText: "Scale is its own advantage." },
      { id: "titan_factory",   name: "Titan Factory",    description: "Constructs a Titan Factory — produces 10× normal output.",     type: "active",  cooldown: 86400, unlockLevel: 90, effects: { resourceOutput: 900 }, icon: "🏗️", flavorText: "The greatest factory ever built." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Overdrive (active)",          type: "ability" },
      { level: 20, reward: "Cost Optimizer (passive)",    type: "ability" },
      { level: 30, reward: "Title: Factory Owner",        type: "title" },
      { level: 50, reward: "Industrial Boom (passive)",   type: "ability" },
      { level: 60, reward: "Factory Badge (cosmetic)",    type: "cosmetic" },
      { level: 70, reward: "Title: Industrial Magnate",   type: "title" },
      { level: 80, reward: "+20% Resource Output",        type: "stat" },
      { level: 90, reward: "Titan Factory (active)",      type: "ability" },
      { level: 95, reward: "Title: Production King",      type: "title" },
      { level: 100, reward: "Title: Industry Eternal",    type: "title" },
    ],
  },

  // ── 13. MINING OVERLORD ───────────────────────────────────
  {
    id: "mining_overlord",
    name: "Mining Overlord",
    domain: "Economy",
    tagline: "Every Rock Hides a Fortune",
    description: "The Mining Overlord extracts every last gram of metal, crystal, and deuterium from the galaxy's richest deposits.",
    lore: "Before anyone can build or fight, someone must dig. The Mining Overlord digs more than anyone.",
    icon: "⛏️",
    color: "#57534e",
    gradientFrom: "from-stone-950",
    gradientTo: "to-slate-900",
    primaryStats: ["resourceOutput", "constructionCost", "buildSpeed"],
    secondaryStats: ["colonyGrowth", "fleetSpeed", "fuelEfficiency"],
    baseStats: { resourceOutput: 38, constructionCost: -15, buildSpeed: 18, colonyGrowth: 8, fleetSpeed: 8, fuelEfficiency: 12 },
    maxMasteryLevel: 100,
    xpPerLevel: 850,
    subClasses: [
      {
        id: "deep_core_miner",
        name: "Deep Core Miner",
        description: "Extracts resources from the deepest and most dangerous deposits.",
        specialty: "Deep Core Mining",
        primaryStat: "resourceOutput",
        secondaryStat: "defenseRating",
        statBonus: 42,
        icon: "🔮",
        types: [
          { id: "metal_extraction", name: "Metal Extraction", description: "Maximum metal ore extraction.", primaryStat: "resourceOutput", icon: "🔩",
            subTypes: [
              { id: "ore_enrichment", name: "Ore Enrichment",  description: "Enriches low-grade ore to high-grade.",    bonusStat: "resourceOutput", bonusValue: 20, icon: "⬆️" },
              { id: "vein_scanner",   name: "Vein Scanner",    description: "Detects hidden metal veins accurately.",   bonusStat: "intelRange",     bonusValue: 12, icon: "📡" },
              { id: "drill_master",   name: "Drill Master",    description: "High-speed drilling operations.",          bonusStat: "buildSpeed",     bonusValue: 15, icon: "🔩" },
            ],
          },
          { id: "crystal_mining", name: "Crystal Mining", description: "Extraction and processing of crystal resources.", primaryStat: "tradeBonus", icon: "💎",
            subTypes: [
              { id: "crystal_cutter",name: "Crystal Cutter", description: "Precision cutting maximizing crystal yield.", bonusStat: "resourceOutput", bonusValue: 18, icon: "💎" },
              { id: "crystal_purify",name: "Crystal Purify",  description: "Purification raising crystal quality.",     bonusStat: "tradeBonus",     bonusValue: 12, icon: "✨" },
              { id: "rare_crystal",  name: "Rare Crystal",   description: "Finds rare crystal formations.",            bonusStat: "tradeBonus",     bonusValue: 14, icon: "🔷" },
            ],
          },
        ],
      },
      {
        id: "asteroid_harvester",
        name: "Asteroid Harvester",
        description: "Commands fleets harvesting entire asteroid belts.",
        specialty: "Asteroid Belt Mining",
        primaryStat: "shipCapacity",
        secondaryStat: "resourceOutput",
        statBonus: 32,
        icon: "☄️",
        types: [
          { id: "belt_mining", name: "Belt Mining", description: "Systematic extraction from asteroid belts.", primaryStat: "resourceOutput", icon: "☄️",
            subTypes: [
              { id: "belt_mapper",    name: "Belt Mapper",    description: "Maps entire belts identifying richest rocks.", bonusStat: "intelRange",    bonusValue: 14, icon: "🗺️" },
              { id: "mass_harvester", name: "Mass Harvester", description: "Fleet-scale harvesting operations.",           bonusStat: "shipCapacity",  bonusValue: 12, icon: "🚀" },
              { id: "capture_net",    name: "Capture Net",    description: "Giant nets capturing multiple asteroids.",     bonusStat: "resourceOutput",bonusValue: 18, icon: "🕸️" },
            ],
          },
          { id: "mining_ships", name: "Mining Ships", description: "Specialized mining vessel operations.", primaryStat: "shipCapacity", icon: "⛏️",
            subTypes: [
              { id: "mining_barge",   name: "Mining Barge",   description: "Massive barges hauling maximum ore.",          bonusStat: "shipCapacity",  bonusValue: 15, icon: "🚢" },
              { id: "ore_processor",  name: "Ore Processor",  description: "Ships that process ore during transit.",       bonusStat: "resourceOutput",bonusValue: 14, icon: "⚙️" },
              { id: "escort_duty",    name: "Escort Duty",    description: "Protected convoys for valuable cargo.",        bonusStat: "defenseRating", bonusValue: 10, icon: "🛡️" },
            ],
          },
        ],
      },
      {
        id: "planetary_extractor",
        name: "Planetary Extractor",
        description: "Extracts resources at a planetary scale, stripping entire worlds.",
        specialty: "Planetary Scale Extraction",
        primaryStat: "resourceOutput",
        secondaryStat: "constructionCost",
        statBonus: 35,
        icon: "🌍",
        types: [
          { id: "core_tap", name: "Core Tap", description: "Tapping directly into planetary cores for energy.", primaryStat: "resourceOutput", icon: "🔥",
            subTypes: [
              { id: "geothermal",    name: "Geothermal",    description: "Geothermal energy from planetary core.",     bonusStat: "resourceOutput", bonusValue: 16, icon: "♨️" },
              { id: "magma_mining",  name: "Magma Mining",  description: "Rare minerals from volcanic zones.",        bonusStat: "tradeBonus",     bonusValue: 12, icon: "🌋" },
              { id: "core_drill",    name: "Core Drill",    description: "Deepest possible planetary drilling.",      bonusStat: "resourceOutput", bonusValue: 20, icon: "🔩" },
            ],
          },
          { id: "gas_harvesting", name: "Gas Harvesting", description: "Deuterium extraction from gas giants.", primaryStat: "fuelEfficiency", icon: "☁️",
            subTypes: [
              { id: "gas_skimmer",    name: "Gas Skimmer",    description: "Fleet skimming gas giant atmospheres.",   bonusStat: "fuelEfficiency", bonusValue: 18, icon: "💨" },
              { id: "deut_processor", name: "Deut Processor",  description: "High-yield deuterium processing.",       bonusStat: "resourceOutput", bonusValue: 15, icon: "⚗️" },
              { id: "gas_station",    name: "Gas Station",    description: "Mobile refueling stations in gas orbit.", bonusStat: "fleetSpeed",     bonusValue: 10, icon: "⛽" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "mother_lode",    name: "Mother Lode",     description: "Discovers a hidden deposit — +500% resources for 1 hour.",      type: "active",  cooldown: 86400, duration: 3600, unlockLevel: 10, effects: { resourceOutput: 500 }, icon: "💎", flavorText: "Every miner dreams of finding the big one." },
      { id: "deep_scan",      name: "Deep Scan",       description: "Permanently reveals all hidden deposits in current system.",    type: "passive", unlockLevel: 20, effects: { intelRange: 20 }, icon: "📡", flavorText: "Nothing hides from the Overlord's sensors." },
      { id: "efficiency_ops", name: "Efficiency Ops",  description: "Permanently reduces mining operation costs by 12%.",           type: "passive", unlockLevel: 40, effects: { constructionCost: -12 }, icon: "⚙️", flavorText: "A well-run mine wastes nothing." },
      { id: "strip_world",    name: "Strip World",     description: "Extracts all resources from a planet in 24 hours (irreversible).",type: "active", cooldown: 604800, unlockLevel: 90, effects: { resourceOutput: 1000 }, icon: "🌍", flavorText: "Nothing but bedrock remains." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Mother Lode (active)",     type: "ability" },
      { level: 20, reward: "Deep Scan (passive)",      type: "ability" },
      { level: 30, reward: "Title: Mine Foreman",      type: "title" },
      { level: 40, reward: "Efficiency Ops (passive)", type: "ability" },
      { level: 60, reward: "Pickaxe Badge (cosmetic)", type: "cosmetic" },
      { level: 70, reward: "Title: Mining Overlord",   type: "title" },
      { level: 80, reward: "+25% Resource Output",     type: "stat" },
      { level: 90, reward: "Strip World (active)",     type: "ability" },
      { level: 95, reward: "Title: Resource King",     type: "title" },
      { level: 100, reward: "Title: Mining Eternal",   type: "title" },
    ],
  },

  // ── 14. FINANCE ARCHITECT ─────────────────────────────────
  {
    id: "finance_architect",
    name: "Finance Architect",
    domain: "Economy",
    tagline: "The True Battlefield Is The Ledger",
    description: "The Finance Architect designs galactic economies, banking systems, and currency flows that fund entire civilizations.",
    lore: "Armies need payroll. Ships need fuel. Empires need credit. The Finance Architect provides all three.",
    icon: "🏦",
    color: "#b45309",
    gradientFrom: "from-yellow-950",
    gradientTo: "to-amber-900",
    primaryStats: ["tradeBonus", "constructionCost", "colonyGrowth"],
    secondaryStats: ["diplomacyRating", "resourceOutput", "buildSpeed"],
    baseStats: { tradeBonus: 28, constructionCost: -22, colonyGrowth: 12, diplomacyRating: 15, resourceOutput: 10, buildSpeed: 8 },
    maxMasteryLevel: 100,
    xpPerLevel: 880,
    subClasses: [
      {
        id: "investment_banker",
        name: "Investment Banker",
        description: "Grows wealth through strategic galactic investments.",
        specialty: "Compound Interest",
        primaryStat: "tradeBonus",
        secondaryStat: "constructionCost",
        statBonus: 35,
        icon: "📈",
        types: [
          { id: "compound_interest", name: "Compound Interest", description: "Exponential wealth growth through interest.", primaryStat: "tradeBonus", icon: "💹",
            subTypes: [
              { id: "savings_empire",  name: "Savings Empire",  description: "Massive interest-bearing empire savings.", bonusStat: "tradeBonus",   bonusValue: 20, icon: "🏦" },
              { id: "venture_capital", name: "Venture Capital", description: "High-risk investments with huge returns.",  bonusStat: "tradeBonus",   bonusValue: 16, icon: "🎲" },
              { id: "bond_market",     name: "Bond Market",     description: "Stable bond issuance funding empire ops.", bonusStat: "constructionCost",bonusValue:-12,icon: "📜" },
            ],
          },
          { id: "portfolio_management", name: "Portfolio Mgmt", description: "Diversified investment across asset classes.", primaryStat: "constructionCost", icon: "💼",
            subTypes: [
              { id: "diversify",       name: "Diversify",       description: "Risk-balanced portfolio for stability.",    bonusStat: "constructionCost",bonusValue:-14,icon: "🔀" },
              { id: "index_fund",      name: "Index Fund",      description: "Tracks overall galactic economic growth.", bonusStat: "tradeBonus",     bonusValue: 14, icon: "📊" },
              { id: "hedge_fund",      name: "Hedge Fund",      description: "Protects against economic downturns.",      bonusStat: "defenseRating",  bonusValue: 8,  icon: "🛡️" },
            ],
          },
        ],
      },
      {
        id: "currency_trader",
        name: "Currency Trader",
        description: "Profits from inter-currency exchange across the galaxy.",
        specialty: "Currency Exchange",
        primaryStat: "tradeBonus",
        secondaryStat: "intelRange",
        statBonus: 30,
        icon: "💱",
        types: [
          { id: "forex_master", name: "Forex Master", description: "Expert foreign exchange between currency types.", primaryStat: "tradeBonus", icon: "💱",
            subTypes: [
              { id: "silver_gold_arb", name: "Silver-Gold Arb",  description: "Arbitrage between silver and gold rates.",  bonusStat: "tradeBonus",   bonusValue: 16, icon: "🥇" },
              { id: "platinum_play",   name: "Platinum Play",    description: "High-value platinum currency operations.",  bonusStat: "tradeBonus",   bonusValue: 20, icon: "💎" },
              { id: "conversion_rate", name: "Conversion Rate",  description: "Better exchange rates for all conversions.",bonusStat: "tradeBonus",   bonusValue: 12, icon: "🔄" },
            ],
          },
          { id: "inflation_control", name: "Inflation Control", description: "Managing currency supply to prevent inflation.", primaryStat: "colonyGrowth", icon: "📉",
            subTypes: [
              { id: "monetary_policy", name: "Monetary Policy", description: "Tight control over money supply.",            bonusStat: "colonyGrowth",bonusValue: 12, icon: "🏦" },
              { id: "hard_currency",   name: "Hard Currency",   description: "Resource-backed currency for stability.",     bonusStat: "tradeBonus",  bonusValue: 10, icon: "🪙" },
              { id: "quantitative_ea", name: "Quantitative Ease",description: "Controlled money printing for growth.",     bonusStat: "buildSpeed",  bonusValue: 10, icon: "🖨️" },
            ],
          },
        ],
      },
      {
        id: "asset_manager",
        name: "Asset Manager",
        description: "Manages vast portfolios of galactic assets and infrastructure.",
        specialty: "Asset Portfolio",
        primaryStat: "constructionCost",
        secondaryStat: "buildSpeed",
        statBonus: 28,
        icon: "🏛️",
        types: [
          { id: "real_estate", name: "Real Estate", description: "Planetary property and infrastructure ownership.", primaryStat: "colonyGrowth", icon: "🏙️",
            subTypes: [
              { id: "prime_location",  name: "Prime Location",  description: "Owns the best strategic planet locations.",bonusStat: "colonyGrowth",   bonusValue: 14, icon: "📍" },
              { id: "dev_rights",      name: "Dev Rights",      description: "Development rights across star systems.",  bonusStat: "buildSpeed",      bonusValue: 12, icon: "🏗️" },
              { id: "rent_empire",     name: "Rent Empire",     description: "Collecting rent from tenant factions.",    bonusStat: "tradeBonus",      bonusValue: 14, icon: "🏠" },
            ],
          },
          { id: "strategic_reserves", name: "Strategic Reserves", description: "Massive resource reserves for market control.", primaryStat: "resourceOutput", icon: "🏦",
            subTypes: [
              { id: "metal_reserve",  name: "Metal Reserve",  description: "Strategic metal stockpiles.",              bonusStat: "resourceOutput", bonusValue: 14, icon: "🔩" },
              { id: "crystal_vault",  name: "Crystal Vault",  description: "Crystal vaults worth entire economies.",   bonusStat: "tradeBonus",     bonusValue: 12, icon: "💎" },
              { id: "deut_depot",     name: "Deut Depot",     description: "Fuel reserves for strategic flexibility.", bonusStat: "fuelEfficiency", bonusValue: 12, icon: "⛽" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "bailout",        name: "Bailout",          description: "Instantly refunds 50% of all costs spent in last hour.",         type: "active",  cooldown: 86400, unlockLevel: 10, effects: { constructionCost: -50 }, icon: "🏦", flavorText: "Too big to fail means never failing." },
      { id: "interest_rate",  name: "Interest Rate",    description: "Permanently earns 5% interest on all stored currency/day.",     type: "passive", unlockLevel: 20, effects: { tradeBonus: 5 }, icon: "📈", flavorText: "Money makes money." },
      { id: "quantitative_e", name: "Quantitative Ease",description: "Prints currency — +100% all production for 15 minutes.",       type: "active",  cooldown: 14400, duration: 900, unlockLevel: 50, effects: { resourceOutput: 100 }, icon: "🖨️", flavorText: "Controlled inflation serves growth." },
      { id: "economic_empire",name: "Economic Empire",  description: "Entire economy grows 30% permanently at mastery 100.",         type: "passive", unlockLevel: 100, effects: { tradeBonus: 30, resourceOutput: 15, constructionCost: -10 }, icon: "🌐", flavorText: "The economy of a galaxy, in one hand." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Bailout (active)",           type: "ability" },
      { level: 20, reward: "Interest Rate (passive)",    type: "ability" },
      { level: 30, reward: "Title: Portfolio Manager",   type: "title" },
      { level: 50, reward: "Quantitative Ease (active)", type: "ability" },
      { level: 60, reward: "Gold Ledger (cosmetic)",     type: "cosmetic" },
      { level: 70, reward: "Title: Finance Director",    type: "title" },
      { level: 80, reward: "-25% Construction Cost",    type: "stat" },
      { level: 90, reward: "+20% Trade Bonus",           type: "stat" },
      { level: 100, reward: "Economic Empire (passive)", type: "ability" },
    ],
  },

  // ── 15. GRAND DIPLOMAT ────────────────────────────────────
  {
    id: "grand_diplomat",
    name: "Grand Diplomat",
    domain: "Leadership",
    tagline: "Peace Is Just War By Other Means",
    description: "The Grand Diplomat builds alliance networks, negotiates favorable treaties, and turns potential enemies into loyal partners.",
    lore: "A skilled diplomat prevented more wars in an afternoon than a fleet admiral could win in a lifetime.",
    icon: "🤝",
    color: "#0d9488",
    gradientFrom: "from-teal-950",
    gradientTo: "to-emerald-900",
    primaryStats: ["diplomacyRating", "tradeBonus", "leadershipRadius"],
    secondaryStats: ["morale", "intelRange", "colonyGrowth"],
    baseStats: { diplomacyRating: 38, tradeBonus: 18, leadershipRadius: 22, morale: 18, intelRange: 15, colonyGrowth: 10 },
    maxMasteryLevel: 100,
    xpPerLevel: 920,
    subClasses: [
      {
        id: "ambassador",
        name: "Ambassador",
        description: "Formal representatives to major galactic powers.",
        specialty: "Alliance Building",
        primaryStat: "diplomacyRating",
        secondaryStat: "tradeBonus",
        statBonus: 40,
        icon: "🎩",
        types: [
          { id: "alliance_broker", name: "Alliance Broker", description: "Building and maintaining military alliances.", primaryStat: "diplomacyRating", icon: "🤝",
            subTypes: [
              { id: "mutual_defense",  name: "Mutual Defense", description: "Mutual defense pacts reducing aggression.",  bonusStat: "defenseRating",  bonusValue: 12, icon: "🛡️" },
              { id: "trade_alliance",  name: "Trade Alliance", description: "Economic cooperation for mutual benefit.",   bonusStat: "tradeBonus",     bonusValue: 16, icon: "💰" },
              { id: "grand_coalition", name: "Grand Coalition", description: "Multi-faction alliance led by the diplomat.", bonusStat: "leadershipRadius",bonusValue:15, icon: "🌐" },
            ],
          },
          { id: "peacekeeping", name: "Peacekeeping", description: "Ending conflicts and maintaining galactic peace.", primaryStat: "morale", icon: "🕊️",
            subTypes: [
              { id: "ceasefire",    name: "Ceasefire",    description: "Negotiating temporary ceasefires.",             bonusStat: "morale",         bonusValue: 14, icon: "🤚" },
              { id: "peace_treaty", name: "Peace Treaty", description: "Formal peace treaties providing long-term safety.",bonusStat: "diplomacyRating",bonusValue: 16, icon: "📜" },
              { id: "un_mandate",   name: "UN Mandate",   description: "Galactic mandate protecting from aggression.",  bonusStat: "defenseRating",  bonusValue: 14, icon: "🌍" },
            ],
          },
        ],
      },
      {
        id: "peace_broker",
        name: "Peace Broker",
        description: "Specialist in ending conflicts and mediating disputes.",
        specialty: "Conflict Resolution",
        primaryStat: "morale",
        secondaryStat: "diplomacyRating",
        statBonus: 32,
        icon: "🕊️",
        types: [
          { id: "mediation", name: "Mediation", description: "Neutral mediation of galactic disputes.", primaryStat: "diplomacyRating", icon: "⚖️",
            subTypes: [
              { id: "neutral_ground",  name: "Neutral Ground",  description: "Creates neutral meeting zones.",           bonusStat: "morale",         bonusValue: 12, icon: "🏳️" },
              { id: "shuttle_diplo",   name: "Shuttle Diplomacy",description: "Active back-and-forth negotiation.",      bonusStat: "diplomacyRating",bonusValue: 14, icon: "🚀" },
              { id: "deal_sweetener",  name: "Deal Sweetener",  description: "Extra incentives breaking stalemates.",    bonusStat: "tradeBonus",     bonusValue: 12, icon: "🍬" },
            ],
          },
          { id: "soft_power", name: "Soft Power", description: "Influencing others without force or coercion.", primaryStat: "leadershipRadius", icon: "💭",
            subTypes: [
              { id: "culture_spread",  name: "Culture Spread",  description: "Spreading empire culture for influence.",  bonusStat: "colonyGrowth",   bonusValue: 12, icon: "🎭" },
              { id: "aid_mission",     name: "Aid Mission",     description: "Providing aid building goodwill.",         bonusStat: "diplomacyRating",bonusValue: 14, icon: "❤️" },
              { id: "public_opinion",  name: "Public Opinion",  description: "Managing galactic public perception.",     bonusStat: "morale",         bonusValue: 14, icon: "📢" },
            ],
          },
        ],
      },
      {
        id: "treaty_specialist",
        name: "Treaty Specialist",
        description: "Expert in crafting treaties that maximize long-term advantage.",
        specialty: "Treaty Negotiation",
        primaryStat: "tradeBonus",
        secondaryStat: "constructionCost",
        statBonus: 28,
        icon: "📜",
        types: [
          { id: "economic_treaties", name: "Economic Treaties", description: "Trade and economic cooperation agreements.", primaryStat: "tradeBonus", icon: "💰",
            subTypes: [
              { id: "free_trade",   name: "Free Trade Zone",  description: "Zero tariff zones boosting commerce.",     bonusStat: "tradeBonus",      bonusValue: 18, icon: "🌐" },
              { id: "customs_union",name: "Customs Union",    description: "Shared customs reducing trade barriers.",   bonusStat: "constructionCost",bonusValue:-10,icon: "🔓" },
              { id: "econ_bloc",    name: "Economic Bloc",   description: "Multi-faction economic cooperation.",       bonusStat: "tradeBonus",      bonusValue: 14, icon: "🤝" },
            ],
          },
          { id: "military_treaties", name: "Military Treaties", description: "Defense pacts and military cooperation.", primaryStat: "defenseRating", icon: "⚔️",
            subTypes: [
              { id: "nonaggression", name: "Non-Aggression", description: "Pacts preventing warfare between signers.",  bonusStat: "defenseRating",   bonusValue: 10, icon: "✋" },
              { id: "joint_ops",     name: "Joint Ops",      description: "Coordinated military operations.",           bonusStat: "attackPower",     bonusValue: 10, icon: "⚔️" },
              { id: "intel_share",   name: "Intel Sharing",  description: "Mutual intelligence sharing agreements.",    bonusStat: "intelRange",      bonusValue: 14, icon: "📡" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "diplomatic_immunity", name: "Diplomatic Immunity",description: "Prevents any attack on your empire for 1 hour.",                 type: "active",  cooldown: 86400, duration: 3600, unlockLevel: 10, effects: { defenseRating: 100 }, icon: "🛡️", flavorText: "Protected by the word of a thousand nations." },
      { id: "goodwill",            name: "Goodwill",            description: "Permanently improves relations with all factions by 20%.",    type: "passive", unlockLevel: 25, effects: { diplomacyRating: 20 }, icon: "💚", flavorText: "Goodwill is currency that never depreciates." },
      { id: "pax_imperium",        name: "Pax Imperium",        description: "Your empire is seen as the peacekeeper — no wars for 24h.", type: "active",  cooldown: 604800, duration: 86400, unlockLevel: 60, effects: { morale: 50 }, icon: "☮️", flavorText: "The peace of an empire." },
      { id: "galactic_council",    name: "Galactic Council",    description: "Creates galactic council — you vote on all conflicts.",       type: "passive", unlockLevel: 90, effects: { leadershipRadius: 50, diplomacyRating: 30 }, icon: "🌐", flavorText: "When you control the table, you control the outcome." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Diplomatic Immunity (active)", type: "ability" },
      { level: 25, reward: "Goodwill (passive)",           type: "ability" },
      { level: 30, reward: "Title: Ambassador",            type: "title" },
      { level: 60, reward: "Pax Imperium (active)",        type: "ability" },
      { level: 70, reward: "Diplomat's Seal (cosmetic)",   type: "cosmetic" },
      { level: 80, reward: "Title: Grand Diplomat",        type: "title" },
      { level: 90, reward: "Galactic Council (passive)",   type: "ability" },
      { level: 95, reward: "+30% Diplomacy Rating",        type: "stat" },
      { level: 98, reward: "Title: Peacekeeper Eternal",   type: "title" },
      { level: 100, reward: "Title: Galactic Arbiter",     type: "title" },
    ],
  },

  // ── 16. SHADOW LORD ───────────────────────────────────────
  {
    id: "shadow_lord",
    name: "Shadow Lord",
    domain: "Leadership",
    tagline: "Power Is Knowing What Others Don't",
    description: "The Shadow Lord runs galaxy-spanning intelligence networks, pulling strings from the darkness while others fight in the light.",
    lore: "The greatest victories are the ones no one knows happened.",
    icon: "🌑",
    color: "#312e81",
    gradientFrom: "from-indigo-950",
    gradientTo: "to-violet-950",
    primaryStats: ["espionagePower", "intelRange", "leadershipRadius"],
    secondaryStats: ["evasion", "tradeBonus", "criticalStrike"],
    baseStats: { espionagePower: 40, intelRange: 30, leadershipRadius: 18, evasion: 15, tradeBonus: 10, criticalStrike: 12 },
    maxMasteryLevel: 100,
    xpPerLevel: 1050,
    subClasses: [
      {
        id: "spymaster",
        name: "Spymaster",
        description: "Controls the galaxy's most extensive spy networks.",
        specialty: "Intelligence Networks",
        primaryStat: "espionagePower",
        secondaryStat: "intelRange",
        statBonus: 45,
        icon: "🕵️",
        types: [
          { id: "global_network", name: "Global Network", description: "Intel from every corner of the galaxy.", primaryStat: "intelRange", icon: "🕸️",
            subTypes: [
              { id: "asset_embedded", name: "Assets Embedded",  description: "Spies in every major faction.",           bonusStat: "intelRange",     bonusValue: 20, icon: "👤" },
              { id: "signal_intel",   name: "Signal Intel",    description: "Intercepts all encrypted communications.", bonusStat: "intelRange",     bonusValue: 15, icon: "📡" },
              { id: "human_intel",    name: "Human Intel",     description: "Trusted informants with deep access.",     bonusStat: "espionagePower", bonusValue: 16, icon: "🗣️" },
            ],
          },
          { id: "counter_intel", name: "Counter Intel", description: "Protecting your empire from enemy spies.", primaryStat: "defenseRating", icon: "🔒",
            subTypes: [
              { id: "mole_hunt",      name: "Mole Hunt",      description: "Identifies and removes planted spies.",     bonusStat: "espionagePower", bonusValue: 14, icon: "🔍" },
              { id: "disinformation", name: "Disinformation",  description: "Feeds false intelligence to enemies.",      bonusStat: "espionagePower", bonusValue: 18, icon: "📰" },
              { id: "cipher_master",  name: "Cipher Master",  description: "Unbreakable encryption for communications.", bonusStat: "defenseRating",  bonusValue: 12, icon: "🔐" },
            ],
          },
        ],
      },
      {
        id: "counter_intel_chief",
        name: "Counter Intelligence Chief",
        description: "Protects empire secrets while exposing enemy operations.",
        specialty: "Counterespionage",
        primaryStat: "defenseRating",
        secondaryStat: "espionagePower",
        statBonus: 32,
        icon: "🔒",
        types: [
          { id: "security_ops", name: "Security Ops", description: "Physical and digital security operations.", primaryStat: "defenseRating", icon: "🔐",
            subTypes: [
              { id: "hardened_comms",  name: "Hardened Comms",  description: "Communications secured against all threats.",bonusStat: "defenseRating",  bonusValue: 14, icon: "📡" },
              { id: "security_detail", name: "Security Detail",  description: "Personal protective service for key assets.",bonusStat: "defenseRating",  bonusValue: 12, icon: "🛡️" },
              { id: "air_gap",         name: "Air Gap",          description: "Critical systems physically isolated.",     bonusStat: "espionagePower", bonusValue: 10, icon: "✂️" },
            ],
          },
          { id: "double_crossing", name: "Double Crossing", description: "Turning enemy agents into double agents.", primaryStat: "espionagePower", icon: "🔀",
            subTypes: [
              { id: "turned_asset",   name: "Turned Asset",   description: "Enemy spies working for you now.",          bonusStat: "espionagePower", bonusValue: 18, icon: "🔄" },
              { id: "triple_cross",   name: "Triple Cross",   description: "Layers of deception completely confusing enemy.",bonusStat: "intelRange",  bonusValue: 14, icon: "❓" },
              { id: "false_flag",     name: "False Flag",     description: "Operations disguised as enemy actions.",     bonusStat: "criticalStrike", bonusValue: 10, icon: "🏴" },
            ],
          },
        ],
      },
      {
        id: "covert_operative",
        name: "Covert Operative",
        description: "Direct field operations and high-risk covert missions.",
        specialty: "Field Operations",
        primaryStat: "evasion",
        secondaryStat: "criticalStrike",
        statBonus: 30,
        icon: "🎭",
        types: [
          { id: "black_ops", name: "Black Ops", description: "Highly classified direct action operations.", primaryStat: "espionagePower", icon: "⬛",
            subTypes: [
              { id: "deniable_op",   name: "Deniable Op",   description: "Operations with no paper trail.",            bonusStat: "evasion",        bonusValue: 16, icon: "👻" },
              { id: "extraction",    name: "Extraction",    description: "High-value target rescue operations.",       bonusStat: "fleetSpeed",     bonusValue: 12, icon: "🚁" },
              { id: "wet_work",      name: "Wet Work",      description: "Lethal direct action against key targets.",  bonusStat: "criticalStrike", bonusValue: 15, icon: "🗡️" },
            ],
          },
          { id: "cyber_warfare", name: "Cyber Warfare", description: "Digital attacks on enemy infrastructure.", primaryStat: "intelRange", icon: "💻",
            subTypes: [
              { id: "system_hack",   name: "System Hack",   description: "Penetrates enemy command systems.",          bonusStat: "intelRange",     bonusValue: 18, icon: "💻" },
              { id: "logic_bomb",    name: "Logic Bomb",    description: "Hidden code that activates on command.",     bonusStat: "espionagePower", bonusValue: 16, icon: "💣" },
              { id: "ransomware",    name: "Ransomware",    description: "Locks enemy production for ransom.",         bonusStat: "tradeBonus",     bonusValue: 12, icon: "🔒" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "shadow_network2",  name: "Shadow Network",   description: "All enemy moves revealed for 2 hours.",                        type: "active",  cooldown: 14400, duration: 7200, unlockLevel: 10, effects: { intelRange: 200 }, icon: "🕸️", flavorText: "The Shadow Lord sees everything." },
      { id: "invisible_hand",   name: "Invisible Hand",   description: "Permanently increases espionage success rate by 15%.",        type: "passive", unlockLevel: 25, effects: { espionagePower: 15 }, icon: "👁️", flavorText: "They never knew it was us." },
      { id: "orchestrate",      name: "Orchestrate",      description: "Triggers a manufactured crisis in enemy empire.",              type: "active",  cooldown: 86400, unlockLevel: 50, effects: { morale: 40 }, icon: "🎭", flavorText: "I didn't start the fire. I merely provided the spark." },
      { id: "total_information",name: "Total Information",description: "See ALL enemy stats, resources, and plans permanently.",     type: "passive", unlockLevel: 90, effects: { intelRange: 100, espionagePower: 30 }, icon: "🌐", flavorText: "Knowledge is power. Total knowledge is total power." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Shadow Network (active)",      type: "ability" },
      { level: 25, reward: "Invisible Hand (passive)",     type: "ability" },
      { level: 30, reward: "Title: Shadow Agent",          type: "title" },
      { level: 50, reward: "Orchestrate (active)",         type: "ability" },
      { level: 60, reward: "Shadow Cloak (cosmetic)",      type: "cosmetic" },
      { level: 70, reward: "Title: Spymaster General",     type: "title" },
      { level: 80, reward: "+25% Espionage Power",         type: "stat" },
      { level: 90, reward: "Total Information (passive)",  type: "ability" },
      { level: 95, reward: "Title: Lord of Shadows",       type: "title" },
      { level: 100, reward: "Title: Eternal Darkness",     type: "title" },
    ],
  },

  // ── 17. COLONIAL GOVERNOR ─────────────────────────────────
  {
    id: "colonial_governor",
    name: "Colonial Governor",
    domain: "Leadership",
    tagline: "Every Planet, A Nation. Every Nation, An Empire.",
    description: "The Colonial Governor transforms barren worlds into thriving civilizations, managing populations and productivity across star systems.",
    lore: "Every great empire stands on the backs of its colonies. The Governor makes sure those colonies stand tall.",
    icon: "🏛️",
    color: "#0f766e",
    gradientFrom: "from-teal-950",
    gradientTo: "to-cyan-950",
    primaryStats: ["colonyGrowth", "leadershipRadius", "resourceOutput"],
    secondaryStats: ["buildSpeed", "morale", "diplomacyRating"],
    baseStats: { colonyGrowth: 35, leadershipRadius: 25, resourceOutput: 20, buildSpeed: 14, morale: 18, diplomacyRating: 12 },
    maxMasteryLevel: 100,
    xpPerLevel: 900,
    subClasses: [
      {
        id: "population_overseer",
        name: "Population Overseer",
        description: "Grows and manages planetary populations for maximum output.",
        specialty: "Population Growth",
        primaryStat: "colonyGrowth",
        secondaryStat: "morale",
        statBonus: 40,
        icon: "👥",
        types: [
          { id: "immigration_policy", name: "Immigration Policy", description: "Controlling population inflow for growth.", primaryStat: "colonyGrowth", icon: "🚀",
            subTypes: [
              { id: "open_borders",    name: "Open Borders",   description: "Maximum immigration boosting growth.",     bonusStat: "colonyGrowth",   bonusValue: 18, icon: "🚪" },
              { id: "selective_imm",   name: "Selective Imm",  description: "Attracts only skilled specialists.",       bonusStat: "researchRate",   bonusValue: 12, icon: "🎓" },
              { id: "population_boom", name: "Population Boom",description: "Aggressive birth-rate incentives.",        bonusStat: "colonyGrowth",   bonusValue: 16, icon: "👶" },
            ],
          },
          { id: "welfare_state", name: "Welfare State", description: "High welfare maintaining happy productive citizens.", primaryStat: "morale", icon: "❤️",
            subTypes: [
              { id: "basic_income",   name: "Basic Income",   description: "Universal income boosting spending.",        bonusStat: "tradeBonus",    bonusValue: 10, icon: "💰" },
              { id: "healthcare",     name: "Healthcare",     description: "Universal healthcare extending lifespan.",   bonusStat: "colonyGrowth",  bonusValue: 12, icon: "🏥" },
              { id: "education",      name: "Education",      description: "Universal education boosting all output.",  bonusStat: "researchRate",  bonusValue: 10, icon: "📚" },
            ],
          },
        ],
      },
      {
        id: "resource_governor",
        name: "Resource Governor",
        description: "Optimizes resource extraction and distribution across colonies.",
        specialty: "Resource Administration",
        primaryStat: "resourceOutput",
        secondaryStat: "constructionCost",
        statBonus: 32,
        icon: "⛏️",
        types: [
          { id: "resource_distribution", name: "Resource Distribution", description: "Efficient resource sharing across planets.", primaryStat: "resourceOutput", icon: "🔄",
            subTypes: [
              { id: "supply_network",  name: "Supply Network", description: "Interconnected supply chains across colonies.",  bonusStat: "resourceOutput", bonusValue: 16, icon: "🕸️" },
              { id: "stockpile_mgmt",  name: "Stockpile Mgmt",  description: "Strategic resource stockpiling.",              bonusStat: "constructionCost",bonusValue:-10,icon: "📦" },
              { id: "rationing",       name: "Rationing",       description: "Extends resources during scarcity periods.",   bonusStat: "fuelEfficiency", bonusValue: 12, icon: "⚖️" },
            ],
          },
          { id: "infrastructure_dev", name: "Infrastructure Dev", description: "Building the colonial infrastructure backbone.", primaryStat: "buildSpeed", icon: "🏗️",
            subTypes: [
              { id: "spaceport",       name: "Spaceport",       description: "Colonial spaceports boosting trade.",          bonusStat: "tradeBonus",   bonusValue: 12, icon: "🚀" },
              { id: "transit_network", name: "Transit Network", description: "High-speed transit across planet surfaces.",   bonusStat: "fleetSpeed",   bonusValue: 8,  icon: "🚄" },
              { id: "power_plant",     name: "Power Plant",     description: "Energy infrastructure for all facilities.",    bonusStat: "buildSpeed",   bonusValue: 14, icon: "⚡" },
            ],
          },
        ],
      },
      {
        id: "military_governor",
        name: "Military Governor",
        description: "Rules colonies with an iron fist, maximizing military output.",
        specialty: "Military Colonialism",
        primaryStat: "defenseRating",
        secondaryStat: "colonyGrowth",
        statBonus: 28,
        icon: "⚔️",
        types: [
          { id: "martial_law", name: "Martial Law", description: "Strict military control maximizing output.", primaryStat: "defenseRating", icon: "🔒",
            subTypes: [
              { id: "iron_fist",     name: "Iron Fist",     description: "No tolerance — maximum productivity.",       bonusStat: "resourceOutput", bonusValue: 16, icon: "✊" },
              { id: "garrison_large",name: "Large Garrison", description: "Heavy military presence prevents unrest.",   bonusStat: "defenseRating",  bonusValue: 14, icon: "🏰" },
              { id: "labor_draft",   name: "Labor Draft",   description: "Mandatory labor directives maximizing work.", bonusStat: "buildSpeed",     bonusValue: 12, icon: "📋" },
            ],
          },
          { id: "colonial_military", name: "Colonial Military", description: "Building local military forces from colonies.", primaryStat: "shipCapacity", icon: "⚔️",
            subTypes: [
              { id: "recruit_local",  name: "Recruit Local",  description: "Recruits from colonial populations.",        bonusStat: "shipCapacity",   bonusValue: 12, icon: "👥" },
              { id: "training_camps", name: "Training Camps",  description: "Local military training infrastructure.",   bonusStat: "attackPower",    bonusValue: 10, icon: "⚔️" },
              { id: "militia_force",  name: "Militia Force",  description: "Armed civilian militia for local defense.",  bonusStat: "defenseRating",  bonusValue: 12, icon: "🔫" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "colonial_boom",    name: "Colonial Boom",    description: "All colonies grow 5× faster for 2 hours.",                     type: "active",  cooldown: 7200, duration: 7200, unlockLevel: 10, effects: { colonyGrowth: 400 }, icon: "🌍", flavorText: "A thriving colony is a loyal colony." },
      { id: "good_governance",  name: "Good Governance",  description: "Permanently increases morale by 12% across all colonies.",    type: "passive", unlockLevel: 25, effects: { morale: 12 }, icon: "👑", flavorText: "Happy citizens are productive citizens." },
      { id: "colonial_levy",    name: "Colonial Levy",    description: "Each colony contributes 10% more resources permanently.",     type: "passive", unlockLevel: 50, effects: { resourceOutput: 10 }, icon: "💰", flavorText: "The colonies exist to serve the empire." },
      { id: "golden_age",       name: "Golden Age",       description: "Declares a Golden Age — all stats +25% for 24 hours.",        type: "active",  cooldown: 604800, duration: 86400, unlockLevel: 90, effects: { colonyGrowth: 25, resourceOutput: 25, morale: 25 }, icon: "☀️", flavorText: "Prosperity remembered for generations." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Colonial Boom (active)",    type: "ability" },
      { level: 25, reward: "Good Governance (passive)", type: "ability" },
      { level: 30, reward: "Title: Colony Administrator",type: "title" },
      { level: 50, reward: "Colonial Levy (passive)",   type: "ability" },
      { level: 60, reward: "Governor's Ring (cosmetic)",type: "cosmetic" },
      { level: 70, reward: "Title: Colonial Governor",  type: "title" },
      { level: 80, reward: "+25% Colony Growth",        type: "stat" },
      { level: 90, reward: "Golden Age (active)",       type: "ability" },
      { level: 95, reward: "Title: High Governor",      type: "title" },
      { level: 100, reward: "Title: Colony Eternal",    type: "title" },
    ],
  },

  // ── 18. GALACTIC STRATEGIST ───────────────────────────────
  {
    id: "galactic_strategist",
    name: "Galactic Strategist",
    domain: "Leadership",
    tagline: "See The Whole Board, Win The Whole Game",
    description: "The Galactic Strategist coordinates all aspects of an empire simultaneously — military, economic, diplomatic, and scientific — to dominate the galaxy.",
    lore: "Any fool can win a battle. The Strategist wins wars that haven't even started yet.",
    icon: "♟️",
    color: "#1e40af",
    gradientFrom: "from-blue-950",
    gradientTo: "to-indigo-950",
    primaryStats: ["leadershipRadius", "morale", "attackPower"],
    secondaryStats: ["defenseRating", "diplomacyRating", "researchRate"],
    baseStats: { leadershipRadius: 30, morale: 25, attackPower: 18, defenseRating: 18, diplomacyRating: 16, researchRate: 14 },
    maxMasteryLevel: 100,
    xpPerLevel: 1400,
    subClasses: [
      {
        id: "fleet_coordinator",
        name: "Fleet Coordinator",
        description: "Orchestrates multi-fleet operations across entire star systems.",
        specialty: "Multi-Fleet Operations",
        primaryStat: "leadershipRadius",
        secondaryStat: "fleetSpeed",
        statBonus: 35,
        icon: "🌐",
        types: [
          { id: "synchronized_strike", name: "Synchronized Strike", description: "All fleets attack simultaneously.", primaryStat: "attackPower", icon: "⚔️",
            subTypes: [
              { id: "pincer_move",     name: "Pincer Move",     description: "Classic two-flank envelopment.",          bonusStat: "attackPower",    bonusValue: 16, icon: "🤏" },
              { id: "feint_attack",    name: "Feint Attack",    description: "Deceptive attack drawing enemy reserves.", bonusStat: "criticalStrike", bonusValue: 12, icon: "🎭" },
              { id: "total_war",       name: "Total War",       description: "All forces committed to a single strike.", bonusStat: "attackPower",    bonusValue: 20, icon: "🔥" },
            ],
          },
          { id: "defensive_screen", name: "Defensive Screen", description: "Layered fleet defense across a system.", primaryStat: "defenseRating", icon: "🛡️",
            subTypes: [
              { id: "picket_line",    name: "Picket Line",    description: "Early warning screen detecting invasions.", bonusStat: "intelRange",    bonusValue: 14, icon: "📡" },
              { id: "reserve_force",  name: "Reserve Force",  description: "Uncommitted reserves for rapid response.",  bonusStat: "defenseRating", bonusValue: 14, icon: "⚡" },
              { id: "strategic_depth",name: "Strategic Depth", description: "Multiple defensive lines in depth.",       bonusStat: "defenseRating", bonusValue: 16, icon: "🏰" },
            ],
          },
        ],
      },
      {
        id: "resource_allocator",
        name: "Resource Allocator",
        description: "Optimizes resource distribution across the entire empire.",
        specialty: "Empire-Wide Optimization",
        primaryStat: "resourceOutput",
        secondaryStat: "constructionCost",
        statBonus: 30,
        icon: "⚖️",
        types: [
          { id: "war_economy2", name: "War Economy", description: "Directing entire economy toward military goals.", primaryStat: "attackPower", icon: "⚔️",
            subTypes: [
              { id: "war_bonds",    name: "War Bonds",    description: "Funds military through popular investment.",    bonusStat: "tradeBonus",     bonusValue: 12, icon: "📜" },
              { id: "full_mobilize",name: "Full Mobilize",description: "Total societal mobilization for warfare.",      bonusStat: "shipCapacity",   bonusValue: 14, icon: "⚔️" },
              { id: "arms_race",    name: "Arms Race",    description: "Competitive weapons development cycle.",        bonusStat: "attackPower",    bonusValue: 16, icon: "🔫" },
            ],
          },
          { id: "peacetime_economy", name: "Peacetime Economy", description: "Maximizing economic output during peace.", primaryStat: "resourceOutput", icon: "🏗️",
            subTypes: [
              { id: "five_year_plan",  name: "Five Year Plan",  description: "Planned economic growth phases.",          bonusStat: "resourceOutput", bonusValue: 18, icon: "📋" },
              { id: "infrastructure_w",name: "Infrastructure",  description: "Massive peacetime construction programs.", bonusStat: "buildSpeed",     bonusValue: 14, icon: "🏗️" },
              { id: "research_push",   name: "Research Push",   description: "Directs resources to scientific advance.", bonusStat: "researchRate",   bonusValue: 14, icon: "🔬" },
            ],
          },
        ],
      },
      {
        id: "campaign_planner",
        name: "Campaign Planner",
        description: "Plans and executes long-term strategic campaigns.",
        specialty: "Grand Strategy",
        primaryStat: "morale",
        secondaryStat: "leadershipRadius",
        statBonus: 38,
        icon: "📋",
        types: [
          { id: "strategic_patience", name: "Strategic Patience", description: "Long-game strategies paying off over time.", primaryStat: "morale", icon: "⏳",
            subTypes: [
              { id: "long_game",    name: "Long Game",    description: "Sacrifices now for massive future gains.",     bonusStat: "leadershipRadius",bonusValue:16, icon: "♟️" },
              { id: "war_of_attrition",name:"War of Attrition",description:"Outlasting enemies through superior resources.",bonusStat: "resourceOutput",bonusValue: 12,icon: "⏳" },
              { id: "strategic_reserve",name:"Strategic Reserve",description:"Hidden reserves for decisive moments.",   bonusStat: "constructionCost",bonusValue:-12,icon: "📦" },
            ],
          },
          { id: "decisive_campaign", name: "Decisive Campaign", description: "Overwhelming force at the decisive point.", primaryStat: "attackPower", icon: "⚡",
            subTypes: [
              { id: "schwerpunkt",   name: "Schwerpunkt",   description: "Concentrated force at the decisive point.",   bonusStat: "attackPower",    bonusValue: 18, icon: "💥" },
              { id: "initiative",    name: "Initiative",    description: "Always hold the strategic initiative.",       bonusStat: "criticalStrike", bonusValue: 12, icon: "🎯" },
              { id: "annihilation",  name: "Annihilation",  description: "Total destruction of enemy will to fight.",   bonusStat: "morale",         bonusValue: 16, icon: "☠️" },
            ],
          },
        ],
      },
    ],
    abilities: [
      { id: "supreme_strategy",name: "Supreme Strategy", description: "All empire stats boosted by 15% for 2 hours.",                 type: "active",  cooldown: 14400, duration: 7200, unlockLevel: 10, effects: { attackPower: 15, defenseRating: 15, resourceOutput: 15 }, icon: "♟️", flavorText: "The board is mine." },
      { id: "war_doctrine",     name: "War Doctrine",    description: "Permanently grants +5% to all combat stats.",                 type: "passive", unlockLevel: 25, effects: { attackPower: 5, defenseRating: 5, weaponAccuracy: 5 }, icon: "📜", flavorText: "Written in blood, perfected in victory." },
      { id: "empire_mind",      name: "Empire Mind",     description: "Sees all empire alerts and events 50% faster.",               type: "passive", unlockLevel: 50, effects: { leadershipRadius: 50, intelRange: 25 }, icon: "🧠", flavorText: "Nothing happens in the empire without the Strategist knowing." },
      { id: "final_solution",   name: "Final Solution",  description: "Single decisive action — all fleets gain 100% stats for 1hr.", type: "active", cooldown: 604800, duration: 3600, unlockLevel: 100, effects: { attackPower: 100, defenseRating: 100, fleetSpeed: 50 }, icon: "⚡", flavorText: "This ends today." },
    ],
    masteryMilestones: [
      { level: 10, reward: "Supreme Strategy (active)", type: "ability" },
      { level: 25, reward: "War Doctrine (passive)",    type: "ability" },
      { level: 30, reward: "Title: Military Planner",   type: "title" },
      { level: 50, reward: "Empire Mind (passive)",     type: "ability" },
      { level: 60, reward: "Strategy Board (cosmetic)", type: "cosmetic" },
      { level: 70, reward: "Title: Grand Strategist",   type: "title" },
      { level: 80, reward: "+20% Leadership Radius",    type: "stat" },
      { level: 90, reward: "+15% All Combat Stats",     type: "stat" },
      { level: 95, reward: "Title: War Saint",          type: "title" },
      { level: 100, reward: "Final Solution (active)",  type: "ability" },
    ],
  },
];

// ─── Helper functions ─────────────────────────────────────────

export function getMasteryTierForLevel(level: number) {
  return MASTERY_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ?? MASTERY_TIERS[0];
}

export function getMasteryProgress(level: number, xpPerLevel: number, currentXP: number) {
  const xpForNext = level * xpPerLevel;
  return Math.min(100, Math.round((currentXP / xpForNext) * 100));
}

export function getClassesByDomain(domain: CommanderMasteryClass["domain"]) {
  return COMMANDER_MASTERY_CLASSES.filter((c) => c.domain === domain);
}

export function getTotalAbilities() {
  return COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.abilities.length, 0);
}

export function getTotalSubClasses() {
  return COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.subClasses.length, 0);
}

export const MASTERY_SUMMARY = {
  totalClasses:    COMMANDER_MASTERY_CLASSES.length,
  totalSubClasses: COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.subClasses.length, 0),
  totalTypes:      COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.subClasses.reduce((s2, sc) => s2 + sc.types.length, 0), 0),
  totalSubTypes:   COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.subClasses.reduce((s2, sc) => s2 + sc.types.reduce((s3, t) => s3 + t.subTypes.length, 0), 0), 0),
  totalAbilities:  COMMANDER_MASTERY_CLASSES.reduce((sum, c) => sum + c.abilities.length, 0),
  domains:         Object.keys(MASTERY_DOMAINS) as Array<keyof typeof MASTERY_DOMAINS>,
};
