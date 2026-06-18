import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { TECH_BRANCH_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, Users, LogOut, Search, Plus, Trophy, MessageSquare, Globe, 
  Swords, Handshake, Flag, Crown, Star, Target, TrendingUp, Award, 
  Settings, Bell, History
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const diplomacyStates = [
  { id: "war", name: "At War", color: "text-red-600 bg-red-50 border-red-200" },
  { id: "hostile", name: "Hostile", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "neutral", name: "Neutral", color: "text-slate-600 bg-slate-50 border-slate-200" },
  { id: "friendly", name: "Friendly", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "allied", name: "Allied", color: "text-green-600 bg-green-50 border-green-200" }
];

type DiplomacyAction = "proposeAlliance" | "openTalks" | "issueWarning" | "declareWar";

type DiplomacyRelation = {
   allianceId: string;
   allianceName: string;
   allianceTag: string;
   state: "war" | "hostile" | "neutral" | "friendly" | "allied";
   since: string;
   updatedAt: string;
   lastAction: string;
};

type WarRecord = {
   id: string;
   enemyAllianceId: string;
   enemyTag: string;
   enemyName: string;
   startDate: string;
   kills: number;
   deaths: number;
   status: "active" | "ended";
   updatedAt: string;
};

type DiplomacyResponse = {
   relations: DiplomacyRelation[];
   count: number;
};

type WarResponse = {
   wars: WarRecord[];
   count: number;
};

type AllianceDirectoryEntry = {
   id: string;
   name: string;
   tag: string;
   description: string;
   memberCount?: number;
   activeWars?: number;
};

type GuildInfo = {
   id: string;
   name: string;
   description: string;
   totalMembers?: number;
   level?: number;
   influence?: number;
   tag?: string;
};

type GuildChatMessage = {
   id: string;
   guildId: string;
   senderId: string;
   senderName: string;
   content: string;
   createdAt: number;
};

type GuildChatResponse = {
   messages: GuildChatMessage[];
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

export default function Alliance() {
  const { alliance, createAlliance, joinAlliance, leaveAlliance } = useGame();
   const { toast } = useToast();
   const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [createName, setCreateName] = useState("");
  const [createTag, setCreateTag] = useState("");
   const [targetAllianceTag, setTargetAllianceTag] = useState("");
   const [chatMessage, setChatMessage] = useState("");

   const { data: myGuild } = useQuery<GuildInfo | null>({
      queryKey: ["guild-mine"],
      queryFn: () => fetchJson<GuildInfo | null>("/api/guilds/mine"),
      enabled: !!alliance,
   });

   const { data: allianceDirectory, refetch: refetchAllianceDirectory, isFetching: isFetchingAllianceDirectory } = useQuery<AllianceDirectoryEntry[]>({
      queryKey: ["alliance-directory"],
      queryFn: () => fetchJson<AllianceDirectoryEntry[]>("/api/alliances"),
   });

   const visibleAlliances = (allianceDirectory || []).filter((entry) => {
      const key = searchQuery.trim().toLowerCase();
      if (!key) return true;
      const tag = (entry.tag || "").toLowerCase();
      const name = (entry.name || "").toLowerCase();
      return tag.includes(key) || name.includes(key);
   });

   const directoryMembers = visibleAlliances.reduce((sum, entry) => sum + (entry.memberCount || 0), 0);
   const directoryWars = visibleAlliances.reduce((sum, entry) => sum + (entry.activeWars || 0), 0);

   const { data: diplomacyData } = useQuery<DiplomacyResponse>({
      queryKey: ["alliance-diplomacy", alliance?.id],
      queryFn: () => fetchJson<DiplomacyResponse>(`/api/alliances/${alliance!.id}/diplomacy`),
      enabled: !!alliance?.id,
   });

   const { data: warsData } = useQuery<WarResponse>({
      queryKey: ["alliance-wars", alliance?.id],
      queryFn: () => fetchJson<WarResponse>(`/api/alliances/${alliance!.id}/wars`),
      enabled: !!alliance?.id,
   });

   const { data: guildChat } = useQuery<GuildChatResponse>({
      queryKey: ["guild-chat", myGuild?.id],
      queryFn: () => fetchJson<GuildChatResponse>(`/api/guilds/${myGuild!.id}/chat`),
      enabled: !!myGuild?.id,
      refetchInterval: 10000,
   });

   const sendGuildMessageMutation = useMutation({
      mutationFn: (content: string) =>
         fetchJson(`/api/guilds/${myGuild!.id}/chat`, {
            method: "POST",
            body: JSON.stringify({ content }),
         }),
      onSuccess: () => {
         setChatMessage("");
         queryClient.invalidateQueries({ queryKey: ["guild-chat", myGuild?.id] });
      },
      onError: (error: Error) => {
         toast({ title: "Message failed", description: error.message, variant: "destructive" });
      },
   });

   const diplomacyActionMutation = useMutation({
      mutationFn: ({ action, targetTag }: { action: DiplomacyAction; targetTag: string }) =>
         fetchJson<{ message: string }>(`/api/alliances/${alliance!.id}/diplomacy/actions`, {
            method: "POST",
            body: JSON.stringify({ action, targetTag }),
         }),
      onSuccess: (result) => {
         setTargetAllianceTag("");
         queryClient.invalidateQueries({ queryKey: ["alliance-diplomacy", alliance?.id] });
         queryClient.invalidateQueries({ queryKey: ["alliance-wars", alliance?.id] });
         queryClient.invalidateQueries({ queryKey: ["alliance-directory"] });
         toast({ title: "Diplomacy updated", description: result.message });
      },
      onError: (error: Error) => {
         toast({ title: "Diplomatic action failed", description: error.message, variant: "destructive" });
      },
   });

  if (alliance) {
     const totalPoints = alliance.members.reduce((acc, m) => acc + m.points, 0);
     const diplomacyRelations = diplomacyData?.relations || [];
     const warRecords = warsData?.wars || [];
     const activeWars = warRecords.filter((war) => war.status === "active");
     const allianceLeader = alliance.members.find((member) => member.rank === "leader") || alliance.members[0];
     const foundedDisplay = (alliance as any)?.createdAt ? new Date((alliance as any).createdAt).toLocaleDateString() : "Unknown";
     const territorySystems = Math.max(1, Math.round(alliance.members.length * 1.8));
     const allianceUpdates = [
        ...activeWars.slice(0, 2).map((war) => ({
           text: `War remains active against [${war.enemyTag}] ${war.enemyName}.`,
           time: new Date(war.updatedAt || war.startDate).toLocaleDateString(),
        })),
        ...diplomacyRelations.slice(0, 2).map((relation) => ({
           text: `Diplomatic status with [${relation.allianceTag}] updated to ${relation.state}.`,
           time: new Date(relation.updatedAt).toLocaleDateString(),
        })),
     ].slice(0, 4);
     
     return (
        <GameLayout>
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                       <Shield className="w-8 h-8 text-primary" />
                       <h2 className="text-3xl font-orbitron font-bold text-slate-900">[{alliance.tag}] {alliance.name}</h2>
                    </div>
                    <p className="text-muted-foreground font-rajdhani text-lg">Alliance Command Center</p>
                 </div>
                 <Button variant="destructive" onClick={leaveAlliance} data-testid="button-leave-alliance">
                    <LogOut className="w-4 h-4 mr-2" /> Leave Alliance
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-members">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                        <img src={TECH_BRANCH_ASSETS.SHIELDS.path} alt="members" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 uppercase">Members</div>
                        <div className="text-xl font-orbitron font-bold text-blue-900">{alliance.members.length}/50</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-points">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                        <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="points" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                      </div>
                      <div>
                        <div className="text-xs text-purple-600 uppercase">Total Points</div>
                        <div className="text-xl font-orbitron font-bold text-purple-900">{totalPoints.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200" data-testid="card-stats-wars">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden">
                        <img src={TECH_BRANCH_ASSETS.WEAPONS.path} alt="wars" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                      </div>
                      <div>
                        <div className="text-xs text-red-600 uppercase">Active Wars</div>
                                    <div className="text-xl font-orbitron font-bold text-red-900">{activeWars.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-rank">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                        <img src={TECH_BRANCH_ASSETS.ENGINEERING.path} alt="rank" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                      </div>
                      <div>
                        <div className="text-xs text-green-600 uppercase">Galaxy Rank</div>
                        <div className="text-xl font-orbitron font-bold text-green-900">#12</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-indigo-50 border-indigo-200">
                 <CardHeader className="pb-3">
                    <CardTitle className="text-base text-indigo-900">Alliance Command Doctrine</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
                    <div className="rounded border border-indigo-200 bg-white/70 p-3">Escalate wars only when allied logistics can sustain reinforcement cycles for 72 hours.</div>
                    <div className="rounded border border-indigo-200 bg-white/70 p-3">Align diplomacy state changes with announcement cadence to keep member morale synchronized.</div>
                    <div className="rounded border border-indigo-200 bg-white/70 p-3">Rotate top-point commanders between fronts to distribute defensive pressure across systems.</div>
                 </CardContent>
              </Card>

              <Tabs defaultValue="overview" className="w-full">
                 <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="overview" className="font-orbitron" data-testid="tab-overview"><Globe className="w-4 h-4 mr-2" /> Overview</TabsTrigger>
                    <TabsTrigger value="members" className="font-orbitron" data-testid="tab-members"><Users className="w-4 h-4 mr-2" /> Members</TabsTrigger>
                    <TabsTrigger value="diplomacy" className="font-orbitron" data-testid="tab-diplomacy"><Handshake className="w-4 h-4 mr-2" /> Diplomacy</TabsTrigger>
                    <TabsTrigger value="wars" className="font-orbitron" data-testid="tab-wars"><Swords className="w-4 h-4 mr-2" /> Wars</TabsTrigger>
                    <TabsTrigger value="comms" className="font-orbitron" data-testid="tab-comms"><MessageSquare className="w-4 h-4 mr-2" /> Comms</TabsTrigger>
                 </TabsList>

                 <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <Card className="bg-white border-slate-200" data-testid="card-alliance-info">
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-slate-900">
                                <Globe className="w-5 h-5 text-blue-600" /> Alliance Info
                             </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                             <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm italic text-slate-600">
                                "{alliance.description}"
                             </div>
                             <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Founded</span>
                                   <span className="font-bold text-slate-900">{foundedDisplay}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Leader</span>
                                   <span className="font-bold text-slate-900">{allianceLeader?.name || "Unknown Commander"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Territory</span>
                                   <span className="font-bold text-slate-900">{territorySystems} systems</span>
                                </div>
                             </div>
                          </CardContent>
                       </Card>

                       <Card className="lg:col-span-2 bg-white border-slate-200">
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-slate-900">
                                <MessageSquare className="w-5 h-5 text-green-600" /> Announcements
                             </CardTitle>
                          </CardHeader>
                          <CardContent>
                             <div className="bg-primary/5 p-4 rounded border border-primary/20 mb-4">
                                <div className="text-xs font-bold uppercase text-primary mb-1">Alliance Announcement</div>
                                <p className="text-slate-800">{alliance.announcement}</p>
                                <div className="text-xs text-slate-500 mt-2">Posted by Leader • 2 days ago</div>
                             </div>
                             <div className="space-y-2">
                                {allianceUpdates.length === 0 ? (
                                   <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                      <div className="text-sm text-slate-700">No recent alliance updates.</div>
                                      <div className="text-xs text-slate-400 mt-1">Standby for new directives.</div>
                                   </div>
                                ) : (
                                   allianceUpdates.map((entry, index) => (
                                      <div key={`${entry.text}-${index}`} className="p-3 bg-slate-50 rounded border border-slate-100">
                                         <div className="text-sm text-slate-700">{entry.text}</div>
                                         <div className="text-xs text-slate-400 mt-1">{entry.time}</div>
                                      </div>
                                   ))
                                )}
                             </div>
                          </CardContent>
                       </Card>
                    </div>
                 </TabsContent>

                 <TabsContent value="members" className="mt-6">
                    <Card className="bg-white border-slate-200">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Users className="w-5 h-5 text-slate-600" /> Alliance Roster
                          </CardTitle>
                          <CardDescription>All members sorted by rank and points.</CardDescription>
                       </CardHeader>
                       <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {alliance.members.map((member, index) => (
                                <div key={member.id} className={cn("flex items-center justify-between p-4 rounded border transition-all", index === 0 ? "bg-yellow-50 border-yellow-200" : "bg-slate-50 border-slate-100")}>
                                   <div className="flex items-center gap-3">
                                      {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                                      <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-primary">
                                         {member.name.charAt(0)}
                                      </div>
                                      <div>
                                         <div className="font-bold text-sm text-slate-900">{member.name}</div>
                                         <div className="text-xs text-slate-500 uppercase">{member.rank}</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="font-mono text-sm font-bold text-slate-700">{member.points.toLocaleString()} pts</div>
                                      <div className={cn("text-[10px] uppercase font-bold", member.status === "online" ? "text-green-600" : "text-slate-400")}>{member.status}</div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                 </TabsContent>

                 <TabsContent value="diplomacy" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card className="bg-white border-slate-200" data-testid="card-diplomacy-relations">
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-slate-900">
                                <Handshake className="w-5 h-5 text-blue-600" /> Diplomatic Relations
                             </CardTitle>
                             <CardDescription>Current standings with other alliances.</CardDescription>
                          </CardHeader>
                          <CardContent>
                             <div className="space-y-3">
                                {diplomacyRelations.length === 0 && (
                                   <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded">
                                      <Handshake className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                      <p>No diplomatic relations logged yet.</p>
                                   </div>
                                )}
                                {diplomacyRelations.map(rel => {
                                   const state = diplomacyStates.find(s => s.id === rel.state);
                                   return (
                                      <div key={rel.allianceId} className={cn("flex items-center justify-between p-4 rounded border", state?.color)}>
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center font-bold text-sm">
                                               {rel.allianceTag}
                                            </div>
                                            <div>
                                               <div className="font-bold text-sm">{rel.allianceName}</div>
                                               <div className="text-xs opacity-70">Since {new Date(rel.since).toLocaleDateString()}</div>
                                            </div>
                                         </div>
                                         <Badge className={cn("uppercase", rel.state === "war" && "bg-red-600", rel.state === "allied" && "bg-green-600")}>
                                            {state?.name}
                                         </Badge>
                                      </div>
                                   );
                                })}
                             </div>
                          </CardContent>
                       </Card>

                       <Card className="bg-white border-slate-200" data-testid="card-diplomacy-actions">
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-slate-900">
                                <Flag className="w-5 h-5 text-red-600" /> Diplomatic Actions
                             </CardTitle>
                             <CardDescription>Declare war, propose alliances, or open negotiations.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Target Alliance Tag</label>
                                <Input value={targetAllianceTag} onChange={(event) => setTargetAllianceTag(event.target.value.toUpperCase())} placeholder="e.g. NOVA" className="bg-slate-50 font-mono" />
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" onClick={() => diplomacyActionMutation.mutate({ action: "proposeAlliance", targetTag: targetAllianceTag.trim() })} disabled={diplomacyActionMutation.isPending || !targetAllianceTag.trim()}>
                                   <Handshake className="w-4 h-4 mr-2" /> Propose Alliance
                                </Button>
                                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => diplomacyActionMutation.mutate({ action: "openTalks", targetTag: targetAllianceTag.trim() })} disabled={diplomacyActionMutation.isPending || !targetAllianceTag.trim()}>
                                   <MessageSquare className="w-4 h-4 mr-2" /> Open Talks
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => diplomacyActionMutation.mutate({ action: "issueWarning", targetTag: targetAllianceTag.trim() })} disabled={diplomacyActionMutation.isPending || !targetAllianceTag.trim()}>
                                   <Flag className="w-4 h-4 mr-2" /> Issue Warning
                                </Button>
                                <Button variant="destructive" onClick={() => diplomacyActionMutation.mutate({ action: "declareWar", targetTag: targetAllianceTag.trim() })} disabled={diplomacyActionMutation.isPending || !targetAllianceTag.trim()}>
                                   <Swords className="w-4 h-4 mr-2" /> Declare War
                                </Button>
                             </div>
                          </CardContent>
                       </Card>
                    </div>
                 </TabsContent>

                 <TabsContent value="wars" className="mt-6">
                    <Card className="bg-white border-slate-200" data-testid="card-wars">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Swords className="w-5 h-5 text-red-600" /> Active Wars
                          </CardTitle>
                          <CardDescription>Current military conflicts and war statistics.</CardDescription>
                       </CardHeader>
                       <CardContent>
                          {warRecords.length === 0 ? (
                             <div className="text-center py-12 text-slate-400">
                                <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>No active wars. Peace reigns... for now.</p>
                             </div>
                          ) : (
                             <div className="space-y-4">
                                {warRecords.map(war => (
                                   <div key={war.id} className="bg-red-50 border border-red-200 rounded-lg p-6">
                                      <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center font-bold text-red-600">
                                               {war.enemyTag}
                                            </div>
                                            <div>
                                               <div className="font-orbitron font-bold text-red-900">WAR: {war.enemyName}</div>
                                               <div className="text-sm text-red-700">Started: {new Date(war.startDate).toLocaleDateString()}</div>
                                            </div>
                                         </div>
                                         <Badge className={cn(war.status === "active" ? "bg-red-600 animate-pulse" : "bg-slate-600")}>{war.status.toUpperCase()}</Badge>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4">
                                         <div className="bg-white p-3 rounded border border-red-100 text-center">
                                            <div className="text-xs text-red-600 uppercase">Enemy Kills</div>
                                            <div className="text-2xl font-mono font-bold text-green-600">{war.kills.toLocaleString()}</div>
                                         </div>
                                         <div className="bg-white p-3 rounded border border-red-100 text-center">
                                            <div className="text-xs text-red-600 uppercase">Our Losses</div>
                                            <div className="text-2xl font-mono font-bold text-red-600">{war.deaths.toLocaleString()}</div>
                                         </div>
                                         <div className="bg-white p-3 rounded border border-red-100 text-center">
                                            <div className="text-xs text-red-600 uppercase">K/D Ratio</div>
                                            <div className="text-2xl font-mono font-bold text-slate-900">{war.deaths > 0 ? (war.kills / war.deaths).toFixed(2) : war.kills > 0 ? "INF" : "0.00"}</div>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          )}
                       </CardContent>
                    </Card>
                 </TabsContent>

                 <TabsContent value="comms" className="mt-6">
                    <Card className="bg-white border-slate-200">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <MessageSquare className="w-5 h-5 text-green-600" /> Alliance Communications
                          </CardTitle>
                       </CardHeader>
                       <CardContent>
                                       {!myGuild?.id ? (
                                          <div className="h-[300px] flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded">
                                             <div className="text-center">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                                <p>Guild communications require an active guild membership.</p>
                                             </div>
                                          </div>
                                       ) : (
                                          <div className="space-y-4">
                                             <ScrollArea className="h-[320px] rounded border border-slate-200 p-3">
                                                <div className="space-y-3">
                                                   {(guildChat?.messages || []).length === 0 && (
                                                      <div className="text-center text-slate-400 py-10">No messages yet. Start alliance communications.</div>
                                                   )}
                                                   {(guildChat?.messages || []).map((message) => (
                                                      <div key={message.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                                                         <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-semibold text-slate-900">{message.senderName}</span>
                                                            <span className="text-[11px] text-slate-500">{new Date(message.createdAt).toLocaleTimeString()}</span>
                                                         </div>
                                                         <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.content}</p>
                                                      </div>
                                                   ))}
                                                </div>
                                             </ScrollArea>

                                             <div className="flex gap-2">
                                                <Input
                                                   value={chatMessage}
                                                   onChange={(event) => setChatMessage(event.target.value)}
                                                   onKeyDown={(event) => {
                                                      if (event.key !== "Enter") return;
                                                      event.preventDefault();
                                                      const content = chatMessage.trim();
                                                      if (!content || sendGuildMessageMutation.isPending) return;
                                                      sendGuildMessageMutation.mutate(content);
                                                   }}
                                                   placeholder="Transmit alliance message..."
                                                   className="bg-slate-50"
                                                />
                                                <Button
                                                   onClick={() => {
                                                      const content = chatMessage.trim();
                                                      if (!content) return;
                                                      sendGuildMessageMutation.mutate(content);
                                                   }}
                                                   disabled={sendGuildMessageMutation.isPending || !chatMessage.trim()}
                                                >
                                                   Send
                                                </Button>
                                             </div>
                                          </div>
                                       )}
                       </CardContent>
                    </Card>
                 </TabsContent>
              </Tabs>
           </div>
        </GameLayout>
     );
  }

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Alliance Network</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Join forces with other commanders or establish your own faction.</p>
        </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Visible Alliances</div><div className="text-2xl font-orbitron font-bold text-slate-900">{visibleAlliances.length}</div></CardContent></Card>
                <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Directory Members</div><div className="text-2xl font-orbitron font-bold text-blue-700">{directoryMembers.toLocaleString()}</div></CardContent></Card>
                <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Active Wars</div><div className="text-2xl font-orbitron font-bold text-red-700">{directoryWars}</div></CardContent></Card>
                <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Recruitment Mode</div><div className="text-2xl font-orbitron font-bold text-emerald-700">Open</div></CardContent></Card>
            </div>

        <Tabs defaultValue="search" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="search" className="font-orbitron" data-testid="tab-search"><Search className="w-4 h-4 mr-2" /> Find Alliance</TabsTrigger>
              <TabsTrigger value="create" className="font-orbitron" data-testid="tab-create"><Plus className="w-4 h-4 mr-2" /> Establish Alliance</TabsTrigger>
           </TabsList>

           <TabsContent value="search" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Alliance Directory</CardTitle>
                    <CardDescription>Search for an alliance to join.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex gap-2">
                       <Input 
                          placeholder="Search by tag or name..." 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                          data-testid="input-search-alliance"
                       />
                       <Button onClick={() => refetchAllianceDirectory()} disabled={isFetchingAllianceDirectory} data-testid="button-search-alliance">
                          {isFetchingAllianceDirectory ? "Searching..." : "Search"}
                       </Button>
                    </div>

                    <div className="space-y-4">
                       {visibleAlliances.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">
                                   {entry.tag || entry.name.slice(0, 4).toUpperCase()}
                                </div>
                                <div>
                                   <div className="font-bold text-slate-900 text-lg">[{entry.tag || "ALLY"}] {entry.name}</div>
                                   <div className="text-sm text-slate-500">{entry.description}</div>
                                   <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className="text-[10px]">{entry.memberCount || 0} members</Badge>
                                      <Badge variant="outline" className="text-[10px]">{entry.activeWars || 0} active wars</Badge>
                                   </div>
                                </div>
                             </div>
                             <Button variant="outline" onClick={() => joinAlliance(entry.id)} data-testid={`button-join-${entry.id}`}>Apply</Button>
                          </div>
                       ))}
                       {visibleAlliances.length === 0 && (
                          <div className="text-center text-slate-500 py-10 border border-dashed border-slate-200 rounded">No alliances matched your search.</div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="create" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Found New Alliance</CardTitle>
                    <CardDescription>Establish a new power in the galaxy. Requires 10,000 Metal and 5,000 Crystal.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4 max-w-md">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Alliance Name</label>
                       <Input 
                          placeholder="e.g. Terran Federation" 
                          value={createName}
                          onChange={e => setCreateName(e.target.value)}
                          className="bg-slate-50 border-slate-200"
                          data-testid="input-alliance-name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Alliance Tag (3-8 chars)</label>
                       <Input 
                          placeholder="e.g. TERRA" 
                          maxLength={8}
                          value={createTag}
                          onChange={e => setCreateTag(e.target.value.toUpperCase())}
                          className="bg-slate-50 border-slate-200 font-mono"
                          data-testid="input-alliance-tag"
                       />
                    </div>
                    <Button className="w-full" onClick={() => createAlliance(createName, createTag)} data-testid="button-create-alliance">
                       <Trophy className="w-4 h-4 mr-2" /> Establish Alliance
                    </Button>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
