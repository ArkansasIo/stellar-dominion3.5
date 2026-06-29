/**
 * Mercenary System Configuration
 * Contract types, guilds, hiring mechanics, and reputation system
 * @tag #mercenary #contracts #guilds #config
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ContractType =
  | 'escort'
  | 'raider'
  | 'defender'
  | 'scout'
  | 'assassin'
  | 'smuggler'
  | 'bodyguard'
  | 'siege'
  | 'recon'
  | 'salvage';

export type ContractDifficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'legendary';

export type GuildRank = 'Recruit' | 'Member' | 'Veteran' | 'Elite' | 'Legend';

export interface ContractTypeDefinition {
  id: ContractType;
  name: string;
  description: string;
  icon: string;
  baseDuration: number;
  baseRiskLevel: number;
  allowedDifficulties: ContractDifficulty[];
}

export interface MercenaryContract {
  id: string;
  type: ContractType;
  name: string;
  description: string;
  guildId: string;
  offeringRaceId: string;
  difficulty: ContractDifficulty;
  reward: {
    credits: number;
    reputation: number;
    specialReward?: string;
  };
  requirements: {
    minLevel: number;
    minReputation: number;
    fleetPower: number;
    raceRestriction?: string[];
  };
  duration: number;
  targets: string[];
  risks: string[];
}

export interface MercenaryGuild {
  id: string;
  name: string;
  description: string;
  headquartersRaceId: string;
  associatedRaces: string[];
  availableContracts: ContractType[];
  rankThresholds: Record<GuildRank, number>;
  rankBonuses: Record<GuildRank, GuildRankBonus>;
  guildPerks: string[];
  recruitmentCost: number;
}

export interface GuildRankBonus {
  contractPayBonus: number;
  reputationGainBonus: number;
  fleetDiscount: number;
  exclusiveAccess: ContractDifficulty[];
  specialPerks: string[];
}

export interface MercenaryFleetTemplate {
  difficulty: ContractDifficulty;
  raceId: string;
  ships: MercenaryShip[];
  totalPower: number;
  costMultiplier: number;
}

export interface MercenaryShip {
  type: string;
  count: number;
  basePower: number;
  role: string;
}

export interface MercenaryReputationState {
  guildId: string;
  reputation: number;
  rank: GuildRank;
  completedContracts: number;
  failedContracts: number;
  totalEarnings: number;
  lastContractTurn: number;
  activeContracts: string[];
}

// ============================================================================
// CONTRACT TYPES (10)
// ============================================================================

export const CONTRACT_TYPES: Record<ContractType, ContractTypeDefinition> = {
  escort: {
    id: 'escort',
    name: 'Escort Mission',
    description: 'Protect a fleet or station from hostile forces during transit or stationary operations.',
    icon: '🛡️',
    baseDuration: 3,
    baseRiskLevel: 2,
    allowedDifficulties: ['easy', 'medium', 'hard'],
  },
  raider: {
    id: 'raider',
    name: 'Raid Operation',
    description: 'Attack a specific target to disrupt enemy operations or seize assets.',
    icon: '⚔️',
    baseDuration: 2,
    baseRiskLevel: 4,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  defender: {
    id: 'defender',
    name: 'System Defense',
    description: 'Defend a star system against incoming hostile forces.',
    icon: '🏰',
    baseDuration: 5,
    baseRiskLevel: 3,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  scout: {
    id: 'scout',
    name: 'Exploration Mission',
    description: 'Explore unknown or contested territory to gather strategic intelligence.',
    icon: '🔍',
    baseDuration: 4,
    baseRiskLevel: 2,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  assassin: {
    id: 'assassin',
    name: 'Target Elimination',
    description: 'Locate and eliminate a high-value enemy target.',
    icon: '🎯',
    baseDuration: 3,
    baseRiskLevel: 5,
    allowedDifficulties: ['medium', 'hard', 'extreme', 'legendary'],
  },
  smuggler: {
    id: 'smuggler',
    name: 'Smuggling Run',
    description: 'Transport illegal or restricted goods through hostile territory.',
    icon: '📦',
    baseDuration: 2,
    baseRiskLevel: 3,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  bodyguard: {
    id: 'bodyguard',
    name: 'VIP Protection',
    description: 'Protect a commander or diplomat during high-risk operations.',
    icon: '👤',
    baseDuration: 4,
    baseRiskLevel: 3,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  siege: {
    id: 'siege',
    name: 'Siege Warfare',
    description: 'Participate in a prolonged siege against a fortified enemy position.',
    icon: '💥',
    baseDuration: 8,
    baseRiskLevel: 5,
    allowedDifficulties: ['hard', 'extreme', 'legendary'],
  },
  recon: {
    id: 'recon',
    name: 'Intelligence Gathering',
    description: 'Conduct covert surveillance and intelligence operations.',
    icon: '👁️',
    baseDuration: 3,
    baseRiskLevel: 2,
    allowedDifficulties: ['easy', 'medium', 'hard', 'extreme'],
  },
  salvage: {
    id: 'salvage',
    name: 'Salvage Operation',
    description: 'Recover derelict ships, stations, or valuable assets from dangerous areas.',
    icon: '🔧',
    baseDuration: 4,
    baseRiskLevel: 2,
    allowedDifficulties: ['easy', 'medium', 'hard'],
  },
};

// ============================================================================
// MERCENARY GUILDS (15)
// ============================================================================

export const MERCENARY_GUILDS: MercenaryGuild[] = [
  {
    id: 'guild-warborn-legion',
    name: 'The Warborn Legion',
    description: 'Krell Dominion\'s elite mercenary outfit. Known for overwhelming force and ruthless efficiency.',
    headquartersRaceId: 'race-krell',
    associatedRaces: ['race-krell', 'race-gorn', 'race-nausicaan'],
    availableContracts: ['raider', 'siege', 'defender', 'escort'],
    rankThresholds: { Recruit: 0, Member: 100, Veteran: 500, Elite: 1500, Legend: 5000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Priority queue for combat contracts'] },
      Veteran: { contractPayBonus: 0.12, reputationGainBonus: 0.2, fleetDiscount: 0.05, exclusiveAccess: ['hard'], specialPerks: ['Discounted raid fleets', 'Veteran equipment cache'] },
      Elite: { contractPayBonus: 0.2, reputationGainBonus: 0.3, fleetDiscount: 0.1, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite strike teams', 'Double reputation on raids'] },
      Legend: { contractPayBonus: 0.35, reputationGainBonus: 0.5, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary war machines', 'Personal honor guard', 'Galactic fear bonus'] },
    },
    guildPerks: ['+10% combat fleet power', 'Access to Krell warship blueprints', 'Reduced maintenance on offensive fleets'],
    recruitmentCost: 500,
  },
  {
    id: 'guild-syndicate-council',
    name: 'The Syndicate Council',
    description: 'Orion Syndicate\'s mercenary network. Specialists in smuggling, theft, and deniable operations.',
    headquartersRaceId: 'race-orion',
    associatedRaces: ['race-orion', 'race-ferengi', 'race-dosi'],
    availableContracts: ['smuggler', 'assassin', 'scout', 'recon'],
    rankThresholds: { Recruit: 0, Member: 80, Veteran: 400, Elite: 1200, Legend: 4000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.08, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Black market access'] },
      Veteran: { contractPayBonus: 0.15, reputationGainBonus: 0.2, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Smuggling route knowledge', 'Fence stolen goods'] },
      Elite: { contractPayBonus: 0.25, reputationGainBonus: 0.3, fleetDiscount: 0.12, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite spy network', 'Counter-intelligence ops'] },
      Legend: { contractPayBonus: 0.4, reputationGainBonus: 0.5, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Galactic smuggling empire', 'Shadow fleet', 'Assassin cadre'] },
    },
    guildPerks: ['+15% trade income from missions', 'Reduced detection risk on smuggling', 'Black market price discounts'],
    recruitmentCost: 300,
  },
  {
    id: 'guild-raider-clans',
    name: 'The Raider Clans',
    description: 'Nausicaan berserker mercenary bands. Fearless fighters who live for glory and plunder.',
    headquartersRaceId: 'race-nausicaan',
    associatedRaces: ['race-nausicaan', 'race-gorn', 'race-krell'],
    availableContracts: ['raider', 'escort', 'siege', 'salvage'],
    rankThresholds: { Recruit: 0, Member: 60, Veteran: 300, Elite: 900, Legend: 3000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.08, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Berserker rage activation'] },
      Veteran: { contractPayBonus: 0.1, reputationGainBonus: 0.15, fleetDiscount: 0.1, exclusiveAccess: ['hard'], specialPerks: ['Trophy hunter bonus', 'Plunder shares'] },
      Elite: { contractPayBonus: 0.18, reputationGainBonus: 0.25, fleetDiscount: 0.15, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite berserker squad', 'Double loot drops'] },
      Legend: { contractPayBonus: 0.3, reputationGainBonus: 0.4, fleetDiscount: 0.25, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary war barge', 'Blood oath fleet', 'Fear aura'] },
    },
    guildPerks: ['+20% boarding action success', 'Salvage yield increase', 'Morale immunity'],
    recruitmentCost: 200,
  },
  {
    id: 'guild-hunt',
    name: 'The Great Hunt',
    description: 'Hirogen hunter-guild. Apex predators who track the most dangerous prey in the galaxy.',
    headquartersRaceId: 'race-hirogen',
    associatedRaces: ['race-hirogen', 'race-hirogen-occupation'],
    availableContracts: ['assassin', 'scout', 'recon', 'raider'],
    rankThresholds: { Recruit: 0, Member: 90, Veteran: 450, Elite: 1400, Legend: 4500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.06, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Enhanced tracking sensors'] },
      Veteran: { contractPayBonus: 0.14, reputationGainBonus: 0.2, fleetDiscount: 0.06, exclusiveAccess: ['hard'], specialPerks: ['Trophy collection bonus', 'Stealth camouflage'] },
      Elite: { contractPayBonus: 0.22, reputationGainBonus: 0.3, fleetDiscount: 0.12, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite hunter squad', 'Target prediction AI'] },
      Legend: { contractPayBonus: 0.38, reputationGainBonus: 0.5, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary prey ship', 'Galactic hunt network', 'Predator Instinct'] },
    },
    guildPerks: ['+25% precision damage', 'Scouting range bonus', 'Rare prey bounties'],
    recruitmentCost: 600,
  },
  {
    id: 'guild-tal-shiar',
    name: 'The Tal Shiar Dominion',
    description: 'Romulan intelligence mercenary division. Covert operations, espionage, and strategic deception.',
    headquartersRaceId: 'race-romulan',
    associatedRaces: ['race-romulan', 'race-cardassian', 'race-changeling'],
    availableContracts: ['recon', 'assassin', 'smuggler', 'scout'],
    rankThresholds: { Recruit: 0, Member: 120, Veteran: 600, Elite: 1800, Legend: 6000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.07, reputationGainBonus: 0.12, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Basic cloaking protocols'] },
      Veteran: { contractPayBonus: 0.15, reputationGainBonus: 0.22, fleetDiscount: 0.05, exclusiveAccess: ['hard'], specialPerks: ['Advanced espionage intel', 'Disruptor optimization'] },
      Elite: { contractPayBonus: 0.25, reputationGainBonus: 0.35, fleetDiscount: 0.1, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite spy cell', 'Perfect cloaking'] },
      Legend: { contractPayBonus: 0.42, reputationGainBonus: 0.55, fleetDiscount: 0.18, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Romulan Warbird access', 'Galactic intelligence network', 'Shadow government'] },
    },
    guildPerks: ['+15% espionage success rate', 'Cloaking tech discounts', 'Diplomatic immunity'],
    recruitmentCost: 800,
  },
  {
    id: 'guild-central-command',
    name: 'The Central Command',
    description: 'Cardassian military mercenary division. Strategic fortress defense and siege warfare specialists.',
    headquartersRaceId: 'race-cardassian',
    associatedRaces: ['race-cardassian', 'race-hierarchy'],
    availableContracts: ['defender', 'siege', 'escort', 'raider'],
    rankThresholds: { Recruit: 0, Member: 110, Veteran: 550, Elite: 1600, Legend: 5500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.08, fleetDiscount: 0.02, exclusiveAccess: [], specialPerks: ['Fortification blueprints'] },
      Veteran: { contractPayBonus: 0.12, reputationGainBonus: 0.18, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Galor-class access', 'Defensive doctrine bonus'] },
      Elite: { contractPayBonus: 0.2, reputationGainBonus: 0.28, fleetDiscount: 0.14, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Keldon-class access', 'Fortress network'] },
      Legend: { contractPayBonus: 0.35, reputationGainBonus: 0.45, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary fortress fleet', 'Cardassian dreadnought', 'Territory control'] },
    },
    guildPerks: ['+20% defensive fleet power', 'Station construction discount', 'Siege damage bonus'],
    recruitmentCost: 700,
  },
  {
    id: 'guild-scale-throne',
    name: 'The Scale Throne',
    description: 'Gorn Hegemony mercenary forces. Savage warriors who crush enemies with brute reptilian strength.',
    headquartersRaceId: 'race-gorn',
    associatedRaces: ['race-gorn', 'race-krell'],
    availableContracts: ['raider', 'siege', 'escort', 'defender'],
    rankThresholds: { Recruit: 0, Member: 70, Veteran: 350, Elite: 1100, Legend: 3500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.04, reputationGainBonus: 0.07, fleetDiscount: 0.03, exclusiveAccess: [], specialPerks: ['Reptilian ferocity'] },
      Veteran: { contractPayBonus: 0.1, reputationGainBonus: 0.14, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Heavy cruiser access', 'Brute force bonus'] },
      Elite: { contractPayBonus: 0.18, reputationGainBonus: 0.24, fleetDiscount: 0.14, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Gorn dreadnought', 'Territorial dominance'] },
      Legend: { contractPayBonus: 0.3, reputationGainBonus: 0.38, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary beast fleet', 'Scale Throne guard', 'Conquest aura'] },
    },
    guildPerks: ['+15% hull durability', 'Salvage rights', 'Aggressive expansion bonus'],
    recruitmentCost: 250,
  },
  {
    id: 'guild-warborn-united',
    name: 'United Earth Command',
    description: 'Terran Federation\'s mercenary arm. Balanced forces with strong diplomatic backing.',
    headquartersRaceId: 'race-terran-federation',
    associatedRaces: ['race-terran-federation', 'race-bajoran', 'race-xindi'],
    availableContracts: ['escort', 'defender', 'scout', 'bodyguard'],
    rankThresholds: { Recruit: 0, Member: 100, Veteran: 500, Elite: 1500, Legend: 5000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Federation comm relay access'] },
      Veteran: { contractPayBonus: 0.12, reputationGainBonus: 0.2, fleetDiscount: 0.06, exclusiveAccess: ['hard'], specialPerks: ['Cruiser-class access', 'Diplomatic immunity'] },
      Elite: { contractPayBonus: 0.2, reputationGainBonus: 0.3, fleetDiscount: 0.12, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Battlecruiser access', 'Starfleet intelligence'] },
      Legend: { contractPayBonus: 0.35, reputationGainBonus: 0.48, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary flagship', 'Federation protectorate', 'Galactic peacekeeper'] },
    },
    guildPerks: ['+10% all fleet stats', 'Diplomatic bonus with allies', 'Shield technology upgrade'],
    recruitmentCost: 500,
  },
  {
    id: 'guild-high-council',
    name: 'High Council of the Empire',
    description: 'Klingon honor-bound mercenary warriors. Fight with glory and die with honor.',
    headquartersRaceId: 'race-klingon',
    associatedRaces: ['race-klingon', 'race-krell'],
    availableContracts: ['raider', 'escort', 'siege', 'defender'],
    rankThresholds: { Recruit: 0, Member: 90, Veteran: 450, Elite: 1350, Legend: 4500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.06, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Honor point accumulation'] },
      Veteran: { contractPayBonus: 0.14, reputationGainBonus: 0.2, fleetDiscount: 0.07, exclusiveAccess: ['hard'], specialPerks: ['Bird of Prey access', 'Melee combat bonus'] },
      Elite: { contractPayBonus: 0.22, reputationGainBonus: 0.3, fleetDiscount: 0.13, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Battlecruiser access', 'Honor guard'] },
      Legend: { contractPayBonus: 0.38, reputationGainBonus: 0.5, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary Negh\'Var', 'Klingon empire fleet', 'Warrior\'s glory'] },
    },
    guildPerks: ['+20% melee/boarding damage', 'Honor-based bonuses', 'Warrior recruitment'],
    recruitmentCost: 400,
  },
  {
    id: 'guild-grand-exchange',
    name: 'The Grand Exchange',
    description: 'Varanthi mercenary fleet. Elite escort and trade protection specialists.',
    headquartersRaceId: 'race-varanthi',
    associatedRaces: ['race-varanthi', 'race-betazoid', 'race-trill'],
    availableContracts: ['escort', 'bodyguard', 'defender', 'smuggler'],
    rankThresholds: { Recruit: 0, Member: 100, Veteran: 500, Elite: 1500, Legend: 5000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.08, reputationGainBonus: 0.12, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Trade route bonus'] },
      Veteran: { contractPayBonus: 0.18, reputationGainBonus: 0.22, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Trade fleet access', 'Luxury goods'] },
      Elite: { contractPayBonus: 0.28, reputationGainBonus: 0.32, fleetDiscount: 0.15, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite trade convoy', 'Galactic market access'] },
      Legend: { contractPayBonus: 0.45, reputationGainBonus: 0.55, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Legendary trade fleet', 'Galactic trade empire', 'Wealth beyond measure'] },
    },
    guildPerks: ['+15% credit income', 'Trade agreement bonus', 'Luxury fleet cosmetics'],
    recruitmentCost: 600,
  },
  {
    id: 'guild-ferengi-commerce',
    name: 'The Ferengi Commerce Authority',
    description: 'Ferengi profit-driven mercenary operations. Every contract is a business deal.',
    headquartersRaceId: 'race-ferengi',
    associatedRaces: ['race-ferengi', 'race-orion', 'race-dosi'],
    availableContracts: ['smuggler', 'scout', 'escort', 'salvage'],
    rankThresholds: { Recruit: 0, Member: 70, Veteran: 350, Elite: 1050, Legend: 3500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.1, reputationGainBonus: 0.08, fleetDiscount: 0.02, exclusiveAccess: [], specialPerks: ['Profit margin increase'] },
      Veteran: { contractPayBonus: 0.2, reputationGainBonus: 0.15, fleetDiscount: 0.1, exclusiveAccess: ['hard'], specialPerks: ['Negotiation mastery', 'Black market deals'] },
      Elite: { contractPayBonus: 0.32, reputationGainBonus: 0.25, fleetDiscount: 0.18, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Corporate fleet', 'Market manipulation'] },
      Legend: { contractPayBonus: 0.5, reputationGainBonus: 0.4, fleetDiscount: 0.28, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Ferengi Trade Empire', 'Galactic monopoly', 'Profit incarnate'] },
    },
    guildPerks: ['+25% credit rewards', 'Discounted ship purchases', 'Market advantage'],
    recruitmentCost: 150,
  },
  {
    id: 'guild-bajoran-resistance',
    name: 'The Bajoran Provisional Government',
    description: 'Bajoran resistance mercenary corps. Spiritual warriors defending the faithful.',
    headquartersRaceId: 'race-bajoran',
    associatedRaces: ['race-bajoran', 'race-trill'],
    availableContracts: ['defender', 'escort', 'scout', 'bodyguard'],
    rankThresholds: { Recruit: 0, Member: 80, Veteran: 400, Elite: 1200, Legend: 4000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Spiritual fortitude'] },
      Veteran: { contractPayBonus: 0.12, reputationGainBonus: 0.2, fleetDiscount: 0.06, exclusiveAccess: ['hard'], specialPerks: ['Orb vision bonus', 'Resistance network'] },
      Elite: { contractPayBonus: 0.2, reputationGainBonus: 0.3, fleetDiscount: 0.12, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Prophet\'s blessing', 'Elite militia'] },
      Legend: { contractPayBonus: 0.35, reputationGainBonus: 0.45, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Orb of Time access', 'Celestial intervention', 'Bajoran fleet'] },
    },
    guildPerks: ['+10% shield strength', 'Moral authority bonus', 'Spiritual healing'],
    recruitmentCost: 350,
  },
  {
    id: 'guild-xindi-assembly',
    name: 'The Xindi Assembly',
    description: 'Xindi multi-species mercenary coalition. Diverse forces for any operation.',
    headquartersRaceId: 'race-xindi',
    associatedRaces: ['race-xindi', 'race-terran-federation'],
    availableContracts: ['defender', 'scout', 'escort', 'recon'],
    rankThresholds: { Recruit: 0, Member: 90, Veteran: 450, Elite: 1350, Legend: 4500 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.05, reputationGainBonus: 0.08, fleetDiscount: 0.02, exclusiveAccess: [], specialPerks: ['Diverse unit training'] },
      Veteran: { contractPayBonus: 0.12, reputationGainBonus: 0.18, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Xindi weapon access', 'Biological tech'] },
      Elite: { contractPayBonus: 0.2, reputationGainBonus: 0.28, fleetDiscount: 0.14, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite Xindi fleet', 'Bio-organic upgrades'] },
      Legend: { contractPayBonus: 0.35, reputationGainBonus: 0.42, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Xindi superweapon', 'Council authority', 'Galactic defense force'] },
    },
    guildPerks: ['+10% research speed', 'Diverse unit composition', 'Adaptive tactics'],
    recruitmentCost: 450,
  },
  {
    id: 'guild-hierarchy-committee',
    name: 'The Central Committee',
    description: 'Hierarchy bureaucratic mercenary machine. Efficient, organized, and relentless.',
    headquartersRaceId: 'race-hierarchy',
    associatedRaces: ['race-hierarchy', 'race-cardassian'],
    availableContracts: ['defender', 'escort', 'siege', 'scout'],
    rankThresholds: { Recruit: 0, Member: 100, Veteran: 500, Elite: 1500, Legend: 5000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.04, reputationGainBonus: 0.08, fleetDiscount: 0.02, exclusiveAccess: [], specialPerks: ['Bureaucratic efficiency'] },
      Veteran: { contractPayBonus: 0.1, reputationGainBonus: 0.16, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Standardized fleet', 'Logistics network'] },
      Elite: { contractPayBonus: 0.18, reputationGainBonus: 0.26, fleetDiscount: 0.14, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite bureaucracy', 'Mass production'] },
      Legend: { contractPayBonus: 0.32, reputationGainBonus: 0.4, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Bureaucratic supremacy', 'Galactic administration', 'Infinite paperwork'] },
    },
    guildPerks: ['+10% production speed', 'Reduced upkeep costs', 'Organizational bonus'],
    recruitmentCost: 550,
  },
  {
    id: 'guild-occupation-authority',
    name: 'The Occupation Authority',
    description: 'Hirogen Occupation mercenary forces. Adaptive hunters who occupy and dominate.',
    headquartersRaceId: 'race-hirogen-occupation',
    associatedRaces: ['race-hirogen-occupation', 'race-hirogen'],
    availableContracts: ['raider', 'assassin', 'siege', 'recon'],
    rankThresholds: { Recruit: 0, Member: 100, Veteran: 500, Elite: 1500, Legend: 5000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.06, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Adaptive camouflage'] },
      Veteran: { contractPayBonus: 0.14, reputationGainBonus: 0.2, fleetDiscount: 0.06, exclusiveAccess: ['hard'], specialPerks: ['Occupation tactics', 'Cybernetic upgrades'] },
      Elite: { contractPayBonus: 0.24, reputationGainBonus: 0.3, fleetDiscount: 0.12, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite occupation force', 'Psychological warfare'] },
      Legend: { contractPayBonus: 0.4, reputationGainBonus: 0.48, fleetDiscount: 0.2, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Galactic occupation fleet', 'Adaptive super-predator', 'Hunter supreme'] },
    },
    guildPerks: ['+15% precision damage', 'Occupation income', 'Adaptive technology'],
    recruitmentCost: 700,
  },
  {
    id: 'guild-vidiian-sodality',
    name: 'The Sodality Council',
    description: 'Vidiian mercenary healers and harvesters. Desperate survivors with medical expertise.',
    headquartersRaceId: 'race-vidiians',
    associatedRaces: ['race-vidiians'],
    availableContracts: ['salvage', 'smuggler', 'scout', 'bodyguard'],
    rankThresholds: { Recruit: 0, Member: 80, Veteran: 400, Elite: 1200, Legend: 4000 },
    rankBonuses: {
      Recruit: { contractPayBonus: 0, reputationGainBonus: 0, fleetDiscount: 0, exclusiveAccess: [], specialPerks: [] },
      Member: { contractPayBonus: 0.06, reputationGainBonus: 0.1, fleetDiscount: 0, exclusiveAccess: [], specialPerks: ['Medical expertise'] },
      Veteran: { contractPayBonus: 0.14, reputationGainBonus: 0.18, fleetDiscount: 0.08, exclusiveAccess: ['hard'], specialPerks: ['Bio-enhancement', 'Salvage priority'] },
      Elite: { contractPayBonus: 0.22, reputationGainBonus: 0.28, fleetDiscount: 0.14, exclusiveAccess: ['hard', 'extreme'], specialPerks: ['Elite harvester fleet', 'Genetic modification'] },
      Legend: { contractPayBonus: 0.36, reputationGainBonus: 0.42, fleetDiscount: 0.22, exclusiveAccess: ['hard', 'extreme', 'legendary'], specialPerks: ['Plague immunity', 'Organ empire', 'Desperate fury'] },
    },
    guildPerks: ['+10% salvage yield', 'Medical healing bonus', 'Bio-enhancement access'],
    recruitmentCost: 400,
  },
];

// ============================================================================
// MERCENARY FLEET TEMPLATES
// ============================================================================

const COMMON_SHIP_TYPES = {
  fighter: { type: 'Light Fighter', basePower: 30, role: 'screen' },
  corvette: { type: 'Corvette', basePower: 80, role: 'skirmisher' },
  frigate: { type: 'Frigate', basePower: 150, role: 'escort' },
  destroyer: { type: 'Destroyer', basePower: 250, role: 'anti-ship' },
  cruiser: { type: 'Cruiser', basePower: 400, role: 'capital' },
  heavyCruiser: { type: 'Heavy Cruiser', basePower: 600, role: 'capital' },
  battlecruiser: { type: 'Battlecruiser', basePower: 900, role: 'flagship' },
  carrier: { type: 'Carrier', basePower: 500, role: 'support' },
  dreadnought: { type: 'Dreadnought', basePower: 1200, role: 'doomsday' },
  transport: { type: 'Transport', basePower: 50, role: 'logistics' },
  scout: { type: 'Scout', basePower: 40, role: 'recon' },
  stealth: { type: 'Stealth Ship', basePower: 200, role: 'infiltration' },
  support: { type: 'Support Vessel', basePower: 100, role: 'repair' },
  destroyer_klingon: { type: 'Bird of Prey', basePower: 180, role: 'raider' },
  cruiser_klingon: { type: 'Klingon Cruiser', basePower: 450, role: 'capital' },
  warbird: { type: 'Warbird', basePower: 500, role: 'capital' },
  galor: { type: 'Galor', basePower: 350, role: 'capital' },
  raider_ship: { type: 'Raider', basePower: 120, role: 'raider' },
  berserker: { type: 'Berserker', basePower: 200, role: 'shock' },
  hunter_ship: { type: 'Hunter Ship', basePower: 300, role: 'predator' },
  trade_freighter: { type: 'Trade Freighter', basePower: 60, role: 'logistics' },
  drone: { type: 'Drone', basePower: 45, role: 'swarm' },
  bio_cruiser: { type: 'Bio-Cruiser', basePower: 550, role: 'organic' },
  cube: { type: 'Cube', basePower: 1000, role: 'assimilation' },
  timeship: { type: 'Timeship', basePower: 700, role: 'temporal' },
};

export const MERCENARY_FLEET_TEMPLATES: MercenaryFleetTemplate[] = [
  // EASY FLEETS
  {
    difficulty: 'easy',
    raceId: 'race-krell',
    ships: [
      { ...COMMON_SHIP_TYPES.fighter, count: 6 },
      { ...COMMON_SHIP_TYPES.corvette, count: 3 },
      { ...COMMON_SHIP_TYPES.transport, count: 1 },
    ],
    totalPower: 460,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'easy',
    raceId: 'race-orion',
    ships: [
      { ...COMMON_SHIP_TYPES.raider_ship, count: 4 },
      { ...COMMON_SHIP_TYPES.scout, count: 2 },
      { ...COMMON_SHIP_TYPES.transport, count: 2 },
    ],
    totalPower: 660,
    costMultiplier: 0.9,
  },
  {
    difficulty: 'easy',
    raceId: 'race-terran-federation',
    ships: [
      { ...COMMON_SHIP_TYPES.frigate, count: 3 },
      { ...COMMON_SHIP_TYPES.fighter, count: 4 },
      { ...COMMON_SHIP_TYPES.support, count: 1 },
    ],
    totalPower: 610,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'easy',
    raceId: 'race-klingon',
    ships: [
      { ...COMMON_SHIP_TYPES.destroyer_klingon, count: 3 },
      { ...COMMON_SHIP_TYPES.fighter, count: 4 },
    ],
    totalPower: 660,
    costMultiplier: 0.95,
  },
  {
    difficulty: 'easy',
    raceId: 'race-nausicaan',
    ships: [
      { ...COMMON_SHIP_TYPES.raider_ship, count: 5 },
      { ...COMMON_SHIP_TYPES.berserker, count: 2 },
    ],
    totalPower: 1000,
    costMultiplier: 0.8,
  },

  // MEDIUM FLEETS
  {
    difficulty: 'medium',
    raceId: 'race-krell',
    ships: [
      { ...COMMON_SHIP_TYPES.frigate, count: 4 },
      { ...COMMON_SHIP_TYPES.destroyer, count: 2 },
      { ...COMMON_SHIP_TYPES.cruiser, count: 1 },
      { ...COMMON_SHIP_TYPES.transport, count: 2 },
    ],
    totalPower: 1800,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'medium',
    raceId: 'race-romulan',
    ships: [
      { ...COMMON_SHIP_TYPES.stealth, count: 3 },
      { ...COMMON_SHIP_TYPES.warbird, count: 1 },
      { ...COMMON_SHIP_TYPES.scout, count: 2 },
    ],
    totalPower: 1900,
    costMultiplier: 1.1,
  },
  {
    difficulty: 'medium',
    raceId: 'race-cardassian',
    ships: [
      { ...COMMON_SHIP_TYPES.galor, count: 2 },
      { ...COMMON_SHIP_TYPES.frigate, count: 3 },
      { ...COMMON_SHIP_TYPES.support, count: 1 },
    ],
    totalPower: 1700,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'medium',
    raceId: 'race-gorn',
    ships: [
      { ...COMMON_SHIP_TYPES.heavyCruiser, count: 1 },
      { ...COMMON_SHIP_TYPES.berserker, count: 4 },
      { ...COMMON_SHIP_TYPES.fighter, count: 4 },
    ],
    totalPower: 2120,
    costMultiplier: 0.85,
  },
  {
    difficulty: 'medium',
    raceId: 'race-klingon',
    ships: [
      { ...COMMON_SHIP_TYPES.cruiser_klingon, count: 2 },
      { ...COMMON_SHIP_TYPES.destroyer_klingon, count: 3 },
      { ...COMMON_SHIP_TYPES.fighter, count: 3 },
    ],
    totalPower: 2190,
    costMultiplier: 0.95,
  },
  {
    difficulty: 'medium',
    raceId: 'race-hirogen',
    ships: [
      { ...COMMON_SHIP_TYPES.hunter_ship, count: 2 },
      { ...COMMON_SHIP_TYPES.stealth, count: 2 },
      { ...COMMON_SHIP_TYPES.scout, count: 3 },
    ],
    totalPower: 1480,
    costMultiplier: 1.2,
  },
  {
    difficulty: 'medium',
    raceId: 'race-ferengi',
    ships: [
      { ...COMMON_SHIP_TYPES.trade_freighter, count: 3 },
      { ...COMMON_SHIP_TYPES.corvette, count: 4 },
      { ...COMMON_SHIP_TYPES.scout, count: 2 },
    ],
    totalPower: 1060,
    costMultiplier: 0.7,
  },

  // HARD FLEETS
  {
    difficulty: 'hard',
    raceId: 'race-krell',
    ships: [
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 1 },
      { ...COMMON_SHIP_TYPES.cruiser, count: 2 },
      { ...COMMON_SHIP_TYPES.destroyer, count: 3 },
      { ...COMMON_SHIP_TYPES.frigate, count: 4 },
    ],
    totalPower: 3500,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'hard',
    raceId: 'race-romulan',
    ships: [
      { ...COMMON_SHIP_TYPES.warbird, count: 3 },
      { ...COMMON_SHIP_TYPES.stealth, count: 4 },
      { ...COMMON_SHIP_TYPES.scout, count: 2 },
    ],
    totalPower: 3400,
    costMultiplier: 1.15,
  },
  {
    difficulty: 'hard',
    raceId: 'race-cardassian',
    ships: [
      { ...COMMON_SHIP_TYPES.galor, count: 3 },
      { ...COMMON_SHIP_TYPES.heavyCruiser, count: 1 },
      { ...COMMON_SHIP_TYPES.frigate, count: 4 },
      { ...COMMON_SHIP_TYPES.support, count: 2 },
    ],
    totalPower: 3650,
    costMultiplier: 1.05,
  },
  {
    difficulty: 'hard',
    raceId: 'race-klingon',
    ships: [
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 1 },
      { ...COMMON_SHIP_TYPES.cruiser_klingon, count: 3 },
      { ...COMMON_SHIP_TYPES.destroyer_klingon, count: 3 },
      { ...COMMON_SHIP_TYPES.fighter, count: 4 },
    ],
    totalPower: 3970,
    costMultiplier: 0.95,
  },
  {
    difficulty: 'hard',
    raceId: 'race-gorn',
    ships: [
      { ...COMMON_SHIP_TYPES.heavyCruiser, count: 3 },
      { ...COMMON_SHIP_TYPES.berserker, count: 5 },
      { ...COMMON_SHIP_TYPES.fighter, count: 6 },
    ],
    totalPower: 4100,
    costMultiplier: 0.85,
  },
  {
    difficulty: 'hard',
    raceId: 'race-hirogen',
    ships: [
      { ...COMMON_SHIP_TYPES.hunter_ship, count: 3 },
      { ...COMMON_SHIP_TYPES.stealth, count: 4 },
      { ...COMMON_SHIP_TYPES.carrier, count: 1 },
    ],
    totalPower: 3100,
    costMultiplier: 1.25,
  },
  {
    difficulty: 'hard',
    raceId: 'race-nausicaan',
    ships: [
      { ...COMMON_SHIP_TYPES.berserker, count: 6 },
      { ...COMMON_SHIP_TYPES.raider_ship, count: 6 },
      { ...COMMON_SHIP_TYPES.cruiser, count: 1 },
    ],
    totalPower: 3320,
    costMultiplier: 0.8,
  },

  // EXTREME FLEETS
  {
    difficulty: 'extreme',
    raceId: 'race-krell',
    ships: [
      { ...COMMON_SHIP_TYPES.dreadnought, count: 1 },
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 2 },
      { ...COMMON_SHIP_TYPES.cruiser, count: 3 },
      { ...COMMON_SHIP_TYPES.destroyer, count: 4 },
    ],
    totalPower: 6200,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'extreme',
    raceId: 'race-romulan',
    ships: [
      { ...COMMON_SHIP_TYPES.warbird, count: 5 },
      { ...COMMON_SHIP_TYPES.stealth, count: 6 },
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 1 },
    ],
    totalPower: 6400,
    costMultiplier: 1.2,
  },
  {
    difficulty: 'extreme',
    raceId: 'race-borg',
    ships: [
      { ...COMMON_SHIP_TYPES.cube, count: 2 },
      { ...COMMON_SHIP_TYPES.drone, count: 20 },
    ],
    totalPower: 5900,
    costMultiplier: 1.5,
  },
  {
    difficulty: 'extreme',
    raceId: 'race-klingon',
    ships: [
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 3 },
      { ...COMMON_SHIP_TYPES.cruiser_klingon, count: 4 },
      { ...COMMON_SHIP_TYPES.destroyer_klingon, count: 5 },
    ],
    totalPower: 6820,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'extreme',
    raceId: 'race-hirogen',
    ships: [
      { ...COMMON_SHIP_TYPES.hunter_ship, count: 5 },
      { ...COMMON_SHIP_TYPES.stealth, count: 6 },
      { ...COMMON_SHIP_TYPES.carrier, count: 2 },
    ],
    totalPower: 5100,
    costMultiplier: 1.3,
  },

  // LEGENDARY FLEETS
  {
    difficulty: 'legendary',
    raceId: 'race-krell',
    ships: [
      { ...COMMON_SHIP_TYPES.dreadnought, count: 3 },
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 4 },
      { ...COMMON_SHIP_TYPES.cruiser, count: 5 },
      { ...COMMON_SHIP_TYPES.destroyer, count: 6 },
    ],
    totalPower: 12600,
    costMultiplier: 1.0,
  },
  {
    difficulty: 'legendary',
    raceId: 'race-romulan',
    ships: [
      { ...COMMON_SHIP_TYPES.warbird, count: 8 },
      { ...COMMON_SHIP_TYPES.stealth, count: 10 },
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 3 },
    ],
    totalPower: 13000,
    costMultiplier: 1.3,
  },
  {
    difficulty: 'legendary',
    raceId: 'race-borg',
    ships: [
      { ...COMMON_SHIP_TYPES.cube, count: 5 },
      { ...COMMON_SHIP_TYPES.drone, count: 50 },
    ],
    totalPower: 14500,
    costMultiplier: 1.8,
  },
  {
    difficulty: 'legendary',
    raceId: 'race-species-8472',
    ships: [
      { ...COMMON_SHIP_TYPES.bio_cruiser, count: 8 },
      { ...COMMON_SHIP_TYPES.drone, count: 30 },
    ],
    totalPower: 15400,
    costMultiplier: 2.0,
  },
  {
    difficulty: 'legendary',
    raceId: 'race-voth',
    ships: [
      { ...COMMON_SHIP_TYPES.timeship, count: 4 },
      { ...COMMON_SHIP_TYPES.heavyCruiser, count: 6 },
      { ...COMMON_SHIP_TYPES.battlecruiser, count: 3 },
    ],
    totalPower: 13800,
    costMultiplier: 1.6,
  },
];

// ============================================================================
// REPUTATION SYSTEM
// ============================================================================

export const REPUTATION_CONFIG = {
  /** Reputation points gained per contract difficulty */
  baseReputationGain: {
    easy: 10,
    medium: 25,
    hard: 60,
    extreme: 150,
    legendary: 400,
  },

  /** Reputation lost on contract failure */
  failurePenalty: {
    easy: 5,
    medium: 15,
    hard: 40,
    extreme: 100,
    legendary: 250,
  },

  /** Reputation decay per 10 turns of inactivity */
  decayRate: 2,

  /** Minimum reputation before decay stops */
  decayFloor: 50,

  /** Bonus multiplier for consecutive contract completions */
  streakMultiplier: 0.1,
  maxStreakMultiplier: 0.5,

  /** Reputation required for each rank */
  rankThresholds: {
    Recruit: 0,
    Member: 100,
    Veteran: 500,
    Elite: 1500,
    Legend: 5000,
  },

  /** Benefits unlocked at each rank */
  rankBenefits: {
    Recruit: 'Access to basic contracts. Standard pay rates.',
    Member: 'Priority contract access. +5% pay bonus. Basic guild perks.',
    Veteran: 'Access to hard-difficulty contracts. +12% pay bonus. Discounted fleet hire.',
    Elite: 'Access to extreme-difficulty contracts. +20% pay bonus. Elite fleet compositions.',
    Legend: 'Access to legendary contracts. +35% pay bonus. Unique legendary fleet templates.',
  },

  /** Maximum number of simultaneous active contracts */
  maxActiveContracts: {
    Recruit: 1,
    Member: 2,
    Veteran: 3,
    Elite: 4,
    Legend: 5,
  },

  /** Cooldown turns between contracts of same type */
  contractCooldown: {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 5,
    legendary: 8,
  },
};

