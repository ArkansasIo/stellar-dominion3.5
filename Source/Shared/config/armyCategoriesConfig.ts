/**
 * Army Unit Categories & Sub-Categories Configuration
 *
 * 18 top-level categories and 32 sub-categories with full metadata.
 * Each entry includes class/sub-class tier ranges (1–99), type/sub-type,
 * default ranks, subject affinities, descriptions, and sub-descriptions.
 *
 * @tag #army #categories #subcategories #classification #tiers
 */

import type {
  UnitCategoryMeta,
  UnitSubCategoryMeta,
  UnitCategory,
  UnitSubCategory,
  ArmyUnitDefinition,
  UnitStats,
  UnitSubStats,
  UnitAttributes,
  UnitSubAttributes,
  SubjectDetail,
  UnitDescriptions,
} from '../types/armyUnitTypes';

// ============================================================================
// HELPER: default sub-stats baseline
// ============================================================================

function baseSubStats(overrides: Partial<UnitSubStats> = {}): UnitSubStats {
  return {
    criticalHitChance: 5,
    criticalDamageMultiplier: 1.5,
    armorPenetration: 0,
    shieldBreakPower: 0,
    flankingBonus: 0,
    moraleDamage: 1,
    suppressionResistance: 10,
    supplyConsumption: 1,
    recruitmentTime: 2,
    maintenanceCost: 10,
    counterattackChance: 5,
    leadershipBonus: 0,
    ambushBonus: 0,
    fortificationBonus: 0,
    healingReceived: 1.0,
    sightRange: 3,
    communicationsRange: 5,
    electronicResistance: 5,
    psionicResistance: 5,
    terrainAdaptation: 0,
    ...overrides,
  };
}

function baseAttributes(overrides: Partial<UnitAttributes> = {}): UnitAttributes {
  return {
    strength: 20,
    agility: 20,
    intelligence: 20,
    endurance: 20,
    leadership: 10,
    adaptability: 20,
    resilience: 20,
    precision: 20,
    ...overrides,
  };
}

function baseSubAttributes(
  overrides: Partial<UnitSubAttributes> = {}
): UnitSubAttributes {
  const defaults: UnitSubAttributes = {
    strength: { physicalPower: 10, loadCapacity: 10, meleeDamage: 5, heavyWeaponProficiency: 5 },
    agility: { movementSpeed: 8, evasionRating: 8, reactionTime: 8, stealthCapability: 3 },
    intelligence: { tacticalAwareness: 8, techProficiency: 5, targetPriority: 8, countermeasures: 5 },
    endurance: { staminaPool: 10, damageThreshold: 8, recoveryRate: 5, terrainAdaptation: 5 },
    leadership: { squadMorale: 5, commandRadius: 3, inspirationBonus: 3, orderEfficiency: 5 },
    adaptability: { environmentalTolerance: 5, weaponVersatility: 8, trainingSpeed: 5, missionFlexibility: 5 },
    resilience: { statusResistance: 8, moraleSuppression: 3, fearImmunity: 3, recoveryBonus: 5 },
    precision: { aimRating: 8, rangeExtension: 3, weakspotDetection: 5, minimumCollateral: 5 },
  };
  return { ...defaults, ...overrides };
}

// ============================================================================
// 18 CATEGORY METADATA
// ============================================================================

