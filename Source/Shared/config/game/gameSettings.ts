/**
 * Game Settings Configuration
 * Core gameplay tunables: ticks, turns, production rates, and scheduler intervals.
 */

export const GAME_SETTINGS = {
  // Tick system
  schedTicks: 6,                // minutes between scheduler runs
  turnsPerTick: 3,              // turns granted per tick
  schedTurns: 2,                // new turns rate (includes towing, xenobe)
  schedPorts: 1,                // port production interval
  schedPlanets: 2,              // planet production interval
  schedIgb: 2,                  // IGB interest interval
  schedRanking: 30,             // ranking generation interval
  schedNews: 15,                // news generation interval
  schedDegrade: 6,              // sector fighter degradation
  schedApocalypse: 15,          // apocalypse events
  schedGovernor: 1,             // governor cleanup interval
  schedEmpire: 10,              // empire update interval

  // Game limits
  doomsdayValue: 190_000_000,   // colonists before apocalypse
  sectorMax: 1000,              // universe sectors
  linkMax: 10,                  // max links per sector
  universeSize: 500,            // distance multiplier for realspace
  maxRanks: 100,                // max ranks on leaderboard

  // Combat
  ratingCombatFactor: 0.8,
  mineHullSize: 2,
  ewdMaxHullSize: 15,
  fedMaxHull: 8,
  fedMaxScore: 1_000_000,

  // Newbie protection
  newbieNice: true,
  newbieHull: 8,
  newbieEngines: 8,
  newbiePower: 8,
  newbieComputer: 8,
  newbieSensors: 8,
  newbieArmor: 8,
  newbieShields: 8,
  newbieBeams: 8,
  newbieTorpLaunchers: 8,
  newbieCloak: 8,

  // Features
  allowFullscan: true,
  allowNavcomp: true,
  allowIbank: true,
  allowGenesisDestroy: true,
  serverClosed: false,
  accountCreationClosed: false,
} as const;

export type GameSettings = typeof GAME_SETTINGS;
