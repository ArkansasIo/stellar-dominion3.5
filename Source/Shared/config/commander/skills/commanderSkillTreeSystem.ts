/**
 * COMMANDER SKILL TREE SYSTEM (Poe2-Inspired)
 * ============================================================================
 * Deep skill system with active skills, support gems, and passive trees.
 * Inspired by Path of Exile 2's skill gem and support system.
 *
 * UML Design:
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                    CommanderSkillTree                            │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │ - id: string                                                    │
 *   │ - name: string                                                  │
 *   │ - class: SkillClass                                             │
 *   │ - nodes: SkillNode[]                                            │
 *   │ - connections: SkillConnection[]                                 │
 *   │ - allocatedPoints: number                                       │
 *   │ - maxPoints: number                                             │
 *   └─────────────────────────────────────────────────────────────────┘
 *                                  │
 *                                  ▼
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                      SkillNode                                   │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │ - id: string                                                    │
 *   │ - type: 'normal' | 'notable' | 'keystone' | 'ascendancy'       │
 *   │ - skill: ActiveSkill | PassiveSkill                             │
 *   │ - position: { x: number; y: number }                            │
 *   │ - cost: number                                                  │
 *   │ - requires: string[]                                            │
 *   └─────────────────────────────────────────────────────────────────┘
 *                                  │
 *                    ┌─────────────┴─────────────┐
 *                    ▼                           ▼
 *   ┌────────────────────────────┐  ┌────────────────────────────┐
 *   │       ActiveSkill          │  │       PassiveSkill         │
 *   ├────────────────────────────┤  ├────────────────────────────┤
 *   │ - name: string             │  │ - name: string             │
 *   │ - type: SkillType          │  │ - effect: StatModifier     │
 *   │ - damage: DamageProfile    │  │ - radius: number           │
 *   │ - cooldown: number         │  │ - duration: number         │
 *   │ - manaCost: number         │  │ - stacks: number           │
 *   │ - supportSlots: number     │  │ - condition: string        │
 *   │ - level: number            │  │ - maxLevel: number         │
 *   │ - quality: number          │  │                            │
 *   │ - tags: string[]           │  │                            │
 *   └────────────────────────────┘  └────────────────────────────┘
 *                    │
 *                    ▼
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                      SupportGem                                  │
 *   ├─────────────────────────────────────────────────────────────────┤
 *   │ - id: string                                                    │
 *   │ - name: string                                                  │
 *   │ - type: SupportType                                             │
 *   │ - effect: SkillModifier                                        │
 *   │ - multiplier: number                                            │
 *   │ - requiredLevel: number                                         │
 *   │ - tags: string[]                                                │
 *   └─────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SkillClass =
  | 'warrior' | 'mage' | 'ranger' | 'rogue' | 'summoner' | 'engineer'
  | 'paladin' | 'necromancer' | 'elementalist' | 'shadow' | 'berserker' | 'guardian';

export type SkillType =
  | 'attack' | 'spell' | 'buff' | 'aura' | 'curse' | 'minion'
  | 'movement' | 'utility' | 'totem' | 'trap' | 'mine' | 'trigger';

export type SupportType =
  | 'damage' | 'aoe' | 'duration' | 'chain' | 'projectile' | 'area'
  | 'speed' | 'crit' | 'penetration' | 'leech' | 'elemental' | 'chaos'
  | 'physical' | 'fire' | 'ice' | 'lightning' | 'void' | 'curse'
  | 'minion' | 'totem' | 'trap' | 'mine' | 'trigger' | 'brand';

export type GemColor = 'red' | 'green' | 'blue' | 'white' | 'prismatic';

export type PrimaryAttribute = 'strength' | 'dexterity' | 'intelligence' | 'willpower' | 'perception' | 'charisma' | 'memory';

export interface SkillModifier {
  stat: string;
  value: number;
  isPercent: boolean;
  multiplier?: number;
}

export interface DamageProfile {
  base: number;
  type: 'physical' | 'fire' | 'ice' | 'lightning' | 'void' | 'chaos' | 'true';
  scaling: number;
  aoe: number;
  projectiles: number;
}

export interface SkillGem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: GemColor;
  type: SkillType;
  class: SkillClass;
  level: number;
  maxLevel: number;
  quality: number;
  maxQuality: number;
  experience: number;
  expToNext: number;
  manaCost: number;
  cooldown: number;
  castTime: number;
  damage?: DamageProfile;
  tags: string[];
  effects: SkillModifier[];
  supportSlots: number;
  equipped: boolean;
  equippedSlot?: number;
}

export interface SupportGem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: GemColor;
  type: SupportType;
  level: number;
  maxLevel: number;
  quality: number;
  requiredLevel: number;
  tags: string[];
  effects: SkillModifier[];
  multiplier: number;
  maxMultiplier: number;
}

export interface SkillSlot {
  id: number;
  name: string;
  activeGem: SkillGem | null;
  supportGems: SupportGem[];
  isActive: boolean;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  class: SkillClass;
  icon: string;
  color: string;
  nodes: SkillTreeNode[];
  connections: SkillConnection[];
  allocatedPoints: number;
  maxPoints: number;
}

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'normal' | 'notable' | 'keystone' | 'ascendancy';
  position: { x: number; y: number };
  cost: number;
  requires: string[];
  effects: SkillModifier[];
  allocated: boolean;
  requiredLevel: number;
  color: string;
}

export interface SkillConnection {
  from: string;
  to: string;
  type: 'normal' | 'ascendancy';
  allocated: boolean;
}

export interface SkillLoadout {
  id: string;
  name: string;
  description: string;
  icon: string;
  slots: SkillSlot[];
  trees: string[];
  activeTree: string;
  level: number;
  experience: number;
}

export interface SkillBookState {
  loadouts: SkillLoadout[];
  activeLoadoutId: string;
  skillPoints: number;
  ascendancyPoints: number;
  gems: SkillGem[];
  supportGems: SupportGem[];
  unlockedTrees: string[];
  totalAllocated: number;
}

// ============================================================================
// SKILL GEMS CATALOG
// ============================================================================

export const SKILL_GEMS: SkillGem[] = [
  // ── WARRIOR SKILLS ──
  {
    id: 'gem_battle_cry', name: 'Battle Cry', description: 'Lets out a war cry, increasing damage for nearby allies.',
    icon: '📣', color: 'red', type: 'buff', class: 'warrior', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 25, cooldown: 30, castTime: 0.5, tags: ['warrior', 'buff', 'aura'],
    effects: [{ stat: 'weaponDamage', value: 15, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_cleave', name: 'Cleave', description: 'A sweeping attack that hits all nearby enemies.',
    icon: '⚔️', color: 'red', type: 'attack', class: 'warrior', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 15, cooldown: 0, castTime: 0.8, tags: ['warrior', 'attack', 'melee', 'aoe'],
    damage: { base: 100, type: 'physical', scaling: 1.5, aoe: 3, projectiles: 1 }, effects: [],
    supportSlots: 4, equipped: false,
  },
  {
    id: 'gem_whirlwind', name: 'Whirlwind', description: 'Spin rapidly, damaging all enemies in range.',
    icon: '🌀', color: 'red', type: 'attack', class: 'warrior', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 150, manaCost: 20, cooldown: 5, castTime: 0.6, tags: ['warrior', 'attack', 'melee', 'aoe', 'movement'],
    damage: { base: 80, type: 'physical', scaling: 1.2, aoe: 4, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_shield_bash', name: 'Shield Bash', description: 'Bash enemies with your shield, stunning them.',
    icon: '🛡️', color: 'red', type: 'attack', class: 'warrior', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 12, cooldown: 4, castTime: 0.7, tags: ['warrior', 'attack', 'melee', 'stun'],
    damage: { base: 120, type: 'physical', scaling: 1.8, aoe: 2, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_war_cry', name: 'War Cry', description: 'Boosts morale, granting temporary stat increases.',
    icon: '🏴', color: 'red', type: 'buff', class: 'warrior', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 45, castTime: 0.3, tags: ['warrior', 'buff', 'morale'],
    effects: [{ stat: 'weaponDamage', value: 20, isPercent: true }, { stat: 'hullHp', value: 10, isPercent: true }],
    supportSlots: 2, equipped: false,
  },

  // ── MAGE SKILLS ──
  {
    id: 'gem_fireball', name: 'Fireball', description: 'Launches an exploding fireball.',
    icon: '🔥', color: 'blue', type: 'spell', class: 'mage', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 0, castTime: 0.9, tags: ['mage', 'spell', 'fire', 'projectile'],
    damage: { base: 150, type: 'fire', scaling: 2.0, aoe: 2, projectiles: 1 }, effects: [],
    supportSlots: 4, equipped: false,
  },
  {
    id: 'gem_ice_nova', name: 'Ice Nova', description: 'Creates a freezing nova around the caster.',
    icon: '❄️', color: 'blue', type: 'spell', class: 'mage', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 25, cooldown: 3, castTime: 0.8, tags: ['mage', 'spell', 'ice', 'aoe'],
    damage: { base: 120, type: 'ice', scaling: 1.8, aoe: 5, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_lightning_bolt', name: 'Lightning Bolt', description: 'Calls down a bolt of lightning.',
    icon: '⚡', color: 'blue', type: 'spell', class: 'mage', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 18, cooldown: 0, castTime: 0.7, tags: ['mage', 'spell', 'lightning', 'projectile'],
    damage: { base: 180, type: 'lightning', scaling: 2.2, aoe: 1, projectiles: 3 }, effects: [],
    supportSlots: 4, equipped: false,
  },
  {
    id: 'gem_arcane_shield', name: 'Arcane Shield', description: 'Creates a magical shield that absorbs damage.',
    icon: '🔮', color: 'blue', type: 'buff', class: 'mage', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 20, castTime: 0.5, tags: ['mage', 'buff', 'shield'],
    effects: [{ stat: 'shieldHp', value: 25, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_mana_surge', name: 'Mana Surge', description: 'Restores mana and increases mana regeneration.',
    icon: '💧', color: 'blue', type: 'buff', class: 'mage', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 0, cooldown: 30, castTime: 0.3, tags: ['mage', 'buff', 'mana'],
    effects: [{ stat: 'capacitorRecharge', value: 30, isPercent: true }], supportSlots: 1, equipped: false,
  },

  // ── RANGER SKILLS ──
  {
    id: 'gem_rapid_shot', name: 'Rapid Shot', description: 'Fires a rapid volley of projectiles.',
    icon: '🏹', color: 'green', type: 'attack', class: 'ranger', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 12, cooldown: 0, castTime: 0.5, tags: ['ranger', 'attack', 'projectile'],
    damage: { base: 80, type: 'physical', scaling: 1.0, aoe: 1, projectiles: 5 }, effects: [],
    supportSlots: 4, equipped: false,
  },
  {
    id: 'gem_snipe', name: 'Snipe', description: 'A powerful aimed shot with high critical chance.',
    icon: '🎯', color: 'green', type: 'attack', class: 'ranger', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 150, manaCost: 15, cooldown: 5, castTime: 1.5, tags: ['ranger', 'attack', 'projectile', 'crit'],
    damage: { base: 300, type: 'physical', scaling: 3.0, aoe: 1, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_trap_deploy', name: 'Trap Deploy', description: 'Deploys a trap that triggers on enemy approach.',
    icon: '🪤', color: 'green', type: 'trap', class: 'ranger', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 10, cooldown: 8, castTime: 0.3, tags: ['ranger', 'trap', 'utility'],
    damage: { base: 200, type: 'physical', scaling: 2.5, aoe: 3, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_evasion_skill', name: 'Evasion', description: 'Increases dodge chance temporarily.',
    icon: '💨', color: 'green', type: 'buff', class: 'ranger', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 15, cooldown: 15, castTime: 0.2, tags: ['ranger', 'buff', 'evasion'],
    effects: [{ stat: 'avoidance', value: 20, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_haste', name: 'Haste', description: 'Increases movement and attack speed.',
    icon: '⚡', color: 'green', type: 'buff', class: 'ranger', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 25, castTime: 0.3, tags: ['ranger', 'buff', 'speed'],
    effects: [{ stat: 'flightVelocity', value: 15, isPercent: true }, { stat: 'weaponSpeed', value: 10, isPercent: true }],
    supportSlots: 2, equipped: false,
  },

  // ── ROGUE SKILLS ──
  {
    id: 'gem_backstab', name: 'Backstab', description: 'A deadly attack from behind dealing massive damage.',
    icon: '🗡️', color: 'green', type: 'attack', class: 'rogue', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 10, cooldown: 3, castTime: 0.6, tags: ['rogue', 'attack', 'melee', 'crit'],
    damage: { base: 250, type: 'physical', scaling: 2.8, aoe: 1, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_poison_blade', name: 'Poison Blade', description: 'Applies poison damage over time.',
    icon: '☠️', color: 'green', type: 'attack', class: 'rogue', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 12, cooldown: 0, castTime: 0.7, tags: ['rogue', 'attack', 'melee', 'chaos', 'dot'],
    damage: { base: 60, type: 'chaos', scaling: 0.8, aoe: 1, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_smoke_bomb', name: 'Smoke Bomb', description: 'Creates a smoke cloud reducing enemy accuracy.',
    icon: '💨', color: 'green', type: 'utility', class: 'rogue', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 15, cooldown: 20, castTime: 0.3, tags: ['rogue', 'utility', 'debuff'],
    effects: [{ stat: 'electronicWarfare', value: 20, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_shadow_step', name: 'Shadow Step', description: 'Teleport behind the target.',
    icon: '👤', color: 'green', type: 'movement', class: 'rogue', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 10, cooldown: 8, castTime: 0.1, tags: ['rogue', 'movement', 'teleport'],
    effects: [{ stat: 'avoidance', value: 30, isPercent: true }], supportSlots: 1, equipped: false,
  },
  {
    id: 'gem_vanish', name: 'Vanish', description: 'Become invisible for a short duration.',
    icon: '👻', color: 'green', type: 'buff', class: 'rogue', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 30, castTime: 0.2, tags: ['rogue', 'buff', 'stealth'],
    effects: [{ stat: 'signatureRadius', value: 50, isPercent: true }], supportSlots: 2, equipped: false,
  },

  // ── SUMMONER SKILLS ──
  {
    id: 'gem_summon_drone', name: 'Summon Drone', description: 'Summons a combat drone.',
    icon: '🤖', color: 'blue', type: 'minion', class: 'summoner', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 25, cooldown: 10, castTime: 0.5, tags: ['summoner', 'minion', 'mechanical'],
    damage: { base: 50, type: 'physical', scaling: 0.5, aoe: 1, projectiles: 1 },
    effects: [{ stat: 'summonPower', value: 10, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_swarm_command', name: 'Swarm Command', description: 'Commands all minions to attack.',
    icon: '🐝', color: 'blue', type: 'minion', class: 'summoner', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 15, cooldown: 15, castTime: 0.3, tags: ['summoner', 'minion', 'command'],
    effects: [{ stat: 'summonPower', value: 25, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_necrotic_aura', name: 'Necrotic Aura', description: 'Drains life from nearby enemies.',
    icon: '💀', color: 'blue', type: 'aura', class: 'summoner', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 0, castTime: 0.5, tags: ['summoner', 'aura', 'chaos', 'dot'],
    effects: [{ stat: 'weaponDamage', value: 10, isPercent: true }], supportSlots: 3, equipped: false,
  },

  // ── ENGINEER SKILLS ──
  {
    id: 'gem_turret_deploy', name: 'Deploy Turret', description: 'Deploys an automated defense turret.',
    icon: '🔫', color: 'red', type: 'totem', class: 'engineer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 15, castTime: 0.8, tags: ['engineer', 'totem', 'mechanical'],
    damage: { base: 40, type: 'physical', scaling: 0.4, aoe: 5, projectiles: 1 },
    effects: [{ stat: 'weaponDamage', value: 5, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_repair_burst', name: 'Repair Burst', description: 'Repounds all nearby allied units.',
    icon: '🔧', color: 'red', type: 'spell', class: 'engineer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 25, cooldown: 10, castTime: 0.5, tags: ['engineer', 'spell', 'healing'],
    effects: [{ stat: 'repairAmount', value: 20, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_emp_pulse', name: 'EMP Pulse', description: 'Disables enemy electronics in range.',
    icon: '⚡', color: 'red', type: 'spell', class: 'engineer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 35, cooldown: 25, castTime: 0.3, tags: ['engineer', 'spell', 'electronic', 'debuff'],
    effects: [{ stat: 'electronicWarfare', value: 30, isPercent: true }], supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_overclock', name: 'Overclock', description: 'Increases all module stats temporarily.',
    icon: '⚙️', color: 'red', type: 'buff', class: 'engineer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 30, castTime: 0.3, tags: ['engineer', 'buff', 'mechanical'],
    effects: [{ stat: 'modulePowergrid', value: 20, isPercent: true }, { stat: 'moduleCpu', value: 20, isPercent: true }],
    supportSlots: 2, equipped: false,
  },

  // ── PALADIN SKILLS ──
  {
    id: 'gem_holy_light', name: 'Holy Light', description: 'Heals all nearby allies.',
    icon: '✨', color: 'white', type: 'spell', class: 'paladin', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 25, cooldown: 10, castTime: 0.5, tags: ['paladin', 'spell', 'healing'],
    effects: [{ stat: 'repairAmount', value: 25, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_divine_shield', name: 'Divine Shield', description: 'Creates a holy shield protecting allies.',
    icon: '🛡️', color: 'white', type: 'buff', class: 'paladin', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 20, castTime: 0.5, tags: ['paladin', 'buff', 'shield'],
    effects: [{ stat: 'shieldHp', value: 30, isPercent: true }, { stat: 'damageReduction', value: 10, isPercent: true }],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_consecrate', name: 'Consecrate', description: 'Consecrates an area, healing allies and damaging enemies.',
    icon: '✝️', color: 'white', type: 'spell', class: 'paladin', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 35, cooldown: 25, castTime: 0.8, tags: ['paladin', 'spell', 'aoe', 'healing', 'damage'],
    damage: { base: 100, type: 'fire', scaling: 1.5, aoe: 4, projectiles: 1 },
    effects: [{ stat: 'repairAmount', value: 15, isPercent: true }], supportSlots: 3, equipped: false,
  },

  // ── NECROMANCER SKILLS ──
  {
    id: 'gem_raise_skeleton', name: 'Raise Skeleton', description: 'Raises a skeleton from a fallen enemy.',
    icon: '💀', color: 'blue', type: 'minion', class: 'necromancer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 5, castTime: 0.5, tags: ['necromancer', 'minion', 'undead'],
    effects: [{ stat: 'summonPower', value: 10, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_life_drain', name: 'Life Drain', description: 'Drains life from enemies, healing the caster.',
    icon: '🩸', color: 'blue', type: 'spell', class: 'necromancer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 15, cooldown: 3, castTime: 0.8, tags: ['necromancer', 'spell', 'chaos', 'leech'],
    damage: { base: 120, type: 'chaos', scaling: 1.5, aoe: 2, projectiles: 1 },
    effects: [{ stat: 'healthRegen', value: 10, isPercent: true }], supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_bone_armor', name: 'Bone Armor', description: 'Creates armor from bones of the dead.',
    icon: '🦴', color: 'blue', type: 'buff', class: 'necromancer', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 20, cooldown: 15, castTime: 0.3, tags: ['necromancer', 'buff', 'armor'],
    effects: [{ stat: 'armorValue', value: 25, isPercent: true }], supportSlots: 2, equipped: false,
  },

  // ── ELEMENTALIST SKILLS ──
  {
    id: 'gem_elemental_mastery', name: 'Elemental Mastery', description: 'Enhances all elemental damage.',
    icon: '🌈', color: 'prismatic', type: 'buff', class: 'elementalist', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 40, castTime: 0.5, tags: ['elementalist', 'buff', 'elemental'],
    effects: [{ stat: 'energyWeapons', value: 20, isPercent: true }, { stat: 'kineticWeapons', value: 20, isPercent: true }],
    supportSlots: 2, equipped: false,
  },
  {
    id: 'gem_chain_lightning', name: 'Chain Lightning', description: 'Lightning that chains between enemies.',
    icon: '⚡', color: 'blue', type: 'spell', class: 'elementalist', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 22, cooldown: 0, castTime: 0.8, tags: ['elementalist', 'spell', 'lightning', 'chain'],
    damage: { base: 100, type: 'lightning', scaling: 1.5, aoe: 3, projectiles: 1 }, effects: [],
    supportSlots: 4, equipped: false,
  },

  // ── SHADOW SKILLS ──
  {
    id: 'gem_shadow_strike', name: 'Shadow Strike', description: 'A quick attack from the shadows.',
    icon: '🌑', color: 'blue', type: 'attack', class: 'shadow', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 10, cooldown: 2, castTime: 0.4, tags: ['shadow', 'attack', 'melee', 'crit'],
    damage: { base: 180, type: 'void', scaling: 2.0, aoe: 1, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
  {
    id: 'gem_void_rift', name: 'Void Rift', description: 'Opens a rift to the void, pulling enemies in.',
    icon: '🌀', color: 'blue', type: 'spell', class: 'shadow', level: 1, maxLevel: 20, quality: 0, maxQuality: 20,
    experience: 0, expToNext: 100, manaCost: 30, cooldown: 20, castTime: 1.0, tags: ['shadow', 'spell', 'void', 'aoe'],
    damage: { base: 200, type: 'void', scaling: 2.5, aoe: 5, projectiles: 1 }, effects: [],
    supportSlots: 3, equipped: false,
  },
];

// ============================================================================
// SUPPORT GEMS CATALOG
// ============================================================================

export const SUPPORT_GEMS: SupportGem[] = [
  {
    id: 'support_added_fire', name: 'Added Fire Damage', description: 'Adds fire damage to supported skills.',
    icon: '🔥', color: 'red', type: 'fire', level: 1, maxLevel: 20, quality: 0, requiredLevel: 1,
    tags: ['fire', 'damage'], effects: [{ stat: 'weaponDamage', value: 15, isPercent: false }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_added_ice', name: 'Added Ice Damage', description: 'Adds ice damage to supported skills.',
    icon: '❄️', color: 'blue', type: 'ice', level: 1, maxLevel: 20, quality: 0, requiredLevel: 1,
    tags: ['ice', 'damage'], effects: [{ stat: 'weaponDamage', value: 12, isPercent: false }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_added_lightning', name: 'Added Lightning', description: 'Adds lightning damage to supported skills.',
    icon: '⚡', color: 'blue', type: 'lightning', level: 1, maxLevel: 20, quality: 0, requiredLevel: 1,
    tags: ['lightning', 'damage'], effects: [{ stat: 'weaponDamage', value: 18, isPercent: false }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_aoe', name: 'Increased Area of Effect', description: 'Increases area of effect of supported skills.',
    icon: '🌐', color: 'blue', type: 'aoe', level: 1, maxLevel: 20, quality: 0, requiredLevel: 5,
    tags: ['aoe'], effects: [{ stat: 'weaponDamage', value: 10, isPercent: true }], multiplier: 1.0, maxMultiplier: 1.8,
  },
  {
    id: 'support_multistrike', name: 'Multistrike', description: 'Supported skills attack 3 times.',
    icon: '⚔️', color: 'red', type: 'speed', level: 1, maxLevel: 20, quality: 0, requiredLevel: 10,
    tags: ['attack', 'speed'], effects: [{ stat: 'weaponSpeed', value: 30, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.5,
  },
  {
    id: 'support_faster_casting', name: 'Faster Casting', description: 'Increases cast speed of supported spells.',
    icon: '⚡', color: 'blue', type: 'speed', level: 1, maxLevel: 20, quality: 0, requiredLevel: 5,
    tags: ['spell', 'speed'], effects: [{ stat: 'weaponSpeed', value: 20, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_critical_strikes', name: 'Critical Strikes', description: 'Increases critical strike chance.',
    icon: '🎯', color: 'green', type: 'crit', level: 1, maxLevel: 20, quality: 0, requiredLevel: 10,
    tags: ['crit'], effects: [{ stat: 'weaponCritChance', value: 20, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.2,
  },
  {
    id: 'support_critical_damage', name: 'Critical Damage', description: 'Increases critical strike damage.',
    icon: '💥', color: 'red', type: 'crit', level: 1, maxLevel: 20, quality: 0, requiredLevel: 15,
    tags: ['crit'], effects: [{ stat: 'weaponCritDamage', value: 25, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.5,
  },
  {
    id: 'support_penetration', name: 'Penetration', description: 'Enemies take increased damage from supported skills.',
    icon: '🎯', color: 'red', type: 'penetration', level: 1, maxLevel: 20, quality: 0, requiredLevel: 20,
    tags: ['damage'], effects: [{ stat: 'weaponDamage', value: 15, isPercent: true }], multiplier: 1.0, maxMultiplier: 1.5,
  },
  {
    id: 'support_life_leech', name: 'Life Leech', description: 'Leech life from enemy damage.',
    icon: '🩸', color: 'red', type: 'leech', level: 1, maxLevel: 20, quality: 0, requiredLevel: 10,
    tags: ['leech'], effects: [{ stat: 'healthRegen', value: 5, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_mana_leech', name: 'Mana Leech', description: 'Leech mana from enemy damage.',
    icon: '💧', color: 'blue', type: 'leech', level: 1, maxLevel: 20, quality: 0, requiredLevel: 10,
    tags: ['leech'], effects: [{ stat: 'capacitorRecharge', value: 5, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_chain', name: 'Chain', description: 'Projectiles chain to additional targets.',
    icon: '🔗', color: 'blue', type: 'chain', level: 1, maxLevel: 20, quality: 0, requiredLevel: 15,
    tags: ['projectile', 'chain'], effects: [{ stat: 'weaponDamage', value: 10, isPercent: false }], multiplier: 1.0, maxMultiplier: 1.8,
  },
  {
    id: 'support_projectile', name: 'Extra Projectiles', description: 'Fires additional projectiles.',
    icon: '🎯', color: 'green', type: 'projectile', level: 1, maxLevel: 20, quality: 0, requiredLevel: 10,
    tags: ['projectile'], effects: [{ stat: 'weaponDamage', value: 5, isPercent: false }], multiplier: 1.0, maxMultiplier: 1.5,
  },
  {
    id: 'support_duration', name: 'Increased Duration', description: 'Increases duration of buffs and effects.',
    icon: '⏱️', color: 'green', type: 'duration', level: 1, maxLevel: 20, quality: 0, requiredLevel: 5,
    tags: ['duration'], effects: [{ stat: 'weaponDamage', value: 5, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.0,
  },
  {
    id: 'support_faster_attacks', name: 'Faster Attacks', description: 'Increases attack speed.',
    icon: '⚔️', color: 'green', type: 'speed', level: 1, maxLevel: 20, quality: 0, requiredLevel: 5,
    tags: ['attack', 'speed'], effects: [{ stat: 'weaponSpeed', value: 20, isPercent: true }], multiplier: 1.0, maxMultiplier: 2.0,
  },
];

// ============================================================================
// SKILL TREE DEFINITIONS
// ============================================================================

export const SKILL_TREES: SkillTree[] = [
  {
    id: 'tree_warrior', name: 'Warrior Tree', description: 'Combat and melee specialization.', class: 'warrior',
    icon: '⚔️', color: '#dc2626', allocatedPoints: 0, maxPoints: 120,
    nodes: [
      { id: 'w_1', name: 'Strength I', description: '+5% weapon damage', icon: '💪', type: 'normal', position: { x: 0, y: 0 }, cost: 1, requires: [], effects: [{ stat: 'weaponDamage', value: 5, isPercent: true }], allocated: false, requiredLevel: 1, color: '#dc2626' },
      { id: 'w_2', name: 'Strength II', description: '+8% weapon damage', icon: '💪', type: 'normal', position: { x: 1, y: 0 }, cost: 1, requires: ['w_1'], effects: [{ stat: 'weaponDamage', value: 8, isPercent: true }], allocated: false, requiredLevel: 5, color: '#dc2626' },
      { id: 'w_3', name: 'Critical Edge', description: '+10% crit chance', icon: '🎯', type: 'normal', position: { x: 1, y: 1 }, cost: 1, requires: ['w_1'], effects: [{ stat: 'weaponCritChance', value: 10, isPercent: true }], allocated: false, requiredLevel: 5, color: '#dc2626' },
      { id: 'w_4', name: 'Battle Hardened', description: '+15% hull HP', icon: '❤️', type: 'normal', position: { x: 2, y: 0 }, cost: 1, requires: ['w_2'], effects: [{ stat: 'hullHp', value: 15, isPercent: true }], allocated: false, requiredLevel: 10, color: '#dc2626' },
      { id: 'w_5', name: 'War Master', description: '+20% weapon damage, +15% crit', icon: '⚔️', type: 'notable', position: { x: 3, y: 0 }, cost: 2, requires: ['w_4'], effects: [{ stat: 'weaponDamage', value: 20, isPercent: true }, { stat: 'weaponCritChance', value: 15, isPercent: true }], allocated: false, requiredLevel: 20, color: '#f59e0b' },
      { id: 'w_6', name: 'Berserker Rage', description: '+30% damage below 50% HP', icon: '😡', type: 'keystone', position: { x: 4, y: 0 }, cost: 3, requires: ['w_5'], effects: [{ stat: 'weaponDamage', value: 30, isPercent: true }], allocated: false, requiredLevel: 30, color: '#ef4444' },
      { id: 'w_7', name: 'Armor Mastery', description: '+20% armor', icon: '🛡️', type: 'normal', position: { x: 2, y: 1 }, cost: 1, requires: ['w_4'], effects: [{ stat: 'armorValue', value: 20, isPercent: true }], allocated: false, requiredLevel: 10, color: '#dc2626' },
      { id: 'w_8', name: 'Unstoppable', description: 'Cannot be stunned', icon: '💫', type: 'keystone', position: { x: 3, y: 1 }, cost: 3, requires: ['w_7'], effects: [{ stat: 'damageReduction', value: 15, isPercent: true }], allocated: false, requiredLevel: 25, color: '#ef4444' },
    ],
    connections: [
      { from: 'w_1', to: 'w_2', type: 'normal', allocated: false },
      { from: 'w_1', to: 'w_3', type: 'normal', allocated: false },
      { from: 'w_2', to: 'w_4', type: 'normal', allocated: false },
      { from: 'w_4', to: 'w_5', type: 'normal', allocated: false },
      { from: 'w_5', to: 'w_6', type: 'normal', allocated: false },
      { from: 'w_4', to: 'w_7', type: 'normal', allocated: false },
      { from: 'w_7', to: 'w_8', type: 'normal', allocated: false },
    ],
  },
  {
    id: 'tree_mage', name: 'Mage Tree', description: 'Spell and elemental specialization.', class: 'mage',
    icon: '🔮', color: '#3b82f6', allocatedPoints: 0, maxPoints: 120,
    nodes: [
      { id: 'm_1', name: 'Arcane Power I', description: '+5% spell damage', icon: '✨', type: 'normal', position: { x: 0, y: 0 }, cost: 1, requires: [], effects: [{ stat: 'energyWeapons', value: 5, isPercent: true }], allocated: false, requiredLevel: 1, color: '#3b82f6' },
      { id: 'm_2', name: 'Arcane Power II', description: '+8% spell damage', icon: '✨', type: 'normal', position: { x: 1, y: 0 }, cost: 1, requires: ['m_1'], effects: [{ stat: 'energyWeapons', value: 8, isPercent: true }], allocated: false, requiredLevel: 5, color: '#3b82f6' },
      { id: 'm_3', name: 'Mana Flow', description: '+15% capacitor recharge', icon: '💧', type: 'normal', position: { x: 1, y: 1 }, cost: 1, requires: ['m_1'], effects: [{ stat: 'capacitorRecharge', value: 15, isPercent: true }], allocated: false, requiredLevel: 5, color: '#3b82f6' },
      { id: 'm_4', name: 'Elemental Mastery', description: '+20% all elemental damage', icon: '🌈', type: 'notable', position: { x: 2, y: 0 }, cost: 2, requires: ['m_2'], effects: [{ stat: 'energyWeapons', value: 20, isPercent: true }], allocated: false, requiredLevel: 15, color: '#f59e0b' },
      { id: 'm_5', name: 'Spell Echo', description: 'Spells cast twice', icon: '🔮', type: 'keystone', position: { x: 3, y: 0 }, cost: 3, requires: ['m_4'], effects: [{ stat: 'weaponSpeed', value: 25, isPercent: true }], allocated: false, requiredLevel: 30, color: '#ef4444' },
      { id: 'm_6', name: 'Mana Shield', description: 'Damage taken from capacitor', icon: '🛡️', type: 'notable', position: { x: 2, y: 1 }, cost: 2, requires: ['m_3'], effects: [{ stat: 'damageReduction', value: 10, isPercent: true }], allocated: false, requiredLevel: 15, color: '#f59e0b' },
      { id: 'm_7', name: 'Arcane Sight', description: '+20% sensor strength', icon: '👁️', type: 'normal', position: { x: 3, y: 1 }, cost: 1, requires: ['m_6'], effects: [{ stat: 'sensorStrength', value: 20, isPercent: true }], allocated: false, requiredLevel: 20, color: '#3b82f6' },
    ],
    connections: [
      { from: 'm_1', to: 'm_2', type: 'normal', allocated: false },
      { from: 'm_1', to: 'm_3', type: 'normal', allocated: false },
      { from: 'm_2', to: 'm_4', type: 'normal', allocated: false },
      { from: 'm_4', to: 'm_5', type: 'normal', allocated: false },
      { from: 'm_3', to: 'm_6', type: 'normal', allocated: false },
      { from: 'm_6', to: 'm_7', type: 'normal', allocated: false },
    ],
  },
  {
    id: 'tree_ranger', name: 'Ranger Tree', description: 'Speed and projectile specialization.', class: 'ranger',
    icon: '🏹', color: '#22c55e', allocatedPoints: 0, maxPoints: 120,
    nodes: [
      { id: 'r_1', name: 'Swift Arrows I', description: '+5% weapon speed', icon: '🏹', type: 'normal', position: { x: 0, y: 0 }, cost: 1, requires: [], effects: [{ stat: 'weaponSpeed', value: 5, isPercent: true }], allocated: false, requiredLevel: 1, color: '#22c55e' },
      { id: 'r_2', name: 'Swift Arrows II', description: '+8% weapon speed', icon: '🏹', type: 'normal', position: { x: 1, y: 0 }, cost: 1, requires: ['r_1'], effects: [{ stat: 'weaponSpeed', value: 8, isPercent: true }], allocated: false, requiredLevel: 5, color: '#22c55e' },
      { id: 'r_3', name: 'Fleet Footed', description: '+15% flight velocity', icon: '💨', type: 'normal', position: { x: 1, y: 1 }, cost: 1, requires: ['r_1'], effects: [{ stat: 'flightVelocity', value: 15, isPercent: true }], allocated: false, requiredLevel: 5, color: '#22c55e' },
      { id: 'r_4', name: 'Rapid Fire', description: '+20% weapon speed, +10% damage', icon: '🎯', type: 'notable', position: { x: 2, y: 0 }, cost: 2, requires: ['r_2'], effects: [{ stat: 'weaponSpeed', value: 20, isPercent: true }, { stat: 'weaponDamage', value: 10, isPercent: true }], allocated: false, requiredLevel: 15, color: '#f59e0b' },
      { id: 'r_5', name: 'Arrow Storm', description: 'Fire 3x projectiles', icon: '🌀', type: 'keystone', position: { x: 3, y: 0 }, cost: 3, requires: ['r_4'], effects: [{ stat: 'weaponDamage', value: 15, isPercent: true }], allocated: false, requiredLevel: 30, color: '#ef4444' },
      { id: 'r_6', name: 'Evasion Master', description: '+20% avoidance', icon: '💨', type: 'notable', position: { x: 2, y: 1 }, cost: 2, requires: ['r_3'], effects: [{ stat: 'avoidance', value: 20, isPercent: true }], allocated: false, requiredLevel: 15, color: '#f59e0b' },
      { id: 'r_7', name: 'Ghost Runner', description: '+30% flight velocity, -20% signature', icon: '👻', type: 'keystone', position: { x: 3, y: 1 }, cost: 3, requires: ['r_6'], effects: [{ stat: 'flightVelocity', value: 30, isPercent: true }, { stat: 'signatureRadius', value: 20, isPercent: true }], allocated: false, requiredLevel: 25, color: '#ef4444' },
    ],
    connections: [
      { from: 'r_1', to: 'r_2', type: 'normal', allocated: false },
      { from: 'r_1', to: 'r_3', type: 'normal', allocated: false },
      { from: 'r_2', to: 'r_4', type: 'normal', allocated: false },
      { from: 'r_4', to: 'r_5', type: 'normal', allocated: false },
      { from: 'r_3', to: 'r_6', type: 'normal', allocated: false },
      { from: 'r_6', to: 'r_7', type: 'normal', allocated: false },
    ],
  },
];

// ============================================================================
// SKILL FUNCTIONS
// ============================================================================

/** Get skill gem experience needed for next level */
export function getSkillGemExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/** Level up a skill gem */
export function levelUpSkillGem(gem: SkillGem): SkillGem {
  if (gem.level >= gem.maxLevel) return gem;
  const newExp = gem.experience - gem.expToNext;
  return {
    ...gem,
    level: gem.level + 1,
    experience: Math.max(0, newExp),
    expToNext: getSkillGemExpForLevel(gem.level + 1),
    manaCost: Math.floor(gem.manaCost * 1.1),
  };
}

