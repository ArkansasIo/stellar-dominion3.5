/**
 * COMMANDER GACHA COMMAND NEXUS
 * =============================================================================
 * Premium gacha/banner system for acquiring commanders
 * 
 * Systems:
 *   1. Gacha Banners (Limited, Standard, Class-specific, Faction)
 *   2. Commander Rarity Tiers (1-5 stars)
 *   3. Pity System (Soft & Hard pity)
 *   4. Pull Rates & Probability
 *   5. Commander Shards & Duplicate Conversion
 *   6. Banner Rotation Schedule
 *   7. Premium Currency (Command Seals)
 *   8. Free Pulls & Login Rewards
 *   9. Rate-Up & Guaranteed Mechanics
 *   10. Constellation/Awakening System
 */

import { PrimaryAttribute } from './commanderSkillTreeSystem';

// =============================================================================
// COMMANDER RARITY & TIERS
// =============================================================================

export type CommanderRarity = 1 | 2 | 3 | 4 | 5;

export interface RarityConfig {
  stars: CommanderRarity;
  name: string;
  color: string;
  baseProbability: number; // out of 1.0
  guaranteedPityCount: number; // pulls until guaranteed
  softPityStart: number; // pull count where probability starts increasing
  shardConversionRate: number; // shards received on duplicate
  promotionShardsRequired: number;
}

export const RARITY_TIERS: Record<CommanderRarity, RarityConfig> = {
  1: {
    stars: 1,
    name: 'Common',
    color: '#9d9d9d',
    baseProbability: 0.4000, // 40%
    guaranteedPityCount: 10,
    softPityStart: 8,
    shardConversionRate: 1,
    promotionShardsRequired: 10,
  },
  2: {
    stars: 2,
    name: 'Uncommon',
    color: '#1eff00',
    baseProbability: 0.3500, // 35%
    guaranteedPityCount: 10,
    softPityStart: 8,
    shardConversionRate: 3,
    promotionShardsRequired: 20,
  },
  3: {
    stars: 3,
    name: 'Rare',
    color: '#0070ff',
    baseProbability: 0.1800, // 18%
    guaranteedPityCount: 20,
    softPityStart: 15,
    shardConversionRate: 8,
    promotionShardsRequired: 50,
  },
  4: {
    stars: 4,
    name: 'Epic',
    color: '#a335ee',
    baseProbability: 0.0550, // 5.5%
    guaranteedPityCount: 40,
    softPityStart: 30,
    shardConversionRate: 25,
    promotionShardsRequired: 100,
  },
  5: {
    stars: 5,
    name: 'Legendary',
    color: '#ff8000',
    baseProbability: 0.0150, // 1.5%
    guaranteedPityCount: 90,
    softPityStart: 70,
    shardConversionRate: 50,
    promotionShardsRequired: 200,
  },
};

// =============================================================================
// BANNER TYPES
// =============================================================================

export type BannerType = 
  | 'standard'       // Permanent banner
  | 'limited'        // Time-limited rate-up banner
  | 'class-specific' // Focused on specific class/type
  | 'faction'        // Faction-themed banner
  | 'beginner'       // New player guaranteed banner
  | 'event'          // Seasonal/special event
  | 'rerun'          // Old limited banner rerun
  | 'legendary'      // 5-star only banner
  | 'free'           // Free daily banner
  | 'collaboration'; // Special collaboration

export type BannerCurrency = 
  | 'command-seal'       // Premium currency (purchased)
  | 'free-command-seal'  // Free earned currency
  | 'crystal-shard'      // In-game farmable
  | 'event-token'        // Event-specific
  | 'limited-voucher';   // Limited banner voucher

export interface BannerRateUp {
  commanderId: string;
  rateUpMultiplier: number; // e.g., 50% of 5-star rate goes to this unit
  isGuaranteed: boolean; // First 5-star is guaranteed to be this unit
  guaranteeAtPulls?: number; // If set, guaranteed this unit at specific pull
}

export interface GachaBannerConfig {
  id: string;
  name: string;
  description: string;
  type: BannerType;
  currency: BannerCurrency;
  costPerPull: number;
  costPerMultiPull: number; // usually 10x for discounted price
  multiPullCount: number; // usually 10
  
  // Availability
  startDate: number; // timestamp
  endDate: number; // timestamp
  isPermanent: boolean;
  
  // Rarity rates (can override defaults for special banners)
  rarityRates?: Partial<Record<CommanderRarity, number>>;
  
  // Rate up units
  rateUpUnits: BannerRateUp[];
  featuredUnits: string[]; // display purposes
  
  // Pity System
  pityEnabled: boolean;
  pityTransferToNext: boolean; // does pity carry over to next banner?
  
  // Restrictions
  minPlayerLevel: number;
  maxPullsPerPlayer?: number;
  requiresClearance?: string;
  
  // Free pulls
  freePullInterval?: number; // hours between free pulls
  maxFreePullsPerBanner?: number;
  
  // Visual
  bannerImage: string;
  splashArt: string;
  color: string;
  accentColor: string;
}

// =============================================================================
// BANNER CATALOG
// =============================================================================

