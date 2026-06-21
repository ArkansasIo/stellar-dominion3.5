// Game Configuration - Balance, economy, and rules
export const GAME_CONFIG = {
  // Resource production rates (per second base rate)
  resources: {
    metalPerSecond: 0.1,
    crystalPerSecond: 0.05,
    deuteriumPerSecond: 0.02,
    energyPerSecond: 0.15,
  },

  // Building costs and production
  buildings: {
    metalMine: { metal: 60, crystal: 15, deuterium: 5, time: 30 },
    crystalMine: { metal: 48, crystal: 24, deuterium: 10, time: 30 },
    deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 30, time: 30 },
    solarPlant: { metal: 75, crystal: 30, deuterium: 0, time: 30 },
    roboticsFactory: { metal: 400, crystal: 120, deuterium: 200, time: 120 },
    shipyard: { metal: 400, crystal: 200, deuterium: 100, time: 120 },
    researchLab: { metal: 200, crystal: 400, deuterium: 200, time: 120 },
  },

  // Unit/Ship costs
  units: {
    lightFighter: { metal: 3000, crystal: 1000, deuterium: 400, time: 10 },
    heavyFighter: { metal: 6000, crystal: 4000, deuterium: 1000, time: 30 },
    cruiser: { metal: 20000, crystal: 7000, deuterium: 2000, time: 60 },
    battleship: { metal: 45000, crystal: 15000, deuterium: 4000, time: 120 },
    smallCargo: { metal: 2000, crystal: 2000, deuterium: 500, time: 15 },
    largeCargo: { metal: 6000, crystal: 6000, deuterium: 1000, time: 30 },
    colonyShip: { metal: 10000, crystal: 20000, deuterium: 1000, time: 45 },
  },

  // Technology costs and progression
  technology: {
    baseMetalCost: 200,
    baseCrystalCost: 100,
    baseDeuteriumCost: 50,
    costMultiplier: 1.75,
    researchTime: 3600, // seconds
  },

  // Combat mechanics
  combat: {
    shieldRegeneration: 0.1, // per turn
    evasionBase: 5, // base evasion %
    accuracyBase: 90, // base accuracy %
    damageVariance: 0.15, // ±15%
    maxCombatTurns: 20,
  },

  // Kardashev scale progression (18 levels)
  kardashev: {
    levels: 18,
    requirements: {
      metal: 1000000,
      crystal: 500000,
      deuterium: 250000,
      research: 100,
    },
  },

  // Empire difficulty levels
  empireDifficulty: {
    levels: [
      { id: 0, name: "Peaceful", multiplier: 0.5, resources: 1.5, research: 0.8, combat: 0.3 },
      { id: 1, name: "Easy", multiplier: 0.75, resources: 1.3, research: 0.9, combat: 0.5 },
      { id: 2, name: "Normal", multiplier: 1.0, resources: 1.0, research: 1.0, combat: 1.0 },
      { id: 3, name: "Hard", multiplier: 1.5, resources: 0.8, research: 1.1, combat: 1.5 },
      { id: 4, name: "Extreme", multiplier: 2.0, resources: 0.6, research: 1.3, combat: 2.0 },
      { id: 5, name: "Impossible", multiplier: 3.0, resources: 0.4, research: 1.5, combat: 3.0 },
    ],
    kardashevMultiplier: {
      level1to3: 1.0,
      level4to6: 1.5,
      level7to9: 2.0,
      level10to12: 2.5,
      level13to15: 3.0,
      level16to18: 4.0,
    },
  },

  // Economy / Market
  market: {
    minPrice: 0.001,
    maxPrice: 1000,
    transactionFee: 0.02, // 2% fee
    orderExpirationTime: 86400000, // 24 hours in ms
  },

  // Alliance settings
  alliance: {
    minMembers: 1,
    maxMembers: 50,
    creationCost: { metal: 100000, crystal: 50000, deuterium: 10000 },
    dipomaticLevelRequirement: 5,
  },

  // Mission/Fleet mechanics
  missions: {
    fleetSpeed: 1, // multiplier for base speed
    minMissionTime: 60000, // 1 minute in ms
    maxActiveMissions: 100,
  },

  // Colonies mechanics
  colonies: {
    maxColoniesPerPlayer: 1000, // Maximum colonies across entire galaxy per player
  },

  // Game speed settings
  gameSpeed: {
    economySpeed: 1,
    fleetSpeed: 1,
    researchSpeed: 1,
    buildingSpeed: 1,
  },

  // Session and gameplay
  gameplay: {
    sessionTimeout: 604800000, // 7 days in ms
    inactivityThreshold: 2592000000, // 30 days in ms
    maxPlayers: 10000,
    newPlayerStartingResources: {
      metal: 1000,
      crystal: 500,
      deuterium: 0,
      energy: 0,
    },
  },

  // Turn system - Players gain turns over time
  turns: {
    turnsPerMinute: 6,           // 6 turns gained per minute (1 every 10 seconds)
    maxCurrentTurns: 1000,       // Maximum turns that can be stored
    startingTurns: 50,           // New players start with 50 turns
    offlineAccrual: true,        // Turns accumulate while offline
    maxOfflineAccrualHours: 24,  // Maximum hours of offline turn accrual
  },
};

