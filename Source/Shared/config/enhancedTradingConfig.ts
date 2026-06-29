export type BlueprintRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type TradeContractType = "instant" | "escrow" | "recurring" | "bundle";
export type TradeContractStatus = "active" | "completed" | "cancelled" | "expired" | "disputed";

export interface BlueprintListing {
  id: string;
  sellerId: string;
  sellerName: string;
  blueprintId: string;
  blueprintName: string;
  blueprintCategory: string;
  rarity: BlueprintRarity;
  level: number;
  quantity: number;
  pricePerUnit: number;
  currency: "credits" | "dark_matter";
  description: string;
  stats: BlueprintStats;
  listedAt: string;
  expiresAt: string;
  status: "active" | "sold" | "expired" | "cancelled";
}

export interface BlueprintStats {
  attack?: number;
  defense?: number;
  health?: number;
  speed?: number;
  efficiency?: number;
  special?: string;
}

export interface TradeContract {
  id: string;
  creatorId: string;
  creatorName: string;
  counterpartyId?: string;
  counterpartyName?: string;
  type: TradeContractType;
  status: TradeContractStatus;
  offering: TradeItem[];
  requesting: TradeItem[];
  totalPrice: number;
  currency: "credits" | "dark_matter";
  message: string;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
  recurringInterval?: number;
  recurringCount?: number;
  recurringCompleted?: number;
}

export interface TradeItem {
  type: "resource" | "blueprint" | "item" | "research" | "currency";
  itemId: string;
  name: string;
  quantity: number;
  rarity?: BlueprintRarity;
  stats?: Record<string, number>;
}

export interface MarketTrend {
  resource: string;
  currentPrice: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  averagePrice: number;
}

export interface TradeReputation {
  playerId: string;
  playerName: string;
  totalTrades: number;
  successfulTrades: number;
  disputedTrades: number;
  averageRating: number;
  trustLevel: "untrusted" | "newcomer" | "established" | "trusted" | "elite";
  specializations: string[];
  lastTradeAt: string;
}

export const BLUEPRINT_TRADE_CATEGORIES = [
  "Ship Hulls", "Weapons", "Shield Modules", "Engine Systems",
  "Cargo Holds", "Habitat Modules", "Mining Equipment", "Research Labs",
  "Defense Platforms", "Megastructure Components", "Fleet Command",
  "Ground Units", "Orbital Stations", "Warp Drives", "Cloaking Devices",
] as const;

export const RARITY_MULTIPLIERS: Record<BlueprintRarity, number> = {
  common: 1,
  uncommon: 1.5,
  rare: 3,
  epic: 7,
  legendary: 15,
  mythic: 50,
};

export const TRUST_LEVELS: Record<string, { minTrades: number; minRating: number; label: string }> = {
  untrusted: { minTrades: 0, minRating: 0, label: "Untrusted" },
  newcomer: { minTrades: 1, minRating: 2, label: "Newcomer" },
  established: { minTrades: 10, minRating: 3, label: "Established" },
  trusted: { minTrades: 50, minRating: 4, label: "Trusted" },
  elite: { minTrades: 200, minRating: 4.5, label: "Elite" },
};

export const TRADE_FEE_RATES = {
  blueprintSale: 0.05,
  resourceSale: 0.03,
  contractFee: 0.02,
  premiumListing: 0.1,
  instantTrade: 0.08,
};

export const MARKET_ANALYTICS_CONFIG = {
  priceHistoryIntervalMinutes: 60,
  trendCalculationDays: 7,
  maxPriceHistory: 1000,
  volatilityThreshold: 0.15,
  hotItemThreshold: 10,
};

export function calculateBlueprintValue(blueprint: { rarity: BlueprintRarity; level: number; stats: BlueprintStats }): number {
  const rarityMult = RARITY_MULTIPLIERS[blueprint.rarity] || 1;
  const levelMult = 1 + (blueprint.level - 1) * 0.1;
  const statsBonus = Object.values(blueprint.stats).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0) * 0.5;
  return Math.floor(1000 * rarityMult * levelMult + statsBonus);
}

export function calculateTradeFee(amount: number, feeRate: number): number {
  return Math.floor(amount * feeRate);
}

export function calculateTrustLevel(trades: number, rating: number): string {
  if (trades >= 200 && rating >= 4.5) return "elite";
  if (trades >= 50 && rating >= 4) return "trusted";
  if (trades >= 10 && rating >= 3) return "established";
  if (trades >= 1 && rating >= 2) return "newcomer";
  return "untrusted";
}

export function calculateListingPrice(baseValue: number, supply: number, demand: number): number {
  const supplyDemandRatio = supply > 0 ? demand / supply : 2;
  const adjusted = baseValue * Math.max(0.5, Math.min(3, supplyDemandRatio));
  return Math.floor(adjusted);
}
