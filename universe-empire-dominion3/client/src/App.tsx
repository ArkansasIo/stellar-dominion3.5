import { Switch, Route } from "wouter";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { XpNotifications } from "@/components/XpWidget";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/gameContext";
import GameLogo from "@/components/GameLogo";

import { useGame } from "@/lib/gameContext";

const NotFound = lazy(() => import("@/pages/not-found"));
const Overview = lazy(() => import("@/pages/Overview"));
const Resources = lazy(() => import("@/pages/Resources"));
const Facilities = lazy(() => import("@/pages/Facilities"));
const Research = lazy(() => import("@/pages/Research"));
const Skills = lazy(() => import("@/pages/Skills"));
const Fitting = lazy(() => import("@/pages/Fitting"));
const Shipyard = lazy(() => import("@/pages/Shipyard"));
const Fleet = lazy(() => import("@/pages/Fleet"));
const FleetYard = lazy(() => import("@/pages/FleetYard"));
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
const BlueprintLithograph = lazy(() => import("@/pages/BlueprintLithograph"));
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
const Starbases = lazy(() => import("@/pages/Starbases"));
const Merchants = lazy(() => import("@/pages/Merchants"));
const Storefront = lazy(() => import("@/pages/Storefront"));
const CelestialBrowser = lazy(() => import("@/pages/CelestialBrowser"));
const BiomeCodex = lazy(() => import("@/pages/BiomeCodex"));
const BiomeDetail = lazy(() => import("@/pages/BiomeDetail"));
const Diagnostics = lazy(() => import("@/pages/Diagnostics"));
const StoryMode = lazy(() => import("@/pages/StoryMode"));
const Preludes = lazy(() => import("@/pages/Preludes"));
const SeasonPass = lazy(() => import("@/pages/SeasonPass"));
const BattlePass = lazy(() => import("@/pages/BattlePass"));
const CivilizationSystems = lazy(() => import("@/pages/CivilizationSystems"));
const Relics = lazy(() => import("@/pages/Relics"));
const FriendsList = lazy(() => import("@/pages/FriendsList"));
const Guilds = lazy(() => import("@/pages/Guilds"));
const Raids = lazy(() => import("@/pages/Raids"));
const UniverseEvents = lazy(() => import("@/pages/UniverseEvents"));
const RaidBosses = lazy(() => import("@/pages/RaidBosses"));
const WeeklyMissions = lazy(() => import("@/pages/WeeklyMissions"));
const RaidFinder = lazy(() => import("@/pages/RaidFinder"));
const EmpirePlanetViewer = lazy(() => import("@/pages/EmpirePlanetViewer"));
const EmpireView = lazy(() => import("@/pages/EmpireView"));
const EmpireCommandCenter = lazy(() => import("@/pages/EmpireCommandCenter"));
const ResearchLab = lazy(() => import("@/pages/ResearchLab"));
const GameAssetsGallery = lazy(() => import("@/pages/GameAssetsGallery"));
const KnowledgeLibrary = lazy(() => import("@/pages/KnowledgeLibrary"));
const ResearchAnalyticsDashboard = lazy(() => import("@/pages/ResearchAnalyticsDashboard"));
const ConfigExplorer = lazy(() => import("@/pages/ConfigExplorer"));
const PlanetDetail = lazy(() => import("@/pages/PlanetDetail"));
const PlanetCommand = lazy(() => import("@/pages/PlanetCommand"));
const PlanetaryOccupation = lazy(() => import("@/pages/PlanetaryOccupation"));
const OgameCompendium = lazy(() => import("@/pages/OgameCompendium"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const ThreeDViewerPortal = lazy(() => import("@/pages/ThreeDViewerPortal"));
const DatabaseAdmin = lazy(() => import("@/pages/DatabaseAdmin"));
const PowerGrid = lazy(() => import("@/pages/PowerGrid"));
const OrbitalDefense = lazy(() => import("@/pages/OrbitalDefense"));
const EmpireProfile = lazy(() => import("@/pages/EmpireProfile"));
const DimensionalAnomalies = lazy(() => import("@/pages/DimensionalAnomalies"));
const ResourceRefineries = lazy(() => import("@/pages/ResourceRefineries"));
const CronDashboard = lazy(() => import("@/pages/CronDashboard"));
const BlueprintCharges = lazy(() => import("@/pages/BlueprintCharges"));
const HighCommand = lazy(() => import("@/pages/HighCommand"));
const Smithy = lazy(() => import("@/pages/Smithy"));
const BankVault = lazy(() => import("@/pages/BankVault"));
const ConnectProvider = lazy(() => import("@/pages/ConnectProvider"));
const UniverseScan = lazy(() => import("@/pages/UniverseScan"));
const PlanetVault = lazy(() => import("@/pages/PlanetVault"));
const MoonsPage = lazy(() => import("@/pages/MoonsPage"));
const SporeDrive = lazy(() => import("@/pages/SporeDrive"));
const ResourceTradingPage = lazy(() => import("@/pages/ResourceTradingPage"));
const UnitTaxonomyPage = lazy(() => import("@/pages/UnitTaxonomyPage"));
const UnitSystemsPage = lazy(() => import("@/pages/UnitSystemsPage"));
const GovernmentBuildingsPage = lazy(() => import("@/pages/GovernmentBuildingsPage"));
const GovernmentProgressionPage = lazy(() => import("@/pages/GovernmentProgressionPage"));
const DimensionalContracts = lazy(() => import("@/pages/DimensionalContracts"));
const AbyssalGates = lazy(() => import("@/pages/AbyssalGates"));
const PowerLevelPage = lazy(() => import("@/pages/PowerLevelPage"));
const ItemLevels = lazy(() => import("@/pages/ItemLevels"));
const SaveSlotsPage = lazy(() => import("@/pages/SaveSlotsPage"));
const RealmPickerPage = lazy(() => import("@/pages/RealmPickerPage"));
const PatchNotes = lazy(() => import("@/pages/PatchNotes"));
const NewsFeed = lazy(() => import("@/pages/NewsFeed"));
const SeasonHub = lazy(() => import("@/pages/SeasonHub"));
const Diplomacy = lazy(() => import("@/pages/Diplomacy"));
const SeasonServerPicker = lazy(() => import("@/pages/SeasonServerPicker"));
const Account = lazy(() => import("@/pages/Account"));
const RealmsPage = lazy(() => import("@/pages/RealmsPage"));

function LoadingSplash() {
  const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    key: i,
    width: (i * 7 + 3) % 3 + 1,
    height: (i * 11 + 5) % 3 + 1,
    top: (i * 37 + 13) % 100,
    left: (i * 53 + 29) % 100,
    opacity: ((i * 17 + 7) % 50) / 100 + 0.1,
    duration: (i * 23 + 11) % 3000 + 2000,
    delay: (i * 31 + 19) % 3000,
  })), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.key}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animation: `pulse ${star.duration}ms ease-in-out infinite`,
              animationDelay: `${star.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* Nebula glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <GameLogo size="xl" animated showText />

        <div className="mt-8 w-48 h-1 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full animate-pulse" style={{ width: "70%" }} />
        </div>

        <p className="text-slate-400 font-rajdhani text-xs tracking-[0.2em] uppercase mt-3 animate-pulse">
          Initializing Command Systems
        </p>
      </div>

      <div className="absolute bottom-6 text-slate-500 text-xs font-mono flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Alpha <span className="text-blue-400">1.5.0</span> — Live Preview</span>
      </div>
    </div>
  );
}

function RouterContent() {
  const { isLoggedIn, needsSetup, isLoading, onboardingStep } = useGame();
  const [showSplash, setShowSplash] = useState(true);
  const [hasError, setHasError] = useState(false);
  const loadingStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (loadingStartedAtRef.current === null) {
        loadingStartedAtRef.current = Date.now();
      }
      setShowSplash(true);
      setHasError(false);
      return;
    }

    if (loadingStartedAtRef.current === null) {
      setShowSplash(false);
      return;
    }

    const elapsed = Date.now() - loadingStartedAtRef.current;
    const minSplashMs = 350;
    const maxSplashMs = 5000; // Force hide after 5 seconds

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

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (!isLoading) return;
    
    const safetyTimeout = setTimeout(() => {
      console.warn('[App] Loading timeout reached, forcing render');
      setShowSplash(false);
      loadingStartedAtRef.current = null;
    }, 5000);

    return () => clearTimeout(safetyTimeout);
  }, [isLoading]);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-500 mb-4">Error Loading Game</h1>
          <p className="text-slate-400">Please refresh the page or check the console for errors.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || showSplash) {
    return <LoadingSplash />;
  }

  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/database" component={DatabaseAdmin} />
        <Route path="/about" component={About} />
        <Route path="/forums" component={Forums} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/realms" component={RealmsPage} />
        <Route component={Auth} />
      </Switch>
    );
  }

  if (needsSetup) {
    if (onboardingStep === 0) {
      return (
        <Switch>
          <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/database" component={DatabaseAdmin} />
          <Route path="/about" component={About} />
          <Route path="/forums" component={Forums} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/realms" component={RealmsPage} />
          <Route component={RealmPickerPage} />
        </Switch>
      );
    }

    if (onboardingStep === 1) {
      return (
        <Switch>
          <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/database" component={DatabaseAdmin} />
          <Route path="/about" component={About} />
          <Route path="/forums" component={Forums} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/realms" component={RealmsPage} />
          <Route component={SeasonServerPicker} />
        </Switch>
      );
    }

    if (onboardingStep === 2) {
      return (
        <Switch>
          <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/database" component={DatabaseAdmin} />
          <Route path="/about" component={About} />
          <Route path="/forums" component={Forums} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/realms" component={RealmsPage} />
          <Route component={SaveSlotsPage} />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/threejs-viewer" component={ThreeDViewerPortal} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/database" component={DatabaseAdmin} />
        <Route path="/about" component={About} />
        <Route path="/forums" component={Forums} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/realms" component={RealmsPage} />
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
      <Route path="/realms" component={RealmsPage} />
      <Route path="/resources" component={Resources} />
      <Route path="/power-grid" component={PowerGrid} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/research" component={Research} />
      <Route path="/skills" component={Skills} />
      <Route path="/fitting" component={Fitting} />
      <Route path="/artifacts" component={Artifacts} />
      <Route path="/shipyard" component={Shipyard} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/fleet-yard" component={FleetYard} />
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
      <Route path="/blueprint-lithograph" component={BlueprintLithograph} />
      <Route path="/megastructures" component={MegaStructures} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/weekly-missions" component={WeeklyMissions} />
      <Route path="/factions" component={Factions} />
      <Route path="/empire-progression" component={EmpireProgression} />
      <Route path="/warp-network" component={WarpNetwork} />
      <Route path="/stations" component={Stations} />
      <Route path="/starbases" component={Starbases} />
      <Route path="/merchants" component={Merchants} />
      <Route path="/storefront" component={Storefront} />
      <Route path="/celestial-browser" component={CelestialBrowser} />
      <Route path="/biome-codex" component={BiomeCodex} />
      <Route path="/biome/:id" component={BiomeDetail} />
      <Route path="/diagnostics" component={Diagnostics} />
      <Route path="/story-mode" component={StoryMode} />
      <Route path="/preludes" component={Preludes} />
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
      <Route path="/empire-profile" component={EmpireProfile} />
      <Route path="/account" component={Account} />
      <Route path="/dimensional-anomalies" component={DimensionalAnomalies} />
      <Route path="/dimensional-contracts" component={DimensionalContracts} />
      <Route path="/abyssal-gates" component={AbyssalGates} />
      <Route path="/power-level" component={PowerLevelPage} />
      <Route path="/item-levels" component={ItemLevels} />
      <Route path="/resource-refineries" component={ResourceRefineries} />
      <Route path="/cron-dashboard" component={CronDashboard} />
      <Route path="/blueprint-charges" component={BlueprintCharges} />
      <Route path="/high-command" component={HighCommand} />
      <Route path="/smithy" component={Smithy} />
      <Route path="/bank-vault" component={BankVault} />
      <Route path="/connect" component={ConnectProvider} />
      <Route path="/universe-scan" component={UniverseScan} />
      <Route path="/planet-vault" component={PlanetVault} />
      <Route path="/moons" component={MoonsPage} />
      <Route path="/spore-drive" component={SporeDrive} />
      <Route path="/resource-trading" component={ResourceTradingPage} />
      <Route path="/unit-taxonomy" component={UnitTaxonomyPage} />
      <Route path="/unit-systems" component={UnitSystemsPage} />
      <Route path="/government-buildings" component={GovernmentBuildingsPage} />
      <Route path="/government-progression" component={GovernmentProgressionPage} />
      <Route path="/planet/:id" component={PlanetDetail} />
      <Route path="/planet-command" component={PlanetCommand} />
      <Route path="/planet-occupation" component={PlanetaryOccupation} />
      <Route path="/research-lab" component={ResearchLab} />
      <Route path="/knowledge-library" component={KnowledgeLibrary} />
      <Route path="/research-analytics" component={ResearchAnalyticsDashboard} />
      <Route path="/config-explorer" component={ConfigExplorer} />
      <Route path="/ogame-compendium" component={OgameCompendium} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/assets-gallery" component={GameAssetsGallery} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/database" component={DatabaseAdmin} />
      <Route path="/server-console" component={ServerConsole} />
      <Route path="/patch-notes" component={PatchNotes} />
      <Route path="/news-feed" component={NewsFeed} />
      <Route path="/season" component={SeasonHub} />
      <Route path="/season/:tab" component={SeasonHub} />
      <Route path="/diplomacy" component={Diplomacy} />
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
        <XpNotifications />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
