import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.MYSQL_API_PORT ?? 8080);

const allowedOrigins = (process.env.CORS_ORIGINS ?? '*')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  credentials: false,
}));
app.use(express.json({ limit: '1mb' }));

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
  ssl: process.env.MYSQL_SSL === 'true' ? {} : undefined,
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'mysql', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(503).json({ ok: false, database: 'mysql' });
  }
});

app.get('/api/config', (_req, res) => {
  res.json({
    apiBaseUrl: process.env.PUBLIC_API_BASE_URL ?? '',
    appName: process.env.PUBLIC_APP_NAME ?? 'Stellar Dominion',
  });
});

app.get('/api/players', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, empire_name, created_at FROM players ORDER BY id DESC LIMIT 100',
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load players' });
  }
});

app.post('/api/players', async (req, res) => {
  const { username, empireName } = req.body as { username?: string; empireName?: string };
  if (!username || !empireName) {
    res.status(400).json({ error: 'username and empireName are required' });
    return;
  }

  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO players (username, empire_name) VALUES (?, ?)',
      [username.trim(), empireName.trim()],
    );
    res.status(201).json({ id: result.insertId, username, empireName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create player' });
  }
});

app.listen(port, () => {
  console.log(`MySQL API listening on http://localhost:${port}`);
});
