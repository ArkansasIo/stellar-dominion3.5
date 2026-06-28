// Advanced Combat Engine System for Stellar Dominion MMORPG
// Turn-based real-time combat with detailed mechanics, armor, shields, and tactics

export type ShipType = "scout" | "fighter" | "cruiser" | "battleship" | "carrier" | "support";
export type WeaponType = "laser" | "plasma" | "missile" | "railgun" | "ion";
export type ArmorType = "standard" | "reinforced" | "ceramic" | "composite" | "quantum";

interface Ship {
  id: string;
  type: ShipType;
  owner: string;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  armor: number;
  armorType: ArmorType;
  attack: number;
  weapon: WeaponType;
  speed: number;
  evasion: number; // 0-100%
  crew: number;
  position?: { x: number; y: number };
}

interface CombatTurn {
  turn: number;
  timestamp: number;
  actions: ShipAction[];
  log: string[];
}

interface ShipAction {
  shipId: string;
  action: "attack" | "defend" | "repair" | "rally" | "flee";
  targetId?: string;
  effectiveness: number; // 0-100%
}

interface CombatResult {
  winner: "attacker" | "defender" | "draw";
  totalTurns: number;
  attackerLosses: { ships: number; metalWorth: number; crewLoss: number };
  defenderLosses: { ships: number; metalWorth: number; crewLoss: number };
  debris: { metal: number; crystal: number };
  loot: { metal: number; crystal: number; deuterium: number };
  turns: CombatTurn[];
}

// Ship database with detailed stats
const SHIP_DATABASE: Record<ShipType, Omit<Ship, "id" | "owner" | "position">> = {
  scout: {
    type: "scout",
    health: 400,
    maxHealth: 400,
    shield: 100,
    maxShield: 100,
    armor: 20,
    armorType: "standard",
    attack: 50,
    weapon: "laser",
    speed: 100,
    evasion: 25,
    crew: 10
  },
  fighter: {
    type: "fighter",
    health: 800,
    maxHealth: 800,
    shield: 200,
    maxShield: 200,
    armor: 50,
    armorType: "reinforced",
    attack: 150,
    weapon: "plasma",
    speed: 80,
    evasion: 15,
    crew: 30
  },
  cruiser: {
    type: "cruiser",
    health: 2000,
    maxHealth: 2000,
    shield: 500,
    maxShield: 500,
    armor: 120,
    armorType: "ceramic",
    attack: 400,
    weapon: "missile",
    speed: 50,
    evasion: 8,
    crew: 100
  },
  battleship: {
    type: "battleship",
    health: 5000,
    maxHealth: 5000,
    shield: 1200,
    maxShield: 1200,
    armor: 300,
    armorType: "composite",
    attack: 1000,
    weapon: "railgun",
    speed: 30,
    evasion: 3,
    crew: 300
  },
  carrier: {
    type: "carrier",
    health: 3000,
    maxHealth: 3000,
    shield: 800,
    maxShield: 800,
    armor: 150,
    armorType: "composite",
    attack: 200,
    weapon: "ion",
    speed: 40,
    evasion: 5,
    crew: 200
  },
  support: {
    type: "support",
    health: 1000,
    maxHealth: 1000,
    shield: 400,
    maxShield: 400,
    armor: 80,
    armorType: "reinforced",
    attack: 50,
    weapon: "laser",
    speed: 60,
    evasion: 10,
    crew: 50
  }
};

// Weapon effectiveness table (attacker vs armor)
const WEAPON_EFFECTIVENESS: Record<WeaponType, Record<ArmorType, number>> = {
  laser: { standard: 1.0, reinforced: 0.8, ceramic: 1.2, composite: 0.9, quantum: 0.7 },
  plasma: { standard: 1.2, reinforced: 1.0, ceramic: 0.8, composite: 1.1, quantum: 0.9 },
  missile: { standard: 0.9, reinforced: 1.1, ceramic: 1.0, composite: 1.2, quantum: 0.8 },
  railgun: { standard: 1.3, reinforced: 1.0, ceramic: 0.9, composite: 1.0, quantum: 1.1 },
  ion: { standard: 0.8, reinforced: 0.9, ceramic: 1.1, composite: 0.7, quantum: 1.3 }
};

export class CombatEngine {
  private ships: Map<string, Ship> = new Map();
  private attackerFleet: Set<string> = new Set();
  private defenderFleet: Set<string> = new Set();
  private turns: CombatTurn[] = [];
  private maxTurns: number = 10;
  private currentTurn: number = 0;

