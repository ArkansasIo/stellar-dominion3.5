export interface WormholeRoute {
  id: string;
  name: string;
  className: string;
  locus: string;
  status: "unstable" | "stabilizing" | "stabilized";
  destinationMask: string;
  transitProfile: string;
  lifetimeHours: number;
  massCapacity: number;
  risk: number;
  connectedSystems: string[];
  researchHooks: string[];
  blueprintHooks: string[];
  featureNotes: string[];
}

export interface StrongholdProgram {
  id: string;
  name: string;
  tier: string;
  orbit: string;
  status: "surveyed" | "deployable" | "contested" | "operational";
  role: string;
  summary: string;
  defense: number;
  logistics: number;
  command: number;
  facilities: string[];
  researchHooks: string[];
  blueprintHooks: string[];
  upgradeTracks: { name: string; effect: string }[];
  gameplay: string[];
}

export interface FrontierFeature {
  id: string;
  name: string;
  type: "site-chain" | "logistics" | "exploration" | "industry" | "defense";
  summary: string;
  gameplay: string;
  unlocks: string[];
  linkedSystems: string[];
}

export interface FrontierEventIntel {
  id: string;
  name: string;
  description: string;
  eventClass: "rare" | "epic" | "legendary" | "mythic";
  eventType: string;
  difficulty: number;
  participantLimit: number;
  duration: number;
  status: "active" | "scheduled" | "upcoming";
  rewards: Record<string, number>;
  recommendedTier: number;
  recommendedLevel: number;
  participationMode: "solo" | "squad" | "alliance" | "pvp";
}

export const WORMHOLE_ROUTES: WormholeRoute[] = [
  {
    id: "wh-aurora-thread",
    name: "Aurora Thread",
    className: "Class I Frontier Wormhole",
    locus: "JX-101 / Perseus Verge",
    status: "unstable",
    destinationMask: "Unknown frontier pocket",
    transitProfile: "Scout hulls and mining craft",
    lifetimeHours: 16,
    massCapacity: 180,
    risk: 4,
    connectedSystems: ["Relic Fields", "Ore Veins", "Survey Cache"],
    researchHooks: ["Traversable Wormhole Mechanics", "Signal Deconvolution", "Probe Calibration"],
    blueprintHooks: ["Survey Probe Rack", "Frontier Relay Node", "Light Stabilizer Ring"],
    featureNotes: ["Fast scan resolution", "Low hostile density", "High relic recovery chance"],
  },
  {
    id: "wh-graven-crown",
    name: "Graven Crown",
    className: "Class III Combat Wormhole",
    locus: "PX-402 / Crown Rift",
    status: "stabilizing",
    destinationMask: "Sleeper defense enclave",
    transitProfile: "Cruisers, logistics wings, breach destroyers",
    lifetimeHours: 10,
    massCapacity: 420,
    risk: 7,
    connectedSystems: ["Combat Signatures", "Data Vaults", "Drifter Echoes"],
    researchHooks: ["Phase Harmonics", "Void Shield Lattices", "Wormhole Transit Logistics"],
    blueprintHooks: ["Fortress Battery Core", "Medium Stabilizer Ring", "Sleeper Data Harness"],
    featureNotes: ["Escalating hostile waves", "Rich salvage yield", "Collapse pressure rises with each jump"],
  },
  {
    id: "wh-blackglass-gate",
    name: "Blackglass Gate",
    className: "Class V Siege Wormhole",
    locus: "NX-900 / Null Halo",
    status: "unstable",
    destinationMask: "Contested siege corridor",
    transitProfile: "Capital escorts, dreadnoughts, bastion wings",
    lifetimeHours: 6,
    massCapacity: 900,
    risk: 9,
    connectedSystems: ["Siege Objectives", "Stronghold Lattices", "Heavy Gas Clouds"],
    researchHooks: ["Dimensional Stress Dampening", "Citadel Breach Theory", "Capital Transit Forecasting"],
    blueprintHooks: ["Citadel Anchor Spine", "Siege Flux Injector", "Heavy Mass Regulator"],
    featureNotes: ["High-value exits", "Frequent collapse events", "Best route for stronghold offensives"],
  },
  {
    id: "wh-eden-mirror",
    name: "Eden Mirror",
    className: "Shattered Biosphere Wormhole",
    locus: "SY-772 / Halo Grave",
    status: "stabilized",
    destinationMask: "Broken colony biome",
    transitProfile: "Science flotillas and colony support craft",
    lifetimeHours: 24,
    massCapacity: 360,
    risk: 5,
    connectedSystems: ["Shattered Worlds", "Bio-labs", "Terraforming caches"],
    researchHooks: ["Adaptive Habitat Shells", "Xenobiology Survey Nets", "Emergency Colony Arks"],
    blueprintHooks: ["Habitat Ring Segment", "Biofoam Bulkhead", "Colonial Field Lab"],
    featureNotes: ["Strong colonization rewards", "Medium environmental damage", "Excellent research sample density"],
  },
];

