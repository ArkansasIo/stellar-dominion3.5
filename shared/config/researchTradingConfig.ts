/**
 * Research Trading System Configuration
 * Enables player-to-player trading of research progress, XP, and technology
 */

export interface ResearchTrade {
  id: string;
  initiatorId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  initiatorOffer: {
    researchIds: string[];
    xpAmount: number;
    credits: number;
  };
  recipientOffer: {
    researchIds: string[];
    xpAmount: number;
    credits: number;
  };
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

export interface TradeOffer {
  researchIds: string[];
  xpAmount: number;
  credits: number;
  tech?: string[];
  resources?: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
  };
}

export interface TradeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TradeRating {
  traderId: string;
  rating: number; // 1-5
  reviewCount: number;
  completedTrades: number;
  fairnessScore: number;
  trustScore: number;
}

export interface TradeStatistics {
  totalTrades: number;
  completedTrades: number;
  totalXpTraded: number;
  totalCreditsTraded: number;
  averageTradeValue: number;
  successRate: number;
  lastTradeDate: Date;
}

// Trade request types and validation rules
export const TRADE_REQUEST_TYPES = {
  RESEARCH_FOR_RESEARCH: 'research_for_research',
  RESEARCH_FOR_XP: 'research_for_xp',
  RESEARCH_FOR_CREDITS: 'research_for_credits',
  XP_FOR_CREDITS: 'xp_for_credits',
  TECH_PACKAGE: 'tech_package',
  BULK_TRADE: 'bulk_trade',
  MILESTONE_TRADE: 'milestone_trade',
} as const;

export type TradeRequestType = typeof TRADE_REQUEST_TYPES[keyof typeof TRADE_REQUEST_TYPES];

// Trade limits and constraints
export const TRADE_LIMITS = {
  MAX_TRADES_PER_DAY: 10,
  MAX_PENDING_TRADES: 5,
  MAX_XP_PER_TRADE: 50000,
  MAX_CREDITS_PER_TRADE: 1000000,
  MIN_RESEARCH_DAYS_OLD: 3, // Can't trade research done within last 3 days
  TRADE_EXPIRATION_HOURS: 48,
  COOLDOWN_BETWEEN_TRADES_MINUTES: 5,
  MIN_ACCOUNT_AGE_DAYS: 7, // Account must be 7+ days old to trade
  MIN_PLAYER_LEVEL: 5,
};

// Trade fees
export const TRADE_FEES = {
  XP_TRANSFER_FEE_PERCENT: 0.05, // 5% fee on XP transfers
  CREDIT_TRANSFER_FEE_PERCENT: 0.03, // 3% fee on credit transfers
  TRADE_REQUEST_POSTING_FEE: 100, // Credits to post a trade request
};

// Trade validation rules
export const TRADE_VALIDATION_RULES = {
  MIN_RESEARCH_VALUE: 100,
  MAX_IMBALANCE_RATIO: 1.5, // Offer can't be more than 1.5x of counter-offer
  REQUIRE_MUTUAL_AGREEMENT: true,
  PREVENT_RIP_TRADES: true,
  CHECK_PLAYER_HISTORY: true,
};

// Trust and rating system
export const TRUST_SYSTEM = {
  INITIAL_TRUST_SCORE: 50,
  MAX_TRUST_SCORE: 100,
  SUCCESSFUL_TRADE_BONUS: 5,
  CANCELLED_TRADE_PENALTY: -10,
  REJECTED_TRADE_PENALTY: -3,
  DISPUTE_RESOLUTION_PENALTY: -20,
  TRUST_DECAY_PER_DAY_INACTIVE: -0.5,
};

// Settlement mechanics
export const SETTLEMENT_MECHANICS = {
  AUTO_SETTLE_AFTER_HOURS: 24,
  REQUIRE_BOTH_PLAYERS_ONLINE: false,
  ATOMIC_TRANSACTION_REQUIRED: true,
  ROLLBACK_ON_FAILURE: true,
};

