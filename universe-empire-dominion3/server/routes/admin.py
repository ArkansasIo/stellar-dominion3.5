# server/routes/admin.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/admin/stats")
def get_stats():
    # Return stubbed stats for now
    return {
        "players": 10,
        "ships": 25,
        "sectors": 30,
        "planets": 100,
        "marketOrders": 5
    }

@router.post("/admin/reset")
def reset_game():
    # Implement game reset logic here
    return {"ok": True, "message": "Game reset (stub)"}