export const STRONGHOLD_PROGRAMS: StrongholdProgram[] = [
  {
    id: "sg-vanguard-bastion",
    name: "Vanguard Bastion",
    tier: "Frontier Tier I",
    orbit: "Moon-shadow anchor",
    status: "deployable",
    role: "Forward staging and customs interdiction",
    summary: "An early wormhole-era fortress that secures mining chains, customs lanes, and emergency fleet shelter.",
    defense: 72,
    logistics: 68,
    command: 61,
    facilities: ["Shield spindle", "Docking spine", "Rapid repair lattice", "Customs interdiction grid"],
    researchHooks: ["Frontier Governance", "Adaptive Bastion Geometry", "Orbital Logistics Doctrine"],
    blueprintHooks: ["Stronghold Core Frame", "Repair Drone Bay", "Orbital Checkpoint Tower"],
    upgradeTracks: [
      { name: "Bulwark Skin", effect: "+12% siege resistance and +1 defense slot" },
      { name: "Hangar Bloom", effect: "+18% sortie readiness for patrol fleets" },
      { name: "Customs Spine", effect: "+10% interdiction and cargo seizure throughput" },
    ],
    gameplay: ["Project local control", "Anchor mining protection", "Stage rapid response fleets"],
  },
  {
    id: "sg-abyssal-keep",
    name: "Abyssal Keep",
    tier: "Frontier Tier II",
    orbit: "Wormhole deadspace pocket",
    status: "contested",
    role: "Deep-pocket command fortress",
    summary: "A hardened keep intended for contested wormhole systems where transit mass, probes, and siege cycles decide control.",
    defense: 91,
    logistics: 74,
    command: 88,
    facilities: ["Mass regulator cage", "Void cannon deck", "Signal disruption bloom", "Breach response barracks"],
    researchHooks: ["Wormhole Bastion Theory", "Signal Ghosting", "Heavy Siege Administration"],
    blueprintHooks: ["Abyssal Keep Core", "Void Lance Array", "Mass Regulator Cage"],
    upgradeTracks: [
      { name: "Mass Lock Grid", effect: "Reduces collapse chance during heavy fleet transit" },
      { name: "Ghost Jammer", effect: "Masks exact stronghold fit until hostile probes commit" },
      { name: "Siege Corridor", effect: "Unlocks capital-safe breach windows" },
    ],
    gameplay: ["Contest routes", "Deny hostile scanning", "Support alliance-scale sieges"],
  },
  {
    id: "sg-stellar-citadel",
    name: "Stellar Citadel",
    tier: "Frontier Tier III",
    orbit: "Tri-axis fortress orbit",
    status: "operational",
    role: "Empire-level command citadel",
    summary: "A top-end orbital fortress that fuses shipyard, research, logistics, and wormhole control into a single strategic anchor.",
    defense: 97,
    logistics: 92,
    command: 95,
    facilities: ["Capital drydock", "Research sanctum", "Transit observatory", "Fortress market ring"],
    researchHooks: ["Citadel Systems Mastery", "Strategic Transit Mapping", "Apex Fortress Automation"],
    blueprintHooks: ["Citadel Ring Core", "Capital Dock Lattice", "Apex Observatory Spine"],
    upgradeTracks: [
      { name: "Aegis Crown", effect: "+20% shield envelope and fleet tether range" },
      { name: "Transit Sanctum", effect: "Opens stabilized exits to allied networks" },
      { name: "Forge Halo", effect: "+15% capital blueprint throughput" },
    ],
    gameplay: ["Serve as regional capital", "Bridge shipyard and research systems", "Control endgame frontier lanes"],
  },
];

