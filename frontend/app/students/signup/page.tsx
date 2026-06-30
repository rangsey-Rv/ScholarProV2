"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TelegramWhite from "@/components/icons/TelegramWhite";
import GoogleColor from "@/components/icons/GoogleColor";
import TurnstileWidget from "@/components/auth/TurnstileWidget";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentSignupPage() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleGoogle = async () => {
    if (!captchaVerified) {
      toast.error("Please complete the CAPTCHA verification first");
      return;
    }
    // The backend endpoint issues a 302 directly to Google OAuth.
    // We must redirect the browser to it rather than calling it via axios.
    window.location.href = `/api/auth/google${captchaToken ? `?captcha=${encodeURIComponent(captchaToken)}` : ""}`;
  };

  const handleTelegram = async () => {
    if (!captchaVerified) {
      toast.error("Please complete the CAPTCHA verification first");
      return;
    }
    // TODO: Set NEXT_PUBLIC_TELEGRAM_BOT_NAME in .env to enable Telegram OAuth.
    // The bot must be registered with @BotFather and have login widget enabled.
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
    if (!botName) {
      toast.info(
        "Telegram sign-in is not configured yet. Please use Google to sign in.",
      );
      return;
    }
    const callbackUrl = encodeURIComponent(
      `${window.location.origin}/api/auth/telegram/callback`,
    );
    window.location.href = `https://oauth.telegram.org/auth?bot_id=${botName}&origin=${encodeURIComponent(window.location.origin)}&return_to=${callbackUrl}&request_access=write`;
  };

  return (
    <>
      {/* Animated background (light) */}
      <div className="fixed inset-0 bg-white" style={{ zIndex: 0 }} />
      <AnimatedBackground />

      {/* Page layout */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ zIndex: 1 }}
      >
        {/* Card */}
        <div
          className={`w-full max-w-sm transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 ">
                <Image
                  src="/login.png"
                  alt="ScholarPro"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-gray-900 text-[1.1rem] font-semibold text-center leading-snug mb-7">
              Continue to ScholarPro Student
            </h1>

            {/* ── OAuth Buttons ── */}
            <div className="space-y-3 mb-5">
              <Button
                onClick={handleGoogle}
                variant="outline"
                className="w-full flex items-center justify-start gap-3 rounded-md px-4 py-3 text-sm"
              >
                <GoogleColor size={24} className="flex-shrink-0" />
                <span className="flex-1 text-center">Continue with Google</span>
              </Button>

              <Button
                onClick={handleTelegram}
                className="w-full flex items-center justify-start gap-3 bg-[#26a5e4] hover:bg-[#1fa1db] active:bg-[#158fc0] rounded-md px-4 py-3 text-white text-sm"
              >
                <TelegramWhite size={20} className="flex-shrink-0" />
                <span className="flex-1 text-center">
                  Continue with Telegram
                </span>
              </Button>
            </div>

            {/* CAPTCHA */}
            <TurnstileWidget
              verified={captchaVerified}
              onVerify={(token) => {
                setCaptchaToken(token);
                setCaptchaVerified(true);
              }}
            />

            <div className="my-5 flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-500">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Continue / Sign in link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/students/login")}
                className="text-blue-600 font-semibold hover:underline underline-offset-2 transition-colors"
              >
                Sign in
              </button>
            </p>

            {/* Powered by */}
            <p className="text-center text-[11px] text-gray-500 mt-5">
              Powered by ScholarPro
            </p>
          </div>
        </div>

        {/* ── Outside card: Terms & Privacy ── */}
        <div
          className={`mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-500 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="/terms"
            className="hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
          >
            Terms of Service
          </a>
          <span className="text-gray-600">·</span>
          <a
            href="/privacy"
            className="hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </>
  );
}
