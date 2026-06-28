import { useState, useEffect } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Cpu,
  Zap,
  Settings,
  Shield,
  Target,
  Navigation,
  Cog,
  Factory,
  Microscope,
  Users
} from "lucide-react";

interface Module {
  name: string;
  type: string;
  category: string;
  size: string;
  cpu: number;
  powergrid: number;
  [key: string]: any;
}

interface ShipFitting {
  shipId: string;
  name: string;
  size: string;
  slots: { [key: string]: number };
  cpu: { total: number; used: number };
  powergrid: { total: number; used: number };
  calibration: { total: number; used: number };
  fitted_modules: { [key: string]: { [key: string]: string } };
}

const SLOT_TYPES = {
  high: { name: "High Slots", icon: Target, color: "bg-red-500" },
  mid: { name: "Mid Slots", icon: Navigation, color: "bg-blue-500" },
  low: { name: "Low Slots", icon: Cog, color: "bg-green-500" },
  rig: { name: "Rig Slots", icon: Settings, color: "bg-purple-500" }
};

const CATEGORY_ICONS = {
  weapon: Target,
  defense: Shield,
  propulsion: Navigation,
  electronic: Cpu,
  mechanical: Cog
};

async function apiCall(url: string, method: string = "GET", body?: unknown): Promise<any> {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export default function Fitting() {
  const [modules, setModules] = useState<{ [key: string]: Module }>({});
  const [selectedShip, setSelectedShip] = useState<string>("");
  const [shipFitting, setShipFitting] = useState<ShipFitting | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const response = await apiCall("/api/fitting/modules");
      setModules(response);
    } catch (error) {
      console.error("Failed to load modules:", error);
    }
  };

  const loadShipFitting = async (shipId: string) => {
    if (!shipId) return;
    setLoading(true);
    try {
      const response = await apiCall(`/api/fitting/ship/${shipId}`);
      setShipFitting(response);
    } catch (error) {
      console.error("Failed to load ship fitting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipChange = (shipId: string) => {
    setSelectedShip(shipId);
    loadShipFitting(shipId);
  };

  const fitModule = async (slotType: string, slotIndex: number, moduleId: string) => {
    if (!shipFitting) return;

    const newFitting = { ...shipFitting };
    if (!newFitting.fitted_modules[slotType]) {
      newFitting.fitted_modules[slotType] = {};
    }

    // Remove old module if exists
    const oldModuleId = newFitting.fitted_modules[slotType][slotIndex];
    if (oldModuleId) {
      const oldModule = modules[oldModuleId];
      newFitting.cpu.used -= oldModule?.cpu || 0;
      newFitting.powergrid.used -= oldModule?.powergrid || 0;
      if (slotType === "rig") {
        newFitting.calibration.used -= oldModule?.calibration || 0;
      }
    }

    // Add new module
    if (moduleId) {
      const module = modules[moduleId];
      newFitting.cpu.used += module.cpu;
      newFitting.powergrid.used += module.powergrid;
      if (slotType === "rig") {
        newFitting.calibration.used += module.calibration;
      }
      newFitting.fitted_modules[slotType][slotIndex] = moduleId;
    } else {
      delete newFitting.fitted_modules[slotType][slotIndex];
    }

    setShipFitting(newFitting);
  };

  const saveFitting = async () => {
    if (!shipFitting) return;

    try {
      await apiCall("/api/fitting/fit", "POST", {
        shipId: shipFitting.shipId,
        modules: shipFitting.fitted_modules
      });
      alert("Fitting saved successfully!");
    } catch (error: any) {
      alert(`Failed to save fitting: ${error.message}`);
    }
  };

  const getModulesForSlot = (slotType: string) => {
    return Object.entries(modules).filter(([id, module]) =>
      module.type === slotType && (!shipFitting || module.size === shipFitting.size || module.size === "universal")
    );
  };

  if (loading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ship fitting...</div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Ship Fitting</h1>
        </div>

        {/* Ship Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Ship</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedShip} onValueChange={handleShipChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a ship to fit" />
              </SelectTrigger>
              <SelectContent>
                {/* In a real implementation, load player's ships */}
                <SelectItem value="sf_002">Hornet Strike Fighter</SelectItem>
                <SelectItem value="cr_001">Viper Cruiser</SelectItem>
                <SelectItem value="bs_001">Titan Battleship</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {shipFitting && (
          <>
            {/* Ship Info and Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {shipFitting.name}
                  <Badge variant="outline">{shipFitting.size}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="h-4 w-4" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <Progress
                      value={(shipFitting.cpu.used / shipFitting.cpu.total) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {shipFitting.cpu.used}/{shipFitting.cpu.total}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">Powergrid</span>
                    </div>
                    <Progress
                      value={(shipFitting.powergrid.used / shipFitting.powergrid.total) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {shipFitting.powergrid.used}/{shipFitting.powergrid.total}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Calibration</span>
                    </div>
                    <Progress
                      value={(shipFitting.calibration.used / shipFitting.calibration.total) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {shipFitting.calibration.used}/{shipFitting.calibration.total}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fitting Interface */}
            <div className="grid gap-4">
              {Object.entries(SLOT_TYPES).map(([slotType, slotInfo]) => {
                const slotCount = shipFitting.slots[slotType] || 0;
                const Icon = slotInfo.icon;

                return (
                  <Card key={slotType}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {slotInfo.name} ({slotCount} slots)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {Array.from({ length: slotCount }, (_, index) => {
                          const fittedModuleId = shipFitting.fitted_modules[slotType]?.[index];
                          const fittedModule = fittedModuleId ? modules[fittedModuleId] : null;
                          const availableModules = getModulesForSlot(slotType);

                          return (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <div className="flex-1">
                                <Select
                                  value={fittedModuleId || ""}
                                  onValueChange={(moduleId) => fitModule(slotType, index, moduleId)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Slot ${index + 1} - Empty`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Empty</SelectItem>
                                    {availableModules.map(([id, module]) => (
                                      <SelectItem key={id} value={id}>
                                        {module.name} (CPU: {module.cpu}, PG: {module.powergrid})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {fittedModule && (
                                <div className="text-sm text-muted-foreground">
                                  CPU: {fittedModule.cpu}, PG: {fittedModule.powergrid}
                                </div>
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

            {/* Save Button */}
            <div className="flex justify-center">
              <Button onClick={saveFitting} size="lg">
                Save Fitting
              </Button>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
