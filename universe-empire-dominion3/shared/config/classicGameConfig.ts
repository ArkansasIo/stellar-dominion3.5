/**
 * CLASSIC GAME CONFIGURATION
 * ============================================================================
 * Ported from Xenobe Rage / Blacknova Traders PHP config.php and db_config.php
 * Contains economy, combat, facilities, scheduler, banking, colonization,
 * and all tunable game balance parameters.
 * ============================================================================
 */

// ─── Scheduler / Tick Configuration ─────────────────────────────────────────

export const SCHEDULER_CONFIG = {
  /** How often (in minutes) the scheduler script runs */
  ticksPerMinute: 6,
  /** How many turns added per tick */
  turnsPerTick: 3,
  /** New turns rate (also includes towing, xenobe) */
  turnsRate: 2,
  /** How often port production occurs (minutes) */
  portsRate: 2,
  /** How often planet production occurs (minutes) */
  planetsRate: 2,
  /** How often IGB interests are added (minutes) */
  igbRate: 2,
  /** How often rankings are generated (minutes) */
  rankingRate: 30,
  /** How often news is generated (minutes) */
  newsRate: 15,
  /** How often sector fighters degrade (minutes) */
  degradeRate: 6,
  /** How often apocalypse events occur (minutes) */
  apocalypseRate: 15,
  /** How often the governor runs (minutes) */
  governorRate: 1,
  /** How often empire updates occur (minutes) */
  empireRate: 10,
} as const;

// ─── Universe / Sector Configuration ────────────────────────────────────────

export const UNIVERSE_CONFIG = {
  /** Number of sectors in the universe */
  sectorMax: 1000,
  /** Maximum links per sector */
  linkMax: 10,
  /** Universe size multiplier (increases distance between sectors) */
  universeSize: 500,
  /** Maximum planets per sector */
  maxPlanetsPerSector: 7,
  /** Maximum number of xenobe in the universe */
  xenobeMax: 10,
} as const;

// ─── Game Identity ──────────────────────────────────────────────────────────

export const GAME_IDENTITY = {
  gameName: "Stellar Dominion",
  releaseVersion: "2.0.0",
  defaultLanguage: "english",
  footerStyle: "new" as "old" | "new",
  linkForums: "",
  emailServer: "mail.example.com",
} as const;

// ─── Resource Economy ───────────────────────────────────────────────────────

export const RESOURCE_ECONOMY = {
  ore: {
    price: 11,
    delta: 5,
    rate: 75000,
    productionRate: 0.25,
    limit: 500_000_000,
  },
  organics: {
    price: 5,
    delta: 2,
    rate: 5000,
    productionRate: 0.5,
    limit: 500_000_000,
  },
  goods: {
    price: 15,
    delta: 7,
    rate: 75000,
    productionRate: 0.25,
    limit: 500_000_000,
  },
  energy: {
    price: 3,
    delta: 1,
    rate: 75000,
    productionRate: 0.5,
    limit: 5_000_000_000,
  },
  credits: {
    productionRate: 3.0,
  },
  /** Default planet production percentages */
  defaultProduction: {
    ore: 20.0,
    organics: 20.0,
    goods: 20.0,
    energy: 20.0,
    fighters: 10.0,
    torpedoes: 10.0,
  },
  /** Port regeneration rate multiplier */
  portRegenRate: 10,
} as const;

// ─── Combat & Weapons ───────────────────────────────────────────────────────

export const COMBAT_CONFIG = {
  /** Minimum hull size to hit mines */
  mineHullSize: 2,
  /** Maximum hull size before EWD degrades */
  ewdMaxHullSize: 15,
  /** Torpedo damage per torpedo */
  torpedoDmgRate: 10,
  /** Rating gained from combat */
  ratingCombatFactor: 0.8,
  /** Defense degrade rate during scheduler */
  defenseDegradeRate: 0.05,
  /** Energy per fighter to maintain during scheduler */
  energyPerFighter: 0.10,
  /** Sub-orbital fighter (SOFA) attack allowed */
  sofaAllowed: true,
  /** Doomsday value (colonists threshold for apocalypse) */
  doomsdayValue: 190_000_000,
  /** Apocalypse colonist kill percentage */
  spacePlagueKills: 0.20,
} as const;

// ─── Newbie / Starter Settings ──────────────────────────────────────────────

export const NEWBIE_CONFIG = {
  /** Regenerate destroyed new players */
  niceMode: true,
  /** Thresholds below which a destroyed player gets regenerated */
  hull: 8,
  engines: 8,
  power: 8,
  computer: 8,
  sensors: 8,
  armor: 8,
  shields: 8,
  beams: 8,
  torpLaunchers: 8,
  cloak: 8,
  /** Starting ship values */
  startFighters: 10,
  startArmor: 10,
  startCredits: 1000,
  startEnergy: 100,
  startTurns: 1200,
  startLssd: false,
  startEditors: 0,
  startMineDeflectors: 0,
  startEmerWarp: 0,
  startBeacon: 0,
  startGenesis: 1,
  startEscapePod: false,
  startFuelScoop: false,
} as const;

