"use client";

import { useEffect, useState } from "react";
import StudentResultUI from "@/components/applicant-portal/student-portal/StudentResultUI";
import {
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

export default function StudentGradePanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  if (!snapshot) return null;

  return <StudentResultUI />;
}