// Tier-based resource multipliers for different government types
export const GOVERNMENT_MULTIPLIERS = {
  democracy: { efficiency: 1.2, corruption: 0.5, stability: 1.0 },
  corporate: { efficiency: 1.4, corruption: 1.2, stability: 0.8 },
  military: { efficiency: 1.0, corruption: 0.8, stability: 0.9 },
  theocracy: { efficiency: 0.9, corruption: 0.6, stability: 1.1 },
  monarchy: { efficiency: 1.1, corruption: 1.0, stability: 1.0 },
};

// Race-specific bonuses
export const RACE_BONUSES = {
  terran: { production: 1.0, combat: 1.0, research: 1.0 },
  humanoid: { production: 0.95, combat: 1.05, research: 1.0 },
  silicon: { production: 1.1, combat: 0.9, research: 1.05 },
  energy: { production: 0.9, combat: 1.1, research: 1.0 },
  hybrid: { production: 1.0, combat: 1.0, research: 1.05 },
};

// Story Mode - 12 Acts with Characters and Lore
export const STORY_MODE = {
  acts: [
    {
      id: 1,
      title: "Genesis",
      prolog: "Your empire awakens in the void of space. Commander, you must establish your first colony.",
      chapters: [
        { id: 1, name: "First Light", description: "Build your initial settlement", difficulty: 1, xp: 100 },
        { id: 2, name: "First Resources", description: "Mine metal and crystal", difficulty: 1, xp: 150 },
        { id: 3, name: "First Fleet", description: "Construct your first ships", difficulty: 2, xp: 200 },
      ],
      npc: { name: "Admiral Vex", role: "Guide", trait: "Wise strategist" },
      rewards: { metal: 5000, crystal: 2500, xp: 500, badge: "Genesis" },
    },
    {
      id: 2,
      title: "Expansion",
      prolog: "Territory awaits. Expand your reach across the stars.",
      chapters: [
        { id: 1, name: "Second Colony", description: "Colonize a new world", difficulty: 2, xp: 250 },
        { id: 2, name: "Trade Routes", description: "Establish market connections", difficulty: 2, xp: 300 },
        { id: 3, name: "Diplomatic Mission", description: "Make first contact", difficulty: 3, xp: 400 },
      ],
      npc: { name: "Merchant Kess", role: "Trader", trait: "Shrewd negotiator" },
      rewards: { metal: 10000, crystal: 5000, deuterium: 1000, xp: 1000, badge: "Expansionist" },
    },
    {
      id: 3,
      title: "First Contact",
      prolog: "You are not alone. Discover who shares the galaxy.",
      chapters: [
        { id: 1, name: "Scout Mission", description: "Explore unknown systems", difficulty: 3, xp: 300 },
        { id: 2, name: "Ancient Signals", description: "Decipher alien transmissions", difficulty: 3, xp: 350 },
        { id: 3, name: "Treaty Negotiation", description: "Forge your first alliance", difficulty: 4, xp: 500 },
      ],
      npc: { name: "Linguist Zor", role: "Scholar", trait: "Knowledgeable diplomat" },
      rewards: { metal: 15000, crystal: 8000, deuterium: 3000, xp: 1500, badge: "First Contact" },
    },
    {
      id: 4,
      title: "Conflict Rises",
      prolog: "Not all seek peace. War clouds gather on the horizon.",
      chapters: [
        { id: 1, name: "Border Skirmish", description: "Defend your colony from pirates", difficulty: 4, xp: 400 },
        { id: 2, name: "Arms Race", description: "Upgrade military defenses", difficulty: 4, xp: 450 },
        { id: 3, name: "First Blood", description: "Engage in space combat", difficulty: 5, xp: 600 },
      ],
      npc: { name: "General Thorn", role: "Military Commander", trait: "Strategic warrior" },
      rewards: { metal: 20000, crystal: 10000, deuterium: 5000, xp: 2000, badge: "War Hero" },
    },
    {
      id: 5,
      title: "Ancient Awakening",
      prolog: "Deep within space, something ancient stirs. Your discovery will change everything.",
      chapters: [
        { id: 1, name: "Ruins Discovery", description: "Explore ancient megastructure", difficulty: 5, xp: 500 },
        { id: 2, name: "Decipher Tech", description: "Unlock ancient technology", difficulty: 5, xp: 550 },
        { id: 3, name: "Unleash Power", description: "Activate the ancient device", difficulty: 6, xp: 700 },
      ],
      npc: { name: "Archaeologist Mira", role: "Historian", trait: "Brilliant researcher" },
      rewards: { metal: 25000, crystal: 15000, deuterium: 8000, xp: 2500, badge: "Archaeologist" },
    },
    {
      id: 6,
      title: "Galactic Politics",
      prolog: "The galaxy's fate hangs in balance. Political alliances will determine power.",
      chapters: [
        { id: 1, name: "Council Meeting", description: "Attend galactic council", difficulty: 4, xp: 400 },
        { id: 2, name: "Espionage Mission", description: "Gather intelligence on rivals", difficulty: 5, xp: 500 },
        { id: 3, name: "Grand Alliance", description: "Unite against common threat", difficulty: 6, xp: 700 },
      ],
      npc: { name: "Ambassador Lyx", role: "Diplomat", trait: "Cunning strategist" },
      rewards: { metal: 30000, crystal: 20000, deuterium: 10000, xp: 3000, badge: "Diplomat" },
    },
    {
      id: 7,
      title: "Dark Forces",
      prolog: "An evil rises from the depths. Ancient darkness threatens all life.",
      chapters: [
        { id: 1, name: "Plague Spreads", description: "Investigate mysterious epidemic", difficulty: 6, xp: 600 },
        { id: 2, name: "Source Revealed", description: "Discover the enemy's origin", difficulty: 6, xp: 650 },
        { id: 3, name: "Final Stand", description: "Battle the dark entity", difficulty: 7, xp: 900 },
      ],
      npc: { name: "Mystic Shadowblade", role: "Dark Knight", trait: "Tormented soul seeking redemption" },
      rewards: { metal: 40000, crystal: 25000, deuterium: 15000, xp: 4000, badge: "Savior" },
    },
    {
      id: 8,
      title: "Dimensional Rift",
      prolog: "Reality itself begins to fracture. You must seal the rift between worlds.",
      chapters: [
        { id: 1, name: "Anomaly Detection", description: "Detect dimensional instability", difficulty: 6, xp: 600 },
        { id: 2, name: "Research Rift", description: "Study the dimensional tear", difficulty: 7, xp: 700 },
        { id: 3, name: "Close the Portal", description: "Seal the rift permanently", difficulty: 8, xp: 1000 },
      ],
      npc: { name: "Physicist Dr. Kern", role: "Scientist", trait: "Brilliant but obsessed" },
      rewards: { metal: 50000, crystal: 30000, deuterium: 20000, xp: 5000, badge: "Dimensional Master" },
    },
    {
      id: 9,
      title: "Corporate Conspiracy",
      prolog: "Mega-corporations manipulate the galaxy from shadows. Expose their conspiracy.",
      chapters: [
        { id: 1, name: "Corporate Espionage", description: "Infiltrate corporate servers", difficulty: 7, xp: 700 },
        { id: 2, name: "Evidence Gathering", description: "Collect proof of corruption", difficulty: 7, xp: 750 },
        { id: 3, name: "Expose Truth", description: "Broadcast the conspiracy", difficulty: 7, xp: 800 },
      ],
      npc: { name: "CEO Valens", role: "Corrupt Businessman", trait: "Ruthless and cunning" },
      rewards: { metal: 60000, crystal: 35000, deuterium: 25000, xp: 6000, badge: "Whistleblower" },
    },
    {
      id: 10,
      title: "The Kardashev Challenge",
      prolog: "Ascend to god-like power. Construct a megastructure and harness star energy.",
      chapters: [
        { id: 1, name: "Blueprint Creation", description: "Design the Dyson Sphere", difficulty: 8, xp: 900 },
        { id: 2, name: "Resource Gathering", description: "Collect materials across galaxy", difficulty: 8, xp: 950 },
        { id: 3, name: "Construction Begins", description: "Start building the sphere", difficulty: 8, xp: 1000 },
      ],
      npc: { name: "Architect Prime", role: "Master Engineer", trait: "Visionary builder" },
      rewards: { metal: 100000, crystal: 50000, deuterium: 50000, xp: 8000, badge: "Kardashev II" },
    },
    {
      id: 11,
      title: "The Ascendant Path",
      prolog: "Few reach this height. Transcend mortal limitations and reshape reality itself.",
      chapters: [
        { id: 1, name: "Ascension Research", description: "Study transcendence theory", difficulty: 9, xp: 1000 },
        { id: 2, name: "Cosmic Convergence", description: "Align with cosmic forces", difficulty: 9, xp: 1100 },
        { id: 3, name: "Become Divine", description: "Achieve godhood", difficulty: 10, xp: 1500 },
      ],
      npc: { name: "The Oracle", role: "Cosmic Entity", trait: "All-knowing and timeless" },
      rewards: { metal: 150000, crystal: 100000, deuterium: 100000, xp: 10000, badge: "Divine" },
    },
    {
      id: 12,
      title: "Eternity's End",
      prolog: "You stand at the end of time itself. The fate of all existence rests in your hands.",
      chapters: [
        { id: 1, name: "Reality Collapse", description: "Prevent universal entropy", difficulty: 10, xp: 1200 },
        { id: 2, name: "Recreate Cosmos", description: "Rebuild the universe", difficulty: 10, xp: 1300 },
        { id: 3, name: "Eternal Reign", description: "Rule over all existence", difficulty: 10, xp: 2000 },
      ],
      npc: { name: "The Architect", role: "Creator", trait: "The ultimate being" },
      rewards: { metal: 200000, crystal: 150000, deuterium: 150000, xp: 15000, badge: "Eternal Ruler" },
    },
  ],
  
  elements: {
    fire: { damageBoost: 1.3, defenseReduction: 0.8, weakTo: "water" },
    water: { damageBoost: 1.2, defenseBoost: 1.1, weakTo: "lightning" },
    lightning: { damageBoost: 1.4, speedBoost: 1.25, weakTo: "earth" },
    earth: { damageBoost: 1.0, defenseBoost: 1.3, weakTo: "fire" },
    ice: { speedReduction: 0.7, damageBoost: 1.15, weakTo: "fire" },
    shadow: { stealth: 1.5, damageBoost: 1.25, weakTo: "light" },
    light: { defenseBoost: 1.4, healingBoost: 1.5, weakTo: "shadow" },
  },
};

