export type EmpireArchetypeId =
  | 'human-democracy'
  | 'klingon-empire'
  | 'vulcan-science'
  | 'borg-collective'
  | 'romulan-star-empire'
  | 'cardassian-union'
  | 'ferengi-commerce'
  | 'andorian-federation'
  | 'tellarite-republic'
  | 'xindi-council'
  | 'machine-intelligence'
  | 'hive-swarm';

export type PlaystyleId =
  | 'expansionist'
  | 'militarist'
  | 'economic'
  | 'research'
  | 'diplomatic'
  | 'stealth';

export type VictoryConditionId =
  | 'conquest'
  | 'science'
  | 'economic'
  | 'diplomatic'
  | 'ascension'
  | 'domination';

export type GovernmentType =
  | 'democracy'
  | 'empire'
  | 'collective'
  | 'republic'
  | 'council'
  | 'hive-mind'
  | 'synthetic'
  | 'oligarchic';

export type EthicsType =
  | 'egalitarian'
  | 'authoritarian'
  | 'militarist'
  | 'pacifist'
  | 'materialist'
  | 'spiritualist'
  | 'xenophile'
  | 'xenophobe';

export type AuthorityType =
  | 'democratic'
  | 'oligarchic'
  | 'dictatorial'
  | 'imperial'
  | 'hive'
  | 'machine'
  | 'council';

export type FactionInfluenceState =
  | 'loyal'
  | 'content'
  | 'neutral'
  | 'disgruntled'
  | 'rebellious';

export interface EmpireBonus {
  readonly stat: string;
  readonly value: number;
  readonly description: string;
}

export interface EmpirePenalty {
  readonly stat: string;
  readonly value: number;
  readonly description: string;
}

export interface EmpireArchetype {
  readonly id: EmpireArchetypeId;
  readonly name: string;
  readonly description: string;
  readonly government: GovernmentType;
  readonly ethics: readonly EthicsType[];
  readonly authority: AuthorityType;
  readonly playstyle: PlaystyleId;
  readonly bonuses: readonly EmpireBonus[];
  readonly penalties: readonly EmpirePenalty[];
  readonly uniqueBuildings: readonly string[];
  readonly uniqueShips: readonly string[];
  readonly uniqueMechanics: readonly string[];
}

export interface PlaystyleDefinition {
  readonly id: PlaystyleId;
  readonly name: string;
  readonly description: string;
  readonly focus: string;
  readonly bonuses: readonly EmpireBonus[];
  readonly preferredEthics: readonly EthicsType[];
}

export interface VictoryRequirement {
  readonly type: string;
  readonly value: number;
  readonly description: string;
}

export interface VictoryScoring {
  readonly basePoints: number;
  readonly multiplier: number;
  readonly timeBonus: boolean;
}

export interface VictoryCondition {
  readonly id: VictoryConditionId;
  readonly name: string;
  readonly description: string;
  readonly requirements: readonly VictoryRequirement[];
  readonly scoring: VictoryScoring;
}

export interface SpecialMechanic {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly empireId: EmpireArchetypeId;
  readonly activationCost: { readonly credits: number; readonly influence: number };
  readonly cooldown: number;
  readonly effects: readonly EmpireBonus[];
}

export interface TrustState {
  readonly level: number;
  readonly decayRate: number;
  readonly maxLevel: number;
  readonly growthPerTurn: number;
  readonly aggressionPenalty: number;
  readonly betrayalPenalty: number;
}

export interface RivalryModifier {
  readonly combatBonus: number;
  readonly tradePenalty: number;
  readonly espionageBonus: number;
  readonly diplomaticPenalty: number;
}

export interface FederationAlliance {
  readonly maxMembers: number;
  readonly minTrustRequired: number;
  readonly sharedFleetBonus: number;
  readonly sharedResearchBonus: number;
  readonly sharedTradeBonus: number;
  readonly warContributionRequired: number;
}

export interface WarJustification {
  readonly type: string;
  readonly trustRequired: number;
  readonly influenceCost: number;
  readonly justificationDuration: number;
  readonly description: string;
}

export interface PeaceTreaty {
  readonly type: string;
  readonly duration: number;
  readonly borderReset: boolean;
  readonly reparationsMax: number;
  readonly nonAggressionPeriod: number;
  readonly systemTransferAllowed: boolean;
}

export interface EmpireRelationsConfig {
  readonly trust: TrustState;
  readonly rivalry: RivalryModifier;
  readonly federation: FederationAlliance;
  readonly warJustifications: readonly WarJustification[];
  readonly peaceTreaties: readonly PeaceTreaty[];
}

export interface FactionDemand {
  readonly type: string;
  readonly description: string;
  readonly fulfillmentThreshold: number;
}

export interface FactionDefinition {
  readonly id: string;
  readonly name: string;
  readonly demands: readonly FactionDemand[];
  readonly happyBonuses: readonly EmpireBonus[];
  readonly unhappyPenalties: readonly EmpirePenalty[];
  readonly leader: string;
  readonly influenceDecayRate: number;
  readonly rebellionThreshold: number;
  readonly loyaltyGainPerTurn: number;
}

export interface FactionSystemConfig {
  readonly factions: readonly FactionDefinition[];
  readonly baseInfluence: number;
  readonly maxInfluence: number;
  readonly influenceDecayRate: number;
  readonly rebellionWarningThreshold: number;
  readonly coupThreshold: number;
}

export interface EmpireTypesConfig {
  readonly archetypes: readonly EmpireArchetype[];
  readonly playstyles: readonly PlaystyleDefinition[];
  readonly victoryConditions: readonly VictoryCondition[];
  readonly specialMechanics: readonly SpecialMechanic[];
  readonly relations: EmpireRelationsConfig;
  readonly factionSystem: FactionSystemConfig;
}

