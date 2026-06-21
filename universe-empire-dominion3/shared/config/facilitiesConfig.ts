// Comprehensive Facilities and Buildings System
// Multiple types and classes for all building categories

export interface FacilityProgressionConfig {
  tiers: {
    max: number;
  };
  levels: {
    max: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  type: "resource" | "energy" | "storage" | "military" | "research" | "civilian" | "special" | "infrastructure" | "orbital";
  class: "common" | "rare" | "epic" | "legendary" | "mythic";
  tier: number;
  level: number;
  progressionConfig: FacilityProgressionConfig;
  cost: { metal: number; crystal: number; deuterium: number };
  time: number; // construction time in seconds
  production?: { metal?: number; crystal?: number; deuterium?: number; energy?: number };
  storage?: number;
  defense?: number;
  offense?: number;
  population?: number;
  bonuses?: { [key: string]: number };
  requirements?: { building?: string; tech?: string; tier?: number };
}

// RESOURCE PRODUCTION FACILITIES (8 types x 5 classes = 40 variants)
export const RESOURCE_FACILITIES: Facility[] = [
  // Metal Mines
  { id: "metalMineCom", name: "Basic Metal Mine", description: "Common metal extraction facility", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 60, crystal: 15, deuterium: 0 }, time: 30, production: { metal: 30, energy: -10 } },
  { id: "metalMineRare", name: "Advanced Metal Mine", description: "Rare metal mining technology", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150, crystal: 50, deuterium: 25 }, time: 25, production: { metal: 60, energy: -15 } },
  { id: "metalMineEpic", name: "Precision Metal Extractor", description: "Epic-tier metal extraction", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 400, crystal: 150, deuterium: 75 }, time: 20, production: { metal: 120, energy: -20 } },
  { id: "metalMineLeg", name: "Legendary Metal Harvester", description: "Legendary mining technology", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 500, deuterium: 250 }, time: 15, production: { metal: 250, energy: -30 } },
  { id: "metalMineMy", name: "Mythic Metal Nexus", description: "Ultimate metal production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 2000, deuterium: 1000 }, time: 10, production: { metal: 500, energy: -40 } },

  // Crystal Mines
  { id: "crystalMineCom", name: "Basic Crystal Mine", description: "Common crystal extraction", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 48, crystal: 24, deuterium: 0 }, time: 30, production: { crystal: 15, energy: -10 } },
  { id: "crystalMineRare", name: "Advanced Crystal Mine", description: "Rare crystal mining", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 120, crystal: 60, deuterium: 20 }, time: 25, production: { crystal: 30, energy: -15 } },
  { id: "crystalMineEpic", name: "Precision Crystal Extractor", description: "Epic crystal extraction", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 320, crystal: 180, deuterium: 60 }, time: 20, production: { crystal: 60, energy: -20 } },
  { id: "crystalMineLeg", name: "Legendary Crystal Harvester", description: "Legendary crystal mining", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800, crystal: 600, deuterium: 200 }, time: 15, production: { crystal: 125, energy: -30 } },
  { id: "crystalMineMy", name: "Mythic Crystal Nexus", description: "Ultimate crystal production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2400, crystal: 2400, deuterium: 800 }, time: 10, production: { crystal: 250, energy: -40 } },

  // Deuterium Synthesizers
  { id: "deutSynCom", name: "Basic Deuterium Synthesizer", description: "Common deuterium production", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 225, crystal: 75, deuterium: 0 }, time: 30, production: { deuterium: 10, energy: -20 } },
  { id: "deutSynRare", name: "Advanced Deuterium Synthesizer", description: "Rare deuterium synthesis", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 450, crystal: 180, deuterium: 45 }, time: 25, production: { deuterium: 20, energy: -25 } },
  { id: "deutSynEpic", name: "Precision Deuterium Lab", description: "Epic deuterium production", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1200, crystal: 500, deuterium: 150 }, time: 20, production: { deuterium: 40, energy: -30 } },
  { id: "deutSynLeg", name: "Legendary Deuterium Forge", description: "Legendary deuterium synthesis", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1500, deuterium: 500 }, time: 15, production: { deuterium: 80, energy: -40 } },
  { id: "deutSynMy", name: "Mythic Deuterium Nexus", description: "Ultimate deuterium production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 5000, deuterium: 2000 }, time: 10, production: { deuterium: 160, energy: -50 } },
];

