# Stellar Dominion Admin Console
## Permission-Gate, Audit, and Concurrency Test Report

**Generated:** 2026-08-24 01:03 EDT  
**Project:** `ArkansasIo/stellar-dominion3.5`  
**Test target:** `http://localhost:5001`

## Executive result

The admin console passed a 240-request high-concurrency probe with 24 concurrent workers. The probe included read requests and mutation-shaped requests carrying extreme, negative, fractional, numeric-string, scientific-notation, `NaN`, `null`, and empty-string resource values. It completed with **zero transport failures and zero HTTP 5xx responses**. Because the test deliberately ran without an administrator session cookie, every request was stopped at the authentication/rate-limit boundary rather than reaching a state mutation.

| Measurement | Result |
|---|---:|
| Requests | 240 |
| Concurrent workers | 24 |
| HTTP 429 responses | 240 |
| Transport failures | 0 |
| HTTP 5xx responses | 0 |
| Minimum latency | 2.06 ms |
| Median latency | 11.64 ms |
| P95 latency | 41.69 ms |
| Maximum latency | 43.11 ms |
| Unexpected unauthenticated responses | 0 |

The `429` result is expected for this burst because the server applies an admin/API rate limiter. An earlier single request before the burst returned `401 Unauthorized`, confirming that the endpoint is protected before the rate-limit threshold is reached.

## Server-authoritative permission flow

The permission model is centralized in `server/adminPermissions.ts`. Roles are normalized before permission resolution. The supported role hierarchy is:

| Role | Effective permissions |
|---|---|
| `founder` | Full access, administration, management, moderation, viewing, developer tools, masquerade, world tools, and LiveOps override |
| `devadmin` | Administration, management, moderation, viewing, developer tools, masquerade, world tools, and LiveOps override |
| `administrator` | Administration, management, moderation, and viewing |
| `suadmin` | Management, moderation, viewing, and LiveOps override |
| `moderator` | Moderation and viewing |
| `viewer` | Viewing only |

`normalizeAdminRole()` maps aliases such as `dev-admin` and `dev_admin` to `devadmin`; unknown or empty roles fall back to `viewer`. `getRolePermissions()` returns a copied permission list, and `hasAdminPermission()` accepts only arrays, ignores non-string entries, and treats `all_access` as an override for any requested capability.

The route-level gate is `requireAdminPermission()` in `server/routes-admin.ts`. Its execution order is:

1. Read the authenticated session user id.
2. Check whether the current user is present in the `admin_users` table.
3. If the session is acting through an approved impersonation flow, resolve the administrator actor id from the impersonator session field.
4. Load the administrator role and explicit permission list.
5. Reject non-admin users with HTTP `403`.
6. Reject administrators lacking the requested capability with HTTP `403` and a capability-specific message.
7. Return the actor id, role, and effective permissions to the route handler.

The new hub routes add `isAuthenticated` as middleware and then call `requireAdminPermission()` inside each handler. This means authentication and administrator authorization are enforced server-side even if a client-side button is manipulated or a request is issued outside the UI.

## New endpoint permission matrix

| Endpoint | Gate | Server-side effect |
|---|---|---|
| `GET /api/admin/hub/overview` | `view_only` | Reads aggregate operational metrics |
| `GET /api/admin/hub/players` | `view_only` | Searches and returns safe player summaries |
| `GET /api/admin/hub/players/:identifier` | `view_only` | Returns a bounded player-state detail view |
| `POST /api/admin/hub/players/:identifier/grant-resources` | `manage` | Applies validated resource deltas in a transaction |
| `POST /api/admin/hub/players/:identifier/reset` | `developer_tools` | Resets resources or progression after scope validation |
| `POST /api/admin/hub/players/:identifier/progression` | `developer_tools` | Applies bounded empire-level and tier overrides |

The client hides or disables controls based on the operator’s effective capabilities, but the server gates remain authoritative and are the actual security boundary.

## Resource edge-value handling

