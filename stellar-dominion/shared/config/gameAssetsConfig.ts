/**
 * Game Assets Configuration
 * Centralized asset library with placeholders for all in-game images
 * Sizing conventions follow OGame standards
 * @tag #assets #images #ui #menuIcons #planets #ships
 */

// ============================================================================
// ASSET SIZE CONSTANTS (OGame-inspired standardization)
// ============================================================================

export const ASSET_SIZES = {
  // Menu & UI Icons
  ICON_SMALL: { width: 24, height: 24, name: "24x24px" },
  ICON_MEDIUM: { width: 32, height: 32, name: "32x32px" },
  ICON_LARGE: { width: 48, height: 48, name: "48x48px" },
  ICON_XLARGE: { width: 64, height: 64, name: "64x64px" },
  
  // Thumbnails & Cards
  THUMBNAIL_SMALL: { width: 64, height: 64, name: "64x64px" },
  THUMBNAIL_MEDIUM: { width: 128, height: 128, name: "128x128px" },
  THUMBNAIL_LARGE: { width: 200, height: 200, name: "200x200px" },
  
  // Full UI Elements
  BUTTON_SMALL: { width: 40, height: 40, name: "button_small" },
  BUTTON_MEDIUM: { width: 60, height: 60, name: "button_medium" },
  BUTTON_LARGE: { width: 100, height: 100, name: "button_large" },
  
  // Planet Views
  PLANET_SMALL: { width: 120, height: 120, name: "120x120px" },
  PLANET_MEDIUM: { width: 200, height: 200, name: "200x200px" },
  PLANET_LARGE: { width: 400, height: 400, name: "400x400px" },
  PLANET_DETAILED: { width: 600, height: 600, name: "600x600px" },
  
  // Ship Models
  SHIP_SMALL: { width: 96, height: 96, name: "96x96px" },
  SHIP_MEDIUM: { width: 150, height: 150, name: "150x150px" },
  SHIP_LARGE: { width: 300, height: 300, name: "300x300px" },
  
  // Building Previews
  BUILDING_ICON: { width: 80, height: 80, name: "80x80px" },
  BUILDING_PREVIEW: { width: 200, height: 200, name: "200x200px" },
  BUILDING_3D: { width: 400, height: 400, name: "400x400px" },
  
  // Background & Banners
  BANNER_SMALL: { width: 400, height: 200, name: "400x200px" },
  BANNER_MEDIUM: { width: 800, height: 400, name: "800x400px" },
  BANNER_LARGE: { width: 1200, height: 600, name: "1200x600px" },
  
  // Full Page Backgrounds
  BG_FULLSCREEN: { width: 1920, height: 1080, name: "1920x1080px" },
} as const;

// ============================================================================
// MENU & NAVIGATION ASSETS
// ============================================================================

