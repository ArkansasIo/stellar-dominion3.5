# Admin Account Information

This document reflects the current admin login paths and default permissions used by Stellar Dominion in this workspace.

---

## Web Admin Login

The web admin login is handled by `POST /api/admin/login` in `server/basicAuth.ts`.

Default bootstrap admin account:

- **Username:** `admin`
- **Email:** `admin@universee.game`
- **Password:** `Admin@12345`
- **Role:** `founder`

These values come from the bootstrap defaults in `server/basicAuth.ts` and can be overridden with:

- `ADMIN_BOOTSTRAP_USERNAME`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_BOOTSTRAP_ROLE`

### Founder Permissions

The `founder` role receives the full permission set from `server/adminPermissions.ts`:

- `all_access`
- `administrate`
- `manage`
- `moderate`
- `view_only`
- `developer_tools`
- `masquerade`
- `world_tools`
- `liveops_override`

---

## Dev Admin Login

The development bypass admin account is also created from `server/basicAuth.ts`.

- **Username:** `devadmin`
- **Email:** `devadmin@universee.local`
- **Password:** `dev-password`
- **Role:** `devadmin`

### Dev Admin Permissions

The `devadmin` role includes:

- `administrate`
- `manage`
- `moderate`
- `view_only`
- `developer_tools`
- `masquerade`
- `world_tools`
- `liveops_override`

Note: `devadmin` does not include `all_access`.

---

## Admin CLI Account

The terminal admin CLI is launched with:

```bash
npm run admin
```

Its credentials are stored in `.admin-credentials.json` in this workspace.

Current local CLI admin details:

- **Username:** `admin_root`
- **Password:** `admin`
- **Security Code:** `A1B2C3D4`
- **Created:** `2023-10-27T10:00:00.000Z`
- **Last Login:** ``

This CLI account is separate from the database-backed web admin login above.

---

## Role Map

Current role-to-permission mapping from `server/adminPermissions.ts`:

| Role | Permissions |
|------|-------------|
| `founder` | `all_access`, `administrate`, `manage`, `moderate`, `view_only`, `developer_tools`, `masquerade`, `world_tools`, `liveops_override` |
| `devadmin` | `administrate`, `manage`, `moderate`, `view_only`, `developer_tools`, `masquerade`, `world_tools`, `liveops_override` |
| `administrator` | `administrate`, `manage`, `moderate`, `view_only` |
| `suadmin` | `manage`, `moderate`, `view_only`, `liveops_override` |
| `moderator` | `moderate`, `view_only` |
| `viewer` | `view_only` |

---

## Important Notes

- The web admin login requires a valid user record plus an admin role record.
- The CLI admin account uses `.admin-credentials.json` and is not the same as the web admin session.
- These defaults are suitable for local development only and should be changed for shared or production environments.

---

## Relevant Files

- `server/basicAuth.ts`
- `server/adminPermissions.ts`
- `server/adminCli.ts`
- `.admin-credentials.json`

---

**Last Updated:** March 21, 2026
