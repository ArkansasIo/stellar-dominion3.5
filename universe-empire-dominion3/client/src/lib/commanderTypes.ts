export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "weapon" | "armor" | "module" | "blueprint" | "material";
export type CommanderEquipmentType = "weapon" | "armor" | "module";
export type CommanderEquipmentSlotId =
  | "primaryWeapon"
  | "secondaryWeapon"
  | "armorCore"
  | "shieldMatrix"
  | "commandModule"
  | "navModule"
  | "tacticalSuite"
  | "logisticsRig"
  | "scienceCore"
  | "engineeringTools"
  | "relicHarness"
  | "droneBay";

export type RaceId = "terran" | "aquarian" | "mechborn" | "lithoid" | "zypherian" | "vortexborn" | "silicate" | "ethereal";
export type ClassId = "admiral" | "industrialist" | "scientist" | "diplomat" | "explorer" | "merchant";
export type SubClassId = "tactician" | "corsair" | "logistician" | "geologist" | "technomancer" | "xenobiologist" | "negotiator" | "navigator" | "trader" | "archaeologist";

export interface Race {
  id: RaceId;
  name: string;
  description: string;
  bonuses: string[];
}

export interface Class {
  id: ClassId;
  name: string;
  description: string;
  bonuses: string[];
  subClasses: SubClassId[];
}

export interface SubClass {
  id: SubClassId;
  name: string;
  description: string;
  bonuses: string[];
}

export interface CommanderStats {
  level: number;
  xp: number;
  warfare: number;    // Boosts ship damage
  logistics: number;  // Boosts resource production
  science: number;    // Boosts research speed
  engineering: number;// Boosts build speed
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  itemClass?: string;
  itemSubClass?: string;
  itemSubType?: string;
  stats?: {
    warfare?: number;
    logistics?: number;
    science?: number;
    engineering?: number;
  };
  tempering?: number; // 0-10
  masterwork?: boolean;
}

export interface CommanderState {
  name: string;
  empireName: string;
  race: RaceId;
  class: ClassId;
  subClass: SubClassId | null;
  stats: CommanderStats;
  equipment: Record<CommanderEquipmentSlotId, Item | null>;
  inventory: Item[];
  starRating: number;
  starExperience: number;
  starMaxExperience: number;
  starProgress: number;
  sRankTier: string;
  sRankLevel: number;
  sRankExperience: number;
  sRankMaxExperience: number;
  sRankProgress: number;
}

export interface CommanderEquipmentSlotDefinition {
  id: CommanderEquipmentSlotId;
  label: string;
  type: CommanderEquipmentType;
  shortLabel: string;
  description: string;
}

export const COMMANDER_EQUIPMENT_SLOT_DEFINITIONS: CommanderEquipmentSlotDefinition[] = [
  { id: "primaryWeapon", label: "Primary Weapon", shortLabel: "P1", type: "weapon", description: "Main offensive weapon system for personal command actions." },
  { id: "secondaryWeapon", label: "Secondary Weapon", shortLabel: "P2", type: "weapon", description: "Backup weapon system and sidearm-grade tactical loadout." },
  { id: "armorCore", label: "Armor Core", shortLabel: "A1", type: "armor", description: "Primary body armor plating and survival frame." },
  { id: "shieldMatrix", label: "Shield Matrix", shortLabel: "A2", type: "armor", description: "Defensive barrier and energy shielding architecture." },
  { id: "commandModule", label: "Command Module", shortLabel: "M1", type: "module", description: "Strategic command uplink and fleet synchronization package." },
  { id: "navModule", label: "Navigation Module", shortLabel: "M2", type: "module", description: "Long-range navigation, routing, and jump coordination systems." },
  { id: "tacticalSuite", label: "Tactical Suite", shortLabel: "M3", type: "module", description: "Threat analysis, combat feeds, and tactical overlays." },
  { id: "logisticsRig", label: "Logistics Rig", shortLabel: "M4", type: "module", description: "Supply chain, transport, and sustainment optimization rig." },
  { id: "scienceCore", label: "Science Core", shortLabel: "M5", type: "module", description: "Research accelerators and lab command integrations." },
  { id: "engineeringTools", label: "Engineering Tools", shortLabel: "M6", type: "module", description: "Construction coordination, repair drones, and industrial assist kit." },
  { id: "relicHarness", label: "Relic Harness", shortLabel: "M7", type: "module", description: "Ancient artifact relay frame for rare command relics." },
  { id: "droneBay", label: "Drone Bay", shortLabel: "M8", type: "module", description: "Support drone slot for scouting, repair, or battlefield utility." },
];

export const COMMANDER_EQUIPMENT_SLOTS: Record<CommanderEquipmentSlotId, CommanderEquipmentSlotDefinition> =
  COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.reduce((accumulator, slot) => {
    accumulator[slot.id] = slot;
    return accumulator;
  }, {} as Record<CommanderEquipmentSlotId, CommanderEquipmentSlotDefinition>);

export function createDefaultCommanderEquipment(): Record<CommanderEquipmentSlotId, Item | null> {
  return COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.reduce((accumulator, slot) => {
    accumulator[slot.id] = null;
    return accumulator;
  }, {} as Record<CommanderEquipmentSlotId, Item | null>);
}

export interface CommanderEquipmentTemplate {
  id: string;
  name: string;
  description: string;
  type: CommanderEquipmentType;
  rarity: ItemRarity;
  level: number;
  itemClass: string;
  itemSubClass: string;
  itemSubType: string;
  craftingCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  stats: {
    warfare?: number;
    logistics?: number;
    science?: number;
    engineering?: number;
  };
}

export interface CommanderArchetype {
  id: string;
  type: string;
  class: string;
  subClass: string;
  subType: string;
  title: string;
  description: string;
  bonuses: {
    warfare?: number;
    logistics?: number;
    science?: number;
    engineering?: number;
  };
}

export interface GovernmentLeaderType {
  id: string;
  name: string;
  type: string;
  class: string;
  subClass: string;
  subType: string;
  governanceStyle: string;
  bonuses: {
    stability?: number;
    economy?: number;
    military?: number;
    research?: number;
    diplomacy?: number;
  };
}