export const UNIT_CATEGORY_META: UnitCategoryMeta[] = [
  {
    id: 'infantry_corps',
    name: 'Infantry Corps',
    description: 'Versatile foot soldiers forming the backbone of any ground campaign.',
    subDescription:
      'Infantry Corps units are trained for diverse combat environments, from urban warfare to open-field engagements. They form the primary maneuver element of ground forces, capable of holding positions, clearing areas, and exploiting breakthroughs.',
    subCategories: ['light_infantry', 'rifle_squad', 'assault_squad'],
    primaryType: 'soldier',
    loreText: 'In a galaxy of titans and war machines, it is the soldier who wins the ground and holds it.',
  },
  {
    id: 'heavy_infantry',
    name: 'Heavy Infantry',
    description: 'Heavily armored troops specializing in frontline assault and breaching.',
    subDescription:
      'Heavy Infantry leverage advanced armor systems to absorb punishment that would destroy lighter units. They spearhead assaults, hold critical chokepoints, and suppress defensive positions with overwhelming sustained fire.',
    subCategories: ['power_armor_unit', 'siege_breakers'],
    primaryType: 'soldier',
    loreText: 'The wall does not yield. Neither do we.',
  },
  {
    id: 'armored_forces',
    name: 'Armored Forces',
    description: 'Tank and armored vehicle formations providing shock and firepower.',
    subDescription:
      'Armored Forces units combine protection, mobility, and firepower to dominate open terrain. From light recon vehicles to main battle tanks, these units punch through defensive lines and exploit gaps created by infantry and artillery.',
    subCategories: ['light_armor', 'main_battle_tank', 'armored_personnel_carrier'],
    primaryType: 'vehicle',
    loreText: 'Steel moves where flesh cannot follow.',
  },
  {
    id: 'artillery_corps',
    name: 'Artillery Corps',
    description: 'Long-range fire support and area-denial weapons systems.',
    subDescription:
      'Artillery Corps units deliver devastating indirect fire against massed enemy formations, fortifications, and strategic targets. They shape the battlefield before the infantry arrives and provide fire support during engagements.',
    subCategories: ['field_artillery', 'siege_weapons'],
    primaryType: 'vehicle',
    loreText: 'The artillery does not ask permission to destroy.',
  },
  {
    id: 'air_forces',
    name: 'Air Forces',
    description: 'Aerial combat, strategic bombing, and air cavalry operations.',
    subDescription:
      'Air Forces units dominate the vertical dimension of the battlefield, providing close air support, air superiority, strategic interdiction, and rapid troop deployment. Air superiority is a prerequisite for most major offensives.',
    subCategories: ['fighter_squadron', 'bomber_wing', 'air_cavalry'],
    primaryType: 'aerial',
    loreText: 'He who owns the sky, owns the battle.',
  },
  {
    id: 'naval_forces',
    name: 'Naval Forces',
    description: 'Maritime combat and power projection through sea lanes and orbital approaches.',
    subDescription:
      'Naval Forces units control waterways and serve as mobile platforms for power projection. Destroyer-class vessels engage surface and submarine threats, while carrier strike groups project air power across vast distances.',
    subCategories: ['destroyer_class', 'carrier_strike'],
    primaryType: 'naval',
    loreText: 'The sea yields to none — unless you command the fleet.',
  },
  {
    id: 'mech_exoskeleton',
    name: 'Mech & Exoskeleton',
    description: 'Piloted mechanical suits combining human skill with machine power.',
    subDescription:
      'Mech and Exoskeleton units represent the apex of personal combat technology. A single pilot in a battle mech can engage entire platoons, and a command mech can coordinate an entire theater of operations while remaining in the thick of battle.',
    subCategories: ['battle_mech', 'command_mech'],
    primaryType: 'mech',
    loreText: 'The mech is not a weapon. It is a soldier who never tires.',
  },
  {
    id: 'special_operations',
    name: 'Special Operations',
    description: 'Elite covert forces executing precision missions behind enemy lines.',
    subDescription:
      'Special Operations units are trained to accomplish objectives that conventional forces cannot: sabotage, assassination, hostage rescue, and strategic reconnaissance. Their small size belies their enormous strategic impact.',
    subCategories: ['commando_unit', 'stealth_operative'],
    primaryType: 'soldier',
    loreText: 'The greatest victory is the one the enemy never knew was fought.',
  },
  {
    id: 'support_logistics',
    name: 'Support & Logistics',
    description: 'Medical, supply, and field support services sustaining combat operations.',
    subDescription:
      'Support & Logistics units are the lifeblood of sustained operations. Without medical evacuation, ammunition resupply, and fuel convoys, even the finest combat units will eventually grind to a halt.',
    subCategories: ['medic_corps', 'supply_train'],
    primaryType: 'support',
    loreText: 'An army without logistics is just a mob with weapons.',
  },
  {
    id: 'engineering_corps',
    name: 'Engineering Corps',
    description: 'Combat and support engineers for construction, demolition, and repair.',
    subDescription:
      'Engineering Corps units shape the physical battlefield, constructing fortifications, bridging obstacles, clearing minefields, and demolishing enemy structures. In siege operations, they are often the decisive element.',
    subCategories: ['combat_engineers', 'siege_engineers'],
    primaryType: 'soldier',
    loreText: 'We build the roads that armies march on, and the walls that stop them.',
  },
  {
    id: 'intelligence_recon',
    name: 'Intelligence & Recon',
    description: 'Reconnaissance and intelligence-gathering units providing battlefield awareness.',
    subDescription:
      'Intelligence & Recon units extend the commander\'s senses across the battlefield. Scout units probe enemy positions while signal corps intercept communications, building a comprehensive picture of enemy capabilities and intentions.',
    subCategories: ['scout_unit', 'signal_corps'],
    primaryType: 'soldier',
    loreText: 'Know your enemy before the first shot is fired.',
  },
  {
    id: 'electronic_warfare',
    name: 'Electronic Warfare',
    description: 'Electromagnetic spectrum operations disrupting enemy systems.',
    subDescription:
      'Electronic Warfare units operate in the invisible domain of the electromagnetic spectrum, jamming enemy communications, spoofing sensors, disabling guided weapons, and protecting friendly systems from the same threats.',
    subCategories: ['ew_squadron'],
    primaryType: 'cyber',
    loreText: 'The invisible weapon cuts deeper than any blade.',
  },
  {
    id: 'space_combat',
    name: 'Space Combat Forces',
    description: 'Orbital assault and space superiority units for exo-atmospheric operations.',
    subDescription:
      'Space Combat Forces operate in and from orbit, conducting orbital bombardment, orbital drop assaults, and defending friendly space assets from enemy attack. They bridge the gap between conventional warfare and interstellar conflict.',
    subCategories: ['orbital_strike'],
    primaryType: 'orbital',
    loreText: 'From the heavens, we descend. And nothing below survives.',
  },
  {
    id: 'cyber_drone',
    name: 'Cyber & Drone Units',
    description: 'Unmanned systems and cyberwarfare units operating autonomously.',
    subDescription:
      'Cyber & Drone units operate without risking personnel in direct combat. Drone swarms overwhelm enemy point defenses through sheer numbers, while cyber operatives infiltrate enemy networks to steal intelligence and sabotage critical systems.',
    subCategories: ['drone_swarm'],
    primaryType: 'cyber',
    loreText: 'When the machine fights, the soldier lives.',
  },
  {
    id: 'chemical_defense',
    name: 'Chemical Defense',
    description: 'CBRN specialists protecting forces from chemical, biological, radiological threats.',
    subDescription:
      'Chemical Defense units provide critical protection against the most devastating non-conventional weapons. Hazmat units decontaminate affected areas, treat casualties, and advise commanders on CBRN threat mitigation.',
    subCategories: ['hazmat_unit'],
    primaryType: 'support',
    loreText: 'When the sky turns yellow, call us. We have been waiting.',
  },
  {
    id: 'psionic_forces',
    name: 'Psionic Forces',
    description: 'Rare psychic operatives leveraging mental powers in combat.',
    subDescription:
      'Psionic Forces represent the bleeding edge of military capability, employing operatives with documented psychic abilities for tasks ranging from remote viewing to direct mental assault. Their existence remains classified at most clearance levels.',
    subCategories: ['psionic_operative'],
    primaryType: 'psionic',
    loreText: 'The mind is the last fortress — and the last to be breached.',
  },
  {
    id: 'mercenary_contractors',
    name: 'Mercenary Contractors',
    description: 'Hired military professionals offering specialized skills for pay.',
    subDescription:
      'Mercenary Contractors augment regular forces with veteran fighters who ask only for payment and clear orders. Their loyalty is contractual, not ideological, making them reliable within mission parameters but unsuitable for garrisoning sensitive positions.',
    subCategories: ['hired_guns'],
    primaryType: 'soldier',
    loreText: 'We fight for coin, not causes. But coin buys results.',
  },
  {
    id: 'command_hq',
    name: 'Command & HQ',
    description: 'Command formations providing leadership, coordination, and strategic direction.',
    subDescription:
      'Command & HQ units provide the nervous system for large military operations, coordinating multiple unit types, managing supply lines, issuing orders, and maintaining morale across extended campaigns. Without effective command, even elite units underperform.',
    subCategories: ['field_hq'],
    primaryType: 'commander',
    loreText: 'One general is worth a thousand soldiers. A great general, ten thousand.',
  },
];

// ============================================================================
// 32 SUB-CATEGORY METADATA
// ============================================================================

