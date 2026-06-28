export type PowerResource =
  | "energy"
  | "metal"
  | "crystal"
  | "deuterium"
  | "helium3"
  | "antimatter"
  | "exoticMatter"
  | "quantumCores";

export type GridPriority = "civilian" | "industry" | "research" | "defense";
export type AiDoctrine = "balanced" | "growth" | "science" | "fortress" | "survival";

export interface ResourceCost {
  metal?: number;
  crystal?: number;
  deuterium?: number;
  helium3?: number;
  antimatter?: number;
  exoticMatter?: number;
  quantumCores?: number;
}

export interface EnergySource {
  id: string;
  name: string;
  family: string;
  output: number;
  stability: number;
  ramp: string;
  worlds: string[];
  fuel: string;
  byproducts: string[];
  risk: string;
}

export interface TransmissionSystem {
  id: string;
  name: string;
  range: string;
  efficiency: number;
  throughput: number;
  purpose: string;
  counterplay: string;
}

export interface GridNode {
  id: string;
  name: string;
  bodyType: "star" | "planet" | "moon" | "field" | "station";
  role: string;
  generation: number;
  demand: number;
  storage: number;
  integrity: number;
  latency: number;
  resources: string[];
}

export interface PowerTechnology {
  id: string;
  era: number;
  branch: "Generation" | "Transmission" | "Storage" | "AI Control" | "Extraction";
  name: string;
  description: string;
  effect: string;
  researchCost: number;
  prerequisites: string[];
  resourceCost: ResourceCost;
}

export const ENERGY_SOURCES: EnergySource[] = [
  {
    id: "fusion",
    name: "Helium-3 Fusion Arcologies",
    family: "Fusion",
    output: 420,
    stability: 96,
    ramp: "Fast",
    worlds: ["Planets", "Moons", "Stations"],
    fuel: "Helium-3 + deuterium",
    byproducts: ["Heat", "Industrial plasma"],
    risk: "Fuel interruption and magnetic containment damage",
  },
  {
    id: "orbital-solar",
    name: "Orbital Solar Crown",
    family: "Stellar Solar",
    output: 780,
    stability: 88,
    ramp: "Instant",
    worlds: ["Stars", "Inner planets"],
    fuel: "Stellar radiation",
    byproducts: ["Photon data", "Solar wind isotopes"],
    risk: "Flares, collector drift, and relay occlusion",
  },
  {
    id: "dyson",
    name: "Dyson Swarm Collector Cloud",
    family: "Megastructure",
    output: 4200,
    stability: 92,
    ramp: "Slow",
    worlds: ["Stars"],
    fuel: "Stellar output",
    byproducts: ["Antimatter seed charge", "Coronal telemetry"],
    risk: "Cascade collisions and hostile capture of collector bands",
  },
  {
    id: "geothermal",
    name: "Mantle Tap Geothermal Web",
    family: "Geothermal",
    output: 260,
    stability: 99,
    ramp: "Medium",
    worlds: ["Volcanic planets", "Tidal moons"],
    fuel: "Planetary heat",
    byproducts: ["Rare earths", "Silicates"],
    risk: "Crust instability and habitat heat saturation",
  },
  {
    id: "antimatter",
    name: "Antimatter Catalysis Station",
    family: "Antimatter",
    output: 1600,
    stability: 73,
    ramp: "Fast",
    worlds: ["Moons", "Deep-space stations"],
    fuel: "Antimatter + magnetic bottle cores",
    byproducts: ["Gamma flux", "Exotic particles"],
    risk: "Catastrophic containment breach",
  },
  {
    id: "singularity",
    name: "Micro-Singularity Penrose Engine",
    family: "Exotic",
    output: 6800,
    stability: 81,
    ramp: "Slow",
    worlds: ["Fortress moons", "Black-hole stations"],
    fuel: "Accretion mass",
    byproducts: ["Exotic matter", "Gravitic telemetry"],
    risk: "Frame-drag instability and irreversible node loss",
  },
];

export const TRANSMISSION_SYSTEMS: TransmissionSystem[] = [
  { id: "surface", name: "Superconductive Planetary Grid", range: "Planetary", efficiency: 98, throughput: 1400, purpose: "Cities, industry, shields, and launch infrastructure", counterplay: "Sabotage substations or overload equatorial trunks" },
  { id: "microwave", name: "Microwave Beaming Constellation", range: "Planet-to-moon", efficiency: 91, throughput: 900, purpose: "Reliable orbital and lunar baseload", counterplay: "Weather, debris, and receiver denial" },
  { id: "laser", name: "Coherent Laser Transmission Array", range: "Interplanetary", efficiency: 86, throughput: 1800, purpose: "High-density power lanes between aligned worlds", counterplay: "Line-of-sight interruption and mirror-array damage" },
  { id: "relay", name: "Orbital Power Relay", range: "System-wide", efficiency: 93, throughput: 2400, purpose: "Routing, buffering, frequency conversion, and emergency islands", counterplay: "Relay capture partitions the network" },
  { id: "quantum", name: "Quantum Command Node", range: "Interstellar control", efficiency: 100, throughput: 0, purpose: "Near-instant control signals, authentication, and synchronized load balancing", counterplay: "Entanglement poisoning and false telemetry" },
  { id: "wormhole", name: "Wormhole Energy Conduit", range: "Interstellar power", efficiency: 79, throughput: 7200, purpose: "Late-game power exchange between star systems", counterplay: "Stability collapse and destination interdiction" },
];

