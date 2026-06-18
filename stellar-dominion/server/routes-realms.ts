import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";

interface RealmServerDefinition {
  id: string;
  name: string;
  region: "NA" | "EU" | "APAC";
  status: "online" | "maintenance" | "degraded";
  playersOnline: number;
  maxPlayers: number;
  tickRateMs: number;
  uptimePercent: number;
  universes: string[];
}

const REALM_SERVERS: RealmServerDefinition[] = [
  {
    id: "nexus-alpha",
    name: "Nexus Alpha",
    region: "NA",
    status: "online",
    playersOnline: 8421,
    maxPlayers: 12000,
    tickRateMs: 1000,
    uptimePercent: 99.98,
    universes: ["uni1", "uni2", "uni3"],
  },
  {
    id: "cygnus-eu",
    name: "Cygnus EU",
    region: "EU",
    status: "online",
    playersOnline: 6298,
    maxPlayers: 10000,
    tickRateMs: 1000,
    uptimePercent: 99.95,
    universes: ["eu1", "eu2"],
  },
  {
    id: "orion-apac",
    name: "Orion APAC",
    region: "APAC",
    status: "degraded",
    playersOnline: 4133,
    maxPlayers: 9000,
    tickRateMs: 1250,
    uptimePercent: 99.64,
    universes: ["ap1", "ap2"],
  },
];

function getSessionRealmId(req: Request): string {
  return ((req.session as any)?.realmId as string | undefined) || REALM_SERVERS[0].id;
}

export function registerRealmRoutes(app: Express) {
  app.get("/api/universe/realms", isAuthenticated, async (req: Request, res: Response) => {
    const selectedRealmId = getSessionRealmId(req);
    const selectedRealm = REALM_SERVERS.find((realm) => realm.id === selectedRealmId) || REALM_SERVERS[0];

    return res.json({
      realms: REALM_SERVERS,
      selectedRealmId: selectedRealm.id,
      selectedRealm,
    });
  });

  app.post("/api/universe/realms/select", isAuthenticated, async (req: Request, res: Response) => {
    const realmId = String(req.body?.realmId || "").trim();
    if (!realmId) {
      return res.status(400).json({ message: "realmId is required" });
    }

    const realm = REALM_SERVERS.find((entry) => entry.id === realmId);
    if (!realm) {
      return res.status(404).json({ message: "Realm not found" });
    }

    (req.session as any).realmId = realm.id;

    req.session.save((error) => {
      if (error) {
        return res.status(500).json({ message: "Failed to persist selected realm" });
      }

      return res.json({
        success: true,
        selectedRealmId: realm.id,
        selectedRealm: realm,
      });
    });
  });
}
