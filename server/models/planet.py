# server/models/planet.py
class Planet:
    def __init__(self, id, sector_id, owner_id, resources):
        self.id = id
        self.sector_id = sector_id
        self.owner_id = owner_id
        self.resources = resources

    def to_dict(self):
        return {
            'id': self.id,
            'sectorId': self.sector_id,
            'ownerId': self.owner_id,
            'resources': self.resources
        }
