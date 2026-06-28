# server/models/ship.py
class Ship:
    def __init__(self, id, type, stats, owner_id, sector_id):
        self.id = id
        self.type = type
        self.stats = stats
        self.owner_id = owner_id
        self.sector_id = sector_id

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'stats': self.stats,
            'ownerId': self.owner_id,
            'sectorId': self.sector_id
        }
