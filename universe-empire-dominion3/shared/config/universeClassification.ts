export type UniverseTypeId =
  | 'standard'
  | 'seasonal'
  | 'speed'
  | 'tournament'
  | 'hardcore'
  | 'roleplay'
  | 'creative';

export type UniverseSubtypeId =
  | 'balanced'
  | 'newbie'
  | 'veteran'
  | 'exploration'
  | 'warfare'
  | 'economic'
  | 'blitz'
  | 'marathon'
  | 'elimination'
  | 'ladder'
  | 'permadeath'
  | 'one-life'
  | 'lore-heavy'
  | 'sandbox'
  | 'builder';

export type UniverseClassId =
  | 'I'
  | 'II'
  | 'III'
  | 'IV'
  | 'V'
  | 'VI'
  | 'VII'
  | 'VIII'
  | 'IX'
  | 'X'
  | 'XI'
  | 'XII'
  | 'XIII'
  | 'XIV'
  | 'XV';

export type UniverseSubclassId =
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'delta'
  | 'epsilon';

export type UniverseCategoryId =
  | 'pvp'
  | 'pve'
  | 'rp'
  | 'experimental';

export type UniverseSubcategoryId =
  | 'open-world'
  | 'arena'
  | 'faction-war'
  | 'co-op'
  | 'solo'
  | 'narrative'
  | 'sandbox-rp'
  | 'prototype'
  | 'test-lab'
  | 'community';

export interface UniverseSubtypeDefinition {
  readonly id: UniverseSubtypeId;
  readonly name: string;
  readonly description: string;
  readonly parentType: UniverseTypeId;
  readonly features: readonly string[];
  readonly speedMultipliers: { readonly economy: number; readonly fleet: number; readonly research: number };
  readonly newbieProtectionDays: number;
  readonly maxPlayers: number;
  readonly rankingEnabled: boolean;
  readonly migrationAllowed: boolean;
}

export interface UniverseClassDefinition {
  readonly id: UniverseClassId;
  readonly numeral: number;
  readonly name: string;
  readonly description: string;
  readonly galaxyCountRange: { readonly min: number; readonly max: number };
  readonly difficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme' | 'brutal' | 'apocalyptic';
  readonly playerSkillRange: { readonly min: number; readonly max: number };
  readonly resourceMultiplier: number;
  readonly combatModifier: number;
  readonly expansionPenalty: number;
}

export interface UniverseSubclassDefinition {
  readonly id: UniverseSubclassId;
  readonly name: string;
  readonly description: string;
  readonly modifier: number;
  readonly specialRule: string | null;
  readonly exclusiveCategoryId: UniverseCategoryId | null;
}

export interface UniverseSubcategoryDefinition {
  readonly id: UniverseSubcategoryId;
  readonly name: string;
  readonly description: string;
  readonly parentCategory: UniverseCategoryId;
  readonly allowedTypes: readonly UniverseTypeId[];
  readonly maxAllianceSize: number;
  readonly friendlyFire: boolean;
  readonly respawnEnabled: boolean;
  readonly winCondition: string;
}

export interface UniverseCategoryDefinition {
  readonly id: UniverseCategoryId;
  readonly name: string;
  readonly description: string;
  readonly subcategories: readonly UniverseSubcategoryId[];
  readonly allowedSubtypes: readonly UniverseSubtypeId[];
  readonly defaultFeatures: readonly string[];
}

export interface UniverseClassificationCode {
  readonly type: UniverseTypeId;
  readonly class: UniverseClassId;
  readonly subclass: UniverseSubclassId;
  readonly code: string;
}

export interface SubtypeFeatureSet {
  readonly pvp: boolean;
  readonly pve: boolean;
  readonly trading: boolean;
  readonly alliances: boolean;
  readonly expeditions: boolean;
  readonly megastructures: boolean;
  readonly seasonalTech: boolean;
  readonly seasonPass: boolean;
  readonly championships: boolean;
  readonly offlineAccrual: boolean;
  readonly newbieProtection: boolean;
  readonly fleetSave: boolean;
  readonly ipm: boolean;
  readonly rip: boolean;
  readonly permadeath: boolean;
  readonly respawn: boolean;
  readonly adminEvents: boolean;
}