export const UNIT_SUB_CATEGORY_META: UnitSubCategoryMeta[] = [
  // --- infantry_corps (3) ---
  {
    id: 'light_infantry',
    parentCategory: 'infantry_corps',
    name: 'Light Infantry',
    description: 'Fast-moving foot soldiers optimized for mobility and rapid deployment.',
    subDescription:
      'Light Infantry sacrifice heavy protection for speed and operational range. They excel in mountain, jungle, and urban terrain where vehicles cannot follow, and serve as the primary screening and skirmishing force.',
    primarySubType: 'light',
    defaultRank: 'private',
    classTierRange: { min: 1, max: 30 },
    subClassTierRange: { min: 1, max: 25 },
    subjects: ['tactics', 'ballistics', 'stealth'],
    loreText: 'Fast, quiet, deadly — and gone before you knew they were there.',
  },
  {
    id: 'rifle_squad',
    parentCategory: 'infantry_corps',
    name: 'Rifle Squad',
    description: 'Standard combined-arms infantry squads built around the service rifle.',
    subDescription:
      'The Rifle Squad is the fundamental maneuver element of ground combat. Trained in fire-and-movement, they can assault defended positions, conduct hasty defense, and maintain sustained combat operations across diverse environments.',
    primarySubType: 'medium',
    defaultRank: 'corporal',
    classTierRange: { min: 1, max: 40 },
    subClassTierRange: { min: 1, max: 35 },
    subjects: ['ballistics', 'tactics', 'explosives'],
    loreText: 'The squad is the family. The family fights as one.',
  },
  {
    id: 'assault_squad',
    parentCategory: 'infantry_corps',
    name: 'Assault Squad',
    description: 'Shock infantry specialized in attacking fortified positions and close combat.',
    subDescription:
      'Assault Squads train relentlessly for breaching operations, close-quarters battle, and fighting through prepared enemy defenses. They lead the charge when positions must be taken at any cost.',
    primarySubType: 'assault',
    defaultRank: 'sergeant',
    classTierRange: { min: 5, max: 50 },
    subClassTierRange: { min: 5, max: 45 },
    subjects: ['tactics', 'explosives', 'ballistics'],
    loreText: 'No door stays locked. No wall stands when we come through.',
  },
  // --- heavy_infantry (2) ---
  {
    id: 'power_armor_unit',
    parentCategory: 'heavy_infantry',
    name: 'Power Armor Unit',
    description: 'Soldiers in powered exoskeletal armor providing enhanced protection and strength.',
    subDescription:
      'Power Armor Units wear servo-assisted combat suits that multiply their physical capabilities many times over. They can carry heavy weapons as personal arms, withstand fire that would destroy unarmored infantry, and clear fortified positions single-handedly.',
    primarySubType: 'heavy',
    defaultRank: 'sergeant',
    classTierRange: { min: 10, max: 60 },
    subClassTierRange: { min: 8, max: 55 },
    subjects: ['ballistics', 'tactics', 'engineering'],
    loreText: 'In the armor, you are not a soldier. You are a weapon.',
  },
  {
    id: 'siege_breakers',
    parentCategory: 'heavy_infantry',
    name: 'Siege Breakers',
    description: 'Specialist assault troops trained to breach and destroy hardened fortifications.',
    subDescription:
      'Siege Breakers are the hammer against fortifications that other units cannot crack. Equipped with breaching charges, plasma cutters, and heavy demo tools, they bring down walls, neutralize bunkers, and clear underground complexes.',
    primarySubType: 'siege',
    defaultRank: 'staff_sergeant',
    classTierRange: { min: 15, max: 70 },
    subClassTierRange: { min: 12, max: 65 },
    subjects: ['explosives', 'engineering', 'tactics'],
    loreText: 'Walls, gates, shields — all things are equally temporary when we arrive.',
  },
  // --- armored_forces (3) ---
  {
    id: 'light_armor',
    parentCategory: 'armored_forces',
    name: 'Light Armor',
    description: 'Fast recon and screening vehicles balancing mobility with firepower.',
    subDescription:
      'Light Armor units provide the commander\'s eyes on the ground, probing enemy positions, screening friendly movements, and exploiting breakthroughs too rapidly for main battle tanks. Their speed is their armor.',
    primarySubType: 'light',
    defaultRank: 'corporal',
    classTierRange: { min: 5, max: 40 },
    subClassTierRange: { min: 3, max: 35 },
    subjects: ['tactics', 'ballistics', 'logistics'],
    loreText: 'By the time they see us, we are already elsewhere.',
  },
  {
    id: 'main_battle_tank',
    parentCategory: 'armored_forces',
    name: 'Main Battle Tank',
    description: 'The premier ground combat vehicle combining armor, firepower, and mobility.',
    subDescription:
      'The Main Battle Tank represents the pinnacle of conventional ground combat power. Its combination of protective armor, high-velocity cannon, and battlefield mobility makes it the decisive weapon in armored engagements.',
    primarySubType: 'heavy',
    defaultRank: 'sergeant',
    classTierRange: { min: 15, max: 70 },
    subClassTierRange: { min: 12, max: 65 },
    subjects: ['ballistics', 'tactics', 'engineering'],
    loreText: 'The tank does not negotiate. It demonstrates.',
  },
  {
    id: 'armored_personnel_carrier',
    parentCategory: 'armored_forces',
    name: 'Armored Personnel Carrier',
    description: 'Protected troop transport and battlefield taxi for mechanized infantry.',
    subDescription:
      'The APC moves infantry to the battle in relative safety, then provides fire support as the dismounts fight. Modern APCs are more than transports — they are fighting vehicles capable of independent action.',
    primarySubType: 'medium',
    defaultRank: 'corporal',
    classTierRange: { min: 8, max: 50 },
    subClassTierRange: { min: 5, max: 45 },
    subjects: ['logistics', 'tactics', 'ballistics'],
    loreText: 'The iron womb delivers warriors to war.',
  },
  // --- artillery_corps (2) ---
  {
    id: 'field_artillery',
    parentCategory: 'artillery_corps',
    name: 'Field Artillery',
    description: 'Mobile howitzers and rocket systems providing indirect fire support.',
    subDescription:
      'Field Artillery units deliver steel on target at ranges infantry cannot reach, softening defenses before assaults, breaking up enemy formations, and conducting counter-battery fire against enemy artillery.',
    primarySubType: 'fire_support',
    defaultRank: 'sergeant',
    classTierRange: { min: 10, max: 60 },
    subClassTierRange: { min: 8, max: 55 },
    subjects: ['ballistics', 'tactics', 'logistics'],
    loreText: 'We do not see the enemy. We only see the coordinates.',
  },
  {
    id: 'siege_weapons',
    parentCategory: 'artillery_corps',
    name: 'Siege Weapons',
    description: 'Heavy ordnance systems for reducing hardened fortifications and structures.',
    subDescription:
      'Siege Weapons are the ultimate answer to fixed fortifications. Rail guns, plasma mortars, and mass-driver emplacements bring down the most heavily reinforced structures and deny large areas to enemy forces.',
    primarySubType: 'siege',
    defaultRank: 'staff_sergeant',
    classTierRange: { min: 20, max: 80 },
    subClassTierRange: { min: 18, max: 75 },
    subjects: ['ballistics', 'engineering', 'explosives'],
    loreText: 'No fortress is permanent. Merely expensive to reduce.',
  },
  // --- air_forces (3) ---
  {
    id: 'fighter_squadron',
    parentCategory: 'air_forces',
    name: 'Fighter Squadron',
    description: 'Air superiority fighters contesting enemy air power.',
    subDescription:
      'Fighter Squadrons are the sentinels of the sky, denying the enemy use of the air domain while protecting friendly forces from aerial attack. Air superiority won by fighters enables all other air and ground operations.',
    primarySubType: 'assault',
    defaultRank: 'first_lieutenant',
    classTierRange: { min: 15, max: 65 },
    subClassTierRange: { min: 12, max: 60 },
    subjects: ['air_operations', 'ballistics', 'tactics'],
    loreText: 'The sky is not neutral. We make it ours.',
  },
  {
    id: 'bomber_wing',
    parentCategory: 'air_forces',
    name: 'Bomber Wing',
    description: 'Strategic bombers delivering massive ordnance against ground targets.',
    subDescription:
      'Bomber Wings carry the heaviest aerial ordinance available, striking targets that would require entire ground units to assault conventionally. A single bombing raid can eliminate a division-level position.',
    primarySubType: 'fire_support',
    defaultRank: 'captain',
    classTierRange: { min: 20, max: 75 },
    subClassTierRange: { min: 18, max: 70 },
    subjects: ['air_operations', 'ballistics', 'explosives'],
    loreText: 'We do not fight the enemy. We erase the coordinates they occupy.',
  },
  {
    id: 'air_cavalry',
    parentCategory: 'air_forces',
    name: 'Air Cavalry',
    description: 'Helicopter-borne assault troops combining mobility with firepower.',
    subDescription:
      'Air Cavalry units bridge the gap between air and ground forces, inserting troops by helicopter into positions inaccessible by land, conducting aerial reconnaissance, and providing dedicated close air support to ground units.',
    primarySubType: 'rapid_deployment',
    defaultRank: 'captain',
    classTierRange: { min: 18, max: 70 },
    subClassTierRange: { min: 15, max: 65 },
    subjects: ['air_operations', 'tactics', 'logistics'],
    loreText: 'We ride the thunder and land like a storm.',
  },
  // --- naval_forces (2) ---
  {
    id: 'destroyer_class',
    parentCategory: 'naval_forces',
    name: 'Destroyer Class',
    description: 'Fast, multi-role warships escorting larger vessels and hunting submarines.',
    subDescription:
      'Destroyer-class vessels are the workhorses of the fleet, conducting anti-submarine warfare, surface combat, and screening operations for capital ships. Their versatility makes them indispensable to any naval task force.',
    primarySubType: 'medium',
    defaultRank: 'captain',
    classTierRange: { min: 20, max: 70 },
    subClassTierRange: { min: 18, max: 65 },
    subjects: ['naval_operations', 'ballistics', 'tactics'],
    loreText: 'Swift enough to hunt, strong enough to survive.',
  },
  {
    id: 'carrier_strike',
    parentCategory: 'naval_forces',
    name: 'Carrier Strike Group',
    description: 'Carrier-centric task forces projecting air power across vast distances.',
    subDescription:
      'Carrier Strike Groups are the ultimate expression of naval power projection. Centered on a carrier capable of operating dozens of aircraft, they can project decisive air power anywhere within operational range without need of land bases.',
    primarySubType: 'command',
    defaultRank: 'colonel',
    classTierRange: { min: 30, max: 90 },
    subClassTierRange: { min: 25, max: 85 },
    subjects: ['naval_operations', 'air_operations', 'command'],
    loreText: 'A carrier is not a ship. It is a sovereign territory that moves.',
  },
  // --- mech_exoskeleton (2) ---
  {
    id: 'battle_mech',
    parentCategory: 'mech_exoskeleton',
    name: 'Battle Mech',
    description: 'Heavy piloted mech suit optimized for front-line combat.',
    subDescription:
      'The Battle Mech is a walking weapons platform, capable of engaging tanks, aircraft, and infantry with equal lethality. Its combination of heavy armor, high mobility, and diverse weapon loadouts makes it the most feared unit type on the modern battlefield.',
    primarySubType: 'heavy',
    defaultRank: 'captain',
    classTierRange: { min: 25, max: 80 },
    subClassTierRange: { min: 22, max: 75 },
    subjects: ['ballistics', 'tactics', 'engineering'],
    loreText: 'One pilot. One war machine. No survivors among those who stand against it.',
  },
  {
    id: 'command_mech',
    parentCategory: 'mech_exoskeleton',
    name: 'Command Mech',
    description: 'Elite command variant mech providing battlefield leadership and coordination.',
    subDescription:
      'The Command Mech combines the combat power of a battle mech with sophisticated command-and-control systems, allowing its pilot to simultaneously fight and direct the entire battlespace. It is the most prized and most feared asset on any battlefield.',
    primarySubType: 'command',
    defaultRank: 'colonel',
    classTierRange: { min: 40, max: 99 },
    subClassTierRange: { min: 35, max: 95 },
    subjects: ['command', 'tactics', 'ballistics', 'electronics'],
    loreText: 'It leads from the front, because the front is where it belongs.',
  },
  // --- special_operations (2) ---
  {
    id: 'commando_unit',
    parentCategory: 'special_operations',
    name: 'Commando Unit',
    description: 'Elite direct-action special forces for high-value target missions.',
    subDescription:
      'Commando Units are the sharpest point of the military spear. Trained to operate deep behind enemy lines, they execute direct-action raids, sabotage operations, and high-value target elimination with surgical precision.',
    primarySubType: 'elite',
    defaultRank: 'staff_sergeant',
    classTierRange: { min: 20, max: 75 },
    subClassTierRange: { min: 18, max: 70 },
    subjects: ['stealth', 'tactics', 'explosives', 'ballistics'],
    loreText: 'We do not fight battles. We end them.',
  },
  {
    id: 'stealth_operative',
    parentCategory: 'special_operations',
    name: 'Stealth Operative',
    description: 'Highly trained infiltration specialists operating undetected in hostile territory.',
    subDescription:
      'Stealth Operatives are the ghosts of the military: present everywhere, visible nowhere. They conduct long-range reconnaissance, place targeting designators for precision strikes, and eliminate priority targets without ever being detected.',
    primarySubType: 'stealth',
    defaultRank: 'warrant_officer',
    classTierRange: { min: 25, max: 80 },
    subClassTierRange: { min: 20, max: 75 },
    subjects: ['stealth', 'intelligence', 'tactics'],
    loreText: 'The best operation leaves the enemy unsure anything happened.',
  },
  // --- support_logistics (2) ---
  {
    id: 'medic_corps',
    parentCategory: 'support_logistics',
    name: 'Medic Corps',
    description: 'Combat medical personnel providing casualty care and evacuation.',
    subDescription:
      'Medic Corps personnel save lives under fire, treating wounded soldiers and returning them to combat when possible, or evacuating serious casualties to rear-area medical facilities. Their presence dramatically improves unit endurance.',
    primarySubType: 'garrison',
    defaultRank: 'corporal',
    classTierRange: { min: 1, max: 40 },
    subClassTierRange: { min: 1, max: 35 },
    subjects: ['medical', 'logistics', 'tactics'],
    loreText: 'I am the reason soldiers live to fight another day.',
  },
  {
    id: 'supply_train',
    parentCategory: 'support_logistics',
    name: 'Supply Train',
    description: 'Logistics convoys delivering ammunition, food, fuel, and equipment.',
    subDescription:
      'The Supply Train is the vital artery of military operations. Without regular resupply of ammunition, fuel, and rations, even the most capable fighting units will exhaust their combat power and become combat ineffective.',
    primarySubType: 'garrison',
    defaultRank: 'private',
    classTierRange: { min: 1, max: 35 },
    subClassTierRange: { min: 1, max: 30 },
    subjects: ['logistics', 'tactics'],
    loreText: 'Without us, the warriors have nothing to fight with.',
  },
  // --- engineering_corps (2) ---
  {
    id: 'combat_engineers',
    parentCategory: 'engineering_corps',
    name: 'Combat Engineers',
    description: 'Multi-purpose engineers providing mobility, counter-mobility, and protection.',
    subDescription:
      'Combat Engineers clear obstacles for advancing forces, emplace obstacles for defending forces, construct fighting positions and bridges, and conduct demolition operations — all while under direct enemy fire.',
    primarySubType: 'medium',
    defaultRank: 'sergeant',
    classTierRange: { min: 5, max: 50 },
    subClassTierRange: { min: 3, max: 45 },
    subjects: ['engineering', 'explosives', 'tactics'],
    loreText: 'We make the impossible route passable and the easy route impossible.',
  },
  {
    id: 'siege_engineers',
    parentCategory: 'engineering_corps',
    name: 'Siege Engineers',
    description: 'Specialist engineers constructing and destroying large-scale fortifications.',
    subDescription:
      'Siege Engineers specialize in large-scale construction and destruction, erecting field fortifications and military installations, or systematically reducing enemy fortifications using mining, sapping, and heavy demolition.',
    primarySubType: 'siege',
    defaultRank: 'staff_sergeant',
    classTierRange: { min: 15, max: 65 },
    subClassTierRange: { min: 12, max: 60 },
    subjects: ['engineering', 'explosives', 'ballistics'],
    loreText: 'Given enough time, we can build or destroy anything.',
  },
  // --- intelligence_recon (2) ---
  {
    id: 'scout_unit',
    parentCategory: 'intelligence_recon',
    name: 'Scout Unit',
    description: 'Light reconnaissance elements gathering enemy intelligence.',
    subDescription:
      'Scout Units are the commander\'s eyes, pushing far ahead of friendly lines to locate enemy formations, assess terrain, and identify defensive positions. Their intelligence enables informed tactical and operational decisions.',
    primarySubType: 'recon',
    defaultRank: 'corporal',
    classTierRange: { min: 3, max: 45 },
    subClassTierRange: { min: 2, max: 40 },
    subjects: ['intelligence', 'stealth', 'tactics'],
    loreText: 'We see everything. We report everything. We are never seen.',
  },
  {
    id: 'signal_corps',
    parentCategory: 'intelligence_recon',
    name: 'Signal Corps',
    description: 'Communications and signals intelligence specialists.',
    subDescription:
      'Signal Corps units ensure battlefield communications while simultaneously intercepting and exploiting enemy communications. Their work provides actionable intelligence and ensures that friendly command-and-control remains intact under jamming.',
    primarySubType: 'electronic',
    defaultRank: 'sergeant',
    classTierRange: { min: 10, max: 55 },
    subClassTierRange: { min: 8, max: 50 },
    subjects: ['electronics', 'intelligence', 'tactics'],
    loreText: 'Every transmission is a window. We look through all of them.',
  },
  // --- electronic_warfare (1) ---
  {
    id: 'ew_squadron',
    parentCategory: 'electronic_warfare',
    name: 'EW Squadron',
    description: 'Electronic warfare units dominating the electromagnetic spectrum.',
    subDescription:
      'EW Squadrons deny the enemy use of the electromagnetic spectrum — their primary medium for communications, navigation, and weapons guidance — while protecting friendly use. In a technology-dependent military, EW superiority can decide campaigns.',
    primarySubType: 'electronic',
    defaultRank: 'warrant_officer',
    classTierRange: { min: 15, max: 70 },
    subClassTierRange: { min: 12, max: 65 },
    subjects: ['electronics', 'cyber', 'intelligence'],
    loreText: 'The enemy is blind. The enemy is deaf. The enemy has already lost.',
  },
  // --- space_combat (1) ---
  {
    id: 'orbital_strike',
    parentCategory: 'space_combat',
    name: 'Orbital Strike Unit',
    description: 'Space-based precision and area strike capabilities against surface targets.',
    subDescription:
      'Orbital Strike Units operate kinetic and directed-energy weapons from orbital platforms, delivering unmatched strategic firepower against surface targets anywhere on the planet. They require no air superiority and face minimal defensive counter-options.',
    primarySubType: 'orbital_drop',
    defaultRank: 'colonel',
    classTierRange: { min: 35, max: 95 },
    subClassTierRange: { min: 30, max: 90 },
    subjects: ['space_combat', 'ballistics', 'electronics'],
    loreText: 'Heaven itself becomes a weapon in our hands.',
  },
  // --- cyber_drone (1) ---
  {
    id: 'drone_swarm',
    parentCategory: 'cyber_drone',
    name: 'Drone Swarm',
    description: 'Autonomous drone formations overwhelming enemy defenses through mass.',
    subDescription:
      'Drone Swarms deploy hundreds of individually expendable but collectively devastating autonomous units against enemy forces. They can conduct reconnaissance, strike, and suppression missions simultaneously without risking a single human operator.',
    primarySubType: 'drone',
    defaultRank: 'warrant_officer',
    classTierRange: { min: 20, max: 75 },
    subClassTierRange: { min: 18, max: 70 },
    subjects: ['drone_operation', 'cyber', 'electronics'],
    loreText: 'You cannot shoot them all. We have more.',
  },
  // --- chemical_defense (1) ---
  {
    id: 'hazmat_unit',
    parentCategory: 'chemical_defense',
    name: 'Hazmat Unit',
    description: 'CBRN specialists decontaminating and protecting forces from NBC threats.',
    subDescription:
      'Hazmat Units equip and train forces to operate in chemical, biological, radiological, and nuclear environments. They conduct reconnaissance of contaminated areas, treat affected personnel, and clear zones for follow-on forces.',
    primarySubType: 'garrison',
    defaultRank: 'sergeant',
    classTierRange: { min: 10, max: 55 },
    subClassTierRange: { min: 8, max: 50 },
    subjects: ['chemical_defense', 'medical', 'engineering'],
    loreText: 'The hazard does not choose its victims. We ensure it finds none of ours.',
  },
  // --- psionic_forces (1) ---
  {
    id: 'psionic_operative',
    parentCategory: 'psionic_forces',
    name: 'Psionic Operative',
    description: 'Rare psychic operatives leveraging mental abilities for combat and intelligence.',
    subDescription:
      'Psionic Operatives possess documented psychic abilities ranging from enhanced tactical intuition to direct mental assault. Their capabilities make them extraordinarily effective in the right circumstances, though their rarity limits strategic availability.',
    primarySubType: 'elite',
    defaultRank: 'warrant_officer',
    classTierRange: { min: 30, max: 99 },
    subClassTierRange: { min: 25, max: 99 },
    subjects: ['psionics', 'intelligence', 'stealth'],
    loreText: 'They know what you will do before you decide to do it.',
  },
  // --- mercenary_contractors (1) ---
  {
    id: 'hired_guns',
    parentCategory: 'mercenary_contractors',
    name: 'Hired Guns',
    description: 'Professional mercenary fighters available for contract operations.',
    subDescription:
      'Hired Guns bring combat-proven expertise to operations without the overhead of regular military structures. They operate under contract terms and deliver results within their professional capabilities, with loyalty tied directly to continued payment.',
    primarySubType: 'mercenary',
    defaultRank: 'sergeant',
    classTierRange: { min: 10, max: 70 },
    subClassTierRange: { min: 8, max: 65 },
    subjects: ['mercenary_skills', 'ballistics', 'tactics'],
    loreText: 'Nothing personal. Strictly business.',
  },
  // --- command_hq (1) ---
  {
    id: 'field_hq',
    parentCategory: 'command_hq',
    name: 'Field HQ',
    description: 'Mobile command post coordinating multi-unit operations in the field.',
    subDescription:
      'The Field HQ is the brain of the combined arms team, processing intelligence, issuing orders, coordinating logistics, and maintaining situational awareness across the entire operational area. Its destruction can paralyze an entire military force.',
    primarySubType: 'command',
    defaultRank: 'colonel',
    classTierRange: { min: 20, max: 90 },
    subClassTierRange: { min: 18, max: 85 },
    subjects: ['command', 'logistics', 'intelligence', 'electronics'],
    loreText: 'The commander who knows everything wins. We make sure our commander knows everything.',
  },
];

