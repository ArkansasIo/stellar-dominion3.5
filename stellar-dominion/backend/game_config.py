"""
Stellar Dominion - Planet & Empire Configuration
Comprehensive planet types, biomes, moons, stations, and combat systems
"""

# ==================== PLANET POSITION SIZE RANGES ====================
# Position 8 has the largest base size (up to 252 fields)
PLANET_POSITION_SIZE = {
    1: {"min": 34, "max": 68, "temp_min": 220, "temp_max": 260},
    2: {"min": 45, "max": 96, "temp_min": 170, "temp_max": 220},
    3: {"min": 52, "max": 116, "temp_min": 120, "temp_max": 170},
    4: {"min": 96, "max": 172, "temp_min": 70, "temp_max": 120},
    5: {"min": 130, "max": 198, "temp_min": 40, "temp_max": 70},
    6: {"min": 156, "max": 226, "temp_min": 20, "temp_max": 40},
    7: {"min": 186, "max": 242, "temp_min": 0, "temp_max": 20},
    8: {"min": 210, "max": 252, "temp_min": -20, "temp_max": 0},  # OPTIMAL POSITION
    9: {"min": 186, "max": 242, "temp_min": -40, "temp_max": -20},
    10: {"min": 156, "max": 226, "temp_min": -60, "temp_max": -40},
    11: {"min": 130, "max": 198, "temp_min": -80, "temp_max": -60},
    12: {"min": 96, "max": 172, "temp_min": -110, "temp_max": -80},
    13: {"min": 52, "max": 116, "temp_min": -140, "temp_max": -110},
    14: {"min": 45, "max": 96, "temp_min": -180, "temp_max": -140},
    15: {"min": 34, "max": 68, "temp_min": -240, "temp_max": -180},
}

# ==================== FIELD SIZE CATEGORIES ====================
FIELD_SIZE_CATEGORIES = {
    "micro": {"min": 1, "max": 50, "label": "Micro"},
    "tiny": {"min": 51, "max": 100, "label": "Tiny"},
    "small": {"min": 101, "max": 150, "label": "Small"},
    "normal": {"min": 151, "max": 250, "label": "Normal"},
    "large": {"min": 251, "max": 350, "label": "Large"},
    "very_large": {"min": 351, "max": 500, "label": "Very Large"},
    "huge": {"min": 501, "max": 1000, "label": "Huge"},
    "massive": {"min": 1001, "max": 10000, "label": "Massive"},
    "continental": {"min": 10001, "max": 50000, "label": "Continental"},
    "oceanic": {"min": 50001, "max": 99999, "label": "Oceanic"},
    "extreme_large": {"min": 100000, "max": 500000, "label": "Extreme Large"},
    "mega": {"min": 500001, "max": 999999, "label": "Mega World"},
}

