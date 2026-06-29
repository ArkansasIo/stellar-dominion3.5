export interface GovernmentLeaderType {
  id: string;
  name: string;
  type: string;
  class: string;
  subClass: string;
  subType: string;
  governanceStyle: string;
  bonuses: {
    stability?: number;
    economy?: number;
    military?: number;
    research?: number;
    diplomacy?: number;
  };
}

export const GOVERNMENT_LEADER_TYPES_23: GovernmentLeaderType[] = [
  { id: 'gov-high-chancellor-prime', name: 'High Chancellor', type: 'Executive', class: 'State Core', subClass: 'Central Authority', subType: 'Prime', governanceStyle: 'Directive Command', bonuses: { stability: 8, diplomacy: 4, economy: 3 } },
  { id: 'gov-war-consul-vanguard', name: 'War Consul', type: 'Military', class: 'Defense Council', subClass: 'Fleet Doctrine', subType: 'Vanguard', governanceStyle: 'Strategic Militarism', bonuses: { military: 9, stability: 3, economy: 2 } },
  { id: 'gov-trade-minister-market', name: 'Trade Minister', type: 'Economic', class: 'Commerce Bureau', subClass: 'Interstellar Market', subType: 'Market', governanceStyle: 'Mercantile Expansion', bonuses: { economy: 9, diplomacy: 3, stability: 2 } },
  { id: 'gov-science-director-lumen', name: 'Science Director', type: 'Scientific', class: 'Research Authority', subClass: 'Innovation Board', subType: 'Lumen', governanceStyle: 'Technocratic Planning', bonuses: { research: 10, economy: 2, stability: 2 } },
  { id: 'gov-foreign-envoy-celestial', name: 'Foreign Envoy', type: 'Diplomatic', class: 'Embassy Corps', subClass: 'Alliance Office', subType: 'Celestial', governanceStyle: 'Alliance Diplomacy', bonuses: { diplomacy: 9, stability: 3, economy: 2 } },
  { id: 'gov-security-prefect-sentinel', name: 'Security Prefect', type: 'Security', class: 'Internal Order', subClass: 'Civil Defense', subType: 'Sentinel', governanceStyle: 'Order First', bonuses: { stability: 9, military: 4 } },
  { id: 'gov-resource-overseer-forge', name: 'Resource Overseer', type: 'Economic', class: 'Resource Directorate', subClass: 'Extraction Command', subType: 'Forge', governanceStyle: 'Industrial Extraction', bonuses: { economy: 8, stability: 3, military: 2 } },
  { id: 'gov-population-warden-haven', name: 'Population Warden', type: 'Civil', class: 'Population Office', subClass: 'Habitat Management', subType: 'Haven', governanceStyle: 'Civil Welfare', bonuses: { stability: 7, economy: 4, diplomacy: 2 } },
  { id: 'gov-judicial-arbiter-equity', name: 'Judicial Arbiter', type: 'Judicial', class: 'Justice Hall', subClass: 'Legal Oversight', subType: 'Equity', governanceStyle: 'Rule of Law', bonuses: { stability: 8, diplomacy: 3, military: 1 } },
  { id: 'gov-propaganda-speaker-echo', name: 'Propaganda Speaker', type: 'Influence', class: 'Narrative Bureau', subClass: 'Public Cohesion', subType: 'Echo', governanceStyle: 'Mass Messaging', bonuses: { stability: 6, military: 3, diplomacy: 3 } },
  { id: 'gov-frontier-governor-pioneer', name: 'Frontier Governor', type: 'Expansion', class: 'Colonial Office', subClass: 'Frontier Administration', subType: 'Pioneer', governanceStyle: 'Expansion Governance', bonuses: { economy: 6, stability: 4, military: 3 } },
  { id: 'gov-logistics-marshall-grid', name: 'Logistics Marshall', type: 'Infrastructure', class: 'Transit Authority', subClass: 'Supply Grid', subType: 'Grid', governanceStyle: 'Systemic Logistics', bonuses: { economy: 7, military: 4, stability: 2 } },
  { id: 'gov-intelligence-regent-shadow', name: 'Intelligence Regent', type: 'Security', class: 'Intelligence Office', subClass: 'Counter-Operations', subType: 'Shadow', governanceStyle: 'Covert Oversight', bonuses: { military: 6, diplomacy: 4, stability: 3 } },
  { id: 'gov-faith-hierophant-aether', name: 'Faith Hierophant', type: 'Cultural', class: 'Spiritual Council', subClass: 'Doctrine', subType: 'Aether', governanceStyle: 'Ideological Unity', bonuses: { stability: 7, diplomacy: 4, research: 1 } },
  { id: 'gov-cyber-governor-neural', name: 'Cyber Governor', type: 'Scientific', class: 'Synthetic Bureau', subClass: 'Automation Policy', subType: 'Neural', governanceStyle: 'Algorithmic Governance', bonuses: { research: 8, economy: 4, stability: 2 } },
  { id: 'gov-maritime-commissioner-tide', name: 'Maritime Commissioner', type: 'Infrastructure', class: 'Orbital Port Authority', subClass: 'Docking Operations', subType: 'Tide', governanceStyle: 'Port-Centric Trade', bonuses: { economy: 7, military: 3, diplomacy: 2 } },
  { id: 'gov-ecology-curator-verdant', name: 'Ecology Curator', type: 'Civil', class: 'Biosphere Office', subClass: 'Sustainability', subType: 'Verdant', governanceStyle: 'Eco-Balance', bonuses: { stability: 6, research: 3, economy: 3 } },
  { id: 'gov-industrial-praetor-crucible', name: 'Industrial Praetor', type: 'Economic', class: 'Forge Administration', subClass: 'Heavy Industry', subType: 'Crucible', governanceStyle: 'Production Supremacy', bonuses: { economy: 8, military: 3, stability: 2 } },
  { id: 'gov-academy-provost-axiom', name: 'Academy Provost', type: 'Scientific', class: 'Academy Network', subClass: 'Knowledge Policy', subType: 'Axiom', governanceStyle: 'Scholastic Governance', bonuses: { research: 9, diplomacy: 2, economy: 2 } },
  { id: 'gov-senate-speaker-orbit', name: 'Senate Speaker', type: 'Diplomatic', class: 'Legislative Chamber', subClass: 'Consensus Building', subType: 'Orbit', governanceStyle: 'Parliamentary Debate', bonuses: { diplomacy: 7, stability: 4, economy: 2 } },
  { id: 'gov-enforcement-tribune-iron', name: 'Enforcement Tribune', type: 'Security', class: 'Civic Guard', subClass: 'Enforcement Command', subType: 'Iron', governanceStyle: 'Strict Enforcement', bonuses: { stability: 8, military: 5 } },
  { id: 'gov-crisis-coordinator-bulwark', name: 'Crisis Coordinator', type: 'Executive', class: 'Emergency Council', subClass: 'Rapid Response', subType: 'Bulwark', governanceStyle: 'Emergency Mobilization', bonuses: { stability: 7, military: 4, economy: 2 } },
  { id: 'gov-heritage-keeper-chronicle', name: 'Heritage Keeper', type: 'Cultural', class: 'Archives Office', subClass: 'Historical Continuity', subType: 'Chronicle', governanceStyle: 'Tradition Stewardship', bonuses: { stability: 6, diplomacy: 4, research: 2 } },
];

export const GOVERNMENT_LEADER_TYPE_COUNT = GOVERNMENT_LEADER_TYPES_23.length;

export function getGovernmentLeadersByType(type: string): GovernmentLeaderType[] {
  return GOVERNMENT_LEADER_TYPES_23.filter(leader => leader.type.toLowerCase() === type.toLowerCase());
}

export function getGovernmentLeadersByClass(leaderClass: string): GovernmentLeaderType[] {
  return GOVERNMENT_LEADER_TYPES_23.filter(leader => leader.class.toLowerCase() === leaderClass.toLowerCase());
}

export function getGovernmentLeaderTypes(): string[] {
  return Array.from(new Set(GOVERNMENT_LEADER_TYPES_23.map(leader => leader.type)));
}

export function getGovernmentLeaderClasses(): string[] {
  return Array.from(new Set(GOVERNMENT_LEADER_TYPES_23.map(leader => leader.class)));
}
