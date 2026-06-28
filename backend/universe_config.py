"""
universe-empire-domions - Commander, Government, Population & Universe Configuration
"""

# ==================== UNIVERSE CONFIGURATION ====================
# 9 Universes with 30 Galaxies each

UNIVERSE_CONFIG = {
    "total_universes": 9,
    "galaxies_per_universe": 30,
    "systems_per_galaxy": 999,
    "positions_per_system": 15,
    "max_players_per_universe": 999999
}

UNIVERSES = {
    "universe_1": {
        "id": 1,
        "name": "Alpha Centauri",
        "description": "The original universe, oldest and most populated",
        "speed_modifier": 1.0,
        "economy_modifier": 1.0,
        "fleet_speed": 1.0,
        "debris_rate": 0.30,
        "created_date": "2020-01-01",
        "status": "active"
    },
    "universe_2": {
        "id": 2,
        "name": "Orion Nebula",
        "description": "Fast-paced universe with accelerated gameplay",
        "speed_modifier": 2.0,
        "economy_modifier": 2.0,
        "fleet_speed": 2.0,
        "debris_rate": 0.40,
        "created_date": "2021-01-01",
        "status": "active"
    },
    "universe_3": {
        "id": 3,
        "name": "Andromeda",
        "description": "Balanced universe for strategic players",
        "speed_modifier": 1.5,
        "economy_modifier": 1.5,
        "fleet_speed": 1.5,
        "debris_rate": 0.35,
        "created_date": "2022-01-01",
        "status": "active"
    },
    "universe_4": {
        "id": 4,
        "name": "Triangulum",
        "description": "Combat-focused universe with enhanced warfare",
        "speed_modifier": 1.0,
        "economy_modifier": 0.8,
        "fleet_speed": 2.5,
        "debris_rate": 0.50,
        "created_date": "2023-01-01",
        "status": "active"
    },
    "universe_5": {
        "id": 5,
        "name": "Sagittarius",
        "description": "Economy-focused universe with rich resources",
        "speed_modifier": 1.0,
        "economy_modifier": 3.0,
        "fleet_speed": 1.0,
        "debris_rate": 0.25,
        "created_date": "2024-01-01",
        "status": "active"
    },
    "universe_6": {
        "id": 6,
        "name": "Cygnus",
        "description": "Exploration universe with more discoveries",
        "speed_modifier": 1.5,
        "economy_modifier": 1.5,
        "fleet_speed": 3.0,
        "debris_rate": 0.30,
        "created_date": "2025-01-01",
        "status": "active"
    },
    "universe_7": {
        "id": 7,
        "name": "Perseus",
        "description": "New player friendly universe",
        "speed_modifier": 3.0,
        "economy_modifier": 3.0,
        "fleet_speed": 2.0,
        "debris_rate": 0.20,
        "created_date": "2025-06-01",
        "status": "active"
    },
    "universe_8": {
        "id": 8,
        "name": "Draco",
        "description": "Hardcore universe with permadeath planets",
        "speed_modifier": 1.0,
        "economy_modifier": 0.5,
        "fleet_speed": 1.0,
        "debris_rate": 0.60,
        "created_date": "2025-09-01",
        "status": "active"
    },
    "universe_9": {
        "id": 9,
        "name": "Phoenix",
        "description": "Newest universe with all latest features",
        "speed_modifier": 2.0,
        "economy_modifier": 2.0,
        "fleet_speed": 2.0,
        "debris_rate": 0.35,
        "created_date": "2026-01-01",
        "status": "active"
    }
}

