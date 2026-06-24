export type BattlePhase =
  | "PREPARE"
  | "TARGETING"
  | "FIRE"
  | "DAMAGE"
  | "SHIELD_REGEN"
  | "CASUALTY"
  | "RETREAT_CHECK"
  | "RESULT";

export type ShipClass =
  | "light_fighter"
  | "scout"
  | "small_cargo"
  | "heavy_fighter"
  | "cruiser"
  | "interceptor"
  | "battleship"
  | "battlecruiser"
  | "destroyer"
  | "dreadnought"
  | "carrier"
  | "titan"
  | "leviathan"
  | "mothership"
  | "juggernaut"
  | "colony_ship"
  | "recycler"
  | "espionage_probe"
  | "bomber"
  | "reaper";

export type TargetingMode = "default" | "smart" | "focus_fire" | "spread";

export type TerrainType = "space" | "asteroid_field" | "nebula" | "planet_orbit";

export type FormationType =
  | "balanced"
  | "aggressive"
  | "defensive"
  | "flanking"
  | "pincer"
  | "wedge"
  | "circle";

export type BattleResult = "attacker_victory" | "defender_victory" | "draw";

export interface ShipDefinition {
  name: string;
  class: ShipClass;
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  speed: number;
  cargo: number;
  fuelConsumption: number;
  buildTime: number;
  description: string;
  tier: number;
  specialAbility: string;
}

export interface DamageModifiers {
  attackModifier: number;
  defenseModifier: number;
  researchBonus: number;
  commanderBonus: number;
  formationBonus: number;
  terrainBonus: number;
}

export interface ShieldState {
  current: number;
  max: number;
  regenRate: number;
  lastBattleTime: number;
}

export interface EvasionConfig {
  baseEvasion: number;
  evasionFactor: number;
  glancingDamageReduction: number;
}

export interface CriticalHitConfig {
  baseCritChance: number;
  critChancePerResearch: number;
  minCritMultiplier: number;
  maxCritMultiplier: number;
  shieldBypassFraction: number;
}

export interface TargetingConfig {
  mode: TargetingMode;
  threatWeight: number;
  counterWeight: number;
  distanceWeight: number;
}

export interface RetreatConfig {
  retreatThreshold: number;
  baseRetreatChance: number;
  failedRetreatPenalty: number;
  escapeDamageMultiplier: number;
}

export interface PlunderConfig {
  metalSplit: number;
  crystalSplit: number;
  deuteriumSplit: number;
  maxPlunderMultiplier: number;
}

export interface ExperienceConfig {
  xpPerShipDestroyed: number;
  xpPerFleetPower: number;
  defenderXpBonus: number;
  commanderXpGain: number;
}

export interface TerrainModifier {
  defenseBonus: number;
  speedBonus: number;
  accuracyBonus: number;
  evasionBonus: number;
}

export interface FormationModifier {
  attackMultiplier: number;
  defenseMultiplier: number;
  requiresSpeedAdvantage?: boolean;
  requiresTeamCoordination?: boolean;
}

export interface BattleConfig {
  maxRounds: number;
  attackerFirstStrike: boolean;
  phases: BattlePhase[];
  shipDefinitions: Record<ShipClass, ShipDefinition>;
  damageFormula: {
    defenseConstant: number;
    minRandomFactor: number;
    maxRandomFactor: number;
  };
  shield: {
    absorbFraction: number;
    regenFraction: number;
    rechargeTimeFactor: number;
  };
  evasion: EvasionConfig;
  criticalHit: CriticalHitConfig;
  targeting: Record<TargetingMode, TargetingConfig>;
  retreat: RetreatConfig;
  plunder: PlunderConfig;
  experience: ExperienceConfig;
  terrain: Record<TerrainType, TerrainModifier>;
  formations: Record<FormationType, FormationModifier>;
}

