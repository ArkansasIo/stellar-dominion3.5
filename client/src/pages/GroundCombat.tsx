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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Crosshair, Shield, Swords, Target, TowerControl, Users, Zap, ChevronDown, ChevronUp, Clock, ArrowRight, BarChart3, Skull, Radio, MapPin, AlertTriangle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import type { ArmySubsystem, ArmyUnit, MilitaryCampaign } from "@shared/types/civilization";

type PlanetSummary = {
  id: string;
  name: string;
  coordinates: string;
  colonized: boolean;
  biome?: string;
  defenses?: number;
  garrison?: number;
};

type BattleSimulationResult = {
  victory: boolean;
  rounds: number;
  attackerLosses: number;
  defenderLosses: number;
  attackerSurvival: number;
  defenderSurvival: number;
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

const TEMP_THEME_IMAGE = "/theme-temp.png";

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

function getRoleIcon(role: string) {
  switch (role) {
    case "infantry": return <Users className="w-3 h-3" />;
    case "shock": return <Swords className="w-3 h-3" />;
    case "special_ops": return <Target className="w-3 h-3" />;
    default: return <Users className="w-3 h-3" />;
  }
}

function simulateGroundBattle(attackerPower: number, defenderPower: number, rounds: number): BattleSimulationResult {
  let atk = attackerPower;
  let def = defenderPower;
  let round = 0;
  const MULTIPLIER = 0.15;

  while (atk > 0 && def > 0 && round < (rounds || 50)) {
    round++;
    const atkDmg = atk * MULTIPLIER * (0.8 + Math.random() * 0.4);
    const defDmg = def * MULTIPLIER * (0.8 + Math.random() * 0.4);
    def = Math.max(0, def - atkDmg);
    atk = Math.max(0, atk - defDmg);
  }

  const total = attackerPower + defenderPower || 1;
  return {
    victory: def <= 0 && atk > 0,
    rounds: round,
    attackerLosses: Math.round(attackerPower - atk),
    defenderLosses: Math.round(defenderPower - def),
    attackerSurvival: total > 0 ? Math.round((atk / (attackerPower || 1)) * 100) : 0,
    defenderSurvival: total > 0 ? Math.round((def / (defenderPower || 1)) * 100) : 0,
  };
}

export default function GroundCombat() {
  const { toast } = useToast();
  const [selectedPlanetId, setSelectedPlanetId] = useState("");
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [operationName, setOperationName] = useState("");
  const [operationType, setOperationType] = useState<"conquest" | "raid" | "defense">("conquest");
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationRounds, setSimulationRounds] = useState(20);

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
        morale: number;
        roles: { infantry: number; shock: number; special_ops: number };
      }, unit: ArmyUnit) => {
        const subsystem = subsystemById.get(unit.subsystemId);
        if (!subsystem) return summary;

        const role = classifyGroundRole(subsystem);
        summary.totalUnits += unit.quantity;
        summary.assault += subsystem.combat.attack * unit.quantity;
        summary.defense += subsystem.combat.defense * unit.quantity;
        summary.speed += subsystem.combat.speed * unit.quantity;
        summary.morale += (unit.morale || 50) * unit.quantity;
        summary.roles[role] += unit.quantity;
        return summary;
      },
      { totalUnits: 0, assault: 0, defense: 0, speed: 0, morale: 0, roles: { infantry: 0, shock: 0, special_ops: 0 } },
    );
  }, [selectedForce, subsystemById]);

  const averageSpeed = readiness.totalUnits > 0 ? Math.round(readiness.speed / readiness.totalUnits) : 0;
  const averageMorale = readiness.totalUnits > 0 ? Math.round(readiness.morale / readiness.totalUnits) : 0;
  const assaultScore = readiness.assault + readiness.roles.shock * 8 + readiness.roles.special_ops * 6;
  const controlScore = readiness.defense + readiness.roles.infantry * 5 + readiness.roles.special_ops * 8;
  const pressureScore = readiness.roles.shock * 4 + readiness.roles.special_ops * 7;

  const simulationResult = useMemo(() => {
    const targetDefense = selectedPlanet?.defenses || 1000;
    return simulateGroundBattle(assaultScore, targetDefense + controlScore, simulationRounds);
  }, [assaultScore, controlScore, selectedPlanet, simulationRounds]);

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

  const totalAvailablePower = useMemo(() => {
    return (force.squadrons || []).reduce((sum: number, unit: ArmyUnit) => {
      const subsystem = subsystemById.get(unit.subsystemId);
      if (!subsystem) return sum;
      return sum + subsystem.combat.attack * unit.quantity;
    }, 0);
  }, [force, subsystemById]);

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.COMBAT.path})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Ground Combat" className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Ground Combat</h1>
              <p className="text-slate-300 text-sm mt-1">Organize infantry, shock troopers, and special operations teams for invasion, pacification, and fortified defense missions.</p>
            </div>
          </div>
        </div>
      </div>
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
          <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Units" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned Units</div>
              </div>
              <div className="text-3xl font-orbitron font-bold text-slate-900">{readiness.totalUnits}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-gradient-to-br from-rose-50 to-rose-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Assault" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Assault Score</div>
              </div>
              <div className="text-3xl font-orbitron font-bold text-rose-600">{assaultScore}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Control" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Control Score</div>
              </div>
              <div className="text-3xl font-orbitron font-bold text-blue-600">{controlScore}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Pressure" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Pressure Index</div>
              </div>
              <div className="text-3xl font-orbitron font-bold text-amber-600">{pressureScore}</div>
            </CardContent>
          </Card>
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
                      <option key={planet.id} value={planet.id}>
                        {planet.name} [{planet.coordinates}] {planet.biome ? `- ${planet.biome}` : ""}
                      </option>
                    ))}
                  </select>
                  {selectedPlanet && (
                    <div className="mt-2 flex gap-2 text-xs text-slate-500">
                      <Badge variant="outline" className="text-[10px]">{selectedPlanet.biome || "Unknown biome"}</Badge>
                      {selectedPlanet.defenses !== undefined && (
                        <Badge variant="outline" className="text-[10px]">Defenses: {selectedPlanet.defenses}</Badge>
                      )}
                    </div>
                  )}
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
                  { value: "conquest", label: "Planetary Invasion", icon: <Crosshair className="w-4 h-4" />, description: "Break resistance and seize administrative control." },
                  { value: "raid", label: "Shock Raid", icon: <Zap className="w-4 h-4" />, description: "Hit logistics nodes, steal stockpiles, and withdraw." },
                  { value: "defense", label: "Occupation Reinforcement", icon: <Shield className="w-4 h-4" />, description: "Stabilize a captured world and harden its garrison." },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setOperationType(option.value as "conquest" | "raid" | "defense")}
                    className={`rounded-lg border p-4 text-left transition ${operationType === option.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {option.icon}
                      <div className="font-semibold text-slate-900">{option.label}</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{option.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Assign Troops</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedUnitIds.length} formations selected</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowSimulation(!showSimulation)}
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {showSimulation ? "Hide" : "Show"} Sim
                    </Button>
                  </div>
                </div>

                {showSimulation && (
                  <Card className="bg-indigo-50 border-indigo-200">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-900">Battle Simulation</span>
                        <span className="text-indigo-600">{simulationRounds} max rounds</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded bg-white/70 border border-indigo-200 p-2">
                          <span className="text-indigo-600">Predicted outcome: </span>
                          <span className={cn("font-bold", simulationResult.victory ? "text-green-700" : "text-red-700")}>
                            {simulationResult.victory ? "VICTORY" : "DEFEAT"}
                          </span>
                        </div>
                        <div className="rounded bg-white/70 border border-indigo-200 p-2">
                          <span className="text-indigo-600">Rounds: </span>
                          <span className="font-bold text-indigo-900">{simulationResult.rounds}</span>
                        </div>
                        <div className="rounded bg-white/70 border border-indigo-200 p-2">
                          <span className="text-indigo-600">Attacker losses: </span>
                          <span className="font-bold text-red-600">{simulationResult.attackerLosses.toLocaleString()}</span>
                        </div>
                        <div className="rounded bg-white/70 border border-indigo-200 p-2">
                          <span className="text-indigo-600">Defender losses: </span>
                          <span className="font-bold text-red-600">{simulationResult.defenderLosses.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-indigo-500">Max rounds:</span>
                        <Input
                          type="number"
                          value={simulationRounds}
                          onChange={(e) => setSimulationRounds(Math.max(1, Number(e.target.value) || 20))}
                          className="h-6 w-16 text-xs bg-white border-indigo-200"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-80 overflow-y-auto">
                  {force.squadrons.map((unit: ArmyUnit) => {
                    const subsystem = subsystemById.get(unit.subsystemId);
                    if (!subsystem) return null;
                    const checked = selectedUnitIds.includes(unit.id);
                    const role = classifyGroundRole(subsystem);

                    return (
                      <label key={unit.id} className={`rounded-lg border p-4 transition cursor-pointer ${checked ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{unit.quantity}x {subsystem.name}</span>
                              <Badge variant="outline" className="text-[10px] capitalize">{role.replace("_", " ")}</Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> morale {unit.morale}%</span>
                              <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> level {unit.level}</span>
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
                            className="mt-1"
                          />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                            <div className="text-slate-400">ATK</div>
                            <div className="font-bold text-slate-900">{subsystem.combat.attack}</div>
                          </div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                            <div className="text-slate-400">DEF</div>
                            <div className="font-bold text-slate-900">{subsystem.combat.defense}</div>
                          </div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                            <div className="text-slate-400">SPD</div>
                            <div className="font-bold text-slate-900">{subsystem.combat.speed}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleDeploy}
                disabled={deployCampaignMutation.isPending || selectedUnitIds.length === 0}
              >
                {deployCampaignMutation.isPending ? (
                  <>Deploying...</>
                ) : (
                  <><Crosshair className="w-4 h-4 mr-2" /> Launch {operationType === "conquest" ? "Invasion" : operationType === "raid" ? "Raid" : "Reinforcement"}</>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="w-5 h-5 text-blue-600" /> Force Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Infantry Line</span>
                    <span>{readiness.roles.infantry}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.infantry)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Shock Elements</span>
                    <span>{readiness.roles.shock}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.shock)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Special Operations</span>
                    <span>{readiness.roles.special_ops}</span>
                  </div>
                  <Progress value={Math.min(100, readiness.roles.special_ops)} className="h-2" />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <span className="text-slate-500">Avg Speed: </span>
                    <span className="font-semibold text-slate-900">{averageSpeed}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <span className="text-slate-500">Avg Morale: </span>
                    <span className="font-semibold text-slate-900">{averageMorale}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TowerControl className="w-5 h-5 text-amber-600" /> Active Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeGroundCampaigns.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No planetary combat operations are currently active.
                  </div>
                ) : (
                  activeGroundCampaigns.map((campaign: MilitaryCampaign) => (
                    <div key={campaign.id} className="rounded-lg border border-slate-200 p-4 bg-white">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{campaign.name}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {campaign.type} • target {campaign.targetGalaxy}:{campaign.targetSystem}:{campaign.targetPlanet || 1}
                          </div>
                        </div>
                        <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                          <span className="text-slate-500">Forces</span>
                          <div className="font-bold text-slate-900">{campaign.allocatedForces.length}</div>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                          <span className="text-slate-500">Success</span>
                          <div className="font-bold text-green-700">{Math.round((campaign.successRate || 0) * 100)}%</div>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                          <span className="text-slate-500">Duration</span>
                          <div className="font-bold text-slate-900">
                            {campaign.startedAt ? `${Math.floor((Date.now() - new Date(campaign.startedAt).getTime()) / 3600000)}h` : "-"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => completeCampaignMutation.mutate({ campaignId: campaign.id, successful: true })}>
                          <Trophy className="w-3 h-3 mr-1" /> Mark Success
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => completeCampaignMutation.mutate({ campaignId: campaign.id, successful: false })}>
                          <Skull className="w-3 h-3 mr-1" /> Mark Failed
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                  <Radio className="w-4 h-4" /> Strategic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <div className="flex justify-between"><span>Total available power</span><span className="font-bold text-slate-900">{totalAvailablePower.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Active campaigns</span><span className="font-bold text-slate-900">{activeGroundCampaigns.length}</span></div>
                <div className="flex justify-between"><span>Available systems</span><span className="font-bold text-slate-900">{subsystems?.length || 0}</span></div>
                <div className="flex justify-between"><span>Squadrons in force</span><span className="font-bold text-slate-900">{(force.squadrons || []).length}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
