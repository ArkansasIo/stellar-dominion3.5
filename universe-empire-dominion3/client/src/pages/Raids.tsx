import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Flame,
  ShieldAlert,
  Swords,
  TimerReset,
  Users,
} from "lucide-react";

type RaidStatus = "preparing" | "active" | "completed";
type RaidType = "guild_war" | "pvp_team" | "boss_raid" | "stronghold_attack";
type RaidRole = "tank" | "dps" | "healer" | "support";

type RaidParticipant = {
  playerId: string;
  role: RaidRole;
  joinedAt: string;
};

type RaidRecord = {
  id: string;
  attackingTeamName: string;
  defendingTeamName: string;
  raidType: RaidType;
  status: RaidStatus;
  result: "attacker_victory" | "defender_victory" | "tie" | null;
  attackerLosses?: { units?: number | null } | null;
  defenderLosses?: { units?: number | null } | null;
  startedAt?: string;
  completedAt?: string;
  minimumCommanders: number;
  maxCommanders: number;
  powerRequirement: number;
  rewards: { credits: number; metal: number; crystal: number };
  participants: RaidParticipant[];
  joined: boolean;
  joinedPlayers: number;
  canLaunch: boolean;
};

type RaidCommanderProfile = {
  career: {
    level: number;
    experience: number;
    experienceToNextLevel: number;
    rating: number;
    rank: string;
    specialization: RaidRole;
    participations: number;
    victories: number;
    bossKills: number;
    unitsLost: number;
    unitsSaved: number;
    commendations: number;
    streak: number;
    unlockedPerks: string[];
  };
  rolePower: Record<RaidRole, number>;
  recommendedRole: RaidRole;
  winRate: number;
  casualtyEfficiency: number;
};

const raidFilters: Array<{ value: "all" | RaidType; label: string }> = [
  { value: "all", label: "All Raids" },
  { value: "guild_war", label: "Guild War" },
  { value: "pvp_team", label: "PVP Team" },
  { value: "boss_raid", label: "Boss Raid" },
  { value: "stronghold_attack", label: "Stronghold" },
];

const raidRoles: RaidRole[] = ["tank", "dps", "healer", "support"];

const statusBadgeClass: Record<RaidStatus, string> = {
  preparing: "bg-amber-100 text-amber-800 border-amber-200",
  active: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const resultTextClass: Record<NonNullable<RaidRecord["result"]>, string> = {
  attacker_victory: "text-emerald-700",
  defender_victory: "text-blue-700",
  tie: "text-amber-700",
};

const roleBadgeClass: Record<RaidRole, string> = {
  tank: "bg-blue-100 text-blue-800 border-blue-200",
  dps: "bg-red-100 text-red-800 border-red-200",
  healer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  support: "bg-violet-100 text-violet-800 border-violet-200",
};

async function fetchRaids(): Promise<RaidRecord[]> {
  const response = await fetch("/api/raids", { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to load raids");
  }
  return response.json();
}

async function mutateRaid<T>(url: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || payload.message || "Raid action failed");
  }
  return payload as T;
}

function formatRaidType(type: RaidType | "all") {
  return type === "all" ? "All Raids" : type.replace(/_/g, " ");
}

function formatTimestamp(value?: string) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

