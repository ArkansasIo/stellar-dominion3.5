import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { User, Anchor, Wrench, Pickaxe, FlaskConical, Sparkles, Clock, Star } from "lucide-react";

const OFFICER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  commanderOfficer: User,
  admiralOfficer: Anchor,
  engineerOfficer: Wrench,
  geologistOfficer: Pickaxe,
  technocratOfficer: FlaskConical,
};

const OFFICER_LABELS: Record<string, { stat: string; label: string; format: (v: number) => string }> = {
  queueSlotsBonus: { stat: "queueSlotsBonus", label: "Queue Slots", format: (v) => `+${v}` },
  fleetSlotsBonus: { stat: "fleetSlotsBonus", label: "Fleet Slots", format: (v) => `+${v}` },
  defenseDurabilityBonus: { stat: "defenseDurabilityBonus", label: "Defense Durability", format: (v) => `+${(v * 100).toFixed(0)}%` },
  mineProductionBonus: { stat: "mineProductionBonus", label: "Mine Production", format: (v) => `+${(v * 100).toFixed(0)}%` },
  researchSpeedBonus: { stat: "researchSpeedBonus", label: "Research Speed", format: (v) => `+${(v * 100).toFixed(0)}%` },
  espionageBonus: { stat: "espionageBonus", label: "Espionage", format: (v) => `+${v}` },
};

interface Officer {
  id: string;
  name: string;
  description: string;
  cost: { darkMatter: number };
  stats: Record<string, number>;
  active: boolean;
  expiresAt: string | null;
  remainingDays: number;
}

interface OfficersResponse {
  success: boolean;
  officers: Officer[];
  darkMatter: number;
}

export default function Premium() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<OfficersResponse>({
    queryKey: ["/api/ogame/officers"],
    queryFn: async () => {
      const res = await fetch("/api/ogame/officers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load officers");
      return res.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (officerId: string) => {
      const res = await apiRequest("POST", `/api/ogame/officers/purchase/${officerId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ogame/officers"] });
      toast({ title: "Officer purchased", description: "Your new officer is now active." });
    },
    onError: (error: any) => {
      toast({ title: "Purchase failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const officers = data?.officers || [];
  const darkMatter = data?.darkMatter || 0;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/nebula.png" alt="Premium" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-purple-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center ring-2 ring-purple-400/60 shadow-lg">
              <Sparkles className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Premium Officers</h2>
              <p className="text-purple-300 font-rajdhani text-lg">Unlock OGame-style officers to enhance your empire with permanent bonuses.</p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-700 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-xs text-purple-300 uppercase tracking-wider">Dark Matter Balance</div>
                <div className="text-2xl font-orbitron font-bold text-white">{darkMatter.toLocaleString()}</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-800/50 text-purple-200 border-purple-600">Premium Currency</Badge>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12 text-purple-300 font-rajdhani text-lg">Loading officers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officers.map((officer) => {
              const Icon = OFFICER_ICONS[officer.id] || User;
              const canAfford = darkMatter >= officer.cost.darkMatter;

              return (
                <Card
                  key={officer.id}
                  className={cn(
                    "border-2 transition-all duration-300",
                    officer.active
                      ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-400 shadow-lg shadow-purple-200/50"
                      : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-md",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          officer.active
                            ? "bg-purple-100 text-purple-600"
                            : "bg-slate-100 text-slate-500",
                        )}>
                          {Icon && <Icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <CardTitle className={cn(
                            "text-lg",
                            officer.active ? "text-purple-900" : "text-slate-900",
                          )}>
                            {officer.name}
                          </CardTitle>
                          <CardDescription className="text-xs">{officer.description}</CardDescription>
                        </div>
                      </div>
                      {officer.active && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">Active</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {officer.stats && Object.keys(officer.stats).length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(officer.stats).map(([key, val]) => {
                          const cfg = OFFICER_LABELS[key];
                          return (
                            <div key={key} className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                                {cfg?.label || key}
                              </div>
                              <div className="font-orbitron font-bold text-sm text-purple-700">
                                {cfg?.format ? cfg.format(val) : `+${val}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{officer.cost.darkMatter.toLocaleString()} DM</span>
                      </div>
                      {officer.active && officer.remainingDays > 0 && (
                        <div className="flex items-center gap-1.5 text-purple-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">{officer.remainingDays}d remaining</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      variant={officer.active ? "secondary" : "default"}
                      disabled={!canAfford || purchaseMutation.isPending}
                      onClick={() => purchaseMutation.mutate(officer.id)}
                    >
                      {purchaseMutation.isPending ? (
                        "Processing..."
                      ) : officer.active ? (
                        "Extend (30d)"
                      ) : !canAfford ? (
                        "Not Enough DM"
                      ) : (
                        "Purchase (30d)"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
