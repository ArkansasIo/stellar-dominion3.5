import { Switch, Route } from "wouter";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/gameContext";
import { Rocket } from "lucide-react";

import { useGame } from "@/lib/gameContext";

const NotFound = lazy(() => import("@/pages/not-found"));
const Overview = lazy(() => import("@/pages/Overview"));
const Resources = lazy(() => import("@/pages/Resources"));
const Facilities = lazy(() => import("@/pages/Facilities"));
const Research = lazy(() => import("@/pages/Research"));
const Skills = lazy(() => import("@/pages/Skills"));
const Fitting = lazy(() => import("@/pages/Fitting"));
const FittingEnhanced = lazy(() => import("@/pages/FittingEnhanced"));
const Shipyard = lazy(() => import("@/pages/Shipyard"));
const Fleet = lazy(() => import("@/pages/Fleet"));
const Galaxy = lazy(() => import("@/pages/Galaxy"));
const Universe = lazy(() => import("@/pages/Universe"));
const UniverseGenerator = lazy(() => import("@/pages/UniverseGenerator"));
const Commander = lazy(() => import("@/pages/Commander"));
const Government = lazy(() => import("@/pages/Government"));
const Settings = lazy(() => import("@/pages/Settings"));
const Messages = lazy(() => import("@/pages/Messages"));
const Alliance = lazy(() => import("@/pages/Alliance"));
const Artifacts = lazy(() => import("@/pages/Artifacts"));
const Interstellar = lazy(() => import("@/pages/Interstellar"));
const Admin = lazy(() => import("@/pages/AdminControl"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const Auth = lazy(() => import("@/pages/Auth"));
const Market = lazy(() => import("@/pages/Market"));
const About = lazy(() => import("@/pages/About"));
const Combat = lazy(() => import("@/pages/Combat"));
const BattleLogs = lazy(() => import("@/pages/BattleLogs"));
const AccountSetup = lazy(() => import("@/pages/AccountSetup"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Forums = lazy(() => import("@/pages/Forums"));
const ServerConsole = lazy(() => import("@/pages/ServerConsole"));
const Exploration = lazy(() => import("@/pages/Exploration"));
const Colonies = lazy(() => import("@/pages/Colonies"));
const TechTree = lazy(() => import("@/pages/TechTree"));
const Blueprints = lazy(() => import("@/pages/Blueprints"));
const TechnologyTree = lazy(() => import("@/pages/TechnologyTree"));
const Expeditions = lazy(() => import("@/pages/Expeditions"));
const Army = lazy(() => import("@/pages/Army"));
const ArmyManagement = lazy(() => import("@/pages/ArmyManagement"));
const TrainingCenter = lazy(() => import("@/pages/TrainingCenter"));
const GroundCombat = lazy(() => import("@/pages/GroundCombat"));
const CivilizationManagement = lazy(() => import("@/pages/CivilizationManagement"));
const MegaStructures = lazy(() => import("@/pages/MegaStructures"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Factions = lazy(() => import("@/pages/Factions"));
const EmpireProgression = lazy(() => import("@/pages/EmpireProgression"));
const WarpNetwork = lazy(() => import("@/pages/WarpNetwork"));
const Stations = lazy(() => import("@/pages/Stations"));
const Merchants = lazy(() => import("@/pages/Merchants"));
const Storefront = lazy(() => import("@/pages/Storefront"));
const CelestialBrowser = lazy(() => import("@/pages/CelestialBrowser"));
const BiomeCodex = lazy(() => import("@/pages/BiomeCodex"));
const BiomeDetail = lazy(() => import("@/pages/BiomeDetail"));
const Diagnostics = lazy(() => import("@/pages/Diagnostics"));
const StoryMode = lazy(() => import("@/pages/StoryMode"));
const SeasonPass = lazy(() => import("@/pages/SeasonPass"));
const BattlePass = lazy(() => import("@/pages/BattlePass"));
const CivilizationSystems = lazy(() => import("@/pages/CivilizationSystems"));
const Relics = lazy(() => import("@/pages/Relics"));
const FriendsList = lazy(() => import("@/pages/FriendsList"));
const Guilds = lazy(() => import("@/pages/Guilds"));
const Raids = lazy(() => import("@/pages/Raids"));
const UniverseEvents = lazy(() => import("@/pages/UniverseEvents"));
const RaidBosses = lazy(() => import("@/pages/RaidBosses"));
const RaidFinder = lazy(() => import("@/pages/RaidFinder"));
const EmpirePlanetViewer = lazy(() => import("@/pages/EmpirePlanetViewer"));
const EmpireView = lazy(() => import("@/pages/EmpireView"));
const EmpireCommandCenter = lazy(() => import("@/pages/EmpireCommandCenter"));
const ResearchLab = lazy(() => import("@/pages/ResearchLab"));
const GameAssetsGallery = lazy(() => import("@/pages/GameAssetsGallery"));
const KnowledgeLibrary = lazy(() => import("@/pages/KnowledgeLibrary"));
const ResearchAnalyticsDashboard = lazy(() => import("@/pages/ResearchAnalyticsDashboard"));
const PlanetDetail = lazy(() => import("@/pages/PlanetDetail"));
const PlanetCommand = lazy(() => import("@/pages/PlanetCommand"));
const PlanetaryOccupation = lazy(() => import("@/pages/PlanetaryOccupation"));
const OgameCompendium = lazy(() => import("@/pages/OgameCompendium"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const ThreeDViewerPortal = lazy(() => import("@/pages/ThreeDViewerPortal"));
const DatabaseAdmin = lazy(() => import("@/pages/DatabaseAdmin"));
const AdminMods = lazy(() => import("@/pages/AdminMods"));
const AdminI18n = lazy(() => import("@/pages/AdminI18n"));
const AdminBotAI = lazy(() => import("@/pages/AdminBotAI"));
const AdminFeed = lazy(() => import("@/pages/AdminFeed"));
const AdminIntegrity = lazy(() => import("@/pages/AdminIntegrity"));
const PowerGrid = lazy(() => import("@/pages/PowerGrid"));
const OrbitalDefense = lazy(() => import("@/pages/OrbitalDefense"));
const DimensionalHub = lazy(() => import("@/pages/DimensionalHub"));
const Trials = lazy(() => import("@/pages/Trials"));
const Index = lazy(() => import("@/pages/Index"));
const Espionage = lazy(() => import("@/pages/Espionage"));
const Missions = lazy(() => import("@/pages/Missions"));
const CommerceHub = lazy(() => import("@/pages/CommerceHub"));
const Population = lazy(() => import("@/pages/Population"));
const Hazards = lazy(() => import("@/pages/Hazards"));

function LoadingSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin" />
          <div className="absolute inset-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="font-orbitron text-4xl font-bold text-white tracking-widest mb-2">
          Universe-<span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Empires-Dominions</span>
        </h1>
        <p className="text-slate-300 font-rajdhani text-xs tracking-widest uppercase mb-5">
          Connecting to Nexus Command System
        </p>

        <div className="w-44 h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse w-3/4" />
        </div>

        <p className="text-slate-400 font-rajdhani text-xs">Initializing game systems...</p>
      </div>

      <div className="absolute bottom-6 text-slate-500 text-xs font-mono">
        <span className="text-blue-400">Alpha 1.5.0</span> • Live Preview Build
      </div>
    </div>
  );
}

function RouterContent() {
  const { isLoggedIn, needsSetup, isLoading } = useGame();
  const [showSplash, setShowSplash] = useState(true);
  const loadingStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (loadingStartedAtRef.current === null) {
        loadingStartedAtRef.current = Date.now();
      }
      setShowSplash(true);
      return;
    }

    if (loadingStartedAtRef.current === null) {
      setShowSplash(false);
      return;
    }

    const elapsed = Date.now() - loadingStartedAtRef.current;
    const minSplashMs = 350;
    if (elapsed >= minSplashMs) {
      setShowSplash(false);
      loadingStartedAtRef.current = null;
      return;
    }

    const timeout = setTimeout(() => {
      setShowSplash(false);
      loadingStartedAtRef.current = null;
    }, minSplashMs - elapsed);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading || showSplash) {
    return <LoadingSplash />;
  }

  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/auth" component={Auth} />
        <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/database" component={DatabaseAdmin} />
        <Route path="/admin/mods" component={AdminMods} />
        <Route path="/admin/i18n" component={AdminI18n} />
        <Route path="/admin/bot-ai" component={AdminBotAI} />
        <Route path="/admin/feed" component={AdminFeed} />
        <Route path="/admin/integrity" component={AdminIntegrity} />
        <Route path="/about" component={About} />
        <Route path="/forums" component={Forums} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={Auth} />
      </Switch>
    );
  }

  if (needsSetup) {
    return (
      <Switch>
        <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/database" component={DatabaseAdmin} />
        <Route path="/admin/mods" component={AdminMods} />
        <Route path="/admin/i18n" component={AdminI18n} />
        <Route path="/admin/bot-ai" component={AdminBotAI} />
        <Route path="/admin/feed" component={AdminFeed} />
        <Route path="/admin/integrity" component={AdminIntegrity} />
        <Route path="/about" component={About} />
        <Route path="/forums" component={Forums} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={AccountSetup} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/" component={Overview} />
      <Route path="/about" component={About} />
      <Route path="/forums" component={Forums} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/resources" component={Resources} />
      <Route path="/power-grid" component={PowerGrid} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/research" component={Research} />
      <Route path="/skills" component={Skills} />
      <Route path="/fitting" component={Fitting} />
      <Route path="/fitting-enhanced" component={FittingEnhanced} />
      <Route path="/artifacts" component={Artifacts} />
      <Route path="/shipyard" component={Shipyard} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/army" component={Army} />
      <Route path="/army-management" component={ArmyManagement} />
      <Route path="/training-center" component={TrainingCenter} />
      <Route path="/ground-combat" component={GroundCombat} />
      <Route path="/civilization-management" component={CivilizationManagement} />
      <Route path="/interstellar" component={Interstellar} />
      <Route path="/galaxy" component={Galaxy} />
      <Route path="/universe" component={Universe} />
      <Route path="/universe-generator" component={UniverseGenerator} />
      <Route path="/commander" component={Commander} />
      <Route path="/government" component={Government} />
      <Route path="/alliance" component={Alliance} />
      <Route path="/market" component={Market} />
      <Route path="/messages" component={Messages} />
      <Route path="/combat" component={Combat} />
      <Route path="/orbital-defense" component={OrbitalDefense} />
      <Route path="/battle-logs" component={BattleLogs} />
      <Route path="/exploration" component={Exploration} />
      <Route path="/colonies" component={Colonies} />
      <Route path="/tech-tree" component={TechTree} />
      <Route path="/technology-tree" component={TechnologyTree} />
      <Route path="/expeditions" component={Expeditions} />
      <Route path="/blueprints" component={Blueprints} />
      <Route path="/megastructures" component={MegaStructures} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/factions" component={Factions} />
      <Route path="/empire-progression" component={EmpireProgression} />
      <Route path="/warp-network" component={WarpNetwork} />
      <Route path="/stations" component={Stations} />
      <Route path="/merchants" component={Merchants} />
      <Route path="/storefront" component={Storefront} />
      <Route path="/celestial-browser" component={CelestialBrowser} />
      <Route path="/biome-codex" component={BiomeCodex} />
      <Route path="/biome/:id" component={BiomeDetail} />
      <Route path="/diagnostics" component={Diagnostics} />
      <Route path="/story-mode" component={StoryMode} />
      <Route path="/season-pass" component={SeasonPass} />
      <Route path="/battle-pass" component={BattlePass} />
      <Route path="/civilization-systems" component={CivilizationSystems} />
      <Route path="/relics" component={Relics} />
      <Route path="/friends" component={FriendsList} />
      <Route path="/guilds" component={Guilds} />
      <Route path="/raids" component={Raids} />
      <Route path="/universe-events" component={UniverseEvents} />
      <Route path="/raid-bosses" component={RaidBosses} />
      <Route path="/raid-finder" component={RaidFinder} />
      <Route path="/empire-planets" component={EmpirePlanetViewer} />
      <Route path="/empire-view" component={EmpireView} />
      <Route path="/empire-command-center" component={EmpireCommandCenter} />
      <Route path="/dimensional-hub" component={DimensionalHub} />
      <Route path="/planet/:id" component={PlanetDetail} />
      <Route path="/planet-command" component={PlanetCommand} />
      <Route path="/planet-occupation" component={PlanetaryOccupation} />
      <Route path="/research-lab" component={ResearchLab} />
      <Route path="/trials" component={Trials} />
      <Route path="/knowledge-library" component={KnowledgeLibrary} />
      <Route path="/research-analytics" component={ResearchAnalyticsDashboard} />
      <Route path="/ogame-compendium" component={OgameCompendium} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/assets-gallery" component={GameAssetsGallery} />
      <Route path="/espionage" component={Espionage} />
      <Route path="/missions" component={Missions} />
      <Route path="/commerce" component={CommerceHub} />
      <Route path="/population" component={Population} />
      <Route path="/hazards" component={Hazards} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/database" component={DatabaseAdmin} />
      <Route path="/admin/mods" component={AdminMods} />
      <Route path="/admin/i18n" component={AdminI18n} />
      <Route path="/admin/bot-ai" component={AdminBotAI} />
      <Route path="/admin/feed" component={AdminFeed} />
      <Route path="/admin/integrity" component={AdminIntegrity} />
      <Route path="/server-console" component={ServerConsole} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <GameProvider>
      <Suspense fallback={<LoadingSplash />}>
        <RouterContent />
      </Suspense>
    </GameProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
