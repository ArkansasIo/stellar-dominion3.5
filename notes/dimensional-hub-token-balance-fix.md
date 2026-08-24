# Dimensional Hub token-balance fix

The crash was caused by `GateTokensService.getAllTokenBalances()` returning an object map:

```json
{
  "anomaly": 0,
  "raid": 0,
  "exploration": 0
}
```

The API wraps this as `{ success: true, balances }`, while `DimensionalHub.tsx` attempted to render `tokenBalances.map(...)` as though `balances` were an array.

`client/src/pages/DimensionalHub.tsx` now normalizes all supported shapes: a wrapped response, a direct array of `{ tokenType, quantity }` records, or an object map of token quantities. Invalid values are ignored and an empty array is used as the safe fallback.

Live verification at `/dimensional-hub?fix=token-balances-20260824` succeeded. Opening the Tokens tab rendered anomaly, raid, and exploration token cards with quantity 0 and no runtime exception.

Validation passed:

- `npm run check`
- `npm run build`
- Live Tokens tab rendering
