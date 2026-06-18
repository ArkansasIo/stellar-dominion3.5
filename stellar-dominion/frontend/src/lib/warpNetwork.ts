export interface WarpGate {
  id: string;
  name: string;
  coordinates: string;
  level: number; // 1-10, affects travel time and energy
  owned: boolean;
  owner?: string;
  linkedGates: string[]; // IDs of connected gates
  energyCost: number; // deuterium per jump
  constructionTime: number; // seconds to build
  cooldown: number; // seconds between jumps
}

export interface TradeRoute {
  id: string;
  from: string;
  to: string;
  resource: "metal" | "crystal" | "deuterium";
  profit: number; // percentage profit
  distance: number;
  risk: number; // 1-10
  active: boolean;
  frequency: number; // hours between trades
}

export const WARP_GATES: WarpGate[] = [
  {
    id: "gate_homeworld",
    name: "Homeworld Gate",
    coordinates: "1:102:8",
    level: 10,
    owned: true,
    owner: "Commander",
    linkedGates: ["gate_alpha", "gate_proxima", "gate_outpost"],
    energyCost: 500,
    constructionTime: 0,
    cooldown: 300
  },
  {
    id: "gate_alpha",
    name: "Alpha Centauri Gate",
    coordinates: "1:102:9",
    level: 8,
    owned: true,
    owner: "Commander",
    linkedGates: ["gate_homeworld", "gate_sirius"],
    energyCost: 800,
    constructionTime: 0,
    cooldown: 300
  },
  {
    id: "gate_sirius",
    name: "Sirius Gate",
    coordinates: "1:105:4",
    level: 6,
    owned: false,
    linkedGates: ["gate_alpha", "gate_proxima"],
    energyCost: 1200,
    constructionTime: 3600,
    cooldown: 300
  },
  {
    id: "gate_proxima",
    name: "Proxima Station Gate",
    coordinates: "1:110:2",
    level: 9,
    owned: true,
    owner: "Commander",
    linkedGates: ["gate_homeworld", "gate_sirius", "gate_nebula"],
    energyCost: 600,
    constructionTime: 0,
    cooldown: 300
  },
  {
    id: "gate_nebula",
    name: "Nebula Gate",
    coordinates: "2:040:1",
    level: 5,
    owned: false,
    linkedGates: ["gate_proxima"],
    energyCost: 2000,
    constructionTime: 7200,
    cooldown: 300
  },
  {
    id: "gate_outpost",
    name: "Outpost Gate",
    coordinates: "1:001:1",
    level: 4,
    owned: false,
    linkedGates: ["gate_homeworld"],
    energyCost: 1500,
    constructionTime: 5400,
    cooldown: 300
  }
];

export const TRADE_ROUTES: TradeRoute[] = [
  {
    id: "route_metal_1",
    from: "1:102:8",
    to: "1:105:4",
    resource: "metal",
    profit: 25,
    distance: 3,
    risk: 2,
    active: true,
    frequency: 1
  },
  {
    id: "route_crystal_1",
    from: "1:105:4",
    to: "1:110:2",
    resource: "crystal",
    profit: 40,
    distance: 5,
    risk: 4,
    active: true,
    frequency: 2
  },
  {
    id: "route_deut_1",
    from: "1:110:2",
    to: "1:102:8",
    resource: "deuterium",
    profit: 35,
    distance: 8,
    risk: 3,
    active: true,
    frequency: 1
  },
  {
    id: "route_high_risk",
    from: "1:102:8",
    to: "2:040:1",
    resource: "metal",
    profit: 100,
    distance: 1344,
    risk: 9,
    active: false,
    frequency: 4
  }
];

export function calculateWarpTime(gateLevel: number, distance: number): number {
  // Base time 300 seconds, reduced by gate level, increased by distance
  return Math.max(60, 300 - (gateLevel * 20) + (distance * 10));
}

export function calculateWarpCost(gateLevel: number, distance: number): number {
  // Base cost 500 deuterium
  return Math.ceil(500 * (1 + (distance / 100)));
}
