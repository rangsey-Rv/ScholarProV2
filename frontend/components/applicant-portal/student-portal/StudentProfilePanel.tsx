"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Mail, PencilLine, Phone, UserCircle2 } from "lucide-react";
import {
  loadStudentPortalSnapshot,
  saveStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

export default function StudentProfilePanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const data = loadStudentPortalSnapshot();
    setSnapshot(data);
    setFormData({
      name: data.profile.name,
      email: data.profile.email,
      phone: data.profile.phone,
      studentId: data.profile.studentId,
    });
  }, []);

  const handleSave = () => {
    const next = saveStudentPortalSnapshot({
      profile: {
        name: formData.name || "Applicant",
        email: formData.email || "applicant@example.com",
        phone: formData.phone || "—",
        studentId: formData.studentId || "APP-001",
      },
    });
    setSnapshot(next);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (snapshot) {
      setFormData({
        name: snapshot.profile.name,
        email: snapshot.profile.email,
        phone: snapshot.profile.phone,
        studentId: snapshot.profile.studentId,
      });
    }
    setIsEditing(false);
  };

  if (!snapshot) return null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Profile
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Keep your student profile up to date
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review your contact details and adjust your account information as
              your scholarship journey progresses.
            </p>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Active account
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
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
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Application status</p>
              <p className="mt-1">
                Your profile is connected to the review workflow and will stay
                in sync as your application advances.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Account details
                </p>
                <p className="text-sm text-slate-500">
                  Update the information below when needed
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <PencilLine className="size-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Full name</span>
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-blue-500 disabled:cursor-default disabled:opacity-80"
                />
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Email</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Mail className="size-4 text-blue-600" />
                  <input
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full bg-transparent outline-none disabled:cursor-default"
                  />
                </div>
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Phone</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Phone className="size-4 text-blue-600" />
                  <input
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full bg-transparent outline-none disabled:cursor-default"
                  />
                </div>
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Student ID</span>
                <input
                  value={formData.studentId}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      studentId: event.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-blue-500 disabled:cursor-default disabled:opacity-80"
                />
              </label>
            </div>

            {isEditing ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save changes
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Click edit to update your profile details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
