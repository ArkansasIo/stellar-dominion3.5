
export type ArchetypeFamily =
  | 'starship'
  | 'mothership'
  | 'unit'
  | 'untrained-unit'
  | 'job'
  | 'megastructure'
  | 'space-station'
  | 'starbase'
  | 'moonbase';

export interface EntityArchetype {
  id: string;
  name: string;
  family: ArchetypeFamily;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
}

type ArchetypeSeed = Omit<EntityArchetype, 'id' | 'name'>;

function toName(seed: ArchetypeSeed): string {
  return `${seed.subType} ${seed.type}`;
}

function createArchetypes(family: ArchetypeFamily, startIndex: number, seeds: ArchetypeSeed[]): EntityArchetype[] {
  return seeds.map((seed, index) => ({
    id: `${family}-${String(startIndex + index).padStart(3, '0')}`,
    name: toName(seed),
    ...seed,
  }));
}

const STARSHIP_SEEDS: ArchetypeSeed[] = [
  { family: 'starship', category: 'Fleet', subCategory: 'Assault Wing', type: 'Starship', subType: 'Interceptor', class: 'Fighter', subClass: 'Light Attack' },
  { family: 'starship', category: 'Fleet', subCategory: 'Assault Wing', type: 'Starship', subType: 'Bomber', class: 'Fighter', subClass: 'Heavy Attack' },
  { family: 'starship', category: 'Fleet', subCategory: 'Assault Wing', type: 'Starship', subType: 'Gunboat', class: 'Fighter', subClass: 'Heavy Gun' },
  { family: 'starship', category: 'Fleet', subCategory: 'Assault Wing', type: 'Starship', subType: 'EMP Fighter', class: 'Fighter', subClass: 'Electronic Warfare' },
  { family: 'starship', category: 'Fleet', subCategory: 'Escort Wing', type: 'Starship', subType: 'Corvette', class: 'Escort', subClass: 'Anti-Fighter' },
  { family: 'starship', category: 'Fleet', subCategory: 'Escort Wing', type: 'Starship', subType: 'Frigate', class: 'Escort', subClass: 'Convoy Screen' },
  { family: 'starship', category: 'Fleet', subCategory: 'Escort Wing', type: 'Starship', subType: 'Missile Frigate', class: 'Escort', subClass: 'Ordnance' },
  { family: 'starship', category: 'Fleet', subCategory: 'Escort Wing', type: 'Starship', subType: 'Destroyer', class: 'Escort', subClass: 'Assault Escort' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Battlecruiser', class: 'Capital', subClass: 'Command' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Dreadnought', class: 'Capital', subClass: 'Heavy Assault' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Carrier', class: 'Capital', subClass: 'Strike Support' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Light Carrier', class: 'Capital', subClass: 'Rapid Support' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Titan', class: 'Titan', subClass: 'Ultimate Weapon' },
  { family: 'starship', category: 'Fleet', subCategory: 'Capital Wing', type: 'Starship', subType: 'Flagship', class: 'Capital', subClass: 'Fleet Command' },
  { family: 'starship', category: 'Fleet', subCategory: 'Special Operations', type: 'Starship', subType: 'Science Vessel', class: 'Support', subClass: 'Research' },
  { family: 'starship', category: 'Fleet', subCategory: 'Recon Wing', type: 'Starship', subType: 'Scout', class: 'Recon', subClass: 'Deep Space' },
];

const MOTHERSHIP_SEEDS: ArchetypeSeed[] = [
  { family: 'mothership', category: 'Command Core', subCategory: 'Fleet Backbone', type: 'Mothership', subType: 'Command Ship', class: 'Support', subClass: 'Fleet Command' },
  { family: 'mothership', category: 'Command Core', subCategory: 'Fleet Backbone', type: 'Mothership', subType: 'Flag Command', class: 'Support', subClass: 'Strategic C2' },
  { family: 'mothership', category: 'Industrial Core', subCategory: 'Production Yard', type: 'Mothership', subType: 'Factory Ship', class: 'Support', subClass: 'Production' },
  { family: 'mothership', category: 'Industrial Core', subCategory: 'Production Yard', type: 'Mothership', subType: 'Resource Harvester', class: 'Civilian', subClass: 'Mining' },
  { family: 'mothership', category: 'Support Core', subCategory: 'Medical & Recovery', type: 'Mothership', subType: 'Hospital Ship', class: 'Support', subClass: 'Medical' },
  { family: 'mothership', category: 'Support Core', subCategory: 'Medical & Recovery', type: 'Mothership', subType: 'Colony Ship', class: 'Civilian', subClass: 'Colonization' },
  { family: 'mothership', category: 'Siege Core', subCategory: 'Heavy Projection', type: 'Mothership', subType: 'Mobile Fortress', class: 'Capital', subClass: 'Defense' },
  { family: 'mothership', category: 'Siege Core', subCategory: 'Heavy Projection', type: 'Mothership', subType: 'Siege Ship', class: 'Capital', subClass: 'Planetary Siege' },
];

const UNIT_SEEDS: ArchetypeSeed[] = [
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Infantry', class: 'Ground', subClass: 'Standard' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Heavy Infantry', class: 'Ground', subClass: 'Heavy' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Commando', class: 'Ground', subClass: 'Stealth' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Sniper Team', class: 'Ground', subClass: 'Recon' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Assault Team', class: 'Ground', subClass: 'Assault' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Grenadier', class: 'Ground', subClass: 'Explosives' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Infantry', type: 'Unit', subType: 'Anti-Armor Specialist', class: 'Ground', subClass: 'Heavy Weapons' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Airborne', type: 'Unit', subType: 'Paratrooper', class: 'Airborne', subClass: 'Assault' },
  { family: 'unit', category: 'Ground Forces', subCategory: 'Airborne', type: 'Unit', subType: 'Jump Trooper', class: 'Airborne', subClass: 'Jump Pack' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Heavy Armor', type: 'Unit', subType: 'Tank', class: 'Armor', subClass: 'Heavy' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Heavy Armor', type: 'Unit', subType: 'Heavy Armor', class: 'Armor', subClass: 'Super Heavy' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Heavy Armor', type: 'Unit', subType: 'Walker', class: 'Armor', subClass: 'Heavy Assault' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Heavy Armor', type: 'Unit', subType: 'Artillery', class: 'Armor', subClass: 'Support' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Mechanized', type: 'Unit', subType: 'Mech', class: 'Armor', subClass: 'Assault' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Mechanized', type: 'Unit', subType: 'Support Vehicle', class: 'Support', subClass: 'Repair' },
  { family: 'unit', category: 'Armor Forces', subCategory: 'Mechanized', type: 'Unit', subType: 'Transport', class: 'Support', subClass: 'Logistics' },
  { family: 'unit', category: 'Special Assets', subCategory: 'Robotic', type: 'Unit', subType: 'Drone', class: 'Robotic', subClass: 'Swarm' },
  { family: 'unit', category: 'Special Assets', subCategory: 'Robotic', type: 'Unit', subType: 'Infiltration Droid', class: 'Robotic', subClass: 'Stealth' },
  { family: 'unit', category: 'Special Assets', subCategory: 'Command Support', type: 'Unit', subType: 'Forward Observer', class: 'Recon', subClass: 'Targeting' },
  { family: 'unit', category: 'Special Assets', subCategory: 'Command Support', type: 'Unit', subType: 'Field Medic', class: 'Support', subClass: 'Medical' },
];

