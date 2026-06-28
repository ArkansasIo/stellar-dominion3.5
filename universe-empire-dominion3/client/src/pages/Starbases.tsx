import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Rocket, Pickaxe, Factory, FlaskConical, ShoppingCart, Shield, Crown,
  Plus, ArrowUp, Trash2, Power, PowerOff, Edit3, Check, X, Loader2,
  HardDrive, Swords, Wrench, Package, Zap, BarChart3, Layers,
  Box, Gem, Database, Clock, Cpu, Target, Radar, Crosshair,
  ChevronDown, ChevronRight, Info,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStarbases,
  fetchStarbaseTypes,
  fetchStarbaseModules,
  buildStarbase,
  upgradeStarbase,
  renameStarbase,
  toggleStarbase,
  deleteStarbase,
  type StarbaseWithType,
} from "@/lib/starbaseData";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { StarbaseType, StarbaseModule, StarbaseModuleCategory } from "@shared/config/starbaseConfig";

const STARBASE_ICONS: Record<StarbaseType, typeof Rocket> = {
  mining: Pickaxe,
  refining: Factory,
  shipyard: Rocket,
  research: FlaskConical,
  trade: ShoppingCart,
  defense: Shield,
  command: Crown,
};

const STARBASE_COLORS: Record<StarbaseType, string> = {
  mining: "from-amber-500 to-orange-600",
  refining: "from-cyan-500 to-blue-600",
  shipyard: "from-green-500 to-emerald-600",
  research: "from-purple-500 to-violet-600",
  trade: "from-yellow-500 to-amber-600",
  defense: "from-red-500 to-rose-600",
  command: "from-indigo-500 to-blue-600",
};

const STARBASE_BG: Record<StarbaseType, string> = {
  mining: "bg-amber-900/20 border-amber-800/40",
  refining: "bg-cyan-900/20 border-cyan-800/40",
  shipyard: "bg-green-900/20 border-green-800/40",
  research: "bg-purple-900/20 border-purple-800/40",
  trade: "bg-yellow-900/20 border-yellow-800/40",
  defense: "bg-red-900/20 border-red-800/40",
  command: "bg-indigo-900/20 border-indigo-800/40",
};

