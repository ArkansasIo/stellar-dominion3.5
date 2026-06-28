/**
 * Unit Job Taxonomy Configuration
 *
 * Comprehensive classification system for civilization, military, and government units/jobs.
 *
 * Structure:
 *  - 18 Categories (across civilization, military, government domains)
 *  - 32 Sub-categories
 *  - 1-99 Tier classes with class and sub-class
 *  - 1-999 Level system with ranks, titles, names, stats, sub-stats,
 *    descriptions, sub-descriptions, attributes, sub-attributes, subjects
 */

// ─── Domain ───────────────────────────────────────────────────────────────────

export type UnitJobDomain = 'civilization' | 'military' | 'government';

// ─── Stats & Sub-Stats ────────────────────────────────────────────────────────

export interface UnitStats {
  attack: number;
  defense: number;
  hp: number;
  speed: number;
  morale: number;
  productivity: number;
}

export interface UnitSubStats {
  criticalRate: number;
  evasion: number;
  accuracy: number;
  initiative: number;
  leadership: number;
  logistics: number;
}

// ─── Attributes & Sub-Attributes ──────────────────────────────────────────────

export interface UnitAttributes {
  strength: number;
  intelligence: number;
  dexterity: number;
  constitution: number;
  wisdom: number;
  charisma: number;
}

export interface UnitSubAttributes {
  combat: number;
  science: number;
  diplomacy: number;
  engineering: number;
  command: number;
  stealth: number;
}

// ─── Category (18 total) ──────────────────────────────────────────────────────

export interface UnitJobCategory {
  id: string;
  name: string;
  domain: UnitJobDomain;
  description: string;
  subDescription: string;
  subject: string;
  subjectDetails: string;
}

// ─── Sub-Category (32 total) ──────────────────────────────────────────────────

export interface UnitJobSubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  subDescription: string;
  subject: string;
  subjectDetails: string;
}

// ─── Type Classification ──────────────────────────────────────────────────────

export interface UnitTypeClassification {
  type: string;
  subType: string;
  name: string;
  rank: number;
  title: string;
  description: string;
  subDescription: string;
  stats: UnitStats;
  subStats: UnitSubStats;
  attributes: UnitAttributes;
  subAttributes: UnitSubAttributes;
  subject: string;
  subjectDetails: string;
}

// ─── Tier Class (1-99) ────────────────────────────────────────────────────────

export interface UnitTierClass {
  tier: number;
  class: string;
  subClass: string;
  name: string;
  title: string;
  description: string;
  subDescription: string;
  stats: UnitStats;
  subStats: UnitSubStats;
  attributes: UnitAttributes;
  subAttributes: UnitSubAttributes;
}

// ─── Level System (1-999) ─────────────────────────────────────────────────────

export interface UnitLevelBand {
  minLevel: number;
  maxLevel: number;
  rank: string;
  title: string;
  name: string;
  description: string;
  subDescription: string;
  statMultiplier: number;
  subject: string;
  subjectDetails: string;
}

export interface UnitLevelSystem {
  bands: UnitLevelBand[];
  maxLevel: number;
  getLevelBand: (level: number) => UnitLevelBand;
  getLevelMultiplier: (level: number) => number;
}

// ─── Full Taxonomy Entry ──────────────────────────────────────────────────────

export interface UnitJobTaxonomyEntry {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  rank: number;
  title: string;
  domain: UnitJobDomain;
  type: string;
  subType: string;
  tier: number;
  tierClass: string;
  tierSubClass: string;
  maxLevel: number;
  description: string;
  subDescription: string;
  stats: UnitStats;
  subStats: UnitSubStats;
  attributes: UnitAttributes;
  subAttributes: UnitSubAttributes;
  subject: string;
  subjectDetails: string;
  trainingEnabled: boolean;
}

// ─── 18 Categories ────────────────────────────────────────────────────────────

