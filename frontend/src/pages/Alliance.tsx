import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
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
import { MOCK_ALLIANCES } from "@/lib/allianceData";
import { cn } from "@/lib/utils";

const diplomacyStates = [
  { id: "war", name: "At War", color: "text-red-600 bg-red-50 border-red-200" },
  { id: "hostile", name: "Hostile", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "neutral", name: "Neutral", color: "text-slate-600 bg-slate-50 border-slate-200" },
  { id: "friendly", name: "Friendly", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "allied", name: "Allied", color: "text-green-600 bg-green-50 border-green-200" }
];

const mockDiplomacy = [
  { allianceId: "NOVA", allianceName: "Nova Empire", state: "allied", since: "2024-01-01" },
  { allianceId: "VOID", allianceName: "Void Reavers", state: "war", since: "2024-02-15" },
  { allianceId: "STAR", allianceName: "Starborn Legion", state: "neutral", since: "2024-01-20" }
];

const mockWars = [
  { id: 1, enemyTag: "VOID", enemyName: "Void Reavers", startDate: "2024-02-15", kills: 1234, deaths: 567, status: "active" }
];

export default function Alliance() {
  const { alliance, createAlliance, joinAlliance, leaveAlliance } = useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [createName, setCreateName] = useState("");
  const [createTag, setCreateTag] = useState("");

  if (alliance) {
     const totalPoints = alliance.members.reduce((acc, m) => acc + m.points, 0);
     
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
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
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
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-purple-600" />
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
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Swords className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-red-600 uppercase">Active Wars</div>
                        <div className="text-xl font-orbitron font-bold text-red-900">{mockWars.filter(w => w.status === "active").length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-rank">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-green-600 uppercase">Galaxy Rank</div>
                        <div className="text-xl font-orbitron font-bold text-green-900">#12</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                                   <span className="font-bold text-slate-900">Jan 1, 2024</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Leader</span>
                                   <span className="font-bold text-slate-900">Commander Alpha</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Territory</span>
                                   <span className="font-bold text-slate-900">12 systems</span>
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
                                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                   <div className="text-sm text-slate-700">New trade route established with [NOVA]</div>
                                   <div className="text-xs text-slate-400 mt-1">3 days ago</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                   <div className="text-sm text-slate-700">War declared against [VOID] - all hands on deck!</div>
                                   <div className="text-xs text-slate-400 mt-1">1 week ago</div>
                                </div>
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
                                {mockDiplomacy.map(rel => {
                                   const state = diplomacyStates.find(s => s.id === rel.state);
                                   return (
                                      <div key={rel.allianceId} className={cn("flex items-center justify-between p-4 rounded border", state?.color)}>
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center font-bold text-sm">
                                               {rel.allianceId}
                                            </div>
                                            <div>
                                               <div className="font-bold text-sm">{rel.allianceName}</div>
                                               <div className="text-xs opacity-70">Since {rel.since}</div>
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
                                <Input placeholder="e.g. NOVA" className="bg-slate-50 font-mono" />
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" onClick={() => alert("Alliance proposal sent!")}>
                                   <Handshake className="w-4 h-4 mr-2" /> Propose Alliance
                                </Button>
                                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => alert("Opening diplomatic talks...")}>
                                   <MessageSquare className="w-4 h-4 mr-2" /> Open Talks
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => alert("Warning issued!")}>
                                   <Flag className="w-4 h-4 mr-2" /> Issue Warning
                                </Button>
                                <Button variant="destructive" onClick={() => alert("War declared! Hostilities commence.")}>
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
                          {mockWars.length === 0 ? (
                             <div className="text-center py-12 text-slate-400">
                                <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>No active wars. Peace reigns... for now.</p>
                             </div>
                          ) : (
                             <div className="space-y-4">
                                {mockWars.map(war => (
                                   <div key={war.id} className="bg-red-50 border border-red-200 rounded-lg p-6">
                                      <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center font-bold text-red-600">
                                               {war.enemyTag}
                                            </div>
                                            <div>
                                               <div className="font-orbitron font-bold text-red-900">WAR: {war.enemyName}</div>
                                               <div className="text-sm text-red-700">Started: {war.startDate}</div>
                                            </div>
                                         </div>
                                         <Badge className="bg-red-600 animate-pulse">ACTIVE</Badge>
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
                                            <div className="text-2xl font-mono font-bold text-slate-900">{(war.kills / war.deaths).toFixed(2)}</div>
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
                          <div className="h-[400px] flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded">
                             <div className="text-center">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>Real-time chat coming soon</p>
                                <p className="text-xs mt-1">Use the message system to communicate with alliance members</p>
                             </div>
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
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Alliance Network</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Join forces with other commanders or establish your own faction.</p>
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
                       <Button onClick={() => alert("Searching for: " + (searchQuery || "all alliances"))} data-testid="button-search-alliance">Search</Button>
                    </div>

                    <div className="space-y-4">
                       {MOCK_ALLIANCES.map(a => (
                          <div key={a.id} className="flex items-center justify-between p-4 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">
                                   {a.tag}
                                </div>
                                <div>
                                   <div className="font-bold text-slate-900 text-lg">[{a.tag}] {a.name}</div>
                                   <div className="text-sm text-slate-500">{a.description}</div>
                                   <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className="text-[10px]">12 members</Badge>
                                      <Badge variant="outline" className="text-[10px]">Rank #45</Badge>
                                   </div>
                                </div>
                             </div>
                             <Button variant="outline" onClick={() => joinAlliance(a.id!)} data-testid={`button-join-${a.id}`}>Apply</Button>
                          </div>
                       ))}
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
