"use client";

import { Trophy, CheckCircle2, Download, Award, TrendingUp } from "lucide-react";

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
  if (grade.startsWith("A"))
    return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10";
  if (grade.startsWith("B"))
    return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10";
  return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10";
}

export default function StudentResultUI() {
  const handleDownload = () => {
    alert("Downloading award letter…");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Page Header */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#1e2d6b]">
            <Award className="size-5" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Academic Rewards
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Scholarship Results
          </h1>
          <p className="text-slate-500">Announced on {ANNOUNCED_DATE}</p>
        </header>

        {/* Overall Result Banner (Refined) */}
        <div 
          className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl"
          style={{ 
            background: 'linear-gradient(135deg, #1e2d6b 0%, #2d4a9e 100%)',
            boxShadow: '0 20px 40px -10px rgba(30, 45, 107, 0.3)'
          }}
        >
          {/* Subtle decorative background shapes */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Elegant Trophy Icon */}
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Trophy className="h-8 w-8 text-amber-300" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Banner Content */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Overall Result
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {OVERALL_PASSED ? "Congratulations!" : "Result: Not Passed"}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-blue-100 max-w-xl">
                You have successfully passed the evaluation and have been awarded a{" "}
                <span className="font-semibold text-white">Full Scholarship</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          
          {/* Score Breakdown */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="size-5 text-[#1e2d6b]" />
                Score Breakdown
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {SCORES.length} Subjects
              </span>
            </div>
            
            <div className="space-y-6">
              {SCORES.map((item) => (
                <div key={item.subject} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.subject}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-500 tabular-nums">
                        {item.score}
                        <span className="text-slate-300">/{item.total}</span>
                      </span>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide ${gradeColor(
                          item.grade
                        )}`}
                      >
                        {item.grade}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${(item.score / item.total) * 100}%`,
                        backgroundColor: '#1e2d6b'
                      }}
                    />
                  </div>
                  
                  <div className="mt-1.5 flex justify-between text-xs text-slate-400">
                    <span>Pass mark: {item.passMark}</span>
                    <span>{Math.round((item.score / item.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Award */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Award className="size-5 text-[#1e2d6b]" />
              Award Details
            </h2>

            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">Type</span>
                <span className="text-sm font-bold text-slate-900">
                  {SCHOLARSHIP_AWARD.type}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">Duration</span>
                <span className="text-sm font-bold text-slate-900">
                  {SCHOLARSHIP_AWARD.duration}
                </span>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Coverage includes:
                </p>
                <ul className="space-y-2.5">
                  {SCHOLARSHIP_AWARD.coverage.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <div 
                        className="flex size-5 items-center justify-center rounded-full bg-[#1e2d6b]/10"
                      >
                        <CheckCircle2 
                          className="size-3.5 text-[#1e2d6b]" 
                        />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
              style={{ 
                backgroundColor: '#1e2d6b',
                boxShadow: '0 10px 25px -5px rgba(30, 45, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#162147';
                e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(30, 45, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e2d6b';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(30, 45, 107, 0.3)';
              }}
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