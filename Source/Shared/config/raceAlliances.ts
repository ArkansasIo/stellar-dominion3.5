/**
 * Race Alliances & Diplomatic Relationships
 * Full 35-race diplomatic system with alliances, rivalries, trade pacts, and wars
 * @tag #alliances #diplomacy #trade #wars #config
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type DiplomaticStatus =
  | 'allied'
  | 'defensive_pact'
  | 'trade_agreement'
  | 'non_aggression'
  | 'neutral'
  | 'unfriendly'
  | 'hostile'
  | 'vassal';

export type TreatyType =
  | 'trade'
  | 'defense'
  | 'non_aggression'
  | 'vassal'
  | 'research'
  | 'cultural';

export type WarStatus =
  | 'cold_war'
  | 'border_skirmish'
  | 'limited_war'
  | 'full_war'
  | 'total_war'
  | 'ceasefire';

export type TradeRouteStatus =
  | 'active'
  | 'disrupted'
  | 'embargo'
  | 'pending';

export interface DiplomaticRelation {
  race1Id: string;
  race2Id: string;
  status: DiplomaticStatus;
  strength: number;
  tradeVolume: number;
  lastInteraction: number;
  treaties: Treaty[];
}

export interface AllianceBloc {
  id: string;
  name: string;
  memberRaceIds: string[];
  leaderRaceId: string;
  description: string;
  bonuses: {
    combat: number;
    economy: number;
    research: number;
    diplomacy: number;
  };
  foundingTurn: number;
  color: string;
}

export interface Treaty {
  id: string;
  type: TreatyType;
  parties: string[];
  duration: number;
  benefits: Record<string, number>;
  turnSigned: number;
}

export interface TradeRoute {
  id: string;
  race1Id: string;
  race2Id: string;
  resourceType: string;
  volume: number;
  status: TradeRouteStatus;
  profitMargin: number;
}

export interface WarDeclaration {
  id: string;
  aggressorId: string;
  defenderId: string;
  status: WarStatus;
  turnStarted: number;
  turnsElapsed: number;
  alliesAggressor: string[];
  alliesDefender: string[];
  warScore: number;
  warExhaustion: number;
  causes: string[];
  peaceTerms: string[];
}

export interface DiplomaticEvent {
  type:
    | 'treaty_signed'
    | 'treaty_broken'
    | 'war_declared'
    | 'peace_signed'
    | 'border_incident'
    | 'trade_deal'
    | 'alliance_formed'
    | 'alliance_dissolved'
    | 'vassalage_established'
    | 'vassalage_released';
  race1Id: string;
  race2Id: string;
  turn: number;
  details: string;
}

export interface TradeResourceFlow {
  fromRaceId: string;
  toRaceId: string;
  resourceType: string;
  amount: number;
  efficiency: number;
}

export interface WarEscalationStage {
  stage: number;
  name: string;
  requirements: {
    turnsElapsed: number;
    warScore: number;
    casualties: number;
  };
  effects: {
    mobilizationLevel: number;
    economicPenalty: number;
    allianceJoinThreshold: number;
  };
  description: string;
}

// ============================================================================
// RACE IDs
// ============================================================================

export const RACE_IDS = {
  military: [
    'race-terran-federation',
    'race-klingon-empire',
    'race-romulan-star-empire',
    'race-cardassian-union',
    'race-gorn-hegemony',
    'race-orion-syndicate',
    'race-nausicaan-clans',
    'race-hirogen-hunters',
  ] as const,
  science: [
    'race-vulcan-science-directorate',
    'race-borg-collective',
    'race-species-8472',
    'race-bynar-system',
    'race-voth',
    'race-caretaker-species',
    'race-changelings',
  ] as const,
  trade: [
    'race-ferengi-alliance',
    'race-bajoran-resistance',
    'race-betazoid-confederacy',
    'race-trill-symbionts',
    'race-benzite-union',
    'race-dosi-syndicate',
  ] as const,
  hive: [
    'race-xindi-council',
    'race-hierarchy',
    'race-vidiian-sodality',
    'race-hirogen-occupation',
  ] as const,
  ancient: [
    'race-q-continuum',
    'race-prophets',
    'race-preservers',
    'race-iconians',
    'race-voth-ministry',
  ] as const,
  original: [
    'race-krell',
    'race-zenith',
    'race-varanthi',
    'race-void-swarm',
    'race-celestial',
  ] as const,
} as const;

export const ALL_RACE_IDS: string[] = [
  ...RACE_IDS.military,
  ...RACE_IDS.science,
  ...RACE_IDS.trade,
  ...RACE_IDS.hive,
  ...RACE_IDS.ancient,
  ...RACE_IDS.original,
];

// ============================================================================
// ALLIANCE BLOCS
// ============================================================================

export const ALLIANCE_BLOCS: AllianceBloc[] = [
  {
    id: 'bloc-federation-alliance',
    name: 'Federation Alliance',
    memberRaceIds: [
      'race-terran-federation',
      'race-vulcan-science-directorate',
      'race-bajoran-resistance',
      'race-betazoid-confederacy',
      'race-trill-symbionts',
    ],
    leaderRaceId: 'race-terran-federation',
    description:
      'United Federation of Planets — democratic coalition of progressive civilizations.',
    bonuses: { combat: 10, economy: 15, research: 20, diplomacy: 25 },
    foundingTurn: 0,
    color: '#1E90FF',
  },
  {
    id: 'bloc-klingon-empire',
    name: 'Klingon Empire',
    memberRaceIds: [
      'race-klingon-empire',
      'race-gorn-hegemony',
      'race-nausicaan-clans',
    ],
    leaderRaceId: 'race-klingon-empire',
    description: 'Warrior coalition bound by honor and conquest.',
    bonuses: { combat: 30, economy: 5, research: 0, diplomacy: 0 },
    foundingTurn: 0,
    color: '#DC143C',
  },
  {
    id: 'bloc-romulan-star-empire',
    name: 'Romulan Star Empire',
    memberRaceIds: [
      'race-romulan-star-empire',
      'race-cardassian-union',
      'race-changelings',
    ],
    leaderRaceId: 'race-romulan-star-empire',
    description: 'Secretive dominion built on espionage and manipulation.',
    bonuses: { combat: 15, economy: 10, research: 10, diplomacy: 5 },
    foundingTurn: 0,
    color: '#006400',
  },
  {
    id: 'bloc-borg-collective',
    name: 'Borg Collective',
    memberRaceIds: [
      'race-borg-collective',
      'race-species-8472',
      'race-bynar-system',
    ],
    leaderRaceId: 'race-borg-collective',
    description: 'Assimilation-driven hive mind consuming all technology.',
    bonuses: { combat: 20, economy: 5, research: 30, diplomacy: 0 },
    foundingTurn: 0,
    color: '#9400D3',
  },
  {
    id: 'bloc-trade-consortium',
    name: 'Trade Consortium',
    memberRaceIds: [
      'race-ferengi-alliance',
      'race-varanthi',
      'race-dosi-syndicate',
      'race-benzite-union',
    ],
    leaderRaceId: 'race-ferengi-alliance',
    description: 'Mercantile guild maximizing profit across the galaxy.',
    bonuses: { combat: 0, economy: 35, research: 5, diplomacy: 10 },
    foundingTurn: 0,
    color: '#FFD700',
  },
  {
    id: 'bloc-ancient-council',
    name: 'Ancient Council',
    memberRaceIds: [
      'race-q-continuum',
      'race-prophets',
      'race-preservers',
      'race-iconians',
      'race-celestial',
    ],
    leaderRaceId: 'race-q-continuum',
    description: 'Transcendent beings governing cosmic order.',
    bonuses: { combat: 10, economy: 10, research: 25, diplomacy: 20 },
    foundingTurn: -1000,
    color: '#FF69B4',
  },
  {
    id: 'bloc-the-swarm',
    name: 'The Swarm',
    memberRaceIds: [
      'race-void-swarm',
      'race-vidiian-sodality',
      'race-xindi-council',
    ],
    leaderRaceId: 'race-void-swarm',
    description: 'Nomadic collectives consuming biological resources.',
    bonuses: { combat: 25, economy: 5, research: 10, diplomacy: 0 },
    foundingTurn: 0,
    color: '#800080',
  },
  {
    id: 'bloc-orion-territories',
    name: 'Orion Territories',
    memberRaceIds: [
      'race-orion-syndicate',
      'race-dosi-syndicate',
    ],
    leaderRaceId: 'race-orion-syndicate',
    description: 'Pirate haven and black market dominion.',
    bonuses: { combat: 15, economy: 20, research: 0, diplomacy: 0 },
    foundingTurn: 0,
    color: '#00FF7F',
  },
  {
    id: 'bloc-krell-dominion',
    name: 'Krell Dominion',
    memberRaceIds: [
      'race-krell',
      'race-hirogen-hunters',
      'race-hirogen-occupation',
    ],
    leaderRaceId: 'race-krell',
    description: 'Ruthless conquerors subjugating weaker species.',
    bonuses: { combat: 35, economy: 5, research: 0, diplomacy: 0 },
    foundingTurn: 0,
    color: '#B22222',
  },
  {
    id: 'bloc-isolationist',
    name: 'Isolationist Enclave',
    memberRaceIds: [
      'race-voth',
      'race-caretaker-species',
      'race-zenith',
    ],
    leaderRaceId: 'race-voth',
    description: 'Ancient recluses avoiding galactic entanglements.',
    bonuses: { combat: 10, economy: 10, research: 20, diplomacy: 0 },
    foundingTurn: -500,
    color: '#708090',
  },
];

// ============================================================================
// TREATIES
// ============================================================================

export const INITIAL_TREATIES: Treaty[] = [
  {
    id: 'treaty-fed-vulcan-defense',
    type: 'defense',
    parties: ['race-terran-federation', 'race-vulcan-science-directorate'],
    duration: -1,
    benefits: { combat: 5, research: 5 },
    turnSigned: 0,
  },
  {
    id: 'treaty-fed-bajoran-trade',
    type: 'trade',
    parties: ['race-terran-federation', 'race-bajoran-resistance'],
    duration: -1,
    benefits: { economy: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-fed-betazoid-cultural',
    type: 'cultural',
    parties: ['race-terran-federation', 'race-betazoid-confederacy'],
    duration: -1,
    benefits: { diplomacy: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-fed-trill-research',
    type: 'research',
    parties: ['race-terran-federation', 'race-trill-symbionts'],
    duration: -1,
    benefits: { research: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-klingon-gorn-defense',
    type: 'defense',
    parties: ['race-klingon-empire', 'race-gorn-hegemony'],
    duration: -1,
    benefits: { combat: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-klingon-nausicaan-defense',
    type: 'defense',
    parties: ['race-klingon-empire', 'race-nausicaan-clans'],
    duration: -1,
    benefits: { combat: 8 },
    turnSigned: 0,
  },
  {
    id: 'treaty-romulan-cardassian-defense',
    type: 'defense',
    parties: ['race-romulan-star-empire', 'race-cardassian-union'],
    duration: -1,
    benefits: { combat: 8, diplomacy: 5 },
    turnSigned: 0,
  },
  {
    id: 'treaty-romulan-changelings-non-aggression',
    type: 'non_aggression',
    parties: ['race-romulan-star-empire', 'race-changelings'],
    duration: -1,
    benefits: { diplomacy: 5 },
    turnSigned: 0,
  },
  {
    id: 'treaty-borg-8472-non-aggression',
    type: 'non_aggression',
    parties: ['race-borg-collective', 'race-species-8472'],
    duration: -1,
    benefits: { combat: 5 },
    turnSigned: 0,
  },
  {
    id: 'treaty-borg-bynar-research',
    type: 'research',
    parties: ['race-borg-collective', 'race-bynar-system'],
    duration: -1,
    benefits: { research: 15 },
    turnSigned: 0,
  },
  {
    id: 'treaty-ferengi-varanthi-trade',
    type: 'trade',
    parties: ['race-ferengi-alliance', 'race-varanthi'],
    duration: -1,
    benefits: { economy: 15 },
    turnSigned: 0,
  },
  {
    id: 'treaty-ferengi-dosi-trade',
    type: 'trade',
    parties: ['race-ferengi-alliance', 'race-dosi-syndicate'],
    duration: -1,
    benefits: { economy: 12 },
    turnSigned: 0,
  },
  {
    id: 'treaty-ferengi-benzite-trade',
    type: 'trade',
    parties: ['race-ferengi-alliance', 'race-benzite-union'],
    duration: -1,
    benefits: { economy: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-q-prophets-cultural',
    type: 'cultural',
    parties: ['race-q-continuum', 'race-prophets'],
    duration: -1,
    benefits: { diplomacy: 15, research: 10 },
    turnSigned: -1000,
  },
  {
    id: 'treaty-preservers-iconians-research',
    type: 'research',
    parties: ['race-preservers', 'race-iconians'],
    duration: -1,
    benefits: { research: 15 },
    turnSigned: -1000,
  },
  {
    id: 'treaty-q-celestial-cultural',
    type: 'cultural',
    parties: ['race-q-continuum', 'race-celestial'],
    duration: -1,
    benefits: { diplomacy: 10, research: 5 },
    turnSigned: -1000,
  },
  {
    id: 'treaty-void-swarm-vidiian-defense',
    type: 'defense',
    parties: ['race-void-swarm', 'race-vidiian-sodality'],
    duration: -1,
    benefits: { combat: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-void-swarm-xindi-defense',
    type: 'defense',
    parties: ['race-void-swarm', 'race-xindi-council'],
    duration: -1,
    benefits: { combat: 8 },
    turnSigned: 0,
  },
  {
    id: 'treaty-voth-caretaker-non-aggression',
    type: 'non_aggression',
    parties: ['race-voth', 'race-caretaker-species'],
    duration: -1,
    benefits: { research: 5 },
    turnSigned: -500,
  },
  {
    id: 'treaty-voth-zenith-non-aggression',
    type: 'non_aggression',
    parties: ['race-voth', 'race-zenith'],
    duration: -1,
    benefits: { research: 5 },
    turnSigned: -500,
  },
  {
    id: 'treaty-krell-hirogen-hunters-defense',
    type: 'defense',
    parties: ['race-krell', 'race-hirogen-hunters'],
    duration: -1,
    benefits: { combat: 12 },
    turnSigned: 0,
  },
  {
    id: 'treaty-krell-hirogen-occupation-defense',
    type: 'defense',
    parties: ['race-krell', 'race-hirogen-occupation'],
    duration: -1,
    benefits: { combat: 10 },
    turnSigned: 0,
  },
  {
    id: 'treaty-orion-dosi-trade',
    type: 'trade',
    parties: ['race-orion-syndicate', 'race-dosi-syndicate'],
    duration: -1,
    benefits: { economy: 8 },
    turnSigned: 0,
  },
  {
    id: 'treaty-vulcan-betazoid-cultural',
    type: 'cultural',
    parties: ['race-vulcan-science-directorate', 'race-betazoid-confederacy'],
    duration: 50,
    benefits: { research: 5, diplomacy: 5 },
    turnSigned: 0,
  },
  {
    id: 'treaty-bajoran-betazoid-non-aggression',
    type: 'non_aggression',
    parties: ['race-bajoran-resistance', 'race-betazoid-confederacy'],
    duration: -1,
    benefits: { diplomacy: 3 },
    turnSigned: 0,
  },
  {
    id: 'treaty-bajoran-trill-trade',
    type: 'trade',
    parties: ['race-bajoran-resistance', 'race-trill-symbionts'],
    duration: 100,
    benefits: { economy: 8 },
    turnSigned: 0,
  },
  {
    id: 'treaty-species-8472-voth-non-aggression',
    type: 'non_aggression',
    parties: ['race-species-8472', 'race-voth'],
    duration: -1,
    benefits: { combat: 3 },
    turnSigned: 0,
  },
  {
    id: 'treaty-voth-ministry-voth-cultural',
    type: 'cultural',
    parties: ['race-voth-ministry', 'race-voth'],
    duration: -1,
    benefits: { research: 8, diplomacy: 5 },
    turnSigned: -500,
  },
  {
    id: 'treaty-iconians-celestial-research',
    type: 'research',
    parties: ['race-iconians', 'race-celestial'],
    duration: -1,
    benefits: { research: 12 },
    turnSigned: -1000,
  },
  {
    id: 'treaty-hierarchy-xindi-trade',
    type: 'trade',
    parties: ['race-hierarchy', 'race-xindi-council'],
    duration: 75,
    benefits: { economy: 6 },
    turnSigned: 0,
  },
];

// ============================================================================
// INITIAL TRADE ROUTES
// ============================================================================

export const INITIAL_TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'trade-terran-vulcan',
    race1Id: 'race-terran-federation',
    race2Id: 'race-vulcan-science-directorate',
    resourceType: 'technology',
    volume: 500,
    status: 'active',
    profitMargin: 0.15,
  },
  {
    id: 'trade-terran-bajoran',
    race1Id: 'race-terran-federation',
    race2Id: 'race-bajoran-resistance',
    resourceType: 'minerals',
    volume: 350,
    status: 'active',
    profitMargin: 0.12,
  },
  {
    id: 'trade-terran-betazoid',
    race1Id: 'race-terran-federation',
    race2Id: 'race-betazoid-confederacy',
    resourceType: 'luxury_goods',
    volume: 200,
    status: 'active',
    profitMargin: 0.2,
  },
  {
    id: 'trade-terran-trill',
    race1Id: 'race-terran-federation',
    race2Id: 'race-trill-symbionts',
    resourceType: 'biotechnology',
    volume: 250,
    status: 'active',
    profitMargin: 0.18,
  },
  {
    id: 'trade-ferengi-varanthi',
    race1Id: 'race-ferengi-alliance',
    race2Id: 'race-varanthi',
    resourceType: 'rare_materials',
    volume: 800,
    status: 'active',
    profitMargin: 0.25,
  },
  {
    id: 'trade-ferengi-dosi',
    race1Id: 'race-ferengi-alliance',
    race2Id: 'race-dosi-syndicate',
    resourceType: 'energy',
    volume: 600,
    status: 'active',
    profitMargin: 0.2,
  },
  {
    id: 'trade-ferengi-benzite',
    race1Id: 'race-ferengi-alliance',
    race2Id: 'race-benzite-union',
    resourceType: 'minerals',
    volume: 450,
    status: 'active',
    profitMargin: 0.18,
  },
  {
    id: 'trade-orion-dosi',
    race1Id: 'race-orion-syndicate',
    race2Id: 'race-dosi-syndicate',
    resourceType: 'contraband',
    volume: 300,
    status: 'active',
    profitMargin: 0.35,
  },
  {
    id: 'trade-klingon-gorn',
    race1Id: 'race-klingon-empire',
    race2Id: 'race-gorn-hegemony',
    resourceType: 'military_materials',
    volume: 400,
    status: 'active',
    profitMargin: 0.1,
  },
  {
    id: 'trade-romulan-cardassian',
    race1Id: 'race-romulan-star-empire',
    race2Id: 'race-cardassian-union',
    resourceType: 'intelligence',
    volume: 350,
    status: 'active',
    profitMargin: 0.15,
  },
  {
    id: 'trade-borg-bynar',
    race1Id: 'race-borg-collective',
    race2Id: 'race-bynar-system',
    resourceType: 'data',
    volume: 1000,
    status: 'active',
    profitMargin: 0.05,
  },
  {
    id: 'trade-hierarchy-xindi',
    race1Id: 'race-hierarchy',
    race2Id: 'race-xindi-council',
    resourceType: 'bio_resources',
    volume: 250,
    status: 'active',
    profitMargin: 0.12,
  },
  {
    id: 'trade-voth-ministry',
    race1Id: 'race-voth',
    race2Id: 'race-voth-ministry',
    resourceType: 'technology',
    volume: 200,
    status: 'active',
    profitMargin: 0.1,
  },
  {
    id: 'trade-krell-hirogen',
    race1Id: 'race-krell',
    race2Id: 'race-hirogen-hunters',
    resourceType: 'military_materials',
    volume: 300,
    status: 'active',
    profitMargin: 0.08,
  },
  {
    id: 'trade-q-celestial',
    race1Id: 'race-q-continuum',
    race2Id: 'race-celestial',
    resourceType: 'exotic_energy',
    volume: 50,
    status: 'active',
    profitMargin: 0.5,
  },
  {
    id: 'trade-void-swarm-vidiian',
    race1Id: 'race-void-swarm',
    race2Id: 'race-vidiian-sodality',
    resourceType: 'biomatter',
    volume: 400,
    status: 'active',
    profitMargin: 0.15,
  },
  {
    id: 'trade-preservers-iconians',
    race1Id: 'race-preservers',
    race2Id: 'race-iconians',
    resourceType: 'ancient_artifacts',
    volume: 100,
    status: 'active',
    profitMargin: 0.4,
  },
  {
    id: 'trade-bajoran-trill',
    race1Id: 'race-bajoran-resistance',
    race2Id: 'race-trill-symbionts',
    resourceType: 'medical',
    volume: 150,
    status: 'active',
    profitMargin: 0.2,
  },
  {
    id: 'trade-terran-benzite',
    race1Id: 'race-terran-federation',
    race2Id: 'race-benzite-union',
    resourceType: 'minerals',
    volume: 200,
    status: 'active',
    profitMargin: 0.12,
  },
];

// ============================================================================
// WAR ESCALATION STAGES
// ============================================================================

export const WAR_ESCALATION_STAGES: WarEscalationStage[] = [
  {
    stage: 1,
    name: 'Cold War',
    requirements: { turnsElapsed: 0, warScore: 0, casualties: 0 },
    effects: {
      mobilizationLevel: 0.1,
      economicPenalty: 0.05,
      allianceJoinThreshold: 80,
    },
    description: 'Tensions rising, diplomatic incidents.',
  },
  {
    stage: 2,
    name: 'Border Skirmish',
    requirements: { turnsElapsed: 3, warScore: 5, casualties: 100 },
    effects: {
      mobilizationLevel: 0.3,
      economicPenalty: 0.1,
      allianceJoinThreshold: 60,
    },
    description: 'Small-scale military engagements at borders.',
  },
  {
    stage: 3,
    name: 'Limited War',
    requirements: { turnsElapsed: 8, warScore: 15, casualties: 500 },
    effects: {
      mobilizationLevel: 0.5,
      economicPenalty: 0.2,
      allianceJoinThreshold: 40,
    },
    description: 'Widespread military operations, allies may join.',
  },
  {
    stage: 4,
    name: 'Full War',
    requirements: { turnsElapsed: 15, warScore: 30, casualties: 1500 },
    effects: {
      mobilizationLevel: 0.8,
      economicPenalty: 0.35,
      allianceJoinThreshold: 20,
    },
    description: 'Total military mobilization, allies must join.',
  },
  {
    stage: 5,
    name: 'Total War',
    requirements: { turnsElapsed: 25, warScore: 60, casualties: 5000 },
    effects: {
      mobilizationLevel: 1.0,
      economicPenalty: 0.5,
      allianceJoinThreshold: 0,
    },
    description: 'War of annihilation, no retreat.',
  },
];

// ============================================================================
// RELATIONSHIP MATRIX — 35x35
// ============================================================================

function rel(
  r1: string,
  r2: string,
  status: DiplomaticStatus,
  strength: number,
  tradeVolume: number,
  treaties: Treaty[] = []
): DiplomaticRelation {
  return {
    race1Id: r1,
    race2Id: r2,
    status,
    strength,
    tradeVolume,
    lastInteraction: 0,
    treaties,
  };
}

function findTreatiesBetween(a: string, b: string): Treaty[] {
  return INITIAL_TREATIES.filter(
    (t) => t.parties.includes(a) && t.parties.includes(b)
  );
}

export const RELATIONSHIP_MATRIX: DiplomaticRelation[] = (() => {
  const matrix: DiplomaticRelation[] = [];

  const getTreaties = findTreatiesBetween;

  const t: DiplomaticRelation[] = [
    // ======================================================================
    // FEDERATION ALLIANCE (internal)
    // ======================================================================
    rel('race-terran-federation', 'race-vulcan-science-directorate', 'allied', 95, 500, findTreatiesBetween('race-terran-federation', 'race-vulcan-science-directorate')),
    rel('race-terran-federation', 'race-bajoran-resistance', 'allied', 85, 350, findTreatiesBetween('race-terran-federation', 'race-bajoran-resistance')),
    rel('race-terran-federation', 'race-betazoid-confederacy', 'allied', 80, 200, findTreatiesBetween('race-terran-federation', 'race-betazoid-confederacy')),
    rel('race-terran-federation', 'race-trill-symbionts', 'allied', 82, 250, findTreatiesBetween('race-terran-federation', 'race-trill-symbionts')),
    rel('race-vulcan-science-directorate', 'race-bajoran-resistance', 'defensive_pact', 60, 50, findTreatiesBetween('race-vulcan-science-directorate', 'race-betazoid-confederacy')),
    rel('race-vulcan-science-directorate', 'race-betazoid-confederacy', 'trade_agreement', 55, 80, findTreatiesBetween('race-vulcan-science-directorate', 'race-betazoid-confederacy')),
    rel('race-vulcan-science-directorate', 'race-trill-symbionts', 'trade_agreement', 65, 100, findTreatiesBetween('race-terran-federation', 'race-trill-symbionts')),
    rel('race-bajoran-resistance', 'race-betazoid-confederacy', 'non_aggression', 50, 30, findTreatiesBetween('race-bajoran-resistance', 'race-betazoid-confederacy')),
    rel('race-bajoran-resistance', 'race-trill-symbionts', 'trade_agreement', 55, 150, findTreatiesBetween('race-bajoran-resistance', 'race-trill-symbionts')),
    rel('race-betazoid-confederacy', 'race-trill-symbionts', 'trade_agreement', 60, 70),

    // ======================================================================
    // KLINGON EMPIRE (internal)
    // ======================================================================
    rel('race-klingon-empire', 'race-gorn-hegemony', 'allied', 88, 400, findTreatiesBetween('race-klingon-empire', 'race-gorn-hegemony')),
    rel('race-klingon-empire', 'race-nausicaan-clans', 'allied', 75, 200, findTreatiesBetween('race-klingon-empire', 'race-nausicaan-clans')),
    rel('race-gorn-hegemony', 'race-nausicaan-clans', 'defensive_pact', 60, 50),

    // ======================================================================
    // ROMULAN STAR EMPIRE (internal)
    // ======================================================================
    rel('race-romulan-star-empire', 'race-cardassian-union', 'allied', 78, 350, findTreatiesBetween('race-romulan-star-empire', 'race-cardassian-union')),
    rel('race-romulan-star-empire', 'race-changelings', 'allied', 70, 50, findTreatiesBetween('race-romulan-star-empire', 'race-changelings')),
    rel('race-cardassian-union', 'race-changelings', 'defensive_pact', 55, 30),

    // ======================================================================
    // BORG COLLECTIVE (internal)
    // ======================================================================
    rel('race-borg-collective', 'race-species-8472', 'defensive_pact', 65, 0, findTreatiesBetween('race-borg-collective', 'race-species-8472')),
    rel('race-borg-collective', 'race-bynar-system', 'allied', 90, 1000, findTreatiesBetween('race-borg-collective', 'race-bynar-system')),
    rel('race-species-8472', 'race-bynar-system', 'non_aggression', 30, 0),

    // ======================================================================
    // TRADE CONSORTIUM (internal)
    // ======================================================================
    rel('race-ferengi-alliance', 'race-varanthi', 'allied', 85, 800, findTreatiesBetween('race-ferengi-alliance', 'race-varanthi')),
    rel('race-ferengi-alliance', 'race-dosi-syndicate', 'allied', 80, 600, findTreatiesBetween('race-ferengi-alliance', 'race-dosi-syndicate')),
    rel('race-ferengi-alliance', 'race-benzite-union', 'allied', 75, 450, findTreatiesBetween('race-ferengi-alliance', 'race-benzite-union')),
    rel('race-varanthi', 'race-dosi-syndicate', 'trade_agreement', 60, 100),
    rel('race-varanthi', 'race-benzite-union', 'trade_agreement', 55, 80),
    rel('race-dosi-syndicate', 'race-benzite-union', 'trade_agreement', 50, 60),

    // ======================================================================
    // ANCIENT COUNCIL (internal)
    // ======================================================================
    rel('race-q-continuum', 'race-prophets', 'allied', 92, 50, findTreatiesBetween('race-q-continuum', 'race-prophets')),
    rel('race-q-continuum', 'race-preservers', 'defensive_pact', 75, 20),
    rel('race-q-continuum', 'race-iconians', 'defensive_pact', 78, 30),
    rel('race-q-continuum', 'race-celestial', 'allied', 88, 50, findTreatiesBetween('race-q-continuum', 'race-celestial')),
    rel('race-prophets', 'race-preservers', 'non_aggression', 60, 10),
    rel('race-prophets', 'race-iconians', 'non_aggression', 65, 15),
    rel('race-prophets', 'race-celestial', 'defensive_pact', 80, 20),
    rel('race-preservers', 'race-iconians', 'allied', 85, 100, findTreatiesBetween('race-preservers', 'race-iconians')),
    rel('race-preservers', 'race-celestial', 'defensive_pact', 70, 30, findTreatiesBetween('race-iconians', 'race-celestial')),
    rel('race-iconians', 'race-celestial', 'allied', 82, 40, findTreatiesBetween('race-iconians', 'race-celestial')),

    // ======================================================================
    // THE SWARM (internal)
    // ======================================================================
    rel('race-void-swarm', 'race-vidiian-sodality', 'allied', 72, 400, findTreatiesBetween('race-void-swarm', 'race-vidiian-sodality')),
    rel('race-void-swarm', 'race-xindi-council', 'allied', 68, 300, findTreatiesBetween('race-void-swarm', 'race-xindi-council')),
    rel('race-vidiian-sodality', 'race-xindi-council', 'trade_agreement', 55, 150),

    // ======================================================================
    // ORION TERRITORIES (internal)
    // ======================================================================
    rel('race-orion-syndicate', 'race-dosi-syndicate', 'allied', 70, 300, findTreatiesBetween('race-orion-syndicate', 'race-dosi-syndicate')),

    // ======================================================================
    // KRELL DOMINION (internal)
    // ======================================================================
    rel('race-krell', 'race-hirogen-hunters', 'allied', 82, 300, findTreatiesBetween('race-krell', 'race-hirogen-hunters')),
    rel('race-krell', 'race-hirogen-occupation', 'allied', 78, 200, findTreatiesBetween('race-krell', 'race-hirogen-occupation')),
    rel('race-hirogen-hunters', 'race-hirogen-occupation', 'defensive_pact', 70, 100),
    rel('race-hirogen-hunters', 'race-hirogen-hunters', 'neutral', 0, 0),
    rel('race-hirogen-occupation', 'race-hirogen-occupation', 'neutral', 0, 0),

    // ======================================================================
    // ISOLATIONIST ENCLAVE (internal)
    // ======================================================================
    rel('race-voth', 'race-caretaker-species', 'non_aggression', 45, 50, findTreatiesBetween('race-voth', 'race-caretaker-species')),
    rel('race-voth', 'race-zenith', 'non_aggression', 40, 30, findTreatiesBetween('race-voth', 'race-zenith')),
    rel('race-caretaker-species', 'race-zenith', 'neutral', 20, 10),
    rel('race-voth', 'race-voth-ministry', 'allied', 90, 200, findTreatiesBetween('race-voth-ministry', 'race-voth')),

    // ======================================================================
    // FEDERATION vs OTHER BLOCS — diplomatic
    // ======================================================================
    rel('race-terran-federation', 'race-klingon-empire', 'neutral', -10, 0),
    rel('race-terran-federation', 'race-romulan-star-empire', 'unfriendly', -35, 0),
    rel('race-terran-federation', 'race-cardassian-union', 'hostile', -60, 0),
    rel('race-terran-federation', 'race-gorn-hegemony', 'unfriendly', -20, 0),
    rel('race-terran-federation', 'race-orion-syndicate', 'hostile', -50, 0),
    rel('race-terran-federation', 'race-nausicaan-clans', 'unfriendly', -30, 0),
    rel('race-terran-federation', 'race-hirogen-hunters', 'unfriendly', -25, 0),
    rel('race-terran-federation', 'race-borg-collective', 'hostile', -80, 0),
    rel('race-terran-federation', 'race-species-8472', 'hostile', -70, 0),
    rel('race-terran-federation', 'race-bynar-system', 'unfriendly', -20, 0),
    rel('race-terran-federation', 'race-ferengi-alliance', 'trade_agreement', 40, 200),
    rel('race-terran-federation', 'race-voth', 'unfriendly', -15, 0),
    rel('race-terran-federation', 'race-caretaker-species', 'neutral', 0, 0),
    rel('race-terran-federation', 'race-changelings', 'hostile', -65, 0),
    rel('race-terran-federation', 'race-xindi-council', 'hostile', -55, 0),
    rel('race-terran-federation', 'race-hierarchy', 'hostile', -45, 0),
    rel('race-terran-federation', 'race-vidiian-sodality', 'hostile', -60, 0),
    rel('race-terran-federation', 'race-hirogen-occupation', 'hostile', -50, 0),
    rel('race-terran-federation', 'race-q-continuum', 'neutral', 10, 0),
    rel('race-terran-federation', 'race-prophets', 'neutral', 5, 0),
    rel('race-terran-federation', 'race-preservers', 'trade_agreement', 30, 50),
    rel('race-terran-federation', 'race-iconians', 'neutral', 15, 0),
    rel('race-terran-federation', 'race-voth-ministry', 'unfriendly', -10, 0),
    rel('race-terran-federation', 'race-krell', 'hostile', -55, 0),
    rel('race-terran-federation', 'race-zenith', 'neutral', 10, 0),
    rel('race-terran-federation', 'race-varanthi', 'trade_agreement', 35, 100),
    rel('race-terran-federation', 'race-void-swarm', 'hostile', -70, 0),
    rel('race-terran-federation', 'race-celestial', 'neutral', 20, 0),
    rel('race-terran-federation', 'race-benzite-union', 'trade_agreement', 40, 200),
    rel('race-terran-federation', 'race-dosi-syndicate', 'neutral', 10, 0),

    // ======================================================================
    // VULCAN vs OTHERS
    // ======================================================================
    rel('race-vulcan-science-directorate', 'race-klingon-empire', 'unfriendly', -25, 0),
    rel('race-vulcan-science-directorate', 'race-romulan-star-empire', 'unfriendly', -40, 0),
    rel('race-vulcan-science-directorate', 'race-cardassian-union', 'hostile', -50, 0),
    rel('race-vulcan-science-directorate', 'race-borg-collective', 'hostile', -85, 0),
    rel('race-vulcan-science-directorate', 'race-ferengi-alliance', 'neutral', 15, 30),
    rel('race-vulcan-science-directorate', 'race-q-continuum', 'neutral', 20, 0),
    rel('race-vulcan-science-directorate', 'race-preservers', 'trade_agreement', 35, 40),
    rel('race-vulcan-science-directorate', 'race-voth', 'neutral', 10, 0),

    // ======================================================================
    // KLINGON vs OTHERS
    // ======================================================================
    rel('race-klingon-empire', 'race-romulan-star-empire', 'unfriendly', -30, 0),
    rel('race-klingon-empire', 'race-cardassian-union', 'unfriendly', -20, 0),
    rel('race-klingon-empire', 'race-orion-syndicate', 'neutral', 10, 50),
    rel('race-klingon-empire', 'race-hirogen-hunters', 'unfriendly', -15, 0),
    rel('race-klingon-empire', 'race-borg-collective', 'hostile', -75, 0),
    rel('race-klingon-empire', 'race-ferengi-alliance', 'trade_agreement', 25, 100),
    rel('race-klingon-empire', 'race-krell', 'hostile', -60, 0),
    rel('race-klingon-empire', 'race-xindi-council', 'hostile', -50, 0),
    rel('race-klingon-empire', 'race-void-swarm', 'hostile', -55, 0),
    rel('race-klingon-empire', 'race-vulcan-science-directorate', 'unfriendly', -25, 0),

    // ======================================================================
    // ROMULAN vs OTHERS
    // ======================================================================
    rel('race-romulan-star-empire', 'race-klingon-empire', 'unfriendly', -30, 0),
    rel('race-romulan-star-empire', 'race-orion-syndicate', 'hostile', -40, 0),
    rel('race-romulan-star-empire', 'race-nausicaan-clans', 'unfriendly', -20, 0),
    rel('race-romulan-star-empire', 'race-hirogen-hunters', 'unfriendly', -25, 0),
    rel('race-romulan-star-empire', 'race-borg-collective', 'hostile', -70, 0),
    rel('race-romulan-star-empire', 'race-ferengi-alliance', 'neutral', 10, 50),
    rel('race-romulan-star-empire', 'race-krell', 'hostile', -65, 0),
    rel('race-romulan-star-empire', 'race-xindi-council', 'hostile', -45, 0),
    rel('race-romulan-star-empire', 'race-void-swarm', 'hostile', -60, 0),
    rel('race-romulan-star-empire', 'race-q-continuum', 'neutral', 5, 0),

    // ======================================================================
    // CARDASSIAN vs OTHERS
    // ======================================================================
    rel('race-cardassian-union', 'race-klingon-empire', 'unfriendly', -20, 0),
    rel('race-cardassian-union', 'race-gorn-hegemony', 'unfriendly', -15, 0),
    rel('race-cardassian-union', 'race-nausicaan-clans', 'unfriendly', -10, 0),
    rel('race-cardassian-union', 'race-orion-syndicate', 'hostile', -35, 0),
    rel('race-cardassian-union', 'race-borg-collective', 'hostile', -60, 0),
    rel('race-cardassian-union', 'race-ferengi-alliance', 'trade_agreement', 20, 80),
    rel('race-cardassian-union', 'race-krell', 'hostile', -50, 0),

    // ======================================================================
    // GORN vs OTHERS
    // ======================================================================
    rel('race-gorn-hegemony', 'race-romulan-star-empire', 'unfriendly', -15, 0),
    rel('race-gorn-hegemony', 'race-cardassian-union', 'unfriendly', -15, 0),
    rel('race-gorn-hegemony', 'race-orion-syndicate', 'neutral', 15, 30),
    rel('race-gorn-hegemony', 'race-borg-collective', 'hostile', -50, 0),
    rel('race-gorn-hegemony', 'race-krell', 'hostile', -55, 0),

    // ======================================================================
    // ORION vs OTHERS
    // ======================================================================
    rel('race-orion-syndicate', 'race-klingon-empire', 'neutral', 10, 50),
    rel('race-orion-syndicate', 'race-romulan-star-empire', 'hostile', -40, 0),
    rel('race-orion-syndicate', 'race-cardassian-union', 'hostile', -35, 0),
    rel('race-orion-syndicate', 'race-nausicaan-clans', 'unfriendly', -20, 0),
    rel('race-orion-syndicate', 'race-hirogen-hunters', 'neutral', 10, 20),
    rel('race-orion-syndicate', 'race-borg-collective', 'hostile', -70, 0),
    rel('race-orion-syndicate', 'race-ferengi-alliance', 'trade_agreement', 35, 150),
    rel('race-orion-syndicate', 'race-krell', 'unfriendly', -25, 0),
    rel('race-orion-syndicate', 'race-void-swarm', 'unfriendly', -30, 0),
    rel('race-orion-syndicate', 'race-varanthi', 'trade_agreement', 25, 80),

    // ======================================================================
    // NAUSICAAAN vs OTHERS
    // ======================================================================
    rel('race-nausicaan-clans', 'race-romulan-star-empire', 'unfriendly', -20, 0),
    rel('race-nausicaan-clans', 'race-cardassian-union', 'unfriendly', -10, 0),
    rel('race-nausicaan-clans', 'race-orion-syndicate', 'unfriendly', -20, 0),
    rel('race-nausicaan-clans', 'race-borg-collective', 'hostile', -60, 0),
    rel('race-nausicaan-clans', 'race-ferengi-alliance', 'trade_agreement', 20, 60),
    rel('race-nausicaan-clans', 'race-krell', 'hostile', -45, 0),

    // ======================================================================
    // HIROGEN HUNTERS vs OTHERS
    // ======================================================================
    rel('race-hirogen-hunters', 'race-romulan-star-empire', 'unfriendly', -25, 0),
    rel('race-hirogen-hunters', 'race-cardassian-union', 'unfriendly', -15, 0),
    rel('race-hirogen-hunters', 'race-orion-syndicate', 'neutral', 10, 20),
    rel('race-hirogen-hunters', 'race-borg-collective', 'hostile', -65, 0),
    rel('race-hirogen-hunters', 'race-ferengi-alliance', 'neutral', 5, 30),
    rel('race-hirogen-hunters', 'race-xindi-council', 'hostile', -50, 0),
    rel('race-hirogen-hunters', 'race-vidiian-sodality', 'hostile', -45, 0),
    rel('race-hirogen-hunters', 'race-void-swarm', 'hostile', -55, 0),

    // ======================================================================
    // BORG vs OTHERS
    // ======================================================================
    rel('race-borg-collective', 'race-terran-federation', 'hostile', -80, 0),
    rel('race-borg-collective', 'race-klingon-empire', 'hostile', -75, 0),
    rel('race-borg-collective', 'race-romulan-star-empire', 'hostile', -70, 0),
    rel('race-borg-collective', 'race-cardassian-union', 'hostile', -60, 0),
    rel('race-borg-collective', 'race-gorn-hegemony', 'hostile', -50, 0),
    rel('race-borg-collective', 'race-nausicaan-clans', 'hostile', -60, 0),
    rel('race-borg-collective', 'race-orion-syndicate', 'hostile', -70, 0),
    rel('race-borg-collective', 'race-hirogen-hunters', 'hostile', -65, 0),
    rel('race-borg-collective', 'race-ferengi-alliance', 'hostile', -75, 0),
    rel('race-borg-collective', 'race-krell', 'hostile', -80, 0),
    rel('race-borg-collective', 'race-xindi-council', 'hostile', -55, 0),
    rel('race-borg-collective', 'race-vidiian-sodality', 'hostile', -60, 0),
    rel('race-borg-collective', 'race-void-swarm', 'hostile', -70, 0),
    rel('race-borg-collective', 'race-hierarchy', 'hostile', -50, 0),
    rel('race-borg-collective', 'race-hirogen-occupation', 'hostile', -55, 0),
    rel('race-borg-collective', 'race-q-continuum', 'unfriendly', -30, 0),
    rel('race-borg-collective', 'race-prophets', 'unfriendly', -25, 0),
    rel('race-borg-collective', 'race-voth', 'hostile', -60, 0),
    rel('race-borg-collective', 'race-voth-ministry', 'hostile', -55, 0),

    // ======================================================================
    // SPECIES 8472 vs OTHERS
    // ======================================================================
    rel('race-species-8472', 'race-terran-federation', 'hostile', -70, 0),
    rel('race-species-8472', 'race-klingon-empire', 'hostile', -65, 0),
    rel('race-species-8472', 'race-romulan-star-empire', 'hostile', -60, 0),
    rel('race-species-8472', 'race-orion-syndicate', 'hostile', -50, 0),
    rel('race-species-8472', 'race-ferengi-alliance', 'hostile', -55, 0),
    rel('race-species-8472', 'race-krell', 'hostile', -70, 0),
    rel('race-species-8472', 'race-xindi-council', 'hostile', -45, 0),
    rel('race-species-8472', 'race-vidiian-sodality', 'hostile', -50, 0),
    rel('race-species-8472', 'race-void-swarm', 'hostile', -55, 0),
    rel('race-species-8472', 'race-voth', 'non_aggression', 15, 0, findTreatiesBetween('race-species-8472', 'race-voth')),

    // ======================================================================
    // BYNAR vs OTHERS
    // ======================================================================
    rel('race-bynar-system', 'race-terran-federation', 'unfriendly', -20, 0),
    rel('race-bynar-system', 'race-klingon-empire', 'hostile', -40, 0),
    rel('race-bynar-system', 'race-romulan-star-empire', 'hostile', -45, 0),
    rel('race-bynar-system', 'race-ferengi-alliance', 'neutral', 15, 50),
    rel('race-bynar-system', 'race-q-continuum', 'neutral', 10, 0),
    rel('race-bynar-system', 'race-voth', 'neutral', 5, 0),

    // ======================================================================
    // FERENGI vs OTHERS
    // ======================================================================
    rel('race-ferengi-alliance', 'race-klingon-empire', 'trade_agreement', 25, 100),
    rel('race-ferengi-alliance', 'race-romulan-star-empire', 'neutral', 10, 50),
    rel('race-ferengi-alliance', 'race-cardassian-union', 'trade_agreement', 20, 80),
    rel('race-ferengi-alliance', 'race-orion-syndicate', 'trade_agreement', 35, 150),
    rel('race-ferengi-alliance', 'race-nausicaan-clans', 'trade_agreement', 20, 60),
    rel('race-ferengi-alliance', 'race-bajoran-resistance', 'trade_agreement', 30, 100),
    rel('race-ferengi-alliance', 'race-betazoid-confederacy', 'trade_agreement', 25, 80),
    rel('race-ferengi-alliance', 'race-trill-symbionts', 'trade_agreement', 20, 60),
    rel('race-ferengi-alliance', 'race-xindi-council', 'neutral', 5, 30),
    rel('race-ferengi-alliance', 'race-voth', 'neutral', 10, 20),
    rel('race-ferengi-alliance', 'race-q-continuum', 'neutral', 5, 10),
    rel('race-ferengi-alliance', 'race-krell', 'unfriendly', -20, 0),
    rel('race-ferengi-alliance', 'race-void-swarm', 'unfriendly', -15, 0),

    // ======================================================================
    // BAJORAN vs OTHERS
    // ======================================================================
    rel('race-bajoran-resistance', 'race-klingon-empire', 'neutral', 5, 0),
    rel('race-bajoran-resistance', 'race-romulan-star-empire', 'unfriendly', -30, 0),
    rel('race-bajoran-resistance', 'race-cardassian-union', 'hostile', -80, 0),
    rel('race-bajoran-resistance', 'race-borg-collective', 'hostile', -65, 0),
    rel('race-bajoran-resistance', 'race-ferengi-alliance', 'trade_agreement', 30, 100),

    // ======================================================================
    // BETAZOID vs OTHERS
    // ======================================================================
    rel('race-betazoid-confederacy', 'race-klingon-empire', 'unfriendly', -20, 0),
    rel('race-betazoid-confederacy', 'race-romulan-star-empire', 'unfriendly', -25, 0),
    rel('race-betazoid-confederacy', 'race-cardassian-union', 'hostile', -55, 0),
    rel('race-betazoid-confederacy', 'race-borg-collective', 'hostile', -70, 0),
    rel('race-betazoid-confederacy', 'race-ferengi-alliance', 'trade_agreement', 25, 80),

    // ======================================================================
    // TRILL vs OTHERS
    // ======================================================================
    rel('race-trill-symbionts', 'race-klingon-empire', 'neutral', 5, 0),
    rel('race-trill-symbionts', 'race-romulan-star-empire', 'unfriendly', -20, 0),
    rel('race-trill-symbionts', 'race-cardassian-union', 'hostile', -45, 0),
    rel('race-trill-symbionts', 'race-borg-collective', 'hostile', -60, 0),
    rel('race-trill-symbionts', 'race-ferengi-alliance', 'trade_agreement', 20, 60),

    // ======================================================================
    // XINDI vs OTHERS
    // ======================================================================
    rel('race-xindi-council', 'race-terran-federation', 'hostile', -55, 0),
    rel('race-xindi-council', 'race-klingon-empire', 'hostile', -50, 0),
    rel('race-xindi-council', 'race-romulan-star-empire', 'hostile', -45, 0),
    rel('race-xindi-council', 'race-borg-collective', 'hostile', -55, 0),
    rel('race-xindi-council', 'race-hirogen-hunters', 'hostile', -50, 0),
    rel('race-xindi-council', 'race-ferengi-alliance', 'neutral', 5, 30),
    rel('race-xindi-council', 'race-krell', 'unfriendly', -20, 0),

    // ======================================================================
    // HIERARCHY vs OTHERS
    // ======================================================================
    rel('race-hierarchy', 'race-terran-federation', 'hostile', -45, 0),
    rel('race-hierarchy', 'race-klingon-empire', 'hostile', -40, 0),
    rel('race-hierarchy', 'race-romulan-star-empire', 'unfriendly', -25, 0),
    rel('race-hierarchy', 'race-borg-collective', 'hostile', -50, 0),
    rel('race-hierarchy', 'race-ferengi-alliance', 'neutral', 10, 40),
    rel('race-hierarchy', 'race-void-swarm', 'unfriendly', -20, 0),
    rel('race-hierarchy', 'race-krell', 'unfriendly', -15, 0),

    // ======================================================================
    // VIDIIAN vs OTHERS
    // ======================================================================
    rel('race-vidiian-sodality', 'race-terran-federation', 'hostile', -60, 0),
    rel('race-vidiian-sodality', 'race-klingon-empire', 'hostile', -50, 0),
    rel('race-vidiian-sodality', 'race-romulan-star-empire', 'hostile', -45, 0),
    rel('race-vidiian-sodality', 'race-borg-collective', 'hostile', -60, 0),
    rel('race-vidiian-sodality', 'race-hirogen-hunters', 'hostile', -45, 0),
    rel('race-vidiian-sodality', 'race-ferengi-alliance', 'neutral', 5, 20),
    rel('race-vidiian-sodality', 'race-krell', 'unfriendly', -20, 0),

    // ======================================================================
    // HIROGEN OCCUPATION vs OTHERS
    // ======================================================================
    rel('race-hirogen-occupation', 'race-terran-federation', 'hostile', -50, 0),
    rel('race-hirogen-occupation', 'race-klingon-empire', 'hostile', -45, 0),
    rel('race-hirogen-occupation', 'race-romulan-star-empire', 'hostile', -40, 0),
    rel('race-hirogen-occupation', 'race-borg-collective', 'hostile', -55, 0),
    rel('race-hirogen-occupation', 'race-orion-syndicate', 'unfriendly', -20, 0),
    rel('race-hirogen-occupation', 'race-ferengi-alliance', 'neutral', 5, 15),

    // ======================================================================
    // Q vs OTHERS
    // ======================================================================
    rel('race-q-continuum', 'race-terran-federation', 'neutral', 10, 0),
    rel('race-q-continuum', 'race-klingon-empire', 'neutral', 5, 0),
    rel('race-q-continuum', 'race-romulan-star-empire', 'neutral', 5, 0),
    rel('race-q-continuum', 'race-borg-collective', 'unfriendly', -30, 0),
    rel('race-q-continuum', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-q-continuum', 'race-krell', 'unfriendly', -20, 0),
    rel('race-q-continuum', 'race-void-swarm', 'hostile', -40, 0),

    // ======================================================================
    // PROPHETS vs OTHERS
    // ======================================================================
    rel('race-prophets', 'race-terran-federation', 'neutral', 5, 0),
    rel('race-prophets', 'race-klingon-empire', 'neutral', 0, 0),
    rel('race-prophets', 'race-romulan-star-empire', 'neutral', 0, 0),
    rel('race-prophets', 'race-borg-collective', 'unfriendly', -25, 0),
    rel('race-prophets', 'race-ferengi-alliance', 'neutral', 5, 0),
    rel('race-prophets', 'race-krell', 'neutral', 0, 0),
    rel('race-prophets', 'race-void-swarm', 'hostile', -35, 0),

    // ======================================================================
    // PRESERVERS vs OTHERS
    // ======================================================================
    rel('race-preservers', 'race-terran-federation', 'trade_agreement', 30, 50),
    rel('race-preservers', 'race-klingon-empire', 'unfriendly', -15, 0),
    rel('race-preservers', 'race-romulan-star-empire', 'unfriendly', -20, 0),
    rel('race-preservers', 'race-borg-collective', 'hostile', -50, 0),
    rel('race-preservers', 'race-ferengi-alliance', 'neutral', 10, 20),
    rel('race-preservers', 'race-krell', 'hostile', -45, 0),
    rel('race-preservers', 'race-void-swarm', 'hostile', -40, 0),
    rel('race-preservers', 'race-voth-ministry', 'neutral', 10, 0),

    // ======================================================================
    // ICONIANS vs OTHERS
    // ======================================================================
    rel('race-iconians', 'race-terran-federation', 'neutral', 15, 0),
    rel('race-iconians', 'race-klingon-empire', 'unfriendly', -10, 0),
    rel('race-iconians', 'race-romulan-star-empire', 'unfriendly', -15, 0),
    rel('race-iconians', 'race-borg-collective', 'hostile', -45, 0),
    rel('race-iconians', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-iconians', 'race-krell', 'hostile', -40, 0),
    rel('race-iconians', 'race-void-swarm', 'hostile', -35, 0),
    rel('race-iconians', 'race-voth-ministry', 'neutral', 10, 0),

    // ======================================================================
    // VOTH MINISTRY vs OTHERS
    // ======================================================================
    rel('race-voth-ministry', 'race-terran-federation', 'unfriendly', -10, 0),
    rel('race-voth-ministry', 'race-klingon-empire', 'unfriendly', -15, 0),
    rel('race-voth-ministry', 'race-romulan-star-empire', 'unfriendly', -20, 0),
    rel('race-voth-ministry', 'race-borg-collective', 'hostile', -55, 0),
    rel('race-voth-ministry', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-voth-ministry', 'race-krell', 'hostile', -35, 0),
    rel('race-voth-ministry', 'race-void-swarm', 'hostile', -30, 0),

    // ======================================================================
    // KRELL vs OTHERS
    // ======================================================================
    rel('race-krell', 'race-terran-federation', 'hostile', -55, 0),
    rel('race-krell', 'race-klingon-empire', 'hostile', -60, 0),
    rel('race-krell', 'race-romulan-star-empire', 'hostile', -65, 0),
    rel('race-krell', 'race-cardassian-union', 'hostile', -50, 0),
    rel('race-krell', 'race-gorn-hegemony', 'hostile', -55, 0),
    rel('race-krell', 'race-orion-syndicate', 'unfriendly', -25, 0),
    rel('race-krell', 'race-nausicaan-clans', 'hostile', -45, 0),
    rel('race-krell', 'race-borg-collective', 'hostile', -80, 0),
    rel('race-krell', 'race-ferengi-alliance', 'unfriendly', -20, 0),
    rel('race-krell', 'race-q-continuum', 'unfriendly', -20, 0),
    rel('race-krell', 'race-void-swarm', 'unfriendly', -15, 0),
    rel('race-krell', 'race-voth', 'hostile', -40, 0),

    // ======================================================================
    // ZENITH vs OTHERS
    // ======================================================================
    rel('race-zenith', 'race-terran-federation', 'neutral', 10, 0),
    rel('race-zenith', 'race-klingon-empire', 'neutral', 5, 0),
    rel('race-zenith', 'race-romulan-star-empire', 'neutral', 5, 0),
    rel('race-zenith', 'race-borg-collective', 'hostile', -30, 0),
    rel('race-zenith', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-zenith', 'race-krell', 'hostile', -25, 0),
    rel('race-zenith', 'race-void-swarm', 'hostile', -30, 0),
    rel('race-zenith', 'race-q-continuum', 'neutral', 15, 0),
    rel('race-zenith', 'race-caretaker-species', 'neutral', 20, 10),

    // ======================================================================
    // VARANTHI vs OTHERS
    // ======================================================================
    rel('race-varanthi', 'race-terran-federation', 'trade_agreement', 35, 100),
    rel('race-varanthi', 'race-klingon-empire', 'neutral', 10, 20),
    rel('race-varanthi', 'race-romulan-star-empire', 'neutral', 5, 15),
    rel('race-varanthi', 'race-borg-collective', 'hostile', -40, 0),
    rel('race-varanthi', 'race-orion-syndicate', 'trade_agreement', 25, 80),
    rel('race-varanthi', 'race-krell', 'unfriendly', -15, 0),
    rel('race-varanthi', 'race-void-swarm', 'unfriendly', -20, 0),
    rel('race-varanthi', 'race-voth', 'neutral', 10, 0),

    // ======================================================================
    // VOID SWARM vs OTHERS
    // ======================================================================
    rel('race-void-swarm', 'race-terran-federation', 'hostile', -70, 0),
    rel('race-void-swarm', 'race-klingon-empire', 'hostile', -55, 0),
    rel('race-void-swarm', 'race-romulan-star-empire', 'hostile', -60, 0),
    rel('race-void-swarm', 'race-cardassian-union', 'hostile', -45, 0),
    rel('race-void-swarm', 'race-borg-collective', 'hostile', -70, 0),
    rel('race-void-swarm', 'race-ferengi-alliance', 'unfriendly', -15, 0),
    rel('race-void-swarm', 'race-orion-syndicate', 'unfriendly', -30, 0),
    rel('race-void-swarm', 'race-krell', 'unfriendly', -15, 0),
    rel('race-void-swarm', 'race-hirogen-hunters', 'hostile', -55, 0),
    rel('race-void-swarm', 'race-hirogen-occupation', 'hostile', -50, 0),
    rel('race-void-swarm', 'race-q-continuum', 'hostile', -40, 0),
    rel('race-void-swarm', 'race-prophets', 'hostile', -35, 0),
    rel('race-void-swarm', 'race-preservers', 'hostile', -40, 0),
    rel('race-void-swarm', 'race-iconians', 'hostile', -35, 0),
    rel('race-void-swarm', 'race-voth-ministry', 'hostile', -30, 0),
    rel('race-void-swarm', 'race-zenith', 'hostile', -30, 0),
    rel('race-void-swarm', 'race-varanthi', 'unfriendly', -20, 0),
    rel('race-void-swarm', 'race-voth', 'hostile', -35, 0),
    rel('race-void-swarm', 'race-caretaker-species', 'hostile', -25, 0),
    rel('race-void-swarm', 'race-celestial', 'hostile', -30, 0),
    rel('race-void-swarm', 'race-hierarchy', 'unfriendly', -20, 0),
    rel('race-void-swarm', 'race-vidiian-sodality', 'allied', 72, 400),
    rel('race-void-swarm', 'race-xindi-council', 'allied', 68, 300),
    rel('race-void-swarm', 'race-bajoran-resistance', 'hostile', -50, 0),
    rel('race-void-swarm', 'race-betazoid-confederacy', 'hostile', -45, 0),
    rel('race-void-swarm', 'race-trill-symbionts', 'hostile', -40, 0),
    rel('race-void-swarm', 'race-benzite-union', 'hostile', -35, 0),
    rel('race-void-swarm', 'race-dosi-syndicate', 'unfriendly', -20, 0),
    rel('race-void-swarm', 'race-bynar-system', 'hostile', -45, 0),
    rel('race-void-swarm', 'race-species-8472', 'hostile', -55, 0),

    // ======================================================================
    // CELESTIAL vs OTHERS
    // ======================================================================
    rel('race-celestial', 'race-terran-federation', 'neutral', 20, 0),
    rel('race-celestial', 'race-klingon-empire', 'neutral', 10, 0),
    rel('race-celestial', 'race-romulan-star-empire', 'neutral', 10, 0),
    rel('race-celestial', 'race-borg-collective', 'hostile', -35, 0),
    rel('race-celestial', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-celestial', 'race-krell', 'hostile', -30, 0),
    rel('race-celestial', 'race-void-swarm', 'hostile', -30, 0),
    rel('race-celestial', 'race-voth', 'neutral', 10, 0),

    // ======================================================================
    // CARETAKER vs OTHERS
    // ======================================================================
    rel('race-caretaker-species', 'race-terran-federation', 'neutral', 0, 0),
    rel('race-caretaker-species', 'race-klingon-empire', 'neutral', -5, 0),
    rel('race-caretaker-species', 'race-romulan-star-empire', 'neutral', -5, 0),
    rel('race-caretaker-species', 'race-borg-collective', 'hostile', -40, 0),
    rel('race-caretaker-species', 'race-ferengi-alliance', 'neutral', 5, 10),
    rel('race-caretaker-species', 'race-krell', 'hostile', -30, 0),
    rel('race-caretaker-species', 'race-void-swarm', 'hostile', -25, 0),
    rel('race-caretaker-species', 'race-zenith', 'neutral', 20, 10),

    // ======================================================================
    // BENZITE vs OTHERS
    // ======================================================================
    rel('race-benzite-union', 'race-terran-federation', 'trade_agreement', 40, 200),
    rel('race-benzite-union', 'race-klingon-empire', 'neutral', 5, 10),
    rel('race-benzite-union', 'race-romulan-star-empire', 'unfriendly', -10, 0),
    rel('race-benzite-union', 'race-borg-collective', 'hostile', -45, 0),
    rel('race-benzite-union', 'race-orion-syndicate', 'trade_agreement', 20, 40),
    rel('race-benzite-union', 'race-krell', 'unfriendly', -10, 0),
    rel('race-benzite-union', 'race-void-swarm', 'hostile', -35, 0),

    // ======================================================================
    // DOSI vs OTHERS
    // ======================================================================
    rel('race-dosi-syndicate', 'race-terran-federation', 'neutral', 10, 0),
    rel('race-dosi-syndicate', 'race-klingon-empire', 'neutral', 5, 10),
    rel('race-dosi-syndicate', 'race-romulan-star-empire', 'neutral', 5, 15),
    rel('race-dosi-syndicate', 'race-borg-collective', 'hostile', -35, 0),
    rel('race-dosi-syndicate', 'race-nausicaan-clans', 'trade_agreement', 15, 30),
    rel('race-dosi-syndicate', 'race-krell', 'unfriendly', -10, 0),
    rel('race-dosi-syndicate', 'race-void-swarm', 'unfriendly', -20, 0),
    rel('race-dosi-syndicate', 'race-varanthi', 'trade_agreement', 30, 50),
    rel('race-dosi-syndicate', 'race-benzite-union', 'trade_agreement', 25, 60),
    rel('race-dosi-syndicate', 'race-hierarchy', 'trade_agreement', 15, 40),
  ];

  // Mirror relationships: copy (r1,r2) → (r2,r1) for any missing pair
  const existingPairs = new Set<string>();
  for (const rel of t) {
    existingPairs.add(`${rel.race1Id}::${rel.race2Id}`);
    existingPairs.add(`${rel.race2Id}::${rel.race1Id}`);
  }

  for (const rel of t) {
    const key = `${rel.race2Id}::${rel.race1Id}`;
    if (!existingPairs.has(key)) {
      matrix.push({
        race1Id: rel.race2Id,
        race2Id: rel.race1Id,
        status: rel.status,
        strength: rel.strength,
        tradeVolume: rel.tradeVolume,
        lastInteraction: rel.lastInteraction,
        treaties: rel.treaties,
      });
      existingPairs.add(key);
    }
    matrix.push(rel);
  }

  // Fill any remaining missing pairs as neutral
  for (const r1 of ALL_RACE_IDS) {
    for (const r2 of ALL_RACE_IDS) {
      if (r1 === r2) continue;
      const key = `${r1}::${r2}`;
      if (!existingPairs.has(key)) {
        matrix.push({
          race1Id: r1,
          race2Id: r2,
          status: 'neutral',
          strength: 0,
          tradeVolume: 0,
          lastInteraction: 0,
          treaties: [],
        });
        existingPairs.add(key);
        existingPairs.add(`${r2}::${r1}`);
      }
    }
  }

  return matrix;
})();

// ============================================================================
// WAR DECLARATIONS
// ============================================================================

export const INITIAL_WARS: WarDeclaration[] = [
  {
    id: 'war-terran-cardassian',
    aggressorId: 'race-cardassian-union',
    defenderId: 'race-terran-federation',
    status: 'border_skirmish',
    turnStarted: 0,
    turnsElapsed: 0,
    alliesAggressor: ['race-romulan-star-empire'],
    alliesDefender: ['race-vulcan-science-directorate', 'race-bajoran-resistance'],
    warScore: 0,
    warExhaustion: 10,
    causes: ['territorial_dispute', 'war_crimes'],
    peaceTerms: [],
  },
  {
    id: 'war-borg-everyone',
    aggressorId: 'race-borg-collective',
    defenderId: 'race-terran-federation',
    status: 'full_war',
    turnStarted: 0,
    turnsElapsed: 5,
    alliesAggressor: ['race-species-8472', 'race-bynar-system'],
    alliesDefender: [
      'race-klingon-empire',
      'race-romulan-star-empire',
      'race-vulcan-science-directorate',
    ],
    warScore: 15,
    warExhaustion: 30,
    causes: ['assimilation_threat', 'existential_danger'],
    peaceTerms: [],
  },
  {
    id: 'war-klingon-romulan',
    aggressorId: 'race-klingon-empire',
    defenderId: 'race-romulan-star-empire',
    status: 'cold_war',
    turnStarted: 0,
    turnsElapsed: 0,
    alliesAggressor: ['race-gorn-hegemony', 'race-nausicaan-clans'],
    alliesDefender: ['race-cardassian-union'],
    warScore: 0,
    warExhaustion: 5,
    causes: ['territorial_dispute', 'honor_conflict'],
    peaceTerms: [],
  },
  {
    id: 'war-krell-hunt',
    aggressorId: 'race-krell',
    defenderId: 'race-ferengi-alliance',
    status: 'limited_war',
    turnStarted: 3,
    turnsElapsed: 2,
    alliesAggressor: ['race-hirogen-hunters', 'race-hirogen-occupation'],
    alliesDefender: ['race-varanthi', 'race-dosi-syndicate'],
    warScore: 10,
    warExhaustion: 15,
    causes: ['resource_theft', 'territorial_aggression'],
    peaceTerms: [],
  },
  {
    id: 'war-swarm-fed',
    aggressorId: 'race-void-swarm',
    defenderId: 'race-terran-federation',
    status: 'limited_war',
    turnStarted: 5,
    turnsElapsed: 1,
    alliesAggressor: ['race-vidiian-sodality', 'race-xindi-council'],
    alliesDefender: ['race-vulcan-science-directorate', 'race-bajoran-resistance'],
    warScore: 5,
    warExhaustion: 20,
    causes: ['biological_hostility', 'territorial_invasion'],
    peaceTerms: [],
  },
  {
    id: 'war-bajoran-cardassian',
    aggressorId: 'race-cardassian-union',
    defenderId: 'race-bajoran-resistance',
    status: 'full_war',
    turnStarted: 0,
    turnsElapsed: 8,
    alliesAggressor: ['race-romulan-star-empire'],
    alliesDefender: ['race-terran-federation'],
    warScore: 25,
    warExhaustion: 40,
    causes: ['occupation_legacy', 'war_crimes', 'territorial_dispute'],
    peaceTerms: [],
  },
];

// ============================================================================
// TRADE RESOURCE FLOWS
// ============================================================================

export const TRADE_RESOURCE_FLOWS: TradeResourceFlow[] = [
  // Federation internal
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-vulcan-science-directorate', resourceType: 'minerals', amount: 200, efficiency: 0.9 },
  { fromRaceId: 'race-vulcan-science-directorate', toRaceId: 'race-terran-federation', resourceType: 'technology', amount: 150, efficiency: 0.85 },
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-bajoran-resistance', resourceType: 'food', amount: 180, efficiency: 0.9 },
  { fromRaceId: 'race-bajoran-resistance', toRaceId: 'race-terran-federation', resourceType: 'minerals', amount: 175, efficiency: 0.85 },
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-betazoid-confederacy', resourceType: 'luxury_goods', amount: 100, efficiency: 0.8 },
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-trill-symbionts', resourceType: 'energy', amount: 125, efficiency: 0.85 },

  // Trade Consortium
  { fromRaceId: 'race-ferengi-alliance', toRaceId: 'race-varanthi', resourceType: 'rare_materials', amount: 400, efficiency: 0.95 },
  { fromRaceId: 'race-varanthi', toRaceId: 'race-ferengi-alliance', resourceType: 'luxury_goods', amount: 350, efficiency: 0.9 },
  { fromRaceId: 'race-ferengi-alliance', toRaceId: 'race-dosi-syndicate', resourceType: 'energy', amount: 300, efficiency: 0.9 },
  { fromRaceId: 'race-dosi-syndicate', toRaceId: 'race-ferengi-alliance', resourceType: 'minerals', amount: 250, efficiency: 0.85 },
  { fromRaceId: 'race-ferengi-alliance', toRaceId: 'race-benzite-union', resourceType: 'food', amount: 225, efficiency: 0.85 },
  { fromRaceId: 'race-benzite-union', toRaceId: 'race-ferengi-alliance', resourceType: 'rare_materials', amount: 200, efficiency: 0.8 },

  // Klingon internal
  { fromRaceId: 'race-klingon-empire', toRaceId: 'race-gorn-hegemony', resourceType: 'military_materials', amount: 200, efficiency: 0.9 },
  { fromRaceId: 'race-gorn-hegemony', toRaceId: 'race-klingon-empire', resourceType: 'minerals', amount: 200, efficiency: 0.85 },

  // Romulan internal
  { fromRaceId: 'race-romulan-star-empire', toRaceId: 'race-cardassian-union', resourceType: 'intelligence', amount: 175, efficiency: 0.85 },
  { fromRaceId: 'race-cardassian-union', toRaceId: 'race-romulan-star-empire', resourceType: 'military_materials', amount: 175, efficiency: 0.8 },

  // Borg internal
  { fromRaceId: 'race-borg-collective', toRaceId: 'race-bynar-system', resourceType: 'data', amount: 500, efficiency: 0.95 },
  { fromRaceId: 'race-bynar-system', toRaceId: 'race-borg-collective', resourceType: 'technology', amount: 500, efficiency: 0.95 },

  // Swarm internal
  { fromRaceId: 'race-void-swarm', toRaceId: 'race-vidiian-sodality', resourceType: 'biomatter', amount: 200, efficiency: 0.85 },
  { fromRaceId: 'race-vidiian-sodality', toRaceId: 'race-void-swarm', resourceType: 'genetic_material', amount: 200, efficiency: 0.8 },

  // Cross-bloc trade
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-ferengi-alliance', resourceType: 'technology', amount: 100, efficiency: 0.7 },
  { fromRaceId: 'race-ferengi-alliance', toRaceId: 'race-terran-federation', resourceType: 'rare_materials', amount: 100, efficiency: 0.7 },
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-varanthi', resourceType: 'food', amount: 50, efficiency: 0.6 },
  { fromRaceId: 'race-terran-federation', toRaceId: 'race-benzite-union', resourceType: 'minerals', amount: 100, efficiency: 0.7 },
  { fromRaceId: 'race-ferengi-alliance', toRaceId: 'race-klingon-empire', resourceType: 'luxury_goods', amount: 50, efficiency: 0.6 },

  // Ancient internal
  { fromRaceId: 'race-q-continuum', toRaceId: 'race-celestial', resourceType: 'exotic_energy', amount: 25, efficiency: 0.95 },
  { fromRaceId: 'race-preservers', toRaceId: 'race-iconians', resourceType: 'ancient_artifacts', amount: 50, efficiency: 0.9 },
];

// ============================================================================
// HELPERS
// ============================================================================

const _relationCache = new Map<string, DiplomaticRelation>();

function _buildCache(): void {
  if (_relationCache.size > 0) return;
  for (const rel of RELATIONSHIP_MATRIX) {
    _relationCache.set(`${rel.race1Id}::${rel.race2Id}`, rel);
  }
}

function _key(a: string, b: string): string {
  return `${a}::${b}`;
}

/**
 * Get the diplomatic relation between two races.
 * Returns neutral if no explicit relation exists.
 */