# Generate 30 galaxies per universe
def generate_galaxies(universe_id: int) -> list:
    galaxy_names = [
        "Core", "Rim", "Expanse", "Frontier", "Nexus", "Vortex",
        "Twilight", "Dawn", "Eclipse", "Zenith", "Nadir", "Apex",
        "Haven", "Wasteland", "Paradise", "Inferno", "Tundra", "Nebula",
        "Cluster", "Void", "Rift", "Gate", "Bastion", "Sanctuary",
        "Dominion", "Empire", "Republic", "Federation", "Coalition", "Alliance"
    ]
    
    galaxies = []
    for i in range(1, 31):
        galaxies.append({
            "id": i,
            "universe_id": universe_id,
            "name": f"{galaxy_names[i-1]} Galaxy",
            "systems": 999,
            "type": "spiral" if i % 3 == 0 else ("elliptical" if i % 3 == 1 else "irregular"),
            "resource_modifier": 0.8 + (i * 0.02),
            "danger_level": min(10, 1 + i // 3)
        })
    return galaxies

GALAXIES_BY_UNIVERSE = {
    f"universe_{u}": generate_galaxies(u) for u in range(1, 10)
}


# ==================== COMMANDER SYSTEM ====================

COMMANDER_CLASSES = {
    "tactician": {
        "name": "Tactician",
        "description": "Master of battlefield strategy",
        "primary_stat": "strategy",
        "subclasses": ["grand_strategist", "fleet_admiral", "siege_master", "defensive_genius"]
    },
    "warrior": {
        "name": "Warrior",
        "description": "Frontline combat specialist",
        "primary_stat": "combat",
        "subclasses": ["berserker", "guardian", "duelist", "warlord"]
    },
    "diplomat": {
        "name": "Diplomat",
        "description": "Master of negotiations and alliances",
        "primary_stat": "charisma",
        "subclasses": ["ambassador", "negotiator", "spy_master", "propagandist"]
    },
    "scientist": {
        "name": "Scientist",
        "description": "Research and technology specialist",
        "primary_stat": "intelligence",
        "subclasses": ["researcher", "inventor", "engineer", "theorist"]
    },
    "economist": {
        "name": "Economist",
        "description": "Resource and trade management expert",
        "primary_stat": "management",
        "subclasses": ["trader", "industrialist", "financier", "logistics_expert"]
    },
    "explorer": {
        "name": "Explorer",
        "description": "Discovery and expansion specialist",
        "primary_stat": "exploration",
        "subclasses": ["pathfinder", "cartographer", "xenologist", "archaeologist"]
    }
}

COMMANDER_STATS = {
    "strategy": {"attack_bonus": 0.02, "defense_bonus": 0.02, "fleet_coordination": 0.01},
    "combat": {"attack_bonus": 0.03, "critical_chance": 0.01, "damage_bonus": 0.02},
    "charisma": {"morale_bonus": 0.02, "trade_bonus": 0.02, "alliance_bonus": 0.02},
    "intelligence": {"research_bonus": 0.03, "tech_cost_reduction": 0.01, "efficiency": 0.02},
    "management": {"resource_bonus": 0.02, "build_speed": 0.02, "cost_reduction": 0.01},
    "exploration": {"discovery_bonus": 0.03, "expedition_bonus": 0.02, "planet_size_bonus": 0.01}
}

COMMANDER_SKILLS = {
    # Combat Skills
    "rapid_fire": {"name": "Rapid Fire", "type": "combat", "effect": {"attack_speed": 0.10}, "max_level": 10},
    "precision_targeting": {"name": "Precision Targeting", "type": "combat", "effect": {"accuracy": 0.05}, "max_level": 10},
    "armor_piercing": {"name": "Armor Piercing", "type": "combat", "effect": {"armor_ignore": 0.10}, "max_level": 10},
    "shield_bypass": {"name": "Shield Bypass", "type": "combat", "effect": {"shield_ignore": 0.08}, "max_level": 10},
    "critical_strike": {"name": "Critical Strike", "type": "combat", "effect": {"critical_damage": 0.15}, "max_level": 10},
    
    # Defense Skills
    "fortification": {"name": "Fortification", "type": "defense", "effect": {"defense_bonus": 0.10}, "max_level": 10},
    "damage_control": {"name": "Damage Control", "type": "defense", "effect": {"repair_rate": 0.05}, "max_level": 10},
    "shield_mastery": {"name": "Shield Mastery", "type": "defense", "effect": {"shield_strength": 0.10}, "max_level": 10},
    "evasive_maneuvers": {"name": "Evasive Maneuvers", "type": "defense", "effect": {"evasion": 0.05}, "max_level": 10},
    
    # Economy Skills
    "efficient_mining": {"name": "Efficient Mining", "type": "economy", "effect": {"metal_production": 0.08}, "max_level": 10},
    "crystal_refinement": {"name": "Crystal Refinement", "type": "economy", "effect": {"crystal_production": 0.08}, "max_level": 10},
    "deuterium_synthesis": {"name": "Deuterium Synthesis", "type": "economy", "effect": {"deuterium_production": 0.08}, "max_level": 10},
    "energy_efficiency": {"name": "Energy Efficiency", "type": "economy", "effect": {"energy_production": 0.10}, "max_level": 10},
    "trade_routes": {"name": "Trade Routes", "type": "economy", "effect": {"trade_bonus": 0.12}, "max_level": 10},
    
    # Research Skills
    "accelerated_research": {"name": "Accelerated Research", "type": "research", "effect": {"research_speed": 0.10}, "max_level": 10},
    "tech_insight": {"name": "Tech Insight", "type": "research", "effect": {"research_cost_reduction": 0.05}, "max_level": 10},
    "innovation": {"name": "Innovation", "type": "research", "effect": {"tech_bonus": 0.08}, "max_level": 10},
    
    # Fleet Skills
    "fleet_logistics": {"name": "Fleet Logistics", "type": "fleet", "effect": {"fleet_speed": 0.08}, "max_level": 10},
    "hangar_efficiency": {"name": "Hangar Efficiency", "type": "fleet", "effect": {"hangar_capacity": 0.10}, "max_level": 10},
    "cargo_optimization": {"name": "Cargo Optimization", "type": "fleet", "effect": {"cargo_capacity": 0.15}, "max_level": 10},
    
    # Exploration Skills
    "pathfinding": {"name": "Pathfinding", "type": "exploration", "effect": {"expedition_success": 0.10}, "max_level": 10},
    "artifact_discovery": {"name": "Artifact Discovery", "type": "exploration", "effect": {"artifact_chance": 0.05}, "max_level": 10},
    "planet_assessment": {"name": "Planet Assessment", "type": "exploration", "effect": {"planet_size_bonus": 0.02}, "max_level": 10}
}

COMMANDER_EQUIPMENT = {
    "tactical_visor": {"name": "Tactical Visor", "slot": "head", "rarity": "common", "bonus": {"accuracy": 0.05}},
    "command_neural_link": {"name": "Command Neural Link", "slot": "head", "rarity": "rare", "bonus": {"fleet_coordination": 0.10}},
    "battle_armor": {"name": "Battle Armor", "slot": "body", "rarity": "common", "bonus": {"defense": 0.05}},
    "stealth_suit": {"name": "Stealth Suit", "slot": "body", "rarity": "rare", "bonus": {"stealth": 0.20}},
    "energy_gauntlets": {"name": "Energy Gauntlets", "slot": "hands", "rarity": "uncommon", "bonus": {"attack": 0.08}},
    "tactical_boots": {"name": "Tactical Boots", "slot": "feet", "rarity": "common", "bonus": {"speed": 0.05}},
    "command_insignia": {"name": "Command Insignia", "slot": "accessory", "rarity": "legendary", "bonus": {"morale": 0.15, "fleet_bonus": 0.10}},
    "ancient_artifact": {"name": "Ancient Artifact", "slot": "accessory", "rarity": "mythic", "bonus": {"all_stats": 0.10}}
}

COMMANDER_RANKS = [
    {"rank": 1, "name": "Ensign", "exp_required": 0, "bonus": 0.00},
    {"rank": 2, "name": "Lieutenant", "exp_required": 1000, "bonus": 0.02},
    {"rank": 3, "name": "Commander", "exp_required": 5000, "bonus": 0.05},
    {"rank": 4, "name": "Captain", "exp_required": 15000, "bonus": 0.08},
    {"rank": 5, "name": "Commodore", "exp_required": 35000, "bonus": 0.12},
    {"rank": 6, "name": "Rear Admiral", "exp_required": 75000, "bonus": 0.16},
    {"rank": 7, "name": "Vice Admiral", "exp_required": 150000, "bonus": 0.20},
    {"rank": 8, "name": "Admiral", "exp_required": 300000, "bonus": 0.25},
    {"rank": 9, "name": "Fleet Admiral", "exp_required": 600000, "bonus": 0.30},
    {"rank": 10, "name": "Grand Admiral", "exp_required": 1200000, "bonus": 0.40}
]


# ==================== SKILLS SYSTEM ====================

SKILLS = {
    # Core Skills
    "gunnery": {
        "name": "Gunnery",
        "description": "Improves turret weapon effectiveness",
        "category": "combat",
        "max_level": 5,
        "base_training_time": 300,  # seconds for level 1
        "attributes": ["perception", "willpower"],
        "effect": {"turret_damage": 0.05}
    },
    "missile_launcher_operation": {
        "name": "Missile Launcher Operation",
        "description": "Improves missile weapon effectiveness",
        "category": "combat",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["perception", "willpower"],
        "effect": {"missile_damage": 0.05}
    },
    "spaceship_command": {
        "name": "Spaceship Command",
        "description": "Allows command of larger ships",
        "category": "navigation",
        "max_level": 5,
        "base_training_time": 240,
        "attributes": ["perception", "charisma"],
        "effect": {"ship_command_slots": 1}
    },
    "navigation": {
        "name": "Navigation",
        "description": "Improves ship velocity and agility",
        "category": "navigation",
        "max_level": 5,
        "base_training_time": 240,
        "attributes": ["intelligence", "perception"],
        "effect": {"velocity_bonus": 0.05}
    },
    "afterburner": {
        "name": "Afterburner",
        "description": "Improves afterburner effectiveness",
        "category": "navigation",
        "max_level": 4,
        "base_training_time": 180,
        "attributes": ["perception", "willpower"],
        "effect": {"afterburner_bonus": 0.10}
    },
    "ewar": {
        "name": "Electronic Warfare",
        "description": "Improves electronic warfare module effectiveness",
        "category": "electronic",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["intelligence", "memory"],
        "effect": {"ewar_strength": 0.05}
    },
    "engineering": {
        "name": "Engineering",
        "description": "Improves capacitor and energy management",
        "category": "electronic",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["intelligence", "memory"],
        "effect": {"capacitor_capacity": 0.05}
    },
    "shield_operation": {
        "name": "Shield Operation",
        "description": "Improves shield resistances and capacity",
        "category": "electronic",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["intelligence", "memory"],
        "effect": {"shield_capacity": 0.05}
    },
    "repair_systems": {
        "name": "Repair Systems",
        "description": "Improves armor repairer effectiveness",
        "category": "electronic",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["intelligence", "memory"],
        "effect": {"armor_repair": 0.05}
    },
    "hull_upgrades": {
        "name": "Hull Upgrades",
        "description": "Improves ship armor and structure",
        "category": "mechanical",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["memory", "willpower"],
        "effect": {"armor_hp": 0.05}
    },
    "rigging": {
        "name": "Rigging",
        "description": "Allows fitting of rig modules",
        "category": "mechanical",
        "max_level": 3,
        "base_training_time": 600,
        "attributes": ["memory", "intelligence"],
        "effect": {"rig_slots": 1}
    },
    "jury_rigging": {
        "name": "Jury Rigging",
        "description": "Improves rig effectiveness",
        "category": "mechanical",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["memory", "intelligence"],
        "effect": {"rig_effectiveness": 0.10}
    },
    "drones": {
        "name": "Drones",
        "description": "Allows operation of combat/utility drones",
        "category": "mechanical",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["memory", "perception"],
        "effect": {"drone_damage": 0.05}
    },
    "mining": {
        "name": "Mining",
        "description": "Improves mining laser effectiveness",
        "category": "industry",
        "max_level": 5,
        "base_training_time": 180,
        "attributes": ["memory", "intelligence"],
        "effect": {"mining_yield": 0.05}
    },
    "industry": {
        "name": "Industry",
        "description": "Improves manufacturing efficiency",
        "category": "industry",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["memory", "charisma"],
        "effect": {"production_efficiency": 0.05}
    },
    "refining": {
        "name": "Refining",
        "description": "Improves ore refining efficiency",
        "category": "industry",
        "max_level": 5,
        "base_training_time": 240,
        "attributes": ["memory", "intelligence"],
        "effect": {"refining_efficiency": 0.05}
    },
    "science": {
        "name": "Science",
        "description": "Improves research effectiveness",
        "category": "science",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["intelligence", "memory"],
        "effect": {"research_speed": 0.05}
    },
    "research": {
        "name": "Research",
        "description": "Allows invention and reverse engineering",
        "category": "science",
        "max_level": 5,
        "base_training_time": 420,
        "attributes": ["intelligence", "memory"],
        "effect": {"invention_chance": 0.05}
    },
    "metallurgy": {
        "name": "Metallurgy",
        "description": "Improves material efficiency",
        "category": "science",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["intelligence", "memory"],
        "effect": {"material_efficiency": 0.05}
    },
    "social": {
        "name": "Social",
        "description": "Improves standings and negotiation",
        "category": "social",
        "max_level": 5,
        "base_training_time": 240,
        "attributes": ["charisma", "intelligence"],
        "effect": {"standing_bonus": 0.05}
    },
    "negotiation": {
        "name": "Negotiation",
        "description": "Improves contract and trade effectiveness",
        "category": "social",
        "max_level": 5,
        "base_training_time": 300,
        "attributes": ["charisma", "willpower"],
        "effect": {"contract_bonus": 0.05}
    },
    "leadership": {
        "name": "Leadership",
        "description": "Improves fleet command effectiveness",
        "category": "social",
        "max_level": 5,
        "base_training_time": 360,
        "attributes": ["charisma", "willpower"],
        "effect": {"fleet_bonus": 0.05}
    }
}

ATTRIBUTES = {
    "intelligence": {"name": "Intelligence", "description": "Affects research and electronic systems"},
    "memory": {"name": "Memory", "description": "Affects skill training speed and capacity"},
    "charisma": {"name": "Charisma", "description": "Affects social interactions and leadership"},
    "perception": {"name": "Perception", "description": "Affects targeting and navigation"},
    "willpower": {"name": "Willpower", "description": "Affects resistance and endurance"}
}


# ==================== SHIP MODULES ====================

SHIP_MODULES = {
    # High Slot Modules
    "small_energy_blaster": {
        "name": "Small Energy Blaster",
        "type": "high",
        "category": "weapon",
        "size": "small",
        "cpu": 10,
        "powergrid": 5,
        "damage": {"em": 4, "thermal": 4},
        "rate_of_fire": 2.5,
        "range": 5000
    },
    "small_railgun": {
        "name": "Small Railgun",
        "type": "high",
        "category": "weapon",
        "size": "small",
        "cpu": 8,
        "powergrid": 6,
        "damage": {"kinetic": 3, "thermal": 3},
        "rate_of_fire": 3.0,
        "range": 8000
    },
    "small_missile_launcher": {
        "name": "Small Missile Launcher",
        "type": "high",
        "category": "weapon",
        "size": "small",
        "cpu": 12,
        "powergrid": 4,
        "damage": {"explosive": 5},
        "rate_of_fire": 2.0,
        "range": 10000
    },
    
    # Mid Slot Modules
    "small_shield_booster": {
        "name": "Small Shield Booster",
        "type": "mid",
        "category": "defense",
        "size": "small",
        "cpu": 6,
        "powergrid": 8,
        "shield_boost": 10,
        "capacitor_use": 5
    },
    "small_armor_repairer": {
        "name": "Small Armor Repairer",
        "type": "mid",
        "category": "defense",
        "size": "small",
        "cpu": 7,
        "powergrid": 9,
        "armor_repair": 8,
        "capacitor_use": 6
    },
    "afterburner": {
        "name": "Afterburner",
        "type": "mid",
        "category": "propulsion",
        "size": "small",
        "cpu": 5,
        "powergrid": 4,
        "velocity_bonus": 0.15,
        "capacitor_use": 3
    },
    "stasis_webifier": {
        "name": "Stasis Webifier",
        "type": "mid",
        "category": "electronic",
        "size": "small",
        "cpu": 10,
        "powergrid": 6,
        "speed_reduction": 0.5,
        "range": 10000
    },
    
    # Low Slot Modules
    "small_energy_burst": {
        "name": "Small Energy Burst",
        "type": "low",
        "category": "electronic",
        "size": "small",
        "cpu": 8,
        "powergrid": 3,
        "capacitor_capacity": 0.1
    },
    "heat_sink": {
        "name": "Heat Sink",
        "type": "low",
        "category": "electronic",
        "size": "small",
        "cpu": 6,
        "powergrid": 4,
        "damage_bonus": 0.1
    },
    "adaptive_nano_plating": {
        "name": "Adaptive Nano Plating",
        "type": "low",
        "category": "defense",
        "size": "small",
        "cpu": 5,
        "powergrid": 7,
        "armor_resistance": {"em": 0.1, "thermal": 0.1, "kinetic": 0.1, "explosive": 0.1}
    },
    
    # Rig Modules
    "small_energy_burst_rig": {
        "name": "Small Energy Burst Rig",
        "type": "rig",
        "category": "electronic",
        "size": "small",
        "calibration": 20,
        "capacitor_capacity": 0.05
    },
    "small_armor_repairer_rig": {
        "name": "Small Armor Repairer Rig",
        "type": "rig",
        "category": "defense",
        "size": "small",
        "calibration": 25,
        "armor_repair": 0.05
    }
}


# ==================== MATERIALS SYSTEM ====================

# Raw Materials (Ores and Minerals)
RAW_MATERIALS = {
    # Veldspar variants
    "veldspar": {
        "name": "Veldspar",
        "type": "ore",
        "rarity": "common",
        "volume": 0.1,
        "refined_materials": {
            "tritanium": 415,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "concentrated_velspar": {
        "name": "Concentrated Veldspar",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 0.1,
        "refined_materials": {
            "tritanium": 436,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "dense_velspar": {
        "name": "Dense Veldspar",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.1,
        "refined_materials": {
            "tritanium": 457,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Scordite variants
    "scordite": {
        "name": "Scordite",
        "type": "ore",
        "rarity": "common",
        "volume": 0.15,
        "refined_materials": {
            "tritanium": 346,
            "pyerite": 173,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "condensed_scordite": {
        "name": "Condensed Scordite",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 0.15,
        "refined_materials": {
            "tritanium": 363,
            "pyerite": 181,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "massive_scordite": {
        "name": "Massive Scordite",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.15,
        "refined_materials": {
            "tritanium": 380,
            "pyerite": 190,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Pyroxeres variants
    "pyroxeres": {
        "name": "Pyroxeres",
        "type": "ore",
        "rarity": "common",
        "volume": 0.3,
        "refined_materials": {
            "tritanium": 351,
            "pyerite": 25,
            "mexallon": 50,
            "isogen": 5,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "solid_pyroxeres": {
        "name": "Solid Pyroxeres",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 0.3,
        "refined_materials": {
            "tritanium": 368,
            "pyerite": 26,
            "mexallon": 52,
            "isogen": 5,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "viscous_pyroxeres": {
        "name": "Viscous Pyroxeres",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.3,
        "refined_materials": {
            "tritanium": 385,
            "pyerite": 27,
            "mexallon": 55,
            "isogen": 6,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Plagioclase variants
    "plagioclase": {
        "name": "Plagioclase",
        "type": "ore",
        "rarity": "common",
        "volume": 0.35,
        "refined_materials": {
            "tritanium": 107,
            "pyerite": 213,
            "mexallon": 107,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "azure_plagioclase": {
        "name": "Azure Plagioclase",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 0.35,
        "refined_materials": {
            "tritanium": 112,
            "pyerite": 224,
            "mexallon": 112,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "rich_plagioclase": {
        "name": "Rich Plagioclase",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.35,
        "refined_materials": {
            "tritanium": 118,
            "pyerite": 235,
            "mexallon": 118,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Omber variants
    "omber": {
        "name": "Omber",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 0.6,
        "refined_materials": {
            "tritanium": 85,
            "pyerite": 34,
            "mexallon": 0,
            "isogen": 85,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "silvery_omber": {
        "name": "Silvery Omber",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.6,
        "refined_materials": {
            "tritanium": 89,
            "pyerite": 35,
            "mexallon": 0,
            "isogen": 89,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "golden_omber": {
        "name": "Golden Omber",
        "type": "ore",
        "rarity": "rare",
        "volume": 0.6,
        "refined_materials": {
            "tritanium": 94,
            "pyerite": 37,
            "mexallon": 0,
            "isogen": 94,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Kernite variants
    "kernite": {
        "name": "Kernite",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 1.2,
        "refined_materials": {
            "tritanium": 134,
            "pyerite": 0,
            "mexallon": 267,
            "isogen": 134,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "luminous_kernite": {
        "name": "Luminous Kernite",
        "type": "ore",
        "rarity": "rare",
        "volume": 1.2,
        "refined_materials": {
            "tritanium": 141,
            "pyerite": 0,
            "mexallon": 280,
            "isogen": 141,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "fiery_kernite": {
        "name": "Fiery Kernite",
        "type": "ore",
        "rarity": "rare",
        "volume": 1.2,
        "refined_materials": {
            "tritanium": 148,
            "pyerite": 0,
            "mexallon": 294,
            "isogen": 148,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Jaspet variants
    "jaspet": {
        "name": "Jaspet",
        "type": "ore",
        "rarity": "uncommon",
        "volume": 2.0,
        "refined_materials": {
            "tritanium": 72,
            "pyerite": 0,
            "mexallon": 121,
            "isogen": 0,
            "nocxium": 72,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "pure_jaspet": {
        "name": "Pure Jaspet",
        "type": "ore",
        "rarity": "rare",
        "volume": 2.0,
        "refined_materials": {
            "tritanium": 75,
            "pyerite": 0,
            "mexallon": 127,
            "isogen": 0,
            "nocxium": 75,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "pristine_jaspet": {
        "name": "Pristine Jaspet",
        "type": "ore",
        "rarity": "rare",
        "volume": 2.0,
        "refined_materials": {
            "tritanium": 79,
            "pyerite": 0,
            "mexallon": 133,
            "isogen": 0,
            "nocxium": 79,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Hemorphite variants
    "hemorphite": {
        "name": "Hemorphite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 212,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 212,
            "nocxium": 106,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "vivid_hemorphite": {
        "name": "Vivid Hemorphite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 223,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 223,
            "nocxium": 111,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "radiant_hemorphite": {
        "name": "Radiant Hemorphite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 234,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 234,
            "nocxium": 117,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Hedbergite variants
    "hedbergite": {
        "name": "Hedbergite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 395,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 197,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "vitric_hedbergite": {
        "name": "Vitric Hedbergite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 414,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 207,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "glazed_hedbergite": {
        "name": "Glazed Hedbergite",
        "type": "ore",
        "rarity": "rare",
        "volume": 3.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 434,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 217,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Gneiss variants
    "gneiss": {
        "name": "Gneiss",
        "type": "ore",
        "rarity": "rare",
        "volume": 5.0,
        "refined_materials": {
            "tritanium": 171,
            "pyerite": 0,
            "mexallon": 343,
            "isogen": 0,
            "nocxium": 171,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "iridescent_gneiss": {
        "name": "Iridescent Gneiss",
        "type": "ore",
        "rarity": "rare",
        "volume": 5.0,
        "refined_materials": {
            "tritanium": 179,
            "pyerite": 0,
            "mexallon": 360,
            "isogen": 0,
            "nocxium": 179,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "prismatic_gneiss": {
        "name": "Prismatic Gneiss",
        "type": "ore",
        "rarity": "rare",
        "volume": 5.0,
        "refined_materials": {
            "tritanium": 188,
            "pyerite": 0,
            "mexallon": 377,
            "isogen": 0,
            "nocxium": 188,
            "zydrine": 0,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Dark Ochre variants
    "dark_ochre": {
        "name": "Dark Ochre",
        "type": "ore",
        "rarity": "rare",
        "volume": 8.0,
        "refined_materials": {
            "tritanium": 250,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 250,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "onyx_ochre": {
        "name": "Onyx Ochre",
        "type": "ore",
        "rarity": "rare",
        "volume": 8.0,
        "refined_materials": {
            "tritanium": 262,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 262,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "obsidian_ochre": {
        "name": "Obsidian Ochre",
        "type": "ore",
        "rarity": "rare",
        "volume": 8.0,
        "refined_materials": {
            "tritanium": 275,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 275,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Spodumain variants
    "spodumain": {
        "name": "Spodumain",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 392,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 196
        },
        "compression_ratio": 100
    },
    "bright_spodumain": {
        "name": "Bright Spodumain",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 411,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 205
        },
        "compression_ratio": 100
    },
    "gleaming_spodumain": {
        "name": "Gleaming Spodumain",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 431,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 215
        },
        "compression_ratio": 100
    },
    
    # Crokite variants
    "crokite": {
        "name": "Crokite",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 331,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 331,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "sharp_crokite": {
        "name": "Sharp Crokite",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 347,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 347,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    "crystalline_crokite": {
        "name": "Crystalline Crokite",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 364,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 364,
            "megacyte": 0
        },
        "compression_ratio": 100
    },
    
    # Bistot variants
    "bistot": {
        "name": "Bistot",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 331,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 331
        },
        "compression_ratio": 100
    },
    "triclinic_bistot": {
        "name": "Triclinic Bistot",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 347,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 347
        },
        "compression_ratio": 100
    },
    "monoclinic_bistot": {
        "name": "Monoclinic Bistot",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 364,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 364
        },
        "compression_ratio": 100
    },
    
    # Arkonor variants
    "arkonor": {
        "name": "Arkonor",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 400
        },
        "compression_ratio": 100
    },
    "crimson_arkonor": {
        "name": "Crimson Arkonor",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 420
        },
        "compression_ratio": 100
    },
    "prime_arkonor": {
        "name": "Prime Arkonor",
        "type": "ore",
        "rarity": "rare",
        "volume": 16.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 440
        },
        "compression_ratio": 100
    },
    
    # Mercoxit variants
    "mercoxit": {
        "name": "Mercoxit",
        "type": "ore",
        "rarity": "exceptional",
        "volume": 40.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0,
            "morphite": 293
        },
        "compression_ratio": 100
    },
    "magma_mercoxit": {
        "name": "Magma Mercoxit",
        "type": "ore",
        "rarity": "exceptional",
        "volume": 40.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0,
            "morphite": 307
        },
        "compression_ratio": 100
    },
    "vitreous_mercoxit": {
        "name": "Vitreous Mercoxit",
        "type": "ore",
        "rarity": "exceptional",
        "volume": 40.0,
        "refined_materials": {
            "tritanium": 0,
            "pyerite": 0,
            "mexallon": 0,
            "isogen": 0,
            "nocxium": 0,
            "zydrine": 0,
            "megacyte": 0,
            "morphite": 322
        },
        "compression_ratio": 100
    }
}

# Processed Materials (Minerals)
PROCESSED_MATERIALS = {
    "tritanium": {
        "name": "Tritanium",
        "type": "mineral",
        "volume": 0.01,
        "description": "The most basic and common mineral in the universe"
    },
    "pyerite": {
        "name": "Pyerite",
        "type": "mineral",
        "volume": 0.01,
        "description": "A common mineral used in many industrial processes"
    },
    "mexallon": {
        "name": "Mexallon",
        "type": "mineral",
        "volume": 0.01,
        "description": "A sturdy mineral used in armor and hull construction"
    },
    "isogen": {
        "name": "Isogen",
        "type": "mineral",
        "volume": 0.01,
        "description": "A rare mineral used in advanced electronics"
    },
    "nocxium": {
        "name": "Nocxium",
        "type": "mineral",
        "volume": 0.01,
        "description": "An extremely rare mineral used in capacitor systems"
    },
    "zydrine": {
        "name": "Zydrine",
        "type": "mineral",
        "volume": 0.01,
        "description": "A very rare mineral used in advanced ship construction"
    },
    "megacyte": {
        "name": "Megacyte",
        "type": "mineral",
        "volume": 0.01,
        "description": "The rarest mineral, used in the most advanced technology"
    },
    "morphite": {
        "name": "Morphite",
        "type": "mineral",
        "volume": 0.01,
        "description": "An exceptionally rare mineral found only in mercoxit"
    }
}

# Planetary Commodities (PI Products)
PLANETARY_COMMODITIES = {
    # Basic Commodities
    "aqueous_liquids": {
        "name": "Aqueous Liquids",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "temperate",
        "volume": 0.4,
        "description": "Water and other aqueous liquids extracted from temperate planets"
    },
    "autotrophs": {
        "name": "Autotrophs",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "temperate",
        "volume": 0.4,
        "description": "Self-sustaining organisms from temperate planets"
    },
    "base_metals": {
        "name": "Base Metals",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "storm",
        "volume": 0.4,
        "description": "Common metals extracted from storm planets"
    },
    "carbon_compounds": {
        "name": "Carbon Compounds",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "gas",
        "volume": 0.4,
        "description": "Carbon-based compounds from gas planets"
    },
    "complex_organisms": {
        "name": "Complex Organisms",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "temperate",
        "volume": 0.4,
        "description": "Complex life forms from temperate planets"
    },
    "felsic_magma": {
        "name": "Felsic Magma",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "lava",
        "volume": 0.4,
        "description": "Silica-rich magma from lava planets"
    },
    "heavy_metals": {
        "name": "Heavy Metals",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "plasma",
        "volume": 0.4,
        "description": "Dense metals from plasma planets"
    },
    "ionic_solutions": {
        "name": "Ionic Solutions",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "storm",
        "volume": 0.4,
        "description": "Electrolyte-rich solutions from storm planets"
    },
    "microorganisms": {
        "name": "Microorganisms",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "barren",
        "volume": 0.4,
        "description": "Microscopic life forms from barren planets"
    },
    "noble_gas": {
        "name": "Noble Gas",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "gas",
        "volume": 0.4,
        "description": "Inert gases from gas planets"
    },
    "noble_metals": {
        "name": "Noble Metals",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "plasma",
        "volume": 0.4,
        "description": "Rare precious metals from plasma planets"
    },
    "non_cs_crystals": {
        "name": "Non-CS Crystals",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "ice",
        "volume": 0.4,
        "description": "Non-crystalline solids from ice planets"
    },
    "planktic_colonies": {
        "name": "Planktic Colonies",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "oceanic",
        "volume": 0.4,
        "description": "Floating colonies from oceanic planets"
    },
    "reactive_gas": {
        "name": "Reactive Gas",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "gas",
        "volume": 0.4,
        "description": "Chemically active gases from gas planets"
    },
    "suspended_plasma": {
        "name": "Suspended Plasma",
        "type": "planetary_commodity",
        "tier": 0,
        "planet_type": "plasma",
        "volume": 0.4,
        "description": "Contained plasma from plasma planets"
    },
    
    # Tier 1 Commodities
    "bacteria": {
        "name": "Bacteria",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"microorganisms": 3000, "carbon_compounds": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "biofuels": {
        "name": "Biofuels",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"carbon_compounds": 40, "microorganisms": 3000},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "biomass": {
        "name": "Biomass",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"carbon_compounds": 40, "autotrophs": 3000},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "chiral_structures": {
        "name": "Chiral Structures",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"non_cs_crystals": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "electrolytes": {
        "name": "Electrolytes",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "storm",
        "volume": 0.4,
        "input_materials": {"ionic_solutions": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "industrial_fibers": {
        "name": "Industrial Fibers",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"autotrophs": 3000, "aqueous_liquids": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "oxidizing_compound": {
        "name": "Oxidizing Compound",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "gas",
        "volume": 0.4,
        "input_materials": {"reactive_gas": 40, "felsic_magma": 3000},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "oxygen": {
        "name": "Oxygen",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "gas",
        "volume": 0.4,
        "input_materials": {"reactive_gas": 40, "aqueous_liquids": 3000},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "plasmoids": {
        "name": "Plasmoids",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "plasma",
        "volume": 0.4,
        "input_materials": {"suspended_plasma": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "precious_metals": {
        "name": "Precious Metals",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "plasma",
        "volume": 0.4,
        "input_materials": {"noble_metals": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "proteins": {
        "name": "Proteins",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"complex_organisms": 3000, "aqueous_liquids": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "reactive_metals": {
        "name": "Reactive Metals",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "storm",
        "volume": 0.4,
        "input_materials": {"base_metals": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "silicon": {
        "name": "Silicon",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "lava",
        "volume": 0.4,
        "input_materials": {"felsic_magma": 3000, "aqueous_liquids": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "toxic_metals": {
        "name": "Toxic Metals",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "plasma",
        "volume": 0.4,
        "input_materials": {"heavy_metals": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    },
    "water": {
        "name": "Water",
        "type": "planetary_commodity",
        "tier": 1,
        "planet_type": "temperate",
        "volume": 0.4,
        "input_materials": {"aqueous_liquids": 3000, "reactive_gas": 40},
        "output_quantity": 20,
        "cycle_time": 60
    }
}

# Blueprints
BLUEPRINTS = {
    # Ship Blueprints
    "rookie_ship_blueprint": {
        "name": "Rookie Ship Blueprint",
        "type": "blueprint",
        "category": "ship",
        "product": "rookie_ship",
        "materials": {
            "tritanium": 20000,
            "pyerite": 2000,
            "mexallon": 1000
        },
        "production_time": 1800,  # 30 minutes
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 900,  # 15 minutes
        "research_material_time": 3600,  # 1 hour
        "research_time_time": 3600,  # 1 hour
        "invention_chance": 0.4,
        "invention_materials": {
            "datacore_electronic_engineering": 2,
            "datacore_mechanical_engineering": 2
        }
    },
    "frigate_blueprint": {
        "name": "Frigate Blueprint",
        "type": "blueprint",
        "category": "ship",
        "product": "frigate",
        "materials": {
            "tritanium": 50000,
            "pyerite": 10000,
            "mexallon": 5000,
            "isogen": 1000
        },
        "production_time": 3600,  # 1 hour
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 1800,  # 30 minutes
        "research_material_time": 7200,  # 2 hours
        "research_time_time": 7200,  # 2 hours
        "invention_chance": 0.3,
        "invention_materials": {
            "datacore_electronic_engineering": 2,
            "datacore_mechanical_engineering": 2
        }
    },
    "cruiser_blueprint": {
        "name": "Cruiser Blueprint",
        "type": "blueprint",
        "category": "ship",
        "product": "cruiser",
        "materials": {
            "tritanium": 150000,
            "pyerite": 30000,
            "mexallon": 15000,
            "isogen": 3000,
            "nocxium": 500
        },
        "production_time": 7200,  # 2 hours
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 3600,  # 1 hour
        "research_material_time": 14400,  # 4 hours
        "research_time_time": 14400,  # 4 hours
        "invention_chance": 0.25,
        "invention_materials": {
            "datacore_electronic_engineering": 4,
            "datacore_mechanical_engineering": 4
        }
    },
    "battleship_blueprint": {
        "name": "Battleship Blueprint",
        "type": "blueprint",
        "category": "ship",
        "product": "battleship",
        "materials": {
            "tritanium": 500000,
            "pyerite": 100000,
            "mexallon": 50000,
            "isogen": 10000,
            "nocxium": 2000,
            "zydrine": 500
        },
        "production_time": 14400,  # 4 hours
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 7200,  # 2 hours
        "research_material_time": 28800,  # 8 hours
        "research_time_time": 28800,  # 8 hours
        "invention_chance": 0.2,
        "invention_materials": {
            "datacore_electronic_engineering": 8,
            "datacore_mechanical_engineering": 8
        }
    },
    
    # Module Blueprints
    "small_energy_laser_blueprint": {
        "name": "Small Energy Laser Blueprint",
        "type": "blueprint",
        "category": "module",
        "product": "small_energy_laser",
        "materials": {
            "tritanium": 1000,
            "pyerite": 200,
            "mexallon": 100,
            "isogen": 50
        },
        "production_time": 600,  # 10 minutes
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 300,  # 5 minutes
        "research_material_time": 1200,  # 20 minutes
        "research_time_time": 1200,  # 20 minutes
        "invention_chance": 0.35,
        "invention_materials": {
            "datacore_electronic_engineering": 1,
            "datacore_weapon_upgrades": 1
        }
    },
    "adaptive_nano_plating_blueprint": {
        "name": "Adaptive Nano Plating Blueprint",
        "type": "blueprint",
        "category": "module",
        "product": "adaptive_nano_plating",
        "materials": {
            "tritanium": 2000,
            "pyerite": 500,
            "mexallon": 300,
            "isogen": 100,
            "nocxium": 20
        },
        "production_time": 900,  # 15 minutes
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 450,  # 7.5 minutes
        "research_material_time": 1800,  # 30 minutes
        "research_time_time": 1800,  # 30 minutes
        "invention_chance": 0.3,
        "invention_materials": {
            "datacore_mechanical_engineering": 1,
            "datacore_hull_upgrades": 1
        }
    },
    
    # Component Blueprints
    "capacitor_battery_blueprint": {
        "name": "Capacitor Battery Blueprint",
        "type": "blueprint",
        "category": "component",
        "product": "capacitor_battery",
        "materials": {
            "tritanium": 500,
            "pyerite": 100,
            "isogen": 50,
            "nocxium": 10
        },
        "production_time": 300,  # 5 minutes
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 150,  # 2.5 minutes
        "research_material_time": 600,  # 10 minutes
        "research_time_time": 600,  # 10 minutes
        "invention_chance": 0.4,
        "invention_materials": {
            "datacore_electronic_engineering": 1
        }
    },
    "damage_control_blueprint": {
        "name": "Damage Control Blueprint",
        "type": "blueprint",
        "category": "component",
        "product": "damage_control",
        "materials": {
            "tritanium": 800,
            "pyerite": 150,
            "mexallon": 100,
            "isogen": 30
        },
        "production_time": 450,  # 7.5 minutes
        "production_efficiency": 1.0,
        "material_efficiency": 1.0,
        "waste_factor": 0.1,
        "copy_time": 225,  # 3.75 minutes
        "research_material_time": 900,  # 15 minutes
        "research_time_time": 900,  # 15 minutes
        "invention_chance": 0.35,
        "invention_materials": {
            "datacore_mechanical_engineering": 1,
            "datacore_hull_upgrades": 1
        }
    }
}

# Manufacturing Facilities
MANUFACTURING_FACILITIES = {
    "small_ship_assembly_array": {
        "name": "Small Ship Assembly Array",
        "type": "manufacturing_facility",
        "category": "ship_manufacturing",
        "size": "small",
        "powergrid": 10000,
        "cpu": 500,
        "capacity": 1000,
        "cycle_time_modifier": 1.0,
        "material_efficiency_bonus": 0.0,
        "time_efficiency_bonus": 0.0,
        "allowed_categories": ["frigate", "rookie_ship"],
        "base_cost": 1000000,
        "maintenance_cost": 10000
    },
    "medium_ship_assembly_array": {
        "name": "Medium Ship Assembly Array",
        "type": "manufacturing_facility",
        "category": "ship_manufacturing",
        "size": "medium",
        "powergrid": 25000,
        "cpu": 1250,
        "capacity": 2500,
        "cycle_time_modifier": 0.9,
        "material_efficiency_bonus": 0.02,
        "time_efficiency_bonus": 0.02,
        "allowed_categories": ["frigate", "cruiser", "industrial"],
        "base_cost": 5000000,
        "maintenance_cost": 50000
    },
    "large_ship_assembly_array": {
        "name": "Large Ship Assembly Array",
        "type": "manufacturing_facility",
        "category": "ship_manufacturing",
        "size": "large",
        "powergrid": 50000,
        "cpu": 2500,
        "capacity": 5000,
        "cycle_time_modifier": 0.8,
        "material_efficiency_bonus": 0.04,
        "time_efficiency_bonus": 0.04,
        "allowed_categories": ["cruiser", "battleship", "industrial", "capital"],
        "base_cost": 25000000,
        "maintenance_cost": 250000
    },
    "advanced_large_ship_assembly_array": {
        "name": "Advanced Large Ship Assembly Array",
        "type": "manufacturing_facility",
        "category": "ship_manufacturing",
        "size": "large",
        "powergrid": 75000,
        "cpu": 3750,
        "capacity": 7500,
        "cycle_time_modifier": 0.7,
        "material_efficiency_bonus": 0.06,
        "time_efficiency_bonus": 0.06,
        "allowed_categories": ["battleship", "capital", "supercapital"],
        "base_cost": 100000000,
        "maintenance_cost": 1000000
    },
    
    "equipment_assembly_plant": {
        "name": "Equipment Assembly Plant",
        "type": "manufacturing_facility",
        "category": "equipment_manufacturing",
        "size": "medium",
        "powergrid": 15000,
        "cpu": 750,
        "capacity": 1500,
        "cycle_time_modifier": 1.0,
        "material_efficiency_bonus": 0.0,
        "time_efficiency_bonus": 0.0,
        "allowed_categories": ["module", "component", "ammo"],
        "base_cost": 2000000,
        "maintenance_cost": 20000
    },
    "advanced_equipment_assembly_plant": {
        "name": "Advanced Equipment Assembly Plant",
        "type": "manufacturing_facility",
        "category": "equipment_manufacturing",
        "size": "large",
        "powergrid": 30000,
        "cpu": 1500,
        "capacity": 3000,
        "cycle_time_modifier": 0.85,
        "material_efficiency_bonus": 0.03,
        "time_efficiency_bonus": 0.03,
        "allowed_categories": ["module", "component", "ammo", "advanced_module"],
        "base_cost": 10000000,
        "maintenance_cost": 100000
    },
    
    "component_assembly_array": {
        "name": "Component Assembly Array",
        "type": "manufacturing_facility",
        "category": "component_manufacturing",
        "size": "small",
        "powergrid": 5000,
        "cpu": 250,
        "capacity": 500,
        "cycle_time_modifier": 1.0,
        "material_efficiency_bonus": 0.0,
        "time_efficiency_bonus": 0.0,
        "allowed_categories": ["component"],
        "base_cost": 500000,
        "maintenance_cost": 5000
    },
    
    "ammo_assembly_array": {
        "name": "Ammo Assembly Array",
        "type": "manufacturing_facility",
        "category": "ammo_manufacturing",
        "size": "small",
        "powergrid": 3000,
        "cpu": 150,
        "capacity": 300,
        "cycle_time_modifier": 1.0,
        "material_efficiency_bonus": 0.0,
        "time_efficiency_bonus": 0.0,
        "allowed_categories": ["ammo"],
        "base_cost": 300000,
        "maintenance_cost": 3000
    },
    
    "drug_lab": {
        "name": "Drug Lab",
        "type": "manufacturing_facility",
        "category": "drug_manufacturing",
        "size": "small",
        "powergrid": 2000,
        "cpu": 100,
        "capacity": 200,
        "cycle_time_modifier": 1.0,
        "material_efficiency_bonus": 0.0,
        "time_efficiency_bonus": 0.0,
        "allowed_categories": ["drug"],
        "base_cost": 200000,
        "maintenance_cost": 2000
    }
}

# Invention Datacores
INVENTION_DATACORES = {
    "datacore_electronic_engineering": {
        "name": "Datacore - Electronic Engineering",
        "type": "datacore",
        "skill_requirement": "electronic_engineering",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on electronic systems and engineering"
    },
    "datacore_mechanical_engineering": {
        "name": "Datacore - Mechanical Engineering",
        "type": "datacore",
        "skill_requirement": "mechanical_engineering",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on mechanical systems and engineering"
    },
    "datacore_weapon_upgrades": {
        "name": "Datacore - Weapon Upgrades",
        "type": "datacore",
        "skill_requirement": "weapon_upgrades",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on weapon systems and upgrades"
    },
    "datacore_hull_upgrades": {
        "name": "Datacore - Hull Upgrades",
        "type": "datacore",
        "skill_requirement": "hull_upgrades",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on ship hulls and armor systems"
    },
    "datacore_cpu_management": {
        "name": "Datacore - CPU Management",
        "type": "datacore",
        "skill_requirement": "cpu_management",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on CPU systems and management"
    },
    "datacore_powergrid_management": {
        "name": "Datacore - Powergrid Management",
        "type": "datacore",
        "skill_requirement": "powergrid_management",
        "level_requirement": 1,
        "volume": 0.1,
        "description": "Contains research data on powergrid systems and management"
    }
}

# Refining Skills and Bonuses
REFINING_SKILLS = {
    "refining": {
        "name": "Refining",
        "description": "Skill for refining ores into minerals",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "refining_yield_bonus": 0.03,  # 3% per level
        "ore_processing_time_bonus": 0.05  # 5% per level
    },
    "refinery_efficiency": {
        "name": "Refinery Efficiency",
        "description": "Improves refining efficiency and reduces waste",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "refining_yield_bonus": 0.02,  # 2% per level
        "waste_reduction": 0.05  # 5% per level
    },
    "deep_core_mining": {
        "name": "Deep Core Mining",
        "description": "Allows mining of mercoxit and morphite refining",
        "max_level": 1,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "enables_morphite": True
    }
}

# Planetary Industry Skills
PLANETARY_INDUSTRY_SKILLS = {
    "planetary_infrastructure": {
        "name": "Planetary Infrastructure",
        "description": "Allows construction and management of planetary colonies",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "charisma",
        "colony_limit_bonus": 1,  # +1 colony per level
        "command_center_upgrade_cost_reduction": 0.1  # 10% per level
    },
    "remote_sensing": {
        "name": "Remote Sensing",
        "description": "Improves planetary scanning and resource identification",
        "max_level": 4,
        "primary_attribute": "intelligence",
        "secondary_attribute": "perception",
        "scan_range_bonus": 0.25,  # 25% per level
        "resource_quality_bonus": 0.05  # 5% per level
    },
    "planetary_consolidation": {
        "name": "Planetary Consolidation",
        "description": "Allows linking of planetary structures",
        "max_level": 4,
        "primary_attribute": "intelligence",
        "secondary_attribute": "willpower",
        "link_range_bonus": 0.2,  # 20% per level
        "link_strength_bonus": 0.1  # 10% per level
    },
    "command_center_upgrades": {
        "name": "Command Center Upgrades",
        "description": "Improves command center efficiency",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "cpu_bonus": 0.1,  # 10% per level
        "powergrid_bonus": 0.1  # 10% per level
    },
    "interplanetary_consolidation": {
        "name": "Interplanetary Consolidation",
        "description": "Allows interplanetary logistics",
        "max_level": 4,
        "primary_attribute": "intelligence",
        "secondary_attribute": "charisma",
        "launch_time_reduction": 0.1,  # 10% per level
        "export_tax_reduction": 0.05  # 5% per level
    }
}

# Manufacturing Skills
MANUFACTURING_SKILLS = {
    "industry": {
        "name": "Industry",
        "description": "Basic manufacturing skill",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "production_time_bonus": 0.05,  # 5% per level
        "material_efficiency_bonus": 0.02  # 2% per level
    },
    "advanced_industry": {
        "name": "Advanced Industry",
        "description": "Advanced manufacturing techniques",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "production_time_bonus": 0.03,  # 3% per level
        "material_efficiency_bonus": 0.04  # 4% per level
    },
    "production_efficiency": {
        "name": "Production Efficiency",
        "description": "Improves manufacturing efficiency",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "production_time_bonus": 0.04,  # 4% per level
        "material_efficiency_bonus": 0.03  # 3% per level
    }
}

# Invention Skills
INVENTION_SKILLS = {
    "invention": {
        "name": "Invention",
        "description": "Basic invention skill",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "invention_chance_bonus": 0.02,  # 2% per level
        "datacore_reduction": 0.1  # 10% per level
    },
    "advanced_invention": {
        "name": "Advanced Invention",
        "description": "Advanced invention techniques",
        "max_level": 5,
        "primary_attribute": "intelligence",
        "secondary_attribute": "memory",
        "invention_chance_bonus": 0.03,  # 3% per level
        "datacore_reduction": 0.15  # 15% per level
    }
}


# ==================== GOVERNMENT SYSTEM ====================

GOVERNMENT_TYPES = {
    "democracy": {
        "name": "Democracy",
        "description": "Government by the people with elected representatives",
        "subtypes": ["direct_democracy", "representative_democracy", "constitutional_democracy"],
        "bonuses": {
            "happiness": 0.20,
            "research_bonus": 0.10,
            "resource_bonus": 0.05,
            "trade_bonus": 0.10
        },
        "penalties": {
            "military_speed": -0.10,
            "decision_speed": -0.15
        },
        "stability_base": 70,
        "corruption_base": 0.10
    },
    "autocracy": {
        "name": "Autocracy",
        "description": "Rule by a single absolute ruler",
        "subtypes": ["monarchy", "dictatorship", "empire"],
        "bonuses": {
            "military_bonus": 0.20,
            "build_speed": 0.15,
            "decision_speed": 0.30
        },
        "penalties": {
            "happiness": -0.15,
            "research_bonus": -0.05,
            "trade_bonus": -0.10
        },
        "stability_base": 60,
        "corruption_base": 0.25
    },
    "oligarchy": {
        "name": "Oligarchy",
        "description": "Rule by a small group of wealthy elites",
        "subtypes": ["plutocracy", "aristocracy", "merchant_republic"],
        "bonuses": {
            "trade_bonus": 0.25,
            "resource_bonus": 0.15,
            "wealth_generation": 0.20
        },
        "penalties": {
            "happiness": -0.10,
            "military_bonus": -0.05
        },
        "stability_base": 65,
        "corruption_base": 0.30
    },
    "technocracy": {
        "name": "Technocracy",
        "description": "Rule by technical experts and scientists",
        "subtypes": ["scientific_council", "ai_governance", "meritocracy"],
        "bonuses": {
            "research_bonus": 0.30,
            "efficiency": 0.20,
            "energy_bonus": 0.15
        },
        "penalties": {
            "happiness": -0.05,
            "military_bonus": -0.10
        },
        "stability_base": 75,
        "corruption_base": 0.08
    },
    "theocracy": {
        "name": "Theocracy",
        "description": "Rule by religious leaders",
        "subtypes": ["divine_mandate", "religious_council", "prophet_rule"],
        "bonuses": {
            "happiness": 0.15,
            "unity": 0.25,
            "defense_bonus": 0.15
        },
        "penalties": {
            "research_bonus": -0.15,
            "trade_bonus": -0.10
        },
        "stability_base": 80,
        "corruption_base": 0.15
    },
    "military_junta": {
        "name": "Military Junta",
        "description": "Rule by military officers",
        "subtypes": ["stratocracy", "martial_law", "warrior_council"],
        "bonuses": {
            "military_bonus": 0.35,
            "defense_bonus": 0.25,
            "fleet_speed": 0.15
        },
        "penalties": {
            "happiness": -0.20,
            "research_bonus": -0.10,
            "trade_bonus": -0.15
        },
        "stability_base": 55,
        "corruption_base": 0.20
    },
    "corporate_state": {
        "name": "Corporate State",
        "description": "Rule by mega-corporations",
        "subtypes": ["corporate_council", "conglomerate", "trade_federation"],
        "bonuses": {
            "trade_bonus": 0.30,
            "resource_bonus": 0.20,
            "efficiency": 0.15
        },
        "penalties": {
            "happiness": -0.15,
            "unity": -0.10
        },
        "stability_base": 60,
        "corruption_base": 0.35
    },
    "hive_mind": {
        "name": "Hive Mind",
        "description": "Collective consciousness ruling all",
        "subtypes": ["gestalt_consciousness", "neural_network", "collective"],
        "bonuses": {
            "unity": 0.50,
            "efficiency": 0.30,
            "population_growth": 0.20
        },
        "penalties": {
            "diplomacy": -0.30,
            "trade_bonus": -0.20
        },
        "stability_base": 95,
        "corruption_base": 0.00
    },
    "federation": {
        "name": "Federation",
        "description": "Union of semi-autonomous states",
        "subtypes": ["galactic_federation", "confederation", "commonwealth"],
        "bonuses": {
            "diplomacy": 0.25,
            "alliance_bonus": 0.20,
            "diversity_bonus": 0.15
        },
        "penalties": {
            "military_speed": -0.05,
            "decision_speed": -0.10
        },
        "stability_base": 70,
        "corruption_base": 0.12
    },
    "anarchy": {
        "name": "Anarchy",
        "description": "No formal government structure",
        "subtypes": ["libertarian", "pirate_haven", "free_state"],
        "bonuses": {
            "freedom": 0.50,
            "raid_bonus": 0.30,
            "stealth": 0.20
        },
        "penalties": {
            "stability": -0.30,
            "defense_bonus": -0.20,
            "trade_bonus": -0.15
        },
        "stability_base": 30,
        "corruption_base": 0.40
    }
}

GOVERNMENT_POLICIES = {
    "military_focus": {"name": "Military Focus", "effect": {"military_bonus": 0.15, "research_bonus": -0.05}},
    "research_grants": {"name": "Research Grants", "effect": {"research_bonus": 0.20, "resource_bonus": -0.05}},
    "trade_agreements": {"name": "Trade Agreements", "effect": {"trade_bonus": 0.15, "military_bonus": -0.05}},
    "propaganda": {"name": "Propaganda", "effect": {"happiness": 0.10, "corruption": 0.05}},
    "welfare_state": {"name": "Welfare State", "effect": {"happiness": 0.15, "efficiency": -0.10}},
    "police_state": {"name": "Police State", "effect": {"stability": 0.20, "happiness": -0.15}},
    "free_market": {"name": "Free Market", "effect": {"trade_bonus": 0.20, "equality": -0.10}},
    "isolationism": {"name": "Isolationism", "effect": {"defense_bonus": 0.15, "trade_bonus": -0.20}},
    "expansionism": {"name": "Expansionism", "effect": {"colonization_speed": 0.20, "stability": -0.10}},
    "environmentalism": {"name": "Environmentalism", "effect": {"habitability_bonus": 0.15, "resource_bonus": -0.10}}
}


# ==================== POPULATION SYSTEM ====================

POPULATION_CONFIG = {
    "base_growth_rate": 0.02,  # 2% per tick
    "max_growth_rate": 0.10,   # 10% max
    "min_growth_rate": -0.05,  # -5% min (decline)
    "happiness_growth_modifier": 0.5,
    "food_consumption_per_pop": 1,
    "housing_per_field": 1000,
    "worker_productivity": 1.0,
    "scientist_productivity": 2.0,
    "soldier_productivity": 1.5
}

POPULATION_CLASSES = {
    "workers": {
        "name": "Workers",
        "description": "General labor force for production",
        "productivity": 1.0,
        "resource_bonus": {"metal": 0.01, "crystal": 0.01, "deuterium": 0.005},
        "happiness_modifier": 0.8,
        "growth_rate": 1.2
    },
    "scientists": {
        "name": "Scientists",
        "description": "Research and development specialists",
        "productivity": 2.0,
        "resource_bonus": {"research": 0.02},
        "happiness_modifier": 1.0,
        "growth_rate": 0.8
    },
    "soldiers": {
        "name": "Soldiers",
        "description": "Military personnel",
        "productivity": 1.5,
        "resource_bonus": {"defense": 0.01, "attack": 0.01},
        "happiness_modifier": 0.9,
        "growth_rate": 1.0
    },
    "merchants": {
        "name": "Merchants",
        "description": "Trade and commerce specialists",
        "productivity": 1.8,
        "resource_bonus": {"credits": 0.02, "trade": 0.01},
        "happiness_modifier": 1.1,
        "growth_rate": 1.0
    },
    "administrators": {
        "name": "Administrators",
        "description": "Government and management",
        "productivity": 1.5,
        "resource_bonus": {"efficiency": 0.01, "stability": 0.005},
        "happiness_modifier": 1.0,
        "growth_rate": 0.7
    },
    "colonists": {
        "name": "Colonists",
        "description": "Pioneer settlers for new worlds",
        "productivity": 0.8,
        "resource_bonus": {"colonization": 0.02},
        "happiness_modifier": 0.7,
        "growth_rate": 1.5
    }
}

POPULATION_NEEDS = {
    "food": {"name": "Food", "per_pop": 1, "happiness_impact": -0.20, "priority": 1},
    "water": {"name": "Water", "per_pop": 0.5, "happiness_impact": -0.15, "priority": 1},
    "housing": {"name": "Housing", "per_pop": 0.1, "happiness_impact": -0.10, "priority": 2},
    "healthcare": {"name": "Healthcare", "per_pop": 0.05, "happiness_impact": -0.08, "priority": 3},
    "education": {"name": "Education", "per_pop": 0.03, "happiness_impact": -0.05, "priority": 4},
    "entertainment": {"name": "Entertainment", "per_pop": 0.02, "happiness_impact": -0.03, "priority": 5},
    "luxury": {"name": "Luxury Goods", "per_pop": 0.01, "happiness_impact": 0.05, "priority": 6}
}

HAPPINESS_FACTORS = {
    "base": 50,
    "food_satisfied": 10,
    "housing_satisfied": 10,
    "healthcare_satisfied": 5,
    "education_satisfied": 5,
    "entertainment_satisfied": 5,
    "luxury_satisfied": 5,
    "war_penalty": -20,
    "peace_bonus": 10,
    "high_taxes": -15,
    "low_taxes": 5,
    "victory_bonus": 10,
    "defeat_penalty": -15
}


# ==================== PLANET SCANNER SYSTEM ====================

SCANNER_CONFIG = {
    "base_scan_range": 5,  # Systems
    "scan_accuracy_base": 0.70,
    "scan_time_base": 60,  # Seconds
    "scan_cost": {"energy": 100, "deuterium": 10}
}

SCANNER_LEVELS = {
    1: {"range": 5, "accuracy": 0.70, "detail_level": "basic"},
    2: {"range": 10, "accuracy": 0.75, "detail_level": "basic"},
    3: {"range": 20, "accuracy": 0.80, "detail_level": "standard"},
    4: {"range": 35, "accuracy": 0.85, "detail_level": "standard"},
    5: {"range": 50, "accuracy": 0.88, "detail_level": "detailed"},
    6: {"range": 75, "accuracy": 0.90, "detail_level": "detailed"},
    7: {"range": 100, "accuracy": 0.92, "detail_level": "advanced"},
    8: {"range": 150, "accuracy": 0.94, "detail_level": "advanced"},
    9: {"range": 200, "accuracy": 0.96, "detail_level": "complete"},
    10: {"range": 999, "accuracy": 0.99, "detail_level": "complete"}
}

SCAN_DETAIL_LEVELS = {
    "basic": ["position", "planet_type", "estimated_size"],
    "standard": ["position", "planet_type", "size_range", "temperature_range", "habitability"],
    "detailed": ["position", "planet_type", "exact_size", "temperature", "habitability", "resources_estimate", "biome"],
    "advanced": ["position", "planet_type", "exact_size", "temperature", "habitability", "resources", "biome", "moon_chance", "special_features"],
    "complete": ["position", "planet_type", "exact_size", "temperature", "habitability", "exact_resources", "biome", "moon_data", "special_features", "strategic_value", "colonization_cost"]
}


# ==================== SPACE STATION FIELDS SYSTEM ====================

STATION_FIELD_CONFIG = {
    "orbital_station": {
        "base_fields": 50,
        "max_fields": 200,
        "field_expansion_cost": {"metal": 10000, "crystal": 5000, "deuterium": 2000},
        "fields_per_upgrade": 10
    },
    "starbase": {
        "base_fields": 150,
        "max_fields": 500,
        "field_expansion_cost": {"metal": 25000, "crystal": 15000, "deuterium": 8000},
        "fields_per_upgrade": 15
    },
    "moonbase": {
        "base_fields": 100,
        "max_fields": 300,
        "field_expansion_cost": {"metal": 15000, "crystal": 10000, "deuterium": 5000},
        "fields_per_upgrade": 12
    },
    "trading_post": {
        "base_fields": 75,
        "max_fields": 250,
        "field_expansion_cost": {"metal": 12000, "crystal": 12000, "deuterium": 3000},
        "fields_per_upgrade": 10
    },
    "research_station": {
        "base_fields": 60,
        "max_fields": 200,
        "field_expansion_cost": {"metal": 8000, "crystal": 20000, "deuterium": 10000},
        "fields_per_upgrade": 8
    },
    "defense_platform": {
        "base_fields": 40,
        "max_fields": 150,
        "field_expansion_cost": {"metal": 20000, "crystal": 10000, "deuterium": 5000},
        "fields_per_upgrade": 6
    },
    "shipyard_station": {
        "base_fields": 120,
        "max_fields": 400,
        "field_expansion_cost": {"metal": 30000, "crystal": 20000, "deuterium": 10000},
        "fields_per_upgrade": 15
    },
    "colony_hub": {
        "base_fields": 80,
        "max_fields": 250,
        "field_expansion_cost": {"metal": 15000, "crystal": 12000, "deuterium": 6000},
        "fields_per_upgrade": 10
    }
}

MOON_FIELD_CONFIG = {
    "base_fields": 1,
    "field_per_1000km_diameter": 3,
    "max_fields": 200,
    "lunar_base_fields_per_level": 3,
    "max_lunar_base_level": 8
}

STARBASE_FACILITIES = {
    "command_center": {
        "name": "Command Center",
        "fields_required": 5,
        "max_level": 10,
        "effect": {"fleet_coordination": 0.05, "sensor_range": 100}
    },
    "hangar_bay": {
        "name": "Hangar Bay",
        "fields_required": 10,
        "max_level": 15,
        "effect": {"hangar_capacity": 50, "repair_rate": 0.02}
    },
    "shield_generator": {
        "name": "Shield Generator",
        "fields_required": 8,
        "max_level": 12,
        "effect": {"station_shields": 1000, "shield_recharge": 0.05}
    },
    "weapons_array": {
        "name": "Weapons Array",
        "fields_required": 12,
        "max_level": 15,
        "effect": {"station_weapons": 500, "weapon_range": 50}
    },
    "cargo_hold": {
        "name": "Cargo Hold",
        "fields_required": 6,
        "max_level": 20,
        "effect": {"cargo_capacity": 10000}
    },
    "crew_quarters": {
        "name": "Crew Quarters",
        "fields_required": 4,
        "max_level": 15,
        "effect": {"crew_capacity": 100, "morale": 0.02}
    },
    "medical_bay": {
        "name": "Medical Bay",
        "fields_required": 5,
        "max_level": 10,
        "effect": {"crew_recovery": 0.10, "population_growth": 0.01}
    },
    "research_lab": {
        "name": "Research Lab",
        "fields_required": 8,
        "max_level": 12,
        "effect": {"research_bonus": 0.05}
    },
    "trading_hub": {
        "name": "Trading Hub",
        "fields_required": 6,
        "max_level": 10,
        "effect": {"trade_bonus": 0.10, "market_access": True}
    },
    "defense_grid": {
        "name": "Defense Grid",
        "fields_required": 15,
        "max_level": 10,
        "effect": {"defense_bonus": 0.15, "point_defense": 100}
    }
}
