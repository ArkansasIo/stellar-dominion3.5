import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Pickaxe, Gem, Droplet, Factory, ArrowLeftRight, TrendingUp, Zap, Warehouse,
  BarChart3, ArrowUpCircle, Clock, ShoppingCart, Route, ChevronRight,
  AlertTriangle, CheckCircle2, XCircle, Activity, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateResourceProduction, calculateStorageCapacity } from "@/lib/resourceMath";

const pct = (c: number, m: number) => m <= 0 ? 0 : Math.max(0, Math.min(100, (c / m) * 100));
const RI = { metal: Pickaxe, crystal: Gem, deuterium: Droplet } as const;
const RC = {
  metal: { bg: "bg-slate-800", text: "text-slate-300", accent: "text-blue-400", card: "from-slate-900 to-slate-800", border: "border-slate-700" },
  crystal: { bg: "bg-purple-900/30", text: "text-purple-300", accent: "text-purple-400", card: "from-purple-950 to-purple-900", border: "border-purple-700/50" },
  deuterium: { bg: "bg-teal-900/30", text: "text-teal-300", accent: "text-teal-400", card: "from-teal-950 to-teal-900", border: "border-teal-700/50" },
} as const;
const SEL = ["metal", "crystal", "deuterium"] as const;
const SEL_ITEMS = SEL.map(v => <SelectItem key={v} value={v} className="text-slate-200">{v[0].toUpperCase() + v.slice(1)}</SelectItem>);

const MOCK_TRADES = [
  { id: 1, sell: "metal", buy: "crystal", amount: 5000, rate: 1.2, time: "2m ago" },
  { id: 2, sell: "crystal", buy: "deuterium", amount: 3000, rate: 0.8, time: "5m ago" },
  { id: 3, sell: "deuterium", buy: "metal", amount: 2000, rate: 1.5, time: "12m ago" },
];
const MOCK_ROUTES = [
  { id: 1, from: "Homeworld", to: "Alpha Colony", resource: "metal" as const, income: 1200, distance: 4.2, time: "3h", active: true, level: 3 },
  { id: 2, from: "Alpha Colony", to: "Beta Station", resource: "crystal" as const, income: 800, distance: 7.8, time: "5h", active: true, level: 2 },
  { id: 3, from: "Beta Station", to: "Gamma Outpost", resource: "deuterium" as const, income: 600, distance: 12.1, time: "8h", active: false, level: 1 },
];
const BUILDINGS = [
  { id: "metalMine", name: "Metal Mine", icon: Pickaxe, color: "text-slate-400", prod: "metal" as const, eCost: 10 },
  { id: "crystalMine", name: "Crystal Mine", icon: Gem, color: "text-purple-400", prod: "crystal" as const, eCost: 10 },
  { id: "deuteriumSynthesizer", name: "Deuterium Synthesizer", icon: Droplet, color: "text-teal-400", prod: "deuterium" as const, eCost: 20 },
  { id: "solarPlant", name: "Solar Power Plant", icon: Zap, color: "text-amber-400", prod: null, eCost: 0 },
];
const CHAINS: Record<string, string[]> = {
  metal: ["Metal Mine", "Metal Storage", "Shipyard"],
  crystal: ["Crystal Mine", "Crystal Storage", "Research Lab"],
  deuterium: ["Deuterium Reactor", "Deuterium Tank", "Fleet"],
};

