
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

// ─── Starship Generation ──────────────────────────────────────────────────────

interface ShipClassTemplate {
  class: string;
  subClasses: string[];
  categories: string[];
  subCategories: string[];
}

const STARSHIP_CLASS_TEMPLATES: ShipClassTemplate[] = [
  {
    class: 'Fighter',
    subClasses: ['Light Attack', 'Heavy Attack', 'Electronic Warfare', 'Stealth', 'Torpedo', 'Interceptor', 'Bomber', 'Assault', 'Deep Strike', 'Plasma'],
    categories: ['Fleet', 'Strike Force'],
    subCategories: ['Assault Wing', 'Strike Wing', 'Intercept Wing', 'Stealth Wing', 'Electronic Wing'],
  },
  {
    class: 'Corvette',
    subClasses: ['Anti-Fighter', 'Fast Attack', 'Patrol', 'Stealth Escort', 'Torpedo', 'Screen', 'Recon', 'Assault', 'Electronic', 'Defense'],
    categories: ['Fleet', 'Rapid Response'],
    subCategories: ['Escort Wing', 'Patrol Wing', 'Scout Wing', 'Rapid Wing', 'Defense Wing'],
  },
  {
    class: 'Frigate',
    subClasses: ['Convoy Screen', 'Assault Escort', 'Ordnance', 'EMP', 'Missile', 'Anti-Armor', 'Defense', 'Command', 'Electronic', 'Support'],
    categories: ['Fleet', 'Escort Group'],
    subCategories: ['Escort Wing', 'Fire Support Wing', 'Defense Wing', 'Command Wing', 'Assault Wing'],
  },
  {
    class: 'Destroyer',
    subClasses: ['Heavy Assault', 'Anti-Capital', 'Fleet Hunter', 'Siege', 'Anti-Missile', 'Torpedo', 'Electronic', 'Command', 'Defense', 'Assault'],
    categories: ['Fleet', 'Assault Division'],
    subCategories: ['Capital Wing', 'Anti-Capital Wing', 'Siege Wing', 'Defense Wing', 'Command Wing'],
  },
  {
    class: 'Cruiser',
    subClasses: ['Heavy Assault', 'Command', 'Electronic', 'Siege', 'Anti-Capital', 'Fleet Support', 'Defense', 'Strike', 'Science', 'Recon'],
    categories: ['Fleet', 'Capital Group'],
    subCategories: ['Capital Wing', 'Command Wing', 'Support Wing', 'Assault Wing', 'Electronic Wing'],
  },
  {
    class: 'Battleship',
    subClasses: ['Line Battleship', 'Fleet Command', 'Heavy Strike', 'Anti-Capital', 'Defense', 'Siege', 'Electronic', 'Assault', 'Command', 'Titan Hunter'],
    categories: ['Fleet', 'Capital Fleet'],
    subCategories: ['Capital Wing', 'Command Wing', 'Siege Wing', 'Assault Wing', 'Defense Wing'],
  },
  {
    class: 'Carrier',
    subClasses: ['Strike Support', 'Rapid Support', 'Defense', 'Command', 'Electronic', 'Assault', 'Fleet', 'Heavy', 'Light', 'Science'],
    categories: ['Fleet', 'Carrier Group'],
    subCategories: ['Capital Wing', 'Carrier Wing', 'Strike Wing', 'Support Wing', 'Command Wing'],
  },
  {
    class: 'Support',
    subClasses: ['Research', 'Medical', 'Repair', 'Electronic', 'Logistics', 'Science', 'Mining', 'Colony', 'Command', 'Recon'],
    categories: ['Fleet', 'Support Group'],
    subCategories: ['Special Operations', 'Recon Wing', 'Support Wing', 'Science Wing', 'Logistics Wing'],
  },
];