export interface ClassSizeThreshold {
  readonly classId: UniverseClassId;
  readonly minGalaxies: number;
  readonly maxGalaxies: number;
}

const UNIVERSE_SUBTYPES: readonly UniverseSubtypeDefinition[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Standard settings for all playstyles. Equal emphasis on economy, military, and research.',
    parentType: 'standard',
    features: ['trading', 'alliances', 'expeditions', 'offline-accrual'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 7,
    maxPlayers: 12000,
    rankingEnabled: true,
    migrationAllowed: true,
  },
  {
    id: 'newbie',
    name: 'Newbie Friendly',
    description: 'Extended protection and bonuses for new players. Slower pace to learn mechanics.',
    parentType: 'standard',
    features: ['trading', 'alliances', 'expeditions', 'offline-accrual', 'newbie-bonuses'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 30,
    maxPlayers: 10000,
    rankingEnabled: true,
    migrationAllowed: true,
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'For experienced players. No protection, harder resource curves, and advanced mechanics.',
    parentType: 'standard',
    features: ['trading', 'alliances', 'expeditions', 'offline-accrual', 'hardcore-mechanics'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 0,
    maxPlayers: 8000,
    rankingEnabled: true,
    migrationAllowed: true,
  },
  {
    id: 'exploration',
    name: 'Exploration',
    description: 'Focused on discovery and expeditions. Reduced combat rewards, expanded probe capabilities.',
    parentType: 'seasonal',
    features: ['expeditions', 'seasonal-tech', 'season-pass', 'championships', 'enhanced-probes'],
    speedMultipliers: { economy: 2, fleet: 1, research: 2 },
    newbieProtectionDays: 3,
    maxPlayers: 15000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'warfare',
    name: 'Warfare',
    description: 'Aggressive PvP-focused season. Fleet speed amplified, combat bonuses everywhere.',
    parentType: 'seasonal',
    features: ['expeditions', 'seasonal-tech', 'season-pass', 'championships', 'combat-bonuses'],
    speedMultipliers: { economy: 1, fleet: 4, research: 1 },
    newbieProtectionDays: 3,
    maxPlayers: 15000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'economic',
    name: 'Economic',
    description: 'Trade and economy focused season. Market fees reduced, production bonuses active.',
    parentType: 'seasonal',
    features: ['expeditions', 'seasonal-tech', 'season-pass', 'championships', 'market-bonuses'],
    speedMultipliers: { economy: 3, fleet: 1, research: 2 },
    newbieProtectionDays: 3,
    maxPlayers: 15000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'blitz',
    name: 'Blitz',
    description: 'Extremely fast-paced. All speeds maximized, matches last days not weeks.',
    parentType: 'speed',
    features: ['trading', 'alliances', 'expeditions', 'offline-accrual'],
    speedMultipliers: { economy: 10, fleet: 10, research: 10 },
    newbieProtectionDays: 0,
    maxPlayers: 5000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Extended speed universe. Fast but not frantic, designed for long campaigns.',
    parentType: 'speed',
    features: ['trading', 'alliances', 'expeditions', 'offline-accrual'],
    speedMultipliers: { economy: 5, fleet: 5, research: 5 },
    newbieProtectionDays: 3,
    maxPlayers: 8000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'elimination',
    name: 'Elimination',
    description: 'Single-elimination tournament. Last standing alliance wins.',
    parentType: 'tournament',
    features: ['championships', 'bracket-system', 'spectator-mode'],
    speedMultipliers: { economy: 3, fleet: 3, research: 3 },
    newbieProtectionDays: 0,
    maxPlayers: 2000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'ladder',
    name: 'Ladder',
    description: 'Ranked ladder tournament. ELO-based matchmaking with seasonal resets.',
    parentType: 'tournament',
    features: ['championships', 'elo-matching', 'seasonal-reset', 'spectator-mode'],
    speedMultipliers: { economy: 2, fleet: 2, research: 2 },
    newbieProtectionDays: 0,
    maxPlayers: 2000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'permadeath',
    name: 'Permadeath',
    description: 'One life. Lose your last planet and you are out permanently.',
    parentType: 'hardcore',
    features: ['trading', 'alliances', 'expeditions', 'permadeath'],
    speedMultipliers: { economy: 2, fleet: 2, research: 2 },
    newbieProtectionDays: 0,
    maxPlayers: 3000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'one-life',
    name: 'One Life',
    description: 'Hardcore variant with single-life mechanics and brutal resource scarcity.',
    parentType: 'hardcore',
    features: ['trading', 'alliances', 'permadeath', 'resource-scarcity'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 0,
    maxPlayers: 2000,
    rankingEnabled: true,
    migrationAllowed: false,
  },
  {
    id: 'lore-heavy',
    name: 'Lore Heavy',
    description: 'Deep roleplay universe with canonical lore enforcement and narrative events.',
    parentType: 'roleplay',
    features: ['roleplay-enforcement', 'narrative-events', 'character-system', 'admin-events'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 14,
    maxPlayers: 6000,
    rankingEnabled: false,
    migrationAllowed: true,
  },
  {
    id: 'sandbox',
    name: 'Sandbox RP',
    description: 'Light roleplay rules. Players create their own narratives with minimal enforcement.',
    parentType: 'roleplay',
    features: ['roleplay-guidelines', 'player-events', 'character-system'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 7,
    maxPlayers: 8000,
    rankingEnabled: true,
    migrationAllowed: true,
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Creative mode. Unlimited resources for designing megastructures and empires.',
    parentType: 'creative',
    features: ['unlimited-resources', 'megastructure-focus', 'blueprint-sharing', 'community-events'],
    speedMultipliers: { economy: 1, fleet: 1, research: 1 },
    newbieProtectionDays: 0,
    maxPlayers: 4000,
    rankingEnabled: false,
    migrationAllowed: false,
  },
] as const;

const UNIVERSE_CLASSES: readonly UniverseClassDefinition[] = [
  {
    id: 'I',
    numeral: 1,
    name: 'Outpost',
    description: 'Tiny universe for casual play and tutorials. Minimal competition.',
    galaxyCountRange: { min: 1, max: 8 },
    difficulty: 'trivial',
    playerSkillRange: { min: 0, max: 100 },
    resourceMultiplier: 2.0,
    combatModifier: 0.5,
    expansionPenalty: 0,
  },
  {
    id: 'II',
    numeral: 2,
    name: 'Frontier',
    description: 'Small universe. Good for small groups learning together.',
    galaxyCountRange: { min: 9, max: 16 },
    difficulty: 'easy',
    playerSkillRange: { min: 50, max: 200 },
    resourceMultiplier: 1.8,
    combatModifier: 0.6,
    expansionPenalty: 0.05,
  },
  {
    id: 'III',
    numeral: 3,
    name: 'Settler',
    description: 'Small-mid universe. Balanced for relaxed competitive play.',
    galaxyCountRange: { min: 17, max: 32 },
    difficulty: 'easy',
    playerSkillRange: { min: 100, max: 300 },
    resourceMultiplier: 1.5,
    combatModifier: 0.7,
    expansionPenalty: 0.1,
  },
  {
    id: 'IV',
    numeral: 4,
    name: 'Explorer',
    description: 'Mid-size universe. The standard competitive experience begins here.',
    galaxyCountRange: { min: 33, max: 64 },
    difficulty: 'moderate',
    playerSkillRange: { min: 200, max: 450 },
    resourceMultiplier: 1.3,
    combatModifier: 0.8,
    expansionPenalty: 0.15,
  },
  {
    id: 'V',
    numeral: 5,
    name: 'Pioneer',
    description: 'Mid-size universe. Requires strategic planning and alliance coordination.',
    galaxyCountRange: { min: 65, max: 96 },
    difficulty: 'moderate',
    playerSkillRange: { min: 300, max: 600 },
    resourceMultiplier: 1.2,
    combatModifier: 0.9,
    expansionPenalty: 0.2,
  },
  {
    id: 'VI',
    numeral: 6,
    name: 'Pathfinder',
    description: 'Standard large universe. Full competitive meta and active market.',
    galaxyCountRange: { min: 97, max: 128 },
    difficulty: 'moderate',
    playerSkillRange: { min: 400, max: 750 },
    resourceMultiplier: 1.1,
    combatModifier: 1.0,
    expansionPenalty: 0.25,
  },
  {
    id: 'VII',
    numeral: 7,
    name: 'Vanguard',
    description: 'Large universe. Demands long-term planning and diplomatic skill.',
    galaxyCountRange: { min: 129, max: 160 },
    difficulty: 'hard',
    playerSkillRange: { min: 500, max: 900 },
    resourceMultiplier: 1.0,
    combatModifier: 1.1,
    expansionPenalty: 0.3,
  },
  {
    id: 'VIII',
    numeral: 8,
    name: 'Sovereign',
    description: 'Large universe with harsher resource curves and larger galaxies.',
    galaxyCountRange: { min: 161, max: 192 },
    difficulty: 'hard',
    playerSkillRange: { min: 600, max: 1000 },
    resourceMultiplier: 0.95,
    combatModifier: 1.15,
    expansionPenalty: 0.35,
  },
  {
    id: 'IX',
    numeral: 9,
    name: 'Titan',
    description: 'Very large universe. Only seasoned alliances thrive here.',
    galaxyCountRange: { min: 193, max: 224 },
    difficulty: 'hard',
    playerSkillRange: { min: 700, max: 1100 },
    resourceMultiplier: 0.9,
    combatModifier: 1.2,
    expansionPenalty: 0.4,
  },
  {
    id: 'X',
    numeral: 10,
    name: 'Colossus',
    description: 'Massive universe. Every decision matters, resources are scarce.',
    galaxyCountRange: { min: 225, max: 256 },
    difficulty: 'extreme',
    playerSkillRange: { min: 800, max: 1200 },
    resourceMultiplier: 0.85,
    combatModifier: 1.3,
    expansionPenalty: 0.45,
  },
  {
    id: 'XI',
    numeral: 11,
    name: 'Leviathan',
    description: 'Massive universe with extreme difficulty. Minimal hand-holding.',
    galaxyCountRange: { min: 257, max: 320 },
    difficulty: 'extreme',
    playerSkillRange: { min: 900, max: 1300 },
    resourceMultiplier: 0.8,
    combatModifier: 1.4,
    expansionPenalty: 0.5,
  },
  {
    id: 'XII',
    numeral: 12,
    name: 'Apex',
    description: 'Extremely large universe. Ruthless competition and complex politics.',
    galaxyCountRange: { min: 321, max: 384 },
    difficulty: 'extreme',
    playerSkillRange: { min: 1000, max: 1400 },
    resourceMultiplier: 0.75,
    combatModifier: 1.5,
    expansionPenalty: 0.55,
  },
  {
    id: 'XIII',
    numeral: 13,
    name: 'Oblivion',
    description: 'Brutal universe. Tiny margins separate victory from annihilation.',
    galaxyCountRange: { min: 385, max: 448 },
    difficulty: 'brutal',
    playerSkillRange: { min: 1100, max: 1500 },
    resourceMultiplier: 0.7,
    combatModifier: 1.6,
    expansionPenalty: 0.6,
  },
  {
    id: 'XIV',
    numeral: 14,
    name: 'Void',
    description: 'Near-impossible difficulty. Only legendary alliances survive.',
    galaxyCountRange: { min: 449, max: 512 },
    difficulty: 'brutal',
    playerSkillRange: { min: 1200, max: 1600 },
    resourceMultiplier: 0.65,
    combatModifier: 1.7,
    expansionPenalty: 0.65,
  },
  {
    id: 'XV',
    numeral: 15,
    name: 'Singularity',
    description: 'The ultimate challenge. Maximum size, minimum mercy.',
    galaxyCountRange: { min: 513, max: 1024 },
    difficulty: 'apocalyptic',
    playerSkillRange: { min: 1400, max: 9999 },
    resourceMultiplier: 0.5,
    combatModifier: 2.0,
    expansionPenalty: 0.75,
  },
] as const;

const UNIVERSE_SUBCLASSES: readonly UniverseSubclassDefinition[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Primary iteration. Standard rules and balanced adjustments.',
    modifier: 1.0,
    specialRule: null,
    exclusiveCategoryId: null,
  },
  {
    id: 'beta',
    name: 'Beta',
    description: 'Secondary iteration. Experimental mechanics may be active.',
    modifier: 1.05,
    specialRule: 'experimental-mechanics',
    exclusiveCategoryId: null,
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'Tertiary iteration. Enhanced rewards and modified progression.',
    modifier: 1.1,
    specialRule: 'enhanced-rewards',
    exclusiveCategoryId: null,
  },
  {
    id: 'delta',
    name: 'Delta',
    description: 'Restricted subclass. PvP-only or RP-only depending on category.',
    modifier: 1.0,
    specialRule: 'category-exclusive',
    exclusiveCategoryId: 'pvp',
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    description: 'Experimental subclass. Rules may change mid-universe.',
    modifier: 0.95,
    specialRule: 'volatile-rules',
    exclusiveCategoryId: 'experimental',
  },
] as const;

const UNIVERSE_SUBCATEGORIES: readonly UniverseSubcategoryDefinition[] = [
  {
    id: 'open-world',
    name: 'Open World',
    description: 'Full galaxy access from day one. Players choose their own territory and pace.',
    parentCategory: 'pvp',
    allowedTypes: ['standard', 'speed', 'hardcore'],
    maxAllianceSize: 50,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'domination',
  },
  {
    id: 'arena',
    name: 'Arena',
    description: 'Contained combat zones with matchmaking. Fights occur in predefined arenas.',
    parentCategory: 'pvp',
    allowedTypes: ['tournament', 'speed'],
    maxAllianceSize: 10,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'arena-victories',
  },
  {
    id: 'faction-war',
    name: 'Faction War',
    description: 'Large-scale faction vs faction warfare with territory control mechanics.',
    parentCategory: 'pvp',
    allowedTypes: ['standard', 'seasonal', 'hardcore'],
    maxAllianceSize: 100,
    friendlyFire: false,
    respawnEnabled: false,
    winCondition: 'territory-control',
  },
  {
    id: 'co-op',
    name: 'Co-op',
    description: 'Cooperative PvE universe. Players work together against AI threats.',
    parentCategory: 'pve',
    allowedTypes: ['standard', 'seasonal'],
    maxAllianceSize: 200,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'boss-defeats',
  },
  {
    id: 'solo',
    name: 'Solo',
    description: 'No alliances. Every player for themselves in a PvE environment.',
    parentCategory: 'pve',
    allowedTypes: ['standard', 'speed', 'hardcore'],
    maxAllianceSize: 1,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'personal-best',
  },
  {
    id: 'narrative',
    name: 'Narrative',
    description: 'Story-driven universe with quest chains, NPC interactions, and plot progression.',
    parentCategory: 'rp',
    allowedTypes: ['roleplay', 'seasonal'],
    maxAllianceSize: 30,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'story-completion',
  },
  {
    id: 'sandbox-rp',
    name: 'Sandbox RP',
    description: 'Player-driven stories with minimal admin intervention. Self-governed roleplay.',
    parentCategory: 'rp',
    allowedTypes: ['roleplay'],
    maxAllianceSize: 50,
    friendlyFire: true,
    respawnEnabled: false,
    winCondition: 'community-vote',
  },
  {
    id: 'prototype',
    name: 'Prototype',
    description: 'Testing ground for new mechanics. Data collected for future universes.',
    parentCategory: 'experimental',
    allowedTypes: ['standard', 'creative'],
    maxAllianceSize: 20,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'none',
  },
  {
    id: 'test-lab',
    name: 'Test Lab',
    description: 'Controlled environment for balance testing. Resets may occur at any time.',
    parentCategory: 'experimental',
    allowedTypes: ['creative', 'speed'],
    maxAllianceSize: 10,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'none',
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Community-designed rulesets. Players vote on major mechanics and changes.',
    parentCategory: 'experimental',
    allowedTypes: ['standard', 'roleplay', 'creative'],
    maxAllianceSize: 100,
    friendlyFire: false,
    respawnEnabled: true,
    winCondition: 'community-consensus',
  },
] as const;

const UNIVERSE_CATEGORIES: readonly UniverseCategoryDefinition[] = [
  {
    id: 'pvp',
    name: 'Player vs Player',
    description: 'Competitive universe centered on player combat and territorial conquest.',
    subcategories: ['open-world', 'arena', 'faction-war'],
    allowedSubtypes: ['balanced', 'veteran', 'warfare', 'blitz', 'marathon', 'permadeath', 'one-life'],
    defaultFeatures: ['trading', 'alliances', 'fleet-save'],
  },
  {
    id: 'pve',
    name: 'Player vs Environment',
    description: 'Cooperative or solo universe focused on AI enemies and environmental challenges.',
    subcategories: ['co-op', 'solo'],
    allowedSubtypes: ['balanced', 'newbie', 'exploration', 'marathon'],
    defaultFeatures: ['trading', 'alliances', 'expeditions', 'offline-accrual'],
  },
  {
    id: 'rp',
    name: 'Roleplay',
    description: 'Narrative-driven universe with character systems and story enforcement.',
    subcategories: ['narrative', 'sandbox-rp'],
    allowedSubtypes: ['lore-heavy', 'sandbox'],
    defaultFeatures: ['roleplay-enforcement', 'character-system', 'admin-events'],
  },
  {
    id: 'experimental',
    name: 'Experimental',
    description: 'Testing ground for new mechanics and community-designed rulesets.',
    subcategories: ['prototype', 'test-lab', 'community'],
    allowedSubtypes: ['builder'],
    defaultFeatures: ['experimental-mechanics', 'community-events'],
  },
] as const;

const CLASS_SIZE_THRESHOLDS: readonly ClassSizeThreshold[] = [
  { classId: 'I', minGalaxies: 1, maxGalaxies: 8 },
  { classId: 'II', minGalaxies: 9, maxGalaxies: 16 },
  { classId: 'III', minGalaxies: 17, maxGalaxies: 32 },
  { classId: 'IV', minGalaxies: 33, maxGalaxies: 64 },
  { classId: 'V', minGalaxies: 65, maxGalaxies: 96 },
  { classId: 'VI', minGalaxies: 97, maxGalaxies: 128 },
  { classId: 'VII', minGalaxies: 129, maxGalaxies: 160 },
  { classId: 'VIII', minGalaxies: 161, maxGalaxies: 192 },
  { classId: 'IX', minGalaxies: 193, maxGalaxies: 224 },
  { classId: 'X', minGalaxies: 225, maxGalaxies: 256 },
  { classId: 'XI', minGalaxies: 257, maxGalaxies: 320 },
  { classId: 'XII', minGalaxies: 321, maxGalaxies: 384 },
  { classId: 'XIII', minGalaxies: 385, maxGalaxies: 448 },
  { classId: 'XIV', minGalaxies: 449, maxGalaxies: 512 },
  { classId: 'XV', minGalaxies: 513, maxGalaxies: 1024 },
] as const;

const SUBTYPE_FEATURE_MAP: Record<UniverseSubtypeId, SubtypeFeatureSet> = {
  balanced: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: true, rip: true,
    permadeath: false, respawn: true, adminEvents: false,
  },
  newbie: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: true, rip: false,
    permadeath: false, respawn: true, adminEvents: false,
  },
  veteran: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: false, fleetSave: true, ipm: true, rip: true,
    permadeath: false, respawn: true, adminEvents: false,
  },
  exploration: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: true, seasonPass: true, championships: true,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: false,
  },
  warfare: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: true, seasonPass: true, championships: true,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: false,
  },
  economic: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: true, seasonPass: true, championships: true,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: false,
  },
  blitz: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: false, fleetSave: false, ipm: true, rip: true,
    permadeath: false, respawn: true, adminEvents: false,
  },
  marathon: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: true, rip: true,
    permadeath: false, respawn: true, adminEvents: false,
  },
  elimination: {
    pvp: true, pve: false, trading: false, alliances: true, expeditions: false,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: true,
    offlineAccrual: false, newbieProtection: false, fleetSave: false, ipm: false, rip: false,
    permadeath: true, respawn: false, adminEvents: true,
  },
  ladder: {
    pvp: true, pve: false, trading: false, alliances: true, expeditions: false,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: true,
    offlineAccrual: false, newbieProtection: false, fleetSave: false, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: true,
  },
  permadeath: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: false, fleetSave: false, ipm: true, rip: true,
    permadeath: true, respawn: false, adminEvents: false,
  },
  'one-life': {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: false,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: false, fleetSave: false, ipm: false, rip: true,
    permadeath: true, respawn: false, adminEvents: false,
  },
  'lore-heavy': {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: true,
  },
  sandbox: {
    pvp: true, pve: true, trading: true, alliances: true, expeditions: true,
    megastructures: false, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: true, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: false,
  },
  builder: {
    pvp: false, pve: false, trading: true, alliances: true, expeditions: true,
    megastructures: true, seasonalTech: false, seasonPass: false, championships: false,
    offlineAccrual: true, newbieProtection: false, fleetSave: true, ipm: false, rip: false,
    permadeath: false, respawn: true, adminEvents: true,
  },
};

