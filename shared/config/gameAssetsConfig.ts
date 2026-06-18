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
  SCENE_PLANE: { width: 1600, height: 900, name: "1600x900px" },
  
  // Full Page Backgrounds
  BG_FULLSCREEN: { width: 1920, height: 1080, name: "1920x1080px" },
} as const;

const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

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
      path: "/assets/buildings/command_center.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#FF6B6B",
      description: "Robotic production facility"
    },
    RESEARCH_LAB: {
      id: "building-research",
      name: "Research Lab",
      path: "/assets/buildings/research_lab.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#4ECDC4",
      description: "Scientific research facility"
    },
    SHIPYARD: {
      id: "building-shipyard",
      name: "Shipyard",
      path: "/assets/buildings/shipyard.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#45B7D1",
      description: "Ship construction facility"
    },
    STORAGE: {
      id: "building-storage",
      name: "Storage Vault",
      path: "/assets/buildings/metal_mine.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#A29BFE",
      description: "Resource storage facility"
    },
    POWER_PLANT: {
      id: "building-power",
      name: "Power Plant",
      path: "/assets/buildings/power_plant.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#FDB750",
      description: "Energy generation facility"
    },
    DEFENSE_TURRET: {
      id: "building-defense",
      name: "Defense Turret",
      path: "/assets/buildings/defense_cannon.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#EE5A6F",
      description: "Planetary defense system"
    },
    TRADE_STATION: {
      id: "building-trade",
      name: "Trade Station",
      path: "/assets/buildings/command_center.png",
      size: ASSET_SIZES.ICON_LARGE,
      bgColor: "#1DD1A1",
      description: "Commercial trading hub"
    },
    SPACEPORT: {
      id: "building-spaceport",
      name: "Spaceport",
      path: "/assets/buildings/terraformer.png",
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
      path: "/assets/resources/metal.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#C0392B",
      description: "Metallic ore resources"
    },
    CRYSTAL: {
      id: "resource-crystal",
      name: "Crystal",
      path: "/assets/resources/crystal.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#3498DB",
      description: "Crystalline resources"
    },
    DEUTERIUM: {
      id: "resource-deuterium",
      name: "Deuterium",
      path: "/assets/resources/deuterium.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#8E44AD",
      description: "Deuterium fuel"
    },
    ENERGY: {
      id: "resource-energy",
      name: "Energy",
      path: "/assets/buildings/power_plant.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#F39C12",
      description: "Energy points"
    },
    SCIENCE: {
      id: "resource-science",
      name: "Science",
      path: "/assets/research/astrophysics.png",
      size: ASSET_SIZES.ICON_MEDIUM,
      bgColor: "#16A085",
      description: "Science points for research"
    },
    CREDITS: {
      id: "resource-credits",
      name: "Credits",
      path: "/assets/resources/credits.png",
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
      path: "/assets/planets/terra.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#4ECDC4",
      description: "Blue and green habitable world"
    },
    DESERT: {
      id: "planet-desert",
      name: "Desert",
      path: "/assets/planets/volcanic.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#E8B84B",
      description: "Arid sandy planet"
    },
    ICE: {
      id: "planet-ice",
      name: "Ice World",
      path: "/assets/planets/ice.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#B4D7FF",
      description: "Frozen polar regions"
    },
    JUNGLE: {
      id: "planet-jungle",
      name: "Jungle",
      path: "/assets/planets/terra.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#2ECC71",
      description: "Dense tropical vegetation"
    },
    OCEAN: {
      id: "planet-ocean",
      name: "Ocean World",
      path: "/assets/planets/terra.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#3498DB",
      description: "World covered in water"
    },
    VOLCANIC: {
      id: "planet-volcanic",
      name: "Volcanic",
      path: "/assets/planets/volcanic.png",
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
      path: "/assets/planets/gas_giant.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#D4A574",
      description: "Massive gas giant"
    },
    SATURN_CLASS: {
      id: "planet-saturn",
      name: "Saturn Class",
      path: "/assets/planets/gas_giant.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#E8D5B7",
      description: "Gas giant with rings"
    },
    NEPTUNE_CLASS: {
      id: "planet-neptune",
      name: "Neptune Class",
      path: "/assets/planets/dead.png",
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
      path: "/assets/planets/star.png",
      size: ASSET_SIZES.PLANET_LARGE,
      color: "#9B59B6",
      description: "Ancient megastructure"
    },
    DYSON_SPHERE: {
      id: "planet-dyson-sphere",
      name: "Dyson Sphere",
      path: "/assets/planets/star.png",
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
      path: "/assets/ships/scout.png",
      size: ASSET_SIZES.SHIP_MEDIUM,
      color: "#3498DB",
      description: "Fast reconnaissance vessel"
    },
    INTERCEPTOR: {
      id: "ship-interceptor",
      name: "Interceptor",
      path: "/assets/ships/fighter.png",
      size: ASSET_SIZES.SHIP_MEDIUM,
      color: "#E74C3C",
      description: "Quick strike fighter"
    },
    FIGHTER: {
      id: "ship-fighter",
      name: "Fighter",
      path: "/assets/ships/fighter.png",
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
      path: "/assets/ships/destroyer.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#16A085",
      description: "Light capital ship"
    },
    DESTROYER: {
      id: "ship-destroyer",
      name: "Destroyer",
      path: "/assets/ships/destroyer.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#2C3E50",
      description: "Medium capital ship"
    },
    BATTLECRUISER: {
      id: "ship-battlecruiser",
      name: "Battlecruiser",
      path: "/assets/ships/battlecruiser.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#8E44AD",
      description: "Heavy capital ship"
    },
    BATTLESHIP: {
      id: "ship-battleship",
      name: "Battleship",
      path: "/assets/ships/battleship.png",
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
      path: "/assets/ships/mothership.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#27AE60",
      description: "Fighter carrier vessel"
    },
    TRANSPORT: {
      id: "ship-transport",
      name: "Transport",
      path: "/assets/ships/cargo.png",
      size: ASSET_SIZES.SHIP_LARGE,
      color: "#95A5A6",
      description: "Cargo transport ship"
    },
    COLONIZER: {
      id: "ship-colonizer",
      name: "Colonizer",
      path: "/assets/ships/colony.png",
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
    path: "/assets/research/shields.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#8B7355",
    description: "Armor and plating technologies"
  },
  SHIELDS: {
    id: "tech-shields",
    name: "Shields",
    path: "/assets/research/shields.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#4ECDC4",
    description: "Shield and protection systems"
  },
  WEAPONS: {
    id: "tech-weapons",
    name: "Weapons",
    path: "/assets/research/weapons.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#E74C3C",
    description: "Weapons and ordnance systems"
  },
  PROPULSION: {
    id: "tech-propulsion",
    name: "Propulsion",
    path: "/assets/research/propulsion.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#3498DB",
    description: "Engine and drive systems"
  },
  SENSORS: {
    id: "tech-sensors",
    name: "Sensors",
    path: "/assets/research/espionage.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#F39C12",
    description: "Detection and scanning systems"
  },
  POWER: {
    id: "tech-power",
    name: "Power",
    path: "/assets/research/propulsion.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#F1C40F",
    description: "Power generation systems"
  },
  COMPUTING: {
    id: "tech-computing",
    name: "Computing",
    path: "/assets/research/astrophysics.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#9B59B6",
    description: "AI and computing systems"
  },
  ENGINEERING: {
    id: "tech-engineering",
    name: "Engineering",
    path: "/assets/research/propulsion.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#2ECC71",
    description: "Construction and fabrication"
  },
  RESOURCES: {
    id: "tech-resources",
    name: "Resources",
    path: "/assets/research/astrophysics.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#E67E22",
    description: "Resource processing systems"
  },
  MEDICAL: {
    id: "tech-medical",
    name: "Medical",
    path: "/assets/research/shields.png",
    size: ASSET_SIZES.ICON_LARGE,
    color: "#1ABC9C",
    description: "Medical and life support systems"
  },
  HYPERSPACE: {
    id: "tech-hyperspace",
    name: "Hyperspace",
    path: "/assets/research/propulsion.png",
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
    path: "/assets/backgrounds/nebula.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Futuristic research laboratory"
  },
  SHIPYARD: {
    id: "bg-shipyard",
    name: "Shipyard",
    path: "/assets/backgrounds/space_station.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Orbital shipyard construction"
  },
  STAR_FIELD: {
    id: "bg-starfield",
    name: "Star Field",
    path: "/assets/backgrounds/deep_space.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Deep space star field"
  },
  NEBULA: {
    id: "bg-nebula",
    name: "Nebula",
    path: "/assets/backgrounds/nebula.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Colorful nebula cloud"
  },
  GALAXY_MAP: {
    id: "bg-galaxy-map",
    name: "Galaxy Map",
    path: "/assets/backgrounds/galaxy_map.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Galaxy overview map"
  },
  COMBAT: {
    id: "bg-combat",
    name: "Space Combat",
    path: "/assets/backgrounds/combat_battle.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Epic space battle scene"
  },
  ASTEROID_FIELD: {
    id: "bg-asteroid",
    name: "Asteroid Field",
    path: "/assets/backgrounds/asteroid_field.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Asteroid mining field"
  },
  FLEET: {
    id: "bg-fleet",
    name: "Fleet Formation",
    path: "/assets/backgrounds/fleet_bg.png",
    size: ASSET_SIZES.BG_FULLSCREEN,
    description: "Fleet in formation"
  },
} as const;

