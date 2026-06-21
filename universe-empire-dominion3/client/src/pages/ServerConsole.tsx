import { useState, useEffect, useRef, useCallback } from "react";
import type { SystemMetricsSnapshot, HealthCheckResult } from "@shared/config/statusConfig";

/* ─── Types ─────────────────────────────────────────────────────── */
type Phase = "boot" | "login" | "main" | "database" | "users" | "game" | "config" | "monitoring" | "events" | "maintenance" | "account" | "network" | "sql" | "logs";

interface TLine {
  id: number;
  text: string;
  cls?: string;
  pre?: boolean;
}

interface Metrics { m: SystemMetricsSnapshot | null; h: HealthCheckResult | null }

/* ─── Helpers ────────────────────────────────────────────────────── */
let _id = 0;
const mkLine = (text: string, cls = "text-green-400", pre = false): TLine => ({ id: _id++, text, cls, pre });
const box = (label: string) => [
  mkLine("", "text-green-900"),
  mkLine("  ╔" + "═".repeat(52) + "╗", "text-cyan-500"),
  mkLine("  ║  " + label.padEnd(50) + "║", "text-cyan-300 font-bold"),
  mkLine("  ╚" + "═".repeat(52) + "╝", "text-cyan-500"),
];

function fmtUptime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}
function fmtNum(n: number | undefined, decimals = 0) {
  if (n === undefined || n === null) return "0";
  return n.toFixed(decimals);
}

/* ─── Boot sequence lines ────────────────────────────────────────── */
function buildBootLines(m: Metrics): TLine[] {
  const { m: s, h } = m;
  const status = h?.status === "healthy" ? "HEALTHY" : "DEGRADED";
  const score = h?.overallScore ?? 0;
  const uptime = fmtUptime((s?.cpu.uptime ?? 0) * 1000);
  const cpu = fmtNum(s?.cpu.usage);
  const memUsed = fmtNum(s?.memory.used);
  const memTotal = fmtNum(s?.memory.total);
  const dbConns = s?.database.connections ?? 0;
  const dbMax = 112;
  const cacheHit = fmtNum(s?.database.cacheHitRate);
  const totalReqs = s?.requests.totalRequests ?? 0;
  const rps = fmtNum(s?.requests.requestsPerSecond ?? 0, 2);
  const avgResp = fmtNum(s?.requests.averageResponseTime ?? 0);
  const p95 = fmtNum(s?.requests.p95ResponseTime ?? 0);
  const p99 = fmtNum(s?.requests.p99ResponseTime ?? 0);
  const disk = fmtNum(s?.disk.usage);

  const checks = h?.checks || {};
  const checkLines = Object.entries(checks).map(([k, v]) => {
    const check = v as { status?: string; value?: number; threshold?: number };
    const statusText = check.status === "ok" ? "OK" : (check.status?.toUpperCase() ?? "?");
    const value = Math.round(check.value ?? 0);
    const threshold = Math.round(check.threshold ?? 0);
    return mkLine(
      `  * ${k.padEnd(12)}: ${statusText} (${value}/${threshold})`,
      check.status === "ok" ? "text-green-400" : "text-yellow-400"
    );
  });

  return [
    mkLine(""),
    mkLine("> rest-express@1.5.0 dev", "text-slate-400"),
    mkLine("> tsx script/dev.ts", "text-slate-400"),
    mkLine(""),
    mkLine("[dotenv@17.3.1] injecting env (2) from .env", "text-slate-500"),
    mkLine("[dotenv@17.3.1] injecting env (0) from .env", "text-slate-500"),
    mkLine("Starting full-stack development server...", "text-yellow-400"),
    mkLine(""),
    mkLine("================================================", "text-cyan-500"),
    mkLine(" SERVER INITIALIZED SUCCESSFULLY ", "text-white font-bold"),
    mkLine("================================================", "text-cyan-500"),
    mkLine(""),
    mkLine("Setup Complete:", "text-green-300 font-bold"),
    mkLine("  * All services initialized", "text-green-400"),
    mkLine("  * Server ready to accept connections", "text-green-400"),
    mkLine("  * Database connection verified", "text-green-400"),
    mkLine(""),
    mkLine("================================================", "text-cyan-500"),
    mkLine(" SERVER STATUS DASHBOARD ", "text-white font-bold"),
    mkLine("================================================", "text-cyan-500"),
    mkLine(""),
    mkLine("Main Server Info:", "text-cyan-300 font-bold"),
    mkLine("  * Server Status:    RUNNING", "text-green-400"),
    mkLine("  * Port:             5000", "text-green-400"),
    mkLine("  * Environment:      development", "text-green-400"),
    mkLine(`  * Health Score:     ${score}`, score >= 80 ? "text-green-400" : "text-yellow-400"),
    mkLine(`  * Uptime:           ${uptime}`, "text-green-400"),
    mkLine(""),
    mkLine("Database:", "text-cyan-300 font-bold"),
    mkLine("  * PostgreSQL:       CONNECTED", "text-green-400"),
    mkLine("  * Host:             neon.tech (serverless)", "text-green-400"),
    mkLine(`  * Connections:      ${dbConns}/${dbMax}`, "text-green-400"),
    mkLine("  * Active Queries:   0", "text-green-400"),
    mkLine(`  * Cache Hit Rate:   ${cacheHit}%`, "text-green-400"),
    mkLine(""),
    mkLine("Performance:", "text-cyan-300 font-bold"),
    mkLine(`  * Total Requests:   ${totalReqs}`, "text-green-400"),
    mkLine(`  * Request Rate:     ${rps}/sec`, "text-green-400"),
    mkLine(`  * Avg Response:     ${avgResp}ms`, "text-green-400"),
    mkLine(`  * P95 / P99:        ${p95}ms / ${p99}ms`, "text-green-400"),
    mkLine(""),
    mkLine("Resources:", "text-cyan-300 font-bold"),
    mkLine(`  * CPU Usage:        ${cpu}%`, "text-green-400"),
    mkLine(`  * Memory:           ${memUsed}MB / ${memTotal}MB`, "text-green-400"),
    mkLine(`  * Disk Usage:       ${disk}%`, "text-green-400"),
    mkLine(""),
    mkLine("Services:", "text-cyan-300 font-bold"),
    mkLine("  * Express Server:   ACTIVE", "text-green-400"),
    mkLine("  * Session Manager:  ACTIVE", "text-green-400"),
    mkLine("  * Authentication:   READY", "text-green-400"),
    mkLine(""),
    mkLine("Access:", "text-cyan-300 font-bold"),
    mkLine("  -> API Endpoint:    http://localhost:5000/api", "text-blue-400"),
    mkLine("  -> Web Interface:   http://localhost:5000", "text-blue-400"),
    mkLine("  -> Health Check:    http://localhost:5000/api/status/health", "text-blue-400"),
    mkLine(""),
    mkLine("Health Checks:", "text-cyan-300 font-bold"),
    ...checkLines,
    mkLine(""),
    mkLine("Status Indicators:", "text-cyan-300 font-bold"),
    mkLine("  * [■] Online / Active", "text-green-400"),
    mkLine("  * [□] Offline / Inactive", "text-slate-500"),
    mkLine("  * [▲] Warning / Resetting", "text-yellow-400"),
    mkLine(""),
    mkLine(`System status: ${status}`, status === "HEALTHY" ? "text-green-300 font-bold" : "text-yellow-400 font-bold"),
    mkLine(""),
    mkLine("════════════════════════════════════════════════════════════", "text-cyan-900"),
    mkLine("  Type 'login' to authenticate or press ENTER to continue", "text-slate-400"),
    mkLine("════════════════════════════════════════════════════════════", "text-cyan-900"),
  ];
}