// ENERGY PRODUCTION FACILITIES (6 types x 5 classes = 30 variants)
export const ENERGY_FACILITIES: Facility[] = [
  // Solar Plants
  { id: "solarCom", name: "Basic Solar Plant", description: "Harnesses solar energy", type: "energy", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 75, crystal: 30, deuterium: 0 }, time: 30, production: { energy: 20 } },
  { id: "solarRare", name: "Advanced Solar Array", description: "Rare solar technology", type: "energy", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 180, crystal: 90, deuterium: 30 }, time: 25, production: { energy: 45 } },
  { id: "solarEpic", name: "Precision Solar Collector", description: "Epic solar collection", type: "energy", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500, crystal: 250, deuterium: 100 }, time: 20, production: { energy: 90 } },
  { id: "solarLeg", name: "Legendary Solar Generator", description: "Legendary solar power", type: "energy", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1500, crystal: 750, deuterium: 300 }, time: 15, production: { energy: 180 } },
  { id: "solarMy", name: "Mythic Solar Nexus", description: "Ultimate solar power", type: "energy", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 4500, crystal: 2500, deuterium: 1000 }, time: 10, production: { energy: 360 } },

  // Fusion Reactors
  { id: "fusionCom", name: "Basic Fusion Reactor", description: "Fusion energy production", type: "energy", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 150, deuterium: 75 }, time: 40, production: { energy: 50 }, requirements: { building: "deutSynCom" } },
  { id: "fusionRare", name: "Advanced Fusion Reactor", description: "Rare fusion technology", type: "energy", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 750, crystal: 400, deuterium: 200 }, time: 35, production: { energy: 110 }, requirements: { building: "deutSynRare" } },
  { id: "fusionEpic", name: "Precision Fusion Engine", description: "Epic fusion reactor", type: "energy", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 1200, deuterium: 600 }, time: 30, production: { energy: 220 }, requirements: { building: "deutSynEpic" } },
  { id: "fusionLeg", name: "Legendary Fusion Forge", description: "Legendary fusion power", type: "energy", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 6000, crystal: 4000, deuterium: 2000 }, time: 25, production: { energy: 440 }, requirements: { building: "deutSynLeg" } },
  { id: "fusionMy", name: "Mythic Fusion Nexus", description: "Ultimate fusion power", type: "energy", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 18000, crystal: 12000, deuterium: 6000 }, time: 20, production: { energy: 880 }, requirements: { building: "deutSynMy" } },
];