export const UNIT_JOB_CATEGORIES: UnitJobCategory[] = [
  // ── Military Domain (7) ──────────────────────────────────────────────────────
  {
    id: 'cat-infantry-combat',
    name: 'Infantry Combat',
    domain: 'military',
    description: 'Ground-based combat units specializing in direct engagement and territorial control',
    subDescription: 'Includes line infantry, heavy assault, and specialized ground troops trained for front-line combat operations',
    subject: 'Ground Warfare',
    subjectDetails: 'Infantry are the backbone of any planetary assault or defense operation. They excel in close-quarters engagements and can operate across diverse terrain types',
  },
  {
    id: 'cat-armored-warfare',
    name: 'Armored Warfare',
    domain: 'military',
    description: 'Mechanized and armored combat units providing heavy fire support and breakthrough capability',
    subDescription: 'Armored units range from light scout vehicles to heavy main battle platforms, providing mobile firepower and force projection',
    subject: 'Mechanized Operations',
    subjectDetails: 'Armored forces dominate open battlefield engagements and sieges, combining mobility with devastating firepower to break enemy lines',
  },
  {
    id: 'cat-artillery-support',
    name: 'Artillery Support',
    domain: 'military',
    description: 'Long-range fire support units providing indirect fire and siege capabilities',
    subDescription: 'Artillery encompasses both orbital bombardment platforms and ground-based siege weapons designed to destroy fortifications and suppress enemy forces',
    subject: 'Fire Support Doctrine',
    subjectDetails: 'Artillery units enable force multiplication by projecting destructive power far beyond the front lines, enabling breakthroughs and denying enemy movement',
  },
  {
    id: 'cat-aerospace-operations',
    name: 'Aerospace Operations',
    domain: 'military',
    description: 'Air and space combat units controlling the skies and orbital space above battlefield zones',
    subDescription: 'Aerospace units span starfighters, tactical bombers, and aerospace interceptors capable of engaging both atmospheric and orbital targets',
    subject: 'Aerospace Superiority',
    subjectDetails: 'Aerospace forces establish air dominance essential for ground operations, conducting close air support, interdiction, and orbital defense missions',
  },
  {
    id: 'cat-special-forces',
    name: 'Special Forces',
    domain: 'military',
    description: 'Elite covert units conducting high-value targeted operations beyond conventional military scope',
    subDescription: 'Special forces include saboteurs, infiltrators, and shock troops trained for direct action, reconnaissance, and unconventional warfare',
    subject: 'Unconventional Warfare',
    subjectDetails: 'Special operations forces amplify strategic impact through precision raids, sabotage of key infrastructure, and behind-enemy-lines intelligence gathering',
  },
  {
    id: 'cat-fleet-command',
    name: 'Fleet Command',
    domain: 'military',
    description: 'Senior command personnel responsible for directing military forces at tactical and strategic levels',
    subDescription: 'Fleet command units include tactical officers, fleet admirals, and strategic planners who coordinate multi-domain combat operations',
    subject: 'Military Leadership',
    subjectDetails: 'Command units provide force multiplying effects through superior coordination, strategic planning, and real-time battlefield decision-making',
  },
  {
    id: 'cat-medical-corps',
    name: 'Medical Corps',
    domain: 'military',
    description: 'Military medical personnel maintaining combat effectiveness through field care and trauma surgery',
    subDescription: 'Medical corps units operate from front-line field medics to advanced surgical teams capable of handling mass-casualty events',
    subject: 'Combat Medicine',
    subjectDetails: 'Medical units directly improve unit survivability by returning wounded soldiers to duty and preventing attrition from non-combat causes',
  },

  // ── Government Domain (6) ─────────────────────────────────────────────────────
  {
    id: 'cat-civil-administration',
    name: 'Civil Administration',
    domain: 'government',
    description: 'Bureaucratic and administrative personnel managing colonies, sectors, and governmental operations',
    subDescription: 'Civil administrators oversee resource allocation, population management, and policy implementation across governed territories',
    subject: 'Administrative Governance',
    subjectDetails: 'Effective civil administration is the foundation of a stable empire. Administrators ensure laws are enforced, resources flow efficiently, and citizens remain productive',
  },
  {
    id: 'cat-justice-judiciary',
    name: 'Justice & Judiciary',
    domain: 'government',
    description: 'Legal and judicial personnel responsible for upholding laws and maintaining social order',
    subDescription: 'Judicial units enforce criminal law, adjudicate civil disputes, and maintain the rule of law across all governed territories',
    subject: 'Rule of Law',
    subjectDetails: 'A functioning judiciary prevents civil unrest, reduces corruption, and ensures that the social compact between citizens and government remains intact',
  },
  {
    id: 'cat-diplomatic-service',
    name: 'Diplomatic Service',
    domain: 'government',
    description: 'Foreign affairs specialists managing inter-empire relations, treaties, and trade negotiations',
    subDescription: 'Diplomatic units include ambassadors, envoys, and negotiators who represent empire interests in dealings with foreign powers',
    subject: 'Interstellar Diplomacy',
    subjectDetails: 'Skilled diplomats can avert costly conflicts, secure favorable trade terms, and build strategic alliances that amplify imperial power',
  },
  {
    id: 'cat-internal-security',
    name: 'Internal Security',
    domain: 'government',
    description: 'Security forces protecting the empire from internal threats, rebellion, and sabotage',
    subDescription: 'Internal security encompasses planetary defense forces, border patrol units, and counterinsurgency specialists',
    subject: 'Domestic Security',
    subjectDetails: 'Internal security forces are the first line of defense against civil unrest, foreign infiltration, and criminal enterprises that threaten imperial stability',
  },
  {
    id: 'cat-treasury-finance',
    name: 'Treasury & Finance',
    domain: 'government',
    description: 'Economic specialists managing imperial finances, taxation, and resource distribution',
    subDescription: 'Treasury personnel oversee fiscal policy, monetary systems, resource accounting, and economic planning at the imperial level',
    subject: 'Imperial Economics',
    subjectDetails: 'Sound financial management enables sustained military expansion and civilian development. Treasury officials maximize revenue while minimizing economic disruption',
  },
  {
    id: 'cat-intelligence-agency',
    name: 'Intelligence Agency',
    domain: 'government',
    description: 'Intelligence operatives gathering information on foreign powers and monitoring internal threats',
    subDescription: 'Intelligence agency personnel include analysts, field operatives, and counter-intelligence specialists working to inform strategic decision-making',
    subject: 'Strategic Intelligence',
    subjectDetails: 'Intelligence superiority provides decisive advantages in both diplomacy and warfare by anticipating enemy actions and uncovering hidden vulnerabilities',
  },

  // ── Civilization Domain (5) ───────────────────────────────────────────────────
  {
    id: 'cat-scientific-research',
    name: 'Scientific Research',
    domain: 'civilization',
    description: 'Research scientists and academics advancing technological and theoretical knowledge',
    subDescription: 'Research personnel range from laboratory scientists to theoretical physicists, driving technological innovation and discovery',
    subject: 'Scientific Advancement',
    subjectDetails: 'Scientific research is the engine of long-term imperial growth, unlocking new technologies and expanding the boundaries of what is possible',
  },
  {
    id: 'cat-industrial-labor',
    name: 'Industrial Labor',
    domain: 'civilization',
    description: 'Industrial workers operating mines, factories, and production facilities across the empire',
    subDescription: 'Industrial laborers include miners, factory workers, and production specialists who form the economic backbone of resource extraction and manufacturing',
    subject: 'Industrial Production',
    subjectDetails: 'Industrial laborers directly determine the production capacity of the empire, translating raw resources into the materials needed for expansion and warfare',
  },
  {
    id: 'cat-commerce-trade',
    name: 'Commerce & Trade',
    domain: 'civilization',
    description: 'Merchants and traders facilitating economic exchange within and between star systems',
    subDescription: 'Commercial units include market operators, long-haul traders, and logistics specialists who keep the imperial economy flowing',
    subject: 'Economic Exchange',
    subjectDetails: 'Commerce and trade units generate wealth by identifying opportunities for profitable exchange, reducing inefficiencies in resource distribution across the empire',
  },
  {
    id: 'cat-colonial-development',
    name: 'Colonial Development',
    domain: 'civilization',
    description: 'Settlement and infrastructure specialists enabling expansion to new worlds and star systems',
    subDescription: 'Colonial developers include settlers, urban planners, and infrastructure engineers who establish and grow new imperial territories',
    subject: 'Territorial Expansion',
    subjectDetails: 'Colonial development units convert raw frontier worlds into productive imperial territories, establishing the infrastructure required for sustainable population growth',
  },
  {
    id: 'cat-education-culture',
    name: 'Education & Culture',
    domain: 'civilization',
    description: 'Educators and cultural leaders raising citizen productivity and imperial cohesion',
    subDescription: 'Education and culture units encompass academy instructors, cultural ambassadors, and social architects who shape imperial identity',
    subject: 'Societal Development',
    subjectDetails: 'Investment in education and culture yields long-term dividends through increased citizen productivity, enhanced research capability, and improved social stability',
  },
];

