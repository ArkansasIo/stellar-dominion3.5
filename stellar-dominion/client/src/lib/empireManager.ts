export interface EmpireColony {
  id: string;
  name: string;
  type: "planet" | "moon" | "station";
  coordinates: string;
  systemName: string;
  class: string;
  status: "active" | "colonizing" | "abandoned" | "empty";
  owner: boolean; // true if player owns it
  buildings: {
    [key: string]: number;
  };
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  population: number;
  defenses: number;
  unitCount: number;
}

export interface PlayerEmpire {
  totalSlots: number;
  usedSlots: number;
  colonies: EmpireColony[];
  currentCapital: string; // Coordinate of capital planet
  totalPopulation: number;
  totalDefenses: number;
}

export const EMPIRE_SLOTS_LIMIT = 20;

// 20 Colonizable locations in Sol System
export const SOL_SYSTEM_COLONIES: EmpireColony[] = [
  // Main planets (already owned)
  {
    id: "colony_earth",
    name: "Earth",
    type: "planet",
    coordinates: "1:1:100:3",
    systemName: "Sol",
    class: "M",
    status: "active",
    owner: true,
    buildings: {
      metalMine: 10,
      crystalMine: 8,
      deuteriumSynthesizer: 5,
      solarPlant: 12,
      roboticsFactory: 2,
      shipyard: 2,
      researchLab: 1,
    },
    resources: { metal: 50000, crystal: 50000, deuterium: 20000 },
    population: 1000000,
    defenses: 50,
    unitCount: 150
  },
  {
    id: "colony_luna",
    name: "Luna",
    type: "moon",
    coordinates: "1:1:100:3:1",
    systemName: "Sol",
    class: "M",
    status: "active",
    owner: true,
    buildings: {
      metalMine: 2,
      crystalMine: 2,
      deuteriumSynthesizer: 1,
      solarPlant: 3,
      roboticsFactory: 0,
      shipyard: 0,
      researchLab: 1,
    },
    resources: { metal: 10000, crystal: 10000, deuterium: 5000 },
    population: 50000,
    defenses: 10,
    unitCount: 30
  },
  
  // Colonizable planets and moons (empty slots)
  {
    id: "colony_mercury",
    name: "Mercury",
    type: "planet",
    coordinates: "1:1:100:1",
    systemName: "Sol",
    class: "R",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_venus",
    name: "Venus",
    type: "planet",
    coordinates: "1:1:100:2",
    systemName: "Sol",
    class: "V",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_mars",
    name: "Mars",
    type: "planet",
    coordinates: "1:1:100:4",
    systemName: "Sol",
    class: "D",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_phobos",
    name: "Phobos",
    type: "moon",
    coordinates: "1:1:100:4:1",
    systemName: "Sol",
    class: "A",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_deimos",
    name: "Deimos",
    type: "moon",
    coordinates: "1:1:100:4:2",
    systemName: "Sol",
    class: "A",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_jupiter",
    name: "Jupiter",
    type: "planet",
    coordinates: "1:1:100:5",
    systemName: "Sol",
    class: "G",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_io",
    name: "Io",
    type: "moon",
    coordinates: "1:1:100:5:1",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_europa",
    name: "Europa",
    type: "moon",
    coordinates: "1:1:100:5:2",
    systemName: "Sol",
    class: "I",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_ganymede",
    name: "Ganymede",
    type: "moon",
    coordinates: "1:1:100:5:3",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_callisto",
    name: "Callisto",
    type: "moon",
    coordinates: "1:1:100:5:4",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_saturn",
    name: "Saturn",
    type: "planet",
    coordinates: "1:1:100:6",
    systemName: "Sol",
    class: "G",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_titan",
    name: "Titan",
    type: "moon",
    coordinates: "1:1:100:6:1",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_enceladus",
    name: "Enceladus",
    type: "moon",
    coordinates: "1:1:100:6:2",
    systemName: "Sol",
    class: "I",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_uranus",
    name: "Uranus",
    type: "planet",
    coordinates: "1:1:100:7",
    systemName: "Sol",
    class: "I",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_titania",
    name: "Titania",
    type: "moon",
    coordinates: "1:1:100:7:1",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_oberon",
    name: "Oberon",
    type: "moon",
    coordinates: "1:1:100:7:2",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_neptune",
    name: "Neptune",
    type: "planet",
    coordinates: "1:1:100:8",
    systemName: "Sol",
    class: "I",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_triton",
    name: "Triton",
    type: "moon",
    coordinates: "1:1:100:8:1",
    systemName: "Sol",
    class: "M",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_pluto",
    name: "Pluto",
    type: "planet",
    coordinates: "1:1:100:9",
    systemName: "Sol",
    class: "P",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
  {
    id: "colony_charon",
    name: "Charon",
    type: "moon",
    coordinates: "1:1:100:9:1",
    systemName: "Sol",
    class: "P",
    status: "empty",
    owner: false,
    buildings: {},
    resources: { metal: 0, crystal: 0, deuterium: 0 },
    population: 0,
    defenses: 0,
    unitCount: 0
  },
];

export function initializePlayerEmpire(): PlayerEmpire {
  return {
    totalSlots: EMPIRE_SLOTS_LIMIT,
    usedSlots: SOL_SYSTEM_COLONIES.filter(c => c.owner).length,
    colonies: SOL_SYSTEM_COLONIES,
    currentCapital: "1:1:100:3", // Earth
    totalPopulation: SOL_SYSTEM_COLONIES.reduce((acc, c) => acc + c.population, 0),
    totalDefenses: SOL_SYSTEM_COLONIES.reduce((acc, c) => acc + c.defenses, 0),
  };
}
