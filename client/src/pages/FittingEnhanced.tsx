import { useState, useEffect } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Cpu,
  Zap,
  Settings,
  Shield,
  Target,
  Navigation,
  Cog,
  Search,
  Filter,
  Save,
  Trash2,
  Copy,
  Info
} from "lucide-react";
import {
  SHIP_FITTING_MODULES,
  ShipModule,
  getModulesByType,
  getModulesByCategory,
  MODULE_CATEGORIES,
  SLOT_TYPES,
  TOTAL_MODULES
} from "@/lib/shipFittingModules";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface ShipHull {
  id: string;
  name: string;
  class: string;
  size: string;
  slots: {
    high: number;
    mid: number;
    low: number;
    rig: number;
  };
  resources: {
    cpu: number;
    powergrid: number;
    calibration: number;
    capacitor: number;
  };
  baseStats: {
    hp: number;
    shield: number;
    armor: number;
    cargo: number;
    velocity: number;
    mass: number;
  };
}

interface FittedModule {
  moduleId: string;
  slotType: string;
  slotIndex: number;
}

// Sample ship hulls
const SHIP_HULLS: { [key: string]: ShipHull } = {
  frigate_t1: {
    id: "frigate_t1",
    name: "Merlin Class Frigate",
    class: "Frigate",
    size: "small",
    slots: { high: 3, mid: 3, low: 2, rig: 2 },
    resources: { cpu: 150, powergrid: 45, calibration: 400, capacitor: 350 },
    baseStats: { hp: 450, shield: 800, armor: 350, cargo: 150, velocity: 350, mass: 1200000 }
  },
  cruiser_t1: {
    id: "cruiser_t1",
    name: "Vexor Class Cruiser",
    class: "Cruiser",
    size: "medium",
    slots: { high: 4, mid: 4, low: 5, rig: 2 },
    resources: { cpu: 350, powergrid: 950, calibration: 400, capacitor: 1250 },
    baseStats: { hp: 1800, shield: 1500, armor: 1600, cargo: 400, velocity: 220, mass: 11500000 }
  },
  battleship_t1: {
    id: "battleship_t1",
    name: "Raven Class Battleship",
    class: "Battleship",
    size: "large",
    slots: { high: 8, mid: 6, low: 6, rig: 3 },
    resources: { cpu: 750, powergrid: 18000, calibration: 400, capacitor: 5850 },
    baseStats: { hp: 8500, shield: 7500, armor: 6800, cargo: 650, velocity: 95, mass: 108000000 }
  }
};

