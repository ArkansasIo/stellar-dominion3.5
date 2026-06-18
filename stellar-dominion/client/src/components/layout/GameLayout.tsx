import { Link, useLocation } from "wouter";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PLANET_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Pickaxe, 
  Factory, 
  FlaskConical, 
  Rocket, 
  Send, 
  Globe, 
  Settings,
  Zap,
  Database,
  Box,
  Gem,
  User,
  Landmark,
  Mail,
  Shield,
  Hexagon,
  ShieldAlert,
  LogOut,
  ShoppingBag,
  Orbit,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Swords,
  Users,
  Map,
  Building2,
  Sparkles,
  CircleDot,
  GraduationCap,
  Compass,
  Home,
  Coins,
  Droplets,
  FileText,
  Trophy,
  Wheat,
  Crown,
  Satellite,
  Link2,
  ScrollText,
  BookOpen,
  Network,
  AlertTriangle,
  Image,
  Award,
  Store,
} from "lucide-react";

const SidebarItem = ({ href, icon: Icon, label, active, className, indent = false }: { href: string, icon: any, label: string, active: boolean, className?: string, indent?: boolean }) => (
  <Link href={href} data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className={cn(
      "flex items-center gap-3 cursor-pointer transition-all duration-200 border-l-2",
      indent ? "px-6 py-2 text-xs" : "px-4 py-3",
      active 
        ? "bg-primary/10 border-primary text-primary font-bold" 
        : "border-transparent hover:bg-slate-200 hover:text-primary hover:border-primary/50 text-muted-foreground",
      className
    )}>
      <Icon className={indent ? "w-4 h-4" : "w-5 h-5"} />
      <span className={cn("font-rajdhani font-semibold tracking-wider uppercase", indent ? "text-xs" : "text-sm")}>{label}</span>
    </div>
  </Link>
);

interface MenuSection {
  title: string;
  icon: any;
  items: { href: string; icon: any; label: string }[];
}

