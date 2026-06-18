import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "./db";
import { users, playerStates } from "@shared/schema";
import { eq } from "drizzle-orm";

// Middleware for authentication
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED" 
    });
  }
  next();
};

// Helper to get user ID from session
export const getUserId = (req: Request): string => req.session.userId || "";

// Validation schemas
export const schemas = {
  // Auth schemas
  register: z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    email: z.string().email().optional(),
  }),
  login: z.object({
    username: z.string(),
    password: z.string(),
  }),
  
  // Resource schemas
  updateResources: z.object({
    metal: z.number().optional(),
    crystal: z.number().optional(),
    deuterium: z.number().optional(),
    energy: z.number().optional(),
  }),
  
  // Building schemas
  buildStructure: z.object({
    buildingId: z.string(),
    level: z.number().int().positive().optional(),
  }),
  
  // Research schemas
  startResearch: z.object({
    techId: z.string(),
    priority: z.enum(["low", "normal", "high"]).optional(),
  }),
  
  // Fleet schemas
  createFleet: z.object({
    name: z.string().min(1).max(100),
    ships: z.record(z.number().int().nonnegative()),
    destination: z.string().optional(),
  }),
  
  // Mission schemas
  createMission: z.object({
    type: z.enum(["attack", "transport", "colonize", "spy", "defend"]),
    targetCoordinates: z.string(),
    fleetId: z.string().optional(),
    resources: z.record(z.number()).optional(),
  }),
};

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          errors: error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Standard API response wrapper
export const apiResponse = {
  success: <T>(data: T, message?: string) => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }),
  
  error: (message: string, code?: string, statusCode: number = 500) => ({
    success: false,
    message,
    code: code || "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
  }),
  
  paginated: <T>(data: T[], page: number, limit: number, total: number) => ({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  }),
};

// Error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("API Error:", err);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  const code = err.code || "INTERNAL_ERROR";
  
  res.status(statusCode).json(apiResponse.error(message, code, statusCode));
};

// Rate limiting helper
export const rateLimitConfig = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 requests per 15 minutes
  general: { windowMs: 60 * 1000, max: 60 }, // 60 requests per minute
  expensive: { windowMs: 60 * 1000, max: 10 }, // 10 requests per minute
};

// Async handler wrapper to catch errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Register core API utilities
export function registerCoreApiRoutes(app: any) {
  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json(apiResponse.success({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    }));
  });
  
  // API version endpoint
  app.get("/api/version", (req: Request, res: Response) => {
    res.json(apiResponse.success({
      version: "1.0.0",
      apiVersion: "v1",
      environment: process.env.NODE_ENV || "production",
    }));
  });
  
  // User info endpoint
  app.get("/api/user/me", isAuthenticated, asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json(apiResponse.error("User not found", "USER_NOT_FOUND", 404));
    }
    
    // Don't send password hash
    const { passwordHash, ...safeUser } = user;
    res.json(apiResponse.success(safeUser));
  }));
}

// Made with Bob
