import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Handshake, Swords, Shield, Globe, MessageSquare, Ban, Send,
  Flag, Users, Star, AlertTriangle, CheckCircle, X, Search,
  TrendingUp, Award, Clock, FileText, DollarSign
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const relationshipTypes = [
  { id: "allied", name: "Allied", color: "text-green-600 bg-green-950/30 border-green-800", description: "Full military and economic cooperation" },
  { id: "friendly", name: "Friendly", color: "text-blue-600 bg-blue-950/30 border-blue-800", description: "Positive diplomatic relations" },
  { id: "neutral", name: "Neutral", color: "text-slate-400 bg-slate-950/30 border-slate-800", description: "No formal relations" },
  { id: "unfriendly", name: "Unfriendly", color: "text-orange-600 bg-orange-950/30 border-orange-800", description: "Strained relations" },
  { id: "hostile", name: "Hostile", color: "text-red-600 bg-red-950/30 border-red-800", description: "Open hostility" },
  { id: "war", name: "War", color: "text-rose-600 bg-rose-950/30 border-rose-800", description: "Active warfare" },
];

const treatyTypes = [
  { id: "non_aggression_pact", name: "Non-Aggression Pact", icon: Shield, description: "Both parties agree not to attack each other" },
  { id: "trade_agreement", name: "Trade Agreement", icon: DollarSign, description: "Reduced tariffs and preferred trade status" },
  { id: "defensive_pact", name: "Defensive Pact", icon: Shield, description: "Military assistance if either party is attacked" },
  { id: "resource_sharing", name: "Resource Sharing", icon: Globe, description: "Shared access to strategic resources" },
  { id: "military_alliance", name: "Military Alliance", icon: Swords, description: "Full military cooperation and joint operations" },
  { id: "federation", name: "Federation", icon: Star, description: "Complete political and economic integration" },
];

const embassyLevels = [
  { level: 1, name: "Liaison Office", treaties: 1, tradeBonus: 0.05 },
  { level: 2, name: "Consulate", treaties: 2, tradeBonus: 0.10 },
  { level: 3, name: "Embassy", treaties: 3, tradeBonus: 0.15 },
  { level: 4, name: "Grand Embassy", treaties: 5, tradeBonus: 0.25 },
  { level: 5, name: "Diplomatic Headquarters", treaties: 8, tradeBonus: 0.40 },
];

interface DiplomaticRelation {
  empireId: string;
  empireName: string;
  relationship: string;
  treaties: string[];
  tradeVolume: number;
  lastContact: string;
}