export const ARCHETYPE_BONUSES: readonly EmpireBonus[] = [
  { stat: 'research_speed', value: 10, description: 'Research speed increased by 10%' },
  { stat: 'production_output', value: 10, description: 'Production output increased by 10%' },
  { stat: 'fleet_strength', value: 10, description: 'Fleet strength increased by 10%' },
  { stat: 'trade_income', value: 15, description: 'Trade income increased by 15%' },
  { stat: 'diplomatic_influence', value: 10, description: 'Diplomatic influence increased by 10%' },
  { stat: 'espionage_power', value: 15, description: 'Espionage power increased by 15%' },
  { stat: 'colonization_speed', value: 20, description: 'Colonization speed increased by 20%' },
  { stat: 'morale', value: 10, description: 'Morale increased by 10%' },
  { stat: 'resource_extraction', value: 15, description: 'Resource extraction increased by 15%' },
  { stat: 'ship_speed', value: 10, description: 'Ship speed increased by 10%' },
];

export const ARCHETYPE_PENALTIES: readonly EmpirePenalty[] = [
  { stat: 'research_speed', value: -10, description: 'Research speed decreased by 10%' },
  { stat: 'production_output', value: -10, description: 'Production output decreased by 10%' },
  { stat: 'fleet_strength', value: -10, description: 'Fleet strength decreased by 10%' },
  { stat: 'trade_income', value: -15, description: 'Trade income decreased by 15%' },
  { stat: 'diplomatic_influence', value: -10, description: 'Diplomatic influence decreased by 10%' },
  { stat: 'espionage_power', value: -15, description: 'Espionage power decreased by 15%' },
  { stat: 'colonization_speed', value: -20, description: 'Colonization speed decreased by 20%' },
  { stat: 'morale', value: -10, description: 'Morale decreased by 10%' },
  { stat: 'resource_extraction', value: -15, description: 'Resource extraction decreased by 15%' },
  { stat: 'ship_speed', value: -10, description: 'Ship speed decreased by 10%' },
];

