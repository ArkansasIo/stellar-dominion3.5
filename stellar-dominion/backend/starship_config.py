"""
Stellar Dominion - Starship Configuration
90 Starships + Motherships with complete stats, classes, types, and attributes
"""

# ==================== STARSHIP CLASSES (12 Classes) ====================
STARSHIP_CLASSES = {
    "fighter": {
        "name": "Fighter",
        "description": "Small, agile combat craft for dogfighting",
        "size": "small",
        "crew_min": 1,
        "crew_max": 2,
        "subclasses": ["interceptor", "strike_fighter", "bomber_fighter", "stealth_fighter"]
    },
    "corvette": {
        "name": "Corvette",
        "description": "Light warship for patrol and escort duties",
        "size": "small",
        "crew_min": 10,
        "crew_max": 50,
        "subclasses": ["patrol_corvette", "missile_corvette", "gunship"]
    },
    "frigate": {
        "name": "Frigate",
        "description": "Versatile warship for fleet support",
        "size": "medium",
        "crew_min": 50,
        "crew_max": 200,
        "subclasses": ["assault_frigate", "support_frigate", "stealth_frigate"]
    },
    "destroyer": {
        "name": "Destroyer",
        "description": "Fast warship specializing in anti-ship combat",
        "size": "medium",
        "crew_min": 150,
        "crew_max": 400,
        "subclasses": ["fleet_destroyer", "missile_destroyer", "escort_destroyer"]
    },
    "cruiser": {
        "name": "Cruiser",
        "description": "Balanced warship for independent operations",
        "size": "large",
        "crew_min": 300,
        "crew_max": 800,
        "subclasses": ["light_cruiser", "heavy_cruiser", "battle_cruiser", "strike_cruiser"]
    },
    "battleship": {
        "name": "Battleship",
        "description": "Heavy capital ship with massive firepower",
        "size": "capital",
        "crew_min": 1000,
        "crew_max": 3000,
        "subclasses": ["dreadnought", "super_battleship", "assault_battleship"]
    },
    "carrier": {
        "name": "Carrier",
        "description": "Capital ship that deploys fighter squadrons",
        "size": "capital",
        "crew_min": 2000,
        "crew_max": 5000,
        "subclasses": ["fleet_carrier", "escort_carrier", "supercarrier"]
    },
    "support": {
        "name": "Support",
        "description": "Non-combat vessel for logistics and support",
        "size": "varies",
        "crew_min": 5,
        "crew_max": 500,
        "subclasses": ["transport", "tanker", "repair_ship", "hospital_ship"]
    },
    "science": {
        "name": "Science",
        "description": "Research and exploration vessel",
        "size": "medium",
        "crew_min": 50,
        "crew_max": 300,
        "subclasses": ["explorer", "survey_ship", "research_vessel"]
    },
    "mining": {
        "name": "Mining",
        "description": "Resource extraction vessel",
        "size": "varies",
        "crew_min": 20,
        "crew_max": 200,
        "subclasses": ["asteroid_miner", "gas_harvester", "deep_core_miner"]
    },
    "command": {
        "name": "Command",
        "description": "Fleet coordination and command vessel",
        "size": "capital",
        "crew_min": 500,
        "crew_max": 2000,
        "subclasses": ["command_ship", "flagship", "mobile_headquarters"]
    },
    "titan": {
        "name": "Titan",
        "description": "Massive super-capital warship",
        "size": "super_capital",
        "crew_min": 10000,
        "crew_max": 50000,
        "subclasses": ["titan_class", "leviathan", "world_devastator"]
    }
}

# ==================== STARSHIP TYPES (12 Types) ====================
STARSHIP_TYPES = {
    "combat": {
        "name": "Combat Vessel",
        "description": "Designed for direct combat engagement",
        "subtypes": ["assault", "defensive", "raider", "siege"]
    },
    "stealth": {
        "name": "Stealth Vessel",
        "description": "Designed for covert operations",
        "subtypes": ["cloaked", "sensor_ghost", "infiltrator"]
    },
    "carrier": {
        "name": "Carrier Vessel",
        "description": "Designed to deploy smaller craft",
        "subtypes": ["fighter_carrier", "drone_carrier", "assault_carrier"]
    },
    "artillery": {
        "name": "Artillery Vessel",
        "description": "Long-range bombardment platform",
        "subtypes": ["siege_ship", "planetary_bombardment", "fleet_support"]
    },
    "support": {
        "name": "Support Vessel",
        "description": "Fleet logistics and support",
        "subtypes": ["repair", "resupply", "medical", "command"]
    },
    "transport": {
        "name": "Transport Vessel",
        "description": "Cargo and troop transport",
        "subtypes": ["cargo", "troop", "colony", "refugee"]
    },
    "science": {
        "name": "Science Vessel",
        "description": "Research and exploration",
        "subtypes": ["explorer", "research", "survey", "probe_launcher"]
    },
    "mining": {
        "name": "Mining Vessel",
        "description": "Resource extraction",
        "subtypes": ["asteroid", "gas", "salvage", "recycler"]
    },
    "diplomatic": {
        "name": "Diplomatic Vessel",
        "description": "Diplomacy and negotiation",
        "subtypes": ["embassy", "courier", "VIP_transport"]
    },
    "special": {
        "name": "Special Purpose",
        "description": "Unique specialized vessels",
        "subtypes": ["experimental", "prototype", "ancient", "alien"]
    },
    "hybrid": {
        "name": "Hybrid Vessel",
        "description": "Multi-role capable ships",
        "subtypes": ["combat_carrier", "armed_transport", "exploration_combat"]
    },
    "superweapon": {
        "name": "Superweapon Platform",
        "description": "Planet-destroying capabilities",
        "subtypes": ["death_star", "world_cracker", "star_killer"]
    }
}

# ==================== WEAPON SYSTEMS ====================
WEAPON_SYSTEMS = {
    "laser": {"name": "Laser Cannon", "damage_type": "energy", "range": "medium", "accuracy": 0.85},
    "plasma": {"name": "Plasma Cannon", "damage_type": "energy", "range": "medium", "accuracy": 0.75},
    "ion": {"name": "Ion Cannon", "damage_type": "ion", "range": "medium", "accuracy": 0.80},
    "railgun": {"name": "Railgun", "damage_type": "kinetic", "range": "long", "accuracy": 0.90},
    "missile": {"name": "Missile Launcher", "damage_type": "explosive", "range": "long", "accuracy": 0.70},
    "torpedo": {"name": "Torpedo Bay", "damage_type": "explosive", "range": "medium", "accuracy": 0.65},
    "gauss": {"name": "Gauss Cannon", "damage_type": "kinetic", "range": "long", "accuracy": 0.92},
    "beam": {"name": "Beam Weapon", "damage_type": "energy", "range": "short", "accuracy": 0.95},
    "pulse": {"name": "Pulse Cannon", "damage_type": "energy", "range": "short", "accuracy": 0.88},
    "disruptor": {"name": "Disruptor", "damage_type": "exotic", "range": "medium", "accuracy": 0.78},
    "graviton": {"name": "Graviton Beam", "damage_type": "exotic", "range": "short", "accuracy": 0.70},
    "antimatter": {"name": "Antimatter Torpedo", "damage_type": "exotic", "range": "long", "accuracy": 0.60}
}

# ==================== ENGINE SYSTEMS ====================
ENGINE_SYSTEMS = {
    "chemical": {"name": "Chemical Rocket", "speed_mod": 1.0, "fuel_efficiency": 0.5, "reliability": 0.95},
    "ion": {"name": "Ion Drive", "speed_mod": 1.5, "fuel_efficiency": 0.8, "reliability": 0.90},
    "fusion": {"name": "Fusion Drive", "speed_mod": 2.0, "fuel_efficiency": 0.7, "reliability": 0.85},
    "antimatter": {"name": "Antimatter Drive", "speed_mod": 3.0, "fuel_efficiency": 0.6, "reliability": 0.75},
    "warp": {"name": "Warp Drive", "speed_mod": 10.0, "fuel_efficiency": 0.4, "reliability": 0.70},
    "hyperdrive": {"name": "Hyperdrive", "speed_mod": 100.0, "fuel_efficiency": 0.3, "reliability": 0.65},
    "jump": {"name": "Jump Drive", "speed_mod": 1000.0, "fuel_efficiency": 0.2, "reliability": 0.60},
    "quantum": {"name": "Quantum Slipstream", "speed_mod": 5000.0, "fuel_efficiency": 0.15, "reliability": 0.50}
}

