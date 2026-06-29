export interface EmpireScoreRank {
  rank: number;
  title: string;
  minScore: number;
  maxScore: number;
  bonuses: Record<string, number>;
  description: string;
}

export const EMPIRE_SCORE_RANKS: EmpireScoreRank[] = [
  {
    rank: 1,
    title: 'New Commander',
    minScore: 0,
    maxScore: 4999,
    bonuses: {},
    description: 'Fresh start in the universe. Learning the basics of resource management and exploration.',
  },
  {
    rank: 2,
    title: 'Scout',
    minScore: 5000,
    maxScore: 24999,
    bonuses: { resourceProduction: 0.02 },
    description: 'Proven ability to gather resources and scout neighboring systems.',
  },
  {
    rank: 3,
    title: 'Captain',
    minScore: 25000,
    maxScore: 99999,
    bonuses: { resourceProduction: 0.05, fleetAttack: 0.02 },
    description: 'Command of a small fleet. Capable of defending territory and launching expeditions.',
  },
  {
    rank: 4,
    title: 'Commodore',
    minScore: 100000,
    maxScore: 499999,
    bonuses: { resourceProduction: 0.08, fleetAttack: 0.05, fleetDefense: 0.03 },
    description: 'Leader of a formidable fleet. Respected for military achievements and economic power.',
  },
  {
    rank: 5,
    title: 'Admiral',
    minScore: 500000,
    maxScore: 4999999,
    bonuses: { resourceProduction: 0.1, fleetAttack: 0.08, fleetDefense: 0.05, researchSpeed: 0.05 },
    description: 'Master of intergalactic warfare. Commands multiple fleets across star systems.',
  },
  {
    rank: 6,
    title: 'Fleet Marshal',
    minScore: 5000000,
    maxScore: 99999999,
    bonuses: { resourceProduction: 0.15, fleetAttack: 0.12, fleetDefense: 0.08, researchSpeed: 0.08, warpSpeed: 0.05 },
    description: 'Supreme military commander. Authority spans entire galactic sectors.',
  },
  {
    rank: 7,
    title: 'Grand Admiral',
    minScore: 100000000,
    maxScore: Infinity,
    bonuses: { resourceProduction: 0.2, fleetAttack: 0.18, fleetDefense: 0.12, researchSpeed: 0.12, warpSpeed: 0.1 },
    description: 'Legendary commander of the highest order. A living legend whose empire shapes the galaxy.',
  },
];

export function getEmpireScoreRank(score: number): EmpireScoreRank {
  for (const rank of EMPIRE_SCORE_RANKS) {
    if (score >= rank.minScore && score <= rank.maxScore) {
      return rank;
    }
  }
  return EMPIRE_SCORE_RANKS[EMPIRE_SCORE_RANKS.length - 1];
}

export function getNextEmpireScoreRank(score: number): EmpireScoreRank | null {
  const current = getEmpireScoreRank(score);
  const nextIndex = EMPIRE_SCORE_RANKS.findIndex(r => r.rank === current.rank) + 1;
  return nextIndex < EMPIRE_SCORE_RANKS.length ? EMPIRE_SCORE_RANKS[nextIndex] : null;
}

export function getScoreToNextRank(score: number): { current: EmpireScoreRank; next: EmpireScoreRank | null; scoreNeeded: number; progress: number } {
  const current = getEmpireScoreRank(score);
  const next = getNextEmpireScoreRank(score);
  let scoreNeeded = 0;
  let progress = 1;
  if (next) {
    scoreNeeded = next.minScore - score;
    progress = (score - current.minScore) / (next.minScore - current.minScore);
  }
  return { current, next, scoreNeeded: Math.max(0, scoreNeeded), progress: Math.min(1, Math.max(0, progress)) };
}
