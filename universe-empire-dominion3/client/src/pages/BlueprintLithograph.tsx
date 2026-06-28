import { useMemo, useState } from "react";
import { BookOpen, Bookmark, CheckCircle2, Coins, Factory, FlaskConical, Gem, Hammer, Layers, Search, Shield, Sparkles, Sword, Wrench } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BASE_BLUEPRINTS,
  BLUEPRINT_MANUFACTURING_CATEGORIES,
  BLUEPRINT_LIBRARY_STATS,
  type Blueprint,
  type Rarity,
  calculateManufacturingCost,
  calculateManufacturingTime,
  calculateSuccessRate,
  rarityColors,
} from "@/lib/blueprintSystem";
import { cn } from "@/lib/utils";

import Navigation from "./Navigation";

const CLASS_ICONS: Record<string, typeof Sword> = {
  Starship: Sword,
  Industrial: Wrench,
  Equipment: Hammer,
  Science: FlaskConical,
  Military: Shield,
  Civic: Coins,
  Systems: Layers,
  Infrastructure: Factory,
  Expansion: Sparkles,
  Megastructure: Gem,
  "Spaceship Command": Sword,
};

const CLASS_COLORS: Record<string, string> = {
  Starship: "from-blue-600 to-blue-800",
  Industrial: "from-amber-600 to-amber-800",
  Equipment: "from-red-600 to-red-800",
  Science: "from-violet-600 to-violet-800",
  Military: "from-emerald-600 to-emerald-800",
  Civic: "from-teal-600 to-teal-800",
  Systems: "from-indigo-600 to-indigo-800",
  Infrastructure: "from-slate-600 to-slate-800",
  Expansion: "from-pink-600 to-pink-800",
  Megastructure: "from-yellow-600 to-yellow-800",
  "Spaceship Command": "from-cyan-600 to-cyan-800",
};

const rarityOrder: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "exotic"];

const rarityBadgeClass: Record<Rarity, string> = {
  common: "bg-slate-100 text-slate-800 border-slate-300",
  uncommon: "bg-green-100 text-green-800 border-green-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-amber-100 text-amber-800 border-amber-300",
  exotic: "bg-pink-100 text-pink-800 border-pink-300",
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return remainMinutes > 0 ? `${hours}h ${remainMinutes}m` : `${hours}h`;
}

