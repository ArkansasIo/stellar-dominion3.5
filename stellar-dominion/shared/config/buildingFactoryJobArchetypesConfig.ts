export interface BuildingArchetype {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
}

export interface FactoryJobArchetype {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  jobCategory: string;
  subJobCategory: string;
}

type BuildingSeedFamily = {
  category: string;
  subCategory: string;
  type: string;
  class: string;
  subClass: string;
  subTypes: string[];
};

type FactoryJobSeedFamily = {
  category: string;
  subCategory: string;
  type: string;
  class: string;
  subClass: string;
  jobCategory: string;
  subJobCategory: string;
  subTypes: string[];
};

const BUILDING_SEED_FAMILIES: BuildingSeedFamily[] = [
  {
    category: 'Resource Infrastructure',
    subCategory: 'Extraction Sector',
    type: 'Building',
    class: 'Resource',
    subClass: 'Extraction',
    subTypes: ['Metal Mine', 'Crystal Mine', 'Deuterium Synthesizer', 'Gas Harvester', 'Ice Extractor', 'Ore Refinery', 'Plasma Extractor', 'Rare Earth Drill', 'Dark Matter Tap', 'Salvage Processor'],
  },
  {
    category: 'Energy Infrastructure',
    subCategory: 'Power Grid',
    type: 'Building',
    class: 'Energy',
    subClass: 'Generation',
    subTypes: ['Solar Plant', 'Fusion Reactor', 'Antimatter Core', 'Geothermal Station', 'Orbital Solar Relay', 'Hydrogen Cell Farm', 'Quantum Battery Bank', 'Photon Converter', 'Stellar Collector', 'Zero Point Plant'],
  },
  {
    category: 'Production Infrastructure',
    subCategory: 'Manufacturing Sector',
    type: 'Building',
    class: 'Industrial',
    subClass: 'Fabrication',
    subTypes: ['Robotics Factory', 'Shipyard', 'Nanite Factory', 'Drone Foundry', 'Armor Plant', 'Weapons Forge', 'Ammunition Foundry', 'Vehicle Assembly', 'Component Factory', 'Tool Forge'],
  },
  {
    category: 'Research Infrastructure',
    subCategory: 'Science Sector',
    type: 'Building',
    class: 'Research',
    subClass: 'Development',
    subTypes: ['Research Lab', 'Mega Research Lab', 'AI Analytics Hub', 'Quantum Lab', 'Xeno Biology Lab', 'Materials Lab', 'Propulsion Lab', 'Signal Lab', 'Weapon Test Chamber', 'Simulation Core'],
  },
  {
    category: 'Storage Infrastructure',
    subCategory: 'Stockpile Sector',
    type: 'Building',
    class: 'Logistics',
    subClass: 'Storage',
    subTypes: ['Metal Storage', 'Crystal Storage', 'Deuterium Tank', 'Food Vault', 'Ammunition Depot', 'Cold Storage', 'Archive Vault', 'Data Warehouse', 'Fuel Reserve', 'Secure Cache'],
  },
  {
    category: 'Defense Infrastructure',
    subCategory: 'Fortification Sector',
    type: 'Building',
    class: 'Defense',
    subClass: 'Fortification',
    subTypes: ['Shield Generator', 'Missile Silo', 'Defense Turret Grid', 'Bunker Complex', 'Point Defense Node', 'Orbital Cannon Control', 'Anti Air Net', 'Counter Battery Hub', 'Security Barracks', 'Command Bastion'],
  },
  {
    category: 'Civil Infrastructure',
    subCategory: 'Population Sector',
    type: 'Building',
    class: 'Civilian',
    subClass: 'Population',
    subTypes: ['Habitat Complex', 'Medical Center', 'Education Hub', 'Civil Administration', 'Trade Center', 'Transit Hub', 'Cultural Forum', 'Law Complex', 'Worker Quarters', 'Diplomatic Embassy'],
  },
  {
    category: 'Orbital Infrastructure',
    subCategory: 'Space Sector',
    type: 'Building',
    class: 'Orbital',
    subClass: 'Space Operations',
    subTypes: ['Orbital Dock', 'Station Anchor', 'Sensor Array', 'Jump Relay', 'Cargo Ring', 'Repair Dock', 'Fleet Beacon', 'Traffic Control Node', 'Orbital Habitat', 'Customs Port'],
  },
  {
    category: 'Strategic Infrastructure',
    subCategory: 'Empire Core',
    type: 'Building',
    class: 'Strategic',
    subClass: 'Command',
    subTypes: ['Planetary Capital', 'Grand Archive', 'War Council Chamber', 'Intel Nexus', 'Policy Engine', 'Treaty Hall', 'Supreme Court', 'Empire Treasury', 'Strategic Simulator', 'Victory Monument'],
  },
];