export const FRONTIER_FEATURES: FrontierFeature[] = [
  {
    id: "ft-signature-chains",
    name: "Signature Chains",
    type: "site-chain",
    summary: "Linked signatures reveal escalating relic, gas, combat, and command sites after each successful scan.",
    gameplay: "Chain scans create branching route choices instead of one-off anomalies.",
    unlocks: ["Relic vaults", "Hidden ore pockets", "Escalation encounters"],
    linkedSystems: ["Exploration", "Research Hub", "Warp Network"],
  },
  {
    id: "ft-polarization-cycles",
    name: "Transit Polarization",
    type: "logistics",
    summary: "Repeated wormhole jumps stress fleets and temporarily restrict return routes.",
    gameplay: "High-commitment pushes become risky without staging, scouts, or relief paths.",
    unlocks: ["Transit cooldown play", "Escort doctrines", "Route planning"],
    linkedSystems: ["Warp Network", "Fleet Command", "Universe Events"],
  },
  {
    id: "ft-gas-cloud-refining",
    name: "Frontier Gas Refining",
    type: "industry",
    summary: "Exotic gases from wormhole sites feed refinery upgrades, booster chemistry, and advanced fabrication.",
    gameplay: "Exploration directly fuels refinery and blueprint progression.",
    unlocks: ["Refinery catalysts", "Advanced shield fuel", "Tech accelerants"],
    linkedSystems: ["Refinery Systems", "Blueprint Manufacturing", "Technology Division"],
  },
  {
    id: "ft-stronghold-sieges",
    name: "Stronghold Siege Windows",
    type: "defense",
    summary: "Fortresses enter timed vulnerability windows where command, logistics, and mass control all matter.",
    gameplay: "Battles become operational campaigns rather than simple HP races.",
    unlocks: ["Siege alerts", "Defense timers", "Counteroffensive bonuses"],
    linkedSystems: ["Stations", "Raids", "Universe Events"],
  },
  {
    id: "ft-frontier-economy",
    name: "Frontier Contract Economy",
    type: "industry",
    summary: "Remote sites generate temporary contracts for hauling, salvage, relic processing, and escort fleets.",
    gameplay: "Wormhole content feeds trade and shipyard demand instead of sitting isolated.",
    unlocks: ["Salvage contracts", "Escort contracts", "Blueprint supply queues"],
    linkedSystems: ["Trade Routes", "Shipyard", "Blueprint Manufacturing"],
  },
  {
    id: "ft-observatory-mapping",
    name: "Observatory Mapping",
    type: "exploration",
    summary: "Observatories improve route prediction, collapse warning, and hidden exit quality over time.",
    gameplay: "Persistent investment turns chaotic wormhole space into a manageable network.",
    unlocks: ["Exit prediction", "Route quality score", "Collapse alerts"],
    linkedSystems: ["Exploration", "Stations", "Research Technology Tree"],
  },
];

export const FRONTIER_EVENT_INTEL: FrontierEventIntel[] = [
  {
    id: "frontier-wh-surge",
    name: "Wormhole Surge",
    description: "A cascading spike in spatial pressure is opening short-lived exits faster than command can classify them.",
    eventClass: "epic",
    eventType: "wormhole_surge",
    difficulty: 7,
    participantLimit: 6,
    duration: 90,
    status: "active",
    rewards: { deuterium: 120000, crystal: 85000, xp: 6000 },
    recommendedTier: 34,
    recommendedLevel: 260,
    participationMode: "squad",
  },
  {
    id: "frontier-keep-siege",
    name: "Abyssal Keep Siege",
    description: "A contested stronghold has entered its breach window and both sides are racing to control the regulator cage.",
    eventClass: "legendary",
    eventType: "stronghold_siege",
    difficulty: 9,
    participantLimit: 12,
    duration: 120,
    status: "scheduled",
    rewards: { metal: 220000, crystal: 180000, deuterium: 160000, xp: 12000 },
    recommendedTier: 48,
    recommendedLevel: 420,
    participationMode: "alliance",
  },
  {
    id: "frontier-relic-flood",
    name: "Shattered Relic Flood",
    description: "A biosphere wormhole chain has opened into multiple relic and data sites with unusually rich recovery tables.",
    eventClass: "rare",
    eventType: "relic_chain",
    difficulty: 5,
    participantLimit: 4,
    duration: 75,
    status: "active",
    rewards: { crystal: 64000, xp: 4200, research: 8 },
    recommendedTier: 20,
    recommendedLevel: 170,
    participationMode: "solo",
  },
  {
    id: "frontier-blackglass-collapse",
    name: "Blackglass Collapse Watch",
    description: "The Blackglass Gate is approaching terminal instability, threatening to strand fleets and isolate siege assets.",
    eventClass: "mythic",
    eventType: "collapse_crisis",
    difficulty: 10,
    participantLimit: 16,
    duration: 60,
    status: "upcoming",
    rewards: { deuterium: 260000, crystal: 210000, xp: 15000 },
    recommendedTier: 62,
    recommendedLevel: 560,
    participationMode: "alliance",
  },
];
