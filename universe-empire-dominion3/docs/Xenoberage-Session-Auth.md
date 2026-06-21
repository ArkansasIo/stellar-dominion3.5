# Session & Authentication Design

**Last Updated:** June 18, 2026

---

## Overview

Universe Empire Dominion uses session-based authentication with HTTP-only cookies. The implementation supports three authentication tiers: session cookies, Basic Auth headers, and a development bypass mode.

---

## Implementation

> **Source:** server/basicAuth.ts

### Session Store

> **Source:** server/basicAuth.ts:78-103

```typescript
import session from "express-session";
import MemoryStore from "memorystore";
```

- Store: in-memory via `memorystore` (no database dependency)
- Cookie name: `connect.sid`
- TTL: 7 days (`7 * 24 * 60 * 60 * 1000`)
- HttpOnly: `true`
- SameSite: `lax`
- Secure: `false` in development
- Session cleanup: daily check (`checkPeriod: 86400000`)

### Auth Middleware

> **Source:** server/basicAuth.ts:623-672

The `isAuthenticated` middleware uses a three-tier fallback:

1. **Session check** — reads `req.session.userId`
2. **Basic Auth header** — parses `Authorization: Basic <base64(user:pass)>`, resolves user by username or email, verifies password hash
3. **Dev bypass** — when `NODE_ENV=development` and `DEV_AUTH_BYPASS` is not `0/false/no/off`, auto-creates a session for the dev bypass user

### Password Handling

> **Source:** server/basicAuth.ts:105-111

```typescript
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
```

SHA-256 hashing. In development, passwords are synchronized on startup to ensure dev credentials work.

### User Resolution

> **Source:** server/basicAuth.ts:113-130

Users can be resolved by:
- Username (case-insensitive via `ilike`)
- Email (case-insensitive via `ilike`)
- Combined lookup: if the identifier contains `@`, search by email only; otherwise search by username or email

### Admin Detection

> **Source:** server/basicAuth.ts:151-176

After login, the system checks the `adminUsers` table for the user's ID. Protected non-admin usernames (`player1`, `player2`, `player3`) are excluded from admin access.

### Bootstrap Admin Accounts

> **Source:** server/basicAuth.ts:178-312

On server startup:
1. **Bootstrap admin** — created from `ADMIN_BOOTSTRAP_*` env vars (default: `admin` / `admin@universee.game` / `Admin@12345` / role: `founder`)
2. **Dev admin** — created in development from `DEV_ADMIN_*` env vars
3. **Owner admin** — created from `OWNER_ADMIN_*` env vars (if set)

---

## API Endpoints

| Method | Endpoint | Source | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | `server/basicAuth.ts:342-387` | Create account |
| POST | `/api/auth/login` | `server/basicAuth.ts:389-437` | Login (session) |
| POST | `/api/auth/logout` | `server/basicAuth.ts:614-620` | Destroy session |
| GET | `/api/auth/user` | `server/basicAuth.ts:539-612` | Get current user |
| POST | `/api/auth/reset-password` | `server/basicAuth.ts:505-537` | Reset password |
| POST | `/api/admin/login` | `server/basicAuth.ts:439-503` | Admin login (with security code) |

### Register

```typescript
POST /api/auth/register
Body: { username: string, password: string, email: string, firstName?: string }
Response: { message: "Account created", user: { id, username } }
Errors: 400 (validation), 409 (username taken)
```

### Login

```typescript
POST /api/auth/login
Body: { username: string, password: string }
Response: { message: "Login successful", user: { id, username } }
Errors: 400 (missing credentials), 401 (invalid credentials)
```

### Admin Login

```typescript
POST /api/admin/login
Body: { identifier: string, password: string, securityCode: string }
Response: { message: "Admin login successful", user: { id, username, email, isAdmin, adminRole } }
Errors: 400 (missing fields), 401 (bad credentials/code), 403 (not admin)
```

---

## CORS Configuration

> **Source:** server/basicAuth.ts:317-328

```typescript
res.header('Access-Control-Allow-Origin', req.get('origin') || 'http://localhost:5000');
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

---

## Security Notes

- HTTP-only cookies prevent XSS access to session tokens
- SameSite=lax provides CSRF protection for most scenarios
- Dev bypass is automatically disabled in production
- Protected non-admin usernames cannot be granted admin roles
- Admin login requires a separate security code
- Session is destroyed on logout and cookie is cleared

---

**See also:**
- [API_COMPLETE_GUIDE.md](./API_COMPLETE_GUIDE.md) — Full API guide
- [API_ROUTES.md](./API_ROUTES.md) — Complete endpoint reference
