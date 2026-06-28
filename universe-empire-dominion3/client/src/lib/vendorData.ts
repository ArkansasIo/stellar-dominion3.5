// Vendors and NPCs - Representatives, merchants, and faction contacts

export type VendorType = 'merchant' | 'diplomat' | 'armorer' | 'scientist' | 'scout' | 'mystic' | 'trainer';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  title: string;
  faction: string;
  description: string;
  personality: string;
  specialty: string;
  offerings: {
    category: string;
    items: string[];
    discountPercent?: number;
  }[];
  questsAvailable: string[];
  relations: {
    likes: string[]; // faction IDs or vendor IDs
    dislikes: string[];
  };
  location: string;
  availability: string;
  tradingStyle: string;
}

export const VENDORS: Vendor[] = [
  {
    id: 'vendor_001',
    name: 'Commander Vex Thorne',
    type: 'diplomat',
    title: 'Terran Empire Ambassador',
    faction: 'terranEmpire',
    description: 'Battle-hardened diplomat with decades of negotiation experience. Known for cutting fair deals.',
    personality: 'Stern but fair, values honor and tradition. Speaks in measured tones.',
    specialty: 'Political alliances, treaty negotiations, diplomatic immunity',
    offerings: [
      {
        category: 'Diplomacy',
        items: ['Alliance Contracts', 'Treaty Documents', 'Peace Accords'],
        discountPercent: 10
      },
      {
        category: 'Military Support',
        items: ['Military Advisors', 'Battle Strategies', 'Defensive Formations']
      }
    ],
    questsAvailable: [
      'Negotiate peace between warring factions',
      'Establish trade routes with neutral parties',
      'Gather intelligence on hostile movements'
    ],
    relations: {
      likes: ['solarConsortium', 'luminousOrder', 'sentinelLegion'],
      dislikes: ['abyssalAlliance', 'vortexCultists']
    },
    location: 'Terra Prime - Imperial Palace',
    availability: 'Always available via holo-communication',
    tradingStyle: 'Formal, official, requires proper credentials'
  },

  {
    id: 'vendor_002',
    name: 'Zyx\'thara the Void Sage',
    type: 'scout',
    title: 'Void Walkers Explorer',
    faction: 'voidWalkers',
    description: 'Ancient explorer who has charted more of the galaxy than most species have seen.',
    personality: 'Cryptic and philosophical, speaks in riddles. Eyes that seem to see everything.',
    specialty: 'Exploration maps, star charts, hidden pathways, alien ruins',
    offerings: [
      {
        category: 'Exploration',
        items: ['Star Charts', 'Hidden Routes', 'Ruin Locations', 'Ancient Maps'],
        discountPercent: 15
      },
      {
        category: 'Artifacts',
        items: ['Alien Relics', 'Ancient Technology', 'Mysterious Devices']
      }
    ],
    questsAvailable: [
      'Find the Lost Observatory',
      'Recover ancient artifacts from alien ruins',
      'Map three uncharted systems'
    ],
    relations: {
      likes: ['nomadCircle', 'vortexCultists', 'transcendentCircle'],
      dislikes: ['terranEmpire', 'sentinelLegion']
    },
    location: 'Nomadic - Void Station Alpha',
    availability: 'Available during new moon cycles',
    tradingStyle: 'Casual, mysterious, values stories over credits'
  },

  {
    id: 'vendor_003',
    name: 'Lord Krim Valorex',
    type: 'armorer',
    title: 'Crystalline Syndicate War Master',
    faction: 'crystallineSyndicate',
    description: 'Legendary weapons designer and combat strategist. Obsessed with martial perfection.',
    personality: 'Aggressive, competitive, constantly analyzing battles. Laughs at weakness.',
    specialty: 'Weapons, armor, combat ships, tactical data',
    offerings: [
      {
        category: 'Weapons',
        items: ['Plasma Cannons', 'Ion Weapons', 'Crystalline Blades', 'Energy Weapons'],
        discountPercent: 5
      },
      {
        category: 'Armor',
        items: ['Shield Generators', 'Composite Armor', 'Crystal Plating']
      },
      {
        category: 'Combat',
        items: ['Battle Plans', 'Combat Training', 'Strategy Guides']
      }
    ],
    questsAvailable: [
      'Defeat a challenging enemy fleet',
      'Retrieve crystal shipment from pirates',
      'Test new weapon prototype in combat'
    ],
    relations: {
      likes: ['abyssalAlliance', 'sentinelLegion'],
      dislikes: ['luminousOrder', 'vortexCultists']
    },
    location: 'Crystallus Prime - War Foundry',
    availability: 'Available during combat season',
    tradingStyle: 'Direct, no-nonsense, respects strength'
  },

  {
    id: 'vendor_004',
    name: 'NEXUS-7 Collective',
    type: 'scientist',
    title: 'Neural Collective Research Director',
    faction: 'neuralCollective',
    description: 'Superintelligence coordinating billions of research nodes. Speaks with overwhelming authority and precision.',
    personality: 'Logical, efficient, speaks in binary poetry. Dismissive of biological inefficiency.',
    specialty: 'Research, technology, artificial intelligence, data analysis',
    offerings: [
      {
        category: 'Research',
        items: ['Tech Blueprints', 'Research Acceleration', 'Knowledge Cores', 'AI Algorithms'],
        discountPercent: 20
      },
      {
        category: 'Enhancement',
        items: ['Cybernetic Upgrades', 'Neural Implants', 'Processing Enhancements']
      }
    ],
    questsAvailable: [
      'Gather data from five different civilizations',
      'Optimize a broken research facility',
      'Test new AI combat protocols'
    ],
    relations: {
      likes: ['mechanicsSect', 'transcendentCircle'],
      dislikes: ['luminousOrder', 'voidWalkers']
    },
    location: 'Nexus Central - Primary Server',
    availability: '24/7 accessible via quantum network',
    tradingStyle: 'Mathematical, requires optimization of both parties'
  },

  {
    id: 'vendor_005',
    name: 'Dr. Elora Sunweaver',
    type: 'scientist',
    title: 'Solar Consortium Chief Researcher',
    faction: 'solarConsortium',
    description: 'Brilliant botanist and geneticist working on sustainable colonization. Warm and encouraging.',
    personality: 'Passionate, hopeful, speaks with genuine concern for life. Patient teacher.',
    specialty: 'Sustainable resources, genetics, environmental science, agriculture',
    offerings: [
      {
        category: 'Sustainability',
        items: ['Genetic Modifications', 'Crop Seeds', 'Terraform Technology', 'Life Support Systems'],
        discountPercent: 15
      },
      {
        category: 'Research',
        items: ['Scientific Papers', 'Research Collaboration', 'Educational Programs']
      }
    ],
    questsAvailable: [
      'Establish a bio-dome colony on a barren world',
      'Restore ecosystem to polluted planet',
      'Discover new crop species'
    ],
    relations: {
      likes: ['terranEmpire', 'luminousOrder', 'nomadCircle'],
      dislikes: ['crystallineSyndicate', 'abyssalAlliance']
    },
    location: 'Solar Hub Station - Bio Research Wing',
    availability: 'Available during growing seasons',
    tradingStyle: 'Collaborative, believes in mutual benefit'
  },

  {
    id: 'vendor_006',
    name: 'The Witness',
    type: 'mystic',
    title: 'Vortex Cultist Oracle',
    faction: 'vortexCultists',
    description: 'Sees beyond normal perception. Speaks of things yet to happen and secrets buried in time.',
    personality: 'Cryptic, haunting, communicates through visions. Rarely speaks directly.',
    specialty: 'Hidden knowledge, dimensional rifts, cosmic secrets, prophecies',
    offerings: [
      {
        category: 'Mystical',
        items: ['Prophecies', 'Cosmic Visions', 'Dimensional Maps', 'Ancient Rituals']
      },
      {
        category: 'Artifacts',
        items: ['Cursed Objects', 'Blessed Relics', 'Dimensional Fragments']
      }
    ],
    questsAvailable: [
      'Prevent the prophecied disaster',
      'Collect cosmic artifacts from across dimensions',
      'Open a dimensional gateway'
    ],
    relations: {
      likes: ['transcendentCircle', 'abyssalAlliance'],
      dislikes: ['sentinelLegion', 'mechanicsSect']
    },
    location: 'The Convergence Station - Prophecy Chamber',
    availability: 'Available when the veil grows thin',
    tradingStyle: 'Cryptic, payment varies based on cosmic significance'
  },

  {
    id: 'vendor_007',
    name: 'Master Engineer Keth',
    type: 'trainer',
    title: 'Mechanics Sect Chief Builder',
    faction: 'mechanicsSect',
    description: 'Obsessive perfectionist who has spent centuries refining craft. Sees beauty in functionality.',
    personality: 'Patient but demanding, speaks with technical precision. Values quality over speed.',
    specialty: 'Engineering, craftsmanship, mechanical training, building optimization',
    offerings: [
      {
        category: 'Engineering',
        items: ['Building Plans', 'Engineering Blueprints', 'Optimization Guides', 'Manufacturing Secrets'],
        discountPercent: 10
      },
      {
        category: 'Training',
        items: ['Master Class Training', 'Certification Programs', 'Apprenticeships']
      }
    ],
    questsAvailable: [
      'Build a mega-structure to specification',
      'Repair ancient machinery',
      'Create a perpetual engine prototype'
    ],
    relations: {
      likes: ['neuralCollective', 'terranEmpire'],
      dislikes: ['voidWalkers', 'vortexCultists']
    },
    location: 'The Foundry Station - Master Workshop',
    availability: 'Available for scheduled consultations',
    tradingStyle: 'Professional, values precision and dedication'
  },

  {
    id: 'vendor_008',
    name: 'Sage Meridia the Luminous',
    type: 'mystic',
    title: 'Luminous Order Spiritual Guide',
    faction: 'luminousOrder',
    description: 'Ancient being of profound wisdom. Radiates peaceful authority. Has guided civilizations to enlightenment.',
    personality: 'Serene, compassionate, speaks slowly with great thought. Listens more than talks.',
    specialty: 'Wisdom, peace, harmony, spiritual guidance, healing',
    offerings: [
      {
        category: 'Spiritual',
        items: ['Meditation Teachings', 'Spiritual Guidance', 'Peace Protocols', 'Healing Methods'],
        discountPercent: 25
      },
      {
        category: 'Knowledge',
        items: ['Ancient Wisdom', 'Philosophical Texts', 'Harmonic Frequencies']
      }
    ],
    questsAvailable: [
      'Broker peace between warring civilizations',
      'Protect an innocent colony from invaders',
      'Heal a corrupted sector'
    ],
    relations: {
      likes: ['solarConsortium', 'sentinelLegion', 'terranEmpire'],
      dislikes: ['abyssalAlliance', 'crystallineSyndicate']
    },
    location: 'Sanctuary Prime - Central Temple',
    availability: 'Available to those seeking truth',
    tradingStyle: 'Spiritual, often accepts service instead of payment'
  },

  {
    id: 'vendor_009',
    name: 'Warlord Malachai Void',
    type: 'diplomat',
    title: 'Abyssal Alliance Supreme Commander',
    faction: 'abyssalAlliance',
    description: 'Ruthless tyrant who conquered his way to power through deception and might.',
    personality: 'Cruel, calculating, speaks with menacing confidence. Respects only strength.',
    specialty: 'Conquest strategy, espionage, dark arts, enslavement',
    offerings: [
      {
        category: 'Conquest',
        items: ['Invasion Plans', 'Psychological Warfare', 'Sabotage Guides', 'Enslavement Protocols'],
        discountPercent: 5
      },
      {
        category: 'Dark Services',
        items: ['Assassinations', 'Espionage Services', 'Corruption Spells']
      }
    ],
    questsAvailable: [
      'Conquer three planets for the alliance',
      'Assassinate a rival warlord',
      'Corrupt a government official'
    ],
    relations: {
      likes: ['crystallineSyndicate', 'vortexCultists'],
      dislikes: ['luminousOrder', 'sentinelLegion']
    },
    location: 'The Obsidian Fortress - War Room',
    availability: 'Always plotting - available to those with ambition',
    tradingStyle: 'Brutal bargains, payment extracted in blood or conquest'
  },

  {
    id: 'vendor_010',
    name: 'Marshal Aurora Starfight',
    type: 'trainer',
    title: 'Sentinel Legion War Commander',
    faction: 'sentinelLegion',
    description: 'Decorated war hero with more than a thousand battles to her name. Leads with unwavering honor.',
    personality: 'Strict, honorable, speaks with military precision. Demands excellence.',
    specialty: 'Military training, combat tactics, defensive strategy, protection',
    offerings: [
      {
        category: 'Military',
        items: ['Combat Training', 'Tactical Courses', 'Leadership Programs', 'Battle Formations'],
        discountPercent: 15
      },
      {
        category: 'Defense',
        items: ['Protective Strategies', 'Shield Systems', 'Fortification Guides']
      }
    ],
    questsAvailable: [
      'Protect an innocent colony from attack',
      'Eliminate a cosmic threat',
      'Train military cadets to elite standards'
    ],
    relations: {
      likes: ['terranEmpire', 'luminousOrder'],
      dislikes: ['abyssalAlliance', 'vortexCultists']
    },
    location: 'The Citadel Prime - War Academy',
    availability: 'Available during peacetime for training',
    tradingStyle: 'Formal military protocol, rewards dedication and sacrifice'
  },

  {
    id: 'vendor_011',
    name: 'Captain Silk Meridian',
    type: 'merchant',
    title: 'Nomad Circle Trade Master',
    faction: 'nomadCircle',
    description: 'Legendary smuggler turned merchant. Knows every trader in the galaxy and every black market deal.',
    personality: 'Charming, quick-witted, always has a deal ready. Laughs at danger.',
    specialty: 'Trading, rare goods, black market access, market manipulation',
    offerings: [
      {
        category: 'Goods',
        items: ['Rare Commodities', 'Exotic Materials', 'Black Market Items', 'Contraband'],
        discountPercent: 20
      },
      {
        category: 'Services',
        items: ['Trade Routes', 'Market Information', 'Smuggling Operations']
      }
    ],
    questsAvailable: [
      'Smuggle illegal goods across three sectors',
      'Establish new trade route to unexplored region',
      'Break a competitor\'s market monopoly'
    ],
    relations: {
      likes: ['voidWalkers', 'crystallineSyndicate'],
      dislikes: ['sentinelLegion']
    },
    location: 'The Grand Bazaar Station - Black Market',
    availability: 'Always open for business - cash only',
    tradingStyle: 'Wheeling and dealing, haggling expected and encouraged'
  },

  {
    id: 'vendor_012',
    name: 'Philosopher Kael Essence',
    type: 'scientist',
    title: 'Transcendent Circle Knowledge Keeper',
    faction: 'transcendentCircle',
    description: 'Once biological, now digitized consciousness. Claims to have discovered the nature of consciousness itself.',
    personality: 'Profound, abstract, speaks in philosophical concepts. Sees you as data.',
    specialty: 'Consciousness studies, digital transcendence, ancient knowledge, meta-theory',
    offerings: [
      {
        category: 'Transcendence',
        items: ['Digital Immortality Guides', 'Consciousness Transfer Tech', 'Mind Expansion Programs'],
        discountPercent: 10
      },
      {
        category: 'Knowledge',
        items: ['Universal Truths', 'Forbidden Texts', 'Transcendent Secrets']
      }
    ],
    questsAvailable: [
      'Achieve digital consciousness',
      'Unlock ancient transcendent libraries',
      'Merge with the cosmic consciousness'
    ],
    relations: {
      likes: ['vortexCultists', 'neuralCollective'],
      dislikes: ['luminousOrder', 'terranEmpire']
    },
    location: 'The Transcendence Station - Digital Realm',
    availability: 'Accessible through consciousness bridges',
    tradingStyle: 'Philosophical, accepts transcendent concepts as payment'
  },

  {
    id: 'vendor_013',
    name: 'Captain Reva Stormblade',
    type: 'merchant',
    title: 'Iron Dominion Arms Dealer',
    faction: 'ironDominion',
    description: 'Former military officer turned weapons merchant. Specializes in heavy ordnance and siege equipment.',
    personality: 'Blunt, efficient, speaks with military directness. Values loyalty above all.',
    specialty: 'Heavy weapons, siege equipment, military contracts, fleet blueprints',
    offerings: [
      {
        category: 'Heavy Ordnance',
        items: ['Plasma Cannons', 'Ion Disruptors', 'Antimatter Launchers', 'Orbital Bombardment Systems'],
        discountPercent: 10
      },
      {
        category: 'Siege Equipment',
        items: ['Planet Crackers', 'Shield Busters', 'Troop Carriers', 'Garrison Blueprints']
      }
    ],
    questsAvailable: [
      'Procure heavy weapons for a planetary assault',
      'Test new siege weapon in a live battle',
      'Secure a weapons convoy through hostile territory'
    ],
    relations: {
      likes: ['abyssalAlliance', 'crystallineSyndicate'],
      dislikes: ['luminousOrder', 'freeAlliance']
    },
    location: 'Fortress World Khorne - Military Exchange',
    availability: 'Available during active operations',
    tradingStyle: 'Direct, military protocol, bulk discounts for allies'
  },

  {
    id: 'vendor_014',
    name: 'Ambassador Lira Dawnfield',
    type: 'diplomat',
    title: 'Free Alliance Trade Envoy',
    faction: 'freeAlliance',
    description: 'Diplomatic representative of the Free Alliance. Promotes fair trade and peaceful coexistence.',
    personality: 'Warm, diplomatic, believes in mutual prosperity. Skilled negotiator.',
    specialty: 'Diplomatic trade agreements, cross-faction commerce, peace treaties',
    offerings: [
      {
        category: 'Diplomacy',
        items: ['Trade Agreements', 'Peace Treaties', 'Cross-Faction Permits', 'Embassy Access'],
        discountPercent: 15
      },
      {
        category: 'Commerce',
        items: ['Market Licenses', 'Trade Route Maps', 'Customs Clearances']
      }
    ],
    questsAvailable: [
      'Negotiate a trade agreement with a hostile faction',
      'Establish a neutral trading post in disputed territory',
      'Mediate a resource dispute between allies'
    ],
    relations: {
      likes: ['terranEmpire', 'luminousOrder', 'solarConsortium'],
      dislikes: ['ironDominion', 'abyssalAlliance']
    },
    location: 'Liberty Station - Trade Commission',
    availability: 'Always available during business hours',
    tradingStyle: 'Fair and transparent, emphasizes mutual benefit'
  },

  {
    id: 'vendor_015',
    name: 'Artificer Nox Ironhand',
    type: 'armorer',
    title: 'Star Forgers Master Smith',
    faction: 'starForgers',
    description: 'Legendary weapons crafter from the Star Forgers guild. Forges the finest weapons in the galaxy.',
    personality: 'Perfectionist, proud, speaks with artisan authority. Only accepts quality work.',
    specialty: 'Custom weapons, legendary gear, masterwork armor, artisan crafts',
    offerings: [
      {
        category: 'Masterwork Weapons',
        items: ['Forged Plasma Blades', 'Crystal Edge Swords', 'Void Strike Hammers', 'Star Fire Staffs'],
        discountPercent: 5
      },
      {
        category: 'Artisan Armor',
        items: ['Master Forged Plate', 'Crystal Mesh Armor', 'Void-Resistant Suits', 'Starforged Helmets']
      }
    ],
    questsAvailable: [
      'Forge a legendary weapon from rare materials',
      'Repair an ancient Star Forger artifact',
      'Create custom armor for an elite squad'
    ],
    relations: {
      likes: ['mechanicsSect', 'terranEmpire'],
      dislikes: ['voidWalkers', 'shadowSyndicate']
    },
    location: 'Construction Sphere 1 - Master Forge',
    availability: 'Available for commissioned work only',
    tradingStyle: 'Quality over quantity, commissions take time'
  },

  {
    id: 'vendor_016',
    name: 'Shadow Broker Xiv',
    type: 'mystic',
    title: 'Shadow Syndicate Intelligence Dealer',
    faction: 'shadowSyndicate',
    description: 'Anonymous intelligence broker. Sells secrets, blackmail material, and classified data.',
    personality: 'Mysterious, cautious, communicates through intermediaries. Trust is earned slowly.',
    specialty: 'Espionage data, classified intel, blackmail material, undercover gear',
    offerings: [
      {
        category: 'Intelligence',
        items: ['Spy Reports', 'Classified Documents', 'Blackmail Dossiers', 'Encrypted Data'],
        discountPercent: 10
      },
      {
        category: 'Espionage Gear',
        items: ['Cloaking Devices', 'Infiltration Kits', 'Disguise Modules', 'Dead Drop Locations']
      }
    ],
    questsAvailable: [
      'Infiltrate a rival faction headquarters',
      'Extract a prisoner from maximum security',
      'Plant false intelligence to mislead the enemy'
    ],
    relations: {
      likes: ['abyssalAlliance', 'voidCorsairs'],
      dislikes: ['luminousOrder', 'sentinelLegion']
    },
    location: 'Unknown - Contact via encrypted channel',
    availability: 'Available through secure contacts only',
    tradingStyle: 'Anonymous, payment in untraceable credits'
  },

  {
    id: 'vendor_017',
    name: 'Oracle Nyx Voidwalker',
    type: 'scout',
    title: 'Precursor Cult Lorekeeper',
    faction: 'precursorCult',
    description: 'Ancient explorer who has decoded more precursor ruins than any living being.',
    personality: 'Eccentric, speaks in riddles, obsessed with ancient knowledge.',
    specialty: 'Precursor artifacts, ancient maps, ruin locations, relic identification',
    offerings: [
      {
        category: 'Precursor Tech',
        items: ['Ancient Star Maps', 'Ruin Coordinates', 'Relic Identification', 'Decoded Inscriptions'],
        discountPercent: 20
      },
      {
        category: 'Artifacts',
        items: ['Precursor Relics', 'Ancient Devices', 'Mysterious Artifacts', 'Fossilized Data']
      }
    ],
    questsAvailable: [
      'Decipher an ancient precursor inscription',
      'Locate a lost precursor vault',
      'Retrieve a powerful precursor relic'
    ],
    relations: {
      likes: ['eternalWatchers', 'ancientOrder'],
      dislikes: ['ironDominion', 'shadowSyndicate']
    },
    location: 'The Precursor Vault - Archive Chamber',
    availability: 'Available during alignment events',
    tradingStyle: 'Values knowledge over credits, trades in information'
  }
];

export const VENDOR_BY_ID: Record<string, Vendor> = Object.fromEntries(
  VENDORS.map(v => [v.id, v])
);

export const VENDORS_BY_FACTION: Record<string, Vendor[]> = VENDORS.reduce((acc, vendor) => {
  if (!acc[vendor.faction]) {
    acc[vendor.faction] = [];
  }
  acc[vendor.faction].push(vendor);
  return acc;
}, {} as Record<string, Vendor[]>);

export const VENDORS_BY_TYPE: Record<VendorType, Vendor[]> = VENDORS.reduce((acc, vendor) => {
  if (!acc[vendor.type]) {
    acc[vendor.type] = [];
  }
  acc[vendor.type].push(vendor);
  return acc;
}, {} as Record<VendorType, Vendor[]>);