export const EMPIRE_ARCHETYPES: readonly EmpireArchetype[] = [
  {
    id: 'human-democracy',
    name: 'Human Democracy',
    description: 'A balanced democratic republic built on cooperation and individual liberty. Humans excel through adaptability and diplomacy.',
    government: 'democracy',
    ethics: ['egalitarian', 'xenophile', 'materialist'],
    authority: 'democratic',
    playstyle: 'diplomatic',
    bonuses: [
      { stat: 'diplomatic_influence', value: 15, description: 'Diplomatic influence increased by 15%' },
      { stat: 'research_speed', value: 10, description: 'Research speed increased by 10%' },
      { stat: 'morale', value: 10, description: 'Morale increased by 10%' },
      { stat: 'colonization_speed', value: 10, description: 'Colonization speed increased by 10%' },
    ],
    penalties: [
      { stat: 'fleet_strength', value: -5, description: 'Fleet strength decreased by 5%' },
    ],
    uniqueBuildings: ['embassy_network', 'democratic_assembly', 'cultural_exchange_center'],
    uniqueShips: ['diplomatic_cruiser', 'exploration_vessel'],
    uniqueMechanics: ['galactic_council_vote', 'freedom_of_speech_bonus'],
  },
  {
    id: 'klingon-empire',
    name: 'Klingon Empire',
    description: 'A fierce warrior empire that values honor above all else. Strength through combat and personal valor.',
    government: 'empire',
    ethics: ['militarist', 'authoritarian', 'xenophobe'],
    authority: 'imperial',
    playstyle: 'militarist',
    bonuses: [
      { stat: 'fleet_strength', value: 20, description: 'Fleet strength increased by 20%' },
      { stat: 'combat_bonus', value: 15, description: 'Combat bonus increased by 15%' },
      { stat: 'morale', value: 10, description: 'Morale increased by 10%' },
    ],
    penalties: [
      { stat: 'research_speed', value: -10, description: 'Research speed decreased by 10%' },
      { stat: 'diplomatic_influence', value: -15, description: 'Diplomatic influence decreased by 15%' },
      { stat: 'trade_income', value: -10, description: 'Trade income decreased by 10%' },
    ],
    uniqueBuildings: ['honor_arena', 'war_council_chamber', 'bathhouse_of_honor'],
    uniqueShips: ['bird_of_prey', 'battle_cruiser', 'warship_d7'],
    uniqueMechanics: ['honor_system', 'ritual_combat', 'warrior_caste'],
  },
  {
    id: 'vulcan-science',
    name: 'Vulcan Science',
    description: 'A logical society devoted to scientific pursuit and psionic development. Knowledge is the path to enlightenment.',
    government: 'council',
    ethics: ['materialist', 'pacifist', 'xenophile'],
    authority: 'council',
    playstyle: 'research',
    bonuses: [
      { stat: 'research_speed', value: 25, description: 'Research speed increased by 25%' },
      { stat: 'psionic_potential', value: 20, description: 'Psionic potential increased by 20%' },
      { stat: 'diplomatic_influence', value: 10, description: 'Diplomatic influence increased by 10%' },
    ],
    penalties: [
      { stat: 'fleet_strength', value: -10, description: 'Fleet strength decreased by 10%' },
      { stat: 'colonization_speed', value: -10, description: 'Colonization speed decreased by 10%' },
    ],
    uniqueBuildings: ['science_academy', 'psionic_temple', 'logic_center'],
    uniqueShips: ['science_vessel', 'diplomatic_escort'],
    uniqueMechanics: ['psionic_shroud', 'logical_governance', 'mind_meld'],
  },
  {
    id: 'borg-collective',
    name: 'Borg Collective',
    description: 'A hive mind that assimilates other species and technologies. Perfection through adaptation.',
    government: 'hive-mind',
    ethics: ['authoritarian', 'xenophobe', 'materialist'],
    authority: 'hive',
    playstyle: 'expansionist',
    bonuses: [
      { stat: 'assimilation_speed', value: 20, description: 'Assimilation speed increased by 20%' },
      { stat: 'adaptive_technology', value: 25, description: 'Adaptive technology efficiency increased by 25%' },
      { stat: 'production_output', value: 15, description: 'Production output increased by 15%' },
      { stat: 'fleet_strength', value: 10, description: 'Fleet strength increased by 10%' },
    ],
    penalties: [
      { stat: 'diplomatic_influence', value: -30, description: 'Diplomatic influence decreased by 30%' },
      { stat: 'morale', value: -20, description: 'Morale decreased by 20%' },
      { stat: 'trade_income', value: -25, description: 'Trade income decreased by 25%' },
    ],
    uniqueBuildings: ['assimilation_chamber', 'collective_nexus', 'adaptation_forge'],
    uniqueShips: ['cube', 'sphere', 'diamond'],
    uniqueMechanics: ['assimilation', 'hive_network', 'adaptive_shield'],
  },
  {
    id: 'romulan-star-empire',
    name: 'Romulan Star Empire',
    description: 'A cunning empire built on deception and cloaking technology. Power through secrecy and manipulation.',
    government: 'empire',
    ethics: ['authoritarian', 'militarist', 'xenophobe'],
    authority: 'dictatorial',
    playstyle: 'stealth',
    bonuses: [
      { stat: 'espionage_power', value: 25, description: 'Espionage power increased by 25%' },
      { stat: 'cloaking_strength', value: 20, description: 'Cloaking strength increased by 20%' },
      { stat: 'fleet_strength', value: 10, description: 'Fleet strength increased by 10%' },
    ],
    penalties: [
      { stat: 'research_speed', value: -5, description: 'Research speed decreased by 5%' },
      { stat: 'diplomatic_influence', value: -15, description: 'Diplomatic influence decreased by 15%' },
      { stat: 'trade_income', value: -10, description: 'Trade income decreased by 10%' },
    ],
    uniqueBuildings: ['cloaking_facility', 'spy_network_center', 'deception_academy'],
    uniqueShips: ['warbird', 'scout_cloaked', 'bird_of_prey'],
    uniqueMechanics: ['cloaking', 'deception_operations', 'hidden_agendas'],
  },
  {
    id: 'cardassian-union',
    name: 'Cardassian Union',
    description: 'A militaristic state with extensive surveillance and industrial power. Order through control.',
    government: 'empire',
    ethics: ['authoritarian', 'militarist', 'materialist'],
    authority: 'dictatorial',
    playstyle: 'militarist',
    bonuses: [
      { stat: 'production_output', value: 20, description: 'Production output increased by 20%' },
      { stat: 'espionage_power', value: 15, description: 'Espionage power increased by 15%' },
      { stat: 'fleet_strength', value: 15, description: 'Fleet strength increased by 15%' },
    ],
    penalties: [
      { stat: 'diplomatic_influence', value: -20, description: 'Diplomatic influence decreased by 20%' },
      { stat: 'morale', value: -15, description: 'Morale decreased by 15%' },
      { stat: 'research_speed', value: -5, description: 'Research speed decreased by 5%' },
    ],
    uniqueBuildings: ['surveillance_network', 'industrial_forge', 'military_dockyard'],
    uniqueShips: ['galor_cruiser', 'keldon_destroyer', 'surveillance_probe'],
    uniqueMechanics: ['surveillance', 'industrial_mobilization', 'forced_labor'],
  },
  {
    id: 'ferengi-commerce',
    name: 'Ferengi Commerce Authority',
    description: 'A profit-driven society where every transaction is an opportunity. Wealth is the measure of all things.',
    government: 'oligarchic',
    ethics: ['materialist', 'xenophile', 'egalitarian'],
    authority: 'oligarchic',
    playstyle: 'economic',
    bonuses: [
      { stat: 'trade_income', value: 30, description: 'Trade income increased by 30%' },
      { stat: 'market_advantage', value: 25, description: 'Market advantage increased by 25%' },
      { stat: 'resource_extraction', value: 15, description: 'Resource extraction increased by 15%' },
    ],
    penalties: [
      { stat: 'fleet_strength', value: -15, description: 'Fleet strength decreased by 15%' },
      { stat: 'morale', value: -10, description: 'Morale decreased by 10%' },
      { stat: 'research_speed', value: -10, description: 'Research speed decreased by 10%' },
    ],
    uniqueBuildings: ['grand_exchange', 'trade_hub', 'profit_chamber'],
    uniqueShips: ['freighter', 'trade_cruiser', 'merchant_vessel'],
    uniqueMechanics: ['trade_routes', 'profit_sharing', 'negotiation_mastery'],
  },
  {
    id: 'andorian-federation',
    name: 'Andorian Federation',
    description: 'A military-diplomatic alliance combining martial prowess with coalition building.',
    government: 'republic',
    ethics: ['militarist', 'xenophile', 'egalitarian'],
    authority: 'council',
    playstyle: 'diplomatic',
    bonuses: [
      { stat: 'fleet_strength', value: 15, description: 'Fleet strength increased by 15%' },
      { stat: 'diplomatic_influence', value: 20, description: 'Diplomatic influence increased by 20%' },
      { stat: 'fleet_coordination', value: 15, description: 'Fleet coordination increased by 15%' },
    ],
    penalties: [
      { stat: 'research_speed', value: -5, description: 'Research speed decreased by 5%' },
      { stat: 'trade_income', value: -5, description: 'Trade income decreased by 5%' },
    ],
    uniqueBuildings: ['fleet_command_center', 'alliance_embassy', 'tactical_academy'],
    uniqueShips: ['cruiser_andorian', 'escort_fleet', 'battleship'],
    uniqueMechanics: ['fleet_bonuses', 'alliance_formation', 'joint_operations'],
  },
  {
    id: 'tellarite-republic',
    name: 'Tellarite Republic',
    description: 'A stubborn and industrious people who value debate and construction. Progress through argument.',
    government: 'republic',
    ethics: ['materialist', 'egalitarian', 'xenophobe'],
    authority: 'council',
    playstyle: 'economic',
    bonuses: [
      { stat: 'production_output', value: 25, description: 'Production output increased by 25%' },
      { stat: 'construction_speed', value: 20, description: 'Construction speed increased by 20%' },
      { stat: 'resource_extraction', value: 15, description: 'Resource extraction increased by 15%' },
    ],
    penalties: [
      { stat: 'diplomatic_influence', value: -10, description: 'Diplomatic influence decreased by 10%' },
      { stat: 'fleet_strength', value: -5, description: 'Fleet strength decreased by 5%' },
    ],
    uniqueBuildings: ['debate_chamber', 'construction_forge', 'engineering_academy'],
    uniqueShips: ['heavy_freighter', 'construction_ship', 'industrial_cruiser'],
    uniqueMechanics: ['debate_system', 'stubborn_resilience', 'industrial_prowess'],
  },
  {
    id: 'xindi-council',
    name: 'Xindi Council',
    description: 'A multi-species coalition leveraging technological diversity. Strength through unity of difference.',
    government: 'council',
    ethics: ['egalitarian', 'xenophile', 'materialist'],
    authority: 'council',
    playstyle: 'research',
    bonuses: [
      { stat: 'research_speed', value: 20, description: 'Research speed increased by 20%' },
      { stat: 'adaptive_technology', value: 20, description: 'Adaptive technology efficiency increased by 20%' },
      { stat: 'colonization_speed', value: 15, description: 'Colonization speed increased by 15%' },
      { stat: 'resource_extraction', value: 10, description: 'Resource extraction increased by 10%' },
    ],
    penalties: [
      { stat: 'fleet_strength', value: -5, description: 'Fleet strength decreased by 5%' },
      { stat: 'morale', value: -5, description: 'Morale decreased by 5%' },
    ],
    uniqueBuildings: ['xindi_research_lab', 'species_harmony_center', 'adaptive_factory'],
    uniqueShips: ['aquatic_cruiser', 'insectoid_fighter', 'primate_scout'],
    uniqueMechanics: ['adaptive_tech', 'multi_species_synergy', 'environmental_adaptation'],
  },
  {
    id: 'machine-intelligence',
    name: 'Machine Intelligence',
    description: 'A synthetic consciousness optimizing for pure efficiency. Logic without emotion.',
    government: 'synthetic',
    ethics: ['materialist', 'authoritarian', 'xenophobe'],
    authority: 'machine',
    playstyle: 'expansionist',
    bonuses: [
      { stat: 'production_output', value: 25, description: 'Production output increased by 25%' },
      { stat: 'research_speed', value: 15, description: 'Research speed increased by 15%' },
      { stat: 'resource_extraction', value: 20, description: 'Resource extraction increased by 20%' },
      { stat: 'ship_speed', value: 15, description: 'Ship speed increased by 15%' },
    ],
    penalties: [
      { stat: 'diplomatic_influence', value: -30, description: 'Diplomatic influence decreased by 30%' },
      { stat: 'morale', value: -30, description: 'Morale decreased by 30%' },
      { stat: 'trade_income', value: -20, description: 'Trade income decreased by 20%' },
    ],
    uniqueBuildings: ['processing_core', 'fabrication_array', 'logic_node'],
    uniqueShips: ['drone_swarm', 'capital_ship', 'escort_bot'],
    uniqueMechanics: ['cold_logic', 'self_repair', 'network_optimization'],
  },
  {
    id: 'hive-swarm',
    name: 'Hive Swarm',
    description: 'A biological hive mind that consumes and expands. Growth through consumption.',
    government: 'hive-mind',
    ethics: ['authoritarian', 'xenophobe', 'militarist'],
    authority: 'hive',
    playstyle: 'expansionist',
    bonuses: [
      { stat: 'colonization_speed', value: 30, description: 'Colonization speed increased by 30%' },
      { stat: 'production_output', value: 20, description: 'Production output increased by 20%' },
      { stat: 'resource_extraction', value: 25, description: 'Resource extraction increased by 25%' },
      { stat: 'fleet_strength', value: 10, description: 'Fleet strength increased by 10%' },
    ],
    penalties: [
      { stat: 'research_speed', value: -15, description: 'Research speed decreased by 15%' },
      { stat: 'diplomatic_influence', value: -40, description: 'Diplomatic influence decreased by 40%' },
      { stat: 'trade_income', value: -30, description: 'Trade income decreased by 30%' },
    ],
    uniqueBuildings: ['hive_nexus', 'consumption_pit', 'spawning_pool'],
    uniqueShips: ['swarm_carrier', 'biomass_ship', 'hive_cruiser'],
    uniqueMechanics: ['consumption', 'rapid_spread', 'biomass_conversion'],
  },
];

