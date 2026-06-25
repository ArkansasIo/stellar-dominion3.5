import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Shield, Target, History } from "lucide-react";

interface SiloStatus {
  siloLevel: number;
  capacity: number;
  usedSlots: number;
  freeSlots: number;
  stored: { abm: number; ipm: number };
  abmCost: { metal: number; crystal: number; deuterium: number };
  ipmCost: { metal: number; crystal: number; deuterium: number };
  abmBuildTime: number;
  ipmBuildTime: number;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}

export default function Missiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [missileType, setMissileType] = useState<"abm" | "ipm">("ipm");
  const [produceQty, setProduceQty] = useState(1);
  const [targetGalaxy, setTargetGalaxy] = useState("1");
  const [targetSystem, setTargetSystem] = useState("1");
  const [targetPosition, setTargetPosition] = useState("1");
  const [launchQty, setLaunchQty] = useState(1);

  const { data: siloStatus, isLoading } = useQuery<SiloStatus>({
    queryKey: ["missile-silo"],
    queryFn: () => fetchJson<SiloStatus>("/api/ogame/missile/silo-status"),
  });

  const produceMutation = useMutation({
    mutationFn: () =>
      fetchJson("/api/ogame/missile/produce", {
        method: "POST",
        body: JSON.stringify({ missileType, quantity: produceQty }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["missile-silo"] });
      toast({ title: "Missiles produced" });
    },
    onError: (e: Error) => toast({ title: "Production failed", description: e.message, variant: "destructive" }),
  });

  const launchMutation = useMutation({
    mutationFn: () =>
      fetchJson("/api/ogame/missile/launch", {
        method: "POST",
        body: JSON.stringify({ targetUserId: `${targetGalaxy}:${targetSystem}:${targetPosition}`, quantity: launchQty }),
      }),
    onSuccess: async (data: any) => {
      await queryClient.invalidateQueries({ queryKey: ["missile-silo"] });
      toast({
        title: "Missiles launched!",
        description: data.destroyed ? `Destroyed: ${JSON.stringify(data.destroyed)}` : "No defenses hit.",
      });
    },
    onError: (e: Error) => toast({ title: "Launch failed", description: e.message, variant: "destructive" }),
  });

  const cost = missileType === "abm" ? siloStatus?.abmCost : siloStatus?.ipmCost;

  return (
    <GameLayout>
      <div className="missiles-container">
        <Card>
          <CardHeader>
            <CardTitle>Missile Command</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Silo Status */}
            <div className="missiles-silo-status sd-card">
              <div className="missiles-silo-count">
                <div className="missiles-silo-count-label">Silo Level</div>
                <div className="missiles-silo-count-value">{siloStatus?.siloLevel ?? 0}</div>
              </div>
              <div className="missiles-silo-count">
                <div className="missiles-silo-count-label">Capacity</div>
                <div className="missiles-silo-count-value">{siloStatus?.usedSlots ?? 0}/{siloStatus?.capacity ?? 0}</div>
              </div>
              <div className="missiles-silo-count">
                <div className="missiles-silo-count-label">ABM</div>
                <div className="missiles-silo-count-value" style={{ color: "#4488ff" }}>{siloStatus?.stored.abm ?? 0}</div>
              </div>
              <div className="missiles-silo-count">
                <div className="missiles-silo-count-label">IPM</div>
                <div className="missiles-silo-count-value" style={{ color: "#ff6600" }}>{siloStatus?.stored.ipm ?? 0}</div>
              </div>
            </div>

            {/* Production */}
            <div className="missiles-form sd-card">
              <h3 className="text-sm font-bold mb-2">Produce Missiles</h3>
              <div className="missiles-type-selector">
                <button
                  className={`missiles-type-btn abm sd-card ${missileType === "abm" ? "selected" : ""}`}
                  onClick={() => setMissileType("abm")}
                >
                  <Shield className="h-5 w-5 mx-auto mb-1" />
                  Anti-Ballistic
                </button>
                <button
                  className={`missiles-type-btn ipm sd-card ${missileType === "ipm" ? "selected" : ""}`}
                  onClick={() => setMissileType("ipm")}
                >
                  <Rocket className="h-5 w-5 mx-auto mb-1" />
                  Interplanetary
                </button>
              </div>
              <div className="missiles-quantity-row mt-3">
                <label>Quantity:</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={produceQty}
                  onChange={(e) => setProduceQty(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="missiles-quantity-input"
                />
                <span className="text-xs opacity-60">(max 20)</span>
              </div>
              {cost && (
                <div className="flex justify-center gap-4 text-xs mt-2">
                  <span className={produceMutation.isPending ? "opacity-50" : ""}>M: {cost.metal.toLocaleString()}</span>
                  <span className={produceMutation.isPending ? "opacity-50" : ""}>C: {cost.crystal.toLocaleString()}</span>
                  <span className={produceMutation.isPending ? "opacity-50" : ""}>D: {cost.deuterium.toLocaleString()}</span>
                </div>
              )}
              <Button
                className="missiles-launch-btn"
                onClick={() => produceMutation.mutate()}
                disabled={produceMutation.isPending || !siloStatus || siloStatus.siloLevel === 0}
              >
                {produceMutation.isPending ? "Producing..." : "Produce"}
              </Button>
            </div>

            {/* IPM Launch */}
            {siloStatus && siloStatus.stored.ipm > 0 && (
              <div className="missiles-form sd-card">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" /> Launch IPM Attack
                </h3>
                <div className="missiles-target-inputs">
                  <Input value={targetGalaxy} onChange={(e) => setTargetGalaxy(e.target.value)} className="missiles-target-input" placeholder="G" />
                  <span className="text-lg font-bold">:</span>
                  <Input value={targetSystem} onChange={(e) => setTargetSystem(e.target.value)} className="missiles-target-input" placeholder="S" />
                  <span className="text-lg font-bold">:</span>
                  <Input value={targetPosition} onChange={(e) => setTargetPosition(e.target.value)} className="missiles-target-input" placeholder="P" />
                </div>
                <div className="missiles-quantity-row mt-3">
                  <label>IPMs:</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={launchQty}
                    onChange={(e) => setLaunchQty(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="missiles-quantity-input"
                  />
                </div>
                <Button
                  className="missiles-launch-btn"
                  variant="destructive"
                  onClick={() => launchMutation.mutate()}
                  disabled={launchMutation.isPending}
                >
                  {launchMutation.isPending ? "Launching..." : "Launch IPM"}
                </Button>
              </div>
            )}

            {isLoading && <div className="text-center py-8 opacity-60">Loading silo data...</div>}

            {siloStatus && siloStatus.siloLevel === 0 && (
              <div className="text-center py-4 opacity-60 text-sm">
                You need a Missile Silo to produce and store missiles.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
