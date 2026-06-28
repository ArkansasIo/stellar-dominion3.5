"""
Stellar Dominion Backend - Complete Game Server v2.0
Enhanced with comprehensive planet system, combat, moons, stations, and empire management
"""
import os
import json
import time
import hashlib
import secrets
import random
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager
from math import floor

from fastapi import FastAPI, HTTPException, Depends, Request, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
from dotenv import load_dotenv

# Import game configuration
from game_config import (
    PLANET_POSITION_SIZE, FIELD_SIZE_CATEGORIES, PLANET_CLASSES, PLANET_TYPES,
    BIOMES, LIFEFORMS, PLAYER_CLASSES, MOON_CONFIG, MOON_FACILITIES,
    SPACE_STATIONS, COMBAT_CONFIG, COMBAT_SHIP_STATS, COMBAT_DEFENSE_STATS,
    TERRAFORMER_CONFIG, EMPIRE_LIMITS, ALLIANCE_BONUSES, calculate_max_planet_fields
)

# Import starship configuration
from starship_config import (
    STARSHIP_CLASSES, STARSHIP_TYPES, WEAPON_SYSTEMS, ENGINE_SYSTEMS,
    SHIELD_SYSTEMS, ARMOR_SYSTEMS, ALL_STARSHIPS, MOTHERSHIPS
)

# Import universe configuration
from universe_config import (
    UNIVERSE_CONFIG, UNIVERSES, GALAXIES_BY_UNIVERSE,
    COMMANDER_CLASSES, COMMANDER_STATS, COMMANDER_SKILLS, COMMANDER_EQUIPMENT, COMMANDER_RANKS,
    GOVERNMENT_TYPES, GOVERNMENT_POLICIES,
    POPULATION_CONFIG, POPULATION_CLASSES, POPULATION_NEEDS, HAPPINESS_FACTORS,
    SCANNER_CONFIG, SCANNER_LEVELS, SCAN_DETAIL_LEVELS,
    STATION_FIELD_CONFIG, MOON_FIELD_CONFIG, STARBASE_FACILITIES
)

load_dotenv()

# MongoDB Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "stellar_dominion")

# Initialize MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
player_states_collection = db["player_states"]
planets_collection = db["planets"]
moons_collection = db["moons"]
stations_collection = db["stations"]
sessions_collection = db["sessions"]
messages_collection = db["messages"]
alliances_collection = db["alliances"]
market_orders_collection = db["market_orders"]
combat_reports_collection = db["combat_reports"]
expeditions_collection = db["expeditions"]


# ==================== GAME CONFIGURATION ====================

INITIAL_RESOURCES = {
    "metal": 50000,
    "crystal": 30000,
    "deuterium": 20000,
    "energy": 500
}

RESOURCE_PRODUCTION = {
    "metalMine": {"metal": 30, "energy": -10},
    "crystalMine": {"crystal": 20, "energy": -10},
    "deuteriumSynthesizer": {"deuterium": 10, "energy": -20},
    "solarPlant": {"energy": 20},
    "fusionReactor": {"energy": 50, "deuterium": -10}
}

BUILDING_COSTS = {
    "metalMine": {"metal": 60, "crystal": 15, "factor": 1.5},
    "crystalMine": {"metal": 48, "crystal": 24, "factor": 1.6},
    "deuteriumSynthesizer": {"metal": 225, "crystal": 75, "factor": 1.5},
    "solarPlant": {"metal": 75, "crystal": 30, "factor": 1.5},
    "fusionReactor": {"metal": 900, "crystal": 360, "deuterium": 180, "factor": 1.8},
    "roboticsFactory": {"metal": 400, "crystal": 120, "deuterium": 200, "factor": 2.0},
    "shipyard": {"metal": 400, "crystal": 200, "deuterium": 100, "factor": 2.0},
    "researchLab": {"metal": 200, "crystal": 400, "deuterium": 200, "factor": 2.0},
    "allianceDepot": {"metal": 20000, "crystal": 40000, "factor": 2.0},
    "missileSilo": {"metal": 20000, "crystal": 20000, "deuterium": 1000, "factor": 2.0},
    "naniteFactory": {"metal": 1000000, "crystal": 500000, "deuterium": 100000, "factor": 2.0},
    "terraformer": {"metal": 0, "crystal": 50000, "deuterium": 100000, "energy": 1000, "factor": 2.0},
    "spaceDock": {"metal": 200, "crystal": 0, "deuterium": 50, "energy": 50, "factor": 5.0},
    "lunarBase": {"metal": 20000, "crystal": 40000, "deuterium": 20000, "factor": 2.0},
    "sensorPhalanx": {"metal": 20000, "crystal": 40000, "deuterium": 20000, "factor": 2.0},
    "jumpGate": {"metal": 2000000, "crystal": 4000000, "deuterium": 2000000, "factor": 2.0}
}

RESEARCH_COSTS = {
    "energyTechnology": {"metal": 0, "crystal": 800, "deuterium": 400, "factor": 2.0},
    "laserTechnology": {"metal": 200, "crystal": 100, "factor": 2.0},
    "ionTechnology": {"metal": 1000, "crystal": 300, "deuterium": 100, "factor": 2.0},
    "hyperspaceTechnology": {"metal": 0, "crystal": 4000, "deuterium": 2000, "factor": 2.0},
    "plasmaTechnology": {"metal": 2000, "crystal": 4000, "deuterium": 1000, "factor": 2.0},
    "combustionDrive": {"metal": 400, "crystal": 0, "deuterium": 600, "factor": 2.0},
    "impulseDrive": {"metal": 2000, "crystal": 4000, "deuterium": 600, "factor": 2.0},
    "hyperspaceDrive": {"metal": 10000, "crystal": 20000, "deuterium": 6000, "factor": 2.0},
    "espionageTechnology": {"metal": 200, "crystal": 1000, "deuterium": 200, "factor": 2.0},
    "computerTechnology": {"metal": 0, "crystal": 400, "deuterium": 600, "factor": 2.0},
    "astrophysics": {"metal": 4000, "crystal": 8000, "deuterium": 4000, "factor": 1.75},
    "intergalacticResearchNetwork": {"metal": 240000, "crystal": 400000, "deuterium": 160000, "factor": 2.0},
    "gravitonTechnology": {"metal": 0, "crystal": 0, "deuterium": 0, "energy": 300000, "factor": 3.0},
    "weaponsTechnology": {"metal": 800, "crystal": 200, "factor": 2.0},
    "shieldingTechnology": {"metal": 200, "crystal": 600, "factor": 2.0},
    "armorTechnology": {"metal": 1000, "crystal": 0, "factor": 2.0}
}

SHIP_COSTS = {
    "lightFighter": {"metal": 3000, "crystal": 1000, "buildTime": 30},
    "heavyFighter": {"metal": 6000, "crystal": 4000, "buildTime": 60},
    "cruiser": {"metal": 20000, "crystal": 7000, "deuterium": 2000, "buildTime": 120},
    "battleship": {"metal": 45000, "crystal": 15000, "buildTime": 240},
    "battlecruiser": {"metal": 30000, "crystal": 40000, "deuterium": 15000, "buildTime": 300},
    "bomber": {"metal": 50000, "crystal": 25000, "deuterium": 15000, "buildTime": 240},
    "destroyer": {"metal": 60000, "crystal": 50000, "deuterium": 15000, "buildTime": 360},
    "deathstar": {"metal": 5000000, "crystal": 4000000, "deuterium": 1000000, "buildTime": 7200},
    "smallCargo": {"metal": 2000, "crystal": 2000, "buildTime": 20},
    "largeCargo": {"metal": 6000, "crystal": 6000, "buildTime": 40},
    "colonyShip": {"metal": 10000, "crystal": 20000, "deuterium": 10000, "buildTime": 600},
    "recycler": {"metal": 10000, "crystal": 6000, "deuterium": 2000, "buildTime": 120},
    "espionageProbe": {"metal": 0, "crystal": 1000, "buildTime": 10},
    "solarSatellite": {"metal": 0, "crystal": 2000, "deuterium": 500, "buildTime": 30}
}

DEFENSE_COSTS = {
    "rocketLauncher": {"metal": 2000, "buildTime": 10},
    "lightLaser": {"metal": 1500, "crystal": 500, "buildTime": 15},
    "heavyLaser": {"metal": 6000, "crystal": 2000, "buildTime": 30},
    "gaussCannon": {"metal": 20000, "crystal": 15000, "deuterium": 2000, "buildTime": 60},
    "ionCannon": {"metal": 5000, "crystal": 3000, "buildTime": 45},
    "plasmaTurret": {"metal": 50000, "crystal": 50000, "deuterium": 30000, "buildTime": 120},
    "smallShieldDome": {"metal": 10000, "crystal": 10000, "buildTime": 120},
    "largeShieldDome": {"metal": 50000, "crystal": 50000, "buildTime": 300},
    "antiBallisticMissiles": {"metal": 8000, "crystal": 0, "deuterium": 2000, "buildTime": 30},
    "interplanetaryMissiles": {"metal": 12500, "crystal": 2500, "deuterium": 10000, "buildTime": 60}
}

MEGASTRUCTURES = {
    "dysonSphere": {"metal": 5000000, "crystal": 3000000, "deuterium": 1000000, "energy": 100000},
    "ringworld": {"metal": 10000000, "crystal": 5000000, "deuterium": 2000000, "energy": 200000},
    "stellarEngine": {"metal": 8000000, "crystal": 4000000, "deuterium": 3000000, "energy": 150000}
}


# ==================== PYDANTIC MODELS ====================

class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class AccountSetup(BaseModel):
    planetName: str = "New Colony"
    commanderType: str = "militarist"
    governmentType: str = "democracy"
    faction: str = "terran"
    playerClass: str = "collector"
    lifeform: str = "humans"

class BuildingUpgrade(BaseModel):
    buildingType: str
    planetId: Optional[str] = None

class ResearchStart(BaseModel):
    techId: str

class ShipBuild(BaseModel):
    shipType: str
    quantity: int = 1

class DefenseBuild(BaseModel):
    defenseType: str
    quantity: int = 1

class FleetMission(BaseModel):
    targetCoordinates: str
    missionType: str
    ships: Dict[str, int]
    resources: Optional[Dict[str, int]] = None

class ColonizePlanet(BaseModel):
    coordinates: str
    planetName: str = "New Colony"

class AttackMission(BaseModel):
    targetPlayerId: str
    targetPlanetId: str
    ships: Dict[str, int]

class StealPlanet(BaseModel):
    targetPlanetId: str
    ships: Dict[str, int]

class MarketOrder(BaseModel):
    resourceType: str
    quantity: int
    pricePerUnit: float
    orderType: str

class MessageSend(BaseModel):
    recipientId: str
    subject: str
    content: str

class AllianceCreate(BaseModel):
    name: str
    tag: str
    description: str = ""

class StationBuild(BaseModel):
    stationType: str
    planetId: str


# ==================== HELPER FUNCTIONS ====================

def get_timestamp():
    return datetime.now(timezone.utc)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_hex(32)

def calculate_cost(base_costs: dict, level: int) -> dict:
    factor = base_costs.get("factor", 1.5)
    costs = {}
    for resource, amount in base_costs.items():
        if resource not in ["factor", "buildTime"]:
            costs[resource] = int(amount * (factor ** level))
    return costs

