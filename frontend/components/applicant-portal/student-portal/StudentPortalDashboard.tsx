"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, GraduationCap, UserCircle2 } from "lucide-react";
import {
  getProgressItems,
  getProgressPercent,
  getStatusMeta,
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

const sessionCards = [
  {
    key: "schedule",
    title: "Schedule",
    description: "View your interview and exam schedule.",
    icon: CalendarDays,
    href: "/students/exam",
  },
  {
    key: "enrollment",
    title: "Enrollment Tracking",
    description: "Follow your enrollment readiness.",
    icon: GraduationCap,
    href: "/students/progress",
  },
  {
    key: "result",
    title: "Result",
    description:
      "Check your official result summary when you become a student.",
    icon: GraduationCap,
    href: "/students/grade",
  },
  {
    key: "profile",
    title: "Profile",
    description: "Keep your personal and contact details up to date.",
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

  if (!snapshot) return null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Admissions Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Welcome back, {snapshot.profile.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Your current status is {statusMeta?.label}. See your progress,
              exam schedule, and result status in one place.
            </p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-sm font-medium ${statusMeta?.tone}`}
          >
            {statusMeta?.label}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">
                Application progress
              </p>
              <p className="text-sm font-semibold text-slate-900">{percent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {progressItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
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

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Current result
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {statusMeta?.detail}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-800">Next milestone</p>
              <p className="mt-1">
                {(() => {
                  switch (snapshot.applicationStatus) {
                    case "new":
                      return "Complete the application steps and submit for review.";
                    case "submitted":
                      return "Your application is waiting for review by the admissions team.";
                    case "under_review":
                      return "The committee is reviewing your file and additional information may be requested.";
                    case "exam_scheduled":
                      return "Prepare for your exam or interview session.";
                    default:
                      return "Your admission result is ready to be reviewed.";
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sessionCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.key}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="size-5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
