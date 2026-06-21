# server/game/resource_manager.py
# Handles resource production and management for all players and planets

def update_resources(players, universe):
    for player in players.values():
        # Increase player score based on owned planets
        owned_planets = 0
        for sector_id in player.sectors_owned:
            sector = universe.get(sector_id)
            if sector:
                for planet in getattr(sector, 'planets', []):
                    if planet.owner_id == player.id:
                        # Add resources to planet
                        planet.resources = str(int(planet.resources or '0') + 10)
                        owned_planets += 1
        player.score += owned_planets * 10