def calculate_production(buildings: dict) -> dict:
    production = {"metal": 20, "crystal": 10, "deuterium": 0, "energy": 0}
    for building, level in buildings.items():
        if building in RESOURCE_PRODUCTION and level > 0:
            for resource, base_prod in RESOURCE_PRODUCTION[building].items():
                production[resource] = production.get(resource, 0) + int(base_prod * level * 1.1 ** level)
    return production

def calculate_empire_score(player_state: dict) -> int:
    score = 0
    buildings = player_state.get("buildings", {})
    for building, level in buildings.items():
        score += level * 100
    research = player_state.get("research", {})
    for tech, level in research.items():
        score += level * 200
    units = player_state.get("units", {})
    for unit, count in units.items():
        ship_data = SHIP_COSTS.get(unit, {})
        unit_value = (ship_data.get("metal", 0) + ship_data.get("crystal", 0) + ship_data.get("deuterium", 0)) // 1000
        score += count * unit_value
    defense = player_state.get("defense", {})
    for def_type, count in defense.items():
        def_data = DEFENSE_COSTS.get(def_type, {})
        def_value = (def_data.get("metal", 0) + def_data.get("crystal", 0) + def_data.get("deuterium", 0)) // 1000
        score += count * def_value
    return score

def calculate_fleet_power(units: dict) -> int:
    power = 0
    for ship, count in units.items():
        stats = COMBAT_SHIP_STATS.get(ship, {"attack": 10})
        power += stats["attack"] * count
    return power

def generate_coordinates() -> str:
    galaxy = random.randint(1, 9)
    system = random.randint(1, 499)
    position = random.randint(1, 15)
    return f"[{galaxy}:{system}:{position}]"

def parse_coordinates(coords: str) -> tuple:
    """Parse [galaxy:system:position] format"""
    try:
        cleaned = coords.strip("[]")
        parts = cleaned.split(":")
        return int(parts[0]), int(parts[1]), int(parts[2])
    except:
        return 1, 1, 1

def generate_planet(position: int, player_class: str = "collector", lifeform: str = "humans") -> dict:
    """Generate a planet with proper size based on position"""
    pos_config = PLANET_POSITION_SIZE.get(position, PLANET_POSITION_SIZE[8])
    
    base_fields = random.randint(pos_config["min"], pos_config["max"])
    temperature = random.randint(pos_config["temp_min"], pos_config["temp_max"])
    
    # Apply class bonus
    class_bonus = PLAYER_CLASSES.get(player_class, {}).get("bonuses", {}).get("planet_size_bonus", 0)
    if class_bonus > 0:
        base_fields = int(base_fields * (1 + class_bonus))
    
    # Apply lifeform bonus
    lf_bonus = LIFEFORMS.get(lifeform, {}).get("bonuses", {}).get("field_bonus", 0)
    base_fields += lf_bonus
    
    # Select planet type and class
    planet_class_id = random.choice(list(PLANET_CLASSES.keys()))
    planet_class = PLANET_CLASSES[planet_class_id]
    
    planet_type_id = random.choice(list(PLANET_TYPES.keys()))
    planet_type = PLANET_TYPES[planet_type_id]
    subtype = random.choice(planet_type.get("subtypes", [{"id": "default", "name": "Standard"}]))
    
    # Select biome based on temperature
    suitable_biomes = [b for b in BIOMES if b["temp_range"][0] <= temperature <= b["temp_range"][1]]
    if not suitable_biomes:
        suitable_biomes = BIOMES[:5]
    biome = random.choice(suitable_biomes)
    
    # Calculate diameter
    diameter = random.randint(8000, 16000)
    
    # Determine size category
    size_category = "normal"
    for cat_id, cat_data in FIELD_SIZE_CATEGORIES.items():
        if cat_data["min"] <= base_fields <= cat_data["max"]:
            size_category = cat_id
            break
    
    return {
        "baseFields": base_fields,
        "currentFields": 0,
        "maxFields": base_fields,
        "temperature": temperature,
        "diameter": diameter,
        "planetClass": planet_class_id,
        "planetClassName": planet_class["name"],
        "planetType": planet_type_id,
        "planetTypeName": planet_type["name"],
        "planetSubtype": subtype["id"],
        "planetSubtypeName": subtype["name"],
        "biomeId": biome["id"],
        "biomeName": biome["name"],
        "habitability": planet_class["habitability"],
        "resourceMod": planet_class["resource_mod"],
        "energyMod": planet_class.get("energy_mod", 1.0),
        "metalBonus": subtype.get("metal_bonus", 1.0),
        "crystalBonus": subtype.get("crystal_bonus", 1.0),
        "deuteriumBonus": subtype.get("deuterium_bonus", 1.0),
        "sizeCategory": size_category,
        "position": position
    }

def generate_moon(debris_amount: int = 100000) -> Optional[dict]:
    """Generate moon based on debris from combat"""
    chance = min(debris_amount / MOON_CONFIG["debris_per_percent"] * MOON_CONFIG["base_chance"], MOON_CONFIG["max_chance"])
    
    if random.random() > chance:
        return None
    
    diameter = random.randint(2000, 8947)
    base_fields = MOON_CONFIG["moon_base_fields"] + int(diameter * MOON_CONFIG["field_per_diameter_km"])
    
    return {
        "diameter": diameter,
        "baseFields": base_fields,
        "maxFields": base_fields,
        "currentFields": 0,
        "temperature": random.randint(-100, -20),
        "facilities": {facility: 0 for facility in MOON_FACILITIES.keys()},
        "createdAt": get_timestamp()
    }

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
            else:
                result[key] = value
        return result
    return doc


# ==================== COMBAT SYSTEM ====================

def simulate_combat(attacker_fleet: dict, attacker_tech: dict, defender_fleet: dict, defender_defense: dict, defender_tech: dict) -> dict:
    """
    OGame-style combat simulation with 1-15 rounds
    """
    battle_log = []
    rounds = []
    
    # Initialize combatants
    attacker_units = []
    for ship_type, count in attacker_fleet.items():
        stats = COMBAT_SHIP_STATS.get(ship_type, {"attack": 10, "shield": 10, "hull": 100})
        for i in range(count):
            attacker_units.append({
                "type": ship_type,
                "attack": stats["attack"],
                "shield": stats["shield"],
                "maxShield": stats["shield"],
                "hull": stats["hull"],
                "maxHull": stats["hull"],
                "rapidfire": stats.get("rapidfire", {})
            })
    
    defender_units = []
    for ship_type, count in defender_fleet.items():
        stats = COMBAT_SHIP_STATS.get(ship_type, {"attack": 10, "shield": 10, "hull": 100})
        for i in range(count):
            defender_units.append({
                "type": ship_type,
                "attack": stats["attack"],
                "shield": stats["shield"],
                "maxShield": stats["shield"],
                "hull": stats["hull"],
                "maxHull": stats["hull"],
                "rapidfire": stats.get("rapidfire", {}),
                "isShip": True
            })
    
    for def_type, count in defender_defense.items():
        stats = COMBAT_DEFENSE_STATS.get(def_type, {"attack": 10, "shield": 10, "hull": 100})
        for i in range(count):
            defender_units.append({
                "type": def_type,
                "attack": stats["attack"],
                "shield": stats["shield"],
                "maxShield": stats["shield"],
                "hull": stats["hull"],
                "maxHull": stats["hull"],
                "rapidfire": {},
                "isShip": False
            })
    
    battle_log.append(f"Battle begins: {len(attacker_units)} attacking units vs {len(defender_units)} defending units")
    
    # Combat rounds (1-15)
    for round_num in range(1, COMBAT_CONFIG["max_rounds"] + 1):
        if not attacker_units or not defender_units:
            break
        
        round_log = {"round": round_num, "events": []}
        
        # Regenerate shields
        for unit in attacker_units + defender_units:
            unit["shield"] = min(unit["shield"] + unit["maxShield"] * COMBAT_CONFIG["shield_regeneration"], unit["maxShield"])
        
        # Attacker fires
        attacker_destroyed = 0
        for attacker in attacker_units:
            if not defender_units:
                break
            
            target_idx = random.randint(0, len(defender_units) - 1)
            target = defender_units[target_idx]
            
            damage = attacker["attack"]
            
            # Apply damage to shield first
            if target["shield"] > 0:
                shield_damage = min(damage, target["shield"])
                target["shield"] -= shield_damage
                damage -= shield_damage
            
            # Remaining damage to hull
            if damage > 0:
                target["hull"] -= damage
                if target["hull"] <= 0:
                    defender_units.pop(target_idx)
                    attacker_destroyed += 1
                    round_log["events"].append(f"Attacker {attacker['type']} destroyed defender {target['type']}")
            
            # Rapidfire
            if attacker["rapidfire"].get(target["type"]):
                rf_chance = 1 - 1 / attacker["rapidfire"][target["type"]]
                while random.random() < rf_chance and defender_units:
                    target_idx = random.randint(0, len(defender_units) - 1)
                    target = defender_units[target_idx]
                    target["hull"] -= attacker["attack"]
                    if target["hull"] <= 0:
                        defender_units.pop(target_idx)
                        attacker_destroyed += 1
        
        # Defender fires
        defender_destroyed = 0
        for defender in defender_units:
            if not attacker_units:
                break
            
            target_idx = random.randint(0, len(attacker_units) - 1)
            target = attacker_units[target_idx]
            
            damage = defender["attack"]
            
            if target["shield"] > 0:
                shield_damage = min(damage, target["shield"])
                target["shield"] -= shield_damage
                damage -= shield_damage
            
            if damage > 0:
                target["hull"] -= damage
                if target["hull"] <= 0:
                    attacker_units.pop(target_idx)
                    defender_destroyed += 1
                    round_log["events"].append(f"Defender {defender['type']} destroyed attacker {target['type']}")
        
        round_log["attackerRemaining"] = len(attacker_units)
        round_log["defenderRemaining"] = len(defender_units)
        round_log["attackerLost"] = defender_destroyed
        round_log["defenderLost"] = attacker_destroyed
        rounds.append(round_log)
        
        battle_log.append(f"Round {round_num}: Attacker lost {defender_destroyed}, Defender lost {attacker_destroyed}")
    
    # Determine winner
    if not defender_units:
        winner = "attacker"
    elif not attacker_units:
        winner = "defender"
    else:
        # Draw - compare remaining power
        attacker_power = sum(u["hull"] for u in attacker_units)
        defender_power = sum(u["hull"] for u in defender_units)
        winner = "attacker" if attacker_power > defender_power else "defender"
    
    # Calculate debris
    total_metal = 0
    total_crystal = 0
    for ship_type, count in attacker_fleet.items():
        remaining = len([u for u in attacker_units if u["type"] == ship_type])
        destroyed = count - remaining
        cost = SHIP_COSTS.get(ship_type, {})
        total_metal += int(cost.get("metal", 0) * destroyed * COMBAT_CONFIG["debris_rate"])
        total_crystal += int(cost.get("crystal", 0) * destroyed * COMBAT_CONFIG["debris_rate"])
    
    for ship_type, count in defender_fleet.items():
        remaining = len([u for u in defender_units if u["type"] == ship_type and u.get("isShip")])
        destroyed = count - remaining
        cost = SHIP_COSTS.get(ship_type, {})
        total_metal += int(cost.get("metal", 0) * destroyed * COMBAT_CONFIG["debris_rate"])
        total_crystal += int(cost.get("crystal", 0) * destroyed * COMBAT_CONFIG["debris_rate"])
    
    # Calculate surviving units
    attacker_survivors = {}
    for unit in attacker_units:
        attacker_survivors[unit["type"]] = attacker_survivors.get(unit["type"], 0) + 1
    
    defender_survivors = {}
    for unit in defender_units:
        defender_survivors[unit["type"]] = defender_survivors.get(unit["type"], 0) + 1
    
    return {
        "winner": winner,
        "rounds": len(rounds),
        "roundDetails": rounds,
        "battleLog": battle_log,
        "debris": {"metal": total_metal, "crystal": total_crystal},
        "attackerSurvivors": attacker_survivors,
        "defenderSurvivors": defender_survivors,
        "moonChance": min(total_metal / MOON_CONFIG["debris_per_percent"] * MOON_CONFIG["base_chance"], MOON_CONFIG["max_chance"])
    }


