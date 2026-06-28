import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Sparkles, Shield, Zap, Wrench, Bug, Rocket, RefreshCw,
  CheckCircle, AlertTriangle, Star, ChevronDown, ChevronUp, Clock
} from "lucide-react";

type PatchNote = {
  id: string;
  version: string;
  date: string;
  critical: boolean;
  sections: { title: string; icon: any; color: string; items: string[] }[];
};

const PATCH_HISTORY: PatchNote[] = [
  {
    id: "v1.6.0",
    version: "1.6.0",
    date: "2026-06-20",
    critical: true,
    sections: [
      {
        title: "New Features",
        icon: Rocket,
        color: "text-green-400",
        items: [
          "Starbase Infrastructure — Build and manage 7 types of starbases across your empire",
          "Moon Colonization — Establish bases on moons orbiting your planets for passive resource generation",
          "Starbase Modules — Install specialized modules to customize starbase capabilities",
          "Spore Drive — Advanced jump drive technology for instant fleet travel",
          "Guild Treasury System — Contribute resources to your guild for collective upgrades",
          "Alliance Chat — Real-time communication with your alliance members",
          "Patch Notes Page — Full version history and changelog",
          "Live News Feed — Stay updated with galactic events, war alerts, and economy reports",
        ],
      },
      {
        title: "Balance Changes",
        icon: Wrench,
        color: "text-amber-400",
        items: [
          "Metal mine production scaled +15% at levels 50-75",
          "Crystal mine production scaled +10% at levels 40-60",
          "Espionage scan cooldown reduced from 120s to 60s",
          "Fleet speed increased by 8% across all drive types",
          "Research costs reduced by 5% for technologies above tier 20",
          "Shield regeneration rate increased by 12%",
        ],
      },
      {
        title: "Bug Fixes",
        icon: Bug,
        color: "text-red-400",
        items: [
          "Fixed fleet combat freeze on round 47",
          "Fixed WebSocket reconnect reliability issues",
          "Fixed market order display showing stale prices",
          "Fixed government buildings not showing correct level requirements",
          "Fixed commander skill tree not resetting properly",
          "Fixed expedition rewards not being applied correctly",
        ],
      },
      {
        title: "Performance",
        icon: Zap,
        color: "text-cyan-400",
        items: [
          "Optimized galaxy map rendering for systems with 100+ planets",
          "Reduced database query load by 40% on overview page",
          "Improved WebSocket message batching for real-time updates",
          "Lazy-loaded 15 non-critical page components",
        ],
      },
    ],
  },
  {
    id: "v1.5.0",
    version: "1.5.0",
    date: "2026-05-15",
    critical: false,
    sections: [
      {
        title: "New Features",
        icon: Rocket,
        color: "text-green-400",
        items: [
          "Commander Gacha System — Recruit commanders with unique skills and talents",
          "Dimensional Anomalies — Explore unstable regions for rare loot",
          "Resource Refineries — Process raw materials into refined goods",
          "Blueprint Charges — Enhanced blueprint crafting with charge mechanics",
          "High Command — Officer slots with strategic orders and synergies",
          "Smithy — Materials, enchantments, and blueprint tempering",
        ],
      },
      {
        title: "Balance Changes",
        icon: Wrench,
        color: "text-amber-400",
        items: [
          "All ship hull points increased by 5%",
          "Energy weapons damage reduced by 3% to compensate for higher accuracy",
          "Deuterium consumption for fleet jumps reduced by 10%",
          "Alliance member cap increased from 100 to 150",
        ],
      },
      {
        title: "Bug Fixes",
        icon: Bug,
        color: "text-red-400",
        items: [
          "Fixed resource overflow not capping at storage limits",
          "Fixed research queue allowing duplicate technologies",
          "Fixed fleet recall not returning ships to correct planet",
          "Fixed admin panel crash when viewing large player lists",
        ],
      },
    ],
  },
  {
    id: "v1.4.0",
    version: "1.4.0",
    date: "2026-04-10",
    critical: false,
    sections: [
      {
        title: "New Features",
        icon: Rocket,
        color: "text-green-400",
        items: [
          "Guild System — Create and join guilds for cooperative play",
          "Alliance Wars — Declare war and track kills vs enemy alliances",
          "Joint Operations — Coordinate raids, sieges, and expeditions with allies",
          "Diplomacy System — Alliance proposals, talks, warnings, and war declarations",
          "Battle Logs — Detailed combat reports with round-by-round breakdowns",
          "Achievements System — 50+ milestones across all game systems",
        ],
      },
      {
        title: "Balance Changes",
        icon: Wrench,
        color: "text-amber-400",
        items: [
          "Defense platform hit points increased by 20%",
          "Colony ship build time reduced by 15%",
          "Spy drone detection range increased by 25%",
        ],
      },
      {
        title: "Bug Fixes",
        icon: Bug,
        color: "text-red-400",
        items: [
          "Fixed alliance member count not updating in real-time",
          "Fixed guild chat messages not appearing for new members",
          "Fixed war stats not tracking correctly for multi-front wars",
        ],
      },
    ],
  },
  {
    id: "v1.3.0",
    version: "1.3.0",
    date: "2026-03-01",
    critical: false,
    sections: [
      {
        title: "New Features",
        icon: Rocket,
        color: "text-green-400",
        items: [
          "Marketplace — Player-driven economy with buy/sell orders",
          "Espionage System — Scan, sabotage, and intelligence gathering",
          "Megastructures — Build colossal empire-defining constructions",
          "Government System — 10 government types with ethics and civics",
          "Season Pass — Seasonal progression with exclusive rewards",
        ],
      },
      {
        title: "Bug Fixes",
        icon: Bug,
        color: "text-red-400",
        items: [
          "Fixed planet resource display showing incorrect values",
          "Fixed fleet composition screen not loading ship data",
          "Fixed research tree scroll position resetting on page load",
        ],
      },
    ],
  },
  {
    id: "v1.2.0",
    version: "1.2.0",
    date: "2026-02-01",
    critical: false,
    sections: [
      {
        title: "New Features",
        icon: Rocket,
        color: "text-green-400",
        items: [
          "Colony Management — Expand your empire across star systems",
          "Shipyard — Build 6 ship classes with fitting and blueprints",
          "Research Tree — 900+ technologies across weapons, shields, drives",
          "Fleet Combat — PvP and PvE with formations and crit system",
        ],
      },
      {
        title: "Performance",
        icon: Zap,
        color: "text-cyan-400",
        items: [
          "Initial load time reduced by 60%",
          "Database connection pooling optimized",
          "Static asset caching improved",
        ],
      },
    ],
  },
];

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  new: Rocket,
  balance: Wrench,
  bugfix: Bug,
  performance: Zap,
  security: Shield,
  all: FileText,
};