# ==================== PLANET CLASSES (12 Main Classes) ====================
PLANET_CLASSES = {
    "M": {
        "name": "Terran",
        "description": "Earth-like planet with breathable atmosphere",
        "habitability": 0.95,
        "resource_mod": 1.0,
        "energy_mod": 1.0,
        "subclasses": ["M1", "M2", "M3", "M4"]
    },
    "O": {
        "name": "Ocean",
        "description": "Water world with global ocean",
        "habitability": 0.75,
        "resource_mod": 0.8,
        "energy_mod": 1.1,
        "subclasses": ["O1", "O2", "O3"]
    },
    "L": {
        "name": "Marginal",
        "description": "Marginally habitable with thin atmosphere",
        "habitability": 0.45,
        "resource_mod": 1.1,
        "energy_mod": 0.9,
        "subclasses": ["L1", "L2", "L3"]
    },
    "H": {
        "name": "Desert",
        "description": "Hot arid world with minimal water",
        "habitability": 0.35,
        "resource_mod": 1.3,
        "energy_mod": 1.4,
        "subclasses": ["H1", "H2", "H3"]
    },
    "P": {
        "name": "Glacial",
        "description": "Frozen ice world",
        "habitability": 0.25,
        "resource_mod": 0.9,
        "energy_mod": 0.7,
        "subclasses": ["P1", "P2", "P3"]
    },
    "Y": {
        "name": "Demon",
        "description": "Volcanic hell world with extreme conditions",
        "habitability": 0.1,
        "resource_mod": 1.8,
        "energy_mod": 2.0,
        "subclasses": ["Y1", "Y2", "Y3"]
    },
    "J": {
        "name": "Gas Giant",
        "description": "Massive gas planet - orbital stations only",
        "habitability": 0.0,
        "resource_mod": 2.5,
        "energy_mod": 0.5,
        "subclasses": ["J1", "J2", "J3", "J4"]
    },
    "K": {
        "name": "Adaptable",
        "description": "Harsh but colonizable with pressure domes",
        "habitability": 0.55,
        "resource_mod": 1.2,
        "energy_mod": 1.0,
        "subclasses": ["K1", "K2", "K3"]
    },
    "D": {
        "name": "Asteroid",
        "description": "Planetoid/dwarf planet",
        "habitability": 0.15,
        "resource_mod": 1.5,
        "energy_mod": 0.6,
        "subclasses": ["D1", "D2"]
    },
    "T": {
        "name": "Gas Dwarf",
        "description": "Small gas planet with dense atmosphere",
        "habitability": 0.05,
        "resource_mod": 1.4,
        "energy_mod": 0.8,
        "subclasses": ["T1", "T2"]
    },
    "N": {
        "name": "Reducing",
        "description": "Sulfuric atmosphere world",
        "habitability": 0.2,
        "resource_mod": 1.6,
        "energy_mod": 1.2,
        "subclasses": ["N1", "N2"]
    },
    "R": {
        "name": "Rogue",
        "description": "Wandering planet without a star",
        "habitability": 0.08,
        "resource_mod": 0.7,
        "energy_mod": 0.3,
        "subclasses": ["R1", "R2"]
    }
}

