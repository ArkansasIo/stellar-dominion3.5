// Unit Configuration - Unit types, classes, ranks, jobs, and attributes

export interface UnitProgressionConfig {
  tiers: {
    max: number;
  };
  levels: {
    max: number;
  };
}

export const UNIT_CONFIG = {
  // Unit statuses
  unitStatus: {
    untrained: { level: 0, name: "Untrained", restrictions: "Can only perform basic tasks" },
    recruit: { level: 1, name: "Recruit", restrictions: "Limited combat capability" },
    trained: { level: 2, name: "Trained", restrictions: "Standard combat" },
    veteran: { level: 3, name: "Veteran", restrictions: "Enhanced combat" },
    elite: { level: 4, name: "Elite", restrictions: "Advanced combat" },
    legend: { level: 5, name: "Legend", restrictions: "Legendary warrior" },
  },

  // Unit types
  unitTypes: {
    civilian: {
      name: "Civilian",
      description: "Non-military personnel",
      roles: ["worker", "miner", "farmer", "builder", "trader"],
      sustainenceCost: { food: 2, water: 3 },
      productivity: 1.0,
    },
    military: {
      name: "Military",
      description: "Combat personnel",
      roles: ["soldier", "officer", "commander", "elite"],
      sustainenceCost: { food: 3, water: 4 },
      combat: 1.0,
    },
    specialist: {
      name: "Specialist",
      description: "Trained professional",
      roles: ["engineer", "scientist", "medic", "pilot"],
      sustainenceCost: { food: 2.5, water: 3.5 },
      skill: 1.0,
    },
  },

  // Unit classes
  unitClasses: {
    warrior: {
      name: "Warrior",
      stats: { strength: 18, constitution: 16, dexterity: 10, intelligence: 8, wisdom: 12, charisma: 10 },
      bonuses: { physicalDamage: 0.2, armor: 0.15 },
    },
    ranger: {
      name: "Ranger",
      stats: { dexterity: 18, wisdom: 14, strength: 12, constitution: 13, intelligence: 10, charisma: 8 },
      bonuses: { rangedDamage: 0.2, evasion: 0.15 },
    },
    mage: {
      name: "Mage",
      stats: { intelligence: 18, wisdom: 14, charisma: 12, dexterity: 10, constitution: 11, strength: 8 },
      bonuses: { spellPower: 0.25, manaRegen: 0.2 },
    },
    paladin: {
      name: "Paladin",
      stats: { strength: 16, constitution: 16, wisdom: 14, charisma: 13, dexterity: 10, intelligence: 9 },
      bonuses: { armor: 0.2, resistance: 0.15 },
    },
    rogue: {
      name: "Rogue",
      stats: { dexterity: 16, charisma: 14, intelligence: 12, strength: 11, constitution: 10, wisdom: 9 },
      bonuses: { critChance: 0.25, evasion: 0.2 },
    },
  },

  // Jobs/Professions
  jobs: {
    miner: {
      name: "Miner",
      type: "civilian",
      bonuses: { mining: 0.3, strength: 2 },
      equipment: ["pickaxe", "helmet"],
    },
    farmer: {
      name: "Farmer",
      type: "civilian",
      bonuses: { farming: 0.4, constitution: 2 },
      equipment: ["tools"],
    },
    builder: {
      name: "Builder",
      type: "civilian",
      bonuses: { construction: 0.35, strength: 3 },
      equipment: ["blueprints", "tools"],
    },
    trader: {
      name: "Trader",
      type: "civilian",
      bonuses: { trading: 0.3, charisma: 2 },
      equipment: ["ledger"],
    },
    soldier: {
      name: "Soldier",
      type: "military",
      bonuses: { combat: 0.2, strength: 3 },
      equipment: ["sword", "shield"],
    },
    officer: {
      name: "Officer",
      type: "military",
      bonuses: { leadership: 0.25, tactics: 0.2 },
      equipment: ["sword", "armor"],
    },
    engineer: {
      name: "Engineer",
      type: "specialist",
      bonuses: { engineering: 0.4, intelligence: 3 },
      equipment: ["blueprints", "tools"],
    },
    scientist: {
      name: "Scientist",
      type: "specialist",
      bonuses: { research: 0.35, intelligence: 4 },
      equipment: ["research_kit"],
    },
  },

  // Ranks and Titles
  ranks: {
    // Civilian ranks
    apprentice: { level: 1, title: "Apprentice", category: "civilian", salary: 10, permissions: ["basic_work"] },
    journeyman: { level: 2, title: "Journeyman", category: "civilian", salary: 25, permissions: ["standard_work"] },
    master: { level: 3, title: "Master", category: "civilian", salary: 50, permissions: ["advanced_work", "training"] },
    foreman: { level: 4, title: "Foreman", category: "civilian", salary: 100, permissions: ["advanced_work", "training", "supervision"] },
    
    // Military ranks
    recruit: { level: 1, title: "Recruit", category: "military", salary: 15, permissions: ["basic_combat"] },
    soldier: { level: 2, title: "Soldier", category: "military", salary: 30, permissions: ["combat", "formations"] },
    sergeant: { level: 3, title: "Sergeant", category: "military", salary: 60, permissions: ["combat", "formations", "squad_lead"] },
    officer: { level: 4, title: "Officer", category: "military", salary: 120, permissions: ["combat", "formations", "squad_lead", "strategy"] },
    commander: { level: 5, title: "Commander", category: "military", salary: 250, permissions: ["all_military"] },
    
    // Special ranks
    specialist: { level: 3, title: "Specialist", category: "specialist", salary: 80, permissions: ["specialization"] },
    expert: { level: 4, title: "Expert", category: "specialist", salary: 150, permissions: ["specialization", "mentoring"] },
  },

  // Attributes/Stats
  baseAttributes: {
    strength: { min: 1, max: 20, description: "Physical power and melee damage" },
    constitution: { min: 1, max: 20, description: "Health and endurance" },
    dexterity: { min: 1, max: 20, description: "Agility and ranged accuracy" },
    intelligence: { min: 1, max: 20, description: "Magical power and research" },
    wisdom: { min: 1, max: 20, description: "Perception and magic resistance" },
    charisma: { min: 1, max: 20, description: "Leadership and trading" },
  },

  // Derived stats
  derivedStats: {
    health: "constitution * 10",
    mana: "intelligence * 5 + wisdom * 3",
    armor: "constitution + equipment",
    magicResist: "wisdom * 2 + equipment",
    evasion: "dexterity + agility_bonuses",
    critChance: "dexterity * 0.5",
    damage: "strength + weapon_damage",
  },

  // Area-specific bonuses
  areaSpecificBonuses: {
    mountainous: {
      mining: 0.25,
      strength: 2,
      name: "Mountain Terrain",
      resources: ["metal", "crystal", "stone"],
    },
    forest: {
      farming: 0.3,
      foraging: 0.25,
      name: "Forest Terrain",
      resources: ["wood", "herbs", "food"],
    },
    desert: {
      water_efficiency: 0.4,
      heat_resistance: 1.2,
      name: "Desert Terrain",
      resources: ["sand", "minerals"],
    },
    ocean: {
      fishing: 0.35,
      water_navigation: 0.3,
      name: "Ocean Terrain",
      resources: ["fish", "salt"],
    },
    volcanic: {
      mining: 0.4,
      heat_resistance: 1.5,
      name: "Volcanic Terrain",
      resources: ["metal", "geothermal_energy"],
    },
  },

  // Class-specific bonuses
  classSpecificBonuses: {
    warrior: {
      physicalDamage: 0.2,
      armor: 0.15,
      healthPool: 1.25,
    },
    ranger: {
      rangedDamage: 0.2,
      evasion: 0.15,
      perception: 1.2,
    },
    mage: {
      spellPower: 0.25,
      manaRegen: 0.2,
      manaPool: 1.5,
    },
    paladin: {
      armor: 0.2,
      resistance: 0.15,
      healing: 1.2,
    },
    rogue: {
      critChance: 0.25,
      evasion: 0.2,
      stealth: 1.3,
    },
  },

  // Training system
  training: {
    basicTraining: { duration: 3600, level: 1, cost: { food: 5, water: 5 } },
    standardTraining: { duration: 7200, level: 2, cost: { food: 10, water: 10 } },
    advancedTraining: { duration: 14400, level: 3, cost: { food: 20, water: 20 } },
    masterTraining: { duration: 28800, level: 4, cost: { food: 40, water: 40 } },
    legendaryTraining: { duration: 57600, level: 5, cost: { food: 80, water: 80 } },
  },

  // Sustenance and food mechanics
  sustenance: {
    foodConsumptionPerHour: 0.5,
    waterConsumptionPerHour: 0.75,
    hungerEffects: {
      mild: { productivityPenalty: 0.1, after: 24 }, // hours
      moderate: { productivityPenalty: 0.25, after: 48 },
      severe: { productivityPenalty: 0.5, after: 72 },
      critical: { productivityPenalty: 1.0, after: 96 }, // Unit stops working
    },
  },
};
