export interface ExpansionSystemRequirements {
  buildings?: Record<string, number>;
  research?: Record<string, number>;
  totalInfrastructure?: number;
}

export interface ExpansionSystem {
  id: string;
  name: string;
  domain: "infrastructure" | "technology";
  cluster: string;
  icon: string;
  tier: "core" | "advanced" | "elite" | "apex";
  description: string;
  effect: string;
  requirements?: ExpansionSystemRequirements;
}

export interface ExpansionSystemUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentBonus: number;
  nextBonus: number;
  unit: "%" | "";
  isNegative: boolean;
}

function parseBaseBonus(effect: string): { value: number; unit: "%" | ""; isNegative: boolean } {
  const match = effect.match(/([+-]?\d+(?:\.\d+)?)(%?)/);
  const rawValue = match ? Number(match[1]) : 1;
  const value = Math.abs(rawValue);
  const unit = match?.[2] === "%" ? "%" : "";
  return {
    value: Number.isFinite(value) && value > 0 ? value : 1,
    unit,
    isNegative: rawValue < 0,
  };
}

function getTierMultiplier(tier: ExpansionSystem["tier"]): number {
  switch (tier) {
    case "core":
      return 1;
    case "advanced":
      return 1.5;
    case "elite":
      return 2.25;
    case "apex":
      return 3.2;
    default:
      return 1;
  }
}

export function getExpansionSystemMaxLevel(tier: ExpansionSystem["tier"]): number {
  switch (tier) {
    case "core":
      return 12;
    case "advanced":
      return 10;
    case "elite":
      return 8;
    case "apex":
      return 6;
    default:
      return 10;
  }
}

export function getExpansionSystemUpgradeSnapshot(system: ExpansionSystem, level: number): ExpansionSystemUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const tierMultiplier = getTierMultiplier(system.tier);
  const domainMultiplier = system.domain === "technology" ? 1.22 : 1;
  const parsedBonus = parseBaseBonus(system.effect);

  return {
    maxLevel: getExpansionSystemMaxLevel(system.tier),
    buildTimeSeconds: Math.floor((55 + tierMultiplier * 25) * (1 + safeLevel * 0.35)),
    cost: {
      metal: Math.floor(260 * tierMultiplier * domainMultiplier * Math.pow(1.72, safeLevel)),
      crystal: Math.floor(180 * tierMultiplier * domainMultiplier * Math.pow(1.68, safeLevel)),
      deuterium: Math.floor(110 * tierMultiplier * domainMultiplier * Math.pow(1.64, safeLevel)),
    },
    currentBonus: Number((parsedBonus.value * safeLevel).toFixed(parsedBonus.unit === "%" ? 0 : 2)),
    nextBonus: Number((parsedBonus.value * (safeLevel + 1)).toFixed(parsedBonus.unit === "%" ? 0 : 2)),
    unit: parsedBonus.unit,
    isNegative: parsedBonus.isNegative,
  };
}

