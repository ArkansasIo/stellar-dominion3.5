import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  RELATIONSHIP_TYPES, DIPLOMATIC_ACTIONS, TRADE_ROUTE_LEVELS, TRADE_ROUTE_TYPES,
  ESPIONAGE_AGENT_TIERS, ESPIONAGE_MISSIONS, FACTION_DIPLOMACY_BONUSES, REPUTATION_TIERS,
  type RelationshipType, type TradeRouteType,
} from "@shared/config/diplomacyConfig";
import {
  Handshake, Swords, AlertTriangle, Shield, Users, Coins, Route, Eye, Scroll,
  TrendingUp, TrendingDown, Target, Globe, Send, ArrowRightLeft, FileText, Minus,
} from "lucide-react";
import { useState } from "react";

type Tab = "overview" | "trade" | "espionage" | "tribute" | "factions";

const relColor: Record<RelationshipType, string> = {
  war: "bg-red-500/20 text-red-400 border-red-500/30",
  hostile: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  unfriendly: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  neutral: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  friendly: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  allied: "bg-green-500/20 text-green-400 border-green-500/30",
};

const relIcon: Record<RelationshipType, typeof Swords> = {
  war: Swords, hostile: AlertTriangle, unfriendly: Minus, neutral: Globe, friendly: Shield, allied: Handshake,
};

const players = [
  { id: "1", name: "Zyxarian Empire", rel: "allied" as RelationshipType, rep: 82, power: 15400, routes: 2, last: "2h ago" },
  { id: "2", name: "Void Collective", rel: "friendly" as RelationshipType, rep: 58, power: 12200, routes: 1, last: "1d ago" },
  { id: "3", name: "Kragmor Dominion", rel: "hostile" as RelationshipType, rep: 15, power: 18900, routes: 0, last: "3d ago" },
  { id: "4", name: "Nebula Syndicate", rel: "neutral" as RelationshipType, rep: 40, power: 9800, routes: 0, last: "5h ago" },
  { id: "5", name: "Iron Pact", rel: "war" as RelationshipType, rep: 5, power: 22100, routes: 0, last: "12h ago" },
];

const tradeRoutes = [
  { id: "t1", partner: "Zyxarian Empire", type: "full_partnership" as TradeRouteType, level: 4, dist: 65, income: 480, cap: 92 },
  { id: "t2", partner: "Void Collective", type: "resource_only" as TradeRouteType, level: 2, dist: 42, income: 130, cap: 60 },
];

const factions = [
  { id: "f1", name: "Terran Federation", rel: "friendly" as RelationshipType, standing: 45, missions: 3 },
  { id: "f2", name: "Xylos Cartel", rel: "neutral" as RelationshipType, standing: 10, missions: 1 },
  { id: "f3", name: "Shadow Collective", rel: "hostile" as RelationshipType, standing: -30, missions: 0 },
];

const history = [
  { from: "You", to: "Zyxarian Empire", action: "send_tribute", amt: "5,000cr + 2,000 metal", time: "2h ago", rep: +5 },
  { from: "Void Collective", to: "You", action: "send_tribute", amt: "3,000cr", time: "1d ago", rep: +3 },
  { from: "You", to: "Kragmor Dominion", action: "demand_submission", amt: "Denied", time: "3d ago", rep: -12 },
  { from: "You", to: "Nebula Syndicate", action: "non_aggression_pact", amt: "Signed", time: "5d ago", rep: +6 },
];

const badgeColor = (a: string) => a === "send_tribute" ? "bg-green-500/20 text-green-400" : a === "demand_submission" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400";

