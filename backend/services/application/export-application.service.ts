import { db } from "../../db";
import { students } from "../../db/schema/student";
import { applications } from "../../db/schema/application";
import { personalInfo } from "../../db/schema/personal-info";
import { appliedPrograms } from "../../db/schema/applied-program";
import { majors } from "../../db/schema/major";
import { batches } from "../../db/schema/batch";
import { exams } from "../../db/schema/exam";
import { examSessions } from "../../db/schema/exam-session";
import { eq, and, sql } from "drizzle-orm";

export type ExportStatus =
  | "all"
  | "submitted"
  | "shortlisted"
  | "assessment_scheduled"
  | "graded"
  | "accepted"
  | "rejected";

interface ExportFilters {
  status?: ExportStatus;
  batchId?: number;
}

interface ExportResult {
  data: any[];
  totalRecords: number;
}

export class ExportApplicationService {
  /**
   * Export applications with dynamic columns based on status
   */
  async exportApplications(filters: ExportFilters): Promise<ExportResult> {
    const { status = "all", batchId } = filters;

    // Build base query conditions
    const conditions = [];

    if (batchId) {
      conditions.push(eq(applications.batchId, batchId));
    }

    // Add status filter
    if (status !== "all") {
      conditions.push(eq(applications.status, status));
    } else {
      // For "all" status, include only "submitted" applications (new applicants)
      conditions.push(eq(applications.status, "submitted"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get applications based on status
    let data: any[] = [];

    switch (status) {
      case "all":
      case "submitted":
        data = await this.exportDefaultStatus(whereClause);
        break;
      case "shortlisted":
        data = await this.exportShortlisted(whereClause);
        break;
      case "assessment_scheduled":
        data = await this.exportExams(whereClause);
        break;
      case "graded":
        data = await this.exportAwards(whereClause);
        break;
      case "accepted":
        data = await this.exportAwards(whereClause);
        break;
      case "rejected":
        data = await this.exportRejects(whereClause);
        break;
      default:
        data = await this.exportDefaultStatus(whereClause);
    }

    return {
      data,
      totalRecords: data.length,
    };
  }

  /**
   * Export for "All Status" and "New Applicant" (submitted)
   * Columns: Number(id), Name, Gender, Major, Province, Email, Date Applied
   */
  private async exportDefaultStatus(
    whereClause: any
  ) {
    const results = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(whereClause)
      .orderBy(applications.id);

    const data = await Promise.all(
      results.map(async (app) => {
        // Get student info
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        // Get personal info for gender and province
        const personal = await db
          .select()
          .from(personalInfo)
          .where(eq(personalInfo.studentId, app.studentId))
          .limit(1);

        // Get applied program for major
        const program = await db
          .select({ majorName: majors.majorName })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        // Get batch info
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        return {
          Number: app.id,
          Name: student[0]?.nameEn || "N/A",
          Gender: personal[0]?.gender || "N/A",
          Major: program[0]?.majorName || "N/A",
          Province: personal[0]?.address || "N/A",
          Email: student[0]?.email || "N/A",
          Batch: batch[0]?.batchName || "N/A",
          "Date Applied": app.createdAt,
        };
      })
    );

    return data;
  }

  /**
   * Export for "Shortlisted" status
   * Columns: Number(id), Name, Gender, Major, Email, Date Applied, Evaluation, Status
   */
  private async exportShortlisted(
    whereClause: any
  ) {
    const results = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
        status: applications.status,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(whereClause)
      .orderBy(applications.id);

    const data = await Promise.all(
      results.map(async (app) => {
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        const personal = await db
          .select()
          .from(personalInfo)
          .where(eq(personalInfo.studentId, app.studentId))
          .limit(1);

        const program = await db
          .select({ majorName: majors.majorName })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        // Get exam info for evaluation (if exists)
        const exam = await db
          .select()
          .from(exams)
          .where(eq(exams.appId, app.id))
          .limit(1);

        // Get batch info
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        return {
          Number: app.id,
          Name: student[0]?.nameEn || "N/A",
          Gender: personal[0]?.gender || "N/A",
          Major: program[0]?.majorName || "N/A",
          Email: student[0]?.email || "N/A",
          Batch: batch[0]?.batchName || "N/A",
          "Date Applied": app.createdAt,
          Evaluation: exam[0]?.totalScore
            ? `${exam[0].totalScore}/100`
            : "Pending",
          Status: app.status,
        };
      })
    );

    return data;
  }

  /**
   * Export for "Exams" status (assessment_scheduled)
   * Columns: Number(id), Name, Gender, Major, Email, Exam Date, Exam Score
   */
  private async exportExams(whereClause: any) {
    const results = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
      })
      .from(applications)
      .where(whereClause)
      .orderBy(applications.id);

    const data = await Promise.all(
      results.map(async (app) => {
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        const personal = await db
          .select()
          .from(personalInfo)
          .where(eq(personalInfo.studentId, app.studentId))
          .limit(1);

        const program = await db
          .select({ majorName: majors.majorName })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        // Get exam info
        const exam = await db
          .select()
          .from(exams)
          .where(eq(exams.appId, app.id))
          .limit(1);

        let examDate = "Not Scheduled";
        if (exam[0]) {
          const examSession = await db
            .select()
            .from(examSessions)
            .where(eq(examSessions.id, exam[0].examSessionId))
            .limit(1);
          examDate = examSession[0]?.examDate
            ? new Date(examSession[0].examDate).toLocaleDateString()
            : "Not Scheduled";
        }

        // Get batch info
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        return {
          Number: app.id,
          Name: student[0]?.nameEn || "N/A",
          Gender: personal[0]?.gender || "N/A",
          Major: program[0]?.majorName || "N/A",
          Email: student[0]?.email || "N/A",
          Batch: batch[0]?.batchName || "N/A",
          "Exam Date": examDate,
          "Exam Score": exam[0]?.totalScore || "Not Graded",
        };
      })
    );

    return data;
  }

  /**
   * Export for "Awards" status (graded/accepted)
   * Columns: Number(id), Name, Gender, Major, Email, Exam Date, Scholarship
   */
  private async exportAwards(whereClause: any) {
    const results = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
        scholarshipPercentage: applications.scholarshipPercentage,
      })
      .from(applications)
      .where(whereClause)
      .orderBy(applications.id);

