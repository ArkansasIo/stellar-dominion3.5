// Medieval Military Titles, Names, and Equipment System

export const MILITARY_RANKS = [
  "Squire",
  "Soldier",
  "Sergeant",
  "Lieutenant",
  "Captain",
  "Knight",
  "Baron",
  "Earl",
  "Duke",
  "Commander"
];

export const MILITARY_TITLES = {
  infantry: [
    "Blade Master",
    "Iron Guard",
    "Shield Bearer",
    "Spear Thrust",
    "War Veteran",
    "Legionnaire",
    "Sentinel",
    "Enforcer",
    "Berserker",
    "Warlord"
  ],
  cavalry: [
    "Knight Errant",
    "Cavalry Commander",
    "Horse Master",
    "Charging Knight",
    "Mounted Lord",
    "Dragon Rider",
    "Steed Master",
    "Crusader",
    "Paladin",
    "Champion"
  ],
  archer: [
    "Bow Master",
    "Arrow Fletcher",
    "Sharpshooter",
    "Ranger Scout",
    "Marksman",
    "Swift Archer",
    "Precision Shot",
    "Sniper",
    "Fleet Foot",
    "Eagle Eye"
  ],
  mage: [
    "Spell Weaver",
    "Arcane Master",
    "Sorcerer",
    "Enchanter",
    "Mystic",
    "Wizard",
    "Sage",
    "Elementalist",
    "Battle Mage",
    "Archmage"
  ],
  support: [
    "Healer",
    "Life Mender",
    "Support Knight",
    "Cleric",
    "Priest",
    "Battle Medic",
    "Holy Guardian",
    "Paladin Healer",
    "Guardian Angel",
    "Bishop"
  ],
  siege: [
    "Siege Master",
    "Battering Ram",
    "Catapult Operator",
    "Trebuchet Master",
    "Demolition Expert",
    "Breach Master",
    "Stone Caster",
    "Wall Breaker",
    "Destroyer",
    "Obliterator"
  ]
};

export const TROOP_NAMES = {
  male: [
    "Aldric", "Beron", "Cedric", "Darius", "Edmund", "Fredrick", "Germund", "Harold",
    "Ingram", "Joren", "Kendric", "Leonidas", "Marcus", "Norbert", "Oswald", "Percival",
    "Quincy", "Roland", "Siegfried", "Thaddeus", "Ulrich", "Vincent", "Walrick", "Xavier",
    "Yoric", "Zephyr", "Aelred", "Balthazar", "Caspian", "Dorian", "Emeric", "Fabian"
  ],
  female: [
    "Aceline", "Beatrice", "Cassandra", "Delilah", "Eleanor", "Freya", "Guinevere", "Helena",
    "Isabelle", "Josephine", "Katherine", "Lumina", "Magnolia", "Nora", "Ophelia", "Penelope",
    "Quintessa", "Rosalind", "Seraphina", "Theodora", "Urania", "Valerie", "Winona", "Xena",
    "Yara", "Zara", "Arabella", "Bianca", "Celeste", "Daphne", "Evadne", "Falconia"
  ]
};

export const SURNAMES = [
  "Blackthorne", "Stonewall", "Ironforge", "Bloodhammer", "Steelhelm", "Graysteel",
  "Dragonslayer", "Braveheart", "Shadowblade", "Swiftarrow", "Firebrand", "Stormborn",
  "Oakheart", "Wolfsbane", "Rimefang", "Flashbolt", "Trueheart", "Boldwater",
  "Strongarm", "Thornwick", "Crystalpeak", "Goldleaf", "Darkholm", "Lightbringer",
  "Ravencrest", "Phoenixrise", "Tideswept", "Mountainborn", "Frostbringer", "Valorian"
];

export const WEAPONS = {
  infantry: [
    { name: "Iron Sword", rarity: "common", damage: 10, weight: 8 },
    { name: "Steel Blade", rarity: "uncommon", damage: 15, weight: 8 },
    { name: "Legendary Greatsword", rarity: "rare", damage: 25, weight: 12 },
    { name: "Battle Axe", rarity: "uncommon", damage: 18, weight: 10 },
    { name: "War Hammer", rarity: "uncommon", damage: 20, weight: 14 },
    { name: "Ancient Claymore", rarity: "epic", damage: 30, weight: 13 }
  ],
  cavalry: [
    { name: "Cavalry Lance", rarity: "common", damage: 12, weight: 10 },
    { name: "Charge Lance", rarity: "uncommon", damage: 18, weight: 10 },
    { name: "Dragon Lance", rarity: "rare", damage: 28, weight: 11 },
    { name: "Mounted Sword", rarity: "uncommon", damage: 16, weight: 8 },
    { name: "Crusader's Pike", rarity: "epic", damage: 32, weight: 12 }
  ],
  archer: [
    { name: "Wooden Bow", rarity: "common", damage: 8, weight: 4 },
    { name: "Recurve Bow", rarity: "uncommon", damage: 12, weight: 5 },
    { name: "Elven Longbow", rarity: "rare", damage: 18, weight: 5 },
    { name: "Crossbow", rarity: "uncommon", damage: 14, weight: 6 },
    { name: "Dragon's Bow", rarity: "epic", damage: 24, weight: 6 }
  ],
  mage: [
    { name: "Wooden Staff", rarity: "common", damage: 6, weight: 3 },
    { name: "Arcane Staff", rarity: "uncommon", damage: 12, weight: 4 },
    { name: "Void Orb", rarity: "rare", damage: 20, weight: 2 },
    { name: "Scepter of Flames", rarity: "epic", damage: 28, weight: 3 }
  ],
  support: [
    { name: "Holy Staff", rarity: "common", damage: 4, weight: 3 },
    { name: "Blessed Mace", rarity: "uncommon", damage: 10, weight: 7 },
    { name: "Healing Scepter", rarity: "rare", damage: 8, weight: 2 },
    { name: "Divine Wand", rarity: "epic", damage: 15, weight: 2 }
  ],
  siege: [
    { name: "Warhammer", rarity: "uncommon", damage: 22, weight: 16 },
    { name: "Maul", rarity: "rare", damage: 28, weight: 18 },
    { name: "Giant Crusher", rarity: "epic", damage: 35, weight: 20 }
  ]
};

