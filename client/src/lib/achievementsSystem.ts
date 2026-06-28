export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "exploration" | "combat" | "economics" | "technology" | "diplomacy" | "milestones";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: number;
  progress: number;
  completed: boolean;
  completedDate?: number;
  rewards: {
    xp: number;
    prestige: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "exploration" | "combat" | "gathering" | "research" | "story";
  objectives: {
    id: string;
    title: string;
    target: number;
    current: number;
    completed: boolean;
  }[];
  rewards: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    xp: number;
    technology?: string;
  };
  active: boolean;
  completed: boolean;
  difficulty: "easy" | "normal" | "hard" | "expert";
}

export const ACHIEVEMENTS: Achievement[] = [
  // ═══════════════════════════════════════════════════════════════
  // EXPLORATION ACHIEVEMENTS (30)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "first_flight",
    title: "Space Traveler",
    description: "Travel to another star system",
    category: "exploration",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "sector_scout",
    title: "Sector Scout",
    description: "Explore 5 different sectors",
    category: "exploration",
    rarity: "common",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 750, prestige: 75 }
  },
  {
    id: "sector_cartographer",
    title: "Sector Cartographer",
    description: "Explore 15 different sectors",
    category: "exploration",
    rarity: "uncommon",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 1500, prestige: 150 }
  },
  {
    id: "galaxy_mapper",
    title: "Galaxy Mapper",
    description: "Explore 50 different sectors",
    category: "exploration",
    rarity: "rare",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "void_walker",
    title: "Void Walker",
    description: "Explore 100 different sectors",
    category: "exploration",
    rarity: "epic",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "cosmic_voyager",
    title: "Cosmic Voyager",
    description: "Explore 250 different sectors",
    category: "exploration",
    rarity: "legendary",
    requirement: 250,
    progress: 0,
    completed: false,
    rewards: { xp: 15000, prestige: 1500 }
  },
  {
    id: "anomaly_discoverer",
    title: "Anomaly Hunter",
    description: "Discover 5 space anomalies",
    category: "exploration",
    rarity: "rare",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 3000, prestige: 300 }
  },
  {
    id: "anomaly_master",
    title: "Anomaly Master",
    description: "Discover 25 space anomalies",
    category: "exploration",
    rarity: "epic",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "warp_master",
    title: "Warp Network Controller",
    description: "Own 5 warp gates",
    category: "exploration",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "warp_overlord",
    title: "Warp Overlord",
    description: "Own 20 warp gates",
    category: "exploration",
    rarity: "legendary",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "first_colony",
    title: "First Colony",
    description: "Establish your first colony",
    category: "exploration",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 1000, prestige: 100 }
  },
  {
    id: "colony_builder",
    title: "Colony Builder",
    description: "Establish 5 colonies",
    category: "exploration",
    rarity: "uncommon",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "empire_spreader",
    title: "Empire Spreader",
    description: "Establish 15 colonies",
    category: "exploration",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "galactic_dominion",
    title: "Galactic Dominion",
    description: "Establish 50 colonies",
    category: "exploration",
    rarity: "legendary",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 25000, prestige: 2500 }
  },
  {
    id: "wormhole_explorer",
    title: "Wormhole Explorer",
    description: "Travel through 10 wormholes",
    category: "exploration",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "deep_space_pioneer",
    title: "Deep Space Pioneer",
    description: "Travel beyond 1000 light-years from origin",
    category: "exploration",
    rarity: "rare",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 3500, prestige: 350 }
  },
  {
    id: "nebula_scout",
    title: "Nebula Scout",
    description: "Discover 10 nebulae",
    category: "exploration",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "black_hole_researcher",
    title: "Black Hole Researcher",
    description: "Study 5 black holes",
    category: "exploration",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 7000, prestige: 700 }
  },
  {
    id: "asteroid_miner",
    title: "Asteroid Miner",
    description: "Mine 50 asteroids",
    category: "exploration",
    rarity: "uncommon",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 1800, prestige: 180 }
  },
  {
    id: "planetary_surveyor",
    title: "Planetary Surveyor",
    description: "Survey 20 planets",
    category: "exploration",
    rarity: "uncommon",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 2200, prestige: 220 }
  },
  {
    id: "moon_collector",
    title: "Moon Collector",
    description: "Colonize 10 moons",
    category: "exploration",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "star_gazer",
    title: "Star Gazer",
    description: "Observe 100 stars through your observatory",
    category: "exploration",
    rarity: "uncommon",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 1500, prestige: 150 }
  },
  {
    id: "dimensional_rift",
    title: "Dimensional Rift Walker",
    description: "Enter 3 dimensional rifts",
    category: "exploration",
    rarity: "legendary",
    requirement: 3,
    progress: 0,
    completed: false,
    rewards: { xp: 12000, prestige: 1200 }
  },
  {
    id: "signal_hunter",
    title: "Signal Hunter",
    description: "Intercept 25 alien signals",
    category: "exploration",
    rarity: "rare",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 3500, prestige: 350 }
  },
  {
    id: "ruin_excavator",
    title: "Ruin Excavator",
    description: "Excavate 15 ancient ruins",
    category: "exploration",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "asteroid_field_navigator",
    title: "Asteroid Field Navigator",
    description: "Safely navigate 30 asteroid fields",
    category: "exploration",
    rarity: "uncommon",
    requirement: 30,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "comet_chaser",
    title: "Comet Chaser",
    description: "Track and study 20 comets",
    category: "exploration",
    rarity: "common",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 1000, prestige: 100 }
  },
  {
    id: "binary_system_scout",
    title: "Binary System Scout",
    description: "Explore 10 binary star systems",
    category: "exploration",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "event_horizon",
    title: "Event Horizon Observer",
    description: "Come within 1 AU of a black hole 5 times",
    category: "exploration",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "uncharted_frontier",
    title: "Uncharted Frontier",
    description: "Discover 10 sectors no one has visited before",
    category: "exploration",
    rarity: "legendary",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 18000, prestige: 1800 }
  },

  // ═══════════════════════════════════════════════════════════════
  // COMBAT ACHIEVEMENTS (30)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "first_blood",
    title: "First Blood",
    description: "Win your first combat battle",
    category: "combat",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "battle_master",
    title: "Battle Hardened",
    description: "Win 10 combat battles",
    category: "combat",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "war_machine",
    title: "War Machine",
    description: "Win 50 combat battles",
    category: "combat",
    rarity: "epic",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 10000, prestige: 1000 }
  },
  {
    id: "galactic_conqueror",
    title: "Galactic Conqueror",
    description: "Win 200 combat battles",
    category: "combat",
    rarity: "legendary",
    requirement: 200,
    progress: 0,
    completed: false,
    rewards: { xp: 25000, prestige: 2500 }
  },
  {
    id: "fleet_commander",
    title: "Fleet Commander",
    description: "Command a fleet of 50 ships",
    category: "combat",
    rarity: "uncommon",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "armada_admiral",
    title: "Armada Admiral",
    description: "Command a fleet of 200 ships",
    category: "combat",
    rarity: "rare",
    requirement: 200,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "titan_commander",
    title: "Titan Commander",
    description: "Command a fleet of 1000 ships",
    category: "combat",
    rarity: "legendary",
    requirement: 1000,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "pirate_hunter",
    title: "Pirate Hunter",
    description: "Destroy 25 pirate fleets",
    category: "combat",
    rarity: "uncommon",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "pirate_eliminator",
    title: "Pirate Eliminator",
    description: "Destroy 100 pirate fleets",
    category: "combat",
    rarity: "epic",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "siege_breaker",
    title: "Siege Breaker",
    description: "Break 10 enemy sieges",
    category: "combat",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "shield_master",
    title: "Shield Master",
    description: "Block 5000 damage with shields",
    category: "combat",
    rarity: "uncommon",
    requirement: 5000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "shield_legend",
    title: "Shield Legend",
    description: "Block 50000 damage with shields",
    category: "combat",
    rarity: "epic",
    requirement: 50000,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "weapons_specialist",
    title: "Weapons Specialist",
    description: "Deal 10000 total damage in battles",
    category: "combat",
    rarity: "uncommon",
    requirement: 10000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "devastation",
    title: "Devastation",
    description: "Deal 100000 total damage in battles",
    category: "combat",
    rarity: "rare",
    requirement: 100000,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "annihilation",
    title: "Annihilation",
    description: "Deal 1000000 total damage in battles",
    category: "combat",
    rarity: "legendary",
    requirement: 1000000,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "no_losses",
    title: "Flawless Victory",
    description: "Win 10 battles without losing a single ship",
    category: "combat",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "underdog",
    title: "Underdog",
    description: "Win a battle with 10x fewer ships than the enemy",
    category: "combat",
    rarity: "epic",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 6000, prestige: 600 }
  },
  {
    id: "spy_master",
    title: "Spy Master",
    description: "Successfully complete 20 espionage missions",
    category: "combat",
    rarity: "rare",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "saboteur",
    title: "Saboteur",
    description: "Successfully sabotage 15 enemy installations",
    category: "combat",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "planet_conqueror",
    title: "Planet Conqueror",
    description: "Conquer 5 enemy planets",
    category: "combat",
    rarity: "rare",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "world_domination",
    title: "World Domination",
    description: "Conquer 25 enemy planets",
    category: "combat",
    rarity: "epic",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 12000, prestige: 1200 }
  },
  {
    id: "defender_of_realm",
    title: "Defender of the Realm",
    description: "Successfully defend against 20 attacks",
    category: "combat",
    rarity: "rare",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "unbreakable",
    title: "Unbreakable",
    description: "Successfully defend against 100 attacks",
    category: "combat",
    rarity: "legendary",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 15000, prestige: 1500 }
  },
  {
    id: "fleet_destroyer",
    title: "Fleet Destroyer",
    description: "Destroy 500 enemy ships in total",
    category: "combat",
    rarity: "rare",
    requirement: 500,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "ship_breaker",
    title: "Ship Breaker",
    description: "Destroy 5000 enemy ships in total",
    category: "combat",
    rarity: "legendary",
    requirement: 5000,
    progress: 0,
    completed: false,
    rewards: { xp: 18000, prestige: 1800 }
  },
  {
    id: "first_capture",
    title: "First Capture",
    description: "Capture your first enemy ship",
    category: "combat",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 750, prestige: 75 }
  },
  {
    id: "ship_collector",
    title: "Prize Fleet",
    description: "Capture 25 enemy ships",
    category: "combat",
    rarity: "rare",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "bounty_hunter",
    title: "Bounty Hunter",
    description: "Complete 30 bounty missions",
    category: "combat",
    rarity: "rare",
    requirement: 30,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "war_hero",
    title: "War Hero",
    description: "Participate in 50 alliance wars",
    category: "combat",
    rarity: "epic",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 10000, prestige: 1000 }
  },
  {
    id: "supreme_general",
    title: "Supreme General",
    description: "Win 500 battles and destroy 10000 ships",
    category: "combat",
    rarity: "legendary",
    requirement: 500,
    progress: 0,
    completed: false,
    rewards: { xp: 30000, prestige: 3000 }
  },

  // ═══════════════════════════════════════════════════════════════
  // ECONOMICS ACHIEVEMENTS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "resource_collector",
    title: "Resource Magnate",
    description: "Accumulate 1 million resources",
    category: "economics",
    rarity: "uncommon",
    requirement: 1000000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "millionaire",
    title: "Millionaire",
    description: "Accumulate 10 million credits",
    category: "economics",
    rarity: "rare",
    requirement: 10000000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "billionaire",
    title: "Billionaire",
    description: "Accumulate 1 billion credits",
    category: "economics",
    rarity: "epic",
    requirement: 1000000000,
    progress: 0,
    completed: false,
    rewards: { xp: 10000, prestige: 1000 }
  },
  {
    id: "trillionaire",
    title: "Trillionaire",
    description: "Accumulate 1 trillion credits",
    category: "economics",
    rarity: "legendary",
    requirement: 1000000000000,
    progress: 0,
    completed: false,
    rewards: { xp: 25000, prestige: 2500 }
  },
  {
    id: "metal_baron",
    title: "Metal Baron",
    description: "Produce 5 million metal",
    category: "economics",
    rarity: "uncommon",
    requirement: 5000000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "crystal_mogul",
    title: "Crystal Mogul",
    description: "Produce 5 million crystal",
    category: "economics",
    rarity: "uncommon",
    requirement: 5000000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "deuterium_king",
    title: "Deuterium King",
    description: "Produce 2 million deuterium",
    category: "economics",
    rarity: "uncommon",
    requirement: 2000000,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "trade_prince",
    title: "Trade Prince",
    description: "Complete 50 trades",
    category: "economics",
    rarity: "uncommon",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "trade_emperor",
    title: "Trade Emperor",
    description: "Complete 500 trades",
    category: "economics",
    rarity: "epic",
    requirement: 500,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "merchant",
    title: "Merchant",
    description: "Sell 100 items",
    category: "economics",
    rarity: "uncommon",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "industrialist",
    title: "Industrialist",
    description: "Upgrade metal mine to level 20",
    category: "economics",
    rarity: "rare",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "energy_magnate",
    title: "Energy Magnate",
    description: "Produce 1 million energy",
    category: "economics",
    rarity: "rare",
    requirement: 1000000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "supply_chain_master",
    title: "Supply Chain Master",
    description: "Have all resource buildings above level 15",
    category: "economics",
    rarity: "rare",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "market_dominator",
    title: "Market Dominator",
    description: "Control 10% of market share",
    category: "economics",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "tax_collector",
    title: "Tax Collector",
    description: "Collect 100000 in taxes",
    category: "economics",
    rarity: "uncommon",
    requirement: 100000,
    progress: 0,
    completed: false,
    rewards: { xp: 1500, prestige: 150 }
  },
  {
    id: "financial_empire",
    title: "Financial Empire",
    description: "Have 10 billion total resources",
    category: "economics",
    rarity: "legendary",
    requirement: 10000000000,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "first_ship_built",
    title: "Shipyard Apprentice",
    description: "Build your first ship",
    category: "economics",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "fleet_builder",
    title: "Fleet Builder",
    description: "Build 100 ships",
    category: "economics",
    rarity: "uncommon",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "mass_producer",
    title: "Mass Producer",
    description: "Build 1000 ships",
    category: "economics",
    rarity: "rare",
    requirement: 1000,
    progress: 0,
    completed: false,
    rewards: { xp: 6000, prestige: 600 }
  },
  {
    id: "mega_factory",
    title: "Mega Factory",
    description: "Build 10000 ships",
    category: "economics",
    rarity: "legendary",
    requirement: 10000,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "resource_exporter",
    title: "Resource Exporter",
    description: "Export 1 million resources to allies",
    category: "economics",
    rarity: "rare",
    requirement: 1000000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "dark_matter_collector",
    title: "Dark Matter Collector",
    description: "Accumulate 10000 dark matter",
    category: "economics",
    rarity: "epic",
    requirement: 10000,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "loot_master",
    title: "Loot Master",
    description: "Collect 500000 resources from battles",
    category: "economics",
    rarity: "rare",
    requirement: 500000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "trade_monopoly",
    title: "Trade Monopoly",
    description: "Complete 1000 trades",
    category: "economics",
    rarity: "legendary",
    requirement: 1000,
    progress: 0,
    completed: false,
    rewards: { xp: 15000, prestige: 1500 }
  },
  {
    id: "profit_king",
    title: "Profit King",
    description: "Earn 5 million credits in a single day",
    category: "economics",
    rarity: "epic",
    requirement: 5000000,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },

  // ═══════════════════════════════════════════════════════════════
  // TECHNOLOGY ACHIEVEMENTS (25)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tech_researcher",
    title: "Research Pioneer",
    description: "Unlock 20 technologies",
    category: "technology",
    rarity: "rare",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "tech_novice",
    title: "Tech Novice",
    description: "Unlock 5 technologies",
    category: "technology",
    rarity: "common",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 750, prestige: 75 }
  },
  {
    id: "tech_enthusiast",
    title: "Tech Enthusiast",
    description: "Unlock 50 technologies",
    category: "technology",
    rarity: "epic",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "tech_master",
    title: "Technology Master",
    description: "Unlock 100 technologies",
    category: "technology",
    rarity: "legendary",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "energy_tech",
    title: "Energy Innovator",
    description: "Research energy technology to level 10",
    category: "technology",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "laser_specialist",
    title: "Laser Specialist",
    description: "Research laser technology to level 10",
    category: "technology",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "hyperspace_pioneer",
    title: "Hyperspace Pioneer",
    description: "Research hyperspace technology to level 5",
    category: "technology",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 6000, prestige: 600 }
  },
  {
    id: "plasma_researcher",
    title: "Plasma Researcher",
    description: "Research plasma technology to level 5",
    category: "technology",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 6000, prestige: 600 }
  },
  {
    id: "ai_developer",
    title: "AI Developer",
    description: "Research AI technology to level 10",
    category: "technology",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "quantum_computing",
    title: "Quantum Computing",
    description: "Research quantum technology to level 5",
    category: "technology",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 7000, prestige: 700 }
  },
  {
    id: "espionage_expert",
    title: "Espionage Expert",
    description: "Research espionage technology to level 10",
    category: "technology",
    rarity: "rare",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "computer_scientist",
    title: "Computer Scientist",
    description: "Research computer technology to level 15",
    category: "technology",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "astrophysicist",
    title: "Astrophysicist",
    description: "Research astrophysics to level 10",
    category: "technology",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "graviton_master",
    title: "Graviton Master",
    description: "Research graviton technology to level 5",
    category: "technology",
    rarity: "legendary",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 12000, prestige: 1200 }
  },
  {
    id: "weapons_engineer",
    title: "Weapons Engineer",
    description: "Research weapons technology to level 15",
    category: "technology",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "shield_engineer",
    title: "Shield Engineer",
    description: "Research shielding technology to level 15",
    category: "technology",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "armour_specialist",
    title: "Armour Specialist",
    description: "Research armour technology to level 15",
    category: "technology",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "drive_specialist",
    title: "Drive Specialist",
    description: "Research impulse drive to level 15",
    category: "technology",
    rarity: "rare",
    requirement: 15,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "intergalactic_network",
    title: "Intergalactic Network",
    description: "Research intergalactic research network to level 5",
    category: "technology",
    rarity: "legendary",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 15000, prestige: 1500 }
  },
  {
    id: "research_lab_master",
    title: "Research Lab Master",
    description: "Upgrade research lab to level 20",
    category: "technology",
    rarity: "epic",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "tech_tree_complete",
    title: "Tech Tree Complete",
    description: "Unlock every technology in a single category",
    category: "technology",
    rarity: "legendary",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 18000, prestige: 1800 }
  },
  {
    id: "blueprint_collector",
    title: "Blueprint Collector",
    description: "Collect 50 blueprints",
    category: "technology",
    rarity: "rare",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "megastructure_engineer",
    title: "Megastructure Engineer",
    description: "Construct 5 megastructures",
    category: "technology",
    rarity: "legendary",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "innovation_chain",
    title: "Innovation Chain",
    description: "Research 10 technologies in a row without stopping",
    category: "technology",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "science_triumvirate",
    title: "Science Triumvirate",
    description: "Reach level 10 in three different research fields",
    category: "technology",
    rarity: "rare",
    requirement: 3,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },

  // ═══════════════════════════════════════════════════════════════
  // DIPLOMACY ACHIEVEMENTS (20)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "first_ally",
    title: "First Friend",
    description: "Form your first alliance",
    category: "diplomacy",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "alliance_leader",
    title: "Alliance Leader",
    description: "Lead an alliance with 10 members",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "alliance_emperor",
    title: "Alliance Emperor",
    description: "Lead an alliance with 50 members",
    category: "diplomacy",
    rarity: "epic",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "peacemaker",
    title: "Peacemaker",
    description: "Sign 10 peace treaties",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "treaty_master",
    title: "Treaty Master",
    description: "Sign 50 treaties",
    category: "diplomacy",
    rarity: "rare",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "message_broker",
    title: "Message Broker",
    description: "Send 100 messages to other players",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 1500, prestige: 150 }
  },
  {
    id: "resource_sharer",
    title: "Resource Sharer",
    description: "Send 1 million resources as gifts",
    category: "diplomacy",
    rarity: "rare",
    requirement: 1000000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "war_declare",
    title: "War Declaration",
    description: "Declare war on 10 enemies",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "diplomat",
    title: "Diplomat",
    description: "Complete 25 diplomatic missions",
    category: "diplomacy",
    rarity: "rare",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 4500, prestige: 450 }
  },
  {
    id: "ambassador",
    title: "Ambassador",
    description: "Complete 100 diplomatic missions",
    category: "diplomacy",
    rarity: "epic",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "trade_agreement",
    title: "Trade Agreement",
    description: "Sign 20 trade agreements",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "non_aggression",
    title: "Non-Aggression Pact",
    description: "Sign 10 non-aggression pacts",
    category: "diplomacy",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 1800, prestige: 180 }
  },
  {
    id: "galactic_senate",
    title: "Galactic Senate Member",
    description: "Join the galactic senate",
    category: "diplomacy",
    rarity: "rare",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "vote_collector",
    title: "Vote Collector",
    description: "Win 10 galactic votes",
    category: "diplomacy",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 7500, prestige: 750 }
  },
  {
    id: "peacekeeper",
    title: "Peacekeeper",
    description: "Prevent 5 wars through diplomacy",
    category: "diplomacy",
    rarity: "epic",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 7000, prestige: 700 }
  },
  {
    id: "shadow_diplomat",
    title: "Shadow Diplomat",
    description: "Complete 50 espionage-diplomacy missions",
    category: "diplomacy",
    rarity: "rare",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "faction_marshal",
    title: "Faction Marshal",
    description: "Reach max reputation with 3 factions",
    category: "diplomacy",
    rarity: "epic",
    requirement: 3,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "galactic_emperor",
    title: "Galactic Emperor",
    description: "Win the galactic election",
    category: "diplomacy",
    rarity: "legendary",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 15000, prestige: 1500 }
  },
  {
    id: "cultural_icon",
    title: "Cultural Icon",
    description: "Reach 10000 cultural influence",
    category: "diplomacy",
    rarity: "rare",
    requirement: 10000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "universal_translator",
    title: "Universal Translator",
    description: "Communicate with 20 alien species",
    category: "diplomacy",
    rarity: "legendary",
    requirement: 20,
    progress: 0,
    completed: false,
    rewards: { xp: 12000, prestige: 1200 }
  },

  // ═══════════════════════════════════════════════════════════════
  // MILESTONES ACHIEVEMENTS (20)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "new_beginning",
    title: "New Beginning",
    description: "Complete the tutorial",
    category: "milestones",
    rarity: "common",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 200, prestige: 20 }
  },
  {
    id: "level_5",
    title: "Rising Star",
    description: "Reach commander level 5",
    category: "milestones",
    rarity: "common",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "level_10",
    title: "Seasoned Commander",
    description: "Reach commander level 10",
    category: "milestones",
    rarity: "uncommon",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 1500, prestige: 150 }
  },
  {
    id: "level_25",
    title: "Veteran Commander",
    description: "Reach commander level 25",
    category: "milestones",
    rarity: "rare",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "level_50",
    title: "Elite Commander",
    description: "Reach commander level 50",
    category: "milestones",
    rarity: "epic",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "level_100",
    title: "Supreme Commander",
    description: "Reach commander level 100",
    category: "milestones",
    rarity: "legendary",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "legendary_artifact",
    title: "Artifact Collector",
    description: "Collect 10 artifacts",
    category: "milestones",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 10000, prestige: 1000 }
  },
  {
    id: "artifact_hoarder",
    title: "Artifact Hoarder",
    description: "Collect 50 artifacts",
    category: "milestones",
    rarity: "legendary",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 20000, prestige: 2000 }
  },
  {
    id: "building_milestone",
    title: "Construction Tycoon",
    description: "Upgrade 100 buildings",
    category: "milestones",
    rarity: "uncommon",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "mega_builder",
    title: "Mega Builder",
    description: "Upgrade 500 buildings",
    category: "milestones",
    rarity: "epic",
    requirement: 500,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "turn_master",
    title: "Turn Master",
    description: "Spend 1000 turns",
    category: "milestones",
    rarity: "rare",
    requirement: 1000,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "quest_warrior",
    title: "Quest Warrior",
    description: "Complete 25 quests",
    category: "milestones",
    rarity: "uncommon",
    requirement: 25,
    progress: 0,
    completed: false,
    rewards: { xp: 2500, prestige: 250 }
  },
  {
    id: "quest_master",
    title: "Quest Master",
    description: "Complete 100 quests",
    category: "milestones",
    rarity: "epic",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 8000, prestige: 800 }
  },
  {
    id: "speed_runner",
    title: "Speed Runner",
    description: "Complete a quest in under 5 minutes",
    category: "milestones",
    rarity: "rare",
    requirement: 1,
    progress: 0,
    completed: false,
    rewards: { xp: 3000, prestige: 300 }
  },
  {
    id: "daily_player",
    title: "Dedicated Player",
    description: "Log in for 30 consecutive days",
    category: "milestones",
    rarity: "rare",
    requirement: 30,
    progress: 0,
    completed: false,
    rewards: { xp: 5000, prestige: 500 }
  },
  {
    id: "veteran_player",
    title: "Veteran Player",
    description: "Log in for 365 consecutive days",
    category: "milestones",
    rarity: "legendary",
    requirement: 365,
    progress: 0,
    completed: false,
    rewards: { xp: 25000, prestige: 2500 }
  },
  {
    id: "commander_richer",
    title: "Commander Richer",
    description: "Upgrade commander skills 50 times",
    category: "milestones",
    rarity: "rare",
    requirement: 50,
    progress: 0,
    completed: false,
    rewards: { xp: 4000, prestige: 400 }
  },
  {
    id: "government_reformer",
    title: "Government Reformer",
    description: "Change government type 5 times",
    category: "milestones",
    rarity: "uncommon",
    requirement: 5,
    progress: 0,
    completed: false,
    rewards: { xp: 2000, prestige: 200 }
  },
  {
    id: "empire_renamer",
    title: "Empire Identity",
    description: "Rename your empire, home world, and commander",
    category: "milestones",
    rarity: "common",
    requirement: 3,
    progress: 0,
    completed: false,
    rewards: { xp: 500, prestige: 50 }
  },
  {
    id: "ultimate_achievement",
    title: "Ultimate Achievement",
    description: "Unlock 100 other achievements",
    category: "milestones",
    rarity: "legendary",
    requirement: 100,
    progress: 0,
    completed: false,
    rewards: { xp: 30000, prestige: 3000 }
  }
];

