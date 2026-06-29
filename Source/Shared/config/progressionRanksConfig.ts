// Progression Ranks Configuration — GDD-aligned
// Covers: Player Level, Empire Level, Military Rank, Economic Rank,
//         Research Rank, Alliance Rank, Season Rank, Achievement Score

export type RankCategory =
  | 'player'
  | 'empire'
  | 'military'
  | 'economic'
  | 'research'
  | 'alliance'
  | 'season'
  | 'achievement';

export interface RankDefinition {
  category: RankCategory;
  name: string;
  titles: { from: number; to: number; title: string }[];
  icon: string;
  description: string;
  maxRank: number;
}

export const PROGRESSION_RANKS: RankDefinition[] = [
  {
    category: 'player',
    name: 'Player Level',
    titles: [
      { from: 1, to: 9, title: 'Recruit' },
      { from: 10, to: 24, title: 'Cadet' },
      { from: 25, to: 49, title: 'Officer' },
      { from: 50, to: 74, title: 'Commander' },
      { from: 75, to: 99, title: 'Captain' },
      { from: 100, to: 149, title: 'Admiral' },
      { from: 150, to: 199, title: 'Fleet Admiral' },
      { from: 200, to: 299, title: 'Grand Admiral' },
      { from: 300, to: 499, title: 'Imperator' },
      { from: 500, to: 999, title: 'Galactic Sovereign' },
    ],
    icon: 'player_rank',
    description: 'Overall player experience and progression',
    maxRank: 999,
  },
  {
    category: 'empire',
    name: 'Empire Level',
    titles: [
      { from: 1, to: 4, title: 'Outpost' },
      { from: 5, to: 9, title: 'Colony' },
      { from: 10, to: 24, title: 'Settlement' },
      { from: 25, to: 49, title: 'State' },
      { from: 50, to: 74, title: 'Kingdom' },
      { from: 75, to: 99, title: 'Empire' },
      { from: 100, to: 149, title: 'Dominion' },
      { from: 150, to: 199, title: 'Hegemony' },
      { from: 200, to: 299, title: 'Commonwealth' },
      { from: 300, to: 500, title: 'Galactic Imperium' },
    ],
    icon: 'empire_rank',
    description: 'Empire size, colonies, and infrastructure level',
    maxRank: 500,
  },
  {
    category: 'military',
    name: 'Military Rank',
    titles: [
      { from: 1, to: 4, title: 'Private' },
      { from: 5, to: 9, title: 'Corporal' },
      { from: 10, to: 24, title: 'Sergeant' },
      { from: 25, to: 49, title: 'Lieutenant' },
      { from: 50, to: 74, title: 'Captain' },
      { from: 75, to: 99, title: 'Major' },
      { from: 100, to: 149, title: 'Colonel' },
      { from: 150, to: 199, title: 'General' },
      { from: 200, to: 299, title: 'Field Marshal' },
      { from: 300, to: 500, title: 'Warlord' },
    ],
    icon: 'military_rank',
    description: 'Military achievements, battles won, and fleet strength',
    maxRank: 500,
  },
  {
    category: 'economic',
    name: 'Economic Rank',
    titles: [
      { from: 1, to: 4, title: 'Trader' },
      { from: 5, to: 9, title: 'Merchant' },
      { from: 10, to: 24, title: 'Financier' },
      { from: 25, to: 49, title: 'Tycoon' },
      { from: 50, to: 74, title: 'Magnate' },
      { from: 75, to: 99, title: 'Industrialist' },
      { from: 100, to: 149, title: 'Baron' },
      { from: 150, to: 199, title: 'Duke' },
      { from: 200, to: 299, title: 'Archduke' },
      { from: 300, to: 500, title: 'Trade Prince' },
    ],
    icon: 'economic_rank',
    description: 'Economic output, trade volume, and resource wealth',
    maxRank: 500,
  },
  {
    category: 'research',
    name: 'Research Rank',
    titles: [
      { from: 1, to: 4, title: 'Apprentice' },
      { from: 5, to: 9, title: 'Scholar' },
      { from: 10, to: 24, title: 'Researcher' },
      { from: 25, to: 49, title: 'Scientist' },
      { from: 50, to: 74, title: 'Doctor' },
      { from: 75, to: 99, title: 'Professor' },
      { from: 100, to: 149, title: 'Dean' },
      { from: 150, to: 199, title: 'Chancellor' },
      { from: 200, to: 299, title: 'Grand Sage' },
      { from: 300, to: 500, title: 'Omniscient' },
    ],
    icon: 'research_rank',
    description: 'Technologies researched and scientific discoveries',
    maxRank: 500,
  },
  {
    category: 'alliance',
    name: 'Alliance Rank',
    titles: [
      { from: 1, to: 4, title: 'Initiate' },
      { from: 5, to: 9, title: 'Member' },
      { from: 10, to: 24, title: 'Veteran' },
      { from: 25, to: 49, title: 'Elite' },
      { from: 50, to: 74, title: 'Champion' },
      { from: 75, to: 99, title: 'Hero' },
      { from: 100, to: 149, title: 'Legend' },
      { from: 150, to: 199, title: 'Exalted' },
      { from: 200, to: 299, title: 'Transcendent' },
      { from: 300, to: 500, title: 'Ascended' },
    ],
    icon: 'alliance_rank',
    description: 'Alliance contributions, wars, and reputation',
    maxRank: 500,
  },
  {
    category: 'season',
    name: 'Season Rank',
    titles: [
      { from: 1, to: 9, title: 'Bronze I' },
      { from: 10, to: 24, title: 'Bronze II' },
      { from: 25, to: 49, title: 'Silver I' },
      { from: 50, to: 74, title: 'Silver II' },
      { from: 75, to: 99, title: 'Gold I' },
      { from: 100, to: 149, title: 'Gold II' },
      { from: 150, to: 199, title: 'Platinum' },
      { from: 200, to: 299, title: 'Diamond' },
      { from: 300, to: 499, title: 'Master' },
      { from: 500, to: 999, title: 'Grandmaster' },
    ],
    icon: 'season_rank',
    description: 'Seasonal competition performance',
    maxRank: 999,
  },
  {
    category: 'achievement',
    name: 'Achievement Score',
    titles: [
      { from: 0, to: 99, title: 'Novice' },
      { from: 100, to: 499, title: 'Achiever' },
      { from: 500, to: 1499, title: 'Completionist' },
      { from: 1500, to: 4999, title: 'Perfectionist' },
      { from: 5000, to: 9999, title: 'Legendary Achiever' },
      { from: 10000, to: 99999, title: 'Grandmaster Achiever' },
    ],
    icon: 'achievement_rank',
    description: 'Total achievement points earned',
    maxRank: 99999,
  },
];

