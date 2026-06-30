export interface Faculty {
  id: number;
  facultyName: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
export interface FacultyResponse {
  success: boolean;
  data: Faculty[];
}

export interface SingleFacultyResponse {
  success: boolean;
  data: Faculty;
}

export interface FacultyPayload {
  facultyName: string;
}