export default function BlueprintLithograph() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<"all" | Rarity>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const allClasses = useMemo(() => {
    const classes = new Set(BASE_BLUEPRINTS.map((bp) => bp.blueprintClass));
    return Array.from(classes).sort();
  }, []);

  const filteredBlueprints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return BASE_BLUEPRINTS.filter((bp) => {
      if (activeTab === "bookmarked" && !bookmarkedIds.has(bp.id)) return false;
      if (selectedClass !== "all" && bp.blueprintClass !== selectedClass) return false;
      if (selectedRarity !== "all" && bp.rarity !== selectedRarity) return false;
      if (selectedCategory !== "all" && bp.category !== selectedCategory) return false;
      if (query) {
        const searchable = [bp.displayName, bp.description, bp.blueprintClass, bp.blueprintSubClass, bp.itemType, bp.itemSubType, bp.facilityRequirement, bp.techDiscipline].join(" ").toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedClass, selectedRarity, selectedCategory, activeTab, bookmarkedIds]);

  const classStats = useMemo(() => {
    const stats: Record<string, { total: number; byRarity: Record<Rarity, number> }> = {};
    for (const bp of BASE_BLUEPRINTS) {
      if (!stats[bp.blueprintClass]) stats[bp.blueprintClass] = { total: 0, byRarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, exotic: 0 } };
      stats[bp.blueprintClass].total++;
      stats[bp.blueprintClass].byRarity[bp.rarity]++;
    }
    return stats;
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openDetail = (bp: Blueprint) => {
    setSelectedBlueprint(bp);
    setShowDetail(true);
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 160 }}>
          <img src="/assets/backgrounds/space_station.png" alt="Lithograph" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg ring-2 ring-indigo-300/50">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-white drop-shadow">Blueprint Lithograph Book</h2>
              <p className="text-indigo-200 font-rajdhani text-lg">A curated atlas of every fabrication schematic in the Imperial foundry — browse, bookmark, and plan your builds.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Total Schematics</div>
              <div className="font-orbitron text-2xl text-indigo-700">{BLUEPRINT_LIBRARY_STATS.totalBlueprints}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Classes</div>
              <div className="font-orbitron text-2xl text-indigo-700">{BLUEPRINT_LIBRARY_STATS.totalClasses}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Categories</div>
              <div className="font-orbitron text-2xl text-indigo-700">{BLUEPRINT_LIBRARY_STATS.totalCategories}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Subtypes</div>
              <div className="font-orbitron text-2xl text-indigo-700">{BLUEPRINT_LIBRARY_STATS.totalSubTypes}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Bookmarked</div>
              <div className="font-orbitron text-2xl text-indigo-700">{bookmarkedIds.size}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-slate-500">Showing</div>
              <div className="font-orbitron text-2xl text-indigo-700">{filteredBlueprints.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardContent className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" placeholder="Search schematics, facilities, disciplines..." />
              </div>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="all">All Classes</option>
                {allClasses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value as "all" | Rarity)}>
                <option value="all">All Rarities</option>
                {rarityOrder.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {BLUEPRINT_MANUFACTURING_CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Class Overview</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {allClasses.map((cls) => {
                const stats = classStats[cls];
                if (!stats) return null;
                const Icon = CLASS_ICONS[cls] || Factory;
                const gradient = CLASS_COLORS[cls] || "from-slate-600 to-slate-800";
                const isSelected = selectedClass === cls;
                return (
                  <button key={cls} onClick={() => setSelectedClass(isSelected ? "all" : cls)} className={cn("rounded-xl border-2 p-3 text-left transition-all", isSelected ? "border-indigo-500 shadow-md bg-indigo-50" : "border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white")}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="font-semibold text-sm text-slate-900 truncate">{cls}</div>
                    </div>
                    <div className="text-xs text-slate-500">{stats.total} schematics</div>
                    <div className="flex gap-1 mt-2">
                      {rarityOrder.filter((r) => stats.byRarity[r] > 0).map((r) => (
                        <span key={r} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: rarityColors[r] + "20", color: rarityColors[r] }}>
                          {stats.byRarity[r]}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 border border-slate-200 bg-white">
            <TabsTrigger value="all" className="font-orbitron text-xs"><BookOpen className="mr-1 h-3.5 w-3.5" /> All Schematics ({filteredBlueprints.length})</TabsTrigger>
            <TabsTrigger value="bookmarked" className="font-orbitron text-xs"><Bookmark className="mr-1 h-3.5 w-3.5" /> Bookmarked ({bookmarkedIds.size})</TabsTrigger>
            <TabsTrigger value="collection" className="font-orbitron text-xs"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Collection View</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredBlueprints.map((bp) => (
                <BlueprintCard key={bp.id} bp={bp} isBookmarked={bookmarkedIds.has(bp.id)} onToggleBookmark={() => toggleBookmark(bp.id)} onClick={() => openDetail(bp)} />
              ))}
              {filteredBlueprints.length === 0 && (
                <Card className="col-span-full border-dashed border-slate-300 bg-slate-50">
                  <CardContent className="p-10 text-center text-slate-600">No schematics match the current filters.</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookmarked" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredBlueprints.map((bp) => (
                <BlueprintCard key={bp.id} bp={bp} isBookmarked={true} onToggleBookmark={() => toggleBookmark(bp.id)} onClick={() => openDetail(bp)} />
              ))}
              {filteredBlueprints.length === 0 && (
                <Card className="col-span-full border-dashed border-slate-300 bg-slate-50">
                  <CardContent className="p-10 text-center text-slate-600">
                    <Bookmark className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                    No bookmarked schematics yet. Click the bookmark icon on any blueprint to save it here.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collection" className="mt-4">
            <CollectionView blueprints={filteredBlueprints} classStats={classStats} />
          </TabsContent>
        </Tabs>

        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          {selectedBlueprint && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedBlueprint.color + "20" }}>
                    <Wrench className="w-5 h-5" style={{ color: selectedBlueprint.color }} />
                  </div>
                  <div>
                    <div>{selectedBlueprint.displayName}</div>
                    <div className="text-xs font-normal text-slate-500">{selectedBlueprint.blueprintClass} — {selectedBlueprint.blueprintSubClass}</div>
                  </div>
                </DialogTitle>
                <DialogDescription>{selectedBlueprint.detailedDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Rarity</div><Badge className={cn("capitalize border mt-1", rarityBadgeClass[selectedBlueprint.rarity])}>{selectedBlueprint.rarity}</Badge></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Rank</div><div className="font-semibold">{selectedBlueprint.rank}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Level</div><div className="font-semibold">{selectedBlueprint.level}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Success Rate</div><div className="font-semibold text-emerald-600">{calculateSuccessRate(selectedBlueprint).toFixed(0)}%</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Facility</div><div className="font-semibold text-sm">{selectedBlueprint.facilityRequirement}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Discipline</div><div className="font-semibold text-sm">{selectedBlueprint.techDiscipline}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Material Efficiency</div><div className="font-semibold text-amber-600">{selectedBlueprint.materialEfficiency}%</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500 text-xs">Time Efficiency</div><div className="font-semibold text-sky-600">{selectedBlueprint.timeEfficiency}%</div></div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Material Cost (x1)</div>
                  <div className="space-y-1">
                    {calculateManufacturingCost(selectedBlueprint, 1).map((m) => (
                      <div key={m.itemId} className="flex justify-between text-sm">
                        <span className="text-slate-600">{m.itemName}</span>
                        <span className="font-mono font-semibold text-slate-900">{m.quantity.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
                  <div className="flex justify-between mb-1"><span className="font-semibold">Build Time</span><span>{formatTime(calculateManufacturingTime(selectedBlueprint, 1))}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Output per Run</span><span>{selectedBlueprint.outputQuantity}x {selectedBlueprint.outputName}</span></div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </GameLayout>
  );
}

function BlueprintCard({ bp, isBookmarked, onToggleBookmark, onClick }: { bp: Blueprint; isBookmarked: boolean; onToggleBookmark: () => void; onClick: () => void }) {
  const materialCost = calculateManufacturingCost(bp, 1);
  const timeMinutes = Math.ceil(calculateManufacturingTime(bp, 1) / 60);
  const Icon = CLASS_ICONS[bp.blueprintClass] || Factory;

  return (
    <Card className="cursor-pointer border-2 transition-all overflow-hidden bg-white hover:shadow-md border-slate-200" onClick={onClick}>
      <div className="h-1.5" style={{ backgroundColor: bp.color }} />
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bp.color + "15" }}>
              <Icon className="w-4 h-4" style={{ color: bp.color }} />
            </div>
            <div className="min-w-0">
              <div className="font-orbitron text-sm font-bold text-slate-900 truncate">{bp.displayName}</div>
              <div className="text-xs text-slate-500 truncate">{bp.blueprintClass} — {bp.blueprintSubClass}</div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} className="shrink-0 p-1 rounded hover:bg-slate-100 transition-colors">
            <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-amber-400 text-amber-500" : "text-slate-400")} />
          </button>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2">{bp.description}</p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-slate-500">Rank</div>
            <div className="font-semibold text-slate-900">{bp.rank}</div>
          </div>
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-slate-500">Level</div>
            <div className="font-semibold text-slate-900">{bp.level}</div>
          </div>
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-slate-500">Success</div>
            <div className="font-semibold text-emerald-600">{calculateSuccessRate(bp).toFixed(0)}%</div>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-2 text-xs space-y-1">
          <div className="flex justify-between font-semibold text-slate-700">
            <span>Build Cost</span>
            <span className="text-slate-500 font-normal">{timeMinutes}m</span>
          </div>
          {materialCost.slice(0, 3).map((m) => (
            <div key={m.itemId} className="flex justify-between text-slate-600">
              <span>{m.itemName}</span>
              <span className="font-mono text-slate-900">{m.quantity.toLocaleString()}</span>
            </div>
          ))}
          {materialCost.length > 3 && <div className="text-slate-400">+{materialCost.length - 3} more</div>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge className={cn("capitalize border text-[10px]", rarityBadgeClass[bp.rarity])}>{bp.rarity}</Badge>
          <Badge variant="outline" className="text-[10px]">{bp.itemSubType}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function CollectionView({ blueprints, classStats }: { blueprints: Blueprint[]; classStats: Record<string, { total: number; byRarity: Record<Rarity, number> }> }) {
  const groupedByClass = useMemo(() => {
    const groups: Record<string, Blueprint[]> = {};
    for (const bp of blueprints) {
      if (!groups[bp.blueprintClass]) groups[bp.blueprintClass] = [];
      groups[bp.blueprintClass].push(bp);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [blueprints]);

  return (
    <div className="space-y-4">
      {groupedByClass.map(([cls, bps]) => {
        const Icon = CLASS_ICONS[cls] || Factory;
        const gradient = CLASS_COLORS[cls] || "from-slate-600 to-slate-800";
        const stats = classStats[cls];
        return (
          <Card key={cls} className="border-slate-200 bg-white overflow-hidden">
            <div className={cn("h-1 bg-gradient-to-r", gradient)} />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div>{cls}</div>
                  <div className="text-xs font-normal text-slate-500">{bps.length} of {stats?.total ?? 0} schematics</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {bps.map((bp) => (
                  <div key={bp.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-sm">
                    <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: bp.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 truncate">{bp.displayName}</div>
                      <div className="text-xs text-slate-500">{bp.blueprintSubClass} — Rank {bp.rank}</div>
                    </div>
                    <Badge className={cn("capitalize border text-[10px] shrink-0", rarityBadgeClass[bp.rarity])}>{bp.rarity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      {groupedByClass.length === 0 && (
        <Card className="border-dashed border-slate-300 bg-slate-50">
          <CardContent className="p-10 text-center text-slate-600">No schematics match the current view.</CardContent>
        </Card>
      )}
    </div>
  );
}
