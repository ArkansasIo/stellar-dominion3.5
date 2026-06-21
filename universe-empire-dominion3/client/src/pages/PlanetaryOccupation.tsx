import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Coins, Pickaxe, Shield, TowerControl, Users } from "lucide-react";

interface PlanetSummary {
  id: string;
  name: string;
  coordinates: string;
  colonized: boolean;
}

interface OccupationResponse {
  planet: {
    id: string;
    name: string;
    coordinates: string;
    type: string;
    class: string;
    population: number;
  };
  occupation: {
    captured: boolean;
    resistance: number;
    loyalty: number;
    suppression: number;
    extractionTaxRate: number;
    lastSweepAt: number | null;
    lastExtractionAt: number | null;
    status: string;
    summary: {
      garrisonStrength: number;
      fortificationStrength: number;
      controlRating: number;
      extractionModifier: number;
    };
    projection: {
      nextExtraction: {
        metal: number;
        crystal: number;
        deuterium: number;
        credits: number;
      };
    };
    resourceVault: {
      metal: number;
      crystal: number;
      deuterium: number;
      credits: number;
    };
    units: Array<{
      key: string;
      label: string;
      assigned: number;
      reserve: number;
      weight: number;
      control: number;
    }>;
    fortifications: Array<{
      key: string;
      label: string;
      level: number;
      controlBonus: number;
      extractionBonus: number;
      durability: number;
      nextCost: {
        metal: number;
        crystal: number;
        deuterium: number;
      };
    }>;
    actionLog: Array<{
      id: string;
      type: string;
      summary: string;
      timestamp: number;
    }>;
  };
}

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

function formatResourcePack(pack: { metal: number; crystal: number; deuterium: number }) {
  return `${pack.metal.toLocaleString()}M / ${pack.crystal.toLocaleString()}C / ${pack.deuterium.toLocaleString()}D`;
}

function formatTimestamp(timestamp: number | null) {
  if (!timestamp) return "Not yet executed";
  return new Date(timestamp).toLocaleString();
}

function statusClass(status: string) {
  if (status === "Compliant") return "bg-emerald-100 text-emerald-900";
  if (status === "Stabilizing") return "bg-blue-100 text-blue-900";
  if (status === "Occupied") return "bg-amber-100 text-amber-900";
  return "bg-red-100 text-red-900";
}

