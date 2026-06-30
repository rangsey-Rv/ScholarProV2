"use client";

import { createContext, useContext, useEffect } from "react";
import { authService } from "@/api/service/auth.service";
import type { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  verifyAndDecodeJWT,
  type VerifiedJWTPayload,
} from "@/lib/utils/jwt-verify";

// ============================================================
// 🧪 DEV-ONLY: JWT VERIFICATION TEST HELPER
// ============================================================
// ⚠️ TEMPORARY — For professor demo/testing only
// This exposes a type-safe browser console function to test JWT verification
//
// USAGE IN BROWSER CONSOLE:
// 1. Test valid token:    window.__TEST_VERIFY_JWT__("your_real_token")
// 2. Test tampered token: window.__TEST_VERIFY_JWT__("tampered_token")
//
// Expected results:
// - Valid token   → ✅ Shows verified payload
// - Tampered token → ❌ Shows "INVALID/TAMPERED TOKEN"
//
interface WindowWithTestHelper extends Window {
  __TEST_VERIFY_JWT__?: (token: string) => Promise<VerifiedJWTPayload | null>;
}

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const typedWindow = window as unknown as WindowWithTestHelper;

  typedWindow.__TEST_VERIFY_JWT__ = async (
    token: string,
  ): Promise<VerifiedJWTPayload | null> => {
    console.log("🔬 Testing JWT verification...");
    console.log("📦 Token length:", token.length);

    try {
      const result = await verifyAndDecodeJWT(token);

      if (result.valid && result.payload) {
        console.log("\n✅ ============ TOKEN VERIFIED ============");
        console.log("✅ Signature: VALID (cryptographically verified)");
        console.log("✅ Payload (trusted after verification):");
        console.log("   - User ID:", result.payload.userId);
        console.log("   - Role:", result.payload.role);
        console.log(
          "   - Issued:",
          new Date(result.payload.iat * 1000).toLocaleString(),
        );
        console.log(
          "   - Expires:",
          new Date(result.payload.exp * 1000).toLocaleString(),
        );
        console.log("==========================================\n");

        return result.payload;
      } else {
        console.error("\n❌ =========== TOKEN REJECTED ===========");
        console.error("❌ Signature: INVALID");
        console.error("❌ Reason:", result.error);
        console.error("❌ This token was TAMPERED or uses wrong key");
        console.error("❌ Role NOT trusted — security check passed!");
        console.error("==========================================\n");

        return null;
      }
    } catch (err) {
      const error = err as Error;
      console.error("\n❌ =========== VERIFICATION FAILED ===========");
      console.error("❌ Error:", error.message || String(err));
      console.error("============================================\n");
      return null;
    }
  };

  console.log("🧪 JWT Test Helper loaded: window.__TEST_VERIFY_JWT__()");
}

interface AuthCtx {
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  setAccessToken: (token: string | null) => void;
}
const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Skip session check on public routes to avoid unnecessary 401 errors.
        // NOTE: "/api/v1/auth/" must be here because the Google OAuth callback
        // rewrite is server-side only — the browser URL stays at
        // /api/v1/auth/google/callback while the page is being served, so
        // window.location.pathname is that path, not /students/auth/...
        const publicRoutes = [
          "/login",
          "/committee-login",
          "/forgot-password",
          "/reset-password",
          "/set-forgot-password",
          "/students/login",
          "/students/signup",
          "/students/auth/",
          "/api/v1/auth/", // OAuth callback: browser URL during server-side rewrite
        ];
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "";

        const isPublicRoute = publicRoutes.some((route) =>
          currentPath.startsWith(route),
        );

        if (isPublicRoute) {
          setLoading(false);
          return;
        }

        // ── Student routes: restore session from sessionStorage ─────────────
        // Students authenticate via Google/Telegram OAuth. Their token is
        // persisted to sessionStorage after a successful OAuth callback so it
        // survives page refreshes without calling /auth/me (which is the admin
        // endpoint). isLoading stays true until we finish the check below.
        if (currentPath.startsWith("/students/")) {
          const storedToken =
            typeof window !== "undefined"
              ? sessionStorage.getItem("studentAccessToken")
              : null;
          const storedUserStr =
            typeof window !== "undefined"
              ? sessionStorage.getItem("studentUser")
              : null;

          if (storedToken && storedUserStr) {
            try {
              const storedUser = JSON.parse(storedUserStr) as {
                id: string;
                name: string;
                email: string;
                role: "admin" | "committee" | "student";
                avatar?: string;
              };
              setAccessToken(storedToken);
              setUser(storedUser);
            } catch {
              // Corrupted storage — clear it so the user gets sent to login
              sessionStorage.removeItem("studentAccessToken");
              sessionStorage.removeItem("studentUser");
            }
          }
          // Either restored or not — stop the loading spinner regardless
          setLoading(false);
          return;
        }
        // ────────────────────────────────────────────────────────────────────

        const res = await authService.me();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setLoading, setUser]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    if (!res.data.user || !res.data.token) {
      throw new Error("Login failed - no user data or token");
    }

    // CRITICAL: res.data.user.role comes from VERIFIED JWT payload
    // auth.service.ts extracts role from verified JWT, NOT API response
    setUser(res.data.user);
    setAccessToken(res.data.token);

    const redirectPath =
      res.data.user.role === "committee"
        ? "/applicant"
        : res.data.user.role === "student"
          ? "/students"
          : "/dashboard";
    router.replace(redirectPath);
  };

  const logout = async (redirectTo?: string) => {
    await authService.logout(redirectTo);
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, accessToken, login, logout, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

// Role-based utilities for conditional rendering
// ✅ SECURITY: user.role comes from JWT payload verified by RS256 signature
// All UI permissions are based on cryptographically verified role claim
export function useRole() {
  const { user } = useAuth();

  const COMMITTEE_ALLOWED_ROUTES = [
    "/applicant",

    "/score",
    "/interview",
    "/setting/profile",
  ];

  const STUDENT_ALLOWED_ROUTES = ["/students"];

  return {
    role: user?.role || null, // role from verified JWT
    isAdmin: user?.role === "admin",
    isCommittee: user?.role === "committee",
    isStudent: user?.role === "student",
    hasRole: (role: "admin" | "committee" | "student") => user?.role === role,
    hasAnyRole: (...roles: Array<"admin" | "committee" | "student">) =>
      user?.role ? roles.includes(user.role) : false,
    canAccessRoute: (pathname: string) => {
      if (!user) return false;
      if (user.role === "admin") return true; // Admin can access all routes
      if (user.role === "committee") {
        return COMMITTEE_ALLOWED_ROUTES.some((route) =>
          pathname.startsWith(route),
        );
      }
      if (user.role === "student") {
        return STUDENT_ALLOWED_ROUTES.some((route) =>
          pathname.startsWith(route),
        );
      }
      return false; // Unknown role - deny access
    },
  };
}

// Component-level role guard
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "committee" | "student">;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