# ==================== SESSION MANAGEMENT ====================

sessions_store: Dict[str, dict] = {}

def get_session(request: Request) -> Optional[dict]:
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if token and token in sessions_store:
        return sessions_store[token]
    return None

def require_auth(request: Request) -> dict:
    session = get_session(request)
    if not session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return session


# ==================== FASTAPI APP ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Stellar Dominion Server v2.0 Starting...")
    users_collection.create_index("username", unique=True)
    player_states_collection.create_index("userId")
    planets_collection.create_index("userId")
    planets_collection.create_index("coordinates")
    moons_collection.create_index("planetId")
    stations_collection.create_index("userId")
    combat_reports_collection.create_index([("attackerId", 1), ("createdAt", -1)])
    print("✅ Database indexes created")
    print(f"📊 Connected to MongoDB: {DB_NAME}")
    yield
    print("👋 Stellar Dominion Server Shutting Down...")

app = FastAPI(
    title="Stellar Dominion API v2.0",
    description="A comprehensive 4X space strategy game backend with enhanced planet system",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/register")
async def register(data: UserRegister, response: Response):
    existing = users_collection.find_one({"username": data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_doc = {
        "username": data.username,
        "passwordHash": hash_password(data.password),
        "createdAt": get_timestamp(),
        "updatedAt": get_timestamp()
    }
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    token = generate_session_token()
    sessions_store[token] = {"userId": user_id, "username": data.username}
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax")
    
    return {"userId": user_id, "username": data.username, "token": token}


@app.post("/api/auth/login")
async def login(data: UserLogin, response: Response):
    user = users_collection.find_one({"username": data.username})
    if not user or user["passwordHash"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    token = generate_session_token()
    sessions_store[token] = {"userId": user_id, "username": data.username}
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax")
    
    return {"userId": user_id, "username": data.username, "token": token}


@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token and token in sessions_store:
        del sessions_store[token]
    response.delete_cookie("session_token")
    return {"success": True}


@app.get("/api/auth/me")
async def get_current_user(request: Request):
    session = get_session(request)
    if not session:
        return {"authenticated": False}
    player_state = player_states_collection.find_one({"userId": session["userId"]})
    return {
        "authenticated": True,
        "userId": session["userId"],
        "username": session["username"],
        "needsSetup": player_state is None or not player_state.get("setupComplete", False)
    }


@app.get("/api/auth/user")
async def get_auth_user(request: Request):
    session = get_session(request)
    if not session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    player_state = player_states_collection.find_one({"userId": session["userId"]})
    needs_setup = player_state is None or not player_state.get("setupComplete", False)
    return {
        "id": session["userId"],
        "username": session["username"],
        "needsSetup": needs_setup,
        "isAdmin": False,
        "role": "player"
    }


# ==================== PLAYER STATE & SETUP ====================

@app.post("/api/player/setup")
async def setup_player(data: AccountSetup, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    existing = player_states_collection.find_one({"userId": user_id})
    if existing and existing.get("setupComplete"):
        raise HTTPException(status_code=400, detail="Account already setup")
    
    # Generate homeworld at position 8 (optimal)
    position = 8
    galaxy = random.randint(1, 9)
    system = random.randint(1, 499)
    coordinates = f"[{galaxy}:{system}:{position}]"
    
    # Generate planet with class and lifeform bonuses
    planet_data = generate_planet(position, data.playerClass, data.lifeform)
    
    # Commander config
    commander_templates = {
        "militarist": {"attackBonus": 0.15, "defenseBonus": 0.05, "fleetSpeed": 0.1},
        "economist": {"resourceBonus": 0.2, "tradingBonus": 0.15, "buildSpeed": 0.1},
        "scientist": {"researchBonus": 0.25, "techUnlock": 0.1, "energyBonus": 0.05},
        "explorer": {"expeditionBonus": 0.2, "discoveryBonus": 0.15, "fleetCapacity": 0.1},
        "diplomat": {"allianceBonus": 0.15, "tradeBonus": 0.1, "peaceBonus": 0.2}
    }
    commander = {
        "name": "Commander",
        "type": data.commanderType,
        "level": 1,
        "experience": 0,
        "bonuses": commander_templates.get(data.commanderType, commander_templates["militarist"]),
        "skills": [],
        "equipment": []
    }
    
    # Government config
    government_types = {
        "democracy": {"resourceBonus": 0.1, "researchBonus": 0.05, "happiness": 0.15},
        "autocracy": {"attackBonus": 0.15, "buildSpeed": 0.1, "control": 0.2},
        "oligarchy": {"tradingBonus": 0.2, "resourceBonus": 0.05, "influence": 0.15},
        "technocracy": {"researchBonus": 0.2, "energyBonus": 0.1, "innovation": 0.15},
        "theocracy": {"defenseBonus": 0.15, "happiness": 0.1, "unity": 0.2}
    }
    government = {
        "type": data.governmentType,
        "stability": 100,
        "approval": 75,
        "bonuses": government_types.get(data.governmentType, government_types["democracy"]),
        "policies": [],
        "leaders": []
    }
    
    # Create planet document
    planet_doc = {
        "userId": user_id,
        "name": data.planetName,
        "coordinates": coordinates,
        "isHomeworld": True,
        **planet_data,
        "resources": INITIAL_RESOURCES.copy(),
        "buildings": {
            "metalMine": 1,
            "crystalMine": 1,
            "deuteriumSynthesizer": 0,
            "solarPlant": 1,
            "roboticsFactory": 0,
            "shipyard": 0,
            "researchLab": 0,
            "terraformer": 0
        },
        "units": {},
        "defense": {},
        "moon": None,
        "createdAt": get_timestamp()
    }
    planet_result = planets_collection.insert_one(planet_doc)
    planet_id = str(planet_result.inserted_id)
    
    # Create player state
    player_state = {
        "userId": user_id,
        "setupComplete": True,
        "playerClass": data.playerClass,
        "lifeform": data.lifeform,
        "faction": data.faction,
        "commander": commander,
        "government": government,
        "homeworldId": planet_id,
        "currentPlanetId": planet_id,
        "planets": [planet_id],
        "moons": [],
        "stations": [],
        "research": {},
        "empireLevel": 1,
        "empireExperience": 0,
        "tier": 1,
        "tierExperience": 0,
        "totalTurns": 0,
        "currentTurns": 100,
        "maxPlanets": EMPIRE_LIMITS["max_planets"],
        "totalFields": planet_data["maxFields"],
        "usedFields": 0,
        "missions": [],
        "buildQueue": [],
        "researchQueue": [],
        "lastResourceUpdate": get_timestamp(),
        "createdAt": get_timestamp(),
        "updatedAt": get_timestamp()
    }
    
    if existing:
        player_states_collection.update_one({"userId": user_id}, {"$set": player_state})
    else:
        player_states_collection.insert_one(player_state)
    
    # Return combined state for frontend
    result = serialize_doc(player_state)
    result["planetName"] = data.planetName
    result["coordinates"] = coordinates
    result["planetType"] = planet_data
    result["resources"] = INITIAL_RESOURCES.copy()
    result["buildings"] = planet_doc["buildings"]
    result["units"] = {}
    result["defense"] = {}
    
    return result


@app.get("/api/player/state")
async def get_player_state(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return {"needsSetup": True}
    
    # Get current planet
    current_planet_id = player_state.get("currentPlanetId")
    if current_planet_id:
        planet = planets_collection.find_one({"_id": ObjectId(current_planet_id)})
        if planet:
            player_state["planetName"] = planet.get("name")
            player_state["coordinates"] = planet.get("coordinates")
            player_state["planetType"] = {
                "type": planet.get("planetTypeName"),
                "class": planet.get("planetClass"),
                "habitability": planet.get("habitability"),
                "resourceMod": planet.get("resourceMod")
            }
            player_state["resources"] = planet.get("resources", INITIAL_RESOURCES.copy())
            player_state["buildings"] = planet.get("buildings", {})
            player_state["units"] = planet.get("units", {})
            player_state["defense"] = planet.get("defense", {})
    
    production = calculate_production(player_state.get("buildings", {}))
    empire_score = calculate_empire_score(player_state)
    fleet_power = calculate_fleet_power(player_state.get("units", {}))
    
    result = serialize_doc(player_state)
    result["production"] = production
    result["empireScore"] = empire_score
    result["fleetPower"] = fleet_power
    
    return result


@app.get("/api/game/state")
async def get_game_state(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return {"setupComplete": False}
    
    # Get current planet data
    current_planet_id = player_state.get("currentPlanetId")
    planet = None
    if current_planet_id:
        planet = planets_collection.find_one({"_id": ObjectId(current_planet_id)})
    
    if planet:
        player_state["planetName"] = planet.get("name")
        player_state["coordinates"] = planet.get("coordinates")
        player_state["planetType"] = {
            "type": planet.get("planetTypeName"),
            "class": planet.get("planetClass"),
            "habitability": planet.get("habitability"),
            "resourceMod": planet.get("resourceMod")
        }
        player_state["resources"] = planet.get("resources", INITIAL_RESOURCES.copy())
        player_state["buildings"] = planet.get("buildings", {})
        player_state["units"] = planet.get("units", {})
        player_state["defense"] = planet.get("defense", {})
        player_state["planetData"] = {
            "baseFields": planet.get("baseFields"),
            "maxFields": planet.get("maxFields"),
            "currentFields": planet.get("currentFields", 0),
            "temperature": planet.get("temperature"),
            "diameter": planet.get("diameter"),
            "biome": planet.get("biomeName"),
            "sizeCategory": planet.get("sizeCategory")
        }
    
    production = calculate_production(player_state.get("buildings", {}))
    empire_score = calculate_empire_score(player_state)
    fleet_power = calculate_fleet_power(player_state.get("units", {}))
    
    result = serialize_doc(player_state)
    result["production"] = production
    result["empireScore"] = empire_score
    result["fleetPower"] = fleet_power
    
    return result


@app.put("/api/game/state")
async def save_game_state(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    protected_fields = ["_id", "userId", "createdAt", "id"]
    for field in protected_fields:
        data.pop(field, None)
    data["updatedAt"] = get_timestamp()
    
    player_states_collection.update_one({"userId": user_id}, {"$set": data}, upsert=True)
    return {"success": True}


# ==================== PLANETS ENDPOINTS ====================

@app.get("/api/planets")
async def get_player_planets(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=EMPIRE_LIMITS["min_page_size"], le=EMPIRE_LIMITS["max_page_size"])
):
    """Get all planets for current player with pagination"""
    session = require_auth(request)
    user_id = session["userId"]
    
    total = planets_collection.count_documents({"userId": user_id})
    skip = (page - 1) * per_page
    
    planets = list(planets_collection.find({"userId": user_id}).skip(skip).limit(per_page))
    
    return {
        "planets": [serialize_doc(p) for p in planets],
        "pagination": {
            "page": page,
            "perPage": per_page,
            "total": total,
            "totalPages": (total + per_page - 1) // per_page
        }
    }


@app.get("/api/planets/{planet_id}")
async def get_planet(planet_id: str, request: Request):
    """Get specific planet details"""
    session = require_auth(request)
    user_id = session["userId"]
    
    planet = planets_collection.find_one({"_id": ObjectId(planet_id), "userId": user_id})
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    # Get moon if exists
    moon = moons_collection.find_one({"planetId": planet_id})
    if moon:
        planet["moon"] = serialize_doc(moon)
    
    return serialize_doc(planet)


@app.post("/api/planets/select/{planet_id}")
async def select_planet(planet_id: str, request: Request):
    """Switch to a different planet"""
    session = require_auth(request)
    user_id = session["userId"]
    
    planet = planets_collection.find_one({"_id": ObjectId(planet_id), "userId": user_id})
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"currentPlanetId": planet_id, "updatedAt": get_timestamp()}}
    )
    
    return {"success": True, "planetId": planet_id}


@app.post("/api/planets/colonize")
async def colonize_planet(data: ColonizePlanet, request: Request):
    """Colonize a new planet"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Check planet limit
    current_planets = len(player_state.get("planets", []))
    max_planets = player_state.get("maxPlanets", EMPIRE_LIMITS["max_planets"])
    
    if current_planets >= max_planets:
        raise HTTPException(status_code=400, detail=f"Maximum planets reached ({max_planets})")
    
    # Check if coordinates are available
    existing = planets_collection.find_one({"coordinates": data.coordinates})
    if existing:
        raise HTTPException(status_code=400, detail="Coordinates already occupied")
    
    # Check for colony ship
    current_planet_id = player_state.get("currentPlanetId")
    current_planet = planets_collection.find_one({"_id": ObjectId(current_planet_id)})
    
    if not current_planet or current_planet.get("units", {}).get("colonyShip", 0) < 1:
        raise HTTPException(status_code=400, detail="Colony ship required")
    
    # Parse coordinates
    galaxy, system, position = parse_coordinates(data.coordinates)
    
    # Generate new planet
    player_class = player_state.get("playerClass", "collector")
    lifeform = player_state.get("lifeform", "humans")
    planet_data = generate_planet(position, player_class, lifeform)
    
    # Create planet
    planet_doc = {
        "userId": user_id,
        "name": data.planetName,
        "coordinates": data.coordinates,
        "isHomeworld": False,
        **planet_data,
        "resources": {"metal": 500, "crystal": 500, "deuterium": 0, "energy": 0},
        "buildings": {},
        "units": {},
        "defense": {},
        "moon": None,
        "createdAt": get_timestamp()
    }
    result = planets_collection.insert_one(planet_doc)
    planet_id = str(result.inserted_id)
    
    # Remove colony ship from current planet
    current_planet["units"]["colonyShip"] -= 1
    planets_collection.update_one(
        {"_id": ObjectId(current_planet_id)},
        {"$set": {"units": current_planet["units"]}}
    )
    
    # Update player state
    player_states_collection.update_one(
        {"userId": user_id},
        {
            "$push": {"planets": planet_id},
            "$set": {"updatedAt": get_timestamp()},
            "$inc": {"totalFields": planet_data["maxFields"]}
        }
    )
    
    return {"success": True, "planetId": planet_id, "planet": serialize_doc(planet_doc)}


# ==================== MOONS ENDPOINTS ====================

@app.get("/api/moons")
async def get_player_moons(request: Request):
    """Get all moons for current player"""
    session = require_auth(request)
    user_id = session["userId"]
    
    # Get all player planets first
    planets = list(planets_collection.find({"userId": user_id}))
    planet_ids = [str(p["_id"]) for p in planets]
    
    moons = list(moons_collection.find({"planetId": {"$in": planet_ids}}))
    
    return {"moons": [serialize_doc(m) for m in moons]}


@app.get("/api/moons/{moon_id}")
async def get_moon(moon_id: str, request: Request):
    """Get specific moon details"""
    session = require_auth(request)
    
    moon = moons_collection.find_one({"_id": ObjectId(moon_id)})
    if not moon:
        raise HTTPException(status_code=404, detail="Moon not found")
    
    return serialize_doc(moon)


# ==================== STATIONS ENDPOINTS ====================

@app.get("/api/stations")
async def get_player_stations(request: Request):
    """Get all space stations for current player"""
    session = require_auth(request)
    user_id = session["userId"]
    
    stations = list(stations_collection.find({"userId": user_id}))
    return {"stations": [serialize_doc(s) for s in stations]}


@app.post("/api/stations/build")
async def build_station(data: StationBuild, request: Request):
    """Build a new space station"""
    session = require_auth(request)
    user_id = session["userId"]
    
    station_type = SPACE_STATIONS.get(data.stationType)
    if not station_type:
        raise HTTPException(status_code=400, detail="Invalid station type")
    
    # Check resources
    planet = planets_collection.find_one({"_id": ObjectId(data.planetId), "userId": user_id})
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    resources = planet.get("resources", {})
    cost = station_type["cost"]
    
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    planets_collection.update_one(
        {"_id": ObjectId(data.planetId)},
        {"$set": {"resources": resources}}
    )
    
    # Create station
    station_doc = {
        "userId": user_id,
        "planetId": data.planetId,
        "type": data.stationType,
        "name": station_type["name"],
        "maxFields": station_type["max_fields"],
        "currentFields": 0,
        "bonuses": station_type["bonuses"],
        "buildings": {},
        "units": {},
        "defense": {},
        "createdAt": get_timestamp()
    }
    
    result = stations_collection.insert_one(station_doc)
    station_id = str(result.inserted_id)
    
    # Update player state
    player_states_collection.update_one(
        {"userId": user_id},
        {"$push": {"stations": station_id}}
    )
    
    return {"success": True, "stationId": station_id, "station": serialize_doc(station_doc)}


@app.get("/api/stations/types")
async def get_station_types(request: Request):
    """Get available station types"""
    return SPACE_STATIONS


# ==================== BUILDINGS ENDPOINTS ====================

@app.post("/api/buildings/upgrade")
async def upgrade_building(data: BuildingUpgrade, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = data.planetId or player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id), "userId": user_id})
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    buildings = planet.get("buildings", {})
    current_level = buildings.get(data.buildingType, 0)
    
    base_cost = BUILDING_COSTS.get(data.buildingType)
    if not base_cost:
        raise HTTPException(status_code=400, detail="Invalid building type")
    
    cost = calculate_cost(base_cost, current_level)
    resources = planet.get("resources", {})
    
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    buildings[data.buildingType] = current_level + 1
    
    # Update fields used
    current_fields = planet.get("currentFields", 0) + 1
    
    # If terraformer, increase max fields
    max_fields = planet.get("maxFields", 100)
    if data.buildingType == "terraformer":
        max_fields += TERRAFORMER_CONFIG["fields_per_level"]
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {
            "buildings": buildings,
            "resources": resources,
            "currentFields": current_fields,
            "maxFields": max_fields
        }}
    )
    
    return {
        "success": True,
        "buildingType": data.buildingType,
        "newLevel": current_level + 1,
        "cost": cost,
        "fieldsUsed": current_fields,
        "maxFields": max_fields
    }


@app.get("/api/buildings/costs")
async def get_building_costs(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    buildings = planet.get("buildings", {}) if planet else {}
    costs = {}
    
    for building_type, base_cost in BUILDING_COSTS.items():
        current_level = buildings.get(building_type, 0)
        costs[building_type] = {
            "currentLevel": current_level,
            "upgradeCost": calculate_cost(base_cost, current_level)
        }
    
    return costs


# ==================== RESEARCH ENDPOINTS ====================

@app.post("/api/research/start")
async def start_research(data: ResearchStart, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet or planet.get("buildings", {}).get("researchLab", 0) < 1:
        raise HTTPException(status_code=400, detail="Research lab required")
    
    research = player_state.get("research", {})
    current_level = research.get(data.techId, 0)
    
    base_cost = RESEARCH_COSTS.get(data.techId)
    if not base_cost:
        raise HTTPException(status_code=400, detail="Invalid research type")
    
    cost = calculate_cost(base_cost, current_level)
    resources = planet.get("resources", {})
    
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    research[data.techId] = current_level + 1
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"resources": resources}}
    )
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"research": research, "updatedAt": get_timestamp()}}
    )
    
    return {
        "success": True,
        "techId": data.techId,
        "newLevel": current_level + 1,
        "cost": cost
    }


@app.get("/api/research/available")
async def get_available_research(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    research = player_state.get("research", {}) if player_state else {}
    
    available = []
    for tech_id, base_cost in RESEARCH_COSTS.items():
        current_level = research.get(tech_id, 0)
        available.append({
            "techId": tech_id,
            "currentLevel": current_level,
            "upgradeCost": calculate_cost(base_cost, current_level)
        })
    
    return available


# ==================== SHIPYARD ENDPOINTS ====================

@app.post("/api/shipyard/build")
async def build_ships(data: ShipBuild, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet or planet.get("buildings", {}).get("shipyard", 0) < 1:
        raise HTTPException(status_code=400, detail="Shipyard required")
    
    ship_cost = SHIP_COSTS.get(data.shipType)
    if not ship_cost:
        raise HTTPException(status_code=400, detail="Invalid ship type")
    
    total_cost = {}
    for resource, amount in ship_cost.items():
        if resource != "buildTime":
            total_cost[resource] = amount * data.quantity
    
    resources = planet.get("resources", {})
    for resource, amount in total_cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    for resource, amount in total_cost.items():
        resources[resource] -= amount
    
    units = planet.get("units", {})
    units[data.shipType] = units.get(data.shipType, 0) + data.quantity
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"units": units, "resources": resources}}
    )
    
    return {
        "success": True,
        "shipType": data.shipType,
        "quantity": data.quantity,
        "totalCost": total_cost,
        "newCount": units[data.shipType]
    }


@app.get("/api/shipyard/available")
async def get_available_ships(request: Request):
    ships = []
    for ship_type, cost in SHIP_COSTS.items():
        ships.append({
            "shipType": ship_type,
            "cost": {k: v for k, v in cost.items() if k != "buildTime"},
            "buildTime": cost.get("buildTime", 60),
            "stats": COMBAT_SHIP_STATS.get(ship_type, {})
        })
    return ships


# ==================== DEFENSE ENDPOINTS ====================

@app.post("/api/defense/build")
async def build_defense(data: DefenseBuild, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    def_cost = DEFENSE_COSTS.get(data.defenseType)
    if not def_cost:
        raise HTTPException(status_code=400, detail="Invalid defense type")
    
    total_cost = {}
    for resource, amount in def_cost.items():
        if resource != "buildTime":
            total_cost[resource] = amount * data.quantity
    
    resources = planet.get("resources", {})
    for resource, amount in total_cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    for resource, amount in total_cost.items():
        resources[resource] -= amount
    
    defense = planet.get("defense", {})
    defense[data.defenseType] = defense.get(data.defenseType, 0) + data.quantity
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"defense": defense, "resources": resources}}
    )
    
    return {
        "success": True,
        "defenseType": data.defenseType,
        "quantity": data.quantity,
        "totalCost": total_cost,
        "newCount": defense[data.defenseType]
    }


@app.get("/api/defense/available")
async def get_available_defense(request: Request):
    defense_list = []
    for def_type, cost in DEFENSE_COSTS.items():
        defense_list.append({
            "defenseType": def_type,
            "cost": {k: v for k, v in cost.items() if k != "buildTime"},
            "buildTime": cost.get("buildTime", 60),
            "stats": COMBAT_DEFENSE_STATS.get(def_type, {})
        })
    return defense_list


# ==================== COMBAT ENDPOINTS ====================

@app.post("/api/combat/attack")
async def attack_player(data: AttackMission, request: Request):
    """Attack another player's planet (1-15 round combat)"""
    session = require_auth(request)
    user_id = session["userId"]
    
    # Get attacker's planet
    attacker_state = player_states_collection.find_one({"userId": user_id})
    if not attacker_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    attacker_planet_id = attacker_state.get("currentPlanetId")
    attacker_planet = planets_collection.find_one({"_id": ObjectId(attacker_planet_id)})
    
    if not attacker_planet:
        raise HTTPException(status_code=404, detail="Attacker planet not found")
    
    # Verify ships
    attacker_units = attacker_planet.get("units", {})
    for ship_type, count in data.ships.items():
        if attacker_units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    # Get defender's planet
    defender_planet = planets_collection.find_one({"_id": ObjectId(data.targetPlanetId)})
    if not defender_planet:
        raise HTTPException(status_code=404, detail="Target planet not found")
    
    if defender_planet.get("userId") == user_id:
        raise HTTPException(status_code=400, detail="Cannot attack your own planet")
    
    # Get technologies
    attacker_tech = attacker_state.get("research", {})
    defender_state = player_states_collection.find_one({"userId": defender_planet.get("userId")})
    defender_tech = defender_state.get("research", {}) if defender_state else {}
    
    # Run combat simulation
    combat_result = simulate_combat(
        data.ships,
        attacker_tech,
        defender_planet.get("units", {}),
        defender_planet.get("defense", {}),
        defender_tech
    )
    
    # Remove ships from attacker
    for ship_type, count in data.ships.items():
        attacker_units[ship_type] -= count
    
    # Return surviving ships
    for ship_type, count in combat_result["attackerSurvivors"].items():
        attacker_units[ship_type] = attacker_units.get(ship_type, 0) + count
    
    planets_collection.update_one(
        {"_id": ObjectId(attacker_planet_id)},
        {"$set": {"units": attacker_units}}
    )
    
    # Update defender
    planets_collection.update_one(
        {"_id": ObjectId(data.targetPlanetId)},
        {"$set": {
            "units": combat_result["defenderSurvivors"],
            "defense": {k: v for k, v in combat_result["defenderSurvivors"].items() if k in DEFENSE_COSTS}
        }}
    )
    
    # Loot if attacker won
    loot = {"metal": 0, "crystal": 0, "deuterium": 0}
    if combat_result["winner"] == "attacker":
        defender_resources = defender_planet.get("resources", {})
        loot["metal"] = int(defender_resources.get("metal", 0) * 0.5)
        loot["crystal"] = int(defender_resources.get("crystal", 0) * 0.5)
        loot["deuterium"] = int(defender_resources.get("deuterium", 0) * 0.5)
        
        # Update defender resources
        for resource, amount in loot.items():
            defender_resources[resource] = defender_resources.get(resource, 0) - amount
        
        planets_collection.update_one(
            {"_id": ObjectId(data.targetPlanetId)},
            {"$set": {"resources": defender_resources}}
        )
        
        # Add loot to attacker
        attacker_resources = attacker_planet.get("resources", {})
        for resource, amount in loot.items():
            attacker_resources[resource] = attacker_resources.get(resource, 0) + amount
        
        planets_collection.update_one(
            {"_id": ObjectId(attacker_planet_id)},
            {"$set": {"resources": attacker_resources}}
        )
    
    # Check for moon creation
    moon_created = None
    if combat_result["moonChance"] > 0 and random.random() < combat_result["moonChance"]:
        moon_data = generate_moon(combat_result["debris"]["metal"] + combat_result["debris"]["crystal"])
        if moon_data:
            moon_data["planetId"] = data.targetPlanetId
            moon_result = moons_collection.insert_one(moon_data)
            moon_created = str(moon_result.inserted_id)
            
            planets_collection.update_one(
                {"_id": ObjectId(data.targetPlanetId)},
                {"$set": {"moon": moon_created}}
            )
    
    # Save combat report
    report = {
        "attackerId": user_id,
        "defenderId": defender_planet.get("userId"),
        "attackerPlanetId": attacker_planet_id,
        "defenderPlanetId": data.targetPlanetId,
        "result": combat_result,
        "loot": loot,
        "moonCreated": moon_created,
        "createdAt": get_timestamp()
    }
    combat_reports_collection.insert_one(report)
    
    return {
        "success": True,
        "result": combat_result,
        "loot": loot,
        "moonCreated": moon_created
    }


@app.post("/api/combat/steal-planet")
async def steal_planet(data: StealPlanet, request: Request):
    """Attempt to steal a planet from another player"""
    session = require_auth(request)
    user_id = session["userId"]
    
    # Get attacker's state
    attacker_state = player_states_collection.find_one({"userId": user_id})
    if not attacker_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    attacker_planet_id = attacker_state.get("currentPlanetId")
    attacker_planet = planets_collection.find_one({"_id": ObjectId(attacker_planet_id)})
    
    # Get target planet
    target_planet = planets_collection.find_one({"_id": ObjectId(data.targetPlanetId)})
    if not target_planet:
        raise HTTPException(status_code=404, detail="Target planet not found")
    
    if target_planet.get("userId") == user_id:
        raise HTTPException(status_code=400, detail="Cannot steal your own planet")
    
    if target_planet.get("isHomeworld"):
        raise HTTPException(status_code=400, detail="Cannot steal homeworld planets")
    
    # Verify ships
    attacker_units = attacker_planet.get("units", {})
    for ship_type, count in data.ships.items():
        if attacker_units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    # Run combat
    defender_state = player_states_collection.find_one({"userId": target_planet.get("userId")})
    combat_result = simulate_combat(
        data.ships,
        attacker_state.get("research", {}),
        target_planet.get("units", {}),
        target_planet.get("defense", {}),
        defender_state.get("research", {}) if defender_state else {}
    )
    
    # Update attacker fleet
    for ship_type, count in data.ships.items():
        attacker_units[ship_type] -= count
    for ship_type, count in combat_result["attackerSurvivors"].items():
        attacker_units[ship_type] = attacker_units.get(ship_type, 0) + count
    
    planets_collection.update_one(
        {"_id": ObjectId(attacker_planet_id)},
        {"$set": {"units": attacker_units}}
    )
    
    planet_stolen = False
    if combat_result["winner"] == "attacker":
        # Transfer planet ownership
        old_owner_id = target_planet.get("userId")
        
        planets_collection.update_one(
            {"_id": ObjectId(data.targetPlanetId)},
            {"$set": {
                "userId": user_id,
                "units": {},
                "defense": {}
            }}
        )
        
        # Update player states
        player_states_collection.update_one(
            {"userId": user_id},
            {"$push": {"planets": data.targetPlanetId}}
        )
        
        player_states_collection.update_one(
            {"userId": old_owner_id},
            {"$pull": {"planets": data.targetPlanetId}}
        )
        
        planet_stolen = True
    else:
        # Update defender losses
        planets_collection.update_one(
            {"_id": ObjectId(data.targetPlanetId)},
            {"$set": {
                "units": {k: v for k, v in combat_result["defenderSurvivors"].items() if k in SHIP_COSTS},
                "defense": {k: v for k, v in combat_result["defenderSurvivors"].items() if k in DEFENSE_COSTS}
            }}
        )
    
    return {
        "success": True,
        "result": combat_result,
        "planetStolen": planet_stolen
    }


@app.get("/api/combat/reports")
async def get_combat_reports(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=15, le=100)
):
    """Get combat reports for player"""
    session = require_auth(request)
    user_id = session["userId"]
    
    total = combat_reports_collection.count_documents({
        "$or": [{"attackerId": user_id}, {"defenderId": user_id}]
    })
    
    skip = (page - 1) * per_page
    reports = list(combat_reports_collection.find({
        "$or": [{"attackerId": user_id}, {"defenderId": user_id}]
    }).sort("createdAt", DESCENDING).skip(skip).limit(per_page))
    
    return {
        "reports": [serialize_doc(r) for r in reports],
        "pagination": {
            "page": page,
            "perPage": per_page,
            "total": total,
            "totalPages": (total + per_page - 1) // per_page
        }
    }


@app.post("/api/combat/simulate")
async def simulate_combat_preview(request: Request):
    """Preview combat simulation without executing"""
    session = require_auth(request)
    data = await request.json()
    
    result = simulate_combat(
        data.get("attacker", {}),
        data.get("attackerTech", {}),
        data.get("defender", {}),
        data.get("defenderDefense", {}),
        data.get("defenderTech", {})
    )
    
    return result


# ==================== GALAXY ENDPOINTS ====================

@app.get("/api/galaxy/{galaxy}/{system}")
async def get_solar_system(galaxy: int, system: int, request: Request):
    session = require_auth(request)
    
    if galaxy < 1 or galaxy > 9 or system < 1 or system > 499:
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    
    # Get existing planets at this location
    existing_planets = list(planets_collection.find({
        "coordinates": {"$regex": f"^\\[{galaxy}:{system}:"}
    }))
    
    existing_positions = {}
    for planet in existing_planets:
        _, _, pos = parse_coordinates(planet.get("coordinates", "[1:1:1]"))
        existing_positions[pos] = planet
    
    # Generate system view
    planets = []
    for position in range(1, 16):
        coords = f"[{galaxy}:{system}:{position}]"
        
        if position in existing_positions:
            planet = existing_positions[position]
            planets.append({
                "position": position,
                "coordinates": coords,
                "type": planet.get("planetTypeName"),
                "class": planet.get("planetClass"),
                "name": planet.get("name"),
                "owner": planet.get("userId"),
                "activity": "active" if random.random() > 0.7 else None,
                "hasMoon": planet.get("moon") is not None,
                "fields": planet.get("maxFields"),
                "occupied": True
            })
        else:
            # Generate procedural empty planet
            random.seed(galaxy * 100000 + system * 100 + position)
            if random.random() > 0.3:
                pos_config = PLANET_POSITION_SIZE.get(position, PLANET_POSITION_SIZE[8])
                planet_class = random.choice(list(PLANET_CLASSES.keys()))
                
                planets.append({
                    "position": position,
                    "coordinates": coords,
                    "type": PLANET_CLASSES[planet_class]["name"],
                    "class": planet_class,
                    "name": f"Planet {galaxy}:{system}:{position}",
                    "owner": None,
                    "activity": None,
                    "hasMoon": False,
                    "fields": random.randint(pos_config["min"], pos_config["max"]),
                    "occupied": False
                })
    
    return {
        "galaxy": galaxy,
        "system": system,
        "planets": planets
    }


@app.get("/api/universe/overview")
async def get_universe_overview(request: Request):
    session = require_auth(request)
    
    return {
        "galaxies": 9,
        "systemsPerGalaxy": 499,
        "planetsPerSystem": 15,
        "totalPlayers": users_collection.count_documents({}),
        "totalAlliances": alliances_collection.count_documents({}),
        "totalPlanets": planets_collection.count_documents({}),
        "totalMoons": moons_collection.count_documents({}),
        "maxEmpireSize": EMPIRE_LIMITS["max_empire_size"]
    }


# ==================== CONFIG ENDPOINTS ====================

@app.get("/api/config/planet-classes")
async def get_planet_classes(request: Request):
    return PLANET_CLASSES


@app.get("/api/config/planet-types")
async def get_planet_types(request: Request):
    return PLANET_TYPES


@app.get("/api/config/biomes")
async def get_biomes(request: Request):
    return BIOMES


@app.get("/api/config/lifeforms")
async def get_lifeforms(request: Request):
    return LIFEFORMS


@app.get("/api/config/player-classes")
async def get_player_classes(request: Request):
    return PLAYER_CLASSES


@app.get("/api/config/field-sizes")
async def get_field_sizes(request: Request):
    return FIELD_SIZE_CATEGORIES


@app.get("/api/config/station-types")
async def get_station_types_config(request: Request):
    return SPACE_STATIONS


@app.get("/api/config/combat")
async def get_combat_config(request: Request):
    return {
        "config": COMBAT_CONFIG,
        "shipStats": COMBAT_SHIP_STATS,
        "defenseStats": COMBAT_DEFENSE_STATS
    }


# ==================== FLEET MISSION ENDPOINTS ====================

@app.post("/api/fleet/mission")
async def start_fleet_mission(data: FleetMission, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player state not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)})
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    units = planet.get("units", {})
    
    for ship_type, count in data.ships.items():
        if units.get(ship_type, 0) < count:
            raise HTTPException(status_code=400, detail=f"Not enough {ship_type}")
    
    for ship_type, count in data.ships.items():
        units[ship_type] -= count
    
    # Calculate travel time based on distance
    travel_time = random.randint(300, 3600)  # 5-60 minutes
    
    mission = {
        "id": str(ObjectId()),
        "userId": user_id,
        "sourcePlanetId": planet_id,
        "targetCoordinates": data.targetCoordinates,
        "missionType": data.missionType,
        "ships": data.ships,
        "resources": data.resources or {},
        "status": "outbound",
        "startTime": get_timestamp().timestamp() * 1000,
        "arrivalTime": (get_timestamp().timestamp() + travel_time) * 1000,
        "returnTime": (get_timestamp().timestamp() + travel_time * 2) * 1000
    }
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"units": units}}
    )
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$push": {"missions": mission}, "$set": {"updatedAt": get_timestamp()}}
    )
    
    return {"success": True, "mission": mission}


