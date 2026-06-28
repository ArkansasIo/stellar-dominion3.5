import { 
  Zap, Atom, Cpu, Eye, Rocket, Shield, Swords, Radio, Crosshair, Globe, 
  Database, Activity, Layers, Server, Wind, Flame, Disc, Microscope, 
  Dna, Briefcase, Cog, Hammer, Anchor, Hexagon, Box, Infinity 
} from "lucide-react";

export type TechArea = "physics" | "society" | "engineering";
export type TechCategory = "particles" | "field_manipulation" | "computing" | "biology" | "statecraft" | "psionics" | "propulsion" | "voidcraft" | "industry" | "materials" | "military_theory";

export interface TechItem {
  id: string; // Keep OGame IDs for compatibility
  name: string; // Stellaris Name
  originalName?: string; // Reference
  description: string;
  area: TechArea;
  category: TechCategory;
  tier: number;
  icon: any;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy?: number;
  };
  costFactor: number;
  effects: {
    name: string;
    value: string;
    perLevel?: string;
  }[];
  requirements?: string[];
}

export const TECHS: TechItem[] = [
  // --- PHYSICS ---
  {
    id: "energyTech",
    name: "Zero-Point Power",
    originalName: "Energy Technology",
    description: "Extracting vacuum energy from the fabric of space-time itself to fuel our empire.",
    area: "physics",
    category: "particles",
    tier: 1,
    icon: Zap,
    baseCost: { metal: 0, crystal: 800, deuterium: 400 },
    costFactor: 2,
    effects: [
      { name: "Energy Gen", value: "Unlock Reactors", perLevel: "Efficiency" },
      { name: "Unlock", value: "Impulse Thrusters", perLevel: "" }
    ]
  },
  {
    id: "laserTech",
    name: "Gamma Lasers",
    originalName: "Laser Technology",
    description: "High-frequency coherent light emitters capable of stripping electrons from target hulls.",
    area: "physics",
    category: "particles",
    tier: 1,
    icon: Crosshair,
    baseCost: { metal: 200, crystal: 100, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Damage", value: "Laser Weapons", perLevel: "+5%" },
      { name: "Unlock", value: "Heavy Fighter", perLevel: "" }
    ]
  },
  {
    id: "shieldingTech",
    name: "Deflector Barriers",
    originalName: "Shielding Technology",
    description: "Projected magnetic fields that disperse kinetic impact and plasma dispersal.",
    area: "physics",
    category: "field_manipulation",
    tier: 2,
    icon: Shield,
    baseCost: { metal: 200, crystal: 600, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Shield HP", value: "All Ships", perLevel: "+10%" },
      { name: "Unlock", value: "Shield Generators", perLevel: "" }
    ]
  },
  {
    id: "hyperspaceTech",
    name: "Subspace Theory",
    originalName: "Hyperspace Technology",
    description: "Understanding the underlying 11-dimensional manifold of subspace allows for FTL communications.",
    area: "physics",
    category: "field_manipulation",
    tier: 3,
    icon: Layers,
    baseCost: { metal: 0, crystal: 4000, deuterium: 2000 },
    costFactor: 2,
    effects: [
      { name: "Cargo", value: "Subspace Compression", perLevel: "+5%" },
      { name: "Unlock", value: "Battleship", perLevel: "" }
    ]
  },
  {
    id: "plasmaTech",
    name: "Plasma Dynamics",
    originalName: "Plasma Technology",
    description: "Control of superheated ionized matter for industrial cutting and devastating weaponry.",
    area: "physics",
    category: "particles",
    tier: 4,
    icon: Flame,
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 },
    costFactor: 2,
    effects: [
      { name: "Mining", value: "Thermal Bore", perLevel: "+1%" },
      { name: "Damage", value: "Plasma Weapons", perLevel: "+10%" }
    ]
  },
  {
    id: "computerTech",
    name: "Positronic Computing",
    originalName: "Computer Technology",
    description: "Advanced neural net algorithms to manage the complex logistics of an interstellar empire.",
    area: "physics",
    category: "computing",
    tier: 1,
    icon: Server,
    baseCost: { metal: 0, crystal: 400, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Fleet Command", value: "Coordination Limit", perLevel: "+1 Fleet" },
      { name: "Unlock", value: "Nanite Factory", perLevel: "" }
    ]
  },
  {
    id: "aiTech",
    name: "Sentient AI",
    originalName: "Artificial Intelligence",
    description: "Self-aware synthetic intelligences capable of managing entire planetary economies.",
    area: "physics",
    category: "computing",
    tier: 5,
    icon: Cpu,
    baseCost: { metal: 50000, crystal: 50000, deuterium: 100000 },
    costFactor: 2,
    effects: [
      { name: "Automation", value: "Auto-mine", perLevel: "Efficiency" },
      { name: "Combat", value: "Predictive Algorithms", perLevel: "+2%" }
    ]
  },
  {
    id: "gravitonTech",
    name: "Unified Field Theory",
    originalName: "Graviton Technology",
    description: "Manipulation of gravitons allows for artificial gravity wells and the construction of colossi.",
    area: "physics",
    category: "field_manipulation",
    tier: 5,
    icon: Activity,
    baseCost: { metal: 0, crystal: 0, deuterium: 0, energy: 300000 },
    costFactor: 3,
    effects: [
      { name: "Unlock", value: "Death Star", perLevel: "Titan Class" },
      { name: "Prestige", value: "Galactic Wonder", perLevel: "High" }
    ]
  },
  {
    id: "quantumTech",
    name: "Quantum Entanglement",
    originalName: "Quantum Computing",
    description: "Using quantum superposition for instantaneous calculation and communication across parsecs.",
    area: "physics",
    category: "computing",
    tier: 6,
    icon: Infinity,
    baseCost: { metal: 100000, crystal: 200000, deuterium: 150000 },
    costFactor: 2,
    effects: [
      { name: "Research", value: "Global Speed", perLevel: "+5%" },
      { name: "Encryption", value: "Unbreakable", perLevel: "Max" }
    ]
  },

  // --- SOCIETY ---
  {
    id: "espionageTech",
    name: "Quantum Encryption",
    originalName: "Espionage Technology",
    description: "Unbreakable ciphers and spycraft to protect state secrets and uncover those of enemies.",
    area: "society",
    category: "statecraft",
    tier: 1,
    icon: Eye,
    baseCost: { metal: 200, crystal: 1000, deuterium: 200 },
    costFactor: 2,
    effects: [
      { name: "Intel", value: "Scan Resolution", perLevel: "+1 Level" },
      { name: "Security", value: "Counter-Espionage", perLevel: "Chance" }
    ]
  },
  {
    id: "astrophysics",
    name: "Exoplanetary Studies",
    originalName: "Astrophysics",
    description: "Protocols for identifying and colonizing habitable worlds in the goldilocks zone.",
    area: "society",
    category: "statecraft",
    tier: 3,
    icon: Globe,
    baseCost: { metal: 4000, crystal: 8000, deuterium: 4000 },
    costFactor: 1.75,
    effects: [
      { name: "Expansion", value: "Colony Limit", perLevel: "+0.5" },
      { name: "Exploration", value: "Expedition Duration", perLevel: "+10%" }
    ]
  },
  {
    id: "intergalacticResearchNetwork",
    name: "Neural Link Network",
    originalName: "Intergalactic Research Network",
    description: "Unifying the scientific community across all colonies to share breakthroughs instantly.",
    area: "society",
    category: "statecraft",
    tier: 4,
    icon: Database,
    baseCost: { metal: 240000, crystal: 400000, deuterium: 160000 },
    costFactor: 2,
    effects: [
      { name: "Research", value: "Lab Link", perLevel: "+1 Lab" },
      { name: "Unity", value: "Tech Sharing", perLevel: "Max" }
    ]
  },

  // --- ENGINEERING ---
  {
    id: "combustionDrive",
    name: "Fusion Thrusters",
    originalName: "Combustion Drive",
    description: "High-efficiency fusion rockets for sub-light propulsion.",
    area: "engineering",
    category: "propulsion",
    tier: 1,
    icon: Wind,
    baseCost: { metal: 400, crystal: 0, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Speed", value: "Small Ships", perLevel: "+10%" },
      { name: "Unlock", value: "Light Fighter", perLevel: "" }
    ]
  },
  {
    id: "impulseDrive",
    name: "Ion Propulsion",
    originalName: "Impulse Drive",
    description: "Efficient electric propulsion using ionized xenon gas.",
    area: "engineering",
    category: "propulsion",
    tier: 2,
    icon: Rocket,
    baseCost: { metal: 2000, crystal: 4000, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Speed", value: "Medium Ships", perLevel: "+20%" },
      { name: "Unlock", value: "Cruiser", perLevel: "" }
    ]
  },
  {
    id: "hyperspaceDrive",
    name: "Warp Drive",
    originalName: "Hyperspace Drive",
    description: "Engines capable of bending space-time to exceed the speed of light.",
    area: "engineering",
    category: "propulsion",
    tier: 3,
    icon: Disc,
    baseCost: { metal: 10000, crystal: 20000, deuterium: 6000 },
    costFactor: 2,
    effects: [
      { name: "Speed", value: "Capital Ships", perLevel: "+30%" },
      { name: "Unlock", value: "Destroyer", perLevel: "" }
    ]
  },
  {
    id: "weaponsTech",
    name: "Kinetic Artillery",
    originalName: "Weapons Technology",
    description: "Electromagnetic accelerators that launch projectiles at relativistic speeds.",
    area: "engineering",
    category: "materials", 
    tier: 2,
    icon: Swords,
    baseCost: { metal: 800, crystal: 200, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Damage", value: "Kinetic Weapons", perLevel: "+10%" },
      { name: "Unlock", value: "Gauss Cannon", perLevel: "" }
    ]
  },
  {
    id: "armourTech",
    name: "Nanocomposite Plating",
    originalName: "Armour Technology",
    description: "Hull plating reinforced with carbon nanotubes and diamond lattice.",
    area: "engineering",
    category: "materials",
    tier: 2,
    icon: Shield,
    baseCost: { metal: 1000, crystal: 0, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Hull", value: "Armor HP", perLevel: "+10%" },
      { name: "Unlock", value: "Heavy Laser", perLevel: "" }
    ]
  },
  {
    id: "ionTech",
    name: "EMP Weaponry",
    originalName: "Ion Technology",
    description: "Weapons designed to overload enemy electrical systems and shields.",
    area: "engineering",
    category: "voidcraft",
    tier: 2,
    icon: Atom,
    baseCost: { metal: 1000, crystal: 300, deuterium: 100 },
    costFactor: 2,
    effects: [
      { name: "Deconstruction", value: "Salvage Speed", perLevel: "+4%" },
      { name: "Unlock", value: "Cruiser", perLevel: "" }
    ]
  },
  {
    id: "titanConstruction",
    name: "Megastructure Engineering",
    originalName: "Titan Tech",
    description: "The pinnacle of engineering, allowing the construction of moon-sized warships and titans.",
    area: "engineering",
    category: "voidcraft",
    tier: 6,
    icon: Anchor,
    baseCost: { metal: 5000000, crystal: 2500000, deuterium: 1000000 },
    costFactor: 2,
    effects: [
        { name: "Unlock", value: "Titan Class Ships", perLevel: "" },
        { name: "Construction", value: "Capital Build Speed", perLevel: "+5%" }
    ]
  }
];
