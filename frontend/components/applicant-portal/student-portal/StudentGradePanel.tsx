"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Download, GraduationCap } from "lucide-react";
import {
  loadStudentPortalSnapshot,
  type StudentPortalSnapshot,
} from "@/lib/utils/student-portal";

const sampleTerms = [
  {
    name: "Term 1",
    courses: [
      { name: "English", credit: 3, grade: "A" },
      { name: "Math", credit: 3, grade: "B+" },
      { name: "Science", credit: 3, grade: "A-" },
    ],
    gpa: "3.8",
  },
  {
    name: "Term 2",
    courses: [
      { name: "History", credit: 2, grade: "A" },
      { name: "Computer", credit: 3, grade: "B" },
      { name: "Art", credit: 1, grade: "A-" },
    ],
    gpa: "3.6",
  },
];

export default function StudentGradePanel() {
  const [snapshot, setSnapshot] = useState<StudentPortalSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(loadStudentPortalSnapshot());
  }, []);

  const totals = useMemo(() => {
    const totalCredits = sampleTerms.reduce(
      (sum, term) =>
        sum +
        term.courses.reduce(
          (courseSum, course) => courseSum + course.credit,
          0,
        ),
      0,
    );

    return { totalCredits };
  }, []);

  const exportGrades = () => {
    const rows = [
      ["Term", "Course", "Credit", "Result"],
      ...sampleTerms.flatMap((term) =>
        term.courses.map((course) => [
          term.name,
          course.name,
          course.credit,
          course.grade,
        ]),
      ),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = globalThis.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-results.csv";
    link.click();
    globalThis.URL.revokeObjectURL(url);
  };

  if (!snapshot) return null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Result
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Result report
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review your academic outcomes and keep track of your current
              standing.
            </p>
          </div>
          <button
            onClick={exportGrades}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Download className="size-4" />
            Export result
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {sampleTerms.map((term) => (
              <div
                key={term.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2 text-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="size-4 text-blue-600" />
                    <p className="font-medium">{term.name}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                    GPA {term.gpa}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {term.courses.map((course) => (
                    <div
                      key={course.name}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <span>{course.name}</span>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>{course.credit} credit</span>
                        <span className="font-semibold text-slate-900">
                          {course.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-800">
              <GraduationCap className="size-4 text-emerald-600" />
              <p className="font-medium">Summary</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Total credits
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {totals.totalCredits}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  GPA
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  3.7 / 4.0
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Status
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  Good Standing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