const FIGHTER_SUBTYPES_50 = [
  'Interceptor', 'Bomber', 'Gunboat', 'EMP', 'Plasma', 'Ion', 'Stealth', 'Assault', 'Anti-Armor', 'Heavy Bomber',
  'Scout', 'Torpedo', 'Meson', 'Pulse', 'Quantum', 'Dark Matter', 'Phasor', 'Laser', 'Railgun', 'Shielded',
  'Strike', 'Attack', 'Defense', 'Electronic', 'Rapid', 'Command', 'Patrol', 'Vanguard', 'Shadow', 'Phoenix',
  'Nova', 'Storm', 'Void', 'Titan', 'Elite', 'Vector', 'Blade', 'Arrow', 'Phantom', 'Predator',
  'Valor', 'Tempest', 'Eclipse', 'Spectre', 'Apex', 'Fury', 'Aegis', 'Chimera', 'Harbinger', 'Sovereign',
];

const CORVETTE_SUBTYPES_50 = [
  'Patrol', 'Scout', 'Fast Attack', 'Recon', 'Escort', 'Light Patrol', 'Stealth', 'Torpedo', 'EMP', 'Screen',
  'Shadow', 'Hunter', 'Quick Strike', 'Vigilant', 'Sentinel', 'Watchman', 'Ranger', 'Tracker', 'Seeker', 'Skimmer',
  'Ghost', 'Raider', 'Drifter', 'Rover', 'Stalker', 'Prowler', 'Dagger', 'Saber', 'Rapier', 'Dart',
  'Arrow', 'Blade', 'Needle', 'Spear', 'Lance', 'Pike', 'Javelin', 'Bolt', 'Flash', 'Spark',
  'Comet', 'Meteor', 'Streak', 'Pulse', 'Surge', 'Swift', 'Rapid', 'Nimble', 'Agile', 'Keen',
];

const FRIGATE_SUBTYPES_50 = [
  'Missile', 'Assault', 'Defense', 'Command', 'Electronic', 'EMP', 'Torpedo', 'Anti-Armor', 'Fleet Screen', 'Fire Support',
  'Battle', 'War', 'Combat', 'Strike', 'Attack', 'Guard', 'Shield', 'Escort', 'Support', 'Scout',
  'Armored', 'Heavy', 'Light', 'Fast', 'Stealth', 'Recon', 'Vanguard', 'Frontline', 'Rearguard', 'Flanker',
  'Iron', 'Steel', 'Adamant', 'Valiant', 'Stalwart', 'Steadfast', 'Resolute', 'Unyielding', 'Tenacious', 'Fierce',
  'Storm', 'Thunder', 'Lightning', 'Cyclone', 'Tempest', 'Gale', 'Blizzard', 'Inferno', 'Tsunami', 'Quake',
];

const DESTROYER_SUBTYPES_50 = [
  'Heavy', 'Fleet Hunter', 'Anti-Capital', 'Siege', 'Assault', 'Command', 'Electronic', 'Torpedo', 'Defense', 'Strike',
  'Warhound', 'Warmaster', 'Warbringer', 'Warlord', 'Warchief', 'Warmonger', 'Warden', 'Warband', 'Warrior', 'Warpath',
  'Reckoning', 'Vengeance', 'Retribution', 'Judgment', 'Devastation', 'Annihilation', 'Obliteration', 'Extinction', 'Doom', 'Havoc',
  'Eclipse', 'Void', 'Abyss', 'Oblivion', 'Apocalypse', 'Armageddon', 'Nemesis', 'Challenger', 'Punisher', 'Enforcer',
  'Executioner', 'Avenger', 'Crusader', 'Templar', 'Paladin', 'Inquisitor', 'Arbiter', 'Sentinel', 'Guardian', 'Protector',
];

const CRUISER_SUBTYPES_50 = [
  'Heavy Assault', 'Command', 'Electronic', 'Siege', 'Strike', 'Fleet Support', 'Defense', 'Recon', 'Science', 'Anti-Capital',
  'Battlecruiser', 'War Cruiser', 'Star Cruiser', 'Fleet Cruiser', 'Line Cruiser', 'Combat Cruiser', 'Assault Cruiser', 'Guard Cruiser', 'Fire Cruiser', 'Storm Cruiser',
  'Imperial', 'Royal', 'Grand', 'Supreme', 'Elite', 'Master', 'Champion', 'Legendary', 'Mythic', 'Ancient',
  'Iron Throne', 'Steel Fist', 'Golden Eagle', 'Silver Lance', 'Bronze Shield', 'Iron Will', 'Stone Wall', 'Crimson Tide', 'Black Spear', 'White Star',
  'Nebula', 'Pulsar', 'Quasar', 'Magnetar', 'Supernova', 'Binary', 'Neutron', 'Stellar', 'Galactic', 'Cosmic',
];

