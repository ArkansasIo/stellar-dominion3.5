# Login Routing Verification

The authenticated router now handles both the login URL and the legacy dashboard URL without displaying the Not Found page.

| URL tested while authenticated | Result |
|---|---|
| `/auth` | Renders the game overview dashboard |
| `/dashboard` | Renders the game overview dashboard |
| `/` | Renders the game overview dashboard |

The fix adds explicit authenticated fallbacks for `/auth` and `/dashboard`, while the login form continues to send successful authentication to `/`. TypeScript validation passed after the router update.