function OverviewTab() {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="grid gap-3">
      {players.map((p) => {
        const Icon = relIcon[p.rel];
        const tier = REPUTATION_TIERS.find((t) => p.rep >= t.minReputation && p.rep <= t.maxReputation);
        const actions = DIPLOMATIC_ACTIONS.filter((a) => !a.requiredRelationship || a.requiredRelationship === p.rel).slice(0, 4);
        return (
          <Card key={p.id} className="bg-slate-900/80 border-slate-700/50 hover:border-slate-600/60 transition-colors cursor-pointer" onClick={() => setSel(sel === p.id ? null : p.id)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                  <div><CardTitle className="text-white text-sm">{p.name}</CardTitle><p className="text-xs text-slate-400">Power: {p.power.toLocaleString()}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={relColor[p.rel]}>{RELATIONSHIP_TYPES[p.rel].name}</Badge>
                  <Badge variant="outline" className="border-slate-700/50 text-slate-400">{tier?.name}</Badge>
                </div>
              </div>
            </CardHeader>
            {sel === p.id && (
              <CardContent className="pt-0">
                <Separator className="bg-slate-700/50 mb-3" />
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[["Reputation", p.rep, "text-white"], ["Trade Routes", p.routes, "text-blue-400"], ["Last Action", p.last, "text-slate-300"]].map(([l, v, c]) => (
                    <div key={l} className="text-center p-2 rounded-lg bg-slate-800/60"><p className="text-xs text-slate-400">{l}</p><p className={`text-lg font-bold ${c}`}>{v}</p></div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {actions.map((a) => <Button key={a.id} size="sm" variant="outline" className="bg-slate-800 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white">{a.name}</Button>)}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function TradeTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {TRADE_ROUTE_LEVELS.map((l) => (
          <Card key={l.level} className="bg-slate-900/80 border-slate-700/50 text-center">
            <CardContent className="p-3">
              <p className="text-xs text-slate-400">Level {l.level}</p>
              <p className="text-sm font-bold text-white">{l.name}</p>
              <p className="text-xs text-green-400">{l.incomeMultiplier}x income</p>
              <p className="text-xs text-slate-500">Max: {l.maxDistance}ly</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator className="bg-slate-700/50" />
      {tradeRoutes.map((r) => {
        const type = TRADE_ROUTE_TYPES.find((t) => t.type === r.type);
        const lvl = TRADE_ROUTE_LEVELS.find((l) => l.level === r.level);
        return (
          <Card key={r.id} className="bg-slate-900/80 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Route className="w-5 h-5 text-blue-400" /></div>
                  <div><h4 className="text-sm font-semibold text-white">{r.partner}</h4><p className="text-xs text-slate-400">{type?.name} - Level {r.level}</p></div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Coins className="w-3 h-3 mr-1" />+{r.income}/turn</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-slate-800/60"><p className="text-xs text-slate-400">Distance</p><p className="text-sm font-medium text-white">{r.dist}ly</p></div>
                <div className="p-2 rounded bg-slate-800/60"><p className="text-xs text-slate-400">Capacity</p><div className="flex items-center gap-2"><Progress value={r.cap} className="h-1.5 flex-1 bg-slate-700" /><span className="text-xs text-slate-300">{r.cap}%</span></div></div>
                <div className="p-2 rounded bg-slate-800/60"><p className="text-xs text-slate-400">Maintenance</p><p className="text-sm font-medium text-amber-400">{lvl?.maintenancePerTurn.credits}cr</p></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Card className="bg-slate-900/80 border-slate-700/50 border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
          <Route className="w-8 h-8 text-slate-600" />
          <p className="text-sm text-slate-400">Propose a new trade route</p>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white mt-2"><ArrowRightLeft className="w-4 h-4 mr-1" />New Trade Route</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EspionageTab() {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2"><CardTitle className="text-white text-sm flex items-center gap-2"><Eye className="w-4 h-4 text-purple-400" />Agent Roster</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {ESPIONAGE_AGENT_TIERS.map((t, i) => (
              <div key={t.tier} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2"><h4 className="text-sm font-semibold text-white">{t.name}</h4><Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Tier {i + 1}</Badge></div>
                <p className="text-xs text-slate-400 mb-2">{t.description}</p>
                <div className="space-y-1 text-xs">
                  {[["Success", `${t.baseSuccessRate}%`, "text-green-400"], ["Stealth", t.stealthRating, "text-blue-400"], ["Missions", t.maxConcurrentMissions, "text-slate-300"]].map(([l, v, c]) => (
                    <div key={String(l)} className="flex justify-between"><span className="text-slate-400">{l}</span><span className={String(c)}>{String(v)}</span></div>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white">Train ({t.trainingCost.credits.toLocaleString()}cr)</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2"><CardTitle className="text-white text-sm flex items-center gap-2"><Target className="w-4 h-4 text-amber-400" />Available Missions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ESPIONAGE_MISSIONS.map((m) => (
            <div key={m.mission} className={`p-3 rounded-lg border transition-colors cursor-pointer ${sel === m.mission ? "bg-slate-800 border-purple-500/30" : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"}`} onClick={() => setSel(sel === m.mission ? null : m.mission)}>
              <div className="flex items-center justify-between">
                <div><h4 className="text-sm font-semibold text-white">{m.name}</h4><p className="text-xs text-slate-400">{m.description}</p></div>
                <div className="text-right"><p className="text-xs text-amber-400">{m.baseCost.credits.toLocaleString()}cr</p><p className="text-xs text-slate-500">{m.durationMinutes}min</p></div>
              </div>
              {sel === m.mission && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-slate-400">Detection</span><p className="text-red-400">{m.detectionRisk}%</p></div>
                    <div><span className="text-slate-400">Required Tier</span><p className="text-purple-400 capitalize">{m.requiredAgentTier.replace("_", " ")}</p></div>
                    <div><span className="text-slate-400">Total Cost</span><p className="text-amber-400">{m.baseCost.credits.toLocaleString()}cr</p></div>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"><Send className="w-3 h-3 mr-1" />Deploy Agent</Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TributeTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-sm font-semibold text-white">Send Tribute</span></div>
            <p className="text-xs text-slate-400 mb-3">Offer resources to improve relations</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white"><Send className="w-4 h-4 mr-1" />Send Tribute</Button>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-sm font-semibold text-white">Received Tribute</span></div>
            <p className="text-xs text-slate-400 mb-3">Total received this cycle</p>
            <p className="text-2xl font-bold text-green-400">3,000 <span className="text-sm font-normal text-slate-400">credits</span></p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader className="pb-2"><CardTitle className="text-white text-sm flex items-center gap-2"><Scroll className="w-4 h-4 text-blue-400" />Diplomatic History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Badge className={badgeColor(h.action)}>{h.action.replace("_", " ")}</Badge><span className="text-xs text-slate-400">{h.from} &rarr; {h.to}</span></div>
                <span className="text-xs text-slate-500">{h.time}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-300">{h.amt}</span>
                <span className={`text-xs ${h.rep > 0 ? "text-green-400" : "text-red-400"}`}>{h.rep > 0 ? "+" : ""}{h.rep} rep</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FactionsTab() {
  return (
    <div className="space-y-4">
      {factions.map((f) => {
        const bonus = FACTION_DIPLOMACY_BONUSES[f.rel];
        return (
          <Card key={f.id} className="bg-slate-900/80 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center"><Users className="w-5 h-5 text-slate-400" /></div>
                  <div><h4 className="text-sm font-semibold text-white">{f.name}</h4><p className="text-xs text-slate-400">{bonus.description}</p></div>
                </div>
                <Badge className={relColor[f.rel]}>{RELATIONSHIP_TYPES[f.rel].name}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="p-2 rounded bg-slate-800/60 text-center"><p className="text-xs text-slate-400">Standing</p><p className={`text-sm font-bold ${f.standing >= 0 ? "text-green-400" : "text-red-400"}`}>{f.standing}</p></div>
                <div className="p-2 rounded bg-slate-800/60 text-center"><p className="text-xs text-slate-400">Trade</p><p className="text-sm font-bold text-blue-400">{bonus.tradeDiscount < 1 ? `${Math.round((1 - bonus.tradeDiscount) * 100)}% off` : "Standard"}</p></div>
                <div className="p-2 rounded bg-slate-800/60 text-center"><p className="text-xs text-slate-400">Tribute</p><p className="text-sm font-bold text-amber-400">{bonus.tributeMultiplier}x</p></div>
                <div className="p-2 rounded bg-slate-800/60 text-center"><p className="text-xs text-slate-400">Missions</p><p className="text-sm font-bold text-purple-400">{f.missions}</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-slate-800 border border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"><Coins className="w-3 h-3 mr-1" />Send Tribute</Button>
                <Button size="sm" className="flex-1 bg-slate-800 border border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"><Eye className="w-3 h-3 mr-1" />Gather Intel</Button>
                <Button size="sm" className="flex-1 bg-slate-800 border border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"><FileText className="w-3 h-3 mr-1" />View History</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Diplomacy() {
  const [tab, setTab] = useState<Tab>("overview");
  const rep = 62;
  const tier = REPUTATION_TIERS.find((t) => rep >= t.minReputation && rep <= t.maxReputation);

  return (
    <GameLayout>
      <div className="min-h-screen bg-slate-950 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Handshake className="w-6 h-6 text-blue-400" />Diplomacy</h1>
            <p className="text-sm text-slate-400">Manage relations, trade, and espionage</p>
          </div>
          <Card className="bg-slate-900/80 border-slate-700/50 px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="text-right"><p className="text-xs text-slate-400">Reputation</p><p className="text-sm font-bold text-white">{rep}/100</p></div>
              <div className="w-24"><Progress value={rep} className="h-2 bg-slate-800" /><p className="text-xs text-slate-500 mt-1">{tier?.title}</p></div>
            </div>
          </Card>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="bg-slate-900 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Users className="w-4 h-4 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="trade" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Route className="w-4 h-4 mr-1" />Trade Routes</TabsTrigger>
            <TabsTrigger value="espionage" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Eye className="w-4 h-4 mr-1" />Espionage</TabsTrigger>
            <TabsTrigger value="tribute" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Coins className="w-4 h-4 mr-1" />Tribute</TabsTrigger>
            <TabsTrigger value="factions" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Globe className="w-4 h-4 mr-1" />Factions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="trade"><TradeTab /></TabsContent>
          <TabsContent value="espionage"><EspionageTab /></TabsContent>
          <TabsContent value="tribute"><TributeTab /></TabsContent>
          <TabsContent value="factions"><FactionsTab /></TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
