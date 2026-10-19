const BLOCKED_AUTH_KEYS = new Set([
  "stellar_password",
  "user_password",
  "auth_password",
]);

const originalSetItem = Storage.prototype.setItem;

Storage.prototype.setItem = function (key: string, value: string): void {
  if (BLOCKED_AUTH_KEYS.has(key)) {
    return;
  }
  originalSetItem.call(this, key, value);
};

for (const key of BLOCKED_AUTH_KEYS) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }
}
