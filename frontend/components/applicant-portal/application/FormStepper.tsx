"use client";

import { cn } from "@/lib/utils";
import {
  Check,
  User,
  GraduationCap,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";

const STEPS = [
  { label: "Basic Info", icon: User },
  { label: "Academic Details", icon: GraduationCap },
  { label: "Parent Details", icon: Users },
  { label: "Scholarship", icon: DollarSign },
  { label: "Review & Submit", icon: FileText },
];

interface FormStepperProps {
  currentStep: number;
}

export default function FormStepper({ currentStep }: FormStepperProps) {
  return (
    <div className="w-full">
      {/* Circles and Lines Row */}
      <div className="relative flex items-center justify-between px-4">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          const Icon = step.icon;

          return (
            <div
              key={stepNumber}
              className="relative flex flex-col items-center justify-center flex-1"
            >
              {/* Connecting Line (drawn from the center of this circle to the next) */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-1/2 left-[50%] right-[-50%] h-[2px] bg-white/10 -translate-y-1/2 -z-10">
                  {/* Green fill for completed steps */}
                  <div
                    className={cn(
                      "h-full bg-emerald-500 transition-all duration-300",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                  {/* Yellow fill for active step's connecting segment */}
                  {isActive && (
                    <div className="absolute inset-y-0 left-0 bg-amber-500 w-1/2 transition-all duration-300" />
                  )}
                </div>
              )}

              {/* Step Circle */}
              <div
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10",
                  isCompleted
                    ? "border-emerald-400 bg-emerald-500 text-white shadow-sm"
                    : isActive
                    ? "border-amber-400 bg-amber-500 text-white shadow-sm"
                    : "border-white/20 bg-[#121c47] text-white/50"
                )}
              >
                <Icon className="size-5" />

                {/* Status Badge */}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border border-white bg-emerald-500 text-white shadow-xs">
                    <Check className="size-2.5" strokeWidth={3} />
                  </div>
                )}

                {isActive && (
                  <div className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border border-white bg-amber-500 text-white shadow-xs">
                    <Check className="size-2.5" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels Row */}
      <div className="flex justify-between mt-3 px-4">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={index} className="flex-1 flex justify-center text-center">
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wider uppercase text-center max-w-[80px] sm:max-w-[100px] leading-tight transition-colors hidden sm:block",
                  isCompleted
                    ? "text-emerald-400"
                    : isActive
                    ? "text-amber-400 font-bold"
                    : "text-white/40"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile-only current step label */}
      <div className="mt-5 text-center text-xs font-semibold tracking-wide text-blue-200 lg:hidden">
        Step {currentStep} of 5: <span className="text-white font-bold">{STEPS[currentStep - 1]?.label}</span>
      </div>
    </div>
  );
}
