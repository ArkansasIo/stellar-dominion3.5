/**
 * SHIPYARD & SHIP FITTING SYSTEM
 * ============================================================================
 * Full shipyard with construction, fitting, and fleet management.
 *
 * UML Structure:
 *   Shipyard
 *   ├── ShipClass (Frigate, Destroyer, Cruiser, Battleship, Carrier, Dreadnought)
 *   │   ├── ShipBlueprint
 *   │   │   ├── Hull (HP, Armor, Shield)
 *   │   │   ├── Powergrid (CPU, Power)
 *   │   │   ├── Slots (High, Mid, Low, Rig)
 *   │   │   └── Bonuses (Per-level bonuses)
 *   │   └── FittingTemplate
 *   │       ├── HighSlotModules (Weapons, Rigs)
 *   │       ├── MidSlotModules (Shields, Propulsion)
 *   │       ├── LowSlotModules (Armor, Damage)
 *   │       └── RigSlots (Passive bonuses)
 *   ├── ConstructionQueue
 *   │   ├── Job (ShipType, TimeRemaining, Cost)
 *   │   └── Priority (Queue order)
 *   └── ShipInventory
 *       ├── ActiveShips (In fleet)
 *       ├── HangarShips (Stored)
 *       └── FittedShips (Ready for deployment)
 */

export type ShipSize = 'frigate' | 'destroyer' | 'cruiser' | 'battleship' | 'carrier' | 'dreadnought' | 'titan';

export type SlotType = 'high' | 'mid' | 'low' | 'rig' | 'capacitor' | 'utility';

export type ModuleType =
  | 'weapon' | 'shield' | 'armor' | 'engine' | 'sensor'
  | 'capacitor' | 'repair' | 'buff' | 'utility' | 'rig';

export type WeaponType = 'laser' | 'projectile' | 'missile' | 'hybrid' | 'energy_turret' | 'kinetic_turret' | 'explosive_launcher';

export type DamageType = 'thermal' | 'kinetic' | 'explosive' | 'em';

// ============================================================================
// SHIP CLASS DEFINITIONS
// ============================================================================

export interface ShipSlotLayout {
  highSlots: number;
  midSlots: number;
  lowSlots: number;
  rigSlots: number;
  capacitorSlots: number;
  utilitySlots: number;
}

export interface ShipHullStats {
  baseHp: number;
  baseArmor: number;
  baseShield: number;
  armorResistances: { thermal: number; kinetic: number; explosive: number; em: number };
  shieldResistances: { thermal: number; kinetic: number; explosive: number; em: number };
  signatureRadius: number;
  maxVelocity: number;
  warpSpeed: number;
  agility: number;
  targetingRange: number;
  maxTargets: number;
  cpu: number;
  powergrid: number;
  capacitorCapacity: number;
  capacitorRecharge: number;
}

export interface ShipClassDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: ShipSize;
  tier: number;
  requiredLevel: number;
  requiredResearch: string[];
  buildCost: { metal: number; crystal: number; deuterium: number; credits: number };
  buildTime: number;
  slots: ShipSlotLayout;
  hull: ShipHullStats;
  bonuses: { stat: string; value: number; isPercent: boolean; perLevel: boolean }[];
  specialAbility?: string;
  specialDescription?: string;
  faction: string;
}

