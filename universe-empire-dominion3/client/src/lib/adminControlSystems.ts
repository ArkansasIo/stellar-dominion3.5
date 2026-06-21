export type AdminSubsystemId =
  | "command"
  | "moderation"
  | "security"
  | "liveops"
  | "content"
  | "developer"
  | "audit";

export interface AdminFeatureDefinition {
  id: string;
  name: string;
  description: string;
  functionLabel: string;
  logic: string;
}

export interface AdminSubMenuDefinition {
  id: string;
  label: string;
  pageTitle: string;
  description: string;
  functions: string[];
}

export interface AdminSubsystemDefinition {
  id: AdminSubsystemId;
  name: string;
  menuLabel: string;
  pageTitle: string;
  description: string;
  subMenus: AdminSubMenuDefinition[];
  featureIds: string[];
}

export interface AdminControlPlaneState {
  featureFlags: {
    adminBroadcastEnabled: boolean;
    allowMasquerade: boolean;
    advancedWorldTools: boolean;
    liveOpsOverridesEnabled: boolean;
    incidentLockdownEnabled: boolean;
    auditStreamVisible: boolean;
  };
  security: {
    threatLevel: "guarded" | "elevated" | "critical";
    commandApprovalMode: "single" | "dual" | "founder";
    privilegedSessionTimeoutMinutes: number;
    auditRetentionDays: number;
  };
  broadcast: {
    title: string;
    body: string;
    severity: "info" | "warning" | "critical";
    audience: "all" | "admins" | "active-players";
    enabled: boolean;
  };
  liveOps: {
    eventPreset: "standard" | "boosted" | "war-economy" | "recovery";
    dropRateModifier: number;
    upkeepModifier: number;
    buildRateModifier: number;
    turnMultiplier: number;
  };
  support: {
    ticketQueueMode: "manual" | "triage" | "priority";
    escalationPolicy: "standard" | "fast-track" | "founder-review";
    playerVisibility: "summary" | "detailed";
  };
}

export const DEFAULT_ADMIN_CONTROL_PLANE_STATE: AdminControlPlaneState = {
  featureFlags: {
    adminBroadcastEnabled: true,
    allowMasquerade: true,
    advancedWorldTools: true,
    liveOpsOverridesEnabled: false,
    incidentLockdownEnabled: false,
    auditStreamVisible: true,
  },
  security: {
    threatLevel: "guarded",
    commandApprovalMode: "single",
    privilegedSessionTimeoutMinutes: 45,
    auditRetentionDays: 30,
  },
  broadcast: {
    title: "Operations Nominal",
    body: "Admin systems online. No action required.",
    severity: "info",
    audience: "all",
    enabled: false,
  },
  liveOps: {
    eventPreset: "standard",
    dropRateModifier: 100,
    upkeepModifier: 100,
    buildRateModifier: 100,
    turnMultiplier: 100,
  },
  support: {
    ticketQueueMode: "triage",
    escalationPolicy: "standard",
    playerVisibility: "summary",
  },
};

export const ADMIN_FEATURES: Record<string, AdminFeatureDefinition> = {
  sessionLock: {
    id: "sessionLock",
    name: "Privileged Session Lock",
    description: "Controls timeout and approval strictness for elevated actions.",
    functionLabel: "Session timeout and approval routing",
    logic: "Higher threat levels should shrink privileged session windows and raise approval requirements.",
  },
  broadcast: {
    id: "broadcast",
    name: "Broadcast Banner",
    description: "Pushes system-wide admin messages to active players and administrators.",
    functionLabel: "Global operations messaging",
    logic: "Broadcasts should be disabled automatically when the content is empty or the feature flag is off.",
  },
  liveOps: {
    id: "liveOps",
    name: "LiveOps Override Matrix",
    description: "Adjusts rate modifiers and event posture without editing core server settings.",
    functionLabel: "Temporary live economy and event control",
    logic: "Overrides should be additive control-plane changes that can be disabled cleanly.",
  },
  support: {
    id: "support",
    name: "Support Routing",
    description: "Controls support queue visibility and escalation pathways.",
    functionLabel: "Triage and escalation logic",
    logic: "Priority or founder-review escalation should only be used when the threat posture or workload justifies it.",
  },
  masquerade: {
    id: "masquerade",
    name: "Masquerade Guard",
    description: "Controls whether admin impersonation and deep world tools remain enabled.",
    functionLabel: "Developer and support access guardrails",
    logic: "Masquerade and world editing are high-risk tools and should be disabled during incidents when needed.",
  },
  audit: {
    id: "audit",
    name: "Audit Stream",
    description: "Controls audit visibility and retention posture.",
    functionLabel: "Operational accountability",
    logic: "Audit visibility should stay enabled during incidents and retention should expand for higher-risk operations.",
  },
};

