import { z } from 'zod';
import { genderEnum } from '@db/schema/personal-info';
import { gradeEnum, educationLevelEnum, englishCertificateEnum } from '@db/schema/education-background';

// Personal Information Schema
export const personalInfoSchema = z.object({
  nameKh: z.string().min(1, 'Khmer name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  gender: z.enum(genderEnum.enumValues, {
    message: 'Gender must be male, female, or other'
  }),
  dateOfBirth: z.coerce.date({
    message: 'Valid date of birth is required'
  }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format'),
});

// Parent/Guardian Information Schema
export const parentGuardianInfoSchema = z.object({
  name: z.string().min(1, 'Guardian name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  nationality: z.string().min(1, 'Guardian nationality is required'),
  address: z.string().min(1, 'Guardian address is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  phoneNumber: z.string()
    .min(1, 'Guardian phone number is required')
    .regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number format'),
});

// Educational Background Schema
export const educationBackgroundSchema = z.object({
  currentEducationLevel: z.enum(['university', 'high_school_graduate', 'current_12th_grader'] as const, {
    message: 'Invalid education level'
  }),
  // University-specific fields (optional, required if currentEducationLevel is 'university')
  major: z.string().optional(),
  institutionName: z.string().optional(),
  yearOfStudy: z.number().int().min(1).max(10).optional(),
  
  // High school information (required for all)
  academicYear: z.string().min(1, 'Academic year is required'),
  highSchoolName: z.string().min(1, 'High school name is required'),
  schoolCity: z.string().min(1, 'School city is required'),
  schoolCountry: z.string().min(1, 'School country is required'),
  
  // Grades
  overallGrade: z.enum(gradeEnum.enumValues, {
    message: 'Overall grade must be A, B, C, D, E, or F'
  }),
  mathGrade: z.enum(gradeEnum.enumValues, {
    message: 'Math grade must be A, B, C, D, E, or F'
  }),
  englishGrade: z.enum(gradeEnum.enumValues, {
    message: 'English grade must be A, B, C, D, E, or F'
  }),
  
  // English proficiency
  hasEnglishCertificate: z.enum(englishCertificateEnum.enumValues, {
    message: 'English certificate status must be yes, no, or other'
  }),
}).refine((data) => {
  // If currentEducationLevel is 'university', require university fields
  if (data.currentEducationLevel === 'university') {
    return data.major && data.institutionName && data.yearOfStudy;
  }
  return true;
}, {
  message: 'Major, institution name, and year of study are required for university students',
  path: ['major'],
});

// Applied Program Schema
export const appliedProgramSchema = z.object({
  interestMajorId: z.number().int().positive('Interest major ID is required'),
  isApplyingScholarship: z.boolean(),
  requestedTerm: z.coerce.date().optional(),
  considerNextIntake: z.boolean().optional(),
  referralSource: z.string().optional(),
});

// Application Schema
export const applicationSchema = z.object({
  batchId: z.number().int().positive('Batch ID is required'),
  isApplyForScholarShip: z.boolean().default(false),
  scholarshipPercentage: z.number().min(0).max(100).optional(),
});

// Complete Student Registration Schema
export const studentRegistrationSchema = z.object({
  // Student basic info (from students table)
  student: z.object({
    nameEn: z.string().min(1, 'English name is required'),
    nameKh: z.string().min(1, 'Khmer name is required'),
    email: z.string().email('Invalid email format'),
    phoneNumber: z.string()
      .min(1, 'Phone number is required')
      .regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number format'),
    dateOfBirth: z.coerce.date({
      message: 'Valid date of birth is required'
    }),
  }),
  
  // Personal information
  personalInfo: personalInfoSchema,
  
  // Parent/Guardian information
  parentGuardianInfo: parentGuardianInfoSchema,
  
  // Educational background
  educationBackground: educationBackgroundSchema,
  
  // Applied program
  appliedProgram: appliedProgramSchema,
  
  // Application details
  application: applicationSchema,
});

// Type exports for TypeScript
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ParentGuardianInfoInput = z.infer<typeof parentGuardianInfoSchema>;
export type EducationBackgroundInput = z.infer<typeof educationBackgroundSchema>;
export type AppliedProgramInput = z.infer<typeof appliedProgramSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;
