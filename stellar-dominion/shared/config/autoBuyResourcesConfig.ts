/**
 * Auto-Buy Resources Configuration System
 * Manages automatic resource purchasing based on player-defined rules
 * @tag #market #resources #automation
 */

// ====================
// AUTO-BUY PRESETS
// ====================

export const AUTOBUY_PRESETS = {
  CONSERVATIVE: {
    name: "Conservative",
    description: "Low frequency, high thresholds",
    buyInterval: 3600, // 1 hour
    maxPriceMultiplier: 1.2,
    priorityResources: ["metal"],
    budgetPercentage: 0.1,
  },
  BALANCED: {
    name: "Balanced",
    description: "Medium frequency, moderate thresholds",
    buyInterval: 1800, // 30 minutes
    maxPriceMultiplier: 1.5,
    priorityResources: ["metal", "crystal"],
    budgetPercentage: 0.25,
  },
  AGGRESSIVE: {
    name: "Aggressive",
    description: "High frequency, low price tolerance",
    buyInterval: 600, // 10 minutes
    maxPriceMultiplier: 2.0,
    priorityResources: ["metal", "crystal", "deuterium"],
    budgetPercentage: 0.5,
  },
  EMERGENCY: {
    name: "Emergency",
    description: "Extreme frequency for critical resources",
    buyInterval: 180, // 3 minutes
    maxPriceMultiplier: 3.0,
    priorityResources: ["metal", "crystal", "deuterium", "energy"],
    budgetPercentage: 1.0,
  },
  RESEARCH_FOCUSED: {
    name: "Research Focused",
    description: "Prioritizes crystal for research",
    buyInterval: 1200, // 20 minutes
    maxPriceMultiplier: 1.8,
    priorityResources: ["crystal"],
    budgetPercentage: 0.6,
  },
  MILITARY_FOCUSED: {
    name: "Military Focused",
    description: "Prioritizes metal for military production",
    buyInterval: 900, // 15 minutes
    maxPriceMultiplier: 1.6,
    priorityResources: ["metal", "deuterium"],
    budgetPercentage: 0.4,
  },
} as const;

// ====================
// AUTO-BUY RULES
// ====================

export const AUTOBUY_TRIGGER_TYPES = {
  THRESHOLD: "threshold", // Buy when resource below threshold
  PRICE_BASED: "price_based", // Buy when price is good
  TIME_BASED: "time_based", // Buy on schedule
  EVENT_BASED: "event_based", // Buy on specific events
  HYBRID: "hybrid", // Combination of multiple triggers
} as const;

export const AUTOBUY_PRICE_STRATEGIES = {
  BEST_AVAILABLE: {
    name: "Best Available",
    strategy: "best_available",
    description: "Buy at lowest available price",
    maxWaitTime: 300, // 5 minutes
  },
  MARKET_AVERAGE: {
    name: "Market Average",
    strategy: "market_average",
    description: "Buy when price is below market average",
    discountThreshold: 0.1, // 10% below average
  },
  TREND_BASED: {
    name: "Trend Based",
    strategy: "trend_based",
    description: "Buy when price trend is favorable",
    trendWindow: 30, // minutes
    upwardTrendThreshold: 0.05, // 5% increase signals good buy
  },
  LOWEST_EVER: {
    name: "Lowest Ever",
    strategy: "lowest_ever",
    description: "Buy only at historical lowest prices",
    percentageOfLowest: 1.05, // 5% above all-time low
  },
  DYNAMIC: {
    name: "Dynamic",
    strategy: "dynamic",
    description: "Adjusts based on portfolio needs and budget",
    minBudgetPercentage: 0.05,
    maxBudgetPercentage: 0.95,
  },
} as const;

// ====================
// AUTO-BUY LIMITS
// ====================

export const AUTOBUY_LIMITS = {
  // Per-transaction limits
  MIN_PURCHASE: 100,
  MAX_PURCHASE_PER_TRANSACTION: 10000,

  // Daily limits
  MAX_DAILY_PURCHASES: 100,
  MAX_DAILY_EXPENDITURE: 100000,

  // Weekly limits
  MAX_WEEKLY_PURCHASES: 500,
  MAX_WEEKLY_EXPENDITURE: 500000,

  // Per-resource limits
  MAX_METAL_PER_TRANSACTION: 5000,
  MAX_CRYSTAL_PER_TRANSACTION: 3000,
  MAX_DEUTERIUM_PER_TRANSACTION: 2000,
  MAX_ENERGY_PER_TRANSACTION: 1000,

  // Inventory caps
  MAX_METAL_INVENTORY: 50000,
  MAX_CRYSTAL_INVENTORY: 30000,
  MAX_DEUTERIUM_INVENTORY: 20000,
  MAX_ENERGY_INVENTORY: 10000,

  // Price caps (multiplier vs market average)
  METAL_MAX_PRICE: 1.5,
  CRYSTAL_MAX_PRICE: 1.8,
  DEUTERIUM_MAX_PRICE: 2.0,
  ENERGY_MAX_PRICE: 2.5,
} as const;

