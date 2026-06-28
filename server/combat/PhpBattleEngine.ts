import { BattleUnit, type BattleUnitConfig } from "./BattleUnit";
import { BattleResultData, BattleResultRound, AttackerFleetResult, DefenderFleetResult } from "./BattleResult";
import { collectUnitsMap, fleetUnitsToBattleUnits } from "./fleets";
import { calculateLoot } from "./services/LootService";
import { calculateRepairedDefenses } from "./services/DefenseRepairService";
import { OGameShipDatabase, type OGameShipStats } from "./BattleEngine";
import type { AttackerFleetData, DefenderFleetData } from "./fleets";
import type { PlanetResources } from "./services/LootService";

export interface BattleInput {
  attackers: AttackerFleetData[];
  defenders: DefenderFleetData[];
  defenderResources: PlanetResources;
  lootPercentage?: number;
  debrisFromShipsPercent?: number;
  debrisFromDefensePercent?: number;
  maxMoonChance?: number;
  defenseRepairRate?: number;
  maxRounds?: number;
}

export function simulateBattle(input: BattleInput): BattleResultData {
  const {
    attackers, defenders, defenderResources,
    lootPercentage = 50,
    debrisFromShipsPercent = 30,
    debrisFromDefensePercent = 0,
    maxMoonChance = 20,
    defenseRepairRate = 70,
    maxRounds = 6,
  } = input;

  const primaryAttacker = attackers[0];
  const primaryDefender = defenders[0];

  const attackerWeaponLevel = primaryAttacker.weaponTech;
  const attackerShieldLevel = primaryAttacker.shieldTech;
  const attackerArmorLevel = primaryAttacker.armorTech;
  const defenderWeaponLevel = primaryDefender.weaponTech;
  const defenderShieldLevel = primaryDefender.shieldTech;
  const defenderArmorLevel = primaryDefender.armorTech;

  const attackerUnitsStartMap: Record<string, number> = {};
  const defenderUnitsStartMap: Record<string, number> = {};
  for (const a of attackers) {
    for (const u of a.units) {
      attackerUnitsStartMap[u.config.machineName] = (attackerUnitsStartMap[u.config.machineName] || 0) + u.count;
    }
  }
  for (const d of defenders) {
    for (const u of d.units) {
      defenderUnitsStartMap[u.config.machineName] = (defenderUnitsStartMap[u.config.machineName] || 0) + u.count;
    }
  }

  let attackerUnits: BattleUnit[] = [];
  for (const a of attackers) {
    const bu = fleetUnitsToBattleUnits(a.units, a.fleetMissionId, a.ownerId, a.weaponTech, a.shieldTech, a.armorTech);
    attackerUnits.push(...bu);
  }

  let defenderUnits: BattleUnit[] = [];
  for (const d of defenders) {
    const bu = fleetUnitsToBattleUnits(d.units, d.fleetMissionId, d.ownerId, d.weaponTech, d.shieldTech, d.armorTech);
    defenderUnits.push(...bu);
  }

  const attackerFleetResults: AttackerFleetResult[] = attackers.map(a => ({
    fleetMissionId: a.fleetMissionId,
    ownerId: a.ownerId,
    unitsStart: collectUnitsMap(fleetUnitsToBattleUnits(a.units, a.fleetMissionId, a.ownerId, a.weaponTech, a.shieldTech, a.armorTech)),
    unitsResult: { ...attackerUnitsStartMap },
    unitsLost: {},
    resourceLoss: { metal: 0, crystal: 0, deuterium: 0 },
    completelyDestroyed: false,
  }));

  const defenderFleetResults: DefenderFleetResult[] = defenders.map(d => ({
    fleetMissionId: d.fleetMissionId,
    ownerId: d.ownerId,
    unitsStart: collectUnitsMap(fleetUnitsToBattleUnits(d.units, d.fleetMissionId, d.ownerId, d.weaponTech, d.shieldTech, d.armorTech)),
    unitsResult: { ...defenderUnitsStartMap },
    unitsLost: {},
    completelyDestroyed: false,
  }));

  const rounds: BattleResultRound[] = [];
  let roundNumber = 0;

  const attackerLossesTotal: Record<string, number> = {};
  const defenderLossesTotal: Record<string, number> = {};

  while (roundNumber < maxRounds && attackerUnits.length > 0 && defenderUnits.length > 0) {
    roundNumber++;

    const round: BattleResultRound = {
      roundNumber,
      attackerLossesInRound: {},
      defenderLossesInRound: {},
      attackerLosses: {},
      defenderLosses: {},
      attackerShips: collectUnitsMap(attackerUnits),
      defenderShips: collectUnitsMap(defenderUnits),
      hitsAttacker: 0,
      fullStrengthAttacker: 0,
      absorbedDamageDefender: 0,
      hitsDefender: 0,
      fullStrengthDefender: 0,
      absorbedDamageAttacker: 0,
      attackerLossesPerFleet: {},
      defenderLossesPerFleet: {},
      hitsPerAttackerFleet: {},
      damagePerAttackerFleet: {},
    };

    for (const a of attackers) {
      round.attackerLossesPerFleet[a.fleetMissionId] = {};
      round.hitsPerAttackerFleet[a.fleetMissionId] = 0;
      round.damagePerAttackerFleet[a.fleetMissionId] = 0;
    }

    for (const unit of attackerUnits) {
      let canAttackAgain = true;
      while (canAttackAgain && defenderUnits.length > 0) {
        const targetIndex = Math.floor(Math.random() * defenderUnits.length);
        const target = defenderUnits[targetIndex];

        const damage = unit.attackPower;
        let shieldAbsorption = 0;

        if (damage < 0.01 * target.originalShieldPoints) {
          canAttackAgain = false;
          break;
        }

        if (target.currentShieldPoints > 0) {
          if (damage <= target.currentShieldPoints) {
            shieldAbsorption = damage;
            target.currentShieldPoints -= damage;
          } else {
            shieldAbsorption = target.currentShieldPoints;
            target.currentHullPlating -= (damage - target.currentShieldPoints);
            target.currentShieldPoints = 0;
          }
        } else {
          target.currentHullPlating -= damage;
        }

        if (target.damagedHullExplosion()) {
          target.currentShieldPoints = 0;
          target.currentHullPlating = 0;
        }

        round.hitsAttacker++;
        round.fullStrengthAttacker += damage;
        round.absorbedDamageDefender += shieldAbsorption;

        if (round.hitsPerAttackerFleet[unit.fleetMissionId] !== undefined) {
          round.hitsPerAttackerFleet[unit.fleetMissionId]++;
          round.damagePerAttackerFleet[unit.fleetMissionId] += damage;
        }

        canAttackAgain = unit.didSuccessfulRapidfire(target.config.machineName);
      }
    }

    for (const unit of defenderUnits) {
      let canAttackAgain = true;
      while (canAttackAgain && attackerUnits.length > 0) {
        const targetIndex = Math.floor(Math.random() * attackerUnits.length);
        const target = attackerUnits[targetIndex];

        const damage = unit.attackPower;
        let shieldAbsorption = 0;

        if (damage < 0.01 * target.originalShieldPoints) {
          canAttackAgain = false;
          break;
        }

        if (target.currentShieldPoints > 0) {
          if (damage <= target.currentShieldPoints) {
            shieldAbsorption = damage;
            target.currentShieldPoints -= damage;
          } else {
            shieldAbsorption = target.currentShieldPoints;
            target.currentHullPlating -= (damage - target.currentShieldPoints);
            target.currentShieldPoints = 0;
          }
        } else {
          target.currentHullPlating -= damage;
        }

        if (target.damagedHullExplosion()) {
          target.currentShieldPoints = 0;
          target.currentHullPlating = 0;
        }

        round.hitsDefender++;
        round.fullStrengthDefender += damage;
        round.absorbedDamageAttacker += shieldAbsorption;

        if (round.hitsPerAttackerFleet[target.fleetMissionId] !== undefined) {
          round.hitsPerAttackerFleet[target.fleetMissionId]++;
          round.damagePerAttackerFleet[target.fleetMissionId] += damage;
        }

        canAttackAgain = unit.didSuccessfulRapidfire(target.config.machineName);
      }
    }

    // Cleanup round: remove destroyed units, restore shields
    const newAttackerUnits: BattleUnit[] = [];
    for (const unit of attackerUnits) {
      if (unit.currentHullPlating <= 0) {
        const name = unit.config.machineName;
        round.attackerLossesInRound[name] = (round.attackerLossesInRound[name] || 0) + 1;
        if (round.attackerLossesPerFleet[unit.fleetMissionId]) {
          round.attackerLossesPerFleet[unit.fleetMissionId][name] =
            (round.attackerLossesPerFleet[unit.fleetMissionId][name] || 0) + 1;
        }
      } else {
        unit.currentShieldPoints = unit.originalShieldPoints;
        newAttackerUnits.push(unit);
      }
    }

    const newDefenderUnits: BattleUnit[] = [];
    for (const unit of defenderUnits) {
      if (unit.currentHullPlating <= 0) {
        const name = unit.config.machineName;
        round.defenderLossesInRound[name] = (round.defenderLossesInRound[name] || 0) + 1;
      } else {
        unit.currentShieldPoints = unit.originalShieldPoints;
        newDefenderUnits.push(unit);
      }
    }

    attackerUnits = newAttackerUnits;
    defenderUnits = newDefenderUnits;

    // Accumulate losses
    for (const [name, count] of Object.entries(round.attackerLossesInRound)) {
      attackerLossesTotal[name] = (attackerLossesTotal[name] || 0) + count;
    }
    for (const [name, count] of Object.entries(round.defenderLossesInRound)) {
      defenderLossesTotal[name] = (defenderLossesTotal[name] || 0) + count;
    }

    round.attackerLosses = { ...attackerLossesTotal };
    round.defenderLosses = { ...defenderLossesTotal };
    round.attackerShips = collectUnitsMap(attackerUnits);
    round.defenderShips = collectUnitsMap(defenderUnits);

    rounds.push(round);
  }

  // Calculate results
  const attackerUnitsResultMap = collectUnitsMap(attackerUnits);
  const defenderUnitsResultMap = collectUnitsMap(defenderUnits);

  // Per-fleet results
  for (const fr of attackerFleetResults) {
    fr.unitsResult = {};
    for (const unit of attackerUnits) {
      if (unit.fleetMissionId === fr.fleetMissionId) {
        const name = unit.config.machineName;
        fr.unitsResult[name] = (fr.unitsResult[name] || 0) + 1;
      }
    }
    fr.unitsLost = { ...fr.unitsStart };
    for (const [name, count] of Object.entries(fr.unitsResult)) {
      fr.unitsLost[name] = Math.max(0, (fr.unitsLost[name] || 0) - count);
    }
    fr.completelyDestroyed = Object.values(fr.unitsResult).reduce((a, b) => a + b, 0) === 0;
    fr.resourceLoss = calculateResourceLoss(fr.unitsLost);
  }

  for (const fr of defenderFleetResults) {
    fr.unitsResult = {};
    for (const unit of defenderUnits) {
      if (unit.fleetMissionId === fr.fleetMissionId) {
        const name = unit.config.machineName;
        fr.unitsResult[name] = (fr.unitsResult[name] || 0) + 1;
      }
    }
    fr.unitsLost = { ...fr.unitsStart };
    for (const [name, count] of Object.entries(fr.unitsResult)) {
      fr.unitsLost[name] = Math.max(0, (fr.unitsLost[name] || 0) - count);
    }
    fr.completelyDestroyed = Object.values(fr.unitsResult).reduce((a, b) => a + b, 0) === 0;
  }

  const attackerUnitsLost: Record<string, number> = {};
  for (const [name, count] of Object.entries(attackerUnitsStartMap)) {
    const remaining = attackerUnitsResultMap[name] || 0;
    attackerUnitsLost[name] = Math.max(0, count - remaining);
  }

  const defenderUnitsLost: Record<string, number> = {};
  for (const [name, count] of Object.entries(defenderUnitsStartMap)) {
    const remaining = defenderUnitsResultMap[name] || 0;
    defenderUnitsLost[name] = Math.max(0, count - remaining);
  }

  const attackerResourceLoss = calculateResourceLoss(attackerUnitsLost);
  const defenderResourceLoss = calculateResourceLoss(defenderUnitsLost);

  const repairedDefenses = calculateRepairedDefenses(defenderUnitsLost, defenseRepairRate);

  const permanentlyLost = { ...defenderUnitsLost };
  for (const [name, count] of Object.entries(repairedDefenses)) {
    permanentlyLost[name] = Math.max(0, (permanentlyLost[name] || 0) - count);
  }

  const debris = calculateDebris(attackerUnitsLost, permanentlyLost, debrisFromShipsPercent, debrisFromDefensePercent);
  const wreckField = calculateWreckField(defenderUnitsLost, defenderUnitsStartMap);

  const defenderHasMoon = false; // simplified
  let moonChance = 0;
  let moonCreated = false;

  if (!defenderHasMoon) {
    moonChance = calculateMoonChance(debris, maxMoonChance);
    moonCreated = rollMoonCreation(moonChance);
  }

  let winner: "attacker" | "defender" | "draw" = "draw";
  if (defenderUnits.length === 0 && attackerUnits.length > 0) {
    winner = "attacker";
  } else if (attackerUnits.length === 0 && defenderUnits.length > 0) {
    winner = "defender";
  }

  // Calculate loot if attacker wins
  let loot: PlanetResources = { metal: 0, crystal: 0, deuterium: 0 };
  if (winner === "attacker") {
    const totalCargo = calculateTotalCargo(attackerUnits);
    loot = calculateLoot(defenderResources, lootPercentage, totalCargo);
  }

  return {
    winner,
    attackerUnitsStart: { ...attackerUnitsStartMap },
    attackerUnitsResult: { ...attackerUnitsResultMap },
    attackerUnitsLost,
    attackerResourceLoss,
    defenderUnitsStart: { ...defenderUnitsStartMap },
    defenderUnitsResult: { ...defenderUnitsResultMap },
    defenderUnitsLost,
    defenderResourceLoss,
    loot,
    debris,
    wreckField,
    moonChance,
    moonCreated,
    moonExisted: defenderHasMoon,
    repairedDefenses,
    attackerWeaponLevel,
    attackerShieldLevel,
    attackerArmorLevel,
    defenderWeaponLevel,
    defenderShieldLevel,
    defenderArmorLevel,
    lootPercentage,
    rounds,
    roundCount: rounds.length,
    hamillManoeuvreTriggered: false,
    attackerFleetResults,
    defenderFleetResults,
  };
}