# ==================== PLANET TYPES (12 Types with Subtypes) ====================
PLANET_TYPES = {
    "terrestrial": {
        "name": "Terrestrial",
        "description": "Rocky planet with solid surface",
        "subtypes": [
            {"id": "silicate", "name": "Silicate", "metal_bonus": 1.2, "crystal_bonus": 1.0},
            {"id": "iron", "name": "Iron Core", "metal_bonus": 1.5, "crystal_bonus": 0.8},
            {"id": "carbon", "name": "Carbon", "metal_bonus": 0.9, "crystal_bonus": 1.4},
            {"id": "lava", "name": "Lava", "metal_bonus": 1.8, "crystal_bonus": 0.6}
        ]
    },
    "ocean": {
        "name": "Ocean World",
        "description": "Planet covered in water",
        "subtypes": [
            {"id": "shallow", "name": "Shallow Ocean", "metal_bonus": 0.7, "crystal_bonus": 1.1},
            {"id": "deep", "name": "Deep Ocean", "metal_bonus": 0.6, "crystal_bonus": 1.3},
            {"id": "ice_covered", "name": "Ice-Covered Ocean", "metal_bonus": 0.8, "crystal_bonus": 1.2}
        ]
    },
    "desert": {
        "name": "Desert World",
        "description": "Arid planet with little water",
        "subtypes": [
            {"id": "hot_desert", "name": "Hot Desert", "metal_bonus": 1.3, "crystal_bonus": 0.9},
            {"id": "cold_desert", "name": "Cold Desert", "metal_bonus": 1.1, "crystal_bonus": 1.0},
            {"id": "dust", "name": "Dust World", "metal_bonus": 1.4, "crystal_bonus": 0.7}
        ]
    },
    "ice": {
        "name": "Ice World",
        "description": "Frozen planet with ice surface",
        "subtypes": [
            {"id": "permafrost", "name": "Permafrost", "metal_bonus": 0.9, "crystal_bonus": 1.1},
            {"id": "glacial", "name": "Glacial", "metal_bonus": 0.8, "crystal_bonus": 1.3},
            {"id": "cryo", "name": "Cryo World", "metal_bonus": 0.7, "crystal_bonus": 1.5}
        ]
    },
    "volcanic": {
        "name": "Volcanic World",
        "description": "Planet with extreme volcanic activity",
        "subtypes": [
            {"id": "active", "name": "Active Volcanic", "metal_bonus": 2.0, "crystal_bonus": 0.5},
            {"id": "dormant", "name": "Dormant Volcanic", "metal_bonus": 1.6, "crystal_bonus": 0.8},
            {"id": "magma", "name": "Magma World", "metal_bonus": 2.2, "crystal_bonus": 0.4}
        ]
    },
    "gas_giant": {
        "name": "Gas Giant",
        "description": "Massive planet of hydrogen and helium",
        "subtypes": [
            {"id": "hot_jupiter", "name": "Hot Jupiter", "metal_bonus": 0.3, "crystal_bonus": 0.3, "deuterium_bonus": 2.5},
            {"id": "cold_jupiter", "name": "Cold Jupiter", "metal_bonus": 0.2, "crystal_bonus": 0.2, "deuterium_bonus": 3.0},
            {"id": "super_jupiter", "name": "Super Jupiter", "metal_bonus": 0.4, "crystal_bonus": 0.4, "deuterium_bonus": 3.5}
        ]
    },
    "barren": {
        "name": "Barren World",
        "description": "Lifeless rocky world",
        "subtypes": [
            {"id": "cratered", "name": "Cratered", "metal_bonus": 1.2, "crystal_bonus": 1.0},
            {"id": "smooth", "name": "Smooth", "metal_bonus": 1.0, "crystal_bonus": 1.1},
            {"id": "fractured", "name": "Fractured", "metal_bonus": 1.4, "crystal_bonus": 0.9}
        ]
    },
    "jungle": {
        "name": "Jungle World",
        "description": "Planet covered in dense vegetation",
        "subtypes": [
            {"id": "tropical", "name": "Tropical", "metal_bonus": 0.8, "crystal_bonus": 1.2},
            {"id": "fungal", "name": "Fungal", "metal_bonus": 0.7, "crystal_bonus": 1.4},
            {"id": "swamp", "name": "Swamp", "metal_bonus": 0.6, "crystal_bonus": 1.5}
        ]
    },
    "toxic": {
        "name": "Toxic World",
        "description": "Planet with poisonous atmosphere",
        "subtypes": [
            {"id": "acid", "name": "Acid World", "metal_bonus": 1.5, "crystal_bonus": 0.6},
            {"id": "sulfuric", "name": "Sulfuric", "metal_bonus": 1.4, "crystal_bonus": 0.7},
            {"id": "methane", "name": "Methane World", "metal_bonus": 1.2, "crystal_bonus": 0.9}
        ]
    },
    "artificial": {
        "name": "Artificial World",
        "description": "Constructed or heavily modified planet",
        "subtypes": [
            {"id": "ecumenopolis", "name": "Ecumenopolis", "metal_bonus": 1.0, "crystal_bonus": 1.0, "field_bonus": 2.0},
            {"id": "machine", "name": "Machine World", "metal_bonus": 1.5, "crystal_bonus": 1.5},
            {"id": "ringworld_section", "name": "Ringworld Section", "metal_bonus": 1.2, "crystal_bonus": 1.2, "field_bonus": 5.0}
        ]
    },
    "exotic": {
        "name": "Exotic World",
        "description": "Unusual or rare planet type",
        "subtypes": [
            {"id": "crystalline", "name": "Crystalline", "metal_bonus": 0.5, "crystal_bonus": 3.0},
            {"id": "radioactive", "name": "Radioactive", "metal_bonus": 1.3, "crystal_bonus": 0.8, "energy_bonus": 2.0},
            {"id": "dark_matter", "name": "Dark Matter", "metal_bonus": 2.0, "crystal_bonus": 2.0}
        ]
    },
    "proto": {
        "name": "Proto Planet",
        "description": "Young forming planet",
        "subtypes": [
            {"id": "accretion", "name": "Accretion Disk", "metal_bonus": 1.8, "crystal_bonus": 0.5},
            {"id": "protoplanetary", "name": "Protoplanetary", "metal_bonus": 1.5, "crystal_bonus": 0.7}
        ]
    }
}