@app.get("/api/fleet/missions")
async def get_fleet_missions(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        return []
    
    return player_state.get("missions", [])


@app.get("/api/game/missions")
async def get_game_missions(request: Request):
    return await get_fleet_missions(request)


# ==================== MARKET ENDPOINTS ====================

@app.post("/api/market/order")
async def create_market_order(data: MarketOrder, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    planet_id = player_state.get("currentPlanetId") if player_state else None
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    resources = planet.get("resources", {})
    
    if data.orderType == "sell":
        if resources.get(data.resourceType, 0) < data.quantity:
            raise HTTPException(status_code=400, detail="Not enough resources")
        resources[data.resourceType] -= data.quantity
        planets_collection.update_one(
            {"_id": ObjectId(planet_id)},
            {"$set": {"resources": resources}}
        )
    
    order = {
        "userId": user_id,
        "resourceType": data.resourceType,
        "quantity": data.quantity,
        "pricePerUnit": data.pricePerUnit,
        "orderType": data.orderType,
        "status": "open",
        "createdAt": get_timestamp()
    }
    
    result = market_orders_collection.insert_one(order)
    order["id"] = str(result.inserted_id)
    
    return serialize_doc(order)


@app.get("/api/market/orders")
async def get_market_orders(request: Request, resource_type: Optional[str] = None):
    session = require_auth(request)
    
    query = {"status": "open"}
    if resource_type:
        query["resourceType"] = resource_type
    
    orders = list(market_orders_collection.find(query).sort("pricePerUnit", 1).limit(100))
    return [serialize_doc(order) for order in orders]


# ==================== MESSAGES ENDPOINTS ====================

@app.post("/api/messages/send")
async def send_message(data: MessageSend, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    message = {
        "senderId": user_id,
        "senderName": session["username"],
        "recipientId": data.recipientId,
        "subject": data.subject,
        "content": data.content,
        "read": False,
        "createdAt": get_timestamp()
    }
    
    result = messages_collection.insert_one(message)
    message["id"] = str(result.inserted_id)
    
    return serialize_doc(message)


@app.get("/api/messages/inbox")
async def get_inbox(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"recipientId": user_id}).sort("createdAt", -1).limit(50))
    return [serialize_doc(msg) for msg in messages]


@app.get("/api/messages/sent")
async def get_sent_messages(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"senderId": user_id}).sort("createdAt", -1).limit(50))
    return [serialize_doc(msg) for msg in messages]