export default function Diplomacy() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelation, setSelectedRelation] = useState<DiplomaticRelation | null>(null);
  const [activeTab, setActiveTab] = useState("relations");

  const { data: relations, isLoading } = useQuery({
    queryKey: ["diplomacy", "relations"],
    queryFn: async () => {
      const res = await fetch("/api/relations");
      if (!res.ok) throw new Error("Failed to fetch relations");
      return res.json() as Promise<DiplomaticRelation[]>;
    },
  });

  const proposeActionMutation = useMutation({
    mutationFn: async ({ empireId, action }: { empireId: string; action: string }) => {
      const res = await fetch(`/api/diplomacy/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empireId }),
      });
      if (!res.ok) throw new Error("Diplomatic action failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomacy"] });
      toast({ title: "Diplomatic action sent", variant: "default" });
    },
    onError: (error: Error) => {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    },
  });

  const filteredRelations = relations?.filter(r =>
    r.empireName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <GameLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="relative max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-blue-400" />
                  Diplomatic Corps
                </h1>
                <p className="text-slate-400 mt-1">Manage interstellar relations, treaties, and alliances</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="Search empires..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 bg-slate-900/50 border-slate-700 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-slate-900/50 border border-slate-800">
                <TabsTrigger value="relations" className="data-[state=active]:bg-blue-600">
                  <Users className="w-4 h-4 mr-2" />
                  Relations
                </TabsTrigger>
                <TabsTrigger value="treaties" className="data-[state=active]:bg-blue-600">
                  <FileText className="w-4 h-4 mr-2" />
                  Treaties
                </TabsTrigger>
                <TabsTrigger value="embassy" className="data-[state=active]:bg-blue-600">
                  <Flag className="w-4 h-4 mr-2" />
                  Embassy
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
                  <Clock className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="relations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRelations?.map((rel) => (
                    <Card
                      key={rel.empireId}
                      className={cn(
                        "bg-slate-900/60 border-slate-800 cursor-pointer transition-all hover:border-blue-700",
                        selectedRelation?.empireId === rel.empireId && "ring-2 ring-blue-500"
                      )}
                      onClick={() => setSelectedRelation(rel)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{rel.empireName}</CardTitle>
                          <Badge
                            className={cn(
                              relationshipTypes.find(r => r.id === rel.relationship)?.color,
                              "px-2 py-0.5 text-xs"
                            )}
                          >
                            {relationshipTypes.find(r => r.id === rel.relationship)?.name}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-400">
                            <span>Treaties</span>
                            <span className="text-white">{rel.treaties?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Trade Volume</span>
                            <span className="text-green-400">{rel.tradeVolume?.toLocaleString() || 0} credits</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Last Contact</span>
                            <span className="text-slate-300">{rel.lastContact || "Never"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedRelation && (
                  <Card className="bg-slate-900/80 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          {selectedRelation.empireName}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-700 text-blue-400 hover:bg-blue-950"
                            onClick={() => proposeActionMutation.mutate({ empireId: selectedRelation.empireId, action: "propose-treaty" })}
                          >
                            <FileText className="w-4 h-4 mr-1" /> Propose Treaty
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-700 text-green-400 hover:bg-green-950"
                            onClick={() => proposeActionMutation.mutate({ empireId: selectedRelation.empireId, action: "send-message" })}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" /> Message
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-700 text-red-400 hover:bg-red-950"
                            onClick={() => proposeActionMutation.mutate({ empireId: selectedRelation.empireId, action: "declare-war" })}
                          >
                            <Swords className="w-4 h-4 mr-1" /> Declare War
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Relationship</div>
                          <div className="text-white font-medium">
                            {relationshipTypes.find(r => r.id === selectedRelation.relationship)?.name}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Active Treaties</div>
                          <div className="text-white font-medium">{selectedRelation.treaties?.length || 0}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Trade Volume</div>
                          <div className="text-green-400 font-medium">{selectedRelation.tradeVolume?.toLocaleString() || 0}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-slate-400 text-xs">Embassy Level</div>
                          <div className="text-blue-400 font-medium">Lv. 1 — Liaison Office</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="treaties" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treatyTypes.map((treaty) => {
                    const Icon = treaty.icon;
                    return (
                      <Card key={treaty.id} className="bg-slate-900/60 border-slate-800 hover:border-blue-700 transition-all">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-950/50 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{treaty.name}</CardTitle>
                              <CardDescription className="text-slate-400">{treaty.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline" size="sm">
                            Propose Treaty
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="embassy" className="space-y-4">
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flag className="w-5 h-5 text-blue-400" />
                      Embassy Development
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Upgrade your embassy to unlock more treaties and better trade terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {embassyLevels.map((level) => (
                        <div
                          key={level.level}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            level.level === 1
                              ? "bg-blue-950/30 border-blue-800"
                              : "bg-slate-800/30 border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                              level.level === 1 ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400"
                            )}>
                              {level.level}
                            </div>
                            <div>
                              <div className="text-white font-medium">{level.name}</div>
                              <div className="text-slate-400 text-xs">
                                {level.treaties} treaties · {level.tradeBonus * 100}% trade bonus
                              </div>
                            </div>
                          </div>
                          {level.level === 1 ? (
                            <Badge className="bg-blue-600">Current</Badge>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              Upgrade
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Diplomatic History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No diplomatic history yet</p>
                      <p className="text-sm">Begin interacting with other empires to build your history</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