export const SHIP_CLASSES: ShipClassDefinition[] = [
  // ── FRIGATES ──
  {
    id: 'frigate_assault', name: 'Assault Frigate', description: 'Fast, agile attack craft.', icon: '🛸',
    size: 'frigate', tier: 1, requiredLevel: 1, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 500, crystal: 200, deuterium: 100, credits: 5000 },
    buildTime: 30, slots: { highSlots: 3, midSlots: 2, lowSlots: 2, rigSlots: 1, capacitorSlots: 0, utilitySlots: 1 },
    hull: { baseHp: 800, baseArmor: 400, baseShield: 300, armorResistances: { thermal: 30, kinetic: 40, explosive: 50, em: 20 }, shieldResistances: { thermal: 20, kinetic: 30, explosive: 10, em: 40 }, signatureRadius: 40, maxVelocity: 350, warpSpeed: 5.0, agility: 0.8, targetingRange: 40, maxTargets: 4, cpu: 120, powergrid: 75, capacitorCapacity: 350, capacitorRecharge: 180 },
    bonuses: [{ stat: 'weaponDamage', value: 5, isPercent: true, perLevel: true }], specialAbility: 'Overdrive', specialDescription: '+50% speed for 10s',
  },
  {
    id: 'frigate_recon', name: 'Recon Frigate', description: 'Stealth recon vessel.', icon: '👻',
    size: 'frigate', tier: 1, requiredLevel: 1, requiredResearch: [], faction: 'shadow',
    buildCost: { metal: 450, crystal: 250, deuterium: 80, credits: 4500 },
    buildTime: 35, slots: { highSlots: 2, midSlots: 3, lowSlots: 2, rigSlots: 1, capacitorSlots: 0, utilitySlots: 1 },
    hull: { baseHp: 600, baseArmor: 300, baseShield: 350, armorResistances: { thermal: 20, kinetic: 30, explosive: 40, em: 30 }, shieldResistances: { thermal: 30, kinetic: 20, explosive: 15, em: 50 }, signatureRadius: 25, maxVelocity: 320, warpSpeed: 6.0, agility: 0.7, targetingRange: 55, maxTargets: 5, cpu: 150, powergrid: 65, capacitorCapacity: 300, capacitorRecharge: 160 },
    bonuses: [{ stat: 'sensorStrength', value: 8, isPercent: true, perLevel: true }], specialAbility: 'Cloak', specialDescription: 'Invisible for 30s',
  },
  {
    id: 'frigate_logistics', name: 'Logistics Frigate', description: 'Small repair vessel.', icon: '💚',
    size: 'frigate', tier: 1, requiredLevel: 1, requiredResearch: [], faction: 'alliance',
    buildCost: { metal: 400, crystal: 300, deuterium: 120, credits: 5500 },
    buildTime: 40, slots: { highSlots: 2, midSlots: 2, lowSlots: 2, rigSlots: 1, capacitorSlots: 1, utilitySlots: 1 },
    hull: { baseHp: 500, baseArmor: 250, baseShield: 400, armorResistances: { thermal: 25, kinetic: 35, explosive: 30, em: 25 }, shieldResistances: { thermal: 35, kinetic: 25, explosive: 20, em: 45 }, signatureRadius: 45, maxVelocity: 280, warpSpeed: 4.5, agility: 0.85, targetingRange: 35, maxTargets: 6, cpu: 130, powergrid: 70, capacitorCapacity: 400, capacitorRecharge: 200 },
    bonuses: [{ stat: 'repairAmount', value: 10, isPercent: true, perLevel: true }], specialAbility: 'Emergency Repair', specialDescription: 'Instantly repair 30% HP',
  },
  {
    id: 'frigate_interceptor', name: 'Interceptor', description: 'Ultra-fast tackle ship.', icon: '⚡',
    size: 'frigate', tier: 2, requiredLevel: 15, requiredResearch: ['tech_advanced_engines'], faction: 'terran',
    buildCost: { metal: 600, crystal: 250, deuterium: 150, credits: 6000 },
    buildTime: 35, slots: { highSlots: 2, midSlots: 3, lowSlots: 2, rigSlots: 1, capacitorSlots: 0, utilitySlots: 1 },
    hull: { baseHp: 550, baseArmor: 200, baseShield: 250, armorResistances: { thermal: 15, kinetic: 25, explosive: 35, em: 20 }, shieldResistances: { thermal: 25, kinetic: 15, explosive: 10, em: 35 }, signatureRadius: 20, maxVelocity: 450, warpSpeed: 7.0, agility: 0.5, targetingRange: 30, maxTargets: 3, cpu: 100, powergrid: 60, capacitorCapacity: 250, capacitorRecharge: 140 },
    bonuses: [{ stat: 'avoidance', value: 12, isPercent: true, perLevel: true }], specialAbility: 'Webifier', specialDescription: 'Reduce target speed by 70%',
  },

  // ── DESTROYERS ──
  {
    id: 'destroyer_assault', name: 'Assault Destroyer', description: 'Anti-frigate specialist.', icon: '🔫',
    size: 'destroyer', tier: 1, requiredLevel: 10, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 1200, crystal: 500, deuterium: 250, credits: 12000 },
    buildTime: 60, slots: { highSlots: 4, midSlots: 3, lowSlots: 3, rigSlots: 2, capacitorSlots: 0, utilitySlots: 1 },
    hull: { baseHp: 1800, baseArmor: 900, baseShield: 700, armorResistances: { thermal: 35, kinetic: 45, explosive: 55, em: 25 }, shieldResistances: { thermal: 25, kinetic: 35, explosive: 15, em: 45 }, signatureRadius: 80, maxVelocity: 280, warpSpeed: 4.5, agility: 0.9, targetingRange: 50, maxTargets: 5, cpu: 180, powergrid: 120, capacitorCapacity: 500, capacitorRecharge: 250 },
    bonuses: [{ stat: 'weaponDamage', value: 8, isPercent: true, perLevel: true }], specialAbility: 'Barrage', specialDescription: 'Fire all weapons simultaneously',
  },
  {
    id: 'destroyer_interdictor', name: 'Interdictor', description: 'Anti-ship specialist with area denial.', icon: '🎯',
    size: 'destroyer', tier: 2, requiredLevel: 20, requiredResearch: ['tech_area_denial'], faction: 'iron',
    buildCost: { metal: 1500, crystal: 600, deuterium: 300, credits: 15000 },
    buildTime: 75, slots: { highSlots: 4, midSlots: 3, lowSlots: 3, rigSlots: 2, capacitorSlots: 1, utilitySlots: 1 },
    hull: { baseHp: 2000, baseArmor: 1000, baseShield: 800, armorResistances: { thermal: 40, kinetic: 50, explosive: 60, em: 30 }, shieldResistances: { thermal: 30, kinetic: 40, explosive: 20, em: 50 }, signatureRadius: 90, maxVelocity: 250, warpSpeed: 4.0, agility: 1.0, targetingRange: 55, maxTargets: 6, cpu: 200, powergrid: 140, capacitorCapacity: 600, capacitorRecharge: 280 },
    bonuses: [{ stat: 'weaponDamage', value: 10, isPercent: true, perLevel: true }], specialAbility: 'Warp Disruption Field', specialDescription: 'Prevent warp in 10km radius',
  },
  {
    id: 'destroyer_command', name: 'Command Destroyer', description: 'Fleet support destroyer.', icon: '📡',
    size: 'destroyer', tier: 2, requiredLevel: 25, requiredResearch: ['tech_fleet_command'], faction: 'free_alliance',
    buildCost: { metal: 1400, crystal: 700, deuterium: 280, credits: 14000 },
    buildTime: 70, slots: { highSlots: 3, midSlots: 4, lowSlots: 3, rigSlots: 2, capacitorSlots: 0, utilitySlots: 2 },
    hull: { baseHp: 1600, baseArmor: 800, baseShield: 900, armorResistances: { thermal: 30, kinetic: 40, explosive: 45, em: 35 }, shieldResistances: { thermal: 40, kinetic: 30, explosive: 25, em: 55 }, signatureRadius: 75, maxVelocity: 300, warpSpeed: 5.0, agility: 0.85, targetingRange: 60, maxTargets: 7, cpu: 220, powergrid: 130, capacitorCapacity: 550, capacitorRecharge: 260 },
    bonuses: [{ stat: 'crewEfficiency', value: 10, isPercent: true, perLevel: true }], specialAbility: 'Micro Jump', specialDescription: 'Warp fleet to new position',
  },

  // ── CRUISERS ──
  {
    id: 'cruiser_heavy', name: 'Heavy Cruiser', description: 'Versatile combat vessel.', icon: '🚀',
    size: 'cruiser', tier: 1, requiredLevel: 25, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 3500, crystal: 1500, deuterium: 800, credits: 35000 },
    buildTime: 120, slots: { highSlots: 5, midSlots: 4, lowSlots: 4, rigSlots: 3, capacitorSlots: 1, utilitySlots: 2 },
    hull: { baseHp: 4500, baseArmor: 2200, baseShield: 1800, armorResistances: { thermal: 40, kinetic: 50, explosive: 60, em: 30 }, shieldResistances: { thermal: 30, kinetic: 40, explosive: 20, em: 50 }, signatureRadius: 150, maxVelocity: 220, warpSpeed: 3.5, agility: 1.2, targetingRange: 70, maxTargets: 7, cpu: 350, powergrid: 280, capacitorCapacity: 1200, capacitorRecharge: 400 },
    bonuses: [{ stat: 'weaponDamage', value: 10, isPercent: true, perLevel: true }, { stat: 'hullHp', value: 5, isPercent: true, perLevel: true }], specialAbility: 'Focused Fire', specialDescription: '+30% damage for 15s',
  },
  {
    id: 'cruiser_assault', name: 'Assault Cruiser', description: 'Frontline combat cruiser.', icon: '⚔️',
    size: 'cruiser', tier: 2, requiredLevel: 35, requiredResearch: ['tech_assault_frame'], faction: 'iron',
    buildCost: { metal: 4000, crystal: 1800, deuterium: 900, credits: 40000 },
    buildTime: 150, slots: { highSlots: 6, midSlots: 3, lowSlots: 5, rigSlots: 3, capacitorSlots: 1, utilitySlots: 1 },
    hull: { baseHp: 5500, baseArmor: 3000, baseShield: 1500, armorResistances: { thermal: 45, kinetic: 55, explosive: 65, em: 35 }, shieldResistances: { thermal: 25, kinetic: 35, explosive: 15, em: 45 }, signatureRadius: 180, maxVelocity: 200, warpSpeed: 3.0, agility: 1.3, targetingRange: 60, maxTargets: 6, cpu: 300, powergrid: 350, capacitorCapacity: 1000, capacitorRecharge: 350 },
    bonuses: [{ stat: 'weaponDamage', value: 12, isPercent: true, perLevel: true }, { stat: 'armorValue', value: 8, isPercent: true, perLevel: true }], specialAbility: 'Ram', specialDescription: 'Charge and damage target',
  },
  {
    id: 'cruiser_recon', name: 'Recon Cruiser', description: 'Long-range reconnaissance.', icon: '🔭',
    size: 'cruiser', tier: 2, requiredLevel: 30, requiredResearch: ['tech_advanced_sensors'], faction: 'shadow',
    buildCost: { metal: 3000, crystal: 2000, deuterium: 700, credits: 30000 },
    buildTime: 130, slots: { highSlots: 4, midSlots: 5, lowSlots: 4, rigSlots: 3, capacitorSlots: 1, utilitySlots: 2 },
    hull: { baseHp: 3500, baseArmor: 1800, baseShield: 2200, armorResistances: { thermal: 30, kinetic: 40, explosive: 50, em: 35 }, shieldResistances: { thermal: 40, kinetic: 30, explosive: 25, em: 55 }, signatureRadius: 100, maxVelocity: 260, warpSpeed: 5.5, agility: 1.0, targetingRange: 100, maxTargets: 8, cpu: 400, powergrid: 250, capacitorCapacity: 1100, capacitorRecharge: 380 },
    bonuses: [{ stat: 'sensorStrength', value: 12, isPercent: true, perLevel: true }], specialAbility: 'Scan Pulse', specialDescription: 'Reveal all enemies in 200km',
  },
  {
    id: 'cruiser_logistics', name: 'Logistics Cruiser', description: 'Fleet repair vessel.', icon: '💚',
    size: 'cruiser', tier: 2, requiredLevel: 30, requiredResearch: ['tech_repair_bay'], faction: 'alliance',
    buildCost: { metal: 2800, crystal: 2200, deuterium: 750, credits: 32000 },
    buildTime: 140, slots: { highSlots: 3, midSlots: 4, lowSlots: 4, rigSlots: 3, capacitorSlots: 2, utilitySlots: 2 },
    hull: { baseHp: 3800, baseArmor: 1900, baseShield: 2000, armorResistances: { thermal: 35, kinetic: 45, explosive: 55, em: 30 }, shieldResistances: { thermal: 45, kinetic: 35, explosive: 30, em: 60 }, signatureRadius: 120, maxVelocity: 230, warpSpeed: 4.0, agility: 1.1, targetingRange: 80, maxTargets: 10, cpu: 380, powergrid: 260, capacitorCapacity: 1500, capacitorRecharge: 450 },
    bonuses: [{ stat: 'repairAmount', value: 15, isPercent: true, perLevel: true }], specialAbility: 'Remote Armor Repair', specialDescription: 'Repair ally armor at range',
  },
  {
    id: 'cruiser_battlecruiser', name: 'Battlecruiser', description: 'Heavy combat platform.', icon: '🏟️',
    size: 'cruiser', tier: 3, requiredLevel: 45, requiredResearch: ['tech_battlecruiser_frame', 'tech_heavy_weapons'], faction: 'iron',
    buildCost: { metal: 5500, crystal: 2500, deuterium: 1200, credits: 55000 },
    buildTime: 200, slots: { highSlots: 7, midSlots: 4, lowSlots: 5, rigSlots: 4, capacitorSlots: 1, utilitySlots: 2 },
    hull: { baseHp: 7000, baseArmor: 3500, baseShield: 3000, armorResistances: { thermal: 45, kinetic: 55, explosive: 65, em: 35 }, shieldResistances: { thermal: 35, kinetic: 45, explosive: 25, em: 55 }, signatureRadius: 220, maxVelocity: 180, warpSpeed: 3.0, agility: 1.4, targetingRange: 75, maxTargets: 8, cpu: 450, powergrid: 400, capacitorCapacity: 1800, capacitorRecharge: 500 },
    bonuses: [{ stat: 'weaponDamage', value: 15, isPercent: true, perLevel: true }], specialAbility: 'Doomsday Prep', specialDescription: 'Channel devastating attack',
  },

  // ── BATTLESHIPS ──
  {
    id: 'battleship_dreadnought', name: 'Dreadnought', description: 'Capital warship with heavy firepower.', icon: '⛴️',
    size: 'battleship', tier: 1, requiredLevel: 50, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 15000, crystal: 8000, deuterium: 4000, credits: 150000 },
    buildTime: 360, slots: { highSlots: 8, midSlots: 5, lowSlots: 6, rigSlots: 4, capacitorSlots: 2, utilitySlots: 3 },
    hull: { baseHp: 18000, baseArmor: 9000, baseShield: 7500, armorResistances: { thermal: 50, kinetic: 60, explosive: 70, em: 40 }, shieldResistances: { thermal: 40, kinetic: 50, explosive: 30, em: 60 }, signatureRadius: 400, maxVelocity: 120, warpSpeed: 2.5, agility: 2.0, targetingRange: 100, maxTargets: 10, cpu: 700, powergrid: 650, capacitorCapacity: 4000, capacitorRecharge: 800 },
    bonuses: [{ stat: 'weaponDamage', value: 20, isPercent: true, perLevel: true }, { stat: 'hullHp', value: 10, isPercent: true, perLevel: true }], specialAbility: 'Salvo', specialDescription: 'Fire all weapons in devastating volley',
  },
  {
    id: 'battleship_pirate', name: 'Pirate Battleship', description: 'Fast attack capital ship.', icon: '🏴‍☠️',
    size: 'battleship', tier: 2, requiredLevel: 60, requiredResearch: ['tech_pirate_design'], faction: 'void_corsairs',
    buildCost: { metal: 12000, crystal: 6000, deuterium: 3500, credits: 130000 },
    buildTime: 300, slots: { highSlots: 7, midSlots: 6, lowSlots: 5, rigSlots: 4, capacitorSlots: 2, utilitySlots: 2 },
    hull: { baseHp: 15000, baseArmor: 7000, baseShield: 6000, armorResistances: { thermal: 40, kinetic: 50, explosive: 60, em: 35 }, shieldResistances: { thermal: 45, kinetic: 35, explosive: 25, em: 55 }, signatureRadius: 350, maxVelocity: 160, warpSpeed: 3.0, agility: 1.6, targetingRange: 90, maxTargets: 9, cpu: 650, powergrid: 600, capacitorCapacity: 3500, capacitorRecharge: 700 },
    bonuses: [{ stat: 'weaponDamage', value: 18, isPercent: true, perLevel: true }, { stat: 'flightVelocity', value: 10, isPercent: true, perLevel: true }], specialAbility: 'Raid Command', specialDescription: '+25% fleet speed, +15% damage',
  },
  {
    id: 'battleship_sniper', name: 'Siege Battleship', description: 'Long-range bombardment.', icon: '🎯',
    size: 'battleship', tier: 2, requiredLevel: 55, requiredResearch: ['tech_siege_weapons'], faction: 'terran',
    buildCost: { metal: 14000, crystal: 9000, deuterium: 3800, credits: 140000 },
    buildTime: 340, slots: { highSlots: 6, midSlots: 5, lowSlots: 7, rigSlots: 4, capacitorSlots: 2, utilitySlots: 2 },
    hull: { baseHp: 16000, baseArmor: 8500, baseShield: 6500, armorResistances: { thermal: 55, kinetic: 65, explosive: 75, em: 45 }, shieldResistances: { thermal: 35, kinetic: 45, explosive: 25, em: 55 }, signatureRadius: 450, maxVelocity: 100, warpSpeed: 2.0, agility: 2.5, targetingRange: 150, maxTargets: 8, cpu: 600, powergrid: 700, capacitorCapacity: 3800, capacitorRecharge: 850 },
    bonuses: [{ stat: 'weaponDamage', value: 25, isPercent: true, perLevel: true }, { stat: 'weaponRange', value: 15, isPercent: true, perLevel: true }], specialAbility: 'Siege Mode', specialDescription: '+50% damage, -50% speed, immobile',
  },

  // ── CARRIERS ──
  {
    id: 'carrier_assault', name: 'Assault Carrier', description: 'Fighter wing carrier.', icon: '✈️',
    size: 'carrier', tier: 1, requiredLevel: 65, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 25000, crystal: 15000, deuterium: 8000, credits: 250000 },
    buildTime: 480, slots: { highSlots: 4, midSlots: 6, lowSlots: 5, rigSlots: 4, capacitorSlots: 2, utilitySlots: 4 },
    hull: { baseHp: 22000, baseArmor: 11000, baseShield: 9500, armorResistances: { thermal: 45, kinetic: 55, explosive: 65, em: 35 }, shieldResistances: { thermal: 40, kinetic: 50, explosive: 30, em: 60 }, signatureRadius: 500, maxVelocity: 100, warpSpeed: 2.0, agility: 2.5, targetingRange: 120, maxTargets: 12, cpu: 800, powergrid: 750, capacitorCapacity: 5000, capacitorRecharge: 1000 },
    bonuses: [{ stat: 'summonPower', value: 20, isPercent: true, perLevel: true }], specialAbility: 'Launch Wings', specialDescription: 'Deploy 4 fighter wings',
  },
  {
    id: 'carrier_logistics', name: 'Command Carrier', description: 'Fleet command vessel.', icon: '👑',
    size: 'carrier', tier: 2, requiredLevel: 75, requiredResearch: ['tech_fleet_command_carrier'], faction: 'free_alliance',
    buildCost: { metal: 30000, crystal: 18000, deuterium: 10000, credits: 300000 },
    buildTime: 540, slots: { highSlots: 3, midSlots: 7, lowSlots: 5, rigSlots: 4, capacitorSlots: 3, utilitySlots: 4 },
    hull: { baseHp: 25000, baseArmor: 12000, baseShield: 11000, armorResistances: { thermal: 50, kinetic: 60, explosive: 70, em: 40 }, shieldResistances: { thermal: 45, kinetic: 55, explosive: 35, em: 65 }, signatureRadius: 550, maxVelocity: 90, warpSpeed: 2.0, agility: 2.8, targetingRange: 150, maxTargets: 15, cpu: 900, powergrid: 800, capacitorCapacity: 6000, capacitorRecharge: 1200 },
    bonuses: [{ stat: 'crewEfficiency', value: 25, isPercent: true, perLevel: true }, { stat: 'fleetCommandRange', value: 20, isPercent: true, perLevel: true }], specialAbility: 'Fleet Boost', specialDescription: '+15% all stats for fleet',
  },

  // ── DREADNOUGHTS ──
  {
    id: 'dreadnought_empire', name: 'Empire Dreadnought', description: 'Ultimate warship.', icon: '🌟',
    size: 'dreadnought', tier: 1, requiredLevel: 85, requiredResearch: [], faction: 'terran',
    buildCost: { metal: 50000, crystal: 30000, deuterium: 15000, credits: 500000 },
    buildTime: 720, slots: { highSlots: 10, midSlots: 8, lowSlots: 8, rigSlots: 6, capacitorSlots: 3, utilitySlots: 5 },
    hull: { baseHp: 50000, baseArmor: 25000, baseShield: 20000, armorResistances: { thermal: 60, kinetic: 70, explosive: 80, em: 50 }, shieldResistances: { thermal: 50, kinetic: 60, explosive: 40, em: 70 }, signatureRadius: 800, maxVelocity: 80, warpSpeed: 1.5, agility: 3.5, targetingRange: 150, maxTargets: 15, cpu: 1200, powergrid: 1100, capacitorCapacity: 10000, capacitorRecharge: 1500 },
    bonuses: [{ stat: 'weaponDamage', value: 30, isPercent: true, perLevel: true }, { stat: 'hullHp', value: 20, isPercent: true, perLevel: true }], specialAbility: 'Doomsday Device', specialDescription: 'Devastating area attack',
  },

  // ── TITANS ──
  {
    id: 'titan_colossus', name: 'Colossus Titan', description: 'Planet-killing superweapon.', icon: '💀',
    size: 'titan', tier: 1, requiredLevel: 100, requiredResearch: ['tech_titan_frame', 'tech_superweapon'], faction: 'eternal',
    buildCost: { metal: 200000, crystal: 120000, deuterium: 60000, credits: 2000000 },
    buildTime: 1440, slots: { highSlots: 15, midSlots: 10, lowSlots: 10, rigSlots: 8, capacitorSlots: 5, utilitySlots: 6 },
    hull: { baseHp: 200000, baseArmor: 100000, baseShield: 80000, armorResistances: { thermal: 70, kinetic: 80, explosive: 90, em: 60 }, shieldResistances: { thermal: 60, kinetic: 70, explosive: 50, em: 80 }, signatureRadius: 2000, maxVelocity: 50, warpSpeed: 1.0, agility: 5.0, targetingRange: 200, maxTargets: 20, cpu: 2000, powergrid: 2000, capacitorCapacity: 25000, capacitorRecharge: 3000 },
    bonuses: [{ stat: 'weaponDamage', value: 50, isPercent: true, perLevel: true }], specialAbility: 'Planet Killer', specialDescription: 'Destroy a planet\'s surface',
  },
];