// ─── 32 Sub-Categories ────────────────────────────────────────────────────────

export const UNIT_JOB_SUB_CATEGORIES: UnitJobSubCategory[] = [
  // Infantry Combat (2)
  {
    id: 'sub-line-infantry',
    categoryId: 'cat-infantry-combat',
    name: 'Line Infantry',
    description: 'Standard front-line infantry trained for sustained conventional combat operations',
    subDescription: 'Equipped with standard-issue weapons and armor, line infantry form the core of any ground assault or defense',
    subject: 'Conventional Ground Warfare',
    subjectDetails: 'Line infantry excel at holding ground, advancing under fire, and engaging enemy forces in direct combat across varied terrain',
  },
  {
    id: 'sub-heavy-infantry',
    categoryId: 'cat-infantry-combat',
    name: 'Heavy Infantry',
    description: 'Heavily armed and armored assault troops designed for breaching fortified positions',
    subDescription: 'Heavy infantry carry heavier weapons and wear power armor, trading mobility for greatly increased survivability and firepower',
    subject: 'Assault Operations',
    subjectDetails: 'Heavy infantry are assault specialists called upon to break through the most heavily defended enemy positions',
  },
  // Armored Warfare (2)
  {
    id: 'sub-main-battle-armor',
    categoryId: 'cat-armored-warfare',
    name: 'Main Battle Armor',
    description: 'Heavy mechanized armor providing maximum offensive and defensive capability on the battlefield',
    subDescription: 'Main battle armor units are the decisive element of armored operations, capable of defeating any ground-based opposition',
    subject: 'Heavy Armor Operations',
    subjectDetails: 'Main battle armor units deliver concentrated firepower and protection, enabling breakthrough operations against dug-in defenders',
  },
  {
    id: 'sub-light-recon',
    categoryId: 'cat-armored-warfare',
    name: 'Light Recon',
    description: 'Fast, lightly armored scouting units that gather battlefield intelligence and screen for larger forces',
    subDescription: 'Light recon units sacrifice armor for speed, allowing rapid reconnaissance and exploitation of enemy weaknesses',
    subject: 'Reconnaissance Doctrine',
    subjectDetails: 'Recon units provide essential battlefield awareness, identifying enemy dispositions and reporting on terrain conditions before the main force advances',
  },
  // Artillery Support (1)
  {
    id: 'sub-siege-artillery',
    categoryId: 'cat-artillery-support',
    name: 'Siege Artillery',
    description: 'Heavy bombardment platforms designed to destroy fortifications and strongpoints from long range',
    subDescription: 'Siege artillery includes rail guns, plasma mortars, and orbital strike coordinators capable of leveling even the most hardened defenses',
    subject: 'Siege Warfare',
    subjectDetails: 'Siege artillery is the primary means of reducing planetary defenses, enabling ground forces to assault previously impregnable positions',
  },
  // Aerospace Operations (2)
  {
    id: 'sub-starfighter-corps',
    categoryId: 'cat-aerospace-operations',
    name: 'Starfighter Corps',
    description: 'Elite fighter pilots operating high-performance combat spacecraft in atmospheric and orbital engagements',
    subDescription: 'Starfighter pilots fly agile single-seat combat craft designed for dogfighting, close air support, and intercept missions',
    subject: 'Air Superiority',
    subjectDetails: 'Starfighter squadrons contest control of the air and near-orbital space, providing cover for ground forces and intercepting enemy aerospace assets',
  },
  {
    id: 'sub-bomber-wing',
    categoryId: 'cat-aerospace-operations',
    name: 'Bomber Wing',
    description: 'Heavy bombardment aircraft conducting strategic strikes against ground targets and orbital installations',
    subDescription: 'Bomber wings carry heavy payloads of advanced munitions for precision and area-effect strikes against strategic targets',
    subject: 'Strategic Bombardment',
    subjectDetails: 'Bombers complement artillery by providing flexible long-range fire support that can be rapidly redirected across a wide area of operations',
  },
  // Special Forces (1)
  {
    id: 'sub-covert-operations',
    categoryId: 'cat-special-forces',
    name: 'Covert Operations',
    description: 'Clandestine operators conducting sabotage, assassination, and intelligence gathering missions',
    subDescription: 'Covert operatives work in the shadows to undermine enemy capabilities through targeted disruption of command, logistics, and critical infrastructure',
    subject: 'Asymmetric Warfare',
    subjectDetails: 'Covert operations provide strategic impact disproportionate to the forces employed, enabling small teams to achieve results that conventional forces cannot',
  },
  // Fleet Command (2)
  {
    id: 'sub-tactical-command',
    categoryId: 'cat-fleet-command',
    name: 'Tactical Command',
    description: 'Battle-level commanders directing unit engagements and local tactical operations',
    subDescription: 'Tactical commanders make split-second decisions during combat, adapting plans to evolving battlefield conditions',
    subject: 'Tactical Leadership',
    subjectDetails: 'Effective tactical commanders maximize the combat effectiveness of their forces through superior situational awareness and rapid decision-making',
  },
  {
    id: 'sub-strategic-command',
    categoryId: 'cat-fleet-command',
    name: 'Strategic Command',
    description: 'Senior commanders developing campaign-level strategies and directing multi-domain operations',
    subDescription: 'Strategic commanders plan and execute extended military campaigns, coordinating forces across multiple star systems and theaters of war',
    subject: 'Strategic Planning',
    subjectDetails: 'Strategic commanders shape the entire trajectory of a war by determining where to commit resources and how to sequence operations for maximum effect',
  },
  // Medical Corps (1)
  {
    id: 'sub-field-medicine',
    categoryId: 'cat-medical-corps',
    name: 'Field Medicine',
    description: 'Front-line medics providing immediate trauma care to injured soldiers in combat conditions',
    subDescription: 'Field medics operate under fire to stabilize casualties and evacuate the wounded, directly reducing combat losses',
    subject: 'Trauma Care',
    subjectDetails: 'Field medics are among the most valued soldiers on any battlefield, their presence significantly improving unit morale and combat sustainability',
  },
  // Civil Administration (2)
  {
    id: 'sub-colonial-administration',
    categoryId: 'cat-civil-administration',
    name: 'Colonial Administration',
    description: 'Administrators managing the day-to-day governance of established colonies and settled territories',
    subDescription: 'Colonial administrators handle population affairs, resource allocation, and enforcement of imperial law in frontier settlements',
    subject: 'Colonial Governance',
    subjectDetails: 'Effective colonial administration determines whether newly settled worlds prosper or stagnate, directly impacting imperial expansion potential',
  },
  {
    id: 'sub-regional-governance',
    categoryId: 'cat-civil-administration',
    name: 'Regional Governance',
    description: 'Senior administrators overseeing multiple colonies or star systems within a defined region',
    subDescription: 'Regional governors coordinate policies across multiple worlds, balancing local needs with imperial objectives',
    subject: 'Multi-System Administration',
    subjectDetails: 'Regional governance structures allow large empires to maintain consistent policy across many worlds while adapting to local conditions',
  },
  // Justice & Judiciary (1)
  {
    id: 'sub-criminal-justice',
    categoryId: 'cat-justice-judiciary',
    name: 'Criminal Justice',
    description: 'Law enforcement and prosecution personnel responsible for deterring and punishing criminal behavior',
    subDescription: 'Criminal justice units include investigators, prosecutors, and penal administrators who enforce imperial law',
    subject: 'Criminal Law',
    subjectDetails: 'A robust criminal justice system reduces corruption and organized crime, improving the economic efficiency and social stability of the empire',
  },
  // Diplomatic Service (2)
  {
    id: 'sub-ambassadorial-corps',
    categoryId: 'cat-diplomatic-service',
    name: 'Ambassadorial Corps',
    description: 'Senior diplomats representing the empire at the highest levels of foreign relations',
    subDescription: 'Ambassadors negotiate treaties, manage crises, and advance imperial interests at the courts of foreign powers',
    subject: 'High Diplomacy',
    subjectDetails: 'Skilled ambassadors can prevent wars, secure alliances, and extract favorable concessions that improve imperial security and prosperity',
  },
  {
    id: 'sub-trade-envoys',
    categoryId: 'cat-diplomatic-service',
    name: 'Trade Envoys',
    description: 'Commercial diplomats negotiating trade agreements and managing economic relationships with foreign empires',
    subDescription: 'Trade envoys specialize in identifying mutually beneficial trade opportunities and negotiating agreements that strengthen the imperial economy',
    subject: 'Economic Diplomacy',
    subjectDetails: 'Successful trade envoys open new markets, secure favorable resource exchange rates, and reduce the economic costs of maintaining foreign relations',
  },
  // Internal Security (2)
  {
    id: 'sub-planetary-defense',
    categoryId: 'cat-internal-security',
    name: 'Planetary Defense',
    description: 'Security forces protecting individual worlds from external threats and internal instability',
    subDescription: 'Planetary defense units maintain order on settled worlds, responding to uprisings, criminal activity, and foreign incursions',
    subject: 'Homeland Security',
    subjectDetails: 'Planetary defense forces free regular military units for offensive operations by handling internal security and low-level external threats independently',
  },
  {
    id: 'sub-border-control',
    categoryId: 'cat-internal-security',
    name: 'Border Control',
    description: 'Specialized units monitoring and controlling the movement of people and materials across imperial borders',
    subDescription: 'Border control units prevent smuggling, monitor foreign intelligence activity, and enforce customs and immigration policy',
    subject: 'Border Security',
    subjectDetails: 'Effective border control prevents contraband from undermining imperial industry and stops hostile agents from penetrating imperial territory',
  },
  // Treasury & Finance (2)
  {
    id: 'sub-fiscal-policy',
    categoryId: 'cat-treasury-finance',
    name: 'Fiscal Policy',
    description: 'Economic policy specialists designing and implementing the empire\'s financial frameworks and taxation systems',
    subDescription: 'Fiscal policy units analyze economic data and develop strategies to maximize imperial revenue while maintaining sustainable growth',
    subject: 'Economic Policy',
    subjectDetails: 'Sound fiscal policy maximizes the resources available for imperial development and warfare while ensuring long-term economic sustainability',
  },
  {
    id: 'sub-resource-management',
    categoryId: 'cat-treasury-finance',
    name: 'Resource Management',
    description: 'Resource allocation specialists optimizing the distribution of imperial materials across competing demands',
    subDescription: 'Resource managers track material flows, identify inefficiencies, and ensure strategic stockpiles are maintained at adequate levels',
    subject: 'Strategic Resource Allocation',
    subjectDetails: 'Effective resource management prevents critical shortages and ensures the most strategically important projects receive priority access to materials',
  },
  // Intelligence Agency (2)
  {
    id: 'sub-counter-intelligence',
    categoryId: 'cat-intelligence-agency',
    name: 'Counter-Intelligence',
    description: 'Security specialists identifying and neutralizing foreign intelligence operations within the empire',
    subDescription: 'Counter-intelligence units investigate suspected foreign agents, protect sensitive imperial secrets, and conduct disinformation operations',
    subject: 'Security Operations',
    subjectDetails: 'Counter-intelligence prevents foreign powers from gaining insight into imperial capabilities and intentions, protecting strategic advantages',
  },
  {
    id: 'sub-field-operations',
    categoryId: 'cat-intelligence-agency',
    name: 'Field Operations',
    description: 'Intelligence field operatives gathering information from within foreign-controlled territories',
    subDescription: 'Field operatives recruit informants, conduct surveillance, and report on foreign military and political developments',
    subject: 'Human Intelligence',
    subjectDetails: 'Field intelligence operatives provide ground-truth reporting that electronic surveillance cannot replicate, revealing enemy intentions and plans',
  },
  // Scientific Research (2)
  {
    id: 'sub-applied-sciences',
    categoryId: 'cat-scientific-research',
    name: 'Applied Sciences',
    description: 'Scientists and engineers developing practical technologies with immediate military or industrial applications',
    subDescription: 'Applied research teams work on weapons systems, propulsion technology, and resource extraction improvements',
    subject: 'Technology Development',
    subjectDetails: 'Applied research translates theoretical breakthroughs into deployable technologies, directly improving imperial military and economic capabilities',
  },
  {
    id: 'sub-theoretical-research',
    categoryId: 'cat-scientific-research',
    name: 'Theoretical Research',
    description: 'Theoretical scientists pursuing fundamental discoveries that may unlock entirely new technological paradigms',
    subDescription: 'Theoretical researchers investigate the fundamental laws of the universe, occasionally achieving breakthroughs that revolutionize technology',
    subject: 'Fundamental Science',
    subjectDetails: 'While slower to yield results, theoretical research unlocks the most powerful long-term technological advantages by expanding the bounds of the possible',
  },
  // Industrial Labor (2)
  {
    id: 'sub-mining-operations',
    categoryId: 'cat-industrial-labor',
    name: 'Mining Operations',
    description: 'Extraction specialists operating mines and mineral processing facilities to supply imperial industry',
    subDescription: 'Mining workers extract raw materials from planetary crusts, asteroid fields, and gas giant atmospheres',
    subject: 'Resource Extraction',
    subjectDetails: 'Mining operations are the foundation of the imperial economy, supplying the raw materials required for every aspect of imperial development',
  },
  {
    id: 'sub-manufacturing',
    categoryId: 'cat-industrial-labor',
    name: 'Manufacturing',
    description: 'Factory workers and production specialists converting raw materials into finished goods and military equipment',
    subDescription: 'Manufacturing workers operate production lines for everything from consumer goods to advanced weapons systems',
    subject: 'Industrial Production',
    subjectDetails: 'Manufacturing capability determines how quickly an empire can translate resources into military power and civilian prosperity',
  },
  // Commerce & Trade (2)
  {
    id: 'sub-market-operations',
    categoryId: 'cat-commerce-trade',
    name: 'Market Operations',
    description: 'Traders and brokers operating within imperial markets to facilitate efficient resource exchange',
    subDescription: 'Market operators maintain liquidity in resource markets, ensuring that materials flow to their highest-value uses',
    subject: 'Internal Trade',
    subjectDetails: 'Active market operations maximize the economic efficiency of the empire by ensuring resources are allocated to where they can generate the most value',
  },
  {
    id: 'sub-import-export',
    categoryId: 'cat-commerce-trade',
    name: 'Import/Export',
    description: 'International trade specialists managing the flow of goods and resources across imperial borders',
    subDescription: 'Import/export specialists identify favorable trade opportunities with foreign empires and manage the logistics of long-range trade routes',
    subject: 'Interstellar Commerce',
    subjectDetails: 'Inter-empire trade provides access to resources unavailable within imperial borders and generates additional revenue through trade margins',
  },
  // Colonial Development (2)
  {
    id: 'sub-settlement-operations',
    categoryId: 'cat-colonial-development',
    name: 'Settlement Operations',
    description: 'Pioneer colonists establishing the initial settlements on newly claimed worlds',
    subDescription: 'Settlement specialists are trained to survive in harsh frontier conditions while establishing the basic infrastructure for future growth',
    subject: 'Frontier Settlement',
    subjectDetails: 'Effective settlement operations quickly transform uninhabited worlds into productive imperial territories, accelerating imperial expansion',
  },
  {
    id: 'sub-infrastructure',
    categoryId: 'cat-colonial-development',
    name: 'Infrastructure',
    description: 'Engineers and planners building the roads, power grids, and facilities that support colonial growth',
    subDescription: 'Infrastructure specialists design and construct the physical systems that enable colonies to function and expand efficiently',
    subject: 'Development Engineering',
    subjectDetails: 'Robust infrastructure accelerates colony development by reducing logistics costs and increasing the productivity of all other colonial activities',
  },
  // Education & Culture (2)
  {
    id: 'sub-academy-system',
    categoryId: 'cat-education-culture',
    name: 'Academy System',
    description: 'Educators operating academies and training institutions that develop skilled workers and professionals',
    subDescription: 'Academy instructors train the next generation of scientists, engineers, administrators, and military officers',
    subject: 'Professional Education',
    subjectDetails: 'A strong academy system reduces training time and cost for all other unit types while improving their baseline performance',
  },
  {
    id: 'sub-cultural-affairs',
    categoryId: 'cat-education-culture',
    name: 'Cultural Affairs',
    description: 'Cultural specialists promoting imperial identity and social cohesion across diverse planetary populations',
    subDescription: 'Cultural affairs units manage art, media, and social programs that build loyalty to the empire and reduce separatist sentiment',
    subject: 'Social Cohesion',
    subjectDetails: 'Investment in cultural affairs reduces civil unrest, improves population happiness, and strengthens the imperial identity that binds diverse worlds together',
  },
];