export default function Raids() {
  const [raidType, setRaidType] = useState<"all" | RaidType>("all");
  const [selectedRaidId, setSelectedRaidId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RaidRole>("dps");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: raids = [], isLoading } = useQuery<RaidRecord[]>({
    queryKey: ["raids"],
    queryFn: fetchRaids,
  });
  const { data: commanderProfile } = useQuery<RaidCommanderProfile>({
    queryKey: ["raid-commander-profile"],
    queryFn: async () => {
      const response = await fetch("/api/raids/commander-profile", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load raid commander profile");
      return response.json();
    },
  });

  const filteredRaids = useMemo(
    () => (raidType === "all" ? raids : raids.filter((raid) => raid.raidType === raidType)),
    [raidType, raids]
  );

  const selectedRaid =
    filteredRaids.find((raid) => raid.id === selectedRaidId) ?? filteredRaids[0] ?? null;

  const refreshRaids = async () => {
    await queryClient.invalidateQueries({ queryKey: ["raids"] });
  };

  const joinRaidMutation = useMutation({
    mutationFn: (raidId: string) => mutateRaid(`/api/raids/${raidId}/join`, { role: selectedRole }),
    onSuccess: async () => {
      await refreshRaids();
      toast({ title: "Raid joined", description: `Role locked in as ${selectedRole}.` });
    },
    onError: (error: Error) => {
      toast({ title: "Join failed", description: error.message, variant: "destructive" });
    },
  });

  const leaveRaidMutation = useMutation({
    mutationFn: (raidId: string) => mutateRaid(`/api/raids/${raidId}/leave`),
    onSuccess: async () => {
      await refreshRaids();
      toast({ title: "Raid exited", description: "You were removed from the preparation roster." });
    },
    onError: (error: Error) => {
      toast({ title: "Leave failed", description: error.message, variant: "destructive" });
    },
  });

  const launchRaidMutation = useMutation({
    mutationFn: (raidId: string) => mutateRaid<{ message?: string }>(`/api/raids/${raidId}/launch`),
    onSuccess: async (result) => {
      await refreshRaids();
      toast({ title: "Raid launched", description: result.message || "Fleet deployment initiated." });
    },
    onError: (error: Error) => {
      toast({ title: "Launch failed", description: error.message, variant: "destructive" });
    },
  });

  const resolveRaidMutation = useMutation({
    mutationFn: (raidId: string) => mutateRaid<{ message?: string }>(`/api/raids/${raidId}/resolve`),
    onSuccess: async (result) => {
      await Promise.all([
        refreshRaids(),
        queryClient.invalidateQueries({ queryKey: ["raid-commander-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/game/state"] }),
      ]);
      toast({ title: "Raid resolved", description: result.message || "Outcome recorded." });
    },
    onError: (error: Error) => {
      toast({ title: "Resolve failed", description: error.message, variant: "destructive" });
    },
  });

  const activeRaids = raids.filter((raid) => raid.status === "active").length;
  const preparingRaids = raids.filter((raid) => raid.status === "preparing").length;
  const completedRaids = raids.filter((raid) => raid.status === "completed").length;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="raids-page">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-orbitron text-3xl font-bold text-slate-900">
              <Flame className="h-8 w-8 text-red-600" />
              Raid Operations
            </h1>
            <p className="mt-1 font-rajdhani text-lg text-muted-foreground">
              Monitor active assault windows, casualty trends, and coordinated strike targets.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Current Filter</div>
            <div className="mt-1 font-rajdhani text-lg font-semibold uppercase tracking-wider text-slate-900">
              {formatRaidType(raidType)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Total Raids</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900">{raids.length}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-amber-700">Preparing</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-amber-900">{preparingRaids}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-red-700">Active</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-red-900">{activeRaids}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-700">Completed</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-emerald-900">{completedRaids}</div>
            </CardContent>
          </Card>
        </div>

        {commanderProfile && (
          <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm">
            <CardContent className="grid gap-4 p-5 md:grid-cols-3 xl:grid-cols-6">
              <div><div className="text-xs uppercase text-cyan-700">Raid Rank</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.rank}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Rating</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.rating}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Specialization</div><div className="font-orbitron font-bold capitalize text-cyan-950">{commanderProfile.career.specialization}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Win Rate</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.winRate}%</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Casualty Saves</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.unitsSaved.toLocaleString()}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Commendations</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.commendations}</div></div>
            </CardContent>
          </Card>
        )}

        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Raid Operations Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-indigo-900 md:grid-cols-3">
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Stage reinforcement-capable teams in preparation windows before hostile raids flip active.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Compare casualty totals against the result field to spot expensive wins and unstable fronts.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Push unmatched commanders through Raid Finder when a preparing raid lacks enough bodies to launch.
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {raidFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={raidType === filter.value ? "default" : "outline"}
              onClick={() => setRaidType(filter.value)}
              className="capitalize"
              data-testid={`button-filter-raid-${filter.value}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr,1fr]">
          <div className="space-y-4">
            {isLoading && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 text-sm text-slate-500">Loading raid operations...</CardContent>
              </Card>
            )}

            {!isLoading && filteredRaids.length === 0 && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-10 text-center text-slate-500">
                  No raids match the current filter.
                </CardContent>
              </Card>
            )}

            {filteredRaids.map((raid) => {
              const attackerLosses = Number(raid.attackerLosses?.units || 0);
              const defenderLosses = Number(raid.defenderLosses?.units || 0);
              const totalLosses = attackerLosses + defenderLosses;
              const isSelected = selectedRaid?.id === raid.id;

              return (
                <Card
                  key={raid.id}
                  className={`border shadow-sm transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl font-orbitron text-slate-900">
                          <Swords className="h-5 w-5 text-primary" />
                          {raid.attackingTeamName} vs {raid.defendingTeamName}
                        </CardTitle>
                        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                          {formatRaidType(raid.raidType)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {raid.joined && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Joined</Badge>}
                        <Badge variant="outline" className={statusBadgeClass[raid.status]}>
                          {raid.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Attacker Losses</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-red-700">
                          {attackerLosses.toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Severity</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">
                          {totalLosses.toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Roster</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-slate-900">
                          {raid.joinedPlayers}/{raid.maxCommanders}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Defender Losses</div>
                        <div className="mt-2 text-xl font-orbitron font-bold text-blue-700">
                          {defenderLosses.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-slate-600">
                        Result:{" "}
                        <span className={raid.result ? resultTextClass[raid.result] : "text-slate-500"}>
                          {raid.result ? raid.result.replace(/_/g, " ") : "Pending resolution"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => setSelectedRaidId(raid.id)}
                        data-testid={`button-view-raid-${raid.id}`}
                      >
                        {isSelected ? "Inspecting" : "View Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron text-slate-900">Raid Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!selectedRaid ? (
                <p className="text-slate-500">
                  Select a raid to inspect operational timing, casualty balance, and follow-up actions.
                </p>
              ) : (
                <>
                  <div>
                    <div className="font-orbitron text-lg font-bold text-slate-900">
                      {selectedRaid.attackingTeamName}
                    </div>
                    <div className="mt-1 text-slate-500">Targeting {selectedRaid.defendingTeamName}</div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <ShieldAlert className="h-4 w-4 text-slate-400" />
                        Operation Summary
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Type: {formatRaidType(selectedRaid.raidType)}</div>
                        <div>Status: {selectedRaid.status}</div>
                        <div>Minimum commanders: {selectedRaid.minimumCommanders}</div>
                        <div>Power requirement: {selectedRaid.powerRequirement.toLocaleString()}</div>
                        <div>Result: {selectedRaid.result ? selectedRaid.result.replace(/_/g, " ") : "Pending"}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Users className="h-4 w-4 text-slate-400" />
                        Roster Control
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {raidRoles.map((role) => (
                            <Button
                              key={role}
                              size="sm"
                              variant={selectedRole === role ? "default" : "outline"}
                              className="capitalize"
                              onClick={() => setSelectedRole(role)}
                            >
                              {role}
                            </Button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRaid.status === "preparing" && !selectedRaid.joined && (
                            <Button
                              onClick={() => joinRaidMutation.mutate(selectedRaid.id)}
                              disabled={joinRaidMutation.isPending}
                              data-testid={`button-join-raid-${selectedRaid.id}`}
                            >
                              Join Raid
                            </Button>
                          )}
                          {selectedRaid.status === "preparing" && selectedRaid.joined && (
                            <Button
                              variant="outline"
                              onClick={() => leaveRaidMutation.mutate(selectedRaid.id)}
                              disabled={leaveRaidMutation.isPending}
                              data-testid={`button-leave-raid-${selectedRaid.id}`}
                            >
                              Leave Raid
                            </Button>
                          )}
                          {selectedRaid.status === "preparing" && selectedRaid.joined && (
                            <Button
                              variant="outline"
                              onClick={() => launchRaidMutation.mutate(selectedRaid.id)}
                              disabled={launchRaidMutation.isPending || !selectedRaid.canLaunch}
                              data-testid={`button-launch-raid-${selectedRaid.id}`}
                            >
                              Launch Raid
                            </Button>
                          )}
                          {selectedRaid.status === "active" && (
                            <Button
                              onClick={() => resolveRaidMutation.mutate(selectedRaid.id)}
                              disabled={resolveRaidMutation.isPending}
                              data-testid={`button-resolve-raid-${selectedRaid.id}`}
                            >
                              Resolve Raid
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <TimerReset className="h-4 w-4 text-slate-400" />
                        Timeline
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Started: {formatTimestamp(selectedRaid.startedAt)}</div>
                        <div>Resolved: {formatTimestamp(selectedRaid.completedAt)}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        Casualty Spread
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Attacker losses: {Number(selectedRaid.attackerLosses?.units || 0).toLocaleString()}</div>
                        <div>Defender losses: {Number(selectedRaid.defenderLosses?.units || 0).toLocaleString()}</div>
                        <div>Credits on success: {selectedRaid.rewards.credits.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Participants</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedRaid.participants.length === 0 && (
                          <span className="text-slate-500">No commanders committed yet.</span>
                        )}
                        {selectedRaid.participants.map((participant) => (
                          <Badge
                            key={`${participant.playerId}-${participant.joinedAt}`}
                            variant="outline"
                            className={roleBadgeClass[participant.role]}
                          >
                            {participant.role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link href="/raid-finder">
                      <Button className="w-full">Open Raid Finder</Button>
                    </Link>
                    <Link href="/battle-logs">
                      <Button variant="outline" className="w-full">
                        Review Battle Logs
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