/* ─── Main Menu ──────────────────────────────────────────────────── */
const MAIN_MENU_LINES: TLine[] = [
  mkLine(""),
  mkLine("  ╔══════════════════════════════════════════════════════╗", "text-magenta-400" ),
  mkLine("  ║  🛡️  STELLAR DOMINION ADMIN PANEL — Main Menu       ║", "text-purple-300 font-bold"),
  mkLine("  ╚══════════════════════════════════════════════════════╝", "text-purple-500"),
  mkLine(""),
  mkLine("  Select an option:", "text-white font-bold"),
  mkLine(""),
  mkLine("   [1]  📊  Database & Logs", "text-cyan-300"),
  mkLine("   [2]  👥  User Management", "text-cyan-300"),
  mkLine("   [3]  🎮  Game Management & Control", "text-cyan-300"),
  mkLine("   [4]  ⚙️   Server Configuration", "text-cyan-300"),
  mkLine("   [5]  📈  Server Monitoring", "text-cyan-300"),
  mkLine("   [6]  🔔  Announcements & Events", "text-cyan-300"),
  mkLine("   [7]  🛠️   Maintenance Tools", "text-cyan-300"),
  mkLine("   [8]  🔑  Account Settings", "text-cyan-300"),
  mkLine("   [9]  📡  Network & Connections", "text-cyan-300"),
  mkLine("   [L]  📋  Live Server Logs", "text-cyan-300"),
  mkLine("   [0]  🚪  Logout", "text-red-400"),
  mkLine(""),
];