# ==================== BIOMES (90 Types) ====================
BIOMES = [
    # Terrestrial Biomes (1-15)
    {"id": 1, "name": "Temperate Forest", "temp_range": [5, 25], "habitability": 0.95},
    {"id": 2, "name": "Tropical Rainforest", "temp_range": [20, 35], "habitability": 0.85},
    {"id": 3, "name": "Boreal Forest", "temp_range": [-10, 10], "habitability": 0.75},
    {"id": 4, "name": "Mediterranean", "temp_range": [10, 30], "habitability": 0.90},
    {"id": 5, "name": "Grassland", "temp_range": [0, 25], "habitability": 0.85},
    {"id": 6, "name": "Savanna", "temp_range": [20, 40], "habitability": 0.70},
    {"id": 7, "name": "Steppe", "temp_range": [-5, 20], "habitability": 0.65},
    {"id": 8, "name": "Prairie", "temp_range": [5, 25], "habitability": 0.80},
    {"id": 9, "name": "Wetlands", "temp_range": [10, 30], "habitability": 0.60},
    {"id": 10, "name": "Mangrove", "temp_range": [20, 35], "habitability": 0.55},
    {"id": 11, "name": "Chaparral", "temp_range": [10, 30], "habitability": 0.70},
    {"id": 12, "name": "Alpine Meadow", "temp_range": [-15, 10], "habitability": 0.50},
    {"id": 13, "name": "Highland", "temp_range": [0, 20], "habitability": 0.65},
    {"id": 14, "name": "Riparian", "temp_range": [5, 25], "habitability": 0.75},
    {"id": 15, "name": "Floodplain", "temp_range": [10, 30], "habitability": 0.70},
    
    # Desert Biomes (16-30)
    {"id": 16, "name": "Hot Desert", "temp_range": [25, 55], "habitability": 0.20},
    {"id": 17, "name": "Cold Desert", "temp_range": [-20, 10], "habitability": 0.25},
    {"id": 18, "name": "Coastal Desert", "temp_range": [15, 35], "habitability": 0.30},
    {"id": 19, "name": "Rain Shadow Desert", "temp_range": [10, 40], "habitability": 0.25},
    {"id": 20, "name": "Salt Flat", "temp_range": [20, 45], "habitability": 0.15},
    {"id": 21, "name": "Dune Sea", "temp_range": [25, 50], "habitability": 0.10},
    {"id": 22, "name": "Rocky Desert", "temp_range": [15, 45], "habitability": 0.20},
    {"id": 23, "name": "Badlands", "temp_range": [10, 40], "habitability": 0.15},
    {"id": 24, "name": "Mesa", "temp_range": [15, 35], "habitability": 0.25},
    {"id": 25, "name": "Canyon", "temp_range": [10, 35], "habitability": 0.30},
    {"id": 26, "name": "Volcanic Desert", "temp_range": [30, 60], "habitability": 0.10},
    {"id": 27, "name": "Dust Basin", "temp_range": [20, 50], "habitability": 0.15},
    {"id": 28, "name": "Polar Desert", "temp_range": [-60, -20], "habitability": 0.10},
    {"id": 29, "name": "High Desert", "temp_range": [5, 30], "habitability": 0.30},
    {"id": 30, "name": "Ancient Seabed", "temp_range": [15, 40], "habitability": 0.20},
    
    # Ice Biomes (31-45)
    {"id": 31, "name": "Ice Sheet", "temp_range": [-80, -30], "habitability": 0.05},
    {"id": 32, "name": "Tundra", "temp_range": [-30, 5], "habitability": 0.35},
    {"id": 33, "name": "Permafrost", "temp_range": [-50, -10], "habitability": 0.15},
    {"id": 34, "name": "Glacier", "temp_range": [-60, -20], "habitability": 0.08},
    {"id": 35, "name": "Ice Cap", "temp_range": [-90, -40], "habitability": 0.03},
    {"id": 36, "name": "Snow Field", "temp_range": [-40, 0], "habitability": 0.20},
    {"id": 37, "name": "Frozen Lake", "temp_range": [-50, -10], "habitability": 0.15},
    {"id": 38, "name": "Ice Cave System", "temp_range": [-30, -5], "habitability": 0.25},
    {"id": 39, "name": "Cryogenic Plains", "temp_range": [-100, -50], "habitability": 0.02},
    {"id": 40, "name": "Methane Ice", "temp_range": [-180, -100], "habitability": 0.01},
    {"id": 41, "name": "Nitrogen Ice", "temp_range": [-210, -180], "habitability": 0.01},
    {"id": 42, "name": "Subsurface Ocean", "temp_range": [-5, 10], "habitability": 0.40},
    {"id": 43, "name": "Ice Shelf", "temp_range": [-40, -10], "habitability": 0.10},
    {"id": 44, "name": "Frost Heave", "temp_range": [-30, 0], "habitability": 0.20},
    {"id": 45, "name": "Cryovolcanic", "temp_range": [-80, -30], "habitability": 0.08},
    
    # Ocean Biomes (46-60)
    {"id": 46, "name": "Coral Reef", "temp_range": [20, 30], "habitability": 0.80},
    {"id": 47, "name": "Kelp Forest", "temp_range": [10, 20], "habitability": 0.75},
    {"id": 48, "name": "Open Ocean", "temp_range": [5, 25], "habitability": 0.60},
    {"id": 49, "name": "Deep Sea", "temp_range": [2, 5], "habitability": 0.40},
    {"id": 50, "name": "Hydrothermal Vent", "temp_range": [50, 400], "habitability": 0.50},
    {"id": 51, "name": "Abyssal Plain", "temp_range": [1, 4], "habitability": 0.30},
    {"id": 52, "name": "Continental Shelf", "temp_range": [5, 20], "habitability": 0.70},
    {"id": 53, "name": "Pelagic Zone", "temp_range": [10, 25], "habitability": 0.55},
    {"id": 54, "name": "Seagrass Meadow", "temp_range": [15, 28], "habitability": 0.75},
    {"id": 55, "name": "Estuary", "temp_range": [10, 25], "habitability": 0.70},
    {"id": 56, "name": "Fjord", "temp_range": [0, 15], "habitability": 0.65},
    {"id": 57, "name": "Lagoon", "temp_range": [18, 30], "habitability": 0.75},
    {"id": 58, "name": "Sea Mount", "temp_range": [5, 15], "habitability": 0.50},
    {"id": 59, "name": "Ocean Trench", "temp_range": [1, 4], "habitability": 0.20},
    {"id": 60, "name": "Brine Pool", "temp_range": [5, 15], "habitability": 0.10},
    
    # Volcanic Biomes (61-75)
    {"id": 61, "name": "Lava Field", "temp_range": [100, 1200], "habitability": 0.02},
    {"id": 62, "name": "Volcanic Crater", "temp_range": [50, 300], "habitability": 0.10},
    {"id": 63, "name": "Fumarole Field", "temp_range": [80, 200], "habitability": 0.08},
    {"id": 64, "name": "Obsidian Plain", "temp_range": [30, 80], "habitability": 0.15},
    {"id": 65, "name": "Ash Desert", "temp_range": [20, 60], "habitability": 0.12},
    {"id": 66, "name": "Caldera", "temp_range": [40, 150], "habitability": 0.18},
    {"id": 67, "name": "Lava Tube", "temp_range": [25, 50], "habitability": 0.25},
    {"id": 68, "name": "Sulfur Spring", "temp_range": [60, 120], "habitability": 0.05},
    {"id": 69, "name": "Magma Chamber", "temp_range": [700, 1300], "habitability": 0.01},
    {"id": 70, "name": "Volcanic Island", "temp_range": [20, 40], "habitability": 0.55},
    {"id": 71, "name": "Hot Spring", "temp_range": [35, 95], "habitability": 0.40},
    {"id": 72, "name": "Geyser Basin", "temp_range": [40, 100], "habitability": 0.30},
    {"id": 73, "name": "Shield Volcano", "temp_range": [25, 60], "habitability": 0.35},
    {"id": 74, "name": "Stratovolcano", "temp_range": [15, 50], "habitability": 0.30},
    {"id": 75, "name": "Volcanic Rift", "temp_range": [50, 200], "habitability": 0.08},
    
    # Exotic/Alien Biomes (76-90)
    {"id": 76, "name": "Crystal Forest", "temp_range": [-50, 50], "habitability": 0.30},
    {"id": 77, "name": "Ammonia Sea", "temp_range": [-80, -30], "habitability": 0.15},
    {"id": 78, "name": "Silicon Life Zone", "temp_range": [200, 500], "habitability": 0.20},
    {"id": 79, "name": "Radiation Zone", "temp_range": [-100, 100], "habitability": 0.05},
    {"id": 80, "name": "Anti-Matter Pocket", "temp_range": [-273, 1000], "habitability": 0.01},
    {"id": 81, "name": "Plasma Field", "temp_range": [1000, 10000], "habitability": 0.01},
    {"id": 82, "name": "Bioluminescent Zone", "temp_range": [5, 25], "habitability": 0.70},
    {"id": 83, "name": "Sentient Forest", "temp_range": [10, 30], "habitability": 0.60},
    {"id": 84, "name": "Spore Cloud", "temp_range": [0, 40], "habitability": 0.35},
    {"id": 85, "name": "Fungal Network", "temp_range": [15, 35], "habitability": 0.50},
    {"id": 86, "name": "Void Zone", "temp_range": [-270, -260], "habitability": 0.00},
    {"id": 87, "name": "Dark Energy Nexus", "temp_range": [0, 0], "habitability": 0.02},
    {"id": 88, "name": "Quantum Flux", "temp_range": [-273, 1000000], "habitability": 0.01},
    {"id": 89, "name": "Exotic Matter Pool", "temp_range": [-100, 100], "habitability": 0.03},
    {"id": 90, "name": "Dimensional Rift", "temp_range": [-273, 273], "habitability": 0.01}
]