// Data Definitions
export const RACES: Record<RaceId, Race> = {
  terran: {
    id: "terran",
    name: "Terran Union",
    description: "Adaptable and ambitious, Terrans are jacks-of-all-trades with balanced growth.",
    bonuses: ["+5% All Resource Production", "+5% Research Speed"]
  },
  aquarian: {
    id: "aquarian",
    name: "Aquarian Dominion",
    description: "Masters of fluid dynamics and biology, they excel at deuterium extraction and food production.",
    bonuses: ["+20% Deuterium Production", "+10% Biological Research"]
  },
  mechborn: {
    id: "mechborn",
    name: "The Mechborn",
    description: "Cybernetic organisms that value efficiency above all else. Excellent builders.",
    bonuses: ["+20% Construction Speed", "-10% Building Cost"]
  },
  lithoid: {
    id: "lithoid",
    name: "Lithoid Crag",
    description: "Silicone-based lifeforms that consume minerals. Extremely tough ships.",
    bonuses: ["+15% Metal/Crystal Production", "+10% Ship Armor"]
  },
  zypherian: {
    id: "zypherian",
    name: "Zypherian Collective",
    description: "Insectoid hive-mind species with incredible teamwork and coordination capabilities.",
    bonuses: ["+25% Fleet Coordination", "+10% Collective Research"]
  },
  vortexborn: {
    id: "vortexborn",
    name: "Vortexborn",
    description: "Energy beings from interdimensional rifts. Masters of exotic physics and cosmic phenomena.",
    bonuses: ["+20% Exotic Research", "+15% Warp Speed"]
  },
  silicate: {
    id: "silicate",
    name: "Silicate Constructs",
    description: "Living crystalline entities that think in geometric patterns and quantum states.",
    bonuses: ["+30% Crystal Production", "+20% Energy Efficiency"]
  },
  ethereal: {
    id: "ethereal",
    name: "Ethereal Beings",
    description: "Spiritual entities existing partially outside normal space. Mysterious and powerful.",
    bonuses: ["+20% Spiritual Research", "+15% Quantum Technology"]
  }
};

export const CLASSES: Record<ClassId, Class> = {
  admiral: {
    id: "admiral",
    name: "Fleet Admiral",
    description: "Specializes in military command and fleet maneuvers.",
    bonuses: ["+10% Ship Attack", "+10% Fleet Speed"],
    subClasses: ["tactician", "corsair"]
  },
  industrialist: {
    id: "industrialist",
    name: "Industrialist",
    description: "Focuses on economic growth and massive infrastructure.",
    bonuses: ["+15% Resource Production", "+10% Cargo Capacity"],
    subClasses: ["logistician", "geologist"]
  },
  scientist: {
    id: "scientist",
    name: "Chief Scientist",
    description: "Dedicated to technological advancement and discovery.",
    bonuses: ["+20% Research Speed", "+5% Shield Tech"],
    subClasses: ["technomancer", "xenobiologist"]
  },
  diplomat: {
    id: "diplomat",
    name: "Diplomat",
    description: "Masters of negotiation and peaceful resolution. Expert traders and negotiators.",
    bonuses: ["+25% Diplomacy", "+15% Trade Revenue"],
    subClasses: ["negotiator"]
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    description: "Brave adventurers who chart unknown space and discover ancient secrets.",
    bonuses: ["+20% Exploration Speed", "+15% Archaeological Findings"],
    subClasses: ["navigator", "archaeologist"]
  },
  merchant: {
    id: "merchant",
    name: "Merchant",
    description: "Shrewd business operators who maximize profit and commerce.",
    bonuses: ["+30% Market Profits", "+20% Resource Trading"],
    subClasses: ["trader"]
  }
};

export const SUBCLASSES: Record<SubClassId, SubClass> = {
  tactician: { id: "tactician", name: "Grand Tactician", description: "Master of battlefield strategy and complex maneuvers.", bonuses: ["+10% Evasion", "+5% Crit Chance"] },
  corsair: { id: "corsair", name: "Void Corsair", description: "Expert raider and scavenger of the deep void.", bonuses: ["+20% Loot Capacity", "+10% Recycler Speed"] },
  logistician: { id: "logistician", name: "Master Logistician", description: "Optimizes supply chains and resource flow.", bonuses: ["+10% Energy Output", "-10% Ship Fuel Cost"] },
  geologist: { id: "geologist", name: "Deep Core Geologist", description: "Extracts rare minerals from planetary cores.", bonuses: ["+15% Crystal Production", "+5% Mine Depth"] },
  technomancer: { id: "technomancer", name: "Technomancer", description: "Melds machine and mind through technology.", bonuses: ["+10% Computer Tech", "-10% Research Cost"] },
  xenobiologist: { id: "xenobiologist", name: "Xenobiologist", description: "Unlocks secrets of alien life forms.", bonuses: ["+20% Pop Growth", "+10% Terraforming"] },
  negotiator: { id: "negotiator", name: "Master Negotiator", description: "Achieves impossible peace deals and treaties.", bonuses: ["+30% Alliance Bonus", "+15% Peace Treaty Stability"] },
  navigator: { id: "navigator", name: "Master Navigator", description: "Navigates through uncharted cosmic phenomena.", bonuses: ["+25% Exploration Speed", "+20% Warp Accuracy"] },
  trader: { id: "trader", name: "Black Market Trader", description: "Knows every merchant and smuggler route in the galaxy.", bonuses: ["+40% Market Profits", "+20% Black Market Access"] },
  archaeologist: { id: "archaeologist", name: "Archaeologist", description: "Uncovers ancient secrets and civilizations.", bonuses: ["+35% Ancient Discovery Rate", "+20% Artifact Value"] }
};

const COMMANDER_ARCHETYPE_CLASSES: Array<{
  type: string;
  class: string;
  subClass: string;
  bonus: {
    warfare?: number;
    logistics?: number;
    science?: number;
    engineering?: number;
  };
}> = [
  { type: "War Command", class: "Admiralty", subClass: "Fleet", bonus: { warfare: 4, logistics: 1 } },
  { type: "Industry Command", class: "Industrial Corps", subClass: "Production", bonus: { logistics: 4, engineering: 2 } },
  { type: "Science Command", class: "Research Directorate", subClass: "Experimental", bonus: { science: 5, engineering: 1 } },
  { type: "Diplomatic Command", class: "Embassy Corps", subClass: "Treaty", bonus: { logistics: 2, science: 2 } },
  { type: "Exploration Command", class: "Frontier Corps", subClass: "Recon", bonus: { warfare: 1, science: 3, logistics: 1 } },
  { type: "Commerce Command", class: "Trade Syndicate", subClass: "Market", bonus: { logistics: 5, engineering: 1 } },
] as const;

const COMMANDER_ARCHETYPE_SUBTYPES = [
  "Assault", "Vanguard", "Sentinel", "Navigator", "Nexus", "Prime", "Zenith",
] as const;

export const COMMANDER_ARCHETYPES_42: CommanderArchetype[] = COMMANDER_ARCHETYPE_CLASSES.flatMap((family, familyIndex) =>
  COMMANDER_ARCHETYPE_SUBTYPES.map((subType, subtypeIndex) => {
    const id = `${family.class.toLowerCase().replace(/\s+/g, '-')}-${subType.toLowerCase()}`;
    return {
      id,
      type: family.type,
      class: family.class,
      subClass: family.subClass,
      subType,
      title: `${subType} ${family.class}`,
      description: `${family.type} specialization focused on ${subType.toLowerCase()} doctrine and ${family.subClass.toLowerCase()} excellence.`,
      bonuses: {
        warfare: (family.bonus.warfare || 0) + (subtypeIndex % 3),
        logistics: (family.bonus.logistics || 0) + (subtypeIndex % 2),
        science: (family.bonus.science || 0) + (familyIndex % 2),
        engineering: (family.bonus.engineering || 0) + (subtypeIndex % 2),
      },
    };
  })
);