export function getRelation(race1Id: string, race2Id: string): DiplomaticRelation {
  _buildCache();
  if (race1Id === race2Id) {
    return {
      race1Id,
      race2Id,
      status: 'allied',
      strength: 100,
      tradeVolume: 0,
      lastInteraction: 0,
      treaties: [],
    };
  }
  return (
    _relationCache.get(_key(race1Id, race2Id)) ??
    _relationCache.get(_key(race2Id, race1Id)) ?? {
      race1Id,
      race2Id,
      status: 'neutral',
      strength: 0,
      tradeVolume: 0,
      lastInteraction: 0,
      treaties: [],
    }
  );
}

/**
 * Get all race IDs allied (allied or defensive_pact) with the given race.
 */
export function getAllies(raceId: string): string[] {
  const allies: string[] = [];
  for (const r of RELATIONSHIP_MATRIX) {
    if (r.race1Id === raceId && (r.status === 'allied' || r.status === 'defensive_pact')) {
      allies.push(r.race2Id);
    }
  }
  return [...new Set(allies)];
}

/**
 * Get all race IDs that are hostile to the given race.
 */
export function getEnemies(raceId: string): string[] {
  const enemies: string[] = [];
  for (const r of RELATIONSHIP_MATRIX) {
    if (r.race1Id === raceId && (r.status === 'hostile' || r.status === 'unfriendly')) {
      enemies.push(r.race2Id);
    }
  }
  return [...new Set(enemies)];
}