// ─── Turn System ────────────────────────────────────────────────────────────

export const TURN_CONFIG = {
  /** Maximum turns a player can have */
  maxTurns: 2500,
  /** Cost in turns for full scan */
  fullscanCost: 1,
  /** Percentage error factor for cloak vs sensors */
  scanErrorFactor: 20,
} as const;

// ─── Device Prices (Special Port Purchases) ─────────────────────────────────

export const DEVICE_PRICES = {
  genesisDevice: 100_000_000,
  beacon: 100,
  emergencyWarpDevice: 100_000_000,
  warpEditor: 100_000,
  mineDeflector: 10,
  escapePod: 100_000,
  fuelScoop: 100_000,
  lssd: 10_000_000_000,
  fighter: 50,
  torpedo: 25,
  armor: 5,
  colonist: 5,
} as const;

// ─── Device Limits ──────────────────────────────────────────────────────────

export const DEVICE_LIMITS = {
  maxEmerWarp: 10,
  maxGenesis: 10,
  maxBeacons: 10,
  maxWarpEdit: 10,
  maxUpgradesDevices: 45,
} as const;

// ─── Production Rates (Planet) ──────────────────────────────────────────────

export const PRODUCTION_RATES = {
  fighterPrate: 0.01,
  torpedoPrate: 0.025,
  creditsPrate: 3.0,
  orePrate: 0.25,
  organicsPrate: 0.5,
  goodsPrate: 0.25,
  energyPrate: 0.5,
} as const;

// ─── Colonization & Population ──────────────────────────────────────────────

export const COLONIZATION_CONFIG = {
  colonistPrice: 5,
  colonistProductionRate: 0.005,
  colonistReproductionRate: 0.0005,
  colonistLimit: 200_000_000,
  organicsConsumption: 0.05,
  starvationDeathRate: 0.01,
  maxCreditsWithoutBase: 10_000_000,
  planetMaxCredits: 10_000_000_000_000_000,
} as const;

// ─── Base Construction ──────────────────────────────────────────────────────

export const BASE_COSTS = {
  ore: 10000,
  goods: 10000,
  organics: 10000,
  credits: 10_000_000,
  /** Additional defense factor from having a base */
  baseDefense: 1,
} as const;

// ─── Ship Upgrade System ────────────────────────────────────────────────────

export const UPGRADE_SYSTEM = {
  /** Upgrade price = (upgradeFactor ^ levelDiff) * upgradeCost */
  upgradeCost: 1000,
  /** Numeric base raised to power of level difference */
  upgradeFactor: 2,
  /** How effective a level is: amount = levelFactor ^ itemLevel */
  levelFactor: 1.5,
  /** Inventory factor: units a single hull can hold */
  inventoryFactor: 1,
} as const;

// ─── Intergalactic Bank (IGB) ───────────────────────────────────────────────

export const BANK_CONFIG = {
  /** Interest rate for account funds (per tick) */
  interestRate: 0.00015,
  /** Payment fee ratio */
  paymentFee: 0.05,
  /** Loan interest rate */
  loanInterest: 0.0010,
  /** One-time loan fee factor */
  loanFactor: 0.10,
  /** Maximum loan as percent of net worth */
  loanLimit: 0.25,
  /** Interest rate offered by the IGB */
  bankInterestRate: 1.0003,
  /** Turns before ship transfers are allowed (0 = disabled) */
  minTurnsTransfers: 0,
  /** Max sender value ratio for ship transfers (0 = disabled) */
  shipTransferValue: 0.15,
  /** Time (minutes) between similar transfers */
  transferRate: 1440,
  /** Time (minutes) to repay a loan */
  loanRepayRate: 1440,
  /** Cost in turns for consolidate */
  consolidateCost: 10,
  /** Allow corp planet transfers */
  corpPlanetTransfers: false,
  /** Maximum credits allowed in IGB */
  maxCreditsAllowed: 10_000_000_000_000_000,
  /** Is the bank enabled */
  enabled: true,
} as const;

// ─── Bounty System ──────────────────────────────────────────────────────────

export const BOUNTY_CONFIG = {
  /** Max bounty as percent of player value (0 = disabled) */
  maxValue: 0.15,
  /** Ratio of net worth for bounty trigger (0 = disabled) */
  ratio: 0.75,
  /** Min turns target must have (0 = disabled) */
  minTurns: 500,
  /** Block special ports when you have a bounty */
  allSpecialPorts: true,
} as const;

// ─── Federation Settings ────────────────────────────────────────────────────

