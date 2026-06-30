// services/UnifiedExamScoreService.ts
import { db } from "@db";
import { eq, and, SQL, inArray } from "drizzle-orm";

import { exams } from "@db/schema/exam";
import { examSessions } from "@db/schema/exam-session";
import { subjects } from "@db/schema/subject";
import { applications } from "@db/schema/application";
import { students } from "@db/schema/student";
import { interviewScores } from "@db/schema/interview-score";
import { interviewCriterias } from "@db/schema/interview-criteria";
import { committees } from "@db/schema/committee";
import { calculateRanks } from "@utils/calculate-rank";
import { TotalApplicationScoreCalculatorService } from "@services/application/Totalapplication-score-calculator.service";
import { InterviewScoreCalculatorService } from "@services/interview/interview-score-calculator.service";
import { PaginationConfigService } from "@services/setting/pagination-config.service";

type Filters = {
  applicationId?: number;
  applicationIds?: number[]; // Support multiple applications
  subjectId?: number;
  subjectIds?: number[]; // Support multiple subjects
  examId?: number | null;
  examIds?: (number | null)[]; // Support multiple exams
  examSessionId?: number;
  examSessionIds?: number[]; // Support multiple exam sessions
  batchId?: number;
  batchIds?: number[]; // Support multiple batches
  committeeId?: string;
  committeeIds?: string[]; // Support multiple committees (UUID)
};

type PaginationOptions = {
  page?: number;
  limit?: number;
};

type Committee = {
  committeeId: string;
  committeeName: string | null;
  totalScore: number;
  criterias: {
    criteriaId: number;
    criteriaName: string | null;
    weight: number;
    score: number;
  }[];
};

type InterviewSubject = {
  examId: number | null;
  subjectId: number | null;
  totalFinalScore: number;
  committees: Committee[];
};

type Subject = {
  examId: number | null;
  subjectId: number;
  subjectName: string;
  fullMark?: number | null;
  weight: number;
  score: number;
  interview?: InterviewSubject;
  committees?: Committee[];
};

type ApplicationGroup = {
  applicationId: number;
  applicantName: string | null;
  subjects: Subject[];
  totalFinalScore?: number;
  rank?: number;
};
export class UnifiedExamScoreService {
  private interviewCalculator = new InterviewScoreCalculatorService();
  
