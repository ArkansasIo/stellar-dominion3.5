// Xenoberage API service layer example (TypeScript)
import type { Player, Ship, Sector, Event, Session, Log } from './xenoberage-types';

const API_BASE = '/api';

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/players`);
  return res.json();
}

export async function getPlayer(id: number): Promise<Player> {
  const res = await fetch(`${API_BASE}/players/${id}`);
  return res.json();
}

export async function createPlayer(player: Partial<Player>): Promise<Player> {
  const res = await fetch(`${API_BASE}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  return res.json();
}

// ...repeat for Ship, Sector, Event, Session, Log

export async function login(username: string, password: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getSession(): Promise<Session> {
  const res = await fetch(`${API_BASE}/auth/session`);
  return res.json();
}
