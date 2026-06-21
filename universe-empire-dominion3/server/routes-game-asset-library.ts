import type { Express } from "express";
import express from "express";
import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"]);

type AssetLibraryItem = {
  id: string;
  name: string;
  path: string;
  sourcePath: string;
  collection: string;
  category: string;
  extension: string;
  size: number;
};

type AssetSource = {
  collection: string;
  route: string;
  root: string;
};

function titleFromFilename(filename: string) {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function walkAssets(source: AssetSource): AssetLibraryItem[] {
  if (!fs.existsSync(source.root)) return [];

  const items: AssetLibraryItem[] = [];
  const pending = [source.root];

  while (pending.length) {
    const directory = pending.pop()!;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "_notes" || entry.name === "PSD") continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        pending.push(absolutePath);
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(extension)) continue;

      const relativePath = path.relative(source.root, absolutePath).replace(/\\/g, "/");
      const category = relativePath.includes("/") ? relativePath.split("/")[0] : "general";
      const id = `${source.collection}-${relativePath}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      items.push({
        id,
        name: titleFromFilename(entry.name),
        path: `${source.route}/${relativePath.split("/").map(encodeURIComponent).join("/")}`,
        sourcePath: path.relative(process.cwd(), absolutePath).replace(/\\/g, "/"),
        collection: source.collection,
        category,
        extension: extension.slice(1).toUpperCase(),
        size: fs.statSync(absolutePath).size,
      });
    }
  }

  return items.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}

export function registerGameAssetLibraryRoutes(app: Express) {
  const sources: AssetSource[] = [
    {
      collection: "Live Client",
      route: "/game-assets/live",
      root: path.resolve(process.cwd(), "client/public"),
    },
    {
      collection: "OGameX Archive",
      route: "/game-assets/ogamex",
      root: path.resolve(process.cwd(), "game-source/public"),
    },
    {
      collection: "Universe Empires",
      route: "/game-assets/universe-empires",
      root: path.resolve(process.cwd(), "xenoberage/images"),
    },
    {
      collection: "Alien Rage Theme",
      route: "/game-assets/alien-rage",
      root: path.resolve(process.cwd(), "xenoberage/templates/alienrage/images"),
    },
  ];

  const assets = sources.flatMap(walkAssets);

  for (const source of sources) {
    if (fs.existsSync(source.root)) {
      app.use(source.route, express.static(source.root, { maxAge: "1h", fallthrough: true }));
    }
  }

  app.get("/api/game-asset-library", (req, res) => {
    const collection = String(req.query.collection || "all");
    const category = String(req.query.category || "all");
    const search = String(req.query.search || "").trim().toLowerCase();
    const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
    const pageSize = Math.min(120, Math.max(12, Number.parseInt(String(req.query.pageSize || "48"), 10) || 48));

    const filtered = assets.filter((asset) => {
      if (collection !== "all" && asset.collection !== collection) return false;
      if (category !== "all" && asset.category !== category) return false;
      if (!search) return true;
      return `${asset.name} ${asset.sourcePath} ${asset.collection} ${asset.category}`.toLowerCase().includes(search);
    });

    const offset = (page - 1) * pageSize;
    const collections = [...new Set(assets.map((asset) => asset.collection))];
    const categories = [...new Set(
      assets
        .filter((asset) => collection === "all" || asset.collection === collection)
        .map((asset) => asset.category),
    )].sort();

    res.json({
      assets: filtered.slice(offset, offset + pageSize),
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      totalLibraryAssets: assets.length,
      collections,
      categories,
    });
  });
}
