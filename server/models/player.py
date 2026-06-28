# server/models/player.py
class Player:
    def __init__(self, id, name, score, ships=None, sectors_owned=None):
        self.id = id
        self.name = name
        self.score = score
        self.ships = ships or []
        self.sectors_owned = sectors_owned or []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'score': self.score,
            'ships': self.ships,
            'sectorsOwned': self.sectors_owned
        }

# ...repeat for Ship, Sector, Planet, etc.
