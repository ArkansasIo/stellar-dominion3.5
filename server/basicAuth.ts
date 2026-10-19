import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { logger } from "./logger";
import crypto from "crypto";
import { db } from "./db";
import { adminUsers, users, type User } from "../shared/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { getRolePermissions, normalizeAdminRole } from "./adminPermissions";
import { requireAdminIp, logAdminActivity } from "./middleware/adminIpCheck";

const NON_ADMIN_USERNAMES = new Set(["player1", "player2", "player3"]);
const NON_ADMIN_EMAIL_SUFFIX = "@universe-empire-domions.game";
const DEVELOPMENT_DEMO_ACCOUNTS = [
  { username: "player1", password: "password123" },
  { username: "player2", password: "password123" },
  { username: "player3", password: "password123" },
] as const;
let adminUsersTableExistsCache: boolean | null = null;

async function hasAdminUsersTable(): Promise<boolean> {
  if (adminUsersTableExistsCache !== null) return adminUsersTableExistsCache;
  try {
    const result = await db.execute(sql`SELECT to_regclass('public.admin_users') AS table_name`);
    const row = (result.rows?.[0] || {}) as Record<string, unknown>;
    adminUsersTableExistsCache = Boolean(row.table_name);
  } catch {
    adminUsersTableExistsCache = false;
  }
  return adminUsersTableExistsCache;
}

function isProtectedNonAdminAccount(user: Pick<User, "username" | "email"> | null | undefined) {
  const username = String(user?.username || "").trim().toLowerCase();
  const email = String(user?.email || "").trim().toLowerCase();
  return NON_ADMIN_USERNAMES.has(username) || NON_ADMIN_USERNAMES.has(email.replace(NON_ADMIN_EMAIL_SUFFIX, ""));
}

function isDevAuthBypassEnabled() {
  const raw = (process.env.DEV_AUTH_BYPASS || "").trim().toLowerCase();
  if (process.env.NODE_ENV !== "development") return false;
  if (!raw) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return ["1", "true", "yes", "on"].includes(raw);
}

async function ensureDevBypassUser() {
  if (!(await hasAdminUsersTable())) {
    logger.warn("AUTH", "Dev bypass setup skipped: admin_users table is missing");
    return null;
  }
  const username = (process.env.DEV_AUTH_USERNAME || "devadmin").trim();
  const email = (process.env.DEV_AUTH_EMAIL || "devadmin@universee.local").trim();
  const firstName = (process.env.DEV_AUTH_FIRST_NAME || "Dev Admin").trim();
  const defaultPassword = process.env.DEV_AUTH_PASSWORD || "dev-password";
  let user = await resolveUserByIdentifier(username) || await resolveUserByIdentifier(email);
  if (!user) {
    user = await storage.createUser({ username, email, firstName, passwordHash: hashPassword(defaultPassword) });
    logger.info("AUTH", `Dev bypass user created: ${username}`);
  }
  user = await syncDevPasswordIfNeeded(user, defaultPassword, "Dev bypass");
  const [adminRecord] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.userId, user.id)).limit(1);
  if (!adminRecord) {
    const role = normalizeAdminRole(process.env.DEV_AUTH_ROLE || "devadmin");
    await db.insert(adminUsers).values({ userId: user.id, role, permissions: getRolePermissions(role) });
    logger.info("AUTH", `Dev bypass admin role granted: ${username} (${role})`);
  }
  return user;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const SessionStore = MemoryStore(session);
  const sessionStore = new SessionStore({ checkPeriod: 86400000 });
  const isProduction = process.env.NODE_ENV === "production";
  const secureCookie = isProduction || process.env.COOKIE_SECURE === "true";
  const crossSiteCookie = process.env.COOKIE_SAMESITE === "none";

  return session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: secureCookie,
    cookie: {
      httpOnly: true,
      secure: secureCookie,
      sameSite: crossSiteCookie ? "none" : "lax",
      maxAge: sessionTtl,
      path: "/",
    },
  });
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

async function resolveUserByIdentifier(identifier: string | null | undefined): Promise<User | null> {
  const normalized = String(identifier || "").trim();
  if (!normalized) return null;
  const [user] = await db.select().from(users).where(
    normalized.includes("@")
      ? ilike(users.email, normalized)
      : or(ilike(users.username, normalized), ilike(users.email, normalized)),
  ).limit(1);
  return user || null;
}

async function syncDevPasswordIfNeeded(user: User, password: string, label: string): Promise<User> {
  if (process.env.NODE_ENV !== "development") return user;
  const nextHash = hashPassword(password);
  if (user.passwordHash === nextHash) return user;
  const updatedUser = await storage.updateUser(user.id, { passwordHash: nextHash });
  logger.info("AUTH", `${label} password synchronized for development: ${updatedUser.username || updatedUser.id}`);
  return updatedUser;
}