// ============================================================================
// CONTRACT TEMPLATES (for generation)
// ============================================================================

const CONTRACT_NAME_PREFIXES: Record<ContractType, string[]> = {
  escort: ['Safe Passage', 'Shield Wall', 'Guardian Angel', 'Convoy Shield', 'Protective custody'],
  raider: ['Strike Force', 'Thunder Strike', 'Lightning Raid', 'Blitz Attack', 'Hammer Blow'],
  defender: ['Fortress Stand', 'Iron Wall', 'Last Bastion', 'Shield of the Sector', 'Defiant Stand'],
  scout: ['Eagle Eye', 'Deep Scan', 'Pathfinder', 'Void Walker', 'Horizon Search'],
  assassin: ['Silent Blade', 'Death Mark', 'Phantom Strike', 'Void Kiss', 'Executioner'],
  smuggler: ['Shadow Run', 'Ghost Route', 'Black Cargo', 'Silent Transit', 'Phantom freight'],
  bodyguard: ['Iron Shield', 'Living Fortress', 'Guardian Prime', 'Protector\'s Oath', 'Sentinel'],
  siege: ['Iron Fist', 'Doomsiege', 'Fortress Breaker', 'Siege Master', 'Battering Ram'],
  recon: ['Silent Observer', 'Deep Intelligence', 'Shadow Network', 'Whisper Protocol', 'Eye in the Sky'],
  salvage: ['Salvage King', 'Wreck Diver', 'Salvage Rights', 'Derelict Hunter', 'Treasure Seeker'],
};

