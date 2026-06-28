export const DEFAULT_RAPIDFIRE: Record<string, Record<string, number>> = {
  lightFighter: { espionageProbe: 5, solarSatellite: 5 },
  heavyFighter: { espionageProbe: 5, solarSatellite: 5, smallCargo: 3 },
  cruiser: { espionageProbe: 5, solarSatellite: 5, lightFighter: 6, rocketLauncher: 10 },
  battleship: { espionageProbe: 5, solarSatellite: 5 },
  battlecruiser: { espionageProbe: 5, solarSatellite: 5, smallCargo: 3, largeCargo: 3, lightFighter: 3, heavyFighter: 3, cruiser: 4 },
  bomber: { espionageProbe: 5, solarSatellite: 5, rocketLauncher: 20, lightLaser: 20, heavyLaser: 10, ionCannon: 10 },
  destroyer: { espionageProbe: 5, solarSatellite: 5, lightLaser: 10, battlecruiser: 2 },
  deathstar: { espionageProbe: 1250, solarSatellite: 1250, smallCargo: 250, largeCargo: 250, lightFighter: 200, heavyFighter: 100, cruiser: 33, battleship: 30, battlecruiser: 15, bomber: 25, destroyer: 5, recycler: 250, rocketLauncher: 200, lightLaser: 200, heavyLaser: 100, gaussCannon: 50, ionCannon: 100, plasmaTurret: 100 },
  smallCargo: { espionageProbe: 5, solarSatellite: 5 },
  largeCargo: { espionageProbe: 5, solarSatellite: 5 },
  colonyShip: { espionageProbe: 5, solarSatellite: 5 },
  recycler: { espionageProbe: 5, solarSatellite: 5 },
  espionageProbe: {},
  solarSatellite: {},
};

export interface OGameShipStats {
  id: string;
  machineName: string;
  name: string;
  structuralIntegrity: number;
  shield: number;
  attack: number;
  cargoCapacity: number;
  speed: number;
  fuelConsumption: number;
  rapidfire: Record<string, number>;
  unitType: "ship" | "defense";
  metalCost: number;
  crystalCost: number;
  deuteriumCost: number;
}

