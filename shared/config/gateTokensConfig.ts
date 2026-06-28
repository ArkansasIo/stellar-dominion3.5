// Gate Tokens System Configuration
// Defines token types, acquisition rates, and pricing

export type TokenType = 'anomaly' | 'raid' | 'exploration';

export interface TokenTypeConfig {
  id: TokenType;
  name: string;
  description: string;
  icon: string;
  maxInventory: number;
  purchasePrice: {
    credits: number;
  };
  dailyRewardAllocation: {
    base: number;
    maxDaily: number;
  };
}

export interface GateTokensConfig {
  tokenTypes: Record<TokenType, TokenTypeConfig>;
}

export const gateTokensConfig: GateTokensConfig = {
  tokenTypes: {
    anomaly: {
      id: 'anomaly',
      name: 'Anomaly Gate Token',
      description: 'Access dimensional anomalies and explore unknown phenomena',
      icon: '⚡',
      maxInventory: 50,
      purchasePrice: {
        credits: 2500,
      },
      dailyRewardAllocation: {
        base: 2,
        maxDaily: 5,
      },
    },
    raid: {
      id: 'raid',
      name: 'Raid Access Token',
      description: 'Participate in raid operations against boss enemies and rival empires',
      icon: '⚔️',
      maxInventory: 30,
      purchasePrice: {
        credits: 3500,
      },
      dailyRewardAllocation: {
        base: 1,
        maxDaily: 3,
      },
    },
    exploration: {
      id: 'exploration',
      name: 'Exploration Gate Token',
      description: 'Venture into uncharted territories and discover new regions',
      icon: '🔍',
      maxInventory: 40,
      purchasePrice: {
        credits: 2000,
      },
      dailyRewardAllocation: {
        base: 2,
        maxDaily: 4,
      },
    },
  },
};

// Acquisition rules - how players earn tokens
export const tokenAcquisitionRules = {
  // Reward drop rates by content completion
  anomalyCompletion: {
    tokenType: 'anomaly' as TokenType,
    rewardChance: 0.4, // 40% chance to get token on completion
    quantity: 1,
  },
  raidVictory: {
    tokenType: 'raid' as TokenType,
    rewardChance: 0.5, // 50% chance to get token on raid victory
    quantity: 1,
  },
  explorationCompletion: {
    tokenType: 'exploration' as TokenType,
    rewardChance: 0.45, // 45% chance to get token on exploration completion
    quantity: 1,
  },
  // Daily login bonuses
  dailyLoginAnomalyBonus: {
    tokenType: 'anomaly' as TokenType,
    quantity: 1,
  },
  // Achievement rewards
  achievementRewards: {
    'first-anomaly-exploration': {
      tokenType: 'anomaly' as TokenType,
      quantity: 3,
    },
    'first-raid-victory': {
      tokenType: 'raid' as TokenType,
      quantity: 2,
    },
    'first-exploration-complete': {
      tokenType: 'exploration' as TokenType,
      quantity: 3,
    },
    'raid-streak-5': {
      tokenType: 'raid' as TokenType,
      quantity: 5,
    },
    'anomaly-collector-10': {
      tokenType: 'anomaly' as TokenType,
      quantity: 10,
    },
  },
};

// Helper function to get token config by type
export function getTokenConfig(type: TokenType): TokenTypeConfig {
  return gateTokensConfig.tokenTypes[type];
}

// Helper function to validate token type
export function isValidTokenType(type: string): type is TokenType {
  return ['anomaly', 'raid', 'exploration'].includes(type);
}
