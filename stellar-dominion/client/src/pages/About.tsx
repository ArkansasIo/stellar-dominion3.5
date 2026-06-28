import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Globe, Users, Swords, FlaskConical, Building, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const gameplayLoops = [
    "Expand economy with mining, logistics, and production balancing.",
    "Convert production into military and exploration capability.",
    "Compete or cooperate through alliance diplomacy and conflict.",
    "Cycle progression through research, policy, and strategic adaptation.",
  ];

  const roadmap = [
    { phase: "Phase I", focus: "Core economy, research, and fleet systems" },
    { phase: "Phase II", focus: "Expanded alliance wars and dynamic events" },
    { phase: "Phase III", focus: "Seasonal progression, relic progression, and narrative arcs" },
    { phase: "Phase IV", focus: "Endgame sovereignty and inter-universe competition" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-900" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-slate-900 mb-4">Universe-Empires-Dominions</h1>
          <p className="text-xl text-slate-600 font-rajdhani max-w-2xl mx-auto">
            A 4X space strategy MMORPG where you build your empire, command fleets, and conquer the galaxy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Building className="w-6 h-6 text-blue-500" />
                Build Your Empire
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Construct mines, factories, and research facilities. Expand from a single colony to a sprawling interstellar empire with orbital stations and lunar bases.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <FlaskConical className="w-6 h-6 text-purple-500" />
                Research Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Unlock powerful technologies across multiple tech trees. From weapons systems to hyperspace drives, research is key to dominance.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Swords className="w-6 h-6 text-red-500" />
                Command Fleets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Build massive fleets of fighters, cruisers, and battleships. Launch attacks, espionage missions, and defend your territory against invaders.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Users className="w-6 h-6 text-green-500" />
                Form Alliances
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Join forces with other commanders. Create or join alliances to share resources, coordinate attacks, and dominate the leaderboards.
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-50 border-slate-200 shadow-sm mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <Globe className="w-6 h-6 text-cyan-500" />
              Game Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Real-time resource production
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Multiple commander races and classes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Persistent universe with other players
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Government and policy systems
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Crafting and equipment system
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Galactic marketplace for trading
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Ancient artifacts with special powers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                Detailed combat simulation system
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Core Gameplay Loop</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-600">
              {gameplayLoops.map((item) => (
                <div key={item} className="text-sm">• {item}</div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-600">
              {roadmap.map((step) => (
                <div key={step.phase} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="font-semibold text-slate-900">{step.phase}</div>
                  <div className="text-sm">{step.focus}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-orbitron tracking-wider px-8" data-testid="button-start-playing">
              <Rocket className="w-5 h-5 mr-2" /> Start Playing
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Version 0.1.0 - Created with passion for space strategy games
          </p>
        </div>
      </div>
    </div>
  );
}