function calculateResourceLoss(units: Record<string, number>): { metal: number; crystal: number; deuterium: number } {
  let metal = 0, crystal = 0, deuterium = 0;
  for (const [name, count] of Object.entries(units)) {
    const stats = OGameShipDatabase[name];
    if (stats) {
      metal += stats.metalCost * count;
      crystal += stats.crystalCost * count;
      deuterium += stats.deuteriumCost * count;
    }
  }
  return { metal, crystal, deuterium };
}

function calculateDebris(
  attackerLost: Record<string, number>,
  defenderLost: Record<string, number>,
  shipsPercent: number,
  defensePercent: number,
): { metal: number; crystal: number; deuterium: number } {
  let metal = 0, crystal = 0, deuterium = 0;

  const all: Record<string, number> = {};
  for (const [name, count] of Object.entries(attackerLost)) all[name] = (all[name] || 0) + count;
  for (const [name, count] of Object.entries(defenderLost)) all[name] = (all[name] || 0) + count;

  for (const [name, count] of Object.entries(all)) {
    const stats = OGameShipDatabase[name];
    if (!stats) continue;

    const pct = stats.unitType === "ship" ? shipsPercent : defensePercent;
    if (pct <= 0) continue;

    metal += Math.floor(stats.metalCost * count * (pct / 100));
    crystal += Math.floor(stats.crystalCost * count * (pct / 100));
    deuterium += Math.floor(stats.deuteriumCost * count * (pct / 100));
  }

  return { metal, crystal, deuterium };
}