/**
 * Get the alliance bloc a race belongs to, or null.
 */
export function getBlocForRace(raceId: string): AllianceBloc | null {
  return (
    ALLIANCE_BLOCS.find((b) => b.memberRaceIds.includes(raceId)) ?? null
  );
}

/**
 * Are two races allied? (allied or defensive_pact)
 */
export function areAllied(race1Id: string, race2Id: string): boolean {
  const rel = getRelation(race1Id, race2Id);
  return rel.status === 'allied' || rel.status === 'defensive_pact';
}

/**
 * Are two races enemies? (hostile or unfriendly)
 */
export function areEnemies(race1Id: string, race2Id: string): boolean {
  const rel = getRelation(race1Id, race2Id);
  return rel.status === 'hostile' || rel.status === 'unfriendly';
}

/**
 * Get all race IDs that have a trade agreement with the given race.
 */
export function getTradePartners(raceId: string): string[] {
  const partners: string[] = [];
  for (const r of RELATIONSHIP_MATRIX) {
    if (
      r.race1Id === raceId &&
      (r.status === 'trade_agreement' || r.status === 'allied')
    ) {
      partners.push(r.race2Id);
    }
  }
  return [...new Set(partners)];
}

/**
 * Get all active wars involving a given race.
 */
export function getWarsForRace(raceId: string): WarDeclaration[] {
  return INITIAL_WARS.filter(
    (w) =>
      w.aggressorId === raceId ||
      w.defenderId === raceId ||
      w.alliesAggressor.includes(raceId) ||
      w.alliesDefender.includes(raceId)
  );
}