export const COMMANDER_ARCHETYPE_COUNT = COMMANDER_ARCHETYPES_42.length;

export function getCommanderArchetypesByType(type: string): CommanderArchetype[] {
  return COMMANDER_ARCHETYPES_42.filter(archetype => archetype.type.toLowerCase() === type.toLowerCase());
}

export const GOVERNMENT_LEADER_TYPES_23: GovernmentLeaderType[] = [
  {
    id: "gov-high-chancellor-prime",
    name: "High Chancellor",
    type: "Executive",
    class: "State Core",
    subClass: "Central Authority",
    subType: "Prime",
    governanceStyle: "Directive Command",
    bonuses: { stability: 8, diplomacy: 4, economy: 3 },
  },
  {
    id: "gov-war-consul-vanguard",
    name: "War Consul",
    type: "Military",
    class: "Defense Council",
    subClass: "Fleet Doctrine",
    subType: "Vanguard",
    governanceStyle: "Strategic Militarism",
    bonuses: { military: 9, stability: 3, economy: 2 },
  },
  {
    id: "gov-trade-minister-market",
    name: "Trade Minister",
    type: "Economic",
    class: "Commerce Bureau",
    subClass: "Interstellar Market",
    subType: "Market",
    governanceStyle: "Mercantile Expansion",
    bonuses: { economy: 9, diplomacy: 3, stability: 2 },
  },
  {
    id: "gov-science-director-lumen",
    name: "Science Director",
    type: "Scientific",
    class: "Research Authority",
    subClass: "Innovation Board",
    subType: "Lumen",
    governanceStyle: "Technocratic Planning",
    bonuses: { research: 10, economy: 2, stability: 2 },
  },
  {
    id: "gov-foreign-envoy-celestial",
    name: "Foreign Envoy",
    type: "Diplomatic",
    class: "Embassy Corps",
    subClass: "Alliance Office",
    subType: "Celestial",
    governanceStyle: "Alliance Diplomacy",
    bonuses: { diplomacy: 9, stability: 3, economy: 2 },
  },
  {
    id: "gov-security-prefect-sentinel",
    name: "Security Prefect",
    type: "Security",
    class: "Internal Order",
    subClass: "Civil Defense",
    subType: "Sentinel",
    governanceStyle: "Order First",
    bonuses: { stability: 9, military: 4 },
  },
  {
    id: "gov-resource-overseer-forge",
    name: "Resource Overseer",
    type: "Economic",
    class: "Resource Directorate",
    subClass: "Extraction Command",
    subType: "Forge",
    governanceStyle: "Industrial Extraction",
    bonuses: { economy: 8, stability: 3, military: 2 },
  },
  {
    id: "gov-population-warden-haven",
    name: "Population Warden",
    type: "Civil",
    class: "Population Office",
    subClass: "Habitat Management",
    subType: "Haven",
    governanceStyle: "Civil Welfare",
    bonuses: { stability: 7, economy: 4, diplomacy: 2 },
  },
  {
    id: "gov-judicial-arbiter-equity",
    name: "Judicial Arbiter",
    type: "Judicial",
    class: "Justice Hall",
    subClass: "Legal Oversight",
    subType: "Equity",
    governanceStyle: "Rule of Law",
    bonuses: { stability: 8, diplomacy: 3, military: 1 },
  },
  {
    id: "gov-propaganda-speaker-echo",
    name: "Propaganda Speaker",
    type: "Influence",
    class: "Narrative Bureau",
    subClass: "Public Cohesion",
    subType: "Echo",
    governanceStyle: "Mass Messaging",
    bonuses: { stability: 6, military: 3, diplomacy: 3 },
  },
  {
    id: "gov-frontier-governor-pioneer",
    name: "Frontier Governor",
    type: "Expansion",
    class: "Colonial Office",
    subClass: "Frontier Administration",
    subType: "Pioneer",
    governanceStyle: "Expansion Governance",
    bonuses: { economy: 6, stability: 4, military: 3 },
  },
  {
    id: "gov-logistics-marshall-grid",
    name: "Logistics Marshall",
    type: "Infrastructure",
    class: "Transit Authority",
    subClass: "Supply Grid",
    subType: "Grid",
    governanceStyle: "Systemic Logistics",
    bonuses: { economy: 7, military: 4, stability: 2 },
  },
  {
    id: "gov-intelligence-regent-shadow",
    name: "Intelligence Regent",
    type: "Security",
    class: "Intelligence Office",
    subClass: "Counter-Operations",
    subType: "Shadow",
    governanceStyle: "Covert Oversight",
    bonuses: { military: 6, diplomacy: 4, stability: 3 },
  },
  {
    id: "gov-faith-hierophant-aether",
    name: "Faith Hierophant",
    type: "Cultural",
    class: "Spiritual Council",
    subClass: "Doctrine",
    subType: "Aether",
    governanceStyle: "Ideological Unity",
    bonuses: { stability: 7, diplomacy: 4, research: 1 },
  },
  {
    id: "gov-cyber-governor-neural",
    name: "Cyber Governor",
    type: "Scientific",
    class: "Synthetic Bureau",
    subClass: "Automation Policy",
    subType: "Neural",
    governanceStyle: "Algorithmic Governance",
    bonuses: { research: 8, economy: 4, stability: 2 },
  },
  {
    id: "gov-maritime-commissioner-tide",
    name: "Maritime Commissioner",
    type: "Infrastructure",
    class: "Orbital Port Authority",
    subClass: "Docking Operations",
    subType: "Tide",
    governanceStyle: "Port-Centric Trade",
    bonuses: { economy: 7, military: 3, diplomacy: 2 },
  },
  {
    id: "gov-ecology-curator-verdant",
    name: "Ecology Curator",
    type: "Civil",
    class: "Biosphere Office",
    subClass: "Sustainability",
    subType: "Verdant",
    governanceStyle: "Eco-Balance",
    bonuses: { stability: 6, research: 3, economy: 3 },
  },
  {
    id: "gov-industrial-praetor-crucible",
    name: "Industrial Praetor",
    type: "Economic",
    class: "Forge Administration",
    subClass: "Heavy Industry",
    subType: "Crucible",
    governanceStyle: "Production Supremacy",
    bonuses: { economy: 8, military: 3, stability: 2 },
  },
  {
    id: "gov-academy-provost-axiom",
    name: "Academy Provost",
    type: "Scientific",
    class: "Academy Network",
    subClass: "Knowledge Policy",
    subType: "Axiom",
    governanceStyle: "Scholastic Governance",
    bonuses: { research: 9, diplomacy: 2, economy: 2 },
  },
  {
    id: "gov-senate-speaker-orbit",
    name: "Senate Speaker",
    type: "Diplomatic",
    class: "Legislative Chamber",
    subClass: "Consensus Building",
    subType: "Orbit",
    governanceStyle: "Parliamentary Debate",
    bonuses: { diplomacy: 7, stability: 4, economy: 2 },
  },
  {
    id: "gov-enforcement-tribune-iron",
    name: "Enforcement Tribune",
    type: "Security",
    class: "Civic Guard",
    subClass: "Enforcement Command",
    subType: "Iron",
    governanceStyle: "Strict Enforcement",
    bonuses: { stability: 8, military: 5 },
  },
  {
    id: "gov-crisis-coordinator-bulwark",
    name: "Crisis Coordinator",
    type: "Executive",
    class: "Emergency Council",
    subClass: "Rapid Response",
    subType: "Bulwark",
    governanceStyle: "Emergency Mobilization",
    bonuses: { stability: 7, military: 4, economy: 2 },
  },
  {
    id: "gov-heritage-keeper-chronicle",
    name: "Heritage Keeper",
    type: "Cultural",
    class: "Archives Office",
    subClass: "Historical Continuity",
    subType: "Chronicle",
    governanceStyle: "Tradition Stewardship",
    bonuses: { stability: 6, diplomacy: 4, research: 2 },
  },
];

