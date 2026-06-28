// Dimensional Contract Token System
// Used for raids - Tier 1 and Tier 9 contracts
// 125 tokens per raid, 6900 max for chest rewards

export interface DimensionalContractTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerRaid: number;
  maxTokensForChest: number;
  raidPowerRequirement: number;
  rewards: ContractReward[];
  chestRewards: ChestReward[];
}

export interface ContractReward {
  type: "credits" | "metal" | "crystal" | "deuterium" | "experience" | "item";
  amount: number;
  chance: number; // 0-1 probability
  itemId?: string;
}

export interface ChestReward {
  type: "item" | "tokens" | "resources" | "blueprint";
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  amount: number;
  chance: number;
  itemId?: string;
}

export const DIMENSIONAL_CONTRACT_TIERS: DimensionalContractTier[] = [
  {
    tier: 1,
    name: "Initiate Contract",
    description: "Entry-level dimensional contracts for new raiders. Basic rewards and modest chest contents.",
    icon: "📜",
    color: "text-gray-400",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 1000,
    rewards: [
      { type: "credits", amount: 5000, chance: 1.0 },
      { type: "metal", amount: 2000, chance: 0.8 },
      { type: "crystal", amount: 1000, chance: 0.6 },
      { type: "deuterium", amount: 500, chance: 0.4 },
      { type: "experience", amount: 150, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Dimensional Shard", description: "A fragment of dimensional energy", rarity: "common", amount: 3, chance: 0.9 },
      { type: "tokens", name: "Contract Tokens", description: "Bonus tokens for future raids", rarity: "common", amount: 250, chance: 0.7 },
      { type: "resources", name: "Resource Cache", description: "A bundle of mixed resources", rarity: "rare", amount: 10000, chance: 0.5 },
      { type: "blueprint", name: "Initiate Armor Blueprint", description: "Basic armor design", rarity: "rare", amount: 1, chance: 0.3 },
      { type: "item", name: "Dimensional Core Fragment", description: "Used in advanced crafting", rarity: "epic", amount: 1, chance: 0.1 },
    ],
  },
  {
    tier: 2,
    name: "Apprentice Contract",
    description: "Dim contracts for budding raiders. Growing rewards and improved chest contents.",
    icon: "🔷",
    color: "text-blue-400",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 2500,
    rewards: [
      { type: "credits", amount: 7500, chance: 1.0 },
      { type: "metal", amount: 3000, chance: 0.85 },
      { type: "crystal", amount: 1500, chance: 0.65 },
      { type: "deuterium", amount: 750, chance: 0.45 },
      { type: "experience", amount: 225, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Apprentice Dimensional Shard", description: "A refined dimensional fragment", rarity: "common", amount: 4, chance: 0.85 },
      { type: "tokens", name: "Apprentice Contract Tokens", description: "Bonus tokens for future raids", rarity: "common", amount: 300, chance: 0.65 },
      { type: "resources", name: "Apprentice Resource Cache", description: "A bundle of mixed resources", rarity: "rare", amount: 20000, chance: 0.45 },
      { type: "blueprint", name: "Apprentice Armor Blueprint", description: "Improved armor design", rarity: "rare", amount: 1, chance: 0.25 },
      { type: "item", name: "Dimensional Core Fragment", description: "Used in advanced crafting", rarity: "epic", amount: 1, chance: 0.12 },
    ],
  },
  {
    tier: 3,
    name: "Journeyman Contract",
    description: "Solid dimensional contracts for experienced raiders. Consistent rewards and rare chest contents.",
    icon: "🟦",
    color: "text-blue-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 5000,
    rewards: [
      { type: "credits", amount: 15000, chance: 1.0 },
      { type: "metal", amount: 6000, chance: 0.9 },
      { type: "crystal", amount: 3000, chance: 0.7 },
      { type: "deuterium", amount: 1500, chance: 0.5 },
      { type: "experience", amount: 450, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Journeyman Dimensional Shard", description: "A potent dimensional fragment", rarity: "common", amount: 5, chance: 0.8 },
      { type: "tokens", name: "Journeyman Contract Tokens", description: "Bonus tokens for future raids", rarity: "rare", amount: 400, chance: 0.6 },
      { type: "resources", name: "Journeyman Resource Cache", description: "A bundle of mixed resources", rarity: "rare", amount: 40000, chance: 0.4 },
      { type: "blueprint", name: "Journeyman Armor Blueprint", description: "Intermediate armor design", rarity: "rare", amount: 1, chance: 0.2 },
      { type: "item", name: "Dimensional Core Fragment", description: "Used in advanced crafting", rarity: "epic", amount: 2, chance: 0.15 },
    ],
  },
  {
    tier: 4,
    name: "Adept Contract",
    description: "Advanced dimensional contracts for skilled raiders. Substantial rewards and valuable chest contents.",
    icon: "🟢",
    color: "text-green-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 8000,
    rewards: [
      { type: "credits", amount: 25000, chance: 1.0 },
      { type: "metal", amount: 10000, chance: 0.9 },
      { type: "crystal", amount: 5000, chance: 0.75 },
      { type: "deuterium", amount: 2500, chance: 0.55 },
      { type: "experience", amount: 750, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Adept Dimensional Shard", description: "A powerful dimensional fragment", rarity: "rare", amount: 6, chance: 0.75 },
      { type: "tokens", name: "Adept Contract Tokens", description: "Bonus tokens for future raids", rarity: "rare", amount: 500, chance: 0.55 },
      { type: "resources", name: "Adept Resource Cache", description: "A bundle of valuable resources", rarity: "rare", amount: 75000, chance: 0.35 },
      { type: "blueprint", name: "Adept Armor Blueprint", description: "Advanced armor design", rarity: "epic", amount: 1, chance: 0.18 },
      { type: "item", name: "Dimensional Core", description: "Used in high-level crafting", rarity: "epic", amount: 1, chance: 0.1 },
    ],
  },
  {
    tier: 5,
    name: "Expert Contract",
    description: "High-tier dimensional contracts for expert raiders. Rich rewards and rare chest contents.",
    icon: "🟣",
    color: "text-purple-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 12000,
    rewards: [
      { type: "credits", amount: 40000, chance: 1.0 },
      { type: "metal", amount: 16000, chance: 0.95 },
      { type: "crystal", amount: 8000, chance: 0.8 },
      { type: "deuterium", amount: 4000, chance: 0.6 },
      { type: "experience", amount: 1200, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Expert Dimensional Shard", description: "A refined powerful dimensional fragment", rarity: "rare", amount: 7, chance: 0.7 },
      { type: "tokens", name: "Expert Contract Tokens", description: "Premium bonus tokens", rarity: "rare", amount: 650, chance: 0.5 },
      { type: "resources", name: "Expert Resource Cache", description: "A bundle of premium resources", rarity: "epic", amount: 150000, chance: 0.3 },
      { type: "blueprint", name: "Expert Armor Blueprint", description: "Expert armor design", rarity: "epic", amount: 1, chance: 0.15 },
      { type: "item", name: "Greater Dimensional Core", description: "Used in expert crafting recipes", rarity: "epic", amount: 1, chance: 0.08 },
      { type: "item", name: "Void Crystal", description: "A rare crystalline formation", rarity: "legendary", amount: 1, chance: 0.03 },
    ],
  },
  {
    tier: 6,
    name: "Master Contract",
    description: "Elite dimensional contracts for master raiders. Excellent rewards and epic chest contents.",
    icon: "🟠",
    color: "text-orange-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 18000,
    rewards: [
      { type: "credits", amount: 60000, chance: 1.0 },
      { type: "metal", amount: 24000, chance: 1.0 },
      { type: "crystal", amount: 12000, chance: 0.85 },
      { type: "deuterium", amount: 6000, chance: 0.65 },
      { type: "experience", amount: 1800, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Master Dimensional Shard", description: "A highly concentrated dimensional fragment", rarity: "epic", amount: 8, chance: 0.65 },
      { type: "tokens", name: "Master Contract Tokens", description: "Premium bonus tokens", rarity: "epic", amount: 750, chance: 0.45 },
      { type: "resources", name: "Master Resource Cache", description: "A bundle of elite resources", rarity: "epic", amount: 300000, chance: 0.25 },
      { type: "blueprint", name: "Master Armor Blueprint", description: "Master-level armor design", rarity: "legendary", amount: 1, chance: 0.12 },
      { type: "item", name: "Superior Dimensional Core", description: "Used in master crafting recipes", rarity: "legendary", amount: 1, chance: 0.06 },
      { type: "item", name: "Void Crystal Cluster", description: "A cluster of rare void crystals", rarity: "legendary", amount: 1, chance: 0.02 },
    ],
  },
  {
    tier: 7,
    name: "Grandmaster Contract",
    description: "Legendary dimensional contracts for grandmaster raiders. Outstanding rewards and legendary chest contents.",
    icon: "🔴",
    color: "text-red-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 25000,
    rewards: [
      { type: "credits", amount: 90000, chance: 1.0 },
      { type: "metal", amount: 36000, chance: 1.0 },
      { type: "crystal", amount: 18000, chance: 0.9 },
      { type: "deuterium", amount: 9000, chance: 0.7 },
      { type: "experience", amount: 2700, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Grandmaster Dimensional Shard", description: "Pure distilled dimensional energy", rarity: "epic", amount: 9, chance: 0.6 },
      { type: "tokens", name: "Grandmaster Contract Tokens", description: "Elite bonus tokens", rarity: "epic", amount: 850, chance: 0.4 },
      { type: "resources", name: "Grandmaster Resource Cache", description: "A bundle of legendary resources", rarity: "legendary", amount: 500000, chance: 0.2 },
      { type: "blueprint", name: "Grandmaster Armor Blueprint", description: "Grandmaster armor design", rarity: "legendary", amount: 1, chance: 0.1 },
      { type: "item", name: "Grandmaster's Relic", description: "A legendary artifact", rarity: "legendary", amount: 1, chance: 0.05 },
      { type: "item", name: "Void Essence", description: "Raw essence from the void", rarity: "mythic", amount: 1, chance: 0.015 },
    ],
  },
  {
    tier: 8,
    name: "Transcendent Contract",
    description: "Near-mythic dimensional contracts. Phenomenal rewards and unparalleled chest contents.",
    icon: "💎",
    color: "text-amber-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 35000,
    rewards: [
      { type: "credits", amount: 125000, chance: 1.0 },
      { type: "metal", amount: 50000, chance: 1.0 },
      { type: "crystal", amount: 25000, chance: 0.95 },
      { type: "deuterium", amount: 12500, chance: 0.75 },
      { type: "experience", amount: 3750, chance: 1.0 },
    ],
    chestRewards: [
      { type: "item", name: "Transcendent Dimensional Shard", description: "Transcendent dimensional crystallization", rarity: "legendary", amount: 10, chance: 0.55 },
      { type: "tokens", name: "Transcendent Contract Tokens", description: "Supreme bonus tokens", rarity: "legendary", amount: 1000, chance: 0.35 },
      { type: "resources", name: "Transcendent Resource Cache", description: "A bundle of phenomenal resources", rarity: "legendary", amount: 800000, chance: 0.15 },
      { type: "blueprint", name: "Transcendent Armor Blueprint", description: "Transcendent armor design", rarity: "legendary", amount: 1, chance: 0.08 },
      { type: "item", name: "Dimensional Keystone", description: "Key to unlocking deeper dimensions", rarity: "legendary", amount: 1, chance: 0.04 },
      { type: "item", name: "Void Essence", description: "Raw essence from the void", rarity: "mythic", amount: 2, chance: 0.02 },
    ],
  },
  {
    tier: 9,
    name: "Eternal Contract",
    description: "The highest tier of dimensional contracts. Legendary rewards and mythic chest contents.",
    icon: "⭐",
    color: "text-yellow-500",
    tokensPerRaid: 125,
    maxTokensForChest: 6900,
    raidPowerRequirement: 50000,
    rewards: [
      { type: "credits", amount: 100000, chance: 1.0 },
      { type: "metal", amount: 50000, chance: 1.0 },
      { type: "crystal", amount: 30000, chance: 0.9 },
      { type: "deuterium", amount: 15000, chance: 0.8 },
      { type: "experience", amount: 5000, chance: 1.0 },
      { type: "item", itemId: "void_essence", amount: 2, chance: 0.3 },
    ],
    chestRewards: [
      { type: "item", name: "Eternal Dimensional Shard", description: "Pure dimensional energy crystallized", rarity: "legendary", amount: 10, chance: 0.8 },
      { type: "tokens", name: "Eternal Contract Tokens", description: "Premium tokens for future raids", rarity: "legendary", amount: 1000, chance: 0.6 },
      { type: "resources", name: "Eternal Resource Cache", description: "Massive resource bundle", rarity: "mythic", amount: 500000, chance: 0.4 },
      { type: "blueprint", name: "Eternal Armor Blueprint", description: "Legendary armor design", rarity: "mythic", amount: 1, chance: 0.2 },
      { type: "item", name: "Dimensional Rift Key", description: "Opens portal to bonus raid", rarity: "mythic", amount: 1, chance: 0.05 },
      { type: "item", name: "Void Titan Fragment", description: "Fragment of the Void Titan boss", rarity: "mythic", amount: 1, chance: 0.01 },
    ],
  },
];

// Helper functions
export function getContractTier(tier: number): DimensionalContractTier | undefined {
  return DIMENSIONAL_CONTRACT_TIERS.find(t => t.tier === tier);
}

export function calculateTokensEarned(raidCount: number, tier: number): number {
  const contract = getContractTier(tier);
  if (!contract) return 0;
  return Math.min(raidCount * contract.tokensPerRaid, contract.maxTokensForChest);
}

export function canOpenChest(tokens: number, tier: number): boolean {
  const contract = getContractTier(tier);
  if (!contract) return false;
  return tokens >= contract.maxTokensForChest;
}

export function rollChestRewards(tier: number): ChestReward[] {
  const contract = getContractTier(tier);
  if (!contract) return [];
  
  const rewards: ChestReward[] = [];
  for (const reward of contract.chestRewards) {
    if (Math.random() < reward.chance) {
      rewards.push({ ...reward });
    }
  }
  return rewards;
}

export function rollRaidRewards(tier: number): ContractReward[] {
  const contract = getContractTier(tier);
  if (!contract) return [];
  
  const rewards: ContractReward[] = [];
  for (const reward of contract.rewards) {
    if (Math.random() < reward.chance) {
      rewards.push({ ...reward });
    }
  }
  return rewards;
}
