import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { logger } from "./logger";
import crypto from "crypto";
import { db } from "./db";
import { adminUsers, users, type User } from "../shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import { getRolePermissions, normalizeAdminRole } from "./adminPermissions";
import { requireAdminIp, logAdminActivity } from "./middleware/adminIpCheck";

const NON_ADMIN_USERNAMES = new Set(["player1", "player2", "player3"]);
const NON_ADMIN_EMAIL_SUFFIX = "@universe-empire-domions.game";

function isProtectedNonAdminAccount(user: Pick<User, "username" | "email"> | null | undefined) {
  const username = String(user?.username || "").trim().toLowerCase();
  const email = String(user?.email || "").trim().toLowerCase();
  return NON_ADMIN_USERNAMES.has(username) || NON_ADMIN_USERNAMES.has(email.replace(NON_ADMIN_EMAIL_SUFFIX, ""));
}

function isDevAuthBypassEnabled() {
  const raw = (process.env.DEV_AUTH_BYPASS || "").trim().toLowerCase();
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    return false;
  }

  if (!raw) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(raw)) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(raw);
}

async function ensureDevBypassUser() {
  const username = (process.env.DEV_AUTH_USERNAME || "devadmin").trim();
  const email = (process.env.DEV_AUTH_EMAIL || "devadmin@universee.local").trim();
  const firstName = (process.env.DEV_AUTH_FIRST_NAME || "Dev Admin").trim();
  const defaultPassword = process.env.DEV_AUTH_PASSWORD || "dev-password";

  let user = await resolveUserByIdentifier(username) || await resolveUserByIdentifier(email);
  if (!user) {
    user = await storage.createUser({
      username,
      email,
      firstName,
      passwordHash: hashPassword(defaultPassword),
    });
    logger.info("AUTH", `Dev bypass user created: ${username}`);
  }

  user = await syncDevPasswordIfNeeded(user, defaultPassword, "Dev bypass");

  const [adminRecord] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.userId, user.id))
    .limit(1);

  if (!adminRecord) {
    const role = normalizeAdminRole(process.env.DEV_AUTH_ROLE || "devadmin");
    await db.insert(adminUsers).values({
      userId: user.id,
      role,
      permissions: getRolePermissions(role),
    });
    logger.info("AUTH", `Dev bypass admin role granted: ${username} (${role})`);
  }

  return user;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use in-memory session store to avoid database connection issues
  const SessionStore = MemoryStore(session);
  const sessionStore = new SessionStore({
    checkPeriod: 86400000, // Check for expired sessions every day
  });
  
  const isDevelopment = process.env.NODE_ENV === "development";
  
  return session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow in development
      sameSite: "lax",
      maxAge: sessionTtl,
      path: '/'
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
  if (!normalized) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(
      normalized.includes("@")
        ? ilike(users.email, normalized)
        : or(ilike(users.username, normalized), ilike(users.email, normalized)),
    )
    .limit(1);

  return user || null;
}

async function syncDevPasswordIfNeeded(
  user: User,
  password: string,
  label: string,
): Promise<User> {
  if (process.env.NODE_ENV !== "development") {
    return user;
  }

  const nextHash = hashPassword(password);
  if (user.passwordHash === nextHash) {
    return user;
  }

  const updatedUser = await storage.updateUser(user.id, { passwordHash: nextHash });
  logger.info("AUTH", `${label} password synchronized for development: ${updatedUser.username || updatedUser.id}`);
  return updatedUser;
}

async function resolveAdminStatus(userId: string): Promise<{ isAdmin: boolean; adminRole: string | null }> {
  if (!userId) {
    return { isAdmin: false, adminRole: null };
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return { isAdmin: false, adminRole: null };
  }

  if (isProtectedNonAdminAccount(user)) {
    await db.delete(adminUsers).where(eq(adminUsers.userId, userId));
    return { isAdmin: false, adminRole: null };
  }

  const [adminRecord] = await db
    .select({ role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);

  return {
    isAdmin: Boolean(adminRecord),
    adminRole: adminRecord?.role || null,
  };
}

async function ensureBootstrapAdminAccount() {
  try {
    const bootstrapUsername = (process.env.ADMIN_BOOTSTRAP_USERNAME || "admin").trim();
    const bootstrapEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@universee.game").trim();
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin@12345";
    const bootstrapRole = normalizeAdminRole(process.env.ADMIN_BOOTSTRAP_ROLE || "founder");

    if (!bootstrapUsername || !bootstrapEmail || !bootstrapPassword) {
      logger.warn("AUTH", "Bootstrap admin account skipped due to missing credentials");
      return;
    }

    let bootstrapUser = await resolveUserByIdentifier(bootstrapUsername) || await resolveUserByIdentifier(bootstrapEmail);
    if (!bootstrapUser) {
      bootstrapUser = await storage.createUser({
        username: bootstrapUsername,
        email: bootstrapEmail,
        firstName: "Admin",
        passwordHash: hashPassword(bootstrapPassword),
      });
      logger.info("AUTH", `Bootstrap admin user created: ${bootstrapUsername}`);
    }

    bootstrapUser = await syncDevPasswordIfNeeded(bootstrapUser, bootstrapPassword, "Bootstrap admin");

    const [adminRecord] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.userId, bootstrapUser.id))
      .limit(1);

    if (!adminRecord) {
      await db.insert(adminUsers).values({
        userId: bootstrapUser.id,
        role: bootstrapRole,
        permissions: getRolePermissions(bootstrapRole),
      });
      logger.info("AUTH", `Bootstrap admin role granted: ${bootstrapUsername} (${bootstrapRole})`);
    }
  } catch (error) {
    logger.error("AUTH", "Failed to ensure bootstrap admin account", {}, error);
  }
}

