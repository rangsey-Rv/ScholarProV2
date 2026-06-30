import { db } from "@db";
import { examSessions } from "@db/schema/exam-session";
import { examSessionCommittees } from "@db/schema/exam-session-committee";
import { exams } from "@db/schema/exam";
import { subjects } from "@db/schema/subject";
import { committees } from "@db/schema/committee";
import { applications } from "@db/schema/application";
import { students } from "@db/schema/student";
import { interviewSelection } from "@db/schema/interview-selection";
import { eq, and, sql } from "drizzle-orm";
import { faculties } from "@db/schema/faculty";

export default async (userId: string, role: string, examSessionId: number) => {
  if (role === "committee") {
    const [committee] = await db
      .select()
      .from(committees)
      .where(eq(committees.userId, userId));

    if (!committee) {
      return { success: false, msg: "Committee not found" };
    }

    const assignedSession = await db
      .select()
      .from(examSessionCommittees)
      .where(
        and(
          eq(examSessionCommittees.committeeId, committee.id),
          eq(examSessionCommittees.examSessionId, examSessionId)
        )
      );

    if (!assignedSession || assignedSession.length === 0) {
      return {
        success: false,
        msg: "Committee can view only the exam sessions you are assigned to",
      };
    }
  }

  const [examSession] = await db
    .select({
      sessionId: examSessions.id,
      sessionName: examSessions.sessionName,
      location: examSessions.location,
      capacity: examSessions.capacity,
      facultyId: examSessions.facultyId,
      startTime: examSessions.startTime,
      endTime: examSessions.endTime,
      breakStart: examSessions.breakStart,
      breakEnd: examSessions.breakEnd,
      subjectId: examSessions.subjectId,
    })
    .from(examSessions)
    .innerJoin(subjects, eq(subjects.id, examSessions.subjectId))
    .innerJoin(
      examSessionCommittees,
      eq(examSessionCommittees.examSessionId, examSessions.id)
    )
    .innerJoin(committees, eq(committees.id, examSessionCommittees.committeeId))
    .where(eq(examSessions.id, examSessionId));

  if (!examSession) {
    return { success: false, msg: "Exam session not found" };
  }

  let facultyData = null;
  if (examSession.subjectId === 3 && examSession.facultyId !== null) {
    [facultyData] = await db
      .select({ facultyName: faculties.facultyName })
      .from(faculties)
      .where(eq(faculties.id, examSession.facultyId));
  }

  const committeesData = await db
    .select({
      committeeId: committees.id,
      committeeName: committees.name,
    })
    .from(examSessionCommittees)
    .innerJoin(committees, eq(committees.id, examSessionCommittees.committeeId))
    .where(eq(examSessionCommittees.examSessionId, examSessionId));

  const [subject] = await db
    .select({
      subjectId: subjects.id,
      subjectName: subjects.subjectName,
    })
    .from(subjects)
    .where(eq(subjects.id, examSession.subjectId));

  const applicationsData = await db
    .select({
      applicationId: applications.id,
      applicantName: sql<string>`COALESCE(${students.nameEn}, 'N/A')`,
      interviewSlotStart: interviewSelection.slotStart,
      interviewSlotEnd: interviewSelection.slotEnd,
    })
    .from(applications)
    .innerJoin(exams, eq(exams.appId, applications.id))
    .leftJoin(interviewSelection, eq(interviewSelection.examId, exams.id))
    .innerJoin(students, eq(students.id, applications.studentId))
    .where(eq(exams.examSessionId, examSessionId));

  return {
    success: true,
    data: {
      examSession: {
        sessionId: examSession.sessionId,
        sessionName: examSession.sessionName,
        location: examSession.location,
        capacity: examSession.capacity,
        startTime: examSession.startTime,
        endTime: examSession.endTime,
        breakStart: examSession.breakStart,
        breakEnd: examSession.breakEnd,
      },
      faculty: facultyData,
      committees: committeesData,
      subject,
      applications: applicationsData,
    },
  };
};