export const BATTLE_CONFIG: BattleConfig = {
  maxRounds: 100,
  attackerFirstStrike: true,
  phases: [
    "PREPARE",
    "TARGETING",
    "FIRE",
    "DAMAGE",
    "SHIELD_REGEN",
    "CASUALTY",
    "RETREAT_CHECK",
    "RESULT",
  ],

  shipDefinitions: {
    light_fighter: {
      name: "Light Fighter",
      class: "light_fighter",
      attack: 30,
      defense: 10,
      shield: 15,
      hull: 80,
      speed: 120,
      cargo: 20,
      fuelConsumption: 5,
      buildTime: 300,
      description: "Fast, agile interceptor. Weak but numerous.",
      tier: 1,
      specialAbility: "swarm_tactics",
    },
    scout: {
      name: "Scout",
      class: "scout",
      attack: 5,
      defense: 5,
      shield: 10,
      hull: 50,
      speed: 200,
      cargo: 10,
      fuelConsumption: 3,
      buildTime: 200,
      description: "Fastest ship. No weapons, used for reconnaissance.",
      tier: 1,
      specialAbility: "deep_scan",
    },
    small_cargo: {
      name: "Small Cargo",
      class: "small_cargo",
      attack: 10,
      defense: 8,
      shield: 10,
      hull: 100,
      speed: 80,
      cargo: 500,
      fuelConsumption: 10,
      buildTime: 400,
      description: "Light transport vessel. Minimal combat capability.",
      tier: 1,
      specialAbility: "quick_load",
    },
    heavy_fighter: {
      name: "Heavy Fighter",
      class: "heavy_fighter",
      attack: 60,
      defense: 25,
      shield: 30,
      hull: 150,
      speed: 90,
      cargo: 30,
      fuelConsumption: 12,
      buildTime: 600,
      description: "Balanced combat vessel. Good all-rounder.",
      tier: 2,
      specialAbility: "lock_on",
    },
    cruiser: {
      name: "Cruiser",
      class: "cruiser",
      attack: 80,
      defense: 40,
      shield: 80,
      hull: 250,
      speed: 70,
      cargo: 60,
      fuelConsumption: 20,
      buildTime: 900,
      description: "Strong shields. Excellent against fighters.",
      tier: 2,
      specialAbility: "shield_overcharge",
    },
    interceptor: {
      name: "Interceptor",
      class: "interceptor",
      attack: 100,
      defense: 15,
      shield: 20,
      hull: 120,
      speed: 150,
      cargo: 15,
      fuelConsumption: 8,
      buildTime: 500,
      description: "Anti-fighter specialist. Devastating vs light ships.",
      tier: 2,
      specialAbility: "anti_fighter_bonus",
    },
    battleship: {
      name: "Battleship",
      class: "battleship",
      attack: 200,
      defense: 80,
      shield: 100,
      hull: 500,
      speed: 40,
      cargo: 80,
      fuelConsumption: 50,
      buildTime: 1800,
      description: "Heavy hitter. Dominates capital ship combat.",
      tier: 3,
      specialAbility: "barrage",
    },
    battlecruiser: {
      name: "Battlecruiser",
      class: "battlecruiser",
      attack: 160,
      defense: 60,
      shield: 80,
      hull: 400,
      speed: 55,
      cargo: 70,
      fuelConsumption: 40,
      buildTime: 1500,
      description: "Balanced heavy vessel. Fast for its firepower.",
      tier: 3,
      specialAbility: "rapid_fire",
    },
    destroyer: {
      name: "Destroyer",
      class: "destroyer",
      attack: 180,
      defense: 50,
      shield: 60,
      hull: 350,
      speed: 60,
      cargo: 50,
      fuelConsumption: 35,
      buildTime: 1200,
      description: "Anti-capital ship specialist. Penetrates heavy armor.",
      tier: 3,
      specialAbility: "armor_piercing",
    },
    dreadnought: {
      name: "Dreadnought",
      class: "dreadnought",
      attack: 400,
      defense: 120,
      shield: 150,
      hull: 1000,
      speed: 20,
      cargo: 100,
      fuelConsumption: 100,
      buildTime: 3600,
      description: "Slow but devastating. Ultimate battleship.",
      tier: 4,
      specialAbility: "devastating_barrage",
    },
    carrier: {
      name: "Carrier",
      class: "carrier",
      attack: 100,
      defense: 70,
      shield: 120,
      hull: 600,
      speed: 35,
      cargo: 200,
      fuelConsumption: 60,
      buildTime: 2400,
      description: "Launches fighter squadrons. Force multiplier.",
      tier: 4,
      specialAbility: "launch_squadrons",
    },
    titan: {
      name: "Titan",
      class: "titan",
      attack: 300,
      defense: 200,
      shield: 200,
      hull: 2000,
      speed: 15,
      cargo: 150,
      fuelConsumption: 150,
      buildTime: 7200,
      description: "Massive hull. Walking fortress.",
      tier: 4,
      specialAbility: "fortified_hull",
    },
    leviathan: {
      name: "Leviathan",
      class: "leviathan",
      attack: 600,
      defense: 250,
      shield: 300,
      hull: 3000,
      speed: 10,
      cargo: 300,
      fuelConsumption: 200,
      buildTime: 14400,
      description: "Endgame vessel. Absolute destruction.",
      tier: 5,
      specialAbility: "annihilation_beam",
    },
    mothership: {
      name: "Mothership",
      class: "mothership",
      attack: 200,
      defense: 150,
      shield: 250,
      hull: 2500,
      speed: 12,
      cargo: 500,
      fuelConsumption: 180,
      buildTime: 10800,
      description: "Spawns fighter units. Fleet backbone.",
      tier: 5,
      specialAbility: "spawn_fighters",
    },
    juggernaut: {
      name: "Juggernaut",
      class: "juggernaut",
      attack: 500,
      defense: 180,
      shield: 180,
      hull: 2800,
      speed: 8,
      cargo: 200,
      fuelConsumption: 250,
      buildTime: 12000,
      description: "Siege specialist. Destroys structures.",
      tier: 5,
      specialAbility: "siege_cannon",
    },
    colony_ship: {
      name: "Colony Ship",
      class: "colony_ship",
      attack: 0,
      defense: 20,
      shield: 30,
      hull: 400,
      speed: 50,
      cargo: 1000,
      fuelConsumption: 80,
      buildTime: 3600,
      description: "Establishes new colonies. No weapons.",
      tier: 1,
      specialAbility: "colonize",
    },
    recycler: {
      name: "Recycler",
      class: "recycler",
      attack: 15,
      defense: 10,
      shield: 10,
      hull: 200,
      speed: 60,
      cargo: 2000,
      fuelConsumption: 30,
      buildTime: 900,
      description: "Collects debris and resources from battlefields.",
      tier: 1,
      specialAbility: "harvest_debris",
    },
    espionage_probe: {
      name: "Espionage Probe",
      class: "espionage_probe",
      attack: 0,
      defense: 1,
      shield: 1,
      hull: 10,
      speed: 300,
      cargo: 0,
      fuelConsumption: 1,
      buildTime: 60,
      description: "Invisible spy unit. Gather intelligence.",
      tier: 1,
      specialAbility: "spy",
    },
    bomber: {
      name: "Bomber",
      class: "bomber",
      attack: 250,
      defense: 30,
      shield: 40,
      hull: 300,
      speed: 45,
      fuelConsumption: 45,
      cargo: 30,
      buildTime: 1200,
      description: "Planet attack specialist. Devastating orbital bombardment.",
      tier: 3,
      specialAbility: "orbital_bombardment",
    },
    reaper: {
      name: "Reaper",
      class: "reaper",
      attack: 80,
      defense: 40,
      shield: 50,
      hull: 250,
      speed: 70,
      cargo: 3000,
      fuelConsumption: 25,
      buildTime: 800,
      description: "Debris collector. Enhanced salvage operations.",
      tier: 2,
      specialAbility: "enhanced_salvage",
    },
  },

  damageFormula: {
    defenseConstant: 200,
    minRandomFactor: 0.85,
    maxRandomFactor: 1.15,
  },

  shield: {
    absorbFraction: 0.70,
    regenFraction: 0.10,
    rechargeTimeFactor: 3600,
  },

  evasion: {
    baseEvasion: 5,
    evasionFactor: 0.5,
    glancingDamageReduction: 0.90,
  },

  criticalHit: {
    baseCritChance: 5,
    critChancePerResearch: 0.5,
    minCritMultiplier: 1.5,
    maxCritMultiplier: 2.5,
    shieldBypassFraction: 0.50,
  },

  targeting: {
    default: {
      mode: "default",
      threatWeight: 1.0,
      counterWeight: 0.5,
      distanceWeight: 0.3,
    },
    smart: {
      mode: "smart",
      threatWeight: 0.7,
      counterWeight: 1.5,
      distanceWeight: 0.2,
    },
    focus_fire: {
      mode: "focus_fire",
      threatWeight: 2.0,
      counterWeight: 0.3,
      distanceWeight: 0.1,
    },
    spread: {
      mode: "spread",
      threatWeight: 0.5,
      counterWeight: 0.5,
      distanceWeight: 1.0,
    },
  },

  retreat: {
    retreatThreshold: 0.50,
    baseRetreatChance: 100,
    failedRetreatPenalty: 0.20,
    escapeDamageMultiplier: 1.0,
  },

  plunder: {
    metalSplit: 0.50,
    crystalSplit: 0.30,
    deuteriumSplit: 0.20,
    maxPlunderMultiplier: 1.0,
  },

  experience: {
    xpPerShipDestroyed: 10,
    xpPerFleetPower: 0.01,
    defenderXpBonus: 1.5,
    commanderXpGain: 1.0,
  },

  terrain: {
    space: {
      defenseBonus: 0,
      speedBonus: 0,
      accuracyBonus: 0,
      evasionBonus: 0,
    },
    asteroid_field: {
      defenseBonus: 0.10,
      speedBonus: -0.05,
      accuracyBonus: 0,
      evasionBonus: 0,
    },
    nebula: {
      defenseBonus: 0,
      speedBonus: 0,
      accuracyBonus: -0.20,
      evasionBonus: 0.15,
    },
    planet_orbit: {
      defenseBonus: 0,
      speedBonus: -0.10,
      accuracyBonus: 0,
      evasionBonus: 0,
    },
  },

  formations: {
    balanced: {
      attackMultiplier: 1.0,
      defenseMultiplier: 1.0,
    },
    aggressive: {
      attackMultiplier: 1.4,
      defenseMultiplier: 0.8,
    },
    defensive: {
      attackMultiplier: 0.7,
      defenseMultiplier: 1.5,
    },
    flanking: {
      attackMultiplier: 1.8,
      defenseMultiplier: 0.6,
      requiresSpeedAdvantage: true,
    },
    pincer: {
      attackMultiplier: 2.0,
      defenseMultiplier: 0.7,
      requiresTeamCoordination: true,
    },
    wedge: {
      attackMultiplier: 1.6,
      defenseMultiplier: 0.9,
    },
    circle: {
      attackMultiplier: 1.0,
      defenseMultiplier: 1.2,
    },
  },
};

