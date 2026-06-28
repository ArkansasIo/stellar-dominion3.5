import { 
  Cpu, Microchip, Hammer, Zap, Anchor, Shield, 
  Radio, Skull, Gem, Box, FileKey, Syringe,
  Rocket, Sword, Target, Lock, Eye, Star
} from "lucide-react";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "contraband";
export type ItemType = "material" | "component" | "blueprint" | "commodity";

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: any;
  basePrice: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  title: string;
  description: string;
  type: "official" | "black_market" | "scientist";
  specialty: string;
  avatarColor: string;
  inventory: string[]; // IDs of items they sell
}

export const MARKET_ITEMS: MarketItem[] = [
  // --- RAW MATERIALS ---
  {
    id: "plasteel",
    name: "Reinforced Plasteel",
    description: "Standard construction material for military-grade hulls.",
    type: "material",
    rarity: "common",
    icon: Box,
    basePrice: { metal: 500, crystal: 0, deuterium: 0 }
  },
  {
    id: "nanofiber",
    name: "Carbon Nanofiber",
    description: "Lightweight and incredibly strong synthetic fibers.",
    type: "material",
    rarity: "uncommon",
    icon: Anchor,
    basePrice: { metal: 200, crystal: 300, deuterium: 0 }
  },
  
  // --- COMPONENTS ---
  {
    id: "circuit_board",
    name: "Quantum Circuit",
    description: "Basic processing unit for ship computers.",
    type: "component",
    rarity: "common",
    icon: Microchip,
    basePrice: { metal: 100, crystal: 400, deuterium: 50 }
  },
  {
    id: "fusion_core",
    name: "Micro-Fusion Core",
    description: "Compact power source for mechs and fighters.",
    type: "component",
    rarity: "rare",
    icon: Zap,
    basePrice: { metal: 1000, crystal: 1000, deuterium: 500 }
  },
  {
    id: "targeting_matrix",
    name: "AI Targeting Matrix",
    description: "Advanced sensor suite for capital ships.",
    type: "component",
    rarity: "uncommon",
    icon: Cpu,
    basePrice: { metal: 500, crystal: 800, deuterium: 200 }
  },

  // --- BLACK MARKET / CONTRABAND ---
  {
    id: "hacked_chip",
    name: "Decrypted Override Chip",
    description: "Illegal chip used to bypass trade federation blockades.",
    type: "commodity",
    rarity: "contraband",
    icon: FileKey,
    basePrice: { metal: 0, crystal: 5000, deuterium: 2000 }
  },
  {
    id: "stim_pack",
    name: "Combat Stims",
    description: "Banned performance enhancers for marine platoons.",
    type: "commodity",
    rarity: "contraband",
    icon: Syringe,
    basePrice: { metal: 0, crystal: 1000, deuterium: 1000 }
  },
  {
    id: "alien_artifact",
    name: "Precursor Relic",
    description: "Unknown device from a dead civilization. Emits faint radiation.",
    type: "commodity",
    rarity: "legendary",
    icon: Skull,
    basePrice: { metal: 50000, crystal: 50000, deuterium: 50000 }
  },
  {
    id: "dark_matter",
    name: "Stabilized Dark Matter",
    description: "Highly volatile substance used for experimental tech.",
    type: "material",
    rarity: "rare",
    icon: Gem,
    basePrice: { metal: 0, crystal: 0, deuterium: 10000 }
  },

  // --- WEAPONS ---
  {
    id: "plasma_turret",
    name: "Plasma Turret MK-III",
    description: "High-output plasma weapon for capital ship defense batteries.",
    type: "component",
    rarity: "uncommon",
    icon: Target,
    basePrice: { metal: 2000, crystal: 1500, deuterium: 300 }
  },
  {
    id: "ion_disruptor",
    name: "Ion Disruptor Array",
    description: "Disables enemy shields and electronic systems on impact.",
    type: "component",
    rarity: "rare",
    icon: Zap,
    basePrice: { metal: 3000, crystal: 2500, deuterium: 800 }
  },
  {
    id: "missile_pack",
    name: "Guided Missile Rack",
    description: "Swarm missile system for anti-fighter defense.",
    type: "component",
    rarity: "common",
    icon: Rocket,
    basePrice: { metal: 1500, crystal: 500, deuterium: 200 }
  },

  // --- DEFENSE ---
  {
    id: "shield_generator",
    name: "Deflector Shield Unit",
    description: "Energy shield generator for orbital station defense.",
    type: "component",
    rarity: "uncommon",
    icon: Shield,
    basePrice: { metal: 2500, crystal: 2000, deuterium: 500 }
  },
  {
    id: "hull_plate",
    name: "Titanium Hull Plating",
    description: "Reinforced armor plating for ship hull upgrades.",
    type: "material",
    rarity: "common",
    icon: Anchor,
    basePrice: { metal: 800, crystal: 200, deuterium: 0 }
  },

  // --- ESPIONAGE ---
  {
    id: "stealth_module",
    name: "Cloaking Field Module",
    description: "Reduces ship visibility on enemy sensors by 80%.",
    type: "component",
    rarity: "rare",
    icon: Eye,
    basePrice: { metal: 1000, crystal: 3000, deuterium: 1500 }
  },
  {
    id: "hacking_toolkit",
    name: "Infiltration Toolkit",
    description: "Advanced hacking suite for espionage operations.",
    type: "commodity",
    rarity: "uncommon",
    icon: Lock,
    basePrice: { metal: 500, crystal: 1200, deuterium: 300 }
  },

  // --- COMMANDER GEAR ---
  {
    id: "commander_medal",
    name: "Medal of Valor",
    description: "Awarded for exceptional service. Grants +5% XP bonus.",
    type: "commodity",
    rarity: "rare",
    icon: Star,
    basePrice: { metal: 0, crystal: 0, deuterium: 5000 }
  },
  {
    id: "commander芯片",
    name: "Neural Enhancement Chip",
    description: "Boosts commander reaction time. Reduces fleet command delay.",
    type: "component",
    rarity: "epic",
    icon: Cpu,
    basePrice: { metal: 5000, crystal: 8000, deuterium: 2000 }
  }
];

