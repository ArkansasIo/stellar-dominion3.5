/**
 * Army Building Structures Configuration
 * 18 categories, 32 subcategories, tiers 1-99, levels 1-999
 * Includes: class & subClass, types & subTypes, names, ranks, titles,
 * stats & subStats, descriptions & subDescriptions, attributes & subAttributes,
 * subjects & subject details, and a 1-999 level progression system.
 * @tag #military #army #structures #buildings #tiers #levels
 */

// ============================================================================
// TIER CLASS SYSTEM (Tiers 1-99)
// ============================================================================

/** Maps a numeric tier (1-99) to its class name and subclass name */
export interface ArmyStructureTierClass {
  tierMin: number;
  tierMax: number;
  className: string;
  subClassName: string;
  rank: string;
  title: string;
  levelScaleFactor: number; // stat multiplier at tier max
}

export const ARMY_STRUCTURE_TIER_CLASSES: ArmyStructureTierClass[] = [
  {
    tierMin: 1,
    tierMax: 11,
    className: 'Foundation',
    subClassName: 'Alpha',
    rank: 'Recruit',
    title: 'Initiate Structure',
    levelScaleFactor: 1.0,
  },
  {
    tierMin: 12,
    tierMax: 22,
    className: 'Foundation',
    subClassName: 'Beta',
    rank: 'Private',
    title: 'Basic Structure',
    levelScaleFactor: 1.5,
  },
  {
    tierMin: 23,
    tierMax: 33,
    className: 'Standard',
    subClassName: 'Gamma',
    rank: 'Corporal',
    title: 'Standard Structure',
    levelScaleFactor: 2.5,
  },
  {
    tierMin: 34,
    tierMax: 44,
    className: 'Standard',
    subClassName: 'Delta',
    rank: 'Sergeant',
    title: 'Reinforced Structure',
    levelScaleFactor: 4.0,
  },
  {
    tierMin: 45,
    tierMax: 55,
    className: 'Advanced',
    subClassName: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Advanced Structure',
    levelScaleFactor: 6.5,
  },
  {
    tierMin: 56,
    tierMax: 66,
    className: 'Advanced',
    subClassName: 'Zeta',
    rank: 'Captain',
    title: 'Fortified Structure',
    levelScaleFactor: 10.5,
  },
  {
    tierMin: 67,
    tierMax: 77,
    className: 'Elite',
    subClassName: 'Theta',
    rank: 'Major',
    title: 'Elite Structure',
    levelScaleFactor: 17.0,
  },
  {
    tierMin: 78,
    tierMax: 88,
    className: 'Master',
    subClassName: 'Iota',
    rank: 'Colonel',
    title: 'Master Structure',
    levelScaleFactor: 27.0,
  },
  {
    tierMin: 89,
    tierMax: 99,
    className: 'Supreme',
    subClassName: 'Omega',
    rank: 'General',
    title: 'Supreme Structure',
    levelScaleFactor: 44.0,
  },
];

/** Returns the tier class entry for a given tier (1-99) */
export function getArmyStructureTierClass(tier: number): ArmyStructureTierClass {
  const entry = ARMY_STRUCTURE_TIER_CLASSES.find(
    (tc) => tier >= tc.tierMin && tier <= tc.tierMax,
  );
  return entry ?? ARMY_STRUCTURE_TIER_CLASSES[0];
}

// ============================================================================
// STATS & SUB-STATS
// ============================================================================

export interface ArmyBuildingStats {
  /** Maximum number of troops the structure can house/train */
  capacity: number;
  /** Defensive power contribution */
  defense: number;
  /** Training speed modifier (units/hour) */
  trainingSpeed: number;
  /** Resource cost per maintenance cycle */
  maintenanceCost: number;
  /** Health / hit-points of the structure itself */
  structureHealth: number;
  /** Influence radius on the battlefield (in km) */
  influenceRadius: number;
}

export interface ArmyBuildingSubStats {
  /** Bonus training XP granted per cycle */
  trainingXpBonus: number;
  /** Percentage reduction of unit casualties during training */
  casualtyReduction: number;
  /** Morale boost to stationed units */
  moraleBoost: number;
  /** Supply consumption modifier */
  supplyEfficiency: number;
  /** Technology research point generation per hour */
  researchOutput: number;
  /** Intelligence / surveillance coverage */
  intelligenceCoverage: number;
}

// ============================================================================
// ATTRIBUTES & SUB-ATTRIBUTES
// ============================================================================

export interface ArmyBuildingAttributes {
  /** Primary material used in construction */
  constructionMaterial: string;
  /** Power requirement in energy units */
  powerRequirement: number;
  /** Minimum player level to unlock */
  unlockLevel: number;
  /** Build time in hours */
  buildTimeHours: number;
  /** Maximum upgrade tier cap */
  maxTier: number;
  /** Maximum upgrade level cap */
  maxLevel: number;
}

export interface ArmyBuildingSubAttributes {
  /** Whether the structure can be camouflaged */
  camouflageCapable: boolean;
  /** Whether the structure is mobile / relocatable */
  mobile: boolean;
  /** Whether the structure has orbital capability */
  orbitalCapable: boolean;
  /** Upgrade path identifier */
  upgradePathId: string;
  /** Personnel specializations supported */
  supportedSpecializations: string[];
  /** Required prerequisite structure IDs */
  prerequisites: string[];
}

// ============================================================================
// SUBJECTS & SUBJECT DETAILS
// ============================================================================

export interface ArmyBuildingSubjectDetail {
  subject: string;
  description: string;
  subDescription: string;
  details: string;
}

// ============================================================================
// CORE ARCHETYPE INTERFACE
// ============================================================================

export interface ArmyBuildingStructureArchetype {
  id: string;
  name: string;
  rank: string;
  title: string;
  category: string;       // one of 18 categories
  subCategory: string;    // one of 32 subcategories
  type: string;
  subType: string;
  class: string;          // tier-based class
  subClass: string;       // tier-based subclass
  tier: number;           // 1-99
  maxLevel: number;       // 1-999
  description: string;
  subDescription: string;
  baseStats: ArmyBuildingStats;
  baseSubStats: ArmyBuildingSubStats;
  attributes: ArmyBuildingAttributes;
  subAttributes: ArmyBuildingSubAttributes;
  subjects: ArmyBuildingSubjectDetail[];
}

// ============================================================================
// SEED FAMILIES (18 categories, 32 subcategories)
// ============================================================================

interface ArmyBuildingSeedFamily {
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  class: string;
  subClass: string;
  rank: string;
  title: string;
  baseTier: number;         // representative tier for this family
  description: string;
  subDescription: string;
  attributeHints: Partial<ArmyBuildingAttributes>;
  subAttributeHints: Partial<ArmyBuildingSubAttributes>;
  subjectHints: ArmyBuildingSubjectDetail[];
  structures: string[];     // sub-type names for generated entries
}

