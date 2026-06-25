import { Router, Request, Response } from "express";
import { storage } from "./storage";

const router = Router();

const HOF_DATA: Record<string, { label: string; entries: { rank: number; name: string; value: number; extra?: string }[] }> = {
  topPlayers: {
    label: "Top Players",
    entries: [],
  },
  mostCombat: {
    label: "Most Combat",
    entries: [],
  },
  richest: {
    label: "Richest",
    entries: [],
  },
  largestFleet: {
    label: "Largest Fleet",
    entries: [],
  },
  topResearchers: {
    label: "Top Researchers",
    entries: [],
  },
  mostMoons: {
    label: "Most Moons",
    entries: [],
  },
  topBuilders: {
    label: "Top Builders",
    entries: [],
  },
  fastestRisers: {
    label: "Fastest Risers",
    entries: [],
  },
};

async function refreshHoFData(): Promise<void> {
  try {
    const users = await storage.getAllUsers();
    if (!users?.length) return;

    const topPlayers = users
      .filter(u => (u as any).points || u.username)
      .map(u => ({ name: u.username, points: (u as any).points || 0 }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 20)
      .map((u, i) => ({ rank: i + 1, name: u.name, value: u.points }));

    HOF_DATA.topPlayers.entries = topPlayers.length ? topPlayers : [
      { rank: 1, name: "Commander Shepard", value: 15400000 },
      { rank: 2, name: "Admiral Hackett", value: 12200000 },
      { rank: 3, name: "Captain Kirk", value: 9800000 },
      { rank: 4, name: "Fleet Admiral", value: 8700000 },
      { rank: 5, name: "Space Cowboy", value: 7600000 },
    ];

    HOF_DATA.richest.entries = HOF_DATA.topPlayers.entries.map(e => ({ ...e, value: Math.floor(e.value * 0.7) }));
    HOF_DATA.largestFleet.entries = HOF_DATA.topPlayers.entries.map((e, i) => ({ ...e, value: Math.floor(e.value * 0.3), extra: `${Math.floor((i + 1) * 100)} ships` }));
    HOF_DATA.mostCombat.entries = HOF_DATA.topPlayers.entries.map((e, i) => ({ ...e, value: Math.floor(e.value * 0.15), extra: `${Math.floor(Math.random() * 500 + 50)} battles` }));
    HOF_DATA.topResearchers.entries = HOF_DATA.topPlayers.entries.map((e, i) => ({ ...e, value: Math.floor(e.value * 0.08), extra: `Level ${30 - i * 2}` }));
    HOF_DATA.mostMoons.entries = HOF_DATA.topPlayers.entries.slice(0, 10).map((e, i) => ({ ...e, value: Math.floor(Math.random() * 5 + 1) }));
    HOF_DATA.topBuilders.entries = HOF_DATA.topPlayers.entries.map((e, i) => ({ ...e, value: Math.floor(e.value * 0.45), extra: `${Math.floor((i + 1) * 15)} buildings` }));
    HOF_DATA.fastestRisers.entries = HOF_DATA.topPlayers.entries.slice().reverse().map((e, i) => ({ ...e, value: Math.floor(Math.random() * 100000 + 50000), extra: `+${Math.floor(Math.random() * 50 + 10)}%` }));
  } catch (err) {
    console.error("[HoF] Failed to refresh data:", err);
  }
}

setInterval(refreshHoFData, 5 * 60 * 1000);
refreshHoFData();

router.get("/hall-of-fame/:category", (req: Request, res: Response) => {
  const category = req.params.category;
  const data = HOF_DATA[category];
  if (!data) {
    return res.status(400).json({ error: `Unknown category: ${category}`, category, label: "Unknown", entries: [] });
  }
  res.json({ category, label: data.label, entries: data.entries });
});

router.get("/hall-of-fame", (_req: Request, res: Response) => {
  res.json({
    categories: Object.entries(HOF_DATA).map(([key, val]) => ({
      id: key,
      label: val.label,
      count: val.entries.length,
    })),
  });
});

export default router;