# ==================== LIFEFORMS ====================
LIFEFORMS = {
    "humans": {
        "name": "Humans",
        "description": "Adaptable species with balanced bonuses",
        "bonuses": {"field_bonus": 0, "resource_bonus": 1.0, "research_bonus": 1.0}
    },
    "rocktal": {
        "name": "Rock'tal",
        "description": "Silicon-based lifeform with enhanced defense",
        "bonuses": {"field_bonus": 5, "defense_bonus": 1.2, "resource_bonus": 1.1}
    },
    "mechas": {
        "name": "Mechas",
        "description": "Cybernetic beings with technology focus",
        "bonuses": {"field_bonus": 10, "research_bonus": 1.25, "ship_bonus": 1.15}
    },
    "kaelesh": {
        "name": "Kaelesh",
        "description": "Ethereal beings with exploration abilities",
        "bonuses": {"field_bonus": 15, "exploration_bonus": 1.3, "speed_bonus": 1.2}
    },
    "cetus": {
        "name": "Cetus",
        "description": "Aquatic giants - BEST for planet size",
        "bonuses": {"field_bonus": 25, "resource_bonus": 1.15, "habitability_bonus": 1.2}
    },
    "vortex": {
        "name": "Vortex",
        "description": "Energy beings with power focus",
        "bonuses": {"field_bonus": 8, "energy_bonus": 1.5, "attack_bonus": 1.1}
    },
    "zephyr": {
        "name": "Zephyr",
        "description": "Gas-based lifeform with fleet speed",
        "bonuses": {"field_bonus": 12, "speed_bonus": 1.35, "deuterium_bonus": 1.2}
    },
    "crystalline": {
        "name": "Crystalline",
        "description": "Crystal-based beings with crystal production",
        "bonuses": {"field_bonus": 7, "crystal_bonus": 1.4, "defense_bonus": 1.1}
    }
}

