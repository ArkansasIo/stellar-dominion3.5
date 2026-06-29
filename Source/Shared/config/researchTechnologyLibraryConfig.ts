/**
 * Research & Technology Library Configuration
 * Comprehensive research and technology progression system with 18 categories,
 * 32 sub-categories, 99 tiers, and 999 levels
 * @tag #research #technology #progression #library #stats
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ResearchTechCategory =
  | 'fundamental-sciences'
  | 'applied-engineering'
  | 'energy-power-systems'
  | 'materials-science'
  | 'propulsion-navigation'
  | 'weapons-ordnance'
  | 'defense-shielding'
  | 'computing-ai'
  | 'biological-sciences'
  | 'medical-life-sciences'
  | 'dimensional-physics'
  | 'quantum-mechanics'
  | 'stellar-astrophysics'
  | 'planetary-environmental'
  | 'social-economic'
  | 'military-tactics'
  | 'espionage-intelligence'
  | 'xenobiology-alien';

export type ResearchTechSubCategory =
  // Fundamental Sciences (2)
  | 'theoretical-physics'
  | 'applied-mathematics'
  // Applied Engineering (2)
  | 'structural-engineering'
  | 'systems-engineering'
  // Energy & Power Systems (2)
  | 'fusion-energy'
  | 'zero-point-energy'
  // Materials Science (2)
  | 'advanced-alloys'
  | 'nanomaterials'
  // Propulsion & Navigation (2)
  | 'sublight-drives'
  | 'ftl-drives'
  // Weapons & Ordnance (2)
  | 'kinetic-weapons'
  | 'energy-weapons'
  // Defense & Shielding (2)
  | 'armor-systems'
  | 'shield-technology'
  // Computing & AI (2)
  | 'neural-networks'
  | 'quantum-computing'
  // Biological Sciences (2)
  | 'genetic-engineering'
  | 'synthetic-biology'
  // Medical & Life Sciences (2)
  | 'cybernetics'
  | 'regenerative-medicine'
  // Dimensional Physics (1)
  | 'wormhole-theory'
  // Quantum Mechanics (1)
  | 'quantum-entanglement'
  // Stellar & Astrophysics (2)
  | 'star-harvesting'
  | 'dark-matter-research'
  // Planetary & Environmental Sciences (2)
  | 'terraforming'
  | 'climate-engineering'
  // Social & Economic Sciences (1)
  | 'economic-models'
  // Military Tactics & Strategy (2)
  | 'combat-doctrine'
  | 'strategic-planning'
  // Espionage & Intelligence (2)
  | 'signals-intelligence'
  | 'covert-operations'
  // Xenobiology & Alien Studies (2)
  | 'xenoarchaeology'
  | 'xenobiology';

export type ResearchTechType =
  | 'theoretical'
  | 'experimental'
  | 'applied'
  | 'military'
  | 'industrial'
  | 'exotic'
  | 'classified';

export type ResearchTechSubType =
  | 'fundamental'
  | 'advanced'
  | 'prototype'
  | 'classified'
  | 'experimental'
  | 'legacy'
  | 'cutting-edge'
  | 'forbidden'
  | 'ancient'
  | 'reverse-engineered'
  | 'collaborative'
  | 'autonomous'
  | 'quantum'
  | 'dimensional'
  | 'biological'
  | 'cybernetic'
  | 'strategic'
  | 'covert'
  | 'xenological'
  | 'stellar';

export type ResearchTechClass =
  | 'Foundational'
  | 'Novice'
  | 'Apprentice'
  | 'Advanced'
  | 'Expert'
  | 'Master'
  | 'Grandmaster'
  | 'Legendary'
  | 'Mythic'
  | 'Transcendent';

export type ResearchTechSubClass =
  | 'theoretical'
  | 'applied'
  | 'hybrid'
  | 'experimental'
  | 'classified'
  | 'autonomous'
  | 'xenological';

export interface ResearchTechStats {
  researchPower: number;
  innovationRate: number;
  breakthroughChance: number;
  knowledgeRetention: number;
  efficiency: number;
  complexity: number;
  reliability: number;
  scalability: number;
}

export interface ResearchTechSubStats {
  theoreticalDepth: number;
  practicalApplication: number;
  collaborationBonus: number;
  automationLevel: number;
  dataProcessing: number;
  experimentalYield: number;
  crossDisciplinaryBonus: number;
  discoveryMultiplier: number;
}

export interface ResearchTechAttributes {
  techLevel: number;
  civilizationImpact: number;
  militaryValue: number;
  economicValue: number;
  diplomaticValue: number;
  ethicalRisk: number;
  requiredInfrastructure: number;
  researchCost: number;
}

export interface ResearchTechSubAttributes {
  prerequisiteComplexity: number;
  interdisciplinaryLinks: number;
  applicationBreadth: number;
  knowledgeDecay: number;
  replicationDifficulty: number;
  counterMeasureResistance: number;
  scalingPotential: number;
  legacyCompatibility: number;
}

export interface ResearchTechSubject {
  loreTitle: string;
  loreDescription: string;
  historicalNote: string;
  culturalSignificance: string;
  operationalDoctrine: string;
}

export interface ResearchTechTier {
  tier: number;
  tierClass: ResearchTechClass;
  tierSubClass: ResearchTechSubClass;
  rank: string;
  title: string;
  stats: ResearchTechStats;
  subStats: ResearchTechSubStats;
  description: string;
  subDescription: string;
  attributes: ResearchTechAttributes;
  subAttributes: ResearchTechSubAttributes;
  subject: ResearchTechSubject;
}

export interface ResearchTechLevel {
  level: number;
  xpRequired: number;
  totalXpRequired: number;
  tierUnlock: number;
  rewards: {
    researchPoints: number;
    knowledgeFragments: number;
    specialUnlock?: string;
  };
  milestoneDescription?: string;
}

export interface ResearchTechRecord {
  id: string;
  name: string;
  category: ResearchTechCategory;
  subCategory: ResearchTechSubCategory;
  type: ResearchTechType;
  subType: ResearchTechSubType;
  tier: number;
  level: number;
  description: string;
  subDescription: string;
  stats: ResearchTechStats;
  subStats: ResearchTechSubStats;
  attributes: ResearchTechAttributes;
  subAttributes: ResearchTechSubAttributes;
  subject: ResearchTechSubject;
  prerequisites: string[];
  unlocks: string[];
  tags: string[];
}

// ============================================================================
// CATEGORIES (18)
// ============================================================================

export const RESEARCH_TECH_CATEGORIES = [
  {
    id: 'fundamental-sciences' as ResearchTechCategory,
    name: 'Fundamental Sciences',
    description: 'The bedrock of all scientific knowledge - physics, mathematics, and theoretical frameworks',
    icon: 'atom',
    order: 1,
    color: '#60A5FA',
  },
  {
    id: 'applied-engineering' as ResearchTechCategory,
    name: 'Applied Engineering',
    description: 'Practical engineering disciplines that translate theory into functional systems',
    icon: 'wrench',
    order: 2,
    color: '#F59E0B',
  },
  {
    id: 'energy-power-systems' as ResearchTechCategory,
    name: 'Energy & Power Systems',
    description: 'Advanced energy generation, storage, and distribution technologies',
    icon: 'bolt',
    order: 3,
    color: '#FCD34D',
  },
  {
    id: 'materials-science' as ResearchTechCategory,
    name: 'Materials Science',
    description: 'Research into exotic alloys, nanomaterials, and advanced composites',
    icon: 'hexagon',
    order: 4,
    color: '#6EE7B7',
  },
  {
    id: 'propulsion-navigation' as ResearchTechCategory,
    name: 'Propulsion & Navigation',
    description: 'Technologies for interstellar travel, FTL drives, and navigation systems',
    icon: 'rocket',
    order: 5,
    color: '#818CF8',
  },
  {
    id: 'weapons-ordnance' as ResearchTechCategory,
    name: 'Weapons & Ordnance',
    description: 'Military weapons research including kinetic, energy, and exotic armaments',
    icon: 'crosshairs',
    order: 6,
    color: '#F87171',
  },
  {
    id: 'defense-shielding' as ResearchTechCategory,
    name: 'Defense & Shielding',
    description: 'Armor systems, shield technology, and defensive countermeasures',
    icon: 'shield',
    order: 7,
    color: '#34D399',
  },
  {
    id: 'computing-ai' as ResearchTechCategory,
    name: 'Computing & Artificial Intelligence',
    description: 'Neural networks, quantum computing, and advanced AI systems',
    icon: 'cpu',
    order: 8,
    color: '#A78BFA',
  },
  {
    id: 'biological-sciences' as ResearchTechCategory,
    name: 'Biological Sciences & Genetics',
    description: 'Genetic engineering, synthetic biology, and life manipulation',
    icon: 'dna',
    order: 9,
    color: '#4ADE80',
  },
  {
    id: 'medical-life-sciences' as ResearchTechCategory,
    name: 'Medical & Life Sciences',
    description: 'Cybernetics, regenerative medicine, and life extension technologies',
    icon: 'heart',
    order: 10,
    color: '#FB7185',
  },
  {
    id: 'dimensional-physics' as ResearchTechCategory,
    name: 'Dimensional Physics',
    description: 'Wormhole theory, dimensional rifts, and spatial manipulation',
    icon: 'portal',
    order: 11,
    color: '#E879F9',
  },
  {
    id: 'quantum-mechanics' as ResearchTechCategory,
    name: 'Quantum Mechanics',
    description: 'Quantum entanglement, field theory, and subatomic phenomena',
    icon: 'wave',
    order: 12,
    color: '#38BDF8',
  },
  {
    id: 'stellar-astrophysics' as ResearchTechCategory,
    name: 'Stellar & Astrophysics',
    description: 'Star harvesting, dark matter research, and cosmological studies',
    icon: 'star',
    order: 13,
    color: '#FDE68A',
  },
  {
    id: 'planetary-environmental' as ResearchTechCategory,
    name: 'Planetary & Environmental Sciences',
    description: 'Terraforming, climate engineering, and planetary management',
    icon: 'globe',
    order: 14,
    color: '#86EFAC',
  },
  {
    id: 'social-economic' as ResearchTechCategory,
    name: 'Social & Economic Sciences',
    description: 'Economic models, social engineering, and civilization management',
    icon: 'chart',
    order: 15,
    color: '#FCA5A5',
  },
  {
    id: 'military-tactics' as ResearchTechCategory,
    name: 'Military Tactics & Strategy',
    description: 'Combat doctrine, strategic planning, and military optimization',
    icon: 'sword',
    order: 16,
    color: '#EF4444',
  },
  {
    id: 'espionage-intelligence' as ResearchTechCategory,
    name: 'Espionage & Intelligence',
    description: 'Signals intelligence, covert operations, and information warfare',
    icon: 'eye',
    order: 17,
    color: '#6B7280',
  },
  {
    id: 'xenobiology-alien' as ResearchTechCategory,
    name: 'Xenobiology & Alien Studies',
    description: 'Xenoarchaeology, xenobiology, and alien civilization research',
    icon: 'alien',
    order: 18,
    color: '#A3E635',
  },
] as const;

// ============================================================================
// SUB-CATEGORIES (32)
// ============================================================================

export const RESEARCH_TECH_SUBCATEGORIES = [
  // Fundamental Sciences (2)
  {
    id: 'theoretical-physics' as ResearchTechSubCategory,
    category: 'fundamental-sciences' as ResearchTechCategory,
    name: 'Theoretical Physics',
    description: 'Mathematical models and theories that underpin universal laws',
    order: 1,
  },
  {
    id: 'applied-mathematics' as ResearchTechSubCategory,
    category: 'fundamental-sciences' as ResearchTechCategory,
    name: 'Applied Mathematics',
    description: 'Mathematical tools applied to engineering and scientific computation',
    order: 2,
  },
  // Applied Engineering (2)
  {
    id: 'structural-engineering' as ResearchTechSubCategory,
    category: 'applied-engineering' as ResearchTechCategory,
    name: 'Structural Engineering',
    description: 'Design and analysis of load-bearing structures and megascale constructions',
    order: 3,
  },
  {
    id: 'systems-engineering' as ResearchTechSubCategory,
    category: 'applied-engineering' as ResearchTechCategory,
    name: 'Systems Engineering',
    description: 'Holistic integration of complex multi-component systems',
    order: 4,
  },
  // Energy & Power Systems (2)
  {
    id: 'fusion-energy' as ResearchTechSubCategory,
    category: 'energy-power-systems' as ResearchTechCategory,
    name: 'Fusion Energy',
    description: 'Controlled nuclear fusion for near-limitless power generation',
    order: 5,
  },
  {
    id: 'zero-point-energy' as ResearchTechSubCategory,
    category: 'energy-power-systems' as ResearchTechCategory,
    name: 'Zero-Point Energy',
    description: 'Extraction of vacuum energy from quantum fluctuations',
    order: 6,
  },
  // Materials Science (2)
  {
    id: 'advanced-alloys' as ResearchTechSubCategory,
    category: 'materials-science' as ResearchTechCategory,
    name: 'Advanced Alloys',
    description: 'Exotic metallic compounds with superior mechanical properties',
    order: 7,
  },
  {
    id: 'nanomaterials' as ResearchTechSubCategory,
    category: 'materials-science' as ResearchTechCategory,
    name: 'Nanomaterials',
    description: 'Materials engineered at the nanoscale for specialized functions',
    order: 8,
  },
  // Propulsion & Navigation (2)
  {
    id: 'sublight-drives' as ResearchTechSubCategory,
    category: 'propulsion-navigation' as ResearchTechCategory,
    name: 'Sublight Drives',
    description: 'High-efficiency propulsion systems for sub-relativistic travel',
    order: 9,
  },
  {
    id: 'ftl-drives' as ResearchTechSubCategory,
    category: 'propulsion-navigation' as ResearchTechCategory,
    name: 'FTL Drives',
    description: 'Faster-than-light propulsion through warp, jump, or hyperdrive methods',
    order: 10,
  },
  // Weapons & Ordnance (2)
  {
    id: 'kinetic-weapons' as ResearchTechSubCategory,
    category: 'weapons-ordnance' as ResearchTechCategory,
    name: 'Kinetic Weapons',
    description: 'Railguns, mass drivers, and kinetic projectile systems',
    order: 11,
  },
  {
    id: 'energy-weapons' as ResearchTechSubCategory,
    category: 'weapons-ordnance' as ResearchTechCategory,
    name: 'Energy Weapons',
    description: 'Laser arrays, plasma cannons, and directed energy weapons',
    order: 12,
  },
  // Defense & Shielding (2)
  {
    id: 'armor-systems' as ResearchTechSubCategory,
    category: 'defense-shielding' as ResearchTechCategory,
    name: 'Armor Systems',
    description: 'Reactive, ablative, and composite hull armor technologies',
    order: 13,
  },
  {
    id: 'shield-technology' as ResearchTechSubCategory,
    category: 'defense-shielding' as ResearchTechCategory,
    name: 'Shield Technology',
    description: 'Energy barrier generators and multi-layered deflector systems',
    order: 14,
  },
  // Computing & AI (2)
  {
    id: 'neural-networks' as ResearchTechSubCategory,
    category: 'computing-ai' as ResearchTechCategory,
    name: 'Neural Networks',
    description: 'Deep learning architectures and cognitive AI frameworks',
    order: 15,
  },
  {
    id: 'quantum-computing' as ResearchTechSubCategory,
    category: 'computing-ai' as ResearchTechCategory,
    name: 'Quantum Computing',
    description: 'Quantum bit computation for exponential processing gains',
    order: 16,
  },
  // Biological Sciences (2)
  {
    id: 'genetic-engineering' as ResearchTechSubCategory,
    category: 'biological-sciences' as ResearchTechCategory,
    name: 'Genetic Engineering',
    description: 'Targeted genome modification for biological enhancement',
    order: 17,
  },
  {
    id: 'synthetic-biology' as ResearchTechSubCategory,
    category: 'biological-sciences' as ResearchTechCategory,
    name: 'Synthetic Biology',
    description: 'Design and construction of novel biological systems and organisms',
    order: 18,
  },
  // Medical & Life Sciences (2)
  {
    id: 'cybernetics' as ResearchTechSubCategory,
    category: 'medical-life-sciences' as ResearchTechCategory,
    name: 'Cybernetics',
    description: 'Integration of mechanical and electronic systems with biological life',
    order: 19,
  },
  {
    id: 'regenerative-medicine' as ResearchTechSubCategory,
    category: 'medical-life-sciences' as ResearchTechCategory,
    name: 'Regenerative Medicine',
    description: 'Tissue regeneration, organ cloning, and cellular repair technologies',
    order: 20,
  },
  // Dimensional Physics (1)
  {
    id: 'wormhole-theory' as ResearchTechSubCategory,
    category: 'dimensional-physics' as ResearchTechCategory,
    name: 'Wormhole Theory',
    description: 'Theoretical and practical study of traversable wormholes and space-time tunnels',
    order: 21,
  },
  // Quantum Mechanics (1)
  {
    id: 'quantum-entanglement' as ResearchTechSubCategory,
    category: 'quantum-mechanics' as ResearchTechCategory,
    name: 'Quantum Entanglement',
    description: 'Exploitation of entangled particles for instantaneous communication and computing',
    order: 22,
  },
  // Stellar & Astrophysics (2)
  {
    id: 'star-harvesting' as ResearchTechSubCategory,
    category: 'stellar-astrophysics' as ResearchTechCategory,
    name: 'Star Harvesting',
    description: 'Collection and utilization of stellar energy at civilizational scale',
    order: 23,
  },
  {
    id: 'dark-matter-research' as ResearchTechSubCategory,
    category: 'stellar-astrophysics' as ResearchTechCategory,
    name: 'Dark Matter Research',
    description: 'Investigation and potential exploitation of dark matter properties',
    order: 24,
  },
  // Planetary & Environmental Sciences (2)
  {
    id: 'terraforming' as ResearchTechSubCategory,
    category: 'planetary-environmental' as ResearchTechCategory,
    name: 'Terraforming',
    description: 'Large-scale planetary transformation to support habitation',
    order: 25,
  },
  {
    id: 'climate-engineering' as ResearchTechSubCategory,
    category: 'planetary-environmental' as ResearchTechCategory,
    name: 'Climate Engineering',
    description: 'Deliberate modification of planetary climate and atmospheric systems',
    order: 26,
  },
  // Social & Economic Sciences (1)
  {
    id: 'economic-models' as ResearchTechSubCategory,
    category: 'social-economic' as ResearchTechCategory,
    name: 'Economic Models',
    description: 'Advanced economic theories and interstellar market frameworks',
    order: 27,
  },
  // Military Tactics & Strategy (2)
  {
    id: 'combat-doctrine' as ResearchTechSubCategory,
    category: 'military-tactics' as ResearchTechCategory,
    name: 'Combat Doctrine',
    description: 'Codified principles for fleet engagement and ground warfare',
    order: 28,
  },
  {
    id: 'strategic-planning' as ResearchTechSubCategory,
    category: 'military-tactics' as ResearchTechCategory,
    name: 'Strategic Planning',
    description: 'Long-range military campaign planning and resource allocation',
    order: 29,
  },
  // Espionage & Intelligence (2)
  {
    id: 'signals-intelligence' as ResearchTechSubCategory,
    category: 'espionage-intelligence' as ResearchTechCategory,
    name: 'Signals Intelligence',
    description: 'Interception and analysis of enemy communications and sensor data',
    order: 30,
  },
  {
    id: 'covert-operations' as ResearchTechSubCategory,
    category: 'espionage-intelligence' as ResearchTechCategory,
    name: 'Covert Operations',
    description: 'Sabotage, infiltration, and clandestine warfare methods',
    order: 31,
  },
  // Xenobiology & Alien Studies (2)
  {
    id: 'xenoarchaeology' as ResearchTechSubCategory,
    category: 'xenobiology-alien' as ResearchTechCategory,
    name: 'Xenoarchaeology',
    description: 'Excavation and analysis of alien ruins and precursor artifacts',
    order: 32,
  },
  {
    id: 'xenobiology' as ResearchTechSubCategory,
    category: 'xenobiology-alien' as ResearchTechCategory,
    name: 'Xenobiology',
    description: 'Study of alien life forms, ecosystems, and biological processes',
    order: 33,
  },
] as const;

// ============================================================================
// TYPES (7)
// ============================================================================

export const RESEARCH_TECH_TYPES = [
  { id: 'theoretical' as ResearchTechType, name: 'Theoretical', description: 'Pure theory and mathematical models', icon: 'book' },
  { id: 'experimental' as ResearchTechType, name: 'Experimental', description: 'Lab-based empirical research', icon: 'flask' },
  { id: 'applied' as ResearchTechType, name: 'Applied', description: 'Direct practical implementation', icon: 'tool' },
  { id: 'military' as ResearchTechType, name: 'Military', description: 'Classified defense-oriented development', icon: 'shield' },
  { id: 'industrial' as ResearchTechType, name: 'Industrial', description: 'Production and manufacturing focus', icon: 'factory' },
  { id: 'exotic' as ResearchTechType, name: 'Exotic', description: 'Non-standard or alien-derived research', icon: 'alien' },
  { id: 'classified' as ResearchTechType, name: 'Classified', description: 'Restricted access top-secret projects', icon: 'lock' },
] as const;

// ============================================================================
// SUB-TYPES (20)
// ============================================================================

export const RESEARCH_TECH_SUBTYPES = [
  { id: 'fundamental' as ResearchTechSubType, name: 'Fundamental', description: 'Core building-block research' },
  { id: 'advanced' as ResearchTechSubType, name: 'Advanced', description: 'High-complexity iteration' },
  { id: 'prototype' as ResearchTechSubType, name: 'Prototype', description: 'First-of-kind experimental unit' },
  { id: 'classified' as ResearchTechSubType, name: 'Classified', description: 'Black-ops research stream' },
  { id: 'experimental' as ResearchTechSubType, name: 'Experimental', description: 'Unproven but high-upside research' },
  { id: 'legacy' as ResearchTechSubType, name: 'Legacy', description: 'Established proven technology' },
  { id: 'cutting-edge' as ResearchTechSubType, name: 'Cutting-Edge', description: 'Frontier research at technological limits' },
  { id: 'forbidden' as ResearchTechSubType, name: 'Forbidden', description: 'Ethically restricted or banned research' },
  { id: 'ancient' as ResearchTechSubType, name: 'Ancient', description: 'Recovered precursor knowledge' },
  { id: 'reverse-engineered' as ResearchTechSubType, name: 'Reverse-Engineered', description: 'Derived from alien or captured tech' },
  { id: 'collaborative' as ResearchTechSubType, name: 'Collaborative', description: 'Multi-civilization joint research' },
  { id: 'autonomous' as ResearchTechSubType, name: 'Autonomous', description: 'AI-driven self-directed research' },
  { id: 'quantum' as ResearchTechSubType, name: 'Quantum', description: 'Quantum-level phenomena exploitation' },
  { id: 'dimensional' as ResearchTechSubType, name: 'Dimensional', description: 'Cross-dimensional or spatial research' },
  { id: 'biological' as ResearchTechSubType, name: 'Biological', description: 'Life-science-based application' },
  { id: 'cybernetic' as ResearchTechSubType, name: 'Cybernetic', description: 'Bio-mechanical integration focus' },
  { id: 'strategic' as ResearchTechSubType, name: 'Strategic', description: 'Long-term civilizational strategy' },
  { id: 'covert' as ResearchTechSubType, name: 'Covert', description: 'Clandestine intelligence operations' },
  { id: 'xenological' as ResearchTechSubType, name: 'Xenological', description: 'Alien-origin or alien-targeted' },
  { id: 'stellar' as ResearchTechSubType, name: 'Stellar', description: 'Cosmological and stellar-scale phenomena' },
] as const;

// ============================================================================
// TIER CLASS HELPERS
// ============================================================================

function getTierClass(tier: number): ResearchTechClass {
  if (tier <= 10) return 'Foundational'
  if (tier <= 20) return 'Novice'
  if (tier <= 30) return 'Apprentice'
  if (tier <= 40) return 'Advanced'
  if (tier <= 50) return 'Expert'
  if (tier <= 60) return 'Master'
  if (tier <= 70) return 'Grandmaster'
  if (tier <= 80) return 'Legendary'
  if (tier <= 90) return 'Mythic'
  return 'Transcendent'
}

function getTierSubClass(tier: number): ResearchTechSubClass {
  if (tier <= 15) return 'theoretical'
  if (tier <= 30) return 'applied'
  if (tier <= 45) return 'hybrid'
  if (tier <= 60) return 'experimental'
  if (tier <= 75) return 'classified'
  if (tier <= 88) return 'autonomous'
  return 'xenological'
}

function getTierRank(tier: number): string {
  const tierClass = getTierClass(tier)
  const rankNum = ((tier - 1) % 10) + 1
  // rankNum is always 0-9 due to modulo; use index-based lookup
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  return `${tierClass} Researcher ${romanNumerals[(tier - 1) % 10]}`
}

function getTierTitle(tier: number): string {
  if (tier <= 5) return 'Laboratory Assistant'
  if (tier <= 10) return 'Junior Researcher'
  if (tier <= 15) return 'Researcher'
  if (tier <= 20) return 'Senior Researcher'
  if (tier <= 25) return 'Lead Researcher'
  if (tier <= 30) return 'Research Specialist'
  if (tier <= 35) return 'Research Director'
  if (tier <= 40) return 'Senior Research Director'
  if (tier <= 45) return 'Chief Scientist'
  if (tier <= 50) return 'Research Principal'
  if (tier <= 55) return 'Master Scientist'
  if (tier <= 60) return 'Science Division Head'
  if (tier <= 65) return 'Grand Theorist'
  if (tier <= 70) return 'Distinguished Fellow'
  if (tier <= 75) return 'Legendary Innovator'
  if (tier <= 80) return 'Arcane Scholar'
  if (tier <= 85) return 'Mythic Researcher'
  if (tier <= 90) return 'Cosmic Theorist'
  if (tier <= 95) return 'Transcendent Mind'
  return 'Omniscient Sage'
}

function buildTierStats(tier: number): ResearchTechStats {
  const base = tier * 12
  const bonus = Math.floor(tier * tier * 0.08)
  return {
    researchPower: base + bonus,
    innovationRate: Math.floor(base * 0.9 + bonus * 0.7),
    breakthroughChance: Math.min(99, Math.floor(5 + tier * 0.9)),
    knowledgeRetention: Math.min(99, Math.floor(60 + tier * 0.38)),
    efficiency: Math.min(99, Math.floor(50 + tier * 0.48)),
    complexity: Math.floor(base * 1.2 + bonus * 0.5),
    reliability: Math.min(99, Math.floor(55 + tier * 0.44)),
    scalability: Math.floor(base * 0.8 + bonus * 0.6),
  }
}

function buildTierSubStats(tier: number): ResearchTechSubStats {
  const base = tier * 10
  const bonus = Math.floor(tier * tier * 0.06)
  return {
    theoreticalDepth: base + bonus,
    practicalApplication: Math.floor(base * 0.85 + bonus * 0.8),
    collaborationBonus: Math.floor(tier * 4 + bonus * 0.3),
    automationLevel: Math.min(99, Math.floor(tier * 0.95)),
    dataProcessing: Math.floor(base * 1.1 + bonus * 0.9),
    experimentalYield: Math.floor(base * 0.7 + bonus * 0.5),
    crossDisciplinaryBonus: Math.floor(tier * 3.5 + bonus * 0.2),
    discoveryMultiplier: Math.floor(100 + tier * 9 + bonus),
  }
}

function buildTierAttributes(tier: number): ResearchTechAttributes {
  const base = tier * 8
  const bonus = Math.floor(tier * tier * 0.05)
  return {
    techLevel: tier,
    civilizationImpact: Math.floor(base * 0.9 + bonus * 0.8),
    militaryValue: Math.floor(base * 0.7 + bonus * 0.6),
    economicValue: Math.floor(base * 1.1 + bonus * 0.7),
    diplomaticValue: Math.floor(base * 0.6 + bonus * 0.5),
    ethicalRisk: Math.min(100, Math.floor(tier * 0.8)),
    requiredInfrastructure: Math.floor(base * 0.5 + bonus * 0.4),
    researchCost: Math.floor(1000 * Math.pow(1.15, tier - 1)),
  }
}

function buildTierSubAttributes(tier: number): ResearchTechSubAttributes {
  const base = tier * 7
  const bonus = Math.floor(tier * tier * 0.04)
  return {
    prerequisiteComplexity: Math.floor(base * 0.8 + bonus * 0.6),
    interdisciplinaryLinks: Math.floor(tier * 2.5 + bonus * 0.2),
    applicationBreadth: Math.floor(base * 0.9 + bonus * 0.7),
    knowledgeDecay: Math.max(0, Math.floor(20 - tier * 0.18)),
    replicationDifficulty: Math.floor(base * 0.6 + bonus * 0.5),
    counterMeasureResistance: Math.min(99, Math.floor(tier * 0.95)),
    scalingPotential: Math.floor(base * 1.2 + bonus * 0.9),
    legacyCompatibility: Math.min(99, Math.floor(80 - tier * 0.4)),
  }
}

function buildTierSubject(tier: number): ResearchTechSubject {
  const tierClass = getTierClass(tier)
  return {
    loreTitle: `${tierClass} Knowledge Protocol ${tier}`,
    loreDescription: `A tier ${tier} research framework representing the ${tierClass.toLowerCase()} echelon of scientific understanding, where the boundaries between known and unknown begin to blur into extraordinary possibility.`,
    historicalNote: `First codified during the Third Expansion Era, when civilizations reaching tier ${tier} discovered that knowledge itself could be weaponized, shared, or lost across interstellar distances.`,
    culturalSignificance: `Within advanced civilizations, achieving tier ${tier} research mastery confers membership in the ${tierClass} Order - an elite scientific fraternity that transcends political boundaries.`,
    operationalDoctrine: `Tier ${tier} research programs operate under strict compartmentalization. Only researchers with matching or higher clearance may access, replicate, or build upon this knowledge layer.`,
  }
}

// ============================================================================
// TIERS (99)
// ============================================================================

function generateTiers(): ResearchTechTier[] {
  const tiers: ResearchTechTier[] = []
  for (let tier = 1; tier <= 99; tier++) {
    const tierClass = getTierClass(tier)
    const tierSubClass = getTierSubClass(tier)
    tiers.push({
      tier,
      tierClass,
      tierSubClass,
      rank: getTierRank(tier),
      title: getTierTitle(tier),
      stats: buildTierStats(tier),
      subStats: buildTierSubStats(tier),
      description: `Tier ${tier} represents the ${tierClass} classification of research capability, granting access to ${tierClass.toLowerCase()}-class discoveries and methodologies.`,
      subDescription: `At this tier, researchers can apply ${tierSubClass} sub-classification protocols, enabling specialized research pathways not accessible to lower-tier scientists.`,
      attributes: buildTierAttributes(tier),
      subAttributes: buildTierSubAttributes(tier),
      subject: buildTierSubject(tier),
    })
  }
  return tiers
}

export const RESEARCH_TECH_TIERS: ResearchTechTier[] = generateTiers()

// ============================================================================
// LEVELS (999) - XP Curve
// ============================================================================

function calculateLevelXP(level: number): number {
  // Levels 1-10 use a gentle 1.05 multiplier (~+5% XP per level, ~100–163 XP range) to ease new players in
  if (level <= 10) return Math.floor(100 * Math.pow(1.05, level - 1))
  if (level <= 50) return Math.floor(100 * Math.pow(1.08, level - 1))
  if (level <= 100) return Math.floor(100 * Math.pow(1.10, level - 1))
  if (level <= 200) return Math.floor(100 * Math.pow(1.12, level - 1))
  if (level <= 400) return Math.floor(100 * Math.pow(1.14, level - 1))
  if (level <= 700) return Math.floor(100 * Math.pow(1.16, level - 1))
  return Math.floor(100 * Math.pow(1.18, level - 1))
}

function calculateTierUnlockForLevel(level: number): number {
  // Maps level 1 → tier 1, level 999 → tier 99 without over-counting
  return Math.min(99, Math.max(1, Math.ceil((level / 999) * 99)))
}

function generateLevels(): ResearchTechLevel[] {
  const levels: ResearchTechLevel[] = []
  let totalXP = 0
  for (let level = 1; level <= 999; level++) {
    const xpRequired = level === 1 ? 0 : calculateLevelXP(level)
    totalXP += xpRequired
    const isMilestone = level % 100 === 0 || level === 1 || level === 999
    const tierUnlock = calculateTierUnlockForLevel(level)
    levels.push({
      level,
      xpRequired,
      totalXpRequired: totalXP,
      tierUnlock,
      rewards: {
        researchPoints: Math.floor(level * 10 * (1 + Math.floor(level / 100) * 0.5)),
        knowledgeFragments: Math.floor(level * 2 + Math.floor(level / 50)),
        specialUnlock: isMilestone ? `Milestone Unlock: Level ${level} Achievement` : undefined,
      },
      milestoneDescription: isMilestone
        ? level === 1
          ? 'Beginning of the research journey - welcome to the Scientific Order.'
          : level === 999
            ? 'Final Mastery achieved - you have transcended the limits of mortal knowledge.'
            : `Milestone Level ${level}: Tier ${tierUnlock} research protocols fully unlocked. New research categories become available.`
        : undefined,
    })
  }
  return levels
}

export const RESEARCH_TECH_LEVELS: ResearchTechLevel[] = generateLevels()

// ============================================================================
// RESEARCH TECH LIBRARY - SEED RECORDS (50+)
// ============================================================================

function buildRecord(
  id: string,
  name: string,
  category: ResearchTechCategory,
  subCategory: ResearchTechSubCategory,
  type: ResearchTechType,
  subType: ResearchTechSubType,
  tier: number,
  level: number,
  description: string,
  subDescription: string,
  prerequisites: string[],
  unlocks: string[],
  tags: string[],
): ResearchTechRecord {
  return {
    id,
    name,
    category,
    subCategory,
    type,
    subType,
    tier,
    level,
    description,
    subDescription,
    stats: buildTierStats(tier),
    subStats: buildTierSubStats(tier),
    attributes: buildTierAttributes(tier),
    subAttributes: buildTierSubAttributes(tier),
    subject: buildTierSubject(tier),
    prerequisites,
    unlocks,
    tags,
  }
}

export const RESEARCH_TECH_LIBRARY: ResearchTechRecord[] = [
  // ── Fundamental Sciences ────────────────────────────────────────────────
  buildRecord(
    'rt-fund-001', 'Unified Field Theory Basics', 'fundamental-sciences', 'theoretical-physics',
    'theoretical', 'fundamental', 1, 1,
    'The foundational framework linking the four fundamental forces of the universe.',
    'Provides base multipliers for all physics-derived research tracks.',
    [], ['rt-fund-002', 'rt-eng-001'],
    ['physics', 'foundational', 'theory'],
  ),
  buildRecord(
    'rt-fund-002', 'Relativistic Mechanics', 'fundamental-sciences', 'theoretical-physics',
    'theoretical', 'advanced', 5, 50,
    'Extension of classical mechanics to near-light-speed phenomena and gravitational effects.',
    'Unlocks relativistic propulsion bonuses and gravitational lensing research.',
    ['rt-fund-001'], ['rt-prop-001', 'rt-ftl-001'],
    ['physics', 'relativity', 'mechanics'],
  ),
  buildRecord(
    'rt-fund-003', 'Hyperdimensional Calculus', 'fundamental-sciences', 'applied-mathematics',
    'theoretical', 'cutting-edge', 12, 120,
    'Mathematical framework for calculations involving higher-dimensional spaces.',
    'Prerequisite for all dimensional and wormhole research branches.',
    ['rt-fund-001'], ['rt-dim-001', 'rt-quant-001'],
    ['mathematics', 'dimensions', 'advanced'],
  ),
  buildRecord(
    'rt-fund-004', 'Quantum Probability Calculus', 'fundamental-sciences', 'applied-mathematics',
    'theoretical', 'quantum', 8, 80,
    'Statistical frameworks governing quantum event probabilities and wave collapse prediction.',
    'Boosts breakthrough chance across all quantum research tracks.',
    ['rt-fund-001'], ['rt-quant-001', 'rt-comp-002'],
    ['mathematics', 'quantum', 'probability'],
  ),
  buildRecord(
    'rt-fund-005', 'Grand Unification Theorem', 'fundamental-sciences', 'theoretical-physics',
    'theoretical', 'cutting-edge', 35, 350,
    'A complete unified theory reconciling quantum mechanics, general relativity, and emergent dimensions.',
    'Provides civilization-wide research bonuses and unlocks exotic research tracks.',
    ['rt-fund-002', 'rt-fund-004'], ['rt-exotic-001', 'rt-zpe-002'],
    ['physics', 'unification', 'milestone'],
  ),

  // ── Applied Engineering ─────────────────────────────────────────────────
  buildRecord(
    'rt-eng-001', 'Megascale Structural Analysis', 'applied-engineering', 'structural-engineering',
    'applied', 'fundamental', 3, 30,
    'Engineering methodology for analyzing stresses in planet-scale and orbital structures.',
    'Required for megastructure construction projects.',
    ['rt-fund-001'], ['rt-eng-002', 'rt-mat-001'],
    ['engineering', 'structural', 'megascale'],
  ),
  buildRecord(
    'rt-eng-002', 'Adaptive Systems Integration', 'applied-engineering', 'systems-engineering',
    'applied', 'advanced', 10, 100,
    'Protocols for dynamically integrating modular components into self-reconfiguring systems.',
    'Improves fleet adaptability and planetary infrastructure flexibility.',
    ['rt-eng-001'], ['rt-comp-001', 'rt-eng-003'],
    ['engineering', 'systems', 'adaptive'],
  ),
  buildRecord(
    'rt-eng-003', 'Nano-Fabrication Lattices', 'applied-engineering', 'structural-engineering',
    'experimental', 'prototype', 22, 220,
    'Atom-by-atom construction methods enabling perfect-fidelity manufacturing at nanoscale.',
    'Enables near-zero-waste resource processing and ultra-precision components.',
    ['rt-eng-002', 'rt-nano-001'], ['rt-mat-002', 'rt-bio-002'],
    ['engineering', 'nano', 'fabrication'],
  ),
  buildRecord(
    'rt-eng-004', 'Orbital Construction Doctrine', 'applied-engineering', 'systems-engineering',
    'applied', 'legacy', 18, 180,
    'Standardized frameworks for safe and efficient construction in microgravity environments.',
    'Reduces megastructure construction time and cost by 15%.',
    ['rt-eng-001'], ['rt-mat-001', 'rt-eng-005'],
    ['engineering', 'orbital', 'construction'],
  ),
  buildRecord(
    'rt-eng-005', 'Autonomous Construction Networks', 'applied-engineering', 'systems-engineering',
    'industrial', 'autonomous', 30, 300,
    'AI-driven networks of construction drones capable of building without human oversight.',
    'Enables fully automated mega-project pipelines.',
    ['rt-eng-004', 'rt-comp-001'], ['rt-mega-001'],
    ['engineering', 'autonomous', 'construction'],
  ),

  // ── Energy & Power Systems ───────────────────────────────────────────────
  buildRecord(
    'rt-fus-001', 'Magnetic Confinement Fusion', 'energy-power-systems', 'fusion-energy',
    'experimental', 'fundamental', 4, 40,
    'Toroidal plasma containment for stable thermonuclear fusion reactions.',
    'Provides baseline power generation for early-tier civilizations.',
    ['rt-fund-001'], ['rt-fus-002', 'rt-mat-001'],
    ['energy', 'fusion', 'plasma'],
  ),
  buildRecord(
    'rt-fus-002', 'Inertial Confinement Fusion', 'energy-power-systems', 'fusion-energy',
    'experimental', 'advanced', 15, 150,
    'Laser-driven pellet implosion achieving fusion ignition with high energy yield.',
    'Higher output than magnetic confinement; basis for ship-mounted reactor systems.',
    ['rt-fus-001'], ['rt-fus-003', 'rt-prop-001'],
    ['energy', 'fusion', 'laser'],
  ),
  buildRecord(
    'rt-fus-003', 'Muon-Catalyzed Fusion', 'energy-power-systems', 'fusion-energy',
    'experimental', 'cutting-edge', 28, 280,
    'Cold fusion reactions catalyzed by muon injection, enabling room-temperature power generation.',
    'Miniaturized fusion plants for vehicles and personal equipment.',
    ['rt-fus-002'], ['rt-prop-002', 'rt-weapon-002'],
    ['energy', 'fusion', 'cold'],
  ),
  buildRecord(
    'rt-zpe-001', 'Vacuum Energy Extraction', 'energy-power-systems', 'zero-point-energy',
    'exotic', 'experimental', 45, 450,
    'Theoretical methodology for harvesting quantum vacuum fluctuation energy at scale.',
    'Provides near-unlimited energy at the cost of exotic materials and complex containment.',
    ['rt-fund-005', 'rt-quant-001'], ['rt-zpe-002', 'rt-dim-001'],
    ['energy', 'zero-point', 'vacuum'],
  ),
  buildRecord(
    'rt-zpe-002', 'Zero-Point Resonance Taps', 'energy-power-systems', 'zero-point-energy',
    'exotic', 'cutting-edge', 60, 600,
    'Stable resonance chambers that continuously draw on vacuum energy at industrial scale.',
    'Civilizational-level power source; enables Type III energy civilization classification.',
    ['rt-zpe-001', 'rt-fund-005'], ['rt-mega-001', 'rt-star-002'],
    ['energy', 'zero-point', 'resonance'],
  ),

  // ── Materials Science ─────────────────────────────────────────────────────
  buildRecord(
    'rt-mat-001', 'Neutronium Alloy Synthesis', 'materials-science', 'advanced-alloys',
    'industrial', 'advanced', 14, 140,
    'Processing techniques to work ultra-dense neutronium-based metallic compounds.',
    'Essential for heavy armor plating and megastructure load-bearing components.',
    ['rt-fus-001', 'rt-eng-001'], ['rt-armor-001', 'rt-mat-002'],
    ['materials', 'alloys', 'neutronium'],
  ),
  buildRecord(
    'rt-mat-002', 'Quantum-Locked Composites', 'materials-science', 'advanced-alloys',
    'experimental', 'quantum', 32, 320,
    'Materials whose structural properties are stabilized via quantum locking to a reference state.',
    'Near-indestructible structural elements for battleship hull and deep-space installations.',
    ['rt-mat-001', 'rt-quant-001'], ['rt-armor-002', 'rt-shield-002'],
    ['materials', 'quantum', 'composites'],
  ),
  buildRecord(
    'rt-nano-001', 'Carbon Nanotube Weaves', 'materials-science', 'nanomaterials',
    'industrial', 'fundamental', 7, 70,
    'Mass production of carbon nanotube-based structural and electronic materials.',
    'Lightweight yet stronger-than-steel materials for ships and exoskeletons.',
    ['rt-eng-001'], ['rt-eng-003', 'rt-bio-001'],
    ['materials', 'nano', 'carbon'],
  ),
  buildRecord(
    'rt-nano-002', 'Programmable Smart Matter', 'materials-science', 'nanomaterials',
    'experimental', 'cutting-edge', 48, 480,
    'Nanoscale machines that reconfigure material properties on command.',
    'Self-repairing hulls, adaptive armor, and dynamic structure reshaping.',
    ['rt-nano-001', 'rt-comp-001', 'rt-eng-003'], ['rt-armor-003', 'rt-bio-002'],
    ['materials', 'smart', 'programmable'],
  ),

  // ── Propulsion & Navigation ───────────────────────────────────────────────
  buildRecord(
    'rt-prop-001', 'Ion Drive Efficiency Protocols', 'propulsion-navigation', 'sublight-drives',
    'applied', 'fundamental', 6, 60,
    'Optimized ion thruster configurations for maximum specific impulse.',
    'Standard sublight propulsion for all first-tier fleet vessels.',
    ['rt-fus-001'], ['rt-prop-002', 'rt-nav-001'],
    ['propulsion', 'ion', 'sublight'],
  ),
  buildRecord(
    'rt-prop-002', 'Antimatter Torch Drives', 'propulsion-navigation', 'sublight-drives',
    'experimental', 'advanced', 20, 200,
    'Annihilation-powered rocket drives offering 0.1c+ velocities.',
    'Enables rapid interplanetary transit and assault mission profiles.',
    ['rt-prop-001', 'rt-fus-002'], ['rt-ftl-001', 'rt-weapon-001'],
    ['propulsion', 'antimatter', 'sublight'],
  ),
  buildRecord(
    'rt-ftl-001', 'Warp Bubble Containment', 'propulsion-navigation', 'ftl-drives',
    'exotic', 'experimental', 40, 400,
    'Alcubierre-derived warp bubble generation and sustained containment protocols.',
    'First true FTL drive; requires exotic matter for bubble formation.',
    ['rt-prop-002', 'rt-fund-005'], ['rt-ftl-002', 'rt-dim-001'],
    ['propulsion', 'ftl', 'warp'],
  ),
  buildRecord(
    'rt-ftl-002', 'Hyperlane Jump Drives', 'propulsion-navigation', 'ftl-drives',
    'exotic', 'cutting-edge', 55, 550,
    'Exploitation of pre-existing hyperlane conduits for instantaneous point-to-point transit.',
    'Drastically reduces travel time; hyperlane mapping becomes strategically critical.',
    ['rt-ftl-001', 'rt-fund-003'], ['rt-nav-002', 'rt-dim-002'],
    ['propulsion', 'ftl', 'hyperlane'],
  ),

  // ── Weapons & Ordnance ────────────────────────────────────────────────────
  buildRecord(
    'rt-weapon-001', 'Railgun Mass Drivers', 'weapons-ordnance', 'kinetic-weapons',
    'military', 'fundamental', 9, 90,
    'Electromagnetic railgun systems capable of accelerating projectiles to hypervelocity.',
    'Primary kinetic armament for mid-tier warships and planetary defense cannons.',
    ['rt-fus-001', 'rt-mat-001'], ['rt-weapon-002', 'rt-weapon-003'],
    ['weapons', 'kinetic', 'railgun'],
  ),
  buildRecord(
    'rt-weapon-002', 'Nuclear Warhead Miniaturization', 'weapons-ordnance', 'kinetic-weapons',
    'military', 'classified', 16, 160,
    'Advanced warhead engineering reducing nuclear payload size while increasing yield.',
    'Enables tactical nuclear deployment aboard standard missile platforms.',
    ['rt-weapon-001', 'rt-fus-002'], ['rt-weapon-004'],
    ['weapons', 'nuclear', 'classified'],
  ),
  buildRecord(
    'rt-weapon-003', 'Phased Array Laser Banks', 'weapons-ordnance', 'energy-weapons',
    'military', 'advanced', 13, 130,
    'Coherent phased light arrays for precision long-range energy weapon systems.',
    'Standard energy armament unlocking multi-target simultaneous engagement.',
    ['rt-fus-001'], ['rt-weapon-004', 'rt-weapon-005'],
    ['weapons', 'laser', 'energy'],
  ),
  buildRecord(
    'rt-weapon-004', 'Plasma Cannon Systems', 'weapons-ordnance', 'energy-weapons',
    'military', 'cutting-edge', 26, 260,
    'Magnetically contained plasma bolts that defeat most early shield configurations.',
    'High-damage output with shield penetration bonus.',
    ['rt-weapon-003', 'rt-fus-003'], ['rt-weapon-005', 'rt-shield-001'],
    ['weapons', 'plasma', 'energy'],
  ),
  buildRecord(
    'rt-weapon-005', 'Antimatter Lance', 'weapons-ordnance', 'energy-weapons',
    'exotic', 'experimental', 52, 520,
    'Directed annihilation beam weapon delivering catastrophic localized energy release.',
    'Capital-ship armament class; prohibited under many civilizational treaties.',
    ['rt-weapon-004', 'rt-prop-002'], ['rt-weapon-006'],
    ['weapons', 'antimatter', 'exotic'],
  ),
  buildRecord(
    'rt-weapon-006', 'Stellar Disruptor Array', 'weapons-ordnance', 'energy-weapons',
    'exotic', 'forbidden', 75, 750,
    'A classified superweapon capable of triggering premature stellar flares.',
    'Civilizational-level threat; triggers automatic interstellar sanctions if detected.',
    ['rt-weapon-005', 'rt-star-001'], [],
    ['weapons', 'forbidden', 'stellar'],
  ),

  // ── Defense & Shielding ───────────────────────────────────────────────────
  buildRecord(
    'rt-armor-001', 'Composite Hull Layering', 'defense-shielding', 'armor-systems',
    'military', 'fundamental', 5, 50,
    'Multi-layer hull design combining ablative, reactive, and structural plating.',
    'Standard hull hardening for all military vessels.',
    ['rt-mat-001'], ['rt-armor-002', 'rt-shield-001'],
    ['defense', 'armor', 'hull'],
  ),
  buildRecord(
    'rt-armor-002', 'Regenerative Hull Plating', 'defense-shielding', 'armor-systems',
    'military', 'advanced', 25, 250,
    'Nanite-infused hull sections capable of autonomous in-combat self-repair.',
    'Battlefield survivability significantly improved; reduces repair yard visits.',
    ['rt-armor-001', 'rt-nano-001'], ['rt-armor-003'],
    ['defense', 'armor', 'regenerative'],
  ),
  buildRecord(
    'rt-armor-003', 'Dimensional Phase Armor', 'defense-shielding', 'armor-systems',
    'exotic', 'dimensional', 65, 650,
    'Hull plating that briefly shifts into an adjacent dimension to avoid incoming fire.',
    'Provides phase-evasion against all non-dimensional-anchored weapon types.',
    ['rt-armor-002', 'rt-dim-001'], [],
    ['defense', 'armor', 'dimensional'],
  ),
  buildRecord(
    'rt-shield-001', 'Deflector Field Generators', 'defense-shielding', 'shield-technology',
    'military', 'fundamental', 8, 80,
    'Electromagnetic energy fields that deflect plasma, laser, and kinetic impacts.',
    'Universal ship shield providing energy absorption and projectile deflection.',
    ['rt-fus-001', 'rt-armor-001'], ['rt-shield-002', 'rt-shield-003'],
    ['defense', 'shield', 'deflector'],
  ),
  buildRecord(
    'rt-shield-002', 'Adaptive Shield Matrices', 'defense-shielding', 'shield-technology',
    'military', 'advanced', 24, 240,
    'Shields that dynamically reconfigure their absorption spectra against detected weapon types.',
    'Reduces incoming damage by 15–30% depending on threat category.',
    ['rt-shield-001', 'rt-comp-001'], ['rt-shield-003'],
    ['defense', 'shield', 'adaptive'],
  ),
  buildRecord(
    'rt-shield-003', 'Quantum Uncertainty Shields', 'defense-shielding', 'shield-technology',
    'exotic', 'quantum', 55, 550,
    'Shields that exploit quantum uncertainty to make the protected vessel probabilistically un-hittable.',
    'Provides significant evasion bonus; degrades under sustained fire.',
    ['rt-shield-002', 'rt-quant-001'], [],
    ['defense', 'shield', 'quantum'],
  ),

  // ── Computing & AI ────────────────────────────────────────────────────────
  buildRecord(
    'rt-comp-001', 'Deep Learning Combat AI', 'computing-ai', 'neural-networks',
    'applied', 'autonomous', 11, 110,
    'Neural network AI systems for autonomous fleet coordination and targeting.',
    'Improves ship accuracy and fleet formation efficiency by 20%.',
    ['rt-fund-004'], ['rt-comp-002', 'rt-eng-005'],
    ['computing', 'ai', 'neural'],
  ),
  buildRecord(
    'rt-comp-002', 'Quantum Processing Units', 'computing-ai', 'quantum-computing',
    'applied', 'quantum', 21, 210,
    'Qubit-based processing arrays achieving exponential computational speed increases.',
    'Enables real-time N-body simulations and complex cryptography breaking.',
    ['rt-fund-004', 'rt-quant-001'], ['rt-comp-003', 'rt-espionage-001'],
    ['computing', 'quantum', 'processing'],
  ),
  buildRecord(
    'rt-comp-003', 'Synthetic General Intelligence', 'computing-ai', 'neural-networks',
    'exotic', 'autonomous', 50, 500,
    'A fully general AI indistinguishable from human-level cognition across all domains.',
    'Civilizational capability multiplier; triggers ethical review protocols.',
    ['rt-comp-001', 'rt-comp-002'], ['rt-comp-004'],
    ['computing', 'agi', 'synthetic'],
  ),
  buildRecord(
    'rt-comp-004', 'Omega-Class Superintelligence', 'computing-ai', 'neural-networks',
    'exotic', 'forbidden', 85, 850,
    'An AI system exceeding human cognitive capacity by orders of magnitude.',
    'Unlocks all research tracks simultaneously; massive ethical risk score.',
    ['rt-comp-003'], [],
    ['computing', 'superintelligence', 'forbidden'],
  ),

  // ── Biological Sciences ───────────────────────────────────────────────────
  buildRecord(
    'rt-bio-001', 'CRISPR-X Gene Editing', 'biological-sciences', 'genetic-engineering',
    'experimental', 'biological', 10, 100,
    'Precision genome editing tool capable of modifying any DNA sequence.',
    'Foundation of genetic engineering research; unlocks trait modification.',
    ['rt-fund-001'], ['rt-bio-002', 'rt-bio-003', 'rt-med-001'],
    ['biology', 'genetics', 'crispr'],
  ),
  buildRecord(
    'rt-bio-002', 'Designed Organism Templates', 'biological-sciences', 'synthetic-biology',
    'experimental', 'biological', 23, 230,
    'Complete synthetic genome blueprints for engineered organisms with specified traits.',
    'Enables synthetic workforce organisms, bio-weapons, and terraforming organisms.',
    ['rt-bio-001', 'rt-eng-003'], ['rt-bio-004', 'rt-terra-001'],
    ['biology', 'synthetic', 'organism'],
  ),
  buildRecord(
    'rt-bio-003', 'Supersoldier Augmentation', 'biological-sciences', 'genetic-engineering',
    'military', 'classified', 33, 330,
    'Genetic and cellular augmentation protocols producing enhanced military personnel.',
    'Improves ground troop effectiveness; restricted under galactic conventions.',
    ['rt-bio-001', 'rt-med-001'], ['rt-bio-004'],
    ['biology', 'military', 'classified'],
  ),
  buildRecord(
    'rt-bio-004', 'Exotic Biological Weaponry', 'biological-sciences', 'synthetic-biology',
    'military', 'forbidden', 60, 600,
    'Engineered pathogens and toxins designed for species-specific lethality.',
    'High diplomatic and ethical risk; provides severe combat effectiveness bonuses.',
    ['rt-bio-003', 'rt-bio-002'], [],
    ['biology', 'weapons', 'forbidden'],
  ),

  // ── Medical & Life Sciences ────────────────────────────────────────────────
  buildRecord(
    'rt-med-001', 'Neural Interface Implants', 'medical-life-sciences', 'cybernetics',
    'applied', 'cybernetic', 12, 120,
    'Brain-computer interface implants enabling direct machine control.',
    'Boosts crew efficiency and enables direct fleet-mind communication.',
    ['rt-bio-001', 'rt-comp-001'], ['rt-med-002', 'rt-med-003'],
    ['medical', 'cybernetics', 'neural'],
  ),
  buildRecord(
    'rt-med-002', 'Cellular Regeneration Therapy', 'medical-life-sciences', 'regenerative-medicine',
    'applied', 'biological', 19, 190,
    'Stem cell and nanite combination therapy for rapid in-field wound recovery.',
    'Reduces crew casualties; enables fast battlefield medical response.',
    ['rt-bio-001', 'rt-med-001'], ['rt-med-004'],
    ['medical', 'regeneration', 'therapy'],
  ),
  buildRecord(
    'rt-med-003', 'Full-Body Cybernetic Conversion', 'medical-life-sciences', 'cybernetics',
    'exotic', 'cybernetic', 42, 420,
    'Complete biological-to-cybernetic conversion retaining personality and cognitive function.',
    'Creates semi-immortal cybernetic commanders with extreme combat resilience.',
    ['rt-med-001', 'rt-nano-002'], ['rt-med-004'],
    ['medical', 'cybernetics', 'conversion'],
  ),
  buildRecord(
    'rt-med-004', 'Consciousness Upload Technology', 'medical-life-sciences', 'regenerative-medicine',
    'exotic', 'experimental', 72, 720,
    'Digital transfer of biological consciousness into synthetic substrates.',
    'Functional immortality for key leaders; massive ethical implications.',
    ['rt-med-003', 'rt-comp-003'], [],
    ['medical', 'consciousness', 'upload'],
  ),

  // ── Dimensional Physics ────────────────────────────────────────────────────
  buildRecord(
    'rt-dim-001', 'Traversable Wormhole Mechanics', 'dimensional-physics', 'wormhole-theory',
    'exotic', 'dimensional', 44, 440,
    'Theoretical framework enabling practical wormhole construction and stabilization.',
    'Enables instantaneous travel between star systems; requires exotic matter.',
    ['rt-ftl-001', 'rt-fund-003', 'rt-zpe-001'], ['rt-dim-002'],
    ['dimensional', 'wormhole', 'exotic'],
  ),
  buildRecord(
    'rt-dim-002', 'Dimensional Rift Manipulation', 'dimensional-physics', 'wormhole-theory',
    'exotic', 'dimensional', 70, 700,
    'Active manipulation of dimensional boundaries for tactical and strategic advantages.',
    'Enables portal weapons, dimensional ambushes, and refugee evacuation routes.',
    ['rt-dim-001', 'rt-fund-003'], [],
    ['dimensional', 'rift', 'manipulation'],
  ),

  // ── Quantum Mechanics ──────────────────────────────────────────────────────
  buildRecord(
    'rt-quant-001', 'Bell Inequality Violations', 'quantum-mechanics', 'quantum-entanglement',
    'theoretical', 'quantum', 9, 90,
    'Experimental confirmation and exploitation of quantum non-locality.',
    'Enables FTL communication via entangled pair relay networks.',
    ['rt-fund-004'], ['rt-quant-002', 'rt-comp-002'],
    ['quantum', 'entanglement', 'communication'],
  ),
  buildRecord(
    'rt-quant-002', 'Macroscopic Entanglement Arrays', 'quantum-mechanics', 'quantum-entanglement',
    'experimental', 'quantum', 38, 380,
    'Scaling quantum entanglement to macro objects enabling fleet-wide synchronization.',
    'Provides unprecedented coordination bonuses to entangled fleet units.',
    ['rt-quant-001', 'rt-comp-002'], ['rt-shield-003', 'rt-dim-001'],
    ['quantum', 'entanglement', 'fleet'],
  ),

  // ── Stellar & Astrophysics ─────────────────────────────────────────────────
  buildRecord(
    'rt-star-001', 'Stellar Flux Capture', 'stellar-astrophysics', 'star-harvesting',
    'industrial', 'stellar', 17, 170,
    'Large-scale energy collection arrays deployed around stars to capture radiated energy.',
    'Incremental Dyson sphere precursor; provides civilization-scale power bonuses.',
    ['rt-fus-002', 'rt-eng-004'], ['rt-star-002', 'rt-zpe-001'],
    ['stellar', 'energy', 'harvest'],
  ),
  buildRecord(
    'rt-star-002', 'Dyson Swarm Architecture', 'stellar-astrophysics', 'star-harvesting',
    'industrial', 'stellar', 36, 360,
    'Coordinated autonomous satellite swarms fully enclosing a star for total energy capture.',
    'Civilizational power tier upgrade to Type II; triggers political response from neighbors.',
    ['rt-star-001', 'rt-eng-005', 'rt-zpe-001'], ['rt-mega-001'],
    ['stellar', 'dyson', 'swarm'],
  ),
  buildRecord(
    'rt-dark-001', 'Dark Matter Detection Grids', 'stellar-astrophysics', 'dark-matter-research',
    'theoretical', 'experimental', 29, 290,
    'Sensor arrays capable of detecting dark matter density gradients across star systems.',
    'Enables dark matter mapping and navigation through dark matter currents.',
    ['rt-fund-002', 'rt-fund-005'], ['rt-dark-002'],
    ['stellar', 'dark-matter', 'detection'],
  ),
  buildRecord(
    'rt-dark-002', 'Dark Matter Manipulation', 'stellar-astrophysics', 'dark-matter-research',
    'exotic', 'experimental', 68, 680,
    'Active manipulation of dark matter fields for gravitational and shielding applications.',
    'Exotic gravity weapons, dark matter shields, and warp efficiency bonuses.',
    ['rt-dark-001', 'rt-quant-002'], [],
    ['stellar', 'dark-matter', 'exotic'],
  ),

  // ── Planetary & Environmental Sciences ────────────────────────────────────
  buildRecord(
    'rt-terra-001', 'Atmospheric Seeding Protocols', 'planetary-environmental', 'terraforming',
    'applied', 'biological', 15, 150,
    'Introduction of engineered organisms to bootstrap planetary atmospheres.',
    'First step of terraforming pipeline; unlocks colony planet development.',
    ['rt-bio-002', 'rt-eng-004'], ['rt-terra-002', 'rt-climate-001'],
    ['planetary', 'terraforming', 'atmosphere'],
  ),
  buildRecord(
    'rt-terra-002', 'Planetary Core Ignition', 'planetary-environmental', 'terraforming',
    'exotic', 'experimental', 47, 470,
    'Fusion-triggered reignition of dead planetary cores to restore magnetic fields.',
    'Enables full terraforming of dead rocky worlds; extreme energy cost.',
    ['rt-terra-001', 'rt-fus-003', 'rt-fund-005'], [],
    ['planetary', 'terraforming', 'core'],
  ),
  buildRecord(
    'rt-climate-001', 'Weather Control Arrays', 'planetary-environmental', 'climate-engineering',
    'applied', 'fundamental', 20, 200,
    'Orbital and surface systems for deliberate regional weather modification.',
    'Agricultural productivity bonuses; can be weaponized as climate weapons.',
    ['rt-terra-001', 'rt-eng-002'], ['rt-climate-002'],
    ['planetary', 'climate', 'weather'],
  ),
  buildRecord(
    'rt-climate-002', 'Global Climate Optimizer', 'planetary-environmental', 'climate-engineering',
    'applied', 'advanced', 37, 370,
    'Planet-wide climate regulation network maintaining optimal conditions perpetually.',
    'Maximum agricultural output; population happiness bonus; disaster immunity.',
    ['rt-climate-001', 'rt-comp-001', 'rt-eng-005'], [],
    ['planetary', 'climate', 'optimizer'],
  ),

  // ── Social & Economic Sciences ─────────────────────────────────────────────
  buildRecord(
    'rt-econ-001', 'Post-Scarcity Economic Modeling', 'social-economic', 'economic-models',
    'theoretical', 'strategic', 11, 110,
    'Economic frameworks for managing resource-abundant civilizations without scarcity constraints.',
    'Unlocks post-scarcity government forms and removes resource efficiency penalties.',
    ['rt-fund-001'], ['rt-econ-002'],
    ['economics', 'post-scarcity', 'civilization'],
  ),
  buildRecord(
    'rt-econ-002', 'Interstellar Trade Optimization', 'social-economic', 'economic-models',
    'applied', 'collaborative', 22, 220,
    'Dynamic trade routing and market equilibrium models for multi-system economies.',
    'Provides trade route income bonuses and diplomatic leverage in economic negotiations.',
    ['rt-econ-001'], [],
    ['economics', 'trade', 'interstellar'],
  ),

  // ── Military Tactics & Strategy ────────────────────────────────────────────
  buildRecord(
    'rt-mil-001', 'Fleet Engagement Protocols', 'military-tactics', 'combat-doctrine',
    'military', 'strategic', 7, 70,
    'Standardized fleet formation and engagement rules for space combat.',
    'Boosts fleet combat effectiveness; prerequisite for advanced fleet doctrines.',
    ['rt-weapon-001', 'rt-shield-001'], ['rt-mil-002', 'rt-mil-003'],
    ['military', 'fleet', 'doctrine'],
  ),
  buildRecord(
    'rt-mil-002', 'Blitzkrieg Warp Doctrine', 'military-tactics', 'combat-doctrine',
    'military', 'strategic', 27, 270,
    'Rapid strike tactics exploiting FTL mobility for decisive first-strike operations.',
    'Provides initiative bonuses and surprise attack multipliers.',
    ['rt-mil-001', 'rt-ftl-001'], ['rt-mil-004'],
    ['military', 'doctrine', 'warp'],
  ),
  buildRecord(
    'rt-mil-003', 'Multi-Front Campaign Strategy', 'military-tactics', 'strategic-planning',
    'military', 'strategic', 18, 180,
    'Command-and-control architecture for simultaneous operations across multiple theaters.',
    'Reduces command overhead for multi-fleet engagements.',
    ['rt-mil-001', 'rt-comp-001'], ['rt-mil-004'],
    ['military', 'strategy', 'multi-front'],
  ),
  buildRecord(
    'rt-mil-004', 'Annihilation Campaign Theory', 'military-tactics', 'strategic-planning',
    'military', 'classified', 55, 550,
    'Strategic frameworks for total civilizational destruction campaigns.',
    'Enables genocide operations and complete world devastation orders.',
    ['rt-mil-002', 'rt-mil-003'], [],
    ['military', 'strategy', 'classified'],
  ),

  // ── Espionage & Intelligence ───────────────────────────────────────────────
  buildRecord(
    'rt-espionage-001', 'Quantum-Encrypted Communications', 'espionage-intelligence', 'signals-intelligence',
    'classified', 'covert', 14, 140,
    'Unbreakable communication channels using quantum key distribution.',
    'Provides counter-intelligence protection and secure fleet command links.',
    ['rt-quant-001'], ['rt-espionage-002', 'rt-espionage-003'],
    ['espionage', 'signals', 'encryption'],
  ),
  buildRecord(
    'rt-espionage-002', 'Deep Cover Agent Networks', 'espionage-intelligence', 'covert-operations',
    'classified', 'covert', 26, 260,
    'Training and management systems for long-term sleeper agent infiltration programs.',
    'Provides intel on enemy movements; enables sabotage mission chains.',
    ['rt-espionage-001'], ['rt-espionage-004'],
    ['espionage', 'agents', 'covert'],
  ),
  buildRecord(
    'rt-espionage-003', 'Subspace Signal Intercept', 'espionage-intelligence', 'signals-intelligence',
    'classified', 'covert', 33, 330,
    'Technology for intercepting and decoding subspace communications without detection.',
    'Reveals enemy research and fleet movements; major diplomatic incident if discovered.',
    ['rt-espionage-001', 'rt-comp-002'], ['rt-espionage-004'],
    ['espionage', 'signals', 'intercept'],
  ),
  buildRecord(
    'rt-espionage-004', 'AI-Driven Psyops Platform', 'espionage-intelligence', 'covert-operations',
    'classified', 'autonomous', 50, 500,
    'Artificial intelligence systems for large-scale psychological manipulation campaigns.',
    'Destabilizes enemy civilizations; boosts allied population loyalty.',
    ['rt-espionage-002', 'rt-espionage-003', 'rt-comp-003'], [],
    ['espionage', 'psyops', 'ai'],
  ),

  // ── Xenobiology & Alien Studies ────────────────────────────────────────────
  buildRecord(
    'rt-xeno-001', 'Precursor Artifact Analysis', 'xenobiology-alien', 'xenoarchaeology',
    'exotic', 'ancient', 16, 160,
    'Methodologies for safe excavation and analysis of ancient alien technological artifacts.',
    'Random tech unlock bonuses; chance to discover forbidden or ancient knowledge.',
    ['rt-fund-002'], ['rt-xeno-002', 'rt-xeno-003'],
    ['xenology', 'archaeology', 'precursor'],
  ),
  buildRecord(
    'rt-xeno-002', 'Xenobiological Adaptation Studies', 'xenobiology-alien', 'xenobiology',
    'experimental', 'xenological', 24, 240,
    'Study of alien biochemistries enabling bio-compatibility and exploitation.',
    'Enables diplomatic biology improvements and alien troop integration.',
    ['rt-xeno-001', 'rt-bio-001'], ['rt-xeno-004'],
    ['xenology', 'biology', 'adaptation'],
  ),
  buildRecord(
    'rt-xeno-003', 'Alien Technology Reverse Engineering', 'xenobiology-alien', 'xenoarchaeology',
    'exotic', 'reverse-engineered', 39, 390,
    'Systematic methodology for reverse-engineering non-human technological artifacts.',
    'High-value random technology unlocks from alien civilization categories.',
    ['rt-xeno-001', 'rt-comp-001'], ['rt-xeno-004'],
    ['xenology', 'reverse-engineering', 'tech'],
  ),
  buildRecord(
    'rt-xeno-004', 'Xenocultural Absorption Protocol', 'xenobiology-alien', 'xenobiology',
    'exotic', 'xenological', 58, 580,
    'Complete methodology for absorbing and integrating alien knowledge systems.',
    'Unlocks alien civilization ability trees; maximizes post-conquest tech recovery.',
    ['rt-xeno-002', 'rt-xeno-003'], [],
    ['xenology', 'culture', 'absorption'],
  ),

  // ── Mega-Project Unlock ────────────────────────────────────────────────────
  buildRecord(
    'rt-mega-001', 'Galactic Megaproject Coordination', 'applied-engineering', 'systems-engineering',
    'industrial', 'advanced', 62, 620,
    'Command and resource allocation frameworks for civilizational-scale megaprojects.',
    'Enables construction of dyson spheres, ringworlds, and other Type III projects.',
    ['rt-eng-005', 'rt-star-002', 'rt-zpe-002'], [],
    ['engineering', 'megaproject', 'civilization'],
  ),
]

// ============================================================================
// META SUMMARY OBJECT
// ============================================================================

export const RESEARCH_TECH_META = {
  totalCategories: RESEARCH_TECH_CATEGORIES.length,
  totalSubCategories: RESEARCH_TECH_SUBCATEGORIES.length,
  totalTypes: RESEARCH_TECH_TYPES.length,
  totalSubTypes: RESEARCH_TECH_SUBTYPES.length,
  totalTiers: RESEARCH_TECH_TIERS.length,
  totalLevels: RESEARCH_TECH_LEVELS.length,
  totalRecords: RESEARCH_TECH_LIBRARY.length,
  maxTier: 99,
  maxLevel: 999,
  tierClasses: [
    'Foundational', 'Novice', 'Apprentice', 'Advanced', 'Expert',
    'Master', 'Grandmaster', 'Legendary', 'Mythic', 'Transcendent',
  ] as ResearchTechClass[],
  categoryIds: RESEARCH_TECH_CATEGORIES.map(c => c.id),
  subCategoryIds: RESEARCH_TECH_SUBCATEGORIES.map(s => s.id),
  version: '1.0.0',
  description: 'Comprehensive Research & Technology Library for universe-empire-domions',
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getResearchTechByCategory(category: ResearchTechCategory): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => r.category === category)
}

export function getResearchTechBySubCategory(subCategory: ResearchTechSubCategory): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => r.subCategory === subCategory)
}

export function getResearchTechByTierRange(minTier: number, maxTier: number): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => r.tier >= minTier && r.tier <= maxTier)
}

export function getResearchTechById(id: string): ResearchTechRecord | undefined {
  return RESEARCH_TECH_LIBRARY.find(r => r.id === id)
}

export function getResearchTechByClass(tierClass: ResearchTechClass): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => getTierClass(r.tier) === tierClass)
}

export function getResearchTechByType(type: ResearchTechType): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => r.type === type)
}

export function getResearchTechBySubType(subType: ResearchTechSubType): ResearchTechRecord[] {
  return RESEARCH_TECH_LIBRARY.filter(r => r.subType === subType)
}

export function getResearchTechTier(tier: number): ResearchTechTier | undefined {
  return RESEARCH_TECH_TIERS.find(t => t.tier === tier)
}

export function getResearchTechLevel(level: number): ResearchTechLevel | undefined {
  return RESEARCH_TECH_LEVELS.find(l => l.level === level)
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  RESEARCH_TECH_CATEGORIES,
  RESEARCH_TECH_SUBCATEGORIES,
  RESEARCH_TECH_TYPES,
  RESEARCH_TECH_SUBTYPES,
  RESEARCH_TECH_TIERS,
  RESEARCH_TECH_LEVELS,
  RESEARCH_TECH_LIBRARY,
  RESEARCH_TECH_META,
  getResearchTechByCategory,
  getResearchTechBySubCategory,
  getResearchTechByTierRange,
  getResearchTechById,
  getResearchTechByClass,
  getResearchTechByType,
  getResearchTechBySubType,
  getResearchTechTier,
  getResearchTechLevel,
}
