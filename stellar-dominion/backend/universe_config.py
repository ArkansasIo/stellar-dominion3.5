"""
Stellar Dominion - Commander, Government, Population & Universe Configuration
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