export const GOVERNMENT_LEADER_TYPE_COUNT = GOVERNMENT_LEADER_TYPES_23.length;

export function getGovernmentLeadersByType(type: string): GovernmentLeaderType[] {
  return GOVERNMENT_LEADER_TYPES_23.filter(leader => leader.type.toLowerCase() === type.toLowerCase());
}

export function getGovernmentLeadersByClass(leaderClass: string): GovernmentLeaderType[] {
  return GOVERNMENT_LEADER_TYPES_23.filter(leader => leader.class.toLowerCase() === leaderClass.toLowerCase());
}

const EQUIPMENT_RARITIES: ItemRarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

const WEAPON_CLASSES = [
  { key: "KINETIC", name: "Kinetic Arsenal", baseStats: { warfare: 5, engineering: 1 }, baseCost: { metal: 2200, crystal: 900, deuterium: 300 } },
  { key: "PLASMA", name: "Plasma Arsenal", baseStats: { warfare: 6, science: 1 }, baseCost: { metal: 2600, crystal: 1400, deuterium: 500 } },
  { key: "ION", name: "Ion Arsenal", baseStats: { warfare: 5, science: 2 }, baseCost: { metal: 2400, crystal: 1700, deuterium: 650 } },
  { key: "RAIL", name: "Rail Arsenal", baseStats: { warfare: 7, engineering: 2 }, baseCost: { metal: 2900, crystal: 1300, deuterium: 600 } },
  { key: "PARTICLE", name: "Particle Arsenal", baseStats: { warfare: 7, science: 2 }, baseCost: { metal: 3100, crystal: 2100, deuterium: 850 } },
  { key: "GRAV", name: "Gravity Arsenal", baseStats: { warfare: 8, science: 3 }, baseCost: { metal: 3500, crystal: 2600, deuterium: 1200 } },
] as const;

const ARMOR_CLASSES = [
  { key: "PLATE", name: "Plate Defense", baseStats: { warfare: 1, engineering: 5 }, baseCost: { metal: 2300, crystal: 1000, deuterium: 250 } },
  { key: "COMPOSITE", name: "Composite Defense", baseStats: { warfare: 1, engineering: 6 }, baseCost: { metal: 2600, crystal: 1300, deuterium: 420 } },
  { key: "NANO", name: "Nano Defense", baseStats: { engineering: 5, science: 2 }, baseCost: { metal: 2800, crystal: 1800, deuterium: 700 } },
  { key: "REACTIVE", name: "Reactive Defense", baseStats: { warfare: 2, engineering: 6 }, baseCost: { metal: 3000, crystal: 1900, deuterium: 760 } },
  { key: "AEGIS", name: "Aegis Defense", baseStats: { warfare: 2, science: 3, engineering: 5 }, baseCost: { metal: 3400, crystal: 2400, deuterium: 980 } },
  { key: "PHASE", name: "Phase Defense", baseStats: { science: 4, engineering: 5 }, baseCost: { metal: 3700, crystal: 2900, deuterium: 1250 } },
] as const;

const MODULE_CLASSES = [
  { key: "TACTICAL", name: "Tactical Module", baseStats: { warfare: 3, logistics: 2 }, baseCost: { metal: 2000, crystal: 1300, deuterium: 450 } },
  { key: "LOGISTIC", name: "Logistic Module", baseStats: { logistics: 6, engineering: 1 }, baseCost: { metal: 1900, crystal: 1100, deuterium: 420 } },
  { key: "SCIENCE", name: "Science Module", baseStats: { science: 6, logistics: 1 }, baseCost: { metal: 1800, crystal: 1800, deuterium: 500 } },
  { key: "ENGINEERING", name: "Engineering Module", baseStats: { engineering: 6, warfare: 1 }, baseCost: { metal: 2200, crystal: 1600, deuterium: 520 } },
  { key: "SENSORY", name: "Sensory Module", baseStats: { science: 4, logistics: 3 }, baseCost: { metal: 2100, crystal: 1700, deuterium: 560 } },
  { key: "QUANTUM", name: "Quantum Module", baseStats: { science: 5, engineering: 3 }, baseCost: { metal: 2600, crystal: 2400, deuterium: 900 } },
] as const;

const EQUIPMENT_VARIANTS = [
  { key: "ASSAULT", name: "Assault", subType: "Frontline" },
  { key: "VANGUARD", name: "Vanguard", subType: "Shock" },
  { key: "SENTINEL", name: "Sentinel", subType: "Guardian" },
  { key: "RECON", name: "Recon", subType: "Pathfinder" },
  { key: "PRIME", name: "Prime", subType: "Prototype" },
  { key: "WARDEN", name: "Warden", subType: "Fortified" },
  { key: "SPECTRAL", name: "Spectral", subType: "Phase" },
  { key: "MARAUDER", name: "Marauder", subType: "Raider" },
  { key: "AEGIS", name: "Aegis", subType: "Deflection" },
  { key: "ZENITH", name: "Zenith", subType: "Flagship" },
] as const;

function getRarityByLevel(level: number): ItemRarity {
  if (level >= 9) return "legendary";
  if (level >= 7) return "epic";
  if (level >= 5) return "rare";
  if (level >= 3) return "uncommon";
  return "common";
}

function createCommanderTemplates(
  equipmentType: CommanderEquipmentType,
  classes: ReadonlyArray<{
    key: string;
    name: string;
    baseStats: { warfare?: number; logistics?: number; science?: number; engineering?: number };
    baseCost: { metal: number; crystal: number; deuterium: number };
  }>
): CommanderEquipmentTemplate[] {
  return classes.flatMap((equipmentClass, classIndex) =>
    EQUIPMENT_VARIANTS.map((variant, variantIndex) => {
      const level = classIndex + variantIndex + 1;
      const rarity = getRarityByLevel(level);

      return {
        id: `${equipmentType}_${equipmentClass.key}_${variant.key}`.toLowerCase(),
        name: `${variant.name} ${equipmentClass.name}`,
        description: `${equipmentClass.name} tuned for ${variant.subType.toLowerCase()} operations.`,
        type: equipmentType,
        rarity,
        level,
        itemClass: equipmentClass.name,
        itemSubClass: variant.name,
        itemSubType: variant.subType,
        craftingCost: {
          metal: equipmentClass.baseCost.metal + classIndex * 500 + variantIndex * 300,
          crystal: equipmentClass.baseCost.crystal + classIndex * 400 + variantIndex * 250,
          deuterium: equipmentClass.baseCost.deuterium + classIndex * 180 + variantIndex * 120,
        },
        stats: {
          warfare: (equipmentClass.baseStats.warfare || 0) + Math.floor(variantIndex / 2),
          logistics: (equipmentClass.baseStats.logistics || 0) + (classIndex % 2),
          science: (equipmentClass.baseStats.science || 0) + (variantIndex % 2),
          engineering: (equipmentClass.baseStats.engineering || 0) + (classIndex % 3),
        },
      };
    })
  );
}