// ============================================================================
// SHIP MODULES (Fitting)
// ============================================================================

export interface ShipModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ModuleType;
  slotType: SlotType;
  weaponType?: WeaponType;
  damageType?: DamageType;
  tier: number;
  requiredLevel: number;
  cpuUsage: number;
  powergridUsage: number;
  capacitorUsage: number;
  effects: { stat: string; value: number; isPercent: boolean }[];
  specialEffect?: string;
  specialDescription?: string;
  buildCost: { metal: number; crystal: number; deuterium: number; credits: number };
  buildTime: number;
}

export const SHIP_MODULES: ShipModule[] = [
  // ── HIGH SLOT: WEAPONS ──
  { id: 'mod_dual_laser', name: 'Dual Laser Turret', description: 'Basic energy weapon.', icon: '🔫', type: 'weapon', slotType: 'high', weaponType: 'laser', damageType: 'thermal', tier: 1, requiredLevel: 1, cpuUsage: 15, powergridUsage: 20, capacitorUsage: 5, effects: [{ stat: 'weaponDamage', value: 50, isPercent: false }], buildCost: { metal: 200, crystal: 100, deuterium: 30, credits: 2000 }, buildTime: 15 },
  { id: 'mod_quad_laser', name: 'Quad Laser Turret', description: 'Heavy energy weapon.', icon: '🔫', type: 'weapon', slotType: 'high', weaponType: 'laser', damageType: 'thermal', tier: 2, requiredLevel: 15, cpuUsage: 25, powergridUsage: 35, capacitorUsage: 8, effects: [{ stat: 'weaponDamage', value: 120, isPercent: false }], buildCost: { metal: 500, crystal: 250, deuterium: 80, credits: 5000 }, buildTime: 30 },
  { id: 'mod_autocannon', name: 'Autocannon', description: 'Rapid-fire projectile.', icon: '🔫', type: 'weapon', slotType: 'high', weaponType: 'projectile', damageType: 'kinetic', tier: 1, requiredLevel: 1, cpuUsage: 12, powergridUsage: 18, capacitorUsage: 3, effects: [{ stat: 'weaponDamage', value: 35, isPercent: false }, { stat: 'weaponSpeed', value: 15, isPercent: true }], buildCost: { metal: 180, crystal: 80, deuterium: 25, credits: 1800 }, buildTime: 12 },
  { id: 'mod_railgun', name: 'Railgun', description: 'Long-range kinetic weapon.', icon: '🎯', type: 'weapon', slotType: 'high', weaponType: 'projectile', damageType: 'kinetic', tier: 2, requiredLevel: 20, cpuUsage: 20, powergridUsage: 30, capacitorUsage: 6, effects: [{ stat: 'weaponDamage', value: 100, isPercent: false }, { stat: 'weaponRange', value: 20, isPercent: true }], buildCost: { metal: 400, crystal: 200, deuterium: 60, credits: 4000 }, buildTime: 25 },
  { id: 'mod_missile_launcher', name: 'Missile Launcher', description: 'Explosive missile system.', icon: '🚀', type: 'weapon', slotType: 'high', weaponType: 'missile', damageType: 'explosive', tier: 1, requiredLevel: 5, cpuUsage: 18, powergridUsage: 22, capacitorUsage: 4, effects: [{ stat: 'weaponDamage', value: 65, isPercent: false }], buildCost: { metal: 250, crystal: 120, deuterium: 40, credits: 2500 }, buildTime: 18 },
  { id: 'mod_heavy_missiles', name: 'Heavy Missile Launcher', description: 'Anti-ship missiles.', icon: '🚀', type: 'weapon', slotType: 'high', weaponType: 'missile', damageType: 'explosive', tier: 2, requiredLevel: 25, cpuUsage: 30, powergridUsage: 40, capacitorUsage: 10, effects: [{ stat: 'weaponDamage', value: 150, isPercent: false }], buildCost: { metal: 600, crystal: 300, deuterium: 100, credits: 6000 }, buildTime: 35 },
  { id: 'mod_beams', name: 'Beam Laser', description: 'Focused energy beam.', icon: '🔦', type: 'weapon', slotType: 'high', weaponType: 'energy_turret', damageType: 'em', tier: 2, requiredLevel: 30, cpuUsage: 35, powergridUsage: 45, capacitorUsage: 12, effects: [{ stat: 'weaponDamage', value: 180, isPercent: false }, { stat: 'weaponRange', value: 15, isPercent: true }], buildCost: { metal: 700, crystal: 400, deuterium: 120, credits: 7000 }, buildTime: 40 },
  { id: 'mod_pulse_laser', name: 'Pulse Laser', description: 'Burst energy weapon.', icon: '⚡', type: 'weapon', slotType: 'high', weaponType: 'laser', damageType: 'thermal', tier: 3, requiredLevel: 40, cpuUsage: 40, powergridUsage: 50, capacitorUsage: 15, effects: [{ stat: 'weaponDamage', value: 250, isPercent: false }, { stat: 'weaponCritChance', value: 10, isPercent: true }], buildCost: { metal: 1000, crystal: 500, deuterium: 150, credits: 10000 }, buildTime: 50 },

  // ── MID SLOT: SHIELDS & PROPULSION ──
  { id: 'mod_shield_boost', name: 'Shield Booster', description: 'Active shield repair.', icon: '🛡️', type: 'shield', slotType: 'mid', tier: 1, requiredLevel: 1, cpuUsage: 10, powergridUsage: 15, capacitorUsage: 20, effects: [{ stat: 'shieldHp', value: 100, isPercent: false }], buildCost: { metal: 150, crystal: 100, deuterium: 30, credits: 1500 }, buildTime: 12 },
  { id: 'mod_large_shield_boost', name: 'Large Shield Booster', description: 'Heavy shield repair.', icon: '🛡️', type: 'shield', slotType: 'mid', tier: 2, requiredLevel: 25, cpuUsage: 20, powergridUsage: 30, capacitorUsage: 40, effects: [{ stat: 'shieldHp', value: 300, isPercent: false }], buildCost: { metal: 400, crystal: 250, deuterium: 80, credits: 4000 }, buildTime: 30 },
  { id: 'mod_afterburner', name: 'Afterburner', description: 'Increases speed.', icon: '🔥', type: 'engine', slotType: 'mid', tier: 1, requiredLevel: 1, cpuUsage: 8, powergridUsage: 12, capacitorUsage: 5, effects: [{ stat: 'flightVelocity', value: 25, isPercent: true }], buildCost: { metal: 100, crystal: 60, deuterium: 20, credits: 1000 }, buildTime: 10 },
  { id: 'mod_mwd', name: 'Microwarpdrive', description: 'Massive speed boost.', icon: '⚡', type: 'engine', slotType: 'mid', tier: 2, requiredLevel: 20, cpuUsage: 15, powergridUsage: 25, capacitorUsage: 15, effects: [{ stat: 'flightVelocity', value: 50, isPercent: true }, { stat: 'signatureRadius', value: 20, isPercent: true }], buildCost: { metal: 300, crystal: 180, deuterium: 60, credits: 3000 }, buildTime: 25 },
  { id: 'mod_webifier', name: 'Stasis Webifier', description: 'Slows target.', icon: '🔗', type: 'utility', slotType: 'mid', tier: 1, requiredLevel: 5, cpuUsage: 10, powergridUsage: 10, capacitorUsage: 8, effects: [{ stat: 'targetingSpeed', value: 20, isPercent: true }], buildCost: { metal: 120, crystal: 80, deuterium: 25, credits: 1200 }, buildTime: 12 },
  { id: 'mod_scrambler', name: 'Warp Scrambler', description: 'Prevents warp.', icon: '🚫', type: 'utility', slotType: 'mid', tier: 2, requiredLevel: 15, cpuUsage: 12, powergridUsage: 12, capacitorUsage: 10, effects: [{ stat: 'crowdControl', value: 30, isPercent: true }], buildCost: { metal: 200, crystal: 150, deuterium: 50, credits: 2000 }, buildTime: 18 },

  // ── LOW SLOT: ARMOR & DAMAGE ──
  { id: 'mod_armor_repair', name: 'Armor Repairer', description: 'Active armor repair.', icon: '🔧', type: 'repair', slotType: 'low', tier: 1, requiredLevel: 1, cpuUsage: 10, powergridUsage: 15, capacitorUsage: 18, effects: [{ stat: 'armorValue', value: 80, isPercent: false }], buildCost: { metal: 150, crystal: 80, deuterium: 25, credits: 1500 }, buildTime: 12 },
  { id: 'mod_armor_plate', name: 'Armor Plate', description: 'Passive armor bonus.', icon: '🛡️', type: 'armor', slotType: 'low', tier: 1, requiredLevel: 1, cpuUsage: 5, powergridUsage: 10, capacitorUsage: 0, effects: [{ stat: 'armorValue', value: 200, isPercent: false }], buildCost: { metal: 120, crystal: 60, deuterium: 15, credits: 1200 }, buildTime: 10 },
  { id: 'mod_heat_sink', name: 'Heat Sink', description: 'Increases weapon damage.', icon: '🔥', type: 'buff', slotType: 'low', tier: 1, requiredLevel: 5, cpuUsage: 8, powergridUsage: 10, capacitorUsage: 0, effects: [{ stat: 'weaponDamage', value: 15, isPercent: true }], buildCost: { metal: 100, crystal: 80, deuterium: 20, credits: 1000 }, buildTime: 10 },
  { id: 'mod_tracking_enhancer', name: 'Tracking Enhancer', description: 'Improves weapon tracking.', icon: '🎯', type: 'buff', slotType: 'low', tier: 1, requiredLevel: 10, cpuUsage: 8, powergridUsage: 8, capacitorUsage: 0, effects: [{ stat: 'targetingSpeed', value: 15, isPercent: true }, { stat: 'weaponSpeed', value: 10, isPercent: true }], buildCost: { metal: 110, crystal: 90, deuterium: 20, credits: 1100 }, buildTime: 12 },
  { id: 'mod_damage_rig', name: 'Damage Control', description: 'Passive damage reduction.', icon: '⚙️', type: 'rig', slotType: 'low', tier: 2, requiredLevel: 20, cpuUsage: 5, powergridUsage: 5, capacitorUsage: 0, effects: [{ stat: 'damageReduction', value: 10, isPercent: true }], buildCost: { metal: 200, crystal: 150, deuterium: 40, credits: 2000 }, buildTime: 15 },
  { id: 'mod_co_processor', name: 'Co-Processor', description: 'Increases CPU capacity.', icon: '💻', type: 'utility', slotType: 'low', tier: 1, requiredLevel: 5, cpuUsage: 0, powergridUsage: 5, capacitorUsage: 0, effects: [{ stat: 'moduleCpu', value: 25, isPercent: true }], buildCost: { metal: 80, crystal: 100, deuterium: 15, credits: 800 }, buildTime: 8 },
  { id: 'mod_reactor_control', name: 'Reactor Control Unit', description: 'Increases powergrid.', icon: '⚡', type: 'utility', slotType: 'low', tier: 1, requiredLevel: 5, cpuUsage: 5, powergridUsage: 0, capacitorUsage: 0, effects: [{ stat: 'modulePowergrid', value: 25, isPercent: true }], buildCost: { metal: 90, crystal: 90, deuterium: 15, credits: 900 }, buildTime: 8 },
];

