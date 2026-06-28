import type { Request, Response, NextFunction } from "express";

/**
 * Whitelist of IP addresses allowed to access admin endpoints
 * Add your IP addresses here for production
 * Format: ["127.0.0.1", "192.168.1.100", "your.ip.address"]
 */
const ADMIN_IP_WHITELIST = process.env.ADMIN_IP_WHITELIST?.split(",").map((ip) => ip.trim()) || [
  "127.0.0.1", // localhost
  "::1", // localhost IPv6
];

/**
 * Check if admin login is disabled via environment variable
 */
const ADMIN_LOGIN_DISABLED = process.env.ADMIN_LOGIN_DISABLED === "true";

/**
 * Get the client's IP address from the request
 */
function getClientIp(req: Request): string {
  // Check common proxy headers
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(",")[0].trim();
  }

  return (
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    "unknown"
  );
}

/**
 * Middleware to check if IP is whitelisted for admin access
 */
export function requireAdminIp(req: Request, res: Response, next: NextFunction): void {
  if (ADMIN_LOGIN_DISABLED) {
    res.status(403).json({ message: "Admin login is disabled" });
    return;
  }

  // In development mode, allow all IPs (Replit proxy IPs vary)
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) {
    return next();
  }

  const clientIp = getClientIp(req);
  const ipV4 = clientIp.replace(/^::ffff:/, ""); // Convert IPv4-mapped IPv6 to IPv4

  if (!ADMIN_IP_WHITELIST.includes(clientIp) && !ADMIN_IP_WHITELIST.includes(ipV4)) {
    console.warn(`⚠️ [ADMIN] Unauthorized admin login attempt from IP: ${clientIp}`);
    res.status(403).json({
      message: "Admin access is restricted by IP",
      clientIp: ipV4,
    });
    return;
  }

  next();
}

/**
 * Middleware to log admin activity with IP information
 */
export function logAdminActivity(req: Request, res: Response, next: NextFunction): void {
  const clientIp = getClientIp(req);
  console.log(`🔐 [ADMIN] ${req.method} ${req.path} from IP: ${clientIp}`);
  next();
}

/**
 * Get whitelisted IPs for admin panel display
 */
export function getAdminIpWhitelist(): string[] {
  return ADMIN_IP_WHITELIST;
}

/**
 * Check if admin login is disabled
 */
export function isAdminLoginDisabled(): boolean {
  return ADMIN_LOGIN_DISABLED;
}
