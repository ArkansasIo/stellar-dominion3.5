import { 
  Rocket, Shield, Swords, Box, Crosshair, Zap, 
  Skull, Anchor, Users, Truck, Eye, Disc, 
  Activity, Target, Cpu, Globe, Hexagon, Pyramid
} from "lucide-react";

export type UnitClass = "fighter" | "capital" | "civilian" | "defense" | "troop" | "vehicle" | "super" | "titan";

export interface UnitItem {
  id: string;
  name: string;
  description: string;
  class: UnitClass;
  icon: any;
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  stats: {
    structure: number;
    shield: number;
    attack: number;
    cargo: number;
    speed: number;
  };
  requirements?: { [key: string]: number };
}

export const unitData: UnitItem[] = [
  // --- FIGHTERS ---
  {
    id: "lightFighter",
    name: "Viper",
    description: "The agile light fighter is the basic unit of any fleet.",
    class: "fighter",
    icon: Swords,
    cost: { metal: 3000, crystal: 1000, deuterium: 0 },
    stats: { structure: 4000, shield: 10, attack: 50, cargo: 50, speed: 12500 }
  },
  {
    id: "heavyFighter",
    name: "Cobra",
    description: "Stronger armour and shields make it a threat to light fighters.",
    class: "fighter",
    icon: Shield,
    cost: { metal: 6000, crystal: 4000, deuterium: 0 },
    stats: { structure: 10000, shield: 25, attack: 150, cargo: 100, speed: 10000 }
  },
  {
    id: "interceptor",
    name: "Wraith",
    description: "Advanced fighter craft designed for space superiority.",
    class: "fighter",
    icon: Rocket,
    cost: { metal: 15000, crystal: 10000, deuterium: 2000 },
    stats: { structure: 25000, shield: 50, attack: 400, cargo: 0, speed: 15000 }
  },

  // --- CAPITAL SHIPS ---
  {
    id: "cruiser",
    name: "Hammerhead",
    description: "Fast heavily armed ship, excellent against fighter swarms.",
    class: "capital",
    icon: Crosshair,
    cost: { metal: 20000, crystal: 7000, deuterium: 2000 },
    stats: { structure: 27000, shield: 50, attack: 400, cargo: 800, speed: 15000 }
  },
  {
    id: "battleship",
    name: "Leviathan",
    description: "The backbone of any fleet. Heavy weapons and strong shields.",
    class: "capital",
    icon: Target,
    cost: { metal: 45000, crystal: 15000, deuterium: 0 },
    stats: { structure: 60000, shield: 200, attack: 1000, cargo: 1500, speed: 10000 }
  },
  {
    id: "battlecruiser",
    name: "Reaper",
    description: "Specialized in hunting other capital ships with focused ion beams.",
    class: "capital",
    icon: Zap,
    cost: { metal: 30000, crystal: 40000, deuterium: 15000 },
    stats: { structure: 70000, shield: 400, attack: 700, cargo: 750, speed: 10000 }
  },
  {
    id: "destroyer",
    name: "Obliterator",
    description: "Massive warship designed to destroy light ships and defenses.",
    class: "capital",
    icon: Anchor,
    cost: { metal: 60000, crystal: 50000, deuterium: 15000 },
    stats: { structure: 110000, shield: 500, attack: 2000, cargo: 2000, speed: 5000 }
  },
  {
    id: "bomber",
    name: "Devastator",
    description: "Designed to destroy planetary defenses with plasma bombs.",
    class: "capital",
    icon: Disc,
    cost: { metal: 50000, crystal: 25000, deuterium: 15000 },
    stats: { structure: 75000, shield: 500, attack: 1000, cargo: 500, speed: 4000 }
  },

  // --- SUPER CAPITAL ---
  {
    id: "mothership",
    name: "Mothership",
    description: "A mobile command center capable of fabricating smaller ships.",
    class: "super",
    icon: Activity,
    cost: { metal: 1000000, crystal: 500000, deuterium: 100000 },
    stats: { structure: 1500000, shield: 10000, attack: 5000, cargo: 100000, speed: 2000 }
  },
  {
    id: "deathstar",
    name: "Planet Killer",
    description: "A moon-sized station with a graviton cannon capable of destroying moons.",
    class: "super",
    icon: Skull,
    cost: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
    stats: { structure: 9000000, shield: 50000, attack: 200000, cargo: 1000000, speed: 100 }
  },

  // --- TITANS ---
  {
    id: "titanPrometheus",
    name: "Avatar",
    description: "A massive Titan-class vessel utilizing ancient Terran design. Features a spinal mounted Doomsday Device.",
    class: "titan",
    icon: Hexagon,
    cost: { metal: 10000000, crystal: 8000000, deuterium: 5000000 },
    stats: { structure: 25000000, shield: 1000000, attack: 5000000, cargo: 500000, speed: 50 }
  },
  {
    id: "titanAtlas",
    name: "Erebus",
    description: "The Erebus specializes in fleet support and armor tanking. Its presence boosts fleet morale.",
    class: "titan",
    icon: Shield,
    cost: { metal: 12000000, crystal: 10000000, deuterium: 4000000 },
    stats: { structure: 40000000, shield: 2000000, attack: 3000000, cargo: 800000, speed: 40 }
  },
  {
    id: "titanHyperion",
    name: "Ragnarok",
    description: "A projectile-based Titan platform. Launches MAC rounds the size of skyscrapers.",
    class: "titan",
    icon: Pyramid,
    cost: { metal: 9000000, crystal: 7000000, deuterium: 3000000 },
    stats: { structure: 20000000, shield: 500000, attack: 8000000, cargo: 200000, speed: 60 }
  },

  // --- CIVILIAN ---
  {
    id: "smallCargo",
    name: "Hermes",
    description: "Agile transport ship for small amounts of resources.",
    class: "civilian",
    icon: Box,
    cost: { metal: 2000, crystal: 2000, deuterium: 0 },
    stats: { structure: 4000, shield: 10, attack: 5, cargo: 5000, speed: 5000 }
  },
  {
    id: "largeCargo",
    name: "Hercules",
    description: "Heavy transport ship with massive cargo capacity.",
    class: "civilian",
    icon: Box,
    cost: { metal: 6000, crystal: 6000, deuterium: 0 },
    stats: { structure: 12000, shield: 25, attack: 5, cargo: 25000, speed: 7500 }
  },
  {
    id: "colonyShip",
    name: "Exodus",
    description: "Used to colonize empty planets.",
    class: "civilian",
    icon: Globe,
    cost: { metal: 10000, crystal: 20000, deuterium: 10000 },
    stats: { structure: 30000, shield: 100, attack: 50, cargo: 7500, speed: 2500 }
  },
  {
    id: "recycler",
    name: "Scavenger",
    description: "Harvests resources from debris fields.",
    class: "civilian",
    icon: Truck,
    cost: { metal: 10000, crystal: 6000, deuterium: 2000 },
    stats: { structure: 16000, shield: 10, attack: 1, cargo: 20000, speed: 2000 }
  },
  {
    id: "espionageProbe",
    name: "Seeker Drone",
    description: "Small drone to spy on other planets.",
    class: "civilian",
    icon: Eye,
    cost: { metal: 0, crystal: 1000, deuterium: 0 },
    stats: { structure: 1000, shield: 0, attack: 0, cargo: 5, speed: 100000000 }
  },

  // --- TROOPS / PERSONNEL ---
  {
    id: "marine",
    name: "Space Marine",
    description: "Basic infantry unit for boarding actions and ground defense.",
    class: "troop",
    icon: Users,
    cost: { metal: 100, crystal: 50, deuterium: 0 },
    stats: { structure: 100, shield: 5, attack: 10, cargo: 0, speed: 0 }
  },
  {
    id: "exoTrooper",
    name: "Exo-Trooper",
    description: "Heavily armored infantry with exoskeleton suits.",
    class: "troop",
    icon: Cpu,
    cost: { metal: 500, crystal: 200, deuterium: 50 },
    stats: { structure: 500, shield: 20, attack: 50, cargo: 0, speed: 0 }
  },
  {
    id: "colonist",
    name: "Colonist",
    description: "Civilian population to increase planetary workforce.",
    class: "troop",
    icon: Users,
    cost: { metal: 50, crystal: 50, deuterium: 0 },
    stats: { structure: 50, shield: 0, attack: 0, cargo: 0, speed: 0 }
  },

  // --- VEHICLES ---
  {
    id: "hoverTank",
    name: "Hover Tank",
    description: "Fast ground vehicle for planetary defense.",
    class: "vehicle",
    icon: Truck,
    cost: { metal: 2000, crystal: 500, deuterium: 100 },
    stats: { structure: 2000, shield: 100, attack: 200, cargo: 0, speed: 50 }
  },
  {
    id: "battleMech",
    name: "Titan Mech",
    description: "Heavy assault walker for ground supremacy.",
    class: "vehicle",
    icon: Cpu,
    cost: { metal: 10000, crystal: 5000, deuterium: 1000 },
    stats: { structure: 10000, shield: 500, attack: 1000, cargo: 0, speed: 20 }
  }
];
