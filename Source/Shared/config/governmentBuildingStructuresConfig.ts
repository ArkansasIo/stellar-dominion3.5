/**
 * Government Building Structures Configuration
 *
 * Defines 18 categories and 32 sub-categories of government building structures,
 * with 1-99 tier system and 1-999 level system.
 *
 * Each structure includes:
 *  - Class & Sub-Class
 *  - Type & Sub-Type
 *  - Name, Rank & Title metadata
 *  - Details, Descriptions & Sub-Descriptions
 *  - Stats & Sub-Stats
 *  - Attributes & Sub-Attributes
 *  - Subjects & Subject Details
 */

// ---------------------------------------------------------------------------
// Tier & Level constants
// ---------------------------------------------------------------------------

export const GOV_BUILDING_MIN_TIER = 1;
export const GOV_BUILDING_MAX_TIER = 99;
export const GOV_BUILDING_MIN_LEVEL = 1;
export const GOV_BUILDING_MAX_LEVEL = 999;

export const GOV_BUILDING_CATEGORY_COUNT = 18;
export const GOV_BUILDING_SUBCATEGORY_COUNT = 32;

// ---------------------------------------------------------------------------
// Tier range labels
// ---------------------------------------------------------------------------

export const TIER_RANGE_LABELS: Record<string, { min: number; max: number; label: string }> = {
  basic: { min: 1, max: 9, label: 'Basic' },
  standard: { min: 10, max: 24, label: 'Standard' },
  advanced: { min: 25, max: 49, label: 'Advanced' },
  elite: { min: 50, max: 74, label: 'Elite' },
  legendary: { min: 75, max: 99, label: 'Legendary' },
};

// ---------------------------------------------------------------------------
// Level range labels
// ---------------------------------------------------------------------------

export const LEVEL_RANGE_LABELS: Record<string, { min: number; max: number; label: string }> = {
  novice: { min: 1, max: 99, label: 'Novice' },
  apprentice: { min: 100, max: 299, label: 'Apprentice' },
  journeyman: { min: 300, max: 499, label: 'Journeyman' },
  expert: { min: 500, max: 699, label: 'Expert' },
  master: { min: 700, max: 899, label: 'Master' },
  grandmaster: { min: 900, max: 999, label: 'Grandmaster' },
};

// ---------------------------------------------------------------------------
// Class & Sub-Class types
// ---------------------------------------------------------------------------

export type GovBuildingClass =
  | 'administrative'
  | 'military'
  | 'economic'
  | 'research'
  | 'diplomatic'
  | 'security'
  | 'infrastructure'
  | 'cultural';

/** Exhaustive list of all valid GovBuildingClass values for runtime validation. */
export const GOV_BUILDING_CLASS_VALUES: readonly GovBuildingClass[] = [
  'administrative',
  'military',
  'economic',
  'research',
  'diplomatic',
  'security',
  'infrastructure',
  'cultural',
] as const;

export function isGovBuildingClass(value: string): value is GovBuildingClass {
  return (GOV_BUILDING_CLASS_VALUES as readonly string[]).includes(value);
}

export type GovBuildingSubClass =
  | 'governance'
  | 'legislative'
  | 'judicial'
  | 'command'
  | 'commerce'
  | 'science'
  | 'relations'
  | 'defense'
  | 'operations'
  | 'resources'
  | 'education'
  | 'health'
  | 'heritage'
  | 'communications'
  | 'transit'
  | 'energy'
  | 'environment'
  | 'space';

// ---------------------------------------------------------------------------
// Type & Sub-Type
// ---------------------------------------------------------------------------

export type GovBuildingType =
  | 'headquarters'
  | 'branch'
  | 'facility'
  | 'station'
  | 'complex'
  | 'center'
  | 'hub'
  | 'institute'
  | 'academy'
  | 'bureau'
  | 'authority'
  | 'council'
  | 'commission'
  | 'office'
  | 'outpost';

/** Exhaustive list of all valid GovBuildingType values for runtime validation. */
export const GOV_BUILDING_TYPE_VALUES: readonly GovBuildingType[] = [
  'headquarters',
  'branch',
  'facility',
  'station',
  'complex',
  'center',
  'hub',
  'institute',
  'academy',
  'bureau',
  'authority',
  'council',
  'commission',
  'office',
  'outpost',
] as const;

export function isGovBuildingType(value: string): value is GovBuildingType {
  return (GOV_BUILDING_TYPE_VALUES as readonly string[]).includes(value);
}

export type GovBuildingSubType = 'primary' | 'secondary' | 'tertiary';

// ---------------------------------------------------------------------------
// Rank & Title definitions
// ---------------------------------------------------------------------------

export interface GovBuildingRank {
  /** Rank tier 1–10 */
  rankTier: number;
  name: string;
  title: string;
  description: string;
  /** Minimum building level required to unlock this rank */
  requiredLevel: number;
}

export const GOVERNMENT_BUILDING_RANKS: GovBuildingRank[] = [
  { rankTier: 1,  name: 'Deputy',          title: 'Deputy Officer',            description: 'Entry-level government official overseeing day-to-day operations.',       requiredLevel: 1   },
  { rankTier: 2,  name: 'Assistant Director', title: 'Assistant Director',      description: 'Assists the department director with strategic planning.',                 requiredLevel: 100 },
  { rankTier: 3,  name: 'Director',         title: 'Director of Operations',    description: 'Manages an entire department or facility.',                                requiredLevel: 200 },
  { rankTier: 4,  name: 'Senior Director',  title: 'Senior Director',           description: 'Oversees multiple departments within a ministry.',                         requiredLevel: 300 },
  { rankTier: 5,  name: 'Chief Director',   title: 'Chief Director',            description: 'Leads an entire ministry branch with broad policy authority.',             requiredLevel: 400 },
  { rankTier: 6,  name: 'Undersecretary',   title: 'Undersecretary of State',   description: 'Second-in-command of a governmental secretariat.',                        requiredLevel: 500 },
  { rankTier: 7,  name: 'Secretary',        title: 'Secretary of the Ministry', description: 'Head of a major government ministry with cabinet-level authority.',        requiredLevel: 600 },
  { rankTier: 8,  name: 'Minister',         title: 'Minister of State',         description: 'Holds ministerial authority over a critical sector of government.',        requiredLevel: 700 },
  { rankTier: 9,  name: 'Chancellor',       title: 'High Chancellor',           description: 'Commands multiple ministries and advises the head of state.',              requiredLevel: 850 },
  { rankTier: 10, name: 'Grand Chancellor', title: 'Grand Chancellor of State', description: 'Apex governmental authority overseeing all building structures.',          requiredLevel: 950 },
];

// ---------------------------------------------------------------------------
// Sub-Stat interface
// ---------------------------------------------------------------------------

export interface GovBuildingSubStat {
  id: string;
  name: string;
  /** Base value at level 1, tier 1 */
  base: number;
  /** Additive bonus per level */
  perLevel: number;
  /** Additive bonus per tier */
  perTier: number;
  /** Human-readable description */
  description: string;
}

// ---------------------------------------------------------------------------
// Stat interface
// ---------------------------------------------------------------------------

export interface GovBuildingStat {
  id: string;
  name: string;
  base: number;
  perLevel: number;
  perTier: number;
  description: string;
  subStats: GovBuildingSubStat[];
}

// ---------------------------------------------------------------------------
// Sub-Attribute interface
// ---------------------------------------------------------------------------

export interface GovBuildingSubAttribute {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
}

// ---------------------------------------------------------------------------
// Attribute interface
// ---------------------------------------------------------------------------

export interface GovBuildingAttribute {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
  subAttributes: GovBuildingSubAttribute[];
}

// ---------------------------------------------------------------------------
// Subject detail & subject interface
// ---------------------------------------------------------------------------

export interface GovBuildingSubjectDetail {
  id: string;
  name: string;
  description: string;
  value: number | string;
}

export interface GovBuildingSubject {
  id: string;
  name: string;
  description: string;
  details: GovBuildingSubjectDetail[];
}

// ---------------------------------------------------------------------------
// Sub-Description & Details interface
// ---------------------------------------------------------------------------

export interface GovBuildingSubDescription {
  id: string;
  title: string;
  text: string;
}

export interface GovBuildingDetails {
  overview: string;
  history: string;
  functionality: string;
  requirements: string;
  subDescriptions: GovBuildingSubDescription[];
}

// ---------------------------------------------------------------------------
// Sub-Category interface
// ---------------------------------------------------------------------------