export const GACHA_BANNERS: GachaBannerConfig[] = [
  // ---- STANDARD PERMANENT BANNER ----
  {
    id: 'banner-standard',
    name: 'Celestial Command Nexus',
    description: 'Standard banner featuring all available commanders. Build your command roster.',
    type: 'standard',
    currency: 'command-seal',
    costPerPull: 150,
    costPerMultiPull: 1350, // 10% discount
    multiPullCount: 10,
    startDate: 0,
    endDate: 0,
    isPermanent: true,
    rateUpUnits: [],
    featuredUnits: [],
    pityEnabled: true,
    pityTransferToNext: false,
    minPlayerLevel: 1,
    bannerImage: '/banners/standard.jpg',
    splashArt: '/splash/command-nexus.jpg',
    color: '#1a1a2e',
    accentColor: '#e94560',
  },

  // ---- BEGINNER BANNER ----
  {
    id: 'banner-beginner',
    name: 'First Command - Beginner Guarantee',
    description: 'GUARANTEED: First 10-pull guarantees at least one 4-star commander. First 5-star within 50 pulls. One-time only.',
    type: 'beginner',
    currency: 'command-seal',
    costPerPull: 100,
    costPerMultiPull: 900,
    multiPullCount: 10,
    startDate: 0,
    endDate: 0,
    isPermanent: true,
    rateUpUnits: [
      { commanderId: 'cmd-fleet-admiral-001', rateUpMultiplier: 0.5, isGuaranteed: false },
    ],
    featuredUnits: ['cmd-fleet-admiral-001', 'cmd-combat-strategist-003', 'cmd-exploration-specialist-005'],
    pityEnabled: true,
    pityTransferToNext: false,
    minPlayerLevel: 1,
    maxPullsPerPlayer: 50,
    bannerImage: '/banners/beginner.jpg',
    splashArt: '/splash/rookie-command.jpg',
    color: '#0f3460',
    accentColor: '#00b4d8',
  },

  // ---- LIMITED RATE-UP BANNER ----
  {
    id: 'banner-limited-void-lord',
    name: 'Void Lord Ascension',
    description: 'RATE UP: Legendary commander "Void Lord Zarvox" rate increased! First 5-star guaranteed to be the featured commander within 90 pulls.',
    type: 'limited',
    currency: 'command-seal',
    costPerPull: 150,
    costPerMultiPull: 1350,
    multiPullCount: 10,
    startDate: 1700000000,
    endDate: 1702592000,
    isPermanent: false,
    rarityRates: {
      5: 0.0150,
      4: 0.0600,
      3: 0.2000,
      2: 0.3500,
      1: 0.3750,
    },
    rateUpUnits: [
      { commanderId: 'cmd-void-lord-zarvox', rateUpMultiplier: 0.5, isGuaranteed: true, guaranteeAtPulls: 90 },
      { commanderId: 'cmd-shadow-commander-042', rateUpMultiplier: 0.3, isGuaranteed: false },
    ],
    featuredUnits: ['cmd-void-lord-zarvox', 'cmd-shadow-commander-042', 'cmd-necrosis-dread-099'],
    pityEnabled: true,
    pityTransferToNext: true,
    minPlayerLevel: 5,
    bannerImage: '/banners/void-lord.jpg',
    splashArt: '/splash/zarvox-ascension.jpg',
    color: '#1a0033',
    accentColor: '#9b59b6',
    freePullInterval: 48,
    maxFreePullsPerBanner: 3,
  },

  // ---- CLASS-SPECIFIC BANNER ----
  {
    id: 'banner-class-warp-tech',
    name: 'Warp Tech & Science Command',
    description: 'CLASS FOCUS: Increased rates for Science, Engineering, and Navigation-class commanders.',
    type: 'class-specific',
    currency: 'command-seal',
    costPerPull: 150,
    costPerMultiPull: 1350,
    multiPullCount: 10,
    startDate: 1702592000,
    endDate: 1705184000,
    isPermanent: false,
    rateUpUnits: [
      { commanderId: 'cmd-chief-scientist-023', rateUpMultiplier: 0.3, isGuaranteed: false },
      { commanderId: 'cmd-navigation-genius-067', rateUpMultiplier: 0.3, isGuaranteed: false },
    ],
    featuredUnits: ['cmd-chief-scientist-023', 'cmd-navigation-genius-067', 'cmd-warp-engineer-088'],
    pityEnabled: true,
    pityTransferToNext: true,
    minPlayerLevel: 10,
    bannerImage: '/banners/warp-tech.jpg',
    splashArt: '/splash/warp-science.jpg',
    color: '#002b36',
    accentColor: '#2aa198',
  },

  // ---- FACTION BANNER ----
  {
    id: 'banner-faction-shadow-syndicate',
    name: 'Shadow Syndicate Operations',
    description: 'FACTION BANNER: Shadow Syndicate faction commanders rate up! Black market and espionage specialists.',
    type: 'faction',
    currency: 'command-seal',
    costPerPull: 150,
    costPerMultiPull: 1350,
    multiPullCount: 10,
    startDate: 1705184000,
    endDate: 1707776000,
    isPermanent: false,
    rateUpUnits: [
      { commanderId: 'cmd-spymaster-fox-051', rateUpMultiplier: 0.4, isGuaranteed: true, guaranteeAtPulls: 90 },
    ],
    featuredUnits: ['cmd-spymaster-fox-051', 'cmd-smuggler-queen-033', 'cmd-infiltration-agent-077'],
    pityEnabled: true,
    pityTransferToNext: true,
    minPlayerLevel: 15,
    bannerImage: '/banners/shadow-syndicate.jpg',
    splashArt: '/splash/shadow-ops.jpg',
    color: '#1c1c1c',
    accentColor: '#e74c3c',
  },

  // ---- LEGENDARY ONLY BANNER ----
  {
    id: 'banner-legendary-arsenal',
    name: 'Legendary Arsenal',
    description: '5-STAR ONLY: All pulls guarantee 4-star or higher. 5-star rate doubled. Premium currency required.',
    type: 'legendary',
    currency: 'command-seal',
    costPerPull: 300,
    costPerMultiPull: 2700,
    multiPullCount: 10,
    startDate: 1707776000,
    endDate: 1710368000,
    isPermanent: false,
    rarityRates: {
      5: 0.0300, // doubled
      4: 0.3500,
      3: 0.3700,
      2: 0.2000,
      1: 0.0500,
    },
    rateUpUnits: [],
    featuredUnits: [],
    pityEnabled: true,
    pityTransferToNext: false,
    minPlayerLevel: 20,
    maxPullsPerPlayer: 200,
    bannerImage: '/banners/legendary-arsenal.jpg',
    splashArt: '/splash/legendary.jpg',
    color: '#2c1810',
    accentColor: '#ffd700',
  },

  // ---- FREE DAILY BANNER ----
  {
    id: 'banner-free-daily',
    name: 'Daily Recruit',
    description: 'FREE: One free pull every 24 hours. Cannot use premium currency. Standard rates apply.',
    type: 'free',
    currency: 'free-command-seal',
    costPerPull: 0,
    costPerMultiPull: 0,
    multiPullCount: 1,
    startDate: 0,
    endDate: 0,
    isPermanent: true,
    rateUpUnits: [],
    featuredUnits: [],
    pityEnabled: false,
    pityTransferToNext: false,
    minPlayerLevel: 1,
    maxFreePullsPerBanner: 1,
    freePullInterval: 24,
    bannerImage: '/banners/daily-recruit.jpg',
    splashArt: '/splash/daily.jpg',
    color: '#2d3436',
    accentColor: '#dfe6e9',
  },

  // ---- EVENT BANNER (Halloween Special) ----
  {
    id: 'banner-event-halloween',
    name: 'Necrosis Command - Hallow\'s Eve',
    description: 'EVENT: Limited Halloween commanders! Spectral and necrotic specialists rate up. Event tokens can be earned in-game.',
    type: 'event',
    currency: 'event-token',
    costPerPull: 200,
    costPerMultiPull: 1800,
    multiPullCount: 10,
    startDate: 1700000000,
    endDate: 1700697600,
    isPermanent: false,
    rateUpUnits: [
      { commanderId: 'cmd-necrosis-dread-099', rateUpMultiplier: 0.5, isGuaranteed: true, guaranteeAtPulls: 90 },
      { commanderId: 'cmd-ghost-captain-021', rateUpMultiplier: 0.4, isGuaranteed: false },
    ],
    featuredUnits: ['cmd-necrosis-dread-099', 'cmd-ghost-captain-021', 'cmd-soul-reaper-055'],
    pityEnabled: true,
    pityTransferToNext: false, // event banners don't transfer
    minPlayerLevel: 10,
    bannerImage: '/banners/halloween.jpg',
    splashArt: '/splash/necrosis.jpg',
    color: '#0d0d0d',
    accentColor: '#ff6b6b',
    freePullInterval: 24,
    maxFreePullsPerBanner: 7,
  },
];