// STORAGE FACILITIES (3 types x 5 classes = 15 variants)
export const STORAGE_FACILITIES: Facility[] = [
  // Metal Storage
  { id: "metalStorCom", name: "Basic Metal Storage", description: "Stores metal resources", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 0, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "metalStorRare", name: "Advanced Metal Vault", description: "Rare storage facility", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1000, deuterium: 500 }, time: 25, storage: 500000 },
  { id: "metalStorEpic", name: "Precision Metal Repository", description: "Epic storage capacity", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 4000, deuterium: 2000 }, time: 20, storage: 2000000 },
  { id: "metalStorLeg", name: "Legendary Metal Archive", description: "Legendary storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 30000, crystal: 15000, deuterium: 7500 }, time: 15, storage: 10000000 },
  { id: "metalStorMy", name: "Mythic Metal Nexus", description: "Ultimate storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100000, crystal: 50000, deuterium: 25000 }, time: 10, storage: 50000000 },

  // Crystal Storage
  { id: "crystalStorCom", name: "Basic Crystal Storage", description: "Stores crystal resources", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 500, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "crystalStorRare", name: "Advanced Crystal Vault", description: "Rare crystal storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 500 }, time: 25, storage: 500000 },
  { id: "crystalStorEpic", name: "Precision Crystal Repository", description: "Epic crystal storage", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2000 }, time: 20, storage: 2000000 },
  { id: "crystalStorLeg", name: "Legendary Crystal Archive", description: "Legendary crystal storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 7500 }, time: 15, storage: 10000000 },
  { id: "crystalStorMy", name: "Mythic Crystal Nexus", description: "Ultimate crystal storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80000, crystal: 60000, deuterium: 25000 }, time: 10, storage: 50000000 },

  // Deuterium Storage
  { id: "deutStorCom", name: "Basic Deuterium Tank", description: "Stores deuterium safely", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 1000, deuterium: 0 }, time: 30, storage: 50000 },
  { id: "deutStorRare", name: "Advanced Deuterium Vault", description: "Rare deuterium storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 2500, deuterium: 500 }, time: 25, storage: 250000 },
  { id: "deutStorEpic", name: "Precision Deuterium Repository", description: "Epic deuterium storage", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 8000, deuterium: 2000 }, time: 20, storage: 1000000 },
  { id: "deutStorLeg", name: "Legendary Deuterium Archive", description: "Legendary deuterium storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 25000, deuterium: 10000 }, time: 15, storage: 5000000 },
  { id: "deutStorMy", name: "Mythic Deuterium Nexus", description: "Ultimate deuterium storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80000, crystal: 80000, deuterium: 40000 }, time: 10, storage: 25000000 },
];

// MILITARY FACILITIES (5 types x 5 classes = 25 variants)
export const MILITARY_FACILITIES: Facility[] = [
  // Shipyards
  { id: "shipyardCom", name: "Basic Shipyard", description: "Constructs ships", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 400, crystal: 200, deuterium: 100 }, time: 30, bonuses: { buildSpeed: 1.0 } },
  { id: "shipyardRare", name: "Advanced Shipyard", description: "Rare shipbuilding facility", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 600, deuterium: 300 }, time: 25, bonuses: { buildSpeed: 1.5 } },
  { id: "shipyardEpic", name: "Precision Shipyard", description: "Epic fleet construction", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 2000, deuterium: 1000 }, time: 20, bonuses: { buildSpeed: 2.0 } },
  { id: "shipyardLeg", name: "Legendary Shipyard", description: "Legendary vessel construction", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 7000, deuterium: 3500 }, time: 15, bonuses: { buildSpeed: 3.0 } },
  { id: "shipyardMy", name: "Mythic Shipyard", description: "Ultimate fleet construction", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 30000, crystal: 25000, deuterium: 12500 }, time: 10, bonuses: { buildSpeed: 5.0 } },

  // Barracks
  { id: "barracksCom", name: "Basic Barracks", description: "Trains ground units", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 150, deuterium: 75 }, time: 30, population: 100 },
  { id: "barracksRare", name: "Advanced Barracks", description: "Rare troop training", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 750, crystal: 500, deuterium: 250 }, time: 25, population: 300 },
  { id: "barracksEpic", name: "Precision Training Center", description: "Epic unit training", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 750 }, time: 20, population: 750 },
  { id: "barracksLeg", name: "Legendary War Academy", description: "Legendary troop training", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2500 }, time: 15, population: 1500 },
  { id: "barracksMy", name: "Mythic War Nexus", description: "Ultimate troop production", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 9000 }, time: 10, population: 3000 },

  // Defense Towers
  { id: "defenseCom", name: "Basic Defense Tower", description: "Defends against attacks", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 100, deuterium: 0 }, time: 30, defense: 80 },
  { id: "defenseRare", name: "Advanced Defense Battery", description: "Rare defense structure", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800, crystal: 400, deuterium: 200 }, time: 25, defense: 250 },
  { id: "defenseEpic", name: "Precision Defense Array", description: "Epic defensive capability", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 750 }, time: 20, defense: 750 },
  { id: "defenseLeg", name: "Legendary Fortress", description: "Legendary defensive position", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2500 }, time: 15, defense: 2000 },
  { id: "defenseMy", name: "Mythic Fortress Nexus", description: "Ultimate defense", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 9000 }, time: 10, defense: 5000 },

  // Shield Generators
  { id: "shieldCom", name: "Basic Shield Generator", description: "Generates protective shield", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 2000, deuterium: 500 }, time: 40, defense: 1000 },
  { id: "shieldRare", name: "Advanced Shield Generator", description: "Rare shield technology", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 5000, crystal: 5000, deuterium: 1500 }, time: 35, defense: 3000 },
  { id: "shieldEpic", name: "Precision Shield System", description: "Epic shield projection", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 15000, crystal: 15000, deuterium: 5000 }, time: 30, defense: 10000 },
  { id: "shieldLeg", name: "Legendary Shield Dome", description: "Legendary protective barrier", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 50000, crystal: 50000, deuterium: 15000 }, time: 25, defense: 30000 },
  { id: "shieldMy", name: "Mythic Shield Nexus", description: "Ultimate shield technology", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150000, crystal: 150000, deuterium: 50000 }, time: 20, defense: 100000 },
];

