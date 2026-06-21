# server/game/ai_manager.py
# Handles AI player actions

def update_ai(players, universe):
    # Simple AI: assign unowned planets to AI players
    for player in players.values():
        if player.name.startswith('AI'):
            for sector in universe.values():
                for planet in getattr(sector, 'planets', []):
                    if planet.owner_id is None:
                        planet.owner_id = player.id
                        if sector.id not in player.sectors_owned:
                            player.sectors_owned.append(sector.id)
                        break
