import { db } from "@db";
import { students } from "@db/schema/student";
import { applications } from "@db/schema/application";
import { appliedPrograms } from "@db/schema/applied-program";
import { examSessions } from "@db/schema/exam-session";
import { majors } from "@db/schema/major";
import { interviewSelection } from "@db/schema/interview-selection";
import { exams } from "@db/schema/exam";
import { eq, and, SQL, desc, inArray } from "drizzle-orm";
import { personalInfo } from "@db/schema/personal-info";
import { formatDate, formatTime } from "@utils/formate-data-time";

interface BulkEmailFilters {
  batchId?: number;
  scholarshipPercentage?: number;
  major?: string;
  isApplyForScholarShip?: boolean;
  status?:
  | "submitted"
  | "shortlisted"
  | "shortlisted_email_sent"
  | "assessment_scheduled"
  | "graded"
  | "accepted"
  | "accepted_email_sent"
  | "rejected"
  | "incomplete";
  limit?: number;
  offset?: number;
  fullEnrichment?: boolean;
}

export default async function fetchGlobalVariable(filters?: BulkEmailFilters) {
  const whereConditions: SQL[] = [];

  if (filters?.batchId !== undefined) {
    whereConditions.push(eq(applications.batchId, filters.batchId));
  }

  if (filters?.status !== undefined) {
    whereConditions.push(eq(applications.status, filters.status));
  }

  if (filters?.isApplyForScholarShip !== undefined) {
    whereConditions.push(
      eq(applications.isApplyForScholarShip, filters.isApplyForScholarShip)
    );
  }

  if (filters?.scholarshipPercentage !== undefined) {
    whereConditions.push(
      eq(applications.scholarshipPercentage, filters.scholarshipPercentage)
    );
  }

  if (filters?.major !== undefined) {
    whereConditions.push(eq(majors.majorName, filters.major));
  }

  let baseQuery = db
    .select({
      applicationId: applications.id,
      applicantName: students.nameEn,
      isApplyForScholarShip: applications.isApplyForScholarShip,
      gender: personalInfo.gender,
      email: students.email,
      status: applications.status,
      scholarshipPercentage: applications.scholarshipPercentage,
      major: majors.majorName,
      tuitionFee: majors.tuitionFee,
    })
    .from(applications)
    .innerJoin(students, eq(applications.studentId, students.id))
    .innerJoin(personalInfo, eq(students.id, personalInfo.studentId))
    .innerJoin(appliedPrograms, eq(applications.id, appliedPrograms.appId))
    .innerJoin(majors, eq(appliedPrograms.interestMajorId, majors.id))
    .orderBy(desc(applications.updatedAt))
    .limit(filters?.limit || 50)
    .offset(filters?.offset || 0);

  if (whereConditions.length > 0) {
    baseQuery = baseQuery.where(and(...whereConditions)) as any;
  }

  const results = await baseQuery;

  if (!results.length) return [];

  // If fullEnrichment is false (default), skip the exam/interview queries
  if (filters?.fullEnrichment === false) {
    return results.map((r) => ({
      ...r,
      mathExamDate: "N/A",
      mathStartTime: "N/A",
      mathEndTime: "N/A",
      mathRoom: "N/A",
      englishExamDate: "N/A",
      englishStartTime: "N/A",
      englishEndTime: "N/A",
      englishRoom: "N/A",
      interviewExamDate: "N/A",
      interviewStartTime: "N/A",
      interviewEndTime: "N/A",
      interviewRoom: "N/A",
      interviewSlotStart: "N/A",
      interviewSlotEnd: "N/A",
    }));
  }

  const applicationIds = results.map((r) => r.applicationId);

  // Batch fetch math exams (subjectId 1)
  const mathExams = await db
    .select({
      appId: exams.appId,
      examDate: examSessions.examDate,
      startTime: examSessions.startTime,
      endTime: examSessions.endTime,
      location: examSessions.location,
    })
    .from(exams)
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .where(and(inArray(exams.appId, applicationIds), eq(examSessions.subjectId, 1)));

  // Batch fetch english exams (subjectId 2)
  const englishExams = await db
    .select({
      appId: exams.appId,
      examDate: examSessions.examDate,
      startTime: examSessions.startTime,
      endTime: examSessions.endTime,
      location: examSessions.location,
    })
    .from(exams)
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .where(and(inArray(exams.appId, applicationIds), eq(examSessions.subjectId, 2)));

  // Batch fetch interviews (subjectId 3)
  const interviews = await db
    .select({
      appId: exams.appId,
      examDate: examSessions.examDate,
      startTime: examSessions.startTime,
      endTime: examSessions.endTime,
      location: examSessions.location,
      slotStart: interviewSelection.slotStart,
      slotEnd: interviewSelection.slotEnd,
    })
    .from(exams)
    .innerJoin(interviewSelection, eq(exams.id, interviewSelection.examId))
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .where(and(inArray(exams.appId, applicationIds), eq(examSessions.subjectId, 3)));

  // Create lookup maps
  const mathMap = new Map(mathExams.map((e) => [e.appId, e]));
  const englishMap = new Map(englishExams.map((e) => [e.appId, e]));
  const interviewMap = new Map(interviews.map((e) => [e.appId, e]));

  return results.map((result) => {
    const math = mathMap.get(result.applicationId);
    const english = englishMap.get(result.applicationId);
    const interview = interviewMap.get(result.applicationId);

    return {
      ...result,
      mathExamDate: math ? formatDate(math.examDate) : "N/A",
      mathStartTime: math ? formatTime(math.startTime) : "N/A",
      mathEndTime: math ? formatTime(math.endTime) : "N/A",
      mathRoom: math?.location || "N/A",
      englishExamDate: english ? formatDate(english.examDate) : "N/A",
      englishStartTime: english ? formatTime(english.startTime) : "N/A",
      englishEndTime: english ? formatTime(english.endTime) : "N/A",
      englishRoom: english?.location || "N/A",
      interviewExamDate: interview ? formatDate(interview.examDate) : "N/A",
      interviewStartTime: interview ? formatTime(interview.startTime) : "N/A",
      interviewEndTime: interview ? formatTime(interview.endTime) : "N/A",
      interviewRoom: interview?.location || "N/A",
      interviewSlotStart: interview ? formatTime(interview.slotStart) : "N/A",
      interviewSlotEnd: interview ? formatTime(interview.slotEnd) : "N/A",
    };
  });
}
