"use client";

import { BookOpenCheck, Download, GraduationCap, Sparkles } from "lucide-react";

const terms = [
  {
    name: "Term 1",
    gpa: "3.8",
    courses: [
      { name: "English", credit: 3, grade: "A" },
      { name: "Math", credit: 3, grade: "B+" },
      { name: "Science", credit: 3, grade: "A-" },
    ],
  },
  {
    name: "Term 2",
    gpa: "3.6",
    courses: [
      { name: "History", credit: 2, grade: "A" },
      { name: "Computer", credit: 3, grade: "B" },
      { name: "Art", credit: 1, grade: "A-" },
    ],
  },
];

export default function StudentResultUI() {
  const totalCredits = terms.reduce(
    (sum, term) =>
      sum + term.courses.reduce((count, course) => count + course.credit, 0),
    0,
  );

  const exportResult = () => {
    const rows = [
      ["Term", "Course", "Credit", "Result"],
      ...terms.flatMap((term) =>
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
    link.download = "student-result.csv";
    link.click();
    globalThis.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Result
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Your result is ready to view
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review your academic performance and keep your scholarship records
              organized in one place.
            </p>
          </div>
          <button
            onClick={exportResult}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Download className="size-4" />
            Export Result
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {terms.map((term) => (
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

          <div className="space-y-4">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles className="size-4" />
                <p className="text-sm font-semibold">Result Summary</p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl border border-white bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Total Credits
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {totalCredits}
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    GPA
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    3.7 / 4.0
                  </p>
                </div>
                <div className="rounded-2xl border border-white bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Good standing
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-slate-800">
                <GraduationCap className="size-4 text-emerald-600" />
                <p className="font-medium">Next Step</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Keep this view handy for future academic reviews and student
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
