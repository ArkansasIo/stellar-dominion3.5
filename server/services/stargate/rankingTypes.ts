export const RANKING_CATEGORIES = ["attack", "defense", "covert", "mothership", "overall", "race", "alliance", "glory", "reputation"] as const;
export type RankingCategory = (typeof RANKING_CATEGORIES)[number];
