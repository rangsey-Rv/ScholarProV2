import { applications } from "@db/schema/application";
import { db } from "@db";
import { eq } from "drizzle-orm";

type ApplicationStatus =
  | "submitted"
  | "shortlisted"
  | "assessment_scheduled"
  | "graded"
  | "accepted"
  | "rejected"
  | "incomplete";

export default async (status: ApplicationStatus, appId: number) => {
  return await db
    .update(applications)
    .set({ status })
    .where(eq(applications.id, appId));
};