export const GRID_NODES: GridNode[] = [
  { id: "helios", name: "Helios Prime", bodyType: "star", role: "Primary generation nexus", generation: 6150, demand: 420, storage: 1600, integrity: 94, latency: 2, resources: ["Photon flux", "Antimatter seeds"] },
  { id: "aurelia", name: "Aurelia", bodyType: "planet", role: "Capital and research world", generation: 920, demand: 1840, storage: 1300, integrity: 91, latency: 8, resources: ["Crystal", "Quantum cores"] },
  { id: "vulcan", name: "Vulcan Reach", bodyType: "planet", role: "Forge world", generation: 1380, demand: 2120, storage: 780, integrity: 86, latency: 14, resources: ["Metal", "Rare earths"] },
  { id: "selene", name: "Selene Bastion", bodyType: "moon", role: "Defense and antimatter reserve", generation: 1750, demand: 980, storage: 2200, integrity: 97, latency: 11, resources: ["Helium-3", "Antimatter"] },
  { id: "khepri", name: "Khepri Resource Field", bodyType: "field", role: "Autonomous extraction zone", generation: 340, demand: 610, storage: 260, integrity: 72, latency: 26, resources: ["Metal", "Deuterium", "Exotic matter"] },
  { id: "nexus", name: "Lagrange Nexus", bodyType: "station", role: "AI routing and reserve exchange", generation: 180, demand: 360, storage: 3100, integrity: 89, latency: 4, resources: ["Quantum cores", "Data"] },
];

