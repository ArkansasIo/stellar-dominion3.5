// Civilian Structures System
// 18 categories, 32 subcategories, tiers 1-99, levels 1-999
// Includes class/subClass, type/subType, names, ranks, titles,
// stats/subStats, descriptions/subDescriptions, attributes/subAttributes,
// subjects/subjectDetails

// ==================== TYPES ====================

export interface CivilianStructureStats {
  population: number;
  happiness: number;
  productivity: number;
  morale: number;
  loyalty: number;
  stability: number;
  growth: number;
  efficiency: number;
}

export interface CivilianStructureSubStats {
  populationGrowthRate: number;
  happinessDecayRate: number;
  productivityBonus: number;
  moraleBonus: number;
  loyaltyBonus: number;
  stabilityBonus: number;
  growthMultiplier: number;
  efficiencyMultiplier: number;
}

export interface CivilianStructureAttributes {
  capacity: number;
  maintenance: number;
  constructionTime: number;
  operationalRange: number;
  serviceQuality: number;
  techRequirement: number;
  energyConsumption: number;
  staffRequired: number;
}

export interface CivilianStructureSubAttributes {
  capacityGrowthPerLevel: number;
  maintenanceReduction: number;
  constructionSpeedBonus: number;
  rangeExpansionPerTier: number;
  qualityBonusPerClass: number;
  techUnlockTier: number;
  energySavingsPerUpgrade: number;
  staffEfficiencyBonus: number;
}

export interface CivilianStructureSubjectDetails {
  loreTitle: string;
  loreDescription: string;
  historicalNote: string;
  culturalSignificance: string;
  operationalDoctrine: string;
}

export interface CivilianStructure {
  id: string;
  name: string;
  rank: string;
  title: string;
  category: CivilianCategory;
  subCategory: CivilianSubCategory;
  type: CivilianType;
  subType: CivilianSubType;
  class: CivilianClass;
  subClass: CivilianSubClass;
  tier: number;
  level: number;
  tierMax: number;
  levelMax: number;
  description: string;
  subDescription: string;
  stats: CivilianStructureStats;
  subStats: CivilianStructureSubStats;
  attributes: CivilianStructureAttributes;
  subAttributes: CivilianStructureSubAttributes;
  subject: string;
  subjectDetails: CivilianStructureSubjectDetails;
  cost: { metal: number; crystal: number; deuterium: number };
  unlockTier: number;
}

// ==================== ENUMS ====================

export type CivilianCategory =
  | 'Residential Housing'
  | 'Commercial District'
  | 'Educational Campus'
  | 'Medical Complex'
  | 'Governmental Center'
  | 'Cultural Hub'
  | 'Transportation Network'
  | 'Agricultural Zone'
  | 'Water Infrastructure'
  | 'Power Grid'
  | 'Communications Tower'
  | 'Law Enforcement'
  | 'Financial District'
  | 'Religious & Philosophical'
  | 'Recreation & Sports'
  | 'Social Services'
  | 'Environmental Management'
  | 'Emergency Response';

export type CivilianSubCategory =
  | 'Basic Housing'
  | 'Luxury Residential'
  | 'Retail Commerce'
  | 'Industrial Commerce'
  | 'Primary Education'
  | 'Advanced Research'
  | 'Emergency Medicine'
  | 'Specialized Treatment'
  | 'City Administration'
  | 'Judicial Services'
  | 'Arts & Museums'
  | 'Entertainment Venues'
  | 'Ground Transit'
  | 'Orbital Transit'
  | 'Food Production'
  | 'Food Processing'
  | 'Clean Water Supply'
  | 'Waste Management'
  | 'Renewable Generation'
  | 'Power Distribution'
  | 'Media Broadcast'
  | 'Data Networks'
  | 'Police Services'
  | 'Security Intelligence'
  | 'Retail Banking'
  | 'Investment Sector'
  | 'Sacred Sites'
  | 'Philosophical Academy'
  | 'Athletic Centers'
  | 'Parks & Gardens'
  | 'Welfare Services'
  | 'Ecological Preservation';

export type CivilianType =
  | 'Shelter'
  | 'Commerce'
  | 'Education'
  | 'Health'
  | 'Governance'
  | 'Culture'
  | 'Transit'
  | 'Agriculture'
  | 'Utilities'
  | 'Security'
  | 'Finance'
  | 'Leisure'
  | 'Welfare'
  | 'Ecology'
  | 'Emergency';

export type CivilianSubType =
  | 'Standard'
  | 'Elevated'
  | 'Specialized'
  | 'Orbital'
  | 'Underground'
  | 'Automated'
  | 'Arcological'
  | 'Mobile'
  | 'Distributed';

export type CivilianClass =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type CivilianSubClass =
  | 'tier-i'
  | 'tier-ii'
  | 'tier-iii'
  | 'tier-iv'
  | 'tier-v'
  | 'tier-vi';

// ==================== RANKS & TITLES ====================

