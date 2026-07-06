"use client";

import { useEffect, useState } from "react";
import FormStepper from "./FormStepper";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ParentsGuardiansStep from "./steps/ParentsGuardiansStep";
import EducationStep from "./steps/EducationStep";
import AppliedProgramStep from "./steps/AppliedProgramStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";
import type { ApplicationFormData } from "@/types/application";
import {
  loadStudentPortalSnapshot,
  saveStudentPortalSnapshot,
} from "@/lib/utils/student-portal";

const INITIAL_DATA: ApplicationFormData = {
  personal: {
    nameKhmer: "",
    nameEnglish: "",
    nationality: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    currentAddress: "",
    country: "",
    phoneNumber: "",
    email: "",
    identityDocument: [],
  },
  parents: {
    name: "",
    relationship: "",
    nationality: "",
    currentAddress: "",
    jobPosition: "",
    phoneNumber: "",
  },
  education: {
    currentEducationLevel: "",
    university: {
      currentMajor: "",
      institutionName: "",
      yearOfStudy: "",
    },
    highSchool: {
      academicYear: "",
      schoolName: "",
      cityAndCountry: "",
      overallGrade: "",
      mathGrade: "",
      englishGrade: "",
    },
    hasIeltsOrToefl: "",
    hsCertificate: [],
    ieltsDocument: [],
    grade12IdCard: [],
  },
  program: {
    interestedMajors: [],
    applyingForScholarship: "",
    requestedAcademicTerm: "",
    considerNextIntake: "",
    howDidYouKnow: [],
    dataConsent: "",
    declaration: false,
    paymentProof: [],
  },
};

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_DATA);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const saved = loadStudentPortalSnapshot();
    if (saved.applicationData) {
      setFormData(saved.applicationData);
      setCurrentStep(saved.currentStep);
    }
    setCompletedSteps(saved.completedSteps ?? []);
  }, []);

  const persistForm = (
    nextData: ApplicationFormData,
    nextStep: number,
    nextCompletedSteps?: number[],
  ) => {
    const resolvedCompletedSteps = nextCompletedSteps ?? completedSteps;
    setFormData(nextData);
    setCompletedSteps(resolvedCompletedSteps);
    saveStudentPortalSnapshot({
      applicationData: nextData,
      currentStep: nextStep,
      completedSteps: resolvedCompletedSteps,
      profile: {
        name:
          nextData.personal.nameEnglish ||
          nextData.personal.nameKhmer ||
          "Applicant",
        email: nextData.personal.email || "applicant@example.com",
        phone: nextData.personal.phoneNumber || "—",
        studentId: "APP-001",
      },
    });
  };

  const goToStep = (nextStep: number, nextData?: ApplicationFormData) => {
    const activeData = nextData ?? formData;
    const safeStep = Math.min(Math.max(nextStep, 1), 5);
    const nextCompletedSteps =
      safeStep > currentStep
        ? Array.from(new Set([...completedSteps, currentStep]))
        : completedSteps;

    setCurrentStep(safeStep);
    persistForm(activeData, safeStep, nextCompletedSteps);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => goToStep(currentStep - 1);

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const nextCompletedSteps = Array.from(new Set([...completedSteps, 5]));
    const nextSnapshot = saveStudentPortalSnapshot({
      applicationData: formData,
      currentStep: 5,
      completedSteps: nextCompletedSteps,
      applicationStatus: "under_review",
      applicationId: `APP-${Date.now().toString().slice(-6)}`,
      submittedAt: new Date().toISOString(),
      examDate: "TBD",
      examTime: "TBD",
      examLocation: "TBD",
      enrollmentStatus:
        "Enrollment tracking will begin once the review is completed.",
      gradeSummary: "Grades will be available after the evaluation stage.",
      profile: {
        name:
          formData.personal.nameEnglish ||
          formData.personal.nameKhmer ||
          "Applicant",
        email: formData.personal.email || "applicant@example.com",
        phone: formData.personal.phoneNumber || "—",
        studentId: "APP-001",
      },
    });
    setCompletedSteps(nextCompletedSteps);
    setFormData(nextSnapshot.applicationData ?? formData);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      {/* Brand Blue Registration Header Card */}
      <div className="rounded-t-2xl bg-gradient-to-br from-[#1e2d6b] to-[#141f4d] px-6 py-8 sm:px-10 sm:py-10 text-white relative overflow-hidden shadow-lg">
        {/* Subtle background pattern for a premium feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-blue-300/80 uppercase">
            Registration Process
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            New Candidate Registration
          </h1>
          <p className="mt-3 text-sm text-blue-100/70 max-w-2xl leading-relaxed">
            Welcome to the CamTech admissions portal. Complete the form below to enter the evaluation pool for academic funding.
          </p>

          <div className="my-8 border-t border-white/10" />

          {/* Step Indicator - Using currentStep and completed progress to determine visual state */}
          <FormStepper currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-b-2xl bg-white shadow-lg border border-slate-200/60 border-t-0 overflow-hidden">
        {currentStep === 1 && (
          <>
            {/* Instructions */}
            <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-100 bg-slate-50/40">
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1e2d6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Application Instructions
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Please complete all required information accurately and upload the following documents:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-5">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>Birth Certificate, National ID Card, or Passport (PDF/JPG)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>High school certificate, equivalent document, or grade 12 student ID card</span>
                  </li>
                </ul>
                <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-3.5">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-semibold">Note:</span> Incomplete applications will be rejected. For assistance, contact 078 / 086 21 21 81.
                  </p>
                </div>
              </div>
            </div>

            <PersonalInfoStep
              defaultValues={formData.personal}
              onNext={(data) => {
                const next = { ...formData, personal: data };
                goToStep(2, next);
              }}
            />
          </>
        )}

        {currentStep === 2 && (
          <EducationStep
            defaultValues={formData.education}
            onNext={(data) => {
              const next = { ...formData, education: data };
              goToStep(3, next);
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <ParentsGuardiansStep
            defaultValues={formData.parents}
            onNext={(data) => {
              const next = { ...formData, parents: data };
              goToStep(4, next);
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <AppliedProgramStep
            defaultValues={formData.program}
            onNext={(data) => {
              const next = { ...formData, program: data };
              goToStep(5, next);
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 5 && (
          <ReviewSubmitStep
            formData={formData}
            onBack={goBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}