/**
 * Empire Operators System
 * 90 specialized operators across 9 empire feature categories
 * Obtained through missions, story campaign, bosses, and special operations
 * Like commanders but specialized per operational domain
 * @tag #operator #empire #missions #campaign #story
 */

// ============================================================================
// TYPES
// ============================================================================

export type OperatorCategory =
  | 'shipyard_operations'
  | 'combat_command'
  | 'colony_administration'
  | 'research_directorate'
  | 'resource_extraction'
  | 'trade_commerce'
  | 'exploration_expedition'
  | 'defense_security'
  | 'diplomacy_intelligence';

export type OperatorRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type OperatorAcquisitionMethod =
  | 'story_campaign'
  | 'side_mission'
  | 'boss_defeat'
  | 'expedition'
  | 'achievement'
  | 'special_event'
  | 'raids'
  | 'gacha'
  | 'crafting';

export type OperatorStat =
  | 'command'
  | 'tactics'
  | 'engineering'
  | 'science'
  | 'diplomacy'
  | 'logistics'
  | 'stealth'
  | 'combat'
  | 'production';

export interface OperatorStats {
  command: number;     // Fleet coordination & battle effectiveness
  tactics: number;     // Combat strategy & critical operations
  engineering: number; // Build speed & construction efficiency
  science: number;     // Research speed & discovery rate
  diplomacy: number;   // Diplomatic relations & trade
  logistics: number;   // Resource efficiency & supply chain
  stealth: number;     // Espionage & covert operations
  combat: number;      // Personal combat & boss damage
  production: number;  // Output multipliers & efficiency
}

export interface OperatorAbility {
  id: string;
  name: string;
  description: string;
  category: OperatorCategory;
  statAffected: OperatorStat;
  multiplier: number;
  cooldownTurns: number;
  durationTurns: number;
  unlockLevel: number;
}

export interface OperatorAcquisition {
  method: OperatorAcquisitionMethod;
  sourceId: string;
  sourceName: string;
  chapter?: number;
  act?: number;
  difficulty?: number;
  dropRate?: number;
  requirements?: string[];
}

export interface OperatorSynergy {
  operatorId: string;
  partnerId: string;
  bonusName: string;
  bonusDescription: string;
  statBonus: Partial<OperatorStats>;
}

export interface OperatorEntry {
  id: string;
  name: string;
  title: string;
  category: OperatorCategory;
  rarity: OperatorRarity;
  description: string;
  lore: string;
  stats: OperatorStats;
  ability: OperatorAbility;
  acquisition: OperatorAcquisition;
  synergies: readonly OperatorSynergy[];
  levels: number;
  maxLevel: number;
  evolutionRank: number; // 0-5 stars
  isUnlockable: boolean;
}

// ============================================================================
// 90 OPERATORS - 10 Per Category
// ============================================================================

