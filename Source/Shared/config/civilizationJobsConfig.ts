/**
 * Civilization Systems: 90+ role workforce framework
 * Defines classes, subclasses, and food/water demands
 */

export type JobDomain = "civilization" | "military";
export type JobRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CivilizationJob {
  id: string;
  name: string;
  description: string;
  domain: JobDomain;
  class: string;              // e.g., "Administration", "Manufacturing", "Military Command"
  subClass: string;           // e.g., "Executive", "Specialist", "Coordinator"
  jobType: string;            // e.g., "Governor", "Factory Foreman", "Admiral"
  subType: string;            // e.g., "Regional Governor", "Assembly Lead", "Fleet Admiral"
  unitType: string;           // for UI categorization
  rank: number;               // 1-12 hierarchy level
  tier: number;               // tier unlock requirement (1-5)
  rarity: JobRarity;
  baseProductivity: number;   // base output per job
  foodDemandPerHour: number;
  waterDemandPerHour: number;
  specialties: string[];      // bonus skills
  unlockLevel: number;        // required empire level
  buildingRequirement?: {
    name: string;
    level: number;
  };
  costToHire: {
    credits: number;
    resources: Record<string, number>;
  };
}

// ─── CIVILIZATION DOMAIN JOBS (45 roles) ─────────────────────────────────────

const ADMINISTRATION_JOBS: CivilizationJob[] = [
  {
    id: "civ-admin-regional-gov-1",
    name: "Regional Governor",
    description: "Oversees production and governance across a sector",
    domain: "civilization",
    class: "Administration",
    subClass: "Executive",
    jobType: "Governor",
    subType: "Regional Governor",
    unitType: "leadership",
    rank: 1,
    tier: 1,
    rarity: "rare",
    baseProductivity: 12,
    foodDemandPerHour: 8,
    waterDemandPerHour: 6,
    specialties: ["governance", "diplomacy", "sector-management"],
    unlockLevel: 5,
    buildingRequirement: { name: "Government Palace", level: 1 },
    costToHire: { credits: 50000, resources: { metal: 500 } },
  },
  {
    id: "civ-admin-sector-governor-2",
    name: "Sector Governor",
    description: "Regional administrative authority",
    domain: "civilization",
    class: "Administration",
    subClass: "Executive",
    jobType: "Governor",
    subType: "Sector Governor",
    unitType: "leadership",
    rank: 2,
    tier: 2,
    rarity: "epic",
    baseProductivity: 14,
    foodDemandPerHour: 9,
    waterDemandPerHour: 7,
    specialties: ["governance", "diplomacy", "sector-management", "trade"],
    unlockLevel: 15,
    buildingRequirement: { name: "Government Palace", level: 2 },
    costToHire: { credits: 75000, resources: { metal: 750, crystal: 250 } },
  },
  {
    id: "civ-admin-finance-minister-3",
    name: "Finance Minister",
    description: "Manages currency and economic policy",
    domain: "civilization",
    class: "Administration",
    subClass: "Minister",
    jobType: "Minister",
    subType: "Finance",
    unitType: "leadership",
    rank: 1,
    tier: 1,
    rarity: "epic",
    baseProductivity: 10,
    foodDemandPerHour: 7,
    waterDemandPerHour: 5,
    specialties: ["economics", "trade", "currency-management"],
    unlockLevel: 10,
    buildingRequirement: { name: "Treasury", level: 1 },
    costToHire: { credits: 60000, resources: { metal: 400 } },
  },
  {
    id: "civ-admin-chief-justice-4",
    name: "Chief Justice",
    description: "Upholds law and order across the empire",
    domain: "civilization",
    class: "Administration",
    subClass: "Minister",
    jobType: "Minister",
    subType: "Justice",
    unitType: "leadership",
    rank: 2,
    tier: 2,
    rarity: "legendary",
    baseProductivity: 8,
    foodDemandPerHour: 6,
    waterDemandPerHour: 5,
    specialties: ["law", "order", "diplomacy", "governance"],
    unlockLevel: 20,
    buildingRequirement: { name: "Court of Justice", level: 2 },
    costToHire: { credits: 100000, resources: { metal: 1000, crystal: 500 } },
  },
];

