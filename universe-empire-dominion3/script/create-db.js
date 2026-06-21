import pg from 'pg';
const { Client } = pg;

async function tryConnection(config) {
  const client = new Client(config);
  try {
    await client.connect();
    return { client, success: true };
  } catch (error) {
    return { client: null, success: false, error: error.message };
  }
}

async function createDatabase() {
  console.log('🔄 Trying to connect to PostgreSQL...\n');

  // Try different authentication methods
  const authMethods = [
    { user: 'postgres', password: '', label: 'no password' },
    { user: 'postgres', password: 'postgres', label: 'password: postgres' },
    { user: 'postgres', password: 'admin', label: 'password: admin' },
    { user: 'postgres', password: 'root', label: 'password: root' },
  ];

  let client = null;

  for (const auth of authMethods) {
    console.log(`Trying postgres user with ${auth.label}...`);
    const result = await tryConnection({
      host: 'localhost',
      port: 5432,
      user: auth.user,
      password: auth.password,
      database: 'postgres'
    });

    if (result.success) {
      client = result.client;
      console.log(`✅ Connected with ${auth.label}\n`);
      break;
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
  }

  if (!client) {
    console.error('\n❌ Could not connect to PostgreSQL with any method.');
    console.error('💡 Please run this command manually in psql:');
    console.error('   CREATE DATABASE stellar_dominion;');
    console.error('\nOr provide the correct password.');
    process.exit(1);
  }

  try {
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'stellar_dominion'"
    );

    if (result.rows.length > 0) {
      console.log('ℹ️  Database stellar_dominion already exists');
    } else {
      // Create the database
      await client.query('CREATE DATABASE stellar_dominion');
      console.log('✅ Database stellar_dominion created successfully');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