export default function PlanetaryOccupation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlanetId, setSelectedPlanetId] = useState("");

  const planetsQuery = useQuery<{ planets: PlanetSummary[] }>({
    queryKey: ["/api/planets"],
  });

  const occupiedPlanets = useMemo(
    () => (planetsQuery.data?.planets || []).filter((planet) => planet.colonized),
    [planetsQuery.data?.planets],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPlanet = params.get("planet");
    if (!selectedPlanetId && occupiedPlanets.length) {
      const match = occupiedPlanets.find((planet) => planet.id === requestedPlanet);
      setSelectedPlanetId(match?.id || occupiedPlanets[0].id);
    }
  }, [occupiedPlanets, selectedPlanetId]);

  useEffect(() => {
    if (!selectedPlanetId) return;
    const params = new URLSearchParams(window.location.search);
    params.set("planet", selectedPlanetId);
    const nextUrl = `/planet-occupation?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [selectedPlanetId]);

  const occupationQuery = useQuery<OccupationResponse>({
    queryKey: ["planet-occupation", selectedPlanetId],
    queryFn: () => fetchJson<OccupationResponse>(`/api/planets/${selectedPlanetId}/occupation`),
    enabled: Boolean(selectedPlanetId),
    refetchInterval: 20000,
  });

  const refreshOccupation = () => {
    queryClient.invalidateQueries({ queryKey: ["planet-occupation", selectedPlanetId] });
  };

  const garrisonMutation = useMutation({
    mutationFn: ({ unitKey, amount }: { unitKey: string; amount: number }) =>
      fetchJson<{ message: string }>(`/api/planets/${selectedPlanetId}/occupation/garrison`, {
        method: "POST",
        body: JSON.stringify({ unitKey, amount }),
      }),
    onSuccess: (data) => {
      toast({ title: "Garrison updated", description: data.message });
      refreshOccupation();
    },
    onError: (error: Error) => {
      toast({ title: "Garrison action failed", description: error.message, variant: "destructive" });
    },
  });

  const policyMutation = useMutation({
    mutationFn: (taxRate: number) =>
      fetchJson<{ message: string }>(`/api/planets/${selectedPlanetId}/occupation/policy`, {
        method: "POST",
        body: JSON.stringify({ taxRate }),
      }),
    onSuccess: (data) => {
      toast({ title: "Policy updated", description: data.message });
      refreshOccupation();
    },
    onError: (error: Error) => {
      toast({ title: "Policy update failed", description: error.message, variant: "destructive" });
    },
  });

  const suppressMutation = useMutation({
    mutationFn: () =>
      fetchJson<{ message: string }>(`/api/planets/${selectedPlanetId}/occupation/suppress`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      toast({ title: "Suppression sweep complete", description: data.message });
      refreshOccupation();
    },
    onError: (error: Error) => {
      toast({ title: "Suppression failed", description: error.message, variant: "destructive" });
    },
  });

  const extractMutation = useMutation({
    mutationFn: () =>
      fetchJson<{ message: string }>(`/api/planets/${selectedPlanetId}/occupation/extract`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      toast({ title: "Extraction convoy returned", description: data.message });
      refreshOccupation();
    },
    onError: (error: Error) => {
      toast({ title: "Extraction failed", description: error.message, variant: "destructive" });
    },
  });

  const fortifyMutation = useMutation({
    mutationFn: (fortificationKey: string) =>
      fetchJson<{ message: string }>(`/api/planets/${selectedPlanetId}/occupation/fortify`, {
        method: "POST",
        body: JSON.stringify({ fortificationKey }),
      }),
    onSuccess: (data) => {
      toast({ title: "Fortification upgraded", description: data.message });
      refreshOccupation();
    },
    onError: (error: Error) => {
      toast({ title: "Fortification failed", description: error.message, variant: "destructive" });
    },
  });

  const data = occupationQuery.data;
  const occupation = data?.occupation;
  const extractionTotal = occupation
    ? occupation.projection.nextExtraction.metal +
      occupation.projection.nextExtraction.crystal +
      occupation.projection.nextExtraction.deuterium +
      occupation.projection.nextExtraction.credits
    : 0;

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="planet-occupation-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Planetary Occupation</h1>
            <p className="text-slate-600">
              Manage captured planets with occupation garrisons, suppression sweeps, extraction policy, and fortification buildouts.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[420px]">
            <Select value={selectedPlanetId} onValueChange={setSelectedPlanetId}>
              <SelectTrigger data-testid="select-occupation-planet">
                <SelectValue placeholder="Select occupied planet" />
              </SelectTrigger>
              <SelectContent>
                {occupiedPlanets.map((planet) => (
                  <SelectItem key={planet.id} value={planet.id}>
                    {planet.name} [{planet.coordinates}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Link href="/training-center"><Button variant="outline" size="sm"><Users className="w-4 h-4 mr-2" /> Training Center</Button></Link>
              <Link href={selectedPlanetId ? `/ground-combat?planet=${selectedPlanetId}` : "/ground-combat"}><Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-2" /> Ground Combat</Button></Link>
              <Link href="/fleet"><Button variant="outline" size="sm"><TowerControl className="w-4 h-4 mr-2" /> Fleet Support</Button></Link>
            </div>
          </div>
        </div>

        {!occupiedPlanets.length && (
          <Card className="border-slate-200">
            <CardContent className="py-12 text-center text-slate-500">
              No controlled planets are available yet. Colonize or capture a world first to unlock occupation management.
            </CardContent>
          </Card>
        )}

        {occupation && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Occupation Status</div>
                  <div className="mt-2 flex items-center gap-2">
                    <TowerControl className="h-5 w-5 text-primary" />
                    <div className="text-xl font-orbitron font-bold text-slate-900">{occupation.status}</div>
                  </div>
                  <Badge className={`mt-3 ${statusClass(occupation.status)}`}>{data?.planet.name}</Badge>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Resistance</div>
                  <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{occupation.resistance}%</div>
                  <Progress value={occupation.resistance} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Control Rating</div>
                  <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{occupation.summary.controlRating}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Loyalty {occupation.loyalty}% • Suppression {occupation.suppression}%
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Next Extraction</div>
                  <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{extractionTotal.toLocaleString()}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Tax {occupation.extractionTaxRate}% • Modifier x{occupation.summary.extractionModifier.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Shield className="h-5 w-5 text-blue-600" /> Occupation Posture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Population</div>
                      <div className="mt-2 text-xl font-bold text-slate-900">{data?.planet.population.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">
                        {data?.planet.type} world • class {data?.planet.class}
                      </div>
                    </div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Garrison Strength</div>
                      <div className="mt-2 text-xl font-bold text-slate-900">{occupation.summary.garrisonStrength}</div>
                      <div className="text-xs text-slate-500">Fortification score {occupation.summary.fortificationStrength}</div>
                    </div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Vault Reserves</div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {formatResourcePack(occupation.resourceVault)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {occupation.resourceVault.credits.toLocaleString()} credits held in seized administration stores
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Extraction Policy</div>
                        <div className="text-xs text-slate-500">Higher tax rates increase yield but also raise long-term unrest.</div>
                      </div>
                      <Badge variant="outline">{occupation.extractionTaxRate}% occupation tax</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[10, 18, 25, 35].map((rate) => (
                        <Button
                          key={rate}
                          variant={occupation.extractionTaxRate === rate ? "default" : "outline"}
                          size="sm"
                          onClick={() => policyMutation.mutate(rate)}
                          disabled={policyMutation.isPending}
                        >
                          {rate}% tax
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-900">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="font-semibold">Suppression Sweep</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        Crack down on resistance cells and raise occupation control on this world.
                      </div>
                      <div className="mt-3 text-xs text-slate-500">Last sweep: {formatTimestamp(occupation.lastSweepAt)}</div>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => suppressMutation.mutate()}
                        disabled={suppressMutation.isPending}
                        data-testid="button-run-suppression-sweep"
                      >
                        Run Sweep
                      </Button>
                    </div>

                    <div className="rounded border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-900">
                        <Pickaxe className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold">Extraction Convoy</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        Pull resources from local vaults and return them to your empire stockpiles.
                      </div>
                      <div className="mt-3 text-xs text-slate-500">Last extraction: {formatTimestamp(occupation.lastExtractionAt)}</div>
                      <div className="mt-3 text-xs text-slate-700">
                        Forecast: {formatResourcePack(occupation.projection.nextExtraction)} +{" "}
                        {occupation.projection.nextExtraction.credits.toLocaleString()} credits
                      </div>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => extractMutation.mutate()}
                        disabled={extractMutation.isPending}
                        data-testid="button-run-occupation-extraction"
                      >
                        Extract Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Users className="h-5 w-5 text-violet-600" /> Garrison Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {occupation.units.map((unit) => (
                    <div key={unit.key} className="rounded border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{unit.label}</div>
                          <div className="text-xs text-slate-500">
                            Assigned {unit.assigned.toLocaleString()} • Reserve {unit.reserve.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          Weight {unit.weight.toFixed(1)} • Control {unit.control.toFixed(1)}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => garrisonMutation.mutate({ unitKey: unit.key, amount: -10 })}
                          disabled={garrisonMutation.isPending || unit.assigned < 10}
                        >
                          Withdraw 10
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => garrisonMutation.mutate({ unitKey: unit.key, amount: 10 })}
                          disabled={garrisonMutation.isPending || unit.reserve < 10}
                        >
                          Deploy 10
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => garrisonMutation.mutate({ unitKey: unit.key, amount: 25 })}
                          disabled={garrisonMutation.isPending || unit.reserve < 25}
                        >
                          Deploy 25
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-cyan-600" /> Occupation Fortifications
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {occupation.fortifications.map((fortification) => (
                  <Card key={fortification.key} className="border-slate-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900">{fortification.label}</div>
                        <Badge variant="outline">Lvl {fortification.level}</Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        Control +{fortification.controlBonus} • Extraction +{Math.round(fortification.extractionBonus * 100)}% • Durability {fortification.durability}
                      </div>
                      <div className="text-xs text-slate-700">
                        Next Cost: {formatResourcePack(fortification.nextCost)}
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => fortifyMutation.mutate(fortification.key)}
                        disabled={fortifyMutation.isPending}
                      >
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Coins className="h-5 w-5 text-amber-600" /> Occupation Action Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {occupation.actionLog.length ? (
                  occupation.actionLog.map((entry) => (
                    <div key={entry.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Badge variant="outline" className="uppercase">
                          {entry.type}
                        </Badge>
                        <div className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="mt-2 text-sm text-slate-700">{entry.summary}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No occupation actions recorded yet for this world.
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </GameLayout>
  );
}
