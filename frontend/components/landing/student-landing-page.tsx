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
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  saveStudentPortalSnapshot,
  loadStudentPortalSnapshot,
  formatNameFromEmail,
} from "@/lib/utils/student-portal";

const applicationSteps = [
  { label: "Personal Info", desc: "Basic identity and contact details" },
  { label: "Guardians", desc: "Parent or guardian credentials" },
  { label: "Education", desc: "Academic records and transcripts" },
  { label: "Program", desc: "Major and scholarship preferences" },
  { label: "Review", desc: "Final preview and submission" },
];

const featureCards = [
  { 
    title: "Smart Scheduling", 
    description: "Never miss an interview or exam with integrated calendar views and automated reminders.", 
    icon: CalendarDays, 
    accent: "#10386B", 
    bg: "bg-blue-50" 
  },
  { 
    title: "Live Status Tracking", 
    description: "Monitor your application's progress through each review stage with clear, real-time updates.", 
    icon: CheckCircle2, 
    accent: "#065f46", 
    bg: "bg-emerald-50" 
  },
  { 
    title: "Centralized Documents", 
    description: "Upload, manage, and verify all required academic and personal files in one secure vault.", 
    icon: FileText, 
    accent: "#92400e", 
    bg: "bg-amber-50" 
  },
  { 
    title: "Direct Communication", 
    description: "Receive official evaluation results and communicate directly with the admissions committee.", 
    icon: Mail, 
    accent: "#374151", 
    bg: "bg-slate-50" 
  },
];

