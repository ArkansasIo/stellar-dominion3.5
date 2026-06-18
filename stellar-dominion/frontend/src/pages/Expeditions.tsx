import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ship, Compass, Shield, Zap, MapPin, Rocket, Users } from "lucide-react";

interface Expedition {
  id: string;
  name: string;
  type: string;
  targetCoordinates: string;
  status: string;
  fleetComposition: Record<string, number>;
  troopComposition: Record<string, number>;
  discoveries: any[];
  casualties: Record<string, number>;
  resources: Record<string, number>;
  startedAt: string;
  completedAt?: string;
}

export default function Expeditions() {
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
  const [newExpName, setNewExpName] = useState("");
  const [newExpType, setNewExpType] = useState("exploration");
  const [targetCoords, setTargetCoords] = useState("");

  const { data: expeditionsData = {}, refetch } = useQuery({
    queryKey: ["expeditions"],
    queryFn: () => fetch("/api/expeditions").then(r => r.json()).catch(() => ({})),
  });

  const expeditions = Array.isArray(expeditionsData) ? expeditionsData : expeditionsData.expeditions || [];

  const createExpeditionMutation = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/expeditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      refetch();
      setNewExpName("");
      setTargetCoords("");
      setNewExpType("exploration");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "preparing":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exploration":
        return <Compass className="w-4 h-4" />;
      case "military":
        return <Shield className="w-4 h-4" />;
      case "scientific":
        return <Zap className="w-4 h-4" />;
      case "trade":
        return <Users className="w-4 h-4" />;
      case "conquest":
        return <Rocket className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Expeditions</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Send fleets and troops to explore worlds and conquer interstellar objects</p>
        </div>

        {/* Launch New Expedition */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Launch New Expedition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Expedition name"
              value={newExpName}
              onChange={(e) => setNewExpName(e.target.value)}
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              data-testid="input-exp-name"
            />
            <Select value={newExpType} onValueChange={setNewExpType}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exploration">Exploration</SelectItem>
                <SelectItem value="military">Military</SelectItem>
                <SelectItem value="scientific">Scientific</SelectItem>
                <SelectItem value="trade">Trade</SelectItem>
                <SelectItem value="conquest">Conquest</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Target coords (e.g. [1:2:3])"
              value={targetCoords}
              onChange={(e) => setTargetCoords(e.target.value)}
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              data-testid="input-exp-coords"
            />
            <Button
              onClick={() =>
                createExpeditionMutation.mutate({
                  name: newExpName,
                  type: newExpType,
                  targetCoordinates: targetCoords || "[1:1:1]",
                  fleetComposition: { corvettes: 5, destroyers: 2 },
                  troopComposition: { soldiers: 100, scouts: 20 },
                })
              }
              disabled={!newExpName || createExpeditionMutation.isPending}
              className="md:col-span-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
              data-testid="button-create-expedition"
            >
              {createExpeditionMutation.isPending ? "Launching..." : "Launch Expedition"}
            </Button>
          </div>
        </div>

        {/* Expeditions Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-700 font-bold">Name</TableHead>
                <TableHead className="text-slate-700 font-bold">Type</TableHead>
                <TableHead className="text-slate-700 font-bold">Target</TableHead>
                <TableHead className="text-slate-700 font-bold">Fleet</TableHead>
                <TableHead className="text-slate-700 font-bold">Troops</TableHead>
                <TableHead className="text-slate-700 font-bold">Status</TableHead>
                <TableHead className="text-right text-slate-700 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expeditions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No expeditions launched yet. Start your first expedition above!
                  </TableCell>
                </TableRow>
              ) : (
                expeditions.map((expedition: Expedition) => (
                  <TableRow
                    key={expedition.id}
                    className="border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedExpedition(expedition.id)}
                    data-testid={`expedition-row-${expedition.id}`}
                  >
                    <TableCell className="font-semibold text-slate-900 flex items-center gap-2">
                      {getTypeIcon(expedition.type)}
                      {expedition.name}
                    </TableCell>
                    <TableCell className="text-slate-600 capitalize">{expedition.type}</TableCell>
                    <TableCell className="text-slate-600 font-mono">{expedition.targetCoordinates}</TableCell>
                    <TableCell className="text-slate-600">
                      {Object.entries(expedition.fleetComposition)
                        .map(([ship, count]) => `${count} ${ship}`)
                        .join(", ") || "None"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {Object.entries(expedition.troopComposition)
                        .map(([troop, count]) => `${count} ${troop}`)
                        .join(", ") || "None"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(expedition.status)}>
                        {expedition.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                        data-testid={`button-view-expedition-${expedition.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Selected Expedition Details */}
        {selectedExpedition && expeditions.find((e: Expedition) => e.id === selectedExpedition) && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {expeditions.find((e: Expedition) => e.id === selectedExpedition)?.name} - Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fleet Composition</p>
                  <div className="space-y-1">
                    {Object.entries(expeditions.find((e: Expedition) => e.id === selectedExpedition)?.fleetComposition || {}).map(([ship, count]: [string, any]) => (
                      <p key={ship} className="text-sm text-slate-700">
                        <span className="capitalize font-semibold">{ship}:</span> {count}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Troop Composition</p>
                  <div className="space-y-1">
                    {Object.entries(expeditions.find((e: Expedition) => e.id === selectedExpedition)?.troopComposition || {}).map(([troop, count]: [string, any]) => (
                      <p key={troop} className="text-sm text-slate-700">
                        <span className="capitalize font-semibold">{troop}:</span> {count}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Casualties</p>
                  <div className="space-y-1">
                    {Object.entries(expeditions.find((e: Expedition) => e.id === selectedExpedition)?.casualties || {}).map(([unit, count]: [string, any]) => (
                      <p key={unit} className="text-sm text-red-600">
                        <span className="capitalize font-semibold">{unit}:</span> {count}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedExpedition(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
