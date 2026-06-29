import { Link, useLocation } from "wouter";
import { useGame } from "@/lib/gameContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { OGAMEX_FEATURED_ASSETS, PLANET_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { SceneLayer, resolveShellScenePreset } from "@/components/views3d";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  type LucideIcon,
  LayoutDashboard, 
  Pickaxe, 
  Factory, 
  FlaskConical, 
  FlaskRound,
  Rocket, 
  Send, 
  Globe, 
  Settings,
  Zap,
  Database,
  Box,
  Gem,
  User,
  UserCog,
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
  BookOpen,
  Trophy,
  Wheat,
  Crown,
  Satellite,
  Search,
  ScrollText,
  Network,
  AlertTriangle,
  Image,
  Award,
  Store,
  TowerControl,
  Menu,
  MonitorSmartphone,
  Hammer,
  Terminal,
  Newspaper,
  Download,
  ClipboardList,
  CheckCircle2,
  X,
  Eye,
  Briefcase,
  BarChart3,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  activePaths?: string[];
  activePrefixes?: string[];
}

interface NavGroup {
  title: string;
  description?: string;
  items: NavItem[];
}

interface MenuSection {
  title: string;
  icon: LucideIcon;
  description?: string;
  groups: NavGroup[];
}

interface ActivePageContext {
  section: string;
  sectionIcon: LucideIcon;
  sectionDescription?: string;
  group: string;
  groupDescription?: string;
  item: NavItem;
  siblings: NavItem[];
}

interface CommandTile extends NavItem {
  kicker: string;
  assetPath: string;
}

interface PageAction {
  label: string;
  href?: string;
  icon: LucideIcon;
  helper: string;
  onClick?: () => void;
}

interface DetailCard {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  toneClass: string;
}

interface InfrastructureDetail {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  toneClass: string;
}

interface LayoutPlayerOptions {
  display?: {
    darkMode?: boolean;
    themePreset?: "black-style" | "og-white" | "imperial-gold";
    compactView?: boolean;
    showAnimations?: boolean;
    showResourceRates?: boolean;
    deviceProfile?: string;
    mobileOptimized?: boolean;
    touchControls?: boolean;
    touchTargetSize?: string;
    browserWidth?: string;
    stickyMobileBars?: boolean;
  };
}

interface UpdateManifestSummary {
  version: string;
  releaseDate?: string;
  changelog?: string[];
  critical?: boolean;
}

interface UpdateCheckSummary {
  available: boolean;
  version?: string;
  manifest?: UpdateManifestSummary;
}

const isNavItemActive = (item: NavItem, location: string) => {
  if (location === item.href) {
    return true;
  }

  if (item.activePaths?.includes(location)) {
    return true;
  }

  return item.activePrefixes?.some((prefix) => location.startsWith(prefix)) ?? false;
};

const getSectionHref = (groups: NavGroup[]) => groups[0]?.items[0]?.href || "/";

const getGroupHref = (group: NavGroup) => group.items[0]?.href || "/";

const SidebarItem = ({
  href,
  icon: Icon,
  label,
  active,
  className,
  indentLevel = 1,
  onSelect,
  touchMode = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  className?: string;
  indentLevel?: 1 | 2;
  onSelect?: () => void;
  touchMode?: boolean;
}) => (
  <Link href={href} data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className={cn(
      "sd-sidebar-item flex items-center gap-3 cursor-pointer transition-all duration-200 border-l-2 touch-manipulation",
      indentLevel === 2 ? "px-7 py-1.5 text-[11px]" : "px-5 py-2 text-[11px]",
      touchMode && (indentLevel === 2 ? "min-h-[46px]" : "min-h-[50px]"),
      active 
        ? "sd-sidebar-item--active bg-primary/10 border-primary text-primary font-bold" 
        : "border-transparent hover:bg-slate-200 hover:text-primary hover:border-primary/50 text-muted-foreground",
      className
    )} onClick={onSelect}>
      <Icon className="w-4 h-4" />
      <span className="font-rajdhani font-semibold tracking-wider uppercase text-xs">{label}</span>
    </div>
  </Link>
);