// ============================================================================
// REPRESENTATIVE UNIT ENTRIES (one per sub-category, demonstrating full schema)
// ============================================================================

/**
 * Light Infantry – representative unit (tier 1, level 1)
 */
const UNIT_LIGHT_INFANTRY_T1: ArmyUnitDefinition = {
  id: 'unit-light-infantry-t1-lvl1',
  name: 'Light Infantry Skirmisher',
  category: 'infantry_corps',
  subCategory: 'light_infantry',
  unitClass: { name: 'Standard Class', tier: 1, rank: 'standard', description: 'Entry-level combat classification.' },
  unitSubClass: { name: 'Line Skirmisher', tier: 1, parentClass: 'Standard Class', specialization: 'Skirmish & Screen', description: 'Optimized for screening and harassing enemy formations.' },
  unitType: 'soldier',
  unitSubType: 'light',
  rank: 'private',
  minimumLevel: 1,
  maximumLevel: 999,
  stats: { attack: 4, defense: 3, health: 15, speed: 10, accuracy: 70, dodge: 12 },
  subStats: baseSubStats({ ambushBonus: 10, sightRange: 5, terrainAdaptation: 10 }),
  attributes: baseAttributes({ agility: 35, endurance: 25 }),
  subAttributes: baseSubAttributes({ agility: { movementSpeed: 14, evasionRating: 12, reactionTime: 10, stealthCapability: 8 } }),
  descriptions: {
    description: 'Fast-moving light infantry optimized for reconnaissance and skirmishing.',
    subDescription: 'The Light Infantry Skirmisher operates ahead of main formations, identifying threats, harassing enemy flanks, and withdrawing before decisive engagement. Their speed and terrain adaptability make them irreplaceable in complex environments.',
    flavorText: 'Fast, quiet, deadly — and gone before you knew they were there.',
    loreText: 'The first skirmishers were hunters who learned that the same skills that caught prey could destroy armies.',
  },
  subjects: [
    { subject: 'tactics', proficiencyLevel: 30, specializations: ['skirmish tactics', 'withdrawal maneuvers'], description: 'Basic tactical training for light infantry operations.', subDescription: 'Trained in individual and small-unit tactics including bounding overwatch, ambush, and counter-ambush drills.' },
    { subject: 'ballistics', proficiencyLevel: 25, specializations: ['small arms', 'light support weapons'], description: 'Proficiency with standard infantry weapons.', subDescription: 'Qualified on service rifle, light machine gun, and grenade launcher to effective combat ranges.' },
    { subject: 'stealth', proficiencyLevel: 20, specializations: ['camouflage', 'noise discipline'], description: 'Basic stealth and concealment skills.', subDescription: 'Trained in individual camouflage, movement without sound, and use of natural cover and concealment.' },
  ],
  specialAbilities: [{ name: 'Swift Advance', effect: 'Move twice in one turn without penalty', cooldown: 3 }],
  cost: { credits: 40, materials: 20, time: 1 },
  tier: 1,
  rarity: 'common',
  crew: 6,
  minCrewRequired: 4,
  moraleMultiplier: 0.95,
  prerequisiteTechs: [],
};

