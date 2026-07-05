"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import {
  getProgressItems,
  getProgressPercent,
  getStatusMeta,
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

const quickLinks = [
  {
    key: "registration",
    title: "Registration",
    description: "Review your application status and complete the registration steps.",
    icon: FileText,
    href: "/students/application",
  },
  {
    key: "exam",
    title: "Exam Session",
    description: "See the announced date, time, and room for your exam.",
    icon: CalendarDays,
    href: "/students/exam",
  },
  {
    key: "result",
    title: "Result",
    description: "View your latest scholarship result and academic outcome.",
    icon: GraduationCap,
    href: "/students/grade",
  },
  {
    key: "profile",
    title: "Profile",
    description: "Keep your student information and contact details updated.",
    icon: UserCircle2,
    href: "/students/profile",
  },
];

export default function StudentPortalDashboard() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  const progressItems = useMemo(
    () => (snapshot ? getProgressItems(snapshot) : []),
    [snapshot],
  );

  const percent = useMemo(
    () => (snapshot ? getProgressPercent(snapshot) : 0),
    [snapshot],
  );

  const statusMeta = snapshot
    ? getStatusMeta(snapshot.applicationStatus)
    : null;

  const isExamAnnounced = Boolean(
    snapshot?.examDate || snapshot?.examTime || snapshot?.examLocation,
  );

  if (!snapshot) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_55%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                Student Portal
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Welcome back, {snapshot.profile.name}
              </h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Your registration, exam session, and result information are all in
                one place. Review your progress and stay ready for the next step.
              </p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              {statusMeta?.label}
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Registration progress
                  </p>
                  <p className="text-sm text-slate-500">
                    Track your admission journey step by step
                  </p>
                </div>
                <div className="text-sm font-semibold text-slate-900">{percent}%</div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-5 space-y-2">
                {progressItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                    Exam status
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {isExamAnnounced ? "Schedule announced" : "Schedule pending"}
                  </p>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${isExamAnnounced ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}
                >
                  {isExamAnnounced ? "Announced" : "Pending"}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-sky-200">
                    <CalendarDays className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Date
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {snapshot.examDate ?? "To be announced"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-sky-200">
                    <Clock3 className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Time
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {snapshot.examTime ?? "To be announced"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-sky-200">
                    <MapPin className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      Room
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {snapshot.examLocation ?? "To be announced"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.key}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" />
                </div>
              </a>
            );
          })}
        </section>
      </div>
    </div>
  );
}
