import type { Request, Response, NextFunction } from "express";

const ADMIN_LOGIN_ATTEMPTS = new Map<string, { count: number; lastAttempt: number }>();
const ADMIN_RATE_LIMIT = 5;
const ADMIN_RATE_WINDOW_MS = 15 * 60 * 1000;

export function adminBruteForceProtection(req: Request, res: Response, next: NextFunction): void {
  const clientIp = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0].trim();
  const ipKey = `admin:${clientIp}`;
  const now = Date.now();
  const record = ADMIN_LOGIN_ATTEMPTS.get(ipKey);

  if (record && now - record.lastAttempt < ADMIN_RATE_WINDOW_MS) {
    if (record.count >= ADMIN_RATE_LIMIT) {
      const retryAfter = Math.ceil((ADMIN_RATE_WINDOW_MS - (now - record.lastAttempt)) / 1000);
      res.status(429).json({
        error: "Too many admin login attempts. Try again later.",
        retryAfterSeconds: retryAfter,
      });
      return;
    }
    ADMIN_LOGIN_ATTEMPTS.set(ipKey, { count: record.count + 1, lastAttempt: now });
  } else {
    ADMIN_LOGIN_ATTEMPTS.set(ipKey, { count: 1, lastAttempt: now });
  }

  next();
}

export function resetAdminLoginAttempts(ip: string): void {
  ADMIN_LOGIN_ATTEMPTS.delete(`admin:${ip}`);
}

export function validateSession(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as any;
  if (!session || !session.userId) {
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
    return;
  }

  const maxSessionAgeMs = 24 * 60 * 60 * 1000;
  if (session.createdAt && Date.now() - session.createdAt > maxSessionAgeMs) {
    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
    });
    res.status(401).json({ error: "Session expired. Please log in again." });
    return;
  }

  next();
}

export function requireHttps(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === "production" && !req.secure && req.headers["x-forwarded-proto"] !== "https") {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
    return;
  }
  next();
}
