import { useMemo, useState } from "react";
import { Link } from "wouter";
import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { useArmySubsystems, useMilitaryForce, useTrainUnit } from "@/hooks/useCivilizationArmy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Rocket, Shield, Swords, Users, Clock, BarChart3, TrendingUp, Target, Zap, BookOpen, Star, ChevronRight, CheckCircle, AlertCircle, Timer, Layers, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
import type { ArmySubsystem } from "@shared/types/civilization";

type BuildingKey = "roboticsFactory" | "researchLab" | "shipyard";

type TrainingTrack = {
  id: string;
  name: string;
  description: string;
  buildingRequirements: Array<{ key: BuildingKey; label: string; level: number }>;
  focuses: string[];
  roles: Array<ArmySubsystem["role"]>;
};

const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: "academy-core",
    name: "Academy Core",
    description: "Baseline infantry, support cadres, and defensive specialists needed to keep planetary security stable.",
    buildingRequirements: [{ key: "researchLab", label: "Research Lab", level: 1 }],
    focuses: ["infantry", "support", "security"],
    roles: ["support", "sergeant", "specialist"],
  },
  {
    id: "pilot-command",
    name: "Pilot Command",
    description: "Flight schools, bridge drills, and cockpit simulators that certify pilots, navigators, and carrier crews.",
    buildingRequirements: [{ key: "shipyard", label: "Shipyard", level: 2 }],
    focuses: ["pilot", "flight", "carrier", "aviator"],
    roles: ["operator", "captain"],
  },
  {
    id: "shock-doctrine",
    name: "Shock Doctrine",
    description: "Assault programs for breachers, heavy troopers, and mech operators used in high-pressure breakthroughs.",
    buildingRequirements: [
      { key: "shipyard", label: "Shipyard", level: 4 },
      { key: "roboticsFactory", label: "Robotics Factory", level: 2 },
    ],
    focuses: ["shock", "assault", "mech", "breach"],
    roles: ["operator", "sergeant", "specialist"],
  },
  {
    id: "officer-college",
    name: "Officer College",
    description: "Command schools that train fleet officers, invasion coordinators, and occupation governors.",
    buildingRequirements: [
      { key: "researchLab", label: "Research Lab", level: 4 },
      { key: "roboticsFactory", label: "Robotics Factory", level: 3 },
    ],
    focuses: ["officer", "command", "tactical", "fleet"],
    roles: ["commander", "captain"],
  },
  {
    id: "black-ops",
    name: "Black Ops Annex",
    description: "Restricted tracks for infiltration teams, sabotage cells, and deep-cover special operations personnel.",
    buildingRequirements: [
      { key: "shipyard", label: "Shipyard", level: 5 },
      { key: "researchLab", label: "Research Lab", level: 6 },
    ],
    focuses: ["special", "ops", "commando", "infiltration", "sniper"],
    roles: ["specialist", "captain", "commander"],
  },
];

type ActiveTraining = {
  id: string;
  subsystemId: string;
  subsystemName: string;
  quantity: number;
  startedAt: string;
  completesAt: string;
  progress: number;
  status: "in_progress" | "paused" | "cancelled" | "completed";
};

type Graduate = {
  id: string;
  name: string;
  subsystemId: string;
  subsystemName: string;
  graduatedAt: string;
  performance: number;
  specialization: string;
};

const SPECIALIZATION_BRANCHES = [
  { id: "infantry", name: "Infantry", icon: "Users", bonuses: "ATK +5%, DEF +5% per tier", color: "emerald" },
  { id: "assault", name: "Assault", icon: "Swords", bonuses: "ATK +8%, SPD +3% per tier", color: "red" },
  { id: "support", name: "Support", icon: "Shield", bonuses: "DEF +8%, heals +3% per tier", color: "blue" },
  { id: "special-ops", name: "Special Ops", icon: "Target", bonuses: "ACC +10%, stealth +5% per tier", color: "purple" },
  { id: "command", name: "Command", icon: "Star", bonuses: "All stats +3%, morale +5% per tier", color: "amber" },
  { id: "mech", name: "Mech", icon: "Zap", bonuses: "ATK +10%, HP +5% per tier", color: "orange" },
];

