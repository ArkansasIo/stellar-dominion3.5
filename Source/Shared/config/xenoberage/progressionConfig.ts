export const PROGRESSION_CONFIG = {
  upgradeCost: 1000,
  upgradeFactor: 2,
  levelFactor: 1.5,
  maxUpgradesDevices: 45,
  startFighters: 10,
  startArmor: 10,
  startCredits: 1000,
  startEnergy: 100,
  startTurns: 1200,
  startLssd: false,
  startEditors: 0,
  startMinedeflectors: 0,
  startEmerwarp: 0,
  startBeacon: 0,
  startGenesis: 1,
  startEscape: false,
  startScoop: false,
  maxTurns: 2500,
  maxEmerwarp: 10,
  maxGenesis: 10,
  maxBeacons: 10,
  maxWarpedit: 10,
} as const;

export interface ShipEquipment {
  hull: number;
  engines: number;
  power: number;
  computer: number;
  sensors: number;
  armor: number;
  shields: number;
  beams: number;
  torpLaunchers: number;
  cloak: number;
}

export interface DeviceInventory {
  genesis: number;
  beacon: number;
  emerwarp: number;
  warpedit: number;
  minedeflector: number;
  escapepod: boolean;
  fuelscoop: boolean;
  lssd: boolean;
}

export type ProgressionConfig = typeof PROGRESSION_CONFIG;

export const PROGRESSION = PROGRESSION_CONFIG;
