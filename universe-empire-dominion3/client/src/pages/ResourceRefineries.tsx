import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  Hammer, Gem, Atom, Eye, Zap, RefreshCw, Skull, ArrowUp,
  Play, Pause, Package, Plus, Settings, TrendingUp, Clock,
  BarChart3, GitBranch, Factory,
  Activity, Timer, Coins, ArrowRightLeft,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, any> = { Hammer, Gem, Atom, Eye, Zap, RefreshCw, Skull };

interface RefineryType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
  baseBuildCost: { metal: number; crystal: number; deuterium: number };
  upgradeCostMultiplier: number;
  recipes: Array<{
    id: string;
    name: string;
    description: string;
    inputs: Array<{ resource: string; amount: number }>;
    output: { resource: string; amount: number };
    baseTimeSeconds: number;
    energyCost: number;
  }>;
}

interface RefineryRecord {
  id: string;
  refineryType: string;
  level: number;
  activeRecipe: string | null;
  isActive: boolean;
  efficiency: number;
  throughput: number;
  totalProcessed: number;
  lastCollectedAt: string | null;
  typeDef: RefineryType;
  recipe: any;
  pendingProduction: any;
  upgradeCost: { metal: number; crystal: number; deuterium: number } | null;
  maxLevel: number;
}

const RESOURCE_LABELS: Record<string, string> = {
  metal: "Metal", crystal: "Crystal", deuterium: "Deuterium",
  energy: "Energy", credits: "Credits", dark_matter: "Dark Matter", antimatter: "Antimatter",
};

const RESOURCE_COLORS: Record<string, string> = {
  metal: "text-slate-600",
  crystal: "text-purple-600",
  deuterium: "text-cyan-600",
  energy: "text-yellow-600",
  credits: "text-amber-600",
  dark_matter: "text-violet-600",
  antimatter: "text-red-600",
};

const RECIPE_CATEGORIES: Record<string, string> = {
  basic: "Basic Processing",
  advanced: "Advanced Refining",
  exotic: "Exotic Materials",
  energy: "Energy Production",
  research: "Research Materials",
};

