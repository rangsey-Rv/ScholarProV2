type Admin = {
  id: string;
  full_name: string;
  status: "Active" | "Inactive";
  email: string;
  last_login: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  isActive?: boolean;
  admin: {
    id: number;
    name: string;
  };
};

type BatchData = {
  id: string;
  batchName: string;
  startDate: string;
  endDate: string;
  description: string;
  status: "Active" | "Inactive";
};

type PaginationProps = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

type Commitee = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  email: string;
  last_login: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  isActive: boolen;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    isActive: boolean;
  };
};

type ApiApplicant = {
  scholarshipPercentage?: number;
  batch: string;
  batchId: string | null;
  batchName: string;
  subjects: [
    {
      subjectId: number;
      subjectName: string;
      totalScore: number;
      weight: number;
    },
  ];
  totalApplicationScore?: number;
  rank: number;

  applicationId?: string | number;
  id?: string | number;
  number?: string;
  nameEn?: string;
  name?: string;
  full_name?: string;
  phoneNumber?: string;
  major?: string;
  province?: string;
  overalGrade?: string;
  termRequested?: string;
  gender?: string;
  email?: string;
  major?: string;
  program?: string;
  placeOfBirth?: string;
  province?: string;
  dateApplied?: string;
  createdAt?: string;
  date?: string;
  status?: string;
  applicationStatus?: string;
  awardAmount?: number;
  overAllGrade?: string;
  requestTerm?: string;
  [key: string]: unknown;
};

type Evaluation = {
  totalScore?: number;
  [key: string]: unknown;
};

type Applicant = {
  personalInfo: {
    fullNameEnglish: string;
    fullNameKhmer: string;
    nationality: string;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    address: string;
    phoneNumber: string;

    email: string;
    idDocument: {
      type: string;
      url: string;
    };
  };
  parentGuardianInfo: {
    name: string;
    nationality: string;
    relationship: string;
    occupation: string;
    phoneNumber: string;
    address: string;
  };

  educationBackground: {
    highSchool: {
      schoolName: string;
      location: string;
      academicYear: string;
      overallGrade: string;
      mathGrade: string;
      englishGrade: string;
      certificateUrl: string;
    };
    currentEducation: {
      institutionName: string;
      major: string;
      currentYear: string;
    };

    englishProficiency: {
      hasCertificate: string;
      certificateUrl: string;
    };
  };

  appliedProgram: {
    programName: string;
    isApplyingScholarship: true;
    requestedTerm: Date;
    considerNextIntake: true;
    referralSource: string;
  };

  documents: {
    personalIdDocument: {
      type: string;
      url: string;
    };
    highSchoolCertificate: {
      type: string;
      url: string;
    };
    englishCertificate: {
      type: string;
      url: string;
    };
    paymentReceipt: {
      type: string;
      url: string;
    };
  };

  id: string;
  number?: string;
  nameEn?: string;
  name?: string;
  nameKh?: string;
  gender?: string;
  nationality?: string;
  dateOfBirth?: string | Date;
  dateApplied?: string | Date;
  placeOfBirth?: string;
  country?: string;
  address?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  "Parent/Guardian Name"?: string;
  "Relationship to Student"?: string;
  "Parent Nationality"?: string;
  "Parent Job"?: string;
  "Parent Phone Number"?: string;
  "Parent Address"?: string;
  educationLevel?: string;
  institutionName?: string;
  currentYear?: string | number;
  academicYear?: string | number;
  highSchoolName?: string;
  schoolLocation?: string;
  overallGrade?: string | number;
  mathGrade?: string | number;
  englishGrade?: string | number;
  university?: string;
  major?: string;
  ielts?: string | number;
  toefl?: string | number;
  baci?: string | number;
  program?: string;
  scholarship?: string;
  "Interest Major"?: string;
  "Is Applying Scholarship"?: string;
  "Requested Term"?: string;
  "Consider Next Intake"?: string;
  "Referral Source"?: string;
  status?: string;
  batch?: string;
  batchId?: string;
  awardAmount?: number;
  notes?: string;
  evaluations?: Evaluation[];
  evaluation?: Evaluation;
  mathScore?: number;
  englishScore?: number;
  [key: string]: unknown;
};

type BatchData = { students?: Student[] } & Record<string, unknown>;

type Student = {
  scholarshipPercentage?: number;

  subjects: [
    {
      subjectId: number;
      subjectName: string;
      totalScore: number;
      weight: number;
    },
  ];
  totalApplicationScore?: number;
  rank: number;

  batchId?: string;
  originalStatus?: string;
  id: string;
  number: string;
  nameEn: string;
  requestTerm?: Date;
  phoneNumber: string;
  overAllGrade?: CharacterData;
  gender: Gender;
  major: string;
  province: string;
  email: string;
  dateApplied: Date;
  status: string;
  batch?: string; // Batch identifier (e.g., "2025-Fall Intake")
  phone?: string;
  address?: string;
  gpa?: number;
  university?: string;
  graduationYear?: number;
  documents?: string[];
  interviewDate?: Date;
  examScore?: number;
  awardAmount?: number;
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
};

type TableColumn<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  hidden?: boolean;
};

type TableConfig = {
  showSearch?: boolean;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  showRowSelection?: boolean;
  showStatusFilter?: boolean;
  showButton?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
};

type DataTableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  config?: TableConfig;
  loading?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string | null) => void;
  on?: () => void;
  emptyMessage?: string;
  className?: string;
};

// API related types for future backend integration
type ApiResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ApiParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: StudentStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | number | boolean>;
};

type UseStudentTableProps = {
  initialData?: Student[];
  apiEndpoint?: string;
  autoFetch?: boolean;
  refreshInterval?: number;
};

type ExamSession = {
  id: string;
  batchId: string;
  subjectId: number;
  date: string;
  time: string;
  rooms: string[];
  slots: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ProvinceData = {
  province: string;
  count: number;
};

type DashboardOverview = {
  totalApplicants: number;
  newApplications: number;
  acceptedStudents: number;
  acceptanceRate: string;
  femaleRatio: string;
  genderDistribution: {
    gender: string;
    count: number;
  }[];
};

type DashboardCharts = {
  popularMajors: {
    major: string;
    count: number;
  }[];
  studentsByProvince: ProvinceData[];
};

type DashboardResponse = {
  success: boolean;
  data: {
    overview: DashboardOverview;
    charts: DashboardCharts;
  };
};