// =============================================================================
// COMMANDER GACHA DEFINITIONS
// =============================================================================

export type CommanderClassType = 
  | 'fleet-admiral' | 'combat-strategist' | 'tactical-genius' | 'logistics-master'
  | 'exploration-specialist' | 'scientific-prodigy' | 'engineering-savant'
  | 'shielding-specialist' | 'weapons-expert' | 'navigation-pilot'
  | 'drone-commander' | 'electronic-warfare' | 'mining-director'
  | 'trade-baron' | 'diplomat' | 'intel-agent' | 'smuggler'
  | 'corp-executive' | 'faction-agent' | 'ancient-being';

export type CommanderFaction = 
  | 'terran-federation' | 'zyx-collective' | 'void-corsairs' 
  | 'merchant-guilds' | 'ancient-order' | 'shadow-syndicate'
  | 'iron-dominion' | 'free-alliance' | 'star-forgers'
  | 'eternal-watchers' | 'renegade' | 'unaligned';

export interface GachaCommanderConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  lore: string;
  
  // Rarity & Class
  rarity: CommanderRarity;
  classType: CommanderClassType;
  faction: CommanderFaction;
  
  // Base Stats (scale with level/awakening)
  baseAttributes: Partial<Record<PrimaryAttribute, number>>;
  basePowerRating: number;
  
  // Abilities (unlocked at different awakening levels)
  passiveAbility: string;
  passiveDescription: string;
  activeAbility: string;
  activeDescription: string;
  ultimateAbility: string;
  ultimateDescription: string;
  
  // Synergy
  synergyFaction: CommanderFaction[];
  synergyClass: CommanderClassType[];
  auraEffect: string;
  
  // Progression
  maxAwakening: number; // 0-6 (base + 6 constellation levels)
  shardsForAwakening: number[]; // shards needed per awakening level
  
  // Acquisition
  isLimited: boolean;
  limitedBannerIds: string[];
  isBeginnerPack: boolean;
  isShopExclusive: boolean;
  
  // Visual
  portrait: string;
  fullArt: string;
  color: string;
  element: 'fire' | 'water' | 'lightning' | 'shadow' | 'light' | 'void' | 'earth' | 'ice';
  
  // Quote
  quote: string;
  voiceActor?: string;
}

// =============================================================================
// COMMANDER CATALOG (Sample pool of gacha commanders)
// =============================================================================

