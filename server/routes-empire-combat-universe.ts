import type { Express, Request } from "express";
import {
  BATTLE_SYSTEM_PROFILES,
  COMBAT_EFFECT_LIBRARY,
  ENTITY_LEVEL_MATRIX,
  EVENT_BOSSES,
  NPC_WORLD_TEMPLATES,
  UNIVERSE_EVENT_TEMPLATES,
  buildProgressionSnapshot,
  getEventSystemSummary,
  getProgressionCatalogForTrack,
  getTierForLevel,
  type EntityTrack,
} from "@shared/config";

const TRACKS: EntityTrack[] = ['starship', 'mothership', 'unit', 'defense', 'commander'];

function parseTrack(raw: unknown): EntityTrack {
  const normalized = String(raw || '').toLowerCase() as EntityTrack;
  if (TRACKS.includes(normalized)) {
    return normalized;
  }
  return 'starship';
}

function parseBoundedNumber(raw: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

export function registerEmpireCombatUniverseRoutes(app: Express) {
  app.get('/api/systems/progression-combat/meta', (_req, res) => {
    res.json({
      success: true,
      tracks: TRACKS,
      summary: getEventSystemSummary(),
      combatModes: BATTLE_SYSTEM_PROFILES,
      effects: COMBAT_EFFECT_LIBRARY,
    });
  });

  app.get('/api/systems/progression-combat/snapshot', (req: Request, res) => {
    const track = parseTrack(req.query.track);
    const level = parseBoundedNumber(req.query.level, 1, 1, 999);
    const snapshot = buildProgressionSnapshot(track, level);

    res.json({
      success: true,
      track,
      level,
      tier: getTierForLevel(level),
      snapshot,
    });
  });

  app.get('/api/systems/progression-combat/catalog/:track', (req: Request, res) => {
    const track = parseTrack(req.params.track);
    const limit = parseBoundedNumber(req.query.limit, 99, 1, 999);
    const catalog = getProgressionCatalogForTrack(track).slice(0, limit);

    res.json({
      success: true,
      track,
      total: catalog.length,
      catalog,
    });
  });

  app.get('/api/systems/progression-combat/tiers', (_req, res) => {
    res.json({
      success: true,
      tiers: Array.from({ length: 99 }, (_, index) => index + 1),
      levels: ENTITY_LEVEL_MATRIX,
    });
  });

  app.get('/api/systems/events', (_req, res) => {
    res.json({
      success: true,
      summary: getEventSystemSummary(),
      bosses: EVENT_BOSSES,
      npcWorlds: NPC_WORLD_TEMPLATES,
      universeEvents: UNIVERSE_EVENT_TEMPLATES,
    });
  });
}
