import type { ApplicationFormData } from "@/types/application";

export type StudentApplicationStatus =
  | "new"
  | "draft"
  | "submitted"
  | "under_review"
  | "exam_scheduled"
  | "admitted"
  | "rejected";

export interface StudentPortalSnapshot {
  applicationData: ApplicationFormData | null;
  currentStep: number;
  applicationStatus: StudentApplicationStatus;
  applicationId: string;
  submittedAt: string | null;
  examDate: string | null;
  examTime: string | null;
  examLocation: string | null;
  enrollmentStatus: string;
  gradeSummary: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
  };
}

const STORAGE_KEY = "scholarpro-student-portal";

export function getDefaultStudentPortalSnapshot(): StudentPortalSnapshot {
  return {
    applicationData: null,
    currentStep: 1,
    applicationStatus: "new",
    applicationId: "",
    submittedAt: null,
    examDate: null,
    examTime: null,
    examLocation: null,
    enrollmentStatus: "Enrollment will be finalized after admission.",
    gradeSummary: "Grades will be available after evaluation.",
    profile: {
      name: "Applicant",
      email: "applicant@example.com",
      phone: "—",
      studentId: "—",
    },
  };
}

export function loadStudentPortalSnapshot(): StudentPortalSnapshot {
  if (typeof window === "undefined") {
    return getDefaultStudentPortalSnapshot();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultStudentPortalSnapshot();

    const parsed = JSON.parse(stored) as Partial<StudentPortalSnapshot>;
    return {
      ...getDefaultStudentPortalSnapshot(),
      ...parsed,
      profile: {
        ...getDefaultStudentPortalSnapshot().profile,
        ...(parsed.profile ?? {}),
      },
    };
  } catch {
    return getDefaultStudentPortalSnapshot();
  }
}

export function saveStudentPortalSnapshot(
  patch: Partial<StudentPortalSnapshot>,
): StudentPortalSnapshot {
  if (typeof window === "undefined") {
    return getDefaultStudentPortalSnapshot();
  }

  const nextSnapshot = {
    ...loadStudentPortalSnapshot(),
    ...patch,
    profile: {
      ...loadStudentPortalSnapshot().profile,
      ...(patch.profile ?? {}),
    },
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSnapshot));
  return nextSnapshot;
}

export function getStatusMeta(status: StudentApplicationStatus) {
  switch (status) {
    case "new":
      return {
        label: "New",
        tone: "bg-indigo-100 text-indigo-700 border-indigo-200",
        detail:
          "A new application has been started and is ready for completion.",
      };
    case "submitted":
      return {
        label: "Submitted",
        tone: "bg-slate-100 text-slate-700 border-slate-200",
        detail: "Your application has been sent successfully.",
      };
    case "under_review":
      return {
        label: "Under Review",
        tone: "bg-amber-100 text-amber-700 border-amber-200",
        detail: "The admissions team is reviewing your application.",
      };
    case "exam_scheduled":
      return {
        label: "Exam Scheduled",
        tone: "bg-blue-100 text-blue-700 border-blue-200",
        detail: "Your exam or interview has been scheduled.",
      };
    case "admitted":
      return {
        label: "Admitted",
        tone: "bg-emerald-100 text-emerald-700 border-emerald-200",
        detail: "You have been admitted and enrollment is next.",
      };
    case "rejected":
      return {
        label: "Rejected",
        tone: "bg-rose-100 text-rose-700 border-rose-200",
        detail: "Your application was not successful this time.",
      };
    default:
      return {
        label: "Draft",
        tone: "bg-violet-100 text-violet-700 border-violet-200",
        detail: "You are still completing the application form.",
      };
  }
}

export function getProgressItems(snapshot: StudentPortalSnapshot) {
  const formData = snapshot.applicationData;

  return [
    {
      label: "Personal Information",
      completed: Boolean(
        formData?.personal?.nameEnglish || formData?.personal?.nameKhmer,
      ),
      note: "Your identity and contact details",
    },
    {
      label: "Parents / Guardians",
      completed: Boolean(formData?.parents?.name),
      note: "Contact details for your guardian",
    },
    {
      label: "Education",
      completed: Boolean(formData?.education?.currentEducationLevel),
      note: "Academic background and documents",
    },
    {
      label: "Applied Program",
      completed: Boolean(formData?.program?.interestedMajors?.length),
      note: "Major, scholarship, and intake choices",
    },
    {
      label: "Review & Submit",
      completed:
        snapshot.applicationStatus !== "new" &&
        snapshot.applicationStatus !== "draft",
      note: "Application submitted for review",
    },
  ];
}

export function getProgressPercent(snapshot: StudentPortalSnapshot) {
  const items = getProgressItems(snapshot);
  const completed = items.filter((item) => item.completed).length;
  return Math.round((completed / items.length) * 100);
}