export const GACHA_COMMANDERS: GachaCommanderConfig[] = [
  // ===========================================================================
  // 5-STAR LEGENDARY COMMANDERS
  // ===========================================================================
  {
    id: 'cmd-void-lord-zarvox',
    name: 'Zarvox',
    title: 'The Void Lord',
    description: 'Ancient being from beyond known space. Commands reality-warping void energies.',
    lore: 'Zarvox emerged from the void rifts eons ago, a being of immense power who has witnessed the rise and fall of countless civilizations. He now seeks worthy commanders to mentor... or consume.',
    rarity: 5,
    classType: 'ancient-being',
    faction: 'ancient-order',
    baseAttributes: { intelligence: 30, perception: 25, willpower: 35, memory: 20, charisma: 15 },
    basePowerRating: 9500,
    passiveAbility: 'Void Resonance',
    passiveDescription: 'All void-type damage increased by 30%. Nearby enemies take 5% increased damage from all sources.',
    activeAbility: 'Reality Tear',
    activeDescription: 'Tears open a void rift dealing 500% damage to target and reducing its resistances by 20% for 10 seconds.',
    ultimateAbility: 'Oblivion\'s Call',
    ultimateDescription: 'Obliterates a target with less than 30% HP instantly. Cannot miss. 120 second cooldown.',
    synergyFaction: ['ancient-order', 'shadow-syndicate', 'eternal-watchers'],
    synergyClass: ['ancient-being', 'tactical-genius', 'electronic-warfare'],
    auraEffect: 'Void Aura - Reduces all enemy damage by 8%',
    maxAwakening: 6,
    shardsForAwakening: [0, 50, 100, 200, 350, 500, 750],
    isLimited: true,
    limitedBannerIds: ['banner-limited-void-lord'],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/zarvox.png',
    fullArt: '/art/zarvox-full.png',
    color: '#9b59b6',
    element: 'void',
    quote: 'You see the void as emptiness. I see it as infinite possibility.',
  },
  {
    id: 'cmd-fleet-admiral-001',
    name: 'Admiral Valerius',
    title: 'Fleet Admiral of the Federation',
    description: 'Master strategist and commander of the largest fleet in known space.',
    lore: 'Valerius rose through the ranks of the Terran Federation Navy through sheer tactical brilliance. He has never lost a fleet engagement and commands absolute loyalty from his officers.',
    rarity: 5,
    classType: 'fleet-admiral',
    faction: 'terran-federation',
    baseAttributes: { intelligence: 20, perception: 30, willpower: 25, memory: 15, charisma: 35 },
    basePowerRating: 8800,
    passiveAbility: 'Fleet Coordination',
    passiveDescription: 'All allied ships gain 15% increased fire rate. +2 max fleet size.',
    activeAbility: 'Tactical Override',
    activeDescription: 'Issues a fleet-wide command, resetting all allied weapon cooldowns and granting 20% damage for 8 seconds.',
    ultimateAbility: 'Grand Fleet Assault',
    ultimateDescription: 'Calls in an orbital strike dealing 800% damage across a wide area. Sickles marked targets for 50% additional damage.',
    synergyFaction: ['terran-federation', 'free-alliance', 'iron-dominion'],
    synergyClass: ['fleet-admiral', 'tactical-genius', 'combat-strategist'],
    auraEffect: 'Command Aura - +10% Fleet Damage, +5% Fleet Defense',
    maxAwakening: 6,
    shardsForAwakening: [0, 50, 100, 200, 350, 500, 750],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: true,
    isShopExclusive: false,
    portrait: '/portraits/valerius.png',
    fullArt: '/art/valerius-full.png',
    color: '#007bff',
    element: 'light',
    quote: 'A fleet is only as strong as its commander. And I have never been stronger.',
  },
  {
    id: 'cmd-necrosis-dread-099',
    name: 'Dread Commander Morvath',
    title: 'The Necrosis Lord',
    description: 'Undead commander commanding legions of spectral warships.',
    lore: 'Morvath was once a proud admiral, betrayed and left to die in a nebula. He emerged changed, commanding a ghost fleet that exists between life and death.',
    rarity: 5,
    classType: 'fleet-admiral',
    faction: 'void-corsairs',
    baseAttributes: { intelligence: 25, perception: 20, willpower: 30, memory: 15, charisma: 25 },
    basePowerRating: 9000,
    passiveAbility: 'Ghost Fleet',
    passiveDescription: 'Destroyed allied ships have a 20% chance to return as spectral vessels for 30 seconds.',
    activeAbility: 'Drain Life',
    activeDescription: 'Drains 15% of target\'s current HP, healing the lowest HP allied ship by the same amount.',
    ultimateAbility: 'Necrosis Wave',
    ultimateDescription: 'Sends out a wave of necrotic energy dealing 600% damage to all enemies and reviving one destroyed allied ship with 50% HP.',
    synergyFaction: ['void-corsairs', 'shadow-syndicate'],
    synergyClass: ['fleet-admiral', 'tactical-genius'],
    auraEffect: 'Dread Aura - Enemies have -10% healing received',
    maxAwakening: 6,
    shardsForAwakening: [0, 50, 100, 200, 350, 500, 750],
    isLimited: true,
    limitedBannerIds: ['banner-event-halloween'],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/morvath.png',
    fullArt: '/art/morvath-full.png',
    color: '#2d3436',
    element: 'shadow',
    quote: 'Death is not the end. It is merely a change of command.',
  },
  {
    id: 'cmd-spymaster-fox-051',
    name: 'Fox',
    title: 'The Shadow Spymaster',
    description: 'Elusive intelligence operative. Knows everything about everyone.',
    lore: 'No one knows Fox\'s true name or origin. She operates from the shadows, her network of agents spanning every faction. Information is her currency, and she is the richest being in the galaxy.',
    rarity: 5,
    classType: 'intel-agent',
    faction: 'shadow-syndicate',
    baseAttributes: { intelligence: 35, perception: 30, willpower: 20, memory: 25, charisma: 30 },
    basePowerRating: 8500,
    passiveAbility: 'Intelligence Network',
    passiveDescription: 'Reveals all enemy fleet compositions before battle. +20% critical rate against revealed targets.',
    activeAbility: 'Target Disruption',
    activeDescription: 'Disrupts enemy command, reducing target accuracy by 40% and dealing 200% damage.',
    ultimateAbility: 'Classified Strike',
    ultimateDescription: 'Call in an assassination strike on the enemy commander, dealing 1000% damage if target is below 50% HP.',
    synergyFaction: ['shadow-syndicate', 'merchant-guilds', 'renegade'],
    synergyClass: ['intel-agent', 'smuggler', 'electronic-warfare'],
    auraEffect: 'Shadow Aura - +15% Critical Damage for all allies',
    maxAwakening: 6,
    shardsForAwakening: [0, 50, 100, 200, 350, 500, 750],
    isLimited: true,
    limitedBannerIds: ['banner-faction-shadow-syndicate'],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/fox.png',
    fullArt: '/art/fox-full.png',
    color: '#e74c3c',
    element: 'shadow',
    quote: 'I know where you live. I know what you had for breakfast. And I know your darkest secret. Shall we negotiate?',
  },
  {
    id: 'cmd-ancient-watcher-001',
    name: 'The First Watcher',
    title: 'Eternal Guardian',
    description: 'One of the original Eternal Watchers, creators of the galactic balance.',
    lore: 'The First Watcher has observed the galaxy for millennia, intervening only when cosmic balance is threatened. Now a new threat has awakened them from their long meditation.',
    rarity: 5,
    classType: 'ancient-being',
    faction: 'eternal-watchers',
    baseAttributes: { intelligence: 40, perception: 35, willpower: 40, memory: 30, charisma: 20 },
    basePowerRating: 10000,
    passiveAbility: 'Eternal Vigil',
    passiveDescription: 'Cannot be critically hit. Reduces all incoming damage by 15%.',
    activeAbility: 'Balance Restored',
    activeDescription: 'Heals all allied ships for 25% of their max HP and removes all debuffs.',
    ultimateAbility: 'Judgment of Ages',
    ultimateDescription: 'Deals 700% damage to all enemies. If any enemy has dealt damage to allies this battle, deals an additional 300% true damage.',
    synergyFaction: ['eternal-watchers', 'ancient-order', 'terran-federation'],
    synergyClass: ['ancient-being', 'fleet-admiral', 'logistics-master'],
    auraEffect: 'Guardian Aura - +20% All Resistances',
    maxAwakening: 6,
    shardsForAwakening: [0, 50, 100, 200, 350, 500, 750],
    isLimited: true,
    limitedBannerIds: ['banner-limited-void-lord'], // alternate rate-up
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/first-watcher.png',
    fullArt: '/art/first-watcher-full.png',
    color: '#00b894',
    element: 'light',
    quote: 'I have watched a thousand civilizations rise and fall. Yours is... interesting.',
  },

  // ===========================================================================
  // 4-STAR EPIC COMMANDERS
  // ===========================================================================
  {
    id: 'cmd-combat-strategist-003',
    name: 'Commander Rhea',
    title: 'Combat Strategist',
    description: 'Brilliant tactical commander specializing in fleet formations and combat optimization.',
    lore: 'Rhea graduated top of her class at the Imperial War College. Her tactical innovations have been adopted as standard doctrine across multiple fleets.',
    rarity: 4,
    classType: 'combat-strategist',
    faction: 'terran-federation',
    baseAttributes: { intelligence: 22, perception: 27, willpower: 18, memory: 14, charisma: 16 },
    basePowerRating: 6200,
    passiveAbility: 'Tactical Insight',
    passiveDescription: 'Allied ships gain 10% increased critical chance. +1 fleet coordination.',
    activeAbility: 'Formation Shift',
    activeDescription: 'Instantly repositions fleet, granting 30% evasion for 5 seconds.',
    ultimateAbility: 'Alpha Strike',
    ultimateDescription: 'Coordinates a devastating opening salvo dealing 400% damage to all enemies.',
    synergyFaction: ['terran-federation', 'free-alliance', 'iron-dominion'],
    synergyClass: ['combat-strategist', 'fleet-admiral', 'tactical-genius'],
    auraEffect: 'Tactical Aura - +8% Fleet Accuracy',
    maxAwakening: 6,
    shardsForAwakening: [0, 30, 60, 120, 200, 300, 500],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/rhea.png',
    fullArt: '/art/rhea-full.png',
    color: '#0984e3',
    element: 'lightning',
    quote: 'Victory favors not the strongest, but the most prepared.',
  },
  {
    id: 'cmd-chief-scientist-023',
    name: 'Dr. Aris Thorne',
    title: 'Chief Science Officer',
    description: 'Leading researcher in quantum physics and ancient technology analysis.',
    lore: 'Dr. Thorne\'s breakthroughs in quantum entanglement communication revolutionized interstellar coordination. She now seeks to unlock the secrets of precursor technology.',
    rarity: 4,
    classType: 'scientific-prodigy',
    faction: 'free-alliance',
    baseAttributes: { intelligence: 35, perception: 18, willpower: 12, memory: 28, charisma: 10 },
    basePowerRating: 5800,
    passiveAbility: 'Research Initiative',
    passiveDescription: '+30% research speed for the empire. +10% datacore production.',
    activeAbility: 'Quantum Analysis',
    activeDescription: 'Analyzes target, revealing all weaknesses. Target takes 25% increased damage for 10 seconds.',
    ultimateAbility: 'Experimental Weapon',
    ultimateDescription: 'Deploys experimental quantum weapon dealing 500% damage and applying random status effect.',
    synergyFaction: ['free-alliance', 'star-forgers', 'ancient-order'],
    synergyClass: ['scientific-prodigy', 'engineering-savant', 'exploration-specialist'],
    auraEffect: 'Science Aura - +15% Research Speed',
    maxAwakening: 6,
    shardsForAwakening: [0, 30, 60, 120, 200, 300, 500],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/thorne.png',
    fullArt: '/art/thorne-full.png',
    color: '#00cec9',
    element: 'lightning',
    quote: 'The universe is a puzzle. I intend to solve it.',
  },
  {
    id: 'cmd-smuggler-queen-033',
    name: 'Mira Blackmaw',
    title: 'Smuggler Queen',
    description: 'Queen of the galactic black market. Nothing is beyond her reach.',
    lore: 'Mira inherited the Blackmaw smuggling empire after her father\'s mysterious disappearance. She expanded it tenfold, controlling black market trade across three quadrants.',
    rarity: 4,
    classType: 'smuggler',
    faction: 'void-corsairs',
    baseAttributes: { intelligence: 20, perception: 25, willpower: 22, memory: 15, charisma: 28 },
    basePowerRating: 6000,
    passiveAbility: 'Black Market Connections',
    passiveDescription: '+50% profit from black market trades. -30% contraband detection chance.',
    activeAbility: 'Quick Draw',
    activeDescription: 'Fires a concealed weapon dealing 300% damage. Cannot be dodged.',
    ultimateAbility: 'Call in Favors',
    ultimateDescription: 'Calls in smuggler allies who bombard the target area, dealing 400% damage and applying slow.',
    synergyFaction: ['void-corsairs', 'shadow-syndicate', 'merchant-guilds'],
    synergyClass: ['smuggler', 'intel-agent', 'trade-baron'],
    auraEffect: 'Profit Aura - +10% All Credit Gains',
    maxAwakening: 6,
    shardsForAwakening: [0, 30, 60, 120, 200, 300, 500],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/mira.png',
    fullArt: '/art/mira-full.png',
    color: '#e17055',
    element: 'fire',
    quote: 'Everything has a price. The trick is knowing what you\'re willing to pay.',
  },
  {
    id: 'cmd-navigation-genius-067',
    name: 'Captain Zara Kael',
    title: 'Navigation Genius',
    description: 'Legendary pilot who navigates through impossible star systems.',
    lore: 'Zara can pilot through asteroid fields blindfolded and navigate nebulas that would destroy lesser ships. Her warp calculations are legendary.',
    rarity: 4,
    classType: 'navigation-pilot',
    faction: 'free-alliance',
    baseAttributes: { perception: 32, intelligence: 18, willpower: 15, memory: 22, charisma: 14 },
    basePowerRating: 5900,
    passiveAbility: 'Perfect Navigation',
    passiveDescription: '+25% fleet speed outside combat. -20% warp fuel costs.',
    activeAbility: 'Evasive Maneuvers',
    activeDescription: 'Fleet gains 60% dodge chance for 4 seconds.',
    ultimateAbility: 'Micro Warp Jump',
    ultimateDescription: 'Fleet instantly jumps to a new position, avoiding all incoming damage and dealing 200% damage to enemies at destination.',
    synergyFaction: ['free-alliance', 'star-forgers', 'terran-federation'],
    synergyClass: ['navigation-pilot', 'exploration-specialist', 'logistics-master'],
    auraEffect: 'Speed Aura - +15% Fleet Speed',
    maxAwakening: 6,
    shardsForAwakening: [0, 30, 60, 120, 200, 300, 500],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/zara.png',
    fullArt: '/art/zara-full.png',
    color: '#55efc4',
    element: 'water',
    quote: 'Never go where the path leads. Go where there is no path and leave a trail.',
  },
  {
    id: 'cmd-shadow-commander-042',
    name: 'Commander Nox',
    title: 'Shadow Commander',
    description: 'Stealth operative commander. Strikes from the shadows with deadly precision.',
    lore: 'Nox was trained in the shadow academies of the Syndicate. He commands from the darkness, his fleets appearing where least expected.',
    rarity: 4,
    classType: 'tactical-genius',
    faction: 'shadow-syndicate',
    baseAttributes: { perception: 28, intelligence: 24, willpower: 20, memory: 12, charisma: 18 },
    basePowerRating: 6300,
    passiveAbility: 'Shadow Ambush',
    passiveDescription: 'First attack from each ship deals 50% additional damage. Ships have +15% critical rate.',
    activeAbility: 'Smoke Screen',
    activeDescription: 'Deploys smoke screen, reducing enemy accuracy by 50% for 6 seconds.',
    ultimateAbility: 'Death from Above',
    ultimateDescription: 'Stealth bombers strike from cloak, dealing 600% damage to the backline.',
    synergyFaction: ['shadow-syndicate', 'void-corsairs', 'renegade'],
    synergyClass: ['tactical-genius', 'intel-agent', 'combat-strategist'],
    auraEffect: 'Stealth Aura - +10% First Strike Damage',
    maxAwakening: 6,
    shardsForAwakening: [0, 30, 60, 120, 200, 300, 500],
    isLimited: true,
    limitedBannerIds: ['banner-limited-void-lord', 'banner-faction-shadow-syndicate'],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/nox.png',
    fullArt: '/art/nox-full.png',
    color: '#2d3436',
    element: 'shadow',
    quote: 'They never see me coming. That is the point.',
  },

  // ===========================================================================
  // 3-STAR RARE COMMANDERS
  // ===========================================================================
  {
    id: 'cmd-exploration-specialist-005',
    name: 'Scout Commander Lyra',
    title: 'Exploration Specialist',
    description: 'Expert scout and survey commander. Maps uncharted territories.',
    lore: 'Lyra has discovered more star systems than anyone alive. Her detailed surveys have enabled colonization of hundreds of worlds.',
    rarity: 3,
    classType: 'exploration-specialist',
    faction: 'terran-federation',
    baseAttributes: { perception: 25, intelligence: 18, willpower: 12, memory: 20, charisma: 10 },
    basePowerRating: 3800,
    passiveAbility: 'System Survey',
    passiveDescription: '+50% exploration rewards. Reveals hidden resources in surveyed systems.',
    activeAbility: 'Scan Burst',
    activeDescription: 'Reveals all hidden enemies and resources in a wide area.',
    ultimateAbility: 'Emergency Beacon',
    ultimateDescription: 'Calls in support fleet dealing 300% damage and revealing the map.',
    synergyFaction: ['terran-federation', 'free-alliance', 'merchant-guilds'],
    synergyClass: ['exploration-specialist', 'navigation-pilot', 'scientific-prodigy'],
    auraEffect: 'Discovery Aura - +20% Scan Range',
    maxAwakening: 6,
    shardsForAwakening: [0, 20, 40, 80, 140, 220, 350],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/lyra.png',
    fullArt: '/art/lyra-full.png',
    color: '#00b894',
    element: 'earth',
    quote: 'There is always more to discover. The universe is infinite.',
  },
  {
    id: 'cmd-engineering-savant-088',
    name: 'Chief Engineer Voss',
    title: 'Engineering Savant',
    description: 'Master engineer who can keep any ship running under any conditions.',
    lore: 'Voss can repair a warp drive with spare parts and duct tape. His efficiency innovations have saved billions in maintenance costs.',
    rarity: 3,
    classType: 'engineering-savant',
    faction: 'star-forgers',
    baseAttributes: { intelligence: 28, memory: 22, perception: 10, willpower: 14, charisma: 8 },
    basePowerRating: 3600,
    passiveAbility: 'Field Repairs',
    passiveDescription: 'Allied ships regenerate 2% HP per second out of combat. Repair costs reduced by 30%.',
    activeAbility: 'Emergency Repair',
    activeDescription: 'Repairs 30% of target ship\'s HP instantly.',
    ultimateAbility: 'Overdrive',
    ultimateDescription: 'Overcharges all allied ship systems, granting +40% damage and +30% speed for 8 seconds, then 20% HP cost.',
    synergyFaction: ['star-forgers', 'terran-federation', 'iron-dominion'],
    synergyClass: ['engineering-savant', 'logistics-master', 'scientific-prodigy'],
    auraEffect: 'Repair Aura - +1% HP Regen per Second',
    maxAwakening: 6,
    shardsForAwakening: [0, 20, 40, 80, 140, 220, 350],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/voss.png',
    fullArt: '/art/voss-full.png',
    color: '#fab1a0',
    element: 'fire',
    quote: 'If it\'s broken, I can fix it. If it\'s not broken, I can make it better.',
  },
  {
    id: 'cmd-trade-baron-012',
    name: 'Baron Vorr',
    title: 'Trade Baron',
    description: 'Financial genius controlling major trade routes.',
    lore: 'Baron Vorr turned a single cargo ship into a trading empire. His economic strategies fuel the expansion of allied factions.',
    rarity: 3,
    classType: 'trade-baron',
    faction: 'merchant-guilds',
    baseAttributes: { charisma: 30, intelligence: 22, memory: 18, perception: 10, willpower: 12 },
    basePowerRating: 3400,
    passiveAbility: 'Trade Optimization',
    passiveDescription: '+25% trade route profit. -15% market taxes.',
    activeAbility: 'Bribe',
    activeDescription: 'Bribes target enemy, reducing their damage by 30% for 8 seconds.',
    ultimateAbility: 'Economic Sanctions',
    ultimateDescription: 'Applies sanctions to target faction, reducing their resource income by 40% for 30 seconds.',
    synergyFaction: ['merchant-guilds', 'terran-federation', 'free-alliance'],
    synergyClass: ['trade-baron', 'diplomat', 'logistics-master'],
    auraEffect: 'Wealth Aura - +15% Resource Production',
    maxAwakening: 6,
    shardsForAwakening: [0, 20, 40, 80, 140, 220, 350],
    isLimited: false,
    limitedBannerIds: [],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/vorr.png',
    fullArt: '/art/vorr-full.png',
    color: '#fdcb6e',
    element: 'earth',
    quote: 'Money makes the galaxy go round. And I control the money.',
  },
  {
    id: 'cmd-ghost-captain-021',
    name: 'Captain Spectre',
    title: 'The Ghost Captain',
    description: 'Mysterious spectral commander of a phantom ship.',
    lore: 'Captain Spectre\'s origins are unknown. His ship appears on no registry, yet he has helped countless commanders in their darkest moments.',
    rarity: 3,
    classType: 'navigation-pilot',
    faction: 'renegade',
    baseAttributes: { perception: 24, willpower: 22, intelligence: 16, memory: 12, charisma: 14 },
    basePowerRating: 3700,
    passiveAbility: 'Phantom Presence',
    passiveDescription: 'Ship has 20% chance to dodge any attack. Cannot be locked onto for first 3 seconds of combat.',
    activeAbility: 'Phase Shift',
    activeDescription: 'Becomes intangible for 3 seconds, avoiding all damage and passing through enemies.',
    ultimateAbility: 'From the Beyond',
    ultimateDescription: 'Calls spectral allies from the void, dealing 350% damage and terrifying enemies.',
    synergyFaction: ['renegade', 'void-corsairs', 'shadow-syndicate'],
    synergyClass: ['navigation-pilot', 'intel-agent', 'electronic-warfare'],
    auraEffect: 'Ghost Aura - +10% Dodge Chance',
    maxAwakening: 6,
    shardsForAwakening: [0, 20, 40, 80, 140, 220, 350],
    isLimited: true,
    limitedBannerIds: ['banner-event-halloween'],
    isBeginnerPack: false,
    isShopExclusive: false,
    portrait: '/portraits/spectre.png',
    fullArt: '/art/spectre-full.png',
    color: '#636e72',
    element: 'shadow',
    quote: 'I am already dead. What do I have to fear?',
  },
];