const UNTRAINED_UNIT_SEEDS: ArchetypeSeed[] = [
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Conscript', class: 'Infantry', subClass: 'Basic' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Militia', class: 'Infantry', subClass: 'Basic' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Volunteer', class: 'Infantry', subClass: 'Basic' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Reserve', class: 'Infantry', subClass: 'Basic' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Recruit', class: 'Infantry', subClass: 'Basic' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Basic Intake', type: 'Untrained', subType: 'Cadet', class: 'Officer', subClass: 'Training' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Irregular Forces', type: 'Untrained', subType: 'Partisan', class: 'Infantry', subClass: 'Irregular' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Irregular Forces', type: 'Untrained', subType: 'Penal Legion', class: 'Infantry', subClass: 'Expendable' },
  { family: 'untrained-unit', category: 'Recruit Pool', subCategory: 'Irregular Forces', type: 'Untrained', subType: 'Press Gang', class: 'Infantry', subClass: 'Forced Service' },
];

const JOB_SEEDS: ArchetypeSeed[] = [
  { family: 'job', category: 'Workforce', subCategory: 'Resource Jobs', type: 'Job', subType: 'Miner', class: 'Civilian', subClass: 'Extraction' },
  { family: 'job', category: 'Workforce', subCategory: 'Resource Jobs', type: 'Job', subType: 'Farmer', class: 'Civilian', subClass: 'Agriculture' },
  { family: 'job', category: 'Workforce', subCategory: 'Technical Jobs', type: 'Job', subType: 'Engineer', class: 'Specialist', subClass: 'Infrastructure' },
  { family: 'job', category: 'Workforce', subCategory: 'Technical Jobs', type: 'Job', subType: 'Scientist', class: 'Specialist', subClass: 'Research' },
  { family: 'job', category: 'Workforce', subCategory: 'Technical Jobs', type: 'Job', subType: 'Mechanic', class: 'Specialist', subClass: 'Maintenance' },
  { family: 'job', category: 'Workforce', subCategory: 'Government Jobs', type: 'Job', subType: 'Administrator', class: 'Government', subClass: 'Bureaucracy' },
  { family: 'job', category: 'Workforce', subCategory: 'Government Jobs', type: 'Job', subType: 'Diplomat', class: 'Government', subClass: 'Statecraft' },
  { family: 'job', category: 'Workforce', subCategory: 'Military Jobs', type: 'Job', subType: 'Soldier', class: 'Military', subClass: 'Line Infantry' },
  { family: 'job', category: 'Workforce', subCategory: 'Military Jobs', type: 'Job', subType: 'Officer', class: 'Military', subClass: 'Command' },
  { family: 'job', category: 'Workforce', subCategory: 'Station Jobs', type: 'Job', subType: 'Station Quartermaster', class: 'Operations', subClass: 'Supply Control' },
];

