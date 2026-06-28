import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { WARP_GATES, TRADE_ROUTES, WarpGate, TradeRoute, calculateWarpTime, calculateWarpCost } from "@/lib/warpNetwork";
import { FRONTIER_FEATURES, WORMHOLE_ROUTES, type WormholeRoute } from "@/lib/wormholeStrongholdCatalog";
import { Orbit, Zap, Clock, Link2, TrendingUp, AlertTriangle, Navigation, Truck, ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

function WarpGateCard({ gate, onAction }: { gate: WarpGate; onAction: (gate: WarpGate) => void }) {
  const linkedGateNames = gate.linkedGates.map(id => 
    WARP_GATES.find(g => g.id === id)?.name || id
  );
  
  return (
    <Card className={`border-2 ${gate.owned ? 'border-green-300 bg-green-50/30' : 'border-slate-200'}`} data-testid={`card-gate-${gate.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Orbit className={`w-6 h-6 ${gate.owned ? 'text-green-600' : 'text-slate-400'}`} />
            <div>
              <CardTitle className="text-lg">{gate.name}</CardTitle>
              <p className="text-xs text-slate-500 font-mono">{gate.coordinates}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={gate.owned ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
              {gate.owned ? 'Owned' : 'Unclaimed'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Level {gate.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <Zap className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Energy Cost</p>
            <p className="font-bold text-sm">{gate.energyCost}</p>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Cooldown</p>
            <p className="font-bold text-sm">{gate.cooldown}s</p>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <Link2 className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Links</p>
            <p className="font-bold text-sm">{gate.linkedGates.length}</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Link2 className="w-3 h-3" /> CONNECTED GATES
          </p>
          <div className="flex flex-wrap gap-2">
            {linkedGateNames.map((name, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
          </div>
        </div>

        {gate.owned && gate.owner && (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <MapPin className="w-3 h-3" />
            <span>Controlled by: {gate.owner}</span>
          </div>
        )}

        {!gate.owned && gate.constructionTime > 0 && (
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <Clock className="w-3 h-3 inline mr-1" />
              Construction Time: {Math.round(gate.constructionTime / 3600)}h
            </p>
          </div>
        )}

        <Button 
          className="w-full" 
          variant={gate.owned ? "default" : "outline"}
          onClick={() => onAction(gate)}
          data-testid={`button-gate-${gate.id}`}
        >
          {gate.owned ? (
            <>
              <Navigation className="w-4 h-4 mr-2" />
              Initiate Jump
            </>
          ) : (
            <>
              <Orbit className="w-4 h-4 mr-2" />
              Claim Gate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function TradeRouteCard({ route, onAction }: { route: TradeRoute; onAction: (route: TradeRoute) => void }) {
  const riskColor = route.risk <= 3 ? 'text-green-600' : route.risk <= 6 ? 'text-yellow-600' : 'text-red-600';
  const riskBg = route.risk <= 3 ? 'bg-green-100' : route.risk <= 6 ? 'bg-yellow-100' : 'bg-red-100';
  
  const resourceIcons: Record<string, string> = {
    metal: '🔩',
    crystal: '💎',
    deuterium: '⚗️'
  };
  
  return (
    <Card className={`border-2 ${route.active ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200'}`} data-testid={`card-route-${route.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">From</p>
              <p className="font-mono text-sm font-bold">{route.from}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
            <div className="text-center">
              <p className="text-xs text-slate-500">To</p>
              <p className="font-mono text-sm font-bold">{route.to}</p>
            </div>
          </div>
          <Badge className={route.active ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}>
            {route.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <span className="text-lg">{resourceIcons[route.resource]}</span>
            <p className="text-xs text-slate-500 capitalize">{route.resource}</p>
          </div>
          <div className="p-2 bg-green-50 rounded border border-green-200 text-center">
            <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
            <p className="text-xs text-green-600">+{route.profit}%</p>
            <p className="text-[10px] text-green-500">Profit</p>
          </div>
          <div className="p-2 bg-blue-50 rounded border border-blue-200 text-center">
            <Navigation className="w-4 h-4 text-blue-600 mx-auto" />
            <p className="text-xs text-blue-600">{route.distance}</p>
            <p className="text-[10px] text-blue-500">Distance</p>
          </div>
          <div className={`p-2 ${riskBg} rounded border text-center`}>
            <AlertTriangle className={`w-4 h-4 ${riskColor} mx-auto`} />
            <p className={`text-xs ${riskColor}`}>{route.risk}/10</p>
            <p className={`text-[10px] ${riskColor}`}>Risk</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Every {route.frequency}h
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Automated Trading
          </span>
        </div>

        <Button 
          className="w-full" 
          variant={route.active ? "default" : "outline"}
          onClick={() => onAction(route)}
          data-testid={`button-route-${route.id}`}
        >
          {route.active ? 'Manage Route' : 'Activate Route'}
        </Button>
      </CardContent>
    </Card>
  );
}

function WormholeRouteCard({ route, onAction }: { route: WormholeRoute; onAction: (route: WormholeRoute) => void }) {
  return (
    <Card className={`border-2 ${route.status === "stabilized" ? "border-emerald-300 bg-emerald-50/40" : route.status === "stabilizing" ? "border-amber-300 bg-amber-50/40" : "border-slate-200"}`} data-testid={`card-wormhole-${route.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{route.name}</CardTitle>
            <p className="text-xs text-slate-500">{route.className} · {route.locus}</p>
          </div>
          <Badge className={route.status === "stabilized" ? "bg-emerald-100 text-emerald-800" : route.status === "stabilizing" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}>
            {route.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border border-slate-200 bg-white p-2 text-center">
            <div className="text-xs text-slate-500">Lifetime</div>
            <div className="font-bold text-slate-900">{route.lifetimeHours}h</div>
          </div>
          <div className="rounded border border-slate-200 bg-white p-2 text-center">
            <div className="text-xs text-slate-500">Mass Band</div>
            <div className="font-bold text-slate-900">{route.massCapacity}</div>
          </div>
          <div className="rounded border border-slate-200 bg-white p-2 text-center">
            <div className="text-xs text-slate-500">Risk</div>
            <div className={`font-bold ${route.risk >= 8 ? "text-red-600" : route.risk >= 6 ? "text-amber-600" : "text-green-600"}`}>{route.risk}/10</div>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Destination Mask</div>
          <div className="mt-1">{route.destinationMask}</div>
          <div className="mt-2 text-xs text-slate-500">Transit Profile: {route.transitProfile}</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600">System Links</div>
          <div className="flex flex-wrap gap-2">
            {route.connectedSystems.map((system) => (
              <Badge key={system} variant="outline" className="text-xs">
                {system}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600">Blueprint Hooks</div>
          <div className="flex flex-wrap gap-2">
            {route.blueprintHooks.map((hook) => (
              <Badge key={hook} className="bg-indigo-100 text-indigo-800">
                {hook}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full" variant={route.status === "stabilized" ? "default" : "outline"} onClick={() => onAction(route)} data-testid={`button-wormhole-${route.id}`}>
          {route.status === "stabilized" ? "Route Fleet Through Exit" : "Stabilize Wormhole"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function WarpNetwork() {
  const { toast } = useToast();
  const [gates, setGates] = useState<WarpGate[]>(WARP_GATES);
  const [routes, setRoutes] = useState<TradeRoute[]>(TRADE_ROUTES);
  const [wormholes, setWormholes] = useState<WormholeRoute[]>(WORMHOLE_ROUTES);

  const ownedGates = gates.filter(g => g.owned).length;
  const activeRoutes = routes.filter(r => r.active).length;
  const totalProfit = routes.filter(r => r.active).reduce((sum, r) => sum + r.profit, 0);
  const averageRisk = routes.length > 0
    ? Math.round(routes.reduce((sum, route) => sum + route.risk, 0) / routes.length)
    : 0;
  const connectedGateLinks = gates.reduce((sum, gate) => sum + gate.linkedGates.length, 0);
  const stabilizedWormholes = wormholes.filter((wormhole) => wormhole.status === "stabilized").length;
  const wormholeMassCapacity = wormholes.reduce((sum, wormhole) => sum + wormhole.massCapacity, 0);
  const averageWormholeRisk = wormholes.length > 0
    ? Math.round(wormholes.reduce((sum, wormhole) => sum + wormhole.risk, 0) / wormholes.length)
    : 0;
  const frontierLinks = FRONTIER_FEATURES.length;

  const handleGateAction = (gate: WarpGate) => {
    if (!gate.owned) {
      setGates((current) =>
        current.map((entry) =>
          entry.id === gate.id
            ? { ...entry, owned: true, owner: "Commander", constructionTime: 0 }
            : entry,
        ),
      );
      toast({
        title: "Warp gate claimed",
        description: `${gate.name} is now part of your operational network.`,
      });
      return;
    }

    const jumpDistance = Math.max(1, gate.linkedGates.length);
    const travelSeconds = calculateWarpTime(gate.level, jumpDistance);
    const deuteriumCost = calculateWarpCost(gate.level, jumpDistance);
    const destinationName = gates.find((entry) => entry.id === gate.linkedGates[0])?.name ?? "linked destination";
    toast({
      title: "Warp jump initiated",
      description: `${gate.name} is routing to ${destinationName}. ETA ${Math.ceil(travelSeconds / 60)}m for ${deuteriumCost.toLocaleString()} deuterium.`,
    });
  };

  const handleRouteAction = (route: TradeRoute) => {
    if (!route.active) {
      setRoutes((current) => current.map((entry) => (
        entry.id === route.id ? { ...entry, active: true } : entry
      )));
      toast({
        title: "Trade route activated",
        description: `${route.from} to ${route.to} now ships ${route.resource}.`,
      });
      return;
    }

    const optimizedRoute: TradeRoute = {
      ...route,
      profit: Math.min(route.profit + 5, 150),
      risk: Math.max(route.risk - 1, 1),
      frequency: Math.max(route.frequency - 1, 1),
    };
    setRoutes((current) =>
      current.map((entry) => (
        entry.id === route.id ? optimizedRoute : entry
      )),
    );

    toast({
      title: "Route management updated",
      description: `${optimizedRoute.from} to ${optimizedRoute.to} now yields +${optimizedRoute.profit}% at risk ${optimizedRoute.risk}/10.`,
    });
  };

  const handleWormholeAction = (route: WormholeRoute) => {
    if (route.status !== "stabilized") {
      setWormholes((current) =>
        current.map((entry) =>
          entry.id === route.id
            ? { ...entry, status: "stabilized", lifetimeHours: entry.lifetimeHours + 6, risk: Math.max(entry.risk - 1, 1) }
            : entry,
        ),
      );
      toast({
        title: "Wormhole stabilized",
        description: `${route.name} is now routable. Lifetime extended and transit safety improved for frontier fleets.`,
      });
      return;
    }

    toast({
      title: "Frontier route engaged",
      description: `${route.name} is routing ${route.transitProfile.toLowerCase()} toward ${route.destinationMask}.`,
    });
  };
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-warp-title">
            <Orbit className="w-10 h-10 text-purple-500" />
            Warp Network
          </h1>
          <p className="text-slate-600 mt-2">Control warp gates and manage trade routes across the galaxy</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Orbit className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{ownedGates}</p>
              <p className="text-xs text-purple-700">Owned Gates</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Link2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{gates.length}</p>
              <p className="text-xs text-blue-700">Total Gates</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{activeRoutes}</p>
              <p className="text-xs text-green-700">Active Routes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-900">+{totalProfit}%</p>
              <p className="text-xs text-amber-700">Total Profit</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="pt-6"><div className="text-xs uppercase text-slate-500">Average Route Risk</div><div className="text-2xl font-bold text-rose-700">{averageRisk}/10</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="pt-6"><div className="text-xs uppercase text-slate-500">Gate Links</div><div className="text-2xl font-bold text-indigo-700">{connectedGateLinks}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="pt-6"><div className="text-xs uppercase text-slate-500">Network Efficiency</div><div className="text-2xl font-bold text-emerald-700">{ownedGates > 0 ? Math.round((activeRoutes / Math.max(1, ownedGates)) * 100) : 0}%</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Stable Wormholes</div>
              <div className="text-2xl font-bold text-violet-700">{stabilizedWormholes}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Mass Capacity</div>
              <div className="text-2xl font-bold text-slate-900">{wormholeMassCapacity}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Wormhole Risk</div>
              <div className="text-2xl font-bold text-amber-700">{averageWormholeRisk}/10</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Frontier Links</div>
              <div className="text-2xl font-bold text-cyan-700">{frontierLinks}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="gates" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="gates" data-testid="tab-warp-gates">
              <Orbit className="w-4 h-4 mr-2" />
              Warp Gates
            </TabsTrigger>
            <TabsTrigger value="routes" data-testid="tab-trade-routes">
              <Truck className="w-4 h-4 mr-2" />
              Trade Routes
            </TabsTrigger>
            <TabsTrigger value="wormholes" data-testid="tab-wormhole-routes">
              <Zap className="w-4 h-4 mr-2" />
              Wormholes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gates.map(gate => (
                <WarpGateCard key={gate.id} gate={gate} onAction={handleGateAction} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="routes" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map(route => (
                <TradeRouteCard key={route.id} route={route} onAction={handleRouteAction} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wormholes" className="mt-4 space-y-4">
            <Card className="border-violet-200 bg-violet-50">
              <CardHeader>
                <CardTitle className="text-violet-900">Wormhole Transit Doctrine</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-violet-900">
                <div className="rounded border border-violet-200 bg-white/80 p-3">Stabilize exits first when you need repeatable logistics, refinery gas chains, or blueprint transport.</div>
                <div className="rounded border border-violet-200 bg-white/80 p-3">Use unstable exits for fast raids, relic dives, and one-way offensive pushes where collapse risk is acceptable.</div>
                <div className="rounded border border-violet-200 bg-white/80 p-3">Tie observatories and strongholds to the network so scan quality, siege timing, and route prediction feed each other.</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wormholes.map((route) => (
                <WormholeRouteCard key={route.id} route={route} onAction={handleWormholeAction} />
              ))}
            </div>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Frontier Systems Integration</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                {FRONTIER_FEATURES.map((feature) => (
                  <div key={feature.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                    <div className="font-semibold text-slate-900">{feature.name}</div>
                    <div className="mt-1">{feature.summary}</div>
                    <div className="mt-2 text-xs text-slate-500">{feature.gameplay}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Warp Network Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Warp Gates:</strong> Allow instant fleet travel between connected gates. 
              Higher level gates have lower energy costs and cooldowns.
            </p>
            <p>
              <strong>Trade Routes:</strong> Automated trading between locations. 
              Higher profit routes often have higher risk - balance your portfolio carefully.
            </p>
            <p>
              <strong>Gate Networks:</strong> Connect multiple gates to create efficient travel networks. 
              Strategic gate placement can give you a significant advantage.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Network Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Anchor core logistics through low-risk routes for baseline economy stability.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Use high-profit links selectively with escort doctrines and redundancy routes.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Expand gate ownership in clusters to reduce travel friction and response latency.</div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
