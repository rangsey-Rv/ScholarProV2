import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Personal Info", shortLabel: "1" },
  { label: "Parents/Guardians", shortLabel: "2" },
  { label: "Education", shortLabel: "3" },
  { label: "Applied Program", shortLabel: "4" },
  { label: "Review & Submit", shortLabel: "5" },
];

interface FormStepperProps {
  currentStep: number;
}

export default function FormStepper({ currentStep }: FormStepperProps) {
  return (
    <div className="w-full overflow-x-auto py-6 px-4">
      <div className="flex items-center justify-center min-w-[320px]">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 sm:size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                      : isActive
                        ? "border-[#1e2d6b] bg-[#1e2d6b] text-white shadow-md shadow-blue-900/25"
                        : "border-slate-300 bg-white text-slate-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 sm:size-5" strokeWidth={2.5} />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Full label - visible on sm+ */}
                <span
                  className={cn(
                    "hidden sm:block text-[11px] font-medium text-center w-20 leading-tight",
                    isActive
                      ? "text-[#1e2d6b]"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className="relative -mt-5 h-0.5 w-8 sm:w-14 md:w-20 mx-1.5">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-500",
                      isCompleted ? "bg-emerald-500 w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