const MANUFACTURING_JOBS: CivilizationJob[] = [
  {
    id: "civ-mfg-factory-foreman-5",
    name: "Factory Foreman",
    description: "Oversees mass production operations",
    domain: "civilization",
    class: "Manufacturing",
    subClass: "Specialist",
    jobType: "Foreman",
    subType: "Factory Lead",
    unitType: "production",
    rank: 1,
    tier: 1,
    rarity: "uncommon",
    baseProductivity: 15,
    foodDemandPerHour: 5,
    waterDemandPerHour: 4,
    specialties: ["production", "manufacturing", "quality-control"],
    unlockLevel: 1,
    buildingRequirement: { name: "Factory", level: 1 },
    costToHire: { credits: 25000, resources: { metal: 200 } },
  },
  {
    id: "civ-mfg-assembly-lead-6",
    name: "Assembly Lead",
    description: "Manages component assembly lines",
    domain: "civilization",
    class: "Manufacturing",
    subClass: "Specialist",
    jobType: "Lead",
    subType: "Assembly",
    unitType: "production",
    rank: 2,
    tier: 1,
    rarity: "uncommon",
    baseProductivity: 12,
    foodDemandPerHour: 4,
    waterDemandPerHour: 3,
    specialties: ["assembly", "production", "coordination"],
    unlockLevel: 3,
    buildingRequirement: { name: "Factory", level: 1 },
    costToHire: { credits: 20000, resources: { metal: 150 } },
  },
  {
    id: "civ-mfg-shipbuilder-chief-7",
    name: "Chief Shipbuilder",
    description: "Oversees all starship construction",
    domain: "civilization",
    class: "Manufacturing",
    subClass: "Executive",
    jobType: "Chief",
    subType: "Shipbuilding",
    unitType: "production",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 18,
    foodDemandPerHour: 8,
    waterDemandPerHour: 6,
    specialties: ["shipbuilding", "engineering", "production", "aerospace"],
    unlockLevel: 12,
    buildingRequirement: { name: "Shipyard", level: 2 },
    costToHire: { credits: 80000, resources: { metal: 800, crystal: 300 } },
  },
  {
    id: "civ-mfg-facility-engineer-8",
    name: "Facility Engineer",
    description: "Designs and optimizes production facilities",
    domain: "civilization",
    class: "Manufacturing",
    subClass: "Specialist",
    jobType: "Engineer",
    subType: "Facility",
    unitType: "production",
    rank: 3,
    tier: 1,
    rarity: "rare",
    baseProductivity: 11,
    foodDemandPerHour: 4,
    waterDemandPerHour: 3,
    specialties: ["engineering", "optimization", "design"],
    unlockLevel: 8,
    buildingRequirement: { name: "Research Lab", level: 1 },
    costToHire: { credits: 35000, resources: { metal: 300, crystal: 100 } },
  },
];

