/**
 * ARMY COMMANDER GACHA SYSTEM
 * ============================================================================
 * Banner system for recruiting army commanders via gacha pulls.
 * Includes banner types, pity mechanics, rate-ups, and commander catalog.
 */

import type {
  ArmyCommanderRarity,
  ArmyCommanderRole,
  ArmyCommanderFaction,
  ArmyCommanderDefinition,
  ArmyCommanderStats,
} from "./armyCommanderTypes";

import { ARMY_COMMANDER_RARITY_CONFIG, ARMY_FACTION_CONFIG, ARMY_ROLE_CONFIG } from "./armyCommanderTypes";

// ============================================================================
// BANNER TYPES
// ============================================================================

export type ArmyBannerType =
  | "standard"
  | "infantry_focus"
  | "armor_focus"
  | "special_ops"
  | "legendary"
  | "beginner"
  | "limited"
  | "faction"
  | "event"
  | "free_daily";

export type ArmyBannerCurrency =
  | "army-seal"
  | "free-army-seal"
  | "combat-token"
  | "event-badge"
  | "veteran-voucher";

// ============================================================================
// INTERFACES
// ============================================================================

export interface ArmyBannerRateUp {
  commanderId: string;
  rateUpMultiplier: number;
}

export interface ArmyGachaBannerConfig {
  id: string;
  name: string;
  description: string;
  type: ArmyBannerType;
  currency: ArmyBannerCurrency;
  singlePullCost: number;
  multiPullCost: number;
  multiPullGuarantee: number;
  availableCommanderIds: string[];
  rateUps: ArmyBannerRateUp[];
  startDate?: number;
  endDate?: number;
  isActive: boolean;
  bannerColor: string;
  bannerIcon: string;
}

export interface ArmyPullResult {
  commanderId: string;
  rarity: ArmyCommanderRarity;
  isRateUp: boolean;
  isDuplicate: boolean;
  shardsGained: number;
}

export interface ArmyPityState {
  bannerId: string;
  pityCounter: number;
  guaranteedLegendary: boolean;
  lastPullTime: number;
  totalPulls: number;
}

export interface ArmyGachaState {
  commanderShards: Record<string, number>;
  ownedCommanders: Record<string, number>;
  bannerPity: Record<string, ArmyPityState>;
  totalPulls: number;
  currency: Record<ArmyBannerCurrency, number>;
}

// ============================================================================
// PULL SIMULATION
// ============================================================================

function rollRarity(pity: number): ArmyCommanderRarity {
  const adjusted = pity;
  if (adjusted >= 100) return 5;
  if (adjusted >= 70 && Math.random() < 0.5) return 5;
  if (adjusted >= 40 && Math.random() < 0.3) return 4;
  const roll = Math.random();
  let cumulative = 0;
  for (const [rarity, config] of Object.entries(ARMY_COMMANDER_RARITY_CONFIG)) {
    cumulative += config.baseProbability;
    if (roll < cumulative) return Number(rarity) as ArmyCommanderRarity;
  }
  return 1;
}

export function simulateArmyPull(
  banner: ArmyGachaBannerConfig,
  pity: ArmyPityState,
  ownedCommanders: Record<string, number>,
  availableCommanders: ArmyCommanderDefinition[]
): { result: ArmyPullResult; newPity: ArmyPityState } {
  const rarity = rollRarity(pity.pityCounter);
  const matchingRarity = availableCommanders.filter(c => c.rarity === rarity);

  let rateUpHit = false;
  let selectedId: string;

  if (banner.rateUps.length > 0 && rarity >= 4) {
    const rateUpCommanders = banner.rateUps.filter(ru =>
      matchingRarity.some(c => c.id === ru.commanderId)
    );
    if (rateUpCommanders.length > 0 && Math.random() < 0.5) {
      const chosen = rateUpCommanders[Math.floor(Math.random() * rateUpCommanders.length)];
      selectedId = chosen.commanderId;
      rateUpHit = true;
    } else {
      selectedId = matchingRarity[Math.floor(Math.random() * matchingRarity.length)].id;
    }
  } else {
    selectedId = matchingRarity.length > 0
      ? matchingRarity[Math.floor(Math.random() * matchingRarity.length)].id
      : availableCommanders[0].id;
  }

  const isDuplicate = (ownedCommanders[selectedId] || 0) > 0;
  const shardsGained = ARMY_COMMANDER_RARITY_CONFIG[rarity].shardReward + (isDuplicate ? 10 : 0);

  const newPity: ArmyPityState = {
    ...pity,
    pityCounter: rarity === 5 ? 0 : pity.pityCounter + 1,
    guaranteedLegendary: rarity === 5 ? false : pity.guaranteedLegendary,
    lastPullTime: Date.now(),
    totalPulls: pity.totalPulls + 1,
  };

  return {
    result: { commanderId: selectedId, rarity, isRateUp: rateUpHit, isDuplicate, shardsGained },
    newPity,
  };
}

export function simulateArmyMultiPull(
  banner: ArmyGachaBannerConfig,
  pity: ArmyPityState,
  ownedCommanders: Record<string, number>,
  availableCommanders: ArmyCommanderDefinition[],
  count: number = 10
): { results: ArmyPullResult[]; newPity: ArmyPityState } {
  let currentPity = { ...pity };
  const results: ArmyPullResult[] = [];

  for (let i = 0; i < count; i++) {
    const { result, newPity } = simulateArmyPull(banner, currentPity, ownedCommanders, availableCommanders);
    results.push(result);
    currentPity = newPity;
  }

  return { results, newPity: currentPity };
}

// ============================================================================
// COMMANDER CATALOG
// ============================================================================

function stats(base: Partial<ArmyCommanderStats>): ArmyCommanderStats {
  return {
    attackBonus: 0, defenseBonus: 0, hpBonus: 0, speedBonus: 0,
    accuracyBonus: 0, evasionBonus: 0, moraleBonus: 0, initiativeBonus: 0,
    commandRadius: 0, unitCapacity: 0,
    ...base,
  };
}