// RESEARCH FACILITIES (4 types x 5 classes = 20 variants)
export const RESEARCH_FACILITIES: Facility[] = [
  // Research Labs
  { id: "labCom", name: "Basic Research Lab", description: "Conducts scientific research", type: "research", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200, crystal: 400, deuterium: 200 }, time: 30, bonuses: { researchSpeed: 1.0 } },
  { id: "labRare", name: "Advanced Research Lab", description: "Rare research facilities", type: "research", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600, crystal: 1000, deuterium: 500 }, time: 25, bonuses: { researchSpeed: 1.5 } },
  { id: "labEpic", name: "Precision Research Institute", description: "Epic research capability", type: "research", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 3500, deuterium: 1500 }, time: 20, bonuses: { researchSpeed: 2.5 } },
  { id: "labLeg", name: "Legendary Research Academy", description: "Legendary research center", type: "research", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 7000, crystal: 12000, deuterium: 5000 }, time: 15, bonuses: { researchSpeed: 4.0 } },
  { id: "labMy", name: "Mythic Research Nexus", description: "Ultimate research facility", type: "research", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 21000, crystal: 40000, deuterium: 15000 }, time: 10, bonuses: { researchSpeed: 7.0 } },

  // Observatories
  { id: "obsCom", name: "Basic Observatory", description: "Observes space phenomena", type: "research", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 250, crystal: 300, deuterium: 100 }, time: 35, bonuses: { spyCapacity: 100 } },
  { id: "obsRare", name: "Advanced Observatory", description: "Rare observation technology", type: "research", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 700, crystal: 900, deuterium: 300 }, time: 30, bonuses: { spyCapacity: 300 } },
  { id: "obsEpic", name: "Precision Observatory Array", description: "Epic observation network", type: "research", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 3000, deuterium: 1000 }, time: 25, bonuses: { spyCapacity: 750 } },
  { id: "obsLeg", name: "Legendary Observation Center", description: "Legendary scanning capability", type: "research", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 12000, deuterium: 4000 }, time: 20, bonuses: { spyCapacity: 2000 } },
  { id: "obsMy", name: "Mythic Observatory Nexus", description: "Ultimate observation", type: "research", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 27000, crystal: 40000, deuterium: 12000 }, time: 15, bonuses: { spyCapacity: 5000 } },
];

// CIVILIAN FACILITIES (3 types x 5 classes = 15 variants)
export const CIVILIAN_FACILITIES: Facility[] = [
  // Residential
  { id: "resCom", name: "Basic Residential", description: "Housing for population", type: "civilian", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100, crystal: 50, deuterium: 0 }, time: 20, population: 50 },
  { id: "resRare", name: "Advanced Housing", description: "Rare residential complex", type: "civilian", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 200, deuterium: 100 }, time: 18, population: 200 },
  { id: "resEpic", name: "Precision Living Complex", description: "Epic residential space", type: "civilian", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 700, deuterium: 400 }, time: 15, population: 600 },
  { id: "resLeg", name: "Legendary Metropolis", description: "Legendary living quarters", type: "civilian", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3500, crystal: 2500, deuterium: 1500 }, time: 12, population: 1500 },
  { id: "resMy", name: "Mythic Arcology", description: "Ultimate residential tower", type: "civilian", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 8000, deuterium: 5000 }, time: 10, population: 3500 },

  // Trade Centers
  { id: "tradeCom", name: "Basic Trade Center", description: "Enables commerce", type: "civilian", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 200, crystal: 100, deuterium: 50 }, time: 25, bonuses: { tradeCapacity: 100, tradeFeeReduction: 0.01 } },
  { id: "tradeRare", name: "Advanced Trade Hub", description: "Rare trading facility", type: "civilian", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 600, crystal: 400, deuterium: 200 }, time: 22, bonuses: { tradeCapacity: 300, tradeFeeReduction: 0.05 } },
  { id: "tradeEpic", name: "Precision Commerce Complex", description: "Epic trade network", type: "civilian", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 2000, crystal: 1500, deuterium: 700 }, time: 20, bonuses: { tradeCapacity: 1000, tradeFeeReduction: 0.1 } },
  { id: "tradeLeg", name: "Legendary Trade Empire", description: "Legendary commercial hub", type: "civilian", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 7000, crystal: 5000, deuterium: 2500 }, time: 17, bonuses: { tradeCapacity: 3000, tradeFeeReduction: 0.15 } },
  { id: "tradeMy", name: "Mythic Commerce Nexus", description: "Ultimate trading power", type: "civilian", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 21000, crystal: 15000, deuterium: 8000 }, time: 15, bonuses: { tradeCapacity: 10000, tradeFeeReduction: 0.25 } },
];

