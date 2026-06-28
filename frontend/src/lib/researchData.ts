import { Zap, Atom, Cpu, Eye, Rocket, Shield, Swords, Radio, Crosshair, Globe, Database, Activity, Layers, Server, Wind, Flame, Disc } from "lucide-react";

export interface ResearchItem {
  id: string;
  name: string;
  description: string;
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
    value: string; // e.g. "+10%" or "Unlock"
    perLevel?: string; // e.g. "10%"
  }[];
  requirements?: string[];
}

export const researchData: ResearchItem[] = [
  // BASIC TECHNOLOGIES
  {
    id: "energyTech",
    name: "Energy Technology",
    description: "The command of different types of energy is necessary for many new technologies.",
    tier: 1,
    icon: Zap,
    baseCost: { metal: 0, crystal: 800, deuterium: 400 },
    costFactor: 2,
    effects: [
      { name: "Energy Production", value: "Unlock Fusion", perLevel: "0%" },
      { name: "Unlock", value: "Impulse Drive (Lvl 1)", perLevel: "" }
    ]
  },
  {
    id: "laserTech",
    name: "Laser Technology",
    description: "A focused beam of light that causes damage when it hits a target.",
    tier: 1,
    icon: Crosshair,
    baseCost: { metal: 200, crystal: 100, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Damage", value: "Base for Lasers", perLevel: "5%" },
      { name: "Unlock", value: "Heavy Fighter (Lvl 6)", perLevel: "" }
    ]
  },
  {
    id: "ionTech",
    name: "Ion Technology",
    description: "Concentrates ions to a deadly beam.",
    tier: 2,
    icon: Atom,
    baseCost: { metal: 1000, crystal: 300, deuterium: 100 },
    costFactor: 2,
    effects: [
      { name: "Deconstruction", value: "Faster Demolition", perLevel: "4%" },
      { name: "Unlock", value: "Cruiser (Lvl 2)", perLevel: "" }
    ]
  },
  {
    id: "hyperspaceTech",
    name: "Hyperspace Technology",
    description: "By integrating the 4th and 5th dimensions, it is possible to travel faster than light.",
    tier: 3,
    icon: Layers,
    baseCost: { metal: 0, crystal: 4000, deuterium: 2000 },
    costFactor: 2,
    effects: [
      { name: "Cargo Capacity", value: "Base Increase", perLevel: "5%" },
      { name: "Unlock", value: "Battleship (Lvl 4)", perLevel: "" }
    ]
  },
  {
    id: "plasmaTech",
    name: "Plasma Technology",
    description: "A further development of Ion Technology which accelerates high-energy plasma.",
    tier: 4,
    icon: Flame,
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 },
    costFactor: 2,
    effects: [
      { name: "Mine Production", value: "Metal +1% / Crystal +0.66%", perLevel: "1%" },
      { name: "Weapon Damage", value: "Plasma Weapons", perLevel: "10%" }
    ]
  },

  // DRIVE TECHNOLOGIES
  {
    id: "combustionDrive",
    name: "Combustion Drive",
    description: "The development of these drives makes some ships faster, although each level increases speed by only 10% of the base value.",
    tier: 1,
    icon: Wind,
    baseCost: { metal: 400, crystal: 0, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Ship Speed", value: "Small Ships", perLevel: "10%" },
      { name: "Unlock", value: "Light Fighter", perLevel: "" }
    ]
  },
  {
    id: "impulseDrive",
    name: "Impulse Drive",
    description: "The impulse drive is based on the reaction principle. Further development of this drive makes some ships faster.",
    tier: 2,
    icon: Rocket,
    baseCost: { metal: 2000, crystal: 4000, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Ship Speed", value: "Cruisers / Bombers", perLevel: "20%" },
      { name: "Unlock", value: "Interplanetary Missiles", perLevel: "" }
    ]
  },
  {
    id: "hyperspaceDrive",
    name: "Hyperspace Drive",
    description: "Hyperspace drive distorts space-time in the immediate vicinity of the ship.",
    tier: 3,
    icon: Disc,
    baseCost: { metal: 10000, crystal: 20000, deuterium: 6000 },
    costFactor: 2,
    effects: [
      { name: "Ship Speed", value: "Capital Ships", perLevel: "30%" },
      { name: "Unlock", value: "Destroyer", perLevel: "" }
    ]
  },

  // ADVANCED TECHNOLOGIES
  {
    id: "espionageTech",
    name: "Espionage Technology",
    description: "Information is power. Espionage probes can gather information about other planets.",
    tier: 1,
    icon: Eye,
    baseCost: { metal: 200, crystal: 1000, deuterium: 200 },
    costFactor: 2,
    effects: [
      { name: "Scan Detail", value: "More Info", perLevel: "Level +1" },
      { name: "Counter-Espionage", value: "Detection Chance", perLevel: "Increase" }
    ]
  },
  {
    id: "computerTech",
    name: "Computer Technology",
    description: "More computer capacity allows for more parallel fleet commands.",
    tier: 1,
    icon: Server,
    baseCost: { metal: 0, crystal: 400, deuterium: 600 },
    costFactor: 2,
    effects: [
      { name: "Fleet Slots", value: "+1 Slot", perLevel: "1" },
      { name: "Unlock", value: "Nanite Factory", perLevel: "" }
    ]
  },
  {
    id: "astrophysics",
    name: "Astrophysics",
    description: "Ships with astrophysics modules can undertake long expeditions and colonize new planets.",
    tier: 3,
    icon: Globe,
    baseCost: { metal: 4000, crystal: 8000, deuterium: 4000 },
    costFactor: 1.75,
    effects: [
      { name: "Expeditions", value: "Allow Expeditions", perLevel: "Duration" },
      { name: "Colonies", value: "New Colony every 2 levels", perLevel: "0.5" }
    ]
  },
  {
    id: "intergalacticResearchNetwork",
    name: "Intergalactic Research Network",
    description: "Researchers on different planets can communicate via this network.",
    tier: 4,
    icon: Database,
    baseCost: { metal: 240000, crystal: 400000, deuterium: 160000 },
    costFactor: 2,
    effects: [
      { name: "Research Speed", value: "Links Labs", perLevel: "+1 Lab" },
      { name: "Efficiency", value: "Combined Levels", perLevel: "Sum" }
    ]
  },
  {
    id: "gravitonTech",
    name: "Graviton Technology",
    description: "Firing a concentrated charge of graviton particles can create an artificial gravity field.",
    tier: 5,
    icon: Activity,
    baseCost: { metal: 0, crystal: 0, deuterium: 0, energy: 300000 },
    costFactor: 3,
    effects: [
      { name: "Unlock", value: "Death Star", perLevel: "Ultimate Ship" },
      { name: "Prestige", value: "High Score", perLevel: "Massive" }
    ]
  },

  // COMBAT TECHNOLOGIES
  {
    id: "weaponsTech",
    name: "Weapons Technology",
    description: "Weapons technology makes weapons systems more efficient.",
    tier: 2,
    icon: Swords,
    baseCost: { metal: 800, crystal: 200, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Damage", value: "All Ships/Defense", perLevel: "+10%" },
      { name: "Unlock", value: "Gauss Cannon", perLevel: "" }
    ]
  },
  {
    id: "shieldingTech",
    name: "Shielding Technology",
    description: "Shielding technology makes the shields on ships and defensive structures more effective.",
    tier: 2,
    icon: Shield,
    baseCost: { metal: 200, crystal: 600, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Shield Strength", value: "All Ships/Defense", perLevel: "+10%" },
      { name: "Unlock", value: "Large Shield Dome", perLevel: "" }
    ]
  },
  {
    id: "armourTech",
    name: "Armour Technology",
    description: "Special alloys improve the armour of ships and defensive structures.",
    tier: 2,
    icon: Shield,
    baseCost: { metal: 1000, crystal: 0, deuterium: 0 },
    costFactor: 2,
    effects: [
      { name: "Hull Integrity", value: "All Ships/Defense", perLevel: "+10%" },
      { name: "Unlock", value: "Heavy Laser", perLevel: "" }
    ]
  },
  
  // FUTURE TECH (Tier 20+)
  {
    id: "aiTech",
    name: "Artificial Intelligence",
    description: "Advanced AI systems automate fleet logistics and battle tactics.",
    tier: 6,
    icon: Cpu,
    baseCost: { metal: 50000, crystal: 50000, deuterium: 100000 },
    costFactor: 2,
    effects: [
      { name: "Automation", value: "Auto-mine", perLevel: "Efficiency" },
      { name: "Combat", value: "Initiative", perLevel: "+2%" }
    ]
  },
  {
    id: "quantumTech",
    name: "Quantum Computing",
    description: "Quantum processors solve complex astrophysical problems instantly.",
    tier: 6,
    icon: Layers,
    baseCost: { metal: 100000, crystal: 200000, deuterium: 150000 },
    costFactor: 2,
    effects: [
      { name: "Research Speed", value: "Global Speed", perLevel: "+5%" },
      { name: "Encryption", value: "Unbreakable", perLevel: "Safe" }
    ]
  }
];