  addShip(ship: Ship, isAttacker: boolean): void {
    this.ships.set(ship.id, ship);
    if (isAttacker) {
      this.attackerFleet.add(ship.id);
    } else {
      this.defenderFleet.add(ship.id);
    }
  }

  private calculateDamage(
    attacker: Ship,
    defender: Ship,
    baseAttack: number
  ): { shieldDamage: number; armorDamage: number; hullDamage: number } {
    // Evasion check
    const evasionChance = Math.random() * 100;
    if (evasionChance < defender.evasion) {
      return { shieldDamage: 0, armorDamage: 0, hullDamage: 0 };
    }

    // Base damage with accuracy
    const accuracy = 0.9 + Math.random() * 0.1; // 90-100%
    let baseDamage = baseAttack * accuracy;

    // Weapon effectiveness multiplier
    const effectiveness = WEAPON_EFFECTIVENESS[attacker.weapon][defender.armorType];
    baseDamage *= effectiveness;

    // Add random variance (±15%)
    const variance = 0.85 + Math.random() * 0.3;
    baseDamage *= variance;

    // Distribute damage: shields first, then armor, then hull
    let shieldDamage = Math.min(baseDamage, defender.shield);
    const remainingDamage = baseDamage - shieldDamage;

    let armorDamage = Math.min(remainingDamage * 0.5, defender.armor);
    let hullDamage = Math.max(0, remainingDamage - armorDamage);

    return { shieldDamage, armorDamage, hullDamage };
  }

  private selectTarget(fleet: Set<string>, ignoreId?: string): string | null {
    const availableTargets = Array.from(fleet).filter(id => {
      const ship = this.ships.get(id);
      return ship && ship.health > 0 && id !== ignoreId;
    });

    if (availableTargets.length === 0) return null;

    // Target prioritization: highest threat first
    let bestTarget = availableTargets[0];
    let bestThreat = 0;

    for (let i = 0; i < availableTargets.length; i++) {
      const id = availableTargets[i];
      const ship = this.ships.get(id)!;
      const threat = ship.attack * (ship.health / ship.maxHealth);
      if (threat > bestThreat) {
        bestThreat = threat;
        bestTarget = id;
      }
    }

    return bestTarget;
  }

  private executeTurn(): { completed: boolean; log: string[] } {
    const log: string[] = [];
    this.currentTurn++;

    const actions: ShipAction[] = [];

    // Attackers attack
    const attackerArray = Array.from(this.attackerFleet);
    for (let i = 0; i < attackerArray.length; i++) {
      const attackerId = attackerArray[i];
      const attacker = this.ships.get(attackerId);
      if (!attacker || attacker.health <= 0) continue;

      const targetId = this.selectTarget(this.defenderFleet);
      if (!targetId) continue;

      const target = this.ships.get(targetId)!;
      const damage = this.calculateDamage(attacker, target, attacker.attack);

      // Apply damage
      target.shield -= damage.shieldDamage;
      target.armor -= damage.armorDamage;
      target.health -= damage.hullDamage;

      // Shield recharges 10% per turn
      target.shield = Math.min(target.shield + target.maxShield * 0.1, target.maxShield);

      const totalDamage = damage.shieldDamage + damage.armorDamage + damage.hullDamage;
      log.push(
        `${attacker.type.toUpperCase()} attacks ${target.type.toUpperCase()}: ${Math.round(totalDamage)} damage (S:${Math.round(damage.shieldDamage)}, A:${Math.round(damage.armorDamage)}, H:${Math.round(damage.hullDamage)})`
      );

      actions.push({ shipId: attackerId, action: "attack", targetId, effectiveness: Math.min(100, (totalDamage / attacker.attack) * 100) });
    }

    // Defenders attack
    const defenderArray = Array.from(this.defenderFleet);
    for (let i = 0; i < defenderArray.length; i++) {
      const defenderId = defenderArray[i];
      const defender = this.ships.get(defenderId);
      if (!defender || defender.health <= 0) continue;

      const targetId = this.selectTarget(this.attackerFleet);
      if (!targetId) continue;

      const target = this.ships.get(targetId)!;
      const damage = this.calculateDamage(defender, target, defender.attack);

      target.shield -= damage.shieldDamage;
      target.armor -= damage.armorDamage;
      target.health -= damage.hullDamage;

      target.shield = Math.min(target.shield + target.maxShield * 0.1, target.maxShield);

      const totalDamage = damage.shieldDamage + damage.armorDamage + damage.hullDamage;
      log.push(
        `${defender.type.toUpperCase()} attacks ${target.type.toUpperCase()}: ${Math.round(totalDamage)} damage`
      );

      actions.push({ shipId: defenderId, action: "attack", targetId, effectiveness: Math.min(100, (totalDamage / defender.attack) * 100) });
    }

    // Remove destroyed ships
    const shipsArray = Array.from(this.ships.entries());
    for (let i = 0; i < shipsArray.length; i++) {
      const [id, ship] = shipsArray[i];
      if (ship.health <= 0) {
        this.attackerFleet.delete(id);
        this.defenderFleet.delete(id);
        log.push(`${ship.type.toUpperCase()} ${id} DESTROYED`);
      }
    }

    const turn: CombatTurn = {
      turn: this.currentTurn,
      timestamp: Date.now(),
      actions,
      log
    };

    this.turns.push(turn);

    const combatOver =
      this.currentTurn >= this.maxTurns ||
      this.attackerFleet.size === 0 ||
      this.defenderFleet.size === 0;

    return { completed: combatOver, log };
  }