// Reputation thresholds
export const REPUTATION_THRESHOLDS = {
  EXCELLENT: { min: 80, label: 'Excellent', bonus: 0.15 },
  GOOD: { min: 60, label: 'Good', bonus: 0.10 },
  NEUTRAL: { min: 40, label: 'Neutral', bonus: 0 },
  POOR: { min: 20, label: 'Poor', penalty: -0.10 },
  TERRIBLE: { min: 0, label: 'Terrible', penalty: -0.25 },
};

// Blacklist system for fraud prevention
export const BLACKLIST_SYSTEM = {
  AUTO_BLACKLIST_AFTER_DISPUTES: 3,
  DISPUTE_COOLDOWN_DAYS: 30,
  PERMANENT_BAN_THRESHOLD: 10,
};

// Trading marketplace features
export const MARKETPLACE_FEATURES = {
  PUBLIC_TRADE_BOARD: true,
  PLAYER_OFFERS_LISTING: true,
  SEARCH_BY_RESEARCH: true,
  FILTER_BY_REPUTATION: true,
  BULK_OFFERS: true,
};

// Default trade offer presets
export const DEFAULT_TRADE_PRESETS = [
  {
    id: 'balanced_exchange',
    name: 'Balanced Research Exchange',
    description: 'Fair 1:1 research trade',
    initiatorResearch: 1,
    recipientResearch: 1,
    xpBonus: 1000,
  },
  {
    id: 'xp_acceleration',
    name: 'XP Acceleration Trade',
    description: 'Trade research for significant XP boost',
    initiatorResearch: 2,
    recipientXp: 25000,
    creditCost: 50000,
  },
  {
    id: 'tech_package',
    name: 'Technology Package',
    description: 'Complete tech branch for combined offer',
    initiatorResearch: 5,
    recipientResearch: 3,
    recipientXp: 35000,
  },
  {
    id: 'credit_conversion',
    name: 'Research to Credits',
    description: 'Convert research progress to credits',
    initiatorResearch: 3,
    recipientCredits: 200000,
  },
  {
    id: 'milestone_reward',
    name: 'Milestone Achievement Trade',
    description: 'Trade milestone completion for resources',
    initiatorResearch: 1,
    milestone: true,
    recipientResearch: 2,
    recipientXp: 50000,
  },
];

// Trade status transitions
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['completed', 'cancelled'],
  rejected: [],
  completed: [],
  cancelled: [],
};

// Dispute resolution options
export const DISPUTE_RESOLUTION = {
  REQUIRE_ADMIN_REVIEW: true,
  ALLOW_PLAYER_NEGOTIATION: true,
  AUTO_REFUND_INCOMPLETE: true,
  DISPUTE_TIMEOUT_DAYS: 14,
};

// Utility functions

/**
 * Calculate trade fairness score (0-100)
 */
export function calculateFairnessScore(initiatorOffer: TradeOffer, recipientOffer: TradeOffer): number {
  const initiatorValue = (initiatorOffer.xpAmount || 0) + (initiatorOffer.credits || 0) + (initiatorOffer.researchIds?.length || 0) * 1000;
  const recipientValue = (recipientOffer.xpAmount || 0) + (recipientOffer.credits || 0) + (recipientOffer.researchIds?.length || 0) * 1000;
  
  if (initiatorValue === 0 || recipientValue === 0) return 0;
  
  const ratio = Math.min(initiatorValue, recipientValue) / Math.max(initiatorValue, recipientValue);
  return Math.round(ratio * 100);
}

/**
 * Check if trade is balanced
 */
export function isTradeBalanced(initiatorOffer: TradeOffer, recipientOffer: TradeOffer): boolean {
  const fairness = calculateFairnessScore(initiatorOffer, recipientOffer);
  return fairness >= 70; // 70%+ fairness is considered balanced
}

/**
 * Calculate effective trade value considering reputation
 */