export const VENDORS: Vendor[] = [
  {
    id: "industrial_vendor",
    name: "Foreman Jaxon",
    title: "Chief Supply Officer",
    description: "A gruff veteran of the shipyard docks. He deals in bulk materials and hull plating.",
    type: "official",
    specialty: "Construction Materials",
    avatarColor: "bg-blue-600",
    inventory: ["plasteel", "nanofiber", "circuit_board", "hull_plate", "missile_pack"]
  },
  {
    id: "tech_vendor",
    name: "Dr. Aris Thorne",
    title: "Xenotech Researcher",
    description: "A brilliant but eccentric scientist selling surplus lab equipment and advanced components.",
    type: "scientist",
    specialty: "High-Tech Components",
    avatarColor: "bg-purple-600",
    inventory: ["circuit_board", "fusion_core", "targeting_matrix", "nanofiber", "ion_disruptor", "commander芯片"]
  },
  {
    id: "black_market",
    name: "The Broker",
    title: "Information Specialist",
    description: "No face, just a distorted voice on an encrypted channel. If it's illegal, they have it.",
    type: "black_market",
    specialty: "Contraband & Rare Tech",
    avatarColor: "bg-slate-900",
    inventory: ["hacked_chip", "stim_pack", "alien_artifact", "dark_matter", "fusion_core", "stealth_module"]
  },
  {
    id: "terran_armory",
    name: "Quartermaster Hale",
    title: "Terran Empire Armorer",
    description: "Official Terran Empire weapons dealer. Only sells to verified imperial citizens with proper clearance.",
    type: "official",
    specialty: "Military Weapons & Defense",
    avatarColor: "bg-red-700",
    inventory: ["plasma_turret", "ion_disruptor", "missile_pack", "shield_generator", "hull_plate"]
  },
  {
    id: "merchant_guild_trader",
    name: "Trade Master Voss",
    title: "Merchant Guild Representative",
    description: "The galactic merchant guild's finest negotiator. Always has a deal ready and a profit margin to match.",
    type: "official",
    specialty: "Bulk Resources & Trade Goods",
    avatarColor: "bg-amber-600",
    inventory: ["plasteel", "nanofiber", "hull_plate", "commander_medal", "dark_matter"]
  },
  {
    id: "void_corsair_smuggler",
    name: "Captain Blackmaw",
    title: "Void Corsairs Trade Ship",
    description: "Runs the corsair trading post at Rogue Station. Stolen goods, contraband, and rare finds.",
    type: "black_market",
    specialty: "Contraband & Stolen Tech",
    avatarColor: "bg-slate-800",
    inventory: ["hacked_chip", "stim_pack", "stealth_module", "hacking_toolkit", "alien_artifact"]
  },
  {
    id: "zyx_tech_dealer",
    name: "Zyx-7 Exchange Node",
    title: "Zyx Collective Tech Broker",
    description: "Silicon-based intelligence offering advanced Zyx technology. Trades in data and resources.",
    type: "scientist",
    specialty: "Advanced Alien Technology",
    avatarColor: "bg-cyan-600",
    inventory: ["fusion_core", "targeting_matrix", "ion_disruptor", "stealth_module", "commander芯片"]
  }
];
