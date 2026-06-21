/**
 * Issue & Problem Tracking Service
 * Tracks, categorizes, and reports system issues and problems
 */

export enum IssueSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum IssueStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  category: string;
  source: string;
  firstSeen: number; // timestamp
  lastSeen: number; // timestamp
  occurrences: number;
  stackTrace?: string;
  affectedUsers?: string[];
  systemMetrics?: Record<string, any>;
  resolution?: {
    resolvedAt: number;
    resolvedBy: string;
    notes: string;
  };
  tags: string[];
}

export interface IssueReport {
  id: string;
  generatedAt: number;
  period: {
    startTime: number;
    endTime: number;
  };
  summary: {
    totalIssues: number;
    openIssues: number;
    byStatus: Record<IssueStatus, number>;
    bySeverity: Record<IssueSeverity, number>;
    byCategory: Record<string, number>;
  };
  topIssues: Issue[];
  recentIssues: Issue[];
}

export class IssueService {
  private static instance: IssueService;
  private issues: Map<string, Issue> = new Map();
  private issueIndex: Map<string, string> = new Map(); // For deduplication

  private constructor() {}

  static getInstance(): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService();
    }
    return IssueService.instance;
  }

  /**
   * Generate unique issue signature for deduplication
   */
  private generateSignature(source: string, category: string, title: string): string {
    return `${source}:${category}:${title}`.toLowerCase();
  }

  /**
   * Report an issue
   */
  reportIssue(
    title: string,
    description: string,
    severity: IssueSeverity,
    category: string,
    source: string,
    stackTrace?: string,
    affectedUsers?: string[],
    systemMetrics?: Record<string, any>
  ): Issue {
    const signature = this.generateSignature(source, category, title);
    const existingIssueId = this.issueIndex.get(signature);

    if (existingIssueId) {
      const existing = this.issues.get(existingIssueId)!;
      existing.occurrences++;
      existing.lastSeen = Date.now();
      if (affectedUsers) {
        const combinedUsers = [...(existing.affectedUsers || []), ...affectedUsers];
        existing.affectedUsers = Array.from(new Set(combinedUsers));
      }
      return existing;
    }

    const issue: Issue = {
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      severity,
      status: IssueStatus.OPEN,
      category,
      source,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      occurrences: 1,
      stackTrace,
      affectedUsers,
      systemMetrics,
      tags: [],
    };

    this.issues.set(issue.id, issue);
    this.issueIndex.set(signature, issue.id);

    return issue;
  }

  /**
   * Get issue by ID
   */
  getIssue(id: string): Issue | undefined {
    return this.issues.get(id);
  }

  /**
   * Get all issues
   */
  getAllIssues(): Issue[] {
    return Array.from(this.issues.values());
  }

  /**
   * Get open issues
   */
  getOpenIssues(): Issue[] {
    return Array.from(this.issues.values()).filter((i) => i.status === IssueStatus.OPEN);
  }

  /**
   * Get issues by severity
   */
  getIssuesBySeverity(severity: IssueSeverity): Issue[] {
    return Array.from(this.issues.values()).filter((i) => i.severity === severity);
  }

  /**
   * Get issues by category
   */
  getIssuesByCategory(category: string): Issue[] {
    return Array.from(this.issues.values()).filter((i) => i.category === category);
  }

  /**
   * Update issue status
   */
  updateIssueStatus(id: string, status: IssueStatus, notes?: string, resolvedBy?: string): Issue | undefined {
    const issue = this.issues.get(id);
    if (!issue) return undefined;

    issue.status = status;
    if (status === IssueStatus.RESOLVED && resolvedBy) {
      issue.resolution = {
        resolvedAt: Date.now(),
        resolvedBy,
        notes: notes || '',
      };
    }

    return issue;
  }

  /**
   * Add tags to issue
   */
  addTags(id: string, tags: string[]): Issue | undefined {
    const issue = this.issues.get(id);
    if (!issue) return undefined;

    const uniqueTags = new Set([...issue.tags, ...tags]);
    issue.tags = Array.from(uniqueTags);
    return issue;
  }

  /**
   * Generate issue report
   */
  generateReport(startTime: number, endTime: number): IssueReport {
    const issues = Array.from(this.issues.values());
    const periodIssues = issues.filter((i) => i.firstSeen >= startTime && i.firstSeen <= endTime);

    const summary = {
      totalIssues: issues.length,
      openIssues: issues.filter((i) => i.status === IssueStatus.OPEN).length,
      byStatus: Object.values(IssueStatus).reduce(
        (acc, status) => {
          acc[status] = issues.filter((i) => i.status === status).length;
          return acc;
        },
        {} as Record<IssueStatus, number>
      ),
      bySeverity: Object.values(IssueSeverity).reduce(
        (acc, severity) => {
          acc[severity] = issues.filter((i) => i.severity === severity).length;
          return acc;
        },
        {} as Record<IssueSeverity, number>
      ),
      byCategory: Array.from(
        issues.reduce(
          (acc, i) => {
            acc.set(i.category, (acc.get(i.category) || 0) + 1);
            return acc;
          },
          new Map<string, number>()
        ).entries()
      ).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {} as Record<string, number>),
    };

    const topIssues = periodIssues.sort((a, b) => b.occurrences - a.occurrences).slice(0, 10);
    const recentIssues = periodIssues.sort((a, b) => b.lastSeen - a.lastSeen).slice(0, 10);

    return {
      id: `report_${Date.now()}`,
      generatedAt: Date.now(),
      period: { startTime, endTime },
      summary,
      topIssues,
      recentIssues,
    };
  }

  /**
   * Clear resolved issues older than X days
   */
  clearResolvedIssues(daysOld: number = 30): number {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let cleared = 0;

    const entriesToDelete: string[] = [];
    this.issues.forEach((issue, id) => {
      if (issue.status === IssueStatus.RESOLVED && issue.resolution && issue.resolution.resolvedAt < cutoffTime) {
        entriesToDelete.push(id);
      }
    });
    entriesToDelete.forEach(id => this.issues.delete(id));
    cleared = entriesToDelete.length;

    return cleared;
  }
}
