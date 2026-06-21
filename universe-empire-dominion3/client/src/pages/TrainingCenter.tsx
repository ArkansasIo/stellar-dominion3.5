import { useMemo, useState } from "react";
import { Link } from "wouter";
import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { useArmySubsystems, useMilitaryForce, useTrainUnit } from "@/hooks/useCivilizationArmy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Rocket, Shield, Swords, Users } from "lucide-react";
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

function matchesTrack(subsystem: ArmySubsystem, track: TrainingTrack) {
  const haystack = `${subsystem.name} ${subsystem.description} ${subsystem.flavorText || ""}`.toLowerCase();
  return (
    track.roles.includes(subsystem.role) ||
    track.focuses.some((focus) => haystack.includes(focus))
  );
}

export default function TrainingCenter() {
  const { commander, buildings } = useGame();
  const { toast } = useToast();
  const { data: subsystems } = useArmySubsystems();
  const { data: militaryForce } = useMilitaryForce();
  const trainUnitMutation = useTrainUnit();
  const [selectedTrackId, setSelectedTrackId] = useState(TRAINING_TRACKS[0].id);

  const selectedTrack = TRAINING_TRACKS.find((track) => track.id === selectedTrackId) || TRAINING_TRACKS[0];
  const commanderLevel = commander?.stats?.level || 1;
  const currentForce = militaryForce?.force || militaryForce || { squadrons: [] as Array<{ quantity: number }> };
  const totalPersonnel = currentForce.squadrons.reduce((sum: number, squadron: { quantity: number }) => sum + squadron.quantity, 0);

  const trainingCapacity = (buildings.shipyard * 12) + (buildings.roboticsFactory * 10) + (buildings.researchLab * 8);
  const availableCapacity = Math.max(0, trainingCapacity - totalPersonnel);

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
      <div className="space-y-6" data-testid="training-center-page">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900">Training Center</h1>
            <p className="text-slate-600">
              Unlock training tracks from your current infrastructure, expand personnel throughput, and prepare crews for fleets, invasions, and occupation duty.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/army-management"><Button variant="outline"><Users className="w-4 h-4 mr-2" /> Army Management</Button></Link>
            <Link href="/fleet"><Button variant="outline"><Rocket className="w-4 h-4 mr-2" /> Fleet Command</Button></Link>
            <Link href="/ground-combat"><Button variant="outline"><Swords className="w-4 h-4 mr-2" /> Ground Combat</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Commander Level</div>
              <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{commanderLevel}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Training Capacity</div>
              <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{trainingCapacity}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Personnel In Service</div>
              <div className="mt-2 text-3xl font-orbitron font-bold text-slate-900">{totalPersonnel}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Open Slots</div>
              <div className="mt-2 text-3xl font-orbitron font-bold text-emerald-600">{availableCapacity}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
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
                className={`rounded-lg border p-4 text-left transition ${
                  selectedTrackId === track.id ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{track.name}</div>
                  <Badge variant={track.unlocked ? "secondary" : "outline"}>{track.unlocked ? "Online" : "Locked"}</Badge>
                </div>
                <div className="mt-2 text-xs text-slate-500">{track.description}</div>
                <Progress value={track.readiness} className="mt-4 h-2" />
                <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                  {track.buildingRequirements.map((requirement) => (
                    <div key={`${track.id}-${requirement.key}`}>
                      {requirement.label}: {(buildings[requirement.key] || 0)}/{requirement.level}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card className="border-slate-200">
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
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="w-5 h-5 text-blue-600" /> Infrastructure Envelope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Shipyard level {buildings.shipyard} drives pilot throughput and vehicle crew qualification.</div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Research Lab level {buildings.researchLab} unlocks advanced doctrine, tactics, and officer schooling.</div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">Robotics Factory level {buildings.roboticsFactory} expands mech, siege, and heavy support training logistics.</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Training Pipeline Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  Capacity is modeled as a live personnel ceiling so you can quickly see whether new troops fit into your current academy network.
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  Pilot and officer tracks now feed directly into fleet staffing on the fleet command page.
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  Shock and black ops tracks are intended for planetary invasions and occupation enforcement missions.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
