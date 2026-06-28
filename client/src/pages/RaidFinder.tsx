import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Users } from "lucide-react";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type RaidRole = "tank" | "dps" | "healer" | "support";

type RaidFinderPlayer = {
  userId: string;
  preferredRole: RaidRole;
  joinedAt: string;
};

type RoleSummary = {
  role: RaidRole;
  queued: number;
  avgWait: number;
};

type RaidFinderResponse = {
  queue: RaidFinderPlayer[];
  roleSummary: RoleSummary[];
  queued: boolean;
  position: number | null;
  myEntry: RaidFinderPlayer | null;
};

type RaidCommanderProfile = {
  career: {
    level: number;
    rating: number;
    rank: string;
    specialization: RaidRole;
  };
  rolePower: Record<RaidRole, number>;
  recommendedRole: RaidRole;
  winRate: number;
  casualtyEfficiency: number;
};

const roles: RaidRole[] = ["tank", "dps", "healer", "support"];

const roleBadgeClass: Record<RaidRole, string> = {
  tank: "bg-blue-100 text-blue-800 border-blue-200",
  dps: "bg-red-100 text-red-800 border-red-200",
  healer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  support: "bg-violet-100 text-violet-800 border-violet-200",
};

async function fetchFinderState(): Promise<RaidFinderResponse> {
  const response = await fetch("/api/raid-finder/queue", { credentials: "include" });
  if (!response.ok) {
    throw new Error("Failed to load raid finder");
  }
  return response.json();
}

async function updateQueue(preferredRole: RaidRole) {
  const response = await fetch("/api/raid-finder/queue", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferredRole }),
  });

  if (!response.ok) {
    throw new Error("Failed to join raid finder queue");
  }

  return response.json();
}

async function leaveQueue() {
  const response = await fetch("/api/raid-finder/queue", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to leave raid finder queue");
  }

  return response.json();
}