/**
 * Power Armor Unit – representative unit (tier 3, level 30)
 */
const UNIT_POWER_ARMOR_T3: ArmyUnitDefinition = {
  id: 'unit-power-armor-t3-lvl30',
  name: 'Aegis Power Armor Squad',
  category: 'heavy_infantry',
  subCategory: 'power_armor_unit',
  unitClass: { name: 'Advanced Class', tier: 15, rank: 'advanced', description: 'Enhanced combat classification for augmented forces.' },
  unitSubClass: { name: 'Assault-Pattern Exosuit', tier: 12, parentClass: 'Advanced Class', specialization: 'Breaching & Assault', description: 'Configured for forcing entries and clearing fortified positions.' },
  unitType: 'soldier',
  unitSubType: 'heavy',
  rank: 'sergeant',
  minimumLevel: 30,
  maximumLevel: 999,
  stats: { attack: 14, defense: 18, health: 60, speed: 6, accuracy: 75, dodge: 8 },
  subStats: baseSubStats({ armorPenetration: 15, shieldBreakPower: 10, fortificationBonus: 20, suppressionResistance: 25 }),
  attributes: baseAttributes({ strength: 60, endurance: 55, resilience: 50 }),
  subAttributes: baseSubAttributes({ strength: { physicalPower: 55, loadCapacity: 70, meleeDamage: 40, heavyWeaponProficiency: 60 } }),
  descriptions: {
    description: 'Servo-assisted power armor infantry capable of sustained heavy assault.',
    subDescription: 'The Aegis Power Armor Squad leverages advanced exoskeletal technology to carry weapons and withstand punishment far beyond the capability of unaugmented infantry. Each suit houses full life-support, enhanced targeting, and reactive armor systems.',
    flavorText: 'In the armor, you are not a soldier. You are a weapon.',
    loreText: 'The first power armor prototypes were designed for industrial use. The military variant took everything that made them useful and turned it toward destruction.',
  },
  subjects: [
    { subject: 'ballistics', proficiencyLevel: 60, specializations: ['heavy weapons', 'breaching charges'], description: 'Heavy weapons qualification and demolition proficiency.', subDescription: 'Qualified on man-portable heavy weapons including plasma cannons, heavy railguns, and breaching systems impossible to operate without powered assistance.' },
    { subject: 'tactics', proficiencyLevel: 55, specializations: ['assault tactics', 'fire team movement'], description: 'Advanced assault tactics for power-armored forces.', subDescription: 'Trained in assault-by-fire, deliberate attack, and mechanized infantry tactics adapted for power-armored operators.' },
    { subject: 'engineering', proficiencyLevel: 40, specializations: ['structural analysis', 'breaching'], description: 'Basic engineering skills for breaching operations.', subDescription: 'Trained to identify and exploit structural weaknesses in enemy fortifications using mechanical force, demolition, and thermal cutting tools.' },
  ],
  specialAbilities: [
    { name: 'Iron Wall', effect: 'Reduce incoming damage by 40% for 2 turns', cooldown: 4 },
    { name: 'Power Strike', effect: 'Deal 250% melee damage to a single target', cooldown: 2 },
  ],
  cost: { credits: 350, materials: 280, time: 6 },
  tier: 3,
  rarity: 'rare',
  crew: 4,
  minCrewRequired: 3,
  moraleMultiplier: 1.2,
  formationBonus: 25,
  prerequisiteTechs: ['armor-power-suit-1'],
};