/**
 * Get wars in a specific sector (placeholder — requires sectorId mapping).
 * Returns all active non-ceasefire wars for now.
 */
export function getWarsInSector(_sectorId: string): WarDeclaration[] {
  return INITIAL_WARS.filter((w) => w.status !== 'ceasefire');
}

/**
 * Get the war escalation stage based on turns elapsed and war score.
 */
export function getWarEscalationStage(war: WarDeclaration): WarEscalationStage {
  let current = WAR_ESCALATION_STAGES[0];
  for (const stage of WAR_ESCALATION_STAGES) {
    if (
      war.turnsElapsed >= stage.requirements.turnsElapsed &&
      war.warScore >= stage.requirements.warScore
    ) {
      current = stage;
    }
  }
  return current;
}

/**
 * Get all trade routes involving a given race.
 */
export function getTradeRoutesForRace(raceId: string): TradeRoute[] {
  return INITIAL_TRADE_ROUTES.filter(
    (tr) => tr.race1Id === raceId || tr.race2Id === raceId
  );
}

/**
 * Get all trade resource flows for a given race.
 */
export function getTradeFlowsForRace(raceId: string): TradeResourceFlow[] {
  return TRADE_RESOURCE_FLOWS.filter(
    (f) => f.fromRaceId === raceId || f.toRaceId === raceId
  );
}

