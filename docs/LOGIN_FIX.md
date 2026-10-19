# Login fix

The authentication path uses the existing Express session and the repository's current SHA-256 password format for compatibility with existing accounts. The shared bcrypt helper is available for the next login-handler migration, but the active handler must remain compatible with existing SHA-256 accounts until that migration is wired end-to-end.

## Client behavior

The browser must never persist the user's password. The login screen may retain a username for convenience, but the server session remains the source of truth. A startup storage guard also removes and blocks the legacy password keys used by older builds.

## Session behavior

Successful login establishes `req.session.userId`. Logout destroys the server session and clears the session cookie. Authentication responses should use `Cache-Control: no-store`.

## Demo accounts

The demo seed repairs the documented accounts when the seed command runs:

- `player1` / `password123`
- `player2` / `password123`
- `player3` / `password123`

Run `npm run db:seed:demo` when demo credentials need to be repaired. The `prestart` hook currently runs the same seed before `npm start`.

## Deployment checklist

- Set a stable `SESSION_SECRET` in production.
- Run behind HTTPS and enable secure cookies in production.
- Configure the frontend API origin to the actual deployed server.
- Do not place passwords or password hashes in client-side storage.
- Verify the database connection before testing login.