// ─── Tier Class Definitions (1-99) ───────────────────────────────────────────

/** Tier class bands describing the progression from tier 1 to tier 99 */
const TIER_CLASS_BANDS: Array<{
  minTier: number;
  maxTier: number;
  class: string;
  subClasses: string[];
  baseTitle: string;
}> = [
  { minTier: 1,  maxTier: 9,  class: 'Standard',     subClasses: ['Basic', 'Intermediate', 'Advanced'],                  baseTitle: 'Initiate' },
  { minTier: 10, maxTier: 24, class: 'Enhanced',      subClasses: ['Specialist', 'Expert', 'Master'],                     baseTitle: 'Apprentice' },
  { minTier: 25, maxTier: 49, class: 'Superior',      subClasses: ['Elite', 'Champion', 'Vanguard'],                      baseTitle: 'Journeyman' },
  { minTier: 50, maxTier: 74, class: 'Legendary',     subClasses: ['Mythic', 'Divine', 'Celestial'],                      baseTitle: 'Veteran' },
  { minTier: 75, maxTier: 99, class: 'Transcendent',  subClasses: ['Cosmic', 'Eternal', 'Infinite'],                      baseTitle: 'Grand Master' },
];

function getTierBand(tier: number) {
  return TIER_CLASS_BANDS.find(b => tier >= b.minTier && tier <= b.maxTier) ?? TIER_CLASS_BANDS[0];
}

