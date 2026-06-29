/**
 * Weapons & Defense Systems Configuration
 *
 * Covers offensive and defensive armaments for:
 *  - Planets (planetary surface / orbital platforms)
 *  - Starships (all hull classes)
 *  - Motherships (command / capital super-ships)
 *
 * Battle report taxonomy (mirrors OGame-style classification):
 *  - Report Type    : the mission class that triggered the battle
 *  - Report SubType : a more specific breakdown within that mission class
 *  - Report Class   : the strategic significance of the engagement
 *  - Report SubClass: granular combat context / theatre
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type DamageType =
  | "kinetic"       // railguns, mass drivers, projectiles
  | "energy"        // lasers, plasma, beam weapons
  | "explosive"     // missiles, torpedoes, bombs
  | "ionic"         // ion cannons (drains shields)
  | "graviton"      // graviton weapons (hull cracking)
  | "nanite"        // nanite swarm (self-replicating damage)
  | "emp"           // disables electronics / engines
  | "psionic";      // rare alien weapons

export type WeaponMount =
  | "turret"        // 360-degree coverage
  | "broadside"     // fixed arc, high DPS
  | "spinal"        // ship-spine mounted, extreme single-target
  | "missile_bay"   // fires guided munitions
  | "drone_bay"     // launches combat drones
  | "point_defense";// intercepts incoming missiles/drones

export type ShieldType =
  | "energy_shield"     // classic energy barrier
  | "deflector_shield"  // partial directional shielding
  | "phase_shield"      // absorbs specific damage types
  | "ionic_shield"      // extra resistance vs ionic
  | "reflective_hull"   // partial energy reflection
  | "composite_armor"   // physical durability layer
  | "reactive_armor";   // expends to absorb hits

// ---------------------------------------------------------------------------
// Weapon system definition
// ---------------------------------------------------------------------------

export interface WeaponSystem {
  id: string;
  name: string;
  description: string;

  /** Damage type delivered */
  damageType: DamageType;

  /** Physical mounting style */
  mount: WeaponMount;

  /** Base damage per shot */
  baseDamage: number;

  /** Shots per combat round */
  rateOfFire: number;

  /** 0–100; how likely each shot connects */
  accuracy: number;

  /** Effective range category */
  range: "close" | "medium" | "long" | "extreme";

  /** Shield penetration fraction (0–1) */
  shieldPenetration: number;

  /** Armor penetration fraction (0–1) */
  armorPenetration: number;

  /** Percentage chance of a critical strike per round */
  critChance: number;

  /** Damage multiplier on critical hit */
  critMultiplier: number;

  /** Resource cost to build / equip */
  buildCost: { metal: number; crystal: number; deuterium: number };

  /** Technology research prerequisites */
  prerequisites: Record<string, number>;

  /** Which platforms can mount this weapon */
  compatibleWith: Array<"planet" | "starship" | "mothership">;
}

// ---------------------------------------------------------------------------
// Defense system definition
// ---------------------------------------------------------------------------

export interface DefenseSystem {
  id: string;
  name: string;
  description: string;

  shieldType: ShieldType;

  /** Total shield / armor points */
  hitPoints: number;

  /** Shield recharge per combat round (0 if armor) */
  rechargeRate: number;

  /** Damage reduction fraction (0–1) */
  damageReduction: number;

  /** Which damage types receive extra resistance */
  resistances: Partial<Record<DamageType, number>>;

  /** Which damage types are extra-vulnerable to */
  vulnerabilities: Partial<Record<DamageType, number>>;

  /** Resource cost */
  buildCost: { metal: number; crystal: number; deuterium: number };

  prerequisites: Record<string, number>;

  compatibleWith: Array<"planet" | "starship" | "mothership">;
}

// ---------------------------------------------------------------------------
// Ship class weapon / defense loadout
// ---------------------------------------------------------------------------

export interface ShipCombatProfile {
  /** Ship hull archetype key (matches entityArchetypesConfig) */
  shipType: string;

  /** Human-readable class name */
  className: string;

  /** Hull class category */
  hullClass: "fighter" | "escort" | "capital" | "support" | "recon" | "mothership";

  /** Sub-class for detailed taxonomy */
  subClass: string;

  /** Structural hit-points */
  hullPoints: number;

  /** Default shield HP (boosted by shieldingTech research) */
  shieldPoints: number;

  /** Physical armor points (boosted by armourTech) */
  armorPoints: number;

  /** IDs of weapons this ship mounts by default */
  primaryWeapons: string[];

  /** IDs of secondary / point-defense weapons */
  secondaryWeapons: string[];

  /** IDs of defensive systems fitted */
  defenseSystems: string[];

  /** How many weapon slots are upgradeable */
  upgradeSlots: number;
}

// ---------------------------------------------------------------------------
// Planet defense profile
// ---------------------------------------------------------------------------

export interface PlanetDefenseProfile {
  /** Platform type key */
  platformType: string;

  name: string;
  description: string;

  /** Category: static gun, missile platform, shield projector, mine field */
  category: "gun_platform" | "missile_platform" | "shield_projector" | "orbital_defense" | "mine_field";

  /** Sub-category for report classification */
  subCategory: string;

  /** IDs of weapons mounted on this platform */
  weapons: string[];

  /** IDs of defensive systems on this platform */
  defenseSystems: string[];

  /** HP of the platform */
  hitPoints: number;

  buildCost: { metal: number; crystal: number; deuterium: number };

  prerequisites: Record<string, number>;
}

// ===========================================================================
// WEAPON SYSTEMS CATALOG
// ===========================================================================