// ============================================================================
// SHIP FITTING
// ============================================================================

export interface ShipFitting {
  id: string;
  name: string;
  description: string;
  shipClassId: string;
  highSlots: (string | null)[];
  midSlots: (string | null)[];
  lowSlots: (string | null)[];
  rigSlots: (string | null)[];
  capacitorSlots: (string | null)[];
  utilitySlots: (string | null)[];
  totalCpu: number;
  totalPowergrid: number;
  totalCapacitor: number;
}

export interface ShipInstance {
  id: string;
  name: string;
  classId: string;
  level: number;
  experience: number;
  fitting: ShipFitting;
  status: 'ready' | 'inFleet' | 'repairing' | 'building' | 'destroyed';
  hullPercent: number;
  armorPercent: number;
  shieldPercent: number;
  fittedAt: number;
  lastUsedAt?: number;
}

export interface ConstructionJob {
  id: string;
  classId: string;
  startedAt: number;
  completesAt: number;
  status: 'queued' | 'building' | 'completed' | 'cancelled';
  priority: number;
  assignedYard: string;
}

export interface ShipyardState {
  level: number;
  experience: number;
  maxConcurrentJobs: number;
  constructionSpeedBonus: number;
  buildQueue: ConstructionJob[];
  shipInventory: ShipInstance[];
  savedFittings: ShipFitting[];
  totalShipsBuilt: number;
  totalModulesCrafted: number;
}