const MOCK_ACTIVE_TRAINING: ActiveTraining[] = [
  { id: "t1", subsystemId: "inf-basic", subsystemName: "Infantry Squad", quantity: 50, startedAt: "2026-06-25T10:00:00Z", completesAt: "2026-06-28T10:00:00Z", progress: 75, status: "in_progress" },
  { id: "t2", subsystemId: "eng-support", subsystemName: "Engineer Support", quantity: 20, startedAt: "2026-06-26T08:00:00Z", completesAt: "2026-06-30T08:00:00Z", progress: 40, status: "in_progress" },
  { id: "t3", subsystemId: "pilot-basic", subsystemName: "Pilot Cadre", quantity: 10, startedAt: "2026-06-27T14:00:00Z", completesAt: "2026-07-01T14:00:00Z", progress: 20, status: "in_progress" },
  { id: "t4", subsystemId: "officer-cmd", subsystemName: "Command Staff", quantity: 5, startedAt: "2026-06-24T06:00:00Z", completesAt: "2026-06-26T06:00:00Z", progress: 100, status: "completed" },
];

const MOCK_GRADUATES: Graduate[] = [
  { id: "g1", name: "Alpha Squad", subsystemId: "inf-basic", subsystemName: "Infantry Squad", graduatedAt: "2026-06-26T06:00:00Z", performance: 92, specialization: "infantry" },
  { id: "g2", name: "Hammer Team", subsystemId: "shock-trooper", subsystemName: "Shock Trooper", graduatedAt: "2026-06-25T12:00:00Z", performance: 87, specialization: "assault" },
  { id: "g3", name: "Phantom Unit", subsystemId: "sniper-cell", subsystemName: "Sniper Cell", graduatedAt: "2026-06-24T18:00:00Z", performance: 95, specialization: "special-ops" },
  { id: "g4", name: "Repair Crew", subsystemId: "eng-support", subsystemName: "Engineer Support", graduatedAt: "2026-06-23T10:00:00Z", performance: 78, specialization: "support" },
];

const TEMP_THEME_IMAGE = "/theme-temp.png";

function matchesTrack(subsystem: ArmySubsystem, track: TrainingTrack) {
  const haystack = `${subsystem.name} ${subsystem.description} ${subsystem.flavorText || ""}`.toLowerCase();
  return (
    track.roles.includes(subsystem.role) ||
    track.focuses.some((focus) => haystack.includes(focus))
  );
}

