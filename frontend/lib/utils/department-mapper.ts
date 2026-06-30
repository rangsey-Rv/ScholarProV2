// utils/department-mapper.ts

export const FACULTY = {
  ENGINEERING: [
    "Software Engineering",
    "Cyber Security",
    "Robotics and Automation Engineering",
    "Data Science and Artificial Intelligence",
  ],
  ARTS_AND_HUMANITIES: ["History", "Philosophy"],
  BUSINESS_AND_MANAGEMENT: ["Business Intelligence"],
  APPLIED_SCIENCES: ["Environmental Science", "Food Science and Technology"],
  BUILD_ENVIRONMENT: ["Architecture", "Interior Design"],
};

// // Function: Input a Major (string) -> Output a Department (string)
// export const getFacultyByMajor = (major: string): 'Engineering' | 'Arts & Humanities' | 'Business & Management' | 'Applied Sciences' | 'Build Environment' => {

export const getFacultyByMajor = (major: string): string => {
  // Optional: Trim whitespace to prevent " Civil Engineering" mismatch
  const cleanMajor = major.trim();

  if (FACULTY.ENGINEERING.includes(cleanMajor)) return "Engineering";
  if (FACULTY.ARTS_AND_HUMANITIES.includes(cleanMajor))
    return "Arts & Humanities";
  if (FACULTY.BUSINESS_AND_MANAGEMENT.includes(cleanMajor))
    return "Business & Management";
  if (FACULTY.APPLIED_SCIENCES.includes(cleanMajor)) return "Applied Sciences";
  if (FACULTY.BUILD_ENVIRONMENT.includes(cleanMajor))
    return "Build Environment";

  return "General";
};