function getTierSubClass(tier: number): string {
  const band = getTierBand(tier);
  const range = band.maxTier - band.minTier + 1;
  if (range <= 1) return band.subClasses[0];
  const offset = tier - band.minTier;
  const idx = Math.min(band.subClasses.length - 1, Math.floor((offset / range) * band.subClasses.length));
  return band.subClasses[idx];
}

function buildTierStats(tier: number): UnitStats {
  const m = 1 + (tier - 1) * 0.08;
  return {
    attack:       Math.floor(10 * m),
    defense:      Math.floor(8 * m),
    hp:           Math.floor(50 * m),
    speed:        Math.max(5, Math.floor(20 + tier * 0.5)),
    morale:       Math.min(100, Math.floor(40 + tier * 0.6)),
    productivity: Math.floor(5 * m),
  };
}

function buildTierSubStats(tier: number): UnitSubStats {
  const m = 1 + (tier - 1) * 0.06;
  return {
    criticalRate: Math.min(50, Math.floor(5 + tier * 0.45)),
    evasion:      Math.min(50, Math.floor(4 + tier * 0.4)),
    accuracy:     Math.min(99, Math.floor(60 + tier * 0.38)),
    initiative:   Math.floor(10 * m),
    leadership:   Math.floor(5 * m),
    logistics:    Math.floor(4 * m),
  };
}