export function getShipDefinition(shipClass: ShipClass): ShipDefinition {
  return BATTLE_CONFIG.shipDefinitions[shipClass];
}

export function getTerrainModifier(terrain: TerrainType): TerrainModifier {
  return BATTLE_CONFIG.terrain[terrain];
}

export function getFormationModifier(formation: FormationType): FormationModifier {
  return BATTLE_CONFIG.formations[formation];
}

export function calculateActualDamage(
  attack: number,
  defense: number,
  modifiers: DamageModifiers
): number {
  const totalAttack = attack * modifiers.attackModifier * modifiers.formationBonus * modifiers.terrainBonus;
  const totalDefense = defense * modifiers.defenseModifier;
  const defenseReduction = totalDefense / (totalDefense + BATTLE_CONFIG.damageFormula.defenseConstant);
  const randomFactor =
    BATTLE_CONFIG.damageFormula.minRandomFactor +
    Math.random() *
      (BATTLE_CONFIG.damageFormula.maxRandomFactor - BATTLE_CONFIG.damageFormula.minRandomFactor);
  return totalAttack * (1 - defenseReduction) * randomFactor;
}

export function calculateEvasionChance(speed: number): number {
  const baseEvasion = BATTLE_CONFIG.evasion.baseEvasion + speed * BATTLE_CONFIG.evasion.evasionFactor;
  return baseEvasion / (baseEvasion + 100);
}

