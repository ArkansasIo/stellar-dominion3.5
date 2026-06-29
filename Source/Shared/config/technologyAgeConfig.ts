export interface TechnologyAge {
  age: number;
  name: string;
  description: string;
  requirements: { type: string; id: string; level: number }[];
  unlockTechnologies: string[];
  bonuses: Record<string, number>;
  color: string;
}

export const TECHNOLOGY_AGES: TechnologyAge[] = [
  {
    age: 1,
    name: 'Primitive',
    description: 'Early spaceflight and basic industrial capacity. Limited to planetary surface operations.',
    requirements: [],
    unlockTechnologies: ['Combustion Drive', 'Basic Laser', 'Robotics'],
    bonuses: {},
    color: '#8B7355',
  },
  {
    age: 2,
    name: 'Industrial',
    description: 'Mass production and advanced robotics enable rapid expansion. First orbital infrastructure.',
    requirements: [
      { type: 'building', id: 'robotics-factory', level: 5 },
    ],
    unlockTechnologies: ['Impulse Drive', 'Ion Technology', 'Plasma Technology'],
    bonuses: { buildSpeed: 0.1, resourceProduction: 0.1 },
    color: '#8B8B00',
  },
  {
    age: 3,
    name: 'Space Age',
    description: 'Full solar system colonization capability. Advanced warship construction.',
    requirements: [
      { type: 'building', id: 'shipyard', level: 5 },
    ],
    unlockTechnologies: ['Hyperspace Technology', 'Shield Technology', 'Weapons Technology'],
    bonuses: { fleetAttack: 0.1, fleetDefense: 0.1, resourceProduction: 0.15 },
    color: '#006400',
  },
  {
    age: 4,
    name: 'Interstellar',
    description: 'Hyperspace travel enables interstellar empire. Cross-system trade and warfare.',
    requirements: [
      { type: 'technology', id: 'hyperspace-technology', level: 8 },
    ],
    unlockTechnologies: ['Graviton Technology', 'Armor Technology', 'Computer Technology'],
    bonuses: { fleetAttack: 0.15, fleetDefense: 0.15, resourceProduction: 0.2, researchSpeed: 0.1 },
    color: '#00008B',
  },
  {
    age: 5,
    name: 'Galactic',
    description: 'Mastery of galactic-scale physics. Ability to manipulate spacetime for instant travel.',
    requirements: [
      { type: 'technology', id: 'astrophysics', level: 15 },
    ],
    unlockTechnologies: ['Dark Matter Technology', 'Quantum Technology', 'Temporal Technology'],
    bonuses: { fleetAttack: 0.2, fleetDefense: 0.2, resourceProduction: 0.25, researchSpeed: 0.15, warpSpeed: 0.15 },
    color: '#4B0082',
  },
  {
    age: 6,
    name: 'Quantum',
    description: 'Quantum entanglement and subspace manipulation. Near-instantaneous communication and teleportation.',
    requirements: [
      { type: 'technology', id: 'plasma-technology', level: 15 },
    ],
    unlockTechnologies: ['Subspace Technology', 'Phase Technology', 'Quantum Computing'],
    bonuses: { fleetAttack: 0.25, fleetDefense: 0.25, resourceProduction: 0.3, researchSpeed: 0.2, warpSpeed: 0.2, energyEfficiency: 0.15 },
    color: '#8B008B',
  },
  {
    age: 7,
    name: 'Dark Matter',
    description: 'Harnessing dark matter and dark energy. Reality-warping weapons and defenses.',
    requirements: [
      { type: 'technology', id: 'dark-matter-research', level: 10 },
    ],
    unlockTechnologies: ['Dark Energy Tech', 'Void Technology', 'Singularity Tech'],
    bonuses: { fleetAttack: 0.35, fleetDefense: 0.3, resourceProduction: 0.35, researchSpeed: 0.25, warpSpeed: 0.25, energyEfficiency: 0.2 },
    color: '#2F004F',
  },
  {
    age: 8,
    name: 'Transcendent',
    description: 'Beyond conventional physics. Reality manipulation, universal constructs, and ascension.',
    requirements: [
      { type: 'technology', id: 'ancient-technology', level: 20 },
    ],
    unlockTechnologies: ['Ascension Technology', 'Universal Core', 'Reality Matrix'],
    bonuses: { fleetAttack: 0.5, fleetDefense: 0.4, resourceProduction: 0.5, researchSpeed: 0.35, warpSpeed: 0.35, energyEfficiency: 0.3 },
    color: '#FFD700',
  },
];

export function getTechnologyAge(requirements: Record<string, number>): TechnologyAge {
  let currentAge = TECHNOLOGY_AGES[0];
  for (const age of TECHNOLOGY_AGES) {
    let met = true;
    for (const req of age.requirements) {
      const currentLevel = requirements[req.id] || 0;
      if (currentLevel < req.level) {
        met = false;
        break;
      }
    }
    if (met) {
      currentAge = age;
    }
  }
  return currentAge;
}

export function getNextTechnologyAge(requirements: Record<string, number>): TechnologyAge | null {
  const current = getTechnologyAge(requirements);
  const nextIndex = TECHNOLOGY_AGES.findIndex(a => a.age === current.age) + 1;
  return nextIndex < TECHNOLOGY_AGES.length ? TECHNOLOGY_AGES[nextIndex] : null;
}
