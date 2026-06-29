/**
 * COMMANDER TALENT TREE SYSTEM (Poe2-Inspired)
 * ============================================================================
 * Deep passive skill tree with level 1-999 progression and tier 1-99 nodes.
 * 314 total talent nodes across 6 classes and 18 sub-classes.
 */

export type TalentNodeRarity = 'normal' | 'notable' | 'keystone' | 'ascendancy';

export type StatType =
  | 'hullHp' | 'shieldHp' | 'shieldRecharge' | 'armorValue'
  | 'weaponDamage' | 'weaponSpeed' | 'weaponRange' | 'weaponCritChance' | 'weaponCritDamage'
  | 'energyWeapons' | 'kineticWeapons' | 'explosiveWeapons' | 'beamWeapons'
  | 'miningYield' | 'processingSpeed' | 'cargoCapacity' | 'warpSpeed' | 'warpStability'
  | 'targetingSpeed' | 'scanResolution' | 'sensorStrength' | 'electronicWarfare'
  | 'repairAmount' | 'logisticsBandwidth' | 'fleetCommandRange'
  | 'empireTaxReduction' | 'buildSpeedBonus' | 'researchSpeed' | 'diplomacyBonus'
  | 'crewEfficiency' | 'modulePowergrid' | 'moduleCpu' | 'capacitorCapacity' | 'capacitorRecharge'
  | 'flightVelocity' | 'agility' | 'signatureRadius' | 'avoidance'
  | 'xpBonus' | 'resourceBonus' | 'prestigeBonus' | 'turnEfficiency'
  | 'healthRegen' | 'damageReduction' | 'crowdControl' | 'summonPower' | 'fuelEfficiency';

export interface StatModifier {
  stat: StatType;
  value: number;
  isPercent: boolean;
}

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: TalentNodeRarity;
  tier: number;
  requiredLevel: number;
  requiredPoints: number;
  x: number;
  y: number;
  modifiers: StatModifier[];
  requires?: string[];
  ascendancyClass?: string;
  subClass?: string;
  subTalents?: SubTalent[];
}

export interface SubTalent {
  id: string;
  name: string;
  description: string;
  statBonus: StatType;
  value: number;
  isPercent: boolean;
  requiredPoints: number;
}

export interface TalentTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ascendancyClass: string;
  subClasses: {
    id: string;
    name: string;
    description: string;
    icon: string;
    nodes: TalentNode[];
  }[];
}

export interface CommanderTalentState {
  allocatedNodes: string[];
  totalPointsSpent: number;
  ascendancyPoints: number;
  ascendancyPointsSpent: number;
  respecCount: number;
}

export const TALENT_TREES: TalentTree[] = [
  {
    "id": "warlord",
    "name": "Warlord",
    "description": "Masters of warlord specialization.",
    "icon": "⚔️",
    "color": "#dc2626",
    "ascendancyClass": "warlord",
    "subClasses": [
      {
        "id": "warlord_vanguard",
        "name": "Vanguard",
        "description": "Frontline assault specialist with maximum damage output.",
        "icon": "🔥",
        "nodes": [
          {
            "id": "wv_1",
            "name": "Blade Initiate",
            "description": "+10% weapon damage",
            "icon": "⚔️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_2",
            "name": "Fire Discipline",
            "description": "+8% weapon speed",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_1"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_3",
            "name": "Critical Eye",
            "description": "+5% crit chance",
            "icon": "👁️",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_2"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_4",
            "name": "Rending Strikes",
            "description": "+25% crit damage",
            "icon": "💥",
            "rarity": "notable",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_5",
            "name": "Energy Surge",
            "description": "+15% energy damage",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "energyWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_6",
            "name": "Kinetic Impact",
            "description": "+15% kinetic damage",
            "icon": "🔩",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 2,
            "modifiers": [
              {
                "stat": "kineticWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_7",
            "name": "Explosive Payload",
            "description": "+20% explosive damage",
            "icon": "💣",
            "rarity": "normal",
            "tier": 18,
            "requiredLevel": 180,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "explosiveWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_8",
            "name": "Beam Focusing",
            "description": "+18% beam damage",
            "icon": "🔦",
            "rarity": "normal",
            "tier": 18,
            "requiredLevel": 180,
            "requiredPoints": 2,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "beamWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_9",
            "name": "Precision Targeting",
            "description": "+12% weapon range",
            "icon": "🔭",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponRange",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_10",
            "name": "War Fury",
            "description": "+20% weapon damage below 50% hull",
            "icon": "😡",
            "rarity": "keystone",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_4",
              "wv_5"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_11",
            "name": "Volley Fire",
            "description": "+15% fire rate",
            "icon": "🔫",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 4,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_12",
            "name": "Critical Mastery",
            "description": "+30% crit damage",
            "icon": "💀",
            "rarity": "notable",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_3",
              "wv_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_13",
            "name": "Devastating Blows",
            "description": "+25% weapon damage",
            "icon": "💥",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_10"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_14",
            "name": "Siege Breaker",
            "description": "+35% damage to structures",
            "icon": "🏰",
            "rarity": "normal",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_10"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_15",
            "name": "Armor Piercing",
            "description": "+20% armor penetration",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_14"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_16",
            "name": "Infinite Arsenal",
            "description": "+40% all weapon damage",
            "icon": "🔥",
            "rarity": "keystone",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_10",
              "wv_12"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_17",
            "name": "Annihilation Protocol",
            "description": "+50% crit damage, +15% crit chance",
            "icon": "☠️",
            "rarity": "ascendancy",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_12"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_18",
            "name": "Titan Slayer",
            "description": "+45% damage to bosses",
            "icon": "🐉",
            "rarity": "notable",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_16"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          },
          {
            "id": "wv_19",
            "name": "Warlord's Wrath",
            "description": "+60% weapon damage, +25% crit",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 15,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wv_17"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_vanguard"
          }
        ]
      },
      {
        "id": "warlord_berserker",
        "name": "Berserker",
        "description": "Risk-taking combatant who gains power from damage taken.",
        "icon": "🩸",
        "nodes": [
          {
            "id": "wb_1",
            "name": "Bloodlust",
            "description": "+12% damage per 10% missing hull",
            "icon": "🩸",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_2",
            "name": "Thick Skin",
            "description": "+15% armor value",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_1"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_3",
            "name": "Explosive Mastery",
            "description": "+20% explosive weapon damage",
            "icon": "💣",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "explosiveWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_2"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_4",
            "name": "Last Stand",
            "description": "+20% hull HP, cannot die for 3s once",
            "icon": "💀",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_5",
            "name": "Damage Return",
            "description": "Reflect 8% of incoming damage",
            "icon": "🔄",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "damageReduction",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_6",
            "name": "Berserker's Blood",
            "description": "+15% weapon damage per 10% missing HP",
            "icon": "🩸",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_7",
            "name": "Unyielding",
            "description": "+25% hull HP, +15% health regen",
            "icon": "💪",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_8",
            "name": "Pain Tolerance",
            "description": "+15% damage reduction",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "damageReduction",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_9",
            "name": "Rage Engine",
            "description": "+1% damage per second in combat (max 30%)",
            "icon": "🔥",
            "rarity": "keystone",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_10",
            "name": "Blood Frenzy",
            "description": "+20% fire rate below 30% HP",
            "icon": "⚡",
            "rarity": "notable",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponSpeed",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_9"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_11",
            "name": "Undying Will",
            "description": "+35% hull HP, revive once per battle",
            "icon": "🏴",
            "rarity": "normal",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_12",
            "name": "Crimson Armor",
            "description": "+30% armor, +20% damage reduction",
            "icon": "🔴",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_4"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_13",
            "name": "Death Wish",
            "description": "+50% damage below 20% HP",
            "icon": "☠️",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_11"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_14",
            "name": "Adrenaline Rush",
            "description": "+30% fire rate, +20% crit chance",
            "icon": "💉",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_10"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_15",
            "name": "Blood Storm",
            "description": "+40% AoE damage",
            "icon": "🌪️",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_12"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_16",
            "name": "Deathless Rage",
            "description": "+40% damage, +30% speed below 20% hull",
            "icon": "☠️",
            "rarity": "ascendancy",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 12,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_13"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_17",
            "name": "Rampage",
            "description": "+25% damage per kill in battle",
            "icon": "🔥",
            "rarity": "normal",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_14"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_18",
            "name": "Immortal Berserker",
            "description": "+80% all damage, immune to death once",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_16"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          },
          {
            "id": "wb_19",
            "name": "Berserker's Legacy",
            "description": "+60% weapon damage, +30% crit",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 8,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wb_18"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_berserker"
          }
        ]
      },
      {
        "id": "warlord_tactician",
        "name": "Tactician",
        "description": "Fleet commander who empowers allied ships.",
        "icon": "📋",
        "nodes": [
          {
            "id": "wt_1",
            "name": "Command Presence",
            "description": "+10% fleet command range",
            "icon": "📡",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "fleetCommandRange",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_2",
            "name": "Beam Focus",
            "description": "+15% beam weapon damage",
            "icon": "🔦",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "beamWeapons",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_1"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_3",
            "name": "Targeting Array",
            "description": "+20% targeting, +10% scan",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "targetingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_2"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_4",
            "name": "EW Resistance",
            "description": "+25% EW resistance",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_5",
            "name": "Morale Boost",
            "description": "+15% crew efficiency for allies",
            "icon": "✨",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_6",
            "name": "Fleet Commander",
            "description": "All allies +10% weapon damage",
            "icon": "⭐",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_7",
            "name": "Tactical Genius",
            "description": "+20% damage to targets below 50% HP",
            "icon": "🧠",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_8",
            "name": "Scan Enhancement",
            "description": "+20% sensor strength",
            "icon": "📡",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_3"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_9",
            "name": "Fleet Coordination",
            "description": "+15% fire rate for all allies",
            "icon": "📡",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_7"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_10",
            "name": "Synergy Matrix",
            "description": "+2% damage per ally in fleet (max 10)",
            "icon": "🔗",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_6"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_11",
            "name": "Strategic Withdrawal",
            "description": "+20% fleet evasion",
            "icon": "💨",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "avoidance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_9"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_12",
            "name": "Combat Medic",
            "description": "+20% repair for all allies",
            "icon": "💚",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_7"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_13",
            "name": "Grand Strategy",
            "description": "+30% all damage, +20% fleet speed",
            "icon": "👑",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_11"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_14",
            "name": "Tactical Supremacy",
            "description": "+25% first strike damage",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_10"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_15",
            "name": "Fleet Support",
            "description": "+30% crew efficiency",
            "icon": "👥",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_12"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_16",
            "name": "Grand Strategist",
            "description": "+25% all damage, +15% speed",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_13"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_17",
            "name": "Inspiring Leader",
            "description": "+40% crew efficiency, +25% morale",
            "icon": "⭐",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_13"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_18",
            "name": "Supreme Commander",
            "description": "+50% all damage, +30% fleet stats",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_15"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          },
          {
            "id": "wt_19",
            "name": "Eternal Tactician",
            "description": "+70% all damage, fleet immune to morale",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 8,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "wt_17"
            ],
            "ascendancyClass": "warlord",
            "subClass": "warlord_tactician"
          }
        ]
      }
    ]
  },
  {
    "id": "architect",
    "name": "Architect",
    "description": "Masters of architect specialization.",
    "icon": "🏗️",
    "color": "#f59e0b",
    "ascendancyClass": "architect",
    "subClasses": [
      {
        "id": "architect_mogul",
        "name": "Trade Mogul",
        "description": "Supreme economic power and market dominance.",
        "icon": "💰",
        "nodes": [
          {
            "id": "am_1",
            "name": "Shrewd Eye",
            "description": "+10% trade profit",
            "icon": "👁️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_2",
            "name": "Bulk Trading",
            "description": "+20% cargo capacity",
            "icon": "📦",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "cargoCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_1"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_3",
            "name": "Tax Evasion",
            "description": "-15% empire tax",
            "icon": "🏦",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "empireTaxReduction",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_2"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_4",
            "name": "Processing Mastery",
            "description": "+25% processing speed",
            "icon": "⚙️",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "processingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_5",
            "name": "Price Manipulation",
            "description": "+15% resource bonus",
            "icon": "📈",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_6",
            "name": "Market Monopoly",
            "description": "+30% resource production",
            "icon": "📊",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "am_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_7",
            "name": "Logistics Network",
            "description": "+20% logistics bandwidth",
            "icon": "🚛",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "logisticsBandwidth",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_8",
            "name": "Supply Chain",
            "description": "+30% cargo capacity",
            "icon": "📦",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "cargoCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_9",
            "name": "Trade Empire",
            "description": "+5% resource per alliance member (max 10)",
            "icon": "👑",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "am_6"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_10",
            "name": "Market Dominance",
            "description": "+25% all resource production",
            "icon": "💎",
            "rarity": "notable",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "am_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_11",
            "name": "Cartel Formation",
            "description": "+35% trade profit, -20% market taxes",
            "icon": "🤝",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "am_10"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_12",
            "name": "Industrial Titan",
            "description": "+40% mining yield, +30% processing",
            "icon": "🏭",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_10"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_13",
            "name": "Financial Empire",
            "description": "+50% all resources, -30% costs",
            "icon": "💰",
            "rarity": "keystone",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "am_11"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_14",
            "name": "Trade Monarch",
            "description": "+60% trade profit, +40% cargo",
            "icon": "👑",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "am_13"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_15",
            "name": "Economic Singularity",
            "description": "+100% all resource production",
            "icon": "💎",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "am_13"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_16",
            "name": "Supply Mastery",
            "description": "+40% logistics, +25% repair",
            "icon": "🔧",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "logisticsBandwidth",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "am_12"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_17",
            "name": "Eternal Mogul",
            "description": "+80% all income, unlimited cargo",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "am_14"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          },
          {
            "id": "am_18",
            "name": "Galactic Banker",
            "description": "+90% all income, zero market fees",
            "icon": "🏦",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 8,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "am_17"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_mogul"
          }
        ]
      },
      {
        "id": "architect_engineer",
        "name": "Master Engineer",
        "description": "Construction speed and building efficiency.",
        "icon": "🔧",
        "nodes": [
          {
            "id": "ae_1",
            "name": "Efficient Design",
            "description": "+10% build speed",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_2",
            "name": "Power Grid",
            "description": "+15% module powergrid",
            "icon": "🔌",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "modulePowergrid",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_1"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_3",
            "name": "CPU Optimization",
            "description": "+15% module CPU",
            "icon": "💻",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "moduleCpu",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_2"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_4",
            "name": "Hull Reinforcement",
            "description": "+20% hull HP",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_5",
            "name": "Resource Efficiency",
            "description": "+15% resource efficiency",
            "icon": "💰",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_6",
            "name": "Modular Design",
            "description": "+20% powergrid, +15% CPU",
            "icon": "🔧",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "modulePowergrid",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_7",
            "name": "Speed Builder",
            "description": "+40% build speed, -20% cost",
            "icon": "🏗️",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_8",
            "name": "Overclocking",
            "description": "+25% module CPU",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "moduleCpu",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_9",
            "name": "Megastructure Mastery",
            "description": "+50% build speed, megastructures -30%",
            "icon": "🏛️",
            "rarity": "keystone",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_7"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_10",
            "name": "Nanotech Integration",
            "description": "+30% repair amount",
            "icon": "🔬",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_11",
            "name": "Quantum Engineering",
            "description": "+60% build speed, -25% costs",
            "icon": "⚛️",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_12",
            "name": "Automated Systems",
            "description": "+40% build speed, +30% module stats",
            "icon": "🤖",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_13",
            "name": "Structural Perfection",
            "description": "+40% hull HP, +25% armor",
            "icon": "🏰",
            "rarity": "keystone",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_11"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_14",
            "name": "Master Builder",
            "description": "+70% build speed, +40% all module stats",
            "icon": "🏗️",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_13"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_15",
            "name": "Architect of Infinity",
            "description": "+100% build speed, -40% costs",
            "icon": "🌟",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_14"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_16",
            "name": "Eternal Engineer",
            "description": "+80% powergrid, +60% CPU",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "modulePowergrid",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_16"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_17",
            "name": "Perfectionist",
            "description": "+50% resource efficiency",
            "icon": "💎",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_16"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          },
          {
            "id": "ae_18",
            "name": "Legendary Crafter",
            "description": "+90% build speed, all items +20% stats",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ae_15"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_engineer"
          }
        ]
      },
      {
        "id": "architect_researcher",
        "name": "Research Director",
        "description": "Accelerated research and technology.",
        "icon": "🔬",
        "nodes": [
          {
            "id": "ar_1",
            "name": "Focused Study",
            "description": "+10% research speed",
            "icon": "📚",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_2",
            "name": "Data Mining",
            "description": "+8% XP bonus",
            "icon": "⭐",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_1"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_3",
            "name": "Lab Efficiency",
            "description": "+20% research speed",
            "icon": "🧪",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_2"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_4",
            "name": "Turn Efficiency",
            "description": "+15% turn efficiency",
            "icon": "⏱️",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "turnEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_5",
            "name": "Knowledge Network",
            "description": "+25% research speed",
            "icon": "🌐",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_6",
            "name": "Theory Crafting",
            "description": "+15% XP, +10% research",
            "icon": "📖",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_7",
            "name": "Breakthrough",
            "description": "+30% research, chance skip tiers",
            "icon": "💡",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_8",
            "name": "Quantum Computing",
            "description": "+35% research speed",
            "icon": "⚛️",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_3"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_9",
            "name": "Technology Singularity",
            "description": "+60% research, -25% tech costs",
            "icon": "🌐",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_7"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_10",
            "name": "Neural Interface",
            "description": "+30% XP bonus",
            "icon": "🧠",
            "rarity": "normal",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_8"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_11",
            "name": "Scientific Mastery",
            "description": "+70% research, +40% XP",
            "icon": "🔬",
            "rarity": "keystone",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_12",
            "name": "Data Harvesting",
            "description": "+50% research speed",
            "icon": "📊",
            "rarity": "normal",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_9"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_13",
            "name": "Mind Expansion",
            "description": "+50% XP, +30% research",
            "icon": "🧠",
            "rarity": "keystone",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_11"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_14",
            "name": "Cosmic Knowledge",
            "description": "+80% research, unlock hidden techs",
            "icon": "🌌",
            "rarity": "notable",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_12"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_15",
            "name": "Knowledge Lord",
            "description": "+70% XP, +50% research",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_12"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_16",
            "name": "Omniscient",
            "description": "+100% research, +100% XP",
            "icon": "🧠",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_12"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_17",
            "name": "Eternal Scholar",
            "description": "+90% research, +60% XP",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_15"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          },
          {
            "id": "ar_18",
            "name": "Grand Architect of Knowledge",
            "description": "+100% all research, all techs instant",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 8,
            "y": 1,
            "modifiers": [
              {
                "stat": "researchSpeed",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ar_17"
            ],
            "ascendancyClass": "architect",
            "subClass": "architect_researcher"
          }
        ]
      }
    ]
  },
  {
    "id": "sentinel",
    "name": "Sentinel",
    "description": "Masters of sentinel specialization.",
    "icon": "🛡️",
    "color": "#3b82f6",
    "ascendancyClass": "sentinel",
    "subClasses": [
      {
        "id": "sentinel_guardian",
        "name": "Guardian",
        "description": "Supreme shield technology and energy defense.",
        "icon": "🔮",
        "nodes": [
          {
            "id": "sg_1",
            "name": "Shield Mastery",
            "description": "+10% shield HP",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_2",
            "name": "Shield Recharge",
            "description": "+15% shield recharge",
            "icon": "♻️",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldRecharge",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_1"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_3",
            "name": "Capacitor Grid",
            "description": "+20% capacitor",
            "icon": "🔋",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "capacitorCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_2"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_4",
            "name": "Cap Recharge",
            "description": "+20% cap recharge",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "capacitorRecharge",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_5",
            "name": "Energy Barrier",
            "description": "+20% shield HP",
            "icon": "🔵",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_6",
            "name": "Power Surge",
            "description": "+25% capacitor",
            "icon": "🔋",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "capacitorCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_7",
            "name": "Hardened Shields",
            "description": "+25% shield, +20% recharge",
            "icon": "🔒",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_8",
            "name": "Shield Harmonics",
            "description": "+30% shield recharge",
            "icon": "🎵",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "shieldRecharge",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_9",
            "name": "Capacitor Mastery",
            "description": "+40% capacitor, +30% recharge",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "capacitorCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_8"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_10",
            "name": "Ethereal Ward",
            "description": "+50% shield, absorb 20% hull damage",
            "icon": "✨",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_7"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_11",
            "name": "Shield Fortress",
            "description": "+60% shield, +40% recharge",
            "icon": "🏰",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_12",
            "name": "Energy Dominion",
            "description": "+50% capacitor, +40% recharge",
            "icon": "💎",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "capacitorCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_13",
            "name": "Shield Overlord",
            "description": "+80% shield, +60% recharge",
            "icon": "👑",
            "rarity": "notable",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_11"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_14",
            "name": "Impenetrable",
            "description": "+100% shield, +50% recharge",
            "icon": "💎",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_11"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_15",
            "name": "Eternal Guardian",
            "description": "+100% all shields, absorb 40% hull",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_13"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_16",
            "name": "Capacitor God",
            "description": "+90% capacitor, +70% recharge",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "capacitorCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_13"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          },
          {
            "id": "sg_17",
            "name": "Shield Supreme",
            "description": "+120% shield, +100% recharge",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "shieldHp",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sg_13"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_guardian"
          }
        ]
      },
      {
        "id": "sentinel_bulwark",
        "name": "Bulwark",
        "description": "Maximum armor and damage reduction.",
        "icon": "🏰",
        "nodes": [
          {
            "id": "sb_1",
            "name": "Armor Plating",
            "description": "+10% armor",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_2",
            "name": "Damage Reduction",
            "description": "+8% damage reduction",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "damageReduction",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_1"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_3",
            "name": "Hull Fortification",
            "description": "+20% hull HP",
            "icon": "❤️",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_2"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_4",
            "name": "Health Regen",
            "description": "+25% health regen",
            "icon": "💚",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_5",
            "name": "Steel Wall",
            "description": "+25% armor",
            "icon": "🧱",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_6",
            "name": "Endurance",
            "description": "+25% hull, +20% regen",
            "icon": "💪",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_7",
            "name": "Fortress",
            "description": "+30% armor, +15% DR",
            "icon": "🏰",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_8",
            "name": "Bastion",
            "description": "+20% damage reduction",
            "icon": "🏰",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "damageReduction",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_9",
            "name": "Regeneration Core",
            "description": "+40% health regen",
            "icon": "💚",
            "rarity": "normal",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_8"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_10",
            "name": "Unbreakable Wall",
            "description": "+50% defenses, -20% damage taken",
            "icon": "🏛️",
            "rarity": "keystone",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_7"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_11",
            "name": "Titanium Core",
            "description": "+50% hull, +30% armor",
            "icon": "💎",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_12",
            "name": "Iron Fortress",
            "description": "+60% armor, +30% DR",
            "icon": "🏰",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_13",
            "name": "Defense Supreme",
            "description": "+80% armor, +50% DR",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_11"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_14",
            "name": "Immortal Fortress",
            "description": "+50% less damage, +100% all defense",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "damageReduction",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_13"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_15",
            "name": "Regen Master",
            "description": "+60% regen, +40% hull",
            "icon": "💚",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_14"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_16",
            "name": "Eternal Bulwark",
            "description": "+100% hull, +80% armor",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "hullHp",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_14"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          },
          {
            "id": "sb_17",
            "name": "Fortress Eternal",
            "description": "+120% armor, +80% DR",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "armorValue",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sb_12"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_bulwark"
          }
        ]
      },
      {
        "id": "sentinel_healer",
        "name": "Fleet Medic",
        "description": "Repair and logistics support.",
        "icon": "💚",
        "nodes": [
          {
            "id": "sh_1",
            "name": "Repair Basics",
            "description": "+10% repair amount",
            "icon": "🔧",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_2",
            "name": "Logistics Bandwidth",
            "description": "+15% logistics",
            "icon": "📡",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "logisticsBandwidth",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_1"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_3",
            "name": "Remote Repair",
            "description": "+20% repair range",
            "icon": "🔧",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_2"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_4",
            "name": "Health Regen Aura",
            "description": "All ships regen 2% hull/sec",
            "icon": "✨",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_5",
            "name": "Emergency Repair",
            "description": "+30% repair amount",
            "icon": "🊔",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_6",
            "name": "Shield Repair",
            "description": "+20% shield recharge",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "shieldRecharge",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_7",
            "name": "Fleet Healer",
            "description": "+40% repair, +25% logistics",
            "icon": "💚",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_8",
            "name": "Auto Repair",
            "description": "+25% health regen",
            "icon": "♻️",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_3"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_9",
            "name": "Logistics Master",
            "description": "+40% logistics, +30% repair",
            "icon": "📡",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "logisticsBandwidth",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_8"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_10",
            "name": "Miracle Worker",
            "description": "+60% repair, revive destroyed ships",
            "icon": "🌟",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_7"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_11",
            "name": "Shield Restoration",
            "description": "+40% shield, +25% shield HP",
            "icon": "🛡️",
            "rarity": "normal",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "shieldRecharge",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_12",
            "name": "Divine Healing",
            "description": "+80% repair, +50% regen",
            "icon": "✨",
            "rarity": "keystone",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_10"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_13",
            "name": "Fleet Medic Supreme",
            "description": "+90% repair, +60% regen",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_11"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_14",
            "name": "Miracle Eternal",
            "description": "+120% repair, revive all",
            "icon": "🌟",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_13"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_15",
            "name": "Immortality Engine",
            "description": "+100% repair, auto-repair to full",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "repairAmount",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_11"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          },
          {
            "id": "sh_16",
            "name": "Eternal Healer",
            "description": "+80% regen, +60% repair",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "healthRegen",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sh_12"
            ],
            "ascendancyClass": "sentinel",
            "subClass": "sentinel_healer"
          }
        ]
      }
    ]
  },
  {
    "id": "explorer",
    "name": "Explorer",
    "description": "Masters of explorer specialization.",
    "icon": "🔭",
    "color": "#10b981",
    "ascendancyClass": "explorer",
    "subClasses": [
      {
        "id": "explorer_pathfinder",
        "name": "Pathfinder",
        "description": "Unmatched warp speed and navigation.",
        "icon": "🚀",
        "nodes": [
          {
            "id": "ep_1",
            "name": "Warp Efficiency",
            "description": "+10% warp speed",
            "icon": "🚀",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_2",
            "name": "Flight Speed",
            "description": "+12% flight velocity",
            "icon": "✈️",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "flightVelocity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_1"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_3",
            "name": "Agility",
            "description": "+15% ship agility",
            "icon": "🦅",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "agility",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_2"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_4",
            "name": "Warp Stability",
            "description": "+20% warp stability",
            "icon": "🌀",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "warpStability",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_5",
            "name": "Afterburner",
            "description": "+18% flight velocity",
            "icon": "🔥",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "flightVelocity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_6",
            "name": "Navigation Boost",
            "description": "+22% warp speed",
            "icon": "🧭",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_7",
            "name": "Light Speed",
            "description": "+30% warp, +25% flight",
            "icon": "💨",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_8",
            "name": "Fuel Efficiency",
            "description": "+20% fuel efficiency",
            "icon": "⛽",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "fuelEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_9",
            "name": "Speed Demon",
            "description": "+35% flight velocity",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "flightVelocity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_8"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_10",
            "name": "Warp Gate Network",
            "description": "+50% warp, instant warp",
            "icon": "🌀",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_7"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_11",
            "name": "Fuel Mastery",
            "description": "+40% fuel efficiency",
            "icon": "⛽",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "fuelEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_12",
            "name": "Hyperdrive",
            "description": "+60% warp, +40% flight",
            "icon": "🚀",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_13",
            "name": "Warp God",
            "description": "+80% warp, +60% flight",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_11"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_14",
            "name": "Transcendent Speed",
            "description": "+100% all speed, instant warp",
            "icon": "⚡",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_12"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_15",
            "name": "Eternal Pathfinder",
            "description": "+120% speed, teleport once per battle",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "flightVelocity",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_16",
            "name": "Speed Supreme",
            "description": "+90% warp, +70% flight",
            "icon": "🌌",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "warpSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          },
          {
            "id": "ep_17",
            "name": "Cosmic Traveler",
            "description": "+60% fuel, +50% stability",
            "icon": "🌟",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "fuelEfficiency",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "ep_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_pathfinder"
          }
        ]
      },
      {
        "id": "explorer_scout",
        "name": "Scout",
        "description": "Superior scanning and sensors.",
        "icon": "📡",
        "nodes": [
          {
            "id": "es_1",
            "name": "Enhanced Sensors",
            "description": "+10% sensor strength",
            "icon": "📡",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_2",
            "name": "Scan Resolution",
            "description": "+15% scan resolution",
            "icon": "🔍",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "scanResolution",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_1"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_3",
            "name": "Signature Reduction",
            "description": "-15% signature",
            "icon": "👻",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "signatureRadius",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_2"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_4",
            "name": "Avoidance",
            "description": "+15% avoidance",
            "icon": "💨",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "avoidance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_5",
            "name": "Targeting",
            "description": "+18% targeting speed",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "targetingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_6",
            "name": "EW Basics",
            "description": "+15% EW strength",
            "icon": "📻",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_7",
            "name": "Master Scout",
            "description": "+30% sensor, +25% scan",
            "icon": "🔭",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "es_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_8",
            "name": "Detection Array",
            "description": "+25% sensor strength",
            "icon": "📡",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_9",
            "name": "Advanced EW",
            "description": "+25% EW strength",
            "icon": "📻",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_8"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_10",
            "name": "Ghost Protocol",
            "description": "-40% sig, +30% avoidance",
            "icon": "👻",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "signatureRadius",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "es_7"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_11",
            "name": "Stealth Mastery",
            "description": "-50% sig, +40% avoidance",
            "icon": "🌑",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "signatureRadius",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_12",
            "name": "Sensor Network",
            "description": "+50% sensor, +40% scan",
            "icon": "🌐",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "es_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_13",
            "name": "EW Master",
            "description": "+40% EW, +30% targeting",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "es_11"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_14",
            "name": "Invisible Hand",
            "description": "+100% scan, +80% sig reduction",
            "icon": "🌌",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "es_13"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_15",
            "name": "Eternal Scout",
            "description": "+120% sensor, +100% sig",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "es_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_16",
            "name": "Phantom Network",
            "description": "+60% EW, +50% targeting",
            "icon": "🕸️",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "es_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          },
          {
            "id": "es_17",
            "name": "Omniscient Eye",
            "description": "+150% sensor, see everything",
            "icon": "👁️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "es_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_scout"
          }
        ]
      },
      {
        "id": "explorer_salvager",
        "name": "Salvager",
        "description": "Maximize resource recovery.",
        "icon": "⛏️",
        "nodes": [
          {
            "id": "exs_1",
            "name": "Mining Boost",
            "description": "+10% mining yield",
            "icon": "⛏️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_2",
            "name": "Processing",
            "description": "+12% processing",
            "icon": "⚙️",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "processingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_1"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_3",
            "name": "Deep Mining",
            "description": "+15% mining yield",
            "icon": "⛏️",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_2"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_4",
            "name": "Cargo Master",
            "description": "+20% cargo",
            "icon": "📦",
            "rarity": "normal",
            "tier": 15,
            "requiredLevel": 150,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "cargoCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_5",
            "name": "Scrap Collector",
            "description": "+18% resource bonus",
            "icon": "🔩",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_6",
            "name": "Mining Laser",
            "description": "+20% mining yield",
            "icon": "🔦",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_7",
            "name": "Resource Recovery",
            "description": "+25% mining, +20% processing",
            "icon": "💎",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_8",
            "name": "Efficient Processing",
            "description": "+25% processing",
            "icon": "⚙️",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "processingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_3"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_9",
            "name": "Supply Master",
            "description": "+35% cargo",
            "icon": "📦",
            "rarity": "normal",
            "tier": 45,
            "requiredLevel": 450,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "cargoCapacity",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_8"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_10",
            "name": "Asteroid Breaker",
            "description": "+50% mining, double resources chance",
            "icon": "☄️",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_7"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_11",
            "name": "Salvage King",
            "description": "+40% resources, +30% cargo",
            "icon": "👑",
            "rarity": "normal",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_12",
            "name": "Resource Empire",
            "description": "+60% mining, +40% processing",
            "icon": "💰",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_10"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_13",
            "name": "Mining Overlord",
            "description": "+80% mining, +50% cargo",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_11"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_14",
            "name": "Cosmic Harvest",
            "description": "+100% mining, all doubled",
            "icon": "🌟",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_13"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_15",
            "name": "Eternal Salvager",
            "description": "+120% mining, +80% processing",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_16",
            "name": "Resource God",
            "description": "+100% resources, +70% mining",
            "icon": "💎",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          },
          {
            "id": "exs_17",
            "name": "Cosmic Miner",
            "description": "+150% mining, +100% processing",
            "icon": "🌌",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "miningYield",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "exs_14"
            ],
            "ascendancyClass": "explorer",
            "subClass": "explorer_salvager"
          }
        ]
      }
    ]
  },
  {
    "id": "spymaster",
    "name": "Spymaster",
    "description": "Masters of spymaster specialization.",
    "icon": "🕵️",
    "color": "#8b5cf6",
    "ascendancyClass": "spymaster",
    "subClasses": [
      {
        "id": "spymaster_infiltrator",
        "name": "Infiltrator",
        "description": "Stealth operations and sabotage.",
        "icon": "🗡️",
        "nodes": [
          {
            "id": "si_1",
            "name": "Stealth Basics",
            "description": "+10% EW strength",
            "icon": "🕵️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_2",
            "name": "Sig Reduction",
            "description": "-12% signature",
            "icon": "👻",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "signatureRadius",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_1"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_3",
            "name": "Sabotage",
            "description": "+20% espionage success",
            "icon": "💣",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_2"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_4",
            "name": "Crowd Control",
            "description": "+20% CC strength",
            "icon": "🔗",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "crowdControl",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_5",
            "name": "Infiltration",
            "description": "+18% avoidance",
            "icon": "🌑",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "avoidance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_6",
            "name": "Spy Network",
            "description": "+20% sensor",
            "icon": "📡",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_7",
            "name": "Master Saboteur",
            "description": "+35% EW, +25% sabotage",
            "icon": "🔥",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "si_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_8",
            "name": "Electronic Dominance",
            "description": "+30% EW strength",
            "icon": "📻",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_9",
            "name": "Disable Systems",
            "description": "+30% CC strength",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "crowdControl",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_8"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_10",
            "name": "Shadow Network",
            "description": "+50% EW, can hack modules",
            "icon": "🕸️",
            "rarity": "keystone",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "si_7"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_11",
            "name": "EMP Storm",
            "description": "+45% EW, +35% CC",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_12",
            "name": "Invisible Empire",
            "description": "+60% EW, +40% avoidance",
            "icon": "🌑",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "si_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_13",
            "name": "EW Overlord",
            "description": "+80% EW, +50% CC",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "si_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_14",
            "name": "Shadow Emperor",
            "description": "+100% EW, control ships 10s",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "si_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_15",
            "name": "Eternal Shadow",
            "description": "+120% EW, undetectable",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "si_14"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_16",
            "name": "Network Supreme",
            "description": "+60% sensor, +50% targeting",
            "icon": "📡",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "sensorStrength",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "si_14"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          },
          {
            "id": "si_17",
            "name": "Master of Shadows",
            "description": "+150% EW, +100% CC",
            "icon": "🌀",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "si_12"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_infiltrator"
          }
        ]
      },
      {
        "id": "spymaster_manipulator",
        "name": "Manipulator",
        "description": "Social engineering and subterfuge.",
        "icon": "🎭",
        "nodes": [
          {
            "id": "sm_1",
            "name": "Silver Tongue",
            "description": "+10% diplomacy",
            "icon": "🗣️",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_2",
            "name": "Prestige Gain",
            "description": "+12% prestige",
            "icon": "⭐",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "prestigeBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_1"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_3",
            "name": "Blackmail",
            "description": "+15% spy rewards",
            "icon": "📋",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_2"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_4",
            "name": "Espionage Boost",
            "description": "+15% espionage success",
            "icon": "🕵️",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "electronicWarfare",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_5",
            "name": "Social Network",
            "description": "+20% diplomacy",
            "icon": "🌐",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_6",
            "name": "Trade Routes",
            "description": "+15% trade profit",
            "icon": "💰",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_7",
            "name": "Puppet Master",
            "description": "+30% diplomacy, +20% prestige",
            "icon": "🎭",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_8",
            "name": "Influence",
            "description": "+25% prestige",
            "icon": "⭐",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "prestigeBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_9",
            "name": "Black Market",
            "description": "+30% trade profit",
            "icon": "🏴",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_8"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_10",
            "name": "Mind Control",
            "description": "+50% diplomacy, convert diplomats",
            "icon": "🧠",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_7"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_11",
            "name": "Prestige Empire",
            "description": "+50% prestige",
            "icon": "💎",
            "rarity": "normal",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "prestigeBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_12",
            "name": "Political Dominance",
            "description": "+60% diplomacy, +40% prestige",
            "icon": "👑",
            "rarity": "keystone",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_13",
            "name": "Diplomacy Overlord",
            "description": "+80% diplomacy, +60% prestige",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_14",
            "name": "Galactic Puppeteer",
            "description": "+100% diplomacy, control alliances",
            "icon": "👁️",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_15",
            "name": "Eternal Manipulator",
            "description": "+120% diplomacy, +100% espionage",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_12"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_16",
            "name": "Puppet Emperor",
            "description": "+100% diplomacy, control alliances",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "diplomacyBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_12"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          },
          {
            "id": "sm_17",
            "name": "Supreme Manipulator",
            "description": "+100% prestige, +80% diplomacy",
            "icon": "🌌",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "prestigeBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sm_16"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_manipulator"
          }
        ]
      },
      {
        "id": "spymaster_assassin",
        "name": "Assassin",
        "description": "Precision strikes and target elimination.",
        "icon": "🗡️",
        "nodes": [
          {
            "id": "sa_1",
            "name": "Precision Strike",
            "description": "+8% crit chance",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_2",
            "name": "Lethal Damage",
            "description": "+15% crit damage",
            "icon": "💀",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_1"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_3",
            "name": "Targeting",
            "description": "+15% targeting",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "targetingSpeed",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_2"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_4",
            "name": "First Strike",
            "description": "+20% first strike damage",
            "icon": "⚡",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_5",
            "name": "Silent Kill",
            "description": "+18% avoidance",
            "icon": "👻",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "avoidance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_6",
            "name": "Assassination",
            "description": "+22% weapon damage",
            "icon": "🗡️",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_7",
            "name": "Death Mark",
            "description": "+25% damage to single targets",
            "icon": "☠️",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_8",
            "name": "Expert Marksman",
            "description": "+20% crit chance",
            "icon": "🎯",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_3"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_9",
            "name": "Critical Mastery",
            "description": "+40% crit damage",
            "icon": "💥",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponCritDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_8"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_10",
            "name": "Deadly Focus",
            "description": "+40% crit, +50% crit damage",
            "icon": "🗡️",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_7"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_11",
            "name": "Shadow Blade",
            "description": "+50% weapon damage",
            "icon": "🌑",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_12",
            "name": "Phantom Strike",
            "description": "+60% crit, +70% crit damage",
            "icon": "👻",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_10"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_13",
            "name": "Death Dealer",
            "description": "+70% weapon, +50% crit",
            "icon": "☠️",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_14",
            "name": "Assassin Supreme",
            "description": "+100% crit, +100% crit damage",
            "icon": "👻",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_11"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_15",
            "name": "Eternal Assassin",
            "description": "+120% crit, +120% crit damage",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_14"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_16",
            "name": "Silent Death",
            "description": "+90% weapon, +70% crit",
            "icon": "💀",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_14"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          },
          {
            "id": "sa_17",
            "name": "Perfect Kill",
            "description": "+150% crit, +130% crit damage",
            "icon": "🗡️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponCritChance",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sa_14"
            ],
            "ascendancyClass": "spymaster",
            "subClass": "spymaster_assassin"
          }
        ]
      }
    ]
  },
  {
    "id": "summoner",
    "name": "Summoner",
    "description": "Masters of summoner specialization.",
    "icon": "🐉",
    "color": "#ec4899",
    "ascendancyClass": "summoner",
    "subClasses": [
      {
        "id": "summoner_beastmaster",
        "name": "Beastmaster",
        "description": "Command powerful companions.",
        "icon": "🐾",
        "nodes": [
          {
            "id": "sbm_1",
            "name": "Companion Bond",
            "description": "+10% summon power",
            "icon": "🐾",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_2",
            "name": "Pack Leader",
            "description": "+12% crew efficiency",
            "icon": "👥",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_1"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_3",
            "name": "Feral Instinct",
            "description": "+15% summon power",
            "icon": "🦁",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_2"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_4",
            "name": "Swarm",
            "description": "+20% summon count",
            "icon": "🐝",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_5",
            "name": "Beast Taming",
            "description": "+18% crew efficiency",
            "icon": "🐾",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_6",
            "name": "Frenzy",
            "description": "+22% summon power",
            "icon": "🔥",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_7",
            "name": "Alpha Companion",
            "description": "+30% summon, +20% crew",
            "icon": "🐉",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_8",
            "name": "Pack Tactics",
            "description": "+20% damage per summon",
            "icon": "🐺",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_9",
            "name": "Beast Army",
            "description": "+40% summon count, +30% power",
            "icon": "🦁",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_8"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_10",
            "name": "Apex Predator",
            "description": "+50% summon, summons immune 5s",
            "icon": "👑",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_7"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_11",
            "name": "Pack Alpha",
            "description": "+45% damage per summon",
            "icon": "🐺",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_12",
            "name": "Monster Lord",
            "description": "+60% summon, +40% crew",
            "icon": "🐉",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_13",
            "name": "Beast Master Supreme",
            "description": "+80% summon, +60% crew",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_14",
            "name": "Legendary Beast",
            "description": "+100% summon, +50% crew",
            "icon": "🌟",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_15",
            "name": "Eternal Beastmaster",
            "description": "+120% summon, +80% crew",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_16",
            "name": "Monster King",
            "description": "+100% summon, +70% crew",
            "icon": "👑",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          },
          {
            "id": "sbm_17",
            "name": "Cosmic Beast",
            "description": "+150% summon, +100% crew",
            "icon": "🌌",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "summonPower",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sbm_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_beastmaster"
          }
        ]
      },
      {
        "id": "summoner_commander",
        "name": "Fleet Commander",
        "description": "Maximize fleet synergy.",
        "icon": "🎖️",
        "nodes": [
          {
            "id": "sfc_1",
            "name": "Command Training",
            "description": "+10% crew efficiency",
            "icon": "👥",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_2",
            "name": "Fleet Coordination",
            "description": "+12% command range",
            "icon": "📡",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "fleetCommandRange",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_1"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_3",
            "name": "Battle Hardened",
            "description": "+15% crew efficiency",
            "icon": "🎖️",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_2"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_4",
            "name": "Leadership Aura",
            "description": "+15% all stats for nearby",
            "icon": "✨",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_5",
            "name": "Fleet Tactics",
            "description": "+18% fleet damage",
            "icon": "📋",
            "rarity": "normal",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_6",
            "name": "Command Presence",
            "description": "+22% crew efficiency",
            "icon": "⭐",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_7",
            "name": "Admiral",
            "description": "+30% crew, +25% range",
            "icon": "⚓",
            "rarity": "notable",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_8",
            "name": "Battle Commander",
            "description": "+25% fleet damage, +20% speed",
            "icon": "⚔️",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_9",
            "name": "Grand Fleet",
            "description": "+35% fleet damage",
            "icon": "🚀",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_8"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_10",
            "name": "Supreme Admiral",
            "description": "+60% crew, +20% all stats",
            "icon": "🏆",
            "rarity": "keystone",
            "tier": 60,
            "requiredLevel": 600,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_7"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_11",
            "name": "Command Empire",
            "description": "+50% range, +35% crew",
            "icon": "📡",
            "rarity": "normal",
            "tier": 75,
            "requiredLevel": 750,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "fleetCommandRange",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_12",
            "name": "Fleet Master",
            "description": "+70% crew, +40% all stats",
            "icon": "⚓",
            "rarity": "keystone",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_13",
            "name": "Supreme Leader",
            "description": "+60% fleet damage, +40% speed",
            "icon": "🏆",
            "rarity": "notable",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_14",
            "name": "Galactic Overlord",
            "description": "+100% crew, +50% all stats",
            "icon": "☄️",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_15",
            "name": "Eternal Admiral",
            "description": "+120% crew, +80% all stats",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 6,
            "y": 2,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_12"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_16",
            "name": "Legendary Commander",
            "description": "+100% crew, +50% all stats",
            "icon": "👑",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "crewEfficiency",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_12"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          },
          {
            "id": "sfc_17",
            "name": "Command Eternal",
            "description": "+80% fleet damage, +60% stats",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "weaponDamage",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sfc_16"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_commander"
          }
        ]
      },
      {
        "id": "summoner_alchemist",
        "name": "Alchemist",
        "description": "Craft consumables and augmentations.",
        "icon": "⚗️",
        "nodes": [
          {
            "id": "sal_1",
            "name": "Basic Crafting",
            "description": "+10% resource bonus",
            "icon": "🧪",
            "rarity": "normal",
            "tier": 1,
            "requiredLevel": 10,
            "requiredPoints": 1,
            "x": 0,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_2",
            "name": "Potion Mastery",
            "description": "+12% XP bonus",
            "icon": "⭐",
            "rarity": "normal",
            "tier": 5,
            "requiredLevel": 50,
            "requiredPoints": 1,
            "x": 1,
            "y": 0,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_1"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_3",
            "name": "Transmutation",
            "description": "+15% resource bonus",
            "icon": "⚗️",
            "rarity": "normal",
            "tier": 10,
            "requiredLevel": 100,
            "requiredPoints": 1,
            "x": 2,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_2"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_4",
            "name": "Turn Optimizer",
            "description": "+15% turn efficiency",
            "icon": "⏱️",
            "rarity": "normal",
            "tier": 20,
            "requiredLevel": 200,
            "requiredPoints": 2,
            "x": 2,
            "y": 1,
            "modifiers": [
              {
                "stat": "turnEfficiency",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_5",
            "name": "Resource Alchemy",
            "description": "+20% resource bonus",
            "icon": "💰",
            "rarity": "normal",
            "tier": 30,
            "requiredLevel": 300,
            "requiredPoints": 3,
            "x": 3,
            "y": 1,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_6",
            "name": "Crafting Boost",
            "description": "+18% build speed",
            "icon": "🔧",
            "rarity": "normal",
            "tier": 35,
            "requiredLevel": 350,
            "requiredPoints": 4,
            "x": 3,
            "y": 2,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_7",
            "name": "Philosopher Stone",
            "description": "+30% resources, +20% XP",
            "icon": "💎",
            "rarity": "notable",
            "tier": 25,
            "requiredLevel": 250,
            "requiredPoints": 3,
            "x": 3,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_8",
            "name": "Elixir Expert",
            "description": "+25% XP bonus",
            "icon": "🧪",
            "rarity": "normal",
            "tier": 40,
            "requiredLevel": 400,
            "requiredPoints": 5,
            "x": 4,
            "y": 1,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_3"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_9",
            "name": "Master Alchemist",
            "description": "+40% XP, +30% resources",
            "icon": "⚗️",
            "rarity": "normal",
            "tier": 55,
            "requiredLevel": 550,
            "requiredPoints": 5,
            "x": 5,
            "y": 1,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_8"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_10",
            "name": "Golden Touch",
            "description": "+50% resources, -30% crafting costs",
            "icon": "🥇",
            "rarity": "keystone",
            "tier": 50,
            "requiredLevel": 500,
            "requiredPoints": 5,
            "x": 4,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_7"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_11",
            "name": "Crafting Master",
            "description": "+50% build, +35% resources",
            "icon": "🏗️",
            "rarity": "normal",
            "tier": 70,
            "requiredLevel": 700,
            "requiredPoints": 8,
            "x": 5,
            "y": 2,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_12",
            "name": "Transmutation God",
            "description": "+70% resources, +50% XP",
            "icon": "💎",
            "rarity": "keystone",
            "tier": 65,
            "requiredLevel": 650,
            "requiredPoints": 8,
            "x": 5,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 40,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_10"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_13",
            "name": "Alchemy Overlord",
            "description": "+60% XP, +50% resources",
            "icon": "🌟",
            "rarity": "notable",
            "tier": 80,
            "requiredLevel": 800,
            "requiredPoints": 10,
            "x": 6,
            "y": 1,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 25,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_14",
            "name": "Elixir of Eternity",
            "description": "+100% all bonuses, craft legendaries",
            "icon": "🏆",
            "rarity": "ascendancy",
            "tier": 90,
            "requiredLevel": 900,
            "requiredPoints": 12,
            "x": 6,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_11"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_15",
            "name": "Eternal Alchemist",
            "description": "+120% resources, +100% XP",
            "icon": "♾️",
            "rarity": "ascendancy",
            "tier": 99,
            "requiredLevel": 999,
            "requiredPoints": 20,
            "x": 7,
            "y": 0,
            "modifiers": [
              {
                "stat": "resourceBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_16",
            "name": "Supreme Crafter",
            "description": "+80% build, +60% resources",
            "icon": "🏆",
            "rarity": "normal",
            "tier": 85,
            "requiredLevel": 850,
            "requiredPoints": 10,
            "x": 7,
            "y": 1,
            "modifiers": [
              {
                "stat": "buildSpeedBonus",
                "value": 15,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          },
          {
            "id": "sal_17",
            "name": "Cosmic Alchemist",
            "description": "+100% XP, +80% resources",
            "icon": "🌌",
            "rarity": "ascendancy",
            "tier": 95,
            "requiredLevel": 950,
            "requiredPoints": 15,
            "x": 7,
            "y": 2,
            "modifiers": [
              {
                "stat": "xpBonus",
                "value": 80,
                "isPercent": true
              }
            ],
            "requires": [
              "sal_14"
            ],
            "ascendancyClass": "summoner",
            "subClass": "summoner_alchemist"
          }
        ]
      }
    ]
  }
];

export const TOTAL_TALENT_NODES = 314;

export function getTalentPointsForLevel(level: number): number {
  let points = level;
  if (level >= 100) points += 10;
  if (level >= 300) points += 30;
  if (level >= 600) points += 60;
  if (level >= 999) points += 100;
  return points;
}

export function getAscendancyPointsForLevel(level: number): number {
  let points = 0;
  if (level >= 100) points += 1;
  if (level >= 300) points += 1;
  if (level >= 600) points += 1;
  if (level >= 999) points += 1;
  return points;
}

export function canAllocateNode(
  node: TalentNode,
  state: CommanderTalentState,
  commanderLevel: number,
  availablePoints: number
): boolean {
  if (state.allocatedNodes.includes(node.id)) return false;
  if (commanderLevel < node.requiredLevel) return false;
  const spentOnTree = state.allocatedNodes.length;
  const totalPoints = getTalentPointsForLevel(commanderLevel);
  const remaining = totalPoints - spentOnTree;
  if (remaining < node.requiredPoints) return false;
  if (node.requires && node.requires.length > 0) {
    const hasAllPrereqs = node.requires.every(reqId => state.allocatedNodes.includes(reqId));
    if (!hasAllPrereqs) return false;
  }
  if (node.rarity === 'ascendancy') {
    if (state.ascendancyPointsSpent >= state.ascendancyPoints) return false;
  }
  return true;
}

export function calculateTalentModifiers(
  state: CommanderTalentState
): Partial<Record<StatType, number>> {
  const modifiers: Partial<Record<StatType, number>> = {};
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      for (const node of sub.nodes) {
        if (state.allocatedNodes.includes(node.id)) {
          for (const mod of node.modifiers) {
            modifiers[mod.stat] = (modifiers[mod.stat] || 0) + mod.value;
          }
        }
      }
    }
  }
  return modifiers;
}

export function getAllNodes(): TalentNode[] {
  const nodes: TalentNode[] = [];
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      nodes.push(...sub.nodes);
    }
  }
  return nodes;
}

export function getNodeById(id: string): TalentNode | undefined {
  return getAllNodes().find(n => n.id === id);
}
