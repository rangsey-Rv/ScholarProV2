"use client";

import { Trophy, CheckCircle2, Download } from "lucide-react";

// Score breakdown data — replace with real API data
const SCORES = [
  { subject: "Mathematics", score: 82, total: 100, grade: "B+", passMark: 60 },
  { subject: "English", score: 91, total: 100, grade: "A", passMark: 60 },
  { subject: "Interview", score: 88, total: 100, grade: "A-", passMark: 60 },
];

const SCHOLARSHIP_AWARD = {
  type: "Full Scholarship",
  duration: "4 Years",
  coverage: ["Tuition (100%)", "Monthly Stipend $150", "Study Materials"],
};

const ANNOUNCED_DATE = "August 25, 2025";
const OVERALL_PASSED = true;

function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

function ScoreBar({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-[#1a2d6b] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function StudentResultUI() {
  const handleDownload = () => {
    alert("Downloading award letter…");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            Result Announcement
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Scholarship Results
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Announced on {ANNOUNCED_DATE}
          </p>
        </div>

        {/* Overall Result Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a2d6b] px-6 py-7 text-white">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-10 -right-4 size-32 rounded-full bg-white/5" />

          <div className="relative flex items-center gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg">
              <Trophy className="size-7" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                Overall Result
              </p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl">
                {OVERALL_PASSED
                  ? "Congratulations! You Passed"
                  : "Result: Not Passed"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                You have been awarded a Full Scholarship
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Score Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">
              Score Breakdown
            </h2>
            <div className="mt-5 space-y-5">
              {SCORES.map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {item.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        {item.score}/{item.total}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold ${gradeColor(item.grade)}`}
                      >
                        {item.grade}
                      </span>
                    </div>
                  </div>
                  <ScoreBar score={item.score} total={item.total} />
                  <p className="mt-1 text-xs text-slate-400">
                    Pass mark: {item.passMark}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Award */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">
              Scholarship Award
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Type</span>
                <span className="font-bold text-slate-900">
                  {SCHOLARSHIP_AWARD.type}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Duration</span>
                <span className="font-bold text-slate-900">
                  {SCHOLARSHIP_AWARD.duration}
                </span>
              </div>
              <div className="pt-1">
                <p className="text-slate-500">Coverage includes:</p>
                <ul className="mt-3 space-y-2">
                  {SCHOLARSHIP_AWARD.coverage.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="size-4" />
              Download Award Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
