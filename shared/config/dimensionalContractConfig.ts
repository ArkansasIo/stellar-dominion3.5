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