export function calculateEffectiveTradeValue(baseValue: number, trustScore: number): number {
  const reputation = trustScore / 100;
  let multiplier = 1;
  
  if (reputation >= 0.8) multiplier = 1.15;
  else if (reputation >= 0.6) multiplier = 1.1;
  else if (reputation >= 0.4) multiplier = 1;
  else if (reputation >= 0.2) multiplier = 0.9;
  else multiplier = 0.75;
  
  return Math.round(baseValue * multiplier);
}

/**
 * Validate if player account is eligible for trading
 */
export function isPlayerEligibleForTrading(
  playerLevel: number,
  accountAgeDays: number,
  trustScore: number,
  isBlacklisted: boolean
): { eligible: boolean; reason?: string } {
  if (isBlacklisted) return { eligible: false, reason: 'Account is blacklisted' };
  if (playerLevel < TRADE_LIMITS.MIN_PLAYER_LEVEL) {
    return { eligible: false, reason: `Minimum level ${TRADE_LIMITS.MIN_PLAYER_LEVEL} required` };
  }
  if (accountAgeDays < TRADE_LIMITS.MIN_ACCOUNT_AGE_DAYS) {
    return { eligible: false, reason: `Account must be ${TRADE_LIMITS.MIN_ACCOUNT_AGE_DAYS} days old` };
  }
  return { eligible: true };
}

/**
 * Generate trade reference ID
 */
export function generateTradeId(): string {
  return `TRD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Calculate trade settlement time
 */
export function calculateSettlementTime(initiatorTrustScore: number, recipientTrustScore: number): number {
  // High-trust trades settle faster
  const avgTrust = (initiatorTrustScore + recipientTrustScore) / 2;
  if (avgTrust >= 80) return 1; // Instant
  if (avgTrust >= 60) return 5; // 5 minutes
  if (avgTrust >= 40) return 30; // 30 minutes
  return 60; // 1 hour for low-trust trades
}

/**
 * Apply trade fees to offer
 */
export function applyTradeFees(offer: TradeOffer): TradeOffer {
  return {
    ...offer,
    xpAmount: Math.round(offer.xpAmount * (1 - TRADE_FEES.XP_TRANSFER_FEE_PERCENT)),
    credits: Math.round(offer.credits * (1 - TRADE_FEES.CREDIT_TRANSFER_FEE_PERCENT)),
  };
}

/**
 * Check if trade violates RIP trade detection
 */
export function isRipTrade(initiatorOffer: TradeOffer, recipientOffer: TradeOffer): boolean {
  const fairness = calculateFairnessScore(initiatorOffer, recipientOffer);
  return fairness < 50; // Less than 50% fairness is considered a rip
}

/**
 * Validate trade request
 */
export function validateTradeRequest(trade: ResearchTrade): TradeValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validations
  if (!trade.initiatorOffer.researchIds?.length && !trade.initiatorOffer.xpAmount && !trade.initiatorOffer.credits) {
    errors.push('Initiator offer must include research, XP, or credits');
  }

  if (!trade.recipientOffer.researchIds?.length && !trade.recipientOffer.xpAmount && !trade.recipientOffer.credits) {
    errors.push('Recipient offer must include research, XP, or credits');
  }

  if (trade.initiatorOffer.xpAmount > TRADE_LIMITS.MAX_XP_PER_TRADE) {
    errors.push(`XP amount exceeds maximum of ${TRADE_LIMITS.MAX_XP_PER_TRADE}`);
  }

  if (trade.initiatorOffer.credits > TRADE_LIMITS.MAX_CREDITS_PER_TRADE) {
    errors.push(`Credits amount exceeds maximum of ${TRADE_LIMITS.MAX_CREDITS_PER_TRADE}`);
  }

  // Fairness check
  if (isRipTrade(trade.initiatorOffer, trade.recipientOffer)) {
    warnings.push('This trade may be unfair. Please review both offers.');
  }

  if (!isTradeBalanced(trade.initiatorOffer, trade.recipientOffer)) {
    warnings.push('Offers are not well-balanced. Consider adjusting them.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
