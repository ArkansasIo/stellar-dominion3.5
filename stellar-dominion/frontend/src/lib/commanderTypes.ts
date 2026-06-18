export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "weapon" | "armor" | "module" | "blueprint" | "material";
export type CommanderEquipmentType = "weapon" | "armor" | "module";

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
  race: RaceId;
  class: ClassId;
  subClass: SubClassId | null;
  stats: CommanderStats;
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    module: Item | null;
  };
  inventory: Item[];
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


// Mock recipes
export const blueprints = [
  { id: "plasmaRifle", name: "Plasma Rifle Blueprint", resultId: "plasmaRifle", type: "weapon", cost: { metal: 5000, crystal: 2000 } },
  { id: "voidArmor", name: "Void Armor Blueprint", resultId: "voidArmor", type: "armor", cost: { metal: 10000, crystal: 5000 } },
  { id: "aiCore", name: "AI Core Blueprint", resultId: "aiCore", type: "module", cost: { metal: 5000, crystal: 10000, deuterium: 2000 } },
];