/**
 * Command Mech – representative unit (tier 4, level 50)
 */
const UNIT_COMMAND_MECH_T4: ArmyUnitDefinition = {
  id: 'unit-command-mech-t4-lvl50',
  name: 'Sovereign Command Mech',
  category: 'mech_exoskeleton',
  subCategory: 'command_mech',
  unitClass: { name: 'Legendary Class', tier: 85, rank: 'legendary', description: 'Pinnacle combat classification reserved for the most powerful units.' },
  unitSubClass: { name: 'Strategic Command Frame', tier: 80, parentClass: 'Legendary Class', specialization: 'Command & Battlefield Dominance', description: 'The ultimate expression of combined personal combat power and strategic command authority.' },
  unitType: 'mech',
  unitSubType: 'command',
  rank: 'colonel',
  title: 'warlord',
  minimumLevel: 50,
  maximumLevel: 999,
  stats: { attack: 20, defense: 18, health: 90, speed: 10, accuracy: 92, dodge: 15 },
  subStats: baseSubStats({ criticalHitChance: 20, criticalDamageMultiplier: 2.5, leadershipBonus: 40, communicationsRange: 20, sightRange: 15, electronicResistance: 30, psionicResistance: 30 }),
  attributes: baseAttributes({ strength: 80, intelligence: 85, leadership: 90, precision: 88 }),
  subAttributes: baseSubAttributes({
    leadership: { squadMorale: 40, commandRadius: 20, inspirationBonus: 35, orderEfficiency: 45 },
    intelligence: { tacticalAwareness: 80, techProficiency: 75, targetPriority: 85, countermeasures: 70 },
  }),
  descriptions: {
    description: 'Elite command mech combining overwhelming combat power with battlefield-wide command authority.',
    subDescription: 'The Sovereign Command Mech is the rarest and most feared unit type in existence: a walking command center that can simultaneously direct entire armies and single-handedly destroy division-level threats. Its integrated AI co-pilot enhances the human operator\'s capabilities to superhuman levels.',
    flavorText: 'Where this machine walks, victory follows.',
    loreText: 'The Command Mech was not designed by engineers alone. The final specifications required input from the greatest commanders in military history, each contributing their irreplaceable insight into what a perfect warrior-general would look like.',
  },
  subjects: [
    { subject: 'command', proficiencyLevel: 95, specializations: ['combined arms', 'strategic operations', 'crisis command'], description: 'Supreme command authority over all unit types.', subDescription: 'The pilot is qualified to command forces at corps level and above, with specialized training in coordinating combined-arms operations across all domains simultaneously.' },
    { subject: 'tactics', proficiencyLevel: 90, specializations: ['operational art', 'strategic maneuver', 'exploitation'], description: 'Master-level tactical and operational doctrine.', subDescription: 'Trained to identify and exploit operational opportunities at scales ranging from individual skirmish to multi-theater campaigns, with unmatched ability to read and shape the battlefield.' },
    { subject: 'ballistics', proficiencyLevel: 85, specializations: ['mech-scale weapons', 'precision targeting'], description: 'Qualification on all mech-mounted weapon systems.', subDescription: 'Qualified expert on all weapons installed on command-variant mech frames, including precision long-range systems, anti-mech weaponry, and area-denial munitions.' },
    { subject: 'electronics', proficiencyLevel: 80, specializations: ['command systems', 'EW integration', 'sensor fusion'], description: 'Advanced electronics and command system proficiency.', subDescription: 'Expert in operation and maintenance of the integrated sensor, communications, and electronic warfare suite that makes the Command Mech the most capable command platform available.' },
  ],
  specialAbilities: [
    { name: 'Supreme Command', effect: 'All allied units gain +35% to all stats for 4 turns', cooldown: 5 },
    { name: 'Strategic Strike', effect: 'Deal 600% damage to priority target', cooldown: 3 },
    { name: 'Adaptive Defense Matrix', effect: 'Reduce damage by percentage equal to remaining armor rating', cooldown: 2 },
    { name: 'Total Battlefield Awareness', effect: 'Reveal all enemy positions for 3 turns', cooldown: 4 },
  ],
  cost: { credits: 1500, materials: 1200, time: 30 },
  tier: 4,
  rarity: 'legendary',
  crew: 1,
  minCrewRequired: 1,
  moraleMultiplier: 1.6,
  formationBonus: 70,
  prerequisiteTechs: ['mech-frame-elite-1', 'weapons-mech-systems-elite-1', 'computing-command-ai-5'],
};

