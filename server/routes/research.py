# server/routes/research.py
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Example tech tree (stub)
technologies = {
    "tech1": {"name": "Laser Weapons", "prereq": [], "level": 0},
    "tech2": {"name": "Plasma Shields", "prereq": ["tech1"], "level": 0},
}

@router.get("/tech-tree")
def get_tech_tree():
    return technologies

@router.post("/research")
def start_research(data: dict):
    tech_id = data.get("tech_id")
    if tech_id not in technologies:
        raise HTTPException(status_code=404, detail="Tech not found")
    # Implement research logic here
    technologies[tech_id]["level"] += 1
    return {"ok": True, "tech": technologies[tech_id]}