async function resolveAdminStatus(userId: string): Promise<{ isAdmin: boolean; adminRole: string | null }> {
  if (!userId) return { isAdmin: false, adminRole: null };
  const user = await storage.getUser(userId);
  if (!user) return { isAdmin: false, adminRole: null };
  if (isProtectedNonAdminAccount(user)) {
    await db.delete(adminUsers).where(eq(adminUsers.userId, userId));
    return { isAdmin: false, adminRole: null };
  }
  const [adminRecord] = await db.select({ role: adminUsers.role }).from(adminUsers).where(eq(adminUsers.userId, userId)).limit(1);
  return { isAdmin: Boolean(adminRecord), adminRole: adminRecord?.role || null };
}

async function ensureBootstrapAdminAccount() {
  try {
    if (!(await hasAdminUsersTable())) {
      logger.warn("AUTH", "Bootstrap admin account skipped: admin_users table is missing");
      return;
    }
    const bootstrapUsername = (process.env.ADMIN_BOOTSTRAP_USERNAME || "admin").trim();
    const bootstrapEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@universee.game").trim();
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin@12345";
    const bootstrapRole = normalizeAdminRole(process.env.ADMIN_BOOTSTRAP_ROLE || "founder");
    if (!bootstrapUsername || !bootstrapEmail || !bootstrapPassword) return;
    let bootstrapUser = await resolveUserByIdentifier(bootstrapUsername) || await resolveUserByIdentifier(bootstrapEmail);
    if (!bootstrapUser) {
      bootstrapUser = await storage.createUser({ username: bootstrapUsername, email: bootstrapEmail, firstName: "Admin", passwordHash: hashPassword(bootstrapPassword) });
      logger.info("AUTH", `Bootstrap admin user created: ${bootstrapUsername}`);
    }
    bootstrapUser = await syncDevPasswordIfNeeded(bootstrapUser, bootstrapPassword, "Bootstrap admin");
    const [adminRecord] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.userId, bootstrapUser.id)).limit(1);
    if (!adminRecord) {
      await db.insert(adminUsers).values({ userId: bootstrapUser.id, role: bootstrapRole, permissions: getRolePermissions(bootstrapRole) });
      logger.info("AUTH", `Bootstrap admin role granted: ${bootstrapUsername} (${bootstrapRole})`);
    }
  } catch (error) {
    logger.error("AUTH", "Failed to ensure bootstrap admin account", {}, error);
  }
}

async function ensureNamedAdminAccount(options: { username: string; email: string; firstName: string; password: string; role: string; label: string }) {
  if (!(await hasAdminUsersTable())) return null;
  const username = options.username.trim();
  const email = options.email.trim();
  const firstName = options.firstName.trim();
  const password = options.password;
  const role = normalizeAdminRole(options.role);
  if (!username || !email || !password) return null;
  let user = await resolveUserByIdentifier(username) || await resolveUserByIdentifier(email);
  if (!user) {
    user = await storage.createUser({ username, email, firstName, passwordHash: hashPassword(password) });
  }
  user = await syncDevPasswordIfNeeded(user, password, options.label);
  const [adminRecord] = await db.select({ id: adminUsers.id, role: adminUsers.role }).from(adminUsers).where(eq(adminUsers.userId, user.id)).limit(1);
  if (!adminRecord) await db.insert(adminUsers).values({ userId: user.id, role, permissions: getRolePermissions(role) });
  return user;
}

async function ensureDevelopmentDemoAccounts() {
  if (process.env.NODE_ENV !== "development") return;
  const enabled = (process.env.ENABLE_DEMO_ACCOUNTS || "true").trim().toLowerCase();
  if (["0", "false", "no", "off"].includes(enabled)) return;
  for (const account of DEVELOPMENT_DEMO_ACCOUNTS) {
    const email = `${account.username}${NON_ADMIN_EMAIL_SUFFIX}`;
    const user = await resolveUserByIdentifier(account.username) || await resolveUserByIdentifier(email);
    if (!user) await storage.createUser({ username: account.username, email, firstName: account.username, passwordHash: hashPassword(account.password) });
    else await syncDevPasswordIfNeeded(user, account.password, `Development demo (${account.username})`);
  }
}