export const EMPIRE_OPERATORS: readonly OperatorEntry[] = [

  // ==========================================================================
  // 1. SHIPYARD OPERATIONS (10 operators)
  // ==========================================================================
  {
    id: 'op-ship-master-drydock',
    name: 'Drydock Master Voss',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'rare',
    description: 'Master shipwright who oversees all capital ship construction in the empire\'s primary shipyards.',
    lore: 'Voss has built over 200 warships from the keel up. His personal touch on every vessel ensures unmatched build quality. He once constructed a dreadnought in half the standard time by personally redesigning the assembly line.',
    stats: { command: 3, tactics: 1, engineering: 9, science: 2, diplomacy: 0, logistics: 5, stealth: 0, combat: 1, production: 8 },
    ability: { id: 'ab-ship-rapid-assembly', name: 'Rapid Assembly', description: 'Reduces ship construction time by 25% for all vessels in the shipyard queue.', category: 'shipyard_operations', statAffected: 'production', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch3', sourceName: 'Fleet Foundations', chapter: 3, act: 1, difficulty: 2 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-ship-architect-stellar',
    name: 'Stellar Architect Kael',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'epic',
    description: 'Visionary designer who creates next-generation ship blueprints and modular construction techniques.',
    lore: 'Kael\'s revolutionary modular design allows ships to be reconfigured between roles in hours instead of weeks. Her blueprints are sought by every major shipyard in the galaxy.',
    stats: { command: 2, tactics: 3, engineering: 8, science: 7, diplomacy: 1, logistics: 4, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-ship-modular-design', name: 'Modular Blueprint', description: 'Unlocks modular ship refitting, reducing retrofit costs by 40%.', category: 'shipyard_operations', statAffected: 'engineering', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch1', sourceName: 'Scientific Renaissance', chapter: 1, act: 2, difficulty: 4 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-ship-foreman-titan',
    name: 'Titan Foreman Jax',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'common',
    description: 'Hardened construction foreman who specializes in titan-class vessel assembly.',
    lore: 'Jax started as a welder on the orbital platforms and worked his way up through every role in the shipyard.',
    stats: { command: 1, tactics: 1, engineering: 5, science: 0, diplomacy: 0, logistics: 3, stealth: 0, combat: 0, production: 4 },
    ability: { id: 'ab-ship-titan-focus', name: 'Titan Focus', description: 'Increases titan construction speed by 15% and reduces resource cost by 10%.', category: 'shipyard_operations', statAffected: 'production', multiplier: 1.15, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch1', sourceName: 'New Beginnings', chapter: 1, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-ship-logistics-officer',
    name: 'Supply Officer Lena',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'uncommon',
    description: 'Logistics expert who keeps shipyards supplied with materials and components.',
    lore: 'Lena\'s supply chain optimization saved the empire billions in material costs. She can predict shortages before they happen.',
    stats: { command: 0, tactics: 2, engineering: 3, science: 1, diplomacy: 2, logistics: 7, stealth: 0, combat: 0, production: 5 },
    ability: { id: 'ab-ship-supply-chain', name: 'Supply Chain Mastery', description: 'Reduces ship material costs by 15% across all shipyard facilities.', category: 'shipyard_operations', statAffected: 'logistics', multiplier: 0.85, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'side_mission', sourceId: 'mission-ship-supply', sourceName: 'Critical Supplies', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-ship-drone-specialist',
    name: 'Drone Coordinator Zara',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'uncommon',
    description: 'Specialist in automated construction drones, maximizing yard throughput.',
    lore: 'Zara commands a swarm of 10,000 construction drones with precision that borders on art.',
    stats: { command: 2, tactics: 1, engineering: 6, science: 3, diplomacy: 0, logistics: 4, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-ship-drone-swarm', name: 'Drone Swarm', description: 'Construction drones work 20% faster when building frigate-class and smaller vessels.', category: 'shipyard_operations', statAffected: 'production', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 2 },
    acquisition: { method: 'side_mission', sourceId: 'mission-drone-mastery', sourceName: 'Drone Mastery', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-ship-nano-forge',
    name: 'Nanoforge Technician Rynn',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'rare',
    description: 'Nanoforge operator who constructs components at the molecular level.',
    lore: 'Rynn\'s nanoforges can produce components with tolerances measured in atoms, resulting in superior ship performance.',
    stats: { command: 0, tactics: 0, engineering: 7, science: 6, diplomacy: 0, logistics: 3, stealth: 0, combat: 1, production: 5 },
    ability: { id: 'ab-ship-nano-construction', name: 'Nanoforge Precision', description: 'Increases ship hull integrity by 10% and armor by 8% for ships built under his supervision.', category: 'shipyard_operations', statAffected: 'engineering', multiplier: 1.1, cooldownTurns: 0, durationTurns: 0, unlockLevel: 4 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-nanoforge-guardian', sourceName: 'Nanoforge Guardian', difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-ship-fleet-quartermaster',
    name: 'Fleet Quartermaster Orin',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'epic',
    description: 'Quartermaster who manages fleet-wide equipment allocation and logistics.',
    lore: 'Orin can outfit an entire fleet in hours, knowing exactly where every bolt and panel is stored.',
    stats: { command: 4, tactics: 3, engineering: 5, science: 1, diplomacy: 2, logistics: 9, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-ship-fleet-logistics', name: 'Fleet Logistics', description: 'Reduces fleet deployment time by 30% and supply consumption by 20%.', category: 'shipyard_operations', statAffected: 'logistics', multiplier: 0.7, cooldownTurns: 0, durationTurns: 0, unlockLevel: 8 },
    acquisition: { method: 'achievement', sourceId: 'ach-fleet-master', sourceName: 'Fleet Master', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-ship-guild-master',
    name: 'Guild Master Soren',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'legendary',
    description: 'Master of the Shipwright\'s Guild, holding ancient construction secrets.',
    lore: 'Soren carries the knowledge of a dozen extinct civilizations, passed down through guild masters for millennia.',
    stats: { command: 5, tactics: 4, engineering: 9, science: 8, diplomacy: 3, logistics: 7, stealth: 1, combat: 2, production: 9 },
    ability: { id: 'ab-ship-ancient-techniques', name: 'Ancient Techniques', description: 'Unlocks ancient construction techniques, reducing all ship costs by 25% and increasing stats by 15%.', category: 'shipyard_operations', statAffected: 'production', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 15 },
    acquisition: { method: 'special_event', sourceId: 'event-guild-heritage', sourceName: 'Guild Heritage', difficulty: 8 },
    synergies: [],
    levels: 80, maxLevel: 80, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-ship-recycler-chief',
    name: 'Recycler Chief Morga',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'common',
    description: 'Expert in salvaging and recycling derelict ships into usable materials.',
    lore: 'Morga can strip a wrecked battleship to its atoms in hours and return every gram to the production line.',
    stats: { command: 0, tactics: 1, engineering: 4, science: 1, diplomacy: 0, logistics: 5, stealth: 0, combat: 1, production: 3 },
    ability: { id: 'ab-ship-salvage-mastery', name: 'Salvage Mastery', description: 'Increases salvage yield from ship debris by 30%.', category: 'shipyard_operations', statAffected: 'logistics', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch2', sourceName: 'Waste Not', chapter: 2, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-ship-test-pilot',
    name: 'Test Pilot Nyx',
    title: 'Shipyard Operations',
    category: 'shipyard_operations',
    rarity: 'rare',
    description: 'Elite test pilot who validates new ship designs through extreme flight trials.',
    lore: 'Nyx has flown every prototype the empire has built and survived 47 catastrophic system failures to make ships safer.',
    stats: { command: 3, tactics: 6, engineering: 5, science: 3, diplomacy: 0, logistics: 2, stealth: 2, combat: 5, production: 3 },
    ability: { id: 'ab-ship-prototype-testing', name: 'Prototype Testing', description: 'Reduces prototype development time by 35% and increases prototype success rate by 20%.', category: 'shipyard_operations', statAffected: 'engineering', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'side_mission', sourceId: 'mission-test-pilot', sourceName: 'Test Pilot Trials', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },

  // ==========================================================================
  // 2. COMBAT COMMAND (10 operators)
  // ==========================================================================
  {
    id: 'op-combat-fleet-admiral',
    name: 'Fleet Admiral Chen',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'legendary',
    description: 'Supreme commander of the imperial fleet, with decades of battle experience.',
    lore: 'Admiral Chen has won every major engagement she has commanded. Her tactical genius is studied in military academies across the galaxy.',
    stats: { command: 10, tactics: 9, engineering: 3, science: 2, diplomacy: 4, logistics: 6, stealth: 3, combat: 8, production: 2 },
    ability: { id: 'ab-combat-fleet-coordination', name: 'Fleet Coordination', description: 'All allied ships gain 20% increased damage and 15% reduced damage taken in fleet battles.', category: 'combat_command', statAffected: 'command', multiplier: 1.2, cooldownTurns: 5, durationTurns: 3, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act5-ch4', sourceName: 'Supreme Command', chapter: 4, act: 5, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-combat-boss-killer',
    name: 'Bane of Giants Valerius',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'epic',
    description: 'Specialized hunter of capital ships and galactic bosses.',
    lore: 'Valerius has personally boarded and destroyed 12 dreadnoughts and 3 world-eater class entities.',
    stats: { command: 4, tactics: 8, engineering: 2, science: 1, diplomacy: 0, logistics: 2, stealth: 5, combat: 9, production: 0 },
    ability: { id: 'ab-combat-giant-slayer', name: 'Giant Slayer', description: 'Deals 35% increased damage to boss-type enemies and capital ships.', category: 'combat_command', statAffected: 'combat', multiplier: 1.35, cooldownTurns: 3, durationTurns: 2, unlockLevel: 10 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-world-eater', sourceName: 'World Eater', difficulty: 7 },
    synergies: [],
    levels: 70, maxLevel: 70, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-combat-tactician',
    name: 'Grand Tactician Mira',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'rare',
    description: 'Brilliant strategist who excels at outmaneuvering larger enemy forces.',
    lore: 'Mira defeated three fleets simultaneously by exploiting their communication lag.',
    stats: { command: 7, tactics: 9, engineering: 1, science: 3, diplomacy: 1, logistics: 4, stealth: 6, combat: 6, production: 0 },
    ability: { id: 'ab-combat-outmaneuver', name: 'Tactical Outmaneuver', description: 'Increases fleet evasion by 25% and critical hit chance by 15% when outnumbered.', category: 'combat_command', statAffected: 'tactics', multiplier: 1.25, cooldownTurns: 4, durationTurns: 2, unlockLevel: 8 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act3-ch2', sourceName: 'Tactical Evolution', chapter: 2, act: 3, difficulty: 5 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-combat-vanguard',
    name: 'Vanguard Commander Rex',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'uncommon',
    description: 'Front-line commander who leads from the tip of the spear.',
    lore: 'Rex has never asked his troops to go where he would not lead. His vanguard units are the most decorated in the fleet.',
    stats: { command: 5, tactics: 4, engineering: 1, science: 0, diplomacy: 0, logistics: 2, stealth: 1, combat: 7, production: 0 },
    ability: { id: 'ab-combat-vanguard-charge', name: 'Vanguard Charge', description: 'Vanguard-class ships deal 20% increased damage and have 15% increased shield capacity.', category: 'combat_command', statAffected: 'combat', multiplier: 1.2, cooldownTurns: 3, durationTurns: 2, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch5', sourceName: 'First Blood', chapter: 5, act: 1, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-combat-pirate-hunter',
    name: 'Pirate Hunter Sable',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'rare',
    description: 'Relentless hunter of pirate lords and raider fleets.',
    lore: 'Sable has eradicated 37 pirate gangs and personally captured the notorious Crimson Raiders.',
    stats: { command: 4, tactics: 6, engineering: 2, science: 1, diplomacy: 0, logistics: 3, stealth: 7, combat: 7, production: 1 },
    ability: { id: 'ab-combat-pirate-bane', name: 'Pirate Bane', description: 'Increases damage against pirate factions by 40% and increases loot from pirate encounters by 30%.', category: 'combat_command', statAffected: 'combat', multiplier: 1.4, cooldownTurns: 2, durationTurns: 3, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-pirate-lord', sourceName: 'Pirate Lord', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-combat-defense-coordinator',
    name: 'Defense Coordinator Tark',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'uncommon',
    description: 'Expert in planetary and station defense coordination.',
    lore: 'Tark\'s defensive networks have repelled sieges against impossible odds.',
    stats: { command: 5, tactics: 5, engineering: 4, science: 2, diplomacy: 1, logistics: 4, stealth: 1, combat: 4, production: 2 },
    ability: { id: 'ab-combat-defense-network', name: 'Defense Network', description: 'Increases defensive structure damage by 20% and shield regeneration by 25%.', category: 'combat_command', statAffected: 'tactics', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 4 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch3', sourceName: 'Fortress Empire', chapter: 3, act: 2, difficulty: 3 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-combat-strike-leader',
    name: 'Strike Leader Vex',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'epic',
    description: 'Commander of rapid-strike task forces for surgical military operations.',
    lore: 'Vex\'s strike force can appear anywhere in the sector within hours, delivering precision devastation.',
    stats: { command: 7, tactics: 8, engineering: 2, science: 1, diplomacy: 0, logistics: 5, stealth: 8, combat: 8, production: 0 },
    ability: { id: 'ab-combat-rapid-strike', name: 'Rapid Strike', description: 'Fleet speed increased by 30% and first-strike damage increased by 50% for the first combat round.', category: 'combat_command', statAffected: 'command', multiplier: 1.3, cooldownTurns: 6, durationTurns: 1, unlockLevel: 12 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-strike-commander', sourceName: 'Strike Commander', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-combat-war-hero',
    name: 'War Hero Marcus',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'common',
    description: 'Decorated veteran who inspires troops through legendary courage.',
    lore: 'Marcus has more medals than any other living officer. His presence alone boosts fleet morale.',
    stats: { command: 4, tactics: 3, engineering: 0, science: 0, diplomacy: 2, logistics: 1, stealth: 0, combat: 5, production: 0 },
    ability: { id: 'ab-combat-morale-boost', name: 'Morale Boost', description: 'Increases fleet morale by 20%, improving all combat stats by 8%.', category: 'combat_command', statAffected: 'command', multiplier: 1.08, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch1', sourceName: 'New Beginnings', chapter: 1, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-combat-siege-master',
    name: 'Siege Master Korgath',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'epic',
    description: 'Expert in planetary sieges and orbital bombardment operations.',
    lore: 'Korgath has cracked 50 planetary shields and never lost a siege under his command.',
    stats: { command: 6, tactics: 7, engineering: 5, science: 2, diplomacy: 0, logistics: 5, stealth: 2, combat: 7, production: 1 },
    ability: { id: 'ab-combat-siege-warfare', name: 'Siege Warfare', description: 'Increases planetary bombardment damage by 40% and reduces siege defense effectiveness by 20%.', category: 'combat_command', statAffected: 'tactics', multiplier: 1.4, cooldownTurns: 4, durationTurns: 3, unlockLevel: 10 },
    acquisition: { method: 'special_event', sourceId: 'event-siege-warfare', sourceName: 'Siege Warfare', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-combat-arena-champion',
    name: 'Arena Champion Lyra',
    title: 'Combat Command',
    category: 'combat_command',
    rarity: 'rare',
    description: 'Undefeated champion of the imperial combat arena and PvP specialist.',
    lore: 'Lyra has never lost a duel. Her combat techniques are studied by pilots across the galaxy.',
    stats: { command: 3, tactics: 7, engineering: 1, science: 1, diplomacy: 1, logistics: 1, stealth: 6, combat: 9, production: 0 },
    ability: { id: 'ab-combat-arena-mastery', name: 'Arena Mastery', description: 'Increases damage in PvP combat by 25% and reduces damage taken from players by 15%.', category: 'combat_command', statAffected: 'combat', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'achievement', sourceId: 'ach-arena-champion', sourceName: 'Arena Champion', difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },

  // ==========================================================================
  // 3. COLONY ADMINISTRATION (10 operators)
  // ==========================================================================
  {
    id: 'op-colony-governor',
    name: 'Governor Aurelia',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'epic',
    description: 'Master colonial administrator who transforms struggling colonies into thriving metropolises.',
    lore: 'Aurelia took a failed mining colony and turned it into the empire\'s most productive agricultural world within a decade.',
    stats: { command: 3, tactics: 1, engineering: 6, science: 4, diplomacy: 5, logistics: 8, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-colony-growth-boom', name: 'Growth Boom', description: 'Increases colony growth rate by 30% and reduces building construction time by 20%.', category: 'colony_administration', statAffected: 'logistics', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 8 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch5', sourceName: 'Colonial Renaissance', chapter: 5, act: 2, difficulty: 4 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-colony-terraformer',
    name: 'Terraformer Selene',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'legendary',
    description: 'Pioneer of planetary engineering who can make even hostile worlds habitable.',
    lore: 'Selene terraformed a volcanic death world into a garden paradise in just 15 standard years.',
    stats: { command: 1, tactics: 0, engineering: 9, science: 9, diplomacy: 2, logistics: 6, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-colony-terraform-mastery', name: 'Terraform Mastery', description: 'Reduces terraforming time by 50% and terraforming resource cost by 30%.', category: 'colony_administration', statAffected: 'engineering', multiplier: 0.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 15 },
    acquisition: { method: 'achievement', sourceId: 'ach-terraformer', sourceName: 'Terraformer', difficulty: 8 },
    synergies: [],
    levels: 80, maxLevel: 80, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-colony-housing-master',
    name: 'Housing Director Blaine',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'uncommon',
    description: 'Expert in residential planning and population density optimization.',
    lore: 'Blaine\'s arcology designs house millions in comfort on a fraction of the usual land area.',
    stats: { command: 0, tactics: 0, engineering: 6, science: 3, diplomacy: 2, logistics: 5, stealth: 0, combat: 0, production: 4 },
    ability: { id: 'ab-colony-housing-boom', name: 'Housing Boom', description: 'Increases population capacity by 25% and population growth by 15%.', category: 'colony_administration', statAffected: 'logistics', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 2 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch4', sourceName: 'Home Expansion', chapter: 4, act: 1, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-colony-agri-director',
    name: 'Agriculture Director Fern',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'uncommon',
    description: 'Agricultural specialist who maximizes food production on any colony.',
    lore: 'Fern\'s genetically engineered crops yield 4x normal output even on marginal soil.',
    stats: { command: 0, tactics: 0, engineering: 3, science: 6, diplomacy: 1, logistics: 5, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-colony-food-surplus', name: 'Food Surplus', description: 'Increases food production by 35% and reduces population consumption by 10%.', category: 'colony_administration', statAffected: 'production', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'side_mission', sourceId: 'mission-food-crisis', sourceName: 'Food Crisis', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-colony-city-planner',
    name: 'City Planner Vox',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'rare',
    description: 'Urban designer who creates efficient city layouts maximizing space and utility.',
    lore: 'Vox\'s hexagonal city designs have become the standard template for all new colonies.',
    stats: { command: 1, tactics: 2, engineering: 7, science: 4, diplomacy: 1, logistics: 6, stealth: 0, combat: 0, production: 5 },
    ability: { id: 'ab-colony-efficient-layout', name: 'Efficient Layout', description: 'Reduces building footprint by 20% and increases adjacency bonuses by 25%.', category: 'colony_administration', statAffected: 'engineering', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch2', sourceName: 'Urban Evolution', chapter: 2, act: 2, difficulty: 3 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-colony-morale-officer',
    name: 'Morale Officer Harmony',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'common',
    description: 'Cultural officer who keeps colony populations happy and productive.',
    lore: 'Harmony\'s entertainment programs and community initiatives have eliminated unrest on every colony she has served.',
    stats: { command: 1, tactics: 0, engineering: 1, science: 2, diplomacy: 5, logistics: 2, stealth: 0, combat: 0, production: 3 },
    ability: { id: 'ab-colony-happiness-boost', name: 'Happiness Boost', description: 'Increases colony happiness by 15%, improving all production outputs by 10%.', category: 'colony_administration', statAffected: 'diplomacy', multiplier: 1.15, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch2', sourceName: 'Community Building', chapter: 2, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-colony-infrastructure-chief',
    name: 'Infrastructure Chief Grunn',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'rare',
    description: 'Master builder who constructs roads, power grids, and vital infrastructure.',
    lore: 'Grunn\'s infrastructure projects finish ahead of schedule and under budget, a legendary feat.',
    stats: { command: 1, tactics: 1, engineering: 8, science: 2, diplomacy: 0, logistics: 6, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-colony-infrastructure-speed', name: 'Infrastructure Speed', description: 'Increases infrastructure construction speed by 30% and reduces costs by 15%.', category: 'colony_administration', statAffected: 'engineering', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 4 },
    acquisition: { method: 'side_mission', sourceId: 'mission-infrastructure', sourceName: 'Infrastructure Push', difficulty: 3 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-colony-environmentalist',
    name: 'Environmental Curator Willow',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'epic',
    description: 'Guardian of planetary ecosystems who balances development with nature.',
    lore: 'Willow pioneered the eco-integration approach where cities and wilderness coexist in harmony.',
    stats: { command: 0, tactics: 0, engineering: 5, science: 7, diplomacy: 4, logistics: 4, stealth: 1, combat: 0, production: 5 },
    ability: { id: 'ab-colony-eco-balance', name: 'Eco Balance', description: 'Increases habitability by 20% and reduces environmental degradation by 50%.', category: 'colony_administration', statAffected: 'science', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 7 },
    acquisition: { method: 'achievement', sourceId: 'ach-environmental-steward', sourceName: 'Environmental Steward', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-colony-disaster-response',
    name: 'Disaster Response Vanguard',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'common',
    description: 'Emergency management specialist who protects colonies from disasters.',
    lore: 'Vanguard saved 12 million lives during the Great Solar Flare of 2187.',
    stats: { command: 2, tactics: 2, engineering: 3, science: 2, diplomacy: 1, logistics: 4, stealth: 0, combat: 1, production: 2 },
    ability: { id: 'ab-colony-disaster-protection', name: 'Disaster Protection', description: 'Reduces disaster damage by 40% and speeds up disaster recovery by 50%.', category: 'colony_administration', statAffected: 'logistics', multiplier: 0.6, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch3', sourceName: 'Protecting the People', chapter: 3, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-colony-orbital-prefect',
    name: 'Orbital Prefect Nova',
    title: 'Colony Administration',
    category: 'colony_administration',
    rarity: 'rare',
    description: 'Administrator of orbital habitats, space stations, and zero-gravity colonies.',
    lore: 'Nova manages 12 orbital habitats simultaneously, housing over 50 million citizens in space.',
    stats: { command: 3, tactics: 1, engineering: 6, science: 4, diplomacy: 3, logistics: 7, stealth: 0, combat: 0, production: 5 },
    ability: { id: 'ab-colony-orbital-efficiency', name: 'Orbital Efficiency', description: 'Increases orbital habitat capacity by 30% and reduces orbital maintenance costs by 20%.', category: 'colony_administration', statAffected: 'logistics', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-orbital-expansion', sourceName: 'Orbital Expansion', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },

  // ==========================================================================
  // 4. RESEARCH DIRECTORATE (10 operators)
  // ==========================================================================
  {
    id: 'op-research-director',
    name: 'Research Director Nova',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'legendary',
    description: 'Brilliant scientist who leads the empire\'s research division with groundbreaking discoveries.',
    lore: 'Nova has personally overseen 47 technological breakthroughs that revolutionized imperial capabilities.',
    stats: { command: 1, tactics: 2, engineering: 6, science: 10, diplomacy: 3, logistics: 4, stealth: 1, combat: 0, production: 5 },
    ability: { id: 'ab-research-accelerator', name: 'Research Accelerator', description: 'Increases research speed by 30% and reduces technology cost by 20%.', category: 'research_directorate', statAffected: 'science', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act6-ch3', sourceName: 'Scientific Zenith', chapter: 3, act: 6, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-research-physicist',
    name: 'Quantum Physicist Zephyr',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'epic',
    description: 'Theoretical physicist who unlocks the secrets of quantum mechanics and applied physics.',
    lore: 'Zephyr\'s unified field theory enabled the development of gravity manipulation technology.',
    stats: { command: 0, tactics: 1, engineering: 4, science: 9, diplomacy: 1, logistics: 2, stealth: 0, combat: 1, production: 3 },
    ability: { id: 'ab-research-quantum-leap', name: 'Quantum Leap', description: 'Increases quantum and physics research speed by 40% and unlocks advanced research options.', category: 'research_directorate', statAffected: 'science', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 12 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-quantum-guardian', sourceName: 'Quantum Guardian', difficulty: 7 },
    synergies: [],
    levels: 70, maxLevel: 70, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-research-biologist',
    name: 'Xenobiologist Fern',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'rare',
    description: 'Expert in alien biology and genetic engineering.',
    lore: 'Fern discovered the genetic key to extending human lifespan by 200 years.',
    stats: { command: 0, tactics: 0, engineering: 2, science: 8, diplomacy: 3, logistics: 2, stealth: 0, combat: 0, production: 4 },
    ability: { id: 'ab-research-bio-mastery', name: 'Bio Mastery', description: 'Increases biological research speed by 30% and improves terraforming research by 25%.', category: 'research_directorate', statAffected: 'science', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-xeno-study', sourceName: 'Xeno Study', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-research-engineer',
    name: 'Research Engineer Bolt',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'uncommon',
    description: 'Applied engineer who turns theoretical research into practical technology.',
    lore: 'Bolt\'s motto: "If we can imagine it, I can build it."',
    stats: { command: 0, tactics: 1, engineering: 7, science: 6, diplomacy: 0, logistics: 3, stealth: 0, combat: 1, production: 5 },
    ability: { id: 'ab-research-applied-tech', name: 'Applied Technology', description: 'Increases applied research speed by 25% and prototype success rate by 20%.', category: 'research_directorate', statAffected: 'engineering', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch1', sourceName: 'Scientific Renaissance', chapter: 1, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-research-computer-scientist',
    name: 'AI Architect Codex',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'epic',
    description: 'Pioneer of artificial intelligence and computational research.',
    lore: 'Codex created the first true artificial general intelligence, which now assists all imperial research.',
    stats: { command: 0, tactics: 1, engineering: 5, science: 9, diplomacy: 1, logistics: 3, stealth: 2, combat: 0, production: 4 },
    ability: { id: 'ab-research-ai-assistance', name: 'AI Assistance', description: 'AI-assisted research increases all research speed by 20% and reduces computation time by 35%.', category: 'research_directorate', statAffected: 'science', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'special_event', sourceId: 'event-ai-awakening', sourceName: 'AI Awakening', difficulty: 7 },
    synergies: [],
    levels: 70, maxLevel: 70, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-research-archaeologist',
    name: 'Chief Archaeologist Indiana',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'rare',
    description: 'Legendary archaeologist who uncovers ancient technologies and forgotten knowledge.',
    lore: 'Indiana discovered the Progenitor Vault, containing technology millions of years ahead of current science.',
    stats: { command: 1, tactics: 2, engineering: 3, science: 7, diplomacy: 2, logistics: 3, stealth: 5, combat: 3, production: 2 },
    ability: { id: 'ab-research-ancient-discovery', name: 'Ancient Discovery', description: 'Doubles discovery rate of ancient technology and increases artifact value by 40%.', category: 'research_directorate', statAffected: 'science', multiplier: 2.0, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act3-ch4', sourceName: 'Ancient Secrets', chapter: 4, act: 3, difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-research-lab-director',
    name: 'Lab Director Cipher',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'common',
    description: 'Efficient laboratory manager who maximizes research output.',
    lore: 'Cipher\'s lab management system increased research output by 300% across all imperial facilities.',
    stats: { command: 0, tactics: 0, engineering: 3, science: 5, diplomacy: 2, logistics: 4, stealth: 0, combat: 0, production: 4 },
    ability: { id: 'ab-research-lab-efficiency', name: 'Lab Efficiency', description: 'Increases research lab output by 20% and reduces research material costs by 10%.', category: 'research_directorate', statAffected: 'logistics', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch4', sourceName: 'Lab Foundations', chapter: 4, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-research-psionicist',
    name: 'Psionicist Ember',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'legendary',
    description: 'Master of psionic research who explores the boundaries of consciousness.',
    lore: 'Ember can communicate across star systems with her mind alone and has unlocked the secrets of the psychic shroud.',
    stats: { command: 2, tactics: 3, engineering: 1, science: 9, diplomacy: 5, logistics: 1, stealth: 6, combat: 4, production: 1 },
    ability: { id: 'ab-research-psionic-unlock', name: 'Psionic Unlock', description: 'Unlocks psionic technology tree and increases psionic research speed by 50%.', category: 'research_directorate', statAffected: 'science', multiplier: 1.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 18 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-psionic-entity', sourceName: 'Psionic Entity', difficulty: 9 },
    synergies: [],
    levels: 80, maxLevel: 80, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-research-weapons-scientist',
    name: 'Weapons Scientist Trigger',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'rare',
    description: 'Developer of advanced weapons technology for the imperial arsenal.',
    lore: 'Trigger\'s directed energy weapons research gave the empire a generation leap in firepower.',
    stats: { command: 1, tactics: 4, engineering: 6, science: 7, diplomacy: 0, logistics: 2, stealth: 1, combat: 5, production: 2 },
    ability: { id: 'ab-research-weapons-advance', name: 'Weapons Advance', description: 'Increases weapons research speed by 35% and unlocks advanced weapon schematics.', category: 'research_directorate', statAffected: 'science', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'side_mission', sourceId: 'mission-weapons-research', sourceName: 'Weapons Research', difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-research-material-scientist',
    name: 'Material Scientist Alloy',
    title: 'Research Directorate',
    category: 'research_directorate',
    rarity: 'uncommon',
    description: 'Expert in advanced materials and metallurgy.',
    lore: 'Alloy developed the crystalline composite armor now standard on all imperial warships.',
    stats: { command: 0, tactics: 1, engineering: 6, science: 6, diplomacy: 0, logistics: 3, stealth: 0, combat: 1, production: 5 },
    ability: { id: 'ab-research-material-advance', name: 'Material Advance', description: 'Increases materials research by 25% and improves ship armor effectiveness by 15%.', category: 'research_directorate', statAffected: 'engineering', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch4', sourceName: 'Material Progress', chapter: 4, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },

  // ==========================================================================
  // 5. RESOURCE EXTRACTION (10 operators)
  // ==========================================================================
  {
    id: 'op-resource-mine-foreman',
    name: 'Mine Foreman Granite',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'rare',
    description: 'Master miner who maximizes output from planetary and asteroid mining operations.',
    lore: 'Granite can assess a mineral deposit\'s potential at a glance and has never picked a poor mining site.',
    stats: { command: 1, tactics: 1, engineering: 6, science: 3, diplomacy: 0, logistics: 7, stealth: 0, combat: 0, production: 8 },
    ability: { id: 'ab-resource-deep-mining', name: 'Deep Mining', description: 'Increases mine output by 30% and extends mine lifespan by 25%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch2', sourceName: 'Resource Rush', chapter: 2, act: 2, difficulty: 3 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-resource-gas-harvester',
    name: 'Gas Harvester Mist',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'uncommon',
    description: 'Specialist in extracting deuterium and rare gases from gas giants.',
    lore: 'Mist\'s precision harvesting techniques extract 40% more deuterium from gas giant atmospheres.',
    stats: { command: 0, tactics: 0, engineering: 5, science: 4, diplomacy: 0, logistics: 5, stealth: 0, combat: 0, production: 6 },
    ability: { id: 'ab-resource-gas-extraction', name: 'Gas Extraction', description: 'Increases deuterium production by 35% and gas giant harvesting efficiency by 25%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 2 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch5', sourceName: 'Gas Giants', chapter: 5, act: 1, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-resource-crystal-miner',
    name: 'Crystal Miner Shard',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'uncommon',
    description: 'Expert in crystal mining and processing operations.',
    lore: 'Shard discovered a crystalline formation on a barren moon that produces 10x normal crystal yields.',
    stats: { command: 0, tactics: 0, engineering: 4, science: 3, diplomacy: 0, logistics: 4, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-resource-crystal-boost', name: 'Crystal Boost', description: 'Increases crystal production by 35% and crystal refinery efficiency by 20%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 2 },
    acquisition: { method: 'side_mission', sourceId: 'mission-crystal-rush', sourceName: 'Crystal Rush', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-resource-asteroid-foreman',
    name: 'Asteroid Foreman Rock',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'common',
    description: 'Veteran asteroid miner who coordinates belt harvesting operations.',
    lore: 'Rock has mined every major asteroid belt in the sector and knows the richest claims.',
    stats: { command: 2, tactics: 1, engineering: 4, science: 1, diplomacy: 0, logistics: 4, stealth: 0, combat: 1, production: 5 },
    ability: { id: 'ab-resource-asteroid-efficiency', name: 'Asteroid Efficiency', description: 'Increases asteroid mining yield by 25% and reduces asteroid processing time by 20%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch2', sourceName: 'Rock and Stone', chapter: 2, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-resource-refinery-chief',
    name: 'Refinery Chief Flux',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'rare',
    description: 'Master refiner who optimizes raw material processing efficiency.',
    lore: 'Flux\'s refinery process extracts usable material from ore at 99.7% efficiency.',
    stats: { command: 0, tactics: 0, engineering: 6, science: 5, diplomacy: 0, logistics: 6, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-resource-refine-mastery', name: 'Refine Mastery', description: 'Increases refinery output by 30% and reduces processing waste by 40%.', category: 'resource_extraction', statAffected: 'engineering', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 4 },
    acquisition: { method: 'side_mission', sourceId: 'mission-refinery-upgrade', sourceName: 'Refinery Upgrade', difficulty: 3 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-resource-dark-matter',
    name: 'Dark Matter Harvester Void',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'legendary',
    description: 'The only known specialist in dark matter extraction and stabilization.',
    lore: 'Void discovered a stable dark matter pocket in deep space and pioneered its extraction.',
    stats: { command: 0, tactics: 1, engineering: 7, science: 9, diplomacy: 0, logistics: 5, stealth: 2, combat: 1, production: 8 },
    ability: { id: 'ab-resource-dark-matter', name: 'Dark Matter Harvest', description: 'Unlocks dark matter extraction and increases exotic resource production by 50%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-dark-matter-entity', sourceName: 'Dark Matter Entity', difficulty: 9 },
    synergies: [],
    levels: 80, maxLevel: 80, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-resource-geologist',
    name: 'Chief Geologist Core',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'epic',
    description: 'Planetary geologist who identifies rich mineral deposits and optimizes extraction.',
    lore: 'Core\'s geological surveys are so accurate they read like maps of buried treasure.',
    stats: { command: 0, tactics: 0, engineering: 5, science: 8, diplomacy: 1, logistics: 5, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-resource-geo-survey', name: 'Geological Survey', description: 'Increases all mining yields by 25% and reveals hidden resource deposits on surveyed planets.', category: 'resource_extraction', statAffected: 'science', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 8 },
    acquisition: { method: 'achievement', sourceId: 'ach-master-geologist', sourceName: 'Master Geologist', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-resource-energy-director',
    name: 'Energy Director Surge',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'epic',
    description: 'Expert in energy collection, conversion, and distribution systems.',
    lore: 'Surge\'s orbital power grid design eliminated energy shortages across the entire empire.',
    stats: { command: 1, tactics: 0, engineering: 8, science: 6, diplomacy: 1, logistics: 5, stealth: 0, combat: 0, production: 7 },
    ability: { id: 'ab-resource-energy-mastery', name: 'Energy Mastery', description: 'Increases energy production by 40% and energy storage capacity by 50%.', category: 'resource_extraction', statAffected: 'engineering', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 8 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act3-ch3', sourceName: 'Power Surge', chapter: 3, act: 3, difficulty: 5 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-resource-exotic-specialist',
    name: 'Exotic Materials Expert Glimmer',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'rare',
    description: 'Collector and processor of rare and exotic materials.',
    lore: 'Glimmer has cataloged 500+ exotic materials and developed uses for each one.',
    stats: { command: 0, tactics: 0, engineering: 5, science: 6, diplomacy: 2, logistics: 4, stealth: 1, combat: 0, production: 5 },
    ability: { id: 'ab-resource-exotic-harvest', name: 'Exotic Harvest', description: 'Increases exotic material production by 30% and exotic material discovery rate by 25%.', category: 'resource_extraction', statAffected: 'production', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'expedition', sourceId: 'expedition-exotic', sourceName: 'Exotic Expedition', difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-resource-scavenger',
    name: 'Scavenger King Ratchet',
    title: 'Resource Extraction',
    category: 'resource_extraction',
    rarity: 'common',
    description: 'Scavenger who extracts value from wreckage and abandoned facilities.',
    lore: 'Ratchet can salvage anything. He once rebuilt a battle cruiser from spare parts.',
    stats: { command: 0, tactics: 1, engineering: 4, science: 1, diplomacy: 0, logistics: 5, stealth: 2, combat: 2, production: 3 },
    ability: { id: 'ab-resource-scavenge-talent', name: 'Scavenge Talent', description: 'Increases salvage from wrecks by 35% and reduces salvage processing time by 25%.', category: 'resource_extraction', statAffected: 'logistics', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch3', sourceName: 'Waste Not', chapter: 3, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },

  // ==========================================================================
  // 6. TRADE & COMMERCE (10 operators)
  // ==========================================================================
  {
    id: 'op-trade-merchant-prince',
    name: 'Merchant Prince Greed',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'legendary',
    description: 'Richest trader in the galaxy who controls a vast commercial empire.',
    lore: 'Greed can buy and sell planetary systems. His trade network spans all known space.',
    stats: { command: 1, tactics: 2, engineering: 1, science: 2, diplomacy: 9, logistics: 8, stealth: 3, combat: 0, production: 6 },
    ability: { id: 'ab-trade-merchant-empire', name: 'Merchant Empire', description: 'Increases trade income by 50% and unlocks exclusive trade routes with premium prices.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act7-ch2', sourceName: 'Commercial Empire', chapter: 2, act: 7, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-trade-market-analyst',
    name: 'Market Analyst Ticker',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'rare',
    description: 'Financial genius who predicts market trends with uncanny accuracy.',
    lore: 'Ticker has made 1,000 consecutive profitable trades on the galactic market.',
    stats: { command: 0, tactics: 2, engineering: 0, science: 4, diplomacy: 5, logistics: 5, stealth: 1, combat: 0, production: 4 },
    ability: { id: 'ab-trade-market-insight', name: 'Market Insight', description: 'Increases trade profit margins by 20% and provides market trend predictions.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-market-mastery', sourceName: 'Market Mastery', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-trade-fleet-commodore',
    name: 'Trade Fleet Commodore Convoy',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'epic',
    description: 'Commander of the imperial trade fleet protecting and managing commerce.',
    lore: 'Convoy has never lost a cargo under his protection, despite 200+ pirate attacks.',
    stats: { command: 6, tactics: 5, engineering: 2, science: 1, diplomacy: 5, logistics: 7, stealth: 2, combat: 5, production: 3 },
    ability: { id: 'ab-trade-convoy-protection', name: 'Convoy Protection', description: 'Reduces trade route piracy losses by 50% and increases trade fleet speed by 20%.', category: 'trade_commerce', statAffected: 'logistics', multiplier: 0.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-pirate-king', sourceName: 'Pirate King', difficulty: 7 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-trade-broker',
    name: 'Galactic Broker Vega',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'rare',
    description: 'Intermediary who connects buyers and sellers across the galaxy.',
    lore: 'Vega knows everyone who matters in galactic commerce and has a percentage in everything.',
    stats: { command: 0, tactics: 1, engineering: 0, science: 2, diplomacy: 7, logistics: 5, stealth: 3, combat: 0, production: 3 },
    ability: { id: 'ab-trade-broker-network', name: 'Broker Network', description: 'Increases trade route count by 30% and trade contract value by 25%.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'side_mission', sourceId: 'mission-broker-deal', sourceName: 'Broker Deal', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-trade-smuggler',
    name: 'Shadow Trader Rogue',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'uncommon',
    description: 'Smuggler who moves goods through blockades and embargoes.',
    lore: 'Rogue knows every hidden route and corrupt official in the galaxy.',
    stats: { command: 1, tactics: 3, engineering: 2, science: 1, diplomacy: 5, logistics: 4, stealth: 7, combat: 2, production: 2 },
    ability: { id: 'ab-trade-smuggle-network', name: 'Smuggle Network', description: 'Unlocks black market access and increases black market profits by 30%.', category: 'trade_commerce', statAffected: 'stealth', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch5', sourceName: 'Underworld Connections', chapter: 5, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-trade-auctioneer',
    name: 'Auction Master Bidwell',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'uncommon',
    description: 'Master of auctions who maximizes profits from galactic marketplace sales.',
    lore: 'Bidwell once sold a common asteroid for the price of a battleship through masterful auctioneering.',
    stats: { command: 0, tactics: 3, engineering: 0, science: 1, diplomacy: 6, logistics: 3, stealth: 2, combat: 0, production: 2 },
    ability: { id: 'ab-trade-auction-mastery', name: 'Auction Mastery', description: 'Increases auction sale prices by 25% and reduces auction fees by 20%.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'side_mission', sourceId: 'mission-auction-house', sourceName: 'Auction House', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-trade-currency-master',
    name: 'Currency Master Coin',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'epic',
    description: 'Financial wizard who manipulates galactic currency markets.',
    lore: 'Coin once crashed the economy of a rival empire through masterful currency speculation.',
    stats: { command: 0, tactics: 4, engineering: 0, science: 3, diplomacy: 7, logistics: 6, stealth: 4, combat: 0, production: 3 },
    ability: { id: 'ab-trade-currency-manipulation', name: 'Currency Manipulation', description: 'Increases currency exchange profits by 40% and reduces transaction costs by 30%.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'achievement', sourceId: 'ach-currency-master', sourceName: 'Currency Master', difficulty: 7 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-trade-contract-negotiator',
    name: 'Contract Negotiator Clause',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'common',
    description: 'Expert negotiator who secures favorable trade contracts.',
    lore: 'Clause has never signed a bad deal. Her contracts are so tight even the Ferengi respect them.',
    stats: { command: 0, tactics: 2, engineering: 0, science: 1, diplomacy: 6, logistics: 3, stealth: 1, combat: 0, production: 1 },
    ability: { id: 'ab-trade-contract-advantage', name: 'Contract Advantage', description: 'Improves trade contract terms by 20% and reduces contract fees by 15%.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 1.2, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch4', sourceName: 'First Contracts', chapter: 4, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-trade-resource-trader',
    name: 'Resource Trader Bulk',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'common',
    description: 'Bulk resource trader who moves massive quantities of raw materials.',
    lore: 'Bulk\'s cargo haulers move more material than some small planets consume.',
    stats: { command: 1, tactics: 1, engineering: 2, science: 0, diplomacy: 4, logistics: 6, stealth: 0, combat: 1, production: 4 },
    ability: { id: 'ab-trade-bulk-discount', name: 'Bulk Discount', description: 'Increases bulk resource trade efficiency by 25% and storage capacity by 20%.', category: 'trade_commerce', statAffected: 'logistics', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch1', sourceName: 'First Trade', chapter: 1, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-trade-licensing-officer',
    name: 'Licensing Officer Permit',
    title: 'Trade & Commerce',
    category: 'trade_commerce',
    rarity: 'rare',
    description: 'Expediter who cuts through bureaucracy for fast trade approvals.',
    lore: 'Permit can get any license approved, any tariff waived, and any restriction bypassed.',
    stats: { command: 0, tactics: 1, engineering: 0, science: 1, diplomacy: 7, logistics: 4, stealth: 4, combat: 0, production: 2 },
    ability: { id: 'ab-trade-fast-approval', name: 'Fast Approval', description: 'Reduces trade license costs by 40% and approval time by 60%.', category: 'trade_commerce', statAffected: 'diplomacy', multiplier: 0.6, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-license-approval', sourceName: 'License Approval', difficulty: 3 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },

  // ==========================================================================
  // 7. EXPLORATION & EXPEDITION (10 operators)
  // ==========================================================================
  {
    id: 'op-explore-pathfinder',
    name: 'Pathfinder Vega',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'legendary',
    description: 'Legendary explorer who has charted more unknown space than anyone alive.',
    lore: 'Vega discovered the first stable wormhole network and mapped routes to 50 new star systems.',
    stats: { command: 3, tactics: 4, engineering: 4, science: 8, diplomacy: 4, logistics: 5, stealth: 5, combat: 3, production: 2 },
    ability: { id: 'ab-explore-wormhole-mastery', name: 'Wormhole Mastery', description: 'Increases wormhole discovery chance by 40% and reduces wormhole travel time by 30%.', category: 'exploration_expedition', statAffected: 'science', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act6-ch1', sourceName: 'Beyond the Rim', chapter: 1, act: 6, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-explore-scout-captain',
    name: 'Scout Captain Recon',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'rare',
    description: 'Elite scout commander who leads deep-space reconnaissance missions.',
    lore: 'Recon has mapped 500+ systems personally and can navigate by instinct alone.',
    stats: { command: 4, tactics: 5, engineering: 3, science: 5, diplomacy: 2, logistics: 4, stealth: 6, combat: 4, production: 1 },
    ability: { id: 'ab-explore-deep-recon', name: 'Deep Recon', description: 'Increases exploration sensor range by 40% and discovery rate by 25%.', category: 'exploration_expedition', statAffected: 'stealth', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act3-ch1', sourceName: 'Into the Void', chapter: 1, act: 3, difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-explore-anomaly-hunter',
    name: 'Anomaly Hunter Drift',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'epic',
    description: 'Hunter of cosmic anomalies, gravitational distortions, and spatial phenomena.',
    lore: 'Drift has cataloged 1,000+ anomalies and discovered 50 new phenomenon types.',
    stats: { command: 2, tactics: 3, engineering: 4, science: 8, diplomacy: 1, logistics: 3, stealth: 4, combat: 2, production: 1 },
    ability: { id: 'ab-explore-anomaly-sense', name: 'Anomaly Sense', description: 'Increases anomaly detection rate by 50% and anomaly research value by 30%.', category: 'exploration_expedition', statAffected: 'science', multiplier: 1.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'expedition', sourceId: 'expedition-anomaly', sourceName: 'Anomaly Expedition', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-explore-archaeologist',
    name: 'Ruin Walker Dust',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'rare',
    description: 'Explorer of ancient ruins and lost civilizations.',
    lore: 'Dust has walked through 200+ ancient sites and decoded 15 alien languages.',
    stats: { command: 1, tactics: 2, engineering: 3, science: 7, diplomacy: 3, logistics: 3, stealth: 4, combat: 2, production: 1 },
    ability: { id: 'ab-explore-ruin-discovery', name: 'Ruin Discovery', description: 'Increases ruin discovery rate by 35% and artifact quality by 25%.', category: 'exploration_expedition', statAffected: 'science', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'side_mission', sourceId: 'mission-ancient-ruins', sourceName: 'Ancient Ruins', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-explore-expedition-leader',
    name: 'Expedition Leader Grit',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'uncommon',
    description: 'Experienced expedition commander who leads deep-space exploration missions.',
    lore: 'Grit has led 50 major expeditions and brought every crew member home alive.',
    stats: { command: 5, tactics: 4, engineering: 3, science: 4, diplomacy: 2, logistics: 5, stealth: 3, combat: 3, production: 1 },
    ability: { id: 'ab-explore-expedition-efficiency', name: 'Expedition Efficiency', description: 'Increases expedition rewards by 25% and reduces expedition fuel costs by 20%.', category: 'exploration_expedition', statAffected: 'logistics', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch1', sourceName: 'First Expedition', chapter: 1, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-explore-cartographer',
    name: 'Star Cartographer Atlas',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'uncommon',
    description: 'Master mapmaker who creates the most accurate star charts in the galaxy.',
    lore: 'Atlas\'s star charts are so precise they are used by every navy in known space.',
    stats: { command: 1, tactics: 2, engineering: 3, science: 6, diplomacy: 1, logistics: 3, stealth: 2, combat: 1, production: 1 },
    ability: { id: 'ab-explore-star-chart', name: 'Star Chart Mastery', description: 'Increases exploration map accuracy by 35% and reduces travel time by 15%.', category: 'exploration_expedition', statAffected: 'science', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 2 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch5', sourceName: 'Mapping the Stars', chapter: 5, act: 1, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-explore-first-contact',
    name: 'First Contact Specialist Echo',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'epic',
    description: 'Diplomatic specialist trained in first contact protocols and alien communication.',
    lore: 'Echo established peaceful relations with 12 previously unknown species.',
    stats: { command: 2, tactics: 2, engineering: 1, science: 6, diplomacy: 9, logistics: 2, stealth: 3, combat: 1, production: 1 },
    ability: { id: 'ab-explore-first-contact', name: 'First Contact', description: 'Improves first contact success rate by 40% and initial relations by 30 points.', category: 'exploration_expedition', statAffected: 'diplomacy', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'achievement', sourceId: 'ach-first-contact', sourceName: 'First Contact', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-explore-survivalist',
    name: 'Survivalist Wild',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'common',
    description: 'Expert survivalist who can endure extreme conditions on uncharted worlds.',
    lore: 'Wild survived 3 years alone on a hostile planet with only basic equipment.',
    stats: { command: 1, tactics: 3, engineering: 3, science: 3, diplomacy: 1, logistics: 3, stealth: 4, combat: 3, production: 1 },
    ability: { id: 'ab-explore-survival', name: 'Survival Expertise', description: 'Reduces exploration hazard damage by 30% and increases survival rate on hostile worlds by 25%.', category: 'exploration_expedition', statAffected: 'tactics', multiplier: 0.7, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch4', sourceName: 'Hostile World', chapter: 4, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-explore-deep-space-pilot',
    name: 'Deep Space Pilot Warp',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'rare',
    description: 'Pilot who specializes in extreme-distance FTL travel and navigation.',
    lore: 'Warp holds the record for the longest single FTL jump ever recorded.',
    stats: { command: 2, tactics: 2, engineering: 5, science: 5, diplomacy: 0, logistics: 3, stealth: 2, combat: 1, production: 1 },
    ability: { id: 'ab-explore-ftl-mastery', name: 'FTL Mastery', description: 'Increases FTL jump range by 30% and reduces FTL fuel consumption by 25%.', category: 'exploration_expedition', statAffected: 'engineering', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-ftl-test', sourceName: 'FTL Test', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-explore-nebula-diver',
    name: 'Nebula Diver Core',
    title: 'Exploration & Expedition',
    category: 'exploration_expedition',
    rarity: 'common',
    description: 'Specialist in navigating and exploring nebula and interstellar clouds.',
    lore: 'Core has charted 15 major nebulae and discovered rare elements in their hearts.',
    stats: { command: 1, tactics: 2, engineering: 3, science: 4, diplomacy: 0, logistics: 2, stealth: 2, combat: 1, production: 2 },
    ability: { id: 'ab-explore-nebula-navigation', name: 'Nebula Navigation', description: 'Increases nebula exploration rewards by 30% and reduces nebula travel hazards by 25%.', category: 'exploration_expedition', statAffected: 'science', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch3', sourceName: 'Nebula Crossing', chapter: 3, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },

  // ==========================================================================
  // 8. DEFENSE & SECURITY (10 operators)
  // ==========================================================================
  {
    id: 'op-defense-fortress-master',
    name: 'Fortress Architect Bulwark',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'legendary',
    description: 'Master of defensive architecture who designs impenetrable fortifications.',
    lore: 'Bulwark\'s fortress designs have never been breached. His orbital defense grids are legendary.',
    stats: { command: 4, tactics: 5, engineering: 9, science: 4, diplomacy: 1, logistics: 6, stealth: 1, combat: 3, production: 4 },
    ability: { id: 'ab-defense-fortress', name: 'Fortress Design', description: 'Increases defense structure health by 40% and shield strength by 35%.', category: 'defense_security', statAffected: 'engineering', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act6-ch4', sourceName: 'Impregnable', chapter: 4, act: 6, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-defense-shield-specialist',
    name: 'Shield Specialist Barrier',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'rare',
    description: 'Expert in planetary and ship-grade shield systems.',
    lore: 'Barrier designed the multi-layer shield system that protects the imperial homeworld.',
    stats: { command: 2, tactics: 3, engineering: 7, science: 6, diplomacy: 0, logistics: 3, stealth: 0, combat: 2, production: 3 },
    ability: { id: 'ab-defense-shield-mastery', name: 'Shield Mastery', description: 'Increases shield regeneration rate by 30% and shield capacity by 25%.', category: 'defense_security', statAffected: 'engineering', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-shield-guardian', sourceName: 'Shield Guardian', difficulty: 6 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-defense-point-defense',
    name: 'Point Defense Commander Flak',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'rare',
    description: 'Specialist in point defense systems and missile interception.',
    lore: 'Flak\'s point defense network achieved a 99.8% interception rate during the last war.',
    stats: { command: 3, tactics: 6, engineering: 5, science: 3, diplomacy: 0, logistics: 3, stealth: 1, combat: 4, production: 2 },
    ability: { id: 'ab-defense-point-defense', name: 'Point Defense', description: 'Increases missile interception rate by 35% and defense turret accuracy by 25%.', category: 'defense_security', statAffected: 'tactics', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-point-defense', sourceName: 'Point Defense', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-defense-ground-forces',
    name: 'Ground Forces Marshal Boots',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'epic',
    description: 'Supreme commander of imperial ground forces and planetary defense armies.',
    lore: 'Boots has never lost a planetary engagement. His defensive tactics are taught in every military academy.',
    stats: { command: 7, tactics: 7, engineering: 3, science: 1, diplomacy: 1, logistics: 5, stealth: 3, combat: 7, production: 2 },
    ability: { id: 'ab-defense-ground-mastery', name: 'Ground Mastery', description: 'Increases ground troop combat effectiveness by 30% and defensive fortification strength by 25%.', category: 'defense_security', statAffected: 'command', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act4-ch3', sourceName: 'Planetfall', chapter: 3, act: 4, difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-defense-security-chief',
    name: 'Security Chief Sentinel',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'uncommon',
    description: 'Internal security chief who protects imperial facilities from sabotage.',
    lore: 'Sentinel has foiled 150+ sabotage attempts and maintains the empire\'s internal security.',
    stats: { command: 2, tactics: 4, engineering: 2, science: 2, diplomacy: 1, logistics: 3, stealth: 6, combat: 4, production: 1 },
    ability: { id: 'ab-defense-counter-intel', name: 'Counter Intelligence', description: 'Increases counter-intelligence effectiveness by 30% and reduces sabotage success rate by 25%.', category: 'defense_security', statAffected: 'stealth', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch4', sourceName: 'Internal Security', chapter: 4, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-defense-battery-commander',
    name: 'Battery Commander Salvo',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'uncommon',
    description: 'Commander of planetary defense batteries and orbital cannons.',
    lore: 'Salvo\'s batteries once held off an entire fleet for 72 hours until reinforcements arrived.',
    stats: { command: 4, tactics: 5, engineering: 3, science: 2, diplomacy: 0, logistics: 3, stealth: 0, combat: 5, production: 1 },
    ability: { id: 'ab-defense-battery-barrage', name: 'Battery Barrage', description: 'Increases defense battery damage by 25% and rate of fire by 20%.', category: 'defense_security', statAffected: 'tactics', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch2', sourceName: 'Guns of the Empire', chapter: 2, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-defense-mine-layer',
    name: 'Mine Layer Specialist Minefield',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'common',
    description: 'Expert in space mine deployment and area denial tactics.',
    lore: 'Minefield\'s mine networks have destroyed 3x their cost in enemy warships.',
    stats: { command: 1, tactics: 4, engineering: 3, science: 2, diplomacy: 0, logistics: 2, stealth: 3, combat: 3, production: 1 },
    ability: { id: 'ab-defense-minefield', name: 'Minefield', description: 'Increases mine damage by 30% and mine detection difficulty for enemies by 40%.', category: 'defense_security', statAffected: 'tactics', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch5', sourceName: 'Area Denial', chapter: 5, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-defense-starbase-commander',
    name: 'Starbase Commander Nexus',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'epic',
    description: 'Commander of the imperial starbase network and deep-space stations.',
    lore: 'Nexus commands the most fortified starbase in the galaxy, a true fortress among the stars.',
    stats: { command: 6, tactics: 5, engineering: 6, science: 3, diplomacy: 2, logistics: 6, stealth: 1, combat: 5, production: 3 },
    ability: { id: 'ab-defense-starbase-bonus', name: 'Starbine Command', description: 'Increases starbase weapon damage by 30% and starbase repair rate by 40%.', category: 'defense_security', statAffected: 'command', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'achievement', sourceId: 'ach-starbase-commander', sourceName: 'Starbase Commander', difficulty: 6 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-defense-cyber-security',
    name: 'Cyber Security Operative Zero',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'rare',
    description: 'Digital security expert who protects imperial networks from cyber attacks.',
    lore: 'Zero once traced a hacker attack back to its source and shut down an entire enemy network remotely.',
    stats: { command: 0, tactics: 3, engineering: 5, science: 6, diplomacy: 0, logistics: 1, stealth: 7, combat: 1, production: 1 },
    ability: { id: 'ab-defense-cyber-shield', name: 'Cyber Shield', description: 'Reduces cyber attack damage by 50% and increases counter-hack success rate by 35%.', category: 'defense_security', statAffected: 'stealth', multiplier: 0.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'side_mission', sourceId: 'mission-cyber-attack', sourceName: 'Cyber Attack', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-defense-civil-defense',
    name: 'Civil Defense Director Haven',
    title: 'Defense & Security',
    category: 'defense_security',
    rarity: 'common',
    description: 'Coordinator of civilian protection and evacuation procedures.',
    lore: 'Haven orchestrated the largest civilian evacuation in history, saving 2 billion lives.',
    stats: { command: 3, tactics: 2, engineering: 2, science: 1, diplomacy: 3, logistics: 5, stealth: 0, combat: 0, production: 2 },
    ability: { id: 'ab-defense-civil-protection', name: 'Civil Protection', description: 'Reduces civilian casualty rate by 50% and speeds up evacuation by 40%.', category: 'defense_security', statAffected: 'logistics', multiplier: 0.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch2', sourceName: 'Protecting Civilians', chapter: 2, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },

  // ==========================================================================
  // 9. DIPLOMACY & INTELLIGENCE (10 operators)
  // ==========================================================================
  {
    id: 'op-diplo-ambassador',
    name: 'Grand Ambassador Peace',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'legendary',
    description: 'The most respected diplomat in the galaxy, able to forge peace between bitter enemies.',
    lore: 'Peace negotiated the Treaty of Galactic Unity, ending the thousand-year war.',
    stats: { command: 1, tactics: 2, engineering: 0, science: 3, diplomacy: 10, logistics: 3, stealth: 4, combat: 0, production: 2 },
    ability: { id: 'ab-diplo-grand-negotiation', name: 'Grand Negotiation', description: 'Increases diplomatic agreement success rate by 50% and treaty benefits by 40%.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.5, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act7-ch5', sourceName: 'Galactic Peace', chapter: 5, act: 7, difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-diplo-spymaster',
    name: 'Spymaster Shadow',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'legendary',
    description: 'Master of espionage who runs the empire\'s most effective intelligence network.',
    lore: 'Shadow\'s spy network penetrates every major government in the galaxy. Nothing happens without his knowledge.',
    stats: { command: 2, tactics: 5, engineering: 1, science: 4, diplomacy: 6, logistics: 3, stealth: 10, combat: 2, production: 0 },
    ability: { id: 'ab-diplo-spy-network', name: 'Spy Network', description: 'Increases espionage success rate by 40% and intelligence gathering speed by 50%.', category: 'diplomacy_intelligence', statAffected: 'stealth', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 20 },
    acquisition: { method: 'boss_defeat', sourceId: 'boss-spymaster', sourceName: 'Spymaster', difficulty: 9 },
    synergies: [],
    levels: 100, maxLevel: 100, evolutionRank: 5, isUnlockable: true,
  },
  {
    id: 'op-diplo-envoy',
    name: 'Imperial Envoy Emissary',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'rare',
    description: 'Imperial representative who maintains relations with allied and neutral powers.',
    lore: 'Emissary has served on 200 diplomatic missions and secured 180 favorable treaties.',
    stats: { command: 1, tactics: 2, engineering: 0, science: 2, diplomacy: 8, logistics: 2, stealth: 2, combat: 0, production: 1 },
    ability: { id: 'ab-diplo-envoy-mission', name: 'Envoy Mission', description: 'Increases diplomatic influence gain by 30% and improves relations with all factions by 10 points.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 5 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act3-ch2', sourceName: 'Diplomatic Corps', chapter: 2, act: 3, difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-diplo-intel-analyst',
    name: 'Intel Analyst Oracle',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'rare',
    description: 'Top intelligence analyst who pieces together fragments into actionable intelligence.',
    lore: 'Oracle predicted the last three major conflicts before any other intelligence agency.',
    stats: { command: 0, tactics: 4, engineering: 0, science: 6, diplomacy: 3, logistics: 2, stealth: 5, combat: 0, production: 1 },
    ability: { id: 'ab-diplo-intel-analysis', name: 'Intel Analysis', description: 'Increases intelligence value by 35% and provides early warning of enemy actions.', category: 'diplomacy_intelligence', statAffected: 'science', multiplier: 1.35, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'side_mission', sourceId: 'mission-intel-gathering', sourceName: 'Intel Gathering', difficulty: 4 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-diplo-double-agent',
    name: 'Double Agent Mirage',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'epic',
    description: 'Infiltrator who operates deep within enemy organizations.',
    lore: 'Mirage spent 15 years as a trusted advisor to a rival empire while feeding intelligence to the empire.',
    stats: { command: 1, tactics: 5, engineering: 1, science: 3, diplomacy: 7, logistics: 2, stealth: 9, combat: 2, production: 0 },
    ability: { id: 'ab-diplo-deep-cover', name: 'Deep Cover', description: 'Increases infiltration success rate by 40% and intelligence quality from deep-cover agents by 50%.', category: 'diplomacy_intelligence', statAffected: 'stealth', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 10 },
    acquisition: { method: 'special_event', sourceId: 'event-double-agent', sourceName: 'Double Agent', difficulty: 7 },
    synergies: [],
    levels: 60, maxLevel: 60, evolutionRank: 4, isUnlockable: true,
  },
  {
    id: 'op-diplo-treaty-negotiator',
    name: 'Treaty Negotiator Pact',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'uncommon',
    description: 'Legal expert who drafts and negotiates international treaties.',
    lore: 'Pact has drafted 500+ treaties, and none have ever been violated due to loopholes.',
    stats: { command: 0, tactics: 2, engineering: 0, science: 3, diplomacy: 7, logistics: 2, stealth: 1, combat: 0, production: 1 },
    ability: { id: 'ab-diplo-treaty-craft', name: 'Treaty Craft', description: 'Improves treaty terms by 30% and reduces treaty negotiation time by 40%.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.3, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act2-ch3', sourceName: 'Treaty Talks', chapter: 3, act: 2, difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-diplo-propagandist',
    name: 'Propaganda Minister Voice',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'uncommon',
    description: 'Master of information warfare and public perception management.',
    lore: 'Voice can turn any event into propaganda that strengthens imperial morale and weakens enemies.',
    stats: { command: 2, tactics: 3, engineering: 0, science: 2, diplomacy: 6, logistics: 1, stealth: 3, combat: 0, production: 1 },
    ability: { id: 'ab-diplo-propaganda', name: 'Propaganda Campaign', description: 'Increases empire morale by 15% and reduces enemy morale by 10% in contested regions.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.15, cooldownTurns: 0, durationTurns: 0, unlockLevel: 3 },
    acquisition: { method: 'side_mission', sourceId: 'mission-propaganda', sourceName: 'Propaganda Campaign', difficulty: 2 },
    synergies: [],
    levels: 40, maxLevel: 40, evolutionRank: 2, isUnlockable: true,
  },
  {
    id: 'op-diplo-codebreaker',
    name: 'Codebreaker Cypher',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'rare',
    description: 'Cryptographic genius who cracks enemy codes and encrypted communications.',
    lore: 'Cypher decrypted the enemy\'s military communication codes within weeks of the war starting.',
    stats: { command: 0, tactics: 3, engineering: 3, science: 7, diplomacy: 1, logistics: 1, stealth: 6, combat: 0, production: 0 },
    ability: { id: 'ab-diplo-codebreak', name: 'Codebreaking', description: 'Increases codebreaking success rate by 40% and intelligence decryption speed by 50%.', category: 'diplomacy_intelligence', statAffected: 'science', multiplier: 1.4, cooldownTurns: 0, durationTurns: 0, unlockLevel: 6 },
    acquisition: { method: 'achievement', sourceId: 'ach-codebreaker', sourceName: 'Codebreaker', difficulty: 5 },
    synergies: [],
    levels: 50, maxLevel: 50, evolutionRank: 3, isUnlockable: true,
  },
  {
    id: 'op-diplo-cultural-attache',
    name: 'Cultural Attaché Artist',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'common',
    description: 'Cultural ambassador who uses art and culture to build bridges between civilizations.',
    lore: 'Artist\'s cultural exchange programs have improved relations with over 100 species.',
    stats: { command: 0, tactics: 1, engineering: 0, science: 3, diplomacy: 6, logistics: 1, stealth: 0, combat: 0, production: 1 },
    ability: { id: 'ab-diplo-cultural-exchange', name: 'Cultural Exchange', description: 'Improves relations with alien species by 15 points and increases tourism income by 25%.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch4', sourceName: 'Cultural Exchange', chapter: 4, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
  {
    id: 'op-diplo-trade-attache',
    name: 'Trade Attaché Tariff',
    title: 'Diplomacy & Intelligence',
    category: 'diplomacy_intelligence',
    rarity: 'common',
    description: 'Commercial diplomat who secures favorable trade agreements with foreign powers.',
    lore: 'Tariff negotiated trade deals that increased imperial GDP by 15% in a single year.',
    stats: { command: 0, tactics: 1, engineering: 0, science: 1, diplomacy: 6, logistics: 4, stealth: 1, combat: 0, production: 2 },
    ability: { id: 'ab-diplo-trade-deal', name: 'Trade Deal', description: 'Increases foreign trade income by 25% and reduces import tariffs by 20%.', category: 'diplomacy_intelligence', statAffected: 'diplomacy', multiplier: 1.25, cooldownTurns: 0, durationTurns: 0, unlockLevel: 1 },
    acquisition: { method: 'story_campaign', sourceId: 'campaign-act1-ch5', sourceName: 'Trade Diplomacy', chapter: 5, act: 1, difficulty: 1 },
    synergies: [],
    levels: 30, maxLevel: 30, evolutionRank: 1, isUnlockable: true,
  },
];

// ============================================================================
// OPERATOR SYNERGIES
// ============================================================================

export const OPERATOR_SYNERGIES: readonly OperatorSynergy[] = [
  { operatorId: 'op-ship-master-drydock', partnerId: 'op-ship-architect-stellar', bonusName: 'Shipyard Synergy', bonusDescription: 'Ship construction speed +15% and ship quality +10% when both are assigned', statBonus: { engineering: 2, production: 2 } },
  { operatorId: 'op-combat-fleet-admiral', partnerId: 'op-combat-tactician', bonusName: 'Command Synergy', bonusDescription: 'Fleet combat effectiveness +20% and command range +30% when both are assigned', statBonus: { command: 3, tactics: 2 } },
  { operatorId: 'op-research-director', partnerId: 'op-research-physicist', bonusName: 'Research Synergy', bonusDescription: 'All research speed +25% and breakthrough chance +15% when both are assigned', statBonus: { science: 3, engineering: 1 } },
  { operatorId: 'op-resource-mine-foreman', partnerId: 'op-resource-refinery-chief', bonusName: 'Extraction Synergy', bonusDescription: 'Resource production +20% and processing efficiency +15% when both are assigned', statBonus: { production: 3, logistics: 1 } },
  { operatorId: 'op-trade-merchant-prince', partnerId: 'op-trade-market-analyst', bonusName: 'Trade Synergy', bonusDescription: 'Trade income +30% and market intelligence +25% when both are assigned', statBonus: { diplomacy: 2, logistics: 2 } },
  { operatorId: 'op-explore-pathfinder', partnerId: 'op-explore-scout-captain', bonusName: 'Exploration Synergy', bonusDescription: 'Exploration speed +20% and discovery rate +25% when both are assigned', statBonus: { science: 2, stealth: 2 } },
  { operatorId: 'op-defense-fortress-master', partnerId: 'op-defense-battery-commander', bonusName: 'Defense Synergy', bonusDescription: 'Defense structure effectiveness +25% and shield strength +20% when both are assigned', statBonus: { engineering: 2, tactics: 2 } },
  { operatorId: 'op-diplo-ambassador', partnerId: 'op-diplo-envoy', bonusName: 'Diplomatic Synergy', bonusDescription: 'Diplomatic influence +30% and treaty success rate +20% when both are assigned', statBonus: { diplomacy: 3, stealth: 1 } },
  { operatorId: 'op-colony-governor', partnerId: 'op-colony-terraformer', bonusName: 'Colony Synergy', bonusDescription: 'Colony growth +25% and terraforming speed +30% when both are assigned', statBonus: { logistics: 2, engineering: 2 } },
  { operatorId: 'op-ship-fleet-quartermaster', partnerId: 'op-combat-strike-leader', bonusName: 'Fleet Logistics Synergy', bonusDescription: 'Fleet deployment speed +20% and supply efficiency +25% when both are assigned', statBonus: { logistics: 3, command: 1 } },
  { operatorId: 'op-diplo-spymaster', partnerId: 'op-diplo-intel-analyst', bonusName: 'Intelligence Synergy', bonusDescription: 'Intelligence gathering +40% and analysis accuracy +30% when both are assigned', statBonus: { stealth: 3, science: 1 } },
  { operatorId: 'op-defense-ground-forces', partnerId: 'op-combat-boss-killer', bonusName: 'Assault Synergy', bonusDescription: 'Ground assault effectiveness +30% and boss damage +20% when both are assigned', statBonus: { combat: 3, tactics: 1 } },
  { operatorId: 'op-research-computer-scientist', partnerId: 'op-research-psionicist', bonusName: 'Transcendence Synergy', bonusDescription: 'Unlocks advanced research paths and increases research speed by 35% when both are assigned', statBonus: { science: 4 } },
  { operatorId: 'op-defense-shield-specialist', partnerId: 'op-ship-nano-forge', bonusName: 'Protection Synergy', bonusDescription: 'Ship survivability +20% and shield effectiveness +25% when both are assigned', statBonus: { engineering: 2, tactics: 1 } },
  { operatorId: 'op-trade-fleet-commodore', partnerId: 'op-trade-resource-trader', bonusName: 'Trade Fleet Synergy', bonusDescription: 'Trade route capacity +30% and cargo safety +25% when both are assigned', statBonus: { logistics: 2, diplomacy: 1 } },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getOperatorById(id: string): OperatorEntry | undefined {
  return EMPIRE_OPERATORS.find(o => o.id === id);
}

export function getOperatorsByCategory(category: OperatorCategory): readonly OperatorEntry[] {
  return EMPIRE_OPERATORS.filter(o => o.category === category);
}

export function getOperatorsByRarity(rarity: OperatorRarity): readonly OperatorEntry[] {
  return EMPIRE_OPERATORS.filter(o => o.rarity === rarity);
}

export function getOperatorsByAcquisitionMethod(method: OperatorAcquisitionMethod): readonly OperatorEntry[] {
  return EMPIRE_OPERATORS.filter(o => o.acquisition.method === method);
}

export function getOperatorsForCampaign(act: number, chapter: number): readonly OperatorEntry[] {
  return EMPIRE_OPERATORS.filter(o =>
    o.acquisition.method === 'story_campaign' &&
    o.acquisition.act === act &&
    o.acquisition.chapter === chapter
  );
}

export function getOperatorsForBoss(bossId: string): readonly OperatorEntry[] {
  return EMPIRE_OPERATORS.filter(o =>
    o.acquisition.method === 'boss_defeat' &&
    o.acquisition.sourceId === bossId
  );
}

export function getOperatorSynergiesFor(operatorId: string): readonly OperatorSynergy[] {
  return OPERATOR_SYNERGIES.filter(s => s.operatorId === operatorId || s.partnerId === operatorId);
}

export function getOperatorBySourceId(sourceId: string): OperatorEntry | undefined {
  return EMPIRE_OPERATORS.find(o => o.acquisition.sourceId === sourceId);
}

export const OPERATOR_CATEGORIES: readonly { category: OperatorCategory; name: string; description: string }[] = [
  { category: 'shipyard_operations', name: 'Shipyard Operations', description: 'Ship construction, repair, and fleet logistics' },
  { category: 'combat_command', name: 'Combat Command', description: 'Fleet combat, boss battles, and PvP operations' },
  { category: 'colony_administration', name: 'Colony Administration', description: 'Planetary management, terraforming, and population' },
  { category: 'research_directorate', name: 'Research Directorate', description: 'Technology research and scientific discovery' },
  { category: 'resource_extraction', name: 'Resource Extraction', description: 'Mining, harvesting, and resource processing' },
  { category: 'trade_commerce', name: 'Trade & Commerce', description: 'Interstellar trade, market operations, and commerce' },
  { category: 'exploration_expedition', name: 'Exploration & Expedition', description: 'Deep space exploration and expedition missions' },
  { category: 'defense_security', name: 'Defense & Security', description: 'Military defense, starbases, and internal security' },
  { category: 'diplomacy_intelligence', name: 'Diplomacy & Intelligence', description: 'Foreign relations, espionage, and intelligence' },
];

export function getCategoryName(category: OperatorCategory): string {
  return OPERATOR_CATEGORIES.find(c => c.category === category)?.name ?? category;
}

export const TOTAL_OPERATORS = EMPIRE_OPERATORS.length; // 90