// NPC Factions - 12 major galactic factions
export const NPC_FACTIONS = [
  {
    id: "terran_empire",
    name: "Terran Empire",
    description: "Ancient human civilization. Balanced in all aspects.",
    leader: "Emperor Hadrian",
    homeworld: "Terra Prime",
    bonus: { production: 1.1, combat: 1.0, diplomacy: 1.05 },
  },
  {
    id: "zyx_collective",
    name: "Zyx Collective",
    description: "Silicon-based hive mind. Masters of technology.",
    leader: "The Nexus",
    homeworld: "Zyx-9",
    bonus: { production: 1.2, research: 1.3, combat: 0.9 },
  },
  {
    id: "void_corsairs",
    name: "Void Corsairs",
    description: "Ruthless space pirates and mercenaries.",
    leader: "Captain Blackmaw",
    homeworld: "Rogue Station Epsilon",
    bonus: { combat: 1.4, stealth: 1.3, trading: 0.8 },
  },
  {
    id: "merchant_guilds",
    name: "Merchant Guilds",
    description: "Economic powerhouses controlling trade routes.",
    leader: "Trade Master Voss",
    homeworld: "Commerce Hub Nexus",
    bonus: { trading: 1.5, resources: 1.2, diplomacy: 1.1 },
  },
  {
    id: "ancient_order",
    name: "Ancient Order",
    description: "Mystic keepers of forbidden knowledge.",
    leader: "High Priestess Kael",
    homeworld: "The Hidden Sanctum",
    bonus: { research: 1.2, mysticism: 1.4, combat: 1.05 },
  },
  {
    id: "shadow_syndicate",
    name: "Shadow Syndicate",
    description: "Espionage and black market operations.",
    leader: "The Phantom",
    homeworld: "Unknown",
    bonus: { espionage: 1.5, stealth: 1.4, combat: 1.1 },
  },
  {
    id: "precursor_cult",
    name: "Precursor Cult",
    description: "Worshippers of ancient alien civilizations.",
    leader: "Oracle Sentinel",
    homeworld: "The Precursor Vault",
    bonus: { artifacts: 1.3, research: 1.15, mysticism: 1.2 },
  },
  {
    id: "iron_dominion",
    name: "Iron Dominion",
    description: "Military empire focused on conquest.",
    leader: "War General Kronus",
    homeworld: "Fortress World Khorne",
    bonus: { combat: 1.5, production: 1.1, diplomacy: 0.7 },
  },
  {
    id: "free_alliance",
    name: "Free Alliance",
    description: "Democratic coalition of independent worlds.",
    leader: "President Charter",
    homeworld: "Liberty Station",
    bonus: { diplomacy: 1.4, research: 1.05, production: 1.1 },
  },
  {
    id: "star_forgers",
    name: "Star Forgers",
    description: "Master craftsmen and megastructure builders.",
    leader: "Architect Construct-7",
    homeworld: "Construction Sphere 1",
    bonus: { megastructures: 1.4, production: 1.2, research: 1.15 },
  },
  {
    id: "xenobiology_institute",
    name: "Xenobiology Institute",
    description: "Scientists studying alien life and mutations.",
    leader: "Dr. Synthesis Prime",
    homeworld: "Research Station Genesis",
    bonus: { research: 1.3, mutations: 1.3, diplomacy: 0.9 },
  },
  {
    id: "eternal_watchers",
    name: "Eternal Watchers",
    description: "Ancient guardians of galactic balance.",
    leader: "First Guardian",
    homeworld: "The Eternal Observatory",
    bonus: { wisdom: 1.3, diplomacy: 1.2, combat: 1.15 },
  },
];