const BATTLESHIP_SUBTYPES_50 = [
  'Line', 'Fleet Command', 'Heavy Strike', 'Anti-Capital', 'Defense', 'Siege', 'Electronic', 'Assault', 'Command', 'Titan Hunter',
  'Dreadnought', 'Super Dreadnought', 'Ultra Dreadnought', 'Mega Dreadnought', 'Hyper Dreadnought', 'Neo Dreadnought', 'Arch Dreadnought', 'Prime Dreadnought', 'Alpha Dreadnought', 'Omega Dreadnought',
  'Leviathan', 'Colossus', 'Behemoth', 'Goliath', 'Juggernaut', 'Monolith', 'Titan', 'Giant', 'Titan Guard', 'Titan Bane',
  'Warlord', 'Warchief', 'Overlord', 'High Lord', 'Grand Lord', 'Supreme Lord', 'Arch Lord', 'Proto Lord', 'Neo Lord', 'Void Lord',
  'Solar', 'Astral', 'Celestial', 'Eternal', 'Divine', 'Sacred', 'Holy', 'Blessed', 'Hallowed', 'Sanctified',
];

const CARRIER_SUBTYPES_50 = [
  'Strike Support', 'Rapid Support', 'Defense', 'Command', 'Electronic', 'Assault', 'Fleet', 'Heavy', 'Light', 'Science',
  'Super Carrier', 'Ultra Carrier', 'Mega Carrier', 'Hyper Carrier', 'Neo Carrier', 'Arch Carrier', 'Prime Carrier', 'Alpha Carrier', 'Omega Carrier', 'Fleet Carrier',
  'Assault Carrier', 'Battle Carrier', 'War Carrier', 'Combat Carrier', 'Strike Carrier', 'Attack Carrier', 'Guard Carrier', 'Shield Carrier', 'Defense Carrier', 'Command Carrier',
  'Nova Carrier', 'Star Carrier', 'Stellar Carrier', 'Galactic Carrier', 'Cosmic Carrier', 'Nebula Carrier', 'Pulsar Carrier', 'Quasar Carrier', 'Binary Carrier', 'Solar Carrier',
  'Phoenix Carrier', 'Eagle Carrier', 'Falcon Carrier', 'Hawk Carrier', 'Condor Carrier', 'Albatross Carrier', 'Raven Carrier', 'Osprey Carrier', 'Harrier Carrier', 'Kestrel Carrier',
];

const SUPPORT_SUBTYPES_50 = [
  'Science Vessel', 'Scout', 'Survey Ship', 'Repair Ship', 'Medical Ship', 'Supply Ship', 'Tanker', 'Transport', 'Colony Shuttle', 'Engineering Ship',
  'Research Vessel', 'Explorer', 'Surveyor', 'Probe Tender', 'Lab Ship', 'Hospital Ship', 'Freighter', 'Hauler', 'Bulk Carrier', 'Container Ship',
  'Reconnaissance Vessel', 'Intelligence Ship', 'Signal Ship', 'ECM Ship', 'EW Vessel', 'Decoy Ship', 'Minelayer', 'Minesweeper', 'Repair Tender', 'Salvage Ship',
  'Stellar Cartographer', 'Astro Lab', 'Bio Lab', 'Chem Lab', 'Physics Lab', 'Tech Lab', 'Command Relay', 'Fleet Tender', 'Drone Carrier', 'Beacon Ship',
  'Advance Scout', 'Deep Scout', 'Far Scout', 'Void Scout', 'Shadow Scout', 'Stealth Scout', 'Ghost Scout', 'Recon Scout', 'Probe Scout', 'Survey Scout',
];

