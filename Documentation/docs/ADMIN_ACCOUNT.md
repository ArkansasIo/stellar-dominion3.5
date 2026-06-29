# Admin Account Setup

Guide for managing administrator accounts in Universe Empire Dominion.

## Admin Roles

> **Source:** server/adminPermissions.ts

| Role | Level | Permissions |
|------|-------|-------------|
| `founder` | 5 | all_access, administrate, manage, moderate, view_only, developer_tools, masquerade, world_tools, liveops_override |
| `devadmin` | 4 | administrate, manage, moderate, view_only, developer_tools, masquerade, world_tools, liveops_override |
| `administrator` | 4 | administrate, manage, moderate, view_only |
| `suadmin` | 3 | manage, moderate, view_only, liveops_override |
| `moderator` | 2 | moderate, view_only |
| `viewer` | 1 | view_only |

## Creating Admin Accounts

### CLI Tool

```bash
npm run admin:create -- <username> <password> <role>
```

Examples:
```bash
npm run admin:create -- admin MySecurePass123! founder
npm run admin:create -- mod ModPass456 moderator
```

> **Source:** script/create-new-admin.ts

### Admin CLI (Interactive)

```bash
npm run admin
```

> **Source:** server/adminCli.ts

Interactive menu for:
1. Create admin user
2. Reset admin password
3. List all users
4. View user details
5. Grant/revoke admin privileges

### Manage Admins

```bash
npm run admin:manage -- list              # List all admins
npm run admin:manage -- grant <user> <role>  # Grant role
npm run admin:manage -- revoke <user>     # Remove admin
```

> **Source:** script/manage-admin.ts

## Environment Variables

> **Source:** .env.example

| Variable | Default | Purpose |
|----------|---------|---------|
| `OWNER_ADMIN_USERNAME` | `owner` | Owner admin username |
| `OWNER_ADMIN_EMAIL` | `owner@universe-empire-dominion.game` | Owner admin email |
| `OWNER_ADMIN_PASSWORD` | `SecurePassword123!` | Owner admin password |
| `OWNER_ADMIN_ROLE` | `founder` | Owner admin role |
| `ADMIN_IP_WHITELIST` | `127.0.0.1,::1` | IPs allowed to access admin login |
| `ADMIN_LOGIN_DISABLED` | `false` | Disable admin login entirely |
| `DEV_AUTH_BYPASS` | `true` | Enable dev auth bypass |

## Configuration

### Admin Credentials Config

> **Source:** shared/config/adminCredentialsConfig.ts

Root admin account settings:
- Username: `root_admin` (override with `ROOT_ADMIN_USERNAME`)
- Email: `root@stellar.local` (override with `ROOT_ADMIN_EMAIL`)
- Rank: `founder`
- Password requirements: 12+ chars, uppercase, numbers, special chars

### Admin Config

> **Source:** shared/config/adminConfig.ts

Defines the admin hierarchy with 5 tiers (founder, headAdmin, seniorMod, moderator, submod) and their permission sets.

## API Routes

### Admin Login

> **Source:** server/routes-admin.ts

```
POST /api/admin/login
{ "username": "admin", "password": "..." }
```

### Admin Status

```
GET /api/admin/me
```

Returns: `isAdmin`, `role`, `permissions`, `masqueradingAsUserId`

### Database Admin

> **Source:** server/routes-database-admin.ts

phpMyAdmin-like functionality for PostgreSQL. Accessible to admins with `manage` or `administrate` permissions.

## Admin Manager

> **Source:** server/admin-manager.ts

Server management, monitoring, and control features:
- Server statistics (uptime, memory, CPU)
- System health monitoring

## Security

- IP whitelist restricts admin login access
- Passwords are bcrypt hashed
- All admin actions are logged
- Session-based authentication
- Separate admin login page at `/admin/login`