// ============================================================================
// SHIPYARD FUNCTIONS
// ============================================================================

export function createDefaultShipyardState(): ShipyardState {
  return {
    level: 1, experience: 0, maxConcurrentJobs: 1, constructionSpeedBonus: 0,
    buildQueue: [], shipInventory: [], savedFittings: [],
    totalShipsBuilt: 0, totalModulesCrafted: 0,
  };
}

export function getShipBuildTime(classDef: ShipClassDefinition, yardLevel: number, speedBonus: number): number {
  const baseTime = classDef.buildTime;
  const yardReduction = Math.floor(baseTime * 0.02 * yardLevel);
  const totalReduction = Math.floor((baseTime - yardReduction) * (1 - speedBonus / 100));
  return Math.max(10, totalReduction);
}

export function getShipClass(id: string): ShipClassDefinition | undefined {
  return SHIP_CLASSES.find(s => s.id === id);
}

export function getModule(id: string): ShipModule | undefined {
  return SHIP_MODULES.find(m => m.id === id);
}

export function calculateShipStats(shipClass: ShipClassDefinition, fitting: ShipFitting, level: number): {
  hp: number; armor: number; shield: number; damage: number; speed: number; cpu: number; powergrid: number;
} {
  let hp = shipClass.hull.baseHp;
  let armor = shipClass.hull.baseArmor;
  let shield = shipClass.hull.baseShield;
  let damage = 0;
  let speed = shipClass.hull.maxVelocity;
  let cpu = shipClass.hull.cpu;
  let powergrid = shipClass.hull.powergrid;

  for (const slot of [...fitting.highSlots, ...fitting.midSlots, ...fitting.lowSlots, ...fitting.rigSlots]) {
    if (!slot) continue;
    const mod = getModule(slot);
    if (!mod) continue;
    for (const effect of mod.effects) {
      if (effect.stat === 'weaponDamage') damage += effect.value;
      if (effect.stat === 'shieldHp') shield += effect.value;
      if (effect.stat === 'armorValue') armor += effect.value;
      if (effect.stat === 'hullHp') hp += effect.value;
      if (effect.stat === 'flightVelocity') speed += speed * (effect.value / 100);
    }
  }

  for (const bonus of shipClass.bonuses) {
    const value = bonus.perLevel ? bonus.value * level : bonus.value;
    if (bonus.stat === 'weaponDamage') damage += damage * (value / 100);
    if (bonus.stat === 'hullHp') hp += hp * (value / 100);
  }

  return { hp: Math.round(hp), armor: Math.round(armor), shield: Math.round(shield), damage: Math.round(damage), speed: Math.round(speed), cpu, powergrid };
}

