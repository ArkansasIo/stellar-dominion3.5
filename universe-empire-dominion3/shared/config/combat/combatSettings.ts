/**
 * Combat Engine Settings
 */

export const COMBAT_SETTINGS = {
  // Damage layers
  shieldMultiplier: 1.0,
  armorMultiplier: 1.0,
  hullMultiplier: 1.0,

  // Evasion & accuracy
  baseEvasion: 0.05,
  baseAccuracy: 0.90,
  evasionPerLevel: 0.02,
  accuracyPerLevel: 0.01,

  // Formations
  formations: [
    { id: "balanced", name: "Balanced", shieldMod: 1.0, armorMod: 1.0, hullMod: 1.0, damageMod: 1.0 },
    { id: "aggressive", name: "Aggressive", shieldMod: 0.8, armorMod: 0.9, hullMod: 0.9, damageMod: 1.25 },
    { id: "defensive", name: "Defensive", shieldMod: 1.3, armorMod: 1.2, hullMod: 1.1, damageMod: 0.8 },
    { id: "flanking", name: "Flanking", shieldMod: 0.9, armorMod: 0.8, hullMod: 0.9, damageMod: 1.15 },
    { id: "pincer", name: "Pincer", shieldMod: 1.0, armorMod: 1.0, hullMod: 0.95, damageMod: 1.1 },
  ],

  // Casualty factors
  spaceCasualtyFactor: 0.15,
  groundCasualtyFactor: 0.25,
  minCasualtyRate: 0.01,
  maxCasualtyRate: 0.80,

  // Battle log depth
  maxBattleLogEntries: 100,
  battleLogRetentionDays: 30,
} as const;

export type CombatSettings = typeof COMBAT_SETTINGS;
