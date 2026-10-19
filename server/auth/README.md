# Authentication module

`server/auth/password.ts` is the single password hashing/verification helper for the server authentication path. Use `hashPassword()` when creating or resetting passwords and `verifyPassword()` when authenticating.

`server/auth/session.ts` centralizes session establishment and logout cleanup.