# ==================== PLAYER CLASSES ====================
PLAYER_CLASSES = {
    "collector": {
        "name": "Collector",
        "description": "Resource focused player class",
        "bonuses": {
            "metal_production": 1.25,
            "crystal_production": 1.25,
            "deuterium_production": 1.25,
            "energy_production": 1.10,
            "planet_size_bonus": 0.0
        }
    },
    "general": {
        "name": "General",
        "description": "Military focused player class",
        "bonuses": {
            "attack_bonus": 1.20,
            "defense_bonus": 1.20,
            "fleet_speed": 1.10,
            "ship_cost_reduction": 0.10,
            "planet_size_bonus": 0.0
        }
    },
    "discoverer": {
        "name": "Discoverer",
        "description": "Exploration focused - 10% PLANET SIZE BONUS",
        "bonuses": {
            "expedition_bonus": 1.30,
            "exploration_slots": 2,
            "discovery_chance": 1.25,
            "planet_size_bonus": 0.10  # +10% planet size on colonization!
        }
    }
}

# ==================== MOON CONFIGURATION ====================
MOON_CONFIG = {
    "base_chance": 0.01,  # 1% per 100k debris
    "max_chance": 0.20,   # 20% maximum
    "debris_per_percent": 100000,
    "size_range": {"min": 1, "max": 8947},  # Max moon size
    "moon_base_fields": 1,
    "field_per_diameter_km": 0.01
}