# ==================== SHIELD SYSTEMS ====================
SHIELD_SYSTEMS = {
    "basic": {"name": "Basic Shields", "strength_mod": 1.0, "recharge_rate": 0.05, "power_draw": 1.0},
    "deflector": {"name": "Deflector Shields", "strength_mod": 1.5, "recharge_rate": 0.08, "power_draw": 1.5},
    "ablative": {"name": "Ablative Shields", "strength_mod": 2.0, "recharge_rate": 0.03, "power_draw": 2.0},
    "phased": {"name": "Phased Shields", "strength_mod": 2.5, "recharge_rate": 0.10, "power_draw": 2.5},
    "adaptive": {"name": "Adaptive Shields", "strength_mod": 3.0, "recharge_rate": 0.12, "power_draw": 3.0},
    "quantum": {"name": "Quantum Shields", "strength_mod": 4.0, "recharge_rate": 0.15, "power_draw": 4.0}
}

# ==================== ARMOR SYSTEMS ====================
ARMOR_SYSTEMS = {
    "light": {"name": "Light Armor", "protection_mod": 1.0, "weight_mod": 1.0, "repair_ease": 0.9},
    "standard": {"name": "Standard Armor", "protection_mod": 1.5, "weight_mod": 1.3, "repair_ease": 0.8},
    "heavy": {"name": "Heavy Armor", "protection_mod": 2.0, "weight_mod": 1.8, "repair_ease": 0.6},
    "reactive": {"name": "Reactive Armor", "protection_mod": 2.5, "weight_mod": 1.5, "repair_ease": 0.5},
    "composite": {"name": "Composite Armor", "protection_mod": 3.0, "weight_mod": 1.4, "repair_ease": 0.7},
    "nanite": {"name": "Nanite Armor", "protection_mod": 4.0, "weight_mod": 1.2, "repair_ease": 0.95}
}