export const INFRASTRUCTURE_EXPANSION_SYSTEMS: ExpansionSystem[] = [
  { id: "drone-logistics-hub", name: "Drone Logistics Hub", domain: "infrastructure", cluster: "Automation Grid", icon: "factory", tier: "core", description: "Autonomous cargo drones handle short-range industrial hauling.", effect: "+4% construction throughput for all surface logistics.", requirements: { buildings: { roboticsFactory: 1 }, totalInfrastructure: 6 } },
  { id: "fabrication-control-node", name: "Fabrication Control Node", domain: "infrastructure", cluster: "Automation Grid", icon: "cpu", tier: "core", description: "Central control stack for fabrication queues and machine routing.", effect: "+5% facility synchronization across production lines.", requirements: { buildings: { roboticsFactory: 2, researchLab: 1 }, totalInfrastructure: 8 } },
  { id: "maintenance-foundry", name: "Maintenance Foundry", domain: "infrastructure", cluster: "Automation Grid", icon: "hammer", tier: "core", description: "Machine shops produce replacement parts for heavy industry.", effect: "-6% downtime on industrial systems.", requirements: { buildings: { roboticsFactory: 2 }, totalInfrastructure: 8 } },
  { id: "assembly-conveyor-grid", name: "Assembly Conveyor Grid", domain: "infrastructure", cluster: "Automation Grid", icon: "network", tier: "advanced", description: "High-capacity material routing spine for construction districts.", effect: "+7% build queue efficiency for facilities and fleets.", requirements: { buildings: { roboticsFactory: 3, shipyard: 1 }, totalInfrastructure: 10 } },
  { id: "industrial-safety-grid", name: "Industrial Safety Grid", domain: "infrastructure", cluster: "Automation Grid", icon: "shield", tier: "advanced", description: "Emergency shutdowns and hazard isolation for dense industrial zones.", effect: "-8% accident loss across heavy infrastructure.", requirements: { buildings: { roboticsFactory: 3, researchLab: 1 }, totalInfrastructure: 11 } },
  { id: "autonomous-repair-bay", name: "Autonomous Repair Bay", domain: "infrastructure", cluster: "Automation Grid", icon: "factory", tier: "elite", description: "Self-directed repair crawlers maintain damaged facilities in place.", effect: "+10% infrastructure recovery after damage or overload.", requirements: { buildings: { roboticsFactory: 4, researchLab: 2 }, totalInfrastructure: 14 } },
  { id: "nanite-routing-core", name: "Nanite Routing Core", domain: "infrastructure", cluster: "Automation Grid", icon: "cpu", tier: "apex", description: "Micro-fabrication swarms optimize all routing and component placement.", effect: "+12% empire-wide infrastructure responsiveness.", requirements: { buildings: { roboticsFactory: 6, researchLab: 4 }, research: { energyTech: 3 }, totalInfrastructure: 20 } },

  { id: "power-relay-spine", name: "Power Relay Spine", domain: "infrastructure", cluster: "Power and Transit", icon: "zap", tier: "core", description: "High-bandwidth energy routing backbone for industrial districts.", effect: "+5% power distribution stability.", requirements: { buildings: { solarPlant: 4 }, totalInfrastructure: 7 } },
  { id: "thermal-exchange-plant", name: "Thermal Exchange Plant", domain: "infrastructure", cluster: "Power and Transit", icon: "zap", tier: "core", description: "Heat reclamation plant that captures waste output from factories.", effect: "+4% usable energy from industrial heat bleed.", requirements: { buildings: { solarPlant: 5, metalMine: 4 }, totalInfrastructure: 8 } },
  { id: "transit-nexus", name: "Transit Nexus", domain: "infrastructure", cluster: "Power and Transit", icon: "globe", tier: "core", description: "Cross-colony routing center for industrial and civilian movement.", effect: "+5% workforce and cargo mobility.", requirements: { buildings: { roboticsFactory: 2 }, totalInfrastructure: 9 } },
  { id: "freight-tube-network", name: "Freight Tube Network", domain: "infrastructure", cluster: "Power and Transit", icon: "network", tier: "advanced", description: "Sealed transport tubes link mines, depots, and fabrication sectors.", effect: "+7% ore and crystal movement speed.", requirements: { buildings: { roboticsFactory: 2, metalMine: 5, crystalMine: 4 }, totalInfrastructure: 11 } },
  { id: "surface-maglev-yard", name: "Surface Maglev Yard", domain: "infrastructure", cluster: "Power and Transit", icon: "rocket", tier: "advanced", description: "Maglev staging yard moves heavy cargo between colony sectors.", effect: "+8% infrastructure deployment speed.", requirements: { buildings: { roboticsFactory: 3, shipyard: 2 }, research: { energyTech: 2 }, totalInfrastructure: 12 } },
  { id: "orbital-elevator-anchor", name: "Orbital Elevator Anchor", domain: "infrastructure", cluster: "Power and Transit", icon: "satellite", tier: "elite", description: "Planetary anchor point for cargo and station resupply lifts.", effect: "+10% orbital logistics capacity.", requirements: { buildings: { shipyard: 3, researchLab: 2 }, research: { astrophysics: 1 }, totalInfrastructure: 15 } },
  { id: "atmospheric-routing-grid", name: "Atmospheric Routing Grid", domain: "infrastructure", cluster: "Power and Transit", icon: "network", tier: "apex", description: "Adaptive traffic control for high-volume air and launch corridors.", effect: "+12% planet-to-orbit dispatch efficiency.", requirements: { buildings: { shipyard: 4, researchLab: 3 }, research: { computerTech: 3, astrophysics: 2 }, totalInfrastructure: 18 } },

  { id: "habitat-services-hub", name: "Habitat Services Hub", domain: "infrastructure", cluster: "Colony Operations", icon: "globe", tier: "core", description: "Core support node for utilities, sanitation, and service routing.", effect: "+4% colony stability across surface districts.", requirements: { buildings: { roboticsFactory: 1 }, totalInfrastructure: 6 } },
  { id: "civil-registry-core", name: "Civil Registry Core", domain: "infrastructure", cluster: "Colony Operations", icon: "database", tier: "core", description: "Administrative processing center for population and district ledgers.", effect: "+5% governance handling of infrastructure load.", requirements: { buildings: { researchLab: 1 }, totalInfrastructure: 7 } },
  { id: "water-recovery-complex", name: "Water Recovery Complex", domain: "infrastructure", cluster: "Colony Operations", icon: "database", tier: "core", description: "Closed-loop purification systems support heavy industrial growth.", effect: "+6% utility efficiency in developed zones.", requirements: { buildings: { deuteriumSynthesizer: 2 }, totalInfrastructure: 8 } },
  { id: "food-distribution-grid", name: "Food Distribution Grid", domain: "infrastructure", cluster: "Colony Operations", icon: "bar-chart", tier: "advanced", description: "Automated cold-chain system keeps colonies supplied at scale.", effect: "+6% support efficiency for growing colonies.", requirements: { buildings: { roboticsFactory: 2, researchLab: 1 }, totalInfrastructure: 10 } },
  { id: "waste-reclamation-forge", name: "Waste Reclamation Forge", domain: "infrastructure", cluster: "Colony Operations", icon: "factory", tier: "advanced", description: "Reclaims industrial and civic waste into reusable feedstock.", effect: "+7% recycling yield from infrastructure districts.", requirements: { buildings: { metalMine: 5, crystalMine: 4 }, research: { energyTech: 1 }, totalInfrastructure: 11 } },
  { id: "emergency-response-center", name: "Emergency Response Center", domain: "infrastructure", cluster: "Colony Operations", icon: "shield", tier: "elite", description: "Central disaster management node for industrial and civil incidents.", effect: "-10% disruption from crises and sabotage.", requirements: { buildings: { roboticsFactory: 3, researchLab: 2 }, totalInfrastructure: 14 } },
  { id: "colony-oversight-chamber", name: "Colony Oversight Chamber", domain: "infrastructure", cluster: "Colony Operations", icon: "cpu", tier: "apex", description: "Administrative intelligence suite for empire-scale colony balancing.", effect: "+12% infrastructure command efficiency.", requirements: { buildings: { roboticsFactory: 4, researchLab: 3 }, research: { computerTech: 4, aiTech: 1 }, totalInfrastructure: 18 } },

  { id: "perimeter-command-net", name: "Perimeter Command Net", domain: "infrastructure", cluster: "Defense and Security", icon: "shield", tier: "core", description: "Links surface defenses into a coordinated threat response net.", effect: "+5% local defense response time.", requirements: { buildings: { shipyard: 1 }, totalInfrastructure: 8 } },
  { id: "sensor-bastion", name: "Sensor Bastion", domain: "infrastructure", cluster: "Defense and Security", icon: "search", tier: "core", description: "Ground-based detection node for atmosphere and orbit approaches.", effect: "+5% early warning coverage.", requirements: { buildings: { researchLab: 1 }, research: { espionageTech: 1 }, totalInfrastructure: 9 } },
  { id: "shield-capacitor-yard", name: "Shield Capacitor Yard", domain: "infrastructure", cluster: "Defense and Security", icon: "zap", tier: "advanced", description: "Power reservoir field for defense screens and hardpoint systems.", effect: "+7% defensive energy resilience.", requirements: { buildings: { shipyard: 2, solarPlant: 6 }, research: { shieldingTech: 1 }, totalInfrastructure: 11 } },
  { id: "missile-guidance-lattice", name: "Missile Guidance Lattice", domain: "infrastructure", cluster: "Defense and Security", icon: "rocket", tier: "advanced", description: "Targeting backbone for planetary launch and counterstrike systems.", effect: "+8% strike precision for defensive infrastructure.", requirements: { buildings: { shipyard: 2, researchLab: 2 }, research: { computerTech: 2, weaponsTech: 1 }, totalInfrastructure: 12 } },
  { id: "bunker-vault-network", name: "Bunker Vault Network", domain: "infrastructure", cluster: "Defense and Security", icon: "database", tier: "advanced", description: "Distributed hardened storage and command vaults below the colony shell.", effect: "+8% protection for reserve stockpiles.", requirements: { buildings: { metalMine: 6 }, totalInfrastructure: 12 } },
  { id: "drone-patrol-roost", name: "Drone Patrol Roost", domain: "infrastructure", cluster: "Defense and Security", icon: "satellite", tier: "elite", description: "Persistent autonomous patrol wings secure colony transit and industry.", effect: "+10% anti-sabotage coverage.", requirements: { buildings: { roboticsFactory: 4, shipyard: 3 }, research: { aiTech: 1, espionageTech: 3 }, totalInfrastructure: 15 } },
  { id: "siege-logistics-bay", name: "Siege Logistics Bay", domain: "infrastructure", cluster: "Defense and Security", icon: "hammer", tier: "apex", description: "Heavy logistics reserve for prolonged planetary defense campaigns.", effect: "+12% sustainment for military infrastructure.", requirements: { buildings: { shipyard: 5, researchLab: 3 }, research: { armourTech: 3, weaponsTech: 3 }, totalInfrastructure: 18 } },

  { id: "customs-exchange-hall", name: "Customs Exchange Hall", domain: "infrastructure", cluster: "Economy and Trade", icon: "bar-chart", tier: "core", description: "Customs checkpoint and tariff routing for imported materials.", effect: "+4% trade clarity across colonial lanes.", requirements: { buildings: { researchLab: 1 }, totalInfrastructure: 7 } },
  { id: "market-arbitration-node", name: "Market Arbitration Node", domain: "infrastructure", cluster: "Economy and Trade", icon: "cpu", tier: "core", description: "Pricing engine routes supply toward the highest pressure sectors.", effect: "+5% internal resource balancing.", requirements: { buildings: { researchLab: 1 }, research: { computerTech: 1 }, totalInfrastructure: 8 } },
  { id: "storage-routing-center", name: "Storage Routing Center", domain: "infrastructure", cluster: "Economy and Trade", icon: "database", tier: "core", description: "Warehouse routing control for bulk storage and outgoing freight.", effect: "+6% storage draw and refill speed.", requirements: { buildings: { metalMine: 4, crystalMine: 4 }, totalInfrastructure: 9 } },
  { id: "contract-ledger-bureau", name: "Contract Ledger Bureau", domain: "infrastructure", cluster: "Economy and Trade", icon: "bar-chart", tier: "advanced", description: "Automated contract clearing for industry, shipping, and defense supply.", effect: "+7% economic throughput from infrastructure deals.", requirements: { buildings: { researchLab: 2 }, research: { computerTech: 2 }, totalInfrastructure: 11 } },
  { id: "trade-convoy-office", name: "Trade Convoy Office", domain: "infrastructure", cluster: "Economy and Trade", icon: "globe", tier: "advanced", description: "Schedules outbound convoy routes and inter-colony shipping windows.", effect: "+8% export readiness for surplus materials.", requirements: { buildings: { shipyard: 2, researchLab: 1 }, totalInfrastructure: 12 } },
  { id: "dockside-brokerage-ring", name: "Dockside Brokerage Ring", domain: "infrastructure", cluster: "Economy and Trade", icon: "satellite", tier: "elite", description: "Orbital commerce ring coordinates supply auctions and inbound freight.", effect: "+10% station trade leverage.", requirements: { buildings: { shipyard: 3, researchLab: 2 }, research: { astrophysics: 1, computerTech: 2 }, totalInfrastructure: 15 } },
  { id: "credit-clearing-house", name: "Credit Clearing House", domain: "infrastructure", cluster: "Economy and Trade", icon: "database", tier: "apex", description: "Empire-scale financial switchboard settles infrastructure contracts instantly.", effect: "+12% investment velocity across facilities and labs.", requirements: { buildings: { researchLab: 3 }, research: { quantumTech: 1, computerTech: 4 }, totalInfrastructure: 18 } },

  { id: "orbital-traffic-control", name: "Orbital Traffic Control", domain: "infrastructure", cluster: "Space Support", icon: "satellite", tier: "core", description: "Coordinates launch windows, freighter lanes, and station docking.", effect: "+5% orbital traffic safety.", requirements: { buildings: { shipyard: 1 }, totalInfrastructure: 8 } },
  { id: "fleet-support-annex", name: "Fleet Support Annex", domain: "infrastructure", cluster: "Space Support", icon: "rocket", tier: "core", description: "Auxiliary support wing for fleet loading, crew rotation, and refit prep.", effect: "+5% fleet readiness tied to infrastructure output.", requirements: { buildings: { shipyard: 2 }, totalInfrastructure: 9 } },
  { id: "hangar-coordination-mesh", name: "Hangar Coordination Mesh", domain: "infrastructure", cluster: "Space Support", icon: "network", tier: "advanced", description: "Synchronizes ship lifts, munitions handling, and orbital servicing bays.", effect: "+7% shipyard-side logistics throughput.", requirements: { buildings: { shipyard: 3, roboticsFactory: 2 }, totalInfrastructure: 11 } },
  { id: "deep-range-relay", name: "Deep Range Relay", domain: "infrastructure", cluster: "Space Support", icon: "search", tier: "advanced", description: "Long-range relay stack links colonies to expedition and patrol routes.", effect: "+8% strategic communications reach.", requirements: { buildings: { researchLab: 2 }, research: { espionageTech: 2, astrophysics: 1 }, totalInfrastructure: 12 } },
  { id: "expedition-staging-port", name: "Expedition Staging Port", domain: "infrastructure", cluster: "Space Support", icon: "rocket", tier: "elite", description: "Dedicated support port for long-range exploration departures.", effect: "+10% expedition launch preparation.", requirements: { buildings: { shipyard: 4, researchLab: 2 }, research: { astrophysics: 2 }, totalInfrastructure: 15 } },
  { id: "stellar-cartography-deck", name: "Stellar Cartography Deck", domain: "infrastructure", cluster: "Space Support", icon: "search", tier: "elite", description: "Maps safe routes, anomaly zones, and frontier corridors for expansion.", effect: "+10% navigation quality for orbital systems.", requirements: { buildings: { researchLab: 3 }, research: { computerTech: 3, hyperspaceTech: 1 }, totalInfrastructure: 16 } },
  { id: "planetary-liftworks", name: "Planetary Liftworks", domain: "infrastructure", cluster: "Space Support", icon: "factory", tier: "apex", description: "Mass cargo lift system fuses surface industry directly into orbital supply.", effect: "+12% planet-to-station construction support.", requirements: { buildings: { shipyard: 5, roboticsFactory: 4 }, research: { hyperspaceTech: 2, astrophysics: 2 }, totalInfrastructure: 20 } },
];

