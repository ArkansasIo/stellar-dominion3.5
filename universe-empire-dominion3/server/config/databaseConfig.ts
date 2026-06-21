// Database Configuration
export const DATABASE_CONFIG = {
  // Connection settings
  connection: {
    provider: process.env.DATABASE_URL ? 'neon' : 'replit',
    connectionString: process.env.DATABASE_URL || constructConnectionString(),
    pool: {
      min: 1,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },

  // Database name and details
  database: {
    name: process.env.PGDATABASE || 'stellar_dominion',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'postgres',
  },

  // Schema initialization
  schema: {
    autoCreate: true,
    autoMigrate: true,
  },

  // Timeouts and retries
  timeouts: {
    queryTimeout: 30000, // 30 seconds
    connectionTimeout: 5000, // 5 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },

  // Logging
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    logQueries: process.env.LOG_QUERIES === 'true',
    logErrors: true,
  },
};

function constructConnectionString(): string {
  const pghost = process.env.PGHOST;
  const pgport = process.env.PGPORT;
  const pguser = process.env.PGUSER;
  const pgpassword = process.env.PGPASSWORD;
  const pgdatabase = process.env.PGDATABASE;
  
  if (!pghost || !pgport || !pguser || !pgpassword || !pgdatabase) {
    throw new Error('Missing Replit database connection environment variables');
  }
  
  return `postgresql://${pguser}:${pgpassword}@${pghost}:${pgport}/${pgdatabase}`;
}
