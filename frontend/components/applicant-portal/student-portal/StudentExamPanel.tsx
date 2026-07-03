"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin, NotebookText } from "lucide-react";
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
  const isScheduled = snapshot.applicationStatus === "exam_scheduled";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Schedule Exam
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Your exam and interview scheduling
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Check your exam details here once your application reaches this
              stage.
            </p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.tone}`}
          >
            {statusMeta.label}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-800">
              <CalendarDays className="size-4 text-blue-600" />
              <p className="font-medium">Scheduled session</p>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {snapshot.examDate ?? "To be announced"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {snapshot.examTime ?? "To be announced"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {snapshot.examLocation ?? "To be announced"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-sm font-medium text-slate-700">
                  Review status
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${isScheduled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {isScheduled ? "Review Done" : "Under Review"}
                </span>
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                {isScheduled
                  ? "Your exam session has been confirmed. Please arrive 15 minutes early and bring your identification."
                  : "Your exam slot will appear here after the review stage is completed."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-slate-800">
              <NotebookText className="size-4 text-emerald-600" />
              <p className="font-medium">What to prepare</p>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Bring your identification and any required documents.</li>
              <li>Arrive 15 minutes early for check-in.</li>
              <li>Follow the instructions sent to your profile email.</li>
            </ul>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <MapPin className="size-4 text-blue-600" />
                <span>Venue details will be confirmed after review.</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <Clock3 className="size-4 text-emerald-600" />
                <span>
                  Session time is shown once the committee schedules it.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