# ==================== 90 STARSHIPS + MOTHERSHIPS ====================
STARSHIPS = {
    # ===== FIGHTERS (1-15) =====
    "sf_001": {
        "id": "sf_001",
        "name": "Viper Interceptor",
        "class": "fighter",
        "subclass": "interceptor",
        "type": "combat",
        "subtype": "assault",
        "tier": 1,
        "stats": {
            "hull": 100,
            "health": 100,
            "armor": 20,
            "armor_type": "light",
            "shields": 50,
            "shield_type": "basic",
            "weapons": 30,
            "weapon_type": "laser",
            "power": 50,
            "engine": 80,
            "engine_type": "ion",
            "speed": 150,
            "maneuverability": 95,
            "cargo": 10,
            "fuel": 100,
            "crew": 1
        },
        "attributes": {
            "attack": 50,
            "defense": 30,
            "accuracy": 0.85,
            "evasion": 0.40,
            "critical_chance": 0.10,
            "critical_damage": 1.5
        },
        "sub_attributes": {
            "sensor_range": 100,
            "stealth": 0.20,
            "repair_rate": 0.02,
            "morale_bonus": 0
        },
        "cost": {"metal": 3000, "crystal": 1000, "deuterium": 0},
        "build_time": 30,
        "requirements": {"shipyard": 1}
    },
    "sf_002": {
        "id": "sf_002",
        "name": "Hornet Strike Fighter",
        "class": "fighter",
        "subclass": "strike_fighter",
        "type": "combat",
        "subtype": "assault",
        "tier": 1,
        "stats": {
            "hull": 150,
            "health": 150,
            "armor": 35,
            "armor_type": "light",
            "shields": 75,
            "shield_type": "basic",
            "weapons": 50,
            "weapon_type": "laser",
            "power": 60,
            "engine": 70,
            "engine_type": "ion",
            "speed": 130,
            "maneuverability": 85,
            "cargo": 15,
            "fuel": 120,
            "crew": 1
        },
        "attributes": {
            "attack": 75,
            "defense": 40,
            "accuracy": 0.82,
            "evasion": 0.35,
            "critical_chance": 0.12,
            "critical_damage": 1.6
        },
        "sub_attributes": {
            "sensor_range": 90,
            "stealth": 0.15,
            "repair_rate": 0.02,
            "morale_bonus": 0
        },
        "cost": {"metal": 4500, "crystal": 1500, "deuterium": 0},
        "build_time": 45,
        "requirements": {"shipyard": 2}
    },
    "sf_003": {
        "id": "sf_003",
        "name": "Phantom Stealth Fighter",
        "class": "fighter",
        "subclass": "stealth_fighter",
        "type": "stealth",
        "subtype": "infiltrator",
        "tier": 2,
        "stats": {
            "hull": 80,
            "health": 80,
            "armor": 15,
            "armor_type": "light",
            "shields": 40,
            "shield_type": "phased",
            "weapons": 40,
            "weapon_type": "plasma",
            "power": 70,
            "engine": 90,
            "engine_type": "ion",
            "speed": 160,
            "maneuverability": 92,
            "cargo": 5,
            "fuel": 80,
            "crew": 1
        },
        "attributes": {
            "attack": 60,
            "defense": 20,
            "accuracy": 0.88,
            "evasion": 0.50,
            "critical_chance": 0.20,
            "critical_damage": 2.0
        },
        "sub_attributes": {
            "sensor_range": 150,
            "stealth": 0.70,
            "repair_rate": 0.01,
            "morale_bonus": 5
        },
        "cost": {"metal": 5000, "crystal": 3000, "deuterium": 1000},
        "build_time": 60,
        "requirements": {"shipyard": 3, "espionageTechnology": 2}
    },
    "sf_004": {
        "id": "sf_004",
        "name": "Thunderbolt Bomber",
        "class": "fighter",
        "subclass": "bomber_fighter",
        "type": "artillery",
        "subtype": "siege_ship",
        "tier": 2,
        "stats": {
            "hull": 200,
            "health": 200,
            "armor": 50,
            "armor_type": "standard",
            "shields": 60,
            "shield_type": "basic",
            "weapons": 100,
            "weapon_type": "torpedo",
            "power": 80,
            "engine": 50,
            "engine_type": "ion",
            "speed": 100,
            "maneuverability": 60,
            "cargo": 20,
            "fuel": 150,
            "crew": 2
        },
        "attributes": {
            "attack": 150,
            "defense": 50,
            "accuracy": 0.70,
            "evasion": 0.20,
            "critical_chance": 0.15,
            "critical_damage": 2.5
        },
        "sub_attributes": {
            "sensor_range": 80,
            "stealth": 0.10,
            "repair_rate": 0.02,
            "morale_bonus": 0
        },
        "cost": {"metal": 8000, "crystal": 4000, "deuterium": 2000},
        "build_time": 90,
        "requirements": {"shipyard": 4}
    },
    "sf_005": {
        "id": "sf_005",
        "name": "Raptor Elite Fighter",
        "class": "fighter",
        "subclass": "interceptor",
        "type": "combat",
        "subtype": "raider",
        "tier": 3,
        "stats": {
            "hull": 180,
            "health": 180,
            "armor": 40,
            "armor_type": "reactive",
            "shields": 100,
            "shield_type": "deflector",
            "weapons": 80,
            "weapon_type": "pulse",
            "power": 90,
            "engine": 100,
            "engine_type": "fusion",
            "speed": 180,
            "maneuverability": 90,
            "cargo": 15,
            "fuel": 100,
            "crew": 1
        },
        "attributes": {
            "attack": 100,
            "defense": 60,
            "accuracy": 0.90,
            "evasion": 0.45,
            "critical_chance": 0.18,
            "critical_damage": 1.8
        },
        "sub_attributes": {
            "sensor_range": 120,
            "stealth": 0.25,
            "repair_rate": 0.03,
            "morale_bonus": 5
        },
        "cost": {"metal": 10000, "crystal": 6000, "deuterium": 3000},
        "build_time": 120,
        "requirements": {"shipyard": 5, "combustionDrive": 3}
    },
    
    # ===== CORVETTES (6-15) =====
    "sf_006": {
        "id": "sf_006",
        "name": "Sentinel Patrol Corvette",
        "class": "corvette",
        "subclass": "patrol_corvette",
        "type": "combat",
        "subtype": "defensive",
        "tier": 1,
        "stats": {
            "hull": 500,
            "health": 500,
            "armor": 100,
            "armor_type": "standard",
            "shields": 200,
            "shield_type": "deflector",
            "weapons": 150,
            "weapon_type": "laser",
            "power": 200,
            "engine": 120,
            "engine_type": "ion",
            "speed": 100,
            "maneuverability": 70,
            "cargo": 100,
            "fuel": 300,
            "crew": 25
        },
        "attributes": {
            "attack": 200,
            "defense": 150,
            "accuracy": 0.80,
            "evasion": 0.25,
            "critical_chance": 0.08,
            "critical_damage": 1.4
        },
        "sub_attributes": {
            "sensor_range": 200,
            "stealth": 0.10,
            "repair_rate": 0.03,
            "morale_bonus": 5
        },
        "cost": {"metal": 15000, "crystal": 8000, "deuterium": 2000},
        "build_time": 180,
        "requirements": {"shipyard": 3}
    },
    "sf_007": {
        "id": "sf_007",
        "name": "Havoc Missile Corvette",
        "class": "corvette",
        "subclass": "missile_corvette",
        "type": "artillery",
        "subtype": "siege_ship",
        "tier": 2,
        "stats": {
            "hull": 450,
            "health": 450,
            "armor": 80,
            "armor_type": "standard",
            "shields": 150,
            "shield_type": "deflector",
            "weapons": 250,
            "weapon_type": "missile",
            "power": 250,
            "engine": 100,
            "engine_type": "ion",
            "speed": 90,
            "maneuverability": 60,
            "cargo": 80,
            "fuel": 350,
            "crew": 30
        },
        "attributes": {
            "attack": 350,
            "defense": 100,
            "accuracy": 0.75,
            "evasion": 0.15,
            "critical_chance": 0.12,
            "critical_damage": 1.8
        },
        "sub_attributes": {
            "sensor_range": 250,
            "stealth": 0.05,
            "repair_rate": 0.02,
            "morale_bonus": 0
        },
        "cost": {"metal": 20000, "crystal": 12000, "deuterium": 5000},
        "build_time": 240,
        "requirements": {"shipyard": 4, "weaponsTechnology": 2}
    },
    "sf_008": {
        "id": "sf_008",
        "name": "Wraith Gunship",
        "class": "corvette",
        "subclass": "gunship",
        "type": "combat",
        "subtype": "assault",
        "tier": 2,
        "stats": {
            "hull": 600,
            "health": 600,
            "armor": 120,
            "armor_type": "heavy",
            "shields": 180,
            "shield_type": "deflector",
            "weapons": 200,
            "weapon_type": "gauss",
            "power": 220,
            "engine": 110,
            "engine_type": "fusion",
            "speed": 95,
            "maneuverability": 65,
            "cargo": 120,
            "fuel": 400,
            "crew": 35
        },
        "attributes": {
            "attack": 280,
            "defense": 180,
            "accuracy": 0.85,
            "evasion": 0.20,
            "critical_chance": 0.10,
            "critical_damage": 1.6
        },
        "sub_attributes": {
            "sensor_range": 180,
            "stealth": 0.08,
            "repair_rate": 0.03,
            "morale_bonus": 10
        },
        "cost": {"metal": 25000, "crystal": 15000, "deuterium": 6000},
        "build_time": 300,
        "requirements": {"shipyard": 5}
    },
    
    # ===== FRIGATES (9-18) =====
    "sf_009": {
        "id": "sf_009",
        "name": "Guardian Assault Frigate",
        "class": "frigate",
        "subclass": "assault_frigate",
        "type": "combat",
        "subtype": "assault",
        "tier": 2,
        "stats": {
            "hull": 1200,
            "health": 1200,
            "armor": 250,
            "armor_type": "heavy",
            "shields": 400,
            "shield_type": "ablative",
            "weapons": 350,
            "weapon_type": "plasma",
            "power": 400,
            "engine": 150,
            "engine_type": "fusion",
            "speed": 80,
            "maneuverability": 55,
            "cargo": 300,
            "fuel": 600,
            "crew": 100
        },
        "attributes": {
            "attack": 450,
            "defense": 300,
            "accuracy": 0.78,
            "evasion": 0.15,
            "critical_chance": 0.08,
            "critical_damage": 1.5
        },
        "sub_attributes": {
            "sensor_range": 300,
            "stealth": 0.05,
            "repair_rate": 0.04,
            "morale_bonus": 15
        },
        "cost": {"metal": 40000, "crystal": 25000, "deuterium": 10000},
        "build_time": 480,
        "requirements": {"shipyard": 6, "armorTechnology": 2}
    },
    "sf_010": {
        "id": "sf_010",
        "name": "Aegis Support Frigate",
        "class": "frigate",
        "subclass": "support_frigate",
        "type": "support",
        "subtype": "repair",
        "tier": 2,
        "stats": {
            "hull": 1000,
            "health": 1000,
            "armor": 200,
            "armor_type": "standard",
            "shields": 500,
            "shield_type": "adaptive",
            "weapons": 150,
            "weapon_type": "laser",
            "power": 500,
            "engine": 130,
            "engine_type": "fusion",
            "speed": 75,
            "maneuverability": 50,
            "cargo": 500,
            "fuel": 700,
            "crew": 120
        },
        "attributes": {
            "attack": 200,
            "defense": 400,
            "accuracy": 0.75,
            "evasion": 0.10,
            "critical_chance": 0.05,
            "critical_damage": 1.3
        },
        "sub_attributes": {
            "sensor_range": 400,
            "stealth": 0.03,
            "repair_rate": 0.10,
            "morale_bonus": 20
        },
        "cost": {"metal": 35000, "crystal": 30000, "deuterium": 12000},
        "build_time": 540,
        "requirements": {"shipyard": 6, "shieldingTechnology": 3}
    },
    "sf_011": {
        "id": "sf_011",
        "name": "Shadow Stealth Frigate",
        "class": "frigate",
        "subclass": "stealth_frigate",
        "type": "stealth",
        "subtype": "cloaked",
        "tier": 3,
        "stats": {
            "hull": 800,
            "health": 800,
            "armor": 150,
            "armor_type": "composite",
            "shields": 350,
            "shield_type": "phased",
            "weapons": 300,
            "weapon_type": "disruptor",
            "power": 450,
            "engine": 180,
            "engine_type": "antimatter",
            "speed": 100,
            "maneuverability": 65,
            "cargo": 200,
            "fuel": 500,
            "crew": 80
        },
        "attributes": {
            "attack": 400,
            "defense": 250,
            "accuracy": 0.85,
            "evasion": 0.35,
            "critical_chance": 0.18,
            "critical_damage": 2.0
        },
        "sub_attributes": {
            "sensor_range": 500,
            "stealth": 0.60,
            "repair_rate": 0.03,
            "morale_bonus": 10
        },
        "cost": {"metal": 50000, "crystal": 40000, "deuterium": 20000},
        "build_time": 720,
        "requirements": {"shipyard": 7, "espionageTechnology": 5}
    },
    
    # ===== DESTROYERS (12-21) =====
    "sf_012": {
        "id": "sf_012",
        "name": "Tempest Fleet Destroyer",
        "class": "destroyer",
        "subclass": "fleet_destroyer",
        "type": "combat",
        "subtype": "assault",
        "tier": 3,
        "stats": {
            "hull": 2500,
            "health": 2500,
            "armor": 500,
            "armor_type": "heavy",
            "shields": 800,
            "shield_type": "ablative",
            "weapons": 600,
            "weapon_type": "railgun",
            "power": 700,
            "engine": 200,
            "engine_type": "fusion",
            "speed": 70,
            "maneuverability": 45,
            "cargo": 500,
            "fuel": 1000,
            "crew": 200
        },
        "attributes": {
            "attack": 800,
            "defense": 500,
            "accuracy": 0.82,
            "evasion": 0.12,
            "critical_chance": 0.10,
            "critical_damage": 1.7
        },
        "sub_attributes": {
            "sensor_range": 400,
            "stealth": 0.03,
            "repair_rate": 0.04,
            "morale_bonus": 20
        },
        "cost": {"metal": 60000, "crystal": 50000, "deuterium": 15000},
        "build_time": 360,
        "requirements": {"shipyard": 7}
    },
    "sf_013": {
        "id": "sf_013",
        "name": "Hellfire Missile Destroyer",
        "class": "destroyer",
        "subclass": "missile_destroyer",
        "type": "artillery",
        "subtype": "fleet_support",
        "tier": 3,
        "stats": {
            "hull": 2200,
            "health": 2200,
            "armor": 400,
            "armor_type": "reactive",
            "shields": 600,
            "shield_type": "deflector",
            "weapons": 900,
            "weapon_type": "missile",
            "power": 800,
            "engine": 180,
            "engine_type": "fusion",
            "speed": 65,
            "maneuverability": 40,
            "cargo": 400,
            "fuel": 1200,
            "crew": 180
        },
        "attributes": {
            "attack": 1100,
            "defense": 350,
            "accuracy": 0.75,
            "evasion": 0.08,
            "critical_chance": 0.15,
            "critical_damage": 2.0
        },
        "sub_attributes": {
            "sensor_range": 500,
            "stealth": 0.02,
            "repair_rate": 0.03,
            "morale_bonus": 15
        },
        "cost": {"metal": 70000, "crystal": 55000, "deuterium": 20000},
        "build_time": 420,
        "requirements": {"shipyard": 8, "weaponsTechnology": 5}
    },
    
    # ===== CRUISERS (14-28) =====
    "sf_014": {
        "id": "sf_014",
        "name": "Valiant Light Cruiser",
        "class": "cruiser",
        "subclass": "light_cruiser",
        "type": "combat",
        "subtype": "raider",
        "tier": 3,
        "stats": {
            "hull": 4000,
            "health": 4000,
            "armor": 800,
            "armor_type": "composite",
            "shields": 1200,
            "shield_type": "adaptive",
            "weapons": 800,
            "weapon_type": "plasma",
            "power": 1000,
            "engine": 250,
            "engine_type": "antimatter",
            "speed": 60,
            "maneuverability": 40,
            "cargo": 800,
            "fuel": 1500,
            "crew": 350
        },
        "attributes": {
            "attack": 1000,
            "defense": 700,
            "accuracy": 0.80,
            "evasion": 0.10,
            "critical_chance": 0.08,
            "critical_damage": 1.6
        },
        "sub_attributes": {
            "sensor_range": 500,
            "stealth": 0.05,
            "repair_rate": 0.05,
            "morale_bonus": 25
        },
        "cost": {"metal": 100000, "crystal": 70000, "deuterium": 30000},
        "build_time": 600,
        "requirements": {"shipyard": 8}
    },
    "sf_015": {
        "id": "sf_015",
        "name": "Vindicator Heavy Cruiser",
        "class": "cruiser",
        "subclass": "heavy_cruiser",
        "type": "combat",
        "subtype": "assault",
        "tier": 4,
        "stats": {
            "hull": 6000,
            "health": 6000,
            "armor": 1200,
            "armor_type": "heavy",
            "shields": 1800,
            "shield_type": "ablative",
            "weapons": 1200,
            "weapon_type": "gauss",
            "power": 1500,
            "engine": 220,
            "engine_type": "antimatter",
            "speed": 50,
            "maneuverability": 30,
            "cargo": 1200,
            "fuel": 2000,
            "crew": 500
        },
        "attributes": {
            "attack": 1500,
            "defense": 1000,
            "accuracy": 0.82,
            "evasion": 0.08,
            "critical_chance": 0.10,
            "critical_damage": 1.8
        },
        "sub_attributes": {
            "sensor_range": 600,
            "stealth": 0.02,
            "repair_rate": 0.04,
            "morale_bonus": 30
        },
        "cost": {"metal": 150000, "crystal": 100000, "deuterium": 50000},
        "build_time": 900,
        "requirements": {"shipyard": 9, "armorTechnology": 5}
    },
    "sf_016": {
        "id": "sf_016",
        "name": "Annihilator Battle Cruiser",
        "class": "cruiser",
        "subclass": "battle_cruiser",
        "type": "combat",
        "subtype": "assault",
        "tier": 4,
        "stats": {
            "hull": 8000,
            "health": 8000,
            "armor": 1600,
            "armor_type": "nanite",
            "shields": 2500,
            "shield_type": "quantum",
            "weapons": 1800,
            "weapon_type": "beam",
            "power": 2000,
            "engine": 200,
            "engine_type": "warp",
            "speed": 45,
            "maneuverability": 25,
            "cargo": 1500,
            "fuel": 2500,
            "crew": 650
        },
        "attributes": {
            "attack": 2200,
            "defense": 1400,
            "accuracy": 0.85,
            "evasion": 0.05,
            "critical_chance": 0.12,
            "critical_damage": 2.0
        },
        "sub_attributes": {
            "sensor_range": 700,
            "stealth": 0.01,
            "repair_rate": 0.06,
            "morale_bonus": 40
        },
        "cost": {"metal": 200000, "crystal": 150000, "deuterium": 80000},
        "build_time": 1200,
        "requirements": {"shipyard": 10, "hyperspaceTechnology": 3}
    },
    
    # ===== BATTLESHIPS (17-36) =====
    "sf_017": {
        "id": "sf_017",
        "name": "Colossus Battleship",
        "class": "battleship",
        "subclass": "dreadnought",
        "type": "combat",
        "subtype": "assault",
        "tier": 5,
        "stats": {
            "hull": 15000,
            "health": 15000,
            "armor": 3000,
            "armor_type": "nanite",
            "shields": 5000,
            "shield_type": "quantum",
            "weapons": 3500,
            "weapon_type": "graviton",
            "power": 4000,
            "engine": 180,
            "engine_type": "warp",
            "speed": 35,
            "maneuverability": 15,
            "cargo": 3000,
            "fuel": 5000,
            "crew": 1500
        },
        "attributes": {
            "attack": 4500,
            "defense": 2800,
            "accuracy": 0.80,
            "evasion": 0.03,
            "critical_chance": 0.10,
            "critical_damage": 2.2
        },
        "sub_attributes": {
            "sensor_range": 1000,
            "stealth": 0.00,
            "repair_rate": 0.05,
            "morale_bonus": 50
        },
        "cost": {"metal": 500000, "crystal": 350000, "deuterium": 150000},
        "build_time": 2400,
        "requirements": {"shipyard": 12, "weaponsTechnology": 8}
    },
    "sf_018": {
        "id": "sf_018",
        "name": "Titan Super Battleship",
        "class": "battleship",
        "subclass": "super_battleship",
        "type": "combat",
        "subtype": "siege",
        "tier": 6,
        "stats": {
            "hull": 25000,
            "health": 25000,
            "armor": 5000,
            "armor_type": "nanite",
            "shields": 8000,
            "shield_type": "quantum",
            "weapons": 6000,
            "weapon_type": "antimatter",
            "power": 7000,
            "engine": 150,
            "engine_type": "hyperdrive",
            "speed": 25,
            "maneuverability": 10,
            "cargo": 5000,
            "fuel": 8000,
            "crew": 2500
        },
        "attributes": {
            "attack": 8000,
            "defense": 5000,
            "accuracy": 0.78,
            "evasion": 0.02,
            "critical_chance": 0.12,
            "critical_damage": 2.5
        },
        "sub_attributes": {
            "sensor_range": 1500,
            "stealth": 0.00,
            "repair_rate": 0.04,
            "morale_bonus": 75
        },
        "cost": {"metal": 1000000, "crystal": 700000, "deuterium": 300000},
        "build_time": 4800,
        "requirements": {"shipyard": 14, "gravitonTechnology": 1}
    },
    
    # ===== CARRIERS (19-33) =====
    "sf_019": {
        "id": "sf_019",
        "name": "Harbinger Fleet Carrier",
        "class": "carrier",
        "subclass": "fleet_carrier",
        "type": "carrier",
        "subtype": "fighter_carrier",
        "tier": 4,
        "stats": {
            "hull": 12000,
            "health": 12000,
            "armor": 2000,
            "armor_type": "composite",
            "shields": 4000,
            "shield_type": "adaptive",
            "weapons": 1500,
            "weapon_type": "pulse",
            "power": 5000,
            "engine": 160,
            "engine_type": "warp",
            "speed": 30,
            "maneuverability": 12,
            "cargo": 8000,
            "fuel": 6000,
            "crew": 3000,
            "hangar_capacity": 100
        },
        "attributes": {
            "attack": 2000,
            "defense": 2500,
            "accuracy": 0.75,
            "evasion": 0.02,
            "critical_chance": 0.05,
            "critical_damage": 1.5
        },
        "sub_attributes": {
            "sensor_range": 2000,
            "stealth": 0.00,
            "repair_rate": 0.08,
            "morale_bonus": 60,
            "fighter_bonus": 0.20
        },
        "cost": {"metal": 400000, "crystal": 300000, "deuterium": 120000},
        "build_time": 3600,
        "requirements": {"shipyard": 11}
    },
    "sf_020": {
        "id": "sf_020",
        "name": "Overlord Supercarrier",
        "class": "carrier",
        "subclass": "supercarrier",
        "type": "carrier",
        "subtype": "assault_carrier",
        "tier": 5,
        "stats": {
            "hull": 20000,
            "health": 20000,
            "armor": 3500,
            "armor_type": "nanite",
            "shields": 7000,
            "shield_type": "quantum",
            "weapons": 2500,
            "weapon_type": "beam",
            "power": 8000,
            "engine": 140,
            "engine_type": "hyperdrive",
            "speed": 25,
            "maneuverability": 8,
            "cargo": 15000,
            "fuel": 10000,
            "crew": 5000,
            "hangar_capacity": 250
        },
        "attributes": {
            "attack": 3500,
            "defense": 4500,
            "accuracy": 0.78,
            "evasion": 0.01,
            "critical_chance": 0.08,
            "critical_damage": 1.8
        },
        "sub_attributes": {
            "sensor_range": 3000,
            "stealth": 0.00,
            "repair_rate": 0.10,
            "morale_bonus": 80,
            "fighter_bonus": 0.35
        },
        "cost": {"metal": 800000, "crystal": 600000, "deuterium": 250000},
        "build_time": 7200,
        "requirements": {"shipyard": 13, "computerTechnology": 8}
    },
    
    # ===== SUPPORT SHIPS (21-35) =====
    "sf_021": {
        "id": "sf_021",
        "name": "Hauler Transport",
        "class": "support",
        "subclass": "transport",
        "type": "transport",
        "subtype": "cargo",
        "tier": 1,
        "stats": {
            "hull": 800,
            "health": 800,
            "armor": 100,
            "armor_type": "light",
            "shields": 200,
            "shield_type": "basic",
            "weapons": 20,
            "weapon_type": "laser",
            "power": 150,
            "engine": 100,
            "engine_type": "ion",
            "speed": 60,
            "maneuverability": 30,
            "cargo": 5000,
            "fuel": 400,
            "crew": 20
        },
        "attributes": {
            "attack": 30,
            "defense": 100,
            "accuracy": 0.60,
            "evasion": 0.05,
            "critical_chance": 0.02,
            "critical_damage": 1.2
        },
        "sub_attributes": {
            "sensor_range": 100,
            "stealth": 0.05,
            "repair_rate": 0.02,
            "morale_bonus": 0
        },
        "cost": {"metal": 6000, "crystal": 6000, "deuterium": 0},
        "build_time": 40,
        "requirements": {"shipyard": 2}
    },
    "sf_022": {
        "id": "sf_022",
        "name": "Mammoth Heavy Transport",
        "class": "support",
        "subclass": "transport",
        "type": "transport",
        "subtype": "cargo",
        "tier": 2,
        "stats": {
            "hull": 1500,
            "health": 1500,
            "armor": 200,
            "armor_type": "standard",
            "shields": 400,
            "shield_type": "deflector",
            "weapons": 40,
            "weapon_type": "laser",
            "power": 300,
            "engine": 120,
            "engine_type": "fusion",
            "speed": 50,
            "maneuverability": 20,
            "cargo": 25000,
            "fuel": 800,
            "crew": 50
        },
        "attributes": {
            "attack": 50,
            "defense": 200,
            "accuracy": 0.55,
            "evasion": 0.03,
            "critical_chance": 0.01,
            "critical_damage": 1.1
        },
        "sub_attributes": {
            "sensor_range": 150,
            "stealth": 0.02,
            "repair_rate": 0.03,
            "morale_bonus": 5
        },
        "cost": {"metal": 18000, "crystal": 18000, "deuterium": 3000},
        "build_time": 120,
        "requirements": {"shipyard": 4}
    },
    "sf_023": {
        "id": "sf_023",
        "name": "Phoenix Colony Ship",
        "class": "support",
        "subclass": "transport",
        "type": "transport",
        "subtype": "colony",
        "tier": 3,
        "stats": {
            "hull": 3000,
            "health": 3000,
            "armor": 400,
            "armor_type": "composite",
            "shields": 800,
            "shield_type": "adaptive",
            "weapons": 100,
            "weapon_type": "laser",
            "power": 600,
            "engine": 150,
            "engine_type": "warp",
            "speed": 40,
            "maneuverability": 15,
            "cargo": 10000,
            "fuel": 1500,
            "crew": 500,
            "colonists": 10000
        },
        "attributes": {
            "attack": 100,
            "defense": 400,
            "accuracy": 0.65,
            "evasion": 0.02,
            "critical_chance": 0.03,
            "critical_damage": 1.3
        },
        "sub_attributes": {
            "sensor_range": 300,
            "stealth": 0.01,
            "repair_rate": 0.05,
            "morale_bonus": 20
        },
        "cost": {"metal": 30000, "crystal": 60000, "deuterium": 30000},
        "build_time": 600,
        "requirements": {"shipyard": 6, "impulseDrive": 3}
    },
    "sf_024": {
        "id": "sf_024",
        "name": "Salvager Recycler",
        "class": "support",
        "subclass": "repair_ship",
        "type": "mining",
        "subtype": "salvage",
        "tier": 2,
        "stats": {
            "hull": 1600,
            "health": 1600,
            "armor": 250,
            "armor_type": "standard",
            "shields": 300,
            "shield_type": "basic",
            "weapons": 25,
            "weapon_type": "laser",
            "power": 250,
            "engine": 100,
            "engine_type": "ion",
            "speed": 45,
            "maneuverability": 25,
            "cargo": 20000,
            "fuel": 600,
            "crew": 30
        },
        "attributes": {
            "attack": 30,
            "defense": 150,
            "accuracy": 0.50,
            "evasion": 0.05,
            "critical_chance": 0.01,
            "critical_damage": 1.0
        },
        "sub_attributes": {
            "sensor_range": 200,
            "stealth": 0.03,
            "repair_rate": 0.08,
            "morale_bonus": 0,
            "salvage_efficiency": 0.50
        },
        "cost": {"metal": 30000, "crystal": 18000, "deuterium": 6000},
        "build_time": 180,
        "requirements": {"shipyard": 4, "combustionDrive": 2}
    },
    
    # ===== SCIENCE SHIPS (25-38) =====
    "sf_025": {
        "id": "sf_025",
        "name": "Pioneer Explorer",
        "class": "science",
        "subclass": "explorer",
        "type": "science",
        "subtype": "explorer",
        "tier": 2,
        "stats": {
            "hull": 600,
            "health": 600,
            "armor": 80,
            "armor_type": "light",
            "shields": 300,
            "shield_type": "deflector",
            "weapons": 50,
            "weapon_type": "laser",
            "power": 400,
            "engine": 200,
            "engine_type": "warp",
            "speed": 120,
            "maneuverability": 60,
            "cargo": 300,
            "fuel": 500,
            "crew": 60
        },
        "attributes": {
            "attack": 60,
            "defense": 150,
            "accuracy": 0.70,
            "evasion": 0.20,
            "critical_chance": 0.05,
            "critical_damage": 1.2
        },
        "sub_attributes": {
            "sensor_range": 1000,
            "stealth": 0.15,
            "repair_rate": 0.04,
            "morale_bonus": 10,
            "discovery_bonus": 0.25
        },
        "cost": {"metal": 20000, "crystal": 35000, "deuterium": 15000},
        "build_time": 300,
        "requirements": {"shipyard": 5, "astrophysics": 2}
    },
    "sf_026": {
        "id": "sf_026",
        "name": "Seeker Probe Carrier",
        "class": "science",
        "subclass": "probe_launcher",
        "type": "science",
        "subtype": "probe_launcher",
        "tier": 1,
        "stats": {
            "hull": 200,
            "health": 200,
            "armor": 20,
            "armor_type": "light",
            "shields": 50,
            "shield_type": "basic",
            "weapons": 5,
            "weapon_type": "laser",
            "power": 100,
            "engine": 150,
            "engine_type": "ion",
            "speed": 200,
            "maneuverability": 80,
            "cargo": 50,
            "fuel": 200,
            "crew": 1
        },
        "attributes": {
            "attack": 5,
            "defense": 20,
            "accuracy": 0.60,
            "evasion": 0.50,
            "critical_chance": 0.01,
            "critical_damage": 1.0
        },
        "sub_attributes": {
            "sensor_range": 2000,
            "stealth": 0.40,
            "repair_rate": 0.01,
            "morale_bonus": 0
        },
        "cost": {"metal": 0, "crystal": 1000, "deuterium": 0},
        "build_time": 10,
        "requirements": {"shipyard": 1}
    },
    
    # ===== MINING SHIPS (27-40) =====
    "sf_027": {
        "id": "sf_027",
        "name": "Prospector Asteroid Miner",
        "class": "mining",
        "subclass": "asteroid_miner",
        "type": "mining",
        "subtype": "asteroid",
        "tier": 2,
        "stats": {
            "hull": 1200,
            "health": 1200,
            "armor": 200,
            "armor_type": "heavy",
            "shields": 250,
            "shield_type": "basic",
            "weapons": 30,
            "weapon_type": "laser",
            "power": 350,
            "engine": 80,
            "engine_type": "ion",
            "speed": 40,
            "maneuverability": 20,
            "cargo": 15000,
            "fuel": 500,
            "crew": 40
        },
        "attributes": {
            "attack": 40,
            "defense": 200,
            "accuracy": 0.50,
            "evasion": 0.02,
            "critical_chance": 0.01,
            "critical_damage": 1.0
        },
        "sub_attributes": {
            "sensor_range": 150,
            "stealth": 0.01,
            "repair_rate": 0.03,
            "morale_bonus": 5,
            "mining_efficiency": 1.5
        },
        "cost": {"metal": 25000, "crystal": 15000, "deuterium": 5000},
        "build_time": 200,
        "requirements": {"shipyard": 4}
    },
    "sf_028": {
        "id": "sf_028",
        "name": "Nebula Gas Harvester",
        "class": "mining",
        "subclass": "gas_harvester",
        "type": "mining",
        "subtype": "gas",
        "tier": 3,
        "stats": {
            "hull": 2000,
            "health": 2000,
            "armor": 300,
            "armor_type": "composite",
            "shields": 500,
            "shield_type": "deflector",
            "weapons": 50,
            "weapon_type": "laser",
            "power": 600,
            "engine": 100,
            "engine_type": "fusion",
            "speed": 35,
            "maneuverability": 15,
            "cargo": 30000,
            "fuel": 800,
            "crew": 80
        },
        "attributes": {
            "attack": 60,
            "defense": 300,
            "accuracy": 0.55,
            "evasion": 0.01,
            "critical_chance": 0.02,
            "critical_damage": 1.1
        },
        "sub_attributes": {
            "sensor_range": 200,
            "stealth": 0.00,
            "repair_rate": 0.04,
            "morale_bonus": 10,
            "deuterium_bonus": 2.0
        },
        "cost": {"metal": 40000, "crystal": 30000, "deuterium": 10000},
        "build_time": 360,
        "requirements": {"shipyard": 6, "energyTechnology": 4}
    },
    
    # ===== COMMAND SHIPS (29-42) =====
    "sf_029": {
        "id": "sf_029",
        "name": "Sovereign Command Ship",
        "class": "command",
        "subclass": "command_ship",
        "type": "support",
        "subtype": "command",
        "tier": 4,
        "stats": {
            "hull": 10000,
            "health": 10000,
            "armor": 2000,
            "armor_type": "nanite",
            "shields": 5000,
            "shield_type": "quantum",
            "weapons": 1500,
            "weapon_type": "beam",
            "power": 4000,
            "engine": 120,
            "engine_type": "warp",
            "speed": 40,
            "maneuverability": 15,
            "cargo": 5000,
            "fuel": 4000,
            "crew": 1000
        },
        "attributes": {
            "attack": 2000,
            "defense": 3000,
            "accuracy": 0.80,
            "evasion": 0.03,
            "critical_chance": 0.08,
            "critical_damage": 1.6
        },
        "sub_attributes": {
            "sensor_range": 3000,
            "stealth": 0.00,
            "repair_rate": 0.08,
            "morale_bonus": 100,
            "fleet_bonus": 0.15
        },
        "cost": {"metal": 350000, "crystal": 250000, "deuterium": 100000},
        "build_time": 3000,
        "requirements": {"shipyard": 10, "computerTechnology": 6}
    },
    "sf_030": {
        "id": "sf_030",
        "name": "Emperor Flagship",
        "class": "command",
        "subclass": "flagship",
        "type": "combat",
        "subtype": "assault",
        "tier": 5,
        "stats": {
            "hull": 18000,
            "health": 18000,
            "armor": 4000,
            "armor_type": "nanite",
            "shields": 8000,
            "shield_type": "quantum",
            "weapons": 3000,
            "weapon_type": "graviton",
            "power": 6000,
            "engine": 150,
            "engine_type": "hyperdrive",
            "speed": 35,
            "maneuverability": 12,
            "cargo": 8000,
            "fuel": 6000,
            "crew": 1800
        },
        "attributes": {
            "attack": 4000,
            "defense": 5000,
            "accuracy": 0.85,
            "evasion": 0.02,
            "critical_chance": 0.12,
            "critical_damage": 2.0
        },
        "sub_attributes": {
            "sensor_range": 4000,
            "stealth": 0.00,
            "repair_rate": 0.10,
            "morale_bonus": 150,
            "fleet_bonus": 0.25
        },
        "cost": {"metal": 600000, "crystal": 450000, "deuterium": 200000},
        "build_time": 5400,
        "requirements": {"shipyard": 12, "computerTechnology": 10}
    }
}

