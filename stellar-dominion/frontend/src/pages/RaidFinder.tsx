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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Search className="w-8 h-8 text-primary" />
          Raid Finder
        </h1>

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