export function calculateCriticalHitChance(researchLevel: number): number {
  return (
    BATTLE_CONFIG.criticalHit.baseCritChance +
    researchLevel * BATTLE_CONFIG.criticalHit.critChancePerResearch
  );
}

export function calculateCriticalDamage(baseDamage: number, commanderSkill: number): number {
  const multiplierRange =
    BATTLE_CONFIG.criticalHit.maxCritMultiplier - BATTLE_CONFIG.criticalHit.minCritMultiplier;
  const multiplier =
    BATTLE_CONFIG.criticalHit.minCritMultiplier + commanderSkill * multiplierRange;
  return baseDamage * multiplier;
}

export function calculateShieldAbsorption(incomingDamage: number, currentShield: number): {
  shieldDamage: number;
  hullDamage: number;
} {
  const shieldAbsorb = incomingDamage * BATTLE_CONFIG.shield.absorbFraction;
  const actualShieldDamage = Math.min(shieldAbsorb, currentShield);
  const hullDamage = incomingDamage - actualShieldDamage + (shieldAbsorb - actualShieldDamage);
  return {
    shieldDamage: actualShieldDamage,
    hullDamage: Math.max(0, hullDamage),
  };
}

export function calculateShieldRegen(maxShield: number, researchBonus: number): number {
  return maxShield * BATTLE_CONFIG.shield.regenFraction * (1 + researchBonus);
}

