# Admin Setup Guide

Setting up administrator access with IP restrictions and security controls.

## Security Layers

1. Separate admin login page (`/admin/login`)
2. IP-based whitelist
3. Environment variable control

## Quick Start

### Local Development

Admin login at `/admin/login` for localhost:
```
Username: devadmin
Password: dev-password
```

### Create Admin

```bash
npm run admin:create -- myusername MyPassword123 administrator
```

> **Source:** script/create-new-admin.ts

### Manage Admins

```bash
npm run admin:manage -- list                    # List all
npm run admin:manage -- grant player1 moderator  # Grant role
npm run admin:manage -- revoke player1           # Remove
```

> **Source:** script/manage-admin.ts

## Environment Variables

> **Source:** .env.example

### IP Whitelist

```bash
# Default: localhost only
ADMIN_IP_WHITELIST='127.0.0.1,::1'

# Add specific IPs
ADMIN_IP_WHITELIST='127.0.0.1,::1,203.0.113.45,198.51.100.12'
```

### Disable Admin Login

```bash
ADMIN_LOGIN_DISABLED='true'
```

### Owner Admin Bootstrap

```bash
OWNER_ADMIN_USERNAME='admin'
OWNER_ADMIN_EMAIL='admin@company.com'
OWNER_ADMIN_PASSWORD='VerySecurePassword123!'
OWNER_ADMIN_ROLE='founder'
```

## Production Setup

1. Set IP whitelist to your admin IPs
2. Create owner admin with `OWNER_ADMIN_*` variables
3. Set `DEV_AUTH_BYPASS='false'`
4. Generate strong `SESSION_SECRET`

## Access Flow

1. Navigate to `/admin/login`
2. System verifies IP is whitelisted
3. Enter admin credentials
4. Access granted to admin panel via `/settings`

## Roles and Permissions

| Role | Capabilities |
|------|-------------|
| `founder` | Full system access |
| `devadmin` | Development admin (all permissions) |
| `administrator` | Full admin access |
| `suadmin` | Manage + moderate |
| `moderator` | Moderate players |
| `viewer` | View-only |

> **Source:** server/adminPermissions.ts

## API Endpoints

### Admin Login

```
POST /api/admin/login
Content-Type: application/json

{ "username": "admin", "password": "your-password" }
```

> **Source:** server/routes-admin.ts

### Admin Status

```
GET /api/admin/me
```

### Database Admin

> **Source:** server/routes-database-admin.ts

phpMyAdmin-like PostgreSQL management for admins with `manage` or `administrate` permissions.

## Environment Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_IP_WHITELIST` | `127.0.0.1,::1` | Allowed admin IPs |
| `ADMIN_LOGIN_DISABLED` | `false` | Disable admin login |
| `OWNER_ADMIN_USERNAME` | - | Owner admin username |
| `OWNER_ADMIN_PASSWORD` | - | Owner admin password |
| `OWNER_ADMIN_ROLE` | `founder` | Owner admin role |
| `DEV_AUTH_BYPASS` | `true` | Dev auth bypass |
| `SESSION_SECRET` | - | Session encryption key |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't access `/admin/login` | Add your IP to `ADMIN_IP_WHITELIST` |
| Login fails | Verify user exists: `npm run admin:manage -- list` |
| No admin tabs | Login at `/admin/login` (separate from user login) |
