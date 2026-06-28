#!/usr/bin/env node

/**
 * Stellar Dominion - Backend Console Workflow
 * 
 * This is a separate workflow for running the backend console menu interactively.
 * It provides a CLI interface for server management, log viewing, and diagnostics.
 * 
 * To use as a Replit workflow, add this command to your .replit file:
 * [backend-console]
 * run = "tsx server/console/index.ts"
 */

import { ConsoleMenu } from '../consoleMenu.js';
import { logger } from '../logger.js';

async function main(): Promise<void> {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     🖥️  STELLAR DOMINION BACKEND CONSOLE      ║');
  console.log('║          Server Management Interface           ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\nInitializing console...\n');

  const consoleMenu = new ConsoleMenu();
  
  logger.info("CONSOLE" as any, "Backend console started");
  console.log('Type your choices and press Enter to navigate the menu.\n');
  
  try {
    await consoleMenu.start();
  } catch (error: any) {
    logger.error("CONSOLE" as any, `Console error: ${error?.message || String(error)}`);
    console.error('Console error:', error);
    process.exit(1);
  }
  
  logger.info("CONSOLE" as any, "Backend console closed");
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
