import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Settings,
  Cpu,
  Layers,
  Heart,
  Users,
  Hammer,
  FileCode,
  ShieldCheck,
} from "lucide-react";

type ConfigTab = "buildings" | "factory" | "civilization" | "lifesupport" | "systems";

async function fetchConfig<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, { credentials: "include" });
  if (!response.ok) throw new Error(`Failed to load ${endpoint}`);
  return response.json();
}

export default function ConfigExplorer() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("buildings");
  const [search, setSearch] = useState("");
  const [inspectItem, setInspectItem] = useState<any>(null);

  // Queries
  const { data: buildingsData, isLoading: buildingsLoading } = useQuery<any>({
    queryKey: ["config-buildings"],
    queryFn: () => fetchConfig("/api/config/building-archetypes"),
  });

  const { data: factoryData, isLoading: factoryLoading } = useQuery<any>({
    queryKey: ["config-factory"],
    queryFn: () => fetchConfig("/api/config/factory-job-archetypes"),
  });

  const { data: civilizationData, isLoading: civLoading } = useQuery<any>({
    queryKey: ["config-civilization"],
    queryFn: () => fetchConfig("/api/config/civilization-jobs"),
  });

  const { data: lifeSupportData, isLoading: lsLoading } = useQuery<any>({
    queryKey: ["config-lifesupport"],
    queryFn: () => fetchConfig("/api/config/life-support-systems"),
  });

  const { data: frameData } = useQuery<any>({
    queryKey: ["config-frames"],
    queryFn: () => fetchConfig("/api/config/frame-systems"),
    enabled: activeTab === "systems",
  });

  const { data: popData } = useQuery<any>({
    queryKey: ["config-pop"],
    queryFn: () => fetchConfig("/api/config/population-system"),
    enabled: activeTab === "systems",
  });

  const { data: foodData } = useQuery<any>({
    queryKey: ["config-food"],
    queryFn: () => fetchConfig("/api/config/food-system"),
    enabled: activeTab === "systems",
  });

  const { data: waterData } = useQuery<any>({
    queryKey: ["config-water"],
    queryFn: () => fetchConfig("/api/config/water-system"),
    enabled: activeTab === "systems",
  });

  // Filter items based on search
  const filterList = (items: any[]) => {
    if (!items || !Array.isArray(items)) return [];
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(s)) ||
        (item.id && item.id.toLowerCase().includes(s)) ||
        (item.description && item.description.toLowerCase().includes(s))
    );
  };

  const getLoadingState = () => {
    if (activeTab === "buildings" && buildingsLoading) return true;
    if (activeTab === "factory" && factoryLoading) return true;
    if (activeTab === "civilization" && civLoading) return true;
    if (activeTab === "lifesupport" && lsLoading) return true;
    return false;
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-500/20 border border-blue-500/35 rounded-xl flex items-center justify-center">
              <Settings className="h-8 w-8 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <h2 className="text-3xl font-orbitron font-black text-white drop-shadow">Game Systems Configuration</h2>
              <p className="text-blue-300 mt-1">Explore and inspect the active balancing configurations, archetypes, and formula modules.</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as ConfigTab); setInspectItem(null); }} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700 flex h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="buildings" className="font-orbitron data-[state=active]:bg-slate-800">
              <Layers className="w-4 h-4 mr-2" /> Buildings ({buildingsData?.items?.length || buildingsData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="factory" className="font-orbitron data-[state=active]:bg-slate-800">
              <Hammer className="w-4 h-4 mr-2" /> Factory Jobs ({factoryData?.items?.length || factoryData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="civilization" className="font-orbitron data-[state=active]:bg-slate-800">
              <Cpu className="w-4 h-4 mr-2" /> Civ Jobs ({civilizationData?.items?.length || civilizationData?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="lifesupport" className="font-orbitron data-[state=active]:bg-slate-800">
              <Heart className="w-4 h-4 mr-2" /> Life Support
            </TabsTrigger>
            <TabsTrigger value="systems" className="font-orbitron data-[state=active]:bg-slate-800">
              <Users className="w-4 h-4 mr-2" /> Framework Systems
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Filter configuration items by name, ID or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-700 text-white"
                />
              </div>

              {getLoadingState() ? (
                <div className="flex items-center justify-center h-64 text-slate-400">Loading configurations...</div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <TabsContent value="buildings" className="m-0 space-y-3">
                    {filterList(buildingsData?.items || buildingsData || []).map((b: any) => (
                      <Card key={b.id} className="bg-slate-900/60 border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all" onClick={() => setInspectItem(b)}>
                        <CardContent className="p-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">{b.name}</span>
                              <Badge variant="outline" className="text-xs bg-blue-950/40 text-blue-400 border-blue-900/60">{b.id}</Badge>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">{b.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {b.category && <Badge className="bg-slate-800 text-slate-300">Category: {b.category}</Badge>}
                              {b.type && <Badge className="bg-slate-800 text-slate-300">Type: {b.type}</Badge>}
                              {b.powerNeeded && <Badge className="bg-amber-900/20 text-amber-400 border-amber-900/40">Power: {b.powerNeeded}</Badge>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setInspectItem(b); }}>Inspect</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="factory" className="m-0 space-y-3">
                    {filterList(factoryData?.items || factoryData || []).map((f: any) => (
                      <Card key={f.id} className="bg-slate-900/60 border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all" onClick={() => setInspectItem(f)}>
                        <CardContent className="p-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">{f.name}</span>
                              <Badge variant="outline" className="text-xs bg-green-950/40 text-green-400 border-green-900/60">{f.id}</Badge>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">{f.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {f.tier && <Badge className="bg-slate-800 text-slate-300">Tier {f.tier}</Badge>}
                              {f.efficiency && <Badge className="bg-slate-800 text-slate-300">Eff: {f.efficiency}%</Badge>}
                              {f.baseCycleTimeSec && <Badge className="bg-slate-800 text-slate-300">Cycle: {f.baseCycleTimeSec}s</Badge>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setInspectItem(f); }}>Inspect</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="civilization" className="m-0 space-y-3">
                    {filterList(civilizationData?.items || civilizationData?.items || []).map((c: any) => (
                      <Card key={c.id} className="bg-slate-900/60 border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all" onClick={() => setInspectItem(c)}>
                        <CardContent className="p-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">{c.name}</span>
                              <Badge variant="outline" className="text-xs bg-purple-950/40 text-purple-400 border-purple-900/60">{c.id}</Badge>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">{c.description || c.summary}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {c.domain && <Badge className="capitalize bg-slate-800 text-slate-300">{c.domain}</Badge>}
                              {c.rarity && <Badge className="capitalize bg-slate-800 text-slate-300">{c.rarity}</Badge>}
                              {c.class && <Badge className="bg-slate-800 text-slate-300">{c.class} Class</Badge>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setInspectItem(c); }}>Inspect</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="lifesupport" className="m-0 space-y-3">
                    <Card className="bg-slate-900/60 border-slate-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Heart className="w-5 h-5 text-rose-500" /> Life Support Systems Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <p className="text-slate-400 text-sm">Active parameters and constants driving the life support grids, recycling modules, and pressure systems.</p>
                        {lifeSupportData ? (
                          <pre className="p-3 bg-black/60 rounded border border-slate-850 text-xs font-mono text-cyan-400 overflow-x-auto max-h-96">
                            {JSON.stringify(lifeSupportData, null, 2)}
                          </pre>
                        ) : (
                          <div className="text-slate-500 italic">No configurations loaded.</div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="systems" className="m-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-900/60 border-slate-800">
                        <CardHeader className="pb-2"><CardTitle className="text-white text-sm">Frame Systems</CardTitle></CardHeader>
                        <CardContent className="p-4"><pre className="p-2 bg-black/40 rounded border border-slate-800 text-xs font-mono text-cyan-400 max-h-64 overflow-y-auto">{JSON.stringify(frameData || {}, null, 2)}</pre></CardContent>
                      </Card>
                      <Card className="bg-slate-900/60 border-slate-800">
                        <CardHeader className="pb-2"><CardTitle className="text-white text-sm">Population System</CardTitle></CardHeader>
                        <CardContent className="p-4"><pre className="p-2 bg-black/40 rounded border border-slate-800 text-xs font-mono text-cyan-400 max-h-64 overflow-y-auto">{JSON.stringify(popData || {}, null, 2)}</pre></CardContent>
                      </Card>
                      <Card className="bg-slate-900/60 border-slate-800">
                        <CardHeader className="pb-2"><CardTitle className="text-white text-sm">Food System</CardTitle></CardHeader>
                        <CardContent className="p-4"><pre className="p-2 bg-black/40 rounded border border-slate-800 text-xs font-mono text-cyan-400 max-h-64 overflow-y-auto">{JSON.stringify(foodData || {}, null, 2)}</pre></CardContent>
                      </Card>
                      <Card className="bg-slate-900/60 border-slate-800">
                        <CardHeader className="pb-2"><CardTitle className="text-white text-sm">Water System</CardTitle></CardHeader>
                        <CardContent className="p-4"><pre className="p-2 bg-black/40 rounded border border-slate-800 text-xs font-mono text-cyan-400 max-h-64 overflow-y-auto">{JSON.stringify(waterData || {}, null, 2)}</pre></CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-900 border-slate-800 sticky top-24">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" /> Live Configuration Inspector
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {inspectItem ? (
                    <div className="space-y-4">
                      <div>
                        <div className="font-bold text-white text-lg">{inspectItem.name || inspectItem.id}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">ID: {inspectItem.id}</div>
                      </div>
                      <pre className="p-3 bg-black/60 rounded border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                        {JSON.stringify(inspectItem, null, 2)}
                      </pre>
                      <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white" onClick={() => setInspectItem(null)}>
                        Clear Inspector
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 space-y-3">
                      <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
                      <p className="text-sm">Select an archetype or configuration item to inspect its complete active property tree.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