@app.get("/api/messages")
async def get_all_messages(request: Request, limit: int = 50):
    session = require_auth(request)
    user_id = session["userId"]
    
    messages = list(messages_collection.find({"recipientId": user_id}).sort("createdAt", -1).limit(limit))
    return [serialize_doc(msg) for msg in messages]


# ==================== ALLIANCES ENDPOINTS ====================

@app.post("/api/alliances/create")
async def create_alliance(data: AllianceCreate, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    existing = alliances_collection.find_one({"tag": data.tag})
    if existing:
        raise HTTPException(status_code=400, detail="Alliance tag already exists")
    
    alliance = {
        "name": data.name,
        "tag": data.tag,
        "description": data.description,
        "leaderId": user_id,
        "members": [{"userId": user_id, "role": "leader", "joinedAt": get_timestamp()}],
        "createdAt": get_timestamp()
    }
    
    result = alliances_collection.insert_one(alliance)
    alliance["id"] = str(result.inserted_id)
    
    return serialize_doc(alliance)


@app.get("/api/alliances")
async def get_alliances(request: Request):
    session = require_auth(request)
    
    alliances = list(alliances_collection.find().sort("createdAt", -1).limit(50))
    return [serialize_doc(a) for a in alliances]


@app.post("/api/alliances/{alliance_id}/join")
async def join_alliance(alliance_id: str, request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    alliance = alliances_collection.find_one({"_id": ObjectId(alliance_id)})
    if not alliance:
        raise HTTPException(status_code=404, detail="Alliance not found")
    
    for member in alliance.get("members", []):
        if member["userId"] == user_id:
            raise HTTPException(status_code=400, detail="Already a member")
    
    alliances_collection.update_one(
        {"_id": ObjectId(alliance_id)},
        {"$push": {"members": {"userId": user_id, "role": "member", "joinedAt": get_timestamp()}}}
    )
    
    return {"success": True}


@app.get("/api/alliances/my")
async def get_my_alliance(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    alliance = alliances_collection.find_one({"members.userId": user_id})
    if not alliance:
        return {"alliance": None}
    
    return {"alliance": serialize_doc(alliance)}


# ==================== LEADERBOARD ENDPOINTS ====================

@app.get("/api/leaderboard")
async def get_leaderboard(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=15, le=100),
    sort_by: str = Query("score", enum=["score", "fleetPower", "planets", "research"])
):
    session = require_auth(request)
    
    # Get all players with basic info
    players = list(player_states_collection.find({"setupComplete": True}))
    
    leaderboard = []
    for player in players:
        user = users_collection.find_one({"_id": ObjectId(player["userId"])})
        
        # Count planets
        planet_count = len(player.get("planets", []))
        
        # Calculate scores
        score = calculate_empire_score(player)
        
        # Get fleet from all planets
        total_fleet = {}
        for planet_id in player.get("planets", []):
            planet = planets_collection.find_one({"_id": ObjectId(planet_id)})
            if planet:
                for ship, count in planet.get("units", {}).items():
                    total_fleet[ship] = total_fleet.get(ship, 0) + count
        
        fleet_power = calculate_fleet_power(total_fleet)
        research_level = sum(player.get("research", {}).values())
        
        leaderboard.append({
            "userId": player["userId"],
            "username": user.get("username", "Unknown") if user else "Unknown",
            "playerClass": player.get("playerClass", "collector"),
            "lifeform": player.get("lifeform", "humans"),
            "empireLevel": player.get("empireLevel", 1),
            "tier": player.get("tier", 1),
            "score": score,
            "fleetPower": fleet_power,
            "planets": planet_count,
            "research": research_level
        })
    
    # Sort
    if sort_by == "fleetPower":
        leaderboard.sort(key=lambda x: x["fleetPower"], reverse=True)
    elif sort_by == "planets":
        leaderboard.sort(key=lambda x: x["planets"], reverse=True)
    elif sort_by == "research":
        leaderboard.sort(key=lambda x: x["research"], reverse=True)
    else:
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
    
    # Add ranks
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    # Paginate
    total = len(leaderboard)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "leaderboard": leaderboard[start:end],
        "pagination": {
            "page": page,
            "perPage": per_page,
            "total": total,
            "totalPages": (total + per_page - 1) // per_page
        }
    }


# ==================== MEGASTRUCTURES ENDPOINTS ====================

@app.get("/api/megastructures")
async def get_megastructures(request: Request):
    session = require_auth(request)
    return MEGASTRUCTURES


@app.post("/api/megastructures/build")
async def build_megastructure(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    structure_type = data.get("type")
    
    if structure_type not in MEGASTRUCTURES:
        raise HTTPException(status_code=400, detail="Invalid megastructure type")
    
    player_state = player_states_collection.find_one({"userId": user_id})
    planet_id = player_state.get("currentPlanetId") if player_state else None
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    cost = MEGASTRUCTURES[structure_type]
    resources = planet.get("resources", {})
    
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    megastructures = player_state.get("megastructures", {})
    megastructures[structure_type] = megastructures.get(structure_type, 0) + 1
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"resources": resources}}
    )
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"megastructures": megastructures}}
    )
    
    return {"success": True, "type": structure_type}


