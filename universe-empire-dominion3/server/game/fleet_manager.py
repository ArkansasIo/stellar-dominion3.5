# server/game/fleet_manager.py
# Handles fleet movement and combat resolution

def update_fleets(players, universe):
    # Move each player's ships randomly and resolve simple combat
    for player in players.values():
        for ship in player.ships:
            # Move ship to a random sector
            import random
            sector_ids = list(universe.keys())
            if sector_ids:
                ship['location'] = random.choice(sector_ids)
            # Simple combat: if another player's ship is in same sector, remove one
            for other in players.values():
                if other.id != player.id:
                    for o_ship in other.ships:
                        if o_ship['location'] == ship['location']:
                            # Remove both ships (simple combat)
                            player.ships.remove(ship)
                            other.ships.remove(o_ship)
                            break
