import type { ReactNode } from "react";
import {
  Activity,
  Banknote,
  Boxes,
  Code2,
  FileText,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  ScrollText,
  ShieldCheck,
  Siren,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_CONSOLE_MENUS, hasAdminCapability, type AdminSubsystemId } from "@shared/config/adminConsole";

const ICONS: Record<AdminSubsystemId, LucideIcon> = {
  command: LayoutDashboard,
  players: Users,
  economy: Banknote,
  universe: Globe2,
  moderation: ShieldCheck,
  security: LockKeyhole,
  liveops: Zap,
  content: FileText,
  developer: Code2,
  audit: ScrollText,
};

const TONE_STYLES = {
  blue: "border-blue-500/40 bg-blue-500/10 text-blue-100",
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-100",
  red: "border-red-500/40 bg-red-500/10 text-red-100",
} as const;

interface AdminConsoleShellProps {
  children: ReactNode;
  role: string | null;
  permissions: string[];
  activeSubsystem: AdminSubsystemId;
  activeSubMenu: string;
  onSelect: (subsystem: AdminSubsystemId, subMenu: string) => void;
}

export function AdminConsoleShell({
  children,
  role,
  permissions,
  activeSubsystem,
  activeSubMenu,
  onSelect,
}: AdminConsoleShellProps) {
  const visibleMenus = ADMIN_CONSOLE_MENUS.filter((menu) => hasAdminCapability(permissions, menu.capability));
  const activeMenu = ADMIN_CONSOLE_MENUS.find((menu) => menu.id === activeSubsystem) || visibleMenus[0];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-[#071326] text-slate-100 shadow-2xl shadow-blue-950/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.20),transparent_38%),linear-gradient(135deg,rgba(14,30,58,0.95),rgba(3,10,24,0.98))]" />
      <div className="relative grid min-h-[720px] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-blue-500/20 bg-slate-950/35 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                <Activity className="h-4 w-4" />
                Command Console
              </div>
              <div className="mt-2 font-orbitron text-lg font-bold text-white">STELLAR DOMINION</div>
              <div className="mt-1 text-xs text-slate-400">Administrator operations plane</div>
            </div>
            <Siren className="mt-1 h-5 w-5 text-blue-300" />
          </div>

          <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-950/30 px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Clearance</span>
            <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/10">{role || "admin"}</Badge>
          </div>

          <nav aria-label="Admin systems" className="space-y-1.5">
            {visibleMenus.map((menu) => {
              const Icon = ICONS[menu.id];
              const selected = activeSubsystem === menu.id;
              return (
                <div key={menu.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className={`w-full justify-start gap-3 border px-3 py-2 text-left transition-colors ${
                      selected
                        ? `${TONE_STYLES[menu.tone]} shadow-[inset_3px_0_0_rgba(96,165,250,0.95)]`
                        : "border-transparent text-slate-300 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-white"
                    }`}
                    onClick={() => onSelect(menu.id, menu.subMenus[0]?.id || "overview")}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide">{menu.label}</span>
                    <span className="text-[10px] text-slate-500">{menu.subMenus.length}</span>
                  </Button>
                  {selected ? (
                    <div className="ml-4 mt-1 space-y-1 border-l border-blue-500/25 pl-3">
                      {menu.subMenus.map((subMenu) => (
                        <button
                          key={subMenu.id}
                          type="button"
                          className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
                            activeSubMenu === subMenu.id
                              ? "bg-blue-500/20 text-cyan-100"
                              : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                          }`}
                          onClick={() => onSelect(menu.id, subMenu.id)}
                        >
                          <span className="block font-semibold">{subMenu.label}</span>
                          <span className="mt-0.5 block line-clamp-2 text-[10px] text-slate-500">{subMenu.description}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 rounded-lg border border-blue-500/20 bg-slate-900/70 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
              <Boxes className="h-4 w-4" />
              Control routing
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Every privileged control is permission-gated server-side and written to the durable audit stream.
            </p>
          </div>
        </aside>

        <section className="min-w-0 bg-slate-950/15">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 px-5 py-4 lg:px-7">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-blue-300">Active subsystem</div>
              <h1 className="mt-1 font-orbitron text-xl font-bold text-white">{activeMenu?.label || "Admin Console"}</h1>
              <p className="mt-1 text-xs text-slate-400">{activeMenu?.description || "Administrative control systems."}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Server-authoritative
            </div>
          </div>
          <div className="p-4 lg:p-7">{children}</div>
        </section>
      </div>
    </div>
  );
}