MOON_FACILITIES = {
    "lunarBase": {"name": "Lunar Base", "fields_per_level": 3, "max_level": 8},
    "sensorPhalanx": {"name": "Sensor Phalanx", "max_level": 10},
    "jumpGate": {"name": "Jump Gate", "max_level": 1},
    "moonShipyard": {"name": "Moon Shipyard", "max_level": 20},
    "moonDefense": {"name": "Moon Defense Platform", "max_level": 15}
}

# ==================== SPACE STATIONS ====================
SPACE_STATIONS = {
    "orbital_station": {
        "name": "Orbital Station",
        "description": "Basic orbital platform for resource processing",
        "max_fields": 50,
        "cost": {"metal": 50000, "crystal": 30000, "deuterium": 10000},
        "bonuses": {"resource_storage": 1.1, "defense_slots": 5}
    },
    "starbase": {
        "name": "Starbase",
        "description": "Large military space station",
        "max_fields": 150,
        "cost": {"metal": 500000, "crystal": 300000, "deuterium": 100000},
        "bonuses": {"fleet_capacity": 1.25, "defense_bonus": 1.2, "repair_rate": 1.5}
    },
    "moonbase": {
        "name": "Moonbase",
        "description": "Surface installation on a moon",
        "max_fields": 100,
        "cost": {"metal": 200000, "crystal": 150000, "deuterium": 50000},
        "bonuses": {"sensor_range": 1.3, "stealth_bonus": 1.2}
    },
    "trading_post": {
        "name": "Trading Post",
        "description": "Commercial space station",
        "max_fields": 75,
        "cost": {"metal": 150000, "crystal": 200000, "deuterium": 30000},
        "bonuses": {"trade_rate": 1.3, "market_slots": 10}
    },
    "research_station": {
        "name": "Research Station",
        "description": "Scientific research platform",
        "max_fields": 60,
        "cost": {"metal": 100000, "crystal": 250000, "deuterium": 75000},
        "bonuses": {"research_speed": 1.2, "tech_points": 1.15}
    },
    "defense_platform": {
        "name": "Defense Platform",
        "description": "Heavily armed orbital weapons platform",
        "max_fields": 40,
        "cost": {"metal": 300000, "crystal": 150000, "deuterium": 50000},
        "bonuses": {"defense_power": 2.0, "shield_strength": 1.5}
    },
    "shipyard_station": {
        "name": "Shipyard Station",
        "description": "Orbital construction facility",
        "max_fields": 120,
        "cost": {"metal": 400000, "crystal": 200000, "deuterium": 100000},
        "bonuses": {"build_speed": 1.3, "ship_capacity": 1.4}
    },
    "colony_hub": {
        "name": "Colony Hub",
        "description": "Central administration for colony networks",
        "max_fields": 80,
        "cost": {"metal": 250000, "crystal": 175000, "deuterium": 75000},
        "bonuses": {"colony_slots": 3, "population_growth": 1.2}
    }
}

# ==================== COMBAT SYSTEM (OGame-style 1-15 turns) ====================
COMBAT_CONFIG = {
    "max_rounds": 15,  # 1-15 turns maximum
    "min_rounds": 1,
    "retreat_chance_per_round": 0.03,  # 3% chance to retreat each round
    "critical_hit_chance": 0.05,
    "shield_regeneration": 0.05,  # 5% per round
    "debris_rate": 0.30,  # 30% of destroyed ships become debris
    "attacker_advantage_first_round": 1.05
}