const ALL_STARSHIP_SUBTYPES: string[][] = [
  FIGHTER_SUBTYPES_50,
  CORVETTE_SUBTYPES_50,
  FRIGATE_SUBTYPES_50,
  DESTROYER_SUBTYPES_50,
  CRUISER_SUBTYPES_50,
  BATTLESHIP_SUBTYPES_50,
  CARRIER_SUBTYPES_50,
  SUPPORT_SUBTYPES_50,
];

function generateStarshipSeeds(): ArchetypeSeed[] {
  const seeds: ArchetypeSeed[] = [];
  STARSHIP_CLASS_TEMPLATES.forEach((template, classIdx) => {
    const subtypes = ALL_STARSHIP_SUBTYPES[classIdx];
    subtypes.forEach((subType, i) => {
      const catIdx      = i % template.categories.length;
      const subCatIdx   = i % template.subCategories.length;
      const subClassIdx = i % template.subClasses.length;
      seeds.push({
        family: 'starship',
        category: template.categories[catIdx],
        subCategory: template.subCategories[subCatIdx],
        type: 'Starship',
        subType,
        class: template.class,
        subClass: template.subClasses[subClassIdx],
      });
    });
  });
  // STARSHIP_CLASS_TEMPLATES.length (8) × ALL_STARSHIP_SUBTYPES[i].length (50 each) = 400 total
  return seeds;
}

// ─── Mothership Generation ─────────────────────────────────────────────────────

interface MothershipTypeTemplate {
  type: string;
  category: string;
  subCategory: string;
  class: string;
  subClasses: string[];
}

const MOTHERSHIP_TYPE_TEMPLATES: MothershipTypeTemplate[] = [
  {
    type: 'Command Mothership',
    category: 'Command Core',
    subCategory: 'Fleet Backbone',
    class: 'Support',
    subClasses: ['Fleet Command', 'Strategic C2', 'Tactical Operations', 'Battle Management', 'Command & Control', 'Operations Center', 'War Bridge', 'High Command', 'Grand Command', 'Supreme Command'],
  },
  {
    type: 'Industrial Mothership',
    category: 'Industrial Core',
    subCategory: 'Production Yard',
    class: 'Industrial',
    subClasses: ['Production', 'Manufacturing', 'Assembly', 'Fabrication', 'Forge', 'Factory', 'Workshop', 'Shipyard', 'Drydock', 'Construction'],
  },
  {
    type: 'Medical Mothership',
    category: 'Support Core',
    subCategory: 'Medical & Recovery',
    class: 'Support',
    subClasses: ['Medical', 'Trauma Center', 'Surgery Bay', 'Recovery', 'Rehabilitation', 'Emergency Care', 'Field Medicine', 'Bio Lab', 'Pharmaceutical', 'Triage'],
  },
  {
    type: 'Colony Mothership',
    category: 'Colonial Core',
    subCategory: 'Settlement Operations',
    class: 'Civilian',
    subClasses: ['Colonization', 'Settlement', 'Terraforming', 'Agricultural', 'Population Transport', 'Habitat', 'Biosphere', 'Ecosystem', 'Life Support', 'Cultural'],
  },
  {
    type: 'Mining Mothership',
    category: 'Industrial Core',
    subCategory: 'Resource Extraction',
    class: 'Civilian',
    subClasses: ['Mining', 'Extraction', 'Drilling', 'Processing', 'Refinery', 'Survey', 'Harvest', 'Collection', 'Smelting', 'Ore Processing'],
  },
  {
    type: 'Fortress Mothership',
    category: 'Siege Core',
    subCategory: 'Heavy Projection',
    class: 'Capital',
    subClasses: ['Defense', 'Planetary Siege', 'Mobile Fortress', 'Assault Platform', 'Bombardment', 'Battle Station', 'War Platform', 'Super Fortress', 'Grand Fortress', 'Titan Fortress'],
  },
  {
    type: 'Science Mothership',
    category: 'Research Core',
    subCategory: 'Scientific Operations',
    class: 'Support',
    subClasses: ['Research', 'Exploration', 'Survey', 'Analysis', 'Experimentation', 'Data Collection', 'Stellar Study', 'Xenobiology', 'Physics Lab', 'Engineering Lab'],
  },
  {
    type: 'Logistics Mothership',
    category: 'Logistics Core',
    subCategory: 'Supply & Sustainment',
    class: 'Support',
    subClasses: ['Supply', 'Resupply', 'Fuel Depot', 'Ammunition', 'Repair Tender', 'Fleet Support', 'Cargo', 'Transport', 'Bulk Logistics', 'Strategic Lift'],
  },
];