# Add remaining ships (31-90) with similar detailed structure
# I'll add more key ships and then generate the rest programmatically

ADDITIONAL_STARSHIPS = {}

# Generate additional ships (31-90)
ship_templates = [
    # More Fighters
    ("sf_031", "Fury Advanced Fighter", "fighter", "strike_fighter", "combat", "assault", 3),
    ("sf_032", "Eclipse Dark Fighter", "fighter", "stealth_fighter", "stealth", "infiltrator", 4),
    ("sf_033", "Storm Heavy Bomber", "fighter", "bomber_fighter", "artillery", "siege_ship", 3),
    ("sf_034", "Razor Interceptor Elite", "fighter", "interceptor", "combat", "raider", 4),
    ("sf_035", "Spectre Ghost Fighter", "fighter", "stealth_fighter", "stealth", "sensor_ghost", 5),
    
    # More Corvettes
    ("sf_036", "Vanguard Combat Corvette", "corvette", "gunship", "combat", "assault", 3),
    ("sf_037", "Hunter Pursuit Corvette", "corvette", "patrol_corvette", "combat", "raider", 3),
    ("sf_038", "Storm Assault Corvette", "corvette", "missile_corvette", "artillery", "fleet_support", 4),
    
    # More Frigates
    ("sf_039", "Defender Shield Frigate", "frigate", "support_frigate", "support", "repair", 3),
    ("sf_040", "Striker Attack Frigate", "frigate", "assault_frigate", "combat", "assault", 4),
    ("sf_041", "Phantom Infiltration Frigate", "frigate", "stealth_frigate", "stealth", "cloaked", 5),
    
    # More Destroyers
    ("sf_042", "Thunder Assault Destroyer", "destroyer", "fleet_destroyer", "combat", "assault", 4),
    ("sf_043", "Havoc Bombardment Destroyer", "destroyer", "missile_destroyer", "artillery", "planetary_bombardment", 5),
    ("sf_044", "Sentinel Escort Destroyer", "destroyer", "escort_destroyer", "support", "command", 4),
    
    # More Cruisers
    ("sf_045", "Warlord Strike Cruiser", "cruiser", "strike_cruiser", "combat", "raider", 5),
    ("sf_046", "Guardian Defense Cruiser", "cruiser", "heavy_cruiser", "combat", "defensive", 5),
    ("sf_047", "Dominator Command Cruiser", "cruiser", "battle_cruiser", "support", "command", 6),
    
    # More Battleships
    ("sf_048", "Leviathan Siege Battleship", "battleship", "assault_battleship", "artillery", "siege", 6),
    ("sf_049", "Behemoth War Battleship", "battleship", "dreadnought", "combat", "assault", 6),
    ("sf_050", "Apocalypse Dreadnought", "battleship", "super_battleship", "superweapon", "world_cracker", 7),
    
    # More Carriers
    ("sf_051", "Genesis Drone Carrier", "carrier", "escort_carrier", "carrier", "drone_carrier", 4),
    ("sf_052", "Armada Battle Carrier", "carrier", "fleet_carrier", "carrier", "assault_carrier", 5),
    ("sf_053", "Omega Supreme Carrier", "carrier", "supercarrier", "carrier", "fighter_carrier", 6),
    
    # More Support
    ("sf_054", "Lifeline Hospital Ship", "support", "hospital_ship", "support", "medical", 3),
    ("sf_055", "Forge Repair Ship", "support", "repair_ship", "support", "repair", 3),
    ("sf_056", "Atlas Super Transport", "support", "transport", "transport", "cargo", 4),
    
    # More Science
    ("sf_057", "Discovery Research Vessel", "science", "research_vessel", "science", "research", 3),
    ("sf_058", "Voyager Deep Space Explorer", "science", "explorer", "science", "explorer", 4),
    ("sf_059", "Oracle Survey Ship", "science", "survey_ship", "science", "survey", 3),
    
    # More Mining
    ("sf_060", "Titan Deep Core Miner", "mining", "deep_core_miner", "mining", "asteroid", 4),
    
    # Titans
    ("sf_061", "Ragnarok Titan", "titan", "titan_class", "superweapon", "death_star", 8),
    ("sf_062", "Armageddon Leviathan", "titan", "leviathan", "superweapon", "star_killer", 9),
    ("sf_063", "Extinction World Devastator", "titan", "world_devastator", "superweapon", "world_cracker", 10),
    
    # Special Ships
    ("sf_064", "Chrono Time Ship", "science", "research_vessel", "special", "experimental", 7),
    ("sf_065", "Void Walker", "science", "explorer", "special", "alien", 8),
    ("sf_066", "Dimensional Shifter", "science", "research_vessel", "special", "prototype", 9),
    
    # Hybrid Ships
    ("sf_067", "Versatile Combat Carrier", "carrier", "escort_carrier", "hybrid", "combat_carrier", 5),
    ("sf_068", "Armed Merchant", "support", "transport", "hybrid", "armed_transport", 3),
    ("sf_069", "Explorer Gunship", "corvette", "gunship", "hybrid", "exploration_combat", 4),
    
    # Diplomatic Ships
    ("sf_070", "Ambassador Embassy Ship", "support", "transport", "diplomatic", "embassy", 4),
    ("sf_071", "Herald Courier", "corvette", "patrol_corvette", "diplomatic", "courier", 2),
    
    # Additional Combat Ships
    ("sf_072", "Predator Hunter-Killer", "destroyer", "fleet_destroyer", "combat", "raider", 5),
    ("sf_073", "Reaper Death Cruiser", "cruiser", "battle_cruiser", "combat", "assault", 6),
    ("sf_074", "Nemesis Vengeance Ship", "battleship", "dreadnought", "combat", "siege", 7),
    ("sf_075", "Juggernaut Assault Platform", "battleship", "super_battleship", "artillery", "planetary_bombardment", 8),
    
    # Additional Support Ships
    ("sf_076", "Sanctuary Refugee Ship", "support", "transport", "transport", "refugee", 3),
    ("sf_077", "Prometheus Tanker", "support", "tanker", "support", "resupply", 2),
    ("sf_078", "Nexus Command Hub", "command", "mobile_headquarters", "support", "command", 6),
    
    # Additional Stealth Ships
    ("sf_079", "Wraith Shadow Cruiser", "cruiser", "light_cruiser", "stealth", "cloaked", 6),
    ("sf_080", "Specter Infiltrator", "frigate", "stealth_frigate", "stealth", "sensor_ghost", 5),
    
    # Additional Artillery Ships
    ("sf_081", "Devastator Siege Cruiser", "cruiser", "heavy_cruiser", "artillery", "siege_ship", 6),
    ("sf_082", "Annihilator Bombardment Ship", "battleship", "assault_battleship", "artillery", "planetary_bombardment", 7),
    
    # Elite Variants
    ("sf_083", "Viper Mk II Elite", "fighter", "interceptor", "combat", "assault", 4),
    ("sf_084", "Tempest Mk II Elite", "destroyer", "fleet_destroyer", "combat", "assault", 5),
    ("sf_085", "Colossus Mk II Elite", "battleship", "dreadnought", "combat", "assault", 7),
    
    # Ancient/Alien Ships
    ("sf_086", "Precursor Artifact Ship", "science", "research_vessel", "special", "ancient", 10),
    ("sf_087", "Xeno Hiveship", "carrier", "supercarrier", "special", "alien", 9),
    ("sf_088", "Elder Guardian", "battleship", "super_battleship", "special", "ancient", 10),
    
    # Ultimate Ships
    ("sf_089", "Galaxy Destroyer", "titan", "world_devastator", "superweapon", "star_killer", 10),
    ("sf_090", "Universe Bringer", "titan", "leviathan", "superweapon", "death_star", 10)
]

