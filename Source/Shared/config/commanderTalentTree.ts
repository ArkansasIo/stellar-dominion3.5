/**
 * COMMANDER TALENT TREE SYSTEM (Poe2-Inspired)
 * ============================================================================
 * Deep passive skill tree with level 1-999 progression and tier 1-99 nodes.
 * 
 * Structure:
 *   6 Major Ascendancy Classes → each has 3 sub-classes
 *   Each sub-class has a branching tree of passive nodes
 *   90 total talent nodes across all trees
 * 
 * Progression:
 *   - Talent Points earned per level (1 point per level, bonus at milestones)
 *   - Tier requirements increase with node power
 *   - Keystone nodes require specific path allocation
 *   - Ascendancy points earned at levels 100, 300, 600, 999
 */

// ============================================================================
// TYPES
// ============================================================================

export type TalentNodeRarity = 'normal' | 'notable' | 'keystone' | 'ascendancy';

export type StatType =
  | 'hullHp' | 'shieldHp' | 'shieldRecharge' | 'armorValue'
  | 'weaponDamage' | 'weaponSpeed' | 'weaponRange' | 'weaponCritChance' | 'weaponCritDamage'
  | 'energyWeapons' | 'kineticWeapons' | 'explosiveWeapons' | 'beamWeapons'
  | 'miningYield' | 'processingSpeed' | 'cargoCapacity' | 'warpSpeed' | 'warpStability'
  | 'targetingSpeed' | 'scanResolution' | 'sensorStrength' | 'electronicWarfare'
  | 'repairAmount' | 'logisticsBandwidth' | 'fleetCommandRange'
  | 'empireTaxReduction' | 'buildSpeedBonus' | 'researchSpeed' | 'diplomacyBonus'
  | 'crewEfficiency' | 'modulePowergrid' | 'moduleCpu' | 'capacitorCapacity' | 'capacitorRecharge'
  | 'flightVelocity' | 'agility' | 'signatureRadius' | 'avoidance'
  | 'xpBonus' | 'resourceBonus' | 'prestigeBonus' | 'turnEfficiency'
  | 'healthRegen' | 'damageReduction' | 'crowdControl' | 'summonPower';

export interface StatModifier {
  stat: StatType;
  value: number;       // flat value or percentage depending on stat
  isPercent: boolean;  // if true, value is a percentage bonus
}

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: TalentNodeRarity;
  tier: number;        // 1-99, determines power level
  requiredLevel: number; // minimum commander level to allocate
  requiredPoints: number; // talent points to unlock (cost increases with tier)
  x: number;           // grid position X (for tree layout)
  y: number;           // grid position Y (for tree layout)
  modifiers: StatModifier[];
  requires?: string[];  // IDs of prerequisite nodes
  ascendancyClass?: string;
  subClass?: string;
}

export interface TalentTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ascendancyClass: string;
  subClasses: {
    id: string;
    name: string;
    description: string;
    icon: string;
    nodes: TalentNode[];
  }[];
}