/** Add quality to skill gem */
export function addQuality(gem: SkillGem, amount: number = 1): SkillGem {
  const newQuality = Math.min(gem.quality + amount, gem.maxQuality);
  return { ...gem, quality: newQuality };
}

/** Calculate supported skill damage */
export function calculateSkillDamage(gem: SkillGem, supports: SupportGem[]): number {
  if (!gem.damage) return 0;
  let baseDamage = gem.damage.base * (1 + gem.level * 0.1) * (1 + gem.quality * 0.01);
  let multiplier = 1.0;
  for (const support of supports) {
    multiplier += support.multiplier * 0.1;
  }
  return Math.floor(baseDamage * multiplier);
}

/** Calculate skill cooldown reduction */
export function calculateCooldownReduction(gem: SkillGem, supports: SupportGem[]): number {
  let reduction = 0;
  for (const support of supports) {
    if (support.type === 'speed') reduction += support.multiplier * 5;
  }
  return Math.min(50, reduction);
}

/** Get available skill slots for a class */
export function getSkillSlotsForClass(skillClass: SkillClass): SkillSlot[] {
  const baseSlots: SkillSlot[] = [
    { id: 1, name: 'Main Skill', activeGem: null, supportGems: [], isActive: true },
    { id: 2, name: 'Secondary Skill', activeGem: null, supportGems: [], isActive: true },
    { id: 3, name: 'Utility Skill', activeGem: null, supportGems: [], isActive: true },
    { id: 4, name: 'Movement Skill', activeGem: null, supportGems: [], isActive: true },
    { id: 5, name: 'Buff Skill', activeGem: null, supportGems: [], isActive: true },
    { id: 6, name: 'Aura Skill', activeGem: null, supportGems: [], isActive: true },
  ];
  return baseSlots;
}