const MEGASTRUCTURE_SEEDS: ArchetypeSeed[] = [
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Energy Grid', type: 'Megastructure', subType: 'Dyson Sphere', class: 'Power', subClass: 'Stellar Harvest' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Habitat Ring', type: 'Megastructure', subType: 'Ringworld', class: 'Habitat', subClass: 'Arcology' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Strategic Control', type: 'Megastructure', subType: 'Stellar Engine', class: 'Logistics', subClass: 'Star Mobility' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Strategic Control', type: 'Megastructure', subType: 'Quantum Anchor', class: 'Stability', subClass: 'Navigation Lock' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Defense Matrix', type: 'Megastructure', subType: 'Planetary Shield Grid', class: 'Defense', subClass: 'System Shield' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Defense Matrix', type: 'Megastructure', subType: 'Orbital Lance Array', class: 'Defense', subClass: 'Long-Range Strike' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Resource Core', type: 'Megastructure', subType: 'Matter Compressor', class: 'Industry', subClass: 'Refinement' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Resource Core', type: 'Megastructure', subType: 'Dark Matter Extractor', class: 'Industry', subClass: 'Exotic Harvest' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Research Nexus', type: 'Megastructure', subType: 'Aether Observatory', class: 'Science', subClass: 'Deep Scan' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Research Nexus', type: 'Megastructure', subType: 'Chrono Labyrinth', class: 'Science', subClass: 'Temporal Study' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Civilization Core', type: 'Megastructure', subType: 'Galactic Archive', class: 'Culture', subClass: 'Knowledge Vault' },
  { family: 'megastructure', category: 'Megastructure', subCategory: 'Civilization Core', type: 'Megastructure', subType: 'Unity Beacon', class: 'Culture', subClass: 'Faction Cohesion' },
];

const SPACE_STATION_SEEDS: ArchetypeSeed[] = [
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Trade Station', type: 'SpaceStation', subType: 'Commercial Hub', class: 'Economy', subClass: 'Marketplace' },
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Trade Station', type: 'SpaceStation', subType: 'Freight Relay', class: 'Economy', subClass: 'Cargo Routing' },
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Defense Station', type: 'SpaceStation', subType: 'Defense Platform', class: 'Defense', subClass: 'Point Defense' },
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Defense Station', type: 'SpaceStation', subType: 'Missile Bastion', class: 'Defense', subClass: 'Siege Intercept' },
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Research Station', type: 'SpaceStation', subType: 'Research Outpost', class: 'Science', subClass: 'Experimentation' },
  { family: 'space-station', category: 'Orbital Infrastructure', subCategory: 'Research Station', type: 'SpaceStation', subType: 'Sensor Array Node', class: 'Science', subClass: 'Long-Range Scan' },
];

