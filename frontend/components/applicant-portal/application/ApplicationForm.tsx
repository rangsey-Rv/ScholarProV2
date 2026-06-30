"use client";

import { useState } from "react";
import FormStepper from "./FormStepper";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ParentsGuardiansStep from "./steps/ParentsGuardiansStep";
import EducationStep from "./steps/EducationStep";
import AppliedProgramStep from "./steps/AppliedProgramStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";
import type { ApplicationFormData } from "@/types/application";

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

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    // TODO: Replace with actual API call
    // await applicationService.submit(formData)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Application submitted:", formData);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Application Banner */}
      <div className="rounded-t-2xl bg-[#1e2d6b] px-6 py-8 text-center text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">CamTech</h1>
        <p className="mt-1 text-xs tracking-[0.2em] text-blue-200 uppercase">
          Knowledge, Reason, Character
        </p>
      </div>

      {/* Application Title */}
      <div className="border-x border-slate-200 bg-white px-6 py-6 text-center">
        <h2 className="text-lg font-bold text-[#1e2d6b] sm:text-xl">
          Cambodia University of Technology and Science
          <br />
          Bachelor&apos;s Degree Application Form
        </h2>
      </div>

      {/* Instructions */}
      <div className="border border-slate-200 bg-blue-50/50 px-5 py-4 mx-0">
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

      {/* Step Indicator */}
      <div className="border-x border-slate-200 bg-white">
        <FormStepper currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-sm overflow-hidden">
        {currentStep === 1 && (
          <PersonalInfoStep
            defaultValues={formData.personal}
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, personal: data }));
              goNext();
            }}
          />
        )}

        {currentStep === 2 && (
          <ParentsGuardiansStep
            defaultValues={formData.parents}
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, parents: data }));
              goNext();
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <EducationStep
            defaultValues={formData.education}
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, education: data }));
              goNext();
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <AppliedProgramStep
            defaultValues={formData.program}
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, program: data }));
              goNext();
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