export function canFitModule(fitting: ShipFitting, module: ShipModule): { canFit: boolean; reason?: string } {
  const shipClass = getShipClass(fitting.shipClassId);
  if (!shipClass) return { canFit: false, reason: 'Invalid ship class' };

  const usedCpu = fitting.totalCpu;
  const usedPowergrid = fitting.totalPowergrid;
  if (usedCpu + module.cpuUsage > shipClass.hull.cpu) return { canFit: false, reason: 'Insufficient CPU' };
  if (usedPowergrid + module.powergridUsage > shipClass.hull.powergrid) return { canFit: false, reason: 'Insufficient powergrid' };

  const slotArray = module.slotType === 'high' ? fitting.highSlots : module.slotType === 'mid' ? fitting.midSlots : fitting.lowSlots;
  const emptySlot = slotArray.findIndex(s => s === null);
  if (emptySlot === -1) return { canFit: false, reason: `No empty ${module.slotType} slots` };

  return { canFit: true };
}

export function fitModule(fitting: ShipFitting, module: ShipModule): ShipFitting {
  const slotArray = module.slotType === 'high' ? [...fitting.highSlots] : module.slotType === 'mid' ? [...fitting.midSlots] : [...fitting.lowSlots];
  const emptyIndex = slotArray.findIndex(s => s === null);
  if (emptyIndex === -1) return fitting;

  slotArray[emptyIndex] = module.id;

  return {
    ...fitting,
    highSlots: module.slotType === 'high' ? slotArray : fitting.highSlots,
    midSlots: module.slotType === 'mid' ? slotArray : fitting.midSlots,
    lowSlots: module.slotType === 'low' ? slotArray : fitting.lowSlots,
    totalCpu: fitting.totalCpu + module.cpuUsage,
    totalPowergrid: fitting.totalPowergrid + module.powergridUsage,
  };
}

