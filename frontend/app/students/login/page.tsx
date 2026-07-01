"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function StudentLoginPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleAccess = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Please enter your full name");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isStudent) {
      toast.error("Please confirm that you are a student");
      return;
    }

    sessionStorage.setItem("studentAccessToken", `student:${trimmedEmail}`);
    sessionStorage.setItem(
      "studentUser",
      JSON.stringify({
        id: `student-${trimmedEmail}`,
        name: trimmedName,
        email: trimmedEmail,
        role: "student",
      }),
    );

    toast.success("Welcome to ScholarPro Student");
    router.push("/students/application");
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#f5f7fc]" style={{ zIndex: 0 }} />

      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ zIndex: 1 }}
      >
        <div
          className={`w-full max-w-xl transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Image
                  src="/images/logo.png"
                  alt="ScholarPro"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  priority
                />
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Bright Horizons
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Academic Scholarship &amp; Support Portal
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase">
                Passwordless Access
              </p>
              <p className="mt-2 text-sm text-slate-600">
                No password required. Simply identify yourself as a student to
                explore or register.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Full Name
                </span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Email Address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.edu"
                    className="h-12 rounded-xl border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </label>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="student-confirmation"
                    checked={isStudent}
                    onCheckedChange={(checked) => setIsStudent(checked === true)}
                    className="mt-1 border-slate-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                  />
                  <label htmlFor="student-confirmation" className="cursor-pointer">
                    <span className="block text-sm font-semibold text-slate-800">
                      I am a student
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      Checking this box declares my identity as an active
                      scholarship candidate.
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAccess}
                className="h-12 w-full rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Enter Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <hr className="flex-1 border-slate-200" />
              <span className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                or
              </span>
              <hr className="flex-1 border-slate-200" />
            </div>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have a student session?{" "}
              <button
                onClick={() => router.push("/students/application")}
                className="font-semibold text-indigo-600 hover:underline underline-offset-4"
              >
                Continue to the second page
              </button>
            </p>
          </div>
        </div>

        <div
          className={`mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <a
            href="/terms"
            className="hover:text-slate-700 transition-colors underline-offset-2 hover:underline"
          >
            Terms of Service
          </a>
          <span className="text-slate-400">·</span>
          <a
            href="/privacy"
            className="hover:text-slate-700 transition-colors underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </>
  );
}
