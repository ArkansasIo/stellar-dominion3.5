#!/usr/bin/env node
/**
 * Performance Monitoring Workflow
 * Monitors API response times, request volume, and system health
 */

import { logger } from '../logger.js';

async function monitorPerformance(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     ⚡ PERFORMANCE MONITORING                 ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    logger.info("PERF_MONITOR" as any, "Performance monitoring started");
    
    console.log('Monitoring API performance and system health...\n');
    
    const displayMetrics = () => {
      const apiLogs = logger.getLogs(undefined, 'API', 100);
      const timestamp = new Date().toLocaleTimeString();
      
      const responseTimes = apiLogs
        .map(log => {
          const match = log.message.match(/(\d+)ms/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(t => t > 0);
      
      const avgResponseTime = responseTimes.length > 0 
        ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)
        : '0';
      
      const maxResponseTime = responseTimes.length > 0 
        ? Math.max(...responseTimes)
        : 0;
      
      const errorCount = apiLogs.filter(l => l.level === 'error' || l.level === 'warn').length;
      const successCount = apiLogs.filter(l => l.level === 'info' || l.level === 'debug').length;
      
      console.clear();
      console.log('\n╔════════════════════════════════════════════════╗');
      console.log('║     ⚡ PERFORMANCE MONITORING                 ║');
      console.log('╚════════════════════════════════════════════════╝\n');
      console.log(`[${timestamp}] System Performance Metrics:\n`);
      
      console.log('API Performance:');
      console.log(`  Total Requests: ${apiLogs.length}`);
      console.log(`  Avg Response Time: ${avgResponseTime}ms`);
      console.log(`  Max Response Time: ${maxResponseTime}ms`);
      console.log(`  Successful: ${successCount}`);
      console.log(`  Errors/Warnings: ${errorCount}\n`);
      
      console.log('System Health:');
      const uptime = Math.floor(process.uptime());
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      console.log(`  Uptime: ${hours}h ${minutes}m`);
      console.log(`  Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\n`);
      
      console.log('Press Ctrl+C to exit...');
    };
    
    displayMetrics();
    setInterval(displayMetrics, 5000);
    
  } catch (error: any) {
    logger.error("PERF_MONITOR" as any, `Performance monitoring error: ${error?.message || String(error)}`);
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

monitorPerformance().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
