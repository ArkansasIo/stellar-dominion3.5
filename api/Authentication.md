# Authentication API

**Base URL:** `/api/auth`  
**Auth Required:** No (except where noted)  
**Content-Type:** `application/json`

---

## POST `/api/auth/register`

Create a new player account.

### Auth Required
No

### Request Body
```json
{
  "username": "string (3-24 chars, alphanumeric + underscores)",
  "email": "string (valid email address)",
  "password": "string (8-128 chars, at least 1 uppercase, 1 lowercase, 1 number)"
}
```

### Response `201 Created`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid request body (missing required fields, format violations) |
| `409` | `USERNAME_TAKEN` | The requested username is already in use |
| `409` | `EMAIL_TAKEN` | The requested email is already registered |
| `429` | `RATE_LIMIT_EXCEEDED` | Too many registration attempts from this IP |

---

## POST `/api/auth/login`

Authenticate and receive access tokens.

### Auth Required
No

### Request Body
```json
{
  "username": "string",
  "password": "string"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "string (JWT, expires in 15 minutes)",
    "refreshToken": "string (JWT, expires in 7 days)",
    "expiresIn": 900,
    "userId": "uuid",
    "username": "string"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing username or password |
| `401` | `INVALID_CREDENTIALS` | Username or password is incorrect |
| `403` | `ACCOUNT_LOCKED` | Account temporarily locked due to too many failed attempts |
| `403` | `EMAIL_NOT_VERIFIED` | Email verification required before login |

---

## POST `/api/auth/logout`

Invalidate the current session and refresh token.

### Auth Required
Yes (Bearer access token)

### Request Body
```json
{
  "refreshToken": "string"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing refresh token |
| `401` | `UNAUTHORIZED` | Invalid or expired access token |

---

## GET `/api/auth/me`

Retrieve the currently authenticated user's profile.

### Auth Required
Yes (Bearer access token)

### Query Parameters
None

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "emailVerified": "boolean",
    "profileImageUrl": "string | null",
    "firstName": "string | null",
    "lastName": "string | null",
    "roles": ["string"],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `401` | `UNAUTHORIZED` | Missing, invalid, or expired access token |

---

## POST `/api/auth/refresh`

Exchange a refresh token for a new access token.

### Auth Required
No (uses refresh token)

### Request Body
```json
{
  "refreshToken": "string"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "string (new JWT, expires in 15 minutes)",
    "refreshToken": "string (new JWT, expires in 7 days)",
    "expiresIn": 900
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing refresh token |
| `401` | `INVALID_REFRESH_TOKEN` | Refresh token is invalid, expired, or revoked |

---

## POST `/api/auth/verify-email`

Verify a user's email address using a verification token.

### Auth Required
No

### Request Body
```json
{
  "token": "string (verification token sent to email)"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing or malformed token |
| `400` | `TOKEN_EXPIRED` | Verification token has expired (24h window) |
| `404` | `TOKEN_NOT_FOUND` | Invalid verification token |

---

## POST `/api/auth/reset-password`

Initiates or completes a password reset flow.

### Step 1: Request Reset
#### Request Body
```json
{
  "email": "string"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent"
}
```
*Note: Always returns 200 to prevent email enumeration.*

### Step 2: Complete Reset
#### Request Body
```json
{
  "token": "string (reset token from email)",
  "newPassword": "string (8-128 chars, same requirements as registration)"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Error Codes (Step 2)
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing token or invalid password format |
| `400` | `TOKEN_EXPIRED` | Reset token has expired (1h window) |
| `404` | `TOKEN_NOT_FOUND` | Invalid reset token |

---

## Common Headers

All authenticated requests require:

```
Authorization: Bearer <accessToken>
```

Standard response envelope:

```json
{
  "success": true|false,
  "data": { ... } | null,
  "error": {
    "code": "string",
    "message": "string"
  } | null
}
```

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/register` | 3 requests | 60 seconds |
| `POST /api/auth/login` | 10 requests | 60 seconds |
| `POST /api/auth/reset-password` | 3 requests | 300 seconds |
| All other auth endpoints | 30 requests | 60 seconds |

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1625097600
```
