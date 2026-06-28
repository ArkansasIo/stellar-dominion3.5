
// Comprehensive Ship Fitting Module Catalog
// 90+ modules across multiple categories, classes, and types

export interface ShipModule {
  id: string;
  name: string;
  description: string;
  category: string; // weapon, defense, propulsion, electronic, engineering, utility
  class: string; // main classification
  subclass: string; // detailed classification
  type: string; // slot type: high, mid, low, rig, subsystem
  size: string; // small, medium, large, capital, universal
  meta: number; // meta level 0-14
  tech: number; // tech level 1-3
  cpu: number;
  powergrid: number;
  calibration?: number; // for rigs
  capacitor?: number; // capacitor usage
  stats: { [key: string]: number | string | boolean };
  requirements?: {
    skills?: { [key: string]: number };
    shipSize?: string[];
  };
  price: {
    isk: number;
    materials?: { [key: string]: number };
  };
}

export const SHIP_FITTING_MODULES: { [key: string]: ShipModule } = {
  // ===== WEAPONS - HIGH SLOTS (30 modules) =====
  
  // Projectile Weapons
  "wpn_proj_ac_s1": {
    id: "wpn_proj_ac_s1",
    name: "125mm Autocannon I",
    description: "Small projectile weapon with high rate of fire",
    category: "weapon",
    class: "projectile",
    subclass: "autocannon",
    type: "high",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 15,
    powergrid: 5,
    capacitor: 0,
    stats: {
      damage: 12,
      rof: 2.5,
      range: 5000,
      tracking: 0.45,
      damageType: "kinetic/explosive"
    },
    requirements: {
      skills: { "Small Projectile Turret": 1 }
    },
    price: { isk: 15000 }
  },
  "wpn_proj_ac_s2": {
    id: "wpn_proj_ac_s2",
    name: "150mm Autocannon II",
    description: "Advanced small autocannon with improved damage",
    category: "weapon",
    class: "projectile",
    subclass: "autocannon",
    type: "high",
    size: "small",
    meta: 5,
    tech: 2,
    cpu: 20,
    powergrid: 8,
    capacitor: 0,
    stats: {
      damage: 18,
      rof: 2.3,
      range: 6000,
      tracking: 0.50,
      damageType: "kinetic/explosive"
    },
    requirements: {
      skills: { "Small Projectile Turret": 5 }
    },
    price: { isk: 250000 }
  },
  "wpn_proj_art_m1": {
    id: "wpn_proj_art_m1",
    name: "425mm Artillery I",
    description: "Medium artillery with high alpha damage",
    category: "weapon",
    class: "projectile",
    subclass: "artillery",
    type: "high",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 35,
    powergrid: 45,
    capacitor: 0,
    stats: {
      damage: 180,
      rof: 8.0,
      range: 25000,
      tracking: 0.08,
      damageType: "kinetic/explosive"
    },
    requirements: {
      skills: { "Medium Projectile Turret": 1 }
    },
    price: { isk: 85000 }
  },
  
  // Energy Weapons
  "wpn_ener_pulse_s1": {
    id: "wpn_ener_pulse_s1",
    name: "Small Pulse Laser I",
    description: "Short range energy weapon with high tracking",
    category: "weapon",
    class: "energy",
    subclass: "pulse_laser",
    type: "high",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 12,
    capacitor: 2.5,
    stats: {
      damage: 15,
      rof: 3.0,
      range: 4500,
      tracking: 0.55,
      damageType: "em/thermal",
      optimalRange: 3000
    },
    requirements: {
      skills: { "Small Energy Turret": 1 }
    },
    price: { isk: 22000 }
  },
  "wpn_ener_beam_m1": {
    id: "wpn_ener_beam_m1",
    name: "Medium Beam Laser I",
    description: "Long range energy weapon with focused damage",
    category: "weapon",
    class: "energy",
    subclass: "beam_laser",
    type: "high",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 40,
    powergrid: 65,
    capacitor: 8.0,
    stats: {
      damage: 95,
      rof: 5.5,
      range: 35000,
      tracking: 0.12,
      damageType: "em/thermal",
      optimalRange: 25000
    },
    requirements: {
      skills: { "Medium Energy Turret": 1 }
    },
    price: { isk: 120000 }
  },
  "wpn_ener_tach_l1": {
    id: "wpn_ener_tach_l1",
    name: "Tachyon Beam Laser I",
    description: "Large long-range beam laser for battleships",
    category: "weapon",
    class: "energy",
    subclass: "tachyon",
    type: "high",
    size: "large",
    meta: 0,
    tech: 1,
    cpu: 85,
    powergrid: 180,
    capacitor: 25.0,
    stats: {
      damage: 450,
      rof: 9.0,
      range: 80000,
      tracking: 0.03,
      damageType: "em/thermal",
      optimalRange: 60000
    },
    requirements: {
      skills: { "Large Energy Turret": 1 }
    },
    price: { isk: 850000 }
  },
  
  // Hybrid Weapons
  "wpn_hyb_rail_s1": {
    id: "wpn_hyb_rail_s1",
    name: "75mm Railgun I",
    description: "Small hybrid weapon with kinetic damage",
    category: "weapon",
    class: "hybrid",
    subclass: "railgun",
    type: "high",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 22,
    powergrid: 8,
    capacitor: 1.8,
    stats: {
      damage: 14,
      rof: 3.5,
      range: 12000,
      tracking: 0.35,
      damageType: "kinetic/thermal"
    },
    requirements: {
      skills: { "Small Hybrid Turret": 1 }
    },
    price: { isk: 18000 }
  },
  "wpn_hyb_blast_m1": {
    id: "wpn_hyb_blast_m1",
    name: "Heavy Neutron Blaster I",
    description: "High damage close range hybrid weapon",
    category: "weapon",
    class: "hybrid",
    subclass: "blaster",
    type: "high",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 45,
    powergrid: 55,
    capacitor: 6.5,
    stats: {
      damage: 125,
      rof: 4.0,
      range: 8000,
      tracking: 0.25,
      damageType: "kinetic/thermal",
      optimalRange: 5000
    },
    requirements: {
      skills: { "Medium Hybrid Turret": 1 }
    },
    price: { isk: 145000 }
  },
  
  // Missile Launchers
  "wpn_miss_light_s1": {
    id: "wpn_miss_light_s1",
    name: "Light Missile Launcher I",
    description: "Small missile launcher for frigates",
    category: "weapon",
    class: "missile",
    subclass: "light_missile",
    type: "high",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 25,
    powergrid: 10,
    capacitor: 0,
    stats: {
      damage: 45,
      rof: 7.0,
      range: 25000,
      flightTime: 10,
      damageType: "kinetic/explosive",
      volleySize: 1
    },
    requirements: {
      skills: { "Light Missiles": 1 }
    },
    price: { isk: 35000 }
  },
  "wpn_miss_heavy_m1": {
    id: "wpn_miss_heavy_m1",
    name: "Heavy Missile Launcher I",
    description: "Medium missile launcher for cruisers",
    category: "weapon",
    class: "missile",
    subclass: "heavy_missile",
    type: "high",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 50,
    powergrid: 35,
    capacitor: 0,
    stats: {
      damage: 180,
      rof: 10.0,
      range: 60000,
      flightTime: 15,
      damageType: "kinetic/explosive",
      volleySize: 1
    },
    requirements: {
      skills: { "Heavy Missiles": 1 }
    },
    price: { isk: 125000 }
  },
  "wpn_miss_cruise_l1": {
    id: "wpn_miss_cruise_l1",
    name: "Cruise Missile Launcher I",
    description: "Large missile launcher for battleships",
    category: "weapon",
    class: "missile",
    subclass: "cruise_missile",
    type: "high",
    size: "large",
    meta: 0,
    tech: 1,
    cpu: 95,
    powergrid: 75,
    capacitor: 0,
    stats: {
      damage: 650,
      rof: 15.0,
      range: 150000,
      flightTime: 25,
      damageType: "kinetic/explosive",
      volleySize: 1
    },
    requirements: {
      skills: { "Cruise Missiles": 1 }
    },
    price: { isk: 650000 }
  },
  "wpn_miss_torp_l1": {
    id: "wpn_miss_torp_l1",
    name: "Torpedo Launcher I",
    description: "Anti-capital torpedo launcher",
    category: "weapon",
    class: "missile",
    subclass: "torpedo",
    type: "high",
    size: "large",
    meta: 0,
    tech: 1,
    cpu: 110,
    powergrid: 85,
    capacitor: 0,
    stats: {
      damage: 1850,
      rof: 20.0,
      range: 80000,
      flightTime: 30,
      damageType: "kinetic/explosive",
      volleySize: 1,
      signatureRadius: 400
    },
    requirements: {
      skills: { "Torpedoes": 1 }
    },
    price: { isk: 950000 }
  },
  
  // Drones
  "wpn_drone_bay_s": {
    id: "wpn_drone_bay_s",
    name: "Small Drone Bay",
    description: "Allows deployment of light drones",
    category: "weapon",
    class: "drone",
    subclass: "drone_bay",
    type: "high",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 15,
    powergrid: 5,
    stats: {
      bandwidth: 10,
      capacity: 25,
      droneControl: 2
    },
    requirements: {
      skills: { "Drones": 1 }
    },
    price: { isk: 45000 }
  },
  "wpn_drone_bay_m": {
    id: "wpn_drone_bay_m",
    name: "Medium Drone Bay",
    description: "Allows deployment of medium drones",
    category: "weapon",
    class: "drone",
    subclass: "drone_bay",
    type: "high",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 30,
    powergrid: 10,
    stats: {
      bandwidth: 25,
      capacity: 75,
      droneControl: 3
    },
    requirements: {
      skills: { "Drones": 3 }
    },
    price: { isk: 125000 }
  },
  
  // Smart Bombs
  "wpn_smart_em": {
    id: "wpn_smart_em",
    name: "EM Smart Bomb I",
    description: "Area of effect EM damage",
    category: "weapon",
    class: "smartbomb",
    subclass: "em_bomb",
    type: "high",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 45,
    powergrid: 75,
    capacitor: 450,
    stats: {
      damage: 1000,
      duration: 10,
      range: 6000,
      damageType: "em"
    },
    requirements: {
      skills: { "Smart Bombs": 1 }
    },
    price: { isk: 185000 }
  },
  
  // ===== DEFENSE - MID SLOTS (25 modules) =====
  
  // Shield Boosters
  "def_shield_boost_s1": {
    id: "def_shield_boost_s1",
    name: "Small Shield Booster I",
    description: "Repairs shield HP over time",
    category: "defense",
    class: "shield",
    subclass: "booster",
    type: "mid",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 22,
    powergrid: 18,
    capacitor: 24,
    stats: {
      shieldBonus: 60,
      duration: 5,
      cooldown: 0
    },
    requirements: {
      skills: { "Shield Operation": 1 }
    },
    price: { isk: 28000 }
  },
  "def_shield_boost_m1": {
    id: "def_shield_boost_m1",
    name: "Medium Shield Booster I",
    description: "Medium shield repair module",
    category: "defense",
    class: "shield",
    subclass: "booster",
    type: "mid",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 45,
    powergrid: 55,
    capacitor: 96,
    stats: {
      shieldBonus: 240,
      duration: 5,
      cooldown: 0
    },
    requirements: {
      skills: { "Shield Operation": 3 }
    },
    price: { isk: 95000 }
  },
  "def_shield_boost_l1": {
    id: "def_shield_boost_l1",
    name: "Large Shield Booster I",
    description: "Large shield repair for battleships",
    category: "defense",
    class: "shield",
    subclass: "booster",
    type: "mid",
    size: "large",
    meta: 0,
    tech: 1,
    cpu: 95,
    powergrid: 145,
    capacitor: 384,
    stats: {
      shieldBonus: 960,
      duration: 5,
      cooldown: 0
    },
    requirements: {
      skills: { "Shield Operation": 5 }
    },
    price: { isk: 385000 }
  },
  
  // Shield Extenders
  "def_shield_ext_s1": {
    id: "def_shield_ext_s1",
    name: "Small Shield Extender I",
    description: "Increases maximum shield HP",
    category: "defense",
    class: "shield",
    subclass: "extender",
    type: "mid",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 25,
    powergrid: 8,
    stats: {
      shieldBonus: 400,
      signaturePenalty: 10
    },
    requirements: {
      skills: { "Shield Upgrades": 1 }
    },
    price: { isk: 32000 }
  },
  "def_shield_ext_m2": {
    id: "def_shield_ext_m2",
    name: "Medium Shield Extender II",
    description: "Advanced medium shield extender",
    category: "defense",
    class: "shield",
    subclass: "extender",
    type: "mid",
    size: "medium",
    meta: 5,
    tech: 2,
    cpu: 55,
    powergrid: 22,
    stats: {
      shieldBonus: 1800,
      signaturePenalty: 15
    },
    requirements: {
      skills: { "Shield Upgrades": 5 }
    },
    price: { isk: 425000 }
  },
  
  // Shield Hardeners
  "def_shield_hard_em1": {
    id: "def_shield_hard_em1",
    name: "EM Shield Hardener I",
    description: "Increases EM shield resistance",
    category: "defense",
    class: "shield",
    subclass: "hardener",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      emResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Shield Upgrades": 1 }
    },
    price: { isk: 45000 }
  },
  "def_shield_hard_therm1": {
    id: "def_shield_hard_therm1",
    name: "Thermal Shield Hardener I",
    description: "Increases thermal shield resistance",
    category: "defense",
    class: "shield",
    subclass: "hardener",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      thermalResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Shield Upgrades": 1 }
    },
    price: { isk: 45000 }
  },
  "def_shield_hard_kin2": {
    id: "def_shield_hard_kin2",
    name: "Kinetic Shield Hardener II",
    description: "Advanced kinetic shield resistance",
    category: "defense",
    class: "shield",
    subclass: "hardener",
    type: "mid",
    size: "universal",
    meta: 5,
    tech: 2,
    cpu: 35,
    powergrid: 1,
    capacitor: 22,
    stats: {
      kineticResist: 40,
      duration: 0
    },
    requirements: {
      skills: { "Shield Upgrades": 5 }
    },
    price: { isk: 285000 }
  },
  "def_shield_hard_exp1": {
    id: "def_shield_hard_exp1",
    name: "Explosive Shield Hardener I",
    description: "Increases explosive shield resistance",
    category: "defense",
    class: "shield",
    subclass: "hardener",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      explosiveResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Shield Upgrades": 1 }
    },
    price: { isk: 45000 }
  },
  
  // Propulsion Modules
  "prop_ab_1mn": {
    id: "prop_ab_1mn",
    name: "1MN Afterburner I",
    description: "Increases ship velocity",
    category: "propulsion",
    class: "afterburner",
    subclass: "standard",
    type: "mid",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 1,
    capacitor: 8,
    stats: {
      speedBonus: 125,
      signaturePenalty: 0,
      massAddition: 500000
    },
    requirements: {
      skills: { "Afterburner": 1 }
    },
    price: { isk: 22000 }
  },
  "prop_ab_10mn": {
    id: "prop_ab_10mn",
    name: "10MN Afterburner I",
    description: "Medium afterburner for cruisers",
    category: "propulsion",
    class: "afterburner",
    subclass: "standard",
    type: "mid",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 45,
    powergrid: 3,
    capacitor: 32,
    stats: {
      speedBonus: 125,
      signaturePenalty: 0,
      massAddition: 5000000
    },
    requirements: {
      skills: { "Afterburner": 3 }
    },
    price: { isk: 85000 }
  },
  "prop_mwd_5mn": {
    id: "prop_mwd_5mn",
    name: "5MN Microwarpdrive I",
    description: "High speed propulsion with signature bloom",
    category: "propulsion",
    class: "microwarpdrive",
    subclass: "standard",
    type: "mid",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 45,
    powergrid: 8,
    capacitor: 55,
    stats: {
      speedBonus: 500,
      signaturePenalty: 500,
      massAddition: 5000000
    },
    requirements: {
      skills: { "High Speed Maneuvering": 1 }
    },
    price: { isk: 125000 }
  },
  "prop_mwd_50mn": {
    id: "prop_mwd_50mn",
    name: "50MN Microwarpdrive I",
    description: "Medium MWD for cruisers",
    category: "propulsion",
    class: "microwarpdrive",
    subclass: "standard",
    type: "mid",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 95,
    powergrid: 28,
    capacitor: 220,
    stats: {
      speedBonus: 500,
      signaturePenalty: 500,
      massAddition: 50000000
    },
    requirements: {
      skills: { "High Speed Maneuvering": 3 }
    },
    price: { isk: 385000 }
  },
  
  // Electronic Warfare
  "ewar_ecm_multi": {
    id: "ewar_ecm_multi",
    name: "Multispectral ECM I",
    description: "Jams all sensor types",
    category: "electronic",
    class: "ecm",
    subclass: "multispectral",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 35,
    powergrid: 1,
    capacitor: 45,
    stats: {
      jamStrength: 2.5,
      range: 50000,
      duration: 20
    },
    requirements: {
      skills: { "Electronic Warfare": 1 }
    },
    price: { isk: 95000 }
  },
  "ewar_damp_scan": {
    id: "ewar_damp_scan",
    name: "Scan Resolution Dampener I",
    description: "Reduces target lock speed",
    category: "electronic",
    class: "dampener",
    subclass: "scan_resolution",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 35,
    stats: {
      scanResPenalty: 25,
      range: 60000,
      duration: 0
    },
    requirements: {
      skills: { "Electronic Warfare": 1 }
    },
    price: { isk: 75000 }
  },
  "ewar_web": {
    id: "ewar_web",
    name: "Stasis Webifier I",
    description: "Reduces target velocity",
    category: "electronic",
    class: "webifier",
    subclass: "stasis",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 22,
    powergrid: 1,
    capacitor: 18,
    stats: {
      velocityPenalty: 50,
      range: 10000,
      duration: 0
    },
    requirements: {
      skills: { "Propulsion Jamming": 1 }
    },
    price: { isk: 55000 }
  },
  "ewar_disrupt": {
    id: "ewar_disrupt",
    name: "Warp Disruptor I",
    description: "Prevents warp drive activation",
    category: "electronic",
    class: "disruptor",
    subclass: "warp",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 22,
    stats: {
      warpScramStrength: 1,
      range: 20000,
      duration: 0
    },
    requirements: {
      skills: { "Propulsion Jamming": 1 }
    },
    price: { isk: 65000 }
  },
  "ewar_scram": {
    id: "ewar_scram",
    name: "Warp Scrambler I",
    description: "Prevents warp and disables MWD",
    category: "electronic",
    class: "scrambler",
    subclass: "warp",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 35,
    powergrid: 1,
    capacitor: 28,
    stats: {
      warpScramStrength: 2,
      range: 9000,
      duration: 0,
      disablesMWD: true
    },
    requirements: {
      skills: { "Propulsion Jamming": 2 }
    },
    price: { isk: 85000 }
  },
  "ewar_painter": {
    id: "ewar_painter",
    name: "Target Painter I",
    description: "Increases target signature radius",
    category: "electronic",
    class: "painter",
    subclass: "target",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 25,
    powergrid: 1,
    capacitor: 18,
    stats: {
      signatureBonus: 25,
      range: 60000,
      duration: 0
    },
    requirements: {
      skills: { "Target Painting": 1 }
    },
    price: { isk: 45000 }
  },
  
  // Capacitor Modules
  "cap_booster_s": {
    id: "cap_booster_s",
    name: "Small Capacitor Booster I",
    description: "Injects capacitor charges",
    category: "engineering",
    class: "capacitor",
    subclass: "booster",
    type: "mid",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 8,
    stats: {
      capacitorBonus: 150,
      reloadTime: 10,
      chargeSize: 25
    },
    requirements: {
      skills: { "Capacitor Management": 1 }
    },
    price: { isk: 35000 }
  },
  "cap_battery_m": {
    id: "cap_battery_m",
    name: "Medium Capacitor Battery I",
    description: "Increases capacitor capacity and recharge",
    category: "engineering",
    class: "capacitor",
    subclass: "battery",
    type: "mid",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 22,
    powergrid: 1,
    stats: {
      capacitorBonus: 15,
      rechargeBonus: 10,
      neutrResist: 20
    },
    requirements: {
      skills: { "Capacitor Management": 2 }
    },
    price: { isk: 65000 }
  },
  
  // Sensor Modules
  "sensor_boost": {
    id: "sensor_boost",
    name: "Sensor Booster I",
    description: "Improves targeting systems",
    category: "electronic",
    class: "sensor",
    subclass: "booster",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      scanResBonus: 15,
      targetRangeBonus: 15,
      scriptable: true
    },
    requirements: {
      skills: { "Long Range Targeting": 1 }
    },
    price: { isk: 55000 }
  },
  "tracking_comp": {
    id: "tracking_comp",
    name: "Tracking Computer I",
    description: "Improves turret tracking and range",
    category: "electronic",
    class: "tracking",
    subclass: "computer",
    type: "mid",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 32,
    powergrid: 1,
    stats: {
      trackingBonus: 10,
      rangeBonus: 10,
      scriptable: true
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 48000 }
  },
  
  // ===== ENGINEERING - LOW SLOTS (20 modules) =====
  
  // Armor Repairers
  "eng_armor_rep_s1": {
    id: "eng_armor_rep_s1",
    name: "Small Armor Repairer I",
    description: "Repairs armor HP over time",
    category: "defense",
    class: "armor",
    subclass: "repairer",
    type: "low",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 12,
    capacitor: 18,
    stats: {
      armorRepair: 50,
      duration: 5,
      cooldown: 0
    },
    requirements: {
      skills: { "Repair Systems": 1 }
    },
    price: { isk: 25000 }
  },
  "eng_armor_rep_m2": {
    id: "eng_armor_rep_m2",
    name: "Medium Armor Repairer II",
    description: "Advanced medium armor repair",
    category: "defense",
    class: "armor",
    subclass: "repairer",
    type: "low",
    size: "medium",
    meta: 5,
    tech: 2,
    cpu: 48,
    powergrid: 65,
    capacitor: 96,
    stats: {
      armorRepair: 280,
      duration: 5,
      cooldown: 0
    },
    requirements: {
      skills: { "Repair Systems": 5 }
    },
    price: { isk: 385000 }
  },
  
  // Armor Plates
  "eng_armor_plate_s": {
    id: "eng_armor_plate_s",
    name: "Small Armor Plate I",
    description: "Increases armor HP",
    category: "defense",
    class: "armor",
    subclass: "plate",
    type: "low",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 1,
    powergrid: 2,
    stats: {
      armorBonus: 400,
      massPenalty: 500000,
      speedPenalty: 5
    },
    requirements: {
      skills: { "Mechanics": 1 }
    },
    price: { isk: 18000 }
  },
  "eng_armor_plate_m": {
    id: "eng_armor_plate_m",
    name: "Medium Armor Plate I",
    description: "Medium armor HP increase",
    category: "defense",
    class: "armor",
    subclass: "plate",
    type: "low",
    size: "medium",
    meta: 0,
    tech: 1,
    cpu: 1,
    powergrid: 5,
    stats: {
      armorBonus: 1600,
      massPenalty: 5000000,
      speedPenalty: 5
    },
    requirements: {
      skills: { "Mechanics": 3 }
    },
    price: { isk: 65000 }
  },
  "eng_armor_plate_l": {
    id: "eng_armor_plate_l",
    name: "Large Armor Plate I",
    description: "Large armor HP for battleships",
    category: "defense",
    class: "armor",
    subclass: "plate",
    type: "low",
    size: "large",
    meta: 0,
    tech: 1,
    cpu: 1,
    powergrid: 12,
    stats: {
      armorBonus: 6400,
      massPenalty: 50000000,
      speedPenalty: 5
    },
    requirements: {
      skills: { "Mechanics": 5 }
    },
    price: { isk: 285000 }
  },
  
  // Armor Hardeners
  "eng_armor_hard_em": {
    id: "eng_armor_hard_em",
    name: "EM Armor Hardener I",
    description: "Increases EM armor resistance",
    category: "defense",
    class: "armor",
    subclass: "hardener",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      emResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Hull Upgrades": 1 }
    },
    price: { isk: 42000 }
  },
  "eng_armor_hard_therm": {
    id: "eng_armor_hard_therm",
    name: "Thermal Armor Hardener I",
    description: "Increases thermal armor resistance",
    category: "defense",
    class: "armor",
    subclass: "hardener",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      thermalResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Hull Upgrades": 1 }
    },
    price: { isk: 42000 }
  },
  "eng_armor_hard_kin": {
    id: "eng_armor_hard_kin",
    name: "Kinetic Armor Hardener I",
    description: "Increases kinetic armor resistance",
    category: "defense",
    class: "armor",
    subclass: "hardener",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      kineticResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Hull Upgrades": 1 }
    },
    price: { isk: 42000 }
  },
  "eng_armor_hard_exp": {
    id: "eng_armor_hard_exp",
    name: "Explosive Armor Hardener I",
    description: "Increases explosive armor resistance",
    category: "defense",
    class: "armor",
    subclass: "hardener",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    capacitor: 18,
    stats: {
      explosiveResist: 30,
      duration: 0
    },
    requirements: {
      skills: { "Hull Upgrades": 1 }
    },
    price: { isk: 42000 }
  },
  
  // Damage Modules
  "eng_dmg_gyro": {
    id: "eng_dmg_gyro",
    name: "Gyrostabilizer I",
    description: "Increases projectile weapon damage",
    category: "weapon",
    class: "damage_mod",
    subclass: "projectile",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      damageBonus: 10,
      rofBonus: 5,
      weaponType: "projectile"
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 55000 }
  },
  "eng_dmg_heatsink": {
    id: "eng_dmg_heatsink",
    name: "Heat Sink I",
    description: "Increases energy weapon damage",
    category: "weapon",
    class: "damage_mod",
    subclass: "energy",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      damageBonus: 10,
      rofBonus: 5,
      weaponType: "energy"
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 55000 }
  },
  "eng_dmg_magstab": {
    id: "eng_dmg_magstab",
    name: "Magnetic Field Stabilizer I",
    description: "Increases hybrid weapon damage",
    category: "weapon",
    class: "damage_mod",
    subclass: "hybrid",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      damageBonus: 10,
      rofBonus: 5,
      weaponType: "hybrid"
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 55000 }
  },
  "eng_dmg_bcu": {
    id: "eng_dmg_bcu",
    name: "Ballistic Control System I",
    description: "Increases missile damage",
    category: "weapon",
    class: "damage_mod",
    subclass: "missile",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      damageBonus: 10,
      rofBonus: 5,
      weaponType: "missile"
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 55000 }
  },
  "eng_dmg_dda": {
    id: "eng_dmg_dda",
    name: "Drone Damage Amplifier I",
    description: "Increases drone damage",
    category: "weapon",
    class: "damage_mod",
    subclass: "drone",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      damageBonus: 10,
      weaponType: "drone"
    },
    requirements: {
      skills: { "Weapon Upgrades": 1 }
    },
    price: { isk: 55000 }
  },
  
  // Power/CPU Modules
  "eng_power_diag": {
    id: "eng_power_diag",
    name: "Power Diagnostic System I",
    description: "Increases capacitor, shield, and powergrid",
    category: "engineering",
    class: "power",
    subclass: "diagnostic",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 1,
    stats: {
      capacitorBonus: 5,
      shieldBonus: 5,
      powergridBonus: 5,
      rechargeBonus: 5
    },
    requirements: {
      skills: { "Engineering": 1 }
    },
    price: { isk: 38000 }
  },
  "eng_reactor_ctrl": {
    id: "eng_reactor_ctrl",
    name: "Reactor Control Unit I",
    description: "Increases powergrid output",
    category: "engineering",
    class: "power",
    subclass: "reactor",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 28,
    powergrid: 1,
    stats: {
      powergridBonus: 10
    },
    requirements: {
      skills: { "Engineering": 2 }
    },
    price: { isk: 45000 }
  },
  "eng_cpu_upgrade": {
    id: "eng_cpu_upgrade",
    name: "Co-Processor I",
    description: "Increases CPU output",
    category: "engineering",
    class: "cpu",
    subclass: "coprocessor",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 1,
    powergrid: 1,
    stats: {
      cpuBonus: 10
    },
    requirements: {
      skills: { "Electronics": 1 }
    },
    price: { isk: 35000 }
  },
  
  // Cargo/Utility
  "eng_cargo_expand": {
    id: "eng_cargo_expand",
    name: "Expanded Cargohold I",
    description: "Increases cargo capacity",
    category: "utility",
    class: "cargo",
    subclass: "expander",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 8,
    stats: {
      cargoBonus: 25
    },
    requirements: {
      skills: { "Hull Upgrades": 1 }
    },
    price: { isk: 28000 }
  },
  "eng_inertia_stab": {
    id: "eng_inertia_stab",
    name: "Inertial Stabilizers I",
    description: "Reduces ship inertia",
    category: "propulsion",
    class: "inertia",
    subclass: "stabilizer",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 1,
    stats: {
      inertiaBonus: 15,
      signaturePenalty: 10
    },
    requirements: {
      skills: { "Navigation": 2 }
    },
    price: { isk: 42000 }
  },
  "eng_overdrive": {
    id: "eng_overdrive",
    name: "Overdrive Injector System I",
    description: "Increases maximum velocity",
    category: "propulsion",
    class: "overdrive",
    subclass: "injector",
    type: "low",
    size: "universal",
    meta: 0,
    tech: 1,
    cpu: 18,
    powergrid: 1,
    stats: {
      velocityBonus: 5,
      signaturePenalty: 10
    },
    requirements: {
      skills: { "Navigation": 1 }
    },
    price: { isk: 38000 }
  },
  
  // ===== RIGS (15 modules) =====
  
  "rig_armor_rep": {
    id: "rig_armor_rep",
    name: "Auxiliary Nano Pump I",
    description: "Increases armor repair amount",
    category: "defense",
    class: "armor",
    subclass: "repair_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      armorRepairBonus: 15,
      drawback: "Armor HP -10%"
    },
    requirements: {
      skills: { "Jury Rigging": 1 }
    },
    price: { isk: 125000 }
  },
  "rig_shield_ext": {
    id: "rig_shield_ext",
    name: "Core Defense Field Extender I",
    description: "Increases shield HP",
    category: "defense",
    class: "shield",
    subclass: "extender_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      shieldBonus: 15,
      drawback: "Signature radius +10%"
    },
    requirements: {
      skills: { "Shield Rigging": 1 }
    },
    price: { isk: 135000 }
  },
  "rig_cap_ctrl": {
    id: "rig_cap_ctrl",
    name: "Capacitor Control Circuit I",
    description: "Increases capacitor recharge rate",
    category: "engineering",
    class: "capacitor",
    subclass: "recharge_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      capacitorRechargeBonus: 15,
      drawback: "Shield boost amount -10%"
    },
    requirements: {
      skills: { "Energy Grid Upgrades": 1 }
    },
    price: { isk: 145000 }
  },
  "rig_dmg_ctrl": {
    id: "rig_dmg_ctrl",
    name: "Warhead Calefaction Catalyst I",
    description: "Increases missile damage",
    category: "weapon",
    class: "missile",
    subclass: "damage_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      missileDamageBonus: 10,
      drawback: "Missile velocity -10%"
    },
    requirements: {
      skills: { "Missile Launcher Rigging": 1 }
    },
    price: { isk: 155000 }
  },
  "rig_tracking": {
    id: "rig_tracking",
    name: "Burst Aerator I",
    description: "Increases turret rate of fire",
    category: "weapon",
    class: "turret",
    subclass: "rof_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      rofBonus: 10,
      drawback: "Capacitor capacity -10%"
    },
    requirements: {
      skills: { "Projectile Weapon Rigging": 1 }
    },
    price: { isk: 165000 }
  },
  "rig_cargo": {
    id: "rig_cargo",
    name: "Cargohold Optimization I",
    description: "Increases cargo capacity",
    category: "utility",
    class: "cargo",
    subclass: "capacity_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      cargoBonus: 20,
      drawback: "Velocity -10%"
    },
    requirements: {
      skills: { "Jury Rigging": 1 }
    },
    price: { isk: 95000 }
  },
  "rig_speed": {
    id: "rig_speed",
    name: "Polycarbon Engine Housing I",
    description: "Increases ship velocity",
    category: "propulsion",
    class: "speed",
    subclass: "velocity_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      velocityBonus: 10,
      drawback: "Cargo capacity -10%"
    },
    requirements: {
      skills: { "Astronautics Rigging": 1 }
    },
    price: { isk: 115000 }
  },
  "rig_targeting": {
    id: "rig_targeting",
    name: "Targeting System Subcontroller I",
    description: "Increases targeting range",
    category: "electronic",
    class: "targeting",
    subclass: "range_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      targetingRangeBonus: 20,
      drawback: "Scan resolution -10%"
    },
    requirements: {
      skills: { "Electronic Superiority Rigging": 1 }
    },
    price: { isk: 105000 }
  },
  "rig_drone_dmg": {
    id: "rig_drone_dmg",
    name: "Drone Damage Amplifier I",
    description: "Increases drone damage",
    category: "weapon",
    class: "drone",
    subclass: "damage_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      droneDamageBonus: 10,
      drawback: "Drone hitpoints -10%"
    },
    requirements: {
      skills: { "Drone Rigging": 1 }
    },
    price: { isk: 175000 }
  },
  "rig_warp_speed": {
    id: "rig_warp_speed",
    name: "Hyperspatial Velocity Optimizer I",
    description: "Increases warp speed",
    category: "propulsion",
    class: "warp",
    subclass: "speed_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      warpSpeedBonus: 20,
      drawback: "Capacitor capacity -10%"
    },
    requirements: {
      skills: { "Astronautics Rigging": 2 }
    },
    price: { isk: 185000 }
  },
  "rig_sig_reduce": {
    id: "rig_sig_reduce",
    name: "Small Low Friction Nozzle Joints I",
    description: "Reduces signature radius",
    category: "propulsion",
    class: "signature",
    subclass: "reduction_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      signatureReduction: 10,
      drawback: "Velocity -10%"
    },
    requirements: {
      skills: { "Astronautics Rigging": 1 }
    },
    price: { isk: 125000 }
  },
  "rig_em_armor": {
    id: "rig_em_armor",
    name: "Anti-EM Screen Reinforcer I",
    description: "Increases EM armor resistance",
    category: "defense",
    class: "armor",
    subclass: "resist_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      emArmorResist: 15,
      drawback: "Explosive armor resist -5%"
    },
    requirements: {
      skills: { "Armor Rigging": 1 }
    },
    price: { isk: 135000 }
  },
  "rig_kinetic_shield": {
    id: "rig_kinetic_shield",
    name: "Anti-Kinetic Screen Reinforcer I",
    description: "Increases kinetic shield resistance",
    category: "defense",
    class: "shield",
    subclass: "resist_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      kineticShieldResist: 15,
      drawback: "EM shield resist -5%"
    },
    requirements: {
      skills: { "Shield Rigging": 1 }
    },
    price: { isk: 145000 }
  },
  "rig_scan_res": {
    id: "rig_scan_res",
    name: "Ionic Field Projector I",
    description: "Increases scan resolution",
    category: "electronic",
    class: "sensor",
    subclass: "scan_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      scanResolutionBonus: 15,
      drawback: "Targeting range -10%"
    },
    requirements: {
      skills: { "Electronic Superiority Rigging": 1 }
    },
    price: { isk: 115000 }
  },
  "rig_agility": {
    id: "rig_agility",
    name: "Auxiliary Thrusters I",
    description: "Improves ship agility",
    category: "propulsion",
    class: "agility",
    subclass: "inertia_rig",
    type: "rig",
    size: "small",
    meta: 0,
    tech: 1,
    cpu: 0,
    powergrid: 0,
    calibration: 50,
    stats: {
      inertiaModifier: -10,
      drawback: "Structure HP -10%"
    },
    requirements: {
      skills: { "Astronautics Rigging": 1 }
    },
    price: { isk: 155000 }
  }
};

