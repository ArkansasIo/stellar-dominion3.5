import { db } from "./db";

export const COMBAT_CONFIG = {
  UNIT_STATS: {
    lightFighter: { attack: 50, defense: 20, health: 100, speed: 12, shield: 20, hull: 80, evasion: 8, cargo: 5 },
    heavyFighter: { attack: 80, defense: 40, health: 150, speed: 10, shield: 40, hull: 110, evasion: 5, cargo: 10 },
    smallCargo: { attack: 10, defense: 15, health: 400, speed: 8, shield: 30, hull: 370, evasion: 3, cargo: 500 },
    largeCargo: { attack: 5, defense: 10, health: 800, speed: 5, shield: 50, hull: 750, evasion: 1, cargo: 2000 },
    espionageProbe: { attack: 1, defense: 5, health: 50, speed: 20, shield: 10, hull: 40, evasion: 15, cargo: 0 },
    battleship: { attack: 200, defense: 100, health: 600, speed: 6, shield: 100, hull: 500, evasion: 2, cargo: 50 },
    cruiser: { attack: 120, defense: 60, health: 400, speed: 8, shield: 70, hull: 330, evasion: 4, cargo: 80 },
    destroyer: { attack: 90, defense: 50, health: 300, speed: 10, shield: 50, hull: 250, evasion: 6, cargo: 30 },
    dreadnought: { attack: 300, defense: 150, health: 1000, speed: 4, shield: 150, hull: 850, evasion: 1, cargo: 100 },
    colonist: { attack: 5, defense: 5, health: 50, speed: 3, shield: 5, hull: 45, evasion: 0, cargo: 1000 },
  } as any,

  RESEARCH_BONUSES: {
    weaponsTech: 0.05,
    shieldingTech: 0.05,
    armourTech: 0.03,
    combustionDrive: 0.02,
    evasionTech: 0.03,
    targetingTech: 0.04,
  },

  BATTLE_CONFIG: {
    MAX_ROUNDS: 100,
    CRITICAL_CHANCE_BASE: 0.05,
    CRITICAL_MULTIPLIER: 1.5,
    MINIMUM_DAMAGE: 1,
    SHIELD_REGEN_RATE: 0.1,
    RETREAT_THRESHOLD: 0.5,
    FLEET_SYNERGY_THRESHOLD: 10,
    FLEET_SYNERGY_BONUS: 0.05,
  },

  TERRAIN_MODIFIERS: {
    space: { attackMod: 1.0, defenseMod: 1.0, evasionMod: 1.0, shieldMod: 1.0 },
    asteroid_field: { attackMod: 0.85, defenseMod: 1.15, evasionMod: 0.9, shieldMod: 0.8 },
    nebula: { attackMod: 0.9, defenseMod: 0.9, evasionMod: 1.3, shieldMod: 0.7 },
    planet_orbit: { attackMod: 1.1, defenseMod: 1.2, evasionMod: 0.8, shieldMod: 1.1 },
  },

  FLANGE_BONUSES: {
    balanced: { attackMod: 1.0, defenseMod: 1.0, speedMod: 1.0 },
    aggressive: { attackMod: 1.4, defenseMod: 0.8, speedMod: 1.1 },
    defensive: { attackMod: 0.7, defenseMod: 1.5, speedMod: 0.9 },
    flanking: { attackMod: 1.8, defenseMod: 0.6, speedMod: 1.3 },
    pincer: { attackMod: 2.0, defenseMod: 0.7, speedMod: 1.2 },
    wedge: { attackMod: 1.6, defenseMod: 0.9, speedMod: 1.15 },
    circle: { attackMod: 1.0, defenseMod: 1.2, speedMod: 1.0 },
  },
};

export interface Commander {
  attackBonus?: number;
  defenseBonus?: number;
  evasionBonus?: number;
  shieldBonus?: number;
  specialAbility?: string;
  specialAbilityPower?: number;
}

export interface CombatUnit {
  type: string;
  count: number;
  actualHP?: number;
  shields?: number;
  hull?: number;
}

