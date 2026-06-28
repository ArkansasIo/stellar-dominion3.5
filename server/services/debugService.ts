/**
 * Debug Logging Service
 * Comprehensive debugging and tracing for development and production
 */

import fs from 'fs';
import path from 'path';

export enum DebugLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface DebugEntry {
  timestamp: number;
  level: DebugLevel;
  source: string;
  message: string;
  data?: any;
  duration?: number; // milliseconds
  requestId?: string;
  userId?: string;
}

export class DebugService {
  private static instance: DebugService;
  private logs: DebugEntry[] = [];
  private maxLogs = 10000;
  private logDirectory = './logs/debug';
  private enableFileLogging = true;
  private enableConsoleLogging = true;

  private constructor() {
    this.ensureLogDirectory();
  }

  static getInstance(): DebugService {
    if (!DebugService.instance) {
      DebugService.instance = new DebugService();
    }
    return DebugService.instance;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Log a debug message
   */
  log(
    level: DebugLevel,
    source: string,
    message: string,
    data?: any,
    requestId?: string,
    userId?: string,
    duration?: number
  ): void {
    const entry: DebugEntry = {
      timestamp: Date.now(),
      level,
      source,
      message,
      data,
      duration,
      requestId,
      userId,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.enableConsoleLogging) {
      this.logToConsole(entry);
    }

    if (this.enableFileLogging) {
      this.logToFile(entry);
    }
  }

  /**
   * Trace level logging
   */
  trace(source: string, message: string, data?: any, requestId?: string): void {
    this.log(DebugLevel.TRACE, source, message, data, requestId);
  }

  /**
   * Debug level logging
   */
  debug(source: string, message: string, data?: any, requestId?: string): void {
    this.log(DebugLevel.DEBUG, source, message, data, requestId);
  }

  /**
   * Info level logging
   */
  info(source: string, message: string, data?: any, requestId?: string): void {
    this.log(DebugLevel.INFO, source, message, data, requestId);
  }

  /**
   * Warn level logging
   */
  warn(source: string, message: string, data?: any, requestId?: string): void {
    this.log(DebugLevel.WARN, source, message, data, requestId);
  }

  /**
   * Error level logging
   */
  error(source: string, message: string, data?: any, requestId?: string): void {
    this.log(DebugLevel.ERROR, source, message, data, requestId);
  }

  /**
   * Performance tracking
   */
  trackPerformance<T>(source: string, operation: string, fn: () => T, requestId?: string): T {
    const startTime = Date.now();
    try {
      const result = fn();
      const duration = Date.now() - startTime;
      this.log(DebugLevel.DEBUG, source, `${operation} completed`, { duration }, requestId, undefined, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(DebugLevel.ERROR, source, `${operation} failed after ${duration}ms`, { error }, requestId);
      throw error;
    }
  }

  /**
   * Async performance tracking
   */
  async trackAsyncPerformance<T>(
    source: string,
    operation: string,
    fn: () => Promise<T>,
    requestId?: string
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.log(DebugLevel.DEBUG, source, `${operation} completed`, { duration }, requestId, undefined, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(DebugLevel.ERROR, source, `${operation} failed after ${duration}ms`, { error }, requestId);
      throw error;
    }
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(entry: DebugEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelColor: Record<DebugLevel, string> = {
      [DebugLevel.TRACE]: '\x1b[90m', // Gray
      [DebugLevel.DEBUG]: '\x1b[36m', // Cyan
      [DebugLevel.INFO]: '\x1b[32m', // Green
      [DebugLevel.WARN]: '\x1b[33m', // Yellow
      [DebugLevel.ERROR]: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    const color = levelColor[entry.level];

    const prefix = `${color}[${timestamp}] [${entry.level.toUpperCase()}] [${entry.source}]${reset}`;
    const duration = entry.duration ? ` (${entry.duration}ms)` : '';

    console.log(`${prefix} ${entry.message}${duration}`);
    if (entry.data) {
      console.log(JSON.stringify(entry.data, null, 2));
    }
  }

  /**
   * Log to file
   */
  private logToFile(entry: DebugEntry): void {
    const date = new Date(entry.timestamp);
    const dateStr = date.toISOString().split('T')[0];
    const filename = path.join(this.logDirectory, `debug-${dateStr}.log`);

    const logLine = JSON.stringify(entry) + '\n';

    fs.appendFileSync(filename, logLine, { encoding: 'utf-8' });
  }

  /**
   * Get debug logs
   */
  getLogs(level?: DebugLevel, limit: number = 100): DebugEntry[] {
    let filtered = [...this.logs];

    if (level) {
      const levels = [DebugLevel.TRACE, DebugLevel.DEBUG, DebugLevel.INFO, DebugLevel.WARN, DebugLevel.ERROR];
      const levelIndex = levels.indexOf(level);
      filtered = filtered.filter((log) => levels.indexOf(log.level) >= levelIndex);
    }

    return filtered.slice(-limit);
  }

  /**
   * Get logs for specific request
   */
  getRequestLogs(requestId: string): DebugEntry[] {
    return this.logs.filter((log) => log.requestId === requestId);
  }

  /**
   * Clear old logs
   */
  clearOldLogs(daysToKeep: number = 7): void {
    const cutoffDate = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    this.logs = this.logs.filter((log) => log.timestamp > cutoffDate);

    // Also clean up old files
    if (fs.existsSync(this.logDirectory)) {
      const files = fs.readdirSync(this.logDirectory);
      files.forEach((file) => {
        const filepath = path.join(this.logDirectory, file);
        const stats = fs.statSync(filepath);
        if (stats.mtimeMs < cutoffDate) {
          fs.unlinkSync(filepath);
        }
      });
    }
  }

  /**
   * Export logs
   */
  exportLogs(filename: string = 'debug-logs-export.json'): void {
    const filepath = path.join(this.logDirectory, filename);
    fs.writeFileSync(filepath, JSON.stringify(this.logs, null, 2), { encoding: 'utf-8' });
  }
}