// =============================================================================
// GACHA PULL FUNCTIONS
// =============================================================================

export interface PullResult {
  commanders: GachaCommanderConfig[];
  shardsEarned: number;
  pityCount: number;
  softPityActive: boolean;
  totalPulls: number;
  bannerId: string;
}

export interface PityState {
  totalPullsOnBanner: number;
  currentPity4Star: number;
  currentPity5Star: number;
  hasGuaranteed4Star: boolean;
  hasGuaranteed5Star: boolean;
  guaranteeUnitId?: string;
}

/**
 * Calculate pull probability based on pity system
 */
export function getPullProbability(
  rarity: CommanderRarity,
  pityState: PityState,
  banner: GachaBannerConfig
): number {
  const config = RARITY_TIERS[rarity];
  const overrideRate = banner.rarityRates?.[rarity];
  let baseRate = overrideRate ?? config.baseProbability;
  
  // Soft pity for 5-star
  if (rarity === 5 && pityState.currentPity5Star >= config.softPityStart) {
    const extraPulls = pityState.currentPity5Star - config.softPityStart + 1;
    baseRate += extraPulls * 0.005; // +0.5% per pull after soft pity start
  }
  
  // Soft pity for 4-star
  if (rarity === 4 && pityState.currentPity4Star >= RARITY_TIERS[4].softPityStart) {
    const extraPulls = pityState.currentPity4Star - RARITY_TIERS[4].softPityStart + 1;
    baseRate += extraPulls * 0.03; // +3% per pull after soft pity start
  }
  
  // Hard pity guarantees
  if (rarity === 5 && pityState.currentPity5Star >= config.guaranteedPityCount) {
    return 1.0; // Guaranteed 5-star
  }
  if (rarity === 4 && pityState.currentPity4Star >= config.guaranteedPityCount) {
    return 1.0; // Guaranteed 4-star
  }
  
  return Math.min(baseRate, 1.0);
}

