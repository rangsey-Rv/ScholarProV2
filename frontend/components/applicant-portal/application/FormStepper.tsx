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
  completedSteps?: number[];
}

export default function FormStepper({
  currentStep,
  completedSteps = [],
}: FormStepperProps) {
  return (
    <div className="w-full overflow-x-auto py-6 px-4">
      <div className="flex items-center justify-center min-w-[320px]">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isActive = currentStep === stepNumber;
          const showConnectorAsComplete =
            completedSteps.includes(stepNumber) || stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 sm:size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : isActive
                        ? "border-white bg-white text-[#1e2d6b] shadow-lg shadow-white/25 scale-110"
                        : "border-amber-400/70 bg-amber-400/20 text-amber-200"
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
                    "hidden sm:block text-[11px] font-medium text-center w-20 leading-tight transition-colors duration-300",
                    isActive
                      ? "text-white font-bold"
                      : isCompleted
                        ? "text-emerald-300"
                        : "text-amber-200/80"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className="relative -mt-5 h-0.5 w-8 sm:w-14 md:w-20 mx-1.5">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full" />
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-500",
                      showConnectorAsComplete || isCompleted ? "bg-emerald-500 w-full" : "w-0"
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