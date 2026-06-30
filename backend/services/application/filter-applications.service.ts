import { db } from "@db";
import { applications } from "@db/schema/application";
import { eq, and, gte, lte } from "drizzle-orm";

export interface ApplicationFilterOptions {
  studentId?: number;
  batchId?: number;
  status?:
    | "submitted"
    | "shortlisted"
    | "assessment_scheduled"
    | "graded"
    | "accepted"
    | "rejected"
    | "incomplete";
  paymentStatus?: "pending" | "completed" | "failed";
  createdFrom?: Date;
  createdTo?: Date;
}

export class FilterApplicationsService {

  static async execute(filters: ApplicationFilterOptions = {}) {
    const conditions = [];

    if (filters.studentId !== undefined) {
      conditions.push(eq(applications.studentId, filters.studentId));
    }

    if (filters.batchId !== undefined) {
      conditions.push(eq(applications.batchId, filters.batchId));
    }

    if (filters.status !== undefined) {
      conditions.push(eq(applications.status, filters.status));
    }

    if (filters.paymentStatus !== undefined) {
      conditions.push(eq(applications.paymentStatus, filters.paymentStatus));
    }

    if (filters.createdFrom !== undefined) {
      conditions.push(gte(applications.createdAt, filters.createdFrom));
    }

    if (filters.createdTo !== undefined) {
      conditions.push(lte(applications.createdAt, filters.createdTo));
    }

    const query = db.select().from(applications);
    const results =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return results;
  }
}