/**
 * Determine if a rate-up unit should be selected
 */
export function isRateUpActivated(
  commander: GachaCommanderConfig,
  banner: GachaBannerConfig,
  roll: number
): GachaCommanderConfig | null {
  for (const rateUp of banner.rateUpUnits) {
    if (rateUp.commanderId === commander.id) {
      if (roll <= 0.5 * rateUp.rateUpMultiplier) {
        return commander;
      }
    }
  }
  return null;
}

/**
 * Simulate a single pull
 */
export function simulatePull(
  banner: GachaBannerConfig,
  pityState: PityState,
  availableCommanders: GachaCommanderConfig[]
): { commander: GachaCommanderConfig; newPity: PityState } {
  const newPity = { ...pityState, currentPity4Star: pityState.currentPity4Star + 1, currentPity5Star: pityState.currentPity5Star + 1 };
  const roll = Math.random();
  
  // Check for 5-star (including hard pity)
  const fiveStarChance = getPullProbability(5, pityState, banner);
  if (roll < fiveStarChance || pityState.currentPity5Star >= RARITY_TIERS[5].guaranteedPityCount) {
    newPity.currentPity5Star = 0;
    newPity.currentPity4Star = 0;
    
    const fiveStars = availableCommanders.filter(c => c.rarity === 5);
    const rateUpUnits = banner.rateUpUnits.filter(u => {
      const cmd = fiveStars.find(c => c.id === u.commanderId);
      return cmd !== undefined;
    });
    
    // If guaranteed unit
    if (pityState.guaranteeUnitId) {
      const guaranteed = fiveStars.find(c => c.id === pityState.guaranteeUnitId);
      if (guaranteed) {
        return { commander: guaranteed, newPity: { ...newPity, guaranteeUnitId: undefined } };
      }
    }
    
    // Rate up check
    const rateUpRoll = Math.random();
    if (rateUpRoll < 0.5 && rateUpUnits.length > 0) {
      const selectedRateUp = rateUpUnits[Math.floor(Math.random() * rateUpUnits.length)];
      const commander = fiveStars.find(c => c.id === selectedRateUp.commanderId);
      if (commander) {
        return { commander, newPity };
      }
    }
    
    const randomFive = fiveStars[Math.floor(Math.random() * fiveStars.length)];
    return { commander: randomFive, newPity };
  }
  
  // Check for 4-star (including hard pity)
  const fourStarChance = getPullProbability(4, pityState, banner);
  if (roll < fourStarChance + 0.1 || pityState.currentPity4Star >= RARITY_TIERS[4].guaranteedPityCount) {
    newPity.currentPity4Star = 0;
    const fourStars = availableCommanders.filter(c => c.rarity === 4);
    const randomFour = fourStars[Math.floor(Math.random() * fourStars.length)];
    return { commander: randomFour, newPity };
  }
  
  // 3-star or lower
  const threeStarChance = getPullProbability(3, pityState, banner);
  if (roll < threeStarChance + 0.3) {
    const threeStars = availableCommanders.filter(c => c.rarity === 3);
    return { commander: threeStars[Math.floor(Math.random() * threeStars.length)], newPity };
  }
  
  // 1-2 star
  const lowStars = availableCommanders.filter(c => c.rarity <= 2);
  return { commander: lowStars[Math.floor(Math.random() * lowStars.length)], newPity };
}