export function getRankTitle(category: RankCategory, level: number): string {
  const rank = PROGRESSION_RANKS.find(r => r.category === category);
  if (!rank) return 'Unknown';
  const entry = rank.titles.find(t => level >= t.from && level <= t.to);
  return entry ? entry.title : rank.titles[rank.titles.length - 1].title;
}

export function getNextRankTitle(category: RankCategory, level: number): { title: string; levelRequired: number } | null {
  const rank = PROGRESSION_RANKS.find(r => r.category === category);
  if (!rank) return null;
  const next = rank.titles.find(t => level < t.from);
  return next ? { title: next.title, levelRequired: next.from } : null;
}

export function calculateRankProgress(category: RankCategory, level: number): { current: string; next: string | null; progress: number } {
  const rank = PROGRESSION_RANKS.find(r => r.category === category);
  if (!rank) return { current: 'Unknown', next: null, progress: 1 };
  const current = getRankTitle(category, level);
  const next = getNextRankTitle(category, level);
  let progress = 1;
  if (next) {
    const currentEntry = rank.titles.find(t => level >= t.from && level <= t.to);
    if (currentEntry) {
      progress = (level - currentEntry.from) / (currentEntry.to - currentEntry.from + 1);
    }
  }
  return { current, next: next?.title ?? null, progress: Math.min(1, Math.max(0, progress)) };
}
