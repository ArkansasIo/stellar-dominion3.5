export interface Building {
  id: string;
  name: string;
  description: string;
  category: "resource" | "production" | "defense" | "utility";
  level: number;
  cost: { metal: number; crystal: number; deuterium: number };
  time: number; // seconds
  requirements?: { [key: string]: number }; // tech/building requirements
  production?: { metal?: number; crystal?: number; deuterium?: number; energy?: number };
  storage?: number;
  defense?: number;
}

export const OGAME_BUILDINGS: Building[] = [
  // Resource Collectors
  { id: "metalMine", name: "Metal Mine", description: "Produces metal.", category: "resource", level: 1, cost: { metal: 60, crystal: 15, deuterium: 0 }, time: 30, production: { metal: 30, energy: -10 } },
  { id: "crystalMine", name: "Crystal Mine", description: "Produces crystal.", category: "resource", level: 1, cost: { metal: 48, crystal: 24, deuterium: 0 }, time: 30, production: { crystal: 15, energy: -10 } },
  { id: "deuteriumSynthesizer", name: "Deuterium Synthesizer", description: "Produces deuterium.", category: "resource", level: 1, cost: { metal: 225, crystal: 75, deuterium: 0 }, time: 30, production: { deuterium: 10, energy: -20 } },
  { id: "solarPlant", name: "Solar Plant", description: "Produces energy.", category: "production", level: 1, cost: { metal: 75, crystal: 30, deuterium: 0 }, time: 30, production: { energy: 20 } },
  { id: "fusionReactor", name: "Fusion Reactor", description: "Advanced energy production.", category: "production", level: 1, cost: { metal: 900, crystal: 360, deuterium: 180 }, time: 30, production: { energy: 30 }, requirements: { deuteriumSynthesizer: 5 } },

  // Storage
  { id: "metalStorage", name: "Metal Storage", description: "Stores metal.", category: "utility", level: 1, cost: { metal: 1000, crystal: 0, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "crystalStorage", name: "Crystal Storage", description: "Stores crystal.", category: "utility", level: 1, cost: { metal: 1000, crystal: 500, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "deuteriumTank", name: "Deuterium Tank", description: "Stores deuterium.", category: "utility", level: 1, cost: { metal: 1000, crystal: 1000, deuterium: 0 }, time: 30, storage: 100000 },

  // Production
  { id: "roboticsFactory", name: "Robotics Factory", description: "Speeds up building construction.", category: "production", level: 1, cost: { metal: 400, crystal: 120, deuterium: 200 }, time: 30 },
  { id: "shipyard", name: "Shipyard", description: "Produces and repairs ships.", category: "production", level: 1, cost: { metal: 400, crystal: 200, deuterium: 100 }, time: 30 },
  { id: "researchLab", name: "Research Lab", description: "Conducts research.", category: "production", level: 1, cost: { metal: 200, crystal: 400, deuterium: 200 }, time: 30 },

  // Defense
  { id: "rocketLauncher", name: "Rocket Launcher", description: "Shoots rockets at attacking fleets.", category: "defense", level: 1, cost: { metal: 300, crystal: 100, deuterium: 0 }, time: 30, defense: 80 },
  { id: "lightLaserTurret", name: "Light Laser Turret", description: "Basic laser defense.", category: "defense", level: 1, cost: { metal: 1500, crystal: 500, deuterium: 0 }, time: 30, defense: 200 },
  { id: "heavyLaserTurret", name: "Heavy Laser Turret", description: "Advanced laser defense.", category: "defense", level: 1, cost: { metal: 6000, crystal: 2000, deuterium: 0 }, time: 30, defense: 500 },
  { id: "gauss Cannon", name: "Gauss Cannon", description: "Magnetic cannon defense.", category: "defense", level: 1, cost: { metal: 20000, crystal: 15000, deuterium: 2000 }, time: 30, defense: 1000 },
  { id: "ionCannon", name: "Ion Cannon", description: "Energy-based cannon.", category: "defense", level: 1, cost: { metal: 2000, crystal: 6000, deuterium: 0 }, time: 30, defense: 300 },
  { id: "plasmaTurret", name: "Plasma Turret", description: "Plasma defense.", category: "defense", level: 1, cost: { metal: 50000, crystal: 50000, deuterium: 30000 }, time: 30, defense: 3000 },

  // Shields
  { id: "smallShield", name: "Small Shield Dome", description: "Protects colony from attacks.", category: "defense", level: 1, cost: { metal: 10000, crystal: 10000, deuterium: 0 }, time: 30, defense: 2000 },
  { id: "largeShield", name: "Large Shield Dome", description: "Advanced protection.", category: "defense", level: 1, cost: { metal: 50000, crystal: 50000, deuterium: 0 }, time: 30, defense: 10000 },

  // Special
  { id: "allianceDepot", name: "Alliance Depot", description: "Trade with alliance members.", category: "utility", level: 1, cost: { metal: 20000, crystal: 40000, deuterium: 0 }, time: 30 },
  { id: "moonBase", name: "Lunar Base", description: "Establishes moon colony.", category: "utility", level: 1, cost: { metal: 54000, crystal: 108000, deuterium: 0 }, time: 30 },
  { id: "sensorPhalanx", name: "Sensor Phalanx", description: "Detects enemy fleets.", category: "utility", level: 1, cost: { metal: 8000, crystal: 4000, deuterium: 0 }, time: 30 },
  { id: "jumpGate", name: "Jump Gate", description: "Instant transport between galaxies.", category: "utility", level: 1, cost: { metal: 2000000, crystal: 4000000, deuterium: 0 }, time: 30 },
  { id: "terraformer", name: "Terraformer", description: "Expands planet fields.", category: "utility", level: 1, cost: { metal: 0, crystal: 50000, deuterium: 100000 }, time: 30 },
  { id: "spacePort", name: "Space Port", description: "Allows faster fleet movement.", category: "utility", level: 1, cost: { metal: 20000, crystal: 20000, deuterium: 0 }, time: 30 },
];

export const getBuildingCost = (building: Building, level: number) => {
  const multiplier = Math.pow(1.5, level - 1);
  return {
    metal: Math.ceil(building.cost.metal * multiplier),
    crystal: Math.ceil(building.cost.crystal * multiplier),
    deuterium: Math.ceil(building.cost.deuterium * multiplier),
  };
};

export const getBuildingTime = (building: Building, level: number, roboticsLevel: number = 0) => {
  const baseTime = building.time;
  const speedup = 1 - (roboticsLevel * 0.02); // 2% per robotics level
  return Math.ceil(baseTime * speedup);
};
