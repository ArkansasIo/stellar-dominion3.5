export interface PlayerColony {
  id: string;
  name: string;
  type: "planet" | "moon" | "station";
  coordinates: string;
  systemName: string;
  class: string;
  owned: true;
  buildings: {
    [key: string]: number;
  };
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export const STARTING_COLONIES: PlayerColony[] = [
  {
    id: "colony_earth",
    name: "Earth",
    type: "planet",
    coordinates: "1:1:100:3",
    systemName: "Sol",
    class: "M",
    owned: true,
    buildings: {
      metalMine: 10,
      crystalMine: 8,
      deuteriumSynthesizer: 5,
      solarPlant: 12,
      roboticsFactory: 2,
      shipyard: 2,
      researchLab: 1,
    },
    resources: {
      metal: 50000,
      crystal: 50000,
      deuterium: 20000,
    }
  },
  {
    id: "colony_moon",
    name: "Luna",
    type: "moon",
    coordinates: "1:1:100:3:1",
    systemName: "Sol",
    class: "M",
    owned: true,
    buildings: {
      metalMine: 2,
      crystalMine: 2,
      deuteriumSynthesizer: 1,
      solarPlant: 3,
      roboticsFactory: 0,
      shipyard: 0,
      researchLab: 1,
    },
    resources: {
      metal: 10000,
      crystal: 10000,
      deuterium: 5000,
    }
  }
];

export const SOL_SYSTEM = {
  id: "sol",
  name: "Sol System",
  coordinates: "1:1:100",
  activity: 95,
  planets: [
    { id: "mercury", name: "Mercury", class: "R", coordinates: "1:1:100:1", owner: "Neutral" },
    { id: "venus", name: "Venus", class: "V", coordinates: "1:1:100:2", owner: "Neutral" },
    { id: "earth", name: "Earth", class: "M", coordinates: "1:1:100:3", owner: "Commander", moon: "Luna" },
    { id: "mars", name: "Mars", class: "D", coordinates: "1:1:100:4", owner: "Player_412" },
  ],
  moons: [
    { id: "luna", name: "Luna", parentCoordinates: "1:1:100:3", class: "M", owner: "Commander" }
  ]
};