const FACTORY_JOB_SEED_FAMILIES: FactoryJobSeedFamily[] = [
  {
    category: 'Factory Workforce',
    subCategory: 'Extraction Operations',
    type: 'FactoryJob',
    class: 'Operations',
    subClass: 'Extraction',
    jobCategory: 'Resource Jobs',
    subJobCategory: 'Mining Crew',
    subTypes: ['Ore Cutter', 'Crystal Extractor', 'Fuel Pump Operator', 'Core Drill Tech', 'Excavation Supervisor', 'Pit Surveyor', 'Refinery Loader', 'Conveyor Specialist', 'Blast Planner', 'Recovery Handler'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Assembly Operations',
    type: 'FactoryJob',
    class: 'Operations',
    subClass: 'Assembly',
    jobCategory: 'Manufacturing Jobs',
    subJobCategory: 'Assembly Crew',
    subTypes: ['Hull Assembler', 'Chassis Welder', 'Module Installer', 'Line Calibrator', 'Precision Fitter', 'Fabrication Operator', 'Tool Setter', 'Batch Controller', 'Output Inspector', 'Packaging Specialist'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Engineering Operations',
    type: 'FactoryJob',
    class: 'Engineering',
    subClass: 'Maintenance',
    jobCategory: 'Technical Jobs',
    subJobCategory: 'Engineering Crew',
    subTypes: ['Systems Engineer', 'Power Engineer', 'Maintenance Mechanic', 'Control Technician', 'Robotics Mechanic', 'Nanite Tech', 'Calibration Engineer', 'Hydraulics Specialist', 'Automation Engineer', 'Thermal Engineer'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Research Operations',
    type: 'FactoryJob',
    class: 'Research',
    subClass: 'Innovation',
    jobCategory: 'Science Jobs',
    subJobCategory: 'Lab Crew',
    subTypes: ['Process Researcher', 'Materials Scientist', 'AI Analyst', 'Optimization Scientist', 'Quantum Researcher', 'Prototype Architect', 'Test Engineer', 'Data Research Lead', 'R&D Coordinator', 'Simulation Specialist'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Logistics Operations',
    type: 'FactoryJob',
    class: 'Logistics',
    subClass: 'Supply Chain',
    jobCategory: 'Supply Jobs',
    subJobCategory: 'Logistics Crew',
    subTypes: ['Inventory Clerk', 'Supply Dispatcher', 'Freight Planner', 'Warehouse Controller', 'Dock Scheduler', 'Route Optimizer', 'Asset Tracker', 'Customs Liaison', 'Cargo Marshal', 'Reserve Coordinator'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Quality Operations',
    type: 'FactoryJob',
    class: 'Quality',
    subClass: 'Assurance',
    jobCategory: 'Quality Jobs',
    subJobCategory: 'Inspection Crew',
    subTypes: ['Quality Inspector', 'Failure Analyst', 'Safety Auditor', 'Compliance Officer', 'Standards Reviewer', 'Defect Tracker', 'Reliability Tester', 'Certification Specialist', 'Risk Examiner', 'Process Auditor'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Command Operations',
    type: 'FactoryJob',
    class: 'Command',
    subClass: 'Management',
    jobCategory: 'Leadership Jobs',
    subJobCategory: 'Command Crew',
    subTypes: ['Shift Supervisor', 'Factory Manager', 'Production Director', 'Workforce Coordinator', 'Policy Controller', 'Operations Commander', 'Resource Governor', 'Throughput Strategist', 'Plant Administrator', 'Executive Foreman'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Defense Operations',
    type: 'FactoryJob',
    class: 'Security',
    subClass: 'Protection',
    jobCategory: 'Defense Jobs',
    subJobCategory: 'Security Crew',
    subTypes: ['Facility Guard', 'Perimeter Commander', 'Drone Security Pilot', 'Cyber Defense Operator', 'Emergency Marshal', 'Threat Analyst', 'Response Team Lead', 'Checkpoint Officer', 'Counterintel Agent', 'Hazmat Warden'],
  },
  {
    category: 'Factory Workforce',
    subCategory: 'Support Operations',
    type: 'FactoryJob',
    class: 'Support',
    subClass: 'Services',
    jobCategory: 'Support Jobs',
    subJobCategory: 'Support Crew',
    subTypes: ['Medical Technician', 'Training Instructor', 'Comms Specialist', 'Welfare Coordinator', 'Civil Liaison', 'Morale Officer', 'Food Services Lead', 'Transit Coordinator', 'Records Clerk', 'Legal Administrator'],
  },
];

export const BUILDING_ARCHETYPES_90: BuildingArchetype[] = BUILDING_SEED_FAMILIES.flatMap((family, familyIndex) =>
  family.subTypes.map((subType, index) => {
    const idNumber = familyIndex * 10 + index + 1;
    return {
      id: `building-${String(idNumber).padStart(3, '0')}`,
      name: subType,
      category: family.category,
      subCategory: family.subCategory,
      type: family.type,
      subType,
      class: family.class,
      subClass: family.subClass,
    };
  })
);

export const FACTORY_JOB_ARCHETYPES_90: FactoryJobArchetype[] = FACTORY_JOB_SEED_FAMILIES.flatMap((family, familyIndex) =>
  family.subTypes.map((subType, index) => {
    const idNumber = familyIndex * 10 + index + 1;
    return {
      id: `factory-job-${String(idNumber).padStart(3, '0')}`,
      name: subType,
      category: family.category,
      subCategory: family.subCategory,
      type: family.type,
      subType,
      class: family.class,
      subClass: family.subClass,
      jobCategory: family.jobCategory,
      subJobCategory: family.subJobCategory,
    };
  })
);

export const BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY = BUILDING_ARCHETYPES_90.reduce<Record<string, BuildingArchetype[]>>((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

export const FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY = FACTORY_JOB_ARCHETYPES_90.reduce<Record<string, FactoryJobArchetype[]>>((acc, item) => {
  if (!acc[item.jobCategory]) {
    acc[item.jobCategory] = [];
  }
  acc[item.jobCategory].push(item);
  return acc;
}, {});

export const BUILDING_FACTORY_JOB_META = {
  buildings: {
    total: BUILDING_ARCHETYPES_90.length,
    categories: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.category))),
    subCategories: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.subCategory))),
    types: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.type))),
    subTypes: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.subType))),
    classes: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.class))),
    subClasses: Array.from(new Set(BUILDING_ARCHETYPES_90.map(item => item.subClass))),
  },
  factoryJobs: {
    total: FACTORY_JOB_ARCHETYPES_90.length,
    categories: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.category))),
    subCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.subCategory))),
    types: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.type))),
    subTypes: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.subType))),
    classes: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.class))),
    subClasses: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.subClass))),
    jobCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.jobCategory))),
    subJobCategories: Array.from(new Set(FACTORY_JOB_ARCHETYPES_90.map(item => item.subJobCategory))),
  },
};