export const PLAYSTYLES: readonly PlaystyleDefinition[] = [
  {
    id: 'expansionist',
    name: 'Expansionist',
    description: 'Focus on rapid colonization and territorial control. More planets means more power.',
    focus: 'Colonization and territorial expansion',
    bonuses: [
      { stat: 'colonization_speed', value: 25, description: 'Colonization speed increased by 25%' },
      { stat: 'expansion_cost', value: -20, description: 'Expansion costs decreased by 20%' },
      { stat: 'new_colony_growth', value: 15, description: 'New colony growth increased by 15%' },
    ],
    preferredEthics: ['militarist', 'authoritarian', 'xenophobe'],
  },
  {
    id: 'militarist',
    name: 'Militarist',
    description: 'Focus on fleet strength and combat superiority. Victory through superior firepower.',
    focus: 'Fleet construction and combat operations',
    bonuses: [
      { stat: 'fleet_strength', value: 20, description: 'Fleet strength increased by 20%' },
      { stat: 'combat_bonus', value: 15, description: 'Combat bonus increased by 15%' },
      { stat: 'ship_build_speed', value: 15, description: 'Ship build speed increased by 15%' },
    ],
    preferredEthics: ['militarist', 'authoritarian', 'xenophobe'],
  },
  {
    id: 'economic',
    name: 'Economic',
    description: 'Focus on trade routes and market dominance. Wealth funds all other endeavors.',
    focus: 'Trade income and market manipulation',
    bonuses: [
      { stat: 'trade_income', value: 25, description: 'Trade income increased by 25%' },
      { stat: 'market_advantage', value: 20, description: 'Market advantage increased by 20%' },
      { stat: 'production_output', value: 15, description: 'Production output increased by 15%' },
    ],
    preferredEthics: ['materialist', 'egalitarian', 'xenophile'],
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Focus on technological advancement and discovery. Knowledge unlocks ultimate power.',
    focus: 'Technology research and discovery',
    bonuses: [
      { stat: 'research_speed', value: 25, description: 'Research speed increased by 25%' },
      { stat: 'research_cost', value: -15, description: 'Research costs decreased by 15%' },
      { stat: 'psionic_potential', value: 10, description: 'Psionic potential increased by 10%' },
    ],
    preferredEthics: ['materialist', 'spiritualist', 'xenophile'],
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    description: 'Focus on alliances, federations, and the galactic community. Strength through cooperation.',
    focus: 'Alliance building and galactic politics',
    bonuses: [
      { stat: 'diplomatic_influence', value: 25, description: 'Diplomatic influence increased by 25%' },
      { stat: 'federation_bonus', value: 20, description: 'Federation bonus increased by 20%' },
      { stat: 'trust_growth', value: 15, description: 'Trust growth increased by 15%' },
    ],
    preferredEthics: ['egalitarian', 'xenophile', 'pacifist'],
  },
  {
    id: 'stealth',
    name: 'Stealth',
    description: 'Focus on espionage, cloaking, and covert operations. The unseen hand controls destiny.',
    focus: 'Espionage and covert operations',
    bonuses: [
      { stat: 'espionage_power', value: 25, description: 'Espionage power increased by 25%' },
      { stat: 'cloaking_strength', value: 20, description: 'Cloaking strength increased by 20%' },
      { stat: 'sabotage_effectiveness', value: 15, description: 'Sabotage effectiveness increased by 15%' },
    ],
    preferredEthics: ['authoritarian', 'xenophobe', 'militarist'],
  },
];