async function ensureNamedAdminAccount(options: {
  username: string;
  email: string;
  firstName: string;
  password: string;
  role: string;
  label: string;
}) {
  const username = options.username.trim();
  const email = options.email.trim();
  const firstName = options.firstName.trim();
  const password = options.password;
  const role = normalizeAdminRole(options.role);

  if (!username || !email || !password) {
    logger.warn("AUTH", `${options.label} skipped due to missing credentials`);
    return null;
  }

  let user = await resolveUserByIdentifier(username) || await resolveUserByIdentifier(email);
  if (!user) {
    user = await storage.createUser({
      username,
      email,
      firstName,
      passwordHash: hashPassword(password),
    });
    logger.info("AUTH", `${options.label} user created: ${username}`);
  }

  user = await syncDevPasswordIfNeeded(user, password, options.label);

  const [adminRecord] = await db
    .select({ id: adminUsers.id, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.userId, user.id))
    .limit(1);

  if (!adminRecord) {
    await db.insert(adminUsers).values({
      userId: user.id,
      role,
      permissions: getRolePermissions(role),
    });
    logger.info("AUTH", `${options.label} role granted: ${username} (${role})`);
  }

  return user;
}

async function ensureBootstrapAdminAccounts() {
  try {
    await ensureBootstrapAdminAccount();
  } catch (error) {
    logger.warn("AUTH", `Bootstrap admin setup skipped: ${(error as Error).message}`);
    return;
  }

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
    } catch (error) {
      logger.warn("AUTH", `Development admin setup skipped: ${(error as Error).message}`);
    }
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
    } catch (error) {
      logger.warn("AUTH", `Owner admin setup skipped: ${(error as Error).message}`);
    }
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  // Add CORS headers to allow credentials
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('origin') || 'http://localhost:5000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  app.use(getSession());

  try {
    await ensureBootstrapAdminAccounts();
    if (isDevAuthBypassEnabled()) {
      await ensureDevBypassUser();
      logger.warn("AUTH", "DEV_AUTH_BYPASS is enabled; protected routes will auto-authenticate locally");
    }
  } catch (error) {
    logger.warn("AUTH", `Auth bootstrap skipped: ${(error as Error).message}`);
  }

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, firstName } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email required" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      if (!email.includes("@")) {
        return res.status(400).json({ message: "Valid email address required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const passwordHash = hashPassword(password);
      const user = await storage.createUser({
        username,
        passwordHash,
        email,
        firstName: firstName || username,
      });

      (req.session as any).userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        res.json({ message: "Account created", user: { id: user.id, username: user.username } });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      logger.info("AUTH", `Login attempt for user: ${username}`);

      if (!username || !password) {
        logger.warn("AUTH", "Missing credentials in login request");
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await resolveUserByIdentifier(username);
      
      if (!user) {
        logger.warn("AUTH", `User not found: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.passwordHash) {
        logger.warn("AUTH", `User has no password hash: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordValid = verifyPassword(password, user.passwordHash);
      
      if (!passwordValid) {
        logger.warn("AUTH", `Invalid password for user: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      logger.info("AUTH", `Login successful for user: ${username}`, { userId: user.id });
      (req.session as any).userId = user.id;
      const adminStatus = await resolveAdminStatus(user.id);
      if (adminStatus.isAdmin) {
        (req.session as any).adminAuthenticatedAt = Date.now();
      }
      
      req.session.save((err) => {
        if (err) {
          logger.error("AUTH", "Session save error", {}, err);
          return res.status(500).json({ message: "Login failed" });
        }
        logger.info("AUTH", `Session saved for user: ${username}`);
        res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
      });
    } catch (error) {
      logger.error("AUTH", "Login error", {}, error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/login", logAdminActivity, requireAdminIp, async (req, res) => {
    try {
      const identifier = String(req.body?.identifier || req.body?.username || "").trim();
      const password = String(req.body?.password || "");

      if (!identifier || !password) {
        return res.status(400).json({ message: "Username/email and password required" });
      }

      const user = await resolveUserByIdentifier(identifier);

      if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        logger.warn("AUTH", `Admin login failed for identifier: ${identifier}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const adminStatus = await resolveAdminStatus(user.id);
      if (!adminStatus.isAdmin) {
        logger.warn("AUTH", `Non-admin user attempted admin login: ${user.username}`);
        return res.status(403).json({ message: "Admin access required for this account" });
      }

      delete (req.session as any).impersonatorId;
      (req.session as any).userId = user.id;
      (req.session as any).adminAuthenticatedAt = Date.now();

      req.session.save((err) => {
        if (err) {
          logger.error("AUTH", "Admin session save error", {}, err);
          return res.status(500).json({ message: "Admin login failed" });
        }

        logger.info("AUTH", `Admin login successful for: ${user!.username} (${adminStatus.adminRole})`);
        res.json({
          message: "Admin login successful",
          user: {
            id: user!.id,
            username: user!.username || "",
            email: user!.email,
            firstName: user!.firstName,
            isAdmin: true,
            adminRole: adminStatus.adminRole,
          },
        });
      });
    } catch (error) {
      logger.error("AUTH", "Admin login error", {}, error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({ message: "Username and email required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.email !== email) {
        return res.status(401).json({ message: "Email does not match account" });
      }

      const temporaryPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const passwordHash = hashPassword(temporaryPassword);
      
      await storage.updateUser(user.id, { passwordHash });
      
      logger.info("AUTH", `Password reset requested for user: ${username}`);
      res.json({ 
        message: "Password has been reset", 
        temporaryPassword: temporaryPassword,
        instructions: "Use the temporary password to login, then change it in your account settings"
      });
    } catch (error) {
      logger.error("AUTH", "Password reset error", {}, error);
      res.status(500).json({ message: "Password reset failed" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      let userId = (req.session as any)?.userId;
      
      // Try session auth first
      if (userId) {
        const user = await storage.getUser(userId);
        if (user) {
          const adminStatus = await resolveAdminStatus(user.id);
          logger.info("AUTH", `Session auth successful for userId: ${userId}`);
          return res.status(200).json({ 
            id: user.id, 
            username: user.username || "",
            email: user.email,
            firstName: user.firstName,
            isAdmin: adminStatus.isAdmin,
            adminRole: adminStatus.adminRole
          });
        }
      }
      
      // Try basic auth from Authorization header
      const authHeader = req.get('authorization');
      if (authHeader && authHeader.startsWith('Basic ')) {
        try {
          const encoded = authHeader.slice(6);
          const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
          const [username, password] = decoded.split(':');

          if (username && password) {
            const user = await resolveUserByIdentifier(username);
            if (user && user.passwordHash && verifyPassword(password, user.passwordHash)) {
              (req.session as any).userId = user.id;
              const adminStatus = await resolveAdminStatus(user.id);
              if (adminStatus.isAdmin) {
                (req.session as any).adminAuthenticatedAt = Date.now();
              }
              logger.info("AUTH", `Basic auth successful for user: ${username}`);
              
              // Explicitly save session to persist it
              return req.session.save((err) => {
                if (err) {
                  logger.error("AUTH", "Session save error in /api/auth/user", {}, err);
                  return res.status(500).json({ message: "Session creation failed" });
                }
                return res.status(200).json({ 
                  id: user.id, 
                  username: user.username || "",
                  email: user.email,
                  firstName: user.firstName,
                  isAdmin: adminStatus.isAdmin,
                  adminRole: adminStatus.adminRole
                });
              });
            }
          }
        } catch (err) {
          logger.warn("AUTH", `Basic auth header parse error in /api/auth/user: ${String(err)}`);
        }
      }
      
      logger.warn("AUTH", "No valid authentication for /api/auth/user");
      // Keep the landing/title page public even in development. Dev bypass can still
      // authenticate protected gameplay APIs after the player explicitly enters the game.
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      logger.error("AUTH", "Auth user endpoint error", {}, error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // First try session
  let userId = (req.session as any)?.userId;
  if (userId) {
    (req as any).user = { id: userId };
    logger.info("AUTH", `Session auth successful for userId: ${userId}`);
    return next();
  }
  
  // Fallback to basic auth from Authorization header
  const authHeader = req.get('authorization');
  
  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const encoded = authHeader.slice(6);
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');

      if (username && password) {
        const user = await resolveUserByIdentifier(username);
        if (user && user.passwordHash) {
          const passwordValid = verifyPassword(password, user.passwordHash);
          if (passwordValid) {
            (req.session as any).userId = user.id;
            (req as any).user = { id: user.id };
            logger.info("AUTH", `Basic auth successful for user: ${username}`);
            return next();
          }
        }
      }
    } catch (err) {
      logger.warn("AUTH", `Basic auth header parse error: ${String(err)}`);
    }
  }

  if (isDevAuthBypassEnabled()) {
    try {
      const user = await ensureDevBypassUser();
      (req.session as any).userId = user.id;
      (req as any).user = { id: user.id };
      logger.warn("AUTH", `Dev auth bypass granted for ${req.path}`);
      return next();
    } catch (error) {
      logger.error("AUTH", "Failed to establish dev auth bypass session", {}, error);
    }
  }
  
  logger.warn("AUTH", `Authentication failed for ${req.path}`);
  res.status(401).json({ message: "Unauthorized" });
};
