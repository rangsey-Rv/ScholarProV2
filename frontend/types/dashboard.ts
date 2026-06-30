export type DashboardSummary = {
  newApplications: number;
  totalApplicants: number;
  acceptanceRate: number;
  femaleRatio: number;
};

export type DashboardGender = {
  female: number;
  male: number;
  total: number;
};

export type DashboardMajorItem = {
  major: string;
  count: number;
};

export type DashboardProvinceItem = {
  province: string;
  count: number;
};

export type DashboardBatchItem = {
  batch: string;
  count: number;
};

export type ApplicantStatus =
  | "new-applicant"
  | "shortlisted"
  | "exam-scheduled"
  | "awarded"
  | "rejected";
