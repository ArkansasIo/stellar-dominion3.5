import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sword, Flame } from "lucide-react";

export default function Raids() {
  const [raidType, setRaidType] = useState<string>("all");
  const [selectedRaidId, setSelectedRaidId] = useState<string | null>(null);

  const { data: raids = [] } = useQuery({
    queryKey: ["raids"],
    queryFn: () => fetch("/api/raids").then(r => r.json()).catch(() => []),
  });

  const filtered = raidType === "all" ? raids : raids.filter((r: any) => r.raidType === raidType);
  const selectedRaid = filtered.find((raid: any) => raid.id === selectedRaidId) || null;

  const activeRaids = raids.filter((raid: any) => raid.status === "active").length;
  const preparingRaids = raids.filter((raid: any) => raid.status === "preparing").length;
  const completedRaids = raids.filter((raid: any) => raid.status === "completed").length;

  const statusColors: Record<string, string> = {
    preparing: "bg-yellow-600",
    active: "bg-red-600",
    completed: "bg-green-600",
  };

  const resultColors: Record<string, string> = {
    attacker_victory: "text-green-400",
    defender_victory: "text-blue-400",
    tie: "text-yellow-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Flame className="w-8 h-8 text-red-500" />
          Raids
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Total Raids</div>
              <div className="text-2xl font-bold text-white">{raids.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Preparing</div>
              <div className="text-2xl font-bold text-yellow-400">{preparingRaids}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Active</div>
              <div className="text-2xl font-bold text-red-400">{activeRaids}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Completed</div>
              <div className="text-2xl font-bold text-emerald-400">{completedRaids}</div>
            </CardContent>
          </Card>
        </div>

        {/* Raid Type Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "guild_war", "pvp_team", "boss_raid", "stronghold_attack"].map((type) => (
            <Button
              key={type}
              onClick={() => setRaidType(type)}
              variant={raidType === type ? "default" : "outline"}
              className="capitalize"
              data-testid={`button-filter-raid-${type}`}
            >
              {type === "all" ? "All Raids" : type.replace(/_/g, " ")}
            </Button>
          ))}
        </div>

        {/* Raids List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid gap-4">
            {filtered.map((raid: any) => (
              <Card key={raid.id} className={`bg-slate-800 border-slate-700 ${selectedRaidId === raid.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">
                        <div className="flex items-center gap-2">
                          <Sword className="w-5 h-5" />
                          {raid.attackingTeamName} vs {raid.defendingTeamName}
                        </div>
                      </CardTitle>
                      <p className="text-sm text-slate-400 capitalize">{raid.raidType.replace(/_/g, " ")}</p>
                    </div>
                    <Badge className={statusColors[raid.status]}>
                      {raid.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Attacker Losses</p>
                      <p className="text-sm text-red-400">{raid.attackerLosses?.units || 0} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Status</p>
                      {raid.result && (
                        <p className={`text-sm font-bold ${resultColors[raid.result] || "text-slate-300"}`}>
                          {raid.result.replace(/_/g, " ")}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Defender Losses</p>
                      <p className="text-sm text-blue-400">{raid.defenderLosses?.units || 0} units</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRaidId(raid.id)}
                      data-testid={`button-view-raid-${raid.id}`}
                    >
                      View Details
                    </Button>
                    {raid.status === "preparing" && (
                      <Button
                        size="sm"
                        data-testid={`button-join-raid-${raid.id}`}
                      >
                        Join Raid
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800 border-slate-700 h-fit">
            <CardHeader>
              <CardTitle className="text-white">Raid Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!selectedRaid ? (
                <p className="text-slate-400">Select a raid to inspect tactical details and combat outcome.</p>
              ) : (
                <>
                  <div className="font-semibold text-white">{selectedRaid.attackingTeamName} vs {selectedRaid.defendingTeamName}</div>
                  <div className="rounded border border-slate-700 bg-slate-900/50 p-3 text-slate-300">
                    <div>Raid Type: {selectedRaid.raidType?.replace(/_/g, ' ')}</div>
                    <div>Status: {selectedRaid.status}</div>
                    <div>Result: {selectedRaid.result?.replace(/_/g, ' ') || 'Pending'}</div>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div>Attacker Unit Losses: {selectedRaid.attackerLosses?.units || 0}</div>
                    <div>Defender Unit Losses: {selectedRaid.defenderLosses?.units || 0}</div>
                    <div>Engagement Severity: {(selectedRaid.attackerLosses?.units || 0) + (selectedRaid.defenderLosses?.units || 0)}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