/**
 * Psionic Operative – representative unit (tier 4, level 60)
 */
const UNIT_PSIONIC_OPERATIVE_T4: ArmyUnitDefinition = {
  id: 'unit-psionic-operative-t4-lvl60',
  name: 'Null Mind Psionic Operative',
  category: 'psionic_forces',
  subCategory: 'psionic_operative',
  unitClass: { name: 'Elite Class', tier: 50, rank: 'elite', description: 'Elite classification for operatives with verified psionic capabilities.' },
  unitSubClass: { name: 'Combat Psionicist', tier: 45, parentClass: 'Elite Class', specialization: 'Combat Psionics & Intelligence', description: 'Trained to weaponize psionic abilities in direct and indirect combat roles.' },
  unitType: 'psionic',
  unitSubType: 'elite',
  rank: 'warrant_officer',
  title: 'phantom',
  minimumLevel: 60,
  maximumLevel: 999,
  stats: { attack: 16, defense: 10, health: 35, speed: 12, accuracy: 95, dodge: 25 },
  subStats: baseSubStats({ criticalHitChance: 30, moraleDamage: 20, psionicResistance: 80, electronicResistance: 40, ambushBonus: 50, sightRange: 12 }),
  attributes: baseAttributes({ intelligence: 90, precision: 85, agility: 65, resilience: 70 }),
  subAttributes: baseSubAttributes({ intelligence: { tacticalAwareness: 90, techProficiency: 60, targetPriority: 88, countermeasures: 75 } }),
  descriptions: {
    description: 'Psychic warfare specialist capable of mental assault, remote viewing, and battlefield precognition.',
    subDescription: 'The Null Mind Psionic Operative possesses documented and weaponized psychic abilities, including tactical precognition, remote viewing of concealed positions, and direct neural disruption of enemy combatants. Their existence is officially classified.',
    flavorText: 'They know what you will do before you decide to do it.',
    loreText: 'The existence of psionic operatives in military doctrine was denied for centuries. The evidence became impossible to suppress when their intervention decided three successive campaigns.',
  },
  subjects: [
    { subject: 'psionics', proficiencyLevel: 90, specializations: ['combat psionics', 'remote viewing', 'precognition'], description: 'Expert-level psionic ability development and weaponization.', subDescription: 'Trained to consistently and reliably employ psionic capabilities in combat conditions, including under fire, in electromagnetic interference, and against psionic countermeasures.' },
    { subject: 'intelligence', proficiencyLevel: 80, specializations: ['remote sensing', 'psychic interrogation'], description: 'Intelligence collection using psionic capabilities.', subDescription: 'Qualified in psionic intelligence-gathering techniques, including remote viewing of denied areas and psychic assessment of enemy intentions and dispositions.' },
    { subject: 'stealth', proficiencyLevel: 75, specializations: ['mental camouflage', 'psionic concealment'], description: 'Stealth through psionic means.', subDescription: 'Trained in techniques to suppress psionic signature and blend psychic presence into background noise, rendering the operative effectively invisible to both conventional and psionic detection.' },
  ],
  specialAbilities: [
    { name: 'Mind Assault', effect: 'Deal 300% psionic damage, bypassing physical armor', cooldown: 3 },
    { name: 'Precognitive Dodge', effect: 'Automatically dodge next 3 attacks', cooldown: 4 },
    { name: 'Remote View', effect: 'Reveal all enemy units in a large area for 2 turns', cooldown: 5 },
  ],
  cost: { credits: 800, materials: 400, time: 15 },
  tier: 4,
  rarity: 'legendary',
  crew: 1,
  minCrewRequired: 1,
  moraleMultiplier: 1.4,
  formationBonus: 30,
  prerequisiteTechs: ['psionics-research-1', 'psionics-combat-weaponization-1'],
};