const STARBASE_SEEDS: ArchetypeSeed[] = [
  { family: 'starbase', category: 'System Defense', subCategory: 'Core Starbase', type: 'Starbase', subType: 'Outpost Starbase', class: 'Defense', subClass: 'Entry Tier' },
  { family: 'starbase', category: 'System Defense', subCategory: 'Core Starbase', type: 'Starbase', subType: 'Fortress Starbase', class: 'Defense', subClass: 'Hardened Core' },
  { family: 'starbase', category: 'System Defense', subCategory: 'Core Starbase', type: 'Starbase', subType: 'Citadel Starbase', class: 'Defense', subClass: 'Command Citadel' },
  { family: 'starbase', category: 'System Defense', subCategory: 'Support Starbase', type: 'Starbase', subType: 'Shipyard Starbase', class: 'Logistics', subClass: 'Fleet Service' },
  { family: 'starbase', category: 'System Defense', subCategory: 'Support Starbase', type: 'Starbase', subType: 'Bastion Starbase', class: 'Defense', subClass: 'Border Shield' },
];

const MOONBASE_SEEDS: ArchetypeSeed[] = [
  { family: 'moonbase', category: 'Lunar Operations', subCategory: 'Core Moonbase', type: 'Moonbase', subType: 'Lunar Base', class: 'Operations', subClass: 'Core Hub' },
  { family: 'moonbase', category: 'Lunar Operations', subCategory: 'Core Moonbase', type: 'Moonbase', subType: 'Mining Moonbase', class: 'Industry', subClass: 'Lunar Extraction' },
  { family: 'moonbase', category: 'Lunar Operations', subCategory: 'Core Moonbase', type: 'Moonbase', subType: 'Research Moonbase', class: 'Science', subClass: 'Lunar Lab' },
  { family: 'moonbase', category: 'Lunar Operations', subCategory: 'Defense Moonbase', type: 'Moonbase', subType: 'Sensor Phalanx Base', class: 'Defense', subClass: 'Detection Grid' },
  { family: 'moonbase', category: 'Lunar Operations', subCategory: 'Defense Moonbase', type: 'Moonbase', subType: 'Jump Gate Base', class: 'Logistics', subClass: 'Rapid Transit' },
];

export const ENTITY_ARCHETYPES_90: EntityArchetype[] = [
  ...createArchetypes('starship', 1, STARSHIP_SEEDS),
  ...createArchetypes('mothership', 1, MOTHERSHIP_SEEDS),
  ...createArchetypes('unit', 1, UNIT_SEEDS),
  ...createArchetypes('untrained-unit', 1, UNTRAINED_UNIT_SEEDS),
  ...createArchetypes('job', 1, JOB_SEEDS),
  ...createArchetypes('megastructure', 1, MEGASTRUCTURE_SEEDS),
  ...createArchetypes('space-station', 1, SPACE_STATION_SEEDS),
  ...createArchetypes('starbase', 1, STARBASE_SEEDS),
  ...createArchetypes('moonbase', 1, MOONBASE_SEEDS),
];

export const ENTITY_ARCHETYPES_GROUPED = ENTITY_ARCHETYPES_90.reduce<Record<string, EntityArchetype[]>>((acc, entity) => {
  if (!acc[entity.type]) {
    acc[entity.type] = [];
  }
  acc[entity.type].push(entity);
  return acc;
}, {});

export const ENTITY_ARCHETYPES_BY_CATEGORY = ENTITY_ARCHETYPES_90.reduce<Record<string, EntityArchetype[]>>((acc, entity) => {
  if (!acc[entity.category]) {
    acc[entity.category] = [];
  }
  acc[entity.category].push(entity);
  return acc;
}, {});

export const ENTITY_ARCHETYPES_META = {
  total: ENTITY_ARCHETYPES_90.length,
  families: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.family))),
  categories: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.category))),
  subCategories: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.subCategory))),
  types: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.type))),
  subTypes: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.subType))),
  classes: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.class))),
  subClasses: Array.from(new Set(ENTITY_ARCHETYPES_90.map(entity => entity.subClass))),
  countsByFamily: ENTITY_ARCHETYPES_90.reduce<Record<ArchetypeFamily, number>>(
    (acc, entity) => {
      acc[entity.family] += 1;
      return acc;
    },
    {
      'starship': 0,
      'mothership': 0,
      'unit': 0,
      'untrained-unit': 0,
      'job': 0,
      'megastructure': 0,
      'space-station': 0,
      'starbase': 0,
      'moonbase': 0,
    }
  ),
};