/**
 * Get all treaties a race is a party to.
 */
export function getTreatiesForRace(raceId: string): Treaty[] {
  return INITIAL_TREATIES.filter((t) => t.parties.includes(raceId));
}

/**
 * Calculate total diplomatic influence of a race (sum of relation strengths with all allies).
 */
export function getDiplomaticInfluence(raceId: string): number {
  let influence = 0;
  for (const r of RELATIONSHIP_MATRIX) {
    if (r.race1Id === raceId && (r.status === 'allied' || r.status === 'defensive_pact')) {
      influence += r.strength;
    }
  }
  return influence;
}

/**
 * Calculate total trade income from all active trade routes for a race.
 */
export function getTradeIncome(raceId: string): number {
  let income = 0;
  const routes = getTradeRoutesForRace(raceId);
  for (const route of routes) {
    if (route.status === 'active') {
      income += route.volume * route.profitMargin;
    }
  }
  const flows = getTradeFlowsForRace(raceId);
  for (const flow of flows) {
    income += flow.amount * flow.efficiency * 0.1;
  }
  return Math.round(income);
}

/**
 * Get all blocs involved in a war (both sides).
 */
export function getBlocInvolvementInWar(
  war: WarDeclaration
): { aggressorBlocs: AllianceBloc[]; defenderBlocs: AllianceBloc[] } {
  const aggressorBlocs: AllianceBloc[] = [];
  const defenderBlocs: AllianceBloc[] = [];

  const aggressorRaces = [war.aggressorId, ...war.alliesAggressor];
  const defenderRaces = [war.defenderId, ...war.alliesDefender];

  for (const raceId of aggressorRaces) {
    const bloc = getBlocForRace(raceId);
    if (bloc && !aggressorBlocs.find((b) => b.id === bloc.id)) {
      aggressorBlocs.push(bloc);
    }
  }
  for (const raceId of defenderRaces) {
    const bloc = getBlocForRace(raceId);
    if (bloc && !defenderBlocs.find((b) => b.id === bloc.id)) {
      defenderBlocs.push(bloc);
    }
  }

  return { aggressorBlocs, defenderBlocs };
}

