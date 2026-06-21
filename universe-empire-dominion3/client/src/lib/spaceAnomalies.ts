export interface SpaceAnomaly {
  id: string;
  name: string;
  type: "wormhole" | "asteroid_cluster" | "nebula_vein" | "supernova_remnant" | "quantum_field" | "derelict_station";
  coordinates: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  rewards: {
    metal: number;
    crystal: number;
    deuterium: number;
    xp: number;
    technology?: string;
  };
  discovered: boolean;
  discoveredBy?: string;
  discoveryDate?: number;
  hazardLevel: number; // 1-10
  researchRequired?: number; // Required astrophysics level
}

export const SPACE_ANOMALIES: SpaceAnomaly[] = [
  {
    id: "wormhole_1",
    name: "Stable Wormhole",
    type: "wormhole",
    coordinates: "1:150:5",
    rarity: "legendary",
    rewards: { metal: 50000, crystal: 75000, deuterium: 25000, xp: 10000, technology: "gravitonTech" },
    discovered: false,
    hazardLevel: 7,
    researchRequired: 5
  },
  {
    id: "asteroid_cluster_1",
    name: "Metallic Asteroid Field",
    type: "asteroid_cluster",
    coordinates: "1:200:8",
    rarity: "uncommon",
    rewards: { metal: 100000, crystal: 20000, deuterium: 10000, xp: 2000 },
    discovered: false,
    hazardLevel: 3,
    researchRequired: 1
  },
  {
    id: "nebula_vein_1",
    name: "Crystal Nebula Vein",
    type: "nebula_vein",
    coordinates: "2:100:12",
    rarity: "rare",
    rewards: { metal: 30000, crystal: 150000, deuterium: 30000, xp: 5000, technology: "quantumTech" },
    discovered: false,
    hazardLevel: 5,
    researchRequired: 3
  },
  {
    id: "supernova_1",
    name: "Supernova Remnant Cloud",
    type: "supernova_remnant",
    coordinates: "3:75:9",
    rarity: "epic",
    rewards: { metal: 80000, crystal: 80000, deuterium: 100000, xp: 8000 },
    discovered: false,
    hazardLevel: 9,
    researchRequired: 4
  },
  {
    id: "quantum_field_1",
    name: "Quantum Energy Field",
    type: "quantum_field",
    coordinates: "1:250:3",
    rarity: "epic",
    rewards: { metal: 10000, crystal: 10000, deuterium: 200000, xp: 6000, technology: "aiTech" },
    discovered: false,
    hazardLevel: 8,
    researchRequired: 6
  },
  {
    id: "derelict_station_1",
    name: "Ancient Space Station",
    type: "derelict_station",
    coordinates: "4:180:15",
    rarity: "legendary",
    rewards: { metal: 200000, crystal: 200000, deuterium: 150000, xp: 15000, technology: "hyperspaceTech" },
    discovered: false,
    hazardLevel: 10,
    researchRequired: 7
  },
  {
    id: "wormhole_2",
    name: "Shattered Wormhole Chain",
    type: "wormhole",
    coordinates: "5:088:11",
    rarity: "epic",
    rewards: { metal: 45000, crystal: 110000, deuterium: 90000, xp: 9000, technology: "wormholeTheory" },
    discovered: false,
    hazardLevel: 8,
    researchRequired: 6
  },
  {
    id: "derelict_station_2",
    name: "Sleeper Stronghold Ruin",
    type: "derelict_station",
    coordinates: "6:044:2",
    rarity: "legendary",
    rewards: { metal: 240000, crystal: 180000, deuterium: 120000, xp: 18000, technology: "fortressWarfare" },
    discovered: false,
    hazardLevel: 9,
    researchRequired: 8
  }
];

export function generateAnomalyForCoordinates(coordinates: string): SpaceAnomaly | null {
  const seed = coordinates.split(':').reduce((acc, val) => acc + parseInt(val) || 0, 0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  
  // 15% chance of anomaly
  if (random > 0.15) return null;
  
  const types: SpaceAnomaly["type"][] = ["wormhole", "asteroid_cluster", "nebula_vein", "supernova_remnant", "quantum_field"];
  const type = types[Math.floor(random * 10) % types.length];
  
  return {
    id: `anomaly_${coordinates}`,
    name: `Unknown ${type.replace(/_/g, ' ')}`,
    type,
    coordinates,
    rarity: random > 0.8 ? "legendary" : random > 0.6 ? "epic" : random > 0.4 ? "rare" : "uncommon",
    rewards: {
      metal: Math.floor(random * 100000),
      crystal: Math.floor(random * 100000),
      deuterium: Math.floor(random * 100000),
      xp: Math.floor(random * 5000)
    },
    discovered: false,
    hazardLevel: Math.ceil(random * 10)
  };
}