export const OGameShipDatabase: Record<string, OGameShipStats> = {
  lightFighter: { id: "lightFighter", machineName: "light_fighter", name: "Light Fighter", structuralIntegrity: 4000, shield: 10, attack: 50, cargoCapacity: 50, speed: 12500, fuelConsumption: 20, rapidfire: DEFAULT_RAPIDFIRE.lightFighter, unitType: "ship", metalCost: 3000, crystalCost: 1000, deuteriumCost: 0 },
  heavyFighter: { id: "heavyFighter", machineName: "heavy_fighter", name: "Heavy Fighter", structuralIntegrity: 10000, shield: 25, attack: 150, cargoCapacity: 100, speed: 10000, fuelConsumption: 75, rapidfire: DEFAULT_RAPIDFIRE.heavyFighter, unitType: "ship", metalCost: 6000, crystalCost: 4000, deuteriumCost: 0 },
  cruiser: { id: "cruiser", machineName: "cruiser", name: "Cruiser", structuralIntegrity: 27000, shield: 50, attack: 400, cargoCapacity: 800, speed: 15000, fuelConsumption: 300, rapidfire: DEFAULT_RAPIDFIRE.cruiser, unitType: "ship", metalCost: 20000, crystalCost: 7000, deuteriumCost: 2000 },
  battleship: { id: "battleship", machineName: "battleship", name: "Battleship", structuralIntegrity: 60000, shield: 200, attack: 1000, cargoCapacity: 1500, speed: 10000, fuelConsumption: 500, rapidfire: DEFAULT_RAPIDFIRE.battleship, unitType: "ship", metalCost: 45000, crystalCost: 15000, deuteriumCost: 0 },
  battlecruiser: { id: "battlecruiser", machineName: "battlecruiser", name: "Battlecruiser", structuralIntegrity: 70000, shield: 400, attack: 700, cargoCapacity: 750, speed: 15000, fuelConsumption: 250, rapidfire: DEFAULT_RAPIDFIRE.battlecruiser, unitType: "ship", metalCost: 30000, crystalCost: 40000, deuteriumCost: 15000 },
  bomber: { id: "bomber", machineName: "bomber", name: "Bomber", structuralIntegrity: 75000, shield: 500, attack: 1000, cargoCapacity: 500, speed: 5000, fuelConsumption: 1000, rapidfire: DEFAULT_RAPIDFIRE.bomber, unitType: "ship", metalCost: 50000, crystalCost: 25000, deuteriumCost: 15000 },
  destroyer: { id: "destroyer", machineName: "destroyer", name: "Destroyer", structuralIntegrity: 110000, shield: 500, attack: 2000, cargoCapacity: 2000, speed: 5000, fuelConsumption: 1000, rapidfire: DEFAULT_RAPIDFIRE.destroyer, unitType: "ship", metalCost: 60000, crystalCost: 50000, deuteriumCost: 15000 },
  deathstar: { id: "deathstar", machineName: "deathstar", name: "Deathstar", structuralIntegrity: 9000000, shield: 50000, attack: 200000, cargoCapacity: 1000000, speed: 100, fuelConsumption: 1, rapidfire: DEFAULT_RAPIDFIRE.deathstar, unitType: "ship", metalCost: 5000000, crystalCost: 4000000, deuteriumCost: 1000000 },
  smallCargo: { id: "smallCargo", machineName: "small_cargo", name: "Small Cargo", structuralIntegrity: 4000, shield: 10, attack: 5, cargoCapacity: 5000, speed: 5000, fuelConsumption: 20, rapidfire: DEFAULT_RAPIDFIRE.smallCargo, unitType: "ship", metalCost: 2000, crystalCost: 2000, deuteriumCost: 0 },
  largeCargo: { id: "largeCargo", machineName: "large_cargo", name: "Large Cargo", structuralIntegrity: 12000, shield: 25, attack: 5, cargoCapacity: 25000, speed: 7500, fuelConsumption: 50, rapidfire: DEFAULT_RAPIDFIRE.largeCargo, unitType: "ship", metalCost: 6000, crystalCost: 6000, deuteriumCost: 0 },
  colonyShip: { id: "colonyShip", machineName: "colony_ship", name: "Colony Ship", structuralIntegrity: 30000, shield: 100, attack: 50, cargoCapacity: 7500, speed: 2500, fuelConsumption: 1000, rapidfire: DEFAULT_RAPIDFIRE.colonyShip, unitType: "ship", metalCost: 10000, crystalCost: 20000, deuteriumCost: 10000 },
  recycler: { id: "recycler", machineName: "recycler", name: "Recycler", structuralIntegrity: 16000, shield: 10, attack: 1, cargoCapacity: 20000, speed: 2000, fuelConsumption: 300, rapidfire: DEFAULT_RAPIDFIRE.recycler, unitType: "ship", metalCost: 10000, crystalCost: 6000, deuteriumCost: 2000 },
  espionageProbe: { id: "espionageProbe", machineName: "espionage_probe", name: "Espionage Probe", structuralIntegrity: 1000, shield: 0, attack: 0, cargoCapacity: 5, speed: 100000000, fuelConsumption: 1, rapidfire: { }, unitType: "ship", metalCost: 0, crystalCost: 1000, deuteriumCost: 0 },
  solarSatellite: { id: "solarSatellite", machineName: "solar_satellite", name: "Solar Satellite", structuralIntegrity: 2000, shield: 1, attack: 1, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "ship", metalCost: 0, crystalCost: 2000, deuteriumCost: 500 },
  rocketLauncher: { id: "rocketLauncher", machineName: "rocket_launcher", name: "Rocket Launcher", structuralIntegrity: 2000, shield: 20, attack: 80, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 2000, crystalCost: 0, deuteriumCost: 0 },
  lightLaser: { id: "lightLaser", machineName: "light_laser", name: "Light Laser", structuralIntegrity: 2000, shield: 25, attack: 100, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 1500, crystalCost: 500, deuteriumCost: 0 },
  heavyLaser: { id: "heavyLaser", machineName: "heavy_laser", name: "Heavy Laser", structuralIntegrity: 8000, shield: 100, attack: 250, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 6000, crystalCost: 2000, deuteriumCost: 0 },
  gaussCannon: { id: "gaussCannon", machineName: "gauss_cannon", name: "Gauss Cannon", structuralIntegrity: 35000, shield: 200, attack: 1100, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 20000, crystalCost: 15000, deuteriumCost: 2000 },
  ionCannon: { id: "ionCannon", machineName: "ion_cannon", name: "Ion Cannon", structuralIntegrity: 8000, shield: 500, attack: 150, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 2000, crystalCost: 6000, deuteriumCost: 0 },
  plasmaTurret: { id: "plasmaTurret", machineName: "plasma_turret", name: "Plasma Turret", structuralIntegrity: 100000, shield: 300, attack: 3000, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 50000, crystalCost: 50000, deuteriumCost: 30000 },
  smallShieldDome: { id: "smallShieldDome", machineName: "small_shield_dome", name: "Small Shield Dome", structuralIntegrity: 20000, shield: 2000, attack: 1, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 10000, crystalCost: 10000, deuteriumCost: 0 },
  largeShieldDome: { id: "largeShieldDome", machineName: "large_shield_dome", name: "Large Shield Dome", structuralIntegrity: 50000, shield: 10000, attack: 1, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 25000, crystalCost: 25000, deuteriumCost: 0 },
  antiBallisticMissile: { id: "antiBallisticMissile", machineName: "anti_ballistic_missile", name: "Anti-Ballistic Missile", structuralIntegrity: 8000, shield: 1, attack: 1, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 8000, crystalCost: 0, deuteriumCost: 2000 },
  interplanetaryMissile: { id: "interplanetaryMissile", machineName: "interplanetary_missile", name: "Interplanetary Missile", structuralIntegrity: 15000, shield: 1, attack: 12000, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { }, unitType: "defense", metalCost: 12500, crystalCost: 2500, deuteriumCost: 10000 },
  interceptor: { id: "interceptor", machineName: "interceptor", name: "Interceptor", structuralIntegrity: 8000, shield: 30, attack: 200, cargoCapacity: 0, speed: 18000, fuelConsumption: 100, rapidfire: { lightFighter: 3, heavyFighter: 2, espionageProbe: 5 }, unitType: "ship", metalCost: 8000, crystalCost: 3000, deuteriumCost: 500 },
  carrier: { id: "carrier", machineName: "carrier", name: "Carrier", structuralIntegrity: 120000, shield: 600, attack: 400, cargoCapacity: 20000, speed: 7000, fuelConsumption: 800, rapidfire: { lightFighter: 5, heavyFighter: 4, cruiser: 2, espionageProbe: 5 }, unitType: "ship", metalCost: 80000, crystalCost: 40000, deuteriumCost: 20000 },
  dreadnought: { id: "dreadnought", machineName: "dreadnought", name: "Dreadnought", structuralIntegrity: 250000, shield: 1500, attack: 4000, cargoCapacity: 5000, speed: 4000, fuelConsumption: 1500, rapidfire: { battleship: 2, cruiser: 5, destroyer: 2, espionageProbe: 5 }, unitType: "ship", metalCost: 150000, crystalCost: 80000, deuteriumCost: 40000 },
  titan: { id: "titan", machineName: "titan", name: "Titan", structuralIntegrity: 1000000, shield: 8000, attack: 15000, cargoCapacity: 50000, speed: 2000, fuelConsumption: 3000, rapidfire: { destroyer: 3, battleship: 4, cruiser: 10, lightFighter: 20, heavyFighter: 15, espionageProbe: 5 }, unitType: "ship", metalCost: 500000, crystalCost: 300000, deuteriumCost: 150000 },
  flagship: { id: "flagship", machineName: "flagship", name: "Flagship", structuralIntegrity: 500000, shield: 4000, attack: 8000, cargoCapacity: 25000, speed: 3000, fuelConsumption: 2000, rapidfire: { battlecruiser: 3, cruiser: 6, destroyer: 2, espionageProbe: 5 }, unitType: "ship", metalCost: 300000, crystalCost: 200000, deuteriumCost: 100000 },
  explorer: { id: "explorer", machineName: "explorer", name: "Explorer", structuralIntegrity: 15000, shield: 50, attack: 10, cargoCapacity: 5000, speed: 20000, fuelConsumption: 50, rapidfire: { espionageProbe: 5 }, unitType: "ship", metalCost: 8000, crystalCost: 12000, deuteriumCost: 4000 },
  terraformShip: { id: "terraformShip", machineName: "terraform_ship", name: "Terraform Ship", structuralIntegrity: 50000, shield: 100, attack: 5, cargoCapacity: 100000, speed: 1500, fuelConsumption: 500, rapidfire: {}, unitType: "ship", metalCost: 30000, crystalCost: 50000, deuteriumCost: 20000 },
  scienceVessel: { id: "scienceVessel", machineName: "science_vessel", name: "Science Vessel", structuralIntegrity: 20000, shield: 80, attack: 10, cargoCapacity: 2000, speed: 12000, fuelConsumption: 80, rapidfire: {}, unitType: "ship", metalCost: 12000, crystalCost: 25000, deuteriumCost: 8000 },
  repairShip: { id: "repairShip", machineName: "repair_ship", name: "Repair Ship", structuralIntegrity: 40000, shield: 200, attack: 5, cargoCapacity: 0, speed: 6000, fuelConsumption: 200, rapidfire: {}, unitType: "ship", metalCost: 20000, crystalCost: 15000, deuteriumCost: 10000 },
  miningShip: { id: "miningShip", machineName: "mining_ship", name: "Mining Ship", structuralIntegrity: 25000, shield: 50, attack: 5, cargoCapacity: 50000, speed: 4000, fuelConsumption: 150, rapidfire: {}, unitType: "ship", metalCost: 10000, crystalCost: 8000, deuteriumCost: 3000 },
  salvageShip: { id: "salvageShip", machineName: "salvage_ship", name: "Salvage Ship", structuralIntegrity: 20000, shield: 30, attack: 3, cargoCapacity: 30000, speed: 5000, fuelConsumption: 100, rapidfire: {}, unitType: "ship", metalCost: 8000, crystalCost: 10000, deuteriumCost: 5000 },
  constructionShip: { id: "constructionShip", machineName: "construction_ship", name: "Construction Ship", structuralIntegrity: 30000, shield: 80, attack: 3, cargoCapacity: 40000, speed: 3000, fuelConsumption: 250, rapidfire: {}, unitType: "ship", metalCost: 15000, crystalCost: 12000, deuteriumCost: 8000 },
  hospitalShip: { id: "hospitalShip", machineName: "hospital_ship", name: "Hospital Ship", structuralIntegrity: 35000, shield: 150, attack: 2, cargoCapacity: 5000, speed: 5000, fuelConsumption: 180, rapidfire: {}, unitType: "ship", metalCost: 18000, crystalCost: 20000, deuteriumCost: 10000 },
  missileBattery: { id: "missileBattery", machineName: "missile_battery", name: "Missile Battery", structuralIntegrity: 15000, shield: 50, attack: 500, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: {}, unitType: "defense", metalCost: 12000, crystalCost: 3000, deuteriumCost: 5000 },
  orbitalDefensePlatform: { id: "orbitalDefensePlatform", machineName: "orbital_defense_platform", name: "Orbital Defense Platform", structuralIntegrity: 80000, shield: 800, attack: 1500, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { lightFighter: 3, heavyFighter: 2, espionageProbe: 5 }, unitType: "defense", metalCost: 50000, crystalCost: 30000, deuteriumCost: 15000 },
  planetaryCannon: { id: "planetaryCannon", machineName: "planetary_cannon", name: "Planetary Cannon", structuralIntegrity: 200000, shield: 500, attack: 5000, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { battleship: 2, cruiser: 4, destroyer: 2, espionageProbe: 5 }, unitType: "defense", metalCost: 150000, crystalCost: 100000, deuteriumCost: 50000 },
  defenseSatellites: { id: "defenseSatellites", machineName: "defense_satellites", name: "Defense Satellites", structuralIntegrity: 5000, shield: 100, attack: 100, cargoCapacity: 0, speed: 0, fuelConsumption: 0, rapidfire: { espionageProbe: 5 }, unitType: "defense", metalCost: 5000, crystalCost: 2000, deuteriumCost: 1000 },
};