`normalizeAdminResourceDelta()` in `shared/config/adminConsole.ts` is shared by the server and the test harness. It rejects non-object input and empty deltas, accepts only the declared resource keys, converts numeric strings to numbers, rejects non-finite values, truncates fractional values, and clamps each delta to the interval `[-1,000,000,000, 1,000,000,000]`.

The mutation handler then reads the current resource JSON, normalizes existing values, applies each delta, and clamps the resulting balance at zero. Therefore a negative correction cannot create a negative stored balance, and an extreme positive correction cannot exceed the per-operation bound.

The deterministic edge assertions passed for these cases:

| Input | Normalized behavior |
|---|---|
| `Number.MAX_SAFE_INTEGER` | Clamped to `1,000,000,000` |
| `-Number.MAX_SAFE_INTEGER` | Clamped to `-1,000,000,000` |
| `1.5` | Truncated to `1` |
| Numeric strings | Converted to numbers |
| `"NaN"` | Rejected |
| `null` | Converts to zero, produces an empty delta, and is rejected as a no-op |
| `0` or `""` | Produces no operation and is rejected as an empty delta |

## Transaction boundary for resource grants

`POST /api/admin/hub/players/:identifier/grant-resources` uses `runTransaction()` from `server/db/index.ts`. Within the transaction, the handler selects the target player state, calculates the new resource object, and updates the row. If no player state exists, it returns a `404` without writing. The audit record is written only after the database transaction succeeds.

The response includes the operation name, target user id, actual applied deltas, and generated audit id. Actual applied deltas may differ from requested deltas when a negative correction reaches the zero floor.

## Reset and progression safeguards

The reset endpoint accepts only `resources` or `progress` as the scope. Resource reset restores the configured starter balances. Progress reset additionally clears buildings, research, and units and returns empire level and tier to their starter values. The endpoint requires `developer_tools`.

The progression endpoint bounds empire level to `1..999` and tier to `1..21`, requires finite values, updates only the progression fields, and requires `developer_tools`. Both operations append an audit entry with the target user and the exact scope or values applied.

## Durable audit logging

The existing audit writer stores entries in the `admin_audit_log` storage setting. Each entry contains:

```ts
{
  id: string;
  timestamp: number;
  actorId: string;
  action: string;
  targetUserId?: string;
  details?: string;
}
```

The writer retains the most recent 200 records and returns the generated audit id to callers. The new hub operations use these action names:

| Action | Recorded details |
|---|---|
| `admin_hub_grant_resources` | JSON object containing the actual applied deltas |
| `admin_hub_reset_player` | `scope=resources` or `scope=progress` |
| `admin_hub_set_progression` | Applied empire level and tier |

The audit writer now serializes read-modify-write operations through an in-process promise queue. This prevents concurrent requests handled by the same Node process from losing audit entries due to overlapping `getSetting()` and `setSetting()` calls. The retained-history cap remains 200 entries.

This is an application-process safeguard. A multi-process or multi-instance deployment should eventually move the audit stream to an append-only database table or use a database-side atomic append strategy for cross-process guarantees.

## Files involved

| File | Responsibility |
|---|---|
| `server/adminPermissions.ts` | Role normalization and capability checks |
| `server/routes-admin.ts` | Existing admin identity gate and durable audit writer |
| `server/routes-admin-hub.ts` | New protected hub metrics, player reads, and mutations |
| `server/db/index.ts` | Database transaction helper |
| `shared/config/adminConsole.ts` | Shared menu contracts and resource normalization |
| `script/test-admin-console-stress.ts` | Concurrent API and edge-value harness |
| `notes/admin-console-stress-latest.json` | Machine-readable latest stress evidence |

## Test commands

```text
npm run check
npm run test:admin-console
npm run test:admin-console-stress
```

All three commands passed. The authenticated mutation path is supported by the harness through `ADMIN_SESSION_COOKIE`, but no administrator cookie was supplied during this run; therefore no real player state was modified. To run the authenticated path safely, provide a session for a disposable test administrator and a nonexistent or dedicated test target:

```text
ADMIN_SESSION_COOKIE='connect.sid=...' \
ADMIN_STRESS_TARGET='dedicated-test-player-id' \
npm run test:admin-console-stress
```
