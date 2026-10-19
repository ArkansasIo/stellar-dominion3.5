const AUTH_USER_KEY = "stellar-dominion.auth-user";

export function saveAuthUser(user: unknown): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // Storage can be unavailable in privacy-restricted browsers; auth still uses the server session.
  }
}

export function loadAuthUser<T>(): T | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearAuthUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    // Remove the legacy key that previously stored the plaintext password.
    localStorage.removeItem("user_password");
    localStorage.removeItem("auth_password");
    localStorage.removeItem("stellar_password");
  } catch {
    // Ignore unavailable storage.
  }
}