const CONTRACT_RISK_DESCRIPTIONS: Record<ContractType, string[]> = {
  escort: ['Ambush along route', 'Pirate interception', 'Hostile system patrol', 'Drone swarm encounter', 'Weather anomaly'],
  raider: ['Heavy orbital defenses', 'Enemy reinforcements', 'Counter-attack', 'Defensive fleet presence', 'Trap laid'],
  defender: ['Superior enemy numbers', 'Siege weapons', 'Internal sabotage', 'Resource depletion', 'Morale decay'],
  scout: ['Hostile territory', 'Sensor detection', 'Natural hazards', 'Anomalous readings', 'Lost signal'],
  assassin: ['Target bodyguards', 'Security systems', 'Decoy targets', 'Escape routes', 'Retaliation forces'],
  smuggler: ['Customs inspection', 'Pirate rivals', 'Cargo damage', 'Informant betrayal', 'Route compromise'],
  bodyguard: ['Assassination attempt', 'Bomb threat', 'Inside job', 'Overwhelming force', 'Political intrigue'],
  siege: ['Fortress regroup', 'Relief force', 'Turret batteries', 'Trap corridors', 'Underground resistance'],
  recon: ['Surveillance detection', 'Agent capture', 'Data corruption', 'Double agent', 'Signal jamming'],
  salvage: ['Structural collapse', 'Security drones', 'Contaminated cargo', 'Rival salvagers', 'Time limit'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all available contracts for a player based on race, level, and reputation
 */
export function getAvailableContracts(
  raceId: string,
  playerLevel: number,
  guildReputations: Record<string, number>,
): MercenaryContract[] {
  const contracts: MercenaryContract[] = [];

  for (const guild of MERCENARY_GUILDS) {
    const rep = guildReputations[guild.id] || 0;
    const rank = getGuildRank(rep);
    const rankData = guild.rankBonuses[rank];

    for (const contractType of guild.availableContracts) {
      const typeDef = CONTRACT_TYPES[contractType];

      for (const difficulty of typeDef.allowedDifficulties) {
        if (!rankData.exclusiveAccess.includes(difficulty) && rankData.exclusiveAccess.length > 0) {
          if (difficulty === 'hard' || difficulty === 'extreme' || difficulty === 'legendary') {
            continue;
          }
        }

        const contract = generateContract(
          contractType,
          difficulty,
          guild,
          rankData,
          playerLevel,
          rep,
        );
        contracts.push(contract);
      }
    }
  }

  return contracts;
}

/**
 * Generate a specific contract instance
 */
function generateContract(
  type: ContractType,
  difficulty: ContractDifficulty,
  guild: MercenaryGuild,
  rankData: GuildRankBonus,
  playerLevel: number,
  reputation: number,
): MercenaryContract {
  const typeDef = CONTRACT_TYPES[type];
  const prefixes = CONTRACT_NAME_PREFIXES[type];
  const risks = CONTRACT_RISK_DESCRIPTIONS[type];

  const nameIndex = Math.floor(Math.random() * prefixes.length);
  const difficultyMultiplier = getDifficultyMultiplier(difficulty);

  const baseCredits = Math.floor(500 * difficultyMultiplier * (1 + playerLevel * 0.1));
  const credits = Math.floor(baseCredits * (1 + rankData.contractPayBonus));
  const repGain = Math.floor(REPUTATION_CONFIG.baseReputationGain[difficulty] * (1 + rankData.reputationGainBonus));

  const selectedRisks: string[] = [];
  const riskCount = Math.min(3, Math.floor(difficultyMultiplier));
  for (let i = 0; i < riskCount; i++) {
    const riskIndex = (nameIndex + i) % risks.length;
    selectedRisks.push(risks[riskIndex]);
  }

  return {
    id: `contract-${type}-${difficulty}-${guild.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type,
    name: `${prefixes[nameIndex]}`,
    description: typeDef.description,
    guildId: guild.id,
    offeringRaceId: guild.headquartersRaceId,
    difficulty,
    reward: {
      credits,
      reputation: repGain,
      specialReward: difficulty === 'legendary' ? 'legendary_blueprint' : difficulty === 'extreme' ? 'rare_module' : undefined,
    },
    requirements: {
      minLevel: getMinLevelForDifficulty(difficulty),
      minReputation: getMinReputationForDifficulty(difficulty),
      fleetPower: getRequiredFleetPower(difficulty),
      raceRestriction: guild.associatedRaces,
    },
    duration: typeDef.baseDuration + Math.floor(difficultyMultiplier),
    targets: [],
    risks: selectedRisks,
  };
}

/**
 * Calculate the credit cost to hire a mercenary fleet for a contract
 */
export function calculateMercenaryCost(
  contract: MercenaryContract,
  playerLevel: number,
  guildReputation: number = 0,
): number {
  const baseCost = contract.reward.credits * 0.6;
  const difficultyMultiplier = getDifficultyMultiplier(contract.difficulty);
  const levelDiscount = Math.min(0.2, playerLevel * 0.005);
  const repDiscount = Math.min(0.15, guildReputation * 0.0001);

  const guild = MERCENARY_GUILDS.find(g => g.id === contract.guildId);
  const rank = getGuildRank(guildReputation);
  const fleetDiscount = guild ? guild.rankBonuses[rank].fleetDiscount : 0;

  const totalDiscount = Math.min(0.4, levelDiscount + repDiscount + fleetDiscount);
  const cost = Math.floor(baseCost * difficultyMultiplier * (1 - totalDiscount));

  return Math.max(100, cost);
}

/**
 * Get guild rank based on reputation points
 */
export function getGuildRank(reputation: number): GuildRank {
  if (reputation >= REPUTATION_CONFIG.rankThresholds.Legend) return 'Legend';
  if (reputation >= REPUTATION_CONFIG.rankThresholds.Elite) return 'Elite';
  if (reputation >= REPUTATION_CONFIG.rankThresholds.Veteran) return 'Veteran';
  if (reputation >= REPUTATION_CONFIG.rankThresholds.Member) return 'Member';
  return 'Recruit';
}

/**
 * Get mercenary fleet power for a given difficulty and race
 */
export function getMercenaryFleetPower(
  difficulty: ContractDifficulty,
  raceId: string,
): number {
  const template = MERCENARY_FLEET_TEMPLATES.find(
    t => t.difficulty === difficulty && t.raceId === raceId,
  );

  if (template) {
    return template.totalPower;
  }

  const fallbackTemplates = MERCENARY_FLEET_TEMPLATES.filter(t => t.difficulty === difficulty);
  if (fallbackTemplates.length > 0) {
    const avgPower = fallbackTemplates.reduce((sum, t) => sum + t.totalPower, 0) / fallbackTemplates.length;
    return Math.floor(avgPower);
  }

  return getDifficultyMultiplier(difficulty) * 500;
}

/**
 * Get the reputation needed for next rank
 */
export function getReputationToNextRank(currentReputation: number): { nextRank: GuildRank | null; reputationNeeded: number } {
  const currentRank = getGuildRank(currentReputation);

  switch (currentRank) {
    case 'Recruit':
      return { nextRank: 'Member', reputationNeeded: REPUTATION_CONFIG.rankThresholds.Member - currentReputation };
    case 'Member':
      return { nextRank: 'Veteran', reputationNeeded: REPUTATION_CONFIG.rankThresholds.Veteran - currentReputation };
    case 'Veteran':
      return { nextRank: 'Elite', reputationNeeded: REPUTATION_CONFIG.rankThresholds.Elite - currentReputation };
    case 'Elite':
      return { nextRank: 'Legend', reputationNeeded: REPUTATION_CONFIG.rankThresholds.Legend - currentReputation };
    case 'Legend':
      return { nextRank: null, reputationNeeded: 0 };
  }
}

/**
 * Calculate reputation decay for inactive turns
 */
export function calculateReputationDecay(
  currentReputation: number,
  turnsSinceLastContract: number,
): number {
  if (currentReputation <= REPUTATION_CONFIG.decayFloor) return currentReputation;

  const decayTurns = Math.floor(turnsSinceLastContract / 10);
  const totalDecay = decayTurns * REPUTATION_CONFIG.decayRate;

  return Math.max(REPUTATION_CONFIG.decayFloor, currentReputation - totalDecay);
}

/**
 * Calculate streak bonus for consecutive completions
 */
export function calculateStreakBonus(consecutiveCompletions: number): number {
  const bonus = consecutiveCompletions * REPUTATION_CONFIG.streakMultiplier;
  return Math.min(bonus, REPUTATION_CONFIG.maxStreakMultiplier);
}

/**
 * Get max active contracts for a given rank
 */
export function getMaxActiveContracts(rank: GuildRank): number {
  return REPUTATION_CONFIG.maxActiveContracts[rank];
}

/**
 * Get contract cooldown in turns
 */
export function getContractCooldown(difficulty: ContractDifficulty): number {
  return REPUTATION_CONFIG.contractCooldown[difficulty];
}

/**
 * Get difficulty multiplier for scaling rewards/costs
 */
function getDifficultyMultiplier(difficulty: ContractDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1.0;
    case 'medium': return 2.0;
    case 'hard': return 4.0;
    case 'extreme': return 8.0;
    case 'legendary': return 16.0;
  }
}

/**
 * Get minimum player level for difficulty
 */
function getMinLevelForDifficulty(difficulty: ContractDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 5;
    case 'hard': return 12;
    case 'extreme': return 20;
    case 'legendary': return 30;
  }
}

/**
 * Get minimum reputation for difficulty
 */
function getMinReputationForDifficulty(difficulty: ContractDifficulty): number {
  switch (difficulty) {
    case 'easy': return 0;
    case 'medium': return 50;
    case 'hard': return 200;
    case 'extreme': return 800;
    case 'legendary': return 2500;
  }
}

/**
 * Get required fleet power for difficulty
 */
function getRequiredFleetPower(difficulty: ContractDifficulty): number {
  switch (difficulty) {
    case 'easy': return 300;
    case 'medium': return 800;
    case 'hard': return 2000;
    case 'extreme': return 5000;
    case 'legendary': return 10000;
  }
}

/**
 * Get guild by ID
 */
export function getGuildById(guildId: string): MercenaryGuild | undefined {
  return MERCENARY_GUILDS.find(g => g.id === guildId);
}

/**
 * Get all guilds for a specific race
 */
export function getGuildsForRace(raceId: string): MercenaryGuild[] {
  return MERCENARY_GUILDS.filter(
    g => g.headquartersRaceId === raceId || g.associatedRaces.includes(raceId),
  );
}

/**
 * Get fleet template for a specific difficulty and race
 */
export function getFleetTemplate(
  difficulty: ContractDifficulty,
  raceId: string,
): MercenaryFleetTemplate | undefined {
  return MERCENARY_FLEET_TEMPLATES.find(
    t => t.difficulty === difficulty && t.raceId === raceId,
  );
}

/**
 * Calculate total fleet power from a template
 */
export function calculateFleetTemplatePower(template: MercenaryFleetTemplate): number {
  return template.ships.reduce((total, ship) => total + ship.basePower * ship.count, 0);
}

/**
 * Get contract type definition
 */
export function getContractTypeDefinition(type: ContractType): ContractTypeDefinition {
  return CONTRACT_TYPES[type];
}

/**
 * Initialize a new reputation state for a guild
 */
export function createInitialReputationState(guildId: string): MercenaryReputationState {
  return {
    guildId,
    reputation: 0,
    rank: 'Recruit',
    completedContracts: 0,
    failedContracts: 0,
    totalEarnings: 0,
    lastContractTurn: 0,
    activeContracts: [],
  };
}

/**
 * Update reputation state after contract completion
 */
export function processContractCompletion(
  state: MercenaryReputationState,
  contract: MercenaryContract,
  currentTurn: number,
  streak: number,
): MercenaryReputationState {
  const streakBonus = calculateStreakBonus(streak);
  const baseRep = contract.reward.reputation;
  const totalRep = Math.floor(baseRep * (1 + streakBonus));

  const newReputation = state.reputation + totalRep;
  const newRank = getGuildRank(newReputation);

  return {
    ...state,
    reputation: newReputation,
    rank: newRank,
    completedContracts: state.completedContracts + 1,
    totalEarnings: state.totalEarnings + contract.reward.credits,
    lastContractTurn: currentTurn,
    activeContracts: state.activeContracts.filter(id => id !== contract.id),
  };
}

/**
 * Update reputation state after contract failure
 */
export function processContractFailure(
  state: MercenaryReputationState,
  contract: MercenaryContract,
  currentTurn: number,
): MercenaryReputationState {
  const penalty = REPUTATION_CONFIG.failurePenalty[contract.difficulty];
  const newReputation = Math.max(0, state.reputation - penalty);
  const newRank = getGuildRank(newReputation);

  return {
    ...state,
    reputation: newReputation,
    rank: newRank,
    failedContracts: state.failedContracts + 1,
    lastContractTurn: currentTurn,
    activeContracts: state.activeContracts.filter(id => id !== contract.id),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  CONTRACT_TYPES,
  MERCENARY_GUILDS,
  MERCENARY_FLEET_TEMPLATES,
  REPUTATION_CONFIG,
  getAvailableContracts,
  calculateMercenaryCost,
  getGuildRank,
  getMercenaryFleetPower,
  getReputationToNextRank,
  calculateReputationDecay,
  calculateStreakBonus,
  getMaxActiveContracts,
  getContractCooldown,
  getGuildById,
  getGuildsForRace,
  getFleetTemplate,
  calculateFleetTemplatePower,
  getContractTypeDefinition,
  createInitialReputationState,
  processContractCompletion,
  processContractFailure,
};