export default function Starbases() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStarbase, setSelectedStarbase] = useState<StarbaseWithType | null>(null);
  const [buildType, setBuildType] = useState<StarbaseType | null>(null);
  const [buildName, setBuildName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [installedModules, setInstalledModules] = useState<Record<string, Array<{ moduleId: string; level: number }>>>({});
  const [selectedModCategory, setSelectedModCategory] = useState<StarbaseModuleCategory | "all">("all");

  const { data: starbases = [], isLoading } = useQuery({
    queryKey: ["starbases"],
    queryFn: fetchStarbases,
  });

  const { data: starbaseTypes = [] } = useQuery({
    queryKey: ["starbase-types"],
    queryFn: fetchStarbaseTypes,
  });

  const selectedType = selectedStarbase?.starbaseType as StarbaseType | undefined;
  const { data: availableModules = [] } = useQuery({
    queryKey: ["starbase-modules", selectedType],
    queryFn: () => fetchStarbaseModules(selectedType!),
    enabled: !!selectedType,
  });

  const moduleCategories: { key: StarbaseModuleCategory; label: string; icon: typeof Wrench }[] = [
    { key: "production", label: "Production", icon: Zap },
    { key: "storage", label: "Storage", icon: Package },
    { key: "defense", label: "Defense", icon: Shield },
    { key: "offense", label: "Offense", icon: Crosshair },
    { key: "support", label: "Support", icon: Wrench },
    { key: "utility", label: "Utility", icon: Cpu },
  ];
  const MODULE_ICONS: Record<string, typeof Wrench> = {
    production: Zap, storage: Package, defense: Shield,
    offense: Crosshair, support: Wrench, utility: Cpu,
  };
  const MODULE_COLORS: Record<string, string> = {
    production: "bg-amber-900/30 text-amber-300 border-amber-800/50",
    storage: "bg-blue-900/30 text-blue-300 border-blue-800/50",
    defense: "bg-green-900/30 text-green-300 border-green-800/50",
    offense: "bg-red-900/30 text-red-300 border-red-800/50",
    support: "bg-purple-900/30 text-purple-300 border-purple-800/50",
    utility: "bg-cyan-900/30 text-cyan-300 border-cyan-800/50",
  };
  const TIER_COLORS: Record<string, string> = {
    standard: "bg-slate-700 text-slate-300",
    advanced: "bg-blue-900/50 text-blue-300",
    elite: "bg-purple-900/50 text-purple-300",
    legendary: "bg-amber-900/50 text-amber-300",
  };

  const filteredModules = selectedModCategory === "all"
    ? availableModules
    : availableModules.filter((m: StarbaseModule) => m.category === selectedModCategory);

  const buildMutation = useMutation({
    mutationFn: () => buildStarbase(buildType!, buildName || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starbases"] });
      toast({ title: "Starbase Constructed", description: `New ${buildType} starbase is now operational.` });
      setShowBuildMenu(false);
      setBuildType(null);
      setBuildName("");
    },
    onError: (e: any) => toast({ title: "Construction Failed", description: e.message, variant: "destructive" }),
  });

  const upgradeMutation = useMutation({
    mutationFn: (id: string) => upgradeStarbase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starbases"] });
      toast({ title: "Starbase Upgraded", description: "Level increased successfully." });
    },
    onError: (e: any) => toast({ title: "Upgrade Failed", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleStarbase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starbases"] });
      toast({ title: "Status Updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStarbase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starbases"] });
      setSelectedStarbase(null);
      toast({ title: "Starbase Decommissioned" });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameStarbase(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starbases"] });
      setEditingId(null);
      toast({ title: "Renamed" });
    },
  });

  const activeCount = starbases.filter((s) => s.isActive).length;
  const totalProduction = starbases.reduce(
    (acc, s) => ({
      metal: acc.metal + (s.isActive ? s.metalProductionRate : 0),
      crystal: acc.crystal + (s.isActive ? s.crystalProductionRate : 0),
      deuterium: acc.deuterium + (s.isActive ? s.deuteriumProductionRate : 0),
    }),
    { metal: 0, crystal: 0, deuterium: 0 }
  );

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
              <HardDrive className="w-7 h-7 text-primary" /> Starbase Infrastructure
            </h1>
            <p className="text-sm text-slate-400 mt-1">Build and manage your interstellar starbase network</p>
          </div>
          <Button onClick={() => setShowBuildMenu(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Construct Starbase
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">Total Starbases</div>
              <div className="text-2xl font-bold text-white">{starbases.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-400">{activeCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">Metal/hr</div>
              <div className="text-2xl font-bold text-amber-400">{totalProduction.metal.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">Crystal/hr</div>
              <div className="text-2xl font-bold text-purple-400">{totalProduction.crystal.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Build Menu */}
        {showBuildMenu && (
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-slate-800 to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2"><Plus className="w-5 h-5" /> Construct New Starbase</span>
                <Button variant="ghost" size="sm" onClick={() => { setShowBuildMenu(false); setBuildType(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription className="text-slate-400">Choose a starbase type and name your installation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.values(starbaseTypes).map((type: any) => {
                  const Icon = STARBASE_ICONS[type.id as StarbaseType] || Rocket;
                  const isSelected = buildType === type.id;
                  const stats = type.baseStats || {};
                  return (
                    <Tooltip key={type.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setBuildType(type.id)}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all",
                            isSelected ? "border-primary bg-primary/10 shadow-md" : "border-slate-700 hover:border-slate-600 bg-slate-800"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white mb-2", STARBASE_COLORS[type.id as StarbaseType])}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="font-medium text-sm text-white">{type.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{type.description?.substring(0, 60)}...</div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="w-72 p-3 space-y-2">
                        <div className="font-bold text-sm">{type.name}</div>
                        <div className="text-xs text-slate-300">{type.description}</div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs border-t border-slate-600 pt-2">
                          <div><span className="text-slate-400">Max Level:</span> <span className="font-medium text-white">{type.maxLevel}</span></div>
                          <div><span className="text-slate-400">Module Slots:</span> <span className="font-medium text-white">{type.moduleSlots}</span></div>
                        </div>
                        {stats.metalStorage !== undefined && (
                          <div className="border-t border-slate-600 pt-2">
                            <div className="text-xs text-slate-400 mb-1.5 font-medium">Base Stats (Lv.1)</div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                              <div><span className="text-slate-400">Metal/hr:</span> <span className="font-medium text-amber-400">{stats.metalProduction}</span></div>
                              <div><span className="text-slate-400">Crystal/hr:</span> <span className="font-medium text-blue-400">{stats.crystalProduction}</span></div>
                              <div><span className="text-slate-400">Deut/hr:</span> <span className="font-medium text-green-400">{stats.deuteriumProduction}</span></div>
                              <div><span className="text-slate-400">Defense:</span> <span className="font-medium text-red-400">{stats.defenseLevel}</span></div>
                              <div><span className="text-slate-400">Hangar:</span> <span className="font-medium">{stats.hangarSlots}</span></div>
                              <div><span className="text-slate-400">Research:</span> <span className="font-medium">{stats.researchSlots}</span></div>
                              <div className="col-span-2"><span className="text-slate-400">Metal Storage:</span> <span className="font-medium text-white">{stats.metalStorage?.toLocaleString()}</span></div>
                            </div>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              {buildType && (
                <div className="flex items-end gap-3 pt-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium text-slate-300">Starbase Name</label>
                    <Input
                      value={buildName}
                      onChange={(e) => setBuildName(e.target.value)}
                      placeholder={`My ${buildType} Station`}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Button onClick={() => buildMutation.mutate()} disabled={buildMutation.isPending}>
                    {buildMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                    Construct
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Starbase List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : starbases.length === 0 ? (
          <Card className="py-12 bg-slate-900/80 border-slate-700">
            <CardContent className="text-center">
              <HardDrive className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">No Starbases</h3>
              <p className="text-sm text-slate-400 mt-1">Construct your first starbase to begin building your infrastructure.</p>
              <Button className="mt-4" onClick={() => setShowBuildMenu(true)}>
                <Plus className="w-4 h-4 mr-2" /> Build First Starbase
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {starbases.map((sb) => {
              const Icon = STARBASE_ICONS[sb.starbaseType as StarbaseType] || Rocket;
              const isSelected = selectedStarbase?.id === sb.id;
              const isEditing = editingId === sb.id;
              const levelProgress = ((sb.level) / (sb.typeInfo?.maxLevel || 50)) * 100;

              return (
                <Card
                  key={sb.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    isSelected && "ring-2 ring-primary shadow-lg",
                    !sb.isActive && "opacity-60",
                    STARBASE_BG[sb.starbaseType as StarbaseType]
                  )}
                  onClick={() => setSelectedStarbase(isSelected ? null : sb)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow", STARBASE_COLORS[sb.starbaseType as StarbaseType])}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-7 text-sm w-40 bg-slate-800 border-slate-600 text-white"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") renameMutation.mutate({ id: sb.id, name: editName });
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                autoFocus
                              />
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); renameMutation.mutate({ id: sb.id, name: editName }); }}>
                                <Check className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="font-orbitron font-bold text-white text-sm flex items-center gap-1">
                              {sb.name}
                              <button className="text-slate-500 hover:text-slate-300" onClick={(e) => { e.stopPropagation(); setEditingId(sb.id); setEditName(sb.name); }}>
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <div className="text-xs text-slate-400">
                            <Badge variant="outline" className="text-xs mr-1 text-slate-300 border-slate-600">Lv.{sb.level}</Badge>
                            {sb.typeInfo?.name || sb.starbaseType}
                          </div>
                        </div>
                      </div>
                      <Badge variant={sb.isActive ? "default" : "secondary"} className="text-xs">
                        {sb.isActive ? "Active" : "Offline"}
                      </Badge>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Level {sb.level}</span>
                        <span>{sb.typeInfo?.maxLevel || 50}</span>
                      </div>
                      <Progress value={levelProgress} className="h-1.5" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="bg-slate-800/80 rounded p-1.5 text-center">
                        <div className="text-amber-400 font-bold">{sb.metalProductionRate.toLocaleString()}</div>
                        <div className="text-slate-400">Metal/hr</div>
                      </div>
                      <div className="bg-slate-800/80 rounded p-1.5 text-center">
                        <div className="text-cyan-400 font-bold">{sb.crystalProductionRate.toLocaleString()}</div>
                        <div className="text-slate-400">Crystal/hr</div>
                      </div>
                      <div className="bg-slate-800/80 rounded p-1.5 text-center">
                        <div className="text-blue-400 font-bold">{sb.deuteriumProductionRate.toLocaleString()}</div>
                        <div className="text-slate-400">Deut/hr</div>
                      </div>
                    </div>

                    {/* Defense & Hangar */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><Swords className="w-3 h-3" /> Defense: {sb.defenseLevel}</span>
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Hangar: {sb.hangarSlots}</span>
                      {sb.researchSlots > 0 && <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" /> Lab: {sb.researchSlots}</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs flex-1"
                        onClick={() => upgradeMutation.mutate(sb.id)}
                        disabled={upgradeMutation.isPending || sb.level >= (sb.typeInfo?.maxLevel || 50)}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" /> Upgrade
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => toggleMutation.mutate(sb.id)}
                      >
                        {sb.isActive ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                        onClick={() => {
                          if (confirm(`Decommission ${sb.name}? This cannot be undone.`)) {
                            deleteMutation.mutate(sb.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Selected Starbase Detail */}
        {selectedStarbase && (
          <Card className="border-2 border-primary/20 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {(() => {
                  const Icon = STARBASE_ICONS[selectedStarbase.starbaseType as StarbaseType] || Rocket;
                  return <Icon className="w-5 h-5" />;
                })()}
                {selectedStarbase.name} — {selectedStarbase.typeInfo?.name}
              </CardTitle>
              <CardDescription className="text-slate-400">Starbase Command Interface</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="bg-slate-800 border-slate-600">
                  <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-slate-700"><BarChart3 className="w-3 h-3 mr-1" /> Overview</TabsTrigger>
                  <TabsTrigger value="modules" className="text-xs data-[state=active]:bg-slate-700"><Wrench className="w-3 h-3 mr-1" /> Modules</TabsTrigger>
                  <TabsTrigger value="defense" className="text-xs data-[state=active]:bg-slate-700"><Shield className="w-3 h-3 mr-1" /> Defense</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <div className="text-xs text-slate-400">Level</div>
                      <div className="text-xl font-bold text-white">{selectedStarbase.level} / {selectedStarbase.typeInfo?.maxLevel}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <div className="text-xs text-slate-400">Defense Rating</div>
                      <div className="text-xl font-bold text-red-400">{selectedStarbase.defenseLevel}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <div className="text-xs text-slate-400">Hangar Slots</div>
                      <div className="text-xl font-bold text-green-400">{selectedStarbase.hangarSlots}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <div className="text-xs text-slate-400">Research Slots</div>
                      <div className="text-xl font-bold text-purple-400">{selectedStarbase.researchSlots}</div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div>
                    <h4 className="font-medium text-slate-300 mb-2">Resource Storage</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800/50">
                        <div className="text-xs text-amber-400">Metal Capacity</div>
                        <div className="font-bold text-amber-300">{selectedStarbase.metalStorage.toLocaleString()}</div>
                      </div>
                      <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-800/50">
                        <div className="text-xs text-cyan-400">Crystal Capacity</div>
                        <div className="font-bold text-cyan-300">{selectedStarbase.crystalStorage.toLocaleString()}</div>
                      </div>
                      <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800/50">
                        <div className="text-xs text-blue-400">Deuterium Capacity</div>
                        <div className="font-bold text-blue-300">{selectedStarbase.deuteriumStorage.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-300 mb-2">Production Rates (per hour)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800/50">
                        <div className="text-xs text-amber-400">Metal</div>
                        <div className="font-bold text-amber-300">+{selectedStarbase.metalProductionRate.toLocaleString()}/hr</div>
                      </div>
                      <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-800/50">
                        <div className="text-xs text-cyan-400">Crystal</div>
                        <div className="font-bold text-cyan-300">+{selectedStarbase.crystalProductionRate.toLocaleString()}/hr</div>
                      </div>
                      <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800/50">
                        <div className="text-xs text-blue-400">Deuterium</div>
                        <div className="font-bold text-blue-300">+{selectedStarbase.deuteriumProductionRate.toLocaleString()}/hr</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="modules" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-300 flex items-center gap-1.5">
                          <Wrench className="w-4 h-4" /> Available Modules
                        </h4>
                        <p className="text-xs text-slate-400">Slots: {selectedStarbase.typeInfo?.moduleSlots || 0} · {availableModules.length} modules available</p>
                      </div>
                      {availableModules.length > 0 && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedModCategory("all")}
                            className={`px-2 py-1 text-xs rounded border ${selectedModCategory === "all" ? "bg-slate-700 text-white border-slate-600" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                          >
                            All
                          </button>
                          {moduleCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.key}
                                onClick={() => setSelectedModCategory(cat.key)}
                                className={`px-2 py-1 text-xs rounded border flex items-center gap-1 ${
                                  selectedModCategory === cat.key
                                    ? "bg-slate-700 text-white border-slate-600"
                                    : "bg-slate-800 text-slate-400 border-slate-700"
                                }`}
                              >
                                <Icon className="w-3 h-3" /> {cat.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {filteredModules.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredModules.map((mod: StarbaseModule) => {
                          const Icon = MODULE_ICONS[mod.category] || Wrench;
                          const installed = (installedModules[selectedStarbase.id] || []).find(i => i.moduleId === mod.id);
                          return (
                            <Card key={mod.id} className={`border bg-slate-800/50 ${MODULE_COLORS[mod.category] || "border-slate-700"}`}>
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded ${mod.category === "production" ? "bg-amber-900/40" : mod.category === "storage" ? "bg-blue-900/40" : mod.category === "defense" ? "bg-green-900/40" : mod.category === "offense" ? "bg-red-900/40" : mod.category === "support" ? "bg-purple-900/40" : "bg-cyan-900/40"}`}>
                                      <Icon className={`w-3.5 h-3.5 ${mod.category === "production" ? "text-amber-300" : mod.category === "storage" ? "text-blue-300" : mod.category === "defense" ? "text-green-300" : mod.category === "offense" ? "text-red-300" : mod.category === "support" ? "text-purple-300" : "text-cyan-300"}`} />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white text-sm">{mod.name}</div>
                                      <div className="text-xs text-slate-400 capitalize">{mod.category}</div>
                                    </div>
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className={`text-xs cursor-help ${TIER_COLORS[mod.tier] || "bg-slate-700 text-slate-300"}`}>
                                        {mod.tier}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="w-56 p-2">
                                      <div className="text-xs font-bold capitalize">{mod.tier} Module</div>
                                      <div className="text-[11px] text-slate-300 mt-1">
                                        {mod.tier === "standard" && "Basic-grade module. Low cost, reliable performance, suitable for early-game starbases."}
                                        {mod.tier === "advanced" && "High-grade module with improved stats. Requires some prerequisites and provides stronger effects."}
                                        {mod.tier === "elite" && "Top-tier military/industrial module. Expensive but provides powerful bonuses and unique capabilities."}
                                        {mod.tier === "legendary" && "Ultra-rare module of exceptional power. Provides game-changing bonuses and special effects."}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <p className="text-xs text-slate-400">{mod.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(mod.effects).map(([k, v]) => (
                                    <Tooltip key={k}>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-[10px] bg-slate-800 cursor-help border-slate-600 text-slate-300">
                                          {k.replace(/([A-Z])/g, " $1").trim()}: +{v}×{mod.maxLevel}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="w-56 p-2">
                                        <div className="text-xs font-bold">{k.replace(/([A-Z])/g, " $1").trim()}</div>
                                        <div className="text-[11px] text-slate-300 mt-1">
                                          {k === "metalProduction" && "Increases metal production rate of this starbase per hour per level."}
                                          {k === "crystalProduction" && "Increases crystal production rate of this starbase per hour per level."}
                                          {k === "deuteriumProduction" && "Increases deuterium production rate of this starbase per hour per level."}
                                          {k === "metalStorage" && "Adds additional metal storage capacity to this starbase."}
                                          {k === "crystalStorage" && "Adds additional crystal storage capacity to this starbase."}
                                          {k === "deuteriumStorage" && "Adds additional deuterium storage capacity to this starbase."}
                                          {k === "defenseLevel" && "Boosts overall defense rating, improving survivability against attacks."}
                                          {k === "hangarSlots" && "Increases the number of ships that can dock at this starbase."}
                                          {k === "researchSlots" && "Adds research capacity for technology development."}
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-1">Current: +{v} per level · Max level: {mod.maxLevel}</div>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-slate-700">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Box className="w-3 h-3" />{mod.costs.metal.toLocaleString()}
                                    <Gem className="w-3 h-3" />{mod.costs.crystal.toLocaleString()}
                                    <Database className="w-3 h-3" />{mod.costs.deuterium.toLocaleString()}
                                    <Clock className="w-3 h-3" />{Math.floor(mod.buildTime / 60)}m
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={installed ? "default" : "outline"}
                                    className="h-7 text-xs"
                                    onClick={() => {
                                      const current = installedModules[selectedStarbase.id] || [];
                                      if (installed) {
                                        setInstalledModules({
                                          ...installedModules,
                                          [selectedStarbase.id]: current.filter(i => i.moduleId !== mod.id),
                                        });
                                      } else {
                                        setInstalledModules({
                                          ...installedModules,
                                          [selectedStarbase.id]: [...current, { moduleId: mod.id, level: 1 }],
                                        });
                                      }
                                    }}
                                  >
                                    {installed ? "Installed" : "Install"}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                        <p>No modules available for this starbase type.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="defense" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700 cursor-help">
                            <Shield className="w-5 h-5 text-green-400 mx-auto mb-1" />
                            <div className="text-xs text-slate-400">Defense Rating</div>
                            <div className="text-xl font-bold text-white">{selectedStarbase.defenseLevel}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-60 p-2">
                          <div className="text-xs font-bold">Defense Rating</div>
                          <div className="text-[11px] text-slate-300 mt-1">Combined score of all defensive systems including turrets, shields, armor, and point-defense. Higher rating reduces damage from attacks and increases survivability.</div>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700 cursor-help">
                            <Layers className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                            <div className="text-xs text-slate-400">Hull Integrity</div>
                            <Progress value={Math.min(100, selectedStarbase.level * 5)} className="h-2 mb-1" />
                            <div className="font-bold text-sm text-white">{selectedStarbase.level * 5}%</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-60 p-2">
                          <div className="text-xs font-bold">Hull Integrity</div>
                          <div className="text-[11px] text-slate-300 mt-1">Structural health of the starbase. Scales with level (5% per level). At 0% the starbase is destroyed. Repairs restore hull integrity over time.</div>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700 cursor-help">
                            <Swords className="w-5 h-5 text-red-400 mx-auto mb-1" />
                            <div className="text-xs text-slate-400">Defense Modules</div>
                            <div className="text-xl font-bold text-white">
                              {(installedModules[selectedStarbase.id] || []).filter(i => {
                                const mod = availableModules.find((m: StarbaseModule) => m.id === i.moduleId);
                                return mod?.category === "defense" || mod?.category === "offense";
                              }).length}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-60 p-2">
                          <div className="text-xs font-bold">Defense Modules</div>
                          <div className="text-[11px] text-slate-300 mt-1">Number of defense and offense modules installed on this starbase. Each module contributes to overall defense rating and provides special combat capabilities.</div>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700 cursor-help">
                            <Package className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                            <div className="text-xs text-slate-400">Hangar Slots</div>
                            <div className="text-xl font-bold text-white">{selectedStarbase.hangarSlots}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-60 p-2">
                          <div className="text-xs font-bold">Hangar Slots</div>
                          <div className="text-[11px] text-slate-300 mt-1">Total ship docking capacity. Each slot allows one ship to dock for repairs, refueling, or cargo transfer. Expand with hangar bay modules.</div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Installed Defenses
                      </h4>
                      {(installedModules[selectedStarbase.id] || []).filter(i => {
                        const mod = availableModules.find((m: StarbaseModule) => m.id === i.moduleId);
                        return mod?.category === "defense" || mod?.category === "offense";
                      }).length > 0 ? (
                        <div className="grid grid-cols-2 gap-1.5">
                          {(installedModules[selectedStarbase.id] || []).filter(i => {
                            const mod = availableModules.find((m: StarbaseModule) => m.id === i.moduleId);
                            return mod?.category === "defense" || mod?.category === "offense";
                          }).map((i) => {
                            const mod = availableModules.find((m: StarbaseModule) => m.id === i.moduleId);
                            if (!mod) return null;
                            const Icon = MODULE_ICONS[mod.category] || Wrench;
                            return (
                              <div key={i.moduleId} className="flex items-center gap-2 bg-slate-800 rounded p-1.5 border border-red-800/50 text-xs">
                                <Icon className="w-3 h-3 text-red-400" />
                                <span className="font-medium text-red-300">{mod.name}</span>
                                <Badge variant="outline" className="text-[10px] ml-auto text-slate-300 border-slate-600">Lv.{i.level}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-red-400">No defensive modules installed. Visit the Modules tab to install defense systems.</p>
                      )}
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-slate-300 mb-2">Defense Stats Breakdown</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Base Defense (Level {selectedStarbase.level}):</span>
                          <span className="font-medium text-white">{Math.floor(selectedStarbase.level * 10)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Module Bonuses:</span>
                          <span className="font-medium text-white">{selectedStarbase.defenseLevel - Math.floor(selectedStarbase.level * 10)}</span>
                        </div>
                        <Separator className="bg-slate-700" />
                        <div className="flex justify-between font-bold text-white">
                          <span>Total Defense:</span>
                          <span>{selectedStarbase.defenseLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-900/20 border border-indigo-800/50 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Defense Coverage
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Point Defense: Active</div>
                        <div className="flex items-center gap-1.5 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Shield Grid: Online</div>
                        <div className="flex items-center gap-1.5 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Anti-Missile: Standby</div>
                        <div className="flex items-center gap-1.5 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Counter-Measures: Offline</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
