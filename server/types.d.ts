import "express-session";
import type { User } from "../shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: string;
    adminAuthenticatedAt?: number;
    impersonatorId?: string;
    realmId?: string;
    language?: string;
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      isAdmin?: boolean;
      adminRole?: string | null;
    }
  }
}