  private calculateLosses(fleet: Set<string>): {
    ships: number;
    metalWorth: number;
    crewLoss: number;
  } {
    let ships = 0;
    let metalWorth = 0;
    let crewLoss = 0;

    const fleetArray = Array.from(fleet);
    for (let i = 0; i < fleetArray.length; i++) {
      const id = fleetArray[i];
      const ship = this.ships.get(id);
      if (ship && ship.health <= 0) {
        ships++;
        metalWorth += ship.maxHealth * 3; // Rough material worth
        crewLoss += ship.crew;
      }
    }

    return { ships, metalWorth, crewLoss };
  }

  simulateCombat(): CombatResult {
    let combatLog: string[] = ["=== COMBAT INITIATED ==="];
    combatLog.push(`Attackers: ${this.attackerFleet.size} ships vs Defenders: ${this.defenderFleet.size} ships`);

    // Run combat turns
    while (this.currentTurn < this.maxTurns && this.attackerFleet.size > 0 && this.defenderFleet.size > 0) {
      const { completed, log } = this.executeTurn();
      combatLog.push(...log);
      if (completed) break;
    }

    // Determine winner
    let winner: "attacker" | "defender" | "draw" = "draw";
    if (this.attackerFleet.size > 0 && this.defenderFleet.size === 0) {
      winner = "attacker";
      combatLog.push("🎖️ ATTACKER VICTORY!");
    } else if (this.defenderFleet.size > 0 && this.attackerFleet.size === 0) {
      winner = "defender";
      combatLog.push("🛡️ DEFENDER VICTORY!");
    } else {
      combatLog.push("⚔️ STALEMATE - Combat inconclusive");
    }

    // Calculate losses
    const attackerLosses = this.calculateLosses(this.attackerFleet.size === 0 ? new Set(this.ships.keys()) : this.attackerFleet);
    const defenderLosses = this.calculateLosses(this.defenderFleet.size === 0 ? new Set(this.ships.keys()) : this.defenderFleet);

    // Generate debris
    const debrisMetal = Math.round((attackerLosses.metalWorth + defenderLosses.metalWorth) * 0.3);
    const debrisCrystal = Math.round((attackerLosses.metalWorth + defenderLosses.metalWorth) * 0.1);

    // Generate loot
    const lootMetal = defenderLosses.metalWorth > 0 ? Math.round(defenderLosses.metalWorth * 0.2) : 0;
    const lootCrystal = defenderLosses.metalWorth > 0 ? Math.round(defenderLosses.metalWorth * 0.1) : 0;
    const lootDeuterium = defenderLosses.metalWorth > 0 ? Math.round(defenderLosses.metalWorth * 0.05) : 0;

    return {
      winner,
      totalTurns: this.currentTurn,
      attackerLosses,
      defenderLosses,
      debris: { metal: debrisMetal, crystal: debrisCrystal },
      loot: { metal: lootMetal, crystal: lootCrystal, deuterium: lootDeuterium },
      turns: this.turns
    };
  }
}

export function createCombat(): CombatEngine {
  return new CombatEngine();
}

export function getShipStats(type: ShipType): Omit<Ship, "id" | "owner" | "position"> {
  return SHIP_DATABASE[type];
}

export function createShip(
  id: string,
  type: ShipType,
  owner: string
): Ship {
  const baseStats = SHIP_DATABASE[type];
  return {
    id,
    type,
    owner,
    health: baseStats.maxHealth,
    maxHealth: baseStats.maxHealth,
    shield: baseStats.maxShield,
    maxShield: baseStats.maxShield,
    armor: baseStats.armor,
    armorType: baseStats.armorType,
    attack: baseStats.attack,
    weapon: baseStats.weapon,
    speed: baseStats.speed,
    evasion: baseStats.evasion,
    crew: baseStats.crew
  };
}
