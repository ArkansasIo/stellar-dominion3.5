#!/usr/bin/env ts-node
/**
 * TypeScript Universal Debug Helper
 * Perfect for Node.js, Next.js, Express, NestJS, etc.
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const LOG_FILE = `debug_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
const logger = {
  info: (msg: string) => log('INFO', msg),
  success: (msg: string) => log('✅', msg),
  error: (msg: string) => log('❌', msg),
  debug: (msg: string) => log('DEBUG', msg),
};

function log(level: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const line = `[${timestamp}] ${level} | ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function runCommand(command: string, options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  logger.info(`Running: ${command}`);
  
  try {
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      ...options,
    });
    if (output) logger.debug(output.trim());
    logger.success('Command completed successfully');
    return true;
  } catch (err: any) {
    logger.error(`Command failed: ${err.message}`);
    if (err.stdout) logger.debug(err.stdout);
    if (err.stderr) logger.error(err.stderr);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'run';

  console.log('='.repeat(60));
  logger.info('🚀 TypeScript Debug Session Started');
  console.log('='.repeat(60));

  // Clean previous logs if requested
  if (args.includes('--clean')) {
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
    logger.info('🧹 Cleaned old debug logs');
  }

  // Install dependencies
  if (args.includes('--install') || args.includes('-i')) {
    logger.info('📦 Installing dependencies...');
    runCommand('npm install');
  }

  // Build the project
  if (args.includes('--build') || args.includes('-b')) {
    logger.info('🔨 Building TypeScript project...');
    const success = runCommand('npx tsc --noEmit false');
    if (!success) {
      logger.error('Build failed. Check errors above.');
      process.exit(1);
    }
  }

  // Run the project
  if (mode === 'run' || args.includes('--run')) {
    const entryPoint = findEntryPoint();
    if (entryPoint) {
      logger.info(`▶️  Starting application from: ${entryPoint}`);
      
      // Use ts-node for direct TS execution (great for debugging)
      if (fs.existsSync('tsconfig.json')) {
        runCommand(`npx ts-node ${entryPoint}`);
      } else {
        runCommand(`node ${entryPoint.replace('.ts', '.js')}`);
      }
    } else {
      logger.error('Could not find main entry point (index.ts or main.ts)');
    }
  }

  logger.success('🏁 Debug session finished');
}

function findEntryPoint(): string | null {
  const candidates = [
    'src/index.ts',
    'src/main.ts',
    'index.ts',
    'app.ts',
    'server.ts',
    'dist/index.js',
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }
  return null;
}

// Run the script
main();