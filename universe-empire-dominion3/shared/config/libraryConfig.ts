// Library System - Knowledge types, classes, and research/tech trees (1-100 levels, 1-21 tiers)
export const LIBRARY_CONFIG = {
  // Knowledge categories/types
  knowledgeTypes: {
    military: { name: "Military Science", description: "Combat and warfare knowledge" },
    engineering: { name: "Engineering", description: "Construction and mechanics" },
    science: { name: "Science", description: "Scientific research and discovery" },
    agriculture: { name: "Agriculture", description: "Farming and food production" },
    commerce: { name: "Commerce", description: "Trading and economics" },
    diplomacy: { name: "Diplomacy", description: "Politics and relations" },
    exploration: { name: "Exploration", description: "Discovery and mapping" },
    magic: { name: "Arcane Studies", description: "Magical knowledge and spells" },
    medicine: { name: "Medicine", description: "Healing and disease treatment" },
    espionage: { name: "Espionage", description: "Spying and intelligence" },
  },

  // Knowledge classes (subdivisions within types)
  knowledgeClasses: {
    military: {
      tactics: { name: "Tactics", type: "military", bonuses: { combatDamage: 0.01 } },
      strategy: { name: "Strategy", type: "military", bonuses: { strategicAdvantage: 0.01 } },
      logistics: { name: "Logistics", type: "military", bonuses: { fleetSpeed: 0.01 } },
      weaponry: { name: "Weaponry", type: "military", bonuses: { weaponDamage: 0.01 } },
    },
    engineering: {
      construction: { name: "Construction", type: "engineering", bonuses: { buildTime: -0.01 } },
      machinery: { name: "Machinery", type: "engineering", bonuses: { productivity: 0.01 } },
      robotics: { name: "Robotics", type: "engineering", bonuses: { automation: 0.01 } },
      infrastructure: { name: "Infrastructure", type: "engineering", bonuses: { efficiency: 0.01 } },
    },
    science: {
      physics: { name: "Physics", type: "science", bonuses: { techSpeed: 0.01 } },
      chemistry: { name: "Chemistry", type: "science", bonuses: { resourceYield: 0.01 } },
      biology: { name: "Biology", type: "science", bonuses: { unitHealth: 0.01 } },
      quantum: { name: "Quantum Mechanics", type: "science", bonuses: { advancedTech: 0.01 } },
    },
    agriculture: {
      farming: { name: "Farming", type: "agriculture", bonuses: { foodProduction: 0.02 } },
      irrigation: { name: "Irrigation", type: "agriculture", bonuses: { waterEfficiency: 0.02 } },
      breeding: { name: "Breeding", type: "agriculture", bonuses: { unitStats: 0.01 } },
      preservation: { name: "Preservation", type: "agriculture", bonuses: { foodStorage: 0.02 } },
    },
    commerce: {
      trading: { name: "Trading", type: "commerce", bonuses: { tradeProfit: 0.02 } },
      economics: { name: "Economics", type: "commerce", bonuses: { marketValue: 0.02 } },
      banking: { name: "Banking", type: "commerce", bonuses: { resourceGeneration: 0.01 } },
      negotiation: { name: "Negotiation", type: "commerce", bonuses: { dealValue: 0.02 } },
    },
    diplomacy: {
      politics: { name: "Politics", type: "diplomacy", bonuses: { allianceBonus: 0.02 } },
      treaties: { name: "Treaties", type: "diplomacy", bonuses: { relationBonus: 0.02 } },
      leadership: { name: "Leadership", type: "diplomacy", bonuses: { unitLoyalty: 0.02 } },
      propaganda: { name: "Propaganda", type: "diplomacy", bonuses: { persuasion: 0.02 } },
    },
    exploration: {
      mapping: { name: "Mapping", type: "exploration", bonuses: { discoveryRate: 0.02 } },
      navigation: { name: "Navigation", type: "exploration", bonuses: { fleetSpeed: 0.02 } },
      archaeology: { name: "Archaeology", type: "exploration", bonuses: { artifactFind: 0.01 } },
      astronomy: { name: "Astronomy", type: "exploration", bonuses: { starMapping: 0.02 } },
    },
    magic: {
      elementalism: { name: "Elementalism", type: "magic", bonuses: { elementalDamage: 0.02 } },
      transmutation: { name: "Transmutation", type: "magic", bonuses: { resourceConversion: 0.02 } },
      conjuration: { name: "Conjuration", type: "magic", bonuses: { unitSummon: 0.01 } },
      divination: { name: "Divination", type: "magic", bonuses: { intelligence: 0.02 } },
    },
    medicine: {
      surgery: { name: "Surgery", type: "medicine", bonuses: { healingPower: 0.02 } },
      pharmacology: { name: "Pharmacology", type: "medicine", bonuses: { buffDuration: 0.02 } },
      diseases: { name: "Disease Control", type: "medicine", bonuses: { diseaseResist: 0.02 } },
      longevity: { name: "Longevity", type: "medicine", bonuses: { unitLifespan: 0.02 } },
    },
    espionage: {
      gathering: { name: "Intelligence Gathering", type: "espionage", bonuses: { infoAccuracy: 0.02 } },
      sabotage: { name: "Sabotage", type: "espionage", bonuses: { sabotageEffectiveness: 0.02 } },
      stealth: { name: "Stealth", type: "espionage", bonuses: { detectionEvade: 0.02 } },
      cryptography: { name: "Cryptography", type: "espionage", bonuses: { messageSecrecy: 0.02 } },
    },
  },

  // 21 tiers with 100 levels each
  tiers: {
    tier1: { tier: 1, name: "Foundation", minLevel: 1, maxLevel: 5, costMultiplier: 1.0 },
    tier2: { tier: 2, name: "Novice", minLevel: 6, maxLevel: 10, costMultiplier: 1.1 },
    tier3: { tier: 3, name: "Apprentice", minLevel: 11, maxLevel: 15, costMultiplier: 1.2 },
    tier4: { tier: 4, name: "Adept", minLevel: 16, maxLevel: 20, costMultiplier: 1.35 },
    tier5: { tier: 5, name: "Practitioner", minLevel: 21, maxLevel: 25, costMultiplier: 1.5 },
    tier6: { tier: 6, name: "Specialist", minLevel: 26, maxLevel: 30, costMultiplier: 1.7 },
    tier7: { tier: 7, name: "Expert", minLevel: 31, maxLevel: 35, costMultiplier: 1.9 },
    tier8: { tier: 8, name: "Master", minLevel: 36, maxLevel: 40, costMultiplier: 2.1 },
    tier9: { tier: 9, name: "Grandmaster", minLevel: 41, maxLevel: 45, costMultiplier: 2.4 },
    tier10: { tier: 10, name: "Legendary", minLevel: 46, maxLevel: 50, costMultiplier: 2.7 },
    tier11: { tier: 11, name: "Mythic", minLevel: 51, maxLevel: 55, costMultiplier: 3.0 },
    tier12: { tier: 12, name: "Ascendant", minLevel: 56, maxLevel: 60, costMultiplier: 3.3 },
    tier13: { tier: 13, name: "Transcendent", minLevel: 61, maxLevel: 65, costMultiplier: 3.7 },
    tier14: { tier: 14, name: "Celestial", minLevel: 66, maxLevel: 70, costMultiplier: 4.1 },
    tier15: { tier: 15, name: "Eternal", minLevel: 71, maxLevel: 75, costMultiplier: 4.5 },
    tier16: { tier: 16, name: "Infinite", minLevel: 76, maxLevel: 80, costMultiplier: 5.0 },
    tier17: { tier: 17, name: "Godlike", minLevel: 81, maxLevel: 85, costMultiplier: 5.5 },
    tier18: { tier: 18, name: "Omniscient", minLevel: 86, maxLevel: 90, costMultiplier: 6.1 },
    tier19: { tier: 19, name: "Primordial", minLevel: 91, maxLevel: 95, costMultiplier: 6.7 },
    tier20: { tier: 20, name: "Absolute", minLevel: 96, maxLevel: 99, costMultiplier: 7.5 },
    tier21: { tier: 21, name: "Supreme", minLevel: 100, maxLevel: 100, costMultiplier: 10.0 },
  },

  // Base costs per level (multiplied by tier cost multiplier)
  baseLevelCosts: {
    metal: 50,
    crystal: 30,
    time: 300, // seconds
  },

  // Experience/knowledge points system
  knowledgePoints: {
    basePointsPerSecond: 0.5,
    scholarMultiplier: 1.5,
    libraryMultiplier: 2.0,
    teacherMultiplier: 1.3,
  },

  // Synergies between knowledge types
  synergies: {
    militaryEngineering: { types: ["military", "engineering"], bonus: 0.15 },
    scienceEngineering: { types: ["science", "engineering"], bonus: 0.2 },
    farmingAgriculture: { types: ["commerce", "agriculture"], bonus: 0.25 },
    diplomacyCommerce: { types: ["diplomacy", "commerce"], bonus: 0.15 },
    explorationAstronomy: { types: ["exploration", "science"], bonus: 0.18 },
    magicScience: { types: ["magic", "science"], bonus: 0.2 },
    medicineScience: { types: ["medicine", "science"], bonus: 0.22 },
    espionageDiplomacy: { types: ["espionage", "diplomacy"], bonus: 0.17 },
  },

  // Unlocks at specific levels
  levelUnlocks: {
    10: ["basic_research"],
    20: ["advanced_research"],
    30: ["specialized_training"],
    40: ["master_techniques"],
    50: ["legendary_knowledge"],
    60: ["transcendent_wisdom"],
    70: ["celestial_understanding"],
    80: ["godlike_mastery"],
    90: ["omniscient_awareness"],
    100: ["supreme_knowledge"],
  },
};
