export const UNIVERSE_CONFIG = {
  sectorMax: 1000,
  linkMax: 10,
  universeSize: 500,
  maxRanks: 100,
  ratingCombatFactor: 0.8,
  fedMaxHull: 8,
  fedMaxScore: 1000000,
  xenobeMax: 10,
  xenStartCredits: 1000000,
  xenUnemployment: 100000,
  xenAggression: 100,
  xenPlanets: 5,
  xenstartsize: 15,
  facilityHydroponicsFood: 1,
  facilityShipyardsParts: 1,
  facilitySolarplantEnergy: 1,
  facilityResearchPoints: 1,
  facilityMiningOre: 1,
} as const;

export const BASE_REQUIREMENTS = {
  hydroCredits: 1000000000,
  hydroOrganics: 500000000,
  hydroGoods: 100000000,
  bankingCredits: 10000000000,
  shipyardCredits: 10000000000,
  shipyardGoods: 500000000,
  shipyardOre: 500000000,
  solarCredits: 500000000,
  solarGoods: 100000000,
  solarOre: 100000000,
  medicalCredits: 5000000000,
  medicalGoods: 500000000,
  medicalCols: Math.ceil(200000000 / 5),
  researchCredits: 5000000000,
  researchCols: Math.ceil(200000000 / 3),
  militaryCredits: 5000000000,
  militaryCols: Math.ceil(200000000 / 3),
  militaryTorps: 75000000,
  militaryFigs: 75000000,
} as const;

export interface UniverseDimensions {
  sectorMax: number;
  linkMax: number;
  universeSize: number;
  maxRanks: number;
}

export interface RatingConfig {
  ratingCombatFactor: number;
}

export interface ServerFlags {
  fedMaxHull: number;
  fedMaxScore: number;
}

export const UNIVERSE = UNIVERSE_CONFIG;
export const RATING = { ratingCombatFactor: UNIVERSE_CONFIG.ratingCombatFactor };
export const SERVER = { fedMaxHull: UNIVERSE_CONFIG.fedMaxHull, fedMaxScore: UNIVERSE_CONFIG.fedMaxScore };