const CollapsibleMenu = ({
  title,
  icon: Icon,
  groups,
  location,
  defaultOpen = false,
  onSelect,
  touchMode = false,
}: {
  title: string;
  icon: LucideIcon;
  groups: NavGroup[];
  location: string;
  defaultOpen?: boolean;
  onSelect?: () => void;
  touchMode?: boolean;
}) => {
  const hasActiveChild = groups.some((group) => group.items.some((item) => isNavItemActive(item, location)));
  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);
  const sectionHref = getSectionHref(groups);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  return (
    <div className="mb-1">
      <div
        className={cn(
          "sd-sidebar-section flex items-stretch border-l-2 transition-all duration-200",
          hasActiveChild
            ? "sd-sidebar-section--active bg-primary/5 border-primary/50 text-primary"
            : "border-transparent text-muted-foreground hover:text-slate-700"
        )}
      >
        <Link href={sectionHref} data-testid={`link-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <div
            className={cn(
              "sd-sidebar-section-link flex flex-1 items-center gap-3 px-4 py-2 cursor-pointer touch-manipulation transition-colors duration-200",
              touchMode && "min-h-[50px]",
              hasActiveChild ? "text-primary" : "hover:bg-slate-100"
            )}
            onClick={() => {
              setIsOpen(true);
              onSelect?.();
            }}
          >
            <Icon className="w-5 h-5" />
            <span className="font-rajdhani font-semibold tracking-wider uppercase text-sm">{title}</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`button-menu-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className={cn(
            "sd-sidebar-toggle flex w-12 items-center justify-center border-l border-slate-200/70 transition-colors duration-200",
            touchMode && "min-h-[50px]",
            hasActiveChild ? "bg-primary/5 text-primary" : "hover:bg-slate-100 text-slate-500"
          )}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-slate-50/50">
          {groups.map((group) => (
            <div key={group.title} className="py-1">
              <Link href={getGroupHref(group)} data-testid={`link-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div
                  className="sd-sidebar-group-link px-6 py-2 text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase cursor-pointer transition-colors duration-200 hover:bg-white/70 hover:text-primary"
                  onClick={onSelect}
                >
                  {group.title}
                </div>
              </Link>
              {group.items.map((item) => (
                <SidebarItem 
                  key={item.href}
                  href={item.href} 
                  icon={item.icon} 
                  label={item.label} 
                  active={isNavItemActive(item, location)}
                  indentLevel={2}
                  onSelect={onSelect}
                  touchMode={touchMode}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const menuSections: MenuSection[] = [
  {
    title: "Empire",
    icon: Building2,
    description: "Manage planets, colonies, infrastructure, and civilization growth.",
    groups: [
      {
        title: "Command",
        description: "Core empire oversight and planetary command tools.",
        items: [
          { href: "/empire-command-center", icon: Crown, label: "Command Center", description: "Review empire status, strategic alerts, and central command tools." },
          { href: "/empire-view", icon: LayoutDashboard, label: "Empire View", description: "See your empire at a glance across worlds and systems." },
          { href: "/empire-planets", icon: Globe, label: "Empire Planets", description: "Browse controlled planets and inspect planet detail pages.", activePrefixes: ["/planet/"] },
          { href: "/planet-command", icon: Rocket, label: "Planet Command", description: "Issue direct orders for planetary production and control." },
        ],
      },
      {
        title: "Infrastructure",
        description: "Expand production chains and build out planetary capacity.",
        items: [
          { href: "/resources", icon: Pickaxe, label: "Resources", description: "Track and improve metal, crystal, energy, and strategic reserves." },
          { href: "/power-grid", icon: Network, label: "Stellar Power Grid", description: "Generate, transmit, store, and autonomously route power across worlds and resource fields." },
          { href: "/facilities", icon: Factory, label: "Facilities", description: "Construct and upgrade industrial, research, and support facilities." },
          { href: "/colonies", icon: Home, label: "Colonies", description: "Manage colonization targets, colony slots, and expansion plans." },
          { href: "/population", icon: Users, label: "Population", description: "Manage population demographics, citizen class assignment, and growth." },
          { href: "/stations", icon: Satellite, label: "Stations", description: "Control orbital stations, outposts, and support platforms." },
          { href: "/megastructures", icon: CircleDot, label: "Megastructures", description: "Develop late-game empire-scale construction projects." },
        ],
      },
      {
        title: "Civilization",
        description: "Shape society progression and large-scale empire milestones.",
        items: [
          { href: "/civilization-systems", icon: Users, label: "Civilization Systems", description: "Review your civilization systems, bonuses, and societal traits." },
          { href: "/civilization-management", icon: Building2, label: "Civilization Mgmt", description: "Adjust policies and manage civilization-wide development." },
          { href: "/empire-progression", icon: Award, label: "Kardashev Scale", description: "Track empire advancement through long-term progression tiers." },
        ],
      },
    ],
  },
  {
    title: "Research",
    icon: FlaskConical,
    description: "Unlock technologies, manage labs, and catalog discoveries.",
    groups: [
      {
        title: "Labs",
        description: "Operate research centers and queue scientific projects.",
        items: [
          { href: "/research", icon: FlaskConical, label: "Research Hub", description: "View current research priorities and laboratory output." },
          { href: "/skills", icon: BookOpen, label: "Skills Training", description: "Train character skills for improved performance." },
          { href: "/research-lab", icon: Zap, label: "Research Management", description: "Allocate research capacity and manage active development." },
          { href: "/research-analytics", icon: ScrollText, label: "Research Analytics", description: "Track discovery streaks, tier spread, and science performance." },
        ],
      },
      {
        title: "Tech Trees",
        description: "Navigate structured technology paths and reference systems.",
        items: [
          { href: "/technology-tree", icon: GraduationCap, label: "Technology Tree", description: "Browse upgrade dependencies and long-term tech routes." },
          { href: "/tech-tree", icon: FlaskConical, label: "Tech Tree Legacy", description: "Open the alternate tech tree route and keep the legacy page linked into navigation." },
          { href: "/ogame-compendium", icon: Database, label: "OGame Compendium", description: "Reference structured technology, economy, and combat data." },
        ],
      },
      {
        title: "Discoveries",
        description: "Catalog rare finds, advanced designs, and recovered relics.",
        items: [
          { href: "/blueprints", icon: FileText, label: "Blueprints", description: "Review unlocked designs and production-ready schematics." },
          { href: "/artifacts", icon: Hexagon, label: "Artifacts", description: "Inspect rare artifacts that modify empire capabilities." },
          { href: "/relics", icon: Gem, label: "Relics", description: "Manage relic bonuses and rare discovery effects." },
          { href: "/knowledge-library", icon: BookOpen, label: "Knowledge Library", description: "Study mastery tracks, class tiers, and cross-discipline synergies." },
        ],
      },
    ],
  },
  {
    title: "Military",
    icon: Swords,
    description: "Command fleets, armies, expeditions, and combat operations.",
    groups: [
      {
        title: "Forces",
        description: "Build and organize space and ground units.",
        items: [
          { href: "/shipyard", icon: Rocket, label: "Shipyard", description: "Construct ships and prepare new fleets for deployment." },
          { href: "/fitting", icon: Settings, label: "Ship Fitting", description: "Customize ship modules, weapons, and equipment." },
          { href: "/fleet", icon: Send, label: "Fleet Command", description: "Dispatch fleets, track missions, and manage formations." },
          { href: "/orbital-defense", icon: Satellite, label: "Orbital Defense", description: "Build and command offensive satellites, shield platforms, carriers, and orbital fortresses." },
          { href: "/army", icon: Users, label: "Army", description: "Review land units, formations, and force composition." },
          { href: "/army-management", icon: Swords, label: "Army Management", description: "Train, equip, and reorganize planetary armies." },
          { href: "/training-center", icon: GraduationCap, label: "Training Center", description: "Unlock training tracks, staff academies, and manage force capacity." },
        ],
      },
      {
        title: "Operations",
        description: "Run missions, battles, espionage, and after-action reviews.",
        items: [
          { href: "/expeditions", icon: Compass, label: "Expeditions", description: "Launch deep-space missions for risk, reward, and discovery." },
          { href: "/missions", icon: Briefcase, label: "Missions", description: "Dispatch fleets on strategic missions across the galaxy." },
          { href: "/espionage", icon: Eye, label: "Espionage", description: "Gather intelligence and conduct covert operations." },
          { href: "/combat", icon: ShieldAlert, label: "Combat Center", description: "Engage combat systems and active battle mechanics." },
          { href: "/ground-combat", icon: Swords, label: "Ground Combat", description: "Assemble invasion troops, shock units, and special ops detachments." },
          { href: "/planet-occupation", icon: TowerControl, label: "Planet Occupation", description: "Control captured worlds through garrisons, suppression, extraction, and fortifications." },
          { href: "/battle-logs", icon: ScrollText, label: "Battle Logs", description: "Review previous engagements and combat outcomes." },
        ],
      },
      {
        title: "Raids",
        description: "Coordinate raid loops, target discovery, and boss encounters.",
        items: [
          { href: "/raids", icon: Swords, label: "Raid Operations", description: "Coordinate raid entry points and active raid campaigns." },
          { href: "/raid-finder", icon: Search, label: "Raid Finder", description: "Search for available raids and suitable objectives." },
          { href: "/raid-bosses", icon: Crown, label: "Raid Bosses", description: "Track elite raid bosses and encounter preparation." },
        ],
      },
    ],
  },
  {
    title: "Exploration",
    icon: Map,
    description: "Survey space, navigate networks, and discover new worlds.",
    groups: [
      {
        title: "Maps",
        description: "Navigate local, galactic, and generated universe views.",
        items: [
          { href: "/interstellar", icon: Sparkles, label: "Interstellar", description: "Explore broader interstellar travel and system links." },
          { href: "/galaxy", icon: Globe, label: "Galaxy Map", description: "Browse sector positions, neighbors, and route planning." },
          { href: "/universe", icon: Orbit, label: "Universe View", description: "Inspect the full universe and long-range spatial context." },
          { href: "/universe-generator", icon: RefreshCw, label: "Universe Generator", description: "Generate and inspect procedural universe structures." },
        ],
      },
      {
        title: "Discovery",
        description: "Search celestial bodies, biomes, and transit systems.",
        items: [
          { href: "/exploration", icon: Compass, label: "Exploration", description: "Run exploration loops and reveal frontier opportunities." },
          { href: "/warp-network", icon: Network, label: "Warp Network", description: "Manage travel corridors and inter-system movement." },
          { href: "/celestial-browser", icon: CircleDot, label: "Celestial Browser", description: "Inspect stars, planets, and other celestial objects." },
          { href: "/biome-codex", icon: BookOpen, label: "Biome Codex", description: "Study biome entries and their detailed environmental data.", activePrefixes: ["/biome/"] },
          { href: "/hazards", icon: AlertTriangle, label: "Hazard Assessment", description: "Evaluate planetary hazards, risks, and environmental conditions." },
        ],
      },
      {
        title: "Events",
        description: "Respond to live universe activity and dynamic world events.",
        items: [
          { href: "/universe-events", icon: AlertTriangle, label: "Universe Events", description: "Review active world events and their empire-wide impact." },
        ],
      },
      {
        title: "Dimensional",
        description: "Navigate dimensional content, rifts, gates, contracts, and trials.",
        items: [
          { href: "/dimensional-hub", icon: Orbit, label: "Dimensional Hub", description: "Rifts, gates, contracts and dimensional power." },
          { href: "/trials", icon: Swords, label: "Trials", description: "Wave-based combat challenges and leaderboards." },
        ],
      },
    ],
  },
  {
    title: "Diplomacy",
    icon: Shield,
    description: "Lead your people, manage alliances, and build social networks.",
    groups: [
      {
        title: "Leadership",
        description: "Manage identity, power structures, and ranking systems.",
        items: [
          { href: "/diplomacy", icon: Shield, label: "Diplomacy", description: "Manage relations, treaties, embassies, and diplomatic history." },
          { href: "/commander", icon: User, label: "Commander", description: "Customize commander identity, stats, and personal progression." },
          { href: "/officers", icon: UserCog, label: "Officers", description: "Recruit and manage officer corps for empire-wide bonuses." },
          { href: "/lifeforms", icon: FlaskRound, label: "Lifeforms", description: "Select and manage your empire's lifeform species." },
          { href: "/government", icon: Landmark, label: "Government", description: "Review state structure, laws, and governing bonuses." },
          { href: "/factions", icon: Users, label: "Factions", description: "Navigate faction relations and influence networks." },
          { href: "/leaderboard", icon: Trophy, label: "Leaderboard", description: "Compare empire performance against other players." },
        ],
      },
      {
        title: "Alliances",
        description: "Coordinate communication, guilds, and allied diplomacy.",
        items: [
          { href: "/alliance", icon: Shield, label: "Alliance", description: "Manage alliance structure, members, and cooperative play." },
          { href: "/guilds", icon: Crown, label: "Guilds", description: "Organize guild participation and long-term group identity." },
          { href: "/friends", icon: Users, label: "Friends", description: "Track friends, contacts, and cooperative player lists." },
          { href: "/messages", icon: Mail, label: "Messages", description: "Read diplomatic, social, and operational communications." },
        ],
      },
    ],
  },
  {
    title: "Economy",
    icon: ShoppingBag,
    description: "Trade resources, pursue rewards, and progress through game modes.",
    groups: [
      {
        title: "Trade",
        description: "Buy, sell, and browse goods across the empire economy.",
        items: [
          { href: "/market", icon: ShoppingBag, label: "Market", description: "Trade raw materials, strategic goods, and market offers." },
          { href: "/commerce", icon: BarChart3, label: "Commerce Hub", description: "Full trading interface with market prices and order management." },
          { href: "/merchants", icon: User, label: "Merchants", description: "Work with merchant NPCs and their specialized inventories." },
          { href: "/storefront", icon: Store, label: "Storefront", description: "Browse premium or featured storefront offerings." },
        ],
      },
      {
        title: "Progression",
        description: "Advance through achievements, passes, and narrative content.",
        items: [
          { href: "/achievements", icon: Trophy, label: "Achievements", description: "Track unlocks, milestones, and earned achievement rewards." },
          { href: "/season-pass", icon: Award, label: "Season Pass", description: "Review seasonal objectives and time-limited progression rewards." },
          { href: "/battle-pass", icon: Swords, label: "Battle Pass", description: "Advance combat-focused progression tracks and rewards." },
          { href: "/story-mode", icon: BookOpen, label: "Story Mode", description: "Play through narrative content and guided mission arcs." },
        ],
      },
    ],
  },
];

const systemItems: NavItem[] = [
  { href: "/diagnostics", icon: AlertTriangle, label: "Diagnostics", description: "Inspect client, server, and gameplay diagnostic tools." },
  { href: "/assets-gallery", icon: Image, label: "Assets Gallery", description: "Browse game assets, including the new OGameX asset pack." },
  { href: "/settings", icon: Settings, label: "Settings", description: "Update configuration, preferences, and account options." },
  { href: "/forums", icon: ScrollText, label: "Forums", description: "Open community discussions and support channels." },
  { href: "/about", icon: BookOpen, label: "About", description: "Read project background and game overview information." },
  { href: "/terms", icon: FileText, label: "Terms", description: "Review the game terms of service and usage rules." },
  { href: "/privacy", icon: Shield, label: "Privacy", description: "Review privacy details and data handling policies." },
];

const adminItems: NavItem[] = [
  { href: "/admin", icon: ShieldAlert, label: "Control Panel", description: "Use administrative controls for game and player management." },
  { href: "/admin/database", icon: Database, label: "Database Admin", description: "Browse tables, execute SQL, and manage the PostgreSQL database.", activePrefixes: ["/admin/database"] },
  { href: "/server-console", icon: Terminal, label: "Server Console", description: "Review live server console tools and operational controls." },
];

const getCommandTiles = (context: ActivePageContext | null): CommandTile[] => {
  switch (context?.section) {
    case "Empire":
      return [
        { href: "/empire-planets", icon: Globe, label: "Planet Grid", description: "Jump across core worlds, colonies, and moons from one empire map.", kicker: "Worlds", assetPath: PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path },
        { href: "/resources", icon: Pickaxe, label: "Resource Control", description: "Tune raw extraction, storage balance, and supply throughput.", kicker: "Economy", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/facilities", icon: Factory, label: "Facility Queue", description: "Push building upgrades, production chains, and support structures.", kicker: "Build", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/stations", icon: Satellite, label: "Orbital Layer", description: "Coordinate stations, support rings, and orbital logistics.", kicker: "Orbit", assetPath: OGAMEX_FEATURED_ASSETS.MOON.path },
      ];
    case "Research":
      return [
        { href: "/research-analytics", icon: ScrollText, label: "Analytics", description: "Review live research trends, level pace, and completion spread.", kicker: "Insight", assetPath: OGAMEX_FEATURED_ASSETS.RESEARCH.path },
        { href: "/knowledge-library", icon: BookOpen, label: "Library", description: "Open doctrine, knowledge classes, and synergy references.", kicker: "Archive", assetPath: OGAMEX_FEATURED_ASSETS.RESEARCH.path },
        { href: "/blueprints", icon: FileText, label: "Blueprint Vault", description: "Browse designs, schematics, and unlockable technical plans.", kicker: "Designs", assetPath: OGAMEX_FEATURED_ASSETS.SHIPS.path },
        { href: "/assets-gallery", icon: Image, label: "Science Assets", description: "View linked PNGs, panel art, and source asset references.", kicker: "Assets", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
      ];
    case "Military":
      return [
        { href: "/fleet", icon: Send, label: "Fleet Orders", description: "Dispatch missions, monitor arrivals, and keep combat groups active.", kicker: "Command", assetPath: OGAMEX_FEATURED_ASSETS.SHIPS.path },
        { href: "/combat", icon: ShieldAlert, label: "Combat Center", description: "Launch raids, attacks, and tactical battle actions.", kicker: "Battle", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/battle-logs", icon: ScrollText, label: "Action Reports", description: "Inspect logs, after-action reports, and battle summaries.", kicker: "Reports", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/planet-occupation", icon: TowerControl, label: "Occupation Ops", description: "Control captured planets, garrisons, and extraction pressure.", kicker: "Control", assetPath: OGAMEX_FEATURED_ASSETS.MOON.path },
      ];
    case "Exploration":
      return [
        { href: "/galaxy", icon: Globe, label: "Galaxy Sweep", description: "Survey sectors, systems, and route pressure across nearby space.", kicker: "Scan", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/universe", icon: Orbit, label: "Universe Lens", description: "Switch to the larger multi-universe command view.", kicker: "Macro", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/warp-network", icon: Network, label: "Warp Corridors", description: "Plot stargates, hyperspace lanes, and warp relays.", kicker: "Transit", assetPath: OGAMEX_FEATURED_ASSETS.SHIPS.path },
        { href: "/celestial-browser", icon: Search, label: "Celestial Index", description: "Browse stars, planets, moons, and interstellar objects.", kicker: "Catalog", assetPath: OGAMEX_FEATURED_ASSETS.MOON.path },
      ];
    case "Diplomacy":
      return [
        { href: "/diplomacy", icon: Shield, label: "Diplomacy Center", description: "Direct diplomacy hub for treaties, relations, and negotiations.", kicker: "Treaties", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/alliance", icon: Shield, label: "Alliance Command", description: "Coordinate guilds, members, pacts, and alliance strategy.", kicker: "Allies", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/messages", icon: Mail, label: "Message Relay", description: "Review diplomacy traffic, reports, and system mail.", kicker: "Comms", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/leaderboard", icon: Trophy, label: "Rankings", description: "Compare empire power, prestige, and commander standings.", kicker: "Ranks", assetPath: OGAMEX_FEATURED_ASSETS.RESEARCH.path },
        { href: "/friends", icon: Users, label: "Contacts", description: "Manage friends, trusted pilots, and cooperative partners.", kicker: "Network", assetPath: PLANET_ASSETS.TERRESTRIAL.JUNGLE.path },
      ];
    case "Economy":
      return [
        { href: "/market", icon: ShoppingBag, label: "Market Grid", description: "Trade resources, parts, and strategic commodities.", kicker: "Trade", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/storefront", icon: Store, label: "Storefront", description: "Browse premium goods, packs, and featured offers.", kicker: "Store", assetPath: OGAMEX_FEATURED_ASSETS.SHIPS.path },
        { href: "/season-pass", icon: Award, label: "Season Track", description: "Push time-limited objectives, rewards, and progression goals.", kicker: "Pass", assetPath: OGAMEX_FEATURED_ASSETS.RESEARCH.path },
        { href: "/achievements", icon: Trophy, label: "Milestones", description: "Track long-term progression achievements and reward claims.", kicker: "Goals", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
      ];
    default:
      return [
        { href: "/settings", icon: Settings, label: "Settings", description: "Adjust browser width, mobile support, touch controls, and display options.", kicker: "Options", assetPath: OGAMEX_FEATURED_ASSETS.BACKGROUND.path },
        { href: "/assets-gallery", icon: Image, label: "Assets Gallery", description: "Open linked OGameX-derived PNG, sprite, and panel asset pages.", kicker: "Assets", assetPath: OGAMEX_FEATURED_ASSETS.SHIPS.path },
        { href: "/diagnostics", icon: AlertTriangle, label: "Diagnostics", description: "Check client and gameplay systems for current issues.", kicker: "Status", assetPath: OGAMEX_FEATURED_ASSETS.DEFENSE.path },
        { href: "/about", icon: BookOpen, label: "Game Docs", description: "Read the current project overview, systems, and support pages.", kicker: "Docs", assetPath: OGAMEX_FEATURED_ASSETS.RESEARCH.path },
      ];
  }
};

const getActivePageContext = (location: string, isAdmin: boolean): ActivePageContext | null => {
  for (const section of menuSections) {
    for (const group of section.groups) {
      const activeItem = group.items.find((item) => isNavItemActive(item, location));
      if (activeItem) {
        return {
          section: section.title,
          sectionIcon: section.icon,
          sectionDescription: section.description,
          group: group.title,
          groupDescription: group.description,
          item: activeItem,
          siblings: group.items,
        };
      }
    }
  }

  const activeSystemItem = systemItems.find((item) => isNavItemActive(item, location));
  if (activeSystemItem) {
    return {
      section: "System",
      sectionIcon: Settings,
      sectionDescription: "Configure the client, inspect tools, and access support utilities.",
      group: "Operations",
      groupDescription: "System-level tools and settings.",
      item: activeSystemItem,
      siblings: systemItems,
    };
  }

  if (isAdmin) {
    const activeAdminItem = adminItems.find((item) => isNavItemActive(item, location));
    if (activeAdminItem) {
      return {
        section: "Administration",
        sectionIcon: ShieldAlert,
        sectionDescription: "High-privilege controls for monitoring and operating the game.",
        group: "Control",
        groupDescription: "Administrative pages and server operations.",
        item: activeAdminItem,
        siblings: adminItems,
      };
    }
  }

  return null;
};

const getPageInfrastructure = (context: ActivePageContext): InfrastructureDetail[] => {
  const sectionInfrastructure: Record<string, Omit<InfrastructureDetail, "label">[]> = {
    Empire: [
      { value: "Production → Storage → Expansion", helper: "Resource flow that supports colonies, facilities, and empire growth.", icon: Factory, toneClass: "text-blue-700" },
      { value: "Planet • Moon • Station", helper: "Command layers connected to the active base selector.", icon: Globe, toneClass: "text-cyan-700" },
      { value: "Queues + Resources", helper: "Primary live inputs used by empire management pages.", icon: Database, toneClass: "text-amber-700" },
      { value: "Stabilize bottlenecks", helper: "Balance capacity before committing to the next expansion cycle.", icon: Zap, toneClass: "text-emerald-700" },
    ],
    Research: [
      { value: "Discovery → Research → Unlock", helper: "Technology progression from prerequisite to usable capability.", icon: FlaskConical, toneClass: "text-cyan-700" },
      { value: "Labs • Trees • Library", helper: "Research surfaces share prerequisites, analytics, and doctrine data.", icon: Network, toneClass: "text-blue-700" },
      { value: "Energy + Queue", helper: "Research throughput depends on available power and active work slots.", icon: Zap, toneClass: "text-amber-700" },
      { value: "Resolve prerequisites", helper: "Open the shortest viable unlock path before spending rare materials.", icon: GraduationCap, toneClass: "text-violet-700" },
    ],
    Military: [
      { value: "Intel → Formation → Engagement", helper: "Operational chain from target assessment through battle resolution.", icon: Swords, toneClass: "text-red-700" },
      { value: "Fleet • Army • Defense", helper: "Military pages share units, readiness, logistics, and combat reports.", icon: ShieldAlert, toneClass: "text-orange-700" },
      { value: "Fuel + Readiness", helper: "Mission availability depends on deuterium, units, and active operations.", icon: Send, toneClass: "text-amber-700" },
      { value: "Confirm return path", helper: "Protect reserves and recovery capacity before launching the next action.", icon: Shield, toneClass: "text-emerald-700" },
    ],
    Exploration: [
      { value: "Scan → Route → Discover", helper: "Exploration loop for revealing systems, objects, and strategic paths.", icon: Compass, toneClass: "text-cyan-700" },
      { value: "Galaxy • Universe • Warp", helper: "Spatial views connect local coordinates to realm-scale navigation.", icon: Orbit, toneClass: "text-blue-700" },
      { value: "Coordinates + Missions", helper: "Current location and active survey fleets drive available discoveries.", icon: Map, toneClass: "text-violet-700" },
      { value: "Secure the corridor", helper: "Evaluate travel risk and support range before extending the frontier.", icon: Network, toneClass: "text-emerald-700" },
    ],
    Diplomacy: [
      { value: "Contact → Negotiate → Coordinate", helper: "Relationship loop for alliances, messages, rankings, and groups.", icon: Users, toneClass: "text-violet-700" },
      { value: "Alliance • Mail • Social", helper: "Diplomatic pages share membership, communication, and reputation data.", icon: Mail, toneClass: "text-blue-700" },
      { value: "Standing + Reports", helper: "Unread communications and faction context shape available responses.", icon: ScrollText, toneClass: "text-amber-700" },
      { value: "Answer priority traffic", helper: "Clear actionable reports before committing political or trade resources.", icon: Shield, toneClass: "text-emerald-700" },
    ],
    Economy: [
      { value: "Produce → Trade → Reinvest", helper: "Economic loop that turns resources into sustained empire capacity.", icon: Coins, toneClass: "text-amber-700" },
      { value: "Market • Store • Rewards", helper: "Economic surfaces share balances, inventories, offers, and progression.", icon: ShoppingBag, toneClass: "text-blue-700" },
      { value: "Credits + Inventory", helper: "Purchasing power and available stock determine transaction options.", icon: Box, toneClass: "text-violet-700" },
      { value: "Preserve reserves", helper: "Keep enough liquidity for queues, upkeep, and emergency replacement.", icon: Database, toneClass: "text-emerald-700" },
    ],
    System: [
      { value: "Observe → Configure → Verify", helper: "System workflow for settings, diagnostics, tools, and support.", icon: Settings, toneClass: "text-slate-700" },
      { value: "Client • Server • Assets", helper: "Operational pages connect presentation, runtime health, and content.", icon: MonitorSmartphone, toneClass: "text-blue-700" },
      { value: "Build + Diagnostics", helper: "Version details and health signals provide the current system context.", icon: Terminal, toneClass: "text-violet-700" },
      { value: "Resolve active warnings", helper: "Address current errors before changing secondary presentation options.", icon: AlertTriangle, toneClass: "text-amber-700" },
    ],
    Administration: [
      { value: "Monitor → Authorize → Audit", helper: "Administrative workflow for controlled game and server operations.", icon: ShieldAlert, toneClass: "text-red-700" },
      { value: "Users • Data • Runtime", helper: "Admin surfaces connect permissions, persistence, and service health.", icon: Database, toneClass: "text-blue-700" },
      { value: "Role + Server State", helper: "Privileges and current runtime state govern available actions.", icon: Crown, toneClass: "text-violet-700" },
      { value: "Review before mutation", helper: "Confirm scope and impact before applying high-authority changes.", icon: ScrollText, toneClass: "text-amber-700" },
    ],
  };

  const details = sectionInfrastructure[context.section] ?? sectionInfrastructure.System;
  const labels = ["Core Workflow", "Connected Systems", "Live Inputs", "Recommended Action"];

  return details.map((detail, index) => ({
    ...detail,
    label: labels[index],
  }));
};

const ResourceDisplay = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: number, colorClass: string }) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return (
    <div className="sd-resource-chip flex shrink-0 items-center gap-2 rounded border border-slate-200 bg-white px-2.5 py-2 shadow-sm min-w-[112px] sm:min-w-[124px]" data-resource={label.toLowerCase()}>
      <div className={cn("rounded-full bg-slate-100 p-1.5", colorClass)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <span className={cn("sd-resource-value font-orbitron text-xs font-medium tabular-nums sm:text-sm", colorClass)}>
          {Math.floor(safeValue).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const TurnDisplay = ({ currentTurns, totalTurns, isLoading }: { currentTurns: number, totalTurns: number, isLoading: boolean }) => (
  <div className="sd-turn-chip flex shrink-0 items-center gap-2 rounded border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-2.5 py-2 shadow-sm min-w-[148px] sm:min-w-[164px]" data-testid="display-turns">
    <div className="rounded-full bg-indigo-100 p-1.5 text-indigo-600">
      {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">Turns</span>
      <div className="flex items-center gap-2">
        <span className="font-orbitron text-xs font-bold tabular-nums text-indigo-900 sm:text-sm">
          {currentTurns.toLocaleString()}
        </span>
        <span className="font-mono text-[9px] text-indigo-500">+6/min</span>
      </div>
    </div>
    <div className="ml-1 border-l border-indigo-200 pl-2.5">
      <span className="text-[9px] uppercase tracking-widest text-slate-400">Total</span>
      <div className="font-mono text-[11px] text-slate-600">{totalTurns.toLocaleString()}</div>
    </div>
  </div>
);

function GameSidebar({
  location,
  empireName,
  planetName,
  coordinates,
  isAdmin,
  logout,
  onNavigate,
  touchMode,
}: {
  location: string;
  empireName: string;
  planetName: string;
  coordinates: string;
  isAdmin: boolean;
  logout: () => void;
  onNavigate?: () => void;
  touchMode: boolean;
}) {
  const sidebarPlanetImage = PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  const sidebarBackdropImage = OGAMEX_FEATURED_ASSETS.BACKGROUND.path;
  const fallbackPlanetImage = "/theme-temp.png";

  return (
    <>
      <div className="sd-sidebar-console p-4">
        <div className="relative overflow-hidden rounded border border-slate-200 text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${sidebarBackdropImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-white/80 to-white/95" />
          <div className="relative p-3">
            <div className="mx-auto mb-2 h-14 w-14 overflow-hidden rounded-full border-2 border-primary bg-white shadow-sm">
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
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              {empireName || "Stellar Dominion"}
            </div>
            <h3 className="font-orbitron text-sm font-bold text-slate-900">{planetName}</h3>
            <p className="text-xs text-muted-foreground">[{coordinates}]</p>
            <div className="sd-sidebar-status-pill mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span>OGameX Assets</span>
              <span className="text-primary">Linked</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        <SidebarItem href="/" icon={LayoutDashboard} label="Overview" active={location === "/"} onSelect={onNavigate} touchMode={touchMode} />

        {menuSections.map((section) => (
          <CollapsibleMenu
            key={section.title}
            title={section.title}
            icon={section.icon}
            groups={section.groups}
            location={location}
            defaultOpen={section.title === "Empire"}
            onSelect={onNavigate}
            touchMode={touchMode}
          />
        ))}

        <div className="sd-sidebar-label px-4 mt-4 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">System</div>
        {systemItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isNavItemActive(item, location)}
            onSelect={onNavigate}
            touchMode={touchMode}
          />
        ))}

        {isAdmin && (
          <>
            <div className="sd-sidebar-admin-label px-4 mt-4 mb-2 text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Administration
            </div>
            {adminItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isNavItemActive(item, location)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onSelect={onNavigate}
                touchMode={touchMode}
              />
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition-colors text-sm font-bold uppercase tracking-wider touch-manipulation",
            touchMode && "min-h-[48px]",
          )}
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const {
    resources,
    empireName,
    planetName,
    coordinates,
    isAdmin,
    logout,
    username,
    selectedRealm,
    realmServers,
    switchRealm,
    activeBase,
    setActiveBase,
    queue,
    activeMissions,
    messages,
    alliance,
  } = useGame();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasCoarsePointer, setHasCoarsePointer] = useState(false);
  const [showPageCommandDeck, setShowPageCommandDeck] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const appVersion = import.meta.env.VITE_APP_VERSION || "Alpha 1.5.0";
  const buildId = import.meta.env.VITE_BUILD_ID || "dev";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "local";
  const activePageContext = getActivePageContext(location, isAdmin);
  const contextBackdropImage = activePageContext?.section === "Research"
    ? OGAMEX_FEATURED_ASSETS.RESEARCH.path
    : activePageContext?.section === "Military"
      ? OGAMEX_FEATURED_ASSETS.SHIPS.path
      : activePageContext?.section === "System"
        ? OGAMEX_FEATURED_ASSETS.DEFENSE.path
        : OGAMEX_FEATURED_ASSETS.BACKGROUND.path;
  const scenePreset = resolveShellScenePreset(activePageContext?.section);

  const { data: turnData, isLoading: turnsLoading } = useQuery({
    queryKey: ['/api/turns'],
    queryFn: async () => {
      const res = await fetch('/api/turns', { credentials: 'include' });
      if (!res.ok) return { currentTurns: 0, totalTurns: 0 };
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: playerOptions } = useQuery<LayoutPlayerOptions>({
    queryKey: ["player-options"],
    queryFn: async () => {
      const res = await fetch("/api/settings/player/options", { credentials: "include" });
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 30000,
  });

  const {
    data: updateInfo,
    isFetching: isCheckingUpdate,
    refetch: checkForUpdate,
  } = useQuery<UpdateCheckSummary>({
    queryKey: ["header-update-check", appVersion],
    queryFn: async () => {
      const response = await fetch(`/api/updates/check?version=${encodeURIComponent(appVersion)}&platform=web`, {
        credentials: "include",
      });
      if (!response.ok) return { available: false };
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const { data: patchManifest } = useQuery<UpdateManifestSummary | null>({
    queryKey: ["header-patch-manifest"],
    queryFn: async () => {
      const response = await fetch("/api/updates/manifest", { credentials: "include" });
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const displayedManifest = updateInfo?.manifest ?? patchManifest;
  const displayedPatchVersion = displayedManifest?.version ?? appVersion;
  const patchNotes = displayedManifest?.changelog?.length
    ? displayedManifest.changelog
    : [
        "Expanded page infrastructure and operational information design.",
        "Added shared developer, publisher, version, and build metadata.",
        "Improved account setup validation and runtime safety.",
      ];
  const updateStatusLabel = isCheckingUpdate
    ? "Checking"
    : updateInfo?.available
      ? `Update ${updateInfo.version ?? "available"}`
      : "Current";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const updatePointerState = () => {
      setHasCoarsePointer(coarsePointerQuery.matches || navigator.maxTouchPoints > 0);
    };

    updatePointerState();
    coarsePointerQuery.addEventListener("change", updatePointerState);
    return () => coarsePointerQuery.removeEventListener("change", updatePointerState);
  }, []);

  useEffect(() => {
    setShowPageCommandDeck(false);
  }, [location]);

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const displayPreferences = {
    themePreset: playerOptions?.display?.themePreset ?? "og-white",
    compactView: Boolean(playerOptions?.display?.compactView),
    showAnimations: playerOptions?.display?.showAnimations ?? true,
    showResourceRates: playerOptions?.display?.showResourceRates ?? true,
    deviceProfile: playerOptions?.display?.deviceProfile ?? "auto",
    mobileOptimized: playerOptions?.display?.mobileOptimized ?? true,
    touchControls: playerOptions?.display?.touchControls ?? true,
    touchTargetSize: playerOptions?.display?.touchTargetSize ?? "comfortable",
    browserWidth: playerOptions?.display?.browserWidth ?? "standard",
    stickyMobileBars: playerOptions?.display?.stickyMobileBars ?? true,
  };

  const touchMode = displayPreferences.touchControls && hasCoarsePointer;
  const contentWidthClass =
    displayPreferences.browserWidth === "full"
      ? "max-w-none"
      : displayPreferences.browserWidth === "wide"
        ? "max-w-[1500px]"
        : displayPreferences.browserWidth === "compact"
          ? "max-w-[1120px]"
          : "max-w-[1360px]";
  const contentPaddingClass = displayPreferences.compactView ? "p-3 sm:p-4 lg:p-5" : "p-3 sm:p-4 lg:p-6";
  const commandTiles = getCommandTiles(activePageContext);
  const pageInfrastructure = activePageContext ? getPageInfrastructure(activePageContext) : [];
  const unreadMessages = messages.filter((message) => !message.read).length;
  const sharedActions: PageAction[] =
    activePageContext?.section === "Empire"
      ? [
          { label: "Manage Resources", href: "/resources", icon: Pickaxe, helper: "Tune output, storage, and collection cycles." },
          { label: "Upgrade Facilities", href: "/facilities", icon: Factory, helper: "Build infrastructure and queue expansions." },
          { label: "Review Colonies", href: "/colonies", icon: Home, helper: "Inspect colony slots, planets, and moons." },
          { label: "Switch To Planet", icon: Globe, helper: "Focus planetary production and command controls.", onClick: () => setActiveBase("planet") },
        ]
      : activePageContext?.section === "Research"
        ? [
            { label: "Open Research Hub", href: "/research", icon: FlaskConical, helper: "Return to the main research queue and projects." },
            { label: "View Analytics", href: "/research-analytics", icon: ScrollText, helper: "Read performance, streak, and progress data." },
            { label: "Open Library", href: "/knowledge-library", icon: BookOpen, helper: "Study knowledge tracks, synergies, and classes." },
            { label: "Tech Tree Route", href: "/technology-tree", icon: GraduationCap, helper: "Jump into prerequisite planning and unlock paths." },
          ]
        : activePageContext?.section === "Military"
          ? [
              { label: "Fleet Command", href: "/fleet", icon: Send, helper: "Dispatch fleets, raids, and logistics missions." },
              { label: "Combat Center", href: "/combat", icon: ShieldAlert, helper: "Run combat actions, strikes, and battle ops." },
              { label: "Ground Combat", href: "/ground-combat", icon: Swords, helper: "Launch invasions, raids, and planetary assault formations." },
              { label: "Occupation Ops", href: "/planet-occupation", icon: TowerControl, helper: "Manage garrisons, suppression, and extraction." },
            ]
          : activePageContext?.section === "Exploration"
            ? [
                { label: "Galaxy Map", href: "/galaxy", icon: Globe, helper: "Scan nearby sectors and route pressure." },
                { label: "Universe View", href: "/universe", icon: Orbit, helper: "Inspect realm-wide and multi-universe structures." },
                { label: "Warp Routes", href: "/warp-network", icon: Network, helper: "Switch lanes, gates, and travel corridors." },
                { label: "Celestial Index", href: "/celestial-browser", icon: Search, helper: "Browse stars, moons, and planetary objects." },
                { label: "Dimensional Hub", href: "/dimensional-hub", icon: Orbit, helper: "Rifts, gates, contracts and dimensional power." },
                { label: "Trials", href: "/trials", icon: Swords, helper: "Wave-based combat challenges and leaderboards." },
              ]
            : activePageContext?.section === "Diplomacy"
              ? [
                  { label: "Diplomacy Center", href: "/diplomacy", icon: Shield, helper: "Manage treaties, relations, embassies, and pacts." },
                  { label: "Open Messages", href: "/messages", icon: Mail, helper: "Read reports, diplomacy, and system mail." },
                  { label: "Alliance Board", href: "/alliance", icon: Shield, helper: "Manage allies, members, and pacts." },
                  { label: "Ranking Feed", href: "/leaderboard", icon: Trophy, helper: "Check prestige, empire, and combat standings." },
                  { label: "Friends List", href: "/friends", icon: Users, helper: "Track trusted pilots and contacts." },
                ]
              : activePageContext?.section === "Economy"
                ? [
                    { label: "Open Market", href: "/market", icon: ShoppingBag, helper: "Trade materials, parts, and commodities." },
                    { label: "Storefront", href: "/storefront", icon: Store, helper: "Browse premium packs and featured offers." },
                    { label: "Season Track", href: "/season-pass", icon: Award, helper: "Advance timed objectives and rewards." },
                    { label: "Achievements", href: "/achievements", icon: Trophy, helper: "Review milestones and reward claims." },
                  ]
                : [
                    { label: "Open Settings", href: "/settings", icon: Settings, helper: "Adjust client options and gameplay preferences." },
                    { label: "Assets Gallery", href: "/assets-gallery", icon: Image, helper: "Review linked PNG, sprite, and page art." },
                    { label: "Diagnostics", href: "/diagnostics", icon: AlertTriangle, helper: "Inspect warnings, errors, and health signals." },
                    { label: "Switch To Station", icon: Satellite, helper: "Set station as the active command base.", onClick: () => setActiveBase("station") },
                  ];

  const detailCards: DetailCard[] =
    activePageContext?.section === "Research"
      ? [
          { label: "Active Base", value: activeBase.toUpperCase(), helper: "Current research operating frame.", icon: CircleDot, toneClass: "text-cyan-700" },
          { label: "Queue Load", value: queue.length.toString(), helper: "Construction and science jobs currently queued.", icon: Clock, toneClass: "text-blue-700" },
          { label: "Unread Reports", value: unreadMessages.toString(), helper: "Unread messages, reports, and notifications.", icon: Mail, toneClass: "text-violet-700" },
          { label: "Energy Reserve", value: resources.energy.toLocaleString(), helper: "Available energy backing current research output.", icon: Zap, toneClass: resources.energy >= 0 ? "text-amber-700" : "text-red-700" },
        ]
      : activePageContext?.section === "Military"
        ? [
            { label: "Mission Ops", value: activeMissions.length.toString(), helper: "Current fleet and tactical operations in motion.", icon: Send, toneClass: "text-red-700" },
            { label: "Queue Load", value: queue.length.toString(), helper: "Build and upgrade pressure on military systems.", icon: Hammer, toneClass: "text-orange-700" },
            { label: "Unread Reports", value: unreadMessages.toString(), helper: "Combat reports and battle summaries waiting.", icon: ScrollText, toneClass: "text-violet-700" },
            { label: "Deuterium", value: resources.deuterium.toLocaleString(), helper: "Flight fuel and war-drive reserve stock.", icon: Database, toneClass: "text-green-700" },
          ]
        : activePageContext?.section === "Exploration"
          ? [
              { label: "Realm Server", value: selectedRealm?.name || "Offline", helper: "Current realm routing for exploration systems.", icon: Globe, toneClass: "text-cyan-700" },
              { label: "Mission Ops", value: activeMissions.length.toString(), helper: "Survey fleets and frontier expeditions underway.", icon: Compass, toneClass: "text-blue-700" },
              { label: "Queue Load", value: queue.length.toString(), helper: "Queued projects competing for exploration tempo.", icon: Clock, toneClass: "text-orange-700" },
              { label: "Coordinates", value: coordinates, helper: "Active world coordinates anchoring current view.", icon: Map, toneClass: "text-slate-700" },
            ]
          : activePageContext?.section === "Diplomacy"
            ? [
                { label: "Alliance", value: alliance?.tag || "NONE", helper: "Current alliance or guild command attachment.", icon: Shield, toneClass: alliance ? "text-emerald-700" : "text-slate-700" },
                { label: "Unread Mail", value: unreadMessages.toString(), helper: "Diplomatic traffic and command communications.", icon: Mail, toneClass: "text-violet-700" },
                { label: "Realm Server", value: selectedRealm?.name || "Offline", helper: "Current social and server cluster context.", icon: Globe, toneClass: "text-cyan-700" },
                { label: "Credits", value: resources.credits.toLocaleString(), helper: "Political and trade flexibility reserve.", icon: Coins, toneClass: "text-amber-700" },
              ]
            : activePageContext?.section === "Economy"
              ? [
                  { label: "Credits", value: resources.credits.toLocaleString(), helper: "Liquid economy reserve for trade and growth.", icon: Coins, toneClass: "text-amber-700" },
                  { label: "Food", value: resources.food.toLocaleString(), helper: "Population support and agricultural capacity.", icon: Wheat, toneClass: "text-lime-700" },
                  { label: "Water", value: resources.water.toLocaleString(), helper: "Civilian and industrial support reserves.", icon: Droplets, toneClass: "text-cyan-700" },
                  { label: "Queue Load", value: queue.length.toString(), helper: "Economic projects waiting to complete.", icon: Clock, toneClass: "text-blue-700" },
                ]
              : [
                  { label: "Active Base", value: activeBase.toUpperCase(), helper: "Current command layer for page actions.", icon: CircleDot, toneClass: "text-cyan-700" },
                  { label: "Queue Load", value: queue.length.toString(), helper: "Total queued construction and upgrade jobs.", icon: Clock, toneClass: "text-blue-700" },
                  { label: "Mission Ops", value: activeMissions.length.toString(), helper: "Fleets and actions currently in progress.", icon: Send, toneClass: "text-red-700" },
                  { label: "Unread Reports", value: unreadMessages.toString(), helper: "Unread system logs and command messages.", icon: Mail, toneClass: "text-violet-700" },
                ];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.sdTheme = displayPreferences.themePreset;
    root.dataset.deviceProfile = displayPreferences.deviceProfile;
    root.dataset.browserWidth = displayPreferences.browserWidth;
    root.dataset.touchUi = touchMode ? "true" : "false";
    root.dataset.mobileOptimized = displayPreferences.mobileOptimized ? "true" : "false";
    root.dataset.touchTargetSize = displayPreferences.touchTargetSize;
    root.classList.toggle("compact-ui", displayPreferences.compactView);
    root.classList.toggle("reduced-motion-ui", !displayPreferences.showAnimations);

    return () => {
      root.classList.remove("compact-ui", "reduced-motion-ui");
      delete root.dataset.sdTheme;
      delete root.dataset.deviceProfile;
      delete root.dataset.browserWidth;
      delete root.dataset.touchUi;
      delete root.dataset.mobileOptimized;
      delete root.dataset.touchTargetSize;
    };
  }, [
    displayPreferences.themePreset,
    displayPreferences.browserWidth,
    displayPreferences.compactView,
    displayPreferences.deviceProfile,
    displayPreferences.mobileOptimized,
    displayPreferences.showAnimations,
    displayPreferences.touchTargetSize,
    touchMode,
  ]);

  return (
    <div className={cn(
      "sd-game-shell relative isolate min-h-screen overflow-hidden flex flex-col",
      displayPreferences.themePreset === "og-white" ? "bg-slate-50 text-slate-900" : "bg-slate-950/80 text-slate-100",
      touchMode && "touch-manipulation",
      !displayPreferences.showAnimations && "motion-reduce",
    )}>
      <SceneLayer
        preset={scenePreset}
        backdropImage={contextBackdropImage}
        animate={displayPreferences.showAnimations}
      />
      
      {/* Top Bar - Resources */}
      <header className={cn(
        "sd-topbar relative z-20 border-b border-slate-200 bg-white/88 shadow-sm backdrop-blur-md",
        isMobile && displayPreferences.stickyMobileBars && "sticky top-0",
      )}>
        <div className={cn(
          "flex flex-col gap-2 px-3 py-3 sm:px-5",
          !isMobile && "flex-row items-start justify-between xl:items-center",
        )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className={cn("shrink-0", touchMode && "h-11 w-11")} data-testid="button-open-mobile-menu">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-[360px] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Game Navigation</SheetTitle>
                    <SheetDescription>Browse all in-game menus and submenus on mobile devices.</SheetDescription>
                  </SheetHeader>
                  <div className="h-full bg-white flex flex-col">
                   <GameSidebar
                      location={location}
                      empireName={empireName}
                      planetName={planetName}
                      coordinates={coordinates}
                      isAdmin={isAdmin}
                      logout={logout}
                      onNavigate={() => setIsSidebarOpen(false)}
                      touchMode={touchMode}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
           <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-sm shrink-0">
             <Rocket className="text-white w-6 h-6" />
           </div>
           <div>
             <h1 className={cn("font-orbitron font-bold tracking-wider text-slate-900", isMobile ? "text-base" : "text-lg xl:text-xl")}>Universe-<span className="text-primary text-xs font-normal xl:text-sm">Empires-Dominions</span></h1>
             <p className="font-rajdhani text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
               Server: Nexus-Alpha // User: {username || "Commander"}
             </p>
             <p className="font-rajdhani text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
               Empire: {empireName || "Stellar Dominion"} // Homeworld: {planetName || "Prime World"}
             </p>
           </div>
          </div>

          {isMobile && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-[0.2em]">
              <MonitorSmartphone className="w-4 h-4 text-primary" />
              <span>{displayPreferences.deviceProfile === "auto" ? "Auto" : displayPreferences.deviceProfile}</span>
            </div>
          )}
        </div>

        <div className={cn("flex flex-col gap-2", !isMobile && "items-end")}>
          <div className="sd-top-link-bar hidden lg:flex items-center gap-1">
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

          <div className="flex w-full flex-wrap items-center justify-start gap-1.5 lg:justify-end" data-testid="header-update-actions">
            <div className={cn(
              "mr-1 flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
              updateInfo?.available
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
            )}>
              {isCheckingUpdate ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              {updateStatusLabel}
            </div>
            <Link href="/forums">
              <Button variant="outline" size="sm" className="h-8 px-2.5 text-[11px]" data-testid="button-header-news">
                <Newspaper className="mr-1.5 h-3.5 w-3.5" />
                News
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-[11px]"
              onClick={() => setShowPatchNotes(true)}
              data-testid="button-header-patch-notes"
            >
              <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
              Patch Notes
            </Button>
            <Button
              variant={updateInfo?.available ? "default" : "outline"}
              size="sm"
              className="h-8 px-2.5 text-[11px]"
              disabled={isCheckingUpdate}
              onClick={() => {
                void checkForUpdate().then(() => setShowPatchNotes(true));
              }}
              data-testid="button-header-check-update"
            >
              <Download className={cn("mr-1.5 h-3.5 w-3.5", isCheckingUpdate && "animate-pulse")} />
              Check Update
            </Button>
          </div>

          <div className={cn(
            "flex items-center gap-2",
            isMobile ? "w-full flex-wrap" : "justify-end"
          )}>
            <div className="sd-realm-label text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Active Realm
            </div>
            <div className={cn(
              "sd-realm-shell flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2",
              isMobile ? "w-full" : "min-w-[270px]"
            )}>
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <Select
                value={selectedRealm?.id || ""}
                onValueChange={(value) => {
                  void switchRealm(value).catch(() => {
                    // The game context already presents the actionable error.
                  });
                }}
              >
                <SelectTrigger className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                  <SelectValue placeholder="Select realm" />
                </SelectTrigger>
                <SelectContent>
                  {realmServers.map((realm) => (
                    <SelectItem key={realm.id} value={realm.id}>
                      {realm.name} · {realm.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRealm && (
                <div className="sd-realm-status rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                  {selectedRealm.status}
                </div>
              )}
            </div>
          </div>

          <div className={cn(
            "flex gap-2 pb-1 scrollbar-hide",
            isMobile ? "w-full overflow-x-auto" : "max-w-[920px] flex-wrap justify-end overflow-visible",
          )}>
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
        </div>
      </header>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="sd-sidebar-shell hidden w-[17rem] border-r border-slate-200 bg-white/84 backdrop-blur-md md:flex md:w-[18rem] md:flex-col md:overflow-y-auto md:scrollbar-hide xl:w-[19rem]">
          <GameSidebar
            location={location}
            empireName={empireName}
            planetName={planetName}
            coordinates={coordinates}
            isAdmin={isAdmin}
            logout={logout}
            touchMode={touchMode}
          />
        </aside>

        {/* Main Content */}
        <main className={cn("sd-main-stage min-w-0 flex-1 overflow-y-auto bg-slate-50/55 backdrop-blur-[2px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent", contentPaddingClass)}>
           <div className={cn(contentWidthClass, "mx-auto")}>
             {activePageContext && (
               <section className="sd-panel mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
                 <div className={cn("sd-panel-header border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 bg-cover bg-center text-white", isMobile ? "px-4 py-4" : "px-5 py-4")} style={{ backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.88)), url(${contextBackdropImage})` }}>
                   <div className="flex flex-wrap items-start justify-between gap-4">
                     <div className="space-y-2">
                       <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
                         <span>{activePageContext.section}</span>
                         <span className="text-cyan-100/50">/</span>
                         <span>{activePageContext.group}</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20">
                           <activePageContext.sectionIcon className="h-5 w-5 text-cyan-200" />
                         </div>
                         <div>
                           <h2 className="font-orbitron text-xl font-bold tracking-wide text-white xl:text-2xl">
                             {activePageContext.item.label}
                           </h2>
                           <p className="text-xs leading-5 text-slate-300 sm:text-sm">
                             {activePageContext.item.description || activePageContext.groupDescription || activePageContext.sectionDescription}
                           </p>
                         </div>
                       </div>
                     </div>
                     <div className={cn("flex items-start gap-3", isMobile && "w-full justify-between")}>
                       <div className={cn("sd-submenu-indicator rounded-xl border border-cyan-200/15 bg-white/5 px-3 py-2.5 text-right", isMobile && "flex-1 text-left")}>
                         <div className="sd-eyebrow text-[10px] uppercase tracking-[0.24em] text-slate-400">Current Submenu</div>
                         <div className="mt-1 font-rajdhani text-lg font-semibold uppercase tracking-wider text-cyan-100">
                           {activePageContext.group}
                         </div>
                       </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0 border-white/15 bg-white/5 text-cyan-100 hover:bg-white/10 hover:text-white"
                        onClick={() => setShowPageCommandDeck((current) => !current)}
                      >
                        {showPageCommandDeck ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPageCommandDeck ? "Collapse page menu deck" : "Open page menu deck"}
                        </span>
                      </Button>
                     </div>
                   </div>
                 </div>

                 <div className={cn("border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-cyan-50/40", isMobile ? "px-4 py-4" : "px-5 py-4")}>
                   <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                     <div>
                       <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-700">Operational Blueprint</div>
                       <p className="mt-1 text-xs leading-5 text-slate-600">
                         Page infrastructure, data relationships, and the intended command flow for {activePageContext.item.label}.
                       </p>
                     </div>
                     <div className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                       {activePageContext.section} infrastructure
                     </div>
                   </div>

                   <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                     {pageInfrastructure.map((detail) => (
                       <div key={detail.label} className="group rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm transition-colors hover:border-cyan-300">
                         <div className="flex items-center justify-between gap-3">
                           <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">{detail.label}</span>
                           <detail.icon className={cn("h-4 w-4", detail.toneClass)} />
                         </div>
                         <div className={cn("mt-2 text-sm font-bold leading-5", detail.toneClass)}>{detail.value}</div>
                         <p className="mt-1 text-[11px] leading-4 text-slate-500">{detail.helper}</p>
                       </div>
                     ))}
                   </div>
                 </div>

                 {showPageCommandDeck ? (
                 <div className={cn(isMobile ? "px-4 py-4" : "px-5 py-4")}>
                   <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                       <div>
                         <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Sub Pages</div>
                       <div className="text-sm text-slate-600">
                         {activePageContext.groupDescription || "Jump between related pages in this submenu group."}
                       </div>
                     </div>
                     <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                       {activePageContext.siblings.length} linked pages
                     </div>
                   </div>

                   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                     {activePageContext.siblings.map((item) => {
                       const itemActive = isNavItemActive(item, location);

                       return (
                         <Link key={item.href} href={item.href}>
                           <div
                             className={cn(
                               "sd-subpage-card h-full min-w-0 cursor-pointer rounded-xl border px-3 py-3 transition-all duration-200",
                               itemActive
                                 ? "border-primary bg-primary/10 shadow-sm"
                                 : "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-white"
                             )}
                           >
                             <div className="mb-2 flex items-center gap-2">
                               <item.icon className={cn("h-4 w-4", itemActive ? "text-primary" : "text-slate-500")} />
                               <div className={cn(
                                 "font-rajdhani text-sm font-bold uppercase tracking-wider",
                                 itemActive ? "text-primary" : "text-slate-800"
                               )}>
                                 {item.label}
                               </div>
                             </div>
                             <p className="text-xs leading-5 text-slate-500">
                               {item.description || "Open this related page."}
                             </p>
                           </div>
                         </Link>
                       );
                     })}
                   </div>

                   <div className="mt-4 border-t border-slate-200 pt-4">
                     <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                       <div>
                         <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Command Tiles</div>
                         <div className="text-sm text-slate-600">
                           Asset-backed shortcuts for linked pages, images, and core game functions.
                         </div>
                       </div>
                       <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                         {commandTiles.length} live tiles
                       </div>
                     </div>

                   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                     {commandTiles.map((tile) => {
                        const tileActive = isNavItemActive(tile, location);

                         return (
                           <Link key={tile.href} href={tile.href}>
                             <div
                               className={cn(
                                 "sd-command-tile group relative min-h-[152px] cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-200",
                                 tileActive
                                   ? "border-primary bg-primary/5"
                                   : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                               )}
                               style={{
                                 backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.16), rgba(15, 23, 42, 0.9)), url(${tile.assetPath})`,
                                 backgroundSize: "cover",
                                 backgroundPosition: "center",
                               }}
                             >
                               <div className="flex h-full flex-col justify-between p-4 text-white">
                                 <div className="flex items-start justify-between gap-3">
                                   <div className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100">
                                     {tile.kicker}
                                   </div>
                                   <div className={cn(
                                     "flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/20",
                                     tileActive && "border-cyan-200/40 bg-cyan-400/10"
                                   )}>
                                     <tile.icon className="h-4 w-4 text-cyan-100" />
                                   </div>
                                 </div>

                                 <div>
                                   <div className="font-orbitron text-base font-bold tracking-wide text-white">
                                     {tile.label}
                                   </div>
                                   <p className="mt-2 text-xs leading-5 text-slate-200">
                                     {tile.description || "Open this command page."}
                                   </p>
                                 </div>
                               </div>
                             </div>
                           </Link>
                       );
                      })}
                     </div>

                     <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1.4fr]">
                       <div className="sd-panel-surface rounded-2xl border border-slate-200 bg-slate-50 p-4">
                         <div className="mb-3 flex items-center justify-between gap-3">
                           <div>
                             <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Base Selection</div>
                             <div className="text-sm text-slate-600">Switch the active command layer used by pages, menus, and management panels.</div>
                           </div>
                           <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                             {activeBase}
                           </div>
                         </div>

                         <div className="grid gap-2 sm:grid-cols-3">
                           {[
                             { id: "planet", label: "Planet Command", icon: Globe, helper: "Surface production, resources, and city management." },
                             { id: "moon", label: "Moon Operations", icon: CircleDot, helper: "Moon base logistics, jump gate, and relay controls." },
                             { id: "station", label: "Station Control", icon: Satellite, helper: "Orbital support, stations, and deep-space operations." },
                           ].map((base) => {
                             const isActiveBase = activeBase === base.id;
                             return (
                               <Button
                                 key={base.id}
                                 variant={isActiveBase ? "default" : "outline"}
                                 className={cn("h-auto min-h-[68px] flex-col items-start justify-start gap-1 p-3 text-left", isActiveBase && "shadow-sm")}
                                 onClick={() => setActiveBase(base.id as "planet" | "moon" | "station")}
                               >
                                 <div className="flex items-center gap-2">
                                   <base.icon className="h-4 w-4" />
                                   <span className="font-semibold">{base.label}</span>
                                 </div>
                                 <div className={cn("text-xs leading-5 whitespace-normal", isActiveBase ? "text-primary-foreground/80" : "text-slate-500")}>
                                   {base.helper}
                                 </div>
                               </Button>
                             );
                           })}
                         </div>
                       </div>

                       <div className="sd-panel-surface rounded-2xl border border-slate-200 bg-white p-4">
                         <div className="mb-3 flex items-center justify-between gap-3">
                           <div>
                             <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Command Actions</div>
                             <div className="text-sm text-slate-600">Clearer buttons and shortcuts for the current main menu and submenu selection.</div>
                           </div>
                           <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                             {sharedActions.length} actions
                           </div>
                         </div>

                         <div className="grid gap-3 sm:grid-cols-2">
                           {sharedActions.map((action) => {
                             const actionContent = (
                               <Button
                                 variant={action.onClick ? "default" : "outline"}
                                 className="h-auto min-h-[72px] w-full flex-col items-start justify-start gap-1 p-3 text-left"
                                 onClick={action.onClick}
                               >
                                 <div className="flex items-center gap-2">
                                   <action.icon className="h-4 w-4" />
                                   <span className="font-semibold">{action.label}</span>
                                 </div>
                                 <div className={cn("text-xs leading-5 whitespace-normal", action.onClick ? "text-primary-foreground/80" : "text-slate-500")}>
                                   {action.helper}
                                 </div>
                               </Button>
                             );

                             return action.href ? (
                               <Link key={action.label} href={action.href}>
                                 {actionContent}
                               </Link>
                             ) : (
                               <div key={action.label}>{actionContent}</div>
                             );
                           })}
                         </div>
                       </div>
                     </div>

                     <div className="sd-panel-surface mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                       <div className="mb-3 flex items-center justify-between gap-3">
                         <div>
                           <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">System Details</div>
                           <div className="text-sm text-slate-600">Live details and support metrics for the current menu layer.</div>
                         </div>
                         <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                           {detailCards.length} details
                         </div>
                       </div>

                       <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                         {detailCards.map((detail) => (
                           <div key={detail.label} className="sd-detail-card rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                             <div className="flex items-center justify-between gap-3">
                               <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{detail.label}</div>
                               <detail.icon className={cn("h-4 w-4", detail.toneClass)} />
                             </div>
                             <div className={cn("mt-2 font-orbitron text-lg font-bold", detail.toneClass)}>{detail.value}</div>
                             <div className="mt-1 text-xs leading-5 text-slate-500">{detail.helper}</div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
                 ) : (
                 <div className={cn(isMobile ? "px-4 py-4" : "px-5 py-4")}>
                   <div className="sd-panel-surface sd-collapsed-notice rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 backdrop-blur-sm">
                     <div className="flex flex-wrap items-center justify-between gap-3">
                       <div>
                         <div className="sd-eyebrow text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Page Menu Collapsed</div>
                         <div className="text-sm text-slate-600">
                           This page menu is now folded into the left-side menu and submenu categories. Use the left navigation to jump between linked sub pages, or reopen this panel here.
                         </div>
                       </div>
                       <Button type="button" onClick={() => setShowPageCommandDeck(true)}>
                         <Menu className="mr-2 h-4 w-4" />
                         Open Page Menu
                       </Button>
                     </div>
                   </div>
                 </div>
                 )}
               </section>
             )}
             {children}
           </div>
        </main>
      </div>

      <footer className="sd-footer-shell relative z-10 border-t border-slate-200 bg-white/88 px-4 py-2 backdrop-blur-md sm:px-6 flex flex-col gap-1 sm:h-8 sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-500 font-mono" data-testid="footer-build-info">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-slate-700">universe-empire-domions</span>
          <span>Developer: Stephen</span>
          <span>
            Publisher:{" "}
            <a
              href="https://github.com/ArkansasIo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
              data-testid="link-footer-publisher"
            >
              ArkansasIo
            </a>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span>Version: {appVersion}</span>
          <button
            type="button"
            onClick={() => setShowPatchNotes(true)}
            className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
            data-testid="button-footer-patch-info"
          >
            Patch: {displayedPatchVersion}
          </button>
          <span className={updateInfo?.available ? "font-semibold text-amber-700" : "text-emerald-700"}>
            Update: {updateStatusLabel}
          </span>
          <span>Build: {buildId}</span>
          <span>Time: {buildTime}</span>
        </div>
      </footer>

      <Dialog open={showPatchNotes} onOpenChange={setShowPatchNotes}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-slate-300 bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-orbitron text-slate-900">
              <ClipboardList className="h-5 w-5 text-cyan-700" />
              Update & Patch Information
            </DialogTitle>
            <DialogDescription>
              Current client version, release status, and recent patch changes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Installed</div>
              <div className="mt-1 font-orbitron text-sm font-bold text-slate-900">{appVersion}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Latest Patch</div>
              <div className="mt-1 font-orbitron text-sm font-bold text-cyan-700">{displayedPatchVersion}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Status</div>
              <div className={cn("mt-1 font-orbitron text-sm font-bold", updateInfo?.available ? "text-amber-700" : "text-emerald-700")}>
                {updateStatusLabel}
              </div>
            </div>
          </div>

          {displayedManifest?.releaseDate && (
            <div className="text-xs text-slate-500">
              Released: {new Date(displayedManifest.releaseDate).toLocaleDateString()}
              {displayedManifest.critical ? " · Critical update" : ""}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700">Patch Notes</div>
                <div className="text-sm text-slate-600">Recent systems, interface, and stability changes.</div>
              </div>
              <Link href="/forums">
                <Button variant="outline" size="sm" onClick={() => setShowPatchNotes(false)}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  News
                </Button>
              </Link>
            </div>
            <ul className="space-y-2">
              {patchNotes.map((note, index) => (
                <li key={`${note}-${index}`} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPatchNotes(false)}>Close</Button>
            <Button
              disabled={isCheckingUpdate}
              onClick={() => void checkForUpdate()}
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", isCheckingUpdate && "animate-spin")} />
              Check Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
