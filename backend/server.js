import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 8080);
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 10),
  enableKeepAlive: true
});

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map(v => v.trim()) || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'online', database: 'online' });
  } catch (error) {
    console.error(error);
    res.status(503).json({ status: 'online', database: 'offline' });
  }
});

app.get('/api/colonies', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, owner, universe_id, metal, crystal FROM colonies ORDER BY id DESC LIMIT 100'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(port, () => console.log(`MySQL API listening on :${port}`));