# ==================== STATUS/HEALTH ENDPOINTS ====================

@app.get("/api/status")
async def get_status():
    return {
        "status": "ok",
        "version": "2.0.0",
        "serverTime": get_timestamp().isoformat(),
        "database": "connected"
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "stellar-dominion-api"}


@app.get("/health")
async def root_health():
    return {"status": "ok"}


@app.get("/api/diagnostics")
async def get_diagnostics(request: Request):
    session = require_auth(request)
    
    return {
        "serverTime": get_timestamp().isoformat(),
        "database": {
            "status": "connected",
            "collections": {
                "users": users_collection.count_documents({}),
                "playerStates": player_states_collection.count_documents({}),
                "planets": planets_collection.count_documents({}),
                "moons": moons_collection.count_documents({}),
                "stations": stations_collection.count_documents({}),
                "alliances": alliances_collection.count_documents({}),
                "combatReports": combat_reports_collection.count_documents({}),
                "marketOrders": market_orders_collection.count_documents({})
            }
        },
        "activeSessions": len(sessions_store),
        "version": "2.0.0"
    }


@app.get("/api/settings")
async def get_settings(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {}
    
    return {
        "username": user.get("username"),
        "email": user.get("email"),
        "notifications": user.get("notifications", True),
        "theme": user.get("theme", "dark")
    }


@app.put("/api/settings")
async def update_settings(request: Request):
    session = require_auth(request)
    user_id = session["userId"]
    
    data = await request.json()
    allowed_fields = ["email", "notifications", "theme"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    return {"success": True}


# ==================== OGAME CATALOG ENDPOINTS ====================

@app.get("/api/ogame/catalog")
async def get_ogame_catalog(request: Request):
    return {
        "buildings": list(BUILDING_COSTS.keys()),
        "research": list(RESEARCH_COSTS.keys()),
        "ships": list(SHIP_COSTS.keys()),
        "defense": list(DEFENSE_COSTS.keys())
    }


@app.get("/api/ogame/buildings")
async def get_ogame_buildings(request: Request):
    return BUILDING_COSTS


@app.get("/api/ogame/research")
async def get_ogame_research(request: Request):
    return RESEARCH_COSTS


@app.get("/api/ogame/ships")
async def get_ogame_ships(request: Request):
    return SHIP_COSTS


@app.get("/api/ogame/defense")
async def get_ogame_defense(request: Request):
    return DEFENSE_COSTS


# ==================== STARSHIP ENDPOINTS ====================

@app.get("/api/starships")
async def get_all_starships(request: Request):
    """Get all 90 starships with full details"""
    return ALL_STARSHIPS


@app.get("/api/starships/{ship_id}")
async def get_starship(ship_id: str, request: Request):
    """Get specific starship details"""
    ship = ALL_STARSHIPS.get(ship_id)
    if not ship:
        raise HTTPException(status_code=404, detail="Starship not found")
    return ship


@app.get("/api/starships/class/{ship_class}")
async def get_starships_by_class(ship_class: str, request: Request):
    """Get all starships of a specific class"""
    ships = {k: v for k, v in ALL_STARSHIPS.items() if v.get("class") == ship_class}
    return ships


@app.get("/api/starships/type/{ship_type}")
async def get_starships_by_type(ship_type: str, request: Request):
    """Get all starships of a specific type"""
    ships = {k: v for k, v in ALL_STARSHIPS.items() if v.get("type") == ship_type}
    return ships


@app.get("/api/starships/tier/{tier}")
async def get_starships_by_tier(tier: int, request: Request):
    """Get all starships of a specific tier"""
    ships = {k: v for k, v in ALL_STARSHIPS.items() if v.get("tier") == tier}
    return ships


@app.get("/api/motherships")
async def get_all_motherships(request: Request):
    """Get all motherships"""
    return MOTHERSHIPS


@app.get("/api/motherships/{mothership_id}")
async def get_mothership(mothership_id: str, request: Request):
    """Get specific mothership details"""
    ship = MOTHERSHIPS.get(mothership_id)
    if not ship:
        raise HTTPException(status_code=404, detail="Mothership not found")
    return ship


@app.get("/api/config/starship-classes")
async def get_starship_classes(request: Request):
    """Get all starship classes"""
    return STARSHIP_CLASSES


@app.get("/api/config/starship-types")
async def get_starship_types(request: Request):
    """Get all starship types"""
    return STARSHIP_TYPES


@app.get("/api/config/weapon-systems")
async def get_weapon_systems(request: Request):
    """Get all weapon systems"""
    return WEAPON_SYSTEMS


@app.get("/api/config/engine-systems")
async def get_engine_systems(request: Request):
    """Get all engine systems"""
    return ENGINE_SYSTEMS


@app.get("/api/config/shield-systems")
async def get_shield_systems(request: Request):
    """Get all shield systems"""
    return SHIELD_SYSTEMS


@app.get("/api/config/armor-systems")
async def get_armor_systems(request: Request):
    """Get all armor systems"""
    return ARMOR_SYSTEMS


# ==================== UNIVERSE ENDPOINTS ====================

@app.get("/api/universes")
async def get_all_universes(request: Request):
    """Get all 9 universes"""
    return UNIVERSES


@app.get("/api/universes/{universe_id}")
async def get_universe(universe_id: int, request: Request):
    """Get specific universe details"""
    universe = UNIVERSES.get(f"universe_{universe_id}")
    if not universe:
        raise HTTPException(status_code=404, detail="Universe not found")
    return universe


@app.get("/api/universes/{universe_id}/galaxies")
async def get_universe_galaxies(universe_id: int, request: Request):
    """Get all 30 galaxies in a universe"""
    galaxies = GALAXIES_BY_UNIVERSE.get(f"universe_{universe_id}")
    if not galaxies:
        raise HTTPException(status_code=404, detail="Universe not found")
    return galaxies


@app.get("/api/config/universe")
async def get_universe_config(request: Request):
    """Get universe configuration"""
    return UNIVERSE_CONFIG


# ==================== COMMANDER ENDPOINTS ====================

@app.get("/api/config/commander-classes")
async def get_commander_classes(request: Request):
    """Get all commander classes"""
    return COMMANDER_CLASSES


@app.get("/api/config/commander-stats")
async def get_commander_stats(request: Request):
    """Get commander stat effects"""
    return COMMANDER_STATS


@app.get("/api/config/commander-skills")
async def get_commander_skills(request: Request):
    """Get all commander skills"""
    return COMMANDER_SKILLS


@app.get("/api/config/commander-equipment")
async def get_commander_equipment(request: Request):
    """Get all commander equipment"""
    return COMMANDER_EQUIPMENT


@app.get("/api/config/commander-ranks")
async def get_commander_ranks(request: Request):
    """Get commander rank progression"""
    return COMMANDER_RANKS


@app.get("/api/commander")
async def get_player_commander(request: Request):
    """Get current player's commander"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    commander = player_state.get("commander", {})
    return commander


@app.post("/api/commander/level-up")
async def level_up_commander(request: Request):
    """Level up commander with experience"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    commander = player_state.get("commander", {})
    current_exp = commander.get("experience", 0)
    current_level = commander.get("level", 1)
    
    # Find next rank
    next_rank = None
    for rank in COMMANDER_RANKS:
        if rank["rank"] == current_level + 1:
            next_rank = rank
            break
    
    if not next_rank:
        return {"success": False, "message": "Max level reached"}
    
    if current_exp < next_rank["exp_required"]:
        return {"success": False, "message": f"Need {next_rank['exp_required']} experience"}
    
    commander["level"] = current_level + 1
    commander["rank_name"] = next_rank["name"]
    commander["rank_bonus"] = next_rank["bonus"]
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"commander": commander}}
    )
    
    return {"success": True, "newLevel": commander["level"], "rankName": next_rank["name"]}


