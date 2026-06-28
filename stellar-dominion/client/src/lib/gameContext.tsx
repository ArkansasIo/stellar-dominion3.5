import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CommanderState, Item, RaceId, ClassId, SubClassId, RACES, CLASSES, SUBCLASSES } from './commanderTypes';
import { GovernmentState, GOVERNMENTS, GovernmentId, POLICIES } from './governmentData';
import { Alliance, AllianceMember, MOCK_ALLIANCES } from './allianceData';
import { Artifact, ARTIFACTS } from './artifactData';
import { simulateCombat, simulateEspionage, simulateSabotage, BattleReport, EspionageReport } from './gameLogic';
import { CronJob, DEFAULT_CRON_JOBS } from './cronData';
import { calculateConstructionCost, getMegaStructureTemplateById } from './megaStructures';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Megastructure, createMegastructure } from '@shared/config/megastructuresConfig';
import { blink } from './blink';

async function apiRequest(method: string, url: string, data?: any) {
  const headers: Record<string, string> = data ? { 'Content-Type': 'application/json' } : {};
  
  const storedUser = localStorage.getItem('stellar_username');
  const storedPass = localStorage.getItem('stellar_password');
  if (storedUser && storedPass) {
    const encoded = btoa(`${storedUser}:${storedPass}`);
    headers['Authorization'] = `Basic ${encoded}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include'
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  credits: number;
  food: number;
  water: number;
}

const DEFAULT_RESOURCES: Resources = {
  metal: 50000,
  crystal: 50000,
  deuterium: 20000,
  energy: 5000,
  credits: 10000,
  food: 5000,
  water: 5000,
};

function normalizeResources(raw: any, fallback: Resources = DEFAULT_RESOURCES): Resources {
  return {
    metal: Number(raw?.metal ?? fallback.metal),
    crystal: Number(raw?.crystal ?? fallback.crystal),
    deuterium: Number(raw?.deuterium ?? fallback.deuterium),
    energy: Number(raw?.energy ?? fallback.energy),
    credits: Number(raw?.credits ?? fallback.credits),
    food: Number(raw?.food ?? fallback.food),
    water: Number(raw?.water ?? fallback.water),
  };
}

interface Buildings {
  metalMine: number;
  crystalMine: number;
  deuteriumSynthesizer: number;
  solarPlant: number;
  roboticsFactory: number;
  shipyard: number;
  researchLab: number;
}

interface OrbitalBuildings {
  [key: string]: number;
}

// Define Research interface locally if not exported, or match the structure
export interface Research {
  energyTech: number;
  laserTech: number;
  ionTech: number;
  hyperspaceTech: number;
  plasmaTech: number;
  combustionDrive: number;
  impulseDrive: number;
  hyperspaceDrive: number;
  espionageTech: number;
  computerTech: number;
  astrophysics: number;
  intergalacticResearchNetwork: number;
  gravitonTech: number;
  weaponsTech: number;
  shieldingTech: number;
  armourTech: number;
  aiTech: number;
  quantumTech: number;
  [key: string]: number; 
}

// Dynamic unit storage
type Units = {
  [key: string]: number;
};

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "danger" | "success";
  timestamp: number;
}

export interface QueueItem {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  type: "building" | "research" | "unit" | "megastructure";
  amount?: number;
  itemId?: string;
}

export interface Mission {
  id: string;
  type: "attack" | "transport" | "espionage" | "colonize" | "deploy" | "sabotage";
  target: string; // Coordinates e.g. "1:102:8"
  units: Units;
  arrivalTime: number;
  returnTime: number;
  status: "outbound" | "holding" | "return";
  processed?: boolean; // To prevent double processing
}

export interface GameConfig {
  universeName: string;
  gameSpeed: number; // 1x, 2x, 5x
  resourceRate: number; // 1x, 2x...
  fleetSpeed: number; // 1x...
  peaceMode: boolean;
  serverTimezone: string;
  version: string;
  maintenanceMode: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "player" | "system" | "alliance" | "combat" | "espionage";
  battleReport?: BattleReport; // Optional attachment
  espionageReport?: EspionageReport;
}

interface GameState {
  resources: Resources;
  buildings: Buildings;
  orbitalBuildings: OrbitalBuildings;
  activeBase: "planet" | "moon" | "station";
  setActiveBase: (base: "planet" | "moon" | "station") => void;
  research: {[key: string]: number};
  units: Units;
  megastructures: Megastructure[];
  commander: CommanderState;
  government: GovernmentState;
  planetName: string;
  events: GameEvent[];
  queue: QueueItem[];
  activeMissions: Mission[];
  config: GameConfig;
  messages: Message[];
  alliance: Alliance | null;
  artifacts: Artifact[];
  cronJobs: CronJob[];
  coordinates: string;
  isAdmin: boolean;
  isActualAdmin: boolean;
  adminRole: string | null;
  isLoggedIn: boolean;
  needsSetup: boolean;
  username: string;
  totalTurns: number;
  currentTurns: number;
  spendTurns: (amount: number) => boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  toggleAdmin: () => void;
  updateBuilding: (building: keyof Buildings, name: string, time?: number) => void;
  updateResearch: (tech: string, name: string, time: number) => void;
  buildUnit: (unitId: string, amount: number, name: string, time: number) => void;
  constructMegastructure: (templateId: string, name: string, time: number) => void;
  addEvent: (title: string, description: string, type: GameEvent["type"]) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: "weapon" | "armor" | "module") => void;
  craftItem: (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => void;
  temperItem: (itemId: string) => void;
  setCommanderIdentity: (race: RaceId, cls: ClassId, subClass: SubClassId | null) => void;
  upgradeCommanderSkill: (skill: "warfare" | "logistics" | "science" | "engineering") => boolean;
  setGovernmentType: (type: GovernmentId) => void;
  completeSetup: (commander: CommanderState, government: GovernmentState) => Promise<void>;
  togglePolicy: (policyId: string) => void;
  setTaxRate: (rate: number) => void;
  dispatchFleet: (mission: Omit<Mission, "id" | "status" | "returnTime">) => void;
  updateConfig: (newConfig: Partial<GameConfig>) => void;
  sendMessage: (to: string, subject: string, body: string) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  createAlliance: (name: string, tag: string) => void;
  joinAlliance: (id: string) => void;
  leaveAlliance: () => void;
  activateArtifact: (id: string) => void;
  toggleCronJob: (id: string) => void;
  runCronJob: (id: string) => void;
  travelTo: (destinationName: string, coords: string, cost: { deuterium: number }) => void;
  inventory: {[key: string]: number};
  buyItem: (itemId: string, cost: {metal: number, crystal: number, deuterium: number}) => void;
  sellItem: (itemId: string, value: {metal: number, crystal: number, deuterium: number}) => void;
  processMissions: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resources>(DEFAULT_RESOURCES);

  const [buildings, setBuildings] = useState<Buildings>({
    metalMine: 10,
    crystalMine: 8,
    deuteriumSynthesizer: 5,
    solarPlant: 12,
    roboticsFactory: 2,
    shipyard: 2,
    researchLab: 1,
  });

  const [orbitalBuildings, setOrbitalBuildings] = useState<OrbitalBuildings>({
    lunarBase: 0,
    sensorPhalanx: 0,
    jumpGate: 0,
    starbaseHub: 0,
    orbitalShipyard: 0,
    tradeDock: 0,
    defenseGrid: 0
  });

  const [activeBase, setActiveBase] = useState<"planet" | "moon" | "station">("planet");

  const [research, setResearch] = useState<{[key: string]: number}>({
    energyTech: 0,
    laserTech: 0,
    ionTech: 0,
    hyperspaceTech: 0,
    plasmaTech: 0,
    combustionDrive: 0,
    impulseDrive: 0,
    hyperspaceDrive: 0,
    espionageTech: 0,
    computerTech: 0,
    astrophysics: 0,
    intergalacticResearchNetwork: 0,
    gravitonTech: 0,
    weaponsTech: 0,
    shieldingTech: 0,
    armourTech: 0,
    aiTech: 0,
    quantumTech: 0
  });

  const [units, setUnits] = useState<Units>({
    lightFighter: 5,
    smallCargo: 2,
    espionageProbe: 10,
    marine: 50,
    colonist: 100
  });

  const [megastructures, setMegastructures] = useState<Megastructure[]>([]);

  // Items Inventory
  const [inventory, setInventory] = useState<{[key: string]: number}>({
    plasteel: 10,
    circuit_board: 5
  });

  const buyItem = (itemId: string, cost: {metal: number, crystal: number, deuterium: number}) => {
    if (
      resources.metal >= cost.metal && 
      resources.crystal >= cost.crystal && 
      resources.deuterium >= cost.deuterium
    ) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - cost.metal,
        crystal: prev.crystal - cost.crystal,
        deuterium: prev.deuterium - cost.deuterium
      }));
      setInventory(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1
      }));
      addEvent("Purchase Successful", `Bought item ${itemId}`, "success");
    } else {
      addEvent("Purchase Failed", "Insufficient funds.", "danger");
    }
  };

  const sellItem = (itemId: string, value: {metal: number, crystal: number, deuterium: number}) => {
    if ((inventory[itemId] || 0) > 0) {
       setInventory(prev => ({
         ...prev,
         [itemId]: prev[itemId] - 1
       }));
       setResources(prev => ({
         ...prev,
         metal: prev.metal + value.metal,
         crystal: prev.crystal + value.crystal,
         deuterium: prev.deuterium + value.deuterium
       }));
       addEvent("Sale Successful", `Sold item ${itemId}`, "success");
    }
  };

  const [totalTurns, setTotalTurns] = useState(0);
  const [currentTurns, setCurrentTurns] = useState(0);
  const lastTurnUpdateRef = useRef(Date.now());

  const [commander, setCommander] = useState<CommanderState>({
    name: "Commander",
    race: "terran",
    class: "admiral",
    subClass: null,
    stats: { level: 1, xp: 0, warfare: 1, logistics: 1, science: 1, engineering: 1 },
    equipment: { weapon: null, armor: null, module: null },
    inventory: [
      { id: "bp_plasmaRifle", name: "Plasma Rifle Blueprint", description: "Blueprint for a standard plasma rifle.", type: "blueprint", rarity: "common", level: 1 },
      { id: "raw_metal", name: "Refined Metal", description: "High quality crafting material.", type: "material", rarity: "common", level: 1 }
    ]
  });

  const [government, setGovernment] = useState<GovernmentState>({
    type: "democracy",
    policies: [],
    stats: {
      stability: 60,
      publicSupport: 50,
      efficiency: 50,
      militaryReadiness: 40,
      corruption: 10
    },
    taxRate: 20
  });

  const [config, setConfig] = useState<GameConfig>({
    universeName: "Nexus-Alpha",
    gameSpeed: 1,
    resourceRate: 1,
    fleetSpeed: 1,
    peaceMode: false,
    serverTimezone: "UTC",
    version: "v0.8.2-beta",
    maintenanceMode: false
  });

  const [messages, setMessages] = useState<Message[]>([
     { id: "1", from: "High Command", to: "Commander", subject: "Welcome to Nexus-Alpha", body: "Greetings Commander. Establish your base and prepare for expansion.", timestamp: Date.now(), read: false, type: "system" },
     { id: "2", from: "Pirate King", to: "Commander", subject: "Surrender or Die", body: "This sector belongs to the Red Skull gang. Pay tribute or face destruction.", timestamp: Date.now() - 86400000, read: true, type: "player" }
  ]);

  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([
    ARTIFACTS[0], ARTIFACTS[3] // Start with Star Map and Banner
  ]);

  const [cronJobs, setCronJobs] = useState<CronJob[]>(DEFAULT_CRON_JOBS);

  const [events, setEvents] = useState<GameEvent[]>([
    { id: "1", title: "Welcome Commander", description: "Colony established on Homeworld.", type: "success", timestamp: Date.now() }
  ]);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);

  const [planetName, setPlanetName] = useState("Earth");
  const [coordinates, setCoordinates] = useState("1:1:100:3");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActualAdmin, setIsActualAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [username, setUsername] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  const { data: authUser, isLoading: authLoading, error: authError, isSuccess: authSuccess } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      
      // Add basic auth if credentials are stored
      const storedUsername = localStorage.getItem('stellar_username');
      const storedPassword = localStorage.getItem('stellar_password');
      if (storedUsername && storedPassword) {
        const encoded = btoa(`${storedUsername}:${storedPassword}`);
        headers['Authorization'] = `Basic ${encoded}`;
      }
      
      const res = await fetch('/api/auth/user', { 
        credentials: 'include',
        headers 
      });
      
      if (!res.ok) {
        // Return null for auth failures instead of throwing
        return null;
      }
      return res.json();
    },
    staleTime: 60000
  });

  const { data: serverGameState, isLoading: gameStateLoading, refetch: refetchGameState } = useQuery({
    queryKey: ['/api/game/state'],
    queryFn: () => apiRequest('GET', '/api/game/state'),
    enabled: !!authUser,
    staleTime: 30000
  });

  const { data: turnData, refetch: refetchTurns } = useQuery({
    queryKey: ['/api/turns'],
    queryFn: () => apiRequest('GET', '/api/turns'),
    enabled: !!authUser,
    refetchInterval: 15000 // Sync turns every 15s
  });

  useEffect(() => {
    if (!authUser?.id) return;

    let mounted = true;
    let channel: any = null;

    const setupRealtime = async () => {
      try {
        const channelName = `user_${authUser.id}`;
        channel = blink.realtime.channel(channelName);
        channelRef.current = channel;

        await channel.subscribe({
          userId: authUser.id,
          metadata: { status: 'online' }
        });

        if (!mounted) return;

        channel.onMessage((msg: any) => {
          if (!mounted) return;
          
          if (msg.type === "game_tick") {
            // Server-side tick received, refresh state
            queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
            queryClient.invalidateQueries({ queryKey: ['/api/game/missions'] });
            
            if (msg.data.resources) {
              setResources(prev => normalizeResources(msg.data.resources, prev));
            }
            
            if (msg.data.turnsAvailable !== undefined) {
              setCurrentTurns(msg.data.turnsAvailable);
            }
            
            if (msg.data.completedBuildings?.length > 0) {
              addEvent("Infrastructure Update", "Buildings updated via central command.", "success");
            }
          } else if (msg.type === "queue_completed") {
            refetchGameState();
            addEvent("Infrastructure Update", "A construction project has been finalized.", "success");
          } else if (msg.type === "turn_accrued") {
            refetchTurns();
          }
        });

        console.log(`[REALTIME] Subscribed to ${channelName}`);
      } catch (err) {
        console.error("[REALTIME] Subscription error:", err);
      }
    };

    setupRealtime();

    return () => {
      mounted = false;
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [authUser?.id, queryClient]);


  const { data: serverMissions, refetch: refetchMissions } = useQuery({
    queryKey: ['/api/game/missions'],
    queryFn: () => apiRequest('GET', '/api/game/missions'),
    enabled: !!authUser,
    staleTime: 5000
  });

  const startResearchMutation = useMutation({
    mutationFn: (techId: string) => apiRequest('POST', '/api/research/player/start', { techId }),
    onSuccess: () => {
      refetchGameState();
      addEvent("Research Started", "Technological initiative confirmed.", "info");
    },
    onError: (error: any) => {
      addEvent("Research Error", error.message || "Failed to start research", "danger");
    }
  });

  const completeResearchMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/research/player/complete', {}),
    onSuccess: () => refetchGameState()
  });

  const processQueueMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/process-queue', {}),
    onSuccess: (data) => {
      refetchGameState();
      if (data.completed && data.completed.length > 0) {
        data.completed.forEach((item: any) => {
          if (item.type === "building") {
            addEvent("Construction Complete", `${item.buildingType} upgrade finished on server.`, "success");
          } else if (item.type === "unit") {
            addEvent("Shipyard Order", `${item.amount}x ${item.unitType} constructed on server.`, "success");
          }
        });
      }
    }
  });

  const syncTickMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/sync-tick', {}),
    onSuccess: (data) => {
      // Sync resources if backend is more authoritative
      if (data.resourceTick?.resources) {
        setResources(normalizeResources(data.resourceTick.resources, resources));
      }
      if (data.queueTick?.completed && data.queueTick.completed.length > 0) {
        refetchGameState();
      }
    }
  });

  const createMissionMutation = useMutation({
    mutationFn: (mission: any) => apiRequest('POST', '/api/game/send-fleet', {
      missionType: mission.type,
      destination: mission.target,
      ships: mission.units
    }),
    onSuccess: () => refetchMissions()
  });

  const processMissionsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/process-missions', {}),
    onSuccess: () => {
      refetchMissions();
      refetchGameState();
    }
  });

  const updateMissionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => apiRequest('PATCH', `/api/missions/${id}`, updates)
  });

  const { data: serverMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: () => apiRequest('GET', '/api/messages?limit=50'),
    enabled: !!authUser,
    staleTime: 10000
  });

  const collectResourcesMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/game/collect-resources'),
    onSuccess: (data) => {
      setResources(normalizeResources(data.resources, resources));
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: any) => apiRequest('POST', '/api/messages', msg),
    onSuccess: () => refetchMessages()
  });

  const markMessageReadMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PATCH', `/api/messages/${id}/read`, {})
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/messages/${id}`)
  });

  const { data: serverAlliance, refetch: refetchAlliance } = useQuery({
    queryKey: ['/api/alliances/mine'],
    queryFn: () => apiRequest('GET', '/api/alliances/mine'),
    enabled: !!authUser,
    staleTime: 30000
  });

  const createAllianceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/alliances', data),
    onSuccess: () => refetchAlliance()
  });

  const joinAllianceMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/alliances/${id}/join`, {}),
    onSuccess: () => refetchAlliance()
  });

  const leaveAllianceMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/alliances/${id}/leave`, {}),
    onSuccess: () => refetchAlliance()
  });

  const saveGameStateMutation = useMutation({
    mutationFn: (updates: any) => apiRequest('PATCH', '/api/game/state', updates)
  });

  const debouncedSave = useCallback((updates: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveGameStateMutation.mutate(updates);
    }, 2000);
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authUser) {
      setIsLoggedIn(false);
      setNeedsSetup(false);
      setIsInitialized(false);
      setUsername("");
      return;
    }

    setIsLoggedIn(true);
    setUsername(authUser.firstName || authUser.email?.split('@')[0] || authUser.username || 'Commander');
    setIsActualAdmin(authUser.isAdmin || false);
    setAdminRole(authUser.adminRole || null);
  }, [authUser, authLoading]);

  useEffect(() => {
    if (!authUser || isInitialized || gameStateLoading) {
      return;
    }

    const state = (serverGameState && typeof serverGameState === "object") ? serverGameState : {};

    setResources(normalizeResources((state as any).resources, DEFAULT_RESOURCES));
    setBuildings({
      metalMine: (state as any).buildings?.metalMine || 1,
      crystalMine: (state as any).buildings?.crystalMine || 1,
      deuteriumSynthesizer: (state as any).buildings?.deuteriumSynthesizer || 0,
      solarPlant: (state as any).buildings?.solarPlant || 1,
      roboticsFactory: (state as any).buildings?.roboticsFactory || 0,
      shipyard: (state as any).buildings?.shipyard || 0,
      researchLab: (state as any).buildings?.researchLab || 0,
    });
    setOrbitalBuildings((state as any).orbitalBuildings || {});
    setResearch((state as any).research || {});
    setUnits((state as any).units || {});
    setMegastructures((state as any).megastructures || []);
    if ((state as any).commander) setCommander((state as any).commander);
    if ((state as any).government) setGovernment((state as any).government);
    if ((state as any).artifacts) setArtifacts((state as any).artifacts);
    if ((state as any).cronJobs) setCronJobs((state as any).cronJobs);
    setPlanetName((state as any).planetName || "Earth");
    setCoordinates((state as any).coordinates || "1:1:100:3");
    
    // Sync turns from server
    if (turnData) {
      setTotalTurns(turnData.totalTurns || 0);
      setCurrentTurns(turnData.currentTurns || 0);
    } else {
      setTotalTurns((state as any).totalTurns || 0);
      setCurrentTurns((state as any).currentTurns || 0);
    }
    
    setNeedsSetup(Boolean((state as any).setupComplete === false));
    setIsInitialized(true);
  }, [authUser, serverGameState, gameStateLoading, isInitialized, turnData]);

  useEffect(() => {
    if (serverMissions && Array.isArray(serverMissions)) {
      const formattedMissions = serverMissions.map((m: any) => ({
        id: m.id,
        type: m.type,
        target: m.target,
        units: m.units || {},
        arrivalTime: new Date(m.arrivalTime).getTime(),
        returnTime: m.returnTime ? new Date(m.returnTime).getTime() : 0,
        status: m.status,
        processed: m.processed
      }));
      setActiveMissions(formattedMissions);
    }
  }, [serverMissions]);

  useEffect(() => {
    if (serverMessages && Array.isArray(serverMessages)) {
      const formattedMessages = serverMessages.map((m: any) => ({
        id: m.id,
        from: m.from,
        to: m.to,
        subject: m.subject,
        body: m.body,
        timestamp: new Date(m.timestamp).getTime(),
        read: m.read,
        type: m.type,
        battleReport: m.battleReport,
        espionageReport: m.espionageReport
      }));
      setMessages(formattedMessages);
    }
  }, [serverMessages]);

  useEffect(() => {
    if (serverAlliance) {
      const allianceData = serverAlliance.alliance;
      if (allianceData) {
        setAlliance({
          id: allianceData.id,
          name: allianceData.name,
          tag: allianceData.tag,
          description: allianceData.description || "A new alliance rises.",
          announcement: allianceData.announcement || "Welcome to the alliance.",
          members: [],
          applications: [],
          resources: allianceData.resources || { metal: 0, crystal: 0, deuterium: 0 }
        });
      }
    }
  }, [serverAlliance]);

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      debouncedSave({
        resources,
        buildings,
        orbitalBuildings,
        research,
        units,
        megastructures,
        commander,
        government,
        artifacts,
        cronJobs,
        planetName,
        coordinates
      });
    }
  }, [buildings, orbitalBuildings, research, units, megastructures, commander, government, artifacts, cronJobs, planetName, coordinates, isInitialized, isLoggedIn, debouncedSave]);

  // Calculate production
  const getProduction = () => {
    // Add Commander Logistics Bonus (with defensive checks)
    const commanderStats = commander?.stats || { logistics: 1, warfare: 1, science: 1, engineering: 1 };
    let logisticsBonus = 1 + ((commanderStats.logistics || 1) * 0.05); // 5% per level

    // Add Race/Class Bonuses
    if (commander?.race === "terran") logisticsBonus += 0.05;
    if (commander?.race === "lithoid") logisticsBonus += 0.10; // Mock
    if (commander?.class === "industrialist") logisticsBonus += 0.15;

    // Add Government Bonuses (Stability & Corruption) - with defensive checks
    const govStats = government?.stats || { stability: 50, corruption: 10 };
    const stabilityFactor = (govStats.stability || 50) / 100; // 0.0 - 1.0
    const corruptionFactor = (govStats.corruption || 10) / 100; // 0.0 - 1.0
    const govBonus = 1 + (stabilityFactor * 0.2) - (corruptionFactor * 0.5); // Up to +20%, down to -50%

    // Add Config Multiplier
    const configBonus = config?.resourceRate || 1;

    const totalBonus = logisticsBonus * govBonus * configBonus;

    const metalProd = 30 * buildings.metalMine * Math.pow(1.1, buildings.metalMine) * totalBonus;
    const crystalProd = 20 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine) * totalBonus;
    const deutProd = 10 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer) * totalBonus;
    const energyProd = 20 * buildings.solarPlant * Math.pow(1.1, buildings.solarPlant);
    
    const metalCons = 10 * buildings.metalMine * Math.pow(1.1, buildings.metalMine);
    const crystalCons = 10 * buildings.crystalMine * Math.pow(1.1, buildings.crystalMine);
    const deutCons = 20 * buildings.deuteriumSynthesizer * Math.pow(1.1, buildings.deuteriumSynthesizer);
    
    const energyUsed = metalCons + crystalCons + deutCons;

    return {
      metal: metalProd / 3600,
      crystal: crystalProd / 3600,
      deuterium: deutProd / 3600,
      energy: energyProd - energyUsed
    };
  };

  // Main Game Loop (Visual interpolation between server ticks)
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      const now = Date.now();
      const production = getProduction();
      const speedMult = config?.gameSpeed || 1;
      tickCount++;

      // 1. Resource Production (Visual interpolation only)
      setResources(prev => ({
        ...prev,
        metal: prev.metal + (production.metal * speedMult),
        crystal: prev.crystal + (production.crystal * speedMult),
        deuterium: prev.deuterium + (production.deuterium * speedMult),
        energy: production.energy
      }));

      // 2. Refresh state every 30 seconds as fallback
      if (tickCount >= 30) {
        syncTickMutation.mutate();
        tickCount = 0;
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [buildings, commander, government, config, research]);

  const addEvent = (title: string, description: string, type: GameEvent["type"]) => {
    setEvents(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 10));
  };

  const updateBuilding = async (building: keyof Buildings, name: string, time: number = 5000) => {
    const turnCost = 2; // 2 turns per building

    if (!await spendTurns(turnCost)) return;

    try {
      // Call backend API to build
      const response = await apiRequest("POST", "/api/game/build", {
        building: building,
        level: (buildings[building] || 0) + 1
      });
      
      if (response.success) {
        // Update local state based on response
        setResources(normalizeResources(response.resources, resources));
        setBuildings(response.buildings || buildings);
        
        const adjustedTime = (time * Math.pow(1.15, buildings[building] || 0)) / (config?.gameSpeed || 1);
        const now = Date.now();
        setQueue(prev => [...prev, {
          id: building,
          name: name,
          startTime: now,
          endTime: now + adjustedTime,
          type: "building",
          itemId: building
        }]);
        
        addEvent("Build Started", `Construction of ${name} started`, "success");
      } else {
        setCurrentTurns(prev => prev + turnCost);
        addEvent("Build Failed", response.error || "Failed to start construction", "danger");
      }
    } catch (error) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Build Error", "Server error occurred", "danger");
    }
  };

  const updateResearch = async (tech: string, name: string, time: number = 5000) => {
     const turnCost = 3; // 3 turns per research
     if (!await spendTurns(turnCost)) return;
     
     const currentLevel = research[tech] || 0;
     const adjustedTime = (time * Math.pow(1.2, currentLevel)) / (config?.gameSpeed || 1);
     const now = Date.now();

     startResearchMutation.mutate(tech);

     setQueue(prev => [...prev, {
        id: tech,
        name: name,
        startTime: now,
        endTime: now + adjustedTime,
        type: "research",
        itemId: tech
      }]);
  };

  const buildUnit = async (unitId: string, amount: number, name: string, time: number = 2000) => {
    const turnCost = amount; // 1 turn per unit
    if (!await spendTurns(turnCost)) return;
    
    try {
      // Call backend API to build ships
      const response = await apiRequest("POST", "/api/game/build-ships", {
        shipType: unitId,
        quantity: amount
      });
      
      if (response.success) {
        // Update local state based on response
        setResources(normalizeResources(response.resources, resources));
        setUnits(response.units || units);
        
        const adjustedTime = (time * amount) / (config?.gameSpeed || 1);
        const now = Date.now();
        setQueue(prev => [...prev, {
          id: unitId,
          name: name,
          startTime: now,
          endTime: now + adjustedTime,
          type: "unit",
          amount,
          itemId: unitId
        }]);
        
        addEvent("Ships Constructed", `${amount}x ${name} built successfully`, "success");
      } else {
        setCurrentTurns(prev => prev + turnCost);
        addEvent("Build Failed", response.error || "Failed to build ships", "danger");
      }
    } catch (error) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Build Error", "Server error occurred", "danger");
    }
  };

  const constructMegastructure = async (templateId: string, name: string, time: number = 3600000) => {
    const turnCost = 100;
    if (!await spendTurns(turnCost)) return;

    const template = getMegaStructureTemplateById(templateId);
    if (!template) {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Construction Failed", "Megastructure template not found.", "danger");
      return;
    }

    const cost = calculateConstructionCost(template, template.level, template.tier);

    if (
      resources.metal >= cost.metal &&
      resources.crystal >= cost.crystal &&
      resources.deuterium >= cost.deuterium &&
      resources.energy >= cost.energy
    ) {
      setResources(prev => ({
        ...prev,
        metal: prev.metal - cost.metal,
        crystal: prev.crystal - cost.crystal,
        deuterium: prev.deuterium - cost.deuterium,
        energy: prev.energy - cost.energy,
      }));

      const adjustedTime = time / (config?.gameSpeed || 1);
      const now = Date.now();
      setQueue(prev => [...prev, {
        id: templateId,
        name: name,
        startTime: now,
        endTime: now + adjustedTime,
        type: "megastructure",
        itemId: templateId
      }]);
      addEvent("Mega-Project Started", `Construction of the ${name} has begun.`, "success");
    } else {
      setCurrentTurns(prev => prev + turnCost);
      addEvent("Construction Failed", "Insufficient resources to start the megastructure.", "danger");
    }
  };

  const equipItem = (item: Item) => {
    if (item.type === "blueprint" || item.type === "material") return;
    
    setCommander(prev => {
      const slot = item.type as "weapon" | "armor" | "module";
      const currentEquip = prev.equipment[slot];
      const newInventory = prev.inventory.filter(i => i.id !== item.id);
      if (currentEquip) newInventory.push(currentEquip);
      
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: newInventory
      };
    });
  };

  const unequipItem = (slot: "weapon" | "armor" | "module") => {
    setCommander(prev => {
      const item = prev.equipment[slot];
      if (!item) return prev;
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: [...prev.inventory, item]
      };
    });
  };

  const craftItem = (item: Item, cost: {metal: number, crystal: number, deuterium?: number}) => {
     if (resources.metal >= cost.metal && resources.crystal >= cost.crystal && (!cost.deuterium || resources.deuterium >= cost.deuterium)) {
        setResources(prev => ({
           ...prev,
           metal: prev.metal - cost.metal,
           crystal: prev.crystal - cost.crystal,
           deuterium: prev.deuterium - (cost.deuterium || 0)
        }));
        setCommander(prev => ({
           ...prev,
           inventory: [...prev.inventory, item]
        }));
        addEvent("Crafting Complete", `Created ${item.name}`, "success");
     } else {
        toast({ title: "Insufficient Resources", description: "Not enough materials to craft this item.", variant: "destructive" });
     }
  };

  const temperItem = (itemId: string) => {
     if (resources.metal >= 1000) {
        setResources(prev => ({ ...prev, metal: prev.metal - 1000 }));
        setCommander(prev => ({
           ...prev,
           inventory: prev.inventory.map(i => i.id === itemId ? { ...i, tempering: (i.tempering || 0) + 1 } : i),
           equipment: {
              weapon: prev.equipment.weapon?.id === itemId ? { ...prev.equipment.weapon, tempering: (prev.equipment.weapon.tempering || 0) + 1 } : prev.equipment.weapon,
              armor: prev.equipment.armor?.id === itemId ? { ...prev.equipment.armor, tempering: (prev.equipment.armor.tempering || 0) + 1 } : prev.equipment.armor,
              module: prev.equipment.module?.id === itemId ? { ...prev.equipment.module, tempering: (prev.equipment.module.tempering || 0) + 1 } : prev.equipment.module,
           }
        }));
        addEvent("Tempering Success", "Item improved successfully.", "success");
     }
  };

  const setCommanderIdentity = (race: RaceId, cls: ClassId, subClass: SubClassId | null) => {
    setCommander(prev => ({ ...prev, race, class: cls, subClass }));
    addEvent("Identity Updated", `Commander identity re-sequenced to ${RACES[race].name} ${CLASSES[cls].name}.`, "info");
  };

  const upgradeCommanderSkill = (skill: "warfare" | "logistics" | "science" | "engineering") => {
    const level = commander?.stats?.level || 1;
    const current = commander?.stats?.[skill] || 1;
    const allocated = Math.max(0, (commander?.stats?.warfare || 1) - 1)
      + Math.max(0, (commander?.stats?.logistics || 1) - 1)
      + Math.max(0, (commander?.stats?.science || 1) - 1)
      + Math.max(0, (commander?.stats?.engineering || 1) - 1);
    const totalPoints = Math.max(0, (level - 1) * 2);
    const availablePoints = Math.max(0, totalPoints - allocated);

    if (current >= 10) {
      toast({ title: "Skill maxed", description: "This skill is already at maximum level.", variant: "destructive" });
      return false;
    }

    if (availablePoints <= 0) {
      toast({ title: "No skill points", description: "Gain commander levels to unlock more skill points.", variant: "destructive" });
      return false;
    }

    setCommander((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [skill]: (prev.stats[skill] || 1) + 1,
      },
    }));

    addEvent("Skill Upgraded", `${skill[0].toUpperCase()}${skill.slice(1)} increased to ${current + 1}.`, "success");
    return true;
  };

  const setGovernmentType = (type: GovernmentId) => {
     setGovernment(prev => {
        const newBase = GOVERNMENTS[type].baseStats;
        return {
           ...prev,
           type,
           stats: {
              ...prev.stats,
              stability: newBase.stability,
              efficiency: newBase.efficiency,
              militaryReadiness: newBase.military
           }
        };
     });
     addEvent("Revolution", `Government reformed into ${GOVERNMENTS[type].name}.`, "warning");
  };

  const completeSetup = async (newCommander: CommanderState, newGovernment: GovernmentState) => {
    try {
      await saveGameStateMutation.mutateAsync({ 
        commander: newCommander, 
        government: newGovernment,
        setupComplete: true 
      });
      setCommander(newCommander);
      setGovernment(newGovernment);
      setNeedsSetup(false);
    } catch (error) {
      console.error("Failed to complete setup:", error);
      throw error;
    }
  };

  const togglePolicy = (policyId: string) => {
     setGovernment(prev => {
        const isActive = prev.policies.includes(policyId);
        return {
           ...prev,
           policies: isActive ? prev.policies.filter(p => p !== policyId) : [...prev.policies, policyId]
        };
     });
  };

  const setTaxRate = (rate: number) => {
     setGovernment(prev => ({ ...prev, taxRate: rate }));
  };

  const spendTurns = async (amount: number): Promise<boolean> => {
    if (currentTurns < amount) {
      addEvent("Insufficient Turns", `Need ${amount} turn(s), have ${currentTurns}`, "warning");
      return false;
    }

    try {
      const response = await apiRequest("POST", "/api/turns/spend", { amount });
      if (response.success) {
        setCurrentTurns(response.currentTurns);
        addEvent("Turns Spent", `Used ${amount} turn(s) for action`, "info");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to spend turns:", error);
      return false;
    }
  };

  const dispatchFleet = (missionData: Omit<Mission, "id" | "status" | "returnTime">) => {
     const flightTime = missionData.arrivalTime / (config?.fleetSpeed || 1);
     const now = Date.now();
     
     const arrivalTime = new Date(now + flightTime);
     const returnTime = new Date(now + (flightTime * 2));
     
     const backendMission = {
        type: missionData.type,
        target: missionData.target,
        origin: coordinates,
        units: missionData.units,
        departureTime: new Date(now),
        arrivalTime: arrivalTime,
        returnTime: returnTime,
        status: "outbound"
     };

     createMissionMutation.mutate(backendMission);
     
     setUnits(prev => {
        const newUnits = {...prev};
        Object.entries(missionData.units).forEach(([id, count]) => {
           newUnits[id] = Math.max(0, (newUnits[id] || 0) - count);
        });
        return newUnits;
     });

     addEvent("Fleet Dispatched", `Fleet sent to ${missionData.target} on ${missionData.type} mission.`, "info");
  };

  const processMissions = () => {
    processMissionsMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        if (data.completedCount > 0) {
          addEvent("Missions Completed", `${data.completedCount} mission(s) completed. Resources gained!`, "success");
        }
      },
      onError: (error: any) => {
        addEvent("Mission Processing Error", `Failed to process missions: ${error.message}`, "danger");
      }
    });
  };

  const updateConfig = (newConfig: Partial<GameConfig>) => {
     setConfig(prev => ({ ...prev, ...newConfig }));
     addEvent("System Update", "Server configuration parameters updated.", "warning");
  };

  const sendMessage = (to: string, subject: string, body: string) => {
     sendMessageMutation.mutate({
       toUserId: to,
       to: to,
       subject,
       body,
       type: "player"
     });
     addEvent("Message Sent", `Communique dispatched to ${to}.`, "success");
  };

  const markMessageRead = (id: string) => {
     markMessageReadMutation.mutate(id);
     setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
     deleteMessageMutation.mutate(id);
     setMessages(prev => prev.filter(m => m.id !== id));
  };

  const createAlliance = (name: string, tag: string) => {
     createAllianceMutation.mutate({ name, tag, description: "A new power rises." });
     addEvent("Alliance Formed", `You have founded the ${name} [${tag}].`, "success");
  };

  const joinAlliance = (id: string) => {
     joinAllianceMutation.mutate(id);
     addEvent("Alliance Joined", `You have joined an alliance.`, "success");
  };

  const leaveAlliance = () => {
     if (alliance?.id) {
       leaveAllianceMutation.mutate(alliance.id);
     }
     setAlliance(null);
     addEvent("Alliance Left", "You have left your alliance.", "warning");
  };

  const activateArtifact = (id: string) => {
     const artifact = artifacts.find(a => a.id === id);
     if (artifact && artifact.type === "active") {
        // Check cooldown
        const now = Date.now();
        if (artifact.lastUsed && now - artifact.lastUsed < (artifact.cooldown || 0)) {
           toast({ title: "Artifact on Cooldown", description: `${artifact.name} is not ready yet.`, variant: "destructive" });
           return;
        }
        
        // Apply effect
        setArtifacts(prev => prev.map(a => a.id === id ? { ...a, lastUsed: now } : a));
        addEvent("Artifact Activated", `${artifact.name} activated.`, "success");
        
        // Mock effect implementation (e.g. chronos device)
        if (id === "chronos_device") {
           setQueue(prev => {
              // Finish all construction immediately
              const finished = prev.map(q => ({ ...q, endTime: now }));
              // Effect will happen in next tick
              return finished;
           });
        }
     }
  };

  const toggleCronJob = (id: string) => {
    setCronJobs(prev => prev.map(j => j.id === id ? { ...j, enabled: !j.enabled } : j));
  };

  const login = async () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Logout API failed", e);
    }
    setIsLoggedIn(false);
    setUsername("");
    setIsInitialized(false);
    localStorage.removeItem('stellar_username');
    localStorage.removeItem('stellar_password');
    window.location.href = '/';
  };

  const toggleAdmin = () => {
    if (!isActualAdmin) {
       addEvent("Access Denied", "You do not have administrator privileges.", "danger");
       return;
    }
    setIsAdmin(prev => !prev);
    if (!isAdmin) {
       addEvent("System Access", "Administrator mode activated.", "warning");
    } else {
       addEvent("System Access", "Switched to user view mode.", "info");
    }
  };

  const runCronJob = (id: string) => {
    const job = cronJobs.find(j => j.id === id);
    if (job) {
       addEvent("Manual Job Trigger", `Manually triggered ${job.name}`, "info");
       setCronJobs(prev => prev.map(j => j.id === id ? { ...j, lastRun: Date.now() } : j));
    }
  };

  const travelTo = (destinationName: string, coords: string, cost: { deuterium: number }) => {
    if (resources.deuterium >= cost.deuterium) {
       setResources(prev => ({ ...prev, deuterium: prev.deuterium - cost.deuterium }));
       setPlanetName(destinationName);
       setCoordinates(coords);
       addEvent("Hyperspace Jump", `Fleet successfully jumped to ${destinationName} [${coords}].`, "success");
    } else {
       toast({ title: "Insufficient Deuterium", description: "Not enough deuterium for this hyperspace jump.", variant: "destructive" });
    }
  };

  // Simple loading state: only show loading during initial auth check and game-state bootstrap.
  const isLoading = authLoading || (Boolean(authUser) && gameStateLoading && !isInitialized);

  return (
    <GameContext.Provider value={{ 
       resources, 
       buildings, 
       orbitalBuildings,
       activeBase,
       setActiveBase,
       research,
       units,
       megastructures,
       commander,
       government,
       planetName,
       coordinates, 
       events,
       queue,
       activeMissions,
       config,
       messages,
       alliance,
       artifacts,
       cronJobs,
       isAdmin,
       isActualAdmin,
       adminRole,
       isLoggedIn,
       needsSetup,
       isLoading,
       username,
       login,
       logout,
       toggleAdmin,
       updateBuilding,
       updateResearch,
       buildUnit,
       constructMegastructure,
       addEvent,
       equipItem,
       unequipItem,
       craftItem,
       temperItem,
       setCommanderIdentity,
      upgradeCommanderSkill,
       setGovernmentType,
       completeSetup,
       togglePolicy,
       setTaxRate,
       dispatchFleet,
       updateConfig,
       sendMessage,
       markMessageRead,
       deleteMessage,
       createAlliance,
       joinAlliance,
       leaveAlliance,
       activateArtifact,
       toggleCronJob,
       runCronJob,
       travelTo,
       inventory,
       buyItem,
       sellItem,
       totalTurns,
       currentTurns,
       spendTurns,
       processMissions,
       completeResearch: completeResearchMutation.mutate,
       processQueue: processQueueMutation.mutate
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
