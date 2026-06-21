# server/routes/universe.py
from fastapi import APIRouter
from server.universe.generator import generate_universe

router = APIRouter()

universe = generate_universe()

@router.get("/universe")
def get_universe():
    return {sid: s.to_dict() for sid, s in universe.items()}

@router.get("/sectors/{sector_id}")
def get_sector(sector_id: str):
    sector = universe.get(sector_id)
    if not sector:
        return {"error": "Sector not found"}
    return sector.to_dict()

@router.get("/planets/{planet_id}")
def get_planet(planet_id: str):
    for sector in universe.values():
        for planet in getattr(sector, 'planets', []):
            if planet.id == planet_id:
                return planet.to_dict()
    return {"error": "Planet not found"}