const CollapsibleMenu = ({ title, icon: Icon, items, location, defaultOpen = false }: { 
  title: string; 
  icon: any; 
  items: { href: string; icon: any; label: string }[];
  location: string;
  defaultOpen?: boolean;
}) => {
  const hasActiveChild = items.some(item => location === item.href);
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);
  
  return (
    <div className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 border-l-2",
          hasActiveChild 
            ? "bg-primary/5 border-primary/50 text-primary" 
            : "border-transparent hover:bg-slate-100 text-muted-foreground hover:text-slate-700"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-rajdhani font-semibold tracking-wider uppercase text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="bg-slate-50/50">
          {items.map(item => (
            <SidebarItem 
              key={item.href}
              href={item.href} 
              icon={item.icon} 
              label={item.label} 
              active={location === item.href}
              indent
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ResourceDisplay = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: number, colorClass: string }) => (
  <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded shadow-sm min-w-[140px]">
    <div className={cn("p-2 rounded-full bg-slate-100", colorClass)}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={cn("font-orbitron font-medium text-sm tabular-nums", colorClass)}>
        {Math.floor(value).toLocaleString()}
      </span>
    </div>
  </div>
);

const TurnDisplay = ({ currentTurns, totalTurns, isLoading }: { currentTurns: number, totalTurns: number, isLoading: boolean }) => (
  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 px-4 py-2 rounded shadow-sm min-w-[180px]" data-testid="display-turns">
    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Turns</span>
      <div className="flex items-center gap-2">
        <span className="font-orbitron font-bold text-sm tabular-nums text-indigo-900">
          {currentTurns.toLocaleString()}
        </span>
        <span className="text-[10px] text-indigo-500 font-mono">+6/min</span>
      </div>
    </div>
    <div className="border-l border-indigo-200 pl-3 ml-1">
      <span className="text-[9px] uppercase tracking-widest text-slate-400">Total</span>
      <div className="font-mono text-xs text-slate-600">{totalTurns.toLocaleString()}</div>
    </div>
  </div>
);

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { resources, planetName, coordinates, isAdmin, logout, username } = useGame();
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";
  const buildId = import.meta.env.VITE_BUILD_ID || "dev";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "local";
  const sidebarPlanetImage = PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  const fallbackPlanetImage = "/theme-temp.png";

  const { data: turnData, isLoading: turnsLoading } = useQuery({
    queryKey: ['/api/turns'],
    queryFn: async () => {
      const res = await fetch('/api/turns', { credentials: 'include' });
      if (!res.ok) return { currentTurns: 0, totalTurns: 0 };
      return res.json();
    },
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen text-slate-900 overflow-hidden flex flex-col bg-slate-50">
      
      {/* Top Bar - Resources */}
      <header className="relative z-20 h-24 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-sm">
             <Rocket className="text-white w-6 h-6" />
           </div>
           <div>
             <h1 className="font-orbitron font-bold text-xl tracking-wider text-slate-900">Universe-<span className="text-primary text-sm font-normal">Empires-Dominions</span></h1>
             <p className="text-xs text-muted-foreground font-rajdhani tracking-widest uppercase">Server: Nexus-Alpha // User: {username || "Commander"}</p>
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="hidden lg:flex items-center gap-1">
              {[
              { href: "/forums", label: "Forums" },
              { href: "/about", label: "About" },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
            ].map((entry) => (
              <Link key={entry.href} href={entry.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-[11px]",
                    location === entry.href ? "text-primary" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {entry.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            <TurnDisplay 
              currentTurns={turnData?.currentTurns || 0} 
              totalTurns={turnData?.totalTurns || 0} 
              isLoading={turnsLoading} 
            />
            <ResourceDisplay icon={Box} label="Metal" value={resources.metal} colorClass="text-slate-600" />
            <ResourceDisplay icon={Gem} label="Crystal" value={resources.crystal} colorClass="text-blue-600" />
            <ResourceDisplay icon={Database} label="Deuterium" value={resources.deuterium} colorClass="text-green-600" />
            <ResourceDisplay icon={Zap} label="Energy" value={resources.energy} colorClass={resources.energy >= 0 ? "text-yellow-600" : "text-red-600"} />
            <ResourceDisplay icon={Coins} label="Credits" value={resources.credits} colorClass="text-amber-600" />
            <ResourceDisplay icon={Wheat} label="Food" value={resources.food} colorClass="text-lime-600" />
            <ResourceDisplay icon={Droplets} label="Water" value={resources.water} colorClass="text-cyan-600" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto scrollbar-hide">
          
          <div className="p-6">
             <div className="bg-slate-100 border border-slate-200 p-4 rounded text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-full border-2 border-primary mb-3 shadow-sm overflow-hidden">
                  <img
                    src={sidebarPlanetImage}
                    alt={planetName || "Planet"}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackPlanetImage;
                    }}
                  />
                </div>
                <h3 className="font-orbitron font-bold text-slate-900">{planetName}</h3>
                <p className="text-xs text-muted-foreground">[{coordinates}]</p>
             </div>
          </div>

          <nav className="flex-1 py-2">
            {/* Main Overview */}
            <SidebarItem href="/" icon={LayoutDashboard} label="Overview" active={location === "/"} />
            
            {/* Empire Development Menu */}
            <CollapsibleMenu 
              title="Empire" 
              icon={Building2} 
              location={location}
              defaultOpen
              items={[
                { href: "/empire-command-center", icon: Crown, label: "Command Center" },
                { href: "/empire-view", icon: LayoutDashboard, label: "Empire View" },
                { href: "/civilization-systems", icon: Users, label: "Civilization Systems" },
                { href: "/civilization-management", icon: Building2, label: "Civilization Mgmt" },
                { href: "/resources", icon: Pickaxe, label: "Resources" },
                { href: "/facilities", icon: Factory, label: "Facilities" },
                { href: "/megastructures", icon: CircleDot, label: "Megastructures" },
                { href: "/stations", icon: Satellite, label: "Stations" },
                { href: "/colonies", icon: Home, label: "Colonies" },
                { href: "/planet-command", icon: Globe, label: "Planet Command" },
                { href: "/empire-progression", icon: Crown, label: "Kardashev Scale" },
              ]}
            />
            
            {/* Research & Technology Menu */}
            <CollapsibleMenu 
              title="Research" 
              icon={FlaskConical} 
              location={location}
              items={[
                { href: "/research", icon: FlaskConical, label: "Research Lab" },
                { href: "/research-lab", icon: Zap, label: "Research Management" },
                { href: "/technology-tree", icon: GraduationCap, label: "Tech Tree" },
                { href: "/ogame-compendium", icon: Database, label: "OGame Compendium" },
                { href: "/blueprints", icon: FileText, label: "Blueprints" },
                { href: "/artifacts", icon: Hexagon, label: "Artifacts" },
              ]}
            />
            
            {/* Military Menu */}
            <CollapsibleMenu 
              title="Military" 
              icon={Swords} 
              location={location}
              items={[
                { href: "/shipyard", icon: Rocket, label: "Shipyard" },
                { href: "/fleet", icon: Send, label: "Fleet Command" },
                { href: "/army", icon: Users, label: "Army" },
                { href: "/army-management", icon: Swords, label: "Army Management" },
                { href: "/expeditions", icon: Compass, label: "Expeditions" },
                { href: "/combat", icon: Swords, label: "Combat" },
                { href: "/battle-logs", icon: ScrollText, label: "Battle Logs" },
              ]}
            />
            
            {/* Exploration Menu */}
            <CollapsibleMenu 
              title="Exploration" 
              icon={Map} 
              location={location}
              items={[
                { href: "/interstellar", icon: Sparkles, label: "Interstellar" },
                { href: "/galaxy", icon: Globe, label: "Galaxy Map" },
                { href: "/universe", icon: Orbit, label: "Universe" },
                { href: "/exploration", icon: Compass, label: "Exploration" },
                { href: "/warp-network", icon: Network, label: "Warp Network" },
                { href: "/celestial-browser", icon: CircleDot, label: "Celestial Browser" },
                { href: "/biome-codex", icon: BookOpen, label: "Biome Codex" },
                { href: "/empire-planets", icon: Globe, label: "Empire Planets" },
              ]}
            />
            
            {/* Diplomacy & Social Menu */}
            <CollapsibleMenu 
              title="Diplomacy" 
              icon={Shield} 
              location={location}
              items={[
                { href: "/commander", icon: User, label: "Commander" },
                { href: "/season-pass", icon: Award, label: "Season Pass" },
                { href: "/battle-pass", icon: Swords, label: "Battle Pass" },
                { href: "/government", icon: Landmark, label: "Government" },
                { href: "/factions", icon: Users, label: "Factions" },
                { href: "/alliance", icon: Shield, label: "Alliance" },
                { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
                { href: "/messages", icon: Mail, label: "Messages" },
              ]}
            />
            
            {/* Economy Menu */}
            <CollapsibleMenu 
              title="Economy" 
              icon={ShoppingBag} 
              location={location}
              items={[
                { href: "/market", icon: ShoppingBag, label: "Market" },
                { href: "/merchants", icon: User, label: "Merchants" },
                { href: "/storefront", icon: Store, label: "Storefront" },
                { href: "/achievements", icon: Trophy, label: "Achievements" },
              ]}
            />
            
            {/* System */}
            <div className="px-4 mt-4 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">System</div>
            <SidebarItem href="/diagnostics" icon={AlertTriangle} label="Diagnostics" active={location === "/diagnostics"} />
            <SidebarItem href="/assets-gallery" icon={Image} label="Assets Gallery" active={location === "/assets-gallery"} />
            <SidebarItem href="/settings" icon={Settings} label="Settings" active={location === "/settings"} />
            
            {isAdmin && (
               <>
                  <div className="px-4 mt-4 mb-2 text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                     <ShieldAlert className="w-3 h-3" /> Administration
                  </div>
                  <SidebarItem href="/admin" icon={ShieldAlert} label="Control Panel" active={location === "/admin"} className="text-red-600 hover:bg-red-50 hover:text-red-700" />
               </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-200">
             <button 
               onClick={logout}
               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition-colors text-sm font-bold uppercase tracking-wider"
             >
               <LogOut className="w-4 h-4" /> Logout
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-slate-50">
           <div className="max-w-6xl mx-auto">
             {children}
           </div>
        </main>
      </div>

      <footer className="h-8 border-t border-slate-200 bg-white px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono" data-testid="footer-build-info">
        <div>Universe-Empires-Dominions</div>
        <div className="flex items-center gap-4">
          <span>Version: {appVersion}</span>
          <span>Build: {buildId}</span>
          <span>Time: {buildTime}</span>
        </div>
      </footer>
    </div>
  );
}
