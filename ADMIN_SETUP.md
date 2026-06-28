# Admin Security Setup Guide

This document explains how to set up and manage administrator access with IP-based restrictions and separate admin login interface.

## Overview

The admin system has three security layers:

1. **Separate Admin Login Page** (`/admin/login`) - Distinct from regular user login
2. **IP-based Whitelist** - Only whitelisted IPs can access admin login
3. **Environment Variable Control** - Can disable admin login entirely

## Quick Start

### Local Development

Admin login is automatically available at `/admin/login` for localhost:

```bash
# Default credentials (created automatically)
Username: devadmin
Password: dev-password
```

### Create Custom Admin Account

```bash
# Create an admin account
npm run admin:create -- myusername MyPassword123 administrator

# Create a founder account
npm run admin:create -- founder SuperSecure@123! founder
```

### Manage Admin Accounts

```bash
# List all admin accounts
npm run admin:manage -- list

# Grant admin role to existing user
npm run admin:manage -- grant player1 moderator

# Remove admin access
npm run admin:manage -- revoke player1
```

## Environment Configuration

### IP Whitelist Configuration

Control which IP addresses can access the admin login page:

```bash
# Development (localhost only) - DEFAULT
ADMIN_IP_WHITELIST='127.0.0.1,::1'

# Add your office IP
ADMIN_IP_WHITELIST='127.0.0.1,::1,203.0.113.45'

# Multiple IPs (comma-separated)
ADMIN_IP_WHITELIST='127.0.0.1,::1,192.168.1.100,203.0.113.45,198.51.100.12'
```

### Disable Admin Login

Completely disable admin login (useful when managing admins via database only):

```bash
ADMIN_LOGIN_DISABLED='true'
```

### Create Owner Admin on Startup

Automatically create an owner admin account at server startup:

```bash
OWNER_ADMIN_USERNAME='myadmin'
OWNER_ADMIN_EMAIL='admin@mycompany.com'
OWNER_ADMIN_PASSWORD='VerySecurePassword123!'
OWNER_ADMIN_FIRST_NAME='My Admin'
OWNER_ADMIN_ROLE='founder'  # or 'administrator'
```

## Access Flow

### For Authorized Admins

1. Navigate to `/admin/login`
2. System verifies your IP is whitelisted
3. Enter admin credentials (username + password)
4. System verifies account has admin role
5. Access granted to admin panel via `/settings` (admin tabs)

### If IP Not Whitelisted

```json
{
  "message": "Admin access is restricted by IP",
  "clientIp": "203.0.113.100"
}
```

### If Admin Account Doesn't Have Admin Role

```json
{
  "message": "Admin access required for this account"
}
```

## Production Setup

### 1. Set IP Whitelist

Update your `.env` file with your organization's IPs:

```bash
ADMIN_IP_WHITELIST='127.0.0.1,::1,203.0.113.45,203.0.113.46'
```

### 2. Create Owner Admin

Create the primary admin account:

```bash
OWNER_ADMIN_USERNAME='admin'
OWNER_ADMIN_EMAIL='admin@company.com'
OWNER_ADMIN_PASSWORD='ChangeThisToStrongPassword123!'
OWNER_ADMIN_ROLE='founder'
```

### 3. Disable Dev Auth

Turn off development auth bypass:

```bash
DEV_AUTH_BYPASS='false'
```

### 4. Set Strong Session Secret

Use a cryptographically secure random value:

```bash
SESSION_SECRET='your-very-long-random-secure-string-here'
```

## Admin Roles and Permissions

### Roles

- **founder**: Full system access, can manage all admin features
- **devadmin**: Development admin with all permissions
- **administrator**: Full admin access for running the game
- **suadmin**: Super admin with manage and moderate permissions
- **moderator**: Can moderate players and content
- **viewer**: View-only access to admin panels

### Managing Roles

```bash
# Promote a user to moderator
npm run admin:manage -- grant player1 moderator

# Change role
npm run admin:manage -- grant admin administrator

# Remove admin access
npm run admin:manage -- revoke player1
```

