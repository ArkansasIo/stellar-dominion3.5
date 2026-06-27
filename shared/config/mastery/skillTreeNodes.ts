// AUTO-GENERATED: 2026-06-20T04:13:39.505Z
export const SKILL_TREE_MAX_LEVEL = 999;
export const SKILL_TREE_MAX_TIER = 99;
export const SKILL_TREE_LEVELS_PER_TIER = 11;
export const TOTAL_SKILL_TREE_NODES = 513;

export type SkillBranch = "warfare" | "logistics" | "science" | "engineering" | "diplomacy" | "espionage" | "exploration" | "mysticism" | "industry" | "command";

export type NodeType = "normal" | "notable" | "keystone" | "legendary";

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  level: number;
  branch: SkillBranch;
  type: NodeType;
  cost: number;
  effects: Record<string, number>;
  prerequisiteIds: string[];
}

export const BRANCH_NAMES: Record<SkillBranch, string> = {
  warfare: "Warfare Doctrine",
  logistics: "Logistics Chain",
  science: "Scientific Mastery",
  engineering: "Engineering Matrix",
  diplomacy: "Diplomatic Influence",
  espionage: "Shadow Intelligence",
  exploration: "Frontier Explorer",
  mysticism: "Arcane Weaving",
  industry: "Industrial Titan",
  command: "Command Authority",
};

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  {
    "id": "stn_0",
    "name": "Novice Core",
    "description": "Notable skill node for logistics at tier 1.",
    "tier": 1,
    "level": 1,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": []
  },
  {
    "id": "stn_1",
    "name": "Novice Node",
    "description": "Standard skill node for logistics at tier 1.",
    "tier": 1,
    "level": 4,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 6
    },
    "prerequisiteIds": []
  },
  {
    "id": "stn_2",
    "name": "Novice Focus",
    "description": "Notable skill node for logistics at tier 1.",
    "tier": 1,
    "level": 8,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": []
  },
  {
    "id": "stn_3",
    "name": "Initiate Core",
    "description": "Notable skill node for science at tier 2.",
    "tier": 2,
    "level": 12,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_0"
    ]
  },
  {
    "id": "stn_4",
    "name": "Initiate Node",
    "description": "Standard skill node for science at tier 2.",
    "tier": 2,
    "level": 15,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 7
    },
    "prerequisiteIds": [
      "stn_1"
    ]
  },
  {
    "id": "stn_5",
    "name": "Initiate Focus",
    "description": "Notable skill node for science at tier 2.",
    "tier": 2,
    "level": 19,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_2"
    ]
  },
  {
    "id": "stn_6",
    "name": "Apprentice Core",
    "description": "Notable skill node for engineering at tier 3.",
    "tier": 3,
    "level": 23,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_3"
    ]
  },
  {
    "id": "stn_7",
    "name": "Apprentice Node",
    "description": "Standard skill node for engineering at tier 3.",
    "tier": 3,
    "level": 26,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 8
    },
    "prerequisiteIds": [
      "stn_4"
    ]
  },
  {
    "id": "stn_8",
    "name": "Apprentice Focus",
    "description": "Notable skill node for engineering at tier 3.",
    "tier": 3,
    "level": 30,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "espionagePower": 15
    },
    "prerequisiteIds": [
      "stn_5"
    ]
  },
  {
    "id": "stn_9",
    "name": "Student Core",
    "description": "Notable skill node for diplomacy at tier 4.",
    "tier": 4,
    "level": 34,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_6"
    ]
  },
  {
    "id": "stn_10",
    "name": "Student Node",
    "description": "Standard skill node for diplomacy at tier 4.",
    "tier": 4,
    "level": 37,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 9
    },
    "prerequisiteIds": [
      "stn_7"
    ]
  },
  {
    "id": "stn_11",
    "name": "Student Focus",
    "description": "Notable skill node for diplomacy at tier 4.",
    "tier": 4,
    "level": 41,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "evasion": 15
    },
    "prerequisiteIds": [
      "stn_8"
    ]
  },
  {
    "id": "stn_12",
    "name": "Acolyte Core",
    "description": "Notable skill node for espionage at tier 5.",
    "tier": 5,
    "level": 45,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "morale": 15
    },
    "prerequisiteIds": [
      "stn_9"
    ]
  },
  {
    "id": "stn_13",
    "name": "Acolyte Node",
    "description": "Standard skill node for espionage at tier 5.",
    "tier": 5,
    "level": 48,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 10
    },
    "prerequisiteIds": [
      "stn_10"
    ]
  },
  {
    "id": "stn_14",
    "name": "Acolyte Focus",
    "description": "Notable skill node for espionage at tier 5.",
    "tier": 5,
    "level": 52,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_11"
    ]
  },
  {
    "id": "stn_15",
    "name": "Disciple Core",
    "description": "Notable skill node for exploration at tier 6.",
    "tier": 6,
    "level": 56,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_12"
    ]
  },
  {
    "id": "stn_16",
    "name": "Disciple Node",
    "description": "Standard skill node for exploration at tier 6.",
    "tier": 6,
    "level": 59,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 11
    },
    "prerequisiteIds": [
      "stn_13"
    ]
  },
  {
    "id": "stn_17",
    "name": "Disciple Focus",
    "description": "Notable skill node for exploration at tier 6.",
    "tier": 6,
    "level": 63,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_14"
    ]
  },
  {
    "id": "stn_18",
    "name": "Practitioner Core",
    "description": "Notable skill node for mysticism at tier 7.",
    "tier": 7,
    "level": 67,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_15"
    ]
  },
  {
    "id": "stn_19",
    "name": "Practitioner Node",
    "description": "Standard skill node for mysticism at tier 7.",
    "tier": 7,
    "level": 70,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 12
    },
    "prerequisiteIds": [
      "stn_16"
    ]
  },
  {
    "id": "stn_20",
    "name": "Practitioner Focus",
    "description": "Notable skill node for mysticism at tier 7.",
    "tier": 7,
    "level": 74,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_17"
    ]
  },
  {
    "id": "stn_21",
    "name": "Skilled Core",
    "description": "Notable skill node for industry at tier 8.",
    "tier": 8,
    "level": 78,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_18"
    ]
  },
  {
    "id": "stn_22",
    "name": "Skilled Node",
    "description": "Standard skill node for industry at tier 8.",
    "tier": 8,
    "level": 81,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 13
    },
    "prerequisiteIds": [
      "stn_19"
    ]
  },
  {
    "id": "stn_23",
    "name": "Skilled Focus",
    "description": "Notable skill node for industry at tier 8.",
    "tier": 8,
    "level": 85,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_20"
    ]
  },
  {
    "id": "stn_24",
    "name": "Proficient Core",
    "description": "Notable skill node for command at tier 9.",
    "tier": 9,
    "level": 89,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_21"
    ]
  },
  {
    "id": "stn_25",
    "name": "Proficient Node",
    "description": "Standard skill node for command at tier 9.",
    "tier": 9,
    "level": 92,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 14
    },
    "prerequisiteIds": [
      "stn_22"
    ]
  },
  {
    "id": "stn_26",
    "name": "Proficient Focus",
    "description": "Notable skill node for command at tier 9.",
    "tier": 9,
    "level": 96,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_23"
    ]
  },
  {
    "id": "stn_27",
    "name": "Competent Core",
    "description": "Notable skill node for warfare at tier 10.",
    "tier": 10,
    "level": 100,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "diplomacyRating": 15
    },
    "prerequisiteIds": [
      "stn_24"
    ]
  },
  {
    "id": "stn_28",
    "name": "Competent Node",
    "description": "Standard skill node for warfare at tier 10.",
    "tier": 10,
    "level": 103,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 5
    },
    "prerequisiteIds": [
      "stn_25"
    ]
  },
  {
    "id": "stn_29",
    "name": "Competent Focus",
    "description": "Keystone skill node for warfare at tier 10.",
    "tier": 10,
    "level": 107,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "colonyGrowth": 25
    },
    "prerequisiteIds": [
      "stn_26"
    ]
  },
  {
    "id": "stn_30",
    "name": "Capable Core",
    "description": "Notable skill node for logistics at tier 11.",
    "tier": 11,
    "level": 111,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_27"
    ]
  },
  {
    "id": "stn_31",
    "name": "Capable Node",
    "description": "Standard skill node for logistics at tier 11.",
    "tier": 11,
    "level": 113,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 6
    },
    "prerequisiteIds": [
      "stn_28"
    ]
  },
  {
    "id": "stn_32",
    "name": "Capable Focus",
    "description": "Standard skill node for logistics at tier 11.",
    "tier": 11,
    "level": 116,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 6
    },
    "prerequisiteIds": [
      "stn_29"
    ]
  },
  {
    "id": "stn_33",
    "name": "Capable Aspect",
    "description": "Notable skill node for logistics at tier 11.",
    "tier": 11,
    "level": 119,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_29"
    ]
  },
  {
    "id": "stn_34",
    "name": "Adept Core",
    "description": "Notable skill node for science at tier 12.",
    "tier": 12,
    "level": 122,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_30"
    ]
  },
  {
    "id": "stn_35",
    "name": "Adept Node",
    "description": "Standard skill node for science at tier 12.",
    "tier": 12,
    "level": 124,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 7
    },
    "prerequisiteIds": [
      "stn_31"
    ]
  },
  {
    "id": "stn_36",
    "name": "Adept Focus",
    "description": "Standard skill node for science at tier 12.",
    "tier": 12,
    "level": 127,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 7
    },
    "prerequisiteIds": [
      "stn_32"
    ]
  },
  {
    "id": "stn_37",
    "name": "Adept Aspect",
    "description": "Notable skill node for science at tier 12.",
    "tier": 12,
    "level": 130,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_33"
    ]
  },
  {
    "id": "stn_38",
    "name": "Seasoned Core",
    "description": "Notable skill node for engineering at tier 13.",
    "tier": 13,
    "level": 133,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_34"
    ]
  },
  {
    "id": "stn_39",
    "name": "Seasoned Node",
    "description": "Standard skill node for engineering at tier 13.",
    "tier": 13,
    "level": 135,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 8
    },
    "prerequisiteIds": [
      "stn_35"
    ]
  },
  {
    "id": "stn_40",
    "name": "Seasoned Focus",
    "description": "Standard skill node for engineering at tier 13.",
    "tier": 13,
    "level": 138,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 8
    },
    "prerequisiteIds": [
      "stn_36"
    ]
  },
  {
    "id": "stn_41",
    "name": "Seasoned Aspect",
    "description": "Notable skill node for engineering at tier 13.",
    "tier": 13,
    "level": 141,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_37"
    ]
  },
  {
    "id": "stn_42",
    "name": "Veteran Core",
    "description": "Notable skill node for diplomacy at tier 14.",
    "tier": 14,
    "level": 144,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_38"
    ]
  },
  {
    "id": "stn_43",
    "name": "Veteran Node",
    "description": "Standard skill node for diplomacy at tier 14.",
    "tier": 14,
    "level": 146,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 9
    },
    "prerequisiteIds": [
      "stn_39"
    ]
  },
  {
    "id": "stn_44",
    "name": "Veteran Focus",
    "description": "Standard skill node for diplomacy at tier 14.",
    "tier": 14,
    "level": 149,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 9
    },
    "prerequisiteIds": [
      "stn_40"
    ]
  },
  {
    "id": "stn_45",
    "name": "Veteran Aspect",
    "description": "Notable skill node for diplomacy at tier 14.",
    "tier": 14,
    "level": 152,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_41"
    ]
  },
  {
    "id": "stn_46",
    "name": "Experienced Core",
    "description": "Notable skill node for espionage at tier 15.",
    "tier": 15,
    "level": 155,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_42"
    ]
  },
  {
    "id": "stn_47",
    "name": "Experienced Node",
    "description": "Standard skill node for espionage at tier 15.",
    "tier": 15,
    "level": 157,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 10
    },
    "prerequisiteIds": [
      "stn_43"
    ]
  },
  {
    "id": "stn_48",
    "name": "Experienced Focus",
    "description": "Standard skill node for espionage at tier 15.",
    "tier": 15,
    "level": 160,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 10
    },
    "prerequisiteIds": [
      "stn_44"
    ]
  },
  {
    "id": "stn_49",
    "name": "Experienced Aspect",
    "description": "Notable skill node for espionage at tier 15.",
    "tier": 15,
    "level": 163,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_45"
    ]
  },
  {
    "id": "stn_50",
    "name": "Accomplished Core",
    "description": "Notable skill node for exploration at tier 16.",
    "tier": 16,
    "level": 166,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_46"
    ]
  },
  {
    "id": "stn_51",
    "name": "Accomplished Node",
    "description": "Standard skill node for exploration at tier 16.",
    "tier": 16,
    "level": 168,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 11
    },
    "prerequisiteIds": [
      "stn_47"
    ]
  },
  {
    "id": "stn_52",
    "name": "Accomplished Focus",
    "description": "Standard skill node for exploration at tier 16.",
    "tier": 16,
    "level": 171,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 11
    },
    "prerequisiteIds": [
      "stn_48"
    ]
  },
  {
    "id": "stn_53",
    "name": "Accomplished Aspect",
    "description": "Notable skill node for exploration at tier 16.",
    "tier": 16,
    "level": 174,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_49"
    ]
  },
  {
    "id": "stn_54",
    "name": "Master Core",
    "description": "Notable skill node for mysticism at tier 17.",
    "tier": 17,
    "level": 177,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_50"
    ]
  },
  {
    "id": "stn_55",
    "name": "Master Node",
    "description": "Standard skill node for mysticism at tier 17.",
    "tier": 17,
    "level": 179,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 12
    },
    "prerequisiteIds": [
      "stn_51"
    ]
  },
  {
    "id": "stn_56",
    "name": "Master Focus",
    "description": "Standard skill node for mysticism at tier 17.",
    "tier": 17,
    "level": 182,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 12
    },
    "prerequisiteIds": [
      "stn_52"
    ]
  },
  {
    "id": "stn_57",
    "name": "Master Aspect",
    "description": "Notable skill node for mysticism at tier 17.",
    "tier": 17,
    "level": 185,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_53"
    ]
  },
  {
    "id": "stn_58",
    "name": "Expert Core",
    "description": "Notable skill node for industry at tier 18.",
    "tier": 18,
    "level": 188,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_54"
    ]
  },
  {
    "id": "stn_59",
    "name": "Expert Node",
    "description": "Standard skill node for industry at tier 18.",
    "tier": 18,
    "level": 190,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 13
    },
    "prerequisiteIds": [
      "stn_55"
    ]
  },
  {
    "id": "stn_60",
    "name": "Expert Focus",
    "description": "Standard skill node for industry at tier 18.",
    "tier": 18,
    "level": 193,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 13
    },
    "prerequisiteIds": [
      "stn_56"
    ]
  },
  {
    "id": "stn_61",
    "name": "Expert Aspect",
    "description": "Notable skill node for industry at tier 18.",
    "tier": 18,
    "level": 196,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_57"
    ]
  },
  {
    "id": "stn_62",
    "name": "Specialist Core",
    "description": "Notable skill node for command at tier 19.",
    "tier": 19,
    "level": 199,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_58"
    ]
  },
  {
    "id": "stn_63",
    "name": "Specialist Node",
    "description": "Standard skill node for command at tier 19.",
    "tier": 19,
    "level": 201,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 14
    },
    "prerequisiteIds": [
      "stn_59"
    ]
  },
  {
    "id": "stn_64",
    "name": "Specialist Focus",
    "description": "Standard skill node for command at tier 19.",
    "tier": 19,
    "level": 204,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 14
    },
    "prerequisiteIds": [
      "stn_60"
    ]
  },
  {
    "id": "stn_65",
    "name": "Specialist Aspect",
    "description": "Notable skill node for command at tier 19.",
    "tier": 19,
    "level": 207,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_61"
    ]
  },
  {
    "id": "stn_66",
    "name": "Authority Core",
    "description": "Notable skill node for warfare at tier 20.",
    "tier": 20,
    "level": 210,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_62"
    ]
  },
  {
    "id": "stn_67",
    "name": "Authority Node",
    "description": "Standard skill node for warfare at tier 20.",
    "tier": 20,
    "level": 212,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 5
    },
    "prerequisiteIds": [
      "stn_63"
    ]
  },
  {
    "id": "stn_68",
    "name": "Authority Focus",
    "description": "Standard skill node for warfare at tier 20.",
    "tier": 20,
    "level": 215,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 5
    },
    "prerequisiteIds": [
      "stn_64"
    ]
  },
  {
    "id": "stn_69",
    "name": "Authority Aspect",
    "description": "Keystone skill node for warfare at tier 20.",
    "tier": 20,
    "level": 218,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "colonyGrowth": 25
    },
    "prerequisiteIds": [
      "stn_65"
    ]
  },
  {
    "id": "stn_70",
    "name": "Virtuoso Core",
    "description": "Notable skill node for logistics at tier 21.",
    "tier": 21,
    "level": 221,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_66"
    ]
  },
  {
    "id": "stn_71",
    "name": "Virtuoso Node",
    "description": "Standard skill node for logistics at tier 21.",
    "tier": 21,
    "level": 223,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 6
    },
    "prerequisiteIds": [
      "stn_67"
    ]
  },
  {
    "id": "stn_72",
    "name": "Virtuoso Focus",
    "description": "Standard skill node for logistics at tier 21.",
    "tier": 21,
    "level": 226,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 6
    },
    "prerequisiteIds": [
      "stn_68"
    ]
  },
  {
    "id": "stn_73",
    "name": "Virtuoso Aspect",
    "description": "Notable skill node for logistics at tier 21.",
    "tier": 21,
    "level": 229,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_69"
    ]
  },
  {
    "id": "stn_74",
    "name": "Luminary Core",
    "description": "Notable skill node for science at tier 22.",
    "tier": 22,
    "level": 232,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_70"
    ]
  },
  {
    "id": "stn_75",
    "name": "Luminary Node",
    "description": "Standard skill node for science at tier 22.",
    "tier": 22,
    "level": 234,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 7
    },
    "prerequisiteIds": [
      "stn_71"
    ]
  },
  {
    "id": "stn_76",
    "name": "Luminary Focus",
    "description": "Standard skill node for science at tier 22.",
    "tier": 22,
    "level": 237,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 7
    },
    "prerequisiteIds": [
      "stn_72"
    ]
  },
  {
    "id": "stn_77",
    "name": "Luminary Aspect",
    "description": "Notable skill node for science at tier 22.",
    "tier": 22,
    "level": 240,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_73"
    ]
  },
  {
    "id": "stn_78",
    "name": "Champion Core",
    "description": "Notable skill node for engineering at tier 23.",
    "tier": 23,
    "level": 243,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_74"
    ]
  },
  {
    "id": "stn_79",
    "name": "Champion Node",
    "description": "Standard skill node for engineering at tier 23.",
    "tier": 23,
    "level": 245,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 8
    },
    "prerequisiteIds": [
      "stn_75"
    ]
  },
  {
    "id": "stn_80",
    "name": "Champion Focus",
    "description": "Standard skill node for engineering at tier 23.",
    "tier": 23,
    "level": 248,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 8
    },
    "prerequisiteIds": [
      "stn_76"
    ]
  },
  {
    "id": "stn_81",
    "name": "Champion Aspect",
    "description": "Notable skill node for engineering at tier 23.",
    "tier": 23,
    "level": 251,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_77"
    ]
  },
  {
    "id": "stn_82",
    "name": "Hero Core",
    "description": "Notable skill node for diplomacy at tier 24.",
    "tier": 24,
    "level": 254,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_78"
    ]
  },
  {
    "id": "stn_83",
    "name": "Hero Node",
    "description": "Standard skill node for diplomacy at tier 24.",
    "tier": 24,
    "level": 256,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 9
    },
    "prerequisiteIds": [
      "stn_79"
    ]
  },
  {
    "id": "stn_84",
    "name": "Hero Focus",
    "description": "Standard skill node for diplomacy at tier 24.",
    "tier": 24,
    "level": 259,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 9
    },
    "prerequisiteIds": [
      "stn_80"
    ]
  },
  {
    "id": "stn_85",
    "name": "Hero Aspect",
    "description": "Notable skill node for diplomacy at tier 24.",
    "tier": 24,
    "level": 262,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_81"
    ]
  },
  {
    "id": "stn_86",
    "name": "Mythic Core",
    "description": "Notable skill node for espionage at tier 25.",
    "tier": 25,
    "level": 265,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_82"
    ]
  },
  {
    "id": "stn_87",
    "name": "Mythic Node",
    "description": "Standard skill node for espionage at tier 25.",
    "tier": 25,
    "level": 267,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 10
    },
    "prerequisiteIds": [
      "stn_83"
    ]
  },
  {
    "id": "stn_88",
    "name": "Mythic Focus",
    "description": "Standard skill node for espionage at tier 25.",
    "tier": 25,
    "level": 270,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 10
    },
    "prerequisiteIds": [
      "stn_84"
    ]
  },
  {
    "id": "stn_89",
    "name": "Mythic Aspect",
    "description": "Notable skill node for espionage at tier 25.",
    "tier": 25,
    "level": 273,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_85"
    ]
  },
  {
    "id": "stn_90",
    "name": "Legendary Core",
    "description": "Notable skill node for exploration at tier 26.",
    "tier": 26,
    "level": 276,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_86"
    ]
  },
  {
    "id": "stn_91",
    "name": "Legendary Node",
    "description": "Standard skill node for exploration at tier 26.",
    "tier": 26,
    "level": 278,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 11
    },
    "prerequisiteIds": [
      "stn_87"
    ]
  },
  {
    "id": "stn_92",
    "name": "Legendary Focus",
    "description": "Standard skill node for exploration at tier 26.",
    "tier": 26,
    "level": 281,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 11
    },
    "prerequisiteIds": [
      "stn_88"
    ]
  },
  {
    "id": "stn_93",
    "name": "Legendary Aspect",
    "description": "Notable skill node for exploration at tier 26.",
    "tier": 26,
    "level": 284,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_89"
    ]
  },
  {
    "id": "stn_94",
    "name": "Epic Core",
    "description": "Notable skill node for mysticism at tier 27.",
    "tier": 27,
    "level": 287,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_90"
    ]
  },
  {
    "id": "stn_95",
    "name": "Epic Node",
    "description": "Standard skill node for mysticism at tier 27.",
    "tier": 27,
    "level": 289,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 12
    },
    "prerequisiteIds": [
      "stn_91"
    ]
  },
  {
    "id": "stn_96",
    "name": "Epic Focus",
    "description": "Standard skill node for mysticism at tier 27.",
    "tier": 27,
    "level": 292,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 12
    },
    "prerequisiteIds": [
      "stn_92"
    ]
  },
  {
    "id": "stn_97",
    "name": "Epic Aspect",
    "description": "Notable skill node for mysticism at tier 27.",
    "tier": 27,
    "level": 295,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_93"
    ]
  },
  {
    "id": "stn_98",
    "name": "Peerless Core",
    "description": "Notable skill node for industry at tier 28.",
    "tier": 28,
    "level": 298,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_94"
    ]
  },
  {
    "id": "stn_99",
    "name": "Peerless Node",
    "description": "Standard skill node for industry at tier 28.",
    "tier": 28,
    "level": 300,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 13
    },
    "prerequisiteIds": [
      "stn_95"
    ]
  },
  {
    "id": "stn_100",
    "name": "Peerless Focus",
    "description": "Standard skill node for industry at tier 28.",
    "tier": 28,
    "level": 303,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 13
    },
    "prerequisiteIds": [
      "stn_96"
    ]
  },
  {
    "id": "stn_101",
    "name": "Peerless Aspect",
    "description": "Notable skill node for industry at tier 28.",
    "tier": 28,
    "level": 306,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_97"
    ]
  },
  {
    "id": "stn_102",
    "name": "Transcendent Core",
    "description": "Notable skill node for command at tier 29.",
    "tier": 29,
    "level": 309,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_98"
    ]
  },
  {
    "id": "stn_103",
    "name": "Transcendent Node",
    "description": "Standard skill node for command at tier 29.",
    "tier": 29,
    "level": 311,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 14
    },
    "prerequisiteIds": [
      "stn_99"
    ]
  },
  {
    "id": "stn_104",
    "name": "Transcendent Focus",
    "description": "Standard skill node for command at tier 29.",
    "tier": 29,
    "level": 314,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 14
    },
    "prerequisiteIds": [
      "stn_100"
    ]
  },
  {
    "id": "stn_105",
    "name": "Transcendent Aspect",
    "description": "Notable skill node for command at tier 29.",
    "tier": 29,
    "level": 317,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_101"
    ]
  },
  {
    "id": "stn_106",
    "name": "Celestial Core",
    "description": "Notable skill node for warfare at tier 30.",
    "tier": 30,
    "level": 320,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_102"
    ]
  },
  {
    "id": "stn_107",
    "name": "Celestial Node",
    "description": "Standard skill node for warfare at tier 30.",
    "tier": 30,
    "level": 322,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 5
    },
    "prerequisiteIds": [
      "stn_103"
    ]
  },
  {
    "id": "stn_108",
    "name": "Celestial Focus",
    "description": "Standard skill node for warfare at tier 30.",
    "tier": 30,
    "level": 325,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 5
    },
    "prerequisiteIds": [
      "stn_104"
    ]
  },
  {
    "id": "stn_109",
    "name": "Celestial Aspect",
    "description": "Keystone skill node for warfare at tier 30.",
    "tier": 30,
    "level": 328,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "colonyGrowth": 25
    },
    "prerequisiteIds": [
      "stn_105"
    ]
  },
  {
    "id": "stn_110",
    "name": "Divine Core",
    "description": "Notable skill node for logistics at tier 31.",
    "tier": 31,
    "level": 331,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_106"
    ]
  },
  {
    "id": "stn_111",
    "name": "Divine Node",
    "description": "Standard skill node for logistics at tier 31.",
    "tier": 31,
    "level": 333,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 6
    },
    "prerequisiteIds": [
      "stn_107"
    ]
  },
  {
    "id": "stn_112",
    "name": "Divine Focus",
    "description": "Standard skill node for logistics at tier 31.",
    "tier": 31,
    "level": 335,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 6
    },
    "prerequisiteIds": [
      "stn_108"
    ]
  },
  {
    "id": "stn_113",
    "name": "Divine Aspect",
    "description": "Standard skill node for logistics at tier 31.",
    "tier": 31,
    "level": 337,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 6
    },
    "prerequisiteIds": [
      "stn_109"
    ]
  },
  {
    "id": "stn_114",
    "name": "Divine Mastery",
    "description": "Notable skill node for logistics at tier 31.",
    "tier": 31,
    "level": 339,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_109"
    ]
  },
  {
    "id": "stn_115",
    "name": "Ascendant Core",
    "description": "Notable skill node for science at tier 32.",
    "tier": 32,
    "level": 342,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_110"
    ]
  },
  {
    "id": "stn_116",
    "name": "Ascendant Node",
    "description": "Standard skill node for science at tier 32.",
    "tier": 32,
    "level": 344,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 7
    },
    "prerequisiteIds": [
      "stn_111"
    ]
  },
  {
    "id": "stn_117",
    "name": "Ascendant Focus",
    "description": "Standard skill node for science at tier 32.",
    "tier": 32,
    "level": 346,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 7
    },
    "prerequisiteIds": [
      "stn_112"
    ]
  },
  {
    "id": "stn_118",
    "name": "Ascendant Aspect",
    "description": "Standard skill node for science at tier 32.",
    "tier": 32,
    "level": 348,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 7
    },
    "prerequisiteIds": [
      "stn_113"
    ]
  },
  {
    "id": "stn_119",
    "name": "Ascendant Mastery",
    "description": "Notable skill node for science at tier 32.",
    "tier": 32,
    "level": 350,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_114"
    ]
  },
  {
    "id": "stn_120",
    "name": "Supreme Core",
    "description": "Notable skill node for engineering at tier 33.",
    "tier": 33,
    "level": 353,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_115"
    ]
  },
  {
    "id": "stn_121",
    "name": "Supreme Node",
    "description": "Standard skill node for engineering at tier 33.",
    "tier": 33,
    "level": 355,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 8
    },
    "prerequisiteIds": [
      "stn_116"
    ]
  },
  {
    "id": "stn_122",
    "name": "Supreme Focus",
    "description": "Standard skill node for engineering at tier 33.",
    "tier": 33,
    "level": 357,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 8
    },
    "prerequisiteIds": [
      "stn_117"
    ]
  },
  {
    "id": "stn_123",
    "name": "Supreme Aspect",
    "description": "Standard skill node for engineering at tier 33.",
    "tier": 33,
    "level": 359,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 8
    },
    "prerequisiteIds": [
      "stn_118"
    ]
  },
  {
    "id": "stn_124",
    "name": "Supreme Mastery",
    "description": "Notable skill node for engineering at tier 33.",
    "tier": 33,
    "level": 361,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_119"
    ]
  },
  {
    "id": "stn_125",
    "name": "Sovereign Core",
    "description": "Notable skill node for diplomacy at tier 34.",
    "tier": 34,
    "level": 364,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_120"
    ]
  },
  {
    "id": "stn_126",
    "name": "Sovereign Node",
    "description": "Standard skill node for diplomacy at tier 34.",
    "tier": 34,
    "level": 366,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 9
    },
    "prerequisiteIds": [
      "stn_121"
    ]
  },
  {
    "id": "stn_127",
    "name": "Sovereign Focus",
    "description": "Standard skill node for diplomacy at tier 34.",
    "tier": 34,
    "level": 368,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 9
    },
    "prerequisiteIds": [
      "stn_122"
    ]
  },
  {
    "id": "stn_128",
    "name": "Sovereign Aspect",
    "description": "Standard skill node for diplomacy at tier 34.",
    "tier": 34,
    "level": 370,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 9
    },
    "prerequisiteIds": [
      "stn_123"
    ]
  },
  {
    "id": "stn_129",
    "name": "Sovereign Mastery",
    "description": "Notable skill node for diplomacy at tier 34.",
    "tier": 34,
    "level": 372,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_124"
    ]
  },
  {
    "id": "stn_130",
    "name": "Overlord Core",
    "description": "Notable skill node for espionage at tier 35.",
    "tier": 35,
    "level": 375,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_125"
    ]
  },
  {
    "id": "stn_131",
    "name": "Overlord Node",
    "description": "Standard skill node for espionage at tier 35.",
    "tier": 35,
    "level": 377,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 10
    },
    "prerequisiteIds": [
      "stn_126"
    ]
  },
  {
    "id": "stn_132",
    "name": "Overlord Focus",
    "description": "Standard skill node for espionage at tier 35.",
    "tier": 35,
    "level": 379,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 10
    },
    "prerequisiteIds": [
      "stn_127"
    ]
  },
  {
    "id": "stn_133",
    "name": "Overlord Aspect",
    "description": "Standard skill node for espionage at tier 35.",
    "tier": 35,
    "level": 381,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 10
    },
    "prerequisiteIds": [
      "stn_128"
    ]
  },
  {
    "id": "stn_134",
    "name": "Overlord Mastery",
    "description": "Notable skill node for espionage at tier 35.",
    "tier": 35,
    "level": 383,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_129"
    ]
  },
  {
    "id": "stn_135",
    "name": "Tyrant Core",
    "description": "Notable skill node for exploration at tier 36.",
    "tier": 36,
    "level": 386,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_130"
    ]
  },
  {
    "id": "stn_136",
    "name": "Tyrant Node",
    "description": "Standard skill node for exploration at tier 36.",
    "tier": 36,
    "level": 388,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 11
    },
    "prerequisiteIds": [
      "stn_131"
    ]
  },
  {
    "id": "stn_137",
    "name": "Tyrant Focus",
    "description": "Standard skill node for exploration at tier 36.",
    "tier": 36,
    "level": 390,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 11
    },
    "prerequisiteIds": [
      "stn_132"
    ]
  },
  {
    "id": "stn_138",
    "name": "Tyrant Aspect",
    "description": "Standard skill node for exploration at tier 36.",
    "tier": 36,
    "level": 392,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 11
    },
    "prerequisiteIds": [
      "stn_133"
    ]
  },
  {
    "id": "stn_139",
    "name": "Tyrant Mastery",
    "description": "Notable skill node for exploration at tier 36.",
    "tier": 36,
    "level": 394,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_134"
    ]
  },
  {
    "id": "stn_140",
    "name": "Warlord Core",
    "description": "Notable skill node for mysticism at tier 37.",
    "tier": 37,
    "level": 397,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_135"
    ]
  },
  {
    "id": "stn_141",
    "name": "Warlord Node",
    "description": "Standard skill node for mysticism at tier 37.",
    "tier": 37,
    "level": 399,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 12
    },
    "prerequisiteIds": [
      "stn_136"
    ]
  },
  {
    "id": "stn_142",
    "name": "Warlord Focus",
    "description": "Standard skill node for mysticism at tier 37.",
    "tier": 37,
    "level": 401,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 12
    },
    "prerequisiteIds": [
      "stn_137"
    ]
  },
  {
    "id": "stn_143",
    "name": "Warlord Aspect",
    "description": "Standard skill node for mysticism at tier 37.",
    "tier": 37,
    "level": 403,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 12
    },
    "prerequisiteIds": [
      "stn_138"
    ]
  },
  {
    "id": "stn_144",
    "name": "Warlord Mastery",
    "description": "Notable skill node for mysticism at tier 37.",
    "tier": 37,
    "level": 405,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_139"
    ]
  },
  {
    "id": "stn_145",
    "name": "Conqueror Core",
    "description": "Notable skill node for industry at tier 38.",
    "tier": 38,
    "level": 408,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_140"
    ]
  },
  {
    "id": "stn_146",
    "name": "Conqueror Node",
    "description": "Standard skill node for industry at tier 38.",
    "tier": 38,
    "level": 410,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 13
    },
    "prerequisiteIds": [
      "stn_141"
    ]
  },
  {
    "id": "stn_147",
    "name": "Conqueror Focus",
    "description": "Standard skill node for industry at tier 38.",
    "tier": 38,
    "level": 412,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 13
    },
    "prerequisiteIds": [
      "stn_142"
    ]
  },
  {
    "id": "stn_148",
    "name": "Conqueror Aspect",
    "description": "Standard skill node for industry at tier 38.",
    "tier": 38,
    "level": 414,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 13
    },
    "prerequisiteIds": [
      "stn_143"
    ]
  },
  {
    "id": "stn_149",
    "name": "Conqueror Mastery",
    "description": "Notable skill node for industry at tier 38.",
    "tier": 38,
    "level": 416,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_144"
    ]
  },
  {
    "id": "stn_150",
    "name": "Dominator Core",
    "description": "Notable skill node for command at tier 39.",
    "tier": 39,
    "level": 419,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_145"
    ]
  },
  {
    "id": "stn_151",
    "name": "Dominator Node",
    "description": "Standard skill node for command at tier 39.",
    "tier": 39,
    "level": 421,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 14
    },
    "prerequisiteIds": [
      "stn_146"
    ]
  },
  {
    "id": "stn_152",
    "name": "Dominator Focus",
    "description": "Standard skill node for command at tier 39.",
    "tier": 39,
    "level": 423,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 14
    },
    "prerequisiteIds": [
      "stn_147"
    ]
  },
  {
    "id": "stn_153",
    "name": "Dominator Aspect",
    "description": "Standard skill node for command at tier 39.",
    "tier": 39,
    "level": 425,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 14
    },
    "prerequisiteIds": [
      "stn_148"
    ]
  },
  {
    "id": "stn_154",
    "name": "Dominator Mastery",
    "description": "Notable skill node for command at tier 39.",
    "tier": 39,
    "level": 427,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_149"
    ]
  },
  {
    "id": "stn_155",
    "name": "Sovereign Core",
    "description": "Notable skill node for warfare at tier 40.",
    "tier": 40,
    "level": 430,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_150"
    ]
  },
  {
    "id": "stn_156",
    "name": "Sovereign Node",
    "description": "Standard skill node for warfare at tier 40.",
    "tier": 40,
    "level": 432,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 5
    },
    "prerequisiteIds": [
      "stn_151"
    ]
  },
  {
    "id": "stn_157",
    "name": "Sovereign Focus",
    "description": "Standard skill node for warfare at tier 40.",
    "tier": 40,
    "level": 434,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 5
    },
    "prerequisiteIds": [
      "stn_152"
    ]
  },
  {
    "id": "stn_158",
    "name": "Sovereign Aspect",
    "description": "Standard skill node for warfare at tier 40.",
    "tier": 40,
    "level": 436,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 5
    },
    "prerequisiteIds": [
      "stn_153"
    ]
  },
  {
    "id": "stn_159",
    "name": "Sovereign Mastery",
    "description": "Keystone skill node for warfare at tier 40.",
    "tier": 40,
    "level": 438,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "constructionCost": 25
    },
    "prerequisiteIds": [
      "stn_154"
    ]
  },
  {
    "id": "stn_160",
    "name": "Titan Core",
    "description": "Notable skill node for logistics at tier 41.",
    "tier": 41,
    "level": 441,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_155"
    ]
  },
  {
    "id": "stn_161",
    "name": "Titan Node",
    "description": "Standard skill node for logistics at tier 41.",
    "tier": 41,
    "level": 443,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 6
    },
    "prerequisiteIds": [
      "stn_156"
    ]
  },
  {
    "id": "stn_162",
    "name": "Titan Focus",
    "description": "Standard skill node for logistics at tier 41.",
    "tier": 41,
    "level": 445,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 6
    },
    "prerequisiteIds": [
      "stn_157"
    ]
  },
  {
    "id": "stn_163",
    "name": "Titan Aspect",
    "description": "Standard skill node for logistics at tier 41.",
    "tier": 41,
    "level": 447,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 6
    },
    "prerequisiteIds": [
      "stn_158"
    ]
  },
  {
    "id": "stn_164",
    "name": "Titan Mastery",
    "description": "Notable skill node for logistics at tier 41.",
    "tier": 41,
    "level": 449,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_159"
    ]
  },
  {
    "id": "stn_165",
    "name": "Colossus Core",
    "description": "Notable skill node for science at tier 42.",
    "tier": 42,
    "level": 452,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_160"
    ]
  },
  {
    "id": "stn_166",
    "name": "Colossus Node",
    "description": "Standard skill node for science at tier 42.",
    "tier": 42,
    "level": 454,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 7
    },
    "prerequisiteIds": [
      "stn_161"
    ]
  },
  {
    "id": "stn_167",
    "name": "Colossus Focus",
    "description": "Standard skill node for science at tier 42.",
    "tier": 42,
    "level": 456,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 7
    },
    "prerequisiteIds": [
      "stn_162"
    ]
  },
  {
    "id": "stn_168",
    "name": "Colossus Aspect",
    "description": "Standard skill node for science at tier 42.",
    "tier": 42,
    "level": 458,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 7
    },
    "prerequisiteIds": [
      "stn_163"
    ]
  },
  {
    "id": "stn_169",
    "name": "Colossus Mastery",
    "description": "Notable skill node for science at tier 42.",
    "tier": 42,
    "level": 460,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_164"
    ]
  },
  {
    "id": "stn_170",
    "name": "Leviathan Core",
    "description": "Notable skill node for engineering at tier 43.",
    "tier": 43,
    "level": 463,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_165"
    ]
  },
  {
    "id": "stn_171",
    "name": "Leviathan Node",
    "description": "Standard skill node for engineering at tier 43.",
    "tier": 43,
    "level": 465,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 8
    },
    "prerequisiteIds": [
      "stn_166"
    ]
  },
  {
    "id": "stn_172",
    "name": "Leviathan Focus",
    "description": "Standard skill node for engineering at tier 43.",
    "tier": 43,
    "level": 467,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 8
    },
    "prerequisiteIds": [
      "stn_167"
    ]
  },
  {
    "id": "stn_173",
    "name": "Leviathan Aspect",
    "description": "Standard skill node for engineering at tier 43.",
    "tier": 43,
    "level": 469,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 8
    },
    "prerequisiteIds": [
      "stn_168"
    ]
  },
  {
    "id": "stn_174",
    "name": "Leviathan Mastery",
    "description": "Notable skill node for engineering at tier 43.",
    "tier": 43,
    "level": 471,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_169"
    ]
  },
  {
    "id": "stn_175",
    "name": "Behemoth Core",
    "description": "Notable skill node for diplomacy at tier 44.",
    "tier": 44,
    "level": 474,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_170"
    ]
  },
  {
    "id": "stn_176",
    "name": "Behemoth Node",
    "description": "Standard skill node for diplomacy at tier 44.",
    "tier": 44,
    "level": 476,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 9
    },
    "prerequisiteIds": [
      "stn_171"
    ]
  },
  {
    "id": "stn_177",
    "name": "Behemoth Focus",
    "description": "Standard skill node for diplomacy at tier 44.",
    "tier": 44,
    "level": 478,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 9
    },
    "prerequisiteIds": [
      "stn_172"
    ]
  },
  {
    "id": "stn_178",
    "name": "Behemoth Aspect",
    "description": "Standard skill node for diplomacy at tier 44.",
    "tier": 44,
    "level": 480,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 9
    },
    "prerequisiteIds": [
      "stn_173"
    ]
  },
  {
    "id": "stn_179",
    "name": "Behemoth Mastery",
    "description": "Notable skill node for diplomacy at tier 44.",
    "tier": 44,
    "level": 482,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_174"
    ]
  },
  {
    "id": "stn_180",
    "name": "Archon Core",
    "description": "Notable skill node for espionage at tier 45.",
    "tier": 45,
    "level": 485,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_175"
    ]
  },
  {
    "id": "stn_181",
    "name": "Archon Node",
    "description": "Standard skill node for espionage at tier 45.",
    "tier": 45,
    "level": 487,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 10
    },
    "prerequisiteIds": [
      "stn_176"
    ]
  },
  {
    "id": "stn_182",
    "name": "Archon Focus",
    "description": "Standard skill node for espionage at tier 45.",
    "tier": 45,
    "level": 489,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 10
    },
    "prerequisiteIds": [
      "stn_177"
    ]
  },
  {
    "id": "stn_183",
    "name": "Archon Aspect",
    "description": "Standard skill node for espionage at tier 45.",
    "tier": 45,
    "level": 491,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 10
    },
    "prerequisiteIds": [
      "stn_178"
    ]
  },
  {
    "id": "stn_184",
    "name": "Archon Mastery",
    "description": "Notable skill node for espionage at tier 45.",
    "tier": 45,
    "level": 493,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_179"
    ]
  },
  {
    "id": "stn_185",
    "name": "Seraph Core",
    "description": "Notable skill node for exploration at tier 46.",
    "tier": 46,
    "level": 496,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_180"
    ]
  },
  {
    "id": "stn_186",
    "name": "Seraph Node",
    "description": "Standard skill node for exploration at tier 46.",
    "tier": 46,
    "level": 498,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 11
    },
    "prerequisiteIds": [
      "stn_181"
    ]
  },
  {
    "id": "stn_187",
    "name": "Seraph Focus",
    "description": "Standard skill node for exploration at tier 46.",
    "tier": 46,
    "level": 500,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 11
    },
    "prerequisiteIds": [
      "stn_182"
    ]
  },
  {
    "id": "stn_188",
    "name": "Seraph Aspect",
    "description": "Standard skill node for exploration at tier 46.",
    "tier": 46,
    "level": 502,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 11
    },
    "prerequisiteIds": [
      "stn_183"
    ]
  },
  {
    "id": "stn_189",
    "name": "Seraph Mastery",
    "description": "Notable skill node for exploration at tier 46.",
    "tier": 46,
    "level": 504,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_184"
    ]
  },
  {
    "id": "stn_190",
    "name": "Cherub Core",
    "description": "Notable skill node for mysticism at tier 47.",
    "tier": 47,
    "level": 507,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_185"
    ]
  },
  {
    "id": "stn_191",
    "name": "Cherub Node",
    "description": "Standard skill node for mysticism at tier 47.",
    "tier": 47,
    "level": 509,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 12
    },
    "prerequisiteIds": [
      "stn_186"
    ]
  },
  {
    "id": "stn_192",
    "name": "Cherub Focus",
    "description": "Standard skill node for mysticism at tier 47.",
    "tier": 47,
    "level": 511,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 12
    },
    "prerequisiteIds": [
      "stn_187"
    ]
  },
  {
    "id": "stn_193",
    "name": "Cherub Aspect",
    "description": "Standard skill node for mysticism at tier 47.",
    "tier": 47,
    "level": 513,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 12
    },
    "prerequisiteIds": [
      "stn_188"
    ]
  },
  {
    "id": "stn_194",
    "name": "Cherub Mastery",
    "description": "Notable skill node for mysticism at tier 47.",
    "tier": 47,
    "level": 515,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_189"
    ]
  },
  {
    "id": "stn_195",
    "name": "Nephilim Core",
    "description": "Notable skill node for industry at tier 48.",
    "tier": 48,
    "level": 518,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_190"
    ]
  },
  {
    "id": "stn_196",
    "name": "Nephilim Node",
    "description": "Standard skill node for industry at tier 48.",
    "tier": 48,
    "level": 520,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 13
    },
    "prerequisiteIds": [
      "stn_191"
    ]
  },
  {
    "id": "stn_197",
    "name": "Nephilim Focus",
    "description": "Standard skill node for industry at tier 48.",
    "tier": 48,
    "level": 522,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 13
    },
    "prerequisiteIds": [
      "stn_192"
    ]
  },
  {
    "id": "stn_198",
    "name": "Nephilim Aspect",
    "description": "Standard skill node for industry at tier 48.",
    "tier": 48,
    "level": 524,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 13
    },
    "prerequisiteIds": [
      "stn_193"
    ]
  },
  {
    "id": "stn_199",
    "name": "Nephilim Mastery",
    "description": "Notable skill node for industry at tier 48.",
    "tier": 48,
    "level": 526,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_194"
    ]
  },
  {
    "id": "stn_200",
    "name": "Elder Core",
    "description": "Notable skill node for command at tier 49.",
    "tier": 49,
    "level": 529,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_195"
    ]
  },
  {
    "id": "stn_201",
    "name": "Elder Node",
    "description": "Standard skill node for command at tier 49.",
    "tier": 49,
    "level": 531,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 14
    },
    "prerequisiteIds": [
      "stn_196"
    ]
  },
  {
    "id": "stn_202",
    "name": "Elder Focus",
    "description": "Standard skill node for command at tier 49.",
    "tier": 49,
    "level": 533,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 14
    },
    "prerequisiteIds": [
      "stn_197"
    ]
  },
  {
    "id": "stn_203",
    "name": "Elder Aspect",
    "description": "Standard skill node for command at tier 49.",
    "tier": 49,
    "level": 535,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 14
    },
    "prerequisiteIds": [
      "stn_198"
    ]
  },
  {
    "id": "stn_204",
    "name": "Elder Mastery",
    "description": "Notable skill node for command at tier 49.",
    "tier": 49,
    "level": 537,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_199"
    ]
  },
  {
    "id": "stn_205",
    "name": "Ancient Core",
    "description": "Notable skill node for warfare at tier 50.",
    "tier": 50,
    "level": 540,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_200"
    ]
  },
  {
    "id": "stn_206",
    "name": "Ancient Node",
    "description": "Standard skill node for warfare at tier 50.",
    "tier": 50,
    "level": 542,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 5
    },
    "prerequisiteIds": [
      "stn_201"
    ]
  },
  {
    "id": "stn_207",
    "name": "Ancient Focus",
    "description": "Standard skill node for warfare at tier 50.",
    "tier": 50,
    "level": 544,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 5
    },
    "prerequisiteIds": [
      "stn_202"
    ]
  },
  {
    "id": "stn_208",
    "name": "Ancient Aspect",
    "description": "Standard skill node for warfare at tier 50.",
    "tier": 50,
    "level": 546,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 5
    },
    "prerequisiteIds": [
      "stn_203"
    ]
  },
  {
    "id": "stn_209",
    "name": "Ancient Mastery",
    "description": "Keystone skill node for warfare at tier 50.",
    "tier": 50,
    "level": 548,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "colonyGrowth": 25
    },
    "prerequisiteIds": [
      "stn_204"
    ]
  },
  {
    "id": "stn_210",
    "name": "Primordial Core",
    "description": "Notable skill node for logistics at tier 51.",
    "tier": 51,
    "level": 551,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_205"
    ]
  },
  {
    "id": "stn_211",
    "name": "Primordial Node",
    "description": "Standard skill node for logistics at tier 51.",
    "tier": 51,
    "level": 553,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 6
    },
    "prerequisiteIds": [
      "stn_206"
    ]
  },
  {
    "id": "stn_212",
    "name": "Primordial Focus",
    "description": "Standard skill node for logistics at tier 51.",
    "tier": 51,
    "level": 555,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 6
    },
    "prerequisiteIds": [
      "stn_207"
    ]
  },
  {
    "id": "stn_213",
    "name": "Primordial Aspect",
    "description": "Standard skill node for logistics at tier 51.",
    "tier": 51,
    "level": 557,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 6
    },
    "prerequisiteIds": [
      "stn_208"
    ]
  },
  {
    "id": "stn_214",
    "name": "Primordial Mastery",
    "description": "Notable skill node for logistics at tier 51.",
    "tier": 51,
    "level": 559,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_209"
    ]
  },
  {
    "id": "stn_215",
    "name": "Cosmic Core",
    "description": "Notable skill node for science at tier 52.",
    "tier": 52,
    "level": 562,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_210"
    ]
  },
  {
    "id": "stn_216",
    "name": "Cosmic Node",
    "description": "Standard skill node for science at tier 52.",
    "tier": 52,
    "level": 564,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 7
    },
    "prerequisiteIds": [
      "stn_211"
    ]
  },
  {
    "id": "stn_217",
    "name": "Cosmic Focus",
    "description": "Standard skill node for science at tier 52.",
    "tier": 52,
    "level": 566,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 7
    },
    "prerequisiteIds": [
      "stn_212"
    ]
  },
  {
    "id": "stn_218",
    "name": "Cosmic Aspect",
    "description": "Standard skill node for science at tier 52.",
    "tier": 52,
    "level": 568,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 7
    },
    "prerequisiteIds": [
      "stn_213"
    ]
  },
  {
    "id": "stn_219",
    "name": "Cosmic Mastery",
    "description": "Notable skill node for science at tier 52.",
    "tier": 52,
    "level": 570,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_214"
    ]
  },
  {
    "id": "stn_220",
    "name": "Stellar Core",
    "description": "Notable skill node for engineering at tier 53.",
    "tier": 53,
    "level": 573,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_215"
    ]
  },
  {
    "id": "stn_221",
    "name": "Stellar Node",
    "description": "Standard skill node for engineering at tier 53.",
    "tier": 53,
    "level": 575,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 8
    },
    "prerequisiteIds": [
      "stn_216"
    ]
  },
  {
    "id": "stn_222",
    "name": "Stellar Focus",
    "description": "Standard skill node for engineering at tier 53.",
    "tier": 53,
    "level": 577,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 8
    },
    "prerequisiteIds": [
      "stn_217"
    ]
  },
  {
    "id": "stn_223",
    "name": "Stellar Aspect",
    "description": "Standard skill node for engineering at tier 53.",
    "tier": 53,
    "level": 579,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 8
    },
    "prerequisiteIds": [
      "stn_218"
    ]
  },
  {
    "id": "stn_224",
    "name": "Stellar Mastery",
    "description": "Notable skill node for engineering at tier 53.",
    "tier": 53,
    "level": 581,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_219"
    ]
  },
  {
    "id": "stn_225",
    "name": "Galactic Core",
    "description": "Notable skill node for diplomacy at tier 54.",
    "tier": 54,
    "level": 584,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_220"
    ]
  },
  {
    "id": "stn_226",
    "name": "Galactic Node",
    "description": "Standard skill node for diplomacy at tier 54.",
    "tier": 54,
    "level": 586,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 9
    },
    "prerequisiteIds": [
      "stn_221"
    ]
  },
  {
    "id": "stn_227",
    "name": "Galactic Focus",
    "description": "Standard skill node for diplomacy at tier 54.",
    "tier": 54,
    "level": 588,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 9
    },
    "prerequisiteIds": [
      "stn_222"
    ]
  },
  {
    "id": "stn_228",
    "name": "Galactic Aspect",
    "description": "Standard skill node for diplomacy at tier 54.",
    "tier": 54,
    "level": 590,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 9
    },
    "prerequisiteIds": [
      "stn_223"
    ]
  },
  {
    "id": "stn_229",
    "name": "Galactic Mastery",
    "description": "Notable skill node for diplomacy at tier 54.",
    "tier": 54,
    "level": 592,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_224"
    ]
  },
  {
    "id": "stn_230",
    "name": "Universal Core",
    "description": "Notable skill node for espionage at tier 55.",
    "tier": 55,
    "level": 595,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_225"
    ]
  },
  {
    "id": "stn_231",
    "name": "Universal Node",
    "description": "Standard skill node for espionage at tier 55.",
    "tier": 55,
    "level": 597,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 10
    },
    "prerequisiteIds": [
      "stn_226"
    ]
  },
  {
    "id": "stn_232",
    "name": "Universal Focus",
    "description": "Standard skill node for espionage at tier 55.",
    "tier": 55,
    "level": 599,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 10
    },
    "prerequisiteIds": [
      "stn_227"
    ]
  },
  {
    "id": "stn_233",
    "name": "Universal Aspect",
    "description": "Standard skill node for espionage at tier 55.",
    "tier": 55,
    "level": 601,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 10
    },
    "prerequisiteIds": [
      "stn_228"
    ]
  },
  {
    "id": "stn_234",
    "name": "Universal Mastery",
    "description": "Notable skill node for espionage at tier 55.",
    "tier": 55,
    "level": 603,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_229"
    ]
  },
  {
    "id": "stn_235",
    "name": "Infinite Core",
    "description": "Notable skill node for exploration at tier 56.",
    "tier": 56,
    "level": 606,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_230"
    ]
  },
  {
    "id": "stn_236",
    "name": "Infinite Node",
    "description": "Standard skill node for exploration at tier 56.",
    "tier": 56,
    "level": 608,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 11
    },
    "prerequisiteIds": [
      "stn_231"
    ]
  },
  {
    "id": "stn_237",
    "name": "Infinite Focus",
    "description": "Standard skill node for exploration at tier 56.",
    "tier": 56,
    "level": 610,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 11
    },
    "prerequisiteIds": [
      "stn_232"
    ]
  },
  {
    "id": "stn_238",
    "name": "Infinite Aspect",
    "description": "Standard skill node for exploration at tier 56.",
    "tier": 56,
    "level": 612,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 11
    },
    "prerequisiteIds": [
      "stn_233"
    ]
  },
  {
    "id": "stn_239",
    "name": "Infinite Mastery",
    "description": "Notable skill node for exploration at tier 56.",
    "tier": 56,
    "level": 614,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_234"
    ]
  },
  {
    "id": "stn_240",
    "name": "Omniscient Core",
    "description": "Notable skill node for mysticism at tier 57.",
    "tier": 57,
    "level": 617,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_235"
    ]
  },
  {
    "id": "stn_241",
    "name": "Omniscient Node",
    "description": "Standard skill node for mysticism at tier 57.",
    "tier": 57,
    "level": 619,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 12
    },
    "prerequisiteIds": [
      "stn_236"
    ]
  },
  {
    "id": "stn_242",
    "name": "Omniscient Focus",
    "description": "Standard skill node for mysticism at tier 57.",
    "tier": 57,
    "level": 621,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 12
    },
    "prerequisiteIds": [
      "stn_237"
    ]
  },
  {
    "id": "stn_243",
    "name": "Omniscient Aspect",
    "description": "Standard skill node for mysticism at tier 57.",
    "tier": 57,
    "level": 623,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 12
    },
    "prerequisiteIds": [
      "stn_238"
    ]
  },
  {
    "id": "stn_244",
    "name": "Omniscient Mastery",
    "description": "Notable skill node for mysticism at tier 57.",
    "tier": 57,
    "level": 625,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_239"
    ]
  },
  {
    "id": "stn_245",
    "name": "Omnipotent Core",
    "description": "Notable skill node for industry at tier 58.",
    "tier": 58,
    "level": 628,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_240"
    ]
  },
  {
    "id": "stn_246",
    "name": "Omnipotent Node",
    "description": "Standard skill node for industry at tier 58.",
    "tier": 58,
    "level": 630,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 13
    },
    "prerequisiteIds": [
      "stn_241"
    ]
  },
  {
    "id": "stn_247",
    "name": "Omnipotent Focus",
    "description": "Standard skill node for industry at tier 58.",
    "tier": 58,
    "level": 632,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 13
    },
    "prerequisiteIds": [
      "stn_242"
    ]
  },
  {
    "id": "stn_248",
    "name": "Omnipotent Aspect",
    "description": "Standard skill node for industry at tier 58.",
    "tier": 58,
    "level": 634,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 13
    },
    "prerequisiteIds": [
      "stn_243"
    ]
  },
  {
    "id": "stn_249",
    "name": "Omnipotent Mastery",
    "description": "Notable skill node for industry at tier 58.",
    "tier": 58,
    "level": 636,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_244"
    ]
  },
  {
    "id": "stn_250",
    "name": "Omnipresent Core",
    "description": "Notable skill node for command at tier 59.",
    "tier": 59,
    "level": 639,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_245"
    ]
  },
  {
    "id": "stn_251",
    "name": "Omnipresent Node",
    "description": "Standard skill node for command at tier 59.",
    "tier": 59,
    "level": 641,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 14
    },
    "prerequisiteIds": [
      "stn_246"
    ]
  },
  {
    "id": "stn_252",
    "name": "Omnipresent Focus",
    "description": "Standard skill node for command at tier 59.",
    "tier": 59,
    "level": 643,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 14
    },
    "prerequisiteIds": [
      "stn_247"
    ]
  },
  {
    "id": "stn_253",
    "name": "Omnipresent Aspect",
    "description": "Standard skill node for command at tier 59.",
    "tier": 59,
    "level": 645,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 14
    },
    "prerequisiteIds": [
      "stn_248"
    ]
  },
  {
    "id": "stn_254",
    "name": "Omnipresent Mastery",
    "description": "Notable skill node for command at tier 59.",
    "tier": 59,
    "level": 647,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_249"
    ]
  },
  {
    "id": "stn_255",
    "name": "Alpha Core",
    "description": "Notable skill node for warfare at tier 60.",
    "tier": 60,
    "level": 650,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_250"
    ]
  },
  {
    "id": "stn_256",
    "name": "Alpha Node",
    "description": "Standard skill node for warfare at tier 60.",
    "tier": 60,
    "level": 652,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 5
    },
    "prerequisiteIds": [
      "stn_251"
    ]
  },
  {
    "id": "stn_257",
    "name": "Alpha Focus",
    "description": "Standard skill node for warfare at tier 60.",
    "tier": 60,
    "level": 654,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 5
    },
    "prerequisiteIds": [
      "stn_252"
    ]
  },
  {
    "id": "stn_258",
    "name": "Alpha Aspect",
    "description": "Standard skill node for warfare at tier 60.",
    "tier": 60,
    "level": 656,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 5
    },
    "prerequisiteIds": [
      "stn_253"
    ]
  },
  {
    "id": "stn_259",
    "name": "Alpha Mastery",
    "description": "Keystone skill node for warfare at tier 60.",
    "tier": 60,
    "level": 658,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "constructionCost": 25
    },
    "prerequisiteIds": [
      "stn_254"
    ]
  },
  {
    "id": "stn_260",
    "name": "Omega Core",
    "description": "Notable skill node for logistics at tier 61.",
    "tier": 61,
    "level": 661,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_255"
    ]
  },
  {
    "id": "stn_261",
    "name": "Omega Node",
    "description": "Standard skill node for logistics at tier 61.",
    "tier": 61,
    "level": 662,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 6
    },
    "prerequisiteIds": [
      "stn_256"
    ]
  },
  {
    "id": "stn_262",
    "name": "Omega Focus",
    "description": "Standard skill node for logistics at tier 61.",
    "tier": 61,
    "level": 664,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 6
    },
    "prerequisiteIds": [
      "stn_257"
    ]
  },
  {
    "id": "stn_263",
    "name": "Omega Aspect",
    "description": "Standard skill node for logistics at tier 61.",
    "tier": 61,
    "level": 666,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 6
    },
    "prerequisiteIds": [
      "stn_258"
    ]
  },
  {
    "id": "stn_264",
    "name": "Omega Mastery",
    "description": "Standard skill node for logistics at tier 61.",
    "tier": 61,
    "level": 668,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 6
    },
    "prerequisiteIds": [
      "stn_259"
    ]
  },
  {
    "id": "stn_265",
    "name": "Omega Apex",
    "description": "Notable skill node for logistics at tier 61.",
    "tier": 61,
    "level": 670,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_259"
    ]
  },
  {
    "id": "stn_266",
    "name": "Zenith Core",
    "description": "Notable skill node for science at tier 62.",
    "tier": 62,
    "level": 672,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_260"
    ]
  },
  {
    "id": "stn_267",
    "name": "Zenith Node",
    "description": "Standard skill node for science at tier 62.",
    "tier": 62,
    "level": 673,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 7
    },
    "prerequisiteIds": [
      "stn_261"
    ]
  },
  {
    "id": "stn_268",
    "name": "Zenith Focus",
    "description": "Standard skill node for science at tier 62.",
    "tier": 62,
    "level": 675,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 7
    },
    "prerequisiteIds": [
      "stn_262"
    ]
  },
  {
    "id": "stn_269",
    "name": "Zenith Aspect",
    "description": "Standard skill node for science at tier 62.",
    "tier": 62,
    "level": 677,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 7
    },
    "prerequisiteIds": [
      "stn_263"
    ]
  },
  {
    "id": "stn_270",
    "name": "Zenith Mastery",
    "description": "Standard skill node for science at tier 62.",
    "tier": 62,
    "level": 679,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 7
    },
    "prerequisiteIds": [
      "stn_264"
    ]
  },
  {
    "id": "stn_271",
    "name": "Zenith Apex",
    "description": "Notable skill node for science at tier 62.",
    "tier": 62,
    "level": 681,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "evasion": 15
    },
    "prerequisiteIds": [
      "stn_265"
    ]
  },
  {
    "id": "stn_272",
    "name": "Apex Core",
    "description": "Notable skill node for engineering at tier 63.",
    "tier": 63,
    "level": 683,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "morale": 15
    },
    "prerequisiteIds": [
      "stn_266"
    ]
  },
  {
    "id": "stn_273",
    "name": "Apex Node",
    "description": "Standard skill node for engineering at tier 63.",
    "tier": 63,
    "level": 684,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 8
    },
    "prerequisiteIds": [
      "stn_267"
    ]
  },
  {
    "id": "stn_274",
    "name": "Apex Focus",
    "description": "Standard skill node for engineering at tier 63.",
    "tier": 63,
    "level": 686,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 8
    },
    "prerequisiteIds": [
      "stn_268"
    ]
  },
  {
    "id": "stn_275",
    "name": "Apex Aspect",
    "description": "Standard skill node for engineering at tier 63.",
    "tier": 63,
    "level": 688,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 8
    },
    "prerequisiteIds": [
      "stn_269"
    ]
  },
  {
    "id": "stn_276",
    "name": "Apex Mastery",
    "description": "Standard skill node for engineering at tier 63.",
    "tier": 63,
    "level": 690,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 8
    },
    "prerequisiteIds": [
      "stn_270"
    ]
  },
  {
    "id": "stn_277",
    "name": "Apex Apex",
    "description": "Notable skill node for engineering at tier 63.",
    "tier": 63,
    "level": 692,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_271"
    ]
  },
  {
    "id": "stn_278",
    "name": "Pinnacle Core",
    "description": "Notable skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 694,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_272"
    ]
  },
  {
    "id": "stn_279",
    "name": "Pinnacle Node",
    "description": "Standard skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 695,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 9
    },
    "prerequisiteIds": [
      "stn_273"
    ]
  },
  {
    "id": "stn_280",
    "name": "Pinnacle Focus",
    "description": "Standard skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 697,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 9
    },
    "prerequisiteIds": [
      "stn_274"
    ]
  },
  {
    "id": "stn_281",
    "name": "Pinnacle Aspect",
    "description": "Standard skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 699,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 9
    },
    "prerequisiteIds": [
      "stn_275"
    ]
  },
  {
    "id": "stn_282",
    "name": "Pinnacle Mastery",
    "description": "Standard skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 701,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 9
    },
    "prerequisiteIds": [
      "stn_276"
    ]
  },
  {
    "id": "stn_283",
    "name": "Pinnacle Apex",
    "description": "Notable skill node for diplomacy at tier 64.",
    "tier": 64,
    "level": 703,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_277"
    ]
  },
  {
    "id": "stn_284",
    "name": "Crescendo Core",
    "description": "Notable skill node for espionage at tier 65.",
    "tier": 65,
    "level": 705,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_278"
    ]
  },
  {
    "id": "stn_285",
    "name": "Crescendo Node",
    "description": "Standard skill node for espionage at tier 65.",
    "tier": 65,
    "level": 706,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 10
    },
    "prerequisiteIds": [
      "stn_279"
    ]
  },
  {
    "id": "stn_286",
    "name": "Crescendo Focus",
    "description": "Standard skill node for espionage at tier 65.",
    "tier": 65,
    "level": 708,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 10
    },
    "prerequisiteIds": [
      "stn_280"
    ]
  },
  {
    "id": "stn_287",
    "name": "Crescendo Aspect",
    "description": "Standard skill node for espionage at tier 65.",
    "tier": 65,
    "level": 710,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 10
    },
    "prerequisiteIds": [
      "stn_281"
    ]
  },
  {
    "id": "stn_288",
    "name": "Crescendo Mastery",
    "description": "Standard skill node for espionage at tier 65.",
    "tier": 65,
    "level": 712,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 10
    },
    "prerequisiteIds": [
      "stn_282"
    ]
  },
  {
    "id": "stn_289",
    "name": "Crescendo Apex",
    "description": "Notable skill node for espionage at tier 65.",
    "tier": 65,
    "level": 714,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_283"
    ]
  },
  {
    "id": "stn_290",
    "name": "Fulcrum Core",
    "description": "Notable skill node for exploration at tier 66.",
    "tier": 66,
    "level": 716,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_284"
    ]
  },
  {
    "id": "stn_291",
    "name": "Fulcrum Node",
    "description": "Standard skill node for exploration at tier 66.",
    "tier": 66,
    "level": 717,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 11
    },
    "prerequisiteIds": [
      "stn_285"
    ]
  },
  {
    "id": "stn_292",
    "name": "Fulcrum Focus",
    "description": "Standard skill node for exploration at tier 66.",
    "tier": 66,
    "level": 719,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 11
    },
    "prerequisiteIds": [
      "stn_286"
    ]
  },
  {
    "id": "stn_293",
    "name": "Fulcrum Aspect",
    "description": "Standard skill node for exploration at tier 66.",
    "tier": 66,
    "level": 721,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 11
    },
    "prerequisiteIds": [
      "stn_287"
    ]
  },
  {
    "id": "stn_294",
    "name": "Fulcrum Mastery",
    "description": "Standard skill node for exploration at tier 66.",
    "tier": 66,
    "level": 723,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 11
    },
    "prerequisiteIds": [
      "stn_288"
    ]
  },
  {
    "id": "stn_295",
    "name": "Fulcrum Apex",
    "description": "Notable skill node for exploration at tier 66.",
    "tier": 66,
    "level": 725,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_289"
    ]
  },
  {
    "id": "stn_296",
    "name": "Nexus Core",
    "description": "Notable skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 727,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shieldStrength": 15
    },
    "prerequisiteIds": [
      "stn_290"
    ]
  },
  {
    "id": "stn_297",
    "name": "Nexus Node",
    "description": "Standard skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 728,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 12
    },
    "prerequisiteIds": [
      "stn_291"
    ]
  },
  {
    "id": "stn_298",
    "name": "Nexus Focus",
    "description": "Standard skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 730,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 12
    },
    "prerequisiteIds": [
      "stn_292"
    ]
  },
  {
    "id": "stn_299",
    "name": "Nexus Aspect",
    "description": "Standard skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 732,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 12
    },
    "prerequisiteIds": [
      "stn_293"
    ]
  },
  {
    "id": "stn_300",
    "name": "Nexus Mastery",
    "description": "Standard skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 734,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 12
    },
    "prerequisiteIds": [
      "stn_294"
    ]
  },
  {
    "id": "stn_301",
    "name": "Nexus Apex",
    "description": "Notable skill node for mysticism at tier 67.",
    "tier": 67,
    "level": 736,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_295"
    ]
  },
  {
    "id": "stn_302",
    "name": "Aperture Core",
    "description": "Notable skill node for industry at tier 68.",
    "tier": 68,
    "level": 738,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_296"
    ]
  },
  {
    "id": "stn_303",
    "name": "Aperture Node",
    "description": "Standard skill node for industry at tier 68.",
    "tier": 68,
    "level": 739,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 13
    },
    "prerequisiteIds": [
      "stn_297"
    ]
  },
  {
    "id": "stn_304",
    "name": "Aperture Focus",
    "description": "Standard skill node for industry at tier 68.",
    "tier": 68,
    "level": 741,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 13
    },
    "prerequisiteIds": [
      "stn_298"
    ]
  },
  {
    "id": "stn_305",
    "name": "Aperture Aspect",
    "description": "Standard skill node for industry at tier 68.",
    "tier": 68,
    "level": 743,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 13
    },
    "prerequisiteIds": [
      "stn_299"
    ]
  },
  {
    "id": "stn_306",
    "name": "Aperture Mastery",
    "description": "Standard skill node for industry at tier 68.",
    "tier": 68,
    "level": 745,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 13
    },
    "prerequisiteIds": [
      "stn_300"
    ]
  },
  {
    "id": "stn_307",
    "name": "Aperture Apex",
    "description": "Notable skill node for industry at tier 68.",
    "tier": 68,
    "level": 747,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "diplomacyRating": 15
    },
    "prerequisiteIds": [
      "stn_301"
    ]
  },
  {
    "id": "stn_308",
    "name": "Meridian Core",
    "description": "Notable skill node for command at tier 69.",
    "tier": 69,
    "level": 749,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "espionagePower": 15
    },
    "prerequisiteIds": [
      "stn_302"
    ]
  },
  {
    "id": "stn_309",
    "name": "Meridian Node",
    "description": "Standard skill node for command at tier 69.",
    "tier": 69,
    "level": 750,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 14
    },
    "prerequisiteIds": [
      "stn_303"
    ]
  },
  {
    "id": "stn_310",
    "name": "Meridian Focus",
    "description": "Standard skill node for command at tier 69.",
    "tier": 69,
    "level": 752,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 14
    },
    "prerequisiteIds": [
      "stn_304"
    ]
  },
  {
    "id": "stn_311",
    "name": "Meridian Aspect",
    "description": "Standard skill node for command at tier 69.",
    "tier": 69,
    "level": 754,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 14
    },
    "prerequisiteIds": [
      "stn_305"
    ]
  },
  {
    "id": "stn_312",
    "name": "Meridian Mastery",
    "description": "Standard skill node for command at tier 69.",
    "tier": 69,
    "level": 756,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 14
    },
    "prerequisiteIds": [
      "stn_306"
    ]
  },
  {
    "id": "stn_313",
    "name": "Meridian Apex",
    "description": "Notable skill node for command at tier 69.",
    "tier": 69,
    "level": 758,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_307"
    ]
  },
  {
    "id": "stn_314",
    "name": "Zenith Core",
    "description": "Notable skill node for warfare at tier 70.",
    "tier": 70,
    "level": 760,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_308"
    ]
  },
  {
    "id": "stn_315",
    "name": "Zenith Node",
    "description": "Standard skill node for warfare at tier 70.",
    "tier": 70,
    "level": 761,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 5
    },
    "prerequisiteIds": [
      "stn_309"
    ]
  },
  {
    "id": "stn_316",
    "name": "Zenith Focus",
    "description": "Standard skill node for warfare at tier 70.",
    "tier": 70,
    "level": 763,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 5
    },
    "prerequisiteIds": [
      "stn_310"
    ]
  },
  {
    "id": "stn_317",
    "name": "Zenith Aspect",
    "description": "Standard skill node for warfare at tier 70.",
    "tier": 70,
    "level": 765,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 5
    },
    "prerequisiteIds": [
      "stn_311"
    ]
  },
  {
    "id": "stn_318",
    "name": "Zenith Mastery",
    "description": "Standard skill node for warfare at tier 70.",
    "tier": 70,
    "level": 767,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 5
    },
    "prerequisiteIds": [
      "stn_312"
    ]
  },
  {
    "id": "stn_319",
    "name": "Zenith Apex",
    "description": "Keystone skill node for warfare at tier 70.",
    "tier": 70,
    "level": 769,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "constructionCost": 25
    },
    "prerequisiteIds": [
      "stn_313"
    ]
  },
  {
    "id": "stn_320",
    "name": "Climax Core",
    "description": "Notable skill node for logistics at tier 71.",
    "tier": 71,
    "level": 771,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_314"
    ]
  },
  {
    "id": "stn_321",
    "name": "Climax Node",
    "description": "Standard skill node for logistics at tier 71.",
    "tier": 71,
    "level": 772,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 6
    },
    "prerequisiteIds": [
      "stn_315"
    ]
  },
  {
    "id": "stn_322",
    "name": "Climax Focus",
    "description": "Standard skill node for logistics at tier 71.",
    "tier": 71,
    "level": 774,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 6
    },
    "prerequisiteIds": [
      "stn_316"
    ]
  },
  {
    "id": "stn_323",
    "name": "Climax Aspect",
    "description": "Standard skill node for logistics at tier 71.",
    "tier": 71,
    "level": 776,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 6
    },
    "prerequisiteIds": [
      "stn_317"
    ]
  },
  {
    "id": "stn_324",
    "name": "Climax Mastery",
    "description": "Standard skill node for logistics at tier 71.",
    "tier": 71,
    "level": 778,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 6
    },
    "prerequisiteIds": [
      "stn_318"
    ]
  },
  {
    "id": "stn_325",
    "name": "Climax Apex",
    "description": "Notable skill node for logistics at tier 71.",
    "tier": 71,
    "level": 780,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_319"
    ]
  },
  {
    "id": "stn_326",
    "name": "Culmination Core",
    "description": "Notable skill node for science at tier 72.",
    "tier": 72,
    "level": 782,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_320"
    ]
  },
  {
    "id": "stn_327",
    "name": "Culmination Node",
    "description": "Standard skill node for science at tier 72.",
    "tier": 72,
    "level": 783,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 7
    },
    "prerequisiteIds": [
      "stn_321"
    ]
  },
  {
    "id": "stn_328",
    "name": "Culmination Focus",
    "description": "Standard skill node for science at tier 72.",
    "tier": 72,
    "level": 785,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 7
    },
    "prerequisiteIds": [
      "stn_322"
    ]
  },
  {
    "id": "stn_329",
    "name": "Culmination Aspect",
    "description": "Standard skill node for science at tier 72.",
    "tier": 72,
    "level": 787,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 7
    },
    "prerequisiteIds": [
      "stn_323"
    ]
  },
  {
    "id": "stn_330",
    "name": "Culmination Mastery",
    "description": "Standard skill node for science at tier 72.",
    "tier": 72,
    "level": 789,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 7
    },
    "prerequisiteIds": [
      "stn_324"
    ]
  },
  {
    "id": "stn_331",
    "name": "Culmination Apex",
    "description": "Notable skill node for science at tier 72.",
    "tier": 72,
    "level": 791,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "evasion": 15
    },
    "prerequisiteIds": [
      "stn_325"
    ]
  },
  {
    "id": "stn_332",
    "name": "Vanguard Core",
    "description": "Notable skill node for engineering at tier 73.",
    "tier": 73,
    "level": 793,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "morale": 15
    },
    "prerequisiteIds": [
      "stn_326"
    ]
  },
  {
    "id": "stn_333",
    "name": "Vanguard Node",
    "description": "Standard skill node for engineering at tier 73.",
    "tier": 73,
    "level": 794,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 8
    },
    "prerequisiteIds": [
      "stn_327"
    ]
  },
  {
    "id": "stn_334",
    "name": "Vanguard Focus",
    "description": "Standard skill node for engineering at tier 73.",
    "tier": 73,
    "level": 796,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 8
    },
    "prerequisiteIds": [
      "stn_328"
    ]
  },
  {
    "id": "stn_335",
    "name": "Vanguard Aspect",
    "description": "Standard skill node for engineering at tier 73.",
    "tier": 73,
    "level": 798,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 8
    },
    "prerequisiteIds": [
      "stn_329"
    ]
  },
  {
    "id": "stn_336",
    "name": "Vanguard Mastery",
    "description": "Standard skill node for engineering at tier 73.",
    "tier": 73,
    "level": 800,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 8
    },
    "prerequisiteIds": [
      "stn_330"
    ]
  },
  {
    "id": "stn_337",
    "name": "Vanguard Apex",
    "description": "Notable skill node for engineering at tier 73.",
    "tier": 73,
    "level": 802,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_331"
    ]
  },
  {
    "id": "stn_338",
    "name": "Paragon Core",
    "description": "Notable skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 804,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_332"
    ]
  },
  {
    "id": "stn_339",
    "name": "Paragon Node",
    "description": "Standard skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 805,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 9
    },
    "prerequisiteIds": [
      "stn_333"
    ]
  },
  {
    "id": "stn_340",
    "name": "Paragon Focus",
    "description": "Standard skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 807,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 9
    },
    "prerequisiteIds": [
      "stn_334"
    ]
  },
  {
    "id": "stn_341",
    "name": "Paragon Aspect",
    "description": "Standard skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 809,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 9
    },
    "prerequisiteIds": [
      "stn_335"
    ]
  },
  {
    "id": "stn_342",
    "name": "Paragon Mastery",
    "description": "Standard skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 811,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 9
    },
    "prerequisiteIds": [
      "stn_336"
    ]
  },
  {
    "id": "stn_343",
    "name": "Paragon Apex",
    "description": "Notable skill node for diplomacy at tier 74.",
    "tier": 74,
    "level": 813,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_337"
    ]
  },
  {
    "id": "stn_344",
    "name": "Exemplar Core",
    "description": "Notable skill node for espionage at tier 75.",
    "tier": 75,
    "level": 815,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_338"
    ]
  },
  {
    "id": "stn_345",
    "name": "Exemplar Node",
    "description": "Standard skill node for espionage at tier 75.",
    "tier": 75,
    "level": 816,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 10
    },
    "prerequisiteIds": [
      "stn_339"
    ]
  },
  {
    "id": "stn_346",
    "name": "Exemplar Focus",
    "description": "Standard skill node for espionage at tier 75.",
    "tier": 75,
    "level": 818,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 10
    },
    "prerequisiteIds": [
      "stn_340"
    ]
  },
  {
    "id": "stn_347",
    "name": "Exemplar Aspect",
    "description": "Standard skill node for espionage at tier 75.",
    "tier": 75,
    "level": 820,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 10
    },
    "prerequisiteIds": [
      "stn_341"
    ]
  },
  {
    "id": "stn_348",
    "name": "Exemplar Mastery",
    "description": "Standard skill node for espionage at tier 75.",
    "tier": 75,
    "level": 822,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 10
    },
    "prerequisiteIds": [
      "stn_342"
    ]
  },
  {
    "id": "stn_349",
    "name": "Exemplar Apex",
    "description": "Notable skill node for espionage at tier 75.",
    "tier": 75,
    "level": 824,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_343"
    ]
  },
  {
    "id": "stn_350",
    "name": "Prodigy Core",
    "description": "Notable skill node for exploration at tier 76.",
    "tier": 76,
    "level": 826,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_344"
    ]
  },
  {
    "id": "stn_351",
    "name": "Prodigy Node",
    "description": "Standard skill node for exploration at tier 76.",
    "tier": 76,
    "level": 827,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 11
    },
    "prerequisiteIds": [
      "stn_345"
    ]
  },
  {
    "id": "stn_352",
    "name": "Prodigy Focus",
    "description": "Standard skill node for exploration at tier 76.",
    "tier": 76,
    "level": 829,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 11
    },
    "prerequisiteIds": [
      "stn_346"
    ]
  },
  {
    "id": "stn_353",
    "name": "Prodigy Aspect",
    "description": "Standard skill node for exploration at tier 76.",
    "tier": 76,
    "level": 831,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 11
    },
    "prerequisiteIds": [
      "stn_347"
    ]
  },
  {
    "id": "stn_354",
    "name": "Prodigy Mastery",
    "description": "Standard skill node for exploration at tier 76.",
    "tier": 76,
    "level": 833,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 11
    },
    "prerequisiteIds": [
      "stn_348"
    ]
  },
  {
    "id": "stn_355",
    "name": "Prodigy Apex",
    "description": "Notable skill node for exploration at tier 76.",
    "tier": 76,
    "level": 835,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_349"
    ]
  },
  {
    "id": "stn_356",
    "name": "Sage Core",
    "description": "Notable skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 837,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shieldStrength": 15
    },
    "prerequisiteIds": [
      "stn_350"
    ]
  },
  {
    "id": "stn_357",
    "name": "Sage Node",
    "description": "Standard skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 838,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 12
    },
    "prerequisiteIds": [
      "stn_351"
    ]
  },
  {
    "id": "stn_358",
    "name": "Sage Focus",
    "description": "Standard skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 840,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 12
    },
    "prerequisiteIds": [
      "stn_352"
    ]
  },
  {
    "id": "stn_359",
    "name": "Sage Aspect",
    "description": "Standard skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 842,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 12
    },
    "prerequisiteIds": [
      "stn_353"
    ]
  },
  {
    "id": "stn_360",
    "name": "Sage Mastery",
    "description": "Standard skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 844,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 12
    },
    "prerequisiteIds": [
      "stn_354"
    ]
  },
  {
    "id": "stn_361",
    "name": "Sage Apex",
    "description": "Notable skill node for mysticism at tier 77.",
    "tier": 77,
    "level": 846,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_355"
    ]
  },
  {
    "id": "stn_362",
    "name": "Oracle Core",
    "description": "Notable skill node for industry at tier 78.",
    "tier": 78,
    "level": 848,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_356"
    ]
  },
  {
    "id": "stn_363",
    "name": "Oracle Node",
    "description": "Standard skill node for industry at tier 78.",
    "tier": 78,
    "level": 849,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 13
    },
    "prerequisiteIds": [
      "stn_357"
    ]
  },
  {
    "id": "stn_364",
    "name": "Oracle Focus",
    "description": "Standard skill node for industry at tier 78.",
    "tier": 78,
    "level": 851,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 13
    },
    "prerequisiteIds": [
      "stn_358"
    ]
  },
  {
    "id": "stn_365",
    "name": "Oracle Aspect",
    "description": "Standard skill node for industry at tier 78.",
    "tier": 78,
    "level": 853,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 13
    },
    "prerequisiteIds": [
      "stn_359"
    ]
  },
  {
    "id": "stn_366",
    "name": "Oracle Mastery",
    "description": "Standard skill node for industry at tier 78.",
    "tier": 78,
    "level": 855,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 13
    },
    "prerequisiteIds": [
      "stn_360"
    ]
  },
  {
    "id": "stn_367",
    "name": "Oracle Apex",
    "description": "Notable skill node for industry at tier 78.",
    "tier": 78,
    "level": 857,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "diplomacyRating": 15
    },
    "prerequisiteIds": [
      "stn_361"
    ]
  },
  {
    "id": "stn_368",
    "name": "Prophet Core",
    "description": "Notable skill node for command at tier 79.",
    "tier": 79,
    "level": 859,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "espionagePower": 15
    },
    "prerequisiteIds": [
      "stn_362"
    ]
  },
  {
    "id": "stn_369",
    "name": "Prophet Node",
    "description": "Standard skill node for command at tier 79.",
    "tier": 79,
    "level": 860,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 14
    },
    "prerequisiteIds": [
      "stn_363"
    ]
  },
  {
    "id": "stn_370",
    "name": "Prophet Focus",
    "description": "Standard skill node for command at tier 79.",
    "tier": 79,
    "level": 862,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 14
    },
    "prerequisiteIds": [
      "stn_364"
    ]
  },
  {
    "id": "stn_371",
    "name": "Prophet Aspect",
    "description": "Standard skill node for command at tier 79.",
    "tier": 79,
    "level": 864,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 14
    },
    "prerequisiteIds": [
      "stn_365"
    ]
  },
  {
    "id": "stn_372",
    "name": "Prophet Mastery",
    "description": "Standard skill node for command at tier 79.",
    "tier": 79,
    "level": 866,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 14
    },
    "prerequisiteIds": [
      "stn_366"
    ]
  },
  {
    "id": "stn_373",
    "name": "Prophet Apex",
    "description": "Notable skill node for command at tier 79.",
    "tier": 79,
    "level": 868,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_367"
    ]
  },
  {
    "id": "stn_374",
    "name": "Visionary Core",
    "description": "Notable skill node for warfare at tier 80.",
    "tier": 80,
    "level": 870,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_368"
    ]
  },
  {
    "id": "stn_375",
    "name": "Visionary Node",
    "description": "Standard skill node for warfare at tier 80.",
    "tier": 80,
    "level": 871,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 5
    },
    "prerequisiteIds": [
      "stn_369"
    ]
  },
  {
    "id": "stn_376",
    "name": "Visionary Focus",
    "description": "Standard skill node for warfare at tier 80.",
    "tier": 80,
    "level": 873,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 5
    },
    "prerequisiteIds": [
      "stn_370"
    ]
  },
  {
    "id": "stn_377",
    "name": "Visionary Aspect",
    "description": "Standard skill node for warfare at tier 80.",
    "tier": 80,
    "level": 875,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 5
    },
    "prerequisiteIds": [
      "stn_371"
    ]
  },
  {
    "id": "stn_378",
    "name": "Visionary Mastery",
    "description": "Standard skill node for warfare at tier 80.",
    "tier": 80,
    "level": 877,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 5
    },
    "prerequisiteIds": [
      "stn_372"
    ]
  },
  {
    "id": "stn_379",
    "name": "Visionary Apex",
    "description": "Keystone skill node for warfare at tier 80.",
    "tier": 80,
    "level": 879,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "constructionCost": 25
    },
    "prerequisiteIds": [
      "stn_373"
    ]
  },
  {
    "id": "stn_380",
    "name": "Ascendant Core",
    "description": "Notable skill node for logistics at tier 81.",
    "tier": 81,
    "level": 881,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_374"
    ]
  },
  {
    "id": "stn_381",
    "name": "Ascendant Node",
    "description": "Standard skill node for logistics at tier 81.",
    "tier": 81,
    "level": 882,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 6
    },
    "prerequisiteIds": [
      "stn_375"
    ]
  },
  {
    "id": "stn_382",
    "name": "Ascendant Focus",
    "description": "Standard skill node for logistics at tier 81.",
    "tier": 81,
    "level": 884,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 6
    },
    "prerequisiteIds": [
      "stn_376"
    ]
  },
  {
    "id": "stn_383",
    "name": "Ascendant Aspect",
    "description": "Standard skill node for logistics at tier 81.",
    "tier": 81,
    "level": 885,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 6
    },
    "prerequisiteIds": [
      "stn_377"
    ]
  },
  {
    "id": "stn_384",
    "name": "Ascendant Mastery",
    "description": "Standard skill node for logistics at tier 81.",
    "tier": 81,
    "level": 887,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 6
    },
    "prerequisiteIds": [
      "stn_378"
    ]
  },
  {
    "id": "stn_385",
    "name": "Ascendant Apex",
    "description": "Standard skill node for logistics at tier 81.",
    "tier": 81,
    "level": 888,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 6
    },
    "prerequisiteIds": [
      "stn_379"
    ]
  },
  {
    "id": "stn_386",
    "name": "Ascendant Zenith",
    "description": "Notable skill node for logistics at tier 81.",
    "tier": 81,
    "level": 890,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_379"
    ]
  },
  {
    "id": "stn_387",
    "name": "Celestial Core",
    "description": "Notable skill node for science at tier 82.",
    "tier": 82,
    "level": 892,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "diplomacyRating": 15
    },
    "prerequisiteIds": [
      "stn_380"
    ]
  },
  {
    "id": "stn_388",
    "name": "Celestial Node",
    "description": "Standard skill node for science at tier 82.",
    "tier": 82,
    "level": 893,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 7
    },
    "prerequisiteIds": [
      "stn_381"
    ]
  },
  {
    "id": "stn_389",
    "name": "Celestial Focus",
    "description": "Standard skill node for science at tier 82.",
    "tier": 82,
    "level": 895,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 7
    },
    "prerequisiteIds": [
      "stn_382"
    ]
  },
  {
    "id": "stn_390",
    "name": "Celestial Aspect",
    "description": "Standard skill node for science at tier 82.",
    "tier": 82,
    "level": 896,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 7
    },
    "prerequisiteIds": [
      "stn_383"
    ]
  },
  {
    "id": "stn_391",
    "name": "Celestial Mastery",
    "description": "Standard skill node for science at tier 82.",
    "tier": 82,
    "level": 898,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 7
    },
    "prerequisiteIds": [
      "stn_384"
    ]
  },
  {
    "id": "stn_392",
    "name": "Celestial Apex",
    "description": "Standard skill node for science at tier 82.",
    "tier": 82,
    "level": 899,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 7
    },
    "prerequisiteIds": [
      "stn_385"
    ]
  },
  {
    "id": "stn_393",
    "name": "Celestial Zenith",
    "description": "Notable skill node for science at tier 82.",
    "tier": 82,
    "level": 901,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "leadershipRadius": 15
    },
    "prerequisiteIds": [
      "stn_386"
    ]
  },
  {
    "id": "stn_394",
    "name": "Radiant Core",
    "description": "Notable skill node for engineering at tier 83.",
    "tier": 83,
    "level": 903,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_387"
    ]
  },
  {
    "id": "stn_395",
    "name": "Radiant Node",
    "description": "Standard skill node for engineering at tier 83.",
    "tier": 83,
    "level": 904,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 8
    },
    "prerequisiteIds": [
      "stn_388"
    ]
  },
  {
    "id": "stn_396",
    "name": "Radiant Focus",
    "description": "Standard skill node for engineering at tier 83.",
    "tier": 83,
    "level": 906,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 8
    },
    "prerequisiteIds": [
      "stn_389"
    ]
  },
  {
    "id": "stn_397",
    "name": "Radiant Aspect",
    "description": "Standard skill node for engineering at tier 83.",
    "tier": 83,
    "level": 907,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 8
    },
    "prerequisiteIds": [
      "stn_390"
    ]
  },
  {
    "id": "stn_398",
    "name": "Radiant Mastery",
    "description": "Standard skill node for engineering at tier 83.",
    "tier": 83,
    "level": 909,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 8
    },
    "prerequisiteIds": [
      "stn_391"
    ]
  },
  {
    "id": "stn_399",
    "name": "Radiant Apex",
    "description": "Standard skill node for engineering at tier 83.",
    "tier": 83,
    "level": 910,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 8
    },
    "prerequisiteIds": [
      "stn_392"
    ]
  },
  {
    "id": "stn_400",
    "name": "Radiant Zenith",
    "description": "Notable skill node for engineering at tier 83.",
    "tier": 83,
    "level": 912,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "attackPower": 15
    },
    "prerequisiteIds": [
      "stn_393"
    ]
  },
  {
    "id": "stn_401",
    "name": "Luminous Core",
    "description": "Notable skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 914,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_394"
    ]
  },
  {
    "id": "stn_402",
    "name": "Luminous Node",
    "description": "Standard skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 915,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 9
    },
    "prerequisiteIds": [
      "stn_395"
    ]
  },
  {
    "id": "stn_403",
    "name": "Luminous Focus",
    "description": "Standard skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 917,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 9
    },
    "prerequisiteIds": [
      "stn_396"
    ]
  },
  {
    "id": "stn_404",
    "name": "Luminous Aspect",
    "description": "Standard skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 918,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 9
    },
    "prerequisiteIds": [
      "stn_397"
    ]
  },
  {
    "id": "stn_405",
    "name": "Luminous Mastery",
    "description": "Standard skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 920,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 9
    },
    "prerequisiteIds": [
      "stn_398"
    ]
  },
  {
    "id": "stn_406",
    "name": "Luminous Apex",
    "description": "Standard skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 921,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 9
    },
    "prerequisiteIds": [
      "stn_399"
    ]
  },
  {
    "id": "stn_407",
    "name": "Luminous Zenith",
    "description": "Notable skill node for diplomacy at tier 84.",
    "tier": 84,
    "level": 923,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "diplomacyRating": 15
    },
    "prerequisiteIds": [
      "stn_400"
    ]
  },
  {
    "id": "stn_408",
    "name": "Resplendent Core",
    "description": "Notable skill node for espionage at tier 85.",
    "tier": 85,
    "level": 925,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "espionagePower": 15
    },
    "prerequisiteIds": [
      "stn_401"
    ]
  },
  {
    "id": "stn_409",
    "name": "Resplendent Node",
    "description": "Standard skill node for espionage at tier 85.",
    "tier": 85,
    "level": 926,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 10
    },
    "prerequisiteIds": [
      "stn_402"
    ]
  },
  {
    "id": "stn_410",
    "name": "Resplendent Focus",
    "description": "Standard skill node for espionage at tier 85.",
    "tier": 85,
    "level": 928,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 10
    },
    "prerequisiteIds": [
      "stn_403"
    ]
  },
  {
    "id": "stn_411",
    "name": "Resplendent Aspect",
    "description": "Standard skill node for espionage at tier 85.",
    "tier": 85,
    "level": 929,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 10
    },
    "prerequisiteIds": [
      "stn_404"
    ]
  },
  {
    "id": "stn_412",
    "name": "Resplendent Mastery",
    "description": "Standard skill node for espionage at tier 85.",
    "tier": 85,
    "level": 931,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 10
    },
    "prerequisiteIds": [
      "stn_405"
    ]
  },
  {
    "id": "stn_413",
    "name": "Resplendent Apex",
    "description": "Standard skill node for espionage at tier 85.",
    "tier": 85,
    "level": 932,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 10
    },
    "prerequisiteIds": [
      "stn_406"
    ]
  },
  {
    "id": "stn_414",
    "name": "Resplendent Zenith",
    "description": "Notable skill node for espionage at tier 85.",
    "tier": 85,
    "level": 934,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "intelRange": 15
    },
    "prerequisiteIds": [
      "stn_407"
    ]
  },
  {
    "id": "stn_415",
    "name": "Astral Core",
    "description": "Notable skill node for exploration at tier 86.",
    "tier": 86,
    "level": 936,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_408"
    ]
  },
  {
    "id": "stn_416",
    "name": "Astral Node",
    "description": "Standard skill node for exploration at tier 86.",
    "tier": 86,
    "level": 937,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 11
    },
    "prerequisiteIds": [
      "stn_409"
    ]
  },
  {
    "id": "stn_417",
    "name": "Astral Focus",
    "description": "Standard skill node for exploration at tier 86.",
    "tier": 86,
    "level": 939,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 11
    },
    "prerequisiteIds": [
      "stn_410"
    ]
  },
  {
    "id": "stn_418",
    "name": "Astral Aspect",
    "description": "Standard skill node for exploration at tier 86.",
    "tier": 86,
    "level": 940,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 11
    },
    "prerequisiteIds": [
      "stn_411"
    ]
  },
  {
    "id": "stn_419",
    "name": "Astral Mastery",
    "description": "Standard skill node for exploration at tier 86.",
    "tier": 86,
    "level": 942,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 11
    },
    "prerequisiteIds": [
      "stn_412"
    ]
  },
  {
    "id": "stn_420",
    "name": "Astral Apex",
    "description": "Standard skill node for exploration at tier 86.",
    "tier": 86,
    "level": 943,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 11
    },
    "prerequisiteIds": [
      "stn_413"
    ]
  },
  {
    "id": "stn_421",
    "name": "Astral Zenith",
    "description": "Notable skill node for exploration at tier 86.",
    "tier": 86,
    "level": 945,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "defenseRating": 15
    },
    "prerequisiteIds": [
      "stn_414"
    ]
  },
  {
    "id": "stn_422",
    "name": "Aetherial Core",
    "description": "Notable skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 947,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_415"
    ]
  },
  {
    "id": "stn_423",
    "name": "Aetherial Node",
    "description": "Standard skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 948,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 12
    },
    "prerequisiteIds": [
      "stn_416"
    ]
  },
  {
    "id": "stn_424",
    "name": "Aetherial Focus",
    "description": "Standard skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 950,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 12
    },
    "prerequisiteIds": [
      "stn_417"
    ]
  },
  {
    "id": "stn_425",
    "name": "Aetherial Aspect",
    "description": "Standard skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 951,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 12
    },
    "prerequisiteIds": [
      "stn_418"
    ]
  },
  {
    "id": "stn_426",
    "name": "Aetherial Mastery",
    "description": "Standard skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 953,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 12
    },
    "prerequisiteIds": [
      "stn_419"
    ]
  },
  {
    "id": "stn_427",
    "name": "Aetherial Apex",
    "description": "Standard skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 954,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 12
    },
    "prerequisiteIds": [
      "stn_420"
    ]
  },
  {
    "id": "stn_428",
    "name": "Aetherial Zenith",
    "description": "Notable skill node for mysticism at tier 87.",
    "tier": 87,
    "level": 956,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "espionagePower": 15
    },
    "prerequisiteIds": [
      "stn_421"
    ]
  },
  {
    "id": "stn_429",
    "name": "Empyrean Core",
    "description": "Notable skill node for industry at tier 88.",
    "tier": 88,
    "level": 958,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "colonyGrowth": 15
    },
    "prerequisiteIds": [
      "stn_422"
    ]
  },
  {
    "id": "stn_430",
    "name": "Empyrean Node",
    "description": "Standard skill node for industry at tier 88.",
    "tier": 88,
    "level": 959,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 13
    },
    "prerequisiteIds": [
      "stn_423"
    ]
  },
  {
    "id": "stn_431",
    "name": "Empyrean Focus",
    "description": "Standard skill node for industry at tier 88.",
    "tier": 88,
    "level": 961,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 13
    },
    "prerequisiteIds": [
      "stn_424"
    ]
  },
  {
    "id": "stn_432",
    "name": "Empyrean Aspect",
    "description": "Standard skill node for industry at tier 88.",
    "tier": 88,
    "level": 962,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 13
    },
    "prerequisiteIds": [
      "stn_425"
    ]
  },
  {
    "id": "stn_433",
    "name": "Empyrean Mastery",
    "description": "Standard skill node for industry at tier 88.",
    "tier": 88,
    "level": 964,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 13
    },
    "prerequisiteIds": [
      "stn_426"
    ]
  },
  {
    "id": "stn_434",
    "name": "Empyrean Apex",
    "description": "Standard skill node for industry at tier 88.",
    "tier": 88,
    "level": 965,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 13
    },
    "prerequisiteIds": [
      "stn_427"
    ]
  },
  {
    "id": "stn_435",
    "name": "Empyrean Zenith",
    "description": "Notable skill node for industry at tier 88.",
    "tier": 88,
    "level": 967,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shipCapacity": 15
    },
    "prerequisiteIds": [
      "stn_428"
    ]
  },
  {
    "id": "stn_436",
    "name": "Ineffable Core",
    "description": "Notable skill node for command at tier 89.",
    "tier": 89,
    "level": 969,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shieldStrength": 15
    },
    "prerequisiteIds": [
      "stn_429"
    ]
  },
  {
    "id": "stn_437",
    "name": "Ineffable Node",
    "description": "Standard skill node for command at tier 89.",
    "tier": 89,
    "level": 970,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 14
    },
    "prerequisiteIds": [
      "stn_430"
    ]
  },
  {
    "id": "stn_438",
    "name": "Ineffable Focus",
    "description": "Standard skill node for command at tier 89.",
    "tier": 89,
    "level": 972,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 14
    },
    "prerequisiteIds": [
      "stn_431"
    ]
  },
  {
    "id": "stn_439",
    "name": "Ineffable Aspect",
    "description": "Standard skill node for command at tier 89.",
    "tier": 89,
    "level": 973,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 14
    },
    "prerequisiteIds": [
      "stn_432"
    ]
  },
  {
    "id": "stn_440",
    "name": "Ineffable Mastery",
    "description": "Standard skill node for command at tier 89.",
    "tier": 89,
    "level": 975,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 14
    },
    "prerequisiteIds": [
      "stn_433"
    ]
  },
  {
    "id": "stn_441",
    "name": "Ineffable Apex",
    "description": "Standard skill node for command at tier 89.",
    "tier": 89,
    "level": 976,
    "branch": "command",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 14
    },
    "prerequisiteIds": [
      "stn_434"
    ]
  },
  {
    "id": "stn_442",
    "name": "Ineffable Zenith",
    "description": "Notable skill node for command at tier 89.",
    "tier": 89,
    "level": 978,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fleetSpeed": 15
    },
    "prerequisiteIds": [
      "stn_435"
    ]
  },
  {
    "id": "stn_443",
    "name": "Unfathomable Core",
    "description": "Notable skill node for warfare at tier 90.",
    "tier": 90,
    "level": 980,
    "branch": "warfare",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_436"
    ]
  },
  {
    "id": "stn_444",
    "name": "Unfathomable Node",
    "description": "Standard skill node for warfare at tier 90.",
    "tier": 90,
    "level": 981,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 5
    },
    "prerequisiteIds": [
      "stn_437"
    ]
  },
  {
    "id": "stn_445",
    "name": "Unfathomable Focus",
    "description": "Standard skill node for warfare at tier 90.",
    "tier": 90,
    "level": 983,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 5
    },
    "prerequisiteIds": [
      "stn_438"
    ]
  },
  {
    "id": "stn_446",
    "name": "Unfathomable Aspect",
    "description": "Standard skill node for warfare at tier 90.",
    "tier": 90,
    "level": 984,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 5
    },
    "prerequisiteIds": [
      "stn_439"
    ]
  },
  {
    "id": "stn_447",
    "name": "Unfathomable Mastery",
    "description": "Standard skill node for warfare at tier 90.",
    "tier": 90,
    "level": 986,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 5
    },
    "prerequisiteIds": [
      "stn_440"
    ]
  },
  {
    "id": "stn_448",
    "name": "Unfathomable Apex",
    "description": "Standard skill node for warfare at tier 90.",
    "tier": 90,
    "level": 987,
    "branch": "warfare",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 5
    },
    "prerequisiteIds": [
      "stn_441"
    ]
  },
  {
    "id": "stn_449",
    "name": "Unfathomable Zenith",
    "description": "Keystone skill node for warfare at tier 90.",
    "tier": 90,
    "level": 989,
    "branch": "warfare",
    "type": "keystone",
    "cost": 5,
    "effects": {
      "colonyGrowth": 25
    },
    "prerequisiteIds": [
      "stn_442"
    ]
  },
  {
    "id": "stn_450",
    "name": "Unimaginable Core",
    "description": "Notable skill node for logistics at tier 91.",
    "tier": 91,
    "level": 991,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_443"
    ]
  },
  {
    "id": "stn_451",
    "name": "Unimaginable Node",
    "description": "Standard skill node for logistics at tier 91.",
    "tier": 91,
    "level": 992,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "evasion": 6
    },
    "prerequisiteIds": [
      "stn_444"
    ]
  },
  {
    "id": "stn_452",
    "name": "Unimaginable Focus",
    "description": "Standard skill node for logistics at tier 91.",
    "tier": 91,
    "level": 994,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 6
    },
    "prerequisiteIds": [
      "stn_445"
    ]
  },
  {
    "id": "stn_453",
    "name": "Unimaginable Aspect",
    "description": "Standard skill node for logistics at tier 91.",
    "tier": 91,
    "level": 995,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 6
    },
    "prerequisiteIds": [
      "stn_446"
    ]
  },
  {
    "id": "stn_454",
    "name": "Unimaginable Mastery",
    "description": "Standard skill node for logistics at tier 91.",
    "tier": 91,
    "level": 997,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 6
    },
    "prerequisiteIds": [
      "stn_447"
    ]
  },
  {
    "id": "stn_455",
    "name": "Unimaginable Apex",
    "description": "Standard skill node for logistics at tier 91.",
    "tier": 91,
    "level": 998,
    "branch": "logistics",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 6
    },
    "prerequisiteIds": [
      "stn_448"
    ]
  },
  {
    "id": "stn_456",
    "name": "Unimaginable Zenith",
    "description": "Notable skill node for logistics at tier 91.",
    "tier": 91,
    "level": 1000,
    "branch": "logistics",
    "type": "notable",
    "cost": 3,
    "effects": {
      "shieldStrength": 15
    },
    "prerequisiteIds": [
      "stn_449"
    ]
  },
  {
    "id": "stn_457",
    "name": "Transcendent Core",
    "description": "Notable skill node for science at tier 92.",
    "tier": 92,
    "level": 1002,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_450"
    ]
  },
  {
    "id": "stn_458",
    "name": "Transcendent Node",
    "description": "Standard skill node for science at tier 92.",
    "tier": 92,
    "level": 1003,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fuelEfficiency": 7
    },
    "prerequisiteIds": [
      "stn_451"
    ]
  },
  {
    "id": "stn_459",
    "name": "Transcendent Focus",
    "description": "Standard skill node for science at tier 92.",
    "tier": 92,
    "level": 1005,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 7
    },
    "prerequisiteIds": [
      "stn_452"
    ]
  },
  {
    "id": "stn_460",
    "name": "Transcendent Aspect",
    "description": "Standard skill node for science at tier 92.",
    "tier": 92,
    "level": 1006,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 7
    },
    "prerequisiteIds": [
      "stn_453"
    ]
  },
  {
    "id": "stn_461",
    "name": "Transcendent Mastery",
    "description": "Standard skill node for science at tier 92.",
    "tier": 92,
    "level": 1008,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 7
    },
    "prerequisiteIds": [
      "stn_454"
    ]
  },
  {
    "id": "stn_462",
    "name": "Transcendent Apex",
    "description": "Standard skill node for science at tier 92.",
    "tier": 92,
    "level": 1009,
    "branch": "science",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 7
    },
    "prerequisiteIds": [
      "stn_455"
    ]
  },
  {
    "id": "stn_463",
    "name": "Transcendent Zenith",
    "description": "Notable skill node for science at tier 92.",
    "tier": 92,
    "level": 1011,
    "branch": "science",
    "type": "notable",
    "cost": 3,
    "effects": {
      "researchRate": 15
    },
    "prerequisiteIds": [
      "stn_456"
    ]
  },
  {
    "id": "stn_464",
    "name": "Incomprehensible Core",
    "description": "Notable skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1013,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_457"
    ]
  },
  {
    "id": "stn_465",
    "name": "Incomprehensible Node",
    "description": "Standard skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1014,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "resourceOutput": 8
    },
    "prerequisiteIds": [
      "stn_458"
    ]
  },
  {
    "id": "stn_466",
    "name": "Incomprehensible Focus",
    "description": "Standard skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1016,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 8
    },
    "prerequisiteIds": [
      "stn_459"
    ]
  },
  {
    "id": "stn_467",
    "name": "Incomprehensible Aspect",
    "description": "Standard skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1017,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 8
    },
    "prerequisiteIds": [
      "stn_460"
    ]
  },
  {
    "id": "stn_468",
    "name": "Incomprehensible Mastery",
    "description": "Standard skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1019,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 8
    },
    "prerequisiteIds": [
      "stn_461"
    ]
  },
  {
    "id": "stn_469",
    "name": "Incomprehensible Apex",
    "description": "Standard skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1020,
    "branch": "engineering",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 8
    },
    "prerequisiteIds": [
      "stn_462"
    ]
  },
  {
    "id": "stn_470",
    "name": "Incomprehensible Zenith",
    "description": "Notable skill node for engineering at tier 93.",
    "tier": 93,
    "level": 1022,
    "branch": "engineering",
    "type": "notable",
    "cost": 3,
    "effects": {
      "criticalStrike": 15
    },
    "prerequisiteIds": [
      "stn_463"
    ]
  },
  {
    "id": "stn_471",
    "name": "Absolute Core",
    "description": "Notable skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1024,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "evasion": 15
    },
    "prerequisiteIds": [
      "stn_464"
    ]
  },
  {
    "id": "stn_472",
    "name": "Absolute Node",
    "description": "Standard skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1025,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "morale": 9
    },
    "prerequisiteIds": [
      "stn_465"
    ]
  },
  {
    "id": "stn_473",
    "name": "Absolute Focus",
    "description": "Standard skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1027,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 9
    },
    "prerequisiteIds": [
      "stn_466"
    ]
  },
  {
    "id": "stn_474",
    "name": "Absolute Aspect",
    "description": "Standard skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1028,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 9
    },
    "prerequisiteIds": [
      "stn_467"
    ]
  },
  {
    "id": "stn_475",
    "name": "Absolute Mastery",
    "description": "Standard skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1030,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 9
    },
    "prerequisiteIds": [
      "stn_468"
    ]
  },
  {
    "id": "stn_476",
    "name": "Absolute Apex",
    "description": "Standard skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1031,
    "branch": "diplomacy",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 9
    },
    "prerequisiteIds": [
      "stn_469"
    ]
  },
  {
    "id": "stn_477",
    "name": "Absolute Zenith",
    "description": "Notable skill node for diplomacy at tier 94.",
    "tier": 94,
    "level": 1033,
    "branch": "diplomacy",
    "type": "notable",
    "cost": 3,
    "effects": {
      "weaponAccuracy": 15
    },
    "prerequisiteIds": [
      "stn_470"
    ]
  },
  {
    "id": "stn_478",
    "name": "Final Core",
    "description": "Notable skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1035,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_471"
    ]
  },
  {
    "id": "stn_479",
    "name": "Final Node",
    "description": "Standard skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1036,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "constructionCost": 10
    },
    "prerequisiteIds": [
      "stn_472"
    ]
  },
  {
    "id": "stn_480",
    "name": "Final Focus",
    "description": "Standard skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1038,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 10
    },
    "prerequisiteIds": [
      "stn_473"
    ]
  },
  {
    "id": "stn_481",
    "name": "Final Aspect",
    "description": "Standard skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1039,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 10
    },
    "prerequisiteIds": [
      "stn_474"
    ]
  },
  {
    "id": "stn_482",
    "name": "Final Mastery",
    "description": "Standard skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1041,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 10
    },
    "prerequisiteIds": [
      "stn_475"
    ]
  },
  {
    "id": "stn_483",
    "name": "Final Apex",
    "description": "Standard skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1042,
    "branch": "espionage",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 10
    },
    "prerequisiteIds": [
      "stn_476"
    ]
  },
  {
    "id": "stn_484",
    "name": "Final Zenith",
    "description": "Notable skill node for espionage at tier 95.",
    "tier": 95,
    "level": 1044,
    "branch": "espionage",
    "type": "notable",
    "cost": 3,
    "effects": {
      "buildSpeed": 15
    },
    "prerequisiteIds": [
      "stn_477"
    ]
  },
  {
    "id": "stn_485",
    "name": "Ultimate Core",
    "description": "Notable skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1046,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_478"
    ]
  },
  {
    "id": "stn_486",
    "name": "Ultimate Node",
    "description": "Standard skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1047,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "tradeBonus": 11
    },
    "prerequisiteIds": [
      "stn_479"
    ]
  },
  {
    "id": "stn_487",
    "name": "Ultimate Focus",
    "description": "Standard skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1049,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "diplomacyRating": 11
    },
    "prerequisiteIds": [
      "stn_480"
    ]
  },
  {
    "id": "stn_488",
    "name": "Ultimate Aspect",
    "description": "Standard skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1050,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "espionagePower": 11
    },
    "prerequisiteIds": [
      "stn_481"
    ]
  },
  {
    "id": "stn_489",
    "name": "Ultimate Mastery",
    "description": "Standard skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1052,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "colonyGrowth": 11
    },
    "prerequisiteIds": [
      "stn_482"
    ]
  },
  {
    "id": "stn_490",
    "name": "Ultimate Apex",
    "description": "Standard skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1053,
    "branch": "exploration",
    "type": "normal",
    "cost": 1,
    "effects": {
      "criticalStrike": 11
    },
    "prerequisiteIds": [
      "stn_483"
    ]
  },
  {
    "id": "stn_491",
    "name": "Ultimate Zenith",
    "description": "Notable skill node for exploration at tier 96.",
    "tier": 96,
    "level": 1055,
    "branch": "exploration",
    "type": "notable",
    "cost": 3,
    "effects": {
      "evasion": 15
    },
    "prerequisiteIds": [
      "stn_484"
    ]
  },
  {
    "id": "stn_492",
    "name": "Supreme Core",
    "description": "Notable skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1057,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "morale": 15
    },
    "prerequisiteIds": [
      "stn_485"
    ]
  },
  {
    "id": "stn_493",
    "name": "Supreme Node",
    "description": "Standard skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1058,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "leadershipRadius": 12
    },
    "prerequisiteIds": [
      "stn_486"
    ]
  },
  {
    "id": "stn_494",
    "name": "Supreme Focus",
    "description": "Standard skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1060,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "intelRange": 12
    },
    "prerequisiteIds": [
      "stn_487"
    ]
  },
  {
    "id": "stn_495",
    "name": "Supreme Aspect",
    "description": "Standard skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1061,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shipCapacity": 12
    },
    "prerequisiteIds": [
      "stn_488"
    ]
  },
  {
    "id": "stn_496",
    "name": "Supreme Mastery",
    "description": "Standard skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1063,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "shieldStrength": 12
    },
    "prerequisiteIds": [
      "stn_489"
    ]
  },
  {
    "id": "stn_497",
    "name": "Supreme Apex",
    "description": "Standard skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1064,
    "branch": "mysticism",
    "type": "normal",
    "cost": 1,
    "effects": {
      "weaponAccuracy": 12
    },
    "prerequisiteIds": [
      "stn_490"
    ]
  },
  {
    "id": "stn_498",
    "name": "Supreme Zenith",
    "description": "Notable skill node for mysticism at tier 97.",
    "tier": 97,
    "level": 1066,
    "branch": "mysticism",
    "type": "notable",
    "cost": 3,
    "effects": {
      "fuelEfficiency": 15
    },
    "prerequisiteIds": [
      "stn_491"
    ]
  },
  {
    "id": "stn_499",
    "name": "Tier-98 Core",
    "description": "Notable skill node for industry at tier 98.",
    "tier": 98,
    "level": 1068,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "constructionCost": 15
    },
    "prerequisiteIds": [
      "stn_492"
    ]
  },
  {
    "id": "stn_500",
    "name": "Tier-98 Node",
    "description": "Standard skill node for industry at tier 98.",
    "tier": 98,
    "level": 1069,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "attackPower": 13
    },
    "prerequisiteIds": [
      "stn_493"
    ]
  },
  {
    "id": "stn_501",
    "name": "Tier-98 Focus",
    "description": "Standard skill node for industry at tier 98.",
    "tier": 98,
    "level": 1071,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "defenseRating": 13
    },
    "prerequisiteIds": [
      "stn_494"
    ]
  },
  {
    "id": "stn_502",
    "name": "Tier-98 Aspect",
    "description": "Standard skill node for industry at tier 98.",
    "tier": 98,
    "level": 1072,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "fleetSpeed": 13
    },
    "prerequisiteIds": [
      "stn_495"
    ]
  },
  {
    "id": "stn_503",
    "name": "Tier-98 Mastery",
    "description": "Standard skill node for industry at tier 98.",
    "tier": 98,
    "level": 1074,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "researchRate": 13
    },
    "prerequisiteIds": [
      "stn_496"
    ]
  },
  {
    "id": "stn_504",
    "name": "Tier-98 Apex",
    "description": "Standard skill node for industry at tier 98.",
    "tier": 98,
    "level": 1075,
    "branch": "industry",
    "type": "normal",
    "cost": 1,
    "effects": {
      "buildSpeed": 13
    },
    "prerequisiteIds": [
      "stn_497"
    ]
  },
  {
    "id": "stn_505",
    "name": "Tier-98 Zenith",
    "description": "Notable skill node for industry at tier 98.",
    "tier": 98,
    "level": 1077,
    "branch": "industry",
    "type": "notable",
    "cost": 3,
    "effects": {
      "resourceOutput": 15
    },
    "prerequisiteIds": [
      "stn_498"
    ]
  },
  {
    "id": "stn_506",
    "name": "Tier-99 Core",
    "description": "Notable skill node for command at tier 99.",
    "tier": 99,
    "level": 1079,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "tradeBonus": 15
    },
    "prerequisiteIds": [
      "stn_499"
    ]
  },
  {
    "id": "stn_507",
    "name": "Tier-99 Node",
    "description": "Legendary skill node for command at tier 99.",
    "tier": 99,
    "level": 1080,
    "branch": "command",
    "type": "legendary",
    "cost": 10,
    "effects": {
      "diplomacyRating": 50
    },
    "prerequisiteIds": [
      "stn_500"
    ]
  },
  {
    "id": "stn_508",
    "name": "Tier-99 Focus",
    "description": "Legendary skill node for command at tier 99.",
    "tier": 99,
    "level": 1082,
    "branch": "command",
    "type": "legendary",
    "cost": 10,
    "effects": {
      "espionagePower": 50
    },
    "prerequisiteIds": [
      "stn_501"
    ]
  },
  {
    "id": "stn_509",
    "name": "Tier-99 Aspect",
    "description": "Legendary skill node for command at tier 99.",
    "tier": 99,
    "level": 1083,
    "branch": "command",
    "type": "legendary",
    "cost": 10,
    "effects": {
      "colonyGrowth": 50
    },
    "prerequisiteIds": [
      "stn_502"
    ]
  },
  {
    "id": "stn_510",
    "name": "Tier-99 Mastery",
    "description": "Legendary skill node for command at tier 99.",
    "tier": 99,
    "level": 1085,
    "branch": "command",
    "type": "legendary",
    "cost": 10,
    "effects": {
      "criticalStrike": 50
    },
    "prerequisiteIds": [
      "stn_503"
    ]
  },
  {
    "id": "stn_511",
    "name": "Tier-99 Apex",
    "description": "Legendary skill node for command at tier 99.",
    "tier": 99,
    "level": 1086,
    "branch": "command",
    "type": "legendary",
    "cost": 10,
    "effects": {
      "evasion": 50
    },
    "prerequisiteIds": [
      "stn_504"
    ]
  },
  {
    "id": "stn_512",
    "name": "Tier-99 Zenith",
    "description": "Notable skill node for command at tier 99.",
    "tier": 99,
    "level": 1088,
    "branch": "command",
    "type": "notable",
    "cost": 3,
    "effects": {
      "morale": 15
    },
    "prerequisiteIds": [
      "stn_505"
    ]
  }
];