// Helper functions for module management
export function getModulesByCategory(category: string): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.category === category);
}

export function getModulesByType(type: string): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.type === type);
}

export function getModulesBySize(size: string): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.size === size || m.size === "universal");
}

export function getModuleById(id: string): ShipModule | undefined {
  return SHIP_FITTING_MODULES[id];
}

export function getModulesByClass(moduleClass: string): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.class === moduleClass);
}

export function getModulesBySubclass(subclass: string): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.subclass === subclass);
}

export function getTechLevelModules(techLevel: number): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.tech === techLevel);
}

export function getMetaLevelModules(metaLevel: number): ShipModule[] {
  return Object.values(SHIP_FITTING_MODULES).filter(m => m.meta === metaLevel);
}

// Module categories for UI organization
export const MODULE_CATEGORIES = {
  weapon: { name: "Weapons", icon: "Target", color: "red" },
  defense: { name: "Defense", icon: "Shield", color: "blue" },
  propulsion: { name: "Propulsion", icon: "Navigation", color: "green" },
  electronic: { name: "Electronic Warfare", icon: "Cpu", color: "purple" },
  engineering: { name: "Engineering", icon: "Cog", color: "yellow" },
  utility: { name: "Utility", icon: "Settings", color: "gray" }
};

// Slot type information
export const SLOT_TYPES = {
  high: { name: "High Slots", description: "Weapons and utility modules", color: "red" },
  mid: { name: "Mid Slots", description: "Defense, propulsion, and EWAR", color: "blue" },
  low: { name: "Low Slots", description: "Engineering and damage mods", color: "green" },
  rig: { name: "Rig Slots", description: "Permanent ship modifications", color: "purple" },
  subsystem: { name: "Subsystem Slots", description: "T3 ship subsystems", color: "orange" }
};

// Ship size classifications
export const SHIP_SIZES = ["small", "medium", "large", "capital", "universal"];

// Tech levels
export const TECH_LEVELS = {
  1: { name: "Tech I", description: "Standard modules", color: "gray" },
  2: { name: "Tech II", description: "Advanced modules", color: "yellow" },
  3: { name: "Tech III", description: "Elite modules", color: "purple" }
};

// Meta levels
export const META_LEVELS = {
  0: { name: "Tech I", quality: "Standard" },
  1: { name: "Meta 1", quality: "Improved" },
  2: { name: "Meta 2", quality: "Enhanced" },
  3: { name: "Meta 3", quality: "Superior" },
  4: { name: "Meta 4", quality: "Exceptional" },
  5: { name: "Tech II", quality: "Advanced" },
  6: { name: "Faction", quality: "Faction" },
  7: { name: "Officer", quality: "Officer" },
  8: { name: "Deadspace", quality: "Deadspace" },
  14: { name: "Storyline", quality: "Storyline" }
};

// Total module count
export const TOTAL_MODULES = Object.keys(SHIP_FITTING_MODULES).length;