export interface CommanderTalentState {
  allocatedNodes: string[];      // IDs of allocated talent nodes
  totalPointsSpent: number;
  ascendancyPoints: number;      // earned at levels 100, 300, 600, 999
  ascendancyPointsSpent: number;
  respecCount: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateNodeCost(tier: number): number {
  if (tier <= 10) return 1;
  if (tier <= 25) return 2;
  if (tier <= 50) return 3;
  if (tier <= 75) return 5;
  if (tier <= 90) return 8;
  return 12;
}

function calculateRequiredLevel(tier: number): number {
  return Math.floor(tier * 10);
}

// ============================================================================
// THE 6 ASCENDANCY TREES
// ============================================================================

export const TALENT_TREES: TalentTree[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. WARLORD (Combat Supremacy)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'warlord',
    name: 'Warlord',
    description: 'Masters of destruction and fleet combat. Unleash devastating firepower.',
    icon: '⚔️',
    color: '#dc2626',
    ascendancyClass: 'warlord',
    subClasses: [
      {
        id: 'warlord_vanguard',
        name: 'Vanguard',
        description: 'Frontline assault specialist with maximum damage output.',
        icon: '🔥',
        nodes: [
          { id: 'wv_1', name: 'Blade Initiate', description: '+10% weapon damage', icon: '⚔️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'weaponDamage', value: 10, isPercent: true }], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_2', name: 'Fire Discipline', description: '+8% weapon speed', icon: '🎯', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'weaponSpeed', value: 8, isPercent: true }], requires: ['wv_1'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_3', name: 'Critical Eye', description: '+5% crit chance', icon: '👁️', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'weaponCritChance', value: 5, isPercent: true }], requires: ['wv_2'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_4', name: 'Rending Strikes', description: '+25% crit damage, +10% weapon damage', icon: '💥', rarity: 'notable', tier: 20, requiredLevel: 200, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'weaponCritDamage', value: 25, isPercent: true }, { stat: 'weaponDamage', value: 10, isPercent: true }], requires: ['wv_3'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_5', name: 'Energy Surge', description: '+15% energy weapon damage', icon: '⚡', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'energyWeapons', value: 15, isPercent: true }], requires: ['wv_3'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_6', name: 'Kinetic Impact', description: '+15% kinetic weapon damage', icon: '🔩', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 2, modifiers: [{ stat: 'kineticWeapons', value: 15, isPercent: true }], requires: ['wv_3'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_7', name: 'War Fury', description: '+20% all weapon damage when below 50% hull', icon: '😡', rarity: 'keystone', tier: 40, requiredLevel: 400, requiredPoints: 5, x: 4, y: 1, modifiers: [{ stat: 'weaponDamage', value: 20, isPercent: true }], requires: ['wv_4', 'wv_5'], ascendancyClass: 'warlord', subClass: 'vanguard' },
          { id: 'wv_8', name: 'Annihilation Protocol', description: '+50% crit damage, +15% crit chance', icon: '☠️', rarity: 'ascendancy', tier: 80, requiredLevel: 800, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'weaponCritDamage', value: 50, isPercent: true }, { stat: 'weaponCritChance', value: 15, isPercent: true }], requires: ['wv_7'], ascendancyClass: 'warlord', subClass: 'vanguard' },
        ]
      },
      {
        id: 'warlord_berserker',
        name: 'Berserker',
        description: 'Risk-taking combatant who gains power from damage taken.',
        icon: '🩸',
        nodes: [
          { id: 'wb_1', name: 'Bloodlust', description: '+12% damage per 10% missing hull', icon: '🩸', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'weaponDamage', value: 12, isPercent: true }], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_2', name: 'Thick Skin', description: '+15% armor value', icon: '🛡️', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'armorValue', value: 15, isPercent: true }], requires: ['wb_1'], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_3', name: 'Explosive Mastery', description: '+20% explosive weapon damage', icon: '💣', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'explosiveWeapons', value: 20, isPercent: true }], requires: ['wb_2'], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_4', name: 'Last Stand', description: 'Cannot die below 1 HP for 3 seconds (60s cooldown)', icon: '💀', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'hullHp', value: 20, isPercent: true }], requires: ['wb_3'], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_5', name: 'Damage Return', description: 'Reflect 8% of incoming damage', icon: '🔄', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'damageReduction', value: 8, isPercent: true }], requires: ['wb_3'], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_6', name: 'Rage Engine', description: '+1% damage per second in combat (max 30%)', icon: '🔥', rarity: 'keystone', tier: 45, requiredLevel: 450, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'weaponDamage', value: 30, isPercent: true }], requires: ['wb_4'], ascendancyClass: 'warlord', subClass: 'berserker' },
          { id: 'wb_7', name: 'Deathless Rage', description: 'While below 20% hull: +40% damage, +30% speed, immune to crowd control', icon: '☠️', rarity: 'ascendancy', tier: 85, requiredLevel: 850, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'weaponDamage', value: 40, isPercent: true }, { stat: 'flightVelocity', value: 30, isPercent: true }], requires: ['wb_6'], ascendancyClass: 'warlord', subClass: 'berserker' },
        ]
      },
      {
        id: 'warlord_tactician',
        name: 'Tactician',
        description: 'Fleet commander who empowers allied ships.',
        icon: '📋',
        nodes: [
          { id: 'wt_1', name: 'Command Presence', description: '+10% fleet command range', icon: '📡', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'fleetCommandRange', value: 10, isPercent: true }], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_2', name: 'Beam Focus', description: '+15% beam weapon damage', icon: '🔦', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'beamWeapons', value: 15, isPercent: true }], requires: ['wt_1'], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_3', name: 'Targeting Array', description: '+20% targeting speed, +10% scan resolution', icon: '🎯', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'targetingSpeed', value: 20, isPercent: true }, { stat: 'scanResolution', value: 10, isPercent: true }], requires: ['wt_2'], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_4', name: 'Fleet Commander', description: 'All allies in range gain +10% weapon damage', icon: '⭐', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'weaponDamage', value: 10, isPercent: true }], requires: ['wt_3'], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_5', name: 'EW Resistance', description: '+25% electronic warfare resistance', icon: '🛡️', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'electronicWarfare', value: 25, isPercent: true }], requires: ['wt_3'], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_6', name: 'Synergy Matrix', description: '+2% damage per ally in fleet (max 10 allies)', icon: '🔗', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'weaponDamage', value: 20, isPercent: true }], requires: ['wt_4'], ascendancyClass: 'warlord', subClass: 'tactician' },
          { id: 'wt_7', name: 'Grand Strategist', description: 'Fleet gains +25% all damage, +15% speed, +10% resistance', icon: '🏆', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'weaponDamage', value: 25, isPercent: true }, { stat: 'flightVelocity', value: 15, isPercent: true }], requires: ['wt_6'], ascendancyClass: 'warlord', subClass: 'tactician' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. ARCHITECT (Industry & Economy)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'architect',
    name: 'Architect',
    description: 'Masters of industry, trade, and resource optimization.',
    icon: '🏗️',
    color: '#f59e0b',
    ascendancyClass: 'architect',
    subClasses: [
      {
        id: 'architect_mogul',
        name: 'Trade Mogul',
        description: 'Supreme economic power and market dominance.',
        icon: '💰',
        nodes: [
          { id: 'am_1', name: 'Shrewd Eye', description: '+10% trade profit', icon: '👁️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'resourceBonus', value: 10, isPercent: true }], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_2', name: 'Bulk Trading', description: '+20% cargo capacity', icon: '📦', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'cargoCapacity', value: 20, isPercent: true }], requires: ['am_1'], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_3', name: 'Tax Evasion', description: '-15% empire tax', icon: '🏦', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'empireTaxReduction', value: 15, isPercent: true }], requires: ['am_2'], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_4', name: 'Market Monopoly', description: '+30% resource production', icon: '📊', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'miningYield', value: 30, isPercent: true }], requires: ['am_3'], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_5', name: 'Processing Mastery', description: '+25% processing speed', icon: '⚙️', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'processingSpeed', value: 25, isPercent: true }], requires: ['am_3'], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_6', name: 'Trade Empire', description: '+5% resource bonus per alliance member (max 10)', icon: '👑', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'resourceBonus', value: 50, isPercent: true }], requires: ['am_4'], ascendancyClass: 'architect', subClass: 'mogul' },
          { id: 'am_7', name: 'Economic Singularity', description: 'All resource production +100%, trade profit +50%', icon: '💎', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'miningYield', value: 100, isPercent: true }, { stat: 'resourceBonus', value: 50, isPercent: true }], requires: ['am_6'], ascendancyClass: 'architect', subClass: 'mogul' },
        ]
      },
      {
        id: 'architect_engineer',
        name: 'Master Engineer',
        description: 'Construction speed and building efficiency.',
        icon: '🔧',
        nodes: [
          { id: 'ae_1', name: 'Efficient Design', description: '+10% build speed', icon: '⚡', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'buildSpeedBonus', value: 10, isPercent: true }], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_2', name: 'Power Grid', description: '+15% module powergrid', icon: '🔌', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'modulePowergrid', value: 15, isPercent: true }], requires: ['ae_1'], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_3', name: 'CPU Optimization', description: '+15% module CPU', icon: '💻', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'moduleCpu', value: 15, isPercent: true }], requires: ['ae_2'], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_4', name: 'Speed Builder', description: '+40% build speed, -20% build cost', icon: '🏗️', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'buildSpeedBonus', value: 40, isPercent: true }], requires: ['ae_3'], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_5', name: 'Hull Reinforcement', description: '+20% hull HP', icon: '🛡️', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'hullHp', value: 20, isPercent: true }], requires: ['ae_3'], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_6', name: 'Megastructure Mastery', description: '+50% build speed, megastructures cost 30% less', icon: '🏛️', rarity: 'keystone', tier: 55, requiredLevel: 550, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'buildSpeedBonus', value: 50, isPercent: true }], requires: ['ae_4'], ascendancyClass: 'architect', subClass: 'engineer' },
          { id: 'ae_7', name: 'Architect of Infinity', description: 'Build speed +100%, all buildings cost 40% less resources', icon: '🌟', rarity: 'ascendancy', tier: 95, requiredLevel: 950, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'buildSpeedBonus', value: 100, isPercent: true }], requires: ['ae_6'], ascendancyClass: 'architect', subClass: 'engineer' },
        ]
      },
      {
        id: 'architect_researcher',
        name: 'Research Director',
        description: 'Accelerated research and technology advancement.',
        icon: '🔬',
        nodes: [
          { id: 'ar_1', name: 'Focused Study', description: '+10% research speed', icon: '📚', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'researchSpeed', value: 10, isPercent: true }], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_2', name: 'Data Mining', description: '+8% XP bonus', icon: '⭐', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'xpBonus', value: 8, isPercent: true }], requires: ['ar_1'], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_3', name: 'Lab Efficiency', description: '+20% research speed', icon: '🧪', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'researchSpeed', value: 20, isPercent: true }], requires: ['ar_2'], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_4', name: 'Breakthrough', description: '+30% research speed, chance to skip research tiers', icon: '💡', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'researchSpeed', value: 30, isPercent: true }], requires: ['ar_3'], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_5', name: 'Turn Efficiency', description: '+15% turn efficiency', icon: '⏱️', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'turnEfficiency', value: 15, isPercent: true }], requires: ['ar_3'], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_6', name: 'Technology Singularity', description: '+60% research speed, all tech costs reduced 25%', icon: '🌐', rarity: 'keystone', tier: 60, requiredLevel: 600, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'researchSpeed', value: 60, isPercent: true }], requires: ['ar_4'], ascendancyClass: 'architect', subClass: 'researcher' },
          { id: 'ar_7', name: 'Omniscient', description: 'All research instant, +100% XP, unlock hidden techs', icon: '🧠', rarity: 'ascendancy', tier: 99, requiredLevel: 999, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'researchSpeed', value: 100, isPercent: true }, { stat: 'xpBonus', value: 100, isPercent: true }], requires: ['ar_6'], ascendancyClass: 'architect', subClass: 'researcher' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SENTINEL (Defense & Shielding)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Unbreakable defenders with supreme shielding and armor.',
    icon: '🛡️',
    color: '#3b82f6',
    ascendancyClass: 'sentinel',
    subClasses: [
      {
        id: 'sentinel_guardian',
        name: 'Guardian',
        description: 'Supreme shield technology and energy defense.',
        icon: '🔮',
        nodes: [
          { id: 'sg_1', name: 'Shield Mastery', description: '+10% shield HP', icon: '🛡️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'shieldHp', value: 10, isPercent: true }], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_2', name: 'Shield Recharge', description: '+15% shield recharge rate', icon: '♻️', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'shieldRecharge', value: 15, isPercent: true }], requires: ['sg_1'], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_3', name: 'Capacitor Grid', description: '+20% capacitor capacity', icon: '🔋', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'capacitorCapacity', value: 20, isPercent: true }], requires: ['sg_2'], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_4', name: 'Hardened Shields', description: '+25% shield HP, +20% shield recharge', icon: '🔒', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'shieldHp', value: 25, isPercent: true }, { stat: 'shieldRecharge', value: 20, isPercent: true }], requires: ['sg_3'], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_5', name: 'Cap Recharge', description: '+20% capacitor recharge', icon: '⚡', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'capacitorRecharge', value: 20, isPercent: true }], requires: ['sg_3'], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_6', name: 'Ethereal Ward', description: '+50% shield HP, shields absorb 20% of hull damage', icon: '✨', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'shieldHp', value: 50, isPercent: true }], requires: ['sg_4'], ascendancyClass: 'sentinel', subClass: 'guardian' },
          { id: 'sg_7', name: 'Impenetrable', description: 'Shields absorb 40% hull damage, +100% shield HP, +50% recharge', icon: '💎', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'shieldHp', value: 100, isPercent: true }, { stat: 'shieldRecharge', value: 50, isPercent: true }], requires: ['sg_6'], ascendancyClass: 'sentinel', subClass: 'guardian' },
        ]
      },
      {
        id: 'sentinel_bulwark',
        name: 'Bulwark',
        description: 'Maximum armor and damage reduction.',
        icon: '🏰',
        nodes: [
          { id: 'sb_1', name: 'Armor Plating', description: '+10% armor value', icon: '🛡️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'armorValue', value: 10, isPercent: true }], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_2', name: 'Damage Reduction', description: '+8% damage reduction', icon: '🛡️', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'damageReduction', value: 8, isPercent: true }], requires: ['sb_1'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_3', name: 'Hull Fortification', description: '+20% hull HP', icon: '❤️', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'hullHp', value: 20, isPercent: true }], requires: ['sb_2'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_4', name: 'Fortress', description: '+30% armor, +15% damage reduction', icon: '🏰', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'armorValue', value: 30, isPercent: true }, { stat: 'damageReduction', value: 15, isPercent: true }], requires: ['sb_3'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_5', name: 'Health Regen', description: '+25% health regeneration', icon: '💚', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'healthRegen', value: 25, isPercent: true }], requires: ['sb_3'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_6', name: 'Unbreakable Wall', description: '+50% all defenses, take 20% less damage from all sources', icon: '🏛️', rarity: 'keystone', tier: 55, requiredLevel: 550, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'armorValue', value: 50, isPercent: true }, { stat: 'damageReduction', value: 20, isPercent: true }], requires: ['sb_4'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
          { id: 'sb_7', name: 'Immortal Fortress', description: 'Take 50% less damage, +100% hull/shield/armor, immune to critical hits', icon: '👑', rarity: 'ascendancy', tier: 95, requiredLevel: 950, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'damageReduction', value: 50, isPercent: true }, { stat: 'hullHp', value: 100, isPercent: true }], requires: ['sb_6'], ascendancyClass: 'sentinel', subClass: 'bulwark' },
        ]
      },
      {
        id: 'sentinel_healer',
        name: 'Fleet Medic',
        description: 'Repair and logistics support for the fleet.',
        icon: '💚',
        nodes: [
          { id: 'sh_1', name: 'Repair Basics', description: '+10% repair amount', icon: '🔧', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'repairAmount', value: 10, isPercent: true }], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_2', name: 'Logistics Bandwidth', description: '+15% logistics bandwidth', icon: '📡', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'logisticsBandwidth', value: 15, isPercent: true }], requires: ['sh_1'], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_3', name: 'Remote Repair', description: '+20% repair range', icon: '🔧', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'repairAmount', value: 20, isPercent: true }], requires: ['sh_2'], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_4', name: 'Fleet Healer', description: '+40% repair amount, +25% logistics bandwidth', icon: '💚', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'repairAmount', value: 40, isPercent: true }, { stat: 'logisticsBandwidth', value: 25, isPercent: true }], requires: ['sh_3'], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_5', name: 'Health Regen Aura', description: 'All ships in range regenerate 2% hull/sec', icon: '✨', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'healthRegen', value: 20, isPercent: true }], requires: ['sh_3'], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_6', name: 'Miracle Worker', description: '+60% repair, chance to fully repair destroyed ships', icon: '🌟', rarity: 'keystone', tier: 60, requiredLevel: 600, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'repairAmount', value: 60, isPercent: true }], requires: ['sh_4'], ascendancyClass: 'sentinel', subClass: 'healer' },
          { id: 'sh_7', name: 'Immortality Engine', description: 'All ships in fleet auto-repair to full, immune to destruction once per battle', icon: '♾️', rarity: 'ascendancy', tier: 99, requiredLevel: 999, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'repairAmount', value: 100, isPercent: true }, { stat: 'healthRegen', value: 50, isPercent: true }], requires: ['sh_6'], ascendancyClass: 'sentinel', subClass: 'healer' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. EXPLORER (Speed & Navigation)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'explorer_class',
    name: 'Explorer',
    description: 'Masters of warp travel, scanning, and deep space navigation.',
    icon: '🔭',
    color: '#10b981',
    ascendancyClass: 'explorer',
    subClasses: [
      {
        id: 'explorer_pathfinder',
        name: 'Pathfinder',
        description: 'Unmatched warp speed and navigation.',
        icon: '🚀',
        nodes: [
          { id: 'ep_1', name: 'Warp Efficiency', description: '+10% warp speed', icon: '🚀', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'warpSpeed', value: 10, isPercent: true }], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_2', name: 'Flight Speed', description: '+12% flight velocity', icon: '✈️', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'flightVelocity', value: 12, isPercent: true }], requires: ['ep_1'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_3', name: 'Agility', description: '+15% ship agility', icon: '🦅', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'agility', value: 15, isPercent: true }], requires: ['ep_2'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_4', name: 'Light Speed', description: '+30% warp speed, +25% flight velocity', icon: '💨', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'warpSpeed', value: 30, isPercent: true }, { stat: 'flightVelocity', value: 25, isPercent: true }], requires: ['ep_3'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_5', name: 'Warp Stability', description: '+20% warp stability', icon: '🌀', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'warpStability', value: 20, isPercent: true }], requires: ['ep_3'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_6', name: 'Warp Gate Network', description: '+50% warp speed, unlock instant warp to explored systems', icon: '🌀', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'warpSpeed', value: 50, isPercent: true }], requires: ['ep_4'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
          { id: 'ep_7', name: 'Transcendent Speed', description: '+100% all speed, instant warp, teleport once per battle', icon: '⚡', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'warpSpeed', value: 100, isPercent: true }, { stat: 'flightVelocity', value: 100, isPercent: true }], requires: ['ep_6'], ascendancyClass: 'explorer', subClass: 'pathfinder' },
        ]
      },
      {
        id: 'explorer_scout',
        name: 'Scout',
        description: 'Superior scanning and sensor capabilities.',
        icon: '📡',
        nodes: [
          { id: 'es_1', name: 'Enhanced Sensors', description: '+10% sensor strength', icon: '📡', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'sensorStrength', value: 10, isPercent: true }], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_2', name: 'Scan Resolution', description: '+15% scan resolution', icon: '🔍', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'scanResolution', value: 15, isPercent: true }], requires: ['es_1'], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_3', name: 'Signature Reduction', description: '-15% signature radius', icon: '👻', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'signatureRadius', value: 15, isPercent: true }], requires: ['es_2'], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_4', name: 'Master Scout', description: '+30% sensor strength, +25% scan resolution', icon: '🔭', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'sensorStrength', value: 30, isPercent: true }, { stat: 'scanResolution', value: 25, isPercent: true }], requires: ['es_3'], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_5', name: 'Avoidance', description: '+15% avoidance', icon: '💨', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'avoidance', value: 15, isPercent: true }], requires: ['es_3'], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_6', name: 'Ghost Protocol', description: '-40% signature, +30% avoidance, cannot be locked for 5s', icon: '👻', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'signatureRadius', value: 40, isPercent: true }, { stat: 'avoidance', value: 30, isPercent: true }], requires: ['es_4'], ascendancyClass: 'explorer', subClass: 'scout' },
          { id: 'es_7', name: 'Invisible Hand', description: 'Permanently cloaked when not attacking, +100% scan range', icon: '🌌', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'signatureRadius', value: 80, isPercent: true }, { stat: 'sensorStrength', value: 100, isPercent: true }], requires: ['es_6'], ascendancyClass: 'explorer', subClass: 'scout' },
        ]
      },
      {
        id: 'explorer_salvager',
        name: 'Salvager',
        description: 'Maximize resource recovery from space.',
        icon: '⛏️',
        nodes: [
          { id: 'exs_1', name: 'Mining Boost', description: '+10% mining yield', icon: '⛏️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'miningYield', value: 10, isPercent: true }], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_2', name: 'Processing', description: '+12% processing speed', icon: '⚙️', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'processingSpeed', value: 12, isPercent: true }], requires: ['exs_1'], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_3', name: 'Deep Mining', description: '+15% mining yield', icon: '⛏️', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'miningYield', value: 15, isPercent: true }], requires: ['exs_2'], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_4', name: 'Resource Recovery', description: '+25% mining yield, +20% processing speed', icon: '💎', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'miningYield', value: 25, isPercent: true }, { stat: 'processingSpeed', value: 20, isPercent: true }], requires: ['exs_3'], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_5', name: 'Cargo Master', description: '+20% cargo capacity', icon: '📦', rarity: 'normal', tier: 15, requiredLevel: 150, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'cargoCapacity', value: 20, isPercent: true }], requires: ['exs_3'], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_6', name: 'Asteroid Breaker', description: '+50% mining yield, chance for double resources', icon: '☄️', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'miningYield', value: 50, isPercent: true }], requires: ['exs_4'], ascendancyClass: 'explorer', subClass: 'salvager' },
          { id: 'exs_7', name: 'Cosmic Harvest', description: '+100% mining yield, all resources doubled, +50% cargo', icon: '🌟', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'miningYield', value: 100, isPercent: true }, { stat: 'cargoCapacity', value: 50, isPercent: true }], requires: ['exs_6'], ascendancyClass: 'explorer', subClass: 'salvager' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 5. SPYMASTER (Espionage & EW)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'spymaster',
    name: 'Spymaster',
    description: 'Masters of espionage, electronic warfare, and sabotage.',
    icon: '🕵️',
    color: '#8b5cf6',
    ascendancyClass: 'spymaster',
    subClasses: [
      {
        id: 'spymaster_infiltrator',
        name: 'Infiltrator',
        description: 'Stealth operations and sabotage.',
        icon: '🔪',
        nodes: [
          { id: 'si_1', name: 'Stealth Basics', description: '+10% EW strength', icon: '🕵️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'electronicWarfare', value: 10, isPercent: true }], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_2', name: 'Sig Reduction', description: '-12% signature radius', icon: '👻', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'signatureRadius', value: 12, isPercent: true }], requires: ['si_1'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_3', name: 'Sabotage', description: '+20% espionage mission success', icon: '💣', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'electronicWarfare', value: 20, isPercent: true }], requires: ['si_2'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_4', name: 'Master Saboteur', description: '+35% EW strength, +25% sabotage damage', icon: '🔥', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'electronicWarfare', value: 35, isPercent: true }], requires: ['si_3'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_5', name: 'Crowd Control', description: '+20% crowd control strength', icon: '🔗', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'crowdControl', value: 20, isPercent: true }], requires: ['si_3'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_6', name: 'Shadow Network', description: '+50% EW strength, can hack enemy modules', icon: '🕸️', rarity: 'keystone', tier: 55, requiredLevel: 550, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'electronicWarfare', value: 50, isPercent: true }], requires: ['si_4'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
          { id: 'si_7', name: 'Shadow Emperor', description: 'Control enemy ships for 10s, +100% EW, undetectable', icon: '👑', rarity: 'ascendancy', tier: 95, requiredLevel: 950, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'electronicWarfare', value: 100, isPercent: true }, { stat: 'crowdControl', value: 50, isPercent: true }], requires: ['si_6'], ascendancyClass: 'spymaster', subClass: 'infiltrator' },
        ]
      },
      {
        id: 'spymaster_manipulator',
        name: 'Manipulator',
        description: 'Social engineering and diplomatic subterfuge.',
        icon: '🎭',
        nodes: [
          { id: 'sm_1', name: 'Silver Tongue', description: '+10% diplomacy bonus', icon: '🗣️', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'diplomacyBonus', value: 10, isPercent: true }], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_2', name: 'Prestige Gain', description: '+12% prestige bonus', icon: '⭐', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'prestigeBonus', value: 12, isPercent: true }], requires: ['sm_1'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_3', name: 'Blackmail', description: '+15% spy mission rewards', icon: '📋', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'diplomacyBonus', value: 15, isPercent: true }], requires: ['sm_2'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_4', name: 'Puppet Master', description: '+30% diplomacy, +20% prestige gain', icon: '🎭', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'diplomacyBonus', value: 30, isPercent: true }, { stat: 'prestigeBonus', value: 20, isPercent: true }], requires: ['sm_3'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_5', name: 'Espionage Boost', description: '+15% espionage success rate', icon: '🕵️', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'electronicWarfare', value: 15, isPercent: true }], requires: ['sm_3'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_6', name: 'Mind Control', description: '+50% diplomacy, can convert enemy diplomats', icon: '🧠', rarity: 'keystone', tier: 60, requiredLevel: 600, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'diplomacyBonus', value: 50, isPercent: true }], requires: ['sm_4'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
          { id: 'sm_7', name: 'Puppet Emperor', description: 'Control enemy alliance decisions, +100% all spy stats', icon: '👁️', rarity: 'ascendancy', tier: 99, requiredLevel: 999, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'diplomacyBonus', value: 100, isPercent: true }, { stat: 'electronicWarfare', value: 100, isPercent: true }], requires: ['sm_6'], ascendancyClass: 'spymaster', subClass: 'manipulator' },
        ]
      },
      {
        id: 'spymaster_assassin',
        name: 'Assassin',
        description: 'Precision strikes and high-value target elimination.',
        icon: '🗡️',
        nodes: [
          { id: 'sa_1', name: 'Precision Strike', description: '+8% crit chance', icon: '🎯', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'weaponCritChance', value: 8, isPercent: true }], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_2', name: 'Lethal Damage', description: '+15% crit damage', icon: '💀', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'weaponCritDamage', value: 15, isPercent: true }], requires: ['sa_1'], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_3', name: 'Targeting', description: '+15% targeting speed', icon: '🎯', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'targetingSpeed', value: 15, isPercent: true }], requires: ['sa_2'], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_4', name: 'Death Mark', description: '+25% damage to single targets', icon: '☠️', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'weaponDamage', value: 25, isPercent: true }], requires: ['sa_3'], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_5', name: 'First Strike', description: '+20% damage on first attack', icon: '⚡', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'weaponDamage', value: 20, isPercent: true }], requires: ['sa_3'], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_6', name: 'Deadly Focus', description: '+40% crit chance, +50% crit damage', icon: '🗡️', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'weaponCritChance', value: 40, isPercent: true }, { stat: 'weaponCritDamage', value: 50, isPercent: true }], requires: ['sa_4'], ascendancyClass: 'spymaster', subClass: 'assassin' },
          { id: 'sa_7', name: 'Phantom Strike', description: 'First attack always crits for 500% damage, +100% all damage', icon: '👻', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'weaponCritChance', value: 100, isPercent: true }, { stat: 'weaponCritDamage', value: 100, isPercent: true }], requires: ['sa_6'], ascendancyClass: 'spymaster', subClass: 'assassin' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 6. SUMMONER (Crew & Companions)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'summoner',
    name: 'Summoner',
    description: 'Masters of crew effectiveness, companion ships, and fleet synergy.',
    icon: '🐉',
    color: '#ec4899',
    ascendancyClass: 'summoner',
    subClasses: [
      {
        id: 'summoner_beastmaster',
        name: 'Beastmaster',
        description: 'Command powerful companion entities.',
        icon: '🐾',
        nodes: [
          { id: 'sbm_1', name: 'Companion Bond', description: '+10% summon power', icon: '🐾', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'summonPower', value: 10, isPercent: true }], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_2', name: 'Pack Leader', description: '+12% crew efficiency', icon: '👥', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 12, isPercent: true }], requires: ['sbm_1'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_3', name: 'Feral Instinct', description: '+15% summon power', icon: '🦁', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'summonPower', value: 15, isPercent: true }], requires: ['sbm_2'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_4', name: 'Alpha Companion', description: '+30% summon power, +20% crew efficiency', icon: '🐉', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'summonPower', value: 30, isPercent: true }, { stat: 'crewEfficiency', value: 20, isPercent: true }], requires: ['sbm_3'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_5', name: 'Swarm', description: '+20% summon count', icon: '🐝', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'summonPower', value: 20, isPercent: true }], requires: ['sbm_3'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_6', name: 'Apex Predator', description: '+50% summon power, summons are immune to damage for 5s', icon: '👑', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'summonPower', value: 50, isPercent: true }], requires: ['sbm_4'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
          { id: 'sbm_7', name: 'Legendary Beast', description: 'Summon a legendary companion, +100% all summon stats', icon: '🌟', rarity: 'ascendancy', tier: 90, requiredLevel: 900, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'summonPower', value: 100, isPercent: true }, { stat: 'crewEfficiency', value: 50, isPercent: true }], requires: ['sbm_6'], ascendancyClass: 'summoner', subClass: 'beastmaster' },
        ]
      },
      {
        id: 'summoner_commander',
        name: 'Fleet Commander',
        description: 'Maximize fleet synergy and crew effectiveness.',
        icon: '🎖️',
        nodes: [
          { id: 'sfc_1', name: 'Command Training', description: '+10% crew efficiency', icon: '👥', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 10, isPercent: true }], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_2', name: 'Fleet Coordination', description: '+12% fleet command range', icon: '📡', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'fleetCommandRange', value: 12, isPercent: true }], requires: ['sfc_1'], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_3', name: 'Battle Hardened', description: '+15% crew efficiency', icon: '🎖️', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 15, isPercent: true }], requires: ['sfc_2'], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_4', name: 'Admiral', description: '+30% crew efficiency, +25% fleet command range', icon: '⚓', rarity: 'notable', tier: 30, requiredLevel: 300, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 30, isPercent: true }, { stat: 'fleetCommandRange', value: 25, isPercent: true }], requires: ['sfc_3'], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_5', name: 'Leadership Aura', description: '+15% all stats for nearby ships', icon: '✨', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'crewEfficiency', value: 15, isPercent: true }], requires: ['sfc_3'], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_6', name: 'Supreme Admiral', description: '+60% crew efficiency, all ships gain +20% all stats', icon: '🏆', rarity: 'keystone', tier: 60, requiredLevel: 600, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 60, isPercent: true }], requires: ['sfc_4'], ascendancyClass: 'summoner', subClass: 'commander' },
          { id: 'sfc_7', name: 'Legendary Commander', description: '+100% crew efficiency, all fleet ships gain +50% all stats', icon: '👑', rarity: 'ascendancy', tier: 99, requiredLevel: 999, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'crewEfficiency', value: 100, isPercent: true }, { stat: 'fleetCommandRange', value: 50, isPercent: true }], requires: ['sfc_6'], ascendancyClass: 'summoner', subClass: 'commander' },
        ]
      },
      {
        id: 'summoner_alchemist',
        name: 'Alchemist',
        description: 'Craft powerful consumables and augmentations.',
        icon: '⚗️',
        nodes: [
          { id: 'sa_1', name: 'Basic Crafting', description: '+10% resource bonus', icon: '🧪', rarity: 'normal', tier: 1, requiredLevel: 10, requiredPoints: 1, x: 0, y: 0, modifiers: [{ stat: 'resourceBonus', value: 10, isPercent: true }], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_2', name: 'Potion Mastery', description: '+12% XP bonus', icon: '⭐', rarity: 'normal', tier: 5, requiredLevel: 50, requiredPoints: 1, x: 1, y: 0, modifiers: [{ stat: 'xpBonus', value: 12, isPercent: true }], requires: ['sa_1'], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_3', name: 'Transmutation', description: '+15% resource bonus', icon: '⚗️', rarity: 'normal', tier: 10, requiredLevel: 100, requiredPoints: 1, x: 2, y: 0, modifiers: [{ stat: 'resourceBonus', value: 15, isPercent: true }], requires: ['sa_2'], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_4', name: 'Philosopher Stone', description: '+30% resource bonus, +20% XP bonus', icon: '💎', rarity: 'notable', tier: 25, requiredLevel: 250, requiredPoints: 3, x: 3, y: 0, modifiers: [{ stat: 'resourceBonus', value: 30, isPercent: true }, { stat: 'xpBonus', value: 20, isPercent: true }], requires: ['sa_3'], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_5', name: 'Turn Optimizer', description: '+15% turn efficiency', icon: '⏱️', rarity: 'normal', tier: 20, requiredLevel: 200, requiredPoints: 2, x: 2, y: 1, modifiers: [{ stat: 'turnEfficiency', value: 15, isPercent: true }], requires: ['sa_3'], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_6', name: 'Golden Touch', description: '+50% resource bonus, all crafting costs reduced 30%', icon: '🥇', rarity: 'keystone', tier: 50, requiredLevel: 500, requiredPoints: 5, x: 4, y: 0, modifiers: [{ stat: 'resourceBonus', value: 50, isPercent: true }], requires: ['sa_4'], ascendancyClass: 'summoner', subClass: 'alchemist' },
          { id: 'sa_7', name: 'Elixir of Eternity', description: '+100% all bonuses, craft legendary items, +200% XP', icon: '🏆', rarity: 'ascendancy', tier: 95, requiredLevel: 950, requiredPoints: 12, x: 5, y: 0, modifiers: [{ stat: 'resourceBonus', value: 100, isPercent: true }, { stat: 'xpBonus', value: 200, isPercent: true }], requires: ['sa_6'], ascendancyClass: 'summoner', subClass: 'alchemist' },
        ]
      }
    ]
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Get total talent points earned for a given level */
export function getTalentPointsForLevel(level: number): number {
  let points = level; // 1 point per level
  // Bonus points at milestones
  if (level >= 100) points += 10;
  if (level >= 300) points += 30;
  if (level >= 600) points += 60;
  if (level >= 999) points += 100;
  return points;
}

