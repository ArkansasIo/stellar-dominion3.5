// Trials System Configuration
// Wave-based combat challenges that players complete for rewards

export interface TrialTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  powerRequirement: number;
  entryCost: number;
  waves: TrialWave[];
  rewards: TrialReward[];
  firstClearRewards: TrialReward[];
  timeBonus: { underMinutes: number; bonusMultiplier: number }[];
}

export interface TrialWave {
  waveNumber: number;
  name: string;
  description: string;
  enemyCount: number;
  enemyPower: number;
  difficulty: "trivial" | "easy" | "moderate" | "challenging" | "hard" | "extreme" | "nightmare";
  rewards: { type: string; amount: number; chance: number }[];
}

export interface TrialReward {
  type: "credits" | "metal" | "crystal" | "deuterium" | "experience" | "item" | "trial_points" | "blueprint" | "abyssal_essence" | "void_shard";
  name?: string;
  description?: string;
  amount: number;
  chance: number;
  rarity?: "common" | "rare" | "epic" | "legendary" | "mythic";
  itemId?: string;
}

export const TRIAL_TIERS: TrialTier[] = [
  {
    tier: 1,
    name: "Initiate Trial",
    description: "Begin your trial journey. Basic waves to prove your worth.",
    icon: "⚔️",
    color: "text-gray-400",
    powerRequirement: 1000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "First Blood", description: "Defeat the training dummies", enemyCount: 3, enemyPower: 0.5, difficulty: "trivial", rewards: [{ type: "credits", amount: 500, chance: 1.0 }, { type: "experience", amount: 50, chance: 1.0 }] },
      { waveNumber: 2, name: "Growing Threat", description: "Face stronger opponents", enemyCount: 4, enemyPower: 0.7, difficulty: "easy", rewards: [{ type: "credits", amount: 750, chance: 1.0 }, { type: "metal", amount: 500, chance: 0.5 }] },
      { waveNumber: 3, name: "Initiate's Challenge", description: "Prove you belong here", enemyCount: 5, enemyPower: 1.0, difficulty: "easy", rewards: [{ type: "credits", amount: 1000, chance: 1.0 }, { type: "experience", amount: 100, chance: 1.0 }, { type: "trial_points", amount: 10, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 3000, chance: 1.0 },
      { type: "metal", amount: 1500, chance: 0.8 },
      { type: "crystal", amount: 750, chance: 0.6 },
      { type: "experience", amount: 200, chance: 1.0 },
      { type: "trial_points", amount: 25, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 5000, chance: 1.0 },
      { type: "experience", amount: 500, chance: 1.0 },
      { type: "trial_points", amount: 50, chance: 1.0 },
      { type: "item", name: "Initiate's Medal", description: "Proof of your first trial victory", amount: 1, chance: 1.0, rarity: "common" },
    ],
    timeBonus: [
      { underMinutes: 2, bonusMultiplier: 2.0 },
      { underMinutes: 3, bonusMultiplier: 1.5 },
      { underMinutes: 5, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 2,
    name: "Warrior's Trial",
    description: "Test your combat skills against tougher waves.",
    icon: "🛡️",
    color: "text-blue-400",
    powerRequirement: 3000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Warm Up", description: "Prepare for what's coming", enemyCount: 4, enemyPower: 0.6, difficulty: "easy", rewards: [{ type: "credits", amount: 1000, chance: 1.0 }, { type: "experience", amount: 75, chance: 1.0 }] },
      { waveNumber: 2, name: "The Gauntlet", description: "Run the gauntlet of enemies", enemyCount: 5, enemyPower: 0.8, difficulty: "easy", rewards: [{ type: "credits", amount: 1500, chance: 1.0 }, { type: "metal", amount: 1000, chance: 0.5 }] },
      { waveNumber: 3, name: "Warrior's Stand", description: "Hold your ground", enemyCount: 6, enemyPower: 1.0, difficulty: "moderate", rewards: [{ type: "credits", amount: 2000, chance: 1.0 }, { type: "crystal", amount: 750, chance: 0.5 }] },
      { waveNumber: 4, name: "Trial by Fire", description: "Face the fire", enemyCount: 5, enemyPower: 1.2, difficulty: "moderate", rewards: [{ type: "credits", amount: 2500, chance: 1.0 }, { type: "experience", amount: 200, chance: 1.0 }, { type: "trial_points", amount: 15, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 6000, chance: 1.0 },
      { type: "metal", amount: 3000, chance: 0.85 },
      { type: "crystal", amount: 1500, chance: 0.65 },
      { type: "experience", amount: 400, chance: 1.0 },
      { type: "trial_points", amount: 40, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 10000, chance: 1.0 },
      { type: "experience", amount: 1000, chance: 1.0 },
      { type: "trial_points", amount: 80, chance: 1.0 },
      { type: "item", name: "Warrior's Token", description: "Mark of a warrior", amount: 1, chance: 1.0, rarity: "common" },
    ],
    timeBonus: [
      { underMinutes: 3, bonusMultiplier: 2.0 },
      { underMinutes: 5, bonusMultiplier: 1.5 },
      { underMinutes: 7, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 3,
    name: "Champion's Trial",
    description: "Champion-level challenges with escalating threat.",
    icon: "🏆",
    color: "text-blue-500",
    powerRequirement: 6000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Champion's Warm Up", description: "Prepare for glory", enemyCount: 5, enemyPower: 0.7, difficulty: "easy", rewards: [{ type: "credits", amount: 2000, chance: 1.0 }, { type: "experience", amount: 100, chance: 1.0 }] },
      { waveNumber: 2, name: "Horde Defense", description: "Defend against the horde", enemyCount: 6, enemyPower: 0.9, difficulty: "moderate", rewards: [{ type: "credits", amount: 3000, chance: 1.0 }, { type: "metal", amount: 2000, chance: 0.6 }] },
      { waveNumber: 3, name: "Elite Encounter", description: "Face elite warriors", enemyCount: 4, enemyPower: 1.2, difficulty: "moderate", rewards: [{ type: "credits", amount: 4000, chance: 1.0 }, { type: "crystal", amount: 1500, chance: 0.5 }] },
      { waveNumber: 4, name: "Champion's Duel", description: "Duel the champion", enemyCount: 3, enemyPower: 1.5, difficulty: "challenging", rewards: [{ type: "credits", amount: 5000, chance: 1.0 }, { type: "deuterium", amount: 1000, chance: 0.4 }] },
      { waveNumber: 5, name: "Triumph", description: "Claim your victory", enemyCount: 6, enemyPower: 1.0, difficulty: "moderate", rewards: [{ type: "credits", amount: 6000, chance: 1.0 }, { type: "experience", amount: 300, chance: 1.0 }, { type: "trial_points", amount: 20, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 12000, chance: 1.0 },
      { type: "metal", amount: 6000, chance: 0.9 },
      { type: "crystal", amount: 3000, chance: 0.7 },
      { type: "deuterium", amount: 1500, chance: 0.5 },
      { type: "experience", amount: 600, chance: 1.0 },
      { type: "trial_points", amount: 60, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 20000, chance: 1.0 },
      { type: "experience", amount: 2000, chance: 1.0 },
      { type: "trial_points", amount: 120, chance: 1.0 },
      { type: "item", name: "Champion's Crest", description: "A crest of champions", amount: 1, chance: 1.0, rarity: "rare" },
    ],
    timeBonus: [
      { underMinutes: 4, bonusMultiplier: 2.0 },
      { underMinutes: 6, bonusMultiplier: 1.5 },
      { underMinutes: 9, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 4,
    name: "Hero's Trial",
    description: "Heroic trials that push your abilities to the limit.",
    icon: "🌟",
    color: "text-green-500",
    powerRequirement: 10000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Hero's Welcome", description: "The enemies greet you", enemyCount: 5, enemyPower: 0.8, difficulty: "moderate", rewards: [{ type: "credits", amount: 3000, chance: 1.0 }, { type: "experience", amount: 150, chance: 1.0 }] },
      { waveNumber: 2, name: "Swarm Tactics", description: "Overwhelming numbers", enemyCount: 8, enemyPower: 0.9, difficulty: "moderate", rewards: [{ type: "credits", amount: 4500, chance: 1.0 }, { type: "metal", amount: 3000, chance: 0.6 }] },
      { waveNumber: 3, name: "Elite Guard", description: "Break through the elite guard", enemyCount: 5, enemyPower: 1.3, difficulty: "challenging", rewards: [{ type: "credits", amount: 6000, chance: 1.0 }, { type: "crystal", amount: 2500, chance: 0.5 }] },
      { waveNumber: 4, name: "Captain's Stand", description: "Face the enemy captain", enemyCount: 3, enemyPower: 1.8, difficulty: "challenging", rewards: [{ type: "credits", amount: 7500, chance: 1.0 }, { type: "deuterium", amount: 2000, chance: 0.4 }] },
      { waveNumber: 5, name: "Hero's Sacrifice", description: "The ultimate test", enemyCount: 6, enemyPower: 1.4, difficulty: "hard", rewards: [{ type: "credits", amount: 10000, chance: 1.0 }, { type: "experience", amount: 500, chance: 1.0 }, { type: "trial_points", amount: 30, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 20000, chance: 1.0 },
      { type: "metal", amount: 10000, chance: 0.9 },
      { type: "crystal", amount: 5000, chance: 0.75 },
      { type: "deuterium", amount: 2500, chance: 0.55 },
      { type: "experience", amount: 1000, chance: 1.0 },
      { type: "trial_points", amount: 80, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 35000, chance: 1.0 },
      { type: "experience", amount: 3500, chance: 1.0 },
      { type: "trial_points", amount: 160, chance: 1.0 },
      { type: "item", name: "Hero's Medallion", description: "A medallion worthy of a hero", amount: 1, chance: 1.0, rarity: "rare" },
    ],
    timeBonus: [
      { underMinutes: 5, bonusMultiplier: 2.0 },
      { underMinutes: 8, bonusMultiplier: 1.5 },
      { underMinutes: 11, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 5,
    name: "Legend's Trial",
    description: "Legendary trials that separate the great from the mighty.",
    icon: "⚡",
    color: "text-purple-500",
    powerRequirement: 15000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Legend's Prelude", description: "The journey begins", enemyCount: 6, enemyPower: 0.9, difficulty: "moderate", rewards: [{ type: "credits", amount: 5000, chance: 1.0 }, { type: "experience", amount: 200, chance: 1.0 }] },
      { waveNumber: 2, name: "Tidal Wave", description: "A wave of relentless foes", enemyCount: 8, enemyPower: 1.1, difficulty: "challenging", rewards: [{ type: "credits", amount: 7500, chance: 1.0 }, { type: "metal", amount: 5000, chance: 0.6 }] },
      { waveNumber: 3, name: "Boss Rush", description: "Multiple mini-bosses", enemyCount: 4, enemyPower: 1.8, difficulty: "hard", rewards: [{ type: "credits", amount: 10000, chance: 1.0 }, { type: "crystal", amount: 4000, chance: 0.5 }] },
      { waveNumber: 4, name: "Legend's Gauntlet", description: "Prove your legend", enemyCount: 7, enemyPower: 1.5, difficulty: "hard", rewards: [{ type: "credits", amount: 12500, chance: 1.0 }, { type: "deuterium", amount: 3000, chance: 0.4 }] },
      { waveNumber: 5, name: "Immortal Challenge", description: "Face the immortal", enemyCount: 3, enemyPower: 2.2, difficulty: "extreme", rewards: [{ type: "credits", amount: 15000, chance: 1.0 }, { type: "experience", amount: 800, chance: 1.0 }] },
      { waveNumber: 6, name: "Legend's Ascension", description: "Ascend to legend status", enemyCount: 8, enemyPower: 1.3, difficulty: "challenging", rewards: [{ type: "credits", amount: 20000, chance: 1.0 }, { type: "experience", amount: 1000, chance: 1.0 }, { type: "trial_points", amount: 40, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 35000, chance: 1.0 },
      { type: "metal", amount: 18000, chance: 0.95 },
      { type: "crystal", amount: 9000, chance: 0.8 },
      { type: "deuterium", amount: 4500, chance: 0.6 },
      { type: "experience", amount: 1500, chance: 1.0 },
      { type: "trial_points", amount: 120, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 60000, chance: 1.0 },
      { type: "experience", amount: 5000, chance: 1.0 },
      { type: "trial_points", amount: 250, chance: 1.0 },
      { type: "item", name: "Legend's Sigil", description: "A sigil worn by legends", amount: 1, chance: 1.0, rarity: "epic" },
    ],
    timeBonus: [
      { underMinutes: 6, bonusMultiplier: 2.0 },
      { underMinutes: 9, bonusMultiplier: 1.5 },
      { underMinutes: 13, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 6,
    name: "Mythic Trial",
    description: "Mythic-tier onslaught designed for the galaxy's finest warriors.",
    icon: "🔥",
    color: "text-orange-500",
    powerRequirement: 25000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Mythic Onslaught", description: "The mythic challenge begins", enemyCount: 7, enemyPower: 1.0, difficulty: "challenging", rewards: [{ type: "credits", amount: 8000, chance: 1.0 }, { type: "experience", amount: 300, chance: 1.0 }] },
      { waveNumber: 2, name: "Endless Horde", description: "They just keep coming", enemyCount: 10, enemyPower: 1.2, difficulty: "hard", rewards: [{ type: "credits", amount: 12000, chance: 1.0 }, { type: "metal", amount: 8000, chance: 0.6 }] },
      { waveNumber: 3, name: "Titan's Wrath", description: "Face the wrath of titans", enemyCount: 5, enemyPower: 2.0, difficulty: "hard", rewards: [{ type: "credits", amount: 16000, chance: 1.0 }, { type: "crystal", amount: 6000, chance: 0.5 }] },
      { waveNumber: 4, name: "Void Incursion", description: "Void creatures emerge", enemyCount: 6, enemyPower: 2.2, difficulty: "extreme", rewards: [{ type: "credits", amount: 20000, chance: 1.0 }, { type: "deuterium", amount: 5000, chance: 0.4 }] },
      { waveNumber: 5, name: "Mythic Guardian", description: "Guardian of the mythic realm", enemyCount: 3, enemyPower: 2.8, difficulty: "extreme", rewards: [{ type: "credits", amount: 25000, chance: 1.0 }, { type: "experience", amount: 1500, chance: 1.0 }] },
      { waveNumber: 6, name: "Apocalypse", description: "The end draws near", enemyCount: 8, enemyPower: 1.8, difficulty: "hard", rewards: [{ type: "credits", amount: 30000, chance: 1.0 }, { type: "experience", amount: 2000, chance: 1.0 }, { type: "trial_points", amount: 60, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 60000, chance: 1.0 },
      { type: "metal", amount: 30000, chance: 1.0 },
      { type: "crystal", amount: 15000, chance: 0.85 },
      { type: "deuterium", amount: 7500, chance: 0.65 },
      { type: "experience", amount: 2500, chance: 1.0 },
      { type: "trial_points", amount: 180, chance: 1.0 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 100000, chance: 1.0 },
      { type: "experience", amount: 8000, chance: 1.0 },
      { type: "trial_points", amount: 400, chance: 1.0 },
      { type: "item", name: "Mythic Emblem", description: "An emblem of mythic achievement", amount: 1, chance: 1.0, rarity: "epic" },
    ],
    timeBonus: [
      { underMinutes: 7, bonusMultiplier: 2.0 },
      { underMinutes: 10, bonusMultiplier: 1.5 },
      { underMinutes: 15, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 7,
    name: "Abyssal Trial",
    description: "Descend into the abyss where only the strongest survive.",
    icon: "🌀",
    color: "text-red-500",
    powerRequirement: 40000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Descent into Darkness", description: "The abyss welcomes you", enemyCount: 8, enemyPower: 1.1, difficulty: "hard", rewards: [{ type: "credits", amount: 12000, chance: 1.0 }, { type: "experience", amount: 400, chance: 1.0 }] },
      { waveNumber: 2, name: "Shadow Legion", description: "Legion of shadows attacks", enemyCount: 10, enemyPower: 1.4, difficulty: "hard", rewards: [{ type: "credits", amount: 18000, chance: 1.0 }, { type: "metal", amount: 12000, chance: 0.6 }] },
      { waveNumber: 3, name: "Abyssal Beasts", description: "Beasts from the deep", enemyCount: 6, enemyPower: 2.2, difficulty: "extreme", rewards: [{ type: "credits", amount: 24000, chance: 1.0 }, { type: "crystal", amount: 10000, chance: 0.5 }] },
      { waveNumber: 4, name: "Corrupted Ones", description: "Corrupted by the void", enemyCount: 5, enemyPower: 2.8, difficulty: "extreme", rewards: [{ type: "credits", amount: 30000, chance: 1.0 }, { type: "deuterium", amount: 7500, chance: 0.4 }] },
      { waveNumber: 5, name: "Abyssal Lord", description: "Face the abyssal lord", enemyCount: 2, enemyPower: 3.5, difficulty: "nightmare", rewards: [{ type: "credits", amount: 40000, chance: 1.0 }, { type: "experience", amount: 2500, chance: 1.0 }, { type: "abyssal_essence", amount: 5, chance: 0.5 }] },
      { waveNumber: 6, name: "Void Collapse", description: "The void collapses around you", enemyCount: 8, enemyPower: 2.0, difficulty: "extreme", rewards: [{ type: "credits", amount: 50000, chance: 1.0 }, { type: "experience", amount: 3000, chance: 1.0 }] },
      { waveNumber: 7, name: "Abyssal Ascension", description: "Emerge from the abyss victorious", enemyCount: 10, enemyPower: 1.5, difficulty: "hard", rewards: [{ type: "credits", amount: 60000, chance: 1.0 }, { type: "experience", amount: 4000, chance: 1.0 }, { type: "trial_points", amount: 80, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 100000, chance: 1.0 },
      { type: "metal", amount: 50000, chance: 1.0 },
      { type: "crystal", amount: 25000, chance: 0.9 },
      { type: "deuterium", amount: 12000, chance: 0.7 },
      { type: "experience", amount: 4000, chance: 1.0 },
      { type: "trial_points", amount: 280, chance: 1.0 },
      { type: "abyssal_essence", amount: 10, chance: 0.4 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 200000, chance: 1.0 },
      { type: "experience", amount: 15000, chance: 1.0 },
      { type: "trial_points", amount: 600, chance: 1.0 },
      { type: "item", name: "Abyssal Crown", description: "Crown of the abyss conqueror", amount: 1, chance: 1.0, rarity: "legendary" },
      { type: "abyssal_essence", amount: 25, chance: 1.0 },
    ],
    timeBonus: [
      { underMinutes: 9, bonusMultiplier: 2.0 },
      { underMinutes: 13, bonusMultiplier: 1.5 },
      { underMinutes: 18, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 8,
    name: "Transcendent Trial",
    description: "Trials that transcend mortal limitations. For gods among warriors.",
    icon: "💫",
    color: "text-amber-500",
    powerRequirement: 60000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "God's Arrival", description: "The transcendent realm greets you", enemyCount: 8, enemyPower: 1.3, difficulty: "hard", rewards: [{ type: "credits", amount: 20000, chance: 1.0 }, { type: "experience", amount: 600, chance: 1.0 }] },
      { waveNumber: 2, name: "Celestial Horde", description: "Celestial enemies descend", enemyCount: 10, enemyPower: 1.6, difficulty: "extreme", rewards: [{ type: "credits", amount: 30000, chance: 1.0 }, { type: "metal", amount: 20000, chance: 0.6 }] },
      { waveNumber: 3, name: "Transcendent Beasts", description: "Beasts of legend", enemyCount: 6, enemyPower: 2.5, difficulty: "extreme", rewards: [{ type: "credits", amount: 40000, chance: 1.0 }, { type: "crystal", amount: 15000, chance: 0.5 }] },
      { waveNumber: 4, name: "Eternal Guardians", description: "Guardians of eternity", enemyCount: 4, enemyPower: 3.2, difficulty: "nightmare", rewards: [{ type: "credits", amount: 50000, chance: 1.0 }, { type: "deuterium", amount: 12000, chance: 0.4 }] },
      { waveNumber: 5, name: "Void Sovereign", description: "The void sovereign appears", enemyCount: 2, enemyPower: 4.0, difficulty: "nightmare", rewards: [{ type: "credits", amount: 65000, chance: 1.0 }, { type: "experience", amount: 4000, chance: 1.0 }, { type: "void_shard", amount: 3, chance: 0.4 }] },
      { waveNumber: 6, name: "Reality Fracture", description: "Reality itself breaks apart", enemyCount: 8, enemyPower: 2.5, difficulty: "extreme", rewards: [{ type: "credits", amount: 80000, chance: 1.0 }, { type: "experience", amount: 5000, chance: 1.0 }] },
      { waveNumber: 7, name: "Transcendence", description: "Achieve transcendence", enemyCount: 10, enemyPower: 1.8, difficulty: "extreme", rewards: [{ type: "credits", amount: 100000, chance: 1.0 }, { type: "experience", amount: 6500, chance: 1.0 }, { type: "trial_points", amount: 100, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 180000, chance: 1.0 },
      { type: "metal", amount: 90000, chance: 1.0 },
      { type: "crystal", amount: 45000, chance: 0.95 },
      { type: "deuterium", amount: 22000, chance: 0.75 },
      { type: "experience", amount: 6500, chance: 1.0 },
      { type: "trial_points", amount: 400, chance: 1.0 },
      { type: "void_shard", amount: 5, chance: 0.3 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 350000, chance: 1.0 },
      { type: "experience", amount: 25000, chance: 1.0 },
      { type: "trial_points", amount: 1000, chance: 1.0 },
      { type: "item", name: "Transcendent Relic", description: "A relic of transcendent power", amount: 1, chance: 1.0, rarity: "legendary" },
      { type: "void_shard", amount: 10, chance: 1.0 },
    ],
    timeBonus: [
      { underMinutes: 10, bonusMultiplier: 2.0 },
      { underMinutes: 15, bonusMultiplier: 1.5 },
      { underMinutes: 20, bonusMultiplier: 1.25 },
    ],
  },
  {
    tier: 9,
    name: "Eternal Trial",
    description: "The ultimate trial. Only the eternal can endure what lies within.",
    icon: "👑",
    color: "text-yellow-500",
    powerRequirement: 75000,
    entryCost: 1,
    waves: [
      { waveNumber: 1, name: "Eternal Gate", description: "Pass through the eternal gate", enemyCount: 10, enemyPower: 1.5, difficulty: "extreme", rewards: [{ type: "credits", amount: 30000, chance: 1.0 }, { type: "experience", amount: 1000, chance: 1.0 }] },
      { waveNumber: 2, name: "Legion of Eternity", description: "An endless legion awaits", enemyCount: 12, enemyPower: 1.8, difficulty: "extreme", rewards: [{ type: "credits", amount: 45000, chance: 1.0 }, { type: "metal", amount: 30000, chance: 0.6 }] },
      { waveNumber: 3, name: "Eternal Beasts", description: "Beasts from beyond time", enemyCount: 7, enemyPower: 2.8, difficulty: "nightmare", rewards: [{ type: "credits", amount: 60000, chance: 1.0 }, { type: "crystal", amount: 25000, chance: 0.5 }] },
      { waveNumber: 4, name: "Timeless Guardians", description: "Guardians beyond time", enemyCount: 5, enemyPower: 3.5, difficulty: "nightmare", rewards: [{ type: "credits", amount: 80000, chance: 1.0 }, { type: "deuterium", amount: 20000, chance: 0.4 }] },
      { waveNumber: 5, name: "Eternal Sovereign", description: "The sovereign of eternity", enemyCount: 3, enemyPower: 4.5, difficulty: "nightmare", rewards: [{ type: "credits", amount: 100000, chance: 1.0 }, { type: "experience", amount: 6000, chance: 1.0 }, { type: "abyssal_essence", amount: 10, chance: 0.5 }] },
      { waveNumber: 6, name: "Void Eternal", description: "The eternal void consumes all", enemyCount: 6, enemyPower: 3.0, difficulty: "nightmare", rewards: [{ type: "credits", amount: 125000, chance: 1.0 }, { type: "experience", amount: 8000, chance: 1.0 }, { type: "void_shard", amount: 5, chance: 0.4 }] },
      { waveNumber: 7, name: "Eternal Triumph", description: "Claim your eternal reward", enemyCount: 12, enemyPower: 2.0, difficulty: "extreme", rewards: [{ type: "credits", amount: 150000, chance: 1.0 }, { type: "experience", amount: 10000, chance: 1.0 }, { type: "trial_points", amount: 150, chance: 1.0 }] },
    ],
    rewards: [
      { type: "credits", amount: 300000, chance: 1.0 },
      { type: "metal", amount: 150000, chance: 1.0 },
      { type: "crystal", amount: 75000, chance: 1.0 },
      { type: "deuterium", amount: 40000, chance: 0.9 },
      { type: "experience", amount: 10000, chance: 1.0 },
      { type: "trial_points", amount: 600, chance: 1.0 },
      { type: "abyssal_essence", amount: 20, chance: 0.5 },
      { type: "void_shard", amount: 10, chance: 0.3 },
    ],
    firstClearRewards: [
      { type: "credits", amount: 500000, chance: 1.0 },
      { type: "experience", amount: 50000, chance: 1.0 },
      { type: "trial_points", amount: 2000, chance: 1.0 },
      { type: "item", name: "Eternal Crown", description: "Crown of the eternal champion", amount: 1, chance: 1.0, rarity: "mythic" },
      { type: "item", name: "Eternal Blessing", description: "Blessing of the eternal realm", amount: 1, chance: 1.0, rarity: "mythic" },
      { type: "abyssal_essence", amount: 50, chance: 1.0 },
      { type: "void_shard", amount: 25, chance: 1.0 },
    ],
    timeBonus: [
      { underMinutes: 12, bonusMultiplier: 2.0 },
      { underMinutes: 18, bonusMultiplier: 1.5 },
      { underMinutes: 25, bonusMultiplier: 1.25 },
    ],
  },
];

export function getTrialTier(tier: number): TrialTier | undefined {
  return TRIAL_TIERS.find(t => t.tier === tier);
}

export function getTrialTiers(): TrialTier[] {
  return TRIAL_TIERS;
}

export function getMaxTier(): number {
  return TRIAL_TIERS.reduce((max, t) => Math.max(max, t.tier), 0);
}

export function calculateWaveDifficulty(playerPower: number, wave: TrialWave, tier: TrialTier): string {
  const effectivePower = playerPower / Math.max(tier.powerRequirement, 1);
  const ratio = effectivePower / Math.max(wave.enemyPower, 0.1);
  if (ratio >= 2.0) return "trivial";
  if (ratio >= 1.5) return "easy";
  if (ratio >= 1.0) return "moderate";
  if (ratio >= 0.75) return "challenging";
  if (ratio >= 0.5) return "hard";
  if (ratio >= 0.25) return "extreme";
  return "nightmare";
}

export function calculateTrialPoints(basePoints: number, tier: number, completionTimeMs: number, flawless: boolean): number {
  const tierMultiplier = 1 + (tier - 1) * 0.15;
  let timeBonus = 1.0;
  const config = getTrialTier(tier);
  if (config) {
    const minutes = completionTimeMs / 60000;
    for (const tb of config.timeBonus) {
      if (minutes <= tb.underMinutes) {
        timeBonus = Math.max(timeBonus, tb.bonusMultiplier);
      }
    }
  }
  const flawlessBonus = flawless ? 1.5 : 1.0;
  return Math.round(basePoints * tierMultiplier * timeBonus * flawlessBonus);
}
