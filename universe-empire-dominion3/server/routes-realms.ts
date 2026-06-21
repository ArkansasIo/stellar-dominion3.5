import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";

const SEED_REALMS = [
  { name: "Nexus Alpha", slug: "nexus-alpha", description: "The flagship server with the largest player base and most active economy.", region: "NA", maxPlayers: 12000, color: "#6366f1", bonusDescription: "+10% resource production", bonusMultiplier: 1.1 },
  { name: "Cygnus EU", slug: "cygnus-eu", description: "European-focused server with balanced gameplay and strong alliance scene.", region: "EU", maxPlayers: 10000, color: "#22c55e", bonusDescription: "+10% research speed", bonusMultiplier: 1.1 },
  { name: "Orion APAC", slug: "orion-apac", description: "Asia-Pacific server with fast-paced combat and competitive rankings.", region: "APAC", maxPlayers: 9000, color: "#f59e0b", bonusDescription: "+15% combat XP", bonusMultiplier: 1.15 },
  { name: "Vanguard", slug: "vanguard", description: "Hardcore server with increased difficulty and richer rewards.", region: "NA", maxPlayers: 8000, color: "#ef4444", bonusDescription: "+25% all rewards, +50% costs", bonusMultiplier: 1.25 },
  { name: "Pioneer", slug: "pioneer", description: "Beginner-friendly server with tutorials and mentorship programs.", region: "Global", maxPlayers: 15000, color: "#8b5cf6", bonusDescription: "+20% XP for first 30 days", bonusMultiplier: 1.2 },
];

function getSessionRealmId(req: Request): string {
  return (req.session.realmId as string | undefined) || "nexus-alpha";
}

async function ensureSeedRealms() {
  const existing = await storage.getRealmServers();
  if (existing.length === 0) {
    for (const realm of SEED_REALMS) {
      await storage.createRealmServer(realm);
    }
  }
}

export function registerRealmRoutes(app: Express) {
  app.get("/api/universe/realms", isAuthenticated, async (req: Request, res: Response) => {
    try {
      await ensureSeedRealms();
      const realms = await storage.getRealmServers();
      const selectedRealmId = getSessionRealmId(req);
      const selectedRealm = realms.find((r: any) => r.slug === selectedRealmId) || realms[0];
      return res.json({ realms, selectedRealmId: selectedRealm?.slug || selectedRealmId, selectedRealm });
    } catch (error) {
      return res.status(500).json({ message: "Failed to load realms" });
    }
  });

  app.post("/api/universe/realms/select", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const realmSlug = String(req.body?.realmId || "").trim();
      if (!realmSlug) {
        return res.status(400).json({ message: "realmId is required" });
      }

      await ensureSeedRealms();
      const realm = await storage.getRealmServer(realmSlug);
      if (!realm) {
        return res.status(404).json({ message: "Realm not found" });
      }

      if (realm.status !== "active") {
        return res.status(400).json({ message: "Realm is not available" });
      }

      req.session.realmId = realm.slug;

      req.session.save((error) => {
        if (error) {
          return res.status(500).json({ message: "Failed to persist selected realm" });
        }
        return res.json({ success: true, selectedRealmId: realm.slug, selectedRealm: realm });
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to select realm" });
    }
  });
}
