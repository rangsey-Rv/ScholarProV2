export interface Applicant {
  id: string;
  number?: string;
  personalInfo: {
    fullNameEnglish: string;
    fullNameKhmer?: string;
    gender: string;
    nationality: string;
    dateOfBirth: string;
    placeOfBirth?: string;
    address?: string;
    phoneNumber: string;
    email: string;
    idDocument?: {
      type: string;
      url: string;
    };
  };
  parentGuardianInfo?: {
    name?: string;
    nationality?: string;
    relationship?: string;
    occupation?: string;
    phoneNumber?: string;
    address?: string;
  };
  educationBackground: {
    highSchool: {
      schoolName?: string;
      location?: string;
      academicYear?: string;
      overallGrade?: string;
      mathGrade?: string;
      englishGrade?: string;
      certificateUrl?: string;
    };
    currentEducation?: {
      institutionName?: string;
      major?: string;
      currentYear?: string;
    };
    englishProficiency?: {
      hasCertificate?: string;
      certificateUrl?: string;
    };
  };
  appliedProgram: {
    programName?: string;
    isApplyingScholarship?: boolean;
    requestedTerm?: string;
    considerNextIntake?: boolean;
    referralSource?: string;
  };
  documents?: {
    personalIdDocument?: { type: string; url: string };
    highSchoolCertificate?: { type: string; url: string };
    englishCertificate?: { type: string; url: string };
    paymentReceipt?: { type: string; url: string };
  };
  [key: string]: unknown;
}

export interface StudentDisplay {
  id: string;
  number: string;
  name: string;
  nameKh: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  guardianName: string;
  relationship: string;
  guardianNationality: string;
  guardianOccupation: string;
  guardianPhone: string;
  guardianAddress: string;
  educationLevel: string;
  institutionName: string;
  currentYear: string;
  academicYear: string;
  highSchool: string;
  highSchoolLocation: string;
  highSchoolYear: string;
  overallGrade: string;
  mathGrade: string;
  englishGrade: string;
  university: string;
  major: string;
  universityYear: string;
  hasEnglishCertificate: string;
  englishCertificateUrl: string;
  ielts: string;
  toefl: string;
  baci: string;
  program: string;
  scholarship: string;
  requestedTerm: string;
  considerNextIntake: string;
  source: string;
  status: string;
  batch: string;
  submittedDate: string;
  batchId: string;
  personalIdDocument: string;
  highSchoolCertificate: string;
  paymentReceipt: string;
  englishCertificate: string;
  url: string;
  //  documents : {
  //           personalIdDocument: {
  //               type: string,
  //               url: string
  //           },
  //           highSchoolCertificate: {
  //               type: string,
  //               url: string
  //           },
  //           englishCertificate: {
  //               type: string,
  //               url: string
  //           },
  //           paymentReceipt: {
  //               type: string,
  //               url: string
  //           }
  //       }
}
