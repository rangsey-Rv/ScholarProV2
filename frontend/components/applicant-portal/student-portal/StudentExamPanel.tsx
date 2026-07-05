"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Star,
  ClipboardList,
} from "lucide-react";
import {
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

// Mock sessions — replace with real data once API is ready
const MOCK_SESSIONS = [
  {
    id: "INT-001",
    type: "interview",
    title: "Interview",
    date: "Monday, August 4, 2025",
    time: "09:30 AM",
    duration: "30 min",
    location: "Room 204, Admin Building",
    note: "Interviewer: Dr. Sopha Meng",
    confirmed: true,
    icon: Star,
  },
  {
    id: "EXM-002",
    type: "exam",
    title: "Mathematics Exam",
    date: "Thursday, August 7, 2025",
    time: "08:00 AM",
    duration: "2 hours",
    location: "Exam Hall A, Block C",
    note: null,
    confirmed: true,
    icon: ClipboardList,
  },
  {
    id: "EXM-003",
    type: "exam",
    title: "English Exam",
    date: "Thursday, August 7, 2025",
    time: "01:00 PM",
    duration: "1.5 hours",
    location: "Exam Hall A, Block C",
    note: null,
    confirmed: true,
    icon: ClipboardList,
  },
];

export default function StudentExamPanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  if (!snapshot) return null;

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-amber-500 uppercase">
            Your Schedule
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Exam &amp; Interview Schedule
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            All sessions are confirmed. Arrive 15 minutes early.
          </p>
        </div>

        {/* Student ID Warning Banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-700">
              Bring your Student ID
            </p>
            <p className="mt-0.5 text-sm text-amber-600">
              You must present your registration confirmation and a valid ID
              at each session.
            </p>
          </div>
        </div>

        {/* Session Cards */}
        {MOCK_SESSIONS.map((session) => {
          const Icon = session.icon;
          return (
            <div
              key={session.id}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {session.id}
                    </p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      {session.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-slate-400" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-slate-400" />
                        {session.time} · {session.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-slate-400" />
                        {session.location}
                      </span>
                    </div>
                    {session.note && (
                      <p className="mt-1.5 text-xs text-slate-400 italic">
                        {session.note}
                      </p>
                    )}
                  </div>
                </div>

                {session.confirmed && (
                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <CheckCircle2 className="size-4" />
                    Confirmed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
