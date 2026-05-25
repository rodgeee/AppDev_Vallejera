/** Timestamp of last successful login (used to avoid instant logout on race/401). */
let lastAuthenticatedAt = 0;

export function markAuthenticated(): void {
  lastAuthenticatedAt = Date.now();
}

/** Skip auto sign-out for a few seconds right after login (API race / stale 401). */
export function shouldSignOutOnUnauthorized(): boolean {
  if (lastAuthenticatedAt === 0) {
    return true;
  }
  return Date.now() - lastAuthenticatedAt > 4000;
}

export function clearAuthenticated(): void {
  lastAuthenticatedAt = 0;
}