/**
 * Process duplicate commander into shards
 */
export function processDuplicate(
  existingCommander: { id: string; currentShards: number; awakeningLevel: number },
  duplicateCommander: GachaCommanderConfig
): { newShards: number; newAwakeningLevel: number; overflowShards: number } {
  const rarityConfig = RARITY_TIERS[duplicateCommander.rarity];
  let newShards = existingCommander.currentShards + rarityConfig.shardConversionRate;
  let newAwakeningLevel = existingCommander.awakeningLevel;
  
  // Check if enough shards for awakening
  while (newAwakeningLevel < duplicateCommander.maxAwakening) {
    const shardsNeeded = duplicateCommander.shardsForAwakening[newAwakeningLevel + 1];
    if (newShards >= shardsNeeded) {
      newShards -= shardsNeeded;
      newAwakeningLevel++;
    } else {
      break;
    }
  }
  
  const overflowShards = newAwakeningLevel >= duplicateCommander.maxAwakening ? newShards : 0;
  if (overflowShards > 0) newShards = 0;
  
  return { newShards, newAwakeningLevel, overflowShards };
}

/**
 * Calculate cost for a multi-pull
 */
export function calcMultiPullCost(banner: GachaBannerConfig, pullCount: number = 10): number {
  if (pullCount >= banner.multiPullCount) {
    return banner.costPerMultiPull;
  }
  return banner.costPerPull * pullCount;
}

/**
 * Get available commanders for a banner
 */
export function getAvailableCommandersForBanner(
  banner: GachaBannerConfig,
  allCommanders: GachaCommanderConfig[]
): GachaCommanderConfig[] {
  return allCommanders.filter(c => {
    if (c.isLimited && !c.limitedBannerIds.includes(banner.id)) return false;
    if (banner.type === 'limited' && !c.isLimited) return false;
    return true;
  });
}

/**
 * Rarity color code
 */
export function getRarityColor(rarity: CommanderRarity): string {
  return RARITY_TIERS[rarity].color;
}

/**
 * Get banner status (active, upcoming, ended)
 */
export function getBannerStatus(banner: GachaBannerConfig): 'active' | 'upcoming' | 'ended' | 'permanent' {
  if (banner.isPermanent) return 'permanent';
  const now = Date.now() / 1000;
  if (now < banner.startDate) return 'upcoming';
  if (now > banner.endDate) return 'ended';
  return 'active';
}

export default GACHA_COMMANDERS;