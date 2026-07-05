"use client";

import { useEffect, useState } from "react";
import StudentPortalDashboard from "@/components/applicant-portal/student-portal/StudentPortalDashboard";
import ApplicationForm from "@/components/applicant-portal/application/ApplicationForm";
import {
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

export default function ApplicantApplicationPage() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    const updateSnapshot = () => {
      setSnapshot(loadStudentPortalSnapshot());
    };
    updateSnapshot();

    window.addEventListener("storage", updateSnapshot);
    return () => window.removeEventListener("storage", updateSnapshot);
  }, []);

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-slate-500">Loading your application...</p>
        </div>
      </div>
    );
  }

  const isSubmitted =
    snapshot.applicationStatus !== "new" &&
    snapshot.applicationStatus !== "draft";

  if (isSubmitted) {
    return <StudentPortalDashboard />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <ApplicationForm />
    </div>
  );
}