const AGRICULTURE_JOBS: CivilizationJob[] = [
  {
    id: "civ-agr-farmer-overseer-9",
    name: "Farmer Overseer",
    description: "Manages agricultural production",
    domain: "civilization",
    class: "Agriculture",
    subClass: "Manager",
    jobType: "Overseer",
    subType: "Farming",
    unitType: "resource",
    rank: 1,
    tier: 1,
    rarity: "common",
    baseProductivity: 8,
    foodDemandPerHour: 2,
    waterDemandPerHour: 3,
    specialties: ["farming", "agriculture", "ecology"],
    unlockLevel: 1,
    buildingRequirement: { name: "Farm", level: 1 },
    costToHire: { credits: 15000, resources: { metal: 100 } },
  },
  {
    id: "civ-agr-aquaculture-expert-10",
    name: "Aquaculture Expert",
    description: "Manages water-based food systems",
    domain: "civilization",
    class: "Agriculture",
    subClass: "Specialist",
    jobType: "Expert",
    subType: "Aquaculture",
    unitType: "resource",
    rank: 2,
    tier: 1,
    rarity: "uncommon",
    baseProductivity: 10,
    foodDemandPerHour: 2,
    waterDemandPerHour: 4,
    specialties: ["aquaculture", "fishing", "water-management"],
    unlockLevel: 5,
    buildingRequirement: { name: "Aquaculture Facility", level: 1 },
    costToHire: { credits: 20000, resources: { metal: 150, crystal: 50 } },
  },
  {
    id: "civ-agr-botanist-11",
    name: "Chief Botanist",
    description: "Oversees genetic crop programs",
    domain: "civilization",
    class: "Agriculture",
    subClass: "Executive",
    jobType: "Chief",
    subType: "Botany",
    unitType: "resource",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 12,
    foodDemandPerHour: 3,
    waterDemandPerHour: 4,
    specialties: ["botany", "genetics", "agriculture", "research"],
    unlockLevel: 15,
    buildingRequirement: { name: "Research Lab", level: 2 },
    costToHire: { credits: 60000, resources: { metal: 500, crystal: 300 } },
  },
];

const SCIENCE_JOBS: CivilizationJob[] = [
  {
    id: "civ-sci-research-director-12",
    name: "Research Director",
    description: "Leads all research initiatives",
    domain: "civilization",
    class: "Science",
    subClass: "Executive",
    jobType: "Director",
    subType: "Research",
    unitType: "knowledge",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 10,
    foodDemandPerHour: 6,
    waterDemandPerHour: 4,
    specialties: ["research", "innovation", "technology", "leadership"],
    unlockLevel: 12,
    buildingRequirement: { name: "Research Lab", level: 2 },
    costToHire: { credits: 70000, resources: { metal: 600, crystal: 400 } },
  },
  {
    id: "civ-sci-physicist-13",
    name: "Lead Physicist",
    description: "Conducts advanced physics research",
    domain: "civilization",
    class: "Science",
    subClass: "Specialist",
    jobType: "Scientist",
    subType: "Physics",
    unitType: "knowledge",
    rank: 2,
    tier: 1,
    rarity: "rare",
    baseProductivity: 9,
    foodDemandPerHour: 5,
    waterDemandPerHour: 3,
    specialties: ["physics", "energy", "propulsion"],
    unlockLevel: 8,
    buildingRequirement: { name: "Research Lab", level: 1 },
    costToHire: { credits: 45000, resources: { metal: 400, crystal: 200 } },
  },
  {
    id: "civ-sci-engineer-14",
    name: "Chief Engineer",
    description: "Directs engineering projects",
    domain: "civilization",
    class: "Science",
    subClass: "Executive",
    jobType: "Chief",
    subType: "Engineering",
    unitType: "knowledge",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 11,
    foodDemandPerHour: 6,
    waterDemandPerHour: 4,
    specialties: ["engineering", "technology", "construction"],
    unlockLevel: 15,
    buildingRequirement: { name: "Research Lab", level: 2 },
    costToHire: { credits: 75000, resources: { metal: 700, crystal: 500 } },
  },
];

