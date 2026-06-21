// TypeScript interfaces for Xenoberage integration

export interface Player {
  id: number;
  name: string;
  score: number;
  ships: Ship[];
  sectorsOwned: number[];
}

export interface Ship {
  id: number;
  type: string;
  stats: Record<string, number>;
  ownerId: number;
  sectorId: number;
}

export interface Sector {
  id: number;
  coordinates: string;
  ownerId: number;
  resources: string;
  events: Event[];
}

export interface Event {
  id: number;
  type: string;
  sectorId: number;
  details: string;
}

export interface Session {
  id: number;
  playerId: number;
  data: string;
}

export interface Log {
  id: number;
  playerId: number;
  event: string;
  timestamp: string;
}
