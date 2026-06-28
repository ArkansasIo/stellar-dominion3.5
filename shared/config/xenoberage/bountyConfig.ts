export const BOUNTY_CONFIG = {
  maxValue: 0.15,
  ratio: 0.75,
  minTurns: 500,
} as const;

export interface Bounty {
  id: string;
  placerId: string;
  targetId: string;
  amount: number;
  active: boolean;
  createdAt: Date;
}

export type BountyConfig = typeof BOUNTY_CONFIG;

export const BOUNTY = BOUNTY_CONFIG;