// ============================================================================
// EXPORT: ALL REPRESENTATIVE ARMY UNITS
// ============================================================================

/**
 * Representative units — one for each sub-category — demonstrating the full
 * classification schema.  Additional units for each sub-category can be added
 * following the same pattern.
 */
export const ARMY_UNIT_CATALOG: ArmyUnitDefinition[] = [
  UNIT_LIGHT_INFANTRY_T1,
  UNIT_POWER_ARMOR_T3,
  UNIT_COMMAND_MECH_T4,
  UNIT_PSIONIC_OPERATIVE_T4,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all 18 category metadata entries.
 */
export function getAllCategories(): UnitCategoryMeta[] {
  return UNIT_CATEGORY_META;
}

/**
 * Get all 32 sub-category metadata entries.
 */
export function getAllSubCategories(): UnitSubCategoryMeta[] {
  return UNIT_SUB_CATEGORY_META;
}

/**
 * Get sub-categories belonging to a given category.
 */
export function getSubCategoriesForCategory(
  category: UnitCategory
): UnitSubCategoryMeta[] {
  return UNIT_SUB_CATEGORY_META.filter((sc) => sc.parentCategory === category);
}

/**
 * Get a category by its ID.
 */
export function getCategoryById(id: UnitCategory): UnitCategoryMeta | undefined {
  return UNIT_CATEGORY_META.find((c) => c.id === id);
}

/**
 * Get a sub-category by its ID.
 */
export function getSubCategoryById(id: UnitSubCategory): UnitSubCategoryMeta | undefined {
  return UNIT_SUB_CATEGORY_META.find((sc) => sc.id === id);
}

/**
 * Get units from the catalog filtered by category.
 */
export function getUnitsByCategory(category: UnitCategory): ArmyUnitDefinition[] {
  return ARMY_UNIT_CATALOG.filter((u) => u.category === category);
}

/**
 * Get units from the catalog filtered by sub-category.
 */
export function getUnitsBySubCategory(subCategory: UnitSubCategory): ArmyUnitDefinition[] {
  return ARMY_UNIT_CATALOG.filter((u) => u.subCategory === subCategory);
}

/**
 * Get units available to a player at a given level (1–999).
 */
export function getUnitsAvailableAtLevel(playerLevel: number): ArmyUnitDefinition[] {
  return ARMY_UNIT_CATALOG.filter((u) => u.minimumLevel <= playerLevel);
}

/**
 * Validate that a class tier is within the allowed range (1–99).
 */
export function isValidClassTier(tier: number): boolean {
  return Number.isInteger(tier) && tier >= 1 && tier <= 99;
}

/**
 * Validate that a level is within the allowed range (1–999).
 */
export function isValidUnitLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= 999;
}