export const MENU_ASSETS = {
  // Main Navigation Icons
  NAVIGATION: {
    HOME: {
      id: "nav-home",
      name: "Home",
      path: "/assets/menu/navigation/home.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Home/Overview navigation icon"
    },
    EMPIRE: {
      id: "nav-empire",
      name: "Empire",
      path: "/assets/menu/navigation/empire.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Empire management navigation"
    },
    RESEARCH: {
      id: "nav-research",
      name: "Research",
      path: "/assets/menu/navigation/research.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Research lab navigation"
    },
    MILITARY: {
      id: "nav-military",
      name: "Military",
      path: "/assets/menu/navigation/military.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Military & combat navigation"
    },
    EXPLORATION: {
      id: "nav-exploration",
      name: "Exploration",
      path: "/assets/menu/navigation/exploration.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Exploration & travel navigation"
    },
    ECONOMY: {
      id: "nav-economy",
      name: "Economy",
      path: "/assets/menu/navigation/economy.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Economy & resources navigation"
    },
    DIPLOMACY: {
      id: "nav-diplomacy",
      name: "Diplomacy",
      path: "/assets/menu/navigation/diplomacy.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Diplomacy & alliances navigation"
    },
    SETTINGS: {
      id: "nav-settings",
      name: "Settings",
      path: "/assets/menu/navigation/settings.svg",
      size: ASSET_SIZES.ICON_LARGE,
      description: "Settings & preferences navigation"
    },
  },

  // Building Icons (48x48)
  BUILDINGS: {
    ROBOTICS_FACTORY: {
      id: "building-robotics",
      name: "Robotics Factory",
      path: "/assets/menu/buildings/robotics_factory.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#FF6B6B",
      description: "Robotic production facility"
    },
    RESEARCH_LAB: {
      id: "building-research",
      name: "Research Lab",
      path: "/assets/menu/buildings/research_lab.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#4ECDC4",
      description: "Scientific research facility"
    },
    SHIPYARD: {
      id: "building-shipyard",
      name: "Shipyard",
      path: "/assets/menu/buildings/shipyard.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#45B7D1",
      description: "Ship construction facility"
    },
    STORAGE: {
      id: "building-storage",
      name: "Storage Vault",
      path: "/assets/menu/buildings/storage.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#A29BFE",
      description: "Resource storage facility"
    },
    POWER_PLANT: {
      id: "building-power",
      name: "Power Plant",
      path: "/assets/menu/buildings/power_plant.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#FDB750",
      description: "Energy generation facility"
    },
    DEFENSE_TURRET: {
      id: "building-defense",
      name: "Defense Turret",
      path: "/assets/menu/buildings/defense_turret.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#EE5A6F",
      description: "Planetary defense system"
    },
    TRADE_STATION: {
      id: "building-trade",
      name: "Trade Station",
      path: "/assets/menu/buildings/trade_station.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#1DD1A1",
      description: "Commercial trading hub"
    },
    SPACEPORT: {
      id: "building-spaceport",
      name: "Spaceport",
      path: "/assets/menu/buildings/spaceport.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#5F27CD",
      description: "Interstellar port facility"
    },
  },

  // Resource Icons
  RESOURCES: {
    METAL: {
      id: "resource-metal",
      name: "Metal",
      path: "/assets/menu/resources/metal.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#C0392B",
      description: "Metallic ore resources"
    },
    CRYSTAL: {
      id: "resource-crystal",
      name: "Crystal",
      path: "/assets/menu/resources/crystal.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#3498DB",
      description: "Crystalline resources"
    },
    DEUTERIUM: {
      id: "resource-deuterium",
      name: "Deuterium",
      path: "/assets/menu/resources/deuterium.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#8E44AD",
      description: "Deuterium fuel"
    },
    ENERGY: {
      id: "resource-energy",
      name: "Energy",
      path: "/assets/menu/resources/energy.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#F39C12",
      description: "Energy points"
    },
    SCIENCE: {
      id: "resource-science",
      name: "Science",
      path: "/assets/menu/resources/science.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#16A085",
      description: "Science points for research"
    },
    CREDITS: {
      id: "resource-credits",
      name: "Credits",
      path: "/assets/menu/resources/credits.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#F1C40F",
      description: "Game currency"
    },
  },

  // Status/Condition Icons
  STATUS: {
    HEALTHY: {
      id: "status-healthy",
      name: "Healthy",
      path: "/assets/menu/status/healthy.png",
      size: ASSET_SIZES.ICON_SMALL,
      bgColor: "#27AE60",
      description: "Optimal status"
    },
    DAMAGED: {
      id: "status-damaged",
      name: "Damaged",
      path: "/assets/menu/status/damaged.png",
      size: ASSET_SIZES.ICON_SMALL,
      bgColor: "#E74C3C",
      description: "Damaged status"
    },
    UPGRADING: {
      id: "status-upgrading",
      name: "Upgrading",
      path: "/assets/menu/status/upgrading.png",
      size: ASSET_SIZES.ICON_SMALL,
      bgColor: "#F39C12",
      description: "Building/research in progress"
    },
    DISABLED: {
      id: "status-disabled",
      name: "Disabled",
      path: "/assets/menu/status/disabled.png",
      size: ASSET_SIZES.ICON_SMALL,
      bgColor: "#95A5A6",
      description: "Disabled/Offline status"
    },
  },
} as const;

// ============================================================================
// PLANET ASSETS
// ============================================================================