export const WEAPON_SYSTEMS: WeaponSystem[] = [

  // -------------------------------------------------------------------------
  // Kinetic weapons
  // -------------------------------------------------------------------------
  {
    id: "lightCannon",
    name: "Light Cannon",
    description: "Standard shipboard autocannon. Fast fire-rate, moderate damage.",
    damageType: "kinetic",
    mount: "turret",
    baseDamage: 30,
    rateOfFire: 3,
    accuracy: 85,
    range: "close",
    shieldPenetration: 0.05,
    armorPenetration: 0.15,
    critChance: 5,
    critMultiplier: 1.5,
    buildCost: { metal: 200, crystal: 50, deuterium: 0 },
    prerequisites: {},
    compatibleWith: ["starship", "planet"],
  },
  {
    id: "railgun",
    name: "Railgun",
    description: "Electromagnetic mass-driver. Punches through armor with ease.",
    damageType: "kinetic",
    mount: "spinal",
    baseDamage: 120,
    rateOfFire: 1,
    accuracy: 78,
    range: "long",
    shieldPenetration: 0.1,
    armorPenetration: 0.45,
    critChance: 8,
    critMultiplier: 2.0,
    buildCost: { metal: 800, crystal: 300, deuterium: 100 },
    prerequisites: { armourTech: 3, weaponsTech: 2 },
    compatibleWith: ["starship", "mothership"],
  },
  {
    id: "massDriver",
    name: "Mass Driver Battery",
    description: "Planetary orbital mass-driver. Devastating anti-fleet bombardment.",
    damageType: "kinetic",
    mount: "spinal",
    baseDamage: 200,
    rateOfFire: 1,
    accuracy: 70,
    range: "extreme",
    shieldPenetration: 0.15,
    armorPenetration: 0.5,
    critChance: 6,
    critMultiplier: 2.5,
    buildCost: { metal: 2000, crystal: 800, deuterium: 400 },
    prerequisites: { weaponsTech: 5, armourTech: 4 },
    compatibleWith: ["planet"],
  },
  {
    id: "gaussCannon",
    name: "Gauss Cannon",
    description: "Powerful kinetic turret. High accuracy, moderate penetration.",
    damageType: "kinetic",
    mount: "turret",
    baseDamage: 80,
    rateOfFire: 2,
    accuracy: 88,
    range: "medium",
    shieldPenetration: 0.08,
    armorPenetration: 0.3,
    critChance: 6,
    critMultiplier: 1.8,
    buildCost: { metal: 900, crystal: 450, deuterium: 180 },
    prerequisites: { weaponsTech: 3 },
    compatibleWith: ["starship", "planet", "mothership"],
  },

  // -------------------------------------------------------------------------
  // Energy weapons
  // -------------------------------------------------------------------------
  {
    id: "laserTurret",
    name: "Laser Turret",
    description: "Basic directed-energy weapon. Fast targeting, efficient vs shields.",
    damageType: "energy",
    mount: "turret",
    baseDamage: 45,
    rateOfFire: 4,
    accuracy: 92,
    range: "medium",
    shieldPenetration: 0.0,
    armorPenetration: 0.05,
    critChance: 4,
    critMultiplier: 1.4,
    buildCost: { metal: 500, crystal: 280, deuterium: 90 },
    prerequisites: { laserTech: 1 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "heavyLaser",
    name: "Heavy Laser",
    description: "Up-rated laser array. Cuts through shields and light armor.",
    damageType: "energy",
    mount: "broadside",
    baseDamage: 90,
    rateOfFire: 2,
    accuracy: 88,
    range: "medium",
    shieldPenetration: 0.12,
    armorPenetration: 0.08,
    critChance: 6,
    critMultiplier: 1.6,
    buildCost: { metal: 700, crystal: 500, deuterium: 120 },
    prerequisites: { laserTech: 3 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "plasmaCannon",
    name: "Plasma Cannon",
    description: "Fires superheated plasma bolts that melt armor on contact.",
    damageType: "energy",
    mount: "turret",
    baseDamage: 150,
    rateOfFire: 1,
    accuracy: 80,
    range: "medium",
    shieldPenetration: 0.2,
    armorPenetration: 0.6,
    critChance: 10,
    critMultiplier: 2.2,
    buildCost: { metal: 1200, crystal: 700, deuterium: 300 },
    prerequisites: { plasmaTech: 5, weaponsTech: 4 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "particleBeam",
    name: "Particle Beam",
    description: "Directed particle stream. Excellent vs large capital hulls.",
    damageType: "energy",
    mount: "spinal",
    baseDamage: 250,
    rateOfFire: 1,
    accuracy: 75,
    range: "extreme",
    shieldPenetration: 0.25,
    armorPenetration: 0.4,
    critChance: 8,
    critMultiplier: 2.0,
    buildCost: { metal: 2500, crystal: 1200, deuterium: 600 },
    prerequisites: { energyTech: 8, weaponsTech: 6 },
    compatibleWith: ["mothership"],
  },
  {
    id: "phasedPulseLaser",
    name: "Phased Pulse Laser",
    description: "Alternates phase frequencies to defeat shield harmonics.",
    damageType: "energy",
    mount: "turret",
    baseDamage: 65,
    rateOfFire: 3,
    accuracy: 90,
    range: "medium",
    shieldPenetration: 0.35,
    armorPenetration: 0.05,
    critChance: 5,
    critMultiplier: 1.5,
    buildCost: { metal: 800, crystal: 600, deuterium: 200 },
    prerequisites: { laserTech: 6, shieldingTech: 3 },
    compatibleWith: ["starship", "mothership"],
  },

  // -------------------------------------------------------------------------
  // Explosive / missile weapons
  // -------------------------------------------------------------------------
  {
    id: "missileLauncher",
    name: "Missile Launcher",
    description: "Fires heat-seeking missiles. Low cost, decent burst damage.",
    damageType: "explosive",
    mount: "missile_bay",
    baseDamage: 60,
    rateOfFire: 2,
    accuracy: 75,
    range: "long",
    shieldPenetration: 0.1,
    armorPenetration: 0.2,
    critChance: 3,
    critMultiplier: 1.6,
    buildCost: { metal: 350, crystal: 120, deuterium: 40 },
    prerequisites: {},
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "torpedobank",
    name: "Torpedo Bank",
    description: "Heavy ship-killer torpedoes. Slow but devastating.",
    damageType: "explosive",
    mount: "missile_bay",
    baseDamage: 220,
    rateOfFire: 1,
    accuracy: 65,
    range: "long",
    shieldPenetration: 0.3,
    armorPenetration: 0.35,
    critChance: 7,
    critMultiplier: 2.0,
    buildCost: { metal: 1500, crystal: 600, deuterium: 350 },
    prerequisites: { weaponsTech: 4, impulseDrive: 3 },
    compatibleWith: ["starship", "mothership"],
  },
  {
    id: "interplanetaryMissile",
    name: "Interplanetary Missile",
    description: "Long-range ballistic missile platform for strategic bombardment.",
    damageType: "explosive",
    mount: "missile_bay",
    baseDamage: 400,
    rateOfFire: 1,
    accuracy: 60,
    range: "extreme",
    shieldPenetration: 0.25,
    armorPenetration: 0.4,
    critChance: 5,
    critMultiplier: 2.5,
    buildCost: { metal: 3000, crystal: 1000, deuterium: 800 },
    prerequisites: { weaponsTech: 7, impulseDrive: 5 },
    compatibleWith: ["planet"],
  },
  {
    id: "nuclearWarhead",
    name: "Nuclear Warhead",
    description: "Tactical nuclear device. Area-of-effect damage, irradiates sector.",
    damageType: "explosive",
    mount: "missile_bay",
    baseDamage: 800,
    rateOfFire: 1,
    accuracy: 55,
    range: "extreme",
    shieldPenetration: 0.5,
    armorPenetration: 0.6,
    critChance: 10,
    critMultiplier: 3.0,
    buildCost: { metal: 8000, crystal: 4000, deuterium: 2000 },
    prerequisites: { weaponsTech: 10, energyTech: 8 },
    compatibleWith: ["mothership"],
  },

  // -------------------------------------------------------------------------
  // Ionic weapons
  // -------------------------------------------------------------------------
  {
    id: "ionCannon",
    name: "Ion Cannon",
    description: "Discharges ionic pulse — devastating vs shields, minimal hull damage.",
    damageType: "ionic",
    mount: "turret",
    baseDamage: 50,
    rateOfFire: 2,
    accuracy: 88,
    range: "medium",
    shieldPenetration: 0.6,
    armorPenetration: 0.02,
    critChance: 5,
    critMultiplier: 1.5,
    buildCost: { metal: 600, crystal: 400, deuterium: 150 },
    prerequisites: { ionTech: 2 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "ionDisruptor",
    name: "Ion Disruptor Array",
    description: "Broadside ion emitters that strip entire fleet shields.",
    damageType: "ionic",
    mount: "broadside",
    baseDamage: 120,
    rateOfFire: 1,
    accuracy: 82,
    range: "long",
    shieldPenetration: 0.8,
    armorPenetration: 0.0,
    critChance: 6,
    critMultiplier: 1.8,
    buildCost: { metal: 2000, crystal: 1200, deuterium: 500 },
    prerequisites: { ionTech: 5, shieldingTech: 3 },
    compatibleWith: ["mothership"],
  },

  // -------------------------------------------------------------------------
  // Graviton weapons
  // -------------------------------------------------------------------------
  {
    id: "gravitonBattery",
    name: "Graviton Battery",
    description: "Warps local spacetime to crush enemy hulls. Ignores shields entirely.",
    damageType: "graviton",
    mount: "spinal",
    baseDamage: 500,
    rateOfFire: 1,
    accuracy: 60,
    range: "medium",
    shieldPenetration: 1.0,
    armorPenetration: 0.5,
    critChance: 5,
    critMultiplier: 2.5,
    buildCost: { metal: 10000, crystal: 6000, deuterium: 3000 },
    prerequisites: { gravitonTech: 1, hyperspaceTech: 6 },
    compatibleWith: ["mothership"],
  },

  // -------------------------------------------------------------------------
  // EMP weapons
  // -------------------------------------------------------------------------
  {
    id: "empBurst",
    name: "EMP Burst Emitter",
    description: "Disables enemy ship systems for one combat round.",
    damageType: "emp",
    mount: "turret",
    baseDamage: 20,
    rateOfFire: 1,
    accuracy: 80,
    range: "close",
    shieldPenetration: 0.0,
    armorPenetration: 0.0,
    critChance: 100, // always has stun effect chance
    critMultiplier: 1.0,
    buildCost: { metal: 400, crystal: 350, deuterium: 80 },
    prerequisites: { ionTech: 3 },
    compatibleWith: ["starship", "mothership"],
  },

  // -------------------------------------------------------------------------
  // Point-defense
  // -------------------------------------------------------------------------
  {
    id: "pointDefenseCannon",
    name: "Point Defense Cannon",
    description: "Rapid-fire close-range weapon that intercepts missiles and drones.",
    damageType: "kinetic",
    mount: "point_defense",
    baseDamage: 15,
    rateOfFire: 8,
    accuracy: 95,
    range: "close",
    shieldPenetration: 0.0,
    armorPenetration: 0.05,
    critChance: 2,
    critMultiplier: 1.2,
    buildCost: { metal: 300, crystal: 100, deuterium: 20 },
    prerequisites: {},
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "flakBattery",
    name: "Flak Battery",
    description: "Explosive anti-missile cluster bursts. Excellent area intercept.",
    damageType: "explosive",
    mount: "point_defense",
    baseDamage: 25,
    rateOfFire: 6,
    accuracy: 88,
    range: "close",
    shieldPenetration: 0.0,
    armorPenetration: 0.0,
    critChance: 3,
    critMultiplier: 1.3,
    buildCost: { metal: 500, crystal: 200, deuterium: 50 },
    prerequisites: { weaponsTech: 2 },
    compatibleWith: ["starship", "planet", "mothership"],
  },

  // -------------------------------------------------------------------------
  // Drone weapons
  // -------------------------------------------------------------------------
  {
    id: "combatDroneBay",
    name: "Combat Drone Bay",
    description: "Deploys autonomous attack drones that swarm enemy ships.",
    damageType: "kinetic",
    mount: "drone_bay",
    baseDamage: 35,
    rateOfFire: 5,
    accuracy: 78,
    range: "medium",
    shieldPenetration: 0.08,
    armorPenetration: 0.12,
    critChance: 4,
    critMultiplier: 1.5,
    buildCost: { metal: 1000, crystal: 500, deuterium: 200 },
    prerequisites: { roboticsTech: 4, weaponsTech: 3 },
    compatibleWith: ["starship", "mothership"],
  },

  // -------------------------------------------------------------------------
  // Nanite weapons
  // -------------------------------------------------------------------------
  {
    id: "naniteSwarmLauncher",
    name: "Nanite Swarm Launcher",
    description: "Releases self-replicating nanite clouds that consume hull material.",
    damageType: "nanite",
    mount: "missile_bay",
    baseDamage: 180,
    rateOfFire: 1,
    accuracy: 72,
    range: "medium",
    shieldPenetration: 0.05,
    armorPenetration: 0.7,
    critChance: 8,
    critMultiplier: 2.0,
    buildCost: { metal: 3000, crystal: 2500, deuterium: 800 },
    prerequisites: { roboticsTech: 8, weaponsTech: 7 },
    compatibleWith: ["mothership"],
  },

  // -------------------------------------------------------------------------
  // Psionic weapons (rare alien-derived technology)
  // -------------------------------------------------------------------------
  {
    id: "psionicDisruptor",
    name: "Psionic Disruptor",
    description: "Alien-derived weapon that disrupts crew cognition and ship systems simultaneously.",
    damageType: "psionic",
    mount: "spinal",
    baseDamage: 300,
    rateOfFire: 1,
    accuracy: 65,
    range: "long",
    shieldPenetration: 0.5,
    armorPenetration: 0.2,
    critChance: 15,
    critMultiplier: 2.5,
    buildCost: { metal: 5000, crystal: 8000, deuterium: 3000 },
    prerequisites: { psionicTech: 1, weaponsTech: 9 },
    compatibleWith: ["mothership"],
  },
];

// ===========================================================================
// DEFENSE SYSTEMS CATALOG
// ===========================================================================

export const DEFENSE_SYSTEMS: DefenseSystem[] = [
  {
    id: "lightShield",
    name: "Light Energy Shield",
    description: "Basic energy barrier for small craft. Rapid recharge.",
    shieldType: "energy_shield",
    hitPoints: 200,
    rechargeRate: 20,
    damageReduction: 0.1,
    resistances: { energy: 0.2 },
    vulnerabilities: { ionic: 0.5 },
    buildCost: { metal: 400, crystal: 300, deuterium: 50 },
    prerequisites: { shieldingTech: 1 },
    compatibleWith: ["starship"],
  },
  {
    id: "mediumShield",
    name: "Medium Energy Shield",
    description: "Standard fleet-class barrier. Balanced protection.",
    shieldType: "energy_shield",
    hitPoints: 500,
    rechargeRate: 15,
    damageReduction: 0.18,
    resistances: { energy: 0.25, explosive: 0.1 },
    vulnerabilities: { ionic: 0.4 },
    buildCost: { metal: 800, crystal: 600, deuterium: 150 },
    prerequisites: { shieldingTech: 3 },
    compatibleWith: ["starship", "mothership"],
  },
  {
    id: "heavyShield",
    name: "Heavy Energy Shield",
    description: "Capital-grade barrier. Absorbs massive punishment.",
    shieldType: "energy_shield",
    hitPoints: 1500,
    rechargeRate: 10,
    damageReduction: 0.28,
    resistances: { energy: 0.3, explosive: 0.2 },
    vulnerabilities: { ionic: 0.35, graviton: 0.3 },
    buildCost: { metal: 2000, crystal: 1500, deuterium: 500 },
    prerequisites: { shieldingTech: 6, hyperspaceTech: 2 },
    compatibleWith: ["mothership"],
  },
  {
    id: "deflectorShield",
    name: "Deflector Shield Array",
    description: "Deflects kinetic impacts. Weak to energy weapons.",
    shieldType: "deflector_shield",
    hitPoints: 600,
    rechargeRate: 8,
    damageReduction: 0.3,
    resistances: { kinetic: 0.4, explosive: 0.3 },
    vulnerabilities: { energy: 0.3 },
    buildCost: { metal: 1000, crystal: 400, deuterium: 100 },
    prerequisites: { shieldingTech: 2, armourTech: 2 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "ionicShield",
    name: "Ionic Counter-Shield",
    description: "Specifically tuned to neutralize ionic weapon discharges.",
    shieldType: "ionic_shield",
    hitPoints: 300,
    rechargeRate: 25,
    damageReduction: 0.15,
    resistances: { ionic: 0.8, emp: 0.6 },
    vulnerabilities: { energy: 0.2, kinetic: 0.1 },
    buildCost: { metal: 700, crystal: 800, deuterium: 200 },
    prerequisites: { ionTech: 3, shieldingTech: 2 },
    compatibleWith: ["starship", "mothership"],
  },
  {
    id: "compositeArmor",
    name: "Composite Armor Plating",
    description: "Layered nano-carbon/tungsten armor. No recharge, very durable.",
    shieldType: "composite_armor",
    hitPoints: 1200,
    rechargeRate: 0,
    damageReduction: 0.35,
    resistances: { kinetic: 0.4, explosive: 0.35 },
    vulnerabilities: { energy: 0.15, ionic: 0.1 },
    buildCost: { metal: 1800, crystal: 400, deuterium: 50 },
    prerequisites: { armourTech: 4 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "reactiveArmor",
    name: "Reactive Armor",
    description: "Explodes outward on impact to dissipate incoming damage.",
    shieldType: "reactive_armor",
    hitPoints: 800,
    rechargeRate: 0,
    damageReduction: 0.4,
    resistances: { explosive: 0.5, kinetic: 0.3 },
    vulnerabilities: { energy: 0.2 },
    buildCost: { metal: 1200, crystal: 200, deuterium: 300 },
    prerequisites: { armourTech: 3, weaponsTech: 2 },
    compatibleWith: ["starship", "mothership"],
  },
  {
    id: "reflectiveHull",
    name: "Reflective Hull Coating",
    description: "Reflects a portion of energy weapon damage back at attacker.",
    shieldType: "reflective_hull",
    hitPoints: 400,
    rechargeRate: 0,
    damageReduction: 0.2,
    resistances: { energy: 0.5 },
    vulnerabilities: { kinetic: 0.15, graviton: 0.2 },
    buildCost: { metal: 600, crystal: 1000, deuterium: 150 },
    prerequisites: { laserTech: 4, armourTech: 2 },
    compatibleWith: ["starship", "planet", "mothership"],
  },
  {
    id: "phaseShield",
    name: "Phase Variance Shield",
    description: "Randomly phase-shifts its frequency, providing variable protection.",
    shieldType: "phase_shield",
    hitPoints: 700,
    rechargeRate: 12,
    damageReduction: 0.25,
    resistances: { energy: 0.3, ionic: 0.3, kinetic: 0.15 },
    vulnerabilities: { graviton: 0.4 },
    buildCost: { metal: 1500, crystal: 1200, deuterium: 400 },
    prerequisites: { shieldingTech: 5, hyperspaceTech: 3 },
    compatibleWith: ["mothership"],
  },
  {
    id: "planetaryShieldGenerator",
    name: "Planetary Shield Generator",
    description: "Massive orbital shield dome protecting the entire planet.",
    shieldType: "energy_shield",
    hitPoints: 5000,
    rechargeRate: 50,
    damageReduction: 0.3,
    resistances: { energy: 0.2, explosive: 0.2, kinetic: 0.15 },
    vulnerabilities: { graviton: 0.5, ionic: 0.2 },
    buildCost: { metal: 5000, crystal: 3000, deuterium: 1000 },
    prerequisites: { shieldingTech: 8 },
    compatibleWith: ["planet"],
  },
];

// ===========================================================================
// SHIP COMBAT PROFILES
// ===========================================================================

export const SHIP_COMBAT_PROFILES: ShipCombatProfile[] = [

  // ---- Fighters ----
  {
    shipType: "lightFighter",
    className: "Light Fighter",
    hullClass: "fighter",
    subClass: "interceptor",
    hullPoints: 100,
    shieldPoints: 20,
    armorPoints: 15,
    primaryWeapons: ["lightCannon"],
    secondaryWeapons: ["pointDefenseCannon"],
    defenseSystems: ["lightShield"],
    upgradeSlots: 1,
  },
  {
    shipType: "heavyFighter",
    className: "Heavy Fighter",
    hullClass: "fighter",
    subClass: "assault_fighter",
    hullPoints: 150,
    shieldPoints: 40,
    armorPoints: 30,
    primaryWeapons: ["heavyLaser", "missileLauncher"],
    secondaryWeapons: ["pointDefenseCannon"],
    defenseSystems: ["lightShield", "compositeArmor"],
    upgradeSlots: 2,
  },

  // ---- Escorts ----
  {
    shipType: "corvette",
    className: "Corvette",
    hullClass: "escort",
    subClass: "patrol_corvette",
    hullPoints: 200,
    shieldPoints: 60,
    armorPoints: 40,
    primaryWeapons: ["laserTurret", "missileLauncher"],
    secondaryWeapons: ["flakBattery"],
    defenseSystems: ["lightShield", "compositeArmor"],
    upgradeSlots: 2,
  },
  {
    shipType: "frigate",
    className: "Frigate",
    hullClass: "escort",
    subClass: "multipurpose_frigate",
    hullPoints: 300,
    shieldPoints: 80,
    armorPoints: 60,
    primaryWeapons: ["heavyLaser", "ionCannon"],
    secondaryWeapons: ["flakBattery", "pointDefenseCannon"],
    defenseSystems: ["mediumShield", "deflectorShield"],
    upgradeSlots: 3,
  },
  {
    shipType: "destroyer",
    className: "Destroyer",
    hullClass: "escort",
    subClass: "fleet_destroyer",
    hullPoints: 300,
    shieldPoints: 50,
    armorPoints: 100,
    primaryWeapons: ["railgun", "missileLauncher"],
    secondaryWeapons: ["pointDefenseCannon"],
    defenseSystems: ["deflectorShield", "compositeArmor"],
    upgradeSlots: 3,
  },

  // ---- Capitals ----
  {
    shipType: "cruiser",
    className: "Cruiser",
    hullClass: "capital",
    subClass: "heavy_cruiser",
    hullPoints: 400,
    shieldPoints: 120,
    armorPoints: 100,
    primaryWeapons: ["plasmaCannon", "ionCannon"],
    secondaryWeapons: ["flakBattery", "pointDefenseCannon"],
    defenseSystems: ["mediumShield", "compositeArmor"],
    upgradeSlots: 4,
  },
  {
    shipType: "battleship",
    className: "Battleship",
    hullClass: "capital",
    subClass: "fleet_battleship",
    hullPoints: 600,
    shieldPoints: 200,
    armorPoints: 200,
    primaryWeapons: ["railgun", "plasmaCannon", "torpedobank"],
    secondaryWeapons: ["flakBattery", "pointDefenseCannon"],
    defenseSystems: ["mediumShield", "deflectorShield", "compositeArmor"],
    upgradeSlots: 5,
  },
  {
    shipType: "dreadnought",
    className: "Dreadnought",
    hullClass: "capital",
    subClass: "line_of_battle",
    hullPoints: 1000,
    shieldPoints: 300,
    armorPoints: 350,
    primaryWeapons: ["railgun", "plasmaCannon", "torpedobank", "phasedPulseLaser"],
    secondaryWeapons: ["flakBattery", "empBurst"],
    defenseSystems: ["heavyShield", "compositeArmor", "reactiveArmor"],
    upgradeSlots: 6,
  },

  // ---- Support ----
  {
    shipType: "smallCargo",
    className: "Small Cargo",
    hullClass: "support",
    subClass: "light_freighter",
    hullPoints: 400,
    shieldPoints: 15,
    armorPoints: 20,
    primaryWeapons: ["lightCannon"],
    secondaryWeapons: [],
    defenseSystems: ["lightShield"],
    upgradeSlots: 1,
  },
  {
    shipType: "largeCargo",
    className: "Large Cargo",
    hullClass: "support",
    subClass: "heavy_freighter",
    hullPoints: 800,
    shieldPoints: 10,
    armorPoints: 30,
    primaryWeapons: ["lightCannon"],
    secondaryWeapons: [],
    defenseSystems: ["lightShield"],
    upgradeSlots: 1,
  },
  {
    shipType: "espionageProbe",
    className: "Espionage Probe",
    hullClass: "recon",
    subClass: "stealth_probe",
    hullPoints: 50,
    shieldPoints: 5,
    armorPoints: 5,
    primaryWeapons: [],
    secondaryWeapons: [],
    defenseSystems: [],
    upgradeSlots: 0,
  },

  // ---- Motherships ----
  {
    shipType: "commandShip",
    className: "Command Ship",
    hullClass: "mothership",
    subClass: "fleet_command",
    hullPoints: 5000,
    shieldPoints: 1000,
    armorPoints: 800,
    primaryWeapons: ["particleBeam", "ionDisruptor", "plasmaCannon"],
    secondaryWeapons: ["flakBattery", "combatDroneBay", "empBurst"],
    defenseSystems: ["heavyShield", "ionicShield", "compositeArmor", "reactiveArmor"],
    upgradeSlots: 8,
  },
  {
    shipType: "mobileFortress",
    className: "Mobile Fortress",
    hullClass: "mothership",
    subClass: "siege_platform",
    hullPoints: 8000,
    shieldPoints: 2000,
    armorPoints: 2000,
    primaryWeapons: ["gravitonBattery", "nuclearWarhead", "particleBeam"],
    secondaryWeapons: ["flakBattery", "combatDroneBay", "pointDefenseCannon"],
    defenseSystems: ["heavyShield", "phaseShield", "compositeArmor", "reflectiveHull"],
    upgradeSlots: 10,
  },
  {
    shipType: "siegeShip",
    className: "Siege Ship",
    hullClass: "mothership",
    subClass: "orbital_bombardment",
    hullPoints: 4000,
    shieldPoints: 800,
    armorPoints: 600,
    primaryWeapons: ["massDriver", "interplanetaryMissile", "torpedobank"],
    secondaryWeapons: ["flakBattery", "pointDefenseCannon"],
    defenseSystems: ["mediumShield", "compositeArmor"],
    upgradeSlots: 6,
  },
];

// ===========================================================================
// PLANET DEFENSE PLATFORMS
// ===========================================================================

export const PLANET_DEFENSE_PLATFORMS: PlanetDefenseProfile[] = [
  {
    platformType: "missileBattery",
    name: "Missile Battery",
    description: "Standard surface-to-space missile silo. Cost-effective first line.",
    category: "missile_platform",
    subCategory: "surface_missile",
    weapons: ["missileLauncher"],
    defenseSystems: [],
    hitPoints: 200,
    buildCost: { metal: 350, crystal: 120, deuterium: 40 },
    prerequisites: {},
  },
  {
    platformType: "laserTurretPlatform",
    name: "Laser Turret Platform",
    description: "Automated laser defense tower. Fast-tracking, good vs fighters.",
    category: "gun_platform",
    subCategory: "energy_gun",
    weapons: ["laserTurret"],
    defenseSystems: ["lightShield"],
    hitPoints: 300,
    buildCost: { metal: 500, crystal: 280, deuterium: 90 },
    prerequisites: { laserTech: 1 },
  },
  {
    platformType: "gaussCannonBattery",
    name: "Gauss Cannon Battery",
    description: "Heavy kinetic emplacement. Punishes large hulls.",
    category: "gun_platform",
    subCategory: "kinetic_gun",
    weapons: ["gaussCannon"],
    defenseSystems: [],
    hitPoints: 500,
    buildCost: { metal: 900, crystal: 450, deuterium: 180 },
    prerequisites: { weaponsTech: 3 },
  },
  {
    platformType: "ionCannonBattery",
    name: "Ion Cannon Battery",
    description: "Orbital ion emitters that strip incoming fleet shields.",
    category: "gun_platform",
    subCategory: "ionic_emitter",
    weapons: ["ionCannon"],
    defenseSystems: ["ionicShield"],
    hitPoints: 400,
    buildCost: { metal: 700, crystal: 600, deuterium: 200 },
    prerequisites: { ionTech: 2, shieldingTech: 2 },
  },
  {
    platformType: "plasmaCannonBattery",
    name: "Plasma Cannon Battery",
    description: "Devastating plasma emplacement. Melts capital hulls.",
    category: "gun_platform",
    subCategory: "plasma_gun",
    weapons: ["plasmaCannon"],
    defenseSystems: ["deflectorShield"],
    hitPoints: 600,
    buildCost: { metal: 1500, crystal: 900, deuterium: 400 },
    prerequisites: { plasmaTech: 5, weaponsTech: 4 },
  },
  {
    platformType: "shieldGenerator",
    name: "Planetary Shield Generator",
    description: "Orbital shield dome protecting the planet surface.",
    category: "shield_projector",
    subCategory: "energy_dome",
    weapons: [],
    defenseSystems: ["planetaryShieldGenerator"],
    hitPoints: 1000,
    buildCost: { metal: 5000, crystal: 3000, deuterium: 1000 },
    prerequisites: { shieldingTech: 8 },
  },
  {
    platformType: "pointDefenseGrid",
    name: "Point Defense Grid",
    description: "Network of close-in weapon systems. Decimates incoming missiles.",
    category: "gun_platform",
    subCategory: "point_defense",
    weapons: ["pointDefenseCannon", "flakBattery"],
    defenseSystems: [],
    hitPoints: 250,
    buildCost: { metal: 600, crystal: 200, deuterium: 50 },
    prerequisites: {},
  },
  {
    platformType: "massDriverStation",
    name: "Mass Driver Station",
    description: "Orbital mass-driver ring. Long-range fleet denial.",
    category: "orbital_defense",
    subCategory: "kinetic_orbital",
    weapons: ["massDriver"],
    defenseSystems: ["compositeArmor"],
    hitPoints: 1500,
    buildCost: { metal: 3000, crystal: 1200, deuterium: 600 },
    prerequisites: { weaponsTech: 5, armourTech: 4 },
  },
  {
    platformType: "mineField",
    name: "Orbital Mine Field",
    description: "Autonomous explosive mines. Punishes attackers entering orbit.",
    category: "mine_field",
    subCategory: "proximity_mine",
    weapons: [],
    defenseSystems: [],
    hitPoints: 50,
    buildCost: { metal: 200, crystal: 50, deuterium: 30 },
    prerequisites: {},
  },
  {
    platformType: "interplanetaryMissileSilo",
    name: "Interplanetary Missile Silo",
    description: "Strategic bombardment silos for long-range deterrence.",
    category: "missile_platform",
    subCategory: "strategic_missile",
    weapons: ["interplanetaryMissile"],
    defenseSystems: ["compositeArmor"],
    hitPoints: 800,
    buildCost: { metal: 4000, crystal: 1500, deuterium: 1000 },
    prerequisites: { weaponsTech: 7, impulseDrive: 5 },
  },
];

// ===========================================================================
// BATTLE REPORT TAXONOMY  (OGame-style)
// ===========================================================================

/** Top-level mission class that generated the battle */
export type BattleReportType =
  | "attack"            // Standard fleet attack
  | "raid"              // Resource-focused plunder mission
  | "espionage"         // Spy probe mission (may trigger combat)
  | "colonization"      // Colonization fleet attacked en route
  | "moon_attack"       // Fleet targeting moon base
  | "starbase_attack"   // Fleet targeting a starbase
  | "mothership_strike" // Mothership leading assault
  | "expedition"        // Expedition encounters hostiles
  | "alliance_war"      // Alliance-declared war battle
  | "planetary_assault";// Ground/orbital invasion

/** Specific breakdown within a report type */
export type BattleReportSubType =
  // attack sub-types
  | "fleet_battle"          // Fleet vs fleet in open space
  | "orbital_bombardment"   // Fleet bombards planet orbit
  | "ground_assault"        // Ground troops land & fight
  | "convoy_intercept"      // Freighter convoy ambushed
  // raid sub-types
  | "resource_raid"         // Quick grab for metal/crystal/deuterium
  | "harvest_raid"          // Raid on farming outpost
  | "piracy"                // PvP piracy on trade routes
  // espionage sub-types
  | "spy_success"           // Probe gathered intel undetected
  | "spy_caught"            // Probe caught & destroyed
  | "spy_combat"            // Defending ships engaged probes
  // moon attack sub-types
  | "moon_destruction"      // Attempt to destroy moon base
  | "moon_siege"            // Sustained moon blockade
  // planetary assault sub-types
  | "planetary_siege"       // Long siege campaign
  | "blitz_assault"         // Rapid overwhelming strike
  | "liberation"            // Recapturing own colony
  // alliance war sub-types
  | "war_declaration_battle"
  | "decisive_engagement"
  | "skirmish";

/** Strategic significance of the engagement */
export type BattleReportClass =
  | "decisive"      // One side completely destroyed
  | "major"         // >50% casualties on losing side
  | "moderate"      // Significant losses both sides
  | "minor"         // Small skirmish, few casualties
  | "pyrrhic"       // Attacker wins but suffers catastrophic losses
  | "tactical"      // Strategic objective achieved regardless of casualties
  | "draw";         // Neither side achieves decisive result

/** Granular combat context */
export type BattleReportSubClass =
  // By combat environment
  | "deep_space"        // No gravitational body nearby
  | "planetary_orbit"   // Battle in planetary orbit
  | "asteroid_field"    // Debris field interference
  | "nebula"            // Nebula sensor disruption
  | "moon_orbit"        // Moon orbit engagement
  | "starbase_vicinity" // Near a defensive starbase
  // By combat character
  | "ambush"            // One side surprised the other
  | "pitched_battle"    // Both sides at full readiness
  | "retreat"           // One side fled early
  | "last_stand"        // Defender fought to the last unit
  | "overwhelming_force"// 10:1 or greater disparity
  | "close_fought"      // Within 10% casualties of each other
  // By unit composition
  | "fighter_duel"      // Mostly light fighters
  | "capital_clash"     // Battleship+ vs battleship+
  | "mothership_duel"   // At least one mothership involved
  | "mixed_arms";       // Multiple class types engaged

// ---------------------------------------------------------------------------
// Battle report metadata interface (attached to battles table)
// ---------------------------------------------------------------------------

export interface BattleReportMetadata {
  reportType: BattleReportType;
  reportSubType: BattleReportSubType;
  reportClass: BattleReportClass;
  reportSubClass: BattleReportSubClass;

  /** Weapons fired by attacker during the battle */
  attackerWeaponsUsed: string[];

  /** Weapons fired by defender during the battle */
  defenderWeaponsUsed: string[];

  /** Planet defense platforms that participated */
  planetDefensesEngaged: string[];

  /** Whether any mothership was involved */
  mothershipEngaged: boolean;

  /** Whether a planetary shield was active */
  planetaryShieldActive: boolean;

  /** Damage dealt by specific weapon types: { weaponId: totalDamage } */
  weaponDamageBreakdown: Record<string, number>;

  /** Shields stripped (total HP absorbed by shields) */
  shieldsStripped: number;

  /** Armor damage dealt (total HP absorbed by armor) */
  armorDamageDealt: number;

  /** Whether the planetary shield was breached */
  shieldBreached: boolean;
}

// ---------------------------------------------------------------------------
// Helper: classify a battle given force composition and outcome
// ---------------------------------------------------------------------------

export function classifyBattleReport(options: {
  winner: "attacker" | "defender" | "draw";
  attackerTotalUnits: number;
  defenderTotalUnits: number;
  attackerCasualties: number;
  defenderCasualties: number;
  missionType: string;
  defenderHasPlanet: boolean;
  defenderHasMoon: boolean;
  attackerHasMothership: boolean;
  defenderHasMothership: boolean;
  hasEspionageProbe: boolean;
}): Pick<BattleReportMetadata, "reportType" | "reportSubType" | "reportClass" | "reportSubClass"> {
  const {
    winner,
    attackerTotalUnits,
    defenderTotalUnits,
    attackerCasualties,
    defenderCasualties,
    missionType,
    defenderHasPlanet,
    defenderHasMoon,
    attackerHasMothership,
    defenderHasMothership,
    hasEspionageProbe,
  } = options;

  // --- Report Type ---
  let reportType: BattleReportType;
  if (hasEspionageProbe) {
    reportType = "espionage";
  } else if (missionType === "raid") {
    reportType = "raid";
  } else if (defenderHasMoon && missionType === "moon_attack") {
    reportType = "moon_attack";
  } else if (attackerHasMothership || defenderHasMothership) {
    reportType = "mothership_strike";
  } else if (defenderHasPlanet && attackerCasualties > attackerTotalUnits * 0.3) {
    reportType = "planetary_assault";
  } else {
    reportType = "attack";
  }

  // --- Report SubType ---
  let reportSubType: BattleReportSubType;
  if (reportType === "espionage") {
    reportSubType = winner === "attacker" ? "spy_success" : "spy_caught";
  } else if (reportType === "raid") {
    reportSubType = "resource_raid";
  } else if (reportType === "moon_attack") {
    reportSubType = "moon_destruction";
  } else if (reportType === "mothership_strike") {
    reportSubType = "fleet_battle";
  } else if (reportType === "planetary_assault") {
    reportSubType = attackerCasualties < attackerTotalUnits * 0.2 ? "blitz_assault" : "planetary_siege";
  } else {
    reportSubType = defenderHasPlanet ? "orbital_bombardment" : "fleet_battle";
  }

  // --- Report Class ---
  let reportClass: BattleReportClass;
  if (winner === "draw") {
    reportClass = "draw";
  } else {
    const loserInitial = winner === "attacker" ? defenderTotalUnits : attackerTotalUnits;
    const loserCasualties = winner === "attacker" ? defenderCasualties : attackerCasualties;
    const winnerCasualties = winner === "attacker" ? attackerCasualties : defenderCasualties;
    const winnerTotalUnits = winner === "attacker" ? attackerTotalUnits : defenderTotalUnits;
    const loserLossRate = loserInitial > 0 ? loserCasualties / loserInitial : 0;
    const winnerLossRate = winnerTotalUnits > 0 ? winnerCasualties / winnerTotalUnits : 0;

    if (loserLossRate >= 0.99) {
      reportClass = "decisive";
    } else if (loserLossRate >= 0.5) {
      reportClass = "major";
    } else if (winnerLossRate >= 0.6) {
      reportClass = "pyrrhic";
    } else if (loserLossRate >= 0.25) {
      reportClass = "moderate";
    } else {
      reportClass = "minor";
    }
  }

  // --- Report SubClass ---
  let reportSubClass: BattleReportSubClass;
  if (attackerHasMothership || defenderHasMothership) {
    reportSubClass = "mothership_duel";
  } else if (defenderHasPlanet) {
    reportSubClass = "planetary_orbit";
  } else if (defenderHasMoon) {
    reportSubClass = "moon_orbit";
  } else if (attackerTotalUnits > defenderTotalUnits * 10) {
    reportSubClass = "overwhelming_force";
  } else if (
    Math.abs(attackerCasualties - defenderCasualties) <=
    Math.max(attackerTotalUnits, defenderTotalUnits) * 0.1
  ) {
    reportSubClass = "close_fought";
  } else if (attackerCasualties === 0) {
    reportSubClass = "ambush";
  } else {
    reportSubClass = "pitched_battle";
  }

  return { reportType, reportSubType, reportClass, reportSubClass };
}

// ---------------------------------------------------------------------------
// Convenience lookups
// ---------------------------------------------------------------------------

/** Get a weapon system by ID */
export function getWeaponById(id: string): WeaponSystem | undefined {
  return WEAPON_SYSTEMS.find((w) => w.id === id);
}

/** Get a defense system by ID */
export function getDefenseSystemById(id: string): DefenseSystem | undefined {
  return DEFENSE_SYSTEMS.find((d) => d.id === id);
}

/** Get all weapons compatible with a platform type */
export function getWeaponsForPlatform(
  platform: "planet" | "starship" | "mothership"
): WeaponSystem[] {
  return WEAPON_SYSTEMS.filter((w) => w.compatibleWith.includes(platform));
}

/** Get all defense systems compatible with a platform type */
export function getDefensesForPlatform(
  platform: "planet" | "starship" | "mothership"
): DefenseSystem[] {
  return DEFENSE_SYSTEMS.filter((d) => d.compatibleWith.includes(platform));
}

/** Get the combat profile for a ship type */
export function getShipCombatProfile(shipType: string): ShipCombatProfile | undefined {
  return SHIP_COMBAT_PROFILES.find((p) => p.shipType === shipType);
}

/** Get a planet defense platform by type key */
export function getPlanetDefensePlatform(platformType: string): PlanetDefenseProfile | undefined {
  return PLANET_DEFENSE_PLATFORMS.find((p) => p.platformType === platformType);
}

/** Mothership hull types — ship types that count as a mothership */
export const MOTHERSHIP_TYPES = new Set([
  "commandShip", "mobileFortress", "siegeShip", "flagCommand", "mobileHQ",
  "factoryShip", "hospitalShip", "colonyShip",
]);

/**
 * Returns true if the provided unit-type map contains at least one mothership-class vessel.
 */
export function hasMothership(units: Record<string, any>): boolean {
  return Object.keys(units).some((t) => MOTHERSHIP_TYPES.has(t));
}