async function requestMatch() {
  const response = await fetch("/api/raid-finder/match", {
    method: "POST",
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "No compatible raid match found");
  return payload as { raidName: string; role: RaidRole; commanderPower: number };
}

export default function RaidFinder() {
  const [preferredRole, setPreferredRole] = useState<RaidRole>("dps");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<RaidFinderResponse>({
    queryKey: ["raid-finder-queue"],
    queryFn: fetchFinderState,
    refetchInterval: 5000,
  });
  const { data: commanderProfile } = useQuery<RaidCommanderProfile>({
    queryKey: ["raid-commander-profile"],
    queryFn: async () => {
      const response = await fetch("/api/raids/commander-profile", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load raid commander profile");
      return response.json();
    },
  });

  useEffect(() => {
    if (data?.myEntry?.preferredRole) {
      setPreferredRole(data.myEntry.preferredRole);
    }
  }, [data?.myEntry?.preferredRole]);

  const joinQueueMutation = useMutation({
    mutationFn: updateQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["raid-finder-queue"] });
      toast({ title: "Queue updated", description: `You are queued as ${preferredRole}.` });
    },
    onError: (error: Error) => {
      toast({ title: "Queue failed", description: error.message, variant: "destructive" });
    },
  });

  const leaveQueueMutation = useMutation({
    mutationFn: leaveQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["raid-finder-queue"] });
      toast({ title: "Queue cleared", description: "You left the raid finder queue." });
    },
    onError: (error: Error) => {
      toast({ title: "Leave failed", description: error.message, variant: "destructive" });
    },
  });
  const matchMutation = useMutation({
    mutationFn: requestMatch,
    onSuccess: async (match) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["raid-finder-queue"] }),
        queryClient.invalidateQueries({ queryKey: ["raids"] }),
      ]);
      toast({ title: "Raid match found", description: `${match.raidName} • ${match.role} • Power ${match.commanderPower.toLocaleString()}` });
    },
    onError: (error: Error) => {
      toast({ title: "Match unavailable", description: error.message, variant: "destructive" });
    },
  });

  const queue = data?.queue ?? [];
  const roleSummary = data?.roleSummary ?? [];
  const isQueued = data?.queued ?? false;
  const myPosition = data?.position ?? null;

  const summaryByRole = useMemo(() => {
    return roles.reduce<Record<RaidRole, RoleSummary>>((acc, role) => {
      acc[role] = roleSummary.find((entry) => entry.role === role) ?? { role, queued: 0, avgWait: 1 };
      return acc;
    }, {} as Record<RaidRole, RoleSummary>);
  }, [roleSummary]);

  const estimatedWaitMinutes = Math.max(
    1,
    isQueued && myPosition ? Math.ceil(myPosition / 4) : Math.ceil(queue.length / 4 || 1)
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="raid-finder-page">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src={BACKGROUND_ASSETS.COMBAT.path} alt="Raid Finder" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="flex gap-2 items-center">
              <img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="Fighter" className="w-12 h-12 object-contain" />
              <img src={SHIP_ASSETS.FIGHTERS.INTERCEPTOR.path} alt="Interceptor" className="w-12 h-12 object-contain" />
              <img src={MENU_ASSETS.NAVIGATION.MILITARY.path} alt="Military" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white drop-shadow">Raid Finder</h1>
              <p className="text-blue-300 font-rajdhani text-lg">Queue into coordinated groups, fill missing roles, and track live matchmaking pressure.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Queued Players</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900">{queue.length}</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-indigo-700">Estimated Wait</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-indigo-900">~{estimatedWaitMinutes}m</div>
            </CardContent>
          </Card>
          <Card className="border-sky-200 bg-sky-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-sky-700">Preferred Role</div>
              <div className="mt-2 text-2xl font-orbitron font-bold capitalize text-sky-900">{preferredRole}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-700">Role Shortage</div>
              <div className="mt-2 text-2xl font-orbitron font-bold capitalize text-emerald-900">
                {roles.reduce((lowest, role) =>
                  summaryByRole[role].queued < summaryByRole[lowest].queued ? role : lowest
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {commanderProfile && (
          <Card className="border-cyan-200 bg-cyan-50 shadow-sm">
            <CardContent className="grid gap-4 p-4 md:grid-cols-5">
              <div><div className="text-xs uppercase text-cyan-700">Raid Rank</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.rank}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Rating</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.rating}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Selected Power</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.rolePower[preferredRole].toLocaleString()}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Recommended</div><div className="font-orbitron font-bold capitalize text-cyan-950">{commanderProfile.recommendedRole}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Win / Saves</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.winRate}% / {commanderProfile.casualtyEfficiency}%</div></div>
            </CardContent>
          </Card>
        )}

        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Matchmaking Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-indigo-900 md:grid-cols-3">
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Queue into low-population roles first to cut launch delays for the whole operation.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Requeue role preference when your group lacks sustain or frontline presence.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Elite raids favor composition quality over join order, so role balance matters more than speed.
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr,1fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-orbitron text-slate-900">Queue Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {roles.map((role) => (
                  <Button
                    key={role}
                    variant={preferredRole === role ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => setPreferredRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Your Queue State</div>
                    <div className="mt-2 text-lg font-orbitron font-bold text-slate-900">
                      {isQueued ? `Queued as ${data?.myEntry?.preferredRole ?? preferredRole}` : "Not in queue"}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {isQueued
                        ? `Current queue position: ${myPosition ?? "-"}`
                        : "Choose a role and join the finder to start receiving group matches."}
                    </p>
                  </div>
                  <Badge variant="outline" className={roleBadgeClass[preferredRole]}>
                    {preferredRole}
                  </Badge>
                </div>
              </div>

              {isQueued ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={() => matchMutation.mutate()} disabled={matchMutation.isPending} data-testid="button-find-raid-match">
                    {matchMutation.isPending ? "Matching..." : "Find Compatible Raid"}
                  </Button>
                  <Button variant="destructive" onClick={() => leaveQueueMutation.mutate()} disabled={leaveQueueMutation.isPending} data-testid="button-leave-queue">
                    {leaveQueueMutation.isPending ? "Leaving Queue..." : "Leave Queue"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => joinQueueMutation.mutate(preferredRole)}
                  disabled={joinQueueMutation.isPending}
                  data-testid="button-join-queue"
                >
                  {joinQueueMutation.isPending ? "Joining Queue..." : `Join Queue as ${preferredRole}`}
                </Button>
              )}

              {(isLoading || joinQueueMutation.isPending || leaveQueueMutation.isPending) && (
                <div className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-slate-500">Synchronizing raid finder status...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-orbitron text-slate-900">Role Demand Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold capitalize text-slate-900">{role}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500">
                        Avg wait {summaryByRole[role].avgWait}m
                      </div>
                    </div>
                    <Badge variant="outline" className={roleBadgeClass[role]}>
                      {summaryByRole[role].queued} queued
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-orbitron text-slate-900">Queue Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {queue.length === 0 && !isLoading && (
                  <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
                    No commanders are queued right now.
                  </div>
                )}

                {queue.slice(0, 10).map((player, index) => (
                  <div
                    key={`${player.userId}-${player.joinedAt}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Commander #{index + 1}</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Joined {new Date(player.joinedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={roleBadgeClass[player.preferredRole]}>
                      {player.preferredRole}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
