# Login fix

The authentication path is being standardized around the existing Express session and bcrypt password hashes.

## Client behavior

The browser must never persist the user's password. Only the authenticated user profile may be cached locally, and the server session remains the source of truth.

## Password behavior

New and migrated passwords use bcrypt. Login verification accepts bcrypt hashes only. Legacy password hashes should be migrated through an explicit reset/migration path rather than silently treating an incompatible digest as a bcrypt hash.

## Session behavior

Successful login establishes `req.session.userId`. Logout destroys the server session and clears the session cookie. Authentication responses should be `Cache-Control: no-store`.

## Deployment checklist

- Set a stable `SESSION_SECRET` in production.
- Run behind HTTPS and enable secure cookies in production.
- Configure the frontend API origin to the actual deployed server.
- Do not place passwords or password hashes in client-side storage.
- Verify the database connection before testing login.