/**
 * Determine if a race should join a war based on alliance obligations.
 */
export function shouldJoinWar(
  raceId: string,
  war: WarDeclaration
): { side: 'aggressor' | 'defender' | null; reason: string } {
  // Check if already involved
  const involved =
    war.aggressorId === raceId ||
    war.defenderId === raceId ||
    war.alliesAggressor.includes(raceId) ||
    war.alliesDefender.includes(raceId);
  if (involved) {
    return { side: null, reason: 'already_involved' };
  }

  // Check if allied with aggressor
  if (areAllied(raceId, war.aggressorId)) {
    return {
      side: 'aggressor',
      reason: 'defensive_pact_obligation',
    };
  }

  // Check if allied with defender
  if (areAllied(raceId, war.defenderId)) {
    return {
      side: 'defender',
      reason: 'defensive_pact_obligation',
    };
  }

  // Check if same bloc
  const raceBloc = getBlocForRace(raceId);
  const aggressorBloc = getBlocForRace(war.aggressorId);
  const defenderBloc = getBlocForRace(war.defenderId);

  if (raceBloc && aggressorBloc && raceBloc.id === aggressorBloc.id) {
    return { side: 'aggressor', reason: 'bloc_solidarity' };
  }
  if (raceBloc && defenderBloc && raceBloc.id === defenderBloc.id) {
    return { side: 'defender', reason: 'bloc_solidarity' };
  }

  // Check if enemies with aggressor — may join defender
  if (areEnemies(raceId, war.aggressorId) && war.status === 'full_war') {
    return { side: 'defender', reason: 'enemy_of_enemy' };
  }

  return { side: null, reason: 'no_obligation' };
}