const COMMAND_MS_SUBTYPES_50 = [
  'Command Ship', 'Flag Command', 'Battle Command', 'War Command', 'Strike Command', 'Grand Command', 'Supreme Command', 'Arch Command', 'Prime Command', 'Elite Command',
  'Alpha Command', 'Beta Command', 'Gamma Command', 'Delta Command', 'Epsilon Command', 'Omega Command', 'Sigma Command', 'Apex Command', 'Ultra Command', 'Neo Command',
  'Stellar Command', 'Galactic Command', 'Cosmic Command', 'Astral Command', 'Celestial Command', 'Divine Command', 'Sacred Command', 'Eternal Command', 'Ancient Command', 'Mythic Command',
  'Iron Command', 'Steel Command', 'Titanium Command', 'Adamantine Command', 'Obsidian Command', 'Crystal Command', 'Void Command', 'Dark Command', 'Light Command', 'Shadow Command',
  'Imperial Command', 'Royal Command', 'Noble Command', 'Sovereign Command', 'Regent Command', 'Emperor Command', 'Kaiser Command', 'Tsar Command', 'Sultan Command', 'Khan Command',
];

const INDUSTRIAL_MS_SUBTYPES_50 = [
  'Factory Ship', 'Production Vessel', 'Fabrication Ship', 'Assembly Platform', 'Forge Ship', 'Workshop Vessel', 'Manufacturing Hub', 'Build Platform', 'Construct Ship', 'Creation Vessel',
  'Mk I Factory', 'Mk II Factory', 'Mk III Factory', 'Mk IV Factory', 'Mk V Factory', 'Advanced Factory', 'Elite Factory', 'Supreme Factory', 'Arch Factory', 'Prime Factory',
  'Light Industry', 'Medium Industry', 'Heavy Industry', 'Ultra Industry', 'Mega Industry', 'Super Industry', 'Hyper Industry', 'Neo Industry', 'Pro Industry', 'Max Industry',
  'Alpha Forge', 'Beta Forge', 'Gamma Forge', 'Delta Forge', 'Epsilon Forge', 'Omega Forge', 'Sigma Forge', 'Apex Forge', 'Prime Forge', 'Grand Forge',
  'Orbital Factory', 'Deep Space Factory', 'Void Factory', 'Stellar Factory', 'Galactic Factory', 'Solar Factory', 'Nebula Factory', 'Pulsar Factory', 'Quasar Factory', 'Nova Factory',
];

const MEDICAL_MS_SUBTYPES_50 = [
  'Hospital Ship', 'Medical Cruiser', 'Trauma Vessel', 'Surgery Platform', 'Recovery Ship', 'Emergency Ship', 'Triage Vessel', 'Field Hospital', 'Medevac Ship', 'Bio Vessel',
  'Mk I Hospital', 'Mk II Hospital', 'Mk III Hospital', 'Mk IV Hospital', 'Mk V Hospital', 'Advanced Hospital', 'Elite Hospital', 'Supreme Hospital', 'Grand Hospital', 'Prime Hospital',
  'Critical Care', 'Intensive Care', 'Surgical Care', 'Trauma Care', 'Emergency Care', 'Acute Care', 'Primary Care', 'Advanced Care', 'Specialized Care', 'Total Care',
  'Alpha Medic', 'Beta Medic', 'Gamma Medic', 'Delta Medic', 'Epsilon Medic', 'Omega Medic', 'Sigma Medic', 'Apex Medic', 'Prime Medic', 'Grand Medic',
  'Stellar Medic', 'Galactic Medic', 'Cosmic Medic', 'Void Medic', 'Solar Medic', 'Nebula Medic', 'Deep Space Medic', 'Far Field Medic', 'Mobile Medic', 'Rapid Medic',
];