async function ensureBootstrapAdminAccounts() {
  try { await ensureBootstrapAdminAccount(); } catch (error) { logger.warn("AUTH", `Bootstrap admin setup skipped: ${(error as Error).message}`); return; }
  if (process.env.NODE_ENV === "development") {
    try {
      await ensureNamedAdminAccount({
        username: (process.env.DEV_ADMIN_USERNAME || "devadmin").trim(),
        email: (process.env.DEV_ADMIN_EMAIL || "devadmin@universee.game").trim(),
        firstName: (process.env.DEV_ADMIN_FIRST_NAME || "Dev Admin").trim(),
        password: process.env.DEV_ADMIN_PASSWORD || process.env.DEV_AUTH_PASSWORD || "dev-password",
        role: process.env.DEV_ADMIN_ROLE || "devadmin",
        label: "Development admin",
      });
    } catch (error) { logger.warn("AUTH", `Development admin setup skipped: ${(error as Error).message}`); }
  }
  const ownerUsername = String(process.env.OWNER_ADMIN_USERNAME || "").trim();
  const ownerEmail = String(process.env.OWNER_ADMIN_EMAIL || "").trim();
  const ownerPassword = String(process.env.OWNER_ADMIN_PASSWORD || "").trim();
  if (ownerUsername || ownerEmail || ownerPassword) {
    try {
      await ensureNamedAdminAccount({
        username: ownerUsername || ownerEmail.split("@")[0] || "owneradmin",
        email: ownerEmail || `${ownerUsername || "owneradmin"}@universee.game`,
        firstName: (process.env.OWNER_ADMIN_FIRST_NAME || "Owner Admin").trim(),
        password: ownerPassword || process.env.ADMIN_BOOTSTRAP_PASSWORD || "Owner@12345",
        role: process.env.OWNER_ADMIN_ROLE || "founder",
        label: "Owner admin",
      });
    } catch (error) { logger.warn("AUTH", `Owner admin setup skipped: ${(error as Error).message}`); }
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    const origin = req.get("origin");
    const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
    if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  app.use(getSession());
  try {
    await ensureBootstrapAdminAccounts();
    await ensureDevelopmentDemoAccounts();
    if (isDevAuthBypassEnabled()) {
      await ensureDevBypassUser();
      logger.warn("AUTH", "DEV_AUTH_BYPASS is enabled; protected routes will auto-authenticate locally");
    }
  } catch (error) { logger.warn("AUTH", `Auth bootstrap skipped: ${(error as Error).message}`); }

  app.post("/api/auth/register", async (req, res) => {
    try {
      const username = String(req.body?.username || "").trim();
      const password = String(req.body?.password || "");
      const email = String(req.body?.email || "").trim();
      const firstName = String(req.body?.firstName || username).trim();
      if (!username || !password || !email) return res.status(400).json({ message: "Username, password, and email required" });
      if (username.length < 3) return res.status(400).json({ message: "Username must be at least 3 characters" });
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      if (!email.includes("@")) return res.status(400).json({ message: "Valid email address required" });
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) return res.status(409).json({ message: "Username already taken" });
      const user = await storage.createUser({ username, passwordHash: hashPassword(password), email, firstName });
      (req.session as any).userId = user.id;
      req.session.save(err => {
        if (err) {
          logger.error("AUTH", "Session save error after registration", {}, err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        return res.status(201).json({ message: "Account created", user: { id: user.id, username: user.username } });
      });
    } catch (error) {
      logger.error("AUTH", "Registration error", {}, error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const username = String(req.body?.username || req.body?.email || "").trim();
      const password = String(req.body?.password || "");
      if (!username || !password) return res.status(400).json({ message: "Username and password required" });
      logger.info("AUTH", `Login attempt for user: ${username}`);
      const user = await resolveUserByIdentifier(username);
      if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        logger.warn("AUTH", `Invalid credentials for user: ${username}`);
        return res.status(401).json({ message: "Invalid username or password", code: "INVALID_CREDENTIALS" });
      }
      (req.session as any).userId = user.id;
      const adminStatus = await resolveAdminStatus(user.id);
      if (adminStatus.isAdmin) (req.session as any).adminAuthenticatedAt = Date.now();
      await new Promise<void>((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
      logger.info("AUTH", `Login successful for user: ${username}`, { userId: user.id });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, isAdmin: adminStatus.isAdmin, adminRole: adminStatus.adminRole },
      });
    } catch (error) {
      logger.error("AUTH", "Login error", {}, error);
      return res.status(500).json({ message: "Login failed", code: "LOGIN_ERROR" });
    }
  });

  app.post("/api/admin/login", logAdminActivity, requireAdminIp, async (req, res) => {
    try {
      const identifier = String(req.body?.identifier || req.body?.username || "").trim();
      const password = String(req.body?.password || "");
      const securityCode = String(req.body?.securityCode || req.body?.code || "").trim();
      if (!identifier || !password) return res.status(400).json({ message: "Username/email and password required" });
      const isDev = process.env.NODE_ENV === "development";
      const expectedCode = process.env.ADMIN_SECURITY_CODE || (isDev ? "STELLAR-ADMIN" : null);
      if (expectedCode) {
        if (!securityCode) return res.status(400).json({ message: "Security access code is required", field: "securityCode" });
        if (securityCode.toUpperCase() !== expectedCode.toUpperCase()) return res.status(401).json({ message: "Invalid security access code", field: "securityCode" });
      }
      const user = await resolveUserByIdentifier(identifier);
      if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ message: "Invalid credentials" });
      const adminStatus = await resolveAdminStatus(user.id);
      if (!adminStatus.isAdmin) return res.status(403).json({ message: "Admin access required for this account" });
      delete (req.session as any).impersonatorId;
      (req.session as any).userId = user.id;
      (req.session as any).adminAuthenticatedAt = Date.now();
      await new Promise<void>((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
      return res.json({ message: "Admin login successful", user: { id: user.id, username: user.username || "", email: user.email, firstName: user.firstName, isAdmin: true, adminRole: adminStatus.adminRole } });
    } catch (error) {
      logger.error("AUTH", "Admin login error", {}, error);
      return res.status(500).json({ message: "Admin login failed" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const username = String(req.body?.username || "").trim();
      const email = String(req.body?.email || "").trim();
      if (!username || !email) return res.status(400).json({ message: "Username and email required" });
      const user = await storage.getUserByUsername(username);
      if (!user) return res.status(401).json({ message: "User not found" });
      if (user.email !== email) return res.status(401).json({ message: "Email does not match account" });
      const temporaryPassword = `${crypto.randomBytes(12).toString("base64url")}`;
      await storage.updateUser(user.id, { passwordHash: hashPassword(temporaryPassword) });
      logger.info("AUTH", `Password reset requested for user: ${username}`);
      return res.json({ message: "Password has been reset", temporaryPassword, instructions: "Use the temporary password to login, then change it in your account settings" });
    } catch (error) {
      logger.error("AUTH", "Password reset error", {}, error);
      return res.status(500).json({ message: "Password reset failed" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      const userId = (req.session as any)?.userId;
      if (userId) {
        const user = await storage.getUser(userId);
        if (user) {
          const adminStatus = await resolveAdminStatus(user.id);
          return res.status(200).json({ id: user.id, username: user.username || "", email: user.email, firstName: user.firstName, isAdmin: adminStatus.isAdmin, adminRole: adminStatus.adminRole });
        }
        delete (req.session as any).userId;
      }
      return res.status(401).json({ message: "Not authenticated", code: "UNAUTHORIZED" });
    } catch (error) {
      logger.error("AUTH", "Session check error", {}, error);
      return res.status(500).json({ message: "Authentication check failed", code: "AUTH_CHECK_ERROR" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) {
          logger.error("AUTH", "Logout error", {}, err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid", { path: "/" });
        return res.json({ message: "Logout successful" });
      });
    } catch (error) {
      logger.error("AUTH", "Logout error", {}, error);
      return res.status(500).json({ message: "Logout failed" });
    }
  });

  const isAuthenticated: RequestHandler = async (req, res, next) => {
    try {
      const sessionUserId = (req.session as any)?.userId;
      if (sessionUserId) {
        const user = await storage.getUser(sessionUserId);
        if (user) {
          (req as any).user = user;
          return next();
        }
      }
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Basic ")) {
        try {
          const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
          const separator = decoded.indexOf(":");
          const identifier = separator >= 0 ? decoded.slice(0, separator) : decoded;
          const password = separator >= 0 ? decoded.slice(separator + 1) : "";
          const user = await resolveUserByIdentifier(identifier);
          if (user && user.passwordHash && verifyPassword(password, user.passwordHash)) {
            (req as any).user = user;
            return next();
          }
        } catch (error) {
          logger.warn("AUTH", `Basic auth parsing failed: ${(error as Error).message}`);
        }
      }
      if (isDevAuthBypassEnabled()) {
        const bypassUser = await ensureDevBypassUser();
        if (bypassUser) {
          (req as any).user = bypassUser;
          return next();
        }
      }
      return res.status(401).json({ message: "Authentication required", code: "UNAUTHORIZED" });
    } catch (error) {
      logger.error("AUTH", "Authentication middleware error", {}, error);
      return res.status(500).json({ message: "Authentication check failed", code: "AUTH_MIDDLEWARE_ERROR" });
    }
  };

  app.get("/api/auth/status", async (req, res) => {
    const userId = (req.session as any)?.userId;
    return res.json({ authenticated: Boolean(userId), userId: userId || null });
  });

  app.get("/api/status/health", async (_req, res) => {
    return res.json({ success: true, status: "healthy", score: 100, timestamp: Date.now(), checks: {} });
  });

  return { isAuthenticated };
}
