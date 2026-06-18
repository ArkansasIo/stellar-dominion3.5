import { 
  Satellite, Orbit, Radar, Anchor, Zap,
  Shield, Home, Warehouse, Container, 
  Radio, Plane, Share2
} from "lucide-react";

export type BaseType = "planet" | "moon" | "station";

export interface StationBuilding {
  id: string;
  name: string;
  description: string;
  type: BaseType;
  icon: any;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  costFactor: number;
  buildTime: number;
}

export const ORBITAL_BUILDINGS: StationBuilding[] = [
  // --- MOON FACILITIES ---
  {
    id: "lunarBase",
    name: "Lunar Base",
    description: "Establishes a foothold on the moon. Provides fields for further construction.",
    type: "moon",
    icon: Home,
    baseCost: { metal: 20000, crystal: 40000, deuterium: 20000 },
    costFactor: 2,
    buildTime: 86400
  },
  {
    id: "sensorPhalanx",
    name: "Sensor Phalanx",
    description: "High-resolution sensor array capable of scanning fleet movements on other planets.",
    type: "moon",
    icon: Radar,
    baseCost: { metal: 20000, crystal: 40000, deuterium: 20000 },
    costFactor: 2,
    buildTime: 43200
  },
  {
    id: "jumpGate",
    name: "Jump Gate",
    description: "Allows instant fleet travel between owned moons without resource cost.",
    type: "moon",
    icon: Orbit,
    baseCost: { metal: 2000000, crystal: 4000000, deuterium: 2000000 },
    costFactor: 2,
    buildTime: 172800
  },

  // --- STATION FACILITIES ---
  {
    id: "starbaseHub",
    name: "Starbase Command Hub",
    description: "Central command for the space station. Increases station structural integrity.",
    type: "station",
    icon: Satellite,
    baseCost: { metal: 50000, crystal: 50000, deuterium: 20000 },
    costFactor: 1.5,
    buildTime: 50000
  },
  {
    id: "orbitalShipyard",
    name: "Orbital Shipyard",
    description: "Zero-G manufacturing allows for faster construction of capital ships.",
    type: "station",
    icon: Anchor,
    baseCost: { metal: 10000, crystal: 5000, deuterium: 2000 },
    costFactor: 2,
    buildTime: 10000
  },
  {
    id: "tradeDock",
    name: "Trade Dock",
    description: "Increases trade income and allows larger transport ships to dock.",
    type: "station",
    icon: Container,
    baseCost: { metal: 5000, crystal: 5000, deuterium: 0 },
    costFactor: 2,
    buildTime: 8000
  },
  {
    id: "defenseGrid",
    name: "Orbital Defense Grid",
    description: "Automated turret network protecting the station from direct assault.",
    type: "station",
    icon: Shield,
    baseCost: { metal: 20000, crystal: 10000, deuterium: 5000 },
    costFactor: 2,
    buildTime: 20000
  }
];