export const PLANET_ASSETS = {
  // Terrestrial Planets
  TERRESTRIAL: {
    EARTH_LIKE: {
      id: "planet-earth-like",
      name: "Earth-like",
      path: "/assets/planets/terrestrial/earth_like.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#4ECDC4",
      description: "Blue and green habitable world"
    },
    DESERT: {
      id: "planet-desert",
      name: "Desert",
      path: "/assets/planets/terrestrial/desert.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#E8B84B",
      description: "Arid sandy planet"
    },
    ICE: {
      id: "planet-ice",
      name: "Ice World",
      path: "/assets/planets/terrestrial/ice.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#B4D7FF",
      description: "Frozen polar regions"
    },
    JUNGLE: {
      id: "planet-jungle",
      name: "Jungle",
      path: "/assets/planets/terrestrial/jungle.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#2ECC71",
      description: "Dense tropical vegetation"
    },
    OCEAN: {
      id: "planet-ocean",
      name: "Ocean World",
      path: "/assets/planets/terrestrial/ocean.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#3498DB",
      description: "World covered in water"
    },
    VOLCANIC: {
      id: "planet-volcanic",
      name: "Volcanic",
      path: "/assets/planets/terrestrial/volcanic.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#E74C3C",
      description: "Active volcanic world"
    },
  },

  // Gas Giants
  GAS_GIANTS: {
    JUPITER_CLASS: {
      id: "planet-jupiter",
      name: "Jupiter Class",
      path: "/assets/planets/gas_giants/jupiter_class.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#D4A574",
      description: "Massive gas giant"
    },
    SATURN_CLASS: {
      id: "planet-saturn",
      name: "Saturn Class",
      path: "/assets/planets/gas_giants/saturn_class.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#E8D5B7",
      description: "Gas giant with rings"
    },
    NEPTUNE_CLASS: {
      id: "planet-neptune",
      name: "Neptune Class",
      path: "/assets/planets/gas_giants/neptune_class.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#4A90E2",
      description: "Ice giant with winds"
    },
  },

  // Exotic Planets
  EXOTIC: {
    RING_WORLD: {
      id: "planet-ring-world",
      name: "Ring World",
      path: "/assets/planets/exotic/ring_world.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#9B59B6",
      description: "Ancient megastructure"
    },
    DYSON_SPHERE: {
      id: "planet-dyson-sphere",
      name: "Dyson Sphere",
      path: "/assets/planets/exotic/dyson_sphere.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#F39C12",
      description: "Star-encompassing sphere"
    },
  },
} as const;

// ============================================================================
// SHIP & UNIT ASSETS
// ============================================================================

export const SHIP_ASSETS = {
  // Fighter Class Ships
  FIGHTERS: {
    SCOUT: {
      id: "ship-scout",
      name: "Scout Fighter",
      path: "/assets/ships/fighters/scout.png",
      size: ASSET_SIZES.SHIP_MEDIUM,
      color: "#3498DB",
      description: "Fast reconnaissance vessel"
    },
    INTERCEPTOR: {
      id: "ship-interceptor",
      name: "Interceptor",
      path: "/assets/ships/fighters/interceptor.png",
      size: ASSET_SIZES.SHIP_MEDIUM,
      color: "#E74C3C",
      description: "Quick strike fighter"
    },
    FIGHTER: {
      id: "ship-fighter",
      name: "Fighter",
      path: "/assets/ships/fighters/fighter.png",
      size: ASSET_SIZES.SHIP_MEDIUM,
      color: "#F39C12",
      description: "Standard fighter craft"
    },
  },

  // Capital Ships
  CAPITALS: {
    CORVETTE: {
      id: "ship-corvette",
      name: "Corvette",
      path: "/assets/ships/capitals/corvette.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#16A085",
      description: "Light capital ship"
    },
    DESTROYER: {
      id: "ship-destroyer",
      name: "Destroyer",
      path: "/assets/ships/capitals/destroyer.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#2C3E50",
      description: "Medium capital ship"
    },
    BATTLECRUISER: {
      id: "ship-battlecruiser",
      name: "Battlecruiser",
      path: "/assets/ships/capitals/battlecruiser.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#8E44AD",
      description: "Heavy capital ship"
    },
    BATTLESHIP: {
      id: "ship-battleship",
      name: "Battleship",
      path: "/assets/ships/capitals/battleship.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#C0392B",
      description: "Super capital ship"
    },
  },

  // Special Ships
  SPECIAL: {
    CARRIER: {
      id: "ship-carrier",
      name: "Carrier",
      path: "/assets/ships/special/carrier.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#27AE60",
      description: "Fighter carrier vessel"
    },
    TRANSPORT: {
      id: "ship-transport",
      name: "Transport",
      path: "/assets/ships/special/transport.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#95A5A6",
      description: "Cargo transport ship"
    },
    COLONIZER: {
      id: "ship-colonizer",
      name: "Colonizer",
      path: "/assets/ships/special/colonizer.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#1ABC9C",
      description: "Colony establishment vessel"
    },
  },
} as const;

