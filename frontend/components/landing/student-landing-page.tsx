"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Mail,
  Shield,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const applicationSteps = [
  { label: "Personal Information", status: "Pending", completed: false },
  { label: "Parents/Guardians", status: "Pending", completed: false },
  { label: "Education", status: "Pending", completed: false },
  { label: "Applied Program", status: "Pending", completed: false },
  { label: "Review & Submit", status: "Pending", completed: false },
];

const featureCards = [
  {
    title: "Schedule",
    description: "View your interview and exam schedule.",
    icon: CalendarDays,
    color: "text-blue-900",
    bg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Enrollment Tracking",
    description: "Follow your enrollment readiness.",
    icon: CheckCircle2,
    color: "text-blue-800",
    bg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Result",
    description: "Check your official result summary.",
    icon: Trophy,
    color: "text-blue-700",
    bg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Profile",
    description: "Keep your details up to date.",
    icon: User,
    color: "text-slate-600",
    bg: "bg-slate-100",
    borderColor: "border-slate-200",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security",
  },
  {
    icon: Clock,
    title: "Quick Application",
    description: "Complete your application in less than 10 minutes",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Get help from our dedicated support team anytime",
  },
];

export default function StudentLandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoginOpen]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/students" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="ScholarPro"
              width={190}
              height={60}
              priority
              className="h-auto max-w-[190px]"
            />
          </Link>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-full bg-blue-900 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-xl"
          >
            Sign in
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
          {/* Background Decorations */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-200/50 to-blue-300/50 blur-3xl" />
            <div className="absolute -right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/40 to-blue-200/40 blur-3xl" />
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-900 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-900" />
              Admissions Overview
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Your Scholarship{" "}
              <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                Journey
              </span>{" "}
              Starts Here
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600 leading-relaxed">
              Your future begins with a single step. Join our merit-based scholarship program and unlock opportunities worth $1600 annually.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-900 to-blue-800 px-8 text-base font-semibold text-white shadow-xl shadow-blue-900/25 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/30"
              >
                Access Portal
              </button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">$1600</div>
                <div className="mt-2 text-sm font-medium text-slate-600">Annual Award</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-700 bg-clip-text text-transparent">150+</div>
                <div className="mt-2 text-sm font-medium text-slate-600">Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">4 Years</div>
                <div className="mt-2 text-sm font-medium text-slate-600">Duration</div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Progress Card */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/5 sm:p-12">
            {/* Card Header */}
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Welcome back, Applicant
                </h2>
                <p className="mt-2 text-slate-600">
                  Your current status is New. Complete your application to get started.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 border border-blue-200">
                New Application
              </span>
            </div>

            {/* Progress Timeline */}
            <div className="mb-10">
              <div className="relative">
                <div className="absolute left-0 right-0 top-5 h-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />
                <div className="relative flex justify-between">
                  {applicationSteps.map((step) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step.completed
                            ? "border-blue-900 bg-blue-900"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                      <span className="mt-3 text-xs font-medium text-slate-600 text-center max-w-[100px]">
                        {step.label}
                      </span>
                      <span className="mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Steps Grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* Steps List */}
              <div className="space-y-3">
                {applicationSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 font-bold text-white shadow-md">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {step.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {step.label === "Personal Information" &&
                            "Your identity and contact details"}
                          {step.label === "Parents/Guardians" &&
                            "Contact details for your guardian"}
                          {step.label === "Education" &&
                            "Academic background and documents"}
                          {step.label === "Applied Program" &&
                            "Major, scholarship, and intake choices"}
                          {step.label === "Review & Submit" &&
                            "Application submitted for review"}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 transition-all duration-200 group-hover:text-blue-900 group-hover:translate-x-1" />
                  </div>
                ))}
              </div>

              {/* Side Info */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-blue-800">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900">Current Status</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    A new application has been started and is ready for completion.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-blue-700">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900">Next Milestone</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Complete the application steps and submit for review.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-600">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900">Scholarship Value</h3>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">$400</div>
                  <p className="text-sm text-slate-600">Annual support stipend</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Track your application, manage your profile, and stay updated — all in one place.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`group rounded-2xl border ${card.borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100`}
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${card.bg} ${card.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Why Choose ScholarPro?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-200">
                We make the scholarship application process simple, secure, and stress-free.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-blue-200">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-24 sm:py-32">
          {/* Background Decorations */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to Transform Your Future?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 leading-relaxed">
              Join thousands of students who have already started their scholarship journey. Your future is waiting.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-blue-900 shadow-xl shadow-blue-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:scale-105"
              >
                Access Portal
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                <span>Free to apply</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                <span>Takes 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-300" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsLoginOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-xl animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
              {/* Close Button */}
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header with Logo */}
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/logo.png"
                  alt="ScholarPro"
                  width={180}
                  height={56}
                  className="h-auto max-w-[180px]"
                />
                <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  Academic Scholarship & Support Portal
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-7 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-5 text-center">
                <p className="text-xs font-bold tracking-[0.18em] text-blue-900 uppercase">
                  Passwordless Access
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  No password required. Simply identify yourself as a student to
                  explore or register.
                </p>
              </div>

              {/* Form */}
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
                      className="h-12 rounded-xl border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:border-blue-900"
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
                      className="h-12 rounded-xl border-slate-200 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:border-blue-900"
                    />
                  </div>
                </label>

                <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="student-confirmation"
                      checked={isStudent}
                      onCheckedChange={(checked) => setIsStudent(checked === true)}
                      className="mt-1 border-slate-300 data-[state=checked]:border-blue-900 data-[state=checked]:bg-blue-900"
                    />
                    <label htmlFor="student-confirmation" className="cursor-pointer">
                      <span className="block text-sm font-semibold text-slate-800">
                        I am a student
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        Checking this box declares my identity as an active
                        scholarship candidate.
                      </span>
                    </label>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAccess}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold shadow-lg shadow-blue-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Enter Portal
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
                  className="font-semibold text-blue-900 hover:text-blue-800 underline underline-offset-4 transition-colors"
                >
                  Continue to the second page
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}