"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
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
  { label: "Personal Information", status: "Pending", completed: false, desc: "Identity and contact details" },
  { label: "Parents/Guardians", status: "Pending", completed: false, desc: "Guardian credentials" },
  { label: "Education", status: "Pending", completed: false, desc: "Academic records and documents" },
  { label: "Applied Program", status: "Pending", completed: false, desc: "Major and scholarship choices" },
  { label: "Review & Submit", status: "Pending", completed: false, desc: "Submission preview" },
];

const featureCards = [
  { title: "Schedule", description: "View your interview and exam schedule.", icon: CalendarDays, accent: "#10386B", bg: "bg-blue-50" },
  { title: "Enrollment Tracking", description: "Follow your enrollment readiness in real-time.", icon: CheckCircle2, accent: "#065f46", bg: "bg-emerald-50" },
  { title: "Results", description: "Check your official evaluation summary.", icon: Trophy, accent: "#92400e", bg: "bg-amber-50" },
  { title: "Profile", description: "Keep your personal details up to date.", icon: User, accent: "#374151", bg: "bg-slate-50" },
];

const benefits = [
  { icon: Shield, title: "Secure & Private", description: "Your data is protected with enterprise-grade security and encryption at rest." },
  { icon: Clock, title: "Quick Application", description: "Complete all admission steps in under 10 minutes with our guided flow." },
  { icon: Users, title: "Expert Support", description: "Get prompt, real human help from our dedicated admissions support team." },
];

