import { UNIVERSE_CONFIG } from "../../Source/Shared/config/xenoberage/universeConfig";

export interface PlayerScore {
  userId: string;
  score: number;
  empireValue: number;
  rank: number;
}

/**
 * Calculate composite player score from all stats.
 * Score = (resources + empireLevel * 1000 + fleetValue + planetValue + techLevel * 500)
 */
export function calculatePlayerScore(playerState: {
  resources: { credits: number; ore: number; goods: number; organics: number };
  empireLevel: number;
  fleetStrength: number;
  planetCount: number;
  techLevel: number;
  colonies: number;
}): number {
  const resourceValue =
    playerState.resources.credits +
    playerState.resources.ore +
    playerState.resources.goods +
    playerState.resources.organics;

  return (
    resourceValue +
    playerState.empireLevel * 1000 +
    playerState.fleetStrength +
    playerState.planetCount * 10000 +
    playerState.techLevel * 500 +
    playerState.colonies * 5000
  );
}

/**
 * Calculate empire value from player state.
 */
export function calculateEmpireValue(playerState: {
  resources: { credits: number; ore: number; goods: number; organics: number };
  empireLevel: number;
  fleetStrength: number;
  planetCount: number;
  colonies: number;
}): number {
  return (
    playerState.resources.credits +
    playerState.resources.ore * 2 +
    playerState.resources.goods * 3 +
    playerState.resources.organics +
    playerState.empireLevel * 5000 +
    playerState.fleetStrength * 10 +
    playerState.planetCount * 50000 +
    playerState.colonies * 25000
  );
}

/**
 * Update rankings for all players.
 * Sorts by score descending and assigns ranks.
 */
export async function updateRankings(
  allPlayers: PlayerScore[]
): Promise<PlayerScore[]> {
  const sorted = [...allPlayers].sort((a, b) => b.score - a.score);
  return sorted.map((player, index) => ({
    ...player,
    rank: index + 1,
  }));
}

/**
 * Get top N players from rankings.
 */
export function getTopPlayers(
  rankings: PlayerScore[],
  maxRanks: number = UNIVERSE_CONFIG.maxRanks
): PlayerScore[] {
  return rankings.slice(0, maxRanks);
}

/**
 * Calculate PvP rating change after combat.
 * Uses Elo-style rating adjustment.
 */
export function calculateRatingChange(
  attackerRating: number,
  defenderRating: number,
  combatFactor: number = UNIVERSE_CONFIG.ratingCombatFactor
): { attackerChange: number; defenderChange: number } {
  const ratingDiff = defenderRating - attackerRating;
  const expectedScore = 1 / (1 + Math.pow(10, ratingDiff / 400));

  // Assume attacker won (call with swapped params for defender win)
  const change = Math.floor(combatFactor * 25 * (1 - expectedScore));

  return {
    attackerChange: Math.max(1, change),
    defenderChange: -Math.max(1, change),
  };
}