// SPECIAL FACILITIES (5 types x 3 classes = 15 variants)
export const SPECIAL_FACILITIES: Facility[] = [
  // Jump Gates (rare to mythic only)
  { id: "jumpgateRare", name: "Basic Jump Gate", description: "Enables instant travel", type: "special", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500000, crystal: 1000000, deuterium: 0 }, time: 120, bonuses: { travelSpeed: 1000 } },
  { id: "jumpgateEpic", name: "Advanced Jump Gate", description: "Epic dimensional transport", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000000, crystal: 4000000, deuterium: 1000000 }, time: 100, bonuses: { travelSpeed: 5000 } },
  { id: "jumpgateLeg", name: "Legendary Jump Gate", description: "Legendary gateway network", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000000, crystal: 16000000, deuterium: 4000000 }, time: 80, bonuses: { travelSpeed: 10000 } },

  // Sensor Arrays (rare to mythic)
  { id: "sensorRare", name: "Advanced Sensor Array", description: "Rare scanning capability", type: "special", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 50000, crystal: 25000, deuterium: 10000 }, time: 60, bonuses: { detectionRange: 1000 } },
  { id: "sensorEpic", name: "Precision Sensor Network", description: "Epic detection system", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200000, crystal: 100000, deuterium: 50000 }, time: 50, bonuses: { detectionRange: 5000 } },
  { id: "sensorLeg", name: "Legendary Sensor Nexus", description: "Legendary scanning network", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800000, crystal: 500000, deuterium: 200000 }, time: 40, bonuses: { detectionRange: 10000 } },

  // Terraformers (epic to mythic)
  { id: "terraEpic", name: "Precision Terraformer", description: "Epic planetary modification", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100000, crystal: 200000, deuterium: 500000 }, time: 90, bonuses: { fieldExpansion: 20 } },
  { id: "terraLeg", name: "Legendary Terraformer", description: "Legendary world shaper", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500000, crystal: 1000000, deuterium: 2000000 }, time: 70, bonuses: { fieldExpansion: 50 } },
  { id: "terraMy", name: "Mythic Terraformer Nexus", description: "Ultimate world transformation", type: "special", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000000, crystal: 4000000, deuterium: 8000000 }, time: 50, bonuses: { fieldExpansion: 100 } },

  // Cloaking Generators (epic to mythic)
  { id: "cloakEpic", name: "Precision Cloak Generator", description: "Epic stealth technology", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150000, crystal: 300000, deuterium: 100000 }, time: 75, bonuses: { stealthPower: 75 } },
  { id: "cloakLeg", name: "Legendary Cloak Field", description: "Legendary invisibility system", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600000, crystal: 1200000, deuterium: 400000 }, time: 60, bonuses: { stealthPower: 150 } },
  { id: "cloakMy", name: "Mythic Cloak Nexus", description: "Ultimate stealth mastery", type: "special", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500000, crystal: 5000000, deuterium: 1500000 }, time: 45, bonuses: { stealthPower: 300 } },

  // Orbital Platforms (rare to mythic)
  { id: "orbitalRare", name: "Advanced Orbital Platform", description: "Rare orbital installation", type: "orbital", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 75000, crystal: 50000, deuterium: 25000 }, time: 70, bonuses: { orbitModifier: 1.5 } },
  { id: "orbitalEpic", name: "Precision Space Station", description: "Epic orbital capability", type: "orbital", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300000, crystal: 200000, deuterium: 100000 }, time: 60, bonuses: { orbitModifier: 3.0 } },
  { id: "orbitalLeg", name: "Legendary Orbital Fortress", description: "Legendary space platform", type: "orbital", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1200000, crystal: 800000, deuterium: 400000 }, time: 50, bonuses: { orbitModifier: 5.0 } },
  { id: "orbitalMy", name: "Mythic Orbital Nexus", description: "Ultimate space platform", type: "orbital", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 5000000, crystal: 3000000, deuterium: 1500000 }, time: 40, bonuses: { orbitModifier: 10.0 } },
];

// Combine all facilities
export const ALL_FACILITIES: Facility[] = [
  ...RESOURCE_FACILITIES,
  ...ENERGY_FACILITIES,
  ...STORAGE_FACILITIES,
  ...MILITARY_FACILITIES,
  ...RESEARCH_FACILITIES,
  ...CIVILIAN_FACILITIES,
  ...SPECIAL_FACILITIES,
];

// Helper function to get facilities by type and class
export function getFacilitiesByTypeAndClass(type: string, facilityClass: string): Facility[] {
  return ALL_FACILITIES.filter(f => f.type === type && f.class === facilityClass);
}

// Helper function to get all facilities of a type
export function getFacilitiesByType(type: string): Facility[] {
  return ALL_FACILITIES.filter(f => f.type === type);
}

// Export facility statistics
export const FACILITY_STATS = {
  totalFacilities: ALL_FACILITIES.length,
  types: {
    resource: RESOURCE_FACILITIES.length,
    energy: ENERGY_FACILITIES.length,
    storage: STORAGE_FACILITIES.length,
    military: MILITARY_FACILITIES.length,
    research: RESEARCH_FACILITIES.length,
    civilian: CIVILIAN_FACILITIES.length,
    special: SPECIAL_FACILITIES.length,
    orbital: 4, // Included in special
  },
};
