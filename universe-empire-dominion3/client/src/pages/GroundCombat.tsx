import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { useActiveCampaigns, useArmySubsystems, useCompleteCampaign, useDeployCampaign, useMilitaryForce } from "@/hooks/useCivilizationArmy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Crosshair, Shield, Swords, Target, TowerControl, Users } from "lucide-react";
import type { ArmySubsystem, ArmyUnit, MilitaryCampaign } from "@shared/types/civilization";

type PlanetSummary = {
  id: string;
  name: string;
  coordinates: string;
  colonized: boolean;
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

function classifyGroundRole(subsystem: ArmySubsystem) {
  const haystack = `${subsystem.name} ${subsystem.description} ${subsystem.flavorText || ""}`.toLowerCase();
  if (haystack.includes("special") || haystack.includes("commando") || haystack.includes("infiltration") || haystack.includes("ops")) {
    return "special_ops";
  }
  if (haystack.includes("shock") || haystack.includes("breach") || haystack.includes("assault") || haystack.includes("mech")) {
    return "shock";
  }
  return "infantry";
}

function parseCoordinates(raw: string) {
  const [galaxy, system, planet] = raw.split(":").map((value) => Number.parseInt(value, 10) || 1);
  return { galaxy, system, planet };
}

export default function GroundCombat() {
  const { toast } = useToast();
  const [selectedPlanetId, setSelectedPlanetId] = useState("");
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [operationName, setOperationName] = useState("");
  const [operationType, setOperationType] = useState<"conquest" | "raid" | "defense">("conquest");

  const planetsQuery = useQuery<{ planets: PlanetSummary[] }>({
    queryKey: ["/api/planets"],
  });
  const { data: subsystems } = useArmySubsystems();
  const { data: militaryForce } = useMilitaryForce();
  const { data: activeCampaigns } = useActiveCampaigns();
  const deployCampaignMutation = useDeployCampaign();
  const completeCampaignMutation = useCompleteCampaign();

  const planets = planetsQuery.data?.planets || [];
  const force = militaryForce?.force || militaryForce || { squadrons: [] as ArmyUnit[] };
  const subsystemById = useMemo(
    () => new Map<string, ArmySubsystem>((subsystems || []).map((subsystem) => [subsystem.id, subsystem])),
    [subsystems],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPlanet = params.get("planet");
    if (!selectedPlanetId && planets.length) {
      const match = planets.find((planet) => planet.id === requestedPlanet);
      setSelectedPlanetId(match?.id || planets[0].id);
    }
  }, [planets, selectedPlanetId]);

  const selectedPlanet = planets.find((planet) => planet.id === selectedPlanetId) || null;
  const selectedForce = force.squadrons.filter((unit: ArmyUnit) => selectedUnitIds.includes(unit.id));

  const readiness = useMemo(() => {
    return selectedForce.reduce(
      (summary: {
        totalUnits: number;
        assault: number;
        defense: number;
        speed: number;
        roles: { infantry: number; shock: number; special_ops: number };
      }, unit: ArmyUnit) => {
        const subsystem = subsystemById.get(unit.subsystemId);
        if (!subsystem) return summary;

        const role = classifyGroundRole(subsystem);
        summary.totalUnits += unit.quantity;
        summary.assault += subsystem.combat.attack * unit.quantity;
        summary.defense += subsystem.combat.defense * unit.quantity;
        summary.speed += subsystem.combat.speed * unit.quantity;
        summary.roles[role] += unit.quantity;
        return summary;
      },
      {
        totalUnits: 0,
        assault: 0,
        defense: 0,
        speed: 0,
        roles: { infantry: 0, shock: 0, special_ops: 0 },
      },
    );
  }, [selectedForce, subsystemById]);

  const averageSpeed = readiness.totalUnits > 0 ? Math.round(readiness.speed / readiness.totalUnits) : 0;
  const assaultScore = readiness.assault + (readiness.roles.shock * 8) + (readiness.roles.special_ops * 6);
  const controlScore = readiness.defense + (readiness.roles.infantry * 5) + (readiness.roles.special_ops * 8);
  const pressureScore = readiness.roles.shock * 4 + readiness.roles.special_ops * 7;

  const handleDeploy = () => {
    if (!selectedPlanet) {
      toast({ title: "Target required", description: "Choose a planet for this operation.", variant: "destructive" });
      return;
    }

    if (selectedUnitIds.length === 0) {
      toast({ title: "No units assigned", description: "Select invasion units before launching the operation.", variant: "destructive" });
      return;
    }

    const coordinates = parseCoordinates(selectedPlanet.coordinates);
    deployCampaignMutation.mutate(
      {
        campaignName: operationName.trim() || `${selectedPlanet.name} ${operationType} operation`,
        unitIds: selectedUnitIds,
        targetGalaxy: coordinates.galaxy,
        targetSystem: coordinates.system,
        targetPlanet: coordinates.planet,
        campaignType: operationType,
      },
      {
        onSuccess: () => {
          toast({ title: "Ground operation deployed", description: "The assault package has moved into the active campaign queue." });
          setSelectedUnitIds([]);
          setOperationName("");
        },
        onError: (error: Error) => {
          toast({ title: "Deployment failed", description: error.message, variant: "destructive" });
        },
      },
    );
  };

  const activeGroundCampaigns = (activeCampaigns || []).filter((campaign: MilitaryCampaign) =>
    campaign.type === "conquest" || campaign.type === "raid" || campaign.type === "defense",
  );

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="ground-combat-page">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Ground Combat</h1>
            <p className="text-slate-600">
              Organize infantry, shock troopers, and special operations teams for invasion, pacification, and fortified defense missions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/training-center"><Button variant="outline"><Users className="w-4 h-4 mr-2" /> Training Center</Button></Link>
            <Link href="/army-management"><Button variant="outline"><Swords className="w-4 h-4 mr-2" /> Army Management</Button></Link>
            <Link href={selectedPlanet ? `/planet-occupation?planet=${selectedPlanet.id}` : "/planet-occupation"}>
              <Button variant="outline"><TowerControl className="w-4 h-4 mr-2" /> Occupation Ops</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned Units</div><div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{readiness.totalUnits}</div></CardContent></Card>
          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Assault Score</div><div className="mt-2 text-3xl font-orbitron font-bold text-rose-600">{assaultScore}</div></CardContent></Card>
          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Control Score</div><div className="mt-2 text-3xl font-orbitron font-bold text-blue-600">{controlScore}</div></CardContent></Card>
          <Card className="border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Pressure Index</div><div className="mt-2 text-3xl font-orbitron font-bold text-amber-600">{pressureScore}</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Target className="w-5 h-5 text-primary" /> Operation Planner
              </CardTitle>
              <CardDescription>Select a target planet, tune mission posture, and assign the invasion package.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Target Planet</label>
                  <select
                    value={selectedPlanetId}
                    onChange={(event) => setSelectedPlanetId(event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="">Select a world...</option>
                    {planets.map((planet) => (
                      <option key={planet.id} value={planet.id}>{planet.name} [{planet.coordinates}]</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Operation Name</label>
                  <Input
                    value={operationName}
                    onChange={(event) => setOperationName(event.target.value)}
                    placeholder="Iron Dawn, Silent Lance..."
                    className="mt-2 bg-white border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: "conquest", label: "Planetary Invasion", description: "Break resistance and seize administrative control." },
                  { value: "raid", label: "Shock Raid", description: "Hit logistics nodes, steal stockpiles, and withdraw." },
                  { value: "defense", label: "Occupation Reinforcement", description: "Stabilize a captured world and harden its garrison." },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setOperationType(option.value as "conquest" | "raid" | "defense")}
                    className={`rounded-lg border p-4 text-left ${operationType === option.value ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{option.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Assign Troops</div>
                  <Badge variant="outline">{selectedUnitIds.length} formations selected</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {force.squadrons.map((unit: ArmyUnit) => {
                    const subsystem = subsystemById.get(unit.subsystemId);
                    if (!subsystem) return null;
                    const checked = selectedUnitIds.includes(unit.id);
                    const role = classifyGroundRole(subsystem);

                    return (
                      <label key={unit.id} className={`rounded-lg border p-4 ${checked ? "border-primary bg-primary/5" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{unit.quantity}x {subsystem.name}</div>
                            <div className="mt-1 text-xs text-slate-500 capitalize">
                              {role.replace("_", " ")} • morale {unit.morale}% • level {unit.level}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedUnitIds((current) =>
                                checked ? current.filter((entry) => entry !== unit.id) : [...current, unit.id],
                              )
                            }
                          />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">ATK {subsystem.combat.attack}</div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">DEF {subsystem.combat.defense}</div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">SPD {subsystem.combat.speed}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Button className="w-full" onClick={handleDeploy} disabled={deployCampaignMutation.isPending}>
                <Crosshair className="w-4 h-4 mr-2" /> {deployCampaignMutation.isPending ? "Deploying..." : "Launch Ground Operation"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="w-5 h-5 text-blue-600" /> Combat Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Infantry Line</span>
                    <span>{readiness.roles.infantry}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.infantry)} className="mt-2 h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Shock Elements</span>
                    <span>{readiness.roles.shock}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.shock)} className="mt-2 h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Special Operations</span>
                    <span>{readiness.roles.special_ops}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.special_ops)} className="mt-2 h-2" />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  Average assault tempo: <span className="font-semibold text-slate-900">{averageSpeed}</span> mobility
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TowerControl className="w-5 h-5 text-amber-600" /> Active Planetary Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeGroundCampaigns.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No planetary combat operations are currently active.
                  </div>
                ) : (
                  activeGroundCampaigns.map((campaign: MilitaryCampaign) => (
                    <div key={campaign.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{campaign.name}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {campaign.type} • target {campaign.targetGalaxy}:{campaign.targetSystem}:{campaign.targetPlanet || 1}
                          </div>
                        </div>
                        <Badge variant="secondary">{campaign.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded border border-slate-200 bg-slate-50 p-2">Forces {campaign.allocatedForces.length}</div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-2">Success {Math.round((campaign.successRate || 0) * 100)}%</div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => completeCampaignMutation.mutate({ campaignId: campaign.id, successful: true })}>
                          Mark Success
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => completeCampaignMutation.mutate({ campaignId: campaign.id, successful: false })}>
                          Mark Failed
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