export const FEDERATION_CONFIG = {
  /** Maximum hull size before towed out of fed space */
  maxHull: 8,
  /** Maximum score before towed out */
  maxScore: 1_000_000,
  /** Minimum planet value capture percentage (0 = disabled) */
  minValueCapture: 0,
} as const;

// ─── Scanner / Navigation ───────────────────────────────────────────────────

export const SCANNER_CONFIG = {
  /** Allow full long range scan */
  allowFullScan: true,
  /** Allow navigation computer */
  allowNavComp: true,
  /** Allow genesis destroy */
  allowGenesisDestroy: true,
  /** Known space map allowed */
  ksmAllowed: true,
} as const;

// ─── Fighter Degradation ────────────────────────────────────────────────────

export const DEGRADATION_CONFIG = {
  /** Percentage rate at which defenses degrade during scheduler */
  defenseDegradeRate: 0.05,
  /** Energy per fighter to maintain */
  energyPerFighter: 0.10,
} as const;

// ─── Xenobe (AI NPCs) ───────────────────────────────────────────────────────

export const XENBE_CONFIG = {
  /** Maximum xenobe count */
  maxXenobe: 10,
  /** Starting credits */
  startCredits: 1_000_000,
  /** Credits per xenobe tick (unemployment benefit) */
  unemployment: 100_000,
  /** Percent of xenobe that are aggressive */
  aggression: 100,
  /** Percent of created xenobe that own planets */
  planetsPercent: 5,
  /** Max starting size */
  startSize: 15,
} as const;

// ─── Trading Configuration ──────────────────────────────────────────────────

export const TRADING_CONFIG = {
  /** Maximum traderoutes per player */
  maxTradeRoutesPerPlayer: 40,
  /** Minimum bases to own in a sector for zone ownership */
  minBasesToOwn: 4,
  /** Sector max (duplicate for convenience) */
  sectorMax: UNIVERSE_CONFIG.sectorMax,
} as const;

// ─── Facility / Building System ─────────────────────────────────────────────

export const FACILITY_CONFIG = {
  /** Per-tick production values */
  hydroponicsFood: 1,
  shipyardParts: 1,
  solarPlantEnergy: 1,
  researchPoints: 1,
  miningOre: 1,

  /** Construction requirements */
  requirements: {
    hydroponics: {
      credits: 1_000_000_000,
      organics: 500_000_000,
      goods: 100_000_000,
    },
    banking: {
      credits: 10_000_000_000,
    },
    shipyard: {
      credits: 10_000_000_000,
      goods: 500_000_000,
      ore: 500_000_000,
    },
    solar: {
      credits: 500_000_000,
      goods: 100_000_000,
      ore: 100_000_000,
    },
    medical: {
      credits: 5_000_000_000,
      goods: 500_000_000,
      colonists: 40_000_000,
    },
    research: {
      credits: 5_000_000_000,
      colonists: 66_666_667,
    },
    military: {
      credits: 5_000_000_000,
      colonists: 66_666_667,
      torpedoes: 75_000_000,
      fighters: 75_000_000,
    },
  },
} as const;

// ─── Server / Feature Flags ─────────────────────────────────────────────────

export const SERVER_CONFIG = {
  /** Block logins but allow account creation */
  serverClosed: false,
  /** Block new account creation */
  accountCreationClosed: false,
  /** Display password on signup screen */
  displayPassword: false,
  /** Allow IGB */
  allowIgb: true,
  /** Register with list server */
  registerWithListServer: false,
  /** Planets valid credits limit */
  planetValidCredits: false,
  /** Max ranks displayed on ranking page */
  maxRanks: 100,
  /** Localization */
  localNumberDecPoint: ".",
  localNumberThousandsSep: ",",
  language: "english",
} as const;

// ─── Combined Classic Config Export ─────────────────────────────────────────

export const CLASSIC_GAME_CONFIG = {
  scheduler: SCHEDULER_CONFIG,
  universe: UNIVERSE_CONFIG,
  identity: GAME_IDENTITY,
  economy: RESOURCE_ECONOMY,
  combat: COMBAT_CONFIG,
  newbie: NEWBIE_CONFIG,
  turns: TURN_CONFIG,
  devices: DEVICE_PRICES,
  deviceLimits: DEVICE_LIMITS,
  production: PRODUCTION_RATES,
  colonization: COLONIZATION_CONFIG,
  base: BASE_COSTS,
  upgrades: UPGRADE_SYSTEM,
  bank: BANK_CONFIG,
  bounty: BOUNTY_CONFIG,
  federation: FEDERATION_CONFIG,
  scanner: SCANNER_CONFIG,
  degradation: DEGRADATION_CONFIG,
  xenobe: XENBE_CONFIG,
  trading: TRADING_CONFIG,
  facilities: FACILITY_CONFIG,
  server: SERVER_CONFIG,
} as const;

export type ClassicGameConfig = typeof CLASSIC_GAME_CONFIG;