export const UNIVERSE_CLASSIFICATION = {
  types: [
    'standard',
    'seasonal',
    'speed',
    'tournament',
    'hardcore',
    'roleplay',
    'creative',
  ] as const,

  subtypes: UNIVERSE_SUBTYPES,
  classes: UNIVERSE_CLASSES,
  subclasses: UNIVERSE_SUBCLASSES,
  categories: UNIVERSE_CATEGORIES,
  subcategories: UNIVERSE_SUBCATEGORIES,
  classSizeThresholds: CLASS_SIZE_THRESHOLDS,
  subtypeFeatureMap: SUBTYPE_FEATURE_MAP,

  typeSubtypeMap: {
    standard: ['balanced', 'newbie', 'veteran'] as const,
    seasonal: ['exploration', 'warfare', 'economic'] as const,
    speed: ['blitz', 'marathon'] as const,
    tournament: ['elimination', 'ladder'] as const,
    hardcore: ['permadeath', 'one-life'] as const,
    roleplay: ['lore-heavy', 'sandbox'] as const,
    creative: ['builder'] as const,
  } as const,

  subtypeDescription: {
    balanced: 'Standard settings for all playstyles',
    newbie: 'Extended protection and bonuses for new players',
    veteran: 'For experienced players with harder mechanics',
    exploration: 'Focused on discovery and expeditions',
    warfare: 'Aggressive PvP-focused season',
    economic: 'Trade and economy focused season',
    blitz: 'Extremely fast-paced matches',
    marathon: 'Extended speed for long campaigns',
    elimination: 'Single-elimination tournament',
    ladder: 'Ranked ladder with ELO matchmaking',
    permadeath: 'One life, permanent elimination',
    'one-life': 'Single-life with brutal scarcity',
    'lore-heavy': 'Deep roleplay with canonical enforcement',
    sandbox: 'Light roleplay with player-driven stories',
    builder: 'Creative mode with unlimited resources',
  } as const,

  classIdToNumeral: {
    I: 1, II: 2, III: 3, IV: 4, V: 5,
    VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
    XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15,
  } as const,
} as const;