export const COMMANDER_EQUIPMENT_TEMPLATES: CommanderEquipmentTemplate[] = [
  ...createCommanderTemplates("weapon", WEAPON_CLASSES),
  ...createCommanderTemplates("armor", ARMOR_CLASSES),
  ...createCommanderTemplates("module", MODULE_CLASSES),
];

export function getCommanderEquipmentTemplatesByType(type: CommanderEquipmentType): CommanderEquipmentTemplate[] {
  return COMMANDER_EQUIPMENT_TEMPLATES.filter(template => template.type === type);
}

export function getCommanderEquipmentRarityCounts(): Record<ItemRarity, number> {
  return EQUIPMENT_RARITIES.reduce((acc, rarity) => {
    acc[rarity] = COMMANDER_EQUIPMENT_TEMPLATES.filter(template => template.rarity === rarity).length;
    return acc;
  }, {} as Record<ItemRarity, number>);
}

export const COMMANDER_EQUIPMENT_TEMPLATE_COUNT = COMMANDER_EQUIPMENT_TEMPLATES.length;

export interface LoadoutPreset {
  id: string;
  name: string;
  description: string;
  equipment: Record<CommanderEquipmentSlotId, string | null>; // item id references
  createdAt: number;
  updatedAt: number;
  powerScore: number;
}

