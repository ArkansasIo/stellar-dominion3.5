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
    id: "legendary_artifact",
    title: "Artifact Collector",
    description: "Collect 10 artifacts",
    category: "milestones",
    rarity: "epic",
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: { xp: 10000, prestige: 1000 }
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
  }
];