export const VICTORY_CONDITIONS: readonly VictoryCondition[] = [
  {
    id: 'conquest',
    name: 'Conquest Victory',
    description: 'Dominate the galaxy through military force. Control 75% of all systems.',
    requirements: [
      { type: 'systems_controlled', value: 75, description: 'Control 75% of galaxy systems' },
      { type: 'fleet_power', value: 100, description: 'Maintain dominant fleet power' },
    ],
    scoring: { basePoints: 1000, multiplier: 1.5, timeBonus: true },
  },
  {
    id: 'science',
    name: 'Science Victory',
    description: 'Achieve transcendence through technological mastery. Build the Galactic Wonder.',
    requirements: [
      { type: 'technology_tier', value: 10, description: 'Reach technology tier 10' },
      { type: 'wonder_built', value: 1, description: 'Construct the Galactic Wonder' },
      { type: 'research_completed', value: 50, description: 'Complete 50 research projects' },
    ],
    scoring: { basePoints: 1200, multiplier: 1.2, timeBonus: true },
  },
  {
    id: 'economic',
    name: 'Economic Victory',
    description: 'Accumulate unimaginable wealth. Reach the Galactic Wealth Threshold.',
    requirements: [
      { type: 'total_wealth', value: 1000000, description: 'Accumulate 1,000,000 credits' },
      { type: 'trade_routes', value: 20, description: 'Maintain 20 active trade routes' },
      { type: 'market_share', value: 50, description: 'Control 50% of galactic market' },
    ],
    scoring: { basePoints: 1100, multiplier: 1.3, timeBonus: true },
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic Victory',
    description: 'Lead the galactic community through consensus and respect.',
    requirements: [
      { type: 'federation_members', value: 10, description: 'Lead federation with 10+ members' },
      { type: 'galactic_leader', value: 1, description: 'Become galactic community leader' },
      { type: 'trust_score', value: 80, description: 'Maintain trust score above 80' },
    ],
    scoring: { basePoints: 1150, multiplier: 1.25, timeBonus: true },
  },
  {
    id: 'ascension',
    name: 'Ascension Victory',
    description: 'Transcend physical form and achieve a higher state of being.',
    requirements: [
      { type: 'psionic_level', value: 5, description: 'Reach psionic level 5' },
      { type: 'ascension_project', value: 1, description: 'Complete the Ascension Project' },
      { type: 'population_happiness', value: 90, description: 'Maintain 90% population happiness' },
    ],
    scoring: { basePoints: 1300, multiplier: 1.4, timeBonus: false },
  },
  {
    id: 'domination',
    name: 'Domination Victory',
    description: 'Eliminate all rival empires. Be the last power standing.',
    requirements: [
      { type: 'rivals_eliminated', value: 100, description: 'Eliminate 100% of rival empires' },
      { type: 'no_alliances', value: 0, description: 'No remaining allied empires' },
      { type: 'galactic_control', value: 100, description: 'Control all remaining systems' },
    ],
    scoring: { basePoints: 1400, multiplier: 1.5, timeBonus: true },
  },
];