export function createEmptyLoadoutPreset(name: string): LoadoutPreset {
  const id = `loadout_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const emptyEquipment = COMMANDER_EQUIPMENT_SLOT_DEFINITIONS.reduce((acc, slot) => {
    acc[slot.id] = null;
    return acc;
  }, {} as Record<CommanderEquipmentSlotId, string | null>);
  return {
    id,
    name,
    description: "",
    equipment: emptyEquipment,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    powerScore: 0,
  };
}

// Mock recipes
export const blueprints = [
  { id: "plasmaRifle", name: "Plasma Rifle Blueprint", resultId: "plasmaRifle", type: "weapon", cost: { metal: 5000, crystal: 2000 } },
  { id: "voidArmor", name: "Void Armor Blueprint", resultId: "voidArmor", type: "armor", cost: { metal: 10000, crystal: 5000 } },
  { id: "aiCore", name: "AI Core Blueprint", resultId: "aiCore", type: "module", cost: { metal: 5000, crystal: 10000, deuterium: 2000 } },
];

// ============================================================================
// RACE-SPECIFIC NAMING SYSTEM
// ============================================================================

export interface RaceNameOverride {
  raceId: RaceId;
  displayName: string;
  flavorText?: string;
}

export type RaceNameCategory = 
  | 'technology'
  | 'building'
  | 'ship'
  | 'resource'
  | 'research_category'
  | 'ui_text';

export interface RaceNameMap {
  [key: string]: Partial<Record<RaceId, RaceNameOverride>>;
}

// Technology names by race
export const TECHNOLOGY_RACE_NAMES: RaceNameMap = {
  // Weapons
  'laser_weapons': {
    terran: { raceId: 'terran', displayName: 'Laser Cannon' },
    aquarian: { raceId: 'aquarian', displayName: 'Bio-Luminescent Lance' },
    mechborn: { raceId: 'mechborn', displayName: 'Directed Energy Array' },
    lithoid: { raceId: 'lithoid', displayName: 'Photon Razor' },
    zypherian: { raceId: 'zypherian', displayName: 'Chitin Beam' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Piercer' },
    silicate: { raceId: 'silicate', displayName: 'Prismatic Spire' },
    ethereal: { raceId: 'ethereal', displayName: 'Spectral Lance' },
  },
  'plasma_weapons': {
    terran: { raceId: 'terran', displayName: 'Plasma Torpedo' },
    aquarian: { raceId: 'aquarian', displayName: 'Thermal Vent Projector' },
    mechborn: { raceId: 'mechborn', displayName: 'Plasma Conduit' },
    lithoid: { raceId: 'lithoid', displayName: 'Magma Emitter' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Thermal Bomb' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Singularity Bolt' },
    silicate: { raceId: 'silicate', displayName: 'Molten Core Lance' },
    ethereal: { raceId: 'ethereal', displayName: 'Entropy Beam' },
  },
  'missile_weapons': {
    terran: { raceId: 'terran', displayName: 'Guided Missile' },
    aquarian: { raceId: 'aquarian', displayName: 'Coral-Spine Launcher' },
    mechborn: { raceId: 'mechborn', displayName: 'Smart Missile Pod' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Shatter' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Missile' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Phase Missile' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Shards' },
    ethereal: { raceId: 'ethereal', displayName: 'Karma Rockets' },
  },
  'railgun': {
    terran: { raceId: 'terran', displayName: 'Mass Driver' },
    aquarian: { raceId: 'aquarian', displayName: 'Pressure Cannon' },
    mechborn: { raceId: 'mechborn', displayName: 'Kinetic Rail' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho Cannon' },
    zypherian: { raceId: 'zypherian', displayName: 'Mandible Rail' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Void Spike' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Piercer' },
    ethereal: { raceId: 'ethereal', displayName: 'Thought Accelerator' },
  },
  'drone_weapons': {
    terran: { raceId: 'terran', displayName: 'Combat Drone' },
    aquarian: { raceId: 'aquarian', displayName: 'Symbiote Swarm' },
    mechborn: { raceId: 'mechborn', displayName: 'Micro-Drone Cloud' },
    lithoid: { raceId: 'lithoid', displayName: 'Mineralite Swarm' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Drones' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Constructs' },
    silicate: { raceId: 'silicate', displayName: 'Shard Sentinels' },
    ethereal: { raceId: 'ethereal', displayName: 'Spectral Phantoms' },
  },
  // Defenses
  'shields': {
    terran: { raceId: 'terran', displayName: 'Energy Shield' },
    aquarian: { raceId: 'aquarian', displayName: 'Hydro-Barrier' },
    mechborn: { raceId: 'mechborn', displayName: 'Deflector Grid' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Mantle' },
    zypherian: { raceId: 'zypherian', displayName: 'Carapace Field' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Warp Bubble' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Lattice' },
    ethereal: { raceId: 'ethereal', displayName: 'Void Cloak' },
  },
  'armor': {
    terran: { raceId: 'terran', displayName: 'Titanium Plating' },
    aquarian: { raceId: 'aquarian', displayName: 'Bio-Armor' },
    mechborn: { raceId: 'mechborn', displayName: 'Nano-Composite' },
    lithoid: { raceId: 'lithoid', displayName: 'Crystal Plating' },
    zypherian: { raceId: 'zypherian', displayName: 'Chitin Armor' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Phase Armor' },
    silicate: { raceId: 'silicate', displayName: 'Diamond Shell' },
    ethereal: { raceId: 'ethereal', displayName: 'Ethereal Vestment' },
  },
  'point_defense': {
    terran: { raceId: 'terran', displayName: 'CIWS Turret' },
    aquarian: { raceId: 'aquarian', displayName: 'Reflexive Membrane' },
    mechborn: { raceId: 'mechborn', displayName: 'Auto-Counter System' },
    lithoid: { raceId: 'lithoid', displayName: 'Echolocation Grid' },
    zypherian: { raceId: 'zypherian', displayName: 'Wing Guard' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Sentinel' },
    silicate: { raceId: 'silicate', displayName: 'Harmonic Disruptor' },
    ethereal: { raceId: 'ethereal', displayName: 'Thought Shield' },
  },
  // Propulsion
  'engines': {
    terran: { raceId: 'terran', displayName: 'Ion Thruster' },
    aquarian: { raceId: 'aquarian', displayName: 'Current Rider' },
    mechborn: { raceId: 'mechborn', displayName: 'Quantum Drive' },
    lithoid: { raceId: 'lithoid', displayName: 'Graviton Pulse' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Propulsion' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Warp Nacelle' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Harmonics' },
    ethereal: { raceId: 'ethereal', displayName: 'Phase Shift' },
  },
  'warp_drive': {
    terran: { raceId: 'terran', displayName: 'Warp Drive' },
    aquarian: { raceId: 'aquarian', displayName: 'Tidal Gate' },
    mechborn: { raceId: 'mechborn', displayName: 'Phase Translocator' },
    lithoid: { raceId: 'lithoid', displayName: 'Deep Stone Rift' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Jump' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift撕裂者' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Gate' },
    ethereal: { raceId: 'ethereal', displayName: 'Transcendence Portal' },
  },
  'hyperdrive': {
    terran: { raceId: 'terran', displayName: 'Hyperdrive' },
    aquarian: { raceId: 'aquarian', displayName: 'Current Fold' },
    mechborn: { raceId: 'mechborn', displayName: 'Quantum Tunnel' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Warp' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Blink' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Void Gate' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Fold' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Walk' },
  },
  // Economy
  'mining': {
    terran: { raceId: 'terran', displayName: 'Excavation Drill' },
    aquarian: { raceId: 'aquarian', displayName: 'Deep Trench Miner' },
    mechborn: { raceId: 'mechborn', displayName: 'Automated Extractor' },
    lithoid: { raceId: 'lithoid', displayName: 'Crystal Bore' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Burrower' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Harvester' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Miner' },
    ethereal: { raceId: 'ethereal', displayName: 'Thought Excavator' },
  },
  'energy': {
    terran: { raceId: 'terran', displayName: 'Fusion Reactor' },
    aquarian: { raceId: 'aquarian', displayName: 'Thermal Vent Core' },
    mechborn: { raceId: 'mechborn', displayName: 'Zero-Point Module' },
    lithoid: { raceId: 'lithoid', displayName: 'Geothermal Tap' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Power Node' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Void Reactor' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Core' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Engine' },
  },
  'research': {
    terran: { raceId: 'terran', displayName: 'Research Lab' },
    aquarian: { raceId: 'aquarian', displayName: 'Tidal Observatory' },
    mechborn: { raceId: 'mechborn', displayName: 'Processing Core' },
    lithoid: { raceId: 'lithoid', displayName: 'Deep Stone Archive' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Intelligence' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Nexus' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Matrix' },
    ethereal: { raceId: 'ethereal', displayName: 'Oracle Shrine' },
  },
  // Special
  'colony_ship': {
    terran: { raceId: 'terran', displayName: 'Colony Ship' },
    aquarian: { raceId: 'aquarian', displayName: 'Reef Seeder' },
    mechborn: { raceId: 'mechborn', displayName: 'Construction Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Colonizer' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Spore' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Colonizer' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Seeder' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Vessel' },
  },
  'terraforming': {
    terran: { raceId: 'terran', displayName: 'Terraforming' },
    aquarian: { raceId: 'aquarian', displayName: 'Ocean Reshaping' },
    mechborn: { raceId: 'mechborn', displayName: 'Planetary Engineering' },
    lithoid: { raceId: 'lithoid', displayName: 'Geological Restructuring' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Adaptation' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Dimensional Folding' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Seeding' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Conversion' },
  },
  'ftl_comms': {
    terran: { raceId: 'terran', displayName: 'Subspace Radio' },
    aquarian: { raceId: 'aquarian', displayName: 'Tidal Pulse Network' },
    mechborn: { raceId: 'mechborn', displayName: 'Quantum Entanglement' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Resonance' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Mind Link' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Comm' },
    silicate: { raceId: 'silicate', displayName: 'Harmonic Broadcast' },
    ethereal: { raceId: 'ethereal', displayName: 'Thought Network' },
  },
};

// Building names by race
export const BUILDING_RACE_NAMES: RaceNameMap = {
  // Resource Buildings
  'metal_mine': {
    terran: { raceId: 'terran', displayName: 'Metal Mine' },
    aquarian: { raceId: 'aquarian', displayName: 'Reef Extractor' },
    mechborn: { raceId: 'mechborn', displayName: 'Auto-Forge' },
    lithoid: { raceId: 'lithoid', displayName: 'Crystal Bore' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Excavator' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Tapper' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Mine' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Forge' },
  },
  'crystal_mine': {
    terran: { raceId: 'terran', displayName: 'Crystal Mine' },
    aquarian: { raceId: 'aquarian', displayName: 'Deep Trench Rig' },
    mechborn: { raceId: 'mechborn', displayName: 'Nano-Refinery' },
    lithoid: { raceId: 'lithoid', displayName: 'Mineral Spire' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Refinery' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Void Extractor' },
    silicate: { raceId: 'silicate', displayName: 'Shard Mine' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Well' },
  },
  'deuterium_plant': {
    terran: { raceId: 'terran', displayName: 'Deuterium Plant' },
    aquarian: { raceId: 'aquarian', displayName: 'Thermal Vent' },
    mechborn: { raceId: 'mechborn', displayName: 'Quantum Converter' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Synthesizer' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Synthesizer' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Condenser' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Synthesizer' },
    ethereal: { raceId: 'ethereal', displayName: 'Ethereal Distiller' },
  },
  'solar_panel': {
    terran: { raceId: 'terran', displayName: 'Solar Array' },
    aquarian: { raceId: 'aquarian', displayName: 'Thermal Collector' },
    mechborn: { raceId: 'mechborn', displayName: 'Energy Module' },
    lithoid: { raceId: 'lithoid', displayName: 'Sunstone Grid' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Solar Node' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Harvester' },
    silicate: { raceId: 'silicate', displayName: 'Prism Collector' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Gatherer' },
  },
  'storage_depot': {
    terran: { raceId: 'terran', displayName: 'Storage Depot' },
    aquarian: { raceId: 'aquarian', displayName: 'Coral Vault' },
    mechborn: { raceId: 'mechborn', displayName: 'Nano-Bunker' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Repository' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Cache' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Vault' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Vault' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Repository' },
  },
  // Military Buildings
  'shipyard': {
    terran: { raceId: 'terran', displayName: 'Shipyard' },
    aquarian: { raceId: 'aquarian', displayName: 'Reef Drydock' },
    mechborn: { raceId: 'mechborn', displayName: 'Construction Bay' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Dock' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Spawning Pool' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Forge' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Forge' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Yards' },
  },
  'defense_tower': {
    terran: { raceId: 'terran', displayName: 'Missile Turret' },
    aquarian: { raceId: 'aquarian', displayName: 'Stinger Battery' },
    mechborn: { raceId: 'mechborn', displayName: 'Laser Turret' },
    lithoid: { raceId: 'lithoid', displayName: 'Crystal Spire' },
    zypherian: { raceId: 'zypherian', displayName: 'Chitin Turret' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Cannon' },
    silicate: { raceId: 'silicate', displayName: 'Shard Tower' },
    ethereal: { raceId: 'ethereal', displayName: 'Spectral Bastion' },
  },
  'shield_generator': {
    terran: { raceId: 'terran', displayName: 'Shield Generator' },
    aquarian: { raceId: 'aquarian', displayName: 'Hydro-Dome' },
    mechborn: { raceId: 'mechborn', displayName: 'Deflector Array' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Shield' },
    zypherian: { raceId: 'zypherian', displayName: 'Carapace Dome' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Warp Shroud' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Dome' },
    ethereal: { raceId: 'ethereal', displayName: 'Void Barrier' },
  },
  'barracks': {
    terran: { raceId: 'terran', displayName: 'Military Academy' },
    aquarian: { raceId: 'aquarian', displayName: 'Warrior Pool' },
    mechborn: { raceId: 'mechborn', displayName: 'Training Core' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Drill' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Warrior Nest' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Training' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Drill' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Sanctum' },
  },
  // Science Buildings
  'research_lab': {
    terran: { raceId: 'terran', displayName: 'Research Lab' },
    aquarian: { raceId: 'aquarian', displayName: 'Tidal Lab' },
    mechborn: { raceId: 'mechborn', displayName: 'Processing Core' },
    lithoid: { raceId: 'lithoid', displayName: 'Deep Stone Archive' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Think Tank' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Nexus' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Lab' },
    ethereal: { raceId: 'ethereal', displayName: 'Oracle Shrine' },
  },
  'observatory': {
    terran: { raceId: 'terran', displayName: 'Space Observatory' },
    aquarian: { raceId: 'aquarian', displayName: 'Oceanic Lens' },
    mechborn: { raceId: 'mechborn', displayName: 'Scanner Array' },
    lithoid: { raceId: 'lithoid', displayName: 'Starstone Eye' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Sensor' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Eye' },
    silicate: { raceId: 'silicate', displayName: 'Prism Observatory' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Observatory' },
  },
  'academy': {
    terran: { raceId: 'terran', displayName: 'Academy' },
    aquarian: { raceId: 'aquarian', displayName: 'Current School' },
    mechborn: { raceId: 'mechborn', displayName: 'Logic Institute' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Library' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Academy' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Academy' },
    silicate: { raceId: 'silicate', displayName: 'Harmonic School' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Academy' },
  },
  // Government Buildings
  'capitol': {
    terran: { raceId: 'terran', displayName: 'Capitol' },
    aquarian: { raceId: 'aquarian', displayName: 'Coral Palace' },
    mechborn: { raceId: 'mechborn', displayName: 'Central Core' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Throne' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Nexus' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Citadel' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Citadel' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Sanctum' },
  },
  'embassy': {
    terran: { raceId: 'terran', displayName: 'Embassy' },
    aquarian: { raceId: 'aquarian', displayName: 'Current Hall' },
    mechborn: { raceId: 'mechborn', displayName: 'Diplomacy Node' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Circle' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Council' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Hall' },
    silicate: { raceId: 'silicate', displayName: 'Resonance Hall' },
    ethereal: { raceId: 'ethereal', displayName: 'Council of Echoes' },
  },
  'market': {
    terran: { raceId: 'terran', displayName: 'Trade Hub' },
    aquarian: { raceId: 'aquarian', displayName: 'Tide Market' },
    mechborn: { raceId: 'mechborn', displayName: 'Commerce Node' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Exchange' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Bazaar' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Market' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Exchange' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Bazaar' },
  },
};

// Ship names by race
export const SHIP_RACE_NAMES: RaceNameMap = {
  // Ship Classes
  'light_fighter': {
    terran: { raceId: 'terran', displayName: 'Interceptor' },
    aquarian: { raceId: 'aquarian', displayName: 'Reef Skimmer' },
    mechborn: { raceId: 'mechborn', displayName: 'Scout Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Dart' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Wing' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Blade' },
    silicate: { raceId: 'silicate', displayName: 'Shard Flyer' },
    ethereal: { raceId: 'ethereal', displayName: 'Spectral Wisp' },
  },
  'heavy_fighter': {
    terran: { raceId: 'terran', displayName: 'Strike Fighter' },
    aquarian: { raceId: 'aquarian', displayName: 'Deep Hunter' },
    mechborn: { raceId: 'mechborn', displayName: 'Heavy Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Crystal Hammer' },
    zypherian: { raceId: 'zypherian', displayName: 'Swarm Lancer' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Striker' },
    silicate: { raceId: 'silicate', displayName: 'Prism Hunter' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Fang' },
  },
  'cruiser': {
    terran: { raceId: 'terran', displayName: 'Cruiser' },
    aquarian: { raceId: 'aquarian', displayName: 'Leviathan' },
    mechborn: { raceId: 'mechborn', displayName: 'Battle Unit' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Cruiser' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Cruiser' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Cruiser' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Cruiser' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Cruiser' },
  },
  'battleship': {
    terran: { raceId: 'terran', displayName: 'Battleship' },
    aquarian: { raceId: 'aquarian', displayName: 'Abyssal Dreadnought' },
    mechborn: { raceId: 'mechborn', displayName: 'War Platform' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Juggernaut' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Dreadnought' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Titan' },
    silicate: { raceId: 'silicate', displayName: 'Diamond Colossus' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Titan' },
  },
  'battlecruiser': {
    terran: { raceId: 'terran', displayName: 'Battlecruiser' },
    aquarian: { raceId: 'aquarian', displayName: 'Tide Runner' },
    mechborn: { raceId: 'mechborn', displayName: 'Assault Platform' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Breaker' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Breaker' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Breaker' },
    silicate: { raceId: 'silicate', displayName: 'Prism Breaker' },
    ethereal: { raceId: 'ethereal', displayName: 'Void Breaker' },
  },
  'dreadnought': {
    terran: { raceId: 'terran', displayName: 'Dreadnought' },
    aquarian: { raceId: 'aquarian', displayName: 'Kraken' },
    mechborn: { raceId: 'mechborn', displayName: 'Annihilation Unit' },
    lithoid: { raceId: 'lithoid', displayName: 'World Crusher' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Annihilator' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Destroyer' },
    silicate: { raceId: 'silicate', displayName: 'Star Shatterer' },
    ethereal: { raceId: 'ethereal', displayName: 'Cosmic Destroyer' },
  },
  // Utility Ships
  'colony_ship': {
    terran: { raceId: 'terran', displayName: 'Colony Ship' },
    aquarian: { raceId: 'aquarian', displayName: 'Reef Seeder' },
    mechborn: { raceId: 'mechborn', displayName: 'Construction Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Litho-Colonizer' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Spore' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Colonizer' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Seed' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Vessel' },
  },
  'transport': {
    terran: { raceId: 'terran', displayName: 'Transport' },
    aquarian: { raceId: 'aquarian', displayName: 'Current Hauler' },
    mechborn: { raceId: 'mechborn', displayName: 'Supply Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Stone Carrier' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Carrier' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Transport' },
    silicate: { raceId: 'silicate', displayName: 'Shard Hauler' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Barge' },
  },
  'spy_ship': {
    terran: { raceId: 'terran', displayName: 'Recon Ship' },
    aquarian: { raceId: 'aquarian', displayName: 'Shadow Eel' },
    mechborn: { raceId: 'mechborn', displayName: 'Stealth Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Invisible Stone' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Lurker' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Phantom' },
    silicate: { raceId: 'silicate', displayName: 'Crystal Ghost' },
    ethereal: { raceId: 'ethereal', displayName: 'Spirit Shade' },
  },
  'explorer': {
    terran: { raceId: 'terran', displayName: 'Scout' },
    aquarian: { raceId: 'aquarian', displayName: 'Tide Rider' },
    mechborn: { raceId: 'mechborn', displayName: 'Survey Drone' },
    lithoid: { raceId: 'lithoid', displayName: 'Pathfinder' },
    zypherian: { raceId: 'zypherian', displayName: 'Hive Scout' },
    vortexborn: { raceId: 'vortexborn', displayName: 'Rift Walker' },
    silicate: { raceId: 'silicate', displayName: 'Prism Seeker' },
    ethereal: { raceId: 'ethereal', displayName: 'Astral Wanderer' },
  },
};

// Resource names by race
export const RESOURCE_RACE_NAMES: Record<RaceId, { metal: string; crystal: string; deuterium: string; energy: string }> = {
  terran: { metal: 'Metal', crystal: 'Crystal', deuterium: 'Deuterium', energy: 'Energy' },
  aquarian: { metal: 'Coral', crystal: 'Pearl', deuterium: 'Thermal Vent', energy: 'Bioluminescence' },
  mechborn: { metal: 'Alloy', crystal: 'Polymer', deuterium: 'Plasma', energy: 'Charge' },
  lithoid: { metal: 'Ore', crystal: 'Gem', deuterium: 'Lithium', energy: 'Resonance' },
  zypherian: { metal: 'Chitin', crystal: 'Silk', deuterium: 'Pheromone', energy: 'Swarm Energy' },
  vortexborn: { metal: 'Rift Matter', crystal: 'Dimensional Shard', deuterium: 'Void Essence', energy: 'Warp Charge' },
  silicate: { metal: 'Crystal', crystal: 'Prism', deuterium: 'Harmonic Core', energy: 'Spectrum' },
  ethereal: { metal: 'Spirit Dust', crystal: 'Astral Shard', deuterium: 'Void Essence', energy: 'Mana' },
};

// Research category names by race
export const RESEARCH_CATEGORY_RACE_NAMES: Record<RaceId, { weapons: string; shields: string; propulsion: string; economy: string; computing: string }> = {
  terran: { weapons: 'Ballistics', shields: 'Defense Systems', propulsion: 'Propulsion', economy: 'Industrial', computing: 'Computing' },
  aquarian: { weapons: 'Combat Biology', shields: 'Hydro-Shields', propulsion: 'Current Dynamics', economy: 'Deep Harvesting', computing: 'Neural Coral' },
  mechborn: { weapons: 'Directed Energy', shields: 'Deflectors', propulsion: 'Quantum Movement', economy: 'Automation', computing: 'Logic Cores' },
  lithoid: { weapons: 'Crystal Weapons', shields: 'Stone Mantles', propulsion: 'Graviton Drive', economy: 'Mineral Processing', computing: 'Stone Computation' },
  zypherian: { weapons: 'Hive Armaments', shields: 'Carapace Tech', propulsion: 'Swarm Propulsion', economy: 'Hive Industry', computing: 'Collective Mind' },
  vortexborn: { weapons: 'Rift Weaponry', shields: 'Warp Shields', propulsion: 'Dimensional Travel', economy: 'Void Harvesting', computing: 'Rift Computing' },
  silicate: { weapons: 'Prism Weapons', shields: 'Lattice Shields', propulsion: 'Harmonic Travel', economy: 'Crystal Industry', computing: 'Resonance Core' },
  ethereal: { weapons: 'Spectral Arms', shields: 'Void Cloaks', propulsion: 'Phase Shifting', economy: 'Astral Harvesting', computing: 'Oracle Network' },
};

// Welcome messages by race
export const RACE_WELCOME_MESSAGES: Record<RaceId, string> = {
  terran: 'Welcome, Commander. The stars await your command.',
  aquarian: 'The currents have guided you here, Tidal One. The depths welcome your wisdom.',
  mechborn: 'Efficiency protocol engaged. Awaiting operational directives, Commander.',
  lithoid: 'The stone remembers. You have been chosen to shape the cosmos.',
  zypherian: 'The Hive has spoken. One mind, one purpose, one destiny.',
  vortexborn: 'Reality bends to your will. The rift opens for you, Walker.',
  silicate: 'Harmony resonates through crystal. You are the frequency of change.',
  ethereal: 'Between dimensions, between moments — you are the bridge. We await your vision.',
};

// Helper function to get race-specific name
export function getRaceName(
  configKey: string,
  raceId: RaceId,
  nameMap: RaceNameMap,
  defaultName?: string
): string {
  const raceOverrides = nameMap[configKey];
  if (raceOverrides && raceOverrides[raceId]) {
    return raceOverrides[raceId].displayName;
  }
  return defaultName || configKey;
}

// Helper function to get race-specific resource name
export function getRaceResourceName(
  resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy',
  raceId: RaceId
): string {
  return RESOURCE_RACE_NAMES[raceId][resourceType];
}

// Helper function to get race-specific research category name
export function getRaceResearchCategoryName(
  category: 'weapons' | 'shields' | 'propulsion' | 'economy' | 'computing',
  raceId: RaceId
): string {
  return RESEARCH_CATEGORY_RACE_NAMES[raceId][category];
}

// Helper function to get race welcome message
export function getRaceWelcomeMessage(raceId: RaceId): string {
  return RACE_WELCOME_MESSAGES[raceId];
}
