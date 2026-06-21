# server/game/event_manager.py
# Handles random and scheduled game events

def update_events(universe):
    # Simple event: random resource bonus to a random planet
    import random
    all_planets = []
    for sector in universe.values():
        all_planets.extend(getattr(sector, 'planets', []))
    if all_planets:
        planet = random.choice(all_planets)
        planet.resources = str(int(planet.resources or '0') + 50)