// ====================
// SAFETY SYSTEMS
// ====================

export const AUTOBUY_SAFETY_FEATURES = {
  // Minimum balance required before auto-buy
  MIN_BALANCE_BEFORE_PURCHASE: 10000,

  // Maximum percentage of balance to spend
  MAX_SPEND_PERCENTAGE: 0.75,

  // Pause on consecutive failed purchases
  PAUSE_AFTER_FAILURES: 5,
  PAUSE_DURATION: 3600, // 1 hour

  // Emergency stop on price spike
  EMERGENCY_STOP_PRICE_INCREASE: 2.5, // 150% increase triggers stop
  EMERGENCY_STOP_DURATION: 1800, // 30 minutes

  // Fraud detection
  DETECT_SUSPICIOUS_OFFERS: true,
  SUSPICIOUS_OFFER_THRESHOLD: 0.5, // 50% below average

  // Blacklist on bad sellers
  BLACKLIST_AFTER_FAILED_PURCHASES: 3,
  BLACKLIST_DURATION: 7200, // 2 hours

  // Rate limiting
  MIN_TIME_BETWEEN_PURCHASES: 10, // seconds
  MAX_PURCHASES_PER_MINUTE: 30,
} as const;

// ====================
// AUTOBUY RULES CONFIG
// ====================

export interface AutoBuyRule {
  id: string;
  name: string;
  enabled: boolean;
  resource: "metal" | "crystal" | "deuterium" | "energy";
  triggerType: "threshold" | "price_based" | "time_based" | "event_based" | "hybrid";
  threshold?: number; // Resource level to trigger purchase
  maxPrice?: number; // Maximum price to accept
  buyAmount?: number; // Amount to buy per transaction
  priceStrategy: "best_available" | "market_average" | "trend_based" | "lowest_ever" | "dynamic";
  preset?: keyof typeof AUTOBUY_PRESETS;
  priority: number; // 1-10, higher = more important
  dailyLimit?: number;
  weeklyLimit?: number;
  cooldown?: number; // Seconds between purchases for this rule
}

export const DEFAULT_AUTOBUY_RULES: AutoBuyRule[] = [
  {
    id: "metal_standard",
    name: "Standard Metal Purchases",
    enabled: true,
    resource: "metal",
    triggerType: "threshold",
    threshold: 5000,
    maxPrice: 1.2,
    buyAmount: 2000,
    priceStrategy: "market_average",
    priority: 5,
    dailyLimit: 20000,
    cooldown: 300,
  },
  {
    id: "crystal_research",
    name: "Research Crystal Purchases",
    enabled: true,
    resource: "crystal",
    triggerType: "threshold",
    threshold: 3000,
    maxPrice: 1.4,
    buyAmount: 1000,
    priceStrategy: "market_average",
    priority: 7,
    dailyLimit: 10000,
    cooldown: 600,
  },
  {
    id: "deuterium_fuel",
    name: "Fuel Deuterium Purchases",
    enabled: true,
    resource: "deuterium",
    triggerType: "threshold",
    threshold: 2000,
    maxPrice: 1.6,
    buyAmount: 500,
    priceStrategy: "trend_based",
    priority: 6,
    dailyLimit: 5000,
    cooldown: 900,
  },
];

// ====================
// AUTOBUY STATUS & STATS
// ====================

