import GameLayout from "@/components/layout/GameLayout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Eye, AlertTriangle, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface BattleLogEntry {
  id: string;
  type: string;
  winner: string;
  attackerName: string;
  defenderName: string;
  rounds: number;
  totalAttackerDamage: number;
  totalDefenderDamage: number;
  loot: { metal: number; crystal: number; deuterium: number };
  createdAt: string;
}

export default function BattleLogs() {
  const { data: battles = [], isLoading } = useQuery<BattleLogEntry[]>({
    queryKey: ['/api/battles/logs'],
  });

  const typeIcons = {
    raid: <Sword className="w-4 h-4" />,
    attack: <Zap className="w-4 h-4" />,
    spy: <Eye className="w-4 h-4" />,
    sabotage: <AlertTriangle className="w-4 h-4" />
  };

  const getWinnerColor = (winner: string) => {
    if (winner === "attacker") return "bg-red-50 border-red-200";
    if (winner === "defender") return "bg-green-50 border-green-200";
    return "bg-slate-50 border-slate-200";
  };

  const getWinnerBadge = (winner: string) => {
    if (winner === "attacker") return <Badge className="bg-red-500">Attacker Won</Badge>;
    if (winner === "defender") return <Badge className="bg-green-500">Defender Won</Badge>;
    if (winner === "draw") return <Badge className="bg-slate-500">Draw</Badge>;
    if (winner === "spy_success") return <Badge className="bg-purple-500">Spy Successful</Badge>;
    return <Badge className="bg-slate-500">Failed</Badge>;
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Battle Logs</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Review your combat history and raid records.</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="all" className="font-orbitron">All Battles</TabsTrigger>
            <TabsTrigger value="attacks" className="font-orbitron"><Sword className="w-4 h-4 mr-2" /> Attacks</TabsTrigger>
            <TabsTrigger value="raids" className="font-orbitron"><TrendingUp className="w-4 h-4 mr-2" /> Raids</TabsTrigger>
            <TabsTrigger value="defenses" className="font-orbitron"><TrendingDown className="w-4 h-4 mr-2" /> Defenses</TabsTrigger>
            <TabsTrigger value="espionage" className="font-orbitron"><Eye className="w-4 h-4 mr-2" /> Espionage</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading battle logs...</div>
          ) : battles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No battle logs available yet.</div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4 mt-6">
                {battles.map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
              </TabsContent>

              <TabsContent value="attacks" className="space-y-4 mt-6">
                {battles.filter(b => b.type === "attack").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
              </TabsContent>

              <TabsContent value="raids" className="space-y-4 mt-6">
                {battles.filter(b => b.type === "raid").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
              </TabsContent>

              <TabsContent value="defenses" className="space-y-4 mt-6">
                <div className="text-center py-12 text-slate-500">Your defense battles will appear here.</div>
              </TabsContent>

              <TabsContent value="espionage" className="space-y-4 mt-6">
                {battles.filter(b => b.type === "spy").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </GameLayout>
  );
}

function BattleCard({ battle, typeIcons, getWinnerColor, getWinnerBadge }: any) {
  return (
    <Card className={cn("border cursor-pointer transition-all hover:shadow-md", getWinnerColor(battle.winner))}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-slate-400">{typeIcons[battle.type] || typeIcons.attack}</div>
            <div>
              <div className="font-bold text-slate-900">
                {battle.attackerName} <span className="text-slate-400">vs</span> {battle.defenderName}
              </div>
              <div className="text-xs text-slate-500">{formatDistanceToNow(new Date(battle.createdAt), { addSuffix: true })}</div>
            </div>
          </div>
          {getWinnerBadge(battle.winner)}
        </div>

        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Rounds</div>
            <div className="font-mono font-bold text-slate-900">{battle.rounds}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Attacker Damage</div>
            <div className="font-mono font-bold text-red-600">{battle.totalAttackerDamage.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Defender Damage</div>
            <div className="font-mono font-bold text-green-600">{battle.totalDefenderDamage.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Loot (Metal)</div>
            <div className="font-mono font-bold text-yellow-600">{battle.loot?.metal?.toLocaleString() || 0}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Type</div>
            <Badge variant="outline" className="capitalize">{battle.type}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
