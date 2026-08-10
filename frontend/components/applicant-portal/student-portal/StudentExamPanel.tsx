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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Schedule
          </h1>
          <p className="mt-1 text-gray-600">
            Review your confirmed exam and interview sessions below.
          </p>
        </header>

        {/* Info Banner */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">
              Remember your Student ID
            </p>
            <p className="mt-0.5 text-sm text-amber-800">
              Please present your registration confirmation and a valid ID at each session.
            </p>
          </div>
        </div>

        {/* Session Cards */}
        <div className="space-y-4">
          {MOCK_SESSIONS.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <Icon className="size-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Title & Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.title}
                      </h3>
                      {session.confirmed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          <CheckCircle2 className="size-3" />
                          Confirmed
                        </span>
                      )}
                    </div>
                    
                    <p className="mt-0.5 text-xs text-gray-500">
                      ID: {session.id}
                    </p>
                    
                    {/* Details */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-gray-400" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-4 text-gray-400" />
                        {session.time} · {session.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-gray-400" />
                        {session.location}
                      </span>
                    </div>

                    {/* Note */}
                    {session.note && (
                      <p className="mt-3 text-sm text-gray-600 italic">
                        {session.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}