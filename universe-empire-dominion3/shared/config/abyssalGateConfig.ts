// Abyssal Contract Token System
// Used for Abyssal Gates - special raid content with unique rewards
// Tiers 1-9, 125 tokens per gate, 6900 max for chest

export interface AbyssalGateTier {
  tier: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tokensPerGate: number;
  maxTokensForChest: number;
  powerRequirement: number;
  gateDifficulty: "easy" | "medium" | "hard" | "extreme" | "nightmare";
  rewards: AbyssalReward[];
  chestRewards: AbyssalChestReward[];
}

export interface AbyssalReward {
  type: "credits" | "metal" | "crystal" | "deuterium" | "experience" | "abyssal_essence" | "void_shard";
  amount: number;
  chance: number;
}

export interface AbyssalChestReward {
  type: "item" | "tokens" | "resources" | "blueprint" | "abyssal_key" | "void_fragment" | "void_shard";
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic" | "abyssal";
  amount: number;
  chance: number;
  itemId?: string;
}

export const ABYSSAL_GATE_TIERS: AbyssalGateTier[] = [
  {
    tier: 1,
    name: "Lesser Abyssal Gate",
    description: "A weak dimensional rift. Entry-level abyssal content for new explorers.",
    icon: "🌀",
    color: "text-gray-400",
    tokensPerGate: 125,
    maxTokensForChest: 6900,
    powerRequirement: 2000,
    gateDifficulty: "easy",
    rewards: [
      { type: "credits", amount: 8000, chance: 1.0 },
      { type: "metal", amount: 3000, chance: 0.9 },
      { type: "crystal", amount: 1500, chance: 0.7 },
      { type: "deuterium", amount: 800, chance: 0.5 },
      { type: "experience", amount: 200, chance: 1.0 },
      { type: "abyssal_essence", amount: 5, chance: 0.3 },
    ],
    chestRewards: [
      { type: "item", name: "Abyssal Shard", description: "A fragment of abyssal energy", rarity: "common", amount: 5, chance: 0.9 },
      { type: "tokens", name: "Abyssal Tokens", description: "Bonus tokens for future gates", rarity: "common", amount: 300, chance: 0.7 },
      { type: "resources", name: "Abyssal Resource Cache", description: "Resources infused with abyssal energy", rarity: "rare", amount: 15000, chance: 0.5 },
      { type: "void_shard", name: "Void Shard", description: "Crystallized void energy", rarity: "rare", amount: 3, chance: 0.3 },
      { type: "blueprint", name: "Abyssal Armor Fragment", description: "Partial armor design", rarity: "epic", amount: 1, chance: 0.1 },
    ],
  },
  {
    tier: 3,
    name: "Abyssal Gate",
    description: "A stable dimensional rift. Standard abyssal combat and rewards.",
    icon: "🔵",
    color: "text-blue-400",
    tokensPerGate: 125,
    maxTokensForChest: 6900,
    powerRequirement: 8000,
    gateDifficulty: "medium",
    rewards: [
      { type: "credits", amount: 25000, chance: 1.0 },
      { type: "metal", amount: 12000, chance: 1.0 },
      { type: "crystal", amount: 6000, chance: 0.8 },
      { type: "deuterium", amount: 3000, chance: 0.6 },
      { type: "experience", amount: 500, chance: 1.0 },
      { type: "abyssal_essence", amount: 15, chance: 0.5 },
      { type: "void_shard", amount: 2, chance: 0.2 },
    ],
    chestRewards: [
      { type: "item", name: "Greater Abyssal Shard", description: "Concentrated abyssal energy", rarity: "rare", amount: 8, chance: 0.8 },
      { type: "tokens", name: "Abyssal Tokens", description: "Bonus tokens for future gates", rarity: "rare", amount: 500, chance: 0.6 },
      { type: "resources", name: "Abyssal Treasure Hoard", description: "Large resource bundle", rarity: "epic", amount: 50000, chance: 0.4 },
      { type: "void_fragment", name: "Void Fragment", description: "Piece of the void dimension", rarity: "epic", amount: 2, chance: 0.25 },
      { type: "blueprint", name: "Abyssal Weapon Blueprint", description: "Weapon design from the abyss", rarity: "legendary", amount: 1, chance: 0.08 },
      { type: "abyssal_key", name: "Abyssal Key", description: "Opens deeper gate layers", rarity: "legendary", amount: 1, chance: 0.03 },
    ],
  },
  {
    tier: 6,
    name: "Greater Abyssal Gate",
    description: "A powerful dimensional rift. High-tier abyssal content with valuable rewards.",
    icon: "🟣",
    color: "text-purple-500",
    tokensPerGate: 125,
    maxTokensForChest: 6900,
    powerRequirement: 25000,
    gateDifficulty: "hard",
    rewards: [
      { type: "credits", amount: 75000, chance: 1.0 },
      { type: "metal", amount: 35000, chance: 1.0 },
      { type: "crystal", amount: 20000, chance: 0.9 },
      { type: "deuterium", amount: 10000, chance: 0.7 },
      { type: "experience", amount: 1500, chance: 1.0 },
      { type: "abyssal_essence", amount: 40, chance: 0.6 },
      { type: "void_shard", amount: 5, chance: 0.35 },
    ],
    chestRewards: [
      { type: "item", name: "Superior Abyssal Shard", description: "Pure abyssal crystallization", rarity: "epic", amount: 12, chance: 0.7 },
      { type: "tokens", name: "Greater Abyssal Tokens", description: "Premium tokens", rarity: "epic", amount: 800, chance: 0.5 },
      { type: "resources", name: "Abyssal Vault Cache", description: "Massive resource bundle", rarity: "legendary", amount: 200000, chance: 0.3 },
      { type: "void_fragment", name: "Greater Void Fragment", description: "Stable void energy", rarity: "legendary", amount: 5, chance: 0.2 },
      { type: "blueprint", name: "Abyssal Battleship Blueprint", description: "Capital ship design", rarity: "mythic", amount: 1, chance: 0.05 },
      { type: "abyssal_key", name: "Deep Abyss Key", description: "Opens the deepest gates", rarity: "mythic", amount: 1, chance: 0.02 },
    ],
  },
  {
    tier: 9,
    name: "Eternal Abyssal Gate",
    description: "The deepest dimensional rift. Mythic-tier content with legendary rewards.",
    icon: "⚫",
    color: "text-red-500",
    tokensPerGate: 125,
    maxTokensForChest: 6900,
    powerRequirement: 75000,
    gateDifficulty: "nightmare",
    rewards: [
      { type: "credits", amount: 200000, chance: 1.0 },
      { type: "metal", amount: 100000, chance: 1.0 },
      { type: "crystal", amount: 60000, chance: 1.0 },
      { type: "deuterium", amount: 30000, chance: 0.9 },
      { type: "experience", amount: 5000, chance: 1.0 },
      { type: "abyssal_essence", amount: 100, chance: 0.8 },
      { type: "void_shard", amount: 15, chance: 0.5 },
    ],
    chestRewards: [
      { type: "item", name: "Eternal Abyssal Crystal", description: "Perfect abyssal crystallization", rarity: "mythic", amount: 20, chance: 0.6 },
      { type: "tokens", name: "Eternal Abyssal Tokens", description: "Highest tier tokens", rarity: "mythic", amount: 1500, chance: 0.4 },
      { type: "resources", name: "Abyssal Treasury", description: "Enormous resource bundle", rarity: "mythic", amount: 1000000, chance: 0.25 },
      { type: "void_fragment", name: "Eternal Void Core", description: "Concentrated void energy", rarity: "abyssal", amount: 10, chance: 0.15 },
      { type: "blueprint", name: "Abyssal Titan Blueprint", description: "Titan-class ship design", rarity: "abyssal", amount: 1, chance: 0.03 },
      { type: "abyssal_key", name: "Void Sovereign Key", description: "Opens the Void Sovereign raid", rarity: "abyssal", amount: 1, chance: 0.01 },
    ],
  },
];

