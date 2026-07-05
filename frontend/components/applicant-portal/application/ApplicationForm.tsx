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

  useEffect(() => {
    const saved = loadStudentPortalSnapshot();
    if (saved.applicationData) {
      setFormData(saved.applicationData);
      setCurrentStep(saved.currentStep);
    }
  }, []);

  const persistForm = (nextData: ApplicationFormData, nextStep: number) => {
    setFormData(nextData);
    saveStudentPortalSnapshot({
      applicationData: nextData,
      currentStep: nextStep,
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
    setCurrentStep(safeStep);
    persistForm(activeData, safeStep);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => goToStep(currentStep + 1);
  const goBack = () => goToStep(currentStep - 1);

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const nextSnapshot = saveStudentPortalSnapshot({
      applicationData: formData,
      currentStep: 5,
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
    setFormData(nextSnapshot.applicationData ?? formData);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Brand Blue Registration Header Card */}
      <div className="rounded-t-3xl bg-gradient-to-br from-[#1e2d6b] to-[#141f4d] px-6 py-8 sm:px-8 sm:py-10 text-white relative overflow-hidden shadow-md border border-[#1e2d6b]">

        <div className="relative z-10">
          <div className="text-xs font-semibold tracking-[0.2em] text-blue-200 uppercase">
            Registration Process
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            New Candidate Registration
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-200/80 max-w-2xl leading-relaxed">
            Welcome to the CamTech admissions portal. Complete the form below to enter the evaluation pool for academic funding.
          </p>

          <div className="my-6 border-t border-white/10" />

          {/* Step Indicator */}
          <FormStepper currentStep={currentStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-b-3xl border border-t-0 border-slate-200 bg-white shadow-md overflow-hidden">
        {currentStep === 1 && (
          <>
            {/* Instructions */}
            <div className="border-b border-slate-100 bg-blue-50/30 px-5 py-4">
              <div className="border-l-4 border-[#1e2d6b] pl-4 space-y-2">
                <p className="font-semibold text-sm text-slate-800">
                  Application Instruction
                </p>
                <p className="text-sm text-slate-600">
                  Welcome to CamTech University&apos;s online application! Before
                  submitting your application, you must complete all the required
                  information accurately, and upload the following required documents:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  <li>
                    One of these documents: Birth Certificate / National ID Card /
                    Passport (PDF/JPG)
                  </li>
                  <li>
                    High school certificate or any equivalent document (High School
                    graduate) or grade 12 student ID card
                  </li>
                </ul>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Note: </span>
                  If there is incomplete information, the application will be
                  rejected. For more details, please contact: 078/ 086 21 21 81.
                </p>
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
