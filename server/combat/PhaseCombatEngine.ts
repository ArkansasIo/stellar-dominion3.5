import { OGameShipDatabase, OGameShipStats } from './BattleEngine';

interface FleetComposition {
  [shipId: string]: number;
}

interface CombatFleet {
  ships: FleetComposition;
  commander?: { id: string; name: string; bonuses: Record<string, number> };
  technology: Record<string, number>;
}

interface PhaseCombatResult {
  winner: 'attacker' | 'defender' | 'draw';
  attackerLosses: FleetComposition;
  defenderLosses: FleetComposition;
  phases: PhaseLog[];
  salvage: { metal: number; crystal: number };
  boardingResult?: { success: boolean; prisoners: number; intelGained: string[] };
}

interface PhaseLog {
  phase: string;
  attackerDamage: number;
  defenderDamage: number;
  attackerLosses: FleetComposition;
  defenderLosses: FleetComposition;
  summary: string;
}

interface CombatShip {
  stats: OGameShipStats;
  count: number;
  effectiveAttack: number;
  effectiveShield: number;
  effectiveHull: number;
  isCapital: boolean;
  isFighter: boolean;
}

const CAPITAL_SHIPS = new Set(['dreadnought', 'titan', 'flagship', 'carrier', 'battleship', 'deathstar']);
const FIGHTER_SHIPS = new Set(['lightFighter', 'heavyFighter', 'interceptor']);
const SUPPORT_SHIPS = new Set(['smallCargo', 'largeCargo', 'recycler', 'colonyShip', 'repairShip', 'constructionShip', 'hospitalShip']);

function getCombatShips(fleet: FleetComposition, techBonuses: Record<string, number>): CombatShip[] {
  const ships: CombatShip[] = [];
  for (const [shipId, count] of Object.entries(fleet)) {
    if (count <= 0) continue;
    const stats = OGameShipDatabase[shipId];
    if (!stats) continue;
    const weaponTech = (techBonuses.weaponsTech || 0) * 0.05;
    const shieldTech = (techBonuses.shieldingTech || 0) * 0.05;
    const armorTech = (techBonuses.armourTech || 0) * 0.03;
    ships.push({
      stats,
      count,
      effectiveAttack: stats.attack * (1 + weaponTech),
      effectiveShield: stats.shield * (1 + shieldTech),
      effectiveHull: stats.structuralIntegrity * (1 + armorTech),
      isCapital: CAPITAL_SHIPS.has(shipId),
      isFighter: FIGHTER_SHIPS.has(shipId),
    });
  }
  return ships;
}

function calculateFleetPower(ships: CombatShip[]): { totalAttack: number; totalShield: number; totalHull: number } {
  let totalAttack = 0, totalShield = 0, totalHull = 0;
  for (const ship of ships) {
    totalAttack += ship.effectiveAttack * ship.count;
    totalShield += ship.effectiveShield * ship.count;
    totalHull += ship.effectiveHull * ship.count;
  }
  return { totalAttack, totalShield, totalHull };
}

function applyDamage(ships: CombatShip[], damage: number): FleetComposition {
  const losses: FleetComposition = {};
  let remainingDamage = damage;

  for (const ship of ships) {
    if (remainingDamage <= 0 || ship.count <= 0) continue;
    const shipEHP = ship.effectiveShield + ship.effectiveHull;
    const shipsCanDestroy = Math.min(ship.count, Math.floor(remainingDamage / Math.max(1, shipEHP)));
    if (shipsCanDestroy > 0) {
      losses[ship.stats.id] = (losses[ship.stats.id] || 0) + shipsCanDestroy;
      ship.count -= shipsCanDestroy;
      remainingDamage -= shipsCanDestroy * shipEHP;
    }
  }
  return losses;
}

function totalShips(fleet: FleetComposition): number {
  return Object.values(fleet).reduce((a, b) => a + b, 0);
}

function phaseDamageMultiplier(phase: string, ship: CombatShip): number {
  switch (phase) {
    case 'detection': return 0.1;
    case 'long-range': return ship.isCapital ? 1.5 : 0.5;
    case 'missile': return 1.0;
    case 'fighter': return ship.isFighter ? 1.3 : 0.7;
    case 'capital': return ship.isCapital ? 1.5 : 0.8;
    case 'boarding': return 0.3;
    case 'retreat': return 0.2;
    case 'salvage': return 0;
    default: return 1.0;
  }
}