function buildTierAttributes(tier: number): UnitAttributes {
  const base = Math.max(1, Math.floor(tier * 0.2));
  return {
    strength:     Math.min(20, base + 2),
    intelligence: Math.min(20, base + 1),
    dexterity:    Math.min(20, base + 1),
    constitution: Math.min(20, base + 2),
    wisdom:       Math.min(20, base),
    charisma:     Math.min(20, base),
  };
}

function buildTierSubAttributes(tier: number): UnitSubAttributes {
  const base = Math.max(1, Math.floor(tier * 0.15));
  return {
    combat:      Math.min(20, base + 3),
    science:     Math.min(20, base),
    diplomacy:   Math.min(20, base),
    engineering: Math.min(20, base + 1),
    command:     Math.min(20, base + 1),
    stealth:     Math.min(20, base),
  };
}

/** All 99 tier class entries (tier 1 through 99) */
export const UNIT_TIER_CLASSES: UnitTierClass[] = Array.from({ length: 99 }, (_, i) => {
  const tier = i + 1;
  const band = getTierBand(tier);
  const subClass = getTierSubClass(tier);
  return {
    tier,
    class: band.class,
    subClass,
    name: `${subClass} ${band.class} (Tier ${tier})`,
    title: `${band.baseTitle} Tier ${tier}`,
    description: `Tier ${tier} unit classification in the ${band.class} class. Represents a ${subClass.toLowerCase()}-tier operative or workforce member`,
    subDescription: `Units at this tier have undergone ${band.class.toLowerCase()}-level training and demonstrate ${subClass.toLowerCase()} proficiency in their designated role`,
    stats: buildTierStats(tier),
    subStats: buildTierSubStats(tier),
    attributes: buildTierAttributes(tier),
    subAttributes: buildTierSubAttributes(tier),
  };
});

// ─── Level System (1-999) ─────────────────────────────────────────────────────

const LEVEL_BANDS: Omit<UnitLevelBand, 'statMultiplier'>[] = [
  {
    minLevel: 1,   maxLevel: 99,
    rank: 'Novice',
    title: 'Recruit',
    name: 'Novice Operative',
    description: 'A newly inducted unit still learning the fundamentals of their role',
    subDescription: 'Novice-level units are gaining experience and are not yet combat or mission-ready at full effectiveness',
    subject: 'Basic Training',
    subjectDetails: 'Novice units focus on mastering fundamental skills. They benefit most from structured training programs and experienced mentors',
  },
  {
    minLevel: 100, maxLevel: 299,
    rank: 'Apprentice',
    title: 'Trained Operative',
    name: 'Apprentice Specialist',
    description: 'A unit that has completed basic training and is developing professional competency',
    subDescription: 'Apprentice-level units have mastered the basics and are building the expertise required for independent operation',
    subject: 'Professional Development',
    subjectDetails: 'Apprentice units are developing their specialization. They perform their duties reliably but still benefit significantly from supervision',
  },
  {
    minLevel: 300, maxLevel: 499,
    rank: 'Journeyman',
    title: 'Skilled Operative',
    name: 'Journeyman Professional',
    description: 'An experienced unit with solid professional skills and growing tactical or technical expertise',
    subDescription: 'Journeyman-level units operate independently and can mentor novice personnel in core duties',
    subject: 'Field Competency',
    subjectDetails: 'Journeyman units are reliable contributors who perform consistently well under normal conditions and can adapt to unexpected challenges',
  },
  {
    minLevel: 500, maxLevel: 699,
    rank: 'Expert',
    title: 'Senior Operative',
    name: 'Expert Specialist',
    description: 'A highly capable unit demonstrating advanced mastery of their role with documented performance excellence',
    subDescription: 'Expert-level units are sought for the most challenging assignments and regularly exceed performance expectations',
    subject: 'Advanced Mastery',
    subjectDetails: 'Expert units routinely tackle problems that defeat less experienced personnel. Their judgment and skills make them invaluable in high-pressure situations',
  },
  {
    minLevel: 700, maxLevel: 899,
    rank: 'Elite',
    title: 'Champion Operative',
    name: 'Elite Veteran',
    description: 'A battle-proven unit whose exceptional skill and experience places them among the finest in their field',
    subDescription: 'Elite-level units have survived and excelled through the most demanding assignments, emerging with unparalleled practical wisdom',
    subject: 'Elite Performance',
    subjectDetails: 'Elite units are capable of accomplishing missions that no other personnel can complete. Their presence alone significantly improves the performance of those around them',
  },
  {
    minLevel: 900, maxLevel: 999,
    rank: 'Legendary',
    title: 'Grand Master Operative',
    name: 'Legendary Icon',
    description: 'A transcendent unit whose abilities and accomplishments have passed into legend throughout the empire',
    subDescription: 'Legendary units represent the absolute pinnacle of achievement in their field. Their capabilities far exceed any measurable standard',
    subject: 'Legendary Achievement',
    subjectDetails: 'Legendary units are singular individuals whose exploits are studied by future generations. Their loss is a strategic setback felt across the entire empire',
  },
];