// Helper functions
export function getAbyssalGateTier(tier: number): AbyssalGateTier | undefined {
  return ABYSSAL_GATE_TIERS.find(t => t.tier === tier);
}

export function calculateAbyssalTokensEarned(gateCount: number, tier: number): number {
  const gate = getAbyssalGateTier(tier);
  if (!gate) return 0;
  return Math.min(gateCount * gate.tokensPerGate, gate.maxTokensForChest);
}

export function canOpenAbyssalChest(tokens: number, tier: number): boolean {
  const gate = getAbyssalGateTier(tier);
  if (!gate) return false;
  return tokens >= gate.maxTokensForChest;
}

export function rollAbyssalChestRewards(tier: number): AbyssalChestReward[] {
  const gate = getAbyssalGateTier(tier);
  if (!gate) return [];
  
  const rewards: AbyssalChestReward[] = [];
  for (const reward of gate.chestRewards) {
    if (Math.random() < reward.chance) {
      rewards.push({ ...reward });
    }
  }
  return rewards;
}

export function rollAbyssalGateRewards(tier: number): AbyssalReward[] {
  const gate = getAbyssalGateTier(tier);
  if (!gate) return [];
  
  const rewards: AbyssalReward[] = [];
  for (const reward of gate.rewards) {
    if (Math.random() < reward.chance) {
      rewards.push({ ...reward });
    }
  }
  return rewards;
}

export function getAbyssalDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy": return "text-gray-400";
    case "medium": return "text-blue-400";
    case "hard": return "text-purple-500";
    case "extreme": return "text-orange-500";
    case "nightmare": return "text-red-500";
    default: return "text-gray-400";
  }
}
