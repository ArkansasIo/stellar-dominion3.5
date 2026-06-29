// Planet Defenses Configuration — GDD-aligned
// Covers: Rocket Launcher, Laser Turret, Gauss Cannon, Ion Cannon,
//         Plasma Cannon, Missile Battery, Shield Dome,
//         Orbital Defense Platform, Planetary Cannon, Defense Satellites

export type DefenseCategory =
  | 'basic'
  | 'energy'
  | 'kinetic'
  | 'missile'
  | 'shield'
  | 'orbital'
  | 'super'
  | 'satellite';

export interface DefenseSystem {
  id: string;
  name: string;
  description: string;
  category: DefenseCategory;
  tier: number;
  buildCost: { metal: number; crystal: number; deuterium: number };
  buildTime: number;
  powerRequired: number;
  crewRequired: number;
  stats: {
    attack: number;
    defense: number;
    shield: number;
    hull: number;
    accuracy: number;
    range: 'close' | 'medium' | 'long' | 'extreme';
    rapidFire: { [targetId: string]: number };
  };
  specialAbilities?: string[];
  unlockRequirements?: { techId?: string; minTier?: number };
}

export const PLANET_DEFENSES: DefenseSystem[] = [
  {
    id: 'rocket-launcher',
    name: 'Rocket Launcher',
    description: 'Basic kinetic missile launcher for point defense',
    category: 'basic',
    tier: 1,
    buildCost: { metal: 2000, crystal: 0, deuterium: 0 },
    buildTime: 300,
    powerRequired: 10,
    crewRequired: 0,
    stats: { attack: 80, defense: 20, shield: 10, hull: 200, accuracy: 70, range: 'close', rapidFire: {} },
    specialAbilities: ['Anti-missile'],
    unlockRequirements: { minTier: 1 },
  },
  {
    id: 'laser-turret',
    name: 'Laser Turret',
    description: 'Directed-energy turret for anti-ship and anti-missile defense',
    category: 'energy',
    tier: 2,
    buildCost: { metal: 3000, crystal: 1500, deuterium: 0 },
    buildTime: 600,
    powerRequired: 25,
    crewRequired: 0,
    stats: { attack: 150, defense: 40, shield: 50, hull: 100, accuracy: 85, range: 'medium', rapidFire: {} },
    specialAbilities: ['Precise targeting'],
    unlockRequirements: { minTier: 2 },
  },
  {
    id: 'gauss-cannon',
    name: 'Gauss Cannon',
    description: 'Electromagnetic kinetic cannon with heavy armor penetration',
    category: 'kinetic',
    tier: 3,
    buildCost: { metal: 6000, crystal: 2000, deuterium: 500 },
    buildTime: 1200,
    powerRequired: 50,
    crewRequired: 2,
    stats: { attack: 400, defense: 80, shield: 30, hull: 400, accuracy: 75, range: 'long', rapidFire: {} },
    specialAbilities: ['Armor piercing', 'Shield bypass'],
    unlockRequirements: { minTier: 4 },
  },
  {
    id: 'ion-cannon',
    name: 'Ion Cannon',
    description: 'Ion-based weapon that drains shields and disables electronics',
    category: 'energy',
    tier: 3,
    buildCost: { metal: 5000, crystal: 4000, deuterium: 1000 },
    buildTime: 1500,
    powerRequired: 60,
    crewRequired: 3,
    stats: { attack: 250, defense: 100, shield: 80, hull: 300, accuracy: 80, range: 'medium', rapidFire: {} },
    specialAbilities: ['Shield drain', 'System disable chance'],
    unlockRequirements: { techId: 'ion_tech', minTier: 4 },
  },
  {
    id: 'plasma-cannon',
    name: 'Plasma Cannon',
    description: 'High-energy plasma weapon devastating to hulls',
    category: 'energy',
    tier: 4,
    buildCost: { metal: 10000, crystal: 8000, deuterium: 3000 },
    buildTime: 2400,
    powerRequired: 100,
    crewRequired: 4,
    stats: { attack: 800, defense: 150, shield: 120, hull: 500, accuracy: 70, range: 'medium', rapidFire: {} },
    specialAbilities: ['Hull melting', 'Splash damage'],
    unlockRequirements: { techId: 'plasma_tech', minTier: 6 },
  },
  {
    id: 'missile-battery',
    name: 'Missile Battery',
    description: 'Multi-launcher missile system for saturation attacks',
    category: 'missile',
    tier: 3,
    buildCost: { metal: 8000, crystal: 2000, deuterium: 4000 },
    buildTime: 1800,
    powerRequired: 40,
    crewRequired: 2,
    stats: { attack: 500, defense: 50, shield: 20, hull: 250, accuracy: 60, range: 'long', rapidFire: {} },
    specialAbilities: ['Saturation volley', 'Interceptable'],
    unlockRequirements: { minTier: 3 },
  },
  {
    id: 'shield-dome',
    name: 'Shield Dome',
    description: 'Planetary shield generator providing global defense coverage',
    category: 'shield',
    tier: 4,
    buildCost: { metal: 15000, crystal: 10000, deuterium: 5000 },
    buildTime: 3600,
    powerRequired: 200,
    crewRequired: 5,
    stats: { attack: 0, defense: 500, shield: 2000, hull: 1000, accuracy: 0, range: 'close', rapidFire: {} },
    specialAbilities: ['Planetary shield', 'Regenerates', 'Energy absorption'],
    unlockRequirements: { techId: 'shield_tech', minTier: 5 },
  },
  {
    id: 'orbital-defense-platform',
    name: 'Orbital Defense Platform',
    description: 'Orbital weapons platform with heavy armor and multiple weapon mounts',
    category: 'orbital',
    tier: 5,
    buildCost: { metal: 25000, crystal: 15000, deuterium: 10000 },
    buildTime: 7200,
    powerRequired: 300,
    crewRequired: 10,
    stats: { attack: 1500, defense: 800, shield: 1000, hull: 3000, accuracy: 85, range: 'extreme', rapidFire: {} },
    specialAbilities: ['Multi-weapon mounts', 'Orbital bombardment', 'Independent targeting'],
    unlockRequirements: { techId: 'orbital_defense', minTier: 7 },
  },
  {
    id: 'planetary-cannon',
    name: 'Planetary Cannon',
    description: 'Massive planet-mounted superweapon capable of engaging capital ships',
    category: 'super',
    tier: 6,
    buildCost: { metal: 50000, crystal: 30000, deuterium: 20000 },
    buildTime: 14400,
    powerRequired: 500,
    crewRequired: 20,
    stats: { attack: 5000, defense: 200, shield: 500, hull: 5000, accuracy: 90, range: 'extreme', rapidFire: {} },
    specialAbilities: ['Capital ship killer', 'Charged shot', 'Planetary siege defense'],
    unlockRequirements: { techId: 'super_weapons', minTier: 9 },
  },
  {
    id: 'defense-satellites',
    name: 'Defense Satellites',
    description: 'Swarm of networked defense satellites providing overlapping coverage',
    category: 'satellite',
    tier: 2,
    buildCost: { metal: 1000, crystal: 2000, deuterium: 500 },
    buildTime: 900,
    powerRequired: 5,
    crewRequired: 0,
    stats: { attack: 100, defense: 300, shield: 50, hull: 50, accuracy: 80, range: 'close', rapidFire: {} },
    specialAbilities: ['Network bonus', 'Replaceable', 'Detection boost'],
    unlockRequirements: { minTier: 2 },
  },
];

export function getDefenseById(id: string): DefenseSystem | undefined {
  return PLANET_DEFENSES.find(d => d.id === id);
}

export function getDefensesByCategory(category: DefenseCategory): DefenseSystem[] {
  return PLANET_DEFENSES.filter(d => d.category === category);
}

export function getDefensesByTier(tier: number): DefenseSystem[] {
  return PLANET_DEFENSES.filter(d => d.tier === tier);
}

export function getTotalDefensePower(defenses: { id: string; count: number }[]): {
  attack: number;
  defense: number;
  shield: number;
  hull: number;
} {
  const totals = { attack: 0, defense: 0, shield: 0, hull: 0 };
  for (const entry of defenses) {
    const def = getDefenseById(entry.id);
    if (def) {
      totals.attack += def.stats.attack * entry.count;
      totals.defense += def.stats.defense * entry.count;
      totals.shield += def.stats.shield * entry.count;
      totals.hull += def.stats.hull * entry.count;
    }
  }
  return totals;
}