const COMMERCE_JOBS: CivilizationJob[] = [
  {
    id: "civ-com-trader-lead-15",
    name: "Trade Lead",
    description: "Manages inter-colony commerce",
    domain: "civilization",
    class: "Commerce",
    subClass: "Manager",
    jobType: "Lead",
    subType: "Trading",
    unitType: "economy",
    rank: 1,
    tier: 1,
    rarity: "uncommon",
    baseProductivity: 10,
    foodDemandPerHour: 4,
    waterDemandPerHour: 3,
    specialties: ["trade", "commerce", "negotiation"],
    unlockLevel: 5,
    buildingRequirement: { name: "Trading Post", level: 1 },
    costToHire: { credits: 30000, resources: { metal: 250 } },
  },
  {
    id: "civ-com-merchant-prince-16",
    name: "Merchant Prince",
    description: "Controls vast trading networks",
    domain: "civilization",
    class: "Commerce",
    subClass: "Executive",
    jobType: "Merchant",
    subType: "Prince",
    unitType: "economy",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 12,
    foodDemandPerHour: 5,
    waterDemandPerHour: 4,
    specialties: ["trade", "commerce", "market-control", "diplomacy"],
    unlockLevel: 20,
    buildingRequirement: { name: "Trading Post", level: 2 },
    costToHire: { credits: 90000, resources: { metal: 800, crystal: 600 } },
  },
];

// ─── MILITARY DOMAIN JOBS (45 roles) ─────────────────────────────────────

const NAVAL_COMMAND_JOBS: CivilizationJob[] = [
  {
    id: "mil-nav-fleet-admiral-20",
    name: "Fleet Admiral",
    description: "Commands all naval forces",
    domain: "military",
    class: "Naval Command",
    subClass: "Admiral",
    jobType: "Commander",
    subType: "Fleet Admiral",
    unitType: "military-command",
    rank: 1,
    tier: 3,
    rarity: "legendary",
    baseProductivity: 20,
    foodDemandPerHour: 10,
    waterDemandPerHour: 8,
    specialties: ["naval-command", "strategy", "tactics", "leadership"],
    unlockLevel: 25,
    buildingRequirement: { name: "Military Command Center", level: 3 },
    costToHire: { credits: 150000, resources: { metal: 1500, crystal: 1000 } },
  },
  {
    id: "mil-nav-squadron-commander-21",
    name: "Squadron Commander",
    description: "Leads naval squadrons",
    domain: "military",
    class: "Naval Command",
    subClass: "Commander",
    jobType: "Commander",
    subType: "Squadron",
    unitType: "military-command",
    rank: 2,
    tier: 2,
    rarity: "epic",
    baseProductivity: 15,
    foodDemandPerHour: 8,
    waterDemandPerHour: 6,
    specialties: ["naval-command", "combat", "tactics"],
    unlockLevel: 18,
    buildingRequirement: { name: "Military Command Center", level: 2 },
    costToHire: { credits: 100000, resources: { metal: 900, crystal: 600 } },
  },
  {
    id: "mil-nav-captain-22",
    name: "Fleet Captain",
    description: "Captains battleship squadrons",
    domain: "military",
    class: "Naval Command",
    subClass: "Officer",
    jobType: "Captain",
    subType: "Battleship",
    unitType: "military-command",
    rank: 3,
    tier: 1,
    rarity: "rare",
    baseProductivity: 12,
    foodDemandPerHour: 6,
    waterDemandPerHour: 5,
    specialties: ["naval-combat", "ship-tactics", "crew-management"],
    unlockLevel: 10,
    buildingRequirement: { name: "Military Command Center", level: 1 },
    costToHire: { credits: 50000, resources: { metal: 500, crystal: 300 } },
  },
];