// ============================================================================
// TECHNOLOGY BRANCH ICONS
// ============================================================================

export const TECH_BRANCH_ASSETS = {
  ARMOR: {
    id: "tech-armor",
    name: "Armor",
    path: "/assets/tech_branches/armor.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#8B7355",
    description: "Armor and plating technologies"
  },
  SHIELDS: {
    id: "tech-shields",
    name: "Shields",
    path: "/assets/tech_branches/shields.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#4ECDC4",
    description: "Shield and protection systems"
  },
  WEAPONS: {
    id: "tech-weapons",
    name: "Weapons",
    path: "/assets/tech_branches/weapons.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#E74C3C",
    description: "Weapons and ordnance systems"
  },
  PROPULSION: {
    id: "tech-propulsion",
    name: "Propulsion",
    path: "/assets/tech_branches/propulsion.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#3498DB",
    description: "Engine and drive systems"
  },
  SENSORS: {
    id: "tech-sensors",
    name: "Sensors",
    path: "/assets/tech_branches/sensors.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#F39C12",
    description: "Detection and scanning systems"
  },
  POWER: {
    id: "tech-power",
    name: "Power",
    path: "/assets/tech_branches/power.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#F1C40F",
    description: "Power generation systems"
  },
  COMPUTING: {
    id: "tech-computing",
    name: "Computing",
    path: "/assets/tech_branches/computing.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#9B59B6",
    description: "AI and computing systems"
  },
  ENGINEERING: {
    id: "tech-engineering",
    name: "Engineering",
    path: "/assets/tech_branches/engineering.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#2ECC71",
    description: "Construction and fabrication"
  },
  RESOURCES: {
    id: "tech-resources",
    name: "Resources",
    path: "/assets/tech_branches/resources.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#E67E22",
    description: "Resource processing systems"
  },
  MEDICAL: {
    id: "tech-medical",
    name: "Medical",
    path: "/assets/tech_branches/medical.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#1ABC9C",
    description: "Medical and life support systems"
  },
  HYPERSPACE: {
    id: "tech-hyperspace",
    name: "Hyperspace",
    path: "/assets/tech_branches/hyperspace.svg",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#16A085",
    description: "Advanced physics and teleportation"
  },
} as const;

// ============================================================================
// BACKGROUND & BANNER ASSETS
// ============================================================================