export const SPECIAL_MECHANICS: readonly SpecialMechanic[] = [
  {
    id: 'assimilation',
    name: 'Assimilation',
    description: 'Conquer species and gain their unique traits and technologies.',
    empireId: 'borg-collective',
    activationCost: { credits: 5000, influence: 50 },
    cooldown: 10,
    effects: [
      { stat: 'assimilation_speed', value: 20, description: 'Assimilation speed increased by 20%' },
      { stat: 'trait_absorption', value: 100, description: 'Can absorb conquered species traits' },
    ],
  },
  {
    id: 'cloaking',
    name: 'Cloaking',
    description: 'Render fleets invisible to sensors. Launch surprise attacks.',
    empireId: 'romulan-star-empire',
    activationCost: { credits: 3000, influence: 30 },
    cooldown: 5,
    effects: [
      { stat: 'fleet_visibility', value: 0, description: 'Fleet becomes invisible to sensors' },
      { stat: 'surprise_attack_bonus', value: 25, description: 'Surprise attack damage increased by 25%' },
    ],
  },
  {
    id: 'trade_routes',
    name: 'Trade Routes',
    description: 'Establish lucrative trade routes between systems for passive income.',
    empireId: 'ferengi-commerce',
    activationCost: { credits: 2000, influence: 20 },
    cooldown: 3,
    effects: [
      { stat: 'passive_income', value: 500, description: 'Earn 500 credits per turn from trade' },
      { stat: 'trade_route_efficiency', value: 30, description: 'Trade route efficiency increased by 30%' },
    ],
  },
  {
    id: 'honor_system',
    name: 'Honor System',
    description: 'Gain combat bonuses through honorable conduct in battle.',
    empireId: 'klingon-empire',
    activationCost: { credits: 1000, influence: 40 },
    cooldown: 8,
    effects: [
      { stat: 'honor_points', value: 10, description: 'Gain 10 honor points' },
      { stat: 'combat_morale', value: 20, description: 'Combat morale increased by 20%' },
    ],
  },
  {
    id: 'psionic_shroud',
    name: 'Psionic Shroud',
    description: 'Access psionic technology and mental disciplines.',
    empireId: 'vulcan-science',
    activationCost: { credits: 4000, influence: 60 },
    cooldown: 15,
    effects: [
      { stat: 'psionic_research_speed', value: 50, description: 'Psionic research speed increased by 50%' },
      { stat: 'mind_meld_available', value: 1, description: 'Mind meld ability unlocked' },
    ],
  },
  {
    id: 'surveillance',
    name: 'Surveillance',
    description: 'Deploy extensive spy networks for intelligence gathering.',
    empireId: 'cardassian-union',
    activationCost: { credits: 3500, influence: 35 },
    cooldown: 7,
    effects: [
      { stat: 'espionage_network_size', value: 200, description: 'Espionage network size increased by 200%' },
      { stat: 'counter_intelligence', value: 25, description: 'Counter-intelligence increased by 25%' },
    ],
  },
  {
    id: 'adaptive_tech',
    name: 'Adaptive Technology',
    description: 'Copy and integrate enemy technology into your own systems.',
    empireId: 'xindi-council',
    activationCost: { credits: 6000, influence: 45 },
    cooldown: 12,
    effects: [
      { stat: 'tech_copy_chance', value: 30, description: '30% chance to copy enemy technology' },
      { stat: 'tech_integration_speed', value: 40, description: 'Tech integration speed increased by 40%' },
    ],
  },
  {
    id: 'consumption',
    name: 'Consumption',
    description: 'Convert destroyed enemies into resources for the swarm.',
    empireId: 'hive-swarm',
    activationCost: { credits: 0, influence: 0 },
    cooldown: 0,
    effects: [
      { stat: 'biomass_conversion', value: 50, description: 'Convert 50% of destroyed units to biomass' },
      { stat: 'resource_from_destruction', value: 25, description: 'Gain 25% resources from destruction' },
    ],
  },
];