export function removeModule(fitting: ShipFitting, slotType: SlotType, index: number): ShipFitting {
  const slotArray = slotType === 'high' ? [...fitting.highSlots] : slotType === 'mid' ? [...fitting.midSlots] : [...fitting.lowSlots];
  const moduleId = slotArray[index];
  if (!moduleId) return fitting;

  const mod = getModule(moduleId);
  slotArray[index] = null;

  return {
    ...fitting,
    highSlots: slotType === 'high' ? slotArray : fitting.highSlots,
    midSlots: slotType === 'mid' ? slotArray : fitting.midSlots,
    lowSlots: slotType === 'low' ? slotArray : fitting.lowSlots,
    totalCpu: fitting.totalCpu - (mod?.cpuUsage || 0),
    totalPowergrid: fitting.totalPowergrid - (mod?.powergridUsage || 0),
  };
}

export function getModulesBySlot(slotType: SlotType): ShipModule[] {
  return SHIP_MODULES.filter(m => m.slotType === slotType);
}

export function getModulesByType(type: ModuleType): ShipModule[] {
  return SHIP_MODULES.filter(m => m.type === type);
}

export function calculateFittingPowerScore(fitting: ShipFitting): number {
  let score = 0;
  for (const slot of [...fitting.highSlots, ...fitting.midSlots, ...fitting.lowSlots, ...fitting.rigSlots]) {
    if (!slot) continue;
    const mod = getModule(slot);
    if (mod) score += mod.tier * 10;
  }
  return score;
}