export const QUESTS: Quest[] = [
  {
    id: "quest_first_mission",
    title: "Maiden Voyage",
    description: "Travel to Alpha Centauri and return home",
    type: "exploration",
    objectives: [
      { id: "obj_1", title: "Travel to Alpha Centauri", target: 1, current: 0, completed: false },
      { id: "obj_2", title: "Return home", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 10000, crystal: 5000, deuterium: 2000, xp: 1000 },
    active: true,
    completed: false,
    difficulty: "easy"
  },
  {
    id: "quest_anomaly_hunt",
    title: "Anomaly Investigation",
    description: "Discover and explore 3 space anomalies",
    type: "exploration",
    objectives: [
      { id: "obj_1", title: "Discover 1st anomaly", target: 1, current: 0, completed: false },
      { id: "obj_2", title: "Discover 2nd anomaly", target: 1, current: 0, completed: false },
      { id: "obj_3", title: "Discover 3rd anomaly", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 50000, crystal: 50000, deuterium: 30000, xp: 5000, technology: "astrophysics" },
    active: false,
    completed: false,
    difficulty: "normal"
  },
  {
    id: "quest_combat_tutorial",
    title: "First Contact",
    description: "Engage and win your first combat battle",
    type: "combat",
    objectives: [
      { id: "obj_1", title: "Engage enemy fleet", target: 1, current: 0, completed: false },
      { id: "obj_2", title: "Win the battle", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 20000, crystal: 15000, deuterium: 10000, xp: 2000 },
    active: true,
    completed: false,
    difficulty: "easy"
  },
  {
    id: "quest_warp_network",
    title: "Gateway to the Stars",
    description: "Control 3 warp gates and connect them",
    type: "exploration",
    objectives: [
      { id: "obj_1", title: "Capture 1st gate", target: 1, current: 0, completed: false },
      { id: "obj_2", title: "Capture 2nd gate", target: 1, current: 0, completed: false },
      { id: "obj_3", title: "Link gates together", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 100000, crystal: 100000, deuterium: 50000, xp: 10000 },
    active: false,
    completed: false,
    difficulty: "hard"
  },
  {
    id: "quest_resource_rush",
    title: "Resource Rush",
    description: "Gather massive amounts of resources",
    type: "gathering",
    objectives: [
      { id: "obj_1", title: "Gather 1M metal", target: 1000000, current: 0, completed: false },
      { id: "obj_2", title: "Gather 500K crystal", target: 500000, current: 0, completed: false },
      { id: "obj_3", title: "Gather 200K deuterium", target: 200000, current: 0, completed: false }
    ],
    rewards: { metal: 200000, crystal: 200000, deuterium: 100000, xp: 8000 },
    active: false,
    completed: false,
    difficulty: "normal"
  },
  {
    id: "quest_research_marathon",
    title: "Research Marathon",
    description: "Complete a chain of 10 research projects",
    type: "research",
    objectives: [
      { id: "obj_1", title: "Complete 10 research projects", target: 10, current: 0, completed: false }
    ],
    rewards: { metal: 150000, crystal: 150000, deuterium: 75000, xp: 12000, technology: "quantumTech" },
    active: false,
    completed: false,
    difficulty: "hard"
  },
  {
    id: "quest_pirate_extermination",
    title: "Pirate Extermination",
    description: "Destroy all pirate bases in the sector",
    type: "combat",
    objectives: [
      { id: "obj_1", title: "Destroy 5 pirate bases", target: 5, current: 0, completed: false },
      { id: "obj_2", title: "Eliminate pirate flagship", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 300000, crystal: 200000, deuterium: 100000, xp: 15000 },
    active: false,
    completed: false,
    difficulty: "expert"
  },
  {
    id: "quest_colony_expansion",
    title: "Colony Expansion",
    description: "Establish 5 new colonies",
    type: "exploration",
    objectives: [
      { id: "obj_1", title: "Establish 5 colonies", target: 5, current: 0, completed: false }
    ],
    rewards: { metal: 100000, crystal: 100000, deuterium: 50000, xp: 8000 },
    active: false,
    completed: false,
    difficulty: "normal"
  },
  {
    id: "quest_diplomatic_mission",
    title: "Diplomatic Mission",
    description: "Complete a series of diplomatic tasks",
    type: "story",
    objectives: [
      { id: "obj_1", title: "Sign 3 trade agreements", target: 3, current: 0, completed: false },
      { id: "obj_2", title: "Send 5 diplomatic messages", target: 5, current: 0, completed: false },
      { id: "obj_3", title: "Form 1 alliance", target: 1, current: 0, completed: false }
    ],
    rewards: { metal: 50000, crystal: 50000, deuterium: 25000, xp: 6000 },
    active: false,
    completed: false,
    difficulty: "normal"
  },
  {
    id: "quest_legendary_fleet",
    title: "Legendary Fleet",
    description: "Build the most powerful fleet in the galaxy",
    type: "combat",
    objectives: [
      { id: "obj_1", title: "Build 500 ships", target: 500, current: 0, completed: false },
      { id: "obj_2", title: "Upgrade all ships to max level", target: 500, current: 0, completed: false }
    ],
    rewards: { metal: 500000, crystal: 500000, deuterium: 250000, xp: 25000 },
    active: false,
    completed: false,
    difficulty: "expert"
  }
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get achievements by rarity
 */
export function getAchievementsByRarity(rarity: Achievement["rarity"]): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity);
}

/**
 * Get completed achievements count
 */
export function getCompletedCount(): number {
  return ACHIEVEMENTS.filter(a => a.completed).length;
}

/**
 * Get total achievements count
 */
export function getTotalCount(): number {
  return ACHIEVEMENTS.length;
}