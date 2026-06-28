import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Factory, Shield, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Domain = "troop" | "civilian" | "government" | "military";
type ArmySubMenu = "training" | "field" | "construction";

type UnitTemplate = {
  id: string;
  name: string;
  domain: Domain;
  unitType: string;
  class: string;
  subClass: string;
  subType: string;
  tier: number;
  trainingTimeSec: number;
  trainingCost: { metal: number; crystal: number; deuterium: number };
};

type UnitPoolEntry = {
  untrained: number;
  trained: number;
  elite: number;
};

type UnitSummary = {
  template: UnitTemplate;
  pool: UnitPoolEntry;
  total: number;
};

type UnitSystemResponse = {
  success: boolean;
  state: {
    resources: { metal: number; crystal: number; deuterium: number };
    trainingQueue: Array<{ id: string; unitId: string; quantity: number; toState: string; finishAt: number }>;
    constructionYard: {
      tier: number;
      efficiency: number;
      queue: Array<{ id: string; blueprintId: string; quantity: number; finishAt: number }>;
      completedShips: Record<string, number>;
    };
  };
  meta: {
    buildings: Record<string, number>;
    trainingFacilityLevel: number;
    fieldCommandLevel: number;
    civilianCapacity: number;
    governmentCapacity: number;
    militaryCapacity: number;
  };
  summaries: Record<Domain, UnitSummary[]>;
};

type BlueprintResponse = {
  success: boolean;
  blueprints: Array<{
    id: string;
    name: string;
    class: string;
    type: string;
    tier: number;
    yardTierRequired: number;
    buildTimeSec: number;
    resourceCost: { metal: number; crystal: number; deuterium: number };
  }>;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload as T;
}

function formatResources(cost: { metal: number; crystal: number; deuterium: number }) {
  return `${cost.metal.toLocaleString()}M / ${cost.crystal.toLocaleString()}C / ${cost.deuterium.toLocaleString()}D`;
}

