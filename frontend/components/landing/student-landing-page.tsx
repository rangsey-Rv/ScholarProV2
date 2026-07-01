import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const highlights = [
  {
    value: "150+",
    label: "Scholarships Available",
    icon: GraduationCap,
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    value: "$1,200",
    label: "Annual Support Stipend",
    icon: BadgeCheck,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    value: "4 Years",
    label: "Scholarship Duration",
    icon: CalendarDays,
    accent: "bg-violet-50 text-violet-600",
  },
];

const steps = [
  {
    title: "Create your profile",
    description:
      "Register with your school details, guardian information, and academic record in one guided flow.",
    icon: Users,
  },
  {
    title: "Track your progress",
    description:
      "Monitor eligibility checks, examination schedules, interview updates, and document status from a single dashboard.",
    icon: BookOpen,
  },
  {
    title: "Stay ready for review",
    description:
      "Receive reminders, confirm milestones, and keep every scholarship requirement organized before final selection.",
    icon: ShieldCheck,
  },
];

const benefits = [
  "Application progress updates in real time",
  "Exam and interview reminders in one place",
  "Secure access to student records and results",
  "A simple, mobile-friendly portal for every step",
];

export default function StudentLandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fc] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
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
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at top, rgba(79,70,229,0.12), transparent 35%), radial-gradient(circle at right, rgba(124,58,237,0.12), transparent 28%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                "linear-gradient(to right, transparent, rgb(203 213 225), transparent)",
            }}
          />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold tracking-[0.2em] text-indigo-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                NATIONAL MERIT ACADEMIC SCHOLARSHIP PROGRAM
              </div>

              <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                <span className="block">Your Scholarship</span>
                <span
                  className="mt-2 block bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #4f46e5, #7c3aed, #d946ef)",
                  }}
                >
                  Journey Starts Here
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Follow a clear, student-first application flow to register your
                profile, track examinations, prepare for interviews, and review
                your scholarship status in one consolidated portal.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/students/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start Application
                </Link>
                <Link
                  href="/students/login"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
                >
                  Access Your Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.label}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.35)] transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.accent}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-3xl font-extrabold tracking-tight text-slate-950">
                          {item.value}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="rounded-4xl bg-[#17253d] px-6 py-10 text-center text-white shadow-[0_30px_80px_-35px_rgba(23,37,61,0.7)] sm:px-10 lg:px-16 lg:py-14">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to apply?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Register once, keep your scholarship information organized, and
              return anytime to review your progress or continue your next
              step.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/students/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Access Your Portal
                <ArrowRight className="ml-2 h-4 w-4 text-indigo-600" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-20" id="steps">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-indigo-500">
              THREE CLEAR STEPS
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Explore the scholarship flow
            </h2>
            <p className="mt-4 text-slate-600">
              Built to keep the student journey simple, visible, and easy to
              continue from any device.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Step {index + 1}
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                Everything students need in one place
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-4xl border border-indigo-100 bg-indigo-600 p-8 text-white shadow-[0_20px_60px_-35px_rgba(79,70,229,0.55)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-100/80">
                Student Portal
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Keep your scholarship journey moving.
              </h2>
              <p className="mt-4 leading-7 text-indigo-50/90">
                Sign in to review your submitted information, continue an
                application, or check the latest updates from the scholarship
                team.
              </p>
              <Link
                href="/students/login"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-indigo-700 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Sign in to continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}