export const UNIT_LEVEL_BANDS: UnitLevelBand[] = LEVEL_BANDS.map((band, i) => ({
  ...band,
  statMultiplier: 1 + i * 0.5,
}));

const LEVEL_BAND_RANGES: number[] = UNIT_LEVEL_BANDS.map(b => Math.max(1, b.maxLevel - b.minLevel));

export const UNIT_LEVEL_SYSTEM: UnitLevelSystem = {
  bands: UNIT_LEVEL_BANDS,
  maxLevel: 999,
  getLevelBand(level: number): UnitLevelBand {
    return (
      UNIT_LEVEL_BANDS.find(b => level >= b.minLevel && level <= b.maxLevel) ??
      UNIT_LEVEL_BANDS[UNIT_LEVEL_BANDS.length - 1]
    );
  },
  getLevelMultiplier(level: number): number {
    const bandIdx = UNIT_LEVEL_BANDS.findIndex(b => level >= b.minLevel && level <= b.maxLevel);
    const idx = bandIdx === -1 ? UNIT_LEVEL_BANDS.length - 1 : bandIdx;
    const band = UNIT_LEVEL_BANDS[idx];
    const range = LEVEL_BAND_RANGES[idx];
    const bandProgress = (level - band.minLevel) / range;
    return band.statMultiplier + bandProgress * 0.5;
  },
};

// ─── Taxonomy Entries (one per sub-category × representative type/subType) ────

function buildEntryStats(category: UnitJobCategory, subCat: UnitJobSubCategory, entryIndex: number): UnitStats {
  const domainBase = { civilization: 1, military: 2, government: 1.5 }[category.domain];
  const m = domainBase * (1 + entryIndex * 0.1);
  return {
    attack:       Math.floor(12 * m),
    defense:      Math.floor(10 * m),
    hp:           Math.floor(60 * m),
    speed:        Math.floor(20 + entryIndex * 2),
    morale:       Math.min(100, Math.floor(50 + entryIndex * 3)),
    productivity: Math.floor(8 * domainBase),
  };
}

function buildEntrySubStats(entryIndex: number): UnitSubStats {
  return {
    criticalRate: Math.min(40, 8 + entryIndex * 2),
    evasion:      Math.min(40, 6 + entryIndex * 2),
    accuracy:     Math.min(95, 65 + entryIndex * 3),
    initiative:   10 + entryIndex,
    leadership:   5 + entryIndex,
    logistics:    4 + entryIndex,
  };
}

const DOMAIN_ATTRIBUTE_BONUS: Record<UnitJobDomain, Partial<UnitAttributes>> = {
  civilization: { intelligence: 4, charisma: 3 },
  military:     { strength: 4, constitution: 3 },
  government:   { charisma: 4, wisdom: 3 },
};

function buildEntryAttributes(category: UnitJobCategory): UnitAttributes {
  const bonus = DOMAIN_ATTRIBUTE_BONUS[category.domain];
  return {
    strength:     3 + (bonus.strength     ?? 0),
    intelligence: 3 + (bonus.intelligence ?? 0),
    dexterity:    3,
    constitution: 3 + (bonus.constitution ?? 0),
    wisdom:       3 + (bonus.wisdom       ?? 0),
    charisma:     3 + (bonus.charisma     ?? 0),
  };
}

function buildEntrySubAttributes(category: UnitJobCategory): UnitSubAttributes {
  const isMilitary = category.domain === 'military';
  const isGov = category.domain === 'government';
  return {
    combat:      isMilitary ? 8 : 2,
    science:     category.domain === 'civilization' ? 6 : 2,
    diplomacy:   isGov ? 7 : 2,
    engineering: 3,
    command:     isGov || isMilitary ? 5 : 2,
    stealth:     isMilitary ? 4 : 1,
  };
}