## Security Best Practices

### 1. Use Strong Passwords

- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Don't reuse passwords across accounts
- Don't use dictionary words

### 2. IP Whitelist Your Network

```bash
# Good: Specific corporate IP range
ADMIN_IP_WHITELIST='203.0.113.0/24'

# Better: Specific admin IPs
ADMIN_IP_WHITELIST='203.0.113.45,203.0.113.46,203.0.113.47'

# Bad: Too permissive
ADMIN_IP_WHITELIST='0.0.0.0/0'  # Don't do this!
```

### 3. Monitor Admin Activity

All admin login attempts are logged:

```
🔐 [ADMIN] POST /api/admin/login from IP: 203.0.113.45
✓ Admin login successful for: myadmin (founder)
✗ Admin login failed for identifier: wronguser
⚠️ Non-admin user attempted admin login: player1
```

### 4. Rotate Passwords Regularly

Change admin passwords every 90 days:

```bash
# Edit admin password through settings UI, or use database directly
npm run admin:manage -- revoke oldadmin
npm run admin:create -- newadmin NewPassword123 founder
```

### 5. Limit Admin Accounts

Only create admin accounts for people who need them:

```bash
npm run admin:manage -- list  # Review who has access
npm run admin:manage -- revoke unused_account
```

## Troubleshooting

### Can't Access `/admin/login`

Check if your IP is whitelisted:
1. Your IP appears in the error response
2. Add it to `ADMIN_IP_WHITELIST` in `.env`
3. Restart server: `npm run dev`

### Login with Correct Credentials Fails

1. Verify user exists: `npm run admin:manage -- list`
2. If not listed, create it: `npm run admin:create -- username password role`
3. Check that it's listed as an admin

### Can't See Admin Tabs in Settings

1. You're logged in as regular user, not admin
2. Go to `/admin/login` (separate page)
3. Use admin credentials
4. You should see "ADMIN MODE" badge in settings

## Environment Variable Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_IP_WHITELIST` | `127.0.0.1,::1` | IPs allowed to access admin login |
| `ADMIN_LOGIN_DISABLED` | `false` | Disable admin login page entirely |
| `OWNER_ADMIN_USERNAME` | - | Owner admin account username |
| `OWNER_ADMIN_EMAIL` | - | Owner admin email address |
| `OWNER_ADMIN_PASSWORD` | - | Owner admin password |
| `OWNER_ADMIN_ROLE` | `founder` | Owner admin role |
| `DEV_AUTH_BYPASS` | `true` | Enable dev auth (dev only) |
| `DEV_ADMIN_USERNAME` | `devadmin` | Dev admin username |
| `DEV_ADMIN_PASSWORD` | `dev-password` | Dev admin password |
| `SESSION_SECRET` | `dev-secret-key` | Session encryption key |

## API Endpoints

### Admin Login

```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}

# Success (200 OK)
{
  "message": "Admin login successful",
  "user": {
    "id": "uuid",
    "username": "admin",
    "isAdmin": true,
    "adminRole": "founder"
  }
}

# Invalid credentials (401)
{
  "message": "Invalid credentials"
}

# Not admin account (403)
{
  "message": "Admin access required for this account"
}

# IP not whitelisted (403)
{
  "message": "Admin access is restricted by IP",
  "clientIp": "203.0.113.100"
}
```

### Admin Status

```bash
GET /api/admin/me

# Response
{
  "isAdmin": true,
  "role": "founder",
  "permissions": ["all_access"],
  "masqueradingAsUserId": null
}
```

## Support

For issues or questions about admin setup:

1. Check the logs: `npm run dev 2>&1 | grep -i admin`
2. Review environment variables: `cat .env | grep ADMIN`
3. Verify user exists: `npm run admin:manage -- list`
4. Check IP whitelist: Review `ADMIN_IP_WHITELIST` in `.env`
