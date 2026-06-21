import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calculator, Database } from "lucide-react";

type CatalogCost = {
  metal: number;
  crystal: number;
  deuterium: number;
  energy?: number;
  darkMatter?: number;
};

type CatalogEntry = {
  id: string;
  categoryId: string;
  entryType: string;
  name: string;
  description: string;
  baseCost: CatalogCost;
  baseTimeSeconds: number;
  growthFactor: number;
  prerequisites: Record<string, number>;
  stats: Record<string, number | string | boolean>;
  isMoonOnly: boolean;
};

type CatalogCategory = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  entries: CatalogEntry[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

type CostResult = {
  entryId: string;
  level: number;
  quantity: number;
  cost: CatalogCost;
};

const formatNumber = (value: number | undefined) =>
  Math.max(0, Math.floor(value || 0)).toLocaleString();

const typeColor = (entryType: string) => {
  switch (entryType) {
    case "building":
      return "bg-amber-100 text-amber-900";
    case "research":
      return "bg-blue-100 text-blue-900";
    case "ship":
      return "bg-cyan-100 text-cyan-900";
    case "defense":
      return "bg-red-100 text-red-900";
    case "moon":
      return "bg-indigo-100 text-indigo-900";
    case "officer":
      return "bg-purple-100 text-purple-900";
    default:
      return "bg-slate-100 text-slate-900";
  }
};

export default function OgameCompendium() {
  const [search, setSearch] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [levelInput, setLevelInput] = useState("1");
  const [quantityInput, setQuantityInput] = useState("1");

  const catalogQuery = useQuery<CatalogCategory[]>({
    queryKey: ["/api/ogame/catalog"],
    queryFn: async () => {
      const res = await fetch("/api/ogame/catalog", { credentials: "include" });
      if (!res.ok) {
        throw new Error(`Failed to load catalog (${res.status})`);
      }
      const json = (await res.json()) as ApiResponse<CatalogCategory[]>;
      return json.data;
    },
  });

  const allEntries = useMemo(
    () => (catalogQuery.data || []).flatMap((category) => category.entries),
    [catalogQuery.data],
  );

  const selectedEntry = useMemo(
    () => allEntries.find((entry) => entry.id === selectedEntryId),
    [allEntries, selectedEntryId],
  );

  const costMutation = useMutation<CostResult, Error, { entryId: string; level: number; quantity: number }>({
    mutationFn: async (payload) => {
      const res = await apiRequest("POST", "/api/ogame/simulate/cost", payload);
      const json = (await res.json()) as ApiResponse<CostResult>;
      return json.data;
    },
  });

  const level = Math.max(1, Math.floor(Number(levelInput) || 1));
  const quantity = Math.max(1, Math.floor(Number(quantityInput) || 1));

  const filteredByCategory = (entries: CatalogEntry[]) =>
    entries.filter((entry) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q)
      );
    });

  const categoryCount = catalogQuery.data?.length || 0;
  const totalEntries = allEntries.length;
  const moonOnlyEntries = allEntries.filter((entry) => entry.isMoonOnly).length;
  const researchEntries = allEntries.filter((entry) => entry.entryType === 'research').length;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">OGame Compendium</h2>
          <p className="text-muted-foreground">
            SQL-backed catalog for buildings, research, ships, defenses, moon facilities, and officers.
          </p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, id, or description"
                className="pl-9"
                data-testid="input-ogame-search"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Categories</div><div className="text-2xl font-orbitron font-bold text-slate-900">{categoryCount}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Entries</div><div className="text-2xl font-orbitron font-bold text-blue-700">{totalEntries}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Research Nodes</div><div className="text-2xl font-orbitron font-bold text-indigo-700">{researchEntries}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Moon-Only</div><div className="text-2xl font-orbitron font-bold text-purple-700">{moonOnlyEntries}</div></CardContent></Card>
        </div>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-900">Compendium Planning Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-emerald-900">
            <div className="rounded border border-emerald-200 bg-white/70 p-3">Sequence economy buildings before fleet expansion to reduce idle queue time.</div>
            <div className="rounded border border-emerald-200 bg-white/70 p-3">Use calculator levels as milestone snapshots when planning alliance operation windows.</div>
            <div className="rounded border border-emerald-200 bg-white/70 p-3">Track moon-only assets separately for late-game infrastructure dependency management.</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Cost Calculator
            </CardTitle>
            <CardDescription>Pick an entry and calculate level-scaled cost.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                placeholder="Entry id (ex: metalMine)"
                data-testid="input-ogame-entry-id"
              />
              <Input
                type="number"
                min={1}
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value)}
                placeholder="Level"
                data-testid="input-ogame-level"
              />
              <Input
                type="number"
                min={1}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                placeholder="Quantity"
                data-testid="input-ogame-quantity"
              />
            </div>

            {selectedEntry && (
              <div className="rounded border border-slate-200 p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{selectedEntry.name}</div>
                <div className="text-xs text-slate-500">{selectedEntry.id}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-200 bg-slate-50 p-2">Type: {selectedEntry.entryType}</div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2">Growth: x{selectedEntry.growthFactor}</div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2">Base Time: {selectedEntry.baseTimeSeconds}s</div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-2">Moon Only: {selectedEntry.isMoonOnly ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                if (!selectedEntryId.trim()) return;
                costMutation.mutate({ entryId: selectedEntryId.trim(), level, quantity });
              }}
              className="w-full"
              data-testid="button-ogame-calc"
            >
              Calculate Cost
            </Button>

            {costMutation.data && (
              <div className="rounded border border-slate-200 p-3 bg-slate-50">
                <div className="text-sm font-semibold text-slate-900 mb-2">Calculated Cost</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="rounded border border-slate-200 bg-white p-2">
                    Metal: {formatNumber(costMutation.data.cost.metal)}
                  </div>
                  <div className="rounded border border-slate-200 bg-white p-2">
                    Crystal: {formatNumber(costMutation.data.cost.crystal)}
                  </div>
                  <div className="rounded border border-slate-200 bg-white p-2">
                    Deut: {formatNumber(costMutation.data.cost.deuterium)}
                  </div>
                  <div className="rounded border border-slate-200 bg-white p-2">
                    Energy: {formatNumber(costMutation.data.cost.energy)}
                  </div>
                  <div className="rounded border border-slate-200 bg-white p-2">
                    DM: {formatNumber(costMutation.data.cost.darkMatter)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {catalogQuery.isLoading && (
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6 text-sm text-slate-600">Loading OGame catalog...</CardContent>
          </Card>
        )}

        {catalogQuery.error && (
          <Card className="bg-white border-red-200">
            <CardContent className="pt-6 text-sm text-red-600">
              {(catalogQuery.error as Error).message}
            </CardContent>
          </Card>
        )}

        {catalogQuery.data && (
          <Tabs defaultValue={catalogQuery.data[0]?.id || "economy"}>
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
              {catalogQuery.data.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="bg-white border border-slate-200 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {catalogQuery.data.map((category) => {
              const entries = filteredByCategory(category.entries);
              return (
                <TabsContent key={category.id} value={category.id} className="mt-4">
                  <div className="mb-3 text-sm text-slate-600">{category.description}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entries.length === 0 && (
                      <Card className="bg-white border-slate-200 md:col-span-2">
                        <CardContent className="pt-6 text-sm text-slate-500">
                          No entries match your current search.
                        </CardContent>
                      </Card>
                    )}

                    {entries.map((entry) => (
                      <Card key={entry.id} className="bg-white border-slate-200" data-testid={`ogame-entry-${entry.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-base text-slate-900">{entry.name}</CardTitle>
                              <CardDescription>{entry.id}</CardDescription>
                            </div>
                            <Badge className={typeColor(entry.entryType)}>{entry.entryType}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-slate-600">{entry.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded border border-slate-200 p-2">M: {formatNumber(entry.baseCost.metal)}</div>
                            <div className="rounded border border-slate-200 p-2">C: {formatNumber(entry.baseCost.crystal)}</div>
                            <div className="rounded border border-slate-200 p-2">D: {formatNumber(entry.baseCost.deuterium)}</div>
                            <div className="rounded border border-slate-200 p-2">T: {formatNumber(entry.baseTimeSeconds)}s</div>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedEntryId(entry.id)}
                            data-testid={`button-use-entry-${entry.id}`}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Use In Calculator
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </GameLayout>
  );
}
