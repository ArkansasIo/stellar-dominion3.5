import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Droplets, Wheat, Heart, Skull, Shield, AlertTriangle, CheckCircle,
  Users, Activity, Thermometer, FlaskConical, Pill, Syringe,
  AlertCircle, Clock, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

async function apiFetch(url: string) {
  const storedUser = localStorage.getItem("stellar_username");
  const storedPass = localStorage.getItem("stellar_password");
  const headers: Record<string, string> = {};
  if (storedUser && storedPass) {
    headers["Authorization"] = `Basic ${btoa(`${storedUser}:${storedPass}`)}`;
  }
  const res = await fetch(url, { headers, credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(url: string, data: any) {
  const storedUser = localStorage.getItem("stellar_username");
  const storedPass = localStorage.getItem("stellar_password");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (storedUser && storedPass) {
    headers["Authorization"] = `Basic ${btoa(`${storedUser}:${storedPass}`)}`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const pressureColor: Record<string, string> = {
  surplus: "text-green-600 bg-green-50 border-green-200",
  stable: "text-blue-600 bg-blue-50 border-blue-200",
  strained: "text-yellow-600 bg-yellow-50 border-yellow-200",
  critical: "text-red-600 bg-red-50 border-red-200",
};

const severityColor: Record<string, string> = {
  mild: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  severe: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const statusColor: Record<string, string> = {
  dormant: "bg-slate-100 text-slate-600",
  emerging: "bg-yellow-100 text-yellow-700",
  outbreak: "bg-red-100 text-red-700",
  contained: "bg-blue-100 text-blue-700",
  eradicated: "bg-green-100 text-green-700",
};

const containmentLabels: Record<string, string> = {
  none: "None",
  basic: "Basic Hygiene",
  enhanced: "Enhanced Protocols",
  strict: "Strict Quarantine",
  total: "Total Lockdown",
};

const rationingLabels: Record<string, string> = {
  generous: "Generous",
  normal: "Normal",
  strict: "Strict",
  emergency: "Emergency",
};

export default function LifeSupport() {
  const queryClient = useQueryClient();
  const [selectedRationing, setSelectedRationing] = useState<string>("normal");

  const { data: snapshotData, isLoading: snapshotLoading } = useQuery({
    queryKey: ["life-support-snapshot"],
    queryFn: () => apiFetch("/api/life-support/snapshot"),
    refetchInterval: 30000,
  });

  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ["life-support-health"],
    queryFn: () => apiFetch("/api/life-support/health"),
    refetchInterval: 15000,
  });

  const { data: diseaseCatalog } = useQuery({
    queryKey: ["disease-catalog"],
    queryFn: () => apiFetch("/api/life-support/disease-catalog"),
  });

  const { data: rationingData } = useQuery({
    queryKey: ["rationing-status"],
    queryFn: () => apiFetch("/api/life-support/rationing"),
  });

  const setContainment = useMutation({
    mutationFn: ({ diseaseId, level }: { diseaseId: string; level: string }) =>
      apiPost("/api/life-support/containment", { diseaseId, level }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["life-support-health"] });
    },
  });

  const setRationing = useMutation({
    mutationFn: (mode: string) => apiPost("/api/life-support/rationing", { mode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rationing-status"] });
    },
  });

  const snapshot = snapshotData?.snapshot;
  const health = healthData?.health;
  const catalog = diseaseCatalog?.catalog ?? [];

  if (snapshotLoading || healthLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900">Life Support Systems</h2>
            <p className="text-muted-foreground font-rajdhani text-lg">Colony biological survival layer</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-sm px-3 py-1",
              health?.overallHealth >= 0.7 ? "border-green-200 text-green-700 bg-green-50" :
              health?.overallHealth >= 0.4 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
              "border-red-200 text-red-700 bg-red-50"
            )}
          >
            <Heart className="w-4 h-4 mr-1" />
            {health ? Math.round(health.overallHealth * 100) : "-"}% Health
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-orbitron text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Population
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold text-slate-900">
                {snapshot?.population?.current?.toLocaleString() ?? "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Capacity: {snapshot?.population?.capacity?.toLocaleString() ?? "-"}
              </div>
              {snapshot?.population && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Utilization</span>
                    <span>{Math.round(snapshot.population.utilization * 100)}%</span>
                  </div>
                  <Progress
                    value={snapshot.population.utilization * 100}
                    className="h-1.5"
                  />
                </div>
              )}
              {snapshot?.population && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {snapshot.population.estimatedGrowthPerHour >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={snapshot.population.estimatedGrowthPerHour >= 0 ? "text-green-600" : "text-red-600"}>
                    {snapshot.population.estimatedGrowthPerHour >= 0 ? "+" : ""}
                    {snapshot.population.estimatedGrowthPerHour}/h
                  </span>
                  <span className="text-slate-400 ml-1">Growth</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-orbitron text-slate-900 flex items-center gap-2">
                <Wheat className="w-4 h-4 text-amber-500" />
                Food Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-orbitron font-bold text-slate-900">
                  {snapshot?.food?.stock?.toLocaleString() ?? "-"}
                </div>
                <Badge variant="outline" className={cn("text-xs", pressureColor[snapshot?.food?.pressure ?? "stable"])}>
                  {snapshot?.food?.pressure ?? "stable"}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Production</span>
                  <span className="text-green-600 font-mono">+{snapshot?.food?.productionPerHour ?? 0}/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumption</span>
                  <span className="text-red-600 font-mono">-{snapshot?.food?.demandPerHour ?? 0}/h</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-medium">
                  <span>Net</span>
                  <span className={cn(
                    "font-mono",
                    (snapshot?.food?.netPerHour ?? 0) >= 0 ? "text-green-600" : "text-red-600",
                  )}>
                    {(snapshot?.food?.netPerHour ?? 0) >= 0 ? "+" : ""}
                    {snapshot?.food?.netPerHour ?? 0}/h
                  </span>
                </div>
              </div>
              {snapshot?.food?.hoursToDepletion && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  <AlertTriangle className="w-3 h-3" />
                  Depletion in ~{snapshot.food.hoursToDepletion}h
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-orbitron text-slate-900 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                Water Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-orbitron font-bold text-slate-900">
                  {snapshot?.water?.stock?.toLocaleString() ?? "-"}
                </div>
                <Badge variant="outline" className={cn("text-xs", pressureColor[snapshot?.water?.pressure ?? "stable"])}>
                  {snapshot?.water?.pressure ?? "stable"}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Production</span>
                  <span className="text-green-600 font-mono">+{snapshot?.water?.productionPerHour ?? 0}/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumption</span>
                  <span className="text-red-600 font-mono">-{snapshot?.water?.demandPerHour ?? 0}/h</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-medium">
                  <span>Net</span>
                  <span className={cn(
                    "font-mono",
                    (snapshot?.water?.netPerHour ?? 0) >= 0 ? "text-green-600" : "text-red-600",
                  )}>
                    {(snapshot?.water?.netPerHour ?? 0) >= 0 ? "+" : ""}
                    {snapshot?.water?.netPerHour ?? 0}/h
                  </span>
                </div>
              </div>
              {snapshot?.water?.hoursToDepletion && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  <AlertTriangle className="w-3 h-3" />
                  Depletion in ~{snapshot.water.hoursToDepletion}h
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Colony Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>Overall Health</span>
                  <span className={cn(
                    "font-mono font-bold",
                    (health?.overallHealth ?? 0.85) >= 0.7 ? "text-green-600" :
                    (health?.overallHealth ?? 0.85) >= 0.4 ? "text-yellow-600" : "text-red-600",
                  )}>
                    {Math.round((health?.overallHealth ?? 0.85) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(health?.overallHealth ?? 0.85) * 100}
                  className={cn(
                    "h-2",
                    (health?.overallHealth ?? 0.85) >= 0.7 ? "bg-green-100" :
                    (health?.overallHealth ?? 0.85) >= 0.4 ? "bg-yellow-100" : "bg-red-100",
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Resistance
                  </div>
                  <div className="text-lg font-orbitron font-bold text-slate-900 mt-1">
                    {Math.round((health?.diseaseResistance ?? 0) * 100)}%
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Outbreak Risk
                  </div>
                  <div className="text-lg font-orbitron font-bold mt-1 flex items-center gap-1">
                    <span className={cn(
                      (health?.outbreakRisk ?? 0) >= 0.3 ? "text-red-600" :
                      (health?.outbreakRisk ?? 0) >= 0.15 ? "text-yellow-600" : "text-green-600",
                    )}>
                      {Math.round((health?.outbreakRisk ?? 0) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Medical Capacity
                  </div>
                  <div className="text-lg font-orbitron font-bold text-slate-900 mt-1">
                    {health?.medicalCapacity?.toLocaleString() ?? "-"}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Skull className="w-3 h-3" /> Active Outbreaks
                  </div>
                  <div className="text-lg font-orbitron font-bold mt-1">
                    <span className={cn(
                      (health?.activeOutbreaks?.length ?? 0) > 0 ? "text-red-600" : "text-green-600",
                    )}>
                      {health?.activeOutbreaks?.length ?? 0}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">/ 3</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-500" />
                Rationing & Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Food Rationing Mode</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(rationingLabels).map(([key, label]) => {
                    const config = rationingData?.config?.[key] ?? {};
                    const isActive = (rationingData?.mode ?? "normal") === key;
                    return (
                      <Button
                        key={key}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => {
                          setSelectedRationing(key);
                          setRationing.mutate(key);
                        }}
                        disabled={setRationing.isPending}
                      >
                        <div className="flex flex-col items-start">
                          <span>{label}</span>
                          {config.happinessDelta !== undefined && (
                            <span className={cn(
                              "text-[10px] opacity-70",
                              config.happinessDelta > 0 ? "text-green-300" : config.happinessDelta < 0 ? "text-red-300" : "",
                            )}>
                              {config.happinessDelta > 0 ? "+" : ""}
                              {Math.round(config.happinessDelta * 100)}% happiness
                            </span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Current Mode Effects</div>
                {rationingData?.mode && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mode</span>
                      <span className="font-medium text-slate-900">{rationingLabels[rationingData.mode as keyof typeof rationingLabels] ?? rationingData.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Consumption Modifier</span>
                      <span className="font-mono font-medium text-slate-900">
                        {rationingData.config?.[rationingData.mode]?.modifier ?? 1.0}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Happiness Effect</span>
                      <span className={cn(
                        "font-mono",
                        (rationingData.config?.[rationingData.mode]?.happinessDelta ?? 0) > 0 ? "text-green-600" :
                        (rationingData.config?.[rationingData.mode]?.happinessDelta ?? 0) < 0 ? "text-red-600" : "text-slate-900",
                      )}>
                        {(rationingData.config?.[rationingData.mode]?.happinessDelta ?? 0) >= 0 ? "+" : ""}
                        {Math.round((rationingData.config?.[rationingData.mode]?.happinessDelta ?? 0) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-red-500" />
              Active Outbreaks
              {health?.activeOutbreaks && health.activeOutbreaks.length > 0 && (
                <Badge variant="destructive" className="ml-2">{health.activeOutbreaks.length} active</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!health?.activeOutbreaks || health.activeOutbreaks.length === 0) ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p className="font-medium">No active disease outbreaks</p>
                <p className="text-sm mt-1">Colony health is stable</p>
              </div>
            ) : (
              <div className="space-y-4">
                {health.activeOutbreaks.map((outbreak: any) => {
                  const disease = catalog.find((d: any) => d.id === outbreak.diseaseId);
                  return (
                    <div key={outbreak.diseaseId} className="bg-slate-50 rounded border border-slate-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-orbitron font-bold text-slate-900">{disease?.name ?? outbreak.diseaseId}</h4>
                            <Badge className={cn("text-xs", severityColor[disease?.severity ?? "mild"])}>
                              {disease?.severity ?? "unknown"}
                            </Badge>
                            <Badge className={cn("text-xs", statusColor[outbreak.status])}>
                              {outbreak.status}
                            </Badge>
                          </div>
                          {disease?.description && (
                            <p className="text-xs text-slate-500 mt-1">{disease.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="bg-white p-2 rounded border border-slate-200 text-center">
                          <div className="text-xs text-slate-500">Infected</div>
                          <div className="font-orbitron font-bold text-red-600 text-sm">{outbreak.infectedCount?.toLocaleString() ?? 0}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200 text-center">
                          <div className="text-xs text-slate-500">Total Cases</div>
                          <div className="font-orbitron font-bold text-slate-900 text-sm">{outbreak.totalCases?.toLocaleString() ?? 0}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200 text-center">
                          <div className="text-xs text-slate-500">Fatalities</div>
                          <div className="font-orbitron font-bold text-red-800 text-sm">{outbreak.fatalities?.toLocaleString() ?? 0}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200 text-center">
                          <div className="text-xs text-slate-500">Duration</div>
                          <div className="font-orbitron font-bold text-slate-900 text-sm">{outbreak.turnsActive ?? 0}t</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-slate-600 mb-2">Containment Measures</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(containmentLabels).map(([key, label]) => {
                            const isActive = outbreak.containmentLevel === key;
                            return (
                              <Button
                                key={key}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => setContainment.mutate({ diseaseId: outbreak.diseaseId, level: key })}
                                disabled={setContainment.isPending || outbreak.status === "eradicated" || outbreak.status === "contained"}
                              >
                                {label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron text-slate-900 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-green-500" />
              Disease Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catalog.map((disease: any) => {
                const active = health?.activeOutbreaks?.find((o: any) => o.diseaseId === disease.id);
                return (
                  <div
                    key={disease.id}
                    className={cn(
                      "p-3 rounded border text-sm",
                      active ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron font-bold text-slate-900">{disease.name}</span>
                        <Badge className={cn("text-[10px]", severityColor[disease.severity])}>
                          {disease.severity}
                        </Badge>
                      </div>
                      {active && (
                        <Badge variant="destructive" className="text-[10px]">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{disease.description}</p>
                    <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-600">
                      <div>Trans: {Math.round(disease.transmissionRate * 100)}%</div>
                      <div>Mort: {Math.round(disease.mortalityRate * 100)}%</div>
                      <div>Inc: {disease.incubationTurns}t</div>
                      <div>Dur: {disease.durationTurns}t</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 mt-1">
                      <div>Prod Penalty: -{Math.round(disease.productivityPenalty * 100)}%</div>
                      <div>Happiness: -{Math.round(disease.happinessPenalty * 100)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-slate-400 py-6 border-t border-slate-200">
          &copy; 2026 Universe Civilization: Empires at War. All rights reserved.
        </div>
      </div>
    </GameLayout>
  );
}
