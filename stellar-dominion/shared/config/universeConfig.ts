export const UNIVERSE_CONFIG = {
  seed: {
    default: 'STELLAR_DOMINION_2024',
    maxLength: 64,
  },
  
  size: {
    galaxyCount: 256,
    sectorsPerGalaxy: 64,
    systemsPerSector: 128,
    minPlanetsPerSystem: 0,
    maxPlanetsPerSystem: 15,
    minMoonsPerPlanet: 0,
    maxMoonsPerPlanet: 82,
    asteroidBeltChance: 0.3,
    cometChance: 0.1,
  },

  generation: {
    starTypeDistribution: {
      'O': 0.00003,
      'B': 0.0013,
      'A': 0.006,
      'F': 0.03,
      'G': 0.076,
      'K': 0.121,
      'M': 0.765,
    },
    
    planetTypeDistribution: {
      'rocky': 0.35,
      'gas_giant': 0.15,
      'ice_giant': 0.10,
      'desert': 0.15,
      'ocean': 0.08,
      'volcanic': 0.07,
      'frozen': 0.10,
    },

    habitableZone: {
      innerMultiplier: 0.75,
      outerMultiplier: 1.5,
    },

    nameGeneration: {
      prefixes: [
        'Nova', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
        'Proxima', 'Kepler', 'Trappist', 'Gliese', 'HD', 'HR', 'Ross', 'Wolf', 'Luyten',
        'Barnard', 'Sirius', 'Vega', 'Altair', 'Rigel', 'Betelgeuse', 'Polaris',
        'Antares', 'Deneb', 'Arcturus', 'Aldebaran', 'Regulus', 'Spica',
        'Tau', 'Sigma', 'Omega', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Pi', 'Rho',
      ],
      
      suffixes: [
        'Prime', 'Major', 'Minor', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
      ],
      
      syllables: [
        'al', 'an', 'ar', 'as', 'at', 'ax', 'az',
        'be', 'bi', 'bo', 'bu',
        'ca', 'ce', 'ci', 'co', 'cu', 'cy',
        'da', 'de', 'di', 'do', 'du',
        'el', 'en', 'er', 'es', 'et', 'ex',
        'fa', 'fe', 'fi', 'fo', 'fu',
        'ga', 'ge', 'gi', 'go', 'gu',
        'ha', 'he', 'hi', 'ho', 'hu',
        'ia', 'ie', 'io', 'is', 'it', 'ix',
        'ja', 'je', 'ji', 'jo', 'ju',
        'ka', 'ke', 'ki', 'ko', 'ku',
        'la', 'le', 'li', 'lo', 'lu', 'ly',
        'ma', 'me', 'mi', 'mo', 'mu',
        'na', 'ne', 'ni', 'no', 'nu',
        'on', 'or', 'os', 'ox',
        'pa', 'pe', 'pi', 'po', 'pu',
        'ra', 're', 'ri', 'ro', 'ru',
        'sa', 'se', 'si', 'so', 'su',
        'ta', 'te', 'ti', 'to', 'tu',
        'ul', 'un', 'ur', 'us', 'ut',
        'va', 've', 'vi', 'vo', 'vu',
        'xa', 'xe', 'xi', 'xo', 'xu',
        'ya', 'ye', 'yi', 'yo', 'yu',
        'za', 'ze', 'zi', 'zo', 'zu',
      ],
      
      greekLetters: [
        'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
        'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
        'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
      ],
      
      constellations: [
        'Andromeda', 'Aquarius', 'Aquila', 'Aries', 'Auriga', 'Bootes', 'Cancer',
        'Canis Major', 'Capricornus', 'Cassiopeia', 'Centaurus', 'Cepheus', 'Cetus',
        'Columba', 'Corona', 'Corvus', 'Crater', 'Crux', 'Cygnus', 'Delphinus',
        'Draco', 'Eridanus', 'Fornax', 'Gemini', 'Grus', 'Hercules', 'Hydra',
        'Leo', 'Libra', 'Lupus', 'Lyra', 'Ophiuchus', 'Orion', 'Pegasus',
        'Perseus', 'Phoenix', 'Pisces', 'Sagittarius', 'Scorpius', 'Sculptor',
        'Serpens', 'Taurus', 'Triangulum', 'Ursa Major', 'Ursa Minor', 'Virgo',
      ],
    },
  },

  starTypes: {
    'O': { name: 'Blue Giant', temperature: 30000, luminosity: 30000, mass: 16, color: '#9bb0ff', rarity: 'legendary' },
    'B': { name: 'Blue-White', temperature: 20000, luminosity: 10000, mass: 6, color: '#aabfff', rarity: 'epic' },
    'A': { name: 'White', temperature: 8500, luminosity: 25, mass: 2, color: '#cad7ff', rarity: 'rare' },
    'F': { name: 'Yellow-White', temperature: 6500, luminosity: 3, mass: 1.3, color: '#f8f7ff', rarity: 'uncommon' },
    'G': { name: 'Yellow Dwarf', temperature: 5500, luminosity: 1, mass: 1, color: '#fff4ea', rarity: 'common' },
    'K': { name: 'Orange Dwarf', temperature: 4500, luminosity: 0.4, mass: 0.7, color: '#ffd2a1', rarity: 'common' },
    'M': { name: 'Red Dwarf', temperature: 3000, luminosity: 0.04, mass: 0.3, color: '#ffcc6f', rarity: 'common' },
  },

  planetTypes: {
    'rocky': { name: 'Rocky', minRadius: 0.3, maxRadius: 1.5, atmosphereChance: 0.4, resources: ['metal', 'crystal'] },
    'gas_giant': { name: 'Gas Giant', minRadius: 5, maxRadius: 15, atmosphereChance: 1, resources: ['deuterium', 'helium'] },
    'ice_giant': { name: 'Ice Giant', minRadius: 3, maxRadius: 6, atmosphereChance: 1, resources: ['water', 'deuterium'] },
    'desert': { name: 'Desert', minRadius: 0.4, maxRadius: 1.8, atmosphereChance: 0.6, resources: ['metal', 'crystal', 'energy'] },
    'ocean': { name: 'Ocean', minRadius: 0.8, maxRadius: 2.5, atmosphereChance: 0.9, resources: ['water', 'food', 'deuterium'] },
    'volcanic': { name: 'Volcanic', minRadius: 0.3, maxRadius: 1.2, atmosphereChance: 0.3, resources: ['metal', 'energy', 'crystal'] },
    'frozen': { name: 'Frozen', minRadius: 0.5, maxRadius: 3, atmosphereChance: 0.5, resources: ['water', 'deuterium', 'crystal'] },
    'terran': { name: 'Terran', minRadius: 0.8, maxRadius: 1.5, atmosphereChance: 1, resources: ['food', 'water', 'metal', 'crystal'] },
    'barren': { name: 'Barren', minRadius: 0.2, maxRadius: 1, atmosphereChance: 0.1, resources: ['metal'] },
    'toxic': { name: 'Toxic', minRadius: 0.5, maxRadius: 2, atmosphereChance: 0.8, resources: ['crystal', 'exotic'] },
  },

  galaxyTypes: {
    'spiral': { armCount: [2, 4, 6], densityMultiplier: 1.0, habitableChance: 0.1 },
    'elliptical': { armCount: [0], densityMultiplier: 1.5, habitableChance: 0.05 },
    'irregular': { armCount: [0], densityMultiplier: 0.7, habitableChance: 0.08 },
    'lenticular': { armCount: [0], densityMultiplier: 1.2, habitableChance: 0.07 },
    'ring': { armCount: [1], densityMultiplier: 0.8, habitableChance: 0.06 },
  },

  specialObjects: {
    blackHole: {
      chance: 0.001,
      massRange: [3, 1000000000],
      eventHorizonMultiplier: 2.95,
    },
    neutronStar: {
      chance: 0.005,
      massRange: [1.4, 3],
      pulsarChance: 0.3,
    },
    whiteDwarf: {
      chance: 0.02,
      massRange: [0.5, 1.4],
    },
    nebula: {
      chance: 0.01,
      types: ['emission', 'reflection', 'dark', 'planetary', 'supernova_remnant'],
    },
    wormhole: {
      chance: 0.0001,
      stable: false,
    },
    dysonStructure: {
      chance: 0.00001,
      types: ['swarm', 'ring', 'sphere'],
    },
  },

  resourceMultipliers: {
    starType: {
      'O': { metal: 0.5, crystal: 2.0, deuterium: 3.0, energy: 5.0 },
      'B': { metal: 0.7, crystal: 1.8, deuterium: 2.5, energy: 4.0 },
      'A': { metal: 0.9, crystal: 1.5, deuterium: 2.0, energy: 3.0 },
      'F': { metal: 1.0, crystal: 1.2, deuterium: 1.5, energy: 2.0 },
      'G': { metal: 1.0, crystal: 1.0, deuterium: 1.0, energy: 1.0 },
      'K': { metal: 1.2, crystal: 0.9, deuterium: 0.8, energy: 0.7 },
      'M': { metal: 1.5, crystal: 0.7, deuterium: 0.6, energy: 0.5 },
    },
    orbitPosition: {
      inner: { metal: 1.5, crystal: 1.2, deuterium: 0.5, energy: 2.0 },
      habitable: { metal: 1.0, crystal: 1.0, deuterium: 1.0, energy: 1.0 },
      outer: { metal: 0.7, crystal: 1.3, deuterium: 2.0, energy: 0.5 },
    },
  },
} as const;

export type StarType = keyof typeof UNIVERSE_CONFIG.starTypes;
export type PlanetType = keyof typeof UNIVERSE_CONFIG.planetTypes;
export type GalaxyType = keyof typeof UNIVERSE_CONFIG.galaxyTypes;