export interface CombatForce {
  units: { [key: string]: CombatUnit };
  research?: { [key: string]: number };
  bonusMultiplier?: number;
  commander?: Commander;
  formation?: string;
  terrain?: string;
}

export interface UnitBattleStats {
  type: string;
  initialCount: number;
  survivingCount: number;
  totalDamageDealt: number;
  totalDamageReceived: number;
  kills: number;
  shieldsLost: number;
  hullLost: number;
}

export interface BattleResult {
  winner: "attacker" | "defender" | "draw";
  attackerUnits: { [key: string]: number };
  defenderUnits: { [key: string]: number };
  attackerCasualties: number;
  defenderCasualties: number;
  rounds: number;
  battleLog: string[];
  attackerRetreated?: boolean;
  defenderRetreated?: boolean;
  attackerReport?: UnitBattleStats[];
  defenderReport?: UnitBattleStats[];
  attackerDamageDealt?: number;
  defenderDamageDealt?: number;
  attackerXPGained?: number;
  defenderXPGained?: number;
  plunder?: { metal: number; crystal: number; deuterium: number };
}

export function getUnitStats(
  unitType: string,
  research: { [key: string]: number } = {},
  bonusMultiplier: number = 1,
  commander?: Commander,
  terrain?: string,
  formation?: string
) {
  const baseStats = COMBAT_CONFIG.UNIT_STATS[unitType];
  if (!baseStats) return null;

  let attack = baseStats.attack * bonusMultiplier;
  let defense = baseStats.defense * bonusMultiplier;
  let health = baseStats.health * bonusMultiplier;
  let speed = baseStats.speed * bonusMultiplier;
  let shield = baseStats.shield * bonusMultiplier;
  let hull = baseStats.hull * bonusMultiplier;
  let evasion = baseStats.evasion * bonusMultiplier;
  let cargo = baseStats.cargo;

  attack *= 1 + ((research.weaponsTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.weaponsTech);
  defense *= 1 + ((research.shieldingTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.shieldingTech);
  health *= 1 + ((research.armourTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.armourTech);
  speed *= 1 + ((research.combustionDrive || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.combustionDrive);
  evasion *= 1 + ((research.evasionTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.evasionTech);

  if (commander) {
    attack *= 1 + (commander.attackBonus || 0);
    defense *= 1 + (commander.defenseBonus || 0);
    evasion += commander.evasionBonus || 0;
    shield *= 1 + (commander.shieldBonus || 0);
  }

  if (terrain) {
    const tMod = (COMBAT_CONFIG.TERRAIN_MODIFIERS as Record<string, any>)[terrain] || COMBAT_CONFIG.TERRAIN_MODIFIERS.space;
    attack *= tMod.attackMod;
    defense *= tMod.defenseMod;
    evasion *= tMod.evasionMod;
    shield *= tMod.shieldMod;
  }

  if (formation) {
    const fMod = (COMBAT_CONFIG.FLANGE_BONUSES as Record<string, any>)[formation] || COMBAT_CONFIG.FLANGE_BONUSES.balanced;
    attack *= fMod.attackMod;
    defense *= fMod.defenseMod;
    speed *= fMod.speedMod;
  }

  return { attack, defense, health, speed, shield, hull, evasion, cargo };
}

export function getFleetSynergyBonus(units: { [key: string]: CombatUnit }): number {
  let bonus = 1.0;
  for (const unit of Object.values(units)) {
    if (unit.count >= COMBAT_CONFIG.BATTLE_CONFIG.FLEET_SYNERGY_THRESHOLD) {
      const tiers = Math.floor(unit.count / COMBAT_CONFIG.BATTLE_CONFIG.FLEET_SYNERGY_THRESHOLD);
      bonus += tiers * COMBAT_CONFIG.BATTLE_CONFIG.FLEET_SYNERGY_BONUS;
    }
  }
  return bonus;
}

export function calculateEvasionChance(
  attackerStats: any,
  defenderStats: any,
  defenderUnitCount: number
): number {
  const baseEvasion = defenderStats.evasion;
  const sizeFactor = Math.max(0.5, 1 - defenderUnitCount * 0.001);
  const speedFactor = defenderStats.speed / Math.max(attackerStats.speed, 1);
  const accuracy = 90 - baseEvasion * sizeFactor * speedFactor;
  return Math.max(5, Math.min(95, accuracy));
}

export function selectTarget(
  attackerUnits: { [key: string]: CombatUnit },
  defenderUnits: { [key: string]: CombatUnit }
): { unit: CombatUnit; stats: any } | null {
  const targets: { unit: CombatUnit; stats: any; priority: number }[] = [];

  for (const unit of Object.values(defenderUnits)) {
    if (unit.count <= 0) continue;
    const stats = COMBAT_CONFIG.UNIT_STATS[unit.type];
    if (!stats) continue;

    const sizeScore = (stats.health + stats.shield + stats.hull) / 100;
    const speedScore = 20 - stats.speed;
    const valueScore = stats.attack * 0.5 + stats.defense * 0.3;
    const priority = sizeScore + speedScore + valueScore;

    targets.push({ unit, stats, priority });
  }

  if (targets.length === 0) return null;

  targets.sort((a, b) => b.priority - a.priority);
  const totalPriority = targets.reduce((sum, t) => sum + t.priority, 0);
  let roll = Math.random() * totalPriority;
  for (const target of targets) {
    roll -= target.priority;
    if (roll <= 0) {
      return { unit: target.unit, stats: COMBAT_CONFIG.UNIT_STATS[target.unit.type] };
    }
  }
  return { unit: targets[0].unit, stats: COMBAT_CONFIG.UNIT_STATS[targets[0].unit.type] };
}

export function calculateDamage(
  attackerStats: any,
  defenderStats: any,
  isCritical: boolean = false,
  evasionChance: number = 90,
  defenderShields: number = 0,
  defenderHull: number = 0
): { damage: number; hit: boolean; shieldDamage: number; hullDamage: number } {
  const hitChance = evasionChance;
  const hit = Math.random() * 100 < hitChance;

  if (!hit) {
    return { damage: 0, hit: false, shieldDamage: 0, hullDamage: 0 };
  }

  let baseDamage = Math.max(
    COMBAT_CONFIG.BATTLE_CONFIG.MINIMUM_DAMAGE,
    attackerStats.attack - defenderStats.defense * 0.5
  );

  const variance = 1 + (Math.random() - 0.5) * 0.3;
  let damage = baseDamage * variance;

  if (isCritical) {
    damage *= COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_MULTIPLIER;
  }

  damage = Math.ceil(damage);
  let shieldDamage = 0;
  let hullDamage = 0;

  if (defenderShields > 0) {
    shieldDamage = Math.min(damage, defenderShields);
    damage -= shieldDamage;
  }
  hullDamage = Math.min(damage, defenderHull);

  return { damage: shieldDamage + hullDamage, hit: true, shieldDamage, hullDamage };
}

export function simulateCombatRound(
  attackerForce: CombatForce,
  defenderForce: CombatForce,
  roundNumber: number,
  attackerReport: UnitBattleStats[],
  defenderReport: UnitBattleStats[]
): { attackerLosses: number; defenderLosses: number; log: string; attackerDamage: number; defenderDamage: number } {
  let attackerDamage = 0;
  let defenderDamage = 0;
  const logEntries: string[] = [];

  const attackerSynergy = getFleetSynergyBonus(attackerForce.units);
  const defenderSynergy = getFleetSynergyBonus(defenderForce.units);

  const attackerAttacks = () => {
    for (const [unitType, unit] of Object.entries(attackerForce.units)) {
      if (unit.count <= 0) continue;

      const stats = getUnitStats(
        unitType,
        attackerForce.research,
        attackerForce.bonusMultiplier,
        attackerForce.commander,
        attackerForce.terrain,
        attackerForce.formation
      );
      if (!stats) continue;

      stats.attack *= attackerSynergy;

      for (let i = 0; i < unit.count; i++) {
        const target = selectTarget(attackerForce.units, defenderForce.units);
        if (!target) break;

        const targetStats = getUnitStats(
          target.unit.type,
          defenderForce.research,
          defenderForce.bonusMultiplier,
          defenderForce.commander,
          defenderForce.terrain,
          defenderForce.formation
        );
        if (!targetStats) continue;

        const currentShields = (target.unit as any).shields || targetStats.shield;
        const currentHull = (target.unit as any).hull || targetStats.hull;

        const evasionChance = calculateEvasionChance(stats, targetStats, target.unit.count);
        const isCritical = Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;

        const result = calculateDamage(stats, targetStats, isCritical, evasionChance, currentShields, currentHull);

        if (result.hit) {
          attackerDamage += result.damage;
          (target.unit as any).shields = Math.max(0, currentShields - result.shieldDamage);
          (target.unit as any).hull = Math.max(0, currentHull - result.hullDamage);

          const targetReport = defenderReport.find(r => r.type === target.unit.type);
          if (targetReport) {
            targetReport.totalDamageReceived += result.damage;
            targetReport.shieldsLost += result.shieldDamage;
            targetReport.hullLost += result.hullDamage;
          }

          if (isCritical) {
            logEntries.push(`Round ${roundNumber}: ${unitType} CRITICAL HIT on ${target.unit.type} for ${result.damage} damage!`);
          }
        }
      }
    }
  };

  const defenderAttacks = () => {
    for (const [unitType, unit] of Object.entries(defenderForce.units)) {
      if (unit.count <= 0) continue;

      const stats = getUnitStats(
        unitType,
        defenderForce.research,
        defenderForce.bonusMultiplier,
        defenderForce.commander,
        defenderForce.terrain,
        defenderForce.formation
      );
      if (!stats) continue;

      stats.attack *= defenderSynergy;

      for (let i = 0; i < unit.count; i++) {
        const target = selectTarget(defenderForce.units, attackerForce.units);
        if (!target) break;

        const targetStats = getUnitStats(
          target.unit.type,
          attackerForce.research,
          attackerForce.bonusMultiplier,
          attackerForce.commander,
          attackerForce.terrain,
          attackerForce.formation
        );
        if (!targetStats) continue;

        const currentShields = (target.unit as any).shields || targetStats.shield;
        const currentHull = (target.unit as any).hull || targetStats.hull;

        const evasionChance = calculateEvasionChance(stats, targetStats, target.unit.count);
        const isCritical = Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;

        const result = calculateDamage(stats, targetStats, isCritical, evasionChance, currentShields, currentHull);

        if (result.hit) {
          defenderDamage += result.damage;
          (target.unit as any).shields = Math.max(0, currentShields - result.shieldDamage);
          (target.unit as any).hull = Math.max(0, currentHull - result.hullDamage);

          const targetReport = attackerReport.find(r => r.type === target.unit.type);
          if (targetReport) {
            targetReport.totalDamageReceived += result.damage;
            targetReport.shieldsLost += result.shieldDamage;
            targetReport.hullLost += result.hullDamage;
          }
        }
      }
    }
  };

  attackerAttacks();
  defenderAttacks();

  let attackerLosses = 0;
  let defenderLosses = 0;

  for (const [unitType, unit] of Object.entries(defenderForce.units)) {
    if (unit.count <= 0) continue;
    const currentHull = (unit as any).hull || 0;
    const stats = COMBAT_CONFIG.UNIT_STATS[unitType];
    if (!stats) continue;
    const maxHull = stats.hull * (defenderForce.bonusMultiplier || 1);
    if (currentHull <= 0) {
      defenderLosses += unit.count;
      const report = defenderReport.find(r => r.type === unitType);
      if (report) report.kills += unit.count;
    }
  }

  for (const [unitType, unit] of Object.entries(attackerForce.units)) {
    if (unit.count <= 0) continue;
    const currentHull = (unit as any).hull || 0;
    const stats = COMBAT_CONFIG.UNIT_STATS[unitType];
    if (!stats) continue;
    const maxHull = stats.hull * (attackerForce.bonusMultiplier || 1);
    if (currentHull <= 0) {
      attackerLosses += unit.count;
      const report = attackerReport.find(r => r.type === unitType);
      if (report) report.kills += unit.count;
    }
  }

  for (const unit of Object.values(defenderForce.units)) {
    if ((unit as any).hull !== undefined) {
      const stats = COMBAT_CONFIG.UNIT_STATS[unit.type];
      if (stats) {
        const regenShield = Math.min(
          stats.shield * COMBAT_CONFIG.BATTLE_CONFIG.SHIELD_REGEN_RATE,
          (unit as any).shields + stats.shield * COMBAT_CONFIG.BATTLE_CONFIG.SHIELD_REGEN_RATE
        );
        (unit as any).shields = regenShield;
      }
    }
  }

  for (const unit of Object.values(attackerForce.units)) {
    if ((unit as any).hull !== undefined) {
      const stats = COMBAT_CONFIG.UNIT_STATS[unit.type];
      if (stats) {
        const regenShield = Math.min(
          stats.shield * COMBAT_CONFIG.BATTLE_CONFIG.SHIELD_REGEN_RATE,
          (unit as any).shields + stats.shield * COMBAT_CONFIG.BATTLE_CONFIG.SHIELD_REGEN_RATE
        );
        (unit as any).shields = regenShield;
      }
    }
  }

  const log = logEntries.join("\n") || `Round ${roundNumber}: Both sides exchange fire.`;

  return { attackerLosses, defenderLosses, log, attackerDamage, defenderDamage };
}

export function calculateRetreatChance(
  force: CombatForce,
  currentPower: number,
  initialPower: number
): boolean {
  if (initialPower <= 0) return false;
  const powerRatio = currentPower / initialPower;
  return powerRatio <= COMBAT_CONFIG.BATTLE_CONFIG.RETREAT_THRESHOLD;
}

export function calculateFleetPower(units: { [key: string]: CombatUnit }): number {
  let power = 0;
  for (const unit of Object.values(units)) {
    if (unit.count <= 0) continue;
    const stats = COMBAT_CONFIG.UNIT_STATS[unit.type];
    if (!stats) continue;
    power += unit.count * (stats.attack + stats.defense + stats.health) * 0.1;
  }
  return power;
}

export function simulateBattle(
  attackerForce: CombatForce,
  defenderForce: CombatForce
): BattleResult {
  const battleLog: string[] = [];
  let round = 0;

  const attacker = JSON.parse(JSON.stringify(attackerForce));
  const defender = JSON.parse(JSON.stringify(defenderForce));

  const attackerReport: UnitBattleStats[] = Object.entries(attacker.units).map(([type, unit]) => ({
    type,
    initialCount: (unit as any).count,
    survivingCount: (unit as any).count,
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    kills: 0,
    shieldsLost: 0,
    hullLost: 0,
  }));

  const defenderReport: UnitBattleStats[] = Object.entries(defender.units).map(([type, unit]) => ({
    type,
    initialCount: (unit as any).count,
    survivingCount: (unit as any).count,
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    kills: 0,
    shieldsLost: 0,
    hullLost: 0,
  }));

  const initialAttackerPower = calculateFleetPower(attacker.units);
  const initialDefenderPower = calculateFleetPower(defender.units);

  let attackerRetreated = false;
  let defenderRetreated = false;
  let totalAttackerDamageDealt = 0;
  let totalDefenderDamageDealt = 0;

  while (round < COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS) {
    round++;

    const attackerUnitCount = Object.values(attacker.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );
    const defenderUnitCount = Object.values(defender.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );

    if (attackerUnitCount === 0) {
      battleLog.push("Battle ended: Attacker defeated!");
      break;
    }

    if (defenderUnitCount === 0) {
      battleLog.push("Battle ended: Defender defeated!");
      break;
    }

    const result = simulateCombatRound(attacker, defender, round, attackerReport, defenderReport);

    totalAttackerDamageDealt += result.attackerDamage;
    totalDefenderDamageDealt += result.defenderDamage;

    battleLog.push(result.log);

    let remaining = result.attackerLosses;
    for (const unit of Object.values(attacker.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }

    remaining = result.defenderLosses;
    for (const unit of Object.values(defender.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }

    attackerReport.forEach(r => {
      const unit = attacker.units[r.type];
      r.survivingCount = unit ? (unit as any).count : 0;
    });
    defenderReport.forEach(r => {
      const unit = defender.units[r.type];
      r.survivingCount = unit ? (unit as any).count : 0;
    });

    const currentAttackerPower = calculateFleetPower(attacker.units);
    const currentDefenderPower = calculateFleetPower(defender.units);

    if (calculateRetreatChance(attacker, currentAttackerPower, initialAttackerPower)) {
      attackerRetreated = true;
      battleLog.push("Attacker retreats! Surviving units escape.");
      break;
    }

    if (calculateRetreatChance(defender, currentDefenderPower, initialDefenderPower)) {
      defenderRetreated = true;
      battleLog.push("Defender retreats! Surviving units escape.");
      break;
    }
  }

  if (round >= COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS && !attackerRetreated && !defenderRetreated) {
    battleLog.push("Battle ended: Max rounds reached, attacker victorious!");
  }

  const attackerUnitCount: number = Object.values(attacker.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  ) as number;
  const defenderUnitCount: number = Object.values(defender.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  ) as number;

  let winner: "attacker" | "defender" | "draw";
  if (attackerRetreated) {
    winner = "defender";
  } else if (defenderRetreated) {
    winner = "attacker";
  } else if (attackerUnitCount === 0 && defenderUnitCount === 0) {
    winner = "draw";
  } else if (defenderUnitCount === 0) {
    winner = "attacker";
  } else if (attackerUnitCount === 0) {
    winner = "defender";
  } else {
    winner = attackerUnitCount > defenderUnitCount ? "attacker" : "defender";
  }

  const attackerInitialTotal: number = Object.values(attackerForce.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  ) as number;
  const defenderInitialTotal: number = Object.values(defenderForce.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  ) as number;

  const attackerXP = Math.floor(totalAttackerDamageDealt * 0.01 + (winner === "attacker" ? 100 : 20));
  const defenderXP = Math.floor(totalDefenderDamageDealt * 0.01 + (winner === "defender" ? 100 : 20));

  let plunder = { metal: 0, crystal: 0, deuterium: 0 };
  if (winner === "attacker") {
    const survivingCargo = Object.entries(attacker.units).reduce((sum, [type, unit]) => {
      const stats = COMBAT_CONFIG.UNIT_STATS[type];
      return sum + (unit as any).count * (stats?.cargo || 0);
    }, 0);
    const cargoCapacity = Math.min(survivingCargo, 5000);
    plunder = {
      metal: Math.floor(cargoCapacity * 0.3),
      crystal: Math.floor(cargoCapacity * 0.2),
      deuterium: Math.floor(cargoCapacity * 0.1),
    };
  }

  return {
    winner,
    attackerUnits: attacker.units,
    defenderUnits: defender.units,
    attackerCasualties: attackerInitialTotal - attackerUnitCount,
    defenderCasualties: defenderInitialTotal - defenderUnitCount,
    rounds: round,
    battleLog,
    attackerRetreated,
    defenderRetreated,
    attackerReport,
    defenderReport,
    attackerDamageDealt: totalAttackerDamageDealt,
    defenderDamageDealt: totalDefenderDamageDealt,
    attackerXPGained: attackerXP,
    defenderXPGained: defenderXP,
    plunder,
  };
}

export function calculateVictoryResources(
  defenderResources: { metal: number; crystal: number; deuterium: number },
  winner: string,
  plunder?: { metal: number; crystal: number; deuterium: number }
): { metal: number; crystal: number; deuterium: number } {
  if (plunder) {
    return {
      metal: Math.min(plunder.metal, defenderResources.metal),
      crystal: Math.min(plunder.crystal, defenderResources.crystal),
      deuterium: Math.min(plunder.deuterium, defenderResources.deuterium),
    };
  }

  const plunderRate = 0.3;
  return {
    metal: Math.floor(defenderResources.metal * plunderRate),
    crystal: Math.floor(defenderResources.crystal * plunderRate),
    deuterium: Math.floor(defenderResources.deuterium * plunderRate),
  };
}