function ResCard({ type, amount, production, capacity }: { type: "metal" | "crystal" | "deuterium"; amount: number; production: number; capacity: number }) {
  const I = RI[type], c = RC[type], fill = pct(amount, capacity);
  return (
    <Card className={cn("bg-gradient-to-br border-2 overflow-hidden", c.card, c.border)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", c.bg)}><I className={cn("w-8 h-8", c.accent)} /></div>
          <div className="flex-1">
            <div className={cn("text-sm font-semibold uppercase tracking-wider", c.text)}>{type}</div>
            <div className="text-2xl font-orbitron font-bold text-white">{Math.floor(amount).toLocaleString()}</div>
          </div>
          {fill > 90 && <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Production/turn</span>
            <span className="font-mono text-green-400">+{production.toLocaleString()}</span>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Storage</span>
              <span className="text-slate-400">{Math.floor(amount).toLocaleString()} / {capacity.toLocaleString()}</span>
            </div>
            <Progress value={fill} className="h-2 bg-slate-700/50" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-slate-500 uppercase">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">{SEL_ITEMS}</SelectContent>
      </Select>
    </div>
  );
}

export default function Resources() {
  const { buildings, resources, updateBuilding } = useGame();
  const qc = useQueryClient();
  const [tab, setTab] = useState("overview");
  const [tSell, setTSell] = useState("metal");
  const [tBuy, setTBuy] = useState("crystal");
  const [tAmt, setTAmt] = useState(1000);
  const [rOrig, setROrig] = useState("");
  const [rDest, setRDest] = useState("");
  const [rRes, setRRes] = useState("metal");

  const prod = calculateResourceProduction(buildings);
  const mP = prod.metal, cP = prod.crystal, dP = prod.deuterium;
  const eProd = Math.max(0, prod.energy), eUse = Math.max(0, -prod.energy), eBal = eProd - eUse;
  const capM = calculateStorageCapacity(10000, buildings.metalMine);
  const capC = calculateStorageCapacity(10000, buildings.crystalMine);
  const capD = calculateStorageCapacity(10000, buildings.deuteriumSynthesizer);
  const totalP = mP + cP + dP;
  const totalVal = resources.metal + resources.crystal * 2 + resources.deuterium * 3;

  const rate = (s: string, b: string) => ({ metal: { crystal: 1.2, deuterium: 0.8 }, crystal: { metal: 0.83, deuterium: 0.67 }, deuterium: { metal: 1.25, crystal: 1.5 } } as any)[s]?.[b] ?? 1;
  const tradeMut = useMutation({ mutationFn: async () => new Promise(r => setTimeout(r, 300)), onSuccess: () => qc.invalidateQueries({ queryKey: ["game"] }) });

  const tabBtn = (v: string, Icon: any, label: string) => (
    <TabsTrigger key={v} value={v} className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">
      <Icon className="w-4 h-4 mr-1.5" />{label}
    </TabsTrigger>
  );

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-500/50"><Factory className="w-10 h-10 text-slate-300" /></div>
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Resource Management</h2>
              <p className="text-slate-400 font-rajdhani text-lg">Production chains, storage, and interstellar markets</p>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-900 border border-slate-700/50 p-1">
            {tabBtn("overview", BarChart3, "Overview")}
            {tabBtn("production", Factory, "Production")}
            {tabBtn("storage", Warehouse, "Storage")}
            {tabBtn("market", ArrowLeftRight, "Market")}
            {tabBtn("routes", Route, "Trade Routes")}
            {tabBtn("stats", Activity, "Statistics")}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResCard type="metal" amount={resources.metal} production={mP} capacity={capM} />
              <ResCard type="crystal" amount={resources.crystal} production={cP} capacity={capC} />
              <ResCard type="deuterium" amount={resources.deuterium} production={dP} capacity={capD} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-700/50"><CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Production/turn</div>
                <div className="text-xl font-orbitron font-bold text-white">{totalP.toLocaleString()}</div>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span className="text-blue-400">M:{mP}</span><span className="text-purple-400">C:{cP}</span><span className="text-teal-400">D:{dP}</span>
                </div>
              </CardContent></Card>
              <Card className={cn("border-slate-700/50", eBal >= 0 ? "bg-slate-900" : "bg-red-950/30 border-red-700/30")}><CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Energy Balance</span>
                  {eBal >= 0 ? <Zap className="w-4 h-4 text-amber-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className={cn("text-xl font-orbitron font-bold", eBal >= 0 ? "text-amber-400" : "text-red-400")}>{eBal >= 0 ? "+" : ""}{eBal}</div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-green-400">Prod: +{eProd}</span><span className="text-red-400">Use: -{eUse}</span>
                </div>
              </CardContent></Card>
              <Card className="bg-slate-900 border-slate-700/50"><CardContent className="p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Empire Value</div>
                <div className="text-xl font-orbitron font-bold text-white">{totalVal.toLocaleString()}</div>
                <div className="flex gap-3 mt-2 text-xs text-slate-400"><span>Trade Power: 1,240</span><span>Level: 12</span></div>
              </CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Factory className="w-4 h-4 text-blue-400" /> Production Chain</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SEL.map(r => {
                    const c = RC[r], I = RI[r], ch = CHAINS[r];
                    return (
                      <div key={r} className={cn("rounded-lg border p-4", c.border, "bg-slate-800/30")}>
                        <div className="flex items-center gap-2 mb-3"><I className={cn("w-5 h-5", c.accent)} /><span className="text-sm font-medium text-slate-300 uppercase">{r}</span></div>
                        <div className="space-y-2">{ch.map((s, i) => (
                          <div key={s} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400">{i + 1}</div>
                            <span className="text-sm text-slate-400">{s}</span>
                            {i < ch.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 ml-auto" />}
                          </div>
                        ))}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><ArrowUpCircle className="w-4 h-4 text-green-400" /> Building Management</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {BUILDINGS.map(b => {
                  const lv = (buildings as any)[b.id] || 0;
                  const cost = Math.floor(100 * Math.pow(1.5, lv)), costC = Math.floor(50 * Math.pow(1.5, lv)), bt = (lv + 1) * 10;
                  return (
                    <div key={b.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center"><b.icon className={cn("w-5 h-5", b.color)} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200 truncate">{b.name}</span>
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">Lv.{lv}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                          {b.prod && <span>Prod: <span className="text-green-400">+{Math.floor(30 * lv * (1 + lv / 10))}/h</span></span>}
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" />-{b.eCost * lv}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{bt}s</span>
                        </div>
                      </div>
                      <div className="text-right text-xs space-y-0.5">
                        <div className="text-slate-300">{cost.toLocaleString()} <span className="text-slate-500">M</span></div>
                        <div className="text-slate-300">{costC.toLocaleString()} <span className="text-slate-500">C</span></div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs border-slate-600 hover:bg-slate-700" onClick={() => updateBuilding(b.id, b.name, bt * 1000)}>
                        <ArrowUpCircle className="w-3.5 h-3.5 mr-1" /> Upgrade
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> Production Modifiers</CardTitle></CardHeader>
                <CardContent><div className="grid grid-cols-2 gap-3">
                  {[["Government", "+10%", "text-blue-400"], ["Race Bonus", "+5%", "text-purple-400"], ["Empire Level", "+8%", "text-teal-400"], ["Alliance", "+3%", "text-amber-400"], ["Season", "+12%", "text-green-400"], ["Premium", "+15%", "text-pink-400"]].map(([l, v, cl]) => (
                    <div key={l} className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-slate-700/30">
                      <span className="text-xs text-slate-500">{l}</span>
                      <span className={cn("text-xs font-mono font-bold", cl)}>{v}</span>
                    </div>
                  ))}
                </div></CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-400" /> Optimization Tips</CardTitle></CardHeader>
                <CardContent><div className="space-y-2">
                  {[["Upgrade Metal Mine to Level 8 for +2,400/h production", "high"], ["Energy deficit detected — build more Solar Plants", "critical"], ["Crystal Storage at 87% — upgrade recommended", "medium"]].map(([tip, pri], i) => (
                    <div key={i} className={cn("flex items-start gap-3 p-3 rounded border",
                      pri === "critical" ? "bg-red-950/20 border-red-700/30" : pri === "high" ? "bg-amber-950/20 border-amber-700/30" : "bg-slate-800/30 border-slate-700/30"
                    )}>
                      {pri === "critical" ? <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> : pri === "high" ? <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />}
                      <span className="text-sm text-slate-300">{tip}</span>
                    </div>
                  ))}
                </div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([["Metal Storage", Pickaxe, "text-blue-400", resources.metal, capM, buildings.metalMine],
                ["Crystal Storage", Gem, "text-purple-400", resources.crystal, capC, buildings.crystalMine],
                ["Deuterium Tank", Droplet, "text-teal-400", resources.deuterium, capD, buildings.deuteriumSynthesizer]] as const).map(([lbl, I, clr, cur, cap, lv]) => {
                const f = pct(cur, cap);
                return (
                  <div key={lbl} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3"><I className={cn("w-5 h-5", clr)} /><span className="font-medium text-slate-200">{lbl}</span></div>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">{Math.floor(cur).toLocaleString()}</span><span className="text-slate-500">{cap.toLocaleString()}</span></div>
                    <Progress value={f} className="h-2 bg-slate-700/50" />
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-slate-500">Upgrade: {Math.floor(500 * Math.pow(1.5, lv)).toLocaleString()} M</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-slate-400 hover:text-white"><ArrowUpCircle className="w-3 h-3 mr-1" />Upgrade</Button>
                    </div>
                    {f > 80 && <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400"><AlertTriangle className="w-3 h-3" /> Storage {Math.floor(f)}% full</div>}
                  </div>
                );
              })}
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> Resource Protection</CardTitle></CardHeader>
              <CardContent><div className="grid grid-cols-3 gap-4 text-center">
                {([["Metal Safe", capM], ["Crystal Safe", capC], ["Deuterium Safe", capD]] as [string, number][]).map(([l, c]) => (
                  <div key={l} className="p-3 rounded bg-slate-800/50 border border-slate-700/30">
                    <div className="text-xs text-slate-500 mb-1">{l}</div>
                    <div className="text-lg font-mono text-green-400">{Math.floor(c * 0.3).toLocaleString()}</div>
                  </div>
                ))}
              </div></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-blue-400" /> Exchange</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceSelect label="Sell" value={tSell} onChange={setTSell} />
                  <ResourceSelect label="Buy" value={tBuy} onChange={setTBuy} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Amount</span><span className="text-slate-400 font-mono">{tAmt.toLocaleString()}</span></div>
                  <Slider value={[tAmt]} onValueChange={v => setTAmt(v[0])} max={10000} step={100} className="w-full" />
                  <div className="flex gap-2">
                    {[2500, 5000, 7500, 10000].map(p => (
                      <Button key={p} variant="outline" size="sm" className="text-[10px] border-slate-700 text-slate-400 hover:text-white" onClick={() => setTAmt(p)}>{p / 100}%</Button>
                    ))}
                  </div>
                </div>
                <Separator className="bg-slate-700/50" />
                <div className="flex items-center justify-between p-3 rounded bg-slate-800/50 border border-slate-700/30">
                  <span className="text-sm text-slate-400">Exchange Rate</span>
                  <span className="text-sm font-mono text-white">1 {tSell} = {rate(tSell, tBuy).toFixed(2)} {tBuy}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Fee (2%)</span><span className="text-red-400 font-mono">-{Math.floor(tAmt * 0.02).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">You receive</span>
                  <span className="font-mono text-green-400 font-bold">+{Math.floor(tAmt * rate(tSell, tBuy) * 0.98).toLocaleString()} {tBuy}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-orbitron" onClick={() => tradeMut.mutate()} disabled={tradeMut.isPending}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Execute Trade
                </Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent Transactions</CardTitle></CardHeader>
                <CardContent><ScrollArea className="h-48"><div className="space-y-2">
                  {MOCK_TRADES.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-700/30 text-sm">
                      <div>
                        <span className="text-slate-300">{t.amount.toLocaleString()} {t.sell}</span>
                        <ArrowLeftRight className="w-3 h-3 inline mx-1 text-slate-600" />
                        <span className="text-green-400">{Math.floor(t.amount * t.rate * 0.98).toLocaleString()} {t.buy}</span>
                      </div>
                      <span className="text-[10px] text-slate-600">{t.time}</span>
                    </div>
                  ))}
                </div></ScrollArea></CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Trades</CardTitle></CardHeader>
                <CardContent><div className="grid grid-cols-2 gap-2">
                  {[["metal", "crystal", "M → C"], ["metal", "deuterium", "M → D"], ["crystal", "metal", "C → M"], ["crystal", "deuterium", "C → D"], ["deuterium", "metal", "D → M"], ["deuterium", "crystal", "D → C"]].map(([s, b, lbl]) => (
                    <Button key={lbl} variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white text-xs" onClick={() => { setTSell(s); setTBuy(b); }}>{lbl}</Button>
                  ))}
                </div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Route className="w-4 h-4 text-blue-400" /> Active Trade Routes</CardTitle></CardHeader>
              <CardContent><ScrollArea className="h-64"><div className="space-y-2">
                {MOCK_ROUTES.map(r => {
                  const I = RI[r.resource], c = RC[r.resource];
                  return (
                    <div key={r.id} className={cn("flex items-center gap-4 p-3 rounded border transition-colors", r.active ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-900/50 border-slate-800/50 opacity-60")}>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.bg)}><I className={cn("w-5 h-5", c.accent)} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-200 truncate">{r.from}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                          <span className="text-slate-200 truncate">{r.to}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{r.distance} AU</span><span>{r.time} travel</span><span className="text-green-400">+{r.income.toLocaleString()}/turn</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px]", r.active ? "border-green-700/50 text-green-400" : "border-slate-700 text-slate-600")}>Lv.{r.level}</Badge>
                      <Button size="sm" variant="ghost" className={cn("h-7 text-[10px]", r.active ? "text-green-400" : "text-slate-600")}>{r.active ? "Active" : "Paused"}</Button>
                    </div>
                  );
                })}
              </div></ScrollArea></CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Route className="w-4 h-4 text-blue-400" /> Route Builder</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><label className="text-xs text-slate-500 uppercase">Origin</label>
                    <Select value={rOrig} onValueChange={setROrig}><SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue placeholder="Select planet" /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="homeworld" className="text-slate-200">Homeworld</SelectItem>
                        <SelectItem value="alpha" className="text-slate-200">Alpha Colony</SelectItem>
                        <SelectItem value="beta" className="text-slate-200">Beta Station</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><label className="text-xs text-slate-500 uppercase">Destination</label>
                    <Select value={rDest} onValueChange={setRDest}><SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue placeholder="Select planet" /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="gamma" className="text-slate-200">Gamma Outpost</SelectItem>
                        <SelectItem value="delta" className="text-slate-200">Delta Hub</SelectItem>
                        <SelectItem value="epsilon" className="text-slate-200">Epsilon Deep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ResourceSelect label="Resource" value={rRes} onChange={setRRes} />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-orbitron"><Route className="w-4 h-4 mr-2" /> Establish Route</Button>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700/50"><CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Route Income</span>
                <span className="text-lg font-orbitron font-bold text-green-400">+{MOCK_ROUTES.filter(r => r.active).reduce((s, r) => s + r.income, 0).toLocaleString()}/turn</span>
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Resource History</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-40 flex items-end gap-1">
                    {Array.from({ length: 24 }, (_, i) => <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400/60 rounded-t" style={{ height: `${20 + Math.sin(i / 3) * 40 + Math.random() * 20}%` }} />)}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-600"><span>24h ago</span><span>Now</span></div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700/50">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Expenditure Breakdown</CardTitle></CardHeader>
                <CardContent><div className="space-y-3">
                  {([["Construction", 42], ["Research", 28], ["Fleet", 18], ["Trade", 12]] as [string, number][]).map(([l, p]) => (
                    <div key={l}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{l}</span><span className="text-slate-500 font-mono">{p}%</span></div>
                      <Progress value={p} className="h-2 bg-slate-700/50" />
                    </div>
                  ))}
                </div></CardContent>
              </Card>
            </div>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Efficiency & Comparison</CardTitle></CardHeader>
              <CardContent><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[["Efficiency Rating", "87%", "text-green-400", "Above average"], ["Your Production", totalP.toLocaleString(), "text-white", "per turn"], ["Server Average", Math.floor(totalP * 0.7).toLocaleString(), "text-slate-400", `+${Math.floor((totalP / (totalP * 0.7) - 1) * 100)}% above`]].map(([l, v, cl, sub]) => (
                  <div key={l} className="p-3 rounded bg-slate-800/50 border border-slate-700/30 text-center">
                    <div className="text-xs text-slate-500 mb-1">{l}</div>
                    <div className={cn("text-2xl font-orbitron font-bold", cl)}>{v}</div>
                    <div className="text-[10px] text-slate-600">{sub}</div>
                  </div>
                ))}
              </div></CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700/50">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Milestones</CardTitle></CardHeader>
              <CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{ l: "First Million", d: "1M total resources", u: true }, { l: "Energy Master", d: "50+ energy surplus", u: eBal >= 50 }, { l: "Trade Baron", d: "100 trades completed", u: false }, { l: "Empire Titan", d: "10M resource value", u: totalVal >= 10_000_000 }].map((m, i) => (
                  <div key={i} className={cn("p-3 rounded border text-center", m.u ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-900/50 border-slate-800/50 opacity-50")}>
                    <div className={cn("w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-2", m.u ? "bg-green-900/50" : "bg-slate-800")}>
                      {m.u ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="text-xs font-medium text-slate-300">{m.l}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{m.d}</div>
                  </div>
                ))}
              </div></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