export interface GovBuildingSubCategory {
  id: string;
  name: string;
  /** Parent category ID */
  categoryId: string;
  class: GovBuildingClass;
  subClass: GovBuildingSubClass;
  type: GovBuildingType;
  subType: GovBuildingSubType;
  description: string;
  details: GovBuildingDetails;
  stats: GovBuildingStat[];
  attributes: GovBuildingAttribute[];
  subjects: GovBuildingSubject[];
  /** Minimum tier this sub-category can be built at (1–99) */
  minTier: number;
  /** Maximum tier this sub-category scales up to (1–99) */
  maxTier: number;
  /** Minimum level (always 1) */
  minLevel: number;
  /** Maximum level this sub-category scales up to (1–999) */
  maxLevel: number;
}

// ---------------------------------------------------------------------------
// Category interface
// ---------------------------------------------------------------------------

export interface GovBuildingCategory {
  id: string;
  name: string;
  class: GovBuildingClass;
  subClass: GovBuildingSubClass;
  type: GovBuildingType;
  subType: GovBuildingSubType;
  description: string;
  /** IDs of sub-categories belonging to this category */
  subCategoryIds: string[];
  minTier: number;
  maxTier: number;
  minLevel: number;
  maxLevel: number;
}

// ---------------------------------------------------------------------------
// Shared stat/attribute builders
// ---------------------------------------------------------------------------

function makeAdminStats(): GovBuildingStat[] {
  return [
    {
      id: 'governance_efficiency',
      name: 'Governance Efficiency',
      base: 10,
      perLevel: 0.05,
      perTier: 0.5,
      description: 'Overall efficiency of administrative procedures, 0–100 scale.',
      subStats: [
        { id: 'policy_speed',        name: 'Policy Implementation Speed', base: 5,  perLevel: 0.04, perTier: 0.4, description: 'How quickly policies are enacted.' },
        { id: 'approval_rating',     name: 'Public Approval Rating',      base: 50, perLevel: 0.01, perTier: 0.1, description: 'Citizen satisfaction with this department.' },
      ],
    },
    {
      id: 'administrative_capacity',
      name: 'Administrative Capacity',
      base: 100,
      perLevel: 0.5,
      perTier: 5,
      description: 'Number of administrative tasks the structure can handle simultaneously.',
      subStats: [
        { id: 'staff_morale',   name: 'Staff Morale',  base: 60, perLevel: 0.02, perTier: 0.2, description: 'Morale of administrative staff.' },
        { id: 'inter_dept_coord', name: 'Inter-Department Coordination', base: 20, perLevel: 0.03, perTier: 0.3, description: 'Efficiency of cross-department cooperation.' },
      ],
    },
    {
      id: 'bureaucratic_output',
      name: 'Bureaucratic Output',
      base: 200,
      perLevel: 1.0,
      perTier: 10,
      description: 'Quantified governmental output (permits, decisions, policies) per cycle.',
      subStats: [
        { id: 'corruption_resistance', name: 'Corruption Resistance', base: 30, perLevel: 0.02, perTier: 0.3, description: 'Resistance to internal corruption.' },
        { id: 'resource_alloc_eff',   name: 'Resource Allocation Efficiency', base: 40, perLevel: 0.03, perTier: 0.4, description: 'Efficiency of resource distribution.' },
      ],
    },
  ];
}

function makeMilitaryStats(): GovBuildingStat[] {
  return [
    {
      id: 'command_authority',
      name: 'Command Authority',
      base: 15,
      perLevel: 0.06,
      perTier: 0.6,
      description: 'Degree of military command authority, 0–100.',
      subStats: [
        { id: 'tactical_readiness',  name: 'Tactical Readiness',  base: 20, perLevel: 0.05, perTier: 0.5, description: 'Combat-readiness of garrisoned forces.' },
        { id: 'logistics_capacity', name: 'Logistics Capacity', base: 80, perLevel: 0.4,  perTier: 4,   description: 'Logistics units supported per cycle.' },
      ],
    },
    {
      id: 'defense_rating',
      name: 'Defense Rating',
      base: 50,
      perLevel: 0.25,
      perTier: 2.5,
      description: 'Structural and garrison defense capability.',
      subStats: [
        { id: 'fortification_bonus', name: 'Fortification Bonus', base: 10, perLevel: 0.05, perTier: 0.5, description: 'Bonus to fortification construction speed.' },
        { id: 'intel_coverage',     name: 'Intelligence Coverage', base: 15, perLevel: 0.03, perTier: 0.4, description: 'Area covered by military intelligence.' },
      ],
    },
  ];
}

function makeEconomicStats(): GovBuildingStat[] {
  return [
    {
      id: 'economic_output',
      name: 'Economic Output',
      base: 500,
      perLevel: 2.5,
      perTier: 25,
      description: 'Total economic production value generated per cycle.',
      subStats: [
        { id: 'trade_volume',   name: 'Trade Volume',   base: 200, perLevel: 1.0, perTier: 10, description: 'Volume of trade transactions processed.' },
        { id: 'tax_efficiency', name: 'Tax Efficiency', base: 50,  perLevel: 0.1, perTier: 1,  description: 'Efficiency of tax collection.' },
      ],
    },
    {
      id: 'financial_stability',
      name: 'Financial Stability',
      base: 60,
      perLevel: 0.03,
      perTier: 0.3,
      description: 'Resistance to economic shocks and budget deficits, 0–100.',
      subStats: [
        { id: 'inflation_control', name: 'Inflation Control', base: 40, perLevel: 0.02, perTier: 0.2, description: 'Ability to curb inflation.' },
        { id: 'credit_rating',    name: 'Credit Rating',    base: 50, perLevel: 0.01, perTier: 0.2, description: 'Government credit standing.' },
      ],
    },
  ];
}

function makeResearchStats(): GovBuildingStat[] {
  return [
    {
      id: 'research_output',
      name: 'Research Output',
      base: 300,
      perLevel: 1.5,
      perTier: 15,
      description: 'Research points generated per cycle.',
      subStats: [
        { id: 'tech_breakthrough_chance', name: 'Tech Breakthrough Chance', base: 5,  perLevel: 0.02, perTier: 0.2, description: 'Probability of a major discovery per cycle, %.' },
        { id: 'researcher_efficiency',   name: 'Researcher Efficiency',   base: 70, perLevel: 0.05, perTier: 0.5, description: 'Output per researcher unit.' },
      ],
    },
    {
      id: 'innovation_index',
      name: 'Innovation Index',
      base: 20,
      perLevel: 0.1,
      perTier: 1,
      description: 'Measure of the structure\'s contribution to technological progress.',
      subStats: [
        { id: 'patent_rate',    name: 'Patent Rate',    base: 10, perLevel: 0.05, perTier: 0.5, description: 'Registered innovations per cycle.' },
        { id: 'knowledge_pool', name: 'Knowledge Pool', base: 100, perLevel: 0.5, perTier: 5,  description: 'Accumulated knowledge units.' },
      ],
    },
  ];
}

function makeDiplomaticStats(): GovBuildingStat[] {
  return [
    {
      id: 'diplomatic_influence',
      name: 'Diplomatic Influence',
      base: 30,
      perLevel: 0.15,
      perTier: 1.5,
      description: 'Influence points generated per cycle for diplomatic actions.',
      subStats: [
        { id: 'alliance_capacity',   name: 'Alliance Capacity',   base: 2,  perLevel: 0.01, perTier: 0.1, description: 'Maximum simultaneous alliance agreements.' },
        { id: 'negotiation_bonus',  name: 'Negotiation Bonus',  base: 10, perLevel: 0.05, perTier: 0.5, description: 'Bonus to all diplomatic negotiations.' },
      ],
    },
    {
      id: 'foreign_relations',
      name: 'Foreign Relations',
      base: 50,
      perLevel: 0.1,
      perTier: 1,
      description: 'Overall health of foreign relations, 0–100.',
      subStats: [
        { id: 'trust_rating',    name: 'Trust Rating',    base: 40, perLevel: 0.02, perTier: 0.2, description: 'Trust level with foreign empires.' },
        { id: 'cultural_spread', name: 'Cultural Spread', base: 20, perLevel: 0.1,  perTier: 1,   description: 'Speed of cultural influence spreading.' },
      ],
    },
  ];
}

function makeGenericAttributes(): GovBuildingAttribute[] {
  return [
    {
      id: 'authority_level',
      name: 'Authority Level',
      value: 1,
      min: 1,
      max: 10,
      description: 'The political authority wielded by this structure.',
      subAttributes: [
        { id: 'jurisdiction_scope', name: 'Jurisdiction Scope', value: 1, min: 1, max: 10, description: 'Geographical/organizational scope of jurisdiction.' },
        { id: 'policy_reach',      name: 'Policy Reach',      value: 1, min: 1, max: 10, description: 'Scope of policies this structure can enact.' },
      ],
    },
    {
      id: 'operational_capacity',
      name: 'Operational Capacity',
      value: 10,
      min: 1,
      max: 100,
      description: 'Number of simultaneous operations this structure can support.',
      subAttributes: [
        { id: 'network_coverage', name: 'Network Coverage',  value: 10, min: 1, max: 100, description: 'Percentage of the empire this structure\'s network covers.' },
        { id: 'influence_radius', name: 'Influence Radius',  value: 5,  min: 1, max: 100, description: 'Effective influence radius in parsecs.' },
      ],
    },
    {
      id: 'funding_level',
      name: 'Funding Level',
      value: 1,
      min: 1,
      max: 10,
      description: 'Funding bracket this structure operates under.',
      subAttributes: [
        { id: 'personnel_count',  name: 'Personnel Count',  value: 10,  min: 1, max: 1000, description: 'Number of personnel assigned.' },
        { id: 'equipment_tier',   name: 'Equipment Tier',   value: 1,   min: 1, max: 99,   description: 'Tier of equipment used in this structure.' },
        { id: 'technology_level', name: 'Technology Level', value: 1,   min: 1, max: 999,  description: 'Technology level of installed systems.' },
      ],
    },
  ];
}

