import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORBITAL_BUILDINGS, StationBuilding } from "@/lib/stationData";
import { Satellite, Moon, Building2, Clock, Box, Gem, Database, TrendingUp, Hammer } from "lucide-react";
import { useEffect, useState } from "react";

type StationsTab = "moon" | "station";

function formatTime(seconds: number): string {
  if (seconds >= 86400) {
    return `${Math.round(seconds / 86400)}d`;
  } else if (seconds >= 3600) {
    return `${Math.round(seconds / 3600)}h`;
  } else if (seconds >= 60) {
    return `${Math.round(seconds / 60)}m`;
  }
  return `${seconds}s`;
}

function BuildingCard({ building, level = 0 }: { building: StationBuilding; level?: number }) {
  const Icon = building.icon;
  const cost = {
    metal: Math.round(building.baseCost.metal * Math.pow(building.costFactor, level)),
    crystal: Math.round(building.baseCost.crystal * Math.pow(building.costFactor, level)),
    deuterium: Math.round(building.baseCost.deuterium * Math.pow(building.costFactor, level))
  };
  const buildTime = Math.round(building.buildTime * Math.pow(building.costFactor, level));
  
  const typeColors: Record<string, { bg: string; border: string; badge: string }> = {
    moon: { bg: "bg-slate-50", border: "border-slate-300", badge: "bg-slate-100 text-slate-700" },
    station: { bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-100 text-blue-700" },
    planet: { bg: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-700" }
  };
  
  const colors = typeColors[building.type] || typeColors.planet;
  
  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`} data-testid={`card-building-${building.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{building.name}</CardTitle>
              <Badge className={colors.badge}>
                {building.type === 'moon' ? '🌙 Moon' : building.type === 'station' ? '🛸 Station' : '🌍 Planet'}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">{building.description}</p>
        
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Hammer className="w-3 h-3" /> CONSTRUCTION COST (Level {level + 1})
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-slate-50 rounded">
              <Box className="w-4 h-4 text-slate-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Metal</p>
              <p className="font-bold text-sm">{cost.metal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <Gem className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-500">Crystal</p>
              <p className="font-bold text-sm text-blue-700">{cost.crystal.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <Database className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-500">Deuterium</p>
              <p className="font-bold text-sm text-green-700">{cost.deuterium.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Build Time:</span>
          </div>
          <span className="font-bold text-amber-900">{formatTime(buildTime)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Cost Factor: x{building.costFactor}</span>
        </div>

        <Button className="w-full" data-testid={`button-build-${building.id}`}>
          <TrendingUp className="w-4 h-4 mr-2" />
          {level === 0 ? 'Construct' : 'Upgrade to Level ' + (level + 1)}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Stations() {
  const moonBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'moon');
  const stationBuildings = ORBITAL_BUILDINGS.filter(b => b.type === 'station');
  const [activeTab, setActiveTab] = useState<StationsTab>("moon");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "moon" || tabParam === "station") {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);

    const nextUrl = `/stations?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeTab]);
  
  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-stations-title">
            <Satellite className="w-10 h-10 text-blue-500" />
            Orbital Stations
          </h1>
          <p className="text-slate-600 mt-2">Construct and manage moon bases and space stations with progression from Tiers 1-99 and Levels 1-999.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-4 text-center">
              <Moon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{moonBuildings.length}</p>
              <p className="text-xs text-slate-700">Moon Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Satellite className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{stationBuildings.length}</p>
              <p className="text-xs text-blue-700">Station Facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{ORBITAL_BUILDINGS.length}</p>
              <p className="text-xs text-purple-700">Total Buildings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StationsTab)} className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="moon" data-testid="tab-moon-buildings">
              <Moon className="w-4 h-4 mr-2" />
              Moon Facilities
            </TabsTrigger>
            <TabsTrigger value="station" data-testid="tab-station-buildings">
              <Satellite className="w-4 h-4 mr-2" />
              Station Facilities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moon" className="mt-4">
            <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Moon Facilities
              </h3>
              <p className="text-sm text-slate-600">
                Moon facilities provide unique strategic advantages. The Sensor Phalanx allows you to spy on fleet movements, 
                while Jump Gates enable instant fleet transfers between your moons.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moonBuildings.map(building => (
                <BuildingCard key={building.id} building={building} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="station" className="mt-4">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                Space Station Facilities
              </h3>
              <p className="text-sm text-blue-600">
                Space stations serve as orbital hubs for trade, defense, and ship construction. 
                Zero-gravity manufacturing allows for faster capital ship production.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stationBuildings.map(building => (
                <BuildingCard key={building.id} building={building} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Orbital Construction Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Progression:</strong> Orbital facilities scale through <strong>Tiers 1-99</strong> and <strong>Levels 1-999</strong>, combining milestone upgrades with long-term level growth.
            </p>
            <p>
              <strong>Lunar Base:</strong> Required first before any other moon construction. 
              Provides the foundation for all lunar operations.
            </p>
            <p>
              <strong>Sensor Phalanx:</strong> Essential for intelligence gathering. 
              Can detect enemy fleet movements on neighboring planets.
            </p>
            <p>
              <strong>Jump Gates:</strong> Expensive but invaluable. 
              Allow instant, free fleet transfers between your moons - perfect for rapid response.
            </p>
            <p>
              <strong>Starbase Hub:</strong> The command center of your space station. 
              Increases overall station durability and unlocks advanced facilities.
            </p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