// ============================================================================
// SHARED 3D VIEW PLACEHOLDER ASSETS
// ============================================================================

export const THREE_D_VIEW_ASSETS = {
  NEBULA_BACKDROP: {
    id: "3d-nebula-backdrop",
    name: "Nebula Backdrop",
    path: "/assets/3d-view/nebula-backdrop.svg",
    size: ASSET_SIZES.SCENE_PLANE,
    color: "#0E617C",
    description: "Shared browser-strategy nebula plate for the global 3D scene layer.",
  },
  COMMAND_PLANET: {
    id: "3d-command-planet",
    name: "Command Planet",
    path: "/assets/3d-view/command-planet.svg",
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#58B4FF",
    description: "Foreground planet placeholder used by the strategic shell background.",
  },
  MOON_OUTPOST: {
    id: "3d-moon-outpost",
    name: "Moon Outpost",
    path: "/assets/3d-view/moon-outpost.svg",
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#AFC8E4",
    description: "Moon and relay outpost placeholder used for support layers.",
  },
  UNIVERSE_CORE: {
    id: "3d-universe-core",
    name: "Universe Core",
    path: svgToDataUri(`<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="1200" fill="transparent"/><circle cx="600" cy="600" r="410" fill="#0F1E33"/><circle cx="600" cy="600" r="312" fill="#173A72"/><circle cx="600" cy="600" r="248" fill="#4FCAFF"/><circle cx="600" cy="600" r="146" fill="#E8FDFF"/><ellipse cx="600" cy="600" rx="468" ry="178" transform="rotate(18 600 600)" stroke="#9AEFFF" stroke-opacity="0.32" stroke-width="20"/><ellipse cx="600" cy="600" rx="468" ry="178" transform="rotate(-22 600 600)" stroke="#6F8FFF" stroke-opacity="0.22" stroke-width="28"/><circle cx="776" cy="424" r="12" fill="#9DF6FF"/><circle cx="394" cy="796" r="10" fill="#91C5FF"/><circle cx="850" cy="696" r="8" fill="#FFF2A6"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#4FCAFF",
    description: "Macro-scale universe sphere placeholder for star maps, realm views, and cosmology pages.",
  },
  SPIRAL_GALAXY: {
    id: "3d-spiral-galaxy",
    name: "Spiral Galaxy",
    path: svgToDataUri(`<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="1200" fill="transparent"/><path d="M602 248C760 248 894 370 944 528C890 496 818 482 728 502C606 530 560 646 638 742C704 824 838 820 942 760C884 866 754 944 608 944C412 944 250 784 250 588C250 394 406 248 602 248Z" fill="#56BEFF" fill-opacity="0.72"/><path d="M598 952C440 952 306 830 256 672C310 704 382 718 472 698C594 670 640 554 562 458C496 376 362 380 258 440C316 334 446 256 592 256C788 256 950 416 950 612C950 806 794 952 598 952Z" fill="#9277FF" fill-opacity="0.56"/><circle cx="600" cy="600" r="84" fill="#F8FEFF"/><circle cx="600" cy="600" r="168" stroke="#A5EEFF" stroke-opacity="0.2" stroke-width="20"/><circle cx="392" cy="448" r="8" fill="#F7FBFF"/><circle cx="842" cy="546" r="8" fill="#B4F7FF"/><circle cx="452" cy="782" r="7" fill="#FFE699"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#56BEFF",
    description: "Browser-safe spiral galaxy placeholder for galaxy maps and universe navigation.",
  },
  STAR_CLUSTER: {
    id: "3d-star-cluster",
    name: "Star Cluster",
    path: svgToDataUri(`<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="900" fill="transparent"/><circle cx="450" cy="450" r="240" fill="#0E223B"/><circle cx="450" cy="450" r="24" fill="#FFF9DA"/><circle cx="328" cy="344" r="18" fill="#FFF5B8"/><circle cx="582" cy="374" r="22" fill="#A8F2FF"/><circle cx="566" cy="560" r="16" fill="#C7E1FF"/><circle cx="360" cy="572" r="18" fill="#FFDE8A"/><circle cx="452" cy="252" r="13" fill="#B4F8FF"/><circle cx="244" cy="452" r="10" fill="#8FC6FF"/><circle cx="654" cy="466" r="11" fill="#FFFFFF"/><circle cx="470" cy="652" r="14" fill="#A7EFFF"/><circle cx="286" cy="640" r="8" fill="#D5F4FF"/><circle cx="650" cy="280" r="8" fill="#FFF2C2"/></svg>`),
    size: ASSET_SIZES.BANNER_MEDIUM,
    color: "#FFF5B8",
    description: "Dense star cluster placeholder for local systems, sectors, and navigation nodes.",
  },
  INTERSTELLAR_ANOMALY: {
    id: "3d-interstellar-anomaly",
    name: "Interstellar Anomaly",
    path: svgToDataUri(`<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="900" fill="transparent"/><path d="M450 138C530 238 658 286 734 370C812 456 804 604 684 658C592 700 500 626 450 548C400 626 308 700 216 658C96 604 88 456 166 370C242 286 370 238 450 138Z" fill="#7352FF" fill-opacity="0.78"/><path d="M450 260C492 342 584 390 622 450C582 510 492 554 450 640C408 554 318 510 278 450C316 390 408 342 450 260Z" fill="#07131F"/><path d="M450 318C480 372 540 406 568 450C540 494 480 528 450 582C420 528 360 494 332 450C360 406 420 372 450 318Z" fill="#D8FCFF"/><circle cx="450" cy="450" r="20" fill="#FFF7D6"/></svg>`),
    size: ASSET_SIZES.BANNER_MEDIUM,
    color: "#7352FF",
    description: "Dimensional rift placeholder for anomalies, events, and interstellar hazards.",
  },
  ASTEROID_FIELD: {
    id: "3d-asteroid-field",
    name: "Asteroid Field",
    path: svgToDataUri(`<svg width="1200" height="700" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="700" fill="transparent"/><path d="M162 312L220 270L286 286L304 344L246 382L178 364L162 312Z" fill="#5A677A"/><path d="M418 214L482 176L554 190L576 256L524 300L448 286L418 214Z" fill="#6B7488"/><path d="M700 360L786 316L864 344L880 426L808 476L728 452L700 360Z" fill="#4A5567"/><path d="M930 210L990 176L1052 194L1078 256L1022 308L952 292L930 210Z" fill="#657081"/><path d="M526 470L592 434L658 448L680 508L634 554L564 544L526 470Z" fill="#505C70"/><circle cx="124" cy="144" r="6" fill="#A9EBFF"/><circle cx="1032" cy="108" r="5" fill="#FFFFFF"/><circle cx="1110" cy="566" r="4" fill="#B4D9FF"/></svg>`),
    size: ASSET_SIZES.BANNER_LARGE,
    color: "#6B7488",
    description: "Asteroid field placeholder for mining sectors, fleet paths, and debris zones.",
  },
  RINGED_GAS_GIANT: {
    id: "3d-ringed-gas-giant",
    name: "Ringed Gas Giant",
    path: svgToDataUri(`<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="900" fill="transparent"/><circle cx="460" cy="470" r="178" fill="#E5A86C"/><path d="M314 420C352 394 408 382 466 384C518 386 572 396 606 422C560 430 520 434 460 436C396 438 354 432 314 420Z" fill="#FFF3D0" fill-opacity="0.28"/><path d="M298 520C350 538 406 546 470 544C532 542 576 534 622 514C608 570 566 622 504 646C430 676 344 658 286 604C286 576 292 548 298 520Z" fill="#A5653E" fill-opacity="0.34"/><ellipse cx="456" cy="482" rx="294" ry="88" transform="rotate(-10 456 482)" stroke="#F8F1D8" stroke-opacity="0.76" stroke-width="22"/><ellipse cx="456" cy="482" rx="294" ry="88" transform="rotate(-10 456 482)" stroke="#E3B98E" stroke-opacity="0.28" stroke-width="54"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#E5A86C",
    description: "Ringed gas giant placeholder for planetary browser and system views.",
  },
  OCEAN_WORLD_3D: {
    id: "3d-ocean-world",
    name: "Ocean World",
    path: svgToDataUri(`<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="800" fill="transparent"/><circle cx="400" cy="400" r="182" fill="#1E61A7"/><path d="M264 332C324 280 388 268 454 282C500 292 552 322 572 358C518 344 468 348 416 372C362 398 312 394 264 332Z" fill="#B5F9FF" fill-opacity="0.28"/><path d="M258 474C312 506 362 516 426 508C498 500 544 474 584 438C564 520 492 586 404 592C336 596 282 558 258 474Z" fill="#0C356D" fill-opacity="0.44"/><ellipse cx="404" cy="416" rx="210" ry="72" transform="rotate(14 404 416)" stroke="#C8FAFF" stroke-opacity="0.34" stroke-width="16"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#1E61A7",
    description: "Ocean planet placeholder for habitable worlds and colony previews.",
  },
  VOLCANIC_MOON: {
    id: "3d-volcanic-moon",
    name: "Volcanic Moon",
    path: svgToDataUri(`<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="800" fill="transparent"/><circle cx="406" cy="406" r="170" fill="#8E4D3A"/><circle cx="330" cy="332" r="30" fill="#2E1A1A" fill-opacity="0.68"/><circle cx="498" cy="398" r="22" fill="#301C1C" fill-opacity="0.68"/><circle cx="378" cy="500" r="18" fill="#2A1717" fill-opacity="0.7"/><path d="M302 474C338 456 376 460 416 472C460 486 500 488 540 470C520 548 462 610 378 620C330 598 300 542 302 474Z" fill="#FF7F3A" fill-opacity="0.56"/><path d="M340 284C386 260 454 266 510 290C478 308 452 316 414 320C382 324 354 316 340 284Z" fill="#FFC89E" fill-opacity="0.22"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#FF7F3A",
    description: "Volcanic moon placeholder for hostile colonies, raids, and orbital scans.",
  },
  STARSHIP_FRIGATE: {
    id: "3d-starship-frigate",
    name: "Starship Frigate",
    path: svgToDataUri(`<svg width="1200" height="520" viewBox="0 0 1200 520" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="520" fill="transparent"/><path d="M142 286L282 210L468 194L590 132L804 126L1028 198L900 260L796 272L688 334L386 350L290 300L192 314L142 286Z" fill="#20384F"/><path d="M604 166L724 170L818 202L746 224L634 220L604 166Z" fill="#93F2FF" fill-opacity="0.34"/><path d="M256 304L372 276L522 276L664 236L742 242L664 286L500 314L346 320L256 304Z" fill="#0C1724"/><circle cx="320" cy="286" r="10" fill="#A7F5FF"/><circle cx="674" cy="234" r="9" fill="#A8D9FF"/><circle cx="882" cy="242" r="8" fill="#EAFDFF"/></svg>`),
    size: ASSET_SIZES.BANNER_LARGE,
    color: "#20384F",
    description: "Combat-ready frigate placeholder for fleet panels, ship catalogs, and hangars.",
  },
  MOTHERSHIP_DREADNOUGHT: {
    id: "3d-mothership-dreadnought",
    name: "Mothership Dreadnought",
    path: svgToDataUri(`<svg width="1400" height="600" viewBox="0 0 1400 600" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1400" height="600" fill="transparent"/><path d="M164 330L316 230L602 206L770 132L1088 138L1260 218L1162 286L1052 300L932 378L528 404L356 362L222 368L164 330Z" fill="#1B2C44"/><path d="M786 182L954 186L1086 230L1000 264L836 258L786 182Z" fill="#8AEFFF" fill-opacity="0.3"/><path d="M314 354L484 316L702 316L890 266L1004 270L908 330L664 368L458 376L314 354Z" fill="#09131D"/><rect x="636" y="120" width="60" height="86" rx="12" fill="#243E63"/><circle cx="378" cy="334" r="12" fill="#B3FBFF"/><circle cx="840" cy="266" r="10" fill="#9AD9FF"/><circle cx="1086" cy="278" r="9" fill="#EAFDFF"/></svg>`),
    size: ASSET_SIZES.BANNER_LARGE,
    color: "#1B2C44",
    description: "Large mothership placeholder for command decks, bosses, and deep fleet scenes.",
  },
  DEEP_SPACE_STATION: {
    id: "3d-deep-space-station",
    name: "Deep Space Station",
    path: svgToDataUri(`<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="900" fill="transparent"/><circle cx="450" cy="450" r="106" fill="#173049"/><circle cx="450" cy="450" r="64" fill="#07131D"/><ellipse cx="450" cy="450" rx="282" ry="92" transform="rotate(-16 450 450)" stroke="#B6F6FF" stroke-opacity="0.76" stroke-width="22"/><ellipse cx="450" cy="450" rx="282" ry="92" transform="rotate(-16 450 450)" stroke="#53C9FF" stroke-opacity="0.24" stroke-width="52"/><path d="M256 450L316 406L316 494L256 450Z" fill="#102538"/><path d="M644 450L584 406L584 494L644 450Z" fill="#102538"/><path d="M450 250L492 314H408L450 250Z" fill="#18344D"/><path d="M450 650L492 586H408L450 650Z" fill="#18344D"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#53C9FF",
    description: "Deep-space station placeholder for orbital hubs, relay rings, and station pages.",
  },
  JUMP_GATE: {
    id: "3d-jump-gate",
    name: "Jump Gate",
    path: svgToDataUri(`<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="900" fill="transparent"/><circle cx="450" cy="450" r="182" stroke="#D9FDFF" stroke-opacity="0.78" stroke-width="26"/><circle cx="450" cy="450" r="182" stroke="#48D2FF" stroke-opacity="0.24" stroke-width="58"/><circle cx="450" cy="450" r="106" fill="#0A1622"/><circle cx="450" cy="450" r="78" fill="#7DE9FF" fill-opacity="0.24"/><circle cx="450" cy="244" r="14" fill="#A7F5FF"/><circle cx="656" cy="450" r="14" fill="#A7F5FF"/><circle cx="450" cy="656" r="14" fill="#A7F5FF"/><circle cx="244" cy="450" r="14" fill="#A7F5FF"/></svg>`),
    size: ASSET_SIZES.PLANET_DETAILED,
    color: "#48D2FF",
    description: "Jump gate placeholder for interstellar travel, stargates, and hyperspace lanes.",
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
    THREE_D_VIEW_ASSETS,
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
    "3d-views": Object.values(THREE_D_VIEW_ASSETS),
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
  THREE_D_VIEWS: "3d-views",
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
    "3d-scene-pack": Object.values(THREE_D_VIEW_ASSETS),
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
    THREE_D_VIEW_ASSETS,
  });

  return manifest;
}