/**
 * Get diplomatic opinion modifier — how much a race likes another based on bloc membership and shared enemies.
 */
export function getDiplomaticModifier(
  race1Id: string,
  race2Id: string
): number {
  let modifier = 0;

  // Same bloc bonus
  const bloc1 = getBlocForRace(race1Id);
  const bloc2 = getBlocForRace(race2Id);
  if (bloc1 && bloc2 && bloc1.id === bloc2.id) {
    modifier += 20;
  }

  // Shared enemy bonus
  const enemies1 = getEnemies(race1Id);
  const enemies2 = getEnemies(race2Id);
  const sharedEnemies = enemies1.filter((e) => enemies2.includes(e));
  modifier += sharedEnemies.length * 5;

  // Shared ally bonus
  const allies1 = getAllies(race1Id);
  const allies2 = getAllies(race2Id);
  const sharedAllies = allies1.filter((a) => allies2.includes(a));
  modifier += sharedAllies.length * 3;

  return modifier;
}

/**
 * Get all diplomatic events for a race (stub — in production driven by game state).
 */
export function getDiplomaticHistory(raceId: string): DiplomaticEvent[] {
  const events: DiplomaticEvent[] = [];

  // Record initial wars as events
  for (const war of INITIAL_WARS) {
    if (
      war.aggressorId === raceId ||
      war.defenderId === raceId ||
      war.alliesAggressor.includes(raceId) ||
      war.alliesDefender.includes(raceId)
    ) {
      events.push({
        type: 'war_declared',
        race1Id: war.aggressorId,
        race2Id: war.defenderId,
        turn: war.turnStarted,
        details: `War declared: ${war.causes.join(', ')}`,
      });
    }
  }

  return events.sort((a, b) => a.turn - b.turn);
}

/**
 * Get all races that are vassals of a given overlord.
 */
export function getVassals(overlordId: string): string[] {
  const vassals: string[] = [];
  for (const rel of RELATIONSHIP_MATRIX) {
    if (rel.race1Id === overlordId && rel.status === 'vassal') {
      vassals.push(rel.race2Id);
    }
  }
  return vassals;
}

/**
 * Get the overlord of a vassal race.
 */
export function getOverlord(vassalId: string): string | null {
  for (const rel of RELATIONSHIP_MATRIX) {
    if (rel.race2Id === vassalId && rel.status === 'vassal') {
      return rel.race1Id;
    }
  }
  return null;
}
