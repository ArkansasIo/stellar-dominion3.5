import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Coins } from "lucide-react";

export default function Guilds() {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);

  const { data: playerGuild = null } = useQuery({
    queryKey: ["player-guild"],
    queryFn: () => fetch("/api/guilds/mine").then(r => r.json()).catch(() => null),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["guild-members", selectedGuild || playerGuild?.id],
    queryFn: () =>
      selectedGuild || playerGuild?.id
        ? fetch(`/api/guilds/${selectedGuild || playerGuild?.id}/members`).then(r => r.json()).catch(() => [])
        : Promise.resolve([]),
    enabled: !!(selectedGuild || playerGuild?.id),
  });

  const currentGuildId = selectedGuild || playerGuild?.id;
  const guild = selectedGuild || playerGuild;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Guilds
        </h1>

        {!guild ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Create or Join a Guild</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => alert("Guild creation feature coming soon!")} data-testid="button-create-guild">
                Create Guild
              </Button>
              <Button variant="outline" className="w-full" onClick={() => alert("Browsing guild directory...")} data-testid="button-browse-guilds">
                Browse Guilds
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Guild Header */}
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-3xl">{guild.name}</CardTitle>
                    <p className="text-slate-400 text-sm mt-2">{guild.description}</p>
                  </div>
                  <Badge className="bg-primary">Level {guild.level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs">Members</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-1">
                      <Users className="w-5 h-5" />
                      {guild.totalMembers}/{guild.maxMembers}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs">Treasury</p>
                    <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                      <Coins className="w-5 h-5" />
                      {guild.treasury}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs">Influence</p>
                    <p className="text-2xl font-bold text-purple-400">{guild.influence}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs">Status</p>
                    <Badge className={guild.isRecruiting ? "bg-green-600" : "bg-slate-600"}>
                      {guild.isRecruiting ? "Recruiting" : "Closed"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Members ({members.length})</h2>
              <div className="grid gap-3">
                {members.map((member: any) => (
                  <Card key={member.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{member.playerName}</p>
                          <p className="text-sm text-slate-400">Role: {member.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Contributed</p>
                          <p className="text-sm text-primary">+{member.contributedCurrency} currency</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
