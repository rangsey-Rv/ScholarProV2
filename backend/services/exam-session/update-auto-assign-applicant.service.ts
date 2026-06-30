import { db } from "@db";
import { examSessions } from "@db/schema/exam-session";
import { exams } from "@db/schema/exam";
import { interviewSelection } from "@db/schema/interview-selection";
import { applications } from "@db/schema/application";
import { eq, inArray, and } from "drizzle-orm";
import { AppError } from "@middleware/app-error";
import autoAssignApplicant from "./auto-assign-applicant.service";

type UpdateExamSessionPayload = {
  capacity?: number;
  examDate?: Date;
  startTime?: Date;
  endTime?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  [key: string]: any;
};

export default async (
  examSessionId: number,
  payload: UpdateExamSessionPayload
) => {
  return await db.transaction(async (tx) => {
    // Get current exam session BEFORE updating
    const [currentSession] = await tx
      .select()
      .from(examSessions)
      .where(eq(examSessions.id, examSessionId));

    if (!currentSession) {
      throw new AppError("Exam session not found");
    }

    // Check if any critical field changed that affects exam/interview assignments
    const criticalFieldsChanged =
      payload.capacity !== undefined ||
      payload.examDate !== undefined ||
      payload.startTime !== undefined ||
      payload.endTime !== undefined ||
      payload.breakStart !== undefined ||
      payload.breakEnd !== undefined;

    if (criticalFieldsChanged) {
      // Save values we need for re-assignment
      const batchId = currentSession.batchId;
      const subjectId = currentSession.subjectId;
      const facultyId = currentSession.facultyId ?? 0;

      //Get all exams for this session (only scheduled ones)
      const affectedExams = await tx
        .select({ id: exams.id, appId: exams.appId })
        .from(exams)
        .where(
          and(
            eq(exams.examSessionId, examSessionId),
            eq(exams.status, "scheduled")
          )
        );

      if (affectedExams.length > 0) {
        const examIds = affectedExams.map((e) => e.id);
        const appIds = affectedExams.map((e) => e.appId);

        // Delete interview slots if this is an interview subject
        if (subjectId === 3) {
           const deletedRows = await tx
             .delete(interviewSelection)
             .where(inArray(interviewSelection.examId, examIds))
        }
        
        //Delete all exams
        await tx.delete(exams).where(inArray(exams.id, examIds));

        //Reset assignment flags based on subject
        let updateField: any;

        if (subjectId === 1) {
          updateField = { isMathAssigned: false };
        } else if (subjectId === 2) {
          updateField = { isEnglishAssigned: false };
        } else if (subjectId === 3) {
          updateField = { isInterviewAssigned: false };
        }

        // Reset flags for affected applications
        await tx
          .update(applications)
          .set(updateField)
          .where(inArray(applications.id, appIds));
      }

      //move this to util
      let calculatedCapacity = payload.capacity || 0;

      if (
        payload.subjectId === 3 &&
        payload.breakStart &&
        payload.breakEnd &&
        payload.startTime &&
        payload.endTime
      ) {
        const totalWorkMinutes =
          (payload.endTime.getTime() - payload.startTime.getTime()) / 60000 -
          (payload.breakEnd.getTime() - payload.breakStart.getTime()) / 60000;

        calculatedCapacity = totalWorkMinutes / 15;

        const breakCount = Math.floor(calculatedCapacity / 6);
        const extraBreakMinutes = breakCount * 10;

        const freeMinutes = totalWorkMinutes - extraBreakMinutes;

        calculatedCapacity = Math.floor(freeMinutes / 15);
      }
      // Update exam session with new values
      await tx
        .update(examSessions)
        .set(payload)
        .where(eq(examSessions.id, examSessionId));

      // Reassign applicants using the existing auto-assign function
      const newCapacity =calculatedCapacity?? payload.capacity ;
      const newStartTime = payload.startTime ?? currentSession.startTime;
      const newEndTime = payload.endTime ?? currentSession.endTime;
      const newBreakStart =
        payload.breakStart ?? currentSession.breakStart ?? new Date(0);
      const newBreakEnd =
        payload.breakEnd ?? currentSession.breakEnd ?? new Date(0);
      const assignResult = await autoAssignApplicant(
        batchId,
        subjectId,
        facultyId,
        examSessionId,
        newCapacity,
        newStartTime,
        newEndTime,
        newBreakStart,
        newBreakEnd,
        tx
      );

      return {
        success: true,
        msg: "Exam session updated and applicants re-assigned successfully",
        assignedCount: assignResult.assignedCount,
      };
    } else {
      const [updatedSession] = await tx
        .update(examSessions)
        .set(payload)
        .where(eq(examSessions.id, examSessionId))
        .returning();

      return {
        success: true,
        msg: "Exam session updated successfully",
        data: updatedSession,
      };
    }
  });
};