// NPC Vendors - Selling unique items
export const NPC_VENDORS = [
  {
    id: "trader_zek",
    name: "Trader Zek",
    faction: "merchant_guilds",
    location: "Commerce Hub Nexus",
    specialty: "Rare artifacts and relics",
    reputation_required: 100,
    inventory: ["relic_ancient_compass", "relic_star_map", "relic_void_stone"],
  },
  {
    id: "blacksmith_thorne",
    name: "Blacksmith Thorne",
    faction: "star_forgers",
    location: "Construction Sphere 1",
    specialty: "Megastructure blueprints",
    reputation_required: 150,
    inventory: ["blueprint_dyson_sphere", "blueprint_ringworld", "blueprint_matrioshka"],
  },
  {
    id: "archivist_vel",
    name: "Archivist Vel",
    faction: "ancient_order",
    location: "The Hidden Sanctum",
    specialty: "Ancient knowledge",
    reputation_required: 200,
    inventory: ["relic_tome_infinity", "relic_grimoire_dark", "relic_codex_light"],
  },
  {
    id: "spymaster_shadowfox",
    name: "Spymaster Shadowfox",
    faction: "shadow_syndicate",
    location: "Unknown",
    specialty: "Espionage equipment",
    reputation_required: 180,
    inventory: ["tech_stealth_cloak", "tech_tracking_device", "tech_hacking_suite"],
  },
  {
    id: "weapons_master_kron",
    name: "Weapons Master Kron",
    faction: "iron_dominion",
    location: "Fortress World Khorne",
    specialty: "Military hardware",
    reputation_required: 120,
    inventory: ["weapon_plasma_cannon", "weapon_ion_disruptor", "weapon_antimatter_launcher"],
  },
  {
    id: "captain_blackmaw_store",
    name: "Captain Blackmaw's Store",
    faction: "void_corsairs",
    location: "Rogue Station Epsilon",
    specialty: "Stolen goods and contraband",
    reputation_required: 50,
    inventory: ["contraband_illegal_tech", "stolen_artifact", "black_market_weapon"],
  },
];

