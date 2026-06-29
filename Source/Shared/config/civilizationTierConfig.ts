export interface CivilizationTier {
  tier: number;
  title: string;
  minScore: number;
  minColonies: number;
  minResearchLevels: number;
  unlockFeatures: string[];
  bonuses: Record<string, number>;
}

export const CIVILIZATION_TIERS: CivilizationTier[] = [
  {
    tier: 1,
    title: 'Outpost',
    minScore: 0,
    minColonies: 1,
    minResearchLevels: 0,
    unlockFeatures: ['Homeworld', 'Basic Resource Production', 'Scout Ships'],
    bonuses: {},
  },
  {
    tier: 2,
    title: 'Settlement',
    minScore: 1000,
    minColonies: 1,
    minResearchLevels: 5,
    unlockFeatures: ['Light Fighter', 'Small Cargo', 'Basic Defense'],
    bonuses: { resourceProduction: 0.05 },
  },
  {
    tier: 3,
    title: 'Colony',
    minScore: 5000,
    minColonies: 2,
    minResearchLevels: 15,
    unlockFeatures: ['Heavy Fighter', 'Large Cargo', 'Research Lab'],
    bonuses: { resourceProduction: 0.1, fleetSpeed: 0.05 },
  },
  {
    tier: 4,
    title: 'Province',
    minScore: 25000,
    minColonies: 3,
    minResearchLevels: 30,
    unlockFeatures: ['Cruiser', 'Colony Ship', 'Recycler'],
    bonuses: { resourceProduction: 0.15, fleetAttack: 0.05 },
  },
  {
    tier: 5,
    title: 'Planetary State',
    minScore: 75000,
    minColonies: 4,
    minResearchLevels: 50,
    unlockFeatures: ['Battleship', 'Espionage Probe', 'Bomber'],
    bonuses: { resourceProduction: 0.2, fleetAttack: 0.08, fleetDefense: 0.05 },
  },
  {
    tier: 6,
    title: 'Planetary Government',
    minScore: 200000,
    minColonies: 5,
    minResearchLevels: 75,
    unlockFeatures: ['Destroyer', 'Battlecruiser', 'Gauss Cannon'],
    bonuses: { resourceProduction: 0.25, fleetAttack: 0.1, fleetDefense: 0.08 },
  },
  {
    tier: 7,
    title: 'Star Nation',
    minScore: 500000,
    minColonies: 6,
    minResearchLevels: 100,
    unlockFeatures: ['Plasma Turret', 'Ion Cannon', 'Large Shield Dome'],
    bonuses: { resourceProduction: 0.3, fleetAttack: 0.12, fleetDefense: 0.1, researchSpeed: 0.05 },
  },
  {
    tier: 8,
    title: 'Star Kingdom',
    minScore: 1000000,
    minColonies: 7,
    minResearchLevels: 150,
    unlockFeatures: ['Deathstar', 'Interplanetary Missiles', 'Nanite Factory'],
    bonuses: { resourceProduction: 0.35, fleetAttack: 0.15, fleetDefense: 0.12, researchSpeed: 0.08 },
  },
  {
    tier: 9,
    title: 'Stellar Empire',
    minScore: 2500000,
    minColonies: 8,
    minResearchLevels: 200,
    unlockFeatures: ['Reaper', 'Pathfinder', 'Terraformer'],
    bonuses: { resourceProduction: 0.4, fleetAttack: 0.18, fleetDefense: 0.15, researchSpeed: 0.1 },
  },
  {
    tier: 10,
    title: 'Galactic Empire',
    minScore: 5000000,
    minColonies: 9,
    minResearchLevels: 300,
    unlockFeatures: ['Advanced Fleet Formations', 'Galaxy Gate', 'Alliance Creation'],
    bonuses: { resourceProduction: 0.45, fleetAttack: 0.2, fleetDefense: 0.18, researchSpeed: 0.12 },
  },
  {
    tier: 11,
    title: 'Galactic Federation',
    minScore: 10000000,
    minColonies: 10,
    minResearchLevels: 400,
    unlockFeatures: ['Titan Ships', 'Ancient Technology Access', 'Sector Control'],
    bonuses: { resourceProduction: 0.5, fleetAttack: 0.25, fleetDefense: 0.2, researchSpeed: 0.15 },
  },
  {
    tier: 12,
    title: 'Galactic Dominion',
    minScore: 25000000,
    minColonies: 12,
    minResearchLevels: 500,
    unlockFeatures: ['Omega Cannon', 'Quantum Gateway', 'Empire Prestige'],
    bonuses: { resourceProduction: 0.55, fleetAttack: 0.3, fleetDefense: 0.25, researchSpeed: 0.18, warpSpeed: 0.1 },
  },
  {
    tier: 13,
    title: 'Intergalactic Empire',
    minScore: 50000000,
    minColonies: 15,
    minResearchLevels: 650,
    unlockFeatures: ['Dyson Sphere Blueprint', 'Intergalactic Trade', 'Dark Matter Tech'],
    bonuses: { resourceProduction: 0.6, fleetAttack: 0.35, fleetDefense: 0.3, researchSpeed: 0.2, warpSpeed: 0.15 },
  },
  {
    tier: 14,
    title: 'Universal Empire',
    minScore: 100000000,
    minColonies: 20,
    minResearchLevels: 800,
    unlockFeatures: ['Universal Constructor', 'Reality Manipulation', 'Transcendent Tech'],
    bonuses: { resourceProduction: 0.7, fleetAttack: 0.4, fleetDefense: 0.35, researchSpeed: 0.25, warpSpeed: 0.2 },
  },
  {
    tier: 15,
    title: 'Ascendant Civilization',
    minScore: 250000000,
    minColonies: 25,
    minResearchLevels: 1000,
    unlockFeatures: ['Ascension Ritual', 'Galactic Core Access', 'New Game+ Prestige'],
    bonuses: { resourceProduction: 0.8, fleetAttack: 0.5, fleetDefense: 0.4, researchSpeed: 0.3, warpSpeed: 0.25 },
  },
];

export function getCivilizationTier(score: number, colonies: number, totalResearchLevels: number): CivilizationTier {
  let currentTier = CIVILIZATION_TIERS[0];
  for (const tier of CIVILIZATION_TIERS) {
    if (score >= tier.minScore && colonies >= tier.minColonies && totalResearchLevels >= tier.minResearchLevels) {
      currentTier = tier;
    } else {
      break;
    }
  }
  return currentTier;
}

export function getNextCivilizationTier(
  score: number, colonies: number, totalResearchLevels: number
): CivilizationTier | null {
  const current = getCivilizationTier(score, colonies, totalResearchLevels);
  const nextIndex = CIVILIZATION_TIERS.findIndex(t => t.tier === current.tier) + 1;
  return nextIndex < CIVILIZATION_TIERS.length ? CIVILIZATION_TIERS[nextIndex] : null;
}

export function getTierProgress(
  score: number, colonies: number, totalResearchLevels: number
): { current: CivilizationTier; next: CivilizationTier | null; progress: number } {
  const current = getCivilizationTier(score, colonies, totalResearchLevels);
  const next = getNextCivilizationTier(score, colonies, totalResearchLevels);
  let progress = 1;
  if (next) {
    const scoreProgress = score / next.minScore;
    const colonyProgress = colonies / next.minColonies;
    const researchProgress = totalResearchLevels / next.minResearchLevels;
    progress = Math.min(scoreProgress, colonyProgress, researchProgress);
  }
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}
