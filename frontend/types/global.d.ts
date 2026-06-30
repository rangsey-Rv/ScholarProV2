type User = {
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: string;
  lastLogin: string;
};

type StudentApplication = {
  id: string;
  nameEn: string;
  nameKh: string;
  email: string;
  gender: string;
  status: "new" | "shortlisted" | "exams" | "awarded" | "rejected";
  appliedDate: string;
  major: string;
  province: string;
};
type shortlistedApplication = {
  id: string;
  nameEn: string;
  nameKh: string;
  email: string;
  gender: string;
  status: "shortlisted";
  examAttending: "confirmed" | "not attending" | "pending";
  major: string;
  province: string;
};
type EducationLevel = "highschool" | "current12thGrade" | "university";

type UniversityDetail = {
  currentMajor: string;
  institutionName: string;
  currentYearOfStudy: string;
  academicYear: string;
  schoolName: string;
  cityCountrySchoolLocated: string;
  overallGrade: string;
  mathGrade: string;
  englishGrade: string;
  schoolCertificateUpload: string;
  ielts: string;
  ieltsUpload: string;
};

type HighschoolDetail = {
  academicYear: string;
  schoolName: string;
  cityCountrySchoolLocated: string;
  overallGrade: string;
  mathGrade: string;
  englishGrade: string;
  schoolCertificateUpload: string;
  ielts: string;
  ieltsUpload: string;
};

type Current12thGradeDetail = {
  highSchoolName: string;
  province: string;
  studentIdCardUpload: string;
  ielts: string;
  ieltsUpload: string;
};

type studentApplicationDetail = {
  //personal information
  id: string;
  nameEn: string;
  nameKh: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  country: string;
  phoneNumber: string;
  email: string;
  personalInformationUpload: string;
  //parent information
  parentName: string;
  relationshipToYou: string;
  parentNationality: string;
  parentCurrentAddress: string;
  parentPhoneNumber: string;
  jobPosition: string;
  //education dynamic details
  educationLevel: EducationLevel;
  university?: UniversityDetail;
  highschool?: HighschoolDetail;
  current12thGrade?: Current12thGradeDetail;
  // Application information
  majorsApplied: string;
  applyForScholarship: boolean;
  requestAcademicTerm: string;
  nextIntake: boolean;
  knowAboutUs: string;
  confirmation: boolean;
  declaration: string;
  uploadsPaymentReceipt: string;
};
