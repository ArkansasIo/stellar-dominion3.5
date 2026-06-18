import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Compass, Shield, Zap, MapPin, Rocket, Users, Star, BookOpen, Layers, TrendingUp } from "lucide-react";
import type {
  ExpeditionCatalogResponse,
  ExpeditionCategory,
  ExpeditionSubCategory,
  ExpeditionType,
  ExpeditionTier,
} from "@shared/types/expeditions";
import { useArtifactRelicSystems } from "@/lib/artifactRelicSystems";
import { useToast } from "@/hooks/use-toast";

interface Expedition {
  id: string;
  name: string;
  type: string;
  subType?: string;
  categoryId?: string;
  subCategoryId?: string;
  tier?: number;
  tierClass?: string;
  level?: number;
  rank?: string;
  title?: string;
  targetCoordinates: string;
  status: string;
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
  discoveries: any[];
  casualties: Record<string, number>;
  resources: Record<string, number>;
  rewards?: Record<string, number>;
  startedAt: string;
  launchedAt?: string | null;
  completedAt?: string;
}

function tierBandLabel(tier: number): string {
  if (tier <= 9)  return "Initiate";
  if (tier <= 19) return "Apprentice";
  if (tier <= 29) return "Scout";
  if (tier <= 39) return "Journeyman";
  if (tier <= 49) return "Adept";
  if (tier <= 59) return "Expert";
  if (tier <= 69) return "Master";
  if (tier <= 79) return "Grandmaster";
  if (tier <= 89) return "Elite";
  return "Legendary";
}