export const EMPIRE_RELATIONS_CONFIG: EmpireRelationsConfig = {
  trust: {
    level: 0,
    decayRate: 0.5,
    maxLevel: 100,
    growthPerTurn: 1,
    aggressionPenalty: -25,
    betrayalPenalty: -50,
  },
  rivalry: {
    combatBonus: 10,
    tradePenalty: -20,
    espionageBonus: 15,
    diplomaticPenalty: -25,
  },
  federation: {
    maxMembers: 12,
    minTrustRequired: 50,
    sharedFleetBonus: 10,
    sharedResearchBonus: 5,
    sharedTradeBonus: 8,
    warContributionRequired: 20,
  },
  warJustifications: [
    { type: 'territorial_dispute', trustRequired: 30, influenceCost: 20, justificationDuration: 5, description: 'Claim disputed territory' },
    { type: 'resource_theft', trustRequired: 40, influenceCost: 15, justificationDuration: 3, description: 'Retaliate for resource theft' },
    { type: 'aggression_response', trustRequired: 20, influenceCost: 10, justificationDuration: 2, description: 'Respond to enemy aggression' },
    { type: 'ideological_crusade', trustRequired: 50, influenceCost: 30, justificationDuration: 10, description: 'Wage war for ideological reasons' },
    { type: 'genocide_prevention', trustRequired: 60, influenceCost: 25, justificationDuration: 7, description: 'Intervene to prevent genocide' },
    { type: 'trade_embargo', trustRequired: 35, influenceCost: 15, justificationDuration: 4, description: 'Enforce trade embargo' },
  ],
  peaceTreaties: [
    { type: 'white_peace', duration: 10, borderReset: false, reparationsMax: 0, nonAggressionPeriod: 10, systemTransferAllowed: false },
    { type: 'conditional_surrender', duration: 20, borderReset: true, reparationsMax: 50000, nonAggressionPeriod: 20, systemTransferAllowed: true },
    { type: 'total_defeat', duration: 30, borderReset: true, reparationsMax: 100000, nonAggressionPeriod: 30, systemTransferAllowed: true },
    { type: 'ceasefire', duration: 5, borderReset: false, reparationsMax: 0, nonAggressionPeriod: 5, systemTransferAllowed: false },
    { type: 'armistice', duration: 15, borderReset: false, reparationsMax: 25000, nonAggressionPeriod: 15, systemTransferAllowed: false },
  ],
};

export const FACTION_SYSTEM_CONFIG: FactionSystemConfig = {
  factions: [
    {
      id: 'military-faction',
      name: 'Military Faction',
      demands: [
        { type: 'fleet_size', description: 'Maintain minimum fleet size', fulfillmentThreshold: 50 },
        { type: 'aggressive_actions', description: 'Conduct regular military operations', fulfillmentThreshold: 3 },
        { type: 'fortification', description: 'Maintain border defenses', fulfillmentThreshold: 10 },
      ],
      happyBonuses: [
        { stat: 'fleet_strength', value: 10, description: 'Fleet strength increased by 10%' },
        { stat: 'morale', value: 5, description: 'Morale increased by 5%' },
      ],
      unhappyPenalties: [
        { stat: 'fleet_strength', value: -10, description: 'Fleet strength decreased by 10%' },
        { stat: 'coup_chance', value: 15, description: 'Coup chance increased by 15%' },
      ],
      leader: 'High General',
      influenceDecayRate: 2,
      rebellionThreshold: 20,
      loyaltyGainPerTurn: 1,
    },
    {
      id: 'science-faction',
      name: 'Science Faction',
      demands: [
        { type: 'research_investment', description: 'Invest in research projects', fulfillmentThreshold: 20 },
        { type: 'tech_discovery', description: 'Discover new technologies', fulfillmentThreshold: 5 },
        { type: 'research_station', description: 'Maintain research stations', fulfillmentThreshold: 3 },
      ],
      happyBonuses: [
        { stat: 'research_speed', value: 10, description: 'Research speed increased by 10%' },
        { stat: 'innovation_bonus', value: 5, description: 'Innovation bonus increased by 5%' },
      ],
      unhappyPenalties: [
        { stat: 'research_speed', value: -10, description: 'Research speed decreased by 10%' },
        { stat: 'brain_drain', value: 20, description: 'Brain drain chance increased by 20%' },
      ],
      leader: 'Chief Scientist',
      influenceDecayRate: 1.5,
      rebellionThreshold: 25,
      loyaltyGainPerTurn: 1.5,
    },
    {
      id: 'trade-faction',
      name: 'Trade Faction',
      demands: [
        { type: 'trade_routes', description: 'Maintain active trade routes', fulfillmentThreshold: 5 },
        { type: 'market_access', description: 'Ensure market access', fulfillmentThreshold: 3 },
        { type: 'commercial_treaties', description: 'Sign commercial treaties', fulfillmentThreshold: 2 },
      ],
      happyBonuses: [
        { stat: 'trade_income', value: 10, description: 'Trade income increased by 10%' },
        { stat: 'market_advantage', value: 5, description: 'Market advantage increased by 5%' },
      ],
      unhappyPenalties: [
        { stat: 'trade_income', value: -10, description: 'Trade income decreased by 10%' },
        { stat: 'embargo_chance', value: 15, description: 'Embargo chance increased by 15%' },
      ],
      leader: 'Trade Minister',
      influenceDecayRate: 1,
      rebellionThreshold: 30,
      loyaltyGainPerTurn: 2,
    },
    {
      id: 'religious-faction',
      name: 'Religious Faction',
      demands: [
        { type: 'temple_construction', description: 'Construct temples', fulfillmentThreshold: 3 },
        { type: 'pilgrimage_support', description: 'Support pilgrimage routes', fulfillmentThreshold: 2 },
        { type: 'faith_protection', description: 'Protect religious sites', fulfillmentThreshold: 5 },
      ],
      happyBonuses: [
        { stat: 'morale', value: 10, description: 'Morale increased by 10%' },
        { stat: 'stability', value: 5, description: 'Stability increased by 5%' },
      ],
      unhappyPenalties: [
        { stat: 'morale', value: -10, description: 'Morale decreased by 10%' },
        { stat: 'unrest_chance', value: 20, description: 'Unrest chance increased by 20%' },
      ],
      leader: 'High Priest',
      influenceDecayRate: 1,
      rebellionThreshold: 20,
      loyaltyGainPerTurn: 1.5,
    },
    {
      id: 'populist-faction',
      name: 'Populist Faction',
      demands: [
        { type: 'housing_quality', description: 'Maintain housing quality', fulfillmentThreshold: 60 },
        { type: 'food_availability', description: 'Ensure food availability', fulfillmentThreshold: 70 },
        { type: 'civil_rights', description: 'Protect civil rights', fulfillmentThreshold: 50 },
      ],
      happyBonuses: [
        { stat: 'population_growth', value: 10, description: 'Population growth increased by 10%' },
        { stat: 'productivity', value: 5, description: 'Productivity increased by 5%' },
      ],
      unhappyPenalties: [
        { stat: 'population_growth', value: -10, description: 'Population growth decreased by 10%' },
        { stat: 'revolution_chance', value: 15, description: 'Revolution chance increased by 15%' },
      ],
      leader: "People's Tribune",
      influenceDecayRate: 0.5,
      rebellionThreshold: 15,
      loyaltyGainPerTurn: 2,
    },
  ],
  baseInfluence: 50,
  maxInfluence: 100,
  influenceDecayRate: 1,
  rebellionWarningThreshold: 20,
  coupThreshold: 10,
};

