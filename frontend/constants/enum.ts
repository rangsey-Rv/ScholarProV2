export enum AdminStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export type StudentStatus =
  // | "new-applicant"
  | "submitted"
  | "shortlisted"
  | "graded"
  | "accepted"
  | "rejected"
  | "shortlisted_email_sent"
  | "accepted_email_sent";

export type Gender = "Male" | "Female" | "Other";

export enum BatchStatus {
  active = "active",
  closed = "closed",
}