function TrainingProgressBar({ training }: { training: ActiveTraining }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">{training.quantity}x {training.subsystemName}</span>
        <span className="font-mono">{training.progress}%</span>
      </div>
      <Progress value={training.progress} className={cn("h-2", training.status === "completed" && "bg-emerald-200 [&>div]:bg-emerald-500")} />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>Started {new Date(training.startedAt).toLocaleDateString()}</span>
        <span>Completes {new Date(training.completesAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function TrainingCenter() {
  const { commander, buildings } = useGame();
  const { toast } = useToast();
  const { data: subsystems } = useArmySubsystems();
  const { data: militaryForce } = useMilitaryForce();
  const trainUnitMutation = useTrainUnit();
  const [selectedTrackId, setSelectedTrackId] = useState(TRAINING_TRACKS[0].id);
  const [activeTab, setActiveTab] = useState("tracks");
  const [specializationFilter, setSpecializationFilter] = useState<string | null>(null);
  const [activeTrainings] = useState<ActiveTraining[]>(MOCK_ACTIVE_TRAINING);
  const [graduates] = useState<Graduate[]>(MOCK_GRADUATES);

  const selectedTrack = TRAINING_TRACKS.find((track) => track.id === selectedTrackId) || TRAINING_TRACKS[0];
  const commanderLevel = commander?.stats?.level || 1;
  const currentForce = militaryForce?.force || militaryForce || { squadrons: [] as Array<{ quantity: number }> };
  const totalPersonnel = currentForce.squadrons.reduce((sum: number, squadron: { quantity: number }) => sum + squadron.quantity, 0);
  const trainingCapacity = (buildings.shipyard * 12) + (buildings.roboticsFactory * 10) + (buildings.researchLab * 8);
  const availableCapacity = Math.max(0, trainingCapacity - totalPersonnel);

  const inProgressTrainings = activeTrainings.filter((t) => t.status === "in_progress");
  const completedTrainings = activeTrainings.filter((t) => t.status === "completed");
  const activePipelineCount = inProgressTrainings.reduce((sum, t) => sum + t.quantity, 0);
  const averagePerformance = graduates.length > 0 ? Math.round(graduates.reduce((sum, g) => sum + g.performance, 0) / graduates.length) : 0;

  const trackStates = useMemo(() => {
    return TRAINING_TRACKS.map((track) => {
      const readiness = track.buildingRequirements.reduce((sum, requirement) => {
        const currentLevel = buildings[requirement.key] || 0;
        return sum + Math.min(100, Math.round((currentLevel / requirement.level) * 100));
      }, 0) / track.buildingRequirements.length;
      const unlocked = track.buildingRequirements.every((requirement) => (buildings[requirement.key] || 0) >= requirement.level);
      return { ...track, unlocked, readiness: Math.round(readiness) };
    });
  }, [buildings]);

  const trainableUnits = useMemo(() => {
    return (subsystems || [])
      .filter((subsystem) => matchesTrack(subsystem, selectedTrack))
      .filter((subsystem) => (subsystem.minimumLevel || 1) <= commanderLevel)
      .sort((left, right) => left.tier - right.tier || left.name.localeCompare(right.name));
  }, [commanderLevel, selectedTrack, subsystems]);

  const filteredSpecializations = specializationFilter
    ? SPECIALIZATION_BRANCHES.filter((b) => b.id === specializationFilter)
    : SPECIALIZATION_BRANCHES;

  const handleTrain = (subsystem: ArmySubsystem, quantity: number) => {
    if (availableCapacity < quantity) {
      toast({
        title: "Training cap reached",
        description: `Only ${availableCapacity} personnel slots remain in your current training envelope.`,
        variant: "destructive",
      });
      return;
    }
    trainUnitMutation.mutate(
      { subsystemId: subsystem.id, quantity },
      {
        onSuccess: () => {
          toast({
            title: "Training queued",
            description: `${quantity} ${subsystem.name} personnel moved into the active training pipeline.`,
          });
        },
        onError: (error: Error) => {
          toast({ title: "Training failed", description: error.message, variant: "destructive" });
        },
      },
    );
  };

  return (
    <GameLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center mb-6" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.SHIPYARD.path})` }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img src={MENU_ASSETS.BUILDINGS.ROBOTICS_FACTORY.path} alt="Training Center" className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-2 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Training Center</h1>
              <p className="text-slate-300 text-sm mt-1">Unlock training tracks, expand personnel throughput, and prepare crews for fleets, invasions, and occupation duty.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6" data-testid="training-center-page">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" /> Training Center
            </h1>
            <p className="text-slate-600">
              Unlock training tracks, expand personnel throughput, and prepare crews for fleets, invasions, and occupation duty.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/army-management"><Button variant="outline"><Users className="w-4 h-4 mr-2" /> Army Management</Button></Link>
            <Link href="/fleet"><Button variant="outline"><Rocket className="w-4 h-4 mr-2" /> Fleet Command</Button></Link>
            <Link href="/ground-combat"><Button variant="outline"><Swords className="w-4 h-4 mr-2" /> Ground Combat</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.NAVIGATION.HOME.path} alt="Level" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Commander Level</div></div><div className="text-2xl font-orbitron font-bold text-slate-900">{commanderLevel}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.BUILDINGS.SHIPYARD.path} alt="Capacity" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Training Capacity</div></div><div className="text-2xl font-orbitron font-bold text-slate-900">{trainingCapacity.toLocaleString()}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Service" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">In Service</div></div><div className="text-2xl font-orbitron font-bold text-slate-900">{totalPersonnel.toLocaleString()}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden"><img src={MENU_ASSETS.RESOURCES.CREDITS.path} alt="Slots" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Open Slots</div></div><div className="text-2xl font-orbitron font-bold text-emerald-600">{availableCapacity.toLocaleString()}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center overflow-hidden"><img src={SHIP_ASSETS.SPECIAL.TRANSPORT.path} alt="Pipeline" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">In Pipeline</div></div><div className="text-2xl font-orbitron font-bold text-amber-600">{activePipelineCount.toLocaleString()}</div></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="tracks"><GraduationCap className="w-4 h-4 mr-1" /> Tracks</TabsTrigger>
            <TabsTrigger value="pipeline"><Clock className="w-4 h-4 mr-1" /> Pipeline</TabsTrigger>
            <TabsTrigger value="specializations"><Layers className="w-4 h-4 mr-1" /> Specializations</TabsTrigger>
            <TabsTrigger value="graduates"><Trophy className="w-4 h-4 mr-1" /> Graduates</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <GraduationCap className="w-5 h-5 text-primary" /> Track Availability
                </CardTitle>
                <CardDescription>Your building levels determine which academies and specializations can accept new personnel.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                {trackStates.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`rounded-lg border p-4 text-left transition ${selectedTrackId === track.id ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900">{track.name}</div>
                      <Badge variant={track.unlocked ? "secondary" : "outline"}>{track.unlocked ? "Online" : "Locked"}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{track.description}</div>
                    <Progress value={track.readiness} className="mt-4 h-2" />
                    <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                      {track.buildingRequirements.map((requirement) => (
                        <div key={`${track.id}-${requirement.key}`}>{requirement.label}: {(buildings[requirement.key] || 0)}/{requirement.level}</div>
                      ))}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-900">{selectedTrack.name}</CardTitle>
                  <CardDescription>{selectedTrack.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trainableUnits.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                      No units are available in this track yet. Raise building levels or commander level to unlock more advanced schools.
                    </div>
                  ) : (
                    trainableUnits.map((subsystem) => (
                      <div key={subsystem.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-slate-900">{subsystem.name}</div>
                              <Badge variant="outline">Tier {subsystem.tier}</Badge>
                              <Badge variant="secondary" className="capitalize">{subsystem.role}</Badge>
                            </div>
                            <div className="mt-1 text-sm text-slate-500">{subsystem.description}</div>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <div>Cost {subsystem.cost.credits.toLocaleString()} credits</div>
                            <div>Min level {(subsystem.minimumLevel || 1).toLocaleString()}</div>
                            <div>Min crew {subsystem.minCrewRequired}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">ATK {subsystem.combat.attack}</div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">DEF {subsystem.combat.defense}</div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">ACC {subsystem.combat.accuracy}%</div>
                          <div className="rounded border border-slate-200 bg-slate-50 p-2">SPD {subsystem.combat.speed}</div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {[1, 5, 10].map((quantity) => (
                            <Button
                              key={`${subsystem.id}-${quantity}`}
                              variant={quantity === 10 ? "default" : "outline"}
                              onClick={() => handleTrain(subsystem, quantity)}
                              disabled={trainUnitMutation.isPending || availableCapacity < quantity}
                            >
                              Train {quantity}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900"><Shield className="w-5 h-5 text-blue-600" /> Infrastructure Envelope</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Shipyard level {buildings.shipyard} drives pilot throughput and vehicle crew qualification.</div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Research Lab level {buildings.researchLab} unlocks advanced doctrine, tactics, and officer schooling.</div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Robotics Factory level {buildings.roboticsFactory} expands mech, siege, and heavy support training logistics.</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-slate-900">Training Pipeline Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">Capacity is modeled as a live personnel ceiling so you can see whether new troops fit into your current academy network.</div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Pilot and officer tracks feed directly into fleet staffing on the fleet command page.</div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Shock and black ops tracks are intended for planetary invasions and occupation enforcement missions.</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Active Training Pipeline</CardTitle>
                <CardDescription>{inProgressTrainings.length} programs in progress — {activePipelineCount} personnel in training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressTrainings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Timer className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No active training programs. Select a track above to begin.
                  </div>
                ) : (
                  inProgressTrainings.map((training) => (
                    <div key={training.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{training.quantity}x</Badge>
                          <span className="font-semibold text-slate-900">{training.subsystemName}</span>
                        </div>
                        <Badge className={cn(
                          training.status === "in_progress" && "bg-amber-100 text-amber-800",
                          training.status === "paused" && "bg-slate-100 text-slate-800",
                          training.status === "completed" && "bg-emerald-100 text-emerald-800",
                        )}>{training.status.replace("_", " ")}</Badge>
                      </div>
                      <TrainingProgressBar training={training} />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={training.status !== "in_progress"}>Pause</Button>
                        <Button size="sm" variant="outline" disabled={training.status !== "in_progress"}>Cancel</Button>
                        <Button size="sm" disabled={training.status !== "in_progress"}>Expedite</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {completedTrainings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Recently Completed</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completedTrainings.map((training) => (
                    <div key={training.id} className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{training.quantity}x {training.subsystemName}</div>
                        <div className="text-xs text-slate-500">Completed {new Date(training.completesAt).toLocaleDateString()}</div>
                      </div>
                      <Badge className="bg-emerald-500"><CheckCircle className="w-3 h-3 mr-1" /> Done</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Total Personnel in Pipeline</div><div className="text-2xl font-bold text-amber-700">{activePipelineCount.toLocaleString()}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Active Programs</div><div className="text-2xl font-bold text-blue-700">{inProgressTrainings.length}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Avg Training Duration</div><div className="text-2xl font-bold text-slate-700">{inProgressTrainings.length > 0 ? "~4 days" : "N/A"}</div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="specializations" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> Specialization Branches</CardTitle>
                <CardDescription>Assign trained personnel to specialization branches to unlock stat bonuses and advanced capabilities.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant={specializationFilter === null ? "default" : "outline"} onClick={() => setSpecializationFilter(null)}>All</Button>
                  {SPECIALIZATION_BRANCHES.map((branch) => (
                    <Button key={branch.id} size="sm" variant={specializationFilter === branch.id ? "default" : "outline"} onClick={() => setSpecializationFilter(branch.id)}>{branch.name}</Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSpecializations.map((branch) => (
                    <Card key={branch.id} className={cn(specializationFilter === branch.id && "ring-2 ring-primary")}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Star className="w-4 h-4" /> {branch.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="text-emerald-700 font-semibold">{branch.bonuses}</div>
                        <Progress value={50 + Math.random() * 40} className="h-2 mt-2" />
                        <div className="flex justify-between text-slate-500 pt-1">
                          <span>Branch Progress</span>
                          <span>Tier 2 / 5</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Assigned Personnel</span>
                          <span className="font-semibold">{Math.floor(Math.random() * 500 + 50).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Bonuses</span>
                          <Badge variant="outline" className="text-[10px]">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graduates" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Total Graduates</div><div className="text-2xl font-bold text-slate-900">{graduates.length.toLocaleString()}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Avg Performance</div><div className="text-2xl font-bold text-emerald-700">{averagePerformance}%</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-slate-500">Top Specialization</div><div className="text-2xl font-bold text-purple-700 capitalize">{graduates.length > 0 ? graduates.sort((a, b) => b.performance - a.performance)[0].specialization : "N/A"}</div></CardContent></Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Recent Graduates</CardTitle>
                <CardDescription>Top-performing units that completed training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {graduates.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No graduates yet.</div>
                ) : (
                  graduates.map((grad) => (
                    <div key={grad.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold",
                          grad.performance >= 90 ? "bg-purple-500" : grad.performance >= 80 ? "bg-blue-500" : "bg-slate-500"
                        )}>{grad.performance}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{grad.name}</div>
                          <div className="text-xs text-slate-500">{grad.subsystemName} — {grad.specialization}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <div>Graduated</div>
                        <div>{new Date(grad.graduatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div className="text-xs text-blue-600 uppercase">Track Completion Rate</div><div className="text-2xl font-bold text-blue-900">{completedTrainings.length > 0 ? "100%" : "0%"}</div></CardContent></Card>
              <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><div className="text-xs text-emerald-600 uppercase">Graduate Performance Avg</div><div className="text-2xl font-bold text-emerald-900">{averagePerformance}%</div></CardContent></Card>
              <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><div className="text-xs text-amber-600 uppercase">Training Efficiency</div><div className="text-2xl font-bold text-amber-900">+{Math.floor(commanderLevel * 2.5)}%</div></CardContent></Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Training Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {SPECIALIZATION_BRANCHES.map((branch) => (
                  <div key={branch.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-900">{branch.name}</span>
                      <span className="text-slate-500">{Math.floor(Math.random() * 25 + 5)}%</span>
                    </div>
                    <Progress value={Math.random() * 80 + 10} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Throughput Over Time</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-500">This Week</div>
                  <div className="text-xl font-bold text-slate-900">{Math.floor(Math.random() * 200 + 50).toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-500">This Month</div>
                  <div className="text-xl font-bold text-slate-900">{Math.floor(Math.random() * 800 + 200).toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-500">All Time</div>
                  <div className="text-xl font-bold text-slate-900">{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