const COLONY_MS_SUBTYPES_50 = [
  'Colony Ship', 'Settlement Vessel', 'Terraforming Ship', 'Population Carrier', 'Habitat Ship', 'Pioneer Vessel', 'Founders Ship', 'Vanguard Colony', 'Advance Colony', 'Scout Colony',
  'Mk I Colony', 'Mk II Colony', 'Mk III Colony', 'Mk IV Colony', 'Mk V Colony', 'Advanced Colony', 'Elite Colony', 'Supreme Colony', 'Grand Colony', 'Prime Colony',
  'Alpha Settler', 'Beta Settler', 'Gamma Settler', 'Delta Settler', 'Epsilon Settler', 'Omega Settler', 'Sigma Settler', 'Apex Settler', 'Prime Settler', 'Grand Settler',
  'New World', 'Fresh Start', 'Dawn Colony', 'Hope Colony', 'Future Colony', 'Dream Colony', 'Vision Colony', 'Promise Colony', 'Destiny Colony', 'Frontier Colony',
  'Stellar Colony', 'Galactic Colony', 'Cosmic Colony', 'Solar Colony', 'Void Colony', 'Nebula Colony', 'Deep Space Colony', 'Far Reach Colony', 'Outer Colony', 'Rim Colony',
];

const MINING_MS_SUBTYPES_50 = [
  'Resource Harvester', 'Ore Processor', 'Drill Ship', 'Mining Platform', 'Extraction Vessel', 'Survey Miner', 'Heavy Miner', 'Deep Miner', 'Core Miner', 'Asteroid Miner',
  'Mk I Miner', 'Mk II Miner', 'Mk III Miner', 'Mk IV Miner', 'Mk V Miner', 'Advanced Miner', 'Elite Miner', 'Supreme Miner', 'Grand Miner', 'Prime Miner',
  'Alpha Extractor', 'Beta Extractor', 'Gamma Extractor', 'Delta Extractor', 'Epsilon Extractor', 'Omega Extractor', 'Sigma Extractor', 'Apex Extractor', 'Prime Extractor', 'Grand Extractor',
  'Crystal Harvester', 'Metal Harvester', 'Gas Harvester', 'Dark Matter Harvester', 'Energy Harvester', 'Rare Earth Harvester', 'Exotic Harvester', 'Quantum Harvester', 'Void Harvester', 'Stellar Harvester',
  'Stellar Miner', 'Galactic Miner', 'Cosmic Miner', 'Solar Miner', 'Void Miner', 'Nebula Miner', 'Deep Space Miner', 'Far Reach Miner', 'Outer Miner', 'Rim Miner',
];

const FORTRESS_MS_SUBTYPES_50 = [
  'Mobile Fortress', 'Siege Ship', 'Battle Station', 'War Platform', 'Assault Platform', 'Bombardment Ship', 'Planetary Siege', 'Orbital Fortress', 'Death Bringer', 'Titan Fortress',
  'Mk I Fortress', 'Mk II Fortress', 'Mk III Fortress', 'Mk IV Fortress', 'Mk V Fortress', 'Advanced Fortress', 'Elite Fortress', 'Supreme Fortress', 'Grand Fortress', 'Prime Fortress',
  'Alpha Bastion', 'Beta Bastion', 'Gamma Bastion', 'Delta Bastion', 'Epsilon Bastion', 'Omega Bastion', 'Sigma Bastion', 'Apex Bastion', 'Prime Bastion', 'Grand Bastion',
  'Iron Fortress', 'Steel Fortress', 'Titanium Fortress', 'Adamantine Fortress', 'Obsidian Fortress', 'Crystal Fortress', 'Void Fortress', 'Dark Fortress', 'Light Fortress', 'Shadow Fortress',
  'Stellar Fortress', 'Galactic Fortress', 'Cosmic Fortress', 'Astral Fortress', 'Celestial Fortress', 'Divine Fortress', 'Sacred Fortress', 'Eternal Fortress', 'Ancient Fortress', 'Mythic Fortress',
];