export const TECHNOLOGY_RESEARCH_SYSTEMS: ExpansionSystem[] = [
  { id: "energy-theory-chamber", name: "Energy Theory Chamber", domain: "technology", cluster: "Power Sciences", icon: "flask", tier: "core", description: "Applied theory deck for efficient grid planning and reactor modelling.", effect: "+6% energy research acceleration.", requirements: { buildings: { researchLab: 1 }, research: { energyTech: 1 }, totalInfrastructure: 7 } },
  { id: "laser-focusing-cell", name: "Laser Focusing Cell", domain: "technology", cluster: "Power Sciences", icon: "zap", tier: "core", description: "Calibrates beam shaping for industrial and defense applications.", effect: "+5% precision for laser-linked systems.", requirements: { buildings: { researchLab: 2 }, research: { laserTech: 1 }, totalInfrastructure: 8 } },
  { id: "ion-calibration-wing", name: "Ion Calibration Wing", domain: "technology", cluster: "Power Sciences", icon: "flask", tier: "advanced", description: "Field lab for ionic containment and directed energy refinement.", effect: "+6% ion systems reliability.", requirements: { buildings: { researchLab: 2 }, research: { ionTech: 1, energyTech: 2 }, totalInfrastructure: 10 } },
  { id: "plasma-containment-vault", name: "Plasma Containment Vault", domain: "technology", cluster: "Power Sciences", icon: "zap", tier: "advanced", description: "Stabilized vault for high-energy plasma generation and testing.", effect: "+8% plasma unlock efficiency.", requirements: { buildings: { researchLab: 3, solarPlant: 6 }, research: { plasmaTech: 1 }, totalInfrastructure: 12 } },
  { id: "reactor-simulation-basin", name: "Reactor Simulation Basin", domain: "technology", cluster: "Power Sciences", icon: "cpu", tier: "elite", description: "Predictive reactor modeling environment for extreme energy loads.", effect: "+10% power system tuning.", requirements: { buildings: { researchLab: 3 }, research: { energyTech: 4, plasmaTech: 1, computerTech: 2 }, totalInfrastructure: 14 } },
  { id: "zero-loss-conductor-lab", name: "Zero-Loss Conductor Lab", domain: "technology", cluster: "Power Sciences", icon: "network", tier: "elite", description: "Develops transmission materials that reduce planetary grid losses.", effect: "+10% empire energy retention.", requirements: { buildings: { researchLab: 4 }, research: { energyTech: 5, shieldingTech: 2 }, totalInfrastructure: 16 } },
  { id: "stellar-energy-observatory", name: "Stellar Energy Observatory", domain: "technology", cluster: "Power Sciences", icon: "satellite", tier: "apex", description: "Observes stellar behavior to optimize megascale energy systems.", effect: "+12% advanced power and science synergy.", requirements: { buildings: { researchLab: 5 }, research: { plasmaTech: 3, astrophysics: 2 }, totalInfrastructure: 18 } },

  { id: "command-data-fabric", name: "Command Data Fabric", domain: "technology", cluster: "Computing and Intelligence", icon: "cpu", tier: "core", description: "Shared computational substrate for planning, logistics, and research.", effect: "+5% command and lab data throughput.", requirements: { buildings: { researchLab: 1 }, research: { computerTech: 1 }, totalInfrastructure: 7 } },
  { id: "signals-analysis-suite", name: "Signals Analysis Suite", domain: "technology", cluster: "Computing and Intelligence", icon: "search", tier: "core", description: "Interprets fleet signals, telemetry, and atmospheric contact traffic.", effect: "+5% detection and analysis quality.", requirements: { buildings: { researchLab: 1 }, research: { espionageTech: 1 }, totalInfrastructure: 8 } },
  { id: "predictive-logistics-engine", name: "Predictive Logistics Engine", domain: "technology", cluster: "Computing and Intelligence", icon: "bar-chart", tier: "advanced", description: "Forecasting system balances queues, resources, and convoy needs.", effect: "+7% planning accuracy for infrastructure builds.", requirements: { buildings: { roboticsFactory: 2, researchLab: 2 }, research: { computerTech: 2 }, totalInfrastructure: 10 } },
  { id: "decryption-workbench", name: "Decryption Workbench", domain: "technology", cluster: "Computing and Intelligence", icon: "cpu", tier: "advanced", description: "Codebreaking stack for traffic analysis and covert tech recovery.", effect: "+8% intelligence research support.", requirements: { buildings: { researchLab: 2 }, research: { espionageTech: 3, computerTech: 2 }, totalInfrastructure: 11 } },
  { id: "ai-command-kernel", name: "AI Command Kernel", domain: "technology", cluster: "Computing and Intelligence", icon: "cpu", tier: "elite", description: "Decision support kernel assists industrial and tactical command flows.", effect: "+10% automation across research-linked facilities.", requirements: { buildings: { roboticsFactory: 3, researchLab: 3 }, research: { aiTech: 1, computerTech: 3 }, totalInfrastructure: 14 } },
  { id: "quantum-logic-lattice", name: "Quantum Logic Lattice", domain: "technology", cluster: "Computing and Intelligence", icon: "network", tier: "elite", description: "Quantum processing matrix routes parallel computation at scale.", effect: "+10% high-tier research resolution speed.", requirements: { buildings: { researchLab: 4 }, research: { quantumTech: 1, computerTech: 4 }, totalInfrastructure: 16 } },
  { id: "strategic-cognition-array", name: "Strategic Cognition Array", domain: "technology", cluster: "Computing and Intelligence", icon: "search", tier: "apex", description: "Empire-wide intelligence mesh correlates science, fleet, and industry data.", effect: "+12% technological decision support across all systems.", requirements: { buildings: { researchLab: 5, roboticsFactory: 4 }, research: { aiTech: 2, quantumTech: 1, espionageTech: 4 }, totalInfrastructure: 18 } },

  { id: "combustion-test-range", name: "Combustion Test Range", domain: "technology", cluster: "Propulsion and Field Theory", icon: "rocket", tier: "core", description: "Surface test lane for drive ignition, thermal loads, and fuel burn.", effect: "+5% early propulsion research speed.", requirements: { buildings: { shipyard: 1, researchLab: 1 }, research: { combustionDrive: 1 }, totalInfrastructure: 8 } },
  { id: "impulse-vector-bench", name: "Impulse Vector Bench", domain: "technology", cluster: "Propulsion and Field Theory", icon: "rocket", tier: "core", description: "Lab bay for thrust vectoring and maneuver optimization.", effect: "+6% mid-tier drive testing performance.", requirements: { buildings: { shipyard: 2, researchLab: 1 }, research: { impulseDrive: 1 }, totalInfrastructure: 9 } },
  { id: "hyperspace-mapping-capsule", name: "Hyperspace Mapping Capsule", domain: "technology", cluster: "Propulsion and Field Theory", icon: "satellite", tier: "advanced", description: "Charts stable entries into higher-dimensional transit envelopes.", effect: "+7% hyperspace route confidence.", requirements: { buildings: { researchLab: 2 }, research: { hyperspaceTech: 1 }, totalInfrastructure: 10 } },
  { id: "warp-corridor-analyzer", name: "Warp Corridor Analyzer", domain: "technology", cluster: "Propulsion and Field Theory", icon: "search", tier: "advanced", description: "Analyzes corridor behavior for long-range strategic travel.", effect: "+8% long-distance drive planning.", requirements: { buildings: { shipyard: 3, researchLab: 2 }, research: { hyperspaceDrive: 1, hyperspaceTech: 2 }, totalInfrastructure: 12 } },
  { id: "gravitic-lens-lab", name: "Gravitic Lens Lab", domain: "technology", cluster: "Propulsion and Field Theory", icon: "flask", tier: "elite", description: "Studies curvature manipulation for advanced field control.", effect: "+10% gravitic field experimentation.", requirements: { buildings: { researchLab: 4 }, research: { gravitonTech: 1, hyperspaceTech: 3 }, totalInfrastructure: 15 } },
  { id: "slipstream-theory-core", name: "Slipstream Theory Core", domain: "technology", cluster: "Propulsion and Field Theory", icon: "network", tier: "elite", description: "Theoretical model core for fast corridor collapse and re-entry.", effect: "+10% advanced propulsion integration.", requirements: { buildings: { shipyard: 4, researchLab: 4 }, research: { hyperspaceDrive: 2, impulseDrive: 4 }, totalInfrastructure: 17 } },
  { id: "event-horizon-simulator", name: "Event Horizon Simulator", domain: "technology", cluster: "Propulsion and Field Theory", icon: "satellite", tier: "apex", description: "Extreme-field simulator tests trans-relativistic travel doctrines.", effect: "+12% apex propulsion and exotic travel science.", requirements: { buildings: { researchLab: 5, shipyard: 5 }, research: { gravitonTech: 1, hyperspaceDrive: 3, quantumTech: 1 }, totalInfrastructure: 20 } },

  { id: "materials-integration-lab", name: "Materials Integration Lab", domain: "technology", cluster: "Applied Engineering", icon: "factory", tier: "core", description: "Bridges industrial output and science for better facility materials.", effect: "+5% engineering-linked build quality.", requirements: { buildings: { roboticsFactory: 2, researchLab: 1 }, totalInfrastructure: 8 } },
  { id: "armor-composite-yard", name: "Armor Composite Yard", domain: "technology", cluster: "Applied Engineering", icon: "shield", tier: "core", description: "Refines structural compounds for hardening fleets and facilities.", effect: "+6% armor and plating experimentation.", requirements: { buildings: { shipyard: 2 }, research: { armourTech: 1 }, totalInfrastructure: 9 } },
  { id: "shield-harmonics-bay", name: "Shield Harmonics Bay", domain: "technology", cluster: "Applied Engineering", icon: "zap", tier: "advanced", description: "Tuning bay for shield envelopes and energy dissipation behavior.", effect: "+7% shielding system refinement.", requirements: { buildings: { researchLab: 2 }, research: { shieldingTech: 2, energyTech: 2 }, totalInfrastructure: 11 } },
  { id: "weapons-proving-floor", name: "Weapons Proving Floor", domain: "technology", cluster: "Applied Engineering", icon: "rocket", tier: "advanced", description: "Controlled range for weapons calibration and systems acceptance.", effect: "+8% weapons technology field validation.", requirements: { buildings: { shipyard: 3, researchLab: 2 }, research: { weaponsTech: 2, laserTech: 2 }, totalInfrastructure: 12 } },
  { id: "adaptive-hull-forge", name: "Adaptive Hull Forge", domain: "technology", cluster: "Applied Engineering", icon: "factory", tier: "elite", description: "Develops modular hull structures from advanced industrial output.", effect: "+10% shipyard and infrastructure materials synergy.", requirements: { buildings: { roboticsFactory: 3, shipyard: 3 }, research: { armourTech: 3, plasmaTech: 1 }, totalInfrastructure: 15 } },
  { id: "frontier-colonization-lab", name: "Frontier Colonization Lab", domain: "technology", cluster: "Applied Engineering", icon: "globe", tier: "elite", description: "Applies research to remote deployment, terraforming, and expansion systems.", effect: "+10% expansion engineering readiness.", requirements: { buildings: { researchLab: 4 }, research: { astrophysics: 2, energyTech: 3 }, totalInfrastructure: 16 } },
  { id: "singularity-prototyping-bay", name: "Singularity Prototyping Bay", domain: "technology", cluster: "Applied Engineering", icon: "flask", tier: "apex", description: "Final-stage prototyping chamber for exotic and research-derived infrastructure.", effect: "+12% breakthrough implementation speed across advanced systems.", requirements: { buildings: { roboticsFactory: 5, shipyard: 4, researchLab: 5 }, research: { plasmaTech: 3, quantumTech: 1, gravitonTech: 1 }, totalInfrastructure: 20 } },
];

export const FACILITY_EXPANSION_COUNTS = {
  infrastructure: INFRASTRUCTURE_EXPANSION_SYSTEMS.length,
  technology: TECHNOLOGY_RESEARCH_SYSTEMS.length,
};
