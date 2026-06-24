import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GameLogo from "@/components/GameLogo";
import { Rocket, Github, Globe2, Swords, Target, Trophy } from "lucide-react";
import { Link } from "wouter";
import { BUILD_INFO, getDisplayVersion } from "@shared/config/buildConfig";

const NINE_REALMS = [
  { id: "realm-01", name: "Asgard Prime", rank: "Sovereign Tier I", universe: "Nexus Crown", detail: "Capital command realm anchoring diplomacy, governance, and apex fleet command.", population: "14.2M online citizens", server: "nexus-alpha", color: "from-yellow-500 to-amber-600" },
  { id: "realm-02", name: "Midgard Frontier", rank: "Dominion Tier II", universe: "Nexus Crown", detail: "Balanced empire realm focused on colonization, growth, and trade corridors.", population: "11.8M online citizens", server: "nexus-alpha", color: "from-green-500 to-emerald-600" },
  { id: "realm-03", name: "Alfheim Radiant", rank: "Ascendant Tier III", universe: "Aurora Reach", detail: "High-research realm driving breakthroughs, relic discovery, and science bonuses.", population: "9.4M online citizens", server: "cygnus-eu", color: "from-blue-500 to-cyan-600" },
  { id: "realm-04", name: "Jotunheim Bastion", rank: "Warfront Tier IV", universe: "Aurora Reach", detail: "Heavy-industry and siege realm built for defense grids and assault fleets.", population: "8.9M online citizens", server: "cygnus-eu", color: "from-red-500 to-orange-600" },
  { id: "realm-05", name: "Vanaheim Bloom", rank: "Prosperity Tier V", universe: "Verdant Expanse", detail: "Economic powerhouse with premium resources, logistics, and merchant throughput.", population: "10.6M online citizens", server: "orion-apac", color: "from-emerald-500 to-teal-600" },
  { id: "realm-06", name: "Svartalf Forge", rank: "Industrial Tier VI", universe: "Verdant Expanse", detail: "Blueprint, fabrication, and shipyard realm for elite hull and module output.", population: "7.7M online citizens", server: "orion-apac", color: "from-slate-400 to-zinc-600" },
  { id: "realm-07", name: "Muspel Pyre", rank: "Strike Tier VII", universe: "Crimson Verge", detail: "Aggressive combat realm specialized in raids and thermal warfare.", population: "6.3M online citizens", server: "nexus-alpha", color: "from-orange-500 to-red-600" },
  { id: "realm-08", name: "Niflheim Veil", rank: "Shadow Tier VIII", universe: "Crimson Verge", detail: "Espionage and stealth-operations realm covering probes and sabotage.", population: "5.8M online citizens", server: "cygnus-eu", color: "from-purple-500 to-indigo-600" },
  { id: "realm-09", name: "Hel Nexus", rank: "Endgame Tier IX", universe: "Oblivion Gate", detail: "Late-cycle realm for veterans contesting world bosses and ascension loops.", population: "4.9M online citizens", server: "orion-apac", color: "from-rose-500 to-pink-600" },
] as const;

const REALM_SERVER_MAP: Record<(typeof NINE_REALMS)[number]["id"], string> = {
  "realm-01": "nexus-alpha",
  "realm-02": "nexus-alpha",
  "realm-03": "cygnus-eu",
  "realm-04": "cygnus-eu",
  "realm-05": "orion-apac",
  "realm-06": "orion-apac",
  "realm-07": "nexus-alpha",
  "realm-08": "cygnus-eu",
  "realm-09": "orion-apac",
};

type RealmItem = typeof NINE_REALMS[number];

function RealmDetailModal({ realm, open, onClose, onSelect }: { realm: RealmItem | null; open: boolean; onClose: () => void; onSelect?: (id: string) => void }) {
  if (!realm || !open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors" aria-label="Close">✕</button>
        <div className={cn("mb-2 text-xs uppercase tracking-widest font-bold bg-gradient-to-r bg-clip-text text-transparent", realm.color)}>{realm.rank}</div>
        <div className="font-orbitron text-2xl font-bold text-white mb-1">{realm.name}</div>
        <div className="text-xs text-slate-400 mb-2">Universe: <span className="font-semibold text-slate-300">{realm.universe}</span></div>
        <div className="mb-3 text-slate-300 text-sm">{realm.detail}</div>
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-300">{realm.population}</div>
          <div className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-400">Server: {realm.server}</div>
        </div>
        {onSelect && (
          <button
            className={cn("w-full bg-gradient-to-r text-white py-2 rounded font-semibold transition-all hover:shadow-lg", realm.color)}
            onClick={() => onSelect(realm.id)}
          >
            Enter {realm.name}
          </button>
        )}
      </div>
    </div>
  );
}

function StarfieldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="starfield-layer" />
      <div className="nebula-layer" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
    </div>
  );
}

function ParticleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 animate-particle-float"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${6 + Math.random() * 6}s` }} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={`s-${i}`} className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-0 animate-star-twinkle"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }} />
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-nebula-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-nebula-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-[100px] animate-nebula-pulse-slow" />
    </div>
  );
}

const FEATURES = [
  { icon: Swords, title: "4X Strategy" },
  { icon: Target, title: "Real-time Combat" },
  { icon: Globe2, title: "Alliance Wars" },
  { icon: Trophy, title: "Season Pass" },
];

export default function RealmsPage() {
  const { switchRealm } = useGame();
  const [realmDetail, setRealmDetail] = useState<RealmItem | null>(null);
  const [realmModalOpen, setRealmModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSelectRealm = async (realmId: string) => {
    setRealmModalOpen(false);
    const serverRealmId = REALM_SERVER_MAP[realmId as keyof typeof REALM_SERVER_MAP];
    if (!serverRealmId) { setError("This realm does not have an available deployment server."); return; }
    try { await switchRealm(serverRealmId); localStorage.setItem("stellar_public_realm", realmId); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to select this realm."); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      <StarfieldBackground />
      <ParticleEffect />

      <div className="relative z-10 flex flex-col items-center pt-20 pb-8 px-6">
        <div className="text-center space-y-5 mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <GameLogo size="xl" animated showText className="relative drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
          </div>
          <p className="text-lg text-slate-300 font-rajdhani font-medium">Command Your Empire. Shape the Galaxy.</p>
        </div>

        <div className="flex items-center justify-center gap-8 mt-2 text-xs text-slate-400">
          {FEATURES.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-2"><Icon className="w-4 h-4 text-cyan-400" /><span>{title}</span></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-slate-950/80 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider mb-3">SELECT YOUR REALM</h2>
            <p className="text-sm text-slate-400">Nine linked universe realms for ranked progression and deployment focus</p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 text-red-300 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-center">{error}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NINE_REALMS.map((realm, i) => (
              <Card key={realm.id} className="group bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10"
                onClick={() => { setRealmDetail(realm); setRealmModalOpen(true); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Realm {i + 1}</div>
                    <Badge variant="outline" className={cn("text-[9px] bg-gradient-to-r bg-clip-text text-transparent border-current", realm.color)}>{realm.rank.split(" ")[0]}</Badge>
                  </div>
                  <div className="font-orbitron text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{realm.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-[0.18em] mb-2">{realm.universe}</div>
                  <p className="text-xs leading-4 text-slate-400 mb-3">{realm.detail}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{realm.population}</span><span className="font-mono">Gate {i + 1}/9</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 bg-slate-950 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span className="font-orbitron font-bold text-sm text-white tracking-wide">{BUILD_INFO.appName}</span>
              <span className="text-xs text-slate-500">{getDisplayVersion()}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{BUILD_INFO.buildName}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{BUILD_INFO.buildChannel}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">Universe {BUILD_INFO.universeId}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/" className="hover:text-white transition-colors">Back to Home</Link>
              <a href={BUILD_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors">
                <Github className="w-3.5 h-3.5" /> {BUILD_INFO.devAlias}
              </a>
              <span className="text-slate-600">•</span>
              <span>Developer: {BUILD_INFO.devName}</span>
            </div>
          </div>
        </div>
      </footer>

      <RealmDetailModal realm={realmDetail} open={realmModalOpen} onClose={() => setRealmModalOpen(false)} onSelect={handleSelectRealm} />
    </div>
  );
}
