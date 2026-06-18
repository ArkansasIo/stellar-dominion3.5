#!/usr/bin/env node
/**
 * Log Export & Analytics Workflow
 * Exports server logs to file and generates analytics reports
 */

import { logger } from '../logger.js';
import fs from 'fs';
import path from 'path';

async function exportLogs(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║     📤 LOG EXPORT & ANALYTICS                ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    logger.info("LOG_EXPORT" as any, "Log export started");
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logsDir = 'server/logs';
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log(`✅ Created logs directory: ${logsDir}`);
    }
    
    // Export all logs
    const allLogs = logger.export();
    const jsonFile = path.join(logsDir, `logs-export-${timestamp}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(allLogs, null, 2));
    console.log(`✅ Exported JSON logs: ${jsonFile}`);
    
    // Generate analytics
    const stats = logger.getStats();
    const analytics = {
      exportedAt: new Date().toISOString(),
      stats,
      summary: {
        total: allLogs.length,
        byLevel: {
          info: stats.info,
          warn: stats.warnings,
          error: stats.errors,
          debug: stats.debug
        },
        errorRate: stats.total > 0 ? ((stats.errors / stats.total) * 100).toFixed(2) + '%' : '0%'
      }
    };
    
    const analyticsFile = path.join(logsDir, `analytics-${timestamp}.json`);
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
    console.log(`✅ Generated analytics: ${analyticsFile}\n`);
    
    console.log('Analytics Summary:');
    console.log(`  Total Logs: ${analytics.summary.total}`);
    console.log(`  Info Logs: ${analytics.summary.byLevel.info}`);
    console.log(`  Warnings: ${analytics.summary.byLevel.warn}`);
    console.log(`  Errors: ${analytics.summary.byLevel.error}`);
    console.log(`  Debug Logs: ${analytics.summary.byLevel.debug}`);
    console.log(`  Error Rate: ${analytics.summary.errorRate}\n`);
    
    console.log(`Files saved to: ${path.resolve(logsDir)}`);
    
    logger.info("LOG_EXPORT" as any, "Log export completed successfully");
    console.log('\n✅ Export complete!');
    
  } catch (error: any) {
    logger.error("LOG_EXPORT" as any, `Log export error: ${error?.message || String(error)}`);
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

exportLogs().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