@app.post("/api/commander/learn-skill")
async def learn_commander_skill(request: Request):
    """Learn or upgrade a commander skill"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    skill_id = data.get("skillId")
    if skill_id not in COMMANDER_SKILLS:
        raise HTTPException(status_code=400, detail="Invalid skill")
    
    player_state = player_states_collection.find_one({"userId": user_id})
    commander = player_state.get("commander", {})
    skills = commander.get("skills", {})
    
    current_level = skills.get(skill_id, 0)
    max_level = COMMANDER_SKILLS[skill_id]["max_level"]
    
    if current_level >= max_level:
        return {"success": False, "message": "Skill at max level"}
    
    # Cost skill points (simplified)
    skill_points = commander.get("skillPoints", 0)
    cost = current_level + 1
    
    if skill_points < cost:
        return {"success": False, "message": f"Need {cost} skill points"}
    
    skills[skill_id] = current_level + 1
    commander["skills"] = skills
    commander["skillPoints"] = skill_points - cost
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"commander": commander}}
    )
    
    return {"success": True, "skill": skill_id, "newLevel": current_level + 1}


# ==================== GOVERNMENT ENDPOINTS ====================

@app.get("/api/config/government-types")
async def get_government_types(request: Request):
    """Get all government types"""
    return GOVERNMENT_TYPES


@app.get("/api/config/government-policies")
async def get_government_policies(request: Request):
    """Get all government policies"""
    return GOVERNMENT_POLICIES


@app.get("/api/government")
async def get_player_government(request: Request):
    """Get current player's government"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return player_state.get("government", {})


@app.post("/api/government/change")
async def change_government(request: Request):
    """Change government type"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    new_type = data.get("governmentType")
    if new_type not in GOVERNMENT_TYPES:
        raise HTTPException(status_code=400, detail="Invalid government type")
    
    gov_data = GOVERNMENT_TYPES[new_type]
    
    new_government = {
        "type": new_type,
        "name": gov_data["name"],
        "subtype": data.get("subtype", gov_data["subtypes"][0]),
        "stability": gov_data["stability_base"],
        "corruption": gov_data["corruption_base"],
        "bonuses": gov_data["bonuses"],
        "penalties": gov_data["penalties"],
        "policies": [],
        "changedAt": get_timestamp()
    }
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"government": new_government}}
    )
    
    return {"success": True, "government": new_government}


@app.post("/api/government/policy")
async def set_government_policy(request: Request):
    """Add or remove a government policy"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    policy_id = data.get("policyId")
    action = data.get("action", "add")  # add or remove
    
    if policy_id not in GOVERNMENT_POLICIES:
        raise HTTPException(status_code=400, detail="Invalid policy")
    
    player_state = player_states_collection.find_one({"userId": user_id})
    government = player_state.get("government", {})
    policies = government.get("policies", [])
    
    if action == "add":
        if len(policies) >= 5:
            return {"success": False, "message": "Maximum 5 policies allowed"}
        if policy_id not in policies:
            policies.append(policy_id)
    else:
        if policy_id in policies:
            policies.remove(policy_id)
    
    government["policies"] = policies
    
    player_states_collection.update_one(
        {"userId": user_id},
        {"$set": {"government": government}}
    )
    
    return {"success": True, "policies": policies}


# ==================== POPULATION ENDPOINTS ====================

@app.get("/api/config/population")
async def get_population_config(request: Request):
    """Get population configuration"""
    return {
        "config": POPULATION_CONFIG,
        "classes": POPULATION_CLASSES,
        "needs": POPULATION_NEEDS,
        "happiness_factors": HAPPINESS_FACTORS
    }


@app.get("/api/population")
async def get_player_population(request: Request):
    """Get current player's population on current planet"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)}) if planet_id else None
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    population = planet.get("population", {
        "total": 10000,
        "workers": 5000,
        "scientists": 1000,
        "soldiers": 2000,
        "merchants": 1000,
        "administrators": 500,
        "colonists": 500,
        "happiness": 50,
        "growth_rate": 0.02
    })
    
    return population


@app.post("/api/population/allocate")
async def allocate_population(request: Request):
    """Allocate population between classes"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    player_state = player_states_collection.find_one({"userId": user_id})
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)})
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    population = planet.get("population", {})
    total = population.get("total", 10000)
    
    # Validate allocation
    new_allocation = data.get("allocation", {})
    allocation_total = sum(new_allocation.values())
    
    if allocation_total > total:
        raise HTTPException(status_code=400, detail="Allocation exceeds total population")
    
    for class_name, count in new_allocation.items():
        if class_name in POPULATION_CLASSES:
            population[class_name] = count
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"population": population}}
    )
    
    return {"success": True, "population": population}