export interface AutoBuySession {
  id: string;
  userId: string;
  active: boolean;
  pausedUntil?: number; // Timestamp when pause expires
  pausedReason?: string;
  totalSpent: number;
  totalPurchases: number;
  successfulPurchases: number;
  failedPurchases: number;
  lastPurchaseTime?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AutoBuyStatistics {
  totalPurchases: number;
  successfulPurchases: number;
  failedPurchases: number;
  totalSpent: number;
  averagePrice: number;
  bestDeal: number;
  worstDeal: number;
  savingsVsMarket: number;
  resourcesBought: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  lastPurchaseTime?: number;
  lastFailureTime?: number;
}

// ====================
// SELLER QUALITY SYSTEM
// ====================

export interface SellerProfile {
  sellerId: string;
  totalSales: number;
  failedDeliveries: number;
  successRate: number; // 0-1
  averagePrice: number;
  reputation: number; // 1-10
  blacklistedUntil?: number; // Timestamp
  qualityRating: "excellent" | "good" | "average" | "poor" | "blacklisted";
}

export const SELLER_QUALITY_THRESHOLDS = {
  EXCELLENT: {
    minSuccessRate: 0.98,
    minReputation: 8,
    priceMultiplier: 0.95, // Trust premium - slightly lower prices
  },
  GOOD: {
    minSuccessRate: 0.95,
    minReputation: 6,
    priceMultiplier: 1.0,
  },
  AVERAGE: {
    minSuccessRate: 0.85,
    minReputation: 4,
    priceMultiplier: 1.05,
  },
  POOR: {
    minSuccessRate: 0.0,
    minReputation: 0,
    priceMultiplier: 1.1,
  },
} as const;

// ====================
// MARKET ANALYSIS
// ====================

export interface ResourceMarketAnalysis {
  resource: "metal" | "crystal" | "deuterium" | "energy";
  currentPrice: number;
  marketAverage: number;
  medianPrice: number;
  lowestPrice: number;
  highestPrice: number;
  pricePercentile: number; // 0-100
  trendDirection: "up" | "down" | "stable";
  trendStrength: number; // 0-1
  buyRecommendation: "buy" | "hold" | "sell";
  confidenceLevel: number; // 0-1
  volatility: number; // 0-1, 0 = stable, 1 = very volatile
  supplies: number;
  demand: number;
  supplyDemandRatio: number;
}

// ====================
// NOTIFICATION SYSTEM
// ====================

export const AUTOBUY_NOTIFICATION_TYPES = {
  PURCHASE_SUCCESS: "purchase_success",
  PURCHASE_FAILED: "purchase_failed",
  RULE_TRIGGERED: "rule_triggered",
  SESSION_PAUSED: "session_paused",
  SESSION_RESUMED: "session_resumed",
  DAILY_LIMIT_REACHED: "daily_limit_reached",
  WEEKLY_LIMIT_REACHED: "weekly_limit_reached",
  PRICE_SPIKE_ALERT: "price_spike_alert",
  BARGAIN_ALERT: "bargain_alert",
  SELLER_BLACKLISTED: "seller_blacklisted",
} as const;

// ====================
// UTILITY FUNCTIONS
// ====================

/**
 * Calculate optimal buy amount based on budget and current price
 */
export function calculateOptimalBuyAmount(
  budget: number,
  resourcePrice: number,
  maxTransaction: number,
  minTransaction: number = AUTOBUY_LIMITS.MIN_PURCHASE
): number {
  const baseBuyAmount = Math.floor(budget / resourcePrice);
  const optimalAmount = Math.min(baseBuyAmount, maxTransaction);
  return Math.max(optimalAmount, minTransaction);
}

/**
 * Get quality rating for a seller
 */
export function getSellerQualityRating(
  successRate: number,
  reputation: number
): SellerProfile["qualityRating"] {
  if (successRate >= SELLER_QUALITY_THRESHOLDS.EXCELLENT.minSuccessRate &&
      reputation >= SELLER_QUALITY_THRESHOLDS.EXCELLENT.minReputation) {
    return "excellent";
  }
  if (successRate >= SELLER_QUALITY_THRESHOLDS.GOOD.minSuccessRate &&
      reputation >= SELLER_QUALITY_THRESHOLDS.GOOD.minReputation) {
    return "good";
  }
  if (successRate >= SELLER_QUALITY_THRESHOLDS.AVERAGE.minSuccessRate &&
      reputation >= SELLER_QUALITY_THRESHOLDS.AVERAGE.minReputation) {
    return "average";
  }
  return "poor";
}

/**
 * Determine if price is good for purchase
 */
export function isPriceGood(
  currentPrice: number,
  marketAverage: number,
  strategy: "best_available" | "market_average" | "trend_based" | "lowest_ever" | "dynamic",
  maxPrice: number
): boolean {
  if (currentPrice > maxPrice) return false;

  switch (strategy) {
    case "best_available":
      return currentPrice <= marketAverage * 1.1; // Within 10% of average
    case "market_average":
      return currentPrice <= marketAverage;
    case "trend_based":
      return currentPrice <= marketAverage * 0.95;
    case "lowest_ever":
      return currentPrice <= marketAverage * 0.9;
    case "dynamic":
      return currentPrice <= marketAverage * 1.2;
    default:
      return false;
  }
}

/**
 * Calculate savings vs market average
 */
export function calculateSavings(
  purchasePrice: number,
  marketAverage: number,
  quantity: number
): number {
  const marketCost = marketAverage * quantity;
  const actualCost = purchasePrice * quantity;
  return marketCost - actualCost;
}

export const AUTOBUY_RESOURCES_CONFIG = {
  PRESETS: AUTOBUY_PRESETS,
  TRIGGER_TYPES: AUTOBUY_TRIGGER_TYPES,
  PRICE_STRATEGIES: AUTOBUY_PRICE_STRATEGIES,
  LIMITS: AUTOBUY_LIMITS,
  SAFETY_FEATURES: AUTOBUY_SAFETY_FEATURES,
  NOTIFICATION_TYPES: AUTOBUY_NOTIFICATION_TYPES,
  SELLER_QUALITY_THRESHOLDS,
  DEFAULT_RULES: DEFAULT_AUTOBUY_RULES,
} as const;

export default AUTOBUY_RESOURCES_CONFIG;
