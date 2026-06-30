export interface CommitteeUser {
  id: string;
  email: string;
  role: "admin" | "committee"; // Add other roles if they exist
  phoneNumber: string | null; // Changed to nullable
  isActive: boolean;
}

export interface CommitteeDepartment {
  id: number;
  name?: string;
}

export interface Committee {
  id: string;
  name: string;
  userId: string;
  departmentId: number | null; // Changed to nullable
  createdAt: string;
  updatedAt: string;
  user: CommitteeUser;
  department: CommitteeDepartment | null; // Changed to nullable
}

// Optional: Response wrapper if you need it elsewhere
export interface CommitteeResponse {
  success: boolean;
  data: Committee[];
}
