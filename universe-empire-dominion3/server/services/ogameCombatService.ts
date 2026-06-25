import {
  weaponPower,
  shieldPower,
  hullHp,
  shieldDamageAfterAbsorption,
  explosionChance,
  rapidFireCheck,
  debrisFromShip,
  moonChance,
  moonDiameter,
  defenseRepairChance,
  BATTLE_MAX_ROUND,
} from "../../shared/config/ogameFormulas";

export interface CombatShip {
  id: string;
  count: number;
  baseAttack: number;
  baseShield: number;
  baseStructure: number;
  metalCost: number;
  crystalCost: number;
  rapidFire: Record<string, number>;
}

export interface CombatFleet {
  ships: CombatShip[];
  weaponTech: number;
  shieldTech: number;
  armourTech: number;
}

export interface RoundResult {
  round: number;
  attacks: {
    shipId: string;
    targetId: string;
    shots: number;
    hits: number;
    damageDealt: number;
    shipsDestroyed: number;
  }[];
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
}

export interface CombatResult {
  winner: "attacker" | "defender" | "draw";
  rounds: RoundResult[];
  debris: { metal: number; crystal: number };
  moonChance: number;
  moonDiameter: number;
  attackerRemaining: Record<string, number>;
  defenderRemaining: Record<string, number>;
  defenderRepaired: Record<string, number>;
}

interface ShipState {
  config: CombatShip;
  hull: number;
  shield: number;
  count: number;
  destroyed: number;
}

function initShipState(ship: CombatShip, weaponTech: number, shieldTech: number, armourTech: number): ShipState {
  return {
    config: ship,
    hull: hullHp(ship.baseStructure, armourTech),
    shield: shieldPower(ship.baseShield, shieldTech),
    count: ship.count,
    destroyed: 0,
  };
}

export class OgameCombatService {
  resolveBattle(attacker: CombatFleet, defender: CombatFleet): CombatResult {
    const aShips: ShipState[] = attacker.ships.map(s => initShipState(s, attacker.weaponTech, attacker.shieldTech, attacker.armourTech));
    const dShips: ShipState[] = defender.ships.map(s => initShipState(s, defender.weaponTech, defender.shieldTech, defender.armourTech));

    const rounds: RoundResult[] = [];
    let totalDebrisMetal = 0;
    let totalDebrisCrystal = 0;

    for (let round = 1; round <= BATTLE_MAX_ROUND; round++) {
      const roundResult: RoundResult = {
        round,
        attacks: [],
        attackerLosses: {},
        defenderLosses: {},
      };

      this.resolveRound(aShips, dShips, attacker.weaponTech, roundResult, "attacker");
      this.resolveRound(dShips, aShips, defender.weaponTech, roundResult, "defender");

      // Collect debris
      for (const ship of aShips) {
        if (ship.destroyed > 0) {
          const d = debrisFromShip(ship.config.metalCost, ship.config.crystalCost, ship.destroyed, 30);
          totalDebrisMetal += d.metal;
          totalDebrisCrystal += d.crystal;
          roundResult.attackerLosses[ship.config.id] = (roundResult.attackerLosses[ship.config.id] || 0) + ship.destroyed;
        }
      }
      for (const ship of dShips) {
        if (ship.destroyed > 0) {
          const d = debrisFromShip(ship.config.metalCost, ship.config.crystalCost, ship.destroyed, 30);
          totalDebrisMetal += d.metal;
          totalDebrisCrystal += d.crystal;
          roundResult.defenderLosses[ship.config.id] = (roundResult.defenderLosses[ship.config.id] || 0) + ship.destroyed;
        }
      }

      this.resetShields(aShips, attacker.shieldTech);
      this.resetShields(dShips, defender.shieldTech);

      rounds.push(roundResult);

      const aAlive = aShips.reduce((s, sh) => s + sh.count, 0);
      const dAlive = dShips.reduce((s, sh) => s + sh.count, 0);

      if (aAlive === 0 || dAlive === 0) break;
    }

    const aRemaining: Record<string, number> = {};
    const dRemaining: Record<string, number> = {};
    const dRepaired: Record<string, number> = {};

    for (const ship of aShips) {
      if (ship.count > 0) aRemaining[ship.config.id] = ship.count;
    }
    for (const ship of dShips) {
      if (ship.count > 0) {
        dRemaining[ship.config.id] = ship.count;
        if (defenseRepairChance()) {
          dRepaired[ship.config.id] = ship.destroyed;
        }
      }
    }

    const aAlive = aShips.reduce((s, sh) => s + sh.count, 0);
    const dAlive = dShips.reduce((s, sh) => s + sh.count, 0);

    const chance = moonChance(totalDebrisMetal, totalDebrisCrystal);

    return {
      winner: aAlive > dAlive ? "attacker" : dAlive > aAlive ? "defender" : "draw",
      rounds,
      debris: { metal: totalDebrisMetal, crystal: totalDebrisCrystal },
      moonChance: chance,
      moonDiameter: chance > 0 ? moonDiameter(chance) : 0,
      attackerRemaining: aRemaining,
      defenderRemaining: dRemaining,
      defenderRepaired: dRepaired,
    };
  }

  private resolveRound(
    attackers: ShipState[],
    defenders: ShipState[],
    weaponTech: number,
    roundResult: RoundResult,
    side: string,
  ): void {
    for (const atk of attackers) {
      if (atk.count <= 0) continue;
      const atkPower = weaponPower(atk.config.baseAttack, weaponTech);

      for (let shot = 0; shot < atk.count; shot++) {
        const targets = defenders.filter(d => d.count > 0);
        if (targets.length === 0) break;

        const target = targets[Math.floor(Math.random() * targets.length)];
        const rfValue = target.config.rapidFire[atk.config.id] || 0;

        const { shieldRemaining, overflow } = shieldDamageAfterAbsorption(target.shield, atkPower);
        target.shield = shieldRemaining;

        let shipsDestroyed = 0;
        if (overflow > 0) {
          const hullDamage = Math.max(1, overflow);
          const shipsKilled = Math.min(target.count, Math.floor(hullDamage / Math.max(1, target.hull)));
          target.count -= shipsKilled;
          target.destroyed += shipsKilled;
          shipsDestroyed = shipsKilled;
        }

        roundResult.attacks.push({
          shipId: atk.config.id,
          targetId: target.config.id,
          shots: 1,
          hits: 1,
          damageDealt: atkPower,
          shipsDestroyed,
        });

        const rfTriggers = rfValue > 0 && rapidFireCheck(rfValue);
        if (!rfTriggers) break;
      }
    }
  }

  private resetShields(ships: ShipState[], shieldTech: number): void {
    for (const ship of ships) {
      if (ship.count > 0) {
        ship.shield = shieldPower(ship.config.baseShield, shieldTech);
        ship.destroyed = 0;
      }
    }
  }
}

export const ogameCombatService = new OgameCombatService();