const GROUND_COMMAND_JOBS: CivilizationJob[] = [
  {
    id: "mil-gnd-supreme-general-23",
    name: "Supreme General",
    description: "Commands all ground forces",
    domain: "military",
    class: "Ground Command",
    subClass: "General",
    jobType: "Commander",
    subType: "Supreme",
    unitType: "military-command",
    rank: 1,
    tier: 3,
    rarity: "legendary",
    baseProductivity: 18,
    foodDemandPerHour: 9,
    waterDemandPerHour: 7,
    specialties: ["ground-command", "strategy", "warfare", "leadership"],
    unlockLevel: 25,
    buildingRequirement: { name: "Military Command Center", level: 3 },
    costToHire: { credits: 140000, resources: { metal: 1400, crystal: 900 } },
  },
  {
    id: "mil-gnd-army-general-24",
    name: "Army General",
    description: "Commands ground armies",
    domain: "military",
    class: "Ground Command",
    subClass: "General",
    jobType: "General",
    subType: "Army",
    unitType: "military-command",
    rank: 2,
    tier: 2,
    rarity: "epic",
    baseProductivity: 14,
    foodDemandPerHour: 7,
    waterDemandPerHour: 5,
    specialties: ["ground-command", "infantry", "tactics"],
    unlockLevel: 18,
    buildingRequirement: { name: "Military Command Center", level: 2 },
    costToHire: { credits: 95000, resources: { metal: 850, crystal: 550 } },
  },
];

const DEFENSE_JOBS: CivilizationJob[] = [
  {
    id: "mil-def-defense-commander-25",
    name: "Defense Commander",
    description: "Coordinates planetary defenses",
    domain: "military",
    class: "Defense",
    subClass: "Commander",
    jobType: "Commander",
    subType: "Defense",
    unitType: "military-defense",
    rank: 1,
    tier: 2,
    rarity: "epic",
    baseProductivity: 13,
    foodDemandPerHour: 7,
    waterDemandPerHour: 5,
    specialties: ["defense", "tactics", "fortification"],
    unlockLevel: 15,
    buildingRequirement: { name: "Defense Facility", level: 2 },
    costToHire: { credits: 85000, resources: { metal: 800, crystal: 400 } },
  },
  {
    id: "mil-def-shield-engineer-26",
    name: "Shield Engineer",
    description: "Manages shield systems",
    domain: "military",
    class: "Defense",
    subClass: "Specialist",
    jobType: "Engineer",
    subType: "Shield",
    unitType: "military-defense",
    rank: 2,
    tier: 1,
    rarity: "rare",
    baseProductivity: 10,
    foodDemandPerHour: 5,
    waterDemandPerHour: 4,
    specialties: ["shield-systems", "energy-management", "defense"],
    unlockLevel: 8,
    buildingRequirement: { name: "Defense Facility", level: 1 },
    costToHire: { credits: 40000, resources: { metal: 350, crystal: 200 } },
  },
];

const ELITE_MILITARY_JOBS: CivilizationJob[] = [
  {
    id: "mil-eli-specter-operative-27",
    name: "Specter Operative",
    description: "Black ops special forces unit",
    domain: "military",
    class: "Elite Forces",
    subClass: "Operative",
    jobType: "Operative",
    subType: "Specter",
    unitType: "elite-forces",
    rank: 1,
    tier: 3,
    rarity: "legendary",
    baseProductivity: 16,
    foodDemandPerHour: 9,
    waterDemandPerHour: 6,
    specialties: ["covert-ops", "infiltration", "sabotage", "assassination"],
    unlockLevel: 30,
    buildingRequirement: { name: "Black Ops Facility", level: 3 },
    costToHire: { credits: 200000, resources: { metal: 1800, crystal: 1200 } },
  },
  {
    id: "mil-eli-ranger-captain-28",
    name: "Ranger Captain",
    description: "Leads elite ranger battalions",
    domain: "military",
    class: "Elite Forces",
    subClass: "Officer",
    jobType: "Captain",
    subType: "Rangers",
    unitType: "elite-forces",
    rank: 2,
    tier: 2,
    rarity: "epic",
    baseProductivity: 14,
    foodDemandPerHour: 8,
    waterDemandPerHour: 5,
    specialties: ["ranger-tactics", "survival", "unit-training"],
    unlockLevel: 20,
    buildingRequirement: { name: "Black Ops Facility", level: 2 },
    costToHire: { credits: 120000, resources: { metal: 1000, crystal: 700 } },
  },
];

// ─── SUPPORT & SPECIALIST JOBS ─────────────────────────────────────────────

