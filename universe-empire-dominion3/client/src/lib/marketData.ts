import { 
  Cpu, Microchip, Hammer, Zap, Anchor, Shield, 
  Radio, Skull, Gem, Box, FileKey, Syringe 
} from "lucide-react";

export type ItemRarity = "common" | "uncommon" | "rare" | "legendary" | "contraband";
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
    inventory: ["plasteel", "nanofiber", "circuit_board"]
  },
  {
    id: "tech_vendor",
    name: "Dr. Aris Thorne",
    title: "Xenotech Researcher",
    description: "A brilliant but eccentric scientist selling surplus lab equipment and advanced components.",
    type: "scientist",
    specialty: "High-Tech Components",
    avatarColor: "bg-purple-600",
    inventory: ["circuit_board", "fusion_core", "targeting_matrix", "nanofiber"]
  },
  {
    id: "black_market",
    name: "The Broker",
    title: "Information Specialist",
    description: "No face, just a distorted voice on an encrypted channel. If it's illegal, they have it.",
    type: "black_market",
    specialty: "Contraband & Rare Tech",
    avatarColor: "bg-slate-900",
    inventory: ["hacked_chip", "stim_pack", "alien_artifact", "dark_matter", "fusion_core"]
  }
];
