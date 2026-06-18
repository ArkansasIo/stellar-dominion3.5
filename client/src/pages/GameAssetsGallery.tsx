import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crown,
  Grid3X3,
  Image,
  List,
  Moon,
  Package,
  Search,
  Sun,
} from "lucide-react";

type ThemePreset = "og-white" | "black-style" | "imperial-gold";

type AssetItem = {
  id: string;
  name: string;
  path: string;
  sourcePath: string;
  collection: string;
  category: string;
  extension: string;
  size: number;
};

type AssetLibraryResponse = {
  assets: AssetItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  totalLibraryAssets: number;
  collections: string[];
  categories: string[];
};

type PlayerOptionsResponse = {
  display?: {
    themePreset?: ThemePreset;
  };
};

const THEMES: Array<{
  id: ThemePreset;
  name: string;
  description: string;
  icon: typeof Sun;
  preview: string;
}> = [
  {
    id: "og-white",
    name: "Command White",
    description: "Bright fleet operations, blue navigation light, clean data surfaces.",
    icon: Sun,
    preview: "border-sky-300 bg-gradient-to-br from-white via-slate-100 to-blue-200 text-slate-900",
  },
  {
    id: "black-style",
    name: "Void Black",
    description: "Deep-space command glass with cyan tactical illumination.",
    icon: Moon,
    preview: "border-cyan-500/60 bg-gradient-to-br from-slate-700 via-slate-950 to-black text-cyan-100",
  },
  {
    id: "imperial-gold",
    name: "Imperial Gold",
    description: "Obsidian command metal, royal crimson haze, and ceremonial gold.",
    icon: Crown,
    preview: "border-amber-400/70 bg-gradient-to-br from-amber-900 via-stone-950 to-black text-amber-100",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function GameAssetsGallery() {
  const queryClient = useQueryClient();
  const [collection, setCollection] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchValue);
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      collection,
      category,
      search,
      page: String(page),
      pageSize: "48",
    });
    return params.toString();
  }, [category, collection, page, search]);

  const { data, isLoading } = useQuery<AssetLibraryResponse>({
    queryKey: ["game-asset-library", queryString],
    queryFn: async () => {
      const response = await fetch(`/api/game-asset-library?${queryString}`, { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load the game asset library.");
      return response.json();
    },
  });

  const { data: playerOptions } = useQuery<PlayerOptionsResponse>({
    queryKey: ["player-options"],
    queryFn: async () => {
      const response = await fetch("/api/settings/player/options", { credentials: "include" });
      return response.ok ? response.json() : {};
    },
  });

  const applyTheme = useMutation({
    mutationFn: async (themePreset: ThemePreset) => {
      const currentResponse = await fetch("/api/settings/player/options", { credentials: "include" });
      const current = currentResponse.ok ? await currentResponse.json() : {};
      const response = await fetch("/api/settings/player/options", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...current,
          display: {
            ...(current.display || {}),
            themePreset,
            darkMode: themePreset !== "og-white",
          },
        }),
      });
      if (!response.ok) throw new Error("Theme could not be saved.");
      return response.json();
    },
    onSuccess: (options) => {
      queryClient.setQueryData(["player-options"], options);
    },
  });

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1600);
  };

  const assets = data?.assets ?? [];

  return (
    <GameLayout>
      <div className="asset-vault space-y-5">
        <section
          className="relative overflow-hidden rounded-2xl border border-[var(--sd-panel-border)] bg-[linear-gradient(135deg,var(--sd-panel-top),var(--sd-panel-bottom))] shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(105deg,rgba(3,7,18,.96),rgba(15,23,42,.72)),url(/assets/ogamex/backgrounds/background-large.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[var(--sd-text-highlight)]">
                <Package className="h-4 w-4" />
                Dominion Visual Archive
              </div>
              <h1 className="font-orbitron text-3xl font-black text-white sm:text-4xl">Game Asset Command Vault</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
                Browse the live client art, the full OGameX archive, and both Universe Empires visual collections from one searchable interface.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 backdrop-blur">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Library</div>
                <div className="font-orbitron text-2xl font-bold text-white">{data?.totalLibraryAssets ?? "—"}</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 backdrop-blur">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Results</div>
                <div className="font-orbitron text-2xl font-bold text-white">{data?.total ?? "—"}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-3">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const active = playerOptions?.display?.themePreset === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => applyTheme.mutate(theme.id)}
                className={cn(
                  "group rounded-2xl border p-1 text-left transition hover:-translate-y-0.5 hover:shadow-xl",
                  active ? "ring-2 ring-[var(--sd-text-highlight)] ring-offset-2" : "border-[var(--sd-panel-border)]",
                )}
              >
                <div className={cn("h-full rounded-xl border p-4", theme.preview)}>
                  <div className="flex items-start justify-between gap-3">
                    <Icon className="h-6 w-6" />
                    {active ? <Badge className="bg-emerald-600 text-white">Active</Badge> : <Badge variant="outline">Apply</Badge>}
                  </div>
                  <div className="mt-8 font-orbitron text-lg font-bold">{theme.name}</div>
                  <div className="mt-1 text-xs opacity-75">{theme.description}</div>
                </div>
              </button>
            );
          })}
        </section>

        <section className="sticky top-2 z-20 rounded-2xl border border-[var(--sd-panel-border)] bg-[linear-gradient(180deg,var(--sd-panel-top),var(--sd-panel-bottom))] p-4 shadow-xl backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sd-text-secondary)]" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search names, folders, collections..."
                className="pl-9"
              />
            </div>
            <Select
              value={collection}
              onValueChange={(value) => {
                setCollection(value);
                setCategory("all");
                setPage(1);
              }}
            >
              <SelectTrigger aria-label="Asset collection"><SelectValue placeholder="All collections" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All collections</SelectItem>
                {(data?.collections ?? []).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
            >
              <SelectTrigger aria-label="Asset category"><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(data?.categories ?? []).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")} aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")} aria-label="List view">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-[var(--sd-panel-border)] p-16 text-center text-[var(--sd-text-secondary)]">
            Synchronizing visual archives…
          </div>
        ) : assets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--sd-panel-border)] p-16 text-center">
            <Image className="mx-auto h-10 w-10 text-[var(--sd-text-secondary)]" />
            <h2 className="mt-4 font-orbitron text-xl font-bold">No matching assets</h2>
            <p className="mt-2 text-sm text-[var(--sd-text-secondary)]">Clear a filter or search a different archive term.</p>
          </div>
        ) : (
          <section className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "space-y-3"}>
            {assets.map((asset) => (
              <Card key={asset.id} className="group overflow-hidden border-[var(--sd-panel-border)] bg-[linear-gradient(180deg,var(--sd-panel-top),var(--sd-panel-bottom))]">
                <CardContent className={viewMode === "grid" ? "p-0" : "flex gap-4 p-3"}>
                  <div className={cn(
                    "relative flex shrink-0 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,var(--sd-panel-glow),transparent_70%)]",
                    viewMode === "grid" ? "h-48 w-full border-b border-[var(--sd-panel-border)] p-3" : "h-24 w-28 rounded-xl border border-[var(--sd-panel-border)] p-2",
                  )}>
                    <img
                      src={asset.path}
                      alt={asset.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/theme-temp.png";
                      }}
                    />
                    <Badge className="absolute right-2 top-2 bg-black/70 text-[10px] text-white">{asset.extension}</Badge>
                  </div>
                  <div className={cn("min-w-0 flex-1", viewMode === "grid" ? "p-4" : "py-1 pr-2")}>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{asset.collection}</Badge>
                      <Badge variant="outline">{asset.category}</Badge>
                    </div>
                    <h3 className="mt-3 truncate font-orbitron text-base font-bold" title={asset.name}>{asset.name}</h3>
                    <p className="mt-1 truncate text-xs text-[var(--sd-text-secondary)]" title={asset.sourcePath}>{asset.sourcePath}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--sd-text-secondary)]">{formatBytes(asset.size)}</span>
                      <Button variant="outline" size="sm" onClick={() => copyValue(asset.path, asset.id)}>
                        {copiedKey === asset.id ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                        Path
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        <footer className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[var(--sd-panel-border)] bg-[linear-gradient(180deg,var(--sd-panel-top),var(--sd-panel-bottom))] p-4 sm:flex-row">
          <div className="text-sm text-[var(--sd-text-secondary)]">
            Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} matching assets
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!data || data.page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" disabled={!data || data.page >= data.totalPages} onClick={() => setPage((value) => value + 1)}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>
    </GameLayout>
  );
}
