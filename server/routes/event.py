# server/routes/event.py
from fastapi import APIRouter

router = APIRouter()

events = []

@router.get("/events")
def get_events():
    return events

@router.post("/events")
def create_event(data: dict):
    event = data.copy()
    event['id'] = len(events) + 1
    events.append(event)
    return event
