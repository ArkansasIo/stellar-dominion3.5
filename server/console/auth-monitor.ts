#!/usr/bin/env node
/**
 * Authentication & Session Monitoring Workflow
 * Monitors login attempts, sessions, and auth events
 */

import { logger } from '../logger.js';

async function monitorAuth(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     🔐 AUTH & SESSION MONITORING              ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    logger.info("AUTH_MONITOR" as any, "Auth monitoring started");
    
    console.log('Monitoring authentication events in real-time...\n');
    console.log('Legend:');
    console.log('  ✅ SUCCESS - Successful login/auth event');
    console.log('  ❌ FAILED  - Failed login/auth attempt');
    console.log('  ⚠️  WARN   - Suspicious activity detected\n');
    
    let authLogs: any[] = [];
    let loginAttempts = 0;
    let failedAttempts = 0;
    
    const updateStats = () => {
      authLogs = logger.getLogs(undefined, 'AUTH', 100);
      loginAttempts = authLogs.filter(l => l.message.includes('Login')).length;
      failedAttempts = authLogs.filter(l => l.level === 'warn').length;
    };
    
    const displayStats = () => {
      updateStats();
      const timestamp = new Date().toLocaleTimeString();
      console.clear();
      console.log('\n╔════════════════════════════════════════════════╗');
      console.log('║     🔐 AUTH & SESSION MONITORING              ║');
      console.log('╚════════════════════════════════════════════════╝\n');
      console.log(`[${timestamp}] Real-time Auth Statistics:\n`);
      console.log(`  Total Auth Events: ${authLogs.length}`);
      console.log(`  Login Attempts: ${loginAttempts}`);
      console.log(`  Failed Attempts: ${failedAttempts}`);
      console.log(`  Success Rate: ${loginAttempts > 0 ? ((loginAttempts - failedAttempts) / loginAttempts * 100).toFixed(1) : 0}%\n`);
      
      console.log('Recent Auth Events:');
      authLogs.slice(-5).reverse().forEach(log => {
        const icon = log.level === 'error' ? '❌' : log.level === 'warn' ? '⚠️ ' : '✅';
        console.log(`  ${icon} ${log.timestamp} [${log.category}] ${log.message}`);
      });
      
      console.log('\nPress Ctrl+C to exit...');
    };
    
    displayStats();
    setInterval(displayStats, 5000);
    
  } catch (error: any) {
    logger.error("AUTH_MONITOR" as any, `Auth monitoring error: ${error?.message || String(error)}`);
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

monitorAuth().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
