/**
 * Warning & Alert Service
 * Tracks system warnings and alerts
 */

export enum WarningLevel {
  NOTICE = 'notice',
  CAUTION = 'caution',
  ALERT = 'alert',
  EMERGENCY = 'emergency',
}

export interface Warning {
  id: string;
  level: WarningLevel;
  title: string;
  message: string;
  source: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedAt?: number;
  acknowledgedBy?: string;
  autoResolveAt?: number;
  tags: string[];
  metrics?: Record<string, number>;
}

export class WarningService {
  private static instance: WarningService;
  private warnings: Warning[] = [];
  private maxWarnings = 5000;

  private constructor() {}

  static getInstance(): WarningService {
    if (!WarningService.instance) {
      WarningService.instance = new WarningService();
    }
    return WarningService.instance;
  }

  /**
   * Create a warning
   */
  createWarning(
    level: WarningLevel,
    title: string,
    message: string,
    source: string,
    autoResolveMs?: number,
    tags: string[] = [],
    metrics?: Record<string, number>
  ): Warning {
    const warning: Warning = {
      id: `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      title,
      message,
      source,
      timestamp: Date.now(),
      acknowledged: false,
      autoResolveAt: autoResolveMs ? Date.now() + autoResolveMs : undefined,
      tags,
      metrics,
    };

    this.warnings.push(warning);
    if (this.warnings.length > this.maxWarnings) {
      this.warnings.shift();
    }

    return warning;
  }

  /**
   * Acknowledge warning
   */
  acknowledgeWarning(id: string, acknowledgedBy: string): Warning | undefined {
    const warning = this.warnings.find((w) => w.id === id);
    if (!warning) return undefined;

    warning.acknowledged = true;
    warning.acknowledgedAt = Date.now();
    warning.acknowledgedBy = acknowledgedBy;

    return warning;
  }

  /**
   * Get all active warnings
   */
  getActiveWarnings(): Warning[] {
    return this.warnings.filter((w) => !w.acknowledged);
  }

  /**
   * Get warnings by level
   */
  getWarningsByLevel(level: WarningLevel): Warning[] {
    return this.warnings.filter((w) => w.level === level && !w.acknowledged);
  }

  /**
   * Get warnings by source
   */
  getWarningsBySource(source: string): Warning[] {
    return this.warnings.filter((w) => w.source === source && !w.acknowledged);
  }

  /**
   * Get all warnings
   */
  getAllWarnings(): Warning[] {
    return [...this.warnings];
  }

  /**
   * Clear old warnings
   */
  clearOldWarnings(hoursOld: number = 24): number {
    const cutoff = Date.now() - hoursOld * 60 * 60 * 1000;
    const before = this.warnings.length;

    this.warnings = this.warnings.filter((w) => w.timestamp > cutoff || !w.acknowledged);

    return before - this.warnings.length;
  }

  /**
   * Get warning statistics
   */
  getStatistics(): Record<string, any> {
    const total = this.warnings.length;
    const acknowledged = this.warnings.filter((w) => w.acknowledged).length;
    const active = total - acknowledged;

    const byLevel = Object.values(WarningLevel).reduce(
      (acc, level) => {
        acc[level] = this.warnings.filter((w) => w.level === level && !w.acknowledged).length;
        return acc;
      },
      {} as Record<string, number>
    );

    const bySource = this.warnings.reduce(
      (acc, w) => {
        if (!w.acknowledged) {
          acc[w.source] = (acc[w.source] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      active,
      acknowledged,
      byLevel,
      bySource,
    };
  }
}
