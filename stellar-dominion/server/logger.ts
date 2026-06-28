// Enhanced logging system for the server
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'AUTH' | 'API' | 'DB' | 'SESSION' | 'SERVER' | 'CACHE' | 'PERFORMANCE';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  error?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  };

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case 'debug': return this.colors.dim;
      case 'info': return this.colors.blue;
      case 'warn': return this.colors.yellow;
      case 'error': return this.colors.red;
    }
  }

  private getIconForLevel(level: LogLevel): string {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
    }
  }

  log(level: LogLevel, category: LogCategory, message: string, data?: any, error?: any) {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const entry: LogEntry = {
      timestamp,
      level,
      category,
      message,
      data,
      error: error ? String(error) : undefined,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const color = this.getColorForLevel(level);
    const icon = this.getIconForLevel(level);
    const categoryStr = `[${category}]`.padEnd(10);
    
    console.log(
      `${timestamp} ${icon} ${color}${categoryStr}${this.colors.reset} ${this.colors.bright}${message}${this.colors.reset}`,
      data ? data : '',
      error ? `\n  Error: ${error}` : ''
    );
  }

  debug(category: LogCategory, message: string, data?: any) {
    this.log('debug', category, message, data);
  }

  info(category: LogCategory, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  warn(category: LogCategory, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  error(category: LogCategory, message: string, data?: any, error?: any) {
    this.log('error', category, message, data, error);
  }

  getLogs(level?: LogLevel, category?: LogCategory, limit?: number): LogEntry[] {
    let filtered = [...this.logs];
    if (level) filtered = filtered.filter(l => l.level === level);
    if (category) filtered = filtered.filter(l => l.category === category);
    if (limit) filtered = filtered.slice(-limit);
    return filtered;
  }

  getStats() {
    return {
      total: this.logs.length,
      errors: this.logs.filter(l => l.level === 'error').length,
      warnings: this.logs.filter(l => l.level === 'warn').length,
      info: this.logs.filter(l => l.level === 'info').length,
      debug: this.logs.filter(l => l.level === 'debug').length,
    };
  }

  clear() {
    this.logs = [];
  }

  export() {
    return this.logs;
  }
}

export const logger = new Logger();
