import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Anchor, Cog, Pickaxe, FlaskRound, UserCog, Zap, Clock } from "lucide-react";

type OfficerInfo = {
  id: string;
  name: string;
  description: string;
  cost: Record<string, number>;
  stats: Record<string, any>;
  active: boolean;
  expiresAt: number | null;
  remainingDays: number;
};

type OfficersResponse = {
  success: boolean;
  officers: OfficerInfo[];
  darkMatter: number;
};

type PurchaseResponse = {
  success: boolean;
  message: string;
  officer: OfficerInfo;
  darkMatter: number;
};

const OFFICER_ICONS: Record<string, React.ReactNode> = {
  commanderOfficer: <UserCog className="w-5 h-5" />,
  admiralOfficer: <Anchor className="w-5 h-5" />,
  engineerOfficer: <Cog className="w-5 h-5" />,
  geologistOfficer: <Pickaxe className="w-5 h-5" />,
  technocratOfficer: <FlaskRound className="w-5 h-5" />,
};

const OFFICER_COLORS: Record<string, string> = {
  commanderOfficer: "bg-purple-50 border-purple-200 text-purple-800",
  admiralOfficer: "bg-blue-50 border-blue-200 text-blue-800",
  engineerOfficer: "bg-amber-50 border-amber-200 text-amber-800",
  geologistOfficer: "bg-emerald-50 border-emerald-200 text-emerald-800",
  technocratOfficer: "bg-cyan-50 border-cyan-200 text-cyan-800",
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }
  return payload as T;
}

export default function OGameOfficers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const { data, refetch } = useQuery<OfficersResponse>({
    queryKey: ["ogame-officers"],
    queryFn: () => fetchJson<OfficersResponse>("/api/ogame/officers"),
    refetchInterval: 30000,
  });

  const purchaseMutation = useMutation({
    mutationFn: (officerId: string) =>
      fetchJson<PurchaseResponse>(`/api/ogame/officers/purchase/${officerId}`, { method: "POST" }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["ogame-officers"] });
      toast({ title: "Officer activated", description: result.message });
    },
    onError: (error: Error) => {
      toast({ title: "Purchase failed", description: error.message, variant: "destructive" });
    },
    onSettled: () => setPurchasingId(null),
  });

  const officers = data?.officers || [];
  const darkMatter = data?.darkMatter || 0;

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-slate-900">Officer Corps</h1>
            <p className="text-sm text-slate-500">Recruit officers to gain strategic advantages across your empire.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-orbitron text-purple-800">{darkMatter.toLocaleString()}</span>
            <span className="text-xs text-purple-600">Dark Matter</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officers.map((officer) => {
            const dmCost = officer.cost?.darkMatter || 500;
            const canAfford = darkMatter >= dmCost;
            const isPurchasing = purchasingId === officer.id;

            return (
              <Card
                key={officer.id}
                className={`border-2 ${
                  officer.active
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg p-2 ${OFFICER_COLORS[officer.id] || "bg-slate-100"}`}>
                        {OFFICER_ICONS[officer.id] || <UserCog className="w-5 h-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-900">{officer.name}</CardTitle>
                        <CardDescription>{officer.description}</CardDescription>
                      </div>
                    </div>
                    {officer.active && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        <Clock className="w-3 h-3 mr-1" />
                        {officer.remainingDays}d
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    {Object.entries(officer.stats).filter(([k]) => k !== "active").map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
                        <span className="font-semibold text-slate-900">+{typeof value === "number" ? `${(value * 100).toFixed(0)}%` : value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    variant={officer.active ? "outline" : "default"}
                    disabled={!canAfford || isPurchasing || purchaseMutation.isPending}
                    onClick={() => {
                      setPurchasingId(officer.id);
                      purchaseMutation.mutate(officer.id);
                    }}
                  >
                    {isPurchasing ? "Activating..." :
                     officer.active ? `Extend (${dmCost} DM)` :
                     `Activate (${dmCost} Dark Matter)`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm text-slate-900">Active Bonuses</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            {officers.filter((o) => o.active).length === 0 ? (
              <p>No officers active. Purchase an officer above to unlock empire-wide bonuses.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {officers.filter((o) => o.active).map((o) => (
                  <div key={o.id} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-900">{o.name}</span>
                    {Object.entries(o.stats).filter(([k]) => k !== "active").map(([key, value]) => (
                      <div key={key} className="text-xs text-slate-500">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: +{typeof value === "number" ? `${(value * 100).toFixed(0)}%` : value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