COMBAT_SHIP_STATS = {
    "lightFighter": {"attack": 50, "shield": 10, "hull": 400, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "heavyFighter": {"attack": 150, "shield": 25, "hull": 1000, "rapidfire": {"smallCargo": 3, "espionageProbe": 5}},
    "cruiser": {"attack": 400, "shield": 50, "hull": 2700, "rapidfire": {"lightFighter": 6, "espionageProbe": 5, "solarSatellite": 5}},
    "battleship": {"attack": 1000, "shield": 200, "hull": 6000, "rapidfire": {"espionageProbe": 5}},
    "battlecruiser": {"attack": 700, "shield": 400, "hull": 7000, "rapidfire": {"smallCargo": 3, "largeCargo": 3, "heavyFighter": 4, "cruiser": 4, "battleship": 7}},
    "bomber": {"attack": 1000, "shield": 500, "hull": 7500, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "destroyer": {"attack": 2000, "shield": 500, "hull": 11000, "rapidfire": {"espionageProbe": 5, "battlecruiser": 2, "lightLaser": 10}},
    "deathstar": {"attack": 200000, "shield": 50000, "hull": 900000, "rapidfire": {"smallCargo": 250, "largeCargo": 250, "lightFighter": 200, "heavyFighter": 100, "cruiser": 33, "battleship": 30, "bomber": 25, "destroyer": 5, "espionageProbe": 1250, "solarSatellite": 1250, "battlecruiser": 15}},
    "smallCargo": {"attack": 5, "shield": 10, "hull": 400, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "largeCargo": {"attack": 5, "shield": 25, "hull": 1200, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "colonyShip": {"attack": 50, "shield": 100, "hull": 3000, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "recycler": {"attack": 1, "shield": 10, "hull": 1600, "rapidfire": {"espionageProbe": 5, "solarSatellite": 5}},
    "espionageProbe": {"attack": 0, "shield": 0, "hull": 100, "rapidfire": {}},
    "solarSatellite": {"attack": 1, "shield": 1, "hull": 200, "rapidfire": {}}
}

COMBAT_DEFENSE_STATS = {
    "rocketLauncher": {"attack": 80, "shield": 20, "hull": 200},
    "lightLaser": {"attack": 100, "shield": 25, "hull": 200},
    "heavyLaser": {"attack": 250, "shield": 100, "hull": 800},
    "gaussCannon": {"attack": 1100, "shield": 200, "hull": 3500},
    "ionCannon": {"attack": 150, "shield": 500, "hull": 800},
    "plasmaTurret": {"attack": 3000, "shield": 300, "hull": 10000},
    "smallShieldDome": {"attack": 1, "shield": 2000, "hull": 2000},
    "largeShieldDome": {"attack": 1, "shield": 10000, "hull": 10000}
}

# ==================== TERRAFORMER CONFIG ====================
TERRAFORMER_CONFIG = {
    "fields_per_level": 5,  # +5 fields per terraformer level
    "max_level": 20,
    "energy_consumption_per_level": 50,
    "cost": {
        "metal": 0,
        "crystal": 50000,
        "deuterium": 100000,
        "energy": 1000,
        "factor": 2.0
    }
}

# ==================== EMPIRE LIMITS ====================
EMPIRE_LIMITS = {
    "min_planets": 1,
    "max_planets": 15,  # Base max planets per player
    "max_planets_with_bonuses": 25,  # With astrophysics and bonuses
    "max_moons": 15,  # One moon per planet max
    "max_stations": 10,  # Max space stations
    "max_empire_size": 999999,  # Total fields across all planets
    "min_page_size": 15,
    "max_page_size": 100,
    "default_page_size": 25
}

# ==================== ALLIANCE BONUSES ====================
ALLIANCE_BONUSES = {
    "member_count_5": {"field_bonus": 2},
    "member_count_10": {"field_bonus": 5},
    "member_count_25": {"field_bonus": 8},
    "member_count_50": {"field_bonus": 12},
    "member_count_100": {"field_bonus": 15}
}

def calculate_max_planet_fields(base_fields: int, position: int, player_class: str, lifeform: str, alliance_size: int = 0, terraformer_level: int = 0) -> int:
    """Calculate maximum planet fields with all bonuses"""
    total = base_fields
    
    # Discoverer class bonus (+10%)
    if player_class == "discoverer":
        total *= 1.10
    
    # Lifeform bonus (Cetus = +25 fields)
    lf_bonus = LIFEFORMS.get(lifeform, {}).get("bonuses", {}).get("field_bonus", 0)
    total += lf_bonus
    
    # Alliance bonus
    if alliance_size >= 100:
        total += ALLIANCE_BONUSES["member_count_100"]["field_bonus"]
    elif alliance_size >= 50:
        total += ALLIANCE_BONUSES["member_count_50"]["field_bonus"]
    elif alliance_size >= 25:
        total += ALLIANCE_BONUSES["member_count_25"]["field_bonus"]
    elif alliance_size >= 10:
        total += ALLIANCE_BONUSES["member_count_10"]["field_bonus"]
    elif alliance_size >= 5:
        total += ALLIANCE_BONUSES["member_count_5"]["field_bonus"]
    
    # Terraformer bonus
    total += terraformer_level * TERRAFORMER_CONFIG["fields_per_level"]
    
    return int(total)