export function calculateRetreatChance(remainingPower: number, startingPower: number): number {
  return (remainingPower / startingPower) * BATTLE_CONFIG.retreat.baseRetreatChance;
}

export function calculatePlunder(
  survivingCargoShips: number,
  cargoCapacity: number
): { metal: number; crystal: number; deuterium: number } {
  const totalCargo = survivingCargoShips * cargoCapacity * BATTLE_CONFIG.plunder.maxPlunderMultiplier;
  return {
    metal: totalCargo * BATTLE_CONFIG.plunder.metalSplit,
    crystal: totalCargo * BATTLE_CONFIG.plunder.crystalSplit,
    deuterium: totalCargo * BATTLE_CONFIG.plunder.deuteriumSplit,
  };
}

export function calculateExperience(
  shipsDestroyed: number,
  shipTier: number,
  fleetPower: number,
  isDefender: boolean
): number {
  const baseXP = shipsDestroyed * shipTier * BATTLE_CONFIG.experience.xpPerShipDestroyed;
  const powerXP = fleetPower * BATTLE_CONFIG.experience.xpPerFleetPower;
  const defenderBonus = isDefender ? BATTLE_CONFIG.experience.defenderXpBonus : 1.0;
  return (baseXP + powerXP) * defenderBonus;
}

export function getPlanetDefenseBonus(): number {
  return BATTLE_CONFIG.terrain.planet_orbit.defenseBonus;
}
