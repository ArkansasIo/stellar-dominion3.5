export const COLONIZATION_CONFIG = {
  colonistProductionRate: 0.005,
  colonistReproductionRate: 0.0005,
  colonistLimit: 200000000,
  organicsConsumption: 0.05,
  starvationDeathRate: 0.01,
  spacePlagueKills: 0.20,
  baseOre: 10000,
  baseGoods: 10000,
  baseOrganics: 10000,
  baseCredits: 10000000,
  minBasesToOwn: 4,
  maxPlanetsSector: 7,
  basedefense: 1,
  doomsdayValue: 190000000,
} as const;

export interface ColonyState {
  id: string;
  userId: string;
  sectorId: string;
  planetId: string;
  population: number;
  hasBase: boolean;
  baseLevel: number;
  organics: number;
  ore: number;
  goods: number;
  credits: number;
}

export interface BaseRequirements {
  ore: number;
  goods: number;
  organics: number;
  credits: number;
}

export interface ColonistConfig {
  colonistProductionRate: number;
  colonistReproductionRate: number;
  colonistLimit: number;
  organicsConsumption: number;
  starvationDeathRate: number;
  spacePlagueKills: number;
}

export interface BaseCost {
  baseOre: number;
  baseGoods: number;
  baseOrganics: number;
  baseCredits: number;
}

export type ColonizationConfig = typeof COLONIZATION_CONFIG;

export const COLONIZATION = COLONIZATION_CONFIG;
