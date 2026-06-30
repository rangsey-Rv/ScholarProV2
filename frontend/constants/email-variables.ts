import { VariableDefinition } from "@/types/email";

// Email Variables matching backend format - use {{variableName}} in templates
export const EMAIL_VARIABLES: VariableDefinition[] = [
  // Applicant Information
  {
    id: "applicantName",
    label: "Applicant Name",
    key: "applicantName",
    display: "Applicant Name",
    description: "Full name of the applicant",
    example: "Bopha Chea",
    category: "recipient",
  },
  {
    id: "gender",
    label: "Gender",
    key: "gender",
    display: "Gender",
    description: "Gender of the applicant",
    example: "male",
    category: "recipient",
  },
  {
    id: "email",
    label: "Email",
    key: "email",
    display: "Email",
    description: "Email address of the applicant",
    example: "bopha.chea@example.com",
    category: "recipient",
  },
  {
    id: "status",
    label: "Application Status",
    key: "status",
    display: "Application Status",
    description: "Current status of the application",
    example: "submitted, shortlisted, awarded",
    category: "recipient",
  },
  {
    id: "major",
    label: "Major",
    key: "major",
    display: "Major",
    description: "Selected major/program",
    example: "Software Engineering",
    category: "recipient",
  },

  // Scholarship Information
  {
    id: "scholarshipPercentage",
    label: "Scholarship Percentage",
    key: "scholarshipPercentage",
    display: "Scholarship Percentage",
    description: "Scholarship award percentage",
    example: "25, 50, 75, 100",
    category: "context",
  },
  {
    id: "tuitionFee",
    label: "Tuition Fee",
    key: "tuitionFee",
    display: "Tuition Fee",
    description: "Total tuition fee amount",
    example: "$4,000",
    category: "context",
  },

  // Math Exam
  {
    id: "mathExamDate",
    label: "Math Exam Date",
    key: "mathExamDate",
    display: "Math Exam Date",
    description: "Date of math exam",
    example: "December 15, 2025",
    category: "context",
  },
  {
    id: "mathStartTime",
    label: "Math Exam Start Time",
    key: "mathStartTime",
    display: "Math Exam Start Time",
    description: "Start time of math exam",
    example: "09:00 AM",
    category: "context",
  },
  {
    id: "mathEndTime",
    label: "Math Exam End Time",
    key: "mathEndTime",
    display: "Math Exam End Time",
    description: "End time of math exam",
    example: "11:00 AM",
    category: "context",
  },
  {
    id: "mathRoom",
    label: "Math Exam Room",
    key: "mathRoom",
    display: "Math Exam Room",
    description: "Room location for math exam",
    example: "Building A, Room 101",
    category: "context",
  },

  // English Exam
  {
    id: "englishExamDate",
    label: "English Exam Date",
    key: "englishExamDate",
    display: "English Exam Date",
    description: "Date of English exam",
    example: "December 15, 2025",
    category: "context",
  },
  {
    id: "englishStartTime",
    label: "English Exam Start Time",
    key: "englishStartTime",
    display: "English Exam Start Time",
    description: "Start time of English exam",
    example: "09:00 AM",
    category: "context",
  },
  {
    id: "englishEndTime",
    label: "English Exam End Time",
    key: "englishEndTime",
    display: "English Exam End Time",
    description: "End time of English exam",
    example: "11:00 AM",
    category: "context",
  },
  {
    id: "englishRoom",
    label: "English Exam Room",
    key: "englishRoom",
    display: "English Exam Room",
    description: "Room location for English exam",
    example: "Building A, Room 101",
    category: "context",
  },

  // Interview
  {
    id: "interviewExamDate",
    label: "Interview Date",
    key: "interviewExamDate",
    display: "Interview Date",
    description: "Date of interview",
    example: "December 15, 2025",
    category: "context",
  },
  {
    id: "interviewStartTime",
    label: "Interview Day Start Time",
    key: "interviewStartTime",
    display: "Interview Day Start Time",
    description: "Start time of interview day",
    example: "08:00 AM",
    category: "context",
  },
  {
    id: "interviewEndTime",
    label: "Interview Day End Time",
    key: "interviewEndTime",
    display: "Interview Day End Time",
    description: "End time of interview day",
    example: "05:00 PM",
    category: "context",
  },
  {
    id: "interviewRoom",
    label: "Interview Room",
    key: "interviewRoom",
    display: "Interview Room",
    description: "Room location for interview",
    example: "Building A, Room 101",
    category: "context",
  },
  {
    id: "interviewSlotStart",
    label: "Interview Slot Start",
    key: "interviewSlotStart",
    display: "Interview Slot Start",
    description: "Your specific interview slot start time",
    example: "08:30 AM",
    category: "context",
  },
  {
    id: "interviewSlotEnd",
    label: "Interview Slot End",
    key: "interviewSlotEnd",
    display: "Interview Slot End",
    description: "Your specific interview slot end time",
    example: "08:45 AM",
    category: "context",
  },
];

// Category-filtered exports
export const RECIPIENT_VARIABLES: VariableDefinition[] = EMAIL_VARIABLES.filter(
  (v) => v.category === "recipient",
);

export const CONTEXT_VARIABLES: VariableDefinition[] = EMAIL_VARIABLES.filter(
  (v) => v.category === "context",
);

// Helper function to get variables (simplified - always returns all)
export function getVariablesByCategory(): VariableDefinition[] {
  // All variables are now available for all templates
  return EMAIL_VARIABLES;
}

// Helper function to get all variables
export function getAllVariables(): VariableDefinition[] {
  return EMAIL_VARIABLES;
}

// Helper to format variable for display (with curly braces)
export function formatVariable(key: string): string {
  return `[${key}]`;
}

// Helper to extract variable key from formatted string
export function extractVariableKey(formatted: string): string | null {
  const match = formatted.match(/^\{(.+)\}$/);
  return match ? match[1] : null;
}