export const POWER_TECHNOLOGIES: PowerTechnology[] = [
  { id: "smart-grid", era: 1, branch: "AI Control", name: "Predictive Smart Grid", description: "Forecasts demand and isolates local faults.", effect: "+6% effective capacity and unlocks Balanced AI.", researchCost: 800, prerequisites: [], resourceCost: { crystal: 900, quantumCores: 2 } },
  { id: "superconductors", era: 1, branch: "Transmission", name: "High-Temperature Superconductors", description: "Reduces planetary distribution loss.", effect: "+4% transmission efficiency.", researchCost: 900, prerequisites: [], resourceCost: { metal: 1100, crystal: 700 } },
  { id: "he3-cycle", era: 1, branch: "Generation", name: "Closed Helium-3 Fusion Cycle", description: "Recaptures plasma heat and unburned fuel.", effect: "+12% fusion output.", researchCost: 1000, prerequisites: [], resourceCost: { deuterium: 650, helium3: 120 } },
  { id: "beam-forming", era: 2, branch: "Transmission", name: "Adaptive Beam Forming", description: "AI-corrected microwave and laser targeting.", effect: "+7% beam efficiency; fewer alignment outages.", researchCost: 1800, prerequisites: ["superconductors", "smart-grid"], resourceCost: { crystal: 1800, quantumCores: 4 } },
  { id: "flux-storage", era: 2, branch: "Storage", name: "Flux Compression Batteries", description: "Compact magnetic storage for colonies and fleets.", effect: "+25% storage capacity.", researchCost: 1900, prerequisites: ["he3-cycle"], resourceCost: { metal: 1400, deuterium: 900 } },
  { id: "autonomous-mines", era: 2, branch: "Extraction", name: "Autonomous Resource Fields", description: "Self-repairing drones coordinate remote mining loads.", effect: "+15% field extraction and -8% field demand.", researchCost: 2100, prerequisites: ["smart-grid"], resourceCost: { metal: 1800, crystal: 900, quantumCores: 3 } },
  { id: "swarm-ops", era: 3, branch: "Generation", name: "Dyson Swarm Operations", description: "Coordinates millions of independent collectors.", effect: "Unlocks Dyson swarms; +18% stellar collection.", researchCost: 4200, prerequisites: ["beam-forming", "flux-storage"], resourceCost: { metal: 6200, crystal: 4800, helium3: 400 } },
  { id: "q-command", era: 3, branch: "AI Control", name: "Entangled Command Fabric", description: "Authenticates system-wide orders without light-speed delay.", effect: "Unlocks quantum command nodes and Science doctrine.", researchCost: 4600, prerequisites: ["beam-forming"], resourceCost: { crystal: 5200, quantumCores: 12 } },
  { id: "antimatter-grid", era: 3, branch: "Generation", name: "Antimatter Grid Catalysis", description: "Converts antimatter into dispatchable peak power.", effect: "Unlocks antimatter stations; +20% emergency output.", researchCost: 5100, prerequisites: ["flux-storage"], resourceCost: { deuterium: 4200, antimatter: 80, quantumCores: 8 } },
  { id: "self-healing", era: 4, branch: "AI Control", name: "Self-Healing Infrastructure", description: "Fabricators and AI reroute around battle damage.", effect: "+12 integrity recovery per cycle; unlocks Survival AI.", researchCost: 7600, prerequisites: ["q-command", "autonomous-mines"], resourceCost: { metal: 8500, crystal: 5600, quantumCores: 18 } },
  { id: "vacuum-cells", era: 4, branch: "Storage", name: "Vacuum Energy Cells", description: "Stores strategic reserves in stabilized field lattices.", effect: "+60% storage; reserve discharge has no ramp delay.", researchCost: 8200, prerequisites: ["antimatter-grid"], resourceCost: { antimatter: 160, exoticMatter: 35, quantumCores: 20 } },
  { id: "wormhole-conduit", era: 4, branch: "Transmission", name: "Wormhole Power Conduits", description: "Routes energy through stabilized artificial throats.", effect: "Unlocks interstellar power exchange.", researchCost: 9000, prerequisites: ["q-command", "swarm-ops"], resourceCost: { crystal: 12000, exoticMatter: 90, quantumCores: 24 } },
  { id: "penrose", era: 5, branch: "Generation", name: "Penrose Extraction Engine", description: "Harvests rotational energy from engineered singularities.", effect: "Unlocks singularity generation.", researchCost: 15000, prerequisites: ["vacuum-cells", "wormhole-conduit"], resourceCost: { metal: 20000, antimatter: 300, exoticMatter: 220 } },
  { id: "sentient-dispatch", era: 5, branch: "AI Control", name: "Sentient Dispatch Covenant", description: "A bounded strategic intelligence negotiates all grid priorities.", effect: "+15% total efficiency; unlocks every doctrine.", researchCost: 16500, prerequisites: ["self-healing", "wormhole-conduit"], resourceCost: { crystal: 18000, exoticMatter: 180, quantumCores: 60 } },
  { id: "stellar-economy", era: 5, branch: "Extraction", name: "Stellar Matter Economy", description: "Turns energy surplus into strategic matter streams.", effect: "Converts surplus into antimatter, exotic matter, and research.", researchCost: 18000, prerequisites: ["penrose", "sentient-dispatch"], resourceCost: { helium3: 2500, antimatter: 500, exoticMatter: 320 } },
];

export const DOCTRINES: Record<AiDoctrine, { label: string; description: string; priorities: Record<GridPriority, number>; bonus: string }> = {
  balanced: { label: "Balanced Steward", description: "Maintains stable reserves and distributes shortages proportionally.", priorities: { civilian: 25, industry: 25, research: 25, defense: 25 }, bonus: "+5% grid stability" },
  growth: { label: "Expansion Director", description: "Feeds industry, construction yards, and colony growth first.", priorities: { civilian: 20, industry: 45, research: 20, defense: 15 }, bonus: "+10% construction speed" },
  science: { label: "Scientific Ascendancy", description: "Protects laboratories, quantum computers, and experimental reactors.", priorities: { civilian: 15, industry: 20, research: 50, defense: 15 }, bonus: "+12% research output" },
  fortress: { label: "Fortress Protocol", description: "Keeps shields, weapons, sensors, and secure reserves online.", priorities: { civilian: 15, industry: 20, research: 15, defense: 50 }, bonus: "+15% shield recharge" },
  survival: { label: "Blackout Survival", description: "Islands damaged worlds and preserves life support during collapse.", priorities: { civilian: 50, industry: 15, research: 10, defense: 25 }, bonus: "-35% blackout damage" },
};

export function calculateGridSummary(nodes: GridNode[], efficiency: number) {
  const rawGeneration = nodes.reduce((sum, node) => sum + node.generation, 0);
  const demand = nodes.reduce((sum, node) => sum + node.demand, 0);
  const storage = nodes.reduce((sum, node) => sum + node.storage, 0);
  const delivered = Math.round(rawGeneration * (efficiency / 100));
  const reserve = delivered - demand;
  const coverage = demand > 0 ? Math.round((delivered / demand) * 100) : 100;
  const integrity = Math.round(nodes.reduce((sum, node) => sum + node.integrity, 0) / nodes.length);
  return { rawGeneration, delivered, demand, storage, reserve, coverage, integrity };
}