export const CIVILIAN_RANKS: Record<CivilianClass, string> = {
  common: 'Standard',
  uncommon: 'Improved',
  rare: 'Advanced',
  epic: 'Superior',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export const CIVILIAN_SUBCLASS_RANKS: Record<CivilianSubClass, string> = {
  'tier-i': 'Initiate',
  'tier-ii': 'Apprentice',
  'tier-iii': 'Journeyman',
  'tier-iv': 'Expert',
  'tier-v': 'Master',
  'tier-vi': 'Grandmaster',
};

// ==================== TIER CONFIGURATION ====================

export const CIVILIAN_TIER_CONFIG = {
  min: 1,
  max: 99,
  milestones: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
  tierLabels: {
    1: 'Primitive',
    10: 'Basic',
    20: 'Developing',
    30: 'Established',
    40: 'Advanced',
    50: 'Refined',
    60: 'Sophisticated',
    70: 'Elite',
    80: 'Apex',
    90: 'Transcendent',
    99: 'Pinnacle',
  } as Record<number, string>,
};

// ==================== LEVEL CONFIGURATION ====================

export const CIVILIAN_LEVEL_CONFIG = {
  min: 1,
  max: 999,
  breakpoints: [1, 100, 200, 300, 400, 500, 600, 700, 800, 900, 999],
  levelBonusPerBreakpoint: 0.1,
};

// ==================== BASE STAT TEMPLATES ====================

function baseStats(populationMod: number, happinessMod: number): CivilianStructureStats {
  return {
    population: Math.round(100 * populationMod),
    happiness: Math.round(50 * happinessMod),
    productivity: Math.round(60 * populationMod),
    morale: Math.round(40 * happinessMod),
    loyalty: Math.round(30 * happinessMod),
    stability: Math.round(35 * populationMod),
    growth: Math.round(20 * populationMod),
    efficiency: Math.round(25 * happinessMod),
  };
}

function baseSubStats(mod: number): CivilianStructureSubStats {
  return {
    populationGrowthRate: parseFloat((0.01 * mod).toFixed(3)),
    happinessDecayRate: parseFloat((0.005 * mod).toFixed(3)),
    productivityBonus: parseFloat((0.02 * mod).toFixed(3)),
    moraleBonus: parseFloat((0.015 * mod).toFixed(3)),
    loyaltyBonus: parseFloat((0.01 * mod).toFixed(3)),
    stabilityBonus: parseFloat((0.012 * mod).toFixed(3)),
    growthMultiplier: parseFloat((1 + 0.05 * mod).toFixed(3)),
    efficiencyMultiplier: parseFloat((1 + 0.04 * mod).toFixed(3)),
  };
}

function baseAttributes(capacity: number, maintenance: number, energy: number, staff: number): CivilianStructureAttributes {
  return {
    capacity,
    maintenance,
    constructionTime: Math.round(30 + maintenance * 2),
    operationalRange: Math.round(capacity / 50),
    serviceQuality: Math.round(capacity / 10),
    techRequirement: 1,
    energyConsumption: energy,
    staffRequired: staff,
  };
}

function baseSubAttributes(mod: number): CivilianStructureSubAttributes {
  return {
    capacityGrowthPerLevel: Math.round(10 * mod),
    maintenanceReduction: parseFloat((0.005 * mod).toFixed(3)),
    constructionSpeedBonus: parseFloat((0.01 * mod).toFixed(3)),
    rangeExpansionPerTier: Math.round(2 * mod),
    qualityBonusPerClass: Math.round(5 * mod),
    techUnlockTier: Math.round(mod),
    energySavingsPerUpgrade: parseFloat((0.008 * mod).toFixed(3)),
    staffEfficiencyBonus: parseFloat((0.012 * mod).toFixed(3)),
  };
}

// ==================== CLASS MULTIPLIERS ====================

const CLASS_MULTIPLIERS: Record<CivilianClass, number> = {
  common: 1,
  uncommon: 1.5,
  rare: 2.5,
  epic: 5,
  legendary: 10,
  mythic: 20,
};

const CLASS_COST_MULTIPLIERS: Record<CivilianClass, { metal: number; crystal: number; deuterium: number }> = {
  common:    { metal: 1,   crystal: 1,   deuterium: 1   },
  uncommon:  { metal: 2,   crystal: 2,   deuterium: 1.5 },
  rare:      { metal: 5,   crystal: 5,   deuterium: 3   },
  epic:      { metal: 15,  crystal: 15,  deuterium: 8   },
  legendary: { metal: 40,  crystal: 40,  deuterium: 20  },
  mythic:    { metal: 100, crystal: 100, deuterium: 50  },
};

// ==================== SEED DEFINITIONS ====================

interface CivilianSeedFamily {
  category: CivilianCategory;
  subCategory: CivilianSubCategory;
  type: CivilianType;
  subType: CivilianSubType;
  subClass: CivilianSubClass;
  baseName: string;
  description: string;
  subDescription: string;
  subject: string;
  subjectDetails: CivilianStructureSubjectDetails;
  baseCost: { metal: number; crystal: number; deuterium: number };
  populationMod: number;
  happinessMod: number;
  capacity: number;
  maintenance: number;
  energy: number;
  staff: number;
  unlockTier: number;
}

const CIVILIAN_SEED_FAMILIES: CivilianSeedFamily[] = [
  // ── 1. RESIDENTIAL HOUSING ──────────────────────────────────────────
  {
    category: 'Residential Housing', subCategory: 'Basic Housing',
    type: 'Shelter', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Dwelling Block',
    description: 'Compact multi-unit dwelling complex providing basic shelter for the population.',
    subDescription: 'Prefabricated modules stacked in efficient grid patterns to maximize occupancy.',
    subject: 'Population Sheltering',
    subjectDetails: { loreTitle: 'The First Homes', loreDescription: 'Among the earliest structures raised on any colony, dwelling blocks form the backbone of a growing civilization.', historicalNote: 'First deployed in the Age of Expansion, year 204 SE.', culturalSignificance: 'Symbolizes the founding promise: a roof for every citizen.', operationalDoctrine: 'Prioritize density over luxury at founding stage.' },
    baseCost: { metal: 100, crystal: 50, deuterium: 0 },
    populationMod: 1.0, happinessMod: 0.8, capacity: 500, maintenance: 20, energy: 10, staff: 5, unlockTier: 1,
  },
  {
    category: 'Residential Housing', subCategory: 'Luxury Residential',
    type: 'Shelter', subType: 'Elevated', subClass: 'tier-ii',
    baseName: 'Arcology Tower',
    description: 'Self-contained arcological tower integrating residences, greenery, and amenities.',
    subDescription: 'Vertical eco-city capable of sustaining thousands in comfort and style.',
    subject: 'Elite Habitation',
    subjectDetails: { loreTitle: 'Towers of Prosperity', loreDescription: 'Arcologies represent the pinnacle of civilian planning, merging luxury with ecological balance.', historicalNote: 'Pioneered by the Kessler-Yung Institute in year 380 SE.', culturalSignificance: 'Status symbol of advanced colonial achievement.', operationalDoctrine: 'Maximize happiness and stability for the ruling class.' },
    baseCost: { metal: 300, crystal: 200, deuterium: 100 },
    populationMod: 0.8, happinessMod: 1.5, capacity: 300, maintenance: 50, energy: 40, staff: 15, unlockTier: 5,
  },

  // ── 2. COMMERCIAL DISTRICT ──────────────────────────────────────────
  {
    category: 'Commercial District', subCategory: 'Retail Commerce',
    type: 'Commerce', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Market Bazaar',
    description: 'Open-air and enclosed marketplace facilitating local trade and commerce.',
    subDescription: 'Central hub for civilian goods exchange, reducing import reliance.',
    subject: 'Local Trade Operations',
    subjectDetails: { loreTitle: 'The Merchant Quarter', loreDescription: 'Every thriving colony has its marketplace — the heartbeat of local commerce.', historicalNote: 'Traditional market designs adapted for interstellar colonies.', culturalSignificance: 'Economic independence through local trade.', operationalDoctrine: 'Drive self-sufficiency and reduce off-world dependence.' },
    baseCost: { metal: 150, crystal: 100, deuterium: 25 },
    populationMod: 0.6, happinessMod: 1.2, capacity: 400, maintenance: 30, energy: 20, staff: 20, unlockTier: 2,
  },
  {
    category: 'Commercial District', subCategory: 'Industrial Commerce',
    type: 'Commerce', subType: 'Specialized', subClass: 'tier-ii',
    baseName: 'Industrial Trade Hub',
    description: 'Large-scale commercial facility handling bulk industrial goods and contracts.',
    subDescription: 'Connects industrial output to civilian and military supply chains.',
    subject: 'Bulk Trade & Supply',
    subjectDetails: { loreTitle: 'The Industrial Exchange', loreDescription: 'Industrial trade hubs form the nexus between planetary production and galactic markets.', historicalNote: 'Developed alongside the expansion of heavy industry in year 410 SE.', culturalSignificance: 'Economic growth engine for mid-tier colonies.', operationalDoctrine: 'Prioritize throughput and contract diversification.' },
    baseCost: { metal: 400, crystal: 200, deuterium: 100 },
    populationMod: 0.5, happinessMod: 0.9, capacity: 600, maintenance: 60, energy: 50, staff: 40, unlockTier: 10,
  },

  // ── 3. EDUCATIONAL CAMPUS ───────────────────────────────────────────
  {
    category: 'Educational Campus', subCategory: 'Primary Education',
    type: 'Education', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Colony School',
    description: 'Standard educational facility providing foundational knowledge to young citizens.',
    subDescription: 'Curriculum covers science, civics, engineering basics, and colonial history.',
    subject: 'Foundational Learning',
    subjectDetails: { loreTitle: 'The First Classroom', loreDescription: 'Education is the cornerstone of a lasting civilization.', historicalNote: 'Mandatory schooling established by the Colonial Charter of year 150 SE.', culturalSignificance: 'Every great scientist and leader began here.', operationalDoctrine: 'Universal education access across all population tiers.' },
    baseCost: { metal: 200, crystal: 150, deuterium: 50 },
    populationMod: 0.7, happinessMod: 1.1, capacity: 800, maintenance: 40, energy: 25, staff: 30, unlockTier: 1,
  },
  {
    category: 'Educational Campus', subCategory: 'Advanced Research',
    type: 'Education', subType: 'Specialized', subClass: 'tier-iii',
    baseName: 'Research University',
    description: 'Higher education and research institution driving technological advancement.',
    subDescription: 'Trains specialists and conducts applied research for colony development.',
    subject: 'Advanced Learning & Research',
    subjectDetails: { loreTitle: 'Halls of Knowledge', loreDescription: 'Universities are the engine of scientific progress, producing the next generation of innovators.', historicalNote: 'University systems formalized in year 220 SE under the Science Accord.', culturalSignificance: 'Scientific discovery is the highest civic honor.', operationalDoctrine: 'Integrate civilian research with military and industrial R&D.' },
    baseCost: { metal: 600, crystal: 400, deuterium: 200 },
    populationMod: 0.5, happinessMod: 1.3, capacity: 500, maintenance: 80, energy: 60, staff: 50, unlockTier: 15,
  },

  // ── 4. MEDICAL COMPLEX ──────────────────────────────────────────────
  {
    category: 'Medical Complex', subCategory: 'Emergency Medicine',
    type: 'Health', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Field Hospital',
    description: 'Rapid-deployment medical facility for emergency triage and basic care.',
    subDescription: 'Handles trauma, disease outbreaks, and basic surgical needs.',
    subject: 'Emergency Healthcare',
    subjectDetails: { loreTitle: 'The Healers Station', loreDescription: 'No colony survives without medicine. Field hospitals save lives on the frontier.', historicalNote: 'First field hospital protocols established year 180 SE.', culturalSignificance: 'The caduceus symbol represents the covenant of healing.', operationalDoctrine: 'Triage priority: children, specialists, soldiers.' },
    baseCost: { metal: 250, crystal: 200, deuterium: 75 },
    populationMod: 0.9, happinessMod: 1.3, capacity: 600, maintenance: 45, energy: 30, staff: 35, unlockTier: 1,
  },
  {
    category: 'Medical Complex', subCategory: 'Specialized Treatment',
    type: 'Health', subType: 'Specialized', subClass: 'tier-iv',
    baseName: 'Bio-Medical Center',
    description: 'Advanced medical facility with specialized departments for complex treatments.',
    subDescription: 'Handles cybernetic augmentation, gene therapy, and chronic disease management.',
    subject: 'Specialized Healthcare',
    subjectDetails: { loreTitle: 'Medicine of the Stars', loreDescription: 'Interstellar biology demands medical science that transcends the limits of natural evolution.', historicalNote: 'Gene therapy legalized across the colonies in year 350 SE.', culturalSignificance: 'Represents the covenant between science and life itself.', operationalDoctrine: 'Integrate civilian and military medical research pipelines.' },
    baseCost: { metal: 800, crystal: 600, deuterium: 300 },
    populationMod: 0.7, happinessMod: 1.5, capacity: 400, maintenance: 100, energy: 80, staff: 60, unlockTier: 20,
  },

  // ── 5. GOVERNMENTAL CENTER ──────────────────────────────────────────
  {
    category: 'Governmental Center', subCategory: 'City Administration',
    type: 'Governance', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Colonial Hall',
    description: 'Administrative center managing local governance, taxation, and public services.',
    subDescription: 'Houses the colonial council, registry offices, and civic planning departments.',
    subject: 'Civic Administration',
    subjectDetails: { loreTitle: 'The Seat of Power', loreDescription: 'Every colony needs governance. The colonial hall is where policy becomes reality.', historicalNote: 'First colonial halls established year 160 SE.', culturalSignificance: 'The colonial flag flies highest here.', operationalDoctrine: 'Governance efficiency determines resource allocation and public order.' },
    baseCost: { metal: 300, crystal: 250, deuterium: 100 },
    populationMod: 0.5, happinessMod: 1.0, capacity: 1000, maintenance: 60, energy: 40, staff: 40, unlockTier: 5,
  },
  {
    category: 'Governmental Center', subCategory: 'Judicial Services',
    type: 'Governance', subType: 'Specialized', subClass: 'tier-iii',
    baseName: 'Justice Hall',
    description: 'Judicial complex maintaining rule of law, conflict resolution, and civic order.',
    subDescription: 'Includes courts, arbitration chambers, and correctional oversight boards.',
    subject: 'Rule of Law',
    subjectDetails: { loreTitle: 'The Scales of Justice', loreDescription: 'Without law there is only chaos. The justice hall upholds the social contract of the colony.', historicalNote: 'Judicial independence codified in the Colonial Constitution of year 200 SE.', culturalSignificance: 'The blindfolded scales are universally recognized across the stellar colonies.', operationalDoctrine: 'Justice must be swift, fair, and visible to the citizenry.' },
    baseCost: { metal: 400, crystal: 300, deuterium: 150 },
    populationMod: 0.4, happinessMod: 1.2, capacity: 800, maintenance: 70, energy: 35, staff: 45, unlockTier: 10,
  },

  // ── 6. CULTURAL HUB ─────────────────────────────────────────────────
  {
    category: 'Cultural Hub', subCategory: 'Arts & Museums',
    type: 'Culture', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Cultural Center',
    description: 'Multi-purpose arts and culture venue housing galleries, theaters, and archives.',
    subDescription: 'Preserves colonial history while fostering artistic expression and community identity.',
    subject: 'Cultural Identity',
    subjectDetails: { loreTitle: 'The Soul of a Colony', loreDescription: 'Culture distinguishes a colony from a mere outpost. Art and history give meaning to survival.', historicalNote: 'Cultural preservation mandate enacted year 240 SE.', culturalSignificance: 'The arts are the living memory of a civilization.', operationalDoctrine: 'Invest in culture to build cohesion and reduce civil unrest.' },
    baseCost: { metal: 200, crystal: 300, deuterium: 100 },
    populationMod: 0.4, happinessMod: 1.8, capacity: 700, maintenance: 50, energy: 30, staff: 25, unlockTier: 8,
  },
  {
    category: 'Cultural Hub', subCategory: 'Entertainment Venues',
    type: 'Culture', subType: 'Elevated', subClass: 'tier-iii',
    baseName: 'Entertainment Complex',
    description: 'Large-scale entertainment venue featuring holodramas, concerts, and live spectacles.',
    subDescription: 'Combines immersive technology with live performance for maximum citizen engagement.',
    subject: 'Mass Entertainment',
    subjectDetails: { loreTitle: 'The Grand Stage', loreDescription: 'Entertainment is not a luxury — it is the pressure valve that keeps civilization from fracturing.', historicalNote: 'Holodrama networks expanded planet-wide in year 310 SE.', culturalSignificance: 'The most visited structures per capita in any colony.', operationalDoctrine: 'High happiness return per credit invested.' },
    baseCost: { metal: 350, crystal: 400, deuterium: 150 },
    populationMod: 0.3, happinessMod: 2.0, capacity: 1200, maintenance: 80, energy: 70, staff: 50, unlockTier: 12,
  },

  // ── 7. TRANSPORTATION NETWORK ────────────────────────────────────────
  {
    category: 'Transportation Network', subCategory: 'Ground Transit',
    type: 'Transit', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Transit Hub',
    description: 'Centralized ground transportation node connecting key colony districts.',
    subDescription: 'Manages maglev lines, shuttle depots, and pedestrian transit networks.',
    subject: 'Ground Mobility',
    subjectDetails: { loreTitle: 'Roads and Rails', loreDescription: 'Movement is the lifeblood of a colony. Without transit, no district can function at full capacity.', historicalNote: 'Maglev infrastructure standardized across colonies in year 190 SE.', culturalSignificance: 'The transit hub is the crossroads where all citizens meet.', operationalDoctrine: 'Efficient transit reduces productivity loss from commuting.' },
    baseCost: { metal: 300, crystal: 150, deuterium: 50 },
    populationMod: 0.7, happinessMod: 1.1, capacity: 2000, maintenance: 55, energy: 45, staff: 30, unlockTier: 3,
  },
  {
    category: 'Transportation Network', subCategory: 'Orbital Transit',
    type: 'Transit', subType: 'Orbital', subClass: 'tier-iv',
    baseName: 'Orbital Lift Terminal',
    description: 'Space elevator or orbital shuttle terminal enabling civilian access to orbit.',
    subDescription: 'Reduces transport costs and connects planetary populations to orbital habitats.',
    subject: 'Orbital Access',
    subjectDetails: { loreTitle: 'The Bridge to the Stars', loreDescription: 'The orbital lift terminal is the physical embodiment of humanity reaching beyond its cradle.', historicalNote: 'First orbital lifts commissioned year 290 SE.', culturalSignificance: 'The day the first civilian rode to orbit changed everything.', operationalDoctrine: 'Integrate orbital and surface transit for seamless mobility.' },
    baseCost: { metal: 2000, crystal: 1000, deuterium: 500 },
    populationMod: 0.6, happinessMod: 1.4, capacity: 3000, maintenance: 200, energy: 150, staff: 80, unlockTier: 25,
  },

  // ── 8. AGRICULTURAL ZONE ─────────────────────────────────────────────
  {
    category: 'Agricultural Zone', subCategory: 'Food Production',
    type: 'Agriculture', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Hydroponic Farm',
    description: 'Enclosed hydroponic facility producing staple food crops for the colony.',
    subDescription: 'Water-efficient vertical farming maximizes yield in limited planetary space.',
    subject: 'Food Security',
    subjectDetails: { loreTitle: 'The Green Fields', loreDescription: 'Food is power. A colony that cannot feed itself cannot defend itself.', historicalNote: 'Hydroponic farming adapted for interstellar conditions in year 170 SE.', culturalSignificance: 'The harvest festival remains the oldest colonial tradition.', operationalDoctrine: 'Maintain 6-month food reserves at all times.' },
    baseCost: { metal: 150, crystal: 100, deuterium: 25 },
    populationMod: 1.1, happinessMod: 1.0, capacity: 1000, maintenance: 35, energy: 30, staff: 20, unlockTier: 1,
  },
  {
    category: 'Agricultural Zone', subCategory: 'Food Processing',
    type: 'Agriculture', subType: 'Automated', subClass: 'tier-ii',
    baseName: 'Food Processing Plant',
    description: 'Industrial facility converting raw agricultural output into packaged foodstuffs.',
    subDescription: 'Handles preservation, enrichment, and distribution of food to civilian population.',
    subject: 'Food Supply Chain',
    subjectDetails: { loreTitle: 'From Field to Table', loreDescription: 'Food processing transforms raw harvest into the reliable nutrition that sustains colonial life.', historicalNote: 'Automated food processing deployed colony-wide in year 260 SE.', culturalSignificance: 'The end of famine was a civilizational milestone.', operationalDoctrine: 'Minimize waste; maximize caloric yield per unit of raw input.' },
    baseCost: { metal: 350, crystal: 150, deuterium: 75 },
    populationMod: 1.0, happinessMod: 0.9, capacity: 800, maintenance: 45, energy: 55, staff: 30, unlockTier: 6,
  },

  // ── 9. WATER INFRASTRUCTURE ──────────────────────────────────────────
  {
    category: 'Water Infrastructure', subCategory: 'Clean Water Supply',
    type: 'Utilities', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Water Purification Plant',
    description: 'Filtration and purification facility ensuring safe drinking water for civilians.',
    subDescription: 'Multi-stage filtration removes contaminants, radiation, and biological hazards.',
    subject: 'Water Security',
    subjectDetails: { loreTitle: 'The Blue Lifeline', loreDescription: 'Clean water is the most essential resource. No colony prospers without it.', historicalNote: 'Water standards established under the Colonial Health Code of year 155 SE.', culturalSignificance: 'Water is sacred in most colonial cultures.', operationalDoctrine: 'Redundant filtration ensures no single point of failure.' },
    baseCost: { metal: 200, crystal: 100, deuterium: 50 },
    populationMod: 1.2, happinessMod: 1.0, capacity: 1500, maintenance: 40, energy: 35, staff: 15, unlockTier: 1,
  },
  {
    category: 'Water Infrastructure', subCategory: 'Waste Management',
    type: 'Utilities', subType: 'Underground', subClass: 'tier-ii',
    baseName: 'Waste Reclamation Center',
    description: 'Advanced waste processing facility converting refuse into reusable materials.',
    subDescription: 'Handles solid, liquid, and hazardous waste streams with near-zero environmental impact.',
    subject: 'Environmental Waste Control',
    subjectDetails: { loreTitle: 'The Hidden Foundation', loreDescription: 'Waste management is invisible when it works, catastrophic when it fails.', historicalNote: 'Full-cycle reclamation mandated by the Environmental Act of year 280 SE.', culturalSignificance: 'Pollution-free colonies earn the "Green Star" certification.', operationalDoctrine: 'Zero-waste policy: reclaim or neutralize all refuse streams.' },
    baseCost: { metal: 300, crystal: 150, deuterium: 75 },
    populationMod: 0.9, happinessMod: 0.8, capacity: 1200, maintenance: 50, energy: 40, staff: 20, unlockTier: 4,
  },

  // ── 10. POWER GRID ───────────────────────────────────────────────────
  {
    category: 'Power Grid', subCategory: 'Renewable Generation',
    type: 'Utilities', subType: 'Distributed', subClass: 'tier-ii',
    baseName: 'Civilian Solar Array',
    description: 'Distributed solar generation system providing clean power to civilian districts.',
    subDescription: 'Modular photovoltaic arrays integrated into building surfaces and open terrain.',
    subject: 'Renewable Energy Access',
    subjectDetails: { loreTitle: 'Power for All', loreDescription: 'Renewable energy is the foundation of a self-sufficient colony.', historicalNote: 'Universal power access achieved in year 210 SE.', culturalSignificance: 'Energy independence is a source of colonial pride.', operationalDoctrine: 'Prioritize local generation to reduce grid dependency.' },
    baseCost: { metal: 200, crystal: 100, deuterium: 0 },
    populationMod: 0.8, happinessMod: 1.0, capacity: 2000, maintenance: 30, energy: -50, staff: 10, unlockTier: 2,
  },
  {
    category: 'Power Grid', subCategory: 'Power Distribution',
    type: 'Utilities', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Power Distribution Node',
    description: 'Smart grid distribution node balancing power load across civilian districts.',
    subDescription: 'AI-managed load balancing prevents brownouts and surge failures.',
    subject: 'Power Grid Management',
    subjectDetails: { loreTitle: 'The Grid Keeper', loreDescription: 'Distribution efficiency determines the effective use of all generated power.', historicalNote: 'Smart grid AI deployed colony-wide in year 320 SE.', culturalSignificance: 'Stable power is taken for granted — until it is gone.', operationalDoctrine: 'Redundancy at every node: no single failure cascades to the whole grid.' },
    baseCost: { metal: 250, crystal: 200, deuterium: 50 },
    populationMod: 0.8, happinessMod: 0.9, capacity: 3000, maintenance: 40, energy: -20, staff: 15, unlockTier: 5,
  },

  // ── 11. COMMUNICATIONS TOWER ─────────────────────────────────────────
  {
    category: 'Communications Tower', subCategory: 'Media Broadcast',
    type: 'Governance', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Broadcast Station',
    description: 'Planetary broadcast facility delivering news, entertainment, and emergency alerts.',
    subDescription: 'Reaches all habitable zones with audio-visual transmissions.',
    subject: 'Mass Communications',
    subjectDetails: { loreTitle: 'The Voice of the Colony', loreDescription: 'Broadcast stations unify scattered settlements into a coherent civic community.', historicalNote: 'Colonial broadcasting network completed year 200 SE.', culturalSignificance: 'The evening broadcast is a universal colonial ritual.', operationalDoctrine: 'Maintain independent broadcast during all emergency scenarios.' },
    baseCost: { metal: 150, crystal: 200, deuterium: 50 },
    populationMod: 0.4, happinessMod: 1.3, capacity: 5000, maintenance: 35, energy: 25, staff: 20, unlockTier: 3,
  },
  {
    category: 'Communications Tower', subCategory: 'Data Networks',
    type: 'Governance', subType: 'Distributed', subClass: 'tier-iii',
    baseName: 'Quantum Data Hub',
    description: 'High-capacity quantum data relay center supporting colony-wide digital infrastructure.',
    subDescription: 'Enables encrypted communications, AI services, and real-time logistics coordination.',
    subject: 'Digital Infrastructure',
    subjectDetails: { loreTitle: 'The Digital Spine', loreDescription: 'Data networks are the nervous system of a modern colony.', historicalNote: 'Quantum encryption standardized in year 340 SE.', culturalSignificance: 'Digital access is a fundamental citizen right.', operationalDoctrine: 'Secure, fast, and universally accessible data services for all citizens.' },
    baseCost: { metal: 300, crystal: 500, deuterium: 200 },
    populationMod: 0.5, happinessMod: 1.4, capacity: 10000, maintenance: 60, energy: 55, staff: 25, unlockTier: 15,
  },

  // ── 12. LAW ENFORCEMENT ──────────────────────────────────────────────
  {
    category: 'Law Enforcement', subCategory: 'Police Services',
    type: 'Security', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Precinct Station',
    description: 'Local law enforcement facility maintaining civic order and public safety.',
    subDescription: 'Houses patrol units, investigators, and community liaison officers.',
    subject: 'Public Safety',
    subjectDetails: { loreTitle: 'Guardians of Order', loreDescription: 'Without law enforcement, civilization dissolves into tribalism and violence.', historicalNote: 'Colonial police codes established year 165 SE.', culturalSignificance: 'The precinct badge is a symbol of civic responsibility.', operationalDoctrine: 'Presence deters crime; rapid response minimizes harm.' },
    baseCost: { metal: 200, crystal: 150, deuterium: 50 },
    populationMod: 0.5, happinessMod: 1.1, capacity: 800, maintenance: 50, energy: 30, staff: 40, unlockTier: 2,
  },
  {
    category: 'Law Enforcement', subCategory: 'Security Intelligence',
    type: 'Security', subType: 'Specialized', subClass: 'tier-iv',
    baseName: 'Intelligence Bureau',
    description: 'Civilian intelligence agency monitoring internal threats and colonial security.',
    subDescription: 'Conducts counterintelligence, threat analysis, and protective surveillance operations.',
    subject: 'Internal Security',
    subjectDetails: { loreTitle: 'Eyes and Ears', loreDescription: 'No colony is safe from enemies within. Intelligence keeps threats visible before they become catastrophes.', historicalNote: 'Colonial security intelligence formalized year 250 SE.', culturalSignificance: 'Trust and vigilance must coexist for a secure society.', operationalDoctrine: 'Intelligence-led prevention over reactive enforcement.' },
    baseCost: { metal: 500, crystal: 400, deuterium: 200 },
    populationMod: 0.3, happinessMod: 1.0, capacity: 500, maintenance: 80, energy: 50, staff: 60, unlockTier: 20,
  },

  // ── 13. FINANCIAL DISTRICT ───────────────────────────────────────────
  {
    category: 'Financial District', subCategory: 'Retail Banking',
    type: 'Finance', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Colonial Bank',
    description: 'Public banking institution providing savings, loans, and payment services to citizens.',
    subDescription: 'Stabilizes local economy through credit provision and currency management.',
    subject: 'Financial Services',
    subjectDetails: { loreTitle: 'The Vault of Prosperity', loreDescription: 'Financial stability underpins every other aspect of colonial growth.', historicalNote: 'Colonial banking system standardized in year 230 SE.', culturalSignificance: 'The bank vault is the symbol of colonial permanence.', operationalDoctrine: 'Provide universal financial access to ensure economic participation.' },
    baseCost: { metal: 300, crystal: 200, deuterium: 100 },
    populationMod: 0.6, happinessMod: 1.2, capacity: 900, maintenance: 55, energy: 35, staff: 35, unlockTier: 5,
  },
  {
    category: 'Financial District', subCategory: 'Investment Sector',
    type: 'Finance', subType: 'Specialized', subClass: 'tier-iv',
    baseName: 'Investment Exchange',
    description: 'Advanced financial market facilitating colonial investment, trade bonds, and capital flows.',
    subDescription: 'Enables long-term investment instruments that fund infrastructure and research.',
    subject: 'Capital Markets',
    subjectDetails: { loreTitle: 'Where Capital Flows', loreDescription: 'Investment drives the long-term growth of the colony beyond its initial survival phase.', historicalNote: 'First colonial exchanges opened year 330 SE.', culturalSignificance: 'Investment culture transforms citizens into stakeholders of the colony.', operationalDoctrine: 'Channel excess capital into productive infrastructure development.' },
    baseCost: { metal: 600, crystal: 500, deuterium: 300 },
    populationMod: 0.4, happinessMod: 1.0, capacity: 700, maintenance: 90, energy: 55, staff: 45, unlockTier: 20,
  },

  // ── 14. RELIGIOUS & PHILOSOPHICAL ────────────────────────────────────
  {
    category: 'Religious & Philosophical', subCategory: 'Sacred Sites',
    type: 'Culture', subType: 'Elevated', subClass: 'tier-ii',
    baseName: 'Sacred Shrine',
    description: 'Multi-faith sacred space providing spiritual sanctuary to colonial citizens.',
    subDescription: 'Neutral ground for all beliefs, promoting tolerance and spiritual well-being.',
    subject: 'Spiritual Welfare',
    subjectDetails: { loreTitle: 'The Sacred Ground', loreDescription: 'Even among the stars, humanity seeks the transcendent.', historicalNote: 'Multi-faith policy adopted colony-wide in year 270 SE.', culturalSignificance: 'Sacred sites reduce social tension and promote cohesion.', operationalDoctrine: 'Neutrality: sacred sites serve all beliefs equally.' },
    baseCost: { metal: 150, crystal: 250, deuterium: 50 },
    populationMod: 0.3, happinessMod: 1.6, capacity: 600, maintenance: 30, energy: 15, staff: 15, unlockTier: 3,
  },
  {
    category: 'Religious & Philosophical', subCategory: 'Philosophical Academy',
    type: 'Culture', subType: 'Specialized', subClass: 'tier-iii',
    baseName: 'Philosophy Institute',
    description: 'Center for philosophical inquiry, ethical debate, and societal reflection.',
    subDescription: 'Trains civic leaders, ethicists, and advisors who shape colonial policy.',
    subject: 'Civic Philosophy',
    subjectDetails: { loreTitle: 'The Examined Life', loreDescription: 'Philosophy is the compass that keeps a civilization from losing its way in the stars.', historicalNote: 'Civic philosophy curriculum mandated in year 300 SE.', culturalSignificance: 'Philosophical consensus prevents ideological fragmentation.', operationalDoctrine: 'Guide policy through ethical frameworks and long-term thinking.' },
    baseCost: { metal: 200, crystal: 300, deuterium: 100 },
    populationMod: 0.3, happinessMod: 1.4, capacity: 400, maintenance: 40, energy: 20, staff: 20, unlockTier: 10,
  },

  // ── 15. RECREATION & SPORTS ───────────────────────────────────────────
  {
    category: 'Recreation & Sports', subCategory: 'Athletic Centers',
    type: 'Leisure', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Sports Arena',
    description: 'Multi-purpose sports facility hosting athletic competitions and physical training.',
    subDescription: 'Serves both professional leagues and civilian recreational fitness programs.',
    subject: 'Athletic Culture',
    subjectDetails: { loreTitle: 'The Arena of Champions', loreDescription: 'Sport is the healthy outlet for competitive drive that would otherwise manifest as conflict.', historicalNote: 'Colonial games first held in year 210 SE.', culturalSignificance: 'Athletic heroes are the most celebrated figures in colonial culture.', operationalDoctrine: 'Sports reduce aggression and build community cohesion.' },
    baseCost: { metal: 250, crystal: 150, deuterium: 50 },
    populationMod: 0.5, happinessMod: 1.5, capacity: 1500, maintenance: 45, energy: 40, staff: 30, unlockTier: 4,
  },
  {
    category: 'Recreation & Sports', subCategory: 'Parks & Gardens',
    type: 'Leisure', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Civic Park',
    description: 'Open green space providing natural respite, biodiversity, and recreational opportunity.',
    subDescription: 'Incorporates local flora, walking paths, picnic areas, and community events.',
    subject: 'Natural Wellness',
    subjectDetails: { loreTitle: 'The Green Sanctuary', loreDescription: 'Nature, even simulated, is essential to human psychological health in interstellar environments.', historicalNote: 'Green space mandates enacted in year 220 SE.', culturalSignificance: 'Parks are where citizens remember that life is more than work and war.', operationalDoctrine: 'Maintain 15% green coverage in all civilian districts.' },
    baseCost: { metal: 100, crystal: 100, deuterium: 25 },
    populationMod: 0.4, happinessMod: 1.4, capacity: 2000, maintenance: 25, energy: 10, staff: 10, unlockTier: 2,
  },

  // ── 16. SOCIAL SERVICES ───────────────────────────────────────────────
  {
    category: 'Social Services', subCategory: 'Welfare Services',
    type: 'Welfare', subType: 'Standard', subClass: 'tier-i',
    baseName: 'Welfare Office',
    description: 'Social support facility providing aid, counseling, and resources to vulnerable citizens.',
    subDescription: 'Distributes food assistance, housing aid, and retraining programs.',
    subject: 'Social Safety Net',
    subjectDetails: { loreTitle: 'The Safety Net', loreDescription: 'A colony is only as strong as how it treats its most vulnerable.', historicalNote: 'Colonial welfare system founded year 175 SE.', culturalSignificance: 'The welfare office symbolizes the social contract between citizen and state.', operationalDoctrine: 'Prevent destitution; maintain dignity for all citizens.' },
    baseCost: { metal: 150, crystal: 100, deuterium: 25 },
    populationMod: 0.8, happinessMod: 1.2, capacity: 700, maintenance: 35, energy: 20, staff: 25, unlockTier: 2,
  },

  // ── 17. ENVIRONMENTAL MANAGEMENT ─────────────────────────────────────
  {
    category: 'Environmental Management', subCategory: 'Ecological Preservation',
    type: 'Ecology', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Ecological Reserve',
    description: 'Protected biome reserve maintaining native ecosystem health and biodiversity.',
    subDescription: 'Combines conservation science with public education about planetary ecology.',
    subject: 'Ecosystem Stewardship',
    subjectDetails: { loreTitle: 'The Living World', loreDescription: 'Colonists who destroy their planet\'s ecology doom their own descendants.', historicalNote: 'Planetary preservation law enacted year 295 SE.', culturalSignificance: 'The ecological reserve is a covenant with the planet itself.', operationalDoctrine: 'Conservation first: development must not permanently damage the biosphere.' },
    baseCost: { metal: 200, crystal: 200, deuterium: 100 },
    populationMod: 0.5, happinessMod: 1.3, capacity: 3000, maintenance: 45, energy: 20, staff: 20, unlockTier: 8,
  },

  // ── 18. EMERGENCY RESPONSE ────────────────────────────────────────────
  {
    category: 'Emergency Response', subCategory: 'Welfare Services',
    type: 'Emergency', subType: 'Standard', subClass: 'tier-ii',
    baseName: 'Emergency Response Center',
    description: 'Centralized command facility coordinating disaster response and civil emergencies.',
    subDescription: 'Integrates fire, rescue, medical, and hazmat response into a unified command system.',
    subject: 'Disaster Management',
    subjectDetails: { loreTitle: 'When Crisis Strikes', loreDescription: 'Every colony faces disaster. The emergency center determines whether the colony survives.', historicalNote: 'Unified emergency command established year 195 SE.', culturalSignificance: 'First responders are revered as civilian heroes.', operationalDoctrine: 'Prepare for every contingency; respond in under 4 minutes.' },
    baseCost: { metal: 350, crystal: 250, deuterium: 100 },
    populationMod: 0.8, happinessMod: 1.2, capacity: 1000, maintenance: 65, energy: 50, staff: 50, unlockTier: 5,
  },
];

// ==================== CLASS LABEL HELPERS ====================

const CLASS_PREFIXES: Record<CivilianClass, string> = {
  common: 'Basic',
  uncommon: 'Improved',
  rare: 'Advanced',
  epic: 'Superior',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const CLASS_TITLE_SUFFIXES: Record<CivilianClass, string> = {
  common: 'Grade I',
  uncommon: 'Grade II',
  rare: 'Grade III',
  epic: 'Grade IV',
  legendary: 'Grade V',
  mythic: 'Grade VI',
};

// ==================== GENERATION ====================

function generateCivilianStructure(
  family: CivilianSeedFamily,
  civClass: CivilianClass,
  index: number,
): CivilianStructure {
  const cm = CLASS_MULTIPLIERS[civClass];
  const costM = CLASS_COST_MULTIPLIERS[civClass];
  const prefix = CLASS_PREFIXES[civClass];

  return {
    id: `civ-struct-${String(index).padStart(3, '0')}-${civClass}`,
    name: `${prefix} ${family.baseName}`,
    rank: CIVILIAN_RANKS[civClass],
    title: `${family.baseName} — ${CLASS_TITLE_SUFFIXES[civClass]}`,
    category: family.category,
    subCategory: family.subCategory,
    type: family.type,
    subType: family.subType,
    class: civClass,
    subClass: family.subClass,
    tier: 1,
    level: 1,
    tierMax: CIVILIAN_TIER_CONFIG.max,
    levelMax: CIVILIAN_LEVEL_CONFIG.max,
    description: family.description,
    subDescription: family.subDescription,
    stats: baseStats(family.populationMod * cm, family.happinessMod * cm),
    subStats: baseSubStats(cm),
    attributes: baseAttributes(
      Math.round(family.capacity * cm),
      Math.round(family.maintenance * cm),
      Math.round(family.energy * cm),
      Math.round(family.staff * cm),
    ),
    subAttributes: baseSubAttributes(cm),
    subject: family.subject,
    subjectDetails: family.subjectDetails,
    cost: {
      metal: Math.round(family.baseCost.metal * costM.metal),
      crystal: Math.round(family.baseCost.crystal * costM.crystal),
      deuterium: Math.round(family.baseCost.deuterium * costM.deuterium),
    },
    unlockTier: family.unlockTier,
  };
}

const CIVILIAN_CLASSES: CivilianClass[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const CIVILIAN_STRUCTURES: CivilianStructure[] = CIVILIAN_SEED_FAMILIES.flatMap(
  (family, fi) =>
    CIVILIAN_CLASSES.map((civClass) => generateCivilianStructure(family, civClass, fi + 1)),
);

// ==================== LOOKUP HELPERS ====================

export function getCivilianStructuresByCategory(category: CivilianCategory): CivilianStructure[] {
  return CIVILIAN_STRUCTURES.filter((s) => s.category === category);
}

export function getCivilianStructuresBySubCategory(subCategory: CivilianSubCategory): CivilianStructure[] {
  return CIVILIAN_STRUCTURES.filter((s) => s.subCategory === subCategory);
}

export function getCivilianStructuresByClass(civClass: CivilianClass): CivilianStructure[] {
  return CIVILIAN_STRUCTURES.filter((s) => s.class === civClass);
}

export function getCivilianStructuresByTierRange(min: number, max: number): CivilianStructure[] {
  return CIVILIAN_STRUCTURES.filter((s) => s.unlockTier >= min && s.unlockTier <= max);
}

export function getCivilianStructureById(id: string): CivilianStructure | undefined {
  return CIVILIAN_STRUCTURES.find((s) => s.id === id);
}

// ==================== METADATA ====================

export const CIVILIAN_STRUCTURES_META = {
  total: CIVILIAN_STRUCTURES.length,
  categories: Array.from(new Set(CIVILIAN_STRUCTURES.map((s) => s.category))) as CivilianCategory[],
  subCategories: Array.from(new Set(CIVILIAN_STRUCTURES.map((s) => s.subCategory))) as CivilianSubCategory[],
  types: Array.from(new Set(CIVILIAN_STRUCTURES.map((s) => s.type))) as CivilianType[],
  subTypes: Array.from(new Set(CIVILIAN_STRUCTURES.map((s) => s.subType))) as CivilianSubType[],
  classes: CIVILIAN_CLASSES,
  subClasses: Array.from(new Set(CIVILIAN_STRUCTURES.map((s) => s.subClass))) as CivilianSubClass[],
  tierRange: { min: CIVILIAN_TIER_CONFIG.min, max: CIVILIAN_TIER_CONFIG.max },
  levelRange: { min: CIVILIAN_LEVEL_CONFIG.min, max: CIVILIAN_LEVEL_CONFIG.max },
  categoryCount: 18,
  subCategoryCount: 32,
};
