import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Hammer, Gem, Atom, Eye, Zap, RefreshCw, Skull, ArrowUp,
  Play, Pause, Package, Plus, Settings, TrendingUp, Clock,
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

  const { data: refineriesData, isLoading } = useQuery<{
    success: boolean;
    refineries: RefineryRecord[];
    unbuilt: RefineryType[];
    resources: Record<string, number>;
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

  return (
    <GameLayout title="Resource Refineries" subtitle="Convert, refine, and produce resources">
      <div className="space-y-6">
        {/* Resource Bar */}
        <div className="flex flex-wrap gap-3">
          {["metal", "crystal", "deuterium", "energy", "credits", "dark_matter"].map((r) => (
            <Badge key={r} variant="outline" className="text-xs gap-1">
              {RESOURCE_LABELS[r]}: <span className="font-mono">{(resources[r] || 0).toLocaleString()}</span>
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
      </div>
    </GameLayout>
  );
}
