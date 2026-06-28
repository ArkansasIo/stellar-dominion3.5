import {
  ShieldAlert,
  Database,
  Terminal,
  Settings,
  Clock,
  Activity,
  Zap,
  Users,
  HardDrive,
  AlertTriangle,
  BarChart3,
  FileText,
  Key,
  Bell,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string | number;
  badgeColor?: "default" | "secondary" | "destructive" | "warning";
  subsection?: boolean;
  category?: "core" | "system" | "monitoring" | "maintenance";
}

export interface AdminMenuCategory {
  name: string;
  icon: LucideIcon;
  items: AdminMenuItem[];
  description?: string;
}

export const ADMIN_MENU_CONFIG: AdminMenuCategory[] = [
  {
    name: "Core Administration",
    icon: ShieldAlert,
    description: "Core admin functions and control",
    items: [
      {
        id: "admin-dashboard",
        label: "Control Panel",
        href: "/admin",
        icon: ShieldAlert,
        description: "Main admin control panel",
        category: "core",
      },
      {
        id: "accounts",
        label: "Accounts & Users",
        href: "/admin?section=accounts",
        icon: Users,
        description: "Manage user accounts and permissions",
        category: "core",
      },
      {
        id: "admin-audit",
        label: "Audit Logs",
        href: "/admin?section=audit",
        icon: FileText,
        description: "View administration audit trail",
        category: "core",
      },
      {
        id: "security",
        label: "Security Settings",
        href: "/admin?section=security",
        icon: Key,
        description: "Manage security policies and access control",
        category: "core",
      },
    ],
  },

  {
    name: "Cron Job Management",
    icon: Clock,
    description: "Manage server-side scheduled jobs and automation",
    items: [
      {
        id: "cron-jobs-admin",
        label: "Cron Jobs Dashboard",
        href: "/cron-jobs-admin",
        icon: Clock,
        description: "Manage all cron jobs and scheduling",
        category: "system",
      },
      {
        id: "cron-core",
        label: "Core Production",
        href: "/cron-jobs-admin?category=core",
        icon: Zap,
        description: "Resource, turn, and construction jobs",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-research",
        label: "Research Jobs",
        href: "/cron-jobs-admin?category=research",
        icon: Activity,
        description: "Research progression and XP distribution",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-fleet",
        label: "Fleet & Combat",
        href: "/cron-jobs-admin?category=fleet",
        icon: Zap,
        description: "Fleet maintenance and mission processing",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-economy",
        label: "Economy & Trading",
        href: "/cron-jobs-admin?category=economy",
        icon: Activity,
        description: "Market updates and resource trading",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-crafting",
        label: "Crafting & Production",
        href: "/cron-jobs-admin?category=crafting",
        icon: Activity,
        description: "Smithy and blueprint assembly jobs",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-defense",
        label: "Defense Systems",
        href: "/cron-jobs-admin?category=defense",
        icon: Shield,
        description: "Orbital stations and moon operations",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-events",
        label: "Special Events",
        href: "/cron-jobs-admin?category=events",
        icon: Bell,
        description: "Raids, anomalies, and megastructures",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-government",
        label: "Government & Alliances",
        href: "/cron-jobs-admin?category=systems",
        icon: Users,
        description: "Government progression and alliance systems",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-missions",
        label: "Missions & Achievements",
        href: "/cron-jobs-admin?category=missions",
        icon: Activity,
        description: "Daily/weekly missions and achievements",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-resets",
        label: "Reset Jobs",
        href: "/cron-jobs-admin?category=resets",
        icon: Activity,
        description: "Daily, weekly, and monthly resets",
        subsection: true,
        category: "system",
      },
      {
        id: "cron-maintenance",
        label: "Maintenance & Cleanup",
        href: "/cron-jobs-admin?category=maintenance",
        icon: Activity,
        description: "Server maintenance and data cleanup",
        subsection: true,
        category: "system",
      },
    ],
  },

  {
    name: "Database & Data",
    icon: Database,
    description: "Database administration and data management",
    items: [
      {
        id: "database-admin",
        label: "Database Admin",
        href: "/admin/database",
        icon: Database,
        description: "Direct database management and queries",
        category: "system",
      },
      {
        id: "database-backup",
        label: "Backup & Restore",
        href: "/admin?section=backup",
        icon: HardDrive,
        description: "Manage database backups and restores",
        category: "system",
      },
      {
        id: "data-export",
        label: "Data Export",
        href: "/admin?section=export",
        icon: FileText,
        description: "Export game data and analytics",
        category: "system",
      },
    ],
  },

  {
    name: "Monitoring & Diagnostics",
    icon: Activity,
    description: "Server monitoring and system diagnostics",
    items: [
      {
        id: "server-console",
        label: "Server Console",
        href: "/server-console",
        icon: Terminal,
        description: "Real-time server console and logs",
        category: "monitoring",
      },
      {
        id: "system-stats",
        label: "System Statistics",
        href: "/admin?section=statistics",
        icon: BarChart3,
        description: "Server performance and player statistics",
        category: "monitoring",
      },
      {
        id: "server-health",
        label: "Server Health",
        href: "/admin?section=health",
        icon: AlertTriangle,
        description: "Health checks and system status",
        category: "monitoring",
      },
      {
        id: "player-analytics",
        label: "Player Analytics",
        href: "/admin?section=analytics",
        icon: BarChart3,
        description: "Detailed player activity and engagement metrics",
        category: "monitoring",
      },
    ],
  },

  {
    name: "Game Configuration",
    icon: Settings,
    description: "Configure game settings and rules",
    items: [
      {
        id: "game-settings",
        label: "Game Settings",
        href: "/admin?section=settings",
        icon: Settings,
        description: "Core game mechanics and balance settings",
        category: "maintenance",
      },
      {
        id: "event-manager",
        label: "Event Manager",
        href: "/admin?section=events",
        icon: Bell,
        description: "Create and manage game events",
        category: "maintenance",
      },
      {
        id: "announcements",
        label: "Announcements",
        href: "/admin?section=announcements",
        icon: Bell,
        description: "Post server-wide announcements",
        category: "maintenance",
      },
      {
        id: "config-explorer",
        label: "Config Explorer",
        href: "/config-explorer",
        icon: FileText,
        description: "Browse game configuration files",
        category: "maintenance",
      },
    ],
  },

  {
    name: "Operations & Maintenance",
    icon: Settings,
    description: "Server operations and maintenance tasks",
    items: [
      {
        id: "server-restart",
        label: "Server Operations",
        href: "/admin?section=operations",
        icon: Zap,
        description: "Restart server, manage maintenance",
        category: "maintenance",
      },
      {
        id: "player-management",
        label: "Player Management",
        href: "/admin?section=player-mgmt",
        icon: Users,
        description: "Ban, mute, warn players",
        category: "maintenance",
      },
      {
        id: "broadcast",
        label: "Broadcast Messages",
        href: "/admin?section=broadcast",
        icon: Bell,
        description: "Send messages to all connected players",
        category: "maintenance",
      },
    ],
  },
];

export function getAdminMenuItemsByCategory(category: string): AdminMenuItem[] {
  const menuCategories = ADMIN_MENU_CONFIG.find((c) => c.name === category);
  return menuCategories?.items || [];
}

export function getAllAdminMenuItems(): AdminMenuItem[] {
  return ADMIN_MENU_CONFIG.flatMap((category) => category.items);
}

export function getAdminMenuItemById(id: string): AdminMenuItem | undefined {
  return getAllAdminMenuItems().find((item) => item.id === id);
}

export function getAdminMenuItemsByFunction(
  functionName: string
): AdminMenuItem[] {
  const items = getAllAdminMenuItems();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(functionName.toLowerCase()) ||
      item.description?.toLowerCase().includes(functionName.toLowerCase())
  );
}