/** Get ascendancy points earned for a given level */
export function getAscendancyPointsForLevel(level: number): number {
  let points = 0;
  if (level >= 100) points += 1;
  if (level >= 300) points += 1;
  if (level >= 600) points += 1;
  if (level >= 999) points += 1;
  return points;
}

/** Check if a node can be allocated */
export function canAllocateNode(
  node: TalentNode,
  state: CommanderTalentState,
  commanderLevel: number,
  availablePoints: number
): boolean {
  if (state.allocatedNodes.includes(node.id)) return false;
  if (commanderLevel < node.requiredLevel) return false;
  
  const spentOnTree = state.allocatedNodes.length;
  const totalPoints = getTalentPointsForLevel(commanderLevel);
  const remaining = totalPoints - spentOnTree;
  if (remaining < node.requiredPoints) return false;

  // Check prerequisites
  if (node.requires && node.requires.length > 0) {
    const hasAllPrereqs = node.requires.every(reqId => state.allocatedNodes.includes(reqId));
    if (!hasAllPrereqs) return false;
  }

  // Ascendancy nodes need ascendancy points
  if (node.rarity === 'ascendancy') {
    if (state.ascendancyPointsSpent >= state.ascendancyPoints) return false;
  }

  return true;
}

/** Calculate total stat modifiers from allocated nodes */
export function calculateTalentModifiers(
  state: CommanderTalentState
): Partial<Record<StatType, number>> {
  const modifiers: Partial<Record<StatType, number>> = {};
  
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      for (const node of sub.nodes) {
        if (state.allocatedNodes.includes(node.id)) {
          for (const mod of node.modifiers) {
            if (mod.isPercent) {
              modifiers[mod.stat] = (modifiers[mod.stat] || 0) + mod.value;
            } else {
              modifiers[mod.stat] = (modifiers[mod.stat] || 0) + mod.value;
            }
          }
        }
      }
    }
  }
  
  return modifiers;
}

/** Get all nodes in a tree */
export function getAllNodes(): TalentNode[] {
  const nodes: TalentNode[] = [];
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      nodes.push(...sub.nodes);
    }
  }
  return nodes;
}

/** Get node by ID */
export function getNodeById(id: string): TalentNode | undefined {
  return getAllNodes().find(n => n.id === id);
}