const SCIENCE_MS_SUBTYPES_50 = [
  'Science Ship', 'Research Vessel', 'Explorer Ship', 'Survey Vessel', 'Lab Ship', 'Study Platform', 'Analysis Ship', 'Data Vessel', 'Probe Tender', 'Experiment Ship',
  'Mk I Science', 'Mk II Science', 'Mk III Science', 'Mk IV Science', 'Mk V Science', 'Advanced Science', 'Elite Science', 'Supreme Science', 'Grand Science', 'Prime Science',
  'Alpha Research', 'Beta Research', 'Gamma Research', 'Delta Research', 'Epsilon Research', 'Omega Research', 'Sigma Research', 'Apex Research', 'Prime Research', 'Grand Research',
  'Stellar Observatory', 'Galactic Observatory', 'Cosmic Observatory', 'Solar Observatory', 'Void Observatory', 'Nebula Observatory', 'Deep Space Observatory', 'Far Reach Observatory', 'Astrometry Platform', 'Cartography Vessel',
  'Bio Science', 'Chem Science', 'Physics Science', 'Tech Science', 'Nano Science', 'Quantum Science', 'Dark Science', 'Light Science', 'Energy Science', 'Matter Science',
];

const LOGISTICS_MS_SUBTYPES_50 = [
  'Supply Ship', 'Resupply Vessel', 'Fuel Tanker', 'Ammunition Ship', 'Repair Tender', 'Fleet Tender', 'Cargo Ship', 'Transport Vessel', 'Bulk Carrier', 'Logistics Ship',
  'Mk I Supply', 'Mk II Supply', 'Mk III Supply', 'Mk IV Supply', 'Mk V Supply', 'Advanced Supply', 'Elite Supply', 'Supreme Supply', 'Grand Supply', 'Prime Supply',
  'Alpha Transport', 'Beta Transport', 'Gamma Transport', 'Delta Transport', 'Epsilon Transport', 'Omega Transport', 'Sigma Transport', 'Apex Transport', 'Prime Transport', 'Grand Transport',
  'Heavy Logistics', 'Medium Logistics', 'Light Logistics', 'Ultra Logistics', 'Mega Logistics', 'Super Logistics', 'Hyper Logistics', 'Neo Logistics', 'Pro Logistics', 'Max Logistics',
  'Stellar Logistics', 'Galactic Logistics', 'Cosmic Logistics', 'Solar Logistics', 'Void Logistics', 'Nebula Logistics', 'Deep Space Logistics', 'Far Reach Logistics', 'Outer Logistics', 'Rim Logistics',
];

const ALL_MOTHERSHIP_SUBTYPES: string[][] = [
  COMMAND_MS_SUBTYPES_50,
  INDUSTRIAL_MS_SUBTYPES_50,
  MEDICAL_MS_SUBTYPES_50,
  COLONY_MS_SUBTYPES_50,
  MINING_MS_SUBTYPES_50,
  FORTRESS_MS_SUBTYPES_50,
  SCIENCE_MS_SUBTYPES_50,
  LOGISTICS_MS_SUBTYPES_50,
];

function generateMothershipSeeds(): ArchetypeSeed[] {
  const seeds: ArchetypeSeed[] = [];
  MOTHERSHIP_TYPE_TEMPLATES.forEach((template, typeIdx) => {
    const subtypes = ALL_MOTHERSHIP_SUBTYPES[typeIdx];
    subtypes.forEach((subType, i) => {
      const subClassIdx = i % template.subClasses.length;
      seeds.push({
        family: 'mothership',
        category: template.category,
        subCategory: template.subCategory,
        type: template.type,
        subType,
        class: template.class,
        subClass: template.subClasses[subClassIdx],
      });
    });
  });
  // MOTHERSHIP_TYPE_TEMPLATES.length (8) × ALL_MOTHERSHIP_SUBTYPES[i].length (50 each) = 400 total
  return seeds;
}

// ─── Seed Arrays ──────────────────────────────────────────────────────────────

const STARSHIP_SEEDS: ArchetypeSeed[] = generateStarshipSeeds();    // 400 entries
const MOTHERSHIP_SEEDS: ArchetypeSeed[] = generateMothershipSeeds(); // 400 entries

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
