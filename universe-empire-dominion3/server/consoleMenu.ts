import readline from 'readline';
import { logger } from './logger';

export class ConsoleMenu {
  private rl: readline.Interface;
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
  };

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
  }

  private displayHeader() {
    console.clear();
    console.log(this.colors.bright + this.colors.cyan + '╔════════════════════════════════════════════════╗' + this.colors.reset);
    console.log(this.colors.bright + this.colors.cyan + '║' + this.colors.reset + this.colors.bright + '         🖥️  STELLAR DOMINION SERVER CONSOLE     ' + this.colors.cyan + '║' + this.colors.reset);
    console.log(this.colors.bright + this.colors.cyan + '╚════════════════════════════════════════════════╝' + this.colors.reset + '\n');
  }

  displayMainMenu() {
    this.displayHeader();
    console.log(this.colors.bright + 'Main Menu:' + this.colors.reset);
    console.log('  1) View System Status');
    console.log('  2) View Logs');
    console.log('  3) Server Settings');
    console.log('  4) Clear Logs');
    console.log('  5) Export Logs');
    console.log('  0) Exit Console\n');
  }

  viewSystemStatus() {
    this.displayHeader();
    const stats = logger.getStats();
    console.log(this.colors.bright + 'System Status:' + this.colors.reset);
    console.log(`  ${this.colors.green}✓${this.colors.reset} Total Logs: ${stats.total}`);
    console.log(`  ${this.colors.blue}ℹ️${this.colors.reset}  Info: ${stats.info}`);
    console.log(`  ${this.colors.yellow}⚠️${this.colors.reset}  Warnings: ${stats.warnings}`);
    console.log(`  ${this.colors.red}❌${this.colors.reset} Errors: ${stats.errors}`);
    console.log(`  🔍 Debug: ${stats.debug}`);
    console.log();
  }

  viewLogs() {
    this.displayHeader();
    console.log(this.colors.bright + 'Logs Menu:' + this.colors.reset);
    console.log('  1) View All Logs (last 20)');
    console.log('  2) View Errors');
    console.log('  3) View Warnings');
    console.log('  4) View Auth Logs');
    console.log('  5) View API Logs');
    console.log('  0) Back to Main Menu\n');
  }

  serverSettings() {
    this.displayHeader();
    console.log(this.colors.bright + 'Server Settings:' + this.colors.reset);
    console.log('  1) Set Log Level');
    console.log('  2) Database Info');
    console.log('  3) Session Info');
    console.log('  4) Environment Variables');
    console.log('  0) Back to Main Menu\n');
  }

  displayLogEntry(entry: any) {
    const level = entry.level as string;
    const icons: Record<string, string> = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    };
    const icon = icons[level] || '•';

    const levelColors: Record<string, string> = {
      debug: this.colors.dim,
      info: this.colors.blue,
      warn: this.colors.yellow,
      error: this.colors.red
    };
    const levelColor = levelColors[level] || this.colors.reset;

    console.log(
      `${entry.timestamp} ${icon} ${levelColor}[${entry.category}]${this.colors.reset} ${entry.message}`,
      entry.data ? JSON.stringify(entry.data).substring(0, 50) : ''
    );
  }

  async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(this.colors.cyan + question + this.colors.reset, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async start() {
    let running = true;
    while (running) {
      this.displayMainMenu();
      const choice = await this.prompt('Enter option: ');

      switch (choice) {
        case '1':
          this.viewSystemStatus();
          await this.prompt('Press Enter to continue...');
          break;

        case '2':
          await this.handleLogsMenu();
          break;

        case '3':
          await this.handleSettings();
          break;

        case '4':
          logger.clear();
          console.log(this.colors.green + '✓ Logs cleared' + this.colors.reset);
          await this.prompt('Press Enter to continue...');
          break;

        case '5':
          const logs = logger.export();
          console.log('\n' + JSON.stringify(logs, null, 2));
          await this.prompt('Press Enter to continue...');
          break;

        case '0':
          running = false;
          console.log(this.colors.green + '✓ Exiting console...' + this.colors.reset);
          this.rl.close();
          break;

        default:
          console.log(this.colors.red + '✗ Invalid option' + this.colors.reset);
          await this.prompt('Press Enter to continue...');
      }
    }
  }

  private async handleLogsMenu() {
    const choice = await this.prompt('\nEnter logs option: ');
    this.displayHeader();

    switch (choice) {
      case '1': {
        const logs = logger.getLogs(undefined, undefined, 20);
        console.log(this.colors.bright + 'Last 20 Logs:' + this.colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '2': {
        const logs = logger.getLogs('error');
        console.log(this.colors.bright + this.colors.red + `Errors (${logs.length}):` + this.colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '3': {
        const logs = logger.getLogs('warn');
        console.log(this.colors.bright + this.colors.yellow + `Warnings (${logs.length}):` + this.colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '4': {
        const logs = logger.getLogs(undefined, 'AUTH', 20);
        console.log(this.colors.bright + 'Auth Logs:' + this.colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '5': {
        const logs = logger.getLogs(undefined, 'API', 20);
        console.log(this.colors.bright + 'API Logs:' + this.colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
    }

    await this.prompt('\nPress Enter to continue...');
  }

  private async handleSettings() {
    const choice = await this.prompt('\nEnter settings option: ');
    this.displayHeader();

    switch (choice) {
      case '1':
        console.log(this.colors.bright + 'Log Levels:' + this.colors.reset);
        console.log('  debug, info, warn, error');
        break;
      case '2':
        console.log(this.colors.bright + 'Database Info:' + this.colors.reset);
        console.log(`  Host: ${process.env.PGHOST || 'localhost'}`);
        console.log(`  Port: ${process.env.PGPORT || 5432}`);
        console.log(`  Database: ${process.env.PGDATABASE || 'stellar'}`);
        break;
      case '3':
        console.log(this.colors.bright + 'Session Info:' + this.colors.reset);
        console.log(`  TTL: 7 days`);
        console.log(`  Store: Memory`);
        break;
      case '4':
        console.log(this.colors.bright + 'Environment Variables:' + this.colors.reset);
        console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`  PORT: ${process.env.PORT || 5000}`);
        break;
    }

    await this.prompt('\nPress Enter to continue...');
  }
}