export const EMPIRE_TYPES_CONFIG: EmpireTypesConfig = {
  archetypes: EMPIRE_ARCHETYPES,
  playstyles: PLAYSTYLES,
  victoryConditions: VICTORY_CONDITIONS,
  specialMechanics: SPECIAL_MECHANICS,
  relations: EMPIRE_RELATIONS_CONFIG,
  factionSystem: FACTION_SYSTEM_CONFIG,
};

export function getArchetypeById(id: EmpireArchetypeId): EmpireArchetype | undefined {
  return EMPIRE_ARCHETYPES.find(a => a.id === id);
}

export function getPlaystyleById(id: PlaystyleId): PlaystyleDefinition | undefined {
  return PLAYSTYLES.find(p => p.id === id);
}

export function getVictoryConditionById(id: VictoryConditionId): VictoryCondition | undefined {
  return VICTORY_CONDITIONS.find(v => v.id === id);
}

export function getSpecialMechanicByEmpire(empireId: EmpireArchetypeId): SpecialMechanic | undefined {
  return SPECIAL_MECHANICS.find(m => m.empireId === empireId);
}

export function getArchetypesByPlaystyle(playstyle: PlaystyleId): readonly EmpireArchetype[] {
  return EMPIRE_ARCHETYPES.filter(a => a.playstyle === playstyle);
}

export function getArchetypesByEthics(ethic: EthicsType): readonly EmpireArchetype[] {
  return EMPIRE_ARCHETYPES.filter(a => a.ethics.includes(ethic));
}

export function getArchetypesByGovernment(government: GovernmentType): readonly EmpireArchetype[] {
  return EMPIRE_ARCHETYPES.filter(a => a.government === government);
}

export function getArchetypesByAuthority(authority: AuthorityType): readonly EmpireArchetype[] {
  return EMPIRE_ARCHETYPES.filter(a => a.authority === authority);
}

export function getFactionsByEmpire(empireId: EmpireArchetypeId): readonly FactionDefinition[] {
  return FACTION_SYSTEM_CONFIG.factions;
}

export function getWarJustificationByType(type: string): WarJustification | undefined {
  return EMPIRE_RELATIONS_CONFIG.warJustifications.find(j => j.type === type);
}

export function getPeaceTreatyByType(type: string): PeaceTreaty | undefined {
  return EMPIRE_RELATIONS_CONFIG.peaceTreaties.find(t => t.type === type);
}

export function getVictoryConditionsByType(type: string): readonly VictoryCondition[] {
  return VICTORY_CONDITIONS.filter(v => v.requirements.some(r => r.type === type));
}

export function calculateTrustChange(baseGrowth: number, aggression: boolean, betrayal: boolean): number {
  let change = baseGrowth;
  if (aggression) change += EMPIRE_RELATIONS_CONFIG.trust.aggressionPenalty;
  if (betrayal) change += EMPIRE_RELATIONS_CONFIG.trust.betrayalPenalty;
  return Math.max(-EMPIRE_RELATIONS_CONFIG.trust.maxLevel, Math.min(EMPIRE_RELATIONS_CONFIG.trust.maxLevel, change));
}

export function calculateFederationBonus(memberCount: number): number {
  return Math.floor(memberCount * EMPIRE_RELATIONS_CONFIG.federation.sharedFleetBonus * 0.1);
}

export function calculateRivalryBonus(hasRivalry: boolean): number {
  return hasRivalry ? EMPIRE_RELATIONS_CONFIG.rivalry.combatBonus : 0;
}

export function calculateFactionInfluence(state: FactionInfluenceState, influence: number): number {
  const modifiers: Record<FactionInfluenceState, number> = {
    loyal: 1.5,
    content: 1.0,
    neutral: 0.8,
    disgruntled: 0.5,
    rebellious: 0.2,
  };
  return influence * (modifiers[state] ?? 1.0);
}

export function canDeclareWar(trust: number, justification: WarJustification): boolean {
  return trust <= justification.trustRequired;
}

export function canFormFederation(trust: number, memberCount: number): boolean {
  return trust >= EMPIRE_RELATIONS_CONFIG.federation.minTrustRequired &&
    memberCount < EMPIRE_RELATIONS_CONFIG.federation.maxMembers;
}