function makeGenericSubjects(domainName: string): GovBuildingSubject[] {
  return [
    {
      id: 'workforce',
      name: 'Workforce',
      description: `Personnel subject to management by the ${domainName}.`,
      details: [
        { id: 'total_staff',      name: 'Total Staff',      description: 'Total number of employees.',             value: 0   },
        { id: 'active_staff',     name: 'Active Staff',     description: 'Staff currently on active duty.',        value: 0   },
        { id: 'training_rate',    name: 'Training Rate',    description: 'New staff trained per cycle.',           value: 0   },
        { id: 'retention_rate',   name: 'Retention Rate',   description: 'Staff retention percentage.',            value: 0   },
      ],
    },
    {
      id: 'budget_allocation',
      name: 'Budget Allocation',
      description: `Financial resources allocated to the ${domainName}.`,
      details: [
        { id: 'annual_budget',   name: 'Annual Budget',   description: 'Total annual credit allocation.',        value: 0 },
        { id: 'capital_budget',  name: 'Capital Budget',  description: 'Funds for infrastructure improvements.', value: 0 },
        { id: 'operating_costs', name: 'Operating Costs', description: 'Recurring operational expenditures.',    value: 0 },
        { id: 'surplus_funds',   name: 'Surplus Funds',   description: 'Unspent budget available for projects.', value: 0 },
      ],
    },
    {
      id: 'policy_subjects',
      name: 'Policy Subjects',
      description: `Active policy areas governed by the ${domainName}.`,
      details: [
        { id: 'active_policies',   name: 'Active Policies',   description: 'Number of currently active policies.',   value: 0 },
        { id: 'pending_policies',  name: 'Pending Policies',  description: 'Policies awaiting approval.',            value: 0 },
        { id: 'policy_violations', name: 'Policy Violations', description: 'Recorded violations this cycle.',        value: 0 },
        { id: 'enforcement_rate',  name: 'Enforcement Rate',  description: 'Policy enforcement success rate, %.',    value: 0 },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-Category definitions (32 total)
// ---------------------------------------------------------------------------

export const GOVERNMENT_BUILDING_SUB_CATEGORIES: GovBuildingSubCategory[] = [
  // ---- 1. Administrative Center (2 sub-categories) ----
  {
    id: 'central-admin-office',
    name: 'Central Administration Office',
    categoryId: 'administrative-center',
    class: 'administrative', subClass: 'governance',
    type: 'headquarters',    subType: 'primary',
    description: 'The main administrative headquarters that coordinates all governmental operations empire-wide.',
    details: {
      overview: 'The Central Administration Office serves as the nerve center of the imperial government, coordinating all top-level policy decisions.',
      history: 'Established at the founding of the empire to centralize authority and streamline governance across star systems.',
      functionality: 'Processes empire-wide administrative directives, manages inter-ministry coordination, and monitors compliance.',
      requirements: 'Requires a settled star system and a minimum planetary population of 1,000 colonists.',
      subDescriptions: [
        { id: 'arch',     title: 'Architecture',   text: 'A grand multi-story structure featuring secure council chambers and a central command spire.' },
        { id: 'security', title: 'Security',        text: 'Protected by shielded walls, biometric access, and a dedicated security garrison.' },
        { id: 'tech',     title: 'Technology',      text: 'Equipped with quantum-encrypted communication networks and AI-assisted decision systems.' },
        { id: 'culture',  title: 'Cultural Significance', text: 'Symbolizes the seat of imperial power and is often a landmark of the capital.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Central Administration Office'),
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'regional-governance-post',
    name: 'Regional Governance Post',
    categoryId: 'administrative-center',
    class: 'administrative', subClass: 'governance',
    type: 'branch',          subType: 'secondary',
    description: 'A regional outpost of the central administration that governs a cluster of star systems.',
    details: {
      overview: 'Regional Governance Posts extend central authority across far-flung star systems, ensuring consistent governance.',
      history: 'Deployed as the empire expanded beyond its home system to maintain cohesive rule over distant territories.',
      functionality: 'Implements central policies locally, collects regional data, and resolves inter-system disputes.',
      requirements: 'Requires a developed colony with tier 5+ infrastructure.',
      subDescriptions: [
        { id: 'scale',   title: 'Scale',         text: 'Smaller than the central office but equipped with equivalent communication and decision tools.' },
        { id: 'autonomy', title: 'Autonomy',      text: 'Operates with moderate autonomy, reporting to the Central Administration quarterly.' },
        { id: 'reach',   title: 'Regional Reach', text: 'Governs up to 12 star systems within its designated administrative zone.' },
        { id: 'liaison', title: 'Liaison Role',   text: 'Acts as a diplomatic liaison between local populations and imperial authorities.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Regional Governance Post'),
    minTier: 1, maxTier: 66, minLevel: 1, maxLevel: 666,
  },

  // ---- 2. Legislative Assembly (2 sub-categories) ----
  {
    id: 'senate-chamber',
    name: 'Senate Chamber',
    categoryId: 'legislative-assembly',
    class: 'administrative', subClass: 'legislative',
    type: 'complex',         subType: 'primary',
    description: 'The supreme legislative body where senators deliberate and enact imperial law.',
    details: {
      overview: 'The Senate Chamber is where elected and appointed senators debate, draft, and ratify imperial legislation.',
      history: 'Modeled after ancient democratic assemblies, adapted for interstellar governance.',
      functionality: 'Drafts legislation, ratifies treaties, and provides oversight of the executive branch.',
      requirements: 'Requires a stable government with democratic or representative elements.',
      subDescriptions: [
        { id: 'chamber',   title: 'Chamber Design',  text: 'A grand amphitheater-style hall designed to seat hundreds of senators from across the empire.' },
        { id: 'debate',    title: 'Debate Protocols', text: 'Follows strict rules of order to ensure fair and efficient legislative debate.' },
        { id: 'records',   title: 'Legislative Records', text: 'Maintains a permanent archive of all laws enacted.' },
        { id: 'broadcast', title: 'Public Broadcast',  text: 'All sessions are broadcast live across the empire to ensure transparency.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Senate Chamber'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'council-hall',
    name: 'Council Hall',
    categoryId: 'legislative-assembly',
    class: 'administrative', subClass: 'legislative',
    type: 'center',          subType: 'secondary',
    description: 'A regional legislative council hall where local laws and regulations are drafted.',
    details: {
      overview: 'The Council Hall convenes regional representatives to address local governance and legislative needs.',
      history: 'Developed to decentralize governance and give voice to regional populations.',
      functionality: 'Passes local ordinances and sends representatives to the Senate.',
      requirements: 'Requires a regional governance post at level 50+.',
      subDescriptions: [
        { id: 'membership', title: 'Council Membership', text: 'Composed of elected representatives from each settled planet in the region.' },
        { id: 'jurisdiction', title: 'Jurisdiction',       text: 'Handles matters below the imperial legislative threshold.' },
        { id: 'appeals',    title: 'Appeals Process',    text: 'Decisions can be appealed to the Senate Chamber.' },
        { id: 'community',  title: 'Community Engagement', text: 'Holds regular public hearings to engage local citizens.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Council Hall'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 3. Judicial Court (2 sub-categories) ----
  {
    id: 'supreme-court',
    name: 'Supreme Court',
    categoryId: 'judicial-court',
    class: 'administrative', subClass: 'judicial',
    type: 'headquarters',    subType: 'primary',
    description: 'The highest judicial authority in the empire, adjudicating imperial law and constitutional matters.',
    details: {
      overview: 'The Supreme Court is the apex of the imperial justice system, interpreting law and resolving high-level disputes.',
      history: 'Established to ensure no single ruler could override the rule of law.',
      functionality: 'Reviews appeals from lower courts, rules on constitutional conflicts, and sets legal precedents.',
      requirements: 'Requires a fully established government and at least one lower court tier.',
      subDescriptions: [
        { id: 'bench',     title: 'The Bench',         text: 'Composed of nine senior justices appointed for life terms.' },
        { id: 'precedent', title: 'Legal Precedent',   text: 'Rulings set binding precedent for all lower courts empire-wide.' },
        { id: 'appeal',    title: 'Appeals Process',   text: 'Accepts appeals only from courts of higher jurisdiction.' },
        { id: 'review',    title: 'Constitutional Review', text: 'Has the power to nullify legislation deemed unconstitutional.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Supreme Court'),
    minTier: 10, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'arbitration-tribunal',
    name: 'Arbitration Tribunal',
    categoryId: 'judicial-court',
    class: 'administrative', subClass: 'judicial',
    type: 'facility',        subType: 'secondary',
    description: 'A specialized tribunal handling inter-colony and inter-faction disputes through mediated arbitration.',
    details: {
      overview: 'Arbitration Tribunals provide fast, impartial resolution of disputes without full litigation.',
      history: 'Created to reduce the case backlog in the Supreme Court by resolving lower-stakes disputes efficiently.',
      functionality: 'Arbitrates trade disputes, inter-colony conflicts, and corporate disagreements.',
      requirements: 'Requires a legal framework and diplomatic relations with relevant parties.',
      subDescriptions: [
        { id: 'process', title: 'Arbitration Process', text: 'Uses a panel of three arbiters: one chosen by each party and one neutral.' },
        { id: 'speed',   title: 'Speed of Resolution', text: 'Cases are resolved within 30 cycles, far faster than full litigation.' },
        { id: 'binding', title: 'Binding Rulings',     text: 'Arbitration decisions are binding and enforceable under imperial law.' },
        { id: 'scope',   title: 'Scope',               text: 'Limited to civil and commercial disputes; criminal matters go to higher courts.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Arbitration Tribunal'),
    minTier: 1, maxTier: 60, minLevel: 1, maxLevel: 600,
  },

  // ---- 4. Military Command (2 sub-categories) ----
  {
    id: 'strategic-command-center',
    name: 'Strategic Command Center',
    categoryId: 'military-command',
    class: 'military', subClass: 'command',
    type: 'headquarters', subType: 'primary',
    description: 'The apex military installation for empire-wide strategic planning and force deployment.',
    details: {
      overview: 'The Strategic Command Center coordinates all military branches, plans campaigns, and manages fleet deployments.',
      history: 'Built during the empire\'s first major interstellar conflict to unify command structures.',
      functionality: 'Generates strategic plans, coordinates troop movements, and manages intelligence gathering.',
      requirements: 'Requires a tier 10+ settlement and an active military force.',
      subDescriptions: [
        { id: 'ops_room',  title: 'Operations Room',    text: 'A vast holographic display room where real-time galactic conflicts are visualized.' },
        { id: 'intel',     title: 'Intelligence Wing',  text: 'Houses a dedicated intelligence analysis division.' },
        { id: 'comms',     title: 'Communication Hub',  text: 'Connects to all military installations via quantum-encrypted links.' },
        { id: 'bunker',    title: 'Hardened Bunker',    text: 'Reinforced to withstand direct orbital bombardment.' },
      ],
    },
    stats: makeMilitaryStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Strategic Command Center'),
    minTier: 10, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'tactical-operations-base',
    name: 'Tactical Operations Base',
    categoryId: 'military-command',
    class: 'military', subClass: 'command',
    type: 'facility',    subType: 'secondary',
    description: 'A forward military base for tactical planning and rapid response force management.',
    details: {
      overview: 'Tactical Operations Bases serve as regional military hubs, supporting front-line forces with planning and supply.',
      history: 'Developed to extend strategic command reach into contested territories.',
      functionality: 'Coordinates local defense, stages troop deployments, and relays orders from the Strategic Command Center.',
      requirements: 'Requires a colony with active defense installations.',
      subDescriptions: [
        { id: 'garrison',  title: 'Garrison Capacity',  text: 'Can house up to 10,000 troops and support vehicles.' },
        { id: 'staging',   title: 'Staging Area',       text: 'Includes landing pads and orbital launch facilities.' },
        { id: 'medical',   title: 'Medical Bay',        text: 'Equipped to treat battlefield casualties on-site.' },
        { id: 'logistics', title: 'Logistics Support',  text: 'Manages supply chains for nearby military units.' },
      ],
    },
    stats: makeMilitaryStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Tactical Operations Base'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 800,
  },

  // ---- 5. Economic Bureau (2 sub-categories) ----
  {
    id: 'treasury-department',
    name: 'Treasury Department',
    categoryId: 'economic-bureau',
    class: 'economic', subClass: 'commerce',
    type: 'headquarters', subType: 'primary',
    description: 'The empire\'s central fiscal authority managing revenue, expenditure, and monetary policy.',
    details: {
      overview: 'The Treasury Department oversees the imperial budget, tax policy, and financial stability.',
      history: 'Formed when the empire required a central body to manage interstellar trade revenues.',
      functionality: 'Collects taxes, manages the imperial reserve, and funds government operations.',
      requirements: 'Requires an established economy with active resource production.',
      subDescriptions: [
        { id: 'vault',    title: 'Imperial Vault',       text: 'Houses vast reserves of credits and rare materials.' },
        { id: 'mint',     title: 'Imperial Mint',        text: 'Issues the official imperial currency.' },
        { id: 'audit',    title: 'Audit Division',       text: 'Conducts regular audits of all government departments.' },
        { id: 'forecast', title: 'Economic Forecasting', text: 'Uses predictive AI to model future economic conditions.' },
      ],
    },
    stats: makeEconomicStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Treasury Department'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'trade-regulation-office',
    name: 'Trade Regulation Office',
    categoryId: 'economic-bureau',
    class: 'economic', subClass: 'commerce',
    type: 'office',      subType: 'secondary',
    description: 'Regulates interstellar trade, sets tariffs, and enforces fair commerce laws.',
    details: {
      overview: 'The Trade Regulation Office ensures fair trade practices and prevents monopolistic abuses.',
      history: 'Established after a series of trade wars destabilized the early interstellar economy.',
      functionality: 'Issues trade licenses, sets import/export tariffs, and investigates trade violations.',
      requirements: 'Requires an active trade network between at least three star systems.',
      subDescriptions: [
        { id: 'licensing', title: 'Trade Licensing',  text: 'All interstellar traders must be registered and licensed by this office.' },
        { id: 'tariffs',   title: 'Tariff System',    text: 'Manages a tiered tariff structure based on goods category and origin.' },
        { id: 'enforcement', title: 'Enforcement',    text: 'Has authority to seize contraband and impose trade sanctions.' },
        { id: 'treaties',  title: 'Trade Treaties',   text: 'Negotiates bilateral trade agreements with other factions.' },
      ],
    },
    stats: makeEconomicStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Trade Regulation Office'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 6. Research Institute (2 sub-categories) ----
  {
    id: 'science-academy',
    name: 'Science Academy',
    categoryId: 'research-institute',
    class: 'research', subClass: 'science',
    type: 'institute',   subType: 'primary',
    description: 'The premier scientific institution fostering research excellence and technological innovation.',
    details: {
      overview: 'The Science Academy attracts the brightest minds to push the boundaries of knowledge.',
      history: 'Founded by the empire\'s first science minister to ensure technological supremacy.',
      functionality: 'Conducts fundamental research, awards grants, and publishes findings.',
      requirements: 'Requires a population with high education levels and research infrastructure.',
      subDescriptions: [
        { id: 'labs',     title: 'Research Laboratories', text: 'State-of-the-art labs equipped for every scientific discipline.' },
        { id: 'library',  title: 'Knowledge Repository',  text: 'Stores all imperial scientific discoveries in a quantum data archive.' },
        { id: 'academy',  title: 'Academic Programs',     text: 'Runs degree programs to train the next generation of scientists.' },
        { id: 'collab',   title: 'Collaboration Network', text: 'Maintains research partnerships with allied factions\' institutions.' },
      ],
    },
    stats: makeResearchStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Science Academy'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'technology-research-lab',
    name: 'Technology Research Lab',
    categoryId: 'research-institute',
    class: 'research', subClass: 'science',
    type: 'facility',    subType: 'secondary',
    description: 'An applied research laboratory focused on translating science into practical technologies.',
    details: {
      overview: 'Technology Research Labs convert theoretical research into actionable technologies and products.',
      history: 'Emerged when the empire needed rapid technological application for military and economic needs.',
      functionality: 'Develops prototypes, runs technology trials, and optimizes existing systems.',
      requirements: 'Requires at least one active research project and a Science Academy nearby.',
      subDescriptions: [
        { id: 'proto',   title: 'Prototype Workshop', text: 'Rapid prototyping facilities to build and test early-stage technologies.' },
        { id: 'trials',  title: 'Technology Trials',  text: 'Rigorous testing environments to validate new technologies.' },
        { id: 'patent',  title: 'Patent Office',      text: 'Files patents for all innovations discovered in the lab.' },
        { id: 'collab2', title: 'Industry Links',      text: 'Partners with factories and shipyards to apply new technologies.' },
      ],
    },
    stats: makeResearchStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Technology Research Lab'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 7. Diplomatic Mission (2 sub-categories) ----
  {
    id: 'embassy-complex',
    name: 'Embassy Complex',
    categoryId: 'diplomatic-mission',
    class: 'diplomatic', subClass: 'relations',
    type: 'complex',      subType: 'primary',
    description: 'The primary diplomatic installation establishing formal relations with foreign factions.',
    details: {
      overview: 'Embassy Complexes host ambassadors and diplomatic staff for all recognized foreign factions.',
      history: 'Built as the empire sought peaceful expansion through diplomacy rather than conquest.',
      functionality: 'Manages inter-faction communications, negotiates treaties, and handles diplomatic crises.',
      requirements: 'Requires formal recognition of at least one other faction.',
      subDescriptions: [
        { id: 'chancery',  title: 'Chancery Building',   text: 'Houses the official ambassador and senior diplomatic staff.' },
        { id: 'secure',    title: 'Secure Comms Room',   text: 'Encrypted communication suite for sensitive diplomatic exchanges.' },
        { id: 'cultural',  title: 'Cultural Exchange Center', text: 'Promotes cultural understanding through exhibits and events.' },
        { id: 'guest',     title: 'Guest Quarters',      text: 'Accommodates visiting diplomatic delegations.' },
      ],
    },
    stats: makeDiplomaticStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Embassy Complex'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'trade-delegation-office',
    name: 'Trade Delegation Office',
    categoryId: 'diplomatic-mission',
    class: 'diplomatic', subClass: 'relations',
    type: 'office',       subType: 'secondary',
    description: 'A specialized diplomatic office focused on negotiating and managing trade agreements.',
    details: {
      overview: 'Trade Delegation Offices operate alongside embassies to handle the economic dimension of diplomacy.',
      history: 'Established when trade disputes began to dominate diplomatic relations between factions.',
      functionality: 'Negotiates trade deals, monitors compliance, and resolves commercial disputes.',
      requirements: 'Requires an active Embassy Complex and a Treasury Department.',
      subDescriptions: [
        { id: 'negotiation', title: 'Negotiation Suite',  text: 'Purpose-built conference rooms for trade treaty negotiations.' },
        { id: 'monitor',     title: 'Trade Monitoring',   text: 'Tracks compliance with existing trade agreements in real time.' },
        { id: 'arbitration', title: 'Arbitration Panel',  text: 'A quick-resolution panel for minor trade disagreements.' },
        { id: 'market',      title: 'Market Intelligence', text: 'Gathers and analyzes foreign market data.' },
      ],
    },
    stats: makeDiplomaticStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Trade Delegation Office'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 8. Security Department (2 sub-categories) ----
  {
    id: 'intelligence-bureau',
    name: 'Intelligence Bureau',
    categoryId: 'security-department',
    class: 'security', subClass: 'defense',
    type: 'bureau',      subType: 'primary',
    description: 'The empire\'s premier intelligence agency gathering and analyzing strategic intelligence.',
    details: {
      overview: 'The Intelligence Bureau operates covert networks to safeguard the empire from internal and external threats.',
      history: 'Formed following a major espionage incident that nearly toppled the early government.',
      functionality: 'Runs intelligence networks, conducts counter-espionage, and advises on security threats.',
      requirements: 'Requires a stable government and communication infrastructure.',
      subDescriptions: [
        { id: 'covert',    title: 'Covert Operations',  text: 'Runs classified operations unknown to the general public.' },
        { id: 'analysis',  title: 'Analysis Division',  text: 'Processes raw intelligence into actionable strategic information.' },
        { id: 'counter',   title: 'Counter-Intelligence', text: 'Identifies and neutralizes foreign espionage activities.' },
        { id: 'cyber',     title: 'Cyber Division',     text: 'Conducts offensive and defensive cyber operations.' },
      ],
    },
    stats: makeMilitaryStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Intelligence Bureau'),
    minTier: 10, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'civil-defense-headquarters',
    name: 'Civil Defense Headquarters',
    categoryId: 'security-department',
    class: 'security', subClass: 'defense',
    type: 'headquarters', subType: 'secondary',
    description: 'Coordinates civil defense measures, emergency response, and planetary protection.',
    details: {
      overview: 'Civil Defense HQ prepares civilians and infrastructure for natural disasters and wartime threats.',
      history: 'Created after an orbital strike devastated a key colony during the first interstellar war.',
      functionality: 'Manages civilian evacuation plans, runs defense drills, and coordinates with military forces.',
      requirements: 'Requires a population center with active civil infrastructure.',
      subDescriptions: [
        { id: 'shelter',    title: 'Emergency Shelters',   text: 'Maintains a network of hardened civilian shelters.' },
        { id: 'response',   title: 'Rapid Response Force', text: 'A dedicated team trained to respond within minutes to any threat.' },
        { id: 'broadcast2', title: 'Emergency Broadcasts', text: 'Controls all planetary emergency broadcast systems.' },
        { id: 'stockpile',  title: 'Emergency Stockpiles', text: 'Stores food, water, and medicine for extended emergencies.' },
      ],
    },
    stats: makeMilitaryStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Civil Defense Headquarters'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 800,
  },

  // ---- 9. Infrastructure Authority (2 sub-categories) ----
  {
    id: 'urban-planning-office',
    name: 'Urban Planning Office',
    categoryId: 'infrastructure-authority',
    class: 'infrastructure', subClass: 'operations',
    type: 'office',           subType: 'primary',
    description: 'Designs and oversees the development of settlements and urban centers across the empire.',
    details: {
      overview: 'The Urban Planning Office ensures all settlements are developed efficiently and sustainably.',
      history: 'Established when rapid colonization created chaotic, unplanned settlements requiring remediation.',
      functionality: 'Approves construction permits, designs city layouts, and manages expansion plans.',
      requirements: 'Requires a colony with at least 500 structures.',
      subDescriptions: [
        { id: 'zoning',  title: 'Zoning Regulations',  text: 'Enforces strict zoning laws to prevent residential/industrial conflicts.' },
        { id: 'design',  title: 'City Design Bureau',  text: 'Employs master architects to design optimal city configurations.' },
        { id: 'green',   title: 'Green Spaces',         text: 'Mandates minimum green space ratios in all new developments.' },
        { id: 'heritage2', title: 'Heritage Preservation', text: 'Protects historically significant buildings and districts.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Urban Planning Office'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },
  {
    id: 'construction-management-bureau',
    name: 'Construction Management Bureau',
    categoryId: 'infrastructure-authority',
    class: 'infrastructure', subClass: 'operations',
    type: 'bureau',           subType: 'secondary',
    description: 'Manages all large-scale construction projects across the empire, from habitats to megastructures.',
    details: {
      overview: 'The Construction Management Bureau ensures all imperial construction projects are completed on time and budget.',
      history: 'Created after numerous construction overruns wasted significant imperial resources.',
      functionality: 'Bids out construction contracts, manages construction crews, and audits project completion.',
      requirements: 'Requires active construction projects in at least two star systems.',
      subDescriptions: [
        { id: 'contract',  title: 'Contract Management', text: 'Issues and oversees construction contracts with private firms.' },
        { id: 'safety',    title: 'Safety Standards',    text: 'Enforces construction safety protocols empire-wide.' },
        { id: 'timeline',  title: 'Timeline Tracking',   text: 'Maintains real-time dashboards of all ongoing projects.' },
        { id: 'budget2',   title: 'Budget Control',      text: 'Prevents cost overruns through rigorous financial oversight.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Construction Management Bureau'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 10. Resource Management (2 sub-categories) ----
  {
    id: 'mining-oversight-bureau',
    name: 'Mining Oversight Bureau',
    categoryId: 'resource-management',
    class: 'economic', subClass: 'resources',
    type: 'bureau',    subType: 'primary',
    description: 'Oversees all mining operations, resource extraction quotas, and environmental compliance.',
    details: {
      overview: 'Ensures the empire\'s resource extraction is efficient, sustainable, and properly taxed.',
      history: 'Created when unregulated mining began to exhaust key asteroid belts.',
      functionality: 'Issues mining licenses, sets extraction quotas, and monitors environmental impact.',
      requirements: 'Requires active mining installations and resource extraction operations.',
      subDescriptions: [
        { id: 'quota',   title: 'Extraction Quotas', text: 'Sets quarterly quotas for each resource category.' },
        { id: 'env',     title: 'Environmental Monitoring', text: 'Monitors planetary ecosystems for mining-related damage.' },
        { id: 'license', title: 'Mining Licenses',   text: 'All mining operations require a valid license from this bureau.' },
        { id: 'safety2', title: 'Worker Safety',     text: 'Enforces safety standards in all extraction operations.' },
      ],
    },
    stats: makeEconomicStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Mining Oversight Bureau'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 800,
  },
  {
    id: 'resource-distribution-center',
    name: 'Resource Distribution Center',
    categoryId: 'resource-management',
    class: 'economic', subClass: 'resources',
    type: 'center',    subType: 'secondary',
    description: 'Coordinates the distribution of raw and processed resources across the empire.',
    details: {
      overview: 'Resource Distribution Centers ensure no colony faces critical shortages by managing supply chains.',
      history: 'Built after supply chain failures caused multiple colony collapses during rapid expansion.',
      functionality: 'Routes resources to where they are needed, maintains emergency stockpiles, and manages trade surpluses.',
      requirements: 'Requires resource production at multiple star systems.',
      subDescriptions: [
        { id: 'routing',  title: 'Resource Routing',   text: 'Uses AI logistics to optimally route resources across the empire.' },
        { id: 'reserve',  title: 'Strategic Reserves', text: 'Maintains a 90-cycle supply reserve for critical resources.' },
        { id: 'surplus',  title: 'Surplus Trading',    text: 'Sells surplus resources on the open market to maximize revenue.' },
        { id: 'emergency', title: 'Emergency Response', text: 'Redirects resources immediately in case of colony emergencies.' },
      ],
    },
    stats: makeEconomicStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Resource Distribution Center'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 11. Education Ministry (2 sub-categories) ----
  {
    id: 'university-campus',
    name: 'University Campus',
    categoryId: 'education-ministry',
    class: 'research', subClass: 'education',
    type: 'complex',   subType: 'primary',
    description: 'A major higher education institution training future leaders, scientists, and administrators.',
    details: {
      overview: 'University Campuses provide the empire with a steady stream of educated professionals.',
      history: 'Modeled after ancient centers of learning, elevated to interstellar scale.',
      functionality: 'Offers degree programs in all disciplines, conducts research, and supplies trained graduates to government.',
      requirements: 'Requires a population of at least 10,000 and a stable education funding stream.',
      subDescriptions: [
        { id: 'faculty',   title: 'Faculty of Sciences',  text: 'Largest faculty covering physics, engineering, and xenobiology.' },
        { id: 'library2',  title: 'Grand Library',        text: 'One of the most comprehensive knowledge repositories in the empire.' },
        { id: 'residence', title: 'Student Residences',   text: 'Houses students from across the empire and allied factions.' },
        { id: 'sports',    title: 'Athletics Complex',    text: 'Promotes physical and mental wellness among the student body.' },
      ],
    },
    stats: makeResearchStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('University Campus'),
    minTier: 5, maxTier: 90, minLevel: 1, maxLevel: 900,
  },
  {
    id: 'training-academy',
    name: 'Training Academy',
    categoryId: 'education-ministry',
    class: 'research', subClass: 'education',
    type: 'academy',   subType: 'secondary',
    description: 'A vocational and professional training institution producing skilled workers for key industries.',
    details: {
      overview: 'Training Academies bridge the gap between basic education and the specialized workforce needs of the empire.',
      history: 'Established to address skilled labor shortages during periods of rapid industrialization.',
      functionality: 'Runs short- and medium-term training programs in engineering, medicine, administration, and the military.',
      requirements: 'Requires a basic education system at level 10+.',
      subDescriptions: [
        { id: 'workshop',  title: 'Training Workshops',  text: 'Hands-on workshops equipped with the latest tools and simulations.' },
        { id: 'placement', title: 'Job Placement Office', text: 'Connects graduates with government and private sector employers.' },
        { id: 'certify',   title: 'Certification Programs', text: 'Issues professional certifications recognized empire-wide.' },
        { id: 'coop',      title: 'Cooperative Programs', text: 'Partnerships with industry provide on-the-job training.' },
      ],
    },
    stats: makeResearchStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Training Academy'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 12. Healthcare Administration (2 sub-categories) ----
  {
    id: 'medical-authority-hq',
    name: 'Medical Authority Headquarters',
    categoryId: 'healthcare-administration',
    class: 'administrative', subClass: 'health',
    type: 'headquarters',    subType: 'primary',
    description: 'The central body overseeing all healthcare policy, medical research, and public health systems.',
    details: {
      overview: 'The Medical Authority ensures the empire\'s population remains healthy and productive.',
      history: 'Formed after a pandemic threatened to collapse the early colonial population.',
      functionality: 'Sets medical standards, funds research, and manages the imperial hospital network.',
      requirements: 'Requires a stable colony with basic healthcare infrastructure.',
      subDescriptions: [
        { id: 'std',    title: 'Medical Standards',   text: 'Establishes and enforces standards for all medical practitioners.' },
        { id: 'research2', title: 'Medical Research',  text: 'Funds and coordinates research into new treatments and cures.' },
        { id: 'pandemic', title: 'Pandemic Response', text: 'Maintains protocols for rapid response to disease outbreaks.' },
        { id: 'pharma',  title: 'Pharmaceutical Control', text: 'Regulates the production and distribution of medical supplies.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Medical Authority Headquarters'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'public-health-center',
    name: 'Public Health Center',
    categoryId: 'healthcare-administration',
    class: 'administrative', subClass: 'health',
    type: 'center',          subType: 'secondary',
    description: 'A community health facility providing preventive care, screenings, and health education.',
    details: {
      overview: 'Public Health Centers are the front line of the empire\'s healthcare system, serving local populations.',
      history: 'Deployed across colonies to reduce hospital burdens with preventive care programs.',
      functionality: 'Provides vaccinations, health screenings, and wellness programs.',
      requirements: 'Requires a settled colony with at least 1,000 residents.',
      subDescriptions: [
        { id: 'clinic',  title: 'Community Clinic',    text: 'Provides day-to-day medical care for minor ailments.' },
        { id: 'screen',  title: 'Screening Programs',  text: 'Regular mass screening programs for common interstellar diseases.' },
        { id: 'wellness', title: 'Wellness Programs',  text: 'Promotes mental and physical wellness through lifestyle programs.' },
        { id: 'edu2',    title: 'Health Education',    text: 'Educates the public on disease prevention and healthy living.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Public Health Center'),
    minTier: 1, maxTier: 60, minLevel: 1, maxLevel: 600,
  },

  // ---- 13. Cultural Preservation (2 sub-categories) ----
  {
    id: 'archive-museum-complex',
    name: 'Archive & Museum Complex',
    categoryId: 'cultural-preservation',
    class: 'cultural', subClass: 'heritage',
    type: 'complex',   subType: 'primary',
    description: 'A grand repository preserving the empire\'s cultural heritage, artifacts, and historical records.',
    details: {
      overview: 'The Archive & Museum Complex is the cultural heart of the empire, preserving its history for future generations.',
      history: 'Built to ensure that the empire\'s diverse cultural origins are not lost as civilization spreads across the stars.',
      functionality: 'Stores artifacts, maintains historical records, and educates the public about imperial history.',
      requirements: 'Requires a colony with at least 50 cycles of history and cultural development.',
      subDescriptions: [
        { id: 'archive2',  title: 'Imperial Archive',  text: 'Stores millions of documents, holorecordings, and artifacts.' },
        { id: 'exhibits',  title: 'Public Exhibits',   text: 'Rotating exhibits showcase different periods of imperial history.' },
        { id: 'restore',   title: 'Restoration Lab',   text: 'Restores damaged artifacts and ancient documents.' },
        { id: 'digital',   title: 'Digital Preservation', text: 'Digitizes all physical artifacts for permanent digital storage.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Archive & Museum Complex'),
    minTier: 5, maxTier: 90, minLevel: 1, maxLevel: 900,
  },
  {
    id: 'arts-council',
    name: 'Arts Council',
    categoryId: 'cultural-preservation',
    class: 'cultural', subClass: 'heritage',
    type: 'council',   subType: 'secondary',
    description: 'Promotes and funds the arts across the empire, supporting cultural diversity and creative expression.',
    details: {
      overview: 'The Arts Council nurtures creative talent and ensures the arts remain a vital part of imperial culture.',
      history: 'Established after cultural homogenization threatened the empire\'s diverse artistic traditions.',
      functionality: 'Awards cultural grants, organizes festivals, and protects artistic freedom.',
      requirements: 'Requires a stable settlement with a sufficient population base.',
      subDescriptions: [
        { id: 'grants',   title: 'Cultural Grants',    text: 'Awards competitive grants to artists and cultural organizations.' },
        { id: 'festivals', title: 'Annual Festivals',  text: 'Organizes empire-wide cultural festivals celebrating diversity.' },
        { id: 'freedom',  title: 'Artistic Freedom',   text: 'Safeguards artists from political interference.' },
        { id: 'export',   title: 'Cultural Exports',   text: 'Promotes imperial art in foreign markets to enhance soft power.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Arts Council'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 14. Communication Hub (2 sub-categories) ----
  {
    id: 'broadcast-network-center',
    name: 'Broadcast Network Center',
    categoryId: 'communication-hub',
    class: 'infrastructure', subClass: 'communications',
    type: 'center',          subType: 'primary',
    description: 'The central broadcast and communication facility connecting all colonies in real time.',
    details: {
      overview: 'The Broadcast Network Center manages all imperial media and communications infrastructure.',
      history: 'Built to unify the empire\'s fragmented communication networks into a single coherent system.',
      functionality: 'Manages news broadcasts, government announcements, and emergency communications.',
      requirements: 'Requires a quantum communication array at tier 5+.',
      subDescriptions: [
        { id: 'studios',  title: 'Broadcast Studios',  text: 'State-of-the-art studios for producing imperial media content.' },
        { id: 'array',    title: 'Quantum Array',      text: 'A massive quantum communication array with galaxy-wide reach.' },
        { id: 'censor',   title: 'Content Standards',  text: 'Maintains standards for all broadcast content.' },
        { id: 'emerg2',   title: 'Emergency Protocols', text: 'Can seize all broadcast channels in a national emergency.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Broadcast Network Center'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'data-relay-station',
    name: 'Data Relay Station',
    categoryId: 'communication-hub',
    class: 'infrastructure', subClass: 'communications',
    type: 'station',         subType: 'secondary',
    description: 'A relay station that amplifies and routes imperial data communications across star systems.',
    details: {
      overview: 'Data Relay Stations form the backbone of the empire\'s interstellar communication network.',
      history: 'Constructed progressively as the empire expanded, each station extending communication range.',
      functionality: 'Amplifies quantum signals, routes data packets, and maintains network uptime.',
      requirements: 'Requires placement in a strategic orbital position.',
      subDescriptions: [
        { id: 'relay',   title: 'Signal Relay',       text: 'Boosts signal strength across interstellar distances.' },
        { id: 'encrypt', title: 'Encryption Systems', text: 'Encrypts all passing data to prevent interception.' },
        { id: 'monitor2', title: 'Network Monitoring', text: 'Monitors data traffic for anomalies and intrusions.' },
        { id: 'backup',  title: 'Backup Routing',     text: 'Provides redundant routing paths if primary routes fail.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Data Relay Station'),
    minTier: 1, maxTier: 75, minLevel: 1, maxLevel: 750,
  },

  // ---- 15. Transportation Authority (1 sub-category) ----
  {
    id: 'starport-administration',
    name: 'Starport Administration',
    categoryId: 'transportation-authority',
    class: 'infrastructure', subClass: 'transit',
    type: 'authority',       subType: 'primary',
    description: 'Administers all starport operations, fleet traffic, and interstellar transit lanes.',
    details: {
      overview: 'Starport Administration ensures safe and efficient movement of ships and goods across the empire.',
      history: 'Created when the volume of interstellar traffic demanded centralized traffic management.',
      functionality: 'Issues transit permits, manages docking assignments, and enforces starport regulations.',
      requirements: 'Requires a functioning starport at tier 3+.',
      subDescriptions: [
        { id: 'traffic',  title: 'Traffic Control',    text: 'Manages all incoming and outgoing vessel movements.' },
        { id: 'customs',  title: 'Customs & Inspection', text: 'Conducts cargo inspections for contraband and safety compliance.' },
        { id: 'schedules', title: 'Flight Scheduling',  text: 'Coordinates civilian and commercial departure windows.' },
        { id: 'fees',     title: 'Port Fees',           text: 'Collects docking and transit fees for the imperial treasury.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Starport Administration'),
    minTier: 1, maxTier: 80, minLevel: 1, maxLevel: 800,
  },

  // ---- 16. Energy Commission (1 sub-category) ----
  {
    id: 'power-grid-authority',
    name: 'Power Grid Authority',
    categoryId: 'energy-commission',
    class: 'infrastructure', subClass: 'energy',
    type: 'authority',       subType: 'primary',
    description: 'Regulates and manages the empire\'s energy production and distribution network.',
    details: {
      overview: 'The Power Grid Authority ensures stable, reliable energy supply to all imperial installations.',
      history: 'Established following catastrophic power failures that disabled multiple colonies.',
      functionality: 'Manages power generation quotas, oversees energy distribution, and prevents blackouts.',
      requirements: 'Requires active energy production at tier 3+ and distribution infrastructure.',
      subDescriptions: [
        { id: 'grid',    title: 'Grid Management',     text: 'Monitors the entire energy grid in real time.' },
        { id: 'reserve2', title: 'Power Reserves',     text: 'Maintains emergency power reserves for critical installations.' },
        { id: 'renew',   title: 'Renewable Mandate',   text: 'Promotes renewable energy through incentives and regulations.' },
        { id: 'tariff2', title: 'Energy Tariffs',      text: 'Sets fair energy pricing to prevent exploitation.' },
      ],
    },
    stats: makeEconomicStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Power Grid Authority'),
    minTier: 1, maxTier: 85, minLevel: 1, maxLevel: 850,
  },

  // ---- 17. Environmental Agency (1 sub-category) ----
  {
    id: 'planetary-ecology-office',
    name: 'Planetary Ecology Office',
    categoryId: 'environmental-agency',
    class: 'infrastructure', subClass: 'environment',
    type: 'office',          subType: 'primary',
    description: 'Protects planetary ecosystems and enforces environmental regulations empire-wide.',
    details: {
      overview: 'The Planetary Ecology Office ensures colonization and development do not permanently harm planetary biospheres.',
      history: 'Founded after a terraforming project accidentally destroyed a unique alien ecosystem.',
      functionality: 'Conducts environmental impact assessments, enforces regulations, and manages restoration projects.',
      requirements: 'Requires any colonized planet with a native or cultivated biosphere.',
      subDescriptions: [
        { id: 'assess',   title: 'Impact Assessment',  text: 'Mandatory environmental assessments for all development projects.' },
        { id: 'protect',  title: 'Protected Zones',    text: 'Designates and enforces protected ecological zones on each planet.' },
        { id: 'restore2', title: 'Restoration Projects', text: 'Manages biosphere restoration for damaged ecosystems.' },
        { id: 'report',   title: 'Environmental Reports', text: 'Publishes annual environmental health reports for each colony.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Planetary Ecology Office'),
    minTier: 1, maxTier: 80, minLevel: 1, maxLevel: 800,
  },

  // ---- 18. Space Development Authority (1 sub-category) ----
  {
    id: 'colonization-office',
    name: 'Colonization Office',
    categoryId: 'space-development-authority',
    class: 'infrastructure', subClass: 'space',
    type: 'office',          subType: 'primary',
    description: 'Plans and manages the colonization of new star systems, coordinating all expansion efforts.',
    details: {
      overview: 'The Colonization Office is the driving force behind the empire\'s expansion into uncharted space.',
      history: 'Formed at the dawn of the empire\'s interstellar era to give structure to colonization efforts.',
      functionality: 'Selects colonization targets, allocates colony ships, and supports new settlements through their early phases.',
      requirements: 'Requires at least one functioning colony ship and a mapped candidate system.',
      subDescriptions: [
        { id: 'survey',  title: 'Survey Division',     text: 'Analyzes planets for habitability and resource potential.' },
        { id: 'colonist', title: 'Colonist Recruitment', text: 'Manages the selection and training of colonist populations.' },
        { id: 'supply3', title: 'Supply Chain',        text: 'Ensures new colonies receive critical supplies in their first cycles.' },
        { id: 'govern',  title: 'Colonial Governance', text: 'Establishes provisional governance for newly settled systems.' },
      ],
    },
    stats: makeAdminStats(),
    attributes: makeGenericAttributes(),
    subjects: makeGenericSubjects('Colonization Office'),
    minTier: 5, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
];

// ---------------------------------------------------------------------------
// Category definitions (18 total)
// ---------------------------------------------------------------------------

export const GOVERNMENT_BUILDING_CATEGORIES: GovBuildingCategory[] = [
  {
    id: 'administrative-center',
    name: 'Administrative Center',
    class: 'administrative', subClass: 'governance',
    type: 'headquarters',    subType: 'primary',
    description: 'Top-level administrative structures coordinating governance across star systems.',
    subCategoryIds: ['central-admin-office', 'regional-governance-post'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'legislative-assembly',
    name: 'Legislative Assembly',
    class: 'administrative', subClass: 'legislative',
    type: 'complex',         subType: 'primary',
    description: 'Legislative bodies responsible for drafting and ratifying imperial law.',
    subCategoryIds: ['senate-chamber', 'council-hall'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'judicial-court',
    name: 'Judicial Court',
    class: 'administrative', subClass: 'judicial',
    type: 'headquarters',    subType: 'primary',
    description: 'Judicial institutions upholding the rule of law and resolving disputes.',
    subCategoryIds: ['supreme-court', 'arbitration-tribunal'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'military-command',
    name: 'Military Command',
    class: 'military',       subClass: 'command',
    type: 'headquarters',    subType: 'primary',
    description: 'Command and control structures directing imperial armed forces.',
    subCategoryIds: ['strategic-command-center', 'tactical-operations-base'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'economic-bureau',
    name: 'Economic Bureau',
    class: 'economic',       subClass: 'commerce',
    type: 'bureau',          subType: 'primary',
    description: 'Financial and trade regulation structures managing the imperial economy.',
    subCategoryIds: ['treasury-department', 'trade-regulation-office'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'research-institute',
    name: 'Research Institute',
    class: 'research',       subClass: 'science',
    type: 'institute',       subType: 'primary',
    description: 'Scientific and technological research institutions advancing imperial knowledge.',
    subCategoryIds: ['science-academy', 'technology-research-lab'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'diplomatic-mission',
    name: 'Diplomatic Mission',
    class: 'diplomatic',     subClass: 'relations',
    type: 'complex',         subType: 'primary',
    description: 'Diplomatic structures managing inter-faction relations and negotiations.',
    subCategoryIds: ['embassy-complex', 'trade-delegation-office'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'security-department',
    name: 'Security Department',
    class: 'security',       subClass: 'defense',
    type: 'headquarters',    subType: 'primary',
    description: 'Intelligence and civil defense structures safeguarding the empire.',
    subCategoryIds: ['intelligence-bureau', 'civil-defense-headquarters'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'infrastructure-authority',
    name: 'Infrastructure Authority',
    class: 'infrastructure', subClass: 'operations',
    type: 'authority',       subType: 'primary',
    description: 'Planning and construction management structures overseeing imperial development.',
    subCategoryIds: ['urban-planning-office', 'construction-management-bureau'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'resource-management',
    name: 'Resource Management',
    class: 'economic',       subClass: 'resources',
    type: 'bureau',          subType: 'primary',
    description: 'Structures overseeing the extraction, processing, and distribution of resources.',
    subCategoryIds: ['mining-oversight-bureau', 'resource-distribution-center'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'education-ministry',
    name: 'Education Ministry',
    class: 'research',       subClass: 'education',
    type: 'institute',       subType: 'primary',
    description: 'Educational institutions training the empire\'s workforce and leadership.',
    subCategoryIds: ['university-campus', 'training-academy'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'healthcare-administration',
    name: 'Healthcare Administration',
    class: 'administrative', subClass: 'health',
    type: 'headquarters',    subType: 'primary',
    description: 'Health management structures maintaining the well-being of the imperial population.',
    subCategoryIds: ['medical-authority-hq', 'public-health-center'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'cultural-preservation',
    name: 'Cultural Preservation',
    class: 'cultural',       subClass: 'heritage',
    type: 'complex',         subType: 'primary',
    description: 'Institutions preserving and promoting the empire\'s cultural heritage.',
    subCategoryIds: ['archive-museum-complex', 'arts-council'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'communication-hub',
    name: 'Communication Hub',
    class: 'infrastructure', subClass: 'communications',
    type: 'hub',             subType: 'primary',
    description: 'Communication and media structures connecting the empire across star systems.',
    subCategoryIds: ['broadcast-network-center', 'data-relay-station'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'transportation-authority',
    name: 'Transportation Authority',
    class: 'infrastructure', subClass: 'transit',
    type: 'authority',       subType: 'primary',
    description: 'Transit management structures coordinating all interstellar transportation.',
    subCategoryIds: ['starport-administration'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'energy-commission',
    name: 'Energy Commission',
    class: 'infrastructure', subClass: 'energy',
    type: 'commission',      subType: 'primary',
    description: 'Energy regulation and distribution structures powering the empire.',
    subCategoryIds: ['power-grid-authority'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'environmental-agency',
    name: 'Environmental Agency',
    class: 'infrastructure', subClass: 'environment',
    type: 'office',          subType: 'primary',
    description: 'Environmental protection structures safeguarding planetary ecosystems.',
    subCategoryIds: ['planetary-ecology-office'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
  {
    id: 'space-development-authority',
    name: 'Space Development Authority',
    class: 'infrastructure', subClass: 'space',
    type: 'authority',       subType: 'primary',
    description: 'Colonization and space development structures driving imperial expansion.',
    subCategoryIds: ['colonization-office'],
    minTier: 1, maxTier: 99, minLevel: 1, maxLevel: 999,
  },
];

// ---------------------------------------------------------------------------
// Index maps for fast lookup
// ---------------------------------------------------------------------------

export const GOVERNMENT_BUILDING_CATEGORY_MAP: Record<string, GovBuildingCategory> =
  Object.fromEntries(GOVERNMENT_BUILDING_CATEGORIES.map(c => [c.id, c]));

export const GOVERNMENT_BUILDING_SUB_CATEGORY_MAP: Record<string, GovBuildingSubCategory> =
  Object.fromEntries(GOVERNMENT_BUILDING_SUB_CATEGORIES.map(s => [s.id, s]));

// ---------------------------------------------------------------------------
// Utility: calculate stat value at a given level and tier
// ---------------------------------------------------------------------------

/** Shared calculation helper — clamps level/tier then applies additive scaling. */
function calcScaledValue(
  base: number,
  perLevel: number,
  perTier: number,
  level: number,
  tier: number,
): number {
  const clampedLevel = Math.max(GOV_BUILDING_MIN_LEVEL, Math.min(GOV_BUILDING_MAX_LEVEL, level));
  const clampedTier  = Math.max(GOV_BUILDING_MIN_TIER,  Math.min(GOV_BUILDING_MAX_TIER,  tier));
  return base + perLevel * clampedLevel + perTier * clampedTier;
}

export function calcGovBuildingStatValue(
  stat: GovBuildingStat,
  level: number,
  tier: number,
): number {
  return calcScaledValue(stat.base, stat.perLevel, stat.perTier, level, tier);
}

export function calcGovBuildingSubStatValue(
  subStat: GovBuildingSubStat,
  level: number,
  tier: number,
): number {
  return calcScaledValue(subStat.base, subStat.perLevel, subStat.perTier, level, tier);
}

// ---------------------------------------------------------------------------
// Utility: get tier range label
// ---------------------------------------------------------------------------

export function getTierRangeLabel(tier: number): string {
  for (const range of Object.values(TIER_RANGE_LABELS)) {
    if (tier >= range.min && tier <= range.max) return range.label;
  }
  return 'Unknown';
}

// ---------------------------------------------------------------------------
// Utility: get level range label
// ---------------------------------------------------------------------------

export function getLevelRangeLabel(level: number): string {
  for (const range of Object.values(LEVEL_RANGE_LABELS)) {
    if (level >= range.min && level <= range.max) return range.label;
  }
  return 'Unknown';
}

// ---------------------------------------------------------------------------
// Utility: get rank for a given building level
// ---------------------------------------------------------------------------

export function getGovBuildingRankForLevel(level: number): GovBuildingRank {
  const sorted = [...GOVERNMENT_BUILDING_RANKS].sort((a, b) => b.requiredLevel - a.requiredLevel);
  for (const rank of sorted) {
    if (level >= rank.requiredLevel) return rank;
  }
  return GOVERNMENT_BUILDING_RANKS[0];
}

// ---------------------------------------------------------------------------
// Utility: filter sub-categories by class
// ---------------------------------------------------------------------------

export function getSubCategoriesByClass(cls: GovBuildingClass): GovBuildingSubCategory[] {
  return GOVERNMENT_BUILDING_SUB_CATEGORIES.filter(s => s.class === cls);
}

// ---------------------------------------------------------------------------
// Utility: filter sub-categories by type
// ---------------------------------------------------------------------------

export function getSubCategoriesByType(type: GovBuildingType): GovBuildingSubCategory[] {
  return GOVERNMENT_BUILDING_SUB_CATEGORIES.filter(s => s.type === type);
}

// ---------------------------------------------------------------------------
// Utility: get all sub-categories for a category
// ---------------------------------------------------------------------------

export function getSubCategoriesForCategory(categoryId: string): GovBuildingSubCategory[] {
  return GOVERNMENT_BUILDING_SUB_CATEGORIES.filter(s => s.categoryId === categoryId);
}

// ---------------------------------------------------------------------------
// Utility: get all unique classes across categories
// ---------------------------------------------------------------------------

export function getGovBuildingClasses(): GovBuildingClass[] {
  return [...new Set(GOVERNMENT_BUILDING_CATEGORIES.map(c => c.class))];
}

// ---------------------------------------------------------------------------
// Utility: get all unique types across sub-categories
// ---------------------------------------------------------------------------

export function getGovBuildingTypes(): GovBuildingType[] {
  return [...new Set(GOVERNMENT_BUILDING_SUB_CATEGORIES.map(s => s.type))];
}
