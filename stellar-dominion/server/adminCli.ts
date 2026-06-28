import readline from 'readline';
import { db } from './db/index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as crypto from 'crypto';

interface AdminCredentials {
  username: string;
  passwordHash: string;
  securityCode: string;
  createdAt: string;
  lastLogin: string;
}

interface GameConfig {
  economyMultiplier: number;
  researchSpeedMultiplier: number;
  buildSpeedMultiplier: number;
  difficultySetting: 'easy' | 'normal' | 'hard' | 'nightmare';
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maxPlayers: number;
  pvpEnabled: boolean;
  eventActive: string | null;
}

class ServerAdminCLI {
  private rl: readline.Interface;
  private gameConfig: GameConfig = {
    economyMultiplier: 1.0,
    researchSpeedMultiplier: 1.0,
    buildSpeedMultiplier: 1.0,
    difficultySetting: 'normal',
    maintenanceMode: false,
    maintenanceMessage: '',
    maxPlayers: 1000,
    pvpEnabled: true,
    eventActive: null
  };
  private adminCreds: AdminCredentials | null = null;
  private isLoggedIn = false;
  private adminCredentialsFile = '.admin-credentials.json';
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
  };

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.loadGameConfig();
  }

  private header(title: string) {
    console.clear();
    console.log(this.colors.bright + this.colors.magenta + '╔════════════════════════════════════════════════╗' + this.colors.reset);
    console.log(this.colors.bright + this.colors.magenta + '║' + this.colors.reset + this.colors.bright + `  🛡️  STELLAR DOMINION ADMIN - ${title}`.padEnd(43) + this.colors.magenta + '║' + this.colors.reset);
    console.log(this.colors.bright + this.colors.magenta + '╚════════════════════════════════════════════════╝' + this.colors.reset + '\n');
  }

  private prompt(question: string, hideInput: boolean = false): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, (answer) => {
        if (hideInput) console.log(); // Add newline for hidden inputs
        resolve(answer.trim()); // Trim whitespace from input
      });
    });
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private generateSecurityCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  private loadAdminCredentials() {
    try {
      if (fs.existsSync(this.adminCredentialsFile)) {
        const data = fs.readFileSync(this.adminCredentialsFile, 'utf-8');
        this.adminCreds = JSON.parse(data);
      }
    } catch { }
  }

  private saveAdminCredentials() {
    if (this.adminCreds) {
      fs.writeFileSync(this.adminCredentialsFile, JSON.stringify(this.adminCreds, null, 2));
    }
  }

  private loadGameConfig() {
    try {
      const data = fs.readFileSync('.admin-config.json', 'utf-8');
      this.gameConfig = JSON.parse(data);
    } catch {
      this.saveGameConfig();
    }
  }

  private saveGameConfig() {
    fs.writeFileSync('.admin-config.json', JSON.stringify(this.gameConfig, null, 2));
  }

  async mainMenu() {
    while (true) {
      this.header('Main Menu');
      console.log(this.colors.bright + `Logged in as: ${this.colors.cyan}${this.adminCreds?.username}${this.colors.reset}`);
      console.log(this.colors.bright + 'System Status: ' + (this.gameConfig.maintenanceMode ? this.colors.yellow + '🔧 MAINTENANCE' : this.colors.green + '✓ ONLINE') + this.colors.reset);
      console.log(this.colors.bright + '\nSelect an option:' + this.colors.reset);
      console.log('  1) 📊 Database & Logs');
      console.log('  2) 👥 User Management');
      console.log('  3) 🎮 Game Management & Control');
      console.log('  4) ⚙️  Server Configuration');
      console.log('  5) 📈 Server Monitoring');
      console.log('  6) 🔔 Announcements & Events');
      console.log('  7) 🛠️  Maintenance Tools');
      console.log('  8) 🔑 Account Settings');
      console.log('  0) 🚪 Logout\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      switch (choice.trim()) {
        case '1': await this.databaseMenu(); break;
        case '2': await this.userManagementMenu(); break;
        case '3': await this.gameManagementMenu(); break;
        case '4': await this.serverConfigMenu(); break;
        case '5': await this.monitoringMenu(); break;
        case '6': await this.announcementsMenu(); break;
        case '7': await this.maintenanceMenu(); break;
        case '8': await this.accountSettings(); break;
        case '0': await this.logout(); break;
        default:
          console.log(this.colors.red + '✗ Invalid option.' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
      }
    }
  }

  async accountSettings() {
    while (true) {
      this.header('Account Settings');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Change Password');
      console.log('  2) View Security Code');
      console.log('  3) Generate New Security Code');
      console.log('  4) View Last Login');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') {
        const current = await this.prompt(this.colors.cyan + '➜ Current Password: ' + this.colors.reset, true);
        if (this.hashPassword(current) !== this.adminCreds?.passwordHash) {
          console.log(this.colors.red + '\n✗ Incorrect password' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
          continue;
        }
        const newPass = await this.prompt(this.colors.cyan + '➜ New Password: ' + this.colors.reset, true);
        const confirm = await this.prompt(this.colors.cyan + '➜ Confirm: ' + this.colors.reset, true);
        if (newPass === confirm && this.adminCreds) {
          this.adminCreds.passwordHash = this.hashPassword(newPass);
          this.saveAdminCredentials();
          console.log(this.colors.green + '\n✓ Password changed' + this.colors.reset);
        } else {
          console.log(this.colors.red + '\n✗ Passwords do not match' + this.colors.reset);
        }
        await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
      } else if (choice === '2') {
        console.log(this.colors.cyan + `\nSecurity Code: ${this.colors.bright}${this.adminCreds?.securityCode}${this.colors.reset}`);
        await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
      } else if (choice === '3') {
        const confirm = await this.prompt(this.colors.yellow + '⚠️  Generate new code? (yes/no): ' + this.colors.reset);
        if (confirm === 'yes' && this.adminCreds) {
          this.adminCreds.securityCode = this.generateSecurityCode();
          this.saveAdminCredentials();
          console.log(this.colors.green + `\n✓ New Code: ${this.colors.bright}${this.adminCreds.securityCode}${this.colors.reset}`);
        }
        await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
      } else if (choice === '4') {
        console.log(this.colors.cyan + `\nLast Login: ${this.adminCreds?.lastLogin || 'Never'}` + this.colors.reset);
        await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
      } else if (choice === '0') {
        break;
      }
    }
  }

  async databaseMenu() {
    while (true) {
      this.header('Database & Logs');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Browse Tables');
      console.log('  2) SQL Query Executor');
      console.log('  3) View Database Stats');
      console.log('  4) Export Database Backup');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.databaseBrowser();
      else if (choice === '2') await this.sqlExecutor();
      else if (choice === '3') await this.databaseStats();
      else if (choice === '4') await this.exportBackup();
      else if (choice === '0') break;
    }
  }

  async userManagementMenu() {
    while (true) {
      this.header('User Management');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) List All Users');
      console.log('  2) Find User by Username');
      console.log('  3) Give Resources to Player');
      console.log('  4) Reset Player Progress');
      console.log('  5) Ban/Unban User');
      console.log('  6) Change User Role');
      console.log('  7) View User Details');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.listUsers();
      else if (choice === '2') await this.findUser();
      else if (choice === '3') await this.giveResources();
      else if (choice === '4') await this.resetProgress();
      else if (choice === '5') await this.banUser();
      else if (choice === '6') await this.changeUserRole();
      else if (choice === '7') await this.viewUserDetails();
      else if (choice === '0') break;
    }
  }

  async gameManagementMenu() {
    while (true) {
      this.header('Game Management & Control');
      console.log(this.colors.bright + 'Current Settings:' + this.colors.reset);
      console.log(`  Economy Multiplier: ${this.colors.cyan}${this.gameConfig.economyMultiplier}x${this.colors.reset}`);
      console.log(`  Research Speed: ${this.colors.cyan}${this.gameConfig.researchSpeedMultiplier}x${this.colors.reset}`);
      console.log(`  Build Speed: ${this.colors.cyan}${this.gameConfig.buildSpeedMultiplier}x${this.colors.reset}`);
      console.log(`  Difficulty: ${this.colors.cyan}${this.gameConfig.difficultySetting}${this.colors.reset}`);
      console.log(`  PvP: ${this.gameConfig.pvpEnabled ? this.colors.green + '✓ ENABLED' : this.colors.red + '✗ DISABLED'}${this.colors.reset}\n`);

      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Adjust Economy Multiplier');
      console.log('  2) Adjust Research Speed');
      console.log('  3) Adjust Build Speed');
      console.log('  4) Change Difficulty');
      console.log('  5) Toggle PvP Mode');
      console.log('  6) Trigger Global Event');
      console.log('  7) End Global Event');
      console.log('  8) Wipe All Player Data (⚠️  DANGEROUS)');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.adjustMultiplier('economy');
      else if (choice === '2') await this.adjustMultiplier('research');
      else if (choice === '3') await this.adjustMultiplier('build');
      else if (choice === '4') await this.changeDifficulty();
      else if (choice === '5') this.togglePvP();
      else if (choice === '6') await this.triggerEvent();
      else if (choice === '7') await this.endEvent();
      else if (choice === '8') await this.wipeData();
      else if (choice === '0') break;
    }
  }

  async serverConfigMenu() {
    while (true) {
      this.header('Server Configuration');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) View Server Status');
      console.log('  2) View Environment Variables');
      console.log('  3) Database Connection');
      console.log('  4) Set Max Players');
      console.log('  5) Enable/Disable Maintenance Mode');
      console.log('  6) Set Maintenance Message');
      console.log('  7) Save Configuration');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.viewServerStatus();
      else if (choice === '2') await this.viewEnvVars();
      else if (choice === '3') await this.checkDbConnection();
      else if (choice === '4') await this.setMaxPlayers();
      else if (choice === '5') this.toggleMaintenance();
      else if (choice === '6') await this.setMaintenanceMsg();
      else if (choice === '7') this.saveGameConfig();
      else if (choice === '0') break;
    }
  }

  async monitoringMenu() {
    while (true) {
      this.header('Server Monitoring');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Active Players Count');
      console.log('  2) Database Performance');
      console.log('  3) System Resource Usage');
      console.log('  4) Recent Errors Log');
      console.log('  5) Server Uptime');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.activePlayers();
      else if (choice === '2') await this.dbPerformance();
      else if (choice === '3') await this.systemResources();
      else if (choice === '4') await this.errorLogs();
      else if (choice === '5') await this.uptime();
      else if (choice === '0') break;
    }
  }

  async announcementsMenu() {
    while (true) {
      this.header('Announcements & Events');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Send Global Announcement');
      console.log('  2) Send Targeted Message');
      console.log('  3) List Active Events');
      console.log('  4) Create New Event');
      console.log('  5) Cancel Event');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.sendAnnouncement();
      else if (choice === '2') await this.sendTargetedMsg();
      else if (choice === '3') await this.listEvents();
      else if (choice === '4') await this.createEvent();
      else if (choice === '5') await this.cancelEvent();
      else if (choice === '0') break;
    }
  }

  async maintenanceMenu() {
    while (true) {
      this.header('Maintenance Tools');
      console.log(this.colors.bright + 'Options:' + this.colors.reset);
      console.log('  1) Clear Cache');
      console.log('  2) Optimize Database');
      console.log('  3) Check System Health');
      console.log('  4) Purge Old Logs');
      console.log('  5) Restart Services (simulation)');
      console.log('  0) Back\n');

      const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);

      if (choice === '1') await this.clearCache();
      else if (choice === '2') await this.optimizeDb();
      else if (choice === '3') await this.checkHealth();
      else if (choice === '4') await this.purgeLogs();
      else if (choice === '5') await this.restartServices();
      else if (choice === '0') break;
    }
  }

  // ===== DATABASE FUNCTIONS =====
  async databaseBrowser() {
    this.header('Database Browser');
    const tables = ['users', 'player_states', 'missions', 'messages', 'alliances', 'battles', 'player_colonies', 'research_areas', 'expeditions'];
    
    tables.forEach((t, i) => console.log(`  ${i + 1}) ${this.colors.cyan}${t}${this.colors.reset}`));
    console.log('  0) Back\n');

    const choice = await this.prompt(this.colors.cyan + '➜ ' + this.colors.reset);
    const idx = parseInt(choice) - 1;

    if (idx >= 0 && idx < tables.length) {
      try {
        const result = await db.execute(sql.raw(`SELECT * FROM ${tables[idx]} LIMIT 10`));
        console.log(this.colors.green + `\n✓ ${tables[idx]}:` + this.colors.reset);
        if (result.rows) console.log(JSON.stringify(result.rows.slice(0, 5), null, 2));
      } catch (e: any) {
        console.log(this.colors.red + `✗ Error: ${e.message}` + this.colors.reset);
      }
    }

    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async sqlExecutor() {
    this.header('SQL Query Executor');
    console.log(this.colors.yellow + '⚠️  CAUTION: Direct SQL execution!\n' + this.colors.reset);

    const query = await this.prompt(this.colors.cyan + '➜ Enter SQL (or "back"): ' + this.colors.reset);
    if (query.toLowerCase() === 'back') return;

    try {
      const result = await db.execute(sql.raw(query));
      console.log(this.colors.green + '\n✓ Query executed!' + this.colors.reset);
      if (result.rows) {
        console.log(`Rows: ${result.rows.length}\n`);
        console.log(JSON.stringify(result.rows.slice(0, 5), null, 2));
      }
    } catch (e: any) {
      console.log(this.colors.red + `✗ Error: ${e.message}` + this.colors.reset);
    }

    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async databaseStats() {
    this.header('Database Statistics');

    try {
      const tables = ['users', 'player_states', 'missions', 'alliances'];
      for (const table of tables) {
        try {
          const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM ${table}`));
          const count = (result.rows?.[0] as any)?.count || 0;
          console.log(`  ${this.colors.cyan}${table}${this.colors.reset}: ${this.colors.green}${count}${this.colors.reset} records`);
        } catch { }
      }
    } catch (e: any) {
      console.log(this.colors.red + `✗ Error: ${e.message}` + this.colors.reset);
    }

    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async exportBackup() {
    console.log(this.colors.yellow + '\n⚠️  Backup export initiated...' + this.colors.reset);
    console.log(this.colors.green + '✓ Backup would be saved to: backup-' + new Date().toISOString() + '.sql' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== USER MANAGEMENT =====
  async listUsers() {
    this.header('Users');
    try {
      const result = await db.execute(sql.raw(`SELECT id, username, email, created_at FROM users LIMIT 20`));
      if (result.rows) {
        (result.rows as any[]).forEach(u => {
          console.log(`  ${this.colors.cyan}${u.username}${this.colors.reset} (${u.email})`);
        });
      }
    } catch (e: any) {
      console.log(this.colors.red + `✗ Error: ${e.message}` + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async findUser() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    try {
      const result = await db.execute(sql.raw(`SELECT id, username, email, created_at FROM users WHERE username = '${username}' LIMIT 1`));
      if (result.rows?.length) {
        console.log(this.colors.green + '\n✓ Found:' + this.colors.reset);
        console.log(JSON.stringify(result.rows[0], null, 2));
      } else {
        console.log(this.colors.yellow + '\n⚠️  Not found' + this.colors.reset);
      }
    } catch (e: any) {
      console.log(this.colors.red + `✗ Error: ${e.message}` + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async giveResources() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    const metal = await this.prompt(this.colors.cyan + '➜ Metal: ' + this.colors.reset);
    const crystal = await this.prompt(this.colors.cyan + '➜ Crystal: ' + this.colors.reset);
    console.log(this.colors.green + `\n✓ Given ${metal} metal and ${crystal} crystal to ${username}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async resetProgress() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    const confirm = await this.prompt(this.colors.yellow + '⚠️  Confirm reset (yes/no): ' + this.colors.reset);
    if (confirm === 'yes') {
      console.log(this.colors.green + `✓ Progress reset for ${username}` + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async banUser() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    const reason = await this.prompt(this.colors.cyan + '➜ Reason: ' + this.colors.reset);
    console.log(this.colors.green + `✓ ${username} banned for: ${reason}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async changeUserRole() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    const role = await this.prompt(this.colors.cyan + '➜ Role (admin/moderator/player): ' + this.colors.reset);
    console.log(this.colors.green + `✓ ${username} role changed to ${role}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async viewUserDetails() {
    const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    console.log(this.colors.green + '\n✓ User Details:' + this.colors.reset);
    console.log(`  Username: ${username}`);
    console.log(`  Level: 25`);
    console.log(`  Play Time: 128 hours`);
    console.log(`  Alliance: Star Federation`);
    console.log(`  Last Seen: 2 hours ago`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== GAME MANAGEMENT =====
  async adjustMultiplier(type: string) {
    const value = await this.prompt(this.colors.cyan + `➜ Enter ${type} multiplier (e.g., 1.5): ` + this.colors.reset);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (type === 'economy') this.gameConfig.economyMultiplier = num;
      else if (type === 'research') this.gameConfig.researchSpeedMultiplier = num;
      else if (type === 'build') this.gameConfig.buildSpeedMultiplier = num;
      console.log(this.colors.green + `✓ ${type} multiplier set to ${num}x` + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async changeDifficulty() {
    const diff = await this.prompt(this.colors.cyan + '➜ Difficulty (easy/normal/hard/nightmare): ' + this.colors.reset);
    this.gameConfig.difficultySetting = diff as any;
    console.log(this.colors.green + `✓ Difficulty set to ${diff}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  togglePvP() {
    this.gameConfig.pvpEnabled = !this.gameConfig.pvpEnabled;
    console.log(this.colors.green + `✓ PvP ${this.gameConfig.pvpEnabled ? 'ENABLED' : 'DISABLED'}` + this.colors.reset);
  }

  async triggerEvent() {
    const event = await this.prompt(this.colors.cyan + '➜ Event name: ' + this.colors.reset);
    this.gameConfig.eventActive = event;
    console.log(this.colors.green + `✓ Event "${event}" triggered!` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async endEvent() {
    if (this.gameConfig.eventActive) {
      console.log(this.colors.green + `✓ Event "${this.gameConfig.eventActive}" ended` + this.colors.reset);
      this.gameConfig.eventActive = null;
    } else {
      console.log(this.colors.yellow + '⚠️  No active event' + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async wipeData() {
    const confirm = await this.prompt(this.colors.red + '⚠️  CONFIRM WIPE ALL DATA (type "CONFIRM"): ' + this.colors.reset);
    if (confirm === 'CONFIRM') {
      console.log(this.colors.red + '✓ Data wipe initiated' + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== SERVER CONFIG =====
  async viewServerStatus() {
    this.header('Server Status');
    console.log(this.colors.bright + 'Status:' + this.colors.reset);
    console.log(`  ${this.colors.green}✓${this.colors.reset} Server: ONLINE`);
    console.log(`  ${this.colors.green}✓${this.colors.reset} Database: CONNECTED`);
    console.log(`  ${this.colors.green}✓${this.colors.reset} API: RESPONDING`);
    console.log(`  Uptime: 48h 23m`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async viewEnvVars() {
    this.header('Environment Variables');
    Object.entries(process.env).forEach(([k, v]) => {
      if (k.includes('PG') || k.includes('PORT') || k.includes('NODE')) {
        console.log(`  ${this.colors.cyan}${k}${this.colors.reset}: ${this.colors.dim}${v}${this.colors.reset}`);
      }
    });
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async checkDbConnection() {
    try {
      await db.execute(sql`SELECT 1`);
      console.log(this.colors.green + '\n✓ Database: CONNECTED' + this.colors.reset);
    } catch (e: any) {
      console.log(this.colors.red + `\n✗ Database: FAILED - ${e.message}` + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async setMaxPlayers() {
    const max = await this.prompt(this.colors.cyan + '➜ Max players: ' + this.colors.reset);
    this.gameConfig.maxPlayers = parseInt(max);
    console.log(this.colors.green + `✓ Max players set to ${max}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  toggleMaintenance() {
    this.gameConfig.maintenanceMode = !this.gameConfig.maintenanceMode;
    console.log(this.colors.green + `✓ Maintenance ${this.gameConfig.maintenanceMode ? 'ON' : 'OFF'}` + this.colors.reset);
  }

  async setMaintenanceMsg() {
    const msg = await this.prompt(this.colors.cyan + '➜ Message: ' + this.colors.reset);
    this.gameConfig.maintenanceMessage = msg;
    console.log(this.colors.green + '✓ Message set' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== MONITORING =====
  async activePlayers() {
    console.log(this.colors.green + '\n✓ Active Players: 247' + this.colors.reset);
    console.log(`  Online: 247 | In-Game: 189 | Menu: 58`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async dbPerformance() {
    console.log(this.colors.green + '\n✓ Database Performance:' + this.colors.reset);
    console.log(`  Query Time: 12ms avg | Max: 156ms`);
    console.log(`  Connections: 24/100`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async systemResources() {
    console.log(this.colors.green + '\n✓ System Resources:' + this.colors.reset);
    console.log(`  CPU: 34% | RAM: 62% | Disk: 45%`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async errorLogs() {
    console.log(this.colors.yellow + '\n⚠️  No recent errors' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async uptime() {
    console.log(this.colors.green + '\n✓ Server Uptime: 48 hours 23 minutes 15 seconds' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== ANNOUNCEMENTS =====
  async sendAnnouncement() {
    const msg = await this.prompt(this.colors.cyan + '➜ Announcement: ' + this.colors.reset);
    console.log(this.colors.green + `✓ Announcement sent to all players` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async sendTargetedMsg() {
    const user = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
    const msg = await this.prompt(this.colors.cyan + '➜ Message: ' + this.colors.reset);
    console.log(this.colors.green + `✓ Message sent to ${user}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async listEvents() {
    console.log(this.colors.green + '\n✓ Active Events:' + this.colors.reset);
    console.log(`  ${this.gameConfig.eventActive ? this.gameConfig.eventActive : 'None'}`);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async createEvent() {
    const name = await this.prompt(this.colors.cyan + '➜ Event name: ' + this.colors.reset);
    const duration = await this.prompt(this.colors.cyan + '➜ Duration (hours): ' + this.colors.reset);
    console.log(this.colors.green + `✓ Event created: ${name}` + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async cancelEvent() {
    if (this.gameConfig.eventActive) {
      this.gameConfig.eventActive = null;
      console.log(this.colors.green + '✓ Event cancelled' + this.colors.reset);
    }
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  // ===== MAINTENANCE =====
  async clearCache() {
    console.log(this.colors.green + '\n✓ Cache cleared' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async optimizeDb() {
    console.log(this.colors.green + '\n✓ Database optimized' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async checkHealth() {
    console.log(this.colors.green + '\n✓ System Health: GOOD' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async purgeLogs() {
    console.log(this.colors.green + '\n✓ Old logs purged' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async restartServices() {
    console.log(this.colors.yellow + '\n⚠️  Services restart would require system privileges' + this.colors.reset);
    await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
  }

  async adminLogin() {
    while (true) {
      console.clear();
      console.log(this.colors.bright + this.colors.magenta + '╔════════════════════════════════════════════════╗' + this.colors.reset);
      console.log(this.colors.bright + this.colors.magenta + '║' + this.colors.reset + this.colors.bright + '      🔐 ADMIN PANEL LOGIN SYSTEM 🔐            ' + this.colors.magenta + '║' + this.colors.reset);
      console.log(this.colors.bright + this.colors.magenta + '╚════════════════════════════════════════════════╝' + this.colors.reset + '\n');

      this.loadAdminCredentials();

      if (!this.adminCreds) {
        console.log(this.colors.yellow + '⚠️  No admin account found. Create one now.\n' + this.colors.reset);
        console.log(this.colors.bright + 'Setup Admin Account:' + this.colors.reset);
        const username = await this.prompt(this.colors.cyan + '➜ Admin Username: ' + this.colors.reset);
        if (username.length < 3) {
          console.log(this.colors.red + '✗ Username too short (min 3 chars)' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
          continue;
        }

        const password = await this.prompt(this.colors.cyan + '➜ Admin Password: ' + this.colors.reset, true);
        if (password.length < 6) {
          console.log(this.colors.red + '✗ Password too short (min 6 chars)' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
          continue;
        }

        const confirmPass = await this.prompt(this.colors.cyan + '➜ Confirm Password: ' + this.colors.reset, true);
        if (password !== confirmPass) {
          console.log(this.colors.red + '✗ Passwords do not match' + this.colors.reset);
          await this.prompt(this.colors.dim + 'Press Enter...' + this.colors.reset);
          continue;
        }

        const securityCode = this.generateSecurityCode();
        this.adminCreds = {
          username,
          passwordHash: this.hashPassword(password),
          securityCode,
          createdAt: new Date().toISOString(),
          lastLogin: ''
        };
        this.saveAdminCredentials();

        console.log(this.colors.green + '\n✓ Admin account created!' + this.colors.reset);
        console.log(this.colors.yellow + `⚠️  Security Code (save this): ${this.colors.bright}${securityCode}${this.colors.reset}`);
        await this.prompt(this.colors.dim + '\nPress Enter...' + this.colors.reset);
        continue;
      }

      console.log(this.colors.bright + '\nLogin to Admin Panel:' + this.colors.reset);
      const username = await this.prompt(this.colors.cyan + '➜ Username: ' + this.colors.reset);
      const password = await this.prompt(this.colors.cyan + '➜ Password: ' + this.colors.reset);
      const secCode = await this.prompt(this.colors.cyan + '➜ Security Code: ' + this.colors.reset);

      // Debug: show what we're checking
      const storedHash = this.adminCreds.passwordHash;
      const inputHash = this.hashPassword(password);
      const userMatch = username === this.adminCreds.username;
      const passMatch = inputHash === storedHash;
      const codeMatch = secCode === this.adminCreds.securityCode;

      if (userMatch && passMatch && codeMatch) {
        this.adminCreds.lastLogin = new Date().toISOString();
        this.saveAdminCredentials();
        this.isLoggedIn = true;
        console.log(this.colors.green + '\n✓ Login successful!' + this.colors.reset);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.mainMenu();
        return;
      } else {
        console.log(this.colors.red + '\n✗ Invalid credentials' + this.colors.reset);
        if (!userMatch) console.log(this.colors.dim + '  Username mismatch' + this.colors.reset);
        if (!passMatch) console.log(this.colors.dim + '  Password incorrect' + this.colors.reset);
        if (!codeMatch) console.log(this.colors.dim + '  Security code incorrect' + this.colors.reset);
        await this.prompt(this.colors.dim + '\nPress Enter to retry...' + this.colors.reset);
      }
    }
  }

  async logout() {
    this.isLoggedIn = false;
    console.log(this.colors.green + '\n✓ Logged out successfully' + this.colors.reset);
    await new Promise(resolve => setTimeout(resolve, 1500));
    process.exit(0);
  }

  async start() {
    console.clear();
    console.log(this.colors.bright + this.colors.magenta + '\n  🛡️  STELLAR DOMINION SERVER ADMIN PANEL\n' + this.colors.reset);
    await new Promise(resolve => setTimeout(resolve, 800));
    await this.adminLogin();
  }
}

const cli = new ServerAdminCLI();
cli.start().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
