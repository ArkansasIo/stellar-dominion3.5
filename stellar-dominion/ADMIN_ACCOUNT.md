# Admin Account Information

This document contains details about the administrative accounts configured in Stellar Dominion.

---

## Current Admin Account

The active admin credentials are stored in `.admin-credentials.json`:

- **Username:** `admin`
- **Password:** Not stored in plaintext (hashed with SHA-256)
- **Password Hash:** `33d8e6060c342e82afc82c079bba90f75fe7edacab32b1c167dfdd61c15e26
9f`
- **Security Code:** `8F54446E`
- **Created:** `2025-12-02T16:10:32.545Z`
- **Last Login:** `2025-12-02T16:10:32.546Z`

### Password Management

To change the admin password:
```bash
npm run admin
```

Then select option **"1) Change Password"** from the admin CLI menu.

**Password Requirements:**
- Minimum 6 characters (for admin CLI)
- Confirmed by re-entering

---

## Root Admin Configuration

Default root admin settings from `shared/config/adminCredentialsConfig.ts`:

- **Username:** `root_admin` (or `process.env.ROOT_ADMIN_USERNAME`)
- **Email:** `root@stellar.local` (or `process.env.ROOT_ADMIN_EMAIL`)
- **First Name:** `Root`
- **Last Name:** `Administrator`
- **Rank:** `founder`

### Root Admin Password Requirements

- Minimum length: 12 characters
- Must contain uppercase letters
- Must contain numbers
- Must contain special characters

---

## Admin Hierarchy

The system supports a 5-tier admin hierarchy:

| Rank | Title | Level | Permission Level | Default Count |
|------|-------|-------|------------------|---------------|
| `founder` | Founder | 5 | all_access | 1 |
| `administrator` | Administrator | 4 | administrate | 2 |
| `suadmin` | Sub-Administrator | 3 | manage | 3 |
| `moderator` | Moderator | 2 | moderate | 5 |
| `submod` | Sub-Moderator | 1 | view_only | 10 |

---

## Admin Security Settings

### Login Security
- **Two-Factor Authentication:** Disabled (default)
- **IP Whitelist:** None (default)
- **Login Attempt Limit:** 5 attempts
- **Lockout Duration:** 15 minutes
- **Session Timeout:** 60 minutes
- **Require Password Change:** Yes
- **Password Change Frequency:** 90 days

### Account Maintenance
- **Inactivity Warning:** 14 days
- **Inactivity Disable:** 30 days
- **Audit Log Retention:** 365 days
- **Require Audit Logging:** Yes
- **Auto-Archive Inactive Accounts:** Yes

---

## Setup Instructions

### Initial Root Admin Setup

1. Create root admin account with strong password
2. Set environment variables:
   - `ROOT_ADMIN_USERNAME`
   - `ROOT_ADMIN_PASSWORD_HASH`
3. Verify root admin can access admin panel
4. Create secondary administrators

### Creating New Admin Accounts

Use the admin CLI tool:
```bash
npm run admin
```

### Password Expiration

- **Root Admin:** 90 days
- **Administrator:** 60 days
- **Moderator:** 45 days

---

## Promotion and Demotion Rules

- **Require Approval:** Yes
- **Application Period Required:** No
- **Minimum Time in Role:** 30 days
- **Performance Rating Required:** 3.0 / 5.0
- **Track Promotion History:** Yes

---

## Suspension Policy

- **Require Cause Documentation:** Yes
- **Suspension Appeal Allowed:** Yes
- **Appeal Window:** 7 days
- **Permanent Removal Requires Vote:** Yes
- **Voting Threshold:** 75%

---

## Files

- **Credentials File:** `.admin-credentials.json` (git-ignored)
- **Configuration:** `shared/config/adminCredentialsConfig.ts`
- **Admin CLI:** `server/adminCli.ts`

---

**Last Updated:** March 9, 2026