const TYPE_MAP: Record<string, { type: string; subType: string }> = {
  'sub-line-infantry':        { type: 'Infantry',        subType: 'Line' },
  'sub-heavy-infantry':       { type: 'Infantry',        subType: 'Heavy' },
  'sub-main-battle-armor':    { type: 'Armor',           subType: 'Main Battle' },
  'sub-light-recon':          { type: 'Armor',           subType: 'Light Recon' },
  'sub-siege-artillery':      { type: 'Artillery',       subType: 'Siege' },
  'sub-starfighter-corps':    { type: 'Aerospace',       subType: 'Fighter' },
  'sub-bomber-wing':          { type: 'Aerospace',       subType: 'Bomber' },
  'sub-covert-operations':    { type: 'Special Ops',     subType: 'Covert' },
  'sub-tactical-command':     { type: 'Command',         subType: 'Tactical' },
  'sub-strategic-command':    { type: 'Command',         subType: 'Strategic' },
  'sub-field-medicine':       { type: 'Support',         subType: 'Medical' },
  'sub-colonial-administration': { type: 'Administration', subType: 'Colonial' },
  'sub-regional-governance':  { type: 'Administration', subType: 'Regional' },
  'sub-criminal-justice':     { type: 'Judiciary',       subType: 'Criminal' },
  'sub-ambassadorial-corps':  { type: 'Diplomacy',       subType: 'Ambassador' },
  'sub-trade-envoys':         { type: 'Diplomacy',       subType: 'Trade' },
  'sub-planetary-defense':    { type: 'Security',        subType: 'Planetary' },
  'sub-border-control':       { type: 'Security',        subType: 'Border' },
  'sub-fiscal-policy':        { type: 'Finance',         subType: 'Fiscal' },
  'sub-resource-management':  { type: 'Finance',         subType: 'Resource' },
  'sub-counter-intelligence': { type: 'Intelligence',    subType: 'Counter-Intel' },
  'sub-field-operations':     { type: 'Intelligence',    subType: 'Field Ops' },
  'sub-applied-sciences':     { type: 'Research',        subType: 'Applied' },
  'sub-theoretical-research': { type: 'Research',        subType: 'Theoretical' },
  'sub-mining-operations':    { type: 'Labor',           subType: 'Mining' },
  'sub-manufacturing':        { type: 'Labor',           subType: 'Manufacturing' },
  'sub-market-operations':    { type: 'Commerce',        subType: 'Market' },
  'sub-import-export':        { type: 'Commerce',        subType: 'Import/Export' },
  'sub-settlement-operations':{ type: 'Colonial',        subType: 'Settlement' },
  'sub-infrastructure':       { type: 'Colonial',        subType: 'Infrastructure' },
  'sub-academy-system':       { type: 'Education',       subType: 'Academy' },
  'sub-cultural-affairs':     { type: 'Education',       subType: 'Cultural' },
};

const RANK_TITLES: Record<UnitJobDomain, string[]> = {
  military:     ['Recruit', 'Private', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel', 'Brigadier', 'General', 'Marshal'],
  government:   ['Clerk', 'Officer', 'Senior Officer', 'Director', 'Deputy Secretary', 'Secretary', 'Under-Minister', 'Minister', 'Deputy Governor', 'Governor', 'Viceroy', 'Chancellor'],
  civilization: ['Apprentice', 'Journeyman', 'Craftsman', 'Senior Craftsman', 'Master', 'Senior Master', 'Expert', 'Grand Expert', 'Fellow', 'Senior Fellow', 'Grand Master', 'Grand Luminary'],
};

/** Generate one taxonomy entry per sub-category */
export const UNIT_JOB_TAXONOMY: UnitJobTaxonomyEntry[] = UNIT_JOB_SUB_CATEGORIES.flatMap((subCat, idx) => {
  const category = UNIT_JOB_CATEGORIES.find(c => c.id === subCat.categoryId);
  if (!category) return [];
  const typeInfo = TYPE_MAP[subCat.id] ?? { type: 'General', subType: 'Standard' };
  const rank = (idx % 12) + 1;
  const titleList = RANK_TITLES[category.domain];
  const title = titleList[(rank - 1) % titleList.length];
  const tierValue = Math.min(99, 1 + idx * 3);

  return [{
    id: `taxonomy-${subCat.id}`,
    categoryId: category.id,
    subCategoryId: subCat.id,
    name: subCat.name,
    rank,
    title,
    domain: category.domain,
    type: typeInfo.type,
    subType: typeInfo.subType,
    tier: tierValue,
    tierClass: getTierBand(tierValue).class,
    tierSubClass: getTierSubClass(tierValue),
    maxLevel: 999,
    description: subCat.description,
    subDescription: subCat.subDescription,
    stats: buildEntryStats(category, subCat, idx),
    subStats: buildEntrySubStats(idx),
    attributes: buildEntryAttributes(category),
    subAttributes: buildEntrySubAttributes(category),
    subject: subCat.subject,
    subjectDetails: subCat.subjectDetails,
    trainingEnabled: true,
  }];
});

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

export function getCategoryById(id: string): UnitJobCategory | undefined {
  return UNIT_JOB_CATEGORIES.find(c => c.id === id);
}

export function getSubCategoriesByCategory(categoryId: string): UnitJobSubCategory[] {
  return UNIT_JOB_SUB_CATEGORIES.filter(sc => sc.categoryId === categoryId);
}

export function getTierClass(tier: number): UnitTierClass {
  const clamped = Math.max(1, Math.min(99, tier));
  return UNIT_TIER_CLASSES[clamped - 1];
}

export function getCategoriesByDomain(domain: UnitJobDomain): UnitJobCategory[] {
  return UNIT_JOB_CATEGORIES.filter(c => c.domain === domain);
}

export function getTaxonomyByDomain(domain: UnitJobDomain): UnitJobTaxonomyEntry[] {
  return UNIT_JOB_TAXONOMY.filter(e => e.domain === domain);
}

export function getTaxonomyByCategory(categoryId: string): UnitJobTaxonomyEntry[] {
  return UNIT_JOB_TAXONOMY.filter(e => e.categoryId === categoryId);
}

export function getTaxonomyEntry(id: string): UnitJobTaxonomyEntry | undefined {
  return UNIT_JOB_TAXONOMY.find(e => e.id === id);
}

export function getTaxonomyMeta() {
  const domains = ['civilization', 'military', 'government'] as UnitJobDomain[];
  return {
    totalCategories: UNIT_JOB_CATEGORIES.length,
    totalSubCategories: UNIT_JOB_SUB_CATEGORIES.length,
    totalTiers: 99,
    maxLevel: 999,
    levelBands: UNIT_LEVEL_BANDS.length,
    domains: domains.map(domain => ({
      domain,
      categories: getCategoriesByDomain(domain).length,
      entries: getTaxonomyByDomain(domain).length,
    })),
    tierClasses: TIER_CLASS_BANDS.map(b => ({
      class: b.class,
      range: `${b.minTier}-${b.maxTier}`,
      subClasses: b.subClasses,
    })),
  };
}
