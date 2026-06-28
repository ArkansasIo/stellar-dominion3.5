// =============================================================================
// Race Guilds Configuration
// Defines the guild system for all 35 NPC races including guild types,
// upgrades, ranks, and bonuses.
// =============================================================================

export type GuildType =
  | "warriors_guild"
  | "scholars_guild"
  | "merchants_guild"
  | "explorers_guild"
  | "engineers_guild"
  | "shadow_guild";

export interface GuildRank {
  name: string;
  minReputation: number;
  bonusMultiplier: number;
  specialPerks: string[];
}

export interface GuildUpgrade {
  id: string;
  name: string;
  description: string;
  cost: { credits: number; reputation: number };
  effect: { type: string; value: number };
  prerequisite?: string;
  maxLevel: number;
}

export interface RaceGuild {
  id: string;
  name: string;
  description: string;
  raceId: string;
  type: GuildType;
  ranks: GuildRank[];
  upgrades: GuildUpgrade[];
  memberBonuses: {
    combat: number;
    research: number;
    economy: number;
    diplomacy: number;
  };
  minReputation: number;
  joinCost: number;
  upkeepCost: number;
  color: string;
  emblem: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function getGuildById(id: string): RaceGuild | undefined {
  return RACE_GUILDS.find((g) => g.id === id);
}

export function getGuildsForRace(raceId: string): RaceGuild[] {
  return RACE_GUILDS.filter((g) => g.raceId === raceId);
}

export function getGuildType(guildType: GuildType): RaceGuild[] {
  return RACE_GUILDS.filter((g) => g.type === guildType);
}

export function calculateGuildBonus(
  guild: RaceGuild,
  rank: number,
  upgrades: string[]
): { combat: number; research: number; economy: number; diplomacy: number } {
  const rankData = guild.ranks[Math.min(rank, guild.ranks.length - 1)];
  const multiplier = rankData?.bonusMultiplier ?? 1;
  let upgradeBonus = 0;
  for (const uid of upgrades) {
    const upg = guild.upgrades.find((u) => u.id === uid);
    if (upg) upgradeBonus += upg.effect.value;
  }
  return {
    combat: guild.memberBonuses.combat * multiplier + (guild.type === "warriors_guild" ? upgradeBonus : 0),
    research: guild.memberBonuses.research * multiplier + (guild.type === "scholars_guild" ? upgradeBonus : 0),
    economy: guild.memberBonuses.economy * multiplier + (guild.type === "merchants_guild" ? upgradeBonus : 0),
    diplomacy: guild.memberBonuses.diplomacy * multiplier,
  };
}

export function getGuildRank(
  guild: RaceGuild,
  reputation: number
): { rank: GuildRank; index: number } {
  let idx = 0;
  for (let i = guild.ranks.length - 1; i >= 0; i--) {
    if (reputation >= guild.ranks[i].minReputation) {
      idx = i;
      break;
    }
  }
  return { rank: guild.ranks[idx], index: idx };
}

export function getUpgradeCost(
  upgrade: GuildUpgrade,
  currentLevel: number
): { credits: number; reputation: number } {
  const scale = 1 + currentLevel * 0.5;
  return {
    credits: Math.floor(upgrade.cost.credits * scale),
    reputation: Math.floor(upgrade.cost.reputation * scale),
  };
}

// =============================================================================
// Shared Rank Templates
// =============================================================================

const WARRIOR_RANKS: GuildRank[] = [
  { name: "Recruit", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Basic combat training"] },
  { name: "Soldier", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Improved weapon handling"] },
  { name: "Veteran", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Squadron command", "+10% fleet damage"] },
  { name: "Champion", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Elite unit access", "+20% shield strength"] },
  { name: "Warlord", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Legendary status", "Unique fleet bonus", "War council access"] },
];

const SCHOLAR_RANKS: GuildRank[] = [
  { name: "Apprentice", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Access to basic research"] },
  { name: "Researcher", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Improved analysis"] },
  { name: "Scholar", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Lab access", "+10% research speed"] },
  { name: "Master Scholar", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Advanced tech unlocks", "+20% anomaly rewards"] },
  { name: "Archon of Knowledge", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Legendary insights", "Unique tech tree", "Knowledge council"] },
];

const MERCHANT_RANKS: GuildRank[] = [
  { name: "Peddler", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Basic trade license"] },
  { name: "Trader", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Market access"] },
  { name: "Merchant", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Bulk trading", "+10% trade income"] },
  { name: "Trade Baron", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Monopoly rights", "+20% resource yield"] },
  { name: "Trade Emperor", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Galactic market control", "Unique trade routes", "Trade council"] },
];

const EXPLORER_RANKS: GuildRank[] = [
  { name: "Scout", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Basic survey tools"] },
  { name: "Pathfinder", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Improved sensors"] },
  { name: "Explorer", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Deep space access", "+10% scan range"] },
  { name: "Voyager", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Anomaly detection", "+20% discovery chance"] },
  { name: "Galactic Pioneer", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Legendary explorer", "Unique discoveries", "Explorer council"] },
];

const ENGINEER_RANKS: GuildRank[] = [
  { name: "Technician", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Basic construction"] },
  { name: "Engineer", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Improved build speed"] },
  { name: "Senior Engineer", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Advanced blueprints", "+10% defense rating"] },
  { name: "Master Builder", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Station capacity +2", "+20% build speed"] },
  { name: "Architect Supreme", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Legendary constructions", "Unique structures", "Engineer council"] },
];

const SHADOW_RANKS: GuildRank[] = [
  { name: "Initiate", minReputation: 0, bonusMultiplier: 1.0, specialPerks: ["Basic tradecraft"] },
  { name: "Agent", minReputation: 200, bonusMultiplier: 1.2, specialPerks: ["Improved infiltration"] },
  { name: "Shadow Operative", minReputation: 500, bonusMultiplier: 1.5, specialPerks: ["Counter-intel access", "+10% espionage success"] },
  { name: "Spymaster", minReputation: 1000, bonusMultiplier: 2.0, specialPerks: ["Sabotage mastery", "+20% sabotage power"] },
  { name: "Shadow Sovereign", minReputation: 2000, bonusMultiplier: 3.0, specialPerks: ["Legendary shadow", "Unique operations", "Shadow council"] },
];

// =============================================================================
// Shared Upgrade Templates
// =============================================================================

function warriorUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-fleet-power`, name: "Fleet Power", description: "Increases fleet attack power", cost: { credits: 500, reputation: 50 }, effect: { type: "fleet_attack", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-shield-strength`, name: "Shield Strength", description: "Improves shield durability", cost: { credits: 400, reputation: 40 }, effect: { type: "shield_hp", value: 8 }, maxLevel: 10 },
    { id: `${guildId}-weapon-damage`, name: "Weapon Damage", description: "Boosts weapon damage output", cost: { credits: 600, reputation: 60 }, effect: { type: "weapon_damage", value: 6 }, prerequisite: `${guildId}-fleet-power`, maxLevel: 10 },
    { id: `${guildId}-hull-armor`, name: "Hull Armor", description: "Reinforces hull plating", cost: { credits: 450, reputation: 45 }, effect: { type: "hull_armor", value: 10 }, maxLevel: 10 },
    { id: `${guildId}-combat-training`, name: "Combat Training", description: "Trains crew for combat efficiency", cost: { credits: 300, reputation: 30 }, effect: { type: "crew_combat", value: 3 }, maxLevel: 5 },
    { id: `${guildId}-fleet-coordination`, name: "Fleet Coordination", description: "Improves fleet formation bonuses", cost: { credits: 700, reputation: 70 }, effect: { type: "fleet_coordination", value: 4 }, prerequisite: `${guildId}-combat-training`, maxLevel: 8 },
    { id: `${guildId}-weapon-tech`, name: "Advanced Weaponry", description: "Unlocks advanced weapon systems", cost: { credits: 1000, reputation: 100 }, effect: { type: "weapon_tech", value: 1 }, prerequisite: `${guildId}-weapon-damage`, maxLevel: 3 },
    { id: `${guildId}-shield-tech`, name: "Shield Harmonics", description: "Improves shield regeneration", cost: { credits: 800, reputation: 80 }, effect: { type: "shield_regen", value: 2 }, prerequisite: `${guildId}-shield-strength`, maxLevel: 5 },
    { id: `${guildId}-morale`, name: "Warrior Spirit", description: "Boosts crew morale and performance", cost: { credits: 350, reputation: 35 }, effect: { type: "morale", value: 5 }, maxLevel: 5 },
    { id: `${guildId}-tactics`, name: "Battle Tactics", description: "Unlocks special combat formations", cost: { credits: 900, reputation: 90 }, effect: { type: "tactics", value: 1 }, prerequisite: `${guildId}-fleet-coordination`, maxLevel: 3 },
    { id: `${guildId}-elite-forces`, name: "Elite Forces", description: "Trains elite combat units", cost: { credits: 1200, reputation: 120 }, effect: { type: "elite_units", value: 1 }, prerequisite: `${guildId}-weapon-tech`, maxLevel: 3 },
    { id: `${guildId}-war-doctrine`, name: "War Doctrine", description: "Establishes combat doctrine bonuses", cost: { credits: 1500, reputation: 150 }, effect: { type: "war_doctrine", value: 2 }, prerequisite: `${guildId}-tactics`, maxLevel: 5 },
  ];
}

function scholarUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-research-speed`, name: "Research Acceleration", description: "Increases research speed", cost: { credits: 500, reputation: 50 }, effect: { type: "research_speed", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-tech-unlock`, name: "Technology Unlock", description: "Unlocks advanced research topics", cost: { credits: 600, reputation: 60 }, effect: { type: "tech_unlock", value: 1 }, maxLevel: 5 },
    { id: `${guildId}-anomaly-rewards`, name: "Anomaly Analysis", description: "Improves anomaly investigation rewards", cost: { credits: 400, reputation: 40 }, effect: { type: "anomaly_reward", value: 8 }, maxLevel: 10 },
    { id: `${guildId}-data-processing`, name: "Data Processing", description: "Enhances computational capabilities", cost: { credits: 350, reputation: 35 }, effect: { type: "data_processing", value: 6 }, maxLevel: 8 },
    { id: `${guildId}-lab-efficiency`, name: "Laboratory Efficiency", description: "Improves lab resource usage", cost: { credits: 450, reputation: 45 }, effect: { type: "lab_efficiency", value: 5 }, prerequisite: `${guildId}-research-speed`, maxLevel: 5 },
    { id: `${guildId}-xeno-studies`, name: "Xenobiology Studies", description: "Improves alien species research", cost: { credits: 500, reputation: 50 }, effect: { type: "xeno_research", value: 4 }, maxLevel: 8 },
    { id: `${guildId}-quantum-theory`, name: "Quantum Theory", description: "Unlocks quantum research field", cost: { credits: 800, reputation: 80 }, effect: { type: "quantum_research", value: 3 }, prerequisite: `${guildId}-tech-unlock`, maxLevel: 5 },
    { id: `${guildId}-academic-network`, name: "Academic Network", description: "Shares research across departments", cost: { credits: 600, reputation: 60 }, effect: { type: "research_sharing", value: 4 }, maxLevel: 5 },
    { id: `${guildId}-theoretical-physics`, name: "Theoretical Physics", description: "Advances theoretical research", cost: { credits: 700, reputation: 70 }, effect: { type: "theoretical_research", value: 3 }, prerequisite: `${guildId}-quantum-theory`, maxLevel: 5 },
    { id: `${guildId}-innovation`, name: "Innovation Pipeline", description: "Speeds tech breakthrough discovery", cost: { credits: 900, reputation: 90 }, effect: { type: "innovation_speed", value: 4 }, prerequisite: `${guildId}-lab-efficiency`, maxLevel: 5 },
    { id: `${guildId}-knowledge-base`, name: "Knowledge Archive", description: "Expands research knowledge base", cost: { credits: 500, reputation: 50 }, effect: { type: "knowledge_pool", value: 5 }, maxLevel: 8 },
    { id: `${guildId}-breakthrough`, name: "Research Breakthrough", description: "Chance for instant research completion", cost: { credits: 1200, reputation: 120 }, effect: { type: "breakthrough_chance", value: 2 }, prerequisite: `${guildId}-innovation`, maxLevel: 3 },
  ];
}

function merchantUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-trade-income`, name: "Trade Routes", description: "Increases trade route income", cost: { credits: 500, reputation: 50 }, effect: { type: "trade_income", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-resource-yield`, name: "Resource Yield", description: "Improves resource extraction", cost: { credits: 400, reputation: 40 }, effect: { type: "resource_yield", value: 6 }, maxLevel: 10 },
    { id: `${guildId}-market-fees`, name: "Market Negotiation", description: "Reduces market transaction fees", cost: { credits: 350, reputation: 35 }, effect: { type: "market_fee_reduction", value: 3 }, maxLevel: 8 },
    { id: `${guildId}-bargaining`, name: "Bargaining Skills", description: "Improves deal negotiation", cost: { credits: 300, reputation: 30 }, effect: { type: "bargaining", value: 4 }, maxLevel: 5 },
    { id: `${guildId}-logistics`, name: "Trade Logistics", description: "Increases cargo capacity", cost: { credits: 600, reputation: 60 }, effect: { type: "cargo_capacity", value: 8 }, prerequisite: `${guildId}-trade-income`, maxLevel: 8 },
    { id: `${guildId}-black-market`, name: "Black Market Access", description: "Unlocks rare goods trading", cost: { credits: 800, reputation: 80 }, effect: { type: "black_market", value: 1 }, maxLevel: 3 },
    { id: `${guildId}-supply-chains`, name: "Supply Chains", description: "Optimizes supply chain efficiency", cost: { credits: 500, reputation: 50 }, effect: { type: "supply_efficiency", value: 5 }, prerequisite: `${guildId}-logistics`, maxLevel: 5 },
    { id: `${guildId}-monopoly`, name: "Market Monopoly", description: "Dominates specific commodity markets", cost: { credits: 1000, reputation: 100 }, effect: { type: "monopoly_bonus", value: 4 }, prerequisite: `${guildId}-bargaining`, maxLevel: 3 },
    { id: `${guildId}-smuggling`, name: "Smuggling Routes", description: "Establishes covert trade routes", cost: { credits: 700, reputation: 70 }, effect: { type: "smuggling_income", value: 3 }, maxLevel: 5 },
    { id: `${guildId}-financial-instruments`, name: "Financial Instruments", description: "Unlocks advanced financial tools", cost: { credits: 900, reputation: 90 }, effect: { type: "financial_tools", value: 2 }, prerequisite: `${guildId}-monopoly`, maxLevel: 5 },
    { id: `${guildId}-galactic-bank`, name: "Galactic Banking", description: "Establishes banking network", cost: { credits: 1200, reputation: 120 }, effect: { type: "banking_network", value: 3 }, prerequisite: `${guildId}-financial-instruments`, maxLevel: 3 },
    { id: `${guildId}-trade-empire`, name: "Trade Empire", description: "Massive trade network bonuses", cost: { credits: 1500, reputation: 150 }, effect: { type: "trade_empire", value: 5 }, prerequisite: `${guildId}-galactic-bank`, maxLevel: 3 },
  ];
}

function explorerUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-scan-range`, name: "Scan Range", description: "Increases sensor scan range", cost: { credits: 400, reputation: 40 }, effect: { type: "scan_range", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-discovery-chance`, name: "Discovery Chance", description: "Improves chance of discoveries", cost: { credits: 500, reputation: 50 }, effect: { type: "discovery_chance", value: 4 }, maxLevel: 10 },
    { id: `${guildId}-anomaly-detection`, name: "Anomaly Detection", description: "Better anomaly detection range", cost: { credits: 450, reputation: 45 }, effect: { type: "anomaly_detection", value: 6 }, maxLevel: 8 },
    { id: `${guildId}-survey-tools`, name: "Survey Tools", description: "Improves planetary survey accuracy", cost: { credits: 350, reputation: 35 }, effect: { type: "survey_accuracy", value: 5 }, maxLevel: 5 },
    { id: `${guildId}-navigation`, name: "Advanced Navigation", description: "Improves warp path efficiency", cost: { credits: 500, reputation: 50 }, effect: { type: "navigation_speed", value: 4 }, prerequisite: `${guildId}-scan-range`, maxLevel: 5 },
    { id: `${guildId}-deep-scan`, name: "Deep Space Scanning", description: "Unlocks deep space scan capabilities", cost: { credits: 700, reputation: 70 }, effect: { type: "deep_scan", value: 3 }, maxLevel: 5 },
    { id: `${guildId}-first-contact`, name: "First Contact Protocols", description: "Improves first contact diplomacy", cost: { credits: 600, reputation: 60 }, effect: { type: "first_contact", value: 4 }, prerequisite: `${guildId}-discovery-chance`, maxLevel: 5 },
    { id: `${guildId}-stellar-mapping`, name: "Stellar Mapping", description: "Creates detailed star charts", cost: { credits: 500, reputation: 50 }, effect: { type: "stellar_map", value: 5 }, maxLevel: 8 },
    { id: `${guildId}-xeno-archaeology`, name: "Xenoarchaeology", description: "Unlocks ancient artifact recovery", cost: { credits: 800, reputation: 80 }, effect: { type: "xeno_archaeology", value: 2 }, prerequisite: `${guildId}-anomaly-detection`, maxLevel: 5 },
    { id: `${guildId}-expedition`, name: "Expedition Planning", description: "Improves expedition efficiency", cost: { credits: 600, reputation: 60 }, effect: { type: "expedition_efficiency", value: 4 }, prerequisite: `${guildId}-navigation`, maxLevel: 5 },
    { id: `${guildId}-frontier-science`, name: "Frontier Science", description: "Advanced research in uncharted space", cost: { credits: 900, reputation: 90 }, effect: { type: "frontier_research", value: 3 }, prerequisite: `${guildId}-deep-scan`, maxLevel: 3 },
    { id: `${guildId}-cosmic-insight`, name: "Cosmic Insight", description: "Chance for rare cosmic discoveries", cost: { credits: 1100, reputation: 110 }, effect: { type: "cosmic_discovery", value: 2 }, prerequisite: `${guildId}-frontier-science`, maxLevel: 3 },
  ];
}

function engineerUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-build-speed`, name: "Build Speed", description: "Increases construction speed", cost: { credits: 500, reputation: 50 }, effect: { type: "build_speed", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-defense-rating`, name: "Defense Rating", description: "Improves station defense", cost: { credits: 450, reputation: 45 }, effect: { type: "defense_rating", value: 6 }, maxLevel: 10 },
    { id: `${guildId}-station-capacity`, name: "Station Capacity", description: "Increases maximum stations", cost: { credits: 600, reputation: 60 }, effect: { type: "station_capacity", value: 1 }, maxLevel: 5 },
    { id: `${guildId}-structural-integrity`, name: "Structural Integrity", description: "Improves structure durability", cost: { credits: 400, reputation: 40 }, effect: { type: "structural_hp", value: 8 }, maxLevel: 8 },
    { id: `${guildId}-automation`, name: "Automation Systems", description: "Automates construction processes", cost: { credits: 700, reputation: 70 }, effect: { type: "automation_level", value: 3 }, prerequisite: `${guildId}-build-speed`, maxLevel: 5 },
    { id: `${guildId}-energy-systems`, name: "Energy Systems", description: "Improves power generation", cost: { credits: 500, reputation: 50 }, effect: { type: "energy_output", value: 5 }, maxLevel: 8 },
    { id: `${guildId}-advanced-materials`, name: "Advanced Materials", description: "Unlocks stronger building materials", cost: { credits: 800, reputation: 80 }, effect: { type: "material_quality", value: 4 }, prerequisite: `${guildId}-structural-integrity`, maxLevel: 5 },
    { id: `${guildId}-modular-design`, name: "Modular Design", description: "Flexible station configurations", cost: { credits: 600, reputation: 60 }, effect: { type: "modular_bonus", value: 4 }, prerequisite: `${guildId}-station-capacity`, maxLevel: 5 },
    { id: `${guildId}-repair-drones`, name: "Repair Drones", description: "Automated repair systems", cost: { credits: 550, reputation: 55 }, effect: { type: "repair_speed", value: 4 }, maxLevel: 8 },
    { id: `${guildId}-quantum-engineering`, name: "Quantum Engineering", description: "Advanced quantum construction", cost: { credits: 900, reputation: 90 }, effect: { type: "quantum_build", value: 3 }, prerequisite: `${guildId}-automation`, maxLevel: 3 },
    { id: `${guildId}-megastructure`, name: "Megastructure Tech", description: "Enables megastructure construction", cost: { credits: 1200, reputation: 120 }, effect: { type: "megastructure", value: 1 }, prerequisite: `${guildId}-advanced-materials`, maxLevel: 3 },
    { id: `${guildId}-perfect-form`, name: "Perfect Form", description: "Ultimate construction efficiency", cost: { credits: 1500, reputation: 150 }, effect: { type: "perfect_build", value: 2 }, prerequisite: `${guildId}-megastructure`, maxLevel: 3 },
  ];
}

function shadowUpgrades(guildId: string): GuildUpgrade[] {
  return [
    { id: `${guildId}-espionage-success`, name: "Espionage Mastery", description: "Increases spy mission success", cost: { credits: 500, reputation: 50 }, effect: { type: "espionage_success", value: 5 }, maxLevel: 10 },
    { id: `${guildId}-counter-intel`, name: "Counter-Intelligence", description: "Defends against enemy spies", cost: { credits: 450, reputation: 45 }, effect: { type: "counter_intel", value: 6 }, maxLevel: 10 },
    { id: `${guildId}-sabotage-power`, name: "Sabotage Operations", description: "Increases sabotage damage", cost: { credits: 600, reputation: 60 }, effect: { type: "sabotage_power", value: 4 }, maxLevel: 8 },
    { id: `${guildId}-infiltration`, name: "Infiltration", description: "Improves agent cover maintenance", cost: { credits: 400, reputation: 40 }, effect: { type: "infiltration", value: 5 }, maxLevel: 5 },
    { id: `${guildId}-dead-drop`, name: "Dead Drop Network", description: "Secure communication channels", cost: { credits: 350, reputation: 35 }, effect: { type: "comm_security", value: 6 }, prerequisite: `${guildId}-infiltration`, maxLevel: 5 },
    { id: `${guildId}-assassination`, name: "Assassination Ops", description: "High-risk elimination missions", cost: { credits: 800, reputation: 80 }, effect: { type: "assassination_power", value: 3 }, maxLevel: 5 },
    { id: `${guildId}-intel-network`, name: "Intelligence Network", description: "Expands spy network coverage", cost: { credits: 700, reputation: 70 }, effect: { type: "intel_coverage", value: 4 }, prerequisite: `${guildId}-espionage-success`, maxLevel: 5 },
    { id: `${guildId}-disinformation`, name: "Disinformation", description: "Spreads false intelligence", cost: { credits: 500, reputation: 50 }, effect: { type: "disinfo_power", value: 4 }, maxLevel: 8 },
    { id: `${guildId}-black-ops`, name: "Black Operations", description: "Covert military operations", cost: { credits: 900, reputation: 90 }, effect: { type: "black_ops", value: 3 }, prerequisite: `${guildId}-sabotage-power`, maxLevel: 3 },
    { id: `${guildId}-mind-control`, name: "Subversion", description: "Converts enemy agents", cost: { credits: 1000, reputation: 100 }, effect: { type: "subversion", value: 2 }, prerequisite: `${guildId}-intel-network`, maxLevel: 3 },
    { id: `${guildId}-shadow-council`, name: "Shadow Council", description: "Ultimate covert authority", cost: { credits: 1200, reputation: 120 }, effect: { type: "shadow_authority", value: 3 }, prerequisite: `${guildId}-mind-control`, maxLevel: 3 },
    { id: `${guildId}-shadow-ascension`, name: "Shadow Ascension", description: "Become a shadow legend", cost: { credits: 1500, reputation: 150 }, effect: { type: "shadow_legend", value: 2 }, prerequisite: `${guildId}-shadow-council`, maxLevel: 1 },
  ];
}

// =============================================================================
// All Race Guilds (35 Races)
// =============================================================================

export const RACE_GUILDS: RaceGuild[] = [
  // =========================================================================
  // MILITARY FACTIONS
  // =========================================================================

  // Terran Federation - Warriors + Engineers
  {
    id: "guild-terran-warriors",
    name: "Terran Defense Corps",
    description: "Elite combat training and fleet command for the Terran Federation",
    raceId: "race-terran-federation",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-terran-warriors"),
    memberBonuses: { combat: 15, research: 2, economy: 3, diplomacy: 5 },
    minReputation: 0,
    joinCost: 500,
    upkeepCost: 50,
    color: "#1a5276",
    emblem: "shield-cross",
  },
  {
    id: "guild-terran-engineers",
    name: "Starfleet Corps of Engineers",
    description: "Advanced construction and defense engineering",
    raceId: "race-terran-federation",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-terran-engineers"),
    memberBonuses: { combat: 3, research: 5, economy: 8, diplomacy: 2 },
    minReputation: 100,
    joinCost: 400,
    upkeepCost: 40,
    color: "#2e86c1",
    emblem: "gear-star",
  },

  // Klingon Empire - Warriors
  {
    id: "guild-klingon-warriors",
    name: "Klingon High Council Warriors",
    description: "The proud warrior tradition of the Klingon Empire",
    raceId: "race-klingon-empire",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-klingon-warriors"),
    memberBonuses: { combat: 20, research: 0, economy: 2, diplomacy: -2 },
    minReputation: 0,
    joinCost: 300,
    upkeepCost: 30,
    color: "#922b21",
    emblem: "bat-leth",
  },

  // Romulan Star Empire - Warriors + Shadow
  {
    id: "guild-romulan-warriors",
    name: "Romulan Imperial Guard",
    description: "Elite military force of the Romulan Star Empire",
    raceId: "race-romulan-star-empire",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-romulan-warriors"),
    memberBonuses: { combat: 18, research: 3, economy: 3, diplomacy: 0 },
    minReputation: 0,
    joinCost: 500,
    upkeepCost: 50,
    color: "#1e8449",
    emblem: "bird-of-prey",
  },
  {
    id: "guild-romulan-shadow",
    name: "Tal Shiar Intelligence",
    description: "The feared secret police of the Romulan Empire",
    raceId: "race-romulan-star-empire",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-romulan-shadow"),
    memberBonuses: { combat: 5, research: 3, economy: 2, diplomacy: -5 },
    minReputation: 200,
    joinCost: 800,
    upkeepCost: 80,
    color: "#0e6655",
    emblem: "hawk-eye",
  },

  // Cardassian Union - Warriors + Shadow
  {
    id: "guild-cardassian-warriors",
    name: "Cardassian military",
    description: "The disciplined military of the Cardassian Union",
    raceId: "race-cardassian-union",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-cardassian-warriors"),
    memberBonuses: { combat: 16, research: 1, economy: 5, diplomacy: -1 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#7d6608",
    emblem: "arch-cobra",
  },
  {
    id: "guild-cardassian-obsidian",
    name: "Obsidian Order",
    description: "Intelligence and enforcement arm of Cardassia",
    raceId: "race-cardassian-union",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-cardassian-obsidian"),
    memberBonuses: { combat: 8, research: 2, economy: 3, diplomacy: -3 },
    minReputation: 150,
    joinCost: 600,
    upkeepCost: 60,
    color: "#6e2c00",
    emblem: "obsidian-eye",
  },

  // Gorn Hegemony - Warriors
  {
    id: "guild-gorn-warriors",
    name: "Gorn Hegemony Warriors",
    description: "Fearsome reptilian combat forces",
    raceId: "race-gorn-hegemony",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-gorn-warriors"),
    memberBonuses: { combat: 22, research: 0, economy: 1, diplomacy: -3 },
    minReputation: 0,
    joinCost: 250,
    upkeepCost: 25,
    color: "#27ae60",
    emblem: "claw-mark",
  },

  // Orion Syndicate - Warriors + Shadow
  {
    id: "guild-orion-warriors",
    name: "Orion Syndicate Enforcers",
    description: "Muscle and enforcement for the Orion Syndicate",
    raceId: "race-orion-syndicate",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-orion-warriors"),
    memberBonuses: { combat: 15, research: 0, economy: 8, diplomacy: 0 },
    minReputation: 0,
    joinCost: 350,
    upkeepCost: 35,
    color: "#229954",
    emblem: "green-hand",
  },
  {
    id: "guild-orion-shadow",
    name: "Orion Shadow Network",
    description: "Covert operations and smuggling intelligence",
    raceId: "race-orion-syndicate",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-orion-shadow"),
    memberBonuses: { combat: 3, research: 0, economy: 12, diplomacy: 0 },
    minReputation: 100,
    joinCost: 400,
    upkeepCost: 40,
    color: "#1abc9c",
    emblem: "shadow-clover",
  },

  // Nausicaan Clans - Warriors
  {
    id: "guild-nausicaan-warriors",
    name: "Nausicaan Warband",
    description: "Brutal warriors of the Nausicaan Clans",
    raceId: "race-nausicaan-clans",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-nausicaan-warriors"),
    memberBonuses: { combat: 25, research: -2, economy: 0, diplomacy: -5 },
    minReputation: 0,
    joinCost: 200,
    upkeepCost: 20,
    color: "#7f8c8d",
    emblem: "skull-chain",
  },

  // Hirogen Hunters - Warriors + Explorers
  {
    id: "guild-hirogen-warriors",
    name: "Hirogen Hunting Party",
    description: "The greatest hunters in the quadrant",
    raceId: "race-hirogen-hunters",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-hirogen-warriors"),
    memberBonuses: { combat: 20, research: 2, economy: 0, diplomacy: -2 },
    minReputation: 0,
    joinCost: 300,
    upkeepCost: 30,
    color: "#b7950b",
    emblem: "hunter-cross",
  },
  {
    id: "guild-hirogen-explorers",
    name: "Hirogen Tracking Corps",
    description: "Scouting and prey tracking operations",
    raceId: "race-hirogen-hunters",
    type: "explorers_guild",
    ranks: EXPLORER_RANKS,
    upgrades: explorerUpgrades("guild-hirogen-explorers"),
    memberBonuses: { combat: 8, research: 3, economy: 2, diplomacy: 0 },
    minReputation: 100,
    joinCost: 350,
    upkeepCost: 35,
    color: "#d4ac0d",
    emblem: "prey-sight",
  },

  // =========================================================================
  // SCIENCE FACTIONS
  // =========================================================================

  // Vulcan Science Directorate - Scholars
  {
    id: "guild-vulcan-scholars",
    name: "Vulcan Science Academy",
    description: "Pinnacle of logical scientific inquiry",
    raceId: "race-vulcan-science-directorate",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-vulcan-scholars"),
    memberBonuses: { combat: 2, research: 20, economy: 5, diplomacy: 8 },
    minReputation: 0,
    joinCost: 600,
    upkeepCost: 60,
    color: "#5b2c6f",
    emblem: "idic",
  },

  // Borg Collective - Scholars + Engineers
  {
    id: "guild-borg-scholars",
    name: "Borg Collective Assimilation",
    description: "Knowledge absorption and technological perfection",
    raceId: "race-borg-collective",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-borg-scholars"),
    memberBonuses: { combat: 5, research: 22, economy: 5, diplomacy: -10 },
    minReputation: 0,
    joinCost: 0,
    upkeepCost: 0,
    color: "#1c2833",
    emblem: "hive-hex",
  },
  {
    id: "guild-borg-engineers",
    name: "Borg Engineering Collective",
    description: "Adapting and improving all technology",
    raceId: "race-borg-collective",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-borg-engineers"),
    memberBonuses: { combat: 5, research: 10, economy: 5, diplomacy: -8 },
    minReputation: 100,
    joinCost: 0,
    upkeepCost: 0,
    color: "#17202a",
    emblem: "adapt-grid",
  },

  // Species 8472 - Scholars + Warriors
  {
    id: "guild-8472-scholars",
    name: "Species 8472 Collective Mind",
    description: "Organic perfection through biological knowledge",
    raceId: "race-species-8472",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-8472-scholars"),
    memberBonuses: { combat: 8, research: 18, economy: 0, diplomacy: -5 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#00ff88",
    emblem: "bio-flower",
  },
  {
    id: "guild-8472-warriors",
    name: "Species 8472 War Fleet",
    description: "Devastating biological combat forces",
    raceId: "race-species-8472",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-8472-warriors"),
    memberBonuses: { combat: 20, research: 5, economy: 0, diplomacy: -8 },
    minReputation: 100,
    joinCost: 300,
    upkeepCost: 30,
    color: "#00cc66",
    emblem: "bio-ship",
  },

  // Bynar System - Scholars + Engineers
  {
    id: "guild-bynar-scholars",
    name: "Bynar Data Archive",
    description: "Twin-processor research and data analysis",
    raceId: "race-bynar-system",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-bynar-scholars"),
    memberBonuses: { combat: 0, research: 20, economy: 8, diplomacy: 5 },
    minReputation: 0,
    joinCost: 500,
    upkeepCost: 50,
    color: "#85929e",
    emblem: "twin-circuit",
  },
  {
    id: "guild-bynar-engineers",
    name: "Bynar Systems Integration",
    description: "Perfect system optimization and construction",
    raceId: "race-bynar-system",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-bynar-engineers"),
    memberBonuses: { combat: 0, research: 10, economy: 12, diplomacy: 3 },
    minReputation: 100,
    joinCost: 450,
    upkeepCost: 45,
    color: "#7f8c8d",
    emblem: "data-weave",
  },

  // Voth - Scholars
  {
    id: "guild-voth-scholars",
    name: "Voth Ministry of Science",
    description: "Ancient scientific knowledge and doctrine",
    raceId: "race-voth",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-voth-scholars"),
    memberBonuses: { combat: 5, research: 18, economy: 5, diplomacy: 3 },
    minReputation: 0,
    joinCost: 550,
    upkeepCost: 55,
    color: "#2c3e50",
    emblem: "temporal-spiral",
  },

  // Caretaker Species - Scholars + Explorers
  {
    id: "guild-caretaker-scholars",
    name: "Caretaker Knowledge Array",
    description: "Preserving knowledge across dimensions",
    raceId: "race-caretaker-species",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-caretaker-scholars"),
    memberBonuses: { combat: 0, research: 22, economy: 3, diplomacy: 8 },
    minReputation: 0,
    joinCost: 700,
    upkeepCost: 70,
    color: "#f39c12",
    emblem: "array-star",
  },
  {
    id: "guild-caretaker-explorers",
    name: "Caretaker Dimensional Survey",
    description: "Mapping the transwarp pathways",
    raceId: "race-caretaker-species",
    type: "explorers_guild",
    ranks: EXPLORER_RANKS,
    upgrades: explorerUpgrades("guild-caretaker-explorers"),
    memberBonuses: { combat: 0, research: 10, economy: 2, diplomacy: 5 },
    minReputation: 200,
    joinCost: 600,
    upkeepCost: 60,
    color: "#e67e22",
    emblem: "portal-ring",
  },

  // Changelings - Scholars + Shadow
  {
    id: "guild-changeling-scholars",
    name: "Great Link Collective",
    description: "Shared shape-shifting knowledge and history",
    raceId: "race-changelings",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-changeling-scholars"),
    memberBonuses: { combat: 3, research: 15, economy: 3, diplomacy: 5 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#d4ac0d",
    emblem: "link-drop",
  },
  {
    id: "guild-changeling-shadow",
    name: "Changeling Infiltration Corps",
    description: "Master infiltrators and intelligence operatives",
    raceId: "race-changelings",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-changeling-shadow"),
    memberBonuses: { combat: 5, research: 3, economy: 5, diplomacy: -2 },
    minReputation: 100,
    joinCost: 500,
    upkeepCost: 50,
    color: "#f1c40f",
    emblem: "mimic-face",
  },

  // =========================================================================
  // TRADE FACTIONS
  // =========================================================================

  // Ferengi Alliance - Merchants
  {
    id: "guild-ferengi-merchants",
    name: "Ferengi Commerce Authority",
    description: "The ultimate authority on profit and trade",
    raceId: "race-ferengi-alliance",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-ferengi-merchants"),
    memberBonuses: { combat: 0, research: 2, economy: 25, diplomacy: 5 },
    minReputation: 0,
    joinCost: 300,
    upkeepCost: 30,
    color: "#f1c40f",
    emblem: "gold-pressed",
  },

  // Bajoran Resistance - Merchants + Warriors
  {
    id: "guild-bajoran-merchants",
    name: "Bajoran Cooperative Trade",
    description: "Rebuilding through commerce and trade",
    raceId: "race-bajoran-resistance",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-bajoran-merchants"),
    memberBonuses: { combat: 5, research: 5, economy: 15, diplomacy: 10 },
    minReputation: 0,
    joinCost: 350,
    upkeepCost: 35,
    color: "#8e44ad",
    emblem: "orb-light",
  },
  {
    id: "guild-bajoran-warriors",
    name: "Bajoran Militia",
    description: "Protecting Bajoran interests through strength",
    raceId: "race-bajoran-resistance",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-bajoran-warriors"),
    memberBonuses: { combat: 12, research: 2, economy: 5, diplomacy: 5 },
    minReputation: 100,
    joinCost: 300,
    upkeepCost: 30,
    color: "#9b59b6",
    emblem: "orb-defense",
  },

  // Betazoid Confederacy - Merchants + Scholars
  {
    id: "guild-betazoid-merchants",
    name: "Betazoid Telepathic Trading",
    description: "Empathic negotiation and trade mastery",
    raceId: "race-betazoid-confederacy",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-betazoid-merchants"),
    memberBonuses: { combat: 0, research: 8, economy: 18, diplomacy: 10 },
    minReputation: 0,
    joinCost: 450,
    upkeepCost: 45,
    color: "#2980b9",
    emblem: "mind-eye",
  },
  {
    id: "guild-betazoid-scholars",
    name: "Betazoid Psionic Research",
    description: "Advancing telepathic and empathic science",
    raceId: "race-betazoid-confederacy",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-betazoid-scholars"),
    memberBonuses: { combat: 0, research: 15, economy: 5, diplomacy: 8 },
    minReputation: 100,
    joinCost: 500,
    upkeepCost: 50,
    color: "#3498db",
    emblem: "psionic-wave",
  },

  // Trill Symbionts - Merchants + Scholars
  {
    id: "guild-trill-merchants",
    name: "Trill Trade Exchange",
    description: "Multi-lifepath commercial ventures",
    raceId: "race-trill-symbionts",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-trill-merchants"),
    memberBonuses: { combat: 2, research: 8, economy: 16, diplomacy: 8 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#1abc9c",
    emblem: "symbiont-curve",
  },
  {
    id: "guild-trill-scholars",
    name: "Trill Symbiosis Science",
    description: "Research into symbiotic consciousness",
    raceId: "race-trill-symbionts",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-trill-scholars"),
    memberBonuses: { combat: 0, research: 16, economy: 5, diplomacy: 5 },
    minReputation: 100,
    joinCost: 450,
    upkeepCost: 45,
    color: "#16a085",
    emblem: "joined-mark",
  },

  // Benzite Union - Merchants
  {
    id: "guild-benzite-merchants",
    name: "Benzite Commerce Guild",
    description: "Systematic trade and resource management",
    raceId: "race-benzite-union",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-benzite-merchants"),
    memberBonuses: { combat: 2, research: 5, economy: 18, diplomacy: 5 },
    minReputation: 0,
    joinCost: 350,
    upkeepCost: 35,
    color: "#27ae60",
    emblem: "benzite-seal",
  },

  // Dosi Syndicate - Merchants + Shadow
  {
    id: "guild-dosi-merchants",
    name: "Dosi Trading Cartel",
    description: "Aggressive trade and market manipulation",
    raceId: "race-dosi-syndicate",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-dosi-merchants"),
    memberBonuses: { combat: 3, research: 2, economy: 22, diplomacy: -2 },
    minReputation: 0,
    joinCost: 300,
    upkeepCost: 30,
    color: "#c0392b",
    emblem: "dosi-coin",
  },
  {
    id: "guild-dosi-shadow",
    name: "Dosi Black Market",
    description: "Illegal goods and covert trade operations",
    raceId: "race-dosi-syndicate",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-dosi-shadow"),
    memberBonuses: { combat: 3, research: 0, economy: 15, diplomacy: -5 },
    minReputation: 100,
    joinCost: 400,
    upkeepCost: 40,
    color: "#e74c3c",
    emblem: "shadow-coin",
  },

  // =========================================================================
  // HIVE FACTIONS
  // =========================================================================

  // Xindi Council - Engineers + Warriors
  {
    id: "guild-xindi-engineers",
    name: "Xindi Council Engineering",
    description: "Species-wide engineering collaboration",
    raceId: "race-xindi-council",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-xindi-engineers"),
    memberBonuses: { combat: 8, research: 8, economy: 5, diplomacy: 3 },
    minReputation: 0,
    joinCost: 500,
    upkeepCost: 50,
    color: "#0e6251",
    emblem: "xindi-gear",
  },
  {
    id: "guild-xindi-warriors",
    name: "Xindi Defense Force",
    description: "United military strength of all Xindi species",
    raceId: "race-xindi-council",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-xindi-warriors"),
    memberBonuses: { combat: 15, research: 3, economy: 3, diplomacy: 3 },
    minReputation: 100,
    joinCost: 450,
    upkeepCost: 45,
    color: "#148f77",
    emblem: "xindi-shield",
  },

  // Hierarchy - Engineers
  {
    id: "guild-hierarchy-engineers",
    name: "Hierarchy Construction Hive",
    description: "Collective construction and resource gathering",
    raceId: "race-hierarchy",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-hierarchy-engineers"),
    memberBonuses: { combat: 5, research: 5, economy: 12, diplomacy: 0 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#7f8c8d",
    emblem: "hive-node",
  },

  // Vidiian Sodality - Engineers + Scholars
  {
    id: "guild-vidiian-engineers",
    name: "Vidiian Bio-Engineering",
    description: "Advanced biological and medical engineering",
    raceId: "race-vidiian-sodality",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-vidiian-engineers"),
    memberBonuses: { combat: 5, research: 10, economy: 5, diplomacy: 2 },
    minReputation: 0,
    joinCost: 450,
    upkeepCost: 45,
    color: "#922b21",
    emblem: "bio-construct",
  },
  {
    id: "guild-vidiian-scholars",
    name: "Vidiian Genome Research",
    description: "Pursuing the perfect genetic sequence",
    raceId: "race-vidiian-sodality",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-vidiian-scholars"),
    memberBonuses: { combat: 0, research: 18, economy: 3, diplomacy: 3 },
    minReputation: 100,
    joinCost: 500,
    upkeepCost: 50,
    color: "#a93226",
    emblem: "genome-helix",
  },

  // Hirogen Occupation - Engineers + Warriors
  {
    id: "guild-hirogen-occupation-engineers",
    name: "Hirogen Occupation Forces",
    description: "Conquered technology assimilation",
    raceId: "race-hirogen-occupation",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-hirogen-occupation-engineers"),
    memberBonuses: { combat: 10, research: 5, economy: 5, diplomacy: -3 },
    minReputation: 0,
    joinCost: 350,
    upkeepCost: 35,
    color: "#7d6608",
    emblem: "occupation-claw",
  },
  {
    id: "guild-hirogen-occupation-warriors",
    name: "Hirogen Occupation Hunters",
    description: "Systematic hunting and conquest forces",
    raceId: "race-hirogen-occupation",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-hirogen-occupation-warriors"),
    memberBonuses: { combat: 18, research: 0, economy: 3, diplomacy: -5 },
    minReputation: 100,
    joinCost: 300,
    upkeepCost: 30,
    color: "#9a7d0a",
    emblem: "hunt-mark",
  },

  // =========================================================================
  // ANCIENT FACTIONS
  // =========================================================================

  // Q Continuum - Scholars + Explorers
  {
    id: "guild-q-scholars",
    name: "Q Continuum Archives",
    description: "Omniscient knowledge across all realities",
    raceId: "race-q-continuum",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-q-scholars"),
    memberBonuses: { combat: 5, research: 25, economy: 5, diplomacy: 5 },
    minReputation: 0,
    joinCost: 1000,
    upkeepCost: 100,
    color: "#f1c40f",
    emblem: "q-mark",
  },
  {
    id: "guild-q-explorers",
    name: "Q Continuum Wanderers",
    description: "Exploring the multiverse for amusement",
    raceId: "race-q-continuum",
    type: "explorers_guild",
    ranks: EXPLORER_RANKS,
    upgrades: explorerUpgrades("guild-q-explorers"),
    memberBonuses: { combat: 3, research: 10, economy: 2, diplomacy: 5 },
    minReputation: 200,
    joinCost: 800,
    upkeepCost: 80,
    color: "#f39c12",
    emblem: "q-wander",
  },

  // Prophets - Scholars
  {
    id: "guild-prophets-scholars",
    name: "Prophets Celestial Knowledge",
    description: "Non-linear understanding of existence",
    raceId: "race-prophets",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-prophets-scholars"),
    memberBonuses: { combat: 0, research: 25, economy: 0, diplomacy: 10 },
    minReputation: 0,
    joinCost: 900,
    upkeepCost: 90,
    color: "#8e44ad",
    emblem: "wormhole-eye",
  },

  // Preservers - Scholars + Explorers
  {
    id: "guild-preservers-scholars",
    name: "Preservers Ancient Archive",
    description: "Guardians of pre-warp civilization knowledge",
    raceId: "race-preservers",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-preservers-scholars"),
    memberBonuses: { combat: 3, research: 22, economy: 5, diplomacy: 8 },
    minReputation: 0,
    joinCost: 800,
    upkeepCost: 80,
    color: "#1a5276",
    emblem: "preserver-stone",
  },
  {
    id: "guild-preservers-explorers",
    name: "Preservers Stargate Network",
    description: "Ancient gateway exploration and maintenance",
    raceId: "race-preservers",
    type: "explorers_guild",
    ranks: EXPLORER_RANKS,
    upgrades: explorerUpgrades("guild-preservers-explorers"),
    memberBonuses: { combat: 2, research: 10, economy: 3, diplomacy: 5 },
    minReputation: 150,
    joinCost: 700,
    upkeepCost: 70,
    color: "#2471a3",
    emblem: "gate-ring",
  },

  // Iconians - Engineers + Scholars
  {
    id: "guild-iconian-engineers",
    name: "Iconian Gateway Engineers",
    description: "Masters of portal and gateway technology",
    raceId: "race-iconians",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-iconian-engineers"),
    memberBonuses: { combat: 5, research: 15, economy: 8, diplomacy: 3 },
    minReputation: 0,
    joinCost: 900,
    upkeepCost: 90,
    color: "#154360",
    emblem: "iconian-gate",
  },
  {
    id: "guild-iconian-scholars",
    name: "Iconian Legacy Archive",
    description: "Preserving the knowledge of a fallen empire",
    raceId: "race-iconians",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-iconian-scholars"),
    memberBonuses: { combat: 3, research: 20, economy: 5, diplomacy: 5 },
    minReputation: 100,
    joinCost: 800,
    upkeepCost: 80,
    color: "#1b4f72",
    emblem: "iconian-seal",
  },

  // Voth Ministry - Scholars
  {
    id: "guild-voth-ministry-scholars",
    name: "Voth Ministry of Historical Studies",
    description: "Ancient doctrines and evolutionary research",
    raceId: "race-voth-ministry",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-voth-ministry-scholars"),
    memberBonuses: { combat: 3, research: 20, economy: 3, diplomacy: 5 },
    minReputation: 0,
    joinCost: 600,
    upkeepCost: 60,
    color: "#1c2833",
    emblem: "voth-scroll",
  },

  // =========================================================================
  // ORIGINAL FACTIONS
  // =========================================================================

  // Krell - Warriors + Engineers
  {
    id: "guild-krell-warriors",
    name: "Krell War Forge",
    description: "Ancient warrior tradition and weapons mastery",
    raceId: "race-krell",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-krell-warriors"),
    memberBonuses: { combat: 20, research: 3, economy: 3, diplomacy: 0 },
    minReputation: 0,
    joinCost: 400,
    upkeepCost: 40,
    color: "#6c3483",
    emblem: "krell-blade",
  },
  {
    id: "guild-krell-engineers",
    name: "Krell Artificers",
    description: "Forging legendary weapons and structures",
    raceId: "race-krell",
    type: "engineers_guild",
    ranks: ENGINEER_RANKS,
    upgrades: engineerUpgrades("guild-krell-engineers"),
    memberBonuses: { combat: 10, research: 5, economy: 5, diplomacy: 0 },
    minReputation: 100,
    joinCost: 450,
    upkeepCost: 45,
    color: "#7d3c98",
    emblem: "krell-forge",
  },

  // Zenith - Scholars
  {
    id: "guild-zenith-scholars",
    name: "Zenith Celestial Academy",
    description: "Transcendent knowledge of the cosmos",
    raceId: "race-zenith",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-zenith-scholars"),
    memberBonuses: { combat: 3, research: 22, economy: 3, diplomacy: 8 },
    minReputation: 0,
    joinCost: 600,
    upkeepCost: 60,
    color: "#f4d03f",
    emblem: "zenith-star",
  },

  // Varanthi - Merchants
  {
    id: "guild-varanthi-merchants",
    name: "Varanthi Trade Collective",
    description: "Intergalactic trade and commerce network",
    raceId: "race-varanthi",
    type: "merchants_guild",
    ranks: MERCHANT_RANKS,
    upgrades: merchantUpgrades("guild-varanthi-merchants"),
    memberBonuses: { combat: 2, research: 5, economy: 20, diplomacy: 8 },
    minReputation: 0,
    joinCost: 350,
    upkeepCost: 35,
    color: "#2ecc71",
    emblem: "varanthi-gem",
  },

  // Void Swarm - Warriors + Shadow
  {
    id: "guild-void-warriors",
    name: "Void Swarm Devourers",
    description: "Relentless consuming force of the void",
    raceId: "race-void-swarm",
    type: "warriors_guild",
    ranks: WARRIOR_RANKS,
    upgrades: warriorUpgrades("guild-void-warriors"),
    memberBonuses: { combat: 25, research: -3, economy: -2, diplomacy: -8 },
    minReputation: 0,
    joinCost: 200,
    upkeepCost: 20,
    color: "#1a1a2e",
    emblem: "void-maw",
  },
  {
    id: "guild-void-shadow",
    name: "Void Shadow Infiltration",
    description: "Stealth operations in the darkness between stars",
    raceId: "race-void-swarm",
    type: "shadow_guild",
    ranks: SHADOW_RANKS,
    upgrades: shadowUpgrades("guild-void-shadow"),
    memberBonuses: { combat: 10, research: 0, economy: 0, diplomacy: -10 },
    minReputation: 100,
    joinCost: 250,
    upkeepCost: 25,
    color: "#0d0d1a",
    emblem: "void-shadow",
  },

  // Celestial - Explorers + Scholars
  {
    id: "guild-celestial-explorers",
    name: "Celestial Voyager Corps",
    description: "Mapping the infinite cosmos beyond known space",
    raceId: "race-celestial",
    type: "explorers_guild",
    ranks: EXPLORER_RANKS,
    upgrades: explorerUpgrades("guild-celestial-explorers"),
    memberBonuses: { combat: 3, research: 12, economy: 5, diplomacy: 8 },
    minReputation: 0,
    joinCost: 500,
    upkeepCost: 50,
    color: "#5dade2",
    emblem: "celestial-compass",
  },
  {
    id: "guild-celestial-scholars",
    name: "Celestial Wisdom Circle",
    description: "Cosmic knowledge and universal understanding",
    raceId: "race-celestial",
    type: "scholars_guild",
    ranks: SCHOLAR_RANKS,
    upgrades: scholarUpgrades("guild-celestial-scholars"),
    memberBonuses: { combat: 2, research: 18, economy: 3, diplomacy: 10 },
    minReputation: 100,
    joinCost: 550,
    upkeepCost: 55,
    color: "#48c9b0",
    emblem: "celestial-eye",
  },
];

// =============================================================================
// Guild Type Metadata
// =============================================================================

export const GUILD_TYPE_INFO: Record<
  GuildType,
  { name: string; description: string; color: string }
> = {
  warriors_guild: {
    name: "Warriors Guild",
    description: "Combat training, fleet command, and military might",
    color: "#e74c3c",
  },
  scholars_guild: {
    name: "Scholars Guild",
    description: "Research, technology advancement, and knowledge preservation",
    color: "#3498db",
  },
  merchants_guild: {
    name: "Merchants Guild",
    description: "Trade routes, economic growth, and commercial dominance",
    color: "#f1c40f",
  },
  explorers_guild: {
    name: "Explorers Guild",
    description: "Exploration, scouting, and cosmic discovery",
    color: "#2ecc71",
  },
  engineers_guild: {
    name: "Engineers Guild",
    description: "Construction, defense systems, and infrastructure",
    color: "#e67e22",
  },
  shadow_guild: {
    name: "Shadow Guild",
    description: "Espionage, sabotage, and covert operations",
    color: "#8e44ad",
  },
};