function calculateWreckField(
  defenderLost: Record<string, number>,
  defenderStart: Record<string, number>,
): { formed: boolean; ships: Array<{ machineName: string; quantity: number }>; totalValue: number } {
  const wreckPct = 0.7; // 100% - debris% = 70% goes to wreck field
  const ships: Array<{ machineName: string; quantity: number }> = [];
  let totalLostValue = 0;
  let totalStartValue = 0;

  for (const [name, count] of Object.entries(defenderLost)) {
    const stats = OGameShipDatabase[name];
    if (!stats || stats.unitType !== "ship") continue;
    if (name === "espionageProbe" || name === "solarSatellite") continue;

    const wreckCount = Math.floor(count * wreckPct);
    if (wreckCount > 0) {
      ships.push({ machineName: stats.machineName, quantity: wreckCount });
    }

    totalLostValue += (stats.metalCost + stats.crystalCost + stats.deuteriumCost) * count;
  }

  for (const [name, count] of Object.entries(defenderStart)) {
    const stats = OGameShipDatabase[name];
    if (!stats || stats.unitType !== "ship") continue;
    totalStartValue += (stats.metalCost + stats.crystalCost + stats.deuteriumCost) * count;
  }

  if (totalStartValue > 0) {
    const destroyedPct = (totalLostValue / totalStartValue) * 100;
    if (totalLostValue >= 100000 && destroyedPct >= 50) {
      return {
        formed: true,
        ships,
        totalValue: Math.floor(totalLostValue * wreckPct),
      };
    }
  }

  return { formed: false, ships: [], totalValue: 0 };
}

function calculateMoonChance(
  debris: { metal: number; crystal: number; deuterium: number },
  maxChance: number,
): number {
  const totalDebris = debris.metal + debris.crystal + debris.deuterium;
  return Math.min(maxChance, Math.floor(totalDebris / 100000));
}

function rollMoonCreation(chance: number): boolean {
  return Math.random() * 100 < chance;
}

function calculateTotalCargo(units: BattleUnit[]): number {
  let total = 0;
  for (const u of units) {
    total += u.config.cargoCapacity;
  }
  return total;
}