export default function PatchNotes() {
  const { toast } = useToast();
  const [expandedVersion, setExpandedVersion] = useState<string | null>(PATCH_HISTORY[0].id);
  const [filter, setFilter] = useState<string>("all");

  const { data: manifest, isLoading: manifestLoading } = useQuery({
    queryKey: ["update-manifest"],
    queryFn: async () => {
      const res = await fetch("/api/updates/manifest", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const handleCheckUpdate = async () => {
    try {
      const res = await fetch("/api/updates/check?version=1.6.0&platform=web", { credentials: "include" });
      const data = await res.json();
      if (data.upToDate) {
        toast({ title: "Up to Date", description: "You are running the latest version." });
      } else {
        toast({ title: "Update Available", description: `Version ${data.latestVersion} is available.` });
      }
    } catch {
      toast({ title: "Update Check", description: "Could not reach update server.", variant: "destructive" });
    }
  };

  return (
    <GameLayout>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" /> Patch Notes
            </h1>
            <p className="text-slate-400 mt-1">Version history and changelog for Stellar Dominion</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCheckUpdate} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" /> Check for Updates
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">v{PATCH_HISTORY[0].version}</div>
              <div className="text-xs text-slate-400">Current Version</div>
            </div>
            <div className="h-12 w-px bg-slate-600" />
            <div className="flex-1">
              <div className="text-sm text-slate-300">Released {PATCH_HISTORY[0].date}</div>
              <div className="text-xs text-slate-400 mt-1">{PATCH_HISTORY[0].sections.reduce((acc, s) => acc + s.items.length, 0)} changes across {PATCH_HISTORY[0].sections.length} categories</div>
            </div>
            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600/30">
              <CheckCircle className="w-3 h-3 mr-1" /> Stable
            </Badge>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {PATCH_HISTORY.map((patch) => {
            const isExpanded = expandedVersion === patch.id;
            const filteredSections = filter === "all"
              ? patch.sections
              : patch.sections.filter((_, i) => {
                  if (filter === "new") return i === 0;
                  if (filter === "balance") return i === 1;
                  if (filter === "bugfix") return i === 2;
                  if (filter === "performance") return i === 3;
                  return true;
                });

            return (
              <Card key={patch.id} className="bg-slate-900/80 border-slate-700">
                <button
                  className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors"
                  onClick={() => setExpandedVersion(isExpanded ? null : patch.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">v{patch.version}</span>
                      {patch.critical && <Badge className="bg-red-900/50 text-red-400 border-red-600/30 text-xs">Critical</Badge>}
                      <span className="text-xs text-slate-500">{patch.date}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {patch.sections.reduce((acc, s) => acc + s.items.length, 0)} changes
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50">
                    <div className="pt-4 space-y-4">
                      {filteredSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <div key={section.title}>
                            <h3 className={`text-sm font-semibold flex items-center gap-2 mb-2 ${section.color}`}>
                              <Icon className="w-4 h-4" /> {section.title}
                            </h3>
                            <ul className="space-y-1">
                              {section.items.map((item, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-slate-500 mt-1 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
