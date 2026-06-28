/**
 * Player Account & Progression Settings
 */

export const PLAYER_SETTINGS = {
  // Username / password rules
  minUsernameLength: 3,
  minPasswordLength: 6,
  maxUsernameLength: 32,
  maxPasswordLength: 128,

  // Empire slots
  maxEmpireSlots: 5,
  maxEmpireNameLength: 64,
  maxHomeWorldNameLength: 64,

  // Starting resources
  startMetal: 50000,
  startCrystal: 50000,
  startDeuterium: 20000,
  startEnergy: 5000,
  startCredits: 10000,
  startFood: 5000,
  startWater: 5000,
  startDarkMatter: 0,

  // Starting units
  startLightFighter: 5,
  startSmallCargo: 2,
  startEspionageProbe: 10,
  startMarine: 50,
  startColonist: 100,

  // Starting buildings
  startMetalMine: 10,
  startCrystalMine: 8,
  startDeuteriumSynth: 5,
  startSolarPlant: 12,
  startRoboticsFactory: 2,
  startShipyard: 2,
  startResearchLab: 1,

  // Max values
  maxResourceValue: 1_000_000_000_000_000,
  maxTurns: 1000,
  turnsPerMinute: 6,
  offlineTurnCapHours: 24,
} as const;

export type PlayerSettings = typeof PLAYER_SETTINGS;