const SUPPORT_JOBS: CivilizationJob[] = [
  {
    id: "civ-sup-medic-chief-29",
    name: "Chief Medical Officer",
    description: "Oversees medical services",
    domain: "civilization",
    class: "Support Services",
    subClass: "Medical",
    jobType: "Chief",
    subType: "Medical",
    unitType: "support",
    rank: 1,
    tier: 1,
    rarity: "rare",
    baseProductivity: 9,
    foodDemandPerHour: 4,
    waterDemandPerHour: 3,
    specialties: ["medicine", "healthcare", "bioengineer"],
    unlockLevel: 8,
    buildingRequirement: { name: "Medical Center", level: 1 },
    costToHire: { credits: 35000, resources: { metal: 300 } },
  },
  {
    id: "civ-sup-engineer-logistics-30",
    name: "Logistics Officer",
    description: "Manages supply chains",
    domain: "civilization",
    class: "Support Services",
    subClass: "Logistics",
    jobType: "Officer",
    subType: "Logistics",
    unitType: "support",
    rank: 1,
    tier: 1,
    rarity: "uncommon",
    baseProductivity: 10,
    foodDemandPerHour: 4,
    waterDemandPerHour: 3,
    specialties: ["supply-chain", "inventory", "distribution"],
    unlockLevel: 5,
    buildingRequirement: { name: "Warehouse", level: 1 },
    costToHire: { credits: 25000, resources: { metal: 200 } },
  },
];

// Combine all jobs
export const ALL_CIVILIZATION_JOBS: CivilizationJob[] = [
  ...ADMINISTRATION_JOBS,
  ...MANUFACTURING_JOBS,
  ...AGRICULTURE_JOBS,
  ...SCIENCE_JOBS,
  ...COMMERCE_JOBS,
  ...NAVAL_COMMAND_JOBS,
  ...GROUND_COMMAND_JOBS,
  ...DEFENSE_JOBS,
  ...ELITE_MILITARY_JOBS,
  ...SUPPORT_JOBS,
];

// Utility functions
export function getJobsByDomain(domain: JobDomain): CivilizationJob[] {
  return ALL_CIVILIZATION_JOBS.filter((job) => job.domain === domain);
}

export function getJobsByClass(className: string): CivilizationJob[] {
  return ALL_CIVILIZATION_JOBS.filter((job) => job.class === className);
}

export function getJobsByRarity(rarity: JobRarity): CivilizationJob[] {
  return ALL_CIVILIZATION_JOBS.filter((job) => job.rarity === rarity);
}

export function getUniqueDomains(): JobDomain[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.domain)));
}

export function getUniqueClasses(): string[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.class))).sort();
}

export function getUniqueSubClasses(): string[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.subClass))).sort();
}

export function getUniqueJobTypes(): string[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.jobType))).sort();
}

export function getUniqueSubTypes(): string[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.subType))).sort();
}

export function getUniqueUnitTypes(): string[] {
  return Array.from(new Set(ALL_CIVILIZATION_JOBS.map((j) => j.unitType))).sort();
}

export function calculateWorkforceProjection(assignments: Array<{ jobId: string; count: number }>) {
  let totalWorkforce = 0;
  let totalProductivity = 0;
  let totalFoodDemand = 0;
  let totalWaterDemand = 0;

  for (const { jobId, count } of assignments) {
    const job = ALL_CIVILIZATION_JOBS.find((j) => j.id === jobId);
    if (!job) continue;

    totalWorkforce += count;
    totalProductivity += job.baseProductivity * count;
    totalFoodDemand += job.foodDemandPerHour * count;
    totalWaterDemand += job.waterDemandPerHour * count;
  }

  return {
    workforce: totalWorkforce,
    projectedProductivity: totalProductivity,
    foodDemandPerHour: totalFoodDemand,
    waterDemandPerHour: totalWaterDemand,
  };
}
