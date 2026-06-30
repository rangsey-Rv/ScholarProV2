// lib/stores/auth-store.ts
import { create } from "zustand";
import type { User } from "@/types/auth";

interface AuthState {
  // Authenticated user profile Null = not logged in

  user: User | null;

  /**
   * JWT access token (short-lived, ~1 hour)
   * Stored in memory only, NOT in cookies/storage
   * Automatically injected into API requests via api.ts interceptor
   */
  accessToken: string | null;

  /**
   * Loading state for auth initialization
   * True = checking existing session
   * False = auth check complete
   */
  isLoading: boolean;

  // ==================== ACTIONS ====================
  /**
   * Set authenticated user
   * Called after successful login or session restoration
   */
  setUser: (user: User | null) => void;

  /**
   * Set access token
   * Called after login or token refresh
   * Token is verified by JWT utility before storage
   */
  setAccessToken: (token: string | null) => void;

  /**
   * Set loading state
   * Used during auth initialization and API calls
   */
  setLoading: (loading: boolean) => void;

  /**
   * Clear all auth state
   * Called on logout or session expiry
   */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // INITIAL STATE
  user: null,
  accessToken: null,
  isLoading: true,

  // ACTION IMPLEMENTATIONS
  setUser: (user) => set({ user }),

  setAccessToken: (token) => set({ accessToken: token }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearAuth: () => {
    // Only wipe the student sessionStorage when the user has a real established
    // session (i.e. studentUser is present). This prevents a mid-OAuth
    // redirectToLogin call from destroying the token that the callback page is
    // about to write — which would lock the student out after a successful login.
    if (typeof window !== "undefined") {
      const hasEstablishedSession = Boolean(
        sessionStorage.getItem("studentUser"),
      );
      if (hasEstablishedSession) {
        sessionStorage.removeItem("studentAccessToken");
        sessionStorage.removeItem("studentUser");
      }
    }
    set({
      user: null,
      accessToken: null,
    });
  },
}));

/**
 * SECURITY VALIDATION TESTS:
 *
 * 1. Memory-Only Storage:
 *    - Open DevTools → Application → Local Storage → Should be EMPTY
 *    - Open DevTools → Application → Session Storage → Should be EMPTY
 *    - Only HttpOnly cookie for refresh token (not accessible by JS)
 *
 * 2. Tab Close Behavior:
 *    - Log in → Close tab → Reopen app → Should redirect to login
 *    - State should NOT persist across browser sessions
 *
 * 3. XSS Protection:
 *    - Run in console: `document.cookie` → Should NOT show access token
 *    - Run in console: `localStorage.getItem('auth-store')` → Should be null
 *    - Access token only in Zustand store (React memory)
 *
 * 4. State Isolation:
 *    - Open two tabs → Log in to Tab 1 → Tab 2 remains logged out
 *    - Each tab has independent auth state
 */

/**
 * USAGE EXAMPLES:
 *
 * 1. Access State (Component):
 *    ```tsx
 *    const user = useAuthStore((state) => state.user)
 *    const accessToken = useAuthStore((state) => state.accessToken)
 *    ```
 *
 * 2. Update State (Action):
 *    ```tsx
 *    const setUser = useAuthStore((state) => state.setUser)
 *    setUser({ id: '1', email: 'admin@example.com', role: 'admin' })
 *    ```
 *
 * 3. Outside React (api.ts):
 *    ```tsx
 *    const token = useAuthStore.getState().accessToken
 *    useAuthStore.getState().setAccessToken(newToken)
 *    ```
 *
 * 4. Clear on Logout:
 *    ```tsx
 *    const clearAuth = useAuthStore((state) => state.clearAuth)
 *    await authService.logout()
 *    clearAuth()
 *    ```
 */
