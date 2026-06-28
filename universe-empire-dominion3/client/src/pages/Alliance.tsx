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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, Users, LogOut, Search, Plus, Trophy, MessageSquare, Globe, 
  Swords, Handshake, Flag, Crown, Star, Target, TrendingUp, Award, 
  Settings, Bell, History
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   fundAllianceTreasury,
   getAllianceSystemsSnapshot,
   MAX_ALLIANCE_MEMBERS,
   researchAllianceSystem,
   unlockAllianceTechnology,
   upgradeAllianceSystem,
} from "@/lib/allianceSystems";

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

type AllianceOperationType = "raid" | "siege" | "expedition";

type AllianceOperation = {
   id: string;
   allianceId: string;
   targetCoordinates: string;
   missionType: AllianceOperationType;
   status: "draft" | "launched" | "completed" | "failed";
   createdBy: string;
   createdAt: string;
   launchAt?: string;
   resolveAt?: string;
   totalPower: number;
   participants: Array<{
      userId: string;
      contributionPower: number;
      joinedAt: string;
   }>;
   rewardCredits?: number;
   report?: string;
};

type AllianceOperationsResponse = {
   operations: AllianceOperation[];
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

type ForumReply = {
   id: string;
   authorName: string;
   content: string;
   createdAt: number;
};

type ForumThread = {
   id: string;
   title: string;
   category: string;
   authorName: string;
   content: string;
   createdAt: number;
   replies: ForumReply[];
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

function parseOperationPower(value: string): number | null {
   const parsed = Number(value.trim());
   if (!Number.isFinite(parsed)) {
      return null;
   }

   return Math.max(100, Math.round(parsed));
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
   const [allianceSystemsVersion, setAllianceSystemsVersion] = useState(0);
   const [operationTarget, setOperationTarget] = useState("1:1:1");
   const [operationType, setOperationType] = useState<AllianceOperationType>("raid");
   const [operationPower, setOperationPower] = useState("1000");
   const [boardTitle, setBoardTitle] = useState("");
   const [boardContent, setBoardContent] = useState("");
   const [boardCategory, setBoardCategory] = useState("General");
   const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
   const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

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

   const { data: operationsData } = useQuery<AllianceOperationsResponse>({
      queryKey: ["alliance-operations", alliance?.id],
      queryFn: () => fetchJson<AllianceOperationsResponse>(`/api/alliances/${alliance!.id}/operations`),
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

   const { data: boardData } = useQuery<{ success: boolean; threads: ForumThread[] }>({
      queryKey: ["alliance-board", alliance?.id],
      queryFn: () => fetchJson(`/api/forums/threads?allianceId=${alliance!.id}&category=all`),
      enabled: !!alliance?.id,
      refetchInterval: 15000,
   });

   const createBoardThreadMutation = useMutation({
      mutationFn: () =>
         fetchJson("/api/forums/threads", {
            method: "POST",
            body: JSON.stringify({ title: boardTitle, content: boardContent, category: boardCategory, allianceId: alliance!.id }),
         }),
      onSuccess: () => {
         setBoardTitle("");
         setBoardContent("");
         setBoardCategory("General");
         queryClient.invalidateQueries({ queryKey: ["alliance-board", alliance?.id] });
         toast({ title: "Thread posted", description: "Your forum thread is now live." });
      },
      onError: (error: Error) => {
         toast({ title: "Post failed", description: error.message, variant: "destructive" });
      },
   });

   const replyToThreadMutation = useMutation({
      mutationFn: ({ threadId, content }: { threadId: string; content: string }) =>
         fetchJson(`/api/forums/threads/${threadId}/reply`, {
            method: "POST",
            body: JSON.stringify({ content }),
         }),
      onSuccess: (_, variables) => {
         setReplyDrafts((prev) => ({ ...prev, [variables.threadId]: "" }));
         queryClient.invalidateQueries({ queryKey: ["alliance-board", alliance?.id] });
         toast({ title: "Reply posted", description: "Your response has been added." });
      },
      onError: (error: Error) => {
         toast({ title: "Reply failed", description: error.message, variant: "destructive" });
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

   const createOperationMutation = useMutation({
      mutationFn: ({ targetCoordinates, missionType, contributionPower }: { targetCoordinates: string; missionType: AllianceOperationType; contributionPower: number }) =>
         fetchJson(`/api/alliances/${alliance!.id}/operations`, {
            method: "POST",
            body: JSON.stringify({ targetCoordinates, missionType, contributionPower }),
         }),
      onSuccess: () => {
         setOperationTarget("1:1:1");
         setOperationType("raid");
         setOperationPower("1000");
         queryClient.invalidateQueries({ queryKey: ["alliance-operations", alliance?.id] });
         toast({ title: "Operation drafted", description: "Alliance operation created." });
      },
      onError: (error: Error) => {
         toast({ title: "Operation failed", description: error.message, variant: "destructive" });
      },
   });

   const joinOperationMutation = useMutation({
      mutationFn: ({ operationId, contributionPower }: { operationId: string; contributionPower: number }) =>
         fetchJson(`/api/alliances/${alliance!.id}/operations/${operationId}/join`, {
            method: "POST",
            body: JSON.stringify({ contributionPower }),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["alliance-operations", alliance?.id] });
         toast({ title: "Operation updated", description: "Your reinforcements were added." });
      },
      onError: (error: Error) => {
         toast({ title: "Join failed", description: error.message, variant: "destructive" });
      },
   });

   const launchOperationMutation = useMutation({
      mutationFn: (operationId: string) =>
         fetchJson(`/api/alliances/${alliance!.id}/operations/${operationId}/launch`, {
            method: "POST",
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["alliance-operations", alliance?.id] });
         toast({ title: "Operation launched", description: "Alliance fleets are now en route." });
      },
      onError: (error: Error) => {
         toast({ title: "Launch failed", description: error.message, variant: "destructive" });
      },
   });

   const resolveOperationMutation = useMutation({
      mutationFn: (operationId: string) =>
         fetchJson(`/api/alliances/${alliance!.id}/operations/${operationId}/resolve`, {
            method: "POST",
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["alliance-operations", alliance?.id] });
         toast({ title: "Operation resolved", description: "Mission results have been recorded." });
      },
      onError: (error: Error) => {
         toast({ title: "Resolve failed", description: error.message, variant: "destructive" });
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
     const allianceSystems = getAllianceSystemsSnapshot(alliance.id);
     const unlockedTechnologyCount = allianceSystems.technologies.filter((technology) => technology.unlocked).length;
     const operations = operationsData?.operations || [];
     const parsedOperationPower = parseOperationPower(operationPower);
     const canDraftOperation = Boolean(operationTarget.trim()) && parsedOperationPower !== null;

     const executeAllianceSystemsAction = (callback: () => void, successTitle: string) => {
        try {
           callback();
           setAllianceSystemsVersion((version) => version + 1);
           toast({ title: successTitle, description: "Alliance systems updated." });
        } catch (error) {
           toast({
              title: "Alliance systems action failed",
              description: error instanceof Error ? error.message : "Unable to process alliance systems action.",
              variant: "destructive",
           });
        }
     };
     
     return (
        <GameLayout>
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-alliance-systems-version={allianceSystemsVersion}>
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
                                    <div className="text-xl font-orbitron font-bold text-blue-900">{alliance.members.length}/{allianceSystems.memberCap}</div>
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
                    <TabsTrigger value="systems" className="font-orbitron" data-testid="tab-systems"><Settings className="w-4 h-4 mr-2" /> Systems</TabsTrigger>
                    <TabsTrigger value="operations" className="font-orbitron" data-testid="tab-operations"><Target className="w-4 h-4 mr-2" /> Operations</TabsTrigger>
                    <TabsTrigger value="diplomacy" className="font-orbitron" data-testid="tab-diplomacy"><Handshake className="w-4 h-4 mr-2" /> Diplomacy</TabsTrigger>
                    <TabsTrigger value="wars" className="font-orbitron" data-testid="tab-wars"><Swords className="w-4 h-4 mr-2" /> Wars</TabsTrigger>
                     <TabsTrigger value="comms" className="font-orbitron" data-testid="tab-comms"><MessageSquare className="w-4 h-4 mr-2" /> Comms</TabsTrigger>
                     <TabsTrigger value="board" className="font-orbitron" data-testid="tab-board"><MessageSquare className="w-4 h-4 mr-2" /> Board</TabsTrigger>
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

                 <TabsContent value="systems" className="mt-6">
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Card className="bg-white border-slate-200">
                             <CardContent className="p-4">
                                <div className="text-xs uppercase text-slate-500">Member Capacity</div>
                                <div className="text-2xl font-orbitron font-bold text-slate-900">{alliance.members.length}/{allianceSystems.memberCap}</div>
                                <Progress value={Math.min(100, (alliance.members.length / allianceSystems.memberCap) * 100)} className="mt-3 h-2" />
                             </CardContent>
                          </Card>
                          <Card className="bg-white border-slate-200">
                             <CardContent className="p-4">
                                <div className="text-xs uppercase text-slate-500">Unlocked Technologies</div>
                                <div className="text-2xl font-orbitron font-bold text-indigo-700">{unlockedTechnologyCount}/{allianceSystems.technologies.length}</div>
                             </CardContent>
                          </Card>
                          <Card className="bg-white border-slate-200">
                             <CardContent className="p-4">
                                <div className="text-xs uppercase text-slate-500">Research Speed Bonus</div>
                                <div className="text-2xl font-orbitron font-bold text-purple-700">+{allianceSystems.bonuses.researchSpeed.toFixed(1)}%</div>
                             </CardContent>
                          </Card>
                          <Card className="bg-white border-slate-200">
                             <CardContent className="p-4">
                                <div className="text-xs uppercase text-slate-500">Defense Matrix Bonus</div>
                                <div className="text-2xl font-orbitron font-bold text-emerald-700">+{allianceSystems.bonuses.defenseMatrix.toFixed(1)}%</div>
                             </CardContent>
                          </Card>
                       </div>

                       <Card className="bg-white border-slate-200">
                          <CardHeader>
                             <CardTitle className="text-slate-900">Alliance Treasury</CardTitle>
                             <CardDescription>Fund alliance upgrades, research tracks, and strategic technology unlocks.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"><div className="text-xs uppercase text-slate-500">Metal</div><div className="font-orbitron text-slate-900">{allianceSystems.treasury.metal.toLocaleString()}</div></div>
                                <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"><div className="text-xs uppercase text-slate-500">Crystal</div><div className="font-orbitron text-slate-900">{allianceSystems.treasury.crystal.toLocaleString()}</div></div>
                                <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"><div className="text-xs uppercase text-slate-500">Deuterium</div><div className="font-orbitron text-slate-900">{allianceSystems.treasury.deuterium.toLocaleString()}</div></div>
                                <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"><div className="text-xs uppercase text-slate-500">Credits</div><div className="font-orbitron text-slate-900">{allianceSystems.treasury.credits.toLocaleString()}</div></div>
                             </div>
                             <Button
                                variant="outline"
                                onClick={() => executeAllianceSystemsAction(() => {
                                   fundAllianceTreasury(alliance.id, { metal: 15000, crystal: 12000, deuterium: 10000, credits: 9000 });
                                }, "Treasury reinforced")}
                             >
                                <TrendingUp className="w-4 h-4 mr-2" /> Contribute strategic funding
                             </Button>
                          </CardContent>
                       </Card>

                       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                          <Card className="bg-white border-slate-200">
                             <CardHeader>
                                <CardTitle className="text-slate-900">Upgrade Systems</CardTitle>
                                <CardDescription>Permanent alliance infrastructure growth.</CardDescription>
                             </CardHeader>
                             <CardContent className="space-y-3">
                                {allianceSystems.upgrades.map((upgrade) => (
                                   <div key={upgrade.id} className="rounded border border-slate-200 p-3 bg-slate-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                         <div className="font-semibold text-slate-900 text-sm">{upgrade.name}</div>
                                         <Badge variant="outline">Lv {upgrade.level}/{upgrade.maxLevel}</Badge>
                                      </div>
                                      <div className="text-xs text-slate-600">{upgrade.description}</div>
                                      {upgrade.nextCost ? (
                                         <div className="text-[11px] text-slate-500">Next: {upgrade.nextCost.metal.toLocaleString()} M • {upgrade.nextCost.crystal.toLocaleString()} C • {upgrade.nextCost.deuterium.toLocaleString()} D • {upgrade.nextCost.credits.toLocaleString()} Cr</div>
                                      ) : (
                                         <div className="text-[11px] text-emerald-700 font-semibold">MAXED</div>
                                      )}
                                      <Button size="sm" className="w-full" disabled={!upgrade.nextCost} onClick={() => executeAllianceSystemsAction(() => upgradeAllianceSystem(alliance.id, upgrade.id), `${upgrade.name} upgraded`)}>
                                         Upgrade
                                      </Button>
                                   </div>
                                ))}
                             </CardContent>
                          </Card>

                          <Card className="bg-white border-slate-200">
                             <CardHeader>
                                <CardTitle className="text-slate-900">Research Systems</CardTitle>
                                <CardDescription>Alliance research doctrine and scaling bonuses.</CardDescription>
                             </CardHeader>
                             <CardContent className="space-y-3">
                                {allianceSystems.research.map((track) => (
                                   <div key={track.id} className="rounded border border-slate-200 p-3 bg-slate-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                         <div className="font-semibold text-slate-900 text-sm">{track.name}</div>
                                         <Badge variant="outline">Lv {track.level}/{track.maxLevel}</Badge>
                                      </div>
                                      <div className="text-xs text-slate-600">{track.description}</div>
                                      {track.nextCost ? (
                                         <div className="text-[11px] text-slate-500">Next: {track.nextCost.metal.toLocaleString()} M • {track.nextCost.crystal.toLocaleString()} C • {track.nextCost.deuterium.toLocaleString()} D • {track.nextCost.credits.toLocaleString()} Cr</div>
                                      ) : (
                                         <div className="text-[11px] text-emerald-700 font-semibold">MAXED</div>
                                      )}
                                      <Button size="sm" className="w-full" disabled={!track.nextCost} onClick={() => executeAllianceSystemsAction(() => researchAllianceSystem(alliance.id, track.id), `${track.name} advanced`)}>
                                         Research
                                      </Button>
                                   </div>
                                ))}
                             </CardContent>
                          </Card>

                          <Card className="bg-white border-slate-200">
                             <CardHeader>
                                <CardTitle className="text-slate-900">Technology Systems</CardTitle>
                                <CardDescription>Unique strategic unlocks with alliance-wide impact.</CardDescription>
                             </CardHeader>
                             <CardContent className="space-y-3">
                                {allianceSystems.technologies.map((technology) => (
                                   <div key={technology.id} className="rounded border border-slate-200 p-3 bg-slate-50 space-y-2">
                                      <div className="flex items-center justify-between">
                                         <div className="font-semibold text-slate-900 text-sm">{technology.name}</div>
                                         <Badge className={technology.unlocked ? "bg-emerald-600" : "bg-slate-500"}>{technology.unlocked ? "UNLOCKED" : "LOCKED"}</Badge>
                                      </div>
                                      <div className="text-xs text-slate-600">{technology.description}</div>
                                      {!technology.unlocked && (
                                         <div className="text-[11px] text-slate-500">Cost: {technology.baseCost.metal.toLocaleString()} M • {technology.baseCost.crystal.toLocaleString()} C • {technology.baseCost.deuterium.toLocaleString()} D • {technology.baseCost.credits.toLocaleString()} Cr</div>
                                      )}
                                      <Button size="sm" className="w-full" variant={technology.unlocked ? "outline" : "default"} disabled={technology.unlocked} onClick={() => executeAllianceSystemsAction(() => unlockAllianceTechnology(alliance.id, technology.id), `${technology.name} unlocked`)}>
                                         {technology.unlocked ? "Online" : "Unlock Technology"}
                                      </Button>
                                   </div>
                                ))}
                             </CardContent>
                          </Card>
                       </div>

                       <Card className="bg-white border-slate-200">
                          <CardHeader>
                             <CardTitle className="text-slate-900">Alliance Bonus Matrix</CardTitle>
                             <CardDescription>Different alliance system bonuses from upgrades, research, and technologies.</CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Economy Boost</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.economyBoost.toFixed(1)}%</div></div>
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Research Speed</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.researchSpeed.toFixed(1)}%</div></div>
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Fleet Coordination</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.fleetCoordination.toFixed(1)}%</div></div>
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Defense Matrix</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.defenseMatrix.toFixed(1)}%</div></div>
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Diplomacy Strength</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.diplomacyStrength.toFixed(1)}%</div></div>
                             <div className="rounded border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Expedition Intel</div><div className="text-lg font-orbitron text-slate-900">+{allianceSystems.bonuses.expeditionIntel.toFixed(1)}%</div></div>
                          </CardContent>
                       </Card>
                    </div>
                 </TabsContent>

                 <TabsContent value="operations" className="mt-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                       <Card className="bg-white border-slate-200">
                          <CardHeader>
                             <CardTitle className="text-slate-900">Create Joint Operation</CardTitle>
                             <CardDescription>Alliance Combat System (ACS) mission planning.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-xs uppercase text-slate-500">Target Coordinates</label>
                                <Input value={operationTarget} onChange={(event) => setOperationTarget(event.target.value)} placeholder="1:1:1" className="bg-slate-50" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs uppercase text-slate-500">Mission Type</label>
                                <select value={operationType} onChange={(event) => setOperationType(event.target.value as AllianceOperationType)} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-slate-50">
                                   <option value="raid">Raid</option>
                                   <option value="siege">Siege</option>
                                   <option value="expedition">Expedition</option>
                                </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs uppercase text-slate-500">Initial Power</label>
                                <Input value={operationPower} onChange={(event) => setOperationPower(event.target.value)} type="number" className="bg-slate-50" />
                             </div>
                             <Button
                                className="w-full"
                                onClick={() => {
                                   if (parsedOperationPower === null) {
                                      toast({
                                         title: "Invalid power value",
                                         description: "Initial power must be a valid number.",
                                         variant: "destructive",
                                      });
                                      return;
                                   }

                                   createOperationMutation.mutate({
                                      targetCoordinates: operationTarget.trim(),
                                      missionType: operationType,
                                      contributionPower: parsedOperationPower,
                                   });
                                }}
                                disabled={createOperationMutation.isPending || !canDraftOperation}
                             >
                                Draft Operation
                             </Button>
                          </CardContent>
                       </Card>

                       <Card className="xl:col-span-2 bg-white border-slate-200">
                          <CardHeader>
                             <CardTitle className="text-slate-900">Active Joint Operations</CardTitle>
                             <CardDescription>Create, join, launch, and resolve coordinated alliance missions.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                             {operations.length === 0 && <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded p-4">No alliance operations yet.</div>}
                             {operations.map((operation) => (
                                <div key={operation.id} className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50">
                                   <div className="flex items-center justify-between gap-3">
                                      <div>
                                         <div className="font-semibold text-slate-900">{operation.missionType.toUpperCase()} • {operation.targetCoordinates}</div>
                                         <div className="text-xs text-slate-500">Created {new Date(operation.createdAt).toLocaleString()} • Participants {operation.participants.length}</div>
                                      </div>
                                      <Badge className={cn(operation.status === "completed" && "bg-green-600", operation.status === "failed" && "bg-red-600", operation.status === "launched" && "bg-blue-600", operation.status === "draft" && "bg-slate-600")}>{operation.status.toUpperCase()}</Badge>
                                   </div>

                                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                      <div className="bg-white border border-slate-200 rounded p-2"><div className="text-slate-500 uppercase">Total Power</div><div className="font-orbitron text-slate-900">{operation.totalPower.toLocaleString()}</div></div>
                                      <div className="bg-white border border-slate-200 rounded p-2"><div className="text-slate-500 uppercase">Launch At</div><div className="font-orbitron text-slate-900">{operation.launchAt ? new Date(operation.launchAt).toLocaleTimeString() : "Pending"}</div></div>
                                      <div className="bg-white border border-slate-200 rounded p-2"><div className="text-slate-500 uppercase">Resolve At</div><div className="font-orbitron text-slate-900">{operation.resolveAt ? new Date(operation.resolveAt).toLocaleTimeString() : "Pending"}</div></div>
                                      <div className="bg-white border border-slate-200 rounded p-2"><div className="text-slate-500 uppercase">Reward</div><div className="font-orbitron text-slate-900">{operation.rewardCredits ? `${operation.rewardCredits.toLocaleString()} cr` : "Pending"}</div></div>
                                   </div>

                                   {operation.report && <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded p-2">{operation.report}</div>}

                                   <div className="flex flex-wrap gap-2">
                                      <Button size="sm" variant="outline" onClick={() => joinOperationMutation.mutate({ operationId: operation.id, contributionPower: 500 })} disabled={operation.status !== "draft" || joinOperationMutation.isPending}>Join (+500)</Button>
                                      <Button size="sm" variant="outline" onClick={() => launchOperationMutation.mutate(operation.id)} disabled={operation.status !== "draft" || launchOperationMutation.isPending}>Launch</Button>
                                      <Button size="sm" onClick={() => resolveOperationMutation.mutate(operation.id)} disabled={operation.status !== "launched" || resolveOperationMutation.isPending}>Resolve</Button>
                                   </div>
                                </div>
                             ))}
                          </CardContent>
                       </Card>
                    </div>
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

                  <TabsContent value="board" className="mt-6">
                     <Card className="bg-white border-slate-200">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-slate-900">
                              <MessageSquare className="w-5 h-5 text-indigo-600" /> Alliance Board
                           </CardTitle>
                           <CardDescription>Post strategy discussions, war plans, and announcements for your alliance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="rounded border border-slate-200 bg-slate-50 p-4 space-y-3">
                              <div className="font-semibold text-sm text-slate-900">New Thread</div>
                              <Input
                                 value={boardTitle}
                                 onChange={(event) => setBoardTitle(event.target.value)}
                                 placeholder="Thread title"
                              />
                              <Textarea
                                 value={boardContent}
                                 onChange={(event) => setBoardContent(event.target.value)}
                                 placeholder="What's on your mind, commander?"
                                 rows={3}
                              />
                              <div className="flex items-center justify-between gap-3">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Category:</span>
                                    <Select value={boardCategory} onValueChange={setBoardCategory}>
                                       <SelectTrigger className="w-36 h-8 text-xs bg-white">
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="General">General</SelectItem>
                                          <SelectItem value="Announcements">Announcements</SelectItem>
                                          <SelectItem value="War Plans">War Plans</SelectItem>
                                          <SelectItem value="Diplomacy">Diplomacy</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <Button
                                    onClick={() => createBoardThreadMutation.mutate()}
                                    disabled={createBoardThreadMutation.isPending || boardTitle.trim().length < 3 || boardContent.trim().length < 3}
                                    size="sm"
                                 >
                                    {createBoardThreadMutation.isPending ? "Posting..." : "Post Thread"}
                                 </Button>
                              </div>
                           </div>

                           <div className="space-y-3">
                              {(boardData?.threads || []).length === 0 && (
                                 <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No threads yet. Start the first discussion.</p>
                                 </div>
                              )}
                              {(boardData?.threads || []).map((thread) => {
                                 const isExpanded = expandedThreads[thread.id] || false;
                                 return (
                                 <div key={thread.id} className="rounded border border-slate-200 bg-slate-50 p-4 space-y-2">
                                    <div
                                       className="flex items-center justify-between cursor-pointer select-none"
                                       onClick={() => setExpandedThreads((prev) => ({ ...prev, [thread.id]: !prev[thread.id] }))}
                                    >
                                       <div className="flex items-center gap-2 min-w-0">
                                          <div className="font-semibold text-slate-900 truncate">{thread.title}</div>
                                          <Badge variant="outline" className="text-[10px] shrink-0">{thread.category}</Badge>
                                       </div>
                                       <div className="text-xs text-slate-500 shrink-0 ml-2">
                                          {thread.replies?.length || 0} replies • {thread.authorName || "Commander"} • {new Date(thread.createdAt).toLocaleDateString()}
                                       </div>
                                    </div>
                                    {isExpanded && (
                                       <div className="space-y-3 pt-2 border-t border-slate-200">
                                          <div className="text-sm text-slate-700 bg-white rounded border border-slate-200 p-3">{thread.content}</div>
                                          {(thread.replies || []).length > 0 && (
                                             <div className="space-y-2">
                                                <div className="text-xs font-semibold text-slate-500 uppercase">Replies</div>
                                                {thread.replies.map((reply) => (
                                                   <div key={reply.id} className="bg-white rounded border border-slate-200 p-3">
                                                      <div className="flex items-center justify-between mb-1">
                                                         <span className="text-xs font-semibold text-slate-700">{reply.authorName || "Commander"}</span>
                                                         <span className="text-[10px] text-slate-400">{new Date(reply.createdAt).toLocaleString()}</span>
                                                      </div>
                                                      <p className="text-sm text-slate-600">{reply.content}</p>
                                                   </div>
                                                ))}
                                             </div>
                                          )}
                                          <div className="flex gap-2">
                                             <Input
                                                value={replyDrafts[thread.id] || ""}
                                                onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [thread.id]: event.target.value }))}
                                                placeholder="Write a reply..."
                                                className="bg-white text-sm"
                                             />
                                             <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => replyToThreadMutation.mutate({ threadId: thread.id, content: (replyDrafts[thread.id] || "").trim() })}
                                                disabled={replyToThreadMutation.isPending || (replyDrafts[thread.id] || "").trim().length < 2}
                                             >
                                                Reply
                                             </Button>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              )})}
                           </div>
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
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/deep_space.png" alt="Alliance" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-800/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/buildings/space_port.png" alt="Alliance" className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-400/50 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Alliance Network</h2>
              <p className="text-slate-300 font-rajdhani text-lg">Join forces with other commanders or establish your own faction.</p>
            </div>
          </div>
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
                                      <Badge variant="outline" className="text-[10px]">{entry.memberCount || 0}/{MAX_ALLIANCE_MEMBERS} members</Badge>
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