export default function Expeditions() {
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
  const [newExpName, setNewExpName] = useState("");
  const [newExpType, setNewExpType] = useState("exploration");
  const [newExpSubType, setNewExpSubType] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("");
  const [newExpSubCategory, setNewExpSubCategory] = useState("");
  const [newExpTier, setNewExpTier] = useState("1");
  const [newExpLevel, setNewExpLevel] = useState("1");
  const [targetCoords, setTargetCoords] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [tiersOpen, setTiersOpen] = useState(false);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    state: artifactRelicState,
    launchExpedition,
  } = useArtifactRelicSystems();

  const { data: expeditionsData = {} } = useQuery({
    queryKey: ["expeditions"],
    queryFn: async () => {
      const response = await fetch("/api/expeditions", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load expeditions");
      }
      return response.json();
    },
  });

  const { data: catalogData } = useQuery<ExpeditionCatalogResponse>({
    queryKey: ["expeditions-catalog"],
    queryFn: () =>
      fetch("/api/expeditions/catalog")
        .then(r => r.json())
        .catch(() => ({ categories: [], types: [], tierCount: 99, levelCount: 999, categoryCount: 18, subCategoryCount: 32 })),
  });

  const { data: tiersData } = useQuery<{ tiers: ExpeditionTier[]; count: number }>({
    queryKey: ["expeditions-tiers"],
    queryFn: () => fetch("/api/expeditions/tiers").then(r => r.json()).catch(() => ({ tiers: [], count: 0 })),
    enabled: tiersOpen,
  });

  const expeditions: Expedition[] = Array.isArray(expeditionsData)
    ? expeditionsData
    : expeditionsData.expeditions || [];

  const activeCount    = expeditions.filter(e => e.status === "in_progress").length;
  const completedCount = expeditions.filter(e => e.status === "completed").length;
  const failedCount    = expeditions.filter(e => e.status === "failed").length;

  const categories: ExpeditionCategory[] = catalogData?.categories ?? [];
  const types: ExpeditionType[]          = catalogData?.types ?? [];
  const selectedType     = types.find(t => t.id === newExpType);
  const selectedCategory = categories.find(c => c.id === newExpCategory);

  const createExpeditionMutation = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/expeditions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Failed to create expedition");
        }
        return payload;
      }),
    onSuccess: async (created: Expedition) => {
      await queryClient.invalidateQueries({ queryKey: ["expeditions"] });
      setNewExpName("");
      setTargetCoords("");
      setNewExpType("exploration");
      setNewExpSubType("");
      setNewExpCategory("");
      setNewExpSubCategory("");
      setNewExpTier("1");
      setNewExpLevel("1");
      setSelectedExpedition(created.id);
      toast({ title: "Expedition created", description: `${created.name} is ready for launch.` });
    },
    onError: (error: Error) => {
      toast({ title: "Expedition creation failed", description: error.message, variant: "destructive" });
    },
  });

  const launchExpeditionMutation = useMutation({
    mutationFn: async (expeditionId: string) => {
      const response = await fetch(`/api/expeditions/${expeditionId}/launch`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Failed to launch expedition");
      }
      return payload as { expedition: Expedition };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["expeditions"] });
      setSelectedExpedition(result.expedition.id);
      toast({ title: "Expedition launched", description: `${result.expedition.name} is now in progress.` });
    },
    onError: (error: Error) => {
      toast({ title: "Launch failed", description: error.message, variant: "destructive" });
    },
  });

  const resolveExpeditionMutation = useMutation({
    mutationFn: async (expeditionId: string) => {
      const response = await fetch(`/api/expeditions/${expeditionId}/resolve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Failed to resolve expedition");
      }
      return payload as { expedition: Expedition };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["expeditions"] });
      setSelectedExpedition(result.expedition.id);
      toast({
        title: "Expedition resolved",
        description: `${result.expedition.name} returned ${result.expedition.status === "failed" ? "with losses" : "successfully"}.`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Resolution failed", description: error.message, variant: "destructive" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":   return "bg-green-100 text-green-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "preparing":   return "bg-yellow-100 text-yellow-700";
      case "failed":      return "bg-red-100 text-red-700";
      default:            return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exploration": return <Compass className="w-4 h-4" />;
      case "military":    return <Shield className="w-4 h-4" />;
      case "scientific":  return <Zap className="w-4 h-4" />;
      case "trade":       return <Users className="w-4 h-4" />;
      case "conquest":    return <Rocket className="w-4 h-4" />;
      default:            return <MapPin className="w-4 h-4" />;
    }
  };

  const catalogCategoryDetail: ExpeditionCategory | undefined =
    selectedCatalogCategory ? categories.find(c => c.id === selectedCatalogCategory) : undefined;

  const tierNum = parseInt(newExpTier, 10);
  const tierBand = isNaN(tierNum) ? "" : tierBandLabel(tierNum);

  const selectedExp = expeditions.find(e => e.id === selectedExpedition);
  const unlockedArtifacts = artifactRelicState.artifacts.filter((artifact) => artifact.unlocked);
  const unlockedRelics = artifactRelicState.relics.filter((relic) => relic.unlockCost <= 0);
  const activeArtifactOps = artifactRelicState.expeditions.filter((expedition) => expedition.status === "in_progress");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/deep_space.png" alt="Expeditions" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-violet-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/ships/scout.png" alt="Scout" className="w-20 h-20 rounded-xl object-cover ring-2 ring-violet-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Expeditions</h2>
              <p className="text-violet-300 font-rajdhani text-lg">Send fleets and troops to explore worlds and conquer interstellar objects</p>
            </div>
          </div>
        </div>

        {/* System Stats Bar */}
        {catalogData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs text-indigo-600 font-semibold uppercase">Categories</div>
                <div className="text-xl font-bold text-indigo-800">
                  {catalogData.categoryCount}{" "}
                  <span className="text-xs font-normal">/ {catalogData.subCategoryCount} sub</span>
                </div>
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-center gap-3">
              <Layers className="w-5 h-5 text-violet-600 shrink-0" />
              <div>
                <div className="text-xs text-violet-600 font-semibold uppercase">Tiers</div>
                <div className="text-xl font-bold text-violet-800">1–{catalogData.tierCount}</div>
              </div>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <div className="text-xs text-sky-600 font-semibold uppercase">Levels</div>
                <div className="text-xl font-bold text-sky-800">1–{catalogData.levelCount}</div>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3">
              <Star className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs text-emerald-600 font-semibold uppercase">Types</div>
                <div className="text-xl font-bold text-emerald-800">
                  {types.length}{" "}
                  <span className="text-xs font-normal">/ {types.reduce((s, t) => s + t.subTypes.length, 0)} sub</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-600" />
            Artifact & Relic Expedition Operations
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Launch focused expeditions tied to your artifact and relic systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded border border-slate-200 p-3 bg-slate-50">
              <div className="text-xs uppercase text-slate-500 mb-2">Artifact Targets</div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {unlockedArtifacts.length === 0 ? (
                  <p className="text-sm text-slate-500">No unlocked artifact targets.</p>
                ) : (
                  unlockedArtifacts.map((artifact) => (
                    <div key={artifact.id} className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
                      <div className="text-sm text-slate-700 truncate">{artifact.name}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => launchExpedition("artifact", artifact.id)}
                        disabled={artifactRelicState.resources.archaeologyCrews <= 0}
                        data-testid={`button-launch-artifact-op-${artifact.id}`}
                      >
                        Launch
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded border border-slate-200 p-3 bg-slate-50">
              <div className="text-xs uppercase text-slate-500 mb-2">Relic Targets</div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {unlockedRelics.length === 0 ? (
                  <p className="text-sm text-slate-500">No unlocked relic targets.</p>
                ) : (
                  unlockedRelics.map((relic) => (
                    <div key={relic.id} className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
                      <div className="text-sm text-slate-700 truncate">{relic.name}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => launchExpedition("relic", relic.id)}
                        disabled={artifactRelicState.resources.archaeologyCrews <= 0}
                        data-testid={`button-launch-relic-op-${relic.id}`}
                      >
                        Launch
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded border border-slate-200 p-3 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-2">
              Active Artifact/Relic Ops ({activeArtifactOps.length}) • Available Crews: {artifactRelicState.resources.archaeologyCrews}
            </div>
            <div className="space-y-2">
              {activeArtifactOps.length === 0 ? (
                <p className="text-sm text-slate-500">No active artifact/relic operations.</p>
              ) : (
                activeArtifactOps.map((expedition) => (
                  <div key={expedition.id} className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700">
                    {expedition.name} • {(expedition.successChance * 100).toFixed(0)}% success chance • {expedition.status}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Launch New Expedition */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Launch New Expedition
          </h3>

          {/* Row 1: name / category / sub-category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input
              placeholder="Expedition name"
              value={newExpName}
              onChange={(e) => setNewExpName(e.target.value)}
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              data-testid="input-exp-name"
            />
            <Select
              value={newExpCategory}
              onValueChange={(v) => { setNewExpCategory(v); setNewExpSubCategory(""); }}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newExpSubCategory}
              onValueChange={setNewExpSubCategory}
              disabled={!selectedCategory || selectedCategory.subCategories.length === 0}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Sub-category" />
              </SelectTrigger>
              <SelectContent>
                {(selectedCategory?.subCategories ?? []).map((sc: ExpeditionSubCategory) => (
                  <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: type / sub-type / target coords */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Select
              value={newExpType}
              onValueChange={(v) => { setNewExpType(v); setNewExpSubType(""); }}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.length > 0 ? types.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                )) : (
                  <>
                    <SelectItem value="exploration">Exploration</SelectItem>
                    <SelectItem value="military">Military</SelectItem>
                    <SelectItem value="scientific">Scientific</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                    <SelectItem value="conquest">Conquest</SelectItem>
                    <SelectItem value="diplomatic">Diplomatic</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Select
              value={newExpSubType}
              onValueChange={setNewExpSubType}
              disabled={!selectedType || selectedType.subTypes.length === 0}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Sub-type" />
              </SelectTrigger>
              <SelectContent>
                {(selectedType?.subTypes ?? []).map(st => (
                  <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Target coords (e.g. [1:2:3])"
              value={targetCoords}
              onChange={(e) => setTargetCoords(e.target.value)}
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              data-testid="input-exp-coords"
            />
          </div>

          {/* Row 3: tier / level / launch button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Tier (1–99){tierBand ? ` — ${tierBand}` : ""}
              </label>
              <Input
                type="number"
                min={1}
                max={99}
                placeholder="Tier (1-99)"
                value={newExpTier}
                onChange={(e) => setNewExpTier(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900"
                data-testid="input-exp-tier"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Level (1–999)</label>
              <Input
                type="number"
                min={1}
                max={999}
                placeholder="Level (1-999)"
                value={newExpLevel}
                onChange={(e) => setNewExpLevel(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900"
                data-testid="input-exp-level"
              />
            </div>
            <Button
              onClick={() =>
                createExpeditionMutation.mutate({
                  name: newExpName,
                  type: newExpType,
                  subType: newExpSubType || undefined,
                  categoryId: newExpCategory || undefined,
                  subCategoryId: newExpSubCategory || undefined,
                  tier: parseInt(newExpTier, 10) || 1,
                  level: parseInt(newExpLevel, 10) || 1,
                  targetCoordinates: targetCoords || "[1:1:1]",
                  fleetComposition: { corvettes: 5, destroyers: 2 },
                  troopComposition: { soldiers: 100, scouts: 20 },
                })
              }
              disabled={!newExpName || createExpeditionMutation.isPending}
              className="mt-5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
              data-testid="button-create-expedition"
            >
              {createExpeditionMutation.isPending ? "Launching..." : "Launch Expedition"}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs uppercase text-slate-500">Total Expeditions</div>
            <div className="text-2xl font-bold text-slate-900">{expeditions.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs uppercase text-slate-500">Active</div>
            <div className="text-2xl font-bold text-blue-700">{activeCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs uppercase text-slate-500">Completed</div>
            <div className="text-2xl font-bold text-green-700">{completedCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs uppercase text-slate-500">Failed</div>
            <div className="text-2xl font-bold text-rose-700">{failedCount}</div>
          </div>
        </div>

        {/* Expeditions Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-700 font-bold">Name</TableHead>
                <TableHead className="text-slate-700 font-bold">Type</TableHead>
                <TableHead className="text-slate-700 font-bold">Tier / Level</TableHead>
                <TableHead className="text-slate-700 font-bold">Target</TableHead>
                <TableHead className="text-slate-700 font-bold">Fleet</TableHead>
                <TableHead className="text-slate-700 font-bold">Troops</TableHead>
                <TableHead className="text-slate-700 font-bold">Status</TableHead>
                <TableHead className="text-right text-slate-700 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expeditions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No expeditions launched yet. Start your first expedition above!
                  </TableCell>
                </TableRow>
              ) : (
                expeditions.map((expedition: Expedition) => (
                  <TableRow
                    key={expedition.id}
                    className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedExpedition(expedition.id)}
                    data-testid={`expedition-row-${expedition.id}`}
                  >
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(expedition.type)}
                        <div>
                          <div>{expedition.name}</div>
                          {expedition.rank && (
                            <div className="text-xs text-slate-500">{expedition.rank}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 capitalize">
                      <div>{expedition.type}</div>
                      {expedition.subType && (
                        <div className="text-xs text-slate-400">{expedition.subType}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {expedition.tier != null ? (
                        <div>
                          <span className="font-semibold">T{expedition.tier}</span>
                          {expedition.tierClass && (
                            <span className="text-xs text-slate-400 ml-1">({expedition.tierClass})</span>
                          )}
                          {expedition.level != null && (
                            <div className="text-xs text-slate-400">Lv {expedition.level}</div>
                          )}
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono">{expedition.targetCoordinates}</TableCell>
                    <TableCell className="text-slate-600">
                      {Object.entries(expedition.fleetComposition)
                        .map(([ship, count]) => `${count} ${ship}`)
                        .join(", ") || "None"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {Object.entries(expedition.troopComposition)
                        .map(([troop, count]) => `${count} ${troop}`)
                        .join(", ") || "None"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(expedition.status)}>
                        {expedition.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {expedition.status === "preparing" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              launchExpeditionMutation.mutate(expedition.id);
                            }}
                            disabled={launchExpeditionMutation.isPending}
                            data-testid={`button-launch-expedition-${expedition.id}`}
                          >
                            Launch
                          </Button>
                        )}
                        {expedition.status === "in_progress" && (
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={(event) => {
                              event.stopPropagation();
                              resolveExpeditionMutation.mutate(expedition.id);
                            }}
                            disabled={resolveExpeditionMutation.isPending}
                            data-testid={`button-resolve-expedition-${expedition.id}`}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedExpedition(expedition.id);
                          }}
                          data-testid={`button-view-expedition-${expedition.id}`}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Selected Expedition Details */}
        {selectedExpedition && selectedExp && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedExp.name} — Details</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedExp.tier != null && (
                    <Badge className="bg-violet-100 text-violet-700">Tier {selectedExp.tier} {selectedExp.tierClass ? `(${selectedExp.tierClass})` : ""}</Badge>
                  )}
                  {selectedExp.level != null && (
                    <Badge className="bg-sky-100 text-sky-700">Level {selectedExp.level}</Badge>
                  )}
                  {selectedExp.rank && (
                    <Badge className="bg-amber-100 text-amber-700">{selectedExp.rank}</Badge>
                  )}
                  {selectedExp.title && (
                    <Badge className="bg-emerald-100 text-emerald-700">{selectedExp.title}</Badge>
                  )}
                  {selectedExp.categoryId && (
                    <Badge className="bg-indigo-100 text-indigo-700">{selectedExp.categoryId.replace(/-/g, " ")}</Badge>
                  )}
                  {selectedExp.subType && (
                    <Badge className="bg-pink-100 text-pink-700">{selectedExp.subType.replace(/-/g, " ")}</Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fleet Composition</p>
                  <div className="space-y-1">
                    {Object.entries(selectedExp.fleetComposition).map(([ship, count]: [string, any]) => (
                      <p key={ship} className="text-sm text-slate-700">
                        <span className="capitalize font-semibold">{ship}:</span> {count}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Troop Composition</p>
                  <div className="space-y-1">
                    {Object.entries(selectedExp.troopComposition).map(([troop, count]: [string, any]) => (
                      <p key={troop} className="text-sm text-slate-700">
                        <span className="capitalize font-semibold">{troop}:</span> {count}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Casualties</p>
                  <div className="space-y-1">
                    {Object.entries(selectedExp.casualties).length === 0 ? (
                      <p className="text-sm text-slate-500">No casualties recorded.</p>
                    ) : (
                      Object.entries(selectedExp.casualties).map(([unit, count]: [string, any]) => (
                        <p key={unit} className="text-sm text-red-600">
                          <span className="capitalize font-semibold">{unit}:</span> {count}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Resources Recovered</p>
                  <div className="space-y-1">
                    {Object.entries(selectedExp.resources).length === 0 ? (
                      <p className="text-sm text-slate-500">No recovered resources recorded yet.</p>
                    ) : (
                      Object.entries(selectedExp.resources).map(([resource, count]: [string, any]) => (
                        <p key={resource} className="text-sm text-emerald-700">
                          <span className="capitalize font-semibold">{resource}:</span> {count}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Discoveries</p>
                  <div className="space-y-1">
                    {(selectedExp.discoveries || []).length === 0 ? (
                      <p className="text-sm text-slate-500">No discoveries logged.</p>
                    ) : (
                      (selectedExp.discoveries || []).map((discovery: any, index: number) => (
                        <p key={index} className="text-sm text-slate-700">
                          • {typeof discovery === "string" ? discovery : JSON.stringify(discovery)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Reward Ledger</p>
                  <div className="space-y-1">
                    {Object.entries(selectedExp.rewards || {}).length === 0 ? (
                      <p className="text-sm text-slate-500">Rewards will populate after resolution.</p>
                    ) : (
                      Object.entries(selectedExp.rewards || {}).map(([reward, count]) => (
                        <p key={reward} className="text-sm text-amber-700">
                          <span className="capitalize font-semibold">{reward}:</span> {count}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Timeline</p>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p>Prepared: {selectedExp.startedAt ? new Date(selectedExp.startedAt).toLocaleString() : "N/A"}</p>
                    <p>Launched: {selectedExp.launchedAt ? new Date(selectedExp.launchedAt).toLocaleString() : "Not launched"}</p>
                    <p>Completed: {selectedExp.completedAt ? new Date(selectedExp.completedAt).toLocaleString() : "Not resolved"}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Command Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.status === "preparing" && (
                      <Button
                        onClick={() => launchExpeditionMutation.mutate(selectedExp.id)}
                        disabled={launchExpeditionMutation.isPending}
                        data-testid={`button-launch-detail-expedition-${selectedExp.id}`}
                      >
                        {launchExpeditionMutation.isPending ? "Launching..." : "Launch"}
                      </Button>
                    )}
                    {selectedExp.status === "in_progress" && (
                      <Button
                        onClick={() => resolveExpeditionMutation.mutate(selectedExp.id)}
                        disabled={resolveExpeditionMutation.isPending}
                        data-testid={`button-resolve-detail-expedition-${selectedExp.id}`}
                      >
                        {resolveExpeditionMutation.isPending ? "Resolving..." : "Resolve"}
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedExpedition(null)}>
                      Close Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Catalog Panel */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setCatalogOpen(o => !o)}
            data-testid="toggle-catalog"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-slate-900">Expedition Category Catalog</span>
              <Badge className="bg-indigo-100 text-indigo-700 ml-1">18 Categories · 32 Sub-categories</Badge>
            </div>
            <span className="text-slate-400 text-xs">{catalogOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {catalogOpen && (
            <div className="border-t border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatalogCategory(selectedCatalogCategory === cat.id ? null : cat.id)}
                    className={`text-left rounded border p-3 transition-colors ${
                      selectedCatalogCategory === cat.id
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-semibold text-slate-900 text-sm">{cat.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</div>
                    {cat.subCategories.length > 0 && (
                      <div className="text-xs text-indigo-500 mt-1">{cat.subCategories.length} sub-categories</div>
                    )}
                  </button>
                ))}
              </div>
              {catalogCategoryDetail && (
                <div className="border border-indigo-200 rounded-lg bg-indigo-50 p-4">
                  <h4 className="font-bold text-indigo-900 mb-1">{catalogCategoryDetail.name}</h4>
                  <p className="text-sm text-indigo-700 mb-1">{catalogCategoryDetail.description}</p>
                  <p className="text-xs text-indigo-600 mb-3">{catalogCategoryDetail.subDescription}</p>
                  {catalogCategoryDetail.subCategories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {catalogCategoryDetail.subCategories.map((sc: ExpeditionSubCategory) => (
                        <div key={sc.id} className="bg-white rounded border border-indigo-200 p-3">
                          <div className="font-semibold text-slate-900 text-sm">{sc.name}</div>
                          <div className="text-xs text-slate-600 mt-1">{sc.description}</div>
                          <div className="text-xs text-slate-400 mt-1 italic">{sc.subDescription}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sc.availableTypes.map(t => (
                              <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tier Reference Panel */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setTiersOpen(o => !o)}
            data-testid="toggle-tiers"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              <span className="font-bold text-slate-900">Tier Reference (1–99)</span>
              <Badge className="bg-violet-100 text-violet-700 ml-1">10 Classes · 99 Tiers</Badge>
            </div>
            <span className="text-slate-400 text-xs">{tiersOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {tiersOpen && tiersData && (
            <div className="border-t border-slate-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Tier</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Sub-class</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Power</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Min Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiersData.tiers.slice(0, 20).map((tier: ExpeditionTier) => (
                    <TableRow key={tier.tier} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-violet-700">{tier.tier}</TableCell>
                      <TableCell>{tier.tierClass}</TableCell>
                      <TableCell>{tier.tierSubClass}</TableCell>
                      <TableCell>{tier.name}</TableCell>
                      <TableCell className="text-slate-600">{tier.rank}</TableCell>
                      <TableCell className="text-slate-600 italic text-xs">{tier.title}</TableCell>
                      <TableCell>{tier.stats.power.toLocaleString()}</TableCell>
                      <TableCell>{tier.stats.speed.toLocaleString()}</TableCell>
                      <TableCell>{tier.stats.range.toLocaleString()}</TableCell>
                      <TableCell>{tier.minPlayerLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {tiersData.tiers.length > 20 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  Showing 20 of {tiersData.tiers.length} tiers. Use the API to retrieve the full list.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Planning Guidance */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-900 mb-2">Expedition Planning Guidance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Use exploration missions to map risk before sending high-value military fleets.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Balance troop composition against expected attrition to protect campaign momentum.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Track failed routes and optimise by coordinating escorts or alternate coordinates.</div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
