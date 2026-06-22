import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Wrench, Zap, Recycle, Trash2, Printer, Hammer, Shield, Package,
  ChevronUp, ChevronDown, Clock, Star, CheckCircle2, AlertTriangle,
  Coins, Gem, Eye, Compass, Landmark, Lightbulb,
} from "lucide-react";
import { useState } from "react";

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-400 border-gray-500/30",
  uncommon: "text-green-400 border-green-500/30",
  rare: "text-blue-400 border-blue-500/30",
  epic: "text-purple-400 border-purple-500/30",
  legendary: "text-amber-400 border-amber-500/30",
  mythic: "text-red-500 border-red-500/30",
};

const RARITY_BG: Record<string, string> = {
  common: "bg-gray-500/10",
  uncommon: "bg-green-500/10",
  rare: "bg-blue-500/10",
  epic: "bg-purple-500/10",
  legendary: "bg-amber-500/10",
  mythic: "bg-red-500/10",
};

interface BlueprintDef {
  id: string; name: string; category: string; description: string; rarity: string;
  baseCharges: number; baseQuality: number; printCost: Record<string, number>;
  materials: Array<{ resource: string; amount: number }>; outputItem: string; outputQuantity: number;
  craftingTimeSeconds: number; unlockLevel: number;
  effects: Array<{ type: string; value: number; description: string }>;
}

interface BlueprintInstance {
  id: string; name: string; category: string; rarity: string; level: number;
  max_charges: number; current_charges: number; status: string; quality: number;
  total_uses: number; created_at: string;
}

