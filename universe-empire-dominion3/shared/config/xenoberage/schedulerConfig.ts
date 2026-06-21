export const SCHEDULER_CONFIG = {
  ticks: 6,
  turnsPerTick: 3,
  schedTurns: 2,
  schedPorts: 1,
  schedPlanets: 2,
  schedIgb: 2,
  schedRanking: 30,
  schedNews: 15,
  schedDegrade: 6,
  schedApocalypse: 15,
  schedTheGovernor: 1,
  schedEmpire: 10,
} as const;

export type SchedulerConfig = typeof SCHEDULER_CONFIG;

export const NEWBIE_CONFIG = {
  nice: true,
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
} as const;
