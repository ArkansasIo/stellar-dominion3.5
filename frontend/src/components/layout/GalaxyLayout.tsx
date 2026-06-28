import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useGame } from '@/lib/gameContext';
import { cn } from '@/lib/utils';
import GalaxyViewer from '@/components/galaxy-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Search,
  Info,
  Users,
  Building2,
  Zap,
  Shield,
  Star,
  Orbit,
  MapPin,
  Activity,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface GalaxyLayoutProps {
  children?: React.ReactNode;
}

export default function GalaxyLayout({ children }: GalaxyLayoutProps) {
  const [location] = useLocation();
  const { resources, planetName, coordinates } = useGame();
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [hoveredSystemId, setHoveredSystemId] = useState<string | null>(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  const handleSystemSelect = (system: any) => {
    setSelectedSystem(system);
    setSelectedPlanet(null);
  };

  const handleSystemHover = (systemId: string | null) => {
    setHoveredSystemId(systemId);
  };

  const handlePlanetSelect = (data: { system: any; planet: any }) => {
    setSelectedSystem(data.system);
    setSelectedPlanet(data.planet);
  };

  return (
    <div className="min-h-screen text-slate-900 overflow-hidden flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="relative z-20 h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-sm">
              <Globe className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-lg tracking-wider text-slate-900">
                STELLAR <span className="text-primary text-sm font-normal">DOMINION</span>
              </h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Galaxy Map - Interactive 3D View
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Game
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Left Sidebar - Navigation & System Info */}
        <aside className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
          leftSidebarCollapsed ? "w-12" : "w-80"
        )}>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className={cn("font-orbitron font-bold text-sm", leftSidebarCollapsed && "hidden")}>
              NAVIGATION
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {!leftSidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Current System Info */}
              {selectedSystem && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {selectedSystem.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-500" />
                        <span>Economy: {selectedSystem.metrics.economy}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-red-500" />
                        <span>Threat: {selectedSystem.metrics.threat}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span>Logistics: {selectedSystem.metrics.logistics}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span>Command: {selectedSystem.metrics.command}%</span>
                      </div>
                    </div>

                    {selectedSystem.hasJumpGate && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Jump Gate
                      </Badge>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {selectedSystem.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Planet Details */}
              {selectedPlanet && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      {selectedPlanet.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Biome: <Badge variant="outline">{selectedPlanet.biome}</Badge></div>
                      <div>Class: <Badge variant="outline">{selectedPlanet.worldClass}</Badge></div>
                      <div>Habitability: {selectedPlanet.habitability}%</div>
                      <div>Resources: {selectedPlanet.resourceValue}%</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Search Systems
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Jump to System
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Orbit className="w-4 h-4 mr-2" />
                    Fleet Movement
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </aside>

        {/* Center - 3D Galaxy Viewer */}
        <main className="flex-1 relative">
          <GalaxyViewer
            seed={1}
            systemCount={420}
            onSystemSelect={handleSystemSelect}
            onSystemHover={handleSystemHover}
            onPlanetSelect={handlePlanetSelect}
          />

          {/* Overlay UI */}
          <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
            <div className="text-sm font-orbitron">
              {hoveredSystemId ? `Hovering: System ${hoveredSystemId}` : 'Hover over systems for info'}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Detailed Info & Tools */}
        <aside className={cn(
          "bg-white border-l border-slate-200 flex flex-col transition-all duration-300",
          rightSidebarCollapsed ? "w-12" : "w-96"
        )}>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className={cn("font-orbitron font-bold text-sm", rightSidebarCollapsed && "hidden")}>
              SYSTEM DETAILS
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              className="p-1"
            >
              {rightSidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {!rightSidebarCollapsed && (
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="p-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="planets">Planets</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  {selectedSystem ? (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{selectedSystem.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedSystem.sector}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Economy</span>
                                <span className="font-bold text-blue-600">{selectedSystem.metrics.economy}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Threat</span>
                                <span className="font-bold text-red-600">{selectedSystem.metrics.threat}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Logistics</span>
                                <span className="font-bold text-green-600">{selectedSystem.metrics.logistics}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Command</span>
                                <span className="font-bold text-purple-600">{selectedSystem.metrics.command}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Celestial Objects</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Planets</span>
                              <span>{selectedSystem.planets.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stations</span>
                              <span>{selectedSystem.stations.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Asteroid Belts</span>
                              <span>{selectedSystem.asteroidBelts.length}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a system to view details</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="planets" className="space-y-4 mt-4">
                  {selectedSystem?.planets.map((planet: any, index: number) => (
                    <Card key={planet.id} className={cn(
                      "cursor-pointer transition-colors",
                      selectedPlanet?.id === planet.id && "ring-2 ring-primary"
                    )} onClick={() => setSelectedPlanet(planet)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{planet.name}</h4>
                            <p className="text-sm text-muted-foreground">{planet.biome} • {planet.worldClass}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div>Habitability: {planet.habitability}%</div>
                            <div>Resources: {planet.resourceValue}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No planets selected</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Button className="w-full" disabled={!selectedSystem}>
                      <Building2 className="w-4 h-4 mr-2" />
                      Colonize Planet
                    </Button>
                    <Button variant="outline" className="w-full" disabled={!selectedSystem}>
                      <Users className="w-4 h-4 mr-2" />
                      Send Expedition
                    </Button>
                    <Button variant="outline" className="w-full" disabled={!selectedSystem}>
                      <Shield className="w-4 h-4 mr-2" />
                      Establish Outpost
                    </Button>
                    <Button variant="outline" className="w-full" disabled={!selectedSystem}>
                      <Zap className="w-4 h-4 mr-2" />
                      Research Anomaly
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}