function BlueprintInstanceCard({ bp, onUse, onRepair, onScrap, isLoading }: {
  bp: BlueprintInstance; onUse: (id: string) => void; onRepair: (id: string) => void;
  onScrap: (id: string) => void; isLoading: boolean;
}) {
  const chargePercent = (bp.current_charges / bp.max_charges) * 100;
  const isDepleted = bp.status === "depleted" || bp.current_charges <= 0;

  return (
    <Card className={cn("border", RARITY_COLORS[bp.rarity], isDepleted && "opacity-60")}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{bp.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{bp.category} | {bp.rarity}</div>
          </div>
          <Badge variant={isDepleted ? "destructive" : "default"} className="text-[10px]">
            {isDepleted ? "Depleted" : "Active"}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Charges: {bp.current_charges}/{bp.max_charges}</span>
            <span>Quality: {Math.round(bp.quality * 100)}%</span>
          </div>
          <Progress value={chargePercent} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground">Uses: {bp.total_uses}</div>

        <div className="flex gap-2">
          {!isDepleted && (
            <Button size="sm" onClick={() => onUse(bp.id)} disabled={isLoading} className="flex-1">
              <Zap className="w-3 h-3 mr-1" /> Use
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onRepair(bp.id)} disabled={isLoading}>
            <Wrench className="w-3 h-3 mr-1" /> Repair
          </Button>
          <Button size="sm" variant="outline" onClick={() => onScrap(bp.id)} disabled={isLoading}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlueprintChargePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("inventory");

  const { data: bpData } = useQuery<{ success: boolean; blueprints: BlueprintInstance[]; printer: any; activeJobs: any[] }>({
    queryKey: ["/api/blueprint-charges"],
    queryFn: async () => { const r = await fetch("/api/blueprint-charges", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); },
  });

  const { data: configData } = useQuery<{ success: boolean; definitions: BlueprintDef[] }>({
    queryKey: ["/api/blueprint-charges/config"],
    queryFn: async () => { const r = await fetch("/api/blueprint-charges/config", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); },
  });

  const printMutation = useMutation({
    mutationFn: async (id: string) => { const r = await fetch("/api/blueprint-charges/print", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ blueprintDefinitionId: id }) }); if (!r.ok) { const e = await r.json(); throw new Error(e.message); } return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/blueprint-charges"] }); toast({ title: "Printing started" }); },
    onError: (e: Error) => toast({ title: "Print failed", description: e.message, variant: "destructive" }),
  });

  const collectMutation = useMutation({
    mutationFn: async (jobId: string) => { const r = await fetch(`/api/blueprint-charges/collect/${jobId}`, { method: "POST", credentials: "include" }); if (!r.ok) { const e = await r.json(); throw new Error(e.message); } return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/blueprint-charges"] }); toast({ title: "Blueprint collected!" }); },
    onError: (e: Error) => toast({ title: "Collect failed", description: e.message, variant: "destructive" }),
  });

  const useBlueprintMutation = useMutation({
    mutationFn: async (id: string) => { const r = await fetch(`/api/blueprint-charges/use/${id}`, { method: "POST", credentials: "include" }); if (!r.ok) { const e = await r.json(); throw new Error(e.message); } return r.json(); },
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["/api/blueprint-charges"] }); toast({ title: "Blueprint used", description: `${data.chargesRemaining} charges remaining` }); },
  });

  const repairMutation = useMutation({
    mutationFn: async (id: string) => { const r = await fetch(`/api/blueprint-charges/repair/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ chargesToRepair: 3 }) }); if (!r.ok) { const e = await r.json(); throw new Error(e.message); } return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/blueprint-charges"] }); toast({ title: "Blueprint repaired" }); },
  });

  const scrapMutation = useMutation({
    mutationFn: async (id: string) => { const r = await fetch(`/api/blueprint-charges/scrap/${id}`, { method: "POST", credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/blueprint-charges"] }); toast({ title: "Blueprint scrapped" }); },
  });

  const blueprints = bpData?.blueprints || [];
  const definitions = configData?.definitions || [];
  const printer = bpData?.printer || { printer_level: 1, printer_xp: 0, total_printed: 0 };
  const activeJobs = bpData?.activeJobs || [];

  const active = blueprints.filter((bp) => bp.status === "active");
  const depleted = blueprints.filter((bp) => bp.status === "depleted");

  return (
    <GameLayout title="Blueprint Printer" subtitle="Print, use, and repair blueprints with charge system">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{active.length}</div>
            <div className="text-xs text-muted-foreground">Active Blueprints</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{depleted.length}</div>
            <div className="text-xs text-muted-foreground">Depleted</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">Lv.{printer.printer_level}</div>
            <div className="text-xs text-muted-foreground">Printer Level</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{printer.total_printed}</div>
            <div className="text-xs text-muted-foreground">Total Printed</div>
          </CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="printer">Printer</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blueprints.map((bp) => (
                <BlueprintInstanceCard
                  key={bp.id} bp={bp}
                  onUse={(id) => useBlueprintMutation.mutate(id)}
                  onRepair={(id) => repairMutation.mutate(id)}
                  onScrap={(id) => scrapMutation.mutate(id)}
                  isLoading={useBlueprintMutation.isPending || repairMutation.isPending}
                />
              ))}
            </div>
            {blueprints.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">No blueprints yet. Print some from the Printer tab!</CardContent></Card>}
          </TabsContent>

          <TabsContent value="printer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Printer className="w-5 h-5" /> Printer Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-xl font-bold">Lv.{printer.printer_level}</div><div className="text-xs text-muted-foreground">Level</div></div>
                  <div><div className="text-xl font-bold">{printer.printer_xp % (printer.printer_level * 100)}</div><div className="text-xs text-muted-foreground">XP / {printer.printer_level * 100}</div></div>
                  <div><div className="text-xl font-bold">{printer.total_printed}</div><div className="text-xs text-muted-foreground">Printed</div></div>
                </div>
                <Progress value={(printer.printer_xp % (printer.printer_level * 100)) / (printer.printer_level * 100) * 100} className="h-2" />
              </CardContent>
            </Card>

            {activeJobs.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm">Active Jobs</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {activeJobs.map((job: any) => {
                    const isReady = job.complete_at && new Date(job.complete_at) <= new Date();
                    return (
                      <div key={job.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm">{job.blueprint_definition_id}</span>
                        {isReady ? (
                          <Button size="sm" onClick={() => collectMutation.mutate(job.id)} disabled={collectMutation.isPending}>Collect</Button>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Printing...</span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {definitions.map((def) => (
                <Card key={def.id} className={cn("border", RARITY_COLORS[def.rarity])}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">{def.name}</div>
                      <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[def.rarity])}>{def.rarity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{def.description}</p>
                    <div className="text-xs">Output: {def.outputQuantity}x {def.outputItem}</div>
                    <div className="text-xs">Charges: {def.baseCharges} | Time: {Math.floor(def.craftingTimeSeconds / 60)}m</div>
                    <div className="text-xs text-muted-foreground">Cost: M:{def.printCost.metal} C:{def.printCost.crystal}</div>
                    <Button size="sm" className="w-full" onClick={() => printMutation.mutate(def.id)}
                      disabled={printMutation.isPending || printer.printer_level < def.unlockLevel}>
                      {printer.printer_level < def.unlockLevel ? `Requires Lv.${def.unlockLevel}` : "Print"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="catalog" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {definitions.map((def) => (
                <Card key={def.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[10px] capitalize", RARITY_COLORS[def.rarity])}>{def.rarity}</Badge>
                      <span className="text-sm font-medium">{def.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{def.description}</p>
                    <div className="text-xs space-y-1">
                      {def.effects.map((e, i) => <div key={i}>{e.description}</div>)}
                    </div>
                    <div className="text-xs text-muted-foreground">Category: {def.category} | Unlock: Lv.{def.unlockLevel}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