def generate_ship_stats(tier: int, ship_class: str, ship_type: str) -> dict:
    """Generate stats based on tier and class"""
    base_multiplier = 1.5 ** (tier - 1)
    
    class_mods = {
        "fighter": {"hull": 100, "weapons": 50, "speed": 150, "crew": 1},
        "corvette": {"hull": 500, "weapons": 150, "speed": 100, "crew": 30},
        "frigate": {"hull": 1200, "weapons": 300, "speed": 80, "crew": 100},
        "destroyer": {"hull": 2500, "weapons": 600, "speed": 70, "crew": 200},
        "cruiser": {"hull": 5000, "weapons": 1000, "speed": 55, "crew": 400},
        "battleship": {"hull": 15000, "weapons": 3000, "speed": 35, "crew": 1500},
        "carrier": {"hull": 12000, "weapons": 1500, "speed": 30, "crew": 3000},
        "support": {"hull": 1000, "weapons": 30, "speed": 50, "crew": 30},
        "science": {"hull": 600, "weapons": 50, "speed": 100, "crew": 60},
        "mining": {"hull": 1500, "weapons": 40, "speed": 40, "crew": 50},
        "command": {"hull": 10000, "weapons": 1500, "speed": 40, "crew": 1000},
        "titan": {"hull": 100000, "weapons": 50000, "speed": 15, "crew": 20000}
    }
    
    base = class_mods.get(ship_class, class_mods["frigate"])
    
    return {
        "hull": int(base["hull"] * base_multiplier),
        "health": int(base["hull"] * base_multiplier),
        "armor": int(base["hull"] * 0.2 * base_multiplier),
        "shields": int(base["hull"] * 0.3 * base_multiplier),
        "weapons": int(base["weapons"] * base_multiplier),
        "power": int(base["weapons"] * 1.5 * base_multiplier),
        "engine": int(100 * base_multiplier),
        "speed": base["speed"],
        "cargo": int(base["hull"] * 0.5),
        "fuel": int(base["hull"] * 0.3),
        "crew": base["crew"]
    }