# ==================== PLANET SCANNER ENDPOINTS ====================

@app.get("/api/config/scanner")
async def get_scanner_config(request: Request):
    """Get scanner configuration"""
    return {
        "config": SCANNER_CONFIG,
        "levels": SCANNER_LEVELS,
        "detail_levels": SCAN_DETAIL_LEVELS
    }


@app.post("/api/scanner/scan")
async def scan_planet(request: Request):
    """Scan a planet for detailed information"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    target_coords = data.get("coordinates")
    if not target_coords:
        raise HTTPException(status_code=400, detail="Coordinates required")
    
    player_state = player_states_collection.find_one({"userId": user_id})
    if not player_state:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Get scanner level (from research or buildings)
    research = player_state.get("research", {})
    scanner_level = min(research.get("espionageTechnology", 0) + 1, 10)
    
    scanner_config = SCANNER_LEVELS.get(scanner_level, SCANNER_LEVELS[1])
    detail_level = scanner_config["detail_level"]
    accuracy = scanner_config["accuracy"]
    
    # Parse coordinates
    galaxy, system, position = parse_coordinates(target_coords)
    
    # Check if planet exists
    existing_planet = planets_collection.find_one({"coordinates": target_coords})
    
    # Generate scan result
    random.seed(galaxy * 100000 + system * 100 + position)
    
    pos_config = PLANET_POSITION_SIZE.get(position, PLANET_POSITION_SIZE[8])
    base_fields = random.randint(pos_config["min"], pos_config["max"])
    temperature = random.randint(pos_config["temp_min"], pos_config["temp_max"])
    
    planet_class = random.choice(list(PLANET_CLASSES.keys()))
    planet_type = random.choice(list(PLANET_TYPES.keys()))
    
    # Determine biome
    suitable_biomes = [b for b in BIOMES if b["temp_range"][0] <= temperature <= b["temp_range"][1]]
    biome = random.choice(suitable_biomes) if suitable_biomes else BIOMES[0]
    
    # Build scan result based on detail level
    scan_result = {
        "coordinates": target_coords,
        "position": position,
        "scanAccuracy": accuracy,
        "detailLevel": detail_level,
        "occupied": existing_planet is not None
    }
    
    if existing_planet:
        scan_result["owner"] = existing_planet.get("userId")
        scan_result["planetName"] = existing_planet.get("name")
    
    available_fields = SCAN_DETAIL_LEVELS.get(detail_level, [])
    
    if "planet_type" in available_fields:
        scan_result["planetClass"] = planet_class
        scan_result["planetType"] = planet_type
    
    if "estimated_size" in available_fields:
        scan_result["estimatedSize"] = f"{pos_config['min']}-{pos_config['max']}"
    
    if "exact_size" in available_fields or "size_range" in available_fields:
        # Add some variance based on accuracy
        variance = int(base_fields * (1 - accuracy) * 0.5)
        scan_result["fieldRange"] = [base_fields - variance, base_fields + variance]
    
    if "temperature" in available_fields or "temperature_range" in available_fields:
        scan_result["temperature"] = temperature
    
    if "habitability" in available_fields:
        scan_result["habitability"] = PLANET_CLASSES[planet_class]["habitability"]
    
    if "biome" in available_fields:
        scan_result["biome"] = biome["name"]
        scan_result["biomeId"] = biome["id"]
    
    if "resources_estimate" in available_fields or "resources" in available_fields:
        resource_mod = PLANET_CLASSES[planet_class]["resource_mod"]
        scan_result["resourcePotential"] = {
            "metal": "high" if resource_mod > 1.2 else ("medium" if resource_mod > 0.9 else "low"),
            "crystal": "medium",
            "deuterium": "high" if temperature < -50 else "medium"
        }
    
    if "moon_chance" in available_fields:
        scan_result["moonChance"] = 0.01 if random.random() > 0.7 else 0
    
    if "special_features" in available_fields:
        features = []
        if random.random() > 0.9:
            features.append("Ancient Ruins")
        if random.random() > 0.95:
            features.append("Rare Minerals")
        if random.random() > 0.98:
            features.append("Artifact Site")
        scan_result["specialFeatures"] = features
    
    if "strategic_value" in available_fields:
        value = base_fields * PLANET_CLASSES[planet_class]["habitability"] * PLANET_CLASSES[planet_class]["resource_mod"]
        scan_result["strategicValue"] = int(value)
    
    if "colonization_cost" in available_fields:
        scan_result["colonizationCost"] = {
            "colonyShip": 1,
            "estimatedResources": {
                "metal": 10000,
                "crystal": 20000,
                "deuterium": 10000
            }
        }
    
    return scan_result


@app.get("/api/scanner/range")
async def get_scanner_range(request: Request):
    """Get current scanner range based on player's technology"""
    session = require_auth(request)
    user_id = session["userId"]
    
    player_state = player_states_collection.find_one({"userId": user_id})
    research = player_state.get("research", {}) if player_state else {}
    
    scanner_level = min(research.get("espionageTechnology", 0) + 1, 10)
    scanner_config = SCANNER_LEVELS.get(scanner_level, SCANNER_LEVELS[1])
    
    return {
        "level": scanner_level,
        "range": scanner_config["range"],
        "accuracy": scanner_config["accuracy"],
        "detailLevel": scanner_config["detail_level"]
    }


# ==================== STATION FIELDS ENDPOINTS ====================

@app.get("/api/config/station-fields")
async def get_station_field_config(request: Request):
    """Get station field configuration"""
    return {
        "stations": STATION_FIELD_CONFIG,
        "moons": MOON_FIELD_CONFIG,
        "starbase_facilities": STARBASE_FACILITIES
    }


@app.post("/api/stations/{station_id}/expand")
async def expand_station_fields(station_id: str, request: Request):
    """Expand station fields"""
    session = require_auth(request)
    user_id = session["userId"]
    
    station = stations_collection.find_one({"_id": ObjectId(station_id), "userId": user_id})
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    station_type = station.get("type")
    field_config = STATION_FIELD_CONFIG.get(station_type)
    
    if not field_config:
        raise HTTPException(status_code=400, detail="Invalid station type")
    
    current_fields = station.get("maxFields", field_config["base_fields"])
    max_fields = field_config["max_fields"]
    
    if current_fields >= max_fields:
        return {"success": False, "message": "Station at maximum fields"}
    
    # Get player resources
    player_state = player_states_collection.find_one({"userId": user_id})
    planet_id = player_state.get("currentPlanetId")
    planet = planets_collection.find_one({"_id": ObjectId(planet_id)})
    
    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    resources = planet.get("resources", {})
    cost = field_config["field_expansion_cost"]
    
    # Check resources
    for resource, amount in cost.items():
        if resources.get(resource, 0) < amount:
            raise HTTPException(status_code=400, detail=f"Not enough {resource}")
    
    # Deduct resources
    for resource, amount in cost.items():
        resources[resource] -= amount
    
    new_fields = min(current_fields + field_config["fields_per_upgrade"], max_fields)
    
    planets_collection.update_one(
        {"_id": ObjectId(planet_id)},
        {"$set": {"resources": resources}}
    )
    
    stations_collection.update_one(
        {"_id": ObjectId(station_id)},
        {"$set": {"maxFields": new_fields}}
    )
    
    return {"success": True, "newFields": new_fields, "maxFields": max_fields}


@app.post("/api/stations/{station_id}/build-facility")
async def build_station_facility(station_id: str, request: Request):
    """Build a facility on a station"""
    session = require_auth(request)
    user_id = session["userId"]
    data = await request.json()
    
    facility_id = data.get("facilityId")
    if facility_id not in STARBASE_FACILITIES:
        raise HTTPException(status_code=400, detail="Invalid facility")
    
    station = stations_collection.find_one({"_id": ObjectId(station_id), "userId": user_id})
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    facility_config = STARBASE_FACILITIES[facility_id]
    facilities = station.get("facilities", {})
    current_level = facilities.get(facility_id, 0)
    
    if current_level >= facility_config["max_level"]:
        return {"success": False, "message": "Facility at max level"}
    
    # Check available fields
    current_fields = station.get("currentFields", 0)
    max_fields = station.get("maxFields", 50)
    fields_needed = facility_config["fields_required"]
    
    if current_fields + fields_needed > max_fields:
        return {"success": False, "message": "Not enough station fields"}
    
    facilities[facility_id] = current_level + 1
    
    stations_collection.update_one(
        {"_id": ObjectId(station_id)},
        {"$set": {
            "facilities": facilities,
            "currentFields": current_fields + fields_needed
        }}
    )
    
    return {"success": True, "facility": facility_id, "newLevel": current_level + 1}


# ==================== MOON FIELD ENDPOINTS ====================

@app.get("/api/moons/{moon_id}/fields")
async def get_moon_fields(moon_id: str, request: Request):
    """Get moon field information"""
    session = require_auth(request)
    
    moon = moons_collection.find_one({"_id": ObjectId(moon_id)})
    if not moon:
        raise HTTPException(status_code=404, detail="Moon not found")
    
    diameter = moon.get("diameter", 5000)
    base_fields = MOON_FIELD_CONFIG["base_fields"]
    diameter_fields = (diameter // 1000) * MOON_FIELD_CONFIG["field_per_1000km_diameter"]
    lunar_base_level = moon.get("facilities", {}).get("lunarBase", 0)
    lunar_base_fields = lunar_base_level * MOON_FIELD_CONFIG["lunar_base_fields_per_level"]
    
    total_fields = base_fields + diameter_fields + lunar_base_fields
    
    return {
        "diameter": diameter,
        "baseFields": base_fields,
        "diameterFields": diameter_fields,
        "lunarBaseLevel": lunar_base_level,
        "lunarBaseFields": lunar_base_fields,
        "totalFields": min(total_fields, MOON_FIELD_CONFIG["max_fields"]),
        "maxFields": MOON_FIELD_CONFIG["max_fields"],
        "currentFields": moon.get("currentFields", 0)
    }


# ==================== ADDITIONAL CONFIG ENDPOINTS ====================

@app.get("/api/config/all")
async def get_all_config(request: Request):
    """Get all game configuration in one request"""
    return {
        "universe": UNIVERSE_CONFIG,
        "universes": UNIVERSES,
        "planetClasses": PLANET_CLASSES,
        "planetTypes": PLANET_TYPES,
        "biomes": BIOMES[:10],  # First 10 for preview
        "biomeCount": len(BIOMES),
        "lifeforms": LIFEFORMS,
        "playerClasses": PLAYER_CLASSES,
        "commanderClasses": COMMANDER_CLASSES,
        "governmentTypes": {k: {"name": v["name"], "description": v["description"]} for k, v in GOVERNMENT_TYPES.items()},
        "starshipClasses": STARSHIP_CLASSES,
        "starshipCount": len(ALL_STARSHIPS),
        "mothershipCount": len(MOTHERSHIPS),
        "stationTypes": list(STATION_FIELD_CONFIG.keys()),
        "combatConfig": COMBAT_CONFIG,
        "empireLimits": EMPIRE_LIMITS
    }


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
