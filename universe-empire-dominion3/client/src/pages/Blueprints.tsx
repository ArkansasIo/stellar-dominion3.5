import { useState } from "react";
import { AlertCircle, BookOpen, Copy, Factory, Search, Star, Zap } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  BASE_BLUEPRINTS,
  BLUEPRINT_LIBRARY_STATS,
  BLUEPRINT_MANUFACTURING_CATEGORIES,
  Blueprint,
  Rarity,
  calculateManufacturingCost,
  calculateManufacturingTime,
  calculateSuccessRate,
  createBlueprintCopy,
} from "@/lib/blueprintSystem";
import { cn } from "@/lib/utils";

import Navigation from "./Navigation";

type ManufacturingLogEntry = {
  id: string;
  blueprintName: string;
  quantity: number;
  outputQuantity: number;
  wasSuccessful: boolean;
  durationSeconds: number;
};

const rarityFilters: Array<"all" | Rarity> = ["all", "common", "uncommon", "rare", "epic", "legendary", "exotic"];

export default function Blueprints() {
  const { toast } = useToast();
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BASE_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(BASE_BLUEPRINTS[0] ?? null);
  const [activeTab, setActiveTab] = useState("originals");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRarity, setActiveRarity] = useState<"all" | Rarity>("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyRuns, setCopyRuns] = useState("10");
  const [copyQuality, setCopyQuality] = useState("85");
  const [manufacturingQty, setManufacturingQty] = useState("1");
  const [manufacturingLog, setManufacturingLog] = useState<ManufacturingLogEntry[]>([]);

  const originals = blueprints.filter((bp) => bp.isOriginal);
  const copies = blueprints.filter((bp) => bp.isCopy && bp.remainingRuns > 0);
  const usedUp = blueprints.filter((bp) => bp.isCopy && bp.remainingRuns === 0);

  const facilities = Array.from(new Set(BASE_BLUEPRINTS.map((bp) => bp.facilityRequirement))).sort();
  const classes = Array.from(new Set(BASE_BLUEPRINTS.map((bp) => bp.blueprintClass))).sort();
  const selectedCategoryMeta = BLUEPRINT_MANUFACTURING_CATEGORIES.find((category) => category.id === activeCategory);

  const matchesFilters = (bp: Blueprint) => {
    const query = searchQuery.trim().toLowerCase();
    const searchable = [bp.displayName, bp.description, bp.categoryLabel, bp.blueprintClass, bp.blueprintSubClass, bp.itemType, bp.itemSubType, bp.facilityRequirement, bp.techDiscipline].join(" ").toLowerCase();
    return (activeCategory === "all" || bp.category === activeCategory)
      && (activeRarity === "all" || bp.rarity === activeRarity)
      && (facilityFilter === "all" || bp.facilityRequirement === facilityFilter)
      && (classFilter === "all" || bp.blueprintClass === classFilter)
      && (!query || searchable.includes(query));
  };

  const filteredOriginals = originals.filter(matchesFilters);
  const filteredCopies = copies.filter(matchesFilters);
  const filteredUsedUp = usedUp.filter(matchesFilters);

  const handleCreateCopy = () => {
    if (!selectedBlueprint || !selectedBlueprint.isOriginal) {
      toast({
        title: "Copy creation blocked",
        description: "Only original blueprints can be duplicated.",
        variant: "destructive",
      });
      return;
    }

    const runs = Math.max(1, parseInt(copyRuns, 10) || 1);
    const quality = Math.min(100, Math.max(1, parseInt(copyQuality, 10) || 85));
    const newCopy = createBlueprintCopy(selectedBlueprint, runs, quality);

    setBlueprints((current) => [...current, newCopy]);
    setSelectedBlueprint(newCopy);
    setActiveTab("copies");
    setShowCopyDialog(false);
    setCopyRuns("10");
    setCopyQuality("85");
    toast({
      title: "Blueprint copy created",
      description: `${newCopy.displayName} copy prepared with ${runs} runs at ${quality}% quality.`,
    });
  };

  const handleManufacture = () => {
    if (!selectedBlueprint) return;

    const quantity = Math.max(1, parseInt(manufacturingQty, 10) || 1);
    if (selectedBlueprint.isCopy && selectedBlueprint.remainingRuns < quantity) {
      toast({
        title: "Not enough blueprint runs",
        description: `${selectedBlueprint.displayName} only has ${selectedBlueprint.remainingRuns} run(s) left.`,
        variant: "destructive",
      });
      return;
    }

    const successRate = calculateSuccessRate(selectedBlueprint);
    const durationSeconds = calculateManufacturingTime(selectedBlueprint, quantity);
    const outputQuantity = quantity * selectedBlueprint.outputQuantity;
    const wasSuccessful = Math.random() * 100 <= successRate;
    let nextSelectedBlueprint = selectedBlueprint;

    setBlueprints((current) =>
      current.map((blueprint) => {
        if (blueprint.id !== selectedBlueprint.id || !blueprint.isCopy) return blueprint;
        const remainingRuns = Math.max(0, blueprint.remainingRuns - quantity);
        nextSelectedBlueprint = {
          ...blueprint,
          currentRuns: remainingRuns,
          remainingRuns,
          status: remainingRuns === 0 ? "used_up" : blueprint.status,
        };
        return nextSelectedBlueprint;
      }),
    );

    setSelectedBlueprint(nextSelectedBlueprint);
    setManufacturingLog((current) => [
      {
        id: `${selectedBlueprint.id}-${Date.now()}`,
        blueprintName: selectedBlueprint.displayName,
        quantity,
        outputQuantity: wasSuccessful ? outputQuantity : 0,
        wasSuccessful,
        durationSeconds,
      },
      ...current,
    ].slice(0, 6));

    toast({
      title: wasSuccessful ? "Manufacturing completed" : "Manufacturing failed",
      description: wasSuccessful
        ? `${selectedBlueprint.displayName} produced ${outputQuantity.toLocaleString()} ${selectedBlueprint.outputName}(s).`
        : `${selectedBlueprint.displayName} run failed after ${(durationSeconds / 60).toFixed(1)} minutes.`,
      variant: wasSuccessful ? "default" : "destructive",
    });
  };

  const rarityBadgeStyle = (rarity: Rarity) => ({
    common: "bg-slate-100 text-slate-900 border-slate-300",
    uncommon: "bg-green-100 text-green-900 border-green-300",
    rare: "bg-blue-100 text-blue-900 border-blue-300",
    epic: "bg-purple-100 text-purple-900 border-purple-300",
    legendary: "bg-amber-100 text-amber-900 border-amber-300",
    exotic: "bg-pink-100 text-pink-900 border-pink-300",
  }[rarity]);

  const renderBlueprint = (bp: Blueprint) => {
    const materialCost = calculateManufacturingCost(bp, 1);
    const timeMinutes = Math.ceil(calculateManufacturingTime(bp, 1) / 60);
    return (
      <Card
        key={bp.id}
        className={cn("cursor-pointer border-2 transition-all overflow-hidden bg-white", selectedBlueprint?.id === bp.id ? "shadow-lg" : "border-slate-200 hover:shadow-md")}
        onClick={() => setSelectedBlueprint(bp)}
        style={{ borderColor: selectedBlueprint?.id === bp.id ? bp.color : undefined }}
      >
        <div className="h-1" style={{ backgroundColor: bp.color }} />
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-orbitron text-lg font-bold text-slate-900">{bp.displayName}</div>
              <div className="text-xs text-slate-600">{bp.categoryLabel}</div>
            </div>
            <Badge className={cn("capitalize border", rarityBadgeStyle(bp.rarity))}>{bp.rarity}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded bg-slate-50 p-2">
              <div className="text-slate-500">Class</div>
              <div className="font-semibold text-slate-900">{bp.blueprintClass}</div>
            </div>
            <div className="rounded bg-slate-50 p-2">
              <div className="text-slate-500">Subtype</div>
              <div className="font-semibold capitalize text-slate-900">{bp.itemSubType}</div>
            </div>
            <div className="rounded bg-slate-50 p-2">
              <div className="text-slate-500">Rank</div>
              <div className="font-semibold text-slate-900">{bp.rank}</div>
            </div>
            <div className="rounded bg-slate-50 p-2">
              <div className="text-slate-500">Success</div>
              <div className="font-semibold text-emerald-600">{calculateSuccessRate(bp).toFixed(0)}%</div>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Build Preview</span>
              <span className="text-slate-500">{timeMinutes}m</span>
            </div>
            {materialCost.map((material) => (
              <div key={`${bp.id}-${material.itemId}`} className="flex justify-between text-slate-600">
                <span>{material.itemName}</span>
                <span className="font-mono font-semibold text-slate-900">{material.quantity.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">{bp.facilityRequirement}</Badge>
            <Badge variant="outline">{bp.techDiscipline}</Badge>
          </div>

          {bp.isCopy ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Runs</span>
                <span>{bp.remainingRuns}/{bp.maxRuns}</span>
              </div>
              <Progress value={(bp.remainingRuns / bp.maxRuns) * 100} className="h-2" />
            </div>
          ) : (
            <div className="text-xs text-amber-700">Original blueprint with unlimited production rights.</div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderGrid = (items: Blueprint[], emptyMessage: string) => (
    items.length > 0 ? (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((bp) => renderBlueprint(bp))}</div>
    ) : (
      <Card className="border-dashed border-slate-300 bg-slate-50">
        <CardContent className="p-10 text-center text-slate-600">{emptyMessage}</CardContent>
      </Card>
    )
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />

        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/space_station.png" alt="Blueprints" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-800/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/buildings/robotics_factory.png" alt="Factory" className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-300/50 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-white drop-shadow">Blueprint Manufacturing</h2>
              <p className="text-slate-300 font-rajdhani text-lg">Imperial blueprint library — hull families, facility doctrine, and rarity tiers.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-slate-200 bg-white"><CardContent className="p-3 text-center"><div className="text-xs text-slate-500">Categories</div><div className="font-orbitron text-2xl text-slate-900">{BLUEPRINT_LIBRARY_STATS.totalCategories}</div></CardContent></Card>
            <Card className="border-slate-200 bg-white"><CardContent className="p-3 text-center"><div className="text-xs text-slate-500">Blueprints</div><div className="font-orbitron text-2xl text-slate-900">{BLUEPRINT_LIBRARY_STATS.totalBlueprints}</div></CardContent></Card>
            <Card className="border-slate-200 bg-white"><CardContent className="p-3 text-center"><div className="text-xs text-slate-500">Classes</div><div className="font-orbitron text-2xl text-slate-900">{BLUEPRINT_LIBRARY_STATS.totalClasses}</div></CardContent></Card>
            <Card className="border-slate-200 bg-white"><CardContent className="p-3 text-center"><div className="text-xs text-slate-500">Subtypes</div><div className="font-orbitron text-2xl text-slate-900">{BLUEPRINT_LIBRARY_STATS.totalSubTypes}</div></CardContent></Card>
          </div>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardContent className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-9" placeholder="Search blueprint name, subtype, facility, or doctrine..." />
              </div>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
                <option value="all">All classes</option>
                {classes.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={facilityFilter} onChange={(event) => setFacilityFilter(event.target.value)}>
                <option value="all">All facilities</option>
                {facilities.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={activeRarity} onChange={(event) => setActiveRarity(event.target.value as "all" | Rarity)}>
                {rarityFilters.map((value) => <option key={value} value={value}>{value === "all" ? "All rarities" : value}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[320px_1fr]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Factory className="h-4 w-4" /> Blueprint Categories
                </div>
                <div className="grid max-h-[420px] grid-cols-1 gap-2 overflow-auto pr-1">
                  <Button variant={activeCategory === "all" ? "default" : "outline"} className="justify-between" onClick={() => setActiveCategory("all")}>
                    <span>All Categories</span>
                    <span>{originals.length}</span>
                  </Button>
                  {BLUEPRINT_MANUFACTURING_CATEGORIES.map((category) => {
                    const count = originals.filter((bp) => bp.category === category.id).length;
                    return (
                      <Button key={category.id} variant={activeCategory === category.id ? "default" : "outline"} className="h-auto justify-between py-3 text-left" onClick={() => setActiveCategory(category.id)}>
                        <span className="truncate">{category.label}</span>
                        <span>{count}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Library Focus</div>
                <div className="mt-1 font-orbitron text-2xl text-slate-900">{selectedCategoryMeta?.label ?? "Full Blueprint Index"}</div>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedCategoryMeta?.summary ?? "Browse all blueprint originals, copies, and archived copies across ships, infrastructure, equipment, industrial modules, and late-game imperial construction."}
                </p>
                {selectedCategoryMeta && (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-lg bg-slate-50 p-3"><div className="text-slate-500">Class</div><div className="font-semibold text-slate-900">{selectedCategoryMeta.blueprintClass}</div></div>
                    <div className="rounded-lg bg-slate-50 p-3"><div className="text-slate-500">Subclass</div><div className="font-semibold text-slate-900">{selectedCategoryMeta.blueprintSubClass}</div></div>
                    <div className="rounded-lg bg-slate-50 p-3"><div className="text-slate-500">Type</div><div className="font-semibold text-slate-900">{selectedCategoryMeta.type}</div></div>
                    <div className="rounded-lg bg-slate-50 p-3"><div className="text-slate-500">Facility</div><div className="font-semibold text-slate-900">{selectedCategoryMeta.facilityRequirement}</div></div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedBlueprint && (
          <Card className="overflow-hidden border-2 bg-white" style={{ borderColor: selectedBlueprint.color }}>
            <div className="h-2" style={{ backgroundColor: selectedBlueprint.color }} />
            <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Selected Blueprint</div>
                  <div className="mt-1 font-orbitron text-2xl font-bold" style={{ color: selectedBlueprint.color }}>{selectedBlueprint.displayName}</div>
                  <div className="mt-2 text-sm text-slate-600">{selectedBlueprint.detailedDescription}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Category</div><div className="font-semibold text-slate-900">{selectedBlueprint.categoryLabel}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Class</div><div className="font-semibold text-slate-900">{selectedBlueprint.blueprintClass}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Subclass</div><div className="font-semibold text-slate-900">{selectedBlueprint.blueprintSubClass}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Type</div><div className="font-semibold text-slate-900">{selectedBlueprint.itemType}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Subtype</div><div className="font-semibold capitalize text-slate-900">{selectedBlueprint.itemSubType}</div></div>
                  <div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-500">Facility</div><div className="font-semibold text-slate-900">{selectedBlueprint.facilityRequirement}</div></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-3 text-xs uppercase tracking-wide text-slate-500">Manufacturing Stats</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Rarity</span><Badge className={cn("capitalize border", rarityBadgeStyle(selectedBlueprint.rarity))}>{selectedBlueprint.rarity}</Badge></div>
                    <div className="flex justify-between"><span className="text-slate-600">Rank</span><span className="font-semibold">{selectedBlueprint.rank}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Level</span><span className="font-semibold">{selectedBlueprint.level}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Success Rate</span><span className="font-semibold text-emerald-600">{calculateSuccessRate(selectedBlueprint).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Material Efficiency</span><span className="font-semibold text-amber-600">{selectedBlueprint.materialEfficiency}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Time Efficiency</span><span className="font-semibold text-sky-600">{selectedBlueprint.timeEfficiency}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Tech Discipline</span><span className="font-semibold text-right">{selectedBlueprint.techDiscipline}</span></div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-xs uppercase tracking-wide text-slate-500">Material Cost x1</div>
                  <div className="space-y-2 text-sm">
                    {calculateManufacturingCost(selectedBlueprint, 1).map((material) => (
                      <div key={`${selectedBlueprint.id}-selected-${material.itemId}`} className="flex justify-between">
                        <span className="text-slate-600">{material.itemName}</span>
                        <span className="font-mono font-semibold text-slate-900">{material.quantity.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedBlueprint.isCopy && (
                  <div className="rounded-xl bg-purple-50 p-4 text-sm">
                    <div className="mb-2 font-semibold text-purple-900">Copy License</div>
                    <div className="flex justify-between text-purple-800"><span>Remaining Runs</span><span>{selectedBlueprint.remainingRuns}/{selectedBlueprint.maxRuns}</span></div>
                    <div className="flex justify-between text-purple-800"><span>Copy Quality</span><span>{selectedBlueprint.quality}%</span></div>
                    <Progress value={(selectedBlueprint.remainingRuns / selectedBlueprint.maxRuns) * 100} className="mt-3 h-2" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wide text-slate-500">Quantity to Produce</label>
                  <Input type="number" min="1" max="1000" value={manufacturingQty} onChange={(event) => setManufacturingQty(event.target.value)} className="text-lg font-semibold" />
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
                  <div className="mb-2 font-semibold text-emerald-900">Production Preview</div>
                  {calculateManufacturingCost(selectedBlueprint, Math.max(1, parseInt(manufacturingQty, 10) || 1)).map((material) => (
                    <div key={`${selectedBlueprint.id}-preview-${material.itemId}`} className="flex justify-between text-emerald-900/90">
                      <span>{material.itemName}</span>
                      <span className="font-mono font-semibold">{material.quantity.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex justify-between border-t border-emerald-200 pt-3 font-semibold text-emerald-900">
                    <span>Build Time</span>
                    <span>{Math.ceil(calculateManufacturingTime(selectedBlueprint, Math.max(1, parseInt(manufacturingQty, 10) || 1)) / 60)}m</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" size="lg" onClick={handleManufacture}>
                    <Zap className="mr-2 h-4 w-4" /> Manufacture Now
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" size="sm" disabled={!selectedBlueprint.isOriginal} onClick={() => setShowCopyDialog(true)}>
                    <Copy className="mr-2 h-4 w-4" /> Create Copy
                  </Button>
                </div>
                {selectedBlueprint.isOriginal && (
                  <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <Star className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Original blueprints keep full quality, unlimited manufacturing rights, and serve as the master source for copy production.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-16 w-full grid-cols-3 border border-slate-200 bg-white">
            <TabsTrigger value="originals" className="flex h-full flex-col gap-1 font-orbitron"><BookOpen className="h-4 w-4" /> Originals ({filteredOriginals.length})</TabsTrigger>
            <TabsTrigger value="copies" className="flex h-full flex-col gap-1 font-orbitron"><Copy className="h-4 w-4" /> Copies ({filteredCopies.length})</TabsTrigger>
            <TabsTrigger value="usedUp" className="flex h-full flex-col gap-1 font-orbitron"><AlertCircle className="h-4 w-4" /> Used Up ({filteredUsedUp.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="originals" className="mt-6">{renderGrid(filteredOriginals, "No original blueprints match the current filters.")}</TabsContent>
          <TabsContent value="copies" className="mt-6">{renderGrid(filteredCopies, "No active blueprint copies match the current filters.")}</TabsContent>
          <TabsContent value="usedUp" className="mt-6">{renderGrid(filteredUsedUp, "No depleted blueprint copies match the current filters.")}</TabsContent>
        </Tabs>

        {manufacturingLog.length > 0 && (
          <Card className="border-slate-200 bg-white">
            <CardContent className="space-y-3 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Production Queue Feedback</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {manufacturingLog.map((job) => (
                  <div key={job.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{job.blueprintName}</div>
                      <Badge className={job.wasSuccessful ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>{job.wasSuccessful ? "Success" : "Failed"}</Badge>
                    </div>
                    <div className="mt-2 text-slate-600">Quantity queued: {job.quantity.toLocaleString()}</div>
                    <div className="text-slate-600">Output delivered: {job.outputQuantity.toLocaleString()}</div>
                    <div className="text-slate-500">Build time: {(job.durationSeconds / 60).toFixed(1)} minutes</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Blueprint Copy</DialogTitle>
              <DialogDescription>Create a limited-run copy of {selectedBlueprint?.displayName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">Number of Runs</label>
                <Input type="number" min="1" max="300" value={copyRuns} onChange={(event) => setCopyRuns(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Quality %</label>
                <Input type="number" min="1" max="100" value={copyQuality} onChange={(event) => setCopyQuality(event.target.value)} />
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
                <div className="mb-2 font-semibold text-slate-900">Copy Effects</div>
                <div>- Limited manufacturing runs</div>
                <div>- Success rate scaled by copy quality</div>
                <div>- Rarity may drop when quality falls below 90%</div>
                <div>- Best used for production batches and export logistics</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCopyDialog(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCopy}>Create Copy</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}