export function getClassForSize(galaxyCount: number): UniverseClassDefinition {
  for (const threshold of CLASS_SIZE_THRESHOLDS) {
    if (galaxyCount >= threshold.minGalaxies && galaxyCount <= threshold.maxGalaxies) {
      const found = UNIVERSE_CLASSES.find(c => c.id === threshold.classId);
      if (found) return found;
    }
  }
  return UNIVERSE_CLASSES[UNIVERSE_CLASSES.length - 1];
}

export function getSubtypeFeatures(subtype: UniverseSubtypeId): SubtypeFeatureSet {
  return SUBTYPE_FEATURE_MAP[subtype];
}

export function formatUniverseCode(
  type: UniverseTypeId,
  classId: UniverseClassId,
  subclass: UniverseSubclassId,
): string {
  return `${type.charAt(0).toUpperCase()}${classId}-${subclass.charAt(0).toUpperCase()}`;
}

export function getSubtypesForType(type: UniverseTypeId): readonly UniverseSubtypeId[] {
  return UNIVERSE_CLASSIFICATION.typeSubtypeMap[type];
}

export function getSubcategoriesForCategory(category: UniverseCategoryId): readonly UniverseSubcategoryDefinition[] {
  return UNIVERSE_SUBCATEGORIES.filter(sc => sc.parentCategory === category);
}