// Relics - Powerful artifacts with unique abilities
export const RELICS = [
  {
    id: "relic_ancient_compass",
    name: "Ancient Compass",
    rarity: "legendary",
    description: "Legendary navigation tool. Never get lost in the galaxy.",
    type: "navigation",
    bonuses: { exploration: 1.5, discovery_rate: 2.0 },
    source: "merchant_guilds",
    price: 50000,
  },
  {
    id: "relic_star_map",
    name: "Star Map",
    rarity: "epic",
    description: "Reveals hidden star systems and secret passages.",
    type: "knowledge",
    bonuses: { visibility: 1.8, secrets_revealed: 1.5 },
    source: "merchant_guilds",
    price: 35000,
  },
  {
    id: "relic_void_stone",
    name: "Void Stone",
    rarity: "mythic",
    description: "Harnesses the power of the void itself.",
    type: "power",
    bonuses: { damage: 2.0, shadow_magic: 1.5 },
    source: "ancient_order",
    price: 100000,
  },
  {
    id: "relic_tome_infinity",
    name: "Tome of Infinity",
    rarity: "mythic",
    description: "Contains all knowledge of the universe.",
    type: "knowledge",
    bonuses: { research: 2.0, intelligence: 1.8 },
    source: "ancient_order",
    price: 120000,
  },
  {
    id: "relic_grimoire_dark",
    name: "Grimoire of Darkness",
    rarity: "legendary",
    description: "Master dark arts and forbidden spells.",
    type: "magic",
    bonuses: { dark_magic: 2.0, mysticism: 1.5 },
    source: "ancient_order",
    price: 80000,
  },
  {
    id: "relic_codex_light",
    name: "Codex of Light",
    rarity: "legendary",
    description: "Channel pure light energy for healing and protection.",
    type: "magic",
    bonuses: { light_magic: 2.0, healing: 1.8 },
    source: "free_alliance",
    price: 80000,
  },
  {
    id: "blueprint_dyson_sphere",
    name: "Dyson Sphere Blueprint",
    rarity: "mythic",
    description: "Complete plans for a Dyson Sphere megastructure.",
    type: "blueprint",
    bonuses: { energy_production: 10.0 },
    source: "star_forgers",
    price: 250000,
  },
  {
    id: "blueprint_ringworld",
    name: "Ringworld Blueprint",
    rarity: "mythic",
    description: "Plans for a massive ring-shaped habitable megastructure.",
    type: "blueprint",
    bonuses: { habitable_area: 50.0 },
    source: "star_forgers",
    price: 280000,
  },
  {
    id: "blueprint_matrioshka",
    name: "Matrioshka Brain Blueprint",
    rarity: "mythic",
    description: "Concentric spheres of computing power around a star.",
    type: "blueprint",
    bonuses: { computing_power: 100.0, research: 3.0 },
    source: "star_forgers",
    price: 300000,
  },
  {
    id: "weapon_plasma_cannon",
    name: "Plasma Cannon",
    rarity: "epic",
    description: "Devastating plasma weapon.",
    type: "weapon",
    bonuses: { damage: 3.0, fire_rate: 1.5 },
    source: "iron_dominion",
    price: 45000,
  },
  {
    id: "weapon_ion_disruptor",
    name: "Ion Disruptor",
    rarity: "legendary",
    description: "Disrupts shields and armor.",
    type: "weapon",
    bonuses: { shield_piercing: 2.0, armor_penetration: 1.8 },
    source: "iron_dominion",
    price: 65000,
  },
  {
    id: "weapon_antimatter_launcher",
    name: "Antimatter Launcher",
    rarity: "mythic",
    description: "Annihilates matter at atomic level.",
    type: "weapon",
    bonuses: { damage: 5.0, area_of_effect: 3.0 },
    source: "iron_dominion",
    price: 150000,
  },
  {
    id: "tech_stealth_cloak",
    name: "Stealth Cloak",
    rarity: "epic",
    description: "Become invisible to sensors.",
    type: "technology",
    bonuses: { stealth: 2.5, detection_avoidance: 2.0 },
    source: "shadow_syndicate",
    price: 40000,
  },
  {
    id: "tech_tracking_device",
    name: "Tracking Device",
    rarity: "rare",
    description: "Track any target across the galaxy.",
    type: "technology",
    bonuses: { tracking_accuracy: 3.0 },
    source: "shadow_syndicate",
    price: 25000,
  },
  {
    id: "tech_hacking_suite",
    name: "Hacking Suite",
    rarity: "epic",
    description: "Breach any security system.",
    type: "technology",
    bonuses: { hacking: 3.0, security_bypass: 2.0 },
    source: "shadow_syndicate",
    price: 50000,
  },
];

