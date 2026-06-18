import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Loader2 } from "lucide-react";

export default function RaidFinder() {
  const [preferredRole, setPreferredRole] = useState<string>("dps");
  const [isQueued, setIsQueued] = useState(false);

  const { data: queue = [] } = useQuery({
    queryKey: ["raid-finder-queue"],
    queryFn: () => fetch("/api/raid-finder/queue").then(r => r.json()).catch(() => []),
    refetchInterval: isQueued ? 5000 : false,
  });

  const roleColors: Record<string, string> = {
    tank: "bg-blue-600",
    dps: "bg-red-600",
    healer: "bg-green-600",
    support: "bg-purple-600",
  };

  const roleCounts = queue.reduce(
    (acc: Record<string, number>, player: any) => {
      const role = player?.preferredRole || "dps";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    { tank: 0, dps: 0, healer: 0, support: 0 }
  );

  const estimatedWaitMinutes = Math.max(1, Math.ceil(queue.length / 4));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Search className="w-8 h-8 text-primary" />
          Raid Finder
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Queued Players</div>
              <div className="text-2xl font-bold text-white">{queue.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Estimated Wait</div>
              <div className="text-2xl font-bold text-white">~{estimatedWaitMinutes}m</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Preferred Role</div>
              <div className="text-2xl font-bold text-white capitalize">{preferredRole}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Queue Status</div>
              <div className="text-2xl font-bold text-white">{isQueued ? "Active" : "Idle"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Your Status */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {["tank", "dps", "healer", "support"].map((role) => (
                <Button
                  key={role}
                  onClick={() => setPreferredRole(role)}
                  variant={preferredRole === role ? "default" : "outline"}
                  className={`capitalize ${preferredRole === role ? roleColors[role] : ""}`}
                >
                  {role}
                </Button>
              ))}
            </div>

            {isQueued ? (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsQueued(false)}
                data-testid="button-leave-queue"
              >
                Leave Queue
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => setIsQueued(true)}
                data-testid="button-join-queue"
              >
                Join Queue as {preferredRole}
              </Button>
            )}

            {isQueued && (
              <div className="text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p className="text-sm text-slate-300">Searching for raid group...</p>
                <p className="text-xs text-slate-400">{queue.length} players in queue</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queue Status */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Queue Status ({queue.length})</h2>
          <div className="grid gap-3">
            {queue.slice(0, 10).map((player: any, i: number) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Player #{i + 1}</p>
                      <p className="text-xs text-slate-400">{player.preferredRole}</p>
                    </div>
                    <Badge className={roleColors[player.preferredRole]}>
                      {player.preferredRole}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Looking for */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Role Demand Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["tank", "dps", "healer", "support"] as const).map((role) => (
                <div key={role} className="flex items-center justify-between rounded bg-slate-700/60 border border-slate-600 px-3 py-2 text-sm">
                  <span className="text-slate-200 capitalize">{role}</span>
                  <Badge className={roleColors[role]}>{roleCounts[role] || 0}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Operation Briefing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div>• Recommended composition: 1 Tank, 1 Healer, 2 DPS, 1 Support.</div>
              <div>• Queue bonus applies when filling missing roles.</div>
              <div>• Matchmaking prioritizes power balance over queue order for elite raids.</div>
              <div>• Completing runs improves finder rating and shortens future waits.</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Looking For Groups</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No active raid groups recruiting at this time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