const ARMY_BUILDING_SEED_FAMILIES: ArmyBuildingSeedFamily[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 1 – Command & Control Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Command & Control Structures',
    subCategory: 'Forward Command Posts',
    type: 'ArmyStructure',
    subType: 'Forward Command',
    class: 'Standard',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Field Command Post',
    baseTier: 10,
    description:
      'Temporary forward-deployed command nodes that coordinate frontline operations and relay battle data.',
    subDescription:
      'Hardened mobile command units capable of rapid deployment within contested zones.',
    attributeHints: {
      constructionMaterial: 'Composite Steel',
      powerRequirement: 50,
      unlockLevel: 5,
      buildTimeHours: 2,
    },
    subAttributeHints: {
      mobile: true,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['Officer', 'Signals', 'Intelligence'],
    },
    subjectHints: [
      {
        subject: 'Tactical Command',
        description: 'Provides real-time battlefield situational awareness.',
        subDescription: 'Integrates drone feeds and ground unit telemetry.',
        details: 'Unlocks area-of-operations overlay on strategic map.',
      },
      {
        subject: 'Force Coordination',
        description: 'Synchronizes multi-unit maneuvers and attack timing.',
        subDescription: 'Reduces unit response latency by 15%.',
        details: 'Required for coordinated assault formations.',
      },
    ],
    structures: [
      'Advance Command Tent',
      'Tactical Operations Center',
      'Mobile Battle Bridge',
      'Field Relay Station',
      'Strike Coordination Node',
    ],
  },
  {
    category: 'Command & Control Structures',
    subCategory: 'Field Headquarters',
    type: 'ArmyStructure',
    subType: 'Field HQ',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Field Headquarters',
    baseTier: 25,
    description:
      'Semi-permanent field headquarters providing strategic command capabilities and officer staffing.',
    subDescription:
      'Reinforced structure housing command staff, communication arrays, and logistical support.',
    attributeHints: {
      constructionMaterial: 'Reinforced Concrete',
      powerRequirement: 120,
      unlockLevel: 15,
      buildTimeHours: 8,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['General', 'Admiral', 'Chief of Staff', 'Intelligence Officer'],
    },
    subjectHints: [
      {
        subject: 'Strategic Planning',
        description: 'Houses planning rooms for long-term campaign strategy.',
        subDescription: 'Enables multi-theater campaign management.',
        details: 'Unlocks campaign chain missions and operational orders.',
      },
      {
        subject: 'Officer Assignments',
        description: 'Manages officer roster and unit command assignments.',
        subDescription: 'Officers provide stat bonuses to commanded units.',
        details: 'Supports up to 12 officer slots per headquarters level.',
      },
    ],
    structures: [
      'Battalion HQ Building',
      'Regimental Command Center',
      'Division Operations Complex',
      'Corps Strategic Hub',
      'Army Group Citadel',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 2 – Training & Barracks Facilities  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Training & Barracks Facilities',
    subCategory: 'Recruit Barracks',
    type: 'ArmyStructure',
    subType: 'Barracks',
    class: 'Foundation',
    subClass: 'Alpha',
    rank: 'Recruit',
    title: 'Basic Barracks',
    baseTier: 1,
    description:
      'Standard barracks housing, feeding, and preparing newly recruited soldiers for basic military service.',
    subDescription:
      'Entry-level accommodation block with training yard and supply storage.',
    attributeHints: {
      constructionMaterial: 'Prefab Panels',
      powerRequirement: 20,
      unlockLevel: 1,
      buildTimeHours: 1,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Infantry', 'Support'],
    },
    subjectHints: [
      {
        subject: 'Basic Training',
        description: 'Trains recruits in fundamental combat skills.',
        subDescription: 'Covers physical conditioning, weapons handling, and discipline.',
        details: 'Increases recruit XP gain by 10% per barracks level.',
      },
      {
        subject: 'Unit Capacity',
        description: 'Determines maximum housed unit count.',
        subDescription: 'Each barracks tier increases capacity by 50 soldiers.',
        details: 'Capacity formula: 50 × tier × (1 + 0.05 × level).',
      },
    ],
    structures: [
      'Recruit Bunkhouse',
      'Soldier Quarters Block',
      'Infantry Dormitory',
      'Field Barracks',
      'Company Housing Complex',
    ],
  },
  {
    category: 'Training & Barracks Facilities',
    subCategory: 'Advanced Combat Schools',
    type: 'ArmyStructure',
    subType: 'Combat School',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Advanced Combat School',
    baseTier: 40,
    description:
      'Specialist training institutions for elite soldiers, officers, and unit specializations.',
    subDescription:
      'High-tech simulation chambers, live-fire ranges, and advanced tactical classrooms.',
    attributeHints: {
      constructionMaterial: 'Reinforced Alloy',
      powerRequirement: 200,
      unlockLevel: 30,
      buildTimeHours: 24,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Elite Infantry', 'Commando', 'Ranger', 'Pilot', 'Mech Operator'],
    },
    subjectHints: [
      {
        subject: 'Specialization Training',
        description: 'Unlocks advanced unit specialization classes.',
        subDescription: 'Reduces specialization unlock cost by 20%.',
        details: 'Required to train Tier 5+ elite unit types.',
      },
      {
        subject: 'Combat Simulation',
        description: 'Holographic combat simulation for risk-free training.',
        subDescription: 'Grants bonus XP without field casualties.',
        details: 'Simulation sessions award 200% XP of standard training.',
      },
    ],
    structures: [
      'Advanced Infantry School',
      'Ranger Training Complex',
      'Pilot Academy',
      'Mech Operator Institute',
      'Special Forces Selection Course',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 3 – Armory & Weapons Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Armory & Weapons Structures',
    subCategory: 'Light Armory',
    type: 'ArmyStructure',
    subType: 'Light Weapons Storage',
    class: 'Foundation',
    subClass: 'Beta',
    rank: 'Private',
    title: 'Light Armory',
    baseTier: 5,
    description:
      'Secure storage and maintenance facility for small arms, light weapons, and personal equipment.',
    subDescription:
      'Organized rack systems with maintenance benches and automated inventory tracking.',
    attributeHints: {
      constructionMaterial: 'Steel Frame',
      powerRequirement: 30,
      unlockLevel: 3,
      buildTimeHours: 2,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Infantry', 'Rifleman', 'Support Gunner'],
    },
    subjectHints: [
      {
        subject: 'Weapons Maintenance',
        description: 'Regular maintenance cycles prevent weapon degradation.',
        subDescription: 'Reduces weapon malfunction rate by 15%.',
        details: 'Malfunction prevention scales with armory level.',
      },
    ],
    structures: [
      'Rifle Storage Rack',
      'Small Arms Cache',
      'Light Weapons Vault',
      'Infantry Equipment Store',
      'Personal Gear Depot',
    ],
  },
  {
    category: 'Armory & Weapons Structures',
    subCategory: 'Heavy Weapons Depot',
    type: 'ArmyStructure',
    subType: 'Heavy Weapons Storage',
    class: 'Standard',
    subClass: 'Gamma',
    rank: 'Corporal',
    title: 'Heavy Weapons Depot',
    baseTier: 20,
    description:
      'Reinforced storage facility for crew-served weapons, artillery pieces, anti-tank weapons, and ordnance.',
    subDescription:
      'Climate-controlled bays with heavy-lift equipment and specialized maintenance crews.',
    attributeHints: {
      constructionMaterial: 'Reinforced Concrete',
      powerRequirement: 80,
      unlockLevel: 12,
      buildTimeHours: 10,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Artillery', 'Anti-Armor', 'Heavy Weapons Crew'],
    },
    subjectHints: [
      {
        subject: 'Ordnance Management',
        description: 'Tracks and maintains heavy ordnance stocks.',
        subDescription: 'Automated inventory prevents shortage during campaigns.',
        details: 'Increases artillery reload speed by 10% per depot level.',
      },
      {
        subject: 'Weapons Upgrades',
        description: 'Provides facilities for field modification and enhancement.',
        subDescription: 'Unlocks weapon upgrade modules.',
        details: 'Each upgrade slot requires depot tier ≥ upgrade tier.',
      },
    ],
    structures: [
      'Artillery Storage Bay',
      'Missile Launcher Depot',
      'Anti-Tank Weapons Vault',
      'Mortar Pool',
      'Crew-Served Weapons Annex',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 4 – Defense & Fortification Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Defense & Fortification Structures',
    subCategory: 'Ground Defense Perimeters',
    type: 'ArmyStructure',
    subType: 'Perimeter Defense',
    class: 'Standard',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Defensive Perimeter',
    baseTier: 15,
    description:
      'Layered ground-level defensive works including trenches, wire, firing positions, and patrol routes.',
    subDescription:
      'Integrates sensors, motion detectors, and automated alarm systems.',
    attributeHints: {
      constructionMaterial: 'Earth & Steel',
      powerRequirement: 40,
      unlockLevel: 8,
      buildTimeHours: 6,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['Infantry', 'Sentry', 'Combat Engineer'],
    },
    subjectHints: [
      {
        subject: 'Perimeter Security',
        description: 'Maintains 24-hour perimeter integrity.',
        subDescription: 'Triggers early-warning alerts on intrusion.',
        details: 'Detection range scales with tier × 50 meters.',
      },
    ],
    structures: [
      'Trench Network',
      'Sandbag Fortification',
      'Wire Obstacle Belt',
      'Sentry Post Array',
      'Minefield Perimeter',
    ],
  },
  {
    category: 'Defense & Fortification Structures',
    subCategory: 'Fortified Strongholds',
    type: 'ArmyStructure',
    subType: 'Stronghold',
    class: 'Elite',
    subClass: 'Theta',
    rank: 'Major',
    title: 'Fortified Stronghold',
    baseTier: 60,
    description:
      'Hardened stronghold capable of withstanding sustained artillery barrages and combined-arms assaults.',
    subDescription:
      'Underground bunker networks with independent power, water, and command systems.',
    attributeHints: {
      constructionMaterial: 'Durasteel & Carbon Composite',
      powerRequirement: 500,
      unlockLevel: 50,
      buildTimeHours: 96,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Garrison', 'Artillery', 'Anti-Air', 'Command'],
    },
    subjectHints: [
      {
        subject: 'Structural Integrity',
        description: 'Blast-resistant construction reduces siege damage.',
        subDescription: 'Reduces incoming siege damage by 40% at max level.',
        details: 'Each tier adds 2,000 structural HP.',
      },
      {
        subject: 'Defensive Emplacements',
        description: 'Integrated weapon mounts for automated defense.',
        subDescription: 'Auto-turrets engage targets within range.',
        details: 'Turret damage = base × tier × level scaling factor.',
      },
    ],
    structures: [
      'Bunker Complex',
      'Fortified Garrison Tower',
      'Underground Command Bunker',
      'Hardened Gun Emplacement',
      'Siege-Resistant Citadel Wall',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 5 – Intelligence & Surveillance Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Intelligence & Surveillance Structures',
    subCategory: 'Reconnaissance Stations',
    type: 'ArmyStructure',
    subType: 'Recon Station',
    class: 'Standard',
    subClass: 'Gamma',
    rank: 'Corporal',
    title: 'Recon Station',
    baseTier: 18,
    description:
      'Ground-based reconnaissance stations gathering enemy movement, terrain, and force composition data.',
    subDescription:
      'Long-range optics, drone deployment pads, and encrypted data relay systems.',
    attributeHints: {
      constructionMaterial: 'Composite Frame',
      powerRequirement: 60,
      unlockLevel: 10,
      buildTimeHours: 4,
    },
    subAttributeHints: {
      mobile: true,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['Scout', 'Intelligence Analyst', 'Drone Operator'],
    },
    subjectHints: [
      {
        subject: 'Enemy Tracking',
        description: 'Maintains persistent surveillance on enemy positions.',
        subDescription: 'Updates enemy force positions every 5 minutes.',
        details: 'Intel accuracy improves with station level.',
      },
    ],
    structures: [
      'Observation Post',
      'Forward Recon Camp',
      'Drone Launch Station',
      'Mobile Surveillance Unit',
      'Long-Range Optics Tower',
    ],
  },
  {
    category: 'Intelligence & Surveillance Structures',
    subCategory: 'Signal Intelligence Hubs',
    type: 'ArmyStructure',
    subType: 'SIGINT Hub',
    class: 'Advanced',
    subClass: 'Zeta',
    rank: 'Captain',
    title: 'Signal Intelligence Hub',
    baseTier: 50,
    description:
      'Signals intelligence facility intercepting enemy communications and electronic emissions.',
    subDescription:
      'Houses advanced SIGINT receivers, crypto-analysis terminals, and a full analyst team.',
    attributeHints: {
      constructionMaterial: 'Signal-Absorbent Composite',
      powerRequirement: 300,
      unlockLevel: 40,
      buildTimeHours: 48,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: true,
      orbitalCapable: true,
      supportedSpecializations: ['SIGINT Analyst', 'Cryptographer', 'Cyber Operator'],
    },
    subjectHints: [
      {
        subject: 'Communications Intercept',
        description: 'Intercepts and decodes enemy radio communications.',
        subDescription: 'Reveals enemy orders 2 turns in advance.',
        details: 'Intercept success rate = 30% + (level × 0.05%).',
      },
      {
        subject: 'Electronic Order of Battle',
        description: 'Maps all enemy electronic emitters on the battlefield.',
        subDescription: 'Enables targeted electronic jamming missions.',
        details: 'Emitter database updates every campaign cycle.',
      },
    ],
    structures: [
      'SIGINT Antenna Array',
      'Crypto-Analysis Center',
      'Electronic Intercept Post',
      'Communications Listening Outpost',
      'Battlefield Emissions Hub',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 6 – Supply & Logistics Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Supply & Logistics Structures',
    subCategory: 'Supply Depots',
    type: 'ArmyStructure',
    subType: 'Supply Depot',
    class: 'Foundation',
    subClass: 'Beta',
    rank: 'Private',
    title: 'Supply Depot',
    baseTier: 8,
    description:
      'Central supply depot storing ammunition, food, fuel, and general military stores.',
    subDescription:
      'Climate-controlled warehousing with automated inventory and rapid-issue counters.',
    attributeHints: {
      constructionMaterial: 'Prefab Steel',
      powerRequirement: 35,
      unlockLevel: 4,
      buildTimeHours: 3,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Logistician', 'Supply Specialist', 'Quartermaster'],
    },
    subjectHints: [
      {
        subject: 'Stockpile Management',
        description: 'Maintains strategic reserves of critical supplies.',
        subDescription: 'Prevents supply shortages during extended campaigns.',
        details: 'Max storage = base × tier × (1 + 0.1 × level).',
      },
    ],
    structures: [
      'Basic Supply Shed',
      'Field Ration Depot',
      'Ammunition Cache',
      'Fuel Storage Site',
      'Equipment Warehouse',
    ],
  },
  {
    category: 'Supply & Logistics Structures',
    subCategory: 'Logistics Operations Centers',
    type: 'ArmyStructure',
    subType: 'Logistics Hub',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Logistics Operations Center',
    baseTier: 35,
    description:
      'Central logistics hub coordinating supply chain, transport routes, and distribution across the theater.',
    subDescription:
      'Integrates supply chain software with physical dock facilities and distribution management.',
    attributeHints: {
      constructionMaterial: 'Steel & Glass Composite',
      powerRequirement: 180,
      unlockLevel: 25,
      buildTimeHours: 20,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Logistics Commander', 'Transport Officer', 'Supply Chain Manager'],
    },
    subjectHints: [
      {
        subject: 'Supply Route Optimization',
        description: 'Optimizes supply convoy routes and delivery schedules.',
        subDescription: 'Reduces supply delivery time by 25% per center level.',
        details: 'Optimal routing algorithm unlocked at level 10.',
      },
      {
        subject: 'Theater Distribution',
        description: 'Manages theater-wide supply distribution.',
        subDescription: 'Enables push logistics to forward elements.',
        details: 'Coverage range = 100km × tier.',
      },
    ],
    structures: [
      'Theater Supply Hub',
      'Forward Distribution Center',
      'Transport Coordination Post',
      'Multi-Modal Logistics Node',
      'Automated Supply Chain Center',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 7 – Medical & Support Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Medical & Support Structures',
    subCategory: 'Field Hospitals',
    type: 'ArmyStructure',
    subType: 'Field Hospital',
    class: 'Standard',
    subClass: 'Gamma',
    rank: 'Corporal',
    title: 'Field Hospital',
    baseTier: 12,
    description:
      'Forward medical treatment facility providing surgical care, triage, and recovery services.',
    subDescription:
      'Equipped with operating theaters, recovery wards, and medical supply stockpiles.',
    attributeHints: {
      constructionMaterial: 'Medical-Grade Composite',
      powerRequirement: 100,
      unlockLevel: 7,
      buildTimeHours: 5,
    },
    subAttributeHints: {
      mobile: true,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Medic', 'Surgeon', 'Combat Nurse', 'Field Medic'],
    },
    subjectHints: [
      {
        subject: 'Casualty Recovery',
        description: 'Treats wounded soldiers and returns them to duty.',
        subDescription: 'Recovery rate = 10 soldiers/hour × level.',
        details: 'Severe casualties require Level 5+ hospital.',
      },
      {
        subject: 'Medical Research',
        description: 'Conducts research into field medicine improvements.',
        subDescription: 'Unlocks improved recovery protocols.',
        details: 'Each research cycle reduces recovery time by 5%.',
      },
    ],
    structures: [
      'Aid Station',
      'Forward Surgical Team Tent',
      'Mobile Hospital Unit',
      'Combat Support Hospital',
      'Rear Area Medical Center',
    ],
  },
  {
    category: 'Medical & Support Structures',
    subCategory: 'Trauma Response Units',
    type: 'ArmyStructure',
    subType: 'Trauma Unit',
    class: 'Elite',
    subClass: 'Theta',
    rank: 'Major',
    title: 'Trauma Response Center',
    baseTier: 65,
    description:
      'High-capability trauma response centers with full surgical suites and intensive care capabilities.',
    subDescription:
      'Handles the most critical casualties with specialist trauma surgeons and bio-regeneration technology.',
    attributeHints: {
      constructionMaterial: 'Bio-Compatible Alloy',
      powerRequirement: 600,
      unlockLevel: 55,
      buildTimeHours: 72,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Trauma Surgeon', 'Anesthesiologist', 'Critical Care Specialist'],
    },
    subjectHints: [
      {
        subject: 'Bio-Regeneration',
        description: 'Advanced regenerative medicine to restore critically wounded soldiers.',
        subDescription: 'Can recover soldiers from near-fatal wounds.',
        details: 'Bio-regen success rate = 60% + (level × 0.3%).',
      },
      {
        subject: 'Elite Casualty Management',
        description: 'Preserves elite unit cohesion through rapid recovery.',
        subDescription: 'Elite units recover at 2× standard rate.',
        details: 'Requires Trauma Center tier ≥ unit tier.',
      },
    ],
    structures: [
      'Level-1 Trauma Bay',
      'Critical Care Ward',
      'Bio-Regeneration Chamber',
      'Neuro-Surgical Suite',
      'Advanced Trauma Recovery Complex',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 8 – Vehicle & Armor Depot Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Vehicle & Armor Depot Structures',
    subCategory: 'Armored Vehicle Bays',
    type: 'ArmyStructure',
    subType: 'Vehicle Bay',
    class: 'Standard',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Armored Vehicle Bay',
    baseTier: 22,
    description:
      'Covered maintenance and storage bays for light and medium armored vehicles.',
    subDescription:
      'Equipped with vehicle lifts, diagnostic computers, and parts stores for rapid turnaround.',
    attributeHints: {
      constructionMaterial: 'Heavy Steel Frame',
      powerRequirement: 150,
      unlockLevel: 15,
      buildTimeHours: 12,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Mechanic', 'Vehicle Commander', 'Armor Technician'],
    },
    subjectHints: [
      {
        subject: 'Vehicle Maintenance',
        description: 'Performs scheduled and corrective maintenance on armored vehicles.',
        subDescription: 'Reduces vehicle breakdown rate by 20%.',
        details: 'Maintenance cycle = 24 hours / level.',
      },
    ],
    structures: [
      'APC Maintenance Bay',
      'IFV Service Hangar',
      'Recon Vehicle Depot',
      'Light Tank Service Bay',
      'Wheeled Armor Garage',
    ],
  },
  {
    category: 'Vehicle & Armor Depot Structures',
    subCategory: 'Heavy Armor Maintenance Facilities',
    type: 'ArmyStructure',
    subType: 'Heavy Armor Facility',
    class: 'Elite',
    subClass: 'Theta',
    rank: 'Major',
    title: 'Heavy Armor Maintenance Facility',
    baseTier: 55,
    description:
      'Full-scale maintenance and overhaul facilities for main battle tanks and heavy armored platforms.',
    subDescription:
      'Features turret removal rigs, engine test cells, and armor plate fabrication capability.',
    attributeHints: {
      constructionMaterial: 'Industrial Steel & Composite',
      powerRequirement: 700,
      unlockLevel: 45,
      buildTimeHours: 60,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Master Mechanic', 'Armor Engineer', 'System Integration Specialist'],
    },
    subjectHints: [
      {
        subject: 'Battle Damage Repair',
        description: 'Restores combat-damaged armor to operational status.',
        subDescription: 'Repair time based on damage level and facility tier.',
        details: 'Critical damage repair requires facility tier ≥ 6.',
      },
      {
        subject: 'Armor Upgrades',
        description: 'Applies upgrade packages to existing armor platforms.',
        subDescription: 'Upgrade packages improve combat effectiveness by 10-30%.',
        details: 'Each upgrade slot consumes construction materials.',
      },
    ],
    structures: [
      'MBT Service Depot',
      'Turret Overhaul Workshop',
      'Engine Test Facility',
      'Armor Fabrication Plant',
      'Heavy Combat Vehicle Overhaul Center',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 9 – Aviation & Aerospace Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Aviation & Aerospace Structures',
    subCategory: 'Air Superiority Bases',
    type: 'ArmyStructure',
    subType: 'Air Base',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Air Superiority Base',
    baseTier: 30,
    description:
      'Tactical air base supporting fighter, interceptor, and close-air-support aviation assets.',
    subDescription:
      'Runways, hangars, fuel farms, and munitions storage supporting round-the-clock air operations.',
    attributeHints: {
      constructionMaterial: 'Reinforced Concrete & Steel',
      powerRequirement: 400,
      unlockLevel: 22,
      buildTimeHours: 36,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Fighter Pilot', 'Ground Attack Pilot', 'Air Traffic Controller'],
    },
    subjectHints: [
      {
        subject: 'Air Superiority Operations',
        description: 'Supports fighter CAP missions over the battlefield.',
        subDescription: 'Provides 30% air superiority bonus to allied ground forces.',
        details: 'Air superiority radius = 150km × tier.',
      },
    ],
    structures: [
      'Forward Operating Air Strip',
      'Tactical Air Base',
      'Fighter Wing Hangar Complex',
      'Air Superiority Control Tower',
      'Close Air Support Operations Hub',
    ],
  },
  {
    category: 'Aviation & Aerospace Structures',
    subCategory: 'Strategic Bomber Platforms',
    type: 'ArmyStructure',
    subType: 'Bomber Base',
    class: 'Master',
    subClass: 'Iota',
    rank: 'Colonel',
    title: 'Strategic Bomber Platform',
    baseTier: 75,
    description:
      'Long-range strategic bombing base housing heavy bombers and precision strike assets.',
    subDescription:
      'Hardened shelters, extended runways, and strategic weapons storage for deep-strike missions.',
    attributeHints: {
      constructionMaterial: 'Durasteel Reinforced Concrete',
      powerRequirement: 900,
      unlockLevel: 65,
      buildTimeHours: 120,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: true,
      supportedSpecializations: ['Strategic Bomber Pilot', 'Weapons Systems Officer', 'Mission Planner'],
    },
    subjectHints: [
      {
        subject: 'Strategic Strike',
        description: 'Launches deep-penetration strike missions against enemy infrastructure.',
        subDescription: 'Deals 200% damage to enemy structures.',
        details: 'Mission range = 2,000km × tier.',
      },
      {
        subject: 'Orbital Insertion Support',
        description: 'Supports orbital delivery of high-altitude munitions.',
        subDescription: 'Enables orbital bombardment when orbital assets are in range.',
        details: 'Orbital support requires minimum platform tier 7.',
      },
    ],
    structures: [
      'Strategic Bomber Hangar',
      'Long-Range Strike Platform',
      'Heavy Payload Storage Bay',
      'Strategic Mission Control Center',
      'Hardened Bomber Shelter Complex',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 10 – Cyber & Electronic Warfare Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Cyber & Electronic Warfare Structures',
    subCategory: 'Electronic Warfare Stations',
    type: 'ArmyStructure',
    subType: 'EW Station',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Electronic Warfare Station',
    baseTier: 38,
    description:
      'Dedicated electronic warfare station jamming enemy communications, radars, and guidance systems.',
    subDescription:
      'Noise jammers, deception emitters, and directed-energy interference arrays.',
    attributeHints: {
      constructionMaterial: 'EMI-Shielded Alloy',
      powerRequirement: 350,
      unlockLevel: 28,
      buildTimeHours: 28,
    },
    subAttributeHints: {
      mobile: true,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['EW Operator', 'Frequency Analyst', 'Jamming Specialist'],
    },
    subjectHints: [
      {
        subject: 'Communications Jamming',
        description: 'Disrupts enemy command communications.',
        subDescription: 'Reduces enemy coordination bonus by 25%.',
        details: 'Jamming radius = 75km × tier.',
      },
    ],
    structures: [
      'Tactical Jammer Array',
      'Radar Deception Station',
      'Electronic Countermeasure Post',
      'Noise Emitter Platform',
      'Direction Finding Station',
    ],
  },
  {
    category: 'Cyber & Electronic Warfare Structures',
    subCategory: 'Cyber Operations Centers',
    type: 'ArmyStructure',
    subType: 'Cyber Ops Center',
    class: 'Elite',
    subClass: 'Zeta',
    rank: 'Captain',
    title: 'Cyber Operations Center',
    baseTier: 58,
    description:
      'Offensive and defensive cyber operations center conducting network intrusion and digital warfare.',
    subDescription:
      'Staffed by elite cyber warriors with access to advanced hacking tools and zero-day exploits.',
    attributeHints: {
      constructionMaterial: 'Signal-Hardened Composite',
      powerRequirement: 550,
      unlockLevel: 48,
      buildTimeHours: 72,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: true,
      supportedSpecializations: ['Cyber Warrior', 'Network Infiltrator', 'Digital Defense Analyst'],
    },
    subjectHints: [
      {
        subject: 'Offensive Cyber Operations',
        description: 'Intrudes into enemy command-and-control networks.',
        subDescription: 'Can disable enemy structures remotely.',
        details: 'Intrusion success rate = 20% + (level × 0.2%).',
      },
      {
        subject: 'Defensive Cyber Shield',
        description: 'Protects allied networks from enemy intrusion.',
        subDescription: 'Blocks 30% of enemy cyber attacks.',
        details: 'Shield strength scales with level.',
      },
    ],
    structures: [
      'Network Intrusion Terminal',
      'Offensive Cyber Platform',
      'Digital Defense Bunker',
      'Cyber Warfare Command Node',
      'Zero-Day Exploit Repository',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 11 – Communications & Signal Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Communications & Signal Structures',
    subCategory: 'Signal Towers',
    type: 'ArmyStructure',
    subType: 'Signal Tower',
    class: 'Foundation',
    subClass: 'Beta',
    rank: 'Private',
    title: 'Signal Tower',
    baseTier: 6,
    description:
      'Basic signal relay towers extending command-and-control communications range across the battlefield.',
    subDescription:
      'Antenna arrays with encrypted transmission capability and secure voice/data links.',
    attributeHints: {
      constructionMaterial: 'Lattice Steel',
      powerRequirement: 25,
      unlockLevel: 3,
      buildTimeHours: 2,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Signal Operator', 'Communications Specialist'],
    },
    subjectHints: [
      {
        subject: 'Signal Range Extension',
        description: 'Extends command communication range.',
        subDescription: 'Each tower adds 50km communication range.',
        details: 'Signal strength degrades with distance from tower.',
      },
    ],
    structures: [
      'Basic Antenna Mast',
      'VHF Relay Tower',
      'UHF Communications Tower',
      'Encrypted Signal Station',
      'Battlefield Comms Relay',
    ],
  },
  {
    category: 'Communications & Signal Structures',
    subCategory: 'Communications Relay Networks',
    type: 'ArmyStructure',
    subType: 'Comms Network Node',
    class: 'Advanced',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Communications Relay Network',
    baseTier: 42,
    description:
      'Integrated communications relay networks providing theater-wide secure voice, data, and video links.',
    subDescription:
      'Satellite uplink terminals, fiber-optic backbone, and redundant communication pathways.',
    attributeHints: {
      constructionMaterial: 'Advanced Electronics Housing',
      powerRequirement: 250,
      unlockLevel: 32,
      buildTimeHours: 32,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: true,
      supportedSpecializations: ['Network Engineer', 'Satellite Communications Officer', 'Comms Director'],
    },
    subjectHints: [
      {
        subject: 'Secure Network Backbone',
        description: 'Provides quantum-encrypted backbone for all military communications.',
        subDescription: 'Prevents enemy communications intercept.',
        details: 'Encryption strength scales with node level.',
      },
      {
        subject: 'Orbital Uplink',
        description: 'Connects battlefield to orbital and strategic command assets.',
        subDescription: 'Enables real-time data sharing with orbital platforms.',
        details: 'Orbital link requires node tier ≥ 5.',
      },
    ],
    structures: [
      'Satellite Uplink Terminal',
      'Fiber-Optic Backbone Node',
      'Data Distribution Hub',
      'Secure Video Conference Center',
      'Theater Communications Nexus',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 12 – Research & Development Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Research & Development Structures',
    subCategory: 'Military R&D Laboratories',
    type: 'ArmyStructure',
    subType: 'Military Lab',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Military Research Laboratory',
    baseTier: 28,
    description:
      'Dedicated military research laboratories developing new weapons, equipment, and tactical technologies.',
    subDescription:
      'Houses scientists, engineers, and prototype fabrication equipment.',
    attributeHints: {
      constructionMaterial: 'Research-Grade Composite',
      powerRequirement: 300,
      unlockLevel: 20,
      buildTimeHours: 24,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Military Scientist', 'Weapons Designer', 'Technology Analyst'],
    },
    subjectHints: [
      {
        subject: 'Weapons Research',
        description: 'Develops improved weapons systems for all unit types.',
        subDescription: 'Each research tier unlocks new weapons capabilities.',
        details: 'Research rate = base × level × (1 + 0.1 × tier).',
      },
    ],
    structures: [
      'Applied Science Lab',
      'Weapons Test Laboratory',
      'Advanced Materials Research Facility',
      'Field Equipment Innovation Center',
      'Combat Systems Development Lab',
    ],
  },
  {
    category: 'Research & Development Structures',
    subCategory: 'Prototype Testing Facilities',
    type: 'ArmyStructure',
    subType: 'Prototype Facility',
    class: 'Elite',
    subClass: 'Theta',
    rank: 'Major',
    title: 'Prototype Testing Facility',
    baseTier: 68,
    description:
      'Closed test ranges and simulation environments for proving new military technology before fielding.',
    subDescription:
      'Full-scale replicas of combat environments, live-fire ranges, and destructive testing chambers.',
    attributeHints: {
      constructionMaterial: 'Experimental Composite',
      powerRequirement: 800,
      unlockLevel: 58,
      buildTimeHours: 96,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Test Engineer', 'Prototype Pilot', 'Systems Evaluator'],
    },
    subjectHints: [
      {
        subject: 'Prototype Validation',
        description: 'Validates new technology before operational deployment.',
        subDescription: 'Reduces prototype failure rate by 50%.',
        details: 'Validation cycle time scales with complexity tier.',
      },
      {
        subject: 'Technology Integration',
        description: 'Integrates cutting-edge technologies into fielded platforms.',
        subDescription: 'Unlocks integration upgrade for all unit types.',
        details: 'Integration bonus = 5% per technology tier applied.',
      },
    ],
    structures: [
      'Closed Test Range',
      'Live-Fire Evaluation Center',
      'Simulation Combat Chamber',
      'Systems Integration Lab',
      'Destructive Testing Facility',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 13 – Munitions & Explosives Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Munitions & Explosives Structures',
    subCategory: 'Ammunition Manufacturing Plants',
    type: 'ArmyStructure',
    subType: 'Ammo Plant',
    class: 'Standard',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Ammunition Manufacturing Plant',
    baseTier: 20,
    description:
      'Industrial-scale ammunition production plants manufacturing small arms to artillery caliber rounds.',
    subDescription:
      'Automated production lines with quality-control stations and safety-compliant storage.',
    attributeHints: {
      constructionMaterial: 'Industrial Steel',
      powerRequirement: 220,
      unlockLevel: 14,
      buildTimeHours: 16,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Munitions Worker', 'Quality Control Inspector', 'Production Supervisor'],
    },
    subjectHints: [
      {
        subject: 'Ammo Production Rate',
        description: 'Produces ammunition stockpiles for all unit types.',
        subDescription: 'Production rate = base × tier × level multiplier.',
        details: 'Each plant level adds 1,000 rounds/hour base production.',
      },
    ],
    structures: [
      'Small Arms Ammo Factory',
      'Cannon Shell Manufacturing Line',
      'Rocket Propellant Plant',
      'Artillery Round Foundry',
      'Guided Munitions Assembly Plant',
    ],
  },
  {
    category: 'Munitions & Explosives Structures',
    subCategory: 'Explosive Ordnance Depots',
    type: 'ArmyStructure',
    subType: 'EOD Storage',
    class: 'Elite',
    subClass: 'Zeta',
    rank: 'Captain',
    title: 'Explosive Ordnance Depot',
    baseTier: 52,
    description:
      'Hardened and secure storage depots for all classes of explosive ordnance, mines, and warheads.',
    subDescription:
      'Earth-bermed magazines with suppression systems and strict access controls.',
    attributeHints: {
      constructionMaterial: 'Earth-Bermed Reinforced Concrete',
      powerRequirement: 120,
      unlockLevel: 42,
      buildTimeHours: 48,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['EOD Technician', 'Ordnance Safety Officer', 'Magazine Supervisor'],
    },
    subjectHints: [
      {
        subject: 'Ordnance Security',
        description: 'Maintains strict security protocols for explosive storage.',
        subDescription: 'Prevents accidental detonation and theft.',
        details: 'Security breach probability = max(0%, 5% - level × 0.01%).',
      },
      {
        subject: 'Warhead Storage',
        description: 'Houses advanced warhead types including fuel-air and thermobaric.',
        subDescription: 'Unlocks special ordnance types per depot tier.',
        details: 'Tier 6+ depots unlock nuclear-class warhead storage.',
      },
    ],
    structures: [
      'Conventional Ordnance Magazine',
      'Thermobaric Warhead Bunker',
      'Mine Depot',
      'Guided Bomb Storage Vault',
      'Strategic Warhead Reserve',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 14 – Special Operations Structures  (2 subcategories)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Special Operations Structures',
    subCategory: 'Special Forces Bases',
    type: 'ArmyStructure',
    subType: 'Special Forces Base',
    class: 'Advanced',
    subClass: 'Epsilon',
    rank: 'Lieutenant',
    title: 'Special Forces Base',
    baseTier: 45,
    description:
      'Dedicated bases training, housing, and deploying special operations forces.',
    subDescription:
      'Self-contained compounds with classified mission planning centers and rapid-deployment facilities.',
    attributeHints: {
      constructionMaterial: 'Security-Hardened Composite',
      powerRequirement: 400,
      unlockLevel: 35,
      buildTimeHours: 40,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: true,
      orbitalCapable: false,
      supportedSpecializations: ['Special Forces Operator', 'Sniper', 'Demolitions Expert', 'Infiltration Specialist'],
    },
    subjectHints: [
      {
        subject: 'Covert Operations',
        description: 'Plans and executes covert missions behind enemy lines.',
        subDescription: 'Enables sabotage, assassination, and recon missions.',
        details: 'Mission success rate = 40% + (level × 0.3%).',
      },
    ],
    structures: [
      'Special Forces Compound',
      'Commando Training Center',
      'Sniper School & Range',
      'Demolitions Training Area',
      'Infiltration Operations Hub',
    ],
  },
  {
    category: 'Special Operations Structures',
    subCategory: 'Black Operations Facilities',
    type: 'ArmyStructure',
    subType: 'Black Ops Facility',
    class: 'Master',
    subClass: 'Iota',
    rank: 'Colonel',
    title: 'Black Operations Facility',
    baseTier: 80,
    description:
      'Ultra-classified facilities supporting deep-cover operations, counter-intelligence, and denied-area warfare.',
    subDescription:
      'Off-the-books infrastructure with untraceable communication and deniable asset management.',
    attributeHints: {
      constructionMaterial: 'Classified Composite',
      powerRequirement: 1200,
      unlockLevel: 70,
      buildTimeHours: 168,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: true,
      orbitalCapable: true,
      supportedSpecializations: ['Intelligence Officer', 'Counter-Intelligence Specialist', 'Deep Cover Operative'],
    },
    subjectHints: [
      {
        subject: 'Deep Cover Network',
        description: 'Manages a network of deep-cover agents inside enemy territory.',
        subDescription: 'Provides advance warning of enemy strategic movements.',
        details: 'Network size = 5 agents × level.',
      },
      {
        subject: 'Plausible Deniability Operations',
        description: 'Conducts missions that cannot be traced back to the commanding faction.',
        subDescription: 'Reduces diplomatic fallout from covert actions.',
        details: 'Deniability factor = 50% + (level × 0.5%).',
      },
    ],
    structures: [
      'Deniable Asset Warehouse',
      'Counter-Intelligence Analysis Center',
      'Deep Cover Safe House Network',
      'Covert Communications Bunker',
      'Black Operations Command Cell',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 15 – Engineering & Construction Structures  (1 subcategory)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Engineering & Construction Structures',
    subCategory: 'Combat Engineering Depots',
    type: 'ArmyStructure',
    subType: 'Combat Engineering',
    class: 'Standard',
    subClass: 'Gamma',
    rank: 'Corporal',
    title: 'Combat Engineering Depot',
    baseTier: 18,
    description:
      'Central depots storing combat engineering equipment including bridging, demolition, and obstacle-clearing gear.',
    subDescription:
      'Organized bays with bridging sections, earthmoving equipment, and demolitions stores.',
    attributeHints: {
      constructionMaterial: 'Industrial Steel',
      powerRequirement: 90,
      unlockLevel: 10,
      buildTimeHours: 8,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['Combat Engineer', 'Bridge Builder', 'Demolitions Technician'],
    },
    subjectHints: [
      {
        subject: 'Field Engineering',
        description: 'Provides combat engineering support to all ground units.',
        subDescription: 'Enables construction of field fortifications and obstacles.',
        details: 'Engineering output = base × tier × (1 + 0.05 × level).',
      },
    ],
    structures: [
      'Combat Equipment Storage Depot',
      'Field Bridge Equipment Bay',
      'Earthmoving Machine Hangar',
      'Demolitions & Explosives Store',
      'Engineer Support Vehicle Garage',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 16 – Strategic & High Command Structures  (1 subcategory)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Strategic & High Command Structures',
    subCategory: 'High Command Citadels',
    type: 'ArmyStructure',
    subType: 'High Command',
    class: 'Supreme',
    subClass: 'Omega',
    rank: 'General',
    title: 'High Command Citadel',
    baseTier: 95,
    description:
      'Supreme strategic command facility governing all military forces, doctrine, and theater-level operations.',
    subDescription:
      'Blast-proof underground command complex with global communication, AI-assisted planning, and war-game simulations.',
    attributeHints: {
      constructionMaterial: 'Quantum-Reinforced Durasteel',
      powerRequirement: 5000,
      unlockLevel: 90,
      buildTimeHours: 720,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: true,
      supportedSpecializations: ['Supreme Commander', 'Theater Commander', 'Joint Chiefs of Staff'],
    },
    subjectHints: [
      {
        subject: 'Strategic Command',
        description: 'Provides supreme command authority over all military forces.',
        subDescription: 'Grants +20% to all military stats faction-wide.',
        details: 'Command bonus scales: 20% + (level × 0.1%).',
      },
      {
        subject: 'AI-Assisted Battle Planning',
        description: 'Utilizes artificial intelligence for optimal campaign planning.',
        subDescription: 'Identifies optimal attack corridors and force deployments.',
        details: 'AI planning reduces campaign losses by up to 30%.',
      },
    ],
    structures: [
      'Supreme Command Bunker',
      'War Council Chamber',
      'Theater Operations Room',
      'Global Communications Center',
      'Strategic Simulation Complex',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 17 – Orbital & Space Defense Structures  (1 subcategory)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Orbital & Space Defense Structures',
    subCategory: 'Orbital Defense Platforms',
    type: 'ArmyStructure',
    subType: 'Orbital Platform',
    class: 'Supreme',
    subClass: 'Omega',
    rank: 'General',
    title: 'Orbital Defense Platform',
    baseTier: 90,
    description:
      'Orbital weapons platforms providing area denial, precision bombardment, and missile defense.',
    subDescription:
      'Orbital weapons systems coordinated with ground-based radar and command networks.',
    attributeHints: {
      constructionMaterial: 'Space-Grade Alloy',
      powerRequirement: 8000,
      unlockLevel: 80,
      buildTimeHours: 480,
    },
    subAttributeHints: {
      mobile: false,
      camouflageCapable: false,
      orbitalCapable: true,
      supportedSpecializations: ['Orbital Weapons Officer', 'Space Defense Operator', 'Missile Defense Controller'],
    },
    subjectHints: [
      {
        subject: 'Orbital Bombardment',
        description: 'Delivers precision kinetic or energy weapons from orbit.',
        subDescription: 'Strikes any planetary target with minimal warning.',
        details: 'Strike damage = base × tier × (1 + 0.2 × level).',
      },
      {
        subject: 'Planetary Shield',
        description: 'Provides a missile defense umbrella over friendly territory.',
        subDescription: 'Intercepts 60% of incoming ballistic and orbital threats.',
        details: 'Intercept rate improves by 0.5% per level.',
      },
    ],
    structures: [
      'Orbital Weapons Battery',
      'Kinetic Strike Platform',
      'Planetary Shield Generator',
      'Orbital Missile Defense Node',
      'Space Defense Command Station',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORY 18 – Psychological Operations & Morale Structures  (1 subcategory)
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: 'Psychological Operations & Morale Structures',
    subCategory: 'Propaganda & Morale Bureaus',
    type: 'ArmyStructure',
    subType: 'PSYOP Bureau',
    class: 'Standard',
    subClass: 'Delta',
    rank: 'Sergeant',
    title: 'Propaganda & Morale Bureau',
    baseTier: 16,
    description:
      'Psychological operations centers conducting morale warfare, propaganda dissemination, and troop welfare programs.',
    subDescription:
      'Broadcast facilities, printing presses, and welfare service centers.',
    attributeHints: {
      constructionMaterial: 'Standard Construction',
      powerRequirement: 70,
      unlockLevel: 9,
      buildTimeHours: 6,
    },
    subAttributeHints: {
      mobile: true,
      camouflageCapable: false,
      orbitalCapable: false,
      supportedSpecializations: ['PSYOP Specialist', 'Morale Officer', 'Media Analyst'],
    },
    subjectHints: [
      {
        subject: 'Morale Warfare',
        description: 'Conducts psychological operations against enemy forces.',
        subDescription: 'Reduces enemy morale by 5% per bureau tier.',
        details: 'Morale reduction range = 50km × tier.',
      },
      {
        subject: 'Troop Welfare',
        description: 'Provides welfare and recreation services to friendly forces.',
        subDescription: 'Boosts allied unit morale by 8% per bureau level.',
        details: 'Welfare programs require supply allocation from logistics.',
      },
    ],
    structures: [
      'Broadcast & Propaganda Station',
      'Troop Welfare Facility',
      'PSYOP Forward Element',
      'Morale Support Center',
      'Cultural Operations Bureau',
    ],
  },
];

// ============================================================================
// LEVEL PROGRESSION SYSTEM (Levels 1-999)
// ============================================================================

export const ARMY_STRUCTURE_LEVEL_CONFIG = {
  minLevel: 1,
  maxLevel: 999,
  /** Per-level stat scale factor (compound) – matches existing progression system */
  levelScaleFactor: 1.015,
  /** Per-tier stat scale factor (compound) */
  tierScaleFactor: 1.08,
  /** Base capacity for all structures at level 1, tier 1 */
  baseCapacity: 50,
  /** Base structural HP at level 1, tier 1 */
  baseStructureHealth: 1000,
  /** Base defense rating at level 1, tier 1 */
  baseDefense: 10,
  /** Base training speed multiplier at level 1, tier 1 */
  baseTrainingSpeed: 1.0,
  /** Base maintenance cost at level 1, tier 1 */
  baseMaintenanceCost: 100,
  /** Base influence radius (km) at level 1, tier 1 */
  baseInfluenceRadius: 10,
};

/** Converts a category string to a kebab-case upgrade path identifier */
export function generateUpgradePathId(category: string): string {
  return `upgrade-path-${category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

/** Computes scaled stats for a given structure at a specific tier and level */
export function computeArmyStructureStats(
  tier: number,
  level: number,
): ArmyBuildingStats {
  const clampedTier = Math.max(1, Math.min(99, tier));
  const clampedLevel = Math.max(1, Math.min(999, level));

  const tierMultiplier =
    Math.pow(ARMY_STRUCTURE_LEVEL_CONFIG.tierScaleFactor, clampedTier - 1);
  const levelMultiplier =
    Math.pow(ARMY_STRUCTURE_LEVEL_CONFIG.levelScaleFactor, clampedLevel - 1);
  const combined = tierMultiplier * levelMultiplier;

  return {
    capacity: Math.round(ARMY_STRUCTURE_LEVEL_CONFIG.baseCapacity * combined),
    defense: Math.round(ARMY_STRUCTURE_LEVEL_CONFIG.baseDefense * combined),
    trainingSpeed: parseFloat(
      (ARMY_STRUCTURE_LEVEL_CONFIG.baseTrainingSpeed * combined).toFixed(4),
    ),
    // Maintenance scales by sqrt(levelMultiplier) to moderate the exponential
    // growth of levelMultiplier itself, keeping maintenance costs sub-linear
    // with level so high-level structures remain maintainable during gameplay.
    maintenanceCost: Math.round(
      ARMY_STRUCTURE_LEVEL_CONFIG.baseMaintenanceCost * tierMultiplier * Math.sqrt(levelMultiplier),
    ),
    structureHealth: Math.round(
      ARMY_STRUCTURE_LEVEL_CONFIG.baseStructureHealth * combined,
    ),
    // Influence radius scales by sqrt(combined) so the covered area grows
    // linearly with power (area ∝ radius²), preventing quadratic map domination
    // at high tiers and levels.
    influenceRadius: parseFloat(
      (ARMY_STRUCTURE_LEVEL_CONFIG.baseInfluenceRadius * Math.sqrt(combined)).toFixed(2),
    ),
  };
}

/** Computes sub-stats for a structure at a given tier and level */
export function computeArmyStructureSubStats(
  tier: number,
  level: number,
): ArmyBuildingSubStats {
  const clampedTier = Math.max(1, Math.min(99, tier));
  const clampedLevel = Math.max(1, Math.min(999, level));

  const tierMultiplier =
    Math.pow(ARMY_STRUCTURE_LEVEL_CONFIG.tierScaleFactor, clampedTier - 1);
  const levelMultiplier =
    Math.pow(ARMY_STRUCTURE_LEVEL_CONFIG.levelScaleFactor, clampedLevel - 1);

  return {
    trainingXpBonus: Math.round(10 * tierMultiplier * levelMultiplier),
    casualtyReduction: parseFloat(
      Math.min(75, 5 + clampedTier * 0.5 + clampedLevel * 0.02).toFixed(2),
    ),
    moraleBoost: parseFloat(
      Math.min(50, 2 + clampedTier * 0.3 + clampedLevel * 0.01).toFixed(2),
    ),
    supplyEfficiency: parseFloat(
      Math.min(95, 50 + clampedTier * 0.3 + clampedLevel * 0.02).toFixed(2),
    ),
    researchOutput: Math.round(5 * tierMultiplier * levelMultiplier),
    intelligenceCoverage: parseFloat(
      Math.min(100, 10 + clampedTier * 0.5 + clampedLevel * 0.05).toFixed(2),
    ),
  };
}

// ============================================================================
// GENERATED ARCHETYPE CATALOG
// ============================================================================

/** All Army Building Structure archetypes generated from seed families */
export const ARMY_BUILDING_STRUCTURE_ARCHETYPES: ArmyBuildingStructureArchetype[] =
  ARMY_BUILDING_SEED_FAMILIES.flatMap((family, familyIndex) =>
    family.structures.map((structureName, structureIndex) => {
      const idNumber = familyIndex * 5 + structureIndex + 1;
      const tierClass = getArmyStructureTierClass(family.baseTier);

      return {
        id: `army-structure-${String(idNumber).padStart(3, '0')}`,
        name: structureName,
        rank: family.rank,
        title: family.title,
        category: family.category,
        subCategory: family.subCategory,
        type: family.type,
        subType: family.subType,
        class: family.class,
        subClass: family.subClass,
        tier: family.baseTier,
        maxLevel: ARMY_STRUCTURE_LEVEL_CONFIG.maxLevel,
        description: family.description,
        subDescription: family.subDescription,
        baseStats: computeArmyStructureStats(family.baseTier, 1),
        baseSubStats: computeArmyStructureSubStats(family.baseTier, 1),
        attributes: {
          constructionMaterial:
            family.attributeHints.constructionMaterial ?? 'Standard Composite',
          powerRequirement: family.attributeHints.powerRequirement ?? 100,
          unlockLevel: family.attributeHints.unlockLevel ?? 1,
          buildTimeHours: family.attributeHints.buildTimeHours ?? 4,
          maxTier: 99,
          maxLevel: ARMY_STRUCTURE_LEVEL_CONFIG.maxLevel,
        },
        subAttributes: {
          camouflageCapable: family.subAttributeHints.camouflageCapable ?? false,
          mobile: family.subAttributeHints.mobile ?? false,
          orbitalCapable: family.subAttributeHints.orbitalCapable ?? false,
          upgradePathId: generateUpgradePathId(family.category),
          supportedSpecializations:
            family.subAttributeHints.supportedSpecializations ?? [],
          prerequisites: family.subAttributeHints.prerequisites ?? [],
        },
        subjects: family.subjectHints,
      } satisfies ArmyBuildingStructureArchetype;
    }),
  );

// ============================================================================
// GROUPED EXPORTS & META
// ============================================================================

/** Archetypes grouped by category (18 groups) */
export const ARMY_BUILDING_STRUCTURES_BY_CATEGORY = ARMY_BUILDING_STRUCTURE_ARCHETYPES.reduce<
  Record<string, ArmyBuildingStructureArchetype[]>
>((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

/** Archetypes grouped by subcategory (32 groups) */
export const ARMY_BUILDING_STRUCTURES_BY_SUBCATEGORY = ARMY_BUILDING_STRUCTURE_ARCHETYPES.reduce<
  Record<string, ArmyBuildingStructureArchetype[]>
>((acc, item) => {
  if (!acc[item.subCategory]) {
    acc[item.subCategory] = [];
  }
  acc[item.subCategory].push(item);
  return acc;
}, {});

/** Archetypes grouped by tier class */
export const ARMY_BUILDING_STRUCTURES_BY_TIER_CLASS = ARMY_BUILDING_STRUCTURE_ARCHETYPES.reduce<
  Record<string, ArmyBuildingStructureArchetype[]>
>((acc, item) => {
  if (!acc[item.class]) {
    acc[item.class] = [];
  }
  acc[item.class].push(item);
  return acc;
}, {});

/** Meta-summary of the entire Army Building Structures system */
export const ARMY_BUILDING_STRUCTURES_META = {
  totalStructures: ARMY_BUILDING_STRUCTURE_ARCHETYPES.length,
  categories: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.category)),
  ),
  subCategories: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.subCategory)),
  ),
  types: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.type)),
  ),
  subTypes: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.subType)),
  ),
  classes: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.class)),
  ),
  subClasses: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.subClass)),
  ),
  ranks: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.rank)),
  ),
  titles: Array.from(
    new Set(ARMY_BUILDING_STRUCTURE_ARCHETYPES.map((s) => s.title)),
  ),
  tierRange: { min: 1, max: 99 },
  levelRange: { min: 1, max: ARMY_STRUCTURE_LEVEL_CONFIG.maxLevel },
  tierClasses: ARMY_STRUCTURE_TIER_CLASSES.map((tc) => ({
    range: `T${tc.tierMin}-T${tc.tierMax}`,
    class: tc.className,
    subClass: tc.subClassName,
    rank: tc.rank,
    title: tc.title,
  })),
};