# Generate additional ships
for template in ship_templates:
    ship_id, name, ship_class, subclass, ship_type, subtype, tier = template
    stats = generate_ship_stats(tier, ship_class, ship_type)
    
    ADDITIONAL_STARSHIPS[ship_id] = {
        "id": ship_id,
        "name": name,
        "class": ship_class,
        "subclass": subclass,
        "type": ship_type,
        "subtype": subtype,
        "tier": tier,
        "stats": stats,
        "attributes": {
            "attack": int(stats["weapons"] * 1.2),
            "defense": int(stats["hull"] * 0.3),
            "accuracy": 0.75 + (tier * 0.02),
            "evasion": 0.05 + (0.05 if ship_class in ["fighter", "corvette"] else 0),
            "critical_chance": 0.05 + (tier * 0.01),
            "critical_damage": 1.5 + (tier * 0.1)
        },
        "sub_attributes": {
            "sensor_range": 100 * tier,
            "stealth": 0.5 if "stealth" in ship_type.lower() else 0.05,
            "repair_rate": 0.03,
            "morale_bonus": tier * 10
        },
        "cost": {
            "metal": stats["hull"] * 10,
            "crystal": stats["hull"] * 7,
            "deuterium": stats["hull"] * 3
        },
        "build_time": stats["hull"] // 10,
        "requirements": {"shipyard": min(tier + 2, 15)}
    }

