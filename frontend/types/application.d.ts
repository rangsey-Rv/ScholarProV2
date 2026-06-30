export type EducationLevel =
  | "university"
  | "high_school_graduate"
  | "current_12th_grader";

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export interface PersonalInfoData {
  nameKhmer: string;
  nameEnglish: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  country: string;
  phoneNumber: string;
  email: string;
  identityDocument: File[];
}

export interface ParentsData {
  name: string;
  relationship: string;
  nationality: string;
  currentAddress: string;
  jobPosition: string;
  phoneNumber: string;
}

export interface UniversityInfo {
  currentMajor: string;
  institutionName: string;
  yearOfStudy: string;
}

export interface HighSchoolInfo {
  academicYear: string;
  schoolName: string;
  cityAndCountry: string;
  overallGrade: string;
  mathGrade: string;
  englishGrade: string;
}

export interface EducationData {
  currentEducationLevel: EducationLevel | "";
  university: UniversityInfo;
  highSchool: HighSchoolInfo;
  hasIeltsOrToefl: string;
  hsCertificate: File[];
  ieltsDocument: File[];
  grade12IdCard: File[];
}

export interface AppliedProgramData {
  interestedMajors: string[];
  applyingForScholarship: string;
  requestedAcademicTerm: string;
  considerNextIntake: string;
  howDidYouKnow: string[];
  dataConsent: string;
  declaration: boolean;
  paymentProof: File[];
}

export interface ApplicationFormData {
  personal: PersonalInfoData;
  parents: ParentsData;
  education: EducationData;
  program: AppliedProgramData;
}
