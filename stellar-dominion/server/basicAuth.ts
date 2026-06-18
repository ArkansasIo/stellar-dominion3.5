import session from "express-session";
import type { Express, RequestHandler } from "express";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { logger } from "./logger";
import crypto from "crypto";
import { db } from "./db";
import { adminUsers, users } from "../shared/schema";
import { eq } from "drizzle-orm";

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

  let user = await storage.getUserByUsername(username);
  if (!user) {
    user = await storage.createUser({
      username,
      email,
      firstName,
      passwordHash: hashPassword(defaultPassword),
    });
    logger.info("AUTH", `Dev bypass user created: ${username}`);
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

async function resolveAdminStatus(userId: string): Promise<{ isAdmin: boolean; adminRole: string | null }> {
  if (!userId) {
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
    const bootstrapRole = (process.env.ADMIN_BOOTSTRAP_ROLE || "founder").trim();

    if (!bootstrapUsername || !bootstrapEmail || !bootstrapPassword) {
      logger.warn("AUTH", "Bootstrap admin account skipped due to missing credentials");
      return;
    }

    let bootstrapUser = await storage.getUserByUsername(bootstrapUsername);
    if (!bootstrapUser) {
      bootstrapUser = await storage.createUser({
        username: bootstrapUsername,
        email: bootstrapEmail,
        firstName: "Admin",
        passwordHash: hashPassword(bootstrapPassword),
      });
      logger.info("AUTH", `Bootstrap admin user created: ${bootstrapUsername}`);
    }

    const [adminRecord] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.userId, bootstrapUser.id))
      .limit(1);

    if (!adminRecord) {
      await db.insert(adminUsers).values({
        userId: bootstrapUser.id,
        role: bootstrapRole,
        permissions: ["all_access", "administrate", "manage", "moderate", "view_only"],
      });
      logger.info("AUTH", `Bootstrap admin role granted: ${bootstrapUsername} (${bootstrapRole})`);
    }
  } catch (error) {
    logger.error("AUTH", "Failed to ensure bootstrap admin account", {}, error);
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

  await ensureBootstrapAdminAccount();
  if (isDevAuthBypassEnabled()) {
    await ensureDevBypassUser();
    logger.warn("AUTH", "DEV_AUTH_BYPASS is enabled; protected routes will auto-authenticate locally");
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

      const user = await storage.getUserByUsername(username);
      
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
            const user = await storage.getUserByUsername(username);
            if (user && user.passwordHash && verifyPassword(password, user.passwordHash)) {
              (req.session as any).userId = user.id;
              const adminStatus = await resolveAdminStatus(user.id);
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
      if (isDevAuthBypassEnabled()) {
        const user = await ensureDevBypassUser();
        (req.session as any).userId = user.id;
        const adminStatus = await resolveAdminStatus(user.id);
        return res.status(200).json({
          id: user.id,
          username: user.username || "",
          email: user.email,
          firstName: user.firstName,
          isAdmin: adminStatus.isAdmin,
          adminRole: adminStatus.adminRole,
          devBypass: true,
        });
      }
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
        const user = await storage.getUserByUsername(username);
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