export default function Army() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeDomain, setActiveDomain] = useState<Domain>("troop");
  const [subMenuByDomain, setSubMenuByDomain] = useState<Record<Domain, ArmySubMenu>>({
    troop: "training",
    civilian: "training",
    government: "training",
    military: "training",
  });
  const [trainingAmount, setTrainingAmount] = useState<Record<string, string>>({});
  const [constructionAmount, setConstructionAmount] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get("tab") || params.get("domain");
    const subParam = params.get("sub");

    if (domainParam === "troop" || domainParam === "civilian" || domainParam === "government" || domainParam === "military") {
      setActiveDomain(domainParam);

      if (subParam === "training" || subParam === "field" || subParam === "construction") {
        setSubMenuByDomain((prev) => ({ ...prev, [domainParam]: subParam }));
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeDomain);
    params.delete("domain");
    params.set("sub", subMenuByDomain[activeDomain]);

    const nextUrl = `/army?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeDomain, subMenuByDomain]);

  const unitSystemQuery = useQuery<UnitSystemResponse>({
    queryKey: ["unit-system-state"],
    queryFn: () => fetchJson<UnitSystemResponse>("/api/unit-systems/state"),
    refetchInterval: 15000,
  });

  const blueprintsQuery = useQuery<BlueprintResponse>({
    queryKey: ["unit-system-blueprints"],
    queryFn: () => fetchJson<BlueprintResponse>("/api/unit-systems/blueprints"),
  });

  const refreshState = () => queryClient.invalidateQueries({ queryKey: ["unit-system-state"] });

  const trainMutation = useMutation({
    mutationFn: ({ unitId, quantity, toState }: { unitId: string; quantity: number; toState: "trained" | "elite" }) =>
      fetchJson<{ message: string }>("/api/unit-systems/train", {
        method: "POST",
        body: JSON.stringify({ unitId, quantity, toState }),
      }),
    onSuccess: (data) => {
      toast({ title: "Training queued", description: data.message });
      refreshState();
    },
    onError: (error: Error) => {
      toast({ title: "Training failed", description: error.message, variant: "destructive" });
    },
  });

  const untrainMutation = useMutation({
    mutationFn: ({ unitId, quantity, fromState }: { unitId: string; quantity: number; fromState: "trained" | "elite" }) =>
      fetchJson<{ message: string }>("/api/unit-systems/untrain", {
        method: "POST",
        body: JSON.stringify({ unitId, quantity, fromState }),
      }),
    onSuccess: (data) => {
      toast({ title: "Units reverted", description: data.message });
      refreshState();
    },
    onError: (error: Error) => {
      toast({ title: "Untrain failed", description: error.message, variant: "destructive" });
    },
  });

  const constructMutation = useMutation({
    mutationFn: ({ blueprintId, quantity }: { blueprintId: string; quantity: number }) =>
      fetchJson<{ message: string }>("/api/unit-systems/yard/construct", {
        method: "POST",
        body: JSON.stringify({ blueprintId, quantity }),
      }),
    onSuccess: (data) => {
      toast({ title: "Construction queued", description: data.message });
      refreshState();
    },
    onError: (error: Error) => {
      toast({ title: "Construction failed", description: error.message, variant: "destructive" });
    },
  });

  const state = unitSystemQuery.data?.state;
  const meta = unitSystemQuery.data?.meta;

  const domainTotals = useMemo(() => {
    const domainData = unitSystemQuery.data?.summaries;
    if (!domainData) return { troop: 0, civilian: 0, government: 0, military: 0 };
    return {
      troop: domainData.troop.reduce((sum, item) => sum + item.total, 0),
      civilian: domainData.civilian.reduce((sum, item) => sum + item.total, 0),
      government: domainData.government.reduce((sum, item) => sum + item.total, 0),
      military: domainData.military.reduce((sum, item) => sum + item.total, 0),
    };
  }, [unitSystemQuery.data?.summaries]);

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="army-page">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Unit Systems Command</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Train, untrain, field, and supervise troop, civilian, government, and military systems from one command menu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-xs text-slate-500">Troops</div><div className="text-3xl font-bold">{domainTotals.troop}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs text-slate-500">Civil</div><div className="text-3xl font-bold">{domainTotals.civilian}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs text-slate-500">Government</div><div className="text-3xl font-bold">{domainTotals.government}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs text-slate-500">Military</div><div className="text-3xl font-bold">{domainTotals.military}</div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Field Systems</div>
              <div className="mt-2 text-lg font-bold text-slate-900">Capacity {meta?.militaryCapacity ?? 0}</div>
              <div className="text-xs text-slate-500">Shipyard {meta?.fieldCommandLevel ?? 0} drives field readiness and construction yard tier.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Training Complex</div>
              <div className="mt-2 text-lg font-bold text-slate-900">Level {meta?.trainingFacilityLevel ?? 0}</div>
              <div className="text-xs text-slate-500">Research Lab and Robotics Factory improve training and build throughput.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Construction Yard</div>
              <div className="mt-2 text-lg font-bold text-slate-900">Tier {state?.constructionYard.tier ?? 0}</div>
              <div className="text-xs text-slate-500">Efficiency {(state?.constructionYard.efficiency ?? 0).toFixed(2)}x</div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeDomain} onValueChange={(value) => setActiveDomain(value as Domain)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="troop">Troops</TabsTrigger>
            <TabsTrigger value="civilian">Civil</TabsTrigger>
            <TabsTrigger value="government">Government</TabsTrigger>
            <TabsTrigger value="military">Military</TabsTrigger>
          </TabsList>

          {(["troop", "civilian", "government", "military"] as Domain[]).map((domain) => (
            <TabsContent key={domain} value={domain} className="space-y-4 mt-4">
              <Tabs
                value={subMenuByDomain[domain]}
                onValueChange={(value) =>
                  setSubMenuByDomain((prev) => ({ ...prev, [domain]: value as ArmySubMenu }))
                }
              >
                <TabsList className="grid w-full grid-cols-3 lg:w-[520px]">
                  <TabsTrigger value="training">Training</TabsTrigger>
                  <TabsTrigger value="field">Field</TabsTrigger>
                  <TabsTrigger value="construction">Construction</TabsTrigger>
                </TabsList>

                <TabsContent value="training" className="space-y-4 mt-4">
                  {(unitSystemQuery.data?.summaries?.[domain] || []).map((entry) => {
                    const amount = Math.max(1, Number(trainingAmount[entry.template.id] || 1));
                    const totalPool = entry.pool.untrained + entry.pool.trained + entry.pool.elite;
                    return (
                      <Card key={entry.template.id} className="border-slate-200">
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900">{entry.template.name}</h3>
                                <Badge variant="outline">Tier {entry.template.tier}</Badge>
                                <Badge className="capitalize">{entry.template.class}</Badge>
                              </div>
                              <p className="text-xs text-slate-500">
                                {entry.template.subClass} / {entry.template.subType} • Training cost {formatResources(entry.template.trainingCost)}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="rounded border p-2 text-center"><div className="text-xs text-slate-500">Untrained</div><div className="font-bold">{entry.pool.untrained}</div></div>
                              <div className="rounded border p-2 text-center"><div className="text-xs text-slate-500">Trained</div><div className="font-bold">{entry.pool.trained}</div></div>
                              <div className="rounded border p-2 text-center"><div className="text-xs text-slate-500">Elite</div><div className="font-bold">{entry.pool.elite}</div></div>
                            </div>
                          </div>
                          <Progress value={totalPool > 0 ? ((entry.pool.trained + entry.pool.elite) / totalPool) * 100 : 0} />
                          <div className="flex flex-col lg:flex-row gap-2">
                            <Input
                              value={trainingAmount[entry.template.id] || "1"}
                              onChange={(event) => setTrainingAmount((prev) => ({ ...prev, [entry.template.id]: event.target.value }))}
                              className="lg:max-w-[120px]"
                            />
                            <Button onClick={() => trainMutation.mutate({ unitId: entry.template.id, quantity: amount, toState: "trained" })}>Train</Button>
                            <Button variant="outline" onClick={() => trainMutation.mutate({ unitId: entry.template.id, quantity: amount, toState: "elite" })}>Elite Train</Button>
                            <Button variant="secondary" onClick={() => untrainMutation.mutate({ unitId: entry.template.id, quantity: amount, fromState: "trained" })}>Untrain Trained</Button>
                            <Button variant="secondary" onClick={() => untrainMutation.mutate({ unitId: entry.template.id, quantity: amount, fromState: "elite" })}>Untrain Elite</Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="field" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Shield className="w-5 h-5" /> Field Menu</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(unitSystemQuery.data?.summaries?.[domain] || []).slice(0, 3).map((entry) => (
                        <div key={entry.template.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                          <div className="font-semibold text-slate-900">{entry.template.name}</div>
                          <div className="text-xs text-slate-500 mt-1">Field-ready units: {entry.pool.trained + entry.pool.elite}</div>
                          <div className="text-xs text-slate-500">Training time: {Math.floor(entry.template.trainingTimeSec / 60)}m each</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Users className="w-5 h-5" /> Active Training Queue</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(state?.trainingQueue || []).length === 0 && <div className="text-sm text-slate-500">No active training orders.</div>}
                      {(state?.trainingQueue || []).map((order) => (
                        <div key={order.id} className="rounded border border-slate-200 p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900">{order.unitId}</div>
                            <div className="text-xs text-slate-500">{order.quantity} units to {order.toState}</div>
                          </div>
                          <Badge variant="outline">{Math.max(0, Math.ceil((order.finishAt - Date.now()) / 1000))}s</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="construction" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Factory className="w-5 h-5" /> Military Yard Sub-Menu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(blueprintsQuery.data?.blueprints || []).slice(0, 8).map((blueprint) => {
                        const amount = Math.max(1, Number(constructionAmount[blueprint.id] || 1));
                        return (
                          <div key={blueprint.id} className="rounded border border-slate-200 p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{blueprint.name}</span>
                                <Badge variant="outline">Tier {blueprint.tier}</Badge>
                              </div>
                              <div className="text-xs text-slate-500">Yard {blueprint.yardTierRequired}+ • {formatResources(blueprint.resourceCost)}</div>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={constructionAmount[blueprint.id] || "1"}
                                onChange={(event) => setConstructionAmount((prev) => ({ ...prev, [blueprint.id]: event.target.value }))}
                                className="w-24"
                              />
                              <Button onClick={() => constructMutation.mutate({ blueprintId: blueprint.id, quantity: amount })}>Queue Build</Button>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900"><Building2 className="w-5 h-5" /> Completed Hulls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.keys(state?.constructionYard.completedShips || {}).length === 0 && <div className="text-sm text-slate-500">No completed ships available yet.</div>}
                      {Object.entries(state?.constructionYard.completedShips || {}).map(([shipId, count]) => (
                        <div key={shipId} className="rounded border border-slate-200 p-3 flex items-center justify-between">
                          <span className="text-slate-900">{shipId}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </GameLayout>
  );
}
