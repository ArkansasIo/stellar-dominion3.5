export interface Destination {
  id: string;
  name: string;
  coordinates: string;
  distance: number; // Light years
  dangerLevel: "low" | "medium" | "high" | "extreme";
  type: "colony" | "asteroid" | "nebula" | "blackhole" | "station" | "gate";
  resources: {
    metal: "low" | "medium" | "high";
    crystal: "low" | "medium" | "high";
    deuterium: "low" | "medium" | "high";
  };
}

export const DESTINATIONS: Destination[] = [
  { id: "sol_earth", name: "Earth (Sol)", coordinates: "1:1:100:3", distance: 0, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "medium" } },
  { id: "sol_luna", name: "Luna Moon (Sol)", coordinates: "1:1:100:3:1", distance: 0.002, dangerLevel: "low", type: "colony", resources: { metal: "low", crystal: "low", deuterium: "high" } },
  { id: "sol_mars", name: "Mars (Sol)", coordinates: "1:1:100:4", distance: 0.003, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "medium", deuterium: "low" } },
  { id: "homeworld", name: "Homeworld", coordinates: "1:102:8", distance: 0.5, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "medium" } },
  { id: "alpha_centauri", name: "Alpha Centauri Outpost", coordinates: "1:102:9", distance: 4.3, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "low", deuterium: "medium" } },
  { id: "sirius_b", name: "Sirius Mining Belt", coordinates: "1:105:4", distance: 8.6, dangerLevel: "medium", type: "asteroid", resources: { metal: "high", crystal: "medium", deuterium: "low" } },
  { id: "proxima", name: "Proxima Station", coordinates: "1:110:2", distance: 12.5, dangerLevel: "low", type: "station", resources: { metal: "low", crystal: "low", deuterium: "high" } },
  { id: "orion_nebula", name: "Orion Nebula", coordinates: "2:040:1", distance: 1344, dangerLevel: "high", type: "nebula", resources: { metal: "low", crystal: "high", deuterium: "high" } },
  { id: "cygnus_x1", name: "Cygnus Black Hole", coordinates: "4:200:15", distance: 6000, dangerLevel: "extreme", type: "blackhole", resources: { metal: "low", crystal: "low", deuterium: "high" } },
  { id: "gate_terra", name: "Terra Gate", coordinates: "1:001:1", distance: 500, dangerLevel: "low", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" } },
  { id: "gate_luna", name: "Luna Gate", coordinates: "3:200:5", distance: 8000, dangerLevel: "medium", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" } },
];