export const ADMIN_SUBSYSTEMS: AdminSubsystemDefinition[] = [
  {
    id: "command",
    name: "Command Plane",
    menuLabel: "Command",
    pageTitle: "Admin Command Plane",
    description: "Top-level admin status, system posture, and command routing.",
    featureIds: ["sessionLock", "broadcast"],
    subMenus: [
      { id: "overview", label: "Overview", pageTitle: "Control Overview", description: "High-level command posture and active admin state.", functions: ["Role visibility", "Threat display", "Control summary"] },
      { id: "broadcast", label: "Broadcast", pageTitle: "Broadcast Center", description: "Administrative banner and incident messaging tools.", functions: ["Banner title", "Severity", "Audience routing"] },
    ],
  },
  {
    id: "moderation",
    name: "Moderation Systems",
    menuLabel: "Moderation",
    pageTitle: "Moderation Control",
    description: "User status, access review, and moderation action routing.",
    featureIds: ["support", "audit"],
    subMenus: [
      { id: "users", label: "Users", pageTitle: "User Control Grid", description: "Player moderation actions and account visibility.", functions: ["Mute", "Ban", "Status review"] },
      { id: "accounts", label: "Accounts", pageTitle: "Admin Accounts", description: "Administrator role creation and access management.", functions: ["Grant role", "Revoke role", "Permission review"] },
    ],
  },
  {
    id: "security",
    name: "Security Systems",
    menuLabel: "Security",
    pageTitle: "Security Posture",
    description: "Threat level, approval posture, and privileged access constraints.",
    featureIds: ["sessionLock", "masquerade", "audit"],
    subMenus: [
      { id: "posture", label: "Posture", pageTitle: "Threat Posture", description: "Threat level and admin approval mode controls.", functions: ["Threat level", "Approval mode", "Retention policy"] },
      { id: "guardrails", label: "Guardrails", pageTitle: "Tool Guardrails", description: "World tools, masquerade, and audit feature flags.", functions: ["Masquerade gate", "World tools gate", "Audit stream"] },
    ],
  },
  {
    id: "liveops",
    name: "LiveOps Systems",
    menuLabel: "LiveOps",
    pageTitle: "LiveOps Matrix",
    description: "Temporary event presets and rate modifiers above baseline server settings.",
    featureIds: ["liveOps", "broadcast"],
    subMenus: [
      { id: "rates", label: "Rates", pageTitle: "Rate Override Matrix", description: "Build, drop, upkeep, and turn modifier controls.", functions: ["Rate multipliers", "Preset selection", "Override enablement"] },
      { id: "events", label: "Events", pageTitle: "Event Posture", description: "Current event posture and associated communication.", functions: ["Preset profile", "Recovery mode", "War-economy mode"] },
    ],
  },
  {
    id: "content",
    name: "Content Systems",
    menuLabel: "Content",
    pageTitle: "Rules and Content",
    description: "Rules, legal text, contact flows, and policy copy.",
    featureIds: ["broadcast", "support"],
    subMenus: [
      { id: "legal", label: "Legal", pageTitle: "Rules and Legal Editors", description: "Rules, legal, privacy, terms, and contact content.", functions: ["Rules editor", "Policy editor", "Contact editor"] },
      { id: "messaging", label: "Messaging", pageTitle: "Messaging Content", description: "System messaging and admin communication templates.", functions: ["Banner content", "Audience targeting", "Severity copy"] },
    ],
  },
  {
    id: "developer",
    name: "Developer Systems",
    menuLabel: "Developer",
    pageTitle: "Developer Shortcut Systems",
    description: "Masquerade, grants, presets, and world object functions.",
    featureIds: ["masquerade", "liveOps"],
    subMenus: [
      { id: "shortcuts", label: "Shortcuts", pageTitle: "Developer Shortcuts", description: "Impersonation, grants, presets, and reset actions.", functions: ["Masquerade", "Preset apply", "State edits"] },
      { id: "world-tools", label: "World Tools", pageTitle: "World Object Tools", description: "Planet, moon, and debris object creation tools.", functions: ["Create object", "Delete object", "Recent object audit"] },
    ],
  },
  {
    id: "audit",
    name: "Audit Systems",
    menuLabel: "Audit",
    pageTitle: "Audit and History",
    description: "Administrative action history and operational accountability.",
    featureIds: ["audit", "support"],
    subMenus: [
      { id: "audit-log", label: "Audit Log", pageTitle: "Audit History", description: "Timeline of admin actions and state changes.", functions: ["Actor review", "Target review", "Detail review"] },
      { id: "operations", label: "Operations", pageTitle: "Operation Queue", description: "Queued backups, restarts, resets, and system operations.", functions: ["Operation review", "Queue status", "Completion history"] },
    ],
  },
];

export function getAdminSubsystemById(id: AdminSubsystemId) {
  return ADMIN_SUBSYSTEMS.find((subsystem) => subsystem.id === id);
}

export function buildAdminControlSummary(state: AdminControlPlaneState) {
  return {
    guardedFeatures: [
      state.featureFlags.allowMasquerade ? "Masquerade enabled" : "Masquerade locked",
      state.featureFlags.advancedWorldTools ? "World tools enabled" : "World tools locked",
      state.featureFlags.auditStreamVisible ? "Audit stream visible" : "Audit stream hidden",
    ],
    incidentState: state.featureFlags.incidentLockdownEnabled ? "Lockdown" : "Normal",
    liveOpsState: state.featureFlags.liveOpsOverridesEnabled ? "Overrides Active" : "Baseline Rates",
    broadcastState: state.broadcast.enabled ? `${state.broadcast.severity} banner live` : "No live banner",
  };
}