/** Create default skill book state */
export function createDefaultSkillBookState(): SkillBookState {
  return {
    loadouts: [{
      id: 'loadout_1', name: 'Main Loadout', description: 'Default skill loadout', icon: '⚔️',
      slots: getSkillSlotsForClass('warrior'), trees: ['tree_warrior'], activeTree: 'tree_warrior', level: 1, experience: 0,
    }],
    activeLoadoutId: 'loadout_1',
    skillPoints: 0,
    ascendancyPoints: 0,
    gems: [],
    supportGems: [],
    unlockedTrees: ['tree_warrior', 'tree_mage', 'tree_ranger'],
    totalAllocated: 0,
  };
}

/** Calculate total skill modifiers from allocated tree nodes */
export function calculateTreeModifiers(state: SkillBookState, trees: SkillTree[]): Partial<Record<string, number>> {
  const modifiers: Partial<Record<string, number>> = {};
  for (const tree of trees) {
    for (const node of tree.nodes) {
      if (node.allocated) {
        for (const effect of node.effects) {
          modifiers[effect.stat] = (modifiers[effect.stat] || 0) + effect.value;
        }
      }
    }
  }
  return modifiers;
}

/** Allocate a skill tree node */
export function allocateNode(state: SkillBookState, trees: SkillTree[], nodeId: string): { state: SkillBookState; trees: SkillTree[]; success: boolean; message: string } {
  if (state.skillPoints <= 0) return { state, trees, success: false, message: 'No skill points available' };

  for (const tree of trees) {
    const node = tree.nodes.find(n => n.id === nodeId);
    if (!node) continue;
    if (node.allocated) return { state, trees, success: false, message: 'Node already allocated' };
    if (state.skillPoints < node.cost) return { state, trees, success: false, message: 'Not enough skill points' };

    // Check prerequisites
    const hasAllPrereqs = node.requires.every(reqId =>
      tree.nodes.find(n => n.id === reqId)?.allocated
    );
    if (!hasAllPrereqs) return { state, trees, success: false, message: 'Prerequisites not met' };

    const newTrees = trees.map(t => {
      if (t.id !== tree.id) return t;
      return {
        ...t,
        nodes: t.nodes.map(n => n.id === nodeId ? { ...n, allocated: true } : n),
        allocatedPoints: t.allocatedPoints + node.cost,
      };
    });

    return {
      state: { ...state, skillPoints: state.skillPoints - node.cost, totalAllocated: state.totalAllocated + 1 },
      trees: newTrees,
      success: true,
      message: `Allocated ${node.name}`,
    };
  }

  return { state, trees, success: false, message: 'Node not found' };
}
