# server/universe/generator.py
import random
from server.models.sector import Sector
from server.models.planet import Planet

def generate_universe(galaxies=3, sectors_per_galaxy=10, planets_per_sector=5):
    universe = {}
    for g in range(galaxies):
        for s in range(sectors_per_galaxy):
            sector_id = f"G{g}-S{s}"
            sector = Sector(id=sector_id, coordinates=f"{g}:{s}", owner_id=None, resources="", events=[])
            sector.planets = []
            for p in range(planets_per_sector):
                planet_id = f"{sector_id}-P{p}"
                planet = Planet(id=planet_id, sector_id=sector_id, owner_id=None, resources="")
                sector.planets.append(planet)
            universe[sector_id] = sector
    return universe