export const BACKGROUND_ASSETS = {
  // Page Backgrounds
  RESEARCH_LAB: {
    id: "bg-research-lab",
    name: "Research Lab",
    path: "/assets/backgrounds/research_lab.jpg",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Futuristic research laboratory"
  },
  SHIPYARD: {
    id: "bg-shipyard",
    name: "Shipyard",
    path: "/assets/backgrounds/shipyard.jpg",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Orbital shipyard construction"
  },
  STAR_FIELD: {
    id: "bg-starfield",
    name: "Star Field",
    path: "/assets/backgrounds/starfield.jpg",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Deep space star field"
  },
  NEBULA: {
    id: "bg-nebula",
    name: "Nebula",
    path: "/assets/backgrounds/nebula.jpg",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Colorful nebula cloud"
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get asset config by ID
 */
export function getAssetById(
  assetId: string
): any | undefined {
  const searchAsset = (obj: any): any => {
    for (const key in obj) {
      if (obj[key].id === assetId) return obj[key];
      if (typeof obj[key] === "object") {
        const result = searchAsset(obj[key]);
        if (result) return result;
      }
    }
    return undefined;
  };

  return searchAsset({
    MENU_ASSETS,
    PLANET_ASSETS,
    SHIP_ASSETS,
    TECH_BRANCH_ASSETS,
    BACKGROUND_ASSETS,
  });
}

/**
 * Generate placeholder SVG or PNG path with metadata
 */
export function getAssetPlaceholder(
  assetId: string,
  fallbackColor: string = "#34495E"
) {
  const asset = getAssetById(assetId);
  if (!asset) {
    return {
      path: `/assets/placeholder_${assetId}.svg`,
      width: 64,
      height: 64,
      color: fallbackColor,
      isPlacer: true,
    };
  }

  return {
    path: asset.path,
    width: asset.size.width,
    height: asset.size.height,
    color: asset.color || asset.bgColor || fallbackColor,
    isPlacer: false,
  };
}

/**
 * Get all assets in a category
 */
export function getAssetsByCategory(category: string): any[] {
  const categories: { [key: string]: any[] } = {
    navigation: Object.values(MENU_ASSETS.NAVIGATION),
    buildings: Object.values(MENU_ASSETS.BUILDINGS),
    resources: Object.values(MENU_ASSETS.RESOURCES),
    planets: [
      ...Object.values(PLANET_ASSETS.TERRESTRIAL),
      ...Object.values(PLANET_ASSETS.GAS_GIANTS),
      ...Object.values(PLANET_ASSETS.EXOTIC),
    ],
    ships: [
      ...Object.values(SHIP_ASSETS.FIGHTERS),
      ...Object.values(SHIP_ASSETS.CAPITALS),
      ...Object.values(SHIP_ASSETS.SPECIAL),
    ],
    techs: Object.values(TECH_BRANCH_ASSETS),
    backgrounds: Object.values(BACKGROUND_ASSETS),
  };

  return (categories as any)[category] || [];
}

export const ASSET_CATEGORIES = {
  NAVIGATION: "navigation",
  BUILDINGS: "buildings",
  RESOURCES: "resources",
  PLANETS: "planets",
  SHIPS: "ships",
  TECHS: "techs",
  BACKGROUNDS: "backgrounds",
} as const;

export const ASSET_VERSIONS = {
  CURRENT: "1.0.0",
} as const;

export type AssetCategory = typeof ASSET_CATEGORIES[keyof typeof ASSET_CATEGORIES];

export interface GameAsset {
  id: string;
  name: string;
  type: string;
  category: string;
  path: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  usage: Array<{
    componentName: string;
    componentType: string;
    usageCount: number;
  }>;
}

export interface AssetBundle {
  id: string;
  name: string;
  description: string;
  assets: GameAsset[];
  totalSize: number;
  version: string;
  platform: "web" | "mobile" | "desktop" | "universal";
  compressionMode: "gzip" | "brotli" | "none";
  packaged: boolean;
}

export interface AssetManifest {
  version: string;
  buildDate: Date;
  assetBundles: AssetBundle[];
  totalBundles: number;
  totalAssets: number;
  totalSize: number;
  checksums: Record<string, string>;
  dependencies: Record<string, string[]>;
}

export interface AssetUsageStatistics {
  totalAssets: number;
  totalSize: number;
  mostUsedAssets: Array<{ assetId: string; usageCount: number }>;
  assetsByCategory: Record<string, number>;
  cacheHitRate: number;
  averageLoadTime: number;
}

export interface AssetCatalog {
  id: string;
  name: string;
  category: string;
  assets: GameAsset[];
  totalAssets: number;
  totalSize: number;
  lastUpdated: Date;
}

/**
 * Get asset pack (multiple related assets)
 */
export function getAssetPack(packName: string): any[] {
  const packs: { [key: string]: any[] } = {
    "ui-essentials": [
      MENU_ASSETS.NAVIGATION.HOME,
      MENU_ASSETS.NAVIGATION.EMPIRE,
      MENU_ASSETS.NAVIGATION.RESEARCH,
      MENU_ASSETS.NAVIGATION.MILITARY,
    ],
    "building-suite": Object.values(MENU_ASSETS.BUILDINGS),
    "resource-pack": Object.values(MENU_ASSETS.RESOURCES),
    "planet-pack": [
      ...Object.values(PLANET_ASSETS.TERRESTRIAL),
      ...Object.values(PLANET_ASSETS.GAS_GIANTS),
      ...Object.values(PLANET_ASSETS.EXOTIC),
    ],
    "ship-armor": Object.values(SHIP_ASSETS.FIGHTERS),
    "tech-branches": Object.values(TECH_BRANCH_ASSETS),
  };

  return packs[packName] || [];
}

/**
 * Generate all placeholder asset paths for development
 */
export function generatePlaceholderAssetManifest(): { [key: string]: { width: number; height: number; color: string } } {
  const manifest: any = {};

  const addAssets = (obj: any, prefix = "") => {
    for (const key in obj) {
      const item = obj[key];
      if (item.id) {
        manifest[item.path] = {
          width: item.size.width,
          height: item.size.height,
          color: item.color || item.bgColor || "#34495E",
        };
      } else if (typeof item === "object") {
        addAssets(item, prefix + key + ".");
      }
    }
  };

  addAssets({
    MENU_ASSETS,
    PLANET_ASSETS,
    SHIP_ASSETS,
    TECH_BRANCH_ASSETS,
    BACKGROUND_ASSETS,
  });

  return manifest;
}