export default function StudentLandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isLoginOpen]);

  const handleAccess = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) { toast.error("Please enter your full name"); return; }
    if (!trimmedEmail) { toast.error("Please enter your email address"); return; }
    if (!isStudent) { toast.error("Please confirm that you are a student"); return; }
    sessionStorage.setItem("studentAccessToken", `student:${trimmedEmail}`);
    sessionStorage.setItem("studentUser", JSON.stringify({ id: `student-${trimmedEmail}`, name: trimmedName, email: trimmedEmail, role: "student" }));
    toast.success("Welcome to ScholarPro Student Portal");
    router.push("/students/application");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#10386B] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/students" className="inline-flex items-center">
            <Image src="/images/logo.png" alt="ScholarPro" width={160} height={50} priority className="h-9 w-auto object-contain" />
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#why-us" className="hover:text-slate-900 transition-colors">Why Us</a>
          </nav>
          <button onClick={() => setIsLoginOpen(true)} className="inline-flex h-9 items-center justify-center rounded-lg bg-[#10386B] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0d2c54]">
            Sign In
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-100 bg-[#fafbfc]">
          {/* Soft background glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-slate-100/80 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:py-20 lg:px-8">
            {/* ── LEFT: Copy + CTA + Stats ── */}
            <div className="order-1 text-center lg:text-left lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10386B]/15 bg-[#10386B]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#10386B]">
                <Sparkles className="h-3.5 w-3.5" />
                Merit-Based Scholarship Program
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] leading-[1.08]">
                Start Your{" "}
                <span className="bg-gradient-to-r from-[#10386B] to-blue-600 bg-clip-text text-transparent">
                  Scholarship
                </span>{" "}
                Journey Today
              </h1>

              <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Unlock up to{" "}
                <strong className="text-slate-800 font-semibold">$1,600/year</strong>{" "}
                in academic support. Apply online in minutes, track your progress in real time.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#10386B] px-8 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:bg-[#0d2c54] hover:shadow-xl"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-[#10386B]"
                >
                  See how it works
                </a>
              </div>

              {/* Stats bar */}
              <div className="mt-12 grid max-w-md mx-auto lg:mx-0 grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-100/60">
                {[
                  { value: "$1,600", label: "Annual Award" },
                  { value: "150+", label: "Scholarships" },
                  { value: "4 Years", label: "Duration" },
                ].map((stat) => (
                  <div key={stat.label} className="px-4 text-center">
                    <div className="text-xl font-extrabold text-[#10386B]">{stat.value}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest font-semibold text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Graduate composition ── */}
            <div className="order-2 relative flex justify-center lg:justify-end lg:pr-10">
              <div className="relative">
                {/* Arch backdrop */}
                <div className="absolute -inset-x-8 bottom-0 top-4 rounded-t-full bg-gradient-to-b from-[#10386B]/10 via-blue-100/70 to-blue-50/40" />
                {/* Inner arch line for depth */}
                <div className="absolute -inset-x-3 bottom-0 top-10 rounded-t-full border border-[#10386B]/10" />

                {/* Dot grid accent */}
                <div className="absolute -right-14 top-14 h-24 w-24 bg-[radial-gradient(circle,rgba(16,56,107,0.28)_1.5px,transparent_1.5px)] bg-[size:12px_12px]" />
                {/* Ring accent */}
                <div className="absolute -left-12 top-1/3 h-14 w-14 rounded-full border-4 border-[#10386B]/15" />

                {/* Graduate photo */}
                <Image
                  src="/images/graduate.png"
                  alt="Scholarship graduate holding diploma"
                  width={460}
                  height={560}
                  priority
                  className="relative z-10 h-[400px] sm:h-[480px] w-auto object-contain drop-shadow-2xl"
                />

                {/* Floating badge — award value (left side) */}
                <div className="absolute -left-16 bottom-20 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 shadow-xl shadow-slate-200/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10386B]/10">
                    <GraduationCap className="h-5 w-5 text-[#10386B]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Annual Award</p>
                    <p className="text-lg font-extrabold text-[#10386B]">$1,600</p>
                  </div>
                </div>

                {/* Floating chip — scholarships (top right) */}
                <div className="absolute -right-10 top-24 z-20 flex items-center gap-2 rounded-full border border-slate-100 bg-white py-2 pl-2.5 pr-4 shadow-lg shadow-slate-200/80">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">150+ Scholarships</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Gallery */}
        <section className="relative w-full overflow-hidden py-10 border-b border-slate-100 bg-slate-50/40">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
            <div className="animate-marquee-container flex gap-5 px-3">
              {[...Array(2)].flatMap((_, gi) =>
                ["/images/portal-1.jpg", "/images/portal-2.jpg", "/images/portal-3.jpg", "/images/portal-4.png", "/images/portal-5.jpg"].map((src, i) => (
                  <div key={`g${gi}-${i}`} className="relative h-52 w-[320px] shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                    <Image src={src} alt={`Campus life ${i + 1}`} fill sizes="320px" priority={gi === 0 && i < 3} className="object-cover" />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Application Process</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">How the Application Works</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed">Five simple steps from registration to scholarship award. Complete each section and track your progress in real time.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            {applicationSteps.map((step, idx) => (
              <div key={step.label} className="group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#10386B]/20 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold" style={{ background: "#f0f5ff", color: "#10386B" }}>
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{step.label}</div>
                  <div className="mt-0.5 text-xs text-slate-400 leading-relaxed">{step.desc}</div>
                </div>
                {idx < applicationSteps.length - 1 && (
                  <ChevronRight className="absolute -right-2 top-6 hidden sm:block h-4 w-4 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-100 bg-[#fafbfc] py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Portal Features</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Everything You Need in One Place</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed">Track your application, manage your profile, and receive real-time updates from a single dashboard.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-slate-200">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} transition-transform duration-300 group-hover:scale-110`} style={{ color: card.accent }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section id="why-us" className="border-t border-slate-100 bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Why ScholarPro</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Built for Students, by Educators</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed">We make the scholarship application process simple, secure, and stress-free.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-[#fafbfc] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#10386B]/20 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[#10386B]" style={{ background: "#eef3fb" }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{benefit.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-100 bg-[#10386B] py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <GraduationCap className="mx-auto mb-5 h-10 w-10 text-white/40" />
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Ready to Secure Your Scholarship?</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/70 leading-relaxed">Join thousands of scholars who have transformed their education journey. Your application takes less than 10 minutes.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={() => setIsLoginOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-8 text-sm font-semibold text-[#10386B] shadow transition-all duration-200 hover:bg-slate-50 hover:shadow-md">
                Start Your Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[10px] text-white/50 font-semibold uppercase tracking-wider">
              {["Free to apply", "Takes 10 minutes", "No hidden fees"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Image src="/images/logo.png" alt="ScholarPro" width={120} height={40} className="h-7 w-auto object-contain opacity-60" />
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ScholarPro. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)} />
          <div className="relative w-full max-w-sm">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-2xl">
              <button onClick={() => setIsLoginOpen(false)} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                <X className="h-4 w-4" />
              </button>
              <div className="flex flex-col items-center text-center">
                <Image src="/images/logo.png" alt="ScholarPro" width={140} height={44} className="h-auto max-w-[140px]" />
                <p className="mt-2 text-xs text-slate-400">Student Application Portal</p>
              </div>
              <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#10386B]">Passwordless Access</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">No password required — simply identify yourself to explore or register.</p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="h-10 rounded-lg border-slate-200 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#10386B] focus-visible:border-[#10386B]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.edu" className="h-10 rounded-lg border-slate-200 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#10386B] focus-visible:border-[#10386B]" />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="student-confirm" checked={isStudent} onCheckedChange={(c) => setIsStudent(c === true)} className="mt-0.5 border-slate-300 data-[state=checked]:border-[#10386B] data-[state=checked]:bg-[#10386B]" />
                    <label htmlFor="student-confirm" className="cursor-pointer">
                      <span className="block text-sm font-semibold text-slate-700">I am a student</span>
                      <span className="mt-0.5 block text-xs text-slate-500 leading-relaxed">I confirm I am an active scholarship candidate.</span>
                    </label>
                  </div>
                </div>
                <Button type="button" onClick={handleAccess} className="h-11 w-full rounded-lg bg-[#10386B] text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-[#0d2c54] hover:shadow-md">
                  Enter Portal
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Already started?{" "}
                  <button onClick={() => router.push("/students/application")} className="font-semibold text-[#10386B] hover:underline">
                    Continue application
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}