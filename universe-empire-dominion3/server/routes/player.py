# server/routes/player.py
from fastapi import APIRouter, HTTPException
from server.models.player import Player

router = APIRouter()

# In-memory store for demonstration
players = {}

@router.get("/players")
def get_players():
    return [p.to_dict() for p in players.values()]

@router.post("/players")
def create_player(data: dict):
    player = Player(**data)
    players[player.id] = player
    return player.to_dict()

@router.get("/players/{player_id}")
def get_player(player_id: str):
    player = players.get(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player.to_dict()

@router.put("/players/{player_id}")
def update_player(player_id: str, data: dict):
    player = players.get(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    for k, v in data.items():
        setattr(player, k, v)
    return player.to_dict()

@router.delete("/players/{player_id}")
def delete_player(player_id: str):
    if player_id in players:
        del players[player_id]
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Player not found")
