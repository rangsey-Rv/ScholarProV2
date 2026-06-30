import { z } from "zod";
import { sanitizeText } from "@/lib/utils/sanitize";

export const personalInfoSchema = z.object({
  nameKhmer: z.string().trim().transform(sanitizeText),
  nameEnglish: z
    .string()
    .min(1, "Full name in English is required")
    .trim()
    .transform(sanitizeText),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .trim()
    .transform(sanitizeText),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z
    .string()
    .min(1, "Place of birth is required")
    .trim()
    .transform(sanitizeText),
  currentAddress: z
    .string()
    .min(1, "Current address is required")
    .trim()
    .transform(sanitizeText),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .trim()
    .transform(sanitizeText),
  email: z.string().email("Please enter a valid email address").trim(),
});

export const parentsSchema = z.object({
  name: z
    .string()
    .min(1, "Parent/Guardian's name is required")
    .trim()
    .transform(sanitizeText),
  relationship: z.string().min(1, "Relationship is required"),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .trim()
    .transform(sanitizeText),
  currentAddress: z
    .string()
    .min(1, "Current address is required")
    .trim()
    .transform(sanitizeText),
  jobPosition: z
    .string()
    .min(1, "Job position is required")
    .trim()
    .transform(sanitizeText),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .trim()
    .transform(sanitizeText),
});

export const educationSchema = z
  .object({
    currentEducationLevel: z.enum(
      ["university", "high_school_graduate", "current_12th_grader"] as const,
      { error: "Please select your current education level" },
    ),
    universityCurrentMajor: z.string().trim(),
    universityInstitutionName: z.string().trim(),
    universityYearOfStudy: z.string().trim(),
    highSchoolAcademicYear: z.string().trim(),
    highSchoolName: z.string().trim(),
    highSchoolCity: z.string().trim(),
    highSchoolOverallGrade: z.string(),
    highSchoolMathGrade: z.string(),
    highSchoolEnglishGrade: z.string(),
    hasIeltsOrToefl: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.currentEducationLevel === "university") {
      if (!data.universityCurrentMajor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["universityCurrentMajor"],
          message: "Current major is required",
        });
      }
      if (!data.highSchoolAcademicYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolAcademicYear"],
          message: "Academic year is required",
        });
      }
      if (!data.highSchoolName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolName"],
          message: "School name is required",
        });
      }
      if (!data.highSchoolOverallGrade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolOverallGrade"],
          message: "Overall grade is required",
        });
      }
      if (!data.highSchoolMathGrade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolMathGrade"],
          message: "Math grade is required",
        });
      }
    }
    if (
      data.currentEducationLevel === "high_school_graduate" ||
      data.currentEducationLevel === "current_12th_grader"
    ) {
      if (!data.highSchoolAcademicYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolAcademicYear"],
          message: "Academic year is required",
        });
      }
      if (!data.highSchoolName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolName"],
          message: "School name is required",
        });
      }
      if (!data.highSchoolOverallGrade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolOverallGrade"],
          message: "Overall grade is required",
        });
      }
    }
  });

export const appliedProgramSchema = z.object({
  interestedMajors: z
    .array(z.string())
    .min(1, "Please select at least one major"),
  applyingForScholarship: z
    .string()
    .min(1, "Please indicate if you are applying for a scholarship"),
  requestedAcademicTerm: z.string().min(1, "Please select an academic term"),
  considerNextIntake: z.string().min(1, "Please indicate your preference"),
  howDidYouKnow: z
    .array(z.string())
    .min(1, "Please select at least one option"),
  dataConsent: z.string().min(1, "Please provide your consent decision"),
  declaration: z
    .boolean()
    .refine((v) => v === true, "You must agree to the declaration"),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type ParentsValues = z.infer<typeof parentsSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type AppliedProgramValues = z.infer<typeof appliedProgramSchema>;
