import type { Express, Request, Response } from "express";
import crypto from "crypto";

// ─── Constants ──────────────────────────────────────────

const COOKIE_NAME = "phpmyadmin_sid";

const LOGIN_PAGE_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #1a1a2e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
}
.login-container {
  background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
  border-radius: 16px;
  padding: 40px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 150, 255, 0.15);
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.login-header .logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #00d4ff, #007bff);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}
.login-header h1 { font-size: 22px; font-weight: 600; color: #e0e0e0; letter-spacing: 0.5px; }
.login-header p { color: #8892b0; font-size: 13px; margin-top: 6px; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-size: 13px; font-weight: 500; color: #a0aec0;
  margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;
}
.form-group input {
  width: 100%; padding: 12px 14px; background: #0d1b3e;
  border: 1px solid rgba(0, 150, 255, 0.2); border-radius: 10px;
  color: #e0e0e0; font-size: 14px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus { border-color: #00d4ff; box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1); }
.form-group input::placeholder { color: #4a5568; }
.form-options { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.form-options label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #a0aec0; cursor: pointer; }
.form-options label input[type="checkbox"] { accent-color: #00d4ff; width: 16px; height: 16px; }
.form-options a { font-size: 13px; color: #00d4ff; text-decoration: none; }
.form-options a:hover { text-decoration: underline; }
.btn-login {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #00d4ff, #007bff);
  border: none; border-radius: 10px; color: #fff;
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s; letter-spacing: 0.5px;
}
.btn-login:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4); }
.btn-login:active { transform: translateY(0); }
.error-message {
  background: rgba(255, 71, 87, 0.12); border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff6b6b; padding: 10px 14px; border-radius: 8px;
  font-size: 13px; margin-bottom: 16px; display: none;
}
.error-message.visible { display: block; }
.server-badge { text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
.server-badge span { font-size: 11px; color: #4a5568; font-family: monospace; }
.server-info { display: flex; justify-content: center; gap: 16px; margin-top: 8px; }
.server-info .info-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #4a5568; font-family: monospace; }
.server-info .info-item .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.server-info .info-item .dot.green { background: #51cf66; }
.footer-text { text-align: center; margin-top: 24px; font-size: 12px; color: #4a5568; }
.footer-text a { color: #00d4ff; text-decoration: none; }
`;

const DASHBOARD_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #0a0e1a; color: #e0e0e0; min-height: 100vh;
}
.topbar {
  background: linear-gradient(135deg, #0f1a3a, #162447);
  border-bottom: 1px solid rgba(0, 150, 255, 0.12);
  padding: 0 24px; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-left .logo-small {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #00d4ff, #007bff);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 14px; color: #fff;
}
.topbar-left h2 { font-size: 16px; font-weight: 600; }
.topbar-left .badge { background: rgba(0, 212, 255, 0.12); color: #00d4ff; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.topbar-right .user-info { font-size: 13px; color: #8892b0; }
.topbar-right .user-info strong { color: #e0e0e0; }
.topbar-right .role-badge { background: rgba(81, 207, 102, 0.12); color: #51cf66; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-family: monospace; text-transform: capitalize; }
.btn-logout { padding: 6px 14px; background: rgba(255, 71, 87, 0.1); border: 1px solid rgba(255, 71, 87, 0.2); border-radius: 6px; color: #ff6b6b; font-size: 12px; cursor: pointer; text-decoration: none; transition: background 0.15s; }
.btn-logout:hover { background: rgba(255, 71, 87, 0.2); }
.container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
.welcome-section { margin-bottom: 32px; }
.welcome-section h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.welcome-section p { color: #8892b0; font-size: 14px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
.stat-card { background: linear-gradient(135deg, #111c3a, #1a2744); border: 1px solid rgba(0, 150, 255, 0.08); border-radius: 12px; padding: 20px; }
.stat-card .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; margin-bottom: 6px; }
.stat-card .stat-value { font-size: 28px; font-weight: 700; font-family: monospace; }
.stat-card .stat-value.blue { color: #00d4ff; }
.stat-card .stat-value.green { color: #51cf66; }
.stat-card .stat-value.yellow { color: #ffd43b; }
.stat-card .stat-value.purple { color: #845ef7; }
.stat-card .stat-sub { font-size: 12px; color: #4a5568; margin-top: 4px; }
.action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 32px; }
.action-card { background: linear-gradient(135deg, #111c3a, #1a2744); border: 1px solid rgba(0, 150, 255, 0.08); border-radius: 12px; padding: 24px; cursor: pointer; transition: border-color 0.2s, transform 0.15s; text-decoration: none; color: inherit; display: block; }
.action-card:hover { border-color: rgba(0, 212, 255, 0.3); transform: translateY(-2px); }
.action-card .icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
.action-card .icon.blue { background: rgba(0, 212, 255, 0.1); }
.action-card .icon.green { background: rgba(81, 207, 102, 0.1); }
.action-card .icon.purple { background: rgba(132, 94, 247, 0.1); }
.action-card .icon.orange { background: rgba(255, 159, 67, 0.1); }
.action-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.action-card p { font-size: 13px; color: #8892b0; line-height: 1.5; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #ccc; }
`;

// ─── In-memory session store ──────────────────────────

interface PhpMyAdminSession {
  userId: string;
  username: string;
  role: string;
  loginTime: number;
  ip: string;
}

const sessions = new Map<string, PhpMyAdminSession>();

function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

const MAX_SESSIONS = 1000;

function cleanExpiredSessions(): void {
  const now = Date.now();
  const maxAge = 4 * 60 * 60 * 1000; // 4 hours
  for (const [sid, session] of sessions.entries()) {
    if (now - session.loginTime > maxAge) {
      sessions.delete(sid);
    }
  }
  // If still over limit, remove oldest sessions
  if (sessions.size > MAX_SESSIONS) {
    const entries = [...sessions.entries()].sort((a, b) => a[1].loginTime - b[1].loginTime);
    const toRemove = entries.slice(0, entries.length - MAX_SESSIONS);
    for (const [sid] of toRemove) {
      sessions.delete(sid);
    }
  }
}

// Clean expired sessions every 15 minutes
setInterval(cleanExpiredSessions, 15 * 60 * 1000);

// ─── Helper functions ──────────────────────────────────

function getUserFromRequest(req: Request): PhpMyAdminSession | null {
  const sid = req.cookies?.[COOKIE_NAME];
  if (!sid) return null;
  const session = sessions.get(sid);
  if (!session) return null;
  if (session.ip !== req.ip) return null;
  return session;
}

function escapeHtml(str: string): string {
  const amp = String.fromCharCode(38);
  const lt = String.fromCharCode(60);
  const gt = String.fromCharCode(62);
  const quot = String.fromCharCode(34);
  const apos = String.fromCharCode(39);
  const semi = String.fromCharCode(59);
  const ampEntity = amp + "amp" + semi;
  const ltEntity = amp + "lt" + semi;
  const gtEntity = amp + "gt" + semi;
  const quotEntity = amp + "quot" + semi;
  const aposEntity = amp + "#039" + semi;
  return str
    .replace(new RegExp(amp, "g"), ampEntity)
    .replace(new RegExp(lt, "g"), ltEntity)
    .replace(new RegExp(gt, "g"), gtEntity)
    .replace(new RegExp(quot, "g"), quotEntity)
    .replace(new RegExp(apos, "g"), aposEntity);
}

function renderLoginPage(error?: string): string {
  const errorBlock = error
    ? `<div class="error-message visible">${escapeHtml(error)}</div>`
    : `<div class="error-message"></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>phpMyAdmin &middot; Database Login</title>
  <style>${LOGIN_PAGE_CSS}</style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="logo">DB</div>
      <h1>phpMyAdmin Portal</h1>
      <p>Secure database management login</p>
    </div>
    <form method="POST" action="/phpmyadmin/login">
      ${errorBlock}
      <div class="form-group">
        <label for="username">Username / Email</label>
        <input type="text" id="username" name="username" placeholder="admin@universee.game" required autocomplete="username" autofocus>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" required autocomplete="current-password">
      </div>
      <div class="form-options">
        <label>
          <input type="checkbox" name="remember" checked>
          Remember me
        </label>
        <a href="/phpmyadmin/forgot">Forgot password?</a>
      </div>
      <button type="submit" class="btn-login">Sign In to Database Manager</button>
    </form>
    <div class="server-badge">
      <span>PostgreSQL &bull; Server v16</span>
      <div class="server-info">
        <div class="info-item"><span class="dot green"></span> Online</div>
        <div class="info-item">Port 5432</div>
      </div>
    </div>
  </div>
  <div class="footer-text">
    Universe Empire Dominion &mdash; <a href="/">Back to Game</a>
  </div>
</body>
</html>`;
}

function renderDashboard(session: PhpMyAdminSession, stats: any): string {
  const tableCount = stats?.tableCount ?? 0;
  const dbSize = stats?.dbSize ?? "0 B";
  const activeConns = stats?.activeConnections ?? 0;
  const serverVersion = stats?.serverVersion ?? "16";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>phpMyAdmin &middot; Dashboard</title>
  <style>${DASHBOARD_CSS}</style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-left">
      <div class="logo-small">DB</div>
      <h2>phpMyAdmin</h2>
      <span class="badge">v5.2.1</span>
    </div>
    <div class="topbar-right">
      <span class="user-info">Welcome, <strong>${escapeHtml(session.username)}</strong></span>
      <span class="role-badge">${escapeHtml(session.role)}</span>
      <a href="/phpmyadmin/logout" class="btn-logout">Logout</a>
    </div>
  </div>

  <div class="container">
    <div class="welcome-section">
      <h1>Database Control Panel</h1>
      <p>PostgreSQL management interface &mdash; ${escapeHtml(session.role)} access</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Database Tables</div>
        <div class="stat-value blue">${tableCount}</div>
        <div class="stat-sub">Across all schemas</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Database Size</div>
        <div class="stat-value green">${escapeHtml(dbSize)}</div>
        <div class="stat-sub">Total storage used</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Connections</div>
        <div class="stat-value yellow">${activeConns}</div>
        <div class="stat-sub">PostgreSQL server</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Server Version</div>
        <div class="stat-value purple">${escapeHtml(serverVersion)}</div>
        <div class="stat-sub">PostgreSQL</div>
      </div>
    </div>

    <h3 class="section-title">Quick Actions</h3>
    <div class="action-grid">
      <a href="/api/admin/db/tables" target="_blank" rel="noopener noreferrer" class="action-card">
        <div class="icon blue">&#x1F4CA;</div>
        <h3>Browse Tables</h3>
        <p>View, search, and explore all database tables with column details, indexes, and row counts.</p>
      </a>
      <a href="/api/admin/db/status" target="_blank" rel="noopener noreferrer" class="action-card">
        <div class="icon green">&#x1F4C8;</div>
        <h3>Server Status</h3>
        <p>View PostgreSQL server metrics, active queries, connection pools, and overall health.</p>
      </a>
      <a href="/api/admin/db/query" target="_blank" rel="noopener noreferrer" class="action-card">
        <div class="icon purple">&#x26A1;</div>
        <h3>SQL Query</h3>
        <p>Execute raw SQL queries with result sets, write confirmation, and performance timing.</p>
      </a>
      <a href="/database-admin" target="_blank" rel="noopener noreferrer" class="action-card">
        <div class="icon orange">&#x1F6E0;&#xFE0F;</div>
        <h3>Full Database Admin</h3>
        <p>Launch the complete web-based database management interface with all tools and features.</p>
      </a>
    </div>
  </div>
</body>
</html>`;
}

// ─── Auth helper (reuses existing user DB) ─────────────

async function authenticateUser(
  username: string,
  password: string,
  db: any,
  adminUsers: any,
  users: any,
  eq: any,
  ilike: any,
  or: any,
): Promise<{ userId: string; username: string; role: string } | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(
        username.includes("@")
          ? ilike(users.email, username)
          : or(ilike(users.username, username), ilike(users.email, username)),
      )
      .limit(1);

    if (!user) return null;

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (user.passwordHash !== hash) return null;

    const [adminRecord] = await db
      .select({ role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.userId, user.id))
      .limit(1);

    if (!adminRecord) return null;

    return {
      userId: user.id,
      username: user.username || user.email,
      role: adminRecord.role || "admin",
    };
  } catch (err) {
    console.error("[phpMyAdmin] Auth error:", err);
    return null;
  }
}

/**
 * Try to get an admin session from the main Express session (connect.sid)
 * so phpMyAdmin piggybacks on the same admin login.
 */
async function getAdminUserFromExpressSession(
  req: Request,
  db: any,
  adminUsers: any,
  users: any,
  eq: any,
): Promise<{ userId: string; username: string; role: string } | null> {
  try {
    const userId = (req as any).session?.userId;
    if (!userId) return null;

    const [adminRecord] = await db
      .select({ role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId))
      .limit(1);

    if (!adminRecord) return null;

    const [user] = await db
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return {
      userId: user.id,
      username: user.username || user.email,
      role: adminRecord.role || "admin",
    };
  } catch (err) {
    console.error("[phpMyAdmin] Express session auth error:", err);
    return null;
  }
}

async function fetchDbStats(pool: any): Promise<{
  tableCount: number;
  dbSize: string;
  activeConnections: number;
  serverVersion: string;
} | null> {
  try {
    const tables = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    `);
    const size = await pool.query(`
      SELECT pg_size_pretty(COUNT(*)::bigint * 1000000) as size
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    `);
    const version = await pool.query(`SELECT version()`);
    const connections = await pool.query(`
      SELECT COUNT(*) as count FROM pg_stat_activity
      WHERE datname = current_database()
    `);

    return {
      tableCount: parseInt(tables.rows[0]?.count || "0"),
      dbSize: size.rows[0]?.size || "0 B",
      activeConnections: parseInt(connections.rows[0]?.count || "0"),
      serverVersion: (version.rows[0]?.version || "PostgreSQL 16").split(",")[0] || "PostgreSQL 16",
    };
  } catch (err) {
    console.error("[phpMyAdmin] Stats fetch error:", err);
    return null;
  }
}

// ─── Route Registration ───────────────────────────────

export function registerPhpMyAdminRoutes(
  app: Express,
  deps: {
    db: any;
    pool: any;
    adminUsers: any;
    users: any;
    eq: any;
    ilike: any;
    or: any;
  },
) {
  const { db, pool, adminUsers, users, eq, ilike, or } = deps;

  // Middleware to parse cookies
  app.use("/phpmyadmin", (req: Request, _res: Response, next: any) => {
    const rawCookies = req.headers.cookie || "";
    req.cookies = {};
    rawCookies.split(";").forEach((pair) => {
      const [key, ...rest] = pair.split("=");
      if (key && rest.length) {
        req.cookies[key.trim()] = rest.join("=").trim();
      }
    });
    next();
  });

  // ── Login page (GET) ──
  app.get("/phpmyadmin", async (req: Request, res: Response) => {
    // Try existing phpMyAdmin session first
    let session: PhpMyAdminSession | null = getUserFromRequest(req);
    // Fallback: check main Express session (admin already logged into main app)
    if (!session) {
      const expressSession = await getAdminUserFromExpressSession(req, db, adminUsers, users, eq);
      if (expressSession) {
        // Auto-create phpMyAdmin session from the main session
        const sid = generateSessionId();
        const newSession: PhpMyAdminSession = {
          userId: expressSession.userId,
          username: expressSession.username,
          role: expressSession.role,
          loginTime: Date.now(),
          ip: req.ip || "127.0.0.1",
        };
        sessions.set(sid, newSession);
        session = newSession;
        res.setHeader(
          "Set-Cookie",
          `${COOKIE_NAME}=${sid}; HttpOnly; Path=/phpmyadmin; Max-Age=${4 * 60 * 60}; SameSite=Strict`,
        );
        return res.redirect("/phpmyadmin/dashboard");
      }
    }
    if (session) {
      return res.redirect("/phpmyadmin/dashboard");
    }
    res.send(renderLoginPage());
  });

  app.get("/phpmyadmin/login", async (req: Request, res: Response) => {
    // Try existing phpMyAdmin session first
    let session: PhpMyAdminSession | null = getUserFromRequest(req);
    // Fallback: check main Express session
    if (!session) {
      const expressSession = await getAdminUserFromExpressSession(req, db, adminUsers, users, eq);
      if (expressSession) {
        const sid = generateSessionId();
        const newSession: PhpMyAdminSession = {
          userId: expressSession.userId,
          username: expressSession.username,
          role: expressSession.role,
          loginTime: Date.now(),
          ip: req.ip || "127.0.0.1",
        };
        sessions.set(sid, newSession);
        session = newSession;
        res.setHeader(
          "Set-Cookie",
          `${COOKIE_NAME}=${sid}; HttpOnly; Path=/phpmyadmin; Max-Age=${4 * 60 * 60}; SameSite=Strict`,
        );
        return res.redirect("/phpmyadmin/dashboard");
      }
    }
    if (session) {
      return res.redirect("/phpmyadmin/dashboard");
    }
    res.send(renderLoginPage());
  });

  // ── Login handler (POST) ──
  app.post("/phpmyadmin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).send(renderLoginPage("Username and password are required."));
      }

      const user = await authenticateUser(username, password, db, adminUsers, users, eq, ilike, or);

      if (!user) {
        return res.status(401).send(renderLoginPage("Invalid credentials or insufficient permissions."));
      }

      const sid = generateSessionId();
      sessions.set(sid, {
        userId: user.userId,
        username: user.username,
        role: user.role,
        loginTime: Date.now(),
        ip: req.ip || "127.0.0.1",
      });

      res.setHeader(
        "Set-Cookie",
        `${COOKIE_NAME}=${sid}; HttpOnly; Path=/phpmyadmin; Max-Age=${4 * 60 * 60}; SameSite=Strict`,
      );

      console.log(`[phpMyAdmin] Login successful: ${user.username} (${user.role}) from ${req.ip}`);
      res.redirect("/phpmyadmin/dashboard");
    } catch (err) {
      console.error("[phpMyAdmin] Login error:", err);
      res.status(500).send(renderLoginPage("Server error. Please try again."));
    }
  });

  // ── Dashboard ──
  app.get("/phpmyadmin/dashboard", async (req: Request, res: Response) => {
    const session = getUserFromRequest(req);
    if (!session) {
      return res.redirect("/phpmyadmin/login");
    }

    const stats = await fetchDbStats(pool);
    res.send(renderDashboard(session, stats));
  });

  // ── Logout ──
  app.get("/phpmyadmin/logout", (req: Request, res: Response) => {
    const sid = req.cookies?.[COOKIE_NAME];
    if (sid) {
      sessions.delete(sid);
    }
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=; HttpOnly; Path=/phpmyadmin; Max-Age=0; SameSite=Strict`,
    );
    res.redirect("/phpmyadmin/login");
  });

  // ── API proxy: authenticated JSON endpoints ──
  app.get("/phpmyadmin/api/tables", async (req: Request, res: Response) => {
    const session = getUserFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const result = await pool.query(`
        SELECT
          t.table_schema, t.table_name, t.table_type,
          (SELECT COUNT(*) FROM information_schema.columns c
           WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name) as column_count,
          pg_size_pretty(pg_total_relation_size(quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))) as total_size
        FROM information_schema.tables t
        WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY t.table_schema, t.table_name
      `);
      res.json({ tables: result.rows, session: { username: session.username, role: session.role } });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch tables" });
    }
  });

  app.get("/phpmyadmin/api/status", async (req: Request, res: Response) => {
    const session = getUserFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const version = await pool.query("SELECT version()");
      const serverInfo = await pool.query(`
        SELECT
          current_database() as database, current_schema as schema,
          pg_size_pretty(pg_database_size(current_database())) as database_size,
          (SELECT COUNT(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections,
          (SELECT setting FROM pg_settings WHERE name = 'max_connections') as max_connections,
          (SELECT setting FROM pg_settings WHERE name = 'server_version') as server_version
      `);
      res.json({ version: version.rows[0]?.version, serverInfo: serverInfo.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch status" });
    }
  });

  // ── Forgot password page ──
  app.get("/phpmyadmin/forgot", (req: Request, res: Response) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>phpMyAdmin &middot; Forgot Password</title>
  <style>${LOGIN_PAGE_CSS}</style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="logo">&#x1F510;</div>
      <h1>Reset Password</h1>
      <p>Contact your system administrator to reset your phpMyAdmin password</p>
    </div>
    <div style="text-align:center; padding: 20px 0; color: #8892b0; font-size: 14px; line-height: 1.6;">
      <p>Password resets for the database management portal<br>must be handled by a server administrator.</p>
      <p style="margin-top: 12px; font-size: 13px;">
        <strong>Contact:</strong><br>
        deepblue.octopus.dev@gmail.com
      </p>
    </div>
    <a href="/phpmyadmin/login" class="btn-login" style="display:block;text-align:center;text-decoration:none;">Back to Login</a>
    <div class="server-badge">
      <span>Universe Empire Dominion</span>
    </div>
  </div>
</body>
</html>`);
  });

  console.log(`[phpMyAdmin] Portal registered at http://localhost:${process.env.PORT || 5000}/phpmyadmin`);
}