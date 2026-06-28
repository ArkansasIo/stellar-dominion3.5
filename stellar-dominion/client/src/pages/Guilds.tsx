import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Coins, LogOut, Shield, Sword, Users } from "lucide-react";

type GuildRecord = {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  level: number | null;
  totalMembers: number | null;
  treasury: number | null;
  influence: number | null;
  maxMembers: number | null;
  isRecruiting: boolean | null;
  membership?: {
    id: string;
    role: string;
    joinedAt: string;
    contributedCurrency: number | null;
    contributedResearch: number | null;
  };
};

type GuildMemberRecord = {
  id: string;
  playerId: string;
  playerName: string | null;
  role: string;
  joinedAt: string;
  contributedCurrency: number | null;
  contributedResearch: number | null;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload as T;
}

export default function Guilds() {
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [guildName, setGuildName] = useState("");
  const [guildDescription, setGuildDescription] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: playerGuild = null, isLoading: isLoadingPlayerGuild } = useQuery<GuildRecord | null>({
    queryKey: ["player-guild"],
    queryFn: () => fetchJson<GuildRecord | null>("/api/guilds/mine").catch(() => null),
  });

  const { data: guildDirectory = [], isLoading: isLoadingDirectory } = useQuery<GuildRecord[]>({
    queryKey: ["guild-directory"],
    queryFn: () => fetchJson<GuildRecord[]>("/api/guilds"),
  });

  const activeGuildId = playerGuild?.id || selectedGuildId;
  const activeGuild = useMemo(() => {
    if (playerGuild) {
      return playerGuild;
    }
    return guildDirectory.find((guild) => guild.id === selectedGuildId) || null;
  }, [guildDirectory, playerGuild, selectedGuildId]);

  const { data: members = [], isLoading: isLoadingMembers } = useQuery<GuildMemberRecord[]>({
    queryKey: ["guild-members", activeGuildId],
    queryFn: () =>
      activeGuildId
        ? fetchJson<GuildMemberRecord[]>(`/api/guilds/${activeGuildId}/members`).catch(() => [])
        : Promise.resolve([]),
    enabled: !!activeGuildId,
  });

  const recruitingGuilds = guildDirectory.filter((guild) => Boolean(guild.isRecruiting)).length;
  const totalDirectoryMembers = guildDirectory.reduce((sum, guild) => sum + (guild.totalMembers ?? 0), 0);
  const totalInfluence = guildDirectory.reduce((sum, guild) => sum + (guild.influence ?? 0), 0);

  const refreshGuildData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["player-guild"] }),
      queryClient.invalidateQueries({ queryKey: ["guild-directory"] }),
      queryClient.invalidateQueries({ queryKey: ["guild-members"] }),
    ]);
  };

  const createGuildMutation = useMutation({
    mutationFn: () =>
      fetchJson<GuildRecord>("/api/guilds", {
        method: "POST",
        body: JSON.stringify({ name: guildName, description: guildDescription }),
      }),
    onSuccess: async (guild) => {
      toast({ title: "Guild founded", description: `${guild.name} is now active.` });
      setGuildName("");
      setGuildDescription("");
      setSelectedGuildId(guild.id);
      await refreshGuildData();
    },
    onError: (error: Error) => {
      toast({ title: "Unable to create guild", description: error.message, variant: "destructive" });
    },
  });

  const joinGuildMutation = useMutation({
    mutationFn: (guildId: string) => fetchJson<GuildRecord>(`/api/guilds/${guildId}/join`, { method: "POST" }),
    onSuccess: async (guild) => {
      toast({ title: "Joined guild", description: `Welcome to ${guild.name}.` });
      setSelectedGuildId(guild.id);
      await refreshGuildData();
    },
    onError: (error: Error) => {
      toast({ title: "Unable to join guild", description: error.message, variant: "destructive" });
    },
  });

  const leaveGuildMutation = useMutation({
    mutationFn: (guildId: string) => fetchJson<{ left: boolean; disbanded: boolean }>(`/api/guilds/${guildId}/leave`, { method: "POST" }),
    onSuccess: async (result) => {
      toast({
        title: result.disbanded ? "Guild disbanded" : "Guild left",
        description: result.disbanded ? "Your guild has been dissolved." : "You have left the guild roster.",
      });
      setSelectedGuildId(null);
      await refreshGuildData();
    },
    onError: (error: Error) => {
      toast({ title: "Unable to leave guild", description: error.message, variant: "destructive" });
    },
  });

  const submitCreateGuild = () => {
    if (guildName.trim().length < 3) {
      toast({ title: "Invalid guild name", description: "Use at least 3 characters.", variant: "destructive" });
      return;
    }

    createGuildMutation.mutate();
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500" data-testid="guilds-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Guild Command
            </h1>
            <p className="text-muted-foreground font-rajdhani text-lg mt-1">
              Create a guild, browse active organizations, and manage your roster from one place.
            </p>
          </div>

          {playerGuild && (
            <Button
              variant="outline"
              onClick={() => leaveGuildMutation.mutate(playerGuild.id)}
              disabled={leaveGuildMutation.isPending}
              data-testid="button-leave-guild"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {leaveGuildMutation.isPending ? "Leaving..." : "Leave Guild"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Guilds Listed</div><div className="text-2xl font-orbitron font-bold text-slate-900">{guildDirectory.length}</div></CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Recruiting</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{recruitingGuilds}</div></CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Directory Members</div><div className="text-2xl font-orbitron font-bold text-blue-700">{totalDirectoryMembers.toLocaleString()}</div></CardContent></Card>
          <Card className="bg-white border-slate-200 shadow-sm"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Guild Influence</div><div className="text-2xl font-orbitron font-bold text-purple-700">{totalInfluence.toLocaleString()}</div></CardContent></Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Guild Operations Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Recruit around role gaps first to stabilize treasury and research contributions.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Track member contribution trends weekly and rotate mission ownership accordingly.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Use roster visibility before joining to avoid overfilled low-growth organizations.</div>
          </CardContent>
        </Card>

        {playerGuild ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Members</div>
                  <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {playerGuild.totalMembers ?? 0}/{playerGuild.maxMembers ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xs text-amber-700 uppercase tracking-wider">Treasury</div>
                  <div className="mt-2 text-2xl font-orbitron font-bold text-amber-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    {(playerGuild.treasury ?? 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xs text-purple-700 uppercase tracking-wider">Influence</div>
                  <div className="mt-2 text-2xl font-orbitron font-bold text-purple-900">{(playerGuild.influence ?? 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xs text-emerald-700 uppercase tracking-wider">Recruitment</div>
                  <div className="mt-2">
                    <Badge className={playerGuild.isRecruiting ? "bg-emerald-600" : "bg-slate-500"}>
                      {playerGuild.isRecruiting ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl font-orbitron text-slate-900">{playerGuild.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-2">{playerGuild.description || "No guild charter has been published yet."}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{playerGuild.membership?.role || "member"}</Badge>
                    <Badge className="bg-primary">Level {playerGuild.level ?? 1}</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-orbitron text-slate-900">Guild Roster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingMembers && <p className="text-sm text-slate-500">Loading guild roster...</p>}
                {!isLoadingMembers && members.length === 0 && <p className="text-sm text-slate-500">No roster entries found.</p>}
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <div className="font-semibold text-slate-900">{member.playerName || "Unknown Commander"}</div>
                      <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">{member.role}</div>
                    </div>
                    <div className="text-sm text-slate-600 text-right">
                      <div>Currency contributed: {(member.contributedCurrency ?? 0).toLocaleString()}</div>
                      <div>Research contributed: {(member.contributedResearch ?? 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-orbitron text-slate-900">Found a Guild</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guild Name</label>
                  <Input
                    value={guildName}
                    onChange={(event) => setGuildName(event.target.value)}
                    placeholder="Enter a guild name"
                    className="bg-slate-50 border-slate-200"
                    data-testid="input-guild-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guild Charter</label>
                  <Textarea
                    value={guildDescription}
                    onChange={(event) => setGuildDescription(event.target.value)}
                    placeholder="Describe your guild's mission, doctrine, and recruiting pitch"
                    className="min-h-[140px] bg-slate-50 border-slate-200"
                    data-testid="input-guild-description"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={submitCreateGuild}
                  disabled={createGuildMutation.isPending}
                  data-testid="button-create-guild"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  {createGuildMutation.isPending ? "Creating Guild..." : "Create Guild"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-orbitron text-slate-900">Guild Directory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isLoadingPlayerGuild || isLoadingDirectory) && <p className="text-sm text-slate-500">Loading guild directory...</p>}
                {!isLoadingDirectory && guildDirectory.length === 0 && <p className="text-sm text-slate-500">No guilds have been founded yet.</p>}
                {guildDirectory.map((guild) => (
                  <div
                    key={guild.id}
                    className={`rounded-lg border px-4 py-4 transition-colors ${selectedGuildId === guild.id ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{guild.name}</h3>
                          <Badge className={guild.isRecruiting ? "bg-emerald-600" : "bg-slate-500"}>
                            {guild.isRecruiting ? "Recruiting" : "Closed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{guild.description || "No guild charter available."}</p>
                      </div>
                      <div className="text-sm text-slate-600 md:text-right">
                        <div>Level {guild.level ?? 1}</div>
                        <div>{guild.totalMembers ?? 0}/{guild.maxMembers ?? 0} members</div>
                        <div>{(guild.influence ?? 0).toLocaleString()} influence</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedGuildId(guild.id)} data-testid={`button-view-guild-${guild.id}`}>
                        View Roster
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => joinGuildMutation.mutate(guild.id)}
                        disabled={joinGuildMutation.isPending || !guild.isRecruiting}
                        data-testid={`button-join-guild-${guild.id}`}
                      >
                        {joinGuildMutation.isPending && selectedGuildId === guild.id ? "Joining..." : "Join Guild"}
                      </Button>
                    </div>
                  </div>
                ))}

                {selectedGuildId && !playerGuild && (
                  <Card className="border-slate-200 bg-slate-50 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-sm font-orbitron text-slate-900">
                        {activeGuild?.name || "Selected Guild"} Roster
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isLoadingMembers && <p className="text-sm text-slate-500">Loading roster...</p>}
                      {!isLoadingMembers && members.length === 0 && <p className="text-sm text-slate-500">No member records found.</p>}
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-2">
                          <div>
                            <div className="font-medium text-slate-900">{member.playerName || "Unknown Commander"}</div>
                            <div className="text-xs uppercase tracking-wide text-slate-500">{member.role}</div>
                          </div>
                          <div className="text-xs text-slate-500">+{(member.contributedCurrency ?? 0).toLocaleString()} currency</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
