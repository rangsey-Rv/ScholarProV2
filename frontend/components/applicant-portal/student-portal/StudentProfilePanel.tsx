"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, UserCircle2, BadgeCheck } from "lucide-react";
import {
  loadStudentPortalSnapshot,
  saveStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

export default function StudentProfilePanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    const data = loadStudentPortalSnapshot();
    setSnapshot(data);
  }, []);

  const handleSave = () => {
    const next = saveStudentPortalSnapshot({
      profile: {
        name: snapshot?.profile.name ?? "Applicant",
        email: snapshot?.profile.email ?? "applicant@example.com",
        phone: snapshot?.profile.phone ?? "—",
        studentId: snapshot?.profile.studentId ?? "APP-001",
      },
    });
    setSnapshot(next);
  };

  if (!snapshot) return null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Profile
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Your account overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Keep your personal and contact information up to date while the
              committee reviews your application.
            </p>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Active account
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserCircle2 className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              {snapshot.profile.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Applicant ID: {snapshot.profile.studentId}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              <BadgeCheck className="size-4" />
              Verified profile
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <Mail className="size-4 text-blue-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {snapshot.profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <Phone className="size-4 text-blue-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {snapshot.profile.phone}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-800">Application status</p>
              <p className="mt-2">
                Your profile stays connected to the committee review workflow
                and will be updated as your status changes.
              </p>
            </div>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sync profile snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
