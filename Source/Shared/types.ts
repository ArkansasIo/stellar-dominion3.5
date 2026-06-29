// Shared TypeScript interfaces for core entities
export interface Player {
  id: string;
  name: string;
  score: number;
  ships: string[];
  sectorsOwned: string[];
}
export interface Ship {
  id: string;
  type: string;
  stats: Record<string, number>;
  ownerId: string;
  sectorId: string;
}
export interface Sector {
  id: string;
  coordinates: string;
  ownerId: string;
  resources: string;
  events: string[];
}
export interface Planet {
  id: string;
  sectorId: string;
  ownerId: string;
  resources: string;
}
// ...add more as needed