export const ARMY_COMMANDERS: ArmyCommanderDefinition[] = [
  // ── LEGENDARY (5-star) ──────────────────────────────────────
  {
    id: "ac_iron_marshal", name: "Iron Marshal", title: "Supreme Commander of the Iron Fist",
    rarity: 5, role: "armor_commander", faction: "iron_fist",
    description: "The most feared armored warfare commander in the galaxy.",
    lore: "Raised in the foundries of Mars, the Iron Marshal has never lost an armored engagement.",
    icon: "🐉", portrait: "iron_marshal.png", color: "#ef4444",
    gradientFrom: "from-red-950", gradientTo: "to-rose-900",
    baseStats: stats({ attackBonus: 35, defenseBonus: 25, hpBonus: 30, initiativeBonus: 20, commandRadius: 3, unitCapacity: 50 }),
    growthRates: stats({ attackBonus: 4, defenseBonus: 3, hpBonus: 3.5, initiativeBonus: 2 }),
    maxLevel: 999, maxStarLevel: 30, xpPerLevel: 1500,
    passives: [
      { id: "iron_will", name: "Iron Will", description: "+15% HP to all armored units", effect: stats({ hpBonus: 15 }), icon: "❤️", unlockLevel: 1 },
      { id: "steel_resolve", name: "Steel Resolve", description: "+10% defense when below 50% HP", effect: stats({ defenseBonus: 10 }), icon: "🛡️", unlockLevel: 100 },
      { id: "iron_fist_aura", name: "Iron Fist Aura", description: "+20% attack to all units", effect: stats({ attackBonus: 20 }), icon: "⚔️", unlockLevel: 500 },
    ],
    actives: [
      { id: "iron_storm", name: "Iron Storm", description: "Deals massive damage to all enemies", cooldown: 60, duration: 10, manaCost: 50, effect: stats({ attackBonus: 50 }), aoeRadius: 5, icon: "🌪️", unlockLevel: 200 },
    ],
    auras: [
      { id: "fortress_command", name: "Fortress Command", description: "+10% defense to all allies", radius: 5, effect: stats({ defenseBonus: 10 }), icon: "🏰", unlockLevel: 1 },
    ],
    synergies: [
      { id: "iron_legion", name: "Iron Legion", description: "+25% attack with 3+ armored units", requiredUnits: ["main_battle_tank", "armored_personnel_carrier", "light_armor"], bonusStats: stats({ attackBonus: 25 }), icon: "🐉" },
    ],
    skillTree: { id: "iron_marshal_tree", name: "Iron Marshal Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["armored_forces", "mech_exoskeleton"],
    synergyBonusPercent: 25,
    leadershipCapacity: 50,
    shardConversionRate: 0.5,
    duplicateShardReward: 50,
  },
  {
    id: "ac_shadow_blade", name: "Shadow Blade", title: "Phantom of the Battlefield",
    rarity: 5, role: "special_ops_lead", faction: "void_stalkers",
    description: "A ghost who strikes from the shadows, never seen until it's too late.",
    lore: "Trained by the Void Stalkers since childhood, Shadow Blade has eliminated over 200 high-value targets.",
    icon: "🗡️", portrait: "shadow_blade.png", color: "#6366f1",
    gradientFrom: "from-indigo-950", gradientTo: "to-violet-900",
    baseStats: stats({ evasionBonus: 35, accuracyBonus: 30, speedBonus: 25, initiativeBonus: 30, commandRadius: 4, unitCapacity: 35 }),
    growthRates: stats({ evasionBonus: 4, accuracyBonus: 3.5, speedBonus: 3, initiativeBonus: 3.5 }),
    maxLevel: 999, maxStarLevel: 30, xpPerLevel: 1500,
    passives: [
      { id: "shadow_step", name: "Shadow Step", description: "+20% evasion to special ops", effect: stats({ evasionBonus: 20 }), icon: "🌀", unlockLevel: 1 },
      { id: "assassinate", name: "Assassinate", description: "+15% accuracy on first attack", effect: stats({ accuracyBonus: 15 }), icon: "🎯", unlockLevel: 100 },
    ],
    actives: [
      { id: "shadow_strike", name: "Shadow Strike", description: "Critical hit on target", cooldown: 45, duration: 5, manaCost: 40, effect: stats({ accuracyBonus: 60 }), aoeRadius: 1, icon: "🗡️", unlockLevel: 150 },
    ],
    auras: [
      { id: "cloak_of_shadows", name: "Cloak of Shadows", description: "+15% evasion to all allies", radius: 4, effect: stats({ evasionBonus: 15 }), icon: "🌑", unlockLevel: 1 },
    ],
    synergies: [
      { id: "phantom_operatives", name: "Phantom Operatives", description: "+30% evasion with 2+ special ops", requiredUnits: ["commando_unit", "recon_unit"], bonusStats: stats({ evasionBonus: 30 }), icon: "👻" },
    ],
    skillTree: { id: "shadow_blade_tree", name: "Shadow Blade Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["special_operations", "intelligence_recon"],
    synergyBonusPercent: 30,
    leadershipCapacity: 35,
    shardConversionRate: 0.5,
    duplicateShardReward: 50,
  },
  {
    id: "ac_storm_lord", name: "Storm Lord", title: "Master of Thunder",
    rarity: 5, role: "artillery_director", faction: "storm_brigade",
    description: "Commands devastating artillery barrages that level entire fortifications.",
    lore: "The Storm Lord's first bombardment reduced an enemy fortress to rubble in under 60 seconds.",
    icon: "⛈️", portrait: "storm_lord.png", color: "#f97316",
    gradientFrom: "from-orange-950", gradientTo: "to-amber-900",
    baseStats: stats({ attackBonus: 40, accuracyBonus: 25, commandRadius: 6, unitCapacity: 40, moraleBonus: 15 }),
    growthRates: stats({ attackBonus: 5, accuracyBonus: 3, commandRadius: 0.5 }),
    maxLevel: 999, maxStarLevel: 30, xpPerLevel: 1500,
    passives: [
      { id: "rain_of_fire", name: "Rain of Fire", description: "+25% attack to artillery", effect: stats({ attackBonus: 25 }), icon: "🔥", unlockLevel: 1 },
      { id: "precision_barrage", name: "Precision Barrage", description: "+20% accuracy to all units", effect: stats({ accuracyBonus: 20 }), icon: "🎯", unlockLevel: 200 },
    ],
    actives: [
      { id: "thunder_strike", name: "Thunder Strike", description: "Devastating area bombardment", cooldown: 90, duration: 15, manaCost: 60, effect: stats({ attackBonus: 70 }), aoeRadius: 8, icon: "⛈️", unlockLevel: 300 },
    ],
    auras: [],
    synergies: [
      { id: "artillery_barrage", name: "Artillery Barrage", description: "+35% attack with 3+ artillery units", requiredUnits: ["field_artillery", "siege_weapons", "mobile_artillery"], bonusStats: stats({ attackBonus: 35 }), icon: "💣" },
    ],
    skillTree: { id: "storm_lord_tree", name: "Storm Lord Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["artillery_corps", "siege_weapons"],
    synergyBonusPercent: 35,
    leadershipCapacity: 40,
    shardConversionRate: 0.5,
    duplicateShardReward: 50,
  },
  {
    id: "ac_war_sage", name: "War Sage", title: "Strategic Oracle",
    rarity: 5, role: "combined_arms_lead", faction: "crystal_orders",
    description: "A brilliant strategist who sees all possibilities on the battlefield.",
    lore: "The War Sage has never lost a battle, having predicted every enemy move before it happened.",
    icon: "🔮", portrait: "war_sage.png", color: "#a855f7",
    gradientFrom: "from-purple-950", gradientTo: "to-fuchsia-900",
    baseStats: stats({ initiativeBonus: 35, commandRadius: 8, moraleBonus: 25, unitCapacity: 60, accuracyBonus: 20 }),
    growthRates: stats({ initiativeBonus: 4, commandRadius: 0.8, moraleBonus: 3 }),
    maxLevel: 999, maxStarLevel: 30, xpPerLevel: 1500,
    passives: [
      { id: "strategic_genius", name: "Strategic Genius", description: "+20% all stats to all units", effect: stats({ attackBonus: 10, defenseBonus: 10, hpBonus: 10 }), icon: "🧠", unlockLevel: 1 },
      { id: "foresight", name: "Foresight", description: "+25% initiative", effect: stats({ initiativeBonus: 25 }), icon: "👁️", unlockLevel: 150 },
    ],
    actives: [
      { id: "grand_strategy", name: "Grand Strategy", description: "Buffs entire army", cooldown: 120, duration: 30, manaCost: 80, effect: stats({ attackBonus: 30, defenseBonus: 30, speedBonus: 20 }), aoeRadius: 10, icon: "♟️", unlockLevel: 400 },
    ],
    auras: [
      { id: "command_presence", name: "Command Presence", description: "+10% all stats to all allies", radius: 10, effect: stats({ attackBonus: 10, defenseBonus: 10, hpBonus: 10 }), icon: "👑", unlockLevel: 1 },
    ],
    synergies: [
      { id: "combined_arms_synergy", name: "Combined Arms", description: "+40% all stats with 4+ different unit types", requiredUnits: ["infantry_corps", "armored_forces", "artillery_corps", "air_forces"], bonusStats: stats({ attackBonus: 15, defenseBonus: 15, speedBonus: 10 }), icon: "🌟" },
    ],
    skillTree: { id: "war_sage_tree", name: "War Sage Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["command_hq", "psionic_forces"],
    synergyBonusPercent: 40,
    leadershipCapacity: 60,
    shardConversionRate: 0.5,
    duplicateShardReward: 50,
  },
  {
    id: "ac_death_herald", name: "Death Herald", title: "Herald of Annihilation",
    rarity: 5, role: "siege_master", faction: "death_cult",
    description: "An unstoppable force that crushes all defenses before the army advances.",
    lore: "The Death Herald's siege engines have toppled more fortress walls than any other commander.",
    icon: "💀", portrait: "death_herald.png", color: "#dc2626",
    gradientFrom: "from-red-950", gradientTo: "to-black",
    baseStats: stats({ attackBonus: 45, hpBonus: 20, defenseBonus: 15, moraleBonus: 10, commandRadius: 4, unitCapacity: 45 }),
    growthRates: stats({ attackBonus: 5, hpBonus: 3, moraleBonus: 2 }),
    maxLevel: 999, maxStarLevel: 30, xpPerLevel: 1500,
    passives: [
      { id: "death_march", name: "Death March", description: "+30% attack, -10% defense (berserker)", effect: stats({ attackBonus: 30, defenseBonus: -10 }), icon: "💀", unlockLevel: 1 },
      { id: "fear_factor", name: "Fear Factor", description: "+20% morale reduction on enemies", effect: stats({ moraleBonus: 20 }), icon: "😱", unlockLevel: 250 },
    ],
    actives: [
      { id: "death_or_glory", name: "Death or Glory", description: "Double attack, halve defense for 20s", cooldown: 90, duration: 20, manaCost: 50, effect: stats({ attackBonus: 80, defenseBonus: -30 }), aoeRadius: 3, icon: "☠️", unlockLevel: 350 },
    ],
    auras: [],
    synergies: [
      { id: "death_cult_synergy", name: "Death Cult Devotion", description: "+40% morale with 3+ special ops", requiredUnits: ["commando_unit", "siege_breakers", "recon_unit"], bonusStats: stats({ moraleBonus: 40, attackBonus: 20 }), icon: "💀" },
    ],
    skillTree: { id: "death_herald_tree", name: "Death Herald Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["heavy_infantry", "artillery_corps"],
    synergyBonusPercent: 40,
    leadershipCapacity: 45,
    shardConversionRate: 0.5,
    duplicateShardReward: 50,
  },

  // ── EPIC (4-star) ───────────────────────────────────────────
  {
    id: "ac_fortress_guardian", name: "Fortress Guardian", title: "Shield of the Empire",
    rarity: 4, role: "defense_overseer", faction: "iron_bastion",
    description: "The immovable object that holds any line against any force.",
    lore: "Fortress Guardian once held a breach for 72 hours with only 200 soldiers.",
    icon: "🛡️", portrait: "fortress_guardian.png", color: "#3b82f6",
    gradientFrom: "from-blue-950", gradientTo: "to-cyan-900",
    baseStats: stats({ defenseBonus: 30, hpBonus: 25, commandRadius: 3, unitCapacity: 40, moraleBonus: 10 }),
    growthRates: stats({ defenseBonus: 4, hpBonus: 3, moraleBonus: 2 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "unbreakable", name: "Unbreakable", description: "+20% defense to heavy infantry", effect: stats({ defenseBonus: 20 }), icon: "🛡️", unlockLevel: 1 },
      { id: "fortress_wall", name: "Fortress Wall", description: "+15% HP to all units", effect: stats({ hpBonus: 15 }), icon: "🏰", unlockLevel: 100 },
    ],
    actives: [
      { id: "iron_shield", name: "Iron Shield", description: "Grants shield to all allies", cooldown: 60, duration: 15, manaCost: 40, effect: stats({ defenseBonus: 40 }), aoeRadius: 6, icon: "🛡️", unlockLevel: 200 },
    ],
    auras: [
      { id: "bastion_aura", name: "Bastion Aura", description: "+10% defense to nearby allies", radius: 5, effect: stats({ defenseBonus: 10 }), icon: "🏰", unlockLevel: 1 },
    ],
    synergies: [
      { id: "iron_wall", name: "Iron Wall", description: "+25% defense with 2+ heavy infantry", requiredUnits: ["power_armor_unit", "siege_breakers"], bonusStats: stats({ defenseBonus: 25, hpBonus: 15 }), icon: "🛡️" },
    ],
    skillTree: { id: "fortress_guardian_tree", name: "Fortress Guardian Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["heavy_infantry", "engineering_corps"],
    synergyBonusPercent: 25,
    leadershipCapacity: 40,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_eagle_eye", name: "Eagle Eye", title: "Sky Commander",
    rarity: 4, role: "air_support_lead", faction: "sky_hunters",
    description: "Aerial warfare genius who dominates the skies above any battlefield.",
    lore: "Eagle Eye's fighter squadrons have a 98% mission success rate.",
    icon: "🦅", portrait: "eagle_eye.png", color: "#06b6d4",
    gradientFrom: "from-cyan-950", gradientTo: "to-blue-900",
    baseStats: stats({ speedBonus: 30, accuracyBonus: 25, evasionBonus: 20, attackBonus: 15, commandRadius: 4, unitCapacity: 35 }),
    growthRates: stats({ speedBonus: 4, accuracyBonus: 3.5, evasionBonus: 3 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "air_superiority", name: "Air Superiority", description: "+20% speed to air units", effect: stats({ speedBonus: 20 }), icon: "✈️", unlockLevel: 1 },
      { id: "precision_strikes", name: "Precision Strikes", description: "+15% accuracy to all units", effect: stats({ accuracyBonus: 15 }), icon: "🎯", unlockLevel: 150 },
    ],
    actives: [
      { id: "airstrike", name: "Airstrike", description: "Calls devastating air strike", cooldown: 75, duration: 10, manaCost: 45, effect: stats({ attackBonus: 45 }), aoeRadius: 5, icon: "🛩️", unlockLevel: 250 },
    ],
    auras: [
      { id: "air_cover", name: "Air Cover", description: "+10% evasion to all allies", radius: 5, effect: stats({ evasionBonus: 10 }), icon: "✈️", unlockLevel: 1 },
    ],
    synergies: [],
    skillTree: { id: "eagle_eye_tree", name: "Eagle Eye Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["air_forces"],
    synergyBonusPercent: 25,
    leadershipCapacity: 35,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_iron_architect", name: "Iron Architect", title: "Master Builder",
    rarity: 4, role: "engineering_chief", faction: "terran_legion",
    description: "Turns any terrain into an impregnable fortress within hours.",
    lore: "The Iron Architect built the famous Titan Wall in just 30 days.",
    icon: "🏗️", portrait: "iron_architect.png", color: "#78716c",
    gradientFrom: "from-stone-950", gradientTo: "to-gray-900",
    baseStats: stats({ defenseBonus: 20, unitCapacity: 35, commandRadius: 3, initiativeBonus: 15 }),
    growthRates: stats({ defenseBonus: 3, unitCapacity: 2, initiativeBonus: 2 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "master_builder", name: "Master Builder", description: "+25% build speed for structures", effect: stats({ defenseBonus: 25 }), icon: "🏗️", unlockLevel: 1 },
    ],
    actives: [
      { id: "emergency_fortification", name: "Emergency Fortification", description: "Instantly builds defensive structures", cooldown: 90, duration: 0, manaCost: 50, effect: stats({ defenseBonus: 35 }), aoeRadius: 4, icon: "🏰", unlockLevel: 200 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "iron_architect_tree", name: "Iron Architect Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["engineering_corps"],
    synergyBonusPercent: 20,
    leadershipCapacity: 35,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_crimson_blade", name: "Crimson Blade", title: "Assault Commander",
    rarity: 4, role: "offense_director", faction: "crimson_vanguard",
    description: "Leads charges that break any enemy line.",
    lore: "The Crimson Blade personally led 50 successful assaults without a single defeat.",
    icon: "🗡️", portrait: "crimson_blade.png", color: "#ef4444",
    gradientFrom: "from-red-950", gradientTo: "to-red-800",
    baseStats: stats({ attackBonus: 25, speedBonus: 15, evasionBonus: 10, initiativeBonus: 20, commandRadius: 3, unitCapacity: 40 }),
    growthRates: stats({ attackBonus: 4, speedBonus: 2.5, initiativeBonus: 3 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "fervor", name: "Fervor", description: "+20% attack to infantry", effect: stats({ attackBonus: 20 }), icon: "⚔️", unlockLevel: 1 },
    ],
    actives: [
      { id: "blood_rush", name: "Blood Rush", description: "+50% attack, -15% defense for 15s", cooldown: 60, duration: 15, manaCost: 35, effect: stats({ attackBonus: 50, defenseBonus: -15 }), aoeRadius: 3, icon: "🩸", unlockLevel: 150 },
    ],
    auras: [],
    synergies: [
      { id: "vanguard_charge", name: "Vanguard Charge", description: "+20% attack with infantry", requiredUnits: ["light_infantry", "rifle_squad", "assault_squad"], bonusStats: stats({ attackBonus: 20, speedBonus: 10 }), icon: "⚔️" },
    ],
    skillTree: { id: "crimson_blade_tree", name: "Crimson Blade Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["infantry_corps"],
    synergyBonusPercent: 20,
    leadershipCapacity: 40,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_ghost_walker", name: "Ghost Walker", title: "Infiltration Expert",
    rarity: 4, role: "recon_director", faction: "shadow_cloak",
    description: "Masters of stealth who gather intel without being detected.",
    lore: "Ghost Walker's recon teams have mapped 500+ enemy installations undetected.",
    icon: "👻", portrait: "ghost_walker.png", color: "#6366f1",
    gradientFrom: "from-indigo-950", gradientTo: "to-slate-900",
    baseStats: stats({ evasionBonus: 25, speedBonus: 20, accuracyBonus: 15, initiativeBonus: 15, commandRadius: 5, unitCapacity: 30 }),
    growthRates: stats({ evasionBonus: 3.5, speedBonus: 3, initiativeBonus: 2 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "ghost_protocol", name: "Ghost Protocol", description: "+20% evasion to recon units", effect: stats({ evasionBonus: 20 }), icon: "🌀", unlockLevel: 1 },
    ],
    actives: [
      { id: "flash_recon", name: "Flash Recon", description: "Reveals all enemy positions", cooldown: 120, duration: 30, manaCost: 40, effect: stats({ accuracyBonus: 30 }), aoeRadius: 10, icon: "👁️", unlockLevel: 200 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "ghost_walker_tree", name: "Ghost Walker Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["intelligence_recon", "special_operations"],
    synergyBonusPercent: 20,
    leadershipCapacity: 30,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_medic_chief", name: "Medic Chief", title: "Battlefield Savior",
    rarity: 4, role: "medical_corps_lead", faction: "star_crusaders",
    description: "Keeps soldiers alive through the most brutal engagements.",
    lore: "Medic Chief has saved over 10,000 soldiers on the battlefield.",
    icon: "🏥", portrait: "medic_chief.png", color: "#22c55e",
    gradientFrom: "from-green-950", gradientTo: "to-emerald-900",
    baseStats: stats({ hpBonus: 30, moraleBonus: 20, commandRadius: 4, unitCapacity: 35 }),
    growthRates: stats({ hpBonus: 4, moraleBonus: 3 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "field_medicine", name: "Field Medicine", description: "+15% HP regen to all units", effect: stats({ hpBonus: 15 }), icon: "💊", unlockLevel: 1 },
      { id: "inspire_courage", name: "Inspire Courage", description: "+15% morale to all units", effect: stats({ moraleBonus: 15 }), icon: "⭐", unlockLevel: 100 },
    ],
    actives: [
      { id: "mass_heal", name: "Mass Heal", description: "Heals all units significantly", cooldown: 90, duration: 10, manaCost: 45, effect: stats({ hpBonus: 40 }), aoeRadius: 8, icon: "💚", unlockLevel: 200 },
    ],
    auras: [
      { id: "healing_aura", name: "Healing Aura", description: "+10% HP to nearby allies", radius: 5, effect: stats({ hpBonus: 10 }), icon: "💚", unlockLevel: 1 },
    ],
    synergies: [],
    skillTree: { id: "medic_chief_tree", name: "Medic Chief Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["support_logistics"],
    synergyBonusPercent: 20,
    leadershipCapacity: 35,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_drone_master", name: "Drone Master", title: "Cyber Warfare Lead",
    rarity: 4, role: "cyber_warfare_lead", faction: "necro_forge",
    description: "Commands swarms of autonomous combat drones.",
    lore: "The Drone Master's swarm has destroyed more targets than any conventional army.",
    icon: "🤖", portrait: "drone_master.png", color: "#7c3aed",
    gradientFrom: "from-violet-950", gradientTo: "to-purple-900",
    baseStats: stats({ accuracyBonus: 30, evasionBonus: 20, speedBonus: 15, commandRadius: 6, unitCapacity: 50 }),
    growthRates: stats({ accuracyBonus: 4, evasionBonus: 3, speedBonus: 2 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "swarm_intelligence", name: "Swarm Intelligence", description: "+20% accuracy to drone units", effect: stats({ accuracyBonus: 20 }), icon: "🤖", unlockLevel: 1 },
    ],
    actives: [
      { id: "overload_swarm", name: "Overload Swarm", description: "Deploys massive drone swarm", cooldown: 80, duration: 20, manaCost: 50, effect: stats({ attackBonus: 40, evasionBonus: 25 }), aoeRadius: 6, icon: "🐝", unlockLevel: 250 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "drone_master_tree", name: "Drone Master Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["cyber_drone"],
    synergyBonusPercent: 25,
    leadershipCapacity: 50,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },
  {
    id: "ac_supply_king", name: "Supply King", title: "Logistics Emperor",
    rarity: 4, role: "supply_chain_lead", faction: "obsidian_fleet",
    description: "Ensures armies never run out of ammo, food, or supplies.",
    lore: "Supply King's logistical network spans 50 star systems.",
    icon: "🚛", portrait: "supply_king.png", color: "#ca8a04",
    gradientFrom: "from-yellow-950", gradientTo: "to-amber-900",
    baseStats: stats({ unitCapacity: 40, initiativeBonus: 15, moraleBonus: 10, commandRadius: 4 }),
    growthRates: stats({ unitCapacity: 3, initiativeBonus: 2, moraleBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 25, xpPerLevel: 1200,
    passives: [
      { id: "supply_lines", name: "Supply Lines", description: "+25% unit capacity", effect: stats({ unitCapacity: 25 }), icon: "📦", unlockLevel: 1 },
    ],
    actives: [
      { id: "emergency_resupply", name: "Emergency Resupply", description: "Instantly restocks all units", cooldown: 120, duration: 0, manaCost: 35, effect: stats({ moraleBonus: 20 }), aoeRadius: 10, icon: "📦", unlockLevel: 150 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "supply_king_tree", name: "Supply King Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["support_logistics"],
    synergyBonusPercent: 20,
    leadershipCapacity: 50,
    shardConversionRate: 0.5,
    duplicateShardReward: 30,
  },

  // ── RARE (3-star) ───────────────────────────────────────────
  {
    id: "ac_rifle_sergeant", name: "Rifle Sergeant", title: "Infantry NCO",
    rarity: 3, role: "infantry_leader", faction: "terran_legion",
    description: "A reliable NCO who keeps infantry in fighting shape.",
    lore: "The Rifle Sergeant has trained over 5,000 recruits.",
    icon: "🔫", portrait: "rifle_sergeant.png", color: "#22c55e",
    gradientFrom: "from-green-950", gradientTo: "to-green-800",
    baseStats: stats({ attackBonus: 15, defenseBonus: 10, hpBonus: 10, initiativeBonus: 10, commandRadius: 2, unitCapacity: 25 }),
    growthRates: stats({ attackBonus: 2, defenseBonus: 1.5, hpBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "rifle_drill", name: "Rifle Drill", description: "+10% attack to infantry", effect: stats({ attackBonus: 10 }), icon: "🔫", unlockLevel: 1 },
    ],
    actives: [
      { id: "volley_fire", name: "Volley Fire", description: "Coordinates rifle volley", cooldown: 45, duration: 8, manaCost: 25, effect: stats({ attackBonus: 25 }), aoeRadius: 3, icon: "💥", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "rifle_sergeant_tree", name: "Rifle Sergeant Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["infantry_corps"],
    synergyBonusPercent: 15,
    leadershipCapacity: 25,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_tank_lieutenant", name: "Tank Lieutenant", title: "Armor Officer",
    rarity: 3, role: "armor_commander", faction: "iron_fist",
    description: "Young officer with natural talent for armored warfare.",
    lore: "Tank Lieutenant destroyed 3 enemy tanks in their first engagement.",
    icon: "🐉", portrait: "tank_lieutenant.png", color: "#b91c1c",
    gradientFrom: "from-red-950", gradientTo: "to-red-800",
    baseStats: stats({ attackBonus: 15, defenseBonus: 12, hpBonus: 8, commandRadius: 2, unitCapacity: 25 }),
    growthRates: stats({ attackBonus: 2.5, defenseBonus: 2, hpBonus: 1 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "armor_training", name: "Armor Training", description: "+10% attack to armored units", effect: stats({ attackBonus: 10 }), icon: "🐉", unlockLevel: 1 },
    ],
    actives: [
      { id: "charge", name: "Armored Charge", description: "Charges into enemy lines", cooldown: 50, duration: 8, manaCost: 30, effect: stats({ attackBonus: 30, speedBonus: 15 }), aoeRadius: 2, icon: "🚀", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "tank_lieutenant_tree", name: "Tank Lieutenant Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["armored_forces"],
    synergyBonusPercent: 15,
    leadershipCapacity: 25,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_artillery_corporal", name: "Artillery Corporal", title: "Fire Support",
    rarity: 3, role: "artillery_director", faction: "storm_brigade",
    description: "Expert at coordinating fire support for ground forces.",
    lore: "Artillery Corporal's shots never miss their mark.",
    icon: "💣", portrait: "artillery_corporal.png", color: "#f97316",
    gradientFrom: "from-orange-950", gradientTo: "to-orange-800",
    baseStats: stats({ attackBonus: 20, accuracyBonus: 15, commandRadius: 4, unitCapacity: 25 }),
    growthRates: stats({ attackBonus: 2.5, accuracyBonus: 2 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "fire_support", name: "Fire Support", description: "+10% attack to artillery", effect: stats({ attackBonus: 10 }), icon: "💣", unlockLevel: 1 },
    ],
    actives: [
      { id: "concentrated_fire", name: "Concentrated Fire", description: "Focuses all fire on one area", cooldown: 60, duration: 10, manaCost: 30, effect: stats({ attackBonus: 35 }), aoeRadius: 4, icon: "🔥", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "artillery_corporal_tree", name: "Artillery Corporal Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["artillery_corps"],
    synergyBonusPercent: 15,
    leadershipCapacity: 25,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_medic_private", name: "Medic Private", title: "Combat Medic",
    rarity: 3, role: "medical_corps_lead", faction: "star_crusaders",
    description: "Brave medic who saves lives under fire.",
    lore: "Medic Private has earned 5 medals for bravery under fire.",
    icon: "🏥", portrait: "medic_private.png", color: "#22c55e",
    gradientFrom: "from-green-950", gradientTo: "to-emerald-800",
    baseStats: stats({ hpBonus: 15, moraleBonus: 10, commandRadius: 2, unitCapacity: 20 }),
    growthRates: stats({ hpBonus: 2, moraleBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "basic_medicine", name: "Basic Medicine", description: "+10% HP to all units", effect: stats({ hpBonus: 10 }), icon: "💊", unlockLevel: 1 },
    ],
    actives: [
      { id: "first_aid", name: "First Aid", description: "Heals nearby units", cooldown: 45, duration: 8, manaCost: 20, effect: stats({ hpBonus: 25 }), aoeRadius: 3, icon: "🩹", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "medic_private_tree", name: "Medic Private Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["support_logistics"],
    synergyBonusPercent: 15,
    leadershipCapacity: 20,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_recon_scout", name: "Recon Scout", title: "Forward Observer",
    rarity: 3, role: "recon_director", faction: "void_stalkers",
    description: "Eyes and ears of the army on the front lines.",
    lore: "Recon Scout has spotted more enemy positions than any other scout.",
    icon: "👁️", portrait: "recon_scout.png", color: "#6366f1",
    gradientFrom: "from-indigo-950", gradientTo: "to-indigo-800",
    baseStats: stats({ evasionBonus: 15, speedBonus: 15, accuracyBonus: 10, commandRadius: 3, unitCapacity: 20 }),
    growthRates: stats({ evasionBonus: 2, speedBonus: 2, accuracyBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "sharp_eyes", name: "Sharp Eyes", description: "+10% accuracy to recon", effect: stats({ accuracyBonus: 10 }), icon: "👁️", unlockLevel: 1 },
    ],
    actives: [
      { id: "mark_target", name: "Mark Target", description: "Marks enemy for bonus damage", cooldown: 40, duration: 15, manaCost: 20, effect: stats({ accuracyBonus: 25 }), aoeRadius: 5, icon: "🎯", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "recon_scout_tree", name: "Recon Scout Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["intelligence_recon"],
    synergyBonusPercent: 15,
    leadershipCapacity: 20,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_psi_operative", name: "Psi Operative", title: "Psionic Trooper",
    rarity: 3, role: "psyops_lead", faction: "crystal_orders",
    description: "Uses psychic abilities to disrupt enemy formations.",
    lore: "Psi Operative can read enemy intentions before they act.",
    icon: "🧠", portrait: "psi_operative.png", color: "#a855f7",
    gradientFrom: "from-purple-950", gradientTo: "to-purple-800",
    baseStats: stats({ initiativeBonus: 15, moraleBonus: 10, accuracyBonus: 10, commandRadius: 3, unitCapacity: 20 }),
    growthRates: stats({ initiativeBonus: 2, moraleBonus: 1.5, accuracyBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "psychic_link", name: "Psychic Link", description: "+10% morale to all units", effect: stats({ moraleBonus: 10 }), icon: "🧠", unlockLevel: 1 },
    ],
    actives: [
      { id: "mind_shatter", name: "Mind Shatter", description: "Disrupts enemy command", cooldown: 75, duration: 12, manaCost: 35, effect: stats({ initiativeBonus: 30 }), aoeRadius: 5, icon: "💫", unlockLevel: 150 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "psi_operative_tree", name: "Psi Operative Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["psionic_forces"],
    synergyBonusPercent: 15,
    leadershipCapacity: 20,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },
  {
    id: "ac_mercenary_captain", name: "Mercenary Captain", title: "Freelance Commander",
    rarity: 3, role: "combined_arms_lead", faction: "mercenary_contractors",
    description: "Versatile mercenary leader who adapts to any situation.",
    lore: "The Mercenary Captain has fought in 30 wars across 12 systems.",
    icon: "💰", portrait: "mercenary_captain.png", color: "#ca8a04",
    gradientFrom: "from-yellow-950", gradientTo: "to-yellow-800",
    baseStats: stats({ attackBonus: 10, defenseBonus: 10, speedBonus: 10, evasionBonus: 10, commandRadius: 3, unitCapacity: 25 }),
    growthRates: stats({ attackBonus: 1.5, defenseBonus: 1.5, speedBonus: 1.5, evasionBonus: 1.5 }),
    maxLevel: 999, maxStarLevel: 20, xpPerLevel: 900,
    passives: [
      { id: "mercenary_tactics", name: "Mercenary Tactics", description: "+5% all stats", effect: stats({ attackBonus: 5, defenseBonus: 5, speedBonus: 5 }), icon: "💰", unlockLevel: 1 },
    ],
    actives: [
      { id: "hire_reinforcements", name: "Hire Reinforcements", description: "Calls in mercenary backup", cooldown: 90, duration: 20, manaCost: 40, effect: stats({ unitCapacity: 15 }), aoeRadius: 3, icon: "👥", unlockLevel: 100 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "mercenary_captain_tree", name: "Mercenary Captain Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["mercenary_contractors"],
    synergyBonusPercent: 15,
    leadershipCapacity: 25,
    shardConversionRate: 0.5,
    duplicateShardReward: 20,
  },

  // ── UNCOMMON (2-star) ───────────────────────────────────────
  {
    id: "ac_green_lieutenant", name: "Green Lieutenant", title: "New Officer",
    rarity: 2, role: "infantry_leader", faction: "terran_legion",
    description: "Fresh out of academy, eager to prove themselves.",
    lore: "The Green Lieutenant graduated top of their class.",
    icon: "🎓", portrait: "green_lieutenant.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ attackBonus: 8, defenseBonus: 5, hpBonus: 5, commandRadius: 2, unitCapacity: 15 }),
    growthRates: stats({ attackBonus: 1, defenseBonus: 1, hpBonus: 1 }),
    maxLevel: 999, maxStarLevel: 15, xpPerLevel: 600,
    passives: [
      { id: "basic_training", name: "Basic Training", description: "+5% attack to all units", effect: stats({ attackBonus: 5 }), icon: "⚔️", unlockLevel: 1 },
    ],
    actives: [
      { id: "rally", name: "Rally", description: "Boosts nearby unit morale", cooldown: 60, duration: 10, manaCost: 20, effect: stats({ moraleBonus: 15 }), aoeRadius: 3, icon: "📢", unlockLevel: 50 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "green_lieutenant_tree", name: "Green Lieutenant Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["infantry_corps"],
    synergyBonusPercent: 10,
    leadershipCapacity: 15,
    shardConversionRate: 0.5,
    duplicateShardReward: 10,
  },
  {
    id: "ac_reserve_corporal", name: "Reserve Corporal", title: "Reserve NCO",
    rarity: 2, role: "defense_overseer", faction: "iron_bastion",
    description: "Reliable NCO who holds the line when needed.",
    lore: "Reserve Corporal has volunteered for 10 defensive operations.",
    icon: "🛡️", portrait: "reserve_corporal.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ defenseBonus: 8, hpBonus: 5, moraleBonus: 5, commandRadius: 2, unitCapacity: 15 }),
    growthRates: stats({ defenseBonus: 1, hpBonus: 1, moraleBonus: 0.5 }),
    maxLevel: 999, maxStarLevel: 15, xpPerLevel: 600,
    passives: [
      { id: "hold_the_line", name: "Hold the Line", description: "+5% defense to all units", effect: stats({ defenseBonus: 5 }), icon: "🛡️", unlockLevel: 1 },
    ],
    actives: [
      { id: "dig_in", name: "Dig In", description: "Entrenches nearby units", cooldown: 75, duration: 15, manaCost: 25, effect: stats({ defenseBonus: 20 }), aoeRadius: 3, icon: "🏰", unlockLevel: 50 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "reserve_corporal_tree", name: "Reserve Corporal Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["heavy_infantry"],
    synergyBonusPercent: 10,
    leadershipCapacity: 15,
    shardConversionRate: 0.5,
    duplicateShardReward: 10,
  },
  {
    id: "ac_recruit_officer", name: "Recruit Officer", title: "Academy Graduate",
    rarity: 2, role: "combined_arms_lead", faction: "crystal_orders",
    description: "Academy graduate with theoretical knowledge.",
    lore: "The Recruit Officer topped their strategy class.",
    icon: "📖", portrait: "recruit_officer.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ initiativeBonus: 8, commandRadius: 2, unitCapacity: 15, moraleBonus: 5 }),
    growthRates: stats({ initiativeBonus: 1, commandRadius: 0.2, moraleBonus: 0.5 }),
    maxLevel: 999, maxStarLevel: 15, xpPerLevel: 600,
    passives: [
      { id: "theoretical_knowledge", name: "Theoretical Knowledge", description: "+5% initiative", effect: stats({ initiativeBonus: 5 }), icon: "📖", unlockLevel: 1 },
    ],
    actives: [
      { id: "tactical_analysis", name: "Tactical Analysis", description: "Analyzes enemy weaknesses", cooldown: 90, duration: 20, manaCost: 25, effect: stats({ accuracyBonus: 15 }), aoeRadius: 5, icon: "🔍", unlockLevel: 50 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "recruit_officer_tree", name: "Recruit Officer Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["command_hq"],
    synergyBonusPercent: 10,
    leadershipCapacity: 15,
    shardConversionRate: 0.5,
    duplicateShardReward: 10,
  },
  {
    id: "ac_drone_operator", name: "Drone Operator", title: "Tech Specialist",
    rarity: 2, role: "cyber_warfare_lead", faction: "necro_forge",
    description: "Basic drone operator with room for growth.",
    lore: "Drone Operator controls a small swarm of recon drones.",
    icon: "🤖", portrait: "drone_operator.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ accuracyBonus: 8, evasionBonus: 5, speedBonus: 5, commandRadius: 2, unitCapacity: 15 }),
    growthRates: stats({ accuracyBonus: 1, evasionBonus: 0.8, speedBonus: 0.8 }),
    maxLevel: 999, maxStarLevel: 15, xpPerLevel: 600,
    passives: [
      { id: "drone_basics", name: "Drone Basics", description: "+5% accuracy to drones", effect: stats({ accuracyBonus: 5 }), icon: "🤖", unlockLevel: 1 },
    ],
    actives: [
      { id: "deploy_recon", name: "Deploy Recon Drone", description: "Sends out recon drone", cooldown: 60, duration: 30, manaCost: 15, effect: stats({ accuracyBonus: 10 }), aoeRadius: 4, icon: "📡", unlockLevel: 50 },
    ],
    auras: [],
    synergies: [],
    skillTree: { id: "drone_operator_tree", name: "Drone Operator Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["cyber_drone"],
    synergyBonusPercent: 10,
    leadershipCapacity: 15,
    shardConversionRate: 0.5,
    duplicateShardReward: 10,
  },

  // ── COMMON (1-star) ─────────────────────────────────────────
  {
    id: "ac_private", name: "Private", title: "Basic Infantry",
    rarity: 1, role: "infantry_leader", faction: "terran_legion",
    description: "Fresh recruit just out of basic training.",
    lore: "Every great commander starts as a private.",
    icon: "👤", portrait: "private.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ attackBonus: 3, defenseBonus: 2, hpBonus: 2, commandRadius: 1, unitCapacity: 10 }),
    growthRates: stats({ attackBonus: 0.5, defenseBonus: 0.5, hpBonus: 0.5 }),
    maxLevel: 999, maxStarLevel: 10, xpPerLevel: 400,
    passives: [
      { id: "basic_discipline", name: "Basic Discipline", description: "+3% attack to all units", effect: stats({ attackBonus: 3 }), icon: "⚔️", unlockLevel: 1 },
    ],
    actives: [],
    auras: [],
    synergies: [],
    skillTree: { id: "private_tree", name: "Private Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["infantry_corps"],
    synergyBonusPercent: 5,
    leadershipCapacity: 10,
    shardConversionRate: 0.5,
    duplicateShardReward: 5,
  },
  {
    id: "ac_conscript", name: "Conscript", title: "Rookie Soldier",
    rarity: 1, role: "defense_overseer", faction: "iron_bastion",
    description: "Untrained conscript thrown into the front lines.",
    lore: "The Conscript learned more in one battle than in a year of training.",
    icon: "👤", portrait: "conscript.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ defenseBonus: 3, hpBonus: 2, moraleBonus: 2, commandRadius: 1, unitCapacity: 10 }),
    growthRates: stats({ defenseBonus: 0.5, hpBonus: 0.5, moraleBonus: 0.3 }),
    maxLevel: 999, maxStarLevel: 10, xpPerLevel: 400,
    passives: [
      { id: "survival_instinct", name: "Survival Instinct", description: "+3% HP to all units", effect: stats({ hpBonus: 3 }), icon: "❤️", unlockLevel: 1 },
    ],
    actives: [],
    auras: [],
    synergies: [],
    skillTree: { id: "conscript_tree", name: "Conscript Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["infantry_corps"],
    synergyBonusPercent: 5,
    leadershipCapacity: 10,
    shardConversionRate: 0.5,
    duplicateShardReward: 5,
  },
  {
    id: "ac_rookie_pilot", name: "Rookie Pilot", title: "Trainee Pilot",
    rarity: 1, role: "air_support_lead", faction: "sky_hunters",
    description: "Just earned their wings, first combat mission.",
    lore: "Rookie Pilot survived their first dogfight against 3 enemy fighters.",
    icon: "👤", portrait: "rookie_pilot.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ speedBonus: 5, evasionBonus: 3, commandRadius: 1, unitCapacity: 10 }),
    growthRates: stats({ speedBonus: 0.8, evasionBonus: 0.5 }),
    maxLevel: 999, maxStarLevel: 10, xpPerLevel: 400,
    passives: [
      { id: "natural_flyer", name: "Natural Flyer", description: "+3% speed to air units", effect: stats({ speedBonus: 3 }), icon: "✈️", unlockLevel: 1 },
    ],
    actives: [],
    auras: [],
    synergies: [],
    skillTree: { id: "rookie_pilot_tree", name: "Rookie Pilot Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["air_forces"],
    synergyBonusPercent: 5,
    leadershipCapacity: 10,
    shardConversionRate: 0.5,
    duplicateShardReward: 5,
  },
  {
    id: "ac_cadet_engineer", name: "Cadet Engineer", title: "Engineering Trainee",
    rarity: 1, role: "engineering_chief", faction: "terran_legion",
    description: "Engineering academy student on their first deployment.",
    lore: "Cadet Engineer repaired a damaged tank under enemy fire.",
    icon: "👤", portrait: "cadet_engineer.png", color: "#94a3b8",
    gradientFrom: "from-slate-950", gradientTo: "to-slate-800",
    baseStats: stats({ defenseBonus: 3, initiativeBonus: 3, commandRadius: 1, unitCapacity: 10 }),
    growthRates: stats({ defenseBonus: 0.5, initiativeBonus: 0.3 }),
    maxLevel: 999, maxStarLevel: 10, xpPerLevel: 400,
    passives: [
      { id: "engineering_basics", name: "Engineering Basics", description: "+3% defense to all units", effect: stats({ defenseBonus: 3 }), icon: "🔧", unlockLevel: 1 },
    ],
    actives: [],
    auras: [],
    synergies: [],
    skillTree: { id: "cadet_engineer_tree", name: "Cadet Engineer Skill Tree", branches: [] },
    mastery: [],
    preferredUnitCategories: ["engineering_corps"],
    synergyBonusPercent: 5,
    leadershipCapacity: 10,
    shardConversionRate: 0.5,
    duplicateShardReward: 5,
  },
];

// ============================================================================
// BANNER DEFINITIONS
// ============================================================================

export const ARMY_GACHA_BANNERS: ArmyGachaBannerConfig[] = [
  {
    id: "army_standard", name: "Standard Recruitment", description: "Standard army commander recruitment banner",
    type: "standard", currency: "army-seal", singlePullCost: 300, multiPullCost: 2700,
    multiPullGuarantee: 10, availableCommanderIds: ARMY_COMMANDERS.map(c => c.id),
    rateUps: [], isActive: true, bannerColor: "#3b82f6", bannerIcon: "⚔️",
  },
  {
    id: "army_beginner", name: "Beginner Recruitment", description: "Guaranteed 3-star+ commander for new players",
    type: "beginner", currency: "free-army-seal", singlePullCost: 0, multiPullCost: 0,
    multiPullGuarantee: 10, availableCommanderIds: ARMY_COMMANDERS.filter(c => c.rarity >= 3).map(c => c.id),
    rateUps: [], isActive: true, bannerColor: "#22c55e", bannerIcon: "🌟",
  },
  {
    id: "army_infantry_focus", name: "Infantry Focus", description: "Rate-up on infantry commanders",
    type: "infantry_focus", currency: "combat-token", singlePullCost: 350, multiPullCost: 3150,
    multiPullGuarantee: 10, availableCommanderIds: ARMY_COMMANDERS.filter(c => c.preferredUnitCategories.includes("infantry_corps")).map(c => c.id),
    rateUps: [{ commanderId: "ac_crimson_blade", rateUpMultiplier: 3 }],
    isActive: true, bannerColor: "#ef4444", bannerIcon: "⚔️",
  },
  {
    id: "army_armor_focus", name: "Armor Focus", description: "Rate-up on armor commanders",
    type: "armor_focus", currency: "combat-token", singlePullCost: 350, multiPullCost: 3150,
    multiPullGuarantee: 10, availableCommanderIds: ARMY_COMMANDERS.filter(c => c.preferredUnitCategories.includes("armored_forces")).map(c => c.id),
    rateUps: [{ commanderId: "ac_iron_marshal", rateUpMultiplier: 3 }],
    isActive: true, bannerColor: "#b91c1c", bannerIcon: "🐉",
  },
  {
    id: "army_legendary", name: "Legendary Recruitment", description: "Guaranteed 4-star+ commander",
    type: "legendary", currency: "veteran-voucher", singlePullCost: 500, multiPullCost: 4500,
    multiPullGuarantee: 10, availableCommanderIds: ARMY_COMMANDERS.filter(c => c.rarity >= 4).map(c => c.id),
    rateUps: [{ commanderId: "ac_war_sage", rateUpMultiplier: 5 }],
    isActive: true, bannerColor: "#f59e0b", bannerIcon: "⭐",
  },
  {
    id: "army_free_daily", name: "Free Daily Pull", description: "One free pull per day",
    type: "free_daily", currency: "free-army-seal", singlePullCost: 0, multiPullCost: 0,
    multiPullGuarantee: 0, availableCommanderIds: ARMY_COMMANDERS.filter(c => c.rarity <= 3).map(c => c.id),
    rateUps: [], isActive: true, bannerColor: "#94a3b8", bannerIcon: "🎁",
  },
];

// ============================================================================
// GACHA STATE DEFAULTS
// ============================================================================

export function createDefaultArmyGachaState(): ArmyGachaState {
  return {
    commanderShards: {},
    ownedCommanders: {},
    bannerPity: {},
    totalPulls: 0,
    currency: {
      "army-seal": 1000,
      "free-army-seal": 300,
      "combat-token": 0,
      "event-badge": 0,
      "veteran-voucher": 0,
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getArmyCommanderById(id: string): ArmyCommanderDefinition | undefined {
  return ARMY_COMMANDERS.find(c => c.id === id);
}

export function getArmyCommandersByRarity(rarity: ArmyCommanderRarity): ArmyCommanderDefinition[] {
  return ARMY_COMMANDERS.filter(c => c.rarity === rarity);
}

export function getArmyCommandersByRole(role: ArmyCommanderRole): ArmyCommanderDefinition[] {
  return ARMY_COMMANDERS.filter(c => c.role === role);
}

export function getArmyCommandersByFaction(faction: ArmyCommanderFaction): ArmyCommanderDefinition[] {
  return ARMY_COMMANDERS.filter(c => c.faction === faction);
}

export function getArmyCommanderStatsAtLevel(
  commander: ArmyCommanderDefinition,
  level: number,
  starLevel: number = 1
): ArmyCommanderStats {
  const rarityMult = ARMY_COMMANDER_RARITY_CONFIG[commander.rarity].statMultiplier;
  const starMult = 1 + (starLevel - 1) * 0.1;

  const result: ArmyCommanderStats = {
    attackBonus: 0, defenseBonus: 0, hpBonus: 0, speedBonus: 0,
    accuracyBonus: 0, evasionBonus: 0, moraleBonus: 0, initiativeBonus: 0,
    commandRadius: 0, unitCapacity: 0,
  };

  for (const key of Object.keys(commander.baseStats) as (keyof ArmyCommanderStats)[]) {
    result[key] = Math.round(
      (commander.baseStats[key] + commander.growthRates[key] * level) * rarityMult * starMult
    );
  }

  return result;
}

export function calculateArmyCommanderPower(
  commander: ArmyCommanderDefinition,
  level: number,
  starLevel: number = 1
): number {
  const stats = getArmyCommanderStatsAtLevel(commander, level, starLevel);
  return Math.round(
    (stats.attackBonus + stats.defenseBonus + stats.hpBonus + stats.speedBonus +
     stats.accuracyBonus + stats.evasionBonus + stats.moraleBonus + stats.initiativeBonus) *
    (1 + starLevel * 0.05)
  );
}

export function getArmyBannerStatus(banner: ArmyGachaBannerConfig): "active" | "upcoming" | "ended" {
  if (!banner.isActive) return "ended";
  if (banner.startDate && Date.now() < banner.startDate) return "upcoming";
  if (banner.endDate && Date.now() > banner.endDate) return "ended";
  return "active";
}
