export const COMBAT_CONFIG = {
  mineHullSize: 2,
  ewdMaxHullSize: 15,
  defenceDegradeRate: 0.05,
  energyPerFighter: 0.10,
  torpDmgRate: 10,
  scanErrorFactor: 20,
  fullscanCost: 1,
} as const;

export interface SectorDefenses {
  fighters: number;
  mines: number;
  ownerUserId: string | null;
}

export interface FighterConfig {
  energyPerFighter: number;
  defenceDegradeRate: number;
}

export interface TorpedoConfig {
  torpDmgRate: number;
}

export type CombatConfig = typeof COMBAT_CONFIG;

export const COMBAT = COMBAT_CONFIG;