export function getClassByNumeral(numeral: number): UniverseClassDefinition | undefined {
  return UNIVERSE_CLASSES.find(c => c.numeral === numeral);
}

export function getSubclassById(id: UniverseSubclassId): UniverseSubclassDefinition | undefined {
  return UNIVERSE_SUBCLASSES.find(sc => sc.id === id);
}

export function getCategoryById(id: UniverseCategoryId): UniverseCategoryDefinition | undefined {
  return UNIVERSE_CATEGORIES.find(c => c.id === id);
}

export function isSubtypeAllowedInCategory(subtype: UniverseSubtypeId, category: UniverseCategoryId): boolean {
  const cat = UNIVERSE_CATEGORIES.find(c => c.id === category);
  return cat ? cat.allowedSubtypes.includes(subtype) : false;
}

export function parseUniverseCode(code: string): UniverseClassificationCode | null {
  const match = code.match(/^([A-Z])([IVXLCDM]+)-([A-Z])$/);
  if (!match) return null;

  const typeChar = match[1];
  const classStr = match[2];
  const subclassChar = match[3];

  const typeMap: Record<string, UniverseTypeId> = {
    S: 'standard', E: 'seasonal', P: 'speed',
    T: 'tournament', H: 'hardcore', R: 'roleplay', C: 'creative',
  };
  const subclassMap: Record<string, UniverseSubclassId> = {
    A: 'alpha', B: 'beta', G: 'gamma', D: 'delta', E: 'epsilon',
  };

  const type = typeMap[typeChar];
  const subclass = subclassMap[subclassChar];
  const classDef = UNIVERSE_CLASSES.find(c => c.id === classStr as UniverseClassId);

  if (!type || !subclass || !classDef) return null;

  return { type, class: classDef.id, subclass, code };
}

export function resolveUniverseClassification(
  type: UniverseTypeId,
  subtype: UniverseSubtypeId,
  galaxyCount: number,
  subclass: UniverseSubclassId = 'alpha',
): {
  type: UniverseTypeId;
  subtype: UniverseSubtypeId;
  class: UniverseClassDefinition;
  subclassDef: UniverseSubclassDefinition;
  code: string;
  features: SubtypeFeatureSet;
} {
  const classDef = getClassForSize(galaxyCount);
  const subclassDef = UNIVERSE_SUBCLASSES.find(sc => sc.id === subclass) ?? UNIVERSE_SUBCLASSES[0];
  const features = getSubtypeFeatures(subtype);
  const code = formatUniverseCode(type, classDef.id, subclassDef.id);

  return { type, subtype, class: classDef, subclassDef, code, features };
}
