"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import ApplicantSidebar from "@/components/applicant-portal/ApplicantSidebar";
import ApplicantBottomBar from "@/components/applicant-portal/ApplicantBottomBar";
import ApplicantHeader from "@/components/applicant-portal/ApplicantHeader";
import ApplicantAppBar from "@/components/applicant-portal/ApplicantAppBar";

export default function StudentLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isPublicLanding = pathname === "/students" || pathname === "/students/";

  useEffect(() => {
    if (isPublicLanding) return;

    // Do not protect login, signup, or OAuth callback pages.
    // NOTE: "/api/v1/auth/" must be listed here because Next.js rewrites are
    // server-side only — the browser URL stays at /api/v1/auth/google/callback
    // while the callback page is being served, so usePathname() returns that
    // path, not /students/auth/google/callback.
    if (
      pathname?.startsWith("/students/login") ||
      pathname?.startsWith("/students/signup") ||
      pathname?.startsWith("/students/auth/") ||
      pathname?.startsWith("/api/v1/auth/")
    ) {
      return;
    }

    // Wait for auth to load
    if (isLoading) return;

    // Protect student routes: require authenticated user with student role.
    // Also check sessionStorage as a fallback: the Google OAuth callback saves
    // the token there BEFORE calling router.replace(), so we never redirect
    // when the Zustand state update is still in-flight (brief race condition).
    if (user?.role !== "student") {
      const hasStoredSession =
        globalThis.window !== undefined &&
        Boolean(sessionStorage.getItem("studentAccessToken"));

      if (!hasStoredSession) {
        router.replace("/students/login");
      }
    }
  }, [isPublicLanding, pathname, router, user, isLoading]);

  const isAuthPages =
    pathname?.startsWith("/students/login") ||
    pathname?.startsWith("/students/signup") ||
    pathname?.startsWith("/students/auth/") ||
    pathname?.startsWith("/api/v1/auth/"); // OAuth callback: browser URL during server rewrite

  // Sidebar collapsed state (desktop)
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((v) => !v);

  // Hide sidebar / bottom bar on the auth pages
  if (isPublicLanding || isAuthPages) return <>{children}</>;

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // compute left margin for content to account for fixed sidebar
  const contentLeftClass = collapsed ? "lg:ml-20" : "lg:ml-72";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantAppBar />

      {/* Fixed sidebar (on lg) sits at left; the content column gets a left margin */}
      <ApplicantSidebar collapsed={collapsed} />

      <div
        className={`${contentLeftClass} flex flex-col min-h-screen transition-[margin-left] duration-200`}
      >
        <ApplicantHeader
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-auto">{children}</main>

        <ApplicantBottomBar />
      </div>
    </div>
  );
}
