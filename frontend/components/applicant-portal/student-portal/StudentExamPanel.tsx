"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Star,
  type LucideIcon,
} from "lucide-react";
import {
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

type SessionType = "interview" | "exam";

interface Session {
  id: string;
  type: SessionType;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  note: string | null;
  confirmed: boolean;
}

const MOCK_SESSIONS: Session[] = [
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
  },
];

const TYPE_ICONS: Record<SessionType, LucideIcon> = {
  interview: Star,
  exam: ClipboardList,
};

/* Group sessions by date */
const SESSIONS_BY_DATE: { date: string; sessions: Session[] }[] = (() => {
  const groups: { date: string; sessions: Session[] }[] = [];
  for (const session of MOCK_SESSIONS) {
    const existing = groups.find((g) => g.date === session.date);
    if (existing) existing.sessions.push(session);
    else groups.push({ date: session.date, sessions: [session] });
  }
  return groups;
})();

/* -------------------------------- Components ------------------------------- */

function SessionRow({ session }: { session: Session }) {
  const Icon = TYPE_ICONS[session.type];

  return (
    <li className="grid grid-cols-[4.5rem_1fr_auto] gap-x-4 py-5 sm:gap-x-6">
      {/* Time */}
      <time className="text-sm font-medium tabular-nums text-neutral-900">
        {session.time}
      </time>

      {/* Details */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <h3 className="truncate text-sm font-medium text-neutral-900">
            {session.title}
          </h3>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {session.location} · {session.duration}
        </p>
        {session.note && (
          <p className="mt-0.5 text-sm text-neutral-500">{session.note}</p>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col items-end gap-1 self-start">
        {session.confirmed && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Confirmed
          </span>
        )}
        <span className="font-mono text-[11px] text-neutral-400">{session.id}</span>
      </div>
    </li>
  );
}

/* ----------------------------------- Page ---------------------------------- */

export default function StudentExamPanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  if (!snapshot) return null;

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <main className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Upcoming Schedule
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Your confirmed exam and interview sessions.
          </p>
        </header>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-amber-50 px-4 py-3">
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <p className="text-[13px] leading-relaxed text-amber-900">
            Please bring your registration confirmation and a valid student ID
            to each session.
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-10 space-y-10">
          {SESSIONS_BY_DATE.map((group) => (
            <section key={group.date}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {group.date}
              </h2>
              <ul className="mt-2 divide-y divide-neutral-100 border-y border-neutral-100">
                {group.sessions.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12">
          <p className="text-xs text-neutral-400">
            All times are local. To reschedule, contact the examination office
            at least 48 hours in advance.
          </p>
        </footer>
      </main>
    </div>
  );
}