const benefits = [
  { 
    icon: Shield, 
    title: "Enterprise-Grade Security", 
    description: "Your personal and academic data is protected with end-to-end encryption and strict privacy controls." 
  },
  { 
    icon: Clock, 
    title: "Streamlined Process", 
    description: "Our guided, intuitive flow ensures you can complete your entire submission efficiently without friction." 
  },
  { 
    icon: Users, 
    title: "Dedicated Support", 
    description: "Access prompt, human assistance from our specialized admissions support team whenever you need it." 
  },
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
    const trimmedEmail = email.trim();
    let trimmedName = fullName.trim();
    
    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!trimmedName) {
      trimmedName = formatNameFromEmail(trimmedEmail);
    }
    if (!isStudent) {
      toast.error("Please confirm that you are a student");
      return;
    }

    const studentUser = {
      id: `student-${trimmedEmail}`,
      name: trimmedName,
      email: trimmedEmail,
      role: "student" as const,
    };

    sessionStorage.setItem("studentAccessToken", `student:${trimmedEmail}`);
    sessionStorage.setItem("studentUser", JSON.stringify(studentUser));

    // Update in-memory Zustand store first so getActiveStudentEmail finds it
    useAuthStore.getState().setAccessToken(`student:${trimmedEmail}`);
    useAuthStore.getState().setUser(studentUser);

    // Check if user already has saved form data; if not, initialize profile
    const existing = loadStudentPortalSnapshot(trimmedEmail);
    if (!existing.applicationData) {
      saveStudentPortalSnapshot(
        {
          profile: {
            name: trimmedName,
            email: trimmedEmail,
            phone: "—",
            studentId: existing.profile.studentId || "APP-001",
          },
        },
        trimmedEmail,
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("student-profile-updated"));
      window.dispatchEvent(new Event("student-portal-updated"));
    }

    toast.success("Welcome to the ScholarPro Student Portal");
    router.push("/students/application");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#10386B] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/students" className="inline-flex items-center gap-2">
            <Image src="/images/logo.png" alt="ScholarPro" width={140} height={44} priority className="h-8 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-[#10386B] transition-colors">Process</a>
            <a href="#features" className="hover:text-[#10386B] transition-colors">Portal Features</a>
            <a href="#why-us" className="hover:text-[#10386B] transition-colors">Why ScholarPro</a>
          </nav>
          <button 
            onClick={() => setIsLoginOpen(true)} 
            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#10386B] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0d2c54] hover:shadow-md"
          >
            Sign In
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-[#fafbfc]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-100/60 blur-3xl" />
            <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-slate-100/80 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
            <div className="order-1 text-center lg:text-left lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10386B]/15 bg-[#10386B]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#10386B]">
                <Sparkles className="h-3.5 w-3.5" />
                Merit-Based Scholarship Program
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] leading-[1.1]">
                Start Your{" "}
                <span className="bg-gradient-to-r from-[#10386B] to-blue-600 bg-clip-text text-transparent">
                  Scholarship
                </span>{" "}
                Journey Today
              </h1>

              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Unlock up to <strong className="text-slate-900 font-semibold">$1,600/year</strong> in academic support. 
                Our streamlined platform makes applying simple, transparent, and efficient.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#10386B] px-8 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition-all duration-200 hover:bg-[#0d2c54] hover:shadow-xl"
                >
                  Begin Application
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#10386B]/30 hover:text-[#10386B]"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-12 grid max-w-md mx-auto lg:mx-0 grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {[
                  { value: "$1,600", label: "Annual Award" },
                  { value: "150+", label: "Available Slots" },
                  { value: "4 Years", label: "Renewable" },
                ].map((stat) => (
                  <div key={stat.label} className="px-4 text-center">
                    <div className="text-xl font-extrabold text-[#10386B]">{stat.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider font-semibold text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-2 relative flex justify-center lg:justify-end lg:pr-10">
              <div className="relative">
                <div className="absolute -inset-x-8 bottom-0 top-4 rounded-t-full bg-gradient-to-b from-[#10386B]/10 via-blue-100/60 to-blue-50/30" />
                <div className="absolute -inset-x-3 bottom-0 top-10 rounded-t-full border border-[#10386B]/10" />
                <div className="absolute -right-14 top-14 h-24 w-24 bg-[radial-gradient(circle,rgba(16,56,107,0.2)_1.5px,transparent_1.5px)] bg-[size:12px_12px]" />
                <div className="absolute -left-12 top-1/3 h-14 w-14 rounded-full border-4 border-[#10386B]/10" />

                <Image
                  src="/images/graduate.png"
                  alt="Scholarship graduate"
                  width={460}
                  height={560}
                  priority
                  className="relative z-10 h-[400px] sm:h-[480px] w-auto object-contain drop-shadow-2xl"
                />

                <div className="absolute -left-8 bottom-24 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl shadow-slate-200/60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10386B]/10">
                    <GraduationCap className="h-5 w-5 text-[#10386B]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Annual Award</p>
                    <p className="text-lg font-extrabold text-[#10386B]">$1,600</p>
                  </div>
                </div>

                <div className="absolute -right-6 top-24 z-20 flex items-center gap-2 rounded-full border border-slate-100 bg-white py-2 pl-2.5 pr-4 shadow-lg shadow-slate-200/60">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">150+ Scholarships</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Preview */}
        <section className="relative w-full overflow-hidden py-12 border-b border-slate-100 bg-slate-50/50">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50/50 to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-marquee-container w-max hover:[animation-play-state:paused]">
              {[...Array(2)].flatMap((_, gi) =>
                ["/images/portal-1.jpg", "/images/portal-2.jpg", "/images/portal-3.jpg", "/images/portal-4.png", "/images/portal-5.jpg"].map((src, i) => (
                  <div key={`g${gi}-${i}`} className="relative h-56 w-[360px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-transform hover:scale-[1.02]">
                    <Image src={src} alt={`Portal preview ${i + 1}`} fill sizes="360px" className="object-cover" />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Application Process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Five Simple Steps</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 leading-relaxed">
              From initial registration to final submission, our guided flow ensures you never miss a requirement.
            </p>
          </div>
          
          <div className="relative grid gap-6 sm:grid-cols-5">
            {applicationSteps.map((step, idx) => (
              <div key={step.label} className="group relative flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#10386B]/30 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold bg-[#f0f5ff] text-[#10386B]">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{step.label}</div>
                  <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">{step.desc}</div>
                </div>
                {idx < applicationSteps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-8 hidden sm:block h-5 w-5 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-slate-100 bg-[#fafbfc] py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Portal Capabilities</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything You Need</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 leading-relaxed">
                A comprehensive dashboard designed to keep you organized and informed throughout your academic journey.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="group flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-slate-200">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} transition-transform duration-300 group-hover:scale-110`} style={{ color: card.accent }}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section id="why-us" className="border-t border-slate-100 bg-white py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#10386B]">Why ScholarPro</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Built for Students, by Educators</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 leading-relaxed">
                We prioritize your success and security, removing the friction from traditional scholarship applications.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-[#fafbfc] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#10386B]/20 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-[#10386B] bg-[#eef3fb]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-100 bg-[#10386B] py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <GraduationCap className="mx-auto mb-6 h-12 w-12 text-white/30" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to Secure Your Future?</h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/70 leading-relaxed">
              Join thousands of scholars who have transformed their educational journey. Your path to funding starts here.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setIsLoginOpen(true)} 
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-[#10386B] shadow-lg transition-all duration-200 hover:bg-slate-50 hover:shadow-xl"
              >
                Start Your Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-white/50 font-semibold uppercase tracking-wider">
              {["No Application Fees", "Secure Data Handling", "Dedicated Support"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-white/70" /><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="ScholarPro" width={120} height={40} className="h-7 w-auto object-contain opacity-70" />
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-[#10386B] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#10386B] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#10386B] transition-colors">Contact Support</a>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ScholarPro. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsLoginOpen(false)} />
          <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-2xl">
              <button 
                onClick={() => setIsLoginOpen(false)} 
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <Image src="/images/logo.png" alt="ScholarPro" width={140} height={44} className="h-auto max-w-[140px]" />
                <p className="mt-3 text-sm text-slate-500">Student Application Portal</p>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50/50 border border-blue-100 px-4 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#10386B]">Passwordless Access</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">Enter your details to seamlessly access or begin your application.</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="Enter your full name" 
                      className="h-11 rounded-lg border-slate-200 pl-10 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#10386B] focus-visible:border-[#10386B]" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="you@example.edu" 
                      className="h-11 rounded-lg border-slate-200 pl-10 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#10386B] focus-visible:border-[#10386B]" 
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="student-confirm" 
                      checked={isStudent} 
                      onCheckedChange={(c) => setIsStudent(c === true)} 
                      className="mt-0.5 border-slate-300 data-[state=checked]:border-[#10386B] data-[state=checked]:bg-[#10386B]" 
                    />
                    <label htmlFor="student-confirm" className="cursor-pointer select-none">
                      <span className="block text-sm font-semibold text-slate-800">I am a student</span>
                      <span className="mt-0.5 block text-xs text-slate-500 leading-relaxed">I confirm I am an active scholarship candidate.</span>
                    </label>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleAccess} 
                  className="h-11 w-full rounded-lg bg-[#10386B] text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-[#0d2c54] hover:shadow-md"
                >
                  Enter Portal
                </Button>
                
                <p className="text-center text-xs text-slate-500">
                  Already started?{" "}
                  <button 
                    onClick={() => {
                      setIsLoginOpen(false);
                      router.push("/students/application");
                    }} 
                    className="font-semibold text-[#10386B] hover:underline"
                  >
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