export const ARMOR = {
  light: [
    { name: "Leather Armor", rarity: "common", defense: 5, weight: 5, evade: 5 },
    { name: "Studded Leather", rarity: "uncommon", defense: 8, weight: 6, evade: 4 },
    { name: "Elven Garb", rarity: "rare", defense: 12, weight: 4, evade: 7 }
  ],
  medium: [
    { name: "Chain Mail", rarity: "common", defense: 10, weight: 12, evade: 2 },
    { name: "Reinforced Mail", rarity: "uncommon", defense: 14, weight: 13, evade: 1 },
    { name: "Mithril Chain", rarity: "rare", defense: 18, weight: 11, evade: 2 }
  ],
  heavy: [
    { name: "Plate Armor", rarity: "uncommon", defense: 18, weight: 20, evade: -2 },
    { name: "Full Plate", rarity: "rare", defense: 24, weight: 22, evade: -1 },
    { name: "Adamantite Plate", rarity: "epic", defense: 30, weight: 24, evade: 0 }
  ]
};

export const HELMETS = [
  { name: "Iron Helm", rarity: "common", defense: 2 },
  { name: "Steel Helm", rarity: "uncommon", defense: 4 },
  { name: "Dragon Scale Helm", rarity: "rare", defense: 6 },
  { name: "Crown of the King", rarity: "epic", defense: 8 }
];

export const SHIELDS = [
  { name: "Wooden Shield", rarity: "common", defense: 3 },
  { name: "Iron Shield", rarity: "uncommon", defense: 6 },
  { name: "Knight's Shield", rarity: "rare", defense: 9 },
  { name: "Aegis of the Ancients", rarity: "epic", defense: 12 }
];

// Equipment type restrictions
export const EQUIPMENT_RESTRICTIONS = {
  infantry: {
    armor: ["light", "medium", "heavy"],
    weapons: ["infantry"],
    canUseShield: true,
    canUseHelm: true
  },
  cavalry: {
    armor: ["light", "medium", "heavy"],
    weapons: ["cavalry"],
    canUseShield: true,
    canUseHelm: true
  },
  archer: {
    armor: ["light"],
    weapons: ["archer"],
    canUseShield: false,
    canUseHelm: true
  },
  mage: {
    armor: ["light"],
    weapons: ["mage"],
    canUseShield: false,
    canUseHelm: true
  },
  support: {
    armor: ["light", "medium"],
    weapons: ["support"],
    canUseShield: true,
    canUseHelm: true
  },
  siege: {
    armor: ["medium", "heavy"],
    weapons: ["siege"],
    canUseShield: true,
    canUseHelm: true
  }
};

// Class equipment preferences
export const CLASS_PREFERENCES = {
  warrior: { preferredArmor: "heavy", preferredWeapon: "sword" },
  knight: { preferredArmor: "heavy", preferredWeapon: "lance" },
  berserker: { preferredArmor: "medium", preferredWeapon: "axe" },
  paladin: { preferredArmor: "heavy", preferredWeapon: "holy" },
  ranger: { preferredArmor: "light", preferredWeapon: "bow" },
  scout: { preferredArmor: "light", preferredWeapon: "dagger" },
  mage: { preferredArmor: "light", preferredWeapon: "staff" },
  healer: { preferredArmor: "light", preferredWeapon: "staff" },
  engineer: { preferredArmor: "medium", preferredWeapon: "tool" }
};

export function generateTroopName(): string {
  const isNeutral = Math.random() > 0.5;
  const surnames = SURNAMES;
  const firstNames = isNeutral ? TROOP_NAMES.male : TROOP_NAMES.female;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${firstName} ${surname}`;
}

export function getRandomTitle(troopType: string): string {
  const titles = MILITARY_TITLES[troopType as keyof typeof MILITARY_TITLES] || MILITARY_TITLES.infantry;
  return titles[Math.floor(Math.random() * titles.length)];
}

export function getRandomRank(): string {
  return MILITARY_RANKS[Math.floor(Math.random() * MILITARY_RANKS.length)];
}

export function getEquipmentFor(troopType: string) {
  const restrictions = EQUIPMENT_RESTRICTIONS[troopType as keyof typeof EQUIPMENT_RESTRICTIONS];
  if (!restrictions) return null;

  const allowedWeapons = WEAPONS[troopType as keyof typeof WEAPONS] || [];
  const allowedArmor = ARMOR.light; // Default to light
  
  return {
    weapon: allowedWeapons[Math.floor(Math.random() * allowedWeapons.length)] || null,
    armor: allowedArmor[Math.floor(Math.random() * allowedArmor.length)] || null,
    helmet: HELMETS[Math.floor(Math.random() * HELMETS.length)] || null,
    shield: restrictions.canUseShield ? SHIELDS[Math.floor(Math.random() * SHIELDS.length)] : null
  };
}