  async listAll(
    filters: Filters = {},
    paginationOptions: PaginationOptions = {}
  ) {
    const {
      applicationId,
      applicationIds,
      examSessionId,
      examSessionIds,
      examId,
      examIds,
      batchId,
      batchIds,
      subjectId,
      subjectIds,
      committeeId,
      committeeIds,
    } = filters;

    // Build WHERE conditions
    const conditions: SQL<unknown>[] = [];
    // Application filters
    if (applicationId) {
      conditions.push(eq(applications.id, applicationId));
    } else if (applicationIds && applicationIds.length > 0) {
      conditions.push(inArray(applications.id, applicationIds));
    }

    // Batch filters
    if (batchId) {
      conditions.push(eq(applications.batchId, batchId));
    } else if (batchIds && batchIds.length > 0) {
      conditions.push(inArray(applications.batchId, batchIds));
    }

    // Exam session filters
    if (examSessionId) {
      conditions.push(eq(examSessions.id, examSessionId));
    } else if (examSessionIds && examSessionIds.length > 0) {
      conditions.push(inArray(examSessions.id, examSessionIds));
    }

    // Exam filters
    if (examId) {
      conditions.push(eq(exams.id, examId));
    } else if (examIds && examIds.length > 0) {
      const validExamIds = examIds.filter((id): id is number => id !== null);
      if (validExamIds.length > 0) {
        conditions.push(inArray(exams.id, validExamIds));
      }
    }

    // Subject filters
    if (subjectId) {
      conditions.push(eq(subjects.id, subjectId));
    } else if (subjectIds && subjectIds.length > 0) {
      conditions.push(inArray(subjects.id, subjectIds));
    }

    const whereCond = conditions.length ? and(...conditions) : undefined;

    // ------------ Fetch skip flags for applications ------------
    const skipFlagsRows = await db
      .select({
        applicationId: applications.id,
        isMathTestSkipped: applications.isMathTestSkipped,
        isEnglishTestSkipped: applications.isEnglishTestSkipped,
      })
      .from(applications)
      .where(whereCond);

    const skipFlagsMap: Record<
      number,
      {
        isMathTestSkipped: boolean;
        isEnglishTestSkipped: boolean;
      }
    > = {};

    for (const row of skipFlagsRows) {
      skipFlagsMap[row.applicationId] = {
        isMathTestSkipped: row.isMathTestSkipped ?? false,
        isEnglishTestSkipped: row.isEnglishTestSkipped ?? false,
      };
    }

    // ------------ Fetch ALL subjects (both normal and interview) ------------
    const allSubjectRows = await db
      .select({
        applicationId: applications.id,
        applicantName: students.nameEn,
        examId: exams.id,
        subjectId: subjects.id,
        subjectName: subjects.subjectName,
        fullMark: subjects.weight,
        weight: subjects.weight,
        subjectScore: exams.totalScore,
      })
      .from(exams)
      .innerJoin(applications, eq(exams.appId, applications.id))
      .leftJoin(students, eq(applications.studentId, students.id))
      .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
      .innerJoin(subjects, eq(examSessions.subjectId, subjects.id))
      .where(whereCond);

    // Build WHERE conditions for interview scores (includes committee filter)
    const interviewConditions: SQL<unknown>[] = [];

    if (applicationId) {
      interviewConditions.push(eq(applications.id, applicationId));
    } else if (applicationIds && applicationIds.length > 0) {
      interviewConditions.push(inArray(applications.id, applicationIds));
    }

    if (batchId) {
      interviewConditions.push(eq(applications.batchId, batchId));
    } else if (batchIds && batchIds.length > 0) {
      interviewConditions.push(inArray(applications.batchId, batchIds));
    }

    if (examSessionId) {
      interviewConditions.push(eq(examSessions.id, examSessionId));
    } else if (examSessionIds && examSessionIds.length > 0) {
      interviewConditions.push(inArray(examSessions.id, examSessionIds));
    }

    if (examId) {
      interviewConditions.push(eq(exams.id, examId));
    } else if (examIds && examIds.length > 0) {
      const validExamIds = examIds.filter((id): id is number => id !== null);
      if (validExamIds.length > 0) {
        interviewConditions.push(inArray(exams.id, validExamIds));
      }
    }

    if (subjectId) {
      interviewConditions.push(eq(subjects.id, subjectId));
    } else if (subjectIds && subjectIds.length > 0) {
      interviewConditions.push(inArray(subjects.id, subjectIds));
    }

    // Committee filters (UUID)
    if (committeeId) {
      interviewConditions.push(eq(interviewScores.committeeId, committeeId));
    } else if (committeeIds && committeeIds.length > 0) {
      interviewConditions.push(
        inArray(interviewScores.committeeId, committeeIds)
      );
    }

    const interviewWhereCond = interviewConditions.length
      ? and(...interviewConditions)
      : undefined;

    // ------------ Fetch interview scores ------------
    const interviewRows = await db
      .select({
        applicationId: applications.id,
        examId: exams.id,
        subjectId: subjects.id,
        subjectName: subjects.subjectName,
        subjectWeight: subjects.weight,
        committeeId: interviewScores.committeeId,
        committeeName: committees.name,
        criteriaId: interviewCriterias.id,
        criteriaName: interviewCriterias.name,
        criteriaWeight: interviewCriterias.weight,
        score: interviewScores.score,
      })
      .from(interviewScores)
      .innerJoin(exams, eq(interviewScores.examId, exams.id))
      .innerJoin(applications, eq(exams.appId, applications.id))
      .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
      .innerJoin(subjects, eq(examSessions.subjectId, subjects.id))
      .innerJoin(
        interviewCriterias,
        eq(interviewScores.criteriaId, interviewCriterias.id)
      )
      .innerJoin(committees, eq(interviewScores.committeeId, committees.id))
      .where(interviewWhereCond);

    // Create a map of examId -> interview data
    const interviewDataMap: Record<
      number,
      {
        subjectId: number | null;
        subjectName: string;
        subjectWeight: number;
        committees: Map<
          string,
          {
            committeeId: string;
            committeeName: string | null;
            criterias: Array<{
              criteriaId: number;
              criteriaName: string | null;
              weight: number;
              score: number;
            }>;
            totalScore: number;
          }
        >;
      }
    > = {};

    // Build interview data structure
    for (const r of interviewRows) {
      if (!r.examId || !r.committeeId || !r.criteriaId) continue;

      if (!interviewDataMap[r.examId]) {
        interviewDataMap[r.examId] = {
          subjectId: r.subjectId,
          subjectName: r.subjectName || "Interview",
          subjectWeight: Number(r.subjectWeight ?? 0),
          committees: new Map(),
        };
      }

      const examData = interviewDataMap[r.examId];

      if (!examData.committees.has(r.committeeId)) {
        examData.committees.set(r.committeeId, {
          committeeId: r.committeeId,
          committeeName: r.committeeName ?? null,
          criterias: [],
          totalScore: 0,
        });
      }

      const committee = examData.committees.get(r.committeeId)!;
      const raw = Number(r.score ?? 0);
      const w = Number(r.criteriaWeight ?? 0);

      committee.criterias.push({
        criteriaId: r.criteriaId,
        criteriaName: r.criteriaName,
        weight: w,
        score: raw,
      });

      committee.totalScore += raw;
    }

    // ------------ Group by application ------------
    const grouped: Record<number, ApplicationGroup> = {};

    // Use a temporary map to handle subject deduplication for each application
    const applicationSubjectsMap: Record<number, Record<number, Subject>> = {};

    for (const r of allSubjectRows) {
      const appId = r.applicationId;
      const examId = r.examId;

      if (!grouped[appId]) {
        grouped[appId] = {
          applicationId: appId,
          applicantName: r.applicantName ?? null,
          subjects: [],
        };
        applicationSubjectsMap[appId] = {}; // Initialize map for this application
      }

      // Check if this exam has interview data
      const isInterview = examId && interviewDataMap[examId];

      let currentSubject: Subject;

      if (isInterview) {
        const interviewData = interviewDataMap[examId];
        const committeesArr = Array.from(interviewData.committees.values());

        committeesArr.forEach((c) => {
          c.totalScore = Number(c.totalScore.toFixed(2));
        });

        const examTotalScore = Number(r.subjectScore ?? 0);

        currentSubject = {
          examId: examId,
          subjectId: interviewData.subjectId ?? 0,
          subjectName: interviewData.subjectName,
          fullMark: null,
          weight: interviewData.subjectWeight,
          score: examTotalScore,
          committees: committeesArr.map((c) => ({
            committeeId: c.committeeId,
            committeeName: c.committeeName,
            totalScore: c.totalScore,
            criterias: c.criterias,
          })),
        };
      } else {
        let subjectScore = Number(r.subjectScore ?? 0);

        // Check if this subject should have full score due to skip flags
        const skipFlags = skipFlagsMap[appId];
        if (skipFlags) {
          if (skipFlags.isMathTestSkipped && r.subjectName === "Math") {
            subjectScore = 100;
          }
          if (skipFlags.isEnglishTestSkipped && r.subjectName === "English") {
            subjectScore = 100;
          }
        }

        currentSubject = {
          examId: examId,
          subjectId: r.subjectId,
          subjectName: r.subjectName,
          fullMark: r.fullMark,
          weight: Number(r.weight ?? 0),
          score: subjectScore,
        };
      }

      if (currentSubject.subjectId == null) {
        continue;
      }
      const subjectId = currentSubject.subjectId as number; // type assertion
      const existingSubject = applicationSubjectsMap[appId][subjectId];
      if (!existingSubject || currentSubject.score > existingSubject.score) {
        applicationSubjectsMap[appId][subjectId] = currentSubject;
      }
    }

    // Convert the subject maps back to arrays for each application
    // and apply skip test logic
    for (const appId in grouped) {
      const subjects = Object.values(applicationSubjectsMap[appId]);
      const skipFlags = skipFlagsMap[Number(appId)];

      if (skipFlags) {
        // Update Math test score if skipped
        if (skipFlags.isMathTestSkipped) {
          const mathSubject = subjects.find(
            (s) =>
              s.subjectId=== 1 
          );
          if (mathSubject) {
            mathSubject.score = 100;
          }
        }

        // Update English test score if skipped
        if (skipFlags.isEnglishTestSkipped) {
          const englishSubject = subjects.find(
            (s) => s.subjectId === 2
          );
          if (englishSubject) {
            englishSubject.score = 100;
          }
        }
      }

      grouped[appId].subjects = subjects;
    }
    // ------------ Finalize all applications ------------
    let totalFinalScore = 0;

    for (const app of Object.values(grouped)) {
      // Calculate total application score using static method
      const score = TotalApplicationScoreCalculatorService.calculate(
        app.subjects.map((s) => ({
          subjectId: s.subjectId ?? 0,
          totalScore: s.score,
          weight: s.weight,
        }))
      );

      app.totalFinalScore = Number(score.toFixed(2));
      totalFinalScore += app.totalFinalScore;
      // Sort subjects alphabetically
      app.subjects.sort((a, b) =>
        String(a.subjectName).localeCompare(b.subjectName)
      );
    }
    const applicationsArray = Object.values(grouped);
    const rankMap = calculateRanks(
      applicationsArray.map((app) => ({
        applicationId: app.applicationId,
        totalApplicationScore: app.totalFinalScore ?? 0,
      }))
    );

    const result = applicationsArray.map((app) => ({
      ...app,
      rank: rankMap.get(app.applicationId) ?? 0,
    }));

    // ------------ Apply Pagination ------------
    const totalCount = applicationsArray.length;

    // Get pagination settings
    const defaultLimit = await PaginationConfigService.getDefaultLimit();
    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || defaultLimit;
    const offset = (page - 1) * limit;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Apply pagination
    const paginatedApplications = result.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedApplications,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalCount,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
    };
  }
}
