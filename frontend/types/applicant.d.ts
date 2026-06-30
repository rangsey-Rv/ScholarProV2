export interface Applicant {
  id: string;
  number: string;
  nameEn: string;
  gender: Gender;
  major: string;
  province: string;
  email: string;
  dateApplied: Date;
  status: StudentStatus;
  batch?: string; // Batch identifier (e.g., "2025-Fall Intake")
  phone?: string;
  address?: string;
  gpa?: number;
  university?: string;
  graduationYear?: number;
  documents?: string[];
  interviewDate?: Date;
  examScore?: number;
  awardAmount?: number; // Legacy field - deprecated
  scholarshipPercentage?: number; // 25, 50, 75, 100 - primary field for scholarship filtering
  rejectionReason?: string;
  // Exam scores
  mathScore?: number;
  englishScore?: number;
  // Interview Evaluation Scores (max 20 each)
  evaluation?: {
    attitudeAndLeadership?: number; // 0-20
    academicPreparation?: number; // 0-20
    programFit?: number; // 0-20
    motivationAndInterests?: number; // 0-20
    communicationSkills?: number; // 0-20
    totalScore?: number; // Auto-calculated sum
    evaluatedBy?: string; // Committee member ID/name
    evaluatedAt?: Date;
    comments?: string;
  };
}