export function runPhaseCombat(
  attacker: CombatFleet,
  defender: CombatFleet,
  options: { maxRounds?: number; allowRetreat?: boolean } = {}
): PhaseCombatResult {
  const maxRounds = options.maxRounds || 6;
  const phases: PhaseLog[] = [];

  const attackShips = getCombatShips(attacker.ships, attacker.technology);
  const defendShips = getCombatShips(defender.ships, defender.technology);

  const attackerBonus = attacker.commander ? (attacker.commander.bonuses.combat || 1.0) : 1.0;
  const defenderBonus = defender.commander ? (defender.commander.bonuses.combat || 1.0) : 1.0;

  const phaseOrder = ['detection', 'long-range', 'missile', 'fighter', 'capital', 'boarding'];

  for (let round = 0; round < maxRounds; round++) {
    for (const phase of phaseOrder) {
      const attPower = calculateFleetPower(attackShips);
      const defPower = calculateFleetPower(defendShips);

      if (attPower.totalHull <= 0 || defPower.totalHull <= 0) break;

      const attMult = phaseDamageMultiplier(phase, { isCapital: false, isFighter: false } as CombatShip) * attackerBonus;
      const defMult = phaseDamageMultiplier(phase, { isCapital: false, isFighter: false } as CombatShip) * defenderBonus;

      let attPhaseDamage = 0, defPhaseDamage = 0;

      for (const ship of attackShips) {
        if (ship.count <= 0) continue;
        const mult = phaseDamageMultiplier(phase, ship);
        attPhaseDamage += ship.effectiveAttack * ship.count * mult * attMult;
      }
      for (const ship of defendShips) {
        if (ship.count <= 0) continue;
        const mult = phaseDamageMultiplier(phase, ship);
        defPhaseDamage += ship.effectiveAttack * ship.count * mult * defMult;
      }

      const attLosses = applyDamage(attackShips, defPhaseDamage);
      const defLosses = applyDamage(defendShips, attPhaseDamage);

      phases.push({
        phase,
        attackerDamage: attPhaseDamage,
        defenderDamage: defPhaseDamage,
        attackerLosses: attLosses,
        defenderLosses: defLosses,
        summary: `${phase} phase: Attacker deals ${Math.round(attPhaseDamage)} damage, Defender deals ${Math.round(defPhaseDamage)} damage`,
      });
    }

    const attPower = calculateFleetPower(attackShips);
    const defPower = calculateFleetPower(defendShips);
    if (attPower.totalHull <= 0 || defPower.totalHull <= 0) break;

    if (options.allowRetreat && round >= 2) {
      const attRatio = attPower.totalHull / (attPower.totalHull + defPower.totalHull);
      if (attRatio < 0.2) {
        phases.push({ phase: 'retreat', attackerDamage: 0, defenderDamage: 0, attackerLosses: {}, defenderLosses: {}, summary: 'Attacker retreats from battle' });
        break;
      }
    }
  }

  const finalAttPower = calculateFleetPower(attackShips);
  const finalDefPower = calculateFleetPower(defendShips);

  let winner: 'attacker' | 'defender' | 'draw';
  if (finalAttPower.totalHull <= 0 && finalDefPower.totalHull <= 0) winner = 'draw';
  else if (finalDefPower.totalHull <= 0) winner = 'attacker';
  else if (finalAttPower.totalHull <= 0) winner = 'defender';
  else winner = finalAttPower.totalHull > finalDefPower.totalHull ? 'attacker' : 'defender';

  const totalAttackerLosses: FleetComposition = {};
  const totalDefenderLosses: FleetComposition = {};
  for (const p of phases) {
    for (const [id, count] of Object.entries(p.attackerLosses)) {
      totalAttackerLosses[id] = (totalAttackerLosses[id] || 0) + count;
    }
    for (const [id, count] of Object.entries(p.defenderLosses)) {
      totalDefenderLosses[id] = (totalDefenderLosses[id] || 0) + count;
    }
  }

  let salvageMetal = 0, salvageCrystal = 0;
  for (const [id, count] of Object.entries(totalDefenderLosses)) {
    const stats = OGameShipDatabase[id];
    if (stats) {
      salvageMetal += Math.floor(stats.metalCost * count * 0.3);
      salvageCrystal += Math.floor(stats.crystalCost * count * 0.3);
    }
  }

  phases.push({ phase: 'salvage', attackerDamage: 0, defenderDamage: 0, attackerLosses: {}, defenderLosses: {}, summary: `Salvage recovered: ${salvageMetal} metal, ${salvageCrystal} crystal` });

  return {
    winner,
    attackerLosses: totalAttackerLosses,
    defenderLosses: totalDefenderLosses,
    phases,
    salvage: { metal: salvageMetal, crystal: salvageCrystal },
    boardingResult: winner === 'attacker' ? { success: true, prisoners: Math.floor(totalShips(totalDefenderLosses) * 0.1), intelGained: [] } : undefined,
  };
}

export function predictBattleOutcome(attacker: CombatFleet, defender: CombatFleet) {
  const attPower = calculateFleetPower(getCombatShips(attacker.ships, attacker.technology));
  const defPower = calculateFleetPower(getCombatShips(defender.ships, defender.technology));
  const powerRatio = attPower.totalAttack / Math.max(1, defPower.totalAttack);
  return {
    attackerPower: attPower,
    defenderPower: defPower,
    powerRatio,
    predictedWinner: powerRatio > 1.3 ? 'attacker' : powerRatio < 0.7 ? 'defender' : 'unknown',
  };
}