function RefineryCard({
  refinery,
  resources,
  onSetRecipe,
  onCollect,
  onUpgrade,
  onToggle,
  isLoading,
}: {
  refinery: RefineryRecord;
  resources: Record<string, number>;
  onSetRecipe: (id: string, recipeId: string | null) => void;
  onCollect: (id: string) => void;
  onUpgrade: (id: string) => void;
  onToggle: (id: string) => void;
  isLoading: boolean;
}) {
  const Icon = ICON_MAP[refinery.typeDef?.icon] || Hammer;
  const typeDef = refinery.typeDef;
  if (!typeDef) return null;

  const canUpgrade = refinery.level < refinery.maxLevel && refinery.upgradeCost &&
    (resources.metal || 0) >= refinery.upgradeCost.metal &&
    (resources.crystal || 0) >= refinery.upgradeCost.crystal &&
    (resources.deuterium || 0) >= refinery.upgradeCost.deuterium;

  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute inset-0 opacity-5", typeDef.color.replace("text-", "bg-"))} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-slate-100", typeDef.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm">{typeDef.name}</CardTitle>
              <CardDescription className="text-xs">
                Level {refinery.level}/{refinery.maxLevel} | Efficiency {Math.round(refinery.efficiency * 100)}%
              </CardDescription>
            </div>
          </div>
          <Badge variant={refinery.isActive ? "default" : "secondary"} className="text-[10px]">
            {refinery.isActive ? "Active" : "Idle"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={(refinery.level / refinery.maxLevel) * 100} className="h-1.5" />

        <p className="text-xs text-muted-foreground">{typeDef.description}</p>

        {/* Active Recipe */}
        {refinery.recipe ? (
          <div className="p-2 rounded bg-slate-50 border text-xs space-y-1">
            <div className="font-medium">{refinery.recipe.name}</div>
            <div className="text-muted-foreground">
              {refinery.recipe.inputs.map((inp: any) => `${inp.amount} ${RESOURCE_LABELS[inp.resource] || inp.resource}`).join(" + ")}
              {" → "}
              <span className="font-medium">{refinery.recipe.output.amount} {RESOURCE_LABELS[refinery.recipe.output.resource]}</span>
            </div>
          </div>
        ) : (
          <div className="p-2 rounded bg-slate-50 border text-xs text-muted-foreground">
            No recipe selected
          </div>
        )}

        {/* Pending Production */}
        {refinery.pendingProduction && (
          <div className="p-2 rounded bg-green-50 border border-green-200 text-xs">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 text-green-600" />
              <span className="font-medium text-green-700">
                +{refinery.pendingProduction.amount.toLocaleString()} {RESOURCE_LABELS[refinery.pendingProduction.resource]}
              </span>
              <span className="text-muted-foreground">({refinery.pendingProduction.cycles} cycles)</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div>Throughput: <span className="font-mono text-foreground">{refinery.throughput}</span></div>
          <div>Processed: <span className="font-mono text-foreground">{(refinery.totalProcessed || 0).toLocaleString()}</span></div>
          <div>Efficiency: <span className="font-mono text-foreground">{Math.round(refinery.efficiency * 100)}%</span></div>
        </div>

        <Separator />

        {/* Recipe Selector */}
        <div className="space-y-2">
          <Select
            value={refinery.activeRecipe || ""}
            onValueChange={(val) => onSetRecipe(refinery.id, val || null)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select recipe..." />
            </SelectTrigger>
            <SelectContent>
              {typeDef.recipes.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={refinery.isActive ? "outline" : "default"}
            onClick={() => onToggle(refinery.id)}
            disabled={!refinery.activeRecipe || isLoading}
            className="flex-1"
          >
            {refinery.isActive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {refinery.isActive ? "Pause" : "Start"}
          </Button>
          {refinery.pendingProduction && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onCollect(refinery.id)}
              disabled={isLoading}
            >
              <Package className="w-3 h-3 mr-1" />
              Collect
            </Button>
          )}
        </div>

        {/* Upgrade */}
        {refinery.upgradeCost && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpgrade(refinery.id)}
            disabled={!canUpgrade || isLoading}
            className="w-full"
          >
            <ArrowUp className="w-3 h-3 mr-1" />
            Upgrade to Lv.{refinery.level + 1}
            <span className="ml-2 text-[10px] text-muted-foreground">
              M:{refinery.upgradeCost.metal.toLocaleString()} C:{refinery.upgradeCost.crystal.toLocaleString()} D:{refinery.upgradeCost.deuterium.toLocaleString()}
            </span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResourceRefineriesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRefinery, setSelectedRefinery] = useState<string | null>(null);

  const { data: refineriesData, isLoading } = useQuery<{
    success: boolean;
    refineries: RefineryRecord[];
    unbuilt: RefineryType[];
    resources: Record<string, number>;
    stats: {
      totalRefineries: number;
      activeRefineries: number;
      totalProcessed: number;
      efficiency: number;
      energyConsumption: number;
      recipesUnlocked: number;
    };
  }>({
    queryKey: ["/api/refineries"],
    queryFn: async () => {
      const res = await fetch("/api/refineries", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load refineries");
      return res.json();
    },
  });

  const buildMutation = useMutation({
    mutationFn: async (refineryType: string) => {
      const res = await fetch("/api/refineries/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refineryType }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refineries"] });
      toast({ title: "Refinery Built", description: "New refinery is now operational" });
    },
    onError: (e: Error) => toast({ title: "Build Failed", description: e.message, variant: "destructive" }),
  });

  const upgradeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/refineries/upgrade/${id}`, { method: "POST", credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refineries"] });
      toast({ title: "Refinery Upgraded" });
    },
    onError: (e: Error) => toast({ title: "Upgrade Failed", description: e.message, variant: "destructive" }),
  });

  const recipeMutation = useMutation({
    mutationFn: async ({ id, recipeId }: { id: string; recipeId: string | null }) => {
      const res = await fetch(`/api/refineries/set-recipe/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipeId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/refineries"] }),
  });

  const collectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/refineries/collect/${id}`, { method: "POST", credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/refineries"] });
      toast({
        title: "Resources Collected",
        description: `+${data.collected.amount.toLocaleString()} ${RESOURCE_LABELS[data.collected.resource] || data.collected.resource}`,
      });
    },
    onError: (e: Error) => toast({ title: "Collect Failed", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/refineries/toggle/${id}`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/refineries"] }),
  });

  const refineries = refineriesData?.refineries || [];
  const unbuilt = refineriesData?.unbuilt || [];
  const resources = refineriesData?.resources || {};
  const stats = refineriesData?.stats;

  const getTotalEnergyConsumption = () => {
    return refineries
      .filter(r => r.isActive && r.recipe)
      .reduce((sum, r) => sum + (r.recipe?.energyCost || 0), 0);
  };

  const getTotalThroughput = () => {
    return refineries.reduce((sum, r) => sum + r.throughput, 0);
  };

  const getActiveRecipes = () => {
    const recipes: Record<string, number> = {};
    refineries.forEach(r => {
      if (r.recipe) {
        const key = r.recipe.name;
        recipes[key] = (recipes[key] || 0) + 1;
      }
    });
    return recipes;
  };

  const activeRecipes = getActiveRecipes();

  return (
    <GameLayout title="Resource Refineries" subtitle="Convert, refine, and produce resources">
      <div className="space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="refineries" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Refineries
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Production Log
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-blue-600 uppercase tracking-wider">Total Refineries</div>
                      <div className="text-2xl font-orbitron font-bold text-blue-900">{stats?.totalRefineries || 0}</div>
                    </div>
                    <Factory className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-wider">Active</div>
                      <div className="text-2xl font-orbitron font-bold text-green-900">{stats?.activeRefineries || 0}</div>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-600 uppercase tracking-wider">Total Processed</div>
                      <div className="text-2xl font-orbitron font-bold text-amber-900">{(stats?.totalProcessed || 0).toLocaleString()}</div>
                    </div>
                    <Package className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-purple-600 uppercase tracking-wider">Avg Efficiency</div>
                      <div className="text-2xl font-orbitron font-bold text-purple-900">{Math.round((stats?.efficiency || 0) * 100)}%</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resource Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Resource Flow Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Current Resources</div>
                    <div className="space-y-2">
                      {Object.entries(resources).slice(0, 6).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">{RESOURCE_LABELS[key] || key}</span>
                          <span className={`text-sm font-mono font-bold ${RESOURCE_COLORS[key] || "text-slate-900"}`}>
                            {(value || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Energy Status</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Consumption</span>
                        <span className="text-sm font-mono font-bold text-red-600">
                          {getTotalEnergyConsumption().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Available</span>
                        <span className="text-sm font-mono font-bold text-green-600">
                          {(resources.energy || 0).toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={getTotalEnergyConsumption() > 0 ? ((resources.energy || 0) / getTotalEnergyConsumption()) * 100 : 0}
                        className="h-2 mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Production Stats</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Throughput</span>
                        <span className="text-sm font-mono font-bold text-blue-600">{getTotalThroughput()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Active Recipes</span>
                        <span className="text-sm font-mono font-bold text-purple-600">
                          {Object.keys(activeRecipes).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Recipes Unlocked</span>
                        <span className="text-sm font-mono font-bold text-amber-600">
                          {stats?.recipesUnlocked || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Recipes Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Active Production Lines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(activeRecipes).map(([recipe, count]) => (
                    <div key={recipe} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">{recipe}</div>
                      <div className="text-xl font-orbitron font-bold text-slate-900">{count}</div>
                      <div className="text-[10px] text-slate-500">Active lines</div>
                    </div>
                  ))}
                  {Object.keys(activeRecipes).length === 0 && (
                    <div className="col-span-4 text-center py-4 text-sm text-muted-foreground">
                      No active production lines
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refineries Tab */}
          <TabsContent value="refineries" className="space-y-6">
            {/* Resource Bar */}
            <div className="flex flex-wrap gap-3">
              {["metal", "crystal", "deuterium", "energy", "credits", "dark_matter"].map((r) => (
                <Badge key={r} variant="outline" className="text-xs gap-1">
                  <span className={RESOURCE_COLORS[r]}>{RESOURCE_LABELS[r]}:</span>
                  <span className="font-mono font-bold">{(resources[r] || 0).toLocaleString()}</span>
                </Badge>
              ))}
            </div>

            {/* Active Refineries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refineries.map((refinery) => (
                <RefineryCard
                  key={refinery.id}
                  refinery={refinery}
                  resources={resources}
                  onSetRecipe={(id, recipeId) => recipeMutation.mutate({ id, recipeId })}
                  onCollect={(id) => collectMutation.mutate(id)}
                  onUpgrade={(id) => upgradeMutation.mutate(id)}
                  onToggle={(id) => toggleMutation.mutate(id)}
                  isLoading={buildMutation.isPending || upgradeMutation.isPending || collectMutation.isPending}
                />
              ))}
            </div>

            {refineries.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Factory className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No refineries built yet. Build your first refinery to start processing resources!</p>
                </CardContent>
              </Card>
            )}

            {/* Build New */}
            {unbuilt.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Build New Refinery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unbuilt.map((type) => {
                      const Icon = ICON_MAP[type.icon] || Hammer;
                      const canBuild =
                        (resources.metal || 0) >= type.baseBuildCost.metal &&
                        (resources.crystal || 0) >= type.baseBuildCost.crystal &&
                        (resources.deuterium || 0) >= type.baseBuildCost.deuterium;
                      return (
                        <Card key={type.id} className={cn("border", type.color.replace("text-", "border-") + "/30")}>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-lg bg-slate-100", type.color)}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{type.name}</div>
                                <div className="text-xs text-muted-foreground">Max Level {type.maxLevel}</div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Cost: M:{type.baseBuildCost.metal.toLocaleString()} C:{type.baseBuildCost.crystal.toLocaleString()} D:{type.baseBuildCost.deuterium.toLocaleString()}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => buildMutation.mutate(type.id)}
                              disabled={!canBuild || buildMutation.isPending}
                              className="w-full"
                            >
                              Build
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Production Log Tab */}
          <TabsContent value="production" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Production History & Efficiency Log
                </CardTitle>
                <CardDescription>
                  Track refinery performance and production metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {refineries.map(refinery => (
                    <div key={refinery.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-white", refinery.typeDef?.color)}>
                            {React.createElement(ICON_MAP[refinery.typeDef?.icon] || Hammer, { className: "w-5 h-5" })}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{refinery.typeDef?.name}</div>
                            <div className="text-xs text-slate-500">Level {refinery.level} • {refinery.isActive ? "Active" : "Idle"}</div>
                          </div>
                        </div>
                        <Badge variant={refinery.isActive ? "default" : "secondary"} className="text-[10px]">
                          {refinery.isActive ? "Running" : "Stopped"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white rounded p-2 border border-slate-200">
                          <div className="text-slate-500 mb-1">Throughput</div>
                          <div className="font-mono font-bold text-slate-900">{refinery.throughput}</div>
                        </div>
                        <div className="bg-white rounded p-2 border border-slate-200">
                          <div className="text-slate-500 mb-1">Total Processed</div>
                          <div className="font-mono font-bold text-slate-900">{(refinery.totalProcessed || 0).toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded p-2 border border-slate-200">
                          <div className="text-slate-500 mb-1">Efficiency</div>
                          <div className="font-mono font-bold text-green-600">{Math.round(refinery.efficiency * 100)}%</div>
                        </div>
                        <div className="bg-white rounded p-2 border border-slate-200">
                          <div className="text-slate-500 mb-1">Last Collection</div>
                          <div className="font-mono font-bold text-slate-900">
                            {refinery.lastCollectedAt ? new Date(refinery.lastCollectedAt).toLocaleDateString() : "Never"}
                          </div>
                        </div>
                      </div>

                      {refinery.pendingProduction && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <Package className="w-3 h-3 text-green-600" />
                            <span className="font-medium text-green-700">
                              Pending: +{refinery.pendingProduction.amount.toLocaleString()} {RESOURCE_LABELS[refinery.pendingProduction.resource]}
                            </span>
                            <span className="text-muted-foreground">({refinery.pendingProduction.cycles} cycles)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {refineries.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No production data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Resource Processing Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of refinery performance and resource economics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Efficiency Metrics */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Efficiency Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 rounded-lg p-4">
                        <div className="text-xs text-emerald-600 uppercase tracking-wider mb-2">Overall Efficiency</div>
                        <div className="text-3xl font-orbitron font-bold text-emerald-900">
                          {Math.round((stats?.efficiency || 0) * 100)}%
                        </div>
                        <div className="text-xs text-emerald-600 mt-1">Average across all refineries</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg p-4">
                        <div className="text-xs text-blue-600 uppercase tracking-wider mb-2">Total Throughput</div>
                        <div className="text-3xl font-orbitron font-bold text-blue-900">{getTotalThroughput()}</div>
                        <div className="text-xs text-blue-600 mt-1">Units per cycle</div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Analysis */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Recipe Distribution</h3>
                    <div className="space-y-2">
                      {Object.entries(activeRecipes).map(([recipe, count]) => (
                        <div key={recipe} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-slate-900">{recipe}</div>
                            <div className="text-xs font-mono text-slate-600">{count} active</div>
                          </div>
                          <Progress value={(count / refineries.length) * 100} className="h-2" />
                        </div>
                      ))}
                      {Object.keys(activeRecipes).length === 0 && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          No active recipes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Energy Analysis */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Energy Consumption Analysis</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Total Consumption</div>
                          <div className="text-lg font-orbitron font-bold text-red-600">
                            {getTotalEnergyConsumption().toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Available Energy</div>
                          <div className="text-lg font-orbitron font-bold text-green-600">
                            {(resources.energy || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Utilization</div>
                          <div className="text-lg font-orbitron font-bold text-blue-600">
                            {getTotalEnergyConsumption() > 0
                              ? Math.round(((resources.energy || 0) / getTotalEnergyConsumption()) * 100)
                              : 0}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Status</div>
                          <div className={`text-lg font-orbitron font-bold ${(resources.energy || 0) >= getTotalEnergyConsumption() ? "text-green-600" : "text-red-600"}`}>
                            {(resources.energy || 0) >= getTotalEnergyConsumption() ? "Optimal" : "Deficit"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Processing Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Resource Processing Summary</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Total Refineries Built</div>
                          <div className="text-2xl font-orbitron font-bold text-slate-900">{stats?.totalRefineries || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Currently Active</div>
                          <div className="text-2xl font-orbitron font-bold text-green-600">{stats?.activeRefineries || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Total Processed</div>
                          <div className="text-2xl font-orbitron font-bold text-blue-600">
                            {(stats?.totalProcessed || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Recipes Unlocked</div>
                          <div className="text-2xl font-orbitron font-bold text-purple-600">{stats?.recipesUnlocked || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Avg Efficiency</div>
                          <div className="text-2xl font-orbitron font-bold text-amber-600">
                            {Math.round((stats?.efficiency || 0) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-2">Energy per Unit</div>
                          <div className="text-2xl font-orbitron font-bold text-red-600">
                            {getTotalThroughput() > 0 ? Math.round(getTotalEnergyConsumption() / getTotalThroughput()) : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Information */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Recipe Information & Game Logic</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="space-y-3 text-xs text-slate-600">
                        <div>
                          <div className="font-bold text-slate-700 mb-1">Basic Processing Recipes</div>
                          <p>Convert raw resources into refined materials. Basic recipes have low energy costs and short processing times, making them ideal for early-game resource generation.</p>
                        </div>
                        <div>
                          <div className="font-bold text-blue-700 mb-1">Advanced Refining Recipes</div>
                          <p>High-tier recipes that produce valuable advanced materials. Require higher refinery levels and consume more energy, but yield significantly higher value outputs.</p>
                        </div>
                        <div>
                          <div className="font-bold text-purple-700 mb-1">Exotic Materials Recipes</div>
                          <p>Special recipes for rare and exotic resources like Dark Matter and Antimatter. These require specific conditions and high-level refineries to unlock.</p>
                        </div>
                        <div>
                          <div className="font-bold text-amber-700 mb-1">Energy Production Recipes</div>
                          <p>Convert resources into energy credits and power. Essential for maintaining empire energy balance and supporting other facilities.</p>
                        </div>
                        <div>
                          <div className="font-bold text-emerald-700 mb-1">Research Materials Recipes</div>
                          <p>Produce specialized materials used in technology research and scientific advancement. Critical for empire progression and unlocking new capabilities.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Path Information */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Upgrade System & Progression</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="space-y-3 text-xs text-slate-600">
                        <div>
                          <div className="font-bold text-slate-700 mb-1">Level Progression</div>
                          <p>Each refinery can be upgraded up to its maximum level. Higher levels increase throughput, efficiency, and unlock additional recipe slots. Upgrade costs scale exponentially with level.</p>
                        </div>
                        <div>
                          <div className="font-bold text-blue-700 mb-1">Efficiency Bonuses</div>
                          <p>Efficiency determines how much output is produced per cycle. Higher efficiency means more resources for the same input. Efficiency can be improved through upgrades and technology research.</p>
                        </div>
                        <div>
                          <div className="font-bold text-purple-700 mb-1">Energy Management</div>
                          <p>Active refineries consume energy based on their active recipe. Monitor energy consumption to avoid deficits that reduce efficiency or halt production.</p>
                        </div>
                        <div>
                          <div className="font-bold text-amber-700 mb-1">Recipe Unlocking</div>
                          <p>New recipes are unlocked as you upgrade refineries and progress through the game. Higher-tier recipes require higher refinery levels and specific technology prerequisites.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