export default function FittingEnhanced() {
  const [selectedHull, setSelectedHull] = useState<ShipHull | null>(null);
  const [fittedModules, setFittedModules] = useState<FittedModule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedSlot, setSelectedSlot] = useState<{ type: string; index: number } | null>(null);
  
  // Calculate used resources
  const usedResources = fittedModules.reduce((acc, fitted) => {
    const module = SHIP_FITTING_MODULES[fitted.moduleId];
    if (module) {
      acc.cpu += module.cpu;
      acc.powergrid += module.powergrid;
      if (module.calibration) acc.calibration += module.calibration;
    }
    return acc;
  }, { cpu: 0, powergrid: 0, calibration: 0 });

  const handleSelectHull = (hullId: string) => {
    setSelectedHull(SHIP_HULLS[hullId]);
    setFittedModules([]);
  };

  const handleFitModule = (moduleId: string) => {
    if (!selectedSlot || !selectedHull) return;
    
    const module = SHIP_FITTING_MODULES[moduleId];
    if (!module) return;

    // Check if module fits ship size
    if (module.size !== "universal" && module.size !== selectedHull.size) {
      alert(`This module is for ${module.size} ships only!`);
      return;
    }

    // Check resources
    const newCpu = usedResources.cpu + module.cpu;
    const newPg = usedResources.powergrid + module.powergrid;
    const newCal = usedResources.calibration + (module.calibration || 0);

    if (newCpu > selectedHull.resources.cpu) {
      alert("Not enough CPU!");
      return;
    }
    if (newPg > selectedHull.resources.powergrid) {
      alert("Not enough Powergrid!");
      return;
    }
    if (module.calibration && newCal > selectedHull.resources.calibration) {
      alert("Not enough Calibration!");
      return;
    }

    // Remove existing module in slot
    const newFitted = fittedModules.filter(
      f => !(f.slotType === selectedSlot.type && f.slotIndex === selectedSlot.index)
    );

    // Add new module
    newFitted.push({
      moduleId,
      slotType: selectedSlot.type,
      slotIndex: selectedSlot.index
    });

    setFittedModules(newFitted);
    setSelectedSlot(null);
  };

  const handleRemoveModule = (slotType: string, slotIndex: number) => {
    setFittedModules(fittedModules.filter(
      f => !(f.slotType === slotType && f.slotIndex === slotIndex)
    ));
  };

  const getModuleInSlot = (slotType: string, slotIndex: number): ShipModule | null => {
    const fitted = fittedModules.find(f => f.slotType === slotType && f.slotIndex === slotIndex);
    return fitted ? SHIP_FITTING_MODULES[fitted.moduleId] : null;
  };

  const getAvailableModules = (): ShipModule[] => {
    let modules = Object.values(SHIP_FITTING_MODULES);

    // Filter by selected slot type
    if (selectedSlot) {
      modules = modules.filter(m => m.type === selectedSlot.type);
    }

    // Filter by ship size
    if (selectedHull) {
      modules = modules.filter(m => m.size === "universal" || m.size === selectedHull.size);
    }

    // Filter by category
    if (filterCategory !== "all") {
      modules = modules.filter(m => m.category === filterCategory);
    }

    // Filter by type
    if (filterType !== "all") {
      modules = modules.filter(m => m.type === filterType);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      modules = modules.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.class.toLowerCase().includes(term)
      );
    }

    return modules;
  };

  const saveFitting = () => {
    if (!selectedHull) return;
    const fittingData = {
      hull: selectedHull.id,
      modules: fittedModules,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`fitting_${selectedHull.id}`, JSON.stringify(fittingData));
    alert("Fitting saved!");
  };

  const clearFitting = () => {
    if (confirm("Clear all fitted modules?")) {
      setFittedModules([]);
    }
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src={BACKGROUND_ASSETS.SHIPYARD.path} alt="Ship Fitting" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="flex gap-2 items-center">
              <img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Battleship" className="w-12 h-12 object-contain" />
              <img src={SHIP_ASSETS.CAPITALS.CORVETTE.path} alt="Corvette" className="w-12 h-12 object-contain" />
              <img src={MENU_ASSETS.BUILDINGS.DEFENSE_TURRET.path} alt="Defense Turret" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white drop-shadow">Ship Fitting Hangar</h1>
              <p className="text-blue-300 font-rajdhani text-lg">Configure ships with weapons, defenses, and support modules</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{TOTAL_MODULES} Modules Available</Badge>
          </div>
          {selectedHull && (
            <div className="flex gap-2">
              <Button onClick={saveFitting} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Save Fitting
              </Button>
              <Button onClick={clearFitting} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Hull Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Ship Hull</CardTitle>
            <CardDescription>Choose a ship to fit modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(SHIP_HULLS).map(hull => (
                <Card
                  key={hull.id}
                  className={`cursor-pointer transition-all ${
                    selectedHull?.id === hull.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectHull(hull.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{hull.name}</CardTitle>
                    <CardDescription>{hull.class} - {hull.size}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Slots:</span>
                        <span>{hull.slots.high}H / {hull.slots.mid}M / {hull.slots.low}L / {hull.slots.rig}R</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CPU:</span>
                        <span>{hull.resources.cpu} tf</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Powergrid:</span>
                        <span>{hull.resources.powergrid} MW</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedHull && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Ship Fitting */}
            <div className="lg:col-span-2 space-y-4">
              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Ship Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="h-4 w-4" />
                        <span className="text-sm font-medium">CPU</span>
                      </div>
                      <Progress
                        value={(usedResources.cpu / selectedHull.resources.cpu) * 100}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {usedResources.cpu.toFixed(1)} / {selectedHull.resources.cpu} tf
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">Powergrid</span>
                      </div>
                      <Progress
                        value={(usedResources.powergrid / selectedHull.resources.powergrid) * 100}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {usedResources.powergrid.toFixed(1)} / {selectedHull.resources.powergrid} MW
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Calibration</span>
                      </div>
                      <Progress
                        value={(usedResources.calibration / selectedHull.resources.calibration) * 100}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {usedResources.calibration} / {selectedHull.resources.calibration}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slot Groups */}
              {Object.entries(SLOT_TYPES).map(([slotType, slotInfo]) => {
                const slotCount = selectedHull.slots[slotType as keyof typeof selectedHull.slots] || 0;
                if (slotCount === 0) return null;

                return (
                  <Card key={slotType}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${slotInfo.color}`} />
                        {slotInfo.name} ({slotCount} slots)
                      </CardTitle>
                      <CardDescription>{slotInfo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {Array.from({ length: slotCount }, (_, index) => {
                          const module = getModuleInSlot(slotType, index);
                          const isSelected = selectedSlot?.type === slotType && selectedSlot?.index === index;

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-all ${
                                isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent"
                              }`}
                              onClick={() => setSelectedSlot({ type: slotType, index })}
                            >
                              <div className="flex-1">
                                {module ? (
                                  <div>
                                    <div className="font-medium">{module.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {module.class} - CPU: {module.cpu} | PG: {module.powergrid}
                                      {module.calibration && ` | Cal: ${module.calibration}`}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground">
                                    Slot {index + 1} - Empty
                                  </div>
                                )}
                              </div>
                              {module && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveModule(slotType, index);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Right: Module Browser */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Module Browser</CardTitle>
                  <CardDescription>
                    {selectedSlot
                      ? `Select module for ${SLOT_TYPES[selectedSlot.type as keyof typeof SLOT_TYPES]?.name} slot ${selectedSlot.index + 1}`
                      : "Click a slot to browse modules"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search modules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(MODULE_CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Slot Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Slots</SelectItem>
                        {Object.entries(SLOT_TYPES).map(([key, slot]) => (
                          <SelectItem key={key} value={key}>{slot.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Module List */}
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {getAvailableModules().map(module => (
                        <Card
                          key={module.id}
                          className="cursor-pointer hover:bg-accent transition-all"
                          onClick={() => selectedSlot && handleFitModule(module.id)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{module.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {module.class} - {module.subclass}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  T{module.tech}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {module.description}
                              </div>
                              <div className="flex gap-2 text-xs">
                                <span>CPU: {module.cpu}</span>
                                <span>PG: {module.powergrid}</span>
                                {module.calibration && <span>Cal: {module.calibration}</span>}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {module.price.isk.toLocaleString()} ISK
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}

// Made with Bob
