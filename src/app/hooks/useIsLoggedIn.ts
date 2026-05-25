import { useAuthToken } from './useAuthToken';

/** True only when a non-empty JWT is stored (not merely auth.data != null). */
export function useIsLoggedIn(): boolean {
  return useAuthToken() != null;
}