    const data = await Promise.all(
      results.map(async (app) => {
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        const personal = await db
          .select()
          .from(personalInfo)
          .where(eq(personalInfo.studentId, app.studentId))
          .limit(1);

        const program = await db
          .select()
          .from(appliedPrograms)
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        const exam = await db
          .select()
          .from(exams)
          .where(eq(exams.appId, app.id))
          .limit(1);

        let examDate = "N/A";
        if (exam[0]) {
          const examSession = await db
            .select()
            .from(examSessions)
            .where(eq(examSessions.id, exam[0].examSessionId))
            .limit(1);
          examDate = examSession[0]?.examDate
            ? new Date(examSession[0].examDate).toLocaleDateString()
            : "N/A";
        }

        // Get batch info
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        // Ensure program query uses majorName
        const programQuery = await db
          .select({ majorName: majors.majorName })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        return {
          Number: app.id,
          Name: student[0]?.nameEn || "N/A",
          Gender: personal[0]?.gender || "N/A",
          Major: programQuery[0]?.majorName || "N/A",
          Email: student[0]?.email || "N/A",
          Batch: batch[0]?.batchName || "N/A",
          "Exam Date": examDate,
          Scholarship: app.scholarshipPercentage
            ? `${app.scholarshipPercentage}%`
            : "0%",
        };
      })
    );

    return data;
  }

  /**
   * Export for "Rejects" status
   * Columns: Number(id), Name, Gender, Major, Email, Exam Date, Status
   */
  private async exportRejects(whereClause: any) {
    const results = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
        status: applications.status,
      })
      .from(applications)
      .where(whereClause)
      .orderBy(applications.id);

    const data = await Promise.all(
      results.map(async (app) => {
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        const personal = await db
          .select()
          .from(personalInfo)
          .where(eq(personalInfo.studentId, app.studentId))
          .limit(1);

        const program = await db
          .select({ majorName: majors.majorName })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        const exam = await db
          .select()
          .from(exams)
          .where(eq(exams.appId, app.id))
          .limit(1);

        let examDate = "N/A";
        if (exam[0]) {
          const examSession = await db
            .select()
            .from(examSessions)
            .where(eq(examSessions.id, exam[0].examSessionId))
            .limit(1);
          examDate = examSession[0]?.examDate
            ? new Date(examSession[0].examDate).toLocaleDateString()
            : "N/A";
        }

        // Get batch info
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        return {
          Number: app.id,
          Name: student[0]?.nameEn || "N/A",
          Gender: personal[0]?.gender || "N/A",
          Major: program[0]?.majorName || "N/A",
          Email: student[0]?.email || "N/A",
          Batch: batch[0]?.batchName || "N/A",
          "Exam Date": examDate,
          Status: app.status,
        };
      })
    );

    return data;
  }

  /**
   * Get all available batches for filtering
   */
  async getAvailableBatches() {
    const allBatches = await db
      .select({
        id: batches.id,
        name: batches.batchName,
        startDate: batches.startDate,
        endDate: batches.endDate,
        status: batches.status,
      })
      .from(batches)
      .orderBy(batches.startDate);

    return allBatches;
  }
}
