# server/models/sector.py
class Sector:
    def __init__(self, id, coordinates, owner_id, resources, events=None):
        self.id = id
        self.coordinates = coordinates
        self.owner_id = owner_id
        self.resources = resources
        self.events = events or []

    def to_dict(self):
        return {
            'id': self.id,
            'coordinates': self.coordinates,
            'ownerId': self.owner_id,
            'resources': self.resources,
            'events': self.events
        }