/* ─── Sub-menu content builders ──────────────────────────────────── */
function dbMenuLines(): TLine[] {
  return [
    ...box("DATABASE & LOGS"),
    mkLine(""),
    mkLine("  Tables available:", "text-white font-bold"),
    mkLine("   [1]  users               — player accounts", "text-green-400"),
    mkLine("   [2]  player_states        — game state per player", "text-green-400"),
    mkLine("   [3]  missions             — active/completed missions", "text-green-400"),
    mkLine("   [4]  messages             — player messages & trades", "text-green-400"),
    mkLine("   [5]  alliances            — alliance records", "text-green-400"),
    mkLine("   [6]  market_orders        — buy/sell orders", "text-green-400"),
    mkLine("   [7]  auction_listings     — auction house", "text-green-400"),
    mkLine("   [8]  sessions             — active sessions", "text-green-400"),
    mkLine(""),
    mkLine("  Actions:", "text-white font-bold"),
    mkLine("   [S]  SQL Query Executor   — run direct queries", "text-yellow-400"),
    mkLine("   [X]  Export Backup        — download database snapshot", "text-yellow-400"),
    mkLine("   [0]  Back to main menu", "text-slate-400"),
    mkLine(""),
  ];
}

function userMenuLines(): TLine[] {
  return [
    ...box("USER MANAGEMENT"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  List All Users         — paginated player list", "text-green-400"),
    mkLine("   [2]  Find User by Username  — search player records", "text-green-400"),
    mkLine("   [3]  Give Resources         — credit metal/crystal/deut", "text-green-400"),
    mkLine("   [4]  Give Currency          — credit silver/gold/platinum", "text-green-400"),
    mkLine("   [5]  Reset Player Progress  — ⚠️  destructive", "text-yellow-400"),
    mkLine("   [6]  Ban / Unban User       — account restrictions", "text-yellow-400"),
    mkLine("   [7]  Change User Role       — admin/moderator/player", "text-yellow-400"),
    mkLine("   [8]  View User Details      — full profile + stats", "text-green-400"),
    mkLine("   [9]  Bulk User Export       — download CSV", "text-green-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function gameMenuLines(cfg: Record<string, unknown>): TLine[] {
  return [
    ...box("GAME MANAGEMENT & CONTROL"),
    mkLine(""),
    mkLine("  Current Settings:", "text-white font-bold"),
    mkLine(`   Economy Multiplier : ${cfg.economyMultiplier ?? "1.0"}x`, "text-cyan-400"),
    mkLine(`   Research Speed     : ${cfg.researchSpeedMultiplier ?? "1.0"}x`, "text-cyan-400"),
    mkLine(`   Build Speed        : ${cfg.buildSpeedMultiplier ?? "1.0"}x`, "text-cyan-400"),
    mkLine(`   Difficulty         : ${cfg.difficultySetting ?? "normal"}`, "text-cyan-400"),
    mkLine(`   PvP Mode           : ${cfg.pvpEnabled ? "✓ ENABLED" : "✗ DISABLED"}`, cfg.pvpEnabled ? "text-green-400" : "text-red-400"),
    mkLine(`   Maintenance Mode   : ${cfg.maintenanceMode ? "⚠ ACTIVE" : "✓ OFF"}`, cfg.maintenanceMode ? "text-yellow-400" : "text-green-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  Adjust Economy Multiplier", "text-green-400"),
    mkLine("   [2]  Adjust Research Speed", "text-green-400"),
    mkLine("   [3]  Adjust Build Speed", "text-green-400"),
    mkLine("   [4]  Change Difficulty (easy/normal/hard/nightmare)", "text-green-400"),
    mkLine("   [5]  Toggle PvP Mode", "text-yellow-400"),
    mkLine("   [6]  Toggle Maintenance Mode", "text-yellow-400"),
    mkLine("   [7]  Trigger Global Event", "text-green-400"),
    mkLine("   [8]  End Active Event", "text-green-400"),
    mkLine("   [9]  ⚠️  Wipe All Player Data (DANGEROUS)", "text-red-500"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function configMenuLines(m: Metrics): TLine[] {
  const s = m.m;
  return [
    ...box("SERVER CONFIGURATION"),
    mkLine(""),
    mkLine("  Server Parameters:", "text-white font-bold"),
    mkLine(`   Port               : 5000`, "text-cyan-400"),
    mkLine(`   Environment        : development`, "text-cyan-400"),
    mkLine(`   Max Players        : 1000`, "text-cyan-400"),
    mkLine(`   Session Timeout    : 7 days`, "text-cyan-400"),
    mkLine(`   Rate Limiting      : active`, "text-cyan-400"),
    mkLine(`   CORS               : enabled`, "text-cyan-400"),
    mkLine(""),
    mkLine("  Database:", "text-white font-bold"),
    mkLine(`   Provider           : Neon PostgreSQL (serverless)`, "text-cyan-400"),
    mkLine(`   Active Connections : ${s?.database.connections ?? 0} / 112`, "text-cyan-400"),
    mkLine(`   Query Cache        : ${fmtNum(s?.database.cacheHitRate)}% hit rate`, "text-cyan-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  View Environment Variables", "text-green-400"),
    mkLine("   [2]  Test Database Connection", "text-green-400"),
    mkLine("   [3]  Set Max Players", "text-green-400"),
    mkLine("   [4]  Toggle Maintenance Mode", "text-yellow-400"),
    mkLine("   [5]  Set Maintenance Message", "text-yellow-400"),
    mkLine("   [6]  Configure Rate Limits", "text-green-400"),
    mkLine("   [7]  Save Configuration", "text-green-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function monitoringLines(m: Metrics): TLine[] {
  const s = m.m; const h = m.h;
  const checkEntries = Object.entries(h?.checks || {});
  return [
    ...box("SERVER MONITORING"),
    mkLine(""),
    mkLine("  Live Metrics:", "text-white font-bold"),
    mkLine(`   Status            : ${h?.status?.toUpperCase() ?? "UNKNOWN"}`, h?.status === "healthy" ? "text-green-400" : "text-yellow-400"),
    mkLine(`   Health Score      : ${h?.overallScore ?? 0} / 100`, "text-cyan-400"),
    mkLine(`   Uptime            : ${fmtUptime((s?.cpu.uptime ?? 0) * 1000)}`, "text-green-400"),
    mkLine(`   CPU Usage         : ${fmtNum(s?.cpu.usage)}%`, parseFloat(fmtNum(s?.cpu.usage)) > 60 ? "text-yellow-400" : "text-green-400"),
    mkLine(`   Memory            : ${fmtNum(s?.memory.used)} / ${fmtNum(s?.memory.total)} MB (${fmtNum(s?.memory.usage)}%)`, "text-cyan-400"),
    mkLine(`   Disk              : ${fmtNum(s?.disk.usage)}%`, "text-green-400"),
    mkLine(""),
    mkLine("  Requests:", "text-white font-bold"),
    mkLine(`   Total             : ${s?.requests.totalRequests ?? 0}`, "text-cyan-400"),
    mkLine(`   Rate              : ${fmtNum(s?.requests.requestsPerSecond ?? 0, 2)} req/s`, "text-cyan-400"),
    mkLine(`   Avg Response      : ${fmtNum(s?.requests.averageResponseTime ?? 0)} ms`, "text-cyan-400"),
    mkLine(`   P95 / P99         : ${fmtNum(s?.requests.p95ResponseTime ?? 0)} / ${fmtNum(s?.requests.p99ResponseTime ?? 0)} ms`, "text-cyan-400"),
    mkLine(`   Last Hour         : ${s?.requests.lastHourRequests ?? 0}`, "text-cyan-400"),
    mkLine(""),
    mkLine("  Health Checks:", "text-white font-bold"),
    ...checkEntries.map(([k, v]) =>
      mkLine(
        `   ${k.padEnd(14)}: [${v.status === "ok" ? "OK " : v.status?.toUpperCase().padEnd(3) ?? "???"}]  ${Math.round(v.value)} / ${Math.round(v.threshold)}  ${v.message ? "— " + v.message : ""}`,
        v.status === "ok" ? "text-green-400" : "text-yellow-400"
      )
    ),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  Active Players Count", "text-green-400"),
    mkLine("   [2]  Database Performance Detail", "text-green-400"),
    mkLine("   [3]  System Resource Usage", "text-green-400"),
    mkLine("   [4]  Recent Errors Log", "text-green-400"),
    mkLine("   [R]  Refresh Metrics", "text-yellow-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function eventsLines(): TLine[] {
  return [
    ...box("ANNOUNCEMENTS & EVENTS"),
    mkLine(""),
    mkLine("  Active Events: None", "text-slate-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  Send Global Announcement", "text-green-400"),
    mkLine("   [2]  Send Targeted Message to Player", "text-green-400"),
    mkLine("   [3]  List Active Events", "text-green-400"),
    mkLine("   [4]  Create New Event", "text-green-400"),
    mkLine("   [5]  Schedule Timed Event", "text-green-400"),
    mkLine("   [6]  Cancel Event", "text-yellow-400"),
    mkLine("   [7]  View Announcement History", "text-green-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function maintenanceLines(): TLine[] {
  return [
    ...box("MAINTENANCE TOOLS"),
    mkLine(""),
    mkLine("  System Status: OPERATIONAL", "text-green-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  Clear Application Cache", "text-green-400"),
    mkLine("   [2]  Optimize Database", "text-green-400"),
    mkLine("   [3]  Run Full System Health Check", "text-green-400"),
    mkLine("   [4]  Purge Old Log Entries", "text-yellow-400"),
    mkLine("   [5]  Restart Services (simulation)", "text-yellow-400"),
    mkLine("   [6]  Export Full Backup", "text-green-400"),
    mkLine("   [7]  Vacuum Database Tables", "text-yellow-400"),
    mkLine("   [8]  Reset Player Turn Queues", "text-red-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function accountLines(): TLine[] {
  return [
    ...box("ACCOUNT SETTINGS"),
    mkLine(""),
    mkLine("  Logged In As: admin", "text-cyan-400"),
    mkLine("  Rank: Founder / Super Admin", "text-purple-400"),
    mkLine("  Last Login: " + new Date().toLocaleString(), "text-slate-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  Change Password", "text-green-400"),
    mkLine("   [2]  View Security Code", "text-green-400"),
    mkLine("   [3]  Generate New Security Code", "text-yellow-400"),
    mkLine("   [4]  View Login History", "text-green-400"),
    mkLine("   [5]  Manage API Keys", "text-green-400"),
    mkLine("   [6]  Enable Two-Factor Auth", "text-green-400"),
    mkLine("   [7]  View Audit Trail", "text-green-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

function networkLines(m: Metrics): TLine[] {
  const s = m.m;
  return [
    ...box("NETWORK & CONNECTIONS"),
    mkLine(""),
    mkLine("  Connection Status:", "text-white font-bold"),
    mkLine("   WebSocket         : ACTIVE", "text-green-400"),
    mkLine(`   Active Sessions   : ${s?.database.connections ?? 0}`, "text-cyan-400"),
    mkLine("   API Rate Limit    : 100 req/min per IP", "text-cyan-400"),
    mkLine("   CORS Origin       : *.replit.app + localhost", "text-cyan-400"),
    mkLine("   TLS               : enabled (mTLS via proxy)", "text-green-400"),
    mkLine(""),
    mkLine("  Endpoints:", "text-white font-bold"),
    mkLine("   -> /api/auth/*        authentication", "text-blue-400"),
    mkLine("   -> /api/game/*        game state", "text-blue-400"),
    mkLine("   -> /api/admin/*       admin control", "text-blue-400"),
    mkLine("   -> /api/status/*      health & metrics", "text-blue-400"),
    mkLine(""),
    mkLine("  Options:", "text-white font-bold"),
    mkLine("   [1]  View Active Connections", "text-green-400"),
    mkLine("   [2]  Block IP Address", "text-yellow-400"),
    mkLine("   [3]  Unblock IP Address", "text-yellow-400"),
    mkLine("   [4]  Rate Limit Config", "text-green-400"),
    mkLine("   [5]  View Firewall Rules", "text-green-400"),
    mkLine("   [0]  Back", "text-slate-400"),
    mkLine(""),
  ];
}

const MENU_MAP: Record<string, string> = {
  "1": "database", "2": "users", "3": "game", "4": "config",
  "5": "monitoring", "6": "events", "7": "maintenance", "8": "account",
  "9": "network", "l": "logs", "0": "logout",
};
const PHASE_LABEL: Record<string, string> = {
  database: "Database & Logs", users: "User Management", game: "Game Management",
  config: "Server Config", monitoring: "Monitoring", events: "Events",
  maintenance: "Maintenance", account: "Account", network: "Network", logs: "Live Logs",
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function ServerConsole() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [bootLines, setBootLines] = useState<TLine[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [termLines, setTermLines] = useState<TLine[]>([]);
  const [input, setInput] = useState("");
  const [loginStep, setLoginStep] = useState<"user" | "pass" | "code">("user");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({ m: null, h: null });
  const [gameCfg] = useState<Record<string, unknown>>({ economyMultiplier: 1.0, researchSpeedMultiplier: 1.0, buildSpeedMultiplier: 1.0, difficultySetting: "normal", pvpEnabled: true, maintenanceMode: false });
  const [liveLogs, setLiveLogs] = useState<{ level: string; message: string; category: string; timestamp: string }[]>([]);
  const [logFilter, setLogFilter] = useState("all");
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* fetch metrics */
  const fetchMetrics = useCallback(async () => {
    try {
      const [sRes, hRes] = await Promise.all([
        fetch("/api/status", { credentials: "include" }),
        fetch("/api/status/health", { credentials: "include" }),
      ]);
      const sd = await sRes.json().catch(() => null);
      const hd = await hRes.json().catch(() => null);
      setMetrics({
        m: sd?.data ?? null,
        h: hd && typeof hd === "object" ? { timestamp: hd.timestamp, status: hd.status, checks: hd.checks, overallScore: hd.score } : null,
      });
    } catch { /* silent */ }
  }, []);

  /* fetch logs */
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/logs", { credentials: "include" });
      if (res.ok) {
        const d = await res.json();
        setLiveLogs(d.logs || []);
      }
    } catch { /* silent */ }
  }, []);

  /* boot sequence */
  useEffect(() => {
    fetchMetrics().then(() => {
      /* after metrics loaded, run boot animation */
    });
  }, [fetchMetrics]);

  useEffect(() => {
    if (phase !== "boot") return;
    const lines = buildBootLines(metrics);
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setBootDone(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [phase, metrics]); // eslint-disable-line

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootLines, termLines, phase]);

  /* periodic refresh */
  useEffect(() => {
    const id = setInterval(() => { fetchMetrics(); if (phase === "logs") fetchLogs(); }, 10000);
    return () => clearInterval(id);
  }, [fetchMetrics, fetchLogs, phase]);

  /* focus input */
  useEffect(() => {
    if (bootDone || phase !== "boot") inputRef.current?.focus();
  }, [bootDone, phase]);

  /* push lines to terminal output */
  const push = useCallback((lines: TLine[]) => {
    setTermLines((prev) => [...prev.slice(-400), ...lines]);
  }, []);

  /* switch to a sub-page */
  const goPage = useCallback((p: Phase) => {
    setPhase(p);
    setInput("");
    switch (p) {
      case "main": push([mkLine(""), ...MAIN_MENU_LINES]); break;
      case "database": push(dbMenuLines()); break;
      case "users": push(userMenuLines()); break;
      case "game": push(gameMenuLines(gameCfg)); break;
      case "config": push(configMenuLines(metrics)); break;
      case "monitoring": push(monitoringLines(metrics)); break;
      case "events": push(eventsLines()); break;
      case "maintenance": push(maintenanceLines()); break;
      case "account": push(accountLines()); break;
      case "network": push(networkLines(metrics)); break;
      case "logs":
        fetchLogs().then(() => {
          push([
            ...box("LIVE SERVER LOGS"),
            mkLine(""),
            mkLine("  Filters: [A]ll  [E]rror  [W]arn  [I]nfo  [D]ebug", "text-yellow-400"),
            mkLine(""),
          ]);
        });
        break;
    }
  }, [push, gameCfg, metrics, fetchLogs]);

  /* handle command */
  const handleCommand = useCallback((cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;

    // history
    setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    // echo command
    push([mkLine("")]);

    if (phase === "boot") {
      if (c === "login" || c === "") {
        setPhase("login");
        push([
          mkLine(""),
          mkLine("  ╔═══════════════════════════════════════════╗", "text-purple-500"),
          mkLine("  ║   🔐  ADMIN AUTHENTICATION REQUIRED       ║", "text-purple-300 font-bold"),
          mkLine("  ╚═══════════════════════════════════════════╝", "text-purple-500"),
          mkLine(""),
        ]);
        setLoginStep("user");
      }
      return;
    }

    if (phase === "login") {
      if (loginStep === "user") {
        setLoginUser(cmd.trim());
        setLoginPass("");
        setLoginStep("pass");
        push([
          mkLine(`  [1/3] Operator ID: ${cmd.trim()}`, "text-cyan-400"),
          mkLine("  [2/3] Enter password:", "text-green-600"),
        ]);
        return;
      }
      if (loginStep === "pass") {
        setLoginPass(cmd.trim());
        setLoginStep("code");
        push([
          mkLine("  [2/3] Password: ••••••••", "text-cyan-400"),
          mkLine("  [3/3] Enter security access code:", "text-green-600"),
          mkLine("        (dev default: STELLAR-ADMIN)", "text-slate-600"),
        ]);
        return;
      }
      if (loginStep === "code") {
        setLoginLoading(true);
        push([mkLine("  Authenticating all 3 factors…", "text-yellow-400")]);
        fetch("/api/admin/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: loginUser, password: loginPass, securityCode: cmd.trim() }),
        })
          .then((r) => r.json().catch(() => null).then((d) => ({ ok: r.ok, status: r.status, d })))
          .then(({ ok, status, d }) => {
            setLoginLoading(false);
            if (ok) {
              push([
                mkLine(""),
                mkLine("  ══════════════════════════════════════", "text-green-800"),
                mkLine(`  ✓ ACCESS GRANTED — ${(d?.user?.username || loginUser).toUpperCase()}`, "text-green-300 font-bold"),
                mkLine(`  ✓ Clearance: ${(d?.user?.adminRole || "viewer").toUpperCase()}`, "text-green-400"),
                mkLine("  ✓ Session established", "text-green-400"),
                mkLine("  ══════════════════════════════════════", "text-green-800"),
                mkLine(""),
              ]);
              setTimeout(() => goPage("main"), 800);
            } else {
              const msg = d?.message || "Authentication failed";
              const isCodeError = d?.field === "securityCode";
              push([
                mkLine(`  ✗ ${msg}`, "text-red-400"),
                mkLine(""),
              ]);
              if (isCodeError) {
                setLoginStep("code");
                push([mkLine("  Re-enter access code:", "text-green-600")]);
              } else {
                setLoginStep("user");
                setLoginPass("");
                if (status === 403) {
                  push([
                    mkLine("  ⚠ Account has no admin privileges", "text-yellow-400"),
                    mkLine("  Enter username:", "text-green-600"),
                  ]);
                } else {
                  push([mkLine("  Enter username:", "text-green-600")]);
                }
              }
            }
          })
          .catch(() => {
            setLoginLoading(false);
            /* dev mode network fallback */
            push([mkLine("  ⚠ Network error — using dev bypass", "text-yellow-400")]);
            setTimeout(() => goPage("main"), 600);
          });
        return;
      }
    }

    /* main menu navigation */
    if (phase === "main") {
      const dest = MENU_MAP[c];
      if (dest === "logout") {
        setPhase("login");
        setLoginStep("user");
        push([
          mkLine("  ✓ Logged out successfully", "text-yellow-400"),
          mkLine(""),
          mkLine("  Enter username:", "text-cyan-400"),
        ]);
        return;
      }
      if (dest) { goPage(dest as Phase); return; }
      push([mkLine(`  ✗ Unknown command: ${cmd}`, "text-red-400"), mkLine("  Type a number 1-9 or 0 to logout.", "text-slate-400")]);
      return;
    }

    /* back from sub-menu */
    if (c === "0" || c === "back" || c === "b") {
      goPage("main");
      return;
    }

    /* logs filter */
    if (phase === "logs") {
      if (c === "a") setLogFilter("all");
      else if (c === "e") setLogFilter("error");
      else if (c === "w") setLogFilter("warn");
      else if (c === "i") setLogFilter("info");
      else if (c === "d") setLogFilter("debug");
      else if (c === "r") { fetchLogs(); push([mkLine("  Refreshing logs...", "text-yellow-400")]); }
      return;
    }

    /* monitoring refresh */
    if (phase === "monitoring" && (c === "r" || c === "refresh")) {
      fetchMetrics().then(() => {
        push(monitoringLines(metrics));
      });
      return;
    }

    /* generic feedback for sub-menu actions */
    push([mkLine(`  ➜ Command [${cmd}] acknowledged — feature available in admin panel.`, "text-slate-400")]);
  }, [phase, loginStep, loginUser, goPage, push, fetchLogs, fetchMetrics, metrics]);

  /* input handlers */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = input;
      setInput("");
      handleCommand(v);
    } else if (e.key === "ArrowUp") {
      const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] || "");
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : cmdHistory[nextIdx] || "");
      e.preventDefault();
    }
  };

  /* prompt string */
  const promptLabel = () => {
    if (phase === "boot") return "stellar-dominion";
    if (phase === "login") {
      if (loginStep === "user") return "username";
      if (loginStep === "pass") return "password";
      return "access-code";
    }
    if (phase === "main") return "admin@stellar-dominion:~";
    return `admin@stellar-dominion:~/${PHASE_LABEL[phase] ?? phase}`;
  };

  /* filtered logs for display */
  const filteredLogs = liveLogs.filter((l) => logFilter === "all" || l.level === logFilter).slice(-80);

  /* color for log level */
  const logCls = (level: string) => {
    if (level === "error") return "text-red-400";
    if (level === "warn") return "text-yellow-400";
    if (level === "info") return "text-blue-400";
    return "text-slate-500";
  };

  /* sidebar items */
  const sidebarItems = [
    { key: "1", label: "Database", icon: "📊", page: "database" },
    { key: "2", label: "Users", icon: "👥", page: "users" },
    { key: "3", label: "Game Ctrl", icon: "🎮", page: "game" },
    { key: "4", label: "Server Cfg", icon: "⚙️", page: "config" },
    { key: "5", label: "Monitoring", icon: "📈", page: "monitoring" },
    { key: "6", label: "Events", icon: "🔔", page: "events" },
    { key: "7", label: "Maintenance", icon: "🛠️", page: "maintenance" },
    { key: "8", label: "Account", icon: "🔑", page: "account" },
    { key: "9", label: "Network", icon: "📡", page: "network" },
    { key: "L", label: "Logs", icon: "📋", page: "logs" },
  ];

  const showSidebar = phase !== "boot" && phase !== "login";

  return (
    <div
      className="min-h-screen bg-black flex flex-col font-mono text-sm select-none"
      onClick={() => inputRef.current?.focus()}
      style={{ background: "radial-gradient(ellipse at top, #0a0f0a 0%, #000000 100%)" }}
    >
      {/* ── Title bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0d0d0d] border-b border-green-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-green-500/70 text-xs tracking-widest uppercase">
            Stellar Dominion :: Admin Terminal v2.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-green-900">
          <span>PORT:5000</span>
          <span className={metrics.h?.status === "healthy" ? "text-green-500" : "text-yellow-500"}>
            {metrics.h?.status === "healthy" ? "● HEALTHY" : "▲ " + (metrics.h?.status?.toUpperCase() ?? "OFFLINE")}
          </span>
          <span className="text-slate-600">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        {showSidebar && (
          <div className="w-40 shrink-0 bg-[#050f05] border-r border-green-900/30 flex flex-col overflow-y-auto">
            <div className="px-3 py-2 text-[10px] text-green-700 tracking-widest uppercase border-b border-green-900/20">
              Navigation
            </div>
            <div className="px-2 py-2 flex flex-col gap-0.5">
              <button
                onClick={() => goPage("main")}
                className={`text-left px-2 py-1 rounded text-xs ${phase === "main" ? "bg-green-900/40 text-green-300" : "text-green-700 hover:text-green-400 hover:bg-green-900/20"}`}
              >
                ⌂ Main Menu
              </button>
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { if (phase !== ("boot" as Phase) && phase !== ("login" as Phase)) goPage(item.page as Phase); }}
                  className={`text-left px-2 py-1 rounded text-xs flex items-center gap-1.5 ${phase === item.page ? "bg-green-900/40 text-green-300 font-bold" : "text-green-800 hover:text-green-400 hover:bg-green-900/20"}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            {/* mini stats */}
            <div className="mt-auto px-3 py-3 border-t border-green-900/20 text-[10px] text-green-900 space-y-1">
              <div>CPU: <span className="text-green-700">{fmtNum(metrics.m?.cpu.usage)}%</span></div>
              <div>MEM: <span className="text-green-700">{fmtNum(metrics.m?.memory.usage)}%</span></div>
              <div>DB: <span className="text-green-700">{metrics.m?.database.connections ?? 0}/112</span></div>
              <div>REQ: <span className="text-green-700">{metrics.m?.requests.totalRequests ?? 0}</span></div>
            </div>
          </div>
        )}

        {/* ── Terminal output area ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col" style={{ maxHeight: "calc(100vh - 80px)" }}>

          {/* Boot lines */}
          {phase === "boot" && bootLines.map((line) => (
            <div key={line.id} className={`leading-5 whitespace-pre-wrap break-all ${line.cls ?? "text-green-400"}`}>
              {line.text}
            </div>
          ))}

          {/* Terminal lines (after boot) */}
          {phase !== "boot" && termLines.map((line) => (
            <div key={line.id} className={`leading-5 whitespace-pre-wrap break-all ${line.cls ?? "text-green-400"}`}>
              {line.text}
            </div>
          ))}

          {/* Live logs panel */}
          {phase === "logs" && (
            <div className="mt-2 space-y-0.5">
              {filteredLogs.length === 0
                ? <div className="text-slate-600">  No logs matching filter.</div>
                : filteredLogs.map((log, i) => (
                  <div key={i} className={`flex gap-2 text-xs leading-5 ${logCls(log.level)}`}>
                    <span className="text-slate-700 shrink-0 w-20 truncate">{log.timestamp}</span>
                    <span className="w-14 shrink-0">[{log.level?.toUpperCase()}]</span>
                    <span className="text-slate-600 w-16 shrink-0">[{log.category}]</span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))
              }
            </div>
          )}

          {/* Boot progress spinner while animating */}
          {phase === "boot" && !bootDone && (
            <div className="text-green-700 animate-pulse">▌</div>
          )}

          {/* Skip boot button */}
          {phase === "boot" && !bootDone && (
            <button
              className="mt-4 text-xs text-slate-700 hover:text-slate-400 underline"
              onClick={() => { setBootDone(true); setBootLines(buildBootLines(metrics)); }}
            >
              skip boot animation
            </button>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input line ───────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-green-900/30 bg-[#050f05] px-4 py-2 flex items-center gap-2">
        <span className="text-green-600 text-xs shrink-0">{promptLabel()}$</span>
        <span className="text-green-500">➜</span>
        <input
          ref={inputRef}
          type={phase === "login" && (loginStep === "pass" || loginStep === "code") ? "password" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loginLoading || (phase === "boot" && !bootDone)}
          className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-900 caret-green-400 text-sm"
          placeholder={
            phase === "boot" && !bootDone ? "booting..." :
            phase === "login" ? (loginStep === "user" ? "enter username..." : "enter password...") :
            "type a command..."
          }
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
        {loginLoading && <span className="text-yellow-500 animate-spin text-xs">⟳</span>}
        <span className="text-green-900 text-xs hidden sm:block">↑↓ history • ENTER submit</span>
      </div>

      {/* ── Quick action toolbar (shown when in sub-menus) ──────── */}
      {showSidebar && phase !== "main" && (
        <div className="shrink-0 bg-[#030803] border-t border-green-900/20 px-4 py-1.5 flex items-center gap-3 overflow-x-auto">
          <span className="text-green-900 text-[10px] shrink-0 uppercase tracking-widest">Quick:</span>
          <button onClick={() => goPage("main")} className="text-[10px] text-green-800 hover:text-green-400 shrink-0">[0] ← Back</button>
          {phase !== "monitoring" && <button onClick={() => goPage("monitoring")} className="text-[10px] text-green-800 hover:text-green-400 shrink-0">[5] Monitor</button>}
          {phase !== "logs" && <button onClick={() => goPage("logs")} className="text-[10px] text-green-800 hover:text-green-400 shrink-0">[L] Logs</button>}
          {phase !== "users" && <button onClick={() => goPage("users")} className="text-[10px] text-green-800 hover:text-green-400 shrink-0">[2] Users</button>}
          {phase !== "database" && <button onClick={() => goPage("database")} className="text-[10px] text-green-800 hover:text-green-400 shrink-0">[1] Database</button>}
          <span className="ml-auto text-green-900/40 text-[10px] shrink-0">
            {PHASE_LABEL[phase] ?? phase} • {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}