// Tier System (1-21 tiers) - for players, buildings, units, etc
export const TIER_CONFIG = {
  maxTier: 21,
  tiers: [
    { tier: 1, name: "Novice", resourceMultiplier: 1.0, experienceMultiplier: 1.0, researchMultiplier: 1.0, expRequirement: 1000 },
    { tier: 2, name: "Apprentice", resourceMultiplier: 1.1, experienceMultiplier: 1.05, researchMultiplier: 1.05, expRequirement: 2500 },
    { tier: 3, name: "Journeyman", resourceMultiplier: 1.2, experienceMultiplier: 1.1, researchMultiplier: 1.1, expRequirement: 5000 },
    { tier: 4, name: "Adept", resourceMultiplier: 1.3, experienceMultiplier: 1.15, researchMultiplier: 1.15, expRequirement: 10000 },
    { tier: 5, name: "Expert", resourceMultiplier: 1.5, experienceMultiplier: 1.2, researchMultiplier: 1.2, expRequirement: 20000 },
    { tier: 6, name: "Master", resourceMultiplier: 1.7, experienceMultiplier: 1.25, researchMultiplier: 1.25, expRequirement: 35000 },
    { tier: 7, name: "Virtuoso", resourceMultiplier: 1.9, experienceMultiplier: 1.3, researchMultiplier: 1.3, expRequirement: 50000 },
    { tier: 8, name: "Champion", resourceMultiplier: 2.1, experienceMultiplier: 1.35, researchMultiplier: 1.35, expRequirement: 75000 },
    { tier: 9, name: "Legend", resourceMultiplier: 2.4, experienceMultiplier: 1.4, researchMultiplier: 1.4, expRequirement: 100000 },
    { tier: 10, name: "Mythic", resourceMultiplier: 2.7, experienceMultiplier: 1.5, researchMultiplier: 1.5, expRequirement: 150000 },
    { tier: 11, name: "Transcendent", resourceMultiplier: 3.0, experienceMultiplier: 1.6, researchMultiplier: 1.6, expRequirement: 200000 },
    { tier: 12, name: "Immortal", resourceMultiplier: 3.5, experienceMultiplier: 1.7, researchMultiplier: 1.7, expRequirement: 300000 },
    { tier: 13, name: "Ascendant", resourceMultiplier: 4.0, experienceMultiplier: 1.8, researchMultiplier: 1.8, expRequirement: 400000 },
    { tier: 14, name: "Celestial", resourceMultiplier: 4.5, experienceMultiplier: 1.9, researchMultiplier: 1.9, expRequirement: 500000 },
    { tier: 15, name: "Divine", resourceMultiplier: 5.0, experienceMultiplier: 2.0, researchMultiplier: 2.0, expRequirement: 750000 },
    { tier: 16, name: "Titan", resourceMultiplier: 5.5, experienceMultiplier: 2.1, researchMultiplier: 2.1, expRequirement: 1000000 },
    { tier: 17, name: "Eternal", resourceMultiplier: 6.0, experienceMultiplier: 2.2, researchMultiplier: 2.2, expRequirement: 1500000 },
    { tier: 18, name: "Omniscient", resourceMultiplier: 6.5, experienceMultiplier: 2.3, researchMultiplier: 2.3, expRequirement: 2000000 },
    { tier: 19, name: "Almighty", resourceMultiplier: 7.0, experienceMultiplier: 2.4, researchMultiplier: 2.4, expRequirement: 3000000 },
    { tier: 20, name: "Supreme", resourceMultiplier: 8.0, experienceMultiplier: 2.5, researchMultiplier: 2.5, expRequirement: 5000000 },
    { tier: 21, name: "Absolute", resourceMultiplier: 10.0, experienceMultiplier: 3.0, researchMultiplier: 3.0, expRequirement: 10000000 },
  ],
};

// Empire Level System (1-999)
export const EMPIRE_LEVEL_CONFIG = {
  maxLevel: 999,
  baseExpRequirement: 1000,
  expMultiplier: 1.1,
  levelMilestones: {
    10: { name: "Rising Power", bonusMultiplier: 1.1 },
    25: { name: "Growing Influence", bonusMultiplier: 1.25 },
    50: { name: "Established Empire", bonusMultiplier: 1.5 },
    100: { name: "Galactic Force", bonusMultiplier: 2.0 },
    250: { name: "Legendary Empire", bonusMultiplier: 3.0 },
    500: { name: "Ancient Sovereign", bonusMultiplier: 5.0 },
    999: { name: "Infinite Dominion", bonusMultiplier: 10.0 },
  },
};
