import type { ApplicationFormData } from "@/types/application";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  completedSteps: number[];
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

export function getActiveStudentEmail(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const zustandUser = useAuthStore.getState().user;
    if (
      zustandUser?.email &&
      typeof zustandUser.email === "string" &&
      zustandUser.email.trim()
    ) {
      return zustandUser.email.trim().toLowerCase();
    }
  } catch {}

  try {
    const stored = sessionStorage.getItem("studentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        parsed?.email &&
        typeof parsed.email === "string" &&
        parsed.email.trim()
      ) {
        return parsed.email.trim().toLowerCase();
      }
    }
  } catch {}

  return null;
}

export function getStudentStorageKey(userEmailOrId?: string | null): string {
  const activeEmail = getActiveStudentEmail();
  const rawId = (userEmailOrId || activeEmail || "guest").toLowerCase().trim();
  const sanitized = rawId.replace(/[^a-z0-9@._-]/gi, "_");
  return `scholarpro-student-portal:${sanitized}`;
}

export function getDefaultStudentPortalSnapshot(
  userEmailOrId?: string | null,
): StudentPortalSnapshot {
  let resolvedName = "Applicant";
  let resolvedEmail = userEmailOrId || "applicant@example.com";

  if (typeof window !== "undefined") {
    try {
      const zustandUser = useAuthStore.getState().user;
      if (zustandUser?.name?.trim() && zustandUser.name.trim() !== "Student") {
        resolvedName = zustandUser.name.trim();
      }
      if (zustandUser?.email?.trim()) {
        resolvedEmail = zustandUser.email.trim();
      }
    } catch {}

    try {
      const stored = sessionStorage.getItem("studentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed?.name &&
          parsed.name.trim() &&
          parsed.name.trim() !== "Student"
        ) {
          resolvedName = parsed.name.trim();
        } else if (parsed?.email && resolvedName === "Applicant") {
          resolvedName = formatNameFromEmail(parsed.email);
        }
        if (parsed?.email) {
          resolvedEmail = parsed.email.trim();
        }
      }
    } catch {}
  }

  if (userEmailOrId && userEmailOrId.includes("@")) {
    resolvedEmail = userEmailOrId.trim();
    if (resolvedName === "Applicant") {
      resolvedName = formatNameFromEmail(resolvedEmail);
    }
  }

  let studentId = "APP-001";
  if (resolvedEmail && resolvedEmail !== "applicant@example.com") {
    let hash = 0;
    for (let i = 0; i < resolvedEmail.length; i++) {
      hash = (hash << 5) - hash + resolvedEmail.charCodeAt(i);
      hash |= 0;
    }
    const suffix = Math.abs(hash).toString().slice(0, 5).padStart(5, "0");
    studentId = `APP-${suffix}`;
  }

  return {
    applicationData: null,
    currentStep: 1,
    completedSteps: [],
    applicationStatus: "new",
    applicationId: "",
    submittedAt: null,
    examDate: null,
    examTime: null,
    examLocation: null,
    enrollmentStatus: "Enrollment will be finalized after admission.",
    gradeSummary: "Grades will be available after evaluation.",
    profile: {
      name: resolvedName,
      email: resolvedEmail,
      phone: "—",
      studentId,
    },
  };
}

export function loadStudentPortalSnapshot(
  userEmailOrId?: string | null,
): StudentPortalSnapshot {
  if (typeof window === "undefined") {
    return getDefaultStudentPortalSnapshot(userEmailOrId);
  }

  const key = getStudentStorageKey(userEmailOrId);
  const defaultSnapshot = getDefaultStudentPortalSnapshot(userEmailOrId);

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return defaultSnapshot;

    const parsed = JSON.parse(stored) as Partial<StudentPortalSnapshot>;
    return {
      ...defaultSnapshot,
      ...parsed,
      profile: {
        ...defaultSnapshot.profile,
        ...(parsed.profile ?? {}),
      },
    };
  } catch {
    return defaultSnapshot;
  }
}

export function saveStudentPortalSnapshot(
  patch: Partial<StudentPortalSnapshot>,
  userEmailOrId?: string | null,
): StudentPortalSnapshot {
  if (typeof window === "undefined") {
    return getDefaultStudentPortalSnapshot(userEmailOrId);
  }

  const targetEmail =
    patch.profile?.email ||
    (typeof userEmailOrId === "string" && userEmailOrId.trim()
      ? userEmailOrId
      : null) ||
    getActiveStudentEmail();

  const key = getStudentStorageKey(targetEmail);
  const current = loadStudentPortalSnapshot(targetEmail);

  const nextSnapshot: StudentPortalSnapshot = {
    ...current,
    ...patch,
    profile: {
      ...current.profile,
      ...(patch.profile ?? {}),
    },
  };

  window.localStorage.setItem(key, JSON.stringify(nextSnapshot));

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("student-portal-updated", { detail: nextSnapshot }),
    );
  }

  return nextSnapshot;
}

export function resetStudentPortalSnapshot(
  userEmailOrId?: string | null,
): StudentPortalSnapshot {
  if (typeof window !== "undefined") {
    const key = getStudentStorageKey(userEmailOrId);
    window.localStorage.removeItem(key);
    window.dispatchEvent(new Event("student-portal-updated"));
  }
  return getDefaultStudentPortalSnapshot(userEmailOrId);
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

export function formatNameFromEmail(email: string): string {
  if (!email || !email.includes("@")) return "Student";
  const username = email.split("@")[0].trim();
  const cleaned = username
    .replace(/[._+-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
  return cleaned || "Student";
}

export function getStudentDisplayName(
  user?: { name?: string | null; email?: string | null } | null,
): string {
  if (user?.name && user.name.trim() && user.name.trim() !== "Student") {
    return user.name.trim();
  }

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("studentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed?.name &&
          parsed.name.trim() &&
          parsed.name.trim() !== "Student"
        ) {
          return parsed.name.trim();
        }
        if (parsed?.email && parsed.email.trim()) {
          return formatNameFromEmail(parsed.email);
        }
      }
    } catch {}

    try {
      const snapshot = loadStudentPortalSnapshot();
      if (
        snapshot?.profile?.name &&
        snapshot.profile.name.trim() &&
        snapshot.profile.name !== "Applicant" &&
        snapshot.profile.name !== "Student"
      ) {
        return snapshot.profile.name.trim();
      }
      if (snapshot?.applicationData?.personal?.nameEnglish?.trim()) {
        return snapshot.applicationData.personal.nameEnglish.trim();
      }
      if (snapshot?.applicationData?.personal?.nameKhmer?.trim()) {
        return snapshot.applicationData.personal.nameKhmer.trim();
      }
      if (
        snapshot?.profile?.email &&
        snapshot.profile.email.trim() &&
        snapshot.profile.email !== "applicant@example.com"
      ) {
        return formatNameFromEmail(snapshot.profile.email);
      }
    } catch {}
  }

  if (user?.email && user.email.trim()) {
    return formatNameFromEmail(user.email);
  }

  return "Student";
}

export function getStudentInitials(name?: string | null): string {
  if (!name || !name.trim()) return "S";
  const clean = name.trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStudentRoleLabel(role?: string | null): string {
  if (!role) return "Applicant";
  const lower = role.toLowerCase();
  if (lower === "student" || lower === "applicant") return "Applicant";
  if (lower === "admin") return "Admin";
  if (lower === "committee") return "Committee";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

