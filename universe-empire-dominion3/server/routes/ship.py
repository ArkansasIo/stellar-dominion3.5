# server/routes/ship.py
from fastapi import APIRouter, HTTPException
from server.models.ship import Ship

router = APIRouter()

ships = {}

@router.get("/ships")
def get_ships():
    return [s.to_dict() for s in ships.values()]

@router.post("/ships")
def create_ship(data: dict):
    ship = Ship(**data)
    ships[ship.id] = ship
    return ship.to_dict()

@router.get("/ships/{ship_id}")
def get_ship(ship_id: str):
    ship = ships.get(ship_id)
    if not ship:
        raise HTTPException(status_code=404, detail="Ship not found")
    return ship.to_dict()

@router.delete("/ships/{ship_id}")
def delete_ship(ship_id: str):
    if ship_id in ships:
        del ships[ship_id]
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Ship not found")
