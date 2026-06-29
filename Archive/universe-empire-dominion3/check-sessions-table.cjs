const { pool } = require('./server/db');

async function checkAndCreateTable() {
  try {
    // Check if table exists
    const checkResult = await pool.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_sessions')"
    );
    console.log('Table exists:', checkResult.rows[0].exists);

    if (!checkResult.rows[0].exists) {
      console.log('Creating user_sessions table...');
      await pool.query(`
        CREATE TABLE user_sessions (
          sid VARCHAR(255) PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP NOT NULL
        )
      `);
      console.log('Table created successfully');
      
      // Create index
      await pool.query(
        'CREATE INDEX IDX_session_expire ON user_sessions(expire)'
      );
      console.log('Index created successfully');
    } else {
      console.log('Table already exists, no action needed');
    }

    // Verify
    const verifyResult = await pool.query(
      "SELECT COUNT(*) FROM user_sessions"
    );
    console.log('Row count:', verifyResult.rows[0].count);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAndCreateTable();