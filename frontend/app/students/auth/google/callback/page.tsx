"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/api/service/auth.service";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("Signing you in…");

  // Prevent React 18 Strict Mode double-invocation from firing the exchange twice.
  // Google auth codes are single-use — a second call with the same code fails.
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) return;
    hasExchanged.current = true;

    // Read params directly from the browser URL rather than useSearchParams().
    // Next.js server-side rewrites do not always propagate query params through
    // the App Router's useSearchParams() hook on static destination pages.
    const params = new URLSearchParams(window.location.search);

    const error = params.get("error");
    if (error) {
      setStatus("error");
      setMessage("Google sign-in was cancelled. You can close this page.");
      return;
    }

    // params.get() auto-decodes percent-encoded characters (%2F → /)
    const code = params.get("code");
    if (!code) {
      setStatus("error");
      setMessage("Invalid callback — missing auth code. Please try again.");
      return;
    }

    let mounted = true;

    const handleCallback = async () => {
      try {
        const res = await authService.postGoogleCallback(code);

        if (!res.success || !res.data) {
          throw new Error(res.message || "Invalid response from server");
        }

        const { accessToken: token, userProfile } = res.data;

        const studentUser = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
          avatar: userProfile.profileUrl ?? undefined,
        };

        // Persist to sessionStorage FIRST — survives page refreshes, cleared on tab close.
        sessionStorage.setItem("studentAccessToken", token);
        sessionStorage.setItem("studentUser", JSON.stringify(studentUser));

        // Update in-memory Zustand store
        setAccessToken(token);
        setUser(studentUser);

        toast.success(res.message || "Welcome! You are now signed in.");
        router.replace("/students/application");
      } catch (err) {
        if (!mounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Sign-in failed. Please try again.";
        setStatus("error");
        setMessage(msg);
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-14 h-14 mb-6">
        <Image
          src="/login.png"
          alt="ScholarPro"
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>

      {status === "loading" ? (
        <>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm">{message}</p>
        </>
      ) : (
        <>
          <p className="text-red-600 font-medium mb-2">Authentication failed</p>
          <p className="text-gray-500 text-sm mb-5 text-center max-w-xs">
            {message}
          </p>
          <button
            onClick={() => router.push("/students/login")}
            className="text-blue-600 text-sm font-semibold hover:underline underline-offset-2"
          >
            Back to sign-in
          </button>
        </>
      )}
    </div>
  );
}
