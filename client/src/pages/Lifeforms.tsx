import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FlaskRound, Star, Shield, Zap, Rocket, Gauge, Cpu, Users } from "lucide-react";
import { useState } from "react";

type LifeformBonus = {
  fieldBonus: number;
  resourceBonus: number;
  researchBonus: number;
  defenseBonus: number;
  shipBonus: number;
  speedBonus: number;
  energyBonus: number;
};

type LifeformDef = {
  id: string;
  name: string;
  description: string;
  bonuses: LifeformBonus;
  color: string;
};

type LifeformsResponse = {
  success: boolean;
  lifeforms: LifeformDef[];
};

type MyLifeformResponse = {
  success: boolean;
  lifeform: string;
  definition: LifeformDef;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || payload?.message || "Request failed");
  return payload as T;
}

const BONUS_ICONS: Record<string, React.ReactNode> = {
  fieldBonus: <Star className="w-3 h-3" />,
  resourceBonus: <Zap className="w-3 h-3" />,
  researchBonus: <FlaskRound className="w-3 h-3" />,
  defenseBonus: <Shield className="w-3 h-3" />,
  shipBonus: <Rocket className="w-3 h-3" />,
  speedBonus: <Gauge className="w-3 h-3" />,
  energyBonus: <Cpu className="w-3 h-3" />,
};

const BONUS_LABELS: Record<string, string> = {
  fieldBonus: "Planet Fields",
  resourceBonus: "Resource Output",
  researchBonus: "Research Speed",
  defenseBonus: "Defense Strength",
  shipBonus: "Ship Power",
  speedBonus: "Fleet Speed",
  energyBonus: "Energy Output",
};

function formatBonus(key: string, value: number): string {
  if (key === "fieldBonus") return `+${value}`;
  return value >= 1 ? `+${((value - 1) * 100).toFixed(0)}%` : `${(value * 100).toFixed(0)}%`;
}

export default function Lifeforms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selecting, setSelecting] = useState<string | null>(null);

  const { data: lifeformsData } = useQuery<LifeformsResponse>({
    queryKey: ["lifeforms"],
    queryFn: () => fetchJson<LifeformsResponse>("/api/lifeforms"),
  });

  const { data: myLifeform, refetch } = useQuery<MyLifeformResponse>({
    queryKey: ["lifeform-mine"],
    queryFn: () => fetchJson<MyLifeformResponse>("/api/lifeforms/mine"),
    refetchInterval: 30000,
  });

  const selectMutation = useMutation({
    mutationFn: (lifeformId: string) =>
      fetchJson("/api/lifeforms/select", {
        method: "PUT",
        body: JSON.stringify({ lifeformId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifeform-mine"] });
      toast({ title: "Lifeform selected" });
    },
    onError: (error: Error) => {
      toast({ title: "Selection failed", description: error.message, variant: "destructive" });
    },
    onSettled: () => setSelecting(null),
  });

  const currentLifeformId = myLifeform?.lifeform;
  const lifeforms = lifeformsData?.lifeforms || [];

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-slate-900">Lifeforms</h1>
          <p className="text-sm text-slate-500">
            Choose a lifeform for your empire. Each grants unique passive bonuses.
            {currentLifeformId ? ` Current: ${myLifeform?.definition?.name || currentLifeformId}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lifeforms.map((lf) => {
            const isActive = lf.id === currentLifeformId;
            const isSelecting = selecting === lf.id;

            return (
              <Card
                key={lf.id}
                className={`border-2 ${
                  isActive ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-white"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg p-2 bg-slate-100 ${lf.color}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-900">{lf.name}</CardTitle>
                        <CardDescription>{lf.description}</CardDescription>
                      </div>
                    </div>
                    {isActive && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Active</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Object.entries(lf.bonuses).map(([key, value]) => {
                      if (key === "fieldBonus" && value === 0 && lf.id !== "humans") return null;
                      if (value === 1 && key !== "fieldBonus") return null;
                      return (
                        <div key={key} className="flex items-center gap-1 text-xs text-slate-600">
                          {BONUS_ICONS[key]}
                          <span>{BONUS_LABELS[key]}: <span className="font-semibold text-slate-900">{formatBonus(key, value)}</span></span>
                        </div>
                      );
                    })}
                  </div>
                  {!isActive && (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={isSelecting || selectMutation.isPending}
                      onClick={() => {
                        setSelecting(lf.id);
                        selectMutation.mutate(lf.id);
                      }}
                    >
                      {isSelecting ? "Selecting..." : `Select ${lf.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
