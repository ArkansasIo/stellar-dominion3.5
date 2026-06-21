

import time
from server.routes.player import players
from server.routes.universe import universe
from server.game.resource_manager import update_resources
from server.game.fleet_manager import update_fleets
from server.game.ai_manager import update_ai
from server.game.event_manager import update_events

def game_tick():
    print("Game tick: updating resources, fleets, AI, events...")
    update_resources(players, universe)
    update_fleets(players, universe)
    update_ai(players, universe)
    update_events(universe)

# Example: run every 10 seconds (for demonstration)
if __name__ == "__main__":
    while True:
        game_tick()
        time.sleep(10)
