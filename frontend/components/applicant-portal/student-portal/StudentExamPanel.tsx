"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  NotebookText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  getStatusMeta,
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

export default function StudentExamPanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  if (!snapshot) return null;

  const statusMeta = getStatusMeta(snapshot.applicationStatus);
  const isAnnounced = Boolean(
    snapshot.examDate || snapshot.examTime || snapshot.examLocation,
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_55%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-4xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
        <div className="rounded-4xl bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                Exam Session
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Your examination details are ready
              </h1>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Please review your exam information carefully. Make sure you
                know the exact date, time, and room before attending.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`rounded-full border px-4 py-2 text-sm font-medium ${isAnnounced ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200" : "border-amber-400/40 bg-amber-500/15 text-amber-200"}`}
              >
                {isAnnounced
                  ? "Schedule announced"
                  : "Schedule not yet announced"}
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                {statusMeta.label}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sky-200">
                <CalendarDays className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Date
                </p>
              </div>
              <p className="mt-3 text-xl font-semibold text-white">
                {snapshot.examDate ?? "To be announced"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sky-200">
                <Clock3 className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Time
                </p>
              </div>
              <p className="mt-3 text-xl font-semibold text-white">
                {snapshot.examTime ?? "To be announced"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sky-200">
                <MapPin className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Room
                </p>
              </div>
              <p className="mt-3 text-xl font-semibold text-white">
                {snapshot.examLocation ?? "To be announced"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Attendance status
                </p>
                <p className="text-sm text-slate-500">
                  Keep your exam slot confirmed and ready
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Schedule announcement
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {isAnnounced
                      ? "The exam schedule has been announced."
                      : "The schedule is still being prepared and will be shared soon."}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${isAnnounced ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {isAnnounced ? "Announced" : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                Important notes
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 text-blue-600" />
                  <span>
                    Bring your identification card and required documents.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 size-4 text-emerald-600" />
                  <span>Arrive at least 15 minutes early for check-in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 text-blue-600" />
                  <span>Double-check the room number before coming in.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <NotebookText className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  What to prepare
                </p>
                <p className="text-sm text-slate-500">
                  Make sure you are fully ready before the exam starts
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Bring a valid ID and any required supporting papers.",
                "Review the exam location and room number in advance.",
                "Keep your phone switched off and avoid entering late.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