# Merge all ships
ALL_STARSHIPS = {**STARSHIPS, **ADDITIONAL_STARSHIPS}


# ==================== MOTHERSHIPS (10 Types) ====================
MOTHERSHIPS = {
    "ms_001": {
        "id": "ms_001",
        "name": "Exodus Ark",
        "class": "mothership",
        "subclass": "colony_ark",
        "type": "transport",
        "subtype": "colony",
        "tier": 8,
        "description": "Massive colony ship capable of sustaining millions",
        "stats": {
            "hull": 500000,
            "health": 500000,
            "armor": 100000,
            "armor_type": "nanite",
            "shields": 200000,
            "shield_type": "quantum",
            "weapons": 50000,
            "weapon_type": "beam",
            "power": 500000,
            "engine": 100,
            "engine_type": "jump",
            "speed": 10,
            "maneuverability": 2,
            "cargo": 1000000,
            "fuel": 500000,
            "crew": 100000,
            "population_capacity": 10000000
        },
        "attributes": {
            "attack": 60000,
            "defense": 300000,
            "accuracy": 0.70,
            "evasion": 0.00,
            "critical_chance": 0.05,
            "critical_damage": 1.5
        },
        "cost": {"metal": 50000000, "crystal": 30000000, "deuterium": 20000000},
        "build_time": 86400,
        "requirements": {"shipyard": 15, "hyperspaceTechnology": 10}
    },
    "ms_002": {
        "id": "ms_002",
        "name": "Fortress Station",
        "class": "mothership",
        "subclass": "battle_station",
        "type": "combat",
        "subtype": "siege",
        "tier": 9,
        "description": "Mobile battle station with devastating firepower",
        "stats": {
            "hull": 1000000,
            "health": 1000000,
            "armor": 250000,
            "armor_type": "nanite",
            "shields": 500000,
            "shield_type": "quantum",
            "weapons": 500000,
            "weapon_type": "antimatter",
            "power": 1000000,
            "engine": 50,
            "engine_type": "jump",
            "speed": 5,
            "maneuverability": 1,
            "cargo": 500000,
            "fuel": 1000000,
            "crew": 50000
        },
        "attributes": {
            "attack": 600000,
            "defense": 500000,
            "accuracy": 0.75,
            "evasion": 0.00,
            "critical_chance": 0.10,
            "critical_damage": 2.0
        },
        "cost": {"metal": 100000000, "crystal": 80000000, "deuterium": 50000000},
        "build_time": 172800,
        "requirements": {"shipyard": 15, "gravitonTechnology": 1}
    },
    "ms_003": {
        "id": "ms_003",
        "name": "Genesis Worldship",
        "class": "mothership",
        "subclass": "worldship",
        "type": "special",
        "subtype": "ancient",
        "tier": 10,
        "description": "An artificial world capable of supporting entire civilizations",
        "stats": {
            "hull": 5000000,
            "health": 5000000,
            "armor": 1000000,
            "armor_type": "nanite",
            "shields": 2000000,
            "shield_type": "quantum",
            "weapons": 1000000,
            "weapon_type": "graviton",
            "power": 5000000,
            "engine": 30,
            "engine_type": "quantum",
            "speed": 2,
            "maneuverability": 0,
            "cargo": 10000000,
            "fuel": 5000000,
            "crew": 1000000,
            "population_capacity": 100000000,
            "has_ecosystem": True,
            "field_count": 10000
        },
        "attributes": {
            "attack": 1500000,
            "defense": 2500000,
            "accuracy": 0.80,
            "evasion": 0.00,
            "critical_chance": 0.15,
            "critical_damage": 2.5
        },
        "cost": {"metal": 1000000000, "crystal": 500000000, "deuterium": 250000000},
        "build_time": 604800,
        "requirements": {"shipyard": 15, "intergalacticResearchNetwork": 1}
    },
    "ms_004": {
        "id": "ms_004",
        "name": "Harbinger Dreadmaw",
        "class": "mothership",
        "subclass": "super_dreadnought",
        "type": "superweapon",
        "subtype": "world_cracker",
        "tier": 10,
        "description": "Planet-destroying superweapon of unimaginable power",
        "stats": {
            "hull": 2000000,
            "health": 2000000,
            "armor": 500000,
            "armor_type": "nanite",
            "shields": 1000000,
            "shield_type": "quantum",
            "weapons": 10000000,
            "weapon_type": "antimatter",
            "power": 10000000,
            "engine": 40,
            "engine_type": "quantum",
            "speed": 3,
            "maneuverability": 1,
            "cargo": 200000,
            "fuel": 2000000,
            "crew": 200000
        },
        "attributes": {
            "attack": 15000000,
            "defense": 1000000,
            "accuracy": 0.85,
            "evasion": 0.00,
            "critical_chance": 0.20,
            "critical_damage": 3.0
        },
        "sub_attributes": {
            "planet_destruction": True,
            "moon_destruction": True
        },
        "cost": {"metal": 500000000, "crystal": 400000000, "deuterium": 200000000},
        "build_time": 432000,
        "requirements": {"shipyard": 15, "gravitonTechnology": 1, "weaponsTechnology": 15}
    },
    "ms_005": {
        "id": "ms_005",
        "name": "Infinity Carrier",
        "class": "mothership",
        "subclass": "mega_carrier",
        "type": "carrier",
        "subtype": "fighter_carrier",
        "tier": 9,
        "description": "Massive carrier capable of deploying thousands of fighters",
        "stats": {
            "hull": 800000,
            "health": 800000,
            "armor": 150000,
            "armor_type": "nanite",
            "shields": 400000,
            "shield_type": "quantum",
            "weapons": 200000,
            "weapon_type": "beam",
            "power": 800000,
            "engine": 60,
            "engine_type": "jump",
            "speed": 8,
            "maneuverability": 2,
            "cargo": 400000,
            "fuel": 600000,
            "crew": 80000,
            "hangar_capacity": 5000
        },
        "attributes": {
            "attack": 300000,
            "defense": 500000,
            "accuracy": 0.75,
            "evasion": 0.00,
            "critical_chance": 0.08,
            "critical_damage": 1.8
        },
        "sub_attributes": {
            "fighter_bonus": 0.50,
            "drone_capacity": 10000
        },
        "cost": {"metal": 80000000, "crystal": 60000000, "deuterium": 30000000},
        "build_time": 259200,
        "requirements": {"shipyard": 15, "computerTechnology": 12}
    },
    "ms_006": {
        "id": "ms_006",
        "name": "Nexus Command Citadel",
        "class": "mothership",
        "subclass": "command_citadel",
        "type": "support",
        "subtype": "command",
        "tier": 8,
        "description": "Ultimate fleet command and coordination platform",
        "stats": {
            "hull": 600000,
            "health": 600000,
            "armor": 120000,
            "armor_type": "nanite",
            "shields": 350000,
            "shield_type": "quantum",
            "weapons": 150000,
            "weapon_type": "beam",
            "power": 700000,
            "engine": 70,
            "engine_type": "hyperdrive",
            "speed": 12,
            "maneuverability": 3,
            "cargo": 300000,
            "fuel": 400000,
            "crew": 50000
        },
        "attributes": {
            "attack": 200000,
            "defense": 400000,
            "accuracy": 0.80,
            "evasion": 0.01,
            "critical_chance": 0.10,
            "critical_damage": 1.6
        },
        "sub_attributes": {
            "fleet_bonus": 0.50,
            "sensor_range": 50000,
            "morale_bonus": 200,
            "coordination_bonus": 0.30
        },
        "cost": {"metal": 60000000, "crystal": 50000000, "deuterium": 25000000},
        "build_time": 216000,
        "requirements": {"shipyard": 14, "computerTechnology": 15}
    },
    "ms_007": {
        "id": "ms_007",
        "name": "Prometheus Forge Ship",
        "class": "mothership",
        "subclass": "factory_ship",
        "type": "support",
        "subtype": "repair",
        "tier": 8,
        "description": "Mobile shipyard and repair facility",
        "stats": {
            "hull": 400000,
            "health": 400000,
            "armor": 80000,
            "armor_type": "composite",
            "shields": 200000,
            "shield_type": "adaptive",
            "weapons": 50000,
            "weapon_type": "laser",
            "power": 600000,
            "engine": 50,
            "engine_type": "warp",
            "speed": 15,
            "maneuverability": 4,
            "cargo": 1000000,
            "fuel": 300000,
            "crew": 30000
        },
        "attributes": {
            "attack": 60000,
            "defense": 300000,
            "accuracy": 0.65,
            "evasion": 0.02,
            "critical_chance": 0.05,
            "critical_damage": 1.3
        },
        "sub_attributes": {
            "repair_rate": 0.50,
            "build_speed": 2.0,
            "resource_efficiency": 0.20
        },
        "cost": {"metal": 40000000, "crystal": 35000000, "deuterium": 15000000},
        "build_time": 172800,
        "requirements": {"shipyard": 13, "naniteFactory": 1}
    },
    "ms_008": {
        "id": "ms_008",
        "name": "Harvester Megaminer",
        "class": "mothership",
        "subclass": "mining_platform",
        "type": "mining",
        "subtype": "asteroid",
        "tier": 7,
        "description": "Massive mining platform for asteroid belt exploitation",
        "stats": {
            "hull": 300000,
            "health": 300000,
            "armor": 60000,
            "armor_type": "heavy",
            "shields": 100000,
            "shield_type": "deflector",
            "weapons": 20000,
            "weapon_type": "laser",
            "power": 400000,
            "engine": 40,
            "engine_type": "fusion",
            "speed": 10,
            "maneuverability": 2,
            "cargo": 5000000,
            "fuel": 200000,
            "crew": 10000
        },
        "attributes": {
            "attack": 25000,
            "defense": 200000,
            "accuracy": 0.50,
            "evasion": 0.00,
            "critical_chance": 0.02,
            "critical_damage": 1.1
        },
        "sub_attributes": {
            "mining_efficiency": 5.0,
            "processing_rate": 3.0
        },
        "cost": {"metal": 30000000, "crystal": 20000000, "deuterium": 10000000},
        "build_time": 129600,
        "requirements": {"shipyard": 12}
    },
    "ms_009": {
        "id": "ms_009",
        "name": "Sanctum Research Station",
        "class": "mothership",
        "subclass": "research_station",
        "type": "science",
        "subtype": "research",
        "tier": 8,
        "description": "Advanced mobile research facility",
        "stats": {
            "hull": 250000,
            "health": 250000,
            "armor": 50000,
            "armor_type": "composite",
            "shields": 150000,
            "shield_type": "adaptive",
            "weapons": 30000,
            "weapon_type": "ion",
            "power": 500000,
            "engine": 80,
            "engine_type": "warp",
            "speed": 20,
            "maneuverability": 5,
            "cargo": 200000,
            "fuel": 150000,
            "crew": 20000
        },
        "attributes": {
            "attack": 40000,
            "defense": 180000,
            "accuracy": 0.70,
            "evasion": 0.03,
            "critical_chance": 0.08,
            "critical_damage": 1.4
        },
        "sub_attributes": {
            "research_bonus": 1.0,
            "discovery_bonus": 0.50,
            "sensor_range": 20000
        },
        "cost": {"metal": 25000000, "crystal": 40000000, "deuterium": 20000000},
        "build_time": 144000,
        "requirements": {"shipyard": 12, "intergalacticResearchNetwork": 1}
    },
    "ms_010": {
        "id": "ms_010",
        "name": "Dominion Starbase",
        "class": "mothership",
        "subclass": "starbase",
        "type": "hybrid",
        "subtype": "combat_carrier",
        "tier": 9,
        "description": "Multi-purpose mobile starbase",
        "stats": {
            "hull": 700000,
            "health": 700000,
            "armor": 140000,
            "armor_type": "nanite",
            "shields": 350000,
            "shield_type": "quantum",
            "weapons": 250000,
            "weapon_type": "graviton",
            "power": 800000,
            "engine": 60,
            "engine_type": "jump",
            "speed": 8,
            "maneuverability": 2,
            "cargo": 800000,
            "fuel": 500000,
            "crew": 60000,
            "hangar_capacity": 2000,
            "field_count": 500
        },
        "attributes": {
            "attack": 350000,
            "defense": 450000,
            "accuracy": 0.78,
            "evasion": 0.01,
            "critical_chance": 0.12,
            "critical_damage": 1.9
        },
        "sub_attributes": {
            "fleet_bonus": 0.30,
            "repair_rate": 0.20,
            "defense_bonus": 0.25
        },
        "cost": {"metal": 70000000, "crystal": 55000000, "deuterium": 28000000},
        "build_time": 216000,
        "requirements": {"shipyard": 14}
    }
}
